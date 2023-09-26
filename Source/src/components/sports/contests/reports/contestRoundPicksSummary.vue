<template>
    <div class="contests-round-picks-summary-report">
        <div class="contests-round-picks-summary--title">
          <span>{{ contestName }}</span>
          <span v-html="$t('Contests.Round.Picks.Summary.Title',{contestCurrentRound: contestCurrentRound})"></span>
        </div>
        <table class="contests-leaderboard-position-table">
            <tr>
              <th>{{ $t('Contests.Round.Picks.Summary.Table.Competitor') }}</th>
              <th>{{ $t('Contests.Round.Picks.Summary.Table.PickCount') }}</th>
            </tr>
            <tr v-for="row in roundPicksSummaryReportData" :key="row.competitorShortName">
              <td>{{ row.competitorShortName }}</td>
              <td>{{ row.pickCount }}</td>
            </tr>
        </table>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import store from '@/store'
import config from '@/config'

export default {
  name: 'contestRoundPicksSummary',
  computed: {
    ...mapGetters('contests', [
      'getContestEntry',
      'getRoundPicksSummary'
    ]),
    contestId () {
      return Number(this.$route.params.contestId)
    },
    contestEntryId () {
      return Number(this.$route.params.contestEntryId)
    },
    contestEntry () {
      return this.getContestEntry(this.contestEntryId)
    },
    contest () {
      return this.contestEntry && this.contestEntry.contest
    },
    contestName () {
      return this.contest && this.contest.name
    },
    contestCurrentRound () {
      return this.contest && this.contest.currentRound.roundNo
    },
    roundPicksSummaryReportData () {
      return this.getRoundPicksSummary.CompetitorPicks
    }
  },
  methods: {
    fetchRoundPicksSummary () {
      store.dispatch('contests/fetchRoundPicksSummary', {
        language: config.app.language,
        contestId: this.contestId,
        roundNo: this.contestCurrentRound
      })
    }
  },
  watch: {
    contestCurrentRound () {
      this.fetchRoundPicksSummary()
    }
  },
  mounted () {
    this.fetchRoundPicksSummary()
  }
}
</script>

<style lang="stylus" scoped>
.contests-round-picks-summary-report
  padding 10px 15px
  .contests-round-picks-summary--title
    background: var(--mobile-header-bgr)
    color #fff
    display flex
    justify-content: space-between
    padding 7px 10px
    border-radius: 3px
    margin-bottom 7px
  .contests-leaderboard-position-table
    color: var(--account-heading-color)
    tr
     border none
    tr:nth-child(odd)
      background: #f2f2f2
    th
      text-align: center
    td
      text-align: center
</style>