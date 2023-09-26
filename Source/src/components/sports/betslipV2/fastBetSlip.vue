<template>
  <div id="singleBetSlip" class="FastBetSlip" :class="{'betslip_layout_2' : betslipLayout2}" v-if="dialogSingleBetslip.active">

    <selection-regular v-for="id in betslipSelectionIds"
                       :key="id"
                       :id="id"
                       :currentBetSlipState="currentBetSlipState"
                       :tab="tab"
                       :allowedBetTypesAndReturns="allowedBetTypesAndReturn"
                       :parlayStake="1"
                       :betsNo="betsNo"
                       :allowedMultiSingles="allowedMultiSingles"
                       :isFastBet="true"
    ></selection-regular>

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
                   :isFastBet="true"
                   :promotionsData="promotionsData"
                   :state="state"
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
                   :isFastBet="true"
                   :dialogSingleBetslip="dialogSingleBetslip"
                   @setTabFromBetSlip="setTabFromBetSlip"
                   :isGeoLocationEnabled="isGeoLocationEnabled"
                   :promotionsData="promotionsData"
                   :mobileBigAndBelow="mobileBigAndBelow"
    ></bet-slip-btns>

    <div class="preferenceSwitch" v-show="showAll" >
      <preference-switch :id="'rememberSingleBetSlipStake'"
                         :currentBetSlipState="currentBetSlipState"
                         :doNotConfirm="true" > </preference-switch>
    </div>

    <!--betslipSelectionIds: {{betslipSelectionIds}}<br>-->
    <!--rememberSingleBetSlipStake: {{rememberSingleBetSlipStake}}<br>-->
    <!--singleBetSlipStake: {{singleBetSlipStake}}<br>-->
    <!--tab: {{tab}}<br>-->
    <!--dialogSingleBetslip: {{dialogSingleBetslip}}<br>-->
    <!--isSGM: {{isSGM}}<br>-->
    <!--pricetype: {{pricetype}}<br>-->
    <!--isOddsBoost: {{isOddsBoost}}<br>-->
    <!--isInterRelated: {{isInterRelated}}<br>-->
    <!--derivativeId: {{derivativeId}}<br>-->
    <!--derivativeSelection: {{derivativeSelection}}<br>-->
    <!--doNotMarkChanges: {{doNotMarkChanges}}<br>-->
    <!--selection: {{selection}}<br>-->
    <!--<b>market:</b> {{market}}<br>-->
    <!--<b>marketLive:</b> {{marketLive}}<br>-->
    <!--<b>parlayStake:</b> {{parlayStake}}<br>-->
    <!--<b>allowedBetTypesAndReturn:</b> {{allowedBetTypesAndReturn}}<br>-->
  </div>
</template>

<script>
  import store from '@/store'
  import Screen from '@/components/mixins/Screen'
  import betSlip from '@/components/sports/BetSlipV2/mixins/BetSlip'
  import selectionRegular from './selections/selectionRegular.vue'
  import betSlipMsgs from './rootElements/messages.vue'
  import betSlipBtns from './rootElements/buttons.vue'
  import preferenceSwitch from './rootElements/preferenceSwitch.vue'

  export default {
    name: 'FastBetSlip',

    mixins: [
      Screen,
      betSlip
    ],

    props: ['dialogSingleBetslip', 'state'],

    components: {
      selectionRegular,
      betSlipMsgs,
      betSlipBtns,
      preferenceSwitch
    },

    data () {
      return {
        showAll: true
      }
    },

    computed: {
      rememberSingleBetSlipStake () {
        return store.getters['sbBetslipState/rememberSingleBetSlipStake']
      },
      singleBetSlipStake () {
        return store.getters['sbBetslipState/singleBetSlipStake']
      },
      betslipSelectionIds () {
        let betslipSelectionIds = store.getters['sbBetslipState/betslipSelectionIds'] || []
        return betslipSelectionIds.slice(0, 1)
      },
      allowedBetTypesAndReturn () {
        return this.allowedBetTypesAndReturns.REGULAR.PotentialReturns.PerSelection
      },
      betslipLayout2 () {
        return window.ctsautoconf.BETSLIP_LAYOT_2 || false
      }
    },

    methods: {

    },

    created () {
    },

    mounted () {
    },

    watch: {
    },

    destroyed () {
    }
  }
</script>

<style lang="stylus" scoped>
  #singleBetSlip {
    overflow: hidden;
    padding: 0px 8px 20px 8px;
    margin: 10px 0 0 0;
    -webkit-box-shadow: 0px 0px 18px 0px rgba(0, 0, 0, 0.4);
    -moz-box-shadow: 0px 0px 18px 0px rgba(0, 0, 0, 0.4);
    box-shadow: 0px 0px 18px 0px rgba(0, 0, 0, 0.4);
    background-color: #E9F5FF;
    background-color: #FFF;
  }
</style>
