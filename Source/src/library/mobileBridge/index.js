import store from '@/store'
import lib from '@/library'
// import config from '@/config'
import JWTdecode from 'jwt-decode'
import router from '@/router'
import Gtm from '@/components/mixins/Gtm'
import moment from 'moment'
import nuveiPayment from '@/store/modules/payments/Nuvei/nuvei'

const state = window.ctsautoconf.STATE
var userStrongAuth = false
var biometricsActive = false

/* communication between App (webview, wrappper) and Web; those methods will be used from the App */
function init () {
  window.mobileBridge = (function () {
    console.log('Mobile Bridge initialized')
    // siteLoaded() // site loaded, inform the app
    bridgeSendRequest('siteLoaded', 'site loaded')
    let appBetCount = window.ctsautoconf.APP_RATING && window.ctsautoconf.APP_RATING.ENABLE && window.ctsautoconf.APP_RATING.BET_COUNT ? window.ctsautoconf.APP_RATING.BET_COUNT || 15 : false
    if (appBetCount) {
      bridgeSendRequest('appRatingCountLimit', appBetCount.toString())
    }
    if (window.ctsautoconf.MOBILE_DEBUGGER_DIALOG && (window.ctsautoconf.MOBILE_DEBUGGER_DIALOG.ENABLED && window.ctsautoconf.MOBILE_DEBUGGER_DIALOG.DEVICE_ID.length === 0)) {
      console.log('------ display debugger button for ALL devices ----------')
      bridgeSendRequest('displayDebuggerButton')
    }
    return {
      userVerified: function (data) {
        console.log('user Verified')
        console.log(data)
        data['faceId'] = true
        store.dispatch('get2FA', data)
        store.commit('setMobileBridgeLogs', {'response': true, 'method': 'userVerified', 'data': data, 'date': Date.now(), 'initiator': 'native app'})
      },
      /* may choose to remember the progress state ; may choose to show a progress dialog / banner to the user */
      geolocationInProgress: function () {
        console.log('-- geolocationInProgress --')
        store.commit('setMobileGeolocationInProgress', { 'display': true, 'inProgress': true, 'postContentFailed': false, 'isFirstCheck': true })
        store.commit('setMobileBridgeLogs', {'response': true, 'method': 'geolocationInProgress', 'data': null, 'date': Date.now(), 'initiator': 'native app'})
      },
      /* present notification bar for geolocation failure. On tapping view details, present a single error alert with the data supplied by the errorJSON */
      geolocationFailed: function (data) {
        console.log('geolocationFailed', data)
        console.log('geolocationFailed')
        setGeolocation(false)
        store.commit('setMobileGeolocationInProgress', { 'display': true, 'inProgress': false, 'postContentFailed': true, 'count': data.count, 'retryCount': 1, 'id': data.id })
        store.commit('setMobileBridgeLogs', {'response': true, 'method': 'geolocationFailed', 'data': data, 'date': Date.now(), 'initiator': 'native app'})
      },
      /* save JWT for subsequent wallet requests ; look inside JWT for success/failure and troubleshooter message extraction */
      geolocationAvailable: function (state, jwt) {
        console.log('geolocationAvailable')
        console.log(state)
        console.log(jwt)
        decodeJWT(jwt)
        store.commit('setMobileBridgeLogs', {'response': true, 'method': 'geolocationAvailable', 'data': {'state': state, 'jwt': jwt}, 'date': Date.now(), 'initiator': 'native app'})
      },
      /* may choose to remember the state ; may choose to notify user of redirect ; will redirect the user or ensure correct content */
      stateAvailable: function (state) {
        console.log('stateAvailable')
        console.log(state)
      },
      locationVerified: function () {
        locationVerified()
      },
      /* alert user of error based on type and message - likely presenting a dialog due to the unspecified nature of the failure */
      unexpectedError: function (errorMessage) {
        console.log('unexpectedError')
        console.log(errorMessage)
      },
      removeNotificationBar: function () {
        console.log('removeNotificationBar')
        store.commit('setMobileGeolocationInProgress', { 'display': false })
        store.commit('setMobileBridgeLogs', {'response': true, 'method': 'removeNotificationBar', 'data': null, 'date': Date.now(), 'initiator': 'native app'})
      },
      /* App tell Web to logout user (f.e: adapter inform app about session expiration during geolocation process) */
      logoutUser: function () {
        store.dispatch('logout')
        store.commit('setMobileBridgeLogs', {'response': true, 'method': 'logoutUser', 'data': null, 'date': Date.now(), 'initiator': 'native app'})
      },
      /* App request new license from web server through the web */
      getLicense: function () {
        store.dispatch('geoComplyGetLicense', state).then((response) => {
          console.log('---- GET MOBILE BUNDLE LICENSE RESPONSE ----')
          store.commit('setMobileBridgeLogs', {'response': true, 'method': 'getLicense', 'data': null, 'date': Date.now(), 'initiator': 'native app'})
          bridgeSendRequest('licenseSuccess', response)
        }).catch((error) => {
          console.log('--- MOBILE BUNDLE LICENSE ERROR ---')
          console.log(error)
          bridgeSendRequest('licenseFailed', error)
        })
      },
      /* App request geoPacket decryption from web server through the web */
      validateGeolocation: function (geoPacket) {
        store.commit('setMobileBridgeLogs', {'response': true, 'method': 'validateGeolocation', 'data': geoPacket, 'date': Date.now(), 'initiator': 'native app'})
        store.dispatch('geoComplySubmit', { geoPacket, state }).then((response) => {
          console.log('---- MOBILE BUNDLE GEO COMPLY SUBMIT RESPONSE ----')
          console.log(response)
          bridgeSendRequest('validateGeolocationSuccess', response)
        }).catch((error) => {
          console.log('--- SUBMIT ERROR ---')
          console.log(error)
          bridgeSendRequest('validateGeolocationFailed', error)
        })
      },
      /* user verification via SMS/Email */
      userVerification (fullPath) {
        // login two factor authentication
        // user gets auth link through email or phone channel
        // field pin in the login page populates automatically based on this part of code
        store.commit('setMobileBridgeLogs', {'response': true, 'method': 'userVerification', 'data': fullPath, 'date': Date.now(), 'initiator': 'native app'})
        if (fullPath.includes('verify2fa')) {
          let verify2fRoute = fullPath.split('/')
          let pinVerifyLogin2fa = verify2fRoute && verify2fRoute[verify2fRoute.length - 1]
          store.commit('setPinVerifyLogin2fa', pinVerifyLogin2fa)
          return true
        }

        let url = new URL(fullPath)
        console.log('pathname', url.pathname)
        router.push({path: url.pathname.toString()})
      },
      /* user data given from  scan drivers license */
      scanDocumentResponse (response) {
        console.log('microBlinkResponse', response)
        store.commit('setScannedID', response)
        store.commit('setMobileBridgeLogs', {'response': true, 'method': 'microBlinkResponse', 'data': response, 'date': Date.now(), 'initiator': 'native app'})
      },
      /* app is awake, check token expiration */
      appAwake: function () {
        if (store.getters['isLoggedIn']) {
          let accessToken = new Date(localStorage.ath_acsexp)
          let current = new Date()
          if (accessToken < current) {
            store.commit('setSessionExpired', true)
            let type = '401'
            router.push({name: 'logout', params: {type}})
          }
          if (window.ctsautoconf.SESSION_TIME_POPUP) { // session time popup
            console.log('check session time')
            var isSessionTime = localStorage.getItem('SessionTime')
            if (isSessionTime) {
              let timer = 0
              let currentDate = moment()
              let storedDate = JSON.parse(localStorage.getItem('SessionTime'))
              let interval = moment.duration(currentDate.diff(storedDate.date)).asMilliseconds()
              let intervalCal = storedDate.interval - interval
              if (interval < storedDate.interval) {
                timer = intervalCal
              }
              console.log('session timer to add: ', timer)
              store.dispatch('SessionTime', {'interval': timer, 'mobileContinue': true})
            }
          }
          store.commit('setMobileBridgeLogs', {'response': true, 'method': 'appAwake', 'data': null, 'date': Date.now(), 'initiator': 'native app'})
        }
        store.commit('setMobileAppAwakeStatus', true)
      },
      /* cashier app has been closed, web will update balance */
      cashierClosed: function (fullPath) {
        console.log(`Mobile Bridge | cashierClosed | URL passed from mobile app: ${fullPath}`)
        if (nuveiPayment.utils.isRedirectedFromNuveiAndPaymentIsInProgress(fullPath)) {
          nuveiPayment.utils.settleNuveiTransaction(fullPath)
          return
        }
        if (nuveiPayment.utils.isRedirectedFromNuveiWithoutPayment(fullPath)) {
          nuveiPayment.utils.startCardCheck()
          return
        }
        if (fullPath) {
          lib.rpcService.api.helpers.refreshTokenIfExpired()
          try {
            let url = new URL(fullPath)
            let urlParams = new URLSearchParams(url.search)
            let params = Object.fromEntries(urlParams)
            console.log('urlParams', urlParams)
            console.log('params', params)
            store.commit('setSightlineParams', params)
            router.push({path: url.pathname.toString()})
          } catch (ex) {
            console.log(ex)
          }
        } else {
          store.dispatch('getCustomerContext')
        }
        store.dispatch('pnmGateway/mobileBridgeHandler4PNM', fullPath)
        store.commit('setMobileBridgeLogs', {'response': true, 'method': 'cashierClosed', 'data': fullPath, 'date': Date.now(), 'initiator': 'native app'})
      },
      /* is it maintenance active */
      checkMaintenance: function () {
        store.commit('setMobileBridgeLogs', {'response': true, 'method': 'checkMaintenance', 'data': null, 'date': Date.now(), 'initiator': 'native app'})
        lib.rpcService.api.helpers.checkMaintenance()
      },
      checkSession: function () {
        let accessToken = localStorage.ath_acsexp ? new Date(localStorage.ath_acsexp) : false
        let current = new Date()
        store.commit('setMobileBridgeLogs', {'response': true, 'method': 'checkSession', 'data': null, 'date': Date.now(), 'initiator': 'native app'})
        if (accessToken && (accessToken > current)) {
          bridgeSendRequest('sessionActive', {'AccessTokenExpirationUTC': accessToken})
        }
        if (!accessToken || (accessToken && accessToken < current)) {
          bridgeSendRequest('sessionExpired')
        }
      },
      checkIP: function () {
        store.commit('setMobileBridgeLogs', {'response': true, 'method': 'checkIP', 'data': null, 'date': Date.now(), 'initiator': 'native app'})
        store.dispatch('IPcheck').then((response) => {
          var data = response.result
          bridgeSendRequest('userIP', data.ip)
        }).catch((error) => {
          console.log('error', error)
        })
      },
      showLoginDialog: function () {
        store.dispatch('overlayState/activateLoginDialog')
        store.commit('setMobileBridgeLogs', {'response': true, 'method': 'showLoginDialog', 'data': null, 'date': Date.now(), 'initiator': 'native app'})
        Gtm.methods.sendGTMClickEvent('login', 'open login dialog', 'login-btn', 'top header')
      },
      pushNotification: function (obj) {
        console.log('push notification response', obj)
        store.dispatch('registerFirebaseNotification', obj)
        store.commit('setMobileBridgeLogs', {'response': true, 'method': 'pushNotification', 'data': obj, 'date': Date.now(), 'initiator': 'native app'})
      },
      /* address data given from google places api library */
      lookupAddressResponse (response) {
        console.log('lookupAddressResponse', response)
        store.commit('setLookupAddressResponse', response)
        store.commit('setMobileBridgeLogs', {'response': true, 'method': 'lookupAddressResponse', 'data': response, 'date': Date.now(), 'initiator': 'native app'})
      },
      mobileDeviceInfo (response) {
        console.log('mobileDeviceInfo', response)
        console.log('mobileDeviceInfo typeof', typeof response)
        store.commit('setMobileDeviceInfo', response)
        store.commit('setMobileBridgeLogs', {'response': true, 'method': 'mobileDeviceInfo', 'data': response, 'date': Date.now(), 'initiator': 'native app'})
        let deviceId = response['device_id']
        console.log('deviceId', deviceId)
        if (window.ctsautoconf.MOBILE_DEBUGGER_DIALOG && window.ctsautoconf.MOBILE_DEBUGGER_DIALOG.ENABLED && (window.ctsautoconf.MOBILE_DEBUGGER_DIALOG.DEVICE_ID && window.ctsautoconf.MOBILE_DEBUGGER_DIALOG.DEVICE_ID.includes(deviceId))) {
          console.log('------ display debugger button with specific Device ----------')
          bridgeSendRequest('displayDebuggerButton')
        }
      },
      getKeyValueFromNative: function (response) {
        const mobileDeviceInfo = store.getters['getMobileDeviceInfo']

        if (response.key === 'username') {
          store.commit('overlayState/setLoginFields', { username: response.value })
          store.commit('setMobileBridgeLogs', {'response': true, 'method': 'getKeyValueFromNative', 'data': response, 'date': Date.now(), 'initiator': 'native app'})
        }
        if (response.key === 'welcome' && !response.value === true) {
          store.commit('overlayState/setWelcomeDialogGenericState', true)
        }
        if (response.key === 'current-bundle-version') {
          if (lib.core.common.isNewVersion(response.value, mobileDeviceInfo['bundle_version'])) {
            store.commit('overlayState/setWhatsNewDialogState', true)
          }
          bridgeSendRequest('setKeyValue', {'current-bundle-version': mobileDeviceInfo['bundle_version']})
        }
      },
      internalProxy (fullPath) {
        let url = new URL(fullPath)
        if (url.search.includes('internalProxy') || url.search.includes('internalLink')) {
          console.log('internalProxy - pathname', url.pathname)
          const isInfoPage = url.search.includes('/info/')
          const customPath = isInfoPage && url.hash ? url.search + url.hash : url.search
          router.push({path: customPath}).then(r => console.log(r, 'r')).catch(e => console.log('internal proxy:', e))
          // router.push({path: url.search}).then(r => console.log(r, 'r')).catch(e => console.log('internal proxy:', e))
          return false
        }
        router.push({path: '/'})
      },
      debuggerButtonAction () {
        let currentState = store.getters['overlayState/getLogDialogState']
        if (!currentState && window.ctsautoconf.MOBILE_DEBUGGER_DIALOG && window.ctsautoconf.MOBILE_DEBUGGER_DIALOG.ENABLED) {
          store.commit('overlayState/setLogDialogMsg', {reason: 'network-log', persistent: true})
          store.dispatch('overlayState/activateLogDialog')
          return false
        }
        store.dispatch('overlayState/deactivateLogDialog')
      },
      geocomplyTechnicalError (response) {
        let parseResponse = response instanceof Object ? response : JSON.parse(response)
        let data = {
          'userID': localStorage.customer || null,
          'logReason': parseResponse.reason || null,
          'errorCode': parseInt(parseResponse.errorCode) || null,
          'keyName': null,
          'errorMessage': parseResponse.errorMessage || null
        }
        store.dispatch('geocomplyTechnicalError', data)
      },
      updateInboxBadgeCount: function (data) {
        if (!window.ctsautoconf.XTREMEPUSH_ANALYTICS && !window.ctsautoconf.XTREMEPUSH_ANALYTICS.MOBILE_APP) {
          console.log('Xtremepush is disabled')
          return false
        }
        console.log('xtremepush - updateInboxBadgeCount', data)
        store.commit('setXtremepushInboxBadgeCounter', data)
      },
      handleInlineMessage: function (data) {
        if (!window.ctsautoconf.XTREMEPUSH_ANALYTICS && !window.ctsautoconf.XTREMEPUSH_ANALYTICS.MOBILE_APP) {
          console.log('Xtremepush is disabled')
          return false
        }
        let parseData = data instanceof Object ? data : JSON.parse(data)
        console.log('xtremepush - inlineContentData', parseData)
        store.commit('setXtremepushInlineContent', parseData)
      }
    }
  })()

  /* native app biometrics login  */
  window.nativeBiometrics = (function () {
    console.log('nativeBiometrics ready')
    // nativeBiometrics('biometrics_ready')
    bridgeSendRequest('nativeBiometrics', 'biometrics_ready')
    return {
      /* Mobile bundle face or touch availability response */
      checkAvailabilityResponse: function (response) {
        store.commit('setBiometricsvailability', response)
        store.commit('setMobileBridgeLogs', {'response': true, 'method': 'checkAvailabilityResponse', 'data': response, 'date': Date.now(), 'initiator': 'native app'})
      },
      checkBiometricsSettingsResponse: function (response) {
        console.log('response', response)
        localStorage.biometricsState = JSON.parse(response.biometrics_enabled)
        store.commit('setBiometricsSettings', response)
        store.commit('setMobileBridgeLogs', {'response': true, 'method': 'checkBiometricsSettingsResponse', 'data': response, 'date': Date.now(), 'initiator': 'native app'})
      },
      /* receive user credentials and proceed with login */
      readDataResponse: function (response) {
        biometricsActive = true
        let biometrics = store.getters['getBiometricsAvailability'].biometrics
        console.log('readDataResponse', response)
        let faceId = (window.ctsautoconf.MOBILE_LS && (window.ctsautoconf.APP_BIOMETRICS_AUTOMATIC_LOGIN || biometrics === 'DATA')) ? JSON.parse(localStorage.biometricsState) : false
        let params = {'username': response.username, 'password': response.password}
        if (faceId) store.commit('setMobileUsernameAndPassword', params)
        // for the purposes of protected parameter in get2fa request
        let bitwiseMap = 8 | 32 // 8: any biometrics
        store.commit('setProtected2fa', parseInt((bitwiseMap).toString(2)))
        store.dispatch('get2FA', response)
        store.commit('setMobileBridgeLogs', {'response': true, 'method': 'readDataResponse', 'data': response, 'date': Date.now(), 'initiator': 'native app'})
      },
      /* Mobile bundle face or touch login response SUCCESS/FAILURE */
      writeDataResponse: function (response) {
        console.log('writeDataResponse', response)
        store.commit('setMobileBridgeLogs', {'response': true, 'method': 'writeDataResponse', 'data': response, 'date': Date.now(), 'initiator': 'native app'})
      },
      /* Mobile bundle face or touch login response SUCCESS/FAILURE */
      clearDataResponse: function (response) {
        console.log('clearDataResponse', response)
        store.commit('setMobileBridgeLogs', {'response': true, 'method': 'clearDataResponse', 'data': response, 'date': Date.now(), 'initiator': 'native app'})
      }
    }
  })()
}

