import lib from '@/library'

const supportedChannelIds = ['EMAIL', 'SMS']

const getDefaultState = () => {
  return {
    categories: null,
    operationError: '',
    isProcessing: false
  }
}

const state = getDefaultState()

const getters = {
  isProcessing (state) {
    return state.isProcessing
  }
}

const mutations = {
  resetState (state) {
    Object.assign(state, getDefaultState())
  },

  setCategories (state, value) {
    state.categories = value
  },

  setIsProcessing (state, value) {
    state.isProcessing = value
    if (value) {
      state.operationError = ''
    }
  },

  setOperationError (state, value) {
    state.operationError = value
  }
}

const actions = {
  async fetchPreferences ({ commit }) {
    try {
      commit('setIsProcessing', true)

      let categories = await lib.rpcService.callBroker('GamingNotificationService', 'GetCategoriesApplicableToChannel', {
        channelIds: supportedChannelIds
      })

      if (categories && categories.result) {
        for (const category of categories.result) {
          const preferences = await lib.rpcService.callBroker('GamingNotificationService', 'GetPreferencesForSubscriber', {
            categoryId: category.CategoryId
          })
          if (preferences && preferences.result) {
            category.preferences = preferences.result
          }
        }

        commit('setCategories', categories.result)
        console.log(categories.result)
      }
    } catch (err) {
      commit('setCategories', [])
      commit('setOperationError', err.message)
      console.error('fetchPreferences() error', err)
    } finally {
      commit('setIsProcessing', false)
    }
  },

  // preferences payload must be in following format:
  // [{
  //   "Channel": "EMAIL",
  //   "OfferId": "MM-PROMOTIONS",
  //   "Operation": "DEACTIVATE"
  // }, {
  //   "Channel": "SMS",
  //   "OfferId": "MM-PROMOTIONS",
  //   "Operation": "ACTIVATE"
  // }]
  async savePreferences ({ commit }, preferences) {
    try {
      commit('setIsProcessing', true)
      await lib.rpcService.callBroker('GamingNotificationService', 'UpdatePreferences', {
        preferenceUpdateRequests: preferences
      })
    } catch (err) {
      commit('setOperationError', err.message)
      console.error('savePreferences() error', err)
    } finally {
      commit('setIsProcessing', false)
    }
  },

  async resetToDefaults ({ commit }, preferences) {
    try {
      commit('setIsProcessing', true)
      await lib.rpcService.callBroker('GamingNotificationService', 'ResetToDefaults', {
        channelIds: supportedChannelIds
      })
    } catch (err) {
      console.error('resetToDefaults() error', err)
    } finally {
      commit('setIsProcessing', false)
    }
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
