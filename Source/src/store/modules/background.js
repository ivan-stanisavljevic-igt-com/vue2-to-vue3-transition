import Branding from '@/components/mixins/Branding'
import Url from '@/components/mixins/Url'

const brandLayout = Branding.computed.brandLayout()
const brandKey = Branding.computed.brandKey()
const backgroundImageURL = Url.methods.mediaServer(`/static/brand-img/${brandKey}/${brandKey}-bg.png`)
const shouldSetBackgroundImage = brandLayout !== 'generic' && brandKey !== 'circa' && brandKey !== 'sb'

const state = {
  backgroundImageURL: backgroundImageURL,
  shouldSetBackgroundImage: shouldSetBackgroundImage,
  appBodyRef: null
}
const getters = {
  shouldSetBackgroundImage: () => state.shouldSetBackgroundImage,
  backgroundImageValue: () => state.shouldSetBackgroundImage ? `url(${backgroundImageURL})` : ''
}
const mutations = {
  setAppBodyRef (state, value) {
    state.appBodyRef = value
  }
}
const actions = {
  applyBackgroundImage () {
    if (state.shouldSetBackgroundImage) {
      state.appBodyRef.style.backgroundImage = `url(${backgroundImageURL}?v=2`
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
