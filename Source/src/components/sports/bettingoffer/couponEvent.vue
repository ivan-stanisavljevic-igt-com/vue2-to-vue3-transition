<template>
  <div v-if="event" :idfoevent="event.idfoevent.toString()" class="coupon-event-wrapper">
    <div v-if="isDebug">
      EVENT<br />
      event.idfoevent {{ event.idfoevent }} <br />
      event.internalorder {{ event.internalorder }}
    </div>
    <v-layout coupon-event
              :class="[{'outright': event && event.markets && event.markets[0] && (event.markets[0].isoutright || !event.ismatch) },
                        {'outright3Plus': (event && event.markets && event.markets[0] && (event.markets[0].isoutright || !event.ismatch)) && event.markets[0].selections.length > 3},
                        {'threeselections': threeselections},
                        {'big3-event': isbig3coupon},
                        {'selections-three-plus': event.markets && event.markets[0].selections.length > 3 || event.markets[0].isoutright},
                        {'selections-nine-plus': event.markets && event.markets[0].selections.length > 9},
                        {'twoselections': twoselections && (event.markets && event.markets[0].selections.length < 3 && !event.markets[0].isoutright)},
                        {'coupon-threeselections': (event.markets && event.markets[0].selections.length === 3 && !event.markets[0].isoutright)}, event.markets[0].idfosporttype]">
      <v-flex class="names participants" v-if="awayParticipantName && homeParticipantName &&
        (!event.markets || (event.markets[0] && event.markets[0].selections.length <= 3 && !event.markets[0].ismainoutright && !event.markets[0].isoutright))">
        <div v-if="!isbig3coupon" class="event-info" :class="{ clickable: event.noofmarkets > 0, 'team-logos': teamLogoVisibility }" @click.stop="goToEvent(event)">
          <div class="eventTitle home">
            <span v-if="luListcode4ParticipantMake(event, 'HOME') !== ''" class="listcode">{{ luListcode4ParticipantMake(event, 'HOME') }}</span>
            <div class="event-info-name-wrapper">
              <span v-if="teamLogoVisibility" class="team-logo" :style="homeTeamLogoStyle"></span>
              <span v-if="teamLogoVisibility && mobileBigAndBelow" class="name">{{ event.shortnamehome || homeParticipantName }}</span>
              <span v-else-if="mobileBigAndBelow && useShortParticipantNameOnMobile" class="name">{{ homeParticipantShortName }}</span>
              <span v-else class="name">{{ homeParticipantName }}</span>
            </div>
            <span v-if="event.homepitchername && isPitcherVisible" class="pitcher-name"><span class="cell"></span><p class="cell">{{ event.homepitchername | lowercase }}</p></span>
          </div>
          <div class="eventTitle away">
            <span v-if="luListcode4ParticipantMake(event, 'AWAY') !== ''" class="listcode">{{ luListcode4ParticipantMake(event, 'AWAY') }}</span>
            <div class="event-info-name-wrapper">
              <span v-if="teamLogoVisibility" class="team-logo" :style="awayTeamLogoStyle"></span>
              <span v-if="teamLogoVisibility && mobileBigAndBelow" class="name">{{ event.shortnameaway || awayParticipantName }}</span>
              <span v-else-if="mobileBigAndBelow && useShortParticipantNameOnMobile" class="name">{{ awayParticipantShortName }}</span>
              <span v-else class="name">{{ awayParticipantName }}</span>
            </div>
            <span v-if="event.awaypitchername && isPitcherVisible" class="pitcher-name"><span class="cell"></span><p class="cell">{{ event.awaypitchername | lowercase }}</p></span>
          </div>
        </div>
        <div v-else class="event-info" :class="{ clickable: event.noofmarkets > 0, 'team-logos': teamLogoVisibility }" @click.stop="goToEvent(event)">
          <div class="eventTitle away">
            <span v-if="luListcode4ParticipantMake(event, 'AWAY') !== ''" class="listcode">{{ luListcode4ParticipantMake(event, 'AWAY') }}</span>
            <div class="event-info-name-wrapper">
              <span v-if="teamLogoVisibility" class="team-logo" :style="awayTeamLogoStyle"></span>
              <span v-if="teamLogoVisibility && mobileBigAndBelow" class="name">{{ event.shortnameaway || awayParticipantName }}</span>
              <span v-else-if="mobileBigAndBelow && useShortParticipantNameOnMobile" class="name">{{ awayParticipantShortName }}</span>
              <span v-else class="name">{{ awayParticipantName }}</span>
            </div>
            <span v-if="event.awaypitchername && isPitcherVisible" class="pitcher-name"><span class="cell"></span><p class="cell">{{ event.awaypitchername | lowercase }}</p></span>
          </div>
          <div class="eventTitle home">
            <span v-if="luListcode4ParticipantMake(event, 'HOME') !== ''" class="listcode">{{ luListcode4ParticipantMake(event, 'HOME') }}</span>
            <div class="event-info-name-wrapper">
              <span v-if="teamLogoVisibility" class="team-logo" :style="homeTeamLogoStyle"></span>
              <span v-if="teamLogoVisibility && mobileBigAndBelow" class="name">{{ event.shortnamehome || homeParticipantName }}</span>
              <span v-else-if="mobileBigAndBelow && useShortParticipantNameOnMobile" class="name">{{ homeParticipantShortName }}</span>
              <span v-else class="name">{{ homeParticipantName }}</span>
            </div>
            <span v-if="event.homepitchername && isPitcherVisible" class="pitcher-name"><span class="cell"></span><p class="cell">{{ event.homepitchername | lowercase }}</p></span>
          </div>
        </div>
      </v-flex>

      <div class="market">
        <!-- Display name for 'Outright' coupon, like 'NBA Winner', 'NBA - First pick of draft' -->
        <div v-if="event.markets[0].isoutright" class="outright outright-event-name">{{ event.externaldescription }}</div>
        <markets class="markets-container"
                 :markets="isbig3coupon ? event.markets.filter(mk => mk.gameperiod === '1+' && mk.selections && mk.selections.length <= 2) : [event.markets[0]]"
                 :event="event"
                 :iscoupondisplay="!!event.participantname_away"
                 :diplayOnPage="'coupon'"
                 :isbig3coupon="isbig3coupon"
                 :couponname="couponname"></markets>
        <div class="more-markets" :class='{ clickable: event.noofmarkets > 0 }' @click.stop="goToEvent(event)"
          v-if="!event.markets[0].isoutright && !mobileBigAndBelow && brandLayout !=='generic' && brandKey !== 'sb' && brandKey !== 'mav' && brandKey !== 'qcasino' && brandKey !== 'pr' && !hasMarketWithThreePlusSelections && (event.noofmarkets && event.noofmarkets > 0) && ['GOLF', 'MOTORSPORT', 'NASCAR'].indexOf(event.markets[0].idfosporttype) === -1"
          ><v-icon v-if="(brandKey !== 'dn' && brandKey !== 'dnw' && brandKey !== 'circa')">add</v-icon><v-icon v-if="(brandKey === 'dn' || brandKey === 'dnw' || brandKey === 'circa')">chevron_right</v-icon>
        </div>
      </div>
      <div class="more-markets notInFooter" :class='{ clickable: event.noofmarkets > 0 }' @click.stop="goToEvent(event)"
        v-if="(brandKey === 'dn' || brandKey === 'dnw' || brandKey === 'circa') && mobileBigAndBelow && !event.markets[0].isoutright && !hasMarketWithThreePlusSelections && (event.noofmarkets && event.noofmarkets > 0) && ['GOLF', 'MOTORSPORT', 'NASCAR'].indexOf(event.markets[0].idfosporttype) === -1"
        ><v-icon>chevron_right</v-icon>
      </div>
    </v-layout>

    <!-- Single coupon footer -->
    <section v-if="event.markets && event.markets[0].selections.length <= 9 || !event.markets[0].isoutright" class="single-coupon-footer" :class="{'live-streaming': isLiveStreamAvailable}">
      <!-- Display date-time for event-->
      <div class="time">
        <sgp-tag :markets="event.markets" :isLive="0" :filterMarkets="'some'" :isForCoupon="'couponEvent'"></sgp-tag>
        <span v-if="isDateToday(event.tsstart)">Today {{ (event.tsstart) | moment(dateFormats.longTime)}}</span>
        <span v-if="isDateTomorrow(event.tsstart)">Tomorrow {{ (event.tsstart) | moment(dateFormats.longTime)}}</span>
        <span v-if="!isDateToday(event.tsstart) && !isDateTomorrow(event.tsstart)">{{ event.tsstart | moment(dateFormats.longDateTimeMG) }} </span>
        <div class="live-stream prematch" v-if="isLiveStreamAvailable"  @click.stop="goToEvent(event)">
          <v-icon>play_arrow</v-icon>
          <span>Watch Live</span>
        </div>
      </div>
      <div class="eventextdesc">{{event.externaldescription}}</div>
      <!-- Link for more markets in coupon -->
     <div class="more-markets" :class='{ clickable: event.noofmarkets > 0 }' @click.stop="goToEvent(event)"
           v-if="(brandLayout === 'generic' || brandKey === 'sb' || brandKey === 'mav' || brandKey === 'qcasino' || brandKey === 'pr' || (mobileBigAndBelow && (brandKey !== 'dn' && brandKey !== 'dnw' && brandKey !== 'circa')) || event.markets[0].isoutright)  && !hasMarketWithThreePlusSelections && (event.noofmarkets && event.noofmarkets > 0) && ['GOLF', 'MOTORSPORT', 'NASCAR'].indexOf(event.markets[0].idfosporttype) === -1"
      ><span>{{ $t('Sports.Markets') }}</span> <v-icon>add</v-icon>
      </div>
    </section>
  </div>
