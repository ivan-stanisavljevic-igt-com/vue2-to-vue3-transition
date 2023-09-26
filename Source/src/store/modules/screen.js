const state = {
  serviceActive: false,
  scrollValue: null,
  width: null,
  height: null,
  orientation: null,
  geolocationMsgValue: 0,
  headerHeight: 0,
  footerHeight: 0,
  headerMessageHeight: 0,
  mainColumnWidth: 0,
  centerColumnWidth: 0,
  mobileBigAndBelow: false
}

const getters = {
  getServiceActive (state) {
    return state.serviceActive
  },
  getScrollValue (state) {
    return state.scrollValue
  },
  getWidth (state) {
    return state.width
  },
  getHeight (state) {
    return state.height
  },
  getOrientation (state) {
    return state.orientation
  },
  getGeolocationMsgValue () {
    return state.geolocationMsgValue
  },
  getHeaderHeight () {
    return state.headerHeight
  },
  getFooterHeight () {
    return state.footerHeight
  },
  getHeaderMessageHeight () {
    return state.headerMessageHeight
  },
  getMainColumnWidth () {
    return state.mainColumnWidth
  },
  getCenterColumnWidth () {
    return state.centerColumnWidth
  },
  getMobileBigAndBelow () {
    return state.mobileBigAndBelow
  }
}

const actions = {
  fetchSizeData (context) {
    setTimeout(function () {
      context.commit('setWidth', document.documentElement.clientWidth)
      context.commit('setHeight', document.documentElement.clientHeight)
      context.commit('setOrientation', document.documentElement.clientWidth > document.documentElement.clientHeight ? 'landscape' : 'portrait')
    }, 0)
  },
  fetchScrollData (context) {
    var scrollElem = document.scrollingElement || document.documentElement
    context.commit('setScrollValue', scrollElem.scrollTop)
  }
}

const mutations = {
  setServiceActive (state) {
    state.serviceActive = true
  },
  setScrollValue (state, value) {
    state.scrollValue = value || null
  },
  setWidth (state, width) {
    state.width = width || null
  },
  setHeight (state, height) {
    state.height = height || null
  },
  setOrientation (state, orientation) {
    state.orientation = orientation || null
  },
  setGeolocationMsgValue (state, value) {
    state.geolocationMsgValue = value
  },
  setHeaderHeight (state, value) {
    state.headerHeight = value
  },
  setFooterHeight (state, value) {
    state.footerHeight = value
  },
  setHeaderMessageHeight (state, value) {
    state.headerMessageHeight = value
  },
  setMainColumnWidth (state, value) {
    state.mainColumnWidth = value
  },
  setCenterColumnWidth (state, value) {
    state.centerColumnWidth = value
  },
  setMobileBigAndBelow (state, value) {
    state.mobileBigAndBelow = value
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
