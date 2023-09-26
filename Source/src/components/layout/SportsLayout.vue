<template>
  <div class="sports-page">
    <v-layout  class="page-layout">
      <v-flex class="main-column" :style="{paddingTop: headerHeight + 'px'}" ref="maincolumn">
        <resize-observer @notify="mainColumnResize" />
        <resize-observer @notify="centerColumnResize" />
        <sports-menu-mobile v-if="mobileBigAndBelow && (brandLayout === 'generic' || brandKey === 'sb' || brandKey === 'qcasino' || brandKey === 'pr' || brandKey === 'rw')" :navigation-section="'BO_POPULAR'" class="popular"></sports-menu-mobile>
        <v-layout class="page-layout">
          <v-flex class="left-column">
            <div v-if="(brandKey === 'dn' || brandKey === 'dnw')" class="logo">
              <img :src="mediaServer('/static/brand-img/' + brandKey + '/secondary-logo-white.png')" :alt="brandKey">
            </div>
            <sports-menu v-if="tabletAndAbove"></sports-menu>
          </v-flex>
          <v-flex class="center-column" ref="centercolumn">
            <router-view></router-view>
            <internal-error></internal-error>
          </v-flex>
          <v-flex class="betslip-column" v-if="tabletAndAbove && !isReadOnly">
            <div class="toggleBetslipColumn" :class="[{'loggedIn' : isLoggedIn, 'postLoginAlertExist': postLoginAlertExist && !mobileBigAndBelow},{'betslip_layout2' : betslipLayout2}, brandKey]">
              <div class="betslipTabs" :class="[{'noHistory': !showHistoryTabs},{'loggedIn': isLoggedIn}, {'withBackToBetslip': brandLayout === 'generic' && betslipLayout2 && betTypeTab!=='REGULAR'}]">
                <span @click="setTab('BetSlip')" class="tab" :class="{ 'active': activeBetSlipHistoryTab!=='active' && activeBetSlipHistoryTab!=='settled', disabled: true }">
                  <a v-if="!betslipLayout2" class="betsliptablink a-link-">
                    <span>{{ $t('BetSlipPage.tab.BetSlip') }}</span>
                    <badge v-if="brandKey !== 'qcasino' && brandKey !== 'pr' && brandKey !== 'rw' && betsNo > 0">{{betsNo}}</badge>
                    <badge v-if="brandKey === 'qcasino' || brandKey === 'pr' && betsNo > 0">{{'(' + betsNo + ')'}}</badge>
                    <span v-if="brandKey === 'rw'">{{'(' + betsNo + ')'}}</span>
                  </a>
                  <a v-if="betslipLayout2 && brandLayout === 'generic'" class="betsliptablink a-link-">
                    <badge>{{ betsNo }}</badge>
                    <span>{{ $t('BetSlipPage.tab.BetSlip') }}</span>
                  </a>
                </span>
                <span class="back_to_betslip back-to-betslip" v-if="brandLayout === 'generic' && betslipLayout2 && betTypeTab!=='REGULAR'"><a @click="setBetTypeTab('REGULAR')" >{{ $t('BetSlip.tab.label.back') }}</a></span>
                <template v-if="showHistoryTabs === true && brandKey==='boyd'">
                  <span class="historyTabs">
                    <span v-if="isLoggedIn" class="tab history-tab" :class="{ 'active': activeBetSlipHistoryTab==='active' }">
                      <a @click="setTab('HistoryActive')" class="a-link-"><span>{{ $t('BetSlipPage.tab.History.active') }}</span></a>
                    </span>
                    <span v-if="isLoggedIn" class="tab history-tab" :class="{ 'active': activeBetSlipHistoryTab==='settled' }">
                      <a @click="setTab('HistorySettled')" class="a-link-"><span>{{ $t('BetSlipPage.tab.History.settled') }}</span></a>
                    </span>
                  </span>
                </template>
                <template v-if="showHistoryTabs === true && brandKey!=='boyd' && (!betslipLayout2 || (betslipLayout2 && betTypeTab==='REGULAR'))">
                  <span @click="setTab('HistoryActive')" v-if="isLoggedIn" class="tab history-tab" :class="{ 'active': activeBetSlipHistoryTab==='active' }">
                    <a class="a-link-"><span>{{ $t('BetSlipPage.tab.History.active') }}</span></a>
                  </span>
                  <span @click="setTab('HistorySettled')" v-if="isLoggedIn" class="tab history-tab" :class="{ 'active': activeBetSlipHistoryTab==='settled' }">
                    <a class="a-link-"><span>{{ $t('BetSlipPage.tab.History.settled') }}</span></a>
                  </span>
                </template>
              </div>
            <!-- <v-btn :ripple="false" @click="toggleBetslipColumn">
              <span :class="betslipVisible ? 'pd-icon pd-icon-chevron-down' : 'pd-icon pd-icon-chevron-top'"></span>
            </v-btn> -->
          </div>
            <!-- <vue-slide-up-down :active="betslipVisible" :duration="500" ref="upDownBetslip"> -->
              <betslip></betslip>
            <!-- </vue-slide-up-down> -->
            <div v-if="!stickyBetslip && (brandLayout === 'generic' || brandKey === 'boyd' || brandKey === 'qcasino' || brandKey === 'pr' || brandKey === 'rw')" class="banners">
              <headlinesLight category="SidebarBanners" ></headlinesLight>
            </div>
          </v-flex>
          <v-flex class="betslip-column sidebarColumn" v-if="tabletAndAbove && isReadOnly">
            <div class="banners">
              <headlinesLight category="SidebarBanners" ></headlinesLight>
            </div>
          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
  import Screen from '@/components/mixins/Screen'
  import Branding from '@/components/mixins/Branding'
  import store from '@/store'
  import config from '@/config'
  import VueSlideUpDown from 'vue-slide-up-down'
  import SportsMenu from '@/components/sports/bettingoffer/SportsMenu'
  import HeadlinesLight from '@/components/sports/bettingoffer/headlinesLight'
  import SportsMenuMobile from '@/components/sports/bettingoffer/SportsMenuMobile'
  import Betslip from '@/components/sports/betslipV2/BetslipPage'
  import HeaderPart from '@/components/layout/parts/HeaderPart'
  import Badge from '@/components/common/Badge'
  import Url from '@/components/mixins/Url'
  import internalError from '@/components/common/errors/internalError'

  export default {
    name: 'SportsLayout',

    mixins: [
      Screen,
      Url,
      Branding
    ],

    components: {
      SportsMenu,
      HeadlinesLight,
      SportsMenuMobile,
      Betslip,
      VueSlideUpDown,
      HeaderPart,
      Badge,
      internalError
    },

    props: {

    },

    data: () => ({
      betslipVisible: true
    }),

    computed: {
      isOpenedFromWebView () {
        return store.getters['getIsOpenedFromWebView']
      },
      headerMessageState () {
        return store.getters['overlayState/getHeaderMessageState']
      },
      headerHeight () {
        return store.getters['screenState/getHeaderHeight']
      },
      headerMessageHeight () {
        return store.getters['screenState/getHeaderMessageHeight']
      },
      mainColumnWidth () {
        return store.getters['screenState/getMainColumnWidth']
      },
      betsNo () {
        return store.getters['sbBetslipState/selectionsNo']
      },
      isLoggedIn () {
        return store.getters['isLoggedIn']
      },
      activeBetSlipHistoryTab () {
        return store.getters['sbBetslipState/activeBetSlipHistoryTab']
      },
      showHistoryTabs () {
        return config.app.betHistoryInBetslip
      },
      isReadOnly () {
        return config.app.autoconf.ROBO
      },
      postLoginAlertExist () {
        return store.getters['getPostLoginAlertExist']
      },
      currentBetSlipState () {
        return store.getters['sbBetslipState/currentBetSlipState']
      },
      betTypeTab () {
        return store.getters['sbBetslipState/tab']
      },
      betslipLayout2 () {
        return window.ctsautoconf.BETSLIP_LAYOT_2 || false
      },
      stickyBetslip () {
        return window.ctsautoconf.STICKY_BETSLIP || false
      }
    },
    mounted () {
      this.mainColumnResize()
      this.centerColumnResize()
    },

    methods: {
      mainColumnResize () {
        var mainColumn = this.$refs.maincolumn
        if (mainColumn) {
          store.commit('screenState/setMainColumnWidth', mainColumn.offsetWidth)
        }
      },
      centerColumnResize () {
        var centerColumn = this.$refs.centercolumn
        if (centerColumn) {
          store.commit('screenState/setCenterColumnWidth', centerColumn.offsetWidth)
        }
      },
      toggleBetslipColumn () {
        if (!this.betslipVisible) {
          setTimeout(() => {
            window.scrollTo({ top: 0, behavior: 'smooth' })
          }, 200)
        }
        this.betslipVisible = !this.betslipVisible
      },
      toggleBetslipActiveTab () {
        if (!this.betslipVisible) {
          setTimeout(() => {
            window.scrollTo({ top: 0, behavior: 'smooth' })
          }, 200)
          this.betslipVisible = !this.betslipVisible
        }
      },
      setTab (tab, noscroll) {
        let initObj = { }
        if (!this.isLoggedIn) tab = 'BetSlip'

        // trigger autoload on Statement tabs only
        switch (tab) {
          case 'HistoryActive':
            initObj.fetchHistory = true
            initObj.queryStatus = 'Open'
            initObj.historyDateRange = { from: null, to: null }
            store.commit('sbBetslipState/setActiveBetSlipHistoryTab', 'active')
            this.toggleBetslipActiveTab()
            break
          case 'HistorySettled':
            initObj.fetchHistory = true
            initObj.queryStatus = 'NonOpen'
            initObj.historyDateRange = { from: new Date(), to: new Date() }
            initObj.historyDateRange.from.setDate(initObj.historyDateRange.from.getDate() - 7) // move from 7 days in the past
            store.commit('sbBetslipState/setActiveBetSlipHistoryTab', 'settled')
            this.toggleBetslipActiveTab()
            break
          default:
            store.commit('sbBetslipState/setActiveBetSlipHistoryTab', '')
            this.toggleBetslipActiveTab()
            break
        }
        store.dispatch('statementState/initStatement', initObj)
        if (!noscroll) {
          setTimeout(() => {
            window.scrollTo({top: 0, behavior: 'smooth'})
          }, 200)
        }
      },
      setBetTypeTab (tab) {
        if (this.currentBetSlipState) {
          return
        }
        this.userTab = tab
        store.commit('sbBetslipState/setTab', tab)
        if (this.mobileBigAndBelow) {
          document.getElementById('mob_betslip_container').scrollTop = 0
        }
      }
    },

    watch: {
      betsNo (newVal, oldVal) {
        if (this.activeBetSlipHistoryTab === 'active' || this.activeBetSlipHistoryTab === 'settled') {
          this.setTab('BetSlip', newVal < oldVal)
        }
      }
    },

    created () {

    }
  }
