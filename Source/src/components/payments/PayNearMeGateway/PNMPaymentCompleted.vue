<template>
  <div class="caca">
    <div v-if="balanceLoader || processing" class="payments__spinner">
      <v-progress-circular indeterminate class="redirecting-circular-progress"></v-progress-circular>
      {{ $t('Transaction.PleaseWait') }}
    </div>
    <div v-else>
      <h2><v-icon color="success" class="mr-1">check_circle</v-icon>{{ $t('Payments.PNM.Completed.Headline') }}</h2>
      <div v-if="transactionType==='deposit'">{{ $t('Payments.PNM.Completed.Deposit') }}</div>
      <div v-if="transactionType==='withdrawal'">{{ $t('Payments.PNM.Completed.Withdrawal') }}</div>
      <!-- Back to homepage -->
      <div class="goto__home">
        <v-btn large color="success" @click="goToHomepage()">{{ $t('Account.ChangePassword.GoToHomepage') }}</v-btn>
      </div>
    </div>
    <PNMEventDispatcher :paymentIsCompleted="true"/>
  </div>
</template>
<script>
import store from '@/store'
import PNMEventDispatcher from '@/components/payments/PayNearMeGateway/PNMEventDispatcher'
import paymentAnalytics from '@/library/payments/paymentAnalytics'

export default {
  components: {
    PNMEventDispatcher
  },
  computed: {
    customerContext: () => store.getters['getCustomerContext'],
    balanceLoader () {
      return store.getters['getBalanceLoader']
    },
    balance () {
      return (this.customerContext && this.customerContext.Balances && this.customerContext.Balances.find(b => b.Key === 'CREDIT').Trading) || 0
    },
    transactionType: () => store.getters['payments/transactionType'],
    processing: () => store.getters['pnmGateway/processing'],
    isNotOpenedFromIFrame: () => window.top === window.self
  },
  methods: {
    goToHomepage () {
      this.$router.push({name: 'home'})
    },
    checkTransactionAndRefreshBalance () {
      store.dispatch('pnmGateway/startPollingTransaction')
    },
    sendAnalytics () {
      if (this.isNotOpenedFromIFrame) {
        paymentAnalytics.sendAnalytics(paymentAnalytics.paymentStatus.SUCCESS)
      }
    }
  },
  mounted () {
    // this.checkTransactionAndRefreshBalance()
    this.sendAnalytics()
  }
}
</script>
<style lang="stylus" scoped>
@import "~@/css/config"
.caca
  @media mobile-big-and-below
    background white
    padding 10px
  .goto__home
    margin-top 10px
    text-align center
</style>
