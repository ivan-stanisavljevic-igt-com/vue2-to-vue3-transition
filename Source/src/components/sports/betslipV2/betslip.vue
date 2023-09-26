<template>
  <div class="SBbetSlip" id="SBbetSlip" :class="[currentBetSlipStateName]" >
    <div class="bets">
      <bet-slip-tabs
        :tab="tab"
        :currentBetSlipState="currentBetSlipState"
        :betsNo="betsNo"
        :allowedBetTypesAndReturns="allowedBetTypesAndReturns"
        :betTypeStakes="betTypeStakes"
        :gettingABTnR="gettingABTnR"
        :interRelated="interRelated"
        :allowedMultiSingles="allowedMultiSingles"
        :betSlipStatus="betSlipStatus"
      ></bet-slip-tabs>
      <div v-if="!betsNo" class="emptyBetSlip">
        <!-- <span v-html="$t('BetSlip.tab.'+tab+'.empty')"></span> -->
        <div v-if="brandLayout !=='generic' && brandKey !=='sb' && brandKey !=='qcasino' && brandKey !== 'pr' && brandKey !=='rw'" class="add-bets-container">
          <v-icon>add</v-icon>
          <div class="ab-info-msg">
            <span class="ab-label">{{ $t('BetSlip.add.bets') }}</span>
            <span class="ab-label zerobets" v-html="$t('BetSlip.zero.bets')"></span>
          </div>
        </div>
        <div v-if="brandLayout ==='generic'" class="empty-betslip-container">
          <img :src="mediaServer('/static/brand-img/' + brandKey + '/empty-betslip.svg')" class="empty_betslip" alt="Betslip">
        </div>
        <div v-if="brandKey ==='sb'" class="empty-betslip-container">
          <span class="empty-betslip-label">{{ $t('BetSlip.emptyBetslip') }}</span>
          <img :src="mediaServer('/static/brand-img/' + brandKey + '/empty-betslip_'+ state +'.svg')" class="empty_betslip" alt="Betslip">
        </div>
        <div v-if="brandKey ==='rw'" class="empty-betslip-container">
          <img src="~@/assets/images/brands/rw/empty-betslip.svg" class="empty_betslip" alt="Betslip">
        </div>
        <div v-if="brandKey ==='qcasino' || brandKey === 'pr'" class="empty-betslip-container">
          <span class="empty-betslip-label">{{ $t('BetSlip.emptyBetslip') }}</span>
          <img v-if="brandKey === 'qcasino'" src="~@/assets/images/brands/qcasino/empty-betslip.svg" class="empty_betslip" alt="Betslip">
          <img v-if="brandKey === 'pr'" src="~@/assets/images/brands/pr/empty-betslip-lightblue.svg" class="empty_betslip" alt="Betslip">
        </div>
      </div>
    </div>
    <div class="fixed_footer_sep" :style="betslipActionsHeight" :class="{'bet_placed' : betSlipStatus.State==2}"></div>
    <div class="betslip_actions" ref="betActions" :class="{'bet_placed' : betSlipStatus.State==2}">

      <template v-if="brandLayout === 'generic' && betslipLayout2">
        <tabs-betslip-bottom 
        :tab="tab" 
        :currentBetSlipState="currentBetSlipState" 
        :betsNo="betsNo" 
        :betTypeStakes="betTypeStakes" 
        :allowedBetTypesAndReturns="allowedBetTypesAndReturns">
        </tabs-betslip-bottom>
      </template>

      <bet-slip-msgs class="BetSlipMsgs"
               :tab="tab"
               :currentBetSlipState="currentBetSlipState"
               :isLoggedIn="isLoggedIn"
               :betsNo="betsNo"
               :betPlacementResult="betPlacementResult"
               :betSlipStatus="betSlipStatus"
               :inRefferal="inRefferal"
               :inRunningDelay="inRunningDelay"
               :gracePeriod="gracePeriod"
               @setTabFromBetSlip="setTabFromBetSlip"
               :mobileBigAndBelow="mobileBigAndBelow"
               :promotionsData="promotionsData"
               :state="$t('App.State.Name.'+STATE)"
               :betSlipTotals="betSlipTotals"
      ></bet-slip-msgs>

      <bet-slip-btns class="BetSlipBtns"
               :tab="tab"
               :currentBetSlipState="currentBetSlipState"
               :isLoggedIn="isLoggedIn"
               :betsNo="betsNo"
               :betSlipTotals="betSlipTotals"
               :gettingABTnR="gettingABTnR"
               :betPlacementResult="betPlacementResult"
               :betSlipStatus="betSlipStatus"
               :inRefferal="inRefferal"
               :betSlipChangeNo="betSlipChangeNo"
               @setTabFromBetSlip="setTabFromBetSlip"
               :mobileBigAndBelow="mobileBigAndBelow"
               :isGeoLocationEnabled="isGeoLocationEnabled"
               :promotionsData="promotionsData"
      ></bet-slip-btns>
    </div>

      <v-dialog v-if="mobileBigAndBelow" content-class="dialog-single-bet-slip"
              v-model="dialogSingleBetslip.active"
              persistent
              :allowedBetTypesAndReturns="allowedBetTypesAndReturns"
              :hide-overlay="true"
              :fullscreen="false"
              transition="dialog-bottom-transition">
      <fast-bet-slip :dialogSingleBetslip="dialogSingleBetslip"
                     :state="$t('App.State.Name.'+STATE)" ></fast-bet-slip>
    </v-dialog>

    <!--<hr>-->
    <!--<br>-->
    <!--<b>translationsLoading: </b>{{translationsLoading}}<br>-->
    <!--<b>inRefferal: </b>{{inRefferal}}<br>-->
    <!--<b>tab: </b>{{tab}}<br>-->
    <!--<b>betsNo: </b>{{betsNo}}<br>-->
    <!--<b>pitchers: </b>{{pitchers}}<br>-->
    <!--<b>buyPoints: </b>{{buyPoints}}<br>-->
    <!--<b>gettingABTnR: </b>{{gettingABTnR}}<br>-->
    <!--<b>betTypeStakes: </b>{{betTypeStakes}}<br>-->
    <!--<b>allowedBetTypesAndReturns: </b>{{allowedBetTypesAndReturns}}<br>-->
    <!--<b>teaserGroups: </b>{{teaserGroups}}<br>-->
    <!--<b>betslipSelections: </b>{{betslipSelections}}<br>-->
    <!--<b>interRelated: </b>{{interRelated}}<br>-->
    <!--<b>dialogSingleBetslip: </b>{{dialogSingleBetslip}}<br>-->
    <!--<b>promotionsData: </b>{{promotionsData}}<br>-->
    <!--<br><b>promotionsPayload: </b>{{promotionsPayload}}-->
    <!--<br><b>promotionsPayloadKey: </b>{{promotionsPayloadKey}}-->
    <!--<br>betSlipTotals: <div v-html="printJSON(betSlipTotals)"></div>-->
