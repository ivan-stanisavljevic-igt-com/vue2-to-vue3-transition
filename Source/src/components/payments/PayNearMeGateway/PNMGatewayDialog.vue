<template>
  <v-dialog
      v-model="show"
      height="100%"
      content-class="pnmgw__dialog"
    >
    <div class="payments__spinner payments__spinner__override" v-if="iFrameIsLoading">
      <v-progress-circular indeterminate></v-progress-circular>
      {{ $t('Transaction.PleaseWait') }}
    </div>
    <v-card class="pnmgw__dialog__card" :class="{ 'hidden': iFrameIsLoading }">
      <PNMGatewayDialogHeader :type="type" @closePNMGatewayDialog="closeAction()"/>
      <iframe class="pnmgw__dialog__card__iframe" @load="stopSpinner()"
        :src="redirectionUrl"
        ref="pnmDebit"
        allowpaymentrequest> <!-- allowpaymentrequest prop is from PNM API -->
      </iframe>
    </v-card>
    </v-dialog>
</template>

<script>
import store from '@/store'
import PNMGatewayDialogHeader from '@/components/payments/PayNearMeGateway/PNMGatewayDialogHeader'

export default {
  props: ['redirectionUrl', 'type'],
  components: {
    PNMGatewayDialogHeader
  },
  data () {
    return {
      dialog: false,
      iFrameIsLoading: false
    }
  },
  computed: {
    show: {
      get () {
        return this.redirectionUrl
      },
      set () {
        this.dialog = false
        store.commit(`pnmGateway/${this.type}/redirectionURL`, undefined)
      }
    }
  },
  methods: {
    closeDialog () {
      store.dispatch('background/applyBackgroundImage')
      this.dialog = false
      store.commit(`pnmGateway/${this.type}/redirectionURL`, undefined)
      store.commit(`pnmGateway/currentRef`, null)
    },
    stopSpinner () {
      this.iFrameIsLoading = false
    },
    removeScrollbar () {
      if (!window.ctsautoconf.MOBILE_LS) {
        window.document.getElementsByTagName('html')[0].style = 'overflow: hidden'
      }
    },
    closeAction () {
      this.closeDialog()
      this.bringBackScrollbar()
    },
    bringBackScrollbar () {
      if (!window.ctsautoconf.MOBILE_LS) {
        window.document.getElementsByTagName('html')[0].style = 'overflow: initial'
      }
    }
  },
  mounted () {
    store.commit(`pnmGateway/currentRef`, this.type)
    this.iFrameIsLoading = true
    this.removeScrollbar()
  },
  destroyed () {
    // must ensure clean actions in case of sudden logout
    this.closeDialog()
    this.bringBackScrollbar()
    this.stopSpinner()
  }
}
</script>

<style lang="stylus" scoped>
@import "~@/css/config"
>>> .pnmgw__dialog
  height 100%
  max-height unset
  width 100%
  max-width unset
  margin 0
  padding 0
  .payments__spinner__override
    position relative
    height 100%
    display flex
    align-items center
    justify-content center
    font-size 14px
  .pnmgw__dialog__card
    width 100%
    height 100%!important
    display flex
    flex-direction column
    &.hidden
      display none
    .pnmgw__dialog__card__iframe
      width 100%
      height 100%
      border none
</style>
