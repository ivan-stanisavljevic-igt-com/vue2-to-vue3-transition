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
    </div>
    <div class="play-limits-container " v-if="timeLimitsAvailable" :class="{ 'postregtimelimits': isOnRegistration}">
      <TimeLimits :isOnRegistration="isOnRegistration"/>
      <div v-if="isOnRegistration"></div>
    </div>
  </div>
</template>

<script>
  import store from '@/store'
  import TimeLimits from '@/components/account/AccountTimeLimitsComponent'
  import Branding from '@/components/mixins/Branding'
  import Limit from '@/components/account/Limits/Limit' // 'LimitV2' is 'newer' version of component, 'Limit' is 'older' version of component
  export default {
    mixins: [
      Branding
    ],
    props: ['isOnRegistration'],
    components: {
      TimeLimits, Limit
    },
    data: () => ({
    }),
    computed: {
      isLoggedIn () {
        return store.getters['isLoggedIn']
      },
      timeLimitsAvailable: () => store.getters['limits/timeLimits'],
      accountSummaryFlow () {
        return window.ctsautoconf.ACCOUNT_SUMMARY_FLOW || false
      },
      playLimits: () => store.getters['limits/playLimits']
    },
    methods: {
    },
    mounted () {
      store.dispatch('limits/fetchPlayLimits')
      store.dispatch('limits/fetchTimeLimits')
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
    h2
      text-align center
    .limits-container
      display grid
      grid-template-columns repeat(2, 1fr)
      grid-gap 5px 32px
      @media mobile-big-and-below
        grid-template-columns 1fr
        grid-gap 5px 0
        padding 0 10px
    .loader
      text-align center
  .postregtimelimits
    display grid
    grid-template-columns repeat(2, 1fr)
    grid-gap 5px 32px
    @media mobile-big-and-below
      grid-template-columns 1fr
      grid-gap 5px 0
      padding 0 10px
</style>
