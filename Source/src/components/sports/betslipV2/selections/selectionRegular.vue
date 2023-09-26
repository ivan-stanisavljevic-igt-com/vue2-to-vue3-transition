<template>
  <div class="selection" v-show="!isHidden"
       :class="[tab,
       'state-'+currentBetSlipState,
       isInterRelated ? 'interRelated-' + isInterRelated : '',
       {
       FastBet: isFastBet,
       isLive: isLive,
       priceUp: priceUp,
       priceDown: priceDown,
       hcpUp: hcpUp,
       hcpDown: hcpDown,
       isClosed: isClosed,
       isSuspended: isSuspended,
       edit: currentBetSlipState==0,
       review: currentBetSlipState==1,
       inPlacement: currentBetSlipState>1,
       notStaked: !stake,
       oddsBust: pricetype === 'XP',
       interRelated: isInterRelated,
       optedOut: !optedIn[id],
       isForSinglesOnly: isForSinglesOnly,
       isForBB: isForBB
   }]">
  <template v-if="brandKey!=='boyd' && brandKey!=='rw'">
    <div class="selection-core">
      <div class="event-name" v-if="!isFastBet || betslipLayout2">
        <div v-if="!betslipLayout2" class="bs_left">
         <icon  :colorName="'white'" :name="'icon-' + (selection.idfosporttype && selection.idfosporttype.split(' ').join(''))"></icon>
          <span class="eventname" >
            <span id="name">{{selectionName}}</span>
            <span class="currenthandicap" :class="[{'hcpUp' : hcpUp}, {'hcpDown' : hcpDown}]">{{handicap}} </span>
          </span>
        </div>
        <div v-if="betslipLayout2" class="bs_left betslipLayout2">
          <div class="event_and_market_name">
            <div class="eventname" >
              <span id="name">{{selectionName}}</span>
              <span class="currenthandicap" :class="[{'hcpUp' : hcpUp}, {'hcpDown' : hcpDown}]">{{handicap}} </span>
            </div>
            <div class="market-name">
              {{market.name}}
            </div>
          </div>
          <div class="selection-price odds" :class="'pricetype-' + pricetype">
            <template v-if="!isClosed && !isSuspended">
              <div class="price">
                <i v-if="isOddsBoost" aria-hidden="true" class="icon material-icons">arrow_upward</i>
                <span :class="[{'priceUp' : priceUp}, {'priceDown' : priceDown}]" class="price">{{price}}</span>
              </div>
            </template>
            <span v-if="isClosed || isSuspended" class="price">
              <span class="price_title" v-if="isClosed">{{ $t('BetSlip.selection.isClosed') }}</span>
              <span class="price_title" v-if="isSuspended">{{ $t('BetSlip.selection.isSuspended') }}</span>
            </span>
          </div>
        </div>
        <div class="bs_right">
          <!-- <span class="selection-ts" v-if="!isLive && market.tsstart && currentBetSlipState<1" >
            <span class="time">{{ market.tsstart | moment(dateFormats.longTime) }}</span>
            <span class="date">{{ market.tsstart | moment(dateFormats.shortDate) }}</span>
          </span> -->
          <div v-if="!betslipLayout2" class="market-name">
            {{market.name}}
          </div>
          <button class="btnX" @click="removeSelection(selection)" v-if="currentBetSlipState<1">
            <icon name="icon-trash-white"></icon>
          </button>
        </div>
      </div>
        <div class="selection-data columns">
          <div v-if="isLive || showCheckbox" class="column-left">
            <v-checkbox v-if="showCheckbox === true" type="checkbox"
                        :id="id.toString()"
                        :value="optedIn[id]"
                        :disabled="disableOptedIn"
                        v-model="optedIn[id]"
                        @change="updateOptedIn()">
            </v-checkbox>
            <span v-if="isLive && !betslipLayout2" class="isLive"><span>{{ $t('BetSlip.selection.isLive') }}</span></span>
          </div>

          <div class="column-right">
            <div class="selectionName">
              <!--<b>[{{id}}]</b>-->
                <icon v-if="betslipLayout2" :colorName="'white'" :name="'icon-' + (selection.idfosporttype && selection.idfosporttype.split(' ').join(''))"></icon>
                <span class="event-name-line-1">{{wbr(eventName, 0)}}</span>
                <span class="event-name-line-2">{{wbr(eventName, 1)}}</span>
                <span v-if="isLive && betslipLayout2" class="isLive"><span>{{ $t('BetSlip.selection.isLive') }}</span></span>
              <div v-if="!betslipLayout2 && brandKey=='circa' && pitcherNames">{{ $t('BetSlip.tab.REGULAR.selection.pitcherNames', pitcherNames) }}</div>
              <span v-if="statusToConfirm" class="statusToConfirm">{{ $t('BetSlip.placement.bet.' + statusToConfirm) }}</span>
            </div>
            <span class="isForBB" v-if="isForBB">
              <icon name="icon-available-for-bb"></icon>
            </span>
            <div v-if="!betslipLayout2 && isFastBet && brandKey === 'circa' && currentBetSlipState<1" class="closeFastBet"><v-icon @click="removeSelection(selection)">close</v-icon></div>
          </div>

        </div>
        <div class="selection-data selectionName columns" v-if="showEventTsStart">
          <div class="column-right"><ts-start :tsstart="market.tsstartWithOffset || market.tsstart"></ts-start></div>
        </div>
        <div class="additional-data" >
          <div class="stake_price">
             <div v-if="!betslipLayout2" class="selection-price odds" :class="'pricetype-' + pricetype">
              <template v-if="!isClosed && !isSuspended">
                <span class="price_title">{{ $t('BetSlip.oddsprice') }}</span>
                <div class="price">
                  <i v-if="isOddsBoost" aria-hidden="true" class="icon material-icons">arrow_upward</i>
                  <span :class="[{'priceUp' : priceUp}, {'priceDown' : priceDown}]" class="price">{{price}}</span>
                </div>
              </template>
              <span v-if="isClosed || isSuspended" class="price">
                <span class="price_title" v-if="isClosed">{{ $t('BetSlip.selection.isClosed') }}</span>
                <span class="price_title" v-if="isSuspended">{{ $t('BetSlip.selection.isSuspended') }}</span>
              </span>
            </div>
            <stake-and-return v-if="canBePlacedAsSingle"
              :id="selection.idfoselection"
              :perType="'PerSelection'"
              :tab="tab"
              :currentBetSlipState="currentBetSlipState"
              :allowedBetTypesAndReturns="allowedBetTypesAndReturn"
              :isFastBet="isFastBet"
              :derivativeId="derivativeId"
              @hideBetType="hideBetType"
              :statusToConfirm="statusToConfirm"
            >
            </stake-and-return>
          </div>

          <listed-pitchers v-if="selection && selection.isPitcherSource && tab == 'REGULAR'"
            :tab="tab" :id="selection.idfoselection" :marketName="marketName" :currentBetSlipState="currentBetSlipState" :isFastBet="isFastBet" ></listed-pitchers>
          <buy-points-option v-if="selection && selection.isBuyPointsSource && tab == 'REGULAR' && currentBetSlipState<=1"
              :tab="tab" :id="selection.idfoselection" :selection="selection" :currentBetSlipState="currentBetSlipState" :isFastBet="isFastBet" ></buy-points-option>
        </div>
    </div>
  </template>

  <!-- BOYD, RW -->
  <template v-if="!betslipLayout2 && (brandKey==='boyd' || brandKey==='rw')">
    <div class="selection-core">
      <div class="event-name" v-if="!isFastBet">
         <div class="bs_left">
         <icon :colorName="'white'" :name="'icon-' + (selection.idfosporttype && selection.idfosporttype.split(' ').join(''))"></icon>
            <div class="selectionName">
              <span class="event-name-line-1">{{wbr(eventName, 0)}}</span>
              <span class="event-name-line-2">{{wbr(eventName, 1)}}</span>
            </div>
            <span class="isForBB" v-if="isForBB">
              <icon name="icon-available-for-bb-white"></icon>
            </span>
            <span v-if="statusToConfirm" class="statusToConfirm">{{ $t('BetSlip.placement.bet.' + statusToConfirm) }}</span>
          </div>
        <div class="bs_right">

          <button class="btnX" @click="removeSelection(selection)" v-if="currentBetSlipState<1">
            <icon name="icon-trash-white"></icon>
          </button>
        </div>
      </div>
        <div class="selection-data columns">
          <div v-if="isLive" class="column-left">
            <span class="isLive"><span>{{ $t('BetSlip.selection.isLive') }}</span></span>
          </div>

          <div class="column-right">
            <span class="eventname" >
              <span id="name">{{selectionName}}</span>
              <span class="currenthandicap" :class="[{'hcpUp' : hcpUp}, {'hcpDown' : hcpDown}]">{{handicap}} </span>
              <span class="isForBB" v-if="isForBB && isFastBet">
                <icon name="icon-available-for-bb"></icon>
              </span>
              <!--  -->
              <div class="selection-price" v-if="!isClosed && !isSuspended">
                <i v-if="isOddsBoost" aria-hidden="true" class="icon material-icons">arrow_upward</i>
                <span :class="[{'priceUp' : priceUp}, {'priceDown' : priceDown}]" class="price">{{price}}</span>
              </div>
               <div class="selection-price" v-if="isClosed || isSuspended">
                <span class="price_title" v-if="isClosed">{{ $t('BetSlip.selection.isClosed') }}</span>
                <span class="price_title" v-if="isSuspended">{{ $t('BetSlip.selection.isSuspended') }}</span>
              </div>

            </span>
            <div class="market-name">{{market.name}}</div>
          </div>
        </div>
        <div class="selection-data market-name columns" v-if="showEventTsStart">
          <div class="column-right"><ts-start :tsstart="market.tsstartWithOffset || market.tsstart"></ts-start></div>
        </div>
        <div class="additional-data" >
          <div class="stake_price">
             <!-- <div class="selection-price odds" :class="'pricetype-' + pricetype">
              <template v-if="!isClosed && !isSuspended">
                <span class="price_title">{{ $t('BetSlip.oddsprice') }}</span>
                <span class="arrow-blue" v-if="isOddsBoost"></span>
                <span :class="[{'priceUp' : priceUp}, {'priceDown' : priceDown}]" class="price">{{price}}</span>
              </template>
              <span v-if="isClosed || isSuspended" class="price">
                <span class="price_title" v-if="isClosed">{{ $t('BetSlip.selection.isClosed') }}</span>
                <span class="price_title" v-if="isSuspended">{{ $t('BetSlip.selection.isSuspended') }}</span>
              </span>
            </div> -->
            <stake-and-return v-if="canBePlacedAsSingle"
              :id="selection.idfoselection"
              :perType="'PerSelection'"
              :tab="tab"
              :currentBetSlipState="currentBetSlipState"
              :allowedBetTypesAndReturns="allowedBetTypesAndReturn"
              :isFastBet="isFastBet"
              :derivativeId="derivativeId"
              @hideBetType="hideBetType"
              :statusToConfirm="statusToConfirm"
            >
            </stake-and-return>
          </div>


          <listed-pitchers v-if="selection && selection.isPitcherSource && tab == 'REGULAR'"
            :tab="tab"
             :id="selection.idfoselection"
             :marketName="marketName"
             :currentBetSlipState="currentBetSlipState"
             :isFastBet="isFastBet" ></listed-pitchers>
          <buy-points-option v-if="selection && selection.isBuyPointsSource && tab == 'REGULAR' && currentBetSlipState<=1"
              :tab="tab" :id="selection.idfoselection" :selection="selection" :currentBetSlipState="currentBetSlipState" :isFastBet="isFastBet" ></buy-points-option>
        </div>
    </div>
  </template>

    <!--id: {{id}}<br>-->
    <!--tab: {{tab}}<br>-->
    <!--showCheckbox: {{showCheckbox}}<br>-->
    <!--isFastBet: {{isFastBet}}<br>-->
    <!--pricetype: {{pricetype}}<br>-->
    <!--isOddsBoost: {{isOddsBoost}}<br>-->
    <!--isInterRelated: {{isInterRelated}}<br>-->
    <!--derivativeId: {{derivativeId}}<br>-->
    <!--statusToConfirm: {{statusToConfirm}}<br>-->
    <!--derivativeSelection: {{derivativeSelection}}<br>-->
    <!--doNotMarkChanges: {{doNotMarkChanges}}<br>-->
    <!--selection: {{selection}}<br>-->
    <!--selection price: {{selection.currentpriceup + ' / ' + selection.currentpricedown}}<br>-->
    <!--derivativeSelection price: {{derivativeSelection.currentpriceup + ' / ' + derivativeSelection.currentpricedown}}<br>-->
    <!--<b>market:</b> {{market}}<br>-->
    <!--<b>marketLive:</b> {{marketLive}}<br>-->
    <!--<b>parlayStake:</b> {{parlayStake}}<br>-->
    <!--<b>allowedBetTypesAndReturn:</b> {{allowedBetTypesAndReturn}}<br>-->
    <!--<b>pitcherNames:</b> {{pitcherNames}}<br>-->
    <!--electionMarketName: {{selectionMarketName}}<br>-->
    <!--derivativeMarketName: {{derivativeMarketName}}<br>-->
    <!--isForBB: {{isForBB}}<br>-->
  </div>

