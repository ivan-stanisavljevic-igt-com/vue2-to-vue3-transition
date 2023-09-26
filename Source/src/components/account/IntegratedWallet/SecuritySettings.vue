<template>
  <div class="personal-info ctsform">
    <!--Standard account tempalte -->
    <!-- user preferences -->
    <template v-if="!accountSummaryFlow">
      <div class="strong-auth">
        <v-icon class="close" @click.stop="closeStrongAuthyDialog()">close</v-icon>
        <h1 class="strong-auth__title">{{ $t('Account.SecuritySettings.StrongAuthentication') }}</h1>
        <!-- channel -->
        <div class="strong-auth__methods">
          <span class="methods-text" v-if="!hidePreferences">{{ $t('Account.SecuritySettings.StrongAuthentication.ChooseMethod') }}</span>
          <span class="methods-text" v-else>{{ $t('Account.SecuritySettings.StrongAuthentication.ChooseMethod.PostRegistration') }}</span><br>
          <!-- Authentication app part - visible only if totp active in system -->
          <template v-if="totpIsActive">
            <!-- Authy app - show status when is verified -->
            <div class="methods-verified" v-if="totpShowStatus">
              <div class="methods-verified__title">
                <div class="methods-verified__title--child" @click.stop="setTotpStatus(false)">
                  <span class="piitem-arrow"><v-icon>chevron_left</v-icon></span>
                  <span>{{ $t('Account.SecuritySettings.StrongAuthentication.Authenticator.Status.Title') }}</span>
                </div>
              </div>
              <div class="methods-verified__status">
                <div class="methods-verified__status--child">
                  <span>{{ $t('Account.SecuritySettings.StrongAuthentication.Authenticator.Status.CurrentStatus') }}</span>
                  <span class="badge-active">{{ $t('Account.SecuritySettings.StrongAuthentication.Authenticator.Status.Active') }}</span>
                </div>
              </div>
            </div>
            <!-- Authy app - show status when is verified or open popup for authentication -->
            <div class="methods-verify" v-if="!totpShowStatus" @click.stop="isTotpVerified ? setTotpStatus(true) : toggleTOTPVerify('open')">
              <span>{{ $t('Account.SecuritySettings.StrongAuthentication.Authenticator.Title') }}</span>
              <span class="piitem-arrow"><v-icon>chevron_right</v-icon></span>
            </div>
          </template>
          <!-- Authy phone - visible always - phone is mandatory during registration process -->
          <template>
            <!-- phone authy - show status when is verified -->
            <div class="methods-verified" v-if="phoneShowStatus">
              <div class="methods-verified__title">
                <div class="methods-verified__title--child" @click.stop="setPhoneStatus(false)">
                  <span class="piitem-arrow"><v-icon>chevron_left</v-icon></span>
                  <span>{{ $t('Account.SecuritySettings.StrongAuthentication.Authenticator.Phone.Title') }}</span>
                </div>
              </div>
              <div class="methods-verified__status">
                <div class="methods-verified__status--child">
                  <span>{{ $t('Account.SecuritySettings.StrongAuthentication.Authenticator.Phone.CurrentStatus') }}</span>
                  <span class="badge-active">{{ $t('Account.SecuritySettings.StrongAuthentication.Authenticator.Phone.Active') }}</span>
                </div>
              </div>
            </div>
            <!-- Authy phone - show status when is verified or open popup for phone verification -->
            <div class="methods-verify" v-if="!phoneShowStatus" @click.stop="isPhoneVerified ? setPhoneStatus(true) : togglePhoneVerify('open')">
              <span>{{ $t('Account.SecuritySettings.StrongAuthentication.Phone.Title') }}</span>
              <span class="piitem-arrow"><v-icon>chevron_right</v-icon></span>
            </div>
          </template>
        </div><br>
        <!-- user preferences -->
        <div v-if="!hidePreferences">
          <div v-if="allowedSATypes && allowedSATypes.length > 0 && personalDetails">
            <h1>{{ $t('Account.SecuritySettings.StrongAuthentication') }}</h1>
            <div class="control-block pseudofilled auth-recovery" :class="{ 'filled': useSA4AccountRecovery }">
              <select class="input-field dd-menu" autocomplete="off" v-model="useSA4AccountRecovery" id="useSA4AccountRecovery">
                <option value="NO_SA" selected="selected">{{$t(NoSAAccRecoveryLabel)}}</option>
                <option v-for="saType in allowedSATypes" :value="saType.value" v-if="shouldBeShown(saType.mode, 'sa4AccountRecovery')">{{ $t('Account.PersonalDetails.SA.Mode' + saType.mode) }}</option>
              </select>
              <label class="control-label">{{ $t('Account.PersonalDetails.UseSA4AccountRecovery') }}</label>
            </div>
            <div class="control-block pseudofilled auth-login" :class="{ 'filled': useSA4UserLogin }">
              <select class="input-field dd-menu" autocomplete="off" v-model="useSA4UserLogin" id="useSA4UserLogin">
                <option value="NO_SA" selected="selected">{{ $t('Account.PersonalDetails.UserPreferences.NoStrongAuthentication') }}</option>
                <option v-for="saType in allowedSATypes" :value="saType.value" v-if="shouldBeShown(saType.mode, 'sa4UserLogin')">{{ $t('Account.PersonalDetails.SA.Mode' + saType.mode) }}</option>
              </select>
              <label class="control-label">{{ $t('Account.PersonalDetails.UseSA4UserLogin') }}</label>
            </div>
            <div class="form-actions">
              <v-btn color="success" :disabled="!allowAccountUpdate" x-large @click.stop="save()" id="btn_save"><span>{{ $t('Account.Save') }}</span></v-btn>
            </div>
          </div>
        </div>
      </div>
    </template>

    <!--Account summary template -->
    <template v-if="accountSummaryFlow">
      <div class="strong-auth">
        <v-icon class="close" @click.stop="closeStrongAuthyDialog()">close</v-icon>
        <h1 class="strong-auth__title">{{ $t('Account.SecuritySettings.StrongAuthentication') }}</h1>
        <div>
          <!-- channel -->
          <div class="strong-auth__methods">
            <span class="methods-text" v-if="!hidePreferences">{{ $t('Account.SecuritySettings.StrongAuthentication.ChooseMethod') }}</span>
            <span class="methods-text" v-else-if="hidePreferences && totpIsActive">{{ $t('Account.SecuritySettings.StrongAuthentication.ChooseMethod.PostRegistration') }}</span>
            <span class="methods-text" v-else-if="hidePreferences && !totpIsActive">{{ $t('Account.SecuritySettings.StrongAuthentication.ChooseMethod.PostRegistration.OnlyPhone') }}</span><br>
            <!-- Authentication app part - visible only if totp active in system -->
            <template v-if="totpIsActive">
              <!-- Authy app - show status when is verified -->
              <div class="methods-verified" v-if="totpShowStatus">
                <div class="methods-verified__title">
                  <div class="methods-verified__title--child" @click.stop="setTotpStatus(false)">
                    <span class="piitem-arrow"><v-icon>chevron_left</v-icon></span>
                    <span>{{ $t('Account.SecuritySettings.StrongAuthentication.Authenticator.Status.Title') }}</span>
                  </div>
                </div>
                <div class="methods-verified__status">
                  <div class="methods-verified__status--child">
                    <span>{{ $t('Account.SecuritySettings.StrongAuthentication.Authenticator.Status.CurrentStatus') }}</span>
                    <span class="badge-active">{{ $t('Account.SecuritySettings.StrongAuthentication.Authenticator.Status.Active') }}</span>
                  </div>
                </div>
              </div>
              <!-- Authy app - show status when is verified or open popup for authentication -->
              <div class="methods-verify" v-if="!totpShowStatus" @click.stop="isTotpVerified ? setTotpStatus(true) : toggleTOTPVerify('open')">
                <span>{{ $t('Account.SecuritySettings.StrongAuthentication.Authenticator.Title') }}</span>
                <span class="piitem-arrow"><v-icon>chevron_right</v-icon></span>
              </div>
            </template>
            <!-- Authy phone - visible always - phone is mandatory during registration process -->
            <template>
              <!-- phone authy - show status when is verified -->
              <div class="methods-verified" v-if="phoneShowStatus">
                <div class="methods-verified__title">
                  <div class="methods-verified__title--child" @click.stop="setPhoneStatus(false)">
                    <span class="piitem-arrow"><v-icon>chevron_left</v-icon></span>
                    <span>{{ $t('Account.SecuritySettings.StrongAuthentication.Authenticator.Phone.Title') }}</span>
                  </div>
                </div>
                <div class="methods-verified__status">
                  <div class="methods-verified__status--child">
                    <span>{{ $t('Account.SecuritySettings.StrongAuthentication.Authenticator.Phone.CurrentStatus') }}</span>
                    <span class="badge-active">{{ $t('Account.SecuritySettings.StrongAuthentication.Authenticator.Phone.Active') }}</span>
                  </div>
                </div>
              </div>
              <!-- Authy phone - show status when is verified or open popup for phone verification -->
              <div class="methods-verify" v-if="!phoneShowStatus" @click.stop="isPhoneVerified ? setPhoneStatus(true) : togglePhoneVerify('open')">
                <span>{{ $t('Account.SecuritySettings.StrongAuthentication.Phone.Title') }}</span>
                <span class="piitem-arrow"><v-icon>chevron_right</v-icon></span>
              </div>
            </template>
          </div><br>
          <!-- user preferences -->
          <div v-if="!hidePreferences">
            <div v-if="allowedSATypes && allowedSATypes.length > 0 && personalDetails && (isPhoneVerified || (this.isEmailVerified && !this.listOfBlockedChannels2FA.includes('EML')) || (totpIsActive && isTotpVerified))">
              <div class="control-block pseudofilled auth-recovery not-inline" :class="{ 'filled': useSA4AccountRecovery }">
                <select class="input-field dd-menu" autocomplete="off" v-model="useSA4AccountRecovery" id="useSA4AccountRecovery" ref="SA4AccountRecoveryDisabled">
                  <option value="NO_SA" selected="selected">{{$t(NoSAAccRecoveryLabel)}}</option>
                  <option v-for="saType in allowedSATypes" :value="saType.value" v-if="shouldBeShown(saType.mode, 'sa4AccountRecovery')">{{ $t('Account.PersonalDetails.SA.Mode' + saType.mode) }}</option>
                </select>
                <label class="control-label">{{ $t('Account.PersonalDetails.UseSA4AccountRecovery') }}</label>
                <span class="auth-recovery__piitem-arrow"><v-icon>expand_more</v-icon></span>
              </div>
              <div class="control-block pseudofilled auth-login not-inline" :class="{ 'filled': useSA4UserLogin }">
                <select class="input-field dd-menu" autocomplete="off" v-model="useSA4UserLogin" id="useSA4UserLogin" ref="SA4UserLoginDisabled">
                  <option value="NO_SA" selected="selected">{{ $t('Account.PersonalDetails.UserPreferences.NoStrongAuthentication') }}</option>
                  <option v-for="saType in allowedSATypes" :value="saType.value" v-if="shouldBeShown(saType.mode, 'sa4UserLogin')">{{ $t('Account.PersonalDetails.SA.Mode' + saType.mode) }}</option>
                </select>
                <label class="control-label">{{ $t('Account.PersonalDetails.UseSA4UserLogin') }}</label>
                <span class="auth-login__piitem-arrow"><v-icon>expand_more</v-icon></span>
              </div>
              <div class="form-actions">
                <v-btn color="success" :disabled="!allowAccountUpdate" x-large @click.stop="save()" id="btn_save"><span>{{ $t('Account.Save') }}</span></v-btn>
              </div>
            </div>
          </div>
        </div>
        <div v-if="false">
          <v-icon class="close"  @click.stop="$store.commit('setIs2FA', true)">close</v-icon>
          <v-btn  @click="get2fa()">close dialog and show login</v-btn>
        </div>
      </div>
    </template>

    <!-- Authentication popup-->
    <div>
      <!-- TOTP verification pop-up -->
      <div class="tandc-popup-container" v-if="totpVerifyPopup">
        <div class="authy-popup-child">
          <AccountAuthentication @declineToggleTOTPVerify="toggleTOTPVerify('decline')"></AccountAuthentication>
        </div>
      </div>
      <!-- Phone verification pop-up -->
      <div class="tandc-popup-container" v-if="phoneVerifyPopup">
        <div class="authy-popup-child">
          <div>
            <v-icon class="close"  @click.stop="togglePhoneVerify('decline')">close</v-icon><br>
            <div class="authy-popup-child-content">
              <div class="titles">
                <p class="guidedTitle">{{ $t('Account.Authentication.2fa.Authentication') }}</p>
                <p class="title">{{ $t('Account.Authentication.2fa.AuthenticationByPhone') }}</p>
              </div>
              <verify-by-pin v-if="!changePhoneVisible" :page="'verify_mob'" :state="'sent'" :fromVerDetail="true" @changeDetail="changeDetails" @refreshafteraction="updateAuthyStatus"></verify-by-pin>
              <change-detail v-else  @goBack="changeDetails" :page="'verify_mob'"></change-detail>
            </div>
          </div>
        </div>
      </div>
    </div>

    <ProcessingDialog
      v-model="dialog"
      :isDialogPersistent="true"
      :isProcessing="isProcessing"
      :isSuccess="!transactionError"
      :processingTitle="processingTitle || $t('Account.PersonalDetails.Dialog.Processing.Title')"
      :processingText="processingText || $t('Account.PersonalDetails.Dialog.Processing.Text')"
      :successTitle="successTitle || $t('Account.SecuritySettings.Dialog.Success.Title')"
      :successText="successText || $t('Account.PersonalDetails.Dialog.Success.Text')"
      :errorTitle="errorTitle || $t('Account.SecuritySettings.Dialog.Error.Title')"
      :closeBtnText="$t('ProcessingDialog.CloseButtonText')"
    >
      <div slot="text-error">
        <p v-if="brandKey !=='sb'" class="generic-icon-note"><v-icon color="error" class="mr-1">error</v-icon><span>{{ $t('Account.PersonalDetails.Dialog.Error.Text') }}</span></p>
        <p class="response-error">{{ transactionError }}</p>
        <p v-html="$t('Account.PersonalDetails.Dialog.Error.Text.ContactSupport')"></p>
      </div>
    </ProcessingDialog>
  </div>
