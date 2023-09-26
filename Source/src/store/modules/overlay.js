import store from '@/store'

const state = {
  loginDialogState: false,
  myAccountDialogState: false,
  myAccountDesktopDialogState: false,
  sportMenuState: false,
  hamburgerMenuState: false,
  competitionSelect: false,
  betslipState: false,
  betslipMsg: {
    active: false,
    data: {}
  },
  loginFields: {},
  singleBetslipState: {
    active: false,
    resolve: null,
    reject: null
  },
  betslipConfirm: {
    active: false,
    data: {}
  },
  geolocationDialogState: false,
  geolocationMessage: {},
  headerMessagesData: {},
  headerMessageState: false,
  messageDialogState: false,
  logDialogState: false,
  overlayDialogState: false,
  welcomeDialogState: false,
  welcomeDialogGenericState: false,
  whatsNewDialogState: false,
  joinDialogState: false,
  messageDialogMsg: {},
  logDialogMsg: {},
  overlayDialogMsg: {},
  sessionDialogData: { isactive: false, context: null },
  specialOfferInfoState: {
    active: false,
    data: false,
    resolve: null,
    reject: null
  },
  headlineOverlayDialogState: false,
  headlineOverlayDialogContent: {},
  addingSelectionDialogState: false,
  loginHeadlineDialogState: false,
  contestSliderMenuState: false,
  contestsPopupOverlayState: false,
  contestsErrorDialogState: false,
  contestEnteredDialogState: false,
  contestRequestAccessDialogState: false
}

const getters = {
  getMyAccountDialogState (state) {
    return state.myAccountDialogState
  },
  getMyAccountDesktopDialogState (state) {
    return state.myAccountDesktopDialogState
  },
  getloginFields (state) {
    return state.loginFields
  },
  getLoginDialogState (state) {
    return state.loginDialogState
  },

  getSportsMenuState (state) {
    return state.sportMenuState
  },

  getHamburgerMenuState (state) {
    return state.hamburgerMenuState
  },

  getBetslipState (state) {
    return state.betslipState
  },

  getSingleBetslipState (state) {
    return state.singleBetslipState
  },

  isSingleBetslipActive (state) {
    return state.singleBetslipState.active
  },

  getBetslipMsg (state) {
    return state.betslipMsg
  },

  getBetslipConfirm (state) {
    return state.betslipConfirm
  },
  getGeolocationDialogState () {
    return state.geolocationDialogState
  },
  getGeolocationMessage () {
    return state.geolocationMessage
  },
  getHeaderMessagesData () {
    return state.headerMessagesData
  },
  getMessageDialogState () {
    return state.messageDialogState
  },
  getLogDialogState () {
    return state.logDialogState
  },
  getWelcomeDialogState () {
    return state.welcomeDialogState
  },
  getMessageDialogMsg () {
    return state.messageDialogMsg
  },
  getLogDialogMsg () {
    return state.logDialogMsg
  },
  getHeaderMessageState () {
    return state.headerMessageState
  },
  getCompetitionSelectDialogState (state) {
    return state.competitionSelect
  },
  getOverlayDialogState (state) {
    return state.overlayDialogState
  },
  getJoinDialogState (state) {
    return state.joinDialogState
  },
  getSessionDialogData () {
    return state.sessionDialogData
  },
  getSpecialOfferInfoState (state) {
    return state.specialOfferInfoState
  },
  getHeadlineOverlayDialogState (state) {
    return state.headlineOverlayDialogState
  },
  getHeadlineOverlayDialogContent (state) {
    return state.headlineOverlayDialogContent
  },
  getAddingSelectionDialogState (state) {
    return state.addingSelectionDialogState
  },
  getLoginHeadlineDialogState (state) {
    return state.loginHeadlineDialogState
  },
  getWelcomeDialogGenericState (state) {
    return state.welcomeDialogGenericState
  },
  getWhatsNewDialogState (state) {
    return state.whatsNewDialogState
  },
  getContestSliderMenuState (state) {
    return state.contestSliderMenuState
  },
  getContestsPopupOverlayState (state) {
    return state.contestsPopupOverlayState
  },
  getContestsErrorDialogState (state) {
    return state.contestsErrorDialogState
  },
  getContestEnteredDialogState (state) {
    return state.contestEnteredDialogState
  },
  getContestRequestAccessDialogState (state) {
    return state.contestRequestAccessDialogState
  }
}

