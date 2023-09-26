import lib from '@/library'
import mobileBridge from '@/library/mobileBridge'

const state = {
  isPayNearMeAvailable: false,
  url: '',
  processing: false,
  depositInstrument: null
}
const getters = {
  isPayNearMeAvailable: () => state.isPayNearMeAvailable,
  getRedirectionUrl: () => state.url,
  getProcessing: () => state.processing
}
const mutations = {
  setRedirectionUrl (state, value) {
    state.url = value
  },
  setProcessing (state, value) {
    state.processing = value
  }
}
const actions = {
  // part 1: flow to determine if we should display an instument (flag isPayNearMeAvailable: true or false)
  // instrument will be displayed if allowed and active
  isPayNearMeAvailable: async (context) => {
    const isAllowed = await context.dispatch('isPayNearMeAllowed')
    if (!isAllowed) {
      state.isPayNearMeAvailable = false
    } else {
      const isActive = await context.dispatch('isPayNearMeActive')
      if (isActive) {
        state.isPayNearMeAvailable = true
      } else {
        context.dispatch('registerInstrument')
      }
    }
  },
  isPayNearMeAllowed (context) {
    const allowedPaymentTypes = context.rootGetters['payments/allowedPaymentTypes']
    return allowedPaymentTypes && allowedPaymentTypes.find(type => type.IDMMSIType === 'PNM')
  },
  async isPayNearMeActive (context) {
    const depositInstrument = await context.dispatch('getActiveInstrument', 'R')
    state.depositInstrument = depositInstrument
    return depositInstrument
  },
  getActiveInstrument: async (context, type) => {
    try {
      const instuments = (type === 'R') ? context.rootGetters['payments/activeRecipientInstuments'] : context.rootGetters['payments/activePaymentInstuments']
      return instuments.find(type => type.IDMMSIType === 'PNM')
    } catch (exception) {
      console.log(`Error when trying to fetch a PayNearMe instrument of type: (${type})`)
    }
  },
  registerInstrument: async (context) => {
    try {
      await lib.rpcService.callBroker('AccountService', 'RegisterRedirectBasedWallet', {'IDMMSIType': 'PNM'})
      await context.dispatch('payments/initializeActiveInstruments', null, { root: true })
      state.isPayNearMeAvailable = await context.dispatch('isPayNearMeActive')
    } catch (exception) {
      console.log(`Error when trying to register a PayNearMe instrument`)
    }
  },
  // part 1 ends here

  // part 2: redirection
  getBarcode: async (context) => {
    context.commit('setProcessing', true)
    const IDMMSITXRequest = await context.dispatch('getIDMMSITXRequest')
    let redirectionURL
    try {
      redirectionURL = await lib.rpcService.callBroker('AccountService', 'GetRBWRequest', {
        'IDMMSITXRequest': IDMMSITXRequest.result,
        'returnUrl': '',
        'description': null,
        'language': null
      })
      if (redirectionURL) context.commit('setRedirectionUrl', redirectionURL.result.Url)
      if (window.ctsautoconf.MOBILE_LS) {
        context.dispatch('redirect', redirectionURL.result.Url)
      }
    } catch (exception) {
      console.log(exception)
    } finally {
      context.commit('setProcessing', false)
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
  },
  redirect (context, url) {
    mobileBridge.bridgeSendRequest('openCashier', url)
  }
}
export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
