import Vue from 'vue'
// import store from '@/store'
// import lib from '@/library'
// import priceFormat from '@/library/priceFormat'
import fixedOdds from '@/library/fixedOddsV2'

const actions = {
  scheduleGetABTnR (context, d) {
    // console.log('scheduleGetABTnR')
    d = d || 0
    // console.log('scheduleGetABTnR in', d)
    clearTimeout(context.state.timeouts.getABTnRint)
    if (d === 0.000111) {
      // console.log('ForceCalculation')
      let forceCalculation = true
      context.dispatch('getAllowedBetTypesAndReturns', forceCalculation)
      return
    }
    context.state.timeouts.getABTnRint = setTimeout(function () {
      // context.dispatch('getAllowedBetTypesAndReturns')
      if (context.state.tab === 'TEASER') {
        // console.log('getTeasers - scheduleGetABTnR')
        // context.dispatch('scheduleGetTeaserGroups')
        context.dispatch('getAllowedBetTypesAndReturns')
      } else {
        context.dispatch('getAllowedBetTypesAndReturns')
      }
    }, d * 1000)
  },

  getAllowedBetTypesAndReturns (context, force) {
    // console.log('getAllowedBetTypesAndReturns, force:', force)
    //
    clearTimeout(context.state.timeouts.getABTnRint)
    //
    if (context.state.currentBetSlipState > 1) {
      return
    }
    //
    var tab = context.state.tab
    //
    var selections = []
    var selectionsMappedToBetLegs
    var rqId
    var allowedBetTypesAndReturnsSelectionsStr
    var delta
    var filterABTNRperTab = function (result, tab) {
      // console.log('filterABTNRperTab')
      var r = JSON.parse(JSON.stringify(result))
      //
      if (!r) {
        return result
      }
      // Filter A
      if (tab !== 'TEASER') {
        let moreThan1A = false
        let parlays = r.AllowedBetTypes.filter(bt => bt.BetTypeInstruction === 'A')
        moreThan1A = parlays.length > 1
        if (moreThan1A) {
          // delete app Parlays
          console.log('!!! NOT allowed more than 1 parlay! Check allowed betTypes configuration')
          for (let p of parlays) {
            delete r.PotentialReturns.PerBetType[p.IDFOBetType]
          }
          r.AllowedBetTypes = r.AllowedBetTypes.filter(bt => bt.BetTypeInstruction !== 'A')
        } else {
          for (let p of parlays) {
            let parlay = r && r.PotentialReturns && r.PotentialReturns.PerBetType && r.PotentialReturns.PerBetType[p.IDFOBetType]
            if (parlay) {
              delete r.PotentialReturns.PerBetType[p.IDFOBetType]
              parlay.IDFOBetType = p.IDFOBetType
              if (p.IDFOBetType !== 'A' && p.Name) {
                parlay.Name = p.Name
              }
              r.PotentialReturns.PerBetType.A = parlay
            }
            //
            p.IDFOBetType_ = p.IDFOBetType
            p.IDFOBetType = 'A'
          }
        }
      }
      //
      /*
      if (tab === 'REGULAR') {
        r.PotentialReturns.PerBetType = {A: r.PotentialReturns.PerBetType.A}
        r.AllowedBetTypes = r.AllowedBetTypes.filter(bt => bt.IDFOBetType === 'A')
        return r
      }
      */
      // delete r.PotentialReturns.PerSelection
      r.AllowedBetTypes = r.AllowedBetTypes.filter(bt => bt.IDFOBetType === 'A' || bt.IDFOBetType.slice(0, 1) === 'C')
      for (var bt in r.PotentialReturns.PerBetType) {
        if (!(bt === 'A' || bt.slice(0, 1) === 'C')) {
          delete r.PotentialReturns.PerBetType[bt]
        }
      }
      //
      return r
    }
    //
    if (tab !== 'TEASER') {
      selections = context.getters.getSelections4Calculation(tab)
      // console.log(selections)
      selectionsMappedToBetLegs = fixedOdds.getSelectionsMappedToBetLegs(selections, null, {})
      allowedBetTypesAndReturnsSelectionsStr = context.getters.getABTnRSelectionsStr(tab, selectionsMappedToBetLegs)
      delta = force || allowedBetTypesAndReturnsSelectionsStr !== context.state.allowedBetTypesAndReturnsRequestData[tab]
      // console.log('getAllowedBetTypesAndReturns delta: ' + delta)
      if (selections.length) {
        if (!context.state.addingMiltipleSelections.inProgress && delta) {
          Vue.set(context.state.allowedBetTypesAndReturnsRequestData, tab, allowedBetTypesAndReturnsSelectionsStr)
          Vue.set(context.state, 'gettingABTnR', true)
          context.state.requestId.abtnr[tab]++
          rqId = context.state.requestId.abtnr[tab]
          const allOptedInRR = context.getters.allOptedInRR
          /*
          const hasDerivatives = selections.some(function (s) {
            return s.idfoselectionsource && s.idfoselectionsource !== s.idfoselection
          })
          */
          // const sNo = selections.length
          // console.log('Request getAllowedBetTypesAndReturns' + ' rqId: ' + rqId + ';allOptedInRR: ' + allOptedInRR)
          //
          var useXPBettingService = context.getters.useXPBettingService
          var isSGMenabled = context.getters.isSGMenabled
          var isSGMplusEnabled = context.getters.isSGMplusEnabled
          var sgmPlusAvailableonTabs = context.getters.sgmPlusAvailableonTabs
          var calculateAsync = context.getters.calculateAsync
          // console.log('tab:', tab)
          // console.log('isSGMenabled:', isSGMenabled)
          // console.log('sgmPlusAvailableonTabs:', sgmPlusAvailableonTabs)
          // console.log('useXPBettingService:', useXPBettingService)
          //
          var method = useXPBettingService ? 'getCalculation' : 'getAllowedBetTypesAndReturns'
          method = isSGMenabled ? 'getCalculationXP' : method
          var infos = isSGMenabled || isSGMplusEnabled ? context.getters.sgmSelectionsInfo(selections) : []
          return fixedOdds[method](selections, 'getCalculation', rqId, selectionsMappedToBetLegs, infos, calculateAsync).then(
            function (r) {
              // Vue.set(context.state, 'recalculateAttempt', 0)
              //
              let requestId = context.state.requestId.abtnr[tab]
              if (rqId !== requestId) {
                console.log('Missmatched request getAllowedBetTypesAndReturns' + ' rqId: ' + rqId + ' <> ' + requestId + ';allOptedInRR: ' + allOptedInRR + ';ts: ' + new Date().getTime())
                return
              }
              // console.log('MATCHED request getAllowedBetTypesAndReturns' + ' rqId: ' + rqId + ' === ' + requestId + '; allOptedInRR: ' + allOptedInRR)

              if (context.state.currentBetSlipState) {
                console.log('BetSlip NOT idling')
                return
              }

              var bt
              let calculationsFO = (r && r.result && r.result.Calculation) || (r && r.result)
              //
              // let calculationsXP = r && r.result && r.result.CalculationsXP
              //
              // let providerCalculation = r && r.result && r.result.ProviderCalculation
              // delete r.result.AllowedBetTypes
              if (calculationsFO && calculationsFO.PotentialReturns && calculationsFO.PotentialReturns.PerBetType) {
                var selNo = Object.keys(calculationsFO.PotentialReturns.PerSelection).length
                for (bt in calculationsFO.PotentialReturns.PerBetType) {
                  calculationsFO.PotentialReturns.PerBetType[bt].ParticipantsNo = selNo
                }
              }
              if (calculationsFO && calculationsFO.PotentialReturns) {
                calculationsFO = filterABTNRperTab(calculationsFO, tab)
                // Vue.set(context.state.allowedBetTypesAndReturns, tab, filterABTNRperTab(calculationsFO, tab))
              }
              //
              /*
              let tab2 = false
              if (!isSGMenabled) {
                tab2 = allOptedInRR && !hasDerivatives ? (tab === 'REGULAR' ? 'RR' : 'REGULAR') : false
              } else {
                tab2 = allOptedInRR && !hasDerivatives ? (tab === 'REGULAR' ? 'RR' : false) : false
              }
              if (tab2) {
                // console.log('set ABTnR AND for ' + tab2)
                Vue.set(context.state.allowedBetTypesAndReturns, tab2, filterABTNRperTab(calculationsFO, tab2))
                Vue.set(context.state.allowedBetTypesAndReturnsRequestData, tab2, allowedBetTypesAndReturnsSelectionsStr)
              }
              */
              //
              let hasValidSGPs = false
              let sgpParticipants = []
              let providerCalculation = isSGMenabled && r && r.result && r.result.ProviderCalculation
              if (providerCalculation && providerCalculation.length) {
                // console.log('SGM - getCalculation')
                // let provider = 'BetFairXPBettingProvider'
                const eligibleLegsNo = function (bet) {
                  let notCombinable = bet.Legs && bet.Legs.length &&
                    bet.Legs.filter(selection => ['NOT_ELIGIBLE', 'NOT_CALCULATED', 'UNKNOWN_ERROR'].includes(selection.Status))
                  notCombinable = notCombinable || []
                  let eligibleLegsNo = bet.Legs.length - notCombinable.length
                  return eligibleLegsNo
                }
                //
                let SGMs = providerCalculation.filter(function (calc) {
                  return calc.Status === 'OK'
                })
                //
                for (let SGM of SGMs) {
                  SGM.Bets = SGM.Bets && SGM.Bets.filter(function (bet) {
                    if (bet.Legs && bet.Legs.length > 1) {
                      return bet.Status === 'OK' || bet.Price || eligibleLegsNo(bet) > 1
                    } else {
                      return false
                    }
                  })
                  hasValidSGPs = hasValidSGPs || !!SGM.Bets.length
                  // console.log('SGM.Provider:', SGM.Provider)
                  if (!context.state.allowedBetTypesAndReturns.XP[SGM.Provider]) {
                    Vue.set(context.state.allowedBetTypesAndReturns.XP, SGM.Provider, {})
                  }
                  let calcStr = JSON.parse(JSON.stringify(SGM))
                  Vue.set(context.state.allowedBetTypesAndReturns.XP[SGM.Provider], 'calculation', calcStr)
                  Vue.set(context.state.allowedBetTypesAndReturns.XP, 'calculation', calcStr)
                }
                //
                Vue.set(context.state.allowedBetTypesAndReturns.XP, 'PerEvent', {})
                Vue.set(context.state.allowedBetTypesAndReturns.XP, 'Events', [])
                let events = []
                SGMs.forEach(function (sgm) {
                  if (sgm.Bets && sgm.Bets.length) {
                    sgm.Bets.forEach(function (bet) {
                      let statusArr = (bet.Status && bet.Status.split('|')) || [bet.Status]
                      bet.Status = statusArr[0]
                      bet.ErrorMessage = statusArr[1] || ''
                      //
                      if (bet.Status === 'OK' || bet.Legs.length > 1) {
                        for (let leg of bet.Legs) {
                          let legStatusArr = (leg.Status && leg.Status.split('|')) || [leg.Status]
                          leg.Status = legStatusArr[0]
                          leg.ErrorMessage = legStatusArr[1] || ''
                          //
                          leg.IDFOPriceType = sgm.PriceType
                        }
                        bet.provider = sgm.Provider
                        bet.IDFOBetType = sgm.BetType
                        bet.IDFOPriceType = sgm.PriceType
                        bet.IDFOEvent = bet.Entity
                        bet.PotentialReturn = bet.Price ? bet.Price * 1 : 0
                        bet.TotalStake = 1
                        bet.UnitCount = 1

                        Vue.set(context.state.allowedBetTypesAndReturns.XP.PerEvent, bet.Entity, bet)
                        if (events.indexOf(bet.Entity) < 0) {
                          // console.log('events push:', bet.Entity)
                          events.push(bet.Entity)
                        }
                        //
                        sgpParticipants.push(bet.Legs.length)
                      } else {
                        Vue.delete(context.state.allowedBetTypesAndReturns.XP.PerEvent, bet.Entity)
                        Vue.delete(context.state.betTypeStakes.XP.PerEvent, bet.Entity)
                      }
                    })
                  }
                })
                // console.log('events:', events)
                Vue.set(context.state.allowedBetTypesAndReturns.XP, 'Events', events)
              }
              //
              // if (calculationsFO && hasValidSGPs && sgmPlusAvailableonTabs.includes(tab)) {
              if (calculationsFO && hasValidSGPs) {
                calculationsFO.AllowedBetTypes = calculationsFO.AllowedBetTypes.filter(bt => bt.IDFOBetType !== 'A')
                delete calculationsFO.PotentialReturns.PerBetType.A
              }
              //
              // console.log('calculationXP ?')
              let calculationXP = isSGMplusEnabled && sgmPlusAvailableonTabs.includes(tab) && r && r.result && r.result.CalculationXP
              if (calculationXP) {
                // console.log('calculationXP')
                calculationXP = filterABTNRperTab(calculationXP)
                // let calculation = calculationXP
                if (calculationXP && calculationXP.PotentialReturns && calculationXP.PotentialReturns.PerBetType) {
                  let selNo = Object.keys(calculationXP.PotentialReturns.PerSelection).length
                  for (let bt in calculationXP.PotentialReturns.PerBetType) {
                    calculationXP.PotentialReturns.PerBetType[bt].ParticipantsNo = selNo
                  }
                }
                //
                if (calculationsFO && sgmPlusAvailableonTabs.includes(tab) && calculationXP) {
                  let sgpA = calculationXP.AllowedBetTypes.find(bt => bt.IDFOBetType === 'A')
                  let btA = calculationXP.PotentialReturns.PerBetType.A
                  /*
                  if (btA && !btA.PotentialReturn) {
                    console.log('Invald SGP+:', btA)
                  }
                  */
                  if (sgpA && btA && btA.PotentialReturn) {
                    let legs = btA && btA.ParticipantsNo
                    let sgp = sgpParticipants
                    sgp = sgp || []
                    let sgpNo = sgp && sgp.length
                    let sgpSno = sgp.reduce((p, c) => p + c, 0)
                    let fosNo = legs - sgpSno
                    //
                    if (sgpNo > 1 || (sgpNo && fosNo)) {
                      btA.participants = {legs, sgp, sgpNo, sgpSno, fosNo}
                      btA.sgpParticipants = sgpParticipants
                      btA.isSgpA = true
                      sgpA.isSgpA = true
                      sgpA.Name = 'SGPParlay'
                      calculationsFO.AllowedBetTypes.unshift(sgpA)
                      calculationsFO.PotentialReturns.PerBetType.A = btA
                    }
                  }
                }
              }
              //
              Vue.set(context.state.allowedBetTypesAndReturns, tab, calculationsFO)
              //
              Vue.set(context.state, 'gettingABTnR', false)
              //
              r = null
            }).catch(
            function (error) {
              console.log('failed to getAllowedBetTypesAndReturns rqId: ' + rqId + ' <?> ' + context.state.requestId.abtnr[tab] + '; ts: ' + new Date().getTime())
              console.log(error)
              if (rqId === context.state.requestId.abtnr[tab]) {
                Vue.set(context.state, 'gettingABTnR', false)
              }
              context.commit('resetAllowedBetTypesAndReturns')
            })
        }
      } else {
        context.commit('resetAllowedBetTypesAndReturns')
        Vue.set(context.state, 'gettingABTnR', false)
      }
    } else {
      // TEASERS
      // console.log('getAllowedBetTypesAndReturns 4 TEASERS')
      //
      let teaserGroups = context.state.derivatives.teasers.teaserGroups
      if (teaserGroups.length) {
        teaserGroups.forEach(function (teaserGroup) {
          context.dispatch('getAllowedBetTypesAndReturns4TeaserGroup', {teaserGroup, force})
        })
      }
    }
  },

  getAllowedBetTypesAndReturns4TeaserGroup (context, {teaserGroup, force}) {
    // console.log('getAllowedBetTypesAndReturns4TeaserGroup, teaserGroup:', teaserGroup, 'force:', force)
    var tab = context.state.tab
    var selections = []
    var selectionsMappedToBetLegs
    var rqId
    var allowedBetTypesAndReturnsSelectionsStr
    var delta
    // let teaserGroup = teaserGroups[g]
    let tt = teaserGroup.selectedTeaser
    let idFoSport = teaserGroup.idFoSport
    // console.log('get T-Abtnr for ' + idFoSport)
    selections = []
    for (var s = 0; s < teaserGroup.Selections.length; s++) {
      var selection = context.getters.getTeaserSelections4AbtnrById(tt, teaserGroup.Selections[s].IDFOSelection)
      if (selection && selection.idfoselection) {
        selections.push(selection)
      }
    }
    //
    if (selections.length > 1) {
      selectionsMappedToBetLegs = fixedOdds.getSelectionsMappedToBetLegs(selections, null)
      allowedBetTypesAndReturnsSelectionsStr = context.getters.getABTnRSelectionsStr(tab, selectionsMappedToBetLegs)
      delta = force || allowedBetTypesAndReturnsSelectionsStr !== context.state.allowedBetTypesAndReturnsRequestData[tab][idFoSport]
      // console.log('TEASERS (' + idFoSport + '[' + selections.length + ']) delta: ' + delta)
      //
      if (delta) {
        context.state.requestId.abtnr.teasers[idFoSport]++
        rqId = context.state.requestId.abtnr.teasers[idFoSport]
        // console.log('TEASERS (' + idFoSport + '[' + selections.length + ']) delta: ' + delta + ';rqId: ' + rqId)
        //
        Vue.set(context.state.allowedBetTypesAndReturnsRequestData[tab], idFoSport, allowedBetTypesAndReturnsSelectionsStr)
        Vue.set(context.state, 'gettingABTnR', true)
        //
        var useXPBettingService = context.getters.useXPBettingService
        var isSGMenabled = context.getters.isSGMenabled
        var method = useXPBettingService || isSGMenabled ? 'getCalculation' : 'getAllowedBetTypesAndReturns'
        return fixedOdds[method](selections, 'getCalculation-' + idFoSport, rqId, selectionsMappedToBetLegs).then(
          function (r) {
            let requestId = context.state.requestId.abtnr.teasers[idFoSport]
            if (rqId !== requestId) {
              console.log('Missmatched request getAllowedBetTypesAndReturns-4-TEASERS' + ' rqId: ' + rqId + ' <> ' + requestId + ';ts: ' + new Date().getTime() + '; idFoSport: ' + idFoSport)
              return
            }
            // console.log('MATCHED request getAllowedBetTypesAndReturns-4-TEASERS' + ' rqId: ' + rqId + ' === ' + requestId + '; idFoSport: ' + idFoSport)

            if (context.state.currentBetSlipState) {
              console.log('BetSlip NOT idling')
              return
            }
            // console.log('Teaser calculation:', r.result)

            let parlays = r.result.AllowedBetTypes.filter(bt => bt.BetTypeInstruction === 'A')
            for (let p of parlays) {
              let parlay = r && r.result && r.result.PotentialReturns && r.result.PotentialReturns.PerBetType && r.result.PotentialReturns.PerBetType[p.IDFOBetType]
              if (parlay) {
                delete r.result.PotentialReturns.PerBetType[p.IDFOBetType]
                parlay.IDFOBetType = p.IDFOBetType
                if (p.IDFOBetType !== 'A' && p.Name) {
                  parlay.Name = p.Name
                }
                r.result.PotentialReturns.PerBetType.A = parlay
              }
              //
              p.IDFOBetType_ = p.IDFOBetType
              p.IDFOBetType = 'A'
            }

            // delete r.result.AllowedBetTypes
            // delete r.result.PotentialReturns.PerSelection
            if (r.result && r.result.PotentialReturns && r.result.PotentialReturns.PerBetType && r.result.PotentialReturns.PerBetType.A) {
              r.result.PotentialReturns.PerBetType.A.ParticipantsNo = Object.keys(r.result.PotentialReturns.PerSelection).length
              r.result.PotentialReturns.PerSelection = {}
              r.result.PotentialReturns.PerBetType = {A: r.result.PotentialReturns.PerBetType.A}
            }
            Vue.set(context.state.allowedBetTypesAndReturns.TEASER, idFoSport, r.result)
            //
            Vue.set(context.state, 'gettingABTnR', false)
          })
      }
    } else {
      Vue.set(context.state.allowedBetTypesAndReturnsRequestData[tab], idFoSport, '')
      Vue.set(context.state, 'gettingABTnR', false)
      context.commit('resetABTnR4Teaser', idFoSport)
    }
  }
}

export default actions
