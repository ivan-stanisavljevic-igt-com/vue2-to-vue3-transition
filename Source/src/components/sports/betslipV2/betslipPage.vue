<template>
  <div class="betslip-page" :style="[!mobileBigAndBelow && (brandKey ==='circa' || stickyBetslip) ? betslipHeight() : '']" @click="userIsActive()" :class="[currentBetSlipStateName,{'betslip-empty': !betsNo}, {'bet_placed_sucessfuly' : betSlipStatus.State==2 && activeBetSlipHistoryTab!=='active' && activeBetSlipHistoryTab!=='settled'}, {'fixedBetslip' : !mobileBigAndBelow && (stickyBetslip || brandKey ==='circa')}, {'betslip_layout_2' : betslipLayout2}]">
    <div v-if="brandKey !=='circa' && isLoggedIn && mobileBigAndBelow && betSlipStatus.State!=2" class="preheader">
      <div class="betslip_balance">
        <span class="span_balance">{{ $t('BetSlipPage.tab.balance') }}</span>
        <span class="value">{{ balanceSum | currency }}</span>
      </div>
      <v-btn v-if="mobileBigAndBelow && isLoggedIn && brandKey !== 'boyd'" flat @click="closeBetslipDialog()" class="close"><v-icon>close</v-icon></v-btn>
    </div>
    <div class="betslip-page-header" :class="[{'user_logged_in' : isLoggedIn}, {'withBackToBetslip': brandLayout === 'generic' && betslipLayout2 && betTypeTab!=='REGULAR'}]" v-if="!mobileBigAndBelow || (mobileBigAndBelow && betSlipStatus.State!=2) || (betSlipStatus.State==2 && (activeBetSlipHistoryTab==='active' || activeBetSlipHistoryTab==='settled'))">
      <div v-if="brandKey === 'circa' && isLoggedIn && mobileBigAndBelow" class="betslip_balance">
        <span class="value">{{ balanceSum | currency }}</span>
      </div>
      <span v-if="mobileBigAndBelow" class="tab" :class="{ 'active': activeBetSlipHistoryTab!=='active' && activeBetSlipHistoryTab!=='settled', disabled: true }">
        <a v-if="!betslipLayout2" @click="setTab('BetSlip')" class="a-link-">
          <span> {{ $t('BetSlipPage.tab.BetSlip') }} </span>
          <badge v-if="brandKey !== 'qcasino' && brandKey !== 'pr' && brandKey !== 'rw'">{{betsNo}}</badge>
          <badge v-if="brandKey === 'qcasino' || brandKey === 'pr'">{{ '(' + betsNo + ')'}}</badge>
          <span class="numOfBets" v-if="brandKey === 'rw'">{{'(' + betsNo + ')'}}</span>
        </a>
         <a v-if="betslipLayout2 && brandLayout === 'generic'" @click="setTab('BetSlip')" class="a-link-">
          <badge>{{betsNo}}</badge>
          <span> {{ $t('BetSlipPage.tab.BetSlip') }} </span>
        </a>
        <button v-if="mobileBigAndBelow && brandKey === 'boyd'" class="close" @click.stop="closeBetslipDialog()"><v-icon>close</v-icon></button>
      </span>
      <v-btn v-if="brandKey === 'circa' && mobileBigAndBelow && isLoggedIn" flat @click="closeBetslipDialog()" class="close"><v-icon>close</v-icon></v-btn>
      
      <span class="back_to_betslip back-to-betslip" v-if="mobileBigAndBelow && brandLayout === 'generic' && betslipLayout2 && betTypeTab!=='REGULAR'"><a @click="setBetTypeTab('REGULAR')" >{{ $t('BetSlip.tab.label.back') }}</a></span>
      
      <template v-if="brandKey !=='circa' && showHistoryTabs === true && isLoggedIn && mobileBigAndBelow && (!betslipLayout2 || (betslipLayout2 && betTypeTab==='REGULAR'))">
        <span class="tab  history-tab" :class="{ 'active': activeBetSlipHistoryTab==='active' }">
          <a @click="setTab('HistoryActive')" class="a-link-"><span>{{ $t('BetSlipPage.tab.History.active') }}</span></a>
        </span>
        <span class="tab  history-tab" :class="{ 'active': activeBetSlipHistoryTab==='settled' }">
          <a @click="setTab('HistorySettled')" class="a-link-"><span>{{ $t('BetSlipPage.tab.History.settled') }}</span></a>
        </span>
      </template>
       <v-btn v-if="mobileBigAndBelow && brandKey === 'rw' && !isLoggedIn" flat @click="closeBetslipDialog()" class="close"><v-icon>close</v-icon></v-btn>
      <!-- <div v-if="isLoggedIn && mobileBigAndBelow" class="betslip_balance">
        <span class="value">{{ balanceSum | currency }}</span>
        <span class="span_balance">{{ $t('BetSlipPage.tab.balance') }}</span>
      </div>
      <v-btn v-if="mobileBigAndBelow" flat @click="closeBetslipDialog()" class="close"><v-icon>close</v-icon></v-btn> -->
    </div>
    <div class="betslip-page-header" v-if="betSlipStatus.State==2 && mobileBigAndBelow && activeBetSlipHistoryTab!=='active' && activeBetSlipHistoryTab!=='settled'">
      <span class="your_receipt" key="your_receipt">{{ $t('BetSlip.status.placed.YourReceipt') }}</span>
      <v-btn flat @click="closeBetslipDialog()" class="close"><v-icon>close</v-icon></v-btn>
    </div>
    <!-- Fixed betslip (igt, circa) -->
    <div v-if="tabletAndAbove && (brandKey ==='circa' || stickyBetslip)" class="betslip_scroll" :style="vBarHeight()" v-bar="{preventParentScroll: true, useScrollbarPseudo: true, scrollThrottle: 30}">
      <div class="betslipHolder">
        <betslip v-if="activeBetSlipHistoryTab!=='active' && activeBetSlipHistoryTab!=='settled'" @setTabFromBetSlip="setTab"></betslip>
        <statement v-else-if="activeBetSlipHistoryTab==='active'" :selectedState="'Open'"></statement>
        <statement v-else-if="activeBetSlipHistoryTab==='settled'" :selectedState="'NonOpen'"></statement>
      </div>
    </div>
    <!-- Non Fixed betslip (sb, mav, boyd, dn) -->
    <div v-if="tabletAndAbove && brandKey !=='circa' && !stickyBetslip">
      <div class="betslipHolder">
        <betslip v-if="activeBetSlipHistoryTab!=='active' && activeBetSlipHistoryTab!=='settled'" @setTabFromBetSlip="setTab"></betslip>
        <statement v-else-if="activeBetSlipHistoryTab==='active'" :selectedState="'Open'"></statement>
        <statement v-else-if="activeBetSlipHistoryTab==='settled'" :selectedState="'NonOpen'"></statement>
      </div>
    </div>
    <div class="mobile_betslip" id="mob_betslip_container" :class="[{'user_logged_in' : isLoggedIn && brandKey ==='rw'}, {'with_favorites' : playerFavorites && favoriteCandidates && favoriteCandidates.length > 0}]" v-if="!tabletAndAbove">
      <betslip v-if="activeBetSlipHistoryTab!=='active' && activeBetSlipHistoryTab!=='settled'" @setTabFromBetSlip="setTab"></betslip>
      <statement v-else-if="activeBetSlipHistoryTab==='active'" :selectedState="'Open'"></statement>
      <statement v-else-if="activeBetSlipHistoryTab==='settled'" :selectedState="'NonOpen'"></statement>
    </div>
    <v-dialog content-class="dialog-betslip-msg" v-model="dialogBetslipMsg.active" persistent :fullscreen="false">
      <betslip-msg :dialogBetslipMsg="dialogBetslipMsg"></betslip-msg>
    </v-dialog>
  </div>
