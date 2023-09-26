<template>
  <header class="hheader oddsboost">
    <section class="head">
      <h4>
        <icon :colorName="'white'" :name="`icon-${ (idfosporttype && idfosporttype.replace(/ /g, '')) || 'empty' }`"></icon>
        <span class="coupontitle">{{ coupontitle }}</span>
      </h4>
    </section>
    <template>
      <section class="markets-header layout">
        <div :class="['markets-title']">
          <h4 class="big3-market-name">WAS</h4>
        </div>
        <div :class="['markets-title']">
          <h4 class="big3-market-name">NOW</h4>
        </div>
      </section>
    </template>
  </header>
</template>
<script>
  import Icon from '@/components/common/Icon'
  import Screen from '@/components/mixins/Screen'

  export default {
    name: 'big3MarketsHeader',

    components: {
      Icon
    },

    mixins: [
      Screen
    ],

    props: [
      'coupontitle',
      'idfosporttype',
      'idfosport'
    ]
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
    margin-right 0px!important
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
            text-align left
          .big3-market-name
            display inline-block
          .available-for-bb
            display inline-block
            width 17px
            height 17px
            background url(icons-path'/'available-for-bb'.svg')
            // background url("~@/assets/images/icons/svg/availible-for-bb.svg")
            background-repeat no-repeat
            background-position center
            background-size 100%
            vertical-align middle
            @media mobile-big-and-below
              width 14px
              height 14px

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
