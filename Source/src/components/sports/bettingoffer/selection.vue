<template>
  <div v-if="selection" class='selection-wapper'
       :class="['selection-data', priceChange, {'longprice-selection': formatedSelectionPrice && (formatedSelectionPrice.length > selectionLength)},{'withhcp': selection.currenthandicap || (selection.currenthandicap === 0 && ['H', 'D', 'A'].indexOf(selection.hadvalue) > -1)}, {'no-price': !formatedSelectionPrice}]"
       :idfoselection="(selection && selection.idfoselection && selection.idfoselection.toString()) || 'null'">

    <div v-if="showselectionname" class="name names" :class="{'show-one-in-one-line': showOneInOneLine}" >{{ selection.name }}</div>
    <div class="value" :class="{'show-one-in-one-line': showOneInOneLine, 'suspended': !istradable || selection.idfobolifestate === 'NR' || selection.idfoselectionsuspensiontype}" >
      <div class="sh">
        <div v-if="selection.currenthandicap || (selection.currenthandicap === 0 && ['H', 'D', 'A'].indexOf(selection.hadvalue) > -1)" :class="['currenthandicap', {'long-hcp': selection.currenthandicap.toString().length > 3}]">
          <div v-if="['O', 'U'].indexOf(selection.hadvalue) > -1" class="had-value"><span v-if="selection.hadvalue == 'O'">O</span><span v-if="selection.hadvalue == 'U'">U</span></div>
          <div v-if="['O', 'U'].indexOf(selection.hadvalue) > -1" class="uo-currenthandicap">{{ selection.currenthandicap }}</div>
          <div v-if="['H', 'D'].indexOf(selection.hadvalue) > -1" class="currenthandicap">
            <!--<template v-if="selection.currenthandicap !== 0">{{ selection.currenthandicap > 0 ? `+${selection.currenthandicap}` : `${selection.currenthandicap}` }}</template>-->
            <!--<template v-else>0</template>-->
            {{handicapFormatted}}
          </div>
          <div v-if="['A'].indexOf(selection.hadvalue) > -1" class="currenthandicap">
            <!--<template v-if="selection.currenthandicap !== 0">{{ (selection.currenthandicap * -1) > 0 ? `+${selection.currenthandicap * -1}` : `${selection.currenthandicap * -1}` }}</template>-->
            <!--<template v-else>0</template>-->
            {{handicapFormatted}}
          </div>
        </div>
          <div v-if="istradable && selection.idfobolifestate !== 'NR' && !selection.idfoselectionsuspensiontype" class="selectionprice" :class="{noprice: !formatedSelectionPrice, longprice: (formatedSelectionPrice && (formatedSelectionPrice.length > selectionLength)), varylongprice: (formatedSelectionPrice && (formatedSelectionPrice.length > secondselectionLength)), veryvarylongprice: (formatedSelectionPrice && (formatedSelectionPrice.length > thirdSelectionLength)) }">{{ formatedSelectionPrice || '--' }}</div>
        <div v-else class="selectionprice suspended"><v-icon>lock_open</v-icon></div>
      </div>
    </div>
    <div v-if="isDebug" style="font-size: 10px;">
      had {{ selection.hadvalue || '--' }}
      io {{ selection.internalorder || '--' }}<br />
      ch {{ selection.currenthandicap || '--' }}
      p {{ (selection.price && selection.price.toFixed(2)) || '--' }}
    </div>
  </div>
