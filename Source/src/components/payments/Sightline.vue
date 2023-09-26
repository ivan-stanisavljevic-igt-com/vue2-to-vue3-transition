<template>
  <div class="payment__instrument transaction-container">
    <div v-if="!showSightlineImg" class="label">{{ $t('Transaction.Sightline') }}</div>
    <img v-if="showSightlineImg" class="PlayPlusImg" :src="mediaServer('/static/brand-img/' + brandKey + '/sightline.png')" alt="Sightline"/>
    <!-- for sightline enrollment we show modal dialog so don't show the note here -->
    <div v-if="isProcessing && !isProcessingEnrollment" class="processing-wrapper">
      <span class="pw">
        <v-progress-circular indeterminate class="redirecting-circular-progress"></v-progress-circular>
        {{ processingMessage }}
      </span>
    </div>
    <div v-else>
      <div>
        <div v-if="sightlineNote" class="note" v-html="sightlineNote"></div>

        <div v-if="isInstructionVerified" class="content">
          <v-btn v-if="depositType" class="transaction deposit-sightline" color="success" @click="depositSightline" :disabled="!customerCanDeposit">{{ $t('Transaction.Deposit') }}</v-btn>
          <v-btn v-if="withdrawType" class="transaction withdrawal-sightline" color="success" @click="withdrawalSightline" :disabled="!customerCanWithdraw">{{ $t('Transaction.Withdrawal') }}</v-btn>
          <v-btn class="transaction funding-sightline" color="success" @click="fundingSightline" :disabled="!userIsVerifed">{{ $t('Transaction.Funding') }}</v-btn>
        </div>
        <div v-else>
          <div class="content">
            <v-btn class="transaction" color="success" @click="startEnrollFlow" :disabled="isProcessing || !userIsVerifed">{{ $t('Transaction.Enroll') }}</v-btn>
          </div>
        </div>
      </div>
    </div>
      <!-- invisible form for enrollment process -->
      <v-form id="spanexpress" name="LaunchSpanExpress" :action="postUrl" method="post">
        {{postUrl}}
        <input name="MerchantID" id="MerchantID" :value="merchantID" />
        <textarea name="IdentityToken" id="IdentityToken">{{ identityToken }}</textarea>
        <input name="MemberNumber" id="MemberNumber" :value="memberNumber" />
        <input name="FirstName" id="FirstName" :value="firstName" />
        <input name="LastName" id="LastName" :value="lastName" />
        <input name="PhoneNumber" id="PhoneNumber" :value="phoneNumber" />
        <input name="Email" id="Email" :value="eMail" />
        <input name="Address" id="Address" :value="address" />
        <input name="City" id="City" :value="city" />
        <input name="State" id="State" :value="state" />
        <input name="Country" id="Country" :value="country" />
        <input name="PostalCode" id="PostalCode" :value="postalCode" />
        <input name="MerchantApplication" id="MerchantApplication" :value="merchantApplication" />
        <input name="MerchantTransactionID" id="MerchantTransactionID" :value="merchantTransactionID" />
        <input name="ReturnUrl" id="ReturnUrl" :value="returnURL"/>
        <input name="MerchantName" id="MerchantName" :value="merchantName" />
        <input type="submit"/>
      </v-form>

    <div v-if="brandKey ==='circa' && isSightlineAvailable">{{ $t('Transaction.Circa.PlayPlus.Note') }}</div>
    
    <div class="go-back" @click="goToHomepage()">
      <v-icon>navigate_before</v-icon>
      <span>{{ back }}</span>
    </div>

    <!-- modal dialog to show 'please wait' while user is redirected to sightline -->
    <ProcessingDialog
      v-model="processingEnrollmentDialog"
      :isDialogPersistent="true"
      :isProcessing="isProcessingEnrollment"

      :isTitleVisible="!!processingEnrollmentDialogError"
      :isSuccess="!processingEnrollmentDialogError"
      :errorText="processingEnrollmentDialogError"
      :processingText="$t('Transaction.Sightline.Enroll.Redirection.Dialog.Text')"
    >
      <div slot="text-error">
        <p>{{ processingEnrollmentDialogError }}</p>
        <p v-if="brandKey ==='sb'" v-html="customerServiceMessage"></p>
      </div>
    </ProcessingDialog>
  </div>
