import lib from '@/library'
import config from '@/config'
import contestsReports from '@/store/modules/contests/contestsReports.js'
import contestPicks from '@/store/modules/contests/contestPicks.js'

const state = () => ({
  contests: [],
  contests4All: [],
  contestEntries: [],
  latestEntry: {},
  contestRules: '',
  contestsMediaUrl: config.app.autoconf.CONTESTS_MEDIA_URL,
  currentUtcDateTime: '',
  errorDialogMessage: ''
})

const getters = {
  getContests (state) {
    return state.contests
  },
  getContestEntries (state) {
    return state.contestEntries
  },
  getContestRules (state) {
    return state.contestRules
  },
  getLatestEntry (state) {
    return state.latestEntry
  },
  getContestFromContests: (state) => (id) => {
    return state.contests.find(contest => contest.id === id)
  },
  getContestEntry: (state) => (id) => {
    return state.contestEntries.find(entry => entry.contestEntryId === id)
  },
  getContestEntriesForContest: (state) => (contestId) => {
    return state.contestEntries.filter(entry => entry.contest.id === contestId)
  },
  getContestsByStage: (state) => (stage) => {
    switch (stage) {
      case 'upcoming':
        return state.contests.filter(contest => ['ENT', 'ANN'].includes(contest.phase))
      case 'entered':
        let enteredContests = []
        let filteredEnteredEntries = state.contestEntries.filter(entry => ['ENF', 'ACT', 'CLS', 'ENT'].includes(entry.contest.phase))
        /*
        For multiple entry contests, unique identifiers are:
        contestEntryId + contest
        */
        filteredEnteredEntries.forEach(entry => enteredContests.push({
          contestEntryId: entry.contestEntryId,
          alias: entry.alias,
          rank: `${entry.position.rank}/${entry.contest.contestEntryCount}`,
          round: entry.contest.currentRound,
          contest: entry.contest
        }))
        return enteredContests
      case 'completed':
        let completedContests = []
        let filteredCompletedEntries = state.contestEntries.filter(entry => ['STL', 'PAD'].includes(entry.contest.phase))
        filteredCompletedEntries.forEach(entry => completedContests.push(entry.contest))
        return completedContests
      default:
        console.error('getContestsByStage(stage) - `stage` is not valid. Must be one of the following values: `upcoming`, `entered`, `completed`')
    }
  },
  getContests4All (state) {
    return state.contests4All
  },
  getCurrentUtcDateTime (state) {
    return state.currentUtcDateTime
  },
  getErrorDialogMessage (state) {
    return state.errorDialogMessage
  }
}

const mutations = {
  setContests (state, data) {
    state.contests = data
  },
  setContestEntries (state, data) {
    state.contestEntries = data
  },
  setContestRules (state, data) {
    state.contestRules = data
  },
  setLatestEntry (state, data) {
    state.latestEntry = data
  },
  setContests4All (state, data) {
    state.contests4All = data
  },
  setCurrentUtcDateTime (state, data) {
    state.currentUtcDateTime = data
  },
  setErrorDialogMessage (state, data) {
    state.errorDialogMessage = data
  }
}

const actions = {
  async fetchContestsAndContestEntries (context) {
    try {
      const response = await lib.rpcService.callBroker('contests', 'contestsandentriesinfo', {})
      if (response && response.result && !response.result.Error) {
        context.commit('setContests', response.result.Result.contests)
        context.commit('setContestEntries', response.result.Result.contestEntries)
        context.dispatch('fetchCurrentUtcDateTime')
        return response.result
      } else {
        console.error(response.result.Error)
        return response.result
      }
    } catch (exception) {
      console.log(exception)
    }
  },
  async fetchContestRules (context, payload) {
    try {
      const response = await fetch(`${context.state.contestsMediaUrl}${payload}`)
      if (!response.ok) {
        context.commit('setContestRules', '')
      } else {
        const rules = await response.text()
        context.commit('setContestRules', rules)
      }
    } catch (exception) {
      console.log(exception)
    }
  },
  async registerContestEntry (context, payload) {
    try {
      const response = await lib.rpcService.callBroker('contests', 'registercontestentry', payload)
      if (response && response.result && response.result.Result && !response.result.Error) {
        context.commit('setLatestEntry', response.result.Result)
        return response.result
      } else {
        console.error(response.result.Error)
        return response.result
      }
    } catch (exception) {
      console.log(exception)
    }
  },
  removeLatestEntry (context) {
    context.commit('setLatestEntry', {})
  },
  async fetchContests4All (context) {
    try {
      const response = await lib.rpcService.callBroker('contests', 'contests4all', {})
      if (response && response.result && !response.result.Error) {
        context.commit('setContests4All', response.result.Result)
        context.dispatch('fetchCurrentUtcDateTime')
        return response.result
      } else {
        console.error(response.result.Error)
        return response.result
      }
    } catch (error) {
      console.log(error)
    }
  },
  async fetchCurrentUtcDateTime (context) {
    try {
      const response = await lib.rpcService.callBroker('utility', 'getcurrentutcdatetime')
      context.commit('setCurrentUtcDateTime', response.result.ServerDateTime.UtcDateTime)
    } catch (error) {
      console.log(error)
    }
  }
}

const modules = {
  contestsReports,
  contestPicks
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
  modules
}
