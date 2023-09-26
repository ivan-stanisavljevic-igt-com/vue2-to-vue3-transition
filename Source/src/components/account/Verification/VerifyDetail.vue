<template>
  <div class="verify-content">
    <div class="blue-heading" v-html="$t('Account.SequentialVerification.VerifyByPin.Verification.Detail.' + detail)"> </div>
    <div class="padding-separate">
      <div v-if="!translationsLoaded">
        <circle-loader></circle-loader>
      </div>
      <div v-else>
        <div class="account-page ctsform">
          <form>
            <loader class="ver-loader" v-if="showLoader"></loader>
            <!-- verify email/mobile number info -->
            <div v-if="!(verifyMob || verifyEmail) && !changeEmailOrPhoneVisible && !showLoader" class="form-actions">
              <div class="control-block">
                <div class="flex-between margin-t-10">
                  <!-- detail: Mobile Number/Email -->
                  <!-- <div>
                    <span v-html="$t('Account.SequentialVerification.VerifyByPin.Verification.Detail.' + detail)"></span>
                  </div> -->
                  <div>
                    <p v-if="personalDetails && detail === 'email'" class="verifyText">{{ personalDetails.PrimaryEmail }}</p>
                    <p v-else-if="personalDetails && detail === 'phone'" class="verifyText">{{ personalDetails.MobilePhone }}</p>
                  </div>
                  <!-- verification status -->
                  <div>
                    <span v-if="detail === 'email' && isEmailVerified" class="color-blue font-600 flex-center">
                      <p>{{ $t('Account.SequentialVerification.VerifyByPin.Verification.Detail.Status.Verified') }}</p>
                      <span class="icon-verified"></span>
                    </span>
                    <span v-else-if="detail === 'email' && !isEmailVerified" class="color-red font-600 flex-center">
                      <p>{{ $t('Account.SequentialVerification.VerifyByPin.Verification.Detail.Status.NonVerified') }}</p>
                      <span class="icon-not-verified"></span>
                    </span>
                    <span v-else-if="detail === 'phone' && isPhoneVerified" class="color-blue font-600 flex-center">
                      <p>{{ $t('Account.SequentialVerification.VerifyByPin.Verification.Detail.Status.Verified') }}</p>
                      <span class="icon-verified"></span>
                    </span>
                    <span v-else-if="detail === 'phone' && !isPhoneVerified" class="color-red font-600 flex-center">
                      <p>{{ $t('Account.SequentialVerification.VerifyByPin.Verification.Detail.Status.NonVerified') }}</p>
                      <span class="icon-not-verified"></span>
                    </span>
                  </div>
                </div>
              </div>
              <!-- detail's value -->
              <div class="flex-between">
                <!-- change detail value - button change detail -->
                <div class="control-block">
                  <v-card-text >{{ $t('Account.SequentialVerification.VerifyByPin.Verification.EnteredWrongData', {wrongDetail: detail })  }} <u><span class="ver_pointer color-red font-600" @click.prevent="changeDetails()">{{ $t('Account.SequentialVerification.VerifyByPin.Verification.EditHere') }} <v-icon class="color-red">chevron_right</v-icon></span></u></v-card-text>
                </div>
                <!-- verify detail - button verify -->
                <div v-if="(detail === 'email' && !isEmailVerified) || (detail === 'phone' && !isPhoneVerified)">
                  <v-btn color="success" type="submit" x-large @click.prevent="resendPin()"><span>{{ $t('Account.SequentialVerification.VerifyByPin.Verification.Verify') }}</span></v-btn>
                </div>
              </div>
              <div class="verification-info">
                <div v-if="detail === 'phone'">
                  <span v-if="isPhoneVerified" v-html="$t('Account.SequentialVerification.VerifyByPin.Verification.Phone.Verified')"></span>
                  <span v-else v-html="$t('Account.SequentialVerification.VerifyByPin.Verification.Phone.NotVerified')"></span>
                </div>
                <div v-else-if="detail === 'email'">
                  <span v-if="isEmailVerified" v-html="$t('Account.SequentialVerification.VerifyByPin.Verification.Email.Verified')"></span>
                  <span v-else v-html="$t('Account.SequentialVerification.VerifyByPin.Verification.Email.NotVerified')"></span>
                </div>
              </div>
            </div>

            <!-- component verify by pin or change detail -->
            <div v-else-if="!changeEmailOrPhoneVisible && !showLoader">
              <!-- <span v-html="$t('Account.SequentialVerification.VerifyByPin.Verification.Detail.' + detail)"></span> -->
              <div v-if="verifyMob && !isPhoneVerified">
                <verify-by-pin :page="'verify_mob'" :state="'sent'" @changeDetail="changeDetails" @refreshafteraction="updateCom"></verify-by-pin>
              </div>
              <div v-else="verifyEmail && !isEmailVerified">
                <verify-by-pin :page="'verify_email'" :state="'sent'" @changeDetail="changeDetails" @refreshafteraction="updateCom"></verify-by-pin>
              </div>
            </div>
            <div v-else-if="changeEmailOrPhoneVisible && !showLoader">
              <div v-if="detail === 'phone'">
                <ChangeDetail @goBack="changeDetails" @updateCom="updateCom" :page="'verify_mob'" @changeDetail="changeDetails" />
              </div>
              <div v-else-if="detail === 'email'">
                <ChangeDetail @goBack="changeDetails" @updateCom="updateCom" :page="'verify_email'" @changeDetail="changeDetails" />
              </div>
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
  </div>
