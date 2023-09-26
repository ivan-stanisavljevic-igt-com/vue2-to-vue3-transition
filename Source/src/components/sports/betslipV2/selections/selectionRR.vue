<template>
  <div class="selection"
       :class="[tab,
       isInterRelated ? 'interRelated-' + isInterRelated : '',
       {
       isLive: isLive,
       priceUp: priceUp,
       priceDown: priceDown,
       hcpUp: hcpUp,
       hcpDown: hcpDown,
       isClosed: isClosed,
       isSuspended: isSuspended,
       edit: currentBetSlipState==0,
       review: currentBetSlipState==1,
       optedOut: !optedIn[id],
       oddsBust: pricetype === 'XP',
       interRelated: isInterRelated,
       isForSinglesOnly: isForSinglesOnly,
       isForBB: isForBB
   }]">

    <div class="columns">
      <div class="column column-left" >
        <v-checkbox v-if="showCheckbox === true" type="checkbox"
                    :id="id.toString()"
                    :value="optedIn[id]"
                    :disabled="disableOptedIn"
                    v-model="optedIn[id]"
                    @change="updateOptedIn()">
        </v-checkbox>
      <icon v-if="!showCheckbox" :colorName="'blue'" :name="'icon-' + (selection.idfosporttype && selection.idfosporttype.split(' ').join(''))"></icon>
      </div>
      <!-- BETSLIP LAYOUT 1 -->
      <div v-if="!betslipLayout2"  class="column column-right" @click="toggleOptedIn()" >
        <label :for="id">
          <div class="selection-data">
            <div class="event-name" >
              <span class="eventname" >
                <span class="name-lines">
                  <span class="name-line">{{wbr(eventName, 0)}}</span>
                  <span class="name-line">{{wbr(eventName, 1)}}</span>
                </span>
                <span class="isForBB" v-if="isForBB">
                  <icon name="icon-available-for-bb"></icon>
                </span>
              </span>
              <span class="isLive" v-if="isLive" ><span >{{ $t('BetSlip.selection.isLive') }}</span></span>
            </div>
            <div class="event-name pitcherNames"  v-if="brandKey=='circa' && pitcherNames">{{ $t('BetSlip.tab.RR.selection.pitcherNames', pitcherNames) }}</div>
            <div class="selection-name">
              <span class="name">
                <!--<b>[{{id}}]</b>-->
                {{ selectionName }}
                <span class="currenthandicap" :class="[{'hcpUp' : hcpUp}, {'hcpDown' : hcpDown}]" v-if="selection && typeof selection.currenthandicap == 'number'">
                  <span>{{handicap}}</span>
                </span>
                <!--<span v-if="isForBB" class="available-for-bb"></span>-->
              </span>
              <div class="selection-price float-right" :class="'pricetype-'+pricetype">
                <template v-if="!isClosed && !isSuspended">
                  <span class="arrow-blue" v-if="isOddsBoost"></span>
                  <span class="price" :class="[{'priceUp' : priceUp}, {'priceDown' : priceDown}]">{{price}}</span>
                </template>
                <span v-if="isClosed || isSuspended" class="price">
                  <span class="price_title" v-if="isClosed">{{ $t('BetSlip.selection.isClosed') }}</span>
                  <span class="price_title" v-if="isSuspended">{{ $t('BetSlip.selection.isSuspended') }}</span>
                </span>
              </div>
            </div>
            <div class="market-name">
              <span v-if="brandKey=='circa' && pitcherNames">{{selectionMarketName || derivativeMarketName}}
                <!--<span> {{ $t('BetSlip.tab.RR.selection.pitcherNames', pitcherNames) }}</span>-->
              </span>
              <span v-else>{{(market && market.name) || marketName}}</span>
            </div>
            <div class="eventTsStart market-name" v-if="showEventTsStart">
              <ts-start v-if="showEventTsStart" :tsstart="market.tsstartWithOffset || market.tsstart"></ts-start>
            </div>
          </div>
        </label>
      </div>
      <!-- BETSLIP LAYOUT 2 -->
      <div v-if="betslipLayout2"  class="column column-right" @click="toggleOptedIn()" >
        <label :for="id">
          <div class="selection-data">
             <div class="selection-name">
              <span class="name">
                <!--<b>[{{id}}]</b>-->
                {{ selectionName }}
                <span class="currenthandicap" :class="[{'hcpUp' : hcpUp}, {'hcpDown' : hcpDown}]" v-if="selection && typeof selection.currenthandicap == 'number'">
                  <span>{{handicap}}</span>
                </span>
                <!--<span v-if="isForBB" class="available-for-bb"></span>-->
              </span>
              <div class="selection-price float-right" :class="'pricetype-'+pricetype">
                <template v-if="!isClosed && !isSuspended">
                  <span class="arrow-blue" v-if="isOddsBoost"></span>
                  <span class="price" :class="[{'priceUp' : priceUp}, {'priceDown' : priceDown}]">{{price}}</span>
                </template>
                <span v-if="isClosed || isSuspended" class="price">
                  <span class="price_title" v-if="isClosed">{{ $t('BetSlip.selection.isClosed') }}</span>
                  <span class="price_title" v-if="isSuspended">{{ $t('BetSlip.selection.isSuspended') }}</span>
                </span>
              </div>
            </div>
            <div class="event-name" >
              <span class="eventname" >
                <span class="name-lines">
                  <span class="name-line">{{wbr(eventName, 0)}}</span>
                  <span class="name-line">{{wbr(eventName, 1)}}</span>
                </span>
                <span class="isForBB" v-if="isForBB">
                  <icon name="icon-available-for-bb"></icon>
                </span>
                <span class="isLive" v-if="isLive" ><span >{{ $t('BetSlip.selection.isLive') }}</span></span>
              </span>
            </div>
            <div class="event-name pitcherNames"  v-if="brandKey=='circa' && pitcherNames">{{ $t('BetSlip.tab.RR.selection.pitcherNames', pitcherNames) }}</div>
            <div class="market-name">
              <span v-if="brandKey=='circa' && pitcherNames">{{selectionMarketName || derivativeMarketName}}
                <!--<span> {{ $t('BetSlip.tab.RR.selection.pitcherNames', pitcherNames) }}</span>-->
              </span>
              <span v-else>{{(market && market.name) || marketName}}</span>
            </div>
            <div class="eventTsStart market-name" v-if="showEventTsStart">
              <ts-start v-if="showEventTsStart" :tsstart="market.tsstartWithOffset || market.tsstart"></ts-start>
            </div>
          </div>
        </label>
      </div>

    </div>

    <listed-pitchers v-if="selection && selection.isPitcherSource && currentBetSlipState<=1"
         :tab="tab" :id="selection.idfoselection" :marketName="marketName" :currentBetSlipState="currentBetSlipState" ></listed-pitchers>
    <buy-points-option v-if="selection && selection.isBuyPointsSource && currentBetSlipState<=1"
          :tab="tab" :id="selection.idfoselection" :selection="selection" :currentBetSlipState="currentBetSlipState" ></buy-points-option>


    <!--id: {{id}}<br>-->
    <!--optedIn: {{optedIn[id]}}<br>-->
    <!--allowedBetTypesAndReturns: {{allowedBetTypesAndReturns}}<br>-->
    <!--selectionName: {{selectionName}} hcp: {{handicap}} ({{handicapValue}})<br>-->
    <!--marketName: {{marketName}}<br>-->
    <!--selectionMarketName: {{selectionMarketName}}<br>-->
    <!--derivativeMarketName: {{derivativeMarketName}}<br>-->
    <!--eventName: {{eventName}}<br>-->
    <!--canBePlacedAsSingle: {{canBePlacedAsSingle}}<br>-->
    <!--price: {{priceFormatted}} ({{priceValue}})<br>-->
    <!--idfomarket: {{idfomarket}}<br>-->
    <!--idfoevent: {{idfoevent}}<br>-->
    <!--handicap: {{handicap}}<br>-->
    <!--selection: {{selection}}<br>-->
    <!--csvavailablebettypes: {{selection.csvavailablebettypes}}<br>-->
    <!--<b>market:</b> {{market}}<br>-->
    <!--<b>marketLive:</b> {{marketLive}}<br>-->
    <!--<b>derivativeId:</b> {{derivativeId}}<br>-->
    <!--<b>isForSinglesOnly:</b> {{isForSinglesOnly}}<br>-->
    <!--<b>disableOptedIn:</b> {{disableOptedIn}}<br>-->
  </div>
