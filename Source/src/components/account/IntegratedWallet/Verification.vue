<template>
  <div class="page-content account acc_verification">
    <h1 v-if="!accountSummaryFlow">{{ $t('Account.Verification') }}</h1>
    <!-- user verification status -->
    <div class="verified" v-if="false">
      <span v-if="isCustomerVerified">{{ $t('Account.Verification.Customer.Verified') }}</span>
      <span v-else>{{ $t('Account.Verification.Customer.NotVerified') }}</span>
    </div>
    <!-- Personal data validation -->
    <div class="phone verify ctsform" v-if="!(personalDataAdditionalUploadNeeded && mobileNumberAdditionalUploadNeeded)">
      <div class="phone-verify">
        <h2>{{ $t('Account.Verification.Customer.PersonalData.Title') }}</h2>
        <!-- Verification based on the KYC -->
        <div class="flow-wrapper" v-if="aristotleVerificationStatus || manualVerificationStatus">
          <!-- 0. new type of the verification personal data: based on the AVS and WID alerts (combination of the KYC and WID) -->
          <div v-if="isWIDShouldVerify"> <!-- there is WID in the system -->
            <div v-if="aristotleVerificationStatus === 'sent'">
              {{ $t('Account.Verification.Aristotle.InProgress') }}
              <!-- REFRESH BUTTON -->
              <div class="form-actions">
                <v-btn color="success" x-large @click.stop="refreshCustomerContext()"><span>{{ $t('Account.Verification.Aristotle.Refresh') }}</span></v-btn>
              </div>
            </div>
            <div v-else> <!-- AVS statuses: not sent, failed -->
              <h2 class="additional-info">{{ $t('Account.Verification.Customer.PersonalData.ActionRequired') }}</h2><br>
              {{ $t('Account.Verification.Customer.PersonalData.ShouldVerifyInCasinoAfterKYCFailed') }}
            </div>
          </div>
          <!-- 1. aristotle is already verified (AVS is validated and there is no AVS in alerts) -->
          <div class="verified" v-else-if="isAristotleVerified || (aristotleVerificationStatus === 'failed' && isManuallyVerified)">
            {{ $t('Account.VerificationByPin.Aristotle.Verified') }}
          </div>
          <!-- 2. AVS alert in status SENT - aristotle verification is in progress (independent on AID status) -->
          <div v-else-if="aristotleVerificationStatus === 'sent'">
            {{ $t('Account.Verification.Aristotle.InProgress') }}
            <!-- REFRESH BUTTON -->
            <div class="form-actions">
              <v-btn color="success" x-large @click.stop="refreshCustomerContext()"><span>{{ $t('Account.Verification.Aristotle.Refresh') }}</span></v-btn>
            </div>
          </div>
          <!-- 3. AVS alert in status FAILED, AID alerts in status SENT - manual verification is in progress -->
          <div v-else-if="aristotleVerificationStatus === 'failed' && manualVerificationStatus === 'sent'">
            {{ $t('Account.Verification.Manual.InProgress') }}
            <!-- REFRESH BUTTON -->
            <div class="form-actions">
              <v-btn color="success" x-large @click.stop="refreshCustomerContext()"><span>{{ $t('Account.Verification.Aristotle.Refresh') }}</span></v-btn>
            </div>
          </div>
          <!-- 4. AVS alert in status FAILED, AID alerts in status NOTSENT - aristotle requires additional data - upload documents -->
          <div class="not-verified" v-else-if="personalDataAdditionalUploadNeeded">
            <h2 class="additional-info">{{ $t('Account.VerificationByPin.Aristotle.AdditionalVerification.Title') }}</h2><br>
            <span v-html="$t('Account.VerificationByPin.Aristotle.AdditionalVerification.Info')"></span><br>
            <div class="form-actions">
              <v-btn color="success" x-large @click.stop="verifyPersonalData()" id="btn_verify"><span>{{ $t('Account.Verification.Aristotle.Verify') }}</span></v-btn>
            </div>
          </div>
          <div v-else>
            {{ $t('Account.Verification.ContactCustomerSupport') }}
          </div>
        </div>
        <!-- Verification based on the WID-->
        <div class="flow-wrapper" v-else>
          <!-- personal data should verify based on the WID alert -->
          <div v-if="isWIDShouldVerify">
            <h2 class="additional-info">{{ $t('Account.Verification.Customer.PersonalData.ActionRequired') }}</h2><br>
            {{ $t('Account.Verification.Customer.PersonalData.ShouldVerify') }}
          </div>
          <!-- personal data already verified -->
          <div class="verified" v-else>
            {{ $t('Account.Verification.Customer.PersonalData.AlreadyVerified') }}
          </div>
        </div>
      </div>
    </div>
    <!-- Mobile phone ownership validation -->
    <!-- There is KYC (m2p, p2p) in the system -->
    <div class="phone verify ctsform" v-if="(m2p || p2p) && !(personalDataAdditionalUploadNeeded && mobileNumberAdditionalUploadNeeded)">
      <div class="phone-verify">
        <h2>{{ $t('Account.Verification.Customer.MobileNumberOwnership.Title') }}</h2>
        <div class="flow-wrapper">
          <!-- mobile phone ownership is already verified -->
          <div class="verified" v-if="p2pVerified || (p2p === 'failed' && m2pVerified) || mkaVerified">
            {{ $t('Account.Verification.Customer.MobileNumberOwnership.Verified') }}
          </div>
          <!-- P2P alert in status SENT - kyc verification is in progress (independent on M2P status) -->
          <div v-else-if="p2p === 'sent'">
            {{ $t('Account.Verification.Customer.MobileNumberOwnership.InProgress') }}
            <!-- REFRESH BUTTON -->
            <div class="form-actions">
              <v-btn color="success" x-large @click.stop="refreshCustomerContext()"><span>{{ $t('Account.Verification.Aristotle.Refresh') }}</span></v-btn>
            </div>
          </div>
          <!-- P2P alert in status FAILED, M2P alert in status SENT - manually match player to phone is in progress -->
          <div v-else-if="p2p === 'failed' && m2p === 'sent'">
            {{ $t('Account.Verification.Customer.MobileNumberOwnership.ManualMatch.InProgress') }}
            <!-- REFRESH BUTTON -->
            <div class="form-actions">
              <v-btn color="success" x-large @click.stop="refreshCustomerContext()"><span>{{ $t('Account.Verification.Aristotle.Refresh') }}</span></v-btn>
            </div>
          </div>
          <!-- P2P alert in status FAILED, M2P alert in status NOTSENT - kyc requires additional data - upload documents -->
          <div class="not-verified" v-else-if="mobileNumberAdditionalUploadNeeded">
            <h2 class="additional-info">{{ $t('Account.VerificationByPin.Aristotle.AdditionalVerification.Title') }}</h2><br>
            <span v-html="$t('Account.Verification.Customer.MobileNumberOwnership.AdditionalVerification.Info')"></span><br>
            <div class="form-actions">
              <v-btn color="success" x-large @click.stop="verifyPersonalData()" id="btn_verify"><span>{{ $t('Account.Verification.Aristotle.Verify') }}</span></v-btn>
            </div>
          </div>
          <div v-else>
            {{ $t('Account.Verification.Customer.MobileNumberOwnership.ContactCustomerSupport') }}
          </div>
        </div>
      </div>
    </div>
    <!-- common upload - for personal data and mobile phone ownership validation -->
    <div class="phone verify ctsform" v-if="personalDataAdditionalUploadNeeded && mobileNumberAdditionalUploadNeeded">
      <div class="phone-verify personal-data">
        <h2>{{ $t('Account.Verification.Customer.PersonalDataAndMobileNumberOwnership.Title') }}</h2>
        <!-- P2P alert in status FAILED, M2P alert in status NOTSENT - kyc requires additional data - upload documents AND -->
        <!-- AVS alert in status FAILED, AID alerts in status NOTSENT - aristotle requires additional data - upload documents -->
        <div class="not-verified">
          <h2 class="additional-info">{{ $t('Account.VerificationByPin.Aristotle.AdditionalVerification.Title') }}</h2><br>
          <span v-html="$t('Account.Verification.Customer.PersonalDataAndMobileNumberOwnership.AdditionalVerification.Info')"></span><br>
          <div class="form-actions">
            <v-btn color="success" x-large @click.stop="verifyPersonalData()" id="btn_verify"><span>{{ $t('Account.Verification.Aristotle.Verify') }}</span></v-btn>
          </div>
        </div>
      </div>
    </div>
    <!-- Email validation -->
    <div class="mail verify ctsform">
      <div class="mail-verify" >
        <h2>{{ $t('Account.JoinUs.VerificationByPin.Email') }}</h2>
        <!-- email is already verified -->
        <div class="verified" v-if="isEmailVerified">
          {{ $t('Account.VerificationByPin.Email.Verified') }}
        </div>
        <!-- email is not verified -->
        <VerificationByPin class="not-verified" :verify="'email'" v-else></VerificationByPin>
      </div>
    </div>
    <!-- Phone validation -->
    <div class="phone verify ctsform">
      <div class="phone-verify">
        <h2>{{ $t('Account.JoinUs.VerificationByPin.Phone') }}</h2>
        <!-- phone is already verifed -->
        <div class="verified" v-if="isPhoneVerified">
          {{ $t('Account.VerificationByPin.Phone.Verified') }}
        </div>
        <!-- phone is not verified -->
        <VerificationByPin class="not-verified" :verify="'phone'" v-else></VerificationByPin>
      </div>
    </div>
  </div>
