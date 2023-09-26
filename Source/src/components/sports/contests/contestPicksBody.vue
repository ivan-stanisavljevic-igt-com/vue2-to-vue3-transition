<template>
  <div class="contest-picks-page--body">
    <div class="contest-body--name" v-if="!mobileBigAndBelow">{{ contestName }}</div>
    <div class="contest-body-info">
      <div class="contest-body-info--round">
         <span class="picks">{{ $t('Contests.Picks.Body.Round.Picks', {roundNo: roundNo}) }}</span>  <!-- Proslediti dinamicki broj runde u translaciju -->
        <span class="time-left">{{ $t('Contests.Picks.Body.Time.Left') }} <span>({{roundTimeLeft}})</span></span>
      </div>
      <div class="contest-body-info--used">
        <!-- <span class="used-picks"><span>{{ $t('Contests.Picks.Body.Used.Picks') }}</span><span class="used-picks--loader selected-0"></span></span> Proslediti dinamicki Used Picks u translaciju -->
        <span class="used-picks"> {{ $t('Contests.Picks.Body.Used.Picks') }} {{ picksCount }} / {{ contestMaxPicksPerRound }}<span class="used-picks--scale"><span class="used-picks--scale-marked" :style="{width: picksScaleWidth + '%' }"></span></span></span> <!-- Proslediti dinamicki Used Picks u translaciju -->
        <span @click="clearAllPicks" class="clear-picks"><span>{{$t('Contests.Picks.Body.Clear.Picks')}}</span> <span class="trash"></span></span>
      </div>
    </div>
    <div class="contest-body-tables">
      <contests-table></contests-table>
    </div>
  </div>    
</template>

<script>
import store from '@/store'
import { mapGetters } from 'vuex'
import contestsTable from '@/components/sports/contests/contestsTable.vue'
import Screen from '@/components/mixins/Screen'
import ContestsTimeFormat from '@/components/mixins/ContestsTimeFormat'

export default {
  name: 'contesPicksBody',
  components: {
    contestsTable
  },
  mixins: [
    Screen,
    ContestsTimeFormat
  ],
  data () {
    return {
      maxWidth: 35
    }
  },
  computed: {
    ...mapGetters('contests', [
      'getContestEntry',
      'getPicksCount',
      'getCurrentUtcDateTime'
    ]),
    contestEntryId () {
      return Number(this.$route.params.contestEntryId)
    },
    contestEntry () {
      return this.getContestEntry(this.contestEntryId)
    },
    contest () {
      return this.contestEntry && this.contestEntry.contest
    },
    contestId () {
      return this.contest && this.contest.id
    },
    contestName () {
      return this.contest && this.contest.name
    },
    contestMaxPicksPerRound () {
      return this.contest && this.contest.maxPicksPerRound
    },
    roundNo () {
      return this.contest && this.contest.currentRound && this.contest.currentRound.roundNo
    },
    contestCurrentRoundEndTime () {
      return this.contest && this.contest.currentRound && this.contest.currentRound.endTimeUtc
    },
    currentUtcTime () {
      return this.getCurrentUtcDateTime
    },
    roundTimeLeft () {
      return this.timeDifferenceCalculator(this.contestCurrentRoundEndTime, this.currentUtcTime)
    },
    picksCount () {
      return this.getPicksCount
    },
    picksScaleWidth () {
      if (this.picksCount) {
        return (this.picksCount / this.contestMaxPicksPerRound) * 100
      } else {
        return 0
      }
    }
  },
  methods: {
    clearAllPicks () {
      store.dispatch('contests/cancelRoundPicks', {
        'contestId': this.contestId,
        'contestEntryId': this.contestEntryId,
        'roundNo': this.roundNo
      }).then(response => {
        if (response.Error) {
          this.activateErrorDialog(response.Error.Message)
        }
      })
    },
    activateErrorDialog (errorMessage) {
      store.dispatch('overlayState/activateContestsErrorDialogState')
      store.commit('contests/setErrorDialogMessage', errorMessage)
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '~@/css/config'
@import '~@/css/mixins'

.contest-picks-page--body
  background: #fff
  padding 10px
  .contest-body--name
    background: var(--mobile-header-bgr)
    color #fff
    text-align: center
    padding 7px 10px
    border-radius: 3px
    margin-bottom 7px
  .contest-body-info
    color: var(--account-heading-color)
    .contest-body-info--round
      border 2px solid #5EC0DE
      border-radius: 3px
      display: flex
      justify-content: space-between
      padding 5px 10px
      background: #5ec0de20
      .picks
        font-weight 900
      .time-left
        span
          font-weight 600
          color #FF7E1C
          margin-left 3px
    .contest-body-info--used
      display: flex
      justify-content: space-between
      align-items: center
      padding 10px
      .used-picks
        font-weight 900
        display: flex
        align-items: center
        .used-picks--scale
          position relative
          display: block
          width 100px
          height: 7px
          margin-left: 5px
          border-radius: 5px
          border 1px solid var(--account-heading-color)
        .used-picks--scale-marked
          position absolute
          top 0
          left 0
          bottom 0
          background: #FF7E1C
      .clear-picks
        display: flex
        align-items: center
        font-weight 900
        cursor: pointer
        .trash
          display inline-block
          background-image: url(icons-path'/'bin_icon_blue'.svg')
          height: 17px
          width: 17px
          margin-left: 5px
          margin-bottom: 1px
.contest-body-tables
  margin-top: 10px
</style>
