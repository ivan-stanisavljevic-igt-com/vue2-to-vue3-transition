<template>
  <div class="payment__instrument">
    <div class="paysafe-container">
      <!-- <img class="paysafe-img" :src="mediaServer('/static/brand-img/' + brandKey + '/paysafe.svg')" alt="paysafe"/> -->
      <div class="label">{{ $t('Transaction.Paysafe') }}</div>
      <p v-html="$t('Transaction.Paysafe.Desc')" class="desc"></p>
      <!-- <div class="mthds-cont cards">
        <div class="mthds">{{ $t('Transaction.Paysafe.Methods')}}</div>
        <div class="cards-inner">
          <div class="mthds-img"><img class="psimg" :src="mediaServer('/static/brand-img/' + brandKey + '/visa.svg')" alt="visa"/></div>
          <div class="mthds-img"><img class="psimg mastercard" :src="mediaServer('/static/brand-img/' + brandKey + '/master-card.svg')" alt="mastercard"/></div>
          <div class="mthds-img"><img class="psimg" :src="mediaServer('/static/brand-img/' + brandKey + '/discover.svg')" alt="discover"/></div>
          <div class="mthds-img"><img class="psimg amex" :src="mediaServer('/static/brand-img/' + brandKey + '/american-express.svg')" alt="amex"/></div>
        </div>
      </div> -->
      <div class="mthds-cont">
        <div class="mthds-img"><img class="psimg all" :src="mediaServer('/static/brand-img/' + brandKey + '/paysafe-instruments.png')" alt="paysafe-instruments"/></div>
        <!-- <div class="mthds-img"><img class="psimg" :src="mediaServer('/static/brand-img/' + brandKey + '/vip-preferred-v2.svg')" alt="vip-preferred"/></div>
        <div class="mthds-img"><img class="psimg pscard" :src="mediaServer('/static/brand-img/' + brandKey + '/paysafecard.svg')" alt="paysafecard"/></div>
        <div class="mthds-img"><img class="psimg" :src="mediaServer('/static/brand-img/' + brandKey + '/play-plus.svg')" alt="play-plus"/></div>
        <div class="mthds-img"><img class="psimg pscash" :src="mediaServer('/static/brand-img/' + brandKey + '/paysafecash.svg')" alt="paysafecash"/></div> -->
      </div>
      <v-form ref="form" id="form" v-model="valid" lazy-validation @submit.prevent="submit">
        <div>
          <v-text-field
            inputmode="decimal"
            v-model="formData.amount"
            :label="$t('Transaction.Amount')"
            :prefix="currencySymbol"
            required
            :disabled="isProcessing"
            :rules="[formRules.amount.required, formRules.amount.number, formRules.amount.max2Decimals]"
            class="my-3 input-amount"
          >
          </v-text-field>
          <div class="content">
            <v-btn v-if="depositType" class="transaction" :disabled="isProcessing || !valid || !customerCanDeposit" color="success" @click="startTransaction('R')">{{ $t('Transaction.Deposit') }}</v-btn>
            <v-btn v-if="withdrawType" class="transaction" :disabled="isProcessing || !valid || !customerCanWithdraw" color="success" @click="startTransaction('P')">{{ $t('Transaction.Withdrawal') }}</v-btn>
          </div>
        </div>
      </v-form>
      <div class="go-back" @click="goToHomepage()">
        <v-icon>navigate_before</v-icon>
        <span>{{ back }}</span>
      </div>
    </div>
    <PaysafeProcessingDialog
      v-model="dialog"
      :isDialogPersistent="true"
      :isProcessing="isProcessing"
      :isSuccess="!transactionError"
      :hideResult="paymentHandleNotCreated || paymentHandleCreated"
      :processingTitle="$t('Transaction.Dialog.Processing.Title')"
      :processingText="$t('Transaction.Dialog.Processing.Text')"
      :successTitle="paysafeCashSuccessTitle || $t('Transaction.Dialog.Success.Title')"
      :successText="paysafeCashSuccessText || $t('Transaction.Dialog.Success.Text')"
      :errorTitle="$t('Transaction.Dialog.Error.Title')"
    >
      <div slot="text-error">
        <p v-if="brandKey !=='sb'" class="generic-icon-note">
          <v-icon color="error" class="mr-1">error</v-icon>
          <span>{{ transactionError }}</span>
        </p>
        <div v-if="brandKey ==='sb'">
          <p>{{ transactionError }}</p>
          <p v-html="customerServiceMessage"></p>
        </div>
      </div>
    </PaysafeProcessingDialog>
  </div>
