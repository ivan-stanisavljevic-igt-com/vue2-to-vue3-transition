import store from '@/store'
import config from '@/config'

export default {
  data: () => ({
    fallbackFirstName: '^(.*)$',
    fallbackLastName: '^(.*)$',
    fallbackEmail: '^([a-zA-Z0-9_\\.\\-])+\\@(([a-zA-Z0-9\\-])+\\.)+([a-zA-Z0-9]{2,4})+$',
    fallbackPhone: '\\D',
    fallbackPhoneLength: 10,
    fallbackMobile: '\\D',
    fallbackMobileLength: 10,
    fallbackPassword: '^(.*)$',
    fallbackPasswordSpecialChar: '^(.*)$',
    fallbackZipCode: '\\D',
    fallbackZipCodeLength: 5,
    fallbackSsn: '\\D',
    fallbackSsnLength: 4,
    fallbackAddressLength: '^.{1,200}$',
    fallbackCity: '\\d',
    fallbackValidationPinCode: '\\D',
    fallbackValidationPinCodeLength: 6,
    fallbackUsernameMinLength: 1,
    fallbackUsernameMaxLength: 20,
    fallbackPasswordMinLength: 1,
    fallbackPasswordMaxLength: 20,
    fallbackAllowedFileExtensionUploadDoc: '\\.(gif|jpg|jpeg|tiff|png)$',
    fallbackAllowedFileExtensionUploadDocExt: '\\.(gif|jpg|jpeg|tiff|png|pdf)$',
    fallbackUserNameSymbol: '^[^@]*$'
  }),

  computed: {
    validationRules () {
      return store.getters['getValidationRules']
    },
    vldFirstName () { return this.validationRules && this.validationRules.firstName ? this.validationRules.firstName : this.fallbackFirstName },
    vldLastName () { return this.validationRules && this.validationRules.lastName ? this.validationRules.lastName : this.fallbackLastName },
    vldEmail () { return this.validationRules && this.validationRules.email ? this.validationRules.email : this.fallbackEmail },
    vldPhone () { return this.validationRules && this.validationRules.phone ? this.validationRules.phone : this.fallbackPhone },
    vldPhoneLength () { return this.validationRules && this.validationRules.phoneLength ? this.validationRules.phoneLength : this.fallbackPhoneLength },
    vldMobile () { return this.validationRules && this.validationRules.mobile ? this.validationRules.mobile : this.fallbackMobile },
    vldMobileLength () { return this.validationRules && this.validationRules.mobileLength ? this.validationRules.mobileLength : this.fallbackMobileLength },
    vldPassword () { return this.validationRules && this.validationRules.password ? this.validationRules.password : this.fallbackPassword },
    vldPasswordSpecialChar () { return this.validationRules && this.validationRules.passwordSpecialChar ? this.validationRules.passwordSpecialChar : this.fallbackPasswordSpecialChar },
    vldZipCode () { return this.validationRules && this.validationRules.zipCode ? this.validationRules.zipCode : this.fallbackZipCode },
    vldZipCodeLength () { return this.validationRules && this.validationRules.zipCodeLength ? this.validationRules.zipCodeLength : this.fallbackZipCodeLength },
    vldSsn () { return this.validationRules && this.validationRules.ssn ? this.validationRules.ssn : this.fallbackSsn },
    vldSsnLength () { return this.validationRules && this.validationRules.ssnLength ? this.validationRules.ssnLength : this.fallbackSsnLength },
    vldAddressLength () { return this.validationRules && this.validationRules.addressLength ? this.validationRules.addressLength : this.fallbackAddressLength },
    vldCity () { return this.validationRules && this.validationRules.city ? this.validationRules.city : this.fallbackCity },
    vldValidationPinCode () { return this.validationRules && this.validationRules.validationPinCode ? this.validationRules.validationPinCode : this.fallbackValidationPinCode },
    vldValidationPinCodeLength () { return this.validationRules && this.validationRules.validationPinCodeLength ? this.validationRules.validationPinCodeLength : this.fallbackValidationPinCodeLength },
    vldUsernameMinLength () {
      if (window.ctsautoconf && typeof config.app.autoconf.USER_NAME_MIN_LENGTH !== 'undefined') {
        return config.app.autoconf.USER_NAME_MIN_LENGTH
      } else if (this.validationRules && this.validationRules.userNameMinLengthDefault) {
        return this.validationRules.userNameMinLengthDefault
      } else {
        return this.fallbackUsernameMinLength
      }
    },
    vldUsernameMaxLength () {
      if (window.ctsautoconf && typeof config.app.autoconf.USER_NAME_MAX_LENGTH !== 'undefined') {
        return config.app.autoconf.USER_NAME_MAX_LENGTH
      } else if (this.validationRules && this.validationRules.userNameMaxLengthDefault) {
        return this.validationRules.userNameMaxLengthDefault
      } else {
        return this.fallbackUsernameMaxLength
      }
    },
    vldPasswordMinLength () {
      if (window.ctsautoconf && typeof config.app.autoconf.PWD_MIN_LENGTH !== 'undefined') {
        return config.app.autoconf.PWD_MIN_LENGTH
      } else if (this.validationRules && this.validationRules.pwdMinLengthDefault) {
        return this.validationRules.pwdMinLengthDefault
      } else {
        return this.fallbackPasswordMinLength
      }
    },
    vldPasswordMaxLength () {
      if (window.ctsautoconf && typeof config.app.autoconf.PWD_MAX_LENGTH !== 'undefined') {
        return config.app.autoconf.PWD_MAX_LENGTH
      } else if (this.validationRules && this.validationRules.pwdMaxLengthDefault) {
        return this.validationRules.pwdMaxLengthDefault
      } else {
        return this.fallbackPasswordMaxLength
      }
    },
    vldAllowedFileExtensionUploadDoc () { return this.validationRules && this.validationRules.allowedFileExtensionUploadDoc ? this.validationRules.allowedFileExtensionUploadDoc : this.fallbackAllowedFileExtensionUploadDoc },
    vldAllowedFileExtensionUploadDocExt () { return this.validationRules && this.validationRules.fallbackAllowedFileExtensionUploadDocExt ? this.validationRules.fallbackAllowedFileExtensionUploadDocExt : this.fallbackAllowedFileExtensionUploadDocExt },
    vldUserNameSymbol () { return this.validationRules && this.validationRules.userNameSymbol ? this.validationRules.userNameSymbol : this.fallbackUserNameSymbol }
  },

  methods: {

  }
}
