
/*
Airbridge is a javascript browser plugin and widget that enables two-way
communication between the App and a website (Web --> GAN) running within the app.
*/

import store from '@/store'
import Screen from '@/components/mixins/Screen'
import config from '@/config'

export default {
  mixins: [
    Screen
  ],
  data: () => ({
    isGelocated: false
  }),
  computed: {
    isOpenedFromWebView () {
      return store.getters['getIsOpenedFromWebView']
    },
    walletProvider () {
      return config.app.autoconf.WALLET_PROVIDER
    }
  },
  methods: {
    /* connection from sportsbook to GAN app */
    airBridgeRequest (type, object) {
      let jsonObj = {}
      let objKey = Object.keys(object)[0]
      let objValue = Object.values(object)[0]
      jsonObj['type'] = type
      if (Object.getOwnPropertyNames(object).length > 0) {
        jsonObj[objKey] = objValue
      }
      window.AirBridge.evoke(JSON.stringify(jsonObj))
    },
    setGeolocation () {
      localStorage.mobileGeolocated = this.isGelocated
      store.commit('setGeolocated', this.isGelocated)
      if (!this.isGelocated) {
        store.commit('setGeolocated', false)
      }
    },
    /* inject event listener and establish connection from GAN app to sportsbook */
    geoResponsePostMessageListener () {
      window.addEventListener('message', (event) => {
        window.airBridgeListenerExists = true
        if (event.data.name === 'geoResponse') {
          console.log('PAYLOAD')
          console.log(event.data.payload)
          var isLocated = event.data.payload.isLocated
          var isFirstCheck = event.data.payload.isFirstCheck
          var GeoMessage = false
          var retryCount = event.data.payload.retry_count
          var GeoMessageLength = 1
          var geoInProgress = event.data.payload.geoInProgress
          if (geoInProgress) { // geolocation in PROGRESS
            this.isGelocated = false
            store.commit('setMobileGeolocationInProgress', {'display': true, 'inProgress': true, 'postContentFailed': false, 'isFirstCheck': isFirstCheck})
          } else if ((!geoInProgress) && isLocated !== '') {
            if (!isLocated) { // geolocation FAILED
              this.isGelocated = false
              if (event.data.payload.geoMessage !== undefined) {
                GeoMessage = JSON.parse(event.data.payload.geoMessage)
                GeoMessageLength = (GeoMessage.errors.length === 0) ? 1 : GeoMessage.errors.length
              }
              if (event.data.payload.errorType) {
                var errorType = event.data.payload.errorType
              }
              let data = { 'count': GeoMessageLength, 'errorType': errorType, 'errors': GeoMessage.errors, 'retryCount': retryCount, 'payload': event.data.payload }
              console.log('DATA')
              console.log(data)

              let errorCode = 'mobileGeoResponse'
              store.commit('overlayState/setGeolocationMessage', { errorCode, data })
              store.commit('setMobileGeolocationInProgress', {'display': true, 'inProgress': false, 'postContentFailed': true, 'count': GeoMessageLength, 'retryCount': retryCount})
            } else { // geolocation SUCCESS
              this.isGelocated = true
              store.commit('setMobileGeolocationInProgress', {'display': true, 'inProgress': false, 'postContentSuccess': true, 'isFirstCheck': isFirstCheck})
              setTimeout(() => {
                store.commit('setMobileGeolocationInProgress', {'display': false})
              }, 2000)
            }
          }
          this.setGeolocation()
        }
      }, false)
    }
  },
  mounted () {
    if (!window.airBridgeListenerExists && this.isOpenedFromWebView && this.walletProvider === 'GAN') {
      this.geoResponsePostMessageListener()
    }
  }
}
