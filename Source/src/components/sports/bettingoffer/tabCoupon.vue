<template>
  <div :idfwbonavigation="tabcouponnode.idfwbonavigation.toString()">
    <v-container fluid class="tab-coupon" :class="{'transparent-bkg': xtremepushInlineContent}">
      <v-layout row class="v-tabs-wrapper clearfix" :class="{'tabs_home' : currentidfwbonavigation === 'top'}">
        <!--Tabs for current id fw bonavigation -->
        <v-flex xs12>
          <v-tabs fixed-tabs :centered="centered" v-if="currentidfwbonavigation === 'top'">

            <v-tab :class="['tab', {'active': tab.idfwbonavigation === selectedTab.idfwbonavigation},{'tabLive' : tab.idfwbonavigationtypes.includes('INPLAYPERSPORTTYPE')}]"
                  v-for="(tab, index) in tabs"
                  :key="index"
                  @click.stop="selectTab(tab.idfwbonavigation)"
                  :idfwbonavigation="tab.idfwbonavigation.toString()">{{ tab.name }}</v-tab>
          </v-tabs>
        </v-flex>
        <v-flex xs12 v-if="!isRootSportsNavigation">
          <v-tabs fixed-tabs class="tabs_holder" :class="{'moreThenFive' : tabs.length > 5}" :centered="centered">
            <v-tab :class="['tab', {'active': tab.idfwbonavigation === selectedTab.idfwbonavigation}]"
              v-for="(tab, index) in tabs"
              :key="index"
              @click.stop="selectTab(tab.idfwbonavigation)"
              :idfwbonavigation="tab.idfwbonavigation.toString()">{{ tab.name }}</v-tab>
            </v-tabs>
        </v-flex>
      </v-layout>
      <v-tabs class="sports-filter small" v-if="showSportsFilter" xs12 fixed-tabs align-with-title
                       next-icon="chevron_right"
                       prev-icon="chevron_left"
                       show-arrows>
      <v-tab :class="['sport', 'tab', 'all-sports', {'active': allSportsActive}]"
             v-if="availablePrematchSports.length"
             @click.stop="selectAllSports()">{{ $t('BettingOffer.tabCoupon.allSports') }}</v-tab>
      <v-tab :class="['sport', 'tab', {'active': selectedSports.indexOf(sport.idfosporttype) > -1}]"
             @click.stop="()=>{toggleSport(sport.idfosporttype)}"
             v-for="(sport, index) in availablePrematchSports" :key="index">
        <icon v-if="brandLayout ==='generic' || brandKey === 'sb' || brandKey === 'mav'" :colorName="'black'" :name="'icon-' + sport.idfosporttype.split(' ').join('').toLowerCase()"></icon>
        <template v-if="brandLayout !=='generic' && brandKey !== 'sb' && brandKey !== 'mav'">{{sport.fosporttypename.toLowerCase()}}</template>
      </v-tab>
    </v-tabs>
      <xtremepush-inline-content v-if="(xtremepushWebInitialized || xtremePushEnabledMobile) && xtremepushOnSiteEnabled && xtremepushInlineContent" :sportType="currentBoNavigation ? currentBoNavigation.name : false" :section="'under_coupon_tabs'"></xtremepush-inline-content>
      <div class="tab-content" v-if="!isInPlayBoNode && selectedTab" :idfwbonavigation="selectedTab.idfwbonavigation.toString()">
        <div class="marketgroups" v-if="selectedTabMarketgroups && selectedTabMarketgroups.length > 0">
          <div v-if="isOddsBoost">
            <odds-boost-market-group v-for="(mg, index) in selectedTabMarketgroups"
              :key="mg.idfwmarketgroup"
              :idfwmarketgroup="mg.idfwmarketgroup"
              :events-grouping="selectedTab.displaytemplatename"
              :selected-sports="selectedSports"
              :maxevents="selectedTab.maxitems || 0"
              :all-sports-active="allSportsActive"
              :show-marketgroup-name="false"
              :counter="index"
              :hideliveevents="selectedTab.overlay"
              :isOddsBoost="isOddsBoost">
            </odds-boost-market-group>
          </div>
          <div v-else>
            <market-group v-for="(mg, index) in selectedTabMarketgroups"
              :key="mg.idfwmarketgroup"
              :idfwmarketgroup="mg.idfwmarketgroup"
              :events-grouping="selectedTab.displaytemplatename"
              :selected-sports="selectedSports"
              :maxevents="selectedTab.maxitems || 0"
              :all-sports-active="allSportsActive"
              :show-marketgroup-name="false"
              :counter="index"
              :hideliveevents="selectedTab.overlay"
              :isOddsBoost="isOddsBoost">
            </market-group>
          </div>
        </div>
         <div class="marketgroups" v-if="!(selectedTabMarketgroups && selectedTabMarketgroups.length > 0)">
          <div class="ob_noevents" v-if="isOddsBoost">
            <img v-if="brandKey === 'sb'" :src="mediaServer('/static/brand-img/sb/OddsBoost-noEvents.svg')" alt="noevents"/>
            <h3 v-if="brandKey !== 'sb'">{{ $t('Sports.NoAvailableEvents') }}</h3>
          </div>
          <div class="noevents" v-else>
            <img v-if="brandKey === 'sb'" :src="mediaServer('/static/brand-img/sb/noEvents.svg')" alt="noevents"/>
            <h3 v-if="brandKey !== 'sb'">{{ $t('Sports.NoAvailableEvents') }}</h3>
          </div>
        </div>
        <!--div v-if="!(selectedTabMarketgroups && selectedTabMarketgroups.length > 0)">{{ $t('Sports.NoAvailableEvents') }}</div-->
      </div>

      <div v-if="isInPlayBoNode && selectedTab">
        <live-coupon :ontab="true" :idfosporttypescsv="selectedTab.csvparameters || 'ALL'" :maxeventspersporttype="selectedTab.maxitems" :couponname="selectedTab.name"></live-coupon>
      </div>
    </v-container>
  </div>

