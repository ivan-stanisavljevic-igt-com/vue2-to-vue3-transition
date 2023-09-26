<template>
  <div class="page-content account acc_verification"  :class="{'padding-0': !accountSummaryFlow, 'padding-30': accountSummaryFlow}">
    <VerTitles :currentStep="currentStep" :maxStep="maxStep" :currStepTitle="$t('Account.SequentialVerification.VerifyByPin.Verification', {verifyDetail: verifyDetail})" :isMapPage="true" @closePage="closeVerPage"></VerTitles>
    <!-- dynamic verification component: email, phone, personal data, mobile phone ownership -->
    <div v-if="!isChageDetails">
      <component v-bind:is="currentComponent" :page="currentPage" :state="currentPageState" @refreshafteraction="updateCom" @changeDetail="changeDetails" :mapUpdating="mapIsUpdating"></component>
    </div>
    <div>
      <ChangeDetail v-if="isChageDetails" @goBack="changeDetails" @updateCom="updateCom" :page="currentPage"/>
    </div>
  </div>
</template>

<script>
  import store from '@/store'
  import Branding from '@/components/mixins/Branding'
  import { mapGetters } from 'vuex'
  import ChangeDetail from '@/components/account/Verification/ChangeDetail'
  import VerTitles from '@/components/account/Verification/VerTitles'

  export default {
    name: 'Verification',
    mixins: [
      Branding
    ],
    components: {
      ChangeDetail,
      VerTitles
    },
    data () {
      return {
        selectedMapIndex: 1,
        centered: true,
        isChageDetails: false,
        componentToDisplay: null,
        mapIsUpdating: false
      }
    },
    computed: {
      ...mapGetters('verification', {
        verificationMaps: 'getVerificationMaps',
        componentName: 'getComponentName',
        currentStep: 'getCurrentStep',
        maxStep: 'getMaxStep',
        currentPage: 'getCurrentPage',
        currentPageState: 'getCurrentPageState'
      }),
      mapId () {
        return store.getters['verification/getMapId'] || localStorage.getItem('verificationMapId')
      },
      currentComponent () {
        if (this.componentToDisplay) {
          return () => import(`@/components/account/Verification/${this.componentToDisplay}.vue`)
        }
        return null
      },
      isLoggedIn () {
        return store.getters['isLoggedIn']
      },
      verifyDetail () {
        let detail
        switch (this.currentPage) {
          case 'verify_email':
            detail = this.$t('Account.SequentialVerification.VerifyByPin.Verification.Email')
            break
          case 'verify_mob':
            detail = this.$t('Account.SequentialVerification.VerifyByPin.Verification.Phone')
            break
          case 'verify_identity':
          case 'upload_documents':
            detail = this.$t('Account.SequentialVerification.IdentityVerification')
            break
          case 'verify_identity_phone':
          case 'upload_documents_phone':
            detail = this.$t('Account.SequentialVerification.PhoneVerification')
            break
        }
        return detail
      },
      accountSummaryFlow () {
        return window.ctsautoconf.ACCOUNT_SUMMARY_FLOW || false
      }
    },
    methods: {
      importComponent (cName) {
        return () => import(`@/components/account/Verification/${cName}.vue`)
      },
      changeDetails () {
        this.isChageDetails = !this.isChageDetails
      },
      fetchVerificationMapData () {
        let maps = this.verificationMaps
        if (maps) {
          let vMap = maps.length === 1 ? maps : maps.filter(m => (m.mapno.toString() === this.mapId.toString()))
          if (vMap && vMap.length > 0) {
            let map = vMap[0]
            let page = map.idtxregpage && map.idtxregpage.toLowerCase()
            let pageState = map.regpagestate && map.regpagestate.toLowerCase()
            store.commit('verification/setCurrentStep', map.step)
            store.commit('verification/setMaxStep', map.max_step)
            store.commit('verification/setCurrentPage', page)
            store.commit('verification/setCurrentPageState', pageState)
            switch (page) {
              case 'upload_documents':
              case 'verify_identity':
              case 'verify_identity_phone':
              case 'upload_documents_phone':
                store.commit('verification/setComponentName', 'VerifyIdentity')
                break
              default:
                store.commit('verification/setComponentName', 'VerifyByPin')
                break
            }
            this.componentToDisplay = this.componentName
          }
        }
      },
      scroll2Top () {
        window.scrollTo(0, 0)
      },
      updateCom () {
        let self = this
        self.mapIsUpdating = true
        store.dispatch('verification/fetchVerificationMaps').then(function () {
          self.fetchVerificationMapData()
          store.dispatch('getCustomerContext')
        }).finally(function () {
          self.scroll2Top()
          self.mapIsUpdating = false
        })
      },
      closeVerPage () {
        this.$emit('closePage')
      }
    },
    created () {
    },
    mounted () {
      this.fetchVerificationMapData()
      this.componentToDisplay = this.componentName
    },
    watch: {
    }
  }
</script>

<style lang="stylus" scoped>
  @import "~@/css/config";
  @import "~@/css/mixins";
  @import "~@/css/sportIcons";

  .page-content.account
    flex-direction column !important
    position: relative
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
    .v-card__text
      @media tablet-and-below
        height: 70vh !important
  .page-content.account.padding-0
    padding 0px
  .page-content.account.padding-30
    @media mobile-big-and-below
      padding 30px
</style>

