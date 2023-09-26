<template>
    <div class="page-content account-authy">
      <div class="verTitles">
        <div class="verTextContainer" :class="{accountSummaryFlow, 'flex-grow-center': true}">
          <div class="titles">
            <p class="guidedTitle">{{ $t('Account.Authentication.2fa.Authentication') }}</p>
            <p class="title">{{ $t('Account.Authentication.2fa.AuthenticationByApp') }}</p>
          </div>
        </div>
        <v-icon class="close" @click.stop="closeAutyPopup()">close</v-icon>
      </div>
      <div v-if="formSubmitSppiner"><circle-loader></circle-loader></div>
      <div v-if="!formSubmitSppiner">
        <div class="flex-grow-center" v-if="createTotpError">
          <span>{{ $t('Account.Authentication.2fa.Authentication.QR.Creation.NotCreated') }}</span>
          <a v-on:click="createTotp()">{{ $t('Account.Authentication.2fa.Authentication.QR.Creation.TryAgain') }}</a>
        </div>
        <div v-else>
          <!-- Help -->
          <div class="help gray-box" v-show ="!helpVisible" @click.stop="showHelp()">
            <span class="flex-grow-center">{{ $t('Account.Authentication.2fa.Authentication.Help') }}</span>
            <v-icon  class="chevron_down">expand_more</v-icon>
          </div>
          <div class="help gray-box" v-show ="helpVisible" @click.stop="hideHelp()">
            <span class="flex-grow-center">{{ $t('Account.Authentication.2fa.Authentication.Help') }}</span>
            <v-icon class="chevron_up">expand_less</v-icon>
          </div>
          <div class="help-text" v-if="helpVisible" v-html="$t('Account.Authentication.2fa.Authentication.Help.Text')">
          </div>
          <!-- dynamic verification component: email, phone, personal data, mobile phone ownership -->
          <div class="qrcode-box">
            <vue-qr :text="totpUri" :size="200"></vue-qr>
          </div>
          <div class="text-center margin-b-10 font-bold">
            <span>{{ $t('Account.Authentication.2fa.Authentication.ProblemWithQRCode') }}</span><br>
            <span>{{ $t('Account.Authentication.2fa.Authentication.CopyQRCode') }}</span>
          </div>
          <div ref="code" class="key-box">
            <span>{{totpSecret}}</span><br>
            <a v-on:click="copyCode" v-if="!copied">{{ $t('Account.Authentication.2fa.Authentication.CopyQRCodeToClipboard') }}</a>
            <a v-else>{{ $t('Account.Authentication.2fa.Authentication.QRCodeCopiedToClipboard') }}</a>
            <input type="button" id="copyBtn" >
          </div>
          <form @submit.prevent>
            <div class="enter-digits-pin">
              <label class="font-bold">{{ $t('Account.Authentication.2fa.Authentication.EnterPin') }}</label>
              <input autocomplete="off" v-model.trim="pinCode" name="qrCode" :maxlength="pinCodeLengthFromUri" @focusout="!qrCode ? errorMessages.pin = true : errorMessages.pin = false" />
            </div>
            <!-- PIN VALIDATION -->
            <div class="text-center">
              <div class="vmsg invalid" v-if="errorMessages.pin" id="err_msg_phone_missing" v-html="$t('Account.VerificationByPin.ErrorMsg.PinCode')"></div>
              <div class="vmsg invalid" v-if="errorMessages.pinNonDigit" id="err_msg_phone_not_digit" v-html="$t('Account.VerificationByPin.ErrorMsg.PinCodeNonDigit')"></div>
              <div class="vmsg invalid" v-if="errorMessages.pinLength" id="err_msg_phone_length" v-html="$t('Account.VerificationByPin.ErrorMsg.PinCodeApp.Length', {pinCodeAppLength: pinCodeLengthFromUri})"></div>
            </div>
            <p class="verify-text">{{ $t('Account.Authentication.2fa.Authentication.FormAuthentication') }}</p>
            <v-btn color="success" class="btn-verify" x-large @click.stop="verify()"><span>{{ $t('Account.Authentication.2fa.Authentication.Verify') }}</span></v-btn>
          </form>
        </div>
      </div>
      <!-- processing dialog -->
      <ProcessingDialog
        v-model="dialog"
        :isDialogPersistent="true"
        :isProcessing="isProcessing"
        :isSuccess="!transactionError"
        :processingTitle="$t('Account.Authentication.2fa.Dialog.Processing.Title')"
        :processingText="$t('Account.Authentication.2fa.Dialog.Processing.Text')"
        :successTitle="$t('Account.Authentication.2fa.Dialog.Success.Title')"
        :successText="$t('Account.Authentication.2fa.Dialog.Success.Text')"
        :errorTitle="$t('Account.Authentication.2fa.Dialog.Error.Title')"
        :closeBtnText="$t('ProcessingDialog.Authentication.2fa.CloseButtonText')"
        @close="closeAuthyDialog">
        <div slot="text-error">
          <p v-if="brandKey !=='sb'" class="generic-icon-note"><v-icon color="error" class="mr-1">error</v-icon><span>{{ $t('Account.Authentication.2fa.Dialog.Error.Text') }}</span></p>
          <p class="response-error">{{ transactionError }}</p>
          <p v-html="$t('Account.Authentication.2fa.Dialog.Error.Text.ContactSupport')"></p>
        </div>
      </ProcessingDialog>
    </div>
