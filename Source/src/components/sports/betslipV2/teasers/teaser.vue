<template>
  <div class="comp-TEASER" v-if="!isEmpty">
    <teaser-option
      :groupId="groupId"
      :group="group"
      :currentBetSlipState="currentBetSlipState"
      :tab="tab"
      :activeTeaserByGroup="activeTeaserByGroup"
      :mixedTeasers="mixedTeasers"
      :selectionsLen="selectionsLen"
    ></teaser-option>

    <teaser-group
        :key="groupId"
        :groupId="groupId"
        :group="group"
        :currentBetSlipState="currentBetSlipState"
        :tab="tab"
        :selections="selections"
        :allowedBetTypesAndReturns="abtnr"
        :betTypeStakes="betTypeStakes"
        :activeTeaser="activeTeaserByGroup[groupId]"
        :mixedTeasers="mixedTeasers"
        :interRelated="interRelatedTeasers"
    >
    </teaser-group>

    <bet-type-parlay
        :key="'A'"
        :id="'A'"
        :currentBetSlipState="currentBetSlipState"
        :tab="tab"
        :allowedBetTypesAndReturns="abtnr"
        :teaserGroupId="groupId"
        :teaserLevel="activeTeaserByGroup[groupId]"
        :spread="spread"
        :interRelated="interRelated"
    ></bet-type-parlay>

    <div class="info msg all_corners" v-show="!gettingABTnR && activeSelectionsLen<2 && currentBetSlipState<=1" >
      <v-icon>info_outline</v-icon>
      <span>{{ $t('BetSlip.tab.TEASER.info.minSelectionsNo') }}</span>
    </div>

    <div class="info msg all_corners" v-show="!gettingABTnR && activeSelectionsLen>=2 && currentBetSlipState<=1 && !abtnr.PotentialReturn" >
      <v-icon>info_outline</v-icon>
      <span v-if="hasActiveInteRelated">{{ $t('BetSlip.tab.TEASER.info.interRelated') }}</span>
      <span v-else>{{ $t('BetSlip.tab.TEASER.info.noAvailableBetTypes') }}</span>
    </div>

    <!--<div style="white-space: pre;color:red;">-->
      <!--<br><b>teasers:</b> {{teasers}}-->
      <!--<br><b>teaserGroups:</b> {{teaserGroups}}-->
      <!--<br><b>allowedBetTypesAndReturns:</b> {{allowedBetTypesAndReturns}}-->
      <!--<br><b>abtnr:</b> {{abtnr}}-->
      <!--<br><b>groupId: </b>{{groupId}}-->
      <!--<br><b>spread: </b>{{spread}}-->
      <!--<br><b>group: </b>{{group}}-->
      <!--<br><b>activeTeaserByGroup: </b>{{activeTeaserByGroup}}-->
      <!--<br><b>interRelated: </b>{{interRelated}}-->
      <!--<br><b>selections: </b>{{selections}}-->
      <!--<br><b>optedIn: </b>{{optedIn}}-->
      <!--<br><b>interRelatedTeasers: </b>{{interRelatedTeasers}}-->
      <!--<br><b>hasActiveInteRelated: </b>{{hasActiveInteRelated}}-->
      <!--<br><b>activeSelectionsLen: </b>{{activeSelectionsLen}}-->
    <!--</div>-->
  </div>
</template>

