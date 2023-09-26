<template>
    <div class="contests-view-all-picks-report">
        <div class="contests-view-all-picks--title">
          <span>{{ contestName }}</span>
          <span>{{ $t('Contests.Report.Name.View.All.Picks.Title.Name') }}</span>
        </div>
        <div class="contests-view-all-picks--roundTitle">
          <span>{{ $t('Contests.My.Pick.History.Table.Round.No') }} {{ contestCurrentRound }}</span>
        </div>
        <htmlToPdfConverter :fileName="$t('Contests.Report.Name.View.All.Picks.PDF')" :searchKeyword="searchKeyword" @update-search-keyword="setSearchKeyword" :showEntries="showEntries" @update-show-entries="setShowEntries">
          <table class="contests-leaderboard-position-table">
              <tr>
                  <th class="col-left">{{ $t('Contests.Report.Name.View.All.Picks.Player.Name') }}</th>
                  <th v-for="roundNumber in contestMaxPicksPerRound" :key="roundNumber">{{$t('Contests.My.Pick.History.Table.Pick.No')}} {{ roundNumber }}</th>
              </tr>
              <tr v-for="row in viewAllPicksReportData" :key="row.alias">
                  <td class="col-left">{{ row.alias }}</td>
                  <template v-if="row.Picks.length > 0">
                    <td v-for="(pick, index) in row.Picks" :key="index">
                      {{ pick.competitorShortName }}
                    </td>
                    <template v-if="contestMaxPicksPerRound - row.Picks.length > 0">
                      <td v-for="col in contestMaxPicksPerRound - row.Picks.length" :key="col + row.Picks.length - 1"></td>
                    </template>
                  </template>
                  <td v-else :colspan="contestMaxPicksPerRound" class="col-left">{{ $t('Contests.Report.Name.View.All.Picks.No.Selections') }}</td>
              </tr>
          </table>
          <p style="text-align:center; font-weight: bold" v-if="!mobileBigAndBelow">{{ tableFilterStatusText }}</p>
        </htmlToPdfConverter>
        <div v-if="tableTotalPages > 1 && !mobileBigAndBelow" class="contests-leaderboard-position-table--pagination">
          <v-icon @click="getPage(currentPage - 1 < 1 ? currentPage : currentPage - 1)">chevron_left</v-icon>
          <template v-for="(page, index) in pagination.items">
            <span v-if="typeof page === 'string'" :key="index + 1">{{ page }}</span>
            <span v-else :key="page" @click="getPage(page)" :class="{'page-selected': currentPage === page}">{{ page }}</span>
          </template>
          <v-icon @click="getPage(currentPage + 1 > tableTotalPages ? currentPage : currentPage + 1)">chevron_right</v-icon>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import store from '@/store'
import Screen from '@/components/mixins/Screen'
import config from '@/config'

import htmlToPdfConverter from '@/components/sports/contests/reports/htmlToPdfConverter.vue'

