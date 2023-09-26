<template>
  <div class="tab-REGULAR">

    <div class="SELECTIONS-RR">
      <selection-rr v-for="(id, index) in betslipSelectionIds" :class="[tab, {first:index==0, last: index+1==allowedBetTypesRR.length}]"
                         :key="id"
                         :id="id"
                         :currentBetSlipState="currentBetSlipState"
                         :tab="tab"
                         :allowedBetTypesAndReturns="{}"
      ></selection-rr>
    </div>

    <div v-if="!gettingABTnR && currentBetSlipState<=1 && activeSelectionsNo>=3 && !allowedBetTypesRR.length"
         class="msg info noRRAvailable" :class="{'interRelated':hasActiveInteRelated, 'hasNonCombinableSelection':hasNonCombinableSelection}" >
      <v-icon>info_outline</v-icon>
      <span v-if="hasActiveInteRelated && !hasNonCombinableSelection">{{ $t('BetSlip.tab.RR.info.interRelated') }}</span>
      <span v-else>{{ $t('BetSlip.tab.RR.info.noRRAvailable') }}</span>
    </div>

    <div v-if="!gettingABTnR && currentBetSlipState<=1 && activeSelectionsNo<3 && !allowedBetTypesRR.length"
         class="empty-betslip msg info">
        <v-icon>info_outline</v-icon>
      <span>{{ $t('BetSlip.tab.RR.emptyInfoMsg') }}</span>
    </div>

    <div class="RRs" v-if="betsNo>1">
      <bet-type-rr v-for="(bT, index) in allowedBetTypesRR" :class="{first:index==0, last: index+1==allowedBetTypesRR.length}"
        :key="bT.IDFOBetType"
        :id="bT.IDFOBetType"
        :currentBetSlipState="currentBetSlipState"
        :tab="tab"
        :allowedBetTypesAndReturns="bT"
      ></bet-type-rr>
    </div>

    <div class="PARLAY" v-if="betsNo>1 && allowedBetTypesAndReturns && allowedBetTypesAndReturns.PerBetType && allowedBetTypesAndReturns.PerBetType.A">
      <bet-type-parlay
        :key="'A'"
        :id="'A'"
        :currentBetSlipState="currentBetSlipState"
        :tab="tab"
        :allowedBetTypesAndReturns="allowedBetTypesAndReturns.PerBetType.A"
      ></bet-type-parlay>
    </div>

    <!--<b>betslipSelectionIds</b>: {{betslipSelectionIds}}<br>-->
    <!--<b>activeSelectionsNo</b>: {{activeSelectionsNo}}<br>-->
    <!--<b>allowedBetTypesRR</b>: {{allowedBetTypesRR}}<br>-->
    <!--<b>interRelated</b>: {{interRelated}}<br>-->
    <!--<b>interRelatedRR</b>: {{interRelatedRR}}<br>-->
    <!--<b>interRelatedPerTab</b>: {{interRelatedPerTab}}<br>-->
    <!--<b>hasActiveInteRelated</b>: {{hasActiveInteRelated}}<br>-->
    <!--<b>optedIn</b>: {{optedIn}}<br>-->
    <!--<b>hasNonCombinableSelection</b>: {{hasNonCombinableSelection}}<br>-->
  </div>
</template>

<script>
  //  import Vue from 'vue'
  import store from '@/store'
  import betTypeParlay from '../../betTypes/betTypeParlay.vue'
  import betTypeRr from '../../betTypes/betTypeRR.vue'
  import selectionRr from '../../selections/selectionRr.vue'
  import Icon from '@/components/common/Icon'

  export default {
    name: 'RRTab',

    mixins: [
    ],

    props: ['tab', 'currentBetSlipState', 'betsNo', 'allowedBetTypesAndReturns', 'betTypeStakes', 'interRelated', 'gettingABTnR'],

    components: {
      betTypeParlay,
      betTypeRr,
      selectionRr,
      Icon
    },

    data () {
      return {
      }
    },

    computed: {
      allowedBetTypesRR () {
        return store.getters['sbBetslipState/allowedBetTypesRR']
      },
      betslipSelectionIds () {
        return store.getters['sbBetslipState/betslipSelectionIds']
      },
      optedIn () {
        return store.getters['sbBetslipState/optedInRR']
      },
      activeSelectionsNo () {
        var c = 0
        for (var i in this.optedIn) {
          c += this.optedIn[i] ? 1 : 0
        }
        return c
      },
      interRelatedPerTab () {
        return store.getters['sbBetslipState/interRelatedPerTab'](this.tab)
      },
      hasActiveInteRelated () {
        return Object.keys(this.interRelatedPerTab).length > 0
      },
      hasNonCombinableSelection () {
        let optedIn = this.optedIn
        var selections = store.getters['sbBetslipState/getSelections4Calculation'](this.tab) || []
        var anySelectionForSinglesOnly = selections.some(selection => {
          let betTypes = selection.csvavailablebettypes || selection.bettypecsv || []
          return optedIn[selection.idfoselection] && betTypes.length === 1 && betTypes[0] === 'S'
        })
        return anySelectionForSinglesOnly
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

</style>
