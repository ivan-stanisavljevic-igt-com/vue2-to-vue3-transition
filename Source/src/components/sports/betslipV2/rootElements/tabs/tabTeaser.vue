<template>
  <div class="tab-TEASER">

    <div class="info msg all_corners" v-show="!gettingABTnR && !teaserGroups.length && currentBetSlipState<=1" >
      <v-icon>info_outline</v-icon>
      <span v-html="$t('BetSlip.tab.TEASER.emptyInfoMsg')"></span>
    </div>

    <teaser v-for="(group, index) in teaserGroups"
            :key="index"
            :index="index"
            :groupId="group.idFoSport"
            :group="group"
            :currentBetSlipState="currentBetSlipState"
            :tab="tab"
            :allowedBetTypesAndReturns="allowedBetTypesAndReturns[group.idFoSport]"
            :betTypeStakes="betTypeStakes"
            :interRelated="interRelated"
            :gettingABTnR="gettingABTnR"
    >
    </teaser>

    <!--<br><b>teasers:</b> {{teasers}}-->
    <!--<br><b>teaserGroups:</b> {{teaserGroups}}-->
    <!--<br><b>allowedBetTypesAndReturns:</b> {{allowedBetTypesAndReturns}}-->
  </div>
</template>

<script>
  //  import Vue from 'vue'
  import store from '@/store'
  import teaser from '../../teasers/teaser.vue'
  import Icon from '@/components/common/Icon'

  export default {
    name: 'TeaserTab',

    mixins: [
    ],

    props: ['tab', 'currentBetSlipState', 'betsNo', 'allowedBetTypesAndReturns', 'betTypeStakes', 'interRelated', 'gettingABTnR'],

    components: {
      teaser,
      Icon
    },

    data () {
      return {
      }
    },

    computed: {
      teasers () {
        return store.getters['sbBetslipState/teasers']
      },
      teaserGroups () {
        return store.getters['sbBetslipState/teaserGroups']
      },
      betslipSelectionIds () {
        return store.getters['sbBetslipState/betslipSelectionIds']
      }
    },

    methods: {
      getTeaserGroups () {
//        var self = this
        store.dispatch('sbBetslipState/getTeasers', 'ALL').then(function () {
          // self.getABTnR4Ts()
        })
      }
    },

    created () {
      let pendingGetTeaserGroups = store.getters['sbBetslipState/pendingGetTeaserGroups']
      if (pendingGetTeaserGroups) {
        this.getTeaserGroups()
      }
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
    },

    destroyed () {
    }
  }
</script>

<style lang="stylus" scoped>

</style>
