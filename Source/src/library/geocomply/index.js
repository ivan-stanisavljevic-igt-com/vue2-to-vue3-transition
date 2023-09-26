import axios from 'axios'
import store from '@/store'
import config from '@/config'
import moment from 'moment'
import method from './methods'

var geoLicenseTimer
var checkGeoLocationRequestTimer
var checkGeoLocationRequestArray = []
var checkGeoLocationBoolean
var checkGeoLocationTime
var locationMessageKey
var locationMessage
var locationState
var checkGeoLocationTimeDefault
var checkGeoLocationTimeCount
var storeGeoLocationRequestArray = []
var passedGeoLoction
var storeGeoLocationCount
var inGameGeoLocation = true
var userLicense
var storeIsGeolocated
var timerCheck
var errorMsgCode = [615, 612, 602, 604, 605]
var availableInstances = ['wv', 'pa', 'ca']
var logInitArray = []
var logIntervalArray = []
var logErrorArray = []
var externalURL = config.externalUrls.geocomplyURL
var siteInstance = (window.ctsautoconf.HARDGEOLOCATION) ? window.ctsautoconf.STATE.toLowerCase() : ''
var stateLicense = (window.ctsautoconf.HARDGEOLOCATION) ? window.ctsautoconf.STATE : ''
var FDstateInstance = window.ctsautoconf.STATE
var locationSuccess = false

