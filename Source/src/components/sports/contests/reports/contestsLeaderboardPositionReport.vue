<template>
    <div class="contests-leaderboard-position-report">
        <div class="contests-leaderboard-position-title">
          <span>{{ contestName }}</span>
          <span>{{ $t('Contests.Leaderboard.Position.Title') }}</span>
        </div>

        <div class="contests-leaderboard-position-dropdown">
          <template v-if="showLoaderDropdownData || !dropDownSelectedData">
            <circle-loader></circle-loader>
          </template>
          <template v-else>
            <div class="leaderboard-position-dropdown--selected" @click="toggleDropdown">
              <span class="dropdown-selected-data" v-if="!showDropdown">
                <span class="dropdown-selected-data--name">{{ dropDownSelectedData.typeName }}</span>
                <span class="dropdown-selected-data--rounds">{{ dropDownSelectedData.startRoundNo }} - {{ dropDownSelectedData.endRoundNo }}</span>
                <span class="dropdown-selected-data--dates">{{ dropDownSelectedData.startTime | formatDates }} - {{ dropDownSelectedData.endTime | formatDates }}</span>
              </span>
              <span class="dropdown-selected-data rounds" v-else>{{ contestName }} - {{ $t('Contests.Leaderboard.Position.Dropdown.Rounds') }}</span>
              <v-icon v-if="!showDropdown">expand_more</v-icon>
              <v-icon v-else>expand_less</v-icon>
            </div>
            <div class="leaderboard-position-dropdown--options" v-if="showDropdown">
              <div class="leaderboard-dropdown--item">
                <div class="leaderboard-dropdown--roundName">{{ groupedByCountDropdownSubcontestsData['-1'][0].typeName }}</div>
                <div class="leaderboard-dropdown--itemRound" @click="dropdownDataChanged(groupedByCountDropdownSubcontestsData['-1'][0])">
                  <span>{{ `${groupedByCountDropdownSubcontestsData['-1'][0].startRoundNo} - ${groupedByCountDropdownSubcontestsData['-1'][0].endRoundNo}` }}</span>
                  <span>{{ groupedByCountDropdownSubcontestsData['-1'][0].startTime | formatDates }} - {{ groupedByCountDropdownSubcontestsData['-1'][0].endTime | formatDates }}</span>
                </div>
              </div>
              <div v-for="(item, key) in groupedByCountDropdownSubcontestsData" :key="key">
                <div v-if="key !== '-1'" class="leaderboard-dropdown--item">
                  <div class="leaderboard-dropdown--roundName">{{ item[0].typeName }}</div>
                  <div>
                    <div v-for="roundItem in item" :key="roundItem.id" @click="dropdownDataChanged(roundItem)" class="leaderboard-dropdown--itemRound">
                        <span>{{ `${roundItem.startRoundNo} - ${roundItem.endRoundNo}` }}</span>
                        <span> {{ roundItem.startTime | formatDates }} - {{ roundItem.endTime | formatDates }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </div>

        <circle-loader v-if="showLoaderReportData"></circle-loader>
        <htmlToPdfConverter v-else :fileName="$t('Contests.Report.Name.Leaderboard.Position.PDF')" :searchKeyword="searchKeyword" @update-search-keyword="setSearchKeyword" :showEntries="showEntries" @update-show-entries="setShowEntries">
          <table class="contests-leaderboard-position-table">
              <tr>
                  <th class="table-cell-center">{{ $t('Contests.Leaderboard.Position.Table.Rank') }}</th>
                  <th>{{ $t('Contests.Leaderboard.Position.Table.Contestant') }}</th>
                  <th class="table-cell-center">{{ $t('Contests.Leaderboard.Position.Table.Win') }}</th>
                  <th class="table-cell-center">{{ $t('Contests.Leaderboard.Position.Table.Lose') }}</th>
                  <th class="table-cell-center">{{ $t('Contests.Leaderboard.Position.Table.Tie') }}</th>
                  <th class="table-cell-center">{{ $t('Contests.Leaderboard.Position.Table.Points') }}</th>
                  <th class="table-cell-center">{{ $t('Contests.Leaderboard.Position.Table.Prize') }}</th>
              </tr>
              <tr v-for="row in leaderBoardPositionReportData" :key="row.alias">
                  <td class="table-cell-center">{{ row.position.rank }}</td>
                  <td>{{ row.alias }}</td>
                  <td class="table-cell-center">{{ row.wonCount }}</td>
                  <td class="table-cell-center">{{ row.lostCount }}</td>
                  <td class="table-cell-center">{{ row.voidCount }}</td>
                  <td class="table-cell-center">{{ row.position.points }}</td>
                  <td class="table-cell-center">{{ row.position.prizeAmount > 0 ? row.position.prizeAmount : "" }}</td>
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
import config from '@/config'
import store from '@/store'
import lib from '@/library'
import moment from 'moment'

import htmlToPdfConverter from '@/components/sports/contests/reports/htmlToPdfConverter.vue'
import CircleLoader from '@/components/common/CircleLoader'
import Screen from '@/components/mixins/Screen'

export default {
  name: 'contestsLeaderboardPosition',
  data () {
    return {
      dropdownSubcontestsData: [],
      showDropdown: false,
      currentDropdownSelectedData: null,
      searchKeyword: '',
      showLoaderReportData: false,
      showLoaderDropdownData: false,
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
  components: {
    htmlToPdfConverter,
    CircleLoader
  },
  computed: {
    ...mapGetters('contests', [
      'getContestEntry',
      'getLeaderBoardPositionReport'
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
    leaderBoardPositionReportData () {
      if (this.searchKeyword.trim().length === 0 && this.showEntries === '') {
        this.resetStartEndIndex()
        return this.getLeaderBoardPositionReport.LeaderboardRows
      }

      let result = this.getLeaderBoardPositionReport.LeaderboardRows.filter(item => {
        return item.alias.toUpperCase().includes(this.searchKeyword.toUpperCase())
      })

      this.filteredCount = result.length

      if (this.startIndex !== null && this.endIndex !== null) {
        const startIndex = this.startIndex
        const endIndex = this.endIndex
        return result.slice(startIndex, endIndex)
      }
      return result.slice(0, this.showEntries === '' ? this.getLeaderBoardPositionReport.LeaderboardRows.length : parseInt(this.showEntries))
    },
    groupedByCountDropdownSubcontestsData () {
      const result = {}
      for (let prom in this.dropdownSubcontestsData) {
        if (result[this.dropdownSubcontestsData[prom].typeInstanceCount]) {
          result[this.dropdownSubcontestsData[prom].typeInstanceCount].push(this.dropdownSubcontestsData[prom])
        } else {
          result[this.dropdownSubcontestsData[prom].typeInstanceCount] = new Array(this.dropdownSubcontestsData[prom])
        }
      }
      return result
    },
    dropDownSelectedData () {
      return !this.currentDropdownSelectedData ? this.dropdownSubcontestsData.find(item => item.typeInstanceCount === -1) : this.currentDropdownSelectedData
    },
    currencySymbol () {
      return config.app.CURRENCY
    },
    leaderBoardPositionReportDataLength () {
      return this.getLeaderBoardPositionReport && this.getLeaderBoardPositionReport.LeaderboardRows && this.getLeaderBoardPositionReport.LeaderboardRows.length
    },
    leaderBoardPositionReportDataCurrentLength () {
      return this.leaderBoardPositionReportData && this.leaderBoardPositionReportData.length
    },
    tableFilterStatusText () {
      // When show entries filter is applied only
      if (this.showEntries !== '' && this.searchKeyword === '') {
        if (this.currentPage === 1) {
          return this.$t('Contests.Reports.Pagination.Label.ShowEntries.First.Page', {toEntries: +this.showEntries < this.leaderBoardPositionReportDataLength ? this.showEntries : this.leaderBoardPositionReportDataLength, entriesLength: this.leaderBoardPositionReportDataLength})
          // return `Showing 1 to ${+this.showEntries < this.leaderBoardPositionReportDataLength ? this.showEntries : this.leaderBoardPositionReportDataLength} of ${this.leaderBoardPositionReportDataLength} entries`
        }

        if (+this.showEntries === 1) {
          return this.$t('Contests.Reports.Pagination.Label.ShowEntries.AnotherPages', {fromEntry: this.currentPage, toEntries: this.currentPage, entriesLength: this.leaderBoardPositionReportDataLength})
          // return `Showing ${this.currentPage} to ${this.currentPage} of ${this.leaderBoardPositionReportDataLength} entries`
        }
        return this.$t('Contests.Reports.Pagination.Label.ShowEntries.AnotherPages', {fromEntry: this.startIndex + 1, toEntries: this.endIndex > this.leaderBoardPositionReportDataLength ? this.leaderBoardPositionReportDataLength : this.endIndex, entriesLength: this.leaderBoardPositionReportDataLength})
        // return `Showing ${this.startIndex + 1} to ${this.endIndex > this.leaderBoardPositionReportDataLength ? this.leaderBoardPositionReportDataLength : this.endIndex} of ${this.leaderBoardPositionReportDataLength} entries`
      }

      // When show entries and search filters are applied
      if (this.showEntries !== '' && this.searchKeyword !== '') {
        if (this.currentPage === 1) {
          return this.$t('Contests.Reports.Pagination.Label.ShowEntries.SearchFilter.First.Page', {toEntries: +this.showEntries < this.filteredCount ? this.showEntries : this.filteredCount, filteredCount: this.filteredCount, entriesLength: this.leaderBoardPositionReportDataLength})
          // return `Showing 1 to ${+this.showEntries < this.filteredCount ? this.showEntries : this.filteredCount} of ${this.filteredCount} entires (filtered from ${this.leaderBoardPositionReportDataLength} total entries)`
        }

        if (+this.showEntries === 1) {
          return this.$t('Contests.Reports.Pagination.Label.ShowEntries.SearchFilter.AnotherPages', {fromEntry: this.currentPage, toEntries: this.currentPage, filteredCount: this.filteredCount, entriesLength: this.leaderBoardPositionReportDataLength})
          // return `Showing ${this.currentPage} to ${this.currentPage} of ${this.filteredCount} entires (filtered from ${this.leaderBoardPositionReportDataLength} total entries)`
        }
        return this.$t('Contests.Reports.Pagination.Label.ShowEntries.SearchFilter.AnotherPages', {fromEntry: this.startIndex + 1, toEntries: this.endIndex > this.filteredCount ? this.filteredCount : this.endIndex, filteredCount: this.filteredCount, entriesLength: this.leaderBoardPositionReportDataLength})
        // return `Showing ${this.startIndex + 1} to ${this.endIndex > this.filteredCount ? this.filteredCount : this.endIndex} of ${this.filteredCount} entires (filtered from ${this.leaderBoardPositionReportDataLength} total entries)`
      }

      // When search filter is applied only
      if (this.showEntries === '' && this.searchKeyword !== '') {
        return this.$t('Contests.Reports.Pagination.Label.SearchFilter.Only', {filteredCount: this.filteredCount, entriesLength: this.leaderBoardPositionReportDataLength})
        // return `Showing 1 to ${this.filteredCount} of ${this.filteredCount} entires (filtered from ${this.leaderBoardPositionReportDataLength} total entries)`
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
  filters: {
    formatDates (date) {
      return `${moment(date).format('MM/DD/YYYY')}`
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
    dropdownDataChanged (roundItem) {
      this.fetchLeaderBoardPositionReport(roundItem.id === undefined ? 'null' : roundItem.id)
      this.toggleDropdown()
      this.currentDropdownSelectedData = roundItem
    },
    toggleDropdown () {
      this.showDropdown = !this.showDropdown
    },
    fetchLeaderBoardPositionReport (subContestId = 'null') {
      this.showLoaderReportData = true
      store.dispatch('contests/fetchLeaderBoardPositionReport', {
        language: config.app.language,
        contestId: this.contestId,
        subContestId: subContestId,
        withPrizeTiers: true
      }).then(data => {
        if (data) this.showLoaderReportData = false
      })
    },
    async fetchDropdownSubcontestsData () {
      try {
        this.showLoaderDropdownData = true
        const response = await lib.kansas.contestSubcontests({
          language: config.app.language,
          contestId: this.contestId
        })

        if (response && response.data && response.data.SubContests) {
          this.dropdownSubcontestsData = response.data.SubContests
          this.showLoaderDropdownData = false
        }
      } catch (error) {
        console.log('Error from contestsLeaderboardPositionReport.vue - fetchDropdownData', error)
      }
    }
  },
  mounted () {
    this.fetchLeaderBoardPositionReport()
    this.fetchDropdownSubcontestsData()
  }
}
</script>

<style lang="stylus" scoped>
@import '~@/css/config'
@import '~@/css/mixins'

.contests-leaderboard-position-report
  padding 10px 15px
  .contests-leaderboard-position-title
    background: var(--mobile-header-bgr)
    color #fff
    display flex
    justify-content: space-between
    padding 7px 10px
    border-radius: 3px
    margin-bottom 7px
  .contests-leaderboard-position-dropdown
    background: #4299B4
    border-radius: 3px
    color #fff
    padding 4px 10px
    position relative
    margin-bottom: 7px
    .leaderboard-position-dropdown--options
      padding: 5px 10px
      position absolute
      left 0
      right 0
      margin-top 3px
      background #f2f2f2
      color var(--account-heading-color)
      .leaderboard-dropdown--item
        padding 5px 0
        display flex
        justify-content: space-between
        border-bottom 1px solid #00000030
        .leaderboard-dropdown--itemRound,
        .leaderboard-dropdown--roundName
          padding 5px 3px
        .leaderboard-dropdown--roundName
          color #4299B4
          font-weight 900
        .leaderboard-dropdown--itemRound
          cursor pointer
          border-bottom 1px solid #00000030
          color var(--account-heading-color)
          font-weight 900
          span:nth-child(1)
            margin-right 30px
            text-align: right
        .leaderboard-dropdown--itemRound:last-child
          border-bottom none
    .leaderboard-position-dropdown--selected
      display: flex
      justify-content: space-between
      align-items: center
      cursor pointer
      i
        color: #fff
      .dropdown-selected-data
        .dropdown-selected-data--name,
        .dropdown-selected-data--rounds
          font-weight 600
          margin-right 10px
        .dropdown-selected-data--dates
          font-size 11px
      .dropdown-selected-data.rounds
        font-weight: 900
  .contests-leaderboard-position-controls
    display: flex
    justify-content: space-between
    align-items: center
  .contests-leaderboard-position-table
    color: var(--account-heading-color)
    tr
      border none
    tr:nth-child(odd)
      background: #f2f2f2
    .table-cell-center
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
