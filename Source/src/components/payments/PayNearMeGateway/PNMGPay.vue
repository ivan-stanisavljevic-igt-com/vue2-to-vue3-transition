<template>
  <div class="payment__instrument injected" @click="start()">
    <div class="pi-item-wrapper" v-if="!processing">
      <span class="piitem-picture"><img :src="mediaServer('/static/brand-img/' + brandKey + '/gpay.svg')" alt="gpay"/></span>
      <span class="piitem-text">
        <div class="piitem-text-headline">{{ $t('Payments.PNM.GPay.Headline') }}</div>
        <div class="piitem-text-desc">{{ $t('Payments.PNM.GPay.Desc') }}</div>
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
      if (this.customerCanDeposit) store.dispatch('pnmGateway/pnmGPay/start')
    },
    closePNMIFrame () {
      if (this.$refs && this.$refs.pnmGatewayDialog) {
        this.$refs.pnmGatewayDialog.closeDialog()
      }
    }
  },
  computed: {
    processing: () => store.getters['pnmGateway/pnmGPay/processing'],
    defaultProcessingMessage () {
      return this.$t('Transaction.PleaseWait')
    },
    redirectionUrl: () => store.getters['pnmGateway/pnmGPay/redirectionURL'],
    customerContext: () => store.getters['getCustomerContext'],
    customerCanDeposit () {
      return this.customerContext && this.customerContext.ActionDeposit
    }
  }
}
</script>