function geoComplyService (userID, reason = 'Login') {
  if (typeof localStorage !== 'undefined') {
    if (localStorage.getItem('geoError')) {
      localStorage.setItem('geoError', false)
    }
  }
  logInitArray = []
  checkGeoLocationTimeCount = 0
  checkGeoLocationTimeDefault = 3000
  checkGeoLocationTime = 0
  checkGeoLocationRequestTimer = 0
  storeGeoLocationCount = 0
  if (window.GeoComply.Client.isConnected()) {
    window.GeoComply.Client.disconnect()
    window.GeoComply.Client.off('connect').off('error').off('location').off('log')
  }
  logInitArray.push({ 'user_id': userID, 'gelocation_reason': reason, 'state': siteInstance })
  window.GeoComply.Client.connect(environment().id, environment().env)
  window.GeoComply.Client.on('connect', () => {
    if (!JSON.parse(store.getters['getGeolocated'])) {
      var errorCode = 'verify'
      store.commit('overlayState/setGeolocationMessage', { errorCode })
    }
    if (window.GeoComply.Client.isConnected()) {
      logInitArray.push({ 'geocomply_connected': window.GeoComply.Client.isConnected() })
      window.GeoComply.Client.setLicense('')
      if (typeof localStorage !== 'undefined') {
        userLicense = ('userLicense' + stateLicense in localStorage) ? localStorage.getItem('userLicense' + stateLicense) : localStorage.setItem('userLicense' + stateLicense, undefined)
        storeIsGeolocated = ('gcPerm' in localStorage) ? localStorage.getItem('gcPerm') : localStorage.setItem('gcPerm', false)
        store.commit('setGeolocated', storeIsGeolocated)
        if (userLicense === 'undefined' || userLicense === undefined) {
          getGeoLicense()
          checkGeoLocationRequest(userID, reason)
        } else if (userLicense !== undefined) {
          logInitArray.push({ 'local_storage_license': localStorage.getItem('userLicense' + stateLicense) })
          window.GeoComply.Client.setLicense(localStorage.getItem('userLicense' + stateLicense))
          checkGeoLocationRequest(userID, reason)
          console.log('GeoComply log')
          console.log(logInitArray)
        }
      } else {
        getGeoLicense()
        checkGeoLocationRequest(userID, reason)
      }
    }
  }).on('error', (errorCode, errorMessage) => {
    GeoComplyErrorHandler(errorCode, errorMessage, userID, reason)
  }).on('geolocation', (data) => {
    let dataEncoded = encodeURIComponent(data)
    axios.post(externalURL + 'geocomply/service/submit/', 'geoLocationData=' + dataEncoded + '&count=' + storeGeoLocationCount + '&ingame=' + inGameGeoLocation + '&region=' + siteInstance, {
      headers: {
        Accept: '*/*',
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
      .then((response) => {
        storeGeoLocationRequestArray = response.data.split(',')
        passedGeoLoction = storeGeoLocationRequestArray[0]
        checkGeoLocationTime = parseInt(storeGeoLocationRequestArray[1])
        locationMessageKey = storeGeoLocationRequestArray[2]
        locationMessage = decodeURIComponent(storeGeoLocationRequestArray[3])
        locationState = decodeURIComponent(storeGeoLocationRequestArray[4])
        if (checkGeoLocationTime !== 0 && inGameGeoLocation) {
          localStorage.removeItem('tgc')
          let lcData = { 'date': moment(), 'cf': checkGeoLocationTime }
          localStorage.setItem('tgc', JSON.stringify(lcData))
          timerCheck = JSON.parse(localStorage.getItem('tgc')).cf
          console.log('timerCheck')
          console.log(timerCheck)
          clearTimeout(checkGeoLocationRequestTimer)
          checkGeoLocationRequestTimer = null

          checkGeoLocationRequestTimer = setTimeout(() => {
            checkGeoLocationRequest(userID, 'Periodic')
          }, checkGeoLocationTime)
          localStorage.setItem('gcPerm', true)
          store.commit('setGeolocated', true)
          localStorage.setItem('geoError', false)
          store.commit('overlayState/setGeolocationMessage', {})
        }
        if (passedGeoLoction === 'false') {
          clearTimeout(checkGeoLocationRequestTimer)
          checkGeoLocationRequestTimer = null
          localStorage.setItem('gcPerm', false)
          store.commit('setGeolocated', false)
          if (window.ctsautoconf.HARDGEOLOCATION) {
            if ((siteInstance === 'wv' && siteInstance !== locationState)) { // Instance is WV but response location is not WV, redirect to NJ website as default
              hardRedirect('hardGeolocationRedirect', locationSuccess, 'nj')
            } else if (siteInstance === 'nj' && (availableInstances.includes(locationState))) {
              hardRedirect('hardGeolocationRedirect', true, locationState)
            } else {
              let errorCode = 999
              let errorMessage = locationMessage
              localStorage.setItem('geoError', errorCode)
              store.commit('overlayState/setGeolocationMessage', { errorCode, errorMessage })
              store.dispatch('overlayState/activeGeolocationDialog')
              geocomplyClientDisconnect()
            }
          } else {
            let errorCode = 999
            let errorMessage = locationMessage
            localStorage.setItem('geoError', errorCode)
            store.commit('overlayState/setGeolocationMessage', { errorCode, errorMessage })
            store.dispatch('overlayState/activeGeolocationDialog')
            geocomplyClientDisconnect()
          }
        }
        storeGeoLocationCount++
        logIntervalArray.push({
          'submit': {
            'response.data': response.data,
            'setGeolocated': store.getters['getGeolocated'],
            'passedGeoLoction': passedGeoLoction,
            'Next submit in': millisToMinutesAndSeconds(checkGeoLocationTime),
            'location Message Key': locationMessageKey,
            'location Message': locationMessage,
            'location State': locationState,
            'GeoLocationCount': storeGeoLocationCount
          }
        })
        console.log('GeoComply Interval log: ' + storeGeoLocationCount)
        console.log(logIntervalArray)
      })
      .catch((error) => {
        console.log(error)
      })
  }).on('log', (log) => {
    console.log(log)
  })

  function checkGeoLocationRequest (userID, reason) {
    clearTimeout(checkGeoLocationRequestTimer)
    checkGeoLocationRequestTimer = null
    axios.post(externalURL + 'geocomply/service/check/', 'key=' + userID + '&region=' + siteInstance, {
      headers: {
        Accept: '*/*',
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
      .then((response) => {
        logIntervalArray = []
        checkGeoLocationRequestArray = response.data.split(',')
        checkGeoLocationBoolean = checkGeoLocationRequestArray[0]
        checkGeoLocationTime = parseInt(checkGeoLocationRequestArray[1])
        if (checkGeoLocationTime === 0) {
          checkGeoLocationTime = checkGeoLocationTimeDefault
          if (checkGeoLocationTimeCount > 5) {
            clearTimeout(checkGeoLocationRequestTimer)
          }
          checkGeoLocationTimeCount++
        }

        if (checkGeoLocationBoolean === 'true') {
          triggerGeoLocation(userID, reason)
        } else {
          checkGeoLocationRequestTimer = setTimeout(() => {
            checkGeoLocationRequest(userID, reason)
          }, checkGeoLocationTime)
        }
        logIntervalArray.push({ 'service_check': { 'need_a_check': checkGeoLocationBoolean, 'Next_check_in': millisToMinutesAndSeconds(checkGeoLocationTime), 'reason': reason } })
      })
      .catch((error) => {
        console.log(error)
      })
  }

  function GeoComplyErrorHandler (errorCode, errorMessage, userID, reason) {
    logErrorArray = []
    logErrorArray.push({ 'errors': { 'error_code': errorCode, 'error_msg': errorMessage } })
    console.log('GeoComply - error log')
    console.log(logErrorArray)
    var isCode = errorMsgCode.includes(errorCode)
    if (isCode) {
      errorCode = parseInt(errorCode)
      store.commit('setGeolocated', false)
      localStorage.setItem('gcPerm', false)
      if (errorMsgCode.includes(612)) {
        localStorage.setItem('geoError', 612)
      }
      store.commit('overlayState/setGeolocationMessage', { errorCode, errorMessage, userID })
      store.dispatch('overlayState/activeGeolocationDialog')
      turnOffEvents()
    }
    switch (parseInt(errorCode)) {
      case window.GeoComply.Client.CLNT_ERROR_LOCAL_SERVICE_COMMUNICATION:
        console.log('Communication with PLC (local service) failed. The possible cause of this is that either some invalid data was sent to PLC or some problems with parsing data from PLC')
        break
      case window.GeoComply.Client.CLNT_ERROR_WRONG_OR_MISSING_PARAMETER:
        console.log('parameters are missing or provided with wrong values')
        break
      case window.GeoComply.Client.CLNT_ERROR_INVALID_LICENSE_FORMAT:
      case window.GeoComply.Client.CLNT_ERROR_LICENSE_EXPIRED:
        console.log(' License expired, request new license')
        forceGeoLicenseRefreshAndTriggerGeoLocation(userID, reason)
        break
      case window.GeoComply.Client.CLNT_ERROR_SERVER_COMMUNICATION:
        console.log('The server communication failed')
        break
      case window.GeoComply.Client.CLNT_ERROR_UNEXPECTED:
        store.commit('setGeolocated', false)
        localStorage.setItem('gcPerm', false)
        console.log('Unexpected error occurs.')
        break
      case window.GeoComply.Client.CLNT_ERROR_NOT_CERTIFIED_BINARIES:
        console.log('Signature verification of PLC support binaries fails. That means the binaries tampered.')
        break
      case window.GeoComply.Client.CLNT_ERROR_CLIENT_LICENSE_UNAUTHORIZED:
        console.log('Operator’s license not authorized by GeoComply server.')
        break
      case window.GeoComply.Client.CLNT_ERROR_INVALID_CUSTOM_FIELDS:
        console.log('Invalid list of custom fields provided to SDK. This can be because of mandatory custom field is absent in the list, or format of custom field value is invalid.')
        break
      default:
        store.commit('setGeolocated', false)
        localStorage.setItem('gcPerm', false)
        console.log('Code: ' + errorCode + ' msg: ' + errorMessage)
    }
  }
  function getGeoLicense () {
    axios.post(externalURL + 'geocomply/service/license/', 'region=' + siteInstance, {
      headers: {
        Accept: '*/*',
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
      .then((response) => {
        window.GeoComply.Client.setLicense(response.data)
        localStorage.setItem('userLicense' + stateLicense, response.data)
        logInitArray.push({ 'new_license': response.data })
        console.log('GeoComply log')
        console.log(logInitArray)
        if (response.data != null) {
          clearTimeout(geoLicenseTimer)
          geoLicenseTimer = null
        }
      })
      .catch((error) => {
        console.log(error)
      })
  }
  function triggerGeoLocation (userID, reason) {
    window.GeoComply.Client.setUserId(userID)
    window.GeoComply.Client.setGeolocationReason('Desktop: Sports/' + reason)
    window.GeoComply.Client.requestGeolocation()
  }
  function forceGeoLicenseRefreshAndTriggerGeoLocation (userID, reason) {
    axios.post(externalURL + 'geocomply/service/newlicense/', 'region=' + siteInstance, {
      headers: {
        Accept: '*/*',
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
      .then((response) => {
        logInitArray.push({ 'forced_new_license': response.data })
        console.log('GeoComply log')
        console.log(logInitArray)
        window.GeoComply.Client.setLicense(response.data)
        localStorage.setItem('userLicense' + stateLicense, response.data)
        if (response.data != null) {
          clearTimeout(geoLicenseTimer)
          geoLicenseTimer = null
          triggerGeoLocation(userID, reason)
        }
      })
      .catch((error) => {
        console.log(error)
      })
  }
}

function geocomplyClientDisconnect () {
  store.commit('setGeolocated', false)
  localStorage.setItem('gcPerm', false)
  turnOffEvents()
  window.GeoComply.Client.disconnect()
  setTimeout(() => {
    console.log('GeoComply Client connected: ' + window.GeoComply.Client.isConnected())
  }, 1000)
}
function turnOffEvents () {
  window.GeoComply.Client.off('connect').off('geolocation').off('error').off('log')
}
function environment () {
  var gcData = {}
  if (process.env.NODE_ENV === 'development') {
    gcData = { env: 'staging', id: 'LW2BYMiQ3R' }
    return gcData
  } else if (process.env.NODE_ENV === 'production') {
    gcData = { env: 'production', id: 'LW2BYMiQ3R' }
    return gcData
  } else {
    gcData = { env: 'staging', id: 'LW2BYMiQ3R' }
    return gcData
  }
}
function millisToMinutesAndSeconds (millis) {
  var minutes = Math.floor(millis / 60000)
  var seconds = ((millis % 60000) / 1000).toFixed(0)
  return minutes + ':' + (seconds < 10 ? '0' : '') + seconds
}
function hardRedirect (errorCode, locationSuccess, redirectTo) {
  redirectTo = redirectTo.toUpperCase()
  let params = { locationSuccess, redirectTo }
  geocomplyClientDisconnect()
  store.commit('overlayState/setGeolocationMessage', { errorCode, params })
  store.dispatch('overlayState/activeGeolocationDialog')
}

function geoComplyMockupService (validGeolocation) {
  console.info(' ----- MOCKUP GAN GEOCOMPLY -----')
  new Promise((resolve, reject) => {
    var errorCode = 'verify'
    store.commit('overlayState/setGeolocationMessage', { errorCode })
    setTimeout(() => validGeolocation ? resolve(validGeolocation) : reject(validGeolocation), 5000)
  }).then(() => {
    store.commit('overlayState/setGeolocationMessage', {})
    localStorage.setItem('gcPerm', true)
    store.commit('setGeolocated', true)
    localStorage.setItem('geoError', false)
    store.commit('overlayState/setGeolocationMessage', {})
  }, () => {
    store.commit('overlayState/setGeolocationMessage', {})
    localStorage.setItem('gcPerm', false)
    store.commit('setGeolocated', false)
    let errorCode = 999
    let errorMessage = ''
    localStorage.setItem('geoError', errorCode)
    store.commit('overlayState/setGeolocationMessage', { errorCode, errorMessage })
    store.dispatch('overlayState/activeGeolocationDialog')
  }
  )
}

/*  wallet modules */
function geoComplyServiceModules (user, sessionId, reason = 'Login') {
  method.resetGeoError()
  method.geoComplyDisconnectService()
  method.connectGeoComplyService()
  logInitArray.push({ 'user_id': user, 'gelocation_reason': reason, 'state': FDstateInstance })
  window.GeoComply.Client.on('connect', () => {
    console.log('GC Connected - FD wallet')
    if (reason === 'Login' || reason === 'Retry') {
      method.showSpinnerOnStart()
    }
    if (reason === 'Login') {
      localStorage.geolocationOnLogin = true
    }
    logInitArray.push({ 'geocomply_connected': window.GeoComply.Client.isConnected() })
    window.GeoComply.Client.setLicense('')
    if (typeof localStorage !== 'undefined') {
      userLicense = ('userLicense' + FDstateInstance in localStorage) ? localStorage.getItem('userLicense' + FDstateInstance) : localStorage.setItem('userLicense' + FDstateInstance, undefined)
      storeIsGeolocated = ('gcPerm' in localStorage) ? localStorage.getItem('gcPerm') : localStorage.setItem('gcPerm', false)
      store.commit('setGeolocated', storeIsGeolocated)
      if (userLicense === 'undefined' || userLicense === undefined) {
        method.getGeoLicense(user, sessionId, reason)
      } else if (userLicense !== undefined) {
        console.log('LICENSE FROM localeStorage')
        console.log(JSON.parse(userLicense).License)
        window.GeoComply.Client.setLicense(JSON.parse(userLicense).License)
        method.validateLicense(user, sessionId, reason)
      }
    } else {
      method.getGeoLicense(user, sessionId, reason)
    }
  }).on('error', (errorCode, errorMessage) => {
    console.log('---- GC SERVICE ERROR ----')
    method.errorHandler(errorCode, errorMessage, user, reason)
  }).on('geolocation', (data) => {
    console.log('--- geoPacket ----')
    console.log(data)
    method.geocomplySubmit(data, user)
  }).on('log', (log) => {
    console.log(log)
  })
  console.log('logInitArray')
  console.log(logInitArray)
}
export default {
  methods: {},
  computed: {},
  components: {},
  watch: {},
  method,
  geoComplyService,
  geoComplyServiceModules,
  geocomplyClientDisconnect,
  geoComplyMockupService
}
