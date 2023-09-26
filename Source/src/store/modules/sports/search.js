import Axios from 'axios'
import config from '@/config'

const state = {
  phrase: '',
  eventsLoaded: false,
  results: undefined,
  sportEvents: undefined,
  competitionEvents: undefined,
  routeToExitSearch: ''
}

const getters = {
  getPhrase (state) {
    return state.phrase
  },
  getEventsLoaded (state) {
    return state.eventsLoaded
  },
  getResults (state) {
    return state.results
  },
  getSportEvents (state) {
    return state.sportEvents
  },
  getCompetitionEvents (state) {
    return state.competitionEvents
  },
  getRouteToExitSearch (state) {
    return state.routeToExitSearch
  }
}

const mutations = {
  setPhrase (state, phrase) {
    state.phrase = phrase.trim()
  },
  setEventsLoaded (state, value) {
    state.eventsLoaded = value
  },
  setResults (state, results) {
    state.results = results
  },
  setSportEvents (state, results) {
    state.sportEvents = results
  },
  setCompetitionEvents (state, results) {
    state.competitionEvents = results
  },
  setRouteToExitSearch (state, value) {
    state.routeToExitSearch = value
  }
}

const actions = {
  fetchSearchResults (context) {
    // var result = state.mockResults
    // console.log('search by phrase: ' + state.phrase)
    // context.commit('setResults', result)
    // context.commit('setEventsLoaded', true)

    context.commit('setEventsLoaded', false)
    Axios.get(config.app.autoconf.SEARCH_MANAGER_HOSTNAME + '/searchmanager/search?searchQuery=' + state.phrase)
      .then((response) => {
        if (response && response.data) {
          context.commit('setResults', response.data)
          if (window.xtremepush || (config.app.autoconf.XTREMEPUSH_ANALYTICS && window.ctsautoconf.MOBILE_LS)) {
            let xtremeObj = {
              'param1': 'event',
              'param2': 'search',
              'param3': {
                'text_searched': state.phrase
              }
            }
            context.dispatch('analyticsHandler', {'event': false, 'xtremeObj': xtremeObj}, { root: true })
          }
        } else {
          context.commit('setResults', undefined)
        }
      })
      .catch((error) => {
        context.commit('setResults', undefined)
        console.log('search by phrase error: (phrase: \'' + state.phrase + '\'): ' + error.message)
      })
      .finally(() => {
        context.commit('setEventsLoaded', true)
      })
  },
  fetchEventsByIdFoSport (context, idfosport) {
    // var result = state.mockEvents
    // context.commit('setSportEvents', result)

    Axios.get(config.app.autoconf.SEARCH_MANAGER_HOSTNAME + '/searchmanager/sportEvents?idfosport=' + idfosport)
      .then((response) => {
        if (response && response.data && response.data.fosporttypes) {
          context.commit('setSportEvents', response.data.fosporttypes)
        } else {
          context.commit('setSportEvents', undefined)
        }
      })
      .catch((error) => {
        context.commit('setSportEvents', undefined)
        console.log('fetch sport events error (idfosport: ' + idfosport + '): ' + error.message)
      })
  },
  fetchEventsByIdFoCompetition (context, data) {
    // var result = state.mockEvents
    // context.commit('setCompetitionEvents', result)

    Axios.get(config.app.autoconf.SEARCH_MANAGER_HOSTNAME + '/searchmanager/competitionEvents?idfosport=' + data.idfosport + '&idfocompetition=' + data.idfocompetition)
      .then((response) => {
        if (response && response.data && response.data.fosporttypes) {
          context.commit('setCompetitionEvents', response.data.fosporttypes)
        } else {
          context.commit('setCompetitionEvents', undefined)
        }
      })
      .catch((error) => {
        context.commit('setCompetitionEvents', undefined)
        console.log('fetch competition events error (idfosport=' + data.idfosport + '&idfocompetition=' + data.idfocompetition + '): ' + error.message)
      })
  },
  clearCachedResults (context) {
    context.commit('setResults', undefined)
  },
  clearSportEvents (context) {
    context.commit('setSportEvents', undefined)
  },
  clearCompetitionEvents (context) {
    context.commit('setCompetitionEvents', undefined)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
