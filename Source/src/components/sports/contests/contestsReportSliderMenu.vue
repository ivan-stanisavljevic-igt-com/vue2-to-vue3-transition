<template>
    <v-navigation-drawer
        v-if="isSlider"
        class="contest-report-slider-menu"
        v-model="show"
        fixed
        temporary
        right
    >
        <div class="contest-report-slider-menu--border"></div>
        <div class="contest-report-slider-menu--content">
          <div class="contest-report-slider-menu--title">
            <span class="slider-menu-title--title">{{ $t('Contests.Slider.Menu.Title') }}</span>
            <span class="slider-menu-title--sportname">{{ contestName }}</span>
            <span class="slider-menu-title--round" v-html="$t('Contests.Slider.Menu.Round',{contestCurrentRound: contestCurrentRound})"></span>
          </div>

          <div class="contest-report-slider-menu--balance">
            <span class="slider-menu-balance--points" v-html="$t('Contests.Slider.Menu.Balance.Points')"></span>
            <span class="slider-menu-balance--pointsvalue">{{ pointBalance }}</span>
            <span class="slider-menu-balance--bottomborder"></span>
          </div>

          <ul class="contest-report-slider-menu--menu">
            <li><router-link :to="homePath">{{ $t('Contests.Slider.Menu.Home') }}</router-link></li>
            <li><router-link :to="`${reportsPath}/leaderboard-position`">{{ $t('Contests.Slider.Menu.Leaderboard.Position', {boardPosition: boardPosition}) }}</router-link></li>
            <li><router-link :to="`${reportsPath}/view-all-picks-for-round`">{{ $t('Contests.Slider.Menu.View.All.Picks') }}</router-link></li>
            <li><router-link :to="`${reportsPath}/my-pick-history`">{{ $t('Contests.Slider.Menu.My.Pick.History') }}</router-link></li>
            <li><router-link :to="`${reportsPath}/round-picks-summary`">{{ $t('Contests.Slider.Menu.Round.Picks.Summary') }}</router-link></li>
          </ul>
        </div>
        <span class="contest-report-slider-menu--contests-text">{{ $t('Contests.Slider.Menu.Contests.Text') }}</span>
    </v-navigation-drawer>
    <div v-else class="contest-report-slider-menu--desktop">
      <div class="contest-report-slider-menu--content">
        <ul class="contest-report-slider-menu--menu">
          <li><router-link :to="homePath">{{ $t('Contests.Slider.Menu.Home') }}</router-link></li>
          <li><router-link :to="`${reportsPath}/leaderboard-position`">{{ $t('Contests.Slider.Menu.Leaderboard.Position', {boardPosition: boardPosition}) }}</router-link></li>
          <li><router-link :to="`${reportsPath}/view-all-picks-for-round`">{{ $t('Contests.Slider.Menu.View.All.Picks') }}</router-link></li>
          <li><router-link :to="`${reportsPath}/my-pick-history`">{{ $t('Contests.Slider.Menu.My.Pick.History') }}</router-link></li>
          <li><router-link :to="`${reportsPath}/round-picks-summary`">{{ $t('Contests.Slider.Menu.Round.Picks.Summary') }}</router-link></li>
        </ul>
      </div>
    </div>
</template>

<script>
import store from '@/store'
import { mapGetters } from 'vuex'

export default {
  props: ['showReportSliderMenu', 'isSlider'],
  computed: {
    ...mapGetters('contests', [
      'getContestEntry'
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
    boardPosition () {
      return `${this.contestLeaderboardPosition}/${this.contestEntryCount}`
    },
    contestCurrentRound () {
      return this.contest && this.contest.currentRound.roundNo
    },
    contestLeaderboardPosition () {
      return this.contestEntry && this.contestEntry.position.rank
    },
    contestEntryCount () {
      return this.contest && this.contest.contestEntryCount
    },
    pointBalance () {
      return this.contestEntry && this.contestEntry.position.points
    },
    reportsPath () {
      return `/contests/${this.contestId}/${this.contestEntryId}/mypicks/reports`
    },
    homePath () {
      return `/contests/${this.contestId}/${this.contestEntryId}/mypicks`
    },
    show: {
      get () {
        // console.log('showReportSliderMenu - get: ' + this.showReportSliderMenu)
        return this.showReportSliderMenu
      },
      set (value) {
        // console.log('showReportSliderMenu - set: ' + value)
        store.commit('overlayState/setContestSliderMenuState', value)
        this.$emit('slider-close', value)
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
.contest-report-slider-menu--desktop,
.contest-report-slider-menu
  background: #003764
  .contest-report-slider-menu--contests-text
    display: inline-block
    font-size: 4rem
    font-style: italic
    font-weight: 900
    color: #78DDFC
    transform: rotate(-90deg) translate(-40px,-120%)
    display: block
    opacity 0.4
    margin-top 35px
  .contest-report-slider-menu--border
    position: absolute
    left 0
    top 110px
    bottom 110px
    width: 20px
    background: #78DDFC
  .contest-report-slider-menu--content
    padding: 50px 5px 10px 40px
    .contest-report-slider-menu--title
      display: flex
      flex-direction: column
      .slider-menu-title--title
        color: #CFCFCF
        font-size: 13px
      .slider-menu-title--sportname
        font-size: 14px
      .slider-menu-title--round
        font-size 19px
        color #78DDFC
    .contest-report-slider-menu--balance
      display: flex
      flex-direction: column
      padding-top 40px
      .slider-menu-balance--points
        color: #CFCFCF
        margin-bottom 10px
      .slider-menu-balance--pointsvalue
        font-size 19px
        color #78DDFC
        margin-bottom 10px
      .slider-menu-balance--bottomborder
        background: #78DDFC
        height: 5px
        width: 85%
    .contest-report-slider-menu--menu
      list-style: none
      padding 20px 0
      li 
        padding 10px 0
        border-bottom 1px solid #dbdce080
        font-size 13px
        letter-spacing: 1px
        a
          color #78DDFC
          &.router-link-exact-active
            color #fff !important
      li:last-child
        border-bottom none
.contest-report-slider-menu--desktop
  .contest-report-slider-menu--content
    padding: 0 15px
</style>