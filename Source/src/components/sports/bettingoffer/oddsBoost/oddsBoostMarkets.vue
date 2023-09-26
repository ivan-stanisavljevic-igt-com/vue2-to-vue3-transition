<template>

  <div :class="{'live-single-event':(diplayOnPage == 'live-single-event' ), 'coupon': (diplayOnPage == 'coupon')}" class="markets-wrapper">
    <div class="markets" v-if="markets">
      <template v-if="isDebug">
        MARKETS <br />
        isBig3Coupon {{ isBig3Coupon }}
      </template>

      <div v-if="isOddsBoost && market.csvpricetypes && market.csvpricetypes.split(',').includes('XP')" :class="['market', 'odds-boost', {
             'suspended': !market.istradable }]"
           v-for="(market, index) in filteredMarkets"
           :key="market.idfomarket"
           :idfomarket="market.idfomarket"
           :isfrompush="(market.V !== undefined).toString()">
        <div class="parent">
          <div class="selections layout all non-had" v-if="market && market.selections">
              <span v-if="selection.idfoselectionsuspensiontype !== 'N/O'" :class="['selection', 'flex', {'active': betslipSelections[selection.idfoselection]}]"
                    v-for="(selection) in vue._.orderBy(market.selections, ['internalorder', 'price'])"
                    :key="selection.idfoselection">
                <span class="odds-boost-selection-name">{{selection.name}}</span>
                <span class="selection-row">
                  <odds-boost-selection
                    :estimatedOrCurrentPrice="'estimated'"
                    :selection="selection"
                    :istradable="market.istradable"
                    :pricechangehighlight="true"></odds-boost-selection>
                  <div @click.stop="toggleSelection(selection, market)">
                    <odds-boost-selection
                      :estimatedOrCurrentPrice="'current'"
                      :selection="selection"
                      :istradable="market.istradable"
                      :pricechangehighlight="true"></odds-boost-selection>
                  </div>
                </span>
              </span>
            </div>
        </div>
      </div>

    </div>
  </div>

