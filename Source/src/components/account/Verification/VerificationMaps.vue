<template>
  <div class="verification">
    <div v-if="mobileBigAndBelow && showMap && accountSummaryFlow" class="account-heading"><icon name="icon-acc-verification"></icon>{{ $t('MyAccount.FirstTimeLogin.Title') }}</div>
    <h2 class="onlyForRilot"> {{ $t('Account.Verification.Status.Title') }} </h2>
    <div class="verification-content">
      <div v-if="!isCustomerVerified">
        <div v-if="showMap">
          <div class="blue-heading" v-html="$t('Account.SequentialVerification.GuidedVerification.Title')"></div>
          <div class="padding-separate">
            <VerTitles :currStepTitle="$t('Account.SequentialVerification.VerificationMaps.Title')" :isMapPage="false" @closePage="closeVerPage"></VerTitles>
            <div v-if="verMaps && verMaps.length > 0">
              <div class="verification_map_desc">
                <p v-html="$t('Account.SequentialVerification.VerificationMaps.Desc')"></p>
              </div>
              <div v-for="vM in verMaps" :key="vM.mapno">
                <div class="verification__instruments">
                  <!-- Maps -->
                  <div class="verification__instruments_item sightlinec diss" @click.stop="go2Verification(vM.mapno)">
                  <span class="piitem-text">
                    <div class="piitem-text-headline">{{vM.title}}</div>
                    <div class="vm_shortdesc piitem-text-desc">{{vM.shortdescription}}</div>
                    <div class="piitem-text-desc">{{vM.mapdescription}}</div>
                  </span>
                  <span class="piitem-arrow"><v-icon>chevron_right</v-icon></span>
                  </div>
                </div>
              </div>
            </div>
            <div v-else>
              <div class="verification_map_desc">
                <p>{{$t('Account.SequentialVerification.VerificationMaps.NoMaps')}}</p>
              </div>
            </div>
          </div>
        </div>
        <div v-else>
          <Verification @closePage="closeVerPage"></Verification>
        </div>
      </div>
      <div v-else>
        <div class="onlyForRilot blue-heading" v-html="$t('Account.SequentialVerification.GuidedVerification.Title')"></div>
        <div class="padding-separate verified_customer">
          <div v-if="isEmailVerified" class="onlyForRilot badge_verified">
            <p>{{ $t('Account.SequentialVerification.VerifyByPin.Verification.Detail.Status.Verified') }}</p>
            <span class="icon-verified"></span>
          </div>
          <VerTitles :currStepTitle="$t('Account.Verification.Status.Title')" :isMapPage="false"></VerTitles>
          <div class="verification_map_desc">
            <p class="strong_text" v-html="$t('Account.Verification.Status.Desc')"></p>
            <p v-if="brandKey === 'sb'" v-html="$t('Account.Verification.Status.Superbook')"></p>
            <p v-if="brandKey !== 'sb'" v-html="$t('Account.Verification.Status.PlaySportsbook')"></p>
            <p v-if="!isEmailVerified || !isPhoneVerified" class="onlyForRilot" v-html="$t('Account.Verification.Status.Rilot')"></p>
          </div>
        </div>
      </div>
    </div>
    <div v-if="showMap">
      <verify-detail detail="phone"></verify-detail>
      <verify-detail detail="email"></verify-detail>
    </div>
  </div>

</template>

<script>
  import store from '@/store'
  import Screen from '@/components/mixins/Screen'
  import Branding from '@/components/mixins/Branding'
  import accounting from '@/components/mixins/accounting'
  import VerTitles from '@/components/account/Verification/VerTitles'
  import Verification from '@/components/account/Verification/Verification.vue'
  import VerifyDetail from '@/components/account/Verification/VerifyDetail.vue'
  import Icon from '@/components/common/Icon'

  export default {
    name: 'VerificationMaps',
    mixins: [Screen, Branding, accounting],
    components: {
      VerTitles,
      Verification,
      VerifyDetail,
      Icon
    },
    data () {
      return {
        showMap: true
      }
    },
    computed: {
      verMaps () {
        return store.getters['verification/getVerificationMaps']
      },
      isCustomerVerified () {
        return store.getters['getIsCustomerVerified']
      },
      accountSummaryFlow () {
        return window.ctsautoconf.ACCOUNT_SUMMARY_FLOW || false
      },
      isEmailVerified () {
        return store.getters['getIsEmailVerified']
      },
      isPhoneVerified () {
        return store.getters['getIsPhoneVerified']
      }
    },
    methods: {
      go2Verification (mapId) {
        store.commit('verification/setMapId', mapId)
        localStorage.setItem('verificationMapId', mapId)
        this.scroll2Top()
        this.showMap = false
      },
      scroll2Top () {
        window.scrollTo(0, 0)
      },
      closeVerPage () {
        this.showMap = true
      }
    },
    mounted () {
      store.dispatch('verification/fetchVerificationMaps')
      store.dispatch('getCustomerContext')
    },
    destroyed () {
      localStorage.removeItem('verificationMapId')
      localStorage.removeItem('verificationMaps')
    }
  }
</script>

<style lang="stylus" scoped>
@import "~@/css/config"
@import "~@/css/mixins"
@import "~@/css/sportIcons"

.verification
  background white
  // padding-bottom 20px
  .blue-heading
    padding: 10px 20px
    background: #003764
    color: #fff
    font-size 16px
    font-family 'Open Sans SemiBold'
    @media mobile-big-and-below
      padding 10px
  .padding-separate
    padding 20px
    @media mobile-big-and-below
      padding 10px
  .ver-padding
    &.padding-0
      padding 0 15px
      >>>.v-expansion-panel__header
        padding 12px 0 !important
    @media mobile-big-and-below
      padding 0 15px
  .verification_map_desc
    background #e5e5e5
    border-radius 3px
    padding 10px
    margin 0
    font-size 14px
    p 
      margin: 5px 0
    .strong_text
      font-family: "Open Sans Bold" !important
    @media mobile-big-and-below
      font-size 13px
      margin 0
  @media mobile-big-and-below
    padding 15px
  .verification__instruments
    margin 0
    padding 20px 0 0 0
    @media mobile-big-and-below
      margin 0
    .verification__instruments_item
      cursor pointer
      display flex
      min-height 60px
      border-top 1px solid #cfd6db
      border-left 1px solid #cfd6db
      border-right 1px solid #cfd6db
      padding 15px 0px 15px 15px
      border-radius 7px
      margin-bottom: 5px
      &:last-child
        border-bottom 1px solid #cfd6db
      .piitem-picture,
      >>> .piitem-picture
        display flex
        flex 3
        justify-content center
        align-items center
        padding 0 5px
        img
          width 100%
          height auto
      .piitem-text,
      >>> .piitem-text
        flex 20
        display flex
        justify-content center
        flex-direction column
        .piitem-text-headline
          font-size 15px
          font-family: "Open Sans Bold" 
          padding 5px
        .piitem-text-desc
          font-size 14px
          padding 5px
      .piitem-arrow,
      >>> .piitem-arrow
        display flex
        flex 1
        justify-content center
        align-items center
        i
          font-size 40px
.onlyForRilot
  display none
.badge_verified
  color #1d9add
  font-family: "Open Sans Bold" !important
  display: flex !important
  justify-content: flex-end
  p 
    margin 0
  .icon-verified
    margin-left 5px
    display: inline-block
    background-image: url(icons-path'/'verified'.svg')
    height: 25px !important
    width: 22px !important



</style>
