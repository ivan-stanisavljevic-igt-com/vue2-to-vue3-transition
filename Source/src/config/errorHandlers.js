
import Vue from 'vue'
import mobileBridge from '@/library/mobileBridge'
if (window.ctsautoconf.MOBILE_LS) {
  (function () {
    var excp = {}
    var warn = {}
    Vue.config.errorHandler = function (err, vm, info) {
      excp['response'] = {
        'data': {
          'Message': err.toString(),
          'ExceptionType': info

        },
        'status': 1,
        'statusText': 'Vue Exception'
      }
      mobileBridge.errorLogger(excp, false, false)
    }
    Vue.config.warnHandler = function (err, vm, info) {
      warn['response'] = {
        'data': {
          'Message': err.toString(),
          'ExceptionType': info

        },
        'status': 2,
        'statusText': 'Vue Warn'
      }
      mobileBridge.errorLogger(warn, false, false)
    }
    window.addEventListener('error', function (e) {
      let msg = e.message
      let stack = e.error.stack
      let err = e.error
      excp['response'] = {
        'data': {
          'Message': msg,
          'ExceptionType': err,
          'Reference': stack

        },
        'status': 0,
        'statusText': 'JavaScript Exception'
      }
      mobileBridge.errorLogger(excp, false, false)
      return false
    })
  })()
}
export default {}
