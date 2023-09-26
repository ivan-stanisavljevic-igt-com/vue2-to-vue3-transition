import axios from 'axios'
import urlMixin from '@/components/mixins/Url'

const mediaServer = urlMixin && urlMixin.methods && urlMixin.methods.mediaServer

const state = {
  waiverAndRelease: null,
  acknowledgment: null,
  fetchCompleted: false,
  fetchFailed: false,
  dgeUrl: null,
  numberOfSteps: 1
}
const getters = {
  waiverAndRelease: () => state.waiverAndRelease,
  acknowledgment: () => state.acknowledgment,
  fetchCompleted: () => state.fetchCompleted,
  fetchFailed: () => state.fetchFailed,
  dgeUrl: () => state.dgeUrl,
  numberOfSteps: () => state.numberOfSteps
}
const actions = {
  async fetchSelfExclusionText () {
    try {
      let response = await axios.get(mediaServer('/static/static-content/self-exclusion.json'))
      if (response && response.data && response.data.waiverAndRelease) {
        state.waiverAndRelease = response.data.waiverAndRelease
        state.numberOfSteps++
        for (let key in state.waiverAndRelease) {
          state.waiverAndRelease[key].agreed = false
        }
      }
      if (response && response.data && response.data.acknowledgment) {
        state.acknowledgment = response.data.acknowledgment
        state.numberOfSteps++
        for (let key in state.acknowledgment) {
          state.acknowledgment[key].agreed = false
        }
      }
      if (response && response.data && response.data.dgeUrl) {
        state.dgeUrl = response.data.dgeUrl
      }
      state.fetchCompleted = true
    } catch (ex) {
      state.fetchFailed = true
      console.log(ex)
    }
  }
}
export default {
  namespaced: true,
  state,
  getters,
  // mutations,
  actions
}
