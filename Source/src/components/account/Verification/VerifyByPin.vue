<!-- same component for email and phone verification -->
<template>
  <div class="verify-content">
    <div v-if="!translationsLoaded">
      <circle-loader></circle-loader>
    </div>
    <div v-else>
      <div class="account-page ctsform">
        <span v-if="false"> {{ $t('Account.VerificationByPin.InfoText') }} <a @click.stop="resendPin()">{{ $t('Account.VerificationByPin.Resend') }}</a></span>
        <form id="confirmEmalByPinForm">
          <!-- VERIFY EMAIL/PHONE -->
          <div v-if="(page === 'verify_email' || page === 'verify_mob') && state === 'initial'" class="form-actions">
            <div v-if="verifyDetail === 'Email'" class="control-block">
              <p v-if="personalDetails" class="verifyText" v-html="$t('Account.SequentialVerification.VerifyByPin.Verification.EmailText',{n:personalDetails.PrimaryEmail})"></p>
              <v-btn @click.prevent="resendPin()" color="success" x-large><span>{{ $t('Account.SequentialVerification.VerifyByPin.Verification.SendEmail') }}</span></v-btn>
            </div>
            <div v-else class="control-block">
              <p v-if="personalDetails"  class="verifyText" v-html="$t('Account.SequentialVerification.VerifyByPin.Verification.SMSText',{n:personalDetails.MobilePhone})"></p>
              <v-btn @click.prevent="resendPin()" color="success" x-large><span>{{ $t('Account.SequentialVerification.VerifyByPin.Verification.SendSMS') }}</span></v-btn>
            </div>
          </div>
          <div v-else-if="(page === 'verify_email' || page === 'verify_mob') && state === 'sent'" class="form-actions">
            <div v-if="verifyDetail === 'Email'">
              <p v-if="personalDetails" v-html="$t('Account.SequentialVerification.VerifyByPin.Verification.SentEmail',{n:personalDetails.PrimaryEmail})"></p>
              <div class="control-block pin-block" :class="{ 'filled': pinCode }">

              <!-- PIN INPUT -->
              <input  type="text" class="pin-input" :maxlength="validationRules && validationRules.validationPinCodeLength"
              autocomplete="off" v-model.trim="pinCode" id="pin" @focusout="!verifyDetails.pinCode ? errorMessages.pinCode = true : errorMessages.pinCode = false"
              />
              <label class="control-label pin-label">{{$t('Account.SequentialVerification.VerifyByPin.Verification.EnterPin')}}</label>
              </div>
              <!-- PIN VALIDATION -->
                <div>
                  <div class="vmsg invalid" v-if="errorMessages.pinCode" id="err_msg_phone_missing" v-html="$t('Account.VerificationByPin.ErrorMsg.PinCode')"></div>
                  <div class="vmsg invalid" v-if="errorMessages.pinNonDigit" id="err_msg_phone_not_digit" v-html="$t('Account.VerificationByPin.ErrorMsg.PinCodeNonDigit')"></div>
                  <div class="vmsg invalid" v-if="errorMessages.pinLength" id="err_msg_phone_length" v-html="$t('Account.VerificationByPin.ErrorMsg.PinCodeLength')"></div>
              </div>
              <v-btn color="success" type="submit" x-large @click.prevent="verifyByPIN()" :id="isVerEmail ? 'btn_verifyByPinEmail' : 'btn_verifyByPinPhone'" ><span>{{ $t('Account.VerificationByPin.Verify') }}</span></v-btn>
              <v-card-text class="changeDetailText">{{ $t('Account.SequentialVerification.ChangeDetail.ResendEmailText')  }}</v-card-text>
              <v-btn @click.prevent="resendPin()" class="btn changeBtn" x-large><span>{{ $t('Account.SequentialVerification.ChangeDetail.ResendEmail') }}</span></v-btn>
            </div>
            <div v-else>
              <p v-if="personalDetails" v-html="$t('Account.SequentialVerification.VerifyByPin.Verification.SentSMS',{n:personalDetails.MobilePhone})"></p>
              <p v-else v-html="$t('Account.SequentialVerification.VerifyByPin.Verification.SentSMSForUserTryingLogin')"></p>
              <div class="control-block pin-block" :class="{ 'filled': pinCode }">
              <!-- PIN INPUT -->

              <input  type="text" class="pin-input" :maxlength="validationRules && validationRules.validationPinCodeLength"
              autocomplete="off" v-model.trim="pinCode" id="pin" @focusout="!verifyDetails.pinCode ? errorMessages.pinCode = true : errorMessages.pinCode = false"
              />
              <label class="control-label pin-label">{{$t('Account.SequentialVerification.VerifyByPin.Verification.EnterPin')}}</label>
              </div>

               <!-- PIN VALIDATION -->
                <div>
                  <div class="vmsg invalid" v-if="errorMessages.pinCode" id="err_msg_phone_missing" v-html="$t('Account.VerificationByPin.ErrorMsg.PinCode')"></div>
                  <div class="vmsg invalid" v-if="errorMessages.pinNonDigit" id="err_msg_phone_not_digit" v-html="$t('Account.VerificationByPin.ErrorMsg.PinCodeNonDigit')"></div>
                  <div class="vmsg invalid" v-if="errorMessages.pinLength" id="err_msg_phone_length" v-html="$t('Account.VerificationByPin.ErrorMsg.PinCodeLength')"></div>
              </div>
              <v-btn color="success" type="submit" x-large @click.prevent.stop="verifyByPIN()" :id="isVerEmail ? 'btn_verifyByPinEmail' : 'btn_verifyByPinPhone'" ><span>{{ $t('Account.VerificationByPin.Verify') }}</span></v-btn>
              <v-card-text class="changeDetailText">{{ $t('Account.SequentialVerification.ChangeDetail.ResendSMSText')  }} </v-card-text>
              <v-btn @click.prevent="resendPin()" class="btn changeBtn" x-large><span>{{ $t('Account.SequentialVerification.ChangeDetail.ResendSMS') }}</span></v-btn>
            </div>
          </div>
          <div v-else>
            <p v-html="$t('Account.Verification.UnexpectedPageAndState', {page: page, state: state })"></p>
          </div>
          <!-- ENTERED WRONG EMAIL/PHONE -->
          <div class="form-actions" v-if="isLoggedIn">
            <v-card-text class="changeDetailText">{{ $t('Account.SequentialVerification.VerifyByPin.Verification.EnteredWrongData', {wrongDetail: wrongDetail })  }}</v-card-text>
            <v-btn @click.prevent="changeDetail()" class="btn changeBtn" x-large><span>{{ $t('Account.SequentialVerification.VerifyByPin.Verification.EditHere') }}</span></v-btn>
          </div>
        </form>
        <ProcessingDialog
          v-model="dialog"
          :isDialogPersistent="true"
          :isProcessing="isProcessing"
          :isSuccess="!transactionError"
          :processingTitle="processingTitle"
          :processingText="processingText"
          :successTitle="successTitle"
          :successText="successText"
          :errorTitle="errorTitle"
          :closeBtnText="$t('ProcessingDialog.CloseButtonText')"
          @close="closeVerificationDialog">
          <div slot="text-error">
            <p class="generic-icon-note"><v-icon color="error" class="mr-1">error</v-icon><span>{{ errorText }}</span></p>
            <p class="response-error">{{ transactionError }}</p>
            <p v-html="$t('Account.Join.Dialog.Error.Text.ContactSupport')"></p>
          </div>
        </ProcessingDialog>
      </div>
    </div>
  </div>
