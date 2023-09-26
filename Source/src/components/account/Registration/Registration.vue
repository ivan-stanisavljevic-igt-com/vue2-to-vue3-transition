  <template>
  <div class="account-page ctsform">
    <div class="closeBtnContainer">
      <v-icon  class="close" @click.stop="go2Home()">close</v-icon>
    </div>
    <template v-if="brandKey === 'qcasino' || brandKey === 'pr'">
      <div class="joinusTitle" v-if="mobileBigAndBelow" v-html="$t('MyAccount.JoinUs.Title')"></div>
      <div class="acc-header">
        <img :src="mediaServer('/static/brand-img/' + brandKey + '/account-create-white.svg')" :alt="brandKey">
        <h1>{{ $t('Account.Join.Heading') }}</h1>
      </div>
    </template>
    <template v-if="brandKey !== 'qcasino' && brandKey !== 'pr'">
      <h1 v-if=false>{{ $t('Account.Join.Heading') }}</h1>
    </template>
    <form id="registrationForm">
      <RegStepCounter v-if="currentStepState === 'entry'" :currentStep="currentStep" ref="RegStep" :currStepTitle="stepTitle" @jump2Step="jump2Step"></RegStepCounter>
      <div v-else class="joinusTitle">
        <p class="correction-title">{{ $t('Account.CreateAccount.Registration') }}</p>
        <p class="correction-subtitle">{{ $t('Account.CreateAccount.Correction') }}</p>
        <span class="mag_glass_correction"></span>
      </div>
      <!-- dynamic component: step 1, step 2, step 3 o r step 4 -->
      <div>
        <component :is="currentComponent" :currentStep="currentStep" :currentStepState="currentStepState" ref="regComp" :registrationDetails="registrationDetails" :regError="regError" @go2SomeStep="go2Step" @updateRegError="updateRegError()"></component>
      </div>
      <!-- <div v-else>
        <RegStep1 v-if="currentStep === 1" :currentStep="currentStep" :currentStepState="currentStepState" ref="regComp" :registrationDetails="registrationDetails" :regError="regError" @go2SomeStep="go2Step" @updateRegError="updateRegError()"></RegStep1>
        <RegStep2 v-if="currentStep === 2" :currentStep="currentStep" :currentStepState="currentStepState" ref="regComp" :registrationDetails="registrationDetails" :regError="regError" @go2SomeStep="go2Step" @updateRegError="updateRegError()"></RegStep2>
        <RegStep3 v-if="currentStep === 3" :currentStep="currentStep" :currentStepState="currentStepState" ref="regComp" :registrationDetails="registrationDetails" :regError="regError" @go2SomeStep="go2Step" @updateRegError="updateRegError()"></RegStep3>
        <RegStep4 v-if="currentStep === 4" :currentStep="currentStep" :currentStepState="currentStepState" ref="regComp" :registrationDetails="registrationDetails" :regError="regError" @go2SomeStep="go2Step" @updateRegError="updateRegError()"></RegStep4>
      </div> -->

      <!-- CREATE ACCOUNT -->
      <p class="next-text" v-if="(currentStepState === 'entry') && (currentStep === 1 || currentStep === 2 || currentStep === 3)">{{$t('Account.JoinUs.Next')}}</p>
      <div class="form-actions" :class="{'btnsHolder' : brandKey ==='circa'}">
        <v-btn color="success" x-large @click.stop="go2Step()" v-if="(currentStepState === 'entry') && (currentStep === 1 || currentStep === 2 || currentStep === 3)"><span v-html="stepSubtitle"></span></v-btn>
        <v-btn color="success" x-large @click.stop="register()" v-else>
          <span v-if="currentStepState === 'entry'">{{ $t('Account.CreateAccount.Reg4Step') }}</span>
          <span v-else>{{ $t('Account.CreateAccount.ReSubmit') }} </span>
        </v-btn>
      </div>
      <div v-if="brandKey === 'sb' && state === 'NJ'" class="rg-joinus">
        <span class="header-txt">{{ $t('JoinNow.InfoMessage.' + state) }}</span>
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
      @close="closeRegistrationDialog"
      ref="refProcessingDialog"
      v-if="showDialog">
      <template #title>
        <v-spacer class="spacer"></v-spacer>
        <div v-if="isProcessing">
          <span>{{ $t('Account.Join.Dialog.Processing.Title') }}</span>
        </div>
        <div v-else>
          <span v-if="!transactionError" id="dialog_success_title">{{ $t('Account.Join.Dialog.Success.Title') }}</span>
          <span v-else class="red--text" id="dialog_error_title">{{ $t('Account.Join.Dialog.Error.Title') }}</span>
        </div>
      </template>
      <div slot="text-error">
        <p v-if="brandKey !=='sb'" class="generic-icon-note"><v-icon color="error" class="mr-1">error</v-icon><span>{{ $t('Account.Join.Dialog.Error.Text') }}</span></p>
        <p class="response-error">{{ transactionError }}</p>
        <p v-if="brandKey !=='sb' || (brandKey === 'sb' && !duplicateEmail)" v-html="$t('Account.Join.Dialog.Error.Text.ContactSupport')"></p>
        <p v-if="brandKey ==='sb' && duplicateEmail" v-html="$t('Account.Join.Dialog.Error.Text.DuplicateEmail.ContactSupport')"></p>
      </div>
      <template #actions>
        <v-spacer class="spacer"></v-spacer>
        <v-btn flat @click="closeProcessingDialog" :disabled="isProcessing" class="closeButtonProcessingDialog"><span id="qa-closeBtnText">{{ $t('ProcessingDialog.CloseButtonText') }}</span></v-btn>
      </template>
    </ProcessingDialog>
  </div>
