<template>
  <div class="selection" v-if="idFoSelection"
       :class="[tab,
       interRelatedTeaser ? 'interRelated-' + interRelatedTeaser : '',
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
       interRelated: interRelatedTeaser,
       mixedTeasers: mixedTeasers
   }]">

    <div class="columns">
      <div class="column column-left" >
        <v-checkbox v-if="showCheckbox === true" type="checkbox"
                    :id="id.toString()"
                    :value="optedIn[id]"
                    :disabled="currentBetSlipState>=1"
                    v-model="optedIn[id]"
                    @change="updateOptedIn(id)">
        </v-checkbox>
        <template  v-if="!showCheckbox">
          <icon v-if="mixedTeasers" :colorName="'blue'" :name="'icon-' + (selection.idfosporttype && selection.idfosporttype.split(' ').join(''))"></icon>
          <span v-if="!mixedTeasers" class="igt-icon" ></span>
        </template>
      </div>
      <!-- BETSLIP LAYOUT 1 -->
      <div v-if="!betslipLayout2" class="column column-right" @click="toggleOptedIn()" >
        <label :for="id">
          <div class="selection-data">
            <div class="event-name-inner" >
              <div class="event-name" :class="{mixedTeasers:mixedTeasers}" >
                <span class="eventname" >
                <span >{{wbr(eventName, 0)}}</span>
                <span >{{wbr(eventName, 1)}}</span>
              </span>
                <span class="isLive" v-if="isLive" ><span >{{ $t('BetSlip.selection.isLive') }}</span></span>
              </div>
            </div>
            <div class="selection-name">
              <span class="name">
                <!--<b>[{{id}}]</b>-->
                {{ selectionName }}
                <span v-if="selection && typeof selection.currenthandicap == 'number'" class="currenthandicap"  :class="[{'hcpUp' : hcpUp}, {'hcpDown' : hcpDown}]">
                  <span>{{handicap}}</span>
                </span>
                <!--<span v-if="isForBB" class="available-for-bb"></span>-->
              </span>
              <div class="teaser-hcp float-right" :class="'pricetype-'+pricetype">
                <!--<span class="arrow-blue" v-if="isOddsBoost(selection)"> </span>-->
                <span :class="[{'hcpUp' : hcpUp}, {'hcpDown' : hcpDown}]" class="currenthandicapT" >
                   {{teaserHCP}}
                </span>
              </div>
            </div>
            <div class="market-name">{{marketName}}</div>
            <div class="eventTsStart market-name" v-if="showEventTsStart">
              <ts-start v-if="showEventTsStart" :tsstart="market.tsstartWithOffset || market.tsstart"></ts-start>
            </div>
          </div>
        </label>
      </div>
      <!-- BETSLIP LAYOUT 2 -->
      <div v-if="betslipLayout2" class="column column-right" @click="toggleOptedIn()" >
        <label :for="id">
          <div class="selection-data">
            <div class="selection-name">
              <span class="name">
                <!--<b>[{{id}}]</b>-->
                {{ selectionName }}
                <span v-if="selection && typeof selection.currenthandicap == 'number'" class="currenthandicap"  :class="[{'hcpUp' : hcpUp}, {'hcpDown' : hcpDown}]">
                  <span>{{handicap}}</span>
                </span>
                <!--<span v-if="isForBB" class="available-for-bb"></span>-->
              </span>
              <div class="teaser-hcp float-right" :class="'pricetype-'+pricetype">
                <!--<span class="arrow-blue" v-if="isOddsBoost(selection)"> </span>-->
                <span :class="[{'hcpUp' : hcpUp}, {'hcpDown' : hcpDown}]" class="currenthandicapT" >
                   {{teaserHCP}}
                </span>
              </div>
            </div>
            <div class="event-name-inner" >
              <div class="event-name" :class="{mixedTeasers:mixedTeasers}" >
                <span class="eventname" >
                <span >{{wbr(eventName, 0)}}</span>
                <span >{{wbr(eventName, 1)}}</span>
              </span>
                <span class="isLive" v-if="isLive" ><span >{{ $t('BetSlip.selection.isLive') }}</span></span>
              </div>
            </div>
            <div class="market-name">{{marketName}}</div>
            <div class="eventTsStart market-name" v-if="showEventTsStart">
              <ts-start v-if="showEventTsStart" :tsstart="market.tsstartWithOffset || market.tsstart"></ts-start>
            </div>
          </div>
        </label>
      </div>

    </div>

    <!--<br>id: {{id}}-->
    <!--<br>idFoSelection: {{idFoSelection}}-->
    <!--<br>teaserSelection: {{teaserSelection}}-->
    <!--<br>optedIn: {{optedIn}}-->
    <!--optedIn: {{optedIn}}<br>-->
    <!--allowedBetTypesAndReturns: {{allowedBetTypesAndReturns}}<br>-->
    <!--selectionName: {{selectionName}} hcp: {{handicap}} ({{handicapValue}})<br>-->
    <!--marketName: {{marketName}}<br>-->
    <!--eventName: {{eventName}}<br>-->
    <!--canBePlacedAsSingle: {{canBePlacedAsSingle}}<br>-->
    <!--price: {{priceFormatted}} ({{priceValue}})<br>-->
    <!--idfomarket: {{idfomarket}}<br>-->
    <!--idfoevent: {{idfoevent}}<br>-->
    <!--handicap: {{handicap}}<br>-->
    <!--selection: {{selection}}<br>-->
    <!--<b>market:</b> {{market}}<br>-->
    <!--<b>marketLive:</b> {{marketLive}}<br>-->
    <!--<b>isInterRelated:</b> {{isInterRelated}}<br>-->
    <!--<b>interRelatedTeaser:</b> {{interRelatedTeaser}}<br>-->
  </div>
