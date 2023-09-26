<template>
  <div class="page-content my-events-page">
    <div>
      <div class="my-events-page-header">
        <icon name="icon-wifi"></icon>
        <h1>{{ $t('Favorites.MyEvents') }}</h1>
        <a @click.stop="goToEventSettings()">
          <icon name="icon-acc-settings"></icon>
        </a>
      </div>
      <template>
        <div class="my-events-page-content marketgroup">
          <v-tabs class="favorite-tabs" fixed-tabs align-with-title>
            <v-tab v-if="favTabs && favTabs.length > 1" :class="{'active': selectedTab === 'all'}" @click.stop="selectTab('all')">{{ $t('Favorites.MyEvents.Tabs.All') }}</v-tab>
            <v-tab v-if="favTabs && favTabs.includes('PlayerFavorites')" :class="{'active': selectedTab === 'playerFavorites'}" @click.stop="selectTab('playerFavorites')">{{ $t('Favorites.MyEvents.Tabs.Favorites') }}</v-tab>
            <v-tab v-if="favTabs && favTabs.includes('FrequentlyPlayed')" :class="{'active': selectedTab === 'frequentlyPlayed'}" @click.stop="selectTab('frequentlyPlayed')">{{ $t('Favorites.MyEvents.Tabs.FrequentlyPlayed') }}</v-tab>
            <!-- <v-tab :class="{'active': selectedTab === 'suggested'}" @click.stop="selectTab('suggested')">{{ $t('Favorites.MyEvents.Tabs.Suggested') }}</v-tab> -->
          </v-tabs>
          <template v-if="!favEventsLoaded">
            <div class="loading">
              <dots-loader></dots-loader>
            </div>
          </template>
          <template v-if="favEventsLoaded">
            <div class="events" v-if="!favEventsProcessed || favEventsProcessed.length === 0">
              <div class="no_events"><h1>{{ $t('Favorites.MyEvents.NoEvents') }}</h1></div>
            </div>
            <div class="events" v-if="favEventsProcessed && favEventsProcessed.length > 0">
              <div v-for="(item, $index) in availableSportTypes" :key="$index">
                <big3-markets-header :coupontitle="item"
                  :idfosporttype="item"
                  :is-big3-coupon="isBig3Coupon(favEventsProcessed.filter(ev => ev.idfosporttype === item))"
                  :has-draw="hasDraw(favEventsProcessed.filter(ev => ev.idfosporttype === item))"
                  :max-no-of-markets="maxNumberOfMarkets(favEventsProcessed.filter(ev => ev.idfosporttype === item))"
                  :max-no-of-selections="maxNumberOfSelections(favEventsProcessed.filter(ev => ev.idfosporttype === item))"
                  :isoutright="false"></big3-markets-header>

                <div :class="['event', {'last': $index === favEventsProcessed.filter(ev => ev.idfosporttype === item).length - 1}, {'first': $index === 0}, {'big-three-one-selection-per-event': isBig3Coupon(favEventsProcessed.filter(ev => ev.idfosporttype === item)) && maxNumberOfMarkets(favEventsProcessed.filter(ev => ev.idfosporttype === item)) === 1}]" 
                  v-for="(event, $index) in favEventsProcessed.filter(ev => ev.idfosporttype === item)" :key="$index">
                  <template v-if="event.liveEvent">
                    <v-flex class="wrapper" >
                      <live-event-info
                        :event="liveEvents.find(liveEvent => liveEvent.idfoevent === event.idfoevent)"
                        :page="'coupon'"
                        :couponname="item">
                      </live-event-info>
                      <markets v-if="event.markets"
                        :markets="event.markets"
                        :event="event"
                        maxnumofmarkets="3"
                        :iscoupondisplay="true"
                        :pricechangehighlight="true"
                        :diplayOnPage="'marketGroup'"
                        :couponname="item">
                      </markets>
                      <div v-if="!event.markets" class="nomarkets">{{ $t('Sports.NoAvailableMarkets') }}</div>
                    </v-flex>
                    <live-coupon-event-footer :event="event.liveEvent" ></live-coupon-event-footer>
                  </template>
                  <template v-if="!event.liveEvent">
                    <coupon-event v-if="event.idfosporttype === item"
                      :event="event"
                      :twoselections="!isBig3Coupon(favEventsProcessed.filter(ev => ev.idfosporttype === item)) && !hasDraw(favEventsProcessed.filter(ev => ev.idfosporttype === item))"
                      :threeselections="!isBig3Coupon(favEventsProcessed.filter(ev => ev.idfosporttype === item)) && hasDraw(favEventsProcessed.filter(ev => ev.idfosporttype === item))"
                      :isbig3coupon="isBig3Coupon(favEventsProcessed.filter(ev => ev.idfosporttype === item))"
                      :couponname="favEventsProcessed.filter(ev => ev.idfosporttype === item)[0].fosporttypename"></coupon-event>
                  </template>
                </div>
              </div>
            </div>
          </template>
        </div>
      </template>
    </div>
  </div>
