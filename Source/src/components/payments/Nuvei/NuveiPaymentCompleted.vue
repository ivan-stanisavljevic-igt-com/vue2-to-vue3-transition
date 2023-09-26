<template>
  <div class="caca">
    <div v-if="balanceLoader || processing" class="payments__spinner">
      <v-progress-circular indeterminate class="redirecting-circular-progress"></v-progress-circular>
      {{ $t('Transaction.PleaseWait') }}
    </div>
    <div v-else>
      <h2><v-icon color="success" class="mr-1">check_circle</v-icon>{{ $t('Payments.PNM.Completed.Headline') }}</h2>
      <div v-if="transactionType==='deposit'">{{ $t('Payments.Nuvei.Completed.Deposit') }} {{ balance | currency }}</div>
      <div v-if="transactionType==='withdrawal'">{{ $t('Payments.Nuvei.Completed.Withdrawal') }} {{ balance | currency }}</div>
      <!-- Back to homepage -->
      <div class="goto__home">
        <v-btn large color="success" @click="goToHomepage()">{{ $t('Account.ChangePassword.GoToHomepage') }}</v-btn>
      </div>
    </div>
    <NuveiEventDispatcher :paymentIsCompleted="true"/>
  </div>
</template>
<script>
import store from '@/store'
import NuveiEventDispatcher from '@/components/payments/Nuvei/NuveiEventDispatcher'

export default {
  components: {
    NuveiEventDispatcher
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
    processing () {
      return store.getters[`nuvei/${this.currentPaymentType}/processing`]
    },
    isNOTOpenedFromIFrame () {
      return window.top === window.self
    },
    IDMMSITXRequest () {
      return store.getters[`nuvei/${this.currentPaymentType}/getIDMMSITXRequest`]
    },
    currentPaymentType () {
      return store.getters['nuvei/currentNuveiType']
    },
    isUPOWithdrawal () {
      return ['nuveiWdCard', 'nuveiWdPayPal', 'nuveiWdACH', 'nuveiWdPlayPlus', 'nuveiWdVipp'].includes(this.currentPaymentType)
    }
  },
  methods: {
    goToHomepage () {
      this.$router.push({name: 'home'})
    },
    async completeTransaction () {
      store.commit(`nuvei/${this.currentPaymentType}/setMerchantUniqueID`, (new URLSearchParams(window.location.search)).get('merchant_unique_id').split('#')[0])
      await store.dispatch(`nuvei/${this.currentPaymentType}/completeRBWRequest`, Object.fromEntries(new URLSearchParams(window.location.search)))
      await store.dispatch(`nuvei/${this.currentPaymentType}/startPollingTransaction`)
    }
  },
  mounted () {
    // 'currentPaymentType !== null' indicates that the payment process has already started
    if (this.isNOTOpenedFromIFrame && this.currentPaymentType && !this.isUPOWithdrawal) {
      this.completeTransaction()
      store.commit('nuvei/scheduleCardCheck', true)
    }
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
