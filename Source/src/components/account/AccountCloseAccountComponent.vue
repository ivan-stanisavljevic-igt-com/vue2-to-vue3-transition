<template>
  <div v-if="isLoggedIn">
    <!-- Account summary tempalte -->
    <template v-if="accountSummaryFlow">
      <h1 v-if="!mobileBigAndBelow">{{ $t('Account.CloseAccount.Heading') }}</h1>
      <div v-if="mobileBigAndBelow" class="account-heading"><icon name="icon-close-account"></icon>{{ $t('Account.CloseAccount.Heading') }}</div>
    </template>
    <!-- Account standard tempalte -->
    <template v-if="!accountSummaryFlow">
      <h1 key="ca_CloseAcc">{{ $t('Account.CloseAccount.Heading') }}</h1>
    </template>
    <div class="close-account close-account-page ctsform">
      <span v-if="isAccountClosable">{{ $t('Account.CloseAccount.Closable.Desc') }}</span>
      <span v-if="!isAccountClosable">
        <span v-if="isPendingInvestigation" class="errfromserver">{{ $t('Account.CloseAccount.NotClosable.PendingInvestigation.Desc') }}</span>
        <span v-else-if="isSuspended" class="errfromserver">{{ $t('Account.CloseAccount.NotClosable.Suspended.Desc') }}</span>
        <span v-else class="errfromserver">{{ $t('Account.CloseAccount.NotClosable.Desc') }}</span>
      </span>
      <div v-if="isAccountClosable">
        <div class="control-block" :class="{ 'filled': password }">
          <input :type="showPassword ? 'text' : 'password'" v-model="password" id="password" autocomplete="off"/>
          <span v-if="!errorMessages.passwordMissing" class="show_hide" @click="toggleShowPassword">{{ showPassword ? 'Hide' : 'Show' }}</span>
          <label class="control-label" key="password_label">{{ $t('Account.CloseAccount.Password') }}</label>
        </div>
        <div>
          <div class="vmsg invalid" v-if="errorMessages.passwordMissing" id="err_msg_password_missing" key="ca_password_error">{{ $t('Account.CloseAccount.ErrorMessages.Password') }}</div>
        </div>
        <div class="save-container">
          <v-btn v-if="isCloseAccountConfirmationPopupEnabled" color="success" x-large @click.stop="dialogAccClose = true" :disabled="errorMessages.passwordMissing"><span>{{ $t('Account.Save') }}</span></v-btn>
          <v-btn v-else @click.stop="save()" color="success" x-large id="btn_closeAccount" :disabled="errorMessages.passwordMissing"><span>{{ $t('Account.Save') }}</span></v-btn>
        </div>
      </div>
    </div>
    <v-dialog v-if="isCloseAccountConfirmationPopupEnabled" v-model="dialogAccClose" content-class="acc-close-conf">
      <div class="acc-close-confirmation">
        <span class="title">{{ $t('Account.CloseAccount.Dialog.Title') }}</span>
      </div>
      <v-layout>
        <v-flex xs6>
          <v-btn id="btn_cancelAccount" @click.stop="dialogAccClose = false"><span>{{ $t('Account.Cancel') }}</span></v-btn>
        </v-flex>
        <v-flex xs6>
          <v-btn @click.stop="save()" id="btn_closeAccount"><span>{{ $t('Account.Yes') }}</span></v-btn>
        </v-flex>
      </v-layout>
    </v-dialog>
    <ProcessingDialog
      @close="logout()"
      v-model="dialog"
      :isDialogPersistent="true"
      :isProcessing="isProcessing"
      :isSuccess="!transactionError"
      :processingTitle="$t('Account.CloseAccount.Dialog.Processing.Title')"
      :processingText="$t('Account.CloseAccount.Dialog.Processing.Text')"
      :successTitle="$t('Account.CloseAccount.Dialog.Success.Title')"
      :successText="$t('Account.CloseAccount.Dialog.Success.Text')"
      :errorTitle="$t('Account.CloseAccount.Dialog.Error.Title')"
      :closeBtnText="$t('ProcessingDialog.CloseButtonText')"
    >
      <div slot="text-error">
        <p v-if="brandKey !== 'sb'" class="generic-icon-note"><v-icon color="error" class="mr-1">error</v-icon><span>{{ $t('Account.CloseAccount.Dialog.Error.Text') }}</span></p>
        <p class="response-error">{{ transactionError }}</p>
        <p v-html="$t('Account.CloseAccount.Dialog.Error.Text.ContactSupport')"></p>
      </div>
    </ProcessingDialog>
  </div>
