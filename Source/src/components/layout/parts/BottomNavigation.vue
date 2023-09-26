<template>
  <div class="bottom-navigation" :class="{'hidden' : isHidden}">
    <v-bottom-nav id="qa-bottom-navigation" :class="{'ios-height' :  userAgent === 'ios' && iosAppVersion === 'fromWeb'}" app fixed :value="true" height="60">
      <template v-if="routerNavGroups && routerNavGroups.navset === 'mixed' && navgroupcontext4menu === 'pm'">
        <v-btn id="qa-sports-home" :ripple="false" @click="()=>{ togglePmBetslipOff(); go2PmBetting(); }" flat color="teal" value="recent" class="sports menu" :class="{'home promotions-v2': brandLayout==='generic'}">
          <div class="btn-icon-container"><icon name="icon-home"></icon></div>
          <span class="bottom_nav_text">{{ $t('BottomNav.RacingHome') }}</span>
        </v-btn>
        <v-btn id="qa-sports-horseracing" :ripple="false" @click="()=>{ togglePmBetslipOff(); toggleMenu(); }" flat color="teal" value="recent" class="sports menu" :class="[{'active': dialogSportsMenu || isSportsActive}, {'btnHR': brandLayout==='generic'}]">
          <div class="btn-icon-container"><span class="icon-horseracing"></span></div>
          <span class="bottom_nav_text" :class="dialogSportsMenu ? 'blue' : ''">{{ $t('BottomNav.AllRacing') }}</span>
        </v-btn>
        <router-link to="/" class="v-btn">
          <v-btn id="qa-sports-nfl" :ripple="false" @click="toggleHome()" flat value="favorites" class="home promotions-v2" :class="[{'active': activeHome}, {'sports home': brandLayout==='generic'}]">
            <div class="btn-icon-container"><icon name="icon-nfl" :colorName="'blue'"></icon></div>
            <span class="bottom_nav_text">{{ $t('BottomNav.Sports') }}</span>
          </v-btn>
        </router-link>
        <v-btn id="qa-sports-betslip-icon" :ripple="false" @click="togglePmBetslip()" flat color="teal" value="recent" class="sports menu" :class="[{'active': pmShowBetSlip}, {'betslip-button': brandLayout==='generic'}]">
          <div class="btn-icon-container"><v-icon class="betslip-icon">receipt</v-icon></div>
          <span class="bottom_nav_text">{{ $t('BottomNav.Betslip') }}</span>
          <badge :class="{'ios-badge' :  userAgent !== 'ios' && iosAppVersion === 'fromWeb'}" v-if="pmSelectedRunnersCount > 0">{{pmSelectedRunnersCount}}</badge>
        </v-btn>
      </template>

      <template v-else-if="routerNavGroups && routerNavGroups.navset === 'mixed' && navgroupcontext4menu !== 'pm'">
        <router-link to="/" class="v-btn">
          <v-btn id="qa-sports-home" :ripple="false" @click="toggleHome()" flat value="favorites" class="home promotions-v2" :class="{'active': activeHome}">
            <div class="btn-icon-container">
              <icon name="icon-home" :colorName="activeHome ? 'blue' : 'dark'"></icon>
            </div>
            <span class="bottom_nav_text" :class="activeHome ? 'blue' : ''">{{ $t('BottomNav.SportsHome') }}</span>
          </v-btn>
        </router-link>
        <v-btn id="qa-sports-nfl" :ripple="false" @click="toggleMenu()" flat color="teal" value="recent" class="sports menu" :class="{'active': dialogSportsMenu  || isSportsActive}">
          <div class="btn-icon-container">
            <icon name="icon-nfl" :colorName="'blue'"></icon>
          </div>
          <span class="bottom_nav_text" :class="dialogSportsMenu ? 'blue' : ''">{{ $t('BottomNav.AllSports') }}</span>
        </v-btn>
        <v-btn id="qa-sports-horseracing" :ripple="false" @click="go2PmBetting()" flat color="teal" value="recent" class="sports menu" :class="{'btnHR': brandLayout==='generic'}">
          <div class="btn-icon-container">
            <span class="icon-horseracing"></span>
          </div>
          <span class="bottom_nav_text">{{ $t('BottomNav.Racing') }}</span>
        </v-btn>
        <v-btn id="qa-sports-betslip-icon" :ripple="false" @click="toggleBetslip()" flat value="nearby" class="betslip-button" :class="{'active': dialogBetslip, 'hasSelections' : selectionsNo > 0}">
          <div class="btn-icon-container"><v-icon class="betslip-icon">receipt</v-icon></div>
          <span class="bottom_nav_text">{{ $t('BottomNav.Betslip') }}</span>
          <badge :class="{'ios-badge' :  userAgent !== 'ios' && iosAppVersion === 'fromWeb'}" v-if="selectionsNo > 0">{{selectionsNo}}</badge>
          <div :class="{'ios_betslip_mobile_msg' :  userAgent === 'ios' && iosAppVersion === 'fromWeb'}" class="betslip_mobile_msg" v-show="feedback"><p>{{feedback}}</p></div>
        </v-btn>
      </template>

      <template v-else>
        <router-link v-if="canHaveNavElm('HOME')"  to="/" class="v-btn">
          <v-btn id="qa-sports-home" :ripple="false" @click="toggleHome()" flat value="favorites" class="home promotions-v2" :class="{'active': activeHome}">
            <div class="btn-icon-container">
              <icon name="icon-home" :colorName="activeHome ? 'blue' : 'dark'"></icon>
            </div>
            <span class="bottom_nav_text" :class="activeHome ? 'blue' : ''">{{ $t('BottomNav.Home') }}</span>
          </v-btn>
        </router-link>
        <v-btn id="qa-sports-nfl" v-if="canHaveNavElm('SPORTS')" :ripple="false" @click="toggleMenu()" flat color="teal" value="recent" class="sports menu" :class="{'active': dialogSportsMenu || isSportsActive}">
          <div class="btn-icon-container">
            <icon name="icon-nfl" :colorName="'blue'"></icon>
          </div>
          <span class="bottom_nav_text" :class="dialogSportsMenu ? 'blue' : ''">{{ $t('BottomNav.AllSports') }}</span>
        </v-btn>
        <v-btn id="qa-sports-betslip-icon" v-if="canHaveNavElm('BETSLIP')" :ripple="false" @click="toggleBetslip()" flat value="nearby" class="betslip-button" :class="{'active': dialogBetslip, 'hasSelections' : selectionsNo > 0}">
          <div class="btn-icon-container">
            <v-icon class="betslip-icon">receipt</v-icon>
          </div>
          <span class="bottom_nav_text">{{ $t('BottomNav.Betslip') }}</span>
          <badge :class="{'ios-badge' :  userAgent !== 'ios' && iosAppVersion === 'fromWeb'}" v-if="selectionsNo > 0">{{selectionsNo}}</badge>
          <div :class="{'ios_betslip_mobile_msg' :  userAgent === 'ios' && iosAppVersion === 'fromWeb'}" class="betslip_mobile_msg" v-show="feedback"><p>{{feedback}}</p></div>
        </v-btn>
      </template>

      <v-btn id="qa-sports-specialLink" @click="specialLink()" v-if="navigationType">
        <div class="btn-icon-container">
          <icon :name="navigationName" :colorName="'dark'"></icon>
        </div>
        <span class="bottom_nav_text">{{ $t('BottomNav.SpecialLink') }}</span>
      </v-btn>
      <v-btn id="qa-sports-promos" v-if="canHaveNavElm('PROMOS')" class="promo" @click="go2Promotions()" :class="{'active': isPromotionsPageActive}">
        <div class="btn-icon-container">
          <v-icon>stars</v-icon>
        </div>
        <span class="bottom_nav_text">{{ $t('BottomNav.Promos') }}</span>
      </v-btn>
       <v-btn v-if="canHaveNavElm('INFO')"  @click="toggleHamburgerMenu()" flat class="info" :class="{'active': dialogHamburgerMenu || isInfoActive}">
          <div class="btn-icon-container">
            <icon name="icon-info"></icon>
          </div>
          <span class="bottom_nav_text">Info</span>
        </v-btn>
      <v-btn  v-if="canHaveNavElm('CONTESTS')" class="contests" @click="go2Contests()" :class="{'active': isContestsPageActive}">
        <div class="btn-icon-container">
          <v-icon>stars</v-icon>
        </div>
        <span class="bottom_nav_text">{{ $t('BottomNav.Contests') }}</span>
      </v-btn>
      <!-- <v-btn v-if="brandKey === 'sb'" class="contests" @click="go2Contests()" :class="{'active': isContestsPageActive}">
        <div class="btn-icon-container">
          <v-icon>stars</v-icon>
        </div>
        <span class="bottom_nav_text">Contests</span>
      </v-btn> -->
      <v-btn id="qa-sports-profile" :ripple="false" v-if="canHaveNavElm('PROFILE')" @click="()=>{ if(isLoggedIn) { toggleMyAccount() } else { toggleLogin(); } }" flat value="nearby" class="account" :class="{'active': dialogMyAccount || isMyProfileActive}">
        <div class="btn-icon-container">
          <v-icon v-if="brandKey !== 'boyd'">account_circle</v-icon>
          <icon v-if="brandKey === 'boyd'" name="icon-user-white"></icon>
        </div>
        <span class="bottom_nav_text" :class="dialogMyAccount ? 'blue' : ''">{{ $t('BottomNav.Profile') }}</span>
      </v-btn>
      <!-- DN -->
      <v-btn id="qa-sports-hamb-menu" :ripple="false" v-if="canHaveNavElm('HAMB_MENU') && (brandKey === 'dn' || brandKey === 'dnw')" @click="toggleHamburgerMenu()" flat value="nearby" class="hambMenu" :class="{'active': (dialogHamburgerMenu || dialogMyAccount)}">
        <div class="btn-icon-container">
          <v-icon>menu</v-icon>
        </div>
        <span class="bottom_nav_text" :class="dialogHamburgerMenu ? 'blue' : ''">{{ $t('BottomNav.HambMenu') }}</span>
      </v-btn>
      <!-- CIRCA -->
      <v-btn id="qa-sports-hamb-menu" :ripple="false" v-if="canHaveNavElm('HAMB_MENU') && brandKey === 'circa'" @click="toggleHamburgerMenu()" flat value="nearby" class="hambMenu" :class="{'active': dialogHamburgerMenu}">
        <div class="btn-icon-container">
          <v-icon>menu</v-icon>
        </div>
        <span class="bottom_nav_text" :class="dialogHamburgerMenu ? 'blue' : ''">{{ $t('BottomNav.HambMenu') }}</span>
      </v-btn>
    </v-bottom-nav>

    <v-navigation-drawer class="dialog-menu dialogsportsmenu" v-if="mobileBigAndBelow" v-model="dialogSportsMenu" app fixed disable-resize-watcher disable-route-watcher>
      <div v-if="brandLayout !== 'generic' && brandKey !=='boyd' && brandKey !=='sb'" class="header">
        <v-layout class="title">
          <v-flex class="logo-wrapper" :class="{'logo': (brandKey === 'dn' || brandKey === 'dnw')}">
            <img v-if="(brandKey === 'dn' || brandKey === 'dnw')" :src="mediaServer('/static/brand-img/' + brandKey + '/logo-extend-white.png')" :alt="brandKey">
            <logo v-else :mode="'light'"></logo>
          </v-flex>
          <v-flex class="close">
            <v-btn flat @click="toggleMenu()" class="close"><v-icon>close</v-icon></v-btn>
          </v-flex>
        </v-layout>
      </div>
      <v-flex v-if="brandKey ==='boyd' || brandKey === 'sb' || brandLayout === 'generic'" class="close">
        <v-btn flat @click="toggleMenu()" class="close"><v-icon>close</v-icon></v-btn>
      </v-flex>
      <div v-if="(routerNavGroups.navset === 'mixed' && navgroupcontext4menu === 'pm') || routerNavGroups.navset === 'pm'" class="sports-menu">
        <site-navigation :navigation-section="'RACING_MENU_TOP'" class="popular expand navigation topmenu"></site-navigation>
        <div class="wrapper sports-az all_racing navigation">
          <h3><span>All Racing</span></h3>
          <ul class="bo-navigation">
            <li v-for="(breed, breedIx) in pmMeetingsBreeds" :key="breedIx" class="navigation-item">
              <a @click="pmNavToBreed(breed)"><icon :name="'icon-' + breed.toLowerCase()"></icon>{{breed}}</a>
            </li>
          </ul>
        </div>
      </div>
      <template v-else>
        <xtremepush-inline-content v-if="(xtremepushWebInitialized || xtremePushEnabledMobile) && xtremepushOnSiteEnabled && xtremepushInlineContent" @xtremepushInlineContentToAllSportsNavigationDrawer="xtremepushInlineContentToAllSportsNavigationDrawer" ref="xtremepushInlineRef" :section="'all_sports'"></xtremepush-inline-content>
        <sports-menu></sports-menu>
      </template>
    </v-navigation-drawer>
     <!-- Info menu -->
    <v-navigation-drawer class="dialog-menu hamburger" v-if="mobileBigAndBelow && brandLayout === 'generic' && isInfoMenuEnabled" v-model="dialogHamburgerMenu" app fixed disable-resize-watcher disable-route-watcher>
      <div class="header">
        <v-btn flat @click="toggleHamburgerMenu()" class="close"><v-icon>close</v-icon></v-btn>
      </div>
      <hamburger-menu></hamburger-menu>
    </v-navigation-drawer>

    <v-dialog content-class="dialog-betslip" v-if="mobileBigAndBelow" v-model="dialogBetslip" fullscreen persistent hide-overlay transition="dialog-bottom-transition">
      <betslip></betslip>
    </v-dialog>
  </div>