</template>
<script>
import { mapState, mapGetters } from 'vuex'
import config from '@/config'
import CircularRotate from '@/components/common/CircularRotate'
import Screen from '@/components/mixins/Screen'
import Forms from '@/components/mixins/Forms'
import ProcessingDialog from '@/components/common/ProcessingDialog'
import mobileBridge from '@/library/mobileBridge'
import Url from '@/components/mixins/Url'
import Branding from '@/components/mixins/Branding'
import lib from '@/library'
import store from '@/store'
export default {
  components: {
    CircularRotate,
    ProcessingDialog
  },

  mixins: [Screen, Forms, Url, Branding],

  data () {
    return {
      processingEnrollmentDialog: false,
      processingEnrollmentDialogError: null,
      customerServiceMessage: null,
      isInitialized: false,
      isRedirectedFromSightline: false,
      IDMMSITXRequest: null,  // will be set only when redirected from Sightline with the value from query parameter

      // enroll form data to be sent
      redirectionData: undefined,
      postUrl: undefined,
      merchantID: undefined,
      identityToken: undefined,
      memberNumber: undefined,
      firstName: undefined,
      lastName: undefined,
      phoneNumber: undefined,
      eMail: undefined,
      address: undefined,
      city: undefined,
      state: undefined,
      country: undefined,
      postalCode: undefined,
      merchantApplication: undefined,
      merchantTransactionID: undefined,
      returnURL: undefined,
      merchantName: undefined
    }
  },

  computed: {
    isLoggedIn () {
      return store.getters['isLoggedIn']
    },
    ...mapState('sightline', {
      isProcessingInstructionFetch: 'isProcessingInstructionFetch',
      isProcessingEnrollment: 'isProcessingEnrollment',
      isFinalizingEnrollment: 'isFinalizingEnrollment'
    }),
    ...mapGetters('sightline', {
      isInstructionVerified: 'isInstructionVerified'
    }),

    isProcessing () {
      return this.isProcessingInstructionFetch || this.isProcessingEnrollment || this.isFinalizingEnrollment
    },

    processingMessage () {
      if (this.isProcessingInstructionFetch) {
        return this.$t('Transaction.Sightline.Enroll.Note1') // 'Verifying your Sightline instruction for transactions, please wait...'
      }
      if (this.isProcessingEnrollment) {
        return this.$t('Transaction.Sightline.Enroll.Note2') // 'Starting enrollment... You should be redirected to Sightline website now...'
      }
      if (this.isFinalizingEnrollment) {
        return this.$t('Transaction.Sightline.Enroll.Note3') // 'Checking enrollment status, please wait...'
      }
      return this.$t('Transaction.PleaseWait') // 'Please wait...'
    },

    sightlineNote () {
      if (this.isInstructionVerified) {
        return this.$t('Transaction.Sightline.Enroll.Note4') // 'Your transaction instruction has been verified successfully and following operations are available:'
      } else {
        return this.$t('Transaction.Sightline.Enroll.Note5') // 'Your transaction instruction has not been verified. Please enroll in order to enable transaction operations with Sightline.'
      }
    },
    mobilelocalServer () {
      return window.ctsautoconf.MOBILE_LS || false
    },
    sightlineParams () {
      return this.$store.getters['getSightlineParams']
    },
    mediaContentHostname () {
      return window.ctsautoconf.MEDIA_CONTENT_HOSTNAME
    },
    staticAbsolutePath () {
      if (this.mediaContentHostname) {
        var path = (this.mediaContentHostname.indexOf('http://') > -1 || this.mediaContentHostname.indexOf('https://') > -1) ? this.mediaContentHostname : '//' + this.mediaContentHostname
        return path
      }
      return window.location.origin
    },
    showSightlineImg () {
      return config.app.SIGHTLINE_IMG
    },
    back () {
      if (this.sightlineOnlyDeposit && this.depositType) return this.$t('Header.navigationBack')
      if (this.sightlineOnlyWithdrawal && this.withdrawType) return this.$t('Header.navigationBack')
      return this.$t('Transaction.GoBack')
    },
    sightlineOnlyDeposit: () => store.getters['payments/sightlineOnlyDeposit'],
    sightlineOnlyWithdrawal: () => store.getters['payments/sightlineOnlyWithdrawal'],
    transactionType: () => store.getters['payments/transactionType'],
    depositType () {
      return this.transactionType && this.transactionType === 'deposit'
    },
    withdrawType () {
      return this.transactionType && this.transactionType === 'withdrawal'
    },
    customerContext: () => store.getters['getCustomerContext'],
    userIsVerifed: () => store.getters['getIsCustomerVerified'],
    customerCanDeposit () {
      return this.customerContext && this.customerContext.ActionDeposit
    },
    customerCanWithdraw () {
      return this.customerContext && this.customerContext.ActionWithdraw
    },
    customerCanDepositAndWithdraw () {
      return this.customerCanDeposit && this.customerCanWithdraw
    }
  },

  methods: {
    depositSightline () {
      this.$router.push({name: 'deposit-sightline'})
    },
    withdrawalSightline () {
      this.$router.push({name: 'withdrawal-sightline'})
    },
    fundingSightline () {
      this.$router.push({name: 'funding-sightline'})
    },
    startEnrollFlow () {
      this.processingEnrollmentDialogError = null
      this.customerServiceMessage = null
      this.processingEnrollmentDialog = true

      this.$store.dispatch('sightline/startEnrollmentFlow')
        .then(redirectionData => {
          // console.log('redirection parameters:', redirectionData.result.Parameters)

          if (redirectionData && redirectionData.result && redirectionData.result.Parameters && redirectionData.result.Url) {
            this.postUrl = redirectionData.result.Url
            let params = redirectionData.result.Parameters

            this.merchantID = params.find(p => p.Name === 'MerchantID').Value
            this.identityToken = params.find(p => p.Name === 'IdentityToken').Value
            this.memberNumber = params.find(p => p.Name === 'MemberNumber').Value
            this.firstName = params.find(p => p.Name === 'FirstName').Value
            this.lastName = params.find(p => p.Name === 'LastName').Value
            this.phoneNumber = params.find(p => p.Name === 'PhoneNumber').Value
            this.eMail = params.find(p => p.Name === 'Email').Value
            this.address = params.find(p => p.Name === 'Address').Value
            this.city = params.find(p => p.Name === 'City').Value
            this.state = params.find(p => p.Name === 'State').Value
            this.country = params.find(p => p.Name === 'Country').Value
            this.postalCode = params.find(p => p.Name === 'PostalCode').Value
            this.merchantApplication = params.find(p => p.Name === 'MerchantApplication').Value
            this.merchantTransactionID = params.find(p => p.Name === 'MerchantTransactionID').Value
            this.returnURL = params.find(p => p.Name === 'ReturnURL').Value
            this.merchantName = params.find(p => p.Name === 'MerchantName').Value

            setTimeout(() => {
              if (window.ctsautoconf.MOBILE_LS) {
                var form = document.querySelector('#spanexpress')
                var serializeformData = this.formSerializer(form)
                let queryString = window.location.origin + lib.core.url.proccessingPage + '?postUrl=' + this.postUrl + '&' + serializeformData
                mobileBridge.bridgeSendRequest('returnCashierURL', this.returnURL)
                mobileBridge.bridgeSendRequest('openIgtPay', queryString)
                lib.rpcService.api.helpers.stopTokenTImer()
                this.processingEnrollmentDialog = false
                this.$router.push({path: '/'})
                return false
              }
              document.getElementById('spanexpress').submit()
            }, 0)
          }
        })
        .catch(err => {
          console.log(err)
          this.customerServiceMessage = err.exceptionType === 'AccountNotVerified' && this.$t('Transaction.Dialog.Error.ContactSupport')
          this.processingEnrollmentDialogError = err.exceptionType === 'AccountNotVerified' ? err.message : this.$t('Transaction.Sightline.Enroll.Error')
        })
    },

    checkIfRedirectedFromSightline () {
      let url = window.location.href
      let IDMMSITXRequestExist = (this.mobilelocalServer) ? Object.keys(this.sightlineParams).includes('IDMMSITXRequest') : url.includes('?IDMMSITXRequest=')
      if (IDMMSITXRequestExist) {
        this.isRedirectedFromSightline = true
        this.IDMMSITXRequest = (this.mobilelocalServer) ? Number(this.sightlineParams.IDMMSITXRequest) : this.getIDMMSITXRequest(url)

        // remove query params from url once we get it
        // this way if page is refreshed we prevent processing as if it was redirected back from external page
        if (!this.sightlineParams && !this.mobilelocalServer) {
          this.$router.replace({'query': null})
          return false
        }
        this.$store.commit('setSightlineParams', false)
        console.log('sightlineParams', this.sightlineParams)
      }
    },

    completeEnrollment () {
      if (!this.isInstructionVerified && this.isRedirectedFromSightline) {
        store.dispatch('sightline/completeEnrollmentFlow', { IDMMSITXRequest: this.IDMMSITXRequest })
      }
    },

    getIDMMSITXRequest (param) {
      let queryParams = param.split('?')[1]
      let arrOfParams = new URLSearchParams(queryParams)
      let result = arrOfParams.get('IDMMSITXRequest')
      return Number(result)
    },
    goToHomepage () {
      if (this.sightlineOnlyDeposit && this.depositType) return this.$router.push({ path: '/home' })
      if (this.sightlineOnlyWithdrawal && this.withdrawType) return this.$router.push({ path: '/home' })
      else this.$router.push({name: 'wallet-page'})
    }
  },

  async mounted () {
    await store.dispatch('sightline/fetchInstruction')
    this.checkIfRedirectedFromSightline()
    this.completeEnrollment()
  }
}
</script>

<style lang="stylus" scoped>
@import "~@/css/config";
@import "~@/css/mixins";
@import "~@/css/sportIcons";

.transaction-container
  margin-top 0
  border-radius 2px
  background-color white
  padding: 10px
  @media mobile-big-and-below
    margin-top 8px
  p
    text-align center
  .label
    color #21335a
    font-size 15px
    text-transform uppercase
    text-align center
    padding-bottom 5px
    font-family 'Open Sans SemiBold'
  .content
    display flex
    justify-content center
    background white
    .transaction
      flex 1
      height 60px
      margin 5px
      max-width 200px
      font-size 15px

.note
  color #21335a
  margin 4px auto

#spanexpress
  display none

.go-back
  display: flex
  justify-content: center
  align-items: center
  cursor: pointer
  margin-top: 10px

</style>
