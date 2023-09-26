import lib from '@/library'
import { i18n } from '@/main.js'
import adjust from '@/library/adjust'
import paymentUtils from '@/library/wallet/paymentUtils'

const InstructionVerified = -1
const failureStatuses = ['C', 'F', 'J', '+', '-', 'Z']

// possibly configurable varaibles
let pollingTimerTick = 1000 // period between two consequtive transaction status checks
let pollingTimeoutPeriod = 60000 // period after which polling will stop if not resolved

const state = {
  MMSIInstruction: null,

  isProcessingInstructionFetch: false,
  isProcessingEnrollment: false,
  isFinalizingEnrollment: false,
  isProcessingDeposit: false,
  isProcessingWithdrawal: false,
  pollingCounter: 0,

  pollingTransactionError: null,
  pollingTransactionInfoMessage: null, // used when transaction didn't fail but there is some info that needs to be shown to the user (eg. transaction authorization is pending)
  adjustProcessingType: null,
  amount: 'not available',
  transactionType: null
}

const getters = {
  isInstructionVerified (state) {
    return !!(state.MMSIInstruction && state.MMSIInstruction.VerificationStatus === InstructionVerified)
  },

  isPollingTransaction (state) {
    return state.pollingCounter > 0
  },
  getAdjustProcessingType (state) {
    return state.adjustProcessingType
  },

  maxWithdrawalAmount (state) {
    const minValue = paymentUtils.getMinValue(
      state.MMSIInstruction.MaxWithdrawalAmount,
      state.MMSIInstruction.PaymentDailyLimit,
      state.MMSIInstruction.ReceiptTXLimit)

    return minValue
  },

  minWithdrawalAmount (state) {
    return state.MMSIInstruction.MinWithdrawalAmount
  },

  minDepositAmount (state) {
    return state.MMSIInstruction.MinDepositAmount
  },

  maxDepositAmount (state) {
    return state.MMSIInstruction.MaxDepositAmount
  }
}

const mutations = {
  setPollingTransactionError (state, value) {
    state.pollingTransactionError = value
  },

  setPollingTransactionInfoMessage (state, value) {
    state.pollingTransactionInfoMessage = value
  },

  resetState (state) {
    state.MMSIInstruction = null
    state.isProcessingInstructionFetch = false
    state.isProcessingEnrollment = false
    state.isFinalizingEnrollment = false
    state.isProcessingDeposit = false
    state.isProcessingWithdrawal = false
    state.pollingCounter = 0
  },

  setMMSIInstruction (state, value) {
    state.MMSIInstruction = value
  },

  setIsProcessingInstructionFetch (state, value) {
    state.isProcessingInstructionFetch = value
  },

  setIsProcessingEnrollment (state, value) {
    state.isProcessingEnrollment = value
  },

  setIsFinalizingEnrollment (state, value) {
    state.isFinalizingEnrollment = value
  },

  setIsProcessingDeposit (state, value) {
    state.isProcessingDeposit = value
  },
  setIsProcessingWithdrawal (state, value) {
    state.isProcessingWithdrawal = value
  },
  incrementPollingCounter (state) {
    ++state.pollingCounter
  },
  decrementPollingCounter (state) {
    --state.pollingCounter
  },
  setAdjustProcessingType (state, value) {
    state.adjustProcessingType = value
  }
}

