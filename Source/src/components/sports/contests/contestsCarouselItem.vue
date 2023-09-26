<template>
  <div v-if="stage === 'upcoming'" :class="['contests-carousel-item', stage]">
    <img v-if="ifContestImageExists" class="contests-carousel-item--image" :src="contestImageUrl" alt="Contest Cover Image" />
    <img v-else class="contests-carousel-item--image" src="@/assets/images/contests/contest_img_gen.png" alt="Contest Cover Image" />
    <h3 class="contests-carousel-item--name">{{ contest.name }}</h3>
    <div v-if="isContestRegistrationActive" class="contests-carousel-action">
      <v-btn @click="toggleContestRequestAccessDialog" v-if="maxEntriesPerPlayer > 1" class="request-access-btn">{{ $t('Contests.Carusel.Item.Request.Access') }}</v-btn>
      <router-link v-else :to="{ name: 'contests/registration/termsandconditions', params: { contestId: contestId } }" class="request-access-btn">{{ $t('Contests.Carusel.Item.Request.Access') }}</router-link>
      <contest-request-access-dialog :showContestRequestAccessDialog="showContestRequestAccessDialog" :entriesLeft="entriesLeft" :contestId="contestId" :contestName="contestName" @toggle-contest-request-access-dialog="toggleContestRequestAccessDialog"/>
      <div class="registration-time">
        <span>{{ $t('Contests.Carusel.Item.Registration.Ends') }}</span>
        <span>{{ registrationEndUtcTime }}</span>
      </div>
    </div>
    <div v-else class="contests-carousel-not-active">
      {{ $t('Contests.Carusel.Item.Registration.Starts') }} <span>{{ registrationStartUtcTime }}</span>
    </div>
  </div>

  <div v-else-if="stage === 'entered'" :class="['contests-carousel-item', stage]">
    <router-link v-if="contestObj.contest.phase === 'ACT'" :to="{ name: 'contests/my-picks', params: { contestId: contestId, contestEntryId: contestEntryId } }" class="my-picks-img">
      <img v-if="ifContestImageExists" class="contests-carousel-item--image" :src="contestImageUrl" alt="Contest Cover Image" />
      <img v-else class="contests-carousel-item--image" src="@/assets/images/contests/contest_img_gen.png" alt="Contest Cover Image" /> 
    </router-link>
    <a v-else @click="toggleContestEnteredDialog">
      <img v-if="ifContestImageExists" class="contests-carousel-item--image" :src="contestImageUrl" alt="Contest Cover Image" />
      <img v-else class="contests-carousel-item--image" src="@/assets/images/contests/contest_img_gen.png" alt="Contest Cover Image" /> 
      <contest-entered-dialog :contestAlias="this.contestObj.alias" :contestName="this.contest.name" :showContestEnteredDialog="showContestEnteredDialog" :contestStartTime="this.startUtcTime" @toggle-contest-entered-dialog="toggleContestEnteredDialog" />
    </a>
    <!-- <img class="contests-carousel-item--image" src="https://iw.dev.igt.rs/static/headlines/igt_baner_1.jpg" alt="Contest Cover Image" /> -->
    <div class="contests-ent-carousel-item-body">
      <div class="carousel-item-body--names">
        <h2 class="contests-carousel-item--alias">{{ contestObj.alias }}</h2>
        <p class="contests-carousel-item--name">{{ contest.name }}</p>
      </div>
      <div class="carousel-item-body--details" v-if="contestObj.contest.phase === 'ACT'">
        <span class="contests-carousel-item--rank">{{ $t('Contests.Leaderboard.Position.Table.Rank') }} {{ contestObj.rank }}</span>
        <span class="contests-carousel-item--round">{{ $t('Contests.My.Pick.History.Table.Round.No') }} {{ contestObj.round.roundNo }}</span>
      </div>
    </div>
    <div v-if="contestObj.contest.phase === 'ACT'" class="time-active-contest">
      {{ $t('Contests.Picks.Body.Time.Left') }} {{ currentRoundEndUtcTime }}
    </div>
    <div v-if="contestObj.contest.phase === 'ENT'" class="time-entry-contest">
      {{ $t('Contests.Carusel.Item.Starts.In') }} {{ startUtcTime }}
    </div>
  </div>
  
  <div v-else-if="stage === 'completed'" :class="['contests-carousel-item', stage]">
    <img v-if="ifContestImageExists" class="contests-carousel-item--image" :src="contestGenericImg" alt="Contest Cover Image" />
    <img v-else class="contests-carousel-item--image" src="@/assets/images/contests/contest_img_gen.png" alt="Contest Cover Image" />
    <h3 class="contests-carousel-item--name">{{ contest.name }}</h3>
    <div class="ent-time-contest">
      <span>{{ $t('Contests.Carusel.Item.Ended') }}</span> {{contest.endTimeUtc | formatDates}}
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import store from '@/store'
import config from '@/config'
import { mapGetters } from 'vuex'
import contestEnteredDialog from '@/components/sports/contests/contestEnteredDialog.vue'
import contestRequestAccessDialog from '@/components/sports/contests/contestRequestAccessDialog.vue'
import ContestsTimeFormat from '@/components/mixins/ContestsTimeFormat'

