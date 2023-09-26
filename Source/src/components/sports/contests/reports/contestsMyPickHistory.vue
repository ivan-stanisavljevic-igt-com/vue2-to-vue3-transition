<template>
    <div class="contests-my-pick-history-report">
      <div class="contests-my-pick-history--title">
        <span>{{ contestName }}</span>
        <span>{{ $t('Contests.My.Pick.History.Title') }}</span>
      </div>
      <div class="contests-leaderboard-position-containerTable">
        <table class="contests-leaderboard-position-table">
            <tr>
                <th class="col-left" colspan="2">{{ $t('Contests.My.Pick.History.Table.Rounds.Head') }}</th>
                <th v-for="roundNumber in contestMaxPicksPerRound" :key="roundNumber">{{ $t('Contests.My.Pick.History.Table.Pick.No') }}&nbsp;{{ roundNumber }}</th>
            </tr>
            <tr v-for="row in myPickHistoryReportData" :key="row.roundNo">
              <td class="col-left" colspan="2">{{ $t('Contests.My.Pick.History.Table.Round.No') }}&nbsp;{{ row.roundNo }}</td>
              <!--  -->
              <td v-for="(pick, index) in row.picks" :key="index">
                {{ pick.competitorShortName }}
              </td>
              <template v-if="contestMaxPicksPerRound - row.picks.length > 0">
                <td v-for="col in contestMaxPicksPerRound - row.picks.length" :key="col + row.picks.length - 1"></td>
              </template>
            </tr>
        </table>
      </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import store from '@/store'

export default {
  name: 'contestsMyPickHistory',
  computed: {
    ...mapGetters('contests', [
      'getContestEntry',
      'getMyPickHistory'
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
    contestMaxPicksPerRound () {
      return this.contest && this.contest.maxPicksPerRound
    },
    contestName () {
      return this.contest && this.contest.name
    },
    myPickHistoryReportData () {
      return this.getMyPickHistory
    }
  },
  methods: {
    fetchMyPickHistory () {
      store.dispatch('contests/fetchMyPickHistory', this.contestEntryId)
    }
  },
  mounted () {
    this.fetchMyPickHistory()
  }
}
</script>

<style lang="stylus" scoped>
.contests-my-pick-history-report
  padding 10px 15px
  .contests-leaderboard-position-containerTable
    overflow-x: auto
    .contests-leaderboard-position-table
      color: var(--account-heading-color)
      tr
        border none
      tr:nth-child(odd)
        background: #f2f2f2
      th.col-left
        text-align: left
      th
        text-align: center
      td.col-left
        text-align: left
      td
        text-align: center
  .contests-my-pick-history--title
    background: var(--mobile-header-bgr)
    color #fff
    display flex
    justify-content: space-between
    padding 7px 10px
    border-radius: 3px
    margin-bottom 7px
</style>