</template>
<script>
  import store from '@/store'
  import lib from '@/library'
  import config from '@/config'
  import ProcessingDialog from '@/components/common/ProcessingDialog'
  import Branding from '@/components/mixins/Branding'
  import Screen from '@/components/mixins/Screen'
  import Icon from '@/components/common/Icon'

  export default {
    mixins: [
      Branding,
      Screen
    ],
    data: () => ({
      passwordField: undefined,
      is4logout: false,
      errorMessages: {
        passwordMissing: true
      },
      dialog: false,
      dialogAccClose: false,
      isProcessing: false,
      transactionError: null,
      showPassword: false
    }),
    components: {
      ProcessingDialog,
      Icon
    },
    computed: {
      isLoggedIn () {
        return store.getters['isLoggedIn']
      },
      password: {
        get () {
          return this.passwordField
        },
        set (value) {
          if (value.length === 0) {
            this.errorMessages.passwordMissing = true
          } else {
            this.errorMessages.passwordMissing = false
          }
          this.passwordField = value
        }
      },
      isEverythingValid () {
        let isValid = true
        Object.values(this.errorMessages).forEach(val => {
          if (val) {
            isValid = false
          }
        })
        return isValid
      },
      customerContext () {
        return store.getters['getCustomerContext']
      },
      isAccountClosable () {
        return this.customerContext && this.customerContext.ActionClose
      },
      isPendingInvestigation () {
        return this.customerContext && this.customerContext.Flags && this.customerContext.Flags.split(',').includes('PEND')
      },
      isSuspended () {
        return this.customerContext && this.customerContext.Flags && this.customerContext.Flags.split(',').includes('SUSP')
      },
      accountSummaryFlow () {
        return window.ctsautoconf.ACCOUNT_SUMMARY_FLOW || false
      },
      isCloseAccountConfirmationPopupEnabled () {
        return config.app.autoconf.CLOSE_ACCOUNT_CONFIRMATION_POPUP
      }
    },
    methods: {
      toggleShowPassword () {
        this.showPassword = !this.showPassword
      },
      save () {
        if (this.isEverythingValid) {
          this.dialogAccClose = false
          this.isProcessing = true
          this.transactionError = null
          this.dialog = true
          lib.rpcService.callBroker('user', 'closeaccountbycustomer', {
            'Password': this.password,
            'CloseReason': ''
          })
          .then((response) => {
            if (response && response.message) {
              this.transactionError = response.message
            } else if (response && response.result === null) {
              this.isProcessing = false
              this.is4logout = true
            }
          })
          .catch((err) => {
            if (err && err.exceptionType && err.exceptionType === 'InvalidParametersException') {
              this.transactionError = this.$t('Account.CloseAccount.Error.WrongPass')
            } else {
              this.transactionError = err.message || this.$t('Server.ErrorMsg.Generic')
            }
          })
          .finally(() => {
            this.isProcessing = false
          })
        }
      },
      logout () {
        if (this.is4logout) {
          store.dispatch('logout')
        }
      }
    }
  }
</script>
<style lang="stylus" scoped>
  @import "~@/css/config"
    .close-account
      cursor default
    .save-container
      text-align center
    .response-error
      font-size 18px
      font-weight bold
    .show_hide
      float right
      margin -30px 0px 0 5px
      z-index 100
      position relative
      color #0b4da1
      text-transform uppercase
      cursor pointer
      font-size 11px
      color var(--login-dialog-input-label-color) !important
      font-size 12px
      margin-right 5px !important
      text-align right
      -ms-flex-item-align end
      align-self flex-end
      text-transform none
      font-family "Open Sans Bold"
    >>>.acc-close-conf
      @media tablet-and-above
        max-width 400px
      .acc-close-confirmation
        margin-bottom 20px
        text-align center
        .title
          font-size 16px !important
          color var(--account-pages-headings-color)
          text-transform none
          text-align center   
          line-height 26px !important
          @media tablet-and-above
            font-size 20px !important
            line-height 30px !important
      .layout
        gap 10px     
      button
        width 100%
        height 35px
        margin 0
        @media tablet-and-above
          height 40px
      #btn_cancelAccount
        background var(--account-pages-primary-btn-bgr)
        border var(--account-pages-primary-btn-border)
        color var(--account-pages-primary-btn-color)
        border-radius var(--account-pages-btn-border-radius)
      #btn_closeAccount
        background var(--account-pages-secondary-btn-bgr)
        border var(--account-pages-secondary-btn-border)
        color var(--account-pages-secondary-btn-color)
        border-radius var(--account-pages-btn-border-radius)
    .title
      font-family "Open Sans Bold" !important
</style>
