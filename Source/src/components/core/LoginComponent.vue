<template>
  <div class="login-component" :class="{'not-initial-form': !initialForm}">
    <popup-join-dialog v-if="disableJoin"></popup-join-dialog>
    <div v-if="!mobileBigAndBelow && brandLayout !== 'generic' && brandKey!== 'circa' && brandKey !=='sb' && brandKey !== 'mav' && brandKey !== 'qcasino' && brandKey !== 'pr'" class="loginDialogIntro">
      <div class="login-intro">
        <div class="small">{{ $t('Login.Intro.Small') }}</div>
        <div class="big" v-html="$t('Login.Intro.Big')"></div>
      </div>
      <v-btn class="joinNow" @click="goToRegistrationPage()"><span>{{ $t('MyAccount.JoinNow') }}</span></v-btn>
    </div>
    <div class="loginHolder">
      <v-layout align-center login-header>
        <v-flex class="logo">
          <router-link to="/">
            <logo :mode="brandKey ==='rw' ? 'dark' : 'light'" :name="(brandKey === 'dn' || brandKey === 'dnw') ? 'extend' : ''"></logo>
          </router-link>
        </v-flex>
        <v-flex class="close" v-if="(brandKey !== 'dn' && brandKey !== 'dnw')">
          <v-btn flat @click="closeLoginDialog()" class="close"><v-icon>close</v-icon></v-btn>
        </v-flex>
      </v-layout>
      <div v-if="(brandLayout === 'generic' || brandKey === 'sb' || brandKey === 'mav') && initialForm && mobileBigAndBelow && !formSubmitSppiner && ((!biometricsSettignsParam && (biometricsAvailability && biometricsAvailability.biometrics === 'DATA')) || (biometricsSettignsParam && faceIDstate && (biometricsSettings && biometricsSettings.biometrics_display === 'true') && (biometricsAvailability && biometricsAvailability.biometrics === 'DATA')))" class="buttons faceBtn">
        <img @click="readBiometricsData()" v-if="brandKey === 'mav'" src="/static/brand-img/mav/login_face_id.svg" alt="">
        <v-btn @click="readBiometricsData()" block class="btn-white primary-btn-blue"><span class="faceId">{{biometricsAvailability.btn_text}}</span></v-btn>
      </div>
      <div class="loginTitle" v-if="!enterPinTitleVisible && (brandLayout === 'generic' || brandKey=== 'circa' || brandKey=== 'sb' || brandKey === 'mav' || brandKey === 'qcasino' || brandKey === 'pr')">{{ $t('Login.Title') }}</div>
      <div class="loginTitle" v-if="enterPinTitleVisible">{{ $t('Login.EnterPin.Title') }}</div>
      <div v-if="brandKey === 'qcasino' || brandKey === 'pr'" class="profile-img">
        <img v-if="brandKey === 'qcasino'" src="/static/brand-img/qcasino/profile-white.svg" alt="">
        <img v-if="brandKey === 'pr'" src="/static/brand-img/pr/profile-blue.svg" alt="">
      </div>
      <v-form class="form-normal" @submit.prevent="get2FA()" v-if="initialForm" autocomplete="off">
        <div class="lockedAccount" v-if="accountIsLocked && brandKey === 'sb'" v-html="$t('MyAccount.PasswordPolicy.SB.Blocked')">
        </div>
        <div class="lockedAccount" v-else-if="accountIsLocked">
          {{ $t('MyAccount.PasswordPolicy.Locked.FirstPart') }}
          <span class="here" @click.stop="go2ChangePasswordPage">{{ $t('MyAccount.PasswordPolicy.Locked.SecondPart') }}</span>
          {{ $t('MyAccount.PasswordPolicy.Locked.ThirdPart') }}
        </div>
        <p class="lockedAccount noChannel" v-show="loginErrorMessage==='ChannelDoesNotExist'" v-else-if="noSA && type2fa && !sent2fa">
          <span v-html="$t('MyAccount.Login.2fa.Sent.ChannelDoesNotExist' + getChannelTranslationSuffix())"></span>
        </p>
        <p class="error" v-show="loginErrorMessage" v-else-if="noSA">
          {{ loginErrorMessage }}
        </p>
        <p class="activate-account" v-if="$t('Login.Account.Activation') && brandKey === 'boyd'">{{ $t('Login.Account.Activation') }}</p>
        <v-text-field type="text" required id="username" @input="clearPasswordField" name="username" :label="usernameLabel" ref="username" v-model.trim="loginFields.username" class="username" />
        <!-- USERNAME VALIDATION -->
        <div>
          <div class="errormsg" v-if="loginUsernameType === 'UN' && errorMessages.userNameSymbol" id="err_msg_username_symbol" v-html="$t('Account.Join.ErrorMsg.UserNameSymbol')"></div>
        </div>
        <v-text-field :type="loginFields.showPassword ? 'text' : 'password'" required id="password" name="password" :label="$t('Login.Password')" v-model="loginFields.password" class="password" />
        <span v-if="brandKey !== 'circa' && brandKey !== 'sb' && brandKey !== 'mav'" class="show_hide" @click.stop="toggleShowPassword()">{{ loginFields.showPassword ? 'Hide' : 'Show' }}</span>
        <v-layout v-if="brandKey === 'qcasino' || brandKey === 'pr'">
          <v-flex xs12 class="float-right forgotPass"><a @click="goToForgottenPasswordPage()" target="_self"><span id="qa-forgotPass">{{ $t('MyAccount.ForgotPass') }}</span></a></v-flex>
        </v-layout>
        <span v-if="brandKey === 'circa' || brandKey === 'sb' || brandKey === 'mav'" class="show_hide" @click.stop="toggleShowPassword()">{{ loginFields.showPassword ? 'Hide Password' : 'Show Password' }}</span>
        <div v-if="formSubmitSppiner"><circle-loader></circle-loader></div>
        <v-flex v-if="(brandKey === 'qcasino' || brandKey === 'pr') && !formSubmitSppiner" xs12 class="float-left forgotPass dont-have-acc"><span>{{ $t('MyAccount.HaveYouAnAccount') }}</span></v-flex>
        <div v-if="!formSubmitSppiner" class="buttons">
          <v-btn type="submit" :disabled="isLoginButtonDisabled" block class="primary-btn-blue login" id="login_btn_dialog"><span>{{ $t('MyAccount.LogIn') }}</span></v-btn>
          <v-btn v-if="(brandKey === 'dn' || brandKey === 'dnw') || brandKey === 'qcasino' || brandKey === 'pr'" class="join-now" @click="joinAction()"><span>{{ $t('MyAccount.JoinNow') }}</span></v-btn>
        </div>
        <div v-if="!formSubmitSppiner && brandKey === 'circa'" class="buttons circa_buttons">
          <div class="btnsHolder">
            <span class="v-btn need-account"><span>{{ $t('MyAccount.NeedAccount') }}</span></span>
            <v-btn class="join-now" @click="goToRegistrationPage()"><span>{{ $t('MyAccount.JoinNow') }}</span></v-btn>
          </div>
        </div>
        <v-switch class="faceIdSwitch" :color="switchColor" v-if="biometricsSettignsParam && !formSubmitSppiner && mobileBigAndBelow && (biometricsSettings && biometricsSettings.biometrics_display === 'true')" v-model="faceIDstate" @change="faceIdChangeState(faceIDstate)"
                  :label="biometricsSettings.btn_text">
        </v-switch>
        <div v-if="!formSubmitSppiner && brandKey=== 'sb'|| brandKey === 'mav' || brandLayout === 'generic'" class="buttons sb_buttons">
          <div class="btnsHolder">
            <v-btn v-if="brandKey === 'sb'" class="join-now" @click="joinAction()"><span>{{ $t('MyAccount.CreateAccount') }}</span></v-btn>
            <v-btn v-if="brandKey === 'mav' || brandLayout === 'generic'" type="submit" block class="primary-btn-blue join-now" @click="joinAction()"><span>{{ $t('MyAccount.JoinNow') }}</span></v-btn>
          </div>
          <div v-if="brandKey === 'sb' && state === 'NJ'" class="rg">
            <span class="header-txt" v-html="$t('Login.InfoMessage.' + state)"></span>
          </div>
        </div>
        <div v-if="brandLayout !== 'generic' && brandKey !=='sb' && brandKey !== 'mav' && initialForm && mobileBigAndBelow && !formSubmitSppiner && ((!biometricsSettignsParam && (biometricsAvailability && biometricsAvailability.biometrics === 'DATA')) || (biometricsSettignsParam && faceIDstate && (biometricsSettings && biometricsSettings.biometrics_display === 'true') && (biometricsAvailability && biometricsAvailability.biometrics === 'DATA')))" class="buttons faceBtn">
          <v-btn @click="readBiometricsData()" block class="btn-white"><span class="faceId">{{biometricsAvailability.btn_text}}</span></v-btn>
        </div>
        <div v-if="brandKey === 'qcasino' || brandKey === 'pr'" class="login-footer">
          <!-- <p v-html="$t('Login.Footer.Message')"></p> -->
          <!-- <p v-html="$t('Login.Footer.Note')"></p> -->
        </div>

        <v-layout v-if="brandKey !== 'qcasino' && brandKey !== 'pr'">
          <v-flex xs12 class="float-right forgotPass"><a @click="goToForgottenPasswordPage()" target="_self"><span id="qa-forgotPass">{{ $t('MyAccount.ForgotPass') }}</span></a></v-flex>
          <v-flex v-if="(brandKey === 'dn' || brandKey === 'dnw')" xs12 class="float-right forgotPass"><span>{{ $t('MyAccount.HaveYouAnAccount') }}</span></v-flex>
        </v-layout>

        <!-- mobile browser - NOT App-->
        <!-- <div class="login-gelocation-info" v-if="mobileBigAndBelow && !isOpenedFromWebView">
        <p class="login-note"><span>{{ $t('MyAccount.Note') }}</span>:</p>
        <div class="gc-plugin">
          <template v-if="isDebug">
            userAgent : {{ userAgent }} <br />
          </template>
          <template v-if="(userAgent == 'ios') || ( userAgent == 'android')">
            <span>{{ $t('MyAccount.PluginNotExistsDownloadApp.' + state) }}</span>
            <v-btn class="primary-btn-blue" block @click="appInstall()">{{ $t('Header.nativeAppBeforeLogin' + userAgent + '.appDwn') }}</v-btn>
          </template>
          <template v-else-if="this.navigatorID === 'win' || this.navigatorID === 'mac'">
            <span>{{ $t('MyAccount.PluginNotExists.' + state) }}</span>
            <v-btn class="primary-btn-blue" block @click="pluginDownload()"><span>{{ $t('GeoComply.client.download') }}</span></v-btn>
            <br />
            <br />
          </template>
          <template v-else>
            <span>{{ $t('MyAccount.PluginNotExistsNotSupportedOS.' + state) }}</span>
          </template>
        </div>
      </div> -->
        <!--Desktop-->
        <!-- <div class="login-gelocation-info-desktop" v-if="!mobileBigAndBelow">
        <div class="gc-plugin-desktop">
          <template v-if="isDebug">
            navigatorID: {{ navigatorID }}
          </template>
          <template v-if="this.navigatorID === 'win' || this.navigatorID === 'mac'">
            <p class="gc-info">{{ $t('MyAccount.PluginNotExists.' + state) }}</p>
            <v-btn @click="pluginDownload()" block class="btn-white"><span>{{ $t('GeoComply.client.download') }}</span></v-btn>
            <br />
            <br />
          </template>
          <template v-else>
            <span>{{ $t('MyAccount.PluginNotExistsNotSupportedOS.' + state) }}</span>
          </template>
        </div>
      </div> -->
      </v-form>
      <!-- START RESET PASSWORD SA -->
      <v-form class="form-normal" v-if="resetPwdForm">
        <p class="error" v-if="resetPwdErrorMessage">
          {{ resetPwdErrorMessage }}
        </p>
        <p class="resetpwd-intro" :class="{'activate-account': brandKey === 'boyd'}" v-if="!resetPwdErrorMessage && pwdPolicy === 'reset'">
          {{ $t('MyAccount.PasswordPolicy.ResetPassword') }}
        </p>
        <v-text-field :type="showNewPassword ? 'text' : 'password'" required id="newPassword" name="newPassword" :label="$t('Account.ChangePassword.NewPassword')" v-model="newPassword" class="password" ref="newPassword" :maxlength="vldPasswordMaxLength" />
        <span v-if="brandKey !== 'circa' && brandKey !== 'sb'" class="show_hide" @click.stop="toggleShowNewPassword()">{{ showNewPassword ? 'Hide' : 'Show' }}</span>
        <span v-if="brandKey === 'circa' || brandKey === 'sb'" class="show_hide" @click.stop="toggleShowNewPassword()">{{ showNewPassword ? 'Hide Password' : 'Show Password' }}</span>
        <div class="account-page ctsform">
          <div class="vmsg invalid" :class="{'invmsg': brandKey !== 'boyd'}" v-if="errorMessages.newPasswordMissing.val">{{ $t('Account.ChangePassword.ErrorMessages.NewPasswordMissing') }}</div>
          <div class="vmsg invalid" :class="{'invmsg': brandKey !== 'boyd'}" v-if="errorMessages.newPasswordSame.val">{{ $t('Account.ChangePassword.ErrorMessages.SamePassword') }}</div>
          <div class="vmsg invalid" :class="{'invmsg': brandKey !== 'boyd'}" v-if="errorMessages.newPasswordStrength.val" v-html="$t('Account.Join.ErrorMsg.PassStrength', {pwdMinLength: vldPasswordMinLength})"></div>
        </div>
        <v-text-field :type="showConfirmPassword ? 'text' : 'password'" required id="confirmNewPassword" name="confirmNewPassword" :label="$t('Account.ChangePassword.ConfirmNewPassword')" v-model="confirmNewPassword" class="password" ref="confirmNewPassword" :maxlength="vldPasswordMaxLength" />
        <span v-if="brandKey !== 'circa' && brandKey !== 'sb'" class="show_hide" @click.stop="toggleShowConfirmPassword()">{{ showConfirmPassword ? 'Hide' : 'Show' }}</span>
        <span v-if="brandKey === 'circa' || brandKey === 'sb'" class="show_hide" @click.stop="toggleShowConfirmPassword()">{{ showConfirmPassword ? 'Hide Password' : 'Show Password' }}</span>
        <div class="account-page ctsform">
          <div class="vmsg invalid" :class="{'invmsg': brandKey !== 'boyd'}" v-if="errorMessages.confirmNewPasswordMissing.val">{{ $t('Account.ChangePassword.ErrorMessages.ConfirmNewPassword.Missing') }}</div>
          <div class="vmsg invalid" :class="{'invmsg': brandKey !== 'boyd'}" v-if="errorMessages.confirmedNewPasswordNotSame.val">{{ $t('Account.ChangePassword.ErrorMessages.ConfirmNewPassword.NotSame') }}</div>
        </div>
        <!-- Force ssn4 and dob when no SA-->
        <div class="ctsform nosa-ssn4-dob" v-if="pwdResetMode === 0">
          <!-- SSN -->
          <div class="control-block" :class="{ 'filled': ssn4 }">
            <input type="text" inputmode="numeric" v-model="ssn4" autocomplete="off" :maxlength="4" />
            <label class="control-label">{{ $t('Account.Join.Last4SSN') }}</label>
          </div>
          <!-- DATE OF BIRTH -->
          <div class="control-block" :class="{ 'filled': dateOfBirth }" @click="onDateBirth">
            <v-menu ref="datePickerMenu"
                    v-model="datePickerMenu"
                    :close-on-click="false"
                    :close-on-content-click="false"
                    :nudge-right="0"
                    :return-value.sync="dateOfBirth"
                    lazy
                    transition="scale-transition"
                    offset-y
                    full-width
                    min-width="290px"
                    z-index="250!important">
              <template slot="activator">
                <input type="text" v-model.trim="formattedDate" id="dateOfBirth" autocomplete="off" readonly name="reg-dob" />
                <label class="control-label">{{ $t('Account.Join.DOB') }}</label>
              </template>
              <v-date-picker ref="picker" :max="maxDate" @change="checkDateOfBirth()" v-model="dateOfBirth" no-title scrollable></v-date-picker>
            </v-menu>
          </div>
        </div>
        <div v-if="resetPwdSubmitSppiner"><circle-loader></circle-loader></div>
        <div class="buttons" v-if="!resetPwdSubmitSppiner">
          <v-btn @click.stop="resetPwdSA()" :disabled="isChangePasswordButtonDisabled || (pwdResetMode === 0 && (!dateOfBirth || ssn4IsInvalid))" block class="primary-btn-blue"><span>{{ $t('MyAccount.Proceed') }}</span></v-btn>
        </div>
      </v-form>
      <!-- END RESET PASSWORD SA -->

      <!-- Mode 2 -->
      <div class="account-page ctsform sa" v-if="(SAPINOnLogin && (!resetPwd || (resetPwd && showSALoginAfterResetPwd && !showResetPwdSAForm))) || (showResetPwdSAForm && ResetPwdSAPINOnLogin)">
        <div class="lockedAccount" v-if="accountIsLocked && brandKey === 'sb'" v-html="$t('MyAccount.PasswordPolicy.SB.Blocked')">
        </div>
        <div class="lockedAccount" v-else-if="accountIsLocked">
          {{ $t('MyAccount.PasswordPolicy.Locked.FirstPart') }}
          <span class="here" @click.stop="go2ChangePasswordPage">{{ $t('MyAccount.PasswordPolicy.Locked.SecondPart') }}</span>
          {{ $t('MyAccount.PasswordPolicy.Locked.ThirdPart') }}
        </div>
        <p class="error" v-else-if="showResetPwdSAForm && overridenPINExceptionResetPwd">
          {{ overridenPINExceptionResetPwd }}
        </p>
        <p class="error" v-else-if="showResetPwdSAForm && resetPwdErrorMessage">
          {{ resetPwdErrorMessage }}
        </p>
        <p class="error" v-else-if="overridenPINException">
          {{ overridenPINException }}
        </p>
        <p class="error" v-else-if="loginErrorMessage">
          <span v-html="loginErrorMessage"></span>
        </p>
        <p class="resetpwd-intro-sa" :class="{'activate-account': brandKey === 'boyd'}" v-if="resetPwd && showSALoginAfterResetPwd">
          {{ $t('MyAccount.PasswordPolicy.ResetPasswordLogin.UseSA') }}
        </p>
        <p class="resetpwd-intro-sa" :class="{'activate-account': brandKey === 'boyd'}" v-else-if="showResetPwdSAForm && ResetPwdSAPINOnLogin">
          {{ $t('MyAccount.PasswordPolicy.ResetPassword.UseSA') }}
        </p>
        <p v-if="showResetPwdSAForm && ResetPwdSAPINOnLogin">{{ $t('MyAccount.SA.Pin.Label') }}</p>
        <div class="pin container">
          <v-btn v-if="showResetPwdSAForm && ResetPwdSAPINOnLogin" type="submit" @click.stop="sendPINByUsernameAndPassword(!showResetPwdSAForm)" class="primary-btn-blue"><span>{{ $t('MyAccount.SA.Pin.Send') }}</span></v-btn>
          <div class="control-block pin" :class="{ 'filled': pin }">
            <input type="text" v-model.trim="pin" autocomplete="one-time-code" id="single-factor-code-text-field" maxlength="50" />
            <label v-if="showResetPwdSAForm && ResetPwdSAPINOnLogin" class="control-label">{{ $t('MyAccount.SA.Pin.Code') }}</label>
            <label v-else class="control-label">{{ $t('MyAccount.Login.2fa.Pin.Label') }}</label>
          </div>
        </div>
        <div v-if="!(showResetPwdSAForm && ResetPwdSAPINOnLogin)">
          <span v-if="type2fa && (type2fa.toLowerCase() === 'totp2fa' || type2fa.toLowerCase() === 'totp')">
            <span v-html="$t('MyAccount.Login.2fa.Sent.Pin.AuthyApp')"></span>
          </span>
          <span v-else-if="type2fa && (type2fa.toLowerCase() === '2fa' || type2fa.toLowerCase() === 'pin')">
            <span v-html="$t('MyAccount.Login.2fa.Sent.Pin', {channel: getChannel(), sendAgain: !resendPinVisible ? '.' : ' ' + $t('MyAccount.Login.2fa.Sent.Pin.Again.Or') })"></span>
            <span v-if="resendPinVisible">
              <a @click.stop="get2FASilent(sendAgainPIN, newPassword || loginFields.password)">{{ $t('MyAccount.Login.2fa.Sent.Pin.Again') }}</a>.
            </span>
          </span>
          <div v-if="trustDeviceVisible">
            <div class="checkbox-holder">
              <v-checkbox v-model="trustDevice" id="cbTrustDevice" type="checkbox" @change="changeTrust()">
                <span slot="label">
                  {{ $t('MyAccount.Login.2fa.Trust.Device') }}
                </span>
              </v-checkbox>
            </div>
          </div>
          <div v-if="verifiedChannels" class="verified-channels">
            <div @click="verChannels=!verChannels" class="verified-channels__expand">
              <span>{{ $t('Account.Authentication.2fa.Channel.Pin.NotReceiving') }}</span>
              <span v-if="!verChannels"><v-icon class="chevron_down">expand_more</v-icon></span>
              <span v-else><v-icon class="chevron_up">expand_less</v-icon></span>
            </div>

            <div v-if="verChannels" class="verified-channels__content">
              <span v-if="verifiedChannels.length === 1">{{ $t('Account.Authentication.2fa.Channel.Pin.Receiving.OneChannel') }}</span>
              <span v-else></span>
              <div v-for="ch in verifiedChannels">
                <a @click.stop="get2FA(ch, newPassword)">
                  <span v-if="ch.toLowerCase() === 'pin'">{{ $t('Account.Authentication.2fa.Channel.Pin.Receiving.PIN') }}</span>
                  <span v-else-if="ch.toLowerCase() === 'totp'">{{ $t('Account.Authentication.2fa.Channel.Pin.Receiving.TOTP') }}</span>
                  <span v-else>{{ch}}</span>
                  <span></span>
                </a>
              </div>
            </div>
          </div>
        </div>
        <div v-if="formSubmitSppiner"><circle-loader></circle-loader></div>
        <v-btn v-if="!formSubmitSppiner" type="submit" @click.stop="showResetPwdSAForm ? resetPwdSAMode() : loginSA()" :disabled="!pin" block class="primary-btn-blue">
          <span v-if="!(showResetPwdSAForm && ResetPwdSAPINOnLogin)">{{ $t('MyAccount.LogIn') }}</span>
          <span v-else>{{ $t('MyAccount.Proceed') }}</span>
        </v-btn>
      </div>

      <v-flex class="close" v-if="(brandKey === 'dn' || brandKey === 'dnw')" @click="closeLoginDialog()">
        <v-btn flat class="close"><v-icon>close</v-icon></v-btn>
        <p>{{ $t('MyAccount.ContinueAsGuest') }}</p>
      </v-flex>
    </div>
  </div>
