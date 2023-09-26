<template>
    <div>
      <!-- Scan Drivers License -->
      <div class="mb-container" v-if="isOpenedFromWebView && scanData">
        <p class="reg_driver_license_qr_text">{{$t('Account.CreateAccount.DLQRCode')}}</p>
        <div class="mb-desc" v-if="brandKey ==='dn' || brandKey ==='dnw'">{{ $t('Account.Join.ScanDriversLicenseDesc') }}</div>
        <v-btn x-large @click.stop="scanID()"><span class="reg_driver_license"></span><span class="reg_driver_license_text">{{ $t('Account.Join.ScanID') }}</span></v-btn>
      </div> 

      <!-- FIRST NAME -->
      <div class="control-block" :class="{ 'filled': firstName }">
        <input type="text" v-model.trim="firstName" id="firstName" autocomplete="off" maxlength="60" @focusout="!registrationDetails.firstName ? errorMessages.firstName = true : errorMessages.firstName = false"/>
        <label class="control-label">{{ $t('Account.Join.FirstName') }}<span class="control-label-required"> *</span></label>
      </div>
      <!-- FIRST NAME VALIDATION -->
      <div>
        <div class="vmsg invalid" v-if="errorMessages.firstName" id="err_msg_firstName_missing" v-html="$t('Account.Join.ErrorMsg.FirstName')"></div>
        <div class="vmsg invalid" v-if="errorMessages.firstNameLength" id="err_msg_firstName_length" v-html="$t('Account.Join.ErrorMsg.FirstNameIncorrect')"></div>
        <div class="vmsg invalid" v-if="errorR === 'duplicatecustomerdata'" id="err_msg_dateOfBirth_adult">{{ $t('Account.Join.ErrorMsg.DuplicateCustomerData') }}</div>
      </div>

      <!-- LAST NAME -->
      <div class="control-block" :class="{ 'filled': lastName }">
        <input type="text" v-model.trim="lastName" id="lastName" autocomplete="off" maxlength="60" @focusout="!registrationDetails.lastName ? errorMessages.lastName = true : errorMessages.lastName = false"/>
        <label class="control-label">{{ $t('Account.Join.LastName') }}<span class="control-label-required"> *</span></label>
      </div>
      <!-- LAST NAME VALIDATION -->
      <div>
        <div class="vmsg invalid" v-if="errorMessages.lastName" id="err_msg_lastName_missing" v-html="$t('Account.Join.ErrorMsg.LastName')"></div>
        <div class="vmsg invalid" v-if="errorMessages.lastNameLength" id="err_msg_lastName_length" v-html="$t('Account.Join.ErrorMsg.LastNameIncorrect')"></div>
        <div class="vmsg invalid" v-if="errorR === 'duplicatecustomerdata'" id="err_msg_dateOfBirth_adult">{{ $t('Account.Join.ErrorMsg.DuplicateCustomerData') }}</div>
      </div>
      <!-- SSN -->
      <div class="control-block" :class="{ 'filled': ssn }">
        <input type="text" inputmode="numeric" v-model.trim="ssn" id="ssn" autocomplete="off" :maxlength="vldSsnLength" @focusout="!registrationDetails.ssn ? errorMessages.ssn = true : errorMessages.ssn = false"/>
        <label class="control-label">{{ $t('Account.Join.Last4SSN') }}<span class="control-label-required"> *</span></label>
      </div>
      <!-- SSN VALIDATION -->
      <div>
        <div class="vmsg invalid" v-if="errorMessages.ssn" id="err_msg_ssn_missing" v-html="$t('Account.Join.ErrorMsg.Last4SSN')"></div>
        <div class="vmsg invalid" v-if="errorMessages.ssnNonDigit" id="err_msg_ssn_not_digit" v-html="$t('Account.Join.ErrorMsg.Last4SSNNonDigit')"></div>
        <div class="vmsg invalid" v-if="errorMessages.ssnLength" id="err_msg_ssn_length" v-html="$t('Account.Join.ErrorMsg.Last4SSNLength', { length: vldSsnLength })"></div>
      </div>
      <!-- DATE OF BIRTH -->
      <div class="control-block" :class="{ 'filled': dateOfBirth }" @click="onDateBirth">
        <v-menu
            ref="datePickerMenu"
            v-model="datePickerMenu"
            :close-on-click="true"
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
            <input type="text" v-model.trim="formattedDate" id="dateOfBirth" autocomplete="off" readonly name="reg-dob" @focusout="DOBFocusOut"/>
            <label class="control-label">{{ $t('Account.Join.DOB') }}<span class="control-label-required"> *</span></label>
          </template>
          <v-date-picker ref="picker" :max="maxDate" @change="checkDateOfBirth()" v-model="dateOfBirth" no-title scrollable ></v-date-picker>
        </v-menu>
      </div>
      <!-- DATE OF BIRTH VALIDATION -->
      <div>
        <div class="vmsg invalid" v-if="errorMessages.dateOfBirth" id="err_msg_dateOfBirth_missing">{{ $t('Account.Join.ErrorMsg.MissingDOB') }}</div>
        <div class="vmsg invalid" v-if="errorMessages.dateOfBirthAdult" id="err_msg_dateOfBirth_adult">{{ $t('Account.Join.ErrorMsg.Adult',{legalAge: legalAge}) }}</div>
        <div class="vmsg invalid" v-if="errorR === 'underagecustomer'" id="err_msg_dateOfBirth_adult">{{ $t('Account.Join.ErrorMsg.UnderAgeCustomer') }}</div>
        <div class="vmsg invalid" v-if="errorR === 'duplicatecustomerdata'" id="err_msg_dateOfBirth_adult">{{ $t('Account.Join.ErrorMsg.DuplicateCustomerData') }}</div>
      </div>
      <!-- GOOGLE LOOKUP ADDRESS -->
      <div v-show="(MobilelocalServer && googlePlacesApiMobileAppEnabled && !enterAddressManually) || (googlePlacesApiEnabled && !MobilelocalServer && !enterAddressManually)">
        <div>
          <div class="control-block street-address" :class="{ 'filled': fullSelectedAddress }">
            <input type="text" v-model.trim="fullSelectedAddress" id="fullSelectedAddress" autocomplete="off" maxlength="200" @input="addressChanged()" @focusout="streetAddressFocusOut" ref="addressAutocomplete" placeholder="" /> <!-- @focus="addressFocus" -->
            <label class="control-label">{{ $t('Account.JoinUs.StartLookingForAddress')}}<span class="control-label-required"> *</span></label>
            <div class="control-block cs" v-if="googlePlacesApiMobileAppEnabled && MobilelocalServer && showGoogleAddressLookup && !enterAddressManually" :class="{ 'filled': selectedAddress }"> <!-- @click="expandAddresses()" -->
              <v-select
                class="custom-select"
                id="googlePlacesApiList"
                v-model="selectedAddress"
                @change="addressSelected"
                :items="googlePlacessAddresses"
                :menu-props="{value: addressesFromApp, contentClass: 'select_list_address' }"
                item-text="addressText"
                item-value="addressDetails"
                attach>
                <template slot='selection' slot-scope='{ item }' v-if="false">
                  <div>
                    <span class="firstPartOfAddress" v-html="item.addressStreet"></span>
                    <span class="secondPartOfAddress" v-html="item.addressOther"></span>
                  </div>
                </template>
                <template slot='item' slot-scope='{ item }'>
                  <div>
                    <div class="firstPartOfAddress" v-html="item.addressStreet"></div>
                    <div class="secondPartOfAddress" v-html="item.addressOther"></div>
                  </div>
                </template>
              </v-select>
              <label class="control-label" v-if="false">{{ $t('Account.JoinUs.StartLookingForAddress')}}</label>
            </div>
          </div>
          <!-- GOOGLE LOOKUP ADDRESS VALIDATION -->
          <div>
            <div class="vmsg invalid" v-if="errorMessages.address || errorMessages.city || errorMessages.state || errorMessages.zipCode || errorMessages.zipCodeValid || errorMessages.zipCodeNotDigit" id="err_msg_address_missing">
              <span v-if="errorMessages.address && errorMessages.city && errorMessages.state && (errorMessages.zipCode || errorMessages.zipCodeValid || errorMessages.zipCodeNotDigit)">{{ $t('Account.Join.ErrorMsg.AllFieldsMissing') }}</span>
              <span v-else-if="errorMessages.address && errorMessages.city && errorMessages.state && !(errorMessages.zipCode && errorMessages.zipCodeValid && errorMessages.zipCodeNotDigit)">{{ $t('Account.Join.ErrorMsg.ThreeFieldsMissing', { field1: $t('Account.Join.ErrorMsg.StreetFieldMissing'), field2: $t('Account.Join.ErrorMsg.CityFieldMissing'), field3: $t('Account.Join.ErrorMsg.StateFieldMissing')} )}}</span>
              <span v-else-if="errorMessages.address && errorMessages.city && (errorMessages.zipCode || errorMessages.zipCodeValid || errorMessages.zipCodeNotDigit) && !errorMessages.state">{{ $t('Account.Join.ErrorMsg.ThreeFieldsMissing', { field1: $t('Account.Join.ErrorMsg.StreetFieldMissing'), field2: $t('Account.Join.ErrorMsg.CityFieldMissing'), field3: $t('Account.Join.ErrorMsg.ZipCodeFieldMissing')} )}}</span>
              <span v-else-if="errorMessages.address && errorMessages.state && (errorMessages.zipCode || errorMessages.zipCodeValid || errorMessages.zipCodeNotDigit) && !errorMessages.city">{{ $t('Account.Join.ErrorMsg.ThreeFieldsMissing', { field1: $t('Account.Join.ErrorMsg.StreetFieldMissing'), field2: $t('Account.Join.ErrorMsg.StateFieldMissing'), field3: $t('Account.Join.ErrorMsg.ZipCodeFieldMissing')} )}}</span>
              <span v-else-if="errorMessages.city && errorMessages.state && (errorMessages.zipCode || errorMessages.zipCodeValid || errorMessages.zipCodeNotDigit) && !errorMessages.address">{{ $t('Account.Join.ErrorMsg.ThreeFieldsMissing', { field1: $t('Account.Join.ErrorMsg.CityFieldMissing'), field2: $t('Account.Join.ErrorMsg.StateFieldMissing'), field3: $t('Account.Join.ErrorMsg.ZipCodeFieldMissing')} )}}</span>
              <span v-else-if="errorMessages.address && errorMessages.city && !(errorMessages.state && errorMessages.zipCode && errorMessages.zipCodeValid && errorMessages.zipCodeNotDigit)">{{ $t('Account.Join.ErrorMsg.TwoFieldsMissing', { field1: $t('Account.Join.ErrorMsg.StreetFieldMissing'), field2: $t('Account.Join.ErrorMsg.CityFieldMissing')} )}}</span>
              <span v-else-if="errorMessages.address && errorMessages.state && !(errorMessages.city && errorMessages.zipCode && errorMessages.zipCodeValid && errorMessages.zipCodeNotDigit)">{{ $t('Account.Join.ErrorMsg.TwoFieldsMissing', { field1: $t('Account.Join.ErrorMsg.StreetFieldMissing'), field2: $t('Account.Join.ErrorMsg.StateFieldMissing')} )}}</span>
              <span v-else-if="errorMessages.address && (errorMessages.zipCode || errorMessages.zipCodeValid || errorMessages.zipCodeNotDigit) && !(errorMessages.city && errorMessages.state)">{{ $t('Account.Join.ErrorMsg.TwoFieldsMissing', { field1: $t('Account.Join.ErrorMsg.StreetFieldMissing'), field2: $t('Account.Join.ErrorMsg.ZipCodeFieldMissing')} )}}</span>
              <span v-else-if="errorMessages.city && errorMessages.state && !(errorMessages.address && errorMessages.zipCode && errorMessages.zipCodeValid && errorMessages.zipCodeNotDigit)">{{ $t('Account.Join.ErrorMsg.TwoFieldsMissing', { field1: $t('Account.Join.ErrorMsg.CityFieldMissing'), field2: $t('Account.Join.ErrorMsg.StateFieldMissing')} )}}</span>
              <span v-else-if="errorMessages.city && (errorMessages.zipCode || errorMessages.zipCodeValid || errorMessages.zipCodeNotDigit) && !(errorMessages.address && errorMessages.state)">{{ $t('Account.Join.ErrorMsg.TwoFieldsMissing', { field1: $t('Account.Join.ErrorMsg.CityFieldMissing'), field2: $t('Account.Join.ErrorMsg.ZipCodeFieldMissing')} )}}</span>
              <span v-else-if="errorMessages.state && (errorMessages.zipCode || errorMessages.zipCodeValid || errorMessages.zipCodeNotDigit) && !(errorMessages.address && errorMessages.city)">{{ $t('Account.Join.ErrorMsg.TwoFieldsMissing', { field1: $t('Account.Join.ErrorMsg.StateFieldMissing'), field2: $t('Account.Join.ErrorMsg.ZipCodeFieldMissing')} )}}</span>
              <span v-else-if="errorMessages.address && !(errorMessages.city || errorMessages.state || (errorMessages.zipCode || errorMessages.zipCodeValid || errorMessages.zipCodeNotDigit))">{{ $t('Account.Join.ErrorMsg.OneFieldMissing', { field: $t('Account.Join.ErrorMsg.StreetFieldMissing')} )}}</span>
              <span v-else-if="errorMessages.city && !(errorMessages.address || errorMessages.state || (errorMessages.zipCode || errorMessages.zipCodeValid || errorMessages.zipCodeNotDigit))">{{ $t('Account.Join.ErrorMsg.OneFieldMissing', { field: $t('Account.Join.ErrorMsg.CityFieldMissing')} )}}</span>
              <span v-else-if="errorMessages.state && !(errorMessages.address || errorMessages.city || (errorMessages.zipCode || errorMessages.zipCodeValid || errorMessages.zipCodeNotDigit))">{{ $t('Account.Join.ErrorMsg.OneFieldMissing', { field: $t('Account.Join.ErrorMsg.StateFieldMissing')} )}}</span>
              <span v-else-if="(errorMessages.zipCode || errorMessages.zipCodeValid || errorMessages.zipCodeNotDigit) && !(errorMessages.address || errorMessages.city || errorMessages.state)">{{ $t('Account.Join.ErrorMsg.OneFieldMissing', { field: $t('Account.Join.ErrorMsg.ZipCodeFieldMissing')} )}}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="control-block checkbox-holder" v-if="!enterAddressManually && ((googlePlacesApiEnabled && !MobilelocalServer) || (googlePlacesApiMobileAppEnabled && MobilelocalServer))">
        <a @click.stop="manuallyAddress(true)">{{$t('Account.JoinUs.EnterStreetAddressManually')}}</a>
      </div>
      <div class="control-block checkbox-holder" v-if="enterAddressManually && ((googlePlacesApiEnabled && !MobilelocalServer) || (googlePlacesApiMobileAppEnabled && MobilelocalServer))">
        <a @click.stop="manuallyAddress(false)">{{ $t('Account.JoinUs.LookingForStreetAddress') }}</a>
      </div>
        <div v-if="!(googlePlacesApiEnabled || googlePlacesApiMobileAppEnabled) || (enterAddressManually && (googlePlacesApiMobileAppEnabled || googlePlacesApiEnabled))">
        <!-- STREET ADDRESS -->
        <div class="control-block" :class="{ 'filled': address }">
          <input type="text" v-model.trim="address" id="address" autocomplete="off" maxlength="200" @focusout="!registrationDetails.address ? errorMessages.address = true : errorMessages.address = false" placeholder=""/>
          <label class="control-label">{{ $t('Account.Join.StreetAddress') }}<span class="control-label-required"> *</span></label>
        </div>
        <!-- STREET ADDRESS VALIDATION -->
        <div>
          <div class="vmsg invalid" v-if="errorMessages.address" id="err_msg_address_missing" v-html="$t('Account.Join.ErrorMsg.StreetAddress')"></div>
        </div>

        <!-- CITY -->
        <div class="control-block" :class="{ 'filled': city }">
          <input type="text" v-model.trim="city" id="city" autocomplete="off" maxlength="50" @focusout="!registrationDetails.city ? errorMessages.city = true : errorMessages.city = false"/>
          <label class="control-label">{{ $t('Account.Join.City') }}<span class="control-label-required"> *</span></label>
        </div>
        <!-- CITY VALIDATION -->
        <div>
          <div class="vmsg invalid" v-if="errorMessages.city" id="err_msg_city_missing" v-html="$t('Account.Join.ErrorMsg.City')"></div>
        </div>

        <!-- STATE -->
        <div class="control-block" :class="{ 'filled': state }">
          <select class="input-field" v-model="state" id="state" autocomplete="off" @focusout="!registrationDetails.state ? errorMessages.state = true : errorMessages.state = false">
            <option value disabled id="qa-state-disabled">Please select state</option>
            <option v-for="usState in orderedStates" :key="usState.id" :id="'qa-state-'+usState.id" :value="usState.id">{{ $t('Account.PersonalDetails.State.' + usState.name) }}</option>
          </select>
          <label class="control-label">{{ $t('Account.Join.State') }}<span class="control-label-required"> *</span></label>
        </div>
        <!-- STATE VALIDATION -->
        <div>
          <div class="vmsg invalid" v-if="errorMessages.state" id="err_msg_state_missing">{{ $t('Account.PersonalDetails.errorMessages.state') }}</div>
        </div>

        <!-- ZIP CODE -->
        <div class="control-block" :class="{ 'filled': zipCode }">
          <input type="text" inputmode="numeric" v-model.trim="zipCode" id="zipCode" autocomplete="off" :maxlength="vldZipCodeLength" @focusout="!registrationDetails.zipCode ? errorMessages.zipCode = true : errorMessages.zipCode = false"/>
          <label class="control-label">{{ $t('Account.Join.Zip') }}<span class="control-label-required"> *</span></label>
        </div>
        <!-- ZIP CODE VALIDATION -->
        <div>
          <div class="vmsg invalid" v-if="errorMessages.zipCode" id="err_msg_zip_code_missing" v-html="$t('Account.Join.ErrorMsg.Zip')"></div>
          <div class="vmsg invalid" v-if="errorMessages.zipCodeValid" id="err_msg_zip_code_invalid" v-html="$t('Account.Join.ErrorMsg.ZipInvalid', { length: vldZipCodeLength })"></div>
          <div class="vmsg invalid" v-if="errorMessages.zipCodeNotDigit" id="err_msg_zip_code_not_digit" v-html="$t('Account.Join.ErrorMsg.ZipCodeNotDigit')"></div>
          <div class="vmsg invalid" v-if="errorR === 'duplicatecustomerdata'" id="err_msg_dateOfBirth_adult">{{ $t('Account.Join.ErrorMsg.DuplicateCustomerData') }}</div>
        </div>
    <!-- CLEAR ADDRESS DATA -->
    <div class="control-block checkbox-holder" v-if="enterAddressManually">
        <a @click.stop="clearAddressData()">{{ $t('Account.JoinUs.ClearAddress' )}}</a>
      </div>
      </div>
  </div>
