<template>
  <div class="payments__instruments_item sightline-superbook" :class="{'diss': disabled}" v-if="isSightlineAvailable && brandKey ==='sb'" @click.stop="go2SBSightline()">
    <span class="piitem-picture"><img :src="mediaServer('/static/brand-img/' + brandKey + '/sightline.png')" alt="play+"/></span>
    <span class="piitem-text">
      <div class="piitem-text-headline">{{ $t('Transaction.Sightline') }}</div>
      <div class="piitem-text-desc">{{ $t('Payments.PlayPlus.Desc') }}</div>
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
    isSightlineAvailable: () => store.getters['payments/isSightlineAvailable'],
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
    go2SBSightline () {
      if (!this.disabled) this.$router.push({name: 'sightline-sb'})
    }
  }
}
</script>
<style lang="stylus" scoped>
</style>
