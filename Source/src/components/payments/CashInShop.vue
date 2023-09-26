<template>
  <div class="account-page" v-if="isCashInShopAvailable">
    <v-layout  class="page-layout add-funds">
      <v-flex class="main-column" ref="maincolumn">
        <v-form
          ref="form"
          id="form"
          v-model="valid"
          lazy-validation
          @submit.prevent="submit"
        >
          <h1 class="text_aligncenter">{{ $t('Transaction.CashInShop.Withdraw.Title') }}</h1>
          <p>{{$t('Transaction.CashInShop.Withdraw.Page.Desc')}}</p>
          <v-text-field
            inputmode="decimal"
            v-model="amount"
            :label="$t('Transaction.Amount')"
            required
            :prefix="currencySymbol"
            :disabled="processing"
            :rules="[formRules.amount.required, formRules.amount.max2Decimals]"
            class="my-3 input-amount"
          >
          </v-text-field>
          <v-btn :disabled="processing || !valid || !customerCanWithdraw" color="success"  @click="submit">{{ $t('Transaction.Withdraw') }}</v-btn>
          <v-btn :disabled="processing" color="error" @click="reset">{{ $t('Transaction.ResetForm') }}</v-btn>
          <p class="desc-footer">{{$t('Transaction.CashInShop.Withdraw.Page.Desc.Footer')}}</p>
        </v-form>
      </v-flex>
    </v-layout>
    <div class="go-back">
      <span @click="goToHomepage()">
        <i aria-hidden="true" class="icon material-icons">navigate_before</i>
        <span>{{back}}</span>
      </span>
    </div>

    <ProcessingDialog
      v-model="dialog"
      :isDialogPersistent="true"

      :isProcessing="processing"
      :isSuccess="!transactionFailed"

      :processingTitle="$t('Transaction.Dialog.Processing.Title')"
      :processingText="$t('Transaction.Dialog.Processing.Text')"
      :successTitle="$t('Transaction.Dialog.Success.Title.CashInShop')"
      :errorTitle="$t('Transaction.Dialog.Error.Title')"
    >
      <div slot="text-error">
        <p v-if="brandKey !=='sb'" class="generic-icon-note"><v-icon color="error" class="mr-1">error</v-icon><span>{{ $t('Transaction.Dialog.Error.Text') }}</span></p>
        <p>{{ transactionError }}</p>
        <p v-if="brandKey ==='sb'" v-html="customerServiceMessage"></p>
        <!-- <p>{{ $t('Transaction.Dialog.Error.Text.ContactSupport') }}</p> -->
      </div>
      <div slot="text-success">
        <template v-if="extAuthCode">
          <!-- show this when we get auth code -->
          <div>{{ $t('Transaction.Dialog.Success.Text.CashInShop') }}</div>
          <div class="dialog-auth-code">{{ extAuthCode }}</div>
          <p class="tds" v-html="$t('Transaction.Dialog.Success.Desc.CashInShop')"></p>
          <p class="tds">{{ $t('Transaction.Dialog.Success.DescCancel.CashInShop') }}
            <span @click="go2PendingTransactions()" class="gotopending">{{ $t('Transaction.Dialog.Success.DescCancel.CashInShop.Here') }}</span>
            <span>{{ $t('Transaction.Dialog.Success.DescCancel.CashInShop.Dot') }}</span>
          </p>
        </template>
        <template v-else>
          <!-- show this msg to user when withdrawal requires manual authorization (and we don't have auth code)-->
          <p class="generic-icon-note"><v-icon color="success" class="mr-1">check_circle</v-icon><span>{{ pollingTransactionInfoMessage }}</span></p>
        </template>
      </div>
    </ProcessingDialog>

  </div>
</template>

<script>
import Screen from '@/components/mixins/Screen'
import config from '@/config'
import ProcessingDialog from '@/components/common/ProcessingDialog'
import store from '@/store'
import Branding from '@/components/mixins/Branding'

let vm = null

export default {
  components: {
    ProcessingDialog
  },
  mixins: [
    Screen,
    Branding
  ],
  data: () => ({
    formData: {
      amount: ''
    },
    valid: true,
    formRules: {
      amount: {
        required: value => !!value || vm.$t('Transaction.Amount.IsRequired'),
        max2Decimals: v => /^\s*(?=.*[1-9])\d*(?:\.\d{1,2})?\s*$/g.test(v) || vm.$t('Transaction.Amount.Deposit.Max2Decimals')
      }
    },
    dialog: false,
    transactionError: '',
    customerServiceMessage: null
  }),
  computed: {
    isCashInShopAvailable: () => store.getters['cashinshop/isCashInShopAvailable'],
    processing: () => store.getters['cashinshop/processing'],
    extAuthCode: () => store.getters['cashinshop/authCode'],
    transactionFailed: () => store.getters['cashinshop/transactionFailed'],
    pollingTransactionInfoMessage: () => store.getters['cashinshop/pollingTransactionInfoMessage'],
    isIgtPayAvailable: () => store.getters['igtPay/isIgtPayAvailable'],
    back () {
      return (this.isIgtPayAvailable || this.cashInShopOnly || this.cashInShopOnlyWithdrawal) ? this.$t('Header.navigationBack') : this.$t('Transaction.GoBack')
    },
    accountSummaryFlow: () => window.ctsautoconf.ACCOUNT_SUMMARY_FLOW || false,
    cashInShopOnly: () => store.getters['payments/cashInShopOnly'],
    currencySymbol () {
      return config.app.CURRENCY
    },
    cashInShopOnlyWithdrawal: () => store.getters['payments/cashInShopOnlyWithdrawal'],
    cashInShopRoundTo5Cents: () => window.ctsautoconf.CASHINSHOP_ROUND_TO_5_CENTS,
    customerContext: () => store.getters['getCustomerContext'],
    customerCanWithdraw () {
      return this.customerContext && this.customerContext.ActionWithdraw
    },
    amount: {
      get () {
        return this.formData.amount
      },
      set (value) {
        const decimalsLength = (value.split('.')[1] && value.split('.')[1].length) || 0
        this.formData.amount = (decimalsLength === 2 && this.cashInShopRoundTo5Cents) ? (Math.round(value / 0.05) * 0.05).toFixed(2) : value
      }
    }
  },
  methods: {
    async submit () {
      if (this.$refs.form.validate()) {
        store.commit('cashinshop/setTransactionFailed', false)
        this.transactionError = ''
        this.customerServiceMessage = ''
        this.dialog = true
        try {
          store.commit('cashinshop/setProcessing', true)
          await store.dispatch('cashinshop/start', {'amount': this.formData.amount})
          this.reset()
        } catch (error) {
          store.commit('cashinshop/setTransactionFailed', true)
          store.commit('cashinshop/setProcessing', false)
          this.customerServiceMessage = error.exceptionType === 'AccountNotVerified' ? this.$t('Transaction.Dialog.Error.ContactSupport') : this.$t('Transaction.Dialog.Error.Text.ContactSupport')
          this.transactionError = error.message || this.$t('Server.ErrorMsg.Generic')
        }
      }
    },
    reset () {
      this.$refs.form.reset()
    },
    goToHomepage () {
      if (this.isIgtPayAvailable || this.cashInShopOnly || this.cashInShopOnlyWithdrawal) {
        this.$router.push({name: 'home'})
      } else {
        this.$router.push({name: 'wallet-page'})
      }
    },
    go2PendingTransactions () {
      if (this.accountSummaryFlow) {
        this.$router.replace({
          path: '/account/account-summary',
          query: { 'pending-transactions': '' }
        })
      } else {
        this.$router.push({name: 'account/play-balance'})
      }
    }
  },
  created () {
    vm = this
  }
}
</script>

<style lang="stylus" scoped>
  @import "~@/css/config"
  .main-column
    text-align center
    #form
      margin 5px auto
      max-width 500px
      background-color #fff
      border 10px solid #fff
  .auth-code
    background-color #06283b
    margin 5px
    div
      color white
      text-align center
      font-size 1.6rem
      font-weight bold
      text-transform uppercase
  .go-back
    display block
    text-align center
    margin 10px
    font-size 15px
    span
      cursor pointer
      i
        position relative
        top 7px
.dialog-content
  font-size 16px
.inline-block
  display inline-block
.text-align-center
  text-align center
.dialog-processing
  margin-top 12px
  margin-bottom 12px
.circular-progress
  display inline-block
  position relative
  top -1px
  right 1px
  >>> .v-progress-circular
    width 16px !important
    height 16px !important
.dialog-auth-code
  margin 5px
  text-align center
  font-size 2.2rem
  font-weight bold
.input-amount
  >>> .v-text-field__prefix
    margin-top: 10px
    padding: 0
.gotopending
  font-weight bold
  cursor pointer
  text-decoration underline
</style>