</template>

<script>
  import store from '@/store'
  import selection from '@/components/sports/BetSlipV2/mixins/selection'
  import stakeAndReturn from '../common/stakeNreturn'
  import listedPitchers from '../derivatives/listedPitchers'
  import buyPointsOption from '../derivatives/buyPointsOption'
  import Icon from '@/components/common/Icon'
  import Branding from '@/components/mixins/Branding'
  import config from '@/config'

  export default {
    name: 'SelectionRegular',

    mixins: [
      selection,
      Branding
    ],

    props: ['id', 'currentBetSlipState', 'tab', 'allowedBetTypesAndReturns', 'parlayStake', 'betsNo', 'allowedMultiSingles', 'isFastBet'],

    components: {
      stakeAndReturn,
      listedPitchers,
      buyPointsOption,
      Icon
    },

    data () {
      return {
        isHidden: false,
        betVisibility: true
      }
    },

    computed: {
      pricetype () {
        return this.selection && this.selection.priceTypePerBetType && this.selection.priceTypePerBetType.S
      },
      dateFormats () {
        return config.app.dateFormats
      },
      stake () {
        var stakes = store.getters['sbBetslipState/betTypeStakes']
        return stakes && stakes[this.tab] && stakes[this.tab].PerSelection && stakes[this.tab].PerSelection[this.selection.idfoselection]
      },
      statusToConfirm () {
        return this.tab === 'REGULAR' && store.getters['sbBetslipState/getStatusToConfirm'](this.derivativeId || this.id)
      },
      betslipLayout2 () {
        return window.ctsautoconf.BETSLIP_LAYOT_2 || false
      }
    },

    methods: {
      hideBetType (bool) {
        this.isHidden = bool && !this.parlayStake
      },
      toggleOptedIn (sport) {
        console.log('toggleOptedIn ' + this.tab)
        if (this.showCheckbox && this.currentBetSlipState === 0 && this.tab === 'REGULAR') {
          this.optedIn[this.id] = this.disableOptedIn ? false : !this.optedIn[this.id]
          this.updateOptedIn(sport)
        }
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

  .columns {
    padding: 5px 4px;
    border-radius: 0 0 5px 5px;
    display: flex;
    align-items: center;
    .column-left{
      flex-grow: 0
      flex-basis: auto;
      margin-right: 12px
    }
    .column-right {
      display: block;
      flex: 1;
    }
  }
  .hidden-breakpoint {
    opacity: 0.5;
  }
  .hidden {
    display: none;
  }
  .selection {
    background-color: #fff;
    border: 2px solid #dadbdf;
    border-radius: 0px;
    margin: 5px 0;
    padding: 0px;

    .statusToConfirm {
      color: #ff671f;
      padding-left: 10px;
      font-style: italic;
      font-weight: normal;
      text-transform: uppercase;
      font-family: 'Open Sans Bold';
    }

    .event-name {
      line-height: 1;
      padding: 10px 5px 10px 10px;
      background-color: #0b4da1;
      border: 0px;
      border-radius: 0;
      border-bottom-width: 1px;
      display: flex
      align-items: center
      color: #fff;
      font-size: 14px;
      margin: -2px -2px 7px -2px;

      .eventname {
        span {
          white-space: nowrap;
        }
      }

      > span {
        flex: 1
        flex-basis: auto
      }

      .igt-icon,
      .isLive {
        flex-grow: 0
      }

      .isLive {
        -ms-flex-preferred-size: auto;
        flex-basis: auto;
        -webkit-box-flex: 0;
        -ms-flex-positive: 0;
        flex-grow: 0;
        flex-shrink: 0;
      }

      .igt-icon {
        margin-right: 12px
      }

    }

    .isLive {
      float: right;
      color: #db3f3f;
      /*color: #fff;*/
      /*padding: 1px 4px;*/
      border-radius: 3px;
      font-size: 12px;
    }
    .isLive:before{
      content: "";
      display: inline-block;
      background-color: #db3f3f;
      width: 7px;
      height: 7px;
      border-radius: 50%;
      vertical-align: middle;
      margin-right: 3px;
      margin-top: -2px;
    }

    .marketName {
      text-transform: uppercase;
      letter-spacing: 0;
      color: #818e95;
      /*margin-top: 2px;*/
    }
    .selection-data {
      padding: 0 10px
    }
    .additional-data {
      padding: 5px
    }

    &.isSGM {
      border-color: transparent;
      .selection-data {
        padding: 0 5px
      }
    }

    &.FastBet {
      border-width: 0;
      margin: 5px 0;
      padding: 0;
      .selection-core {
        padding: 0;
      }
      .columns {
        padding: 0px
      }
      .additional-data {
        padding: 0px
      }
    }
    .selectionName {
      color: #000;
      font-family: 'Open Sans SemiBold';
      font-size: 14px;
      display: inline-block;
    }

    .odds {
    }

    .float-right {
      float: right;
    }
    .btnX {
      margin: 0 0px 0 5px;
    }

    &.interRelated {
      /*border-width: 2px;*/
      border-color: #0b4da1;
      /*border-left: 5px solid #31a0fd;*/
    }
    /* &.interRelated.interRelated-1 {
      border-color: #0b4da1;
    }
    &.interRelated.interRelated-2 {
      border-color: #0b4da1;
    }
    &.interRelated.interRelated-3 {
      border-color: #0b4da1;
    }
    &.interRelated.interRelated-4 {
      border-color: #0b4da1;
    }
    &.interRelated.interRelated-5 {
      border-color: #0b4da1;
    }
    &.interRelated.interRelated-6 {
      border-color:#0b4da1;
    }
    &.interRelated.interRelated-7 {
      border-color: #0b4da1;
    }
    &.interRelated.interRelated-8 {
      border-color: #0b4da1;
    } */

    .selection-price {
      .lock {
        display: none;
      }
      &.pricetype-XP {
        background-color #ff671f
        color white
        padding 3px
        display flex
        height 50px
        overflow: hidden
        i.icon.material-icons {
          font-size 14px
          position relative
          top 3px
        }
        .arrow-blue {
          // background: url("~@/assets/images/icon/svg/boost-blue.svg")
          background-size 12px 12px
          display flex
          width 12px
          height 12px
          margin-right 4px
          cursor default
          background-repeat no-repeat
        }
        .price {
          flex 1
          margin-top -4px
        }
      }
      &.pricetype-XP:before {
        // background: url("~@/assets/images/icon/svg/boost.svg")
        background-size 12px 12px
        display flex
        width 12px
        height 12px
        margin-right 4px
        cursor default
        background-repeat no-repeat
      }
    }
  }
.FastBetSlip
  .stake-n-return
    margin-right -5px
.event-name
  >>>.igt-icon
    padding-right 5px
</style>