</template>
<script>
import store from '@/store'
import config from '@/config'
import PaysafeProcessingDialog from '@/components/payments/PaysafeProcessingDialog'
import Url from '@/components/mixins/Url'
let viewModel = null
export default {
  components: {
    PaysafeProcessingDialog
  },
  mixins: [Url],
  data: () => ({
    formData: {
      amount: ''
    },
    formRules: {
      amount: {
        required: (value) => !!value || viewModel.$t('Transaction.Amount.IsRequired'),
        number: (value) => (value > 0) || viewModel.$t('Transaction.Amount.Number'),
        max2Decimals: v => /^\s*(?=.*[1-9])\d*(?:\.\d{1,2})?\s*$/g.test(v) || viewModel.$t('Transaction.Amount.Deposit.Max2Decimals')
      }
    },
    valid: true,
    dialog: false,
    isTransactionProcessingInvoked: false
  }),
  computed: {
    depositInstrument: () => store.getters['paysafe/depositInstrument'],
    withdrawalInstrument: () => store.getters['paysafe/withdrawalInstrument'],
    pollingTransaction: () => store.getters['paysafe/pollingTransaction'],
    isProcessing () {
      return this.isTransactionProcessingInvoked || this.pollingTransaction || this.processingPaysafeTransaction
    },
    brandKey: () => window.ctsautoconf.BRAND,
    transactionError: {
      get: () => store.getters['paysafe/transactionError'],
      set: (value) => void (store.commit('paysafe/transactionError', value))
    },
    SDKisDisplayed: () => store.getters['paysafe/SDKisDisplayed'],
    processingPaysafeTransaction: () => store.getters['paysafe/processingPaysafeTransaction'],
    raiseDialog: () => store.getters['paysafe/raiseDialog'],
    hideDialog: () => store.getters['paysafe/hideDialog'],
    paysafeCashSuccessText: () => store.getters['paysafe/paysafeCashSuccessText'],
    paysafeCashSuccessTitle: () => store.getters['paysafe/paysafeCashSuccessTitle'],
    paysafePaymentStage: () => store.getters['paysafe/paysafePaymentStage'],
    paymentHandleNotCreated () {
      return this.paysafePaymentStage && this.paysafePaymentStage === 'PAYMENT_HANDLE_NOT_CREATED'
    },
    paymentHandleCreated () {
      return this.paysafePaymentStage && this.paysafePaymentStage === 'PAYMENT_HANDLE_CREATED'
    },
    accountNotVerified: () => store.getters['paysafe/accountNotVerified'],
    customerServiceMessage () {
      return this.accountNotVerified ? this.$t('Transaction.Dialog.Error.ContactSupport') : this.$t('Transaction.Dialog.Error.Text.ContactSupport')
    },
    currencySymbol () {
      return config.app.CURRENCY
    },
    back () {
      if (this.paysafeOnlyDeposit && this.depositType) return this.$t('Header.navigationBack')
      if (this.paysafeOnlyWithdrawal && this.withdrawType) return this.$t('Header.navigationBack')
      return this.$t('Transaction.GoBack')
    },
    paysafeOnlyDeposit: () => store.getters['payments/paysafeOnlyDeposit'],
    paysafeOnlyWithdrawal: () => store.getters['payments/paysafeOnlyWithdrawal'],
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
    }
  },
  methods: {
    async startTransaction (type) {
      if (this.$refs.form.validate()) {
        this.dialog = true
        try {
          this.isTransactionProcessingInvoked = true
          this.transactionError = null
          await store.dispatch('paysafe/startTransaction', {'amount': this.formData.amount, 'type': type})
          this.reset()
        } catch (err) {
          console.log(err)
        } finally {
          this.isTransactionProcessingInvoked = false
        }
      }
    },
    reset () {
      this.$refs.form.reset()
    },
    goToHomepage () {
      if (this.paysafeOnlyDeposit && this.depositType) return this.$router.push({ path: '/home' })
      if (this.paysafeOnlyWithdrawal && this.withdrawType) return this.$router.push({ path: '/home' })
      else this.$router.push({name: 'wallet-page'})
    }
  },
  created () {
    viewModel = this
  },
  watch: {
    transactionError (newVal) {
      this.transactionError = newVal
      if (newVal) {
        this.dialog = true
      }
    },
    hideDialog () {
      this.dialog = false
    },
    raiseDialog () {
      this.dialog = true
    }
  }
}
</script>
<style lang="stylus" scoped>
@import "~@/css/config"
.paysafe-container
  padding 20px
  .paysafe-img
    margin: auto
    text-align center
    max-height 55px
    padding 0 0 10px 0
    display block
  .mthds
    text-align center
    font-weight bold
    margin-bottom -12px
  .mthds-cont
    display flex
    flex-direction column
    @media mobile-big-and-below
      margin-top -6px
    &.cards
      justify-content center
      @media mobile-big-and-below
        margin-top 0
      .cards-inner
        display flex
        justify-content center
        // max-width 40%
        margin 0
        border-radius 3px
        .mthds-img
          margin 0 5px
          border-radius 3px
          margin 2px
          max-width 50px
          @media mobile-big-and-below
            margin-bottom 4px
          .psimg
            max-height 100px
            @media mobile-big-and-below
              max-width 100%
              height 40px
            &.mastercard
              @media mobile-big-and-below
                height 40px
            &.amex
              max-height 80px
              padding 0 6px
              @media mobile-big-and-below
                height 40px
    .mthds-img
      flex 1
      margin 10px
      display flex
      align-items center
      justify-content center
      @media mobile-big-and-below
        justify-content center
        margin 15px 0 0
      .psimg
        max-width 100%
        max-height 28px
        &.all
          max-height initial
          @media mobile-big-and-below
            max-height initial
            height auto
            width auto
            max-width initial
        @media mobile-big-and-below
          height 25px
          max-width 50%
          &.pscash,
          &.pscard
            height 20px
  .content
    display flex
    justify-content center
    background transparent
    .transaction
      flex 1
      height 60px
      margin 5px
      max-width 200px
      font-size 15px
      display flex
      >>> div
        flex 1
        white-space normal
        @media screen and (max-width: 360px)
          font-size 11px
        @media screen and (max-width: 390px)
          font-size 13px
</style>
