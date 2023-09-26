<template>
  <div class="tab-REGULAR">
    <!-- Betslip regular layout -->
    <template v-if="!betslipLayout2">
      <div class="PARLAYS" v-if="betsNo>1">
        <!--<h2 class="header-PARLAY" v-show="currentBetSlipState<=1 || parlayStake || sgpStake">-->
          <!--<span>{{ $t('BetSlip.tab.title.PARLAY') }}</span>-->
        <!--</h2>-->

        <div v-if="activeSelectionsNo>1 && allowedBetTypesAndReturns.PerBetType.A">
          <bet-type-parlay v-if="currentBetSlipState<=1 || parlayStake"
                :key="'A'"
                :id="'A'"
                :currentBetSlipState="currentBetSlipState"
                :tab="tab"
                :allowedBetTypesAndReturns="allowedBetTypesAndReturns.PerBetType.A"
                :gettingABTnR="gettingABTnR"
          ></bet-type-parlay>
        </div>
        <div v-if="activeSelectionsNo>1 && showParlayInfoMsg && currentBetSlipState<=1 && !allowedBetTypesAndReturns.PerBetType.A && (!isSGMenabled || (isSGMenabled && !hasSGM))">
          <div class="msg info all_corners NoParlayAvailable"
              :class="{'interRelated':hasActiveInteRelated, 'NotAllSelectionsCombinableInParlay':!allSelectionsCombinableInParlay}" >
            <v-icon>info_outline</v-icon>
            <span v-if="hasActiveInteRelated && allSelectionsCombinableInParlay">{{ $t('BetSlip.tab.PARLAY.info.interRelated') }}</span>
            <span v-else>{{ $t('BetSlip.tab.PARLAY.info.notAvailable') }}</span>
          </div>
        </div>

        <div v-if="isSGMenabled && betsNo >= 2 && hasSGM">
          <sgm :betsNo="betsNo"
               :tab="'SGM'"
               :allowedBetTypesAndReturns="allowedBetTypesAndReturnsXP"
               :currentBetSlipState="currentBetSlipState"
               :gettingABTnR="gettingABTnR"
          >
          </sgm>
        </div>

      </div>
      <div class="STRAIGHTS" v-if="betsNo">
        <div class="header-SING" :class="{focused:focus[0], 'non-empty':!!multiSinglesStake}" v-if="currentBetSlipState<=1 || parlayStake || singlesStakes.length" >
          <h2 :key="betsNo">{{ $t('BetSlip.tab.title.SINGLE' + (betsNo>1?'S':'')) }}</h2>

          <span class="stakeAll" v-if="wagerAllSingles"  v-show="betsNo>1 && currentBetSlipState<1" >
            <span class="multiSinglesStake">
              <money-input v-model="multiSinglesStake"
                          :id="1"
                          :placeholder="$t('BetSlip.single.wagerAll')"
                          :disabled="currentBetSlipState>=1"
                          :focus="focus"
                          :className="'input-only'"
                          @setFocus="setFocus"
                          @dismissError="dismissError"
              ></money-input>
            </span>
          </span>
        </div>
        <selection-regular v-for="id in betslipSelectionIds" v-if="currentBetSlipState<=1 || betTypeStakes.PerSelection[id] || parlayStake"
                          :key="id"
                          :id="id"
                          :currentBetSlipState="currentBetSlipState"
                          :tab="tab"
                          :allowedBetTypesAndReturns="allowedBetTypesAndReturns.PerSelection"
                          :parlayStake="parlayStake"
                          :betsNo="betsNo"
                          :allowedMultiSingles="allowedMultiSingles"
        ></selection-regular>
      </div>
    </template>
     <!-- Betslip layout 2 -->
    <template v-if="betslipLayout2">
    <div class="STRAIGHTS" v-if="betsNo">
      <selection-regular v-for="id in betslipSelectionIds" v-if="currentBetSlipState<=1 || betTypeStakes.PerSelection[id] || parlayStake"
                         :key="id"
                         :id="id"
                         :currentBetSlipState="currentBetSlipState"
                         :tab="tab"
                         :allowedBetTypesAndReturns="allowedBetTypesAndReturns.PerSelection"
                         :parlayStake="parlayStake"
                         :betsNo="betsNo"
                         :allowedMultiSingles="allowedMultiSingles"
      ></selection-regular>
    </div>
    <div class="PARLAYS" v-if="betsNo>1">
      <!--<h2 class="header-PARLAY" v-show="currentBetSlipState<=1 || parlayStake || sgpStake">-->
        <!--<span>{{ $t('BetSlip.tab.title.PARLAY') }}</span>-->
      <!--</h2>-->
      <div v-if="isSGMenabled && betsNo >= 2 && hasSGM">
        <sgm :betsNo="betsNo"
             :tab="'SGM'"
             :allowedBetTypesAndReturns="allowedBetTypesAndReturnsXP"
             :currentBetSlipState="currentBetSlipState"
             :gettingABTnR="gettingABTnR"
             >
        </sgm>
      </div>
      <div v-if="activeSelectionsNo>1 && allowedBetTypesAndReturns.PerBetType.A">
        <bet-type-parlay v-if="currentBetSlipState<=1 || parlayStake"
               :key="'A'"
               :id="'A'"
               :currentBetSlipState="currentBetSlipState"
               :tab="tab"
               :allowedBetTypesAndReturns="allowedBetTypesAndReturns.PerBetType.A"
               :gettingABTnR="gettingABTnR"
        ></bet-type-parlay>
      </div>
      <div v-if="activeSelectionsNo>1 && showParlayInfoMsg && currentBetSlipState<=1 && !allowedBetTypesAndReturns.PerBetType.A && (!isSGMenabled || (isSGMenabled && !hasSGM))">
        <div class="msg info all_corners NoParlayAvailable"
             :class="{'interRelated':hasActiveInteRelated, 'NotAllSelectionsCombinableInParlay':!allSelectionsCombinableInParlay}" >
          <v-icon>info_outline</v-icon>
          <span v-if="hasActiveInteRelated && allSelectionsCombinableInParlay">{{ $t('BetSlip.tab.PARLAY.info.interRelated') }}</span>
          <span v-else>{{ $t('BetSlip.tab.PARLAY.info.notAvailable') }}</span>
        </div>
      </div>
    </div>
    </template>

    <!--Regular Tab allowedBetTypesAndReturns: {{allowedBetTypesAndReturns}}<br>-->
    <!--betsNo: {{betsNo}}<br>-->
    <!--activeSelectionsNo: {{activeSelectionsNo}}<br>-->
    <!--parlayStake: {{parlayStake}}<br>-->
    <!--betTypeStakes: {{betTypeStakes}}<br>-->
    <!--betTypeStakesXP: {{betTypeStakesXP}}<br>-->
    <!--singlesStakes: {{singlesStakes}}<br>-->
    <!--interRelated: {{interRelated}}<br>-->
    <!--interRelatedPerTab: {{interRelatedPerTab}}<br>-->
    <!--interRelatedLen: {{interRelatedLen}}<br>-->
    <!--hasActiveInteRelated: {{hasActiveInteRelated}}<br>-->
    <!--multiSinglesStake: {{multiSinglesStake}}-->
    <!--isSGMenabled: {{isSGMenabled}}<br>-->
    <!--hasSGM: {{hasSGM}}<br>-->
    <!--showParlayInfoMsg: {{showParlayInfoMsg}}<br>-->

