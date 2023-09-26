<template>
  <div class="account-page ctsform">
    <div v-if="!isLoggedIn && secretQuestionsArray && secretQuestionsArray.length > 0">
      <h1>{{ $t('Account.Join.Heading') }}</h1>
      <div class="control-block" :class="{ 'filled': firstName }">
        <input type="text" v-model="firstName" autocomplete="off" @focusout="!registrationDetails.firstName ? errorMessages.firstName = true : errorMessages.firstName = false"/>
        <label class="control-label" key="jc_firstName_label">{{ $t('Account.Join.FirstName') }}</label>
      </div>
      <div>
        <div class="vmsg invalid" v-if="errorMessages.firstName" key="fn" v-html="$t('Account.Join.ErrorMsg.FirstName')"></div>
        <div class="vmsg invalid" v-if="errorMessages.firstNameLength" key="fnl" v-html="$t('Account.Join.ErrorMsg.FirstNameLength')"></div>
      </div>
      <div class="control-block" :class="{ 'filled': lastName }">
        <input type="text" v-model="lastName" autocomplete="off" @focusout="!registrationDetails.lastName ? errorMessages.lastName = true : errorMessages.lastName = false"/>
        <label class="control-label" key="jc_lastName_label">{{ $t('Account.Join.LastName') }}</label>
      </div>
      <div>
        <div class="vmsg invalid" v-if="errorMessages.lastName" key="ln" v-html="$t('Account.Join.ErrorMsg.LastName')"></div>
      </div>
      <div class="control-block" :class="{ 'filled': title }">
        <select class="input-field" v-model="title" autocomplete="off" @focusout="!registrationDetails.title ? errorMessages.title = true : errorMessages.title = false">
          <option value="Mr.">{{ $t('Account.Join.Title.Mr') }}</option>
          <option value="Miss.">{{ $t('Account.Join.Title.Miss') }}</option>
          <option value="Mrs.">{{ $t('Account.Join.Title.Mrs') }}</option>
          <option value="Ms.">{{ $t('Account.Join.Title.Ms') }}</option>
        </select>
        <label class="control-label">{{ $t('Account.Join.Title') }}</label>
      </div>
      <div>
        <div class="vmsg invalid" v-if="errorMessages.title">{{ $t('Account.Join.ErrorMsg.Title') }}</div>
      </div>
      <div class="control-block" :class="{ 'filled': IDDCSecurityQuestion }">
        <select class="input-field" v-model="IDDCSecurityQuestion" autocomplete="off" @focusout="!registrationDetails.IDDCSecurityQuestion ? errorMessages.securityQuestion = true : errorMessages.securityQuestion = false">
          <option v-for="item in secretQuestionsArray" :value="item.IDDCSecretQuestion">{{ item.Question }}</option>
        </select>
        <label class="control-label">{{ $t('Account.SecurityQuestion.Label') }}</label>
      </div>
      <div>
        <div class="vmsg invalid" v-if="errorMessages.securityQuestion" key="sq" v-html="$t('Account.Join.ErrorMsg.SecurityQuestion')"></div>
      </div>
      <div class="control-block" :class="{ 'filled': securityAnswer }">
        <input type="text" v-model="securityAnswer" autocomplete="off" @focusout="!registrationDetails.securityAnswer ? errorMessages.securityAnswer = true : errorMessages.securityAnswer = false"/>
        <label class="control-label" key="jc_securityAnswer_label">{{ $t('Account.Join.SecurityAnswer') }}</label>
      </div>
      <div>
        <div class="vmsg invalid" v-if="errorMessages.securityAnswer" key="sa" v-html="$t('Account.Join.ErrorMsg.SecurityAnswer')"></div>
        <div class="vmsg invalid" v-if="errorMessages.securityAnswerLength" key="sal" v-html="$t('Account.Join.ErrorMsg.SecurityAnswerLength')"></div>
      </div>
      <div class="control-block" :class="{ 'filled': dob }">
        <datepicker class ="dob" v-model="dob" :format="'MM / dd / yyyy'" @closed="checkDOB()"></datepicker>
        <label class="control-label" key="jc_dob_label">{{ $t('Account.Join.DOB') }}</label>
      </div>
      <div class="vmsg invalid" key="jc_error_dob" v-if="errorMessages.dob">{{ $t('Account.Join.ErrorMsg.MissingDOB') }}</div>
      <div class="vmsg invalid" key="jc_error_adultdob" v-if="errorMessages.dobAdult">{{ $t('Account.Join.ErrorMsg.Adult') }}</div>
      <div class="user-pass-container">
        <h1>{{ $t('Account.Join.UserNameDetails') }}</h1>
        <div class="control-block" :class="{ 'filled': userName }">
          <input type="text" v-model="userName" autocomplete="off" @focusout="!registrationDetails.userName ? errorMessages.userName = true : errorMessages.userName = false"/>
          <label class="control-label" key="jc_userName_label">{{ $t('Account.Join.UserName') }}</label>
        </div>
        <div>
          <div class="vmsg invalid" v-if="errorMessages.userName" key="un" v-html="$t('Account.Join.ErrorMsg.UserName')"></div>
          <div class="vmsg invalid" v-if="errorMessages.userNameLength" key="unl" v-html="$t('Account.Join.ErrorMsg.UserNameLength')"></div>
        </div>
        <div class="control-block" :class="{ 'filled': pass }">
          <input type="password" v-model="pass" autocomplete="off" @focusout="!registrationDetails.pass ? errorMessages.pass = true : errorMessages.pass = false"/>
          <label class="control-label" key="jc_pass_label">{{ $t('Account.Join.Pass') }}</label>
        </div>
        <div>
          <div class="vmsg invalid" v-if="errorMessages.pass" key="pas" v-html="$t('Account.Join.ErrorMsg.Pass')"></div>
          <div class="vmsg invalid" v-if="errorMessages.passStrength" key="pasl" v-html="$t('Account.Join.ErrorMsg.PassStrength')"></div>
        </div>
        <div class="control-block" :class="{ 'filled': confirmPassword }">
          <input type="password" v-model="confirmPassword" autocomplete="off" @focusout="!confirmedPasswordField ? errorMessages.confirmedPassMissing = true : errorMessages.confirmedPassMissing = false"/>
          <label class="control-label" key="rp_confirmPassword_label">{{ $t('Account.Join.ConfirmNewPassword') }}</label>
        </div>
        <div>
          <div class="vmsg invalid" v-if="errorMessages.confirmedPassMissing" key="rp_confirmPassword_Missing_error">{{ $t('Account.Join.ErrorMessages.ConfirmNewPassword.Missing') }}</div>
          <div class="vmsg invalid" v-if="errorMessages.confirmedPassNotSame" key="rp_confirmPassword_NotSamePass_error">{{ $t('Account.Join.ErrorMessages.ConfirmNewPassword.NotSame') }}</div>
        </div>
        <div class="control-block" :class="{ 'filled': email }">
          <input type="text" v-model="email" autocomplete="off" @focusout="!registrationDetails.mail ? errorMessages.mail = true : errorMessages.mail = false"/>
          <label class="control-label" key="jc_email_label">{{ $t('Account.Join.Email') }}</label>
        </div>
        <div>
          <div class="vmsg invalid" v-if="errorMessages.mail" key="ems" v-html="$t('Account.Join.ErrorMsg.Email')"></div>
          <div class="vmsg invalid" v-if="errorMessages.mailValid" key="emsl" v-html="$t('Account.Join.ErrorMsg.EmailInvalid')"></div>
        </div>
      </div>
      <h1>{{ $t('Account.Join.AddressHeading') }}</h1>
      <div class="control-block" :class="{ 'filled': state }">
        <select class="input-field" v-model="state" autocomplete="off" @focusout="!registrationDetails.state ? errorMessages.state = true : errorMessages.state = false">
          <option value="RI" selected="selected">{{ $t('Account.PersonalDetails.State.RhodeIsland') }}</option>
          <option value="AK">{{ $t('Account.PersonalDetails.State.Alaska') }}</option>
          <option value="AL">{{ $t('Account.PersonalDetails.State.Alabama') }}</option>
          <option value="AR">{{ $t('Account.PersonalDetails.State.Arkansas') }}</option>
          <option value="AZ">{{ $t('Account.PersonalDetails.State.Arizona') }}</option>
          <option value="CA">{{ $t('Account.PersonalDetails.State.California') }}</option>
          <option value="CO">{{ $t('Account.PersonalDetails.State.Colorado') }}</option>
          <option value="CT">{{ $t('Account.PersonalDetails.State.Connecticut') }}</option>
          <option value="DC">{{ $t('Account.PersonalDetails.State.DistrictofColumbia') }}</option>
          <option value="DE">{{ $t('Account.PersonalDetails.State.Delaware') }}</option>
          <option value="FL">{{ $t('Account.PersonalDetails.State.Florida') }}</option>
          <option value="GA">{{ $t('Account.PersonalDetails.State.Georgia') }}</option>
          <option value="HI">{{ $t('Account.PersonalDetails.State.Hawaii') }}</option>
          <option value="IA">{{ $t('Account.PersonalDetails.State.Iowa') }}</option>
          <option value="ID">{{ $t('Account.PersonalDetails.State.Idaho') }}</option>
          <option value="IL">{{ $t('Account.PersonalDetails.State.Illinois') }}</option>
          <option value="IN">{{ $t('Account.PersonalDetails.State.Indiana') }}</option>
          <option value="KS">{{ $t('Account.PersonalDetails.State.Kansas') }}</option>
          <option value="KY">{{ $t('Account.PersonalDetails.State.Kentucky') }}</option>
          <option value="LA">{{ $t('Account.PersonalDetails.State.Louisiana') }}</option>
          <option value="MA">{{ $t('Account.PersonalDetails.State.Massachusetts') }}</option>
          <option value="MD">{{ $t('Account.PersonalDetails.State.Maryland') }}</option>
          <option value="ME">{{ $t('Account.PersonalDetails.State.Maine') }}</option>
          <option value="MI">{{ $t('Account.PersonalDetails.State.Michigan') }}</option>
          <option value="MN">{{ $t('Account.PersonalDetails.State.Minnesota') }}</option>
          <option value="MO">{{ $t('Account.PersonalDetails.State.Missouri') }}</option>
          <option value="MS">{{ $t('Account.PersonalDetails.State.Mississippi') }}</option>
          <option value="MT">{{ $t('Account.PersonalDetails.State.Montana') }}</option>
          <option value="NC">{{ $t('Account.PersonalDetails.State.NorthCarolina') }}</option>
          <option value="ND">{{ $t('Account.PersonalDetails.State.NorthDakota') }}</option>
          <option value="NE">{{ $t('Account.PersonalDetails.State.Nebraska') }}</option>
          <option value="NH">{{ $t('Account.PersonalDetails.State.NewHampshire') }}</option>
          <option value="NJ">{{ $t('Account.PersonalDetails.State.NewJersey') }}</option>
          <option value="NM">{{ $t('Account.PersonalDetails.State.NewMexico') }}</option>
          <option value="NV">{{ $t('Account.PersonalDetails.State.Nevada') }}</option>
          <option value="NY">{{ $t('Account.PersonalDetails.State.NewYork') }}</option>
          <option value="OH">{{ $t('Account.PersonalDetails.State.Ohio') }}</option>
          <option value="OK">{{ $t('Account.PersonalDetails.State.Oklahoma') }}</option>
          <option value="OR">{{ $t('Account.PersonalDetails.State.Oregon') }}</option>
          <option value="PA">{{ $t('Account.PersonalDetails.State.Pennsylvania') }}</option>
          <option value="SC">{{ $t('Account.PersonalDetails.State.SouthCarolina') }}</option>
          <option value="SD">{{ $t('Account.PersonalDetails.State.SouthDakota') }}</option>
          <option value="TN">{{ $t('Account.PersonalDetails.State.Tennessee') }}</option>
          <option value="TX">{{ $t('Account.PersonalDetails.State.Texas') }}</option>
          <option value="UT">{{ $t('Account.PersonalDetails.State.Utah') }}</option>
          <option value="VA">{{ $t('Account.PersonalDetails.State.Virginia') }}</option>
          <option value="VT">{{ $t('Account.PersonalDetails.State.Vermont') }}</option>
          <option value="WA">{{ $t('Account.PersonalDetails.State.Washington') }}</option>
          <option value="WI">{{ $t('Account.PersonalDetails.State.Wisconsin') }}</option>
          <option value="WV">{{ $t('Account.PersonalDetails.State.WestVirginia') }}</option>
          <option value="WY">{{ $t('Account.PersonalDetails.State.Wyoming') }}</option>
        </select>
        <label class="control-label">{{ $t('Account.Join.State') }}</label>
      </div>
      <div>
        <div class="vmsg invalid" v-if="errorMessages.state">{{ $t('Account.PersonalDetails.errorMessages.state') }}</div>
      </div>
      <div class="control-block" :class="{ 'filled': city }">
        <input type="text" v-model="city" autocomplete="off" @focusout="!registrationDetails.city ? errorMessages.city = true : errorMessages.city = false"/>
        <label class="control-label" key="jc_city_label">{{ $t('Account.Join.City') }}</label>
      </div>
      <div>
        <div class="vmsg invalid" v-if="errorMessages.city" key="cty" v-html="$t('Account.Join.ErrorMsg.City')"></div>
      </div>
      <div class="control-block" :class="{ 'filled': zipCode }">
        <input type="text" v-model="zipCode" autocomplete="off" @focusout="!registrationDetails.zipCode ? errorMessages.zipCode = true : errorMessages.zipCode = false"/>
        <label class="control-label" key="jc_zip_label">{{ $t('Account.Join.Zip') }}</label>
      </div>
      <div>
        <div class="vmsg invalid" v-if="errorMessages.zipCode" key="zip" v-html="$t('Account.Join.ErrorMsg.Zip')"></div>
        <div class="vmsg invalid" v-if="errorMessages.zipCodeValid" key="zipl" v-html="$t('Account.Join.ErrorMsg.ZipInvalid')"></div>
        <div class="vmsg invalid" v-if="errorMessages.zipCodeNotDigit" key="zipndgt" v-html="$t('Account.Join.ErrorMsg.ZipCodeNotDigit')"></div>
      </div>
      <div class="control-block" :class="{ 'filled': address }">
        <input type="text" v-model="address" autocomplete="off" @focusout="!registrationDetails.address ? errorMessages.address = true : errorMessages.address = false"/>
        <label class="control-label" key="jc_address_label">{{ $t('Account.Join.Address') }}</label>
      </div>
      <div>
        <div class="vmsg invalid" v-if="errorMessages.address" key="jsaddrs" v-html="$t('Account.Join.ErrorMsg.Address')"></div>
      </div>
      <div class="control-block" :class="{ 'filled': ssn }">
        <input type="text" v-model="ssn" autocomplete="off" @focusout="!registrationDetails.ssn ? errorMessages.ssn = true : errorMessages.ssn = false"/>
        <label class="control-label" key="jc_ssn_label">{{ $t('Account.Join.SSN') }}</label>
      </div>
      <div>
        <div class="vmsg invalid" v-if="errorMessages.ssn" key="jsssn" v-html="$t('Account.Join.ErrorMsg.SSN')"></div>
        <div class="vmsg invalid" v-if="errorMessages.ssnNonDigit" key="jsssnnd" v-html="$t('Account.Join.ErrorMsg.SSNNonDigit')"></div>
        <div class="vmsg invalid" v-if="errorMessages.ssnLength" key="jsssnlg" v-html="$t('Account.Join.ErrorMsg.SSNLength')"></div>
      </div>
      <div class="control-block" :class="{ 'filled': phone }">
        <input type="text" v-model="phone" autocomplete="off" @focusout="!registrationDetails.phone ? errorMessages.phone = true : errorMessages.phone = false"/>
        <label class="control-label" key="jc_phone_label">{{ $t('Account.Join.Phone') }}</label>
      </div>
      <div>
        <div class="vmsg invalid" v-if="errorMessages.phone" key="jsphn" v-html="$t('Account.Join.ErrorMsg.Phone')"></div>
        <div class="vmsg invalid" v-if="errorMessages.phoneNonDigit" key="jsphnnd" v-html="$t('Account.Join.ErrorMsg.PhoneNonDigit')"></div>
        <div class="vmsg invalid" v-if="errorMessages.phoneLength" key="jsphnlg" v-html="$t('Account.Join.ErrorMsg.PhoneLength')"></div>
      </div>
      <v-checkbox class="t-and-c" v-model="tc" required :label="$t('Account.Join.TC')"></v-checkbox>
      <div>
        <div class="vmsg invalid" v-if="errorMessages.tc" key="jstc" v-html="$t('Account.Join.ErrorMsg.TC')"></div>
      </div>
      <div class="form-actions">
        <v-btn color="success" x-large @click.stop="register()"><span>{{ $t('Account.Save') }}</span></v-btn>
      </div>
    </div>
    <div v-if="isLoggedIn" class="account-info">{{ $t('Account.Join.AlreadyRegstred') }}</div>
    <ProcessingDialog
      v-model="dialog"
      :isDialogPersistent="true"
      :isProcessing="isProcessing"
      :isSuccess="!transactionError"
      :processingTitle="$t('Account.Join.Dialog.Processing.Title')"
      :processingText="$t('Account.Join.Dialog.Processing.Text')"
      :successTitle="$t('Account.Join.Dialog.Success.Title')"
      :successText="$t('Account.Join.Dialog.Success.Text')"
      :errorTitle="$t('Account.Join.Dialog.Error.Title')"
      :closeBtnText="$t('ProcessingDialog.CloseButtonText')"
    >
      <div slot="text-error">
        <p class="generic-icon-note"><v-icon color="error" class="mr-1">error</v-icon><span>{{ $t('Account.Join.Dialog.Error.Text') }}</span></p>
        <p class="response-error">{{ transactionError }}</p>
        <p>{{ $t('Account.Join.Dialog.Error.Text.ContactSupport') }}</p>
      </div>
    </ProcessingDialog>
  </div>
