<template>
  <div v-if="event" :idfoevent="event.idfoevent.toString()">
    <v-layout coupon-event :class="[{'odds-boost': isOddsBoost}, event.markets[0].idfosporttype]">
      <div class="market">
        <odds-boost-markets v-if="isOddsBoost" class="markets-container"
                 :markets="isbig3coupon ? event.markets : [event.markets[0]]"
                 :event="event"
                 :iscoupondisplay="!!event.participantname_away"
                 :diplayOnPage="'coupon'"
                 :isbig3coupon="isbig3coupon"
                 :couponname="couponname"
                 :isOddsBoost="isOddsBoost"></odds-boost-markets>
      </div>
    </v-layout>

    <!-- Single coupon footer -->
    <section v-if="event.markets && event.markets[0].selections.length <= 9 || !event.markets[0].isoutright" class="single-coupon-footer">
      <!-- Display date-time for event-->
      <div class="time">
        <span v-if="isDateToday(event.tsstart)">Today {{ (event.tsstart) | moment(dateFormats.longTime)}}</span>
        <span v-if="isDateTomorrow(event.tsstart)">Tomorrow {{ (event.tsstart) | moment(dateFormats.longTime)}}</span>
        <span v-if="!isDateToday(event.tsstart) && !isDateTomorrow(event.tsstart)">{{ event.tsstart | moment(dateFormats.longDateTimeMG) }} </span>
        <span v-if="timeZone">[{{ timeZone }}]</span>
      </div>
      <!-- Link for more markets in coupon -->
      <div class="highlight">
        <!-- <span class="arrow-blue"></span> -->
        <i aria-hidden="true" class="icon material-icons">arrow_upward</i>
        <span class="boost">BOOST</span>
      </div>
    </section>
  </div>
</template>
<script>
  import markets from '@/components/sports/bettingoffer/markets'
  import BettingOffer from '@/components/mixins/BettingOffer'
  import Gtm from '@/components/mixins/Gtm'
  import oddsBoostMarkets from '@/components/sports/bettingoffer/oddsBoost/oddsBoostMarkets'
  import Icon from '@/components/common/Icon'

  export default {
    name: 'couponEvent',

    props: [
      'event',
      'twoselections',
      'threeselections',
      'isbig3coupon',
      'couponname',
      'isOddsBoost'
    ],

    components: {
      markets,
      oddsBoostMarkets,
      Icon
    },

    mixins: [
      BettingOffer,
      Gtm
    ],

    computed: {
      timeZone () {
        return window.ctsautoconf.TIMEZONE_DISPLAY
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus">
  $image-base-url = '~@/assets/images/icons/svg/'
  @import '~@/css/config'
  @import '~@/css/mixins'
.coupon-event:not(.outright)
  .market
    display flex
    align-items center
    .markets-wrapper.markets-container.coupon
      display inline-block
      width calc(100% - 65px)
    .more-markets
      border 1px solid #b6b6b6
      display inline-flex
      align-items center
      justify-content center
      width 30px
      height 30px
      margin-left 25px
      background #fff
  .market
    display flex
    align-items center
    .markets-wrapper.markets-container.coupon
      display inline-block
      width 100%
    .more-markets
      border 1px solid #b6b6b6
      display inline-flex
      align-items center
      justify-content center
      width 30px
      height 30px
      margin-left 25px
      background #fff
    .big3
      .market
        .selection
          .selection-wapper.selection-data
            margin 2px 1px 2px 0px
  .participants
    .eventTitle
      @media mobile-big-and-below
        display table
        .name
          @media mobile-big-and-below
            display table-cell
            max-width 125px
.highlight
  background #ff671f
  width 130px
  color white
  text-align center
  @media mobile-big-and-below
    width 65px
  i.icon.material-icons
    font-size 14px
    position relative
    top 3px
.single-coupon-footer
  display flex 
  justify-content space-between
  align-items center

</style>
