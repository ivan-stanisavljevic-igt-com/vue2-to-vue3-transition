<template>
    <div class="contest-picks-page--header">
      <div class="contest-header-info">
        <div class="contest-header-info--name">
          <span class="contest-info-name-details"><span class="contest-info-name-details--usericon"></span> <span class="name">{{ contestEntryAlias}}</span></span>
          <span class="contest-info-arrow" :class="{'switch-alias-popup-active': showPopupSwitchAlias}" @click="toggleSwitchAliasPopup(!showPopupSwitchAlias)">
            <v-icon v-if="!showPopupSwitchAlias">expand_more</v-icon>
            <v-icon v-else>expand_less</v-icon>
          </span>
          <contests-switch-alias-dialog :showPopupSwitchAlias="showPopupSwitchAlias" @switch-alias-popup-close="toggleSwitchAliasPopup" />
        </div>
        <div class="contest-header-info--more"><span @click="showReportSliderMenu = true"><v-icon>more_vert</v-icon></span></div>
        <contests-report-slider-menu v-if="mobileBigAndBelow" :isSlider="true" :showReportSliderMenu="showReportSliderMenu" :contest="contest" :contestEntryId="contestEntryId" :boardPosition="contestLeaderboardPosition+'/'+contestEntryCount" :roundNo="roundNo" @slider-close="(value) => showReportSliderMenu = value" />
      </div>
      <div class="contest-header-body" v-if="!hideHeaderBody">
        <div class="contest-header-body--contest">
          <div class="contest-sport-info">
            <div class="contest-sport-info--right">
              <span class="contest-sport-info--title">{{ $t('Contests.Picks.Header.Info.Title') }}</span>
              <span class="contest-sport-info--sportname">{{ contestName }}</span>
              <span class="contest-sport-info--round">{{ $t('Contests.My.Pick.History.Table.Round.No') }} {{roundNo}}</span>
            </div>
            <div class="contest-sport-info--left">
              <span class="contest-sport-info--title">{{ $t('Contests.Picks.Header.Points.Balance') }}</span>
              <span class="contest-sport-info--balance">{{ contestPointBalance }}</span>
            </div>
          </div>
        </div>
        <div class="contest-header-body--leaderbord">
          <span>{{ $t('Contests.Leaderboard.Position.Title') }}</span>
          <span><b>{{ contestLeaderboardPosition }}</b>/{{ contestEntryCount }}</span>
        </div>
      </div>
    </div>
</template>

<script>
import store from '@/store'
import { mapGetters } from 'vuex'
import contestsSwitchAliasDialog from '@/components/sports/contests/contestsSwitchAliasDialog.vue'
import contestsReportSliderMenu from '@/components/sports/contests/contestsReportSliderMenu.vue'
import Screen from '@/components/mixins/Screen'

export default {
  props: {
    hideHeaderBody: {
      type: Boolean,
      default: false
    }
  },
  mixins: [
    Screen
  ],
  components: {
    contestsSwitchAliasDialog,
    contestsReportSliderMenu
  },
  data () {
    return {
      showPopupSwitchAlias: false,
      showReportSliderMenu: false
    }
  },
  computed: {
    ...mapGetters('contests', [
      'getContestEntry'
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
    contestEntryAlias () {
      return this.contestEntry && this.contestEntry.alias
    },
    contestLeaderboardPosition () {
      return this.contestEntry && this.contestEntry.position && this.contestEntry.position.rank
    },
    contestPointBalance () {
      return this.contestEntry && this.contestEntry.position && this.contestEntry.position.points
    },
    contestName () {
      return this.contest && this.contest.name
    },
    contestEntryCount () {
      return this.contest && this.contest.contestEntryCount
    },
    roundNo () {
      return this.contest && this.contest.currentRound && this.contest.currentRound.roundNo
    }
  },
  methods: {
    toggleSwitchAliasPopup (value) {
      store.commit('overlayState/setContestsPopupOverlayState', value)
      this.showPopupSwitchAlias = value
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '~@/css/config'
@import '~@/css/mixins'

.contest-picks-page--header
  position relative
  background: var(--mobile-header-bgr)
  padding: 10px
  color #fff
  .contest-header-info
    display: flex
    justify-content: space-between
    .contest-header-info--name
      width: 70%
      display: flex
      justify-content: space-between
      padding 0 5px
      .contest-alias-dialog-enter-active,
      .contest-alias-dialog-leave-active
        transition: all .3s cubic-bezier(.25,.8,.25,1);
      .contest-alias-dialog-enter-from,
      .contest-alias-dialog-leave-to
        opacity 0
      .contest-info-name-details
        display: flex
        align-items: center
      .contest-info-name-details--usericon
        display: inline-block
        background-image: url(icons-path'/'contest_alias'.svg')
        height: 33px
        width: 33px
        margin-right: 8px
        i
          color #fff
      .contest-info-arrow
        background: #003764
        cursor pointer
        height: 33px
        width: 33px
        border 1px solid #fff
        border-radius: 3px
        i
          color #fff
          font-size 31px
      .contest-info-arrow.switch-alias-popup-active
        position: relative
        z-index: 10002
    .contest-header-info--more
      width: 30%
      display: flex
      justify-content: flex-end
      span
        cursor pointer
        height: 33px
        width: 33px
        i
          font-size 31px
          color #fff
  .contest-header-body
    display: flex
    margin-top: 5px
    .contest-header-body--contest
      width: 70%
      margin-right 5px
      border: 3px solid #4299B4
      border-radius: 3px
      .contest-sport-info
        padding 3px 10px
        display: flex
      .contest-sport-info--right
          display flex
          flex-direction: column
          width: 75%
          border-right: 2px solid #4299B4
          span
            margin-bottom: 3px
          .contest-sport-info--title
            color: #CFCFCF
          .contest-sport-info--sportname
            font-size: 13px
          .contest-sport-info--round
            font-size 14px
            color #5EC0DE
      .contest-sport-info--left
          display flex
          flex-direction: column
          justify-content: space-between
          padding-left 10px
          width: 25%
          .contest-sport-info--title
            color: #CFCFCF
          .contest-sport-info--balance
            font-size 14px
            color #5EC0DE 
            margin-bottom: 3px
    .contest-header-body--leaderbord
      background: linear-gradient(to bottom, transparent, #578EBC)
      border 3px solid #5EC0DE
      border-radius: 3px
      width: 30%
      display: flex
      flex-direction: column
      justify-content: space-between
      padding 3px 10px
      span:nth-child(2)
        margin-bottom: 3px
        font-size 14px
</style>
