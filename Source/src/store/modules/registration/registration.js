const state = {
  componentNameStep1: 'RegStep1',
  componentNameStep2: 'RegStep2',
  componentNameStep3: 'RegStep3',
  componentNameStep4: 'RegStep4',
  componentEntryState: 'entry',
  componentSubmitState: 'submit',
  componentName: undefined,
  currentStep: 1,
  currentStepState: null,
  maxStep: 4,
  registrationFields: {}
}

const getters = {
  getComponentEntryState (state) {
    return state.componentEntryState
  },
  getComponentSubmitState (state) {
    return state.componentSubmitState
  },
  getComponentName (state) {
    let cns
    switch (state.currentStep) {
      case 1:
        cns = state.componentNameStep1
        break
      case 2:
        cns = state.componentNameStep2
        break
      case 3:
        cns = state.componentNameStep3
        break
      case 4:
        cns = state.componentNameStep4
        break
    }
    return cns
  },
  getCurrentStep (state) {
    return state.currentStep
  },
  getCurrentStepState (state) {
    return state.currentStepState
  },
  getMaxStep (state) {
    return state.maxStep
  },
  getRegistrationFields (state) {
    return state.registrationFields
  }
}

const mutations = {
  setComponentName (state, data) {
    state.componentName = data
  },
  setCurrentStep (state, data) {
    state.currentStep = data
  },
  setCurrentStepState (state, data) {
    state.currentStepState = data
  },
  setMaxStep (state, data) {
    state.maxStep = data
  },
  setRegistrationFields (state, data) {
    state.registrationFields = {
      userName: undefined,
      title: undefined,
      gender: undefined,
      firstName: undefined,
      lastName: undefined,
      dateOfBirth: null,
      email: undefined,
      phone: undefined,
      pass: undefined,
      securityQuestion1: undefined,
      IDDCSecurityQuestion1: undefined,
      securityAnswer1: '',
      securityQuestion2: undefined,
      IDDCSecurityQuestion2: undefined,
      securityAnswer2: '',
      address: undefined,
      zipCode: undefined,
      city: undefined,
      state: undefined,
      ssn: undefined,
      tc: undefined,
      promo: undefined,
      attestations: []
    }
  }
}

const actions = {
  initRegistrationPage (context) {
    context.commit('setRegistrationFields')
    context.commit('setCurrentStep', 1)
    context.commit('setComponentName', state.componentNameStep1)
    context.commit('setCurrentStepState', context.state.componentEntryState)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
