import config from '@/config'
import fixedOdds from '@/library/fixedOddsV2'
const accumulatorIds = ['A', 'D', 'T', 'VLA', 'A4', 'A5', 'A6', 'A7', 'A8', 'A9', 'A10', 'QU', '7T', '7A', 'ATLT', 'ATLA', 'HSHT', 'HSHA', 'PLT', 'PLA', 'VLT']

const getters = {
  autoAcceptSbTnC (state) {
    // !!! USED BY EXTERNAL COMPONENT !!!
    return state.autoAcceptSbTnC
  },
  currentBetSlipState (state) {
    // !!! USED BY EXTERNAL COMPONENT !!!
    return state.currentBetSlipState
  },
  currentBetSlipStateName (state) {
    // !!! USED BY EXTERNAL COMPONENT !!!
    return state.betSlipState[state.currentBetSlipState]
  },
  selectionsNo (state) {
    // !!! USED BY EXTERNAL COMPONENT !!!
    return state.betslipSelections.length
  },
  betSlipStatus (state) {
    // !!! USED BY EXTERNAL COMPONENT !!!
    return state.attemptedBetSlip.betSlipStatus
  },
  attemptedBetSlip (state) {
    return state.attemptedBetSlip.betSlip
  },
  attemptedBetSlipXPdata (state) {
    return state.attemptedBetSlip && state.attemptedBetSlip.betSlip && state.attemptedBetSlip.betSlip.xpInbound
  },
  activeBetSlip (state) {
    // !!! USED BY EXTERNAL COMPONENT !!!
    // console.log('get activeBetSlip: ' + state.activeBetSlip)
    return state.activeBetSlip
  },
  activeBetSlipHistoryTab (state) {
    // !!! USED BY EXTERNAL COMPONENT !!!
    // console.log('get activeBetSlipHistoryTab: ' + state.historyTab)
    return state.historyTab
  },
  betslipSelectionsIds (state) {
    // !!! USED BY EXTERNAL COMPONENT !!!
    return state.betslipSelectionsIds
  },
  getStoredSelectionById: (state) => (id, isFastBet) => {
    // !!! USED BY EXTERNAL COMPONENT !!!
    // return isFastBet ? state.singleBetSlip.selection : state.betslipSelections.find(s => s.idfoselection === id)
    return state.betslipSelections.find(s => s.idfoselection === id)
  },
  getMarkets: (state) => {
    // !!! USED BY EXTERNAL COMPONENT !!!
    return state.markets
  },
  translationsLoading (state) {
    console.log('translationsLoading')
    return state.translationsLoading
  },
  closeFromParent (state) {
    return state.closeFromParent
  },
  addingMiltipleSelections (state) {
    return state.addingMiltipleSelections
  },
  maxSno (state) {
    return state.config.maxSno
  },
  //
  isGeoLocationEnabled (state) {
    return state.config.geoLocation.enabled
  },
  isSGMenabled (state) {
    return state.config.SGM.enabled
  },
  isSGMplusEnabled (state) {
    return state.config.SGMplus.enabled
  },
  sgmPlusAvailableonTabs (state) {
    return state.config.SGMplus.availableonTabs
  },
  allowedMultiSingles (state) {
    return state.config.allowedMultiSingles
  },
  tabs (state) {
    return state.config.tabs
  },
  tab (state) {
    return state.tab
  },
  interRelated (state) {
    return state.interRelated
  },
  interRelatedPerTab: (state) => (tab) => {
    // console.log('interRelatedPerTab: ' + tab)
    // var optedIn = state.optedIn[tab]
    var i
    var ig
    var obj = {}
    var objInv = {}
    if (state.interRelated) {
      for (var s in state.interRelated) {
        if (state.optedIn[tab][s] && state.interRelated[s]) {
          obj[s] = state.interRelated[s]
        }
      }
    }
    //
    for (i in obj) {
      ig = obj[i]
      objInv[ig] = objInv[ig] || []
      objInv[ig].push(i)
    }
    //
    for (i in objInv) {
      if (objInv[i].length < 2) {
        delete objInv[i]
      }
    }
    //
    return objInv
  },
  showAcceptingChangesInfo (state) {
    return state.showAcceptingChangesInfo
  },
  betSlipChangeNo (state) {
    return state.betSlipChanges.changeNo
  },
  gettingABTnR (state) {
    return state.gettingABTnR
  },
  allowedBetTypesAndReturns (state) {
    return state.allowedBetTypesAndReturns
  },
  betTypeStakes (state) {
    return state.betTypeStakes
  },
  returns (state) {
    return state.returns
  },
  betslipSelections (state) {
    return state.betslipSelections
  },
  betslipSelectionIds (state) {
    return state.betslipSelectionIds
  },
  multiSinglesStake (state) {
    return state.multiSinglesStake
  },
  wagerAllSingles (state) {
    return state.config.wagerAllSingles
  },

  getSelectionById: (state, rootState, rootGetters, getters) => (id) => {
    var idfoevent = state.idfoevents[id]
    var idfomarket = state.idfomarkets[id]
    var events = getters['livebettingState/liveEvents']
    // var events = rootGetters.livebettingState.liveEvents
    var event = events && events.find(e => e.idfoevent === idfoevent && !e.isawaitingstart)
    var market = event && event.markets && event.markets.find(m => m.idfomarket === idfomarket)
    var selection = market && market.selections && market.selections.find(s => s.idfoselection === id)
    if (selection) {
      return selection
    }
    return state.betslipSelections.find(s => s.idfoselection === id)
  },
  getStoredMarketById: (state) => (id) => {
    return state.markets[id]
  },
  getIdfoMarketById: (state) => (id) => {
    return state.idfomarkets[id]
  },
  getMarketById: (state, rootState, rootGetters, getters) => (id) => {
    var idfoevent = state.idfoevents[id]
    var idfomarket = state.idfomarkets[id]
    var events = getters['livebettingState/liveEvents']
    var event = events && events.find(event => event.idfoevent === idfoevent)
    var market = event && event.markets && event.markets.find(m => m.idfomarket === idfomarket)
    // return market || state.markets[id]
    return market
  },
  getIdfoEventById: (state) => (id) => {
    return state.idfoevents[id]
  },
  isEventLive: (state, rootState, rootGetters) => (idfoevent) => {
    return !!rootGetters.livebettingState.liveEvents.find(e => e.idfoevent === idfoevent)
  },
  liveSelections (state, getters) {
    var arr = []
    if (state.betslipSelections.length) {
      state.betslipSelections.forEach(function (selection) {
        var market = state.markets[selection.idfoselection]
        // console.log('LIVE check for: ' + selection.market.idfoevent)
        // if (state.liveTracker[market.idfoevent]) {
        if (getters.isEventLive(market.idfoevent)) {
          arr.push(selection.idfoselection)
        }
      })
    }
    state.liveSelections = arr
    state.isLive = !!arr.length
    return arr
  },
  clearMarkings: (state) => {
    return state.clearMarkings
  },
  getSelections4Calculation: (state, getters) => (tab, sourceId, allSelections) => {
    // console.log('getSelections4Calculation')
    //
    let selections = []
    let derivative = {}
    if (state.betslipSelections.length) {
      state.betslipSelections.forEach(function (selection) {
        // if ((!sourceId || sourceId === selection.idfoselection) && (tab === 'REGULAR' || (tab !== 'REGULAR' && state.optedIn[tab][selection.idfoselection]))) {
        if ((!sourceId || sourceId === selection.idfoselection) && (allSelections || state.optedIn[tab][selection.idfoselection])) {
          derivative = getters.getDerivative(selection.idfoselection, tab)
          if (derivative && derivative.active) {
            selections.push(derivative)
          } else {
            selections.push(selection)
          }
        }
      })
    }
    return selections
  },
  betslipSelectionIdsByTab: (state) => (tab) => {
    var selections = state.betslipSelectionIds
    // if (tab !== 'REGULAR') {
    selections = selections.filter(function (s) {
      return state.optedIn[tab][s]
    })
    // }
    return selections
  },
  getSelection4AbtnrById: (state) => (id) => {
    return state.betslipSelections.find(function (s) {
      return s.idfoselection === id
    })
  },
  getABTnRSelectionsStr: (state) => (tab, selectionsMappedToBetLegs) => {
    var preserve = {
      IDFOSelection: true,
      IDFOPriceType: true,
      PriceDown: tab !== 'TEASER',
      PriceUp: tab !== 'TEASER',
      Handicap: false
    }
    var optedIn = state.optedIn[tab]
    if (selectionsMappedToBetLegs && selectionsMappedToBetLegs.length) {
      selectionsMappedToBetLegs = JSON.parse(JSON.stringify(selectionsMappedToBetLegs))
      selectionsMappedToBetLegs.forEach(function (leg) {
        for (var p in leg) {
          if (!preserve[p]) {
            delete leg[p]
          }
        }
        leg.optIn = !!optedIn[leg.IDFOSelection]
      })
    }
    return JSON.stringify(selectionsMappedToBetLegs)
  },
  allowedBetTypesPRL (state) {
    var ACC = []
    var src = state.allowedBetTypesAndReturns.REGULAR.PotentialReturns.PerBetType
    for (var bT in src) {
      if (accumulatorIds.indexOf(bT) > -1) {
        // src[bT].IDFOBetType = bT
        ACC.push(src[bT])
      }
    }
    return ACC
  },
  allowedBetTypesRR (state) {
    var RR = []
    var src = state.allowedBetTypesAndReturns.RR.PotentialReturns.PerBetType
    for (var bT in src) {
      if (bT !== 'S' && bT[0] === 'C' && accumulatorIds.indexOf(bT) === -1) {
        src[bT].IDFOBetType = bT
        RR.push(src[bT])
      }
    }
    return RR
  },
  optedIn (state) {
    return state.optedIn
  },
  optedInRR (state) {
    return state.optedIn.RR
  },
  optedInTeaser (state) {
    return state.optedIn.TEASER
  },
  optedInRegular (state) {
    return state.optedIn.REGULAR
  },
  isOptedIn: (state) => (data) => {
    return !!state.optedIn[data.tab][data.id]
  },
  allOptedInRegular (state) {
    for (var s in state.optedIn.REGULAR) {
      if (!state.optedIn.REGULAR[s]) {
        return false
      }
    }
    return true
  },
  allOptedInRR (state) {
    for (var s in state.optedIn.RR) {
      if (!state.optedIn.RR[s]) {
        return false
      }
    }
    return true
  },
  pendingGetTeaserGroups (state) {
    // console.log('pendingGetTeaserGroups')
    return state.derivatives.teasers.pendingGetTeaserGroups
  },
  teasers (state) {
    return state.derivatives.teasers
  },
  teaserGroups (state) {
    return state.derivatives.teasers.teaserGroups
  },
  teaserSelection: (state) => (tt, id) => {
    tt = tt || 'T1'
    return state.derivatives.teasers.T[tt][id]
  },
  getTeaserSelections4AbtnrById: (state) => (tt, id) => {
    tt = tt || 'T1'
    return state.optedIn.TEASER[id] && state.derivatives.teasers.T[tt][id]
  },
  activeTeaserByGroup (state) {
    return state.derivatives.teasers.activeByGroup
  },
  getTeaserIdFoSport: (state) => (id) => {
    return state.betslipSelections.find(s => s.idfoselection === id).idfosport
  },
  computeTeaserIdFoSport: (state) => (group) => {
    var idfosport
    var sport = group.Sports.split(' ').join('')
    if (group.IDFOSportType === 'COLL BSKT' || group.IDFOSportType === 'COLLBB' || group.IDFOSportType === 'BBCOLL') {
      idfosport = 'COLLBB'
    } else if (group.IDFOSportType === 'BASKETBALL') {
      // idfosport = 'BASKETBALL'
      idfosport = group.spreads.includes('4-4.5-5') || sport === 'NBA' ? 'BASKETBALL' : 'COLLBB'
      // idfosport = sport === 'NBA' ? 'BASKETBALL' : 'COLLBB'
    } else if (group.IDFOSportType === 'NFL') {
      // idfosport = sport === 'NFL' ? 'NFL' : 'COLLFB'
      idfosport = group.spreads.includes('6-6.5-7') || sport === 'NFL' ? 'NFL' : 'COLLFB'
    } else {
      idfosport = 'COLLFB'
    }
    // console.log('computeTeaserIdFoSport ' + group.IDFOSportType + ' => ' + idfosport)
    return idfosport
  },
  mixedTeasers (state) {
    return state.config.derivatives.teasers.mixed
  },
  allowInPlayTeasers (state) {
    return state.config.derivatives.teasers.allowInPlayTeasers
  },
  pitchers (state) {
    return state.derivatives.pitchers
  },
  reInitPitchers (state) {
    return state.derivatives.pitchers.reInit
  },
  getPitchersById: (state) => (id) => {
    return state.derivatives.pitchers.derived[id]
  },
  getDerivative: (state) => (id, tab) => {
    var derivative = {}
    if (state.config.derivatives.pitchers.enabled) {
      let pitchers = state.derivatives.pitchers.derived
      derivative = pitchers && pitchers[id] &&
        pitchers[id].find(function (p) {
          return p.active && p.idfoselectionsource === id && (!p.bettypecsv || !p.bettypecsv.length || (p.bettypecsv &&
              ((tab === 'REGULAR' && (p.bettypecsv.includes('S') || p.bettypecsv.includes('A'))) ||
              (tab === 'RR' && p.bettypecsv.some(function (bt) {
                return bt === 'A' || bt.slice(0, 1) === 'C'
              })))
            ))
        })
      derivative = derivative || {}
    }
    if (!derivative.active && state.config.derivatives.buyPoints.enabled) {
      let buyPoints = state.derivatives.buyPoints.derived
      derivative = buyPoints && buyPoints[id] &&
        buyPoints[id].find(function (p) {
          return p.active && p.idfoselectionsource === id && (!p.bettypecsv || !p.bettypecsv.length || (p.bettypecsv &&
              ((tab === 'REGULAR' && (p.bettypecsv.includes('S') || p.bettypecsv.includes('A'))) ||
              (tab === 'RR' && p.bettypecsv.some(function (bt) {
                return bt === 'A' || bt.slice(0, 1) === 'C'
              })))
            ))
        })
      derivative = derivative || {}
    }
    return derivative
  },
  getDerivativeId: (state, getters) => (id) => {
    var derivative = getters.getDerivative(id)
    return derivative && derivative.idfoselection
  },
  getSourceIdForDerivedSelection: (state) => (id) => {
    // console.log('getSourceIdForDerivedSelection: ' + id + ' (' + typeof id + ')')
    var sourceId = state.derivatives.pitchers.sourceMap[id] || state.derivatives.buyPoints.sourceMap[id] || id
    // console.log('sourceId: ' + sourceId)
    return sourceId
  },
  getSourceIdForTeaserSelection: (state) => (data) => {
    console.log('getSourceIdForTeaserSelection')
    for (var i in state.derivatives.teasers.T[data[0]]) {
      if (state.derivatives.teasers.T[data[0]][i].idfoselection === data[1]) {
        return parseFloat(i)
      }
    }
    return null
  },
  buyPoints (state) {
    return state.derivatives.buyPoints
  },
  getBuyPointsSelectionsById: (state) => (id, tab) => {
    // console.log('getBuyPointsSelectionsById for (' + tab + ')')
    let buyPointsSelections = state.derivatives.buyPoints.derived[id] || []

    var filtered = buyPointsSelections.filter(function (p) {
      // console.log('filter')
      // console.log(p)
      return !p.bettypecsv || !p.bettypecsv.length || (p.bettypecsv &&
          ((tab === 'REGULAR' && (p.bettypecsv.includes('S') || p.bettypecsv.includes('A'))) ||
          (tab === 'RR' && p.bettypecsv.some(function (bt) {
            return bt === 'A' || bt.slice(0, 1) === 'C'
          })))
        )
    })
    return filtered
  },
  bsCalculation: (state, getters) => (forPlacement) => {
    // console.log('bsCalculation, forPlacement:', forPlacement)
    // forPlacement = true
    var calculation = {}
    var betSlip = {Bets: []}
    var bt
    var btName
    var btObj
    var potentialReturn
    var unitCount
    var stake
    var winStake
    var totalStake
    var totalReturn
    var winning
    var s
    var selection
    var selections
    var teaserGroup
    var tt
    var allowedBetTypesAndReturns4T
    var betTypeCnt = []
    var allowedMultiSingles = getters.allowedMultiSingles
    var selectionsNo = getters.selectionsNo
    //
    var tab = state.tab
    var stakes = state.betTypeStakes[tab]
    var allowedBetTypesAndReturns = state.allowedBetTypesAndReturns[tab]
    //
    var isSGMenabled = getters.isSGMenabled
    var xpInbound = []
    calculation.tab = tab
    // calculation.stakes = stakes
    calculation.allowedBetTypesAndReturns = allowedBetTypesAndReturns
    //
    var promotionsEnabled = getters.isLoggedIn && getters.promotionsEnabled
    var promotionPayload = []
    var promotionItem
    var promotionSelections = []
    var fetchAgain = false
    var promotionTeaserGroup = []
    //
    var createBet = function (bt, sourceId, iDFOBetType, btObj, stake, btName, selections, isTeaser, sportType) {
      // console.log('createBet; iDFOBetType', iDFOBetType, '; btName:', btName)
      if (bt && btObj && stake >= 0) {
        // console.log(bt)
        unitCount = btObj.UnitCount
        winStake = stake * 1
        totalStake = stake * unitCount
        potentialReturn = btObj.PotentialReturn
        totalReturn = winStake * potentialReturn
        winning = totalReturn - totalStake
        //
        promotionSelections = !forPlacement ? selections : selections.map(function (s) {
          return s.idfoselection
        })
        promotionItem = [totalStake.toFixed(2), parseFloat(totalReturn.toFixed(8)), iDFOBetType, promotionSelections.join(',')]
        promotionPayload.push(promotionItem.join(','))
        //
        betSlip.Bets.push({
          'BetLegs': selections,
          'totalReturn': parseFloat(totalReturn.toFixed(2)),
          'winning': parseFloat(winning.toFixed(2)),
          'IDFOBetType': iDFOBetType,
          'BetTypeName': btName,
          'IDFOMultiRacePool': null,
          'IsPool': false,
          'TotalStake': parseFloat(totalStake.toFixed(2)),
          'WinStake': parseFloat(winStake.toFixed(2)),
          'UnitCount': unitCount,
          'PlaceStake': null,
          'ShowStake': null,
          'SportType': sportType,
          'isTeaser': isTeaser && sportType,
          'price': parseFloat(potentialReturn.toFixed(2))
        })
      }
    }
    //
    if (tab === 'TEASER') {
      var mixedTeasers = state.config.derivatives.teasers.mixed
      var teaserGroups = state.derivatives.teasers.teaserGroups
      for (var st in allowedBetTypesAndReturns) {
        if ((mixedTeasers && st === 'MIXED') || (!mixedTeasers && st !== 'MIXED')) {
          allowedBetTypesAndReturns4T = allowedBetTypesAndReturns[st]
          if (allowedBetTypesAndReturns4T && allowedBetTypesAndReturns4T.PotentialReturns &&
            allowedBetTypesAndReturns4T.PotentialReturns.PerBetType &&
            allowedBetTypesAndReturns4T.PotentialReturns.PerBetType.A) {
            bt = 'A'
            tt = 'T'
            btObj = allowedBetTypesAndReturns4T.PotentialReturns.PerBetType[bt]
            if (btObj) {
              betTypeCnt.push(bt)
            }
            let iDFOBetType = (btObj && btObj.IDFOBetType) || bt
            stake = (stakes && stakes[st] && stakes[st].PerBetType && stakes[st].PerBetType[bt])
            if (typeof stake === 'number' && stake >= 0) {
              fetchAgain = true
              promotionTeaserGroup.push(st)
              teaserGroup = teaserGroups.find(g => g.idFoSport === st)
              //
              selections = []
              if ((promotionsEnabled || forPlacement) && teaserGroup && teaserGroup.Selections) {
                tt = teaserGroup && teaserGroup.selectedTeaser
                for (s = 0; s < teaserGroup.Selections.length; s++) {
                  selection = getters.getTeaserSelections4AbtnrById(tt, teaserGroup.Selections[s].IDFOSelection)
                  if (selection && selection.idfoselection) {
                    selections.push(selection)
                  }
                }
                if (forPlacement) {
                  selections = fixedOdds.getSelectionsMappedToBetLegs(selections, 'A')
                } else {
                  selections = selections.map(function (s) {
                    return s.idfoselection
                  })
                }
              }
              //
              btName = allowedBetTypesAndReturns4T.AllowedBetTypes.find(b => b.IDFOBetType === bt)
              btName = btName && btName.Name
              btName += '-' + tt
              //
              createBet(bt, null, iDFOBetType, btObj, stake, btName, selections, tt, st)
            }
          }
        }
      }
    } else {
      if (isSGMenabled && tab === 'REGULAR') {
        // console.log('isSGMenabled')
        var abtnrXP = state.allowedBetTypesAndReturns.XP
        var sgmEvents = []
        var sgmEvents4Promotions = []
        // xpInbound = []
        // for (var provider in abtnrXP) {
        sgmEvents = abtnrXP.PerEvent || []
        // sgmEvents.forEach(function (e) {
        for (let e in sgmEvents) {
          // var sgmEvent = abtnrXP[provider].SGP.PerEvent[e]
          var sgmEvent = sgmEvents[e]
          let provider = sgmEvent.provider
          if (sgmEvent.Price) {
            // console.log('sgmEvent:')
            // console.log(sgmEvent)
            stake = state.betTypeStakes.XP.PerEvent[e]
            if (typeof stake === 'number' && stake >= 0) {
              sgmEvents4Promotions.push(e)
              fetchAgain = true
              bt = sgmEvent.IDFOBetType
              // btObj = sgmEvent.PotentialReturns.PerBetType.SGP
              btObj = {
                PotentialReturn: sgmEvent.PotentialReturn || 0,
                TotalStake: 1,
                UnitCount: 1,
                IDFOBetType: sgmEvent.IDFOBetType,
                IDFOPriceType: sgmEvent.IDFOPriceType
              }
              btName = 'SGP'
              selections = []
              if (forPlacement || promotionsEnabled) {
                selections = getters.sgmSelectionsByEvent(sgmEvent.Legs)
              }
              if (forPlacement) {
                let isSGP = true
                selections = fixedOdds.getSelectionsMappedToBetLegs(selections, bt, null, sgmEvent.IDFOPriceType, [], isSGP)
                // console.log('SGM-selections:', selections)
                //
                xpInbound.push({'Provider': provider, 'Bet': sgmEvent})
              } else {
                selections = selections.map(function (s) {
                  return s.idfoselection
                })
              }
              createBet(bt, null, bt, btObj, stake, btName, selections)
            }
          }
        }
        // }
      }
      //
      if (allowedBetTypesAndReturns.PotentialReturns) {
        if (allowedBetTypesAndReturns.PotentialReturns.PerBetType) {
          for (bt in allowedBetTypesAndReturns.PotentialReturns.PerBetType) {
            btObj = allowedBetTypesAndReturns.PotentialReturns.PerBetType[bt]
            // console.log('btObj:')
            // console.log(btObj)
            if (btObj) {
              betTypeCnt.push(bt)
            }
            let isSgpA = btObj && btObj.isSgpA
            let iDFOBetType = (btObj && btObj.IDFOBetType) || bt
            stake = (stakes && stakes.PerBetType && stakes.PerBetType[bt])
            if (typeof stake === 'number' && stake >= 0) {
              let selectionsFO = getters.getSelections4Calculation(tab)
              fetchAgain = true
              btName = allowedBetTypesAndReturns.AllowedBetTypes.find(b => b.IDFOBetType === bt)
              btName = btName && btName.Name
              selections = []
              let selectionsXP = []
              // let xpInboundPlus = null
              if (forPlacement || promotionsEnabled) {
                // let selectionsFO = getters.getSelections4Calculation(tab)
                if (isSgpA) {
                  // console.log('bet isSgpA')
                  let inXpInb = xpInbound.map(xp => xp.Bet.Entity)
                  let abtnrXP = state.allowedBetTypesAndReturns.XP
                  let sgmEvents = abtnrXP.PerEvent || []
                  // console.log('sgmEvents:', sgmEvents)
                  let provider = null
                  for (let e in sgmEvents) {
                    // var sgmEvent = abtnrXP[provider].SGP.PerEvent[e]
                    let sgmEvent = sgmEvents[e]
                    // let provider = sgmEvent.provider
                    if (sgmEvent.Price) {
                      // console.log('sgmEvent:', sgmEvent)
                      selectionsXP = selectionsXP.concat(getters.sgmSelectionsByEvent(sgmEvent.Legs))
                      provider = sgmEvent.provider
                      if (!inXpInb.includes(sgmEvent.Entity)) {
                        xpInbound.push({'Provider': provider, 'Bet': sgmEvent})
                        inXpInb.push(sgmEvent.Entity)
                      }
                    }
                  }
                }
                let selectionsXPids = selectionsXP.map(s => s.idfoselection)
                selections = selectionsXP.concat(selectionsFO.filter(s => !selectionsXPids.includes(s.idfoselection)))
                // console.log('selectionsFO:', selectionsFO)
                // console.log('selectionsXP:', selectionsXP)
                // console.log('selectionsXPids:', selectionsXPids)
                // console.log('selections:', selections)
                //
              }
              if (forPlacement) {
                let selectionsXPids = []
                let isSGP = false
                // selections = getters.getSelections4Calculation(tab, null, true)
                selections = fixedOdds.getSelectionsMappedToBetLegs(selections, bt, null, null, selectionsXPids, isSGP, isSgpA)
              } else {
                selections = selections.map(function (s) {
                  return s.idfoselection
                })
              }
              if (forPlacement && xpInbound && xpInbound.length) {
                let provider = xpInbound[0].Provider
                let xpCalculations = state.allowedBetTypesAndReturns.XP[provider].calculation
                // console.log('xpCalculations:', xpCalculations)
                xpInbound.forEach(xp => {
                  xp.Bet = xpCalculations.Bets.find(bet => bet.Entity === xp.Bet.Entity)
                })
                // console.log('xpInbound:', xpInbound)
                // console.log('state.allowedBetTypesAndReturns.XP:', state.allowedBetTypesAndReturns.XP)
              }
              createBet(bt, null, iDFOBetType, btObj, stake, btName, selections)
            }
          }
        }
        //
        // console.log('Calculate Singles')
        if (tab === 'REGULAR' && allowedBetTypesAndReturns.PotentialReturns.PerSelection && (allowedMultiSingles || (!allowedMultiSingles && selectionsNo === 1))) {
          for (var id in allowedBetTypesAndReturns.PotentialReturns.PerSelection) {
            btObj = allowedBetTypesAndReturns.PotentialReturns.PerSelection[id]
            if (btObj) {
              betTypeCnt.push(id)
            }
            var sourceId = parseFloat(getters.getSourceIdForDerivedSelection(id))
            stake = (stakes && stakes.PerSelection && stakes.PerSelection[sourceId])
            if (typeof stake === 'number' && stake >= 0) {
              fetchAgain = true
              selections = [id]
              if (forPlacement) {
                selections = getters.getSelections4Calculation(tab, sourceId, true)
                selections = fixedOdds.getSelectionsMappedToBetLegs(selections, 'S')
              }
              btName = (btObj && btObj.BetTypeName) || 'Straight'
              let iDFOBetType = (btObj && btObj.BetType) || 'S'
              createBet(id, sourceId, iDFOBetType, btObj, stake, btName, selections)
            }
          }
        }
      }
    }
    //
    calculation.betTypeCnt = betTypeCnt
    calculation.betSlip = betSlip
    calculation.xpInbound = xpInbound
    calculation.promotionPayload = {
      payload: promotionPayload,
      isTeaser: tab === 'TEASER',
      fetchAgain: fetchAgain,
      tab: tab,
      teaserGroup: promotionTeaserGroup,
      sgmEvents: sgmEvents4Promotions || [],
      isSGM: !!(sgmEvents4Promotions && sgmEvents4Promotions.length)
    }
    //
    return calculation
  },
  allowedReturnsXPperEvent: (state) => (e) => {
    // console.log('allowedReturnsXPperEvent')
    let calculation = state.allowedBetTypesAndReturns && state.allowedBetTypesAndReturns.XP && state.allowedBetTypesAndReturns.XP.calculation
    let bets = (calculation && calculation.Bets) || []
    // calculation = Array.isArray(calculation) ? calculation : [calculation]
    // console.log('calculation:', calculation)
    let sgp = bets.find(function (bet) {
      return bet && bet.Price && bet.Entity === e.toString()
      // return item.Bets && item.Bets[0] && item.Bets[0].Price && item.Bets[0].Entity === e.toString()
    })
    let price = (sgp && sgp.Price) || 0
    price = price ? parseFloat(price) : price
    // console.log('allowedReturnsXPperEvent price:', price)
    return price
  },
  sgmSelectionsByEvent: (state, getters) => (legs) => {
    // console.log('sgmSelectionsByEvent')
    var sgmSelections = []
    var legsOK = {}
    legs.forEach(function (leg) {
      if (leg.Status === 'OK') {
        let sourceSelection = getters.getSourceIdForDerivedSelection(leg.Selection)
        legsOK[sourceSelection || leg.Selection] = leg
      }
    })

    state.betslipSelections.forEach(function (s) {
      if (legsOK[s.idfoselection]) {
        var sgms = JSON.parse(JSON.stringify(s))
        sgms.currentpriceup = legsOK[s.idfoselection].PriceUp
        sgms.currentpricedown = legsOK[s.idfoselection].PriceDown
        sgms.priceTypeSGP = legsOK[s.idfoselection].IDFOPriceType
        sgmSelections.push(sgms)
      }
    })
    // console.log('sgmSelectionsByEvent:', sgmSelections)
    return sgmSelections
  },
  sgmSelectionsInfo: (state, getters) => (selections) => {
    // console.log('sgmSelectionsInfo')
    var infos = []
    // if (getters.isSGMenabled && !getters.sgmPlusAvailableonTabs.includes(getters.tab)) { return infos }
    selections = selections || []
    //
    // if (selections.length < 2) { return null }
    //
    infos = selections.map(function (s) {
      return {
        'IDFOSelection': s.idfoselection, // Not Requested By Method
        'PriceTypes': (s.csvpricetypes && s.csvpricetypes.join(',')) || s.pricetypecsv,
        'IDFOEvent': s.idfoevent
      }
    })
    return infos
  },
  betPlacementResponse (state) {
    return state.attemptedBetSlip.response
  },
  inRefferal (state) {
    return state.attemptedBetSlip.inRefferal
  },
  inRunningDelay (state) {
    return state.attemptedBetSlip.inRunningDelay
  },
  siteCreditBalance (state, getters) {
    var walletBalances = getters.walletBalances
    let balance = walletBalances && walletBalances.balances && walletBalances.balances.filter(balance => balance.type === 'RM')
    return (balance && balance[0] && balance[0].amount) || 0
  },
  totalCacheBalance (state, getters, rootState) {
    var externalWalletBalances = rootState.externalWalletBalance
    let balance = externalWalletBalances && externalWalletBalances.balances && externalWalletBalances.balances.filter(balance => balance.type === 'RM')
    return (balance && balance[0] && balance[0].amount) || 0
  },

  walletBalances (state, getters, rootState, rootGetters) {
    // console.log('walletBalances')
    return rootGetters.getWalletBalance
  },
  siteTradingBalanceSHW (state, getters) {
    // console.log('siteTradingBalanceSHW')
    var walletBalances = getters.walletBalances
    var balance = walletBalances && walletBalances.filter((wallet) => wallet.IDMMAccountClass === 'CREDIT')[0]
    return balance.TradingBalance || null
  },
  tradingBalance (state, getters, rootGetters) {
    // console.log('tradingBalance')
    if (config.walletParams.providerCode === 'SHW') {
      return getters.siteTradingBalanceSHW
    } else {
      return getters.siteCreditBalance + getters.totalCacheBalance
    }
    /*
    // console.log('getters tradingBalance')
    var externalWalletBalances = rootGetters.externalWalletBalance
    // var externalWalletBalances = getters.externalWalletBalance
    var externalWalletBalance = (externalWalletBalances && externalWalletBalances.balances && externalWalletBalances.balances.find(balance => balance.Type === config.externalWalletParams.balanceCash)) || {}
    // console.log('externalWalletBalance:')
    // console.log(externalWalletBalance)
    var bonusWalletBalance = (externalWalletBalances && externalWalletBalances.balances && externalWalletBalances.balances.find(balance => balance.Type === config.externalWalletParams.balanceBonus)) || {}
    // console.log('bonusWalletBalance:')
    // console.log(bonusWalletBalance)
    var tradingBalance = (externalWalletBalance.Balance || 0) + (bonusWalletBalance.Balance || 0)
    return tradingBalance
    */
  },
  minStake (state) {
    return state.stakeLimits.min
  },
  maxStake (state) {
    return state.stakeLimits.max
  },
  gracePeriod (state) {
    return state.attemptedBetSlip.gracePeriod
  },
  gracePeriodTimedOut (state) {
    return state.gracePeriodTimedOut
  },
  dismissErrorFromSelection (state) {
    return state.dismissErrorFromSelection
  },
  isSelectionLive: (state, getters) => (id) => {
    return getters.liveSelections.indexOf(id) > -1
  },
  getUnitCount: (state, getters) => (betTypeId) => {
    var tab = state.tab
    var perBetType = typeof betTypeId === 'number' ? 'PerSelection' : 'PerBetType'
    var allowedBetTypesAndReturns = state.allowedBetTypesAndReturns[tab].PotentialReturns[perBetType]
    return allowedBetTypesAndReturns[betTypeId] || 1
  },
  sgpMarkAsNew (state) {
    return state.config.SGM.display.sgpMarkAsNew
  },
  sgpShowProviderDetailedError (state) {
    return state.config.SGM.display.showProviderDetailedError
  },
  sgpPlusMarkAsNew (state) {
    return state.config.SGMplus.display.sgpMarkAsNew
  },
  sgpSelectionHideBreakpoint (state) {
    return state.config.SGM.display.selectionHideBreakpoint
  },
  isFastBetEnabled (state) {
    // console.log('isFastBetEnabled')
    return state.config.isFastBetEnabled
  },
  popBetSlipOn1stSelection (state) {
    return state.config.popBetSlipOn1stSelection
  },
  rememberSingleBetSlipStake (state) {
    return state.fastBetSlip.rememberSingleBetSlipStake
  },
  singleBetSlipStake (state) {
    return state.fastBetSlip.stake
  },
  mobileFeedback (state) {
    return state.config.mobileFeedback
  },
  allowedReturnsPRL (state) {
    if (state.tab === 'TEASER') {
      return {}
    }
    return state.allowedBetTypesAndReturns[state.tab].PotentialReturns.PerBetType.A
  },
  allowedReturnsSGP (state) {
    // console.log('allowedReturnsSGP')
    let calculation = state.allowedBetTypesAndReturns && state.allowedBetTypesAndReturns.XP && state.allowedBetTypesAndReturns.XP.calculation
    calculation = calculation || []
    calculation = Array.isArray(calculation) ? calculation : [calculation]
    // console.log('calculation:', calculation)
    let sgp = calculation.find(function (item) {
      return item.Bets && item.Bets[0] && item.Bets[0].Price
    })
    let price = (sgp && sgp.Bets[0].Price) || 0
    price = price ? parseFloat(price) : price
    return price
  },
  placeAsync (state) {
    return state.config.placeAsync
  },
  calculateAsync (state) {
    return state.config.calculateAsync
  },
  useXPBettingService (state) {
    return state.config.useXPBettingService
  },

  promotionsEnabled (state) {
    return state.config.promotions.enabled
  },
  promotionsData (state) {
    return state.promotionsData
  },
  voucherDiscountAmount (state) {
    return state.voucherDiscountAmount
  },
  isLoggedIn (state, getters, rootState, rootGetters) {
    return rootGetters['isLoggedIn']
  },
  promotionsPayload: (state, getters, rootState, rootGetters) => (betSlip) => {
    var payload = []
    var tab = state.tab
    var isTeaser = false
    var teaserGroup = []
    var fetchAgain = false
    //
    // console.log('fetchPromotions for tab: ' + tab)
    if (!state.promotions.enabled || !rootGetters['isLoggedIn']) {
      return {payload: payload, isTeaser: isTeaser, fetchAgain: fetchAgain, tab: tab, teaserGroup: teaserGroup}
    }
    return {payload: payload, isTeaser: isTeaser, fetchAgain: fetchAgain, tab: tab, teaserGroup: teaserGroup}
  },
  betslipCheckboxesForSelections (state) {
    return state.config.BETSLIP_CHECKBOXES
  },
  teasersPriceTypes (state) {
    return state.config.derivatives.teasers.priceTypes
  },
  showStatusToConfirm (state) {
    return state.config.showStatusToConfirm
  },
  getStatusToConfirm: (state, getters) => (id, teaserGroupId) => {
    // console.log('getStatusToConfirm for: ' + id)
    if (state.currentBetSlipState !== 6) {
      return false
    }
    if (!state.config.showStatusToConfirm.forReferred && !state.config.showStatusToConfirm.forAcceptable) {
      return false
    }
    let tab = state.tab
    // state.attemptedBetSlip.response
    if (state.currentBetSlipState !== 6) {
      return false
    }
    if (!state.config.showStatusToConfirm.forAcceptable && !state.attemptedBetSlip.inRefferal) {
      return false
    }
    //
    let index = -1
    let attemptedBet = state.attemptedBetSlip &&
      state.attemptedBetSlip.betSlip &&
      state.attemptedBetSlip.betSlip.betSlip &&
      state.attemptedBetSlip.betSlip.betSlip.betSlip &&
      state.attemptedBetSlip.betSlip.betSlip.betSlip.Bets &&
      state.attemptedBetSlip.betSlip.betSlip.betSlip.Bets.find(function (b, i) {
        let condition = false
        if (typeof id === 'number') {
          condition = b.IDFOBetType === 'S' && b.BetLegs && b.BetLegs[0] && b.BetLegs[0].IDFOSelection === id
        } else {
          condition = b.IDFOBetType === id || (id === 'A' && b.IDFOBetType.indexOf('A-') === 0)
        }
        if (tab === 'TEASER') {
          condition = condition && b.isTeaser === teaserGroupId
        }
        if (condition) {
          index = i
        }
        return condition
      })

    if (!attemptedBet || (attemptedBet && !attemptedBet.TotalStake)) {
      return false
    }

    let bet = index > -1 ? state.attemptedBetSlip &&
      state.attemptedBetSlip.response &&
      state.attemptedBetSlip.response.Bets &&
      state.attemptedBetSlip.response.Bets[index]
      : state.attemptedBetSlip &
      state.attemptedBetSlip.response &&
      state.attemptedBetSlip.response.Bets &&
      state.attemptedBetSlip.response.Bets.find(function (b) {
        return b.IDFOBetType === id || (id === 'A' && b.IDFOBetType.indexOf('A-') === 0)
      })

    let potentialReturn = bet && bet.PotentialReturn
    if (!potentialReturn) {
      return 'Rejected'
    }
    if (potentialReturn) {
      if (attemptedBet && attemptedBet.totalReturn && attemptedBet.totalReturn !== potentialReturn &&
        bet && bet.TotalStake && attemptedBet.TotalStake && attemptedBet.TotalStake !== bet.TotalStake) {
        return 'Reoffered'
      }
    }
    // return 'Accepted'
    return state.attemptedBetSlip.inRefferal ? 'Accepted' : false
  },
  preserveFastBetStakeForMain (state) {
    return state.config.fastBetSlip.preserveStakeForMain
  },
  isBBenabled (state) {
    return state.isBBenabled
  },
  defaultActiveLevelByGroup (state) {
    return state.config.derivatives.teasers.defaultActiveLevel
  },
  recalculateDelay (state) {
    return state.config.recalculate.delay
  },
  recalculateAttempts (state) {
    return state.config.recalculate.attempts
  },
  recalculateAttempt (state) {
    return state.recalculateAttempt
  },
  showEventTsStart (state) {
    return state.config.showEventTsStart
  },
  showEventTsInBetHistory (state) {
    return state.config.showEventTsInBetHistory
  },
  slipTotalStakeMin (state) {
    return state.slipTotalStakeMin
  },
  totalBetSlipMinUnit (state) {
    return state.totalBetSlipMinUnit
  },
  sgpPriceTypes (state) {
    return state.config.sgpPriceTypes
  },
  specialOffersEnabled (state) {
    return !true
  },
  specialOffersBcEnabled (state) {
    return state.config.specialOffers.enabled
  },
  specialOffersIds (state) {
    return state.config.specialOffers.ids
  },
  specialOffersBc (state) {
    return state.config.specialOffers
  },
  activeSelections: (state, getters) => (tab) => {
    // console.log('get activeSelections')
    let selections = []
    let betslipSelectionIds = getters.betslipSelectionIdsByTab(tab)
    for (let id of betslipSelectionIds) {
      let derivative = getters.getDerivative(id, tab)
      selections.push(derivative && derivative.idfoselection ? derivative : getters.getStoredSelectionById(id))
    }
    return selections
  },
  storePlacedBetEvents (state) {
    return state.config.storePlacedBetEvents
  },
  placedBetsOnEvents (state) {
    return state.placedBetsOnEvents
  },
  hasBetPlacedOnEvent: (state, getters, rootState, rootGetters) => (id) => {
    // console.log('hasBetPlacedOnEvent:', id)
    var accountDetails = rootGetters['getCustomerContext']
    var creditAccountDetails = accountDetails && accountDetails.Balances && accountDetails.Balances.find(item => item.Key === 'CREDIT')
    var accountNumber = creditAccountDetails && creditAccountDetails.AccountNumber
    if (accountNumber) {
      // var now = new Date().getTime()
      var ts = (state.placedBetsOnEvents && state.placedBetsOnEvents[accountNumber] && state.placedBetsOnEvents[accountNumber][id]) || 0
      // var dt = ts && (now - ts)
      // return dt && dt < state.clearEventsOlderThan && ts
      // console.log('hasBetPlacedOnEvent:', id, ':', ts)
      return ts
    }
    return 0
  }
}

export default getters
