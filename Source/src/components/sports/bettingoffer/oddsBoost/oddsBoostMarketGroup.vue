<template>
  <div fluid class="marketgroup oddsboost clearfix" :class="['counter-' + counter]" v-if="marketgroup && marketgroup.idfwmarketgroup" :idfwmarketgroup="marketgroup.idfwmarketgroup.toString()">
    <h3 class="name" v-if="showMarketgroupName" @click.stop="toggleCollapse()">{{ marketgroup.marketgroupname }} </h3>
    <!-- events per COMPETITION or DAYANDCOMPETITION -->
    <div v-if="['EVENTSPERCOMPETITION', 'EVENTSPERDAY'].indexOf(eventsGrouping) > -1 &&
      (eventsGroupedByCompetition.length > 0 || eventsGroupedByDateAndCompetition)"
         class="coupon group-by-date" v-show="isExpanded">

      <template v-if="isDebug">
        eventsGrouping : {{ eventsGrouping }}
        isOddsBoost: {{ isOddsBoost }}
      </template>
      <!-- PREMATCH by COMPETITION -->
      <div v-if="eventsGrouping === 'EVENTSPERCOMPETITION'" v-for="(fosport, index) in eventsGroupedByCompetition" :key="index" class="date">
        <template v-if="isDebug">
          fosportinternalorder {{ fosport.fosportinternalorder }}
          isBig3Coupon {{ isBig3Coupon(fosport.events) }}
        </template>
        <!-- exclude outrights, just in case -->
        <div v-if="!fosport.events[0].markets[0].isoutright">
          <odds-boost-markets-header :coupontitle="marketgroup.idfwpopulationtype === 'NEXTOFFBYSPORTTYPEMKTTYPCLASSPER' ? fosport.fosportname :  marketgroup.marketgroupname"
                               v-if="anyEventWithOddsBoostMarketsExist(fosport.events)"
                               :idfosporttype="getIDFOSportType(fosport.events[0])"
                               :idfosport="fosport && fosport.events && fosport.events[0] && fosport.events[0].idfosport"></odds-boost-markets-header>

          <div :class="['event', {'last': $index === fosport.events.length - 1}, {'big-three-one-selection-per-event': isBig3Coupon(fosport.events) && maxNumberOfMarkets(fosport.events) === 1}]" v-for="(event, $index) in fosport.events" :key="$index" v-if="eventHasOddsBoostMarkets(event)">
            <odds-boost-coupon-event
              :event="event"
              :twoselections="!isBig3Coupon(fosport.events) && !hasDraw(fosport.events)"
              :threeselections="!isBig3Coupon(fosport.events) && hasDraw(fosport.events)"
              :isbig3coupon="isBig3Coupon(fosport.events)"
              :couponname="marketgroup.idfwpopulationtype === 'NEXTOFFBYSPORTTYPEMKTTYPCLASSPER' ? fosport.fosportname :  marketgroup.marketgroupname"
              :isOddsBoost="isOddsBoost"></odds-boost-coupon-event>
          </div>
        </div>
      </div>

      <!-- PREMATCH by DATEANDCOMPETITION -->
      <div v-if="eventsGrouping === 'EVENTSPERDAY'" v-for="(dateEvents, date, iterator) in eventsGroupedByDateAndCompetition" class="date" :key="iterator">
          <h4 class="eventsperday_header" v-if="isDateToday(date)">TODAY</h4>
          <h4 class="eventsperday_header" v-if="isDateTomorrow(date)">TOMORROW</h4>
          <h4 class="eventsperday_header" v-if="!isDateToday(date) && !isDateTomorrow(date)">{{ date | moment(dateFormats.shortDateMG) }} </h4>
        <!-- and by COMPETITIONS -->
        <div v-for="(fosport, index) in dateEvents" class="date-events" :key="index">
          <!-- exclude outrights, just in case -->
          <div v-if="!fosport.events[0].markets[0].isoutright">
            <odds-boost-markets-header :coupontitle="marketgroup.idfwpopulationtype === 'NEXTOFFBYSPORTTYPEMKTTYPCLASSPER' ? fosport.fosportname :  marketgroup.marketgroupname"
                               v-if="anyEventWithOddsBoostMarketsExist(fosport.events)"
                               :idfosporttype="getIDFOSportType(fosport.events[0])"
                               :idfosport="fosport && fosport.events && fosport.events[0] && fosport.events[0].idfosport"></odds-boost-markets-header>

            <div :class="['event', {'last': $index === fosport.events.length - 1}]"
                 v-for="(event, $index) in fosport.events" :key="$index" v-if="eventHasOddsBoostMarkets(event)">
              <odds-boost-coupon-event
                :event="event"
                :twoselections="!isBig3Coupon(fosport.events) && !hasDraw(fosport.events)"
                :threeselections="!isBig3Coupon(fosport.events) && hasDraw(fosport.events)"
                :isbig3coupon="isBig3Coupon(fosport.events)"
                :couponname="marketgroup.marketgroupname"
                :isOddsBoost="isOddsBoost"></odds-boost-coupon-event>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- NONGROUPEDEVENTS -->
    <div v-if="eventsGrouping === 'NONGROUPEDEVENTS' && filteredPrematchEvents" class="coupon non-grouped" v-show="isExpanded">
      <div v-if="!filteredPrematchEvents[0].markets[0].isoutright">
        <odds-boost-markets-header :coupontitle="marketgroup.marketgroupname"
                               v-if="anyEventWithOddsBoostMarketsExist(fosport.events)"
                               :idfosporttype="getIDFOSportType(filteredPrematchEvents[0])"
                               :idfosport="filteredPrematchEvents && filteredPrematchEvents[0] && filteredPrematchEvents[0].idfosport"></odds-boost-markets-header>

        <div :class="['event', {'last': $index === filteredPrematchEvents.length - 1}, {'big-three-one-selection-per-event': isBig3Coupon(filteredPrematchEvents) && maxNumberOfMarkets(filteredPrematchEvents) === 1}]" v-for="(event, $index) in filteredPrematchEvents" :key="$index" v-if="eventHasOddsBoostMarkets(event)">
          <odds-boost-coupon-event
            :event="event"
            :twoselections="!isBig3Coupon(filteredPrematchEvents) && !hasDraw(filteredPrematchEvents)"
            :threeselections="!isBig3Coupon(filteredPrematchEvents) && hasDraw(filteredPrematchEvents)"
            :isbig3coupon="isBig3Coupon(filteredPrematchEvents)"
            :couponname="marketgroup.marketgroupname"
            :isOddsBoost="isOddsBoost"></odds-boost-coupon-event>
        </div>
      </div>
    </div>
  </div>