</template>
<script>
  import store from '@/store'
  import marketGroup from '@/components/sports/bettingoffer/marketGroup'
  import liveCoupon from '@/components/sports/bettingoffer/live/LiveCoupon'
  import Screen from '@/components/mixins/Screen'
  import Branding from '@/components/mixins/Branding'
  import Url from '@/components/mixins/Url'
  import BettingOffer from '@/components/mixins/BettingOffer'
  import Session from '@/components/mixins/Session'
  import Icon from '@/components/common/Icon'
  import oddsBoostMarketGroup from '@/components/sports/bettingoffer/oddsBoost/oddsBoostMarketGroup'
  import XtremepushInlineContent from '@/components/layout/parts/XtremepusInlineContent'
  import config from '@/config'

  export default {
    name: 'tab-coupon',

    props: [
      'tabcouponnode'
    ],
    mixins: [
      Screen,
      BettingOffer,
      Branding,
      Session,
      Url
    ],

    components: {
      marketGroup,
      liveCoupon,
      Icon,
      oddsBoostMarketGroup,
      XtremepushInlineContent
    },

    data () {
      return {
        selectedTabIdFwBoNavigation: -1,
        selectedSports: [],
        centered: true
      }
    },

    computed: {
      tabs () {
        if (this.tabcouponnode && this.tabcouponnode.bonavigationnodes) {
          return this.tabcouponnode.bonavigationnodes.filter(item => this.checkIsNodeNavigationType(item, 'TAB') && ((item.hide && item.numactivefwmarketgroups > 0) || !item.hide))
        }

        return []
      },
      selectedTab () {
        return this.tabs.filter(item => item.idfwbonavigation === this.selectedTabIdFwBoNavigation)[0] || (this.tabs && this.tabs.length > 0 && this.tabs[0]) || undefined
      },
      selectedTabMarketgroups () {
        if (this.selectedTab && this.selectedTab.marketgroups) {
          return this.selectedTab.marketgroups
        } else {
          return []
        }
      },
      currentidfwbonavigation () {
        return this.idfwbonavigation2 || this.idfwbonavigation1 || 'top'
      },
      isInPlayBoNode () {
        return this.checkIsNodeNavigationType(this.selectedTab, 'INPLAYPERSPORTTYPE')
      },
      marketgroups () {
        return store.getters['marketgroupState/marketgroups']
      },
      availablePrematchSports () {
        if (!this.isInPlayBoNode) {
          var sports = []
          var self = this

          if (self.selectedTab && self.selectedTab.marketgroups) {
            self.selectedTab.marketgroups.forEach((mg) => {
              if (self.marketgroups[mg.idfwmarketgroup] && self.marketgroups[mg.idfwmarketgroup].events) {
                self.marketgroups[mg.idfwmarketgroup].events.forEach((event) => {
                  if (event.idfosporttype && event.fosporttypename) {
                    if (sports.filter(sp => sp.idfosporttype === event.idfosporttype).length === 0) {
                      sports.push({
                        idfosporttype: event.idfosporttype,
                        fosporttypename: event.fosporttypename
                      })
                    }
                  }
                })
              }
            })
          }
          return sports
        } else {
          return []
        }
      },
      isRootSportsNavigation () {
        return this.$route.name === 'sports'
      },
      showFilterBigger () {
        return !this.tabletAndBelow && this.isRootSportsNavigation && this.availablePrematchSports && this.availablePrematchSports.length > 1
      },
      showFilterSmaller () {
        return this.tabletAndBelow && this.isRootSportsNavigation && this.availablePrematchSports && this.availablePrematchSports.length > 1
      },
      showSportsFilter () {
        return this.isRootSportsNavigation && this.availablePrematchSports && this.availablePrematchSports.length > 1
      },
      allSportsActive () {
        return this.selectedSports.length === 0
      },
      isLoggedIn () {
        return store.getters['isLoggedIn']
      },
      isOpenedFromWebView () {
        return store.getters['getIsOpenedFromWebView']
      },
      isOddsBoost () {
        return this.selectedTab && this.selectedTab.idfwbonavigationtypes && this.selectedTab.idfwbonavigationtypes.includes('TAB') && this.selectedTab.idfwbonavigationtypes.includes('ODDSBOOST')// return this.selectedTab && this.selectedTab.name === 'Odds Boost'
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
      selectTab (idfwbonavigation) {
        this.userIsActive()
        this.selectedTabIdFwBoNavigation = idfwbonavigation
        this.selectAllSports()
      },
      toggleSport (sport) {
        this.userIsActive()
        if (this.selectedSports.indexOf(sport) === -1) {
          this.selectedSports.push(sport)
        } else {
          this.selectedSports.splice(this.selectedSports.indexOf(sport), 1)
        }
        this.checkIfAllSportsAreActive()
      },
      selectAllSports () {
        this.selectedSports = []
      },
      checkIfAllSportsAreActive () {
        if (this.selectedSports.length === this.availablePrematchSports.length || this.selectedSports.length === 0) {
          this.selectedSports = []
        }
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped>
@import "~@/css/config";
@import "~@/css/mixins";
@import "~@/css/sportIcons";

@media mobile-big-and-below
  //.tabs_home
  >>>.v-tabs__bar
    box-shadow: none
    background: none
.tabs_holder
  padding 5px 5px 0 5px
  >>>.v-tabs__bar
    margin 0 !important
    .v-tabs__div
      height 35px
      a
        font-size 13px !important
        line-height 13px
  >>>.v-tabs__wrapper
      .v-tabs__container
        height 35px
.container
  .tab-coupons
    .container.tab-coupon
      padding-right: 24px
      @media mobile-big-and-below
        padding-right: 4px
        padding-left: 4px
        background: #dcdfe9
      &.transparent-bkg
        background transparent !important
      .coupon-name
        display: none
      .v-tabs-wrapper
        display: flex
        flex-wrap: wrap
        @media mobile-big-and-below
          expand(4px, horizontal)
        .v-tabs
          flex: 8
          @media mobile-big-and-below
            display:block
            flex: unset
.sports-filter
  background none
  min-height 60px
  .v-tabs__bar
    margin-right 0 !important
    .v-tabs__wrapper
      height 60px
    .icon.v-tabs__icon
      display block !important
      background #ffffff
      width 30px !important
      line-height 60px
  >>>.v-tabs__container
    height auto !important
    .v-tabs__div.sport.tab
      max-width unset !important
      min-width unset !important
      background-color #fff !important
      color #004C97 !important
      border none !important
      display flex
      justify-content center
      align-items center
      font-weight bold
      // padding 0 8px
      margin 12px 2px
      border-radius 25px !important
      height 36px
      a
        color #004C97 !important
        white-space nowrap
        font-size 12px
        font-weight 600
      &.active
        background-color #157cc1 !important
        color #fff !important
        a
          color #fff !important
      >>>.v-tabs__item--active
        color #fff !important
      >>>.igt-icon
        padding-right 5px


.browser-internet-explorer
  .application
    .v-tabs__container
      .sports-filter
        flex: 1.4 !important

.browser-firefox
  .application
    .v-tabs-wrapper
      .holder
        button
          min-width: 87px
.sports-filter
  margin 10px 0
.noevents
  padding-top 40px
  padding-bottom 40px
  background #fff
  display flex
  justify-content center
  height 100%
  position: relative
  h3
    line-height: normal
    font-size: 24px
    text-align: center
    color: #06283b
    opacity: 0.4
  img
    max-width 250px
    @media mobile-big-and-below
      max-width 200px
.ob_noevents
  padding-top 40px
  padding-bottom 40px
  background #fff
  display flex
  justify-content center
  height 100%
  position: relative
  img
    max-width 300px
    @media mobile-big-and-below
      max-width 250px
</style>
