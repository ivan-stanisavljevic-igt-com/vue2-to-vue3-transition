import lib from '@/library'
import mobileBridge from '@/library/mobileBridge'
import { i18n } from '@/main.js'
import paymentHelpers from '@/library/payments/paymentHelpers'
import router from '@/router'

const failureStatuses = ['C', 'F', 'J', '+', '-', 'Z']
/* there are also non-final statuses: A, S (sent to excution)
 * non-final status will result in recursive call of startPollingTransaction */
const paymentIDMMSIType = 'NuveiWd'

const state = {
  isPaymentInstrumentAvailable: false,
  withdrawalInstrument: null,
  IDMMSITXRequest: null,
  merchantUniqueID: null,
  pollingCounter: 0,
  isMobileApp: window.ctsautoconf.MOBILE_LS,
  processing: false,
  redirectionURL: null,
  errMsg: null,
  successMsg: null,
  infoMsg: null,
  cardCheckProcessing: false
}
const getters = {
  isPaymentInstrumentAvailable () {
    return state.isPaymentInstrumentAvailable
  },
  processing () {
    return state.processing
  },
  redirectionURL () {
    return state.redirectionURL
  },
  getIDMMSITXRequest () {
    return state.IDMMSITXRequest
  },
  getErrorMessage () {
    return state.errMsg
  },
  cardCheckProcessing () {
    return state.cardCheckProcessing
  }
}
const mutations = {
  redirectionURL (state, value) {
    state.redirectionURL = value
  },
  setIDMMSITXRequest (state, value) {
    state.IDMMSITXRequest = value
  },
  setMerchantUniqueID (state, value) {
    state.merchantUniqueID = value
  }
}
const actions = {
  isPaymentInstrumentAvailable: async (context) => {
    const isAllowed = await context.dispatch('isPaymentTypeAllowed')
    if (!isAllowed) {
      state.isPaymentInstrumentAvailable = false
    } else {
      const isActive = await context.dispatch('isPaymentInstrumentActive')
      if (isActive) {
        state.isPaymentInstrumentAvailable = true
      } else {
        context.dispatch('registerInstrument')
      }
    }
  },
  isPaymentTypeAllowed (context) {
    const allowedPaymentTypes = context.rootGetters['payments/allowedPaymentTypes']
    return allowedPaymentTypes && allowedPaymentTypes.find(type => type.IDMMSIType === paymentIDMMSIType)
  },
  async isPaymentInstrumentActive (context) {
    const withdrawalInstrument = await context.dispatch('getActiveInstrument', 'P')
    state.withdrawalInstrument = withdrawalInstrument
    return withdrawalInstrument
  },
  getActiveInstrument: async (context, type) => {
    try {
      const instuments = (type === 'R') ? context.rootGetters['payments/activeRecipientInstuments'] : context.rootGetters['payments/activePaymentInstuments']
      return instuments.find(type => type.IDMMSIType === paymentIDMMSIType)
    } catch (error) {
      console.log(`${paymentIDMMSIType}.getActiveInstrument | ERROR | ${error && error.message}`)
    }
  },
  registerInstrument: async (context) => {
    try {
      await lib.rpcService.callBroker('AccountService', 'RegisterEWallet', { IDMMSIType: paymentIDMMSIType })
      await context.dispatch('payments/initializeActiveInstruments', null, { root: true })
      await context.dispatch('isPaymentInstrumentAvailable')
    } catch (error) {
      console.log(`${paymentIDMMSIType}.registerInstrument | ERROR | ${error && error.message}`)
    }
  },
  // part 1 ends here

  // part 2: redirection
  start: async (context) => {
    state.processing = true
    context.commit('nuvei/setCurrentNuveiType', paymentHelpers.toCamelCase(paymentIDMMSIType), { root: true })
    const IDMMSITXRequest = await context.dispatch('getIDMMSITXRequest')
    let response
    try {
      response = await lib.rpcService.callBroker('AccountService', 'GetRBWRequest', {
        IDMMSITXRequest: IDMMSITXRequest.result,
        returnUrl: `${window.location.origin}`,
        description: null,
        language: null
      })
      if (!response.result.UrlWithParameters) {
        throw new Error(`${paymentIDMMSIType}.getRBWRequest: UrlWithParameters is missing in response`)
      }
      context.dispatch('openIFrame', response && response.result && response.result.UrlWithParameters)
    } catch (exception) {
      console.log(exception)
    } finally {
      state.processing = false
    }
  },
  openIFrame: (context, url) => {
    let decoratedUrl = `${url}`
    console.log(`[${paymentIDMMSIType}] Redirect to: ${decoratedUrl}`)
    if (state.isMobileApp) {
      mobileBridge.bridgeSendRequest('openIgtPay', decoratedUrl)
    } else {
      state.redirectionURL = decoratedUrl
    }
  },
  async getIDMMSITXRequest (context) {
    try {
      const IDMMSITXRequest = await lib.rpcService.callBroker('AccountService', 'BeginPaymentTransactionWithoutPassword', {
        IDMMSIInstruction: state.withdrawalInstrument.IDMMSIInstruction,
        IDMMSITransactionType: 'M',
        amount: 10,
        securityCode: null
      })
      context.commit('setIDMMSITXRequest', IDMMSITXRequest.result)
      return IDMMSITXRequest
    } catch (exception) {
      console.log(exception)
    }
  },
  async completeRBWRequest (context, completionParameters) {
    try {
      state.processing = true
      await lib.rpcService.callBroker('AccountService', 'CompleteRBWRequest', {
        IDMMSITXRequest: state.IDMMSITXRequest,
        completionParameters
      })
    } catch (error) {
      console.log(`${paymentIDMMSIType}.completeRBWRequest | ERROR | ${error && error.message}`)
    } finally {
      state.processing = false
    }
  },
  startPollingTransaction: (context, { transactionType, shouldOpenIFrame } = {}) => {
    state.pollingCounter++
    state.processing = true
    setTimeout(async () => {
      try {
        if (state.pollingCounter > 5) {
          console.log(i18n.t('Transaction.Dialog.Error.Timeout'))
          throw new Error(i18n.t('Transaction.Failed'))
        }
        const paymentTransaction = await lib.rpcService.callBroker('AccountService', 'GetPaymentTransaction', {
          IDMMSITXRequest: state.merchantUniqueID
        })
        const transactionState = paymentTransaction && paymentTransaction.result && paymentTransaction.result.IDMMSITransactionState
        // IFovanje begins... :)
        if (failureStatuses.includes(transactionState)) {
          // transaction FAILED
          const message4Customer = paymentTransaction && paymentTransaction.result && paymentTransaction.result.Message4Customer
          throw new Error(message4Customer || i18n.t('Transaction.Failed'))
        } else if (transactionState === 'X') {
          // SUCCESS
          context.dispatch('paymentSuccess')
        } else if (transactionState === 'Q') {
          state.infoMsg = i18n.t('PNMGateway.PushDebit.PollStatus.Q')
          state.processing = false
        } else if (transactionState === 'D') {
          state.infoMsg = i18n.t('PNMGateway.PushDebit.PollStatus.D')
          state.processing = false
        } else {
          context.dispatch('startPollingTransaction', { transactionType, shouldOpenIFrame })
        }
        // IFovanje ends
      } catch (exception) {
        context.dispatch('handleException', {exception: exception})
      }
    }, 6000)
  },
  handleException (context, {exception}) {
    state.errMsg = exception && (exception.message || exception.Message || i18n.t('Transaction.Failed'))
    state.processing = false
    router.push('nuvei-payment-failed')
  },
  paymentSuccess (context) {
    state.successMsg = i18n.t('Payments.PNM.PushDebit.Successful')
    state.processing = false
    context.dispatch('getCustomerContext', null, { root: true })
  },

  // part 3: card check
  cardCheck: async (context) => {
    state.cardCheckProcessing = true
    const { result } = await context.dispatch('getIDMMSITXRequestCardCheck')
    state.IDMMSITXRequest = result
    if (result) {
      try {
        context.dispatch('startPollingTransactionCardCheck')
      } catch (exception) {
        console.log(`nuveiWd.cardCheck | INFO | ${exception && exception.message}`)
        state.cardCheckProcessing = false
      }
    }
  },
  async getIDMMSITXRequestCardCheck (context) {
    try {
      const IDMMSITXRequest = await lib.rpcService.callBroker('AccountService', 'BeginPaymentTransactionWithoutPassword', {
        IDMMSIInstruction: state.withdrawalInstrument.IDMMSIInstruction,
        IDMMSITransactionType: 'C',
        amount: 0,
        securityCode: null
      })
      return IDMMSITXRequest
    } catch (exception) {
      console.log(`nuveiWd.getIDMMSITXRequestCardCheck | INFO | ${exception && exception.message}`)
    }
  },
  startPollingTransactionCardCheck (context) {
    state.pollingCounter++
    state.cardCheckProcessing = true
    setTimeout(async () => {
      try {
        const paymentTransaction = await lib.rpcService.callBroker('AccountService', 'GetPaymentTransaction', {
          IDMMSITXRequest: state.IDMMSITXRequest
        })
        const transactionState = paymentTransaction && paymentTransaction.result && paymentTransaction.result.IDMMSITransactionState
        if (failureStatuses.includes(transactionState)) {
          // transaction FAILED
          const message4Customer = paymentTransaction && paymentTransaction.result && paymentTransaction.result.Message4Customer
          context.dispatch('handleExceptionCardCheck', `nuveiWd.startPollingTransactionCardCheck | INFO | ${message4Customer}`)
        } else if (transactionState === 'X') {
          // SUCCESS
          context.dispatch('payments/initializeActiveInstruments', null, { root: true })
          state.cardCheckProcessing = false
          state.IDMMSITXRequest = null
          state.state.pollingCounter = 0
        } else {
          // stop polling after 2 times
          if (state.pollingCounter >= 3) {
            state.cardCheckProcessing = false
            return
          }
          // continue polling
          context.dispatch('startPollingTransactionCardCheck')
        }
      } catch (exception) {
        context.dispatch('handleExceptionCardCheck')
      }
    }, 5000)
  },
  handleExceptionCardCheck (context, errMsg) {
    state.cardCheckProcessing = false
    state.IDMMSITXRequest = null
    state.pollingCounter = 0
    console.log(errMsg)
  }
}
export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
