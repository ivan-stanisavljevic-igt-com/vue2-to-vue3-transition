<template>
  <div>
    <div class="reset-password ctsform" v-if="isLoggedIn">
      <h1 key="rp_ChangePassword">{{ $t('Account.ChangePassword.Heading') }}</h1>
      <div class="control-block" :class="{ 'filled': oldPassword }">
        <input type="password" v-model="oldPassword" autocomplete="off" :maxlength="vldPasswordMaxLength" />
        <label class="control-label" key="rp_oldPassword_label">{{ $t('Account.ChangePassword.OldPassword') }}</label>
      </div>
      <div>
        <div class="vmsg invalid" v-if="errorMessages.oldPassMissing" key="rp_oldPassword_error">{{ $t('Account.ChangePassword.ErrorMessages.OldPassword') }}</div>
      </div>
      <div class="control-block" :class="{ 'filled': newPassword }">
        <input type="password" v-model="newPassword" autocomplete="off" :maxlength="vldPasswordMaxLength" />
        <label class="control-label" key="rp_newPassword_label">{{ $t('Account.ChangePassword.NewPassword') }}</label>
      </div>
      <div>
        <div class="vmsg invalid" v-if="errorMessages.newPassMissing" key="rp_newPasswordMissing_error">{{ $t('Account.ChangePassword.ErrorMessages.NewPasswordMissing') }}</div>
        <div class="vmsg invalid" v-if="errorMessages.samePass" key="rp_samePass_error">{{ $t('Account.ChangePassword.ErrorMessages.SamePassword') }}</div>
      </div>
      <div class="control-block" :class="{ 'filled': confirmNewPassword }">
        <input type="password" v-model="confirmNewPassword" autocomplete="off" :maxlength="vldPasswordMaxLength" />
        <label class="control-label" key="rp_confirmNewPassword_label">{{ $t('Account.ChangePassword.ConfirmNewPassword') }}</label>
      </div>
      <div>
        <div class="vmsg invalid" v-if="errorMessages.confirmNewPassMissing" key="rp_confirmNewPassword_Missing_error">{{ $t('Account.ChangePassword.ErrorMessages.ConfirmNewPassword.Missing') }}</div>
        <div class="vmsg invalid" v-if="errorMessages.confirmedNewPassNotSame" key="rp_confirmNewPassword_NotSamePass_error">{{ $t('Account.ChangePassword.ErrorMessages.ConfirmNewPassword.NotSame') }}</div>
      </div>
      <div class="save-container">
        <v-btn color="success" x-large @click.stop="save()"><span>{{ $t('Account.Save') }}</span></v-btn>
      </div>
      <ProcessingDialog
        v-model="dialog"
        :isDialogPersistent="true"
        :isProcessing="isProcessing"
        :isSuccess="!transactionError"
        :processingTitle="$t('Account.PersonalDetails.Dialog.Processing.Title')"
        :processingText="$t('Account.PersonalDetails.Dialog.Processing.Text')"
        :successTitle="$t('Account.ChangePassword.Dialog.Success.Title')"
        :successText="$t('Account.ChangePassword.Dialog.Success.Text')"
        :errorTitle="$t('Account.ChangePassword.Dialog.Error.Title')"
        :closeBtnText="$t('ProcessingDialog.CloseButtonText')"
      >
        <div slot="text-error">
          <p v-if="brandKey !=='sb'" class="generic-icon-note"><v-icon color="error" class="mr-1">error</v-icon><span>{{ $t('Account.Join.Dialog.Error.Text') }}</span></p>
          <p class="response-error">{{ transactionError }}</p>
          <p v-html="$t('Account.ChangePassword.Dialog.Error.Text.ContactSupport')"></p>
        </div>
      </ProcessingDialog>
    </div>
  </div>
</template>
<script>
  import store from '@/store'
  import lib from '@/library'
  import ProcessingDialog from '@/components/common/ProcessingDialog'
  import Branding from '@/components/mixins/Branding'
  import Validation from '@/components/mixins/Validation'

  export default {
    mixins: [
      Branding,
      Validation
    ],
    name: 'ResetPassword',
    components: {
      ProcessingDialog
    },
    data: () => ({
      oldPasswordField: undefined,
      newPasswordField: undefined,
      confirmNewPasswordField: undefined,
      errorMessages: {
        oldPassMissing: true,
        oldPasswordIncorrect: undefined,
        newPassMissing: true,
        samePass: undefined,
        confirmNewPassMissing: true,
        confirmedNewPassNotSame: undefined
      },
      msgFromServer: undefined,
      dialog: false,
      isProcessing: false,
      transactionError: null
    }),
    computed: {
      isLoggedIn () {
        return store.getters['isLoggedIn']
      },
      oldPassword: {
        get () {
          return this.oldPasswordField
        },
        set (value) {
          if (value.length === 0) {
            this.errorMessages.oldPassMissing = true
          } else {
            this.errorMessages.oldPassMissing = false
          }
          this.oldPasswordField = value
        }
      },
      newPassword: {
        get () {
          return this.newPasswordField
        },
        set (value) {
          if (value.length === 0) {
            this.errorMessages.newPassMissing = true
          } else {
            this.errorMessages.newPassMissing = false
            if (value === this.oldPassword) {
              this.errorMessages.samePass = true
            } else {
              this.errorMessages.samePass = false
            }
            if (this.confirmNewPassword && (value !== this.confirmNewPassword)) {
              this.errorMessages.confirmedNewPassNotSame = true
            } else {
              this.errorMessages.confirmedNewPassNotSame = false
            }
          }
          this.newPasswordField = value
        }
      },
      confirmNewPassword: {
        get () {
          return this.confirmNewPasswordField
        },
        set (value) {
          if (value.length === 0) {
            this.errorMessages.confirmNewPassMissing = true
            this.errorMessages.confirmedNewPassNotSame = false
          } else {
            this.errorMessages.confirmNewPassMissing = false
            if (this.newPassword && (value !== this.newPassword)) {
              this.errorMessages.confirmedNewPassNotSame = true
            } else {
              this.errorMessages.confirmedNewPassNotSame = false
            }
          }
          this.confirmNewPasswordField = value
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
      }
    },
    methods: {
      save () {
        if (this.isEverythingValid) {
          this.isProcessing = true
          this.transactionError = null
          this.dialog = true
          lib.rpcService.callBroker('UserService', 'SetPassword', {
            'oldPassword': this.oldPassword,
            'password': this.newPassword
          })
          .then((response) => {
            if (response && response.exceptionType && response.message) {
              this.transactionError = response.message
            } else {
              this.isProcessing = false
            }
          })
          .catch(err => {
            this.transactionError = err.message || this.$t('Server.ErrorMsg.Generic')
          })
          .finally(() => {
            this.isProcessing = false
          })
        }
      }
    }
  }
</script>
<style lang="stylus" scoped>
  @import "~@/css/config"
    .save-container
      text-align center
    .popup-container
      width 100%
      height 100%
      background rgba(0,0,0,.7)
      position fixed
      top 0
      left 0
      z-index 100
      cursor pointer
      .popup-child
        display: block
        text-align center
        top 43%
        position relative
        color #ff5656
        font-size 20px
        margin 5px
        &.success-se
          color #4caf50
</style>