</template>
<script>
  import Vue from 'vue'
  import store from '@/store'
  import config from '@/config'
  import markets from '@/components/sports/bettingoffer/markets'
  import LiveCouponEventFooter from '@/components/sports/bettingoffer/live/liveCouponEventFooter'
  import BettingOffer from '@/components/mixins/BettingOffer'
  import oddsBoostMarketsHeader from '@/components/sports/bettingoffer/oddsBoost/oddsBoostMarketsHeader'
  import oddsBoostCouponEvent from '@/components/sports/bettingoffer/oddsBoost/oddsBoostCouponEvent'
  import Branding from '@/components/mixins/Branding'

  export default {
    name: 'MarketGroup',

    props: [
      'idfwmarketgroup',
      'eventsGrouping',
      'selectedSports',
      'maxevents',
      'allSportsActive',
      'showMarketgroupName',
      'counter',
      'isOddsBoost'
    ],

    components: {
      oddsBoostCouponEvent,
      markets,
      LiveCouponEventFooter,
      oddsBoostMarketsHeader
    },

    mixins: [
      BettingOffer,
      Branding
    ],

    data () {
      return {
        isExpanded: true,
        periodicalUpdateTimeout: undefined,
        periodicalUpdateInterval: config.app.udpateIntervals.marketGroupPeriodicalUpdateInterval,
        isPeriodicalUpdateStarted: false,
        readonly: false,
        iterator: null
      }
    },

    computed: {
      marketgroup () {
        var marketgroups = store.getters['marketgroupState/marketgroups']

        if (marketgroups) {
          let marketgroup = marketgroups[this.idfwmarketgroup]
          if (marketgroup) {
            return marketgroups[this.idfwmarketgroup]
          } else {
            return undefined
          }
        } else {
          return undefined
        }
      },
      marketgroupEvents () {
        return (this.marketgroup && this.marketgroup.events &&
          this.marketgroup.events.filter(ev => !this.selectedSports || this.selectedSports.length === 0 || this.selectedSports.indexOf(ev.markets[0].idfosporttype) > -1 || this.selectedSports.indexOf(ev.idfosport) > -1)) || []
      },
      filteredPrematchEvents () {
        var liveEventsIds = this.liveEvents.map(ev => ev.idfoevent)
        var liveFOEventAntepost = this.liveEvents.filter(ev => ev.foeventantepost).map(event => event.foeventantepost)
        var prematchEvents = this.marketgroupEvents.filter(ev => liveEventsIds.indexOf(ev.idfoevent) === -1 && liveFOEventAntepost.indexOf(ev.idfoevent) === -1)

        if (prematchEvents && prematchEvents.length > 0) {
          if (this.maxevents && this.maxevents > 0) {
            return prematchEvents.slice(0, this.maxevents)
          } else {
            return prematchEvents
          }
        } else {
          return []
        }
      },
      eventsGroupedByCompetition () {
        if (this.eventsGrouping === 'EVENTSPERCOMPETITION' && this.filteredPrematchEvents && this.filteredPrematchEvents.length > 0) {
          var foSports = []
          this.filteredPrematchEvents.forEach(ev => {
            if (foSports.filter(sport => sport.idfosport === ev.idfosport).length === 0) {
              foSports.push({
                idfosport: ev.idfosport,
                fosportname: ev.sportname,
                fosportinternalorder: ev.markets[0].fosportinternalorder,
                events: Vue._.orderBy(this.filteredPrematchEvents.filter(ev1 => ev1.idfosport === ev.idfosport), ['internalorder', 'tsstart', 'participantname_away'])
              })
            }
          })

          return Vue._.orderBy(foSports, 'fosportinternalorder')
        } else {
          return []
        }
      },
      eventsGroupedByDateAndCompetition () {
        if (this.eventsGrouping === 'EVENTSPERDAY' && this.filteredPrematchEvents && this.filteredPrematchEvents.length > 0) {
          let orderedEvents = Vue._.orderBy(this.filteredPrematchEvents, 'tsdate')
          var dates = Vue._.groupBy(orderedEvents, 'tsdate')
          for (let date in dates) {
            var foSports = []
            dates[date].forEach(ev => {
              if (foSports.filter(sport => sport.idfosport === ev.idfosport).length === 0) {
                foSports.push({
                  idfosport: ev.idfosport,
                  fosportname: ev.sportname,
                  fosportinternalorder: ev.markets[0].fosportinternalorder,
                  events: Vue._.orderBy(dates[date].filter(ev1 => ev1.idfosport === ev.idfosport), ['internalorder', 'tsstart', 'participantname_away'])
                })
              }
            })

            dates[date] = Vue._.orderBy(foSports, 'fosportinternalorder')
          }
          return dates
        } else {
          return []
        }
      }
    },

    methods: {
      startMarketgroupByIdUpdate (idfwmarketgroup) {
        this.isPeriodicalUpdateStarted = true

        store.dispatch('marketgroupState/fetchMarketgroupById', idfwmarketgroup).then(() => {
          clearTimeout(this.periodicalUpdateTimeout)
          this.periodicalUpdateTimeout = setTimeout(() => {
            if (this.isPeriodicalUpdateStarted) {
              this.startMarketgroupByIdUpdate(idfwmarketgroup)
            }
          }, this.periodicalUpdateInterval)
        })
      },
      stopMarketgroupByIdUpdate () {
        this.isPeriodicalUpdateStarted = false
        clearTimeout(this.periodicalUpdateTimeout)
      },
      toggleCollapse () {
        this.isExpanded = !this.isExpanded
      },
      hasDraw (arrayOfEvents) {
        let hasDraw = false
        // Do not draw HOME/TIE/AWAY in big3-market-header for Golf
        if (['GOLF', 'MOTORSPORT', 'NASCAR'].indexOf(arrayOfEvents[0].markets[0].idfosporttype) > -1) {
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

      isBig3Coupon (events) {
        var nonBig3Markets = []

        events.forEach(ev => {
          if (ev.markets && ev.markets.length > 0) {
            ev.markets.forEach(mk => {
              if (!mk.big3markettype || config.app.autoconf.BIG3_IGNORE_SPORTTYPES.includes(mk.idfosporttype)) {
                nonBig3Markets.push(mk)
              }
            })
          }
        })

        return nonBig3Markets.length === 0
      },
      togglePanel (id) {
        let element = document.querySelector("[id='market-" + id + "']")
        if (!element.classList.contains('expansion-panel__container--active')) {
          if (id === 0) {
            element.querySelector('.market-name').classList.add('expanded-market')
            document.querySelector("[id='market-collapsed-" + id + "']").setAttribute('style', 'display:normal')
            document.querySelector("[id='market-expand-" + id + "']").setAttribute('style', 'display:none')
          } else {
            element.querySelector('.market-name').classList.add('expanded-market')
            document.querySelector("[id='market-collapsed-" + id + "']").setAttribute('style', 'display:normal')
            document.querySelector("[id='market-expand-" + id + "']").setAttribute('style', 'display:none')
          }
        } else {
          if (id === 0) {
            element.querySelector('.market-name').classList.remove('expanded-market')
            document.querySelector("[id='market-collapsed-" + id + "']").setAttribute('style', 'display:none')
            document.querySelector("[id='market-expand-" + id + "']").setAttribute('style', 'display:normal')
          } else {
            element.querySelector('.market-name').classList.remove('expanded-market')
            document.querySelector("[id='market-collapsed-" + id + "']").setAttribute('style', 'display:none')
            document.querySelector("[id='market-expand-" + id + "']").setAttribute('style', 'display:normal')
          }
        }
      },
      eventHasOddsBoostMarkets (event) {
        // event must has market with 'XP' csvpricetype and market must have selections with estimatepriceup & estimatepricedown
        let market = event && event.markets && event.markets[0]
        let marketHasCSVPriceTypeXP = market.csvpricetypes && market.csvpricetypes.split(',').includes('XP')
        let marketSelectionsHasEstPriceUpAndDown = market.selections && market.selections.every(selection => selection && selection.estimatepriceup && selection.estimatepricedown)
        return market && marketHasCSVPriceTypeXP && marketSelectionsHasEstPriceUpAndDown
      },
      anyEventWithOddsBoostMarketsExist (events) {
        let exist = false
        events.forEach(event => {
          if (this.eventHasOddsBoostMarkets(event)) {
            exist = true
          }
        })
        return exist
      }
    },

    created () {
      this.startMarketgroupByIdUpdate(this.idfwmarketgroup)
    },

    destroyed () {
      this.stopMarketgroupByIdUpdate()
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped>
  @import "../../../../css/config.styl"

  .marketgroup
    margin 5px 0 0 0
    border-radius 5px
    .name
      padding: 10px 15px
      margin: 0
    .coupon
      margin-bottom 0
      .date
        h4
          margin-bottom 0
          font-size: 16px
          // background #e5e8ed
          color #21335a
          font-weight bold
          user-select none
          // padding: 10px 15px
          padding 10px 15px 5px 15px
        .event:not(:first-child)
          border-top: 1px solid #DCDFE9
        .event
          background white
          &.last
            border-bottom: 1px solid #DCDFE9

        &.live
          .live-badge
            background-color #e24447
            color white
            width 20px
            display inline-block
            height 20px
            border-radius 50%
            text-align center
            font-size 12.5px
            font-weight 600
            position: relative
            top -1px
            line-height 20px
            margin-right 2px
      .date:first-child
        h4
          padding-top 0
  .market-collapse.v-expansion-panel
    -webkit-box-shadow: none
    -moz-box-shadow: none
    box-shadow: none
  .v-expansion-panel__container
    .v-expansion-panel__body
      border-radius 0px
    >>>.v-expansion-panel__header
      padding: 0
      .hheader
        border: 0px
        .head:hover
          cursor pointer
      .market-name
        display flex
        padding: 0
      .market-name-title
        margin: 0
      .icon-span
        text-align: right
        padding: 10px 15px 10px 0
        max-width: 30px
        .v-icon
          color #fff
      .market-name:hover
        cursor pointer
      .header__icon
        display: none
      .v-expansion-panel__header__icon
        display: none

  .showlive
    display none

.marketgroups
  .marketgroup:first-child
    .date
      h4
        padding-top 5px
        background #f2f2f2

.coupon
  >>>.v-expansion-panel__header
    background #0b4da1
</style>
