<template>
  <div class="verify-content">
    <div v-if="!translationsLoaded">
      <circle-loader></circle-loader>
    </div>
    <div v-else>
      <!-- form is the same for email and phone verification -->
      <div class="account-page ctsform" v-if="(isVerifyEmail && !isEmailVerified) || (isVerifyPhone && !isPhoneVerified)">
        <span v-if="isVerifyEmail">{{ $t('Account.VerificationByPin.Email.InfoText') + ' ' }}</span>
        <span v-if="isVerifyPhone">{{ $t('Account.VerificationByPin.Phone.InfoText') + ' ' }}</span>
        <span v-if="isLoggedIn"> {{ $t('Account.VerificationByPin.InfoText') }} <a @click.stop="resendPin()">{{ $t('Account.VerificationByPin.Resend') }}</a></span><br>
        <form id="confirmEmalByPinForm">
          <!-- username and password will be shown only if user is not logged in, if user logged in should be read from session -->
          <div v-if="!isLoggedIn">
            <!-- USERNAME -->
            <div class="control-block" :class="{ 'filled': userName }">
              <input type="text" v-model.trim="userName" id="username" autocomplete="off" maxlength="512" @focusout="!verifyDetails.userName ? errorMessages.userName = true : errorMessages.userName = false" required/>
              <label class="control-label">{{ usernameLabel }}</label>
            </div>
            <!-- USERNAME VALIDATION -->
            <div>
              <div class="vmsg invalid" v-if="errorMessages.userName" id="err_msg_username" v-html="$t('Account.Join.ErrorMsg.UserName')"></div>
            </div>

            <!-- PASSWORD -->
            <div class="control-block" :class="{ 'filled': pass }">
              <input type="password" v-model.trim="pass" id="password" autocomplete="off" maxlength="64" @focusout="!verifyDetails.pass ? errorMessages.pass = true : errorMessages.pass = false" required/>
              <label class="control-label">{{ $t('Account.Join.Pass') }}</label>
            </div>
            <!-- PASSWORD VALIDATION -->
            <div>
              <div class="vmsg invalid" v-if="errorMessages.pass" id="err_msg_password" v-html="$t('Account.Join.ErrorMsg.Pass')"></div>
            </div>
          </div>

          <!-- PIN CODE -->
          <div class="control-block" :class="{ 'filled': pinCode }">
            <input class="pin-input" type="text" v-model.trim="pinCode" :id="isVerifyEmail ? 'pinEmail' : 'pinPhone'" autocomplete="off" maxlength="6" @focusout="!verifyDetails.pinCode ? errorMessages.pinCode = true : errorMessages.pinCode = false" required/>
            <label class="control-label pin-label">{{ $t('Account.VerificationByPin.PIN') }}</label>
          </div>
          <!-- PIN CODE VALIDATION -->
          <div>
            <div class="vmsg invalid" v-if="errorMessages.pinCode" :id="isVerifyEmail ? 'err_msg_pinEmail' : 'err_msg_pinPhone'" v-html="$t('Account.VerificationByPin.ErrorMsg.PinCode')"></div>
          </div>

          <!-- VERIFY EMAIL/PHONE -->
          <div class="form-actions">
            <v-btn color="success" type="submit" x-large @click.prevent="verifyByPIN()" :id="isVerifyEmail ? 'btn_verifyByPinEmail' : 'btn_verifyByPinPhone'" ><span>{{ $t('Account.VerificationByPin.Verify') }}</span></v-btn>
          </div>
        </form>

        <!-- processing dialog -->
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
  import ProcessingDialog from '@/components/common/ProcessingDialog'
  import Gtm from '@/components/mixins/Gtm'
  import CircleLoader from '@/components/common/CircleLoader'

  export default {
    name: 'EmailVerificationByPin',
    mixins: [
      Gtm
    ],
    props: ['verify'],
    components: {
      ProcessingDialog,
      CircleLoader
    },
    data () {
      return {
        verifyDetails: {
          userName: undefined,
          pass: undefined,
          pinCode: undefined
        },
        errorMessages: {
          userName: null,
          pass: null,
          pinCode: null
        },
        dialog: false,
        isProcessing: false,
        transactionError: null,
        processingTitle: null,
        processingText: null,
        successTitle: null,
        successText: null,
        errorTitle: null,
        errorText: null
      }
    },
    computed: {
      isLoggedIn () {
        return store.getters['isLoggedIn']
      },
      isEmailVerified () { // from Customer Context
        return store.getters['getIsEmailVerified']
      },
      isPhoneVerified () { // from Customer Context
        return store.getters['getIsPhoneVerified']
      },
      isVerifyEmail () {
        return this.verify === 'email'
      },
      isVerifyPhone () {
        return this.verify === 'phone'
      },
      pinFromUrl () {
        return this.$route.params.pin
      },
      userName: {
        get () {
          return this.verifyDetails.userName || undefined
        },
        set (value) {
          if (value.length === 0) {
            this.errorMessages.userName = true
          } else {
            this.errorMessages.userName = undefined
          }
          this.verifyDetails.userName = value
        }
      },
      pass: {
        get () {
          return this.verifyDetails.pass || undefined
        },
        set (value) {
          if (value.length === 0) {
            this.errorMessages.pass = true
          } else {
            this.errorMessages.pass = undefined
          }
          this.verifyDetails.pass = value
        }
      },
      pinCode: {
        get () {
          return this.verifyDetails.pinCode || undefined
        },
        set (value) {
          if (value.length === 0) {
            this.errorMessages.pinCode = true
          } else {
            this.errorMessages.pinCode = undefined
          }
          this.verifyDetails.pinCode = value
        }
      },
      translationsLoaded () {
        return store.getters['getTranslationsLoaded']
      },
      MobilelocalServer () {
        return window.ctsautoconf.MOBILE_LS || false
      },
      loginUsernameType () {
        return window.ctsautoconf.loginUsernameType || 'MIXED'
      },
      usernameLabel () {
        let unLabel
        switch (this.loginUsernameType.toLowerCase()) {
          case 'un':
            unLabel = this.$t('Login.Username')
            break
          case 'email':
            unLabel = this.$t('Login.Username.Email')
            break
          case 'mixed':
            unLabel = this.$t('Login.Username.Mixed')
            break
          default:
            unLabel = this.$t('Login.Username')
            break
        }
        return unLabel
      }
    },
    methods: {
      isAnyUnpopulatedField () {
        if (!this.isLoggedIn && !this.verifyDetails.userName) {
          this.errorMessages.userName = true
        }
        if (!this.isLoggedIn && !this.verifyDetails.pass) {
          this.errorMessages.pass = true
        }
        if (!this.verifyDetails.pinCode) {
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
      scroll2Error () {
        let scroll2Element = document.querySelectorAll('.account-page.ctsform .vmsg.invalid')[0]
        let scroll2ElementPosition = scroll2Element.offsetTop

        let headerHeight = document.getElementById('header-part').clientHeight
        let labelHeight = 60

        let toCoordinate = scroll2ElementPosition - headerHeight - labelHeight
        // 'normal' scroll
        // window.scroll(0, toCoordinate)

        // smoothy scroll
        this.smoothScroll(window, toCoordinate, 500)
      },
      smoothScroll (element, to, duration) {
        var start = window.scrollY
        var change = to - start
        var currentTime = 0
        var increment = 20
        var animateScroll = function () {
          currentTime += increment
          var value = this.calculateTime(currentTime, start, change, duration)
          window.scroll(0, value)
          if (currentTime < duration) {
            setTimeout(animateScroll, increment)
          }
        }.bind(this)
        animateScroll()
      },
      calculateTime (currentTime, startTime, chageInTime, duration) {
        currentTime /= duration / 2
        if (currentTime < 1) return chageInTime / 2 * currentTime * currentTime + startTime
        currentTime--
        return -chageInTime / 2 * (currentTime * (currentTime - 2) - 1) + startTime
      },
      resetForm () {
        this.errorMessages.userName = null
        this.errorMessages.pass = null
        this.errorMessages.pinCode = null
      },
      setResendDialogMessages () {
        this.processingTitle = this.$t('Account.VerificationByPin.Resend.Processing.Title') // 'Resend PIN'
        this.processingText = this.$t('Account.VerificationByPin.Resend.Processing.Text') // 'Please wait'
        this.successTitle = this.isVerifyEmail ? this.$t('Account.VerificationByPin.Email.Resend.Success.Title') : this.$t('Account.VerificationByPin.Phone.Resend.Success.Title') // 'Resend PIN completed'
        this.successText = this.isVerifyEmail ? this.$t('Account.VerificationByPin.Email.Resend.Success.Text') : this.$t('Account.VerificationByPin.Phone.Resend.Success.Text') // sent to the email or sent to the phone
        this.errorTitle = this.$t('Account.VerificationByPin.Resend.Error.Title') // 'Resend failed'
        this.errorText = this.$t('Account.VerificationByPin.Resend.Dialog.Error.Text') // There was an error processing PIN resending.
      },
      resendPin () {
        this.isProcessing = true
        this.transactionError = null
        this.dialog = true
        this.setResendDialogMessages()
        this.resetForm()
        var resendPinMethod = this.isVerifyEmail ? 'resendPin2Email' : 'resendPin2Phone'
        store.dispatch(resendPinMethod, {
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
          })
      },
      setVerifyDialogMessages () {
        this.processingTitle = this.isVerifyEmail ? this.$t('Account.VerificationByPin.Email.Verify.Processing.Title') : this.$t('Account.VerificationByPin.Phone.Verify.Processing.Title') // Email (Phone) verification
        this.processingText = this.isVerifyEmail ? this.$t('Account.VerificationByPin.Email.Verify.Processing.Text') : this.$t('Account.VerificationByPin.Phone.Verify.Processing.Text') // 'Please wait...'
        this.successTitle = this.isVerifyEmail ? this.$t('Account.VerificationByPin.Email.Verify.Success.Title') : this.$t('Account.VerificationByPin.Phone.Verify.Success.Title') // 'Verification completed'
        this.successText = this.isVerifyEmail ? this.$t('Account.VerificationByPin.Email.Verify.Success.Text') : this.$t('Account.VerificationByPin.Phone.Verify.Success.Text') // Your email(phone) has been verified successfully!
        this.errorTitle = this.isVerifyEmail ? this.$t('Account.VerificationByPin.Email.Verify.Error.Title') : this.$t('Account.VerificationByPin.Phone.Verify.Error.Title') // 'Email(phone) verification failed'
        this.errorText = this.isVerifyEmail ? this.$t('Account.VerificationByPin.Email.Verify.Dialog.Error.Text') : this.$t('Account.VerificationByPin.Phone.Verify.Dialog.Error.Text') // 'There was an error processing email(phone) verification.'
      },
      verifyByPIN () {
        if (this.isEverythingValid()) {
          this.isProcessing = true
          this.transactionError = null
          this.dialog = true
          this.setVerifyDialogMessages()
          var verifyMethod = this.isVerifyEmail ? 'verifyEmailByPIN' : 'verifyPhoneByPIN'
          store.dispatch(verifyMethod, {
            'userName': this.userName,
            'password': this.pass,
            'pin': this.pinCode.toString(),
            'isLoggedIn': this.isLoggedIn
          })
            .then((response) => {
              if (response && response.exceptionType && response.message) {
                this.transactionError = response.message
              } else {
                this.isProcessing = false
              }
            })
            .catch((err) => {
              this.transactionError = err.message || this.$t('Account.VerificationByPin.Email.Verify.Dialog.Error.Generic')
            })
            .finally(() => {
              this.isProcessing = false
            })
        } else {
          setTimeout(() => {
            this.scroll2Error()
          }, 500)
        }
      },
      closeVerificationDialog () {
        if (!this.transactionError) {
          if (this.isLoggedIn) {
            // read Customer Context
            store.dispatch('getCustomerContext')
          } else {
            this.$router.push({name: 'home'})
            store.dispatch('overlayState/activateLoginDialog')
            this.sendGTMClickEvent('login', 'open login dialog', 'login-btn', 'top header')
          }
        }
      },
      automaticVerificationIfLoggedIn () {
        let self = this
        if (self.isLoggedIn) {
          store.dispatch('getCustomerContext').then(function () {
            if (((self.isVerifyEmail && !self.isEmailVerified) || (self.isVerifyPhone && !self.isPhoneVerified)) && self.pinFromUrl) {
              self.verifyByPIN()
            }
          })
        }
      }
    },
    created () {
      if (this.pinFromUrl) {
        this.pinCode = this.pinFromUrl
      }
      if (this.MobilelocalServer) {
        this.automaticVerificationIfLoggedIn()
      }
    },
    watch: {
      isLoggedIn (newVal) {
        if (newVal) {
          if (!this.MobilelocalServer) {
            this.automaticVerificationIfLoggedIn()
          }
        }
      }
    }
  }
</script>

<style scoped lang="stylus">
  @import "~@/css/config"
  h1
    text-align center
  .vmsg.invalid
    cursor default
  .form-actions
    height 60px
  .account-info
    color #FFF2E5
  .control-block
    >>> select
      cursor pointer
  .response-error
    font-size 18px
    font-weight bold
  .verify-content
    text-align center
    font-size 1.2em
</style>
