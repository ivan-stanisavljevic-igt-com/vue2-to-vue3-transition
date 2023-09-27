/**
 * Environment configuration - use to define parameters values different per environment
 * Do not reference directly in the code. Use via config.app.autoconf.XXX
 */
window.ctsautoconf = window.ctsautoconf || {}

// content server
window.ctsautoconf.CONTENT_SERVER_HOSTNAME_PREFIX = ''
// window.ctsautoconf.CONTENT_SERVER_HOSTNAME = 'content.sportsbook.iw.igt.rs'
window.ctsautoconf.CONTENT_SERVER_HOSTNAME = 'https://iw.dev.igt.rs'
// window.ctsautoconf.CONTENT_SERVER_HOSTNAME = 'contentsportsbook.dev.gameaccount.com'  // sportsbook.fanduel.com
window.ctsautoconf.MEDIA_CONTENT_HOSTNAME = 'https://iw.dev.igt.rs'
// window.ctsautoconf.MEDIA_CONTENT_HOSTNAME = '//media.mardigras.sportsbook.dn.igt.rs'

// callbroker.ashx
// window.ctsautoconf.WEB_SERVER_HOSTNAME = 'api.sportsbook.iw.igt.rs'
window.ctsautoconf.WEB_SERVER_HOSTNAME = 'https://iw.dev.igt.rs'

// livewire
window.ctsautoconf.WEBPUSH_SERVICE_HOSTNAME = 'https://iw.dev.igt.rs'
// betting data matcher service
window.ctsautoconf.BETTING_DATA_MATCHER_SERVICE_HOSTNAME = ''
window.ctsautoconf.portPerEnvironment = { 'default': '' }

// Search
window.ctsautoconf.SEARCH_MANAGER_HOSTNAME = 'https://iw.dev.igt.rs'

// BetCalculator Service
// window.ctsautoconf.BETCALC_SERVER_HOSTNAME = ''
// window.ctsautoconf.BETCALC_SERVER_API_NAME = ''
// window.ctsautoconf.BETCALC_SERVER_API_VERSION = ''

// setup params
window.ctsautoconf.STATE = 'MD'
window.ctsautoconf.SOFTGEOLOCATION = false
window.ctsautoconf.HARDGEOLOCATION = false
window.ctsautoconf.MOCKUP_GEOCOMPLY = false // GAN mock - should be true on DEV only !!!
window.ctsautoconf.SEO_ENABLED = false  // Set true on SEO Server only.

// wallet - possible wallet values are from - src/config/walletParams.js
window.ctsautoconf.WALLET_PROVIDER = 'SHW'
window.ctsautoconf.EXTERNAL_WALLET_URL = ''

// urls for specific environment
window.ctsautoconf.WALLET_URL = '/account/'
window.ctsautoconf.GOOGLE_TAGMNGR_ID = ''
window.ctsautoconf.FIREBASE_ANALYTICS = false
window.ctsautoconf.XTREMEPUSH_ANALYTICS = {
  WEB_KEY: '', // Web key for Web XP SDK import.
  MOBILE_APP: false, // Enable/disable XP communication between Web and Mobile app.
  CHANNEL: {
    INBOX: true, // Inbox on Web and Mobile app.
    ON_SITE: true, // Banners on Web and Mobile app.
    IN_PLAY_NOTIFICATIONS: false // Live event notifications on Web and Mobile app.
  }
}

// IGT PAY params and URL
window.ctsautoconf.CASHIER_URL = ''
window.ctsautoconf.CASHIER_PARAMS = {}
window.ctsautoconf.IGT_PAY_PROFILES = ''

// download links
window.ctsautoconf.IOS_LINK = ''
window.ctsautoconf.ANDROID_LINK = ''

// Play+ link
window.ctsautoconf.PLAY_PLUS = 'https://playplus.mycardplace.com'

window.ctsautoconf.ACCOUNT_SUMMARY_FLOW = true

// URL for geocomply plugin download. This is important just for desktop, mobile app doesn't use it
// non prod: window.ctsautoconf.GEOCOMPLY_PLUGIN = 'stg-ums.geocomply.net'
// prod: window.ctsautoconf.GEOCOMPLY_PLUGIN = 'ums.geocomply.com'
window.ctsautoconf.GEOCOMPLY_PLUGIN = 'stg-ums.geocomply.net'

window.ctsautoconf.ZINRELO_LOYALTY_REWARDS = {
  PAGE_URL: 'https://zinrelo.dev.igt.rs',
  SDK_URL: 'https://cdn.zinrelo.com/js/all.js',
  PARTNER_ID: 'e6ae3b3b93'
}

window.ctsautoconf.CONTESTS_MEDIA_URL = ''

window.ctsautoconf.MOBILE_DEBUGGER_DIALOG = { // for testing/ non-production ONLY!!
  ENABLED: false,
  DEVICE_ID: []
}

window.ctsautoconf.NUVEI_APPLEPAY_PROXY_URL = 'https://cdn.safecharge.com/safecharge_resources/v1/sc_applepay.min.js'
