import Vue from 'vue'
// import store from '@/store'

const actions = {
  storePlacedBetEvents (context, data) {
    // console.log('storePlacedBetEvents:', data)
    if (context.getters.storePlacedBetEvents) {
      var accountDetails = context.rootGetters['getCustomerContext']
      var creditAccountDetails = accountDetails && accountDetails.Balances && accountDetails.Balances.find(item => item.Key === 'CREDIT')
      var accountNumber = creditAccountDetails && creditAccountDetails.AccountNumber
      //
      if (accountNumber) {
        if (!context.state.placedBetsOnEvents[accountNumber]) {
          Vue.set(context.state.placedBetsOnEvents, accountNumber, {})
        }
        var ts = new Date().getTime()
        for (var i = 0; i < data.payload.Bets.length; i++) {
          for (var j = 0; j < data.payload.Bets[i].BetLegs.length; j++) {
            var leg = data.payload.Bets[i].BetLegs[j]
            Vue.set(context.state.placedBetsOnEvents[accountNumber], leg.IDFOEvent, ts)
          }
        }
      }
      var storage = localStorage
      storage.setItem('placedBetsOnEvents', JSON.stringify(context.state.placedBetsOnEvents))
    }
  },
  getStoredBetsOnEvents (context) {
    // console.log('getStoredBetsOnEvents')
    var storage = localStorage
    var stored = storage.getItem('placedBetsOnEvents') || '{}'
    stored = JSON.parse(stored)
    Vue.set(context.state, 'placedBetsOnEvents', stored)
    context.dispatch('clearOldEvents')
  },
  clearOldEvents (context) {
    // console.log('clearOldEvents')
    var placedBetsOnEvents = context.state.placedBetsOnEvents
    var clearEventsOlderThan = context.getters.clearEventsOlderThan
    var c = 0
    var now = new Date().getTime()
    for (var accountNumber in placedBetsOnEvents) {
      for (var i in placedBetsOnEvents[accountNumber]) {
        var dt = now - placedBetsOnEvents[accountNumber][i]
        if (dt > clearEventsOlderThan) {
          c++
          Vue.delete(placedBetsOnEvents[accountNumber], i)
        }
      }
    }
    if (c) {
      localStorage.setItem('placedBetsOnEvents', JSON.stringify(placedBetsOnEvents))
    }
  }
}

export default actions
