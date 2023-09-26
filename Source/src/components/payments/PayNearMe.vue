<template>
  <div class="payment__instrument">
    <div class="label">{{ $t('Transaction.PayNearMe') }}</div>
    <p class="desc">{{ $t('Transaction.PayNearMe.Desc') }}</p>
    <div class="logo-container">
      <div class="logo-container-inner">
        <img class="pnm-img" :src="mediaServer('/static/brand-img/' + brandKey + '/pay-near-me.png')" alt="pnm"/>
      </div>
    </div>
    <div class="pi-btns-wrapper">
      <div v-if="!isPNMProcessing">
        <v-btn color="success" @click="getCode4PNM" :disabled="!customerCanDeposit" large>{{ $t('Transaction.PayNearMe.GetCode') }}</v-btn>
      </div>
      <div v-if="isPNMProcessing" class="processing-wrapper">
        <span class="pw">
          <v-progress-circular indeterminate class="redirecting-circular-progress"></v-progress-circular>
          {{ defaultProcessingMessage }}
        </span>
      </div>
    </div>
    <div class="go-back" @click="goToHomepage()">
      <v-icon>navigate_before</v-icon>
      <span>{{ back }}</span>
    </div>
    <PNMDialog v-if="pnmDialog && !isMobileApp" :pnmDialog="pnmDialog" :url="pnmURL"></PNMDialog>
  </div>
</template>
<script>
import store from '@/store'
import PNMDialog from '@/components/common/PNMDialog'
import Url from '@/components/mixins/Url'
export default {
  components: {
    PNMDialog
  },
  mixins: [Url],
  methods: {
    getCode4PNM: () => {
      store.dispatch('payNearMe/getBarcode')
    },
    goToHomepage () {
      if (this.pnmOnlyDeposit && this.depositType) return this.$router.push({ path: '/home' })
      this.$router.push({name: 'wallet-page'})
    }
  },
  computed: {
    defaultProcessingMessage () {
      return this.$t('Transaction.PleaseWait')
    },
    isPNMProcessing: () => store.getters['payNearMe/getProcessing'],
    pnmURL: () => store.getters['payNearMe/getRedirectionUrl'],
    pnmDialog () {
      return !this.isPNMProcessing && this.pnmURL
    },
    isMobileApp: () => window.ctsautoconf.MOBILE_LS,
    brandKey: () => window.ctsautoconf.BRAND,
    pnmOnlyDeposit: () => store.getters['payments/pnmOnlyDeposit'],
    transactionType: () => store.getters['payments/transactionType'],
    depositType () {
      return this.transactionType && this.transactionType === 'deposit'
    },
    back () {
      return (this.pnmOnlyDeposit) ? this.$t('Header.navigationBack') : this.$t('Transaction.GoBack')
    },
    customerContext: () => store.getters['getCustomerContext'],
    customerCanDeposit () {
      return this.customerContext && this.customerContext.ActionDeposit
    }
  },
  destroyed: () => {
    store.commit('payNearMe/setRedirectionUrl', false)
  }
}
</script>
<style lang="stylus" scoped>
@import "~@/css/config"
.processing-wrapper
  margin 8px auto
  color: #fff
  text-align center
  display flex
  justify-content center
  align-items center
  span
    margin-left 5px
  .pw
    color #21335a
    margin-left 8px
    margin-right 8px
    .redirecting-circular-progress
      height 18px !important
      width 18px !important
      margin-right 2px
      margin-top -4px
    .redirecting-text
      style inline-flex
      vertical-align middle
.logo-container
  display flex
  margin-bottom 5px
  text-align center
  .logo-container-inner
    flex-direction column
    align-items flex-start  
    .pnm-img
      max-width 40%
      @media mobile-big-and-below
        max-width 80%
        height auto
</style>
