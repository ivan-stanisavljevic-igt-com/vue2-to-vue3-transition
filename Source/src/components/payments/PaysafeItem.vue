<template>
  <div class="payments__instruments_item pay-safe" :class="{'diss': disabled}" v-if="isPaySafeAvailable" @click.stop="go2PaySafe()">
    <span class="piitem-picture"><img :src="mediaServer('/static/brand-img/' + brandKey + '/paysafe-instruments.png')" alt="paysafe-instruments"/></span>
    <span class="piitem-text">
      <div class="piitem-text-headline">{{ $t('Play+, ACH, Paysafe') }}</div>
      <div class="piitem-text-desc">{{ $t('Payments.PNM.Paysafe.Desc') }}</div>
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
    isPaySafeAvailable: () => store.getters['paysafe/isPaySafeAvailable'],
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
    go2PaySafe () {
      if (!this.disabled) this.$router.push({name: 'paysafe'})
    }
  }
}
</script>
<style lang="stylus" scoped>
</style>
