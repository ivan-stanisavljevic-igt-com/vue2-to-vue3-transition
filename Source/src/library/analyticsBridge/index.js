
/* custom block - prepare object to firebase analytics */
/*
Key: max 40 characters long
Value: max 100 characters long
max 20 parameters per event
max 500 events per project
firebase analytics : Item cannot contain an array-based parameter (error 21) // https://firebase.google.com/docs/analytics/errors
*/
import lib from '@/library'
import config from '@/config'
var prefix = window.ctsautoconf.FIREBASE_ANALYTICS_PREFIX || 'igt'
prefix = prefix + '_'

function dataParser (obj, xtremeObj = false) {
  if (obj) {
    let eventName = obj.event
    let object = {}
    if (eventName) delete obj.event
    for (const property in obj) {
      if (typeof obj[property] === 'object') continue
      object[property] = obj[property]
    }
    console.log('analytics bridge - obj and event name', {eventName, object})
    if (config.app.autoconf.FIREBASE_ANALYTICS) logEvent(prefix + eventName, object)
    if (config.app.autoconf.APPSFLYER_ANALYTICS) appsFlyer(eventName, object)
  }
  if (((config.app.autoconf.XTREMEPUSH_ANALYTICS && config.app.autoconf.XTREMEPUSH_ANALYTICS.MOBILE_APP) || window.xtremepush) && xtremeObj) xtremePush(xtremeObj)
}

/* end of custom block */

/* firebase block */
function logEvent (name, params) {
  console.log('firebase analytics event', {name, params})
  if (!name) {
    return
  }

  if (window.AnalyticsWebInterface) {
    // Call Android interface
    window.AnalyticsWebInterface.logEvent(name, JSON.stringify(params))
  } else if (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.firebase) {
    // Call iOS interface
    var message = {
      command: 'logEvent',
      name: name,
      parameters: params
    }
    window.webkit.messageHandlers.firebase.postMessage(message)
  } else {
    // No Android or iOS interface found
    console.warn('firebase analytics - No native APIs found.')
  }
}

function setUserProperty (name, value) {
  if (!name || !value) {
    return
  }

  if (window.AnalyticsWebInterface) {
    // Call Android interface
    window.AnalyticsWebInterface.setUserProperty(name, value)
  } else if (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.firebase) {
    // Call iOS interface
    var message = {
      command: 'setUserProperty',
      name: name,
      value: value
    }
    window.webkit.messageHandlers.firebase.postMessage(message)
  } else {
    // No Android or iOS interface found
    console.warn('firebase analytics - No native APIs found.')
  }
}
/* end of firebase block */

/* appsFlyer block */
function appsFlyer (name, params) {
  console.log('appsFlyer', name)
  console.log('appsFlyer', params)
  /*
  key - generic event name
  value - appsFlyer predefined event name
  */
  var eventMapper = {
    'login': 'af_login',
    'signup_complete': 'af_complete_registration',
    'bet': 'af_purchase',
    'first_bet': 'first_purchase',
    'first_deposit confirm': 'first_deposit',
    'deposit confirm': 'deposit',
    'first_withdrawal confirm': 'first_withdrawal',
    'withdrawal confirm': 'withdrawal'
  }
  if (eventMapper[name]) {
    var args
    if (name === 'login') args = eventMapper[name]
    if (name === 'signup_complete') args = eventMapper[name] + '+' + JSON.stringify({'af_registration_method': params['accountId']})
    if ((name === 'bet' || name === 'first_bet') && params['gaEventAction'] === 'bet success') {
      let values = {
        'af_revenue': params['betAmount'],
        'af_currency': 'USD',
        'af_quantity': params['betCount'],
        'af_content_id': params['betSlipID'],
        'af_order_id': params['transactionId']
      }
      args = eventMapper[name] + '+' + JSON.stringify(values)
    }
    if ((name === 'deposit confirm' || name === 'first_deposit confirm')) {
      let values = {
        'af_revenue': params['stake'],
        'af_currency': 'USD'
      }
      args = eventMapper[name] + '+' + JSON.stringify(values)
    }
    if ((name === 'withdrawal confirm' || name === 'first_withdrawal confirm')) {
      let values = {
        'af_revenue': params['stake'],
        'af_currency': 'USD'
      }
      args = eventMapper[name] + '+' + JSON.stringify(values)
    }
    console.log('appsFlyer args: ', args)
    try {
      console.log('userAgent', userAgent.os)
      if (userAgent.os === 'ios' && args) {
        console.log('send to apps flyer bridge - ', args)
        window.webkit.messageHandlers.appsFlyer.postMessage(args)
      }
      if (userAgent.os === 'android' && args) {
        console.log('send to apps flyer bridge - ', args)
        /* eslint-disable */
        android.appsFlyer(args)
        /* eslint-enable */
      }
    } catch (error) {
      console.warn('appsFlyer Bridge Error - ', {'error': error})
    }
  }
}
/* end of appsFlyer block */

/* Xtremepush Web and mobile */

function xtremePush (event) {
  if (window.xtremepush) {
    console.log('xtremepush desktop/site event:', event)
    if (Object.keys(event).length === 3) {
      window.xtremepush(event.param1, event.param2, event.param3)
      return false
    }
    window.xtremepush(event.param1, event.param2)
    return false
  }
  if (config.app.autoconf.XTREMEPUSH_ANALYTICS && config.app.autoconf.XTREMEPUSH_ANALYTICS.MOBILE_APP) {
    console.log('xtremepush mobile app event:', event)
    let args
    if (Object.keys(event).length === 2) args = event.param2
    if (Object.keys(event).length === 3) {
      args = event.param2 + '+' + JSON.stringify(event.param3)
    }
    try {
      if (userAgent.os === 'ios' && args) {
        console.log('send to xtremepush bridge - ', args)
        window.webkit.messageHandlers.xtremePush.postMessage(args)
      }
      if (userAgent.os === 'android' && args) {
        console.log('send to xtremepush bridge - ', args)
        /* eslint-disable */
        android.xtremePush(args)
        /* eslint-enable */
      }
    } catch (error) {
      console.warn('xtremepush Bridge Error - ', {'error': error})
    }
  }
}

/* end of Xtremepush block */

const userAgent = {
  get os () {
    return lib.core.userAgent.os.name
  }
}

export default {
  setUserProperty,
  dataParser,
  xtremePush
}
