<template>
  <div>
    <div class="SGP" :class="[sgmPriceType]"
         v-show="(currentBetSlipState<1 || (betTypeStakes && betTypeStakes[eventId] && allowedBetTypesAndReturn && allowedBetTypesAndReturn.Price)) && !isAllSelectionsNotEliglible">
      <h2 class="header-PARLAY" >
        <span :class="'sgp-'+sgmPriceType+'-tag'"></span>
        <span>{{ $t('BetSlip.tab.title.SGP') }}</span>
        <span class="tm">&trade;</span>
        <span class="new-indicator" v-if="sgpMarkAsNew" >{{ $t('BetSlip.tab.title.SGP.new') }}</span>
      </h2>

      <div v-if="allowedBetTypes.length" >
        <div v-for="bt in allowedBetTypes"  >
          <bet-type-parlay
            :tab="tab"
            :bt="bt"
            :parlayTeamsNo="{ valid: combinableBetslipSelectionIds.length, invalid: notCombinableBetslipSelectionIds.length || notEligibleBetslipSelectionIds.length}"
            :sgmBetStatus="allowedBetTypesAndReturn.Status"
            :allowedBetTypesAndReturns="allowedBetTypesAndReturn"
            :gettingABTnR="gettingABTnR"
            :currentBetSlipState="currentBetSlipState"
            :isSGM="isSGM"
            :sgmPath="'XP.PerEvent'"
            :idfosporttype="idfosporttype"
            :sgmSelectionsMap="{validSGMselections:validSGMselections, hasInvalidSGMselections:hasInvalidSGMselections}"
          ></bet-type-parlay>
        </div>
      </div>




      <!--
      <div class="error-msg not-combinable top" v-show="notCombinableInfoVisible">
        <v-icon>info</v-icon>
        <div >{{ $t('BetSlip.tab.SGM.info.NoSGP' + (expanded ? '.expanded' : '') ) }}</div>
      </div>
      -->

      <div v-if="combinableBetslipSelectionIds.length || notCombinableBetslipSelectionIds.length || notEligibleBetslipSelectionIds.length">
        <div class="selections-heading" v-show="!(!expanded && (notCombinableBetslipSelectionIds.length || !allowedBetTypes.length))">
          <span>{{ $t('BetSlip.tab.SGM.heading.SGP.selections') }}</span>
        </div>
        <sgm-selection v-for="(selectionId, index) in combinableBetslipSelectionIds"
                            :class="['SGM-STATUS-' + legStatus(selectionId), 'SGM-selection-'+(index+1),
                          {'hidden': !expanded && (index>hideBreakpoint || notCombinableBetslipSelectionIds.length || !allowedBetTypes.length),
                          'hidden-breakpoint': !expanded && index==hideBreakpoint && (combinableBetslipSelectionIds.length+notCombinableBetslipSelectionIds.length)>showMoreIfNo}]"
                            :key="selectionId"
                            :id="selectionId"
                            :isSGM="isSGM"
                            :tab="tab"
                            :currentBetSlipState="currentBetSlipState"
                            :allowedMultiSingles="false"
                            :allowedBetTypesAndReturns="{}"
                            :sgmPriceType="'SGM'"
                       @removeSelection="removeSelection"
        >
        </sgm-selection>

        <div class="error-msg not-combinable"
             v-show="currentBetSlipState<1 && notCombinableBetslipSelectionIds.length && !(!expanded && !allowedBetTypes.length)"
             :class="{top:!combinableBetslipSelectionIds.length || !expanded}"  >
          <v-icon>info_outline</v-icon>
          <div >
            <span>{{ $t('BetSlip.tab.SGM.info.' + (validSGMselections ? 'SOME.' : '') + 'NOT_COMBINABLE' + (expanded ? '.expanded' : '')) }}</span>
            <div class="SGM-status-error" v-if="sgpShowProviderDetailedError && allowedBetTypesAndReturn && allowedBetTypesAndReturn.ErrorMessage">{{allowedBetTypesAndReturn.ErrorMessage}}</div>
          </div>

        </div>

        <sgm-selection v-for="(selectionId, index) in notCombinableBetslipSelectionIds" v-show="currentBetSlipState<1"
                            :class="['SGM-STATUS-' + legStatus(selectionId), 'SGM-selection-'+(index+combinableBetslipSelectionIds.length+1),
                          {'hidden': !expanded && ((index+combinableBetslipSelectionIds.length)>hideBreakpoint || notCombinableBetslipSelectionIds.length),
                          'hidden-breakpoint': !expanded && (index+combinableBetslipSelectionIds.length)==hideBreakpoint && (combinableBetslipSelectionIds.length+notCombinableBetslipSelectionIds.length)>showMoreIfNo}]"
                            :key="'Not-Combinable-'+selectionId"
                            :id="selectionId"
                            :isSGM="isSGM"
                            :tab="tab"
                            :currentBetSlipState="currentBetSlipState"
                            :allowedMultiSingles="false"
                            :allowedBetTypesAndReturns="{}"
                            :sgmPriceType="'SGM'"
                       @removeSelection="removeSelection"
        >
        </sgm-selection>

        <div class="error-msg not-combinable not-eligible"
             v-show="currentBetSlipState<1 && notEligibleBetslipSelectionIds.length && (expanded || (!expanded && !notCombinableBetslipSelectionIds.length))"
             :class="{top:!notEligibleBetslipSelectionIds.length || !expanded}"  >
          <v-icon>info</v-icon>
          <div >{{ $t('BetSlip.tab.SGM.info.' + (validSGMselections ? 'SOME.' : '') + 'NOT_ELIGIBLE' + (expanded ? '.expanded' : ''), {n:notEligibleBetslipSelectionIds.length,
              s: notEligibleBetslipSelectionIds.length > 1 ? 's' : ''}) }}
          </div>
        </div>
        <sgm-selection v-for="(selectionId, index) in notEligibleBetslipSelectionIds" v-show="currentBetSlipState<1"
                            :class="['SGM-STATUS-' + legStatus(selectionId),
                          'SGM-selection-'+(index+combinableBetslipSelectionIds.length+notCombinableBetslipSelectionIds.length+1),
                          {'hidden': !expanded && ((index+combinableBetslipSelectionIds.length+notCombinableBetslipSelectionIds.length)>hideBreakpoint || notEligibleBetslipSelectionIds.length),
                          'hidden-breakpoint': !expanded && (index+combinableBetslipSelectionIds.length+notCombinableBetslipSelectionIds.length)==hideBreakpoint &&
                              (combinableBetslipSelectionIds.length+notCombinableBetslipSelectionIds.length+notEligibleBetslipSelectionIds.length)>showMoreIfNo}]"
                            :key="'Not-Combinable-'+selectionId"
                            :id="selectionId"
                            :isSGM="isSGM"
                            :tab="tab"
                            :currentBetSlipState="currentBetSlipState"
                            :allowedMultiSingles="false"
                            :allowedBetTypesAndReturns="{}"
                            :sgmPriceType="'SGM'"
                            @removeSelection="removeSelection"
        >
        </sgm-selection>

      </div>

      <a @click="toggleExpanded()" class="toggleExpanded"
         v-if="currentBetSlipState<1 && (notCombinableBetslipSelectionIds.length || notEligibleBetslipSelectionIds.length || combinableBetslipSelectionIds.length>showMoreIfNo)">
        <span v-if="expanded" class="btn-expanded less"><span>{{ $t('BetSlip.tab.SGM.show.less') }}</span></span>
        <span v-if="!expanded" class="btn-expanded more"><span>{{ $t('BetSlip.tab.SGM.show.more') }}</span></span>
      </a>

      <!--expanded: {{expanded}}<br>-->
      <!--tab: {{tab}}<br>-->
      <!--currentBetSlipState: {{currentBetSlipState}}<br>-->
      <!--isSGM: {{isSGM}}<br>-->
      <!--idfosporttype: {{idfosporttype}}<br>-->
      <!--allowedBetTypesAndReturn: {{allowedBetTypesAndReturn.Status}}<br>-->
      <!--betslipSelectionIds: {{betslipSelectionIds}}<br>-->
      <!--combinableBetslipSelectionIds: {{combinableBetslipSelectionIds}}<br>-->
      <!--notCombinableBetslipSelectionIds: {{notCombinableBetslipSelectionIds}}<br>-->
      <!--notEligibleBetslipSelectionIds: {{notEligibleBetslipSelectionIds}}<br>-->
