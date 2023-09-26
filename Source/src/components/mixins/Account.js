import store from '@/store'

export default {
  computed: {
    customerContext () {
      return store.getters['getCustomerContext']
    },
    walletBalances () {
      return store.getters['getWalletBalance']
    },
    balances () {
      return this.customerContext && this.customerContext.Balances && this.customerContext.Balances.find(b => b.Key === 'CREDIT')
    },
    totalBalanceValue () {
      return (this.balances && this.balances.Amount) || 0
    },
    promoBalance () {
      return this.balances && this.balances.Promo
    },
    siteTradingBalanceSHW () {
      return this.balances && this.balances.Ammount
    },
    siteCreditBalance () {
      let balance = this.walletBalances && this.walletBalances.balances && this.walletBalances.balances.filter(balance => balance.type === 'RM')
      return (balance && balance[0] && balance[0].amount) || 0
    },
    totalCacheBalance () {
      let balance = this.externalWalletBalances && this.externalWalletBalances.balances && this.externalWalletBalances.balances.filter(balance => balance.type === 'RM')
      return (balance && balance[0] && balance[0].amount) || 0
    }

  },

  methods: {

  },

  created () {

  }
}
