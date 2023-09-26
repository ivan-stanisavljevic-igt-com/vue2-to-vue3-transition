<template>
  <div class="contests-reports-wrapper">
    <contest-picks-header v-if="mobileBigAndBelow" :hideHeaderBody="true" />
    <component :is="currentComponent"></component>
  </div>
</template>

<script>
import contestPicksHeader from '@/components/sports/contests/contestPicksHeader.vue'
import Screen from '@/components/mixins/Screen'
import Session from '@/components/mixins/Session'

export default {
  name: 'ContestsReportsPage',
  components: {
    contestPicksHeader
  },
  mixins: [
    Screen,
    Session
  ],
  computed: {
    currentComponent () {
      if (this.$route.params.reportName === 'leaderboard-position') {
        return () => import(`@/components/sports/contests/reports/contestsLeaderboardPositionReport.vue`)
      }
      if (this.$route.params.reportName === 'view-all-picks-for-round') {
        return () => import(`@/components/sports/contests/reports/contestsViewAllPicksReport.vue`)
      }
      if (this.$route.params.reportName === 'my-pick-history') {
        return () => import(`@/components/sports/contests/reports/contestsMyPickHistory.vue`)
      }
      if (this.$route.params.reportName === 'round-picks-summary') {
        return () => import(`@/components/sports/contests/reports/contestRoundPicksSummary.vue`)
      }
      return null
    }
  },
  mounted () {
    this.userIsActive()
  }
}
</script>

<style lang="stylus" scoped>

</style>
