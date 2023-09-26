import lib from '@/library'

const state = {
  navigationSections: { }
}

const getters = {
  navigationSections (state) {
    return state.navigationSections
  }
}

const mutations = {
  setNavigationSections (state, navigationsections) {
    state.navigationSections = navigationsections
  }
}

const actions = {
  fetchSiteNavigation (context) {
    lib.kansas.pssitenav().then(response => {
      if (response.data && response.data.fwnavigationsection) {
        let sections = {}
        response.data.fwnavigationsection.forEach(fwnavigationsection => {
          sections[fwnavigationsection.id] = fwnavigationsection
        })

        context.commit('setNavigationSections', sections)
      } else {
        context.commit('setNavigationSections', { })
      }
    }).catch((error) => {
      console.log(error)
      // context.commit('setNavigationSections', { })
    })
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
