<template>
  <div class="search-events-component" :class="[{ 'mobile': mobileBigAndBelow }, routeName]">
  <!-- fosports -->
  <!--h2>Sport events</h2-->
  <!-- <span class="back-button" @click="goBack()" v-if="searchPhrase">Back</span> -->
  <template v-if="eventsListProcessed && eventsListProcessed.length > 0">
    <section class="fosports" v-for="sporttype in eventsListProcessed" v-if="sporttype.fosports && sporttype.fosports.length > 0">
      <!-- fosports -->
      <div v-for="fosport in sporttype.fosports" :key="fosport.idfosport" class="fosport-container">
        <template v-if="routeName === 'searchsport'">
          <div class="breadcrums_holder">
            <h3>{{ sporttype.name }}</h3> <span class="arrowright"></span> <h3>{{ fosport.name }}</h3>
          </div>
        </template>
        <!-- focompetitions -->
        <section class="focompetitions" v-if="fosport && fosport.focompetitions && fosport.focompetitions.length > 0">
          <div v-for="focompetition in fosport.focompetitions.filter(focomp => focomp.explicitlyfound || (focomp.events && focomp.events.length > 0))" :key="focompetition.idfocompetition" class="focompetition-container">
            <template v-if="routeName === 'searchsport'">
              <div class="competitiontitle clickable" @click="goToFoCompetition(focompetition)">
                <h3>{{ focompetition.name }}</h3>
                <h3 class="viewsportcompetition">{{ $t('Search.ViewMore') }}</h3>
              </div>
            </template>
            <template v-if="routeName === 'searchcompetition'">
              <div class="breadcrums_holder">
                <h3>{{ sporttype.name }}</h3> <span class="arrowright"></span>
                <h3>{{ fosport.name }}</h3><span class="arrowright"></span>
                <h3>{{ focompetition.name }}</h3>
              </div>
            </template>
            <div class="events">
              <div class="events-container" v-if="focompetition.events && focompetition.events.length > 0">
                <big3-markets-header class="live-header" v-if="focompetition.events.filter(ev => ev.liveEvent).length"
                                     :coupontitle="''"
                                     :has-draw="focompetition.hasdraw"
                                     :is-big3-coupon="focompetition.isbig3coupon"
                                     :max-no-of-selections="focompetition.maxnumberofselections"
                                     :idfosporttype="''"></big3-markets-header>

                <div class="event live" v-for="(event, $index) in focompetition.events.filter(ev => ev.liveEvent)"
                     :class="[event.idfosporttype, {last: $index === focompetition.events.filter(ev => ev.liveEvent).length - 1}]">
                  <!-- Render Live event info -->
                  <!-- if LIVE GOLF add subtitle-->
                  <div v-if="event.liveEvent.idfosporttype &&
                      ['GOLF', 'MOTORSPORT', 'NASCAR'].indexOf(event.liveEvent.idfosporttype) > -1"
                       class="outright-golf outright-event-name">
                    {{ event.name }}
                  </div>
                  <!-- ends:  LIVE GOLF add subtitle -->
                  <v-flex class="wrapper" >
                    <!-- Render Live event info -->
                    <live-event-info
                      :event="event.liveEvent"
                      :page="'coupon'"
                      :threeselections="!focompetition.isbig3coupon && focompetition.hasdraw"
                      :twoselections="!focompetition.isbig3coupon && !focompetition.hasdraw"
                      :isbig3coupon="focompetition.isbig3coupon"></live-event-info>
                    <!-- Render markets -->
                    <markets v-if="event.liveEvent.markets && event.liveEvent.markets.length > 0"
                             :markets="(!focompetition.isbig3coupon) ? [event.liveEvent.markets[0]] : event.liveEvent.markets"
                             :event="event.liveEvent"
                             :pricechangehighlight="true"
                             :islivepredefined="true"
                             :is-big3-coupon="focompetition.isbig3coupon"
                    ></markets>

                    <section v-else class="nomarkets">{{ $t('Sports.NoAvailableMarkets') }}</section>
                  </v-flex>

                  <!-- Single coupon footer, moved from liveevent info so we can have footer for both components: live-event-inf and section -->
                  <live-coupon-event-footer :event="event.liveEvent"></live-coupon-event-footer>
                </div>
                <!-- PRE-MATCH -->
                <div class="event prematch" v-for="(event, $index) in focompetition.events.filter(ev => !ev.liveEvent)"
                     :class="[event.idfosporttype,
                        {last: $index === focompetition.events.length - 1}]">

                  <v-flex v-if="$index === 0" class="header wrapper" >
                    <span class="time">{{ $t('Search.Header.Time') }}</span>
                    <span class="event-name">{{ $t('Search.Header.Event') }}</span>
                    <span class="more-markets"></span>
                  </v-flex>
                  <v-flex class="eventinfo wrapper clickable" @click="goToEvent(event)">
                    <span v-if="isDateToday(event.tsstart)" class="time">{{ $t('Search.Today') }} {{ (event.tsstart) | moment(dateFormats.longTime)}}</span>
                    <span v-if="isDateTomorrow(event.tsstart)" class="time">{{ $t('Search.Tomorrow') }} {{ (event.tsstart) | moment(dateFormats.longTime)}}</span>
                    <span v-if="!isDateToday(event.tsstart) && !isDateTomorrow(event.tsstart)" class="time">{{ event.tsstart | moment(dateFormats.longDateTime) }} </span>
                    <span class="event-name">{{ event.name }}</span>
                    <span class="more-markets"><span class="arrowright"></span></span>
                  </v-flex>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </section>
  </template>
  <div class="no-events-found" v-else>
    {{ $t('Search.NoEventsFound') }}
  </div>