</template>

<script>
  import store from '@/store'
  import moment from 'moment'
  import config from '@/config'
  import mobileBridge from '@/library/mobileBridge'
  import Url from '@/components/mixins/Url'
  import Branding from '@/components/mixins/Branding'
  import Screen from '@/components/mixins/Screen'
  import Validation from '@/components/mixins/Validation'
  export default {
    name: 'RegStep2',
    props: ['currentStep', 'currentStepState', 'registrationDetails', 'regError'],
    mixins: [
      Url,
      Branding,
      Screen,
      Validation
    ],
    data: () => ({
      errorMessages: {
        firstName: false,
        firstNameLength: false,
        lastName: false,
        lastNameLength: false,
        dateOfBirth: false,
        dateOfBirthAdult: false,
        ssn: false,
        ssnNonDigit: false,
        ssnLength: false,
        address: false,
        zipCode: false,
        zipCodeValid: false,
        zipCodeNotDigit: false,
        city: false,
        state: false
      },
      usStates: [
        {id: 'AL', name: 'Alabama'},
        {id: 'AK', name: 'Alaska'},
        {id: 'AZ', name: 'Arizona'},
        {id: 'AR', name: 'Arkansas'},
        {id: 'CA', name: 'California'},
        {id: 'CO', name: 'Colorado'},
        {id: 'CT', name: 'Connecticut'},
        {id: 'DE', name: 'Delaware'},
        {id: 'DC', name: 'DistrictofColumbia'},
        {id: 'FL', name: 'Florida'},
        {id: 'GA', name: 'Georgia'},
        {id: 'HI', name: 'Hawaii'},
        {id: 'ID', name: 'Idaho'},
        {id: 'IL', name: 'Illinois'},
        {id: 'IN', name: 'Indiana'},
        {id: 'IA', name: 'Iowa'},
        {id: 'KS', name: 'Kansas'},
        {id: 'KY', name: 'Kentucky'},
        {id: 'LA', name: 'Louisiana'},
        {id: 'ME', name: 'Maine'},
        {id: 'MD', name: 'Maryland'},
        {id: 'MA', name: 'Massachusetts'},
        {id: 'MI', name: 'Michigan'},
        {id: 'MN', name: 'Minnesota'},
        {id: 'MS', name: 'Mississippi'},
        {id: 'MO', name: 'Missouri'},
        {id: 'MT', name: 'Montana'},
        {id: 'NE', name: 'Nebraska'},
        {id: 'NV', name: 'Nevada'},
        {id: 'NH', name: 'NewHampshire'},
        {id: 'NJ', name: 'NewJersey'},
        {id: 'NM', name: 'NewMexico'},
        {id: 'NY', name: 'NewYork'},
        {id: 'NC', name: 'NorthCarolina'},
        {id: 'ND', name: 'NorthDakota'},
        {id: 'OH', name: 'Ohio'},
        {id: 'OK', name: 'Oklahoma'},
        {id: 'OR', name: 'Oregon'},
        {id: 'PA', name: 'Pennsylvania'},
        {id: 'PR', name: 'PuertoRico'},
        {id: 'RI', name: 'RhodeIsland'},
        {id: 'SC', name: 'SouthCarolina'},
        {id: 'SD', name: 'SouthDakota'},
        {id: 'TN', name: 'Tennessee'},
        {id: 'TX', name: 'Texas'},
        {id: 'UT', name: 'Utah'},
        {id: 'VT', name: 'Vermont'},
        {id: 'VA', name: 'Virginia'},
        {id: 'WA', name: 'Washington'},
        {id: 'WV', name: 'WestVirginia'},
        {id: 'WI', name: 'Wisconsin'},
        {id: 'WY', name: 'Wyoming'}
      ],
      enterAddressManually: false,
      googlePlacessAddresses: [],
      selectedAddress: null,
      addressesFromApp: false,
      showGoogleAddressLookup: false,
      fullSelectedAddress: undefined,
      datePickerMenu: false
    }),
    computed: {
      firstName: {
        get () {
          return this.registrationDetails.firstName || undefined
        },
        set (value) {
          if (value.length === 0) {
            this.errorMessages.firstName = true
            this.errorMessages.firstNameLength = undefined
          } else if ((value.length > 0 && value.length < 2) || (!value.match(this.vldFirstName))) {
            this.errorMessages.firstName = undefined
            this.errorMessages.firstNameLength = true
          } else {
            this.errorMessages.firstName = undefined
            this.errorMessages.firstNameLength = undefined
          }
          this.errorR = this.errorR === 'duplicatecustomerdata' ? undefined : this.errorR
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
            this.errorMessages.lastNameLength = undefined
          } else if ((value.length > 0 && value.length < 2) || (!value.match(this.vldLastName))) {
            this.errorMessages.lastName = undefined
            this.errorMessages.lastNameLength = true
          } else {
            this.errorMessages.lastName = undefined
            this.errorMessages.lastNameLength = undefined
          }
          this.errorR = this.errorR === 'duplicatecustomerdata' ? undefined : this.errorR
          this.registrationDetails.lastName = value
        }
      },
      dateOfBirth: {
        get () {
          return this.registrationDetails.dateOfBirth
        },
        set (value) {
          let yearsOld = this.calculateYear(value)
          if (yearsOld < this.legalAge) {
            this.errorMessages.dateOfBirthAdult = true
            this.errorMessages.dateOfBirth = false
          } else {
            this.errorMessages.dateOfBirth = false
            this.errorMessages.dateOfBirthAdult = false
          }
          this.errorR = this.errorR === 'duplicatecustomerdata' ? undefined : this.errorR
          this.errorR = this.errorR === 'underagecustomer' ? undefined : this.errorR
          this.registrationDetails.dateOfBirth = value
        }
      },
      legalAge () {
        return this.$store.getters.getLegalAge4Registration || 21
      },
      ssn: {
        get () {
          return this.registrationDetails.ssn || undefined
        },
        set (value) {
          if (value.length === 0) {
            this.errorMessages.ssn = true
            this.errorMessages.ssnNonDigit = false
          } else if (value.match(this.vldSsn)) {
            this.errorMessages.ssn = false
            this.errorMessages.ssnNonDigit = true
          } else {
            this.errorMessages.ssn = undefined
            this.errorMessages.ssnNonDigit = undefined
          }
          this.registrationDetails.ssn = value
          if (this.registrationDetails.ssn && this.registrationDetails.ssn.length !== this.vldSsnLength) {
            this.errorMessages.ssnLength = true
          } else {
            this.errorMessages.ssnLength = false
          }
        }
      },
      address: {
        get () {
          return this.registrationDetails.address || undefined
        },
        set (value) {
          if (value && value.length === 0) {
            this.errorMessages.address = true
          } else {
            this.errorMessages.address = undefined
          }
          this.registrationDetails.address = value
        }
      },
      zipCode: {
        get () {
          return this.registrationDetails.zipCode || undefined
        },
        set (value) {
          if (value && value.length === 0) {
            this.errorMessages.zipCode = true
            this.errorMessages.zipCodeValid = false
            this.errorMessages.zipCodeNotDigit = false
          } else if (value && value.match(this.vldZipCode)) {
            this.errorMessages.zipCodeNotDigit = true
            this.errorMessages.zipCode = false
            this.errorMessages.zipCodeValid = false
          } else if (value && value.length !== this.vldZipCodeLength) {
            this.errorMessages.zipCode = false
            this.errorMessages.zipCodeValid = true
            this.errorMessages.zipCodeNotDigit = false
          } else {
            this.errorMessages.zipCode = undefined
            this.errorMessages.zipCodeValid = undefined
            this.errorMessages.zipCodeNotDigit = undefined
          }
          this.errorR = this.errorR === 'duplicatecustomerdata' ? undefined : this.errorR
          this.registrationDetails.zipCode = value
        }
      },
      city: {
        get () {
          return this.registrationDetails.city || undefined
        },
        set (value) {
          if (value && value.length === 0) {
            this.errorMessages.city = true
          } else {
            this.errorMessages.city = undefined
          }
          this.registrationDetails.city = value
        }
      },
      state: {
        get () {
          return this.registrationDetails.state || undefined
        },
        set (value) {
          if (value && value.length === 0) {
            this.errorMessages.state = true
          } else {
            this.errorMessages.state = undefined
          }
          this.registrationDetails.state = value
        }
      },
      selectedState () {
        return config.app.autoconf.STATE || ''
      },
      orderedStates () {
        let states = this.usStates
        if (this.selectedState) {
          const firstState = states.find(item => item.id === this.selectedState)
          states = states.filter(item => item.id !== this.selectedState)
          states.unshift(firstState)
        }
        return states
      },
      lookupAddressResponse () {
        return store.getters['getLookupAddressResponse'] || true
      },
      googlePlacesApiEnabled () {
        return config.app.autoconf.GOOGLE_PLACES_API_KEY
      },
      MobilelocalServer () {
        return window.ctsautoconf.MOBILE_LS || false
      },
      googlePlacesApiMobileAppEnabled () {
        return config.app.autoconf.GOOGLE_PLACES_API_MOBILE_APP_ENABLED
      },
      isOpenedFromWebView () {
        return store.getters['getIsOpenedFromWebView']
      },
      scannedIDData () {
        return store.getters['getScannedID']
      },
      scanData () {
        return config.app.autoconf.SCAN_DRIVERS_LICENSE
      },
      maxDate () {
        var result = new Date().toISOString().substr(0, 10)

        if (this.brandKey === 'sb') {
          let currentYear = new Date().getFullYear()
          result = (currentYear - 20).toString()
        }

        return result
      },
      formattedDate () {
        return this.registrationDetails.dateOfBirth ? moment(this.registrationDetails.dateOfBirth).format('MM/DD/YYYY') : undefined // Custom format
      },
      errorR: {
        get () {
          return this.regError || undefined
        },
        set (value) {
          this.$emit('updateRegError', value)
        }
      }
    },
    methods: {
      calculateYear (param) {
        param = new Date(param)
        let ageDifMs = Date.now() - param.getTime()
        let ageDate = new Date(ageDifMs)
        return Math.abs(ageDate.getUTCFullYear() - 1970)
      },
      checkDateOfBirth () {
        this.$refs.datePickerMenu.save(this.dateOfBirth)
        if (!this.dateOfBirth) {
          this.errorMessages.dateOfBirth = true
        } else {
          this.errorMessages.dateOfBirth = false
        }
      },
      isAnyUnpopulatedField () {
        if (!this.registrationDetails.firstName) {
          this.errorMessages.firstName = true
        }
        if (!this.registrationDetails.lastName) {
          this.errorMessages.lastName = true
        }
        this.checkDateOfBirth()
        if (!this.registrationDetails.ssn) {
          this.errorMessages.ssn = true
        }
        if (!this.registrationDetails.address) {
          this.errorMessages.address = true
        }
        if (!this.registrationDetails.zipCode) {
          this.errorMessages.zipCode = true
        }
        if (!this.registrationDetails.city) {
          this.errorMessages.city = true
        }
        if (!this.registrationDetails.state) {
          this.errorMessages.state = true
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
      isFilled () {
        if (this.isEverythingValid()) {
          return true
        }
        return false
      },
      scanID () {
        mobileBridge.bridgeSendRequest('scanDocument')
      },
      initLocationSearch () {
        var self = this
        let autocomplete = new window.google.maps.places.Autocomplete(self.$refs.addressAutocomplete, { types: ['address'] })
        // let searchBox = new window.google.maps.places.SearchBox(self.$refs.addressAutocomplete)
        let streetNumber
        let street
        let city
        let state
        let postalCode

        // Avoid paying for data that you don't need by restricting the set of
        // place fields that are returned to just the address components.
        autocomplete.setFields(['address_component'])
        autocomplete.setComponentRestrictions({ country: ['us'] })

        /* searchBox.addListener('places_changed', function () {
          let placesSB = searchBox.getPlaces()
          console.log(placesSB)
        }) */
        autocomplete.addListener('place_changed', function () {
          streetNumber = undefined
          street = undefined
          state = undefined
          city = undefined
          postalCode = undefined
          let place = autocomplete.getPlace()
          if (place && place.address_components) {
            place.address_components.forEach(placeComponent => {
              placeComponent.types.forEach(type => {
                switch (type) {
                  case 'street_number':
                    streetNumber = placeComponent.long_name
                    break
                  case 'route':
                    street = placeComponent.long_name
                    break
                  case 'administrative_area_level_1':
                    state = placeComponent.short_name
                    break
                  case 'locality':
                  case 'sublocality_level_1':
                    city = placeComponent.long_name
                    break
                  case 'postal_code':
                    postalCode = placeComponent.long_name
                    break
                }
              })
            })
            self.address = street ? (streetNumber ? streetNumber + ' ' + street : street) : undefined
            self.city = city || undefined
            self.state = state || undefined
            self.zipCode = postalCode || undefined
            self.populateFullAddress()
          }
        })
      },
      googlePlacesSearch (callback) {
        if (window.google) {  // If you're using vue cli, then directly checking
          // 'google' obj will throw an error at the time of transpiling.
          callback()
          return true
        }
        window.mapApiInitialized = callback
        let script = document.createElement('script')
        script.src = 'https://maps.googleapis.com/maps/api/js?key=' + window.ctsautoconf.GooglePlacesApiKey + '&libraries=places&callback=mapApiInitialized'
        document.body.appendChild(script)
      },
      addressChanged () { // for mobile app
        if (this.googlePlacesApiMobileAppEnabled && this.MobilelocalServer && !this.enterAddressManually) {
          mobileBridge.bridgeSendRequest('lookupAddressRequest', this.fullSelectedAddress)
        }
        if (this.address || this.city || this.state || this.zipCode) {
          this.clearAddressData()
        }
      },
      populateAddressList () { // response from mobile app - make list of addresses
        let lookupAddresses = this.lookupAddressResponse
        let addressesToDisplay = []
        // lookupAddresses = [{"street":"New Street","city":"Oceanside","state":"NY","postalCode":"11572"},{"streetNumber":"36","street":"New Street","city":"New Brunswick","state":"NJ","postalCode":"08901"},{"streetNumber":"36","street":"New County Road","city":"Secaucus","state":"NJ","postalCode":"07094"},{"streetNumber":"36","street":"New Avenue","city":"Monterey Park","state":"CA","postalCode":"91755"},{"streetNumber":"363","street":"New Street","city":"Macon","state":"GA","postalCode":"31201"}]
        // this.lookupAddressResponse = lookupAddresses

        lookupAddresses.forEach(function (address) {
          let fullAdddress
          let addressStreetAndNumber = ''
          let addressOhterData = ''
          if (address.streetNumber) {
            addressStreetAndNumber += address.streetNumber
          }
          if (address.street) {
            addressStreetAndNumber += addressStreetAndNumber ? ' ' + address.street : address.street
          }
          fullAdddress = addressStreetAndNumber
          if (address.city) {
            addressOhterData = address.city
          }
          if (address.state) {
            addressOhterData += addressOhterData ? ', ' + address.state : address.state
          }
          if (address.postalCode) {
            addressOhterData += addressOhterData ? ', ' + address.postalCode : address.postalCode
          }
          addressOhterData += addressOhterData ? ', USA' : 'USA'
          if (addressOhterData) {
            fullAdddress += ' ' + addressOhterData
          }
          let objAddress = {'addressText': fullAdddress, 'addressDetails': address, 'addressStreet': addressStreetAndNumber, 'addressOther': addressOhterData}
          addressesToDisplay.push(objAddress)
        })
        this.googlePlacessAddresses = addressesToDisplay
      },
      addressSelected () {
        this.clearAddressData()
        let selectedAddressDetails = this.selectedAddress
        this.address = selectedAddressDetails.street ? (selectedAddressDetails.streetNumber ? selectedAddressDetails.streetNumber + ' ' + selectedAddressDetails.street : selectedAddressDetails.street) : undefined
        this.city = selectedAddressDetails.city || undefined
        this.state = selectedAddressDetails.state || undefined
        this.zipCode = selectedAddressDetails.postalCode || undefined

        this.populateFullAddress()
        this.showGoogleAddressLookup = false
        this.addressesFromApp = false
        this.streetAddressFocusOut()
      },
      clearAddressData () {
        this.address = undefined
        this.city = undefined
        this.state = undefined
        this.zipCode = undefined
        this.showGoogleAddressLookup = false
      },
      manuallyAddress (value) {
        this.enterAddressManually = value
        if (!value) {
          this.clearAddressData()
          this.populateFullAddress()
          // this.streetAddressFocusOut()
        }
      },
      streetAddressFocusOut () {
        if (this.googlePlacesApiEnabled) {
          setTimeout(() => {
            this.setErrorMessages()
          }, 500)
          // this.setErrorMessages()
        } else {
          this.setErrorMessages()
          this.showGoogleAddressLookup = false
        }
      },
      setErrorMessages () {
        !this.registrationDetails.address ? this.errorMessages.address = true : this.errorMessages.address = false
        !this.registrationDetails.city ? this.errorMessages.city = true : this.errorMessages.city = false
        !this.registrationDetails.state ? this.errorMessages.state = true : this.errorMessages.state = false
        !this.registrationDetails.zipCode ? this.errorMessages.zipCode = true : this.errorMessages.zipCode = false
      },
      populateFullAddress () { // address to display
        this.fullSelectedAddress = ''
        if (this.address) {
          this.fullSelectedAddress = this.address
        }
        if (this.city) {
          this.fullSelectedAddress = this.fullSelectedAddress ? this.fullSelectedAddress + ', ' + this.city : this.city
        }
        if (this.state) {
          this.fullSelectedAddress = this.fullSelectedAddress ? this.fullSelectedAddress + ', ' + this.state : this.state
        }
        if (this.zipCode) {
          this.fullSelectedAddress = this.fullSelectedAddress ? this.fullSelectedAddress + ', ' + this.zipCode : this.zipCode
        }
        this.fullSelectedAddress = this.fullSelectedAddress ? this.fullSelectedAddress + ', ' + 'USA' : ''
      },
      onDateBirth () {
        let state = ''
        let sbAndDateOfBirthPopulated = 1
        let sbAndDateOfBirthNotPopulated = 2

        let selectedYear = ''

        // cases
        if (this.brandKey === 'sb' && this.dateOfBirth) state = sbAndDateOfBirthPopulated
        if (this.brandKey === 'sb' && !this.dateOfBirth) state = sbAndDateOfBirthNotPopulated

        switch (state) {
          case sbAndDateOfBirthPopulated:
            selectedYear = this.dateOfBirth.split('-')[0]
            break
          case sbAndDateOfBirthNotPopulated:
            selectedYear = '1995'
            break
          default:
        }
        // scroll to year
        if (selectedYear) {
          setTimeout(() => {
            let datePickerElement = document.querySelector('.v-date-picker-years')
            if (datePickerElement && datePickerElement.hasChildNodes()) {
              let position = 0
              let children = datePickerElement.children

              for (var i = 0; i < children.length; i++) {
                let text = children[i].innerText || children[i].textContent
                if (text === selectedYear) {
                  position = children[i].offsetTop
                  break
                }
              }

              datePickerElement.scrollTop = position
            }
          }, 500)
        }
      },
      GTMregistrationStart () {
        if (window.dataLayer || this.$store.getters['getThirdpartyAnalytics']) {
          let registration = {
            'event': 'signup_start',
            'gaEventCategory': 'registration',
            'gaEventAction': 'registration start'
          }
          store.dispatch('analyticsHandler', {'event': registration})
        }
      },
      DOBFocusOut () {
        setTimeout(() => {
          this.setErrorMessagesDOB()
        }, 500)
      },
      setErrorMessagesDOB () {
        !this.registrationDetails.dateOfBirth ? this.errorMessages.dateOfBirth = true : this.errorMessages.dateOfBirth = false
      },
      populateDataFromDriversLicense () {
        this.driversLicenseData = this.scannedIDData
        if (this.driversLicenseData) {
          this.firstName = this.driversLicenseData.FirstName
          this.lastName = this.driversLicenseData.LastName
          this.dateOfBirth = this.driversLicenseData.DateOfBirth
          this.address = this.driversLicenseData.AddressStreet
          this.city = this.driversLicenseData.AddressCity
          this.state = this.driversLicenseData.AddressJurisdictionCode
          this.zipCode = this.driversLicenseData.AddressPostalCode
        }
      }
    },
    watch: {
      scannedIDData (value) {
        if (value) {
          this.populateDataFromDriversLicense()
        }
      },
      datePickerMenu (val) {
        val && setTimeout(() => (this.$refs.picker.activePicker = 'YEAR'))
      },
      lookupAddressResponse (value) {
        if (value && value.length > 0) {
          this.populateAddressList()
          this.showGoogleAddressLookup = true
          this.addressesFromApp = true
        } else {
          this.showGoogleAddressLookup = false
          this.addressesFromApp = false
        }
      }
    },
    created () {
      this.GTMregistrationStart()
    },
    mounted () {
      if (!this.MobilelocalServer) {
        if (this.googlePlacesApiEnabled) {
          setTimeout(() => {
            this.googlePlacesSearch(this.initLocationSearch)
          }, 1000)
        }
      }
      this.populateFullAddress()
      if (this.regError) {
        if (this.errorR === 'duplicatecustomerdata') {
          this.manuallyAddress(true)
        }
      }
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
  .tandc-popup-container
    overflow hidden
    position fixed
    top 0
    right 0
    bottom 0
    left 0
    width 100%
    height 100%
    z-index 10000
    background  rgba(0,0,0,.7)
  .tandc-popup-child
    padding 20px 20px 72px 20px
    position fixed
    top 10%
    right 10%
    bottom 10%
    left 10%
    z-index 10001
    background #fff
    -webkit-overflow-scrolling touch
    overflow-y scroll
    overflow -moz-scrollbars-none !important
    -ms-overflow-style none !important
    scrollbar-width: none
    &::-webkit-scrollbar
      width: 0 !important

    @media mobile-big-and-below
      padding 10px 10px 0px 10px !important
      top 2%
      right 5%
      left 5%
      bottom 5%
      overflow-y scroll

  .tandc-popup-child .tc-embedded
    width 100%
    height 100%
    border none
    -webkit-overflow-scrolling touch
    overflow-y scroll
  .tandc-popup-child > .form-actions
    position absolute
    right 0
    bottom 10px
    left 0
    z-index 10003
    text-align center
    .btn.primary-btn
      background-color #1a9ddd  !important
      color #fff !important
    .btn.primary-btn
      background-color #1a9ddd  !important
      color #fff !important
    .btn.secondary-btn
      background-color #f5f8fc !important
      border 1px solid #cfd6db
      color #99a8b1 !important
    @media mobile-big-and-below
      position sticky
      background #fff
      padding 5px 0 5px 0
      bottom 0px
  .mb-container
    display: flex
    margin-bottom 10px
    justify-content center
  .control-label-required
    color #ff9016
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
  .cs.control-block
    margin-bottom 0 !important
  .custom-select
    >>>.v-input__icon
      display none
    >>>.v-select__slot
      background: transparent !important
      border: 0px !important
      z-index 5
    >>>.v-input__slot
      &:after
      &:before
        display none !important
    &.v-input--is-focused + .control-label
      background-color #f6f6f6 !important
      padding-top 0
    &.v-select
      >>>.v-select__selections
        color: #505050
        font-weight: bold
        font-size: 14px

  .firstPartOfAddress
    font-weight: bold
  .secondPartOfAddress
    font-size: 12px
    font-weight: normal


.v-menu__content
  .v-select-list
    >>>.v-list__tile
      height auto
      line-height normal
      font-size 14px !important
      margin 10px 0
      color: rgba(0,0,0,.87) !important
      .v-list__tile__title
        height auto
        line-height normal
        white-space: normal
      &.v-list__tile--disabled
        color: rgba(0,0,0,.57) !important

.street-address
  .custom-select
    padding: 0
    margin: 0

.checkbox-holder
  padding 5px 15px
  background #fff !important
  color #003764
  border 1px solid #ff9016
  width fit-content
  a
    color #003764

.reg_driver_license
  color: #003764
  display: inline-block
  background-image: url(icons-path'/'reg_driver_license'.svg')
  height: 30px !important
  width: 60px !important
// .icon-color
//   color: #003764 !important
.reg_driver_license_text
  font-family: 'Open Sans Regular'
.reg_driver_license_qr_text
  text-align: center
  font-size: 12px
  margin: 0 0 5px

</style>
