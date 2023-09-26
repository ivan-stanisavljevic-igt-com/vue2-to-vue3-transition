<template>
  <div>
    <!-- EMAIL -->
      <div class="control-block" :class="{ 'filled': email }">
        <input type="text" v-model.trim="email" id="email" autocomplete="off" maxlength="255" @focusout="!registrationDetails.email ? errorMessages.email = true : errorMessages.email = false"/>
        <label class="control-label">{{ $t('Account.Join.Email') }}<span class="control-label-required"> *</span></label>
      </div>
      <!-- EMAIL VALIDATION -->
      <div>
        <div class="vmsg invalid" v-if="errorMessages.email" id="err_msg_email_missing" v-html="$t('Account.Join.ErrorMsg.Email')"></div>
        <div class="vmsg invalid" v-if="errorMessages.emailValid" id="err_msg_email_invalid" v-html="$t('Account.Join.ErrorMsg.EmailInvalid')"></div>
        <div class="vmsg invalid" v-if="errorR === 'duplicateemail'" id="err_msg_email_invalid" v-html="$t('Account.Join.ErrorMsg.EmailDuplicate')"></div>
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
        <div class="vmsg invalid" v-if="errorR === 'usernametaken'" id="err_msg_email_invalid" v-html="$t('Account.Join.ErrorMsg.UsernameTaken')"></div>
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

    <!-- PROMO CODE -->
    <div class="control-block" :class="{ filled: promo }" v-if="isRafPromo">
      <input type="text" v-model.trim="promo" id="promo" autocomplete="off" />
      <label class="control-label" key="pd_promo_label">
        {{ $t('Account.Join.PromoCode') }}
      </label>
    </div>
    <!-- PROMO CODE VALIDATION -->
    <div>
      <div class="vmsg invalid" v-if="errorR === 'PromoCodeIsInvalid'" id="err_msg_email_invalid" v-html="$t('Account.Join.ErrorMsg.PromoCodeIsInvalid')"></div>
      <div class="vmsg invalid" v-if="errorR === 'PromoCodeIsNotValidAnymore'" id="err_msg_email_invalid" v-html="$t('Account.Join.ErrorMsg.PromoCodeIsNotValidAnymore')"></div>
    </div>
    <div>
    </div>
  </div>
</template>

<script>
import config from '@/config'
import Validation from '@/components/mixins/Validation'
export default {
  name: 'RegStep1',
  props: ['currentStep', 'currentStepState', 'registrationDetails', 'regError'],
  mixins: [
    Validation
  ],
  data: () => ({
    errorMessages: {
      userName: false,
      userNameLength: false,
      userNameSymbol: false,
      email: false,
      emailValid: false,
      pass: false,
      passStrength: false
    },
    showPassword: false,
    mainURL: window.location.origin
  }),
  computed: {
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
        this.errorR = this.errorR === 'duplicateemail' ? undefined : this.errorR
        this.registrationDetails.email = value
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
        this.errorR = this.errorR === 'usernametaken' ? undefined : this.errorR
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
          if (!value.match(this.vldPasswordSpecialChar) || (value.length > 0 && value.length < this.vldPasswordMinLength)) {
            this.errorMessages.pass = undefined
            this.errorMessages.passStrength = true
          } else {
            this.errorMessages.pass = undefined
            this.errorMessages.passStrength = undefined
          }
        }
        this.registrationDetails.pass = value
      }
    },
    promo: {
      get () {
        return this.registrationDetails.promo || undefined
      },
      set (value) {
        this.registrationDetails.promo = value
        this.errorR = this.errorR === 'PromoCodeIsInvalid' ? undefined : this.errorR
        this.errorR = this.errorR === 'PromoCodeIsNotValidAnymore' ? undefined : this.errorR
      }
    },
    errorR: {
      get () {
        return this.regError || undefined
      },
      set (value) {
        this.$emit('updateRegError', value)
      }
    },
    isRafPromo () {
      return config.app.autoconf.USE_RAF_PROMO
    }
  },
  methods: {
    toggleShowPassword () {
      this.showPassword = !this.showPassword
    },
    isAnyUnpopulatedField () {
      if (!this.registrationDetails.email) {
        this.errorMessages.email = true
      }
      if (!this.registrationDetails.userName) {
        this.errorMessages.userName = true
      }
      if (!this.registrationDetails.pass) {
        this.errorMessages.pass = true
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
    }
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
</style>
