import store from '@/store'
import config from '@/config'
import moment from 'moment'
// import JWTdecode from 'jwt-decode'

const state = config.app.autoconf.STATE
const customField = config.walletParams.geoComplyCustomField
const customFieldKey = config.walletParams.customFieldKey
const errorMsgCode = [615, 612, 602, 604, 605]
const hardGeolocationRedirect = window.ctsautoconf.HARDGEOLOCATION // multi state redirection
const stateInstance = config.app.autoconf.STATE.toLowerCase()
const availableInstances = ['wv', 'pa']
const provider = window.ctsautoconf.WALLET_PROVIDER
const installerKey = config.walletParams.installerKey
let locationSuccess = false
let logs = []
// var troubleshooter = [{
//   'message': 'More location data is needed to confirm you are in a permitted area. Make sure your WiFi is turned on and your device is in range of multiple wireless connections. Please address items above, then try again.',
//   'rule': 'min_loc_number',
//   'retry': true
// },
// {
//   'message': 'More location data is needed to confirm you are in a permitted area. Make sure your WiFi is turned on and your device is in range of multiple wireless connections. Please address items above, then try again.',
//   'rule': 'boundary',
//   'retry': true
// }]
// var troubleshooter = [
//   {
//     'IsValid': false,
//     'ErrorCode': 1,
//     'NewLicence': null,
//     'ErrorMessage': 'geolocation.out_of_boundary',
//     'AllowRetry': false,
//     'NextGeolocationInSeconds': 0,
//     'Troubleshooter': [
//       {
//         'Message': 'Your IP address indicates you are not in a permitted area. Please make sure that you are within a permitted area, then try again.',
//         'CanRetry': true,
//         'HelpLink': 'https://co.superbook.com/sports',
//         'OptInLink': null
//       },
//       {
//         'Message': "Your device did not return any location information. Please Turn your device's WiFi ON. For mobile data connection: Please make sure \"High Accuracy\" Location Services are enabled. For WIFI connection: make sure your device is in range of multiple wireless connections. Please address the items above, then try again.",
//         'CanRetry': true,
//         'HelpLink': null,
//         'OptInLink': null
//       },
//       {
//         'Message': 'Your IP address indicates you are not in a permitted area. Please make sure that you are within a permitted area, then try again.',
//         'CanRetry': true,
//         'HelpLink': 'https://co.superbook.com/sports',
//         'OptInLink': null},
//       {
//         'Message': "Your device did not return any location information. Please Turn your device's WiFi ON. For mobile data connection: Please make sure \"High Accuracy\" Location Services are enabled. For WIFI connection: make sure your device is in range of multiple wireless connections. Please address the items above, then try again.",
//         'CanRetry': true,
//         'HelpLink': null,
//         'OptInLink': null
//       }
//     ]
//   }
// ]
// const sessionDetails = config.customCookies.getCookie('sessionDetails')
let customFieldValue = null
let initPeriodicCheck = null

/* before starting geolocation again, unset geo error */
function resetGeoError () {
  console.log('-- resetGeoError --')
  if (typeof localStorage !== 'undefined') {
    if (localStorage.getItem('geoError')) {
      localStorage.setItem('geoError', false)
    }
  }
}

/* disconnect from geocomply service on: logout, failed geolocation  */
function geoComplyDisconnectService () {
  console.log('-- Disconnect Service --')
  store.commit('setGeolocated', false)
  localStorage.setItem('gcPerm', false)
  turnOffEvents()
  clearTimeout(initPeriodicCheck)
  window.GeoComply.Client.disconnect()
}
/* turn off all geoComply events */
function turnOffEvents () {
  console.log('-- turnOffEvents --')
  window.GeoComply.Client.off('connect').off('geolocation').off('error').off('log')
}
/* set download plugin key for specific environment */
function environment () {
  var gcData = {}
  if (process.env.NODE_ENV === 'development') {
    gcData = { env: 'staging', id: installerKey }
    return gcData
  } else if (process.env.NODE_ENV === 'production') {
    gcData = { env: 'production', id: installerKey }
    return gcData
  } else {
    gcData = { env: 'staging', id: installerKey }
    return gcData
  }
}
/* establish connection with geoComply service via webSocket  */
function connectGeoComplyService () {
  console.log('-- connect GeoComply Service --')
  window.GeoComply.Client.connect(environment().id, environment().env)
  setTimeout(() => {
    console.log('GeoComply Client connected: ' + window.GeoComply.Client.isConnected())
  }, 2000)
}