</template>

<script>
  import store from '@/store'
  import Branding from '@/components/mixins/Branding'
  import VerTitles from '@/components/account/Verification/VerTitles'
  import VueQr from 'vue-qr'
  import ProcessingDialog from '@/components/common/ProcessingDialog'
  import CircleLoader from '@/components/common/CircleLoader'
  import lib from '@/library'
  import mobileBridge from '@/library/mobileBridge'

  export default {
    name: 'AccountAuthentication',
    mixins: [
      Branding
    ],
    components: {
      VerTitles,
      VueQr,
      ProcessingDialog,
      CircleLoader
    },
    data () {
      return {
        centered: true,
        helpVisible: false,
        qrCode: null,
        dialog: false,
        isProcessing: false,
        transactionError: null,
        createTotpError: null,
        errorMessages: {
          pin: false,
          pinNonDigit: false,
          pinLength: false
        },
        copied: false
      }
    },
    computed: {
      isLoggedIn () {
        return store.getters['isLoggedIn']
      },
      accountSummaryFlow () {
        return window.ctsautoconf.ACCOUNT_SUMMARY_FLOW || false
      },
      totpIsVerified () {
        return store.getters['getTotpIsVerified']
      },
      pinCode: {
        get () {
          return this.qrCode || undefined
        },
        set (value) {
          if (value.length === 0) {
            this.errorMessages.pin = true
            this.errorMessages.pinNonDigit = false
          } else if (value.match(this.validationRules.validationPinCode)) {
            this.errorMessages.pin = false
            this.errorMessages.pinNonDigit = true
          } else {
            this.errorMessages.pin = undefined
            this.errorMessages.pinNonDigit = undefined
          }
          this.qrCode = value
          if (value && value.length.toString() !== this.pinCodeLengthFromUri) {
            this.errorMessages.pinLength = true
          } else {
            this.errorMessages.pinLength = false
          }
          if (value && value.match(this.validationRules.validationPinCode)) {
            this.errorMessages.pinNonDigit = true
          } else {
            this.errorMessages.pinNonDigit = false
          }
        }
      },
      validationRules () {
        return store.getters['getValidationRules']
      },
      totpFactorAsync () {
        return store.getters['getTotpFactorAsync']
      },
      totpUri () {
        return this.totpFactorAsync && this.totpFactorAsync.uri
      },
      totpSecret () {
        return this.totpFactorAsync && this.totpFactorAsync.secret && this.totpFactorAsync.secret.match(/.{1,4}/g).join(' ')
      },
      pinCodeLengthFromUri () {
        let urlParams = new URLSearchParams(this.totpUri)
        return urlParams.get('digits') || '6'
      },
      formSubmitSppiner () {
        return store.getters['getFormSubmitSppiner']
      },
      loginFields () {
        return store.getters['overlayState/getloginFields']
      },
      userAgent () {
        return lib.core.userAgent.os.name
      },
      mobileUsernameAndPassword () {
        return store.getters['getMobileUsernameAndPassword']
      }
    },
    methods: {
      createTotp () {
        store.commit('setFormSubmitSppiner', true)
        this.createTotpError = null
        store.dispatch('createTotpFactorAsync', {
          username: (this.loginFields && this.loginFields.username) || (this.mobileUsernameAndPassword && this.mobileUsernameAndPassword.username),
          password: (this.loginFields && this.loginFields.password) || (this.mobileUsernameAndPassword && this.mobileUsernameAndPassword.password)
        })
          .then((response) => {
            if (response && response.exceptionType && response.message) {
              this.createTotpError = response.message
            }
          })
          .catch((err) => {
            this.createTotpError = err.message || this.$t('Server.ErrorMsg.Generic')
          }).finally(() => {
            store.commit('setFormSubmitSppiner', false)
          })
      },
      closeAutyPopup () {
        store.commit('setTotpFactorAsync', null)
        this.$emit('declineToggleTOTPVerify')
      },
      showHelp () {
        this.helpVisible = true
      },
      hideHelp () {
        this.helpVisible = false
      },
      copyCode (event) {
        const parentEl = this.$refs.code
        const selectedCode = parentEl && parentEl.firstChild && parentEl.firstChild.textContent

        if (this.userAgent === 'android') {
          mobileBridge.bridgeSendRequest('copyToClipboard', selectedCode)
          this.copied = true
        } else {
          navigator.clipboard.writeText(selectedCode).then(() => {
            this.copied = true
          }).catch((err) => {
            this.copied = false
            console.log(err, ' copy code error')
          })
        }
      },
      isAnyUnpopulatedField () {
        if (!this.pinCode) {
          this.errorMessages.pin = true
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
      verify () {
        if (this.isEverythingValid()) {
          this.isProcessing = true
          this.transactionError = null
          this.dialog = true
          // store.commit('setFormSubmitSppiner', true)
          store.dispatch('verifyTotpFactorAsync', {
            pin: this.qrCode,
            username: (this.loginFields && this.loginFields.username) || (this.mobileUsernameAndPassword && this.mobileUsernameAndPassword.username),
            password: (this.loginFields && this.loginFields.password) || (this.mobileUsernameAndPassword && this.mobileUsernameAndPassword.password)
          })
            .then((response) => {
              if (response && response.result && response.result.exceptionType && response.result.message) {
                this.transactionError = response.result.message
              } else {
                console.log(response.result.IsVerified)
                if (response && response.result && response.result.IsVerified !== undefined && !response.result.IsVerified) {
                  this.transactionError = this.$t('Account.Authentication.2fa.Dialog.Error.Unverified.Text')
                }
                this.isProcessing = false

                if (!this.transactionError) {
                  localStorage.removeItem('is2FA')
                }
                // store.commit('setFormSubmitSppiner', false)
              }
            })
            .catch((err) => {
              this.transactionError = err.message || this.$t('Server.ErrorMsg.Generic')
            })
            .finally(() => {
              this.isProcessing = false
            })
        }
      },
      closeAuthyDialog () {
        if (!this.transactionError) {
          if (this.isLoggedIn) {
            store.dispatch('getCustomerContext').then(function () {
            }).finally(() => {
              store.commit('setIs2FA', true)
              this.closeAutyPopup()
            })
          } else {
            store.commit('setTemporaryUsername', this.loginFields.username)
            store.commit('setTemporaryPassword', this.loginFields.password)
            // store.dispatch('overlayState/activateLoginDialog')
            store.dispatch('get2FA', {
              'username': this.loginFields.username || (this.mobileUsernameAndPassword && this.mobileUsernameAndPassword.username),
              'password': this.loginFields.password || (this.mobileUsernameAndPassword && this.mobileUsernameAndPassword.password)})
            store.commit('setIs2FA', true)
            store.commit('setSAPINOnLogin', true)
            store.commit('overlayState/setLoginDialogState', true)
            this.closeAutyPopup()
          }
        }
      }
    },
    created () {
    },
    mounted () {
      this.createTotp()
    },
    watch: {
    }
  }
</script>

<style lang="stylus" scoped>
@import "~@/css/config";
@import "~@/css/mixins";
@import "~@/css/sportIcons";

.page-content.account-authy
  flex-direction column !important
  position: relative
  padding 0 10px
  .verTitles
    display: flex
    justify-content: space-between
    align-items: center
    flex: 1
    padding: 25px 0 10px
    .verTextContainer
      .verAccountTitle
        font-family: "Open Sans Bold" !important
        margin-bottom: 3px
        color: #ff9016
        text-transform: uppercase
        font-size: 13px

      .title
        font-size 20px
        line-height 100px
        margin-bottom: 5px
        font-family: "Open Sans Bold" !important
      .guidedTitle
        font-size 17px
        margin-bottom: 5px
        color: var(--accent-color)
        font-family: "Open Sans Bold" !important
        text-transform uppercase
      .stepTitle
        font-size 16px
        margin: 5px 0
        font-weight 900
        font-family: "Open Sans Bold"

    .close
      position: absolute
      right: 5px
      top: 5px
      font-size: 40px

  .help
    display: flex
    justify-content: space-between
    align-items: center
    width: 360px
    margin 0 auto
    @media mobile-big-and-below
      width: 100%
    span
      font-family: "Open Sans ExtraBold"
      font-weight: 900
      font-size 15px
  .help-text
    padding 10px
    width: 360px
    margin 0 auto
    @media mobile-big-and-below
      width: 100%
  .gray-box
    background: #e5e5e5;
    border-radius: 5px;
    padding: 10px;
  .flex-grow-center
    flex-grow: 1
    text-align: center
  .qrcode-box
    // margin-top: 30px
    display: flex
    justify-content: center
  .padding-20
    padding 20px
  .text-center
    text-align center
  .margin-b-10
    margin-bottom: 10px
  .font-bold
    font-weight 900
  .key-box
    border 1px solid #e5e5e5
    border-radius 5px
    padding 5px 10px
    text-align: center
    width: 360px
    margin 0 auto
    @media mobile-big-and-below
      width: 100%
    span
      color: var(--account-pages-headings-color)
      font-family: "Open Sans ExtraBold"
      font-weight: 900
    a
      cursor pointer
  .enter-digits-pin
    display: flex
    flex-direction: column
    margin-top 10px
    text-align: center
    input
      padding 20px 5px
      text-align: center
      height: 40px
      background: #e5e5e5
      max-width: 180px
      margin: 5px auto 0
      border-radius: 5px
      font-size: 24px
      letter-spacing: 5px
      color: var(--account-pages-headings-color)
      font-family: "Open Sans ExtraBold"
      font-weight: 900
  .verify-text
    text-align: center
    font-weight 900
    margin 10px 0 5px
  .btn-verify
    width: 360px
    margin: 0 auto
    display block
    padding-left: 0
    padding-right: 0
    >>>.v-btn__content
      display: inline-block
      width: 100%;
    @media mobile-big-and-below
      width: 100%
</style>


