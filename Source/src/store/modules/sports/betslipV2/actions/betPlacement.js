import store from '@/store'
import fixedOdds from '@/library/fixedOddsV2'
// import lib from '@/library'

const actions = {
  initPlaceBet (context, data) {
    // console.log('initPlaceBet')
    data = data || {}
    var isFastBet = data.isFastBet
    clearTimeout(context.state.timeouts.updateBetSlipInt)
    //
    context.commit('setCurrentBetSlipState', 3)
    return context.dispatch('createBetSlip', isFastBet)
      .then(function (betSlipObj) {
        // console.log(JSON.stringify(betSlipObj.betSlip.betSlip, null, 2))
        context.dispatch('dispatchGTM', {method: 'sendGTMBetAttempt', data: {betTypeObj: betSlipObj, isFastBet: isFastBet}})
        //
        var vebViewChecksFailed = {}
        if (data.webViewAndMobile) {
          store.commit('overlayState/setMessageDialogMsg', {reason: 'native-app', persistent: true})
          store.dispatch('overlayState/activateMessageDialog')
          // store.dispatch('sbBetslipState/sendGTMBetError', {reason: 'not-native-app', betTypeObj: betSlipObj})
          vebViewChecksFailed = {
            exceptionType: 'BetSlip.Check.Failed',
            betSlipCheckErrors: ['NOT-NATIVE-APP'],
            Status: {
              State: 4,
              DetailedState: 4,
              StatusCode: null,
              StatusText: 'BetSlip.Check.Failed',
              errorId: ['NOT-NATIVE-APP'],
              betSlipCheckError: true
            }
          }
          return context.dispatch('processBetPlacementResult', [vebViewChecksFailed, betSlipObj])
        } else if (data.isGeoLocationEnabled && !data.isGeolocated && data.isOpenedFromWebView) {
          store.commit('overlayState/setMessageDialogMsg', {reason: 'native-failed-geolocation', persistent: true, fullscreen: false})
          store.dispatch('overlayState/activateMessageDialog')
          // store.dispatch('sbBetslipState/sendGTMBetError', {reason: 'native-failed-geolocation', betTypeObj: betSlipObj})
          vebViewChecksFailed = {
            exceptionType: 'BetSlip.Check.Failed',
            betSlipCheckErrors: ['NATIVE-FAILED-GEOLOCATION'],
            Status: {
              State: 4,
              DetailedState: 4,
              StatusCode: null,
              StatusText: 'BetSlip.Check.Failed',
              errorId: ['NATIVE-FAILED-GEOLOCATION'],
              betSlipCheckError: true
            }
          }
          return context.dispatch('processBetPlacementResult', [vebViewChecksFailed, betSlipObj])
        }
        //
        return context.dispatch('betSlipChecks', betSlipObj)
          .then(function (betSlipChecksResponse) {
            // console.log('betSlipChecksResponse:')
            // console.log(betSlipChecksResponse)
            //
            return context.dispatch('getInRunningDelay', betSlipObj)
              .then(function (irdResponse) {
                if (irdResponse.exceptionType || irdResponse.message) {
                  // context.commit('setCurrentBetSlipState', 9)
                  // return irdResponse
                  return context.dispatch('processBetPlacementResult', [irdResponse, betSlipObj])
                }
                //
                return context.dispatch('placeBetSlip', betSlipObj)
                  .then(function (betPlacementResponse) {
                    return context.dispatch('processBetPlacementResult', [betPlacementResponse, betSlipObj])
                  })
              })
          }).catch(function (errArr) {
            // console.log('BetSlip Check Failed')
            // console.log(errArr)
            var data = {
              exceptionType: 'BetSlip.Check.Failed',
              betSlipCheckErrors: errArr,
              Status: {
                State: 4,
                DetailedState: 4,
                StatusCode: null,
                StatusText: 'BetSlip.Check.Failed',
                errorId: errArr,
                betSlipCheckError: true
              }
            }
            return context.dispatch('processBetPlacementResult', [data, betSlipObj])
          })
      })
  },
  createBetSlip (context, isFastBet) {
    // console.log('createBetSlip')
    // context.commit('setCurrentBetSlipState', 4)
    var betSlip = context.getters['bsCalculation'](true)
    //
    // var isSGMenabled = context.getters.isSGMenabled
    var xpInbound = betSlip.xpInbound || []
    delete betSlip.xpInbound
    //
    var betSlipObj = {
      betSlip: betSlip,
      xpInbound: xpInbound,
      isFastBet: isFastBet
    }
    return betSlipObj
  },
  placeBetSlip (context, betSlipData) {
    // console.log('placeBetSlip')
    //
    context.commit('setAttemptedBetSlip', betSlipData)
    //
    if (betSlipData && betSlipData.betSlip) {
      delete betSlipData.betSlip.allowedBetTypesAndReturns
      delete betSlipData.betSlip.betTypeCnt
      delete betSlipData.betSlip.isLive
      delete betSlipData.betSlip.tab
    }
    //
    var method = context.getters.useXPBettingService || context.getters.isSGMenabled ? 'placeBetSlipXP' : 'placeBetSlip'
    return fixedOdds[method](betSlipData, context.getters['placeAsync'])
      .then(function (result) {
        // return context.dispatch('processBetPlacementResult', [result.result, betSlipData])
        return result.result
      })
      .catch(function (error) {
        console.log('Bet Placement Error')
        console.log(error)
        context.commit('setCurrentBetSlipState', 9)
        context.dispatch('stopCountDown')
        return error
        // return context.dispatch('processBetPlacementResult', [error, betSlipData])
      })
    // })
  },

  clearAttemptedBetSlip (context) {
    // console.log('clearAttemptedBetSlip')
    context.commit('killHlite')
    context.commit('setInRefferal', false)
    context.commit('setCurrentBetSlipState', 0)
    context.commit('setAttemptedBetSlipResponse', {})
    context.commit('setAttemptedBetSlip', {})
    context.commit('setAttemptedBetSlipStatus', {})
  },

  dismissBetSlip (context, data) {
    // console.log('dismissBetSlip data:', data)
    data = data || {}
    if (data.keep && context.state.currentBetSlipState === 5 && context.state.attemptedBetSlip.betSlipStatus.State === 2) {
      data.keepStakes = false
      data.skipUpdate = false
    }
    if (data.keep) {
      if (!data.keepStakes) {
        context.commit('clearStakesAndReturns')
      }
    } else {
      if (context.state.attemptedBetSlip.betSlipStatus.State === 2) {
        context.dispatch('clearBetSlip', {keepMobileBetSlipActive: data.keepMobileBetSlipActive})
      }
    }
    //
    if (context.state.currentBetSlipState || typeof context.state.attemptedBetSlip.betSlipStatus.State === 'number') {
      context.dispatch('clearAttemptedBetSlip')
    }
    //
    if (!data.skipUpdate) {
      context.commit('resetABTnRrequestData')
      context.dispatch('scheduleBetSlipUpdate', 0.000111)
    }
    // if (data.forceCalculation) {
    //   context.dispatch('scheduleGetABTnR', 0.000111)
    // }
  },

  getInRunningDelay (context, betSlipObj) {
    // console.log('getInRunningDelay')
    var selections = []
    betSlipObj.betSlip.betSlip.Bets.forEach(function (bet) {
      bet.BetLegs.forEach(function (leg) {
        if (selections.indexOf(leg.IDFOSelection) < 0) {
          selections.push(leg.IDFOSelection)
        }
      })
    })
    //
    return fixedOdds.getInRunningDelay(selections).then(
      function (delay) {
        if (typeof delay.result === 'number') {
          betSlipObj.betSlip.isLive = !!delay.result
          context.state.attemptedBetSlip.inRunningDelay = delay.result
          context.commit('setCurrentBetSlipState', 2)
          context.dispatch('countDown', ['inRunningDelay', null])
          return delay.result
        }
      })
      .catch(function (error) {
        /*
        console.log('IR-delay: Clear This !!!')
        let delay = {result: 0}
        betSlipObj.betSlip.isLive = !!delay.result
        context.state.attemptedBetSlip.inRunningDelay = delay.result
        context.commit('setCurrentBetSlipState', 2)
        context.dispatch('countDown', ['inRunningDelay', null])
        return delay.result
        */
        //
        console.log('getInRunningDelay error:')
        console.log(error)
        context.state.attemptedBetSlip.inRunningDelay = 0
        context.commit('setCurrentBetSlipState', 9)
        return error
      })
      .finally(function () {
      })
  },
  countDown (context, data) {
    // console.log('countDown')
    var timer = data[0]
    if (context.state.attemptedBetSlip[timer] > 0) {
      clearTimeout(context.state.timeouts.countDownTimeout)
      context.state.timeouts.countDownTimeout = setTimeout(function () {
        context.state.attemptedBetSlip[timer]--
        context.dispatch('countDown', data)
      }, 1000)
    } else {
      clearTimeout(context.state.timeouts.countDownTimeout)
      switch (timer) {
        case 'inRunningDelay':
          if (context.state.currentBetSlipState < 4) {
            context.commit('setCurrentBetSlipState', 4)
          }
          break
        case 'gracePeriod':
          context.dispatch('rejectBetSlip', {toState: 8, skipAcctualReject: true})
          context.state.gracePeriodTimedOut = true
          break
        default:
          context.commit('setCurrentBetSlipState', 5)
          break
      }
    }
  },

  stopCountDown (context) {
    clearTimeout(context.state.timeouts.countDownTimeout)
  },

  getActualBetGracePeriod (context, betSlip) {
    // console.log('vuex getActualBetGracePeriod')
    return fixedOdds.getActualBetGracePeriod(betSlip.IDFOBetSlip).then(
      function (gracePeriod) {
        context.state.attemptedBetSlip.gracePeriod = gracePeriod.result || 0
        context.dispatch('countDown', ['gracePeriod', betSlip])
        // context.commit('setCurrentBetSlipState', 6)
      }
    ).catch(function (error) {
      console.log('getActualBetGracePeriod Error')
      console.log(error)
      context.state.attemptedBetSlip.gracePeriod = 0
      context.dispatch('countDown', ['gracePeriod', betSlip])
      // context.commit('setCurrentBetSlipState', 6)
    })
  },

  resetGracePeriod (context) {
    context.state.gracePeriodTimedOut = false
  },

  rejectBetSlip (context, params) {
    // params = {toState: val, skipAcctualReject: bool}
    // console.log('vuex rejectBetSlip')
    params = params || {}
    context.commit('killHlite')
    context.dispatch('stopCountDown')
    context.dispatch('resetGracePeriod')
    clearTimeout(context.state.timeouts.updateBetSlipStatusInt)
    let toState = params.toState || 7
    // context.commit('setCurrentBetSlipState', 3)
    context.commit('setCurrentBetSlipState', 11)

    var betSlip = context.state.attemptedBetSlip.response
    var status = (betSlip && betSlip.Status) || context.state.attemptedBetSlip.betSlipStatus
    var data = {
      IDFOBetSlip: betSlip.IDFOBetSlip,
      betSlipStatus: status
    }

    context.commit('setInRefferal', false)
    if (params.skipAcctualReject) {
      context.commit('setAttemptedBetSlipStatus', {})
      context.commit('setCurrentBetSlipState', toState)
    } else {
      var method = context.getters.useXPBettingService || context.getters.isSGMenabled ? 'rejectBetSlipXP' : 'rejectBetSlip'
      return fixedOdds[method](data.IDFOBetSlip, data.betSlipStatus)
        .then(function (result) {
          if (result.message || result.exceptionType) {
            context.commit('setCurrentBetSlipState', 9)
            return context.dispatch('processBetPlacementResult', [result, {}])
          } else {
            context.commit('setAttemptedBetSlipStatus', {})
            context.commit('setCurrentBetSlipState', toState)
          }
        })
        .catch(function (error) {
          console.log('rejectBetSlip Error')
          console.log(error)
          context.commit('setCurrentBetSlipState', 9)
          // return error
          return context.dispatch('processBetPlacementResult', [error, {}])
        })
    }
  },

  confirmBetSlip (context, isFastBet) {
    // console.log('vuex confirmBetSlipUsingConfirmations')
    context.commit('killHlite')
    context.dispatch('stopCountDown')
    // context.commit('setCurrentBetSlipState', 3)
    context.commit('setCurrentBetSlipState', 10)
    var betSlip = context.state.attemptedBetSlip.response
    var status = (betSlip && betSlip.Status) || context.state.attemptedBetSlip.betSlipStatus
    var data = {
      IDFOBetSlip: betSlip.IDFOBetSlip,
      betSlipStatus: status,
      isFastBet: isFastBet
    }
    var isSGMenabled = context.getters.isSGMenabled
    var useXPBettingService = context.getters.useXPBettingService
    // context.commit('setInRefferal', false)

    if (useXPBettingService || isSGMenabled) {
      return fixedOdds.confirmBetSlipXP(data.IDFOBetSlip, data.betSlipStatus, context.getters['placeAsync'])
        .then(function (result) {
          //
          var findState = function (DetailedState) {
            // return DetailedState === 1 ? 2 : 4
            var state = 4
            var stateMap = {
              1: 2, // Accepted
              2: 1, // Acceptable
              4: 4, // Rejected
              1024: 5, // Waiting
              4096: 4, // Rejected
              65536: 1 // Acceptable
            }
            for (var exp in stateMap) {
              if (DetailedState & exp) {
                state = stateMap[exp]
                break
              }
            }
            return state || 4
          }
          //
          var confirmedStatus = result.result
          confirmedStatus.DetailedState = confirmedStatus.State
          confirmedStatus.State = findState(confirmedStatus.DetailedState)
          confirmedStatus.StatusCode = confirmedStatus.Status
          delete confirmedStatus.Status
          //
          result.result = betSlip
          result.result.Status = confirmedStatus
          //
          // context.dispatch('getBetSlipStatus', data.IDFOBetSlip)
          //
          return context.dispatch('processBetPlacementResult', [result.result, {isFastBet: isFastBet}])
        })
        .catch(function (error) {
          console.log('confirmBetSlip Error')
          console.log(error)
          context.commit('setCurrentBetSlipState', 9)
          // return error
          return context.dispatch('processBetPlacementResult', [error, {isFastBet: isFastBet}])
        })
    }
    //
    return fixedOdds.confirmBetSlipUsingConfirmations(data.IDFOBetSlip, data.betSlipStatus, context.getters['placeAsync'])
      .then(function (result) {
        //
        var confirmedStatus = result.result && result.result.Status
        //
        result.result = betSlip
        result.result.Status = confirmedStatus
        //
        return context.dispatch('processBetPlacementResult', [result.result, {isFastBet: isFastBet}])
      })
      .catch(function (error) {
        console.log('confirmBetSlip Error')
        console.log(error)
        context.commit('setCurrentBetSlipState', 9)
        // return error
        return context.dispatch('processBetPlacementResult', [error, {isFastBet: isFastBet}])
      })
  },

  scheduleBetSlipStatusUpdate (context, isFastBet) {
    // console.log('scheduleBetSlipStatusUpdate')
    var betSlip = context.state.attemptedBetSlip.response
    var IDFOBetSlip = betSlip.IDFOBetSlip
    // let inRefferal = context.getters.inRefferal
    // console.log('inRefferal: ' + inRefferal)

    let getBetSlip = function () {
      // context.dispatch('getBetSlipStatus', IDFOBetSlip).then(
      context.dispatch('getBetSlip', IDFOBetSlip).then(
        function (result) {
          context.dispatch('processBetPlacementResult', [result.result, {isFastBet: isFastBet}])
        }
      ).catch(function (err) {
        console.log(err)
        context.dispatch('processBetPlacementResult', [err])
      })
    }

    let getReferredBets = function () {
      // console.log('fn getReferredBets')
      context.dispatch('getReferredBets', IDFOBetSlip).then(
        function (isResolved) {
          if (isResolved) {
            // context.dispatch('getBetSlipStatus', IDFOBetSlip)
            // context.dispatch('getBetSlip', IDFOBetSlip)
            //
            context.dispatch('processReferredBetSlip', IDFOBetSlip).then(
              function (result) {
                context.dispatch('processBetPlacementResult', [result.result, {isFastBet: isFastBet}])
              }
            ).catch(function (err) {
              console.log(err)
              context.dispatch('processBetPlacementResult', [err])
            })
          } else {
            if (context.rootGetters['isLoggedIn']) {
              context.dispatch('scheduleBetSlipStatusUpdate', isFastBet)
            }
          }
        }
      ).catch(function (err) {
        console.log('getReferredBets error:', err)
        context.dispatch('processBetPlacementResult', [err])
      })
    }
    //
    clearTimeout(context.state.timeouts.updateBetSlipStatusInt)
    // console.log('inRefferal: ' + context.getters.inRefferal)
    context.state.timeouts.updateBetSlipStatusInt = setTimeout(
      context.getters.inRefferal ? getReferredBets : getBetSlip,
      context.state.updateBetSlipStatusInt * 1000)
  },

  cancelBetSlipStatusUpdate (context) {
    clearTimeout(context.state.timeouts.updateBetSlipStatusInt)
  },

  getBetSlipStatus (context, IDFOBetSlip) {
    // console.log('Vuex getBetSlipStatus: ' + IDFOBetSlip)
    return fixedOdds.getBetSlipStatus(IDFOBetSlip)
      .then(function (r) {
        return r
      })
      .catch(function (r) {
        return r
      })
  },
  getBetSlip (context, IDFOBetSlip) {
    // console.log('Vuex getBetSlip: ' + IDFOBetSlip)
    return fixedOdds.getBetSlip(IDFOBetSlip)
      .then(function (r) {
        return r
      })
      .catch(function (r) {
        return r
      })
  },
  processReferredBetSlip (context, IDFOBetSlip) {
    // console.log('Vuex processReferredBetSlip: ' + IDFOBetSlip)
    return fixedOdds.processReferredBetSlip(IDFOBetSlip)
      .then(function (r) {
        // console.log('Vuex processReferredBetSlip: ' + IDFOBetSlip)
        // console.log(r)
        return r
      })
      .catch(function (r) {
        console.log('Vuex processReferredBetSlip: ' + IDFOBetSlip)
        console.log(r)
        return r
      })
  },
  getReferredBets (context, IDFOBetSlip) {
    // console.log('Vuex getReferredBets: ' + IDFOBetSlip)
    return new Promise((resolve, reject) => {
      fixedOdds.getReferredBets(IDFOBetSlip)
        .then(function (result) {
          // return result
          var isResolved = result && result.result && result.result.length &&
            result.result.filter(function (leg) {
              return !leg.IsResolved
            }).length === 0
          resolve(isResolved)
          // return isResolved
        })
        .catch(function (err) {
          console.log('getReferredBets Error')
          console.log(err)
          // return 0
          reject(err)
        })
    })
  }
}

export default actions
