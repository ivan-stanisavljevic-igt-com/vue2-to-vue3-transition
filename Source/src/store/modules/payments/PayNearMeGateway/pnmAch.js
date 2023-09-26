import lib from '@/library'
import mobileBridge from '@/library/mobileBridge'

const state = {
  isPNMAchAvailable: false,
  processing: false,
  depositInstrument: null,
  redirectionURL: null,
  isMobileApp: window.ctsautoconf.MOBILE_LS
}
const getters = {
  isPNMAchAvailable: () => state.isPNMAchAvailable,
  processing: () => state.processing,
  redirectionURL: () => state.redirectionURL
}
const mutations = {
  redirectionURL (state, value) {
    state.redirectionURL = value
  }
}
const actions = {
  // part 1: flow to determine if we should display an instument (flag isPNMAchAvailable: true or false)
  // instrument will be displayed if allowed and active
  isPNMAchAvailable: async (context) => {
    const isAllowed = await context.dispatch('isPNMAchAllowed')
    if (!isAllowed) {
      state.isPNMAchAvailable = false
    } else {
      const isActive = await context.dispatch('isPNMAchActive')
      if (isActive) {
        state.isPNMAchAvailable = true
      } else {
        context.dispatch('registerInstrument')
      }
    }
  },
  isPNMAchAllowed (context) {
    const allowedPaymentTypes = context.rootGetters['payments/allowedPaymentTypes']
    return allowedPaymentTypes && allowedPaymentTypes.find(type => type.IDMMSIType === 'PNMAch')
  },
  async isPNMAchActive (context) {
    // PNM card has only deposit
    const depositInstrument = await context.dispatch('getActiveInstrument', 'R')
    state.depositInstrument = depositInstrument
    return depositInstrument
  },
  getActiveInstrument: async (context, type) => {
    try {
      const instuments = (type === 'R') ? context.rootGetters['payments/activeRecipientInstuments'] : context.rootGetters['payments/activePaymentInstuments']
      return instuments.find(type => type.IDMMSIType === 'PNMAch')
    } catch (exception) {
      console.log(`Error when trying to fetch a PayNearMe instrument of type: (${type})`)
    }
  },
  registerInstrument: async (context) => {
    try {
      await lib.rpcService.callBroker('AccountService', 'RegisterRedirectBasedWallet', {'IDMMSIType': 'PNMAch'})
      await context.dispatch('payments/initializeActiveInstruments', null, { root: true })
      state.isPNMAchAvailable = await context.dispatch('isPNMAchActive')
    } catch (exception) {
      console.log(`Error when trying to register a PayNearMe instrument`)
    }
  },
  // part 1 ends here

  // part 2: redirection
  start: async (context) => {
    state.processing = true
    const IDMMSITXRequest = await context.dispatch('getIDMMSITXRequest')
    context.commit('pnmGateway/IDMMSITXRequest', IDMMSITXRequest.result, { root: true })
    let redirectionURL
    try {
      redirectionURL = await lib.rpcService.callBroker('AccountService', 'GetRBWRequest', {
        'IDMMSITXRequest': IDMMSITXRequest.result,
        'returnUrl': '',
        'description': null,
        'language': null
      })
      context.dispatch('openPNMIFrame', redirectionURL.result.Url)
    } catch (exception) {
      console.log(exception)
    } finally {
      state.processing = false
    }
  },
  openPNMIFrame: (context, url) => {
    let decoratedUrl = `${url}?return_url=${window.location.href}&pay_url=${window.location.origin}/account/pnm-payment-completed&no_pay_url=${window.location.origin}/account/pnm-payment-not-completed`
    console.log(`[PNM] Redirect to: ${decoratedUrl}`)
    if (state.isMobileApp) {
      // for mobile app, open SFSafariWebController
      mobileBridge.bridgeSendRequest('openCashier', decoratedUrl)
    } else {
      state.redirectionURL = decoratedUrl
    }
  },
  getIDMMSITXRequest: async () => {
    try {
      const IDMMSITXRequest = await lib.rpcService.callBroker('AccountService', 'BeginPaymentTransactionWithoutPassword', {
        'IDMMSIInstruction': state.depositInstrument.IDMMSIInstruction,
        'IDMMSITransactionType': 'M',
        'amount': 0,
        'securityCode': null
      })
      return IDMMSITXRequest
    } catch (exception) {
      console.log(exception)
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
