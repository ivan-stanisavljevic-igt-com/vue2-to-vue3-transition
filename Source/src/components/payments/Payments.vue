<template>
  <div class="payments">
    <div class="payments__spinner" v-if="paymentsSpinner">
      <v-progress-circular indeterminate></v-progress-circular>
      {{ $t('Transaction.PleaseWait') }}
    </div>
    <div v-else>
      <h2 class="payments__title">{{ $t('Transaction.Cashier') }}</h2>
      <div class="payments__instruments">
        <div v-if="depositType">
          <div v-if="brandKey === 'generic-coyotes'">
            <PNMAch class="payments__instruments_item pnm-ach" :class="{'diss': !customerCanDeposit}" v-if="isPNMAchAvailable" ref="pnmAch" @click.native="xtremepushEvent('deposit', 'payNearMe')" :type="'pnmAch'"></PNMAch>
            <PNMDebit class="payments__instruments_item pnm-debit" :class="{'diss': !customerCanDeposit}" v-if="isPNMDebitAvailable" ref="pnmDebit" @click.native="xtremepushEvent('deposit', 'payNearMe')" :type="'pnmDebit'"></PNMDebit>
            <PNMPayPal class="payments__instruments_item pnm-paypal" :class="{'diss': !customerCanDeposit}" v-if="isPNMPayPalAvailable" ref="pnmPayPal" @click.native="xtremepushEvent('deposit', 'payNearMe')" :type="'pnmPayPal'"></PNMPayPal>
            <PNMCredit class="payments__instruments_item pnm-credit" :class="{'diss': !customerCanDeposit}" v-if="isPNMCreditAvailable" ref="pnmCredit" @click.native="xtremepushEvent('deposit', 'payNearMe')" :type="'pnmCredit'"></PNMCredit>
            <PNMVenmo class="payments__instruments_item pnm-venmo" :class="{'diss': !customerCanDeposit}" v-if="isPNMVenmoAvailable" ref="pnmVenmo" @click.native="xtremepushEvent('deposit', 'payNearMe')" :type="'pnmVenmo'"></PNMVenmo>
            <PNMAPay class="payments__instruments_item pnm-apay" :class="{'diss': !customerCanDeposit}" v-if="isPNMAPayAvailable && isiOS" ref="pnmAPay" @click.native="xtremepushEvent('deposit', 'payNearMe')" :type="'pnmAPay'"></PNMAPay>
            <PNMGPay class="payments__instruments_item pnm-gpay" :class="{'diss': !customerCanDeposit}" v-if="isPNMGPayAvailable" ref="pnmGPay" @click.native="xtremepushEvent('deposit', 'payNearMe')" :type="'pnmGPay'"></PNMGPay>
            <SightlineItem @click.native="xtremepushEvent('deposit', 'sightline')"/>
            <PNMCash class="payments__instruments_item pnm-cash" :class="{'diss': !customerCanDeposit}" v-if="isPNMCashAvailable" ref="pnmCash" @click.native="xtremepushEvent('deposit', 'payNearMe')" :type="'pnmCash'"></PNMCash>
            <PaysafeItem @click.native="xtremepushEvent('deposit', 'payNearMe')"/>
          </div>
          <div v-else>
            <PaysafeItem @click.native="xtremepushEvent('deposit', 'paySafe')"/>
            <SightlineSBItem @click.native="xtremepushEvent('deposit', 'sightline')"/>
            <SightlineItem @click.native="xtremepushEvent('deposit', 'sightline')"/>
            <PayNearMeItem @click.native="xtremepushEvent('deposit', 'payNearMe')"/>
            <PNMDebit class="payments__instruments_item pnm-debit" :class="{'diss': !customerCanDeposit}" v-if="isPNMDebitAvailable" ref="pnmDebit" @click.native="xtremepushEvent('deposit', 'payNearMe')" :type="'pnmDebit'"></PNMDebit>
            <PNMCredit class="payments__instruments_item pnm-credit" :class="{'diss': !customerCanDeposit}" v-if="isPNMCreditAvailable" ref="pnmCredit" @click.native="xtremepushEvent('deposit', 'payNearMe')" :type="'pnmCredit'"></PNMCredit>
            <PNMCash class="payments__instruments_item pnm-cash" :class="{'diss': !customerCanDeposit}" v-if="isPNMCashAvailable" ref="pnmCash" @click.native="xtremepushEvent('deposit', 'payNearMe')" :type="'pnmCash'"></PNMCash>
            <PNMAch class="payments__instruments_item pnm-ach" :class="{'diss': !customerCanDeposit}" v-if="isPNMAchAvailable" ref="pnmAch" @click.native="xtremepushEvent('deposit', 'pnmAch')" :type="'pnmAch'"></PNMAch>
            <PNMAPay class="payments__instruments_item pnm-apay" :class="{'diss': !customerCanDeposit}" v-if="isPNMAPayAvailable && isiOS" ref="pnmAPay" @click.native="xtremepushEvent('deposit', 'payNearMe')" :type="'pnmAPay'"></PNMAPay>
            <PNMGPay class="payments__instruments_item pnm-gpay" :class="{'diss': !customerCanDeposit}" v-if="isPNMGPayAvailable" ref="pnmGPay" @click.native="xtremepushEvent('deposit', 'payNearMe')" :type="'pnmGPay'"></PNMGPay>
            <PNMPayPal class="payments__instruments_item pnm-paypal" :class="{'diss': !customerCanDeposit}" v-if="isPNMPayPalAvailable" ref="pnmPayPal" @click.native="xtremepushEvent('deposit', 'payNearMe')" :type="'pnmPayPal'"></PNMPayPal>
            <PNMVenmo class="payments__instruments_item pnm-venmo" :class="{'diss': !customerCanDeposit}" v-if="isPNMVenmoAvailable" ref="pnmVenmo" @click.native="xtremepushEvent('deposit', 'payNearMe')" :type="'pnmVenmo'"></PNMVenmo>
            <NuveiCard class="payments__instruments_item nuvei-card" :class="{'diss': !customerCanDeposit}" v-if="isNuveiCardAvailable" ref="nuveiCard" @click.native="xtremepushEvent('deposit', 'nuvei')" :type="'nuveiCard'"></NuveiCard>
            <NuveiPayPal class="payments__instruments_item nuvei-paypal" :class="{'diss': !customerCanDeposit}" v-if="isNuveiPayPalAvailable" ref="nuveiPayPal" @click.native="xtremepushEvent('deposit', 'nuvei')" :type="'nuveiPayPal'"></NuveiPayPal>
            <NuveiVP class="payments__instruments_item nuvei-vp" :class="{'diss': !customerCanDeposit}" v-if="isNuveiVPAvailable" ref="nuveiVP" @click.native="xtremepushEvent('deposit', 'nuvei')" :type="'nuveiVP'"></NuveiVP>
            <NuveiACH class="payments__instruments_item nuvei-ach" :class="{'diss': !customerCanDeposit}" v-if="isNuveiACHAvailable" ref="nuveiACH" @click.native="xtremepushEvent('deposit', 'nuvei')" :type="'nuveiACH'"></NuveiACH>
            <NuveiAPay class="payments__instruments_item nuvei-apay" :class="{'diss': !customerCanDeposit}" v-if="isNuveiAPayAvailable && isiOS" ref="nuveiAPay" @click.native="xtremepushEvent('deposit', 'nuvei')" :type="'nuveiAPay'"></NuveiAPay>
            <NuveiPNM class="payments__instruments_item nuvei-pnm" :class="{'diss': !customerCanDeposit}" v-if="isNuveiPNMAvailable" ref="nuveiPNM" @click.native="xtremepushEvent('deposit', 'nuvei')" :type="'nuveiPNM'"></NuveiPNM>
            <NuveiPlayPlus class="payments__instruments_item nuvei-play-plus" :class="{'diss': !customerCanDeposit}" v-if="isNuveiPlayPlusAvailable" ref="nuveiPlayPlus" @click.native="xtremepushEvent('deposit', 'nuvei')" :type="'nuveiPlayPlus'"></NuveiPlayPlus>
            <NuveiVenmo class="payments__instruments_item nuvei-venmo" :class="{'diss': !customerCanDeposit}" v-if="isNuveiVenmoAvailable" ref="nuveiVenmo" @click.native="xtremepushEvent('deposit', 'nuvei')" :type="'nuveiVenmo'"></NuveiVenmo>
          </div>
        </div>
        <div v-if="withdrawType">
          <div v-if="brandKey === 'generic-coyotes'">
            <PNMPushDebitItem @click.native="xtremepushEvent('withdrawal', 'payNearMe')"/>
            <PNMPayPalWithdrawalItem @click.native="xtremepushEvent('withdrawal', 'payNearMe')"/>
            <SightlineItem @click.native="xtremepushEvent('withdrawal', 'sightline')"/>
            <CashInShopItem @click.native="xtremepushEvent('withdrawal', 'cashInShop')"/>
            <PaysafeItem @click.native="xtremepushEvent('withdrawal', 'paySafe')"/>
          </div>
          <div v-else>
            <PaysafeItem @click.native="xtremepushEvent('withdrawal', 'paySafe')"/>
            <SightlineSBItem @click.native="xtremepushEvent('withdrawal', 'sightline')"/>
            <SightlineItem @click.native="xtremepushEvent('withdrawal', 'sightline')"/>
            <PNMPushDebitItem @click.native="xtremepushEvent('withdrawal', 'payNearMe')"/>
            <CashInShopItem @click.native="xtremepushEvent('withdrawal', 'cashInShop')"/>
            <PNMPayPalWithdrawalItem @click.native="xtremepushEvent('withdrawal', 'payNearMe')"/>
            <NuveiWdCardLink @click.native="xtremepushEvent('withdrawal-card', 'nuvei')"></NuveiWdCardLink>
            <NuveiWdPayPalLink @click.native="xtremepushEvent('withdrawal', 'nuvei')"></NuveiWdPayPalLink>
            <NuveiWdACHLink @click.native="xtremepushEvent('withdrawal', 'nuvei')"></NuveiWdACHLink>
            <NuveiWdPlayPlusLink @click.native="xtremepushEvent('withdrawal', 'nuvei')"></NuveiWdPlayPlusLink>
            <NuveiWdVippLink @click.native="xtremepushEvent('withdrawal', 'nuvei')"></NuveiWdVippLink>
          </div>
        </div>
      </div>
    </div>
    <PNMEventDispatcher/>
    <NuveiEventDispatcher/>
  </div>
