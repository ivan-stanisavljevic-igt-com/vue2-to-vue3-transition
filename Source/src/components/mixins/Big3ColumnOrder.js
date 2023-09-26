import config from '@/config'

export default {
  data () {
    return {
      big3ColumOrderConfig: config.app.autoconf.BIG3_COLUMN_ORDER,
      big3ColumOrderSportType: ''
    }
  },

  mixins: [
  ],

  computed: {
    big3ColumOrderEnabled () {
      return Boolean(this.big3ColumOrderConfig && !this._.isEmpty(this.big3ColumOrderConfig))
    },
    big3ColumOrderExists () {
      return Boolean(this.big3ColumOrderConfig[this.big3ColumOrderSportType])
    },

    big3ColumOrder () {
      return this.big3ColumOrderExists ? this.big3ColumOrderConfig[this.big3ColumOrderSportType] : []
    },
    big3MoneyLineOrder () {
      // Moneyline
      return this.big3ColumOrderEnabled ? 'big3-column-order-' + this.getBig3ColumOrderByMarketType('ML') : ''
    },
    // Total Points
    big3TotalPointsOrder () {
      return this.big3ColumOrderEnabled ? 'big3-column-order-' + this.getBig3ColumOrderByMarketType('TP') : ''
    },
    // Points Spread
    big3PointsSpreadOrder () {
      return this.big3ColumOrderEnabled ? 'big3-column-order-' + this.getBig3ColumOrderByMarketType('PS') : ''
    }
  },

  methods: {
    setBig3ColumnOrderSportType (sportType) {
      if (sportType && this._.isString(sportType)) {
        this.big3ColumOrderSportType = sportType
      }
    },

    getBig3ColumOrderByMarketType (marketType) {
      let order = ''

      if (this.big3ColumOrderExists && marketType && this.big3ColumOrder.indexOf(marketType) > -1) {
        order = this.big3ColumOrder.indexOf(marketType)
      }

      return order
    }
  },

  created () {

  }
}
