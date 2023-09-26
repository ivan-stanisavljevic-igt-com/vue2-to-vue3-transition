<template>
  <div class="verify-content">
    <div v-if="!translationsLoaded">
      <circle-loader></circle-loader>
    </div>
    <div v-else>
      <div class="account-page ctsform">
        <v-container fluid >
          <h2><span>{{ $t('Account.SequentialVerification.ChangeDetail.Title', {verifyDetail: verifyDetail}) }} </span></h2>
          <p>Enter your {{ verifyDetail }} below</p>
        </v-container>
        <form id="confirmEmalByPinForm">
            <div v-if="verifyDetail === 'Email'" class="control-block" :class="{ 'filled': email }" >
              <label class="control-label">{{ verifyDetail }}</label>
              <!-- EMAIL CHANGE -->
              <input  v-if="verifyDetail === 'Email'"  type="email"  maxlength="255"
              autocomplete="off" v-model.trim="email" id="email" @focusout="!changeDetails.PrimaryEmail ? errorMessages.email = true : errorMessages.email = false"
              />
            </div>
            <div v-else class="control-block" :class="{ 'filled': phone }">
              <!-- PHONE CHANGE -->
              <input  type="tel"  :maxlength="validationRules && validationRules.phoneLength"
              autocomplete="off" v-model.trim="phone" id="phone" @focusout="!changeDetails.MobilePhone ? errorMessages.phone = true : errorMessages.phone = false"
              />
              <label class="control-label">{{ verifyDetail }}</label>
            </div>
          <!-- PHONE VALIDATION -->
          <div v-if="verifyDetail === 'Cell Phone'">
            <div class="vmsg invalid" v-if="errorMessages.phone" id="err_msg_phone_missing" v-html="$t('Account.Join.ErrorMsg.Phone')"></div>
            <div class="vmsg invalid" v-if="errorMessages.phoneNonDigit" id="err_msg_phone_not_digit" v-html="$t('Account.Join.ErrorMsg.PhoneNonDigit')"></div>
            <div class="vmsg invalid" v-if="errorMessages.phoneLength" id="err_msg_phone_length" v-html="$t('Account.Join.ErrorMsg.PhoneLength', { length: validationRules && validationRules.phoneLength })"></div>
         </div>
           <!-- EMAIL VALIDATION -->
          <div v-else>
            <div class="vmsg invalid" v-if="errorMessages.email" id="err_msg_email_missing" v-html="$t('Account.Join.ErrorMsg.Email')"></div>
            <div class="vmsg invalid" v-if="errorMessages.emailValid" id="err_msg_email_invalid" v-html="$t('Account.Join.ErrorMsg.EmailInvalid')"></div>
          </div>
           <!-- UPDATE EMAIL/PHONE -->
          <div class="form-actions">
            <v-btn color="success"  @click.prevent="updateDetails()" type="submit" x-large ><span>{{ $t('Account.SequentialVerification.ChangeDetail.Update', {verifyDetail: verifyDetail}) }}</span></v-btn>
          </div>
          <!-- RETURN FROM ENTERED WRONG EMAIL/PHONE -->
          <div class="form-actions">
            <v-btn class="btn changeBtn" @click.prevent="goBack()" x-large><span>{{ $t('Account.SequentialVerification.ChangeDetail.ReturnFromEnteredWrongData.GoBack') }}</span></v-btn>
          </div>
        </form>
      </div>
    </div>
    <ProcessingDialog
      v-model="dialog"
      :isDialogPersistent="true"
      :isProcessing="isProcessing"
      :isSuccess="!transactionError"
      :processingTitle="$t('Account.PersonalDetails.Dialog.Processing.Title')"
      :processingText="$t('Account.PersonalDetails.Dialog.Processing.Text')"
      :successTitle="$t('Account.PersonalDetails.Dialog.Success.Title')"
      :successText="$t('Account.PersonalDetails.Dialog.Success.Text')"
      :errorTitle="$t('Account.PersonalDetails.Dialog.Error.Title')"
      :closeBtnText="$t('ProcessingDialog.CloseButtonText')"
    >
      <div slot="text-error">
        <p  class="generic-icon-note"><v-icon color="error" class="mr-1">error</v-icon><span>{{ $t('Account.PersonalDetails.Dialog.Error.Text') }}</span></p>
        <p class="response-error">{{ transactionError }}</p>
        <p v-html="$t('Account.PersonalDetails.Dialog.Error.Text.ContactSupport')"></p>
      </div>
    </ProcessingDialog>
  </div>
</template>

