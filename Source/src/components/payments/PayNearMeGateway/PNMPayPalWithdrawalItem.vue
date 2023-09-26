<template>
  <div class="payments__instruments_item pnm-push-debit" 
    :class="{'diss': !customerCanWithdraw}" 
    v-if="isPNMPayPalWithdrawalAvailable" 
    @click.stop="go2PNMPayPalWithdrawal()" 
    ref="pnmPayPal">
    <span class="piitem-picture"><img :src="mediaServer('/static/brand-img/' + brandKey + '/paypal.svg')" alt="paypal"/></span>
    <span class="piitem-text">
       <div class="piitem-text-headline">{{ $t('Payments.PNM.PayPal.Headline') }}</div>
       <div class="piitem-text-desc">{{ $t('Payments.PNM.PayPalWithdrawal.Desc') }}</div>
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
    isPNMPayPalAvailable: () => store.getters['pnmGateway/pnmPayPal/isPNMPayPalAvailable'],
    isPNMPayPalWithdrawalAvailable () {
      return this.isPNMPushDebitAvailable && this.isPNMPayPalAvailable
    },
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
    go2PNMPayPalWithdrawal () {
      if (this.customerCanWithdraw) this.$router.push({name: 'pnm-paypal-withdrawal'})
    }
  }
}
</script>
<style lang="stylus" scoped>
</style>