</template>

<script>
  import store from '@/store'
  import lib from '@/library'
  import ProcessingDialog from '@/components/common/ProcessingDialog'
  import CircleLoader from '@/components/common/CircleLoader'

  export default {
    name: 'VerifyByPin',
    props: ['page', 'state', 'fromVerDetail'],
    components: {
      CircleLoader,
      ProcessingDialog
    },
    data () {
      return {
        isPinSent: false,
        isVerEmail: undefined,
        personalDetails: null,
        dialog: false,
        isProcessing: false,
        transactionError: null,
        processingTitle: null,
        processingText: null,
        successTitle: null,
        successText: null,
        errorTitle: null,
        errorText: null,
        verifyDetails: {
          pinCode: undefined
        },
        errorMessages: {
          pinNonDigit: false,
          pinLength: false,
          pinCode: false
        },
        closeFromResendPIN: false
      }
    },
    computed: {
      translationsLoaded () {
        return store.getters['getTranslationsLoaded']
      },
      isLoggedIn () {
        return store.getters['isLoggedIn']
      },
      isEmailVerified () { // from Customer Context
        return store.getters['getIsEmailVerified']
      },
      pinCode: {
        get () {
          return this.verifyDetails.pinCode || undefined
        },
        set (value) {
          if (value.length === 0) {
            this.errorMessages.pinCode = true
            this.errorMessages.pinNonDigit = false
          } else if (value.match(this.validationRules.validationPinCode)) {
            this.errorMessages.pinCode = false
            this.errorMessages.pinNonDigit = true
          } else {
            this.errorMessages.pinCode = undefined
            this.errorMessages.pinNonDigit = undefined
          }
          this.verifyDetails.pinCode = value
          if (this.pinCode && this.pinCode.length !== this.validationRules.validationPinCodeLength) {
            this.errorMessages.pinLength = true
          } else {
            this.errorMessages.pinLength = false
          }
          if (this.verifyDetails.pinCode && this.verifyDetails.pinCode.match(this.validationRules.validationPinCode)) {
            this.errorMessages.pinNonDigit = true
          } else {
            this.errorMessages.pinNonDigit = false
          }
        }
      },
      verifyDetail () {
        let detail
        switch (this.page) {
          case 'verify_email':
            detail = this.$t('Account.SequentialVerification.VerifyByPin.Verification.Email')
            this.isVerEmail = true
            break
          case 'verify_mob':
            detail = this.$t('Account.SequentialVerification.VerifyByPin.Verification.Phone')
            this.isVerEmail = false
            break
        }
        return detail
      },
      wrongDetail () {
        let wrongDetail
        switch (this.page) {
          case 'verify_email':
            wrongDetail = this.$t('Account.SequentialVerification.VerifyByPin.Verification.WrongEmail')
            break
          case 'verify_mob':
            wrongDetail = this.$t('Account.SequentialVerification.VerifyByPin.Verification.WrongPhone')
            break
        }
        return wrongDetail
      },
      validationRules () {
        return store.getters['getValidationRules']
      },
      loginFields () {
        return store.getters['overlayState/getloginFields']
      },
      mobileUsernameAndPassword () {
        return store.getters['getMobileUsernameAndPassword']
      }
    },
    methods: {
      changeDetail () {
        this.$emit('changeDetail')
      },
      fetchPersonalDetails () {
        lib.rpcService.callBroker('psregistrationservice', 'getpersonaldetails', {
          'IDDCApplication': 'TEXAS',
          'preferenceNames': ['UseSA4UserLogin', 'UseSA4AccountRecovery']
        }).then(response => {
          if (response.result) {
            this.personalDetails = response.result
          }
        }).catch((error) => {
          console.log(error)
        })
      },
      isAnyUnpopulatedField () {
        if (!this.pinCode) {
          this.errorMessages.pinCode = true
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
      closeVerificationDialog () {
        if (!this.transactionError) {
          if (this.isLoggedIn) {
            this.$emit('refreshafteraction', this.closeFromResendPIN)
            this.pinCode = ''
            this.resetForm()
          } else {

            // this.$route.name !== 'sports' && this.$router.push({name: 'home'})
            //
            // store.commit('setIs2FA', true)
            // this.sendGTMClickEvent && this.sendGTMClickEvent('login', 'open login dialog', 'login-btn', 'top header')
          }
          if (!this.closeFromResendPIN) {
            store.commit('setIs2FA', true)
            if (!this.isLoggedIn) {
              store.dispatch('get2FA', {
                'username': this.loginFields.username || (this.mobileUsernameAndPassword && this.mobileUsernameAndPassword.username),
                'password': this.loginFields.password || (this.mobileUsernameAndPassword && this.mobileUsernameAndPassword.password)})
            }
          }
        }
      },
      resetForm () {
        this.errorMessages.pinCode = null
        this.errorMessages.pinNonDigit = null
        this.errorMessages.pinLength = null
      },
      verifyByPIN () {
        if (this.isEverythingValid()) {
          this.isProcessing = true
          this.transactionError = null
          this.dialog = true
          this.setVerifyDialogMessages()
          let verifyMethod = this.isVerEmail ? 'verifyEmailByPIN' : 'verifyPhoneByPIN'
          store.dispatch(verifyMethod, {
            'pin': this.pinCode && this.pinCode.toString(),
            'isLoggedIn': this.isLoggedIn,
            'userName': this.loginFields && this.loginFields.username,
            'password': this.loginFields && this.loginFields.password
          })
            .then((response) => {
              if (response && response.exceptionType && response.message) {
                this.transactionError = response.message
              } else {
                this.isProcessing = false
                localStorage.removeItem('is2FA')
              }
            })
            .catch((err) => {
              this.transactionError = err.message || this.$t('Account.VerificationByPin.Email.Verify.Dialog.Error.Generic')
            })
            .finally(() => {
              this.isProcessing = false
              this.closeFromResendPIN = false
            })
        }
      },
      setVerifyDialogMessages () {
        this.processingTitle = this.isVerEmail ? this.$t('Account.VerificationByPin.Email.Verify.Processing.Title') : this.$t('Account.VerificationByPin.Phone.Verify.Processing.Title') // Email (Phone) verification
        this.processingText = this.isVerEmail ? this.$t('Account.VerificationByPin.Email.Verify.Processing.Text') : this.$t('Account.VerificationByPin.Phone.Verify.Processing.Text') // 'Please wait...'
        this.successTitle = this.$t('Account.Dialog.Title.Success') // 'Verification completed'
        this.successText = this.isVerEmail ? this.$t('Account.VerificationByPin.Email.Verify.Success.Text') : this.$t('Account.VerificationByPin.Phone.Verify.Success.Text') // Your email(phone) has been verified successfully!
        this.errorTitle = this.isVerEmail ? this.$t('Account.VerificationByPin.Email.Verify.Error.Title') : this.$t('Account.VerificationByPin.Phone.Verify.Error.Title') // 'Email(phone) verification failed'
        this.errorText = this.isVerEmail ? this.$t('Account.VerificationByPin.Email.Verify.Dialog.Error.Text') : this.$t('Account.VerificationByPin.Phone.Verify.Dialog.Error.Text') // 'There was an error processing email(phone) verification.'
      },
      setResendDialogMessages () {
        this.processingTitle = this.$t('Account.VerificationByPin.Resend.Processing.Title') // 'Resend PIN'
        this.processingText = this.$t('Account.VerificationByPin.Resend.Processing.Text') // 'Please wait'
        this.successTitle = this.$t('Account.Dialog.Title.Success') // 'Resend PIN completed'
        this.successText = this.isVerEmail ? this.$t('Account.VerificationByPin.Email.Resend.Success.Text') : this.$t('Account.VerificationByPin.Phone.Resend.Success.Text') // sent to the email or sent to the phone
        this.errorTitle = this.$t('Account.VerificationByPin.Resend.Error.Title') // 'Resend failed'
        this.errorText = this.$t('Account.VerificationByPin.Resend.Dialog.Error.Text') // There was an error processing PIN resending.
      },
      resendPin () {
        this.isProcessing = true
        this.transactionError = null
        this.dialog = true
        this.isPinSent = true
        this.setResendDialogMessages()
        this.resetForm()
        let resendPinMethod = this.isVerEmail ? 'resendPin2Email' : 'resendPin2Phone'
        store.dispatch(resendPinMethod, {
          username: (this.loginFields && this.loginFields.username) || (this.mobileUsernameAndPassword && this.mobileUsernameAndPassword.username),
          password: (this.loginFields && this.loginFields.password) || (this.mobileUsernameAndPassword && this.mobileUsernameAndPassword.password)
        })
          .then((response) => {
            if (response && response.exceptionType && response.message) {
              this.transactionError = response.message
            } else {
              this.isProcessing = false
            }
          })
          .catch((err) => {
            this.transactionError = err.message || this.$t('Account.VerificationByPin.Resend.Dialog.Error.Generic')
          })
          .finally(() => {
            this.isProcessing = false
            this.closeFromResendPIN = true
          })
      }
    },
    mounted () {
      if (this.isLoggedIn) {
        this.fetchPersonalDetails()
      }
    },
    created () {
    },
    watch: {
    }
  }
</script>

<style scoped lang="stylus">
@import "~@/css/config"
@import "~@/css/mixins"

  .control-block.my-3 p
    @media tablet-and-below
        margin-bottom: 25px
  .control-block.pin-block
    width: 350px !important
    margin 0 auto 15px !important
    @media mobile-big-and-below
      width: 100% !important
  >>>.control-block
    .pin-input, .pin-label
      width: 100% !important
      text-align: center

    .verifyText
      text-align: left
      margin-bottom: 20px
      // span
      //   color: #ff9016
  .control-block, .form-actions
    .v-btn.success
      margin: 0
      width: 350px
      margin-bottom: 15px
      >>>.v-btn__content
         display: inline-block
         width: 100%;
      @media mobile-big-and-below
        width: 100%
  .btn.changeBtn
    background: linear-gradient(to bottom, #1d9add, #003764) !important
    color: white
    width: 350px
    margin: 0 0 10px !important
    >>>.v-btn__content
         display: inline-block
         width: 100%;
      @media mobile-big-and-below
        width: 100%
  .ver_pointer
    cursor: pointer
  .form-actions
    p
      text-align: left
    .v-card__text
      padding: 0
      padding-bottom: 3px
      text-align: right
      &.changeDetailText
        text-align: center
      u
        color: #ff9016

</style>
