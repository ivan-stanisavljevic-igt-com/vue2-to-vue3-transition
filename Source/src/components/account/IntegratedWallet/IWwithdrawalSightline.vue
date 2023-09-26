<template>
  <div class="account-page" v-if="isLoggedIn">
    <v-layout  class="page-layout sl add-funds">
      <v-flex class="main-column" ref="maincolumn" >
        <v-form
          ref="form"
          id="form"
          v-model="valid"
          lazy-validation
          @submit.prevent="submit"
        >
          <h1 v-if="!showSightlineImg">{{ $t('Transaction.Sightline.Withdraw.Title') }}</h1>
          <img v-if="showSightlineImg" class="PlayPlusImg" :src="mediaServer('/static/brand-img/' + brandKey + '/sightline.png')" alt="Sightline"/>
          <p>{{ $t('Transaction.Sightline.Withdraw.Description') }}</p>
          <div v-if="!isProcessingInstructionFetch && isInstructionVerified">
            <v-text-field
              inputmode="decimal"
              v-model="formData.amount"
              label="Amount"
              required
              :prefix="currencySymbol"
              :disabled="isProcessing"
              :rules="[formRules.amount.required, formRules.amount.lessThanMin, formRules.amount.moreThanMax, formRules.amount.max2Decimals]"
              class="my-3 input-amount"
            ></v-text-field>
            <v-btn :disabled="isProcessing || !valid" color="success" @click="submit">{{ $t('Transaction.Withdraw') }}</v-btn>
            <v-btn :disabled="isProcessing" color="error" @click="reset">{{ $t('Transaction.ResetForm') }}</v-btn>
          </div>
          <div v-if="!isProcessingInstructionFetch && !isInstructionVerified">
            <p><v-icon color="blue" class="mr-1" size="16">info</v-icon>{{ $t('Transaction.Sightline.EnrollmentNotCompletedNote') }}</p>
          </div>
        </v-form>
      </v-flex>
    </v-layout>
    <div class="go-back">
      <span @click="goToHomepage()">
        <i aria-hidden="true" class="icon material-icons">navigate_before</i>
        <span>{{ $t('Header.navigationBack') }}</span>
      </span>
    </div>

    <ProcessingDialog
      v-model="dialog"
      :isDialogPersistent="true"

      :isProcessing="isProcessing"
      :isSuccess="!transactionError"

      :processingTitle="$t('Transaction.Dialog.Processing.Title')"
      :processingText="$t('Transaction.Dialog.Processing.Text')"
      :successTitle="$t('Transaction.Dialog.Success.Title')"
      :successText="transactionSuccessText"
      :errorTitle="$t('Transaction.Dialog.Error.Title')"
    >
      <div slot="text-error">
        <p v-if="brandKey !=='sb'" class="generic-icon-note"><v-icon color="error" class="mr-1">error</v-icon><span>{{ $t('Transaction.Dialog.Error.Text') }}</span></p>
        <p>{{ transactionError }}</p>
        <p v-if="brandKey ==='sb'" v-html="customerServiceMessage"></p>
        <!-- <p>{{ $t('Transaction.Dialog.Error.Text.ContactSupport') }}</p> -->
      </div>
    </ProcessingDialog>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import config from '@/config'
import Screen from '@/components/mixins/Screen'
import Url from '@/components/mixins/Url'
import Branding from '@/components/mixins/Branding'
import ProcessingDialog from '@/components/common/ProcessingDialog'
let vm = null