const userAgent = function () {
  let name = lib.core.userAgent.os.name
  return name
}

function mobileUserLogin (response, password) {
  response.result['password'] = password
  bridgeSendRequest('mobileLogin', response.result)
}

function mobileLogout () {
  localStorage.mobileGeolocated = false
  biometricsActive = false
  userStrongAuth = false
  setGeolocation(false)
  store.commit('setMobileGeolocationInProgress', { 'display': false })
  bridgeSendRequest('mobileLogout')
  console.log('mobileLogout bridge')
}

function setGeolocation (isGeolocated) {
  localStorage.mobileGeolocated = isGeolocated
  store.commit('setGeolocated', isGeolocated)
  if (!isGeolocated) {
    store.commit('setGeolocated', false)
  }
}

/* decrypt jwt and read gelocation status */
function decodeJWT (token) {
  localStorage.mobileToken = token
  let decodeResponse = JWTdecode(token)
  console.log('mobile jwt decode')
  console.log(decodeResponse)
  if (decodeResponse.result) {
    locationVerified(decodeResponse)
  }
  if (!decodeResponse.result) {
    locationFailed(decodeResponse)
  }
}

function locationVerified () {
  console.log('locationVerified')
  setGeolocation(true)
  store.commit('setMobileBridgeLogs', {'response': true, 'method': 'locationVerified', 'data': null, 'date': Date.now(), 'initiator': 'native app'})
  if (window.ctsautoconf.IP_CHECK_INTERVAL && window.ctsautoconf.IP_CHECK_INTERVAL > 0) {
    store.dispatch('IPcheckInterval')
  }
  store.commit('setMobileGeolocationInProgress', { 'display': true, 'inProgress': false, 'postContentSuccess': true, 'isFirstCheck': true })
  setTimeout(() => {
    store.commit('setMobileGeolocationInProgress', { 'display': false })
  }, 2000)
}

