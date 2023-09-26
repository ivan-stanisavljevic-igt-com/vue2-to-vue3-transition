<template>
  <div class="contest-registration-successful-page">
    <h1 class="contest-name">{{ contestName }}</h1>
    <div class="contest-content-wrap">
      <span class="contest-info-name-details--success"></span>
      <div class="contest-registration-info">
        <p>{{ $t('Contests.Registration.Info.One') }}</p>
        <p>{{ $t('Contests.Registration.Info.Two') }}<span>{{ contestEntryAlias }}</span></p>
        <p>{{ $t('Contests.Registration.Info.Three') }}<span>{{ contestName }}</span></p>
        <p>{{ $t('Contests.Registration.Info.Four') }}</p>
      </div>
      <div class="contest-registration-start-time">
        <p>{{ $t('Contests.Registration.Starts') }} {{ startUtcTime }}</p>
      </div>
      <div class="contest-registration-transaction">
        <h3>{{ $t('Contests.Registration.Transaction.Heading') }}</h3>
        <p><span>${{ entryFee }}</span> {{ $t('Contests.Registration.Fee') }}</p>
        <p>{{ $t('Contests.Registration.Reference') }} <span>{{ transactionReference }}</span></p>
        <p v-if="entryFeeDiscount">{{ $t('Contests.Registration.Vaucer') }} <span>${{ entryFeeDiscount }}</span></p>
        <v-btn class="btn--more-info" :to="{ name: 'account-transactions' }">{{ $t('Contests.Registration.More') }}</v-btn>
      </div>
      <v-btn class="btn--done" :to="{ name: 'contests' }">{{ $t('Contests.Registration.Done') }}</v-btn>
    </div>
  </div>
</template>

<script>
import store from '@/store'
import { mapGetters } from 'vuex'
import ContestsTimeFormat from '@/components/mixins/ContestsTimeFormat'
import Session from '@/components/mixins/Session'

export default {
  name: 'ContestRegistrationSuccessfulPage',
  mixins: [
    ContestsTimeFormat,
    Session
  ],
  computed: {
    ...mapGetters('contests', [
      'getLatestEntry',
      'getCurrentUtcDateTime'
    ]),
    entryFee () {
      return this.getLatestEntry && this.getLatestEntry.entryFee
    },
    entryFeeDiscount () {
      return this.getLatestEntry && this.getLatestEntry.entryFeeDiscount
    },
    contestEntry () {
      return this.getLatestEntry && this.getLatestEntry.contestEntry
    },
    contestEntryAlias () {
      return this.contestEntry && this.contestEntry.alias
    },
    transactionReference () {
      return this.contestEntry && this.contestEntry.walletTxId
    },
    contest () {
      return this.contestEntry && this.contestEntry.contest
    },
    contestName () {
      return this.contest && this.contest.name
    },
    contestStartTimeUtc () {
      return this.contest && this.contest.startTimeUtc
    },
    startUtcTime () {
      return this.timeDifferenceCalculator(this.contestStartTimeUtc, this.currentTime)
    }
  },
  methods: {
    removeLatestEntry () {
      store.dispatch('contests/removeLatestEntry')
    },
    fetchContestsAndContestEntries () {
      store.dispatch('contests/fetchContestsAndContestEntries')
    }
  },
  created () {
    this.fetchContestsAndContestEntries()
  },
  mounted () {
    this.userIsActive()
  },
  destroyed () {
    this.removeLatestEntry()
  }
}
</script>

<style lang="stylus" scoped>
@import '~@/css/config'
@import '~@/css/mixins'

.contest-registration-successful-page 
  padding: 12px 15px
  text-align: center
.contest-name
  background-color: #E8F9E5
  padding: 0.675rem 0
  text-align: center
.contest-registration-info
  font-size: 14px
  p
    margin: 0
  span
    font-weight: 600
.contest-registration-start-time
  font-size: 14px
  font-weight: 600
  color: #3ca77c
  border: 1px solid #e8f9e5
  margin-top: 35px
  margin-bottom: 20px
  padding: 11px 0 11px 0
.contest-registration-transaction
  border: 1px solid #e6edef
  padding-bottom: 17px
  h3
    background-color: #e6edef
    padding: 8px 0
  p
    margin-bottom: 6px
  span 
    font-weight: 600
a.theme--light.v-btn.btn--more-info 
  margin-top: 42px
  border: 1px solid #3ca77c 
  color: #3ca77c 
  background-color: transparent
a.theme--light.v-btn.btn--done
  border: 1px solid #3ca77c
  background-color: #3ca77c
  color: #fff
  width: 100%
  margin: 80px 0 0 0
.contest-info-name-details--success
  display: inline-block
  background-image: url(icons-path'/'contest_success'.svg')
  height: 68px
  width: 68px
  margin-top: 58px
  margin-bottom: 13px
</style>
