const actions = {
  betSlipChecks (context, betTypeObj) {
    // console.log('betSlipChecks')
    var bets = betTypeObj && betTypeObj.betSlip && betTypeObj.betSlip.betSlip && betTypeObj.betSlip.betSlip.Bets
    bets = bets || []
    // console.log(betTypeObj)
    return new Promise((resolve, reject) => {
      var errors = []
      var isLoggedIn = context.rootGetters['isLoggedIn']

      if (!isLoggedIn) {
        errors.push('NOT_LOGGED_IN')
      } else {
        let customerContextObject = context.rootGetters['getCustomerContext']
        let canPlaceBet = customerContextObject.ActionBet
        if (!canPlaceBet) {
          let reason = customerContextObject.ActionBetReason
          if (reason) {
            errors.push(reason)
          }
        }
        let tnC4SB = (customerContextObject && customerContextObject.Alerts.find(e => e.Key === 'TC')) || undefined
        if (tnC4SB) {
          errors.push('RECONFIRM_TNC_SB')
        }
        //
        var betTypeCnt = (betTypeObj && betTypeObj.betSlip && betTypeObj.betSlip.betTypeCnt) || []
        if (!betTypeCnt.length) {
          errors.push('NO_BET_TYPES')
        }

        var tab = betTypeObj && betTypeObj.betSlip && betTypeObj.betSlip.tab
        var minStake = context.rootGetters['sbBetslipState/minStake']
        var minStakeVal = 0
        var maxStake = context.rootGetters['sbBetslipState/maxStake']
        var maxStakeVal = 0
        var minValuesNotMet = false
        var maxValuesNotMet = false
        var totalBetSlipMinUnit = context.getters['totalBetSlipMinUnit']
        //
        var i
        var j
        var selections = []
        var noStakes = false
        var noWinning = false
        var totalWinStake = 0
        var totalStake = 0
        var bet
        var leg
        //
        for (i = 0; i < bets.length; i++) {
          bet = bets[i]
          // if (bet.WinStake <= 0) {
          if (typeof bet.WinStake !== 'number') {
            noStakes = true
          } else {
            totalWinStake += bet.WinStake
            totalStake += bet.TotalStake
            //
            minStakeVal = bet.IDFOBetType === 'S' ? minStake.PerSelection : minStake.PerBetType
            if (minStakeVal && bet.WinStake < minStakeVal) {
              minValuesNotMet = true
            }//
            maxStakeVal = bet.IDFOBetType === 'S' ? maxStake.PerSelection : maxStake.PerBetType
            if (maxStakeVal && bet.WinStake > maxStakeVal) {
              maxValuesNotMet = true
            }
          }
          if (bet.winning <= 0) {
            noWinning = true
          }
          for (j = 0; j < bet.BetLegs.length; j++) {
            leg = bet.BetLegs[j]
            if (selections.indexOf(leg.idfoselectionsource) === -1) {
              selections.push(leg.idfoselectionsource)
            }
          }
        }
        //
        if (minValuesNotMet) {
          errors.push('HAS_ERRORS')
          errors.push('MIN_STAKE')
        }
        if (maxValuesNotMet) {
          errors.push('HAS_ERRORS')
          errors.push('MAX_STAKE')
        }
        if (betTypeObj.minReturnNotMet) {
          // errors.push('HAS_ERRORS')
          // errors.push('MIN_RETURN')
        }
        //
        if (noStakes || !totalWinStake) {
          errors.push('NO_STAKES')
        }
        //
        if (noWinning) {
          errors.push('HAS_ERRORS')
          errors.push('NO_WIN')
        }
        //
        if (totalBetSlipMinUnit && totalStake < totalBetSlipMinUnit) {
          // console.log('totalStake:', totalStake, '; totalBetSlipMinUnit:', totalBetSlipMinUnit)
          errors.push('TOTAL_BETSLIP_MIN_UNIT')
        }
        //
        var nonAvailableForBetting = []
        if (betTypeObj.betSlip.tab === 'TEASER' && !context.getters.allowInPlayTeasers) {
          var liveSelections = context.getters.liveSelections
          nonAvailableForBetting = context.state.betslipSelections.filter(function (s) {
            return selections.indexOf(s.idfoselection) > -1 &&
              liveSelections.indexOf(s.idfoselection) > -1 &&
              context.getters.isOptedIn({tab: betTypeObj.betSlip.tab, id: s.idfoselection})
          })
          if (nonAvailableForBetting.length) {
            errors.push('NO_LIVE_TEASERS_ALLOWED')
          }
        }
        //
        nonAvailableForBetting = context.state.betslipSelections.filter(function (s) {
          return selections.indexOf(s.idfoselection) > -1 &&
            (s.isclosed || !s.istradable || s.idfobolifestate === 'NR') &&
            (context.getters.isOptedIn({tab: betTypeObj.betSlip.tab, id: s.idfoselection}))
        })
        if (nonAvailableForBetting.length) {
          errors.push('CLOSED_or_SUSPENDED')
        }
        /*
        if (betTypeObj.betMaxTakeoutLive) {
          errors.push('HAS_ERRORS')
          errors.push('MAX_TAKEOUT_INPLAY')
        }
        if (betTypeObj.betMaxTakeout) {
          errors.push('HAS_ERRORS')
          errors.push('MAX_TAKEOUT')
        }
        var maxTakeout = context.getters.maxTakeout
        var totalStake = betTypeObj.betTypeStakes.PerTab[betTypeObj.tab] * 1
        if (maxTakeout.total.inPlay) {
          var isLive = !!context.getters.liveSelections.length
          if (isLive) {
            if (totalStake > maxTakeout.total.inPlay) {
              errors.push('SLIP_MAX_TAKEOUT_INPLAY')
            }
          }
        }
        if (maxTakeout.total.preMatch) {
          if (totalStake > maxTakeout.total.preMatch) {
            errors.push('SLIP_MAX_TAKEOUT')
          }
        }
        */
        //

        /*
        var hasA = function () {
          return betTypeObj.id.filter(function (bt) {
            return bt.IDFOBetType === 'A'
          }).length
        }
        var nonAvailableForBetting = context.state.betslipSelections.filter(function (s) {
          return (s.isclosed || !s.istradable || s.idfobolifestate === 'NR') &&
            ((betTypeObj.tab === 'REGULAR' && (betTypeObj.betTypeStakes.REGULAR.PerSelection[s.idfoselection] || (betTypeObj.betTypeStakes.REGULAR.PerBetType.A && hasA()))) ||
                (betTypeObj.tab === 'RR' && context.getters.isOptedIn({tab: betTypeObj.tab, id: s.idfoselection})) ||
            (betTypeObj.tab === 'TEASER' && context.getters.isOptedIn({tab: betTypeObj.tab, id: s.idfoselection})))
        }).length
        if (nonAvailableForBetting) {
          errors.push('CLOSED_or_SUSPENDED')
        }
        //
        if (betTypeObj.tab === 'REGULAR' && betTypeObj.hasSGM) {
          for (var provider in betTypeObj.SGMevents) {
            var events = betTypeObj.SGMevents[provider] || []
            events.forEach(function (event) {
              var sgmSelections = context.rootGetters['sbBetslipState/sgmSelectionsPerEvent']({provider: provider, event: event})
              // console.log(sgmSelections)
              nonAvailableForBetting = context.state.betslipSelections.filter(function (s) {
                // var idfoevent = s.idfoevent
                return sgmSelections.indexOf(s.idfoselection) > -1 &&
                  betTypeObj.betTypeStakes.XP[provider].SGP.PerEvent[event] &&
                  (s.isclosed || !s.istradable || s.idfobolifestate === 'NR')
              }).length
              if (nonAvailableForBetting) {
                errors.push('CLOSED_or_SUSPENDED')
              }
            })
          }
        }
        */

        var customerContext = context.rootGetters['getCustomerContext']
        var promotionsData = context.getters.promotionsData || {}
        var discount = (promotionsData && promotionsData.PerTab && promotionsData.PerTab[tab]) || 0
        var tradingBalance = customerContext && customerContext.Balances && customerContext.Balances.find(b => b.Key === 'CREDIT').Trading
        if ((totalStake - discount) > tradingBalance) {
          errors.push('INSUFFICIENT_FUNDS')
        }
      }
      if (errors.length) {
        console.log('betSlipChecks errors:')
        console.log(errors)
        // errors = []
      }
      if (errors.length) {
        reject(errors)
      } else {
        resolve(true)
      }
    })
  }
}

export default actions
