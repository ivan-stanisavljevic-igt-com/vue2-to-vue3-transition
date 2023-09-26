<template>
  <div class="personal-info ctsform" v-if="isLoggedIn && personalDetails">
    <h1 v-if="!accountSummaryFlow" key="about_you">{{ $t('Account.PersonalDetails.AboutYou') }}</h1>
    <div class="personaldetails-intro">
      <span key="helpContentFst">{{ $t('Account.PersonalDetails.Info.First') }}</span>
      <span key="helpContentSnd">{{ $t('Account.PersonalDetails.Info.Second') }}</span>
    </div>
    <p class="not-editable" key="helpContentThrd">{{ $t('Account.PersonalDetails.Info.Third') }}</p>
    <div class="control-block diss" :class="{ 'filled': firstName }">
      <input type="text" disabled="disabled" v-model="firstName" autocomplete="off"/>
      <label class="control-label" key="pd_firstName_label">{{ $t('Account.PersonalDetails.FirstNameLabel') }}</label>
    </div>
    <div class="vmsg invalid" v-if="errorMessages.firstName">{{ $t('Account.PersonalDetails.ErrorMessages.FirstName') }}</div>
    <div class="control-block diss" :class="{ 'filled': lastName }">
      <input type="text" disabled="disabled" v-model="lastName" autocomplete="off"/>
      <label class="control-label" key="pd_lastName_label">{{ $t('Account.PersonalDetails.LastNameLabel') }}</label>
    </div>
    <div class="vmsg invalid" v-if="errorMessages.lastName">{{ $t('Account.PersonalDetails.ErrorMessages.LastName') }}</div>
    <div class="control-block diss" :class="{ 'filled': userName }">
      <input type="text" v-model.trim="userName" autocomplete="off" disabled="disabled"/>
      <label class="control-label" key="pd_userName_label">{{ $t('Account.PersonalDetails.UserName') }}</label>
    </div>
    <div class="vmsg invalid" v-if="errorMessages.userName">{{ $t('Account.PersonalDetails.ErrorMessages.UserName') }}</div>
    <div class="control-block diss dd-menu" :class="{ 'filled': title }">
      <select class="input-field" disabled="disabled"  v-model="title" autocomplete="off">
        <option value="Mr.">{{ $t('Account.Join.Title.Mr') }}</option>
        <option value="Miss.">{{ $t('Account.Join.Title.Miss') }}</option>
        <option value="Mrs.">{{ $t('Account.Join.Title.Mrs') }}</option>
        <option value="Ms.">{{ $t('Account.Join.Title.Ms') }}</option>
      </select>
      <label class="control-label">{{ $t('Account.Join.Title') }}</label>
    </div>

    <!--Standard account template -->
    <template v-if="!accountSummaryFlow">
      <div class="control-block" :class="{ 'filled': phoneNumber }">
        <div class="flex-control-center">
          <input type="text" v-model="phoneNumber" id="phoneNumber" :class="{'width-150': editMode === 'phoneDisabled'}" autocomplete="off" ref="phoneDisabled" disabled="disabled" />
          <!-- @focusout="focusOut('phoneDisabled')" -->
          <label class="control-label">{{ $t('Account.PersonalDetails.Phone') }}</label>
          <v-btn @click="enableInput('phoneDisabled')" v-show="editMode !== 'phoneDisabled'" class="edit_btn">{{ $t('Account.PersonalDetails.Button.Edit') }}</v-btn>
          <v-btn @click="save()" v-show="editMode === 'phoneDisabled'" class="edit_btn save_btn">{{ $t('Account.PersonalDetails.Button.Save') }}</v-btn>
          <v-btn @click.stop="focusOut('phoneDisabled'); cancelEditPhoneNumber()" v-show="editMode === 'phoneDisabled'" class="edit_btn">{{ $t('Account.PersonalDetails.Button.Cancel') }}</v-btn>
        </div>
      </div>
      <div>
        <div class="vmsg invalid" v-if="errorMessages.phoneNumber">{{ $t('Account.PersonalDetails.ErrorMessages.PhoneNumber') }}</div>
      </div>
      
      <div class="control-block verification" :class="{ 'filled': mobileNumber }">
        <div class="flex-control-center">
          <input type="text" v-model="mobileNumber" id="mobileNumber" :class="{'width-150': editMode === 'mobileDisabled'}" autocomplete="off" ref="mobileDisabled" disabled="disabled" />
          <!-- @focusout="focusOut('mobileDisabled')" -->
          <label class="control-label">{{ $t('Account.PersonalDetails.Mobile') }}</label>
          <v-btn @click="enableInput('mobileDisabled')" v-show="editMode !== 'mobileDisabled'" class="edit_btn">{{ $t('Account.PersonalDetails.Button.Edit') }}</v-btn>
          <v-btn @click.stop="save()" v-show="editMode === 'mobileDisabled'" class="edit_btn save_btn">{{ $t('Account.PersonalDetails.Button.Save') }}</v-btn>
          <v-btn @click.stop="focusOut('mobileDisabled'); cancelEditMobilePhone()" v-show="editMode === 'mobileDisabled'" class="edit_btn">{{ $t('Account.PersonalDetails.Button.Cancel') }}</v-btn>
        </div>
        <account-verification-status  v-show="editMode !== 'mobileDisabled'" detail='phone' :isVerified="isPhoneVerified" :isCustomerVerified="isCustomerVerified"></account-verification-status>
      </div>
      <div>
        <div class="vmsg invalid" v-if="errorMessages.mobileNumber">{{ $t('Account.PersonalDetails.ErrorMessages.MobileNumber') }}</div>
      </div>
      <div class="control-block verification" :class="{ 'filled': email }">
        <div class="flex-control-center">
          <input type="text" v-model.trim="email" id="email" :class="{'width-150': editMode === 'emailDisabled'}" autocomplete="off" ref="emailDisabled" disabled="disabled" />
          <!-- @focusout="focusOut('emailDisabled')" -->
          <label class="control-label" key="pd_email_label">{{ $t('Account.PersonalDetails.EmailLabel') }}</label>
          <v-btn @click="enableInput('emailDisabled')" v-show="editMode !== 'emailDisabled'" class="edit_btn">{{ $t('Account.PersonalDetails.Button.Edit') }}</v-btn>
          <v-btn @click="save()" v-show="editMode === 'emailDisabled'" class="edit_btn save_btn">{{ $t('Account.PersonalDetails.Button.Save') }}</v-btn>
          <v-btn @click.stop="focusOut('emailDisabled'); cancelEditEmail()" v-show="editMode === 'emailDisabled'" class="edit_btn">{{ $t('Account.PersonalDetails.Button.Cancel') }}</v-btn>
        </div>
        <account-verification-status v-show="editMode !== 'emailDisabled'" detail='email' :isVerified="isEmailVerified" :isCustomerVerified="isCustomerVerified"></account-verification-status>
      </div>
      <div>
        <div class="vmsg invalid" v-if="errorMessages.mail" key="pd_email_label_error">{{ $t('Account.PersonalDetails.errorMessages.mail') }}</div>
        <div class="vmsg invalid" v-if="errorMessages.notAsConfirmedMail" key="email_notAsConfirmedMail">{{ $t('Account.PersonalDetails.errorMessages.notAsConfirmedMail') }}</div>
      </div>
      <div v-show="editMode === 'emailDisabled'">
        <div class="control-block" :class="{ 'filled': confirmedEmail }">
          <input type="text" v-model.trim="confirmedEmail" id="confirmedEmail" autocomplete="off" />
          <label class="control-label" key="pd_ConfirmedEmailLabel">{{ $t('Account.PersonalDetails.ConfirmedEmailLabel') }}</label>
        </div>
        <div>
          <div class="vmsg invalid" v-if="errorMessages.confirmedEmail" key="pd_confirmedEmail">{{ $t('Account.PersonalDetails.confirmedEmail') }}</div>
          <div class="vmsg invalid" v-if="errorMessages.confirmedEmailTwo" key="pd_confirmedEmailTwo">{{ $t('Account.PersonalDetails.confirmedEmailTwo') }}</div>
        </div>
      </div>
    </template>

    <!-- Account summary tempalte -->
    <template v-if="accountSummaryFlow">
      <div class="control-block" :class="{ 'filled': phoneNumber }">
        <input type="text" v-model="phoneNumber" id="phoneNumber" :class="{'width-150': editMode === 'phoneDisabled'}" autocomplete="off" ref="phoneDisabled" disabled="disabled" />
        <!-- @focusout="focusOut('phoneDisabled')" -->
        <label class="control-label">{{ $t('Account.PersonalDetails.Phone') }}</label>
        <v-btn @click="enableInput('phoneDisabled')" v-show="editMode !== 'phoneDisabled'" class="edit_btn">{{ $t('Account.PersonalDetails.Button.Edit') }}</v-btn>
        <v-btn @click="save()" v-show="editMode === 'phoneDisabled'" class="edit_btn save_btn">{{ $t('Account.PersonalDetails.Button.Save') }}</v-btn>
        <v-btn @click.stop="focusOut('phoneDisabled'); cancelEditPhoneNumber()" v-show="editMode === 'phoneDisabled'" class="edit_btn">{{ $t('Account.PersonalDetails.Button.Cancel') }}</v-btn>
      </div>
      <div>
        <div class="vmsg invalid" v-if="errorMessages.phoneNumber">{{ $t('Account.PersonalDetails.ErrorMessages.PhoneNumber') }}</div>
      </div>
      <div class="control-block verification" :class="{ 'filled': mobileNumber }">
        <div class="flex-control-center">
          <input type="text" v-model="mobileNumber" id="mobileNumber" :class="{'width-150': editMode === 'mobileDisabled'}" autocomplete="off" ref="mobileDisabled" disabled="disabled" />
          <!-- @focusout="focusOut('mobileDisabled')" -->
          <label class="control-label">{{ $t('Account.PersonalDetails.Mobile') }}</label>
          <v-btn @click="enableInput('mobileDisabled')" v-show="editMode !== 'mobileDisabled'" class="edit_btn">{{ $t('Account.PersonalDetails.Button.Edit') }}</v-btn>
          <v-btn @click.stop="save()" v-show="editMode === 'mobileDisabled'" class="edit_btn save_btn">{{ $t('Account.PersonalDetails.Button.Save') }}</v-btn>
          <v-btn @click.stop="focusOut('mobileDisabled'); cancelEditMobilePhone()" v-show="editMode === 'mobileDisabled'" class="edit_btn">{{ $t('Account.PersonalDetails.Button.Cancel') }}</v-btn>
        </div>
        <account-verification-status  v-show="editMode !== 'mobileDisabled'" detail='phone' :isVerified="isPhoneVerified" :isCustomerVerified="isCustomerVerified"></account-verification-status>
      </div>
      <div>
        <div class="vmsg invalid" v-if="errorMessages.mobileNumber">{{ $t('Account.PersonalDetails.ErrorMessages.MobileNumber') }}</div>
      </div>
      <div class="control-block verification" :class="{ 'filled': email }">
        <div class="flex-control-center">
          <input type="text" v-model.trim="email" id="email" :class="{'width-150': editMode === 'emailDisabled'}" autocomplete="off" ref="emailDisabled" disabled="disabled" />
          <!-- @focusout="focusOut('emailDisabled')" -->
          <label class="control-label" key="pd_email_label">{{ $t('Account.PersonalDetails.EmailLabel') }}</label>
          <v-btn @click="enableInput('emailDisabled')" v-show="editMode !== 'emailDisabled'" class="edit_btn">{{ $t('Account.PersonalDetails.Button.Edit') }}</v-btn>
          <v-btn @click="save()" v-show="editMode === 'emailDisabled'" class="edit_btn save_btn">{{ $t('Account.PersonalDetails.Button.Save') }}</v-btn>
          <v-btn @click.stop="focusOut('emailDisabled'); cancelEditEmail()" v-show="editMode === 'emailDisabled'" class="edit_btn">{{ $t('Account.PersonalDetails.Button.Cancel') }}</v-btn>
        </div>
        <account-verification-status v-show="editMode !== 'emailDisabled'" detail='email' :isVerified="isEmailVerified" :isCustomerVerified="isCustomerVerified"></account-verification-status>
      </div>
      <div>
        <div class="vmsg invalid" v-if="errorMessages.mail" key="pd_email_label_error">{{ $t('Account.PersonalDetails.errorMessages.mail') }}</div>
        <div class="vmsg invalid" v-if="errorMessages.notAsConfirmedMail" key="email_notAsConfirmedMail">{{ $t('Account.PersonalDetails.errorMessages.notAsConfirmedMail') }}</div>
      </div>
      <div v-show="editMode === 'emailDisabled'">
        <div class="control-block" :class="{ 'filled': confirmedEmail }">
          <input type="text" v-model.trim="confirmedEmail" id="confirmedEmail" autocomplete="off"/>
          <label class="control-label" key="pd_ConfirmedEmailLabel">{{ $t('Account.PersonalDetails.ConfirmedEmailLabel') }}</label>
        </div>
        <div>
          <div class="vmsg invalid" v-if="errorMessages.confirmedEmail" key="pd_confirmedEmail">{{ $t('Account.PersonalDetails.confirmedEmail') }}</div>
          <div class="vmsg invalid" v-if="errorMessages.confirmedEmailTwo" key="pd_confirmedEmailTwo">{{ $t('Account.PersonalDetails.confirmedEmailTwo') }}</div>
        </div>
      </div>
    </template>
    <h1 key="your_adress">{{ $t('Account.PersonalDetails.YourAddress') }}</h1>
    <div class="control-block diss" :class="{ 'filled': address }">
      <input type="text" v-model="address" autocomplete="off" disabled="disabled" />
      <label class="control-label">{{ $t('Account.PersonalDetails.StreetNNumber') }}</label>
    </div>
    <div>
      <div class="vmsg invalid" v-if="errorMessages.address" v-html="$t('Account.PersonalDetails.ErrorMessages.Address')"></div>
    </div>
    <div class="control-block diss" :class="{ 'filled': zipCode }">
      <input type="text" v-model="zipCode" autocomplete="off" disabled="disabled" />
      <label class="control-label">{{ $t('Account.PersonalDetails.ZIP') }}</label>
    </div>
    <div>
      <div class="vmsg invalid" v-if="errorMessages.zip">{{ $t('Account.PersonalDetails.ErrorMessages.ZIP') }}</div>
    </div>
    <div class="control-block diss" :class="{ 'filled': city }">
      <input type="text" v-model="city" autocomplete="off" disabled="disabled" />
      <label class="control-label">{{ $t('Account.PersonalDetails.Town') }}</label>
    </div>
    <div>
      <div class="vmsg invalid" v-if="errorMessages.city">{{ $t('Account.PersonalDetails.ErrorMessages.City') }}</div>
    </div>
    <div class="control-block pseudofilled diss" :class="{ 'filled': state }">
      <select class="input-field dd-menu" v-model="state" autocomplete="off" disabled="disabled">
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
      <label class="control-label">{{ $t('Account.PersonalDetails.State') }}</label>
    </div>
    <div>
      <div class="vmsg invalid" v-if="errorMessages.state">{{ $t('Account.PersonalDetails.errorMessages.state') }}</div>
    </div>



    <ProcessingDialog
      v-model="dialog"
      :isDialogPersistent="true"
      :isProcessing="isProcessing"
      :isSuccess="!transactionError"
      :processingTitle="processingTitle || $t('Account.PersonalDetails.Dialog.Processing.Title')"
      :processingText="processingText || $t('Account.PersonalDetails.Dialog.Processing.Text')"
      :successTitle="successTitle || $t('Account.PersonalDetails.Dialog.Success.Title')"
      :successText="successText || $t('Account.PersonalDetails.Dialog.Success.Text')"
      :errorTitle="errorTitle || $t('Account.PersonalDetails.Dialog.Error.Title')"
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
  import config from '@/config'
  import lib from '@/library'
  import ProcessingDialog from '@/components/common/ProcessingDialog'
  import router from '@/router'
  import Branding from '@/components/mixins/Branding'
  import Validation from '@/components/mixins/Validation'
  import AccountVerificationStatus from '@/components/account/Verification/AccountVerificationStatus'

  export default {
    name: 'AccountPersonalDetailsComponent',

    components: {
      ProcessingDialog,
      AccountVerificationStatus
    },
    mixins: [
      Branding,
      Validation
    ],

    data: () => ({
      personalDetails: undefined,
      personalDetailsCheck: undefined,
      isVerEmail: undefined,
      errorMessages: {
        firstName: undefined,
        lastName: undefined,
        username: undefined,
        phoneNumber: undefined,
        mobileNumber: undefined,
        mail: undefined,
        notAsConfirmedMail: undefined,
        confirmedEmail: undefined,
        confirmedEmailTwo: undefined,
        address: undefined,
        zip: undefined,
        city: undefined,
        state: undefined
      },
      confirmedMailField: '',
      dialog: false,
      isProcessing: false,
      transactionError: null,
      processingTitle: null,
      processingText: null,
      successTitle: null,
      successText: null,
      errorTitle: null,
      errorText: null,
      chosenUserSA4Login: null,
      chosenUserSA4AccountRecovery: null,
      confirmedEmailVisible: false,
      editMode: null
    }),

    computed: {
      isLoggedIn () {
        return store.getters['isLoggedIn']
      },
      dateFormats () {
        return config.app.dateFormats
      },
      formSubmitSppiner () {
        return store.getters['getFormSubmitSppiner']
      },
      firstName: {
        get () {
          return this.personalDetails.FirstName || undefined
        },
        set (value) {
          if (value.length === 0 || !value.match(this.vldFirstName)) {
            this.errorMessages.firstName = true
          } else {
            this.errorMessages.firstName = undefined
          }
          this.personalDetails.FirstName = value
        }
      },
      lastName: {
        get () {
          return this.personalDetails.LastName || undefined
        },
        set (value) {
          if (value.length === 0 || !value.match(this.vldLastName)) {
            this.errorMessages.lastName = true
          } else {
            this.errorMessages.lastName = undefined
          }
          this.personalDetails.LastName = value
        }
      },
      userName: {
        get () {
          return this.personalDetails.UserName
        }
      },
      dobLocalTime: {
        get () {
          let doB = this.personalDetails && this.personalDetails.DateOfBirth && this.personalDetails.DateOfBirth.split('T')
          let arrDate = doB && Array.isArray(doB) ? doB[0].split('-') : doB.split('-')
          let year = arrDate && arrDate[0]
          let month = arrDate && arrDate[1]
          let day = arrDate && arrDate[2]
          return `${month}/${day}/${year}`
        }
      },
      phoneNumber: {
        get () {
          return this.personalDetails.HomePhone || undefined
        },
        set (value) {
          if (value.length !== this.vldPhoneLength || value.match(this.vldPhone)) {
            this.errorMessages.phoneNumber = true
          } else {
            this.errorMessages.phoneNumber = undefined
          }
          this.personalDetails.HomePhone = value
        }
      },
      mobileNumber: {
        get () {
          return this.personalDetails.MobilePhone || undefined
        },
        set (value) {
          if (value.length !== this.vldMobileLength || value.match(this.vldMobile)) {
            this.errorMessages.mobileNumber = true
          } else {
            this.errorMessages.mobileNumber = undefined
          }
          this.personalDetails.MobilePhone = value
        }
      },
      email: {
        get () {
          return this.personalDetails.PrimaryEmail || undefined
        },
        set (value) {
          if (value.length === 0 || !value.match(this.vldEmail) || value.length > 255) {
            this.errorMessages.mail = true
          } else if (value.toLowerCase() !== this.confirmedEmail.toLowerCase()) {
            this.errorMessages.mail = undefined
            this.errorMessages.notAsConfirmedMail = true
          } else {
            this.errorMessages.mail = undefined
            this.errorMessages.notAsConfirmedMail = undefined
            if (value.toLowerCase() === this.confirmedEmail.toLowerCase()) {
              this.errorMessages.confirmedEmailTwo = undefined
            }
          }
          this.personalDetails.PrimaryEmail = value
          this.confirmedEmailVisible = true
        }
      },
      confirmedEmail: {
        get () {
          return this.confirmedMailField
        },
        set (value) {
          if (value.length === 0) {
            this.errorMessages.confirmedEmail = true
            this.errorMessages.confirmedEmailTwo = undefined
          } else if (value.toLowerCase() !== this.email.toLowerCase()) {
            this.errorMessages.confirmedEmail = undefined
            this.errorMessages.confirmedEmailTwo = true
          } else {
            this.errorMessages.confirmedEmail = undefined
            this.errorMessages.confirmedEmailTwo = undefined
            if (value.toLowerCase() === this.email.toLowerCase()) {
              this.errorMessages.notAsConfirmedMail = undefined
            }
          }
          this.confirmedMailField = value
        }
      },
      address: {
        get () {
          return this.personalDetails.StreetAddress || undefined
        },
        set (value) {
          let addressRegEx = this.vldAaddressLength
          if (!value.match(addressRegEx)) {
            this.errorMessages.address = true
          } else {
            this.errorMessages.address = undefined
          }
          this.personalDetails.StreetAddress = value
        }
      },
      zipCode: {
        get () {
          return this.personalDetails.PostCode || undefined
        },
        set (value) {
          if (value.length !== this.vldZipCodeLength || value.match(this.vldZipCode)) {
            this.errorMessages.zip = true
          } else {
            this.errorMessages.zip = undefined
          }
          this.personalDetails.PostCode = value
        }
      },
      city: {
        get () {
          return this.personalDetails.City || undefined
        },
        set (value) {
          if (value.length === 0 || value.match(this.vldCity)) {
            this.errorMessages.city = true
          } else {
            this.errorMessages.city = undefined
          }
          this.personalDetails.City = value
        }
      },
      state: {
        get () {
          return this.personalDetails.CountyOrStateOrProvince || undefined
        },
        set (value) {
          if (value.length === 0) {
            this.errorMessages.state = true
          } else {
            this.errorMessages.state = undefined
          }
          this.personalDetails.CountyOrStateOrProvince = value
        }
      },
      title: {
        get () {
          return this.personalDetails.Title
        },
        set (value) {
          this.personalDetails.Title = value
          this.personalDetails.Salutation = value
          switch (value) {
            case 'Mr.':
              this.personalDetails.IDMMGender = 'M'
              break
            case 'Mrs.':
            case 'Miss.':
            case 'Ms.':
              this.personalDetails.IDMMGender = 'F'
              break
          }
        }
      },
      useSA4UserLogin: {
        get () {
          let pref = this.personalDetails.Preferences.find(pref => pref.Name === 'UseSA4UserLogin')
          let prefValue = (pref.Value === 'SECQ2' || pref.Value === 'SELF_BY_PIN' || pref.Value === 'PIN_OR_SECQ2' || pref.Value === 'PIN_AND_SECQ2') ? 'SELF_BY_PIN' : pref.Value
          if (!this.chosenUserSA4Login) {
            this.chosenUserSA4Login = prefValue
          }
          return prefValue || undefined
        },
        set (value) {
          let pref = this.personalDetails.Preferences.find(pref => pref.Name === 'UseSA4UserLogin')
          pref.Value = value
        }
      },
      useSA4AccountRecovery: {
        get () {
          let pref = this.personalDetails.Preferences.find(pref => pref.Name === 'UseSA4AccountRecovery')
          let prefValue = (pref.Value === 'SECQ2' || pref.Value === 'SELF_BY_PIN' || pref.Value === 'PIN_OR_SECQ2' || pref.Value === 'PIN_AND_SECQ2') ? 'SELF_BY_PIN' : pref.Value
          if (!this.chosenUserSA4AccountRecovery) {
            this.chosenUserSA4AccountRecovery = prefValue
          }
          return prefValue || undefined
        },
        set (value) {
          let pref = this.personalDetails.Preferences.find(pref => pref.Name === 'UseSA4AccountRecovery')
          pref.Value = value
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
      },
      allowAccountUpdate () {
        return store.getters['getAllowAccountUpdate']
      },
      allowedSATypes () {
        return store.getters['getAllowedSATypes']
      },
      accountSummaryFlow () {
        return window.ctsautoconf.ACCOUNT_SUMMARY_FLOW || false
      },
      usState: () => window.ctsautoconf.STATE,
      NoSAAccRecoveryLabel () {
        return (this.usState === 'NJ' || (this.usState && this.usState.toLowerCase() === 'ia')) ? 'Account.PersonalDetails.UserPreferences.NoStrongAuthentication.SSNDOB' : 'Account.PersonalDetails.UserPreferences.NoStrongAuthentication'
      },
      isCustomerVerified () {
        return store.getters['getIsCustomerVerified']
      },
      isEmailVerified () {
        return store.getters['getIsEmailVerified']
      },
      isPhoneVerified () {
        return store.getters['getIsPhoneVerified']
      },
      sa4AccountRecoveryShouldBeShown () {
        return this.isCustomerVerified || this.useSA4AccountRecovery === 'SELF_BY_PIN' || this.chosenUserSA4AccountRecovery === 'SELF_BY_PIN'
      },
      sa4UserLoginShouldBeShown () {
        return this.isCustomerVerified || this.useSA4UserLogin === 'SELF_BY_PIN' || this.chosenUserSA4Login === 'SELF_BY_PIN'
      },
      isUserPreferencesShouldBeShown () {
        return this.sa4AccountRecoveryShouldBeShown || this.sa4UserLoginShouldBeShown
      },
      isPersonalDetailsChanged () {
        return this.personalDetails.MobilePhone !== this.personalDetailsCheck.MobilePhone ||
        this.personalDetails.PrimaryEmail !== this.personalDetailsCheck.PrimaryEmail ||
        this.personalDetails.HomePhone !== this.personalDetailsCheck.HomePhone
      }
    },

    methods: {
      save () {
        if (this.isEverythingValid && this.isPersonalDetailsChanged) {
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
            this.confirmedEmailVisible = false
            this.editMode = null
            this.fetchPersonalDetails()
            this.clearConfirmedEmailFields()
          })
        }
      },
      closeDialog () {
        if (!this.transactionError) {
          store.dispatch('getCustomerContext').then(function () {
            setTimeout(function () {
              let isCustomerVerified = store.getters['getIsCustomerVerified']
              if (!isCustomerVerified) {
                router.push({name: 'account-non-verified'})
              }
            }, 1000)
          })
        }
      },
      fetchPersonalDetails () {
        lib.rpcService.callBroker('psregistrationservice', 'getpersonaldetails', {
          'IDDCApplication': 'TEXAS',
          'preferenceNames': ['UseSA4UserLogin', 'UseSA4AccountRecovery']
        }).then(response => {
          if (response.result) {
            this.personalDetails = response.result
            this.personalDetailsCheck = {...response.result}
            this.chosenUserSA4AccountRecovery = null
            this.chosenUserSA4Login = null
          }
        }).catch((error) => {
          console.log(error)
        })
      },
      shouldBeShown (saMode, saPurpose) {
        switch (saMode) {
          case 1:
            return true
          case 2:
            return this.isPhoneVerified || (saPurpose === 'sa4AccountRecovery' ? (this.useSA4AccountRecovery === 'SELF_BY_PIN' || this.chosenUserSA4AccountRecovery === 'SELF_BY_PIN') : (this.useSA4UserLogin === 'SELF_BY_PIN' || this.chosenUserSA4Login === 'SELF_BY_PIN'))
          case 3:
            return this.isPhoneVerified || (saPurpose === 'sa4AccountRecovery' ? (this.useSA4AccountRecovery === 'PIN_OR_SECQ2' || this.chosenUserSA4AccountRecovery === 'PIN_OR_SECQ2') : (this.useSA4UserLogin === 'PIN_OR_SECQ2' || this.chosenUserSA4Login === 'PIN_OR_SECQ2'))
          case 4:
            return this.isPhoneVerified || (saPurpose === 'sa4AccountRecovery' ? (this.useSA4AccountRecovery === 'PIN_AND_SECQ2' || this.chosenUserSA4AccountRecovery === 'PIN_AND_SECQ2') : (this.useSA4UserLogin === 'PIN_AND_SECQ2' || this.chosenUserSA4Login === 'PIN_AND_SECQ2'))
        }
      },
      clearConfirmedEmailFields () {
        this.confirmedEmail = ''
        this.errorMessages.confirmedEmailTwo = undefined
        this.errorMessages.confirmedEmail = undefined
      },
      enableInput (itemDisabled) {
        this.$refs[itemDisabled].removeAttribute('disabled')
        this.$refs[itemDisabled].focus()
        switch (this.editMode) {
          case 'emailDisabled':
            this.cancelEditEmail()
            break
          case 'phoneDisabled':
            this.cancelEditPhoneNumber()
            break
          case 'mobileDisabled':
            this.cancelEditMobilePhone()
            break
        }
        this.editMode && this.$refs[this.editMode].setAttribute('disabled', '')
        this.editMode = itemDisabled
      },
      focusOut (itemDisabled) {
        this.$refs[itemDisabled].setAttribute('disabled', '')

        this.editMode = null
      },
      cancelEditEmail () {
        this.fetchPersonalDetails()
        this.errorMessages.notAsConfirmedMail = undefined
        this.errorMessages.mail = undefined
        this.clearConfirmedEmailFields()
      },
      cancelEditMobilePhone () {
        this.fetchPersonalDetails()
        this.errorMessages.mobileNumber = undefined
      },
      cancelEditPhoneNumber () {
        this.fetchPersonalDetails()
        this.errorMessages.phoneNumber = undefined
      }
    },
    created () {
    },
    mounted () {
      this.fetchPersonalDetails()
    }
  }