</template>
<script>
import CircularRotate from '@/components/common/CircularRotate'
import Screen from '@/components/mixins/Screen'
import Forms from '@/components/mixins/Forms'
import ProcessingDialog from '@/components/common/ProcessingDialog'
import Url from '@/components/mixins/Url'
import Branding from '@/components/mixins/Branding'
import store from '@/store'
import PNMDebit from '@/components/payments/PayNearMeGateway/PNMDebit'
import PNMCredit from '@/components/payments/PayNearMeGateway/PNMCredit'
import PNMCash from '@/components/payments/PayNearMeGateway/PNMCash'
import PNMAch from '@/components/payments/PayNearMeGateway/PNMAch'
import PNMGPay from '@/components/payments/PayNearMeGateway/PNMGPay'
import PNMAPay from '@/components/payments/PayNearMeGateway/PNMAPay'
import PNMPayPal from '@/components/payments/PayNearMeGateway/PNMPayPal'
import PNMVenmo from '@/components/payments/PayNearMeGateway/PNMVenmo'
import userAgent from '@/library/core/userAgent'
import PNMEventDispatcher from '@/components/payments/PayNearMeGateway/PNMEventDispatcher'
import PaysafeItem from '@/components/payments/PaysafeItem'
import SightlineSBItem from '@/components/payments/sb/SightlineSBItem'
import SightlineItem from '@/components/payments/SightlineItem'
import PayNearMeItem from '@/components/payments/PayNearMeItem'
import PNMPushDebitItem from '@/components/payments/PayNearMeGateway/PNMPushDebitItem'
import CashInShopItem from '@/components/payments/CashInShopItem'
import PNMPayPalWithdrawalItem from '@/components/payments/PayNearMeGateway/PNMPayPalWithdrawalItem'
import NuveiCard from '@/components/payments/Nuvei/NuveiCard'
import NuveiEventDispatcher from '@/components/payments/Nuvei/NuveiEventDispatcher'
import NuveiPayPal from '@/components/payments/Nuvei/NuveiPayPal'
import NuveiVP from '@/components/payments/Nuvei/NuveiVP'
import NuveiACH from '@/components/payments/Nuvei/NuveiACH'
import NuveiAPay from '@/components/payments/Nuvei/NuveiAPay'
import NuveiPNM from '@/components/payments/Nuvei/NuveiPNM'
import NuveiPlayPlus from '@/components/payments/Nuvei/NuveiPlayPlus'
import NuveiVenmo from '@/components/payments/Nuvei/NuveiVenmo'
import NuveiWd from '@/components/payments/Nuvei/NuveiWd'
import analyticsBridge from '@/library/analyticsBridge'
import NuveiWdCardLink from '@/components/payments/Nuvei/NuveiWdCardLink'
import NuveiWdPayPalLink from '@/components/payments/Nuvei/NuveiWdPayPalLink'
import NuveiWdACHLink from '@/components/payments/Nuvei/NuveiWdACHLink'
import NuveiWdPlayPlusLink from '@/components/payments/Nuvei/NuveiWdPlayPlusLink'
import NuveiWdVippLink from '@/components/payments/Nuvei/NuveiWdVippLink'
import nuveiManager from '@/library/payments/nuveiManager'