</template>

<script>
  import store from '@/store'
//  import config from '@/config'
  import hcpFormat from '@/library/hcpFormat'
  import selection from '@/components/sports/BetSlipV2/mixins/selection'
  import Icon from '@/components/common/Icon'

  export default {
    name: 'SelectionTeaser',

    mixins: [
      selection
    ],

    props: ['id', 'currentBetSlipState', 'tab', 'allowedBetTypesAndReturns', 'activeTeaser', 'interRelatedTeaser', 'mixedTeasers'],

    components: {
      Icon
    },

    data () {
      return {
      }
    },

    computed: {
      teaserSelection () {
        return this.id ? store.getters['sbBetslipState/teaserSelection'](this.activeTeaser, this.id) : {}
      },
      teaserHCP () {
        return this.id && this.teaserSelection && hcpFormat.formatHandicap(this.teaserSelection, true)
      },
      pricetype () {
        return this.selection && this.selection.priceTypePerBetType && this.selection.priceTypePerBetType.Multi
      },
      betslipLayout2 () {
        return window.ctsautoconf.BETSLIP_LAYOT_2 || false
      }
    },

    methods: {
      wbr (input, id) {
        var i
        var separator
        var separators = ['@', 'v', 'V', 'vs', 'VS', 'Vs', 'At', 'at', 'v.', 'V.', 'vs.', 'VS.', 'Vs.', '-']
        var parts = []
        for (i = 0; i < separators.length; i++) {
          separator = separators[i]
          parts = input ? input.split(' ' + separator + ' ') : []
          if (parts.length === 2) {
            parts[0] += ' ' + separator + ' '
            break
          }
        }
        return parts[id] || ''
      },
      toggleOptedIn (sport) {
        console.log('toggleOptedIn ' + this.tab)
        if (this.showCheckbox && this.currentBetSlipState === 0) {
          this.optedIn[this.id] = this.disableOptedIn ? false : !this.optedIn[this.id]
          this.updateOptedIn(0)
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
    /*border-radius: 5px;*/
    margin: 5px 0;
    padding: 8px 10px 6px;

    .event-name {
      line-height: 1;
      padding: 0px;
      /*background-color: #F0F3F8;*/
      background-color: #FFF;
      border-radius: 0;
      /*border-bottom-width: 1px;*/
      display: flex
      align-items: center
      color: #000;
      font-size: 14px;
      margin-bottom: 5px;
      margin-left: -15px;

      &.mixedTeasers {
        margin-left: 0px;
      }

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

    .odds, .teaser-hcp {
      background-color: #157cc1
      color: #fff;
      padding: 2px 5px;
      font-size: 14px;
      min-width 30px;
      text-align:center;
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
  }
.selection.interRelated
  border 1px solid #0b4da1 !important
</style>
