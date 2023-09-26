<template>
  <div class="" :class="['live-coupon', {'not-on-tab': !ontab}, { 'no-events': liveEvents.length === 0 }]">
    <div v-if="((selectedSportType === 'ALL' && liveStreamedEvents.length > 0) || liveStreamedEvents.filter(e => e.idfosporttype === selectedSportType).length > 0) && ontab" class="lsevents-checkbox-container">
      <v-checkbox v-model="showStreamingEventsOnly" label="With live streaming only"></v-checkbox>
    </div>
    <!-- Tabs here -->
    <div class="sports" v-if="!this.idfosporttypescsv && Object.keys(availableSportTypes).length > 0">
      <!--<span :class="['sporttab', {'active': selectedSportTypeComputed === sport.idfosporttype}]"
            @click.stop="selectSportType(sport.idfosporttype)"
            v-for="sport in availableSportTypes">
        <span :class="['sport-icon', 'Spicon-' + sport.idfosporttype]"></span>
        {{ sport.fosporttypename || sport.idfosporttype }} ({{ liveEvents.filter(event => event.idfosporttype === sport.idfosporttype).length }})
      </span>-->

      <v-tabs v-if="!ontab" fixed-tabs align-with-title>
        <v-tab :class="['tab', {'active': selectedSportTypeComputed === tab.idfosporttype}]"
              v-for="(tab, index) in availableSportTypes"
              :key="index"
               @click.stop="selectSportType(tab.idfosporttype)"
               >
               <!-- <icon v-if="mobileBigAndBelow" :count="liveEvents.filter(event => event.idfosporttype === tab.idfosporttype).length" :color-name="selectedSportTypeComputed === tab.idfosporttype ? 'dark' : 'blue'" :name="'icon-' + (tab.idfosporttype && tab.idfosporttype.split(' ').join('').toLowerCase())"></icon>
               <icon v-if="!mobileBigAndBelow" :count="liveEvents.filter(event => event.idfosporttype === tab.idfosporttype).length" :color-name="selectedSportTypeComputed === tab.idfosporttype ? 'dark' : 'white'" :name="'icon-' + (tab.idfosporttype && tab.idfosporttype.split(' ').join('').toLowerCase())"></icon> -->
               <span class="sportName">{{ tab.fosporttypename || tab.idfosporttype }}</span>
               <span class="numberOfEvents">{{liveEvents.filter(event => event.idfosporttype === tab.idfosporttype).length}}</span>
              </v-tab>
          <v-tab class="tab_streaming" :class="['tab', {'active': showStreamingEventsOnly}]"
              v-if="liveStreamedEvents.length > 0"
               @click.stop="selectEventsWithLiveStreaming"
              >
              <span class="sportName">Watch Live</span>
              <span class="numberOfEvents">{{liveStreamedEvents.length}}</span>
              <span class="igt-icon live-streaming">
                <v-icon v-if="mobileBigAndBelow" :class="showStreamingEventsOnly ? 'dark' : 'blue'">play_arrow</v-icon>
                <v-icon v-if="!mobileBigAndBelow" :class="showStreamingEventsOnly ? 'dark' : ''">play_arrow</v-icon>
              </span>
              <!-- <icon v-if="mobileBigAndBelow" :count="liveStreamedEvents.length" :color-name="showStreamingEventsOnly ? 'dark' : 'blue'"></icon>
              <icon v-if="!mobileBigAndBelow" :count="liveStreamedEvents.length" :color-name="showStreamingEventsOnly ? 'dark' : 'white'"></icon> -->
              </v-tab>

        <v-menu offset-y max-width="320" min-width="212" :left="true" :bottom="true" origin="center" content-class="menu_top_arrow_right"
          v-if="avalableSportTypesMore.length > 0"
          class="v-tabs__div"
        >
          <a slot="activator" class="more_tabs" :class="moreButtonState">
            <span>{{ $t('More') }}</span>
            <icon v-if="moreButtonState" name="icon-chevron-top" colorName="white"></icon>
            <icon v-else name="icon-chevron-down" colorName="white"></icon>
          </a>
          <v-list>
            <v-list-tile
              v-for="(tab, index) in avalableSportTypesMore"
              :key="index"
              @click="selectSportType(tab.idfosporttype)"
              :class="['tab', {'active': selectedSportTypeComputed === tab.idfosporttype}]"
            >
              <span class="list_title">
                <icon colorName="dark" :name="'icon-' + (tab.idfosporttype && tab.idfosporttype.split(' ').join('').toLowerCase())"></icon>
                <span class="sport_title">{{ tab.fosporttypename || tab.idfosporttype }}</span>
                <span class="count_mob">{{liveEvents.filter(event => event.idfosporttype === tab.idfosporttype).length}}</span>
              </span>
            </v-list-tile>
          </v-list>
        </v-menu>
      </v-tabs>

    </div>
    <!-- Live event per Sport -->
    <section class="events" v-if="liveEventsPerSport.length > 0">
      <div v-for="fosport in liveEventsPerSportGroupedByIDFOSport" :key="fosport.idfosport" class="live-event-container">
        <big3-markets-header :coupontitle="fosport.events[0].fosportname"
                             :has-draw="hasDrawPerCompetition[fosport.idfosport]"
                             :is-big3-coupon="isBig3CouponPerCompetition[fosport.idfosport]"
                             :max-no-of-markets="maxNumberOfMarkets(fosport.events)"
                             :max-no-of-selections="maxNumberOfSelections(fosport.events)"
                             :idfosporttype="fosport.events && fosport.events[0] && fosport.events[0].idfosporttype"
                             :isoutright="false"></big3-markets-header>

        <template v-if="isDebug">
          fosport.fosporttypeinternalorder {{ fosport.fosporttypeinternalorder }}<br />
          fosport.fosportinternalorder {{ fosport.fosportinternalorder }}
        </template>

        <div class="event" :class="[
            fosport && fosport.events && fosport.events[0] && fosport.events[0].idfosporttype,
            {last: $index === fosport.events.length - 1},
            {first: $index === 0},
            {'big-three-one-selection-per-event': isBig3CouponPerCompetition[fosport.idfosport] && maxNumberOfMarkets(fosport.events) === 1},
            {'big3-event': isBig3CouponPerCompetition[fosport.idfosport]}]"
            v-for="(event, $index) in fosport.events">

          <!-- if LIVE GOLF add subtitle-->
          <!-- fosport.events[0].eventname for webpush,  event.markets[0].eventname for Kansas -->
          <div v-if="fosport && fosport.events[0] &&
            fosport.events[0].idfosporttype &&
            ['GOLF', 'MOTORSPORT', 'NASCAR'].indexOf(fosport.events[0].idfosporttype) > -1"
               class="outright-golf outright-event-name">
                {{ event.eventname || (event.markets && event.markets[0] && event.markets[0].eventname) }}</div>
          <!-- ends:  LIVE GOLF add subtitle -->
          <v-flex class="wrapper" >
            <!-- Render Live event info -->
            <live-event-info
                :event="event"
                :page="'coupon'"
                :threeselections="!isBig3CouponPerCompetition[fosport.idfosport] && hasDrawPerCompetition[fosport.idfosport]"
                :twoselections="!isBig3CouponPerCompetition[fosport.idfosport] && !hasDrawPerCompetition[fosport.idfosport]"
                :isbig3coupon="isBig3CouponPerCompetition[fosport.idfosport]"
                :couponname="couponname || 'Live coupon'"></live-event-info>
            <!-- Render markets -->
            <markets v-if="event.markets && getFilteredMarkets(event.markets).length > 0"
                     :markets="!isBig3CouponPerCompetition[fosport.idfosport] ? (getFilteredMarkets(event.markets) && [getFilteredMarkets(event.markets)[0]]) : getFilteredMarkets(event.markets).filter(mk => mk.gameperiod === '1+')"
                     :event="event"
                     :pricechangehighlight="true"
                     :islivepredefined="true"
                     :isbig3coupon="isBig3CouponPerCompetition[fosport.idfosport]"
                     :max-no-of-markets="maxNumberOfMarkets(fosport.events)"
                     :couponname="couponname || 'Live coupon'"
            ></markets>
            <section v-else class="nomarkets">{{ $t('Sports.NoAvailableMarkets') }}</section>
            <div v-if="(!mobileBigAndBelow && brandLayout!== 'generic' && brandKey !== 'sb' && brandKey !== 'mav' && brandKey !== 'qcasino' && brandKey !== 'pr') || (mobileBigAndBelow && (brandKey === 'dn' || brandKey === 'dnw' || brandKey === 'circa'))" class="more-markets" @click.stop="goToEvent(event)">
              <v-icon v-if="(brandKey !== 'dn' && brandKey !== 'dnw' && brandKey !== 'circa')">add</v-icon>
              <v-icon v-if="(brandKey === 'dn' || brandKey === 'dnw' || brandKey === 'circa')">chevron_right</v-icon></div>
          </v-flex>
          <!-- Single coupon footer, moved from liveevent info so we can have footer for both components: live-event-inf and section -->
          <!-- show footer for markets with less then 9 selections or if no markets -->
          <live-coupon-event-footer v-if="(!event.markets || event.markets.length === 0) || (event.markets[0].selections && event.markets[0].selections.length <= 9)" :event="event" :couponname="couponname || 'Live coupon'"></live-coupon-event-footer>
        </div>

      </div>
    </section>

    <section v-if="(ontab && liveEventsPerSport.length === 0) || (!ontab && (!liveEvents || liveEvents.length === 0)) && liveEventsLoaded">
      <template v-if="brandKey !== 'sb'">
        <no-live-msg></no-live-msg>
      </template>
      <template v-if="brandKey ==='sb'">
        <div class="noevents">
          <img :src="mediaServer('/static/brand-img/sb/noLiveEvents.svg')" alt="noevents"/>
        </div>
      </template>
    </section>
  </div>

