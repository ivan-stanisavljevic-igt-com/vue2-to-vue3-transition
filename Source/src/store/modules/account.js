import lib from '@/library'
import config from '@/config'
// import store from '@/store'
import moment from 'moment'

const state = {
  dummy: ''
}

const getters = {
  getDummy (state) {
    return 'dummy'
  }
}

const actions = {

  fetchTransactions (context, data) {
    let stamp = data.stamp ? data.stamp : new Date().getTime()
    // let pdatefrom = data.datefrom ? data.datefrom : (new Date().getTime() - (7 * 24 * 60 * 60 * 1000))
    // let pdateto = data.dateto ? data.dateto : new Date().getTime()
    // let ppagesize = data.pagesize ? data.pagesize : 10
    // p to today and 8191 for type, 29 for statistics, 60 for products
    let pdatefrom = data.datefrom
    let pdateto = data.dateto
    if (pdatefrom && pdateto) {
      pdatefrom = moment(pdatefrom)
      pdateto = moment(pdateto)

      pdatefrom.hour(0)
      pdatefrom.minute(0)
      pdatefrom.second(1)

      pdateto.hour(23)
      pdateto.minute(59)
      pdateto.second(59)
    }

    pdatefrom = pdatefrom ? pdatefrom.format(config.app.dateFormats.iso8601) : null
    pdateto = pdateto ? pdateto.format(config.app.dateFormats.iso8601) : null

    // let pdatefrom = data.datefrom ? data.datefrom : (new Date().getDate() - 7) + '-' + (new Date().getMonth() + 1) + '-' + new Date().getFullYear() + ' 0-0-1'
    // let pdateto = data.dateto ? data.dateto : new Date().getDate() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getFullYear() + ' 23-59-59'

    let pagesize = data.pagesize ? data.pagesize : 10
    return new Promise((resolve, reject) => {
      lib.rpcService.callBroker('AccountService', 'GetBalanceHistory', {
        IDMDRegion: 'ignore',
        'from': pdatefrom,
        'to': pdateto,
        'orderBy': 0,
        'orderDesc': true,
        'pageNumber': 0,
        'pageSize': pagesize
      }).then(response => {
        let rstate = null

        if (response && response.result) {
          rstate = 'fetch-success'
        } else if (!response && !response.result) {
          rstate = 'fetch-error'
        }

        if (typeof response.result === 'undefined' || !Array.isArray(response.result)) { response.result = [] }

        response.stamp = stamp
        response.state = rstate
        resolve(response)
      }).catch((response) => {
        if (!Array.isArray(response.result)) { response.result = [] }
        response.stamp = stamp
        response.state = 'fetch-error'
        reject(response)
      })
    })
  }
}

const mutations = {
  // dummy (state, data) { }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
