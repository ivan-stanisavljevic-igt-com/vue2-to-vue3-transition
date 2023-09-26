import axios from 'axios'
import store from '@/store'
import guid from '@/library/guid'
import config from '@/config'
import api from './api/'
import router from '@/router'

export default {
  call,
  attachParams,
  // refreshTokenPromise,
  refreshToken,
  helpers: api.helpers
}

var autoRefreshToken = config.app.autoconf.TRANSACTION_SERVER_API_AUTO_REFRESH_TOKEN
var refreshTokenInProgress = false
var refreshTokenPromise = null

guid.init()

function call (serviceName, methodName, params) {
  var axiosConfig = api.helpers.createAxiosConfig(serviceName, methodName)

  attachAuthToken(axiosConfig)
  attachGUID(axiosConfig)
  attachDeviceInfo(axiosConfig)
  overrideRequest(serviceName, methodName, axiosConfig)
  attachParams(axiosConfig, params)

  if (axiosConfig.refreshToken) {
    return refreshToken()
  }

  if (refreshTokenInProgress) {
    return callAfterRefreshToken(axiosConfig)
  }

  return sendRequest(axiosConfig)
}

function overrideRequest (serviceName, methodName, axiosConfig) {
  if (api.services[serviceName]) api.services[serviceName].overrideRequest(axiosConfig)
  if (api.services[serviceName] && api.services[serviceName][methodName]) api.services[serviceName][methodName].overrideRequest(axiosConfig)

  // override with configuration from static app-conf.js
  var staticConfig = config.app.autoconf.TRANSACTION_SERVER_API_CALL_OVERRIDES

  if (staticConfig[serviceName] && staticConfig[serviceName][methodName]) {
    Object.assign(axiosConfig, staticConfig[serviceName][methodName])
  }
}

function attachParams (axiosConfig, params) {
  if (params && axiosConfig && axiosConfig.params && axiosConfig.data) {
    params.language = config.app.language

    switch (axiosConfig.method) {
      case 'get':
        Object.assign(axiosConfig.params, params)
        break
      case 'post':
        if (axiosConfig.uploadFile) {
          Object.assign(axiosConfig.headers, {'Content-Type': 'multipart/form-data'})
          axiosConfig.data = params
        } else {
          Object.assign(axiosConfig.data, params)
        }
        break
    }
  }
}

function attachAuthToken (axiosConfig) {
  Object.assign(axiosConfig.headers, api.helpers.createAuthorizationHeader(api.helpers.getToken('access')))
}

function attachGUID (axiosConfig) {
  Object.assign(axiosConfig.headers, api.helpers.createGUIDHeader())
}

function attachDeviceInfo (axiosConfig) {
  Object.assign(axiosConfig.headers, api.helpers.createDeviceInfoHeader())
}

function revisedRandId () {
  let randLetter = String.fromCharCode(65 + Math.floor(Math.random() * 26))
  return randLetter + Date.now()
}

