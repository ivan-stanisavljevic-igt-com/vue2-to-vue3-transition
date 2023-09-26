import store from '@/store'
import lib from '@/library'
import guid from '@/library/guid'
import config from '@/config'
import lodash from 'lodash'
import mobileBridge from '@/library/mobileBridge'
import axios from 'axios'
import router from '@/router'
import api from '../api'

export default {
  createAuthorizationHeader,
  createGUIDHeader,
  createAxiosConfig,
  updateSessionDetails,
  isLoggedIn,
  storeTokens,
  clearTokens,
  modifyResponse,
  modifyErrorResponse,
  getToken,
  axiosTransformRequestHandler,
  getApiEndpointUrl,
  checkMaintenance,
  stopTokenTImer,
  refreshTokenIfExpired,
  createDeviceInfoHeader,
  appNotAllowed
}
var initTokenTimer = null // in case of inactivity logout
var initTokenNotifier = null // in case of inactivity notify user to extend session
var tokenTimerState = false
// returns Url to the REST API endpoint for a given serviceName (controller) and methodName (action)
function getApiEndpointUrl (serviceName, methodName) {
  var apiVersion = config.app.autoconf.TRANSACTION_SERVER_API_VERSION
  var url = lib.core.url.joinSegments([
    config.app.autoconf.WEB_SERVER_HOSTNAME,
    'api',
    apiVersion,
    serviceName,
    methodName
  ])
  return url
}

function createAxiosConfig (serviceName, methodName) {
  let serverHostname = config.app.autoconf.WEB_SERVER_HOSTNAME
  let apiVersion = config.app.autoconf.TRANSACTION_SERVER_API_VERSION
  let api = 'api'
  //
  if (serviceName && methodName && ['xpbetting'].includes(serviceName.toLowerCase()) && methodName.toLowerCase().indexOf('get') === 0) {
    serverHostname = config.app.autoconf.BETCALC_SERVER_HOSTNAME || serverHostname
    apiVersion = config.app.autoconf.BETCALC_SERVER_API_VERSION || apiVersion
    api = config.app.autoconf.BETCALC_SERVER_API_NAME || api
  }
  //
  var url = lib.core.url.joinSegments([
    serverHostname,
    api,
    apiVersion,
    serviceName,
    methodName
  ])

  return {
    url: url,
    method: 'get',
    responseType: 'json',
    params: {},
    data: {},
    headers: {}
  }
}

function createAuthorizationHeader (token) {
  return token ? { Authorization: 'Bearer ' + token } : {}
}

function createGUIDHeader () {
  let header = {}

  header['IGT-Client-Session'] = guid.getClientGuid()
  header['Igt-Browse-Id'] = guid.getClientTabGuid()

  return header
}

function createDeviceInfoHeader () {
  let result = {}
  if (!window.ctsautoconf.MOBILE_LS) {
    let userAgent = lib.core.userAgent
    let navigator = window.navigator
    result['IGT-CDI'] = JSON.stringify(
      {
        'OS': userAgent.os.name || null,
        'DeviceId': createGUIDHeader()['IGT-Client-Session'],
        'Version': userAgent.os.versionAsString || null,
        'Platform': navigator.platform || null,
        'Flags': 0,
        'Application': buildVersion.name,
        'Host': userAgent.browser.name || null,
        'MobileAppVersion': '*',
        'Protected': 0
      }
    )
    return result
  }
  if ((getMobileDeviceInfo && getMobileDeviceInfo.data) && window.ctsautoconf.MOBILE_LS) {
    let bitwiseMap = 8 | 32 // 8: any biometrics
    result['IGT-CDI'] = JSON.stringify(
      {
        'OS': getMobileDeviceInfo.data['platform'] || null,
        'DeviceId': getMobileDeviceInfo.data['device_id'] || null,
        'Version': getMobileDeviceInfo.data['sdk_version'] || null,
        'Platform': getMobileDeviceInfo.data['model'] || null,
        'Flags': parseInt((bitwiseMap).toString(2)),
        'Application': getMobileDeviceInfo.data['bundle_version'] || null,
        'Host': getMobileDeviceInfo.data['version_name'] || null,
        'MobileAppVersion': getMobileDeviceInfo.data['version_name'] || null,
        'Protected': 0
      }
    )
    return result
  }
}

function getToken (type) {
  var token = ''
  var storage = localStorage

  if (type && storage) {
    switch (type) {
      case 'access':
        token = storage['ath_acs'] || ''
        break
      case 'refresh':
        token = storage['ath_rsh'] || ''
        break
      default:
        token = ''
    }
  }

  return token
}

function storeTokens (response) {
  var storage = localStorage
  var data = response.data

  if (storage && data && data.AccessToken && data.RefreshToken) {
    tokenTimerState = true
    storage['ath_acs'] = data.AccessToken || ''
    storage['ath_acsexp'] = data.AccessTokenExpirationUTC || ''
    storage['ath_rsh'] = data.RefreshToken || ''
    storage['ath_rshexp'] = data.RefreshTokenExpirationUTC || ''
    let currentDate = new Date().getTime()
    let tokenExpiration = new Date(data.AccessTokenExpirationUTC).getTime()
    let dateFDifference = tokenExpiration - currentDate
    startTokenTImer(dateFDifference)
    if (window.ctsautoconf.MOBILE_LS) {
      mobileBridge.bridgeSendRequest('sessionTokens', {'AccessTokenExpirationUTC': data.AccessTokenExpirationUTC})
    }
  } else if (localStorage.ath_acsexp && localStorage.ath_acs && (data && !data.AccessToken) && !tokenTimerState) {
    tokenTimerState = true
    let tokenExpiration = new Date(localStorage.ath_acsexp).getTime()
    let currentDate = new Date().getTime()
    let dateFDifference = tokenExpiration - currentDate
    startTokenTImer(dateFDifference)
  }
}

