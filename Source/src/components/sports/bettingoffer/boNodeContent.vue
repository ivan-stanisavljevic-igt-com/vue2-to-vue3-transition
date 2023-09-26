<template>
  <div>
    <v-container fluid class="bo-node-content">
      <meta-content :metaContentNodes="bonode"></meta-content>
      <headlinesLight v-if="isRootSportsNavigation || (!isRootSportsNavigation && !mobileBigAndBelow) || (!isRootSportsNavigation && mobileBigAndBelow && !secondaryBanners)" category="BettingHeadlines"  :tiles="headlineTiles"></headlinesLight>
      <div v-if="brandLayout === 'generic' && secondaryBanners && mobileBigAndBelow && (currentBoNavigationHeadlines && currentBoNavigationHeadlines.length > 0)" class="secondary_banners" :class="{'notOnHome': !isRootSportsNavigation}">
        <headlinesLight category="SidebarBanners" ></headlinesLight>
      </div>
      <bo-navigation v-show="bonode && bonode.idfwbonavigation" class="child-navigation" :preselect-first-node="true" astabs="true"></bo-navigation>
      <div v-if="!isInPlayBoNode" class="prematch-content">
        <div class="tab-coupons" :class="{'transparent-bkg': xtremepushInlineContent}">
          <div v-for="tabCoupon in tabCouponNodes" :key="tabCoupon.idfwbonavigation">
            <tab-coupon :tabcouponnode="tabCoupon"></tab-coupon>
          </div>
        </div>
        <div class="marketgroups" v-if="marketgroups && marketgroups.length > 0">
          <div v-if="isOddsBoost">
            <odds-boost-market-group v-for="(mg, index) in marketgroups"
                                     :key="mg.idfwmarketgroup"
                                     :idfwmarketgroup="mg.idfwmarketgroup"
                                     :events-grouping="bonode.displaytemplatename"
                                     :maxevents="bonode.maxitems || 0"
                                     :show-marketgroup-name="false"
                                     :counter="index"
                                     :hideliveevents="bonode.overlay"
                                     :isOddsBoost="true">
            </odds-boost-market-group>
          </div>
          <div v-else>
            <market-group v-for="(mg, index) in marketgroups"
                          :key="mg.idfwmarketgroup"
                          :idfwmarketgroup="mg.idfwmarketgroup"
                          :events-grouping="bonode.displaytemplatename"
                          :counter="index"
                          :maxevents="bonode.maxitems || 0"></market-group>
          </div>
        </div>
        <!--div class="marketgroups" v-else>{{ $t('Sports.NoAvailableEvents') }}</div-->
      </div>
      <div v-if="isInPlayBoNode">
        <xtremepush-inline-content v-if="(xtremepushWebInitialized || xtremePushEnabledMobile) && xtremepushOnSiteEnabled && xtremepushInlineContent" :sportType="currentBoNavigation ? currentBoNavigation.name : false" :section="'under_coupon_tabs'"></xtremepush-inline-content>
        <live-coupon :ontab="true" :idfosporttypescsv="bonode.csvparameters || 'ALL'" :maxeventspersporttype="bonode.maxitems" :couponname="bonode.name"></live-coupon>
      </div>
    </v-container>
  </div>

