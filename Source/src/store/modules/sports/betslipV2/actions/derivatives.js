import Vue from 'vue'
import lib from '@/library'
import hcpFormat from '@/library/hcpFormat'
//
const actions = {
  checkDerivatives (context, dataArr) {
    // console.log('checkDerivatives')
    let derivatesList = []
    let sourceSelection = dataArr[0]
    let market = dataArr[1]
    let derivativetypes = sourceSelection.derivativetypes || (market && market.derivativetypes && market.derivativetypes.split(','))
    // console.log('derivativetypes: ' + derivativetypes + '; type: ' + typeof derivativetypes)
    //
    if (typeof derivativetypes === 'undefined' && context.state.addingMiltipleSelections.inProgress) {
      // console.log('derivativetypes: ' + derivativetypes)
      derivativetypes = 'H,O,HP,PP'.split(',')
    }
    //
    if (!derivativetypes && typeof derivativetypes !== 'undefined') {
      // console.log('no derivativetypes')
      return
    }
    /*
    let derivativetypesMap = {
      H: 'Teaser Point Spread',
      O: 'Teaser Over / Under',
      HP: 'Buy Sell',
      PP: 'Named Pitcher'
    }
    */
    //
    var isPathValid = function (obj, path) {
      // let steps = path && path.split('.')
      // let val = steps.reduce((a, b) => (a || {})[b], obj)
      let val = Vue._.get(obj, path)
      return val !== undefined
    }
    //
    if (context.state.config.derivatives.teasers.enabled) {
      // var handicap = hcpFormat.getHandicap(sourceSelection)
      if (sourceSelection.isTeaserSource === 'T' ||
          (derivativetypes && (derivativetypes.includes('H') || derivativetypes.includes('O'))) ||
          (!derivativetypes && typeof hcpFormat.getHandicap(sourceSelection) === 'number' &&
          market && market.idfosporttype &&
          isPathValid(context, 'state.derivatives.teasers.sports') &&
          isPathValid(context, 'state.config.derivatives.teasers.sportsMap') &&
          context.state.config.derivatives.teasers.sportsMap[market.idfosporttype] &&
          context.state.derivatives.teasers.sports.includes(context.state.config.derivatives.teasers.sportsMap[market.idfosporttype]))
        ) {
        Vue.set(sourceSelection, 'isTeaserSource', 'T')
        context.dispatch('scheduleGetTeaserGroups')
      }
    }
    //
    if (context.state.config.derivatives.buyPoints.enabled) {
      if (sourceSelection.isBuyPointsSource === 'HP' ||
        (derivativetypes && derivativetypes.includes('HP')) ||
        (!derivativetypes && market && market.big3markettype &&
        isPathValid(context, 'state.derivatives.buyPoints.marketTypes') &&
        context.state.derivatives.buyPoints.marketTypes.includes(market.big3markettype) &&
        isPathValid(context, 'state.derivatives.buyPoints.sports') &&
        isPathValid(context, 'state.config.derivatives.buyPoints.sportsMap') &&
        context.state.config.derivatives.buyPoints.sportsMap[market.idfosporttype] &&
        context.state.derivatives.buyPoints.sports.includes(context.state.config.derivatives.buyPoints.sportsMap[market.idfosporttype]))
      ) {
        Vue.set(sourceSelection, 'isBuyPointsSource', 'HP')
        derivatesList.push('processBuyPoints')
      }
    }
    //
    if (context.state.config.derivatives.pitchers.enabled) {
      if (sourceSelection.isPitcherSource === 'PP' ||
          (derivativetypes && derivativetypes.includes('PP') && market && market.pitcherhacode === 'AP') ||
          (!derivativetypes && market && market.pitcherhacode === 'AP' && market.idfosporttype === 'BASEBALL' && market.big3markettype === 'ML')
        ) {
        if (market && market.pitcherhacode) {
          Vue.set(sourceSelection, 'pitcherhacode', market.pitcherhacode)
        }
        Vue.set(sourceSelection, 'isPitcherSource', 'PP')
        derivatesList.push('processPitchers')
      }
    }
    //
    if (derivatesList.length) {
      // console.log('derivativetypes: ' + derivativetypes)
      // console.log('derivatesList: ' + derivatesList)
      let id = sourceSelection.idfoselection

      context.dispatch('fetchDerivatives', id).then(function (response) {
        if (response.data && response.data.selections && response.data.selections.length) {
          derivatesList.forEach(function (action) {
            context.dispatch(action, {id: id, selections: response.data.selections, market: market, sourceSelection: sourceSelection})
          })
        }
      }).catch(function (error) {
        console.log('checkDerivatives error:')
        console.log(error)
      })
    }
  },
  fetchDerivatives (context, id) {
    // console.log('fetchDerivatives for: ' + id)
    return lib.kansas.psderivatives({
      ids: id
    }).then(function (response) {
      return response
    }).catch(function (error) {
      console.log('fetchDerivatives error:')
      console.log(error)
      return {data: {selections: []}}
    })
  },
  updateDerivative (context, selectionObj) {
    // console.log('updateDerivative')
    var selection = selectionObj.selection || {}
    var changed = selectionObj.changed || {}
    if ((selection.isBuyPointsSource && (changed.price || changed.currenthandicap)) ||
      (selection.isPitcherSource && changed.price) ||
      (selection.isTeaserSource && changed.currenthandicap)) {
      context.dispatch('checkDerivatives', [selection, {}])
    }
  }
}

export default actions
