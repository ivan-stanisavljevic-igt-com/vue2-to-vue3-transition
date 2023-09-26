import lib from '@/library'
import Vue from 'vue'

const state = {
  marketgroups: {}
}

const getters = {
  marketgroups (state) {
    return state.marketgroups
  }
}

const mutations = {
  setMarketgroup (state, request) {
    Vue.set(state.marketgroups, request.idfwmarketgroup, request.marketgroup)
  }
}

const actions = {
  fetchMarketgroupById (context, idfwmarketgroup) {
    return new Promise((resolve) => {
      lib.kansas.psmg({
        idfwmarketgroup: idfwmarketgroup
      }).then(response => {
        if (response.data) {
          let marketgroup = response.data
          if (marketgroup.events && marketgroup.events.length > 0) {
            marketgroup.events.forEach((ev) => {
              if (ev.tsstart && ev.tsstart.indexOf('T') > -1) {
                ev.tsdate = ev.tsstart.split('T')[0]
              } else {
                ev.tsdate = '0'
              }
              if (ev.markets && ev.markets.length > 0) {
                ev.markets.forEach(mk => {
                  if (mk.selections && mk.selections.length > 3) {
                    // calculate price for outright market selections
                    mk.selections.forEach(sel => {
                      if (sel.currentpriceup && sel.currentpricedown) {
                        Vue._.set(sel, 'price', (1 + sel.currentpriceup / sel.currentpricedown))
                      }
                    })
                  }
                })
              }
            })
          }

          context.commit('setMarketgroup', {
            idfwmarketgroup: idfwmarketgroup,
            marketgroup: response.data
          })
        } else {
          context.commit('setBoNavigation', {
            idfwmarketgroup: idfwmarketgroup,
            marketgroup: undefined
          })
        }
      }).catch((error) => {
        console.log(error)
        context.commit('setBoNavigation', {
          idfwmarketgroup: idfwmarketgroup,
          marketgroup: undefined
        })
      }).finally(() => {
        resolve()
      })
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
