<template>
  <div>
    <div class="sec-wrapper">
      <h1>{{$t('Account.SelfExclusion')}}</h1>
      <div class="step-one" v-if="stepOne">
        <h2>{{$t('Account.Exclusions.SE.StepOne.Header')}}</h2>
        <div class="content" v-for="(item, index) in waiverAndRelease" :key="index">
          <span class="checkbx"><v-checkbox v-model="item.agreed" @change="stepOneAgree()"></v-checkbox></span>
          <span class="release-text" v-html="item.text"></span>          
        </div>
        <div class="sec-btns">
          <v-btn color="success" :disabled="!stepTwoAgreed" @click="stepOneConfirm()">{{$t('Account.Agree')}}</v-btn>
        </div>
      </div>
      <div class="step-two" v-if="stepTwo">
        <h2>{{$t('Account.Exclusions.SE.StepTwo.Header')}}</h2>
        <div class="content" v-for="(item, index) in acknowledgment" :key="index">
          <span class="checkbx"><v-checkbox v-model="item.agreed" @change="stepTwoAgree()">></v-checkbox></span>
          <span class="release-text" v-html="item.text"></span>          
        </div>
        <div class="sec-btns">
          <v-btn color="success" :disabled="!stepThreeAgreed" @click="stepTwoConfirm()">{{$t('Account.Agree')}}</v-btn>
        </div>
      </div>
      <div class="step-three" v-if="stepThree">
        <h2>{{$t('Account.Exclusions.SE.StepThree.Header')}}</h2>
        <div class="step-four-desc">{{$t('Account.Exclusions.SE.StepThree.Desc')}}</div>
        <div class="duration-selection">
          <v-radio-group v-model="selfExclusionDuration">
            <v-radio :label="$t('Account.Exclusions.SE.StepThree.OneYear')" :value=1></v-radio>
            <v-radio :label="$t('Account.Exclusions.SE.StepThree.FiveYears')" :value=5></v-radio>
          </v-radio-group>
        </div>
        <div class="step-four-desc">{{$t('Account.Exclusions.SE.StepThree.DescTwo')}}</div>
        <div class="accpage">
          <div class="account-page ctsform">

            <!-- SSN -->
            <div class="control-block" :class="{ 'filled': ssn }">
              <input type="text" inputmode="numeric" v-model="ssn" autocomplete="off" :maxlength="4" @change="handleSSN"/>
              <label class="control-label">{{ $t('Account.Join.Last4SSN') }}</label>
            </div>
            <div>
              <div class="vmsg invalid" v-if="ssnError" id="err_msg_ssn_not_digit">{{$t('Account.Join.ErrorMsg.Last4SSNNonDigit')}}</div>
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
                <v-date-picker ref="picker" :max="maxDate" @change="checkDateOfBirth()" v-model="dateOfBirth" no-title scrollable></v-date-picker>
              </v-menu>
            </div>

          </div>
        </div>
        <div class="sec-btns">
          <v-btn color="success" :disabled="!isSEAllowed" @click="selfExclude()">{{$t('MyAccount.Submit')}}</v-btn>
        </div>
      </div>
    </div>
    <ProcessingDialog
      v-model="dialog"
      :isDialogPersistent="true"
      :isProcessing="isProcessing"
      :isSuccess="!transactionError"
      :processingTitle="$t('Account.PersonalDetails.Dialog.Processing.Title')"
      :processingText="$t('Account.PersonalDetails.Dialog.Processing.Text')"
      :successTitle="$t('Account.CloseAccount.Dialog.Success.Title')"
      :successText="$t('ProcessingDialog.Success.Text')"
      :errorTitle="$t('ProcessingDialog.Error.Title')"
      :closeBtnText="$t('ProcessingDialog.CloseButtonText')"
    >
      <div slot="text-error">
        <p class="generic-icon-note"><v-icon color="error" class="mr-1">error</v-icon><span>{{ transactionError }}</span></p>
      </div>
    </ProcessingDialog>
  </div>
</template>
<script>
import Url from '@/components/mixins/Url'
import moment from 'moment'
import lib from '@/library'
import router from '@/router'
import ProcessingDialog from '@/components/common/ProcessingDialog'
import Branding from '@/components/mixins/Branding'
import store from '@/store'

