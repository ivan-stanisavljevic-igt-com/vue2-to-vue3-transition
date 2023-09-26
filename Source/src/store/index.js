import Vue from 'vue'
import Vuex from 'vuex'
import lib from '@/library'
import config from '@/config'
import siteNavigationState from '@/store/modules/sitenavigation'
import statementState from '@/store/modules/statement'
import bonavigationState from '@/store/modules/sports/bonavigation'
import marketgroupState from '@/store/modules/sports/marketgroup'
import sbBetslipState from '@/store/modules/sports/betslipV2/index'
import livebettingState from '@/store/modules/sports/livebetting'
import screenState from '@/store/modules/screen'
import overlayState from '@/store/modules/overlay'
import eventState from '@/store/modules/sports/event'
import sightline from '@/store/modules/wallet/sightline'
import cashinshop from '@/store/modules/payments/cashInShop'
import phoneVerification from '@/store/modules/wallet/phoneVerification'
import notificationPreferences from '@/store/modules/wallet/notificationPreferences'
import accountState from '@/store/modules/account'
import geocomply from '@/library/geocomply'
import geocomplyMethod from '@/library/geocomply/methods'
import mobileBridge from '@/library/mobileBridge'
import router from '@/router'
import api from '@/library/rpcService/api'
import vouchers from '@/store/modules/vouchers'
import racecardState from '@/store/modules/parimutuel/racecard'
import pmBetslipState from '@/store/modules/parimutuel/betslip'
import analyticsBridge from '@/library/analyticsBridge'
import payNearMe from '@/store/modules/payments/payNearMe'
import igtPay from '@/store/modules/payments/igtPay'
import payments from '@/store/modules/payments/payments'
import paysafe from '@/store/modules/payments/paysafe'
import limits from '@/store/modules/wallet/limits'
import messageCenter from '@/store/modules/messageCenter'
import searchState from '@/store/modules/sports/search'
import exclusions from '@/store/modules/exclusions'
import moment from 'moment'
import pnmGateway from '@/store/modules/payments/PayNearMeGateway/pnmGateway'
import registration from '@/store/modules/registration/registration'
import verification from '@/store/modules/verification/verification'
import favorites from '@/store/modules/favorites/favorites'
import favEvents from '@/store/modules/favorites/favEvents'
import background from '@/store/modules/background'
import userEvents from '@/store/modules/userEvents'
import contests from '@/store/modules/contests/contests'
import nuvei from '@/store/modules/payments/Nuvei/nuvei'

Vue.use(Vuex)

var walletProvider = config.walletParams.providerServiceName
var walletParams = config.walletParams
var IPcheckInterval = null
var IPInterval = window.ctsautoconf.IP_CHECK_INTERVAL
var sessionTimeNotifier = null

