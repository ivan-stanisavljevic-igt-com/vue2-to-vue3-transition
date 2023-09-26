import lib from '@/library'

const state = {
  isProcessingFetchPromotions: false,
  vouchersForAccountPromotionsPage: []
}
const getters = {
}
const mutations = {
  setIsProcessingFetchPromotions (state, value) {
    state.isProcessingFetchPromotions = value
  },
  setVouchersForAccountPromotionsPage (state, value) {
    state.vouchersForAccountPromotionsPage = value
  }
}
const actions = {
  async fetchVouchersForAccountPromotionsPage ({ commit }) {
    try {
      commit('setIsProcessingFetchPromotions', true)
      let optionsNoFilter = {
        IDMMAccount: null,
        OrderBy: 'TSCREATED',
        OrderType: 'ASC'
      }
      const response = await lib.rpcService.callBroker('AccountService', 'GetAccountPromotionalVouchers', optionsNoFilter)
      commit('setVouchersForAccountPromotionsPage', response.result)
    } catch (err) {
      console.error('fetchActivePromotionalVouchers() catch:', err)
      commit('setVouchersForAccountPromotionsPage', [])
    } finally {
      commit('setIsProcessingFetchPromotions', false)
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
