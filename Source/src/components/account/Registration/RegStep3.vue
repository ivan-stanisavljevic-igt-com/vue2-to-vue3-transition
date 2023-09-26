<template>
  <div v-if="secretQuestionsArray1 && secretQuestionsArray1.length > 0">
    <div>
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
        <div class="vmsg invalid" v-if="errorR === 'duplicatephone'" id="err_msg_email_invalid" v-html="$t('Account.Join.ErrorMsg.PhoneDuplicate')"></div>
      </div>
    </div>

    <!-- SECURITY QUESTION 1 -->
    <div class="control-block cs" :class="{ 'filled': IDDCSecurityQuestion1 }">
      <v-select class="custom-select" :menu-props="{ contentClass: 'select_list' }"
                v-model="IDDCSecurityQuestion1"
                id="IDDCSecurityQuestion1"
                :items="secretQuestionsArray1Options"
                label=""
      ></v-select>
      <label class="control-label">{{ $t('Account.SecurityQuestion1.Label') }}<span > {{ $t('Account.SecurityQuestionAnswer.Label.Optional') }}</span></label>
    </div>


    <!-- SECURITY ANSWER 1 -->
    <div class="control-block" :class="{ 'filled': securityAnswer1 }">
      <input type="text" v-model.trim="securityAnswer1" id="securityAnswer1" autocomplete="off" maxlength="50" />
      <label class="control-label">{{ $t('Account.Join.SecurityAnswer1') }}<span > {{ $t('Account.SecurityQuestionAnswer.Label.Optional') }}</span></label>
    </div>

    <!-- SECURITY QUESTION 2 -->
    <div class="control-block cs" :class="{ 'filled': IDDCSecurityQuestion2 }">
      <v-select class="custom-select" :menu-props="{ contentClass: 'select_list' }"
                v-model="IDDCSecurityQuestion2"
                id="IDDCSecurityQuestion2"
                :items="secretQuestionsArray2Options"
                label=""
      ></v-select>
      <label class="control-label">{{ $t('Account.SecurityQuestion2.Label') }}<span > {{ $t('Account.SecurityQuestionAnswer.Label.Optional') }}</span></label>
    </div>

    <!-- SECURITY ANSWER 2 -->
    <div class="control-block" :class="{ 'filled': securityAnswer2 }">
      <input type="text" v-model.trim="securityAnswer2" id="securityAnswer2" autocomplete="off" maxlength="50" />
      <label class="control-label">{{ $t('Account.Join.SecurityAnswer2') }}<span > {{ $t('Account.SecurityQuestionAnswer.Label.Optional') }}</span></label>
    </div>
  </div>
</template>

<script>
  import Validation from '@/components/mixins/Validation'
  import lib from '@/library'
  export default {
    name: 'RegStep3',
    props: ['currentStep', 'currentStepState', 'registrationDetails', 'regError'],
    mixins: [
      Validation
    ],
    data: () => ({
      secretQuestionsArray1: [],
      secretQuestionsArray2: [],
      errorMessages: {
        phone: false,
        phoneNonDigit: false,
        phoneLength: false
      }
    }),
    computed: {
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
            this.errorMessages.phone = false
            this.errorMessages.phoneNonDigit = false
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
          this.errorR = this.errorR === 'duplicatephone' ? undefined : this.errorR
        }
      },
      IDDCSecurityQuestion1: {
        get () {
          return this.registrationDetails.IDDCSecurityQuestion1 || undefined
        },
        set (value) {
          this.registrationDetails.IDDCSecurityQuestion1 = value
          this.registrationDetails.securityQuestion1 = this.secretQuestionsArray1.find(e => e.IDDCSecretQuestion === value).Question
        }
      },
      securityAnswer1: {
        get () {
          return this.registrationDetails.securityAnswer1 || undefined
        },
        set (value) {
          this.registrationDetails.securityAnswer1 = value
        }
      },
      IDDCSecurityQuestion2: {
        get () {
          return this.registrationDetails.IDDCSecurityQuestion2 || undefined
        },
        set (value) {
          this.registrationDetails.IDDCSecurityQuestion2 = value
          this.registrationDetails.securityQuestion2 = this.secretQuestionsArray2.find(e => e.IDDCSecretQuestion === value).Question
        }
      },
      securityAnswer2: {
        get () {
          return this.registrationDetails.securityAnswer2 || undefined
        },
        set (value) {
          this.registrationDetails.securityAnswer2 = value
        }
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
        if (!this.registrationDetails.phone) {
          this.errorMessages.phone = true
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
    },
    watch: {
    },
    created () {
    },
    mounted () {
      this.fetchSecretQuestions()
    }
  }
</script>

<style lang="stylus" scoped>
  @import "~@/css/config"
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
</style>
