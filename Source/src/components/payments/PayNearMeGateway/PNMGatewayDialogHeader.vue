<template>
  <div class="pi-container">
    <!-- Debit Card -->
    <div class="payment__instrument injected" v-if="type==='pnmDebit'">
      <span class="piitem-arrow" @click="closeDialog()"><v-icon>chevron_left</v-icon></span>
      <div class="piitem-content">
        <span class="piitem-picture"><img :src="mediaServer('/static/brand-img/' + brandKey + '/card.svg')" alt="card"/></span>
        <span class="piitem-text">
          <div class="piitem-text-headline">{{ $t('Payments.PNM.Debit.Headline') }}</div>
          <div class="piitem-text-desc">{{ $t('Payments.PNM.Debit.Desc') }}</div>
        </span>
      </div>
    </div>
    <!-- Credit Card -->
    <div class="payment__instrument injected" v-if="type==='pnmCredit'">
      <span class="piitem-arrow" @click="closeDialog()"><v-icon>chevron_left</v-icon></span>
      <div class="piitem-content">
        <span class="piitem-picture"><img :src="mediaServer('/static/brand-img/' + brandKey + '/card.svg')" alt="card"/></span>
        <span class="piitem-text">
          <div class="piitem-text-headline">{{ $t('Payments.PNM.Credit.Headline') }}</div>
          <div class="piitem-text-desc">{{ $t('Payments.PNM.Credit.Desc') }}</div>
        </span>
      </div>
    </div>
    <!-- Push Debit -->
    <div class="payment__instrument injected" v-if="type==='pnmPushDebit'">
      <span class="piitem-arrow" @click="closeDialog()"><v-icon>chevron_left</v-icon></span>
      <div class="piitem-content">
        <span class="piitem-picture"><img :src="mediaServer('/static/brand-img/' + brandKey + '/cash.svg')" alt="pnmPushDebit"/></span>
        <span class="piitem-text">
          <div class="piitem-text-headline">{{ $t('Payments.PNM.PushDebit.Headline') }}</div>
          <div class="piitem-text-desc">{{ $t('Payments.PNM.PushDebit.Desc') }}</div>
        </span>
      </div>
    </div>
    <!-- Cash -->
    <div class="payment__instrument injected" v-if="type==='pnmCash'">
      <span class="piitem-arrow" @click="closeDialog()"><v-icon>chevron_left</v-icon></span>
      <div class="piitem-content">
        <span class="piitem-picture"><img :src="mediaServer('/static/brand-img/' + brandKey + '/paynearme.svg')" alt="paynearme"/></span>
        <span class="piitem-text">
          <div class="piitem-text-headline">{{ $t('Payments.PNM.Cash.Headline') }}</div>
          <div class="piitem-text-desc">{{ $t('Payments.PNM.Cash.Desc') }}</div>
        </span>
      </div>
    </div>
    <!-- Ach -->
    <div class="payment__instrument injected" v-if="type==='pnmAch'">
      <span class="piitem-arrow" @click="closeDialog()"><v-icon>chevron_left</v-icon></span>
      <div class="piitem-content">
        <span class="piitem-picture"><img :src="mediaServer('/static/brand-img/' + brandKey + '/ach.svg')" alt="ach"/></span>
        <span class="piitem-text">
          <div class="piitem-text-headline">{{ $t('Payments.PNM.Ach.Headline') }}</div>
          <div class="piitem-text-desc">{{ $t('Payments.PNM.Ach.Desc') }}</div>
        </span>
      </div>
    </div>
    <!-- Apple Pay -->
    <div class="payment__instrument injected" v-if="type==='pnmAPay'">
      <span class="piitem-arrow" @click="closeDialog()"><v-icon>chevron_left</v-icon></span>
      <div class="piitem-content">
        <span class="piitem-picture"><img :src="mediaServer('/static/brand-img/' + brandKey + '/apay.svg')" alt="apay"/></span>
        <span class="piitem-text">
          <div class="piitem-text-headline">{{ $t('Payments.PNM.APay.Headline') }}</div>
          <div class="piitem-text-desc">{{ $t('Payments.PNM.APay.Desc') }}</div>
        </span>
      </div>
    </div>
    <!-- Google Pay -->
    <div class="payment__instrument injected" v-if="type==='pnmGPay'">
      <span class="piitem-arrow" @click="closeDialog()"><v-icon>chevron_left</v-icon></span>
      <div class="piitem-content">
        <span class="piitem-picture"><img :src="mediaServer('/static/brand-img/' + brandKey + '/gpay.svg')" alt="gpay"/></span>
        <span class="piitem-text">
          <div class="piitem-text-headline">{{ $t('Payments.PNM.GPay.Headline') }}</div>
          <div class="piitem-text-desc">{{ $t('Payments.PNM.GPay.Desc') }}</div>
        </span>
      </div>
    </div>
    <!--Venmo -->
    <div class="payment__instrument injected" v-if="type==='pnmVenmo'">
      <span class="piitem-arrow" @click="closeDialog()"><v-icon>chevron_left</v-icon></span>
      <div class="piitem-content">
        <span class="piitem-picture pnm-img-paypal"><img :src="mediaServer('/static/brand-img/' + brandKey + '/venmo.svg')" alt="paypal"/></span>
        <span class="piitem-text">
          <div class="piitem-text-headline">{{ $t('Payments.PNM.Venmo.Headline') }}</div>
          <div class="piitem-text-desc">{{ $t('Payments.PNM.Venmo.Desc') }}</div>
        </span>
      </div>
    </div>
    <!--Paypal -->
    <div class="payment__instrument injected" v-if="type==='pnmPayPal'">
      <span class="piitem-arrow" @click="closeDialog()"><v-icon>chevron_left</v-icon></span>
      <div class="piitem-content">
        <span class="piitem-picture pnm-img-paypal"><img :src="mediaServer('/static/brand-img/' + brandKey + '/paypal.svg')" alt="paypal"/></span>
        <span class="piitem-text">
          <div class="piitem-text-headline">{{ $t('Payments.PNM.PayPal.Headline') }}</div>
          <div class="piitem-text-desc">{{ $t('Payments.PNM.PayPal.Desc') }}</div>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import Url from '@/components/mixins/Url'
import Branding from '@/components/mixins/Branding'

export default {
  props: ['type'],
  mixins: [Url, Branding],
  methods: {
    closeDialog () {
      this.$emit('closePNMGatewayDialog')
    }
  }
}
</script>
<style lang="stylus" scoped>
@import "~@/css/config"
.pi-container
  background-color white
  border-bottom 3px solid #0b4da1
  .payment__instrument
    display flex
    .piitem-content
      display flex
      flex 30
      justify-content center
      .piitem-picture
        display flex
        justify-content center
        align-items center
        padding 0 5px
        &.pnm-img-paypal
          img
            width 180px
        img
          height 60px
      .piitem-text
        display flex
        justify-content center
        flex-direction column
        .piitem-text-headline
          font-size 15px
          font-weight bold
        .piitem-text-desc
          font-size 12px
    .piitem-arrow
      cursor pointer
      display flex
      flex 1
      justify-content center
      align-items center
      i
        font-size 40px
</style>
