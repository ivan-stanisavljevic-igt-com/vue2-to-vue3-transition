<template>
  <div class="payment__instrument">
    <div v-if="!processing && !fetchingPaymentTypes">
      <div class="label">{{ $t('Payments.PNM.PushDebit.Headline') }}</div>
      <div class="desc">{{ $t('Payments.PNM.PushDebit.Desc') }}</div>
      <!-- Error Msg -->
      <div v-if="errorMessage" class="pnmpd-failed" :class="{'pnmpd-failed--hidden': chosenCard}">{{errorMessage}}</div>
      <!-- Info Msg -->
      <div v-if="infoMessage" class="pnmpd-info"><v-icon color="blue" class="mr-1" size="16">info</v-icon> {{infoMessage}}</div>
      <!--Template to display if where are NO cards -->
      <div class="pnmpd-cards" v-if="noDebitCardRegistered">
        <p class="no__cards__info"><b>{{ $t('Payments.PNM.PayPalWithdrawal.Enable') }}</b></p>
        <div class="no__cards__info">{{ $t('Payments.PNM.PushDebit.Info') }}</div>
      </div>
      <div v-else>
        <!--Template to display if there are cards -->
        <div class="pnmpd-cards" v-if="!chosenCard">
          <div class="hdr" @click.stop="toggleCardDisplay()">{{ $t('Payments.PNM.PushDebit.Select') }}</div>
          <div class="pnmpd-cards__body" :class="{'pnmpd-cards__body--visible': displayCards}">
            <v-radio-group v-model="chosenCard">
              <v-radio v-for="(card, i) in debitCards" :key="i" :label="`${card.AccountNumber ? $t('Payments.PNM.PushDebit.Mask') : ''} ${card.AccountNumber ? card.AccountNumber : ''} ${card.AccountNumber ? `(${card.ExtraValue1})` : card.ExtraValue1}`" :value="card"></v-radio>
            </v-radio-group>
            <div v-if="showWithdrawalButton" class="pnmpd__btn_cont">
              <v-btn large color="success" @click.stop="addNewCard()">{{ $t('Payments.PNM.PushDebit.AddNew') }}</v-btn>
            </div>
          </div>
        </div>
        <!--Form -->
        <div class="pnmpd-cards pnmpd-cards__form" :class="{'pnmpd-cards__form--visible': chosenCard}">
          <div class="hdr">{{ $t('Payments.PNM.PushDebit.EnterAmount') }}</div>
          <v-form ref="form" id="form" v-model="valid" lazy-validation @submit.prevent="submit" v-if="!displayCards">
            <v-text-field
              inputmode="decimal"
              v-model="formData.amount"
              :label="$t('Transaction.Amount')"
              :prefix="currencySymbol"
              required
              :disabled="processing"
              :rules="[formRules.amount.required, formRules.amount.number, formRules.amount.minWdAmt]"
              class="my-3 input-amount"
            >
            </v-text-field>
            <div class="pi-btns-wrapper">
              <v-btn large :disabled="processing || !valid || !customerCanWithdraw" color="success" @click="startTransaction(formData.amount)">{{ $t('Transaction.Withdrawal') }}</v-btn>
            </div>
          </v-form>
        </div>
      </div>
      <!-- Back to cashier -->
      <div class="go-back" @click="goToHomepage()">
        <v-icon>navigate_before</v-icon>
        <span>{{ back }}</span>
      </div>
    </div>
    <!-- Spinner -->
    <div v-else class="payments__spinner">
      <v-progress-circular indeterminate class="redirecting-circular-progress"></v-progress-circular>
      {{ defaultProcessingMessage }}
    </div>
    <PNMGatewayDialog v-if="redirectionUrl" 
      :redirectionUrl="redirectionUrl" 
      :type="'pnmPushDebit'"
      ref="pnmGatewayDialog">
    </PNMGatewayDialog>
    <PNMEventDispatcher/>
  </div>
