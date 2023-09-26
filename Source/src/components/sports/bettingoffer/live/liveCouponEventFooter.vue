<template>
  <section class="single-coupon-footer" :class="{'live-streaming': isLiveStreamAvailable}">
    <!-- Display date-time for event-->
    <div class="time">
      <sgp-tag :markets="event.markets" :isLive="1" :filterMarkets="'some'" :isForCoupon="'couponEvent'"></sgp-tag>
      <span class="live-box">{{ $t('Sports.Live') }}</span>
      <span class="live-time">{{ activePeriodName }}</span>
      <template v-if="['FOOTBALL', 'SOCCER', 'BASKETBALL', 'HANDBALL'].indexOf(event.idfosporttype) > -1">
        <span v-if="!matchTimer && event.istimeractive && event.matchcurrenttimeinmins">{{ event.matchcurrenttimeinmins | formatMinutesWithSeconds }}</span>
        <match-time-display
          v-if="matchTimer"
          :timer="matchTimer"></match-time-display>
      </template>
    </div>
    <span v-if="additionalFound && phraseToHighlight" class="additional-found">
      <text-highlight :queries="phraseToHighlight">{{ ' ' + additionalFound }}</text-highlight>
    </span>
    <div v-if="isLiveStreamAvailable" class="live-stream"  @click.stop="goToEvent(event)">
      <v-icon>play_arrow</v-icon>
      <span>Watch Live</span>
    </div>
    <!-- Link for more markets in coupon -->
    <div v-if="((mobileBigAndBelow && brandKey !== 'dn' && brandKey !== 'dnw' && brandKey !== 'circa') || brandLayout === 'generic' || brandKey === 'sb' || brandKey === 'mav' || brandKey === 'qcasino' || brandKey === 'pr')" class="more-markets" @click.stop="goToEvent(event)">
      <span>{{ $t('Sports.Markets') }}</span> <v-icon>add</v-icon>
    </div>
  </section>
