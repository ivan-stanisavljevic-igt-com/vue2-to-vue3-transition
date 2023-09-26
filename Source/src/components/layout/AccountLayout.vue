<template>
   <div class="sports-page">
    <v-layout  class="page-layout">
      <v-flex class="main-column" :style="{paddingTop: headerHeight + 'px'}" ref="maincolumn">
        <resize-observer @notify="mainColumnResize" />
        <!-- <header-part id="header-part" :style="tabletAndAbove && mainColumnWidth > 0 ? {width: mainColumnWidth + 'px'} : {}"></header-part> -->
          <div class="page-content account" :class="{'loggedIn': isLoggedIn}">
            <account-info-summary v-if="isLoggedIn && accountSummaryFlow && mobileBigAndBelow"></account-info-summary>
            <div v-if="tabletAndAbove && isLoggedIn" class="account_links">
              <div class="acc_header">{{ $t('Account.PlayerZone') }}</div>
              <site-navigation :navigation-section="AccountFlow" class="account_links"></site-navigation>
            </div>
            <div class="accpage" :class="[state, {'loggedIn': isLoggedIn, 'acc_summary_flow': accountSummaryFlow}]">
            <router-view></router-view>
            </div>
          </div>
      </v-flex>
    </v-layout>
  </div>
</template>
<script>
  import Screen from '@/components/mixins/Screen'
  import store from '@/store'
  import config from '@/config'

  import HeaderPart from '@/components/layout/parts/HeaderPart'
  import SiteNavigation from '@/components/common/SiteNavigation'
  import AccountInfoSummary from '@/components/account/IntegratedWallet/AccountInfoSummary'

  export default {
    name: 'AccountLayout',

    mixins: [
      Screen
    ],

    components: {
      HeaderPart,
      SiteNavigation,
      AccountInfoSummary
    },

    props: {

    },

    data: () => ({
    }),

    computed: {
      isOpenedFromWebView () {
        return store.getters['getIsOpenedFromWebView']
      },
      headerMessageState () {
        return store.getters['overlayState/getHeaderMessageState']
      },
      headerHeight () {
        return store.getters['screenState/getHeaderHeight']
      },
      headerMessageHeight () {
        return store.getters['screenState/getHeaderMessageHeight']
      },
      mainColumnWidth () {
        return store.getters['screenState/getMainColumnWidth']
      },
      isLoggedIn () {
        return store.getters['isLoggedIn']
      },
      accountSummaryFlow () {
        return window.ctsautoconf.ACCOUNT_SUMMARY_FLOW || false
      },
      AccountFlow () {
        if (window.ctsautoconf.ACCOUNT_SUMMARY_FLOW) {
          return 'ACCOUNT_SUMMARY_LINKS'
        }
        return 'MY_ACCOUNT_LINKS'
      },
      state () {
        return config.app.autoconf.STATE
      }
    },
    mounted () {
      this.mainColumnResize()
    },

    methods: {
      mainColumnResize () {
        var mainColumn = this.$refs.maincolumn

        if (mainColumn) {
          store.commit('screenState/setMainColumnWidth', mainColumn.offsetWidth)
        }
      }
    },

    watch: {

    },

    created () {

    }
  }
</script>

<style lang="stylus" scoped>
  @import "~@/css/config"

  .url-state-name-sports-live
    .content
      .page-layout
        .background-headline
          height: 180px
          @media mobile-big-and-below
            height: 165px
          >>>.background-image
            @media mobile-big-and-below
              height 175px

</style>
