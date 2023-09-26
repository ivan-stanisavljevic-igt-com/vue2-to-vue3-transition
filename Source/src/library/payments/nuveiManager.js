import paymentHelpers from '@/library/payments/paymentHelpers'
import store from '@/store'

function handleIFrame (params, viewModel) {
  if (params && params.data && params.data.data === 'closeNuveiIFrame') {
    if (viewModel) {
      viewModel.closeNuveiIFrame()
      store.dispatch('nuvei/nuveiWd/cardCheck')
    }
  }
  if (params && params.data && params.data.messageID === 'navigate2NuveiPaymentCompletedPage') {
    if (viewModel) {
      viewModel.closeNuveiIFrame()
      viewModel.$router.push({
        name: 'nuvei-payment-completed',
        query: paymentHelpers.createObjectFromURLWithQueryParams(params.data.payload && params.data.payload)
      })
    }
  }
  if (params && params.data && params.data.messageID === 'navigate2NuveiPaymentFailedPage') {
    if (viewModel) {
      viewModel.closeNuveiIFrame()
      viewModel.$router.push({
        name: 'nuvei-payment-failed'
      })
    }
  }
}

function handleNuveiOnMount () {
  const cardCheckIsScheduled = store.getters['nuvei/scheduleCardCheck']
  if (cardCheckIsScheduled) {
    store.dispatch('nuvei/nuveiWd/cardCheck')
    store.commit('nuvei/scheduleCardCheck', false)
  }
  store.commit('nuvei/setCurrentNuveiType', null)
}

export default {
  handleIFrame,
  handleNuveiOnMount
}
