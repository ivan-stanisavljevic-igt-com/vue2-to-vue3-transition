import lib from '@/library'
import Vue from 'vue'

const state = {
  event: undefined
}

const getters = {
  getEvent (state) {
    return state.event
  }
}

const mutations = {
  setEvent (state, event) {
    state.event = event
  }
}

const actions = {
  fetchEventById (context, request) {
    return new Promise((resolve) => {
      lib.kansas.psevent({
        idfoevent: request.idfoevent,
        isliveevent: request.isliveevent
      }).then(response => {
        if (response.data) {
          var eventmarketgroups = response.data.eventmarketgroups

          if (eventmarketgroups && eventmarketgroups.length > 0) {
            eventmarketgroups.forEach(emg => {
              if (emg.markets && emg.markets.length > 0) {
                emg.markets.forEach(mk => {
                  if (mk && mk.selections) {
                    mk.selections.forEach(sel => {
                      if (sel && !sel.price && sel.currentpriceup && sel.currentpricedown) {
                        Vue._.set(sel, 'price', (1 + sel.currentpriceup / sel.currentpricedown))
                      }
                    })
                  }
                })
              }
            })
          }
          context.commit('setEvent', response.data)
        } else {
          context.commit('setEvent', undefined)
        }
      }).catch((error) => {
        console.log(error)
        context.commit('setEvent', undefined)
      }).finally(() => {
        resolve()
      })
    })
  },
  clearCachedEvent (context) {
    context.commit('setEvent', undefined)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
