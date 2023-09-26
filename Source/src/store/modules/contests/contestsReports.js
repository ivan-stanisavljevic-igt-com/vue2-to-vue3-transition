import lib from '@/library'
import config from '@/config'

const state = () => {
  return {
    leaderBoardPositionReport: [],
    roundPicksReport: [],
    roundPicksSummary: [],
    myPickHistory: []
  }
}

const getters = {
  getLeaderBoardPositionReport (state) {
    return state.leaderBoardPositionReport
  },
  getRoundPicksReport (state) {
    return state.roundPicksReport
  },
  getRoundPicksSummary (state) {
    return state.roundPicksSummary
  },
  getMyPickHistory (state) {
    return state.myPickHistory
  }
}

const mutations = {
  setLeaderBoardPositionReport (state, data) {
    state.leaderBoardPositionReport = data
  },
  setRoundPicksReport (state, data) {
    state.roundPicksReport = data
  },
  setRoundPicksSummary (state, data) {
    state.roundPicksSummary = data
  },
  setMyPickHistory (state, data) {
    state.myPickHistory = data
  }
}

const actions = {
  async fetchLeaderBoardPositionReport (context, payload) {
    try {
      const params = {...payload, language: config.app.language}
      // console.log(params, payload)
    //   console.log('fetchLeaderBoardPositionReport - payload: ', payload)
      const response = await lib.kansas.contestsLeaderboard(params)
    //   console.log('fetchLeaderBoardPositionReport - response: ', response)
      if (response && response.data) {
        context.commit('setLeaderBoardPositionReport', response.data)
        return response.data
      } else {
        context.commit('setLeaderBoardPositionReport', null)
        return null
      }
    } catch (error) {
      console.log(error)
    }
  },
  async fetchRoundPicksReport (context, payload) {
    try {
      const params = {...payload, language: config.app.language}
      // console.log(params, payload)
    //   console.log('fetchRoundPicksReport - payload: ', payload)
      const response = await lib.kansas.contestsRoundPicks(params)
    //   console.log('fetchRoundPicksReport - response: ', response)
      if (response && response.data) {
        context.commit('setRoundPicksReport', response.data)
      } else {
        context.commit('setRoundPicksReport', null)
      }
    } catch (error) {
      console.log(error)
    }
  },
  async fetchRoundPicksSummary (context, payload) {
    try {
      const params = {...payload, language: config.app.language}
      // console.log(params, payload)
      // console.log('fetchRoundPicksSummary - payload: ', payload)
      const response = await lib.kansas.contestsRoundPicksSummary(params)
      // console.log('fetchRoundPicksSummary - response: ', response)
      if (response && response.data) {
        context.commit('setRoundPicksSummary', response.data)
      } else {
        context.commit('setRoundPicksSummary', null)
      }
    } catch (error) {
      console.log(error)
    }
  },
  async fetchMyPickHistory (context, payload) {
    try {
      const response = await lib.rpcService.callBroker('contests', 'picksbyround', {
        'contestEntryId': payload
      })
      if (response && response.result && response.result.Result && !response.result.Error) {
        // console.log(response.result.Result)
        context.commit('setMyPickHistory', response.result.Result)
      } else {
        context.commit('setMyPickHistory', null)
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