</template>

<script>
  import store from '@/store'
  import Betslip from '@/components/sports/betslipV2/Betslip'
  import Statement from '@/components/account/Statement'
  import AccountInfoWidgetComponent from '@/components/account/AccountInfoWidgetComponent'
  import Badge from '@/components/common/Badge'
  import betslipMsg from './betslipMsg.vue'
  import config from '@/config'
  import Session from '@/components/mixins/Session'
  import Screen from '@/components/mixins/Screen'
  import Icon from '@/components/common/Icon'
  import Branding from '@/components/mixins/Branding'
  import Gtm from '@/components/mixins/Gtm'

  import storage from '@/library/storage'

  export default {
    name: 'BetSlipPage',

    mixins: [
      Session,
      Screen,
      Branding,
      Gtm
    ],

    components: {
      AccountInfoWidgetComponent,
      Betslip,
      Badge,
      Statement,
      betslipMsg,
      Icon
    },

    data () {
      return { }
    },

    computed: {
      betslipLayout2 () {
        return window.ctsautoconf.BETSLIP_LAYOT_2 || false
      },
      betTypeTab () {
        return store.getters['sbBetslipState/tab']
      },
      activeBetSlip () {
        return store.getters['sbBetslipState/activeBetSlip']
      },
      currentBetSlipState () {
        return store.getters['sbBetslipState/currentBetSlipState']
      },
      currentBetSlipStateName () {
        return store.getters['sbBetslipState/currentBetSlipStateName']
      },
      betsNo () {
        return store.getters['sbBetslipState/selectionsNo']
      },
      betSlipStatus () {
        return store.getters['sbBetslipState/betSlipStatus']
      },
      dialogBetslipMsg () {
        return store.getters['overlayState/getBetslipMsg']
      },
      historystate () {
        return this.$route.params.hstate
      },
      isLoggedIn () {
        return store.getters['isLoggedIn']
      },
      getHeight () {
        return store.getters['screenState/getHeight']
      },
      getFooterHeight () {
        return store.getters['screenState/getFooterHeight']
      },
      getHeaderHeight () {
        return store.getters['screenState/getHeaderHeight']
      },
      getCustomerContext () {
        return store.getters['getCustomerContext']
      },
      balanceSum () {
        return (this.getCustomerContext && this.getCustomerContext.Balances && this.getCustomerContext.Balances.find(b => b.Key === 'CREDIT').Trading) || undefined
      },
      activeBetSlipHistoryTab () {
        return store.getters['sbBetslipState/activeBetSlipHistoryTab']
      },
      showHistoryTabs () {
        return config.app.betHistoryInBetslip
      },
      favoriteCandidates () {
        return store.getters['favorites/getFavoritesCandidatesByBetslipId'] || []
      },
      playerFavorites () {
        return window.ctsautoconf.PLAYER_FAVORITES || false
      },
      stickyBetslip () {
        return window.ctsautoconf.STICKY_BETSLIP || false
      }
    },

    methods: {
      setTab (tab) {
        this.userIsActive()
        let initObj = { }
        if (!this.isLoggedIn) tab = 'BetSlip'

        // trigger autoload on Statement tabs only
        switch (tab) {
          case 'HistoryActive':
            initObj.fetchHistory = true
            initObj.queryStatus = 'Open'
            initObj.historyDateRange = { from: null, to: null }
            store.commit('sbBetslipState/setActiveBetSlipHistoryTab', 'active')
            this.sendGTMClickEvent('betslip', 'bet history active', 'active tab', 'betslip')
            break
          case 'HistorySettled':
            initObj.fetchHistory = true
            initObj.queryStatus = 'NonOpen'
            initObj.historyDateRange = { from: new Date(), to: new Date() }
            initObj.historyDateRange.from.setDate(initObj.historyDateRange.from.getDate() - 7) // move from 7 days in the past
            store.commit('sbBetslipState/setActiveBetSlipHistoryTab', 'settled')
            this.sendGTMClickEvent('betslip', 'bet history settled', 'settled tab', 'betslip')
            break
          default:
            store.commit('sbBetslipState/setActiveBetSlipHistoryTab', '')
            break
        }
        store.dispatch('statementState/initStatement', initObj)
      },
      setTabHistoryAuto () {
        if (this.$route.params && this.$route.params.hstate) {
          let hs = this.$route.params.hstate.toLowerCase()
          if (!this.isLoggedIn) hs = ''
          switch (hs) {
            case 'active':
              this.setTab('HistoryActive')
              break
            case 'settled':
              this.setTab('HistorySettled')
              break
            default:
              this.setTab('BetSlip')
              break
          }
        }
      },
      closeBetslipDialog () {
//        console.log('closeBetslipDialog')
        store.commit('sbBetslipState/setCloseFromParent', true)
        setTimeout(function () {
//          console.log('deactivateBetslip')
          store.commit('sbBetslipState/setActiveBetSlip', false)
          store.commit('sbBetslipState/setActiveBetSlipHistoryTab', '')
          store.dispatch('overlayState/deactivateBetslip')
        }, 150)
        this.sendGTMClickEvent('betslip', 'close betslip dialog', 'betslip-close-btn', 'betslip dialog')
      },
      testStorage () {
        if (storage.isAvailable('localStorage')) {
          window.onpagehide = function (e) {
            store.dispatch('sbBetslipState/saveToStorage', 'onpagehide')
          }
          window.onunload = function (e) {
            store.dispatch('sbBetslipState/saveToStorage', 'onunload')
          }
          window.onbeforeunload = function (e) {
            store.dispatch('sbBetslipState/saveToStorage', 'onbeforeunload')
          }
        } else {
          console.log('Storage NOT available')
          // alert('Storage NOT available')
//          store.dispatch('overlayState/activateBetslipMsg', ['NO_STORAGE'])
        }
      },
      betslipHeight () {
        if (this.tabletAndAbove) {
          var footerH = 0
          var scroll = document.documentElement.scrollHeight - (this.scrollValue + this.getHeight)
          // var footerHeight = document.getElementById('footerH').clientHeight
          var footerHeight = this.getFooterHeight
          var headerHeight = this.getHeaderHeight
          if (this.brandKey === 'mav' || this.brandKey === 'sb' || this.brandLayout === 'generic') {
            headerHeight = headerHeight + 48
          }
          if (scroll <= footerHeight) {
            footerH = footerHeight - scroll
          }
          return {'max-height': (this.getHeight - footerH - headerHeight + 5) + 'px', 'top': headerHeight + 'px'}
        }
      },
      vBarHeight () {
        if (this.tabletAndAbove) {
          var footerH = 0
          var scroll = document.documentElement.scrollHeight - (this.scrollValue + this.getHeight)
          // var footerHeight = document.getElementById('footerH').clientHeight
          var footerHeight = this.getFooterHeight
          var headerHeight = this.getHeaderHeight
          if (this.brandKey === 'mav' || this.brandKey === 'sb' || this.brandLayout === 'generic') {
            headerHeight = headerHeight + 58
          }
          if (scroll <= footerHeight) {
            footerH = footerHeight - scroll
          }
          return {'height': (this.getHeight - footerH - headerHeight) + 'px'}
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
      betsNo () {
        if (this.activeBetSlipHistoryTab !== 'active' && this.activeBetSlipHistoryTab !== 'settled') {
          this.setTab('BetSlip')
        }
      },
      isLoggedIn (newVal, oldVal) {
        if (!newVal) {
          this.setTab('BetSlip')
        } else if (newVal === true) {
          this.setTabHistoryAuto()
          if (this.activeBetSlip) {
//            console.log('Will activate BetSlip on LogIn')
            setTimeout(function () {
              store.dispatch('overlayState/activateBetslip')
            }, 300)
          }
        }
      },
      historystate () {
        this.setTabHistoryAuto()
      }
    },
    created () {
      this.testStorage()
    }
  }
</script>

<style lang="stylus" scoped>
@import "~@/css/config"
  .your_receipt
    font-size: 16px
    font-weight: bold
    color: #06283b
    text-transform: uppercase
    line-height: 62px
    padding-left: 15px

  .betslip_balance
    color: #fff
    text-align: right
    margin: 0 16px 0 auto
    justify-content: center
    display: flex
    flex-direction: column
    line-height: 14px
    .value
      font-family 'Open Sans SemiBold'
      font-size: 14px
    .span_balance
      font-weight: normal
      font-size: 12px
      opacity: 0.8
      margin-right 5px

  .close
    margin: 0 !important

  // .browser-safari.os-ios
  //   .mobile_betslip
  //     height: -webkit-calc(100% - 54px) !important

  @media tablet-and-above
    .betslip-page
      position: fixed
      top: 0
      bottom: 0
      overflow: hidden
      width: 320px
      // transform: translate3d(0,0,0)
      padding-bottom: 0
      >>>.betslip_actions:not(.bet_placed)
        position: sticky
        bottom: 0px
      > *
        // transform: translate3d(0,0,0)
        transform: translateZ(0,0,0)
      @media only screen and (min-width: 1440px)
        width: 375px
    .betslip-page:not(.betslip-empty)
      >>>.betslip_actions:not(.bet_placed)
        border: 1px solid #cfd6db
        padding: 1px
        background: #fff
        margin-top 20px
        .action-btns
          border-top: 0px !important
          .preference-switch
            border-radius: 0 0 4px 4px
            margin: 12px -13px -13px -13px

    .betslip-page:not(.betslip-empty)
      .betslip_scroll
        >>>.vb-dragger
          z-index: 5
          width: 12px
          right: 0

  .browser-internet-explorer
    @media tablet-and-above
      .betslip-page
        height: auto
        >>>.betslip_actions:not(.bet_placed)
          position: absolute
          // width: 100%
          bottom: 0
          left: 4px
          right: 4px

        >>>.fixed_footer_sep
          display: block
        >>>.fixed_footer_sep.bet_placed
          display: none !important

  >>>.igt-icon
    text-align: center

.dialog-betslip .betslip-page.bet_placed_sucessfuly .mobile_betslip.with_favorites
  height 100% !important
  >>>.Bet-Accepted .totals
    position fixed !important
    bottom 70px
    border-top 1px solid #e4e4e4
    padding-top 10px
    background #fff
  
 
</style>
