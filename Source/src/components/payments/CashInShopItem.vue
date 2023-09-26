<template>
  <div class="payments__instruments_item cashinshop"
       :class="{'diss': !customerCanWithdraw}"
       v-if="isCashInShopAvailable"
       @click.stop="go2CashInShop()">
    <span class="piitem-picture"><img :src="mediaServer('/static/brand-img/' + brandKey + '/cashinshop.svg')" alt="cash"/></span>
    <span class="piitem-text">
      <div class="piitem-text-headline">{{ $t('Transaction.CashInShop') }}</div>
      <div class="piitem-text-desc">{{ $t('Transaction.CashInShop.Description') }}</div>
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
    isCashInShopAvailable: () => store.getters['cashinshop/isCashInShopAvailable'],
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
    go2CashInShop () {
      if (this.customerCanWithdraw) this.$router.push({name: 'withdrawal-cashinshop'})
    }
  }
}
</script>
<style lang="stylus" scoped>
</style>
