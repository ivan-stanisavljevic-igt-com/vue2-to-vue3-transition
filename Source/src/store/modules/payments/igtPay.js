import lib from '@/library'
import mobileBridge from '@/library/mobileBridge'
import userAgent from '@/library/core/userAgent'

const state = {
  isIgtPayAvailable: false,
  url: window.ctsautoconf.CASHIER_URL,
  igtPayCashierParams: window.ctsautoconf.CASHIER_PARAMS,
  device: (window.ctsautoconf.MOBILE_LS) ? 'mobile' : 'portal',
  igtPayProfiles: window.ctsautoconf.IGT_PAY_PROFILES,
  isIOS: userAgent.os.name === 'ios'
}
const getters = {
  isIgtPayAvailable: () => state.isIgtPayAvailable
}
const actions = {
  // part 1: flow to determine if we should display an instrument (flag isPayNearMeAvailable: true or false)
  // instrument will be displayed if allowed and active but igtPay is an exception
  // and will be considered avaliable only as if allowed (and no active) and if there is a redirection URL in configuration
  isIgtPayAvailable: async (context) => {
    const isAllowed = await context.dispatch('isIgtPayAllowed')
    if (isAllowed) {
      if (state.url) {
        state.isIgtPayAvailable = true
      }
    }
  },
  isIgtPayAllowed (context) {
    const allowedPaymentTypes = context.rootGetters['payments/allowedPaymentTypes']
    return allowedPaymentTypes && allowedPaymentTypes.find(type => type.IDMMSIType.includes('IGTPay'))
  },
  // part 1 ends here

  // part 2: redirection
  async redirect2IgtPayPage (context, payload) {
    try {
      let response = await lib.rpcService.callBroker('SharedWalletService', 'CreateTempIdAvoidCache')
      let token
      if (response.result) {
        token = encodeURIComponent(response.result)
      }
      let transactionType = (payload && payload.param) || ''
      let url = await context.dispatch('resolveIGTPayVersion', { token, transactionType })
      context.dispatch('redirect', url)
    } catch (exception) {
      console.log(exception)
    }
  },
  redirect (context, url) {
    console.log(`igtPay.js/redirect: redirecting to the: ${url}`)
    if (window.ctsautoconf.MOBILE_LS) {
      mobileBridge.bridgeSendRequest('openPopUpBridge', url)
    } else {
      window.location.href = url
    }
  },
  async resolveIGTPayVersion (context, { token, transactionType }) {
    let url
    // a new, cloud-based, version of IGT Pay
    if (state.igtPayProfiles && typeof state.igtPayProfiles === 'object') {
      let profileID = await context.dispatch('resolveProfile', transactionType)
      url = `${window.ctsautoconf.CASHIER_URL}?tempSessionId=${token}&profileId=${profileID}&baseReturnURL=${window.location.href}`
    } else {
      // the old one
      let portalUrl = (state.device !== 'mobile') ? '&portalURL=' + window.location.href + '&onepayMode=' + state.igtPayCashierParams.onepayMode : '&portalURL=' + window.location.href
      url = window.ctsautoconf.CASHIER_URL + '?tempSessionId=' + token + '&platform=' + state.device + portalUrl + '&cashierSystemId=' + state.igtPayCashierParams.cashierSystemId + '&sentFromHome=' + state.igtPayCashierParams.sentFromHome
      if (transactionType === 'deposit') {
        url = url + '&startPage=depositMoney'
      } else if (transactionType === 'withdrawal') {
        url = url + '&startPage=withdrawMoney'
      }
    }
    return url
  },
  resolveProfile (context, transactionType) {
    if (!transactionType && state.device === 'portal') return state.igtPayProfiles.homeDesktop
    if (!transactionType && state.device === 'mobile' && state.isIOS) return state.igtPayProfiles.homeIOS
    if (!transactionType && state.device === 'mobile' && !state.isIOS) return state.igtPayProfiles.homeAndroid
    if (transactionType === 'deposit' && state.device === 'portal') return state.igtPayProfiles.depositDesktop
    if (transactionType === 'deposit' && state.device === 'mobile' && state.isIOS) return state.igtPayProfiles.depositIOS
    if (transactionType === 'deposit' && state.device === 'mobile' && !state.isIOS) return state.igtPayProfiles.depositAndroid
    if (transactionType === 'withdrawal' && state.device === 'portal') return state.igtPayProfiles.withdrawalDesktop
    if (transactionType === 'withdrawal' && state.device === 'mobile' && state.isIOS) return state.igtPayProfiles.withdrawalIOS
    if (transactionType === 'withdrawal' && state.device === 'mobile' && !state.isIOS) return state.igtPayProfiles.withdrawalAndroid
  }
}
export default {
  namespaced: true,
  state,
  getters,
  actions
}