<script>
  //  import Vue from 'vue'
  import store from '@/store'
  import teaserGroup from './teaserGroup.vue'
  import teaserOption from './teaserOption.vue'
  import betTypeParlay from '../betTypes/betTypeParlay.vue'
  import Icon from '@/components/common/Icon'

  export default {
    name: 'TeaserComponent',

    mixins: [
    ],

    props: ['tab', 'currentBetSlipState', 'betsNo', 'allowedBetTypesAndReturns', 'betTypeStakes', 'groupId', 'group', 'interRelated', 'gettingABTnR'],

    components: {
      teaserGroup,
      teaserOption,
      betTypeParlay,
      Icon
    },

    data () {
      return {
      }
    },

    computed: {
      mixedTeasers () {
        return store.getters['sbBetslipState/mixedTeasers']
      },
      activeTeaserByGroup () {
        // for debug
        return store.getters['sbBetslipState/activeTeaserByGroup']
      },
      teasers () {
        return store.getters['sbBetslipState/teasers']
      },
      teaserGroups () {
        return store.getters['sbBetslipState/teaserGroups']
      },
      betslipSelectionIds () {
        return store.getters['sbBetslipState/betslipSelectionIds']
      },
      abtnr () {
        return (this.allowedBetTypesAndReturns &&
          this.allowedBetTypesAndReturns.PotentialReturns &&
          this.allowedBetTypesAndReturns.PotentialReturns.PerBetType &&
          this.allowedBetTypesAndReturns.PotentialReturns.PerBetType.A) || {}
      },
      isEmpty () {
        return this.group && this.group.Selections && !this.group.Selections.length
      },
      selections () {
        var self = this
        var selections = []
        if (!this.mixedTeasers) {
          selections = this.group.Selections
        } else {
          if (self.betslipSelectionIds.length) {
            self.betslipSelectionIds.forEach(function (id) {
              var selection = self.group.Selections.find(s => s.IDFOSelection === id)
              if (selection) {
                selections.push(selection)
              }
            })
          }
        }
        return selections
      },
      selectionsLen () {
        return this.selections ? this.selections.length : 0
      },
      optedIn () {
        return store.getters['sbBetslipState/optedInTeaser']
      },
      activeSelectionsLen () {
        var self = this
        return self.selections.filter(function (s) {
          var id = s.IDFOSelection
          return self.optedIn[id]
        }).length
      },
      interRelatedTeasers () {
//        console.log('interRelatedTeasers')
        var self = this
        var i
        var ig
        var obj = {}
//        var objInv = {}
        var cnt = {}
        if (self.selections.length) {
          self.selections.forEach(function (s) {
            var id = s.IDFOSelection
            ig = self.interRelated[id]
//            if (self.optedIn[id] && ig) {
            if (ig) {
              cnt[ig] = cnt[ig] || 0
              cnt[ig]++
              obj[id] = self.interRelated[id]
            }
          })
        }
        //
        for (i in obj) {
          ig = obj[i]
          if (!cnt[ig] || cnt[ig] < 2) {
            delete obj[i]
          }
        }
        //
        return obj
      },
      hasActiveInteRelated () {
//        console.log('hasActiveInteRelated')
        var cnt = {}
        var interRelatedTeasers = JSON.parse(JSON.stringify(this.interRelatedTeasers))
        for (var id in interRelatedTeasers) {
          var ig = interRelatedTeasers[id]
          cnt[ig] = cnt[ig] || 0
          cnt[ig]++
          if (!this.optedIn[id]) {
            cnt[ig]--
            delete interRelatedTeasers[id]
          }
        }
        for (var i in interRelatedTeasers) {
          ig = interRelatedTeasers[i]
          if (!cnt[ig] || cnt[ig] < 2) {
            delete interRelatedTeasers[i]
          }
        }
        return Object.keys(interRelatedTeasers).length > 0
      },
      spreads () {
        return (this.group && this.group.Spreads) || {}
      },
      spread () {
        let spread = this.spreads && this.spreads[this.activeTeaserByGroup[this.groupId]]
        spread = spread || ''
        spread = spread.split(' ').join('')
        return spread
      }
    },

    methods: {
    },

    created () {
//      console.log('created Teaser')
    },

    mounted () {
    },

    watch: {
      /*
       teaserGroups (newVal, oldVal) {
       console.log('Watch teaserGroups')
       store.dispatch('sbBetslipState/scheduleGetTeaserGroups')
       }
       */
      selectionsLen (newVal, oldVal) {
//        console.log('Watch selectionsLen: ' + oldVal + ' => ' + newVal)
        if (newVal && newVal < oldVal) {
          store.dispatch('sbBetslipState/scheduleGetTeaserGroups')
        }
      }
    },

    destroyed () {
    }
  }
</script>

<style lang="stylus" scoped>

</style>