</template>

<script>
  import store from '@/store'
  import config from '@/config'
  import Screen from '@/components/mixins/Screen'
  import Session from '@/components/mixins/Session'
  import Badge from '@/components/common/Badge'
  import SportsMenu from '@/components/sports/bettingoffer/SportsMenu'
  import HeaderInfo from '@/components/common/HeaderInfo'
  import Logo from '@/components/common/Logo'
  import Betslip from '@/components/sports/betslipV2/BetslipPage'
  import Icon from '@/components/common/Icon'
  import Gtm from '@/components/mixins/Gtm'
  import Branding from '@/components/mixins/Branding'
  import Url from '@/components/mixins/Url'
  import lib from '@/library'
  import SiteNavigation from '@/components/common/SiteNavigation'
  import mobileBridge from '@/library/mobileBridge'
  import HamburgerMenu from '@/components/layout/parts/hamburgerMenu'
  import XtremepushInlineContent from '@/components/layout/parts/XtremepusInlineContent'

  export default {
    name: 'BottomNavigation',

    mixins: [
      Screen,
      Session,
      Url,
      Gtm,
      Branding
    ],

    components: {
      Badge,
      Logo,
      SportsMenu,
      Betslip,
      HeaderInfo,
      Icon,
      SiteNavigation,
      HamburgerMenu,
      XtremepushInlineContent
    },

    props: {
      text: {
        type: String,
        default: ''
      }
    },

    data: () => ({
      sessionTime: 0,
      feedback: '',
      feedbackTo: null,
      isClickedFromBottomNavigation: false,
      navgroupcontext4menu: '',
      xtremepushDeliveredInlineContent: false
    }),

    computed: {
      isLoggedIn () {
        return store.getters['isLoggedIn']
      },
      sessionDetails () {
        return store.getters['getSessionDetails']
      },
      userAgent () {
        return lib.core.userAgent.os.name
      },
      iosAppVersion () {
        if (navigator.appVersion.indexOf('Safari') !== -1) {
          return 'fromWeb'
        } else {
          return undefined
        }
      },
      state () {
        return config.app.autoconf.STATE
      },
      dialogSportsMenu: {
        get: function () {
          return store.getters['overlayState/getSportsMenuState']
        },
        set: function (value) {
          if (value) {
            store.dispatch('overlayState/activateSportsMenu')
          } else {
            store.dispatch('overlayState/deactivateSportsMenu')
          }
        }
      },

      dialogMyAccount () {
        return store.getters['overlayState/getMyAccountDialogState']
      },
      dialogBetslip () {
        return store.getters['overlayState/getBetslipState']
      },
      selectionsNo () {
        return store.getters['sbBetslipState/selectionsNo']
      },
      allowedReturnsPRL () {
        return store.getters['sbBetslipState/allowedReturnsPRL']
      },
      allowedReturnsSGP () {
        return store.getters['sbBetslipState/allowedReturnsSGP']
      },
      gettingABTnR () {
        return store.getters['sbBetslipState/gettingABTnR']
      },
      mobileFeedback () {
        return store.getters['sbBetslipState/mobileFeedback']
      },
      isFastBetEnabled () {
        return store.getters['sbBetslipState/isFastBetEnabled']
      },
      popBetSlipOn1stSelection () {
        return store.getters['sbBetslipState/popBetSlipOn1stSelection']
      },
      activeHome () {
        if (store.getters['overlayState/getMyAccountDialogState'] === false && !this.dialogHamburgerMenu && store.getters['overlayState/getBetslipState'] === false && store.getters['overlayState/getSportsMenuState'] === false && this.$route.name === 'sports') {
          return true
        }
      },
      betSlipStatus () {
        return store.getters['sbBetslipState/betSlipStatus']
      },
      isHidden () {
        // store.getters['overlayState/getBetslipState'] === true
        if ((this.betSlipStatus.State === 2 && store.getters['overlayState/getBetslipState'] === true) ||
          store.getters['overlayState/getSingleBetslipState'].active === true ||
          store.getters['overlayState/getSportsMenuState'] === true ||
          store.getters['overlayState/getHamburgerMenuState'] === true ||
          store.getters['overlayState/getCompetitionSelectDialogState'] === true ||
          store.getters['overlayState/getBetslipMsg'].active === true ||
          store.getters['overlayState/getBetslipConfirm'].active === true ||
          store.getters['overlayState/getSpecialOfferInfoState'].active === true ||
          // (store.getters['overlayState/getBetslipMsg'].active === true && store.getters['overlayState/getBetslipState'] === true) ||
          // (store.getters['overlayState/getBetslipConfirm'].active === true && store.getters['overlayState/getBetslipState'] === true) ||
          (store.getters['overlayState/getMyAccountDialogState'] === true && store.getters['isLoggedIn'] === false) ||
          store.getters['overlayState/getLoginDialogState'] === true ||
          store.getters['overlayState/getJoinDialogState'] === true ||
          store.getters['overlayState/getLoginHeadlineDialogState'] === true ||
          store.getters['overlayState/getHeadlineOverlayDialogState'] === true ||
          (store.getters['getIs2FA'] === false && store.getters['get2FADisableTrust'] === false) ||
          store.getters['overlayState/getContestSliderMenuState'] === true ||
          store.getters['overlayState/getContestsPopupOverlayState'] === true) {
          return true
        }
      },
      isOpenedFromWebView () {
        return store.getters['getIsOpenedFromWebView']
      },
      navigationSections () {
        return store.getters['siteNavigationState/navigationSections']
      },
      defaultNavigationSection () {
        return 'BOTTOM_NAV_MOBILE_APP_SPECIAL'
      },
      stateNavigationSection () {
        return this.defaultNavigationSection + '_' + this.state
      },
      navigationSectionById () {
        return (this.navigationSections && (this.navigationSections[this.stateNavigationSection] || this.navigationSections[this.defaultNavigationSection])) || undefined
      },
      navigationType () {
        if (this.navigationSectionById && this.navigationSectionById.fwnavigationgroups[0] && this.navigationSectionById.fwnavigationgroups[0].fwnavigationitems[0]) {
          return (this.navigationSectionById.fwnavigationgroups[0].fwnavigationitems[0].display === 'ALWAYS') ||
            (this.navigationSectionById.fwnavigationgroups[0].fwnavigationitems[0].display === 'LOGGEDIN' && this.isLoggedIn) ||
            (this.navigationSectionById.fwnavigationgroups[0].fwnavigationitems[0].display === 'LOGGEDOUT' && !this.isLoggedIn)
        }
      },
      navigationName () {
        if (this.navigationSectionById && this.navigationSectionById.fwnavigationgroups[0] && this.navigationSectionById.fwnavigationgroups[0].fwnavigationitems[0]) {
          return this.navigationSectionById.fwnavigationgroups[0].fwnavigationitems[0].cssclass
        }
      },
      walletProvider () {
        return config.app.autoconf.WALLET_PROVIDER
      },
      webView () {
        var sufix = ''
        if (this.isOpenedFromWebView && this.walletProvider === 'GAN') {
          sufix = '?uiView=true'
        }
        return sufix
      },
      externalUrls () {
        return config.externalUrls
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
      isPromotionsPageActive () {
        if (store.getters['overlayState/getMyAccountDialogState'] === false && !this.dialogHamburgerMenu && store.getters['overlayState/getBetslipState'] === false && store.getters['overlayState/getSportsMenuState'] === false && (this.$route.name === 'promotions' || this.$route.path === '/info/promotions')) {
          return true
        }
      },
      pmShowBetSlip () { return store.getters['pmBetslipState/getShowBetSlip'] },
      pmSelectedRunnersCount () { return store.getters['pmBetslipState/getSelectedRunnersCount'] },
      routerNavGroups () {
        let rngs = config.app.autoconf.ROUTERNAVGROUPS
        return rngs
      },
      pmMeetingsBreeds () {
        let meetings = store.getters['racecardState/getMeetings'] || []
        let isOther = false
        let sts = new Set()
        for (let i = 0; i < meetings.length; i++) {
          if (meetings[i].breed === 'Others') {
            isOther = true
          } else {
            sts.add(meetings[i].breed)
          }
        }
        if (isOther) {
          sts.add('Others')
        }
        return sts
      },
      isContestsPageActive () {
        if (store.getters['overlayState/getMyAccountDialogState'] === false &&
            !this.dialogHamburgerMenu &&
            store.getters['overlayState/getBetslipState'] === false &&
            store.getters['overlayState/getSportsMenuState'] === false &&
            this.$route.name === 'contests') {
          return true
        }
      },
      biometricsAvailability () {
        return store.getters['getBiometricsAvailability']
      },
      biometricsSettings () {
        return store.getters['getBiometricsSettings']
      },
      MobilelocalServer () {
        return window.ctsautoconf.MOBILE_LS || false
      },
      currencySymbol () {
        return config.app.CURRENCY
      },
      isInfoActive () {
        if (this.$route.path.indexOf('/info/') > -1 && store.getters['overlayState/getMyAccountDialogState'] === false && store.getters['overlayState/getBetslipState'] === false && store.getters['overlayState/getSportsMenuState'] === false) {
          return true
        }
      },
      isMyProfileActive () {
        if (this.$route.path.indexOf('/account/') > -1 && store.getters['overlayState/getHamburgerMenuState'] === false && store.getters['overlayState/getBetslipState'] === false && store.getters['overlayState/getSportsMenuState'] === false) {
          return true
        }
      },
      isSportsActive () {
        if ((this.$route.path.indexOf('/sports/event/') > -1 || this.$route.path.indexOf('/sports/navigation/') > -1) && store.getters['overlayState/getHamburgerMenuState'] === false && store.getters['overlayState/getBetslipState'] === false && store.getters['overlayState/getMyAccountDialogState'] === false) {
          return true
        }
      },
      isInfoMenuEnabled () {
        let canhave = false
        let navitems = window.ctsautoconf.MOBILE_BOTTOMNAV_MENUITEMS
        if (navitems && Array.isArray(navitems)) {
          canhave = navitems.includes('INFO')
        }
        return canhave
      },
      xtremepushWebInitialized () {
        return store.getters['getXtremepushWebInitialized']
      },
      xtremepushOnSiteEnabled () {
        return config.app.autoconf.XTREMEPUSH_ANALYTICS && config.app.autoconf.XTREMEPUSH_ANALYTICS.CHANNEL && config.app.autoconf.XTREMEPUSH_ANALYTICS.CHANNEL.ON_SITE
      },
      xtremePushEnabledMobile () {
        return config.app.autoconf.XTREMEPUSH_ANALYTICS && config.app.autoconf.XTREMEPUSH_ANALYTICS.MOBILE_APP // for mobile apps only
      },
      xtremepushInlineContent () {
        return store.getters['getXtremepushInlineContent']
      }
    },
    methods: {
      goToHome () {
        if (this.$route.name === 'promotions') {
          this.$router.push({name: 'sports'})
        }
      },
      toggleMyAccount () {
        this.userIsActive()
        if (this.dialogMyAccount) {
          store.dispatch('overlayState/deactivateMyAccountDialog')
        } else {
          store.dispatch('overlayState/activateMyAccountDialog')
          this.sendGTMClickEvent('my account', 'open my account dialog', 'my-account btn', 'mobile bottom nav')
          store.dispatch('overlayState/deactivateBetslip')
          store.commit('sbBetslipState/setActiveBetSlip', false)
          store.commit('sbBetslipState/setActiveBetSlipHistoryTab', '')
          this.goToHome()
          if (this.pmShowBetSlip) {
            store.dispatch('pmBetslipState/toggleBetslip')
          }
        }
      },
      toggleLogin () {
        let url = ''
        switch (this.walletProvider) {
          case 'GAN':
            if (this.isOpenedFromWebView) {
              document.location.href = '/static/externallogin.html'
            } else {
              // store.dispatch('overlayState/activateLoginDialog')
              store.dispatch('overlayState/activateMyAccountDialog')
              store.dispatch('overlayState/deactivateBetslip')
              store.commit('sbBetslipState/setActiveBetSlip', false)
              store.commit('sbBetslipState/setActiveBetSlipHistoryTab', '')
            }
            break
          case 'FD':
            url = this.externalUrls.login
            window.open(url, '_self')
            break
          case 'HALLEY':
            url = this.externalUrls.login
            window.open(url, '_self')
            break
          case 'SHW':
            let faceIdState = (window.ctsautoconf.MOBILE_LS && window.ctsautoconf.APP_BIOMETRICS_AUTOMATIC_LOGIN) ? JSON.parse(localStorage.biometricsState) : false
            if ((this.biometricsAvailability && this.biometricsAvailability.biometrics === 'DATA') && faceIdState && (this.MobilelocalServer && window.ctsautoconf.APP_BIOMETRICS_AUTOMATIC_LOGIN)) {
              store.dispatch('overlayState/activateMyAccountDialog')
              mobileBridge.bridgeSendRequest('readData')
              this.sendGTMClickEvent('login', 'open login dialog', 'login-btn', 'top header')
              return false
            }
            store.dispatch('overlayState/activateMyAccountDialog')
            if (this.pmShowBetSlip) {
              store.dispatch('pmBetslipState/toggleBetslip')
            }
            this.goToHome()
            this.sendGTMClickEvent('login', 'open login dialog', 'login-btn', 'mobile bottom nav')
        }
      },
      toggleMenu () {
        this.userIsActive()
        if (this.dialogSportsMenu) {
          store.dispatch('overlayState/deactivateSportsMenu')
        } else {
          store.dispatch('overlayState/activateSportsMenu')
          this.sendGTMFooterNavigation('all sports', window.location.href)
          store.dispatch('overlayState/deactivateBetslip')
          store.commit('sbBetslipState/setActiveBetSlip', false)
          store.commit('sbBetslipState/setActiveBetSlipHistoryTab', '')
          this.goToHome()
          if (this.pmShowBetSlip) {
            store.dispatch('pmBetslipState/toggleBetslip')
          }
          if (this.xtremepushDeliveredInlineContent) {
            this.$refs.xtremepushInlineRef.logEventToXtremepushOrSendToMobileApp('delivered', this.xtremepushDeliveredInlineContent)
          }
        }
      },

      toggleBetslip () {
        this.userIsActive()
        clearTimeout(this.feedbackTo)
        this.feedback = ''
        if (this.dialogBetslip) {
          store.commit('sbBetslipState/setActiveBetSlip', false)
          store.commit('sbBetslipState/setActiveBetSlipHistoryTab', '')
          store.dispatch('overlayState/deactivateBetslip')
          if (window.xtremepush || (config.app.autoconf.XTREMEPUSH_ANALYTICS && config.app.autoconf.XTREMEPUSH_ANALYTICS.MOBILE_APP && window.ctsautoconf.MOBILE_LS)) {
            store.dispatch('sbBetslipState/sendGTMbetslipClosed')
          }
        } else {
          store.dispatch('overlayState/activateBetslip')
          this.sendGTMClickEvent('betslip', 'open betslip dialog', 'betslip-btn', 'mobile bottom nav')
          store.dispatch('overlayState/deactivateSportsMenu')
          store.dispatch('overlayState/deactivateMyAccountDialog')
          store.dispatch('overlayState/deactivateHamburgerMenu')
          this.goToHome()
        }
      },
      toggleBetslip4History () {
        clearTimeout(this.feedbackTo)
        this.feedback = ''
        if (this.$route.params && this.$route.params.hstate) {
          let hs = this.$route.params.hstate.toLowerCase()
          if (!this.isLoggedIn) hs = ''
          switch (hs) {
            case 'active':
            case 'settled':
              if (!this.dialogBetslip) {
                store.dispatch('overlayState/activateBetslip')
              }
              break
          }
        }
      },
      toggleHome (userActive = true) {
        if (userActive) {
          this.userIsActive()
        }
        this.isClickedFromBottomNavigation = true
        store.dispatch('overlayState/deactivateBetslip')
        store.commit('sbBetslipState/setActiveBetSlip', false)
        store.commit('sbBetslipState/setActiveBetSlipHistoryTab', '')
        store.dispatch('overlayState/deactivateSportsMenu')
        store.dispatch('overlayState/deactivateMyAccountDialog')
        store.dispatch('overlayState/deactivateHamburgerMenu')
        this.sendGTMClickEvent('sportsbook', 'go to homepage', 'home-btn', 'mobile bottom nav')
      },
      toggleHamburgerMenu () {
        if (this.dialogHamburgerMenu) {
          store.dispatch('overlayState/deactivateHamburgerMenu')
        } else {
          store.dispatch('overlayState/activateHamburgerMenu')
          store.dispatch('overlayState/deactivateBetslip')
          store.dispatch('overlayState/deactivateSportsMenu')
          store.dispatch('overlayState/deactivateMyAccountDialog')
          this.goToHome()
        }
      },
      specialLink () {
        this.userIsActive()
        if (this.isOpenedFromWebView) {
          window.location = this.navigationSections.BOTTOM_NAV_MOBILE_APP_SPECIAL.fwnavigationgroups[0].fwnavigationitems[0].action + '?uiView=true'
        } else {
          window.location = this.navigationSections.BOTTOM_NAV_MOBILE_APP_SPECIAL.fwnavigationgroups[0].fwnavigationitems[0].action
        }
      },
      go2Promotions () {
        if (this.$route.path.indexOf('/info/promotions') === -1) {
          this.$router.push({path: '/info/promotions'})
        }
        store.dispatch('overlayState/deactivateBetslip')
        store.dispatch('overlayState/deactivateSportsMenu')
        store.dispatch('overlayState/deactivateMyAccountDialog')
        store.dispatch('overlayState/deactivateHamburgerMenu')
      },
      go2Contests () {
        if (this.$route.name !== 'contests') {
          this.$router.push({name: 'contests'})
        }
        store.dispatch('overlayState/deactivateBetslip')
        store.dispatch('overlayState/deactivateSportsMenu')
        store.dispatch('overlayState/deactivateMyAccountDialog')
        store.dispatch('overlayState/deactivateHamburgerMenu')
      },
      showFeedBack (added) {
//        console.log('showFeedBack')
        if (this.mobileFeedback.enabled) {
          this.feedback = added ? this.$t('BetSlip.mobile.feedback.added') : ''
          this.showParlayMsg()
        } else {
          this.feedback = ''
        }
      },
      showParlayMsg (d) {
//        console.log('showParlayMsg')
        var self = this
        if (!self.mobileFeedback.enabled) {
          return
        }
        d = d || self.mobileFeedback.timeOut
        clearTimeout(self.feedbackTo)
        self.feedbackTo = setTimeout(function () {
          if (!self.gettingABTnR) {
            var potentialReturn = self.allowedReturnsSGP || (self.allowedReturnsPRL && self.allowedReturnsPRL.PotentialReturn)
            if (potentialReturn) {
              var stake = self.mobileFeedback.stake
              var win = (stake * potentialReturn - stake)
              var phraseKey = 'BetSlip.mobile.feedback.playParlay'
              if (self.allowedReturnsSGP) {
                phraseKey = 'BetSlip.mobile.feedback.playParlay.SGP'
              }
              //
              self.feedback = self.$t(phraseKey, {
                stake: stake.toFixed(2),
                n: self.selectionsNo,
                win: win.toFixed(2),
                currency: self.currencySymbol
              })
              if (self.mobileFeedback.autoHidePrlMsgAfter) {
                self.clearFeedback(self.mobileFeedback.autoHidePrlMsgAfter)
              }
            } else {
              self.clearFeedback(0)
            }
          } else {
            self.showParlayMsg(1)
          }
        }, d * 1000)
      },
      clearFeedback (d) {
        d = d || 0
//        console.log('clearFeedback in ' + d)
        var self = this
        clearTimeout(self.feedbackTo)
        self.feedbackTo = setTimeout(function () {
          self.feedback = ''
        }, d * 1000)
      },
      go2PmBetting () {
        if (this.$route.name !== 'pm') {
          this.$router.push({ name: 'pmbetting' })
        }
        store.dispatch('overlayState/deactivateBetslip')
        store.dispatch('overlayState/deactivateSportsMenu')
        store.dispatch('overlayState/deactivateMyAccountDialog')
        store.dispatch('overlayState/deactivateHamburgerMenu')
      },
      togglePmBetslip () {
        this.userIsActive()
        store.dispatch('pmBetslipState/toggleBetslip')
        store.dispatch('overlayState/deactivateMyAccountDialog')
      },
      togglePmBetslipOff () {
        this.userIsActive()
        store.dispatch('pmBetslipState/toggleBetslip', { showbetslip: false })
        store.dispatch('overlayState/deactivateMyAccountDialog')
      },
      pmNavToBreed (breed) {
        if (this.$route.name !== 'pm-for-period-breed' || (this.$route.params.breed && this.$route.params.breed !== breed)) {
          let navParams = { period: 'all', breed: breed }
          this.$router.push({ name: 'pm-for-period-breed', params: navParams })
        }
        store.dispatch('overlayState/deactivateBetslip')
        store.dispatch('overlayState/deactivateSportsMenu')
        store.dispatch('overlayState/deactivateMyAccountDialog')
        store.dispatch('overlayState/deactivateHamburgerMenu')
      },
      updateNavGroupKey () {
        let key = this.$router.currentRoute && this.$router.currentRoute.meta && this.$router.currentRoute.meta.navgroupkey ? this.$router.currentRoute.meta.navgroupkey : ''
        this.navgroupcontext4menu = key
      },
      /**
       * Check if navigation (button) element can be displayed in mobile bottom navigation
       * @param navitemkey
       */
      canHaveNavElm (navitemkey) {
        let canhave = true
        let navitems = window.ctsautoconf.MOBILE_BOTTOMNAV_MENUITEMS
        if (navitems && Array.isArray(navitems)) {
          canhave = navitems.includes(navitemkey)
        }
        return canhave
      },
      xtremepushInlineContentToAllSportsNavigationDrawer (data) {
        this.xtremepushDeliveredInlineContent = data
      }
    },

    watch: {
      selectionsNo (newVal, oldVal) {
//        console.log('watch selectionsNo')
        clearTimeout(this.feedbackTo)
        this.feedback = ''
        if (!this.dialogBetslip && newVal === 1 && oldVal === 0 && !this.isFastBetEnabled && this.popBetSlipOn1stSelection) {
          setTimeout(function () {
            store.dispatch('overlayState/activateBetslip')
          }, 0)
        } else if (newVal > 1) {
          this.showFeedBack(newVal > oldVal)
        }
      },
      isLoggedIn (newVal, oldVal) {
        if (newVal === true) {
          this.toggleBetslip4History()
        }
        if (newVal === false) {
          this.toggleHome(false)
        }
      },
      $route: function () {
        this.updateNavGroupKey()
      }
    },

    created () {
      setInterval(() => {
        let value = Math.round(Math.abs(localStorage.loginTime - Date.now()) / 1000)
        if (value >= 0) {
          let minutes = Math.floor(value / 60)
          let seconds = value - minutes * 60
          seconds = (seconds < 10 ? ('0' + seconds) : seconds)
          minutes = (minutes < 10 ? ('0' + minutes) : minutes)
          this.sessionTime = `${minutes}:${seconds}`
        }
      }, 1000)

      this.toggleBetslip4History()
      this.updateNavGroupKey()
    }
  }
</script>

<style lang="stylus" scoped>
  @import "~@/css/config"
  @import "fonts";

  .bottom-navigation
    &.hidden
      .v-navigation-drawer
        max-height: 100% !important
      .v-bottom-nav
        display: none

  .header
    padding-top 0
    .title
      padding-top 21px
  .session-info
    font-size 10px
  .bottom-navigation
    .v-bottom-nav
      z-index: 9999 !important
      background: #fff
      border-top: solid 1px #CFD6DB

      .v-btn
        filter: none
        padding: 0
        min-width: 50px
        opacity: 1
        position: relative
        display: block

        >>> .v-btn__content
          padding: 0
          flex-direction column !important
          font-weight normal

          &:before
            display: none

          i.icon
            margin: 0

        .badge
          background-color: #ff671f
          color: #fff
          position: absolute
          font-size: 12px
          font-weight: normal
          top: -2px
          margin-left: 12px

        .betslip_mobile_msg
          position: absolute
          bottom: 65px
          width: 320px
          height: 28px
          p
            display: inline-block
            background: #2396FC
            color: #ffffff
            padding: 5px 10px
            max-width: 320px
            overflow hidden
            white-space: normal
            border-radius: 5px
            height: 28px
            &:after
              material-icons()
              display: block
              content: 'arrow_drop_down'
              margin: auto
              line-height: 0px
              font-size: 30px
              color: #2396FC
              position: absolute
              bottom: 0
              left: 50%
              margin-left: -15px
              z-index: 1000
        .btn-icon-container
          /*background-color: darkgoldenrod*/
          display: flex;
          align-items: center;
          justify-content: center;
          height: 28px
          margin-bottom: 4px
          i.v-icon
            margin-bottom: 0

      >>> .igt-icon:not(.background)
          height: 33px
          display: flex
          align-items: center

      >>> .igt-icon
        &.background
          width: 33px
          height: 33px

        > span
          width: 17px
          height: 17px

    .betslip-button
      >>> .igt-icon
        &.background
          background-color: #F0F3F8

      &.active
        >>> .igt-icon
          &.background
            background-color: #2396FC

      &.hasSelections
        >>> .igt-icon
          &.background
            background-color: #1493ff

.bottom_nav_text
  font-size: 10px;
  line-height: 90%;
  white-space: normal;
  max-width: 96%;
  overflow: visible;
  max-height: 11px;
  color: #99a8b1
  padding-top: 1px
  &.blue
    color #1493ff !important
    background none !important

  /* iphone XS */
.os-ios
  @media only screen and (min-device-width: 375px) and (min-device-height: 812px) and (-webkit-min-device-pixel-ratio: 3)
    .bottom-nav
      height 94px !important
      padding-bottom 34px
      padding-top 5px
  /* iphone XS Max */
.os-ios
  @media only screen and (min-device-width: 414px) and (min-device-height: 896px) and (-webkit-min-device-pixel-ratio: 3)
    .bottom-nav
      height 94px !important
      padding-bottom 34px
      padding-top 5px
  /* iphone XR */
.os-ios
  @media only screen and (min-device-width: 414px) and (min-device-height: 896px) and (-webkit-min-device-pixel-ratio: 2)
    .bottom-nav
      height 94px !important
      padding-bottom 34px
      padding-top 5px
.close
  flex-grow: 0
  @media mobile-big-and-below
    display: block

  .v-btn
    min-width: 0
    position: absolute
    top: -17px
    right: -8px
    width: 24px
    height: 24px
    .icon
      font-weight: normal
      font-size: 26px !important
    >>>.v-btn__content
      padding: 0
.v-icon
  color #073f79 !important
.dialog-menu.v-navigation-drawer
  z-index 20

</style>
