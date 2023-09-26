<template>
  <div class>
    <div v-if="isProcessing && !isProcessingEnrollment" class="processing-wrapper">
      <span class="pw">
        <v-progress-circular indeterminate class="redirecting-circular-progress"></v-progress-circular>
        {{ processingMessage }}
      </span>
    </div>
    <div v-else>
      <div>
        <!-- instruction is verified -> display deposit and withdrawal buttons -->
        <div v-if="isInstructionVerified" class="content">
          <div class="sl-sb-info">{{ $t('Transaction.Sightline.SB.Info') }}</div>
          <div class="play-plus">
            <img v-if="showSightlineImg" class="PlayPlusImg" :src="mediaServer('/static/brand-img/' + brandKey + '/play-plus.png')" alt="Sightline"/>
            <div class="cta pp">
              <SightlineFunding/>
              <div class="pp cnt">
                <v-btn class="transaction access-account" color="success" @click="go2PlayPlus()">{{ $t('Transaction.AccessPlayPlus.SB') }}</v-btn>
              </div>
            </div>
          </div>
          <div class="sportsbook">
            <img v-if="showSightlineImg" class="PlayPlusImg" :src="mediaServer('/static/brand-img/' + brandKey + '/sb-new.png')" alt="Sightline"/>
            <div class="balance">{{ $t('Transaction.Sightline.SB.Balance') }}{{ balanceSum | currency}}</div>
            <div class="sbsl-transaction sl add-funds">
              <v-flex class="main-column" ref="maincolumn" >
                <v-form
                  ref="form"
                  id="form"
                  v-model="valid"
                  lazy-validation
                  @submit.prevent="submit"
                >
                  <!-- <p>{{ $t('Transaction.Sightline.Deposit.Description') }}</p> -->
                  <div v-if="!isProcessingInstructionFetch && isInstructionVerified">
                    <v-text-field
                      inputmode="decimal"
                      v-model="formData.amount"
                      :label="$t('Transaction.Amount')"
                      :prefix="currencySymbol"
                      required
                      :disabled="isProcessingTransaction"
                      :rules="[formRules.amount.required, formRules.amount.max2Decimals]"
                      class="my-3 input-amount"
                    >
                    </v-text-field>
                    <!-- <v-btn :disabled="isProcessingTransaction || !valid" color="success"  @click="submit">{{ $t('Transaction.AddFunds') }}</v-btn>
                    <v-btn :disabled="isProcessingTransaction" color="error" @click="reset">{{ $t('Transaction.ResetForm') }}</v-btn> -->
                  </div>
                  <div v-if="!isProcessingInstructionFetch && !isInstructionVerified">
                    <p><v-icon color="blue" class="mr-1" size="16">info</v-icon>{{ $t('Transaction.Sightline.EnrollmentNotCompletedNote') }}</p>
                  </div>
                </v-form>
              </v-flex>
            </div>
            <div class="cta">
              <v-btn v-if="depositType" class="transaction deposit-sightline" color="success" @click="startTransaction('deposit')" :disabled="!customerCanDeposit">{{ $t('Transaction.Deposit.SB') }}</v-btn>
              <v-btn v-if="withdrawType" class="transaction withdrawal-sightline" color="success" @click="startTransaction('withdrawal')" :disabled="!customerCanWithdraw">{{ $t('Transaction.Withdrawal.SB') }}</v-btn>
            </div>
          </div>
        </div>
        <!-- instruction is verified -> enroll -->
        <div v-else>
          <img v-if="showSightlineImg" class="PlayPlusImg" :src="mediaServer('/static/brand-img/' + brandKey + '/sightline.png')" alt="Sightline"/>
          <div v-if="sightlineNote" class="note" v-html="sightlineNote"></div>
          <div class="content enrollment">
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

    <div class="go-back" @click="goToHomepage()">
      <v-icon>navigate_before</v-icon>
      <span>{{ back }}</span>
    </div>

    <!-- Enrollment -->
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
        <p v-if="brandKey ==='sb' && customerServiceMessage" v-html="customerServiceMessage"></p>
      </div>
    </ProcessingDialog>

    <!-- deposit / withdrawal -->
    <ProcessingDialog
      v-model="dialog"
      :isDialogPersistent="true"

      :isProcessing="isProcessingTransaction"
      :isSuccess="!transactionError"

      :processingTitle="$t('Transaction.Dialog.Processing.Title')"
      :processingText="$t('Transaction.Dialog.Processing.Text')"
      :successTitle="$t('Transaction.Dialog.Success.Title')"
      :successText="$t('Transaction.Dialog.Success.Text')"
      :errorTitle="$t('Transaction.Dialog.Error.Title')"
    >
      <div slot="text-error">
        <p>{{ transactionError }}</p>
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
import SightlineFunding from '@/components/payments/sb/SightlineFundingSB'
let vm = null
export default {
  components: {
    CircularRotate,
    ProcessingDialog,
    SightlineFunding
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
      merchantName: undefined,
      formData: {
        amount: ''
      },
      formRules: {
        amount: {
          required (value) { return !!value || vm.$t('Transaction.Amount.IsRequired') },
          // deposit
          lessThanMin (value) {
            const minAmount = vm.minDepositAmount
            if (minAmount) {
              return value >= minAmount || vm.$t('Transaction.Amount.Deposit.MinAmount') + ' $' + minAmount
            } else {
              return value > 0 || vm.$t('Transaction.Amount.MustBeMoreThan') + ' $0' // by default amount must be more than $0
            }
          },
          moreThanMax (value) {
            const maxAmount = vm.maxDepositAmount
            if (maxAmount) {
              return value <= maxAmount || vm.$t('Transaction.Amount.Deposit.MaxAmount') + ' $' + maxAmount
            } else {
              return true // no max amount limit
            }
          },
          max2Decimals: v => /^\s*(?=.*[1-9])\d*(?:\.\d{1,2})?\s*$/g.test(v) || vm.$t('Transaction.Amount.Deposit.Max2Decimals')
          // withdrawal...
        }
      },
      valid: true,
      dialog: false,
      transactionError: null,
      isTransactionProcessingInvoked: false,
      playPlusAddress: window.ctsautoconf.PLAY_PLUS
    }
  },

  computed: {
    ...mapGetters(['isLoggedIn']),
    ...mapState('sightline', {
      isProcessingInstructionFetch: 'isProcessingInstructionFetch',
      isProcessingEnrollment: 'isProcessingEnrollment',
      isFinalizingEnrollment: 'isFinalizingEnrollment',
      isProcessingDeposit: 'isProcessingDeposit',
      pollingTransactionError: 'pollingTransactionError'
    }),
    ...mapGetters('sightline', {
      isInstructionVerified: 'isInstructionVerified',
      isPollingTransaction: 'isPollingTransaction',
      minDepositAmount: 'minDepositAmount',
      maxDepositAmount: 'maxDepositAmount'
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
      return store.getters['getSightlineParams']
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
    isProcessingTransaction () {
      return this.isPollingTransaction || this.isProcessingInstructionFetch || this.isProcessingDeposit || this.isTransactionProcessingInvoked
    },
    customerContext: () => store.getters['getCustomerContext'],
    balanceSum () {
      return (this.customerContext && this.customerContext.Balances && this.customerContext.Balances.find(b => b.Key === 'CREDIT').Trading) || 0
    },
    currencySymbol () {
      return config.app.CURRENCY
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
    userIsVerifed: () => store.getters['getIsCustomerVerified'],
    customerCanDeposit () {
      return this.customerContext && this.customerContext.ActionDeposit
    },
    customerCanWithdraw () {
      return this.customerContext && this.customerContext.ActionWithdraw
    }
  },

  methods: {
    startEnrollFlow () {
      this.processingEnrollmentDialogError = null
      this.customerServiceMessage = null
      this.processingEnrollmentDialog = true

      store.dispatch('sightline/startEnrollmentFlow')
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
        store.commit('setSightlineParams', false)
        console.log('sightlineParams', this.sightlineParams)
      }
    },

    completeEnrollment () {
      if (!this.isInstructionVerified && this.isRedirectedFromSightline) {
        store.dispatch('sightline/completeEnrollmentFlow', { IDMMSITXRequest: this.IDMMSITXRequest })
      }
    },
    async startTransaction (param) {
      if (this.$refs.form.validate()) {
        try {
          this.isTransactionProcessingInvoked = true
          this.transactionError = null
          this.customerServiceMessage = null
          this.dialog = true
          if (param === 'deposit') {
            await this.$store.dispatch('sightline/depositSightlineFlow', {'amount': this.formData.amount})
          } else {
            await this.$store.dispatch('sightline/withdrawalSightlineFlow', {'amount': this.formData.amount})
          }
          this.reset()
        } catch (err) {
          this.customerServiceMessage = err.exceptionType === 'AccountNotVerified' ? this.$t('Transaction.Dialog.Error.ContactSupport') : this.$t('Transaction.Dialog.Error.Text.ContactSupport')
          this.transactionError = err.message || this.$t('Server.ErrorMsg.Generic')
          this.$store.dispatch('sightline/sendAnalytics', 'failed')
        } finally {
          this.isTransactionProcessingInvoked = false
        }
      }
    },
    reset () {
      this.$refs.form.reset()
    },
    go2PlayPlus () {
      if (this.playPlusAddress) {
        if (window.ctsautoconf.MOBILE_LS) {
          mobileBridge.bridgeSendRequest('openIgtPay', this.playPlusAddress)
        } else {
          window.location.href = this.playPlusAddress
        }
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

  watch: {
    // isLoggedIn (newVal, oldVal) {
    //   if (newVal) {
    //     this.initialize()
    //   }
    // },
    pollingTransactionError (newVal) {
      this.transactionError = newVal
    }
  },
  async mounted () {
    await store.dispatch('sightline/fetchInstruction')
    this.checkIfRedirectedFromSightline()
    this.completeEnrollment()
  },
  created () {
    vm = this
  }
}
</script>
<style lang="stylus" scoped>
@import "~@/css/config"
p
  text-align center
.label
  color #21335a
  font-size 15px
  text-transform uppercase
  text-align center
.content
  display flex
  justify-content center
  background white
  flex-direction column
  &.enrollment
    height 60px
    flex-direction row
  .sportsbook,
  .play-plus
    display flex
    justify-content center
    flex-direction column
    border-top 2px solid #e8e7eb 
    .cta
      display flex
      justify-content center
      flex-direction row
      &.pp
        margin-bottom 10px
        .pp.cnt
          flex 1
          overflow hidden
          button
            @media mobile-big-and-above
              width 200px
          >>> div
            white-space normal
            width: auto
  .sportsbook
    .balance
      text-align center
      margin-bottom 5px
    .sbsl-transaction
      text-align center
      .main-column
        // border-radius 2px
        // width 50%
        // display inline-block
        background white!important
        // .v-form
        //   >>> .v-text-field__slot
        //     border 1px solid #cfd6db
        //     margin-top 2px
        //   @media mobile-big-and-below
        //     background white
        .v-input.my-3.input-amount
          margin 0!important
  .play-plus
    .PlayPlusImg
      padding 0
  .sl-sb-info
    text-align center
    margin-bottom 7px
  .transaction
    flex 1
    height 60px
    margin 5px
    max-width 200px
    font-size 15px
    display inline-block
    >>> div
      white-space break-spaces
      @media mobile-big-and-below
        font-size 13px!important
      
.note
  color #21335a
  margin 4px auto

.processing-wrapper
  margin 8px auto
  color: #fff
  text-align center
  display flex
  justify-content center
  align-items center
  span
    margin-left 5px
  .pw
    color #21335a
    margin-left 8px
    margin-right 8px
    .redirecting-circular-progress
      height 18px !important
      width 18px !important
      margin-right 2px
      margin-top -4px
    .redirecting-text
      style inline-flex
      vertical-align middle

.inline-block
  display inline-block

#spanexpress
  display none

.go-back
  display: flex
  justify-content: center
  align-items: center
  cursor: pointer
  margin-top: 10px
</style>