</div>

</template>
<script>
  import config from '@/config'
  import store from '@/store'
  import Icon from '@/components/common/Icon'
  import Screen from '@/components/mixins/Screen'
  import BettingOffer from '@/components/mixins/BettingOffer'

  import LiveEventInfo from '@/components/sports/bettingoffer/live/liveEventInfo'
  import markets from '@/components/sports/bettingoffer/markets'
  import LiveCouponEventFooter from '@/components/sports/bettingoffer/live/liveCouponEventFooter'
  import big3MarketsHeader from '@/components/sports/bettingoffer/big3MarketsHeader'

  export default {
    name: 'search-component',

    components: {
      Icon,
      LiveEventInfo,
      markets,
      LiveCouponEventFooter,
      big3MarketsHeader
    },

    mixins: [
      Screen,
      BettingOffer
    ],

    props: [
      'maxevents',  // max events in total
      'maxeventspersporttype'  // max events per sporttype
    ],

    data () {
      return {
        selectedSportType: '',
        liveEventsMapped: [],
        showFoSportsAsExplicitlyFound: window.ctsautoconf.SHOW_FOSPORTS_AS_EXPLICITLY_FOUND
      }
    },

    computed: {
      liveBettingDataSourceType () {
        return store.getters['livebettingState/liveBettingDataSourceType']
      },
      sportEvents () {
        return store.getters['searchState/getSportEvents'] || []
      },
      competitionEvents () {
        return store.getters['searchState/getCompetitionEvents'] || []
      },
      resultsList () {
        if (this.$route.name === 'searchsport') {
          return this.sportEvents
        } else if (this.$route.name === 'searchcompetition') {
          return this.competitionEvents
        }
      },
      eventsListProcessed () {
        var results = this.resultsList
        var self = this

        results.forEach(fosporttype => {
          if (fosporttype.fosports) {
            fosporttype.fosports.forEach(fosport => {
              if (fosport.focompetitions) {
                fosport.focompetitions.forEach(focompetition => {
                  if (focompetition.events) {
                    let liveEvents = []
                    focompetition.events.forEach((ev) => {
                      ev.liveEvent = self.liveEvents.find(liveEvent => liveEvent.idfoevent === ev.idfoevent)
                      if (ev.liveEvent) {
                        liveEvents.push(ev.liveEvent)
                      }
                    })
                    if (liveEvents.length > 0) {
                      focompetition.isbig3coupon = self.isBig3Coupon(liveEvents)
                      focompetition.hasdraw = self.hasDraw(liveEvents)
                      focompetition.maxnumberofselections = liveEvents.length > 0 ? self.maxNumberOfSelections(liveEvents[0]) : 0
                    }
                  }
                })
              }
            })
          }
        })
        return results
      },
      eventsLoaded () {
        return true
      },
      routeName () {
        return this.$route.name
      },
      searchPhrase () {
        return store.getters['searchState/getPhrase']
      }
    },

    methods: {
      fetchEvents () {
        var idfosport = this.$route.params.idfosport
        var idfocompetition = this.$route.params.idfocompetition
        if (this.$route.name === 'searchsport' && idfosport) {
          store.dispatch('searchState/fetchEventsByIdFoSport', idfosport)
        } else if (this.$route.name === 'searchcompetition' && idfosport && idfocompetition) {
          store.dispatch('searchState/fetchEventsByIdFoCompetition', { idfosport: idfosport, idfocompetition: idfocompetition })
        }
      },
      isBig3Coupon (events) {
        var nonBig3Markets = []

        if (events.filter(ev => config.app.autoconf.BIG3_IGNORE_SPORTTYPES.includes(ev.idfosporttype)).length > 0) {
          return false
        }

        events.forEach(ev => {
          if (ev.markets && ev.markets.length > 0) {
            ev.markets.forEach(mk => {
              if (!mk.big3markettype ||
                config.app.autoconf.BIG3_IGNORE_SPORTTYPES.includes(mk.idfosporttype)) {
                nonBig3Markets.push(mk)
              }
            })
          }
        })

        return nonBig3Markets.length === 0
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
      goToFoSport (fosport) {
        this.$router.push({name: 'searchsport', params: { idfosport: fosport.idfosport }})
      },
      goToFoCompetition (focompetition) {
        this.$router.push({name: 'searchcompetition', params: { idfocompetition: focompetition.idfocompetition }})
      },
      goBack () {
        this.$router.back()
      }
    },

    mounted () {
      this.fetchEvents()
    },

    watch: {
      '$route' () {
        this.fetchEvents()
      }
    }
  }
</script>
<style lang="stylus" scoped>
  @import '~@/css/config'
  @import "mixins"

  .search-events-component
    padding-right 0px
    h3
      display inline-block
      font-size 14px
    .clickable
      cursor pointer
    .single-coupon-footer
      border none
      margin 0px
    .hheader
      margin 0px
    .fosports
      .breadcrums_holder
        display flex
        align-items center
        padding 2px
        h3
          margin-bottom 0
          font-size 14px
          color #445058
          font-weight normal
          padding 10px
      .arrowright
        background url("~@/assets/images/icons/arrow_right.svg") no-repeat
        background-size 6px
        width: 11px
        height: 11px
        display: inline-block
      .focompetitions
        .focompetition-container
          border solid 1px #cfd6db
          margin-bottom 25px
          .competitiontitle
            display flex
            justify-content space-between
            align-items center
            height 40px
            h3
              font-size 14px
              color #445058
              font-weight normal
              line-height: 15px
            .viewsportcompetition
              color #1493ff
              text-transform none
              font-weight normal
              text-align: right
          h3
            padding 5px 10px 5px 5px
            margin-bottom 0px
          .wrapper
            flex 1
            padding 7px 10px
          .events-container
            >>>.hheader
              // border none
            .event
              clear both
              font-size 14px
              background white
              &:not(:last-child)
                border-bottom 1px solid #cfd6db
              .wrapper
                display flex
                justify-content space-between
                margin 0px
                align-items center
                color #445058
                font-size 14px
                >>>.event-info
                  section
                    margin 0

                .time
                  padding-right 20px
                  min-width 155px
                  color #445058
                .event-name
                  width 60%
                  font-weight: normal !important
                  &.clickable
                    cursor pointer

                &.header
                  background-color #f2f2f2
                  border-top solid 1px #cfd6db
                  border-bottom solid 1px #cfd6db
                  height 40px
                  color #21335a
                  .time
                  .event-name
                    font-size 14px !important
                    text-transform uppercase
                    color #21335a

                &.eventinfo
                  .event-name
                    color #445058
                    font-size 14px
                    font-weight bold !important
                  .more-markets
                    text-transform uppercase
                    color #0090ff
                    font-weight 600
                    text-align right
                    display flex
                    align-items center
                    justify-content: flex-end
                    margin-left auto

    &.searchsport
      .fosports
        .focompetitions
          .focompetition-container
            background-color #fff

  .no-events-found
    padding: 100px 0 200px 0
    color: #777978
    font-family: "Open Sans SemiBold"
    letter-spacing: 0
    font-size: 16px
    text-align center


</style>
