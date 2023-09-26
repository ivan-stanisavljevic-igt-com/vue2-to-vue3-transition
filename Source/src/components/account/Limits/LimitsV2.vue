<template>
  <div :class="['page-content account', {'not-acc-sf': !accountSummaryFlow}]">
    <div class="limits" v-if="isLoggedIn">
      <h1 v-if="!accountSummaryFlow">{{ $t('Account.PlayLimits') }}</h1>
      <div class="loader" v-if="!playLimits">
        <v-progress-circular indeterminate class="circular-progress"></v-progress-circular>
      </div>
      <div class="limits-container" v-if="playLimits">
        <div v-for="(limit, index) in playLimits" :key="index">
          <Limit :limit="limit" :isOnRegistration="isOnRegistration"/>
        </div>
      </div>
      <div class="limits-container" v-if="timeLimits">
        <div v-for="(limit, index) in timeLimits" :key="index">
          <TimeLimit :limit="limit" :isOnRegistration="isOnRegistration"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import store from '@/store'
  import Branding from '@/components/mixins/Branding'
  import Limit from '@/components/account/Limits/LimitV2'
  import TimeLimit from '@/components/account/Limits/TimeLimit'
  import { sortTimeLimits } from '@/store/modules/wallet/limits'

  export default {
    props: ['isOnRegistration'],
    mixins: [
      Branding
    ],
    components: {
      TimeLimit, Limit
    },
    data: () => ({
    }),
    computed: {
      isLoggedIn () {
        return store.getters['isLoggedIn']
      },
      accountSummaryFlow () {
        return window.ctsautoconf.ACCOUNT_SUMMARY_FLOW || false
      },
      playLimits: () => store.getters['limits/playLimits'],
      timeLimits () {
        const unsorted = store.getters['limits/timeLimits']
        return sortTimeLimits(unsorted)
      }
    },
    methods: {
    },
    mounted () {
      store.dispatch('limits/fetchPlayLimits')
      store.dispatch('limits/fetchTimeLimitsV2')
    }
  }
</script>

<style lang="stylus" scoped>
  @import '~@/css/config'
  .page-content.account
    flex-direction column
    &.not-acc-sf
      .limits-container
        grid-template-columns 1fr
        grid-gap 5px 0
        &:last-child
          margin-top 5px
    h2
      text-align center
    .limits-container
      display grid
      grid-template-columns repeat(2, 1fr)
      grid-gap 5px 32px
      &:last-child
        margin-top 5px
      @media mobile-big-and-below
        grid-template-columns 1fr
        grid-gap 5px 0
        padding 0 10px
    .loader
      text-align center
</style>
