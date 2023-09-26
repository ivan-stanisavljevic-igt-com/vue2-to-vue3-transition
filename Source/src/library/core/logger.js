import router from '@/router'
import store from '@/store'

function debugLevel () {
  return (router &&
    router.history &&
    router.history.current &&
    router.history.current.query &&
    router.history.current.query.debug) ||
    store.getters['getDebugLevel'] ||
    -1
}

function debugConsoleLog (message, level) {
  // levels:
  // 0 - always logging
  // 1 - low details logging
  // 2 - middle details logging
  // 3 - high details logging
  if (!level || debugLevel() >= level) {
    console.log(message)
  }
}

export default {
  debugConsoleLog
}
