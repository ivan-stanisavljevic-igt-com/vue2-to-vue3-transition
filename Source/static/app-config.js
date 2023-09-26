/**
 * Object with entries that will override the original configuration values produced by build. Uncomment and populate the relevant config to use it
 * Do not reference directly in the code. Use via config.app.autoconf.XXX
 */
 window.ctsautoconf = window.ctsautoconf || {}
 window.ctsautoconf.TRANSACTION_SERVER_CALL_MODE = 'API'  // Request mode to transaction sever, 'API'(new CTS) or 'RPC'(old Texas)
 window.ctsautoconf.TRANSACTION_SERVER_API_VERSION = 'v1'  // Api Transaction server API version
 window.ctsautoconf.TRANSACTION_SERVER_API_AUTO_REFRESH_TOKEN = false  // Will refresh token call execute on 401 automatically
 window.ctsautoconf.IS_BUYBACK_ENABLED = false
 window.ctsautoconf.BUYBACK_REFRESH_INTERVAL = 30 // refresh period in seconds for BuyBack offer in history. 0 to disable.
 window.ctsautoconf.SHOW_LEG_STATUS_IN_BETHISTORY = false
 window.ctsautoconf.BETSLIP = {
   config: {
     maxSno: 25,
     showEventTsStart: false,
     showEventTsInBetHistory: false,
     isFastBetEnabled: true,
     calculateAsync: true,
     updateBetSlipInt: {
       default: 60,
       live: 20
     },
     derivatives: {
       teasers: {
         mixed: true,
         defaultActiveLevel: {
           NFL: 'T1'
         }
       },
       pitchers: {
         enabled: true
       },
       buyPoints: {
         enabled: true
       }
     },
     SGM: {
       enabled: true,
       display: {
         showProviderDetailedError: false
       }
     },
     SGMplus: {
       enabled: true
     },
     specialOffers: {
       enabled: false,
       translations: {
         // 'SpecialOffer.PARLAYINSURANCE.offer.Description': '',
         // 'SpecialOffer.PARLAYBOOST.offer.Description': '%{Description}',
       }
     }
   },
   isFOPreferredInSingles: true,
   isFPPreferredInMultiples: true,
   priceTypesToIgnore: ['SGM'],
   fastBetSlip: {
     rememberSingleBetSlipStake: true
   }
 }
 window.ctsautoconf.INJECT_SELECTIONS_FROM_3RD_PARTY = {
   abortIfHasSuspended: !true,
   allowSuspended: true
 }
 // if SHOW_ZERO_HCP_AS_PK = true and handicap = 0, will be shown as 'PK'
 window.ctsautoconf.SHOW_ZERO_HCP_AS_PK = false

 window.ctsautoconf.LANGUAGE = 'UK'
 window.ctsautoconf.CURRENCY = '$'
 window.ctsautoconf.TIME_ZONE = 'America/New_York'
 window.ctsautoconf.BRAND = 'igt'
 window.ctsautoconf.SIGHTLINE_IMG = true
 window.ctsautoconf.SHOW_BETHISTORY_IN_BETSLIP = true
 window.ctsautoconf.WELCOME_PAGE = false
 window.ctsautoconf.HIDE_PITCHER_NAME = false
 window.ctsautoconf.SHOW_TEAM_LOGOS = false

 window.ctsautoconf.TRANSACTION_SERVER_API_CALL_OVERRIDES = {  // Api Transaction server overrides
 }
 /* Add to array below what you want to display on transaction history (AmountDebit, AmountCredit, CurrentBalance, WithdrawalBalance, TradingBalance) */
 window.ctsautoconf.transaction_history_amounts = ['AmountDebit', 'AmountCredit', 'CurrentBalance', 'PromoBalance']

 /* user notification before session ends */
 // window.ctsautoconf.sessionExpirationInterval = 30000 // 30 seconds
 window.ctsautoconf.sessionExpirationInterval = false

 // with the parameter window.ctsautoconf.TermsAndConditionsIsMandatory = true we specify that user has to accept T&C in order to register account
 // with the parameter window.ctsautoconf.TermsAndConditionsIsMandatory = false we specify that user can register account without T&C
 // if this parameter missing in configuration it will considered that user has to accept T&C in order to register account
 window.ctsautoconf.TermsAndConditionsIsMandatory = true
 // autologin after registration
 window.ctsautoconf.autologinAfterRegistration = true
 window.ctsautoconf.LIVE_SPORTS_IDS = [
   'FOOTBALL',
   'TENNIS',
   'BASKETBALL',
   'BASEBALL',
   'SOCCER',
   'NFL',
   'ICE HOCKEY',
   'GOLF',
   'BOXING',
   'MMA',
   'DARTS',
   'AUSRULES',
   'MOTORSPORT',
   'CRICKET',
   'RUGBY',
   'RUGBYUNION',
   'RBLNRL',
   'RUGBYLEAGUE',
   'TABLE TENNIS',
   'ESPORTS',
   'COLL BSKT'
 ]
 /*
  * Define group of PM providers that don't have combined EV/PS/WS/WPS pool types
  * and bet has to be placed as separated: WIN, PLACE and SHOW bets
  * */
 window.ctsautoconf.providersWithSeparateBetForWPS = [
   'LVDC'
 ]
 // scan drivers license (prop was only renamed previously MICROBLINK)
 window.ctsautoconf.SCAN_DRIVERS_LICENSE = true
 // headlines update interval
 window.ctsautoconf.HeadlinesPeriodicalUpdateInterval = 300000
 /**
  * Define groups of router path(s) and control their access.
  * Router route will be checked if contains meta element named 'nav-group-key'. Router link will be disallowed only if 'navgroupkey' matches this config and config isactive == false. If dissallowed, will redirect to "exit"
  * */
 window.ctsautoconf.ROUTERNAVGROUPS = {
   groups: [
     { key: 'sports', isactive: true, exitpath: '/pm' },
     { key: 'pm', isactive: false, exitpath: '/' }
   ],
   /** Kind of navigation coverage for the site - mixed|sports|pm. "sports" - site will act as sports only, "pm" - as pm only, "mixed" - all parts will be accessible */
   navset: 'sports',
   /** What kind of statement/bet history filters to show - mixed|sports|pm */
   statementset: 'sports'
 }
 // translation: false - translations are in static/translation; true -translations are on Media server
 window.ctsautoconf.mediaServerTranslation = false
 window.ctsautoconf.customerContextUpdateInterval = 60000 // 1 minute
 window.ctsautoconf.includeHouseRulesInRegistrationPage = false
 window.ctsautoconf.displayAllGamePeriodsAsBig3 = false

 // BR Widgets config
 window.ctsautoconf.BR_WIDGET_ENABLED = false // true/false
 window.ctsautoconf.BR_WIDGET_VERSION = '' // 'V2'
 window.ctsautoconf.BR_WIDGET_CLIENTID = '' // received from BR for specific client
 window.ctsautoconf.BR_WIDGET_SPORTS = [] // array of IDFOSPORTTYPES

 window.ctsautoconf.DISABLE_PROPAGATE_HEADLINES_FROM_PARENT_BONODES = true

 // username and password min and max length
 window.ctsautoconf.userNameMinLength = 5
 window.ctsautoconf.userNameMaxLength = 15
 window.ctsautoconf.pwdMinLength = 8
 window.ctsautoconf.pwdMaxLength = 15

 // days left information in password expiration message: default - false; true - message doesn't include days left; false - message include days left information
 window.ctsautoconf.HideDaysLeftInfo = false

 // google places api key for website (for mobile app: key has to be null; for website: the key to be provided by the client)
 window.ctsautoconf.GooglePlacesApiKey = null // window.ctsautoconf.GooglePlacesApiKey = 'the key to be provided by the client'
 // google places api for mobile app (for mobile app: true; for website: false)
 window.ctsautoconf.GooglePlacesApiMobileAppEnabled = false

 // search
 window.ctsautoconf.IS_SEARCH_ENABLED = true
 window.ctsautoconf.SEARCH_NUMBER_OF_CHARS_TO_START = 3

 // BUILD_VERSION display in the website footer
 // should be populated by devops in the buildtime ('1.2.16', '2.1.15'...)
 // 'BUILD_VERSION' string or falsy values will not be displayed at all
 window.ctsautoconf.BUILD_VERSION = 'BUILD_VERSION'

 // Affiliate integration exists/doesn't exist in the system: default value is false; true - exists; false - doesn't exist
 window.ctsautoconf.INCOME_ACCESS_ENABLED = false