export default {
  name: 'contestsViewAllPicksReport',
  components: {
    htmlToPdfConverter
  },
  data () {
    return {
      searchKeyword: '',
      showEntries: '',
      filteredCount: null,
      startIndex: null,
      endIndex: null,
      currentPage: null
    }
  },
  mixins: [
    Screen
  ],
  computed: {
    ...mapGetters('contests', [
      'getContestEntry',
      'getRoundPicksReport'
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
    contestMaxPicksPerRound () {
      return this.contest && this.contest.maxPicksPerRound
    },
    contestCurrentRound () {
      return this.contest && this.contest.currentRound.roundNo
    },
    viewAllPicksReportDataLength () {
      return this.getRoundPicksReport && this.getRoundPicksReport.ContestEntryPicks && this.getRoundPicksReport.ContestEntryPicks.length
    },
    viewAllPicksReportData () {
      if (this.searchKeyword.trim().length === 0 && this.showEntries === '') {
        this.resetStartEndIndex()
        return this.getRoundPicksReport.ContestEntryPicks
      }

      let result = this.getRoundPicksReport.ContestEntryPicks.filter(item => {
        return item.alias.toUpperCase().includes(this.searchKeyword.toUpperCase()) ||
        item.Picks.find(element => element.competitorShortName.toUpperCase().includes(this.searchKeyword.toUpperCase()))
      })

      this.filteredCount = result.length

      if (this.startIndex !== null && this.endIndex !== null) {
        const startIndex = this.startIndex
        const endIndex = this.endIndex
        return result.slice(startIndex, endIndex)
      }
      return result.slice(0, this.showEntries === '' ? this.getRoundPicksReport.ContestEntryPicks.length : parseInt(this.showEntries))
    },
    viewAllPicksReportDataCurrentLength () {
      return this.viewAllPicksReportData && this.viewAllPicksReportData.length
    },
    tableFilterStatusText () {
      // When show entries filter is applied only
      if (this.showEntries !== '' && this.searchKeyword === '') {
        if (this.currentPage === 1) {
          return this.$t('Contests.Reports.Pagination.Label.ShowEntries.First.Page', {toEntries: +this.showEntries < this.viewAllPicksReportDataLength ? this.showEntries : this.viewAllPicksReportDataLength, entriesLength: this.viewAllPicksReportDataLength})
          // return `Showing 1 to ${+this.showEntries < this.viewAllPicksReportDataLength ? this.showEntries : this.viewAllPicksReportDataLength} of ${this.viewAllPicksReportDataLength} entries`
        }

        if (+this.showEntries === 1) {
          return this.$t('Contests.Reports.Pagination.Label.ShowEntries.AnotherPages', {fromEntry: this.currentPage, toEntries: this.currentPage, entriesLength: this.viewAllPicksReportDataLength})
          // return `Showing ${this.currentPage} to ${this.currentPage} of ${this.viewAllPicksReportDataLength} entries`
        }
        return this.$t('Contests.Reports.Pagination.Label.ShowEntries.AnotherPages', {fromEntry: this.startIndex + 1, toEntries: this.endIndex > this.viewAllPicksReportDataLength ? this.viewAllPicksReportDataLength : this.endIndex, entriesLength: this.viewAllPicksReportDataLength})
        // return `Showing ${this.startIndex + 1} to ${this.endIndex > this.viewAllPicksReportDataLength ? this.viewAllPicksReportDataLength : this.endIndex} of ${this.viewAllPicksReportDataLength} entries`
      }

      // When show entries and search filters are applied
      if (this.showEntries !== '' && this.searchKeyword !== '') {
        if (this.currentPage === 1) {
          return this.$t('Contests.Reports.Pagination.Label.ShowEntries.SearchFilter.First.Page', {toEntries: +this.showEntries < this.filteredCount ? this.showEntries : this.filteredCount, filteredCount: this.filteredCount, entriesLength: this.viewAllPicksReportDataLength})
          // return `Showing 1 to ${+this.showEntries < this.filteredCount ? this.showEntries : this.filteredCount} of ${this.filteredCount} entires (filtered from ${this.viewAllPicksReportDataLength} total entries)`
        }

        if (+this.showEntries === 1) {
          return this.$t('Contests.Reports.Pagination.Label.ShowEntries.SearchFilter.AnotherPages', {fromEntry: this.currentPage, toEntries: this.currentPage, filteredCount: this.filteredCount, entriesLength: this.viewAllPicksReportDataLength})
          // return `Showing ${this.currentPage} to ${this.currentPage} of ${this.filteredCount} entires (filtered from ${this.viewAllPicksReportDataLength} total entries)`
        }
        return this.$t('Contests.Reports.Pagination.Label.ShowEntries.SearchFilter.AnotherPages', {fromEntry: this.startIndex + 1, toEntries: this.endIndex > this.filteredCount ? this.filteredCount : this.endIndex, filteredCount: this.filteredCount, entriesLength: this.viewAllPicksReportDataLength})
        // return `Showing ${this.startIndex + 1} to ${this.endIndex > this.filteredCount ? this.filteredCount : this.endIndex} of ${this.filteredCount} entires (filtered from ${this.viewAllPicksReportDataLength} total entries)`
      }

      // When search filter is applied only
      if (this.showEntries === '' && this.searchKeyword !== '') {
        return this.$t('Contests.Reports.Pagination.Label.SearchFilter.Only', {filteredCount: this.filteredCount, entriesLength: this.viewAllPicksReportDataLength})
        // return `Showing 1 to ${this.filteredCount} of ${this.filteredCount} entires (filtered from ${this.viewAllPicksReportDataLength} total entries)`
      }
    },
    tableTotalPages () {
      if (this.filteredCount) {
        return +this.showEntries === 0 ? 1 : Math.ceil(this.filteredCount / +this.showEntries)
      }
    },
    pagination () {
      if (!this.currentPage || !this.tableTotalPages) return null

      let prev = this.currentPage === 1 ? null : this.currentPage - 1
      let next = this.currentPage === this.tableTotalPages ? null : this.currentPage + 1
      let items = [1]

      if (this.currentPage === 1 && this.tableTotalPages === 1) return {currentPage: this.currentPage, prev, next, items}
      if (this.currentPage > 4) items.push('…')

      let r = 2
      let r1 = this.currentPage - r
      let r2 = this.currentPage + r

      for (let i = r1 > 2 ? r1 : 2; i <= Math.min(this.tableTotalPages, r2); i++) items.push(i)

      if (r2 + 1 < this.tableTotalPages) items.push('…')
      if (r2 < this.tableTotalPages) items.push(this.tableTotalPages)

      return {currentPage: this.currentPage, prev, next, items}
    }
  },
  methods: {
    setSearchKeyword (value) {
      this.currentPage = 1
      this.resetStartEndIndex()
      this.searchKeyword = value
    },
    setShowEntries (value) {
      this.currentPage = 1
      this.resetStartEndIndex()
      this.showEntries = value
    },
    getPage (pageNumber) {
      this.currentPage = pageNumber
      this.startIndex = (pageNumber - 1) * +this.showEntries
      this.endIndex = this.startIndex + +this.showEntries
    },
    resetStartEndIndex () {
      this.startIndex = null
      this.endIndex = null
    },
    fetchRoundPicksReport () {
      store.dispatch('contests/fetchRoundPicksReport', {
        language: config.app.language,
        contestId: this.contestId,
        roundNo: this.contestCurrentRound
      })
    }
  },
  watch: {
    contestCurrentRound () {
      this.fetchRoundPicksReport()
    }
  },
  mounted () {
    this.fetchRoundPicksReport()
  }
}
</script>

<style lang="stylus" scoped>
@import '~@/css/config'
@import '~@/css/mixins'

.contests-view-all-picks-report
  padding 10px 15px
  .contests-view-all-picks--title
    background: var(--mobile-header-bgr)
    color #fff
    display flex
    justify-content: space-between
    padding 7px 10px
    border-radius: 3px
    margin-bottom 10px
  .contests-view-all-picks--roundTitle
    border 1px solid #4298b4
    border-radius: 3px
    padding 5px 10px
    background: #5ec0de20
    text-align: center
    font-weight 900
    margin-bottom: 7px
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
  .contests-leaderboard-position-table--pagination
    display flex
    align-items: center
    justify-content: center
    span
      padding: 5px
      cursor pointer
      &.page-selected
        background: #e6e6e6
</style>
