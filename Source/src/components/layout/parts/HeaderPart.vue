<template>
  <header class="header" :class="[{'msg-fixed': betSlipState && headerMessageState && mobileBigAndBelow && !isOpenedFromWebView, 'postLoginAlertExist': postLoginAlertExist && !mobileBigAndBelow},{'withPageTitle' : showPageTitleInHeader && !isRootSportsNavigation && mobileBigAndBelow}, , brandKey]"  ref="headerpart">
    <resize-observer @notify="headerResize" />
    <headlinesLight v-if="!mobileBigAndBelow" category="PostLoginAlert"></headlinesLight>
    <header-messages v-if="headerMessageState && mobileBigAndBelow && !isOpenedFromWebView && (!isReadOnly || (isReadOnly && appInstallPopup))"></header-messages>
    <v-layout align-center class="top-container" :class="[{'geo_search': mobileGeolocationInProgress.display, 'postLoginAlertExist': postLoginAlertExist && !mobileBigAndBelow}]">
      <!---- Generic template ----->
      <div v-if="!mobileBigAndBelow && brandLayout === 'generic'" class="rg">
        <div class="rg-holder">
          <span class="header-txt">{{ $t('Header.InfoMessageOne') }}</span>
          <a :href="rgLink"> <!--Url depend on STATE-->
            <img class="rg-logo" :src="mediaServer('/static/brand-img/' + brandKey + '/rg-logo.svg')" alt="rg"/>
            <span class="header-txt">{{ $t('Header.InfoMessageTwo') }}</span>
          </a>
        </div>
      </div>
      <!---- Generic template end ----->
      <div v-if="!mobileBigAndBelow && (brandKey === 'circa')" class="rg" :class="[{'postLoginAlertExist': postLoginAlertExist && !mobileBigAndBelow}]">
        <span class="header-txt">{{ $t('Header.InfoMessageOne') }}</span>
        <a href="https://www.ncpgambling.org/">
          <img class="rg-logo" :src="mediaServer('/static/brand-img/' + brandKey + '/rg-logo.svg')" alt="rg" />
          <span class="header-txt">{{ $t('Header.InfoMessageTwo') }}</span>
        </a>
      </div>
      <div v-if="!mobileBigAndBelow && (brandKey === 'sb' || brandKey === 'mav' || brandKey === 'qcasino' || brandKey === 'pr')" class="rg" :class="[{'postLoginAlertExist': postLoginAlertExist && !mobileBigAndBelow}, state]">
        <div class="rg-holder">
          <span v-if="brandKey === 'sb' && state ==='MD'" v-html="$t('Header.InfoMessageOne.MD')" class="header-txt"></span>
          <span v-else class="header-txt">{{ $t('Header.InfoMessageOne.' + state) }}</span>
          <a v-if="brandKey === 'sb' && state ==='NJ'" @click.stop="go2ResponsibleGaming">
            <img class="rg-logo nj" :src="mediaServer('/static/brand-img/' + brandKey + '/rg-logo-nj.svg')" alt="rg" />
            <span class="header-txt">{{ $t('Header.InfoMessageTwo') }}</span>
          </a>
          <a v-if="brandKey === 'sb' && state ==='CO'" href="https://www.problemgamblingcoalitioncolorado.org/">
            <img class="rg-logo" :src="mediaServer('/static/brand-img/' + brandKey + '/rg-logo.svg')" alt="rg" />
            <span class="header-txt">{{ $t('Header.InfoMessageTwo') }}</span>
          </a>
          <a v-if="brandKey === 'mav'" href="http://problemgamblingcolorado.org/">
            <img class="rg-logo" :src="mediaServer('/static/brand-img/' + brandKey + '/rg-logo-white.svg')" alt="rg" />
            <span class="header-txt">{{ $t('Header.InfoMessageTwo') }}</span>
          </a>
          <a v-if="(brandKey === 'sb' && state ==='AZ')" href="https://problemgambling.az.gov/">
            <img class="rg-logo" :src="mediaServer('/static/brand-img/' + brandKey + '/rg-logo.svg')" alt="rg" />
            <span class="header-txt">{{ $t('Header.InfoMessageTwo') }}</span>
          </a>
          <a v-if="(brandKey === 'sb' && state ==='IA')" href="https://idph.iowa.gov/igtp">
            <img class="rg-logo" :src="mediaServer('/static/brand-img/' + brandKey + '/rg-logo.svg')" alt="rg" />
            <span class="header-txt">{{ $t('Header.InfoMessageTwo') }}</span>
          </a>
          <a v-if="(brandKey === 'sb' && state ==='TN')" href="https://www.tn.gov/behavioral-health/substance-abuse-services/treatment---recovery/treatment---recovery/problem-gambling-programs.html">
            <img class="rg-logo" :src="mediaServer('/static/brand-img/' + brandKey + '/rg-logo.svg')" alt="rg" />
            <span class="header-txt">{{ $t('Header.InfoMessageTwo') }}</span>
          </a>
          <a v-if="(brandKey === 'sb' && state ==='OH')" href="https://ohio.gov/responsible-gambling">
            <img class="rg-logo" :src="mediaServer('/static/brand-img/' + brandKey + '/rg-logo.svg')" alt="rg" />
            <span class="header-txt">{{ $t('Header.InfoMessageTwo') }}</span>
          </a>
          <a v-if="(brandKey === 'sb' && state ==='IN')" href="http://indianaproblemgambling.org">
            <img class="rg-logo" :src="mediaServer('/static/brand-img/' + brandKey + '/rg-logo.svg')" alt="rg" />
            <span class="header-txt">{{ $t('Header.InfoMessageTwo') }}</span>
          </a>
          <a v-if="(brandKey === 'sb' && state ==='MD')" href="https://helpmygamblingproblem.org">
            <img class="rg-logo" :src="mediaServer('/static/brand-img/' + brandKey + '/rg-logo.svg')" alt="rg" />
            <span class="header-txt">{{ $t('Header.InfoMessageTwo') }}</span>
          </a>
          <a v-if="(brandKey === 'sb' && state ==='VA')" href="https://vcpg.net">
            <img class="rg-logo" :src="mediaServer('/static/brand-img/' + brandKey + '/rg-logo.svg')" alt="rg" />
            <span class="header-txt">{{ $t('Header.InfoMessageTwo') }}</span>
          </a>
          <a v-if="brandKey === 'qcasino' || brandKey === 'pr'" href="https://yourlifeiowa.org/gambling">
            <img class="rg-logo" :src="mediaServer('/static/brand-img/' + brandKey + '/rg-logo.svg')" alt="rg" />
            <span class="header-txt">{{ $t('Header.InfoMessageTwo') }}</span>
          </a>
        </div>
        <header-info v-if="brandKey === 'sb' && state =='NJ'"></header-info>
      </div>
      <div v-if="!mobileBigAndBelow && brandKey === 'rw'" class="rg" :class="{'postLoginAlertExist': postLoginAlertExist && !mobileBigAndBelow}">
        <span class="header-txt">{{ $t('Header.InfoMessageOne') }}</span>
        <a href="https://www.nevadacouncil.org/responsible-gaming/">
          <img class="rg-logo" :src="mediaServer('/static/brand-img/' + brandKey + '/rg-logo.svg')" alt="rg" />
          <span class="header-txt">{{ $t('Header.InfoMessageTwo') }}</span>
        </a>
      </div>
      <div class="logo-holder" v-if="isNotOpenedFromIFrame">
        <v-flex v-if="brandKey !== 'boyd' && mobileBigAndBelow && (this.$route.name === 'sports' || brandKey === 'sb' || brandKey === 'mav')" class="logo" @click="clickOnLogoHandler()">
          <router-link to="/">
            <img v-if="(brandKey !== 'dn' && brandKey !== 'dnw')" :src="mediaServer('/static/brand-img/' + brandKey + '/logo-white.png')" :alt="brandKey">
            <img v-if="(brandKey === 'dn' || brandKey === 'dnw')" :src="mediaServer('/static/brand-img/' + brandKey + '/logo-extend-white.png')" :alt="brandKey">
          </router-link>
        </v-flex>
        <v-flex v-if="brandKey !== 'boyd' && !mobileBigAndBelow" class="logo" @click="clickOnLogoHandler()">
          <router-link to="/">
            <img v-if="!mobileBigAndBelow && (brandKey !== 'dn' || brandKey !== 'dnw')" :src="mediaServer('/static/brand-img/' + brandKey + '/logo-white.png')" :alt="brandKey">
          </router-link>
        </v-flex>
        <v-flex v-if="brandKey === 'boyd' && (!mobileBigAndBelow || !(this.$route.name !== 'sports' && currentNavGroupKey !== 'pm'))" class="logo" @click="clickOnLogoHandler()">
          <router-link to="/">
            <img :src="mediaServer('/static/brand-img/' + brandKey + '/logo-white.png')" :alt="brandKey">
          </router-link>
        </v-flex>
      </div>
      <template v-if="mobileBigAndBelow && this.$route.name !== 'sports' && currentNavGroupKey !== 'pm'">
      <div class="back-btn-wrapper">
        <span class="header-back-btn">
          <div class="buttons" v-cloak>
            <span @click="goBack()" class="btn btn--icon theme--dark">
              <i v-if="brandKey === 'sb'" aria-hidden="true" class="icon material-icons">navigate_before</i>
              <i v-else aria-hidden="true" class="icon material-icons">arrow_back</i>
            </span>
          </div>
        </span>
      </div>
      <sports-breadcrumb :inHeader="true" v-if="showPageTitleInHeader && brandLayout === 'generic'"></sports-breadcrumb>
      </template>
      <v-flex :style="(brandKey === 'boyd' || brandKey === 'rw' || (brandKey === 'dn' || brandKey === 'dnw')) && centerColumnWidth ? {'max-width': centerColumnWidth + 'px'} : {}" v-if="!mobileBigAndBelow && brandKey !== 'circa'" sm12 align-content-end class="menu">
        <main-navigation></main-navigation>
      </v-flex>
      <v-flex v-if="!isReadOnly" class="account-widget">
        <account-info-widget-component></account-info-widget-component>
      </v-flex>
      <v-flex v-if="brandKey === 'boyd'" class="account-widget">
        <span class="header-part__message-center" v-if="mobileBigAndBelow && isLoggedIn"><message-center v-if="noOfMsgs > 0"></message-center></span>
        <v-icon v-if="mobileBigAndBelow" @click="toggleHamburgerMenu()">menu</v-icon>
      </v-flex>
    </v-layout>
    <mobile-geolocation-dialog v-if="(isOpenedFromWebView && mobileGeolocationInProgress.display) && isLoggedIn"></mobile-geolocation-dialog>
    <headlinesLight v-if="mobileBigAndBelow" category="PostLoginAlert"></headlinesLight>
    <v-dialog content-class="headline-dialog" v-model="headlineDialog" :fullscreen="false">
      <headline-overlay></headline-overlay>
    </v-dialog>
    <v-dialog content-class="add-selection-dialog" v-model="addingSelectionDialog" transition="dialog-bottom-transition" persistent :fullscreen="false">
      <adding-selections-dialog></adding-selections-dialog>
    </v-dialog>
  </header>
