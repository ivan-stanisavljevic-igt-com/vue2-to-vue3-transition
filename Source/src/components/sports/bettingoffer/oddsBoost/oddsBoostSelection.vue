<template>
  <div v-if="selection" class='selection-wapper'
       :class="['selection-data', priceChange, {'longprice-selection': formatedSelectionPrice && (formatedSelectionPrice.length > selectionLength)}, {'estmated-price':estimatedOrCurrentPrice === 'estimated'}, {'current-price':estimatedOrCurrentPrice === 'current'}]"
       :idfoselection="(selection && selection.idfoselection && selection.idfoselection.toString()) || 'null'">
    <div class="value" :class="{'show-one-in-one-line': showOneInOneLine, 'suspended': !istradable || selection.idfobolifestate === 'NR' || selection.idfoselectionsuspensiontype}" >
      <div class="sh">
        <div v-if="istradable && selection.idfobolifestate !== 'NR' && !selection.idfoselectionsuspensiontype && estimatedOrCurrentPrice === 'current'" class="selectionprice" :class="{noprice: !formatedSelectionPrice, longprice: (formatedSelectionPrice && (formatedSelectionPrice.length > selectionLength)), varylongprice: (formatedSelectionPrice && (formatedSelectionPrice.length > secondselectionLength)) }">{{ formatedSelectionPrice || '--' }}</div>
        <div v-else-if="istradable && selection.idfobolifestate !== 'NR' && !selection.idfoselectionsuspensiontype && estimatedOrCurrentPrice === 'estimated'" class="selectionprice" :class="{noprice: !formatedSelectionEstimatedPrice, longprice: (formatedSelectionEstimatedPrice && (formatedSelectionEstimatedPrice.length > selectionLength)), varylongprice: (formatedSelectionEstimatedPrice && (formatedSelectionEstimatedPrice.length > secondselectionLength)) }">{{ formatedSelectionEstimatedPrice || '--' }}</div>
        <div v-else class="selectionprice suspended"><icon name="icon-lock"></icon></div>
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
      'pricechangehighlight',
      'showOneInOneLine',
      'estimatedOrCurrentPrice'
    ],

    data () {
      return {
        oldPrice: 0,
        priceChange: '',
        selectionChangeTimeout: 0,
        selectionLength: 5,
        secondselectionLength: 8
      }
    },

    computed: {
      betSlipSelection () {
        return store.getters['sbBetslipState/getStoredSelectionById'](this.selection.idfoselection)
      },
      formatedSelectionPrice () {
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
      formatedSelectionEstimatedPrice () {
        var selection = this.selection
        var estimatepriceup = (this.betSlipSelection && this.betSlipSelection.estimatepriceup) || selection.estimatepriceup
        var estimatepricedown = (this.betSlipSelection && this.betSlipSelection.estimatepricedown) || selection.estimatepricedown

        if (this.pricechangehighlight && this.istradable) {
          this.processSelectionPriceChange()
        }

        if (!isNaN(parseFloat(estimatepriceup)) && !isNaN(parseFloat(estimatepricedown))) {
          let price = 1 + estimatepriceup / estimatepricedown
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
      }
    },

    methods: {
      processSelectionPriceChange () {
        var self = this

        if (this.selection) {
          if (this.oldPrice) {
            if (this.selection.price && this.selection.price !== this.oldPrice) {
              if (this.selection.price > this.oldPrice) {
                this.priceChange = 'priceup'
              } else if (this.selection.price < this.oldPrice) {
                this.priceChange = 'pricedown'
              }

              clearTimeout(this.selectionChangeTimeout)

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
                color white
                font-weight 700
                &:hover
                  color white
          .selectionprice
            color: white
        &.current-price
          background #157cc1 !important
          .value
            background none!important
            .selectionprice
              color white
    .selection-wapper
      background #f0f3f8
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
      @media mobile-big-and-below
        width 53px
        min-width 53px
        font-size 12px
        .browser-safari.os-ios &
          letter-spacing normal
      &.current-price
        background #f0f3f8!important
        .value
          background none!important
          .selectionprice
            color #0e4fa2
            font-weight 700
      &.estmated-price
        background none!important
        cursor default
        border none !important
        .value
          background none!important
          .selectionprice
            color #818e95
            font-size 12px
      &.priceup.current-price
        background-color #D7F3E0!important
        color green
        background-image url(icons-path/rectangle-green.svg)!important
        background-repeat no-repeat!important
        background-position left 4px top 4px!important
        .value
          .selectionprice
            color green
      &.pricedown.current-price
        background-color #FCECEC!important
        color red
        background-image url(icons-path/rectangle-red.svg)!important
        background-repeat no-repeat!important
        background-position left 4px bottom 4px!important
        .value
          .selectionprice
            color red
            
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
          color: #0090ff
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
        &.estmated-price
          background none !important
          cursor default
          .value
            background none!important
          
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
    background-color #D7F3E0
    color green
    background-image url(icons-path/rectangle-green.svg)
    background-repeat no-repeat
    background-position left 4px top 4px
    .value
      .selectionprice
        color green

.app-body .selection .selection-wapper.selection-data.pricedown
    background-color #FCECEC
    color red
    background-image url(icons-path/rectangle-red.svg)
    background-repeat no-repeat
    background-position left 4px bottom 4px
    .value
      .selectionprice
        color red
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
      // height auto !important
</style>
