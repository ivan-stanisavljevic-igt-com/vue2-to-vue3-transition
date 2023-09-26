import lib from '@/library'
import { i18n } from '@/main.js'
import router from '@/router'
import mobileBridge from '@/library/mobileBridge'

const transactionTypeEnum = Object.freeze({CHECK: 'C', WITHDRAWAL: 'P'})
const failureStatuses = ['C', 'F', 'J', '+', '-', 'Z']
/* there are also non-final statuses: A, S (sent to excution)
 * non-final status will result in recursive call of startPollingTransaction */

const state = {
  isPNMPushDebitAvailable: false,
  withdrawalInstrument: null, // PNMPushDebit is withdrawal-only
  processing: false,
  pollingCounter: 0,
  IDMMSITXRequest: null,
  errMsg: null,
  successMsg: null,
  infoMsg: null,
  amount: null,
  redirectionURL: null,
  isMobileApp: window.ctsautoconf.MOBILE_LS
}
const getters = {
  isPNMPushDebitAvailable: () => state.isPNMPushDebitAvailable,
  getProcessing: () => state.processing,
  withdrawalInstrument: () => state.withdrawalInstrument,
  errMsg: () => state.errMsg,
  successMsg: () => state.successMsg,
  infoMsg: () => state.infoMsg,
  redirectionURL: () => state.redirectionURL
}
const mutations = {
  redirectionURL (state, value) {
    state.redirectionURL = value
  }
}
const actions = {
  // part 1: flow to determine if we should display an instument (flag isPNMPushDebitAvailable: true or false)
  // instrument will be displayed if allowed and active
  isPNMPushDebitAvailable: async (context) => {
    const isAllowed = await context.dispatch('isPNMPushDebitAllowed')
    if (!isAllowed) {
      state.isPNMPushDebitAvailable = false
    } else {
      const isActive = await context.dispatch('isPNMPushDebitActive')
      if (isActive) {
        state.isPNMPushDebitAvailable = true
      } else {
        context.dispatch('registerInstrument')
      }
    }
  },
  isPNMPushDebitAllowed (context) {
    const allowedPaymentTypes = context.rootGetters['payments/allowedPaymentTypes']
    return allowedPaymentTypes && allowedPaymentTypes.find(type => type.IDMMSIType === 'PNMPushDebit')
  },
  async isPNMPushDebitActive (context) {
    const withdrawalInstrument = await context.dispatch('getActiveInstrument', 'P')
    if (withdrawalInstrument) state.withdrawalInstrument = withdrawalInstrument
    return withdrawalInstrument
  },
  getActiveInstrument: async (context, type) => {
    try {
      const instuments = (type === 'R') ? context.rootGetters['payments/activeRecipientInstuments'] : context.rootGetters['payments/activePaymentInstuments']
      // pnmPushDebit can have more instruments... we need at least one to mark it as active
      return instuments.find(type => type.IDMMSIType === 'PNMPushDebit')
    } catch (exception) {
      console.log(`Error when trying to fetch a PNMPushDebit instrument of type: (${type})`)
    }
  },
  registerInstrument: async (context) => {
    try {
      await lib.rpcService.callBroker('AccountService', 'RegisterEWallet', {'IDMMSIType': 'PNMPushDebit'})
      await context.dispatch('payments/initializeActiveInstruments', null, { root: true })
      state.isPNMPushDebitAvailable = await context.dispatch('isPNMPushDebitActive')
    } catch (exception) {
      console.log(`Error when trying to register a PNMPushDebit instrument`)
    }
  },
  // part 1 ends here

  // part 2: withdrawal
  start: async (context, { amount, instrument, shouldOpenIFrame, isWithdrawal }) => {
    try {
      context.dispatch('disposeState')
      state.processing = true
      state.amount = amount
      state.withdrawalInstrument = instrument
      let transactionType = isWithdrawal ? transactionTypeEnum.WITHDRAWAL : transactionTypeEnum.CHECK
      const { result } = await context.dispatch('getIDMMSITXRequest', {
        transactionType: transactionType,
        amount: state.amount
      })
      state.IDMMSITXRequest = result
      context.dispatch('startPollingTransaction', { transactionType, shouldOpenIFrame })
    } catch (exception) {
      context.dispatch('handleException', {exception: exception})
    }
  },
  getIDMMSITXRequest: async (context, {transactionType, amount}) => {
    const instrument = state.withdrawalInstrument
    try {
      const IDMMSITXRequest = await lib.rpcService.callBroker('AccountService', 'BeginPaymentTransactionWithoutPassword', {
        'IDMMSIInstruction': instrument.IDMMSIInstruction,
        'IDMMSITransactionType': transactionType,
        'amount': amount,
        'securityCode': null
      })
      return IDMMSITXRequest
    } catch (exception) {
      context.dispatch('handleException', {exception: exception})
    }
  },
  startPollingTransaction: (context, { transactionType, shouldOpenIFrame }) => {
    state.pollingCounter++
    setTimeout(async () => {
      try {
        if (state.pollingCounter > 5) {
          console.log(i18n.t('Transaction.Dialog.Error.Timeout'))
          throw new Error(i18n.t('Transaction.Failed'))
        }
        const paymentTransaction = await lib.rpcService.callBroker('AccountService', 'GetPaymentTransaction', {
          'IDMMSITXRequest': state.IDMMSITXRequest
        })
        const transactionState = paymentTransaction && paymentTransaction.result && paymentTransaction.result.IDMMSITransactionState
        // IFovanje begins... :)
        if (failureStatuses.includes(transactionState)) { // withdrawal FAILED
          // transaction FAILED
          throw new Error(i18n.t(i18n.t('Transaction.Failed')))
        } else if (transactionState === 'X') {            // SUCCESS
          if (transactionType === transactionTypeEnum.WITHDRAWAL) {
            router.push('pnm-payment-completed')
            state.successMsg = i18n.t('Payments.PNM.PushDebit.Successful')
            state.processing = false
            context.dispatch('getCustomerContext', null, { root: true })
          } else {
            // transaction type is card check i.e. add a new card
            const redirectionURL = paymentTransaction && paymentTransaction.result && paymentTransaction.result.Message4Customer
            if (shouldOpenIFrame) {
              context.dispatch('openPNMIFrame', redirectionURL)
            } else {
              context.dispatch('payments/initializeActiveInstruments', null, { root: true })
            }
            state.processing = false
          }
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
  openPNMIFrame: (context, url) => {
    let decoratedUrl = `${url}?return_url=${window.location.href}&add_url=${window.location.href}&no_add_url=${window.location.href}`
    console.log(`[PNM] Redirect to: ${decoratedUrl}`)
    if (state.isMobileApp) {
      // for mobile app, open SFSafariWebController
      mobileBridge.bridgeSendRequest('openCashier', decoratedUrl)
    } else {
      state.redirectionURL = decoratedUrl
    }
  },
  handleException: (context, {exception}) => {
    state.errMsg = exception && (exception.message || exception.Message || i18n.t('Transaction.Failed'))
    state.processing = false
    throw exception
  },
  disposeState: () => {
    state.pollingCounter = 0
    state.IDMMSITXRequest = null
    state.errMsg = null
    state.amount = null
    state.successMsg = null
    state.infoMsg = null
    state.withdrawalInstrument = null // PNMPushDebit is withdrawal-only
    state.redirectionURL = null
  }
}
export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
