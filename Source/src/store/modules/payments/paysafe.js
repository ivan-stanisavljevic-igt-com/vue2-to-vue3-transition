import lib from '@/library'
import { i18n } from '@/main.js'
const failureStatuses = ['C', 'F', 'J', '+', '-', 'Z']
const state = {
  isPaySafeAvailable: false,
  depositInstrument: undefined,
  withdrawalInstrument: undefined,
  SDKUrl: undefined,
  apiKey: undefined,
  options: undefined,
  paysafePaymentResult: null,
  paysafePaymentStage: null,
  paysafePaymentError: null,
  IDMMSITXRequest: undefined,
  pollingCounter: 0,
  transactionError: undefined,
  transactionType: undefined, // P - withdrawal, R - deposit
  processingPaysafeTransaction: undefined,
  raiseDialog: 0,
  hideDialog: 0,
  fetchFinished: false,
  paysafeCashSuccessText: undefined,
  paysafeCashSuccessTitle: undefined,
  accountNotVerified: false,
  amount: undefined
}
const getters = {
  depositInstrument: () => state.depositInstrument,
  withdrawalInstrument: () => state.withdrawalInstrument,
  isPaySafeAvailable: () => state.isPaySafeAvailable,
  pollingTransaction: () => state.pollingCounter > 0,
  transactionError: () => state.transactionError,
  processingPaysafeTransaction: () => state.processingPaysafeTransaction,
  raiseDialog: () => state.raiseDialog,
  hideDialog: () => state.hideDialog,
  fetchFinished: () => state.fetchFinished,
  paysafeCashSuccessText: () => state.paysafeCashSuccessText,
  paysafeCashSuccessTitle: () => state.paysafeCashSuccessTitle,
  paysafePaymentStage: () => state.paysafePaymentStage,
  accountNotVerified: () => state.accountNotVerified
}
const mutations = {
  transactionError (state, value) {
    state.transactionError = value
  }
}
const actions = {
  // part 1: flow to determine if we should display an instument (flag isPaySafeAvailable: true or false)
  // instrument will be displayed if allowed and active
  isPaySafeAvailable: async (context) => {
    const isAllowed = await context.dispatch('isPaySafeAllowed')
    if (!isAllowed) {
      state.isPaySafeAvailable = false
    } else {
      const isActive = await context.dispatch('isPaySafeActive')
      if (isActive) {
        state.isPaySafeAvailable = true
        state.fetchFinished = true
      } else {
        context.dispatch('registerInstrument')
      }
    }
  },
  isPaySafeAllowed (context) {
    const allowedPaymentTypes = context.rootGetters['payments/allowedPaymentTypes']
    return allowedPaymentTypes && allowedPaymentTypes.find(type => type.IDMMSIType === 'PaySafe')
  },
  async isPaySafeActive (context) {
    const depositInstrument = await context.dispatch('getActiveInstrument', 'R')
    if (depositInstrument) state.depositInstrument = depositInstrument
    const withdrawalInstrument = await context.dispatch('getActiveInstrument', 'P')
    if (withdrawalInstrument) state.withdrawalInstrument = withdrawalInstrument
    return depositInstrument || withdrawalInstrument
  },
  getActiveInstrument: async (context, payload) => {
    const { type } = payload
    try {
      const instuments = (type === 'R') ? context.rootGetters['payments/activePaymentInstuments'] : context.rootGetters['payments/activePaymentInstuments']
      return instuments.find(type => type.IDMMSIType === 'PaySafe')
    } catch (exception) {
      console.log(`Error when trying to fetch a PaySafe instrument of type: (${type})`)
    }
  },
  registerInstrument: async (context) => {
    try {
      await lib.rpcService.callBroker('AccountService', 'RegisterRedirectBasedWallet', {'IDMMSIType': 'PaySafe'})
      await context.dispatch('payments/initializeActiveInstruments', null, { root: true })
      state.isPaySafeAvailable = await context.dispatch('isPaySafeActive')
      state.fetchFinished = true
    } catch (exception) {
      console.log(`Error when trying to register a PaySafe instrument`)
    }
  },
  // part 1 ends here

  // part 2: redirection
  startTransaction: async (context, payload) => {
    context.dispatch('clearSavedData')
    context.dispatch('setTransactionType', payload)
    let IDMMSITXRequest = await context.dispatch('getIDMMSITXRequest', payload)
    if (IDMMSITXRequest) {
      if (payload.type === 'P') { // in case of withdrawal, must poll
        context.dispatch('startPollingTransaction')
      } else {
        await context.dispatch('proceed2SDK', payload)
      }
    }
  },
  setTransactionType: (context, payload) => {
    if (payload.type === 'P') {
      state.transactionType = 'P'
    } else {
      state.transactionType = 'R'
    }
  },
  proceed2SDK: async (context, payload) => {
    state.processingPaysafeTransaction = true
    const sdk = await context.dispatch('getUrl4PaySafeSDK', payload)
    if (sdk) {
      const isLoaded = await context.dispatch('loadScript', payload)
      if (isLoaded) {
        context.dispatch('paysafeCheckout')
      }
    }
  },
  getUrl4PaySafeSDK: async (context, payload) => {
    let response
    try {
      response = await lib.rpcService.callBroker('AccountService', 'GetRBWRequest', {
        'IDMMSITXRequest': state.IDMMSITXRequest,
        'returnUrl': '',
        'description': null,
        'language': null
      })
      let parameters = response && response.result && response.result.Parameters
      if (parameters) {
        parameters = await context.dispatch('removeMerchantDescriptor', parameters)
        state.SDKUrl = parameters.find(p => p.Name === 'urlSDK') && parameters.find(p => p.Name === 'urlSDK').Value
        state.apiKey = parameters.find(p => p.Name === 'apiKey') && parameters.find(p => p.Name === 'apiKey').Value
        state.options = parameters.find(p => p.Name === 'options') && parameters.find(p => p.Name === 'options').Value
      }
      return parameters
    } catch (exception) {
      context.dispatch('failureHandler', exception)
    }
  },
  getIDMMSITXRequest: async (context, payload) => {
    const { amount, type } = payload
    state.amount = amount
    const instrument = (type === 'R') ? state.depositInstrument : state.withdrawalInstrument
    try {
      const response = await lib.rpcService.callBroker('AccountService', 'BeginPaymentTransactionWithoutPassword', {
        'IDMMSIInstruction': instrument.IDMMSIInstruction,
        'IDMMSITransactionType': type,
        'amount': amount,
        'securityCode': null
      })
      state.IDMMSITXRequest = response && response.result
      return response && response.result
    } catch (exception) {
      // let errMsg = exception.exceptionType === 'AccountNotVerified' ? exception.message : i18n.t('Transaction.Dialog.Error.ContactSupport')
      context.dispatch('failureHandler', exception)
    }
  },
  loadScript: (context) => {
    if (state.SDKUrl && !window.paysafe) { // there is an URL and script is not loaded yet
      try {
        let script = document.createElement('script')
        script.src = state.SDKUrl
        document.body.append(script)
        return new Promise((resolve, reject) => {
          script.onload = () => {
            resolve('success')
          }
        })
      } catch (exception) {
        context.dispatch('failureHandler', exception)
      }
    } else if (state.SDKUrl && window.paysafe) { // there is an URL and script is already loaded
      return new Promise((resolve, reject) => {
        resolve('success')
      })
    } else { // somethin's not right
      context.dispatch('failureHandler', { message: i18n.t('Transaction.Failed') })
      return undefined
    }
  },
  // func according to a paysafe doc
  paysafeCheckout: (context) => {
    try {
      window.paysafe.checkout.setup(state.apiKey, JSON.parse(state.options),
        (instance, error, result) => {
          if (result && result.paymentHandleToken) {
            state.paysafePaymentResult = result
            instance.close() // close the popup
          } else {
            console.log(error)
            state.paysafePaymentError = error
            if (instance) {
              instance.close() // close the popup
            }
            context.dispatch('failureHandler', error)
          }
        },
        (stage, expired) => {
          console.log(`Payment Handle Stage : ${stage}`)
          state.paysafePaymentStage = stage
          switch (stage) {
            case 'PAYMENT_HANDLE_CREATED':
              context.dispatch('hideDialog')
              state.processingPaysafeTransaction = false
              break
            case 'PAYMENT_HANDLE_REDIRECT':
              context.dispatch('hideDialog')
              setTimeout(() => void context.dispatch('finishTransaction'), 400)
              break
            case 'PAYMENT_HANDLE_NOT_CREATED':
              context.dispatch('hideDialog')
              // requested to call completeRBWRequest, even the call will fail
              context.dispatch('completeRBWRequest')
              break
            case 'PAYMENT_HANDLE_PAYABLE':
              context.dispatch('completeRBWRequest')
              break
          }
        })
    } catch (exception) {
      context.dispatch('failureHandler', exception)
    }
  },
  completeRBWRequest: async (context) => {
    try {
      await lib.rpcService.callBroker('AccountService', 'CompleteRBWRequest', {
        'IDMMSITXRequest': state.IDMMSITXRequest,
        'completionParameters': {
          'error': JSON.stringify(state.paysafePaymentError),
          'result': JSON.stringify(state.paysafePaymentResult),
          'stage': state.paysafePaymentStage
        }
      })
      if (state.paysafePaymentStage !== 'PAYMENT_HANDLE_NOT_CREATED') {
        context.dispatch('startPollingTransaction', 'completerbwrequest') // then poll again
      } else {
        context.dispatch('finishTransaction')
      }
    } catch (exception) {
      context.dispatch('failureHandler', exception)
    }
  },
  startPollingTransaction: (context, source) => {
    state.pollingCounter++
    setTimeout(async () => {
      if (state.pollingCounter > 30) {
        // poll timeout
        context.dispatch('failureHandler', { message: i18n.t('Transaction.Dialog.Error.Timeout') })
        return
      }
      let paymentTransaction
      try {
        paymentTransaction = await lib.rpcService.callBroker('AccountService', 'GetPaymentTransaction', {
          'IDMMSITXRequest': state.IDMMSITXRequest
        })
      } catch (exception) {
        context.dispatch('failureHandler', exception)
        return
      }
      // special case - Paysafe: CASH - on complete rbwrequest
      if (state.paysafePaymentResult && state.paysafePaymentResult.paymentMethod === 'PAYSAFECASH') {
        const extExecutionStatus = paymentTransaction && paymentTransaction.result && paymentTransaction.result.ExtExecutionStatus
        if (extExecutionStatus === 'PROCESSING') {
          context.dispatch('finishTransaction')
          state.paysafeCashSuccessTitle = i18n.t('Transaction.Paysafe.Success.Title')
          state.paysafeCashSuccessText = i18n.t('Transaction.Paysafe.Success.Text')
          context.dispatch('sendAnalytics', 'success')
          return
        }
      }
      let transactionState = paymentTransaction && paymentTransaction.result && paymentTransaction.result.IDMMSITransactionState
      if (failureStatuses.includes(transactionState)) {
        // transaction FAILED
        let msg4Customer = paymentTransaction && paymentTransaction.result && paymentTransaction.result.Message4Customer
        let msgFromAdditionalData = await context.dispatch('getErrorMsg', paymentTransaction.result)
        const exception = { message: (msg4Customer || msgFromAdditionalData || i18n.t('Transaction.Failed')) }
        context.dispatch('failureHandler', exception)
        return
      }
      if (transactionState === 'W') { // 'W': ready for redirection
        await context.dispatch('proceed2SDK')
        context.dispatch('finishPolling')
      } else if (transactionState === 'X' && source === 'completerbwrequest') { // 'X': transactions successfull
        context.dispatch('sendAnalytics', 'success')
        context.dispatch('finishTransaction')
      } else {
        context.dispatch('startPollingTransaction', source)
      }
    }, 1000)
  },
  failureHandler: (context, exception) => {
    // threat everything as an exception except the case when user close the SDK without making a transaction
    if (state.paysafePaymentStage !== 'PAYMENT_HANDLE_NOT_CREATED') {
      console.log(`Paysafe exception:`)
      console.log(exception)
      if (exception && exception.exceptionType && exception.exceptionType === 'AccountNotVerified') state.accountNotVerified = true
      state.transactionError = exception.detailedMessage || exception.message || i18n.t('Transaction.Failed')
      context.dispatch('raiseDialog')
    }
    state.processingPaysafeTransaction = false
    context.dispatch('finishPolling')
    context.dispatch('clearPaymentData')
    context.dispatch('sendAnalytics', 'failed')
  },
  finishPolling: () => {
    state.pollingCounter = 0
  },
  clearPaymentData: () => {
    state.paysafePaymentResult = null
    state.paysafePaymentError = null
  },
  clearSavedData: () => {
    state.paysafeCashSuccessText = undefined
    state.paysafeCashSuccessTitle = undefined
    state.paysafePaymentStage = null
    state.accountNotVerified = false
  },
  raiseDialog: () => {
    state.raiseDialog++
  },
  hideDialog: () => {
    state.hideDialog++
  },
  finishTransaction: (context) => {
    context.dispatch('finishPolling')
    context.dispatch('clearPaymentData')
    state.processingPaysafeTransaction = false
    context.dispatch('getCustomerContext', null, { root: true })
  },
  getErrorMsg: (context, param) => {
    let data = param && param.ExtAdditionalData
    let returnMsg
    try {
      const obj = JSON.parse(data)
      if (obj) {
        const code = obj.code
        const msg = obj.message
        if (code && msg) {
          returnMsg = msg
        }
      }
      return returnMsg
    } catch (ex) {
      console.log('Paysafe: unable to parse a ExtAdditionalData prop')
      return undefined
    }
  },
  removeMerchantDescriptor: (context, param) => {
    let optionsString = param.find(p => p.Name === 'options') && param.find(p => p.Name === 'options').Value
    let optionsObj = JSON.parse(optionsString)
    delete optionsObj.merchantDescriptor
    optionsString = JSON.stringify(optionsObj)

    let newArr = []
    let url = param.find(p => p.Name === 'urlSDK') && param.find(p => p.Name === 'urlSDK')
    let key = param.find(p => p.Name === 'apiKey') && param.find(p => p.Name === 'apiKey')
    newArr.push(url)
    newArr.push(key)
    newArr.push({
      Name: 'options',
      Value: optionsString
    })
    return newArr
  },
  sendAnalytics: (context, param) => {
    if (window.dataLayer || context.rootGetters['getThirdpartyAnalytics']) {
      let isFirstDeposit = context.rootGetters.getNumberOfDeposits === 0 ? 'first_deposit' : 'deposit'
      let isFirstWithdrawal = context.rootGetters.getNumberOfWithdrawals === 0 ? 'first_withdrawal' : 'withdrawal'
      let status = (param === 'success') ? 'confirm' : 'failed'
      let transaction = (state.transactionType === 'R') ? isFirstDeposit : isFirstWithdrawal
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
      state.amount = undefined
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
