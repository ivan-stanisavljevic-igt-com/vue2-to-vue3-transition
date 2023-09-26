// import lib from '@/library'

const state = {
  messages: {
    lifetimeDepositReached: false,
    pendingInvestigation: false,
    isSuspended: false,
    passwordPolicy: false,
    isNotVerified: false,
    canNotWithdraw: false,
    canNotDeposit: false
  }
}
const getters = {
  getNumberOfMessages: (state) => Object.values(state.messages).filter(Boolean).length,
  getLifetimeDepositReached: (state) => state.messages.lifetimeDepositReached,
  getPendingInvestigation: (state) => state.messages.pendingInvestigation,
  getIsSuspended: (state) => state.messages.isSuspended,
  getPasswordAlertPolicy: (state) => state.messages.passwordPolicy,
  getIsNotVerified: (state) => state.messages.isNotVerified,
  canNotWithdraw: (state) => state.messages.canNotWithdraw,
  canNotDeposit: (state) => state.messages.canNotDeposit
}
const mutations = {
  setLifetimeDepositReached (state, data) {
    state.messages.lifetimeDepositReached = data
  },
  setPendingInvestigation (state, data) {
    state.messages.pendingInvestigation = data
  },
  setIsSuspended (state, data) {
    state.messages.isSuspended = data
  },
  setPasswordAlertPolicy (state, data) {
    state.messages.passwordPolicy = data
  },
  setIsNotVerified (state, data) {
    state.messages.isNotVerified = data
  },
  setCanNotWithdraw (state, data) {
    state.messages.canNotWithdraw = data
  },
  setCanNotDeposit (state, data) {
    state.messages.canNotDeposit = data
  }
}
const actions = {
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
