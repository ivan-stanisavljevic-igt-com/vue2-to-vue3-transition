/*
 * this is the base module state of all payments
 */
import lib from '@/library'

const state = {
  allowedPaymentTypes: undefined,
  isSightlineAvailable: false,
  fetchingPaymentTypes: false,
  activePaymentInstuments: undefined,
  activeRecipientInstuments: undefined,
  transactionType: null, // deposit or withdraw,
  noOfAllowedDepositTypes: undefined,
  noOfAllowedWithdrawTypes: undefined
}
const getters = {
  isSightlineAvailable: () => state.isSightlineAvailable,
  fetchingPaymentTypes: () => state.fetchingPaymentTypes,
  allowedPaymentTypes: () => state.allowedPaymentTypes,
  activePaymentInstuments: () => state.activePaymentInstuments,
  activeRecipientInstuments: () => state.activeRecipientInstuments,
  transactionType: () => state.transactionType || localStorage.transactionType,
  // of all (both deposit and withdrawal) there is only cashiShop
  cashInShopOnly: () => {
    const onlyOneType = state.allowedPaymentTypes && state.allowedPaymentTypes.length === 1
    const typeIsCashinShop = state.allowedPaymentTypes && state.allowedPaymentTypes.filter(e => e.IDMMSIType === 'CASHINSHOP')[0]
    return onlyOneType && typeIsCashinShop
  },
  // of all DEPOSIT types, there is only sightline
  sightlineOnlyDeposit () {
    const onlyOneDepositType = state.noOfAllowedDepositTypes && state.noOfAllowedDepositTypes === 1
    const typeIsSightline = state.allowedPaymentTypes && state.allowedPaymentTypes.find(e => e.IDMMSIType === 'SLWALLET')
    return onlyOneDepositType && typeIsSightline
  },
  // of all DEPOSIT types, there is only paysafe
  paysafeOnlyDeposit () {
    const onlyOneDepositType = state.noOfAllowedDepositTypes && state.noOfAllowedDepositTypes === 1
    const typeIsPaysafe = state.allowedPaymentTypes && state.allowedPaymentTypes.find(e => e.IDMMSIType === 'PaySafe')
    return onlyOneDepositType && typeIsPaysafe
  },
  // of all DEPOSIT types, there is only PayNearMe
  pnmOnlyDeposit () {
    const onlyOneDepositType = state.noOfAllowedDepositTypes && state.noOfAllowedDepositTypes === 1
    const typeIsPNM = state.allowedPaymentTypes && state.allowedPaymentTypes.find(e => e.IDMMSIType === 'PNM')
    return onlyOneDepositType && typeIsPNM
  },
  // of all WD types, there is only sightline
  sightlineOnlyWithdrawal () {
    const onlyOneWithdrawType = state.noOfAllowedWithdrawTypes && state.noOfAllowedWithdrawTypes === 1
    const typeIsSightline = state.allowedPaymentTypes && state.allowedPaymentTypes.find(e => e.IDMMSIType === 'SLWALLET')
    return onlyOneWithdrawType && typeIsSightline
  },
  // of all WD types, there is only paysafe
  paysafeOnlyWithdrawal () {
    const onlyOneWithdrawType = state.noOfAllowedWithdrawTypes && state.noOfAllowedWithdrawTypes === 1
    const typeIsPaysafe = state.allowedPaymentTypes && state.allowedPaymentTypes.find(e => e.IDMMSIType === 'PaySafe')
    return onlyOneWithdrawType && typeIsPaysafe
  },
  // of all WD types, there is only Cashinshop
  cashInShopOnlyWithdrawal () {
    const onlyOneWithdrawType = state.noOfAllowedWithdrawTypes && state.noOfAllowedWithdrawTypes === 1
    const typeIsCashinshop = state.allowedPaymentTypes && state.allowedPaymentTypes.find(e => e.IDMMSIType === 'CASHINSHOP')
    return onlyOneWithdrawType && typeIsCashinshop
  },
  // of all WD types, there is only PNMPushDebit
  pnmPushDebitOnlyWithdrawal () {
    const onlyOneWithdrawType = state.noOfAllowedWithdrawTypes && state.noOfAllowedWithdrawTypes === 1
    const typeIsPnmPushDebit = state.allowedPaymentTypes && state.allowedPaymentTypes.find(e => e.IDMMSIType === 'PNMPushDebit')
    return onlyOneWithdrawType && typeIsPnmPushDebit
  }
}
const mutations = {
  fetchingPaymentTypes (state, value) {
    state.fetchingPaymentTypes = value
  },
  transactionType (state, value) {
    state.transactionType = value
    localStorage.transactionType = value
  }
}
const actions = {
  async getAllowedPaymentTypes (context) {
    try {
      context.commit('fetchingPaymentTypes', true)
      const response = await lib.rpcService.callBroker('AccountService', 'GetAllowedPaymentTypesByIdMMBusinessUnit', {})
      // payment types are loaded
      if (response && response.result) {
        state.allowedPaymentTypes = response.result
        state.noOfAllowedDepositTypes = state.allowedPaymentTypes.filter(e => e.IsForReceipts).length
        state.noOfAllowedWithdrawTypes = state.allowedPaymentTypes.filter(e => e.IsForPayments).length
      }
      await context.dispatch('initializeActiveInstruments')
      context.dispatch('checkAvailableTypes')
    } catch (exception) {
      console.log(exception)
    } finally {
      context.commit('fetchingPaymentTypes', false)
    }
  },
  isSightlineAvailable () {
    state.isSightlineAvailable = state.allowedPaymentTypes && state.allowedPaymentTypes.find(type => type.IDMMSIType === 'SLWALLET')
  },
  checkAvailableTypes (context) {
    context.dispatch('isSightlineAvailable')
    context.dispatch('cashinshop/isCashInShopAvailable', null, { root: true })
    context.dispatch('igtPay/isIgtPayAvailable', null, { root: true })
    context.dispatch('payNearMe/isPayNearMeAvailable', null, { root: true })
    context.dispatch('paysafe/isPaySafeAvailable', null, { root: true })
    context.dispatch('pnmGateway/isPNMGatewayAvailable', null, { root: true })
    context.dispatch('nuvei/isNuveiAvailable', null, { root: true })
  },
  initializeActiveInstruments: async (context) => {
    const activePaymentInstuments = await context.dispatch('getActiveInstruments', { type: 'P' })   // withdrawal instruments
    const activeRecipientInstuments = await context.dispatch('getActiveInstruments', { type: 'R' }) // payment instuments
    if (activePaymentInstuments) {
      state.activePaymentInstuments = activePaymentInstuments
    }
    if (activeRecipientInstuments) {
      state.activeRecipientInstuments = activeRecipientInstuments
    }
  },
  getActiveInstruments: async (context, payload) => {
    const { type } = payload
    try {
      const response = await lib.rpcService.callBroker('AccountService', 'GetActivePaymentInstruments', {'IDMMSITransactionType': type})
      return response && response.result
    } catch (exception) {
      console.log(`Error when trying to fetch an active instrument of type: (${type})`)
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