<!--    <br>bsCalculation: <div v-html="printJSON(bsCalculation)"></div>-->
<!--    <br><hr>betTypeStakes: <div v-html="printJSON(betTypeStakes)"></div>-->
<!--    <br><hr>allowedBetTypesAndReturns: <div v-html="printJSON(allowedBetTypesAndReturns)"></div>-->
  </div>
</template>

<script>
  import Vue from 'vue'
  import store from '@/store'
  import Screen from '@/components/mixins/Screen'
  import betSlip from '@/components/sports/BetSlipV2/mixins/BetSlip'
  import betSlipTabs from './rootElements/tabs.vue'
  import betSlipMsgs from './rootElements/messages.vue'
  import betSlipBtns from './rootElements/buttons.vue'
  import fastBetSlip from './fastBetSlip.vue'
  import circleLoader from '@/components/common/CircleLoader'
  import Branding from '@/components/mixins/Branding'
  import Url from '@/components/mixins/Url'
  import tabsBetslipBottom from './rootElements/tabsBetslipBottom'
  import config from '@/config'

  export default {
    name: 'Betslip',

    mixins: [
      Screen,
      betSlip,
      Branding,
      Url
    ],

    props: [],

    components: {
      circleLoader,
      betSlipTabs,
      betSlipMsgs,
      betSlipBtns,
      fastBetSlip,
      tabsBetslipBottom
    },

    data () {
      return {
        betslipActionsHeight: { },
        fetchPromotionsTo: null
      }
    },

    filters: {
    },

    computed: {
      dialogSingleBetslip () {
        return store.getters['overlayState/getSingleBetslipState']
      },
      state () {
        return config.app.autoconf.STATE
      },
      betslipLayout2 () {
        return window.ctsautoconf.BETSLIP_LAYOT_2 || false
      }
    },

    methods: {
      printJSON (obj) {
        obj = obj || {}
        return JSON.stringify(obj, null, 4)
          .replace(/\n( *)/g, function (match, p1) {
            return '<br>' + '&nbsp;'.repeat(p1.length)
          })
      },
      setBetSlipActionsheight () {
        var height
        if (!this.$refs.betActions || this.$refs.betActions.clientHeight === 0) {
          height = '176px'
        } else {
          height = this.$refs.betActions.clientHeight + 'px'
        }
        Vue.set(this.betslipActionsHeight, 'height', height)
      }
    },

    created () {
//      console.log('BetSlip created')
    },

    mounted () {
      this.setBetSlipActionsheight()
      setTimeout(function () {
        store.dispatch('sbBetslipState/getFromStorage')
      }, 1000)
    },

    watch: {
      betsNo (newVal, oldVal) {
        // console.log('Watch betsNo - scheduleGetABTnR')
        store.dispatch('sbBetslipState/scheduleGetABTnR')
        if (newVal > oldVal) {
//          store.dispatch('sbBetslipState/scheduleGetTeaserGroups')
          store.dispatch('sbBetslipState/scheduleBetSlipUpdate', 2)
        }
//        this.setTabFromBetSlip('BetSlip')
      },
      tab () {
        // console.log('Watch Tab - scheduleGetABTnR')
        store.dispatch('sbBetslipState/scheduleGetABTnR')
      },
      isLoggedIn (newVal, oldVal) {
        if (newVal) {
          store.dispatch('sbBetslipState/getStoredBetsOnEvents')
        }
      }
    },
    updated () {
      this.setBetSlipActionsheight()
    },

    destroyed () {
    }
  }
</script>

<style lang="stylus" scoped>
  @import "~@/css/config"
  .SBbetSlip {
    height: 100%;
    .betslip_actions {
      padding: 0px;
    }
  }
.add-bets-container
  background-color #004c97
  border-radius 0px
  display flex
  align-items center
  justify-content center
  margin 10px
  color #fff
  padding 10px 0
  .ab-sign
    background-color #fff
    display flex
    align-items center
    justify-content center
    text-align center
    width 43px
    height 43px
    margin 5px
    border-radius 5px
  .ab-label
    font-size 16px
    text-transform: uppercase
    display: block
    text-align: center
    font-weight normal
    &.zerobets
      >>> span
        font-family 'Open Sans SemiBold' !important
  .v-icon
    padding 5px
    background-color none
    margin 5px
    border-radius 50%
    color #ff671f
    border 2px solid #ff671f
@media tablet-and-above
  .fixed_footer_sep
    display: none

.fixed_footer_sep.bet_placed
  display: none !important
</style>