</template>
<script>
  import store from '@/store'

  import MatchTimeDisplay from '@/components/sports/bettingoffer/live/matchTimeDisplay'
  import BettingOffer from '@/components/mixins/BettingOffer'
  import Branding from '@/components/mixins/Branding'
  import TextHighlight from 'vue-text-highlight'
  import sgpTag from '@/components/sports/betslipV2/common/marketSgpTag'

  export default {
    name: 'live-coupon-footer',

    props: [
      'event',
      'couponname',
      'additionalFound',
      'phraseToHighlight'
    ],
    data () {
      return {
        showSimplePeriodName: true
      }
    },
    components: {
      MatchTimeDisplay,
      TextHighlight,
      sgpTag
    },

    mixins: [
      BettingOffer,
      Branding
    ],

    computed: {
      matchTimer () {
        var self = this
        return (this.event && this.event.timers && this.event.timers.find(t => t.timername === 'MATCH' && t.idfosbperiod === self.event.idfosbactiveperiod)) || undefined
      },
      liveStreams () {
        return store.getters['livebettingState/liveStreams']
      },
      isLiveStreamAvailable () {
        var self = this
        return this.liveStreams && this.liveStreams.find(ls => ls.idfoevent === self.event.idfoevent)
      },
      activePeriodNumber () {
        if (this.event && this.event.idfosbactiveperiod) {
          return this.event.idfosporttype === 'BASKETBALL' && (this.event.idfosbactiveperiod === 'BBLEOT' || this.event.idfosbactiveperiod === 'BBLEHT' || this.event.idfosbactiveperiod === 'BBLNOT')
            ? 4
            : this.event.idfosbactiveperiod[this.activePeriodNumberPosition]
        } else {
          return 0
        }
      },
      activePeriodNumberPosition () {
        return this.event.idfosporttype === 'BASKETBALL' ? 4 : 3
      },
      activePeriodName () {
        let periodName = ''

        if (this.event) {
          const originalPeriodName = (this.event.period && this.event.period.name) || this.event.activeperiodname
          const hasValidPeriodNumber = this.activePeriodNumber > 0 && /\d/.test(originalPeriodName)
          const upperCasedName = originalPeriodName.toUpperCase()
          const hasHalf = upperCasedName.indexOf('HALF') > -1
          const hasQuarter = upperCasedName.indexOf('QUARTER') > -1

          if (this.showSimplePeriodName && hasValidPeriodNumber && (hasHalf || hasQuarter)) {
            const simplePeriodName = hasHalf ? 'H' : 'Q'
            periodName = `${simplePeriodName}${this.activePeriodNumber}`
          } else {
            periodName = originalPeriodName
          }
        }

        return periodName
      }
    },
    filters: {
      formatMinutesWithSeconds (value) {
        return `${value.toString().padStart(2, '0')}:00`
      }
    },
    methods: {

    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped>
 @import "~@/css/config"

$image-base-url = '~@/assets/images/icons/svg/'
  .single-coupon-footer:not(.in-play-live-coupon-footer),
  .single-coupon-footer.in-play-live-coupon-footer
    padding 8px 11px 12px 8px
    line-height normal
    display flex
    align-items center
  .single-coupon-footer
    justify-content space-between
    line-height 1
    display flex
    align-items center
    @media desktop-and-above
      cursor default
    .time
      display flex
      align-items center
      .live-box
        background-color #db3f3f
        color #fff
        text-align center
        padding 1px 3px
        width 24px
        font-size 10px
        text-transform uppercase
        display flex
        align-content center
        justify-content: center
      .live-time
        color #0b4da1
        text-transform uppercase
        font-size 12px
        padding 0px 4px
        display flex
        align-items center
    .more-markets
      padding-bottom 0
      white-space nowrap
      color #0b4da1 !important
      font-size 11px
      font-weight: normal
      display flex
      align-items center
      justify-content center
      @media desktop-and-above
        cursor: pointer

.live-stream
  display flex
  align-items center
  color #0d7fe1 !important
  text-transform uppercase
  font-size 10px
  height 15px
  padding-left 5px
  margin-left: 5px
  border-left 1px solid #cfd6db
  margin-right: auto
  @media desktop-and-above
    cursor: pointer
  span
    color #0d7fe1 !important
    align-items center
  .icon
    color #0d7fe1
    border 1px solid #0d7fe1
    border-radius 50%
    font-size 13px
    margin-right 4px
    display flex
    align-items center
    @media mobile-big-and-below
      font-size 13px
section
  height 35px
  padding-top 10px
  display flex
.single-coupon-footer.live-streaming
  .more-markets
    span
      margin-top 1px

.browser-safari.browser-version-12,
.browser-chrome.browser-version-71.os-macos
  .single-coupon-footer
    line-height 1
    .time
      display flex
      align-items center
      .live-time
        //display flex
        align-items center
        margin-top 2px
      .live-box
        display flex
        align-items center
        height 15px
        padding-top 2px
      .live-stream
        span
          margin-top 2px
      .more-markets
        display flex
        align-items center
        justify-content center
  .single-coupon-footer.live-streaming
    /*.more-markets
      span
        margin-top 0px*/
  .live-stream
    display flex
    align-items center
    .icon
      display flex
      align-items center
    span
      //display flex
      align-items center
      margin-top 2px
.os-ios
  @media mobile-big-and-below and  (-webkit-min-device-pixel-ratio: 3)
    .single-coupon-footer
      .time
        .live-box
          display flex
          align-items center
          padding-top 3px
          .live-time
            margin-top 2px
      .live-stream
        .icon
          margin-bottom 1px
      .more-markets
        .arrow
          margin-bottom 2px
 @media mobile-big-and-below and  (-webkit-min-device-pixel-ratio: 2)
    .single-coupon-footer
      .time
        .live-box
          display flex
          align-items center
          line-height 1
        .live-time
            margin-top 2px
      .live-stream
        .icon
          margin-bottom 1px
        span
          margin-top 1px
      .more-markets
        .arrow
          margin-bottom 2px
.more-markets
  border: 1px solid #b6b6b6
  @media mobile-big-and-below
    border none

</style>
