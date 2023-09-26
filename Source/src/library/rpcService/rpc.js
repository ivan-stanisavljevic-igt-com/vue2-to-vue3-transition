import axios from 'axios'
import config from '@/config'
import store from '@/store'

export default {
  call,
  config
}

var counter = 0
var requestsQueue = []
var pendingRequests = {}
var url = config.app.autoconf.WEB_SERVER_HOSTNAME + '/CallBroker.ashx'
var noRegion = {
  ConfirmBetSlipUsingConfirmations: 1,
  RegisterCustomer: 1
}

function Deferred () {
  // update 062115 for typeof
  if (typeof Promise !== 'undefined' && Promise.defer) {
    // need import of Promise.jsm for example: Cu.import('resource:/gree/modules/Promise.jsm');
    return Promise.defer()
  } else {
    /* A method to resolve the associated Promise with the value passed.
     * If the promise is already settled it does nothing.
     *
     * @param {anything} value : This value is used to resolve the promise
     * If the value is a Promise then the associated promise assumes the state
     * of Promise passed as value.
     */
    this.resolve = null

    /* A method to reject the assocaited Promise with the value passed.
     * If the promise is already settled it does nothing.
     *
     * @param {anything} reason: The reason for the rejection of the Promise.
     * Generally its an Error object. If however a Promise is passed, then the Promise
     * itself will be the reason for rejection no matter the state of the Promise.
     */
    this.reject = null

    /* A newly created Pomise object.
     * Initially in pending state.
     */
    this.promise = new Promise(function (resolve, reject) {
      this.resolve = resolve
      this.reject = reject
    }.bind(this))
    Object.freeze(this)
  }
}

let doLogOut = (retain) => {
  if (store.getters['isLoggedIn']) {
    store.dispatch('logout', retain)
  }
}

function call (serviceName, methodName, args) {
  counter++
  // console.log('callBroker counter: ' + counter)

  var deferred
  var soloRequest = false
  if (args !== null) {
    args = args || {}
    if (!noRegion[methodName]) {
      args.IDMDRegion = config.app.region
    }

    if (args.IDMDRegion === 'ignore') {
      delete args.IDMDRegion
    } else if (typeof args.IDMDRegion === 'undefined') {
      args.IDMDRegion = config.app.region
    }
    if (args.IDMDLanguage === 'ignore') {
      delete args.IDMDLanguage
    } else if (typeof args.IDMDLanguage === 'undefined') {
      args.IDMDLanguage = config.app.language
    }

    // args.IDMDLanguage = config.app.language
    /*
    if (args.IDDCLanguage) {
      args.IDDCLanguage = config.app.language
    }
    */
    //
    /*
    soloRequest = args.soloRequest
    delete args.soloRequest
    counter = args.cnt || counter
    delete args.cnt
    */
  } else {
    args = { }
  }
  // if (soloRequest) {
  //   console.log('callBroker: ' + serviceName + ': ' + methodName + '; counter: ' + counter + '; soloRequest: ' + soloRequest + '; ts: ' + new Date().getTime())
  // }

  var data = {
    'serviceName': serviceName,
    'methodName': methodName,
    'arguments': args
  }

  var pload = JSON.stringify(data)
  var matchingRequest = requestsQueue.filter(function (request) {
    return request.payload === pload
  })[0]
  if (soloRequest) {
    matchingRequest = pendingRequests[soloRequest] && pendingRequests[soloRequest].payload === pload && pendingRequests[soloRequest].request
  }

  var sendRequest = function (requests, cancelToken) {
    requests = requests || requestsQueue
    var payload = requests.map(function (request) {
      return {
        serviceName: request.data.serviceName,
        methodName: request.data.methodName,
        arguments: request.data.arguments
      }
    })
    if (!soloRequest) {
      requestsQueue = []
    }
    //
    axios({
      method: 'post',
      url: url,
      data: payload,
      withCredentials: true,
      cancelToken: cancelToken && cancelToken.token,
      transformResponse: [function (data) {
        // Do whatever you want to transform the data
        return data && JSON.parse(data.replace(/\\>/g, '>').replace(/\\'/g, '\''))
      }]
    })
      .then(function (rpcResult) {
        if (rpcResult.data) {
          // if (typeof rpcResult.data === 'string') {
          //   rpcResult.data = JSON.parse(rpcResult.data.replace(/\\>/g, '>').replace(/\\'/g, '\''))
          // }
          rpcResult.data.forEach(function (response, index) {
            var request = requests[index]
            if (request.soloRequest) {
              // console.log('REMOVE from pending: ' + request.soloRequest + '; ' + request.counter)
              delete pendingRequests[request.soloRequest]
            }
            // response.request = request.data.arguments
            if (response.exceptionType) {
              if (response.exceptionType === 'Com.Finsoft.Warp.Connecticut.SessionTimeoutException') {
                console.log('Callbroker exception: ' + response.exceptionType)
                doLogOut(true)
              }
              if (response.exceptionType === 'Com.Finsoft.Warp.Connecticut.Services.UserNotLoggedInException' ||
                response.exceptionType.indexOf('System.ServiceModel.FaultException') > -1) {
                console.log('Callbroker exception: ' + response.exceptionType)
              }
              if (response && response.message && response.message.includes('ORA-')) {
                response.message = response.message.split(': ')[1]
              }
              return request.deferred.reject(response)
            } else {
              return request.deferred.resolve(response)
            }
          })
        }
      })
      .catch(function (error) {
        console.log(error)
        //
        // if (requests[0].soloRequest) {
        //   console.log('REMOVE (on error) from pending: ' + requests[0].soloRequest + '; ' + requests[0].counter)
        //   delete pendingRequests[requests[0].soloRequest]
        // }
        //
        deferred.reject(error)
      })
  }

  if (!requestsQueue.length) {
    /*
     clearTimeout(timeoutCB)
     timeoutCB = setTimeout(function () {
     */
    setTimeout(function () {
      if (requestsQueue.length) {
        sendRequest()
      }
    }, 0)
  }

  if (matchingRequest) {
    // if (soloRequest) {
    //   console.log('matchingRequest ' + counter)
    // }
    deferred = matchingRequest.deferred
  } else {
    // if (soloRequest) {
    //   console.log('NON-matchingRequest ' + counter)
    // }
    deferred = new Deferred()

    var rq = {
      data: data,
      counter: counter,
      payload: pload,
      deferred: deferred,
      soloRequest: soloRequest
    }
    if (soloRequest) {
      if (pendingRequests[soloRequest] && pendingRequests[soloRequest].cancelToken) {
        pendingRequests[soloRequest].cancelToken.cancel('Aborted as obsolete: ' + soloRequest + ' - ' + pendingRequests[soloRequest].request.counter + '; ts: ' + new Date().getTime())
        delete pendingRequests[soloRequest]
      }
      // else {
      const cancelTokenSource = axios.CancelToken.source()
      // console.log('ADD to pending: ' + soloRequest + '; ' + rq.counter)
      pendingRequests[soloRequest] = {
        cancelToken: cancelTokenSource,
        payload: pload,
        request: rq
      }
      sendRequest([rq], cancelTokenSource)
      // }
    } else {
      requestsQueue.push(rq)
    }
  }

  return deferred.promise
}
