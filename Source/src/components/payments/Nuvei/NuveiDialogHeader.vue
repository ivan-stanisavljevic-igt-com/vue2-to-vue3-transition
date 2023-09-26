<template>
  <div class="pi-container">
    <!-- Nuvei Card -->
    <div class="payment__instrument injected" v-if="type==='nuveiCard'">
      <span class="piitem-arrow" @click="closeDialog()"><v-icon>chevron_left</v-icon></span>
      <div class="piitem-content">
        <span class="piitem-picture"><img :src="mediaServer('/static/brand-img/' + brandKey + '/card-v2.svg')" alt="card"/></span>
        <span class="piitem-text">
          <div class="piitem-text-headline">{{ $t('Payments.Nuvei.Card.Headline') }}</div>
          <div class="piitem-text-desc">{{ $t('Payments.Nuvei.Card.Desc') }}</div>
        </span>
      </div>
    </div>
    <!-- Nuvei PayPal -->
    <div class="payment__instrument injected" v-if="type==='nuveiPayPal'">
      <span class="piitem-arrow" @click="closeDialog()"><v-icon>chevron_left</v-icon></span>
      <div class="piitem-content">
        <span class="piitem-picture"><img :src="mediaServer('/static/brand-img/' + brandKey + '/paypal.svg')" alt="card"/></span>
        <span class="piitem-text">
          <div class="piitem-text-headline">{{ $t('Payments.PNM.PayPal.Headline') }}</div>
          <div class="piitem-text-desc">{{ $t('Payments.Nuvei.PayPal.Desc') }}</div>
        </span>
      </div>
    </div>
    <!-- Nuvei VP -->
    <div class="payment__instrument injected" v-if="type==='nuveiVP'">
      <span class="piitem-arrow" @click="closeDialog()"><v-icon>chevron_left</v-icon></span>
      <div class="piitem-content">
        <span class="piitem-picture"><img :src="mediaServer('/static/brand-img/' + brandKey + '/vip-preferred.svg')" alt="vip-preferred"/></span>
        <span class="piitem-text">
          <div class="piitem-text-headline">{{ $t('Payments.Nuvei.VP.Headline') }}</div>
          <div class="piitem-text-desc">{{ $t('Payments.Nuvei.VP.Desc') }}</div>
        </span>
      </div>
    </div>
    <!-- Nuvei ACH -->
    <div class="payment__instrument injected" v-if="type==='nuveiACH'">
      <span class="piitem-arrow" @click="closeDialog()"><v-icon>chevron_left</v-icon></span>
      <div class="piitem-content">
        <span class="piitem-picture"><img :src="mediaServer('/static/brand-img/' + brandKey + '/ach-v2.svg')" alt="ach"/></span>
        <span class="piitem-text">
          <div class="piitem-text-headline">{{ $t('Payments.Nuvei.ACH.Headline') }}</div>
          <div class="piitem-text-desc">{{ $t('Payments.Nuvei.ACH.Desc') }}</div>
        </span>
      </div>
    </div>
    <!-- Nuvei APay -->
    <div class="payment__instrument injected" v-if="type==='nuveiAPay'">
      <span class="piitem-arrow" @click="closeDialog()"><v-icon>chevron_left</v-icon></span>
      <div class="piitem-content">
        <span class="piitem-picture"><img :src="mediaServer('/static/brand-img/' + brandKey + '/apay.svg')" alt="apay"/></span>
        <span class="piitem-text">
          <div class="piitem-text-headline">{{ $t('Payments.PNM.APay.Headline') }}</div>
          <div class="piitem-text-desc">{{ $t('Payments.PNM.APay.Desc') }}</div>
        </span>
      </div>
    </div>
    <!-- Nuvei PNM -->
    <div class="payment__instrument injected" v-if="type==='nuveiPNM'">
      <span class="piitem-arrow" @click="closeDialog()"><v-icon>chevron_left</v-icon></span>
      <div class="piitem-content">
        <span class="piitem-picture"><img :src="mediaServer('/static/brand-img/' + brandKey + '/paynearme.svg')" alt="apay"/></span>
        <span class="piitem-text">
          <div class="piitem-text-headline">{{ $t('Payments.PNM.Cash.Headline') }}</div>
          <div class="piitem-text-desc">{{ $t('Payments.Nuvei.PNM.Desc') }}</div>
        </span>
      </div>
    </div>
    <!-- Nuvei Play Plus -->
    <div class="payment__instrument injected" v-if="type==='nuveiPlayPlus'">
      <span class="piitem-arrow" @click="closeDialog()"><v-icon>chevron_left</v-icon></span>
      <div class="piitem-content">
        <span class="piitem-picture"><img :src="mediaServer('/static/brand-img/' + brandKey + '/play-plus.svg')" alt="play-plus"/></span>
        <span class="piitem-text">
          <div class="piitem-text-headline">{{ $t('Transaction.Sightline') }}</div>
          <div class="piitem-text-desc">{{ $t('Payments.Nuvei.PlayPlus.Desc') }}</div>
        </span>
      </div>
    </div>
    <!-- Nuvei Venmo -->
    <div class="payment__instrument injected" v-if="type==='nuveiVenmo'">
      <span class="piitem-arrow" @click="closeDialog()"><v-icon>chevron_left</v-icon></span>
      <div class="piitem-content">
        <span class="piitem-picture"><img :src="mediaServer('/static/brand-img/' + brandKey + '/venmo.svg')" alt="venmo"/></span>
        <span class="piitem-text">
          <div class="piitem-text-headline">{{ $t('Payments.PNM.Venmo.Headline') }}</div>
          <div class="piitem-text-desc">{{ $t('Payments.PNM.Venmo.Desc') }}</div>
        </span>
      </div>
    </div>
    <!-- Nuvei Wd -->
    <div class="payment__instrument injected" v-if="type==='nuveiWd'">
      <span class="piitem-arrow" @click="closeDialog()"><v-icon>chevron_left</v-icon></span>
      <div class="piitem-content">
        <span class="piitem-picture"><img :src="mediaServer('/static/brand-img/' + brandKey + '/cash-v2.svg')" alt="cash"/></span>
        <span class="piitem-text">
          <div class="piitem-text-headline">{{ $t('Payments.PNM.PushDebit.Headline') }}</div>
          <div class="piitem-text-desc">{{ $t('Payments.Nuvei.Wd.Desc.Wd') }}</div>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import Url from '@/components/mixins/Url'
import Branding from '@/components/mixins/Branding'
import store from '@/store'

export default {
  props: ['type'],
  mixins: [Url, Branding],
  methods: {
    closeDialog () {
      this.$emit('closeNuveiDialog')
      store.dispatch('nuvei/nuveiWd/cardCheck')
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
          height 40px
          margin 10px 0
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