</template>
<script>
  import store from '@/store'
  // import ChangePassword from '@/components/account/IntegratedWallet/IWChangePassword'
  import ProcessingDialog from '@/components/common/ProcessingDialog'
  import lib from '@/library'
  import Branding from '@/components/mixins/Branding'
  import AccountAuthentication from '@/components/account/Authy2fa/AccountAuthentication'
  import VerifyByPin from '@/components/account/Verification/VerifyByPin'
  import ChangeDetail from '@/components/account/Verification/ChangeDetail'

  export default {
    mixins: [
      Branding
    ],
    components: {
      ProcessingDialog,
      AccountAuthentication,
      VerifyByPin,
      ChangeDetail
    },
    props: ['hidePreferences'],
    data () {
      return {
        personalDetails: undefined,
        chosenUserSA4Login: null,
        chosenUserSA4AccountRecovery: null,
        dialog: false,
        isProcessing: false,
        transactionError: null,
        processingTitle: null,
        processingText: null,
        successTitle: null,
        successText: null,
        errorTitle: null,
        errorText: null,
        totpVerifyPopup: false,
        totpShowStatus: false,
        phoneShowStatus: false,
        phoneVerifyPopup: false,
        changePhoneVisible: false
      }
    },
    computed: {
      isLoggedIn () {
        return store.getters['isLoggedIn']
      },
      allowedSATypes () {
        return store.getters['getAllowedSATypes']
      },
      useSA4AccountRecovery: {
        get () {
          let pref = this.personalDetails.Preferences.find(pref => pref.Name === 'UseSA4AccountRecovery')
          if (!this.chosenUserSA4AccountRecovery) {
            this.chosenUserSA4AccountRecovery = pref.Value
          }
          return pref.Value || undefined
        },
        set (value) {
          let pref = this.personalDetails.Preferences.find(pref => pref.Name === 'UseSA4AccountRecovery')
          pref.Value = value
        }
      },
      useSA4UserLogin: {
        get () {
          let pref = this.personalDetails.Preferences.find(pref => pref.Name === 'UseSA4UserLogin')
          if (!this.chosenUserSA4Login) {
            this.chosenUserSA4Login = pref.Value
          }
          return pref.Value || undefined
        },
        set (value) {
          let pref = this.personalDetails.Preferences.find(pref => pref.Name === 'UseSA4UserLogin')
          pref.Value = value
        }
      },
      usState: () => window.ctsautoconf.STATE,
      NoSAAccRecoveryLabel () {
        return (this.usState === 'NJ' || (this.usState && this.usState.toLowerCase() === 'ia')) ? 'Account.PersonalDetails.UserPreferences.NoStrongAuthentication.SSNDOB' : 'Account.PersonalDetails.UserPreferences.NoStrongAuthentication'
      },
      allowAccountUpdate () {
        return store.getters['getAllowAccountUpdate']
      },
      accountSummaryFlow () {
        return window.ctsautoconf.ACCOUNT_SUMMARY_FLOW || false
      },
      totpIsActive () {
        return store.getters['getTotpIsActive']
      },
      isTotpVerified () {
        return store.getters['getTotpIsVerified']
      },
      isPhoneVerified () { // from Customer Context
        return store.getters['getIsPhoneVerified']
      },
      isEmailVerified () { // from Customer Context
        return store.getters['getIsEmailVerified']
      },
      isCustomerVerified () {
        return store.getters['getIsCustomerVerified']
      },
      loginFields () {
        return store.getters['overlayState/getloginFields']
      },
      listOfBlockedChannels2FA () {
        return store.getters['getListOfBlockedChannels2FA']
      },
      show2FAPostRegPopup () {
        return store.getters['getShow2FAPostRegPopup']
      },
      mobileUsernameAndPassword () {
        return store.getters['getMobileUsernameAndPassword']
      }
    },
    methods: {
      shouldBeShown (saMode, saPurpose) {
        switch (saMode) {
          case 1:
            return true
          case 2:
            if (saPurpose === 'sa4AccountRecovery') {
              return (this.isPhoneVerified) || (this.useSA4AccountRecovery === 'SELF_BY_PIN' || this.chosenUserSA4AccountRecovery === 'SELF_BY_PIN')
            }
            return ((this.isPhoneVerified && !this.listOfBlockedChannels2FA.includes('MTL')) || (this.isEmailVerified && !this.listOfBlockedChannels2FA.includes('EML')) || (this.totpIsActive && this.isTotpVerified)) || (saPurpose === 'sa4AccountRecovery' ? (this.useSA4AccountRecovery === 'SELF_BY_PIN' || this.chosenUserSA4AccountRecovery === 'SELF_BY_PIN') : (this.useSA4UserLogin === 'SELF_BY_PIN' || this.chosenUserSA4Login === 'SELF_BY_PIN'))
          case 3:
            return (this.isPhoneVerified || this.isEmailVerified || (this.totpIsActive && this.isTotpVerified)) || (saPurpose === 'sa4AccountRecovery' ? (this.useSA4AccountRecovery === 'PIN_OR_SECQ2' || this.chosenUserSA4AccountRecovery === 'PIN_OR_SECQ2') : (this.useSA4UserLogin === 'PIN_OR_SECQ2' || this.chosenUserSA4Login === 'PIN_OR_SECQ2'))
          case 4:
            return (this.isPhoneVerified || this.isEmailVerified || (this.totpIsActive && this.isTotpVerified)) || (saPurpose === 'sa4AccountRecovery' ? (this.useSA4AccountRecovery === 'PIN_AND_SECQ2' || this.chosenUserSA4AccountRecovery === 'PIN_AND_SECQ2') : (this.useSA4UserLogin === 'PIN_AND_SECQ2' || this.chosenUserSA4Login === 'PIN_AND_SECQ2'))
        }
      },
      save () {
        this.isProcessing = true
        this.transactionError = null
        this.processingTitle = null
        this.processingText = null
        this.successTitle = null
        this.successText = null
        this.errorTitle = null
        this.dialog = true
        store.commit('setFormSubmitSppiner', true)
        lib.rpcService.callBroker('psregistrationservice', 'updatepersonaldetails', {
          'IDDCApplication': 'TEXAS',
          'personalDetails': this.personalDetails
        })
          .then((response) => {
            if (response && response.exceptionType && response.message) {
              this.transactionError = response.message
            } else {
              this.isProcessing = false
              store.commit('setFormSubmitSppiner', false)
              store.dispatch('getCustomerContext')
            }
          })
          .catch((err) => {
            this.transactionError = err.message || this.$t('Server.ErrorMsg.Generic')
          })
          .finally(() => {
            this.isProcessing = false
            this.fetchPersonalDetails()
          })
      },
      fetchPersonalDetails () {
        lib.rpcService.callBroker('psregistrationservice', 'getpersonaldetails', {
          'IDDCApplication': 'TEXAS',
          'preferenceNames': ['UseSA4UserLogin', 'UseSA4AccountRecovery']
        }).then(response => {
          if (response.result) {
            console.log(response.result)
            this.personalDetails = response.result
          }
        }).catch((error) => {
          console.log(error)
        })
      },
      enableInput (itemDisabled) {
        this.$refs[itemDisabled].removeAttribute('disabled')
        this.$refs[itemDisabled].focus()
      },
      focusOut (itemDisabled) {
        this.$refs[itemDisabled].setAttribute('disabled', '')
      },
      fetchTotpIsActive () {
        store.dispatch('getTotpIsActiveAndDisableTrust')
      },
      toggleTOTPVerify (param) {
        if (param === 'open') {
          if (this.isLoggedIn) {
            store.dispatch('getCustomerContext').then(function () {
            }).finally(() => {
              this.totpVerifyPopup = true
            })
          } else {
            this.totpVerifyPopup = true
          }
        } else if (param === 'decline') {
          if (this.isLoggedIn) {
            this.fetchPersonalDetails()
          }
          if (this.isTotpVerified) {
            this.setTotpStatus(true)
            this.setPhoneStatus(false)
          }
          this.totpVerifyPopup = false
        }
      },
      setTotpStatus (status) {
        this.totpShowStatus = status
      },
      setPhoneStatus (status) {
        this.phoneShowStatus = status
      },
      togglePhoneVerify (param) {
        if (param === 'open') {
          store.dispatch('resendPin2Phone', {
            username: (this.loginFields && this.loginFields.username) || (this.mobileUsernameAndPassword && this.mobileUsernameAndPassword.username),
            password: (this.loginFields && this.loginFields.password) || (this.mobileUsernameAndPassword && this.mobileUsernameAndPassword.password)
          })
          this.phoneVerifyPopup = true
        } else if (param === 'decline') {
          this.updateAuthyStatus()
          this.phoneVerifyPopup = false
        }
      },
      changeDetails () {
        console.log('From Security Setting changeDetails')
        this.changePhoneVisible = !this.changePhoneVisible
        this.fetchPersonalDetails()
      },
      updateAuthyStatus (isFromResendPIN = null) {
        if (this.isLoggedIn) {
          store.dispatch('getCustomerContext').then(function () {
          }).finally(() => {
            if (this.isPhoneVerified) {
              this.setPhoneStatus(true)
              this.setTotpStatus(false)
            }
            if (!isFromResendPIN) {
              this.phoneVerifyPopup = false
            }
          })
        } else {
          if (!isFromResendPIN) {
            this.phoneVerifyPopup = false
          }
        }
      },
      get2fa () {
        store.dispatch('get2FASilent', {
          'username': this.loginFields.username,
          'password': this.loginFields.password
        })
        store.commit('setIs2FA', true)
      },
      closeStrongAuthyDialog () {
        if (!this.isLoggedIn) {
          store.commit('setTemporaryUsername', this.loginFields.username)
          store.commit('setTemporaryPassword', this.loginFields.password)
          store.dispatch('overlayState/activateLoginDialog')
          store.commit('setForceTOTPOrMTLVerification', false)
        } else if (this.show2FAPostRegPopup && this.isLoggedIn && ((this.totpIsActive && this.isTotpVerified) || this.isPhoneVerified)) {
          store.commit('setShow2FAPostRegPopup', false)
        } else {
          this.$router.push({name: 'logout'})
        }
        // this.sendGTMClickEvent('login', 'open login dialog', 'login-btn', 'top header')
        store.commit('setIs2FA', true)
        store.commit('setForceTOTPOrMTLVerification', false)
      }
    },
    mounted () {
      if (this.isLoggedIn) {
        this.fetchPersonalDetails()
      }
      this.fetchTotpIsActive()
    },
    created () {
    }
  }