</template>
<script>
  import store from '@/store'
  import MetaContent from '@/components/sports/bettingoffer/metaContent'
  import headlinesLight from '@/components/sports/bettingoffer/headlinesLight'
  import headlines from '@/components/sports/bettingoffer/headlines'
  import tabCoupon from '@/components/sports/bettingoffer/tabCoupon'
  import marketGroup from '@/components/sports/bettingoffer/marketGroup'
  import liveCoupon from '@/components/sports/bettingoffer/live/LiveCoupon'
  import BoNavigation from '@/components/sports/bettingoffer/BoNavigation'
  import BettingOffer from '@/components/mixins/BettingOffer'
  import Branding from '@/components/mixins/Branding'
  import oddsBoostMarketGroup from '@/components/sports/bettingoffer/oddsBoost/oddsBoostMarketGroup'
  import XtremepushInlineContent from '@/components/layout/parts/XtremepusInlineContent'
  import config from '@/config'

  export default {
    name: 'bo-node-content',

    props: [
      'bonode'
    ],

    mixins: [
      BettingOffer,
      Branding
    ],

    components: {
      MetaContent,
      headlinesLight,
      tabCoupon,
      marketGroup,
      liveCoupon,
      BoNavigation,
      headlines,
      oddsBoostMarketGroup,
      XtremepushInlineContent
    },

    computed: {
      isInPlayBoNode () {
        return this.checkIsNodeNavigationType(this.bonode, 'INPLAYPERSPORTTYPE')
      },
      tabCouponNodes () {
        if (this.bonode && this.bonode.bonavigationnodes) {
          var tabCouponsAll = this.bonode.bonavigationnodes.filter(item => this.checkIsNodeNavigationType(item, 'TABCONTAINER'))
          return tabCouponsAll.filter(tabCoupon => !tabCoupon.hide || (
            tabCoupon.bonavigationnodes.filter(tab => this.checkIsNodeNavigationType(tab, 'TAB') && ((tab.hide && tab.numactivefwmarketgroups > 0) || !tab.hide)).length > 0
          ))
        }
      },
      marketgroups () {
        if (this.bonode && this.bonode.marketgroups) {
          return this.bonode.marketgroups
        } else {
          return []
        }
      },
      isOddsBoost () {
        return this.bonode && this.bonode.idfwbonavigationtypes && this.bonode.idfwbonavigationtypes.includes('ODDSBOOST')
      },
      headlineTiles () {
        return window.ctsautoconf.HEADLINES_TILES || false
      },
      secondaryBanners () {
        return window.ctsautoconf.SECONDARY_BANNERS || false
      },
      isRootSportsNavigation () {
        return this.$route.name === 'sports'
      },
      headlines () {
        return store.getters['bonavigationState/boNavigationHeadlines']
      },
      currentBoNavigationHeadlines () {
        return this.headlines && this.headlines.filter(hl => hl.categoryname === 'SidebarBanners')
      },
      xtremepushWebInitialized () {
        return store.getters['getXtremepushWebInitialized']
      },
      xtremepushOnSiteEnabled () {
        return config.app.autoconf.XTREMEPUSH_ANALYTICS && config.app.autoconf.XTREMEPUSH_ANALYTICS.CHANNEL && config.app.autoconf.XTREMEPUSH_ANALYTICS.CHANNEL.ON_SITE
      },
      xtremePushEnabledMobile () {
        return config.app.autoconf.XTREMEPUSH_ANALYTICS && config.app.autoconf.XTREMEPUSH_ANALYTICS.MOBILE_APP // for mobile apps only
      },
      xtremepushInlineContent () {
        return store.getters['getXtremepushInlineContent']
      },
      bonavigation1 () {
        return (this.idfwbonavigation1 && this.boNavigation && this.boNavigation[this.idfwbonavigation1]) || undefined
      },
      bonavigation2 () {
        return (this.idfwbonavigation2 && this.boNavigation && this.boNavigation[this.idfwbonavigation2]) || undefined
      },
      currentBoNavigation () {
        if (this.bonavigation1 && this.bonavigation1.idfwbonavigationtypes && this.bonavigation1.idfwbonavigationtypes.filter(bonavtype => bonavtype === 'MAIN').length > 0) {
          return this.bonavigation1 || undefined
        } else {
          return this.bonavigation2 || undefined
        }
      }
    },

    methods: {

    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped>
@import "~@/css/config"

.tab-coupons.transparent-bkg
  background transparent !important
.secondary_banners
  padding 2px 5px 5px 5px
  height 77px
  background #fcfcfc
  overflow hidden
  @media only screen and (max-width: 390px)
    height 73px
  @media only screen and (max-width: 380px)
    height 70px
  @media only screen and (max-width: 360px)
    height 67px
  @media only screen and (max-width: 340px)
    height 64px
  @media only screen and (max-width: 330px)
    height 60px
  @media only screen and (min-width: 420px)
    height 80px
  @media only screen and (min-width: 450px)
    height 85px
  @media only screen and (min-width: 490px)
    height 90px
  @media only screen and (min-width: 520px)
    height 95px
  @media only screen and (min-width: 540px)
    height 100px
  @media only screen and (min-width: 570px)
    height 105px
  @media only screen and (min-width: 600px)
    height 110px
  @media only screen and (min-width: 630px)
    height 115px
  @media only screen and (min-width: 650px)
    height 120px
  @media only screen and (min-width: 680px)
    height 125px
  @media only screen and (min-width: 730px)
    height 135px
  @media only screen and (min-width: 770px)
    height 140px
  @media only screen and (min-width: 800px)
    height 145px
  @media only screen and (min-width: 830px)
    height 150px
  &.notOnHome
    background #1b2c56
    padding 0 5px 5px 5px
    >>>.headlines
      background #1b2c56
  >>>.headlines-container
    max-height 70px
    @media only screen and (min-width: 420px)
      max-height 90px
    .jumbotron
      max-height 70px
    .headlines .headline-big
    .headline-big .carousel .jumbotron__wrapper
      min-height 70px
      height auto
  >>>.headlines .headline-big .carousel .jumbotron__wrapper
    max-width 830px
    margin auto
</style>
