<template>
  <div class="payment__instrument">
    <v-form 
      v-if="!processing"
      ref="form"
      v-model="valid"
      lazy-validation
      @submit.prevent="submit"
    >
      <span class="piitem-text">
        <h2 class="piitem-text-headline">{{ $t('Payments.PNM.PayPal.Headline') }}</h2>
        <div class="piitem-text-desc">{{ $t('Payments.Nuvei.PayPal.Desc') }}</div>
      </span>
      <v-text-field
        inputmode="decimal"
        v-model="amount"
        :label="$t('Transaction.Amount')"
        required
        :prefix="currencySymbol"
        :disabled="processing"
        :rules="[formRules.amount.required, formRules.amount.max2Decimals]"
        class="input-amount"
      >
      </v-text-field>
      <div class="buttons">
        <v-btn :disabled="processing || !valid" color="success"  @click="submit">{{ $t('Transaction.Withdraw') }}</v-btn>
        <v-btn 
          class="outlined"
          color="gray" 
          @click="goToHomepage">
            <i aria-hidden="true" class="icon material-icons">navigate_before</i>
            {{$t('Transaction.GoBack')}}
        </v-btn>
      </div>
    </v-form>
    <!-- Spinner -->
    <div v-else class="payments__spinner">
      <v-progress-circular indeterminate class="redirecting-circular-progress"></v-progress-circular>
      {{ $t('Transaction.PleaseWait') }}
    </div> 
  </div>
</template>

<script>
import Screen from '@/components/mixins/Screen'
import config from '@/config'
import store from '@/store'
import Branding from '@/components/mixins/Branding'
import { i18n } from '@/main.js'

export default {
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
        required: value => !!value || i18n.t('Transaction.Amount.IsRequired'),
        max2Decimals: v => /^\s*(?=.*[1-9])\d*(?:\.\d{1,2})?\s*$/g.test(v) || i18n.t('Transaction.Amount.Deposit.Max2Decimals')
      }
    },
    type: null
  }),
  computed: {
    processing () {
      return store.getters[`nuvei/${this.type}/processing`]
    },
    currencySymbol () {
      return config.app.CURRENCY
    },
    amount: {
      get () {
        return this.formData.amount
      },
      set (value) {
        this.formData.amount = value
      }
    }
  },
  methods: {
    async submit () {
      if (this.$refs.form.validate()) {
        store.dispatch(`nuvei/${this.type}/start`, this.formData.amount)
      }
    },
    goToHomepage () {
      this.$router.push({name: 'wallet-page'})
    }
  },
  mounted () {
    this.type = this.$route.query.withdrawal_type
  }
}
</script>

<style lang="stylus" scoped>
@import "~@/css/config"
.payment__instrument
  user-select none
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
.piitem-text
  text-align center
  .piitem-text-headline
    text-align center
.buttons
  display flex
  justify-content center
  .outlined
    background-color: unset!important;
    border: 1px solid;
    color: unset;
</style>