</template>
<script>
import store from '@/store'
import config from '@/config'
import PNMGatewayDialog from '@/components/payments/PayNearMeGateway/PNMGatewayDialog'
import PNMEventDispatcher from '@/components/payments/PayNearMeGateway/PNMEventDispatcher'

let viewModel = null

export default {
  components: {
    PNMGatewayDialog,
    PNMEventDispatcher
  },
  props: ['type'],
  data: () => ({
    formData: {
      amount: ''
    },
    formRules: {
      amount: {
        required: (value) => !!value || viewModel.$t('Transaction.Amount.IsRequired'),
        number: (value) => (value > 0) || viewModel.$t('Transaction.Amount.Number'),
        minWdAmt (value) {
          return (value >= viewModel.minWdAmount) || viewModel.$t('Transaction.Amount.Min', { amount: viewModel.minWdAmount, currency: viewModel.currencySymbol })
        }
      }
    },
    valid: true,
    chosenCard: null,
    displayCards: false
  }),
  methods: {
    startTransaction (amt) {
      if (this.$refs.form.validate()) {
        try {
          store.dispatch('pnmGateway/pnmPushDebit/start', {
            amount: amt,
            instrument: this.chosenCard,
            shouldOpenIFrame: false,
            isWithdrawal: true
          })
          store.commit('pnmGateway/setWithdrawAmount', amt)
          this.disposeLocalState()
        } catch (ex) {
          console.log(ex)
        }
      }
    },
    goToHomepage () {
      if (this.pnmPushDebitOnlyWithdrawal && this.withdrawType) this.$router.push({name: 'home'})
      else this.$router.push({name: 'wallet-page'})
    },
    toggleCardDisplay () {
      this.displayCards = !this.displayCards
    },
    closePNMIFrame () {
      if (this.$refs && this.$refs.pnmGatewayDialog) {
        this.$refs.pnmGatewayDialog.closeDialog()
      }
    },
    addNewCard () {
      try {
        store.dispatch('pnmGateway/pnmPushDebit/start', {
          amount: 0,
          instrument: this.defaultInstument,
          shouldOpenIFrame: true,
          isWithdrawal: false
        })
        this.disposeLocalState()
      } catch (ex) {
        console.log(ex)
      }
    },
    cardCheck () {
      try {
        store.dispatch('pnmGateway/pnmPushDebit/start', {
          amount: 0,
          instrument: this.defaultInstument,
          shouldOpenIFrame: false,
          isWithdrawal: false
        })
        this.disposeLocalState()
      } catch (ex) {
        console.log(ex)
      }
    },
    disposeLocalState () {
      this.formData.amount = ''
      this.valid = true
      this.chosenCard = null
      this.displayCards = false
    }
  },
  computed: {
    fetchingPaymentTypes: () => store.getters['payments/fetchingPaymentTypes'],
    processing: () => store.getters['pnmGateway/pnmPushDebit/getProcessing'],
    defaultProcessingMessage () {
      return this.$t('Transaction.PleaseWait')
    },
    errorMessage: () => store.getters['pnmGateway/pnmPushDebit/errMsg'],
    debitCards: () => {
      let instruments = store.getters['payments/activePaymentInstuments']
      return instruments && instruments.filter(type => type.IDMMSIType === 'PNMPushDebit' && type.VerificationStatus === -1 && !!type.AccountNumber)
    },
    noDebitCardRegistered () {
      return this.debitCards && this.debitCards.length === 0
    },
    defaultInstument () {
      let instruments = store.getters['payments/activePaymentInstuments']
      return instruments && instruments.filter(type => type.IDMMSIType === 'PNMPushDebit')[0]
    },
    redirectionUrl: () => store.getters['pnmGateway/pnmPushDebit/redirectionURL'],
    infoMessage: () => store.getters['pnmGateway/pnmPushDebit/infoMsg'],
    currencySymbol () {
      return config.app.CURRENCY
    },
    back () {
      return (this.pnmPushDebitOnlyWithdrawal) ? this.$t('Header.navigationBack') : this.$t('Transaction.GoBack')
    },
    pnmPushDebitOnlyWithdrawal: () => store.getters['payments/pnmPushDebitOnlyWithdrawal'],
    transactionType: () => store.getters['payments/transactionType'],
    withdrawType () {
      return this.transactionType && this.transactionType === 'withdrawal'
    },
    customerContext: () => store.getters['getCustomerContext'],
    customerCanWithdraw () {
      return this.customerContext && this.customerContext.ActionWithdraw
    },
    minWdAmount () {
      const instrument = store.getters['pnmGateway/pnmPushDebit/withdrawalInstrument']
      const minWdAmount = instrument && instrument.MinWithdrawalAmount
      return minWdAmount || 0
    },
    hideWithdrawalButton () {
      return config.app.autoconf.HIDE_WITHRAWAL_BUTTON_FOR_PAYNEARME_PUSH_DEBIT
    },
    showWithdrawalButton () {
      return !this.hideWithdrawalButton
    }
  },
  created () {
    viewModel = this
  },
  mounted () {
    store.dispatch('pnmGateway/pnmPushDebit/disposeState')
    if (this.defaultInstument) {
      this.cardCheck()
    }
  },
  destroyed () {
    store.dispatch('pnmGateway/pnmPushDebit/disposeState')
    this.disposeLocalState()
  },
  watch: {
    chosenCard (newVal) {
      if (newVal) {
        this.toggleCardDisplay()
      }
    },
    // on page refresh
    defaultInstument (newVal, oldVal) {
      if (newVal && !oldVal) {
        this.cardCheck()
      }
    }
  }
}
let cardIsNotAdded = (param) => {
  let returnUrl = param
  if (returnUrl.includes('amp%3B')) returnUrl = returnUrl.replaceAll('amp%3B', '')
  let exist = new URLSearchParams(returnUrl).get('payment')
  return exist === 'false'
}

