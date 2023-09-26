//  import Vue from 'vue'
import store from '@/store'

export default {
  computed: {
    STATE () {
      return window.ctsautoconf.STATE
    },
    translationsLoading () {
      return store.getters['sbBetslipState/translationsLoading']
    },
    isGeoLocationEnabled () {
      return store.getters['sbBetslipState/isGeoLocationEnabled']
    },
    isLoggedIn () {
      return store.getters['isLoggedIn']
    },
    tab () {
      return store.getters['sbBetslipState/tab']
    },
    betsNo () {
      return store.getters['sbBetslipState/selectionsNo']
    },
    gettingABTnR () {
      return store.getters['sbBetslipState/gettingABTnR']
    },
    currentBetSlipState () {
      return store.getters['sbBetslipState/currentBetSlipState']
    },
    currentBetSlipStateName () {
      return store.getters['sbBetslipState/currentBetSlipStateName']
    },
    betslipSelections () {
      // for debug
      return store.getters['sbBetslipState/betslipSelections']
    },
    betTypeStakes () {
      return store.getters['sbBetslipState/betTypeStakes']
    },
    returns () {
      // for debug
      return store.getters['sbBetslipState/returns']
    },

    allowedBetTypesAndReturns () {
      return store.getters['sbBetslipState/allowedBetTypesAndReturns']
    },
    betSlipTabs () {
      return store.getters['sbBetslipState/tabs']
    },
    betSlipChangeNo () {
      return store.getters['sbBetslipState/betSlipChangeNo']
    },
    inRunningDelay () {
      return store.getters['sbBetslipState/inRunningDelay']
    },
    gracePeriod () {
      return store.getters['sbBetslipState/gracePeriod']
    },
    bsCalculation () {
      return store.getters['sbBetslipState/bsCalculation']()
    },
    pitchers () {
      // for debug
      return store.getters['sbBetslipState/pitchers']
    },
    buyPoints () {
      // for debug
      return store.getters['sbBetslipState/buyPoints']
    },
    betSlipTotals () {
      let totals = {
        betsCnt: 0,
        totalStake: 0,
        winning: 0,
        totalReturn: 0
      }
      if (this.bsCalculation && this.bsCalculation.betSlip && this.bsCalculation.betSlip.Bets && this.bsCalculation.betSlip.Bets.length) {
        totals.betsCnt = this.bsCalculation.betSlip.Bets.length
        this.bsCalculation.betSlip.Bets.forEach(function (bet) {
          totals.totalStake += bet.TotalStake
          totals.winning += bet.winning
          totals.totalReturn += bet.totalReturn
        })
        //
        totals.totalStake = parseFloat(totals.totalStake.toFixed(2))
        totals.winning = parseFloat(totals.winning.toFixed(2))
        totals.totalReturn = parseFloat(totals.totalReturn.toFixed(2))
      }
      return totals
    },
    betPlacementResult () {
      return store.getters['sbBetslipState/betPlacementResponse']
    },
    betSlipStatus () {
      return store.getters['sbBetslipState/betSlipStatus']
    },
    interRelated () {
      return store.getters['sbBetslipState/interRelated']
    },
    allowedMultiSingles () {
      return store.getters['sbBetslipState/allowedMultiSingles']
    },
    inRefferal () {
      return store.getters['sbBetslipState/inRefferal']
    },
    promotionsData () {
      return store.getters['sbBetslipState/promotionsData'] || []
    },
    promotionsPayload () {
      // return store.getters['sbBetslipState/promotionsPayload']((this.bsCalculation && this.bsCalculation.betSlip) || {})
      return (this.bsCalculation && this.bsCalculation.promotionPayload && this.bsCalculation.promotionPayload.payload) || []
    },
    promotionsPayloadKey () {
      // var self = this
      var key = [this.tab]
      if (this.isLoggedIn && this.promotionsPayload && this.promotionsPayload.length) {
        this.promotionsPayload.forEach(function (p) {
          key.push(p.split(',').slice(0, 3).join(','))
        })
      }
      return key.join(';')
    }
  },

  methods: {
    setTab (tab) {
      if (this.currentBetSlipState) {
        return
      }
      store.commit('sbBetslipState/setTab', tab)
//        this.dismissBetSlip(null, !true)
    },
    clearBetSlip () {
      store.dispatch('sbBetslipState/clearBetSlip')
    },
    setTabFromBetSlip (tab) {
      this.$emit('setTabFromBetSlip', tab)
    },
    fetchPromotions () {
      var self = this
      clearTimeout(this.fetchPromotionsTo)
      this.fetchPromotionsTo = setTimeout(function () {
        store.dispatch('sbBetslipState/triggerFetchPromotions', {promotionPayload: self.bsCalculation.promotionPayload})
      }, 0)
    }
  },

  created () {
  },

  mounted () {
  },

  watch: {
    promotionsPayloadKey: {
      immediate: true,
      handler (v, ov) {
//         console.log('Watch promotionsPayload ov: ' + ov)
//         console.log('Watch promotionsPayload nv: ' + v)
//         console.log('Different: ' + (v !== ov))
        this.fetchPromotions()
      }
    }
  },

  destroyed () {
  }
}
