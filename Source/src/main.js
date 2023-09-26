// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Vuetify from 'vuetify'
import VueLodash from 'vue-lodash'
import moment from 'vue-moment'
import VueCurrencyFilter from 'vue-currency-filter'
import Vuebar from 'vuebar'
import VueResize from 'vue-resize'
import VueI18n from 'vue-i18n'
import axios from 'axios'
import store from '@/store'
import config from '@/config'
import Translator from '@/components/mixins/Translator'

Vue.use(VueI18n)

export const i18n = new VueI18n({
  locale: config.app.language, // set locale
  fallbackLocale: config.app.language,
  silentTranslationWarn: true,
  msgs: {}
})

const loadedLanguages = [] // our default language that is preloaded

function setI18nLanguage (lang) {
  i18n.locale = lang
  axios.defaults.headers.common['Accept-Language'] = lang
  document.querySelector('html').setAttribute('lang', lang)
  return lang
}

export function loadLanguageAsync (lang) {
  let brand = config.app.BRAND

  if (loadedLanguages.includes(lang)) {
    if (i18n.locale !== lang) setI18nLanguage(lang)
    return Promise.resolve()
  }

  let trnUrl = Translator.methods.trnMakeBrandDictionaryUrl(lang, brand)
  return axios.get(trnUrl + '?v=' + new Date().getTime()).then(response => {
    let msgs = response.data
    loadedLanguages.push(lang)
    // console.log('Translator.trnExtractOverrides', Translator.methods.trnExtractOverrides(Translator.methods.translatorBaseDictionaryEn(), msgs, 'all')) // uncomment to extra differences
    let msgs2 = Translator.methods.trnMakeDictionary(lang, msgs)
    i18n.setLocaleMessage(lang, msgs2)
    setI18nLanguage(lang)
    store.commit('setTranslationsLoaded', true)
  }).catch(() => {
    store.commit('setTranslationsLoaded', false)
  })
}

Vue.filter('lowercase', function (value) {
  if (!value) return ''
  return value.toLowerCase()
})

Vue.use(VueResize)
Vue.use(VueLodash)
Vue.use(moment)
Vue.use(Vuetify)
Vue.use(Vuebar)
Vue.use(VueCurrencyFilter, {
  symbol: (config.app.CURRENCY),
  thousandsSeparator: ',',
  fractionCount: 2,
  fractionSeparator: '.',
  symbolPosition: 'front',
  symbolSpacing: false
})

Vue.config.productionTip = false

// function hasQueryParams (route) {
//   return !!Object.keys(route.query).length
// }
//
// router.beforeEach((to, from, next) => {
//   if (!hasQueryParams(to) && hasQueryParams(from)) {
//     next({name: to.name, query: from.query})
//   } else {
//     next()
//   }
// })

/* eslint-disable no-new */

new Vue({
  el: '#app',
  store,
  router,
  i18n,
  components: { App },
  template: '<App/>',
  created: function () {
    loadLanguageAsync(config.app.language)
  }
})
