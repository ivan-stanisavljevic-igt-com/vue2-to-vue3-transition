<template>
   <div class="sports-page">
      <v-layout  class="page-layout">
        <v-flex class="main-column" :style="{paddingTop: headerHeight + 'px'}" ref="maincolumn">
          <resize-observer @notify="mainColumnResize" />
          <v-layout  class="page-layout">
            <div class="contests-wrapper" :class="{'padding-b-30': !isLoggedIn}">
              <div v-if="isContestsRootPage && isLoggedIn">
                <contests-carousel stage='upcoming' />
                <contests-carousel stage='entered' />
                <contests-carousel stage='completed' />
              </div>
              <div v-else-if="isContestsRootPage && !isLoggedIn">
                <contests-carousel :isLoggedIn="isLoggedIn" stage='upcoming' />
                <div class="contests-no-logged-in-msg">{{ $t('Contests.Root.Page.Not.LoggedIn.Msg') }}</div>
              </div>
              <div class="contests-page-wrapper" v-else>
                <router-view />
              </div>
            </div>
            <div v-if="!mobileBigAndBelow" class="contests-desktop-menu" :class="{'bg-color': isLoggedIn && !isContestsRootPage && !isRegistrationPage}">
              <template v-if="!isContestsRootPage && !isRegistrationPage">
                <contest-picks-header />
                <contests-report-slider-menu :isSlider="false"/>
              </template>
              <template v-else>
                <div class="trophy--img">
                  <img src="@/assets/images/contests/contest_trophy.png" alt="contests-img" />
                </div>
              </template>
            </div>
          </v-layout>
        </v-flex>
      </v-layout>
      <contests-error-dialog :errorMessage="errorDialogMessage" :showErrorDialog="showErrorDialog" @toggle-error-dialog="toggleErrorDialog" />
   </div>
</template>

<script>
import store from '@/store'
import { mapGetters } from 'vuex'
import contestsCarousel from '@/components/sports/contests/contestsCarousel'
import contestPicksHeader from '@/components/sports/contests/contestPicksHeader.vue'
import contestsReportSliderMenu from '@/components/sports/contests/contestsReportSliderMenu.vue'
import contestsErrorDialog from '@/components/sports/contests/contestsErrorDialog.vue'
import Screen from '@/components/mixins/Screen'
import Session from '@/components/mixins/Session'

export default {
  name: 'ContestsPage',
  components: {
    contestsCarousel,
    contestPicksHeader,
    contestsReportSliderMenu,
    contestsErrorDialog
  },
  mixins: [
    Screen,
    Session
  ],
  data () {
    return {
      pollingData: false,
      pollInterval: 30000,
      showErrorDialog: false,
      errorDialogMessage: ''
    }
  },
  computed: {
    ...mapGetters('overlayState', [
      'getContestsErrorDialogState'
    ]),
    ...mapGetters('contests', [
      'getErrorDialogMessage'
    ]),
    isContestsRootPage () {
      return this.$route.name === 'contests'
    },
    headerHeight () {
      return store.getters['screenState/getHeaderHeight']
    },
    isRegistrationPage () {
      return this.$route.name.startsWith('contests/registration/')
    }
  },
  methods: {
    fetchContestsAndContestEntries () {
      store.dispatch('contests/fetchContestsAndContestEntries')
    },
    fetchContests4All () {
      store.dispatch('contests/fetchContests4All')
    },
    pollContestsAndContestEntries () {
      this.pollingData = setInterval(this.fetchContestsAndContestEntries, this.pollInterval)
    },
    mainColumnResize () {
      var mainColumn = this.$refs.maincolumn
      if (mainColumn) {
        store.commit('screenState/setMainColumnWidth', mainColumn.offsetWidth)
      }
    },
    toggleErrorDialog (value) {
      this.showErrorDialog = value
      store.commit('overlayState/setContestsErrorDialogState', value)
    }
  },
  watch: {
    isLoggedIn (newVal) {
      if (newVal) {
        this.fetchContestsAndContestEntries()
        this.pollContestsAndContestEntries()
      } else {
        this.fetchContests4All()
      }
    },
    getContestsErrorDialogState (newVal) {
      if (newVal) {
        this.showErrorDialog = true
        this.errorDialogMessage = this.getErrorDialogMessage
      }
    }
  },
  created () {
    if (this.isLoggedIn) {
      this.fetchContestsAndContestEntries()
      this.pollContestsAndContestEntries()
    } else {
      this.fetchContests4All()
    }
  },
  mounted () {
    this.mainColumnResize()
    this.userIsActive()
  },
  beforeDestroy () {
    clearInterval(this.pollingData)
  }
}
</script>

<style lang="stylus" scoped>
@import '~@/css/config'
@import '~@/css/mixins'

.trophy--img 
  display: flex
  align-items: center
  justify-content: center
  height: 100%
img 
  max-width: 100%
  max-height: 500px
  margin: 0 auto
.contests-wrapper
  background-color: #fff
  padding: 1rem
  width: 70%
  .contests-page-wrapper
    height: 100%
  >>> .contest-content-wrap
    max-width: 500px
    height: 100%
    margin: 0 auto
    @media mobile-big-and-below
      max-width: 100%
  @media mobile-big-and-below
    padding: 0
    width: unset
  &.padding-b-30
    padding-bottom 30px
  .contests-no-logged-in-msg
    border 2px solid
    max-width 300px
    margin 100px auto
    text-align: center
    padding 40px 50px
    font-weight 900
.contests-desktop-menu
  border: 1px solid #5ec0de
  min-width: 29%
  margin-left 8px
  background: transparent
  @media mobile-big-and-below
    display none
  &.bg-color
    background: #003764
</style>
