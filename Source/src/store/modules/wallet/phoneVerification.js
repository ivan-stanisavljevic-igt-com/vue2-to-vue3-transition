import lib from '@/library'

const STATUS_LINKED = 'LINKED'
const STATUS_NOT_LINKED = 'NOT_LINKED'
const STATUS_PENDING_LINK = 'PENDING_LINK'
const STATUS_PENDING_UNLINK = 'PENDING_UNLINK'

const state = {
  linkStatus: null,
  operationError: '',
  isProcessing: false
}

const getters = {
  isPhoneLinked (state) {
    return state.linkStatus ? state.linkStatus.StatusDescription === STATUS_LINKED : false
  },

  isPhoneNotLinked (state) {
    return state.linkStatus ? state.linkStatus.StatusDescription === STATUS_NOT_LINKED : false
  },

  isPhoneLinkPending (state) {
    return state.linkStatus ? state.linkStatus.StatusDescription === STATUS_PENDING_LINK : false
  },

  isPhoneUnlinkPending (state) {
    return state.linkStatus ? state.linkStatus.StatusDescription === STATUS_PENDING_UNLINK : false
  },

  // returns phone number from GNS if phone is in linked/pending-link/pending-unlink state
  phoneNumber (state, getters) {
    if (!state.linkStatus || getters.isPhoneNotLinked) {
      return null
    }
    return state.linkStatus.msin
  },

  isProcessing (state) {
    return state.isProcessing
  }
}

const mutations = {
  resetState (state) {
    state.linkStatus = null
    state.operationError = ''
    state.isProcessing = false
  },

  setIsProcessing (state, value) {
    state.isProcessing = value
    if (value) {
      state.operationError = ''
    }
  },

  setLinkStatus (state, value) {
    state.linkStatus = value
  },

  setOperationError (state, value) {
    state.operationError = value
  }
}

const actions = {

  // GetLinkStatus for checking is link already confirmed
  async getLinkStatus ({ commit }) {
    try {
      commit('setIsProcessing', true)

      const response = await lib.rpcService.callBroker('GamingNotificationService', 'GetLinkStatus', null)
      commit('setLinkStatus', response.result)
      console.log('GetLinkStatus() success:', response)
    } catch (err) {
      commit('setLinkStatus', null)
      commit('setOperationError', err.message)
      console.error('GetLinkStatus() error:', err)
    } finally {
      commit('setIsProcessing', false)
    }
  },

  // submits request for PIN code that will be sent to the phoneNumber
  async initiateLink ({ commit }, phoneNumber) {
    try {
      commit('setIsProcessing', true)

      const response = await lib.rpcService.callBroker('GamingNotificationService', 'InitiateLink', { phoneNumber })
      if (response) {
        commit('setLinkStatus', response.result)
      } else {
        commit('setLinkStatus', null)
      }
    } catch (err) {
      commit('setLinkStatus', null)
      commit('setOperationError', err.message)
      console.error('initiateLink() error:', err)
    } finally {
      commit('setIsProcessing', false)
    }
  },

  // ConfirmLink to submit the pin code
  async confirmLink ({ commit }, { phoneNumber, secretCode }) {
    try {
      commit('setIsProcessing', true)

      const response = await lib.rpcService.callBroker('GamingNotificationService', 'ConfirmLink', {
        phoneNumber,
        secretCode
      })
      if (response) {
        commit('setLinkStatus', response.result)
      } else {
        commit('setLinkStatus', null)
      }
    } catch (err) {
      commit('setLinkStatus', null)
      commit('setOperationError', err.message)
      console.error('ConfirmLink() error:', err)
    } finally {
      commit('setIsProcessing', false)
    }
  },

  // unlinking the phone from this account
  async initiateUnlink ({ commit }) {
    try {
      commit('setIsProcessing', true)

      const response = await lib.rpcService.callBroker('GamingNotificationService', 'Unlink', null)
      if (response) {
        commit('setLinkStatus', response.result)
      } else {
        commit('setLinkStatus', null)
      }
    } catch (err) {
      commit('setLinkStatus', null)
      commit('setOperationError', err.message)
      console.error('initiateUnlink() error:', err)
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