export default {
  name: 'contestsCarouselItem',
  components: {
    contestEnteredDialog,
    contestRequestAccessDialog
  },
  mixins: [
    ContestsTimeFormat
  ],
  data () {
    return {
      showContestEnteredDialog: false,
      showContestRequestAccessDialog: false,
      ifContestImageExists: false
    }
  },
  props: [
    'contestObj',
    'stage'
  ],
  computed: {
    ...mapGetters('contests', [
      'getCurrentUtcDateTime'
    ]),
    contest () {
      /*
      Depending on phase, contestObj can be either:
      1. Pure contest object.
      2. An object containing contestEntryId and separate contest object related to contest entry.
      */
      if (this.contestObj.hasOwnProperty('contestEntryId')) {
        return this.contestObj.contest
      } else {
        return this.contestObj
      }
    },
    contestEntryId () {
      if (this.contestObj.hasOwnProperty('contestEntryId')) {
        return this.contestObj.contestEntryId
      }
    },
    contestImageUrl () {
      if (!this.contest) return ''

      if (this.contest.mediaUrl && this.contest.mediaUrl.trim().length === 0) return '@/assets/images/contests/contest_img_gen.png'

      if (this.contest.mediaUrl && (this.contest.mediaUrl.indexOf('http://') > -1 || this.contest.mediaUrl.indexOf('https://') > -1)) {
        return this.contest.mediaUrl
      }

      return config.app.autoconf.CONTESTS_MEDIA_URL + this.contest.mediaUrl
    },
    contestId () {
      return this.contest && this.contest.id
    },
    contestName () {
      return this.contest && this.contest.name
    },
    maxEntriesPerPlayer () {
      return this.contest && this.contest.maxEntriesPerPlayer
    },
    playerEntryCount () {
      return this.contest && this.contest.playerEntryCount
    },
    entriesLeft () {
      return this.maxEntriesPerPlayer - this.playerEntryCount
    },
    isContestRegistrationActive () {
      return this.contest.phase === 'ENT' && this.contest.playerEntryCount < this.contest.maxEntriesPerPlayer
    },
    currentTime () {
      return this.getCurrentUtcDateTime
    },
    startUtcTime () {
      return this.timeDifferenceCalculator(this.contest.startTimeUtc, this.currentTime)
    },
    endUtcTime () {
      return this.timeDifferenceCalculator(this.contest.endTimeUtc, this.currentTime)
    },
    registrationStartUtcTime () {
      return this.timeDifferenceCalculator(this.contest.registrationStartTimeUtc, this.currentTime)
    },
    registrationEndUtcTime () {
      return this.timeDifferenceCalculator(this.contest.registrationEndTimeUtc, this.currentTime)
    },
    currentRoundEndUtcTime () {
      if (this.contest.currentRound) {
        return this.timeDifferenceCalculator(this.contest.currentRound.endTimeUtc, this.currentTime)
      }
    },
    currentRoundStartUtcTime () {
      if (this.contest.currentRound) {
        return this.timeDifferenceCalculator(this.contest.currentRound.startTimeUtc, this.currentTime)
      }
    }
  },
  methods: {
    toggleContestEnteredDialog (value) {
      this.showContestEnteredDialog = value
      store.commit('overlayState/setContestEnteredDialogState', value)
    },
    toggleContestRequestAccessDialog (value) {
      this.showContestRequestAccessDialog = value
      store.commit('overlayState/setContestRequestAccessDialogState', value)
    },
    checkIfImageExists (url) {
      const img = new Image()
      img.src = url

      if (img.complete) {
        this.ifContestImageExists = true
      } else {
        img.onload = () => {
          this.ifContestImageExists = true
        }

        img.onerror = () => {
          this.ifContestImageExists = false
        }
      }
    }
  },
  filters: {
    formatDates (date) {
      return `${moment(date).format('MM/DD/YYYY')}`
    }
  },
  mounted () {
    this.checkIfImageExists(this.contestImageUrl)
  }
}
</script>

<style lang="stylus" scoped>
.contests-carousel-item.upcoming
  border-bottom: 1px solid #3ca77c
.contests-carousel-item.entered
  border-bottom: 1px solid #4198b3
.contests-carousel-item.completed
  border-bottom: 1px solid #858585
.contests-carousel-item
  display: inline-block
  padding-bottom: 0.375rem
  color: var(--account-heading-color)
  .contests-carousel-item--image
    max-width: 230px
  .request-access-btn,
  button.theme--light.v-btn.request-access-btn 
    color: #fff
    border-radius: 1px
    background-color: #2A8460
    background-image: linear-gradient(to bottom, #3ca77c, #196547)
    padding 5px 15px 6px
    margin-right: 15px
    margin-left: 0
    font-size: 12px
    height: auto
  .contests-carousel-action
    display: flex
    align-items: center
    .registration-time
       display flex
       flex-direction: column
       font-size 11px
       span 
         color var(--account-heading-color)
         line-height: 1.27
         font-weight 600
       span:first-child
         color #c74545
  .contests-carousel-action p
    margin: 0
  .contests-carousel-not-active
    border: solid 1px #3ca77c
    border-radius: 1px
    padding 5px 0
    text-align: center
    margin-top: 6px
    font-weight 900
    span 
      color #3ca77c
  .contests-carousel-item--alias
    margin 0
  p.contests-carousel-item--name
    margin 0
    font-weight 900
  .contests-carousel-item--name
    margin: 0
  .time-entry-contest
    background: #ececec
    color: #4198b3
    padding: 2px 10px
    margin-top 5px
    font-weight: 600
  .time-active-contest
    background: #4198b3
    color: #fff
    padding: 2px 10px
    margin-top 5px
    font-weight: 500
  .ent-time-contest
    color #003764
    span 
      color #858585
      font-weight 900
  .contests-ent-carousel-item-body
    display: flex
    justify-content: space-between
    align-items: center
    .carousel-item-body--details
      display: flex
      flex-direction: column
      justify-content: space-between
      .contests-carousel-item--rank
        font-weight 600
      .contests-carousel-item--round
        font-weight 900
</style>
