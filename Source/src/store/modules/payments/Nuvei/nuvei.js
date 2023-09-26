import nuveiCard from '@/store/modules/payments/Nuvei/nuveiCard'
import nuveiPayPal from '@/store/modules/payments/Nuvei/nuveiPayPal'
import nuveiVP from '@/store/modules/payments/Nuvei/nuveiVP'
import nuveiACH from '@/store/modules/payments/Nuvei/nuveiACH'
import nuveiAPay from '@/store/modules/payments/Nuvei/nuveiAPay'
import nuveiPNM from '@/store/modules/payments/Nuvei/nuveiPNM'
import nuveiPlayPlus from '@/store/modules/payments/Nuvei/nuveiPlayPlus'
import nuveiVenmo from '@/store/modules/payments/Nuvei/nuveiVenmo'
import nuveiWd from '@/store/modules/payments/Nuvei/nuveiWd'
import nuveiWdCard from '@/store/modules/payments/Nuvei/nuveiWdCard'
import nuveiWdPayPal from '@/store/modules/payments/Nuvei/nuveiWdPayPal'
import nuveiWdACH from '@/store/modules/payments/Nuvei/nuveiWdACH'
import nuveiWdPlayPlus from '@/store/modules/payments/Nuvei/nuveiWdPlayPlus'
import nuveiWdVipp from '@/store/modules/payments/Nuvei/nuveiWdVipp'
import router from '@/router'
import paymentHelpers from '@/library/payments/paymentHelpers'
import store from '@/store'

const NUVEI_PAYMENT_COMPLETED = 'nuvei-payment-completed'
const NUVEI_PAYMENT_FAILED = 'nuvei-payment-failed'

const state = {
  currentRef: null,
  currentNuveiType: null,
  scheduleCardCheck: false
}
const getters = {
  currentRef () {
    return state.currentRef
  },
  currentNuveiType () {
    return state.currentNuveiType
  },
  scheduleCardCheck () {
    return state.scheduleCardCheck
  }
}
const mutations = {
  setCurrentRef (state, value) {
    state.currentRef = value
  },
  setCurrentNuveiType (state, value) {
    state.currentNuveiType = value
  },
  scheduleCardCheck (state, value) {
    state.scheduleCardCheck = value
  }
}
const actions = {
  isNuveiAvailable (context) {
    context.dispatch('nuveiCard/isPaymentInstrumentAvailable', null, { root: false })
    context.dispatch('nuveiPayPal/isPaymentInstrumentAvailable', null, { root: false })
    context.dispatch('nuveiVP/isPaymentInstrumentAvailable', null, { root: false })
    context.dispatch('nuveiACH/isPaymentInstrumentAvailable', null, { root: false })
    context.dispatch('nuveiAPay/isPaymentInstrumentAvailable', null, { root: false })
    context.dispatch('nuveiPNM/isPaymentInstrumentAvailable', null, { root: false })
    context.dispatch('nuveiPlayPlus/isPaymentInstrumentAvailable', null, { root: false })
    context.dispatch('nuveiVenmo/isPaymentInstrumentAvailable', null, { root: false })
    context.dispatch('nuveiWd/isPaymentInstrumentAvailable', null, { root: false })
    context.dispatch('nuveiWdCard/isPaymentInstrumentAvailable', null, { root: false })
    context.dispatch('nuveiWdPayPal/isPaymentInstrumentAvailable', null, { root: false })
    context.dispatch('nuveiWdACH/isPaymentInstrumentAvailable', null, { root: false })
    context.dispatch('nuveiWdPlayPlus/isPaymentInstrumentAvailable', null, { root: false })
    context.dispatch('nuveiWdVipp/isPaymentInstrumentAvailable', null, { root: false })
  }
}
const modules = {
  nuveiCard,
  nuveiPayPal,
  nuveiVP,
  nuveiACH,
  nuveiAPay,
  nuveiPNM,
  nuveiPlayPlus,
  nuveiVenmo,
  nuveiWd,
  nuveiWdCard,
  nuveiWdPayPal,
  nuveiWdACH,
  nuveiWdPlayPlus,
  nuveiWdVipp
}
const utils = {
  settleNuveiTransaction (url) {
    if (url.includes(NUVEI_PAYMENT_COMPLETED)) {
      router.push({
        path: `/account/${NUVEI_PAYMENT_COMPLETED}`,
        query: paymentHelpers.createObjectFromURLWithQueryParams(url)
      })
    }
    if (url.includes(NUVEI_PAYMENT_FAILED)) {
      router.push({
        path: `/account/${NUVEI_PAYMENT_FAILED}`,
        query: paymentHelpers.createObjectFromURLWithQueryParams(url)
      })
    }
  },
  isRedirectedFromNuveiAndPaymentIsInProgress (url) {
    return url.includes(NUVEI_PAYMENT_COMPLETED) || url.includes(NUVEI_PAYMENT_FAILED)
  },
  isRedirectedFromNuveiWithoutPayment (url) {
    const noPayment = !url.includes(NUVEI_PAYMENT_COMPLETED) || !url.includes(NUVEI_PAYMENT_FAILED)
    const isNuveiTransactionInProgress = !!store.getters['nuvei/currentNuveiType']
    return noPayment && isNuveiTransactionInProgress
  },
  startCardCheck () {
    store.dispatch('nuvei/nuveiWd/cardCheck')
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
  modules,
  utils
}
