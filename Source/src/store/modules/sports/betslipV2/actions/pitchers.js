import Vue from 'vue'
// import store from '@/store'

const actions = {
  processPitchers (context, dataObj) {
    // console.log('processPitchers')
    let id = dataObj.id
    let selections = dataObj.selections
    let market = dataObj.market
    let sourceSelection = dataObj.sourceSelection
    let isUpdate = !sourceSelection
    //
    let pitcherhacodes = {'H': 0, 'A': 0, 'HA': 0}
    if (selections && selections.length) {
      let pitcherOptions = selections.filter(function (p) {
        if (context.state.betslipSelectionIds.indexOf(p.idfoselectionsource) === -1) {
          return false
        }
        if (p.pitcherhacode && (p.pitcherhacode in pitcherhacodes)) {
          pitcherhacodes[p.pitcherhacode]++
        }
        return pitcherhacodes[p.pitcherhacode] === 1
      })
      if (pitcherOptions.length === 3 && pitcherhacodes.H === 1 && pitcherhacodes.A === 1 && pitcherhacodes.HA === 1) {
        let pitchers = context.state.derivatives.pitchers
        //
        if (sourceSelection) {
          Vue.set(sourceSelection, 'isSourceSelection', true)
          if (market && market.name) {
            Vue.set(sourceSelection, 'marketName', market.name)
          }
          if (market && market.pitcherhacode) {
            Vue.set(sourceSelection, 'pitcherhacode', market.pitcherhacode)
          }
        }
        //
        pitcherOptions.forEach(function (s) {
          if (sourceSelection && sourceSelection.idfosporttype) {
            Vue.set(s, 'active', false)
            Vue.set(s, 'idfosporttype', sourceSelection.idfosporttype)
            Vue.set(s, 'isDerivative', 'PP')
            Vue.set(s, 'isForBB', sourceSelection.isForBB)
            s.csvpricetypes = s.csvpricetypes || s.pricetypecsv || 'CP'
            s.csvpricetypes = s.csvpricetypes.split(',')
            s.bettypecsv = s.bettypecsv ? s.bettypecsv.split(',') : []
            context.commit('setPriceType', s)
          }
          Vue.set(pitchers.sourceMap, s.idfoselection, id)
        })
        //
        if (isUpdate) {
          let ssourceSelections = pitchers.derived[id]
          let ss = context.getters.getSourceIdForDerivedSelection(id)
          sourceSelection = context.state.betslipSelections.find(function (bss) {
            return bss.idfoselection === ss
          })
          //
          if (sourceSelection && ssourceSelections && ssourceSelections[0]) {
            Vue.set(sourceSelection, 'isSourceSelection', true)
            Vue.set(sourceSelection, 'marketName', ssourceSelections[0].marketName)
            Vue.set(sourceSelection, 'pitcherhacode', ssourceSelections[0].pitcherhacode)
          }
        }
        if (pitcherOptions && sourceSelection) {
          pitcherOptions.unshift(sourceSelection)
        }
        //
        if (pitchers.derived[id] && pitchers.derived[id].length) {
          pitcherOptions.forEach(function (ds) {
            let ss = pitchers.derived[id].find(function (s) {
              return s.idfoselection === ds.idfoselection
            }) || {}
            // ds.active = ss.active
            Vue.set(ds, 'active', ss.active)
            // console.log(ss.idfoselection, 'active:', ss.active)
          })
        } else {
          Vue.set(sourceSelection, 'active', true)
        }
        //
        Vue.set(pitchers.derived, id, pitcherOptions || [])

        if (isUpdate) {
          setTimeout(function () {
            context.commit('setReInitPitchers', true)
          }, 0)
        }
      }
    }
    // console.log('Process pitchers - scheduleGetABTnR')
    context.dispatch('scheduleGetABTnR', 0.000015)
  },
  updatePitchers (context, selection) {
    // console.log('updatePitchers')
    let id = selection.idfoselection
    //
    context.dispatch('fetchDerivatives', id).then(function (response) {
      if (response.data && response.data.selections && response.data.selections.length) {
        context.dispatch('processPitchers', {id: id, selections: response.data.selections})
      }
    }).catch(function (error) {
      console.log('updatePitchers error:')
      console.log(error)
    })
  }
}

export default actions