</script>

<style lang="stylus" scoped>
  @import "~@/css/config"

  .url-state-name-sports-live
    .content
      .page-layout
        .background-headline
          height: 180px
          @media mobile-big-and-below
            height: 165px
          >>>.background-image
            @media mobile-big-and-below
              height 175px

  .promotions-teaser-wrapper
    padding: 0 24px 16px 0px
    color: #fff
    @media mobile-big-and-below
      padding: 16px 10px 16px 10px
    .promotions-teaser
      padding-left: 20px
      padding-right: 20px
  .url-event
    .promotions-teaser-wrapper
      padding: 0 0px 16px 0px

  .toggleBetslipColumn.player_msg_active
    top 135px
    &.circa
      top: 153px
    &.sb
      top 165px
    &.mav
      top 165px
    &.qcasino
      top 165px
    &.pr
      top 165px
    &.dn
      top 142px
    &.dnw
      top 142px
  .toggleBetslipColumn.player_msg_active_2
    top 135px
    &.circa
      top: 194px
    &.sb
      top 185px
    &.mav
      top 185px
    &.qcasino
      top 185px
    &.pr
      top 185px
    &.dn
      top 182px
    &.dnw
      top 182px
    &.igt
      top 175px
    &.boyd
      top 176px
.betslip-column.sidebarColumn
  padding-top 0px !important
</style>
