import lib from '@/library'
import { i18n } from '@/main.js'
import adjust from '@/library/adjust'

const failureStatuses = ['C', 'F', 'J', '+', '-', 'Z']

const state = {
  isCashInShopAvailable: false,
  processing: false,
  withdrawalInstrument: null,
  transactionFailed: false,
  pollingTransactionInfoMessage: null,
  authCode: null
}
const getters = {
  isCashInShopAvailable: () => state.isCashInShopAvailable,
  processing: () => state.processing,
  transactionFailed: () => state.transactionFailed,
  pollingTransactionInfoMessage: () => state.pollingTransactionInfoMessage,
  authCode: () => state.authCode
}
const mutations = {
  setProcessing (state, value) {
    state.processing = value
  },
  setTransactionFailed (state, value) {
    state.transactionFailed = value
  }
}
const actions = {
  // part 1: flow to determine if we should display an instument (flag isCashInShopAvailable: true or false)
  // instrument will be displayed if allowed and active
  isCashInShopAvailable: async (context) => {
    const isAllowed = await context.dispatch('isCashInShopAllowed')
    if (!isAllowed) {
      state.isCashInShopAvailable = false
    } else {
      const isActive = await context.dispatch('isCashInShopActive')
      if (isActive) {
        state.isCashInShopAvailable = true
      } else {
        context.dispatch('registerInstrument', isAllowed)
      }
    }
  },
  isCashInShopAllowed (context) {
    const allowedPaymentTypes = context.rootGetters['payments/allowedPaymentTypes']
    return allowedPaymentTypes && allowedPaymentTypes.find(type => type.IDMMSIType === 'CASHINSHOP')
  },
  async isCashInShopActive (context) {
    // cashinshop is always for withdrawal
    const withdrawalInstrument = await context.dispatch('getActiveInstrument', 'P')
    state.withdrawalInstrument = withdrawalInstrument
    return withdrawalInstrument
  },
  getActiveInstrument: async (context) => {
    try {
      const instuments = context.rootGetters['payments/activePaymentInstuments']
      return instuments.find(type => type.IDMMSIType === 'CASHINSHOP')
    } catch (exception) {
      console.log(`Error when trying to fetch a CashInShop instrument`)
    }
  },
  registerInstrument: async (context, instrument) => {
    try {
      await lib.rpcService.callBroker('AccountService', 'RegisterBankTransfer', {
        'bankTransfer': instrument,
        'isSameAsMainAddress': false
      })
      await context.dispatch('payments/initializeActiveInstruments', null, { root: true })
      await context.dispatch('isCashInShopAvailable')
    } catch (exception) {
      console.log(`Error when trying to register a CashInShop instrument`)
    }
  },
  // part 1 ends here

  // part 2: redirection
  start: async (context, {amount}) => {
    state.authCode = null
    try {
      const { result } = await context.dispatch('getIDMMSITXRequest', {
        amount: amount
      })
      context.dispatch('startPollingTransactionStatus', {IDMMSITXRequest: result})
    } catch (exception) {
      console.log(exception)
      throw exception
    }
  },
  getIDMMSITXRequest: async (context, {amount}) => {
    const instrument = state.withdrawalInstrument
    const IDMMSITXRequest = await lib.rpcService.callBroker('AccountService', 'BeginPaymentTransactionWithoutPassword', {
      'IDMMSIInstruction': instrument.IDMMSIInstruction,
      'IDMMSITransactionType': 'P',
      'amount': amount,
      'securityCode': null
    })
    return IDMMSITXRequest
  },
  startPollingTransactionStatus (context, {IDMMSITXRequest}) {
    setTimeout(async () => {
      const paymentTransaction = await lib.rpcService.callBroker('AccountService', 'GetPaymentTransaction', {
        'IDMMSITXRequest': IDMMSITXRequest
      })
      let transactionState = paymentTransaction && paymentTransaction.result && paymentTransaction.result.IDMMSITransactionState

      if (failureStatuses.includes(transactionState)) {
        // transaction failed
        context.commit('setTransactionFailed', true)
      } else if (transactionState === 'Q' || transactionState === '2') {
        // transaction is waiting for authorization (eg. operator need to approve in Customer Service application)
        // currently we don't receive auth code in this state
        state.pollingTransactionInfoMessage = i18n.t('Transaction.Dialog.TransactionWaitingForAuthorization')
        context.dispatch('getCustomerContext', null, { root: true }) // this transaction result state might change balance so get updated customer details
        context.commit('setTransactionFailed', false)
        state.processing = false
      } else if (transactionState === 'A') {
        // transaction succecceded
        let authCode = paymentTransaction && paymentTransaction.result && paymentTransaction.result.ExtAuthCode
        if (authCode) {
          state.authCode = authCode
          context.dispatch('getCustomerContext', null, { root: true })
        } else {
          // transaction success but no authCode (this shouldn't happen but handle it by showing generic error to the user)
          context.commit('setTransactionFailed', true)
        }
        context.dispatch('getCustomerContext', null, { root: true }) // on successful transaction get updated customer details
        state.processing = false
        if (window.ctsautoconf.MOBILE_LS) {
          adjust.adjustEventRequest('cashinshop_withdrawal', paymentTransaction.result.OrderedAmount)
        }
      } else {
        // still in processing, check again
        // console.log('cashin shop withdrawal processing... check again')
        context.dispatch('startPollingTransactionStatus', {IDMMSITXRequest: IDMMSITXRequest})
      }
    }, 1000)
  }
}
export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