<!--      allowedBetTypesAndReturn: {{allowedBetTypesAndReturn}}<br>-->
      <!--betTypeStakes: {{betTypeStakes}}<br>-->
      <!--this.allowedBetTypesAndReturn.Legs: {{this.allowedBetTypesAndReturn.Legs}}<br>-->
      <!--selectionStatusMap: {{selectionStatusMap}}<br>-->

    </div>
  </div>
</template>

<script>
  //  import Vue from 'vue'
  import store from '@/store'
  import sgmSelection from '../selections/selectionSGM.vue'
//  import selectionRegular from '../../selections/selectionRegular.vue'
  import betTypeParlay from '../betTypes/betTypeParlay.vue'
  import Icon from '@/components/common/Icon'
  import priceFormat from '@/library/priceFormat'

  export default {
    name: 'SGP',
    props: ['tab', 'eventId', 'currentBetSlipState', 'allowedBetTypesAndReturn', 'gettingABTnR'],

    components: {
      sgmSelection,
      betTypeParlay,
      Icon
    },

    data () {
      return {
        expanded: false,
        notCombinableInfoVisible: false
      }
    },

    computed: {
      hideBreakpoint () {
        return store.getters['sbBetslipState/sgpSelectionHideBreakpoint']
      },
      showMoreIfNo () {
        return this.hideBreakpoint + 1
      },
      legs () {
        let legs = []
        for (var i = 0; i < this.allowedBetTypesAndReturn.Legs.length; i++) {
          legs.push(this.allowedBetTypesAndReturn.Legs[i].Selection)
        }
        return legs
      },
      isAllSelectionsNotEliglible () {
        return this.legs.every(selection => this.notEligibleBetslipSelectionIds.includes(selection))
      },
      isSGM () {
//        console.log('isSGM')
        var i = 0
        let isSGM = false
        let market = {}
        var checkIsSgm = function (src) {
          let id = null
          if (src && src.length) {
            for (i = 0; i < src.length; i++) {
              id = src[i]
              market = store.getters['sbBetslipState/getStoredMarketById'](id) || {}
              if (market && market.eventname) {
                break
              }
            }
          }
          return id && market ? market.eventname : false
        }
        //
        isSGM = checkIsSgm(this.combinableBetslipSelectionIds)
        if (!isSGM) {
          isSGM = checkIsSgm(this.notCombinableBetslipSelectionIds)
        }
        if (!isSGM) {
          isSGM = checkIsSgm(this.notEligibleBetslipSelectionIds)
        }
//        console.log('isSGM: ' + isSGM)
        return isSGM
      },
      allowedBetTypes () {
        return [{IDFOBetType: 'SGP'}]
//        return this.allowedBetTypesPRL
      },
      betType () {
        return this.allowedBetTypesAndReturn
      },
      id () {
        return this.allowedBetTypesAndReturn &&
          this.allowedBetTypesAndReturn.Legs &&
          this.allowedBetTypesAndReturn.Legs[0] &&
          this.allowedBetTypesAndReturn.Legs[0].Selection
      },
      betslipSelectionIds () {
        return store.getters['sbBetslipState/betslipSelectionIds']
      },
      idfomarket () {
        return this.id && store.getters['sbBetslipState/getIdfoMarketById'](this.id)
      },
      market () {
        return this.id ? store.getters['sbBetslipState/getStoredMarketById'](this.id) ||
          store.getters['sbBetslipState/getStoredMarketById'](store.getters['sbBetslipState/getSourceIdForDerivedSelection'](this.id)) : {}
      },
      idfosporttype () {
        return (this.market && this.market.idfosporttype) || ''
      },
      sportname () {
        return (this.market && this.market.sportname) || ''
      },
      liveSelections () {
        return store.getters['sbBetslipState/liveSelections']
      },
      selectionStatusMap () {
//        console.log('selectionStatusMap')
        let self = this
        let map = {
          combinableBetslipSelectionIds: [],
          notCombinableBetslipSelectionIds: [],
          notEligibleBetslipSelectionIds: []
        }
        if (this.allowedBetTypesAndReturn &&
          this.allowedBetTypesAndReturn.Legs &&
          this.allowedBetTypesAndReturn.Legs.length &&
          this.betslipSelectionIds && this.betslipSelectionIds.length) {
          this.betslipSelectionIds.forEach(function (id) {
            let sourceSelection = false
            let leg = self.allowedBetTypesAndReturn.Legs.find(function (l) {
              if (l.Selection === id) {
                return true
              }
              sourceSelection = store.getters['sbBetslipState/getSourceIdForDerivedSelection'](l.Selection)
              if (sourceSelection && sourceSelection === id) {
                return true
              }
              sourceSelection = false
              return false
              // return l.Selection === id || store.getters['sbBetslipState/getSourceForDerivedSelection'](l.Selection) === id
            })
            // this.allowedBetTypesAndReturn.Legs.forEach(function (leg) {
            if (leg) {
              let legId = sourceSelection || leg.Selection
//              let legId = leg.Selection
              switch (leg.Status) {
                case 'OK':
                  map.combinableBetslipSelectionIds.push(legId)
                  break
                case 'NOT_ELIGIBLE':
                  map.notEligibleBetslipSelectionIds.push(legId)
                  break
                case 'NOT_CALCULATED':
                  map.notEligibleBetslipSelectionIds.push(legId)
                  break
                case 'NOT_COMBINEABLE':
                  map.notCombinableBetslipSelectionIds.push(legId)
                  break
                case 'UNKNOWN_ERROR':
                  map.notCombinableBetslipSelectionIds.push(legId)
                  break
                default:
                  map.notCombinableBetslipSelectionIds.push(legId)
//                  map.combinableBetslipSelectionIds.push(legId)
                  break
              }
            }
          })
        }
        return map
      },
      combinableBetslipSelectionIds () {
        return this.selectionStatusMap.combinableBetslipSelectionIds || []
      },
      notCombinableBetslipSelectionIds () {
        return this.selectionStatusMap.notCombinableBetslipSelectionIds || []
      },
      notEligibleBetslipSelectionIds () {
        return this.selectionStatusMap.notEligibleBetslipSelectionIds || []
      },
      betTypeStakes () {
        let betTypeStakes = store.getters['sbBetslipState/betTypeStakes']
        return betTypeStakes && betTypeStakes.XP && betTypeStakes.XP.PerEvent
      },
      sgpMarkAsNew () {
        return store.getters['sbBetslipState/sgpMarkAsNew']
      },
      validSGMselections () {
        return (this.selectionStatusMap && this.selectionStatusMap.combinableBetslipSelectionIds && this.selectionStatusMap.combinableBetslipSelectionIds.length) || 0
      },
      hasInvalidSGMselections () {
        return this.selectionStatusMap &&
          ((this.selectionStatusMap.notCombinableBetslipSelectionIds && this.selectionStatusMap.notCombinableBetslipSelectionIds.length) ||
          (this.selectionStatusMap.notEligibleBetslipSelectionIds && this.selectionStatusMap.notEligibleBetslipSelectionIds.length))
      },
      sgmPriceType () {
        return this.isSGM && this.allowedBetTypesAndReturn && this.allowedBetTypesAndReturn.IDFOPriceType
      },
      sgpShowProviderDetailedError () {
        return store.getters['sbBetslipState/sgpShowProviderDetailedError']
      }
    },

    methods: {
      // parlay indicator in: src\components\layout\parts\BottomNavigation.vue: showParlayMsg ()
      checkLive (selection) {
        return this.liveSelections && this.liveSelections.indexOf(selection) >= 0
      },
      removeSelection (s) {
        console.log('removeSelection: ' + s)
//        this.$emit('removeSelection', s)
        store.dispatch('sbBetslipState/toggleBetslipSelection', [s, null, true])
      },
      updateSelected (id) {
//        console.log('updateSelected: ' + id)
      },
      toggleExpanded () {
        this.expanded = !this.expanded
      },
      checkNotCombinableInfoVisible () {
//        this.notCombinableInfoVisible = (!this.allowedBetTypes.length && !this.gettingABTnR) || (!this.betslipSelectionIds.length && this.notCombinableBetslipSelectionIds.length)
        this.notCombinableInfoVisible = !this.gettingABTnR && (!this.betslipSelectionIds.length && this.notCombinableBetslipSelectionIds.length)
      },
      formatOdds (bt) {
        if (!(bt && bt.Price)) {
          return ''
        }
        var formatted = priceFormat.formatOdds(bt.Price)
        return formatted
      },
      legStatus (id) {
//        console.log('legStatus')
        var leg = this.allowedBetTypesAndReturn.Legs.find(function (leg) {
          return leg.Selection === id
        })
        return leg && leg.Status
      }
    },

    created () {
    },

    mounted () {
    },

    watch: {
      gettingABTnR (newVal) {
        if (!newVal) {
          this.checkNotCombinableInfoVisible()
        }
      }
    },

    destroyed () {
    }
  }