/* geoComply redirect to proper state - multi state scenario */
function hardRedirect (errorCode, locationSuccess, redirectTo) {
  console.log('-- HARD REDIRECT --')
  redirectTo = redirectTo.toUpperCase()
  let params = { locationSuccess, redirectTo }
  geoComplyDisconnectService()
  store.commit('overlayState/setGeolocationMessage', { errorCode, params })
  store.dispatch('overlayState/activeGeolocationDialog')
}

/* miliseconds to minutes - for log only */
function millisToMinutesAndSeconds (millis) {
  let minutes = Math.floor(millis / 60000)
  let seconds = ((millis % 60000) / 1000).toFixed(0)
  return minutes + ':' + (seconds < 10 ? '0' : '') + seconds
}
/* show spinner on geolocaton start */
function showSpinnerOnStart () {
  if (!JSON.parse(store.getters['getGeolocated'])) {
    var errorCode = 'verify'
    store.commit('overlayState/setGeolocationMessage', { errorCode })
  }
}
/* get fresh license from operator */
function getGeoLicense (userID, sessionId, reason) {
  logs = []
  customFieldValue = sessionId
  store.dispatch('geoComplyGetLicense', state).then((response) => {
    console.log('---- GET LICENSE RESPONSE ----')
    console.log(response)
    console.log(response.result)
    window.GeoComply.Client.setLicense(response.result.License)
    response.result['logDate'] = new Date()
    localStorage.setItem('userLicense' + state, JSON.stringify(response.result))
    logs.push({ 'license': response.result.License })
    requestGeoLocation(userID, reason)
  }).catch((error) => {
    console.log('--- FRESH LICENSE ERROR ---')
    console.log(error)
    store.commit('setGeolocationInternalError', error)
  })
}

/* send expired license and request new license from operator */
function getNewGeoLicense (userID, reason) {
  let license = JSON.parse(localStorage.getItem('userLicense' + state)).License
  store.dispatch('geoComplyGetNewLicense', { license, state }).then((response) => {
    console.log('---- GET NEW LICENSE RESPONSE ----')
    console.log(response)
    window.GeoComply.Client.setLicense(response.result.License)
    localStorage.setItem('userLicense' + state, JSON.stringify(response.result))
    logs.push({ 'new_license': response.result.License })
    requestGeoLocation(userID, reason)
  }).catch((error) => {
    console.log('--- NEW LICENSE ERROR ---')
    console.log(error)
    store.commit('setGeolocationInternalError', error)
  })
}
/* send geoPacket to Operator for decryption */
function geocomplySubmit (geoPacket, userID) {
  console.log('goepacket')
  console.log(typeof geoPacket)
  console.log('--- SUBMIT ---')
  store.dispatch('geoComplySubmit', { geoPacket, state }).then((response) => {
    console.log('---- GEO COMPLY SUBMIT RESPONSE ----')
    console.log(response)
    // decodeJWT(response.result.GeolocationToken, userID)
    validateResponse(response.result, userID)
    // validateResponse(troubleshooter[0].Troubleshooter, userID)
    localStorage.setItem('gcMessages', JSON.stringify(response.result.Troubleshooter))
    // localStorage.setItem('gcMessages', JSON.stringify(troubleshooter[0].Troubleshooter))
  }).catch((error) => {
    console.log('--- SUBMIT ERROR ---')
    console.log(error)
    store.commit('setGeolocationInternalError', error)
  })
}
/* check license expiration date; valid - continue with gelocating ; invalid - request new license  */
function validateLicense (userID, sessionId, reason) {
  customFieldValue = sessionId
  console.log('---  VALIDATE LICENSE ---')
  console.log('userId', userID)
  console.log('sessionId', sessionId)
  console.log('reason', reason)
  let licenseDate
  let currentDate = new Date()
  switch (provider) {
    case 'FD':
      licenseDate = new Date(JSON.parse(localStorage.getItem('userLicense' + state)).ExpiryDate)
      break
    case 'SHW':
      let storedMillis = JSON.parse(localStorage.getItem('userLicense' + state)).ExpiresInMilliseconds
      let storedDate = new Date(JSON.parse(localStorage.getItem('userLicense' + state)).logDate)
      licenseDate = new Date(storedDate.getTime() + storedMillis)
      console.log('currentDate', currentDate)
      console.log('valid until', licenseDate)
  }
  if (licenseDate < currentDate) {
    console.log('license expired')
    switch (provider) {
      case 'FD':
        getNewGeoLicense(userID, sessionId, reason)
        break
      case 'SHW':
        getGeoLicense(userID, sessionId, reason)
        break
    }
  }
  if (licenseDate > currentDate) {
    console.log('valid license')
    requestGeoLocation(userID, reason)
  }
}
/* request geoPacket from geocomply service */
function requestGeoLocation (userID, reason) {
  let userId = userID.toString()
  window.GeoComply.Client.setUserId(userId)
  if (customField) {
    window.GeoComply.Client.customFields.set(customFieldKey, customFieldValue)
  }
  window.GeoComply.Client.setGeolocationReason('Desktop: Sports/' + reason)
  console.log('--- requestGeoLocation ---')
  window.GeoComply.Client.requestGeolocation()
}