// Big 3 column order by sport type
 window.ctsautoconf.BIG3_COLUMN_ORDER = {
   'NFL': ['PS', 'TP', 'ML'],
   'BASKETBALL': ['PS', 'TP', 'ML'],
   'BASEBALL': ['ML', 'TP', 'PS'],
   'ICE HOCKEY': ['ML', 'TP', 'PS'],
   'MMA': ['ML', 'TP', 'PS']
 }

/** List of sport types that should not be considered for Big3 layouts */
 window.ctsautoconf.BIG3_IGNORE_SPORTTYPES = ['SOCCER', 'TABLE TENNIS', 'TENNIS', 'DARTS', 'MMA', 'BOXING']

 // Price format fractions
 window.ctsautoconf.US_PRICE_FORMAT_SIMPLE_FRACTIONS = true

 // apps download page: true - if android app is available on Google Play store
 window.ctsautoconf.DOWNLOAD_APPS_SINGLE_PAGE = false

 // the time period (in milliseconds) when the pop up shows the info about current session duration - default 1800000 (30min) (for the purpose of responsible gaming)
 // window.ctsautoconf.SESSION_TIME_POPUP = false // pop-up disabled
 window.ctsautoconf.SESSION_TIME_POPUP = false

 // disable Join button: false - performs the standard registration; true- shows a popup of an alternative registration method
 window.ctsautoconf.DISABLE_JOIN_BUTTON = false

 // acceptable username type when logging in: UN - only username; EMAIL - only email; MIXED - username or email
 window.ctsautoconf.loginUsernameType = 'MIXED'

 // The time period (in milliseconds) of ip check for the purpose of geo-location (if ip has been changed in this period user will be geo-located again)
 window.ctsautoconf.IP_CHECK_INTERVAL = 60000 // 1 min

 // Session refresh time period (in milliseconds) if user is active
 window.ctsautoconf.CHECK_ACTIVITY_INTERVAL = 180000 // 3 min

 // Mobile Bottom navigation items ('HOME', 'SPORTS', 'BETSLIP', ('PROMOS' or 'INFO'),'CONTESTS', PROFILE, 'HAMB_MENU') - Does not work for PM, only Sports site
 window.ctsautoconf.MOBILE_BOTTOMNAV_MENUITEMS = ['HOME', 'SPORTS', 'BETSLIP', 'PROMOS', 'PROFILE']

 /* allow cashinshop withdrawal rounding to the nearest 5 cents.
  * E.G. 5.32 will be rounded to a 5.30, 7.88 will be rounded to a 7.90 */
 window.ctsautoconf.CASHINSHOP_ROUND_TO_5_CENTS = true

 // Refer a friend promo code in registration page
 // window.ctsautoconf.UseRafPromoCode = true - Promo code will be visible in registration page
 // window.ctsautoconf.UseRafPromoCode = false - Promo code will not be visible in registration page
 // if this parameter missing in configuration - Promo code will not be visible in registration page
 window.ctsautoconf.UseRafPromoCode = true

 // Should username be remembered on login form (even after logout)
 window.ctsautoconf.LOGIN_USERNAME_PERSIST = false

 // Read Only BO
 window.ctsautoconf.ROBO = false
 window.ctsautoconf.SHOW_APP_DOWNLOAD_POPUP_FOR_ROBO = false

 // Should only participant short names be used on event coupons on mobile
 window.ctsautoconf.USE_ONLY_SHORT_PARTICIPANT_NAMES_ON_MOBILE = false

 // Time offset (in seconds) before which race is considered next for betting and will be selected from PM navigation. Accepts both positive and negative values. Negative values allow "after post" races to be considered "next" too.
 window.ctsautoconf.PM_NEXT_RACE_TIME_TO_START_OFFSET = 60

 // Default value: true; if true, popup dialog will appear with the error that is occuring, i.e. network error...
 window.ctsautoconf.SHOW_UNKNOWN_ERROR_MODAL = true

