<template>
  <div class="payment__instrument injected" @click="start()">
    <div class="pi-item-wrapper" v-if="!processing">
      <span class="piitem-picture"><img :src="mediaServer('/static/brand-img/' + brandKey + '/apay.svg')" alt="apay"/></span>
      <span class="piitem-text">
        <div class="piitem-info">
          <div class="piitem-text-headline">{{ $t('Payments.PNM.APay.Headline') }}</div>
          <div class="ios__info">{{ $t('Payments.PNM.APay.Supported') }}</div>
        </div>
        <div class="piitem-text-desc">{{ $t('Payments.PNM.APay.Desc') }}</div>
      </span>
      <span class="piitem-arrow"><v-icon>chevron_right</v-icon></span>
    </div>
    <PNMGatewaySpinnerModal :type="type" v-if="processing"></PNMGatewaySpinnerModal>
    <PNMGatewayDialog v-if="redirectionUrl" 
      :redirectionUrl="redirectionUrl" 
      :type="type"
      ref="pnmGatewayDialog">
    </PNMGatewayDialog>
  </div>
</template>
<script>
import store from '@/store'
import PNMGatewayDialog from '@/components/payments/PayNearMeGateway/PNMGatewayDialog'
import Url from '@/components/mixins/Url'
import Branding from '@/components/mixins/Branding'
import PNMGatewaySpinnerModal from '@/components/payments/PayNearMeGateway/PNMGatewaySpinnerModal'

export default {
  components: {
    PNMGatewayDialog,
    PNMGatewaySpinnerModal
  },
  props: ['type'],
  mixins: [Url, Branding],
  methods: {
    start () {
      if (this.customerCanDeposit) store.dispatch('pnmGateway/pnmAPay/start')
    },
    closePNMIFrame () {
      if (this.$refs && this.$refs.pnmGatewayDialog) {
        this.$refs.pnmGatewayDialog.closeDialog()
      }
    }
  },
  computed: {
    processing: () => store.getters['pnmGateway/pnmAPay/processing'],
    defaultProcessingMessage () {
      return this.$t('Transaction.PleaseWait')
    },
    redirectionUrl: () => store.getters['pnmGateway/pnmAPay/redirectionURL'],
    customerContext: () => store.getters['getCustomerContext'],
    customerCanDeposit () {
      return this.customerContext && this.customerContext.ActionDeposit
    }
  }
}
</script>
<style lang="stylus" scoped>
@import "~@/css/config"
  .payment__instrument
    min-height 63px
    .piitem-info
      display flex
      align-items center
      .ios__info
        border-radius 5px
        margin 0 5px
        padding 0 5px
        background #e5e5e5
        font-size 12px
        text-align center
</style>