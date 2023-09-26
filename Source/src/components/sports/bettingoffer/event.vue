<template>
  <v-container fluid class="event" v-if="event" :class="[{'pre-match': !liveEvent}, {'live-match': liveEvent}]">
    <div v-if="isLiveEventPage && liveStream" :class="['stream-eventinfo-switcher', { 'stream-active': isLiveStreamVisible }]">
      <span :class="['tab', { active: !isLiveStreamVisible }]" @click.stop="showEventInfo()"><v-icon>info_outline</v-icon>Back to Event Info</span>
      <span :class="['tab', { active: isLiveStreamVisible }]" @click.stop="showLiveStream()"><v-icon>play_arrow</v-icon>Watch Live</span>
    </div>
    <template v-if="!isLiveStreamVisible || !isLiveEventPage || !liveStream">
      <template v-if="bettingDataMatcherinitiallLoad && betRadarId">
        <bet-radar-widget v-if="betRadarWidgetVersion === 'V1'" :betradarid="betRadarId" :isLive="(liveEvent && liveEvent.idfoevent) ? true : false"></bet-radar-widget>
        <bet-radar-widget-v2 v-else :betradarId="betRadarId"></bet-radar-widget-v2>
      </template>
      <!-- not having betRadarId -->
      <template v-else>
        <div class="event_header" :class="'sport-' + event.idfosporttype">
          <div class="competition-live" :class="[{'pre-match': !liveEvent}, {'live-match': liveEvent}]">
            <section class="competition-name"  :class="{'competitionname-betradar-id': betRadarId}"><div>{{ event && event.fosportname || event.sportname }}</div></section>
            <!-- <section class="live-event" v-if="liveEvent"><div>LIVE</div></section> -->
          </div>
          <!-- Live event info -->
          <div class="event-info" v-if="liveEvent">
              <live-event-info :event="liveEvent" page="'event'"></live-event-info>
          </div>

          <!-- Prematch event info -->
          <div class="event-info" v-if="!liveEvent">
            <span class="day" v-if="(brandKey === 'dn' || brandKey === 'dnw' || brandKey === 'circa')">{{ event.tsrealstart | moment(dateFormats.dayAndMonth) }}</span>
            <template v-if="event.participantname_away && event.participantname_home">
              <!--<div class="competition-title">{{ event.sportname || event.fosportname }}3</div>-->

              <section v-if="brandLayout !== 'generic' && brandKey !== 'sb' && brandKey !== 'rw'" class="parent">
                <section class="child child-left">
                  <div v-if="isbig3event" class="team-title">{{ event.participantname_away }} <p v-if="isPitcherVisible" class="smaller">{{ event.awaypitchername | lowercase }}</p></div>
                  <div v-else class="team-title">{{ event.participantname_home }} <p v-if="isPitcherVisible" class="smaller">{{ event.homepitchername | lowercase }}</p></div>
                </section>
                <section class="child child-center">
                  <div>
                    <span class="time">{{ event.tsrealstart | moment(dateFormats.longTime) }}</span>
                    <span class="day" v-if="(brandKey !== 'dn' && brandKey !== 'dnw' && brandKey !== 'circa')">{{ event.tsrealstart | moment(dateFormats.dayAndMonth) }}</span>
                  </div>
                </section>
                <section class="child child-right">
                  <div v-if="isbig3event" class="team-title">{{ event.participantname_home }} <p v-if="isPitcherVisible" class="smaller">{{ event.homepitchername | lowercase}}</p></div>
                  <div v-else class="team-title">{{ event.participantname_away }} <p v-if="isPitcherVisible" class="smaller">{{ event.awaypitchername | lowercase}}</p></div>
                </section>
              </section>

              <section v-if="brandLayout === 'generic' || brandKey === 'sb' || brandKey ==='rw'" class="parent">
                <section v-if="isbig3event" class="child child-left">
                  <div class="team-title">{{ event.participantname_away }} <p v-if="isPitcherVisible" class="smaller">{{ event.awaypitchername | lowercase }}</p></div>
                  <div class="team-title">{{ event.participantname_home }} <p v-if="isPitcherVisible" class="smaller">{{ event.homepitchername | lowercase}}</p></div>
                </section>
                <section v-else class="child child-left">
                  <div class="team-title">{{ event.participantname_home }} <p v-if="isPitcherVisible" class="smaller">{{ event.homepitchername | lowercase}}</p></div>
                  <div class="team-title">{{ event.participantname_away }} <p v-if="isPitcherVisible" class="smaller">{{ event.awaypitchername | lowercase }}</p></div>
                </section>
                <section class="child child-right">
                  <div>
                    <span class="day" v-if="(brandKey !== 'dn' && brandKey !== 'dnw' && brandKey !== 'circa')">{{ event.tsrealstart | moment(dateFormats.dayAndMonthUS) }}</span>
                    <span class="time">{{ event.tsrealstart | moment(dateFormats.longTime) }}</span>
                  </div>
                </section>
              </section>
            </template>
            <h3 v-if="!event.participantname_away || !event.participantname_home">{{ event.name }}</h3>
          </div>
        </div>
      </template>
    </template>
    <div v-if="isLiveStreamVisible && isLiveEventPage && liveStream" class="video-streaming">
      <LiveVideoStreaming v-if="isLiveStreamVisible" :livestream="liveStream"></LiveVideoStreaming>
    </div>
    <!-- <div v-if="1===1" class="video-streaming">
      <LiveVideoStreaming v-if="1===1" :livestream="liveStream"></LiveVideoStreaming>
    </div> -->
    <!-- Show Eventmarketgroups in tabs -->
    <xtremepush-inline-content v-if="(xtremepushWebInitialized || xtremePushEnabledMobile) && xtremepushOnSiteEnabled && xtremepushInlineContent" :sportType="event.idfosporttype" :section="'under_coupon_tabs'"></xtremepush-inline-content>
    <div class="v-tabs-wrapper clearfix" :class="{'betradar-id' :betRadarId}">
      <v-tabs :class="['eventmarketgroups-tab', {'have-bet-radar-id':betRadarId }, {'with_more_btn': eventmarketgroups.length > numberOfTabs}]">
        <v-tab :class="['sport', 'tab', {'active': eventmarketgroup.idfwmarkettypeclassgroup === selectedIDFWMarkettypeclassGroup }]"
               v-for="(eventmarketgroup, index) in eventmarketgroups" :key="eventmarketgroup.idfwmarkettypeclassgroup"
               v-if="(index <= numberOfTabs - 1 && !mobileBigAndBelow) || (index >= 0 && mobileBigAndBelow)"
               @click.stop="selectEMG(eventmarketgroup.idfwmarkettypeclassgroup)">{{ eventmarketgroup.name }}</v-tab>
        <v-menu offset-y max-width="320" min-width="212" :left="true" :bottom="true" origin="center" content-class="menu_top_arrow_right"
          v-if="(eventmarketgroups.length > numberOfTabs) && !mobileBigAndBelow"
          class="v-tabs__div"
        >
          <a v-if="!mobileBigAndBelow" slot="activator" class="more_tabs" :class="moreButtonState">
            <span>{{ $t('More') }}</span>
            <v-icon v-if="moreButtonState">expand_less</v-icon>
            <v-icon v-else>expand_more</v-icon>
          </a>
          <v-list>
            <v-list-tile
              v-for="(eventmarketgroup, index) in eventmarketgroups"
              v-if="index > numberOfTabs - 1"
              :key="index"
              :class="['sporttab-li', {'active': eventmarketgroup.idfwmarkettypeclassgroup === selectedIDFWMarkettypeclassGroup }]"
              @click.stop="selectEMG(eventmarketgroup.idfwmarkettypeclassgroup)"
            >
              <span class="list_title">{{ eventmarketgroup.name }}</span><icon name="icon-tick" colorName="blue"></icon>
            </v-list-tile>
          </v-list>
        </v-menu>
      </v-tabs>
    </div>
    <div class="eventmarketgroup marketgroup" :class="{'betradar-id' :betRadarId}" v-if="selectedEventMarketGroup" :key="selectedEventMarketGroup.idfwmarkettypeclassgroup">
      <template v-if="displayAllGamePeriodsAsBig3">
        <markets :markets="gamePeriodMarkets" v-if="filteredBig3MarketsPerPeriod" v-for="(gamePeriodMarkets, key) in filteredBig3MarketsPerPeriod" :key="key"
                 :event="event"
                 :diplayOnPage="'live-single-event'"
                 :isLiveEventPage="isLiveEventPage"
                 :pricechangehighlight="isLiveEventPage"></markets>
      </template>
      <template v-else>
        <markets :markets="filteredBig3MarketsWholeGame" v-if="filteredBig3MarketsWholeGame"
                 :event="event"
                 :diplayOnPage="'live-single-event'"
                 :isLiveEventPage="isLiveEventPage"
                 :pricechangehighlight="isLiveEventPage"></markets>
      </template>

      <div :class="['event-market-header', {'last': index === filteredNonBig3Markets.length - 1}, {'available-for-bb': isBBenabled && market.BB} ]" v-for="(market, index) in filteredNonBig3Markets" :key="index">
        <div class="market-name" :class="[{'expanded-market': expandedMarkets[selectedEventMarketGroup.idfwmarkettypeclassgroup + '-' + market.idfomarket]  && index !== 0 || expandedMarkets[selectedEventMarketGroup.idfwmarkettypeclassgroup + '-' + market.idfomarket] !== false && index === 0}]" @click.stop="toggleExpandMarket(selectedEventMarketGroup.idfwmarkettypeclassgroup + '-' + market.idfomarket, index, market.idfomarket)">
          <h4 class="market-name-title">{{ market.name}}</h4>

          <span class="flex icon-span">
            <sgp-tag :markets="[market]" :isLive="isLiveEventPage"></sgp-tag>
            <span v-if="isBBenabled && market.BB" class="available-for-bb"></span>
            <v-icon v-if="!expandedMarkets[selectedEventMarketGroup.idfwmarkettypeclassgroup + '-' + market.idfomarket] && index !== 0">expand_more</v-icon>
            <v-icon v-if="expandedMarkets[selectedEventMarketGroup.idfwmarkettypeclassgroup + '-' + market.idfomarket]  && index !== 0">expand_less</v-icon>
            <v-icon v-if="expandedMarkets[selectedEventMarketGroup.idfwmarkettypeclassgroup + '-' + market.idfomarket] !== false && index === 0">expand_less</v-icon>
            <v-icon v-if="expandedMarkets[selectedEventMarketGroup.idfwmarkettypeclassgroup + '-' + market.idfomarket] === false && index === 0">expand_more</v-icon>
            </span>
        </div>
        <markets :markets="[market]" v-if="(index === 0 && expandedMarkets[selectedEventMarketGroup.idfwmarkettypeclassgroup + '-' + market.idfomarket] !== false) ||
          expandedMarkets[selectedEventMarketGroup.idfwmarkettypeclassgroup + '-' + market.idfomarket]"
          :event="event"
          :diplayOnPage="'live-single-event'"
          :isLiveEventPage="isLiveEventPage"
          :pricechangehighlight="isLiveEventPage"></markets>
      </div>
    </div>
  </v-container>
