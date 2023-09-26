<template>
  <div class="page-content account acc_verification">
    <!-- Verify identity - initial state -->
    <div class="phone verify ctsform" v-if="page === 'verify_identity' && state === 'initial'">
      <div class="phone-verify grey-box">
        <div class="flow-wrapper">
          <p v-html="$t('Account.Verification.KYC.NotStarted')"></p>
        </div>
      </div>
      <!-- REFRESH BUTTON -->
      <div class="form-actions mt-20">
        <v-btn color="success" x-large @click.stop="refreshVerificationMaps()" :disabled="mapUpdating"><span>{{ $t('Account.Verification.KYC.Refresh') }}</span></v-btn><div><circle-loader v-if="mapUpdating"></circle-loader></div>
      </div>
    </div>

    <!-- Verify identity - sent state -->
    <div class="phone verify ctsform" v-else-if="page === 'verify_identity' && state === 'sent'">
      <div class="phone-verify grey-box">
        <div class="flow-wrapper">
          <p class="text-center" v-html="$t('Account.Verification.KYC.InProgress')"></p>
        </div>
      </div>
      <!-- REFRESH BUTTON -->
      <div class="form-actions mt-20">
        <v-btn color="success" x-large @click.stop="refreshVerificationMaps()" :disabled="mapUpdating"><span>{{ $t('Account.Verification.KYC.Refresh') }}</span></v-btn><div><circle-loader v-if="mapUpdating"></circle-loader></div>
      </div>
    </div>

    <!-- Verify identity - in casino (after successfull KYC or there is no KYC in the system) -->
    <div class="phone verify ctsform grey-box" v-else-if="page === 'verify_identity' && state === 'casino'">
      <div class="phone-verify">
        <div class="flow-wrapper">
          <p><strong>{{ $t('Account.Verification.Customer.PersonalData.ActionRequired') }}</strong></p>
          {{ $t('Account.Verification.Casino') }}
        </div>
      </div>
    </div>

    <!-- Verify identity - in casino 1 (there is KYC but failed) -->
    <div class="phone verify ctsform grey-box" v-else-if="page === 'verify_identity' && state === 'casino1'">
      <div class="phone-verify">
        <div class="flow-wrapper">
          <p><strong>{{ $t('Account.Verification.Customer.PersonalData.ActionRequired') }}</strong></p>
          {{ $t('Account.Verification.Casino.Casino1') }}
        </div>
      </div>
    </div>

    <!-- Identity verification - upload documents - initial state -->
    <div class="phone verify ctsform" v-else-if="page === 'upload_documents' && state === 'initial'">
      <div class="upload-doc-verify">
        <div class="flow-wrapper">
          <verify-personal-data :currentPage="page" :currentState="state" @refreshafterupload="refreshVerificationMaps"></verify-personal-data>
        </div>
      </div>
    </div>

    <!-- Identity verification - upload documents - sent state -->
    <div class="phone verify ctsform" v-else-if="page === 'upload_documents' && state === 'sent'">
      <div class="upload-doc-verify grey-box">
        <div class="flow-wrapper">
          <p class="text-center" v-html="$t('Account.Verification.Identity.UploadDocument.InProgress')"></p>
        </div>
      </div>
      <!-- REFRESH BUTTON -->
      <div class="form-actions mt-20">
        <v-btn color="success" x-large @click.stop="refreshVerificationMaps()" :disabled="mapUpdating"><span>{{ $t('Account.Verification.KYC.Refresh') }}</span></v-btn><div><circle-loader v-if="mapUpdating"></circle-loader></div>
      </div>
    </div>

    <!-- Identity verification - upload documents rejected state -->
    <div class="phone verify ctsform grey-box" v-else-if="page === 'upload_documents' && state === 'rejected'">
      <div class="upload-doc-verify">
        <div class="flow-wrapper">
          <p v-html="$t('Account.Verification.Identity.UploadDocument.Rejected')"></p>
        </div>
      </div>
    </div>

    <!-- Verify identity phone - initial state -->
    <div class="phone verify ctsform" v-else-if="page === 'verify_identity_phone' && state === 'initial'">
      <div class="phone-verify grey-box">
        <div class="flow-wrapper">
          <p v-html="$t('Account.Verification.KYC.Phone.NotStarted')"></p>
        </div>
      </div>
      <!-- REFRESH BUTTON -->
      <div class="form-actions mt-20">
        <v-btn color="success" x-large @click.stop="refreshVerificationMaps()" :disabled="mapUpdating"><span>{{ $t('Account.Verification.KYC.Refresh') }}</span></v-btn><div><circle-loader v-if="mapUpdating"></circle-loader></div>
      </div>
    </div>

    <!-- Verify identity phone - sent state -->
    <div class="phone verify ctsform" v-else-if="page === 'verify_identity_phone' && state === 'sent'">
      <div class="phone-verify grey-box">
        <div class="flow-wrapper">
          <p class="text-center" v-html="$t('Account.Verification.KYC.Phone.InProgress')"></p>
        </div>
      </div>
      <!-- REFRESH BUTTON -->
      <div class="form-actions mt-20">
        <v-btn color="success" x-large @click.stop="refreshVerificationMaps()" :disabled="mapUpdating"><span>{{ $t('Account.Verification.KYC.Refresh') }}</span></v-btn><div><circle-loader v-if="mapUpdating"></circle-loader></div>
      </div>
    </div>

    <!-- Verify identity phone - answers state -->
    <div class="phone verify ctsform" v-else-if="page === 'verify_identity_phone' && state === 'answers'">
      <div class="phone-verify grey-box">
        <div class="flow-wrapper">
          <p><strong>{{ $t('Account.Verification.Customer.PersonalData.ActionRequired') }}</strong></p>
          <p>{{ $t('Account.Verification.Identity.Phone.Answers') }}</p>
        </div>
      </div>
      <!-- REFRESH BUTTON -->
      <div class="form-actions mt-20">
        <v-btn color="success" x-large @click.stop="refreshVerificationMaps()" :disabled="mapUpdating"><span>{{ $t('Account.Verification.KYC.MKA.Refresh') }}</span></v-btn><div><circle-loader v-if="mapUpdating"></circle-loader></div>
      </div>
    </div>

    <!-- Identity verification phone - upload documents - initial state -->
    <div class="phone verify ctsform" v-else-if="page === 'upload_documents_phone' && state === 'initial'">
      <div class="upload-doc-verify">
        <div class="flow-wrapper">
          <verify-personal-data :currentPage="page" :currentState="state" @refreshafterupload="refreshVerificationMaps"></verify-personal-data>
        </div>
      </div>
    </div>

    <!-- Identity verification phone - upload documents - sent state -->
    <div class="phone verify ctsform" v-else-if="page === 'upload_documents_phone' && state === 'sent'">
      <div class="phone-verify grey-box">
        <div class="flow-wrapper">
          <p class="text-center" v-html="$t('Account.Verification.Identity.Phone.UploadDocument.InProgress')"></p>
        </div>
      </div>
      <!-- REFRESH BUTTON -->
      <div class="form-actions mt-20">
        <v-btn color="success" x-large @click.stop="refreshVerificationMaps()" :disabled="mapUpdating"><span>{{ $t('Account.Verification.KYC.Refresh') }}</span></v-btn><div><circle-loader v-if="mapUpdating"></circle-loader></div>
      </div>
    </div>

    <!-- Identity verification phone - upload documents rejected -->
    <div class="phone verify ctsform grey-box" v-else-if="page === 'upload_documents_phone' && state === 'rejected'">
      <div class="phone-verify">
        <div class="flow-wrapper">
          <p v-html="$t('Account.Verification.Identity.UploadDocument.PhoneRejected')"></p>
        </div>
      </div>
    </div>

    <!-- Identity verification - unexpected page and state -->
    <div class="phone verify ctsform grey-box" v-else>
      <div class="phone-verify">
        <div class="flow-wrapper">
          {{ $t('Account.Verification.UnexpectedPageAndState', {page: page, state: state }) }}
        </div>
      </div>
    </div>


  </div>