</template>
<script>
  import store from '@/store'
  import config from '@/config'
  import Vue from 'vue'
  import LiveEventInfo from '@/components/sports/bettingoffer/live/liveEventInfo'
  import markets from '@/components/sports/bettingoffer/markets'
  import MatchTimeDisplay from '@/components/sports/bettingoffer/live/matchTimeDisplay'
  import big3MarketsHeader from '@/components/sports/bettingoffer/big3MarketsHeader'
  import Icon from '@/components/common/Icon'
  import LiveCouponEventFooter from '@/components/sports/bettingoffer/live/liveCouponEventFooter'
  import Screen from '@/components/mixins/Screen'
  import BettingOffer from '@/components/mixins/BettingOffer'
  import NoLiveMsg from '@/components/sports/bettingoffer/live/NoLiveMsg'
  import Badge from '@/components/common/Badge'
  import Branding from '@/components/mixins/Branding'
  import Url from '@/components/mixins/Url'

  export default {
    name: 'live-coupon-component',

    components: {
      LiveEventInfo,
      markets,
      MatchTimeDisplay,
      big3MarketsHeader,
      Icon,
      LiveCouponEventFooter,
      NoLiveMsg,
      Badge
    },

    mixins: [
      Screen,
      BettingOffer,
      Branding,
      Url
    ],

    props: [
      'idfosporttypescsv',  // sporttypes csv for filter events
      'maxevents',  // max events in total
      'maxeventspersporttype',  // max events per sporttype
      'ontab', // is live coupon displayed on tab coupon
      'couponname'
    ],

    data () {
      return {
        selectedSportType: this.idfosporttypescsv || '',
        showStreamingEventsOnly: false
      }
    },

    computed: {
      liveEvents () {
        if (this.liveStreamedEvents.length > 0 && this.showStreamingEventsOnly && this.ontab) {
          return this.liveStreamedEvents
        } else {
          var liveEvents = store.getters['livebettingState/liveEvents']
          var filteredLiveEvents = liveEvents && liveEvents.filter(ev => !ev.isawaitingstart)

          return filteredLiveEvents
        }
      },
      liveStreamedEvents () {
        var liveEvents = store.getters['livebettingState/liveEvents']
        var filteredLiveEvents = liveEvents && liveEvents.filter(ev => !ev.isawaitingstart)

        return filteredLiveEvents.filter(event => this.liveStreams.filter(ls => ls.idfoevent === event.idfoevent).length > 0)
      },
      liveStreams () {
        return store.getters['livebettingState/liveStreams']
      },
      liveBettingDataSourceType () {
        return store.getters['livebettingState/liveBettingDataSourceType']
      },
      liveEventsPerSport () {
        var self = this
        if (this.liveEvents && this.liveEvents.length > 0) {
          let events
          if (this.showStreamingEventsOnly) {
            events = this.liveEvents
            if (this.ontab) {
              if (this.selectedSportType !== 'ALL') {
                events = this.liveEvents.filter(e => e.idfosporttype === this.selectedSportType)
              }
            } else {
              // when on live page, selectedSportType is 'ALL'
              this.selectedSportType = 'ALL'
            }
            events = events.filter(event => this.liveStreamedEvents.map(e => e.idfoevent).includes(event.idfoevent))
          } else {
            events = this.liveEvents.filter(event => this.selectedSportType === 'ALL' ||
            this.selectedSportType === event.idfosporttype || // if sporttype tab is selected
            this.selectedSportType.split(',').indexOf(event.idfosporttype) > -1)  // if sporttypes are props as csv
          }
          if (this.maxevents && this.maxevents > 0) {
            return Vue._.orderBy(events, ['foeventinternalorder', 'awayteamname']).splice(0, this.maxevents)
          } else if (this.maxeventspersporttype && this.maxeventspersporttype > 0) {
            if (this.availableSportTypes && this.availableSportTypes.length > 0) {
              var splicedEvents = []
              this.availableSportTypes.forEach(sporttype => {
                splicedEvents = splicedEvents.concat(
                  Vue._.orderBy(
                    events.filter(ev => ev.idfosporttype === sporttype.idfosporttype),
                    ['fosportinternalorder', 'foeventinternalorder', 'awayteamname']).splice(0, self.maxeventspersporttype))
              })
              return splicedEvents
            } else {
              return []
            }
          } else {
            return Vue._.orderBy(events, ['foeventinternalorder', 'awayteamname'])
          }
        } else {
          return []
        }
      },
      liveEventsPerSportGroupedByIDFOSport () {
        var competitions = []

        if (this.liveEventsPerSport && this.liveEventsPerSport.length > 0) {
          this.liveEventsPerSport.forEach((event) => {
            if (competitions.filter(cmp => cmp.idfosport === event.idfosport).length === 0) {
              competitions.push({ idfosport: event.idfosport,
                fosportname: event.fosportname,
                fosportinternalorder: event.fosportinternalorder || 0,
                fosporttypeinternalorder: event.fosporttypeinternalorder})
            }
          })

          for (let key in competitions) {
            competitions[key].events = Vue._.orderBy(this.liveEventsPerSport.filter(ev => competitions[key].idfosport === ev.idfosport), ['foeventinternalorder', 'awayteamname'])
          }
        }

        return Vue._.orderBy(competitions, ['fosporttypeinternalorder', 'fosportinternalorder'], ['asc', 'asc'])
      },
      availableSportTypes () {
        var sports = []

        if (this.liveEvents && this.liveEvents.length > 0) {
          this.liveEvents.forEach((event) => {
            if (sports.filter(sport => sport.idfosporttype === event.idfosporttype).length === 0) {
              sports.push({ idfosporttype: event.idfosporttype, fosporttypename: event.fosporttypename, fosporttypeinternalorder: event.fosporttypeinternalorder })
            }
          })
        }
        sports = Vue._.orderBy(sports, 'fosporttypeinternalorder', 'asc')
        if (this.tabletAndAbove) {
          return sports.slice(0, 6)
        } else {
          return sports
        }
      },
      avalableSportTypesMore () {
        var sports = []

        if (this.liveEvents && this.liveEvents.length > 0) {
          this.liveEvents.forEach((event) => {
            if (sports.filter(sport => sport.idfosporttype === event.idfosporttype).length === 0) {
              sports.push({ idfosporttype: event.idfosporttype, fosporttypename: event.fosporttypename, fosporttypeinternalorder: event.fosporttypeinternalorder })
            }
          })
        }
        sports = Vue._.orderBy(sports, 'fosporttypeinternalorder', 'asc')
        if (this.tabletAndAbove) {
          return sports.slice(6, sports.length)
        } else {
          return ''
        }
      },
      selectedSportTypeComputed () {
        if ((!this.selectedSportType || this.liveEventsPerSport.length === 0) && this.availableSportTypes && this.availableSportTypes.length > 0) {
          this.selectedSportType = this.availableSportTypes[0].idfosporttype
        }
        return this.selectedSportType
      },
      currentTab: {
        get: function () {
          return this.selectedSportType
        },
        set: function (newValue) {
          this.selectedSportType = this.availableSportTypes[0].idfosporttype
        }
      },
      isBig3CouponPerCompetition () {
        var isBig3CouponPerCompetition = {}

        for (let key in this.liveEventsPerSportGroupedByIDFOSport) {
          let idfosport = this.liveEventsPerSportGroupedByIDFOSport[key] && this.liveEventsPerSportGroupedByIDFOSport[key].idfosport
          let competitionMarkets = []

          if (idfosport) {
            competitionMarkets = (this.allFilteredMarketsPerCompetititon(this.liveEventsPerSportGroupedByIDFOSport[key].events)) || []

            let idfosporttypeFirst = this.liveEventsPerSportGroupedByIDFOSport[key].events[0].idfosporttype
            isBig3CouponPerCompetition[idfosport] = (competitionMarkets && !config.app.autoconf.BIG3_IGNORE_SPORTTYPES.includes(idfosporttypeFirst) &&
              competitionMarkets.filter(mk => !mk.big3markettype || (mk.selections && mk.selections.length > 2)).length === 0) || false
          }
        }

        return isBig3CouponPerCompetition
      },
      hasDrawPerCompetition () {
        var isHasDrawPerCompetition = {}

        for (let key in this.liveEventsPerSportGroupedByIDFOSport) {
          let idfosport = this.liveEventsPerSportGroupedByIDFOSport[key] && this.liveEventsPerSportGroupedByIDFOSport[key].idfosport
          let competitionMarkets = []

          if (idfosport) {
            competitionMarkets = this.allFilteredMarketsPerCompetititon(this.liveEventsPerSportGroupedByIDFOSport[key].events) || []
          }

          isHasDrawPerCompetition[idfosport] = competitionMarkets.filter(mk => mk.idfohadtype === 'HAD').length > 0
        }

        return isHasDrawPerCompetition
      },
      moreButtonState () {
        var linksInMoreTab = []
        for (var i = 0; i < this.avalableSportTypesMore.length; i++) {
          if (this.selectedSportType.indexOf(this.avalableSportTypesMore[i].idfosporttype.toString()) > -1) {
            linksInMoreTab.push(i)
          }
        }
        if (linksInMoreTab.length > 0) {
          return 'active'
        }
      }
    },

    methods: {
      selectSportType (idfosporttype) {
        this.selectedSportType = idfosporttype
        this.showStreamingEventsOnly = false
      },
      getFilteredMarkets (markets) {
        if (this.liveBettingDataSourceType !== 'PULL') {
          return (markets && markets.filter(mk => !mk.derivativetype && mk.mtcgflag && mk.mtcgflag.indexOf('SHOWONFILTER') > -1)) || undefined
        } else {
          return markets
        }
      },
      allFilteredMarketsPerCompetititon (competitionEvents) {
        var allMarkets = []

        if (competitionEvents) {
          competitionEvents.forEach((ev) => {
            if (ev.markets && ev.markets.length > 0) {
              ev.markets.forEach((mk) => {
                allMarkets.push(mk)
              })
            }
          })
        }

        return this.getFilteredMarkets(allMarkets)
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
      maxNumberOfSelections (arrayOfEvents) {
        let noOfSelections = 0
        if (arrayOfEvents) {
          arrayOfEvents.forEach(event => {
            if (event.markets) {
              event.markets.forEach(market => {
                if (market.selections && market.selections.length) {
                  if (market.selections.length > noOfSelections) {
                    noOfSelections = market.selections.length
                  }
                }
              })
            }
          })
        }
        return noOfSelections
      },
      moveTabFromMoreToTabs (tab) {
        const removed = this.availableSportTypes.splice(0, 1)
        this.availableSportTypes.unshift(
          ...this.avalableSportTypesMore.splice(this.avalableSportTypesMore.indexOf(tab), 1)
        )
        this.avalableSportTypesMore.push(...removed)
        this.$nextTick(() => { this.currentTab = 'tab-' + tab })
      },
      selectEventsWithLiveStreaming () {
        this.showStreamingEventsOnly = true
      }
    }
    // watch: {
    //   liveEventsPerSport (events) {
    //     if (!events || events.length === 0) {
    //       this.selectedSportType = ''
    //     }
    //   }
    // }
  }
</script>
<style lang="stylus" scoped>
@import '~@/css/config'
@import "mixins"
  .url-state-name-bonavigation2
    .live-coupon
      padding-right 24px
      @media mobile-big-and-below
       padding 5px 5px
       // background: #e5e8ed
       position: relative
    .tab-coupon
     .live-coupon
       padding-right 0px
       @media mobile-big-and-below
        padding 0px
  .url-state-name-sports-live
    .live-coupon
      padding-right 24px
      @media mobile-big-and-below
        padding-right 0
  .not-on-tab
    .sports
      height 56px
      @media mobile-big-and-below
        height unset
      >>>.tabs__bar
        .tabs__wrapper
          .tabs__container
            height 56px
            @media mobile-big-and-below
              height 56px
    .tab
      height 56px
      >>>a
        flex-direction row
        display flex
      .numberOfEvents
        padding 0 4px
        // font-family 'Open Sans Regular'
        font-size 12px
        border-radius 50%
        background #ff671f
        color #fff
        text-align center
        display flex
        min-width 1.67em
        min-height 1.67em
        line-height 1.67em
        margin-left 5px
      .sportName
        display inline
      .igt-icon
        display block !important
        margin-bottom 8px
        position relative
        @media mobile-big-and-below
          margin-bottom 2px
        >>>span.css
          display block !important
          width 24px
          height 24px
          @media mobile-big-and-below
            width 20px
            height 20px
        >>>.badge
          display inline-flex !important
          min-width 20px
          min-height 20px
          position absolute
          top -10px
          right -10px
          span
            display inline !important
            font-size 12px
        &.live-streaming
          .icon
            color white
            border 1px solid white
            border-radius 50%
            display block !important
            position relative
            max-width 24px
            // margin-bottom 8px
            font-size 22px
            @media mobile-big-and-below
              font-size 20px
            &.dark
              color #213859 !important
              border 1px solid #213859
            &.blue
              color #1493ff !important
              border 1px solid #1493ff
              background-color: #fff !important
    .tab_streaming
      @media mobile-big-and-below
        line-height 12px
  .events
    .event.TENNIS
      .wrapper
        padding-left 15px
        >>>.markets-wrapper
          flex-grow 0
          flex-shrink 0
          .markets
              .market
                .selections
                  flex-grow 1
                  .selection
                    display flex
                    align-items center
                    justify-content center
        .event-info
        >>>.names
          .event-info
            //padding-right 10px
            .eventTitleWrapper
              //margin-bottom 10px
              &:last-child
                margin 0
  .events
    .event.not-big3
      .wrapper
        >>>.names
          .event-info
            .eventTitleWrapper
              margin 0
  .hheader
    border-bottom none
    &.twoselections
      .market
        .selections
          padding 0
          .selection
            margin 2px
            span
              height 40px
              border-radius 5px
              line-height 12px
  .live-coupon
    &.not-on-tab
      .events
        .live-event-container
          @media mobile-big-and-below
              margin 5px 4px
    .sports
      .sporttab
        border solid 1px #999
        padding 5px
        margin 5px
        cursor pointer
    .events
      .event
        >>>.market-name
          display none
    .events
      .live-event-container
        margin 5px 0
      .header
        display flex
        background #fff
        border-top 1px solid #cfd6db
        border-left 1px solid #cfd6db
        border-right 1px solid #cfd6db
        border-top-right-radius 5px
        border-top-left-radius 5px
        font-size 14px
        font-weight: bold;
        text-transform uppercase
        padding 10px 15px
        margin-bottom 0
        user-select none
        color #21335a
      .event
        border-left solid 1px #ccc
        border-right solid 1px #ccc
        border-top 1px solid #cfd6db
        clear both
        background white
        .wrapper
          display flex
          justify-content space-between
          background-color #fff
          margin 0px
          align-items center
          // padding-bottom 12px
          >>>.event-info
            section
              margin 0
        .single-coupon-footer
          display flex
        .nomarkets
          color #000
          border solid 1px #ccc
          display inline-block
          line-height 40px
          width 130px
          text-align center
          height 40px
          cursor default
          @media mobile-big-and-below
            width 60px
            line-height 14px
            height unset
        &.last
          border-bottom 1px solid #cfd6db
    .events
      .event.GOLF,
      .event.MOTORSPORT,
      .event.NASCAR
        .wrapper
          padding: 0
          border-bottom-right-radius: 5px
          border-bottom-left-radius: 5px
          // @media mobile-big-and-below
          //   padding: 12px
// @media mobile-big-and-below
//   padding: 12px

  .more_tabs
    background: #06283b
    border-radius: 60px
    text-align: center
    padding: 8px 16px
    height: 36px
    color: #fff
    display: flex
    margin-top: 30px
    margin-left: 50px
    margin-right:12px
    .v-icon
      display block !important
      color #fff
    span
      font-size: 16px
      line-height: 22px
  .more_tabs.active
    background: #1493FF

  .v-menu__activator--active .more_tabs
    background: #1493FF
  .list
    padding: 0
    font-size: 14px
    color: #1F375B !important
    border-radius: 4px !important
    .tab
      &.active
        >>>.v-list__tile
          color #1493ff !important
          override-svg-icon(icon-names, 'blue')
  .list:hover
      border-radius: 4px !important

    >>>.v-list__tile:hover
      border-radius: 4px

    >>>.v-list__tile
      color: #1F375B
      font-size: 14px
      &:hover
        color: #2396FC
        background: #fff !important
        override-svg-icon(icon-names, 'blue')
    .list_title
      >>>.igt-icon > span
        width: 24px
        height: 24px
        margin-right: 3px
    .sport_title
       flex: 1 1 auto
    .count_mob
      min-width: 20px
      min-height: 20px
      position: absolute
      right: 16px
      top: 14px
      background: #DB3F3F
      font-size: 12px
      font-weight: 700
      padding: 0 4px
      border-radius: 50%
      color: #fff
      text-align: center
      display: inline-block
      min-width: 1.67em
      min-height: 1.67em
      display: -ms-inline-flexbox
      display: inline-flex
      -ms-flex-align: center
      align-items: center
      -ms-flex-pack: center
      justify-content: center
      margin-left: auto


@media mobile-big-and-below
  .live-event-container
    .event
      position:relative
.more-markets
  border: 1px solid #b6b6b6
  width: 30px
  height: 30px
  margin-left: 25px
  display inline-flex
  align-items center
  justify-content center
.noevents
  padding-top 40px
  padding-bottom 40px
  background #fff
  display flex
  justify-content center
  height 100%
  position: relative
  img
    max-width 250px
    @media mobile-big-and-below
      max-width 200px
</style>