const actions = {
  closeAll (context) {
    context.dispatch('deactivateMyAccountDialog')
    context.dispatch('deactivateLoginDialog')
    context.dispatch('deactivateWelcomeDialog')
    context.dispatch('deactivateSportsMenu')
    context.dispatch('deactivateBetslip')
    context.dispatch('deactivateCompetitionSelectDialog')
    context.dispatch('deactivateMyAccountDesktopDialog')
    context.dispatch('deactivateHamburgerMenu')
    context.dispatch('deactivateSingleBetslip')
    context.dispatch('deactivateSessionDialog')
    context.dispatch('deactivateSpecialOfferInfo')
    context.dispatch('deactivateHeadlineOverlayDialog')
    context.dispatch('deactivateAddingSelectionDialog')
  },

  activateMyAccountDialog (context) {
    context.dispatch('closeAll')
    context.dispatch('loginFields')
    store.commit('setLoginErrorMessage', '')
    context.commit('setMyAccountDialogState', true)
  },

  deactivateMyAccountDialog (context) {
    context.commit('setMyAccountDialogState', false)
  },
  activateMyAccountDesktopDialog (context) {
    store.dispatch('getCustomerContext', false, { root: true })
    context.dispatch('closeAll')
    context.commit('setMyAccountDesktopDialogState', true)
  },
  deactivateMyAccountDesktopDialog (context) {
    context.commit('setMyAccountDesktopDialogState', false)
  },
  loginFields (context) {
    context.commit('setLoginFields')
  },
  activateLoginDialog (context) {
    context.dispatch('closeAll')
    context.dispatch('loginFields')
    store.commit('setLoginErrorMessage', '')
    context.commit('setGeolocationDialogState', false)
    context.commit('setLoginDialogState', true)
  },
  activeGeolocationDialog (context) {
    context.commit('setGeolocationDialogState', true)
  },

  deactivateLoginDialog (context) {
    context.commit('setLoginDialogState', false)
  },
  deactivateGeolocationDialog (context) {
    context.commit('setGeolocationDialogState', false)
  },

  activateSportsMenu (context) {
    context.dispatch('closeAll')
    context.commit('setSportsMenuState', true)
  },

  deactivateSportsMenu (context) {
    context.commit('setSportsMenuState', false)
  },

  activateHamburgerMenu (context) {
    const el = document.body
    var htmlElement = document.querySelector('html')
    context.dispatch('closeAll')
    context.commit('setHamburgerMenuState', true)
    el.classList.add('hamburgermenuactive')
    htmlElement.classList.add('overflowHidden')
  },

  deactivateHamburgerMenu (context) {
    const el = document.body
    var htmlElement = document.querySelector('html')
    context.commit('setHamburgerMenuState', false)
    el.classList.remove('hamburgermenuactive')
    htmlElement.classList.remove('overflowHidden')
  },

  activateBetslip (context) {
    store.commit('sbBetslipState/setActiveBetSlip', 'BetSlip')
    const el = document.body
    var htmlElement = document.querySelector('html')
    context.dispatch('closeAll')
    el.classList.add('betslipactive')
    htmlElement.classList.add('overflowHidden')
    context.commit('setBetslipState', true)
    //
    context.dispatch('deactivateSingleBetslip')
    //
    store.dispatch('sbBetslipState/updateBetSlip')
  },

  deactivateBetslip (context) {
    // store.commit('sbBetslipState/setActiveBetSlip', false)
    const el = document.body
    var htmlElement = document.querySelector('html')
    el.classList.remove('betslipactive')
    htmlElement.classList.remove('overflowHidden')
    context.commit('setBetslipState', false)
    document.activeElement.blur()
  },

  activateSingleBetslip (context) {
    store.commit('sbBetslipState/setActiveBetSlip', 'SingleBetSlip')
    // context.commit('setSingleBetslipState', true)
    var htmlElement = document.querySelector('html')
    htmlElement.classList.add('singleBetsliipActive')
    return new Promise((resolve, reject) => {
      context.commit('setSingleBetslipState', {
        active: true,
        resolve,
        reject
      })
    })
  },

  deactivateSingleBetslip (context) {
    // store.commit('sbBetslipState/setActiveBetSlip', false)
    var htmlElement = document.querySelector('html')
    htmlElement.classList.remove('singleBetsliipActive')
    context.commit('setSingleBetslipState', {
      active: false,
      resolve: null,
      reject: null
    })
    document.activeElement.blur()
  },

  activateBetslipMsg (context, data) {
    // context.dispatch('closeAll')
    context.commit('setBetslipMsg', {
      active: true,
      data: data
    })
  },
  deactivateBetslipMsg (context, data) {
    context.state.betslipMsg.active = false
  },

  activateBetslipConfirm (context, data) {
    return new Promise((resolve, reject) => {
      context.commit('setBetslipConfirm', {
        active: true,
        data: data,
        resolve,
        reject
      })
    })
  },

  deactivateBetslipConfirm (context) {
    context.state.betslipConfirm.active = false
  },
  activateMessageDialog (context) {
    context.commit('setMessageDialogState', true)
  },
  activateLogDialog (context) {
    context.commit('setLogDialogState', true)
  },
  activateOverlayDialog (context) {
    context.commit('setOverlayDialogState', true)
  },
  activateWelcomeDialog (context) {
    context.dispatch('closeAll')
    context.dispatch('loginFields')
    store.commit('setLoginErrorMessage', '')
    context.commit('setGeolocationDialogState', false)
    context.commit('setWelcomeDialogState', true)
  },
  deactivateMessageDialog (context) {
    context.commit('setMessageDialogState', false)
  },
  deactivateLogDialog (context) {
    context.commit('setLogDialogState', false)
  },
  deactivateOverlayDialog (context) {
    console.log('alertMessages')
    store.commit('setAlertMsgs', undefined)
    context.commit('setOverlayDialogState', false)
  },
  deactivateWelcomeDialog (context) {
    context.commit('setWelcomeDialogState', false)
  },
  activateCompetitionSelectDialog (context) {
    context.dispatch('closeAll')
    context.commit('setCompetitionSelect', true)
  },
  deactivateCompetitionSelectDialog (context) {
    context.commit('setCompetitionSelect', false)
  },
  activateJoinDialog (context) {
    context.commit('setJoinDialogState', true)
  },
  deactivateJoinDialog (context) {
    context.commit('setJoinDialogState', false)
  },
  deactivateSessionDialog (context) {
    context.commit('setSessionDialogData', {isactive: false, reset: true})
  },
  activateSpecialOfferInfo (context, offerId) {
    return new Promise((resolve, reject) => {
      context.commit('setSpecialOfferInfoState', {
        active: true,
        data: offerId,
        resolve,
        reject
      })
    })
  },
  deactivateSpecialOfferInfo (context) {
    let data = state.specialOfferInfoState.data
    context.commit('setSpecialOfferInfoState', {
      active: false,
      data: data,
      resolve: null,
      reject: null
    })
  },
  activateHeadlineOverlayDialog (context) {
    context.commit('setHeadlineOverlayDialogState', true)
  },
  deactivateHeadlineOverlayDialog (context) {
    context.commit('setHeadlineOverlayDialogState', false)
  },
  activateAddingSelectionDialog (context) {
    context.commit('setAddingSelectionDialogState', true)
  },
  deactivateAddingSelectionDialog (context) {
    context.commit('setAddingSelectionDialogState', false)
  },
  activateWelcomeDialogGeneric (context) {
    context.commit('setWelcomeDialogGenericState', true)
  },
  deactivateWelcomeDialogGeneric (context) {
    context.commit('setWelcomeDialogGenericState', false)
  },
  activateWhatsNewDialog (context) {
    context.commit('setWhatsNewDialogState', true)
  },
  deactivateWhatsNewDialog (context) {
    context.commit('setWhatsNewDialogState', false)
  },
  activateContestSliderMenuState (context) {
    context.commit('setContestSliderMenuState', true)
  },
  deactivateContestSliderMenuState (context) {
    context.commit('setContestSliderMenuState', false)
  },
  activateContestsPopupOverlayState (context) {
    context.commit('setContestsPopupOverlayState', true)
  },
  deactivateContestsPopupOverlayState (context) {
    context.commit('setContestsPopupOverlayState', false)
  },
  activateContestsErrorDialogState (context) {
    context.commit('setContestsErrorDialogState', true)
  },
  deactivateContestsErrorDialogState (context) {
    context.commit('setContestsErrorDialogState', false)
  },
  activateContestEnteredDialogState (context) {
    context.commit('setContestEnteredDialogState', true)
  },
  deactivateContestEnteredDialogState (context) {
    context.commit('setContestEnteredDialogState', false)
  },
  activateContestRequestAccessDialogState (context) {
    context.commit('setContestRequestAccessDialogState', true)
  },
  deactivateContestRequestAccessDialogState (context) {
    context.commit('setContestRequestAccessDialogState', false)
  }
}