function setUserCredentials (obj) {
  if (biometricsActive && obj) {
    userStrongAuth = obj
  }
}

function getUserCredentials () {
  if (biometricsActive) {
    return userStrongAuth
  }
}

function locationFailed (response) {
  console.log('locationFailed')
  console.log(response)
  // displayGeolocationError(response.troubleshooter)
}

function showLoginDialog () {
  let isBiometricsEnabled = localStorage.biometricsState
  console.log('isBiometricsEnabled', isBiometricsEnabled)
  store.dispatch('overlayState/activateLoginDialog')
  Gtm.methods.sendGTMClickEvent('login', 'open login dialog', 'login-btn', 'top header')
}

/* send error log to mobile bundle */
function errorLogger (errorLog, requestConfig, serverException = true) {
  var mergeObj = {}
  if (serverException) {
    let response = {}
    let request = {}
    response['date_time'] = new Date()
    response['data'] = errorLog.data
    response['status'] = errorLog.status
    response['statusText'] = errorLog.statusText
    request['url'] = requestConfig.url
    request['headers'] = requestConfig.headers
    console.log('response', response)
    mergeObj = {'request': request, 'response': response}
    console.log('merge', mergeObj)
  } else {
    mergeObj = errorLog
    if (window.ctsautoconf.MOBILE_DEBUGGER_DIALOG && window.ctsautoconf.MOBILE_DEBUGGER_DIALOG.ENABLED) {
      store.commit('setConsoleLogs', mergeObj)
    }
  }
  try {
    if (userAgent() === 'ios') {
      window.webkit.messageHandlers.errorLogger.postMessage(JSON.stringify(mergeObj))
    }
    if (userAgent() === 'android') {
      /* eslint-disable */
      android.errorLogger(JSON.stringify(mergeObj))
      /* eslint-enable */
    }
  } catch (error) {
    console.error('error')
  }
}

