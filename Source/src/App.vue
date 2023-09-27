<template>
<div class="app-warpper" :class="{'loading-translations' : !translationsLoaded}">
  <div class="site-loading" v-if="!translationsLoaded">
    <circle-loader></circle-loader>
  </div>
  <div
    id="app-body"
    class="app-body"
    :class="[bodyClass, {'scrolled': isScrolled}]"
    :style="[shouldSetBackgroundImage ? {backgroundImage: backgroundImageValue} : '']"
    ref="appbody"
  >
    <div class="header_background">
      <div class="header_holder">
        <header-part id="header-part" :style="tabletAndAbove && mainColumnWidth > 0 ? {width: mainColumnWidth + 'px'} : {}"></header-part>
        <div v-if="brandLayout === 'generic' && mobileBigAndBelow && isRootSportsNavigation" class="header_separator"></div>
      </div>
     <div v-if="brandLayout !== 'generic' && brandKey !== 'sb' && brandKey !== 'mav' && brandKey !== 'qcasino' && brandKey !== 'pr'" class="sub_header"></div>
    </div>
    <v-app>
      <v-content>
        <v-container fluid>
          <router-view />
        </v-container>
      </v-content>
      <!-- <bottom-navigation v-if="mobileBigAndBelow"></bottom-navigation> -->
      <!-- <geolocation-troubleshooter v-if="gelocationState"></geolocation-troubleshooter> -->
      <!-- <message-dialog v-if="messageState"></message-dialog> -->
      <!-- <log-dialog v-if="logState"></log-dialog> -->
      <!-- <session-dialog v-if="sessionDialogIsActive"></session-dialog> -->
      <!-- Popup with limits, on registration-login -->
      <!-- <PostRegistrationLimits/> -->
    </v-app>
    <!-- T&C pop-up -->
    <!-- <div class="tandc-popup-container" v-if="termsAndCondtions" :class="{'tandc-iframe': tAndCIFrame}">
      <div class="tandc-popup-child">
        <span class="tc-heading">{{ $t('MyAccount.AcceptTermsConditions') }}</span>
        <div class="tandc-popup-content">
          <div class="tc-text" v-if="tAndCText" v-html="tAndCText"></div>
        </div>
        <iframe class="tc-embedded" ref="tAndCondM" id="tcIFrame" v-if="tAndCIFrame"></iframe>
        <div class="form-actions">
          <v-btn class="btn primary-btn" @click="toggleTandC('accept')">{{ $t('Account.JoinUs.TC.Accept') }}</v-btn>
          <v-btn class="btn secondary-btn" @click="toggleTandC('decline')">{{ $t('Account.JoinUs.TC.Decline') }}</v-btn>
        </div>
      </div>
    </div> -->
    <!-- Force verification if PIN is set but MTL and TOTP are not verified -->
    <!-- <div class="tandc-popup-container tandc-iframe post-reg-popup" v-if="forceTOTPOrMTLVerification" :class="{'z-index-203': !isLoggedIn}">
      <div class="tandc-popup-child infoVer-popup">
        <div class="form-actions padding-y-20 not-2fa">
          <div>
            <SecuritySettings :hidePreferences="true"></SecuritySettings>
          </div>
          <div v-if="0">
            <v-btn class="btn confirm-btn btn-fullwidth border-secondary" @click="closeIs2FaDialog()">{{ $t('MyAccount.FirstTimeLogin.Verification.RemindMeLater') }}</v-btn>
          </div>
        </div>
      </div>
    </div> -->
    <!-- First login pop-up - info about verification -->
    <!-- <div class="tandc-popup-container tandc-iframe" v-if="loginForTheFirstTime && !isCustomerVerified">
      <div class="tandc-popup-child infoVer-popup reg-success-popup">
        <RegStepCounter class="reg_ver_register_title" :currentStep="5"></RegStepCounter>
        <span class="reg_ver_register"></span>
        <div class="tandc-popup-content">
          <div class="tc-text text-congrats" v-html="$t('MyAccount.FirstTimeLogin.Congratulations')"></div>
        </div>
        <div class="form-actions padding-y-20">
          <p class="text-verify">{{ $t('MyAccount.FirstTimeLogin.VerificationMessage') }}</p>
          <div>
            <v-btn class="btn primary-btn btn-fullwidth" @click="startVerification()">{{ $t('MyAccount.FirstTimeLogin.Verification.Start') }}</v-btn>
          </div>
          <div>
            <v-btn class="btn confirm-btn btn-fullwidth border-secondary" @click="remindMeLater()">{{ $t('MyAccount.FirstTimeLogin.Verification.RemindMeLater') }}</v-btn>
          </div>
        </div>
      </div>
    </div> -->
    <!-- Two-Factor Authentication - post-registration screen -->
    <!-- <div class="tandc-popup-container tandc-iframe post-reg-popup" v-if="show2FAPostRegPopup" :class="{'z-index-203': !isLoggedIn}">
      <div class="tandc-popup-child infoVer-popup">
        <div class="form-actions padding-y-20 not-2fa">
          <div>
            <SecuritySettings :hidePreferences="true"></SecuritySettings>
          </div>
          <div v-if="0">
            <v-btn class="btn confirm-btn btn-fullwidth border-secondary" @click="closeIs2FaDialog()">{{ $t('MyAccount.FirstTimeLogin.Verification.RemindMeLater') }}</v-btn>
          </div>
        </div>
      </div>
    </div> -->
    <!-- Time limits pop up -->
    <div>
      <!-- <div v-if="timeLimitLogout5MinuteAlert">
        <v-dialog v-model="timeLimits5MinExpirationDialog" max-width="400">
          <v-card class="timelimitspopup">
            <v-card-text class="tl-alert-msg">{{ $t('Account.PlayLimits.Time.ExpirationInFiveMinutes') }}</v-card-text>
            <v-card-actions class="accpage">
              <v-btn color="success" @click="timeLimits5MinExpirationDialog = false">{{ $t('Account.Logout.successful.ok') }}</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </div> -->
      <!-- <div v-if="timeLimitLogoutOneMinutAlert">
        <v-dialog v-model="timeLimits1MinExpirationDialog" max-width="400">
          <v-card class="timelimitspopup">
            <v-card-text class="tl-alert-msg">{{ $t('Account.PlayLimits.Time.ExpirationInOneMinute') }}</v-card-text>
            <v-card-actions class="accpage">
              <v-btn color="success" @click="timeLimits1MinExpirationDialog = false">{{ $t('Account.Logout.successful.ok') }}</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </div> -->
    </div>
    <!-- Hamburger menu -->
    <!-- <v-navigation-drawer class="dialog-menu hamburger" v-if="mobileBigAndBelow && brandKey !== 'mav' && brandLayout !== 'generic'" v-model="dialogHamburgerMenu" app fixed disable-resize-watcher disable-route-watcher>
      <div v-if="brandKey !=='boyd'" class="header">
      <v-flex v-if="brandLayout !== 'generic'" class="logo" @click="clickOnLogoHandler()">
        <router-link to="/">
          <img v-if="(brandKey === 'dn' || brandKey === 'dnw') && mobileBigAndBelow" :src="mediaServer('/static/brand-img/' + brandKey + '/logo-extend-white.png')" :alt="brandKey">
          <img v-else :src="mediaServer('/static/brand-img/' + brandKey + '/logo-white.png')" :alt="brandKey">
        </router-link>
      </v-flex>
        <v-btn flat @click="toggleHamburgerMenu()" class="close"><v-icon>close</v-icon></v-btn>
      </div>
      <v-flex class="close"><v-btn v-if="brandKey==='boyd'" flat @click="toggleHamburgerMenu()" class="close"><v-icon>close</v-icon></v-btn></v-flex>
      <hamburger-menu></hamburger-menu>
    </v-navigation-drawer> -->
    <!-- <v-dialog content-class="dialog-menu hamburger v-navigation-drawer" v-if="mobileBigAndBelow && (brandKey === 'dn' || brandKey === 'dnw')" v-model="dialogHamburgerMenu" fullscreen persistent hide-overlay transition="dialog-bottom-transition">
      <div :style="(brandKey === 'dn' || brandKey === 'dnw') ? {paddingTop: headerHeight + 'px'} : {}">
        <v-flex class="close"><v-btn v-if="brandKey==='boyd'" flat @click="toggleHamburgerMenu()" class="close"><v-icon>close</v-icon></v-btn></v-flex>
        <hamburger-menu></hamburger-menu>
      </div>
    </v-dialog> -->
    <footer-part></footer-part>
    <!-- <headlinesLight category="LoginHeadlines"></headlinesLight> -->
    <!-- <welcome-dialog v-if="welcomeDialog"></welcome-dialog> -->
    <!-- <welcome></welcome> -->
    <!-- <whats-new></whats-new> -->
  </div>
  </div>