</template>
<script>
  import Vue from 'vue'
  import axios from 'axios'
  import store from '@/store'
  import lib from '@/library'
  import config from '@/config'

  import markets from '@/components/sports/bettingoffer/markets'
  import betRadarWidget from '@/components/sports/bettingoffer/betRadarWidget'
  import BetRadarWidgetV2 from '@/components/sports/bettingoffer/betRadarWidgetv2'
  import LiveVideoStreaming from '@/components/sports/bettingoffer/live/LiveVideoStreaming'
  import LiveEventInfo from '@/components/sports/bettingoffer/live/liveEventInfo'
  import sgpTag from '@/components/sports/betslipV2/common/marketSgpTag'
  import XtremepushInlineContent from '@/components/layout/parts/XtremepusInlineContent'

  import BettingOffer from '@/components/mixins/BettingOffer'
  import Screen from '@/components/mixins/Screen'
  import Branding from '@/components/mixins/Branding'
  import Icon from '@/components/common/Icon'

  export default {
    name: 'event',

    components: {
      markets,
      LiveEventInfo,
      betRadarWidget,
      Icon,
      LiveVideoStreaming,
      BetRadarWidgetV2,
      sgpTag,
      XtremepushInlineContent
    },

    mixins: [
      BettingOffer,
      Branding,
      Screen
    ],

    data () {
      return {
        periodicalUpdateTimeout: undefined,
        prematchPeriodicalUpdateInterval: config.app.udpateIntervals.prematchPeriodicalUpdateInterval,
        livePeriodicalUpdateInterval: config.app.udpateIntervals.livePeriodicalUpdateInterval,
        isPeriodicalUpdateStarted: false,
        selectedIDFWMarkettypeclassGroup: 0,
        collapsed: true,
        expandedMarkets: {},
        isLiveStreamVisible: false,
        isbig3event: false,
        betradarIdFromBettingDataMatcher: null,
        bettingDataMatcherinitiallLoad: false
      }
    },

    metaInfo () {
      return {
        title: this.metaTitle,
        meta: [{
          description: this.metaDescription,
          keywords: this.metaKeywords
        }]
      }
    },

    computed: {
      isBBenabled () {
        return config.app.autoconf.IS_BUYBACK_ENABLED
      },
      metaTitle () {
        if (this.event && this.event.name) {
          return `${this.event.name} - ${this.$t('Page.Meta.Title')}`
        } else {
          return this.$t('Page.Meta.Title')
        }
      },
      metaDescription () {
        return this.$t('Page.Meta.Description')
      },
      metaKeywords () {
        return this.$t('Page.Meta.Keywords')
      },
      idfoevent () {
        var idfoevent = this.$route.params.idfoevent && this.$route.params.idfoevent.toString()
        if (idfoevent && idfoevent.indexOf('.') === -1) {
          idfoevent += '.1'
        }

        return idfoevent
      },
      isBetradarWidgetEnabledForEvent () {
        return window.ctsautoconf.BR_WIDGET_ENABLED && window.ctsautoconf.BR_WIDGET_CLIENTID &&
          (window.ctsautoconf.BR_WIDGET_SPORTS.length === 0 || window.ctsautoconf.BR_WIDGET_SPORTS.indexOf(this.event.idfosporttype) > -1)
      },
      betRadarId () {
        // return 23916139
        if (this.isBetradarWidgetEnabledForEvent) {
          // If there is data from betting data matcher service use it
          if (this.betradarIdFromBettingDataMatcher) return this.betradarIdFromBettingDataMatcher

          if (this.event && this.event.idefevent) {
            let provider = this.event.idefevent.split('|')[0]
            if (provider && provider.indexOf('BETRADAR') > -1) {
              let rawBetradarid = this.event.idefevent.split('|')[1]
              if (rawBetradarid) {
                return rawBetradarid.indexOf('_') > -1 ? rawBetradarid.split('_')[1] : rawBetradarid
              }
            } else {
              return (this.event && this.event.origin) || undefined
            }
          } else {
            return (this.event && this.event.origin) || undefined
          }
        }
      },
      event () {
        return store.getters['eventState/getEvent']
      },
      liveEvent () {
        var self = this
        return this.liveEvents.find(ev => ev.idfoevent.toString() === self.idfoevent.toString() || (ev.foeventantepost && ev.foeventantepost.toString() === self.idfoevent.toString()))
      },
      eventmarketgroups () {
        if (this.event.eventmarketgroups) {
          var eventmarketgroups = Vue._.orderBy(this.event.eventmarketgroups, 'internalorder', 'asc')

          if (!this.selectedIDFWMarkettypeclassGroup && eventmarketgroups.length > 0) {
            this.selectedIDFWMarkettypeclassGroup = eventmarketgroups[0].idfwmarkettypeclassgroup
          }
          return eventmarketgroups
        } else {
          return []
        }
      },
      selectedEventMarketGroup () {
        if (this.eventmarketgroups) {
          return this.eventmarketgroups.find(emg => emg.idfwmarkettypeclassgroup === this.selectedIDFWMarkettypeclassGroup)
        }

        return []
      },
      filteredBig3MarketsWholeGame () {
        return (this.selectedEventMarketGroup &&
                  this.selectedEventMarketGroup.markets &&
                  this.selectedEventMarketGroup.markets[0] &&
                  config.app.autoconf.BIG3_IGNORE_SPORTTYPES.indexOf(this.selectedEventMarketGroup.markets[0].idfosporttype) === -1 &&
                  this.selectedEventMarketGroup.markets.filter(mk => mk.big3markettype && mk.gameperiod === '1+' && mk.selections && mk.selections.length <= 2)) || []
      },
      filteredBig3MarketsPerPeriod () {
        var markets = (this.selectedEventMarketGroup &&
          this.selectedEventMarketGroup.markets &&
          this.selectedEventMarketGroup.markets[0] &&
          config.app.autoconf.BIG3_IGNORE_SPORTTYPES.indexOf(this.selectedEventMarketGroup.markets[0].idfosporttype) === -1 &&
          this.selectedEventMarketGroup.markets.filter(mk => mk.big3markettype && mk.selections && mk.selections.length <= 2)) || []

        var marketsPerPeriod = Vue._.groupBy(markets, 'gameperiodname')
        return marketsPerPeriod
      },
      filteredNonBig3Markets () {
        var big3Markets = []
        if (this.displayAllGamePeriodsAsBig3) {
          for (let key in this.filteredBig3MarketsPerPeriod) {
            if (this.filteredBig3MarketsPerPeriod[key] && this.filteredBig3MarketsPerPeriod[key].length > 0) {
              big3Markets = big3Markets.concat(this.filteredBig3MarketsPerPeriod[key])
            }
          }
        } else {
          big3Markets = this.filteredBig3MarketsWholeGame
        }

        return this.selectedEventMarketGroup &&
                  this.selectedEventMarketGroup.markets &&
                  this.selectedEventMarketGroup.markets.filter(mk => !big3Markets || big3Markets.length === 0 || big3Markets.filter(b3mk => b3mk.idfomarket === mk.idfomarket).length === 0)
      },
      isLiveEventPage () {
        return this.liveEvent !== undefined
      },
      moreButtonState () {
        var linksInMoreTab = []
        for (var i = 0; i < this.eventmarketgroups.length; i++) {
          if (i > 4 && (this.selectedIDFWMarkettypeclassGroup === this.eventmarketgroups[i].idfwmarkettypeclassgroup)) {
            linksInMoreTab.push(i)
          }
        }
        if (linksInMoreTab.length > 0) {
          return 'active'
        }
      },
      liveStreams () {
        return store.getters['livebettingState/liveStreams']
      },
      liveStream () {
        return this.liveStreams && this.liveStreams.find(ls => ls.idfoevent === this.event.idfoevent)
      },
      isLoggedIn () {
        return store.getters['isLoggedIn']
      },
      isPitcherVisible () {
        return !config.app.autoconf.HIDE_PITCHER_NAME
      },
      displayAllGamePeriodsAsBig3 () {
        return config.app.autoconf.DISPLAY_ALL_GAMEPERIODS_AS_BIG3
      },
      liveWireLiveEventsSubscribeCounter () {
        return store.getters['livebettingState/getLiveWireLiveEventsSubscribeCounter']
      },
      betRadarWidgetVersion () {
        return window.ctsautoconf.BR_WIDGET_VERSION || 'V2'
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
      }
    },

    methods: {
      isBig3 () {
        let isNonBig3FoSportType = config.app.autoconf.BIG3_IGNORE_SPORTTYPES.includes(this.event.idfosporttype)
        if (!isNonBig3FoSportType) {
          let breakLoop = false
          this.eventmarketgroups.forEach(marketgroup => {
            if (breakLoop) return false
            // console.log('first loop')
            marketgroup.markets.forEach(market => {
              if (breakLoop) return false
              // console.log(market, 'market')
              if (market.big3markettype && (market.gameperiod === '1+' || this.displayAllGamePeriodsAsBig3)) {
                // console.log(market.gameperiod + ' ' + market.big3markettype)
                this.isbig3event = true
                breakLoop = true
              }
            })
          })
        }
      },
      toggleExpandMarket (id, index, idfomarket) {
        if (index === 0 && this.expandedMarkets[id] === undefined) {
          Vue.set(this.expandedMarkets, id, false)
        } else {
          Vue.set(this.expandedMarkets, id, !this.expandedMarkets[id])
        }
      },
      startEventByIdUpdate (idfoevent) {
        this.isPeriodicalUpdateStarted = true
        clearTimeout(this.periodicalUpdateTimeout)
        this.fetchEventDataFromBettingDataMatcher(idfoevent)
        store.dispatch('eventState/fetchEventById', { idfoevent: idfoevent, isliveevent: this.isLiveEventPage }).then(() => {
          this.periodicalUpdateTimeout = setTimeout(() => {
            if (this.isPeriodicalUpdateStarted) {
              this.startEventByIdUpdate(idfoevent)
            }
          }, this.isLiveEventPage ? this.livePeriodicalUpdateInterval : this.prematchPeriodicalUpdateInterval)
        })
      },
      stopEventByIdUpdate () {
        this.isPeriodicalUpdateStarted = false
        clearTimeout(this.periodicalUpdateTimeout)
      },
      clearCachedEvents () {
        store.dispatch('eventState/clearCachedEvent')
      },
      selectEMG (idfwmarkettypeclassgroup) {
        this.selectedIDFWMarkettypeclassGroup = idfwmarkettypeclassgroup
      },
      subscribeToLiveEventMarkets () {
        if (this.idfoevent) {
          lib.WebSocketLiveService.subscribeToEventPageMarkets(this.idfoevent)
        }
      },
      unsubscribeFromLiveEventMarkets () {
        lib.WebSocketLiveService.unsubscribeFromEventPageMarkets()
      },
      showLiveStream () {
        this.isLiveStreamVisible = true
      },
      showEventInfo () {
        this.isLiveStreamVisible = false
      },
      fetchEventDataFromBettingDataMatcher (idfoevent) {
        let contentHost = config.app.autoconf.BETTING_DATA_MATCHER_SERVICE_HOSTNAME

        if (!config.app.autoconf.BETTING_DATA_MATCHER) {
          this.bettingDataMatcherinitiallLoad = true
          return
        }

        axios.get(`${contentHost}/bettingMatcher/api/v1/eventContent?idFoEvent=${this.idfoevent}`).then((response) => {
          if (response && response.data && response.data.length && response.data[0].idFoEvent.toString() === this.idfoevent.toString() && response.data[0].mappings && response.data[0].mappings.length) {
            let data = response.data[0]
            let widget = data.mappings.find((wdg) => {
              let sportradar = (wdg.dataSource === 'SPORTRADAR')
              let lmt = wdg.contents.some((cnt) => cnt.type === 'LMT')
              // Find the one that has data source SPORTRADAR and in contents has one with LMT type
              return sportradar && lmt
            })

            if (widget && widget.event) {
              let betradarId = widget.event.split(':').pop()
              this.betradarIdFromBettingDataMatcher = betradarId
            }
          }
        }).catch((err) => {
          console.log(err)
        }).finally(() => {
          this.bettingDataMatcherinitiallLoad = true
        })
      }
      // preselectNav (liveEventPage) {
      //   setTimeout(() => {
      //     if (liveEventPage) {
      //       let mainNav = document.querySelector('.main-navigation [href="/live"]')
      //       document.querySelector('.main-navigation .router-link-active').classList.remove('router-link-exact-active', 'router-link-active')
      //       mainNav.classList.add('router-link-exact-active', 'router-link-active')
      //     } else {
      //       let mainNav = document.querySelector('.main-navigation [href="/sports"]')
      //       document.querySelector('.main-navigation [href="/live"]').classList.remove('router-link-exact-active', 'router-link-active')
      //       mainNav.classList.add('router-link-exact-active', 'router-link-active')
      //     }
      //   }, 0)
      // }
    },

    created () {
      this.clearCachedEvents()
      this.startEventByIdUpdate(this.idfoevent)

      if (this.isLiveEventPage) {
        // this.preselectNav(this.isLiveEventPage)
        this.subscribeToLiveEventMarkets()
      }
    },

    destroyed () {
      // this.preselectNav(false)
      this.clearCachedEvents()
      this.stopEventByIdUpdate()
      this.unsubscribeFromLiveEventMarkets()
      this.bettingDataMatcherinitiallLoad = false
      this.betradarIdFromBettingDataMatcher = null
    },

    watch: {
      idfoevent () {
        this.clearCachedEvents()
        this.startEventByIdUpdate(this.idfoevent)
        this.selectedIDFWMarkettypeclassGroup = 0
      },
      isLiveEventPage (newVal) {
        if (newVal) {
          this.startEventByIdUpdate(this.idfoevent)
          this.subscribeToLiveEventMarkets()
        }
      },
      liveWireLiveEventsSubscribeCounter () {
        this.subscribeToLiveEventMarkets()
      },
      isLoggedIn (newVal) {
        // if user logs in when on livestream, livestream will switch to event info
        if (newVal && this.isLiveStreamVisible) {
          this.showEventInfo()
        }
      },
      event (newVal) {
        if (newVal) {
          // console.log('watcher:', newVal)
          this.isBig3()
        }
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped>

  @import "~@/css/config.styl"


  .competition-title
    font-size 14px
    opacity .6
    color #fff
    text-align left
    margin-left 20px


  .eventmarketgroups-tab.have-bet-radar-id
    /*border 1px solid red*/
    margin-top: 84px
    /*z-index: 1*/

   .sr-lmt-plus-lmtpitch {
     margin-top 95px
   }

   .sr-lmt__content.srt-base-1 {
     margin-top 97px
   }

  .competition-live.pre-match {
    margin: 0
  }

  .competition-live.live-match {
    margin-top 0px
  }

  .competition-live {
    display: flex
    justify-content: space-between
    margin-top 49px
  }

  .competition-name.competitionname-betradar-id {
    display none
  }
  #app .team-title {
    padding-left 0px
  }

  .live-event {
    margin-right 0px
  }

  .live-event div {
    margin-right: 5px
    font-size 14px
    color:#FFFFFF
    background-color: #DB3F3F
    border-radius: 5px
    line-height: 26px;
    padding: 0px 15px;
  }

  .eventmarketgroups-tab.have-bet-radar-id {
    margin-top  0
    }

  .event
    position relative
    .competition-name
      font-size 18px
      color rgba(255, 255, 255, .9)
      text-align left
      line-height 14px
      cursor default
      font-weight 100
      div
        padding-top 6px
    .event-info
      height 125px
      cursor default
      margin-bottom 4px
      @media mobile-big-and-below
        height auto

  >>>.v-tabs__bar
    .tabs__wrapper
      .v-tabs__container
        height 66px !important

  .more_tabs
    background: #fff
    border-radius: 5px
    text-align: center
    padding: 8px 16px
    height: 36px
    color: #0b4da1
    display: flex
    margin-left: 90px
    margin-right: 12px
    .v-icon
      display block !important
      color #0b4da1
    span
      font-size: 14px
      line-height: 25px
      display: block !important
      color: #0b4da1

  .more_tabs.active
    background: #fff
    .v-icon
      color #0b4da1 !important
  .v-menu__activator--active .more_tabs
    background: #fff
  .list
    padding: 0
    font-size: 14px
    color: #0b4da1 !important
    border-radius: 4px !important
  .list:hover
      border-radius: 4px !important

    .sporttab-li:hover
      border-radius: 4px

    >>>.v-list__tile
      color: #0b4da1
      font-size: 14px
      &:hover
        color: #2396FC
        background: #fff !important
    .list_title
      flex: 1 1 auto

    .sporttab-li .igt-icon
        margin-left: auto
        visibility: hidden

    .sporttab-li.active
      >>>.v-list__tile
        font-weight: bold
        background: #fff !important

@media mobile-big-and-below
        height: 266px
      .parent
        display flex
        flex-flow row nowrap
        height 100%
        /*padding-top 20px*/
        .child
          width 49%
          height 40%
          color white
          font-size 20px
          line-height 23px
          .team-title
            color white
            line-height 23px
            margin-bottom: 10px
            padding-left 20px
          .smaller
            font-size 12px
            text-transform capitalize
        .child-left
          text-align left
          .team-title
            font-size 20px
        .child-right
          font-size 28px
          text-align right
          padding-top 5px
          .day
            display block
            font-size 14px
    .eventmarketgroup
      padding-top 5px

  .eventmarketgroup-name
    cursor: pointer;
    border: solid 1px #ccc;
    padding: 8px;

  .tab
    border: solid 1px #999;
    padding: 5px;
    margin: 5px;
    cursor: pointer;

  .time-period
    color #828282
    font-size 20px
    line-height 23px
    margin-bottom 0

  .result-title
    color #4F4F4F
    font-size 32px
    line-height 38px
    margin-bottom 5px

  .live-details
    font-family Arial
    font-weight bold
    color #000
    font-size 10px
    line-height 12px
    display block
    text-align center
    cursor pointer

  .live-data
    background-color #4F4F4F
    color #fff
    width 100%
    height 200px
    text-align center
    line-height 200px

  .competition-name
    /*display block*/
    font-family Arial
    font-weight bold
    color #828282
    font-size 14px
    line-height 16px

   @media mobile-big-and-below
    .team-title
      font-size 14px
      line-height 16px
    .time-period
      color #828282
      font-size 14px
      line-height 16px

    .result-title
      font-size 20px
      line-height 23px
      margin-bottom 0

    .live-details
      display none

    .competition-name.competitionname-betradar-id
      display none

    .competition-live
      margin-top: 0

    .live-event
      border-radius 4px
      font-size 12px

    .event .event-info
      margin-bottom 1px


    .eventmarketgroup
      display block
      width 100%
      background #e6e8ed

@media mobile-big-and-below
  >>>.v-tabs__bar .v-tabs__wrapper .v-tabs__container {
    height 48px !important
  }
  .time {
    font-size 14px
  }
  .day {
    font-size 14px
  }

  .competition-live.pre-match {
    margin: 0
  }

  .competition-live.live-match {
    margin: 0
  }

  .event-info {
    margin-bottom: 50px
  }

  .competition-title {
    text-align: left
    margin-left: 20px
  }
  .event .competition-name {
    font-size 14px
  }

  #app .team-title {
    padding-left 20px
    font-size 14px
    }

  .child.child-right {
    /*margin-top: 0px*/
    padding-top: 0px
  }

  .live-event {
    margin-right : 3px
  }

.eventmarketgroup
  .event-market-header
    margin-top: 4px
    &.available-for-bb
      .icon-span
        float right
        .igt-icon
          position relative
          top -5px
    .market-name
      display flex
      background #fff
      border 1px solid #dcdfe9
      height: 40px
      padding 10px 15px
      margin: 0
      color #000
      cursor: default
      margin-bottom: -2px
      align-items center
      &:hover
        cursor: pointer
      &.expanded-market
        border-bottom-left-radius 0
        border-bottom-right-radius 0
      @media mobile-big-and-below
        margin-left: 4px
        margin-right: 4px
      .market-name-title
        font-size: 14px
        margin: 0px
        font-weight: bold
        font-style: normal
        font-stretch: normal
        line-height: normal
      .icon-span
        text-align: right
        display: flex
        align-items: center
        justify-content: flex-end
      .available-for-bb
        display inline-block
        width 22px
        height 17px
        background url(icons-path'/'available-for-bb'.svg')
        // background: url("~@/s/svg/availible-for-bb.svg")
        background-repeat no-repeat
        margin-right 7px
        vertical-align middle
  .event-market-header.last
    margin-bottom: 4px

.eventmarketgroup * {
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: -moz-none;
    -o-user-select: none;
    user-select: none;
}

.stream-eventinfo-switcher
  margin-top -1px
  padding 0 0 10px 0
  margin-bottom -59px
  i
    color: #fff
    margin-top: 2px
    margin-right: 5px
  @media mobile-big-and-below
    display flex
    justify-content center
    margin-bottom 0px
    padding 10px 15px
  .tab
    background-color rgb(175, 1, 12)
    color #fff
    border-radius: 2px
    border none
    height 44px
    display inline-flex
    align-items center
    justify-content: center
    min-width 137px
    width auto
    margin 5px 0
    font-size 14px
    position relative
    z-index 2
    @media mobile-big-and-below
      width 100%
    .icon
      color #fff
      font-size 15px
      border-radius 50%
      border 1px solid white
      margin-right 5px
    >>>.igt-icon > span
      margin-right 5px
  .tab.active
    // background-color #e4e8ee
    // color #1f375b
    display none


.video-streaming
  // padding-top 50px
  // padding-bottom: 10px
  // width 25vw
  width 60%
  max-width calc(100% - 150px)
  margin auto
  min-height 239px
  padding-bottom: 13px
  @media mobile-big-and-below
    padding: 0
    width: 100%
    min-height unset
    max-width 100%

  @media only screen and (min-width: 1024px) and (max-width: 1280px)
    padding-left 100px
    width 80%

.event_header
  background #0b4da1
  padding 10px
  // background: rgba(15,36,76,0.6)
  margin-bottom 10px

  .parent
    align-items center
    padding 0 25px
    @media mobile-big-and-below
      padding 0px
    .child-center
      text-align center
      margin-bottom 0 !important
      div
        padding 5px 0
      span
        display block
        font-size 18px
        @media mobile-big-and-below
          font-size 14px
      .time
        color #fedd00 !important
        font-family 'Open Sans Bold'
    .child-left
    .child-right
      margin-bottom 0 !important
      .team-title
        font-size 25px
        min-height 40px
        margin-bottom 0 !important
        @media mobile-big-and-below
          font-size 14px
        .pd-icon
          color #F2F700
          margin-left 5px
        @media mobile-big-and-below
          padding-left 0 !important
          line-height 15px
  .competition-live
    &.pre-match
    &.live-match
      margin 0px 0 14px 0 !important
      display flex
      align-items center
      justify-content center
</style>
