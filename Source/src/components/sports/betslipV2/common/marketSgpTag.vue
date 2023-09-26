<template>
  <span class="market-sgp-tag" v-if="isSGM && isSGM.length">
    <span v-for="pt in isSGM" class="sgp-tag" :class="[pt, {isForCoupon:isForCoupon}]"></span>
  </span>
</template>

<script>
  //  import Vue from 'vue'
  import store from '@/store'
  // import config from '@/config'
  // import Icon from '@/components/common/Icon'

  export default {
    name: 'marketSgpTag',

    mixins: [
    ],

    props: ['markets', 'isLive', 'filterMarkets', 'isForCoupon'],

    components: {

    },

    data () {
      return {
      }
    },

    computed: {
      isSGMenabled () {
        return store.getters['sbBetslipState/isSGMenabled']
      },
      sgpPriceTypes () {
        return store.getters['sbBetslipState/sgpPriceTypes']
      },
      filterType () {
        return this.filterMarkets || 'all'
      },
      isSGM () {
        let isSgm = []
        if (!this.isSGMenabled) {
          return isSgm
        }
        if (!(this.markets && this.markets.length)) {
          return isSgm
        }
        let sgpPriceTypes = []
        // let market = this.markets[0]
        for (let market of this.markets) {
          let csvpricetypes = (market && market.csvpricetypes) || []
          csvpricetypes = typeof csvpricetypes === 'string' ? csvpricetypes.split(',') : csvpricetypes
          let overlap = this.sgpPriceTypes.filter(p => csvpricetypes.includes(p))
          sgpPriceTypes.push(overlap)
        }
        // console.log('sgpPriceTypes:', sgpPriceTypes, 'isForCoupon:', this.isForCoupon, 'markets:', this.markets)
        sgpPriceTypes = sgpPriceTypes.filter(pt => pt.length)
        if (this.filterType === 'all' && sgpPriceTypes.length && sgpPriceTypes.length !== this.markets.length) {
          return isSgm
        }
        let flatArray = [].concat(...sgpPriceTypes)
        // let uniqueArray = flatArray.filter((v, i, a) => a.indexOf(v) === i)
        let uniqueArray = [...new Set(flatArray)]
        isSgm = this.sgpPriceTypes.filter(p => uniqueArray.includes(p))
        return isSgm
      }

    },

    methods: {

    },

    created () {

    },

    mounted () {
    },

    watch: {

    },

    destroyed () {
//      console.log('destroyed')
    }
  }
</script>

<style lang="stylus" scoped>
  /*@import "~@/css/config"*/
  .market-sgp-tag
    .sgp-tag
      margin-right: 10px;
      background-repeat: no-repeat;
      display: inline-block;
      vertical-align: top;
      &.isForCoupon
        margin-right: 1px;
      &.SGM
        background url("~@/assets/images/icon/svg/sgp-SGM-tag.svg")
        width: 34px;
        height: 17px;
</style>