</template>

<script>

import store from '@/store'
import Vue from 'vue'
import config from '@/config'
import router from '@/router'
import dotsLoader from '@/components/common/DotsLoader'
import Icon from '@/components/common/Icon'

import BettingOffer from '@/components/mixins/BettingOffer'
import LiveEventInfo from '@/components/sports/bettingoffer/live/liveEventInfo'
import markets from '@/components/sports/bettingoffer/markets'
import LiveCouponEventFooter from '@/components/sports/bettingoffer/live/liveCouponEventFooter'
import big3MarketsHeader from '@/components/sports/bettingoffer/big3MarketsHeader'
import couponEvent from '@/components/sports/bettingoffer/couponEvent'

export default {
  components: {
    dotsLoader,
    Icon,
    LiveEventInfo,
    markets,
    LiveCouponEventFooter,
    big3MarketsHeader,
    couponEvent
  },

  mixins: [
    BettingOffer
  ],

  data () {
    return {
      periodicalUpdateTimeout: undefined,
      periodicalUpdateInterval: config.app.udpateIntervals.marketGroupPeriodicalUpdateInterval,
      isPeriodicalUpdateStarted: false,
      selectedTab: ''
    }
  },

  computed: {
    myEvents () {
      var results = store.getters['favEvents/getMyEvents'] || []
      return results
    },
    myEventsIds () {
      var results = (this.myEvents && this.myEvents.sporttypes) || []
      var arrayOfIds = []
      results.forEach(sporttype => {
        if (sporttype.competitions) {
          sporttype.competitions.forEach(competition => {
            if (competition.events) {
              var eventids = []
              competition.events.forEach(event => {
                eventids.push(event.idfoevent)
              })
            }
            arrayOfIds.push(eventids.slice(0, 20))
          })
        }
      })
      return arrayOfIds
    },
    favEvents () {
      var results = store.getters['favEvents/getFavEvents'] || []
      return results
    },
    favEventsProcessed () {
      var results = (this.favEvents && this.favEvents.events) || []
      var self = this
      let liveEvents = []
      results.forEach(event => {
        event.liveEvent = self.liveEvents.find(liveEvent => liveEvent.idfoevent === event.idfoevent)
        if (event.liveEvent) {
          liveEvents.push(event.liveEvent)
        }
      })
      return Vue._.orderBy(results, ['internalorder', 'tsstart', 'participantname_away'])
    },
    availableSportTypes () {
      var sports = []
      if (this.favEvents && this.favEvents.events && this.favEvents.events.length > 0) {
        this.favEvents.events.forEach((ev) => {
          if (!sports.includes(ev.idfosporttype)) {
            sports.push(ev.idfosporttype)
          }
        })
      }
      return sports
    },
    favEventsLoaded () {
      return store.getters['favEvents/getFavEventsLoaded']
    },
    favTabs () {
      return window.ctsautoconf.PLAYER_FAVORITES_TABS || ['PlayerFavorites', 'FrequentlyPlayed']
    }
  },

  methods: {
    getAllEvents (data) {
      store.dispatch('favEvents/fetchMyEvents', data)
    },
    goToEventSettings () {
      if (router.currentRoute.path !== '/account/my-events-settings') {
        router.push({ path: '/account/my-events-settings' })
      } else return false
    },
    startMyEventsUpdate () {
      this.isPeriodicalUpdateStarted = true
      if (this.myEventsIds && this.myEventsIds.length > 0) {
        store.dispatch('favEvents/fetchFavEvents', this.myEventsIds).then(() => {
          clearTimeout(this.periodicalUpdateTimeout)
          this.periodicalUpdateTimeout = setTimeout(() => {
            if (this.isPeriodicalUpdateStarted) {
              this.startMyEventsUpdate()
            }
          }, this.periodicalUpdateInterval)
        })
      } else {
        store.commit('favEvents/setFavEvents', undefined)
      }
    },
    stopMyEventsUpdate () {
      this.isPeriodicalUpdateStarted = false
      clearTimeout(this.periodicalUpdateTimeout)
    },
    isBig3Coupon (events) {
      var markets = []
      if (events.filter(ev => config.app.autoconf.BIG3_IGNORE_SPORTTYPES.includes(ev.idfosporttype)).length > 0) {
        return false
      }
      events.forEach(ev => {
        if (ev.markets && ev.markets.length > 0) {
          ev.markets.forEach(mk => {
            markets.push(mk)
          })
        }
      })
      return markets.length > 0 && markets.filter(mk => !mk.big3markettype).length === 0
    },
    hasDraw (arrayOfEvents) {
      let hasDraw = false
      // Do not draw HOME/TIE/AWAY in big3-market-header for Golf
      if (['GOLF', 'MOTORSPORT', 'NASCAR'].indexOf(arrayOfEvents[0].idfosporttype) > -1) {
        return false
      }
      if (arrayOfEvents) {
        arrayOfEvents.forEach(event => {
          if (event.markets && event.markets.filter(market => market.selections && market.selections.filter(sel => sel.hadvalue === 'D').length > 0).length > 0) {
            hasDraw = true
          }
        })
      }
      return hasDraw
    },
    maxNumberOfSelections (liveEvent) {
      let noOfSelections = 0
      if (liveEvent) {
        if (liveEvent.markets) {
          liveEvent.markets.forEach(market => {
            if (market.selections && market.selections.length) {
              if (market.selections.length > noOfSelections) {
                noOfSelections = market.selections.length
              }
            }
          })
        }
      }
      return noOfSelections
    },
    maxNumberOfMarkets (arrayOfEvents) {
      let noOfMarkets = 0
      if (arrayOfEvents) {
        arrayOfEvents.forEach(event => {
          if (event.markets && event.markets.length) {
            if (event.markets.length > noOfMarkets) {
              noOfMarkets = event.markets.length
            }
          }
        })
      }
      return noOfMarkets
    },
    getIDFOSportType (event) {
      return (event && event.markets && event.markets[0] && event.markets[0].idfosporttype) || undefined
    },
    selectTab (tab) {
      this.selectedTab = tab
      store.commit('favEvents/setFavEventsLoaded', false)
      store.commit('favEvents/setFavEvents', undefined)
      if (this.selectedTab === 'frequentlyPlayed') {
        this.getAllEvents({'excludesources': 'C'})
      }
      if (this.selectedTab === 'playerFavorites') {
        this.getAllEvents({'excludesources': 'S'})
      }
      if (this.selectedTab === 'all') {
        this.getAllEvents()
      }
    }
  },
  mounted () {
    if (this.favTabs && this.favTabs.length > 1) {
      this.selectTab('all')
    } else {
      if (this.favTabs && this.favTabs.includes('PlayerFavorites')) {
        this.selectTab('playerFavorites')
      } else if (this.favTabs && this.favTabs.includes('FrequentlyPlayed')) {
        this.selectTab('frequentlyPlayed')
      }
    }
  },
  watch: {
    myEventsIds () {
      this.startMyEventsUpdate()
    }
  },
  destroyed () {
    this.stopMyEventsUpdate()
  }
}
</script>

