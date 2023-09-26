import lib from '@/library'

const state = () => ({
  contestEventsPicks: []
})

const getters = {
  getContestEventsPicks (state) {
    return state.contestEventsPicks
  },
  getPicksCount (state) {
    let picksCounter = 0
    state.contestEventsPicks.forEach(event => {
      event.markets.forEach(market => {
        market.selections.forEach(selection => {
          if (selection.pickId) picksCounter++
        })
      })
    })
    return picksCounter
  }
}

const mutations = {
  setContestEventPicks (state, data) {
    state.contestEventsPicks = data
  }
}

const actions = {
  async fetchContestEventPicks (context, payload) {
    try {
      const response = await lib.rpcService.callBroker('contests', 'eventspicks', payload)
      if (response && response.result && response.result.Result && !response.result.Error) {
        context.commit('setContestEventPicks', response.result.Result)
        return response.reult
      } else {
        console.error(response.result.Error)
        return response.result
      }
    } catch (exception) {
      console.log(exception)
    }
  },
  async placePick (context, payload) {
    try {
      const response = await lib.rpcService.callBroker('contests', 'placepick', payload)
      if (response && response.result && response.result.Result && !response.result.Error) {
        context.commit('setContestEventPicks', response.result.Result)
        return response.result
      } else {
        console.error(response.result.Error)
        return response.result
      }
    } catch (exception) {
      console.log(exception)
    }
  },
  async cancelPick (context, payload) {
    try {
      const response = await lib.rpcService.callBroker('contests', 'cancelpick', payload)
      if (response && response.result && response.result.Result && !response.result.Error) {
        context.commit('setContestEventPicks', response.result.Result)
        return response.result
      } else {
        console.error(response.result.Error)
        return response.result
      }
    } catch (exception) {
      console.log(exception)
    }
  },
  async cancelAndPlacePick (context, payload) {
    try {
      const response = await lib.rpcService.callBroker('contests', 'cancelandplacepick', payload)
      if (response && response.result && response.result.Result && !response.result.Error) {
        context.commit('setContestEventPicks', response.result.Result)
        return response.result
      } else {
        console.error(response.result.Error)
        return response.result
      }
    } catch (exception) {
      console.log(exception)
    }
  },
  async cancelRoundPicks (context, payload) {
    try {
      const response = await lib.rpcService.callBroker('contests', 'cancelroundpicks', payload)
      if (response && response.result && response.result.Result && !response.result.Error) {
        context.commit('setContestEventPicks', response.result.Result)
        return response.result
      } else {
        console.error(response.result.Error)
        return response.result
      }
    } catch (exception) {
      console.log(exception)
    }
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