export default {
  mixins: [ Url, Branding ],
  components: {
    ProcessingDialog
  },
  data: () => ({
    stepOne: window.ctsautoconf.STATE === 'NJ',
    stepTwo: window.ctsautoconf.STATE !== 'NJ',
    stepThree: false,
    stepOneAgreed: false,
    stepTwoAgreed: false,
    stepThreeAgreed: false,
    selfExclusionDuration: null,
    ssnField: null,
    ssnError: false,
    dateOfBirth: null,
    datePickerMenu: false,
    dateOfBirthError: false,
    dialog: false,
    isProcessing: false,
    transactionError: null
  }),
  computed: {
    waiverAndRelease () {
      return store.getters['exclusions/waiverAndRelease']
    },
    acknowledgment () {
      return store.getters['exclusions/acknowledgment']
    },
    ssn: {
      get () {
        return this.ssnField
      },
      set (value) {
        if (/^[0-9]*$/.test(Number(value))) {
          this.ssnError = false
        } else {
          this.ssnError = true
        }
        this.ssnField = value
      }
    },
    ssnIsValid () {
      return this.ssn && this.ssn.toString() && this.ssn.toString().length === 4 && !this.ssnError
    },
    dobIsValid () {
      return this.dateOfBirth && !this.dateOfBirthError
    },
    isSEAllowed () {
      return this.ssnIsValid && this.selfExclusionDuration && this.dobIsValid
    },
    formattedDate () {
      return this.dateOfBirth ? moment(this.dateOfBirth).format('MM/DD/YYYY') : undefined // Custom format
    },
    maxDate () {
      let result = new Date().toISOString().substr(0, 10)

      if (this.brandKey === 'sb') {
        let currentYear = new Date().getFullYear()
        result = (currentYear - 20).toString()
      }

      return result
    },
    usState () {
      return window.ctsautoconf.STATE
    },
    numberOfSteps: () => store.getters['exclusions/numberOfSteps']
  },
  methods: {
    handleSSN (value) {
      if (/^[0-9]*$/.test(Number(value))) {
        this.ssn = value
      }
    },
    resetData2Init () {
      this.stepOne = window.ctsautoconf.STATE === 'NJ'
      this.stepTwo = window.ctsautoconf.STATE !== 'NJ'
      this.stepThree = false
      this.stepOneAgreed = false
      this.stepTwoAgreed = false
      this.stepThreeAgreed = false
      this.selfExclusionDuration = null
      this.ssnField = null
      this.ssnError = false
      this.dateOfBirth = null
      this.datePickerMenu = false
      this.dateOfBirthError = false
      this.dialog = false
      this.isProcessing = false
      this.transactionError = null
    },
    stepOneConfirm () {
      this.stepOne = false
      this.stepTwo = true
    },
    stepTwoConfirm () {
      this.stepTwo = false
      this.stepThree = true
    },
    stepThreeConfirm () {
      this.stepThree = false
    },
    stepOneAgree () {
      this.stepTwoAgreed = Object.values(this.waiverAndRelease).every(e => !!e.agreed)
    },
    stepTwoAgree () {
      this.stepThreeAgreed = Object.values(this.acknowledgment).every(e => !!e.agreed)
    },
    async selfExclude () {
      try {
        this.isProcessing = true
        this.transactionError = null
        this.dialog = true
        const response = await lib.rpcService.callBroker('iw', 'longtermsuspend', {
          'state': this.usState,
          'duration': this.selfExclusionDuration,
          'dob': this.dateOfBirth,
          'ssn4': this.ssn
        })
        if (response) {
          router.push({name: 'logout'})
        }
      } catch (ex) {
        console.log(ex)
        this.transactionError = (ex && ex.error && ex.error.Message) || (ex && ex.message)
      } finally {
        this.isProcessing = false
      }
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
    checkDateOfBirth () {
      this.$refs.datePickerMenu.save(this.dateOfBirth)
      if (!this.dateOfBirth) {
        this.dateOfBirthError = true
      } else {
        this.dateOfBirthError = false
      }
    }
  },
  mounted () {
  },
  destroyed () {
    this.resetData2Init()
  },
  watch: {
    datePickerMenu (val) {
      val && setTimeout(() => (this.$refs.picker.activePicker = 'YEAR'))
    },
    stepThree (val) {
      // on active step 3 (the last one), batch the event
      if (val) {
        store.dispatch('userEvents/batchEvent', {
          accesstype: 'SFEX',
          timestamp: Date.now(),
          payload: null
        })
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
  @import "~@/css/config"
  .sec-wrapper
    cursor default
    @media mobile-big-and-below
      padding 10px
      background white
    h1
      text-align left
    h2
      text-align left
      font-size 16px
    .sec-btns    
      text-align center
      margin-top 10px
    .step-one,
    .step-two
      .content
        display block
        background white
        .checkbx
          display inline-block
          >>> .v-input
            margin 0
            padding 0
            height 0
            position relative
            top 8px
            width 25px
            height 25px
        .release-text
          display inline
          text-align justify
    .step-three
      .accpage
        padding 10px 0
</style>
