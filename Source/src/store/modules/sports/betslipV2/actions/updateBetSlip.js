import fixedOdds from '@/library/fixedOddsV2'
// import Vue from 'vue'
// import store from '@/store'
// import lib from '@/library'
// import priceFormat from '@/library/priceFormat'
// import fetchParams from './actions/fetchParams'

const actions = {
  checkForBetSlipUpdate (context, d) {
    // !!! USED BY EXTERNAL COMPONENT !!!
    // console.log('checkForBetSlipUpdate')
    clearTimeout(context.state.timeouts.updateBetSlipIntExt)
    context.state.timeouts.updateBetSlipIntExt = setTimeout(function () {
      clearTimeout(context.state.timeouts.updateBetSlipIntExt)
      context.dispatch('scheduleBetSlipUpdate', 0.03)
    }, 3000)
  },
  scheduleBetSlipUpdate (context, d) {
    if (typeof d !== 'number') {
      var liveBettingDataSourceType = context.rootGetters['livebettingState/liveBettingDataSourceType']
      var isLive = !!context.getters.liveSelections.length
      d = isLive && liveBettingDataSourceType === 'PULL' ? context.state.config.updateBetSlipInt.live : context.state.config.updateBetSlipInt.default
    }
    //
    clearTimeout(context.state.timeouts.updateBetSlipInt)
    context.state.timeouts.updateBetSlipInt = setTimeout(function () {
      clearTimeout(context.state.timeouts.updateBetSlipInt)
      context.dispatch('updateBetSlip', d)
    }, d * 1000)
    // console.log('scheduleBetSlipUpdate in ' + d)
  },

  updateBetSlip (context, forceCalculation) {
    // !!! USED BY EXTERNAL COMPONENT !!!
    let currentBetSlipState = context.getters.currentBetSlipState
    // console.log('updateBetSlip; currentBetSlipState: ' + currentBetSlipState + ' (' + typeof currentBetSlipState + ')')
    clearTimeout(context.state.timeouts.updateBetSlipInt)
    context.state.updateBetSlipScheduledIn = 0
    var betsNo = context.getters.selectionsNo
    if (currentBetSlipState >= 1 || !betsNo) {
      context.dispatch('scheduleBetSlipUpdate')
    } else {
      return context.dispatch('updateBetSlipSelections').then(
        function (response) {
          if (!currentBetSlipState) {
            context.dispatch('updateStoredBetSlipSelections', response).then(
              function (changes) {
                // console.log('scheduleGetABTnR after Selections update: ' + changes)
                /*
                if (changes) {
                  context.dispatch('scheduleGetABTnR')
                }
                */
              }
            )
          } else {
            // clearTimeout(context.state.timeouts.updateBetSlipInt)
          }
          context.dispatch('scheduleBetSlipUpdate')
        })
        .catch(function () {
          console.log('BetSlip update response FAILED!')
          context.dispatch('scheduleBetSlipUpdate')
        })
        .finally(() => {
          if (forceCalculation === 0.000111) {
            // context.dispatch('scheduleGetABTnR', forceCalculation)
            context.dispatch('scheduleGetABTnR')
          }
        })
    }
  },
  updateBetSlipSelections: function (context, updateAll) {
    // updateAll = true
    var liveBettingDataSourceType = context.rootGetters['livebettingState/liveBettingDataSourceType']
    updateAll = updateAll || liveBettingDataSourceType !== 'PUSH'
    // console.log('Vuex updateBetSlipSelections')
    // const selectionsArr = fixedOdds.getSelectionsMappedToBetLegsForBSupdate(context.state.betslipSelections)
    context.state.requestId.updateBetSlipSelections++
    var rqId = context.state.requestId.updateBetSlipSelections

    var selections = context.state.betslipSelections
    if (!updateAll && context.state.liveSelections) {
      selections = selections.filter(s => context.state.liveSelections.indexOf(s.idfoselection) === -1)
    }
    var markets = context.state.markets

    return !selections.length ? [] : fixedOdds.updateBetSlipSelections(selections, markets, rqId)
    // return lib.rpcService.callBroker('FixedOddsBettingService', 'UpdateBetSlipSelections', {selections: selectionsArr})
      .then(function (response) {
        if (rqId !== context.state.requestId.updateBetSlipSelections) {
          // console.log('Missmatched request updateBetSlipSelections' + ' rqId: ' + rqId + ' <> ' + context.state.requestId.updateBetSlipSelections)
          return
        }
        // console.log('updateBetSlipSelections on SUCCESS')
        return response
      })
      .catch(function () {
        // console.log('updateBetSlipSelections ERROR!')
        return {}
      })
  },
  updateStoredBetSlipSelections: function (context, resultObj) {
    // console.log('$store updateBetSlipSelections')
    var compareSelections = function () {
      if (resultObj) {
        delete resultObj.isSingleBetSlip
      }

      var changes = 0
      var id
      var updatedSelection
      var selection
      var i
      //
      var toUpdate = {
        price: 1,
        currentpriceup: 0,
        currentpricedown: 0,
        currenthandicap: 1,
        currentmatchhandicap: 1,
        // upperband: 0,
        // lowerband: 0,
        isclosed: 1,
        istradable: 1,
        selectionhashcode: 1,
        idfobolifestate: 1,
        csvpricetypes: 1
      }
      //
      for (id in resultObj) {
        updatedSelection = resultObj[id]
        selection = context.state.betslipSelections.find(s => s.idfoselection === updatedSelection.idfoselection)
        //
        var changed = {
          price: 0,
          handicap: 0
        }
        if (selection) {
          for (i in toUpdate) {
            // context.state.betSlipChanges[i] = context.state.betSlipChanges[i] || []
            // console.log('(' + selection.idfoselection + ') ' + i + ': ' + selection[i] + ' ?=? ' + updatedSelection[i])
            if (selection[i] !== updatedSelection[i]) {
              if (['price', 'currentpriceup', 'currentpricedown'].includes(i)) {
                changed.price++
              }
              if (['currenthandicap', 'currentmatchhandicap'].includes(i)) {
                changed.handicap++
              }
              selection[i] = updatedSelection[i]
              changes++
            }
          }
          context.commit('setPriceType', selection)
        }
      }
      return changes
    }

    return new Promise(function (resolve, reject) {
      resolve(compareSelections())
    })
  },

  setBetSlipChange (context, obj) {
    // console.log('setBetSlipChange')
    // console.log(obj)
    var showAcceptingChangesInfo = context.getters.showAcceptingChangesInfo
    var propsToNotify = {
      price: showAcceptingChangesInfo,
      currenthandicap: showAcceptingChangesInfo,
      suspended: showAcceptingChangesInfo,
      closed: showAcceptingChangesInfo,
      NR: showAcceptingChangesInfo
    }
    // var priceChanged = false
    var cnt = 0
    var key = obj.key
    // var selection = obj.selection
    // var id = obj.id
    // var remove = obj.remove

    if (propsToNotify[key]) {
      cnt++
      /*
      var index = context.state.betSlipChanges[key].indexOf(id)
      if (remove && index > -1) {
        context.state.betSlipChanges[key].splice(index, 1)
        cnt++
      }
      if (!remove && index >= -1) {
        if (key === 'price') {
          priceChanged = true
        }
        if (index === -1) {
          context.state.betSlipChanges[key].push(id)
        }
        if (key === 'currenthandicap') {
          context.commit('handicapChangedInc')
        }
        cnt++
      }
      */
    }
    //
    context.state.betSlipChanges.changeNo += cnt ? 1 : 0
    context.commit('clearMarkings')
    // console.log('setBetSlipChange ?-> scheduleGetABTnR')
    // if (cnt && (!showAcceptingChangesInfo || !context.rootGetters.isLoggedIn)) {
      // console.log('setBetSlipChange -> scheduleGetABTnR')
      // if (priceChanged && context.state.tab !== 'TEASER') {
      // console.log('Set change - scheduleGetABTnR')
      // context.dispatch('scheduleGetABTnR', 0.1)
      // }
    // }
    if (!showAcceptingChangesInfo || !context.rootGetters.isLoggedIn) {
      clearTimeout(context.state.timeouts.killHlite)
      context.state.timeouts.killHlite = setTimeout(function () {
        context.commit('killHlite')
        // context.dispatch('resetBetSlipChanges')
      }, context.state.config.clearMarkingsAfter * 1000)
    }
  },

  resetBetSlipChanges (context) {
    // console.log('resetBetSlipChanges')
    context.commit('killHlite')
    // context.dispatch('scheduleGetABTnR')
  },
  acceptChanges (context) {
    // console.log('acceptChanges')
    context.dispatch('resetBetSlipChanges').then(function () {
      context.dispatch('scheduleBetSlipUpdate', 0.01)
    })
  }
}

export default actions
