<template>
  <div class="search-component" :class="{ 'mobile': mobileBigAndBelow }">
    <!--<span class="back-button" @click="exitSearch()" v-if="!mobileBigAndBelow">Exit search</span>-->
    <div class="header-text" v-if="eventsLoaded">
      <h2>"{{ searchPhrase }}" {{ $t('Search.Results') }} ({{ numberOfHits }})</h2>
    </div>
    <div class="sports" v-if="eventsLoaded && searchResultsProcessed && searchResultsProcessed.length > 0">
      <v-tabs fixed-tabs align-with-title>
        <v-tab :class="['tab', {'active': selectedSportTypeComputed.idfosporttype === fosporttype.idfosporttype}]"
               v-for="(fosporttype, index) in searchResultsProcessed"
               :key="index"
               @click.stop="selectSportType(fosporttype)"
        >
          {{ fosporttype.name }} <span v-if="fosporttype.eventcount" class="numberOfEvents">{{fosporttype.eventcount}}</span></v-tab>
      </v-tabs>
    </div>
    <!-- fosports -->
    <template v-if="eventsLoaded && searchResultsProcessed && searchResultsProcessed.length > 0">
      <section class="fosports" v-if="selectedSportTypeComputed && selectedSportTypeComputed.fosports && selectedSportTypeComputed.fosports.length > 0">
        <div v-for="fosport in selectedSportTypeComputed.fosports" :key="fosport.idfosport" class="fosport-container" :class="{'noexplicitfound': !fosport.explicitlyfound}">
          <div class="sporttitle" v-if="fosport.explicitlyfound" @click="goToFoSport(fosport)" :class="{'clickable': fosport.explicitlyfound}">
            <h2 class="sportname">
              <text-highlight v-if="fosport.explicitlyfound" :queries="searchPhraseWithSynonims">{{ ' ' + fosport.name }}</text-highlight>
              <template v-else>{{ fosport.name }}</template>
            </h2>
            <h2 class="viewsportcompetition clickable">{{ $t('Search.ViewMore') }}</h2>
          </div>
          <!-- focompetitions -->
          <section class="focompetitions" v-if="fosport && fosport.focompetitions && fosport.focompetitions.length > 0">
            <div v-for="focompetition in fosport.focompetitions.filter(focomp => focomp.explicitlyfound || (focomp.events && focomp.events.length > 0))" :key="focompetition.idfocompetition"
                 class="focompetition-container"
                  :class="{'hasevents': focompetition.events && focompetition.events.length > 0}">
              <div class="competitiontitle" @click="goToFoCompetition(fosport, focompetition)" :class="{'clickable': focompetition.explicitlyfound}">
                <h2>
                  <span>
                    <text-highlight v-if="fosport.explicitlyfound" :queries="searchPhraseWithSynonims">{{ ' ' + fosport.name }}</text-highlight>
                    <template v-else>{{ fosport.name }}</template>
                    &nbsp;-&nbsp;
                  </span>
                  <span class="competitionname">
                    <text-highlight v-if="focompetition.explicitlyfound" :queries="searchPhraseWithSynonims">{{ ' ' + focompetition.name }}</text-highlight>
                    <template v-else>{{ focompetition.name }}</template>
                  </span>
                </h2>
                <h2 class="viewsportcompetition clickable" v-if="focompetition.explicitlyfound">{{ $t('Search.ViewMore') }}</h2>
              </div>

              <div class="events" v-if="focompetition.events && focompetition.events.length > 0">
                <div class="events-container">
                  <!-- Live -->
                  <big3-markets-header v-if="focompetition.events.filter(ev => ev.liveEvent).length"
                                       :coupontitle="''"
                                       :has-draw="focompetition.hasdraw"
                                       :is-big3-coupon="focompetition.isbig3coupon"
                                       :max-no-of-selections="focompetition.maxnumberofselections"
                                       :idfosporttype="''"></big3-markets-header>

                  <div class="event live" v-for="(event, $index) in focompetition.events.filter(ev => ev.liveEvent)"
                       :class="[selectedSportTypeComputed.idfosporttype, {last: $index === focompetition.events.filter(ev => ev.liveEvent).length - 1}]">
                      <!-- Render Live event info -->
                      <!-- if LIVE GOLF add subtitle-->
                      <div v-if="event.liveEvent.idfosporttype &&
                        ['GOLF', 'MOTORSPORT', 'NASCAR'].indexOf(event.liveEvent.idfosporttype) > -1"
                           class="outright-golf outright-event-name">
                        <span class="name">
                          <text-highlight :queries="searchPhraseWithSynonims">{{ ' ' + event.name }}</text-highlight>
                        </span>
                      </div>
                      <!-- ends:  LIVE GOLF add subtitle -->
                      <v-flex class="wrapper" >
                        <!-- Render Live event info -->
                        <live-event-info
                          :event="event.liveEvent"
                          :page="'coupon'"
                          :threeselections="!focompetition.isbig3coupon && focompetition.hasdraw"
                          :twoselections="!focompetition.isbig3coupon && !focompetition.hasdraw"
                          :isbig3coupon="focompetition.isbig3coupon"
                          :phrasetohighlight="searchPhraseWithSynonims"></live-event-info>
                        <!-- Render markets -->
                        <markets v-if="event.liveEvent.markets && event.liveEvent.markets.length > 0"
                                 :markets="(!focompetition.isbig3coupon) ? [event.liveEvent.markets[0]] : event.liveEvent.markets"
                                 :event="event.liveEvent"
                                 :pricechangehighlight="true"
                                 :islivepredefined="true"
                                 :is-big3-coupon="focompetition.isbig3coupon"
                        ></markets>
                        <section v-else class="nomarkets">{{$t('Sports.NoAvailableMarkets')}}</section>
                          <div v-if="(!mobileBigAndBelow  && brandLayout !== 'generic' && brandKey !== 'sb' && brandKey !== 'mav' && brandKey !== 'qcasino') || (mobileBigAndBelow && (brandKey === 'dn' || brandKey === 'dnw' || brandKey === 'circa'))" class="more-markets" @click.stop="goToEvent(event)">
                          <v-icon v-if="(brandKey !== 'dn' && brandKey !== 'dnw' && brandKey !== 'circa')">add</v-icon>
                          <v-icon v-if="(brandKey === 'dn' || brandKey === 'dnw' || brandKey === 'circa')">chevron_right</v-icon></div>
                      </v-flex>

                      <!-- Single coupon footer, moved from liveevent info so we can have footer for both components: live-event-inf and section -->
                      <live-coupon-event-footer
                        :event="event.liveEvent"
                        :phraseToHighlight="searchPhraseWithSynonims"
                        :additionalFound="event.numberOfHits > 1 ? (event.foundphrase + ', ...') : event.foundphrase"
                      ></live-coupon-event-footer>
                  </div>
                  <!-- PRE-MATCH -->
                  <h3 v-if="focompetition.events.filter(ev => ev.liveEvent).length > 0 && focompetition.events.filter(ev => !ev.liveEvent).length > 0">More results</h3>
                  <div class="event prematch"
                       v-for="(event, $index) in focompetition.events.filter(ev => !ev.liveEvent)"
                       :class="[selectedSportTypeComputed.idfosporttype,
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
                      <span class="event-name">
                        <span class="name">
                          <text-highlight :queries="searchPhraseWithSynonims">{{ ' ' + event.name }}</text-highlight>
                        </span>
                        <span v-if="event.foundphrase" class="additional-found">
                          <text-highlight :queries="searchPhraseWithSynonims">{{ ' ' + event.foundphrase }}</text-highlight>
                          <span v-if="event.numberOfHits > 1">, ...</span>
                        </span>
                      </span>
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
    <!-- FAVORITES -->
    <section v-show="!searchPhrase && playerFavorites && isLoggedIn && allPlayerFavorites && allPlayerFavorites.length > 0" class="favorites_on_search_page">
      <div class="favorites_header">{{ $t('Favorites.MyEvents.Tabs.Favorites') }}</div>
      <!-- Name of favorite - Not null for type in { P, C }. -->
      <!-- Favorite Id. Not nul for type in { S, L }. -->
      <div class="favorite-item" v-for="(favorit, index) in allPlayerFavorites" :key="index">
        <span @click="searchFavorite(favorit.name)" v-if="favorit.type === 'P' || favorit.type === 'C'">{{favorit.name}}</span>
        <span @click="searchFavorite(favorit.idfosporttype)" v-if="favorit.type === 'S' || favorit.type === 'L'">{{favorit.idfosporttype}}</span>
      </div>
    </section>
    <!-- FAVORITES END -->
    <section v-show="(!searchPhrase || searchPhrase.length < numOfCharsToStartSearch) && (!(allPlayerFavorites && allPlayerFavorites.length > 0) || !playerFavorites || !isLoggedIn)" class="before-search-start">
      <!--<img src="~@/assets/images/search/search-background.svg" alt="search" >-->
      <div class="header">{{$t('Search.SearchForCompetitionsTeamsPlayers')}}</div>
      <div class="body">{{$t('Search.ResultsWillShowAsYouType')}}</div>
    </section>
    <section v-show="searchPhrase && searchPhrase.length >= numOfCharsToStartSearch && !eventsLoaded" class="search-loading">
    <!--<section class="search-loading">-->
      <dots-loader></dots-loader>
      <div class="header">{{$t('Search.Loading')}}</div>
    </section>
    <section v-show="searchPhrase && searchPhrase.length >= numOfCharsToStartSearch && eventsLoaded && !(searchResultsProcessed && searchResultsProcessed.length > 0)" class="search-no-results">
      <!--<img src="~@/assets/images/search/search-background.svg" alt="search" >-->
      <div class="header">{{ $t('Search.NoResultsFound') }}</div>
      <div class="body">
        <div class="suggestions">
          <span>{{ $t('Search.Suggestions') }}</span>
          <ul>
            <li> - {{ $t('Search.Suggestions_1') }}</li>
            <li> - {{ $t('Search.Suggestions_2') }}</li>
            <li> - {{ $t('Search.Suggestions_3') }}</li>
          </ul>
        </div>
      </div>
    </section>
  </div>
