import store from '@/store'

const paymentStatus = Object.freeze({
  SUCCESS: 'confirm',
  FAILED: 'failed'
})
function sendAnalytics (param) {
  if (window.dataLayer || store.getters['getThirdpartyAnalytics']) {
    let isFirstDeposit = store.getters['getNumberOfDeposits'] === 0 ? 'first_deposit' : 'deposit'
    let isFirstWithdrawal = store.getters['getNumberOfWithdrawals'] === 0 ? 'first_withdrawal' : 'withdrawal'
    let status = (param === 'confirm') ? 'confirm' : ((param === 'failed') ? 'failed' : '')
    let transactionType = store.getters['payments/transactionType']
    let transaction = (transactionType === 'deposit') ? isFirstDeposit : ((transactionType === 'withdrawal') ? isFirstWithdrawal : '')
    let dataObj = {
      'event': `${transaction} ${status}`,
      'gaEventCategory': transaction,
      'gaEventAction': `${transaction} ${status}`,
      'accountId': localStorage.getItem('customer'),
      'stake': store.getters['pnmGateway/getWithdrawAmount'] || '', // unknown due to stake input is performed on the PNM side
      'currency': 'USD'
    }
    let xtremeObj = {
      'param1': 'event',
      'param2': transaction + '_completed',
      'param3': {
        'status': `${transaction} ${status}`,
        'amount': store.getters['pnmGateway/getWithdrawAmount'] ? parseInt(store.getters['pnmGateway/getWithdraw']) : '',
        'currency': 'USD'
      }
    }
    store.dispatch('analyticsHandler', {'event': dataObj, 'xtremeObj': xtremeObj}, { root: true })
    store.commit('pnmGateway/setWithdrawAmount', '')
  }
}

export default {
  sendAnalytics,
  paymentStatus
}