</script>

<style lang="stylus" scoped>
  @import '~@/css/config'
  @import '~@/css/mixins'

  .container
    h1
      font-size 15px
      margin 0px
  .authy-popup-child
    padding: 0
    position: fixed
    top: 1%
    right: 30%
    left: 30%
    bottom: 1%
    z-index: 10001
    background: #fff
    overflow-y: scroll
    padding-bottom: 10px !important
    @media mobile-big-and-below
      padding: 10px !important
      right: 10%
      left: 10%
    .close
        position: absolute
        right: 5px
        top: 5px
        font-size: 40px
    >>>.vmsg
      top: 0
    .authy-popup-child-content
      max-width: 400px
      margin: 0 auto
      >>>.verify-content
        padding: 15px 0
        h2
          font-size 1.4rem
          margin-bottom 15px
          text-align center
        h2 + p
          text-align center
      .titles
        text-align center
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
      >>>#confirmEmalByPinForm
        .vmsg
          text-align center
        p
          text-align: center !important
          max-width: 350px
          margin: 10px auto
        .control-block.filled
          label.control-label
            padding-top 0px
        // .control-block.pin-block
        //   margin: 0 auto !important
        .control-block
          width: 350px !important
          margin: 0 auto 15px !important
          clear: both
          display: block
          position: relative
          text-align: center
          @media mobile-big-and-below
            width: 100% !important
          input
            padding-left: 0;
            padding-right: 0;
            display: inline-block;
            width: 100% !important;
            text-align: center;
            box-sizing: border-box;
            padding: 30px 10px 5px;
            clear: both;
            position: relative;
            z-index: 5;
            color: #505050;
            font-weight: bold;
          input:focus
            color: var(--account-pages-label-focus-color);
          input:focus ~ label.control-label
            padding-top: 0;
            background-color: #f6f6f6 !important
          label.control-label
            display: unset
            width: 100% !important;
            text-align: center;
            font-size: 12px !important;
            text-transform: uppercase !important;
            padding-left: 0;
            padding-right: 0;
            position: absolute !important;
            z-index: 1;
            top: 0;
            right: 0;
            left: 0;
            height: 55px !important;
            padding: 30px 10px 0;
            line-height: 20px !important;
            transition: all 0.1s ease-in;
  .strong-auth
    max-width: 500px
    margin: 0 auto
    i.close
      display: none
      position: absolute
      top: 10px
      right: 15px
      font-size: 40px
    h1.strong-auth__title
      text-align center !important
      padding 20px 0 5px
    .strong-auth__methods
      text-align: center
      // padding-bottom: 20px
      span.methods-text
        display: inline-block
        padding-bottom: 20px
      .methods-verify
        cursor: pointer
        // padding-bottom: 20px
        height: 45px
        display: flex
        justify-content: center
        align-items: center
        border: 1px solid #cfd6db
        margin: 4px 0
        border-radius: 3px
        font-family: "Open Sans SemiBold" 
      .methods-verified
        padding: 5px
        border: 1px solid #cfd6db
        margin: 4px 0
        border-radius: 3px
        font-family: "Open Sans SemiBold" 
        .methods-verified__title
          display: flex
          justify-content: center
          .methods-verified__title--child
            display: flex
            justify-content: center
            align-items center
            cursor pointer
        .methods-verified__status
          .methods-verified__status--child
            display: flex
            justify-content: center
            align-items center
            .badge-active
              display inline-block
              background-color: #3AAB58
              color: #fff
              font-size: 10px
              padding: 0 5px
              border-radius: 5px
              margin-left 5px

.auth-recovery,
.auth-login
  margin-bottom 15px!important

.auth-recovery__piitem-arrow,
.auth-login__piitem-arrow
  position absolute
  right 0
</style>
