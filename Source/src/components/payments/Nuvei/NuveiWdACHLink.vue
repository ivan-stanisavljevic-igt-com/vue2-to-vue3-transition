<template>
  <div class="payments__instruments_item" 
    :class="{'diss': !customerCanWithdraw || !hasMadeDeposit}" 
    v-if="isPaymentInstrumentAvailable" 
    @click.stop="go2InstrumentPage()"
  >
    <span class="piitem-picture"><img :src="mediaServer('/static/brand-img/' + brandKey + '/ach-v2.svg')" alt="ach"/></span>
    <span class="piitem-text">
      <div class="piitem-text-headline">
	    {{ $t('Payments.Nuvei.ACH.Headline') }}
        <span v-if="!hasMadeDeposit && customerCanWithdraw" class="piitem-must-deposit">{{ $t('Payments.PNM.PayPalWithdrawal.Enable') }}</span>
      </div>
       <div class="piitem-text-desc">{{ $t('Payments.Nuvei.ACH.Wd.Desc') }}</div>
    </span>
    <span class="piitem-arrow"><v-icon>chevron_right</v-icon></span>
  </div>
</template>
<script>
import store from '@/store'
import Url from '@/components/mixins/Url'
import Branding from '@/components/mixins/Branding'
import router from '@/router'

const type = 'nuveiWdACH'

export default {
  mixins: [Url, Branding],
  computed: {
    customerContext () {
      return store.getters['getCustomerContext']
    },
    customerCanWithdraw () {
      return this.customerContext && this.customerContext.ActionWithdraw
    },
    isPaymentInstrumentAvailable () {
      return store.getters[`nuvei/${type}/isPaymentInstrumentAvailable`]
    },
    hasMadeDeposit () {
      return store.getters[`nuvei/${type}/hasMadeDeposit`]
    }
  },
  methods: {
    go2InstrumentPage () {
      if (this.customerCanWithdraw && this.hasMadeDeposit) {
        router.push({
          path: `/account/nuvei-ach-withdrawal`,
          query: {
            'withdrawal_type': type
          }
        })
      }
    }
  }
}
</script>
<style lang="stylus" scoped>
</style>
