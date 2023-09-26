import lib from '@/library'
import Vue from 'vue'

const state = {
  boNavigation: {},
  boNavigationHeadlines: [],
  markets: {}
}

const getters = {
  boNavigation (state) {
    return state.boNavigation
  },
  boNavigationHeadlines (state) {
    return state.boNavigationHeadlines
  },
  markets (state) {
    return state.markets
  }
}

const mutations = {
  setBoNavigation (state, request) {
    Vue.set(state.boNavigation, request.idfwbonavigation, request.boNavigation)
  },
  setBoNavigationHeadlines (state, boNavigationHeadlines) {
    state.boNavigationHeadlines = boNavigationHeadlines
  },
  setMarket (state, request) {
    Vue.set(state.markets, request.idfomarket, request.market)
  }
}

const actions = {
  fetchBoNavigation (context) {
    return new Promise((resolve) => {
      lib.kansas.psbonav({
        idfwbonavigation: 'top'
      }).then(response => {
        if (response.data) {
          var bonode = response.data
          context.commit('setBoNavigation', { idfwbonavigation: 'top', boNavigation: bonode })

          if (bonode.bonavigationnodes) {
            bonode.bonavigationnodes.forEach(bn => {
              context.commit('setBoNavigation', { idfwbonavigation: bn.idfwbonavigation, boNavigation: bn })

              if (bn.bonavigationnodes) {
                bn.bonavigationnodes.forEach(bn1 => {
                  context.commit('setBoNavigation', {idfwbonavigation: bn1.idfwbonavigation, boNavigation: bn1})
                })
              }
            })
          }
        }
      }).catch((error) => {
        console.log(error)
        // context.commit('setBoNavigation', undefined)
      }).finally(() => {
        resolve()
      })
    })
  },
  fetchBoNavigationHeadlines (context) {
    lib.kansas.psheadline().then(response => {
      if (response.data && response.data.headlineitems && response.data.headlineitems.length > 0) {
        context.commit('setBoNavigationHeadlines', response.data.headlineitems)
      } else {
        context.commit('setBoNavigationHeadlines', [])
      }
    }).catch((error) => {
      console.log(error)
      context.commit('setBoNavigationHeadlines', [])
    })
  },
  fetchMarketsByIds (context, idfomarkets) {
    var arrIdFoMarkets = idfomarkets.toString().split(',')

    lib.kansas.evenuemarketbyids({
      idfomarkets: idfomarkets
    }).then(response => {
      if (response.data && response.data.market) {
        var markets = response.data.market

        markets.forEach((market) => {
          context.commit('setMarket', {
            idfomarket: market.idfomarket,
            market: market
          })
        })
      } else {
        arrIdFoMarkets.forEach((idfomarket) => {
          context.commit('setMarket', {
            idfomarket: idfomarket,
            market: undefined
          })
        })
      }
    }).catch((error) => {
      console.log(error)
      arrIdFoMarkets.forEach((idfomarket) => {
        context.commit('setMarket', {
          idfomarket: idfomarket,
          market: undefined
        })
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
