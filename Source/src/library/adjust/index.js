import lib from '@/library'
import Adjust from './adjust.js'
import AdjustConfig from './adjust_config.js'
import AdjustEvent from './adjust_event.js'

var adjustToken
function adjustExists () {
  let os = lib.core.userAgent.os.name
  let tokenId = (navigator.platform.indexOf('Mac') === 0 || navigator.platform.indexOf('Win') === 0) ? 'ADJUST_TOKEN_WEB' : 'ADJUST_TOKEN_' + os.toUpperCase()
  return window.ctsautoconf[tokenId]
}
function userAgent () {
  let name = lib.core.userAgent.os.name
  return name
}

function init (token) {
  adjustToken = token
  let env = (window.ctsautoconf.ADJUST_ENV) ? window.ctsautoconf.ADJUST_ENV : 'EnvironmentProduction'
  console.log('adjust initialized - TOKEN:', adjustToken)
  if (userAgent() === 'ios') {
    initIOS(adjustToken, env)
  }
  if (userAgent() === 'android') {
    initAndroid(adjustToken, env)
  }
}

function initIOS (adjustToken, env) {
  setupWebViewJavascriptBridge(function (bridge) {
    let adjustConfig = new window.AdjustConfig(adjustToken, window.AdjustConfig[env])
    adjustConfig.setLogLevel(window.AdjustConfig.LogLevelVerbose)
    window.Adjust.appDidLaunch(adjustConfig)
  })
}

function initAndroid (adjustToken, env) {
  let yourAppToken = adjustToken
  let environment = AdjustConfig[env]
  let adjustConfig = new AdjustConfig(yourAppToken, environment)
  adjustConfig.setLogLevel(AdjustConfig.LogLevelVerbose)
  Adjust.onCreate(adjustConfig)
}

function setupWebViewJavascriptBridge (callback) {
  if (window.WebViewJavascriptBridge) {
    return callback(window.WebViewJavascriptBridge)
  }
  if (window.WVJBCallbacks) {
    return window.WVJBCallbacks.push(callback)
  }
  window.WVJBCallbacks = [callback]
  var WVJBIframe = document.createElement('iframe')
  WVJBIframe.style.display = 'none'
  WVJBIframe.src = 'wvjbscheme://__BRIDGE_LOADED__'
  document.documentElement.appendChild(WVJBIframe)
  setTimeout(() => {
    document.documentElement.removeChild(WVJBIframe)
  }, 0)
}

function adjustEventRequest (eventName, revenue = null) {
  revenue = typeof revenue === 'number' ? revenue.toString() : revenue
  if (adjustExists()) {
    let device = lib.core.userAgent.os.name.toUpperCase()
    let adjustEvents = window.ctsautoconf['ADJUST_EVENTS_' + device]
    let getEventToken = adjustEvents[eventName]
    console.log('eventName:', eventName + ' // event token: ' + getEventToken + ' // event revenue: ' + revenue)
    try {
      if (!revenue) {
        if (userAgent() === 'ios') {
          let trackEvent = new window.AdjustEvent(getEventToken)
          console.log('trackEvent ios', trackEvent)
          window.Adjust.trackEvent(trackEvent)
        }
        if (userAgent() === 'android') {
          let trackEvent = new AdjustEvent(getEventToken)
          console.log('trackEvent android', trackEvent)
          Adjust.trackEvent(trackEvent)
        }
      }
      if (revenue) {
        if (userAgent() === 'ios') {
          let revenueEvent = new window.AdjustEvent(getEventToken)
          console.log('revenueEvent ios', revenueEvent)
          revenueEvent.setRevenue(revenue, 'USD')
          window.Adjust.trackEvent(revenueEvent)
        }
        if (userAgent() === 'android') {
          let revenueEvent = new AdjustEvent(getEventToken)
          console.log('revenueEvent andorid', revenueEvent)
          revenueEvent.setRevenue(revenue, 'USD')
          Adjust.trackEvent(revenueEvent)
        }
      }
    } catch (error) {
      console.warn('Adjust Error - ', {'error': error, 'eventName': eventName})
    }
  }
}
export default {
  init,
  adjustEventRequest
}