</template>
<script>
  import Vue from 'vue'
  import config from '@/config'
  import store from '@/store'
  import TextHighlight from 'vue-text-highlight'
  // import Vue from 'vue'
  import Icon from '@/components/common/Icon'
  import dotsLoader from '@/components/common/DotsLoader'
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
      big3MarketsHeader,
      TextHighlight,
      dotsLoader
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
        numOfCharsToStartSearch: window.ctsautoconf.SEARCH_NUMBER_OF_CHARS_TO_START || 3
      }
    },

    computed: {
      liveBettingDataSourceType () {
        return store.getters['livebettingState/liveBettingDataSourceType']
      },
      searchResults () {
        var results = store.getters['searchState/getResults'] || []
        return results
      },
      searchResultsProcessed () {
        var results = (this.searchResults && this.searchResults.fosporttypes) || []
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
        return Vue._.orderBy(results, 'name', 'asc')
      },
      selectedSportTypeComputed () {
        if (this.searchResultsProcessed && this.searchResultsProcessed.length > 0) {
          if (!this.selectedSportType || (this.availableSportTypes.indexOf(this.selectedSportType.idfosporttype) === -1)) {
            this.selectedSportType = this.searchResultsProcessed[0]
          }
        } else {
          this.selectedSportType = undefined
        }

        return this.selectedSportType
      },
      availableSportTypes () {
        var sports = []

        if (this.searchResults && this.searchResults.fosporttypes && this.searchResults.fosporttypes.length > 0) {
          this.searchResults.fosporttypes.forEach((fosporttype) => {
            sports.push(fosporttype.idfosporttype)
          })
        }
        return sports
      },
      currentTab: {
        get: function () {
          return this.selectedSportType
        },
        set: function () {
          this.selectedSportType = this.availableSportTypes[0]
        }
      },
      eventsLoaded () {
        return store.getters['searchState/getEventsLoaded']
      },
      searchPhrase () {
        return store.getters['searchState/getPhrase']
      },
      searchPhraseWithSynonims () {
        if (this.searchResults && this.searchResults.searchedPhrases) {
          let phrases = []
          this.searchResults.searchedPhrases.forEach(phrase => {
            phrases.push(' ' + phrase)
          })
          return phrases
        }
        return []
      },
      numberOfHits () {
        return this.searchResults && this.searchResults.numberOfHits
      },
      routeToExitSearch () {
        return store.getters['searchState/getRouteToExitSearch']
      },
      playerFavorites () {
        return window.ctsautoconf.PLAYER_FAVORITES || false
      },
      isLoggedIn () {
        return store.getters['isLoggedIn']
      },
      allPlayerFavorites () {
        var results = store.getters['favorites/getAllFavorites'] || []
        return results
      }
    },

    methods: {
      selectSportType (idfosporttype) {
        this.selectedSportType = idfosporttype
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
      goToFoSport (fosport) {
        if (fosport.explicitlyfound) {
          this.$router.push({name: 'searchsport', params: { idfosport: fosport.idfosport }})
        }
      },
      goToFoCompetition (fosport, focompetition) {
        if (focompetition.explicitlyfound) {
          this.$router.push({name: 'searchcompetition', params: { idfocompetition: focompetition.idfocompetition, idfosport: fosport.idfosport }})
        }
      },
      exitSearch () {
        if (this.routeToExitSearch) {
          this.$router.push(this.routeToExitSearch)
        } else {
          this.$router.push('/')
        }
      },
      getAllFavorites () {
        if (this.isLoggedIn && this.playerFavorites) {
          store.dispatch('favorites/fetchAllFavorites')
        }
      },
      searchFavorite (name) {
        store.commit('searchState/setPhrase', name)
      }
    },
    mounted () {
      this.getAllFavorites()
    },
    watch: {
      searchPhrase () {
        this.selectedSportType = ''
      },
      isLoggedIn (newVal) {
        if (newVal) {
          this.getAllFavorites()
        }
      }
    }
  }
