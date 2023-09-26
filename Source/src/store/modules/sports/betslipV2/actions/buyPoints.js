import Vue from 'vue'
import hcpFormat from '@/library/hcpFormat'
// import store from '@/store'
// import lib from '@/library'
// import priceFormat from '@/library/priceFormat'

const actions = {
  processBuyPoints (context, dataObj) {
    // console.log('processBuyPoints')
    //
    var formatBuyPoint = function (ds) {
      let had = dataObj.sourceSelection && dataObj.sourceSelection.hadvalue === 'A' ? -1 : 1
      let ch = hcpFormat.getHandicap(dataObj.sourceSelection)
      ch = ch || 0
      let pch = hcpFormat.getHandicap(ds)
      pch = pch || 0
      let p = pch - ch
      p *= had
      if (p > 0) {
        p = '+' + p
      }
      // console.log('formatBuyPoint diff: ' + p)
      return p
    }
    //
    let sourceSelection = dataObj.sourceSelection
    let buyPoints = context.state.derivatives.buyPoints
    let id = dataObj.id
    let selections = dataObj.selections
    let buyPointsSelections = []
    if (selections && selections.length) {
      buyPointsSelections = selections.filter(function (derivate) {
        derivate.csvpricetypes = derivate.pricetypecsv ? derivate.pricetypecsv.split(',') : []
        let isValid = context.state.betslipSelectionIds.indexOf(derivate.idfoselectionsource) > -1 &&
          (!derivate.derivativetype || derivate.derivativetype === 'HP') &&
          derivate.csvpricetypes.includes('CP') && derivate.currentpriceup && derivate.currentpricedown
        if (isValid) {
          derivate.currenthandicap = derivate.currentmatchhandicap
          derivate.hcpDiff = formatBuyPoint(derivate)
          derivate.bettypecsv = derivate.bettypecsv ? derivate.bettypecsv.split(',') : []
          Vue.set(derivate, 'isDerivative', 'HP')
          Vue.set(derivate, 'active', false)
          Vue.set(derivate, 'isForBB', sourceSelection.isForBB)
          Vue.set(buyPoints.sourceMap, derivate.idfoselection, id)
        } else {
          Vue.delete(buyPoints.sourceMap, derivate.idfoselection)
        }
        return isValid
      })
      if (buyPoints.derived[id] && buyPoints.derived[id].length) {
        buyPointsSelections.forEach(function (ds) {
          let ss = buyPoints.derived[id].find(function (s) {
            return s.idfoselection === ds.idfoselection
          }) || {}
          Vue.set(ds, 'active', ss.active)
        })
      } else {
        Vue.set(sourceSelection, 'active', true)
      }
      //
      /*
      if (buyPointsSelections.length && dataObj.sourceSelection) {
        buyPointsSelections.unshift(dataObj.sourceSelection)
      }
      */
      //
      Vue.set(buyPoints.derived, id, buyPointsSelections || [])
      // console.log('buyPointsSelections:')
      // console.log(buyPointsSelections)
      context.dispatch('scheduleGetABTnR', 0.000014)
    }
  },
  updateBuyPoints (context, selection) {
    // console.log('updateBuyPoints')
    let id = selection.idfoselection
    //
    context.dispatch('fetchDerivatives', id).then(function (response) {
      if (response.data && response.data.selections && response.data.selections.length) {
        context.dispatch('processBuyPoints', {id: id, selections: response.data.selections})
      }
    }).catch(function (error) {
      console.log('updateBuyPoints error:')
      console.log(error)
    })
  }
}

export default actions
