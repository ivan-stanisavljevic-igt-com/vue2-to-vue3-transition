import Vue from 'vue'
import store from '@/store'
import lib from '@/library'
import priceFormat from '@/library/priceFormat'
import interRelatedService from '@/library/interRelated'

let clone = function (obj) {
  return JSON.parse(JSON.stringify(obj))
}

const actions = {
  toggleBetslipSelection (context, selectionArr) {
    // !!! USED BY EXTERNAL COMPONENT !!!
    // console.log('toggleBetslipSelection action:', selectionArr)
    var t = new Date().getTime()
    //
    if (context.state.currentBetSlipState >= 1) {
      var autoDismissInCase = {
        0: false,
        1: false,
        2: true,
        3: false,
        4: false
      }
      if (context.state.currentBetSlipState === 5 && autoDismissInCase[context.state.attemptedBetSlip.betSlipStatus.State]) {
        // context.commit('setActiveBetSlipHistoryTab', '')
        context.dispatch('dismissBetSlip', {keep: true}).then(function () {
          context.dispatch('toggleBetslipSelection', selectionArr)
        })
      } else {
        store.dispatch('overlayState/activateBetslipMsg', ['NOT_IDLE'])
      }
      return
    }
    //
    var selection = selectionArr[0]
    const id = parseFloat(selection.idfoselection)
    var isInBetSlip = !!context.state.betslipSelectionsIds[id]
    //
    context.commit('dismissErrorFromSelection')
    //
    if (isInBetSlip) {
      var tt = context.state.toggleTime[id] || 0
      var dt = t - tt
      // console.log('Toggle time delta: ' + dt)
      if (dt > 1000) {
        context.dispatch('removeSelection', selectionArr)
      }
    } else {
      Vue.set(context.state.toggleTime, id, t)
      context.dispatch('addSelection', selectionArr)
    }
    //
    context.dispatch('saveToStorage')
  },
  addSelection (context, selectionArr) {
    // console.log('addSelection')
    //
    var state = context.state
    var preventAdding = false
    if (state.betslipSelections.length >= context.getters.maxSno) {
      preventAdding = ['MAX_NO', context.getters.maxSno]
    }
    var event = selectionArr[3] || {}
    var market = clone(selectionArr[1])
    market.awaypitchername = market.awaypitchername || event.awaypitchername
    market.homepitchername = market.homepitchername || event.homepitchername

    if (market.V) {
      lib.WebSocketLiveService.subscribeToMarketsByIDFOMarkets([market])
    }
    //
    var istradable = market && market.istradable && JSON.parse(market.istradable)
    if (!istradable) {
      if (!(state.addingMiltipleSelections.allowSuspended && state.addingMiltipleSelections.inProgress)) {
        // console.log('Selection is Suspended!')
        preventAdding = ['SUSPENDED']
        return
      }
    }
    //
    var selection = selectionArr[0]
    //
    if ((selection.idfobolifestate && selection.idfobolifestate === 'NR') || (selection.idfoselectionsuspensiontype && selection.idfoselectionsuspensiontype === 'N/O')) {
      // console.log('Selection idfobolifestate is ' + selection.idfobolifestate + '!')
      // console.log('Selection idfoselectionsuspensiontype is ' + selection.idfoselectionsuspensiontype + '!')
      preventAdding = ['NR']
      return
    }
    if (!selection.currentpricedown || !selection.currentpriceup) {
      // console.log('Selection has no price!')
      preventAdding = ['NO_PRICE']
      return
    }
    //
    if (preventAdding) {
      store.dispatch('overlayState/activateBetslipMsg', preventAdding)
      return
    }
    //
    const id = parseFloat(selection.idfoselection)
    market.csvpricetypes = market.csvpricetypes || // default case
      (market.pricetypes && market.pricetypes[0] && market.pricetypes.map(p => p.idfopricetype).join(',')) || // inject selections
      (market.pricetypes && market.pricetypes.pricetype && market.pricetypes.pricetype['#text']) ||
      market.activepricetypes // LiveWire
    market.csvpricetypes = market.csvpricetypes.split(',')
    selection.csvpricetypes = market.csvpricetypes
    context.commit('setPriceType', selection)
    market.selections = []

    Vue.set(state.markets, id, market)
    Vue.set(state.idfomarkets, id, market.idfomarket)
    Vue.set(state.idfoevents, id, market.idfoevent)
    Vue.set(selection, 'idfoevent', market.idfoevent)
    Vue.set(selection, 'csvavailablebettypes', market.csvavailablebettypes ? market.csvavailablebettypes.split(',') : [])
    Vue.set(selection, 'istradable', istradable)
    Vue.set(selection, 'isclosed', false)
    Vue.set(selection, 'idfosport', market.idfosport)
    // Vue.set(selection, 'hasDerivative', false)
    if (!selection.idfosporttype) {
      Vue.set(selection, 'idfosporttype', market.idfosporttype)
    }
    if (event && event.fosporttypename) {
      Vue.set(selection, 'fosporttypename', event.fosporttypename.toUpperCase() || null)
    }
    if (!selection.sportname && event) {
      Vue.set(selection, 'sportname', event.sportname || null)
    }
    Vue.set(selection, 'price', priceFormat.reCalculatePrice(selection))
    //
    let isForBB = context.getters.isBBenabled && (market.BB || (market.buybackmargin && (!market.buybackavonchannel || market.buybackavonchannel.split(',').indexOf('W3') > -1)))
    Vue.set(selection, 'isForBB', !!isForBB)
    //
    Vue.set(state.optedIn.REGULAR, id, true)
    Vue.set(state.optedIn.RR, id, true)
    // if (selection.csvavailablebettypes && selection.csvavailablebettypes.length > 1) {Vue.set(state.optedIn.RR, id, true)}
    //
    var derivativetypes = market.derivativetypes
    if (derivativetypes) {
      Vue.set(selection, 'derivativetypes', derivativetypes.split(','))
    }
    //
    state.betslipSelections.push(clone(selection))
    state.betslipSelectionIds.push(id)
    Vue.set(state.betslipSelectionsIds, id, true)
    //
    state.interRelated = interRelatedService.checkInterRelated(state.betslipSelections, state.markets)
    //
    var abtnr = {
      'PotentialReturn': selection.price,
      'TotalStake': 1,
      'UnitCount': 1
    }
    Vue.set(context.state.allowedBetTypesAndReturns.REGULAR.PotentialReturns.PerSelection, selection.idfoselection, abtnr)
    //
    if (context.getters.multiSinglesStake) {
      Vue.set(context.state.betTypeStakes.REGULAR.PerSelection, selection.idfoselection, context.getters.multiSinglesStake)
    }
    //
    context.dispatch('checkDerivatives', [state.betslipSelections[state.betslipSelections.length - 1], market])
    //
    var activateSingleBetslip = context.getters.isFastBetEnabled
    //
    if (state.betslipSelections.length === 1) {
      activateSingleBetslip = activateSingleBetslip && store.getters['screenState/getMobileBigAndBelow']
      if (activateSingleBetslip && !market.silent) {
        if (context.getters.rememberSingleBetSlipStake) {
          var sstake = context.getters.singleBetSlipStake
          if (sstake) {
            Vue.set(state.betTypeStakes.REGULAR.PerSelection, selection.idfoselection, sstake)
          }
        }
        store.dispatch('overlayState/activateSingleBetslip').then(function (r) {
          // console.log('resolve SingleBetslip: ' + r)
          document.activeElement.blur()

          if (r) {
            /*
            if (r === 'hide') {
            } else {
              context.dispatch('clearFastBetSlip', selection)
            }
            */
          } else {
            context.dispatch('clearFastBetSlip', selection)
          }
          store.dispatch('overlayState/deactivateSingleBetslip').then(function () {
            store.commit('sbBetslipState/setActiveBetSlip', false)
          })
        })
      }
    }

    if (activateSingleBetslip && state.betslipSelections.length > 1) {
      // console.log('hide FastBet on add selection')
      var dialogSingleBetslip = store.getters['overlayState/getSingleBetslipState']
      // console.log('get dialogSingleBetslip')
      if (dialogSingleBetslip && dialogSingleBetslip.active) {
        dialogSingleBetslip.resolve(false)
      }
    }
  },

  removeSelection (context, selectionArr) {
    var selection = selectionArr[0]
    var onButtonClick = selectionArr[2]
    if (onButtonClick) {
      context.dispatch('dispatchGTM', {method: 'sendGTMRemoveSelectionFromBetslip', data: [selection]})
    }
    // console.log('removeSelection')
    // console.log('typeof selection: ' + typeof selection)
    context.dispatch('unsubscribeFromMarket', selection)
    //
    var state = context.state
    const id = typeof selection === 'object' ? parseFloat(selection.idfoselection) : selection

    if (state.betslipSelectionIds.length === 1 && state.betslipSelectionIds[0] === id) {
      context.commit('clearBetSlip')
    } else {
      var index = state.betslipSelectionIds.indexOf(id)
      if (index > -1) {
        if (typeof selection === 'object') {
          selection.isSelected = false
        }
        state.betslipSelections.splice(index, 1)
        state.betslipSelectionIds.splice(index, 1)
      }
      //
      Vue.delete(state.betslipSelectionsIds, id)
      Vue.delete(state.markets, id)
      Vue.delete(state.idfomarkets, id)
      Vue.delete(state.idfoevents, id)
      Vue.delete(state.betTypeStakes.REGULAR.PerSelection, id)
      Vue.delete(state.returns.REGULAR.PerSelection, id)
      Vue.delete(state.optedIn.REGULAR, id)
      Vue.delete(state.optedIn.RR, id)
      Vue.delete(state.optedIn.TEASER, id)
      let teasersPriceTypes = context.getters.teasersPriceTypes || []
      teasersPriceTypes.forEach(function (tpt) {
        Vue.delete(state.derivatives.teasers.T[tpt], id)
      })
      Vue.delete(state.toggleTime, id)
      //
      if (state.config.derivatives.teasers.enabled) {
        for (var g = 0; g < state.derivatives.teasers.teaserGroups.length; g++) {
          let group = state.derivatives.teasers.teaserGroups[g]
          for (var s = 0; s < group.Selections.length; s++) {
            if (group.Selections[s].IDFOSelection === id) {
              Vue.delete(group.Selections, s)
              context.dispatch('scheduleGetTeaserGroups')
              break
            }
          }
        }
        //
        context.commit('resetActiveTeaser')
      }
      //
      if (state.config.derivatives.pitchers.enabled && state.derivatives.pitchers && state.derivatives.pitchers.derived && state.derivatives.pitchers.derived[id] && state.derivatives.pitchers.derived[id].length) {
        state.derivatives.pitchers.derived[id].forEach(function (p) {
          Vue.delete(state.derivatives.pitchers.sourceMap, p.idfoselection)
        })
        Vue.delete(state.derivatives.pitchers.derived, id)
      }
      //
      if (state.config.derivatives.buyPoints.enabled && state.derivatives.buyPoints && state.derivatives.buyPoints.derived && state.derivatives.buyPoints.derived[id] && state.derivatives.buyPoints.derived[id].length) {
        state.derivatives.buyPoints.derived[id].forEach(function (p) {
          Vue.delete(state.derivatives.buyPoints.sourceMap, p.idfoselection)
        })
        Vue.delete(state.derivatives.buyPoints.derived, id)
      }
      //
    }
    state.interRelated = interRelatedService.checkInterRelated(state.betslipSelections, state.markets)
    //
    store.dispatch('overlayState/deactivateSingleBetslip')
  },

  activateBetslipMsg (context, reasonsArr) {
    store.dispatch('overlayState/activateBetslipMsg', reasonsArr)
  },

  unsubscribeFromMarket (context, selection) {
    if (selection['@type']) {
      let liveEvents = store.getters['livebettingState/liveEvents']
      let matketToUnsubscribe

      for (let i = 0; i < liveEvents.length; i++) {
        matketToUnsubscribe = liveEvents[i].markets && liveEvents[i].markets.find(mk => mk.idfomarket === selection.idfomarket)
        if (matketToUnsubscribe) {
          break
        }
      }

      if (matketToUnsubscribe && matketToUnsubscribe.V) {
        lib.WebSocketLiveService.unsubscribeFromMarkets([matketToUnsubscribe])
      }
    }
  },

  unsubscribeFromAllMarkets (context) {
    var marketsToUnsubscribe = []
    let liveEvents = store.getters['livebettingState/liveEvents']

    if (context.state.betslipSelections && context.state.betslipSelections.length > 0) {
      context.state.betslipSelections.forEach(betslipSelections => {
        liveEvents.forEach(ev => {
          let market = ev.markets && ev.markets.find(mk => mk.idfomarket === betslipSelections.idfomarket)
          if (market) {
            marketsToUnsubscribe.push(market)
          }
        })
      })

      if (marketsToUnsubscribe.length > 0) {
        lib.WebSocketLiveService.unsubscribeFromMarkets(marketsToUnsubscribe)
      }
    }
  },

  clearBetSlip (context, data) {
    // console.log('clearBetSlip')
    data = data || {}
    var clearData = function () {
      context.dispatch('unsubscribeFromAllMarkets')
      context.commit('clearBetSlip')
      context.dispatch('clearAttemptedBetSlip')

      store.dispatch('overlayState/deactivateSingleBetslip')
    }
    if (data.onButtonClick) {
      context.dispatch('dispatchGTM', {method: 'sendGTMRemoveAllSelectionsFromBetslip'}).finally(function () {
        clearData()
      })
    } else {
      clearData()
    }
    if (!data.keepMobileBetSlipActive) {
      store.dispatch('overlayState/deactivateBetslip')
    }
    //
    context.dispatch('clearStoredBetSlip')
  },

  clearFastBetSlip (context, selection) {
    let preserveFastBetStakeForMain = context.getters.preserveFastBetStakeForMain
    if (!preserveFastBetStakeForMain) {
      Vue.delete(context.state.betTypeStakes.REGULAR.PerSelection, selection.idfoselection)
      Vue.delete(context.state.returns.REGULAR.PerSelection, selection.idfoselection)
    }
  }
}
export default actions
