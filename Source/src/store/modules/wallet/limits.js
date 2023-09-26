import lib from '@/library'

const state = {
  timeLimits: null,
  playLimits: null,
  playLimitsFetchCompleted: false,
  playLimitsFetchFailed: false,
  postLoginDialog: true
}
const getters = {
  timeLimits: () => state.timeLimits,
  playLimits: () => state.playLimits,
  sessionLimit: () => state.timeLimits && state.timeLimits.find(l => l.TimeType === 'SESSION'),
  postLoginDialog () {
    return state.postLoginDialog
  }
}
const actions = {
  fetchTimeLimits: async () => {
    try {
      const response = await lib.rpcService.callBroker('account', 'getcustomertimelimits', {})
      if (response && response.result && response.result.length > 0) {
        state.timeLimits = response.result[0]
      }
    } catch (exception) {
      console.log(exception)
    }
  },
  fetchTimeLimitsV2: async () => {
    try {
      const response = await lib.rpcService.callBroker('account', 'getcustomertimelimitsv2', {})
      if (response && response.result && response.result.length > 0) {
        state.timeLimits = response.result
      }
    } catch (exception) {
      console.log(exception)
    }
  },
  setTimeLimit: async (context, payload) => {
    try {
      await lib.rpcService.callBroker('account', 'setcustomertimelimit', payload)
    } catch (exception) {
      console.log(exception)
      throw exception
    }
  },
  fetchPlayLimits: async () => {
    try {
      const response = await lib.rpcService.callBroker('account', 'getaccountlimits', {})
      if (response && response.result && response.result.length > 0) {
        // sort response by limitperiodindays (typeof number), then by idmmlmtype (typeof string)
        state.playLimits = response.result.sort((a, b) => ((a.limitperiodindays - b.limitperiodindays) || a.idmmlmtype.localeCompare(b.idmmlmtype)))
      }
      state.playLimitsFetchCompleted = true
    } catch (exception) {
      console.log(exception)
      state.playLimitsFetchFailed = true
    }
  },
  setLimit: async (context, payload) => {
    try {
      await lib.rpcService.callBroker('account', 'SetMMLMAccountLimit', payload)
    } catch (exception) {
      console.log(exception)
      throw exception
    }
  },
  closePostLoginDialog () {
    state.postLoginDialog = false
  }
}
export function sortTimeLimits (input) {
  const output = []
  if (Array.isArray(input)) {
    const daily = input.find(e => e.TimeType.toLocaleLowerCase() === 'day')
    if (daily) output.push(daily)
    const weekly = input.find(e => e.TimeType.toLocaleLowerCase() === 'week')
    if (weekly) output.push(weekly)
    const monthly = input.find(e => e.TimeType.toLocaleLowerCase() === 'month')
    if (monthly) output.push(monthly)
    const session = input.find(e => e.TimeType.toLocaleLowerCase() === 'session')
    if (session) output.push(session)
  }
  return output
}
export default {
  namespaced: true,
  state,
  getters,
  actions
}
