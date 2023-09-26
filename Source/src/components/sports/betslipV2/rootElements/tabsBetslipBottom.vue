<template>
  <div v-if="currentBetSlipState<=1 || parlayStake || singlesStakes.length">
    <v-expansion-panel class="stakeAll_holder" v-if="wagerAllSingles" v-show="tab==='REGULAR' && betsNo>1 && currentBetSlipState<1">
      <v-expansion-panel-content>
        <template v-slot:header>
          <span>
            {{$t('BetSlip.single.wagerAllStraights')}}
          </span>
        </template>
        <span class="stakeAll">
        <money-input v-model="multiSinglesStake"
          :id="1"
          :placeholder="''"
          :disabled="currentBetSlipState>=1"
          :focus="focus"
          @setFocus="setFocus"
          @dismissError="dismissError"
      ></money-input>
      </span>
    </v-expansion-panel-content>
  </v-expansion-panel>
    <div class="tab-btns" v-if="!currentBetSlipState && tab=='REGULAR'">
      <button v-if="hasAvailableTeasers" @click="setTab('TEASER')" class="btn secondary btn_blue" >
        <span>{{ $t('BetSlip.tab.TEASERS') }}</span> <span class="arrow-right"></span>
      </button>
      <button v-if="!currentBetSlipState && tab=='REGULAR' && hasAllowedBetTypesRR" @click="setTab('RR')" class="btn secondary btn_blue" >
        <span>{{ $t('BetSlip.tab.RRS') }}</span> <span class="arrow-right"></span>
      </button>
    </div>
  </div>
</template>

<script>
  //  import Vue from 'vue'
  import store from '@/store'
  import Vue from 'vue'
  import moneyInput from '../common/moneyInput'

  export default {
    name: 'tabsBetslipBottom',

    mixins: [
    ],

    props: ['tab', 'currentBetSlipState', 'betsNo', 'allowedBetTypesAndReturns', 'betTypeStakes', 'allowedMultiSingles'],

    components: {
      moneyInput
    },

    data () {
      return {
        focus: [0]
      }
    },

    computed: {
      betslipLayout2 () {
        return window.ctsautoconf.BETSLIP_LAYOT_2 || false
      },
      teasers () {
        return store.getters['sbBetslipState/teasers']
      },
      hasAvailableTeasers () {
        let has = false
        if (this.teasers && this.teasers.teaserGroups && this.teasers.teaserGroups.length) {
          for (let g in this.teasers.teaserGroups) {
            let group = this.teasers.teaserGroups[g]
            if (group.Selections && group.Selections.length > 1) {
              has = group.Selections.length
              break
            }
          }
        }
        return !!has
      },
      hasAllowedBetTypesRR () {
        // let allowedBetTypes = this.allowedBetTypesAndReturns && this.allowedBetTypesAndReturns.RR && this.allowedBetTypesAndReturns.RR.AllowedBetTypes
        let allowedBetTypes = this.allowedBetTypesAndReturns && this.allowedBetTypesAndReturns.REGULAR && this.allowedBetTypesAndReturns.REGULAR.AllowedBetTypes
        allowedBetTypes = allowedBetTypes || []
        let rrBetTypes = allowedBetTypes.filter(function (bT) {
          return bT.IDFOBetType !== 'S' && bT.IDFOBetType[0] === 'C' && bT.BetTypeInstruction !== 'A'
        })
        return !!rrBetTypes.length
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
      multiSinglesStake: {
        get: function () {
          return store.getters['sbBetslipState/multiSinglesStake']
        },
        set: function (newVal) {
          // console.log('multiSinglesStake newVal: ' + newVal)
          store.commit('sbBetslipState/setMultiSinglesStake', newVal)
          this.updateSinglesStake(newVal)
        }
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
        for (var s in this.allowedBetTypesAndReturns.PerSelection) {
          var sourceId = store.getters['sbBetslipState/getSourceIdForDerivedSelection'](s)
          Vue.set(this.betTypeStakes.PerSelection, sourceId || s, multiSinglesStake)
        }
      },
      setTab (tab) {
        if (this.currentBetSlipState) {
          return
        }
        store.commit('sbBetslipState/setTab', tab)
  //        this.dismissBetSlip(null, !true)
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
  // @import "~@/css/config"

</style>