</script>

<style lang="stylus" scoped>
  @import "~@/css/config"

  .SGP {
    background-color: transparent;
    padding: 0px 0 4px 0;
    margin: 0 0px 7px;

    .price {
      color: #1493ff;
      display: none;
      float: right;
      font-size: 14px;
    }
    h2 {
      font-weight: bold;
      display block;
      padding-right: 10px;
      span {
        padding: 10px 3px;
      }
      .formated-price {
        color: #1493ff;
        display: inline-block;
        float: right;
        font-size: 14px;
      }
      .event-name {
        display: inline-block;
        line-height: 0;
        vertical-align: middle;
      }
    }
    .empty-parlay-heading {
      font-weight: bold;
      padding: 0;
      font-size: 14px;
      margin-top: -10px;
      .SGM-selections-heading {
        font-size: 12px;
        color: #818e95;
        text-transform: uppercase;
        padding 0 3px
        font-weight normal
        span {
          padding 0 3px
        }
      }
    }
    .selections-heading {
      color: #818e95;
      text-transform: uppercase;
      padding: 2px 12px 0;
    }
    .toggleExpanded {
      display: block;
      text-align: center;
      font-size: 14px;
      padding: 6px;
      /*margin: 5px 0 -4px 0;*/
      color: #0f89f1;
      border-top: 1px solid #CCC
    }

    .error-msg {
      display: flex
      padding: 10px
      /*margin: 7px 12px 0*/
      background-color: rgba(228, 66, 66, 0.1)
      color: #DB3F3F
      font-weight: normal
      text-transform: uppercase
      text-align: left
      font-size: 12px
      line-height: 14px
      align-items: center
      justify-content: left
      &.top {
        /*margin: 2px 0px 0*/
      }
      .SGM-status-error {
        text-transform: none
        padding-top: 2px
      }
  >>>.v-icon {
       color red
       margin-right 6px
       align-self: flex-start;
     }
  }
  .btn-expanded:after {
    content: "";
    display: inline-block;
    position: relative;
    width: 20px;
    height: 20px;
    line-height: 20px;
    font-size: 23px;
    font-weight: bold;
    top: 4px;
    background-repeat no-repeat
    background: transparent url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTgiIGhlaWdodD0iMTgiIHZpZXdCb3g9IjAgMCAxOCAxOCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTkuMzcyOTcgMC4xNTQ4NTNDOS4xNjY1IC0wLjA1MTYxNzYgOC44MzA4NSAtMC4wNTE2MTc2IDguNjI0MzggMC4xNTQ4NTNMNC43NjM5MSA0LjAxNTMyTDAuOTAzNDQxIDAuMTU0ODUzQzAuNjk2OTcxIC0wLjA1MTYxNzYgMC4zNjEzMjQgLTAuMDUxNjE3NiAwLjE1NDg1MyAwLjE1NDg1M0MtMC4wNTE2MTc2IDAuMzYxMzI0IC0wLjA1MTYxNzYgMC42OTY5NzEgMC4xNTQ4NTMgMC45MDM0NDFMNC4zOTAxNSA1LjEzODczQzQuNDkzOTEgNS4yNDI1IDQuNjI5NDQgNS4yOTMzMiA0Ljc2NDk3IDUuMjkzMzJDNC45MDA1IDUuMjkzMzIgNS4wMzYwMyA1LjI0MTQ0IDUuMTM5NzkgNS4xMzg3M0w5LjM3NTA5IDAuOTAzNDQxQzkuNTc5NDQgMC42OTY5NzEgOS41Nzk0NCAwLjM2MjM4MiA5LjM3Mjk3IDAuMTU0ODUzWiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoNC4yMzUzNSA2LjM1MjU0KSIgZmlsbD0iIzIzOTZGQyIvPgo8L3N2Zz4K") center center no-repeat;
    -moz-transform: scale(1, -1);
    -webkit-transform: scale(1, -1);
    -o-transform: scale(1, -1);
    -ms-transform: scale(1, -1);
    transform: scale(1, -1);
    /*color: transparent !important;*/
    padding: 0;

  }
  .btn-expanded.more:after {
    -moz-transform: scale(1, 1);
    -webkit-transform: scale(1, 1);
    -o-transform: scale(1, 1);
    -ms-transform: scale(1, 1);
    transform: scale(1, 1);
    /*top: 6px;*/
  }
  .header-PARLAY {
    span {
      padding: 7px 4px;
    }
    .tm {
      padding-left 0px;
    }
    display: flex;
    background-color #fff
    border 1px solid #ccc
    padding 0
    border-bottom-left-radius 0
    border-bottom-right-radius 0
    margin: 0 -1px;
    .sgp-SGM-tag {
      background url("~@/assets/images/icon/svg/sgp-SGM-tag.svg")
      width: 34px;
      height: 17px;
      margin-right: 0px;
      background-repeat: no-repeat;
      display: inline-block;
    }
    .new-indicator {
      display inline-block !important
      text-transform uppercase
      font-size 12px
      letter-spacing 1px
      background-color #ffcb4d
      padding 2px 4px
      margin-left 4px
      margin-top 2px
      font-weight normal
      color #244368
      line-height normal
      border-radius 1px
      span {
        padding 0
      }
    }
  }
  }
</style>