</script>

<style lang="stylus" scoped>
  @import '~@/css/config'
  @import '~@/css/mixins'
  .personal-info
    cursor default
    .control-block
      .flex-control-center
        display: flex
        flex: 1 1 auto
        width: 100%
        align-items: center
        input
          width: auto;
          order: 1;
          flex: 1 0 auto;
          padding: 10px 5px;
          box-sizing: border-box
        @media mobile
          input.width-150
            width 150px
        label
          height: 45px;
          line-height: normal;
          position: static;
          padding: 0;
          display: flex;
          align-items: center
          width: 29%
          align-items: center
          background-color transparent 
        .edit_btn.save_btn
          margin-right 4px
        button 
          order: 2;
          min-width: auto;
          padding: 5px;
          font-size: 14px;
          padding: 0px 15px;
          font-size: 12px;
          margin: 0;
          z-index: 5;
    .not-editable
      margin-top 10px
    h1
      text-align center
    h1:not(:first-child)
      padding 20px 0
    .diss
      background-color #dbdbdb
      padding 0 5px
      label
        padding 0 5px
    .dd-menu
      cursor pointer
      >>> select
        cursor pointer
    .ver-item
      display: block
  .response-error
    font-size 18px
    font-weight bold
  .personal-info.ctsform
    @media mobile
      input.width-150
        width 150px
    .edit_btn.save_btn
      margin-right 4px
    .control-block.verification
      height auto
      flex-direction column
      align-items flex-start
      padding-bottom 10px
      .flex-control-center
        display: flex
        flex: 1 1 auto
        width: 100%
        align-items: center
</style>