/* --- decrypt jwt and read gelocation status */
// function decodeJWT (token, userID) {
//   let decodeResponse = JWTdecode(token)
//   console.log('decodeResponse')
//   console.log(decodeResponse)
//   if (decodeResponse.result) {
//     locationVerified(decodeResponse, userID)
//   }
//   if (!decodeResponse.result) {
//     locationFailed(decodeResponse, userID)
//   }
// }

function validateResponse (result, userID) {
  console.log('validate Response', result)
  console.log(userID)
  if (result.IsValid) {
    locationVerified(result, userID)
  }
  if (!result.IsValid) {
    locationFailed(result, userID)
    // store.commit('setGeocomplyTroubleshooter', result)
    store.commit('setGeocomplyTroubleshooter', result.Troubleshooter)
  }
}

function errorHandler (errorCode, errorMessage, userID, reason) {
  geocomplyTechnicalError(errorCode, errorMessage, userID, reason)
  var isCode = errorMsgCode.includes(errorCode)
  if (isCode) {
    errorCode = parseInt(errorCode)
    store.commit('setGeolocated', false)
    localStorage.setItem('gcPerm', false)
    if (errorMsgCode.includes(612)) {
      localStorage.setItem('geoError', 612)
    }
    displayErrorMessage(errorCode, errorMessage, userID)
  }
  logs.push({ 'error': errorMessage })
  console.log('-- Log error --')
  console.log(logs)
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
      switch (provider) {
        case 'FD':
          getNewGeoLicense(userID, null, reason)
          break
        case 'SHW':
          getGeoLicense(userID, null, reason)
          break
      }
      break
    case window.GeoComply.Client.CLNT_ERROR_SERVER_COMMUNICATION:
      console.log('The server communication failed')
      break
    case window.GeoComply.Client.CLNT_ERROR_UNEXPECTED:
      store.commit('setGeolocated', false)
      localStorage.setItem('gcPerm', false)
      geoComplyDisconnectService()
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
      geoComplyDisconnectService()
  }
}
/* user is not geolocated or plugin not exist ; provide message to the user */
function displayErrorMessage (errorCode, errorMessage, userID) {
  console.log('--- location / plugin error message ---')
  localStorage.setItem('geoError', errorCode)
  geoComplyDisconnectService()
  store.commit('overlayState/setGeolocationMessage', { errorCode, errorMessage, userID })
  store.dispatch('overlayState/activeGeolocationDialog')
}
/* location verified ; allow user to place bet, remove error messages, prepare periodic location check */
function locationVerified (response, userID) {
  /*
   Recommendation: DOCS in INWLT1458
   The buffer time should be adjusted to:
   ○ ~30% of the “Re-geolocate in” value for the small intervals less than 120s
   ○ 35 sec. of the “Re-geolocate in” value for the larger intervals more that
   */
  let bufferedTime
  if (response.BufferTime) { // f buffer does exist in response
    bufferedTime = response.NextGeolocationInSeconds - response.BufferTime
  }
  if (!response.BufferTime && response.NextGeolocationInSeconds < 120) { // if buffer does not exist in response, next geolocation is less than 120 sec, decrease for ~ 30%
    let buffer = (response.NextGeolocationInSeconds / 100) * 30
    bufferedTime = response.NextGeolocationInSeconds - buffer
  }
  if (!response.BufferTime && response.NextGeolocationInSeconds > 120) { // if buffer does not exist in response, next geolocation is more than 120 sec, decrease for 35 sec
    bufferedTime = response.NextGeolocationInSeconds - 35
  }
  let minutes = Math.floor(bufferedTime / 60)
  console.log('--- location verified ---')
  if (response.NewLicence !== null) {
    window.GeoComply.Client.setLicense(response.NewLicence.License)
    response.NewLicence['logDate'] = new Date()
    localStorage.setItem('userLicense' + state, JSON.stringify(response.NewLicence))
  }
  let currentTime = moment()
  let timer = bufferedTime * 1000 // convert to milliseconds
  console.log('timer in millis and minutes', {timer, minutes})
  localStorage.removeItem('tgc')
  let lcData = { 'date': currentTime, 'cf': timer }
  localStorage.setItem('tgc', JSON.stringify(lcData))
  localStorage.setItem('gcPerm', true)
  store.commit('setGeolocated', true)
  setTimeout(() => {
    if (localStorage.geolocationOnLogin) {
      store.dispatch('triggerBSLocationVerifiedAnimation', true)
      localStorage.removeItem('geolocationOnLogin')
    }
  }, 100)
  localStorage.setItem('geoError', false)
  store.commit('overlayState/setGeolocationMessage', {})
  clearTimeout(initPeriodicCheck)
  initPeriodicCheck = setTimeout(() => {
    requestGeoLocation(userID, 'Periodic')
  }, timer)
}