</template>

<script>
//  import store from '@/store'
//  import config from '@/config'
  import selection from '@/components/sports/BetSlipV2/mixins/selection'
  import listedPitchers from '../derivatives/listedPitchers'
  import buyPointsOption from '../derivatives/buyPointsOption'
  import Icon from '@/components/common/Icon'

  export default {
    name: 'SelectionRR',

    mixins: [
      selection
    ],

    props: ['id', 'currentBetSlipState', 'tab', 'allowedBetTypesAndReturns'],

    components: {
      Icon,
      listedPitchers,
      buyPointsOption
    },

    data () {
      return {
      }
    },

    computed: {
      pricetype () {
        return this.selection && this.selection.priceTypePerBetType && this.selection.priceTypePerBetType.Multi
      },
      disableOptedIn () {
        return this.currentBetSlipState >= 1 || this.isForSinglesOnly
      },
      betslipLayout2 () {
        return window.ctsautoconf.BETSLIP_LAYOT_2 || false
      }
    },

    methods: {
      toggleOptedIn (sport) {
//        console.log('toggleOptedIn ' + this.tab)
        if (this.showCheckbox && this.currentBetSlipState === 0) {
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
  .selection {
    background-color: #fff;
    border: 2px solid #dadbdf !important;
    margin: 5px 0;
    padding: 8px 8px 6px;

    &.first {
      border-radius: 0 !important;
    }

    .event-name {
      line-height: 1;
      padding: 0px;
      background-color: #FFF;
      border-radius: 0;
      display: flex
      align-items: center
      color: #000;
      font-weight: bold;
      font-size: 14px;
      margin-bottom: 5px;

      .eventname {
        .name-lines {
        }
        .name-line {
          white-space: normal;
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
        margin-right: 15px
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

    .selection-name {
      /*display: inline-block;*/
      margin-top: -5px;
      .name {
        color: #152a47;
        font-size: 14px;
        padding-right: 7px;
        max-width: 230px;
        text-align: justify;
      }
    }
    .market-name {
      text-transform: uppercase;
      letter-spacing: 0;
      color: #818e95;
      margin-top: -2px;
    }
    .eventTsStart {
      margin-top: -2px;
      line-height: 18px;
    }

    .odds {
      font-weight: bold;
      color: #1493ff;
      font-size: 14px;
    }

    .float-right {
      float: right;
    }
    .btnX{
      margin: 0 0px 0 5px;
    }

    .columns {
      display: flex;
      clear: both;
      flex: 1
      align-items: center
    }
    .column-left {
      flex-grow: 0
      flex-basis: auto;
      margin-right: 12px
    }
    .column-right {
      display: block;
      flex: 1;
    }

    &.interRelated {
      .columns {
        margin-left: -4px;
      }
      border: 1px solid #0b4da1 !important;
    }
    &.interRelated.interRelated-1 {
      border-left-color: #1493ff;
    }
    &.interRelated.interRelated-2 {
      border-left-color: red;
    }
    &.interRelated.interRelated-3 {
      border-left-color: green;
    }
    &.interRelated.interRelated-4 {
      border-left-color: purple;
    }
    &.interRelated.interRelated-5 {
      border-left-color: orange;
    }
    &.interRelated.interRelated-6 {
      border-left-color: magenta;
    }
    &.interRelated.interRelated-7 {
      border-left-color: lime;
    }
    &.interRelated.interRelated-8 {
      border-left-color: navy;
    }

    .selection-price {
      color: #fff;
      background: #157cc1;
      padding 2px 5px;
      display: inline-block;
      float: right;
      font-size: 14px;
      min-width 30px;
      text-align: center;
      .lock {
        display: none;
      }
      &.pricetype-XP {
        background-color #ffcb4d
        color #000000
        padding 3px
        border-radius 2px
        display flex
        height 18px
        overflow: hidden
        .arrow {
          // background: url("~@/assets/images/icon/svg/boost.svg")
          background-size 12px 12px
          display flex
          width 12px
          height 12px
          margin-right 4px
          cursor default
          background-repeat no-repeat
          flex 1
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
      &.pricetype-XP:before{
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
</style>