export default {
  name: 'IWwithdrawalSightline',

  mixins: [
    Screen, Url, Branding
  ],

  components: {
    ProcessingDialog
  },

  created () {
    vm = this
  },

  data () {
    return {
      formData: {
        amount: ''
      },

      formRules: {
        amount: {
          required (value) { return !!value || vm.$t('Transaction.Amount.IsRequired') },
          lessThanMin (value) {
            const minAmount = vm.minWithdrawalAmount
            if (minAmount) {
              return value >= minAmount || vm.$t('Transaction.Amount.Withdraw.MinAmount') + ' $' + minAmount
            } else {
              return value > 0 || vm.$t('Transaction.Amount.MustBeMoreThan') + ' $0' // by default amount must be more than $0
            }
          },
          moreThanMax (value) {
            const maxAmount = vm.maxWithdrawalAmount
            if (maxAmount) {
              return value <= maxAmount || vm.$t('Transaction.Amount.Withdraw.MaxAmount') + ' $' + maxAmount
            } else {
              return true // no max amount limit
            }
          },
          max2Decimals: v => /^\s*(?=.*[1-9])\d*(?:\.\d{1,2})?\s*$/g.test(v) || vm.$t('Transaction.Amount.Deposit.Max2Decimals')
        }
      },

      valid: true,
      dialog: null,
      transactionError: null,
      isTransactionProcessingInvoked: false,
      customerServiceMessage: null
    }
  },
  methods: {
    async submit () {
      if (this.$refs.form.validate()) {
        try {
          this.isTransactionProcessingInvoked = true
          this.transactionError = null
          this.customerServiceMessage = null
          this.dialog = true
          await this.$store.dispatch('sightline/withdrawalSightlineFlow', {'amount': this.formData.amount})
          this.reset()
        } catch (err) {
          this.customerServiceMessage = err.exceptionType === 'AccountNotVerified' ? this.$t('Transaction.Dialog.Error.ContactSupport') : this.$t('Transaction.Dialog.Error.Text.ContactSupport')
          this.transactionError = err.message || this.$t('Server.ErrorMsg.Generic')
          this.$store.dispatch('sightline/sendAnalytics', 'failed')
        } finally {
          this.isTransactionProcessingInvoked = false
        }
      }
    },
    moreThanBalanceRule (value) {
      // todo: check if value is lower than available balance
      // return value <= this.currentBalance || 'Amount must be less than your current balance'
      return true
    },

    reset () {
      this.$refs.form.reset()
    },
    goToHomepage () {
      this.$router.push({name: 'sightline'})
    },

    initialize () {
      if (this.isLoggedIn && !this.isInstructionVerified) {
        this.$store.dispatch('sightline/fetchInstruction')
      }
    }
  },

  computed: {
    ...mapGetters(['isLoggedIn']),

    ...mapState('sightline', {
      isProcessingInstructionFetch: 'isProcessingInstructionFetch',
      isProcessingWithdrawal: 'isProcessingWithdrawal',
      pollingTransactionError: 'pollingTransactionError',
      pollingTransactionInfoMessage: 'pollingTransactionInfoMessage'
    }),

    ...mapGetters('sightline', {
      isInstructionVerified: 'isInstructionVerified',
      isPollingTransaction: 'isPollingTransaction',
      maxWithdrawalAmount: 'maxWithdrawalAmount',
      minWithdrawalAmount: 'minWithdrawalAmount'
    }),

    isProcessing () {
      return this.isPollingTransaction || this.isProcessingInstructionFetch || this.isProcessingWithdrawal || this.isTransactionProcessingInvoked
    },

    transactionSuccessText () {
      if (this.pollingTransactionInfoMessage) {
        return this.pollingTransactionInfoMessage
      }

      return this.$t('Transaction.Dialog.Success.Text')
    },
    showSightlineImg () {
      return config.app.SIGHTLINE_IMG
    },
    currencySymbol () {
      return config.app.CURRENCY
    }
  },

  watch: {
    isLoggedIn (newVal, oldVal) {
      if (newVal) {
        this.initialize()
      }
    },
    pollingTransactionError (newVal) {
      this.transactionError = newVal
    }
  },

  mounted () {
    this.initialize()
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
  #spanexpress
    display none
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
.input-amount
  >>> .v-text-field__prefix
    margin-top: 10px
    padding: 0
</style>
