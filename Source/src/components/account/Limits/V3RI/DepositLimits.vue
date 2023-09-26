<template>
  <div :class="['page-content account', {'not-acc-sf': !accountSummaryFlow}]">
    <div class="limits" v-if="isLoggedIn">
      <h1 v-if="!accountSummaryFlow">{{ $t('Account.PlayLimits') }}</h1>
      <div class="loader" v-if="!depositLimits">
        <v-progress-circular indeterminate class="circular-progress"></v-progress-circular>
      </div>
      <div class="limits-container" v-if="depositLimits">
        <div v-for="(limit, index) in depositLimits" :key="index">
          <Limit :limit="limit"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import store from '@/store'
  import Branding from '@/components/mixins/Branding'
  import Limit from '@/components/account/Limits/LimitV2'
  export default {
    mixins: [
      Branding
    ],
    components: {
      Limit
    },
    computed: {
      isLoggedIn () {
        return store.getters['isLoggedIn']
      },
      accountSummaryFlow () {
        return window.ctsautoconf.ACCOUNT_SUMMARY_FLOW || false
      },
      playLimits () {
        return store.getters['limits/playLimits']
      },
      depositLimits () {
        return this.playLimits && this.playLimits.filter(l => l.idmmlmtype === 'DEPOSIT')
      }
    },
    mounted () {
      store.dispatch('limits/fetchPlayLimits')
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
