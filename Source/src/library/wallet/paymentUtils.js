import lib from '@/library'
import store from '@/store'

let allowedPaymentTypes = null
/**
 * Retrns object representing payment type (or undefined if that payment type is not enabled on backend)
 * @param {string} paymentType payment type eg. 'CASHINSHOP'
 * @returns {Object} object representing payment type (or undefined if not enabled)
 */
async function getPaymentTypeIfAllowed (paymentType) {
  if (!allowedPaymentTypes) {
    allowedPaymentTypes = await lib.rpcService.callBroker('AccountService', 'GetAllowedPaymentTypesByIdMMBusinessUnit', {})
  }
  return allowedPaymentTypes.result.find(type => type.IDMMSIType === paymentType)
}

/**
 * Register payment type and returns IDMMSIInstruction for a that payment type
 * @param {string} paymentType payment type eg. 'CASHINSHOP'
 * @returns {number} returns IDMMSIInstruction (SI Instruction ID) required for payment transactions or null if payment type is not enabled
 */
async function registerPaymentType (paymentType) {
  const apt = store.getters['payments/isCashinshopAvailable']
  if (apt) {
    const response = await lib.rpcService.callBroker('AccountService', 'RegisterBankTransfer', {
      'bankTransfer': apt,
      'isSameAsMainAddress': false
    })
    return response.result // returns IDMMSIInstruction
  }
  return null // this payment type is disabled or not active
}

/**
 * Returns MMSIInstruction for a given payment type or null if not available
 * @param {string} paymentType payment type eg. 'CASHINSHOP'
 * @returns {number} returns MMSIInstruction (SI Instruction object that containst instruction ID) required for payment transactions
 */
async function getMMSIInstruction (paymentType) {
  const activePaymentInstruments = await lib.rpcService.callBroker('AccountService', 'GetActivePaymentInstruments', { 'IDMMSITransactionType': 'P' })
  if (activePaymentInstruments.result && activePaymentInstruments.result.length > 0) {
    const MMSIInstruction = activePaymentInstruments.result.find(type => type.IDMMSIType === paymentType)
    return MMSIInstruction  // instruction id property: MMSIInstruction.IDMMSIInstruction
  }
  return null
}

/**
 * Returns true if transaction status code is among failure states
 * @param {string} transactionState one character string that represents transaction status eg. 'F'
 * @returns {boolean}
 */
function isTransactionStateFailure (transactionState) {
  const transactionFailureStates = ['C', 'F', 'J', '+', '-', 'Z']

  return transactionFailureStates.indexOf(transactionState) !== -1
}

/**
 * Returns object with properties:
 * isPaymentTypeAllowed - true if payment type is available, false otherwise
 * MMSIInstruction - payment instruction info or null if not available
 * IDMMSIInstruction - payment instruction or null if not available
 * @param {string} paymentType payment type eg. 'CASHINSHOP'
 * @returns {Object}
 */
async function initializePaymentType (paymentType) {
  let MMSIInstruction = await getMMSIInstruction(paymentType) // MMSIInstruction is object representing a payment instrument
  if (!MMSIInstruction) {
    let IDMMSIInstruction = await registerPaymentType(paymentType)  // IDMMSIInstruction is ID (number) of MMSIInstruction (object)
    if (IDMMSIInstruction) {
      MMSIInstruction = await getMMSIInstruction(paymentType)
    }
  }

  if (MMSIInstruction) {
    return {
      isPaymentTypeAllowed: true,
      IDMMSIInstruction: MMSIInstruction.IDMMSIInstruction,
      MMSIInstruction
    }
  } else {
    return {
      isPaymentTypeAllowed: false,
      IDMMSIInstruction: null,
      MMSIInstruction: null
    }
  }
}

// helper method used to figure out max amount for payment withdrawal
// eg. maxWithdrawAmount for cashinshop is calculated as  minimal amount from values in the PaymentInstrument configuration: minimum out of (MaxWithdrawlAmount, PaymentDailyLimit, ReceiptTxLimit )
// so this func returns minimum value from passed arguments while falsy arguments are ignored
function getMinValue () {
  const values = []
  for (var i = 0; i < arguments.length; i++) {
    let num = parseFloat(arguments[i]).toFixed(2)
    if (!isNaN(num)) {
      values.push(num)
    }
  }
  return Math.min(...values)
}

export default {
  isTransactionStateFailure,
  initializePaymentType,
  getMinValue,
  getPaymentTypeIfAllowed
}