</template>

<script>
  import store from '@/store'
  import config from '@/config'
  import moment from 'moment'
  import ProcessingDialog from '@/components/common/ProcessingDialog'
  import adjust from '@/library/adjust'
  import Url from '@/components/mixins/Url'
  import Branding from '@/components/mixins/Branding'
  import Screen from '@/components/mixins/Screen'
  import { mapGetters } from 'vuex'
  /* import RegStep1 from '@/components/account/Registration/RegStep1'
  import RegStep2 from '@/components/account/Registration/RegStep2'
  import RegStep3 from '@/components/account/Registration/RegStep3'
  import RegStep4 from '@/components/account/Registration/RegStep4' */
  import RegStepCounter from '@/components/account/Registration/RegStepCounter'

  export default {
    name: 'Registration',
    components: {
      ProcessingDialog,
      /* RegStep1,
      RegStep2,
      RegStep3,
      RegStep4, */
      RegStepCounter
    },

    mixins: [
      Url,
      Branding,
      Screen
    ],
    data: () => ({
      componentToDisplay: null,
      dialog: false,
      isProcessing: false,
      transactionError: null,
      transactionErrorCode: null,
      duplicateEmail: null,
      regError: undefined,
      showDialog: true
    }),
    computed: {
      currentComponent () {
        if (this.componentToDisplay) {
          return () => import(`@/components/account/Registration/${this.componentToDisplay}.vue`)
        }
        return null
      },
      stepTitle () {
        return this.$t('Account.JoinUs.CurrentStepTitle.Step' + this.currentStep)
      },
      stepSubtitle () {
        return this.$t('Account.JoinUs.NextStepTitle.Step' + this.currentStep)
      },
      isLoggedIn () {
        return store.getters['isLoggedIn']
      },
      isOpenedFromWebView () {
        return store.getters['getIsOpenedFromWebView']
      },
      regComponent () {
        return this.componentName // && this.importComponent(this.componentName)
      },
      ...mapGetters('registration', {
        registrationDetails: 'getRegistrationFields',
        currentStep: 'getCurrentStep',
        currentStepState: 'getCurrentStepState',
        componentName: 'getComponentName',
        componentEntryState: 'getComponentEntryState',
        componentSubmitState: 'getComponentSubmitState',
        maxStep: 'getMaxStep'
      }),
      autoLogin () {
        return config.app.autoconf.AUTO_LOGIN_AFTER_REGISTRATION
      },
      state () {
        return config.app.autoconf.STATE
      }
    },
    methods: {
      go2Home () {
        this.$router.push({name: 'sports', params: { }})
      },
      scroll2Top () {
        window.scrollTo(0, 0)
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
      getAffiliateCode () {
        let ret = null
        if (config.app.autoconf.INCOME_ACCESS_ENABLED) {
          ret = config.customCookies.getCookie('IA').btag || null
        }
        return ret
      },
      register () {
        if (this.$refs.regComp.isFilled()) {
          this.isProcessing = true
          this.transactionError = null
          this.transactionErrorCode = null
          this.regError = null
          this.duplicateEmail = null
          this.dialog = true
          store.dispatch('userServiceRegisterCustomer', {
            'userName': this.registrationDetails.userName,
            'title': this.title,
            'gender': this.registrationDetails.gender,
            'firstName': this.registrationDetails.firstName,
            'lastName': this.registrationDetails.lastName,
            'dateOfBirth': moment(this.registrationDetails.dateOfBirth).format(config.app.dateFormats.iso8601),
            'email': this.registrationDetails.email,
            'phone': this.registrationDetails.phone.replace(/\D+/g, ''),
            'password': this.registrationDetails.pass,
            'IDDCSecurityQuestion': this.registrationDetails.IDDCSecurityQuestion1,
            'securityQuestion': this.registrationDetails.securityQuestion1,
            'securityAnswer': this.registrationDetails.securityAnswer1,
            'IDDCSecurityQuestion2': this.registrationDetails.IDDCSecurityQuestion2,
            'securityQuestion2': this.registrationDetails.securityQuestion2,
            'securityAnswer2': this.registrationDetails.securityAnswer2,
            'address': this.registrationDetails.address,
            'postCode': this.registrationDetails.zipCode.toString(),
            'city': this.registrationDetails.city,
            'state': this.registrationDetails.state,
            'ssn': this.registrationDetails.ssn.toString(),
            'tc': this.registrationDetails.tc,
            'attestations': this.getUserAttestationsIds(this.registrationDetails.attestations),
            'affiliateCode': this.getAffiliateCode(),
            'promoCode': this.registrationDetails.promo
          })
            .then((response) => {
              if (response && response.exceptionType && response.message) {
                this.duplicateEmail = response.exceptionType === 'EmailAlreadyExistsException'
                this.transactionError = response.message
                this.transactionErrorCode = response.exceptionType
              } else {
                if (window.ctsautoconf.MOBILE_LS) adjust.adjustEventRequest('registration')
                this.isProcessing = false
                if (this.autoLogin) {
                  this.showDialog = false
                  this.closeRegistrationDialog()
                }
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
              this.transactionErrorCode = err.exceptionType
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
      getUserAttestationsIds (attestations) {
        let atts = []
        attestations.forEach(att => {
          atts.push(att.idmmattestation)
        })
        return atts
      },
      closeRegistrationDialog () {
        if (!this.transactionError) {
          if (this.autoLogin) {
            // no strong auth
            localStorage.autologinAfterRegistration = true
            store.dispatch('login2FA', {
              'username': this.registrationDetails.userName,
              'password': this.registrationDetails.pass,
              'firstTimeLogin': true
            })
          } else {
            this.go2Home()
          }
        } else {
          switch (this.transactionErrorCode) {
            case '20207': // Username already taken (X_UserNameTaken_Code)
              this.regError = 'usernametaken'
              this.go2Step(1, this.componentSubmitState)
              break
            case 'EmailAlreadyExistsException': // E-mail address already exists in the system (x_duplicatecustomeremail_code )
              this.regError = 'duplicateemail'
              this.go2Step(1, this.componentSubmitState)
              break
            case '20216': // x_underagecustomer_code
              this.regError = 'underagecustomer'
              this.go2Step(2, this.componentSubmitState)
              break
            case 'InvalidParametersException': // x_duplicatecustomerdata_code
              this.regError = 'duplicatecustomerdata'
              this.go2Step(2, this.componentSubmitState)
              break
            case 'PhoneAlreadyExistsException': // mobile phone (x_duplicatephone_code)
              this.regError = 'duplicatephone'
              this.go2Step(3, this.componentSubmitState)
              break
            case '20900':
              this.regError = 'PromoCodeIsInvalid'
              this.go2Step(1, this.componentSubmitState)
              break
            case '20901':
              this.regError = 'PromoCodeIsNotValidAnymore'
              this.go2Step(1, this.componentSubmitState)
              break
          }
          setTimeout(() => {
            this.scroll2Error()
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
      importComponent (cName) {
        console.log('cname ' + cName)
        return () => import(`@/components/account/Registration/${cName}.vue`)
      },
      go2Step (step, state) {
        if (this.$refs.regComp.isFilled()) {
          // set current step
          store.commit('registration/setCurrentStep', step || this.currentStep + 1)
          // set current component state
          store.commit('registration/setCurrentStepState', state || this.componentEntryState)
          // set current component and dynamic import (based on current step)
          this.componentToDisplay = this.componentName
          this.regStepCheck(this.currentStep)
          this.scroll2Top()
        } else {
          setTimeout(() => {
            this.scroll2Error()
          }, 500)
        }
      },
      jump2Step (step, state) {
        // set current step
        store.commit('registration/setCurrentStep', step || this.currentStep)
        // set current component state
        store.commit('registration/setCurrentStepState', state || this.componentEntryState)
        // set current component and dynamic import (based on current step)
        this.componentToDisplay = this.componentName
        this.scroll2Top()
      },
      regStepCheck (currentStep) {
        this.$refs.RegStep.stepCounterState(currentStep)
      },
      updateRegError (value) {
        this.regError = value
      },
      closeProcessingDialog () {
        this.$refs.refProcessingDialog.dialogClose()
      }
    },
    mounted () {
      store.dispatch('fetchLegalAge4Registration')
      // initRegistrationPage will create initial registration object for the first time
      store.dispatch('registration/initRegistrationPage')
      this.componentToDisplay = this.componentName
    },
    created () {
      // this.fetchAttestations()
      // this.getPrivacyPolicyContent()
      // this.getHouseRulesContent()
      this.GTMregistrationStart()
    },
    watch: {
    }
  }
</script>

<style lang="stylus" scoped>
  @import "~@/css/config"
  h1
    text-align center
  .vmsg.invalid
    cursor default
  .next-text
    margin-bottom: 0
    margin-top: 10px
    text-align: center
  .form-actions
    button
      width: 350px
      margin: 10px 0px
      >>>.v-btn__content
        display: inline-block
        width: 100%;
      @media mobile-big-and-below
        width: 100%
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
  >>>.control-label-required
    color #ff9016

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

  .joinusTitle
    display: flex
    justify-content: center
    align-items: center
    flex-direction: column
    font-size: 20px
    font-family: "Open Sans Bold" 
    margin-bottom: 3rem

  .correction-title
    font-weight: 600
    color: #ff9016
    // text-transform: uppercase
    font-size: 17px
    margin-bottom: 2px
    margin-top: 15px
  .correction-subtitle
    font-size: 20px
    font-family: "Open Sans Bold" 
  .spacer
    flex-grow: 0.5 !important
  .closeButtonProcessingDialog
    background: #003764
    color: #fff
    padding: 0 50px
    border-radius: 5px
    font-family: "Open Sans Bold"
  .mag_glass_correction
    color: #003764
    display: inline-block
    // background-image: url(icons-path'/'reg_ver_correction'.svg')
    height: 40px !important
    width: 40px !important
  .closeBtnContainer
    display: flex
    flex-direction: row-reverse
    .close
      font-size: 40px
</style>