<style scoped lang="stylus">
@import '~@/css/config'
@import '~@/css/mixins'

.my-events-page-content
  .favorite-tabs
    background #f2f2f2
    margin: -20px -20px 0 -20px
    >>>.v-tabs__container
      height 46px
    >>>.v-tabs__div
      a
        text-transform none !important
        color #003764 !important
        font-family: 'Open Sans SemiBold' !important
        line-height: 14px
    >>>.v-tabs__div.active
      background #fff !important
    >>>.v-tabs__bar
      margin 0 0 10px 0

.my-events-page
  background #fff
  margin-right 5px
  .no_events
    text-align center
    padding-top 40px
    padding-bottom 40px
  .loading
    padding 50px 0
    >>>.dots-loader
      display flex
      justify-content: center
      box-shadow none
  @media mobile-big-and-below
    margin-right 0
  .my-events-page-header
    padding: 20px
    margin-bottom: 0
    background: #003764
    margin-bottom: 0 !important
    position relative
    h1  
      color #fff
      text-align: center
      line-height: normal !important
      font-size: 26px !important
      margin 0
    .font-icon-wifi
      color #fff
    >>>.icon-acc-settings
    >>>.font-icon-acc-settings
      background-image url("~@/assets/images/favorites/settings-white.svg") 
      height: 35px !important
      width: 35px !important
      position absolute
      right 20px
      top 22px
      @media mobile-big-and-below
        right 10px
  .my-events-page-content
    padding 20px
    .events
      .wrapper
        display flex
        justify-content flex-start
        margin 0px
        align-items center
        height auto

</style>
