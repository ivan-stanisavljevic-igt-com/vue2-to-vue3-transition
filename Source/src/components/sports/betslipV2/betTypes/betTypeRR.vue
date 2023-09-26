<template>
  <div class="betType RoundRobin betType-RR" v-show="!isHidden"
       :class="[statusToConfirm ? 'statusToConfirm-' + statusToConfirm : '']">
    <!-- <div class="heading">
      <span>{{ $t('BetSlip.betType.RR.' + id) }}</span>
      <span class="xWagers">
        x{{allowedBetTypesAndReturns.UnitCount}} <span>{{ $t('BetSlip.tab.RR.betType.wagers') }}</span>
      </span>
    </div> -->
    <template v-if="brandKey !== 'boyd' && brandKey !== 'rw'">
      <div class="header-RR rr_title">
	      <div class="betType_header_title">
	        <span class="rr_first" key="rr_first">{{ $t('BetSlip.betType.RR.' + id) }}</span>
	        <span class="xWagers">
	          &nbsp;x {{allowedBetTypesAndReturns.UnitCount}}
	          <span>{{ $t('BetSlip.tab.RR.betType.wagers') }}</span>
	        </span>
	
	        <span class="isForBB float-right" v-if="isForBB">
	          <icon v-if="isForBB" name="icon-available-for-bb-white"></icon>
	        </span>
	
	        <span v-if="statusToConfirm" class="statusToConfirm">{{ $t('BetSlip.placement.bet.' + statusToConfirm) }}</span>
        </div>
        <div v-if="betslipLayout2" class="price_div">
          <span class="price">
            {{formattedOdds}}
          </span>
        </div>
      </div>
      <div class="bet_content">
        <div v-if="!betslipLayout2" class="odds_div">
          <span class="price_title">{{ $t('BetSlip.oddsprice') }}</span>
          <span class="price">
            {{formattedOdds}}
          </span>
        </div>
        <div class="stake-n-return">
          <stake-and-return class="clear-both"
            :id="id"
            :perType="'PerBetType'"
            :tab="tab"
            :currentBetSlipState="currentBetSlipState"
            :allowedBetTypesAndReturns="allowedBetTypesAndReturns"
            @hideBetType="hideBetType"
            :statusToConfirm="statusToConfirm"
          >
          </stake-and-return>
        </div>
      </div>
    </template>
    <!-- BOYD -->
    <template v-if="brandKey === 'boyd' || brandKey === 'rw'">
      <!-- <div class="header-RR rr_title">
        <span class="rr_first" key="rr_first">{{ $t('BetSlip.betType.RR.' + id) }}</span>
        <span class="xWagers">
          x{{allowedBetTypesAndReturns.UnitCount}} <span>{{ $t('BetSlip.tab.RR.betType.wagers') }}</span>
        </span>
      </div> -->
      <div class="bet_content">
        <div class="rr_title">
          <span class="rr_first" key="rr_first">{{ $t('BetSlip.betType.RR.' + id) }}</span>
          <span class="xWagers">
            x{{allowedBetTypesAndReturns.UnitCount}} <span>{{ $t('BetSlip.tab.RR.betType.wagers') }}</span>
          </span>
          <span class="isForBB float-right" v-if="isForBB">
            <icon v-if="isForBB" name="icon-available-for-bb-blue"></icon>
          </span>
          <span v-if="statusToConfirm" class="statusToConfirm" >{{ $t('BetSlip.placement.bet.' + statusToConfirm) }}</span>
        </div>
        <div class="odds">
          <span class="price">
            {{formattedOdds}}
          </span>
        </div>
      </div>
      <div class="stake-n-return">
        <stake-and-return class="clear-both"
          :id="id"
          :perType="'PerBetType'"
          :tab="tab"
          :currentBetSlipState="currentBetSlipState"
          :allowedBetTypesAndReturns="allowedBetTypesAndReturns"
          @hideBetType="hideBetType"
          :statusToConfirm="statusToConfirm"
        >
        </stake-and-return>
      </div>
    </template>
  </div>
</template>

<script>
//  import Vue from 'vue'
  import store from '@/store'
  import priceFormat from '@/library/priceFormat'
  import stakeAndReturn from '../common/stakeNreturn'
  import Branding from '@/components/mixins/Branding'
  import Icon from '@/components/common/Icon'

  export default {
    name: 'betTypeRoundRobin',

    mixins: [
      Branding
    ],

    props: ['id', 'currentBetSlipState', 'tab', 'allowedBetTypesAndReturns'],

    components: {
      stakeAndReturn,
      Icon
    },

    data () {
      return {
        isHidden: false
      }
    },

    computed: {
      isBBenabled () {
        return store.getters['sbBetslipState/isBBenabled']
      },
      isForBB () {
        let isForBB = false
        if (this.isBBenabled && !this.isSGM) {
          let selections = store.getters['sbBetslipState/getSelections4Calculation'](this.tab)
          let optedIn = store.getters['sbBetslipState/optedInRR']
          isForBB = selections.filter(s => optedIn[s.idfoselectionsource || s.idfoselection]).every(s => s.isForBB)
        }
        return isForBB
      },
      statusToConfirm () {
        return store.getters['sbBetslipState/getStatusToConfirm'](this.id)
      },
      gettingABTnR () {
        return store.getters['sbBetslipState/gettingABTnR']
      },
      formattedOdds () {
        return priceFormat.formatBetTypePrice(this.allowedBetTypesAndReturns)
      },
      betslipLayout2 () {
        return window.ctsautoconf.BETSLIP_LAYOT_2 || false
      }
    },

    methods: {
      hideBetType (bool) {
        this.isHidden = bool
      }
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
  .float-right {
    float: right;
  }
  .clear-both {
    clear: both;
  }
  .statusToConfirm {
    color: #ff671f;
    padding-left: 10px;
    font-style: italic;
    font-weight: normal;
    text-transform: uppercase;
    font-family: 'Open Sans Bold';
  }
  .betType {
    background-color: #f0f3f8;
    border: 1px solid silver;
    margin: 5px 0;
    padding: 0px;
    .bet_content {
      padding: 0px;
    }

    .heading {
      font-family: 'Open Sans SemiBold';
      font-size: 14px;
      padding: 0px 5px 8px;
    }

    &.last {
      border-radius: 0 !important;
    }
  }
  .odds {
    font-family: 'Open Sans SemiBold';
    color: #1493ff;
    font-size: 14px;
  }
  .stake-n-return
    padding 5px 6px 5px
  .rr_title
    display flex
    align-items center
    justify-content flex-start
    .isForBB
      margin-left 5px
      margin-top -3px
</style>
