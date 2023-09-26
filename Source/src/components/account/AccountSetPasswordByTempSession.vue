<template>
  <div class="set-password ctsform">
    <h1 key="rp_ChangePassword">{{ $t('Account.ChangePassword.Heading') }}</h1>
    <div class="control-block" :class="{ 'filled': newPassword }">
      <input :type="showNewPassword ? 'text' : 'password'" v-model="newPassword" autocomplete="off" :maxlength="vldPasswordMaxLength" @focusout="!newPasswordField ? errorMessages.newPassMissing = true : errorMessages.newPassMissing = false"/>
      <label class="control-label" key="rp_newPassword_label">{{ $t('Account.ChangePassword.NewPassword') }}</label>
      <span class="show_hide" @click.stop="toggleShowNewPassword()">{{ showNewPassword ? 'Hide' : 'Show' }}</span>
    </div>
    <div>
      <div class="vmsg invalid" v-if="errorMessages.newPassMissing" key="rp_newPasswordMissing_error">{{ $t('Account.ChangePassword.ErrorMessages.NewPasswordMissing') }}</div>
      <div class="vmsg invalid" v-if="errorMessages.newPassStrength" key="pasl" v-html="$t('Account.Join.ErrorMsg.PassStrength', {pwdMinLength: vldPasswordMinLength})"></div>
    </div>
    <div class="control-block" :class="{ 'filled': confirmNewPassword }">
      <input :type="showConfirmPassword ? 'text' : 'password'" v-model="confirmNewPassword" autocomplete="off" :maxlength="vldPasswordMaxLength" @focusout="!confirmNewPasswordField ? errorMessages.confirmNewPassMissing = true : errorMessages.confirmNewPassMissing = false"/>
      <label class="control-label" key="rp_confirmNewPassword_label">{{ $t('Account.ChangePassword.ConfirmNewPassword') }}</label>
      <span class="show_hide" @click.stop="toggleShowConfirmPassword()">{{ showConfirmPassword ? 'Hide' : 'Show' }}</span>
    </div>
    <div>
      <div class="vmsg invalid" v-if="errorMessages.confirmNewPassMissing" key="rp_confirmNewPassword_Missing_error">{{ $t('Account.ChangePassword.ErrorMessages.ConfirmNewPassword.Missing') }}</div>
      <div class="vmsg invalid" v-if="errorMessages.confirmedNewPassNotSame" key="rp_confirmNewPassword_NotSamePass_error">{{ $t('Account.ChangePassword.ErrorMessages.ConfirmNewPassword.NotSame') }}</div>
    </div>
    <!-- force SSN4 & DOB when SA is not enabled-->
    <div v-if="isSAModeZero">
      <!-- SSN -->
      <div class="control-block" :class="{ 'filled': ssn }">
        <input type="text" inputmode="numeric" v-model="ssn" autocomplete="off" :maxlength="4"/>
        <label class="control-label">{{ $t('Account.Join.Last4SSN') }}</label>
      </div>
      <div>
        <div class="vmsg invalid" v-if="errorMessages.ssnNotDigit" id="err_msg_ssn_not_digit">{{$t('Account.Join.ErrorMsg.Last4SSNNonDigit')}}</div>
        <div class="vmsg invalid" v-if="errorMessages.ssnMissing" id="err_msg_ssn_miss">{{$t('Account.Join.ErrorMsg.Last4SSN')}}</div>
      </div>
      <!-- DATE OF BIRTH -->
      <div class="control-block" :class="{ 'filled': dateOfBirth }" @click="onDateBirth">
        <v-menu
            ref="datePickerMenu"
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
          >
          <template slot="activator">
            <input type="text" v-model.trim="formattedDate" id="dateOfBirth" autocomplete="off" readonly name="reg-dob" />
            <label class="control-label">{{ $t('Account.Join.DOB') }}</label>
          </template>
          <v-date-picker ref="picker" :max="maxDate" @change="checkDateOfBirth()" v-model="dateOfBirthProp" no-title scrollable></v-date-picker>
        </v-menu>
      </div>
      <div class="vmsg invalid" v-if="errorMessages.dobMissing" id="err_msg_dateOfBirth_missing">{{ $t('Account.Join.ErrorMsg.MissingDOB') }}</div>
    </div>
    <div class="ctsform sa" v-if="isSAModeOne">
      <form>
        <!-- SECURITY QUESTION 1 -->
        <div class="securityquestion">{{secretQuestionOne}}</div>
        <!-- SECURITY ANSWER 1 -->
        <div class="control-block" :class="{ 'filled': securityAnswer1 }">
          <input type="text" v-model.trim="securityAnswer1" autocomplete="off" maxlength="50" @focusout="!passwordSAObj.securityAnswer1 ? errorMessages.securityAnswer1 = true : errorMessages.securityAnswer1 = false"/>
          <label class="control-label">{{ $t('Account.Join.SecurityAnswer1') }}</label>
        </div>
        <!-- SECURITY ANSWER 1 VALIDATION -->
        <div>
          <div class="vmsg invalid" v-if="errorMessages.securityAnswer1" v-html="$t('Account.Join.ErrorMsg.SecurityAnswer1')"></div>
          <div class="vmsg invalid" v-if="errorMessages.securityAnswer1Length" v-html="$t('Account.Join.ErrorMsg.SecurityAnswer1Length')"></div>
        </div>
        <!-- SECURITY QUESTION 2 -->
        <div class="securityquestion">{{secretQuestionTwo}}</div>
        <!-- SECURITY ANSWER 2 -->
        <div class="control-block" :class="{ 'filled': securityAnswer2 }">
          <input type="text" v-model.trim="securityAnswer2" autocomplete="off" maxlength="50" @focusout="!passwordSAObj.securityAnswer2 ? errorMessages.securityAnswer2 = true : errorMessages.securityAnswer2 = false"/>
          <label class="control-label">{{ $t('Account.Join.SecurityAnswer2') }}</label>
        </div>
        <!-- SECURITY ANSWER 2 VALIDATION -->
        <div>
          <div class="vmsg invalid" v-if="errorMessages.securityAnswer2" v-html="$t('Account.Join.ErrorMsg.SecurityAnswer2')"></div>
          <div class="vmsg invalid" v-if="errorMessages.securityAnswer2Length" v-html="$t('Account.Join.ErrorMsg.SecurityAnswer2Length')"></div>
        </div>
      </form>
    </div>
    <div class="account-page ctsform sa mode-two" v-if="isSAModeTwo">
      <p>{{ $t('MyAccount.SA.Pin.Label') }}</p>
      <div class="pin container">
        <v-btn type="submit" @click.stop="sendPINByTempSession()" class="primary-btn-blue"><span>{{ $t('MyAccount.SA.Pin.Send') }}</span></v-btn>
        <div class="control-block pin" :class="{ 'filled': pin }">
          <input type="text" v-model.trim="pin" autocomplete="off" maxlength="50" @focusout="!passwordSAObj.saPin ? errorMessages.pin = true : errorMessages.pin = false"/>
          <label class="control-label">{{ $t('MyAccount.SA.Pin.Code') }}</label>
        </div>
      </div>
      <div class="vmsg invalid pin" v-if="errorMessages.pin">{{ $t('Account.ChangePassword.ErrorMessages.PIN.Missing') }}</div>
    </div>
    <!-- Mode 3 PIN or Security questions-->
    <div class="account-page ctsform sa pin-or-sq" v-if="isSAModeThree">
      <h3>{{ $t('MyAccount.SA.PinOrSA.LineOne') }}</h3>
      <!-- SECURITY QUESTION 1 -->
      <div class="securityquestion">{{secretQuestionOne}}</div>
      <!-- SECURITY ANSWER 1 -->
      <div class="control-block" :class="{ 'filled': securityAnswer1ModeThree }">
        <input type="text" v-model.trim="securityAnswer1ModeThree" autocomplete="off" maxlength="50"/>
        <label class="control-label">{{ $t('Account.Join.SecurityAnswer1') }}</label>
      </div>
      <!-- SECURITY QUESTION 2 -->
      <div class="securityquestion">{{secretQuestionTwo}}</div>
      <!-- SECURITY ANSWER 2 -->
      <div class="control-block" :class="{ 'filled': securityAnswer2ModeThree }">
        <input type="text" v-model.trim="securityAnswer2ModeThree" autocomplete="off" maxlength="50"/>
        <label class="control-label">{{ $t('Account.Join.SecurityAnswer2') }}</label>
      </div>
      <h1 class="or">{{ $t('MyAccount.SA.PinOrSA.LineTwo') }}</h1>
      <h3>{{ $t('MyAccount.SA.PinOrSA.PIN') }}</h3>
      <div class="pin container">
        <v-btn type="submit" @click.stop="sendPINByTempSession()" class="primary-btn-blue"><span>{{ $t('MyAccount.SA.Pin.Send') }}</span></v-btn>
        <div class="control-block pin" :class="{ 'filled': pin }">
          <input type="text" v-model.trim="pin" autocomplete="off" maxlength="50"/>
          <label class="control-label">{{ $t('MyAccount.SA.Pin.Code') }}</label>
        </div>
      </div>
    </div>
    <!-- Mode 4 PIN and Security questions-->
    <div class="account-page ctsform sa pin-and-sq" v-if="isSAModeFour">
      <h3>{{ $t('MyAccount.SA.PinOrSA.LineOne') }}</h3>
      <!-- SECURITY QUESTION 1 -->
      <div class="securityquestion">{{secretQuestionOne}}</div>
      <!-- SECURITY ANSWER 1 -->
      <div class="control-block" :class="{ 'filled': securityAnswer1ModeFour }">
        <input type="text" v-model.trim="securityAnswer1ModeFour" autocomplete="off" maxlength="50"/>
        <label class="control-label">{{ $t('Account.Join.SecurityAnswer1') }}</label>
      </div>
      <!-- SECURITY QUESTION 2 -->
      <div class="securityquestion">{{secretQuestionTwo}}</div>
      <!-- SECURITY ANSWER 2 -->
      <div class="control-block" :class="{ 'filled': securityAnswer2ModeFour }">
        <input type="text" v-model.trim="securityAnswer2ModeFour" autocomplete="off" maxlength="50"/>
        <label class="control-label">{{ $t('Account.Join.SecurityAnswer2') }}</label>
      </div>
      <h1 class="or">{{ $t('MyAccount.SA.PinAndSA.LineTwo') }}</h1>
      <h3>{{ $t('MyAccount.SA.PinOrSA.PIN') }}</h3>
      <div class="pin container">
        <v-btn type="submit" @click.prevent="sendPINByTempSession()" class="primary-btn-blue"><span>{{ $t('MyAccount.SA.Pin.Send') }}</span></v-btn>
        <div class="control-block pin" :class="{ 'filled': pin }">
          <input type="text" v-model.trim="pin" autocomplete="off" maxlength="50"/>
          <label class="control-label">{{ $t('MyAccount.SA.Pin.Code') }}</label>
        </div>
      </div>
    </div>
    <div class="save-container" v-if="isSAModeZero || isSAModeOne || isSAModeTwo">
      <v-btn class="primary-btn-blue" x-large @click.stop="save()"><span>{{ $t('Account.ChangePassword.SetPassword') }}</span></v-btn>
    </div>
    <div class="save-container" v-if="isSAModeThree">
      <v-btn class="primary-btn-blue" x-large @click.stop="save()" :disabled="!ModeThreeValidated()"><span>{{ $t('Account.ChangePassword.SetPassword') }}</span></v-btn>
    </div>
    <div class="save-container" v-if="isSAModeFour">
      <v-btn class="primary-btn-blue" x-large @click.stop="save()" :disabled="!ModeFourValidated()"><span>{{ $t('Account.ChangePassword.SetPassword') }}</span></v-btn>
    </div>
    <div class="gotohome">
      <v-btn class="primary-btn-blue" x-large @click.stop="goToHomePage()"><span>{{ $t('Account.ChangePassword.GoToHomepage') }}</span></v-btn>
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
        <p v-if="brandKey !== 'sb'" class="generic-icon-note"><v-icon color="error" class="mr-1">error</v-icon><span>{{ $t('Account.Join.Dialog.Error.Text') }}</span></p>
        <p class="response-error">{{ transactionError }}</p>
        <p v-html="$t('Account.ChangePassword.Dialog.Error.Text.ContactSupport')"></p>
      </div>
    </ProcessingDialog>
    <div v-if="brandKey === 'sb'" class="vmsg customersupport" v-html="$t('Account.ChangePassword.ContactCustomerSupport')"></div>
  </div>
