<template>
  <div>
    <div v-if="isLoggedIn" class="exclusions">
      <h1 v-if="!accountSummaryFlow">{{ $t('Account.Exclusions') }}</h1>
      <CoolOff/>
      <SelfExclusion/>
    </div>
  </div>
</template>

<script>
import store from '@/store'
import CoolOff from '@/components/account/Exclusions/CoolOffBreak'
import SelfExclusion from '@/components/account/Exclusions/SelfExclusion'
export default {
  mixins: [ ],
  components: {
    CoolOff,
    SelfExclusion
  },
  data: () => ({
  }),
  computed: {
    isLoggedIn () {
      return store.getters['isLoggedIn']
    },
    accountSummaryFlow () {
      return window.ctsautoconf.ACCOUNT_SUMMARY_FLOW || false
    }
  },
  methods: {
  },
  mounted () {
  }
}
</script>

<style lang="stylus" scoped>
  @import "~@/css/config"
  .exclusions
    text-align center
    cursor default
    @media mobile-big-and-below
      padding 10px
</style>