// Favorites true/false
 window.ctsautoconf.PLAYER_FAVORITES = false

// Contests true - contests enabled, false - contests disabled
 window.ctsautoconf.CONTESTS = false

// application rating - native dialog will appear based on native condition
 window.ctsautoconf.APP_RATING = {
   ENABLE: true,
   DELAY: 2000,
   BET_COUNT: 20
 }

/** ** Hide results for live events ****/
 window.ctsautoconf.HIDE_SCORES = false
/** Rilot like headlines - ONLY for GENERIC brands **/
 window.ctsautoconf.HEADLINES_TILES = false
/** Teaser and RR conditionaly in betslip footer - ONLY for GENERIC brands **/
 window.ctsautoconf.BETSLIP_LAYOT_2 = false
/** Display SidebarBanners category headlines on home page as secondary banner and on sport pages instead of sports breadcrumb - ONLY for GENERIC brands **/
 window.ctsautoconf.SECONDARY_BANNERS = false
/** Rilot like page titles in header on mobile (should be true only if SECONDARY_BANNERS are true)**/
 window.ctsautoconf.PAGE_TITLE_IN_HEADER_ON_MOBILE = false
/** Shows new welcome page if true, initialy made for Rilot **/
 window.ctsautoconf.SHOW_WELCOME = false
/** Shows whats new page if true, initialy made for Rilot **/
 window.ctsautoconf.SHOW_WHATS_NEW = false
/** Is local tax info displayed on W2GForm (accounting section) screen **/
 window.ctsautoconf.SHOW_LOCALTAX_IN_W2GFORM = false
 // display popup with limits on post registration
 window.ctsautoconf.SHOW_LIMITS_AFTER_REGISTRATION = false
// Use Betting Data Matcher service
window.ctsautoconf.BETTING_DATA_MATCHER = false
// Disable forgotten password reset via emial
window.ctsautoconf.DISABLE_FORGOTTEN_PASSWORD_VIA_EMAIL = false
// Disable Login In /sports redirect
window.ctsautoconf.DISABLE_LOGIN_REDIRECT = false
/** Minimum days for Cool-Off/Self-exclusion **/
window.ctsautoconf.MIN_NUM_OF_DAYS_FOR_COOL_OFF = 1

window.ctsautoconf.HIDE_WITHRAWAL_BUTTON_FOR_PAYNEARME_PUSH_DEBIT = false
