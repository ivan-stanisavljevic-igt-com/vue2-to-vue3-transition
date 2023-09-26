import lib from '@/library'
import Vue from 'vue'

const state = {
  verificationMaps: undefined,
  componentName: undefined,
  currentStep: undefined,
  maxStep: undefined,
  currentPage: undefined,
  currentPageState: undefined,
  mapTitle: '',
  mapShortDescription: '',
  mapDescription: '',
  mapId: undefined
}

const getters = {
  getVerificationMaps () {
    // Retrieve verification maps from local storage
    let retrievedVerMaps = localStorage.getItem('verificationMaps')
    let verMaps = JSON.parse(retrievedVerMaps)
    return state.verificationMaps || verMaps
  },
  getComponentName () {
    return state.componentName
  },
  getCurrentStep () {
    return state.currentStep
  },
  getMaxStep () {
    return state.maxStep
  },
  getCurrentPage () {
    return state.currentPage
  },
  getCurrentPageState () {
    return state.currentPageState
  },
  getMapTitle () {
    return state.mapTitle
  },
  getMapShortDescription () {
    return state.mapShortDescription
  },
  getMapDescription () {
    return state.mapDescription
  },
  getMapId () {
    return state.mapId
  }
}

const mutations = {
  setVerificationMaps (state, data) {
    state.verificationMaps = data
  },
  setComponentName (state, data) {
    state.componentName = data
  },
  setCurrentStep (state, data) {
    state.currentStep = data
  },
  setMaxStep (state, data) {
    state.maxStep = data
  },
  setCurrentPage (state, data) {
    state.currentPage = data
  },
  setCurrentPageState (state, data) {
    state.currentPageState = data
  },
  setMapTitle (state, data) {
    state.mapTitle = data
  },
  setMapShortDescription (state, data) {
    state.mapShortDescription = data
  },
  setMapDescription (state, data) {
    state.mapDescription = data
  },
  setMapId (state, data) {
    state.mapId = data
  }
}

const actions = {
  fetchVerificationMaps (context) {
    let a = 0
    if (a) {
      let vMaps = [{
        'mapno': 1,
        'internalorder': 1,
        'idtxregpage': 'verify_identity_phone',
        'regpagestate': 'answers',
        'cvdetail_keys': 'EML-MTL-AVS-AID',
        'cvdetail_states': 'NOTSENT-%-%-%',
        'description': 'Email validation screen - initiate confirmation email',
        'step': 1,
        'max_step': 2,
        'title': 'map 1',
        'mapdescription': 'Verification by email adress and personal details',
        'shortdescription': 'email + personal details'
      }, {
        'mapno': 2,
        'internalorder': 1,
        'idtxregpage': 'upload_documents',
        'regpagestate': 'initial',
        'cvdetail_keys': 'EML-MTL-AVS-AID',
        'cvdetail_states': '%-NOTSENT-%-%',
        'description': 'Mobile validation screen - initiate confirmation mobile phone',
        'step': 1,
        'max_step': 2,
        'title': 'map 2',
        'mapdescription': 'Verification by phone and personal details',
        'shortdescription': 'phone + personal details'
      },
      {
        'mapno': 3,
        'internalorder': 1,
        'idtxregpage': 'VERIFY_MOB',
        'regpagestate': 'INITIAL',
        'cvdetail_keys': 'EML-MTL-AVS-AID',
        'cvdetail_states': '%-NOTSENT-%-%',
        'description': 'Mobile validation screen - initiate confirmation mobile phone',
        'step': 1,
        'max_step': 2,
        'title': 'map 3',
        'mapdescription': 'Verification by phone and personal details',
        'shortdescription': 'phone + personal details'
      }]
      context.commit('setVerificationMaps', vMaps)
      localStorage.setItem('verificationMaps', JSON.stringify(vMaps))
    } else {
      return new Promise((resolve, reject) => {
        lib.rpcService.callBroker('iw', 'getcustomerverificationflow', {})
          .then(response => {
            let vMaps = response.result
            vMaps = Vue._.orderBy(vMaps, 'internalorder', 'desc')
            context.commit('setVerificationMaps', vMaps)
            localStorage.setItem('verificationMaps', JSON.stringify(vMaps))
            /* let priorityMap = response.result && response.result[0]
            if (priorityMap) {
              let page = priorityMap.idtxregpage.toLowerCase()
              switch (page) {
                case 'upload_documents':
                  context.commit('setComponentName', 'VerifyPersonalData')
                  break
                case 'eml':
                  context.commit('setComponentName', 'VerifyPersonalData')
                  break
                default:
                  context.commit('setComponentName', 'VerifyByPin')
                  break
              }
            } */
            resolve(response.result)
          }).catch((error) => {
            reject(error)
          }).finally(() => {
          })
      })
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
