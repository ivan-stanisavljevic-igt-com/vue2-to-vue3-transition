<template>
  <div>
    <div class="forgotten-password ctsform" v-if="!isLoggedIn">
      <h1 key="fp_ForgotPassword">{{ $t('Account.ForgotPassword.Heading') }}</h1>
      <div key="fp_explanation" :class="disableForgottenPaswordViaEmail ? 'no-input' : ''" v-html="$t('Account.ForgotPassword.Body')"></div>
      <div class="control-block" :class="{ 'filled': username }" v-if="!disableForgottenPaswordViaEmail">
        <input id="qa-forgot-password" type="text" v-model.trim="username" autocomplete="off" @focusout="!forgottenPassDetails.username ? errorMessages.username = true : errorMessages.username = false" :maxlength="40"/>
        <label class="control-label" key="fp_usernameField_label">{{ $t('Account.ForgotPassword.Username') }}</label>
      </div>
      <div>
        <div class="vmsg invalid" v-if="errorMessages.username" key="fp_usernameField_error">{{ $t('Account.ForgotPassword.ErrorMessages.Username') }}</div>
      </div>
      <div class="save-container">
        <v-btn color="success" x-large @click.stop="saveBtnMethod()" id="qa-send-email"><span>{{ $t(saveBtnTextKey) }}</span></v-btn>
      </div>
      <ProcessingDialog
        v-model="dialog"
        :isDialogPersistent="true"
        :isProcessing="isProcessing"
        :isSuccess="!transactionError"
        :processingTitle="$t('Account.ForgotPassword.Dialog.Processing.Title')"
        :processingText="$t('Account.ForgotPassword.Dialog.Processing.Text')"
        :successTitle="successTitleText"
        :successText="$t('Account.ForgotPassword.Dialog.Success.Text')"
        :errorTitle="$t('Account.ForgotPassword.Dialog.Error.Title')"
        :closeBtnText="$t('ProcessingDialog.CloseButtonText')"
        >
        <div slot="text-error">
          <p v-if="brandKey !== 'sb'" class="generic-icon-note"><v-icon color="error" class="mr-1">error</v-icon><span id="qa-processingDialogError">{{ $t('ProcessingDialog.Error.Text') }}</span></p>
          <p class="response-error" id="qa-response-error">{{ transactionError }}</p>
          <p id="qa-contact-support" v-html="$t('Account.CloseAccount.Dialog.Error.Text.ContactSupport')"></p>
        </div>
      </ProcessingDialog>
      <div v-if="brandKey === 'sb'" class="vmsg customersupport" v-html="$t('Account.ForgottenPassword.ContactCustomerSupport')"></div>
    </div>
  </div>
</template>
<script>
  import store from '@/store'
  import lib from '@/library'
  import ProcessingDialog from '@/components/common/ProcessingDialog'
  import Branding from '@/components/mixins/Branding'
  import Validation from '@/components/mixins/Validation'
  import config from '@/config'

  export default {
    mixins: [
      Branding,
      Validation
    ],
    data: () => ({
      secretQuestionsArray: [],
      dialog: false,
      isProcessing: false,
      transactionError: null,
      forgottenPassDetails: {
        username: undefined,
        securityQuestion: undefined,
        securityAnswer: undefined
      },
      errorMessages: {
        username: false
        // securityQuestion: false,
        // securityAnswer: false
      }
    }),
    components: {
      ProcessingDialog
    },
    computed: {
      isLoggedIn () {
        return store.getters['isLoggedIn']
      },
      username: {
        get () {
          return this.forgottenPassDetails.username
        },
        set (value) {
          if (value.length === 0) {
            this.errorMessages.username = true
          } else {
            this.errorMessages.username = false
          }
          this.forgottenPassDetails.username = value
        }
      },
      successTitleText () {
        let sT = this.$t('Account.ForgotPassword.Dialog.Success.Title')
        return this.brandKey === 'sb' ? sT.toUpperCase() : sT
      },
      disableForgottenPaswordViaEmail () {
        return config.app.autoconf.DISABLE_FORGOTTEN_PASSWORD_VIA_EMAIL
      },
      saveBtnTextKey () {
        return this.disableForgottenPaswordViaEmail ? 'Dialog.btn.CLOSE' : 'Account.SendMail'
      }
    },
    methods: {
      save () {
        if (this.isEverythingValid()) {
          this.isProcessing = true
          this.transactionError = null
          this.dialog = true
          lib.rpcService.callBroker('iw', 'sendrecoverymessage', {
            'identifier': this.username
          })
          .then((response) => {
            if (response && response.exceptionType && response.message) {
              this.transactionError = response.message
            } else {
              this.isProcessing = false
            }
          })
          .catch((err) => {
            this.transactionError = err.message || this.$t('Server.ErrorMsg.Generic')
          })
          .finally(() => {
            if (this.brandKey === 'sb') {
              this.setProcessingDialogStyle()
            }
            this.isProcessing = false
          })
        }
      },
      saveBtnMethod () {
        if (this.disableForgottenPaswordViaEmail) {
          this.$router.push({name: 'home'})
        } else {
          this.save()
        }
      },
      isEverythingValid () {
        let isValid = true
        this.isAnyUnpopulatedField()
        Object.values(this.errorMessages).forEach(val => {
          if (val) {
            isValid = false
          }
        })
        return isValid
      },
      isAnyUnpopulatedField () {
        if (!this.forgottenPassDetails.username) {
          this.errorMessages.username = true
        }
      },
      setProcessingDialogStyle () {
        let processingDialog = document.getElementsByClassName('sightline-transaction-dialog')
        if (processingDialog && processingDialog[0] && !this.transactionError) {
          processingDialog[0].classList.add('gothic_font')
        }
      }
    }
  }
</script>
<style lang="stylus" scoped>
  @import "~@/css/config"
  .forgotten-password
    cursor default
  .no-input
    padding-bottom: 20px
  .control-block
    >>> select
      cursor pointer
  .save-container
    text-align center
  .response-error
    font-size 18px
    font-weight bold
  .customersupport
    padding-top 50px
</style>
