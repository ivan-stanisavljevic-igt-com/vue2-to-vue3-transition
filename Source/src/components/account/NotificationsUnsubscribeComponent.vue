<template>
  <div class="accpage">
    <div class="notification-unsubscribe ctsform">
      <ProcessingDialog
        v-model="dialog"
        :isDialogPersistent="true"
        :isProcessing="isProcessing"
        :isSuccess="!transactionError"
        :processingTitle="$t('Account.ForgotPassword.Dialog.Processing.Title')"
        :processingText="$t('Account.ForgotPassword.Dialog.Processing.Text')"
        :successTitle="$t('Account.ForgotPassword.Dialog.Success.Title')"
        :successText="$t('Notifications.Unsubscribe.Dialog.Success.Text')"
        :errorTitle="$t('Account.ForgotPassword.Dialog.Error.Title')"
        :closeBtnText="$t('ProcessingDialog.CloseButtonText')"
        @close="go2Home()"
      >
      <div slot="text-error">
        <p v-if="brandKey !== 'sb'" class="generic-icon-note"><v-icon color="error" class="mr-1">error</v-icon><span>{{ $t('ProcessingDialog.Error.Text') }}</span></p>
        <p class="response-error">{{ transactionError }}</p>
        <p v-html="$t('Account.CloseAccount.Dialog.Error.Text.ContactSupport')"></p>
      </div>
    </ProcessingDialog>
    </div>
  </div>
</template>
<script>
  import lib from '@/library'
  import ProcessingDialog from '@/components/common/ProcessingDialog'
  import Branding from '@/components/mixins/Branding'

  export default {
    mixins: [
      Branding
    ],
    data: () => ({
      dialog: false,
      isProcessing: false,
      transactionError: null
    }),
    components: {
      ProcessingDialog
    },
    methods: {
      async unsubscibe () {
        let token = this.getToken()
        if (token) {
          try {
            this.isProcessing = true
            this.transactionError = null
            this.dialog = true
            const response = await lib.rpcService.callBroker('GamingNotificationService', 'unsubscribewithtoken', {
              'token': token
            })
            if (response && response.exceptionType && response.message) {
              this.transactionError = response.message
            } else {
              this.isProcessing = false
            }
          } catch (exception) {
            this.transactionError = exception.message || this.$t('Server.ErrorMsg.Generic')
          } finally {
            this.isProcessing = false
          }
        }
      },
      getToken: () => window.location.href.split('?tempToken=')[1],
      go2Home () {
        this.$router.push({ name: 'home' })
      }
    },
    mounted () {
      this.unsubscibe()
    }
  }
</script>
<style lang="stylus" scoped>
  @import "~@/css/config"
  .response-error
    font-size 18px
    font-weight bold
</style>
