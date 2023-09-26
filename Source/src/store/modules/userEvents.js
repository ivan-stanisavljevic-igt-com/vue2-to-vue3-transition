import lib from '@/library'

const state = {
  events: [],
  serverRequestIsScheduled: false
}
const actions = {
  batchEvent (context, e) {
    state.events.push(e)
    if (!state.serverRequestIsScheduled) {
      state.serverRequestIsScheduled = true
      setTimeout(() => context.dispatch('post2Server'), 10e3)
    }
  },
  async post2Server (context) {
    try {
      const adjustedEvents = await context.dispatch('adjustTimeDiff', state.events)
      await lib.rpcService.callBroker('iw', 'logcustomeraccess', {
        customeraccesses: adjustedEvents
      })
    } catch (error) {
      console.log(`iw.LogCustomerAccess | ERROR | ${error && error.message}`)
    } finally {
      await context.dispatch('cleanUpState')
    }
  },
  adjustTimeDiff (context, arrOfEvents) {
    return arrOfEvents.map(event => {
      return {
        accesstype: event.accesstype,
        offset: (Date.now() - event.timestamp),
        payload: event.payload || null
      }
    })
  },
  cleanUpState () {
    state.events = []
    state.serverRequestIsScheduled = false
  }
}
export default {
  namespaced: true,
  actions
}