const actions = {
  async fetchInstruction ({ commit }) {
    try {
      commit('setIsProcessingInstructionFetch', true)

      let MMSIInstruction, activePaymentInstruments

      const getInstruction = async () => {
        activePaymentInstruments = await lib.rpcService.callBroker('AccountService', 'GetActivePaymentInstruments', {'IDMMSITransactionType': 'R'})
        MMSIInstruction = activePaymentInstruments.result.find(type => type.IDMMSIType === 'SLWALLET')
      }

      await getInstruction()

      // if MMSIInstruction is not present -> new user -> register eWallet SLWALLET
      if ((activePaymentInstruments.result && activePaymentInstruments.result.length === 0) || !MMSIInstruction) {
        await lib.rpcService.callBroker('AccountService', 'RegisterEWallet', {'IDMMSIType': 'SLWALLET'})
        await getInstruction()
      }

      commit('setMMSIInstruction', MMSIInstruction)
    } catch (err) {
      console.error('error fetchInstruction():', err)
    } finally {
      commit('setIsProcessingInstructionFetch', false)
    }
  },

  async startEnrollmentFlow ({ state, commit }) {
    try {
      commit('setIsProcessingEnrollment', true)

      const IDMMSITXRequest = await lib.rpcService.callBroker('AccountService', 'BeginPaymentTransactionWithoutPassword', {
        'IDMMSIInstruction': state.MMSIInstruction.IDMMSIInstruction,
        'IDMMSITransactionType': 'M',
        'amount': 0,
        'securityCode': null
      })
      const redirectionParameters = await lib.rpcService.callBroker('AccountService', 'GetRBWRequest', {
        'IDMMSITXRequest': IDMMSITXRequest.result,
        'returnUrl': window.location.href + '?IDMMSITXRequest=' + IDMMSITXRequest.result,
        'description': null,
        'language': null
      })

      return redirectionParameters
    } catch (err) {
      console.log('error startEnrollmentFlow():', err)
      commit('setIsProcessingEnrollment', false)
      throw err
    } finally {
      // because enrollment will continue with page redirection to sightline
      // we don't set setIsProcessingEnrollment flag to false here as enrollment is still in progress
    }
  },

  async completeEnrollmentFlow ({commit, dispatch}, request) {
    try {
      commit('setIsProcessingEnrollment', false)
      commit('setIsFinalizingEnrollment', true)
      await dispatch('completeRBWRequest', request)
    } catch (err) {
      // enrollment failed, but it could be due to wrong query parameter in url
      // so it actually might have been successfull, so no need to handle it here
      // as we'll try instruction verifying anyway in the finally block below
    } finally {
      commit('setIsFinalizingEnrollment', false)
      dispatch('fetchInstruction')
    }
  },

  async completeRBWRequest ({commit}, request) {
    try {
      await lib.rpcService.callBroker('AccountService', 'CompleteRBWRequest', {
        'IDMMSITXRequest': request.IDMMSITXRequest,
        'completionParameters': {}
      })
      console.log('completeRBWRequest successfully')
    } catch (err) {
      console.error('completeRBWRequest exception:', err)
      throw err
    }
  },

  async depositSightlineFlow ({ commit, dispatch, getters, state }, request) {
    try {
      if (request.amount) state.amount = request.amount
      state.transactionType = 'R'
      commit('setIsProcessingDeposit', true)
      if (window.ctsautoconf.MOBILE_LS) commit('setAdjustProcessingType', 'sightline_deposit')

      const IDMMSITXRequest = await lib.rpcService.callBroker('AccountService', 'BeginPaymentTransactionWithoutPassword', {
        'IDMMSIInstruction': state.MMSIInstruction.IDMMSIInstruction,
        'IDMMSITransactionType': 'R',
        'amount': request.amount,
        'securityCode': null
      })

      dispatch('startPollingSightlinePaymentTransaction', { IDMMSITXRequest: IDMMSITXRequest.result })
    } catch (e) {
      console.log('depositSightlineFlow error', e)
      throw e
    } finally {
      commit('setIsProcessingDeposit', false)
    }
  },

  async withdrawalSightlineFlow ({commit, dispatch, state}, request) {
    try {
      if (request.amount) state.amount = request.amount
      state.transactionType = 'P'
      commit('setIsProcessingWithdrawal', true)
      if (window.ctsautoconf.MOBILE_LS) commit('setAdjustProcessingType', 'sightline_withdrawal')

      const IDMMSITXRequest = await lib.rpcService.callBroker('AccountService', 'BeginPaymentTransactionWithoutPassword', {
        'IDMMSIInstruction': state.MMSIInstruction.IDMMSIInstruction,
        'IDMMSITransactionType': 'P',
        'amount': request.amount,
        'securityCode': null
      })

      dispatch('startPollingSightlinePaymentTransaction', { IDMMSITXRequest: IDMMSITXRequest.result })
    } catch (err) {
      console.error('withdrawalSightlineFlow() error', err)
      throw err
    } finally {
      commit('setIsProcessingWithdrawal', false)
    }
  },

  // same polling action is for both deposit and withdrawal operations
  startPollingSightlinePaymentTransaction (context, request) {
    context.commit('incrementPollingCounter')
    context.commit('setPollingTransactionError', null)
    context.commit('setPollingTransactionInfoMessage', null)

    let ticksCounter = 0
    let extendPollingTimeoutOnce = false

    const pollingFunc = async () => {
      let timeout = pollingTimeoutPeriod
      if (extendPollingTimeoutOnce) {
        timeout *= 2
      }

      // if polling timed out then quit
      if (pollingTimerTick * ticksCounter >= timeout) {
        context.commit('setPollingTransactionError', i18n.t('Transaction.Dialog.Error.Timeout'))
        context.commit('decrementPollingCounter')
        return
      }
      ticksCounter++

      const paymentTransaction = await lib.rpcService.callBroker('AccountService', 'GetPaymentTransaction', {
        'IDMMSITXRequest': request.IDMMSITXRequest
      })

      let transactionState = paymentTransaction && paymentTransaction.result && paymentTransaction.result.IDMMSITransactionState

      console.log('startPollingSightlinePaymentTransaction() transactionState: ', transactionState)

      if (failureStatuses.indexOf(transactionState) !== -1) {
        // transaction FAILED
        // let errorMsg = (paymentTransaction && paymentTransaction.result && paymentTransaction.result.ExtAdditionalData) || genericErrorMsg
        console.error('Transaction failed', paymentTransaction)

        const errorText = paymentTransaction.result.Message4Customer || i18n.t('Transaction.Dialog.Error.Generic')
        context.commit('setPollingTransactionError', errorText)

        context.commit('decrementPollingCounter')
        context.dispatch('sendAnalytics', 'failed')
      } else if (transactionState === 'X') {
        // transaction SUCCEEDED
        let processType = context.getters['getAdjustProcessingType']
        if (processType) {
          adjust.adjustEventRequest(processType, paymentTransaction.result.OrderedAmount)
          context.commit('setAdjustProcessingType', false)
        }
        context.dispatch('sendAnalytics', 'success')
        context.commit('decrementPollingCounter')
        context.dispatch('getCustomerContext', null, { root: true }) // on successful transaction get updated customer details
      } else if (transactionState === 'Q' || transactionState === '2') {
        // transaction is waiting for authorization (eg. operator need to approve in Customer Service application)
        context.commit('setPollingTransactionInfoMessage', i18n.t('Transaction.Dialog.TransactionWaitingForAuthorization'))
        let processType = context.getters['getAdjustProcessingType']
        if (processType) {
          adjust.adjustEventRequest(processType, paymentTransaction.result.OrderedAmount)
          context.commit('setAdjustProcessingType', false)
        }
        context.dispatch('sendAnalytics', 'auth')
        context.commit('decrementPollingCounter')

        context.dispatch('getCustomerContext', null, { root: true }) // this transaction result state might change balance so get updated customer details
      } else if (transactionState === 'D') {
        // this status means we should extend polling timeout for another pollingTimeoutPeriod
        extendPollingTimeoutOnce = true
        setTimeout(pollingFunc, pollingTimerTick)
      } else {
        // transaction still in processing...
        setTimeout(pollingFunc, pollingTimerTick)
      }
    }

    setTimeout(pollingFunc, pollingTimerTick)
  },

  async fundingSightlineFlow (context, request) {
    try {
      return await context.dispatch('startEnrollmentFlow') // return redirection parameters
    } catch (e) {
      console.error('error in action sightline/fundingSightlineFlow:', e.message)
      throw e
    }
  },
  sendAnalytics: (context, param) => {
    if (window.dataLayer || context.rootGetters['getThirdpartyAnalytics']) {
      let isFirstDeposit = context.rootGetters.getNumberOfDeposits === 0 ? 'first_deposit' : 'deposit'
      let isFirstWithdrawal = context.rootGetters.getNumberOfWithdrawals === 0 ? 'first_withdrawal' : 'withdrawal'
      let status, transaction
      switch (param) {
        case 'success':
          status = 'confirm'
          break
        case 'failed':
          status = 'failed'
          break
        case 'auth':
          status = 'waitingAuthorization'
          break
      }
      switch (state.transactionType) {
        case 'R':
          transaction = isFirstDeposit
          break
        case 'P':
          transaction = isFirstWithdrawal
          break
        // case 'funding':
        //   transaction = 'funding'
        //   break
      }
      let registration = {
        'event': `${transaction} ${status}`,
        'gaEventCategory': transaction,
        'gaEventAction': `${transaction} ${status}`,
        'accountId': localStorage.getItem('customer'),
        'stake': state.amount,
        'currency': 'USD'
      }
      let xtremeObj = {
        'param1': 'event',
        'param2': transaction + '_completed',
        'param3': {
          'status': `${transaction} ${status}`,
          'amount': state.amount ? parseInt(state.amount) : '',
          'currency': 'USD'
        }
      }
      context.dispatch('analyticsHandler', {'event': registration, 'xtremeObj': xtremeObj}, { root: true })
      state.amount = 'not available'
      state.transactionType = null
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
