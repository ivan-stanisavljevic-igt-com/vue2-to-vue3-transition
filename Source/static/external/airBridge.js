/* eslint-disable */
window.AirBridge = (function () {
  var Instance
  function createInstance () {
    return { useWindowLocation: true }
  }
  return {
    setUseWindowLocation: function ($shouldUseWindowLocation) {
      if (!Instance) {
        Instance = createInstance()
      }
      Instance.useWindowLocation = $shouldUseWindowLocation
    },
    evoke: function ($message) {
      console.log('AirBridge $message')
      console.log($message)
      if (!Instance) {
        Instance = createInstance()
      }
      if (!Instance.useWindowLocation) {
        NativeWebView.airBridge($message)
      } else {
        window.location = 'airBridge:' + $message
      }
    }
  }
})()
