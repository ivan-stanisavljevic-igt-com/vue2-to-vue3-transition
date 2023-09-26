<template>
    <div>
      <!-- <template v-if="accountSummaryFlow">
        <h1 v-if="!mobileBigAndBelow">{{ $t('Account.ReferAFriend.Title') }}</h1>
        <div v-if="mobileBigAndBelow" class="account-heading"><icon name="icon-acc-raf"></icon>{{ $t('Account.ReferAFriend.Title') }}</div>
      </template> -->
       <template v-if="!accountSummaryFlow">
        <h1>{{ $t('Account.ReferAFriend.Title') }}</h1>
      </template>
       <refer-info></refer-info>
    </div>
</template>
<script>
import referInfo from './ReferAFriendInfo.vue'
import Screen from '@/components/mixins/Screen'
import Icon from '@/components/common/Icon'
export default {
  components: {
    referInfo,
    Icon
  },

  mixins: [
    Screen
  ],

  name: 'referAFriend',

  data () {
    return {
      test: 'test'
    }
  },
  computed: {
    accountSummaryFlow () {
      return window.ctsautoconf.ACCOUNT_SUMMARY_FLOW || false
    }
  }
}
</script>
<style lang="stylus" scoped>
@import '~@/css/config'
@import '~@/css/mixins'


</style>