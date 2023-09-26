import pnmDebit from '@/store/modules/payments/PayNearMeGateway/pnmDebit'
import pnmCredit from '@/store/modules/payments/PayNearMeGateway/pnmCredit'
import pnmPushDebit from '@/store/modules/payments/PayNearMeGateway/pnmPushDebit'
import pnmCash from '@/store/modules/payments/PayNearMeGateway/pnmCash'
import pnmAch from '@/store/modules/payments/PayNearMeGateway/pnmAch'
import pnmAPay from '@/store/modules/payments/PayNearMeGateway/pnmAPay'
import pnmGPay from '@/store/modules/payments/PayNearMeGateway/pnmGPay'
import pnmPayPal from '@/store/modules/payments/PayNearMeGateway/pnmPayPal'
import pnmVenmo from '@/store/modules/payments/PayNearMeGateway/pnmVenmo'
import router from '@/router'
import lib from '@/library'
import { i18n } from '@/main.js'

const failureStatuses = ['C', 'F', 'J', '+', '-', 'Z']

const state = {
  currentRef: null,
  pollingCounter: 0,
  processing: false,
  errMsg: '',
  infoMsg: '',
  IDMMSITXRequest: null,
  withdrawAmount: ''
}
const getters = {
  currentRef: () => state.currentRef,
  processing: () => state.processing,
  infoMsg: () => state.infoMsg,
  getWithdrawAmount: () => state.withdrawAmount
}
const mutations = {
  currentRef (state, value) {
    state.currentRef = value
  },
  IDMMSITXRequest (state, value) {
    state.IDMMSITXRequest = value
  },
  setWithdrawAmount (state, value) {
    state.withdrawAmount = value
  }
}
const actions = {
  isPNMGatewayAvailable: context => {
    context.dispatch('pnmDebit/isPNMDebitAvailable', null, { root: false })
    context.dispatch('pnmCredit/isPNMCreditAvailable', null, { root: false })
    context.dispatch('pnmPushDebit/isPNMPushDebitAvailable', null, { root: false })
    context.dispatch('pnmCash/isPNMCashAvailable', null, { root: false })
    context.dispatch('pnmAch/isPNMAchAvailable', null, { root: false })
    context.dispatch('pnmAPay/isPNMAPayAvailable', null, { root: false })
    context.dispatch('pnmGPay/isPNMGPayAvailable', null, { root: false })
    context.dispatch('pnmPayPal/isPNMPayPalAvailable', null, { root: false })
    context.dispatch('pnmVenmo/isPNMVenmoAvailable', null, { root: false })
  },
  mobileBridgeHandler4PNM: (context, param) => {
    if (param === 'pnmPaymentCompleted') {
      router.push('pnm-payment-completed')
    }
    if (param === 'pnmPaymentIncompleted') {
      router.push('pnm-payment-not-completed')
    }
    if (param === 'pnmCardCheck') {
      let instruments = context.rootGetters['payments/activePaymentInstuments']
      let defaultInstrument = instruments && instruments.filter(type => type.IDMMSIType === 'PNMPushDebit')[0]
      context.dispatch('pnmPushDebit/start', {
        amount: 0,
        instrument: defaultInstrument,
        shouldOpenIFrame: false,
        isWithdrawal: false
      })
    }
  },
  // on deposit complete
  startPollingTransaction: (context) => {
    state.processing = true
    state.infoMsg = ''
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
        if (failureStatuses.includes(transactionState)) {
          // transaction FAILED
          router.push('pnm-payment-not-completed')
        } else if (transactionState === 'X') {            // SUCCESS
          state.successMsg = i18n.t('Payments.PNM.PushDebit.Successful')
          context.dispatch('getCustomerContext', null, { root: true })
          state.processing = false
        } else if (transactionState === 'Q') {
          context.dispatch('nonFinalStateHandle', i18n.t('PNMGateway.PushDebit.PollStatus.Q'))
        } else if (transactionState === 'D') {
          context.dispatch('nonFinalStateHandle', i18n.t('PNMGateway.PushDebit.PollStatus.D'))
        } else {
          context.dispatch('startPollingTransaction')
        }
        // IFovanje ends
      } catch (exception) {
        state.errMsg = exception && (exception.message || exception.Message || i18n.t('Transaction.Failed'))
        context.dispatch('getCustomerContext', null, { root: true })
        router.push('pnm-payment-not-completed')
        state.processing = false
      }
    }, 5000)
  },
  nonFinalStateHandle (context, param) {
    state.infoMsg = param
    state.processing = false
    router.push('pnm-payment-not-completed')
  }
}
const modules = {
  pnmDebit,
  pnmCredit,
  pnmPushDebit,
  pnmCash,
  pnmAch,
  pnmAPay,
  pnmGPay,
  pnmPayPal,
  pnmVenmo
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
  modules
}
