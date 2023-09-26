import lib from '@/library'
import { i18n } from '@/main.js'
import paymentHelpers from '@/library/payments/paymentHelpers'
import router from '@/router'

const failureStatuses = ['C', 'F', 'J', '+', '-', 'Z']
/* there are also non-final statuses: A, S (sent to excution)
 * non-final status will result in recursive call of startPollingTransaction */
const paymentIDMMSIType = 'NuveiWdVipp'

const state = {
  isPaymentInstrumentAvailable: false,
  withdrawalInstrument: null,
  IDMMSITXRequest: null,
  pollingCounter: 0,
  processing: false,
  errMsg: null,
  successMsg: null,
  infoMsg: null
}
const getters = {
  isPaymentInstrumentAvailable () {
    return state.isPaymentInstrumentAvailable
  },
  processing () {
    return state.processing
  },
  getIDMMSITXRequest () {
    return state.IDMMSITXRequest
  },
  getErrorMessage () {
    return state.errMsg
  },
  hasMadeDeposit () {
    return state.withdrawalInstrument && state.withdrawalInstrument.UniqueWalletId
  },
  getInfoMsg () {
    return state.infoMsg
  }
}
const mutations = {
  setIDMMSITXRequest (state, value) {
    state.IDMMSITXRequest = value
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
  start: async (context, amount) => {
    state.processing = true
    state.IDMMSITXRequest = null
    state.infoMsg = null
    state.errMsg = null
    context.commit('nuvei/setCurrentNuveiType', paymentHelpers.toCamelCase(paymentIDMMSIType), { root: true })
    const { result } = await context.dispatch('getIDMMSITXRequest', amount)
    if (result) {
      state.IDMMSITXRequest = result
      try {
        context.dispatch('startPollingTransaction')
      } catch (exception) {
        console.log(exception)
        state.processing = false
      }
    }
  },
  async getIDMMSITXRequest (context, amount) {
    try {
      const IDMMSITXRequest = await lib.rpcService.callBroker('AccountService', 'BeginPaymentTransactionWithoutPassword', {
        IDMMSIInstruction: state.withdrawalInstrument.IDMMSIInstruction,
        IDMMSITransactionType: 'P',
        amount: +amount,
        securityCode: null
      })
      return IDMMSITXRequest
    } catch (exception) {
      context.dispatch('handleException', {exception: exception})
    }
  },
  startPollingTransaction (context) {
    state.pollingCounter++
    state.processing = true
    setTimeout(async () => {
      try {
        if (state.pollingCounter > 5) {
          console.log(i18n.t('Transaction.Dialog.Error.Timeout'))
          throw new Error(i18n.t('Transaction.Failed'))
        }
        const paymentTransaction = await lib.rpcService.callBroker('AccountService', 'GetPaymentTransaction', {
          IDMMSITXRequest: state.IDMMSITXRequest
        })
        const transactionState = paymentTransaction && paymentTransaction.result && paymentTransaction.result.IDMMSITransactionState
        // IFovanje begins... :)
        if (failureStatuses.includes(transactionState)) {
          // transaction FAILED
          const message4Customer = paymentTransaction && paymentTransaction.result && paymentTransaction.result.Message4Customer
          context.dispatch('handleException', { exception: { message: message4Customer } })
        } else if (transactionState === 'X') {
          // SUCCESS
          context.dispatch('paymentSuccess')
        } else if (transactionState === 'Q') {
          context.dispatch('paymentNotCompleted', i18n.t('PNMGateway.PushDebit.PollStatus.Q'))
        } else if (transactionState === 'D') {
          context.dispatch('paymentNotCompleted', i18n.t('PNMGateway.PushDebit.PollStatus.D'))
        } else {
          context.dispatch('startPollingTransaction')
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
    router.push('nuvei-payment-completed')
  },
  paymentNotCompleted (context, message) {
    state.infoMsg = message
    state.processing = false
    router.push('nuvei-payment-not-completed')
  }
}
export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
