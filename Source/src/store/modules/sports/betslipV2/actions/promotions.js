import Vue from 'vue'
import lib from '@/library'

const actions = {
  triggerFetchPromotions (context, data) {
    var d = data.d
    var promotionsPayload = data.promotionPayload
    var delay = typeof d === 'number' ? d : 300
    // console.log('triggerFetchPromotions in ' + delay)
    clearTimeout(context.state.promotions.toInt)
    context.state.promotions.toInt = setTimeout(function () {
      // console.log('triggerFetchPromotions')
      context.dispatch('fetchPromotions', promotionsPayload)
    }, delay)
  },
  getPendingVouchers (context, data) {
    if (context.state.promotionsData.pending) {
      // console.log('getPendingVouchers')
      context.dispatch('fetchPromotions')
    }
  },
  fetchPromotionsOnToggle (context, d) {
    if (context.state.tab !== 'TEASER') {
      // context.dispatch('triggerFetchPromotions', d)
    }
  },
  fetchPromotions (context, promotionsPayload) {
    // console.log('fetchPromotions for tab: ' + context.state.tab + ' gettingABTnR: ' + context.state.gettingABTnR)
    promotionsPayload = promotionsPayload || {}
    if (!context.state.config.promotions.enabled || !context.rootGetters['isLoggedIn'] || context.state.gettingABTnR) {
      Vue.set(context.state.promotionsData, 'pending', true)
      if (context.state.gettingABTnR) {
        context.dispatch('triggerFetchPromotions', {d: 500, promotionPayload: promotionsPayload})
      }
      return
    }
    Vue.set(context.state.promotionsData, 'pending', false)
    //
    var tab = context.state.tab
    // var promotionsPayload = context.getters['promotionsPayload']
    var payload = promotionsPayload.payload || []
    var isTeaser = promotionsPayload.isTeaser
    var teaserGroup = promotionsPayload.teaserGroup
    // var fetchAgain = promotionsPayload.fetchAgain
    var isSGM = promotionsPayload.isSGM
    var sgmEvents = promotionsPayload.sgmEvents
    //
    if (payload.length) {
      // console.log(payload)
      //
      // GetSuggestedPromotion4BetDetails //
      // BetPromoDetails
      /*
      lib.rpcService.callBroker('AccountService', 'GetSuggestedPromotion4BetDetails', {
        IDMMTxProductType: 'SB',
        BetPromoDetails: payload
      }, payload, tab)
      */
      //
      lib.rpcService.callBroker('AccountService', 'GetSuggestedBonus', {
        IDMMTxProductType: 'SB',
        Bets: payload
      }, payload, tab, teaserGroup, isTeaser, isSGM, sgmEvents).then(
        function (response) {
          // console.log(response)
          context.dispatch('processSuggestedBonus', {
            tab: tab,
            response: response,
            payload: payload,
            teaserGroup: teaserGroup,
            isTeaser: isTeaser,
            isSGM: isSGM,
            sgmEvents: sgmEvents})
        }
      ).catch(function (err) {
        console.log('GetSuggestedBonus ERROR!')
        console.log(err)
        context.commit('resetPromotions', tab)
      })
    } else {
      context.commit('resetPromotions', tab)
      /*
      if (fetchAgain) {
        // console.log('fetch again in 500')
       context.dispatch('triggerFetchPromotions', {d: 500, promotionPayload: promotionsPayload})
      }
      */
    }
  },

  processSuggestedBonus (context, data) {
    // console.log('processSuggestedBonus')
    var tab = data.tab
    var response = data.response
    var payload = data.payload
    //
    // console.log(payload)
    //
    context.commit('resetPromotions', data.tab)
    if (response && response.result && response.result.Amount) {
      var discountAmount = response.result.Amount ? response.result.Amount * 1 : 0
      Vue.set(context.state.promotionsData.PerTab, tab, discountAmount)
      // console.log('DiscountAmount: ' + discountAmount)
      //
      var amountOnBets = response.result.AmountOnBets || []
      amountOnBets = amountOnBets.split(',')
      // console.log('AmountOnBets: ' + amountOnBets)
      //
      var target
      var prop
      var i
      var payloadI
      var betType
      //
      if (amountOnBets.length === payload.length) {
        for (i = 0; i < payload.length; i++) {
          payloadI = payload[i].split(',')
          betType = payloadI[2]
          if (data.isTeaser) {
            target = context.state.promotionsData[tab][data.teaserGroup[i]].PerBetType
            prop = betType
          } else {
            if (data.isSGM && data.sgmEvents[i]) {
              target = context.state.promotionsData.XP.PerEvent
              prop = data.sgmEvents[i]
            } else {
              target = context.state.promotionsData[tab][betType === 'S' ? 'PerSelection' : 'PerBetType']
              prop = betType === 'S' ? payloadI[3] : betType
            }
          }
          Vue.set(target, prop, amountOnBets[i] ? 1 * amountOnBets[i] : 0)
        }
      }
    }
  }

  /*
  processSuggestedPromotion4BetDetails (context, data) {
    var tab = data.tab
    var response = data.response
    var payload = data.payload
    //
    context.commit('resetPromotions', data.tab)
    if (response && response.result && response.result.DiscountAmount) {
      var discountAmount = response.result.DiscountAmount || 0
      // console.log('DiscountAmount: ' + discountAmount)
      Vue.set(context.state.voucherDiscountAmount, 'voucherDiscountAmount', discountAmount)
      // console.log('tab: ' + tab)
      // console.log('payload: ' + payload)
      // console.log(payload)
      var totalStake = 0
      var discount
      var target
      var i
      var payloadI
      var betType
      for (i = 0; i < payload.length; i++) {
        totalStake += payload[i].split(',')[0] * 1
      }
      for (i = 0; i < payload.length; i++) {
        payloadI = payload[i].split(',')
        discount = discountAmount * (payloadI[0] / totalStake)
        betType = payloadI[2]
        target = context.state.promotionsData[tab][betType === 'S' ? 'PerSelection' : 'PerBetType']
        Vue.set(target, betType === 'S' ? payloadI[3] : betType, discount)
      }
    }
  }
  */
}

export default actions