<!--    Tab Regular allowedBetTypesAndReturnsXP: {{allowedBetTypesAndReturnsXP}}<br>-->
    <!--allSelectionsCombinableInParlay: {{allSelectionsCombinableInParlay}}<br>-->
  </div>
</template>

<script>
  import Vue from 'vue'
  import store from '@/store'
  import selectionRegular from '../../selections/selectionRegular.vue'
  import betTypeParlay from '../../betTypes/betTypeParlay.vue'
  import moneyInput from '../../common/moneyInput'
  import sgm from '../../SGM/SGM.vue'
  import Icon from '@/components/common/Icon'

  export default {
    name: 'TabRegular',

    mixins: [
    ],

    props: ['tab', 'betsNo', 'currentBetSlipState', 'allowedBetTypesAndReturns', 'betTypeStakes', 'gettingABTnR', 'interRelated', 'allowedMultiSingles', 'allowedBetTypesAndReturnsXP', 'betTypeStakesXP'],

    components: {
      selectionRegular,
      betTypeParlay,
      moneyInput,
      sgm,
      Icon
    },

    data () {
      return {
        showParlayInfoMsg: false,
        focus: [0]
      }
    },

    computed: {
      betslipLayout2 () {
        return window.ctsautoconf.BETSLIP_LAYOT_2 || false
      },
      betslipSelectionIds () {
        return store.getters['sbBetslipState/betslipSelectionIds']
      },
      optedIn () {
        return store.getters['sbBetslipState/optedIn'][this.tab]
      },
      activeSelectionsNo () {
        var c = 0
        for (var i in this.optedIn) {
          c += this.optedIn[i] ? 1 : 0
        }
        return c
      },
      wagerAllSingles () {
        return store.getters['sbBetslipState/wagerAllSingles']
      },
      parlayStake () {
        return this.allowedBetTypesAndReturns &&
          this.allowedBetTypesAndReturns.PerBetType &&
          this.allowedBetTypesAndReturns.PerBetType.A &&
          this.betTypeStakes && this.betTypeStakes.PerBetType && this.betTypeStakes.PerBetType.A
      },
      isSGMenabled () {
        return store.getters['sbBetslipState/isSGMenabled']
      },
      /*
      sgpStake () {
       console.log('sgpStake - TODO - if required')
        var stake = false
        if (!this.isSGMenabled) {
          return false
        }
        return stake
      },
      */
      singlesStakes () {
        var singlesStakes = []
        if (this.betTypeStakes && this.betTypeStakes.PerSelection) {
          for (var i in this.betTypeStakes.PerSelection) {
            if (this.betTypeStakes.PerSelection[i]) {
              singlesStakes.push(this.betTypeStakes.PerSelection[i])
            }
          }
        }
        return singlesStakes
      },
      interRelatedPerTab () {
        return store.getters['sbBetslipState/interRelatedPerTab'](this.tab)
      },
      hasActiveInteRelated () {
        return Object.keys(this.interRelatedPerTab).length > 0
      },
      interRelatedLen () {
        return Object.keys(this.interRelated).length > 1
      },
      multiSinglesStake: {
        get: function () {
          return store.getters['sbBetslipState/multiSinglesStake']
        },
        set: function (newVal) {
          // console.log('multiSinglesStake newVal: ' + newVal)
          store.commit('sbBetslipState/setMultiSinglesStake', newVal)
          this.updateSinglesStake(newVal)
        }
      },
      hasSGM () {
        if (!this.isSGMenabled) {
          return false
        }
        let cnt = 0
        if (this.allowedBetTypesAndReturnsXP && this.allowedBetTypesAndReturnsXP.PerEvent) {
          for (var e in this.allowedBetTypesAndReturnsXP.PerEvent) {
            var event = this.allowedBetTypesAndReturnsXP.PerEvent[e]
            var l = event && event.Legs ? event.Legs.length : 0
            cnt = l > cnt ? l : cnt
          }
        }
        return !!cnt
      },
      allSelectionsCombinableInParlay () {
        var selections = store.getters['sbBetslipState/getSelections4Calculation'](this.tab) || []
        var allIn = selections.every(function (selection) {
          let betTypes = selection.csvavailablebettypes || selection.bettypecsv || []
          return betTypes.includes('A')
//          return betTypes.length === 0 || betTypes.includes('A')
        })
        return allIn
      }
    },

    methods: {
      setFocus (id, val) {
//        console.log('setFocus: ' + id + '; val: ' + val)
        if (val) {
          Vue.set(this.focus, 0, id)
        } else {
          if (this.focus[0] === id) {
            Vue.set(this.focus, 0, 0)
          }
        }
      },
      dismissError (id, hasError) {
        store.commit('sbBetslipState/dismissErrorFromSelection', hasError)
      },
      updateSinglesStake (v) {
        var multiSinglesStake = v || this.multiSinglesStake
        if (!multiSinglesStake || parseFloat(multiSinglesStake) <= 0) {
          multiSinglesStake = ''
        }
//        console.log('updateSinglesStake:', multiSinglesStake)
        for (var s in this.allowedBetTypesAndReturns.PerSelection) {
//          Vue.set(this.betTypeStakes.PerSelection, s, multiSinglesStake)
          var sourceId = store.getters['sbBetslipState/getSourceIdForDerivedSelection'](s)
          Vue.set(this.betTypeStakes.PerSelection, sourceId || s, multiSinglesStake)
        }
      }
    },

    created () {
//      console.log('Created Tab Regular')
    },

    mounted () {
    },

    watch: {
      /*
      multiSinglesStake (newVal, oldVal) {
        // console.log('multiSinglesStake changed from: ' + oldVal + ' to: ' + newVal)
        this.updateSinglesStake()
      },
      */
      gettingABTnR: {
        immediate: true,
        handler (newVal, oldVal) {
          var self = this
          if (newVal) {
            this.showParlayInfoMsg = false
          } else {
            if (this.betsNo > 1) {
              setTimeout(function () {
                self.showParlayInfoMsg = true
              }, 300)
            } else {
              self.showParlayInfoMsg = false
            }
          }
        }
      }
    },

    destroyed () {
    }
  }
</script>

<style lang="stylus" scoped>
  .header-PARLAY {
    padding: 0px 8px
    display: none  !important;
  }
  .header-SING {
    display: flex;
    flex-basis: auto;
    align-items: center;
    padding: 5px 0 0 0;
    h2 {
      flex: 1 auto;
      flex-basis: auto;
      min-height: auto !important
    }
  }

</style>
