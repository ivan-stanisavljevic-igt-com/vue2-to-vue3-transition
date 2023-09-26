<template>
  <div class="payments__instruments_item pnm-push-debit" 
    :class="{'diss': !customerCanWithdraw}" 
    v-if="isPNMPushDebitAvailable" 
    @click.stop="go2PNMPushDebit()" 
    ref="pnmPushDebit">
    <span class="piitem-picture"><img :src="mediaServer('/static/brand-img/' + brandKey + '/cash.svg')" alt="cash"/></span>
    <span class="piitem-text">
       <div class="piitem-text-headline">{{ $t('Payments.PNM.PushDebit.Headline') }}</div>
       <div class="piitem-text-desc">{{ $t('Payments.PNM.PushDebit.Desc') }}</div>
    </span>
    <span class="piitem-arrow"><v-icon>chevron_right</v-icon></span>
  </div>
</template>
<script>
import store from '@/store'
import Url from '@/components/mixins/Url'
import Branding from '@/components/mixins/Branding'

export default {
  mixins: [Url, Branding],
  computed: {
    isPNMPushDebitAvailable: () => store.getters['pnmGateway/pnmPushDebit/isPNMPushDebitAvailable'],
    transactionType: () => store.getters['payments/transactionType'],
    withdrawType () {
      return this.transactionType && this.transactionType === 'withdrawal'
    },
    customerContext: () => store.getters['getCustomerContext'],
    customerCanWithdraw () {
      return this.customerContext && this.customerContext.ActionWithdraw
    }
  },
  methods: {
    go2PNMPushDebit () {
      if (this.customerCanWithdraw) this.$router.push({name: 'pnm-push'})
    }
  }
}
</script>
<style lang="stylus" scoped>
</style>