let viewModel
export default {
  components: {
    CircularRotate,
    ProcessingDialog,
    PNMDebit,
    PNMCredit,
    PNMCash,
    PNMAch,
    PNMGPay,
    PNMAPay,
    PNMEventDispatcher,
    PNMPayPal,
    PNMVenmo,
    PaysafeItem,
    SightlineSBItem,
    SightlineItem,
    PayNearMeItem,
    PNMPushDebitItem,
    CashInShopItem,
    PNMPayPalWithdrawalItem,
    NuveiCard,
    NuveiEventDispatcher,
    NuveiPayPal,
    NuveiVP,
    NuveiACH,
    NuveiAPay,
    NuveiPNM,
    NuveiPlayPlus,
    NuveiVenmo,
    NuveiWd,
    NuveiWdCardLink,
    NuveiWdPayPalLink,
    NuveiWdACHLink,
    NuveiWdPlayPlusLink,
    NuveiWdVippLink
  },
  mixins: [Screen, Forms, Url, Branding],
  computed: {
    fetchingPaymentTypes: () => store.getters['payments/fetchingPaymentTypes'],
    isPNMDebitAvailable: () => store.getters['pnmGateway/pnmDebit/isPNMDebitAvailable'],
    isPNMCreditAvailable: () => store.getters['pnmGateway/pnmCredit/isPNMCreditAvailable'],
    isPNMCashAvailable: () => store.getters['pnmGateway/pnmCash/isPNMCashAvailable'],
    isPNMAchAvailable: () => store.getters['pnmGateway/pnmAch/isPNMAchAvailable'],
    isPNMAPayAvailable: () => store.getters['pnmGateway/pnmAPay/isPNMAPayAvailable'],
    isPNMGPayAvailable: () => store.getters['pnmGateway/pnmGPay/isPNMGPayAvailable'],
    isPNMPayPalAvailable: () => store.getters['pnmGateway/pnmPayPal/isPNMPayPalAvailable'],
    isPNMVenmoAvailable: () => store.getters['pnmGateway/pnmVenmo/isPNMVenmoAvailable'],
    currentRef: () => store.getters['pnmGateway/currentRef'],
    currentNuveiRef: () => store.getters['nuvei/currentRef'],
    isiOS: () => userAgent.os.name === 'ios',
    transactionType: () => store.getters['payments/transactionType'],
    depositType () {
      return this.transactionType && this.transactionType === 'deposit'
    },
    withdrawType () {
      return this.transactionType && this.transactionType === 'withdrawal'
    },
    userIsVerifed: () => store.getters['getIsCustomerVerified'],
    accountSummaryFlow: () => window.ctsautoconf.ACCOUNT_SUMMARY_FLOW,
    customerContext: () => store.getters['getCustomerContext'],
    customerCanDeposit () {
      return this.customerContext && this.customerContext.ActionDeposit
    },
    customerCanWithdraw () {
      return this.customerContext && this.customerContext.ActionWithdraw
    },
    customerCanDepositAndWithdraw () {
      return this.customerCanDeposit && this.customerCanWithdraw
    },
    isMobileWeb () {
      return store.getters['screenState/getMobileBigAndBelow']
    },
    isMobileApp: () => window.ctsautoconf.MOBILE_LS,
    isMobile () {
      return this.isMobileWeb || this.isMobileApp
    },
    brandKey: () => window.ctsautoconf.BRAND,
    isNuveiCardAvailable: () => store.getters['nuvei/nuveiCard/isPaymentInstrumentAvailable'],
    isNuveiPayPalAvailable: () => store.getters['nuvei/nuveiPayPal/isPaymentInstrumentAvailable'],
    isNuveiVPAvailable: () => store.getters['nuvei/nuveiVP/isPaymentInstrumentAvailable'],
    isNuveiACHAvailable: () => store.getters['nuvei/nuveiACH/isPaymentInstrumentAvailable'],
    isNuveiAPayAvailable: () => store.getters['nuvei/nuveiAPay/isPaymentInstrumentAvailable'],
    isNuveiPNMAvailable: () => store.getters['nuvei/nuveiPNM/isPaymentInstrumentAvailable'],
    isNuveiPlayPlusAvailable: () => store.getters['nuvei/nuveiPlayPlus/isPaymentInstrumentAvailable'],
    isNuveiVenmoAvailable: () => store.getters['nuvei/nuveiVenmo/isPaymentInstrumentAvailable'],
    isNuveiWdAvailable: () => store.getters['nuvei/nuveiWd/isPaymentInstrumentAvailable'],
    isNuveiCardCheckProcessing: () => store.getters['nuvei/nuveiWd/cardCheckProcessing'],
    paymentsSpinner () {
      return this.fetchingPaymentTypes || (this.isNuveiCardCheckProcessing && this.withdrawType)
    },
    xtremePushEnabledMobile () { return window.ctsautoconf.XTREMEPUSH_ANALYTICS && window.ctsautoconf.XTREMEPUSH_ANALYTICS.MOBILE_APP } // for mobile apps only
  },
  methods: {
    closePNMIFrame () {
      if (this.$refs && this.$refs[this.currentRef]) {
        this.$refs[this.currentRef].closePNMIFrame()
      }
      if (this.currentRef === 'pnmPushDebit') {
        store.commit(`pnmGateway/pnmPushDebit/redirectionURL`, undefined)
        store.commit(`pnmGateway/currentRef`, null)
      }
    },
    closeNuveiIFrame () {
      if (this.$refs && this.$refs[this.currentNuveiRef]) {
        this.$refs[this.currentNuveiRef].closeNuveiIFrame()
      }
    },
    xtremepushEvent (type, provider) {
      if (window.xtremepush || this.xtremePushEnabledMobile) {
        let event = {
          'param1': 'event',
          'param2': 'page_view',
          'param3': {
            'pageName': document.title || 'wallet-page',
            'sport': 'N/A',
            'sportsbookTab': 'N/A',
            'pagePath': document.location.pathname,
            'destinationUrl': window.location.href,
            'paymentAction': type,
            'paymentProvider': provider
          }
        }
        analyticsBridge.xtremePush(event, false)
      }
    }
  },
  created () {
    viewModel = this
  },
  mounted () {
    nuveiManager.handleNuveiOnMount()
  }
}
window.addEventListener('message', params => {
  // ---------------- PAY NEAR ME ----------------
  if (params && params.data && params.data.data === 'closePNMIFrame') {
    /* if there is a viewModel reference, an iFrame is opened from this component
    if not, an iFrame is opened from pushDebit component, so we will broadcast an event
    and catch that event in the pushDebit component */
    if (viewModel) {
      viewModel.closePNMIFrame()
    }
    window.postMessage({
      data: 'closePNMPushDebitIFrame',
      URIqueryString: params && params.data && params.data.URIqueryString
    }, '*')
  }
  if (params && params.data === 'navigate2PaymentCompletedPage') {
    viewModel.$router.push('pnm-payment-completed')
  }
  // NUVEI
  nuveiManager.handleIFrame(params, viewModel)
})
</script>