<script>
  import store from '@/store'
  import CircleLoader from '@/components/common/CircleLoader'
  import ProcessingDialog from '@/components/common/ProcessingDialog'
  import lib from '@/library'
  export default {
    name: 'ChangeDetail',
    props: ['page'],
    components: {
      CircleLoader,
      ProcessingDialog
    },
    data () {
      return {
        changeDetails: {
          PrimaryEmail: undefined,
          MobilePhone: undefined
        },
        errorMessages: {
          email: false,
          emailValid: false,
          phone: false,
          phoneNonDigit: false,
          phoneLength: false
        },
        dialog: false,
        isProcessing: false,
        transactionError: null
      }
    },
    computed: {
      email: {
        get () {
          return this.changeDetails.PrimaryEmail || undefined
        },
        set (value) {
          if (value.length === 0) {
            this.errorMessages.email = true
            this.errorMessages.emailValid = false
          } else if (!value.match(this.validationRules.email)) {
            this.errorMessages.email = false
            this.errorMessages.emailValid = true
          } else {
            this.errorMessages.email = false
            this.errorMessages.emailValid = false
          }
          this.changeDetails.PrimaryEmail = value
        }
      },
      phone: {
        get () {
          return this.changeDetails.MobilePhone || undefined
        },
        set (value) {
          if (value.length === 0) {
            this.errorMessages.phone = true
            this.errorMessages.phoneNonDigit = false
          } else if (value.match(this.validationRules.phone)) {
            this.errorMessages.phone = false
            this.errorMessages.phoneNonDigit = true
          } else {
            this.errorMessages.phone = undefined
            this.errorMessages.phoneNonDigit = undefined
          }
          this.changeDetails.MobilePhone = value
          if (this.changeDetails.MobilePhone && this.changeDetails.MobilePhone.length !== this.validationRules.phoneLength) {
            this.errorMessages.phoneLength = true
          } else {
            this.errorMessages.phoneLength = false
          }
          if (this.changeDetails.MobilePhone && this.changeDetails.MobilePhone.match(this.validationRules.phone)) {
            this.errorMessages.phoneNonDigit = true
          } else {
            this.errorMessages.phoneNonDigit = false
          }
        }
      },
      translationsLoaded () {
        return store.getters['getTranslationsLoaded']
      },
      verifyDetail () {
        let detail
        switch (this.page) {
          case 'verify_email':
            detail = this.$t('Account.SequentialVerification.ChangeDetail.Email')
            break
          case 'verify_mob':
            detail = this.$t('Account.SequentialVerification.ChangeDetail.Phone')
            break
        }
        return detail
      },
      wrongDetail () {
        let wrongDetail
        switch (this.page) {
          case 'verify_email':
            wrongDetail = this.$t('Account.SequentialVerification.ChangeDetail.ReturnFromWrongEmail')
            break
          case 'verify_mob':
            wrongDetail = this.$t('Account.SequentialVerification.ChangeDetail.ReturnFromWrongPhone')
            break
        }
        return wrongDetail
      },
      validationRules () {
        return store.getters['getValidationRules']
      }
    },
    methods: {
      goBack () {
        this.$emit('goBack')
      },
      isAnyUnpopulatedField () {
        switch (this.page) {
          case 'verify_email':
            if (!this.changeDetails.PrimaryEmail) {
              this.errorMessages.email = true
            }
            break
          case 'verify_mob':
            if (!this.changeDetails.MobilePhone) {
              this.errorMessages.phone = true
            }
            break
        }
      },
      isFilled () {
        if (this.isEverythingValid()) {
          return true
        }
        return false
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
      updateDetails () {
        if (this.isFilled()) {
          this.isProcessing = true
          this.transactionError = null
          this.dialog = true
          store.commit('setFormSubmitSppiner', true)
          lib.rpcService.callBroker('psregistrationservice', 'updatepersonaldetails', {
            'IDDCApplication': 'TEXAS',
            'personalDetails': this.changeDetails
          })
          .then((response) => {
            if (response && response.exceptionType && response.message) {
              this.transactionError = response.message
            } else {
              this.isProcessing = false
              store.commit('setFormSubmitSppiner', false)
              store.dispatch('getCustomerContext')
              this.$emit('updateCom')
              this.goBack()
            }
          })
          .catch((err) => {
            this.transactionError = err.message || this.$t('Server.ErrorMsg.Generic')
          })
          .finally(() => {
            this.isProcessing = false
            // this.goBack()
          })
        }
      }
    }
  }
</script>

<style scoped lang="stylus">
@import "~@/css/config"
@import "~@/css/mixins"
  .ctsform
    h2
      margin 0px 0 30px
    .form-actions
      .v-btn
        width: 350px
        padding: 0
        >>>.v-btn__content
          display: inline-block
          width: 100%;
          @media mobile
            white-space: normal
            line-height: 110%
            span
              padding-right: 5px
              padding-left: 5px
        @media mobile-big-and-below
          width: 100%
  .verify-content
    @media tablet-and-below
      padding: 15px 0
  .control-block input
    @media tablet-and-below
      margin-bottom: 10px
</style>
