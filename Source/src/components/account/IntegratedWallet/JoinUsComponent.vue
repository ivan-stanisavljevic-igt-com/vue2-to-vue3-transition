<template>
  <div class="account-page ctsform">
    <template v-if="brandKey === 'qcasino' || brandKey === 'pr'">
      <div class="joinusTitle" v-if="mobileBigAndBelow" v-html="$t('MyAccount.JoinUs.Title')"></div>
      <div class="acc-header">
        <img :src="mediaServer('/static/brand-img/' + brandKey + '/account-create-white.svg')" :alt="brandKey">
        <h1>{{ $t('Account.Join.Heading') }}</h1>
      </div>
    </template>
    <template v-if="brandKey !== 'qcasino' && brandKey !== 'pr'">
      <h1>{{ $t('Account.Join.Heading') }}</h1>
    </template>
    <form id="registrationForm" v-if="secretQuestionsArray1 && secretQuestionsArray1.length > 0">
      <!-- Scan Drivers License -->
      <div class="mb-container" v-if="isOpenedFromWebView && scanData">
        <div class="mb-desc" v-if="brandKey ==='dn' || brandKey ==='dnw'">{{ $t('Account.Join.ScanDriversLicenseDesc') }}</div>
        <v-btn color="success" x-large @click.stop="scanID()"><span>{{ $t('Account.Join.ScanID') }}</span></v-btn>
      </div>
      <!-- USERNAME -->
      <div class="control-block" :class="{ 'filled': userName }">
        <input type="text" v-model.trim="userName" id="username" autocomplete="off" :maxlength="vldUsernameMaxLength" @focusout="!registrationDetails.userName ? errorMessages.userName = true : errorMessages.userName = false"/>
        <label class="control-label">{{ $t('Account.Join.UserName') }}<span class="control-label-required"> *</span></label>
      </div>
      <!-- USERNAME VALIDATION -->
      <div>
        <div class="vmsg invalid" v-if="errorMessages.userName" id="err_msg_username_missing" v-html="$t('Account.Join.ErrorMsg.UserName')"></div>
        <div class="vmsg invalid" v-if="errorMessages.userNameLength" id="err_msg_username_length" v-html="$t('Account.Join.ErrorMsg.UserNameLength', {minLength: vldUsernameMinLength})"></div>
        <div class="vmsg invalid" v-if="errorMessages.userNameSymbol" id="err_msg_username_symbol" v-html="$t('Account.Join.ErrorMsg.UserNameSymbol')"></div>
      </div>

      <!-- TITLE -->
      <div class="control-block" :class="{ 'filled': title }">
        <select class="input-field" v-model="title" id="title" autocomplete="off" @focusout="!registrationDetails.title ? errorMessages.title = true : errorMessages.title = false">
          <option id="qa-title-disabled" value disabled>Select a title</option>
          <option id="qa-title-mr" value="Mr.">{{ $t('Account.Join.Title.Mr') }}</option>
          <option id="qa-title-mrs" value="Mrs.">{{ $t('Account.Join.Title.Mrs') }}</option>
          <option id="qa-title-miss" value="Miss.">{{ $t('Account.Join.Title.Miss') }}</option>
          <option id="qa-title-ms" value="Ms.">{{ $t('Account.Join.Title.Ms') }}</option>
        </select>
        <label class="control-label">{{ $t('Account.Join.Title') }}<span class="control-label-required"> *</span></label>
      </div>
      <!-- TITLE VALIDATION -->
      <div>
        <div class="vmsg invalid" v-if="errorMessages.title" id="err_msg_title_missing">{{ $t('Account.Join.ErrorMsg.Title') }}</div>
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
            <label class="control-label">{{ $t('Account.Join.DOB') }}<span class="control-label-required"> *</span></label>
          </template>
          <v-date-picker ref="picker" :max="maxDate" @change="checkDateOfBirth()" v-model="dateOfBirth" no-title scrollable></v-date-picker>
        </v-menu>
      </div>
      <!-- DATE OF BIRTH VALIDATION -->
      <div>
        <div class="vmsg invalid" v-if="errorMessages.dateOfBirth" id="err_msg_dateOfBirth_missing">{{ $t('Account.Join.ErrorMsg.MissingDOB') }}</div>
        <div class="vmsg invalid" v-if="errorMessages.dateOfBirthAdult" id="err_msg_dateOfBirth_adult">{{ $t('Account.Join.ErrorMsg.Adult') }}</div>
      </div>

      <!-- EMAIL -->
      <div class="control-block" :class="{ 'filled': email }">
        <input type="text" v-model.trim="email" id="email" autocomplete="off" maxlength="255" @focusout="!registrationDetails.email ? errorMessages.email = true : errorMessages.email = false"/>
        <label class="control-label">{{ $t('Account.Join.Email') }}<span class="control-label-required"> *</span></label>
      </div>
      <!-- EMAIL VALIDATION -->
      <div>
        <div class="vmsg invalid" v-if="errorMessages.email" id="err_msg_email_missing" v-html="$t('Account.Join.ErrorMsg.Email')"></div>
        <div class="vmsg invalid" v-if="errorMessages.emailValid" id="err_msg_email_invalid" v-html="$t('Account.Join.ErrorMsg.EmailInvalid')"></div>
      </div>

      <!-- PHONE -->
      <div class="control-block" :class="{ 'filled': phone }">
        <input type="text" inputmode="numeric" v-model.trim="phone" id="phone" autocomplete="off" :maxlength="vldPhoneLength" @focusout="!registrationDetails.phone ? errorMessages.phone = true : errorMessages.phone = false"/>
        <label class="control-label">{{ $t('Account.Join.Phone') }}<span class="control-label-required"> *</span></label>
      </div>
      <!-- PHONE VALIDATION -->
      <div>
        <div class="vmsg invalid" v-if="errorMessages.phone" id="err_msg_phone_missing" v-html="$t('Account.Join.ErrorMsg.Phone')"></div>
        <div class="vmsg invalid" v-if="errorMessages.phoneNonDigit" id="err_msg_phone_not_digit" v-html="$t('Account.Join.ErrorMsg.PhoneNonDigit')"></div>
        <div class="vmsg invalid" v-if="errorMessages.phoneLength" id="err_msg_phone_length" v-html="$t('Account.Join.ErrorMsg.PhoneLength', { length: vldPhoneLength })"></div>
      </div>

      <!-- PASSWORD -->
      <div class="control-block" :class="{ 'filled': pass }">
        <input :type="showPassword ? 'text' : 'password'" v-model.trim="pass" id="password" autocomplete="new-password" :maxlength="vldPasswordMaxLength" @focusout="!registrationDetails.pass ? errorMessages.pass = true : errorMessages.pass = false"/>
        <label class="control-label">{{ $t('Account.Join.Pass') }}<span class="control-label-required"> *</span></label>
        <span class="show_hide" @click.stop="toggleShowPassword()">{{ showPassword ? 'Hide' : 'Show' }}</span>
      </div>
      <!-- PASSWORD VALIDATION -->
      <div>
        <div class="vmsg invalid" v-if="errorMessages.pass" id="err_msg_pwd_missing" v-html="$t('Account.Join.ErrorMsg.Pass')"></div>
        <div class="vmsg invalid" v-if="errorMessages.passStrength" id="err_msg_pwd_strength" v-html="$t('Account.Join.ErrorMsg.PassStrength', {pwdMinLength: vldPasswordMinLength})"></div>
      </div>
      <!-- CONFIRM PASSWORD -->
      <div class="control-block" :class="{ 'filled': confirmPassword }">
        <input :type="showConfirmPassword ? 'text' : 'password'" v-model.trim="confirmPassword" id="confirmPassword" autocomplete="new-password" :maxlength="vldPasswordMaxLength" @focusout="!confirmedPasswordField ? errorMessages.confirmedPassMissing = true : errorMessages.confirmedPassMissing = false"/>
        <label class="control-label">{{ $t('Account.Join.ConfirmNewPassword') }}<span class="control-label-required"> *</span></label>
        <span class="show_hide" @click.stop="toggleShowConfirmPassword()">{{ showConfirmPassword ? 'Hide' : 'Show' }}</span>
      </div>
      <!-- CONFIRM PASSWORD VALIDATION -->
      <div>
        <div class="vmsg invalid" v-if="errorMessages.confirmedPassMissing" id="err_msg_confirm_pwd_missing">{{ $t('Account.Join.ErrorMessages.ConfirmNewPassword.Missing') }}</div>
        <div class="vmsg invalid" v-if="errorMessages.confirmedPassNotSame" id="err_msg_confirm_pwd_strength">{{ $t('Account.Join.ErrorMessages.ConfirmNewPassword.NotSame') }}</div>
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
      <div class="control-block checkbox-holder" v-if="(googlePlacesApiEnabled && !MobilelocalServer) || (googlePlacesApiMobileAppEnabled && MobilelocalServer)">
        <a v-if="!enterAddressManually" @click.stop="manuallyAddress(true)">{{$t('Account.JoinUs.EnterStreetAddressManually')}}</a>
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
        </div>
      </div>

      <!-- CLEAR ADDRESS DATA -->
      <div class="control-block checkbox-holder" v-if="enterAddressManually">
        <a @click.stop="clearAddressData()">{{ $t('Account.JoinUs.ClearAddress' )}}</a>
      </div>

      <!-- SECURITY QUESTION 1 -->
      <div class="control-block cs" :class="{ 'filled': IDDCSecurityQuestion1 }">
        <v-select class="custom-select" :menu-props="{ contentClass: 'select_list' }"
          v-model="IDDCSecurityQuestion1"
          id="IDDCSecurityQuestion1"
          :items="secretQuestionsArray1Options"
          @focusout="!registrationDetails.IDDCSecurityQuestion1 ? errorMessages.securityQuestion1 = true : errorMessages.securityQuestion1 = false"
          @change="checkOutSecurityQuestion"
          label=""
        ></v-select>
        <label class="control-label">{{ $t('Account.SecurityQuestion1.Label') }}<span class="control-label-required"> *</span></label>
      </div>
      <!-- SECURITY QUESTION 1 VALIDATION -->
      <div>
        <div class="vmsg invalid" v-if="errorMessages.securityQuestion1" id="err_msg_sq1_missing" v-html="$t('Account.Join.ErrorMsg.SecurityQuestion1')"></div>
        <div class="vmsg invalid" v-if="errorMessages.securityQuestionsHaveToBeDifferent" id="err_msg_sq1_sq2_same" v-html="$t('Account.Join.ErrorMsg.SecurityQuestionsHaveToBeDifferent')"></div>
      </div>

      <!-- SECURITY ANSWER 1 -->
      <div class="control-block" :class="{ 'filled': securityAnswer1 }">
        <input type="text" v-model.trim="securityAnswer1" id="securityAnswer1" autocomplete="off" maxlength="50" @focusout="!registrationDetails.securityAnswer1 ? errorMessages.securityAnswer1 = true : errorMessages.securityAnswer1 = false"/>
        <label class="control-label">{{ $t('Account.Join.SecurityAnswer1') }}<span class="control-label-required"> *</span></label>
      </div>
      <!-- SECURITY ANSWER 1 VALIDATION -->
      <div>
        <div class="vmsg invalid" v-if="errorMessages.securityAnswer1" id="err_msg_sa1_missing" v-html="$t('Account.Join.ErrorMsg.SecurityAnswer1')"></div>
        <div class="vmsg invalid" v-if="errorMessages.securityAnswer1Length" id="err_msg_sa1_length" v-html="$t('Account.Join.ErrorMsg.SecurityAnswer1Length')"></div>
      </div>

      <!-- SECURITY QUESTION 2 -->
      <div class="control-block cs" :class="{ 'filled': IDDCSecurityQuestion2 }">
        <v-select class="custom-select" :menu-props="{ contentClass: 'select_list' }"
          v-model="IDDCSecurityQuestion2"
          id="IDDCSecurityQuestion2"
          :items="secretQuestionsArray2Options"
          @focusout="!registrationDetails.IDDCSecurityQuestion2 ? errorMessages.securityQuestion2 = true : errorMessages.securityQuestion2 = false"
          @change="checkOutSecurityQuestion"
          label=""
        ></v-select>
        <label class="control-label">{{ $t('Account.SecurityQuestion2.Label') }}<span class="control-label-required"> *</span></label>
      </div>
      <!-- SECURITY QUESTION 2 VALIDATION -->
      <div>
        <div class="vmsg invalid" v-if="errorMessages.securityQuestion2" id="err_msg_sq2_missing" v-html="$t('Account.Join.ErrorMsg.SecurityQuestion2')"></div>
        <div class="vmsg invalid" v-if="errorMessages.securityQuestionsHaveToBeDifferent" id="err_msg_sq2_sq1_same" v-html="$t('Account.Join.ErrorMsg.SecurityQuestionsHaveToBeDifferent')"></div>
      </div>

      <!-- SECURITY ANSWER 2 -->
      <div class="control-block" :class="{ 'filled': securityAnswer2 }">
        <input type="text" v-model.trim="securityAnswer2" id="securityAnswer2" autocomplete="off" maxlength="50" @focusout="!registrationDetails.securityAnswer2 ? errorMessages.securityAnswer2 = true : errorMessages.securityAnswer2 = false"/>
        <label class="control-label">{{ $t('Account.Join.SecurityAnswer2') }}<span class="control-label-required"> *</span></label>
      </div>
      <!-- SECURITY ANSWER 2 VALIDATION -->
      <div>
        <div class="vmsg invalid" v-if="errorMessages.securityAnswer2" id="err_msg_sa2_missing" v-html="$t('Account.Join.ErrorMsg.SecurityAnswer2')"></div>
        <div class="vmsg invalid" v-if="errorMessages.securityAnswer2Length" id="err_msg_sa2_length" v-html="$t('Account.Join.ErrorMsg.SecurityAnswer2Length')"></div>
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

      <!-- RG language -->
      <div>
        <span v-if="brandKey === 'sb'">{{ $t('Account.JoinUs.RGLangage') }}</span>
      </div>

      <!-- T&C -->
      <div class="checkbox-holder">
        <v-checkbox v-model="tc" id="tc" type="checkbox">
          <span slot="label">
            {{ $t('Account.JoinUs.TC1') }}
            <a @click.stop="toggleTandC('open')">{{ $t('Account.JoinUs.TC2') }}</a>
            <span v-if="showHouseRules">,</span>
            <span v-else>{{ $t('Account.JoinUs.TC3') }}</span>
            <a @click.stop="togglePrivacyPolicy('open')">{{ $t('Account.JoinUs.TC4') }}</a>
            <span v-if="showHouseRules">
              {{ $t('Account.JoinUs.TC3') }}
              <a @click.stop="toggleHouseRules('open')">{{ $t('Account.JoinUs.TC5') }}</a>
            </span>
          </span>
        </v-checkbox>
      </div>
      <!-- T&C pop-up -->
      <div class="tandc-popup-container" v-if="termsAndConditionsPopup" :class="{'tandc-iframe': tAndCIFrame}">
        <div class="tandc-popup-child">
          <div class="tandc-popup-content">
            <div class="tc-text" v-if="tAndCText" v-html="tAndCText"></div>
          </div>
          <iframe class="tc-embedded" ref="tAndCondIF" id="tcIFrame" v-if="tAndCIFrame">
          </iframe>
          <div class="form-actions">
            <v-btn class="btn primary-btn" @click="toggleTandC('decline')">{{ $t('Account.JoinUs.Popup.Close') }}</v-btn>
          </div>
        </div>
      </div>
      <!-- Privacy policy pop-up -->
      <div class="tandc-popup-container" v-if="privacyPolicyPopup">
        <div class="tandc-popup-child">
          <div class="tandc-popup-content">
            <div class="tc-text" v-html="privacyContent"></div>
          </div>
          <div class="form-actions">
            <v-btn class="btn primary-btn" @click="togglePrivacyPolicy('decline')">{{ $t('Account.JoinUs.Popup.Close') }}</v-btn>
          </div>
        </div>
      </div>
      <!-- House rules pop-up -->
      <div class="tandc-popup-container" v-if="houseRulesPopup">
        <div class="tandc-popup-child">
          <div class="tandc-popup-content">
            <div class="tc-text" v-html="rulesContent"></div>
          </div>
          <div class="form-actions">
            <v-btn class="btn primary-btn" @click="toggleHouseRules('decline')">{{ $t('Account.JoinUs.Popup.Close') }}</v-btn>
          </div>
        </div>
      </div>
      <!-- T&C VALIDATION -->
      <div>
        <div class="vmsg invalid" v-if="errorMessages.tc" id="err_msg_tc_missing" v-html="$t('Account.Join.ErrorMsg.TC')"></div>
      </div>

      <!-- ATTESTATIONS -->
      <div class="checkbox-holder" v-for="(item, index) in attestations">
        <div class="" @click="attestationClick(attestations[index])">
          <v-checkbox class="control-elm" v-model="attestations[index].value" :id="'attestation_' + attestations[index].idmmattestation" :label="attestations[index].description">
            <template slot="label">
              <span v-html="attestations[index].description"></span>
            </template>
          </v-checkbox>
        </div>
        <!-- ATTESTATIONS VALIDATION -->
        <div>
          <div class="vmsg invalid" v-if="errorMessages[attestations[index].idmmattestation]" :id="'err_msg_attestation_missing_' + attestations[index].idmmattestation" v-html="$t('Account.Join.ErrorMsg.ConfirmAttestation')"></div>
        </div>
      </div>

      <!-- CREATE ACCOUNT -->
      <div class="form-actions" :class="{'btnsHolder' : brandKey ==='circa'}">
        <v-btn v-if="brandKey ==='circa'" class="cancelBtn" x-large @click.stop="go2Home()"><span>{{ $t('Account.Cancel') }} </span></v-btn>
        <v-btn color="success" x-large @click.stop="register()"><span>{{ $t('Account.CreateAccount') }} </span></v-btn>
      </div>
      <div v-if="brandKey === 'sb' && states === 'NJ'" class="rg-joinus">
        <span class="header-txt">{{ $t('JoinNow.InfoMessage.' + states) }}</span>
      </div>
    </form>

    <!-- processing dialog -->
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
      @close="closeVerificationDialog">
      <div slot="text-error">
        <p v-if="brandKey !=='sb'" class="generic-icon-note"><v-icon color="error" class="mr-1">error</v-icon><span>{{ $t('Account.Join.Dialog.Error.Text') }}</span></p>
        <p class="response-error">{{ transactionError }}</p>
        <p v-if="brandKey !=='sb' || (brandKey === 'sb' && !duplicateEmail)" v-html="$t('Account.Join.Dialog.Error.Text.ContactSupport')"></p>
        <p v-if="brandKey ==='sb' && duplicateEmail" v-html="$t('Account.Join.Dialog.Error.Text.DuplicateEmail.ContactSupport')"></p>
      </div>
    </ProcessingDialog>
  </div>