</template>

<script>
  import store from '@/store'
  import config from '@/config'
  import Datepicker from 'vuejs-datepicker'
  import moment from 'moment'
  import CircleLoader from '@/components/common/CircleLoader'
  import ProcessingDialog from '@/components/common/ProcessingDialog'
  import lib from '@/library'
  export default {
    components: {
      Datepicker,
      CircleLoader,
      ProcessingDialog
    },
    data: () => ({
      confirmedPasswordField: undefined,
      dialog: false,
      isProcessing: false,
      transactionError: null,
      secretQuestionsArray: [],
      registrationDetails: {
        firstName: undefined,
        lastName: undefined,
        securityQuestion: undefined,
        IDDCSecurityQuestion: undefined,
        dob: new Date(),
        securityAnswer: '',
        state: undefined,
        userName: undefined,
        pass: undefined,
        mail: undefined,
        city: undefined,
        zipCode: undefined,
        address: undefined,
        ssn: undefined,
        phone: undefined,
        tc: undefined,
        title: undefined,
        gender: undefined
      },
      errorMessages: {
        firstName: false, // main err msg
        firstNameLength: false,
        lastName: false, // main err msg
        dob: false, // main err msg
        dobAdult: false,
        securityQuestion: false, // main err msg
        securityAnswer: false, // main err msg
        securityAnswerLength: false,
        state: false, // main err msg
        userName: false, // main err msg
        pass: false,
        passStrength: false,
        confirmedPassMissing: false, // main err msg
        confirmedPassNotSame: false,
        mail: false, // main err msg
        mailValid: false,
        city: false, // main err msg
        zipCode: false, // main err msg
        zipCodeValid: false,
        zipCodeNotDigit: false,
        address: false, // main err msg
        ssn: false, // main err msg
        ssnNonDigit: false,
        ssnLength: false,
        phone: false, // main err msg
        phoneNonDigit: false,
        phoneLength: false,
        tc: false, // main err msg
        title: false // main err msg
      }
    }),
    computed: {
      isLoggedIn () {
        return store.getters['isLoggedIn']
      },
      formSubmitSppiner () {
        return store.getters['getFormSubmitSppiner']
      },
      firstName: {
        get () {
          return this.registrationDetails.firstName || undefined
        },
        set (value) {
          if (value.length === 0) {
            this.errorMessages.firstName = true
            this.errorMessages.firstNameLength = undefined
          } else if (value.length > 0 && value.length < 2) {
            this.errorMessages.firstName = undefined
            this.errorMessages.firstNameLength = true
          } else {
            this.errorMessages.firstName = undefined
            this.errorMessages.firstNameLength = undefined
          }
          this.registrationDetails.firstName = value
        }
      },
      lastName: {
        get () {
          return this.registrationDetails.lastName || undefined
        },
        set (value) {
          if (value.length === 0) {
            this.errorMessages.lastName = true
          } else {
            this.errorMessages.lastName = undefined
          }
          this.registrationDetails.lastName = value
        }
      },
      dob: {
        get () {
          return this.registrationDetails.dob
        },
        set (value) {
          let yearsOld = this.calculateYear(value)
          if (new Date() < new Date(value)) {
            this.errorMessages.dob = true
            this.errorMessages.dobAdult = false
          } else if (yearsOld < 21) {
            this.errorMessages.dobAdult = true
            this.errorMessages.dob = false
          } else {
            this.errorMessages.dob = false
            this.errorMessages.dobAdult = false
          }
          this.registrationDetails.dob = value
        }
      },
      userName: {
        get () {
          return this.registrationDetails.userName || undefined
        },
        set (value) {
          if (value.length === 0) {
            this.errorMessages.userName = true
            this.errorMessages.userNameLength = undefined
          } else if (value.length > 0 && value.length < 6) {
            this.errorMessages.userName = undefined
            this.errorMessages.userNameLength = true
          } else {
            this.errorMessages.userName = undefined
            this.errorMessages.userNameLength = undefined
          }
          this.registrationDetails.userName = value
        }
      },
      pass: {
        get () {
          return this.registrationDetails.pass || undefined
        },
        set (value) {
          if (value.length === 0) {
            this.errorMessages.pass = true
            this.errorMessages.passStrength = undefined
          } else {
            if (!value.match(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{6,}$/)) {
              this.errorMessages.pass = undefined
              this.errorMessages.passStrength = true
            } else {
              this.errorMessages.pass = undefined
              this.errorMessages.passStrength = undefined
            }
            if (this.confirmPassword && (value !== this.confirmPassword)) {
              this.errorMessages.confirmedPassNotSame = true
            } else {
              this.errorMessages.confirmedPassNotSame = false
            }
          }
          this.registrationDetails.pass = value
        }
      },
      confirmPassword: {
        get () {
          return this.confirmedPasswordField
        },
        set (value) {
          if (value.length === 0) {
            this.errorMessages.confirmedPassMissing = true
            this.errorMessages.confirmedPassNotSame = false
          } else {
            this.errorMessages.confirmedPassMissing = false
            if (this.pass && (value !== this.pass)) {
              this.errorMessages.confirmedPassNotSame = true
            } else {
              this.errorMessages.confirmedPassNotSame = false
            }
          }
          this.confirmedPasswordField = value
        }
      },
      email: {
        get () {
          return this.registrationDetails.mail || undefined
        },
        set (value) {
          if (value.length === 0) {
            this.errorMessages.mail = true
            this.errorMessages.mailValid = false
          } else if (!value.match(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/)) { // regex used in type=''email'' in HTML
            this.errorMessages.mail = false
            this.errorMessages.mailValid = true
          } else {
            this.errorMessages.mail = false
            this.errorMessages.mailValid = false
          }
          this.registrationDetails.mail = value
        }
      },
      state: {
        get () {
          return this.registrationDetails.state || undefined
        },
        set (value) {
          if (value.length === 0) {
            this.errorMessages.state = true
          } else {
            this.errorMessages.state = undefined
          }
          this.registrationDetails.state = value
        }
      },
      IDDCSecurityQuestion: {
        get () {
          return this.registrationDetails.IDDCSecurityQuestion || undefined
        },
        set (value) {
          if (value.length === 0) {
            this.errorMessages.securityQuestion = true
          } else {
            this.errorMessages.securityQuestion = undefined
          }
          this.registrationDetails.IDDCSecurityQuestion = value
          this.registrationDetails.securityQuestion = this.secretQuestionsArray.find(e => e.IDDCSecretQuestion === value).Question
        }
      },
      securityAnswer: {
        get () {
          return this.registrationDetails.securityAnswer || undefined
        },
        set (value) {
          if (value.length === 0) {
            this.errorMessages.securityAnswer = true
            this.errorMessages.securityAnswerLength = undefined
          } else if (value.length > 0 && value.length < 2) {
            this.errorMessages.securityAnswer = undefined
            this.errorMessages.securityAnswerLength = true
          } else {
            this.errorMessages.securityAnswer = undefined
            this.errorMessages.securityAnswerLength = undefined
          }
          this.registrationDetails.securityAnswer = value
        }
      },
      city: {
        get () {
          return this.registrationDetails.city || undefined
        },
        set (value) {
          if (value.length === 0) {
            this.errorMessages.city = true
          } else {
            this.errorMessages.city = undefined
          }
          this.registrationDetails.city = value
        }
      },
      zipCode: {
        get () {
          return this.registrationDetails.zipCode || undefined
        },
        set (value) {
          if (value.length === 0) {
            this.errorMessages.zipCode = true
            this.errorMessages.zipCodeValid = false
            this.errorMessages.zipCodeNotDigit = false
          } else if (value.match(/\D/g)) {
            this.errorMessages.zipCodeNotDigit = true
            this.errorMessages.zipCode = false
            this.errorMessages.zipCodeValid = false
          } else if (value.length !== 5) {
            this.errorMessages.zipCode = false
            this.errorMessages.zipCodeValid = true
            this.errorMessages.zipCodeNotDigit = false
          } else {
            this.errorMessages.zipCode = undefined
            this.errorMessages.zipCodeValid = undefined
            this.errorMessages.zipCodeNotDigit = undefined
          }
          this.registrationDetails.zipCode = value
        }
      },
      address: {
        get () {
          return this.registrationDetails.address || undefined
        },
        set (value) {
          if (value.length === 0) {
            this.errorMessages.address = true
          } else {
            this.errorMessages.address = undefined
          }
          this.registrationDetails.address = value
        }
      },
      ssn: {
        get () {
          return this.registrationDetails.ssn || undefined
        },
        set (value) {
          if (value.length === 0) {
            this.errorMessages.ssn = true
            this.errorMessages.ssnNonDigit = false
          } else if (value.match(/\D/g)) {
            this.errorMessages.ssn = false
            this.errorMessages.ssnNonDigit = true
          } else {
            this.errorMessages.ssn = undefined
            this.errorMessages.ssnNonDigit = undefined
          }
          this.registrationDetails.ssn = value
          if (this.registrationDetails.ssn && this.registrationDetails.ssn.length !== 9) {
            this.errorMessages.ssnLength = true
          } else {
            this.errorMessages.ssnLength = false
          }
        }
      },
      phone: {
        get () {
          return this.registrationDetails.phone || undefined
        },
        set (value) {
          if (value.length === 0) {
            this.errorMessages.phone = true
            this.errorMessages.phoneNonDigit = false
          } else if (value.match(/\D/g)) {
            this.errorMessages.phone = false
            this.errorMessages.phoneNonDigit = true
          } else {
            this.errorMessages.phone = undefined
            this.errorMessages.phoneDigit = undefined
          }
          this.registrationDetails.phone = value
          if (this.registrationDetails.phone && this.registrationDetails.phone.length !== 10) {
            this.errorMessages.phoneLength = true
          } else {
            this.errorMessages.phoneLength = false
          }
          if (this.registrationDetails.phone && this.registrationDetails.phone.match(/\D/g)) {
            this.errorMessages.phoneNonDigit = true
          } else {
            this.errorMessages.phoneNonDigit = false
          }
        }
      },
      tc: {
        get () {
          return this.registrationDetails.tc || undefined
        },
        set (value) {
          if (value.length === 0) {
            this.errorMessages.tc = true
          } else {
            this.errorMessages.tc = undefined
          }
          this.registrationDetails.tc = value
        }
      },
      title: {
        get () {
          return this.registrationDetails.title || undefined
        },
        set (value) {
          if (value.length === 0) {
            this.errorMessages.title = true
          } else {
            this.errorMessages.title = undefined
          }
          this.registrationDetails.title = value
          switch (value) {
            case 'Mr.':
              this.registrationDetails.gender = 'M'
              break
            case 'Mrs.':
            case 'Miss.':
            case 'Ms.':
              this.registrationDetails.gender = 'F'
              break
          }
        }
      }
    },

    methods: {
      register () {
        if (this.isEverythingValid()) {
          this.isProcessing = true
          this.transactionError = null
          this.dialog = true
          store.dispatch('userServiceRegister', {
            'firstName': this.firstName,
            'lastName': this.lastName,
            'title': this.title,
            'gender': this.registrationDetails.gender,
            'IDDCSecurityQuestion': this.IDDCSecurityQuestion,
            'securityQuestion': this.registrationDetails.securityQuestion,
            'securityAnswer': this.securityAnswer,
            'dateOfBirth': moment(this.registrationDetails.dob).format(config.app.dateFormats.iso8601),
            'userName': this.userName,
            'password': this.pass,
            'email': this.email,
            'state': this.state,
            'city': this.city,
            'postCode': this.zipCode.toString(),
            'address': this.address,
            'ssn': this.ssn.toString(),
            'phone': this.phone.replace(/\D+/g, ''),
            'TC': this.tc
          })
          .then((response) => {
            if (response && response.exceptionType && response.message) {
              this.transactionError = response.message
            } else {
              this.isProcessing = false
            }
          })
          .catch((err) => {
            this.transactionError = err.message || this.$t('Account.Join.ErrorMsg.Generic')
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
      calculateYear (param) {
        let ageDifMs = Date.now() - param.getTime()
        let ageDate = new Date(ageDifMs)
        return Math.abs(ageDate.getUTCFullYear() - 1970)
      },
      probica () {
        if (this.isEverythingValid()) {
          this.isProcessing = true
          this.transactionError = null
          this.dialog = true
          return new Promise((resolve, reject) => {
            setTimeout(() => {
              resolve(console.log(this.registrationDetails))
              // reject(new Error('Whoops!'))
            }, 2000)
          })
          .catch((err) => {
            this.transactionError = err.message || this.$t('Account.Join.ErrorMsg.Generic')
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
      checkDOB () {
        if (this.dob.toDateString() === new Date().toDateString()) {
          this.errorMessages.dob = true
        } else {
          this.errorMessages.dob = false
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
      isAnyUnpopulatedField () {
        if (!this.registrationDetails.firstName) {
          this.errorMessages.firstName = true
        }
        if (!this.registrationDetails.lastName) {
          this.errorMessages.lastName = true
        }
        this.checkDOB()
        if (!this.registrationDetails.IDDCSecurityQuestion) {
          this.errorMessages.securityQuestion = true
        }
        if (!this.registrationDetails.securityAnswer) {
          this.errorMessages.securityAnswer = true
        }
        if (!this.registrationDetails.state) {
          this.errorMessages.state = true
        }
        if (!this.registrationDetails.userName) {
          this.errorMessages.userName = true
        }
        if (!this.registrationDetails.pass) {
          this.errorMessages.pass = true
        }
        if (!this.confirmedPasswordField) {
          this.errorMessages.confirmedPassMissing = true
        }
        if (!this.registrationDetails.mail) {
          this.errorMessages.mail = true
        }
        if (!this.registrationDetails.city) {
          this.errorMessages.city = true
        }
        if (!this.registrationDetails.city) {
          this.errorMessages.city = true
        }
        if (!this.registrationDetails.zipCode) {
          this.errorMessages.zipCode = true
        }
        if (!this.registrationDetails.address) {
          this.errorMessages.address = true
        }
        if (!this.registrationDetails.ssn) {
          this.errorMessages.ssn = true
        }
        if (!this.registrationDetails.phone) {
          this.errorMessages.phone = true
        }
        if (!this.registrationDetails.tc) {
          this.errorMessages.tc = true
        }
        if (!this.registrationDetails.title) {
          this.errorMessages.title = true
        }
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
      fetchSecretQuetions () {
        lib.rpcService.callBroker('BusinessUnitService', 'GetSecretQuestions')
        .then(response => {
          let res = response && response.result
          if (res) {
            this.secretQuestionsArray = res
          }
        }).catch((error) => {
          console.error(error)
        })
      },
      test () {
        if (!this.registrationDetails.title) {
          this.errorMessages.title = true
        } else {
          this.errorMessages.title = false
        }
      }
    },
    mounted () {
      this.fetchSecretQuetions()
    }
  }
</script>

<style lang="stylus" scoped>
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
  .vdp-datepicker.dob
    >>> input
      cursor pointer
  .t-and-c
    >>> label
      font-size 15px
  .response-error
    font-size 18px
    font-weight bold
</style>
