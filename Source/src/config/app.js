/* eslint-disable */
var contentHost = (window.ctsautoconf.CONTENT_SERVER_HOSTNAME.indexOf('http://') > -1 || window.ctsautoconf.CONTENT_SERVER_HOSTNAME.indexOf('https://') > -1) ? new URL(window.ctsautoconf.CONTENT_SERVER_HOSTNAME).host : window.ctsautoconf.CONTENT_SERVER_HOSTNAME
var contentProtocol = (window.ctsautoconf.CONTENT_SERVER_HOSTNAME.indexOf('http://') > -1 || window.ctsautoconf.CONTENT_SERVER_HOSTNAME.indexOf('https://') > -1) ? new URL(window.ctsautoconf.CONTENT_SERVER_HOSTNAME).protocol + '//' : '//'
var contentPrefix = (window.ctsautoconf.CONTENT_SERVER_HOSTNAME_PREFIX ? window.ctsautoconf.CONTENT_SERVER_HOSTNAME_PREFIX : '')
export default {
  businessUnit: 1,
  region: (window.ctsautoconf && window.ctsautoconf.REGION) || 1,
  language: (window.ctsautoconf && window.ctsautoconf.LANGUAGE) || 'UK',
  BRAND: (window.ctsautoconf && window.ctsautoconf.BRAND) ? window.ctsautoconf.BRAND : 'igt',
  CURRENCY: (window.ctsautoconf && window.ctsautoconf.CURRENCY) ? window.ctsautoconf.CURRENCY : '$',
  SIGHTLINE_IMG: (window.ctsautoconf && window.ctsautoconf.SIGHTLINE_IMG) || false,
  priceFormat: 'US',
  loginRedirectPage: 'sports',
  liveBettingDataSourceType: '', // - PULL - use kansas; leave it empty for auto switch push/pull
  environmentName: process.env.NODE_ENV, // environment name
  contentServerHostname: (contentProtocol + contentPrefix + (window.ctsautoconf.CONTENT_SERVER_HOSTNAME ? contentHost : window.location.hostname)),
  webPushServiceHostname: ((window.ctsautoconf && window.ctsautoconf.WEBPUSH_SERVICE_HOSTNAME) || '').replace(/:\s*$/, '') || '',
  portPerEnvironment: window.ctsautoconf && window.ctsautoconf.portPerEnvironment ? window.ctsautoconf.portPerEnvironment : {
    'default': '',
    'lbcts.webteam.beg.finsoft.com': '',
    'www.e1.ppbf.qa.beg.finsoft.com': ':4443',
    'cts.webteam.beg.finsoft.com': ':9090',
    'perf.cts.webteam.beg.finsoft.com': ':9090'
  },
  udpateIntervals: {
    marketGroupPeriodicalUpdateInterval: window.ctsautoconf && window.ctsautoconf.marketGroupPeriodicalUpdateInterval ?  window.ctsautoconf.marketGroupPeriodicalUpdateInterval : 60000,
    prematchPeriodicalUpdateInterval: window.ctsautoconf && window.ctsautoconf.prematchPeriodicalUpdateInterval ?  window.ctsautoconf.prematchPeriodicalUpdateInterval : 60000,
    livePeriodicalUpdateInterval: window.ctsautoconf && window.ctsautoconf.livePeriodicalUpdateInterval ?  window.ctsautoconf.livePeriodicalUpdateInterval : 10000
  },
  dateFormats: {
    longDate: 'MM/DD/YYYY',
    shortDate: 'M/D/YY',
    shortDateMG: 'M/D/YY',
    shortDateTime: 'MM/DD/YY h:mm A',
    longDateTime: 'MM/DD/YYYY h:mmA',
    longDateTimeMG: 'MM/DD/YYYY h:mmA',
    longDateTimePlusSecondsAmPm: 'MMMM Do YYYY, h:mm:ss a',
    longTime: 'h:mmA',
    dayAndMonth: 'DD MMMM',
    dayAndMonthUS: 'MMMM DD',
    iso8601: 'YYYY-MM-DDTHH:mm:ss',
    longDateTimeWithName: 'DDD MMM d h:mmA',
    overrides: {
      'circa': {
        shortDateMG: 'ddd MMM D',
        longDateTimeMG: 'ddd MMM D h:mmA',
        dayAndMonth: 'ddd MMM D'
      },
      'qcasino': {
        shortDateMG: 'ddd MMM D',
        longDateTimeMG: 'ddd MMM D h:mmA'
      },
      'pr': {
        shortDateMG: 'ddd MMM D',
        longDateTimeMG: 'ddd MMM D / h:mmA'
      }
    }
  },
  timeZone: (window.ctsautoconf && window.ctsautoconf.TIME_ZONE) || 'America/New_York',
  allowInPlayTeasers: false,
  betHistoryInBetslip: (window.ctsautoconf && window.ctsautoconf.SHOW_BETHISTORY_IN_BETSLIP) || false,
  checkActivityInterval: window.ctsautoconf && window.ctsautoconf.CHECK_ACTIVITY_INTERVAL ?  window.ctsautoconf.CHECK_ACTIVITY_INTERVAL : 180000, // 3 minutes
  /**
   * Web applicate data attached to window state. Different parts of PSWS (this website/app) store small bits of data in that object
   */
  webappstate: {},
  /**
   * Automated configuration values - uses package variables with override via static/app-conf.js
   */
  autoconf: {
    CONTENT_SERVER_HOSTNAME: window.ctsautoconf && window.ctsautoconf.CONTENT_SERVER_HOSTNAME,
    CONTENT_SERVER_HOSTNAME_PREFIX: window.ctsautoconf && window.ctsautoconf.CONTENT_SERVER_HOSTNAME_PREFIX,
    WEB_SERVER_HOSTNAME: window.ctsautoconf && ((!window.ctsautoconf.WEB_SERVER_HOSTNAME || window.ctsautoconf.WEB_SERVER_HOSTNAME.indexOf('//') === -1 ? '//' : '') + (window.ctsautoconf.WEB_SERVER_HOSTNAME ||
      (window.location.hostname + ( window.location.port != '' ?  (window.location.port != '80' ? ':' + window.location.port : '') : '')))),
    BETTING_DATA_MATCHER_SERVICE_HOSTNAME: window.ctsautoconf && ((!window.ctsautoconf.BETTING_DATA_MATCHER_SERVICE_HOSTNAME || window.ctsautoconf.BETTING_DATA_MATCHER_SERVICE_HOSTNAME.indexOf('//') === -1 ? '//' : '') + (window.ctsautoconf.BETTING_DATA_MATCHER_SERVICE_HOSTNAME ||
      (window.location.hostname + ( window.location.port != '' ?  (window.location.port != '80' ? ':' + window.location.port : '') : '')))),
    BETCALC_SERVER_HOSTNAME: window.ctsautoconf && window.ctsautoconf.BETCALC_SERVER_HOSTNAME ? (window.ctsautoconf.BETCALC_SERVER_HOSTNAME.indexOf('//') === -1 ? '//' : '') + window.ctsautoconf.BETCALC_SERVER_HOSTNAME : '',
    SEARCH_MANAGER_HOSTNAME: window.ctsautoconf && ((!window.ctsautoconf.SEARCH_MANAGER_HOSTNAME || window.ctsautoconf.SEARCH_MANAGER_HOSTNAME.indexOf('//') === -1 ? '//' : '') + (window.ctsautoconf.SEARCH_MANAGER_HOSTNAME ||
      (window.location.hostname + ( window.location.port != '' ?  (window.location.port != '80' ? ':' + window.location.port : '') : '')))),
    WALLET_URL: window.ctsautoconf && window.ctsautoconf.WALLET_URL,
    GEOCOMPLY_URL: window.ctsautoconf && window.ctsautoconf.GEOCOMPLY_URL,
    WEBPUSH_SERVICE_HOSTNAME: window.ctsautoconf && window.ctsautoconf.WEBPUSH_SERVICE_HOSTNAME,
    STATE: window.ctsautoconf && window.ctsautoconf.STATE,
    IS_BUYBACK_ENABLED: window.ctsautoconf && window.ctsautoconf.IS_BUYBACK_ENABLED ? window.ctsautoconf.IS_BUYBACK_ENABLED : false,
    BUYBACK_REFRESH_INTERVAL: window.ctsautoconf && window.ctsautoconf.BUYBACK_REFRESH_INTERVAL ? window.ctsautoconf.BUYBACK_REFRESH_INTERVAL : 0,
    WALLET_PROVIDER: window.ctsautoconf && window.ctsautoconf.WALLET_PROVIDER ? window.ctsautoconf.WALLET_PROVIDER : '',
    LANGUAGE: (window.ctsautoconf && window.ctsautoconf.LANGUAGE) || 'UK',
    TRANSACTION_SERVER_CALL_MODE: window.ctsautoconf && window.ctsautoconf.TRANSACTION_SERVER_CALL_MODE ? window.ctsautoconf.TRANSACTION_SERVER_CALL_MODE : 'API',
    TRANSACTION_SERVER_API_VERSION: window.ctsautoconf && window.ctsautoconf.TRANSACTION_SERVER_API_VERSION ? window.ctsautoconf.TRANSACTION_SERVER_API_VERSION : 'v1',
    BETCALC_SERVER_API_VERSION: window.ctsautoconf && window.ctsautoconf.BETCALC_SERVER_API_VERSION ? window.ctsautoconf.BETCALC_SERVER_API_VERSION : '',
    BETCALC_SERVER_API_NAME: window.ctsautoconf && window.ctsautoconf.BETCALC_SERVER_API_NAME ? window.ctsautoconf.BETCALC_SERVER_API_NAME : '',
    TRANSACTION_SERVER_API_AUTO_REFRESH_TOKEN: window.ctsautoconf && window.ctsautoconf.TRANSACTION_SERVER_API_AUTO_REFRESH_TOKEN ? window.ctsautoconf.TRANSACTION_SERVER_API_AUTO_REFRESH_TOKEN : false,
    TRANSACTION_SERVER_API_CALL_OVERRIDES: window.ctsautoconf && window.ctsautoconf.TRANSACTION_SERVER_API_CALL_OVERRIDES ? window.ctsautoconf.TRANSACTION_SERVER_API_CALL_OVERRIDES : {},
    GOOGLE_TAGMNGR_ID: window.ctsautoconf && window.ctsautoconf.GOOGLE_TAGMNGR_ID,
    WELCOME_PAGE: window.ctsautoconf && window.ctsautoconf.WELCOME_PAGE ? window.ctsautoconf.WELCOME_PAGE : false,
    ROUTERNAVGROUPS: window.ctsautoconf && window.ctsautoconf.ROUTERNAVGROUPS ? window.ctsautoconf.ROUTERNAVGROUPS : { groups: [], navset: 'sports' },
    PROVIDERSWITHSEPARATEBETFORWPS: window.ctsautoconf && window.ctsautoconf.providersWithSeparateBetForWPS ? window.ctsautoconf.providersWithSeparateBetForWPS : [],
    HIDE_PITCHER_NAME: window.ctsautoconf && window.ctsautoconf.HIDE_PITCHER_NAME ?  window.ctsautoconf.HIDE_PITCHER_NAME : false,
    FIREBASE_ANALYTICS: window.ctsautoconf && window.ctsautoconf.FIREBASE_ANALYTICS ?  window.ctsautoconf.FIREBASE_ANALYTICS : false,
    APPSFLYER_ANALYTICS: window.ctsautoconf && window.ctsautoconf.APPSFLYER_ANALYTICS ?  window.ctsautoconf.APPSFLYER_ANALYTICS : false,
    DISPLAY_ALL_GAMEPERIODS_AS_BIG3: window.ctsautoconf && window.ctsautoconf.displayAllGamePeriodsAsBig3 ? window.ctsautoconf.displayAllGamePeriodsAsBig3 : false,
    SHOW_TEAM_LOGOS: window.ctsautoconf && window.ctsautoconf.SHOW_TEAM_LOGOS ? window.ctsautoconf.SHOW_TEAM_LOGOS : false,
    BIG3_COLUMN_ORDER: window.ctsautoconf && window.ctsautoconf.BIG3_COLUMN_ORDER ? window.ctsautoconf.BIG3_COLUMN_ORDER : {},
    BIG3_IGNORE_SPORTTYPES: window.ctsautoconf && window.ctsautoconf.BIG3_IGNORE_SPORTTYPES ? window.ctsautoconf.BIG3_IGNORE_SPORTTYPES : ['SOCCER', 'TABLE TENNIS', 'TENNIS', 'DARTS', 'MMA', 'BOXING'],
    US_PRICE_FORMAT_SIMPLE_FRACTIONS: window.ctsautoconf && window.ctsautoconf.US_PRICE_FORMAT_SIMPLE_FRACTIONS ? window.ctsautoconf.US_PRICE_FORMAT_SIMPLE_FRACTIONS : false,
    INCOME_ACCESS_ENABLED: window.ctsautoconf && window.ctsautoconf.INCOME_ACCESS_ENABLED ? window.ctsautoconf.INCOME_ACCESS_ENABLED : false,
    LOGIN_USERNAME_TYPE: window.ctsautoconf && window.ctsautoconf.loginUsernameType ? window.ctsautoconf.loginUsernameType : 'MIXED',
    LOGIN_USERNAME_PERSIST: window.ctsautoconf && window.ctsautoconf.LOGIN_USERNAME_PERSIST ? window.ctsautoconf.LOGIN_USERNAME_PERSIST : false,
    ROBO: window.ctsautoconf && window.ctsautoconf.ROBO ? window.ctsautoconf.ROBO : false,
    USE_ONLY_SHORT_PARTICIPANT_NAMES_ON_MOBILE: window.ctsautoconf && window.ctsautoconf.USE_ONLY_SHORT_PARTICIPANT_NAMES_ON_MOBILE ? window.ctsautoconf.USE_ONLY_SHORT_PARTICIPANT_NAMES_ON_MOBILE : false,
    PM_NEXT_RACE_TIME_TO_START_OFFSET: window.ctsautoconf && window.ctsautoconf.PM_NEXT_RACE_TIME_TO_START_OFFSET ? window.ctsautoconf.PM_NEXT_RACE_TIME_TO_START_OFFSET : 60,
    SESSION_TIME_POPUP: window.ctsautoconf && window.ctsautoconf.SESSION_TIME_POPUP ? window.ctsautoconf.SESSION_TIME_POPUP : false,
    AUTO_LOGIN_AFTER_REGISTRATION: window.ctsautoconf && window.ctsautoconf.autologinAfterRegistration !== undefined ? window.ctsautoconf.autologinAfterRegistration : true,
    USE_RAF_PROMO: window.ctsautoconf && window.ctsautoconf.UseRafPromoCode !== undefined ? window.ctsautoconf.UseRafPromoCode : false,
    GOOGLE_PLACES_API_KEY: window.ctsautoconf && window.ctsautoconf.GooglePlacesApiKey ? window.ctsautoconf.GooglePlacesApiKey : null,
    GOOGLE_PLACES_API_MOBILE_APP_ENABLED: window.ctsautoconf && window.ctsautoconf.GooglePlacesApiMobileAppEnabled !== undefined ? window.ctsautoconf.GooglePlacesApiMobileAppEnabled : false,
    SCAN_DRIVERS_LICENSE: window.ctsautoconf && window.ctsautoconf.SCAN_DRIVERS_LICENSE !== undefined ? window.ctsautoconf.SCAN_DRIVERS_LICENSE : true,
    HOUSE_RULES_REGISTRATION: window.ctsautoconf && window.ctsautoconf.includeHouseRulesInRegistrationPage !== undefined ? window.ctsautoconf.includeHouseRulesInRegistrationPage : false,
    TERMS_CONDITIONS_IS_MANDATORY: window.ctsautoconf && window.ctsautoconf.TermsAndConditionsIsMandatory !== undefined ? window.ctsautoconf.TermsAndConditionsIsMandatory : true,
    USER_NAME_MIN_LENGTH: window.ctsautoconf && window.ctsautoconf.userNameMinLength,
    USER_NAME_MAX_LENGTH: window.ctsautoconf && window.ctsautoconf.userNameMaxLength,
    PWD_MIN_LENGTH: window.ctsautoconf && window.ctsautoconf.pwdMinLength,
    PWD_MAX_LENGTH: window.ctsautoconf && window.ctsautoconf.pwdMaxLength,
    APP_RATING: window.ctsautoconf && window.ctsautoconf.APP_RATING && window.ctsautoconf.APP_RATING.ENABLE ? window.ctsautoconf.APP_RATING : false,
    SHOW_LEG_STATUS_IN_BETHISTORY: window.ctsautoconf && window.ctsautoconf.SHOW_LEG_STATUS_IN_BETHISTORY ? window.ctsautoconf.SHOW_LEG_STATUS_IN_BETHISTORY : false,
    MOBILE_DEBUGGER_DIALOG: window.ctsautoconf && window.ctsautoconf.MOBILE_DEBUGGER_DIALOG ? window.ctsautoconf.MOBILE_DEBUGGER_DIALOG : false,
    XTREMEPUSH_ANALYTICS: window.ctsautoconf && window.ctsautoconf.XTREMEPUSH_ANALYTICS ?  window.ctsautoconf.XTREMEPUSH_ANALYTICS : false,
    SHOW_WELCOME: window.ctsautoconf && window.ctsautoconf.SHOW_WELCOME ? window.ctsautoconf.SHOW_WELCOME : false,
    SHOW_WHATS_NEW: window.ctsautoconf && window.ctsautoconf.SHOW_WHATS_NEW ? window.ctsautoconf.SHOW_WHATS_NEW : false,
    CONTESTS: window.ctsautoconf && window.ctsautoconf.CONTESTS ? window.ctsautoconf.CONTESTS : false,
    CONTESTS_MEDIA_URL: window.ctsautoconf && window.ctsautoconf.CONTESTS_MEDIA_URL ? window.ctsautoconf.CONTESTS_MEDIA_URL : false,
    CLOSE_ACCOUNT_CONFIRMATION_POPUP: window.ctsautoconf && window.ctsautoconf.CLOSE_ACCOUNT_CONFIRMATION_POPUP ? window.ctsautoconf.CLOSE_ACCOUNT_CONFIRMATION_POPUP : false,
    NUVEI_APPLEPAY_PROXY_URL: window.ctsautoconf && window.ctsautoconf.NUVEI_APPLEPAY_PROXY_URL ? window.ctsautoconf.NUVEI_APPLEPAY_PROXY_URL : 'https://cdn.safecharge.com/safecharge_resources/v1/sc_applepay.min.js',
    TRANSACTION_HISTORY_AMOUNTS: window.ctsautoconf && window.ctsautoconf.transaction_history_amounts ? window.ctsautoconf.transaction_history_amounts : [],
    ACCOUNT_SUMMARY_FLOW: window.ctsautoconf && window.ctsautoconf.ACCOUNT_SUMMARY_FLOW ? window.ctsautoconf.ACCOUNT_SUMMARY_FLOW : false,
    SHOW_LOCALTAX_IN_W2GFORM: window.ctsautoconf && window.ctsautoconf.SHOW_LOCALTAX_IN_W2GFORM ? window.ctsautoconf.SHOW_LOCALTAX_IN_W2GFORM : false,
    SHOW_LIMITS_AFTER_REGISTRATION: window.ctsautoconf && window.ctsautoconf.SHOW_LIMITS_AFTER_REGISTRATION ? window.ctsautoconf.SHOW_LIMITS_AFTER_REGISTRATION : false,
    BETTING_DATA_MATCHER: window.ctsautoconf && window.ctsautoconf.BETTING_DATA_MATCHER ? window.ctsautoconf.BETTING_DATA_MATCHER : false,
    DISABLE_FORGOTTEN_PASSWORD_VIA_EMAIL: window.ctsautoconf && window.ctsautoconf.DISABLE_FORGOTTEN_PASSWORD_VIA_EMAIL ? window.ctsautoconf.DISABLE_FORGOTTEN_PASSWORD_VIA_EMAIL : false,
    MIN_NUM_OF_DAYS_FOR_COOL_OFF: window.ctsautoconf && window.ctsautoconf.MIN_NUM_OF_DAYS_FOR_COOL_OFF ? window.ctsautoconf.MIN_NUM_OF_DAYS_FOR_COOL_OFF : false,
    HIDE_WITHRAWAL_BUTTON_FOR_PAYNEARME_PUSH_DEBIT: window.ctsautoconf && window.ctsautoconf.HIDE_WITHRAWAL_BUTTON_FOR_PAYNEARME_PUSH_DEBIT ? window.ctsautoconf.HIDE_WITHRAWAL_BUTTON_FOR_PAYNEARME_PUSH_DEBIT : false
  }
}