</template>

<script>
  import Screen from '@/components/mixins/Screen'
  import Branding from '@/components/mixins/Branding'
  import store from '@/store'
  import Session from '@/components/mixins/Session'
  import MainNavigation from '@/components/common/MainNavigation'
  import SiteNavigation from '@/components/common/SiteNavigation'
  import AccountInfoWidgetComponent from '@/components/account/AccountInfoWidgetComponent'
  import HeaderMessages from '@/components/layout/parts/HeaderMessages'
  import mobileGeolocationDialog from '@/components/layout/parts/mobileGeolocationDialog'
  import HeaderInfo from '@/components/common/HeaderInfo'
  import headlineOverlay from '@/components/sports/bettingoffer/headlineOverlay'
  import addingSelectionsDialog from '@/components/common/addingSelectionsDialog'
  import HeadlinesLight from '@/components/sports/bettingoffer/headlinesLight'
  import Url from '@/components/mixins/Url'
  import lib from '@/library'
  import config from '@/config'
  import router from '@/router'
  import MessageCenter from '@/components/layout/parts/MessageCenter'
  import SportsBreadcrumb from '@/components/sports/bettingoffer/SportsBreadcrumb'

  export default {
    name: 'HeaderPart',

    mixins: [
      Screen,
      Branding,
      Session,
      Url
    ],

    components: {
      MainNavigation,
      AccountInfoWidgetComponent,
      HeaderMessages,
      SiteNavigation,
      mobileGeolocationDialog,
      HeaderInfo,
      headlineOverlay,
      addingSelectionsDialog,
      HeadlinesLight,
      MessageCenter,
      SportsBreadcrumb
    },

    data () {
      return {
        currentNavGroupKey: ''
      }
    },

    computed: {
      state () {
        console.log(config.app.autoconf.STATE)
        return config.app.autoconf.STATE
      },
      rgLink () {
        if (this.state === 'AZ') {
          return 'https://problemgambling.az.gov/'
        } else if (this.state === 'WA') {
          return 'https://www.evergreencpg.org/'
        } else if (this.state === 'WI') {
          return 'https://www.ncpgambling.org/state/wisconsin/'
        } else if (this.state === 'CO') {
          return 'http://problemgamblingcolorado.org/'
        } else if (this.state === 'NV') {
          return 'https://www.nevadacouncil.org/responsible-gaming/'
        } else if (this.state === 'TN') {
          return 'https://www.tn.gov/behavioral-health/substance-abuse-services/treatment---recovery/treatment---recovery/problem-gambling-programs.html'
        } else if (this.state === 'PR') {
          return 'https://www.ncpgambling.org/'
        } else if (this.state === 'NJ') {
          return 'https://www.ncpgambling.org/state/new-jersey/'
        } else if (this.state === 'MS') {
          return 'http://www.msgambler.org/'
        } else if (this.state === 'LA') {
          return 'https://www.ncpgambling.org/'
        } else if (this.state === 'IL') {
          return 'https://www.ncpgambling.org/state/illinois/'
        } else if (this.state === 'RI') {
          return 'https://www.ncpgambling.org/state/rhode-island/'
        } else {
          return 'https://www.ncpgambling.org/'
        }
      },
      isOpenedFromWebView () {
        return store.getters['getIsOpenedFromWebView']
      },
      headerMessageState () {
        return store.getters['overlayState/getHeaderMessageState']
      },
      isLoggedIn () {
        return store.getters['isLoggedIn']
      },
      betSlipState () {
        return store.getters['overlayState/getBetslipState']
      },
      mobileGeolocationInProgress () {
        var data = store.getters['getMobileGeolocationInProgress']
        return data
      },
      centerColumnWidth () {
        return store.getters['screenState/getCenterColumnWidth']
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
      MobilelocalServer () {
        return window.ctsautoconf.MOBILE_LS || false
      },
      userAgent () {
        return lib.core.userAgent.os.name
      },
      searchPhrase () {
        return store.getters['searchState/getPhrase']
      },
      isNotOpenedFromIFrame: () => !(window.top !== window.self),
      isReadOnly () {
        return config.app.autoconf.ROBO
      },
      appInstallPopup () {
        return window.ctsautoconf.SHOW_APP_DOWNLOAD_POPUP_FOR_ROBO || false
      },
      headlineDialog: {
        get: () => {
          return store.getters['overlayState/getHeadlineOverlayDialogState']
        },
        set: (value) => {
          if (value) {
            store.commit('overlayState/setHeadlineOverlayDialogState', true)
          } else {
            store.commit('overlayState/setHeadlineOverlayDialogState', false)
          }
        }
      },
      addingSelectionDialog: {
        get: () => {
          return store.getters['overlayState/getAddingSelectionDialogState']
        },
        set: (value) => {
          if (value) {
            store.commit('overlayState/setAddingSelectionDialogState', true)
          } else {
            store.commit('overlayState/setAddingSelectionDialogState', false)
          }
        }
      },
      postLoginAlertExist () {
        return store.getters['getPostLoginAlertExist']
      },
      noOfMsgs: () => store.getters['messageCenter/getNumberOfMessages'],
      showPageTitleInHeader () {
        return window.ctsautoconf.PAGE_TITLE_IN_HEADER_ON_MOBILE || false
      },
      isRootSportsNavigation () {
        return this.$route.name === 'sports'
      }
    },

    methods: {
      headerResize () {
        store.commit('screenState/setHeaderHeight', this.headerHeight())
      },
      goBack () {
        if ((this.$route.name === 'searchsport' || this.$route.name === 'searchcompetition') && this.searchPhrase) {
          this.$router.back()
        } else if (this.$route.name === 'event') {
          this.$router.go(-1)
        } else {
          this.$router.push({name: 'home'})
        }
      },
      headerHeight () {
        if (this.$refs.headerpart) {
          return this.$refs.headerpart.offsetHeight + parseInt(window.getComputedStyle(this.$refs.headerpart).marginTop) + parseInt(window.getComputedStyle(this.$refs.headerpart).marginBottom)
        }
      },
      toTop () {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      },
      clickOnLogoHandler () {
        this.toTop()
        this.userIsActive()
      },
      toggleHamburgerMenu () {
        if (this.dialogHamburgerMenu) {
          store.dispatch('overlayState/deactivateHamburgerMenu')
        } else {
          store.dispatch('overlayState/activateHamburgerMenu')
        }
      },
      updateNavGroupKey () {
        let key = this.$router.currentRoute && this.$router.currentRoute.meta && this.$router.currentRoute.meta.navgroupkey ? this.$router.currentRoute.meta.navgroupkey : ''
        this.currentNavGroupKey = key
      },
      go2ResponsibleGaming () {
        if (router.currentRoute.path !== '/info/responsible-gaming') {
          router.push({ path: '/info/responsible-gaming' })
        } else return false
      }
    },

    watch: {
      $route: function () {
        this.updateNavGroupKey()
      }
    },

    created () {
      this.updateNavGroupKey()
    },
    mounted () {
      this.headerResize()
    },
    updated () {
      store.commit('screenState/setHeaderHeight', this.$refs.headerpart.offsetHeight)
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped>
  @import '~@/css/config'

  .header
    background-color: transparent
    width 100%
    &.withPageTitle
      .logo-holder
        display none
    &.player_msg_active
      padding-top: 45px
      min-height 185px
      &.sb
        min-height 155px
        .rg
          top:45px
    &.player_msg_active
      padding-top: 45px
      min-height 185px
      &.mav
        min-height 155px
        @media mobile-big-and-below
          padding-top: 40px
        .rg
          top:45px
    &.player_msg_active
      padding-top: 45px
      min-height 185px
      &.qcasino
        min-height 155px
        padding-top 40px
        @media mobile-big-and-below
          padding-top: 40px
        .rg
          top:45px
      &.dn
        min-height 185px
        padding-top: 25px
        @media mobile-big-and-below
          padding-top: 40px

      &.dnw
        min-height 185px
        padding-top: 25px
        @media mobile-big-and-below
          padding-top: 40px
      &.igt
        min-height 185px
        padding-top: 25px
        @media mobile-big-and-below
          padding-top: 40px
      &.circa
        min-height 195px
        padding-top: 25px
        .rg
          top:45px
      &.boyd
        min-height 165px
        padding-top: 25px
        @media mobile-big-and-below
          padding-top: 41px
      @media mobile-big-and-below
        // padding-top: 60px !important
        min-height 50px !important
        .wrapper
          margin 0
    &.player_msg_active_2
      padding-top: 65px
      min-height 185px
      &.sb
        min-height 155px
        .rg
          top:86px
      &.mav
        min-height 155px
        .rg
          top:86px
      &.qcasino
        min-height 155px
        padding-top 60px
        .rg
          top:86px
      &.dn
        min-height 225px
      &.dnw
        min-height 225px
      &.igt
        min-height 225px
      &.circa
        min-height 236px
        .rg
          top:86px
      &.boyd
        min-height 206px
      @media mobile-big-and-below
        // padding-top: 60px !important
        min-height 50px !important
    >>>.h-message
      top 0px !important
      // @media mobile-big-and-below
      //   min-height 89px
      //   padding-top: 0px
      //   margin-bottom: 70px
      //   &.geo_search
      //     min-height 129px
      //   padding-top: 0px
      //   margin-bottom: 70px
  .back-btn-wrapper
    // padding-left: 15px
    margin-top 5px
    .logo
      padding: 0px
    .buttons
      margin-top: 0px
    .back-btn-text
      font-size 16px
      // font-family 'Open Sans Bold'
      line-height: 16px
      min-width: 40px
      text-align: right
      @media mobile-big-and-below
        position relative
        top -6px
  .top-container
    min-height 82px
    &.player_msg_active
      @media mobile-big-and-below
        top 89px !important
      &.geo_search
        @media mobile-big-and-below
          top 129px !important
    &.player_msg_active_2
      @media mobile-big-and-below
        top 89px !important
      &.geo_search
        @media mobile-big-and-below
          top 129px !important
    .v-icon
      color #fff
      font-size: 25px
      padding-left: 5px
    @media mobile-big-and-below
      min-height 55px
      background #0b4da1

  .account-widget
    margin-right 0px
    @media mobile-big-and-below
      margin-right: 0px
    .header-part__message-center
      display inline-block
      position relative
      bottom 10px
  .msg-fixed
    z-index 203
.rg-holder
  display flex 
  align-items center
  a  
    display flex 
    align-items center
    color #e5e5e5
>>>.bo_nav_headline
  margin-left -40px
  h1
    @media mobile-big-and-below
      font-size: 16px !important
      font-family: 'Open Sans Bold'
      font-weight: normal !important
      line-height: 16px !important
      margin: 0

  h3
    display none
</style>
