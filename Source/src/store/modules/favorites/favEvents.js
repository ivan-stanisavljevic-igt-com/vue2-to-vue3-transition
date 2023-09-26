import lib from '@/library'
// import Vue from 'vue'

const state = {
  myEvents: undefined,
  favEvents: undefined,
  favEventsLoaded: false
}

const getters = {
  getMyEvents () {
    return state.myEvents
  },
  getFavEvents (state) {
    return state.favEvents
  },
  getFavEventsLoaded (state) {
    return state.favEventsLoaded
  }
}

const mutations = {
  setMyEvents (state, data) {
    state.myEvents = data
  },
  setFavEvents (state, events) {
    state.favEvents = events
  },
  setFavEventsLoaded (state, data) {
    state.favEventsLoaded = data
  }
}

const actions = {
  fetchMyEvents (context, data) {
    // var data = {
    //   'excludesources': 'S'
    // }
    lib.rpcService.callBroker('playerfavorites', 'getevents', data).then(response => {
      if (response && response.result && response.result.sporttypes && response.result.sporttypes.length > 0) {
        context.commit('setMyEvents', response.result)
      } else {
        context.commit('setMyEvents', undefined)
        context.commit('setFavEventsLoaded', true)
      }
    }).catch((error) => {
      context.commit('setMyEvents', undefined)
      context.commit('setFavEventsLoaded', true)
      console.error(error)
    })
  },
  fetchFavEvents (context, arrayOfIds) {
    const favEventsRequests = []
    arrayOfIds.forEach(item => {
      if (item && item.length > 0) {
        favEventsRequests.push(lib.kansas.psFavEvents({csvlist: item.join(',')}))
      }
    })
    Promise.all(favEventsRequests).then(function (results) {
      if (results) {
        var mergedResponses = []
        results.forEach(result => {
          if (result.data.events) {
            mergedResponses = [...mergedResponses, ...result.data.events]
          }
        })
        var events = {'events': mergedResponses}
        context.commit('setFavEvents', events)
      } else {
        context.commit('setFavEvents', undefined)
      }
    }).catch((error) => {
      console.log(error)
      context.commit('setFavEvents', undefined)
    }).finally(() => {
      context.commit('setFavEventsLoaded', true)
    })
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
