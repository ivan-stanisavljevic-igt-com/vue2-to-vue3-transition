<template>
  <div class="payments__instruments_item sightline" :class="{'diss': disabled}" v-if="isSightlineAvailable" @click.stop="go2Sightline()">
    <span class="piitem-picture"><img :src="mediaServer('/static/brand-img/' + brandKey + '/sightline.png')" alt="play+"/></span>
    <span class="piitem-text">
      <div class="piitem-text-headline">{{ $t('Transaction.Sightline') }}</div>
      <div v-if="depositType" class="piitem-text-desc">{{ $t('Payments.PlayPlus.Desc') }}</div>
      <div v-if="withdrawType" class="piitem-text-desc">{{ $t('Payments.PlayPlus.Desc.Withdraw') }}</div>
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
    go2Sightline () {
      if (!this.disabled) this.$router.push({name: 'sightline'})
    }
  }
}
</script>
<style lang="stylus" scoped>
</style>