</template>

<script>
  import store from '@/store'
  import lib from '@/library'
  import moment from 'moment'

  import Welcome from '@/components/common/Welcome'
  import WhatsNew from '@/components/common/WhatsNew'
  import Screen from '@/components/mixins/Screen'
  import Branding from '@/components/mixins/Branding'
  import airBridge from '@/components/mixins/airBridge'
  import Gtm from '@/components/mixins/Gtm'
  import Xtremepush from '@/components/mixins/Xtremepush'
  import CircleLoader from '@/components/common/CircleLoader'
  import BottomNavigation from '@/components/layout/parts/BottomNavigation'
  // import GeolocationMessage from '@/components/common/GeolocationMessage'
  import GeolocationTroubleshooter from '@/components/common/GeolocationTroubleshooter'
  import HeaderMessages from '@/components/layout/parts/HeaderMessages'
  import MessageDialog from '@/components/layout/parts/MessageDialog'
  import WelcomeDialog from '@/components/common/WelcomeDialog'
  import SessionDialog from '@/components/common/SessionDialog'
  import FooterPart from '@/components/layout/parts/FooterPart'
  import HeaderPart from '@/components/layout/parts/HeaderPart'
  import HamburgerMenu from '@/components/layout/parts/hamburgerMenu'
  import mobileBridge from '@/library/mobileBridge'
  import config from '@/config'
  import axios from 'axios'
  import adjust from '@/library/adjust'
  import Url from '@/components/mixins/Url'
  import RegStepCounter from '@/components/account/Registration/RegStepCounter'
  import SecuritySettings from '@/components/account/IntegratedWallet/SecuritySettings'
  import headlinesLight from '@/components/sports/bettingoffer/headlinesLight'
  import logDialog from '@/components/utilities/logDialog'
  import PostRegistrationLimits from '@/components/account/Limits/PostRegistrationLimitsV2'

  var activityIntervalId = null

  export default {
    mixins: [
      Screen,
      Branding,
      airBridge,
      Gtm,
      Url,
      Xtremepush
    ],

    components: {
      Welcome,
      WhatsNew,
      BottomNavigation,
      FooterPart,
      // GeolocationMessage,
      GeolocationTroubleshooter,
      HeaderMessages,
      MessageDialog,
      WelcomeDialog,
      SessionDialog,
      HeaderPart,
      CircleLoader,
      HamburgerMenu,
      RegStepCounter,
      SecuritySettings,
      headlinesLight,
      logDialog,
      PostRegistrationLimits
    },

    data () {
      return {
        bodyClass: '',
        periodicalLiveEventsUpdateTimeout: undefined,
        isPeriodicalLiveEventsUpdateStarted: false,
        periodicalBOUpdateTimeout: undefined,
        periodicalBOUpdateInterval: 60000,
        periodicalLiveStreamsUpdateTimeout: undefined,
        periodicalLiveStreamsUpdateInterval: 20000,
        periodicalSessionActivityCheckObj: 0,
        tAndCText: undefined,
        tAndCIFrame: true,
        periodicalPSSiteNavTimeout: undefined,
        periodicalPSSiteNavInterval: 60000,
        timeLimits5MinExpirationDialog: true,
        timeLimits1MinExpirationDialog: true,
        loginForTheFirstTime: false
      }
    },

    computed: {
      welcomeDialogState () {
        return store.getters['overlayState/getWelcomeDialogState']
      },
      headerHeight () {
        return store.getters['screenState/getHeaderHeight']
      },
      liveBettingDataSourceType () {
        return store.getters['livebettingState/liveBettingDataSourceType']
      },
      copyrightYear () {
        return (new Date()).getFullYear()
      },
      gelocationState () {
        return store.getters['overlayState/getGeolocationDialogState']
      },
      messageState () {
        return store.getters['overlayState/getMessageDialogState']
      },
      logState () {
        return store.getters['overlayState/getLogDialogState']
      },
      welcomeDialog () {
        return store.getters['overlayState/getWelcomeDialogState']
      },
      headerMessageState () {
        return store.getters['overlayState/getHeaderMessageState']
      },
      sessionDialogIsActive () {
        let data = store.getters['overlayState/getSessionDialogData']
        return data.isactive || false
      },
      isOpenedFromWebView () {
        return store.getters['getIsOpenedFromWebView']
      },
      mainColumnWidth () {
        return store.getters['screenState/getMainColumnWidth']
      },
      isWebViewAndMobile () {
        return store.getters['getWebViewAndMobile']
      },
      forceLivePull () {
        // debug: allow adding the ?forcelivepull or ?livefromgeneratordebug to the url to manually switch to PULL mode
        return this.$route.query.forcelivepull !== undefined || this.$route.query.livefromgeneratordebug !== undefined
      },
      forceLivePush () {
        // debug: allow adding the ?forcelivepush to the url to manually switch to PULL mode
        return this.$route.query.forcelivepush !== undefined
      },
      sessionDetails () {
        return store.getters['getSessionDetails']
      },
      isLoggedIn () {
        return store.getters['isLoggedIn']
      },
      webViewAndMobile () {
        return store.getters['getWebViewAndMobile']
      },
      walletProvider () {
        return config.app.autoconf.WALLET_PROVIDER
      },
      mockupGeoComply () {
        return window.ctsautoconf.MOCKUP_GEOCOMPLY
      },
      MobilelocalServer () {
        return window.ctsautoconf.MOBILE_LS || false
      },
      translationsLoaded () {
        return store.getters['getTranslationsLoaded']
      },
      termsAndCondtions () {
        return store.getters['getNewVersionTermsAndConditions']
      },
      dialogHamburgerMenu: {
        get: function () {
          return store.getters['overlayState/getHamburgerMenuState']
        },
        set: function (value) {
          if (value) {
            store.dispatch('overlayState/activateHamburgerMenu')
          } else {
            store.dispatch('overlayState/deactivateHamburgerMenu')
          }
        }
      },
      adjustToken () {
        let os = lib.core.userAgent.os.name
        let tokenId = (navigator.platform.indexOf('Mac') === 0 || navigator.platform.indexOf('Win') === 0) ? 'ADJUST_TOKEN_WEB' : 'ADJUST_TOKEN_' + os.toUpperCase()
        return window.ctsautoconf[tokenId]
      },
      headlinesPeriodicalUpdateInterval () {
        return window.ctsautoconf.HeadlinesPeriodicalUpdateInterval || 300000
      },
      timeLimitLogout5MinuteAlert () {
        return store.getters['getTimeLimitLogout5MinutesAlert']
      },
      timeLimitLogoutOneMinutAlert () {
        return store.getters['getTimeLimitLogoutOneMinuteAlert']
      },
      firstTimeLogin () {
        return store.getters['getFirstTimeLogin']
      },
      isCustomerVerified () {
        return store.getters['getIsCustomerVerified']
      },
      accountSummaryFlow () {
        return window.ctsautoconf.ACCOUNT_SUMMARY_FLOW || false
      },
      shouldSetBackgroundImage: () => store.getters['background/shouldSetBackgroundImage'],
      backgroundImageValue: () => store.getters['background/backgroundImageValue'],
      is2FA () {
        return store.getters['getIs2FA']
      },
      isDisableTrust2FA () {
        return store.getters['get2FADisableTrust']
      },
      show2FAPostRegPopup () {
        return store.getters['getShow2FAPostRegPopup']
      },
      isRootSportsNavigation () {
        return this.$route.name === 'sports'
      },
      forceTOTPOrMTLVerification () {
        return store.getters['getForceTOTPOrMTLVerification']
      },
      mobileAppAwakeStatus () {
        return store.getters['getMobileAppAwakeStatus']
      }
    },

    methods: {
      createBodyClass (routerObject) {
        var userAgentClasses = [
          'browser-'.concat(lib.core.userAgent.browser.name),
          'browser-version-'.concat(lib.core.userAgent.browser.version),
          'os-'.concat(lib.core.userAgent.os.name),
          'os-version-'.concat(lib.core.userAgent.os.version)
        ].join(' ')

        var brandKey = this.brandKey
        var brand = ''
        if (brandKey.indexOf('generic-') > -1) {
          brand = brandKey.split('-')
          brand = brand[1]
        } else {
          brand = brandKey
        }

        switch (this.brandKey) {
          case 'dnw':
            brand += ' dn'
            break
          default:
        }

        this.bodyClass = 'url-state-name-' + routerObject.name + ' ' +
                         lib.core.url.convertUrlToClasses(routerObject.path) + ' ' +
                         userAgentClasses + ' ' +
                         brand + ' ' + this.brandLayout
      },
      setGeolocation (isGeolocated) {
        // TODO This is just for testing external token. It should be refactored after tests.
        localStorage.mobileGeolocated = isGeolocated
        store.commit('setGeolocated', isGeolocated)
        if (!isGeolocated) {
          store.commit('setGeolocated', false)
        }
      },
      sessionCheck () {
        store.dispatch('getCustomerContext').then(() => {
           // MM session is present
          store.dispatch('mobileGeolocated')
          if (this.mockupGeoComply !== undefined && (!this.isOpenedFromWebView && !this.webViewAndMobile)) {
            if (this.mockupGeoComply) {
              store.commit('setGeolocated', JSON.parse(localStorage.getItem('gcPerm')))
            } else if (!this.mockupGeoComply) {
              this.startGeocomply()
              store.dispatch('IPcheckInterval')
            } else {
              this.startGeocomply()
              store.dispatch('IPcheckInterval')
            }
          } else {
            this.startGeocomply()
            store.dispatch('IPcheckInterval')
          }
          store.dispatch('payments/getAllowedPaymentTypes')
        }).catch((error) => {
          localStorage.removeItem('uip')
          console.log(error)
        }).finally(() => {
          var tabName = ''
          if (this.$route.name === 'sports') {
            tabName = 'Featured'
          } else if (this.$route.name === 'sports-live') {
            tabName = 'Live'
          }
          this.sendGTMpageview(this.isOpenedFromWebView, tabName)
        })
      },
      setLiveBettingDataSourceType (value) {
        store.commit('livebettingState/setLiveBettingDataSourceType', value)
      },
      startBoNavigationUpdate () {
        store.dispatch('bonavigationState/fetchBoNavigation').then(() => {
          clearTimeout(this.periodicalBOUpdateTimeout)
          this.periodicalBOUpdateTimeout = setTimeout(() => {
            this.startBoNavigationUpdate()
          }, this.periodicalBOUpdateInterval)
        })
      },
      startSiteNavigationUpdate () {
        store.dispatch('siteNavigationState/fetchSiteNavigation').then(() => {
          clearTimeout(this.periodicalPSSiteNavTimeout)
          this.periodicalPSSiteNavTimeout = setTimeout(() => {
            this.startSiteNavigationUpdate()
          }, this.periodicalPSSiteNavInterval)
        })
      },
      fetchPsSetup () {
        store.dispatch('fetchPsSetup')
      },
      fetchBoNavigationHeadlines () {
        store.dispatch('bonavigationState/fetchBoNavigationHeadlines')
        .then(() => {
          if (this.headlinesPeriodicalUpdateInterval) {
            clearTimeout(this.periodicalHeadlinesUpdateTimeout)
            this.periodicalHeadlinesUpdateTimeout = setTimeout(() => {
              this.fetchBoNavigationHeadlines()
            }, this.headlinesPeriodicalUpdateInterval)
          }
        })
      },
      startGeocomply () {
        let userID = localStorage.customer
        let sessionId = null
        let webViewAndMobile = store.getters['getWebViewAndMobile']
        store.commit('setGeolocated', JSON.parse(localStorage.getItem('gcPerm')))
        let isGeolocated = JSON.parse(localStorage.getItem('gcPerm'))
        let reason = 'Periodic'
        if (!webViewAndMobile && (!this.isOpenedFromWebView && isGeolocated)) {
          console.log('on refresh start geolocation')
          let currentTime = moment()
          let storedTime = JSON.parse(localStorage.getItem('tgc')).date
          let checkFor = JSON.parse(localStorage.getItem('tgc')).cf
          let diffTime = moment.duration(currentTime.diff(storedTime)).asMilliseconds()
          if (diffTime > checkFor) {
            console.log('bigger')
            store.dispatch('externalGeoComplyServiceController', {userID, sessionId, reason})
          } else if (diffTime < checkFor) {
            console.log('smaller')
            let getDiff = checkFor - diffTime
            setTimeout(() => {
              store.dispatch('externalGeoComplyServiceController', {userID, sessionId, reason})
            }, getDiff)
          }
        }
      },
      softGeolocation () {
        if (window.ctsautoconf.SOFTGEOLOCATION && window.ctsautoconf.STATE === 'NJ') {
          setTimeout(() => {
            if (!this.isOpenedFromWebView && !this.isLoggedIn) {
              store.dispatch('softGeolocation')
            }
          }, 1000)
        }
      },
      setHeaderSettings () {
        setTimeout(() => {
          if (!this.isOpenedFromWebView && this.mobileBigAndBelow) {
            store.commit('overlayState/setHeaderMessageState', true)
            store.commit('setWebViewAndMobile', true)
            store.commit('overlayState/setHeaderMessagesData', {'style': 'white'})
          }
        }, 500)
      },
      networkStatus () {
        if (!this.isOpenedFromWebView) {
          window.addEventListener('online', () => {
            setTimeout(() => (
              document.location.reload(true)
            ), 10000)
          })
        }
      },
      airBridgeInit () {
        if (this.walletProvider === 'GAN') {
          setTimeout(() => {
            if (this.isOpenedFromWebView) {
              console.log('site loaded')
              this.airBridgeRequest('site_loaded', {})
            }
          }, 3000)
        }
      },
      onFirstVisit () {
        if (window.ctsautoconf.STATE === 'WV' && (localStorage.getItem('siteVisited') === null || !localStorage.getItem('siteVisited'))) {
          setTimeout(() => {
            if (this.mobileBigAndBelow) {
              localStorage.setItem('siteVisited', true)
              store.commit('overlayState/setMessageDialogMsg', {reason: 'firstVisit', persistent: true, fullscreen: true})
              store.dispatch('overlayState/activateMessageDialog')
            }
          }, 5000)
        }
      },
      mobileBridge () {
        if (this.MobilelocalServer) {
          mobileBridge.init()
          return false
        }
        setTimeout(() => { // in case of regular web view
          if (this.isOpenedFromWebView) {
            mobileBridge.init()
          }
        }, 1000)
      },
      setMobileApp () {
        if (this.MobilelocalServer) {
          console.log('set from mobile app LS')
          localStorage.setItem('mobileAppLS', true)
          localStorage.setItem('webView', true)
          store.dispatch('setIsOpenedFromWebView', true)
        }
      },
      checkActivityPeriodicalStart () {
        activityIntervalId = setInterval(() => {
          store.dispatch('checkActivity')
        }, config.app.checkActivityInterval)
      },
      checkActivityPeriodicalStop () {
        clearInterval(activityIntervalId)
      },
      fetchTermsAndConditions () {
        lib.rpcService.callBroker('UserService', 'GetTsAndCsText', {'IDMDLanguage': config.app.language, 'versionNumber': null})
          .then(response => {
            if (response && response.result) {
              if (response.result.includes('<html>') || response.result.includes('<head>') || response.result.includes('<body>')) {
                let res = response.result
                let ifr = this.$refs.tAndCondM
                ifr = ifr && (ifr.contentWindow || (ifr.contentDocument.document || ifr.contentDocument))
                if (ifr) {
                  ifr.document.open()
                  ifr.document.write(res)
                  ifr.document.close()
                }
              } else {
                this.tAndCIFrame = false
                this.tAndCText = response.result
              }
            }
          })
      },
      toggleTandC (param) {
        if (param === 'decline') {
          store.dispatch('logout')
        } else if (param === 'accept') {
          this.confirmTandC()
        }
        // store.commit('setNewVersionTermsAndConditions', undefined)
      },
      confirmTandC () {
        lib.rpcService.callBroker('user', 'confirmtermsandconditions', {})
          .then(response => {
            let res = response.result
            if (res === null) {
              // check again customer context for t&c
              store.dispatch('getCustomerContext')
            }
          })
          .catch((err) => {
            console.log(err)
          })
      },
      fetchValidationRules () {
        axios.get('/static/validationRules/validationRules.json').then(response => {
          store.commit('setValidationRules', response.data)
        })
      },
      startLiveEventsPeriodicalUpdate () {
        var self = this
        self.lib = lib
        this.isPeriodicalLiveEventsUpdateStarted = true

        if (!this.liveBettingDataSourceType && !this.forceLivePull) {
          store.dispatch('livebettingState/calculateLocalClockOffsetInSeconds').then(() => {
            this.setLiveBettingDataSourceType('PUSH')

            self.lib.WebSocketLiveService.startService(() => {
              console.log('WebSocketService - Cannot connect to server. Switching to PULL mode')
              this.setLiveBettingDataSourceType('PULL')
              self.startLiveEventsPeriodicalUpdate()
            })
          })
        } else if (this.liveBettingDataSourceType === 'PUSH') {
          // DO nothing. It will work by magic :)
        } else if (this.liveBettingDataSourceType === 'PULL' || this.forceLivePull) {
          store.dispatch('livebettingState/fetchLiveEvents', {
            eventsperpage: 200,
            page: 1,
            maxnumofselectionsperevent: 6,
            flags: 'SHOWONFILTER' }).then(() => {
              self.setLiveBettingDataSourceType('PULL')
              clearTimeout(self.periodicalLiveEventsUpdateTimeout)
              self.periodicalLiveEventsUpdateTimeout = setTimeout(() => {
                if (self.isPeriodicalLiveEventsUpdateStarted) {
                  self.startLiveEventsPeriodicalUpdate()
                }
              }, 5000)
            })
        }
      },
      stopLiveEventsPeriodicalUpdate () {
        this.isPeriodicalLiveEventsUpdateStarted = false
        clearTimeout(this.periodicalLiveEventsUpdateTimeout)
        this.lib.WebSocketLiveService.stopService()
        this.setLiveBettingDataSourceType('')
      },
      startLiveStreamsUpdate () {
        store.dispatch('livebettingState/fetchLiveStreams', { idfoevent: 'ALL', streamtype: 'ALL' }).then(() => {
          clearTimeout(this.periodicalLiveStreamsUpdateTimeout)
          this.periodicalLiveStreamsUpdateTimeout = setTimeout(() => {
            this.startLiveStreamsUpdate()
          }, this.periodicalLiveStreamsUpdateInterval)
        })
      },
      stopLiveStreamsUpdate () {
        clearTimeout(this.periodicalLiveStreamsUpdateTimeout)
      },
      toggleHamburgerMenu () {
        if (this.dialogHamburgerMenu) {
          store.dispatch('overlayState/deactivateHamburgerMenu')
        } else {
          store.dispatch('overlayState/activateHamburgerMenu')
        }
      },
      fetchPromotions () {
        store.dispatch('fetchPromotions')
      },
      welcomePage () {
        var redirectedFrom = this.$route && this.$route.redirectedFrom ? this.$route.redirectedFrom : null
        var redirectedFromHome = redirectedFrom && ['/', '/home'].includes(redirectedFrom.toLowerCase())
        var redirectToSports = this.$route && this.$route.name && this.$route.name.toLowerCase() === 'sports'

        if (config.app.autoconf.WELCOME_PAGE && redirectedFromHome && redirectToSports) {
          // raise Welcome popup page
          store.dispatch('overlayState/activateWelcomeDialog')
        }
      },
      adjust () {
        setTimeout(() => {
          console.log('adjustToken', this.adjustToken)
          console.log('this.isOpenedFromWebView', this.isOpenedFromWebView)
          if (this.isOpenedFromWebView && this.adjustToken) {
            adjust.init(this.adjustToken)
          }
        }, 1000)
      },
      sessionTimeContinue () {
        var isSessionTime = localStorage.getItem('SessionTime')
        if (isSessionTime) {
          let currentDate = moment()
          let storedDate = JSON.parse(localStorage.getItem('SessionTime'))
          let interval = moment.duration(currentDate.diff(storedDate.date)).asMilliseconds()
          let intervalCal = storedDate.interval - interval
          if (interval < storedDate.interval) {
            store.dispatch('SessionTime', {'interval': intervalCal, 'continue': true})
          }
        }
      },
      startVerification () {
        if (this.accountSummaryFlow) {
          this.$router.replace({
            path: '/account/verification'
          }).catch(err => { console.log(err) })
        } else {
          if (this.$route.name !== 'verification') {
            this.$router.push({name: 'verification'})
          }
        }
        this.loginForTheFirstTime = false
      },
      remindMeLater () {
        this.loginForTheFirstTime = false
      },
      closeIs2FaDialog () {
        store.commit('setIs2FA', true)
      },
      resetMobileAppAwakeStatus () {
        store.commit('setMobileAppAwakeStatus', false)
      }
    },

    created () {
      // store.dispatch('refreshSession')
      if (config.app.autoconf.TRANSACTION_SERVER_CALL_MODE === 'API') {
        lib.rpcService.api.helpers.refreshTokenIfExpired()
      }
      this.initializeGTM()
      store.dispatch('sbBetslipState/fetchBettingParams')
      this.setMobileApp()
      this.welcomePage()
    },

    mounted () {
      store.commit('sbBetslipState/getConfig')
      this.startSiteNavigationUpdate()
      this.fetchBoNavigationHeadlines()
      this.startBoNavigationUpdate()
      this.createBodyClass(this.$route)
      this.airBridgeInit()
      if (window.ctsautoconf.WALLET_PROVIDER === 'HALLEY') {
        this.setGeolocation(true)
      }
      if (window.ctsautoconf.WALLET_PROVIDER !== 'HALLEY') {
        this.sessionCheck()
      }
      // this.softGeolocation() - TODO - Uncomment when Geolocation should be enabled

      if (this.forceLivePush) {
        this.setLiveBettingDataSourceType(null)
      }
      if (!(config.app.autoconf &&
        config.app.autoconf.ROUTERNAVGROUPS &&
        config.app.autoconf.ROUTERNAVGROUPS.navset &&
        config.app.autoconf.ROUTERNAVGROUPS.navset !== 'mixed' && config.app.autoconf.ROUTERNAVGROUPS.navset !== 'sports')) {
        this.startLiveEventsPeriodicalUpdate()
      }
      this.startLiveStreamsUpdate()
      this.setHeaderSettings()
      // this.networkStatus()
      this.onFirstVisit()
      this.mobileBridge()
      this.adjust()
      this.fetchValidationRules()
      this.fetchPromotions()
      this.fetchPsSetup()
      this.initXtremepush()
      if (window.ctsautoconf.INCOME_ACCESS_ENABLED) {
        var btag = this.$route.query.btag
        if (btag) {
          var IACookie = { 'btag': 'IA:' + btag }
          let currIA = config.customCookies.getCookie('IA')
          if (Object.keys(currIA).length === 0 && currIA.constructor === Object) {
            config.customCookies.setCookie('IA', IACookie, 30)
          }
        }
      }
      if (config.app.autoconf.SESSION_TIME_POPUP) {
        this.sessionTimeContinue()
      }
      store.commit('background/setAppBodyRef', this.$refs.appbody)

      store.commit('setIs2FA', localStorage.getItem('is2FA') === null || localStorage.getItem('is2FA') === 'true')
      store.dispatch('getTotpIsActiveAndDisableTrust')
    },

    destroyed () {
      this.stopLiveEventsPeriodicalUpdate()
      this.stopLiveStreamsUpdate()
    },

    watch: {
      '$route' (to, from) {
        this.createBodyClass(to)
        var tabName = ''

        if (to.name !== 'bonavigation1') {
          if (to.name === 'sports') {
            tabName = 'Featured'
          } else if (to.name === 'sports-live') {
            tabName = 'Live'
          }
          this.sendGTMpageview(this.isOpenedFromWebView, tabName)
        }
        if (!this.mobileBigAndBelow && to.name !== 'sports' && to.name !== 'sports-live' && to.name !== 'event' && to.name !== 'bonavigation1' && to.name !== 'bonavigation2' && to.name !== 'bonavigation3') {
          store.commit('sbBetslipState/setActiveBetSlipHistoryTab', '')
        }
      },
      welcomeDialogState (newVal, oldVal) {
        if (!newVal) {
          this.enableScroll()
          this.removeBodyClass('welcome-page-active')
        }
      },
      isLoggedIn (newVal, oldVal) {
        if (newVal) {
          this.checkActivityPeriodicalStop()
          this.checkActivityPeriodicalStart()
        } else {
          this.checkActivityPeriodicalStop()
        }
      },
      termsAndCondtions (val) {
        if (val) {
          this.fetchTermsAndConditions()
        }
      },
      firstTimeLogin (val) {
        if (val) {
          this.loginForTheFirstTime = this.$route.name !== 'verify'
        }
      },
      mobileAppAwakeStatus (val) {
        if (val) {
          this.stopLiveEventsPeriodicalUpdate()
          setTimeout(() => {
            this.startLiveEventsPeriodicalUpdate()
          }, 0)
          this.resetMobileAppAwakeStatus()
        }
      }
    },

    name: 'App'
  }