</template>

<script>
  import store from '@/store'
  import lib from '@/library'
  import ProcessingDialog from '@/components/common/ProcessingDialog'
  import CircleLoader from '@/components/common/CircleLoader'
  import VerifyByPin from '@/components/account/Verification/VerifyByPin'
  import ChangeDetail from '@/components/account/Verification/ChangeDetail'
  import Loader from '@/components/common/Loader.vue'

  export default {
    name: 'VerifyDetail',
    props: ['detail'],
    components: {
      CircleLoader,
      ProcessingDialog,
      VerifyByPin,
      ChangeDetail,
      Loader
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
        verifyMob: false,
        verifyEmail: false,
        changeEmailOrPhoneVisible: false,
        showLoader: false
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
      isPhoneVerified () { // from Customer Context
        return store.getters['getIsPhoneVerified']
      },
      wrongDetail () {
        let wrongDetail
        switch (this.detail) {
          case 'email':
            wrongDetail = this.$t('Account.SequentialVerification.VerifyByPin.Verification.WrongEmail')
            break
          case 'phone':
            wrongDetail = this.$t('Account.SequentialVerification.VerifyByPin.Verification.WrongPhone')
            break
        }
        return wrongDetail
      },
      isCustomerVerified () {
        return store.getters['getIsCustomerVerified']
      }
    },
    methods: {
      fetchPersonalDetails () {
        this.showLoader = true
        lib.rpcService.callBroker('psregistrationservice', 'getpersonaldetails', {
          'IDDCApplication': 'TEXAS',
          'preferenceNames': ['UseSA4UserLogin', 'UseSA4AccountRecovery']
        }).then(response => {
          if (response.result) {
            this.personalDetails = response.result
          }
          this.showLoader = false
        }).catch((error) => {
          console.log(error)
          this.showLoader = false
        })
      },
      closeVerificationDialog () {
        if (!this.transactionError) {
          if (this.isLoggedIn) {
            this.$emit('refreshafteraction')
          } else {
            this.$router.push({name: 'home'})
            store.dispatch('overlayState/activateLoginDialog')
            this.sendGTMClickEvent('login', 'open login dialog', 'login-btn', 'top header')
          }
        }
      },
      setResendDialogMessages () {
        this.processingTitle = this.$t('Account.VerificationByPin.Resend.Processing.Title') // 'Resend PIN'
        this.processingText = this.$t('Account.VerificationByPin.Resend.Processing.Text') // 'Please wait'
        this.successTitle = this.$t('Account.VerificationByPin.Resend.Success.Title') // 'Resend PIN completed'
        this.successText = this.isVerEmail ? this.$t('Account.VerificationByPin.Email.Resend.Success.Text') : this.$t('Account.VerificationByPin.Phone.Resend.Success.Text') // sent to the email or sent to the phone
        this.errorTitle = this.$t('Account.VerificationByPin.Resend.Error.Title') // 'Resend failed'
        this.errorText = this.$t('Account.VerificationByPin.Resend.Dialog.Error.Text') // There was an error processing PIN resending.
      },
      resendPin () {
        this.isPinSent = true
        let resendPinMethod = this.detail === 'email' ? 'resendPin2Email' : 'resendPin2Phone'
        this.verifyMob = false
        this.verifyEmail = false
        store.dispatch(resendPinMethod, {})
          .then((response) => {
            if (!(response && response.exceptionType && response.message)) {
              this.verifyEmail = this.detail === 'email'
              this.verifyMob = this.detail === 'phone'
            }
          })
      },
      changeDetails () {
        this.changeEmailOrPhoneVisible = !this.changeEmailOrPhoneVisible
        this.fetchPersonalDetails()
      },
      /* returntoDetails () {
        this.verifyMob = false
        this.verifyEmail = false
        store.dispatch('getCustomerContext')
      }, */
      updateCom (isFromResendPIN = null) {
        // let self = this
        if (!isFromResendPIN) {
          this.verifyMob = false
          this.verifyEmail = false
        }

        store.dispatch('verification/fetchVerificationMaps').then(function () {
          store.dispatch('getCustomerContext')
        })
      }
    },
    mounted () {
      this.fetchPersonalDetails()
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

  .verify-content
    // margin-top 30px
    .ver-loader
      margin  0 auto
    @media mobile-big-and-below
      margin-top 0px
    .blue-heading
      padding: 10px 20px
      background: #003764
      color: #fff
      font-family 'Open Sans SemiBold'
      font-size 16px
    .padding-separate
      padding 10px 20px
      @media mobile-big-and-below
        padding 10px 20px
  .control-block.my-3 p
    @media tablet-and-below
      margin-bottom: 25px
  // .control-block p
  // margin: 30px 0
  // @media tablet-and-below
  //   margin: 25px 0
  >>>.control-block
    .pin-input, .pin-label
      width: 100% !important
      text-align: left
    .verifyText
      text-align: left
      span
        color: #ff9016
  .control-block, .form-actions
    .v-btn.success
      margin: 0
      // width: 350px
      width: auto
      margin-bottom: 15px
      >>>.v-btn__content
        display: inline-block
        width: 100%;
      @media mobile-big-and-below
        width: 100%
  .btn.changeBtn
    background: linear-gradient(to bottom, #1d9add, #003764) !important
    color: white
  .ver_pointer
    cursor: pointer
    text-align: right
  .form-actions
    margin 0
    // border-bottom: 1px solid #dbdce0;
    // padding-bottom 30px
    p
      text-align: left
    .control-block
      // margin-bottom 0
    > .control-block:nth-child(2)
      margin-top 5px
      margin-bottom 15px
    .flex-between
      display flex
      justify-content space-between
      align-items center
      .control-block
        width 100%
        margin-bottom 0px
    .verification-info
      span
        display inline-block
        background #e5e5e5
        border-radius 5px
        padding 10px
        font-size 13px
        text-align left
        margin 5px 0 0 0
        width 100%
    button.v-btn.success
      margin-bottom 0px
      padding 0 10px
    .v-card__text
      padding: 0
      padding-bottom: 3px
      text-align: left
      u
        display block
        color: #ff9016
        text-decoration none
        i
          vertical-align: middle
          font-size 24px
  @media mobile-big-and-below
    .form-actions
      margin 0
      padding-bottom 0px
  .margin-t-10
    margin-top: 10px
  .color-red
    color: #ff0000
  .color-blue
    color: #1d9add
  .font-600
    font-family: "Open Sans Bold" !important
  .flex-center
    display flex
    justify-content center
    align-items center
    p
      margin 0px 5px 2px 0px
.icon-verified
  display: inline-block
  background-image: url(icons-path'/'verified'.svg')
  height: 25px !important
  width: 22px !important
.icon-not-verified
  display: inline-block
  background-image: url(icons-path'/'not_verified'.svg')
  height: 25px !important
  width: 22px !important

</style>