</template>
<script>
  import store from '@/store'
  import CircleLoader from '@/components/common/CircleLoader'
  import config from '@/config'
  import Screen from '@/components/mixins/Screen'
  import Branding from '@/components/mixins/Branding'
  import lib from '@/library'
  import mobileBridge from '@/library/mobileBridge'
  import Gtm from '@/components/mixins/Gtm'
  import Logo from '@/components/common/Logo'
  import DatePicker from '@/components/mixins/DatePicker'
  import Validation from '@/components/mixins/Validation'
  import PopupJoinDialog from '../layout/parts/PopupJoinDialog.vue'

  export default {
    name: 'login-component',

    mixins: [
      Screen,
      Branding,
      Gtm,
      DatePicker,
      Validation
    ],
    components: {
      CircleLoader,
      Logo,
      PopupJoinDialog
    },

    data () {
      return {
        autoFillFixInterval: null,
        loginSAObj: {
          pin: null
        },
        errorMessages: {
          newPasswordMissing: { val: false, forInputField: 'newPassword' },
          newPasswordStrength: { val: false, forInputField: 'newPassword' },
          newPasswordSame: { val: undefined, forInputField: 'newPassword' },
          confirmNewPasswordMissing: { val: false, forInputField: 'confirmNewPassword' },
          confirmedNewPasswordNotSame: { val: undefined, forInputField: 'confirmNewPassword' },
          userNameSymbol: false
        },
        newPasswordField: undefined,
        confirmNewPasswordField: undefined,
        showNewPassword: false,
        showConfirmPassword: false,
        resetPwdSubmitSppiner: false,
        resetPwdErrorMessage: null,
        overridenPINExceptionResetPwd: null,
        showResetPwdSAForm: false,
        showSALoginAfterResetPwd: false,
        faceIDstate: (window.ctsautoconf.MOBILE_LS && window.ctsautoconf.APP_BIOMETRICS_AUTOMATIC_LOGIN) ? JSON.parse(localStorage.biometricsState) : false,
        ssn4: null,
        switchColor: undefined,
        trustDeviceField: true,
        resendPinVisible: false,
        saFormSubmitSpinner: false,
        verChannels: false,
        altChannel: null,
        sendAgainPIN: null
      }
    },

    computed: {
      redirect () {
        return this.$route.params.redirect
      },
      loginFields () {
        return store.getters['overlayState/getloginFields']
      },
      customerContext () {
        return store.getters['getCustomerContext']
      },
      loginErrorMessage: {
        get () {
          var result = store.getters['getLoginErrorMessage']

          if (this.brandKey === 'sb' && result && result.trim().toLowerCase() === 'invalid credentials') {
            result = 'There is problem with your Username and/or Password'
          }

          return result
        },
        set () {
          store.commit('setLoginErrorMessage', undefined)
        }
      },
      isLoginButtonDisabled () {
        return !this.loginFields.username || !this.loginFields.password || (this.loginUsernameType === 'UN' && this.errorMessages.userNameSymbol)
      },
      isLoggedIn () {
        return store.getters['isLoggedIn']
      },
      formSubmitSppiner () {
        return store.getters['getFormSubmitSppiner']
      },
      gcInstallerUrl () {
        var gcData = {}
        if (process.env.NODE_ENV === 'development') {
          gcData = {url: 'stg-ums.geocomply.net', id: 'Ac7VjeFkEw'}
          return gcData
        } else if (process.env.NODE_ENV === 'production') {
          gcData = {url: 'ums.geocomply.com', id: 'LW2BYMiQ3R'}
          return gcData
        } else {
          gcData = {url: 'stg-ums.geocomply.net', id: 'Ac7VjeFkEw'}
          return gcData
        }
      },
      navigatorID () {
        if (navigator.appVersion.indexOf('Win') !== -1) {
          return 'win'
        } else if (navigator.appVersion.indexOf('Mac') !== -1) {
          return 'mac'
        } else {
          return undefined
        }
      },
      isOpenedFromWebView () {
        return store.getters['getIsOpenedFromWebView']
      },
      userAgent () {
        return lib.core.userAgent.os.name
      },
      isDebug () {
        return this.$route.query.debug
      },
      state () {
        return config.app.autoconf.STATE
      },
      walletParams () {
        return config.walletParams
      },
      userServiceLogin () {
        return config.walletParams.userServiceLogin
      },
      biometricsAvailability () {
        console.log('biometricsAvailability', store.getters['getBiometricsAvailability'])
        console.log('faceIDstate', this.faceIDstate)
        return store.getters['getBiometricsAvailability']
      },
      biometricsSettings () {
        console.log('biometricsSettings', store.getters['getBiometricsSettings'])
        console.log('faceIDstate', this.faceIDstate)
        return store.getters['getBiometricsSettings']
      },
      initialForm () {
        return !(this.SASecurityQuestionsOnLogin || this.SAPINOnLogin || this.SASQorPINOnLogin || this.SASQandPINOnLogin || this.resetPwd)
      },
      SASecurityQuestionsOnLogin () {
        this.checkBiometricsCredentials()
        return store.getters['getSASecurityQuestionsOnLogin']
      },
      securityQuestionArray () {
        return store.getters['getSASecurityQuestionsArray']
      },
      secretQuestionOne () {
        return this.securityQuestionArray[0] || this.$t('MyAccount.SecurityQuestionOne.Missing')
      },
      secretQuestionTwo () {
        return this.securityQuestionArray[1] || this.$t('MyAccount.SecurityQuestionTwo.Missing')
      },
      SAPINOnLogin () {
        this.checkBiometricsCredentials()
        return store.getters['getSAPINOnLogin']
        // return true
      },
      pin: {
        get () {
          return this.loginSAObj.pin || this.pinVerifyLogin2fa || undefined
        },
        set (value) {
          this.loginSAObj.pin = value
        }
      },
      saMode () {
        return store.getters['getSAMode']
      },
      SASQorPINOnLogin () {
        this.checkBiometricsCredentials()
        return store.getters['getSASQorPINOnLogin']
      },
      SASQandPINOnLogin () {
        this.checkBiometricsCredentials()
        return store.getters['getSASQandPINOnLogin']
      },
      MobilelocalServer () {
        return window.ctsautoconf.MOBILE_LS || false
      },
      noSA: () => store.getters['getIsNoSA'],
      overridenPINException () {
        let override = store.getters['getOverridenPINException']
        if (override) {
          this.loginErrorMessage = false
          return this.$t('Account.Join.OverridenPINMessage')
        }
      },
      pwdPolicy () {
        return store.getters['getPwdPolicy']
      },
      resetPwd () {
        return this.pwdPolicy === 'reset'
      },
      resetPwdForm () {
        return this.resetPwd && !(this.showResetPwdSAForm || this.showSALoginAfterResetPwd)
      },
      noPwdSA () {
        return store.getters['getNoPwdSA']
      },
      isChangePasswordButtonDisabled () {
        return !this.newPassword || !this.confirmNewPassword
      },
      newPassword: {
        get () {
          return this.newPasswordField
        },
        set (value) {
          if (value.length === 0) {
            this.errorMessages.newPasswordMissing.val = true
            this.errorMessages.newPasswordStrength.val = undefined
          } else {
            this.errorMessages.newPasswordMissing.val = false
            if (!value.match(this.vldPasswordSpecialChar) || (value.length > 0 && value.length < this.vldPasswordMinLength)) {
              this.errorMessages.newPasswordStrength.val = true
            } else {
              this.errorMessages.newPasswordStrength.val = undefined
            }
            if (value === this.loginFields.password) {
              this.errorMessages.newPasswordSame.val = true
            } else {
              this.errorMessages.newPasswordSame.val = false
            }
            if (this.confirmNewPassword && (value !== this.confirmNewPassword)) {
              this.errorMessages.confirmedNewPasswordNotSame.val = true
            } else {
              this.errorMessages.confirmedNewPasswordNotSame.val = false
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
            this.errorMessages.confirmNewPasswordMissing.val = true
            this.errorMessages.confirmedNewPasswordNotSame.val = false
          } else {
            this.errorMessages.confirmNewPasswordMissing.val = false
            if (this.newPassword && (value !== this.newPassword)) {
              this.errorMessages.confirmedNewPasswordNotSame.val = true
            } else {
              this.errorMessages.confirmedNewPasswordNotSame.val = false
            }
          }
          this.confirmNewPasswordField = value
        }
      },
      pwdResetMode () {
        return store.getters['getPwdResetMode']
      },
      ResetPwdSASecurityQuestionsOnLogin () {
        return store.getters['getResetPwdSASecurityQuestionsOnLogin']
      },
      ResetPwdSAPINOnLogin () {
        return store.getters['getResetPwdSAPINOnLogin']
      },
      ResetPwdSASQorPINOnLogin () {
        return store.getters['getResetPwdSASQorPINOnLogin']
      },
      ResetPwdSASQandPINOnLogin () {
        return store.getters['getResetPwdSASQandPINOnLogin']
      },
      biometricsSettignsParam () {
        return window.ctsautoconf.APP_BIOMETRICS_AUTOMATIC_LOGIN
      },
      accountIsLocked () {
        return store.getters['getAccountIsLocked'] || false
      },
      ssn4IsInvalid () {
        return !this.ssn4 || this.ssn4.length !== 4 || Boolean(this.ssn4.match(/\D/g))
      },
      disableJoin () {
        return window.ctsautoconf.DISABLE_JOIN_BUTTON
      },
      mobileUsernameAndPassword () {
        return store.getters['getMobileUsernameAndPassword']
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
      },
      type2fa () {
        return store.getters['getType2fa']
      },
      trust2fa () {
        return store.getters['getTrust2fa']
      },
      sent2fa () {
        return store.getters['getSent2fa']
      },
      trustDevice: {
        get () {
          if (!('trustDevice' in localStorage)) {
            localStorage.setItem('trustDevice', this.trustDeviceField)
          }
          this.trustDeviceField = JSON.parse(localStorage.getItem('trustDevice'))
          return this.trustDeviceField
        },
        set (value) {
          this.trustDeviceField = value
          localStorage.setItem('trustDevice', value)
        }
      },
      trustDeviceVisible () {
        let tdVisible = this.type2fa && (this.type2fa.toLowerCase() === '2fa' || this.type2fa.toLowerCase() === 'totp2fa') && !this.trust2fa
        return tdVisible
      },
      pinVerifyLogin2fa () {
        return store.getters['getPinVerifyLogin2fa']
      },
      enterPinTitleVisible () {
        let ePinTitleVisible = this.SAPINOnLogin && (!this.resetPwd || (this.resetPwd && this.showSALoginAfterResetPwd && !this.showResetPwdSAForm))
        if (ePinTitleVisible) {
          this.resendPinVisibility()
        }
        return ePinTitleVisible
      },
      sentInfo2fa () {
        return store.getters['getSentInfo2fa']
      },
      verifiedChannels () {
        let channels = store.getters['getVerifiedChannels']
        let splittedChannels = channels && channels.split(',')
        return splittedChannels
      }
    },
    methods: {
      passwordAutoFillFix () {
        this.autoFillFixInterval = setInterval(() => {
          let passwordLabel = document.querySelectorAll('.login-component .password label')[0]
          let passwordLabelActivated = document.querySelectorAll('.login-component .password label.v-label--active')[0]
          let passwordInput = document.querySelectorAll('.login-component .password input:-webkit-autofill')[0]

          if (passwordInput || passwordLabelActivated) {
            passwordInput && passwordLabel.classList.add('v-label--active')
            clearInterval(this.autoFillFixInterval)
          }
        }, 100)
      },
      appInstall () {
        this.closeLoginDialog()
        if (this.userAgent === 'android') {
          this.$router.push({name: 'android'})
        } else {
          this.$router.push({name: 'app'})
        }
      },
      closeLoginDialog () {
        this.sendGTMClickEvent('login', 'close login dialog', 'close-login-btn', 'login dialog')
        store.dispatch('overlayState/deactivateLoginDialog')
        store.dispatch('overlayState/deactivateMyAccountDialog')
        store.dispatch('overlayState/deactivateWelcomeDialog')
        store.commit('setSASecurityQuestionsOnLogin', false)
        store.commit('setSAPINOnLogin', false)
        store.commit('setSASQorPINOnLogin', false)
        store.commit('setSASQandPINOnLogin', false)
        store.commit('setSASecurityQuestionsOnLogin', false)
        store.commit('setSAPINOnLogin', false)
        store.commit('setSASQorPINOnLogin', false)
        store.commit('setSASQandPINOnLogin', false)
        store.commit('setOverridenPINException', false)
        clearInterval(this.autoFillFixInterval)

        // related to the reset pwd on login
        store.commit('setPwdPolicy', undefined)
        store.commit('setPwdResetMode', undefined)
        store.commit('setPwdDays', undefined)
        store.commit('setResetPwdSASecurityQuestionsOnLogin', undefined)
        store.commit('setResetPwdSAPINOnLogin', undefined)
        store.commit('setResetPwdSASQorPINOnLogin', undefined)
        store.commit('setResetPwdSASQandPINOnLogin', undefined)
        store.commit('setFormSubmitSppiner', false)
        this.showResetPwdSAForm = false
        this.showSALoginAfterResetPwd = false
        sessionStorage.removeItem('displayAlertResetPasswordOverlayMsg')
        sessionStorage.removeItem('AlertResetPasswordDaysLeft')
        localStorage.removeItem('passwordAlertPolicy')
        store.commit('messageCenter/setPasswordAlertPolicy', false)
        store.commit('setAccountIsLocked', false)
        store.commit('setPinVerifyLogin2fa', null)
        // end
      },
      getSAByUsernameAndPassword () {
        store.dispatch('getSAByUsernameAndPassword', {
          'username': this.loginFields.username,
          'password': this.loginFields.password
        })
        this.loginErrorMessage = undefined
      },
      get2FA (channel, pwd) {
        let self = this
        store.commit('setFormSubmitSppiner', true)
        self.altChannel = channel
        if (channel) {
          self.pin = null
          this.sendAgainPIN = channel
        }
        setTimeout(() => {
          store.dispatch('get2FA', {
            'username': self.loginFields.username || (self.mobileUsernameAndPassword && self.mobileUsernameAndPassword.username),
            'password': pwd || self.loginFields.password || (self.mobileUsernameAndPassword && self.mobileUsernameAndPassword.password),
            'channel': channel
          }).finally(() => {
            store.commit('setFormSubmitSppiner', false)
            self.verChannels = false
          })
        }, 0)
        self.loginErrorMessage = undefined
      },
      get2FASilent (channel, pwd) {
        let self = this
        self.resendPinVisible = false
        self.pin = null
        self.resendPinVisibility()
        store.dispatch('get2FASilent', {
          'username': self.loginFields.username || (self.mobileUsernameAndPassword && self.mobileUsernameAndPassword.username),
          'password': pwd || (self.mobileUsernameAndPassword && self.mobileUsernameAndPassword.password),
          'channel': channel
        })
      },
      logout () {
        store.dispatch('logout')
      },
      toggleShowPassword () {
        this.loginFields.showPassword = !this.loginFields.showPassword
      },
      redirectToDefaultPage () {
        var redirect = this.redirect || config.app.loginRedirectPage || ''
        console.log('redirect: ' + redirect)
        this.$router.push({name: redirect, params: { }})
      },
      pluginDownload () {
        window.location = 'https://' + this.walletParams.installerURL + '/installer/url?id=' + this.walletParams.installerKey + '&os=' + this.navigatorID + '&version=' + this.walletParams.geocomplyPluginVersion
      },
      clearPasswordField () {
        if (this.loginFields.password) {
          this.loginFields.password = ''
        }
      },
      goToRegistrationPage () {
        this.$router.push({name: 'account-joinUs'})
        this.sendGTMClickEvent('register', 'open registration page', 'join-btn', 'login dialog')
        this.closeLoginDialog()
      },
      goToForgottenPasswordPage () {
        this.$router.push({name: 'reset-password'})
        this.closeLoginDialog()
      },
      readBiometricsData () {
        mobileBridge.bridgeSendRequest('readData')
      },
      readBiometricsSettigns () {
        mobileBridge.bridgeSendRequest('biometricsSettigns')
      },
      loginSA () {
        /* if (this.isEverythingValid()) {
          this.loginErrorMessage = undefined
          store.commit('setOverridenPINException', false)
          store.dispatch('loginSA', {
            'username': this.loginFields.username || this.mobileUsernameAndPassword.username,
            'password': this.resetPwd ? this.newPassword || this.mobileUsernameAndPassword.password : this.loginFields.password,
            'answers': [this.securityAnswer1 || this.securityAnswer1ModeThree || this.securityAnswer1ModeFour, this.securityAnswer2 || this.securityAnswer2ModeThree || this.securityAnswer2ModeFour],
            'PIN': this.pin
          })
        } */
        let self = this
        self.loginErrorMessage = undefined
        store.commit('setOverridenPINException', false)
        store.dispatch('login2FA', {
          'username': self.loginFields.username || (self.mobileUsernameAndPassword && self.mobileUsernameAndPassword.username),
          'password': self.newPassword || self.loginFields.password || (self.mobileUsernameAndPassword && self.mobileUsernameAndPassword.password),
          'PIN': (self.type2fa && (self.type2fa.toLowerCase() === 'totp2fa' || self.type2fa.toLowerCase() === 'totp')) ? 'TOTP:' + self.pin : self.pin,
          'Trust': self.trustDeviceVisible ? self.trustDevice : self.trust2fa,
          'Channel': self.altChannel
        })
      },
      changePasswordFieldValid () {
        let errors = this.errorMessages.newPasswordMissing.val ||
          this.errorMessages.newPasswordStrength.val ||
          this.errorMessages.newPasswordSame.val ||
          this.errorMessages.confirmNewPasswordMissing.val ||
          this.errorMessages.confirmedNewPasswordNotSame.val
        return !errors
      },
      sendPINByUsernameAndPassword (is4Login) {
        let self = this
        self.resetPwdErrorMessage = undefined
        self.loginErrorMessage = undefined
        store.commit('setOverridenPINException', false)
        self.overridenPINExceptionResetPwd = undefined
        self.pin = null
        let password = (self.resetPwd && is4Login) ? self.newPassword : self.loginFields.password
        store.dispatch('sendPINByUsernameAndPassword', {
          'username': self.loginFields.username || (self.mobileUsernameAndPassword && self.mobileUsernameAndPassword.password),
          'password': password || (self.mobileUsernameAndPassword && self.mobileUsernameAndPassword.password),
          'is4Login': is4Login
        })
      },
      clearForm () {
        this.loginSAObj.pin = undefined
        this.newPasswordField = undefined
        this.confirmNewPasswordField = undefined
      },
      checkBiometricsCredentials () {
        if (this.MobilelocalServer) {
          let getCredentials = mobileBridge.getUserCredentials()
          if (getCredentials) {
            this.loginFields.username = getCredentials.username
            this.loginFields.password = getCredentials.password
          }
        }
      },
      resetPwdSA () {
        let self = this
        if (self.changePasswordFieldValid()) {
          self.resetPwdSubmitSppiner = true
          self.resetPwdErrorMessage = undefined
          if (self.pwdResetMode === 0) { // if there is no reset password strong auth then reset pwd
            store.dispatch('resetPwdSA', {
              'username': self.loginFields.username || (self.mobileUsernameAndPassword && self.mobileUsernameAndPassword.username),
              'pwdold': self.loginFields.password || (self.mobileUsernameAndPassword && self.mobileUsernameAndPassword.password),
              'pwdnew': self.newPassword,
              'answers': [],
              'PIN': null,
              'ssn4': this.ssn4,
              'dob': this.dateOfBirth
            }).then(response => {
              if (!self.type2fa) { // if there is no login sa then automatic login after reset pwd
                let faceId = (window.ctsautoconf.MOBILE_LS && window.ctsautoconf.APP_BIOMETRICS_AUTOMATIC_LOGIN) ? JSON.parse(localStorage.biometricsState) : false
                let params = {'username': self.mobileUsernameAndPassword.username, 'password': self.newPassword}
                if (faceId) store.commit('setMobileUsernameAndPassword', params)
                self.loginSA()
                // self.showResetPwdSAForm = false
                // self.showSALoginAfterResetPwd = false
              } else {
                self.get2FASilent(self.newPassword)
                self.showResetPwdSAForm = false
                self.showSALoginAfterResetPwd = true
              }
            }).catch((error) => {
              self.resetPwdErrorMessage = (error && error.error && error.error.Message) || (error && error.message) || 'Reset password failed. Unknown error occurred'
              console.log(error)
            }).finally(() => {
              self.resetPwdSubmitSppiner = false
            })
          } else { // if (self.pwdResetMode !== 0) {
            self.showResetPwdSAForm = true
            self.showSALoginAfterResetPwd = false
            self.resetPwdSubmitSppiner = false
          }
        }
      },
      resetPwdSAMode () {
        let self = this
        // self.resetPwdSubmitSppiner = true
        store.commit('setFormSubmitSppiner', true)
        self.resetPwdErrorMessage = undefined
        self.showSALoginAfterResetPwd = false
        self.overridenPINExceptionResetPwd = undefined
        if (self.pwdResetMode !== 0) {
          store.dispatch('resetPwdSA', {
            'username': self.loginFields.username || (self.mobileUsernameAndPassword && self.mobileUsernameAndPassword.username),
            'pwdold': self.loginFields.password || (self.mobileUsernameAndPassword && self.mobileUsernameAndPassword.password),
            'pwdnew': self.newPassword,
            'answers': [],
            'PIN': self.pin
          }).then(response => {
            if (!self.type2fa) { // (self.saMode === 1 && self.pwdResetMode === 1) to be removed
              self.loginSA()
              // self.showResetPwdSAForm = false
              // self.showSALoginAfterResetPwd = false
            } else {
              self.get2FASilent(self.newPassword)
              self.showResetPwdSAForm = false
              self.pin = null
              self.showSALoginAfterResetPwd = true
            }
          }).catch((error) => {
            if (error && error.exceptionType === 'MissingOrExpiredPinException') {
              self.overridenPINExceptionResetPwd = this.$t('Account.Join.OverridenPINMessage')
            } else {
              self.resetPwdErrorMessage = (error && error.error && error.error.Message) || (error && error.message) || 'Reset password failed. Unknown error occurred'
            }
            console.log(error)
          }).finally(() => {
            // self.resetPwdSubmitSppiner = false
            store.commit('setFormSubmitSppiner', false)
          })
        }
      },
      toggleShowNewPassword () {
        this.showNewPassword = !this.showNewPassword
      },
      toggleShowConfirmPassword () {
        this.showConfirmPassword = !this.showConfirmPassword
      },
      faceIdChangeState (state) {
        localStorage.biometricsState = state
        this.faceIDstate = state
        mobileBridge.bridgeSendRequest('biometricsSettingsState', state.toString())
      },
      go2ChangePasswordPage () {
        if (this.$route.name !== 'reset-password') {
          this.$router.push({name: 'reset-password'})
          this.closeLoginDialog()
        }
      },
      switchColors () {
        switch (this.brandKey) {
          case 'sb':
            this.switchColor = '#00001a'
            break
          default:
            this.switchColor = '#82b1ff'
        }
      },
      joinAction () {
        if (this.disableJoin) {
          this.closeLoginDialog()
          setTimeout(() => {
            store.dispatch('overlayState/activateJoinDialog')
          }, 0)
          return false
        }
        this.goToRegistrationPage()
      },
      changeTrust () {
        localStorage.setItem('trustDevice', this.trustDeviceField)
      },
      getChannel () {
        let channel, sentToPhone, sentToEmail, channelDetails
        channelDetails = this.sentInfo2fa
        let splittedChannelDetails = channelDetails && channelDetails.split('|')
        if (splittedChannelDetails && splittedChannelDetails.length > 1) {
          sentToPhone = splittedChannelDetails[0]
          sentToEmail = splittedChannelDetails[1]
        }
        switch (this.sent2fa) {
          case 1:
            channel = ' ' + this.$t('MyAccount.Login.2fa.Sent.Pin.Phone', {phone: sentToPhone || channelDetails})
            break
          case 2:
            channel = ' ' + this.$t('MyAccount.Login.2fa.Sent.Pin.Email', {email: sentToEmail || channelDetails})
            break
          case 3:
            channel = ' ' + this.$t('MyAccount.Login.2fa.Sent.Pin.PhoneEmail', {phone: sentToPhone, email: sentToEmail})
            break
          default:
            channel = ''
            break
        }
        return channel
      },
      getChannelTranslationSuffix () {
        let tSfx = ''
        switch (this.sent2fa) {
          case 1: tSfx = '.Phone'; break
          case 2: tSfx = '.Email'; break
          case 3: tSfx = '.PhoneEmail'; break
          default: tSfx = ''; break
        }
        return tSfx
      },
      resendPinVisibility () {
        setTimeout(() => {
          this.resendPinVisible = true
        }, 10000)
      }
    },
    beforeDestroy () {
      store.commit('setSASecurityQuestionsOnLogin', false)
      store.commit('setSAPINOnLogin', false)
      store.commit('setSASQorPINOnLogin', false)
      store.commit('setSASQandPINOnLogin', false)
      store.commit('setResetPwdSASecurityQuestionsOnLogin', undefined)
      store.commit('setResetPwdSAPINOnLogin', undefined)
      store.commit('setResetPwdSASQorPINOnLogin', undefined)
      store.commit('setResetPwdSASQandPINOnLogin', undefined)
      store.commit('setPinVerifyLogin2fa', null)
    },
    beforeMount () {
      if (config.app.autoconf.LOGIN_USERNAME_PERSIST && window.ctsautoconf.MOBILE_LS) {
        mobileBridge.bridgeSendRequest('getKeyValue', 'username')
        setTimeout(() => {
          this.$refs.username.$el.focus()
        }, 200)
      }
    },
    mounted () {
      if (this.$route.name === 'logout') {
        this.logout()
      } else {
        if (this.isLoggedIn) {
          this.redirectToDefaultPage()
        }
      }
      setTimeout(() => {
        document.querySelectorAll('.login-component .username input')[0].focus()
      }, 10)
      if (!this.isLoggedIn && window.ctsautoconf.MOBILE_LS) {
        mobileBridge.bridgeSendRequest('checkAvailability')
      }
      this.passwordAutoFillFix()
      if (this.biometricsSettignsParam) {
        this.switchColors()
      }
      store.commit('setPinVerifyLogin2fa', null)
      if (!this.isLoggedIn) {
        let temporaryusername = store.getters['getTemporaryUsername']
        let temporaryPassword = store.getters['getTemporaryPassword']

        if (temporaryusername && temporaryPassword) {
          this.loginFields.username = temporaryusername
          this.loginFields.password = temporaryPassword
          store.commit('setTemporaryUsername', null)
          store.commit('setTemporaryPassword', null)
          temporaryusername = null
          temporaryPassword = null
        }
      }
    },
    watch: {
      customerContext () {
        let isCustomerVerified = store.getters['getIsCustomerVerified']
        let self = this
        if (isCustomerVerified) {
          self.redirectToDefaultPage()
        } else if (self.$router.currentRoute.name !== 'account-non-verified') {
          setTimeout(function () {
            self.$router.push({name: 'account-non-verified'})
            store.dispatch('overlayState/deactivateMyAccountDialog')
            store.dispatch('overlayState/deactivateBetslip')
          }, 1000)
        }
      }
      // loginErrorMessage (value) {
      //   if (value) {
      //     this.clearForm()
      //   }
      // }
    }
  }
</script>
<style lang="stylus" scoped>
  @import "~@/css/config"

  .login-component
    background: white
    text-align: center
    padding-top: 10px
    display flex
    @media mobile-big-and-below
      padding-top: 0
      display block

    .flex.logo
      margin 0 0 0 10px
      justify-content flex-start
      display flex
    .flex.close
      display block
    p
      margin-top: 10px
      margin-bottom: 0
    p a
     color: #06283b
     font-weight: bold
     text-decoration: underline

    p a:hover
     color: #2396FC

    .float-left
      text-align: left

    .float-right
      text-align: right

    .float-right span
      color: #2396FC
      display:block
      margin-top: 6px

    .input-group
      margin: 0

    .username
      margin: 0
    .password
      margin: 0

    .errormsg
      cursor: default
      color: #ff5656
      font-weight: bold
      font-size: 11px
      display: block
      position: relative
      top: -5px
      text-align: left
      line-height: 20px


    .error
      border: 1px solid #E24447 !important
      background: rgba(226, 68, 71, 0.1) !important
      color: #E24447
      font-weight: normal
      border-radius: 2px
      min-height: 60px
      margin: 0
      font-size: 12px
      display: flex
      justify-content: center
      align-items: center
      padding 4px
      margin-top 18px
      margin-bottom 14px

    .show_hide
      float: right
      margin: -30px 0px 0 5px
      z-index: 100
      position: relative
      color: #0b4da1
      text-transform: uppercase
      cursor: pointer
      font-size: 11px

    .header
      padding: 20px 0 0 0
      background: #fff
      border-radius: 4px 4px 0 0
      .title
        text-align: left
        padding: 0 20px

      h1
        margin: 0
        text-transform: uppercase
        font-size: 28px
        line-height: 36px
      .buttons
        .primary-btn-blue
          background-color #1976d2

    .close
      flex-grow: 0
      .close
        color #1f375b
        margin -35px 0 0 0
        padding 0
      @media mobile-big-and-below
        display: block

      .btn
        min-width: 0
        position: absolute
        top: 9px
        right: 4px
        width: 20px
        height: 20px
        // margin: 10px
        color: #1F375B
        >>>.btn__content
          padding: 0

    form
      padding: 0px 20px 20px
      margin: -1px 0 0 0
      border-radius: 0 0 4px 4px

    .terms-and-conditions
      .text-label-register
        font-size 12px
        font-weight 400

    @media mobile-big-and-below
      height: 100%
      background: #fff
      padding: 16px !important
      .header
        padding: 0 !important
        margin-top: -15px
        .title
          padding: 0

      .error
        margin-top:10px

      .tc
        margin-top: 10px
        text-align: left

      p
        font-size: 14px

      form
        padding: 0px !important
        height: auto

      .logo img
        float: left
        max-height: 24px

.login-gelocation-info
  font-size: 12px
  line-height: 17px
  text-align: left
  .login-note
    font-weight: bold
  p
    margin-top: 0px
  .gc-plugin
    margin: 0 -16px
    padding: 16px
    background: #fff
    color: #818E95
    @media tablet-and-above
      margin-top 5px
  .gc-link
    display: block
    margin-top: 10px

.login-gelocation-info-desktop
  font-size: 12px
  line-height: 17px
  text-align: left
  .login-note
    font-weight: bold
  p
    margin-top: 0px
  .gc-plugin-desktop
    background: #cfd6db
    color: #06283b
    padding: 12px 20px 20px 20px
    border-radius: 0 0 4px 4px
    .gc-info
      font-size: 12px
      font-weight: normal
      font-style: normal
      font-stretch: normal
      color: #06283b
    .btn-white
      background-color: #ffffff
      color: #1493ff
      font-size: 14px
      font-weight: bold !important
      line-height: normal
      margin-top: 12px
      margin-bottom: -34px
      height: 48px
      span
        font-weight: normal !important


  .gc-link
    display: block

.form-normal
  border-radius 0px !important
.securityquestion
  padding 10px
.ctsform.sa
  padding 15px
.pin.container
  display flex
  justify-content space-between
.control-block.pin
  display inline-block
.loginHolder
  flex 1
.login-header
  padding-bottom 10px
.loginDialogIntro
  background #0b4da1
  display: flex
  margin-top -10px
  flex 1
  justify-content center
  align-items center
  position relative
  .joinNow
    position absolute
    bottom 20px
    right 20px
    border-radius 25px
    background #ffffff
    color #0b4da1
  .login-intro
    color #fff
    text-align left
    padding 10px 20px
    .small
      font-size 16px
      text-transform uppercase
      letter-spacing 2px
    .big
      font-size 80px
      line-height 70px
      font-family 'Open Sans ExtraBold'
      text-transform uppercase
      letter-spacing 5px

>>>.v-text-field__details
  display none

>>>.logo
  img
    max-width 150px !important
>>>.v-text-field
    .v-label
      bottom 2px
      top unset
      text-transform uppercase
      color #000
>>>.v-label--active
  color #0b4da1 !important
  top 20px !important
  bottom unset
>>>.v-btn.primary-btn-blue
  border-radius 25px
  margin-left: auto
  display: flex
>>>.v-btn--block
  width auto
.close
  margin 0 10px
  .v-icon
    font-size 35px
    color #0b4da1
  >>>.v-btn
    min-width auto
  button
    width 15px
    &:before
      display none
    >>>.v-btn__content
      margin 0 10px
    >>>.v-ripple__container
      display none

.pin.container
  margin: 20px 0 30px
  justify-content: flex-start
  .v-btn
    margin: 0

.pin-or-sq
  h1
    text-align center
  h3
    text-align justify
    padding 0 10px
  .or
    text-align: center
    font-size: 30px
    margin: 48px 0

.faceBtn
  text-align center
  margin 0
.faceId
  white-space normal
  text-size-adjust none
.invmsg
  top: 5px
.resetpwd-intro
  text-align justify
  font-size 14px
.resetpwd-intro-sa
  text-align justify
  font-size 14px
  margin-bottom: 10px !important
.lockedAccount
    border: 1px solid #E24447 !important
    background: rgba(226, 68, 71, 0.1) !important
    color: #E24447
    font-weight: normal
    border-radius: 2px
    min-height: 60px
    margin: 0
    font-size: 12px
    display: block
    justify-content: center
    align-items: center
    padding 11px
    margin-top 18px
    margin-bottom 14px
  .here
    font-family:  'Open Sans Bold'
    cursor pointer
    text-decoration: underline
  .nosa-ssn4-dob
    .control-label
      padding-left 5px
      margin-top 5px
.accent--text
  color: red !important
.input__label
  color: black !important
.noChannel
  text-align left
  font-size 11px
.verified-channels
  background-color: #d2d2d2
  margin: 5px 0
  .verified-channels__expand
    display: flex
    justify-content: center
    align-items: center
    padding: 5px 10px
    cursor: pointer
    position relative
    :nth-child(2)
      position absolute
      right 3px
  .verified-channels__content
    padding: 5px 10px
    text-align: center
</style>