</script>
<style lang="stylus" scoped>
  @import '~@/css/config'
  @import "mixins"

  .search-component
    .back-button
      width 125px
      height 50px
      color #1493ff
      font-size 14px
      background-color #fff
      text-align center
      padding-top 10px
      cursor pointer
      border solid 1px #b9c4cb
      float right
      margin 3px 0 0 0

      &:before
        content ''
        width: 20px
        height 20px
        position relative
        left 0
        top 10px
        display inline-block
        background url("~@/assets/images/icons/arrow_left.svg") no-repeat
        background-size 6px
    .clickable
      cursor pointer
    .header-text
      h2
        text-transform none
        border none
        font-size 14px
        color #445058
        font-weight normal !important

    .before-search-start,
    .search-no-results,
    .search-loading
      text-align center
      padding 100px 0
      margin 0
      >>>.dots-loader
        background transparent
        border-top 0px
        box-shadow none
        height: 82px
        span
          font-size 90px
      .header
        font-size: 20px
        color #223f68
        letter-spacing 0
      .body
        font-size 16px
        color #445058
    .search-no-results
      .body
        text-align center
        .suggestions
          width 400px
          text-align left
          display inline-block
          margin-top 20px
    h2
      text-transform uppercase
      padding 10px
      border-bottom solid 1px #dfdfe7
    .wrapper
      flex 1
      padding 7px 10px
    .sports
      margin-bottom 10px
      .tabs
        height 60px
        >>>.tabs__bar
          margin 0 -12px
          background none
          // width 720px
          overflow hidden
          .tabs__wrapper
            .tabs__container
              height 50px
              .tabs__div.tab
                padding 0
                height 50px
                background none
                border-bottom solid 1px #B9C4CB
                a
                  flex-direction column
                  min-width 90px
                  color #1493ff
                  font-weight normal
                  white-space nowrap
                  font-size 20px
                  text-transform: none
                &.active
                  border-bottom solid 3px #1493ff
    .single-coupon-footer
      border none
      margin 0px
    .hheader
      margin 0px
    .fosports
      padding 0px 0 10px 0
      .fosport-container
        overflow hidden
        &:first-child
          margin-top 0
        &:last-child
          margin-bottom 350px
        h3
          padding 10px
        .sporttitle
          position relative
          height 40px
          margin-bottom 10px
          background-color #fff
          border-radius 0px
          box-shadow 0px 1px 4px 0px rgba(0,0,0,0.25)
          h2
            border none
            position absolute
            font-size 14px
            color #445058
            font-weight normal
            font-weight normal
          .viewsportcompetition
            right 0
            color #1493ff
            font-size 14px
            text-transform: none
            display flex
            align-items center
            &.clickable
              text-decoration none
        .focompetitions
          .focompetition-container
            /*margin-top 25px*/
            margin-bottom 10px
            background-color #fff
            border-radius 0px
            box-shadow 0px 1px 4px 0px rgba(0,0,0,0.25)
            .competitiontitle
              position relative
              height 40px
              font-size 14px
              line-height 15px
              display flex
              align-items center
              &.hasevents
                border-bottom solid 1px #DFDFE7
              h2
                border none
                position absolute
                text-transform none
                color #445058
                font-size 14px
                font-weight: normal
              .viewsportcompetition
                right 0
                color #1493ff
                font-size 14px
                text-transform: none
                display flex
                align-items center
                &.clickable
                  text-decoration none
            .events-container
              font-size 14px
              >>>.hheader
                // border none
              .event
                clear both
                background white
                border-bottom: 1px solid #cfd6db
                .wrapper
                  display flex
                  justify-content flex-start
                  margin 0px
                  align-items center
                  color #21335a
                  font-size 14px
                  height auto
                  >>>.event-info
                    section
                      margin 0
                  .time
                    padding-right 20px
                    min-width 155px
                    @media mobile-big-and-below
                      padding-right 10px
                      min-width 135px
                      font-size 12px
                  .event-name

                    .additional-found
                      font-size 11px
                      color #21335a
                      display inherit
                      font-family 'Open Sans SemiBold'
                   &.header
                      background-color #f2f2f2
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
                      font-family 'Open Sans Bold'
                      line-height 16px
                    .more-markets
                      text-transform uppercase
                      color #1493ff
                      font-size 14px
                      font-weight normal
                      text-align right
                      display flex
                      align-items center
                      justify-content: flex-end
                      margin-left auto
                      .arrowright
                        content ''
                        width: 16px
                        height 24px
                        display: inline-block
                        margin-left: 10px
                        background url("~@/assets/images/icons/arrow_right.svg") no-repeat center
                        background-size 6px

                  .nomarkets
                    color #ccc
                    border solid 2px #ccc
                    border-radius 5px
                    display inline-block
                    line-height 20px
                    width 130px
                    text-align center
                    height 40px
                    cursor default
                    padding-top 7px
                &.live
                  border-bottom solid 1px #dfdfe7
.igt
  .event.live
    .more-markets
      border: 1px solid #b6b6b6
      width: 30px
      height: 30px
      display inline-flex
      margin-left: 25px
      align-items: center
      justify-content: center
    >>>.single-coupon-footer
      position relative
      .additional-found
        position: absolute
        margin-left: auto
        margin-right: auto
        left: 0
        right: 0
        text-align: center
        @media mobile-big-and-below
          position unset
.numberOfEvents
  color: #0b4da1
  background: #fff 
  border 0px
  width: 25px
  height: 25px
  margin-left 5px
  font-size: 12px
  font-family: "Open Sans SemiBold"
  line-height: 25px
  border-radius: 50%
.favorites_on_search_page
  padding 10px 0
  .favorites_header
    border-bottom 1px solid #f2f2f2
    font-family 'Open Sans SemiBold'
    font-size 16px
  .favorite-item
    padding 3px 10px
    font-size 14px
    &:hover
      cursor pointer

</style>
