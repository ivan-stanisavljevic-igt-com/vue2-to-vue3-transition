import config from '@/config'
import rpc from './rpc'
import api from './api'

export default {
  api,
  rpc,
  callBroker,
  config
}

var mode = config.app.autoconf.TRANSACTION_SERVER_CALL_MODE

function callBroker (serviceName, methodName, args) {
  switch (mode) {
    case 'API':
      var apiServiceName = getApiServiceName(serviceName)
      var apiMethodName = getApiMethodName(methodName)
      return api.call(apiServiceName, apiMethodName, args)
    case 'RPC':
      return rpc.call(serviceName, methodName, args)
  }
}

function getApiServiceName (serviceName) {
  var rpcToApiServiceNameMap = {
    'toteservice': 'tote',
    'fixedoddsbettingservice': 'fixedoddsbetting',
    'userservice': 'user',
    'externalwalletservice': 'ganwallet',
    'fanduelwalletservice': 'fanduelwallet',
    'sharedwalletservice': 'sharedwallet',
    'accountservice': 'account',
    'geolocationservice': 'geolocation',
    'xpbettingservice': 'xpbetting',
    'playspotservice': 'playshot',
    'utilityservice': 'utility',
    'livetrackerservice': 'livetracker',
    'eventstreamingservice': 'eventstreaming',
    'buybackservice': 'buyback',
    'gamingnotificationservice': 'gns',
    'geocomplyservice': 'geocomply',
    'businessunitservice': 'businessunit',
    'psregistrationservice': 'iw',
    'iwservice': 'iw'
  }
  var result = serviceName
  var serviceNameLowerCase = serviceName.toLowerCase()

  if (rpcToApiServiceNameMap.hasOwnProperty(serviceNameLowerCase)) {
    result = rpcToApiServiceNameMap[serviceNameLowerCase]
  }

  return result
}

function getApiMethodName (methodName) {
  var result = ''

  if (methodName) {
    result = methodName.toLowerCase()
  }

  return result
}
