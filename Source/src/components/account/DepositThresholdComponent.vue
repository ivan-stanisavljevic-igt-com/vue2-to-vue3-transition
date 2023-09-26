<template>
  <div class="page-content account">
    <div class="deposit-threshold ctsform" v-if="isLoggedIn">
      <h1 v-if="!accountSummaryFlow">{{ $t('Account.DepositThreshold') }}</h1>
      <div class="dep-treshold-container deposit-reached" v-if="lifetimeDepositReached">
        <p class="dep-reach-info">
          <span>{{$t('Account.DepositThreshold.Info', {currency: currencySymbol})}}</span><br>
          <span v-html="$t('Account.DepositThreshold.Info.Details', {currency: currencySymbol})"></span>
        </p>
        <div class="save-button-container form-actions">
          <v-btn class="transactions" color="success" x-large @click.stop="acknowledgeSuspension()"><span>{{ $t('Account.DepositThreshold.Confirmation') }}</span></v-btn>
        </div>
      </div>
      <div class="dep-treshold-container no-action" v-if="!lifetimeDepositReached">
        <p v-html="$t('Account.DepositThreshold.NoAction.Info', {currency: currencySymbol})"></p>
        <p v-html="$t('Account.DepositThreshold.NoAction', {currency: currencySymbol})"></p>
      </div>
    </div>
    <ProcessingDialog
      v-model="dialog"
      :isDialogPersistent="true"
      :isProcessing="isProcessing"
      :isSuccess="!transactionError"
      :processingTitle="$t('Account.PersonalDetails.Dialog.Processing.Title')"
      :processingText="$t('Account.PersonalDetails.Dialog.Processing.Text')"
      :successTitle="$t('Account.CloseAccount.Dialog.Success.Title')"
      :successText="$t('ProcessingDialog.Success.Text')"
      :errorTitle="$t('ProcessingDialog.Error.Title')"
      :closeBtnText="$t('ProcessingDialog.CloseButtonText')"
    >
      <div slot="text-error">
        <p v-if="brandKey !=='sb'" class="generic-icon-note"><v-icon color="error" class="mr-1">error</v-icon><span>{{ $t('Account.Join.Dialog.Error.Text') }}</span></p>
        <p class="response-error">{{ transactionError }}</p>
        <p v-html="$t('Account.PersonalDetails.Dialog.Error.Text.ContactSupport')"></p>
      </div>
    </ProcessingDialog>
  </div>
</template>
<script>
  import store from '@/store'
  import config from '@/config'
  import lib from '@/library'
  import ProcessingDialog from '@/components/common/ProcessingDialog'
  import Branding from '@/components/mixins/Branding'
  export default {
    mixins: [
      Branding
    ],
    components: {
      ProcessingDialog
    },
    data () {
      return {
        dialog: false,
        isProcessing: false,
        transactionError: null
      }
    },
    computed: {
      accountSummaryFlow () {
        return window.ctsautoconf.ACCOUNT_SUMMARY_FLOW || false
      },
      isLoggedIn () {
        return store.getters['isLoggedIn']
      },
      lifetimeDepositReached: () => store.getters['messageCenter/getLifetimeDepositReached'],
      currencySymbol () {
        return config.app.CURRENCY
      }
    },
    methods: {
      async acknowledgeSuspension () {
        try {
          this.isProcessing = true
          this.transactionError = null
          this.dialog = true
          let response = await lib.rpcService.callBroker('iw', 'acknowledgesuspension', {})
          if (response) {
            store.dispatch('getCustomerContext')
          }
        } catch (ex) {
          console.log(ex)
          this.transactionError = (ex && ex.error && ex.error.Message) || (ex && ex.message)
        } finally {
          this.isProcessing = false
        }
      }
    },
    mounted () {
    }
  }
</script>

<style lang="stylus" scoped>
@import '~@/css/config'
@import '~@/css/mixins'

.page-content.account
  .dep-treshold-container
    margin 5px
    border 1px solid #dbdce0
    padding 10px
    border-radius 0px
    cursor default
    .dep-reach-info
      text-align justify!important
      span
        display inline-block
        font-family 'Open Sans Regular'!important
        &:first-child
          margin-bottom 5px
</style>