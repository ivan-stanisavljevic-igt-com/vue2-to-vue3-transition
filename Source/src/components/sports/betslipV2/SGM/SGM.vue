<template>
  <div class="SGM">
    <!--
    <h2 class="header-PARLAY-title" v-show="currentBetSlipState<1 || anySGPstaked">
      <span>{{ $t('BetSlip.tab.title.PARLAY') }}</span>
    </h2>
    -->

    <div v-for="eventId in sgpEvents" >
      <sgp
        :tab="tab"
        :eventId="eventId"
        :currentBetSlipState="currentBetSlipState"
        :allowedBetTypesAndReturn="allowedBetTypesAndReturns.PerEvent[eventId]"
        :gettingABTnR="gettingABTnR"
      ></sgp>
    </div>

    <!--<br>-->
    <!--{{tab}}<br>-->
<!--    {{allowedBetTypesAndReturns}}<br>-->
    <!--{{allowedBetTypesAndReturnsSGP}}<br>-->
    <!--{{betTypeStakes}}<br>-->
<!--    sgpEvents: {{sgpEvents}}<br>-->
  </div>
</template>

<script>
  //  import Vue from 'vue'
  //  import store from '@/store'
  import sgp from './SGP.vue'

  export default {
    name: 'SGM',
    props: ['betsNo', 'tab', 'allowedBetTypesAndReturns', 'currentBetSlipState', 'gettingABTnR', 'betTypeStakes', 'winnings'],

    components: {
      sgp
    },

    data () {
      return {
      }
    },

    computed: {
      sgpEvents () {
//        console.log('sgpEvents')
        return this.allowedBetTypesAndReturns.Events || []
      },
      allowedBetTypesAndReturnsSGP () {
//        console.log('allowedBetTypesAndReturnsSGP')
        return []
      },
      anySGPstaked () {
        var isStaked = false
        /*
        for (var e in this.betTypeStakes.SGP.PerEvent) {
          if (this.betTypeStakes.SGP.PerEvent[e]) {
            isStaked = true
            break
          }
        }
        */
        return isStaked
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
  .header-PARLAY-title
    font-size 16px!important

</style>
