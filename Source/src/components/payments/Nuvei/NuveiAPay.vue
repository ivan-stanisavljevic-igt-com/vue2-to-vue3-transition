<template>
  <div class="payment__instrument injected" @click="start()">
    <div class="pi-item-wrapper">
      <span class="piitem-picture"><img :src="mediaServer('/static/brand-img/' + brandKey + '/apay.svg')" alt="apay"/></span>
      <span class="piitem-text">
        <div class="piitem-text-headline">{{ $t('Payments.PNM.APay.Headline') }}</div>
        <div class="piitem-text-desc">{{ $t('Payments.PNM.APay.Desc') }}</div>
      </span>
      <span class="piitem-arrow"><v-icon>chevron_right</v-icon></span>
    </div>
    <NuveiSpinnerModal :type="type" v-if="processing"></NuveiSpinnerModal>
    <NuveiDialog v-if="redirectionUrl" 
      :redirectionUrl="redirectionUrl" 
      :type="type"
      ref="nuveiDialog">
    </NuveiDialog>
  </div>
</template>
<script>
import store from '@/store'
import NuveiDialog from '@/components/payments/nuvei/NuveiDialog'
import Url from '@/components/mixins/Url'
import Branding from '@/components/mixins/Branding'
import NuveiSpinnerModal from '@/components/payments/nuvei/NuveiSpinnerModal'

export default {
  components: {
    NuveiDialog,
    NuveiSpinnerModal
  },
  props: ['type'],
  mixins: [Url, Branding],
  methods: {
    start () {
      if (this.customerCanDeposit) {
        store.dispatch(`nuvei/${this.type}/start`)
      }
    },
    closeNuveiIFrame () {
      if (this.$refs && this.$refs.nuveiDialog) {
        this.$refs.nuveiDialog.closeDialog()
      }
    }
  },
  computed: {
    processing () {
      return store.getters[`nuvei/${this.type}/processing`]
    },
    defaultProcessingMessage () {
      return this.$t('Transaction.PleaseWait')
    },
    redirectionUrl () {
      return store.getters[`nuvei/${this.type}/redirectionURL`]
    },
    customerContext () {
      return store.getters['getCustomerContext']
    },
    customerCanDeposit () {
      return this.customerContext && this.customerContext.ActionDeposit
    }
  }
}
</script>