</template>
<script>
  import Vue from 'vue'
  import config from '@/config'
  import lib from '@/library'
  import store from '@/store'
  import Gtm from '@/components/mixins/Gtm'
  import selection from '@/components/sports/bettingoffer/selection'
  import Screen from '@/components/mixins/Screen'
  import big3MarketsHeader from '@/components/sports/bettingoffer/big3MarketsHeader'
  import BettingOffer from '@/components/mixins/BettingOffer'
  import Icon from '@/components/common/Icon'
  import LiveCouponEventFooter from '@/components/sports/bettingoffer/live/liveCouponEventFooter'
  import Session from '@/components/mixins/Session'
  import oddsBoostSelection from '@/components/sports/bettingoffer/oddsBoost/oddsBoostSelection'

  // Props - diplayOnPage - 'headline-market', coupon,

  export default {
    name: 'market',

    components: {
      selection,
      big3MarketsHeader,
      Icon,
      LiveCouponEventFooter,
      oddsBoostSelection
    },

    mixins: [
      Screen,
      BettingOffer,
      Gtm,
      Session
    ],

    props: [
      'markets',
      'maxnumofmarkets',
      'iscoupondisplay',
      'pricechangehighlight',
      'event',
      'diplayOnPage',
      'islivepredefined',
      'isbig3coupon',
      'couponname',
      'isOddsBoost'
    ],

    data () {
      return {
        vue: Vue,
        clickTO: null,
        clickModal: null,
        action: null,
        selectionsPrices: {},
        expandedMarkets: {},
        panel: true,
        counter: 0
      }
    },

    computed: {
      isLiveEventMarket () {
        return this.liveEvents.filter(ev => ev.idfoevent === this.event.idfoevent).length > 0
      },
      currentPath () {
        // For css only
        if (this.$route.path.indexOf('/sports/event/') > -1) {
          return 'SportsEvent'
        } else if (this.$route.path.indexOf('/sports/navigation/') > -1) {
          return 'SportsNavigation'
        } else {
          return undefined
        }
      },
      maxNumOfMarkets () {
        return parseInt(this.maxnumofmarkets) || 999
      },
      betslipSelections () {
        return store.getters['sbBetslipState/betslipSelectionsIds']
      },
      selectionsNo () {
        return store.getters['sbBetslipState/selectionsNo']
      },
      betslipMarkets () {
        var betslipMarkets = store.getters['sbBetslipState/getMarkets']
        var markets = {}

        for (var key in betslipMarkets) {
          markets[betslipMarkets[key].idfomarket] = betslipMarkets[key]
        }

        return markets
      },
      teasersPriceTypes () {
        return store.getters['sbBetslipState/teasersPriceTypes']
      },
      filteredMarkets () {
        if (this.markets && this.markets.length > 0) {
          let markets = this.markets.filter((market) => {
            let csvpricetypes = (market.csvpricetypes && market.csvpricetypes.split(',')) || []
            let isNotIncludedInPT = (t) => csvpricetypes.indexOf(t) === -1

//            return (market.selections && market.selections.length > 0 && csvpricetypes.indexOf('T1') === -1 &&
//            csvpricetypes.indexOf('T2') === -1 && csvpricetypes.indexOf('T3') === -1 &&
//            csvpricetypes.indexOf('T4') === -1 && csvpricetypes.indexOf('T5') === -1)

            return (market.selections && market.selections.length > 0 && this.teasersPriceTypes.every(isNotIncludedInPT))
          })

          let processedMarkets = []
          if (this.islivepredefined) {
            processedMarkets = markets
          } else {
            let originalIDFOEvent = markets && markets[0] && markets[0].idfoevent
            let liveEventForMarkets = this.liveEvents.find(ev => ev.idfoevent === originalIDFOEvent || ev.foeventantepost === originalIDFOEvent)
            if (liveEventForMarkets) {
              markets.forEach(mk => {
                let liveMarket = liveEventForMarkets.markets && liveEventForMarkets.markets.find(mk1 => mk.idfomarket === mk1.idfomarket)
                if (liveMarket) {
                  processedMarkets.push(liveMarket)
                } else {
                  processedMarkets.push(mk)
                }
              })
            } else {
              processedMarkets = markets
            }
          }
          return processedMarkets
          // // PLAYING AND TESTING 3+ SELECTION MARKET -> INTERNAL ORDER
          // // filter all 3+ selection markets
          // processedMarkets = processedMarkets.filter(m => m.selections.length > 3)
          // if (processedMarkets.filter(m => m.selections.length > 3).length > 0) {
          //   let io = 50
          //   processedMarkets.forEach(m => {
          //     m.selections.forEach(s => {
          //       s.internalorder = io
          //       io += 100
          //     })
          //   })
          //   return processedMarkets
          // } else return []
        } else {
          return []
        }
      },
      isBig3Coupon () {
        if (this.isbig3coupon === undefined) {
          return this.filteredMarkets && this.filteredMarkets[0] &&
            !config.app.autoconf.BIG3_IGNORE_SPORTTYPES.includes(this.filteredMarkets[0].idfosporttype) &&
            this.filteredMarkets.filter(mk => !mk.big3markettype || mk.gameperiod !== '1+').length === 0
        } else {
          return this.isbig3coupon
        }
      },
      pointsMarket () {
        if (this.isBig3Coupon) {
          return this.filteredMarkets.find(mk => mk.big3markettype === 'PS' && mk.gameperiod === '1+')
        }

        return undefined
      },
      moneyMarket () {
        if (this.isBig3Coupon) {
          return this.filteredMarkets.find(mk => mk.big3markettype === 'ML' && mk.gameperiod === '1+')
        }

        return undefined
      },
      totalMarket () {
        if (this.isBig3Coupon) {
          return this.filteredMarkets.find(mk => mk.big3markettype === 'TP' && mk.gameperiod === '1+')
        }

        return undefined
      },
      sortedSelections () {
        return (selections) => {
          if (selections && selections.length > 0) {
            return Vue._.orderBy(selections, ['internalorder', 'price', 'name'])
          } else {
            return []
          }
        }
      },
      marketNameForHeaderForEventMarketGroupWithOneMarket () {
        if (this.markets && this.markets.length === 1) {
          return this.markets[0].big3markettype
        } else return null
      },
      isLoggedIn () {
        return store.getters['isLoggedIn']
      },
      isPointsMarketAvailableForBB () {
        return (this.pointsMarket && this.pointsMarket.BB) || undefined
      },
      isMoneyMarketAvailableForBB () {
        return (this.moneyMarket && this.moneyMarket.BB) || undefined
      },
      isTotalMarketAvailableForBB () {
        return (this.totalMarket && this.totalMarket.BB) || undefined
      },
      isNonBig3MarketAvailableForBB () {
        return (!(this.totalMarket || this.moneyMarket || this.pointsMarket) && this.filteredMarkets.find(mk => mk.BB)) || undefined
      }
    },

    methods: {
      isHadMarket (market) {
        if (market.selections) {
          return market.selections.filter(sel => sel.hadvalue === 'H').length > 0 ||
            market.selections.filter(sel => sel.hadvalue === 'D').length > 0 ||
            market.selections.filter(sel => sel.hadvalue === 'A').length > 0 ||
            market.selections.filter(sel => sel.hadvalue === 'U').length > 0
        } else {
          return []
        }
      },
      getSelectionsByHAD (selections, hadvalue) {
        return (selections && selections.filter(sel => sel.hadvalue === hadvalue)) || []
      },
      drawSelectionForHadvalue (market, hadvalue) {
        return (market.idfohadtype === 'HA' && ['H', 'A'].indexOf(hadvalue) > -1) ||
        (market.idfohadtype === 'HAD' && ['H', 'D', 'A'].indexOf(hadvalue) > -1) ||
        (market.idfohadtype === 'OU' && ['O', 'U'].indexOf(hadvalue) > -1)
      },
      formatCurrentMatchHandicap (market) {
        if (market.isunderover === 'true') {
          return market.currentmatchhandicap.toString().replace('-', '')
        } else {
          return market.currentmatchhandicap > 0 ? ('+' + market.currentmatchhandicap) : market.currentmatchhandicap
        }
      },
      formatSelectionPrice (selection) {
        if (!isNaN(parseFloat(selection.currentpriceup)) && !isNaN(parseFloat(selection.currentpricedown))) {
          let price = 1 + selection.currentpriceup / selection.currentpricedown
          let priceus = 0
          let sign = ''

          if (config.app.priceFormat === 'US') {
            if (price >= 2) {
              priceus = 100 * (price - 1)
              sign = '+'
            } else {
              priceus = -100 / (price - 1)
              sign = ''
            }

            return sign + priceus.toFixed(0)
          } else {
            return price.toFixed(2)
          }
        } else {
          return undefined
        }
      },
      placeAsSingle (selection, market) {
        lib.core.logger.debugConsoleLog('Place as Single BetSlip', 0)
        store.dispatch('sbBetslipState/toggleBetslipSelection', [selection, market, true, this.event])
      },
      toggleSelection (selection, market) {
        this.userIsActive()
        var markettypedict = {
          PS: 'spread',
          ML: 'money',
          TP: 'total'
        }
        var marketType = this.isBig3Coupon && market.big3markettype && markettypedict[market.big3markettype]
        var couponTitle = this.couponname
        var competition = this.event.fosportname || this.event.sportname || this.event.idfosport || market.idfosport
        var sport = market.idfosporttype
        var inplay = this.isLiveEvent(market.idfoevent)

        if (this.betslipSelections[selection.idfoselection]) {
          this.sendGTMRemoveCouponSelectionsFromBetslip(marketType, couponTitle, competition, sport, inplay, this.selectionsNo, selection, market)
        } else {
          if (market.istradable) {
            this.sendGTMAddSelectionToBetslip(marketType, couponTitle, competition, sport, inplay, this.selectionsNo === 0, selection, market)
          } else {
            this.sendGTMAddSelectionToBetslipBlocked('suspended', couponTitle, competition, sport, inplay, this.selectionsNo === 0, selection, market)
          }
        }

        store.dispatch('sbBetslipState/toggleBetslipSelection', [selection, market, false, this.event])
      },
      getSportOrFoSportName (markets, param) {
        let sportOrFoSportName = 'empty'
        switch (param) {
          case 'sport-name':
            if (markets) {
              markets.forEach(market => {
                if (market && market.idfosporttype) {
                  // remove whitespaces
                  sportOrFoSportName = market.idfosporttype.replace(/ /g, '')
                }
              })
            }
            break
          case 'fo-sport-name':
            if (markets) {
              markets.forEach(market => {
                if (market && market.sportname) {
                  sportOrFoSportName = market.sportname
                }
              })
            }
            break
        }
        return sportOrFoSportName
      },
      toggleExpandMarket (idfomarket) {
        this.userIsActive()
        Vue.set(this.expandedMarkets, idfomarket, !this.expandedMarkets[idfomarket])
      },
      noOfColumns (market) {
        let className
        if ((market.selections.filter(sel => sel.internalorder >= 2000).length > 0) &&
              (market.selections.filter(sel => sel.internalorder >= 1000 && sel.internalorder < 2000).length > 0) &&
              (market.selections.filter(sel => sel.internalorder < 1000).length > 0)) {
          className = 'three-columns'
        } else if (((market.selections.filter(sel => sel.internalorder < 1000).length > 0) && (market.selections.filter(sel => sel.internalorder >= 1000 && sel.internalorder < 2000).length > 0)) ||
              ((market.selections.filter(sel => sel.internalorder < 1000).length > 0) && (market.selections.filter(sel => sel.internalorder >= 2000).length > 0)) ||
              ((market.selections.filter(sel => sel.internalorder >= 1000 && sel.internalorder < 2000).length > 0) && (market.selections.filter(sel => sel.internalorder >= 2000).length > 0))) {
          className = 'two-columns'
        } else {
          className = 'one-column'
        }
        return className
      },

      /*
      Display or not collapse/expand for markets based on multiple conditions:
      1. if market has more then 9 sel OR
      2. if market has more then 3 sel AND doesn't have selections for columns 'two' AND or 'three' (internal order) OR
      3. if market has more then 3 sel for columns 'two' OR 'three'
      - 'N/O' / suspended selection, for live markets
      */
      marketCondition (market) {
        if (market.selections.filter(sel => sel.idfoselectionsuspensiontype !== 'N/O').length > 9 ||
         (market.selections.filter(sel => sel.idfoselectionsuspensiontype !== 'N/O').length > 3 &&
         (((market.selections.filter(sel => sel.internalorder >= 1000 && sel.internalorder < 2000 && sel.idfoselectionsuspensiontype !== 'N/O').length === 0 && market.selections.filter(sel => sel.internalorder >= 2000 && sel.idfoselectionsuspensiontype !== 'N/O').length === 0)) ||
         (market.selections.filter(sel => sel.internalorder >= 1000 && sel.internalorder < 2000 && sel.idfoselectionsuspensiontype !== 'N/O').length > 3 || market.selections.filter(sel => sel.internalorder >= 2000 && sel.idfoselectionsuspensiontype !== 'N/O').length > 3)))) {
          return true
        } else {
          return false
        }
      }
    },
    watch: {
      markets (markets) {
        var betslipMarkets = markets.filter(mk => this.betslipMarkets[mk.idfomarket])
        if (betslipMarkets.length > 0) {
          store.dispatch('sbBetslipState/checkForBetSlipUpdate', betslipMarkets)
        }
      }
    }
    // mounted () {
    //   if (this.filteredMarkets && this.filteredMarkets.length > 0) {
    //     var marketsToSubscribe = this.filteredMarkets.filter(mk => mk.V)
    //   }
    //
    //   if (marketsToSubscribe && marketsToSubscribe.length > 0) {
    //     lib.WebSocketLiveService.addMarketsToSubscribeQueue(marketsToSubscribe)
    //   }
    // },
    //
    // destroyed () {
    //   if (this.filteredMarkets && this.filteredMarkets.length > 0) {
    //     var subscribedMarkets = this.filteredMarkets.filter(mk => mk.subscriptionId)
    //
    //     if (subscribedMarkets && subscribedMarkets.length > 0) {
    //       lib.WebSocketLiveService.addMarketsToUnsubscribeQueue(subscribedMarkets)
    //     }
    //   }
    // },
    //
    // watch: {
    //   filteredMarkets (newMarkets, oldMarkets) {
    //     var marketsToSubscribe = []
    //
    //     if (newMarkets && newMarkets.length > 0) {
    //       newMarkets.forEach(newMarket => {
    //         let oldMarket = oldMarkets.find(mk => mk.idfomarket === newMarket.idfomarket)
    //
    //         if (newMarket.V && (!oldMarket || !oldMarket.V) && !newMarket.subscriptionId) {
    //           marketsToSubscribe.push(newMarket)
    //         }
    //       })
    //
    //       if (marketsToSubscribe.length > 0) {
    //         lib.WebSocketLiveService.addMarketsToSubscribeQueue(marketsToSubscribe)
    //       }
    //     }
    //   }
    // }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus">
@import '~@/css/config'
  .show-more-btn:not(.in-play-live-coupon)
    width 100%
  .show-more-btn
    clear both
    text-align center
    height: 42px
    background-color: #f2f2f2
    .v-btn
      margin 0
      color #0b4da1

  .selections-container
    > .flex
      display: flex
      flex-wrap: wrap
      align-items: stretch
      .selections-mobile
        width: 33%
        border-right: 1px solid #cfd6db
        display: flex
        &.mobile
          width 100%
          border none
        &:nth-child(3n)
          border none
        .selection-data
          display: flex
          align-items: center
          flex: 1
  .eventmarketgroup
    .markets-wrapper
      @media mobile-big-and-below
        margin 0 4px 0px
      .markets
        .selections-in-columns
          .flex-more3-container
            display flex
            width 100%
            .flex-item
              padding 11px 12px
              border-right 1px solid #cfd6db
              flex unset
              display inline-block
              width 33%
              @media mobile-big-and-below
                display block
              &:nth-child(3)
                border none
              .selections
                align-items center
                padding 2px 0
                .selection
                  padding 0
                  width 60px!important
                  flex unset
                .selectionname
                  line-height 1.5
                  white-space normal
        // &.single
        //   @media mobile-big-and-below
        //     margin 0 4px 2px
  .eventmarketgroup .markets
    .selections-in-columns
      padding 0
      .selections-container
        padding: 0
        .flex
          @media mobile-big-and-below
            padding 9px 0
          .selections-mobile
            width: 100%
            display: flex
            &.mobile
              width 100%
              border none
            &:nth-child(3n)
              border none
            .selection-data
              display: flex
              align-items: center
              flex: 1
        .selections
          @media mobile-big-and-below
            padding 12px 0
            display block
          .selection
            border-right 1px solid #cfd6db
            display flex
            margin: 0
            padding: 12px
            @media mobile-big-and-below
              padding 2px 12px
              border none
            &:last-child
              border: none
            .selection-column
              display flex
              align-items center
              width 100%
              .selection-name, .selection-wrapper
                flex 1
                font-size 14px
              .selection-name
                // text-overflow ellipsis
                // overflow hidden
                // white-space nowrap
                line-height 1.3
                margin-right 3px
                width 0px
                cursor default
              .selection-wapper
                margin 2px
                flex-grow 0
                align-items center
                justify-content center
                min-height 40px
                  height 100%
                font-size 14px
                >>> .value
                  display: flex
                  align-items: center
                  justify-content: center
                  flex: 1
                  .had-value,
                  .uo-currenthandicap,
                  .sh
                    // flex: 1
                  .sh
                    max-width 50px
                    display inline-block
      .market.name
        display none
    .big3
      // ceper
      background: #fff
      border: 1px solid #cfd6db
      padding 8px 5px 8px 9px
      border-bottom-left-radius 0px
      border-bottom-right-radius 0px
      .market
        // display: flex
        display: block
        min-width: 0
        margin: 0
        padding-left 1px
        &.name
          flex-direction: column
          .layout
            display: flex
            white-space normal
            overflow initial
            display: table
            .name
              line-height initial
              display table-cell
              vertical-align middle
            .smaller
              font-size 10px
              text-transform capitalize
              display: table-row
              line-height: 8px
        &.has-pitchers
          .layout
            div
              &:first-child
                line-height 20px
          .smaller
            line-height 15px
        .selection
          display: flex
          height: 100%
          .selection-wapper
            display flex
            margin: 2px 0
            padding: 2px
            align-items: center
            justify-content: center
            height 40px
            width 130px
            @media mobile-big-and-below
              width 48px
  .markets
    .market
      .market-name
        display flex
        background #fff
        border-top 1px solid #cfd6db
        border-left 1px solid #cfd6db
        border-right 1px solid #cfd6db
        border-top-right-radius 5px
        border-top-left-radius 5px
        padding 10px 15px
        margin: 0
        color #21335a
        font-weight bold
        cursor: default
      .time
        width: 100%
        align-items: center
        color: #818e95
        line-height: 14px
        padding: 0px 15px 5px 9px
        -webkit-box-align: center
        font-size: 12px
        display: flex
        justify-content: space-between
  .date.live
    .markets
     .time
      display none
  .markets.single
    overflow unset
    .big3
      .market
        display inline-block
        vertical-align top
        .empty
          width 130px
          @media mobile-big-and-below
            width 60px!important
            margin 0 1px
    .selections
      .selection
        margin: 0 2px
      .selection:first-child
        margin-left 2px
        span
          margin-right: 0
          border-radius 5px
    .flex-more3-container
      .selections
        display flex
        .selectionname
          flex 1
          font-size: 14px
          color #1f375b
          overflow hidden
          text-overflow ellipsis
          margin-bottom 0px
          line-height 35px
        .selection
          flex 1
          justify-content flex-end
          .selection-wapper
            flex 0.33

    .big3
      .market
        .selections
          padding 0
          flex 1
          flex-grow 0.33
          .selection
            margin: 0
            .selection-wapper
              // margin 2px 1px
              height 40px
              width 130px
                @media mobile-big-and-below
                  width 53px
              line-height 13px
              padding: 0
              .value
                background: #f0f3f8
                padding: 13px 9px
                font-size 14px
                cursor pointer
                border-radius 5px
          &.active
            .selection-wapper
              .value
                border none
  .markets.multiple
    .big3
      white-space nowrap
      .empty
        width 130px
        @media mobile-big-and-below
          width 60px!important
          margin 0 1px
      .market
        display inline-block
        vertical-align: middle
        @media only screen and (min-width: 320px) and (max-width: 320px)
          .browser-safari.os-ios &
            //width: 60px
        &.money
          .selection-wapper
            .value
              .selectionprice
                line-height 38px
        .selections
          padding 0
          .row.wrap
            padding 0
            .selection
              .selection-wapper
                margin 2px
                text-align center
                border-radius 2px
                background #f0f3f8
                height 40px
                padding-top 1px
                cursor pointer
        &.total
          .selection
            .selection-wapper
              .uo-currenthandicap
                color black
            &.active
              .selection-wapper
                .uo-currenthandicap
                  color white
                  font-weight 400
                  &:hover
                    color white

.market-collapse.v-expansion-panel
   -webkit-box-shadow: none
   -moz-box-shadow: none
   box-shadow: none
  .v-expansion-panel__container
    border-bottom-right-radius: 0px !important
    border-bottom-left-radius: 0px !important
    .v-expansion-panel__body
    >>>.v-expansion-panel__header
      padding: 0
      display none
      .market-name-title
        margin: 0
      .market-name:hover
        cursor pointer
      .header__icon
        display: none
      .v-expansion-panel__header__icon
        display: none


.url-event
  .market-collapse.v-expansion-panel
    .v-expansion-panel__container
      .v-expansion-panel__body
        border-radius 0px
      >>>.v-expansion-panel__header
        border-top: 1px solid #cfd6db
        border-left: 1px solid #cfd6db
        border-right: 1px solid #cfd6db
        border-top-right-radius: 0px
        border-top-left-radius: 0px
        display: none
        .header__icon
          padding-right: 12px
          display: inline
        .v-expansion-panel__header__icon
          padding-right: 12px
          display: inline
        .market-name
          border-right: none !important
          border: 0px !important
        .market-name:hover
          cursor pointer
.event.last
  .show-more-btn
    border-bottom-right-radius: 5px
    border-bottom-left-radius: 5px
.event.last
  .show-more-btn.in-play-live-coupon
    border-bottom-right-radius: 5px
    border-bottom-left-radius: 5px
.live-single-event
  .show-more-btn
    border-bottom-right-radius: 5px
    border-bottom-left-radius: 5px

.browser-internet-explorer
  .eventmarketgroup .markets
    .selections-in-columns
      .selections-container
        .selections
          .selection
            .selection-column
              .selection-wapper
                >>> .value
                  .had-value,
                  .uo-currenthandicap,
                  .sh
                    max-width 100%

.missingMarketsHolder
  width 130px
  height 40px
  @media mobile-big-and-below
    width 53px !important

.selection
  min-height 40px
</style>

