<template>
  <div class="account-page" v-if="isLoggedIn">
    <v-form ref="form" id="form" v-model="valid" lazy-validation class="sp-sl-form">
      <v-btn class="budz transaction" :disabled="isRedirectionInProgress || !userIsVerifed" :loading="isRedirectionInProgress" color="success" @click="submit">
        {{ $t('Transaction.Sightline.SB.Fund')}}
        <template v-slot:loader>
          <div>
            <v-progress-circular class="redirecting-circular-progress" indeterminate></v-progress-circular>
            <span class="redirecting-text">{{ $t('Transaction.Sightline.ButtonText2') }}</span>
          </div>
        </template>
      </v-btn>
      <!-- <v-btn class="budz transaction" :disabled="isRedirectionInProgress" :loading="isRedirectionInProgress" color="success" @click="submit">
        {{ $t('Transaction.Sightline.SB.Withdrawal')}}
        <template v-slot:loader>
          <div>
            <v-progress-circular class="redirecting-circular-progress" indeterminate></v-progress-circular>
            <span class="redirecting-text">{{ $t('Transaction.Sightline.ButtonText2') }}</span>
          </div>
        </template>
      </v-btn> -->
    </v-form>
    <v-form id="spanexpress" name="LaunchSpanExpress" :action="postUrl" method="post">
      {{postUrl}}
      <input name="MerchantID" id="MerchantID" :value="merchantID" />
      <textarea name="IdentityToken" id="IdentityToken">{{identityToken}}</textarea>
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
    <!-- modal dialog to show 'please wait' while user is redirected to sightline -->
    <ProcessingDialog
      v-model="isProcessingDialogVisible"
      :isDialogPersistent="true"
      :isProcessing="isRedirectionInProgress"

      :isTitleVisible="!!processingFundingDialogError"
      :isSuccess="!processingFundingDialogError"
      :errorText="processingFundingDialogError"
      :processingText="$t('Transaction.Sightline.Enroll.Redirection.Dialog.Text')"
    >
    </ProcessingDialog>
  </div>
</template>

<script>
  import config from '@/config'
  import Screen from '@/components/mixins/Screen'
  import Forms from '@/components/mixins/Forms'
  import lib from '@/library'
  import { mapGetters } from 'vuex'
  import mobileBridge from '@/library/mobileBridge'
  import ProcessingDialog from '@/components/common/ProcessingDialog'
  import Url from '@/components/mixins/Url'
  import Branding from '@/components/mixins/Branding'
  import store from '@/store'

  export default {
    mixins: [
      Screen,
      Forms,
      Branding,
      Url

    ],

    components: {
      ProcessingDialog
    },

    data: () => ({
      isRedirectionInProgress: false,
      processingFundingDialogError: null, // error to show in dialog box if redirection to sightline funding fails
      isProcessingDialogVisible: false,

      valid: true,

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
    }),
    methods: {
      async submit () {
        if (this.$refs.form.validate()) {
          try {
            this.isRedirectionInProgress = true
            this.isProcessingDialogVisible = true

            this.redirectionData = await this.$store.dispatch('sightline/fundingSightlineFlow')
            this.postUrl = this.redirectionData && this.redirectionData.result && this.redirectionData.result.Url
            let params = this.redirectionData && this.redirectionData.result && this.redirectionData.result.Parameters
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
              if (this.mobilelocalServer) {
                var form = document.querySelector('#spanexpress')
                var serializeformData = this.formSerializer(form)
                let queryString = window.location.origin + lib.core.url.proccessingPage + '?postUrl=' + this.postUrl + '&' + serializeformData
                mobileBridge.bridgeSendRequest('returnCashierURL', this.returnURL)
                console.log('queryString', queryString)
                mobileBridge.bridgeSendRequest('openIgtPay', queryString)
                lib.rpcService.api.helpers.stopTokenTImer()
                this.$router.push({name: 'home'})
                return false
              }
              document.getElementById('spanexpress').submit()
            }, 0)
          } catch (ex) {
            console.log(ex)
            this.isRedirectionInProgress = false
            this.processingFundingDialogError = this.$t('Transaction.Sightline.Funding.Error')
          }
        }
      },
      reset () {
        this.$refs.form.reset()
      },

      isRedirectedFromSightline () {
        let url = window.location.href
        let IDMMSITXRequestExist = (this.mobilelocalServer) ? Object.keys(this.sightlineParams).includes('IDMMSITXRequest') : url.includes('?IDMMSITXRequest=')
        console.log('IDMMSITXRequestExist', IDMMSITXRequestExist)
        let IDMMSITXRequest
        if (IDMMSITXRequestExist) {
          IDMMSITXRequest = (this.mobilelocalServer) ? Number(this.sightlineParams.IDMMSITXRequest) : this.getIDMMSITXRequest(url)
          this.$store.dispatch('sightline/completeRBWRequest', {IDMMSITXRequest: IDMMSITXRequest})
            .catch(err => console.error('completeRBWRequest failed when got back from sightline funding:', err.message))
            .finally(() => {
              // remove query params from url once we get it
              // this way if page is refreshed we prevent processing as if it was redirected back from external page
              if (!this.sightlineParams && !this.mobilelocalServer) {
                this.$router.replace({'query': null})
                return false
              }
              this.$store.commit('setSightlineParams', false)
              console.log('sightlineParams', this.sightlineParams)
            })
        }
      },
      initialize () {
        if (this.isLoggedIn && !this.isInstructionVerified) {
          this.$store.dispatch('sightline/fetchInstruction')
        }
      },
      getIDMMSITXRequest (param) {
        let queryParams = param.split('?')[1]
        let arrOfParams = new URLSearchParams(queryParams)
        let result = arrOfParams.get('IDMMSITXRequest')
        return Number(result)
      }
    },
    computed: {
      isLoggedIn () {
        return this.$store.getters['isLoggedIn']
      },
      ...mapGetters('sightline', {
        isInstructionVerified: 'isInstructionVerified'
      }),
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
      userIsVerifed: () => store.getters['getIsCustomerVerified'],
      customerContext: () => store.getters['getCustomerContext'],
      customerCanDeposit () {
        return this.customerContext && this.customerContext.ActionDeposit
      },
      customerCanWithdraw () {
        return this.customerContext && this.customerContext.ActionWithdraw
      }
    },
    watch: {
      isLoggedIn (newVal, oldVal) {
        if (newVal) {
          this.initialize()
        }
      }
    },
    async mounted () {
      this.initialize()
      this.isRedirectedFromSightline()
    }
  }
</script>

<style lang="stylus" scoped>
  @import "~@/css/config"
  .account-page
    flex 1
    overflow hidden
  .main-column
    text-align center
    #form
      margin 0 auto
      max-width 500px
      background-color #fff
    #spanexpress
      display none
    .sp-sl-form
      display flex
      justify-content flex-end
      .budz
        flex 1
        display inline-block
        margin 5px
        height 60px
        max-width 200px
        @media mobile-big-and-above
          width 200px
        >>> div
          white-space normal
          width: auto
  .go-back
    display block
    text-align center
    margin 10px
    font-size 15px
    span
      cursor pointer
      i
        position relative
        top 7px
  .redirecting-circular-progress
    height 22px !important
    width 22px !important
  .redirecting-text
    style inline-flex
    vertical-align middle
</style>