/* location failed ; remove permission, display errors */
function locationFailed (response, userID) {
  localStorage.removeItem('geolocationOnLogin')
  logs.push({ 'location_verified': response.result })
  console.log('-- Log --')
  console.log(logs)
  if (hardGeolocationRedirect) {
    hardRedirection(response, userID)
  } else {
    let errorCode = 999
    displayErrorMessage(errorCode, response.troubleshooter, userID)
  }
}

function hardRedirection (response, userID) {
  var geolocatedState = response.state.toLowerCase()
  if ((stateInstance !== geolocatedState) && stateInstance !== 'nj') { // state from response and state instance mismatch, redirect to NJ website as default
    hardRedirect('hardGeolocationRedirect', locationSuccess, 'nj')
  } else if (stateInstance === 'nj' && availableInstances.includes(geolocatedState)) { // state instance is NJ and state from response has own website, redirect.
    locationSuccess = true
    hardRedirect('hardGeolocationRedirect', locationSuccess, geolocatedState)
  } else {
    let errorCode = 999
    displayErrorMessage(errorCode, response.troubleshooter, userID)
  }
}

function geocomplyTechnicalError (errorCode, errorMessage, userID, reason) {
  let keyName = getErrorKey(parseInt(errorCode))
  let logReason = 'Desktop: Sports/ ' + reason
  store.dispatch('geocomplyTechnicalError', {errorCode, errorMessage, userID, logReason, keyName})
}

function getErrorKey (value) {
  let object = window.GeoComply.Client
  return Object.keys(object).find(key => object[key] === value)
}

export default {
  resetGeoError,
  geoComplyDisconnectService,
  turnOffEvents,
  millisToMinutesAndSeconds,
  hardRedirect,
  environment,
  connectGeoComplyService,
  showSpinnerOnStart,
  getGeoLicense,
  getNewGeoLicense,
  geocomplySubmit,
  requestGeoLocation,
  validateLicense,
  errorHandler
}