function sendRequest (axiosConfig) {
  let dynamicId = revisedRandId()
  let date = Date.now()
  return axios(axiosConfig).then((response) => {
    // store tokens from response if available
    api.helpers.storeTokens(response)

    let data = api.helpers.modifyResponse(response)
    setDebuggerLogs({'date': date, 'type': 'api', 'request': axiosConfig, 'dynamicId': dynamicId, 'response': response})
    return Promise.resolve(data)
  }).catch((err) => {
    if ((window.ctsautoconf.MOBILE_LS && !axiosConfig.url.includes('getcurrentutcdatetime')) && (err && err.response && err.response.data) && err.response.data.ExceptionType === 'MobileAppVersionIsNotAllowedException') {
      api.helpers.appNotAllowed()
    }
    var status = err.response ? err.response.status : ''
    var showUnknownErrorModal = window.ctsautoconf.SHOW_UNKNOWN_ERROR_MODAL

    switch (status) {
      case 401:
        if (refreshTokenInProgress) {
          // if refresh token in progres wait for it and make same request again
          return callAfterRefreshToken(axiosConfig)
        } else {
          if (api.helpers.isLoggedIn() && autoRefreshToken) {
            refreshToken()
            return callAfterRefreshToken(axiosConfig)
          }
          if (store.getters['isLoggedIn']) {
            store.dispatch('overlayState/deactivateMessageDialog')
            store.dispatch('overlayState/deactivateGeolocationDialog')
            store.dispatch('overlayState/deactivateSessionDialog')
            store.commit('setSessionExpired', true)
            let type = '401'
            router.push({name: 'logout', params: {type}})
          }
          handleErrorForMobileDebugger(status, axiosConfig, err, date, dynamicId)
          return Promise.reject(api.helpers.modifyErrorResponse(err, axiosConfig))
        }
      case 503:
        if (window.ctsautoconf.MOBILE_LS) {
          handleErrorForMobileDebugger(status, axiosConfig, err, date, dynamicId)
          api.helpers.checkMaintenance()
        }
        break
      case 500:
      case 501:
      case 502:
      case 504:
      case 505:
      case 506:
      case 507:
      case 508:
      case 509:
      case 510:
      case 511:
        store.commit('setInternalError', err.response.data)
        handleErrorForMobileDebugger(status, axiosConfig, err, date, dynamicId)
        return Promise.reject(api.helpers.modifyErrorResponse(err, axiosConfig))
      default:
        if (!status && err && err.request && showUnknownErrorModal) {
          store.commit('overlayState/setMessageDialogMsg', {reason: 'network-error', persistent: true})
          store.dispatch('overlayState/activateMessageDialog')
        }
        handleErrorForMobileDebugger(status, axiosConfig, err, date, dynamicId)
        return Promise.reject(api.helpers.modifyErrorResponse(err, axiosConfig))
    }
  })
}

function refreshToken () {
  let refreshAxiosConfig = api.helpers.createAxiosConfig('auth', 'refreshtoken')

  refreshAxiosConfig.method = 'post'

  attachParams(refreshAxiosConfig, {
    client_id: 'web',
    client_secret: '',
    refresh_token: api.helpers.getToken('refresh')
  })

  refreshTokenPromise = axios(refreshAxiosConfig).then((response) => {
    // update session details with new access and refresh token
    api.helpers.storeTokens(response)
    return api.helpers.modifyResponse(response)
  }).catch((err) => {
    store.dispatch('logout', true)
    return Promise.reject(api.helpers.modifyErrorResponse(err, refreshAxiosConfig))
  }).finally(() => {
    refreshTokenInProgress = false
  })

  refreshTokenInProgress = true

  return refreshTokenPromise
}

function callAfterRefreshToken (axiosConfig) {
  return refreshTokenPromise.then((response) => {
    attachAuthToken(axiosConfig)
    return sendRequest(axiosConfig)
  }).catch(() => {
    return sendRequest(axiosConfig)
  })
}

function handleErrorForMobileDebugger (status, axiosConfig, err, date, dynamicId) {
  try {
    if (status && (window.ctsautoconf.MOBILE_LS && config.app.autoconf.MOBILE_DEBUGGER_DIALOG && config.app.autoconf.MOBILE_DEBUGGER_DIALOG.ENABLED)) {
      err.response.data['status'] = err.response.status
      setDebuggerLogs({
        'date': date,
        'type': 'api',
        'dynamicId': dynamicId,
        'request': axiosConfig,
        'response': api.helpers.modifyErrorResponse(err, axiosConfig)
      })
    }
  } catch (e) {
    console.log('handleErrorForMobileDebugger error:', e)
  }
}

function setDebuggerLogs (data) {
  if (window.ctsautoconf.MOBILE_LS && config.app.autoconf.MOBILE_DEBUGGER_DIALOG && config.app.autoconf.MOBILE_DEBUGGER_DIALOG.ENABLED) {
    store.commit('setNetworkLogOutput', {'date': data.date, 'type': 'api', 'request': data.request, 'dynamicId': data.dynamicId, 'response': data.response})
  }
}
