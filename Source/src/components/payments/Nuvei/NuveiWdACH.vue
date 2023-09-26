<template>
  <div class="payment__instrument">
    <span class="piitem-text">
      <h2 class="piitem-text-headline">{{ $t('Payments.Nuvei.ACH.Headline') }}</h2>
      <div v-if="stepOne" class="piitem-text-desc">{{ $t('Payments.Nuvei.ACH.Select') }}</div>
      <div v-if="stepTwo" class="piitem-text-desc">{{ $t('Payments.Nuvei.ACH.Wd.Desc') }}</div>
    </span>
    <div v-if="stepOne" class="pi__container"> 
      <div v-for="(card, i) in availableCards" :key="i" @click="selectedCard = card" class="pi_item">
        <span>{{ `${card.AccountNumber.slice(0, 1)}*** **** **** ${card.AccountNumber.slice(-4)} (${card.ExtraValue1})` }}</span>
      </div>
    </div>
    <v-form 
      v-if="stepTwo"
      ref="form"
      v-model="valid"
      lazy-validation
      @submit.prevent="submit"
    >
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
    <div v-if="processing" class="payments__spinner">
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
    type: null,
    selectedCard: null
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
    },
    availableCards () {
      let instruments = store.getters['payments/activePaymentInstuments']
      if (this.type) {
        let type = `${this.type.slice(0, 1).toUpperCase()}${this.type.slice(1)}`
        return instruments && instruments.filter(t => t.IDMMSIType === type && !!t.UniqueWalletId)
      }
      return []
    },
    singleCard () {
      return this.availableCards && this.availableCards.length === 1
    },
    multipleCards () {
      return this.availableCards && this.availableCards.length > 1
    },
    stepOne () {
      return this.multipleCards && !this.selectedCard && !this.processing
    },
    stepTwo () {
      return (this.singleCard || (this.multipleCards && this.selectedCard)) && !this.processing
    }
  },
  methods: {
    async submit () {
      if (this.$refs.form.validate()) {
        store.dispatch(`nuvei/${this.type}/start`, {
          amount: this.formData.amount,
          instrument: this.selectedCard
        })
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
.pi__container
  margin 20px 150px 0
  text-align center
  @media mobile-big-and-below
    margin 20px 0
  .pi_item
    cursor pointer
    display flex
    min-height 60px
    border-top 1px solid #cfd6db
    border-left 1px solid #cfd6db
    border-right 1px solid #cfd6db
    padding 5px 0
    border-radius 7px
    justify-content center
    align-items center
    font-weight bold
    &:last-child
      border-bottom 1px solid #cfd6db
</style>
