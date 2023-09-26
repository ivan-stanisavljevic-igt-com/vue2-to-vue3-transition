<template>
  <div class="payments__instruments_item pay-near-me" :class="{'diss': disabled}" v-if="isPNMAvailable" @click.stop="go2PayNearMe()">
    <span class="piitem-picture"><img :src="mediaServer('/static/brand-img/' + brandKey + '/paynearme.svg')" alt="pnm"/></span>
    <span class="piitem-text">
      <div class="piitem-text-headline">{{ $t('Transaction.PayNearMe') }}</div>
      <div class="piitem-text-desc">{{ $t('Transaction.PayNearMe.Desc') }}</div>
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
    isPNMAvailable: () => store.getters['payNearMe/isPayNearMeAvailable'],
    transactionType: () => store.getters['payments/transactionType'],
    depositType () {
      return this.transactionType && this.transactionType === 'deposit'
    },
    withdrawType () {
      return this.transactionType && this.transactionType === 'withdrawal'
    },
    customerContext: () => store.getters['getCustomerContext'],
    customerCanDeposit () {
      return this.customerContext && this.customerContext.ActionDeposit
    },
    customerCanWithdraw () {
      return this.customerContext && this.customerContext.ActionWithdraw
    },
    disabled () {
      return (this.depositType && !this.customerCanDeposit) || (this.withdrawType && !this.customerCanWithdraw)
    }
  },
  methods: {
    go2PayNearMe () {
      if (this.customerCanDeposit) this.$router.push({name: 'pnm'})
    }
  }
}
</script>
<style lang="stylus" scoped>
</style>