</template>

<script>
  import store from '@/store'
  import VerifyPersonalData from '@/components/account/Verification/VerifyPersonalData'
  import CircleLoader from '@/components/common/CircleLoader'

  export default {
    name: 'VerifyIdentity',
    props: ['page', 'state', 'mapUpdating'],
    components: {
      VerifyPersonalData,
      CircleLoader
    },
    computed: {
      isLoggedIn () {
        return store.getters['isLoggedIn']
      },
      accountSummaryFlow: () => window.ctsautoconf.ACCOUNT_SUMMARY_FLOW
    },
    methods: {
      refreshVerificationMaps () {
        this.$emit('refreshafteraction')
      },
      verifyPersonalData () {
        this.$router.push({name: 'verify-personal-data'})
      }
    },
    mounted () {
      if (this.isLoggedIn) {
        this.refreshVerificationMaps()
      }
    }
  }
</script>

<style lang="stylus" scoped>
  @import '~@/css/config'
  @import '~@/css/mixins'

  .page-content.account
    padding: 0
    flex-direction column
    h2
      margin 0
      text-align center
    .verify
      cursor default
      &.mail44444
        padding-bottom 0
      .mail-verify,
      .phone-verify
        border-radius 0px
        .flow-wrapper
          border: none !important
          p
            text-align: center
          .form-actions
            .v-btn
              padding: 0
              width: 350px
              >>>.v-btn__content
                display: inline-block
                width: 100%;
              @media mobile-big-and-below
                width: 100%
      .upload-doc-verify,
      .phone-verify
        .flow-wrapper
          border: none !important
          p
            text-align: left
            >>>strong
              text-align center
              font-size 16px
              margin 0 auto 10px
              display block
              font-family "Open Sans Bold"
            &.text-center
              text-align center
      .additional-info
        color red
    .personal-data
      border-radius 0px !important
      margin-bottom 10px !important
  .grey-box
    border-radius: 5px
    padding: 20px
    background-color: #E5E5E5
  .form-actions
    &.mt-20
      margin-top 20px
      button
        width 350px
        >>>.v-btn__content
          width initial !important
      @media mobile-big-and-below
        button
          width 100%
</style>