</template>

<script>
  import store from '@/store'
  import config from '@/config'
  import lib from '@/library'
  import moment from 'moment'
  import ProcessingDialog from '@/components/common/ProcessingDialog'
  import Vue from 'vue'
  import mobileBridge from '@/library/mobileBridge'
  import adjust from '@/library/adjust'
  import Url from '@/components/mixins/Url'
  import Branding from '@/components/mixins/Branding'
  import axios from 'axios'
  import Screen from '@/components/mixins/Screen'
  import Validation from '@/components/mixins/Validation'

  export default {
    name: 'JoinUsComponent',
    components: {
      ProcessingDialog
    },

    mixins: [
      Url,
      Branding,
      Screen,
      Validation
    ],
    data: () => ({
      privacyPolicyContent: '',
      houseRulesContent: '',
      confirmedPasswordField: undefined,
      secretQuestionsArray1: [],
      secretQuestionsArray2: [],
      attestations: [],
      userAttestations: [],
      dialog: false,
      isProcessing: false,
      transactionError: null,
      termsAndConditionsPopup: false,
      privacyPolicyPopup: false,
      houseRulesPopup: false,
      registrationDetails: {
        userName: undefined,
        title: undefined,
        gender: undefined,
        firstName: undefined,
        lastName: undefined,
        dateOfBirth: null,
        email: undefined,
        phone: undefined,
        pass: undefined,
        securityQuestion1: undefined,
        IDDCSecurityQuestion1: undefined,
        securityAnswer1: '',
        securityQuestion2: undefined,
        IDDCSecurityQuestion2: undefined,
        securityAnswer2: '',
        address: undefined,
        zipCode: undefined,
        city: undefined,
        state: undefined,
        ssn: undefined,
        tc: undefined
      },
      errorMessages: {
        userName: false,
        userNameLength: false,
        userNameSymbol: false,
        title: false,
        firstName: false,
        firstNameLength: false,
        lastName: false,
        lastNameLength: false,
        dateOfBirth: false,
        dateOfBirthAdult: false,
        email: false,
        emailValid: false,
        phone: false,
        phoneNonDigit: false,
        phoneLength: false,
        pass: false,
        passStrength: false,
        confirmedPassMissing: false,
        confirmedPassNotSame: false,
        securityQuestion1: false,
        securityAnswer1: false,
        securityAnswer1Length: false,
        securityQuestion2: false,
        securityAnswer2: false,
        securityAnswer2Length: false,
        address: false,
        zipCode: false,
        zipCodeValid: false,
        zipCodeNotDigit: false,
        city: false,
        state: false,
        ssn: false,
        ssnNonDigit: false,
        ssnLength: false,
        tc: false
      },
      splitSymbol: null,
      tAndCText: undefined,
      tAndCIFrame: true,
      datePickerMenu: false,
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
      showPassword: false,
      showConfirmPassword: false,
      duplicateEmail: null,
      enterAddressManually: false,
      googlePlacessAddresses: [],
      selectedAddress: null,
      addressesFromApp: false,
      showGoogleAddressLookup: false,
      fullSelectedAddress: undefined
    }),
    computed: {
      states () {
        return config.app.autoconf.STATE
      },
      privacyContent () {
        return this.privacyPolicyContent
      },
      rulesContent () {
        return this.houseRulesContent
      },
      isLoggedIn () {
        return store.getters['isLoggedIn']
      },
      isTermsAndConditionsMandatory () {
        let tcIsMandatory = window.ctsautoconf.TermsAndConditionsIsMandatory
        if (tcIsMandatory === undefined) {
          return true
        }
        return tcIsMandatory
      },
      userName: {
        get () {
          return this.registrationDetails.userName || undefined
        },
        set (value) {
          if (value.length === 0) {
            this.errorMessages.userName = true
            this.errorMessages.userNameLength = undefined
            this.errorMessages.userNameSymbol = undefined
          } else if (value.length > 0 && value.length < this.vldUsernameMinLength) {
            this.errorMessages.userName = undefined
            this.errorMessages.userNameLength = true
            this.errorMessages.userNameSymbol = undefined
          } else if (!value.match(this.vldUserNameSymbol)) {
            this.errorMessages.userName = undefined
            this.errorMessages.userNameLength = undefined
            this.errorMessages.userNameSymbol = true
          } else {
            this.errorMessages.userName = undefined
            this.errorMessages.userNameLength = undefined
            this.errorMessages.userNameSymbol = undefined
          }
          this.registrationDetails.userName = value
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
      },
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
          this.registrationDetails.lastName = value
        }
      },
      dateOfBirth: {
        get () {
          return this.registrationDetails.dateOfBirth
        },
        set (value) {
          let yearsOld = this.calculateYear(value)
          if (yearsOld < 21) {
            this.errorMessages.dateOfBirthAdult = true
            this.errorMessages.dateOfBirth = false
          } else {
            this.errorMessages.dateOfBirth = false
            this.errorMessages.dateOfBirthAdult = false
          }
          this.registrationDetails.dateOfBirth = value
        }
      },
      email: {
        get () {
          return this.registrationDetails.email || undefined
        },
        set (value) {
          if (value.length === 0) {
            this.errorMessages.email = true
            this.errorMessages.emailValid = false
          } else if (!value.match(this.vldEmail)) {
            this.errorMessages.email = false
            this.errorMessages.emailValid = true
          } else {
            this.errorMessages.email = false
            this.errorMessages.emailValid = false
          }
          this.registrationDetails.email = value
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
          } else if (value.match(this.vldPhone)) {
            this.errorMessages.phone = false
            this.errorMessages.phoneNonDigit = true
          } else {
            this.errorMessages.phone = undefined
            this.errorMessages.phoneNonDigit = undefined
          }
          this.registrationDetails.phone = value
          if (this.registrationDetails.phone && this.registrationDetails.phone.length !== this.vldPhoneLength) {
            this.errorMessages.phoneLength = true
          } else {
            this.errorMessages.phoneLength = false
          }
          if (this.registrationDetails.phone && this.registrationDetails.phone.match(this.vldPhone)) {
            this.errorMessages.phoneNonDigit = true
          } else {
            this.errorMessages.phoneNonDigit = false
          }
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
            if (!value.match(this.vldPasswordSpecialChar) || (value.length > 0 && value.length < this.vldPasswordMinLength)) {
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
      IDDCSecurityQuestion1: {
        get () {
          return this.registrationDetails.IDDCSecurityQuestion1 || undefined
        },
        set (value) {
          if (value.length === 0) {
            this.errorMessages.securityQuestion1 = true
          } else {
            this.errorMessages.securityQuestion1 = undefined
          }
          this.registrationDetails.IDDCSecurityQuestion1 = value
          this.registrationDetails.securityQuestion1 = this.secretQuestionsArray1.find(e => e.IDDCSecretQuestion === value).Question
        }
      },
      securityAnswer1: {
        get () {
          return this.registrationDetails.securityAnswer1 || undefined
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
          this.registrationDetails.securityAnswer1 = value
        }
      },
      IDDCSecurityQuestion2: {
        get () {
          return this.registrationDetails.IDDCSecurityQuestion2 || undefined
        },
        set (value) {
          if (value.length === 0) {
            this.errorMessages.securityQuestion2 = true
          } else {
            this.errorMessages.securityQuestion2 = undefined
          }
          this.registrationDetails.IDDCSecurityQuestion2 = value
          this.registrationDetails.securityQuestion2 = this.secretQuestionsArray2.find(e => e.IDDCSecretQuestion === value).Question
        }
      },
      securityAnswer2: {
        get () {
          return this.registrationDetails.securityAnswer2 || undefined
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
          this.registrationDetails.securityAnswer2 = value
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
      isOpenedFromWebView () {
        return store.getters['getIsOpenedFromWebView']
      },
      scannedIDData () {
        return store.getters['getScannedID']
      },
      scanData () {
        return window.ctsautoconf.SCAN_DRIVERS_LICENSE
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
      showHouseRules () {
        return window.ctsautoconf.includeHouseRulesInRegistrationPage
      },
      secretQuestionsArray1Options () {
        var self = this
        var items = [{text: 'Please select question', value: '', disabled: true}]
        for (var i = 0; i < self.secretQuestionsArray1.length; i++) {
          var item = {
            text: self.secretQuestionsArray1[i].Question,
            value: self.secretQuestionsArray1[i].IDDCSecretQuestion
          }
          items.push(item)
        }
        return items
      },
      secretQuestionsArray2Options () {
        var self = this
        var items = [{text: 'Please select question', value: '', disabled: true}]
        for (var i = 0; i < self.secretQuestionsArray2.length; i++) {
          var item = {
            text: self.secretQuestionsArray2[i].Question,
            value: self.secretQuestionsArray2[i].IDDCSecretQuestion
          }
          items.push(item)
        }
        return items
      },
      lookupAddressResponse () {
        return store.getters['getLookupAddressResponse'] || true
      },
      googlePlacesApiEnabled () {
        return window.ctsautoconf.GooglePlacesApiKey && window.ctsautoconf.GooglePlacesApiKey !== null
      },
      MobilelocalServer () {
        return window.ctsautoconf.MOBILE_LS || false
      },
      googlePlacesApiMobileAppEnabled () {
        return window.ctsautoconf.GooglePlacesApiMobileAppEnabled
      }
    },
    methods: {
      go2Home () {
        this.$router.push({name: 'sports', params: { }})
      },
      getPrivacyPolicyContent () {
        var self = this
        axios.get(this.mediaServer('/static/static-content/privacy-policy.html')).then(response => {
          self.privacyPolicyContent = response.data
        })
      },
      getHouseRulesContent () {
        var self = this
        axios.get(this.mediaServer('/static/static-content/rules.html')).then(response => {
          self.houseRulesContent = response.data
        })
      },
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
      fetchSecretQuestions () {
        lib.rpcService.callBroker('BusinessUnitService', 'GetSecretQuestions')
          .then(response => {
            let res = response && response.result
            if (res) {
              this.secretQuestionsArray1 = res
              this.secretQuestionsArray2 = res
            }
          }).catch(error => {
            console.log(error)
          })
      },
      isAnyUnpopulatedField () {
        if (!this.registrationDetails.userName) {
          this.errorMessages.userName = true
        }
        if (!this.registrationDetails.title) {
          this.errorMessages.title = true
        }
        if (!this.registrationDetails.firstName) {
          this.errorMessages.firstName = true
        }
        if (!this.registrationDetails.lastName) {
          this.errorMessages.lastName = true
        }
        this.checkDateOfBirth()
        if (!this.registrationDetails.email) {
          this.errorMessages.email = true
        }
        if (!this.registrationDetails.phone) {
          this.errorMessages.phone = true
        }
        if (!this.registrationDetails.pass) {
          this.errorMessages.pass = true
        }
        if (!this.confirmedPasswordField) {
          this.errorMessages.confirmedPassMissing = true
        }
        if (!this.registrationDetails.IDDCSecurityQuestion1) {
          this.errorMessages.securityQuestion1 = true
        }
        if (!this.registrationDetails.securityAnswer1) {
          this.errorMessages.securityAnswer1 = true
        }
        if (!this.registrationDetails.IDDCSecurityQuestion2) {
          this.errorMessages.securityQuestion2 = true
        }
        if (!this.registrationDetails.securityAnswer2) {
          this.errorMessages.securityAnswer2 = true
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
        if (!this.registrationDetails.ssn) {
          this.errorMessages.ssn = true
        }
        if (this.isTermsAndConditionsMandatory && !this.registrationDetails.tc) {
          this.errorMessages.tc = true
        }
        if (this.attestations && this.errorMessages) {
          this.attestations.map(item => {
            if (!item.value) {
              this.errorMessages[item.idmmattestation] = true
            }
          })
        }
        if (this.registrationDetails.IDDCSecurityQuestion1 && this.registrationDetails.IDDCSecurityQuestion2 &&
        (this.registrationDetails.IDDCSecurityQuestion1 === this.registrationDetails.IDDCSecurityQuestion2)) {
          this.errorMessages.securityQuestionsHaveToBeDifferent = true
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
      getUserAttestations () {
        let atts = []
        this.attestations.forEach(att => {
          atts.push(att.idmmattestation)
        })
        return atts
      },
      getAffiliateCode () {
        let ret = null
        if (window.ctsautoconf.INCOME_ACCESS_ENABLED) {
          ret = config.customCookies.getCookie('IA').btag || null
        }
        return ret
      },
      register () {
        if (this.isEverythingValid()) {
          this.isProcessing = true
          this.transactionError = null
          this.duplicateEmail = null
          this.dialog = true
          store.dispatch('userServiceRegisterCustomer', {
            'userName': this.userName,
            'title': this.title,
            'gender': this.registrationDetails.gender,
            'firstName': this.firstName,
            'lastName': this.lastName,
            'dateOfBirth': moment(this.registrationDetails.dateOfBirth).format(config.app.dateFormats.iso8601),
            'email': this.email,
            'phone': this.phone.replace(/\D+/g, ''),
            'password': this.pass,
            'IDDCSecurityQuestion': this.IDDCSecurityQuestion1,
            'securityQuestion': this.registrationDetails.securityQuestion1,
            'securityAnswer': this.securityAnswer1,
            'IDDCSecurityQuestion2': this.IDDCSecurityQuestion2,
            'securityQuestion2': this.registrationDetails.securityQuestion2,
            'securityAnswer2': this.securityAnswer2,
            'address': this.address,
            'postCode': this.zipCode.toString(),
            'city': this.city,
            'state': this.state,
            'ssn': this.ssn.toString(),
            'tc': this.tc,
            'attestations': this.getUserAttestations(),
            'affiliateCode': this.getAffiliateCode()
          })
            .then((response) => {
              if (response && response.exceptionType && response.message) {
                this.duplicateEmail = response.exceptionType === 'EmailAlreadyExistsException'
                this.transactionError = response.message
              } else {
                if (window.ctsautoconf.MOBILE_LS) adjust.adjustEventRequest('registration')
                this.isProcessing = false
              }
            })
            .catch((err) => {
              if (window.dataLayer || store.getters['getThirdpartyAnalytics']) {
                let registration = {
                  'event': 'signup_failed',
                  'gaEventCategory': 'registration',
                  'gaEventAction': 'registration failed'
                }
                store.dispatch('analyticsHandler', {'event': registration})
              }
              this.duplicateEmail = err.exceptionType === 'EmailAlreadyExistsException'
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
      fetchAttestations () {
        lib.kansas.iwparams({})
        .then(response => {
          if (response && response.data && response.data.attestations) {
            this.attestations = response.data.attestations
            this.attestations = Vue._.orderBy(this.attestations, 'sortorder', 'asc')
            this.attestations.forEach(val => {
              this.$set(this.errorMessages, val.idmmattestation, false)
            })
          }
        }).catch((error) => {
          console.log('fetch attestations error')
          console.log(error)
        }).finally(() => {
        })
      },
      toggleTandC (param) {
        if (param === 'open') {
          this.termsAndConditionsPopup = true
          this.fetchTermsAndConditions()
        } else if (param === 'accept') {
          this.termsAndConditionsPopup = false
          this.tc = true
        } else if (param === 'decline') {
          this.termsAndConditionsPopup = false
          this.tc = false
        }
      },
      togglePrivacyPolicy (param) {
        if (param === 'open') {
          this.privacyPolicyPopup = true
        } else if (param === 'accept') {
          this.privacyPolicyPopup = false
          this.tc = true
        } else if (param === 'decline') {
          this.privacyPolicyPopup = false
          this.tc = false
        }
      },
      toggleHouseRules (param) {
        if (param === 'open') {
          this.houseRulesPopup = true
        } else if (param === 'accept') {
          this.houseRulesPopup = false
          this.tc = true
        } else if (param === 'decline') {
          this.houseRulesPopup = false
          this.tc = false
        }
      },
      fetchTermsAndConditions () {
        lib.rpcService.callBroker('UserService', 'GetTsAndCsText', {'IDMDLanguage': config.app.language, 'versionNumber': null})
          .then(response => {
            if (response && response.result) {
              if (response.result.includes('<html>') || response.result.includes('<head>') || response.result.includes('<body>')) {
                let res = response.result
                let ifr = this.$refs.tAndCondIF
                ifr = ifr && (ifr.contentWindow || (ifr.contentDocument.document || ifr.contentDocument))
                if (ifr) {
                  ifr.document.open()
                  ifr.document.write(res)
                  ifr.document.close()
                }
              } else {
                this.tAndCIFrame = false
                this.tAndCText = response.result
              }
            }
          })
      },
      attestationClick (attestation) {
        if (attestation.value && attestation.value.length) {
          this.errorMessages[attestation.idmmattestation] = true
        } else {
          this.errorMessages[attestation.idmmattestation] = undefined
        }
      },
      checkOutSecurityQuestion () {
        if (this.registrationDetails.IDDCSecurityQuestion1 === this.registrationDetails.IDDCSecurityQuestion2) {
          this.errorMessages.securityQuestionsHaveToBeDifferent = true
        } else {
          this.errorMessages.securityQuestionsHaveToBeDifferent = false
        }
      },
      closeVerificationDialog () {
        if (config.app.autoconf.AUTO_LOGIN_AFTER_REGISTRATION && !this.transactionError) {
          // no strong auth
          localStorage.autologinAfterRegistration = true
          store.dispatch('login2FA', {
            'username': this.userName,
            'password': this.pass
          })
        }
      },
      scanID () {
        mobileBridge.bridgeSendRequest('scanDocument')
      },
      mapScannedUserName () {
        let sdFirstName = this.scannedIDData && this.scannedIDData.FirstName
        if (sdFirstName) {
          if (sdFirstName.indexOf(', ') > -1) {
            this.firstName = sdFirstName.split(', ')[0]
          } else {
            this.firstName = sdFirstName
          }
        }
      },
      checkSplitSymbol () {
        // u21B5 is the unicode for new row arrow, /\r\n|\r|\n/g is regex for new row
        if ((this.scannedIDData && this.scannedIDData.Address && this.scannedIDData.Address.split(/\u21B5/g)).length === 2) {
          this.splitSymbol = /\u21B5/g
        } else if ((this.scannedIDData && this.scannedIDData.Address && this.scannedIDData.Address.split(/\r\n|\r|\n/g)).length === 2) {
          this.splitSymbol = /\r\n|\r|\n/g
        }
      },
      mapScannedLastName () {
        let sdLastName = this.scannedIDData && this.scannedIDData.LastName
        if (sdLastName) {
          this.lastName = sdLastName
        }
      },
      mapScannedDOB () {
        let sdDOBstring = this.scannedIDData && this.scannedIDData.DateOfBirth
        // let sdDOB = new Date(sdDOBstring)
        if (sdDOBstring) {
          this.dateOfBirth = sdDOBstring
        }
      },
      mapScannedAddress () {
        if (this.splitSymbol) {
          let sdAddress = this.scannedIDData && this.scannedIDData.Address && this.scannedIDData.Address.split(this.splitSymbol)[0]
          if (sdAddress) {
            this.address = sdAddress
          }
        } else {
          // no split symbol, try reading a prop
          const sdAddress = this.scannedIDData && this.scannedIDData.AddressStreet
          if (sdAddress) {
            this.address = sdAddress
          }
        }
      },
      mapScannedCity () {
        if (this.splitSymbol) {
          let sdCity = this.scannedIDData && this.scannedIDData.Address && this.scannedIDData.Address.split(this.splitSymbol)[1]
          if ((sdCity && sdCity.indexOf(', ')) > -1) {
            sdCity = (sdCity.split(', ') && sdCity.split(', ')[0]) || ''
            if (sdCity) {
              this.city = sdCity
            }
          } else if ((sdCity && sdCity.indexOf(',')) > -1) {
            sdCity = (sdCity.split(',') && sdCity.split(',')[0]) || ''
            if (sdCity) {
              this.city = sdCity
            }
          } else if ((sdCity && sdCity.indexOf(' ')) > -1) {
            sdCity = (sdCity.split(' ') && sdCity.split(' ')[0]) || ''
            if (sdCity) {
              this.city = sdCity
            }
          }
        } else {
          // no split symbol, try reading a prop
          const sdCity = this.scannedIDData && this.scannedIDData.AddressCity
          if (sdCity) {
            this.city = sdCity
          }
        }
      },
      mapScannedState () {
        if (this.splitSymbol) {
          let sdState = this.scannedIDData && this.scannedIDData.Address && this.scannedIDData.Address.split(this.splitSymbol)[1]
          let splittedSdState, moreSplittedSdState
          if ((sdState && sdState.indexOf(', ')) > -1) {
            splittedSdState = sdState.split(', ') && sdState.split(', ')[1]
            if (splittedSdState && splittedSdState.indexOf(' ')) {
              moreSplittedSdState = splittedSdState.split(' ') && splittedSdState.split(' ')[0]
              if (moreSplittedSdState && moreSplittedSdState.length === 2) {
                this.state = moreSplittedSdState.toUpperCase()
              }
            }
          } else if ((sdState && sdState.indexOf(',')) > -1) {
            splittedSdState = sdState.split(',') && sdState.split(',')[1]
            if (splittedSdState && splittedSdState.indexOf(' ')) {
              moreSplittedSdState = splittedSdState.split(' ') && splittedSdState.split(' ')[0]
              if (moreSplittedSdState && moreSplittedSdState.length === 2) {
                this.state = moreSplittedSdState.toUpperCase()
              }
            }
          } else if ((sdState && sdState.indexOf(' ')) > -1) {
            splittedSdState = sdState.split(' ') && sdState.split(' ')[1]
            if (splittedSdState && splittedSdState.indexOf(' ')) {
              moreSplittedSdState = splittedSdState.split(' ') && splittedSdState.split(' ')[0]
              if (moreSplittedSdState && moreSplittedSdState.length === 2) {
                this.state = moreSplittedSdState.toUpperCase()
              }
            }
          }
        } else {
          // no split symbol, try reading a prop
          const stateCode = this.scannedIDData && this.scannedIDData.AddressJurisdictionCode
          if (stateCode) {
            this.state = stateCode
          }
        }
      },
      mapScannedZip () {
        if (this.splitSymbol) {
          let sdZip = this.scannedIDData && this.scannedIDData.Address && this.scannedIDData.Address.split(this.splitSymbol)[1]
          let splittedSdZip, moreSplittedSdZip, theMostSplittedSdZip
          if ((sdZip && sdZip.indexOf(', ')) > -1) {
            splittedSdZip = sdZip.split(', ') && sdZip.split(', ')[1]
            if (splittedSdZip && splittedSdZip.indexOf(' ')) {
              moreSplittedSdZip = splittedSdZip.split(' ') && splittedSdZip.split(' ')[1]
              if (moreSplittedSdZip) {
                // example: 85965-4156
                theMostSplittedSdZip = moreSplittedSdZip.indexOf('-') ? moreSplittedSdZip.split('-') && moreSplittedSdZip.split('-')[0] : undefined
                if (theMostSplittedSdZip) {
                  this.zipCode = theMostSplittedSdZip
                }
                // example No2: 85965
                if (moreSplittedSdZip.length === 5) {
                  this.zipCode = moreSplittedSdZip
                }
              }
            }
          } else if ((sdZip && sdZip.indexOf(',')) > -1) {
            splittedSdZip = sdZip.split(',')[1]
            if (splittedSdZip && splittedSdZip.indexOf(' ')) {
              moreSplittedSdZip = splittedSdZip.split(' ') && splittedSdZip.split(' ')[1]
              if (moreSplittedSdZip) {
                // example: 85965-4156
                theMostSplittedSdZip = moreSplittedSdZip.indexOf('-') ? moreSplittedSdZip.split('-') && moreSplittedSdZip.split('-')[0] : undefined
                if (theMostSplittedSdZip) {
                  this.zipCode = theMostSplittedSdZip
                }
                // example No2: 85965
                if (moreSplittedSdZip.length === 5) {
                  this.zipCode = moreSplittedSdZip
                }
              }
            }
          } else if ((sdZip && sdZip.indexOf(' ')) > -1) {
            splittedSdZip = sdZip.split(' ')[2]
            if (splittedSdZip) {
              // example: 85965-4156
              moreSplittedSdZip = splittedSdZip.indexOf('-') ? splittedSdZip.split('-') && splittedSdZip.split('-')[0] : undefined
              if (moreSplittedSdZip) {
                this.zipCode = moreSplittedSdZip
              }
              // example No2: 85965
              if (splittedSdZip.length === 5) {
                this.zipCode = splittedSdZip
              }
            }
          }
        } else {
          // no split symbol, try reading a prop
          const zip = this.scannedIDData && this.scannedIDData.AddressPostalCode
          if (zip) {
            this.zipCode = zip
          }
        }
      },
      mapScannedIDData2Form () {
        // checkSplitSymbol()
        this.mapScannedUserName()
        this.mapScannedLastName()
        this.mapScannedDOB()
        this.mapScannedAddress()
        this.mapScannedCity()
        this.mapScannedState()
        this.mapScannedZip()
      },
      toggleShowPassword () {
        this.showPassword = !this.showPassword
      },
      toggleShowConfirmPassword () {
        this.showConfirmPassword = !this.showConfirmPassword
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
      addressChanged () { // for mobile app
        if (this.googlePlacesApiMobileAppEnabled && window.ctsautoconf.MOBILE_LS && !this.enterAddressManually) {
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
      /* expandAddresses () {
        this.addressesFromApp = true
      }, */
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
      /* addressFocus () { // to be deleted at all
        this.populateAddressList() // to be deleted
        if (!this.enterAddressManually) {
          this.showGoogleAddressLookup = true
          this.addressesFromApp = true
        }
      }, */
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
      }
    },
    mounted  () {
      this.fetchSecretQuestions()
      if (!window.ctsautoconf.MOBILE_LS) {
        if (this.googlePlacesApiEnabled) {
          setTimeout(() => {
            this.googlePlacesSearch(this.initLocationSearch)
          }, 1000)
        }
      }
      // this.populateAddressList()
      // this.showGoogleAddressLookup = true
      // this.addressesFromApp = true
    },
    created () {
      this.fetchAttestations()
      this.getPrivacyPolicyContent()
      this.getHouseRulesContent()
      this.GTMregistrationStart()
    },
    watch: {
      scannedIDData (value) {
        if (value) {
          this.mapScannedIDData2Form()
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
    color red
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

</style>