</template>
<script>
  import config from '@/config'
  import markets from '@/components/sports/bettingoffer/markets'
  import store from '@/store'
  import BettingOffer from '@/components/mixins/BettingOffer'
  import Branding from '@/components/mixins/Branding'
  import Screen from '@/components/mixins/Screen'
  import TeamLogo from '@/components/mixins/TeamLogo'
  import LayoutUtil from '@/components/mixins/LayoutUtil'
  import sgpTag from '@/components/sports/betslipV2/common/marketSgpTag'

  export default {
    name: 'couponEvent',

    props: [
      'event',
      'twoselections',
      'threeselections',
      'isbig3coupon',
      'couponname'
    ],

    components: {
      markets,
      sgpTag
    },

    mixins: [
      BettingOffer,
      TeamLogo,
      Screen,
      Branding,
      LayoutUtil
    ],

    computed: {
      teamLogos () {
        return {
          logoHome: this.event && this.event.logohome,
          logoAway: this.event && this.event.logoaway
        }
      },
      hasMarketWithThreePlusSelections () {
        let key = false
        if (this.event && this.event.markets && this.event.markets.length) {
          this.event.markets.forEach(market => {
            if (market && market.selections && market.selections.length && market.selections.length > 3) {
              key = true
            }
          })
        }
        return key
      },
      awayParticipantName () {
        return this.event.participantname_away ||
          (this.event.markets && this.event.markets[0] && this.event.markets[0].selections &&
            this.event.markets[0].selections.find(sel => sel.hadvalue === 'A') &&
            this.event.markets[0].selections.find(sel => sel.hadvalue === 'A').name) || ''
      },
      homeParticipantName () {
        return this.event.participantname_home ||
          (this.event.markets && this.event.markets[0] && this.event.markets[0].selections &&
            this.event.markets[0].selections.find(sel => sel.hadvalue === 'H') &&
            this.event.markets[0].selections.find(sel => sel.hadvalue === 'H').name) || ''
      },
      awayParticipantShortName () {
        return this.event.shortnameaway || this.awayParticipantName
      },
      homeParticipantShortName () {
        return this.event.shortnamehome || this.homeParticipantName
      },
      liveStreams () {
        return store.getters['livebettingState/liveStreams']
      },
      isLiveStreamAvailable () {
        return this.liveStreams && this.liveStreams.find(ls => ls.idfoevent === this.event.idfoevent)
      },
      isPitcherVisible () {
        return !config.app.autoconf.HIDE_PITCHER_NAME
      },
      useShortParticipantNameOnMobile () {
        return config.app.autoconf.USE_ONLY_SHORT_PARTICIPANT_NAMES_ON_MOBILE
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus">
  $image-base-url = '~@/assets/images/icons/svg/'
  .coupon-event
    &.outright
      border-top none
  .coupon-event
    background white
    //border-top 1px solid #CFD6DB
    user-select none
    padding 12px 5px 0px 9px
    align-items: center
    justify-content space-between
    position relative
    .names.participants
      min-width 0
      flex unset
      .eventTitle
        font-size 14px
        color #000
        overflow hidden
        text-overflow ellipsis
        height 40px
        margin 2px 0
        line-height 35px
        white-space nowrap
        .pitcher-name
          font-size 12px
          text-transform capitalize
          color #828e95
          line-height 0
          display block
        &:last-child
          margin-bottom: 0
    .market
      .markets-container
        margin-bottom 0
    .markets.multiple
      .market
        &.money
          .selectionprice
            line-height 18px
            font-weight bold !important
            // height 40px
            position relative
            // top 10px

    &.twoselections
      .market
        .selections
          padding 0
          display inline-block
          .selection
            margin 2px
            span
              //height 40px
              border-radius 5px
              line-height 12px
            &.U,
            &.O
              .selection-wapper
                padding 0
                .currenthandicap,
                .selectionprice
                  line-height 20px
            &.U,
            &.A
              margin-bottom 4px
            &.O,
            &.A
              margin-top 4px
            &.H,
            &.A
              .selection-wapper
                padding 11px 9px
        &.suspended
          .selection-wapper
            padding 11px 9px

    &.threeselections
      .names.participants
        .eventTitle
          height 35px
          margin 0
          line-height 25px
          white-space nowrap
          display table
          width: 100%
          table-layout: fixed
          .name
            display table-cell
            vertical-align middle
            overflow: hidden
            text-overflow: ellipsis
            white-space: nowrap
          .pitcher-name
            display table-row
            vertical-align middle
            overflow: hidden
            text-overflow: ellipsis
            white-space: nowrap
            p
              overflow: hidden
              text-overflow: ellipsis
              white-space: nowrap
              width: 100%
              height: 10px
              line-height: 8px
    &.selections-three-plus
      .market
        width 100%
    &.big3-event
      .names.participants
        min-width initial
        .eventTitle
          overflow initial
          text-overflow initial
          white-space normal
          display: table
          line-height: initial
          .name
            display table-cell
            vertical-align middle
            text-size-adjust none
          .pitcher-name
            display table-row
            line-height 8px

      .market
        white-space nowrap

  /*Coupon footer*/
  .single-coupon-footer
    display flex
    justify-content space-between
    margin-bottom 0px
    font-size 12px
    font-weight normal
    user-select none
    padding 8px
    align-items: center
    color #0b4da1
    background #f2f2f2
    margin-top: 10px !important
    section
      margin-bottom 0
      .time,
      .time-period
        padding-bottom 0
        color #818e95
        line-height 40px
    .eventextdesc
      display: none
    .more-markets
      padding-bottom 0
      white-space nowrap
      color #0b4da1 !important
      font-size 11px
      font-weight normal
      display flex
      align-items center
      justify-content center
      @media desktop-and-above
        cursor: pointer
      span
        line-height normal
      .v-icon
        color #0b4da1
        font-size 17px

    /*ends: Coupon footer*/

   /* active selection */
   .selections-mobile
    .active .value, .active .names
      background-color #157CC1 !important
      color #fff !important
  .active .selection-wapper
    background-color #157CC1 !important
    color #fff !important
  .active .selection-wapper
    border 0px !important

  .active .selectionprice
    color #fff
  /*ends: active selection */

  .live-coupon
    .market
      .markets-container
        margin-bottom 0
    .markets.multiple
      .market
        &.money
          .selectionprice
            line-height 18px
            height 40px
            position relative
            top 10px
            &.suspended
              // top 0

  .outright
    padding 15px 0 10px 15px
  .selections-nine-plus
    padding: 0px
    border-bottom-right-radius: 5px
    border-bottom-left-radius: 5px
    .outright-event-name
      padding 15px 0 10px 15px
  .outright-event-name
    padding 0 0 5px 0
    font-family 'Open Sans Bold'
    font-size 14px

  .browser-internet-explorer.browser-version-11
    .coupon-event.outright.selections-three-plus.twoselections
      .market
        width: 100%

  .url-sports.url-navigation .single-coupon-footer
    // padding-top 0px
.browser-safari.browser-version-12,
.browser-chrome.browser-version-71.os-macos
  .single-coupon-footer
    .more-markets
      span
        line-height normal
        margin-top 1px
@media desktop-and-above
  .clickable
    cursor: pointer

.live-stream.prematch
  display inline
  align-items center
  color #0d7fe1 !important
  text-transform uppercase
  font-size 10px
  margin-left 5px
  padding-left 5px
  border-left 1px solid #cfd6db
  @media desktop-and-above
    cursor: pointer
  span
    color #0d7fe1 !important
  .icon
    color #0d7fe1
    border 1px solid #0d7fe1
    border-radius 50%
    font-size 13px
    margin-right 3px
    margin-bottom 2px
    @media mobile-big-and-below
      font-size 13px

.coupon-event.outright.twoselections
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
.coupon-event:not(.outright):not(.selections-nine-plus)
  .markets-wrapper.markets-container.coupon
    display inline-block
    width calc(100% - 65px)

.coupon-event:not(.outright)
  .market
    display flex
    align-items center
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
.coupon
  @media tablet-and-above
    .more-markets
      border 1px solid #b6b6b6
      display inline-flex
      align-items center
      justify-content center
      width 30px
      height 30px
      margin-left 25px
      background #fff
.coupon-event.GOLF
  .market
    .markets-wrapper.markets-container.coupon
      width 100% !important

.coupon-threeselections:not(.outright) .market
  display flex
  align-items center
  .more-markets
    margin-bottom 4px
</style>
