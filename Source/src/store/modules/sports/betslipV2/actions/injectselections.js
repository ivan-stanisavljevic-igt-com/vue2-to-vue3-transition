import lib from '@/library'

const actions = {
  fetchMultipleSelections (context, dataArr) {
    // console.log('fetchMultipleSelections')
    var idfoselections = dataArr.join('-')
    var shouldAbort = []
    //
    var processData = function (data) {
      var arr = []
      var maxSno = context.getters.maxSno
      var addingMiltipleSelections = context.getters.addingMiltipleSelections
      // console.log('addingMiltipleSelections conf:')
      // console.log(addingMiltipleSelections)
      var allowSuspended = addingMiltipleSelections && addingMiltipleSelections.allowSuspended
      var abortIfHasSuspended = addingMiltipleSelections && addingMiltipleSelections.abortIfHasSuspended
      var hasSuspended = false
      var invalidSelection = false
      var nAsked = dataArr.length
      var nFetched = 0
      //
      data.forEach(function (m) {
        var istradable = m.istradable && JSON.parse(m.istradable)
        if (!istradable) {
          hasSuspended = true
        }
        nFetched += m.selections.length
        if (allowSuspended || istradable) {
          m.selections.forEach(function (s) {
            if (s.currentpricedown && s.currentpriceup) {
              s.isInjectedFrom3rdParty = true
              if (arr.length < maxSno) {
                arr.push([s, m])
              }
            } else {
              invalidSelection = true
            }
          })
        }
      })
      //
      if (invalidSelection) {
        shouldAbort.push('multiInjection.invalidSelection')
      }
      if (nAsked !== nFetched) {
        shouldAbort.push('multiInjection.ContainsClosedSelections')
      }
      if (abortIfHasSuspended && hasSuspended) {
        shouldAbort.push('multiInjection.ContainsSuspendedSelections')
      }
      //
      if (shouldAbort.length) {
        setTimeout(function () {
          context.dispatch('activateBetslipMsg', shouldAbort)
        }, 0)
        return []
      }
      //
      return arr
    }
    //
    return lib.kansas.marketsbyselections({
      idfoselections: idfoselections
    }).then(response => {
      if (response && response.data && response.data.market) {
        return processData(response.data.market)
      }
      setTimeout(function () {
        context.dispatch('activateBetslipMsg', ['multiInjection.UnexpectedError'])
      }, 0)
      return []
    }).catch((error) => {
      console.log('Error fetching marketsbyselections')
      console.log(error)
      setTimeout(function () {
        context.dispatch('activateBetslipMsg', ['multiInjection.UnexpectedError'])
      }, 0)
      return []
    })
  },
  injectselections (context, dataArr) {
    // !!! USED BY EXTERNAL COMPONENT !!!
    console.log('injectselections: ' + dataArr)
    if (context.state.currentBetSlipState >= 1) {
      setTimeout(function () {
        context.dispatch('activateBetslipMsg', ['multiInjection.NOT_IDLE'])
      }, 0)
      return
    }
    //
    if (dataArr && dataArr.length) {
      // context.dispatch('clearStoredBetSlip')
      context.dispatch('fetchMultipleSelections', dataArr).then(function (data) {
        if (data.length) {
          context.commit('resetAllowedBetTypesAndReturns', true)
          context.dispatch('clearStoredBetSlip')
          context.dispatch('clearBetSlip')
          context.dispatch('resetBetSlipChanges')
          context.commit('setTab', 'REGULAR')
          context.commit('setAddingMiltipleSelections', true)
          var j = 0
          for (var i = 0; i < data.length; i++) {
            var pair = data[i]
            context.dispatch('toggleBetslipSelection', pair).then(function () {
              j++
              if (j === data.length) {
                context.commit('setAddingMiltipleSelections', false)
              }
            })
          }
        }
      })
    }
  }
}

export default actions