function bridgeSendRequest (method, args = '') {
  console.log('bridgeSendRequest')
  console.log('bridge method', method)
  let date = Date.now()
  const params = args instanceof Object ? JSON.stringify(args) : args
  console.log('bridge params', params)
  let request
  try {
    if (userAgent() === 'ios') {
      request = window.webkit.messageHandlers[method]
      request.postMessage(params)
    }
    if (userAgent() === 'android') {
      /* eslint-disable */
      android[method](params)
      /* eslint-enable */
    }
    if (window.ctsautoconf.MOBILE_DEBUGGER_DIALOG && window.ctsautoconf.MOBILE_DEBUGGER_DIALOG.ENABLED) store.commit('setMobileBridgeLogs', {'method': method, 'params': params, 'response': 'sent', 'initiator': 'Web', 'date': date})
  } catch (error) {
    console.warn('Bridge Error - ', {'error': error, 'method': method})
    if (window.ctsautoconf.MOBILE_DEBUGGER_DIALOG && window.ctsautoconf.MOBILE_DEBUGGER_DIALOG.ENABLED) store.commit('setMobileBridgeLogs', {'error': error, 'method': method, 'params': params, 'initiator': 'Web', 'date': date})
  }
}

export default {
  init,
  mobileUserLogin,
  mobileLogout,
  errorLogger,
  bridgeSendRequest,
  setUserCredentials,
  getUserCredentials,
  showLoginDialog
}