</script>
<style lang="stylus">
  @import './css/main'

  .header_background
    width: 100%
    position fixed
    top 0
    z-index 200
    @media mobile-big-and-below
      z-index 7
  .app-warpper
    &.loading-translations
      position relative
      overflow hidden
      height 100vh
    .app-body.url-404
      .container
        margin-top 130px
        display flex
        justify-content center
        align-items center
        height 60%
    @media tablet-and-above
      .app-body.url-logout
        #header-part
          max-width 1441px
  .site-loading
    background #f5f5f5
    color #000
    width 100%
    height 100%
    position absolute
    top 0
    bottom 0
    z-index 1000
    display flex
    justify-content center
    align-items center
    .loader
      width 80px !important
      height 80px !important
  .tandc-popup-container
    overflow hidden
    position fixed
    top 0
    right 0
    bottom 0
    left 0
    width 100%
    height 100%
    z-index 10000
    background  rgba(0,0,0,.7)
    @media mobile-big-and-below
      .infoVer-popup .form-actions
        position static !important
  .tandc-popup-container.post-reg-popup.z-index-203
    z-index 203 !important
  .tandc-popup-container.post-reg-popup
    z-index 202 !important
    .authy-popup-child
      bottom: 10%
    .infoVer-popup .form-actions.not-2fa
      position static !important
    .verify-content
      #confirmEmalByPinForm
        .form-actions
          position static !important
    .tandc-popup-content
      height: calc(100% - 75px)
      width: 100%
      overflow-y: auto
      padding-bottom: 90px

    &.tandc-iframe
      .tandc-popup-content
        padding: 0
        height: auto
        overflow hidden

  .tandc-popup-child
    padding 20px 20px 72px 20px
    position fixed
    top 10%
    right 10%
    bottom 10%
    left 10%
    z-index 10001
    background #fff
    -webkit-overflow-scrolling touch
    overflow-y scroll
    overflow -moz-scrollbars-none !important
    -ms-overflow-style none !important
    scrollbar-width: none
    &::-webkit-scrollbar
      width: 0 !important
    &.infoVer-popup
      max-width: 500px
      max-height 400px
      left: 50%
      right: 50%
      top: 25%
      bottom 30%
      margin-left: -250px
      margin-right: -250px
      display flex
      flex-direction: column
      @media mobile-big-and-below
        top: 20%
        bottom 25%
        right: 10%
        left: 10%
        margin-left: inherit
        margin-right: inherit
        overflow: initial
      .strong-auth
        i.close
          display inline-block
          top: 2px
          right: 5px
    &.infoVer-popup.reg-success-popup
      display flex
      flex-direction: column
      width 100%
      max-width: 500px
      height auto
      max-height 400px
      top: 50%
      transform translate(-50%, -50%)
      left: 50%
      right unset
      bottom unset
      margin-left 0
      margin-right 0
      padding 20px
      @media mobile-big-and-below
        width 90%
        max-width none
        max-height none
        overflow initial
        padding 40px 10px !important
      @media mobile-big-and-below
        .stepCount
          margin-bottom 20px
      .titles
        margin-bottom 0
      .step-number
        margin-top 0
        margin-bottom 0
      @media mobile-big-and-below
        .reg_ver_register
          height 60px !important
          width 60px !important
      .tandc-popup-content
        overflow-y hidden
      .form-actions
        position static
        padding 0 !important
    @media mobile-big-and-below
      padding 10px 10px 0px 10px !important
      top 2%
      right 5%
      left 5%
      bottom 5%
      overflow-y scroll
    .tc-heading
      display block
      padding 15px
      font-size 30px
      text-align center
  .tandc-popup-child .tc-embedded
    width 100%
    height: calc(100% - 75px)
    border none
    -webkit-overflow-scrolling touch
    overflow-y scroll
    @media mobile-big-and-below
      padding-bottom 75px
  .tandc-popup-child .form-actions
    position absolute
    right 0
    bottom 10px
    left 0
    z-index 10003
    text-align center
    background #fff
    padding 5px 0 20px 0 !important
    bottom 0px
    .v-btn.btn.primary-btn
      background-color #1a9ddd
      color #fff
    .v-btn.btn.secondary-btn
      background-color #1a9ddd
      color #fff
    .v-btn.btn.secondary-btn
      background-color #f5f8fc
      border 1px solid #cfd6db
      color #99a8b1
  .tandc-popup-child .reg_ver_register
    display: inline-block
    background-image: url(icons-path'/'reg_ver_register'.svg')
    background-position center
    height: 80px !important
    width: 80px !important
    margin 0 auto
  .tandc-popup-child .reg_ver_register_title
    margin-bottom: 19px
    @media mobile-big-and-below
      margin-bottom 35px
  .timelimitspopup
    .tl-alert-msg
      font-size 14px
      background 2px solid red
    .accpage
      margin 0
      padding 0
      display flex
      justify-content center
  .text-congrats
    text-align: center !important
    color #00c857
    font-family 'Open Sans Bold'
    padding 10px
    // margin-top 15px
    // font-weight: 900
    font-size 14px
    // margin-bottom: 20px
  .text-verify
    margin: 0
    text-align: center
    padding: 0 20px
    color: #ff0000
  .btn-fullwidth
    width: 100%
    max-width: 350px
    margin: 5px 0
  .padding-y-20
    padding-left 20px !important
    padding-right 20px  !important
  .border-secondary
    border var(--account-pages-secondary-btn-border) //1px solid #ff9016

  #webpush-notification-center-open
    display none
</style>
