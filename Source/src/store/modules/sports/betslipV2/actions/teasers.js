import Vue from 'vue'
import fixedOdds from '@/library/fixedOddsV2'
import hcpFormat from '@/library/hcpFormat'
// import lib from '@/library'

const actions = {
  scheduleGetTeaserGroups (context) {
    // console.log('scheduleGetTeaserGroups')
    clearTimeout(context.state.timeouts.getTeaserGroups)
    context.state.timeouts.getTeaserGroups = setTimeout(function () {
      context.dispatch('getTeasers', 'ALL')
    }, 0)
  },
  getTeasers (context, selection) {
    context.dispatch('getTeaserGroups', 'ALL').then(
      function () {
        // context.dispatch('scheduleGetABTnR')
        // Vue.set(context.state.derivatives.teasers, 'fetchingTeaserGroups', false)
        context.dispatch('getAllowedBetTypesAndReturns')
      })
  },
  getTeaserGroups (context, selection) {
    // console.log('getTeaserGroups')
    let teasers = context.state.derivatives.teasers
    let betslipLayout2 = window.ctsautoconf.BETSLIP_LAYOT_2 || false
    if (context.state.tab !== 'TEASER' && !betslipLayout2) {
      Vue.set(teasers, 'pendingGetTeaserGroups', true)
      return
    }
    //
    const teaserSports = teasers.sports
    if (selection !== 'ALL' && !(selection && selection.idfosporttype && teaserSports.indexOf(selection.idfosporttype) > -1)) {
      // console.log('Not Teaser selection')
      return
    }
    if (selection && selection !== 'ALL') {
      var handicap = hcpFormat.getHandicap(selection)
      if (typeof handicap !== 'number') {
        return
      }
    }
    //
    Vue.set(teasers, 'pendingGetTeaserGroups', false)
    //
    let teasersPriceTypes = context.getters.teasersPriceTypes
    var activeByGroup = context.getters.activeTeaserByGroup
    var defaultActiveLevelByGroup = context.getters.defaultActiveLevelByGroup
    let mixedTeaser = context.getters.mixedTeasers
    // console.log('mixedTeaser: ' + mixedTeaser)
    if (mixedTeaser) {
      var mixedGroup = {
        IDFOSportType: 'MIXED',
        idFoSport: 'MIXED',
        Selections: [],
        Sports: [],
        SportType: 'MIXED',
        // selectedTeaser: activeByGroup['MIXED'],
        Spreads: {},
        spreads: {}
      }
    }
    //
    var betslipSelectionIds = context.getters.betslipSelections.filter(function (s) {
      // context.state.optedIn.TEASER[s.idfoselection]
      let isTeaserSelection = s.derivativetypes && (s.derivativetypes.includes('H') || s.derivativetypes.includes('O'))
      if (!isTeaserSelection) {
        let idfosporttype = context.state.config.derivatives.teasers.sportsMap[s.idfosporttype]
        let handicap = hcpFormat.getHandicap(s)
        // handicap = handicap || 0
        isTeaserSelection = teaserSports.indexOf(idfosporttype) > -1 && typeof handicap === 'number'
      }
      return isTeaserSelection
    }).map(function (e) {
      return e.idfoselection
    })
    //
    if (betslipSelectionIds.length) {
      context.state.requestId.teaserGroups++
      var rqId = context.state.requestId.teaserGroups
      //
      clearTimeout(context.state.timeouts.getABTnRint)
      //
      return fixedOdds.getTeasers(betslipSelectionIds, rqId).then(function (response) {
        // console.log('New getTeasers')
        if (rqId !== context.state.requestId.teaserGroups) {
          console.log('Missmatched request getTeaserGroups' + ' rqId: ' + rqId + ' <> ' + context.state.requestId.teaserGroups)
          return
        }
        console.log('MATCHED request getTeaserGroups' + ' rqId: ' + rqId + ' === ' + context.state.requestId.teaserGroups)
        // console.log(response)
        if (response.result && response.result.Groups) {
          let processGroup = function (group) {
            for (let t in group.Spreads) {
              if (group.Spreads[t].indexOf(0) > -1) {
                delete group.Spreads[t]
              } else {
                let areAllEq = group.Spreads[t].every(v => v === group.Spreads[t][0])
                if (areAllEq) {
                  group.Spreads[t] = '+ ' + group.Spreads[t][0]
                } else {
                  group.Spreads[t] = null
                }
              }
            }
            /*
            if (typeof group.Spreads[activeByGroup[group.idFoSport]] === 'undefined') {
              context.commit('setActiveTeaser', [group.idFoSport, 'T1'])
            }
            */
            activeByGroup[group.idFoSport] = activeByGroup[group.idFoSport] ||
              defaultActiveLevelByGroup[group.Sports] ||
              defaultActiveLevelByGroup[group.idFoSport] || 'T1'
            //
            group.selectedTeaser = activeByGroup[group.idFoSport]
          }
          //
          response.result.Groups.forEach(function (group, index) {
            // var groupId = context.getters.teaserGroupId(group)
            group.spreads = [group.Spread1, group.Spread2, group.Spread3].join('-')
            group.Spreads = {}
            var idFoSport = context.getters.computeTeaserIdFoSport(group)
            group.idFoSport = idFoSport
            // group.selectedTeaser = activeByGroup[idFoSport]
            //
            group.Selections = group.Selections.filter(function (s) {
              return context.state.betslipSelectionIds.indexOf(s.IDFOSelection) > -1
            })

            if (mixedTeaser) {
              mixedGroup.Sports.push(group.Sports)
            }
            let mxGselectionsObj = {}
            var j
            for (var i in group.Selections) {
              var id = group.Selections[i].IDFOSelection
              var sourceSelection = context.state.betslipSelections.find(ss => ss.idfoselection === id)
              //
              if (mixedTeaser) {
                mxGselectionsObj = {
                  idfosport: sourceSelection.idfosport,
                  idfosporttype: sourceSelection.idfosporttype,
                  'IDFOSelection': id,
                  Sport: group.Sports
                }
                mixedGroup.Selections.push(mxGselectionsObj)
              }
              //
              for (j = 1; j <= teasersPriceTypes.length; j++) {
                group.Spreads['T' + j] = group.Spreads['T' + j] || []
                if (mixedTeaser) {
                  mixedGroup.Spreads['T' + j] = mixedGroup.Spreads['T' + j] || []
                }
                var selection = group.Selections[i]['Item' + j]
                if (selection && selection.IDFOSelection) {
                  selection.idfosport = sourceSelection.idfosport
                  selection.idfosporttype = sourceSelection.idfosporttype
                  selection.idfoselectionsource = id
                  selection.pricetype = selection.PriceType
                  selection.hadvalue = selection.HADValue
                  selection.idfoselection = selection.IDFOSelection
                  selection.currenthandicap = selection.Handicap
                  selection.isDerivative = 'T'
                  Vue.set(teasers.T[selection.pricetype], id, selection)
                  if (id in context.state.optedIn.TEASER) {
                  } else {
                    Vue.set(context.state.optedIn.TEASER, id, true)
                  }
                  //
                  group.Spreads['T' + j].push(group['Spread' + j])
                  if (mixedTeaser) {
                    mixedGroup.Spreads['T' + j].push(group['Spread' + j])
                    // mxGselectionsObj['T' + j] = group['Spread' + j]
                  }
                } else {
                  group.Spreads['T' + j].push(0)
                  if (mixedTeaser) {
                    mixedGroup.Spreads['T' + j].push(0)
                  }
                }
                delete group.Selections[i]['Item' + j]
              }
            }

            // if (!mixedTeaser) {
            processGroup(group)
            // }
            //
          })
          //
          if (mixedTeaser) {
            processGroup(mixedGroup)
            mixedGroup.Sports = mixedGroup.Sports.join(',')
            //
            response.result.Groups = [mixedGroup]
            // Vue.set(teasers, 'teaserGroups', [mixedGroup])
          }
          //
          Vue.set(teasers, 'teaserGroups', response.result.Groups)
          //
          context.commit('resetActiveTeaser')
          //
          // context.dispatch('getAllowedBetTypesAndReturns')
          // context.commit('doTeaserUpdate')
        }
      }).catch(function (error) {
        console.log('getTeaserGroups error:')
        console.log(error)
      })
    } else {
      Vue.set(teasers, 'teaserGroups', [])
    }
  }
}

export default actions
