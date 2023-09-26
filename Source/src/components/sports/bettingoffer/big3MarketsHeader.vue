<template>
  <header class="hheader"  :class="{'not-big3': !isBig3Coupon}">
    <!-- Header Sport Icon placeholder -->
    <!-- @TODO Need to implement actual icons -->
    <template v-if="isDebug">
      MARKETS HEADER <br />
      isBig3Coupon {{ isBig3Coupon }} <br />
      hasDraw {{ hasDraw }}<br />
      maxNoOfSelections {{ maxNoOfSelections }}
    </template>
    <section class="head">
      <h4>
        <icon :colorName="'white'" :name="`icon-${ (idfosporttype && idfosporttype.replace(/ /g, '')) || 'empty' }`"></icon>
        <span class="coupontitle">{{ coupontitle }}</span>
        <sgp-tag :markets="markets" :isLive="isLiveEventPage" :isForCoupon="'Big3'" ></sgp-tag>
      </h4>
    </section>
    <template v-if="isBig3Coupon">
      <!--This will be displayed on coupon page only -->
      <section class="big3-markets-header layout" :class="{'big3-column-order': big3ColumOrderEnabled}">
        <div :class="['markets-title', {'available-for-bb': isPointsMarketAvailableForBB }, big3PointsSpreadOrder]">
          <span v-if="isPointsMarketAvailableForBB" class="available-for-bb"></span>
          <h4 class="big3-market-name">{{ $t('MarketsHeader.MarketName.Spread') }}</h4>
        </div>
        <div :class="['markets-title', {'available-for-bb': isMoneyMarketAvailableForBB }, big3MoneyLineOrder]">
          <span v-if="isMoneyMarketAvailableForBB" class="available-for-bb"></span>
          <h4 class="big3-market-name">{{ $t('MarketsHeader.MarketName.Money') }}</h4>
        </div>
        <div :class="['markets-title', {'available-for-bb': isTotalMarketAvailableForBB }, big3TotalPointsOrder]">
          <span v-if="isTotalMarketAvailableForBB" class="available-for-bb"></span>
          <h4 class="big3-market-name">{{ $t('MarketsHeader.MarketName.Total') }}</h4>
        </div>
        <span v-if="!mobileBigAndBelow && brandLayout !=='generic' && brandKey !== 'sb' && brandKey !== 'mav' && brandKey !== 'qcasino' && brandKey !== 'pr'" class="more_bets">{{ $t('MarketsHeader.MoreBets') }}</span>
      </section>
    </template>
    <template v-if="!isBig3Coupon">
      <!-- Show 1 x 2 if there is Draw (HAD) in selections -->
      <section class="markets-header layout  no-draw" v-if="hasDraw && maxNoOfSelections <= 3">
        <div class="markets-title"><h4 class="big3-market-name">{{ $t('MarketsHeader.MarketName.Home') }}</h4></div>
        <div class="markets-title"><h4 class="big3-market-name">{{ $t('MarketsHeader.MarketName.Tie') }}</h4></div>
        <div class="markets-title"><h4 class="big3-market-name">{{ $t('MarketsHeader.MarketName.Away') }}</h4></div>
        <span v-if="!mobileBigAndBelow && brandLayout !=='generic' && brandKey !== 'sb' && brandKey !== 'mav' && brandKey !== 'qcasino' && brandKey !== 'pr'" class="more_bets">{{ $t('MarketsHeader.MoreBets') }}</span>
      </section>

      <!-- Show avb (1x2) if there is Draw (HAD) in selections -->
      <section class="markets-header layout" v-if="!hasDraw && maxNoOfSelections <= 3 && ['GOLF', 'MOTORSPORT', 'NASCAR'].indexOf(idfosporttype) === -1 && !isoutright">
        <!-- <div class="markets-title"><h4 class="big3-market-name"></h4></div>
        <div class="markets-title"><h4 class="big3-market-name"></h4></div> -->
        <div class="markets-title"><h4 class="big3-market-name">{{ $t('MarketsHeader.MarketName.Winner') }}</h4></div>
        <span v-if="!mobileBigAndBelow && brandLayout !=='generic' && brandKey !== 'sb' && brandKey !== 'mav' && brandKey !== 'qcasino' && brandKey !== 'pr'" class="more_bets">{{ $t('MarketsHeader.MoreBets') }}</span>
      </section>
    </template>
  </header>
</template>
<script>
  import Icon from '@/components/common/Icon'
  import BettingOffer from '@/components/mixins/BettingOffer'
  import Screen from '@/components/mixins/Screen'
  import Branding from '@/components/mixins/Branding'
  import Big3ColumnOrder from '@/components/mixins/Big3ColumnOrder'
  import sgpTag from '@/components/sports/betslipV2/common/marketSgpTag'

  export default {
    name: 'big3MarketsHeader',

    components: {
      Icon,
      sgpTag
    },

    mixins: [
      BettingOffer,
      Screen,
      Branding,
      Big3ColumnOrder
    ],

    props: [
      'coupontitle',
      'markets',
      'diplayOnPage',
      'isLiveEventPage',
      'isBig3Coupon',
      'hasDraw',
      'maxNoOfMarkets',
      'maxNoOfSelections',
      'idfosporttype',
      'idfosporttype1',
      'marketNameForHeaderForEventMarketGroupWithOneMarket',
      'isoutright',
      'isPointsMarketAvailableForBB',
      'isMoneyMarketAvailableForBB',
      'isTotalMarketAvailableForBB',
      'isNonBig3MarketAvailableForBB'
    ],

    created () {
      this.setBig3ColumnOrderSportType(this.idfosporttype || this.idfosporttype1)
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped>
  @import "~@/css/config"
  @import "~@/css/sportIcons"

  .hheader
    display flex
    background #0B4DA1
    flex-grow: 8

    .igt-icon
      position: relative
      top: 0px
      margin-right: 3px

      >>> .css
        width: 16px
        height: 16px
        position: relative
        // top: -1px

      >>> .css.icon-icehockey
        width: 16px

    .big3-markets-header,
    .markets-header
      margin-right 6px
      text-align right
      display inline-block
      white-space nowrap
      .markets-title
        line-height 41px
        text-transform: uppercase
        color: #fff
        user-select none
        display inline-block
        text-align center
        justify-content center
        width 130px
        @media mobile-big-and-below
          width 53px
        h4.big3-market-name
          font-size 12px
          font-family 'Open Sans Regular'
          text-align center
          font-weight normal
        &.available-for-bb
          @media mobile-big-and-below
            position relative
          .big3-market-name
            display inline-block
          .available-for-bb
            display inline-block
            width 22px
            height 17px
            background url(icons-path'/'available-for-bb_white'.svg')
            background-repeat no-repeat
            background-position center
            background-size 100%
            vertical-align middle
            @media mobile-big-and-below
              position absolute
              left 0
              right 0
              margin auto
              top -1px
              width 20px

.coupon
  .coupontitle
    @media mobile-big-and-below
      position relative
      top 1px

.os-ios
  .coupon
    .coupontitle
      @media mobile-big-and-below
        position relative
        top 0.15rem

.live-event-container
    .hheader
      .igt-icon
        >>> .css
          top: -1px

.os-macos
  .coupon
    .coupontitle
      @media mobile-big-and-above
        position relative
        top 0.15rem
.os-windows
  .coupon
    .coupontitle
      @media mobile-big-and-above
        position relative
        top 0rem
.more_bets
  color #ffffff
  text-transform uppercase
&.url-event .hheader .more_bets
  display none

</style>