</template>
<script>
  import store from '@/store'
  import config from '@/config'
  import Icon from '@/components/common/Icon'
  import hcpFormat from '@/library/hcpFormat'

  import BettingOffer from '@/components/mixins/BettingOffer'

  export default {
    name: 'market-selection',
    components: {
      Icon
    },
    mixins: [
      BettingOffer
    ],
    props: [
      'selection',
      'istradable',
      'showselectionname',
      'pricechangehighlight',
      'ishad',
      'isoutright',
      'showOneInOneLine'
    ],

    data () {
      return {
        oldPrice: 0,
        priceChange: '',
        selectionChangeTimeout: 0,
        selectionLength: 5,
        secondselectionLength: 6,
        thirdSelectionLength: 7
      }
    },

    computed: {
      betSlipSelection () {
        return store.getters['sbBetslipState/getStoredSelectionById'](this.selection.idfoselection)
      },
      formatedSelectionPrice () {
        var usFractionsEnabled = config.app.autoconf.US_PRICE_FORMAT_SIMPLE_FRACTIONS
        var selection = this.selection
        var currentpriceup = (this.betSlipSelection && this.betSlipSelection.currentpriceup) || selection.currentpriceup
        var currentpricedown = (this.betSlipSelection && this.betSlipSelection.currentpricedown) || selection.currentpricedown

        if (this.pricechangehighlight && this.istradable) {
          this.processSelectionPriceChange()
        }

        if (!isNaN(parseFloat(currentpriceup)) && !isNaN(parseFloat(currentpricedown))) {
          let price = 1 + currentpriceup / currentpricedown
          let priceus = 0
          let sign = ''

          if (config.app.priceFormat === 'US') {
            let sportType = this.selection.idfosporttype || ''
            if (usFractionsEnabled && sportType !== 'BOXING' && this.isoutright && (currentpriceup === 1 || currentpricedown === 1 || currentpricedown === 2)) {
              return currentpriceup + '/' + currentpricedown
            } else {
              if (price >= 2) {
                priceus = 100 * (price - 1)
                sign = '+'
              } else {
                priceus = -100 / (price - 1)
                sign = ''
              }

              return sign + priceus.toFixed(0)
            }
          } else {
            return price.toFixed(2)
          }
        } else {
          return undefined
        }
      },
      handicapFormatted () {
        return this.selection && hcpFormat.formatHandicap(this.selection)
      }
    },

    methods: {
      processSelectionPriceChange () {
        var self = this

        if (this.selection) {
          if (this.oldPrice) {
            if (this.selection.price && this.selection.price.toFixed(2) !== this.oldPrice.toFixed(2)) {
              if (this.selection.price > this.oldPrice) {
                this.priceChange = 'priceup'
              } else if (this.selection.price < this.oldPrice) {
                this.priceChange = 'pricedown'
              }

              clearTimeout(this.selectionChangeTimeout)

              this.selectionChangeTimeout = setTimeout(() => {
                if (this.priceChange === 'priceup') {
                  self.priceChange = 'fadeout priceup'
                } else if (this.priceChange === 'pricedown') {
                  self.priceChange = 'fadeout pricedown'
                }
              }, 2000)

              this.selectionChangeTimeout = setTimeout(() => {
                self.priceChange = ''
              }, 3000)
            }
          }

          this.oldPrice = this.selection.price
        }
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped>
@import "~@/css/config";
@import "~@/css/mixins";

  .selection
    &.active
      .selection-wapper
        .value
          .currenthandicap
            .currenthandicap
                color #000
                &:hover
                  color #000
          .selectionprice
            color: white
    .selection-wapper
      background #f2f2f2
      padding 0
      min-width 5rem
      width 130px
      font-size 12px
      color #111
      text-align center
      cursor pointer
      display flex
      align-items center
      justify-content center
      //height 100%
      height 40px
      margin 0px 1px 4px 0px
      border-radius 0px
      @media mobile-big-and-below
        width 53px
        min-width 53px
        font-size 12px
        .browser-safari.os-ios &
          letter-spacing normal
      .value
        .currenthandicap
          line-height 20px
          display flex
          justify-content center
          font-weight 700
          .uo-currenthandicap
            margin-left 4px
          .currenthandicap
            line-height 20px
            color black
            font-weight 700
            &:hover
              color black
        .selection-wapper
          font-size 12px
        .selectionprice
          line-height 20px
          color: #0E4FA2
          font-weight: bold
          &.noprice
            color #b9c4cb
          &.suspended
            .igt-icon
              position relative
              top -3px
        &.suspended
          .currenthandicap
            display none!important
    .active
      .selection-wapper
        .currenthandicap
          .currenthandicap
              color white
              font-weight 700
              &:hover
                color white
        .selectionprice
          color: white

  .selection-wapper
    display: flex
    flex-direction: row
    cursor pointer

  .name.names
    line-height 35px
    flex: 2 0 0;
    background-color #fff
    margin-top -5px

  .selections
    min-width 100px

  .currenthandicap
    margin 0
    // font-weight bold
    font-size 14px
     @media mobile-big-and-below
        font-size 15px

  .selectionprice
    margin 0


  .name.names.show-one-in-one-line
    font-weight  bold
    font-size 14px
    line-height 16pz

  .value.show-one-in-one-line
    float right
    background #E0E0E0
    padding 7px
    // min-width 5rem
    font-size 14px
    color #111
    text-align: center
    cursor pointer


    .market.suspended .selections .selection
      color: #ccc !important;
      border-color: #ccc;
      cursor: default;

.app-body .selection .selection-wapper.selection-data.priceup
  position relative
  &:before
    font-family: 'Material Icons'
    content: "\e5ce"
    display inline-block
    color #fff
    width 20px
    height 20px
    background #ff671f
    border-radius 50%
    position absolute
    left 5px
    font-size 10px
    line-height 20px
    font-size 20px
    @media mobile-big-and-below
      left -7px
      line-height 15px
      font-size 9px
      width 15px
      height 15px

.app-body .selection .selection-wapper.selection-data.pricedown
  position relative
  &:before
    font-family: 'Material Icons'
    content: "\e5cf"
    font-size 20px
    display inline-block
    color #fff
    width 20px
    height 20px
    background #ff671f
    border-radius 50%
    position absolute
    left 5px
    font-size 20px
    line-height 20px
    bottom:5px
    @media mobile-big-and-below
      left -7px
      line-height 15px
      font-size 9px
      width 15px
      height 15px
.eventmarketgroup .markets .market .selections-in-columns .selections-container .selection .selection-wapper.pricedown
.app-body .headline-coupon-markets .selection .selection-wapper.selection-data.pricedown
  &:before
    left -7px
    line-height 15px
    font-size 9px
    width 15px
    height 15px
.eventmarketgroup .markets .selections-in-columns .selections-container .selection .selection-wapper.priceup
.app-body .headline-coupon-markets .selection .selection-wapper.selection-data.priceup
  &:before
    left -7px
    line-height 15px
    font-size 9px
    width 15px
    height 15px

.flex-more3-container .flex-item span.value
  float: right !important
  background: #f0f3f8
  padding: 7px
  // min-width: 5rem
  font-size: 14px
  color: #111
  text-align: center
  cursor: pointer

.flex-more3-container .flex-item .name
  display: table-cell
  vertical-align: middle

.selections-mobile span.value
    float: right !important
    background: #f0f3f8
    // min-width: 5rem
    font-size: 14px
    color: #111
    text-align: center
    cursor: pointer

.selections-mobile .selection-data
  padding: 15px

// .suspended
//   line-height 40px

.suspended .currenthandicap, .suspended .had-value
  display none

@media mobile-big-and-below
  .varylongprice
    font-size 12px !important

.flex-more3-container
  .varylongprice
    font-size 12px !important

.selections-mobile
  .varylongprice
    font-size 12px !important
@media mobile-big-and-below
  .big3-event .value
    font-size 12px
  .big3 .selection-wapper
    font-size 12px

.browser-internet-explorer
  .selection
    .selection-wapper
      height auto !important
</style>