function clearTokens () {
  var storage = localStorage

  if (storage) {
    storage['ath_acs'] = ''
    storage['ath_acsexp'] = ''
    storage['ath_rsh'] = ''
    storage['ath_rshexp'] = ''
  }
  stopTokenTImer()
}

function isLoggedIn () {
  return store.getters['isLoggedIn']
}
const buildVersion = {
  get number () {
    return window.ctsautoconf.BUILD_VERSION || null
  }
}
const getMobileDeviceInfo = {
  get data () {
    return store.getters['getMobileDeviceInfo']
  }
}
function updateSessionDetails (details) {
  let sessionDetails = store.getters['getSessionDetails']

  if (sessionDetails && details) {
    sessionDetails = Object.assign({}, sessionDetails, details)

    store.commit('setSessionDetails', sessionDetails)
  }
}

function modifyResponse (response) {
  var data = {}

  data.result = response.data
  data.headers = response.headers

  return data
}

function modifyErrorResponse (err, requestConfig) {
  var error = {}

  if (err && err.response && err.response.data) {
    let temp = err.response.data

    for (var property in temp) {
      if (temp.hasOwnProperty(property)) {
        error[lodash.camelCase(property)] = temp[property]
      }
    }
  } else {
    error = err
  }

  error.result = null
  if (window.ctsautoconf.MOBILE_LS) {
    if (err.response) {
      mobileBridge.errorLogger(err.response, requestConfig)
    } else {
      mobileBridge.errorLogger(err.message || 'Ooops, an error had occured', requestConfig, false)
    }
  }
  return error
}

function axiosTransformRequestHandler (params, headers) {
  headers['Content-Type'] = 'application/json;charset=UTF-8'
  return JSON.stringify(params)
}

function stopTokenTImer () {
  let sessionInterval = window.ctsautoconf.sessionExpirationInterval
  clearTimeout(initTokenTimer)
  if (sessionInterval) {
    clearTimeout(initTokenNotifier)
  }
}

function startTokenTImer (time) {
  tokenTimerState = true
  let sessionInterval = window.ctsautoconf.sessionExpirationInterval
  let notifyBeforeEnds = time - sessionInterval
  stopTokenTImer()
  if (sessionInterval && sessionInterval > 0) {
    initTokenNotifier = setTimeout(() => {
      store.commit('overlayState/setMessageDialogMsg', {reason: 'session-notifier', persistent: true, fullscreen: false, maxWidth: 320, data: {counter: time - notifyBeforeEnds}})
      store.dispatch('overlayState/activateMessageDialog')
      initTokenTimer = setTimeout(() => {
        setSessionExpiredLogout()
      }, time - notifyBeforeEnds)
    }, notifyBeforeEnds)
  } else {
    initTokenTimer = setTimeout(() => {
      setSessionExpiredLogout()
    }, time)
  }
}

function setSessionExpiredLogout () {
  store.dispatch('overlayState/deactivateMessageDialog')
  store.dispatch('overlayState/deactivateGeolocationDialog')
  store.dispatch('overlayState/deactivateSessionDialog')
  store.commit('setSessionExpired', true)
  let type = '401'
  router.push({name: 'logout', params: {type}})
}

const userAgent = {
  get os () {
    return lib.core.userAgent.os.name
  }
}

/* for mobile bundle only */
function checkMaintenance () {
  const maintenanceServer = window.ctsautoconf.WEB_SERVER_HOSTNAME + '/outage_' + userAgent.os + '.json'
  axios.get(maintenanceServer).then((response) => {
    if (response && response.data) {
      mobileBridge.bridgeSendRequest('maintenanceActive', response.data)
    } else {
      mobileBridge.bridgeSendRequest('maintenanceInactive')
    }
  }).catch((error) => {
    mobileBridge.bridgeSendRequest('maintenanceInactive')
    console.log('maintenance error', error)
  }
)
}

function refreshTokenIfExpired () {
  let currentDate = new Date().getTime()
  let accessTokenExpiration = new Date(localStorage.ath_acsexp).getTime()
  if ((localStorage.ath_acsexp && localStorage.ath_acs && localStorage.ath_rsh && localStorage.ath_rshexp) && currentDate > accessTokenExpiration) {
    let refeshTokenExpiration = new Date(localStorage.ath_rshexp).getTime()
    if (currentDate < refeshTokenExpiration) {
      store.commit('setUserActive', false)
      api.refreshToken()
      return false
    }
    tokenTimerState = false
  } else {
    store.commit('setUserActive', true)
  }
}

function appNotAllowed () {
  mobileBridge.bridgeSendRequest('mobileAppVersionIsNotAllowed')
}