let cardIsAdded = (param) => !cardIsNotAdded(param)

window.addEventListener('message', params => {
  if (params && params.data && params.data.data === 'closePNMPushDebitIFrame') {
    store.dispatch('getCustomerContext')
    // viewModel reference exist => PNMPushDebit component is rendered => transaction is push debit
    if (viewModel) {
      viewModel.closePNMIFrame()
      let isAdded = cardIsAdded(params.data.URIqueryString)
      if (isAdded) {
        viewModel.disposeLocalState()
        viewModel.cardCheck()
      }
    }
  }
})
</script>
<style lang="stylus" scoped>
.payment__instrument
  cursor default
  .pnmpd-info,
  .pnmpd-success,
  .pnmpd-failed
    border-radius 5px
    padding 10px
    margin 0 0 5px 0
  .pnmpd-info
    background #e5e5e5
    font-size 12px
  .pnmpd-success
    background rgba(76, 175, 80, .2)
    font-size initial
  .pnmpd-failed
    background rgba(244, 67, 54, .2)
    font-size initial
    &.pnmpd-failed--hidden
      display none
  .pnmpd-cards
    border 1px solid #e5e5e5
    margin 10px 0
    padding 10px
    border-radius 5px
    &.pnmpd-cards__form
      opacity 0
      transition opacity 1s
      display none
      &.pnmpd-cards__form--visible
        opacity 1
        display block
    .no__cards__info
      margin 0 5px 15px
    .pnmpd__btn_cont
      display flex
      justify-content center
    .hdr
      display flex
      justify-content space-between
      align-items center
      cursor pointer
    .pnmpd-cards__body
      max-height 0
      overflow hidden
      transition max-height .8s ease-out
      &.pnmpd-cards__body--visible
        max-height 1000px
        transition max-height .8s ease-in
</style>
