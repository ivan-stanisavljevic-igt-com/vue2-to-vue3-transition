//  import Vue from 'vue'
import lib from '@/library'
import config from '@/config'
// import GeolocationMessage from '@/components/common/GeolocationMessage'
import GeolocationTroubleshooter from '@/components/common/GeolocationTroubleshooter'
import store from '@/store'

export default {
  components: {
    // GeolocationMessage,
    GeolocationTroubleshooter
  },

  computed: {
    isGeoLocEnabled () {
      return store.getters['sbBetslipState/isGeoLocationEnabled']
    },
    geolocationMessage () {
      return this.isGeoLocEnabled ? store.getters['overlayState/getGeolocationMessage'] : {}
    },
    navigatorID () {
      if (navigator.appVersion.indexOf('Win') !== -1) {
        return 'win'
      } else if (navigator.appVersion.indexOf('Mac') !== -1) {
        return 'mac'
      } else {
        return undefined
      }
    },
    isGeolocated () {
      var isGeolocated = store.getters['getGeolocated']
      return typeof isGeolocated !== 'undefined' ? JSON.parse(isGeolocated) : false
    },
    errorMsgLocalStorage () {
      return this.isGeoLocEnabled ? localStorage.getItem('geoError') : ''
    },
    isOpenedFromWebView () {
      return store.getters['getIsOpenedFromWebView']
    },
    webViewAndMobile () {
      return store.getters['getWebViewAndMobile']
    },
    state () {
      return window.ctsautoconf.STATE
    },
    isHardGeolocation () {
      return window.ctsautoconf.HARDGEOLOCATION
    },
    userAgent () {
      return lib.core.userAgent.os.name
    },
    externalWalletProvider () {
      return config.app.autoconf.EXTERNAL_WALLET_PROVIDER
    },
    webView () {
      var sufix = ''
      if (this.isOpenedFromWebView && this.externalWalletProvider === 'GAN') {
        sufix = '&uiView=true&appVersion=' + sessionStorage.appVersion
      }
      return sufix
    },
    walletParams () {
      return config.walletParams
    },
    geolocationSubmitInternalError () {
      return store.getters['getGeolocationInternalError']
    }
  },

  methods: {
    viewGeoLocationDetails () {
      this.gcMessages()
      store.dispatch('overlayState/activeGeolocationDialog')
    },
    geoLocationPluginDownload () {
      window.location = 'https://' + this.walletParams.installerURL + '/installer/url?id=' + this.walletParams.installerKey +
        '&os=' + this.navigatorID +
        '&version=' + this.walletParams.geocomplyPluginVersion +
        '&user_id=' + this.geolocationMessage.userID
    }
  },

  created () {
  },

  mounted () {
  },

  watch: {
  },

  destroyed () {
  }
}