const mutations = {
  setMyAccountDialogState (state, value) {
    state.myAccountDialogState = value
  },
  setMyAccountDesktopDialogState (state, value) {
    state.myAccountDesktopDialogState = value
  },
  setLoginFields (state, value) {
    let newLoginFields = {
      username: '',
      password: '',
      showPassword: false,
      answers: {},
      hasError: false
    }
    if (value) {
      if (typeof value.username !== 'undefined') { newLoginFields.username = value.username }
      if (typeof value.password !== 'undefined') { newLoginFields.password = value.password }
      if (typeof value.showPassword !== 'undefined') { newLoginFields.showPassword = value.showPassword }
    }
    state.loginFields = newLoginFields
  },
  setLoginDialogState (state, value) {
    state.loginDialogState = value
  },
  setSportsMenuState (state, value) {
    state.sportMenuState = value
  },
  setHamburgerMenuState (state, value) {
    state.hamburgerMenuState = value
  },
  setBetslipState (state, value) {
    state.betslipState = value
  },
  setSingleBetslipState (state, value) {
    state.singleBetslipState = value
  },
  setBetslipMsg (state, value) {
    state.betslipMsg = value
  },
  setCompetitionSelect (state, value) {
    state.competitionSelect = value
  },
  setBetslipConfirm (state, value) {
    state.betslipConfirm = value
  },
  setGeolocationDialogState (state, value) {
    state.geolocationDialogState = value
  },
  setGeolocationMessage (state, value) {
    state.geolocationMessage = value
  },
  setHeaderMessagesData (state, value) {
    state.headerMessagesData = value
  },
  setMessageDialogState (state, value) {
    state.messageDialogState = value
  },
  setLogDialogState (state, value) {
    state.logDialogState = value
  },
  setOverlayDialogState (state, value) {
    state.overlayDialogState = value
  },
  setWelcomeDialogState (state, value) {
    state.welcomeDialogState = value
  },
  setMessageDialogMsg (state, value) {
    state.messageDialogMsg = value
  },
  setLogDialogMsg (state, value) {
    state.logDialogMsg = value
  },
  setHeaderMessageState (state, value) {
    state.headerMessageState = value
  },
  setOverlayDialogMsg (state, value) {
    state.overlayDialogMsg = value
  },
  setJoinDialogState (state, value) {
    state.joinDialogState = value
  },
  setSessionDialogData (state, value) {
    state.sessionDialogData.isactive = value !== null && value.isactive === true
    if (value && value.reset === true) {
      state.sessionDialogData.context = null
    } else if (value) {
      if (typeof value.context !== 'undefined') state.sessionDialogData.context = value.context
    }
  },
  setSpecialOfferInfoState (state, value) {
    state.specialOfferInfoState = value
  },
  setHeadlineOverlayDialogState (state, value) {
    state.headlineOverlayDialogState = value
  },
  setHeadlineOverlayDialogContent (state, value) {
    state.headlineOverlayDialogContent = value
  },
  setAddingSelectionDialogState (state, value) {
    state.addingSelectionDialogState = value
  },
  setLoginHeadlineDialogState (state, value) {
    state.loginHeadlineDialogState = value
  },
  setWelcomeDialogGenericState (state, value) {
    state.welcomeDialogGenericState = value
  },
  setWhatsNewDialogState (state, value) {
    state.whatsNewDialogState = value
  },
  setContestSliderMenuState (state, value) {
    state.contestSliderMenuState = value
  },
  setContestsPopupOverlayState (state, value) {
    state.contestsPopupOverlayState = value
  },
  setContestsErrorDialogState (state, value) {
    state.contestsErrorDialogState = value
  },
  setContestEnteredDialogState (state, value) {
    state.contestEnteredDialogState = value
  },
  setContestRequestAccessDialogState (state, value) {
    state.contestRequestAccessDialogState = value
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