</template>
<script>
  import lib from '@/library'
  import ProcessingDialog from '@/components/common/ProcessingDialog'
  import store from '@/store'
  import Branding from '@/components/mixins/Branding'
  import DatePicker from '@/components/mixins/DatePicker'
  import Validation from '@/components/mixins/Validation'
  import mobileBridge from '@/library/mobileBridge'

  export default {
    name: 'ResetPassword',
    mixins: [
      Branding,
      DatePicker,
      Validation
    ],
    components: {
      ProcessingDialog
    },
    data: () => ({
      newPasswordField: undefined,
      confirmNewPasswordField: undefined,
      errorMessages: {
        newPassMissing: undefined,
        newPassStrength: undefined,
        confirmNewPassMissing: undefined,
        confirmedNewPassNotSame: undefined,
        securityAnswer1: false, // main err msg
        securityAnswer1Length: false,
        securityAnswer2: false, // main err msg
        securityAnswer2Length: false,
        pin: false,
        ssnMissing: false,
        ssnNotDigit: false,
        dobMissing: false
      },
      showNewPassword: false,
      showConfirmPassword: false,
      dialog: false,
      isProcessing: false,
      transactionError: null,
      isSAModeZero: null,
      isSAModeOne: false,
      isSAModeTwo: false,
      isSAModeThree: false,
      isSAModeFour: false,
      SASecurityQuestionsArray: [],
      passwordSAObj: {
        securityAnswer1: undefined,
        securityAnswer2: undefined,
        saPin: null
      },
      securityAnswer1ModeThree: undefined,
      securityAnswer2ModeThree: undefined,
      securityAnswer1ModeFour: undefined,
      securityAnswer2ModeFour: undefined,
      ssnField: null
    }),
    computed: {
      newPassword: {
        get () {
          return this.newPasswordField || undefined
        },
        set (value) {
          if (value.length === 0) {
            this.errorMessages.newPassMissing = true
            this.errorMessages.newPassStrength = undefined
          } else {
            if (!value.match(this.vldPasswordSpecialChar) || (value.length > 0 && value.length < this.vldPasswordMinLength)) {
              this.errorMessages.newPassMissing = undefined
              this.errorMessages.newPassStrength = true
            } else {
              this.errorMessages.newPassMissing = undefined
              this.errorMessages.newPassStrength = undefined
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
      secretQuestionOne () {
        return this.SASecurityQuestionsArray[0] || this.$t('MyAccount.SecurityQuestionOne.Missing')
      },
      secretQuestionTwo () {
        return this.SASecurityQuestionsArray[1] || this.$t('MyAccount.SecurityQuestionTwo.Missing')
      },
      securityAnswer1: {
        get () {
          return this.passwordSAObj.securityAnswer1 || undefined
        },
        set (value) {
          if (value.length === 0) {
            this.errorMessages.securityAnswer1 = true
            this.errorMessages.securityAnswer1Length = undefined
          } else if (value.length > 0 && value.length < 2) {
            this.errorMessages.securityAnswer1 = undefined
            this.errorMessages.securityAnswer1Length = true
          } else {
            this.errorMessages.securityAnswer1 = undefined
            this.errorMessages.securityAnswer1Length = undefined
          }
          this.passwordSAObj.securityAnswer1 = value
        }
      },
      securityAnswer2: {
        get () {
          return this.passwordSAObj.securityAnswer2 || undefined
        },
        set (value) {
          if (value.length === 0) {
            this.errorMessages.securityAnswer2 = true
            this.errorMessages.securityAnswer2Length = undefined
          } else if (value.length > 0 && value.length < 2) {
            this.errorMessages.securityAnswer2 = undefined
            this.errorMessages.securityAnswer2Length = true
          } else {
            this.errorMessages.securityAnswer2 = undefined
            this.errorMessages.securityAnswer2Length = undefined
          }
          this.passwordSAObj.securityAnswer2 = value
        }
      },
      pin: {
        get () {
          return this.passwordSAObj.saPin || undefined
        },
        set (value) {
          if (value.length === 0) {
            this.errorMessages.pin = true
          } else {
            this.errorMessages.pin = false
          }
          this.passwordSAObj.saPin = value
        }
      },
      ssn: {
        get () {
          return this.ssnField
        },
        set (value) {
          if (value.length !== 4) {
            this.errorMessages.ssnMissing = true
          } else {
            this.errorMessages.ssnMissing = false
            if (/^[0-9]*$/.test(Number(value))) {
              this.errorMessages.ssnNotDigit = false
            } else {
              this.errorMessages.ssnNotDigit = true
            }
          }
          this.ssnField = value
        }
      },
      dateOfBirthProp: {
        get () {
          return this.dateOfBirth
        },
        set (value) {
          if (!value) {
            this.errorMessages.dobMissing = true
          } else {
            this.errorMessages.dobMissing = false
          }
          this.dateOfBirth = value
        }
      }
    },
    methods: {
      isEverythingValid () {
        let isValid = true
        this.isAnyUnpopulatedField()
        // any error message
        Object.values(this.errorMessages).forEach(val => {
          if (val) {
            isValid = false
          }
        })
        if (this.isSAModeZero && !this.dateOfBirth && !this.ssn) {
          isValid = false
        }
        // if security questions are mandatory
        if (this.isSAModeOne && (this.SASecurityQuestionsArray.length === 0 || this.SASecurityQuestionsArray.find(e => e === null))) {
          isValid = false
        }
        if (this.isSAModeTwo && !this.pin) {
          isValid = false
        }
        if (this.isSAModeThree && (this.SASecurityQuestionsArray.length === 0 || this.SASecurityQuestionsArray.find(e => e === null))) {
          isValid = false
        }
        if (this.isSAModeFour && (this.SASecurityQuestionsArray.length === 0 || this.SASecurityQuestionsArray.find(e => e === null))) {
          isValid = false
        }
        return isValid
      },
      isAnyUnpopulatedField () {
        if (!this.newPasswordField) {
          this.errorMessages.newPassMissing = true
        }
        if (!this.confirmNewPassword) {
          this.errorMessages.confirmNewPassMissing = true
        }
        if (this.isSAModeZero && !this.ssn) {
          this.errorMessages.ssnMissing = true
        }
        if (this.isSAModeZero && !this.dateOfBirth) {
          this.errorMessages.dobMissing = true
        }
        if (this.isSAModeOne && !this.securityAnswer1) {
          this.errorMessages.securityAnswer1 = true
        }
        if (this.isSAModeOne && !this.securityAnswer2) {
          this.errorMessages.securityAnswer2 = true
        }
        if (this.isSAModeTwo && !this.pin) {
          this.errorMessages.pin = true
        }
      },
      toggleShowNewPassword () {
        this.showNewPassword = !this.showNewPassword
      },
      toggleShowConfirmPassword () {
        this.showConfirmPassword = !this.showConfirmPassword
      },
      getTempSessionId () {
        let url = window.location.href
        let array = url.split('/')
        let id = array[array.length - 1]
        return id
      },
      save () {
        let changeSucceeds = false
        if (this.isEverythingValid()) {
          this.isProcessing = true
          this.transactionError = null
          this.dialog = true
          lib.rpcService.callBroker('iw', 'setpasswordbytempsession', {
            'TempSession': this.getTempSessionId(),
            'Password': this.newPassword,
            'Answers': [this.securityAnswer1 || this.securityAnswer1ModeThree || this.securityAnswer1ModeFour, this.securityAnswer2 || this.securityAnswer2ModeThree || this.securityAnswer2ModeFour],
            'PIN': this.pin,
            'dob': this.dateOfBirth,
            'ssn4': this.ssn
          })
          .then((response) => {
            if (response && response.result && response.result.UserName) {
              changeSucceeds = true
              if (window.ctsautoconf.MOBILE_LS) {
                mobileBridge.bridgeSendRequest('clearData')
              }
            } else {
              this.transactionError = response.message
            }
          })
          .catch(err => {
            this.transactionError = err.message.replace('interpunction sign', 'special character') || this.$t('Server.ErrorMsg.Generic')
          })
          .finally(() => {
            this.isProcessing = false
            if (changeSucceeds) {
              this.$router.push({ name: 'home' })
              this.$store.dispatch('overlayState/activateLoginDialog')
            }
          })
        }
      },
      getSAByTempSession () {
        store.dispatch('getSAByTempSession', { 'TempSession': this.getTempSessionId() }).then(response => {
          if (response) {
            if (response.Mode === 0) {
              this.isSAModeZero = true
            } else if (response.Mode === 1) {
              this.isSAModeOne = true
              if (response && response.Questions) {
                this.SASecurityQuestionsArray = response.Questions
              }
            } else if (response.Mode === 2) {
              this.isSAModeTwo = true
            } else if (response.Mode === 3) {
              this.isSAModeThree = true
              if (response && response.Questions) {
                this.SASecurityQuestionsArray = response.Questions
              }
            } else if (response.Mode === 4) {
              this.isSAModeFour = true
              if (response && response.Questions) {
                this.SASecurityQuestionsArray = response.Questions
              }
            }
          }
        })
      },
      goToHomePage () {
        this.$router.push({ name: 'home' })
      },
      sendPINByTempSession () {
        lib.rpcService.callBroker('iw', 'sendPINByTempSession', {
          'TempSession': this.getTempSessionId()
        })
        .catch((error) => {
          console.log(error)
        })
      },
      ModeThreeValidated () {
        return this.pin || (this.securityAnswer1ModeThree && this.securityAnswer2ModeThree)
      },
      ModeFourValidated () {
        return this.pin && this.securityAnswer1ModeFour && this.securityAnswer2ModeFour
      }
    },
    mounted () {
      this.getSAByTempSession()
    }
  }
</script>
<style lang="stylus" scoped>
  @import "~@/css/config"
    .show_hide
      float right
      margin -25px 12px 0 5px
      z-index 2
      position relative
      color #2396FC
      text-transform uppercase
      cursor pointer
      font-size 12px

    input[type=text],
    input[type=password]
      z-index 2
    .set-password.ctsform
      background white
      margin 15px
      padding 15px
      border-radius 15px
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
    .gotohome
      text-align center
      margin 15px
    .sa.mode-two,
    .sa.pin-or-sq,
    .sa.pin-and-sq
      .pin.container
        display flex
        justify-content space-between
      .control-block.pin
        display inline-block
      .vmsg.invalid.pin
        text-align right
    .customersupport
      padding-top 50px
</style>