export default new Vuex.Store({
  state: {
    language: config.app.language,
    sessionDetails: undefined,
    walletBalance: undefined,
    addingFunds: undefined,
    allowedPaymentTypes: undefined,
    loginErrorMessage: '',
    registrationErrorMessage: '',
    logInService: 'UserService',
    isOpenedFromWebView: false,
    loginChallenges: undefined,
    loginChallengesTermsConditions: undefined,
    formSubmitSppiner: false,
    pageLoader: false,
    geolocated: false,
    loginTime: 0,
    showBalance: true,
    webViewAndMobile: false,
    debugLevel: false,
    optionalISOStates: ['WV', 'LND', 'LCY', 'LA', 'CA', 'NY', 'IE', 'L'], // west virginia, middle london, london, greater london, los angeles, california,  los angeles, new york, 'ireland'
    optionalEnvironment: ['development'], // mockaup GAN geocomply,
    mobileGeolocationInProgress: false,
    isProcessingNewUserRegistration: false,
    balanceLoader: true,
    biometricsvailability: undefined,
    biometricsSettings: undefined,
    translationsLoaded: undefined,
    SASecurityQuestionsOnLogin: undefined,
    SASecurityQuestionsArray: [],
    customerContext: undefined,
    isEmailVerified: undefined,
    isPhoneVerified: undefined,
    isAristotleVerified: undefined,
    username: undefined,
    userActive: false,
    newVersionTermsAndConditions: undefined,
    scannedID: undefined,
    validationRules: undefined,
    SAPINOnLogin: undefined,
    SAMode: undefined,
    SASQorPINOnLogin: undefined,
    isCustomerVerified: undefined,
    SASQandPINOnLogin: undefined,
    aristotleVerificationStatus: undefined,
    manualVerificationStatus: undefined,
    sessionExpired: false,
    promotions: undefined,
    sightlineParams: false,
    isWIDShouldVerify: undefined,
    allowedSATypes: undefined,
    periodicalUpdateCustomerContext: null,
    defaultCustomerContextUpdateInterval: 60000,
    noSA: false,
    pendingInvestigationOrAccountSuspension: false,
    allowAccountUpdate: true,
    overridenPINException: false,
    timeLimitLogout5MinutesAlert: undefined,
    timeLimitLogoutOneMinuteAlert: undefined,
    timeLimitsTimer: undefined,
    pwdPolicy: undefined,
    pwdDays: undefined,
    pwdResetMode: undefined,
    noPwdSA: false,
    ResetPwdSASecurityQuestionsOnLogin: undefined,
    ResetPwdSAPINOnLogin: undefined,
    ResetPwdSASQorPINOnLogin: undefined,
    ResetPwdSASQandPINOnLogin: undefined,
    alertMsgs: [],
    lookupAddressResponse: undefined,
    accountIsLocked: false,
    m2p: undefined,
    p2p: undefined,
    p2pVerified: false,
    m2pVerified: false,
    isManuallyVerified: false,
    mka: undefined,
    mkaVerified: false,
    mobileUsernameAndPassword: false,
    numberOfBets: false,
    numberOfDeposits: false,
    numberOfWithdrawals: false,
    geocomplyTroubleshooter: [],
    triggerBSLocationVerifiedAnimation: false,
    firstTimeLogin: false,
    rafCodes: undefined,
    protected2fa: 1 | 32,
    type2fa: null,
    trust2fa: false,
    sent2fa: 0,
    responseGet2fa: null,
    pinVerifyLogin2fa: null,
    mobileDeviceInfo: false,
    sentInfo2fa: null,
    internalError: undefined,
    geolocationInternalError: undefined,
    totpIsActive: false,
    totpIsVerified: false,
    totpFactorAsync: null,
    isDisableTrust2FA: false,
    show2FAPostRegPopup: false,
    verifiedChannels: null,
    is2FA: true,
    temporaryUsername: null,
    temporaryPassword: null,
    postLoginAlertExist: false,
    networkLogOutput: [],
    mobileBridgeLogs: [],
    consoleLogs: [],
    deviceIdForDebugger: null,
    listOfBlockedChannels2FA: null,
    forceTOTPOrMTLVerification: false,
    legalAge4Registration: null,
    mobileAppAwakeStatus: false,
    xtremepushWebInitialized: false,
    xtremepushInboxBadgeCounter: false,
    xtremepushMessageList: false,
    xtremepushInlineContent: false
  },

  getters: {
    getAddingFunds (state) {
      return state.addingFunds
    },
    getAllowedPaymentTypes (state) {
      return state.allowedPaymentTypes
    },
    getSessionDetails (state) {
      return state.sessionDetails
    },
    getLoginTime (state) {
      return state.loginTime
    },
    getLanguage (state) {
      return state.language
    },
    getPromoBalance (state) {
      return (this.getCustomerContext && this.getCustomerContext.Balances && this.getCustomerContext.Balances.find(b => b.Key === 'CREDIT').Promo) || 0
    },
    isLoggedIn (state) {
      if (state.customerContext !== undefined) localStorage.loggedIn = true
      return state.customerContext !== undefined || state.customerContext !== undefined
    },
    getLoginErrorMessage (state) {
      return state.loginErrorMessage
    },
    getRegistrationErrorMessage (state) {
      console.log('File: index.js, Fn: getRegistrationErrorMessage, Ln 79 (): ', state.registrationErrorMessage)
      return state.registrationErrorMessage
    },
    getIsOpenedFromWebView (state) {
      let check = ('webView' in localStorage) ? JSON.parse(localStorage.getItem('webView')) : false
      return JSON.parse(check)
      // return state.isOpenedFromWebView
    },
    getWalletBalance (state) {
      return state.walletBalance
    },
    getFormSubmitSppiner (state) {
      return state.formSubmitSppiner
    },
    getPageLoader (state) {
      return state.pageLoader
    },
    getGeolocated (state, getters) {
      // if (getters.getIsOpenedFromWebView) {
      //   return JSON.parse(localStorage.mobileGeolocated || 'false')
      // } else {
      //   return state.geolocated
      // }
      return state.geolocated
      // return JSON.parse(localStorage.mobileGeolocated || 'false')
    },
    getShowBalance (state) {
      return state.showBalance
    },
    getDebugLevel (state) {
      return state.debugLevel
    },
    getWebViewAndMobile (state) {
      return state.webViewAndMobile
    },
    getConfirmEmailByTempSession (state) {
      return state.confirmEmailByTempSession
    },
    getMobileGeolocationInProgress (state) {
      return state.mobileGeolocationInProgress
    },
    getBalanceLoader (state) {
      return state.balanceLoader
    },
    getBiometricsAvailability (state) {
      return state.biometricsvailability
    },
    getBiometricsSettings (state) {
      return state.biometricsSettings
    },
    getTranslationsLoaded (state) {
      return state.translationsLoaded
    },
    getUserActive (state) {
      return state.userActive
    },
    getSASecurityQuestionsOnLogin (state) {
      return state.SASecurityQuestionsOnLogin
    },
    getSASecurityQuestionsArray (state) {
      return state.SASecurityQuestionsArray
    },
    getCustomerContext (state) {
      return state.customerContext
    },
    getIsEmailVerified (state) {
      return state.isEmailVerified
    },
    getIsPhoneVerified (state) {
      return state.isPhoneVerified
    },
    getIsAristotleVerified (state) {
      return state.isAristotleVerified
    },
    getUsername (state) {
      return state.username
    },
    getNewVersionTermsAndConditions (state) {
      return state.newVersionTermsAndConditions
    },
    getScannedID (state) {
      return state.scannedID
    },
    getValidationRules (state) {
      return state.validationRules
    },
    getSAPINOnLogin (state) {
      return state.SAPINOnLogin
    },
    getSAMode (state, data) {
      return state.SAMode
    },
    getSASQorPINOnLogin (state) {
      return state.SASQorPINOnLogin
    },
    getIsCustomerVerified (state) {
      return state.isCustomerVerified
    },
    getSASQandPINOnLogin (state) {
      return state.SASQandPINOnLogin
    },
    getAristotleVerificationStatus (state) {
      return state.aristotleVerificationStatus
    },
    getManualVerificationStatus (state) {
      return state.manualVerificationStatus
    },
    getSessionExpired (state) {
      return state.sessionExpired
    },
    getPromotions (state) {
      return state.promotions
    },
    getSightlineParams (state) {
      return state.sightlineParams
    },
    getIsWIDShouldVerify (state) {
      return state.isWIDShouldVerify
    },
    getAllowedSATypes (state) {
      return state.allowedSATypes
    },
    getThirdpartyAnalytics (state) {
      let xpMobile = config.app.autoconf.XTREMEPUSH_ANALYTICS && config.app.autoconf.XTREMEPUSH_ANALYTICS.MOBILE_APP
      return config.app.autoconf.FIREBASE_ANALYTICS || config.app.autoconf.APPSFLYER_ANALYTICS || xpMobile || false
    },
    getIsNoSA (state) {
      return state.noSA
    },
    getOverridenPINException (state) {
      return state.overridenPINException
    },
    getPendingInvestigationOrAccountSuspension (state) {
      return state.pendingInvestigationOrAccountSuspension
    },
    getAllowAccountUpdate (state) {
      return state.allowAccountUpdate
    },
    getTimeLimitLogout5MinutesAlert (state, data) {
      return state.timeLimitLogout5MinutesAlert
    },
    getTimeLimitLogoutOneMinuteAlert (state, data) {
      return state.timeLimitLogoutOneMinuteAlert
    },
    getPwdPolicy (state) {
      return state.pwdPolicy
    },
    getPwdDays (state) {
      return state.pwdDays
    },
    getPwdResetMode (state) {
      return state.pwdResetMode
    },
    getIsNoPwdSA (state) {
      return state.noPwdSA
    },
    getResetPwdSASecurityQuestionsOnLogin (state) {
      return state.ResetPwdSASecurityQuestionsOnLogin
    },
    getResetPwdSAPINOnLogin (state) {
      return state.ResetPwdSAPINOnLogin
    },
    getResetPwdSASQorPINOnLogin (state) {
      return state.ResetPwdSASQorPINOnLogin
    },
    getResetPwdSASQandPINOnLogin (state) {
      return state.ResetPwdSASQandPINOnLogin
    },
    getAlertMsgs (state) {
      return state.alertMsgs
    },
    getLookupAddressResponse (state) {
      return state.lookupAddressResponse
    },
    getAccountIsLocked (state) {
      return state.accountIsLocked
    },
    getM2P (state) {
      return state.m2p
    },
    getP2P (state) {
      return state.p2p
    },
    getP2PVerified (state) {
      return state.p2pVerified
    },
    getM2PVerified (state) {
      return state.m2pVerified
    },
    getIsManuallyVerified (state) {
      return state.isManuallyVerified
    },
    getMka (state) {
      return state.mka
    },
    getMkaVerified (state) {
      return state.mkaVerified
    },
    getMobileUsernameAndPassword (state) {
      return state.mobileUsernameAndPassword
    },
    getNumberOfBets (state) {
      return state.numberOfBets
    },
    getNumberOfDeposits (state) {
      return state.numberOfDeposits
    },
    getNumberOfWithdrawals (state) {
      return state.numberOfWithdrawals
    },
    getGeocomplyTroubleshooter (state) {
      return state.geocomplyTroubleshooter
    },
    getTriggerBSLocationVerifiedAnimation (state) {
      return state.triggerBSLocationVerifiedAnimation
    },
    getFirstTimeLogin (state) {
      return state.firstTimeLogin
    },
    getRafCodes (state) {
      return state.rafCodes
    },
    getProtected2fa (state) {
      return state.protected2fa
    },
    getType2fa (state) {
      return state.type2fa
    },
    getTrust2fa (state) {
      return state.trust2fa
    },
    getSent2fa (state) {
      return state.sent2fa
    },
    getResponseGet2fa (state) {
      return state.responseGet2fa
    },
    getPinVerifyLogin2fa (state) {
      return state.pinVerifyLogin2fa
    },
    getMobileDeviceInfo (state) {
      return state.mobileDeviceInfo
    },
    getSentInfo2fa (state) {
      return state.sentInfo2fa
    },
    getInternalError (state) {
      return state.internalError
    },
    getGeolocationInternalError (state) {
      return state.geolocationInternalError
    },
    getTotpIsActive (state) {
      return state.totpIsActive
    },
    getTotpIsVerified (state) {
      return state.totpIsVerified
    },
    getTotpFactorAsync (state) {
      return state.totpFactorAsync
    },
    get2FADisableTrust (state) {
      return state.isDisableTrust2FA
    },
    getShow2FAPostRegPopup (state) {
      return state.show2FAPostRegPopup
    },
    getVerifiedChannels (state) {
      return state.verifiedChannels
    },
    getIs2FA (state) {
      return state.is2FA
    },
    getTemporaryUsername (state) {
      return state.temporaryUsername
    },
    getTemporaryPassword (state) {
      return state.temporaryPassword
    },
    getPostLoginAlertExist (state) {
      return state.postLoginAlertExist
    },
    getNetworkLogOutput (state) {
      return state.networkLogOutput
    },
    getMobileBridgeLogs (state) {
      return state.mobileBridgeLogs
    },
    getConsoleLogs (state) {
      return state.consoleLogs
    },
    getDeviceIdForDebugger (state) {
      return state.deviceIdForDebugger
    },
    getListOfBlockedChannels2FA (state) {
      return state.listOfBlockedChannels2FA
    },
    getForceTOTPOrMTLVerification (state) {
      return state.forceTOTPOrMTLVerification
    },
    getLegalAge4Registration (state) {
      return state.legalAge4Registration
    },
    getMobileAppAwakeStatus (state) {
      return state.mobileAppAwakeStatus
    },
    getXtremepushWebInitialized (state) {
      return state.xtremepushWebInitialized
    },
    getXtremepushInboxBadgeCounter (state) {
      return state.xtremepushInboxBadgeCounter
    },
    getXtremepushMessageList (state) {
      return state.xtremepushMessageList
    },
    getXtremepushInlineContent (state) {
      return state.xtremepushInlineContent
    }
  },

  mutations: {
    setAllowedPaymentTypes (state, allowedPaymentTypes) {
      console.log('File: index.js, Fn: seAllowedPaymentTypes, Ln 130 (): ', allowedPaymentTypes)
      state.allowedPaymentTypes = allowedPaymentTypes
    },
    setAddingFunds (state, addingFunds) {
      state.addingFunds = addingFunds
    },
    setLoginErrorMessage (state, error) {
      state.loginErrorMessage = error
    },
    setSessionDetails (state, sessionDetails) {
      state.sessionDetails = sessionDetails
    },
    setLoginTime (state, loginTime) {
      state.loginTime = loginTime
    },
    setWalletBalance (state, balance) {
      state.walletBalance = balance
    },
    setIsOpenedFromWebView (state, isOpenedFromWebView) {
      state.isOpenedFromWebView = isOpenedFromWebView
    },
    setFormSubmitSppiner (state, data) {
      state.formSubmitSppiner = data
    },
    setPageLoader (state, data) {
      state.pageLoader = data
    },
    setGeolocated (state, data) {
      state.geolocated = data
    },
    setShowBalance (state, data) {
      state.showBalance = data
    },
    setDebugLevel (state, level) {
      state.debugLevel = level
    },
    setWebViewAndMobile (state, data) {
      state.webViewAndMobile = data
    },
    confirmEmailByTempSession (state, param) {
      console.log('File: index.js, Fn: confirmEmailByTempSession, Ln 189 (): ', param)
      state.confirmEmailByTempSession = param
    },
    setMobileGeolocationInProgress (state, data) {
      state.mobileGeolocationInProgress = data
    },
    setBalanceLoader (state, data) {
      state.balanceLoader = data
    },
    setBiometricsvailability (state, data) {
      console.log('setBiometricsvailability', data)
      state.biometricsvailability = data
    },
    setBiometricsSettings (state, data) {
      console.log('setBiometricsSettings', data)
      state.biometricsSettings = data
    },
    setTranslationsLoaded (state, data) {
      state.translationsLoaded = data
    },
    setUserActive (state, data) {
      state.userActive = data
    },
    setSASecurityQuestionsOnLogin (state, data) {
      state.SASecurityQuestionsOnLogin = data
    },
    setSASecurityQuestionsArray (state, data) {
      state.SASecurityQuestionsArray = data
    },
    setCustomerContext (state, data) {
      state.customerContext = data
    },
    setIsEmailVerified (state, data) {
      state.isEmailVerified = data
    },
    setIsPhoneVerified (state, data) {
      state.isPhoneVerified = data
    },
    setIsAristotleVerified (state, data) {
      state.isAristotleVerified = data
    },
    setUsername (state, data) {
      state.username = data
    },
    setNewVersionTermsAndConditions (state, data) {
      state.newVersionTermsAndConditions = data
    },
    setScannedID (state, data) {
      state.scannedID = data
    },
    setValidationRules (state, data) {
      state.validationRules = data
    },
    setSAPINOnLogin (state, data) {
      state.SAPINOnLogin = data
    },
    setSAMode (state, data) {
      state.SAMode = data
    },
    setSASQorPINOnLogin (state, data) {
      state.SASQorPINOnLogin = data
    },
    setIsCustomerVerified (state, data) {
      state.isCustomerVerified = data
    },
    setSASQandPINOnLogin (state, data) {
      state.SASQandPINOnLogin = data
    },
    setAristotleVerificationStatus (state, data) {
      state.aristotleVerificationStatus = data
    },
    setManualVerificationStatus (state, data) {
      state.manualVerificationStatus = data
    },
    setSessionExpired (state, data) {
      state.sessionExpired = data
    },
    setPromotions (state, data) {
      state.promotions = data
    },
    setSightlineParams (state, data) {
      state.sightlineParams = data
    },
    setIsWIDShouldVerify (state, data) {
      state.isWIDShouldVerify = data
    },
    setAllowedSATypes (state, data) {
      state.allowedSATypes = data
    },
    setOverridenPINException (state, data) {
      state.overridenPINException = data
    },
    setPendingInvestigationOrAccountSuspension (state, data) {
      state.pendingInvestigationOrAccountSuspension = data
    },
    setAllowAccountUpdate (state, data) {
      state.allowAccountUpdate = data
    },
    setTimeLimitLogout5MinutesAlert (state, data) {
      state.timeLimitLogout5MinutesAlert = data
    },
    setTimeLimitLogoutOneMinuteAlert (state, data) {
      state.timeLimitLogoutOneMinuteAlert = data
    },
    setPwdPolicy (state, data) {
      state.pwdPolicy = data
    },
    setPwdDays (state, data) {
      state.pwdDays = data
    },
    setPwdResetMode (state, data) {
      state.pwdResetMode = data
    },
    setResetPwdSASecurityQuestionsOnLogin (state, data) {
      state.ResetPwdSASecurityQuestionsOnLogin = data
    },
    setResetPwdSAPINOnLogin (state, data) {
      state.ResetPwdSAPINOnLogin = data
    },
    setResetPwdSASQorPINOnLogin (state, data) {
      state.ResetPwdSASQorPINOnLogin = data
    },
    setResetPwdSASQandPINOnLogin (state, data) {
      state.ResetPwdSASQandPINOnLogin = data
    },
    setAlertMsgs (state, data) {
      if (!state.alertMsgs.includes(data)) {
        state.alertMsgs.push(data)
      }
      if (!data) {
        state.alertMsgs = []
      }
    },
    setLookupAddressResponse (state, data) {
      state.lookupAddressResponse = data
    },
    setAccountIsLocked (state, data) {
      state.accountIsLocked = data
    },
    setM2P (state, data) {
      state.m2p = data
    },
    setP2P (state, data) {
      state.p2p = data
    },
    setP2PVerified (state, data) {
      state.p2pVerified = data
    },
    setM2PVerified (state, data) {
      state.m2pVerified = data
    },
    setIsManuallyVerified (state, data) {
      state.isManuallyVerified = data
    },
    setMka (state, data) {
      state.mka = data
    },
    setMkaVerified (state, data) {
      state.mkaVerified = data
    },
    setMobileUsernameAndPassword (state, data) {
      state.mobileUsernameAndPassword = data
    },
    setNumberOfBets (state, data) {
      state.numberOfBets = data
    },
    setNumberOfDeposits (state, data) {
      state.numberOfDeposits = data
    },
    setNumberOfWithdrawals (state, data) {
      state.numberOfWithdrawals = data
    },
    setGeocomplyTroubleshooter (state, data) {
      state.geocomplyTroubleshooter = data
    },
    setTriggerBSLocationVerifiedAnimation (state, data) {
      state.triggerBSLocationVerifiedAnimation = data
    },
    setFirstTimeLogin (state, data) {
      state.firstTimeLogin = data
    },
    setRafCodes (state, data) {
      state.rafCodes = data
    },
    setProtected2fa (state, data) {
      state.protected2fa = data
    },
    setType2fa (state, data) {
      state.type2fa = data
    },
    setTrust2fa (state, data) {
      state.trust2fa = data
    },
    setSent2fa (state, data) {
      state.sent2fa = data
    },
    setResponseGet2fa (state, data) {
      state.responseGet2fa = data
    },
    setPinVerifyLogin2fa (state, data) {
      state.pinVerifyLogin2fa = data
    },
    setMobileDeviceInfo (state, data) {
      state.mobileDeviceInfo = data
    },
    setSentInfo2fa (state, data) {
      state.sentInfo2fa = data
    },
    setInternalError (state, data) {
      state.internalError = data
    },
    setGeolocationInternalError (state, data) {
      state.geolocationInternalError = data
    },
    setTotpIsActive (state, data) {
      state.totpIsActive = data
    },
    set2FADisableTrust (state, data) {
      state.isDisableTrust2FA = data
    },
    setShow2FAPostRegPopup (state, data) {
      state.show2FAPostRegPopup = data
    },
    setTotpIsVerified (state, data) {
      state.totpIsVerified = data
    },
    setTotpFactorAsync (state, data) {
      state.totpFactorAsync = data
    },
    setVerifiedChannels (state, data) {
      state.verifiedChannels = data
    },
    setIs2FA (state, data) {
      state.is2FA = data
    },
    setTemporaryUsername (state, data) {
      state.temporaryUsername = data
    },
    setTemporaryPassword (state, data) {
      state.temporaryPassword = data
    },
    setPostLoginAlertExist (state, data) {
      state.postLoginAlertExist = data
    },
    setNetworkLogOutput (state, data) {
      if (data.length === 0) {
        state.networkLogOutput = []
      } else {
        if (state.networkLogOutput.length > 2000) {
          state.networkLogOutput.splice(0, 50)
          state.networkLogOutput.push(data)
        } else {
          state.networkLogOutput.push(data)
        }
      }
    },
    setMobileBridgeLogs (state, data) {
      state.mobileBridgeLogs.push(data)
    },
    setConsoleLogs (state, data) {
      state.consoleLogs.push(data)
    },
    setDeviceIdForDebugger (state, data) {
      state.deviceIdForDebugger = data
    },
    setListOfBlockedChannels2FA (state, data) {
      state.listOfBlockedChannels2FA = data
    },
    setForceTOTPOrMTLVerification (state, data) {
      state.forceTOTPOrMTLVerification = data
    },
    setLegalAge4Registration (state, data) {
      state.legalAge4Registration = data
    },
    setMobileAppAwakeStatus (state, data) {
      state.mobileAppAwakeStatus = data
    },
    setXtremepushWebInitialized (state, data) {
      state.xtremepushWebInitialized = data
    },
    setXtremepushInboxBadgeCounter (state, data) {
      state.xtremepushInboxBadgeCounter = data
    },
    setXtremepushMessageList (state, data) {
      state.xtremepushMessageList = data
    },
    setXtremepushInlineContent (state, data) {
      if (!data) {
        state.xtremepushInlineContent = false
        return false
      }
      state.xtremepushInlineContent = [...state.xtremepushInlineContent, data]
    }
  },

  actions: {
    fetchPromoCodes (context) {
      return new Promise((resolve, reject) => {
        lib.rpcService.callBroker('iw', 'GetActiveReferAFriendCodes')
          .then(response => {
            context.commit('setRafCodes', response.result)
            resolve(response)
          }).catch((error) => {
            console.log(error)
            reject(error)
          })
      })
    },
    async confirmEmailByTempSession (context, request) {
      try {
        const confirmEmailByTempSession = await lib.rpcService.callBroker('UserService', 'ConfirmEmailByTempSession', {'tempSessionID': request.token})
        context.commit('confirmEmailByTempSession', confirmEmailByTempSession)
      } catch (e) {
        console.error(e.message)
        throw e
      }
    },
    async forgotPassword (context, request) {
      // const ForgottenPassword = await lib.rpcService.callBroker('UserService', 'ForgottenPasswordWCaptcha', {'cardlast4digits': '1234', 'idsecretquestion': 'idsecretquestion', 'username': 'username@username.com'})
      const ForgottenPassword = await lib.rpcService.callBroker('UserService', 'ForgottenPassword', {'username': '1234', 'cardlast4digits': '123', 'captcha': '12345654'})
      console.log('File: index.js, Fn: forgotPassword, Ln 245 (): ', ForgottenPassword, request)
    },
    triggerBSLocationVerifiedAnimation (context, request) {
      context.commit('setTriggerBSLocationVerifiedAnimation', request)
      setTimeout(() => {
        context.commit('setTriggerBSLocationVerifiedAnimation', false)
      }, 5000)
    },
    fetchLegalAge4Registration (context) {
      lib.kansas.psParams({
        csvlist: 'TXLegalAge4Registration'
      }).then(response => {
        // console.log('TXLegalAge4Registration', response)
        if (response && response.data && response.data[0].Value) {
          let legalAge = +response.data[0].Value
          context.commit('setLegalAge4Registration', legalAge)
        }
      }).catch((error) => {
        console.log('fetchLegalAge4Registration error')
        console.log(error)
      })
    },
    userServiceRegister (context, request) {
      return lib.rpcService.callBroker('UserService', 'RegisterCustomer', {
        'IDMDLanguage': config.app.language,
        'customerRegistrationDetails': {
          'FirstName': request.firstName,
          'LastName': request.lastName,
          'Title': request.title,
          'IDMMGender': request.gender,
          'IDDCSecurityQuestion': request.IDDCSecurityQuestion,
          'SecurityQuestion': request.securityQuestion,
          'SecurityAnswer': request.securityAnswer,
          'DateOfBirth': request.dateOfBirth,
          'UserName': request.userName,
          'Password': request.password,
          'PrimaryEmail': request.email,
          'CountyOrStateOrProvince': request.state,
          'City': request.city,
          'PostCode': request.postCode,
          'StreetAddress': request.address,
          'CustomerIDNumber': request.ssn,
          'HomePhone': request.phone,
          'MobilePhone': request.phone,
          'IsTermsAndConditionsAgreed': request.TC,
          'IDMMCountry': 'US',
          'IDMMCountryCitizenship': 'US',
          'IsNoCorrespondence': false,
          'IDMMCustACQSource': 'WEB',
          'IDMMCurrency': 'USD',
          'Section': null,
          'IDDCLanguage': config.app.language,
          'IDMMIDType': 'SS',
          'IdentifierDateOfIssue': null,
          'IdentifierDateOfExpiry': null,
          'IdentifierPlaceOfIssue': null,
          'TerminalThumbprint': null,
          'IDMMRegion': '1',
          'IDMMMunicipality': null,
          'Salutation': request.title,
          'IDMMAVCustomerState': null,
          'SocioDemo': null,
          'IBAN': null,
          'InstructionType': null
        }
      })
    },
    userServiceRegisterCustomer (context, request) {
      return lib.rpcService.callBroker('psregistrationservice', 'RegisterCustomer', {
        'FirstName': request.firstName,
        'LastName': request.lastName,
        'Title': request.title,
        'IDMMGender': request.gender,
        'IDDCSecretQuestion': request.IDDCSecurityQuestion,
        'SecretQuestion': request.securityQuestion,
        'SecretAnswer': request.securityAnswer,
        'IDDCSecretQuestion2': request.IDDCSecurityQuestion2,
        'SecretQuestion2': request.securityQuestion2,
        'SecretAnswer2': request.securityAnswer2,
        'DateOfBirth': request.dateOfBirth,
        'UserName': request.userName,
        'Password': request.password,
        'PrimaryEmail': request.email,
        'CountyOrStateOrProvince': request.state,
        'City': request.city,
        'PostCode': request.postCode,
        'StreetAddress': request.address,
        'CustomerIDNumber': request.ssn,
        'HomePhone': null,
        'MobilePhone': request.phone,
        'IsTermsAndConditionsAgreed': request.tc,
        'Attestations': request.attestations,
        'IDMMCountry': 'US',
        'IDMMCountryCitizenship': 'US',
        'IsNoCorrespondence': false,
        'IDMMCustACQSource': 'WEB',
        'IDMMCurrency': 'USD',
        'Section': null,
        'IDDCLanguage': config.app.language,
        'IDMMIDType': 'SS',
        'IdentifierDateOfIssue': null,
        'IdentifierDateOfExpiry': null,
        'IdentifierPlaceOfIssue': null,
        'IDMMRegion': null,
        'IDMMMunicipality': null,
        'Salutation': request.title,
        'IDMMAVCustomerState': null,
        'AffiliateCode': request.affiliateCode,
        'PromoCode': request.promoCode
      })
    },
    getSAByUsernameAndPassword (context, payload) {
      context.commit('setFormSubmitSppiner', true)
      context.commit('setAccountIsLocked', false)
      localStorage.removeItem('passwordAlertPolicy')
      context.commit('messageCenter/setPasswordAlertPolicy', false)
      sessionStorage.removeItem('AlertResetPasswordDaysLeft')
      lib.rpcService.callBroker('iw', 'getsabyusernameandpassword', {
        'Username': payload.username,
        'Password': payload.password
      }).then(response => {
        if (response && response.result) {
          context.commit('setFormSubmitSppiner', false)
          this.state.noSA = false
          console.log('response.result', response.result)
          // start reset pwd related data
          let pwdResetMode = response.result.ModeResetPwd
          let policy = response.result.PwdPolicy
          let pwdDays = response.result.PwdDays
          let pwdReset = policy && policy.toLowerCase() === 'reset'
          context.commit('setPwdPolicy', policy && policy.toLowerCase())
          context.commit('setPwdResetMode', pwdResetMode)
          context.commit('setPwdDays', pwdDays)
          if (policy && policy.toLowerCase() === 'alert') {
            context.commit('setAlertMsgs', 'password_policy')
            context.commit('messageCenter/setPasswordAlertPolicy', true)
            localStorage.setItem('passwordAlertPolicy', true)
            context.dispatch('overlayState/activateOverlayDialog')
            sessionStorage.displayAlertResetPasswordOverlayMsg = true
            sessionStorage.AlertResetPasswordDaysLeft = pwdDays
          }
          this.state.noPwdSA = pwdResetMode === 0
          if (pwdResetMode === 1) {
            // mode 1: only secret questions and answers
            if (response && response.result && response.result.Questions) {
              context.commit('setSASecurityQuestionsArray', response.result.Questions)
            }
            context.commit('setResetPwdSASecurityQuestionsOnLogin', true)
          } else if (pwdResetMode === 2) {
            // mode 2: only PIN
            context.commit('setResetPwdSAPINOnLogin', true)
          } else if (pwdResetMode === 3) {
            // mode 3: PIN or SQ&A
            context.commit('setResetPwdSASQorPINOnLogin', true)
            if (response && response.result && response.result.Questions) {
              context.commit('setSASecurityQuestionsArray', response.result.Questions)
            }
          } else if (pwdResetMode === 4) {
            // mode 4: PIN and SQ&A
            context.commit('setResetPwdSASQandPINOnLogin', true)
            if (response && response.result && response.result.Questions) {
              context.commit('setSASecurityQuestionsArray', response.result.Questions)
            }
          }
          // end reset pwd related data

          if (response.result.Mode === 0) {
            // mode 0 - no strong auth
            this.state.noSA = true
            if (!pwdReset) {
              context.dispatch('loginSA', {
                'username': payload.username,
                'password': payload.password
              })
            }
          } else if (response.result.Mode === 1) {
            // mode 1: only secret questions and answers
            if (response && response.result && response.result.Questions) {
              context.commit('setSASecurityQuestionsArray', response.result.Questions)
            }
            context.commit('setSASecurityQuestionsOnLogin', true)
          } else if (response.result.Mode === 2) {
            // mode 2: only PIN
            context.commit('setSAPINOnLogin', true)
          } else if (response.result.Mode === 3) {
            // mode 3: PIN or SQ&A
            context.commit('setSASQorPINOnLogin', true)
            if (response && response.result && response.result.Questions) {
              context.commit('setSASecurityQuestionsArray', response.result.Questions)
            }
          } else if (response.result.Mode === 4) {
            // mode 3: PIN or SQ&A
            context.commit('setSASQandPINOnLogin', true)
            if (response && response.result && response.result.Questions) {
              context.commit('setSASecurityQuestionsArray', response.result.Questions)
            }
          }
          context.commit('setSAMode', response.result.Mode)
          if (response.result.Mode !== 0) {
            mobileBridge.setUserCredentials({ 'username': payload.username, 'password': payload.password })
          }
        }
      }).catch(error => {
        this.state.noSA = true
        this.state.noPwdSA = true
        context.commit('setFormSubmitSppiner', false)
        context.commit('setLoginErrorMessage', error.message || 'Login failed. Unknown error occurred')
        if (window.dataLayer || context.getters['getThirdpartyAnalytics']) {
          let login = {
            'event': 'login',
            'gaEventCategory': 'login',
            'gaEventAction': 'login error',
            'gaEventLabel': (error && error.message) || undefined // pass as undefined if not error message not available
          }
          context.dispatch('analyticsHandler', {'event': login})
        }
        if (error.exceptionType === 'LoginAttemptsException') {
          context.commit('setAccountIsLocked', true)
        }
      })
    },
    getSAByTempSession (context, payload) {
      return new Promise((resolve, reject) => {
        lib.rpcService.callBroker('iw', 'getsabytempsession', {
          'TempSession': payload.TempSession
        }).then(response => {
          if (response.result) {
            resolve(response.result)
          } else {
            return undefined
          }
        }).catch((error) => {
          reject(error)
        })
      })
    },
    get2FA (context, payload) {
      context.commit('setFormSubmitSppiner', true)
      context.commit('setAccountIsLocked', false)
      localStorage.removeItem('passwordAlertPolicy')
      context.commit('messageCenter/setPasswordAlertPolicy', false)
      sessionStorage.removeItem('AlertResetPasswordDaysLeft')
      context.commit('setType2fa', null)
      context.commit('setSent2fa', 0)
      return new Promise((resolve, reject) => {
        lib.rpcService.callBroker('iw', 'get2fa', {
          'Username': payload.username,
          'Password': payload.password,
          'Protected': parseInt((context.getters['getProtected2fa']).toString(2)),
          'Channel': payload.channel
        }).then(response => {
          context.commit('setFormSubmitSppiner', false)
          if (response && response.result) {
            if (response.result.Type && response.result.Type.toLowerCase() !== 'totp2fa' && response.result.Type.toLowerCase() !== 'totp' && !response.result.Sent) {
              // this.state.noSA = true
              // this.state.noPwdSA = true
              // context.commit('setType2fa', response.result.Type)
              // context.commit('setSent2fa', response.result.Sent)
              // context.commit('setLoginErrorMessage', 'ChannelDoesNotExist')
              // context.commit('setTotpIsVerified', false)
              context.commit('setIs2FA', false)
              context.commit('overlayState/setLoginDialogState', false)
              if (response && response.result && response.result.Type && (response.result.Type === 'PIN' || response.result.Type === '2FA') && response.result.Sent === 0) {
                context.commit('setForceTOTPOrMTLVerification', true)
              }
            } else {
              this.state.noSA = false
              // console.log('response.result', response.result)
              // start reset pwd related data
              let pwdResetMode = response.result.ModeResetPwd
              let policy = response.result.PwdPolicy
              let pwdDays = response.result.PwdDays
              let pwdReset = policy && policy.toLowerCase() === 'reset'
              context.commit('setPwdPolicy', policy && policy.toLowerCase())
              context.commit('setPwdResetMode', pwdResetMode)
              context.commit('setPwdDays', pwdDays)
              context.commit('setVerifiedChannels', response.result.VerifiedChannels)
              if (policy && policy.toLowerCase() === 'alert') {
                context.commit('setAlertMsgs', 'password_policy')
                context.commit('messageCenter/setPasswordAlertPolicy', true)
                localStorage.setItem('passwordAlertPolicy', true)
                context.dispatch('overlayState/activateOverlayDialog')
                sessionStorage.displayAlertResetPasswordOverlayMsg = true
                sessionStorage.AlertResetPasswordDaysLeft = pwdDays
              }
              this.state.noPwdSA = pwdResetMode === 0
              if (pwdResetMode === 1) {
                // mode 1: only secret questions and answers
                if (response && response.result && response.result.Questions) {
                  context.commit('setSASecurityQuestionsArray', response.result.Questions)
                }
                context.commit('setResetPwdSASecurityQuestionsOnLogin', true)
              } else if (pwdResetMode === 2) {
                // mode 2: only PIN
                context.commit('setResetPwdSAPINOnLogin', true)
              } else if (pwdResetMode === 3) {
                // mode 3: PIN or SQ&A
                context.commit('setResetPwdSASQorPINOnLogin', true)
                if (response && response.result && response.result.Questions) {
                  context.commit('setSASecurityQuestionsArray', response.result.Questions)
                }
              } else if (pwdResetMode === 4) {
                // mode 4: PIN and SQ&A
                context.commit('setResetPwdSASQandPINOnLogin', true)
                if (response && response.result && response.result.Questions) {
                  context.commit('setSASecurityQuestionsArray', response.result.Questions)
                }
              }
              // end reset pwd related data

              if (!response.result.Type) {
                // Type=NULL - no strong auth
                this.state.noSA = true
                if (!pwdReset) {
                  context.dispatch('login2FA', {
                    'username': payload.username,
                    'password': payload.password
                  })
                }
              } else if (response.result.Type.toLowerCase()) {
                context.commit('setForceTOTPOrMTLVerification', false)
                context.commit('setSAPINOnLogin', true)
                context.commit('overlayState/setLoginDialogState', true)
              }
              /* else if (response.result.Mode === 1) {
                // mode 1: only secret questions and answers
                if (response && response.result && response.result.Questions) {
                  context.commit('setSASecurityQuestionsArray', response.result.Questions)
                }
                context.commit('setSASecurityQuestionsOnLogin', true)
              } else if (response.result.Mode === 2) {
                // mode 2: only PIN
                context.commit('setSAPINOnLogin', true)
              } else if (response.result.Mode === 3) {
                // mode 3: PIN or SQ&A
                context.commit('setSASQorPINOnLogin', true)
                if (response && response.result && response.result.Questions) {
                  context.commit('setSASecurityQuestionsArray', response.result.Questions)
                }
              } else if (response.result.Mode === 4) {
                // mode 3: PIN or SQ&A
                context.commit('setSASQandPINOnLogin', true)
                if (response && response.result && response.result.Questions) {
                  context.commit('setSASecurityQuestionsArray', response.result.Questions)
                }
              } */
              context.commit('setType2fa', response.result.Type)
              context.commit('setTrust2fa', response.result.Trust)
              context.commit('setSent2fa', response.result.Sent)
              context.commit('setResponseGet2fa', response.result)
              context.commit('setSentInfo2fa', response.result.SentInfo)
              if (response.result.Type) {
                mobileBridge.setUserCredentials({'username': payload.username, 'password': payload.password})
              }
            }
          }

          resolve(response)
        }).catch(error => {
          this.state.noSA = true
          this.state.noPwdSA = true
          context.commit('setFormSubmitSppiner', false)
          context.commit('setLoginErrorMessage', error.message || 'Login failed. Unknown error occurred')
          if (window.dataLayer || context.getters['getThirdpartyAnalytics']) {
            let login = {
              'event': 'login',
              'gaEventCategory': 'login',
              'gaEventAction': 'login error',
              'gaEventLabel': (error && error.message) || undefined // pass as undefined if not error message not available
            }
            context.dispatch('analyticsHandler', {'event': login})
          }
          if (error.exceptionType === 'LoginAttemptsException') {
            context.commit('setAccountIsLocked', true)
          }
          reject(error)
        })
      })
    },
    get2FASilent (context, payload) {
      lib.rpcService.callBroker('iw', 'get2fa', {
        'Username': payload.username,
        'Password': payload.password,
        'Protected': context.getters['getProtected2fa'],
        'Channel': payload.channel
      })
    },
    getTotpIsActiveAndDisableTrust (context) {
      lib.kansas.psCoreParams({
        csvlist: 'TOTPIsActive,2FADisableTrust,2FAListOfBlockedChannels',
        iddcapplication: 'TEXAS'
      }).then(response => {
        if (response && response.data && response.data.length > 0) {
          let res = response.data.find(value => value.Code === '2FADisableTrust')
          let res2 = response.data.find(value => value.Code === '2FAListOfBlockedChannels')
          let res3 = response.data.find(value => value.Code === 'TOTPIsActive')
          // console.log('res', res, 'res2', res2, 'res3', res3)
          context.commit('set2FADisableTrust', res && res.Code && res.Code.toLowerCase() === '2FADisableTrust'.toLowerCase() && res.Value === '-1')
          context.commit('setListOfBlockedChannels2FA', res2 && res2.Code && res2.Code.toLowerCase() === '2FAListOfBlockedChannels'.toLowerCase() ? res2.Value.trim() : '')
          context.commit('setTotpIsActive', res3 && res3.Code && res3.Code.toLowerCase() === 'TOTPIsActive'.toLowerCase() && res3.Value === '-1')
        }
      })
      .catch((error) => {
        console.log('fetch totp is active error')
        console.log(error)
      })
    },
    handleLoginRedirect () {
      if (
        (router.currentRoute.name !== 'sports' && router.currentRoute.name !== 'notification-preferences') &&
        !(router.currentRoute.meta && router.currentRoute.meta.navgroupkey && router.currentRoute.meta.navgroupkey === 'pm') &&
        !window.ctsautoconf.DISABLE_LOGIN_REDIRECT
      ) {
        router.push('/sports')
      }
    },
    loginSA (context, request) {
      // fetch('https://814b8712-5bb9-41d2-b1e4-4b9ae1a327f2.mock.pstmn.io/echo').then(response => response.json()).then(response => {
      context.commit('setFormSubmitSppiner', true)
      context.commit('setAccountIsLocked', false)
      lib.rpcService.callBroker('auth', 'loginsa', request).then(response => {
        context.commit('setFormSubmitSppiner', false)
        if (response && response.result && response.result.AccessToken && response.result.AccessTokenExpirationUTC && response.result.RefreshToken && response.result.RefreshTokenExpirationUTC) {
          // logged in
          response.ftl = request.firstTimeLogin
          context.dispatch('onLoginSuccessSHW', response)
          context.commit('setUsername', request.username)
          if (window.ctsautoconf.MOBILE_LS && window.ctsautoconf.TRANSACTION_SERVER_CALL_MODE === 'API') {
            mobileBridge.bridgeSendRequest('writeData', {'username': request.username, 'password': request.password, 'env': window.ctsautoconf.WALLET_PROVIDER})
          }
          context.dispatch('handleLoginRedirect')
          context.dispatch('payments/getAllowedPaymentTypes')
        } else {
          // login failed
          if (this.state.noSA) {
            context.commit('setSASecurityQuestionsOnLogin', false)
            context.commit('setSAPINOnLogin', false)
            context.commit('setSASQorPINOnLogin', false)
            context.commit('setSASQandPINOnLogin', false)
            // this.state.noSA = false
          }
          if (this.state.noPwdSA) {
            context.commit('setResetPwdSASecurityQuestionsOnLogin', undefined)
            context.commit('setResetPwdSAPINOnLogin', undefined)
            context.commit('setResetPwdSASQorPINOnLogin', undefined)
            context.commit('setResetPwdSASQandPINOnLogin', undefined)
          }
          context.commit('setLoginErrorMessage', response.error.message || 'Login failed. Unknown error occurred')
          context.commit('setSessionDetails', undefined)
        }
      }).catch((error) => {
        console.log(error)
        context.commit('setFormSubmitSppiner', false)
        if (this.state.noSA) {
          context.commit('setSASecurityQuestionsOnLogin', false)
          context.commit('setSAPINOnLogin', false)
          context.commit('setSASQorPINOnLogin', false)
          context.commit('setSASQandPINOnLogin', false)
          // this.state.noSA = false
        }
        if (this.state.noPwdSA) {
          context.commit('setResetPwdSASecurityQuestionsOnLogin', undefined)
          context.commit('setResetPwdSAPINOnLogin', undefined)
          context.commit('setResetPwdSASQorPINOnLogin', undefined)
          context.commit('setResetPwdSASQandPINOnLogin', undefined)
        }
        if (error && error.exceptionType === 'MissingOrExpiredPinException') {
          context.commit('setOverridenPINException', true)
        } else {
          context.commit('setLoginErrorMessage', error.message || 'Login failed. Unknown error occurred')
        }
        context.commit('setSessionDetails', undefined)
        if (window.dataLayer || context.getters['getThirdpartyAnalytics']) {
          let login = {
            'event': 'login',
            'gaEventCategory': 'login_sa',
            'gaEventAction': 'login error',
            'gaEventLabel': (error && error.message) || undefined // pass as undefined if not error message not available
          }
          context.dispatch('analyticsHandler', {'event': login})
        }
        if (error.exceptionType === 'LoginAttemptsException') {
          context.commit('setAccountIsLocked', true)
        }
      })
    },
    login2FA (context, request) {
      // fetch('https://814b8712-5bb9-41d2-b1e4-4b9ae1a327f2.mock.pstmn.io/echo').then(response => response.json()).then(response => {
      context.commit('setFormSubmitSppiner', true)
      context.commit('setAccountIsLocked', false)
      lib.rpcService.callBroker('auth', 'login2fa', request).then(response => {
        context.commit('setFormSubmitSppiner', false)
        if (response && response.result && response.result.AccessToken && response.result.AccessTokenExpirationUTC && response.result.RefreshToken && response.result.RefreshTokenExpirationUTC) {
          // logged in
          response.ftl = request.firstTimeLogin
          context.dispatch('onLoginSuccessSHW', response)
          context.commit('setUsername', request.username)

          if (config.app.autoconf.LOGIN_USERNAME_PERSIST) {
            mobileBridge.bridgeSendRequest('setKeyValue', {'username': request.username})
          }
          if (window.ctsautoconf.MOBILE_LS && window.ctsautoconf.TRANSACTION_SERVER_CALL_MODE === 'API') {
            mobileBridge.bridgeSendRequest('writeData', {'username': request.username, 'password': request.password, 'env': window.ctsautoconf.WALLET_PROVIDER})
          }
          context.dispatch('handleLoginRedirect')
          context.dispatch('payments/getAllowedPaymentTypes')
        } else {
          // login failed
          if (this.state.noSA) {
            context.commit('setSASecurityQuestionsOnLogin', false)
            context.commit('setSAPINOnLogin', false)
            context.commit('setSASQorPINOnLogin', false)
            context.commit('setSASQandPINOnLogin', false)
            // this.state.noSA = false
          }
          if (this.state.noPwdSA) {
            context.commit('setResetPwdSASecurityQuestionsOnLogin', undefined)
            context.commit('setResetPwdSAPINOnLogin', undefined)
            context.commit('setResetPwdSASQorPINOnLogin', undefined)
            context.commit('setResetPwdSASQandPINOnLogin', undefined)
          }
          context.commit('setLoginErrorMessage', response.error.message || 'Login failed. Unknown error occurred')
          context.commit('setSessionDetails', undefined)
        }
      }).catch((error) => {
        console.log(error)
        context.commit('setFormSubmitSppiner', false)
        if (this.state.noSA) {
          context.commit('setSASecurityQuestionsOnLogin', false)
          context.commit('setSAPINOnLogin', false)
          context.commit('setSASQorPINOnLogin', false)
          context.commit('setSASQandPINOnLogin', false)
          // this.state.noSA = false
        }
        if (this.state.noPwdSA) {
          context.commit('setResetPwdSASecurityQuestionsOnLogin', undefined)
          context.commit('setResetPwdSAPINOnLogin', undefined)
          context.commit('setResetPwdSASQorPINOnLogin', undefined)
          context.commit('setResetPwdSASQandPINOnLogin', undefined)
        }
        if (error && error.exceptionType === 'MissingOrExpiredPinException') {
          context.commit('setOverridenPINException', true)
        } else {
          context.commit('setLoginErrorMessage', error.message || 'Login failed. Unknown error occurred')
        }
        context.commit('setSessionDetails', undefined)
        if (window.dataLayer || context.getters['getThirdpartyAnalytics']) {
          let login = {
            'event': 'login',
            'gaEventCategory': 'login_sa',
            'gaEventAction': 'login error',
            'gaEventLabel': (error && error.message) || undefined // pass as undefined if not error message not available
          }
          context.dispatch('analyticsHandler', {'event': login})
        }
        if (error.exceptionType === 'LoginAttemptsException') {
          context.commit('setAccountIsLocked', true)
        }
      })
    },
    resetPwdSA (context, request) {
      return new Promise((resolve, reject) => {
        lib.rpcService.callBroker('iw', 'resetpwdsa', {
          'username': request.username,
          'pwdold': request.pwdold,
          'pwdnew': request.pwdnew,
          'answers': request.answers,
          'PIN': request.PIN,
          'ssn4': request.ssn4,
          'dob': request.dob
        }).then(response => {
          resolve(response)
        }).catch((error) => {
          console.log(error)
          reject(error)
        })
      })
    },
    onLoginSuccessSHW (context, response) {
      if (response && response.result && response.result.AccessToken && response.result.AccessTokenExpirationUTC && response.result.RefreshToken && response.result.RefreshTokenExpirationUTC) {
        context.commit('setLoginErrorMessage', '')
        window.scrollTo(0, 0)
        context.dispatch('getCustomerContext', true).then(function (customerContext) {
          setTimeout(function () {
            if (customerContext && customerContext.result && customerContext.result.Is2FA !== undefined) {
              context.commit('setIs2FA', customerContext.result.Is2FA)
              localStorage.setItem('is2FA', customerContext.result.Is2FA)
              if (customerContext.result.Is2FA === false && !context.getters['get2FADisableTrust']) {
                context.commit('setShow2FAPostRegPopup', true)
              }
            }
            let isCustomerVerified = context.getters['getIsCustomerVerified']
            if (!isCustomerVerified && router.currentRoute.name !== 'account-non-verified') {
              // router.push({name: 'account-non-verified'})
              context.dispatch('overlayState/deactivateMyAccountDialog')
              context.dispatch('overlayState/deactivateBetslip')
            }
          }, 1000)
        })
        context.commit('setFirstTimeLogin', response.ftl) // first time login popup
        context.dispatch('overlayState/deactivateLoginDialog')
        context.dispatch('overlayState/deactivateWelcomeDialog')
        context.commit('setSessionDetails', response.result)
        context.commit('setLoginTime', Date.now())
        Vue.set(localStorage, 'loginTime', Date.now())
        // config.customCookies.setCookie('sessionDetails', response.result)
        if (IPInterval) {
          context.dispatch('IPcheck').then((response) => {
            if (response && response.result) {
              let data = response.result
              localStorage.uip = data.ip
            }
          }).catch((error) => {
            console.log('error', error)
          })
        }
        if (config.app.autoconf.SESSION_TIME_POPUP) {
          context.dispatch('SessionTime', {'interval': config.app.autoconf.SESSION_TIME_POPUP, 'loggedInTime': moment().format(), 'setTimer': true})
        }
      }
    },
    getCustomerContext (context, onLogin = false) {
      clearTimeout(context.state.periodicalUpdateCustomerContext)
      context.commit('setBalanceLoader', true)
      return new Promise((resolve, reject) => {
        lib.rpcService.callBroker('iw', 'getcustomercontext', {})
          .then(response => {
            // let isCustomerVerified = response.result.Verified
            if (response && response.result) {
              context.commit('setCustomerContext', response.result)
              context.commit('setIsCustomerVerified', response.result.Verified)
              context.commit('setTotpIsVerified', response.result.TotpVerified)
              if (response.result && response.result.Alerts) {
                context.commit('setIsAristotleVerified', true)
                context.commit('setIsEmailVerified', true)
                context.commit('setIsPhoneVerified', true)
                context.commit('setAristotleVerificationStatus', undefined)
                context.commit('setManualVerificationStatus', undefined)
                context.commit('setNewVersionTermsAndConditions', undefined)
                context.commit('setIsWIDShouldVerify', false)
                context.commit('messageCenter/setLifetimeDepositReached', false)
                context.commit('messageCenter/setPendingInvestigation', false)
                context.commit('messageCenter/setIsSuspended', false)
                context.commit('setM2P', undefined)
                context.commit('setP2P', undefined)
                context.commit('setP2PVerified', true)
                context.commit('setM2PVerified', true)
                context.commit('setIsManuallyVerified', true)
                context.commit('setMka', undefined)
                context.commit('setMkaVerified', true)
                response.result.Alerts.forEach(function (alert) {
                  switch (alert.Key) {
                    case 'AVS':
                      context.commit('setIsAristotleVerified', false)
                      context.commit('setAristotleVerificationStatus', alert.Status && alert.Status.toLowerCase())
                      break
                    case 'AID':
                      context.commit('setIsManuallyVerified', false)
                      context.commit('setManualVerificationStatus', alert.Status && alert.Status.toLowerCase())
                      break
                    case 'EML':
                      context.commit('setIsEmailVerified', false)
                      break
                    case 'MTL':
                      context.commit('setIsPhoneVerified', false)
                      break
                    case 'TC':
                      context.commit('setNewVersionTermsAndConditions', true)
                      break
                    case 'WID':
                      context.commit('setIsWIDShouldVerify', true)
                      break
                    case 'M2P':
                      context.commit('setM2PVerified', false)
                      context.commit('setM2P', alert.Status && alert.Status.toLowerCase())
                      break
                    case 'P2P':
                      context.commit('setP2PVerified', false)
                      context.commit('setP2P', alert.Status && alert.Status.toLowerCase())
                      break
                    case 'MKA':
                      context.commit('setMkaVerified', false)
                      context.commit('setMka', alert.Status && alert.Status.toLowerCase())
                      break
                  }
                })
              }
              if ((response.result.Flags && onLogin) || (response.result.Flags && sessionStorage.displayOverlayMsg)) {
                sessionStorage.displayOverlayMsg = true
                let flags = response.result.Flags
                flags = flags.split(',')
                context.commit('setAlertMsgs', 'pending')
                context.commit('setPendingInvestigationOrAccountSuspension', flags)
                context.dispatch('overlayState/activateOverlayDialog')
              }
              if (response.result.ActionUpdate === false) {
                context.commit('setAllowAccountUpdate', false)
              }
              if (response.result.TimeLimitSeconds && response.result.TimeLimitSeconds === 0) {
                context.dispatch('logout')
              }
              if (response.result.TimeLimitSeconds && response.result.TimeLimitSeconds > 0 && response.result.TimeLimitSeconds < 3600) {
                clearTimeout(context.state.timeLimitsTimer)
                context.state.timeLimitsTimer = setTimeout(() => {
                  context.dispatch('logout')
                }, response.result.TimeLimitSeconds * 1000)
                if ((response.result.TimeLimitSeconds <= 300 && response.result.TimeLimitSeconds >= 240) && this.state.timeLimitLogout5MinutesAlert === undefined) {
                  context.commit('setTimeLimitLogout5MinutesAlert', true)
                }
                if ((response.result.TimeLimitSeconds <= 60) && this.state.timeLimitLogoutOneMinuteAlert === undefined) {
                  context.commit('setTimeLimitLogoutOneMinuteAlert', true)
                }
              }
              if (onLogin) {
                context.dispatch('getUid')
                  .then((uid) => {
                    context.dispatch('handleGeoComply', uid)
                    context.dispatch('sbBetslipState/checkBetSlipOwner', uid)
                  })
              }
              if ((this.state.pwdPolicy && this.state.pwdPolicy.toLowerCase() === 'alert') || sessionStorage.displayAlertResetPasswordOverlayMsg) {
                context.dispatch('overlayState/activateOverlayDialog')
                sessionStorage.displayAlertResetPasswordOverlayMsg = true
              }
              if (response.result.Flags && response.result.Flags.includes('LIFEDEP')) {
                context.commit('messageCenter/setLifetimeDepositReached', true)
              }
              if (window.ctsautoconf.BRAND !== 'sb') {
                if (response.result.Flags && response.result.Flags.includes('PEND')) {
                  context.commit('messageCenter/setPendingInvestigation', true)
                }
                if (response.result.Flags && response.result.Flags.includes('SUSP')) {
                  context.commit('messageCenter/setIsSuspended', true)
                }
              }
              context.commit('messageCenter/setCanNotDeposit', !response.result.ActionDeposit)
              context.commit('messageCenter/setCanNotWithdraw', !response.result.ActionWithdraw)
              if (localStorage.passwordAlertPolicy) {
                context.commit('messageCenter/setPasswordAlertPolicy', true)
              }
              context.commit('messageCenter/setIsNotVerified', !response.result.Verified)
            }
            /* setTimeout(function () {
              if (!isCustomerVerified && router.currentRoute.name !== 'account-non-verified' && router.currentRoute.name !== 'verify') {
                router.push({name: 'account-non-verified'})
              }
            }, 1000) */
            if (response.result.Balances[0].NoOfBets || response.result.Balances[0].NoOfBets === 0) context.commit('setNumberOfBets', response.result.Balances[0].NoOfBets) // first bet
            if (response.result.Balances[0].NoOfWithdrawals || response.result.Balances[0].NoOfWithdrawals === 0) context.commit('setNumberOfWithdrawals', response.result.Balances[0].NoOfWithdrawals) // first withdrawal
            if (response.result.Balances[0].NoOfDeposits || response.result.Balances[0].NoOfDeposits === 0) context.commit('setNumberOfDeposits', response.result.Balances[0].NoOfDeposits) // first deposit
            context.state.periodicalUpdateCustomerContext = setTimeout(function () {
              context.dispatch('getCustomerContext')
            }, window.ctsautoconf.customerContextUpdateInterval || context.state.defaultCustomerContextUpdateInterval)
            resolve(response)
          }).catch((error) => {
            reject(error)
          }).finally(() => {
            setTimeout(() => {
              context.commit('setBalanceLoader', false)
            }, 300)
          })
      })
    },
    verifyTotpFactorAsync (context, request) {
      let isLoggedIn = context.getters['isLoggedIn']
      if (isLoggedIn) {
        return new Promise((resolve, reject) => {
          lib.rpcService.callBroker('totp', 'verifytotpfactorasync', {
            'pin': request.pin
          }).then(response => {
            resolve(response)
          }).catch((error) => {
            reject(error)
          })
        })
      }
      return new Promise((resolve, reject) => {
        lib.rpcService.callBroker('totp', 'verifytotpfactoruserpassasync', {
          'pin': request.pin,
          'username': request.username,
          'password': request.password
        }).then(response => {
          resolve(response)
        }).catch((error) => {
          reject(error)
        })
      })
    },
    createTotpFactorAsync (context, request) {
      let isLoggedIn = context.getters['isLoggedIn']
      if (isLoggedIn) {
        return new Promise((resolve, reject) => {
          lib.rpcService.callBroker('totp', 'createtotpfactorasync', {})
            .then((response) => {
              if (!(response && response.exceptionType && response.message)) {
                context.commit('setTotpFactorAsync', response && response.result)
              }
              resolve(response)
            })
            .catch((error) => {
              reject(error)
            })
        })
      }
      return new Promise((resolve, reject) => {
        lib.rpcService.callBroker('totp', 'createtotpfactoruserpassasync', {
          'username': request && request.username,
          'password': request && request.password
        })
          .then((response) => {
            if (!(response && response.exceptionType && response.message)) {
              context.commit('setTotpFactorAsync', response && response.result)
            }
            resolve(response)
          })
          .catch((error) => {
            reject(error)
          })
      })
    },
    getUid (context) {
      return new Promise((resolve, reject) => {
        lib.rpcService.callBroker('iw', 'uid', {})
          .then((response) => {
            if (response) {
              if (window.xtremepush) window.xtremepush('set', 'user_id', response.result) // set user_id is set to XP directly. The all-other events through analytics bridge
              resolve(response.result)
            }
          })
          .catch((error) => {
            console.log(error)
          })
      })
    },
    handleGeoComply (context, uid) {
      if (context.getters['getIsOpenedFromWebView']) {
        mobileBridge.bridgeSendRequest('userAccountNumber', uid)
      }
      localStorage.customer = uid
      // Update MOCKUP_GEOCOMPLY
      if ((!context.getters['getWebViewAndMobile'] && !context.getters['getIsOpenedFromWebView'])) {
        var userID = uid
        var reason = 'Login'
        var sessionId = false
        context.dispatch('IPcheckInterval')
        if (window.ctsautoconf.MOCKUP_GEOCOMPLY !== undefined) {
          if (!window.ctsautoconf.MOCKUP_GEOCOMPLY) {
            context.dispatch('externalGeoComplyServiceController', { userID, sessionId, reason })
          } else {
            geocomply.geoComplyMockupService(true) // true/false - success/failed geolocation
          }
        } else {
          context.dispatch('externalGeoComplyServiceController', { userID, sessionId, reason })
        }
        let rememberMe = config.customCookies.getCookie('rememberMe')
        if (Object.keys(rememberMe).length === 0 && context.getters['getRememberMe']) {
          config.customCookies.setCookie('rememberMe', { 'remember': true }, 1)
        }
      }
      // analytics part
      if (window.dataLayer || context.getters['getThirdpartyAnalytics']) {
        let event
        let xtremeObj
        if (localStorage && localStorage.autologinAfterRegistration) {
          event = {
            'event': 'signup_complete',
            'gaEventCategory': 'registration',
            'gaEventAction': 'registration success',
            'accountId': localStorage.customer
          }
          xtremeObj = {
            'param1': 'event',
            'param2': 'registration_completed'
          }
          if (window.xtremepush) window.xtremepush('set', 'user_id', localStorage.customer) // corner case - by XP request set user_id on registration as well.
          localStorage.removeItem('autologinAfterRegistration')
        } else {
          event = {
            'event': 'login',
            'gaEventCategory': 'login',
            'gaEventAction': 'login success',
            'gaEventLabel': undefined,
            'loginStatus': 'logged in',
            'accountId': localStorage.customer
          }
          xtremeObj = {
            'param1': 'event',
            'param2': 'player_logged_in'
          }
            // analyticsBridge.xtremePush(xtremeObj, false)
        }
        context.dispatch('analyticsHandler', {'event': event, 'xtremeObj': xtremeObj})
      }
    },
    sendPINByUsernameAndPassword (context, request) {
      lib.rpcService.callBroker('iw', 'sendpinbyusernameandpassword', {
        'username': request.username,
        'password': request.password,
        'is4Login': request.is4Login
      }).catch((error) => {
        console.log(error)
      })
    },
    logout (context, retainBetSlipSelections) {
      if (router.currentRoute.name !== 'logout' && router.currentRoute.name !== 'sports' && router.currentRoute.name !== 'verify' && router.currentRoute.name !== 'set-password-by-temp-session') {
        router.push('/sports')
      }
      context.commit('setPageLoader', true)
      context.commit('setCustomerContext', undefined)
      localStorage.removeItem('last-keep')
      localStorage.removeItem('loggedIn')
      localStorage.removeItem('customer')
      localStorage.removeItem('uip')
      localStorage.removeItem('transactionType')
      sessionStorage.removeItem('displayOverlayMsg')
      sessionStorage.removeItem('displayAlertResetPasswordOverlayMsg')
      sessionStorage.removeItem('AlertResetPasswordDaysLeft')
      sessionStorage.removeItem('autologinAfterRegistration')
      // sessionStorage.removeItem('SessionTime')
      localStorage.removeItem('SessionTime')
      context.commit('setAllowAccountUpdate', true)
      context.commit('setPendingInvestigationOrAccountSuspension', false)
      context.dispatch('overlayState/deactivateOverlayDialog')
      context.commit('setNewVersionTermsAndConditions', undefined)
      clearInterval(this.checkIfAnyClicks)
      clearInterval(IPcheckInterval)
      clearTimeout(sessionTimeNotifier)
      context.commit('sightline/resetState')
      // context.commit('cashinshop/resetState')
      context.commit('phoneVerification/resetState')
      context.commit('notificationPreferences/resetState')
      context.commit('setTimeLimitLogout5MinutesAlert', undefined)
      context.commit('setTimeLimitLogoutOneMinuteAlert', undefined)
      context.commit('setPwdPolicy', undefined)
      context.commit('setPwdResetMode', undefined)
      context.commit('setResetPwdSASecurityQuestionsOnLogin', undefined)
      context.commit('setResetPwdSAPINOnLogin', undefined)
      context.commit('setResetPwdSASQorPINOnLogin', undefined)
      context.commit('setResetPwdSASQandPINOnLogin', undefined)
      localStorage.removeItem('passwordAlertPolicy')
      context.commit('messageCenter/setPasswordAlertPolicy', false)
      context.commit('setAccountIsLocked', false)
      context.commit('setIs2FA', true)
      context.commit('setShow2FAPostRegPopup', false)
      localStorage.removeItem('is2FA')
      context.commit('favorites/setAllFavorites', undefined)
      context.commit('favEvents/setMyEvents', undefined)
      context.commit('favEvents/setFavEvents', undefined)
      context.commit('setTotpIsVerified', false)
      context.commit('setIsPhoneVerified', false)
      localStorage.customer = undefined
      if (!retainBetSlipSelections) {
        context.dispatch('sbBetslipState/clearBetSlip')
      }
      context.dispatch('sbBetslipState/resetBetSlipChanges')

      if (walletParams.logout) {
        var callService = walletProvider || walletParams.userServiceLogout

        lib.rpcService.callBroker(callService, 'Logout', { }).then(() => {
          context.commit('sbBetslipState/setActiveBetSlipHistoryTab', '')
          context.commit('setLoginErrorMessage', '')
          context.dispatch('getCustomerContext')
          if (!context.getters['getIsOpenedFromWebView']) {
            context.commit('overlayState/setGeolocationMessage', {})
            localStorage.setItem('geoError', false)
            geocomply.geocomplyClientDisconnect()
          }
          if (context.getters['getIsOpenedFromWebView']) {
            mobileBridge.mobileLogout()
          }
          // router.push({ name: 'home' })
          context.commit('setPageLoader', false)
        }).catch((error) => {
          context.commit('setLoginErrorMessage', error.error.Message || 'Logout failed. Unknown error occurred')
          context.commit('setPageLoader', false)
        })
      }
      lib.rpcService.api.helpers.clearTokens()
    },
    getSessionDetails (context, sessionToken) {
      return new Promise((resolve, reject) => {
        lib.rpcService.callBroker('SharedWalletService', 'GetSessionDetails', {
          'sessionToken': sessionToken,
          'IDDCLanguage': config.app.language
        }).then(response => {
          if (response.result) {
            resolve(response.result)
          } else {
            return undefined
          }
        }).catch((error) => {
          reject(error)
        })
      })
    },
    softGeolocation (context) {
      var softVerifiedResult = JSON.parse(sessionStorage.getItem('softVerifiedResult'))
      var countryName, USstate, stateName, currentState, errorCode
      if (softVerifiedResult === null) {
        lib.rpcService.callBroker('GeoLocationService', 'Locate', {}).then(response => {
          if (response.result) {
            countryName = response.result.Country.Name
            USstate = response.result.MostSpecificSubdivision.IsoCode
            stateName = response.result.MostSpecificSubdivision.Name
            currentState = window.ctsautoconf.STATE
            USstate = (countryName === 'United Kingdom') ? 'LND' : USstate // for testing usage
            console.log('response', response.result)
            if (currentState !== USstate) {
              sessionStorage.setItem('softVerifiedResult', JSON.stringify({ 'located': false, 'USstate': USstate, 'stateName': stateName, 'countryName': countryName }))
              if (context.state.optionalISOStates.includes(USstate)) {
                context.dispatch('softGeolocationRedirect', {USstate, stateName})
              }
            } else {
              sessionStorage.setItem('softVerifiedResult', JSON.stringify({ 'located': true, 'USstate': USstate, 'stateName': stateName, 'countryName': countryName }))
            }
          }
        }).catch(() => {
          errorCode = 'softGeolocation'
          context.commit('overlayState/setGeolocationMessage', { errorCode })
          context.dispatch('overlayState/activeGeolocationDialog')
        })
      } else {
        if (!softVerifiedResult.located) {
          USstate = (softVerifiedResult.countryName === 'United Kingdom') ? 'LND' : softVerifiedResult.USstate // for testing usage
          if (context.state.optionalISOStates.includes(USstate)) {
            let sn = softVerifiedResult.stateName
            context.dispatch('softGeolocationRedirect', {USstate, sn})
          }
        }
      }
    },
    softGeolocationRedirect (context, data) {
      var url
      var stateISO = data.USstate
      var stateName = data.stateName
      var stateCodeStorage = sessionStorage.getItem('stateCode')
      var errorCode = 'softGeolocationRedirect'
      if (context.state.optionalISOStates.includes(stateISO)) {
        url = window.ctsautoconf.WESTVIRGINIA
      }
      var pathAndState = { stateISO, url, stateName }
      if (stateCodeStorage !== null) {
        if (stateCodeStorage !== stateISO) {
          sessionStorage.setItem('stateCode', stateISO)
          if (localStorage.getItem('siteVisited') === null) {
            localStorage.setItem('siteVisited', true)
            setTimeout(() => {
              context.commit('overlayState/setGeolocationMessage', { errorCode, pathAndState })
              context.dispatch('overlayState/activeGeolocationDialog')
            }, 5000)
          } else {
            window.open(url, '_self')
          }
        }
      } else {
        sessionStorage.setItem('stateCode', stateISO)
        if (localStorage.getItem('siteVisited') === null) {
          localStorage.setItem('siteVisited', true)
          setTimeout(() => {
            context.commit('overlayState/setGeolocationMessage', { errorCode, pathAndState })
            context.dispatch('overlayState/activeGeolocationDialog')
          }, 5000)
        } else {
          window.open(url, '_self')
        }
      }
    },
    setIsOpenedFromWebView (context, isOpenedFromWebView) {
      context.commit('setIsOpenedFromWebView', isOpenedFromWebView)
    },
    externalGeoComplyServiceController (context, data) {
      const provider = window.ctsautoconf.WALLET_PROVIDER
      switch (provider) {
        case 'GAN':
          geocomply.geoComplyService(data.userID, data.reason)
          break
        case 'FD':
        case 'SHW':
          geocomply.geoComplyServiceModules(data.userID, data.sessionId, data.reason)
          break
      }
    },
    geoComplyGetLicense (context, state) {
      const provider = window.ctsautoconf.WALLET_PROVIDER
      switch (provider) {
        case 'FD':
          return lib.rpcService.callBroker(walletProvider, 'GetGeoComplyLicense', {
            'state': state
          })
        case 'SHW':
          return lib.rpcService.callBroker('GeoComplyService', 'AcquireLicense', {
            'state': state
          })
      }
    },
    geoComplyGetNewLicense (context, data) {
      const provider = window.ctsautoconf.WALLET_PROVIDER
      switch (provider) {
        case 'FD':
          return lib.rpcService.callBroker(walletProvider, 'GetNewGeoComplyLicense', {
            'state': data.state,
            'license': data.license
          })
      }
    },
    geoComplySubmit (context, data) {
      const provider = window.ctsautoconf.WALLET_PROVIDER
      switch (provider) {
        case 'FD':
          return lib.rpcService.callBroker(walletProvider, 'SubmitGeoComplyPacket', {
            'geopacket': data.geoPacket,
            'state': data.state
          })
        case 'SHW':
          return lib.rpcService.callBroker('geocomplyservice', 'ValidateGeolocation', {
            'licence': data.geoPacket
          })
      }
    },
    mobileGeolocated (context) {
      if (context.getters['getIsOpenedFromWebView'] || window.ctsautoconf.MOBILE_LS) {
        let isMobileGeolocated = ('mobileGeolocated' in localStorage) ? JSON.parse(localStorage.mobileGeolocated) : false
        context.commit('setGeolocated', isMobileGeolocated)
      }
    },
    /* through API only */
    checkActivity (context) {
      if (context.state.userActive) {
        lib.rpcService.callBroker(walletProvider, 'refreshtoken', {})
          .catch(() => {
            context.dispatch('logout', true)
          }).finally(() => {
            context.commit('setUserActive', false)
          })
      }
    },
    verifyEmailByPIN (context, request) {
      if (request.isLoggedIn) {
        return lib.rpcService.callBroker('psregistrationservice', 'verifyemailbysession', {
          'PIN': request.pin
        })
      } else {
        return lib.rpcService.callBroker('psregistrationservice', 'verifyemailbyusernameandpassword', {
          'Username': request.userName,
          'Password': request.password,
          'PIN': request.pin
        })
      }
    },
    resendPin2Email () {
      return lib.rpcService.callBroker('psregistrationservice', 'resendpintoemail', {})
    },
    resendPin2Phone (context, request) {
      let isLoggedIn = context.getters['isLoggedIn']
      if (isLoggedIn) {
        return lib.rpcService.callBroker('psregistrationservice', 'resendpintophone', {})
      }
      return lib.rpcService.callBroker('psregistrationservice', 'sendpin2verifyphone', {
        'Username': request.username,
        'Password': request.password
      })
    },
    verifyPhoneByPIN (context, request) {
      if (request.isLoggedIn) {
        return lib.rpcService.callBroker('psregistrationservice', 'verifyphonebysession', {
          'PIN': request.pin
        })
      } else {
        return lib.rpcService.callBroker('psregistrationservice', 'verifyphonebyusernameandpassword', {
          'Username': request.userName,
          'Password': request.password,
          'PIN': request.pin
        })
      }
    },
    uploadImages (context, request) {
      return lib.rpcService.callBroker('psregistrationservice', 'uploadimages', request)
    },

    getW2gTaxFormList (context, { dateFrom, dateTo }) {
      const request = {
        DateFrom: dateFrom,
        DateTo: dateTo
      }
      return lib.rpcService.callBroker('iw', 'w2glist', request)
        .then(response => {
          return response.result
        })
    },
    async getW2gFormAuthorizedDownloadLink (context, betId) {
      return lib.rpcService.callBroker('iw', 'w2gauthdownload', { id: betId })
        .then(response => {
          // response example: {
          //    "Token":"20ecf029e93b4d65a9034764cfcbbccb",
          //    "URL":"w2gform/384/20ecf029e93b4d65a9034764cfcbbccb",
          //    "ValidSeconds":10
          // }
          const pdfRelativeUrl = response.result.URL  // eg. 'w2gform/384/20ecf029e93b4d65a9034764cfcbbccb'
          const baseUrl = api.helpers.getApiEndpointUrl('iw')
          const pdfAbsoluteUrl = baseUrl + pdfRelativeUrl // eg. http://api.igtwallet.cts.webteam.beg.finsoft.com/api/v1/iw/w2gform/384/20ecf029e93b4d65a9034764cfcbbccb
          return pdfAbsoluteUrl
        })
    },
    async fetchPromotions (context) {
      try {
        let response = await lib.kansas.psPromotions({
          businessUnit: config.app.businessUnit
        })
        if (response && response.data && response.data.length > 0) {
          context.commit('setPromotions', response.data)
        }
      } catch (exception) {
        console.log(exception)
      }
    },
    fetchPsSetup (context) {
      lib.kansas.psSetup()
        .then(response => {
          if (response && response.data) {
            let saTypes = response.data.security && response.data.security.sa && response.data.security.sa.allowed
            let allowedSA = []
            if (saTypes) {
              saTypes.forEach(function (saType) {
                /* switch (saType) {
                  case '1':
                    allowedSA.push({mode: 1, value: 'SECQ2'})
                    break
                  case '2':
                    allowedSA.push({mode: 2, value: 'SELF_BY_PIN'})
                    break
                  case '3':
                    allowedSA.push({mode: 3, value: 'PIN_OR_SECQ2'})
                    break
                  case '4':
                    allowedSA.push({mode: 4, value: 'PIN_AND_SECQ2'})
                    break
                } */
                switch (saType) {
                  case '2':
                    allowedSA.push({mode: 2, value: 'SELF_BY_PIN'})
                    break
                  default:
                    break
                }
              })
            }
            context.commit('setAllowedSATypes', allowedSA)
          }
        }).catch((error) => {
          console.log(error)
        })
    },
    analyticsHandler (context, data) {
      if (data && data.event && window.dataLayer) {
        let newObj = {}
        for (const key in data.event) {
          if (data.event.hasOwnProperty(key)) {
            newObj[key] = data.event[key]
          }
        }
        window.dataLayer.push(newObj)
      }
      if (context.getters['getThirdpartyAnalytics'] || window.xtremepush) {
        let ab = {}
        for (const key in data.event) {
          if (data.event.hasOwnProperty(key)) {
            ab[key] = data.event[key]
          }
        }
        analyticsBridge.dataParser(ab, data.xtremeObj)
      }
    },
    IPcheck () {
      return lib.rpcService.callBroker('iw', 'IPCheck', {})
    },
    // IP checker for desktop web or mobile app
    IPcheckInterval (context) {
      if ((IPInterval && IPInterval > 0) && ((!context.getters['getWebViewAndMobile'] && !context.getters['getIsOpenedFromWebView']) || window.ctsautoconf.MOBILE_LS)) {
        console.log('start IP checking')
        IPcheckInterval = setInterval(function () {
          var uip = localStorage.uip || null
          context.dispatch('IPcheck').then((response) => {
            var data = response.result
            console.log('IPcheck response', response)
            console.log('uip', uip)
            if (data && (data.ip && uip) && (data.ip !== uip) && context.getters['getGeolocated']) {
              console.log('IP changed')
              context.commit('setGeolocated', false)
              if (window.ctsautoconf.MOBILE_LS) {
                localStorage.uip = data.ip
                localStorage.mobileGeolocated = false
                mobileBridge.bridgeSendRequest('IPchanged')
                return false
              }
              localStorage.gcPerm = false
              console.log('window.GeoComply', window.GeoComply.Client.isConnected())
              if (!window.GeoComply.Client.isConnected()) {
                geocomplyMethod.connectGeoComplyService()
              }
              let userID = localStorage.customer
              let reason = 'IP changed'
              clearInterval(geocomplyMethod.initPeriodicCheck)
              setTimeout(() => {
                geocomplyMethod.requestGeoLocation(userID, reason)
              }, 0)
            }
            localStorage.uip = data.ip
          }).catch((error) => {
            console.log('error', error)
          })
        }, IPInterval)
      }
    },
    registerFirebaseNotification (context, data) {
      return lib.rpcService.callBroker('iw', 'registerfirebasenotification', data)
    },
    SessionTime (context, data) {
      let setTimer = data.setTimer || false
      let timer = data.interval
      let logDate = data.loggedInTime
      if (setTimer) {
        localStorage.setItem('SessionTime', JSON.stringify({'date': logDate, 'interval': timer}))
      }
      if (data.mobileContinue) {
        clearTimeout(sessionTimeNotifier)
      }
      sessionTimeNotifier = setTimeout(() => {
        let dialogData = context.getters['overlayState/getSessionDialogData']
        if (dialogData.isactive) {
          context.dispatch('overlayState/deactivateSessionDialog')
        }
        context.commit('overlayState/setSessionDialogData', {isactive: true, context: 'sessiontime'})
        context.dispatch('SessionTime', {'interval': config.app.autoconf.SESSION_TIME_POPUP, 'loggedInTime': moment().format(), 'setTimer': true})
      }, timer)
    },
    geocomplyTechnicalError (context, data) {
      lib.rpcService.callBroker('geocomplyservice', 'loggeolocfailedrequest', {
        'Uid': data.userID,
        'Reason': data.logReason,
        'ErrorCode': data.errorCode,
        'ErrorType': data.keyName,
        'ErrorMessage': data.errorMessage
      }).catch(err => console.log('error:', err))
    }
  },

  modules: {
    statementState,
    siteNavigationState,
    bonavigationState,
    marketgroupState,
    sbBetslipState,
    livebettingState,
    screenState,
    overlayState,
    eventState,
    geocomply,
    sightline,
    cashinshop,
    phoneVerification,
    notificationPreferences,
    accountState,
    vouchers,
    pmBetslipState,
    racecardState,
    payNearMe,
    igtPay,
    payments,
    paysafe,
    limits,
    messageCenter,
    searchState,
    exclusions,
    pnmGateway,
    registration,
    verification,
    favorites,
    favEvents,
    background,
    userEvents,
    contests,
    nuvei
  }
})
