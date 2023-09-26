import lib from '@/library'
import config from '@/config'
// import Vue from 'vue'

const state = {
  favoritesCandidatesByBetslipId: [],
  searchFavoritesPhrase: undefined,
  searchFavoritesResults: undefined,
  allFavorites: undefined,
  fpFavorites: undefined,
  searchInProgress: false,
  favNotificationPeriods: [],
  cpFavouriteNotificationMaxPerDay: undefined,
  cpFavouriteNotificationNotifyBeforeStart: undefined
}

const getters = {
  getFavoritesCandidatesByBetslipId () {
    return state.favoritesCandidatesByBetslipId
  },
  getSearchFavoritesPhrase () {
    return state.searchFavoritesPhrase
  },
  getSearchFavoritesResults () {
    return state.searchFavoritesResults
  },
  getSearchInProgress () {
    return state.searchInProgress
  },
  getAllFavorites () {
    return state.allFavorites
  },
  getFPFavorites () {
    return state.fpFavorites
  },
  getFavNotificationPeriods () {
    return state.favNotificationPeriods
  },
  getCPFavouriteNotificationNotifyBeforeStart (state) {
    return state.cpFavouriteNotificationNotifyBeforeStart
  },
  getCPFavouriteNotificationMaxPerDay (state) {
    return state.cpFavouriteNotificationMaxPerDay
  }
}

const mutations = {
  setFavoritesCandidatesByBetslipId (state, data) {
    state.favoritesCandidatesByBetslipId = data
  },
  setSearchFavoritesPhrase (state, data) {
    state.searchFavoritesPhrase = data
  },
  setSearchFavoritesResults (state, data) {
    state.searchFavoritesResults = data
  },
  setSearchInProgress (state, data) {
    state.searchInProgress = data
  },
  setAllFavorites (state, data) {
    state.allFavorites = data
  },
  setFPFavorites (state, data) {
    state.fpFavorites = data
  },
  setFavNotificationPeriods (state, data) {
    state.favNotificationPeriods = data
  },
  setCPFavouriteNotificationNotifyBeforeStart (state, data) {
    state.cpFavouriteNotificationNotifyBeforeStart = data
  },
  setCPFavouriteNotificationMaxPerDay (state, data) {
    state.cpFavouriteNotificationMaxPerDay = data
  }
}

const actions = {
  fetchFavoritesCandidatesByBetslipId (context, { idfobetslip }) {
    var data = {
      'idfobetslip': idfobetslip
    }
    lib.rpcService.callBroker('playerfavorites', 'getfavoritecandidates', data).then(response => {
      if (response && response.result) {
        context.commit('setFavoritesCandidatesByBetslipId', response.result.favorites)
      } else {
        context.commit('setFavoritesCandidatesByBetslipId', undefined)
      }
    }).catch((error) => {
      context.commit('setFavoritesCandidatesByBetslipId', undefined)
      console.error(error)
    })
  },
  saveFavoriteOnBetslip (context, data) {
    return lib.rpcService.callBroker('playerfavorites', 'setfavorites', {
      'favorites': [{
        'source': data.source,
        'type': data.type,
        'idfosporttype': data.idfosporttype,
        'favoriteid': data.favoriteid,
        'name': data.name,
        'order': data.order,
        'language': config.app.language,
        'enabled': data.enabled,
        'tonotify': data.tonotify
      }]
    })
  },
  fetchAllFavorites (context) {
    // var data = {
    //   'source': 'C',
    //   'type': 'S'
    // }
    lib.rpcService.callBroker('playerfavorites', 'getfavorites').then(response => {
      if (response && response.result) {
        context.commit('setAllFavorites', response.result.favorites)
      } else {
        context.commit('setAllFavorites', undefined)
      }
    }).catch((error) => {
      context.commit('setAllFavorites', undefined)
      console.error(error)
    })
  },
  fetchFPFavorites (context) {
    lib.rpcService.callBroker('playerfavorites', 'getfavorites', { 'source': 'S' }).then(response => {
      if (response && response.result) {
        context.commit('setFPFavorites', response.result.favorites)
      } else {
        context.commit('setFPFavorites', undefined)
      }
    }).catch((error) => {
      context.commit('setFPFavorites', undefined)
      console.error(error)
    })
  },
  fetchFavoritesSearchResults (context) {
    var data = {
      'phrase': state.searchFavoritesPhrase
    }
    context.commit('setSearchInProgress', true)
    lib.rpcService.callBroker('playerfavorites', 'getfavoritecandidates', data).then(response => {
      if (response && response.result) {
        context.commit('setSearchFavoritesResults', response.result.favorites)
      } else {
        context.commit('setSearchFavoritesResults', undefined)
      }
    }).catch((error) => {
      context.commit('setSearchFavoritesResults', undefined)
      console.error(error)
    }).finally(() => {
      context.commit('setSearchInProgress', false)
    })
  },
  clearFavoritesResults (context) {
    context.commit('setSearchFavoritesResults', undefined)
  },
  fetchFavNotificationPeriods (context) {
    lib.kansas.psFavNotificationPeriods().then(response => {
      if (response.data) {
        context.commit('setFavNotificationPeriods', response.data)
      } else {
        context.commit('setFavNotificationPeriods', [])
      }
    }).catch((error) => {
      console.log(error)
      context.commit('setFavNotificationPeriods', [])
    })
  },
  fetchCustomerPreferences (context) {
    lib.rpcService.callBroker('user', 'getcustomerpreferences', {
      'names': ['FavouriteNotificationMaxPerDay', 'FavouriteNotificationNotifyBeforeStart']
    }).then(response => {
      if (response && response.result) {
        for (var i = 0; i < response.result.length; i++) {
          var item = response.result[i]
          if (item.name === 'FavouriteNotificationMaxPerDay') {
            context.commit('setCPFavouriteNotificationMaxPerDay', item.value)
          }
          if (item.name === 'FavouriteNotificationNotifyBeforeStart') {
            context.commit('setCPFavouriteNotificationNotifyBeforeStart', item.value)
          }
        }
      } else {
        context.commit('setCPFavouriteNotificationMaxPerDay', undefined)
        context.commit('setCPFavouriteNotificationNotifyBeforeStart', undefined)
      }
    }).catch((error) => {
      context.commit('setCPFavouriteNotificationMaxPerDay', undefined)
      context.commit('setCPFavouriteNotificationNotifyBeforeStart', undefined)
      console.error(error)
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
