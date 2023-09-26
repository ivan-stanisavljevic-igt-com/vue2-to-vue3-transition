<template>
  <div class="reset-password ctsform" v-if="isLoggedIn && strongAuthMethod !== undefined">
    <h1 v-if="!accountSummaryFlow">{{ $t('Account.ChangePassword.Heading') }}</h1>
    <span  v-if="brandKey !=='sb'" class="page-info">{{ $t('Account.ChangePassword.Info.First') }}</span>
    <div class="form" v-if="strongAuthMethod !== -1">
      <div class="control-block" :class="{ 'filled': oldPassword }">
        <input :type="showOldPassword ? 'text' : 'password'" v-model="oldPassword" id="oldPassword" autocomplete="off" :maxlength="vldPasswordMaxLength" ref="oldPassword"/>
        <label class="control-label">{{ $t('Account.ChangePassword.OldPassword') }}</label>
        <span class="show_hide" @click.stop="toggleShowOldPassword()">{{ showOldPassword ? 'Hide' : 'Show' }}</span>
      </div>
      <div>
        <div class="vmsg invalid" v-if="errorMessages.oldPasswordMissing.val" id="err_msg_oldPassword_missing">{{ $t('Account.ChangePassword.ErrorMessages.OldPassword') }}</div>
      </div>
      <div class="control-block" :class="{ 'filled': newPassword }">
        <input :type="showNewPassword ? 'text' : 'password'" v-model="newPassword" id="newPassword" autocomplete="off" :maxlength="vldPasswordMaxLength" ref="newPassword"/>
        <label class="control-label">{{ $t('Account.ChangePassword.NewPassword') }}</label>
        <span class="show_hide" @click.stop="toggleShowNewPassword()">{{ showNewPassword ? 'Hide' : 'Show' }}</span>
      </div>
      <div>
        <div class="vmsg invalid" v-if="errorMessages.newPasswordMissing.val" id="err_msg_newPassword_missing">{{ $t('Account.ChangePassword.ErrorMessages.NewPasswordMissing') }}</div>
        <div class="vmsg invalid" v-if="errorMessages.newPasswordSame.val" id="err_msg_newPassword_same">{{ $t('Account.ChangePassword.ErrorMessages.SamePassword') }}</div>
        <div class="vmsg invalid" v-if="errorMessages.newPasswordStrength.val" id="err_msg_newPassword_strength" v-html="$t('Account.Join.ErrorMsg.PassStrength', {pwdMinLength: vldPasswordMinLength})"></div>
      </div>
      <div class="control-block" :class="{ 'filled': confirmNewPassword }">
        <input :type="showConfirmPassword ? 'text' : 'password'" v-model="confirmNewPassword" id="confirmNewPassword" autocomplete="off" :maxlength="vldPasswordMaxLength" ref="confirmNewPassword"/>
        <label class="control-label">{{ $t('Account.ChangePassword.ConfirmNewPassword') }}</label>
        <span class="show_hide" @click.stop="toggleShowConfirmPassword()">{{ showConfirmPassword ? 'Hide' : 'Show' }}</span>
      </div>
      <div>
        <div class="vmsg invalid" v-if="errorMessages.confirmNewPasswordMissing.val" id="err_msg_confirmNewPassword_missing">{{ $t('Account.ChangePassword.ErrorMessages.ConfirmNewPassword.Missing') }}</div>
        <div class="vmsg invalid" v-if="errorMessages.confirmedNewPasswordNotSame.val" id="err_msg_confirmNewPassword_not_same">{{ $t('Account.ChangePassword.ErrorMessages.ConfirmNewPassword.NotSame') }}</div>
      </div>
      <!-- force SSN4 & DOB when SA is not enabled-->
      <div v-if="!strongAuthMethod">
        <!-- SSN -->
        <div class="control-block" :class="{ 'filled': ssn }">
          <input type="text" inputmode="numeric" v-model="ssn" autocomplete="off" :maxlength="4"/>
          <label class="control-label">{{ $t('Account.Join.Last4SSN') }}</label>
        </div>
        <div>
          <div class="vmsg invalid" v-if="errorMessages.ssnNotDigit.val" id="err_msg_ssn_not_digit">{{$t('Account.Join.ErrorMsg.Last4SSNNonDigit')}}</div>
          <div class="vmsg invalid" v-if="errorMessages.ssnMissing.val" id="err_msg_ssn_miss">{{$t('Account.Join.ErrorMsg.Last4SSN')}}</div>
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
        <div class="vmsg invalid" v-if="errorMessages.dobMissing.val" id="err_msg_dateOfBirth_missing">{{ $t('Account.Join.ErrorMsg.MissingDOB') }}</div>
      </div>
      <div v-if="strongAuthMethod" class="strongauth-data">
        <div v-if="strongAuthMethod === 1" class="sqa">
          <template v-if="this.strongAuthSecurityQuestions && this.strongAuthSecurityQuestions.length > 0">
            <div class="question1">
              <div class="control-block question">
                <label class="question-text">{{ $t('Account.ChangePassword.SecretAnswerTitle') }}</label>
              </div>
            </div>
            <div class="question1">
              <div class="control-block question">
                <label class="question-text">{{ strongAuthSecurityQuestions[0] }}</label>
              </div>
              <div class="control-block">
                <div class="control-block control-block-fullwidth" :class="{ 'filled': secretAnswer1 }">
                  <input type="text" v-model="secretAnswer1" id="secretAnswer1" autocomplete="off" ref="secretAnswer1" />
                  <label class="control-label">{{ $t('Account.ChangePassword.SecretAnswer') }}</label>
                </div>
                <div>
                  <div class="vmsg invalid" v-if="errorMessages.secretAnswer1Missing.val" id="err_msg_secretAnswer1_missing">{{ $t('Account.ChangePassword.ErrorMessages.SecretAnswer') }}</div>
                </div>
              </div>
            </div>
            <div class="question2">
              <div class="control-block question">
                <label class="question-text">{{ strongAuthSecurityQuestions[1] }}</label>
              </div>
              <div class="control-block">
                <div class="control-block control-block-fullwidth" :class="{ 'filled': secretAnswer2 }">
                  <input type="text" v-model="secretAnswer2" id="secretAnswer2" autocomplete="off" ref="secretAnswer2"/>
                  <label class="control-label">{{ $t('Account.ChangePassword.SecretAnswer') }}</label>
                </div>
                <div>
                  <div class="vmsg invalid" v-if="errorMessages.secretAnswer2Missing.val" id="err_msg_secretAnswer2_missing">{{ $t('Account.ChangePassword.ErrorMessages.SecretAnswer') }}</div>
                </div>
              </div>
            </div>
          </template>
          <template v-else>
            <div class="form-error">
              <div slot="text-error">
                <p class="generic-icon-note"><v-icon color="error" class="mr-1">error</v-icon><span>{{ $t('Account.ChangePassword.Dialog.Error.SecretQuestionsNotAvailable') }}</span></p>
                <p v-html="$t('Account.ChangePassword.Dialog.Error.Text.ContactSupport')"></p>
              </div>
            </div>
          </template>

        </div>
      </div>
      <div class="save-container">
      </div>
    </div>
    <div class="account-page ctsform sa" v-if="strongAuthMethod === 2">
      <p>{{ $t('MyAccount.SA.Pin.Label') }}</p>
      <div class="pin container">
        <v-btn :disabled="!allowAccountUpdate" type="submit" @click.stop="sendPINBySession()" class="primary-btn-blue"><span>{{ $t('MyAccount.SA.Pin.Send') }}</span></v-btn>
        <div class="control-block pin" :class="{ 'filled': pin }">
          <input type="text" v-model.trim="pin" id="pin" autocomplete="off" maxlength="50"/>
          <label class="control-label">{{ $t('MyAccount.SA.Pin.Code') }}</label>
        </div>
      </div>
      <div class="vmsg invalid pin" v-if="errorMessages.pin" id="err_msg_pin_missing">{{ $t('Account.ChangePassword.ErrorMessages.PIN.Missing') }}</div>
    </div>
    <!-- Mode 3 PIN or Security questions-->
    <div class="account-page ctsform sa pin-or-sq" v-if="strongAuthMethod === 3">
      <h3>{{ $t('MyAccount.SA.PinOrSA.LineOne') }}</h3>
      <!-- SECURITY QUESTION 1 -->
      <div class="securityquestion">{{strongAuthSecurityQuestions[0]}}</div>
      <!-- SECURITY ANSWER 1 -->
      <div class="control-block control-block-fullwidth" :class="{ 'filled': securityAnswer1ModeThree }">
        <input type="text" v-model.trim="securityAnswer1ModeThree" id="secretAnswer1" autocomplete="off" maxlength="50"/>
        <label class="control-label">{{ $t('Account.Join.SecurityAnswer1') }}</label>
      </div>
      <!-- SECURITY QUESTION 2 -->
      <div class="securityquestion">{{strongAuthSecurityQuestions[1]}}</div>
      <!-- SECURITY ANSWER 2 -->
      <div class="control-block control-block-fullwidth" :class="{ 'filled': securityAnswer2ModeThree }">
        <input type="text" v-model.trim="securityAnswer2ModeThree" id="secretAnswer2" autocomplete="off" maxlength="50"/>
        <label class="control-label">{{ $t('Account.Join.SecurityAnswer2') }}</label>
      </div>
      <h1 class="or">{{ $t('MyAccount.SA.PinOrSA.LineTwo') }}</h1>
      <h3>{{ $t('MyAccount.SA.PinOrSA.PIN') }}</h3>
      <div class="pin container">
        <v-btn :disabled="!allowAccountUpdate" type="submit" id="btn_send_pin" @click.stop="sendPINBySession()" class="primary-btn-blue"><span>{{ $t('MyAccount.SA.Pin.Send') }}</span></v-btn>
        <div class="control-block pin" :class="{ 'filled': pin }">
          <input type="text" v-model.trim="pin" id="pin" autocomplete="off" maxlength="50"/>
          <label class="control-label">{{ $t('MyAccount.SA.Pin.Code') }}</label>
        </div>
      </div>
    </div>
    <!-- Mode 4 PIN and Security questions -->
    <div class="account-page ctsform sa pin-and-sq" v-if="strongAuthMethod === 4">
      <h3>{{ $t('MyAccount.SA.PinOrSA.LineOne') }}</h3>
      <!-- SECURITY QUESTION 1 -->
      <div class="securityquestion">{{strongAuthSecurityQuestions[0]}}</div>
      <!-- SECURITY ANSWER 1 -->
      <div class="control-block control-block-fullwidth" :class="{ 'filled': securityAnswer1ModeFour }">
        <input type="text" v-model.trim="securityAnswer1ModeFour" id="secretAnswer1" autocomplete="off" maxlength="50"/>
        <label class="control-label">{{ $t('Account.Join.SecurityAnswer1') }}</label>
      </div>
      <!-- SECURITY QUESTION 2 -->
      <div class="securityquestion">{{strongAuthSecurityQuestions[1]}}</div>
      <!-- SECURITY ANSWER 2 -->
      <div class="control-block control-block-fullwidth" :class="{ 'filled': securityAnswer2ModeFour }">
        <input type="text" v-model.trim="securityAnswer2ModeFour" id="secretAnswer2" autocomplete="off" maxlength="50"/>
        <label class="control-label">{{ $t('Account.Join.SecurityAnswer2') }}</label>
      </div>
      <h1 class="or">{{ $t('MyAccount.SA.PinAndSA.LineTwo') }}</h1>
      <h3>{{ $t('MyAccount.SA.PinOrSA.PIN') }}</h3>
      <div class="pin container">
        <v-btn :disabled="!allowAccountUpdate" type="submit" id="btn_send_pin" @click.stop="sendPINBySession()" class="primary-btn-blue"><span>{{ $t('MyAccount.SA.Pin.Send') }}</span></v-btn>
        <div class="control-block pin" :class="{ 'filled': pin }">
          <input type="text" v-model.trim="pin" id="pin" autocomplete="off" maxlength="50"/>
          <label class="control-label">{{ $t('MyAccount.SA.Pin.Code') }}</label>
        </div>
      </div>
    </div>
    <div>
      <div class="vmsg invalid" v-if="errorMessages.securityQuestionsMissing.val" id="err_msg_securityQuestions_missing">{{ $t('Account.ChangePassword.ErrorMessages.Questions.Missing') }}</div>
    </div>
    <div class="save-container"  v-if="strongAuthMethod === 0">
      <v-btn class="primary-btn-blue" x-large @click.stop="submit()" id="btn_save" :disabled="!isSADataValid || !allowAccountUpdate"><span>{{ $t('Account.Save') }}</span></v-btn>
    </div>
    <div class="save-container"  v-if="strongAuthMethod === 1">
      <v-btn class="primary-btn-blue" x-large @click.stop="submit()" id="btn_save" :disabled="!(isSADataValid && secretAnswer1 && secretAnswer2) || !allowAccountUpdate"><span>{{ $t('Account.Save') }}</span></v-btn>
    </div>
    <div class="save-container"  v-if="(strongAuthMethod === 2)">
      <v-btn class="primary-btn-blue" x-large @click.stop="submit()" id="btn_save" :disabled="!pin || !allowAccountUpdate"><span>{{ $t('Account.Save') }}</span></v-btn>
    </div>
    <div class="save-container"  v-if="(strongAuthMethod === 3)">
      <v-btn class="primary-btn-blue" x-large @click.stop="submit()" id="btn_save" :disabled="!modeThreeValidated || !allowAccountUpdate"><span>{{ $t('Account.Save') }}</span></v-btn>
    </div>
    <div class="save-container"  v-if="(strongAuthMethod === 4)">
      <v-btn class="primary-btn-blue" x-large @click.stop="submit()" id="btn_save" :disabled="!modeFourValidated || !allowAccountUpdate"><span>{{ $t('Account.Save') }}</span></v-btn>
    </div>
    <ProcessingDialog
      v-model="dialog"
      @close="onCloseProcessingDialog"
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
</template>
<script>
  import store from '@/store'
  import lib from '@/library'
  import ProcessingDialog from '@/components/common/ProcessingDialog'
  import mobileBridge from '@/library/mobileBridge'
  import Branding from '@/components/mixins/Branding'
  import DatePicker from '@/components/mixins/DatePicker'
  import Validation from '@/components/mixins/Validation'

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
      oldPasswordField: undefined,
      newPasswordField: undefined,
      confirmNewPasswordField: undefined,
      secretAnswerField1: undefined,
      secretAnswerField2: undefined,
      errorMessages: {
        oldPasswordMissing: { val: false, forInputField: 'oldPassword' },
        newPasswordMissing: { val: false, forInputField: 'newPassword' },
        newPasswordStrength: { val: false, forInputField: 'newPassword' },
        newPasswordSame: { val: undefined, forInputField: 'newPassword' },
        confirmNewPasswordMissing: { val: false, forInputField: 'confirmNewPassword' },
        confirmedNewPasswordNotSame: { val: undefined, forInputField: 'confirmNewPassword' },
        secretAnswer1Missing: { val: false, forInputField: 'secretAnswer1' },
        secretAnswer2Missing: { val: false, forInputField: 'secretAnswer2' },
        pinMissing: { val: false, forInputField: 'pin' },
        securityAnswer1ModeThree: { val: false, forInputField: 'securityAnswer1ModeThree' },
        securityAnswer2ModeThree: { val: false, forInputField: 'securityAnswer2ModeThree' },
        securityAnswer1ModeFour: { val: false, forInputField: 'securityAnswer1ModeFour' },
        securityAnswer2ModeFour: { val: false, forInputField: 'securityAnswer2ModeFour' },
        securityQuestionsMissing: { val: false },
        ssnMissing: { val: false, forInputField: 'ssnMissing' },
        ssnNotDigit: { val: false, forInputField: 'ssnNotDigit' },
        dobMissing: { val: false, forInputField: 'ssnNotDigit' }
      },
      dialog: false,
      isProcessing: false,
      transactionError: null,
      strongAuthMethod: undefined,
      strongAuthSecurityQuestions: undefined,
      showNewPassword: false,
      showOldPassword: false,
      showConfirmPassword: false,
      saPin: null,
      saSecurityAnswer1ModeThree: undefined,
      saSecurityAnswer2ModeThree: undefined,
      saSecurityAnswer1ModeFour: undefined,
      saSecurityAnswer2ModeFour: undefined,
      ssnField: null
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
            this.errorMessages.oldPasswordMissing.val = true
          } else {
            this.errorMessages.oldPasswordMissing.val = false
            if (value === this.newPassword) {
              this.errorMessages.newPasswordSame.val = true
            } else {
              this.errorMessages.newPasswordSame.val = false
            }
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
            this.errorMessages.newPasswordMissing.val = true
            this.errorMessages.newPasswordStrength.val = undefined
          } else {
            this.errorMessages.newPasswordMissing.val = false
            if (!value.match(this.vldPasswordSpecialChar) || (value.length > 0 && value.length < this.vldPasswordMinLength)) {
              this.errorMessages.newPasswordStrength.val = true
            } else {
              this.errorMessages.newPasswordStrength.val = undefined
            }
            if (value === this.oldPassword) {
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
      secretAnswer1: {
        get () {
          return this.secretAnswerField1
        },
        set (value) {
          if (value.length === 0) {
            this.errorMessages.secretAnswer1Missing.val = true
          } else {
            this.errorMessages.secretAnswer1Missing.val = false
          }
          this.secretAnswerField1 = value
        }
      },
      secretAnswer2: {
        get () {
          return this.secretAnswerField2
        },
        set (value) {
          if (value.length === 0) {
            this.errorMessages.secretAnswer2Missing.val = true
          } else {
            this.errorMessages.secretAnswer2Missing.val = false
          }
          this.secretAnswerField2 = value
        }
      },
      isSADataValid () {
        if (this.strongAuthMethod === 0) {
          // No Strong Auth required
          return true
        } else if (this.strongAuthMethod === 1 || this.strongAuthMethod === 3 || this.strongAuthMethod === 4) {
          // Strong Auth by secret answer required
          if (this.strongAuthSecurityQuestions && this.strongAuthSecurityQuestions.length === 2) {
            var isValidValue = true
            this.strongAuthSecurityQuestions.forEach(item => {
              if (!item) {
                isValidValue = false
              }
            })
            return isValidValue
          }
        } else if (this.strongAuthMethod === 2) {
          return true
        }
        return false
      },
      username () {
        return store.getters['getUsername']
      },
      pin: {
        get () {
          return this.saPin || undefined
        },
        set (value) {
          this.saPin = value
        }
      },
      securityAnswer1ModeThree: {
        get () {
          return this.saSecurityAnswer1ModeThree || undefined
        },
        set (value) {
          if (value.length > 0 && value.length < 2) {
            this.errorMessages.securityAnswer1ModeThree.val = true
          } else {
            this.errorMessages.securityAnswer1ModeThree.val = undefined
          }
          this.saSecurityAnswer1ModeThree = value
        }
      },
      securityAnswer2ModeThree: {
        get () {
          return this.saSecurityAnswer2ModeThree || undefined
        },
        set (value) {
          if (value.length > 0 && value.length < 2) {
            this.errorMessages.securityAnswer2ModeThree.val = true
          } else {
            this.errorMessages.securityAnswer2ModeThree.val = undefined
          }
          this.saSecurityAnswer2ModeThree = value
        }
      },
      modeThreeValidated () {
        return this.isSADataValid && (this.pin || (this.securityAnswer1ModeThree && this.securityAnswer2ModeThree))
      },
      securityAnswer1ModeFour: {
        get () {
          return this.saSecurityAnswer1ModeFour || undefined
        },
        set (value) {
          if (value.length === 0) {
            this.errorMessages.securityAnswer1ModeFour.val = true
          } else {
            this.errorMessages.securityAnswer1ModeFour.val = undefined
          }
          this.saSecurityAnswer1ModeFour = value
        }
      },
      securityAnswer2ModeFour: {
        get () {
          return this.saSecurityAnswer2ModeFour || undefined
        },
        set (value) {
          if (value.length === 0) {
            this.errorMessages.securityAnswer2ModeFour.val = true
          } else {
            this.errorMessages.securityAnswer2ModeFour.val = undefined
          }
          this.saSecurityAnswer2ModeFour = value
        }
      },
      modeFourValidated () {
        return this.isSADataValid && this.pin && this.securityAnswer1ModeFour && this.securityAnswer2ModeFour
      },
      allowAccountUpdate () {
        return store.getters['getAllowAccountUpdate']
      },
      accountSummaryFlow () {
        return window.ctsautoconf.ACCOUNT_SUMMARY_FLOW || false
      },
      ssn: {
        get () {
          return this.ssnField
        },
        set (value) {
          if (value.length !== 4) {
            this.errorMessages.ssnMissing.val = true
          } else {
            this.errorMessages.ssnMissing.val = false
            if (/^[0-9]*$/.test(Number(value))) {
              this.errorMessages.ssnNotDigit.val = false
            } else {
              this.errorMessages.ssnNotDigit.val = true
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
            this.errorMessages.dobMissing.val = true
          } else {
            this.errorMessages.dobMissing.val = false
          }
          this.dateOfBirth = value
        }
      }
    },
    methods: {
      onCloseProcessingDialog () {
        if (!this.transactionError) {
          store.dispatch('logout')
          store.dispatch('overlayState/activateLoginDialog')
        }
      },
      isEverythingValid () {
        var isValid = true
        var isScrolled = false
        Object.values(this.errorMessages).forEach((item) => {
          if (item.val) {
            isValid = false
            if (!isScrolled) {
              var el = this.$refs[item.forInputField]
              if (el) {
                el.scrollIntoView({ behavior: 'smooth', block: 'center' })
                isScrolled = true
              }
            }
          }
        })
        return isValid
      },
      checkForm () {
        // set same value to all fields so the property setter is called to perform validations
        this.oldPassword = this.oldPassword || ''
        this.newPassword = this.newPassword || ''
        this.confirmNewPassword = this.confirmNewPassword || ''
        if (this.strongAuthMethod < 1) {
          this.ssn = this.ssn || ''
          this.dateOfBirthProp = this.dateOfBirthProp || ''
        } else if (this.strongAuthMethod === 1) {
          this.secretAnswer1 = this.secretAnswer1 || ''
          this.secretAnswer2 = this.secretAnswer2 || ''
        } else if (this.strongAuthMethod === 2) {
          this.pin = this.pin || ''
        } else if (this.strongAuthMethod === 3) {
          this.securityAnswer1ModeThree = this.securityAnswer1ModeThree || ''
          this.securityAnswer2ModeThree = this.securityAnswer2ModeThree || ''
          this.pin = this.pin || ''
        } else if (this.strongAuthMethod === 4) {
          this.securityAnswer1ModeFour = this.securityAnswer1ModeFour || ''
          this.securityAnswer2ModeFour = this.securityAnswer2ModeFour || ''
          this.pin = this.pin || ''
        }
      },
      submit () {
        this.checkForm()
        if (this.isEverythingValid()) {
          this.isProcessing = true
          this.transactionError = null
          this.dialog = true
          lib.rpcService.callBroker('iwservice', 'setpasswordbysession', {
            'OldPassword': this.oldPassword,
            'Password': this.newPassword,
            'Answers': [this.secretAnswer1 || this.securityAnswer1ModeThree || this.securityAnswer1ModeFour, this.secretAnswer2 || this.securityAnswer2ModeThree || this.securityAnswer2ModeFour],
            'PIN': this.pin,
            'dob': this.dateOfBirth,
            'ssn4': this.ssn
          }).then((response) => {
            if (response && response.exceptionType && response.message) {
              this.transactionError = response.message
            } else {
              if (window.ctsautoconf.MOBILE_LS) {
                mobileBridge.bridgeSendRequest('writeData', {'username': this.username, 'password': this.newPassword, 'env': window.ctsautoconf.WALLET_PROVIDER})
              }
            }
          })
          .catch(err => {
            this.transactionError = err.message.replace('interpunction sign', 'special character') || this.$t('Server.ErrorMsg.Generic')
          })
          .finally(() => {
            this.isProcessing = false
            this.resetForm()
          })
        }
      },
      getSaByDCSession () {
        this.isProcessing = true
        lib.rpcService.callBroker('iwservice', 'getsabysession', {}).then((response) => {
          if (response && response.result && (response.result.Mode || response.result.Mode === 0)) {
            this.strongAuthMethod = response.result.Mode
          } else {
            this.strongAuthMethod = undefined
          }
          this.strongAuthSecurityQuestions = (response && response.result && response.result.Questions) || []
          // this.strongAuthSecurityQuestions = ['In what city or town was your first job?', null] // mock
          if ([1, 3, 4].includes(this.strongAuthMethod)) {
            if (!this.strongAuthSecurityQuestions || !this.strongAuthSecurityQuestions[0] || !this.strongAuthSecurityQuestions[1]) {
              this.errorMessages.securityQuestionsMissing.val = true
            }
          }
          this.isProcessing = false
        }).catch((err) => {
          this.strongAuthMethod = -1
          this.strongAuthSecurityQuestions = undefined
          this.transactionError = (err.error && err.error.Message) || this.$t('Server.ErrorMsg.Generic')
          this.isProcessing = false
        })
      },
      toggleShowOldPassword () {
        this.showOldPassword = !this.showOldPassword
      },
      toggleShowNewPassword () {
        this.showNewPassword = !this.showNewPassword
      },
      toggleShowConfirmPassword () {
        this.showConfirmPassword = !this.showConfirmPassword
      },
      resetForm () {
        this.oldPassword = ''
        this.newPassword = ''
        this.confirmNewPassword = ''
        this.secretAnswer1 = ''
        this.secretAnswer2 = ''
        this.pin = ''
        this.securityAnswer1ModeThree = ''
        this.securityAnswer2ModeThree = ''
        this.securityAnswer1ModeFour = ''
        this.securityAnswer2ModeFour = ''
        this.errorMessages.oldPasswordMissing.val = false
        this.errorMessages.newPasswordMissing.val = false
        this.errorMessages.newPasswordStrength.val = false
        this.errorMessages.newPasswordSame.val = undefined
        this.errorMessages.confirmNewPasswordMissing.val = false
        this.errorMessages.confirmedNewPasswordNotSame.val = undefined
        this.errorMessages.secretAnswer1Missing.val = false
        this.errorMessages.secretAnswer2Missing.val = false
        this.errorMessages.pinMissing.val = false
        this.errorMessages.securityAnswer1ModeThree.val = false
        this.errorMessages.securityAnswer2ModeThree.val = false
        this.errorMessages.securityAnswer1ModeFour.val = false
        this.errorMessages.securityAnswer2ModeFour.val = false
        this.ssnField = null
        this.dateOfBirth = null
        this.errorMessages.ssnNotDigit.val = false
        window.scrollTo({ top: 0, behavior: 'smooth' })
      },
      sendPINBySession () {
        lib.rpcService.callBroker('iw', 'sendpinbysession', {})
        .catch((error) => {
          console.log(error)
        })
      }
    },
    created () {
      this.getSaByDCSession()
    }
  }
</script>
<style lang="stylus" scoped>
  @import "~@/css/config"
    .reset-password
      h1
        text-align center
      .page-info
        padding-bottom 10px
        display inline-block
      .save-container
        text-align center

      .strongauth-data
        padding 25px 0 0 0
        .question1,
        .question2
          .question
            label
              padding 0
              // font-weight bold
              font-size 14px

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
    .pin.container
      display flex
      justify-content space-between
    .control-block.pin
      display inline-block
    .vmsg.invalid.pin
      text-align right
    .control-block-fullwidth
      width 100%!important
</style>
