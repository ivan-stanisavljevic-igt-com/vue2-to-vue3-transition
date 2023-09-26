import Vue from 'vue'
import fixedOdds from '@/library/fixedOddsV2'
import betPlacementErrorHandling from '@/library/fixedOddsV2/betPlacementErrorHandling.js'
import store from '@/store'
import adjust from '@/library/adjust'
import config from '@/config'
import mobileBridge from '@/library/mobileBridge'
// import lib from '@/library'

// const externalWalletParams = config.externalWalletParams
/*
 var betSlipPlacementState = {
 0: preProcess,
 1: 'acceptable', // ConfirmationRequired
 2: 'accepted',
 3: 'reOffered', // acceptable
 4: 'rejected',
 5: 'waiting'
 }
 */

const actions = {
  processBetPlacementResult (context, data) {
    let currentBetSlipState = context.getters.currentBetSlipState
    // console.log('processBetPlacementResult; currentBetSlipState:', currentBetSlipState)
    if (!currentBetSlipState) {
      // console.log('Abort processing')
      return
    }
    //
    context.commit('setCurrentBetSlipState', 5)
    //
    let sgpPriceTypes = context.getters.sgpPriceTypes
    //
    const isBetSGM = (betLegs) => {
      let leg0 = betLegs && betLegs[0]
      let priceType = leg0.IDFOPriceType
      let eventId = leg0.IDFOEvent
      let isSGP = priceType && sgpPriceTypes.includes(priceType) && betLegs && betLegs.length > 1 && betLegs.every(leg => leg.IDFOPriceType === priceType && leg.IDFOEvent === eventId) && priceType
      // console.log('isBetSGM:', isSGP)
      return isSGP
    }
    //
    var isFastBet = data && data[1] && data[1].isFastBet
    let inRefferal = false
    //
    var tab = context.state.tab
    var result = data && data[0]
    //
    if (!result) {
      context.commit('setCurrentBetSlipState', 9)
    }
    // console.log('result:', result)
    var payload = (data && data[1] && data[1].betSlip && data[1].betSlip.betSlip) || context.getters.attemptedBetSlip
    isFastBet = isFastBet || payload.isFastBet
    payload = payload && payload.betSlip && payload.betSlip.betSlip ? payload.betSlip.betSlip : payload
    var xpInbound = (data && data[1] && data[1].xpInbound) || context.getters.attemptedBetSlipXPdata || []
    // console.log('context.getters.attemptedBetSlipXPdata:', context.getters.attemptedBetSlipXPdata)
    // console.log('data[1].xpInbound:', data && data[1] && data[1].xpInbound)
    var updatedSelections = {}
    //
    var calculatePrice = function (selection) {
      return 1 + selection.currentpriceup / selection.currentpricedown
    }
    //
    var updateSelections = function (selections, payLoadSelections) {
      // console.log('updateSelections')
      selections.forEach(function (selection, i) {
        // var IDFOSelection = context.getters.getSourceIdForDerivedSelection(selection.IDFOSelection)
        var IDFOSelection = selection.IDFOSelection
        var target
        var price
        //
        let isSGPselection = sgpPriceTypes.includes(selection.IDFOPriceType)
        var pSelection = payLoadSelections[i]
        var idfoselectionsource = pSelection && pSelection.idfoselectionsource
        //
        let sgpSelection = null
        if (isSGPselection) {
          // console.log('pSelection:', pSelection)
          let xpAllowedBetTypesAndReturn = context.state.allowedBetTypesAndReturns.XP.PerEvent[pSelection.IDFOEvent]
          sgpSelection = xpAllowedBetTypesAndReturn && xpAllowedBetTypesAndReturn.Legs &&
            xpAllowedBetTypesAndReturn.Legs.find(l => l.Selection === pSelection.IDFOSelection)
          sgpSelection.idfoselection = pSelection.IDFOSelection
          sgpSelection.currentpriceup = sgpSelection.PriceUp
          sgpSelection.currentpricedown = sgpSelection.PriceDown
        }
        target = sgpSelection || context.state.betslipSelections.find(function (s) {
          return IDFOSelection === s.idfoselection
        }) || false
        target = target || (IDFOSelection !== idfoselectionsource && context.getters.getDerivative(idfoselectionsource, tab))
        //
        if (target && target.idfoselection) {
          Vue.set(target, 'currenthandicap', selection.Handicap)
          Vue.set(target, 'currentmatchhandicap', selection.Handicap)
          Vue.set(target, 'lowerband', selection.LowerBand)
          Vue.set(target, 'upperband', selection.UpperBand)
          //
          if (target.currentpricedown && selection.PriceDown && target.currentpriceup && selection.PriceUp) {
            if (target.currentpricedown.toFixed(2) !== selection.PriceDown.toFixed(2) || target.currentpriceup.toFixed(2) !== selection.PriceUp.toFixed(2)) {
              updatedSelections[IDFOSelection] = true
            }
            Vue.set(target, 'currentpricedown', selection.PriceDown)
            Vue.set(target, 'currentpriceup', selection.PriceUp)
            if (isSGPselection) {
              Vue.set(target, 'PriceDown', selection.PriceDown)
              Vue.set(target, 'PriceUp', selection.PriceUp)
            }
            price = calculatePrice(target)
            selection.price = price
            // Vue.set(target, 'price', parseFloat(price.toFixed(2)))
            Vue.set(target, 'price', price)
            if (target.allowedBetTypesAndReturns) {
              Vue.set(target.allowedBetTypesAndReturns, 'PotentialReturn', price)
            }
          }
          //
          if (target.isPitcherSource || target.isBuyPointsSource) {
            context.dispatch('updateDerivative', {selection: target, changed: {price: 1}})
          }
        }
        //
        var teaserBetTypes = context.getters.teasersPriceTypes
        if (idfoselectionsource && teaserBetTypes.indexOf(selection.IDFOPriceType) > -1 && typeof selection.Handicap === 'number') {
          // console.log('Check Teaser Source HCP from: ' + pSelection.Handicap + ' to ' + selection.Handicap)
          var dif = selection.Handicap - pSelection.Handicap
          if (dif) {
            // console.log('Update Teaser Source HCP from: ' + pSelection.Handicap + ' to ' + selection.Handicap)
            pSelection.Handicap = selection.Handicap
            target = dif && context.state.betslipSelections.find(function (s) {
              return idfoselectionsource === s.idfoselection
            })
            target = target || false
            if (target) {
              var hcp = pSelection.Handicap
              if (pSelection.HADValue && ['A', 'O'].includes(pSelection.HADValue)) {
                hcp *= -1
              }
              if (pSelection.Spread) {
                hcp = hcp - pSelection.Spread
              }
              if (pSelection.HADValue && ['A', 'O'].includes(pSelection.HADValue)) {
                hcp *= -1
              }
              Vue.set(target, 'currenthandicap', hcp)
              Vue.set(target, 'currentmatchhandicap', hcp)
              context.dispatch('getTeaserGroups', target)
            }
          }
        }
      })
    }
    //
    context.commit('setAttemptedBetSlipResponse', result)
    //
    var status = (result && result.Status) || {}
    if (result && result.Status) {
      status = JSON.parse(JSON.stringify(result.Status))
      var detailedStates = status.DetailedState ? fixedOdds.parseBetSlipDetailedState(status.DetailedState, result.TotalStake, isFastBet) : []
      status.detailedStates = detailedStates
      if (detailedStates.indexOf('referred') > -1) {
        inRefferal = true
        context.commit('setInRefferal', true)
      }
    }
    status.errorData = betPlacementErrorHandling.handleBetPlacementErrorData({result: result, betSlipStatus: status, isLoggedIn: context.rootGetters['isLoggedIn']})
    //
    // console.log('status.errorData:', status.errorData)
    if (status.errorData.errorId || status.errorData.other) {
      context.dispatch('dispatchGTM', {
        method: 'sendGTMBetError',
        data: {
          tab: tab,
          reason: status.errorData.errorId || status.errorData.other,
          result: result,
          payload: payload,
          betTypeObj: data[1],
          isFastBet: isFastBet,
          // code: result && result.Status && result.Status.StatusCode
          code: status.StatusCode
        }
      })
    }
    //
    context.commit('setAttemptedBetSlipStatus', status)
    //
    if (result && (result.message || result.exceptionType || (result && result.Status && (!result.Status.State || result.Status.State === 0)))) {
      if (result.exceptionType === 'BetSlip.Check.Failed') {
        context.commit('setCurrentBetSlipState', 0)
      } else {
        context.commit('setCurrentBetSlipState', 9)
      }
      // context.commit('setInRefferal', false)
    } else {
      if (result && result.Status && result.Status.State === 2) {
        store.dispatch('getCustomerContext')
        context.dispatch('storePlacedBetEvents', {tab: tab, betSlip: result, payload: payload})
        context.dispatch('dispatchGTM', {
          method: 'sendGTMBetSuccess',
          data: {
            tab: tab,
            result: result,
            payload: payload,
            isLive: payload.isLive,
            isFastBet: isFastBet
          }
        })
        if (window.ctsautoconf.MOBILE_LS) {
          adjust.adjustEventRequest('total_stake', result.TotalStake)
          if (config.app.autoconf.APP_RATING && config.app.autoconf.APP_RATING.ENABLE) {
            const delay = config.app.autoconf.APP_RATING.DELAY || 2000
            setTimeout(() => {
              mobileBridge.bridgeSendRequest('appRating')
            }, delay)
          }
        }
        //
        if (isFastBet) {
          // store.commit('sbBetslipState/clearSingleBetSlip')
          if (store.getters['screenState/getMobileBigAndBelow']) {
            store.dispatch('overlayState/activateBetslip')
          }
          // store.dispatch('overlayState/deactivateSingleBetslip')
        }
      }
      if (result && result.Status && result.Status.State && (result.Status.State === 1 || result.Status.State === 3)) {
        context.commit('setCurrentBetSlipState', 6)
        context.dispatch('getActualBetGracePeriod', result)
      }
      if (result && result.Status && result.Status.State && result.Status.State === 5) {
        // context.commit('setCurrentBetSlipState', 5)
        context.dispatch('scheduleBetSlipStatusUpdate', isFastBet)
      }
    }
    //
    if (result && result.Status && result.Status.State !== 4) {
      // var allowedBetTypesAndReturns = isFastBet ? context.state.allowedBetTypesAndReturns.S1 : context.state.allowedBetTypesAndReturns[tab]
      var allowedBetTypesAndReturns = context.state.allowedBetTypesAndReturns[tab]
      var betTypeStakes = context.state.betTypeStakes[tab]
      // recalculate BetSlip
      // console.log('Recalculate BetSlip')
      var s
      var n
      var bet
      var potentialReturn
      for (n in result.Bets) {
        bet = result.Bets[n]
        let pBet = payload && payload.Bets && payload.Bets[n]
        if (tab === 'TEASER' && pBet) {
          allowedBetTypesAndReturns = context.state.allowedBetTypesAndReturns[tab][pBet.SportType]
          betTypeStakes = context.state.betTypeStakes[tab][pBet.SportType]
        }
        // var rStake = (bet.TotalStake / pBet.UnitCount) || bet.WinStake
        var rStake = bet.WinStake
        bet.IDFOBetType = bet.IDFOBetType || (pBet && pBet.IDFOBetType)
        //
        let iDFOBetType = bet.IDFOBetType && bet.IDFOBetType.indexOf('A-') === 0 ? 'A' : bet.IDFOBetType
        //
        potentialReturn = bet.PotentialReturn / rStake
        if (potentialReturn) {
          potentialReturn = Number(potentialReturn.toFixed(10))
          Vue.set(bet, 'price', parseFloat(potentialReturn.toFixed(2)))
        }
        var pBetLegs = pBet && pBet.BetLegs
        pBetLegs = pBetLegs || []
        // console.log('bet.IDFOBetType: ', bet.IDFOBetType)
        // console.log('bet.BetLegs: ', bet.BetLegs)
        // console.log('pBetLegs: ', pBetLegs)
        // console.log('iDFOBetType: ', iDFOBetType)
        // console.log('potentialReturn: ', potentialReturn)
        //
        // var isSGM = bet.BetLegs && bet.BetLegs[0] && bet.BetLegs[0].IDFOPriceType === 'SGM'
        // if (!isSGM) {
        //   updateSelections(bet.BetLegs, pBetLegs)
        // }
        updateSelections(bet.BetLegs, pBetLegs)
        if (iDFOBetType === 'S') {
          for (s in bet.BetLegs) {
            let leg = bet.BetLegs[s]
            bet.price = leg.price
            let idS = leg.IDFOSelection
            let idSs = context.getters.getSourceIdForDerivedSelection(leg.IDFOSelection)
            if (!inRefferal && bet.PotentialReturn) {
              Vue.set(betTypeStakes.PerSelection, idSs, rStake)
            }
            if (allowedBetTypesAndReturns.PotentialReturns.PerSelection[idS] && updatedSelections[idS]) {
              Vue.set(allowedBetTypesAndReturns.PotentialReturns.PerSelection[idS], 'PotentialReturn', leg.price)
            }
            if (allowedBetTypesAndReturns.PotentialReturns.PerSelection[idSs] && updatedSelections[idSs]) {
              Vue.set(allowedBetTypesAndReturns.PotentialReturns.PerSelection[idSs], 'PotentialReturn', leg.price)
            }
          }
        } else {
          var isSGM = isBetSGM(pBetLegs)
          if (!isSGM) {
            if (bet.PotentialReturn) {
              if (tab !== 'TEASER' && Object.keys(updatedSelections).length) {
                Vue.set(allowedBetTypesAndReturns.PotentialReturns.PerBetType[iDFOBetType], 'PotentialReturn', potentialReturn)
              }
              if (!inRefferal) {
                Vue.set(betTypeStakes.PerBetType, iDFOBetType, rStake)
                if (iDFOBetType === 'C1') {
                  Vue.set(context.state.betTypeStakes[tab].PerBetType, 'S', rStake)
                }
              }
            }
          } else {
            // console.log('xpData')
            var xpData = xpInbound && xpInbound[n]
            if (xpData && xpData.Provider && xpData.Bet && xpData.Bet.Entity) {
              if (Object.keys(updatedSelections).length) {
                let xpAllowedBetTypesAndReturn = context.state.allowedBetTypesAndReturns.XP.PerEvent[xpData.Bet.Entity]
                if (xpAllowedBetTypesAndReturn) {
                  Vue.set(xpAllowedBetTypesAndReturn, 'PotentialReturn', potentialReturn)
                  Vue.set(xpAllowedBetTypesAndReturn, 'Price', potentialReturn)
                }
              }
              //
              var xpStakes = context.state.betTypeStakes.XP && context.state.betTypeStakes.XP.PerEvent
              if (!inRefferal && xpStakes) {
                Vue.set(xpStakes, xpData.Bet.Entity, rStake)
              }
            }
          }
        }
      }
      // context.dispatch('getAllowedBetTypesAndReturns')
    }
    //
    return data
  }
}

export default actions