</template>

<script>
  import store from '@/store'
  import VerificationByPin from '@/components/account/IntegratedWallet/VerificationByPin.vue'
  import Branding from '@/components/mixins/Branding'

  export default {
    name: 'Verification',
    mixins: [
      Branding
    ],
    components: {
      VerificationByPin
    },
    computed: {
      isLoggedIn () {
        return store.getters['isLoggedIn']
      },
      isEmailVerified () {
        return store.getters['getIsEmailVerified']
      },
      isPhoneVerified () {
        return store.getters['getIsPhoneVerified']
      },
      isAristotleVerified () {
        return store.getters['getIsAristotleVerified']
      },
      aristotleVerificationStatus () {
        return store.getters['getAristotleVerificationStatus']
      },
      manualVerificationStatus () {
        return store.getters['getManualVerificationStatus']
      },
      isCustomerVerified () {
        return store.getters['getIsCustomerVerified']
      },
      isWIDShouldVerify () {
        return store.getters['getIsWIDShouldVerify']
      },
      accountSummaryFlow () {
        return window.ctsautoconf.ACCOUNT_SUMMARY_FLOW || false
      },
      m2p () {
        return store.getters['getM2P']
      },
      p2p () {
        return store.getters['getP2P']
      },
      p2pVerified () {
        return store.getters['getP2PVerified']
      },
      m2pVerified () {
        return store.getters['getM2PVerified']
      },
      isManuallyVerified () {
        return store.getters['getIsManuallyVerified']
      },
      personalDataAdditionalUploadNeeded () {
        return this.aristotleVerificationStatus === 'failed' && this.manualVerificationStatus === 'notsent'
      },
      mobileNumberAdditionalUploadNeeded () {
        return this.p2p === 'failed' && this.m2p === 'notsent' && !this.mkaVerified
      },
      mkaVerified () {
        return store.getters['getMkaVerified']
      }
    },
    methods: {
      refreshCustomerContext () {
        store.dispatch('getCustomerContext')
      },
      verifyPersonalData () {
        this.$router.push({name: 'verify-personal-data'})
      }
    },
    mounted () {
      if (this.isLoggedIn) {
        this.refreshCustomerContext()
      }
    }
  }
</script>

<style lang="stylus" scoped>
  @import '~@/css/config'
  @import '~@/css/mixins'

  .page-content.account
    flex-direction column
    h2
      text-align center
    .verify
      cursor default
      &.mail
        padding-bottom 0
      .mail-verify,
      .phone-verify
        margin 5px
        border 1px solid #dbdce0
        padding 10px
        border-radius 0px
      .additional-info
        color red
    .personal-data
      border-radius 0px !important
      margin-bottom 10px !important
</style>