<style lang="stylus" scoped>
@import "~@/css/config"
@import "~@/css/mixins"
@import "~@/css/sportIcons"

.payments
  background white
  @media mobile-big-and-below
    padding 15px 5px 15px
  .payments__spinner
    text-align center
  .payments__title
    margin-bottom 15px
    @media mobile-big-and-below
      margin-bottom 10px
  .payments__info
    .here
      font-family:  'Open Sans Bold'
      cursor pointer
      text-decoration underline
    @media mobile-big-and-below
      .desc
        display block
  .payments__instruments
    margin 0 150px
    @media mobile-big-and-below
      margin 0
    .payments__instruments_item
      cursor pointer
      display flex
      min-height 60px
      border-top 1px solid #cfd6db
      border-left 1px solid #cfd6db
      border-right 1px solid #cfd6db
      padding 5px 0
      border-radius 7px
      &:last-child
        border-bottom 1px solid #cfd6db
      &.diss
        cursor default
        background-color #E3E8EE
      .piitem-picture,
      >>> .piitem-picture
        display flex
        flex 3
        justify-content center
        align-items center
        padding 0 5px
        img
          width 100%
          height auto
      .piitem-text,
      >>> .piitem-text
        flex 20
        display flex
        justify-content center
        flex-direction column
        .piitem-text-headline
          font-size 15px
          font-weight bold
          .piitem-must-deposit
            border-radius 4px
            background-color white
            font-weight Bold
            font-size 1rem
            line-height 1rem
            padding 4px 6px
            display inline-block
        .piitem-text-desc
          font-size 12px
      .piitem-arrow,
      >>> .piitem-arrow
        display flex
        flex 1
        justify-content center
        align-items center
        i
          font-size 40px
</style>
