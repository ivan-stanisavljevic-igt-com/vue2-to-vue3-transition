import Vue from 'vue'
// import axios from 'axios'

const actions = {
  updateTranslations (context) {
    console.log('updateTranslations:')
    Vue.set(context.state, 'translationsLoading', false)
    /*
    // console.log(Vue.$translations)
    // console.log(Vue)
    axios.get('/static/translations/betSlip/US.json?v=' + new Date().getTime()).then(response => {
      console.log(response)
      let data = (response && response.data) || {}
      for (var i in data) {
        Vue.$translations.US[i] = data[i]
      }
      Vue.set(context.state, 'translationsLoading', false)
      // console.log('Translations loaded')
    })
    */
  }
}
export default actions
