const tabMap = {
  'REGULAR': 'Standard',
  'TEASER': 'Teaser',
  'RR': 'Round Robin'
}

const actions = {
  dispatchGTM (context, data) {
    // console.log('dispatchGTM: ' + data.method)
    if (context.state.config.isGTMenabled) {
      context.dispatch(data.method, data.data)
    }
  },
  processSelectionsForGTMaddRem (context) {
    // console.log('processSelectionsForGTMaddRem')
    var inPlay = false
    var sportsArr = []
    var betArray = []
    var n = context.state.betslipSelections.length
    if (n) {
      context.state.betslipSelections.forEach(function (selection) {
        // let id = context.getters.getSourceIdForDerivedSelection(selection.idfoselection)
        let id = selection.idfoselection
        var idfosporttype = selection.idfosporttype
        if (sportsArr.indexOf(idfosporttype) === -1) {
          sportsArr.push(idfosporttype)
        }
        if (context.getters.isSelectionLive(id)) {
          inPlay = true
        }
        //
        var market = context.getters.getStoredMarketById(id) || {}
        var obj = {
          'selectionName': selection.name,
          'marketName': market.name,
          'eventName': market.eventname,
          'competition': selection.sportname || selection.idfosport || undefined,
          'sport': selection.fosporttypename || selection.idfosporttype || undefined,
          'selectionId': selection.idfoselection.toString(),
          'marketId': market.idfomarket.toString(),
          'eventId': market.idfoevent.toString()
        }
        betArray.push(obj)
      })
    }
    // return sportsArr.join(',')
    return {
      'betCount': n,
      'inPlay': inPlay,
      'sportsArr': sportsArr,
      'betArray': betArray
    }
  },

  processSelectionsForGTM (context, betSlipData) {
    // console.log('processSelectionsForGTM')
    // console.log('betslipdata', betSlipData)
    var betTypeObj = (betSlipData && betSlipData.betTypeObj) || {}
    let isFastBet = betSlipData.isFastBet || betTypeObj.isFastBet
    var inPlayBetSlip = false
    var betCount = 0
    var sportsArr = []
    var betArray = []
    var betArrayIntegerNumbers = []
    var multiBetArray = []
    var multiBetArrayIntegerNumbers = []
    let teaserBetTypes = context.getters.teasersPriceTypes
    let selectionsCount = []
    let betType = 'N/A'
    //
    var tab = betSlipData.tab || betTypeObj.tab
    var odds = context.getters['allowedBetTypesAndReturns'] || {}
    odds = odds[tab] // && odds[tab].PotentialReturns
    var potentialReturn = 0
    var totalStake = 0
    var potentialReturns = context.getters['returns'] || {}
    var potentialReturnsXP = (potentialReturns.XP && potentialReturns.XP.PerEvent) || {}
    var tab4Winning = isFastBet ? 'REGULAR' : tab
    if (potentialReturns && potentialReturns[tab4Winning]) {
      potentialReturns = potentialReturns[tab4Winning]
    }
    //
    var payloadBets = betSlipData && betSlipData.payload && betSlipData.payload.Bets
    var resultBets = betSlipData && betSlipData.result
    resultBets = (resultBets && resultBets.result) || resultBets
    resultBets = resultBets && resultBets.Bets
    //
    var betSlipBets = resultBets || payloadBets ||
      (betSlipData && betSlipData.betSlip && betSlipData.betSlip.betSlip && betSlipData.betSlip.betSlip.Bets) ||
      (betSlipData && betSlipData.betSlip && betSlipData.betSlip.betSlip && betSlipData.betSlip.betSlip.betSlip && betSlipData.betSlip.betSlip.betSlip.Bets) || []
    //
    payloadBets = payloadBets || []
    resultBets = resultBets || []
    //
    let betTypeStakes = betSlipData.payload ? {} : betTypeObj && betTypeObj.betTypeStakes && betTypeObj.betTypeStakes[tab] && betTypeObj.betTypeStakes[tab].PerSelection
    betTypeStakes = betTypeStakes || {}
    //
    var floatVal = function (val) {
      val = val || 0
      if (isNaN(val)) {
        val = 0
      }
      val = parseFloat(val).toFixed(2) * 1
      return val
    }
    //
    var compileSelectionArray = function (bet, xtremepush = false) {
      var selectionArray = []
      let isMultiBet = bet.BetLegs.length > 1
      bet.BetLegs.forEach(function (leg) {
        let id = leg.IDFOSelection
        if (selectionsCount.indexOf(id) < 0) {
          selectionsCount.push(id)
        }
        let idSource = context.getters.getSourceIdForDerivedSelection(leg.IDFOSelection)
        if (teaserBetTypes.indexOf(leg.IDFOPriceType) > -1) {
          idSource = context.getters.getSourceIdForTeaserSelection([leg.IDFOPriceType, id]) || id
        }
        if (betSlipData.payload && bet.IDFOBetType === 'S') {
          betTypeStakes[id] = bet.TotalStake
        }
        //
        let selection = context.getters.getStoredSelectionById(idSource, isFastBet)
        let inPlay = false
        // let id = context.getters.getSourceForDerivedSelection(selection.idfoselection)
        var idfosporttype = selection.idfosporttype
        if (sportsArr.indexOf(idfosporttype) === -1) {
          sportsArr.push(idfosporttype)
        }
        if (context.getters.isSelectionLive(idSource)) {
          inPlay = true
          inPlayBetSlip = true
        }
        let market = context.getters.getStoredMarketById(idSource) || {}
        //
        let legData = {
          'sport': idfosporttype,
          'inPlay': inPlay,
          'eventId': xtremepush ? market.idfoevent : market.idfoevent.toString(),
          'selectionName': selection.name,
          'marketName': market.name,
          'eventName': market.eventname
        }
        if (!xtremepush) {
          legData.selectionId = id.toString()
          legData.eventName = market.eventname
          legData.competition = market.sportname || market.idfosport || undefined
          legData.marketId = market.idfomarket && market.idfomarket.toString()
        }
        if (!isMultiBet) {
          legData.odds = (odds.PotentialReturns.PerSelection[idSource] && odds.PotentialReturns.PerSelection[idSource].PotentialReturn) ||
            (odds.PotentialReturns.PerSelection[id] && odds.PotentialReturns.PerSelection[id].PotentialReturn)
          if (bet.PotentialReturn) {
            legData.potentialReturn = bet.PotentialReturn
          } else {
            legData.potentialReturn = potentialReturns && potentialReturns.PerSelection && (potentialReturns.PerSelection[idSource] || potentialReturns.PerSelection[id])
            legData.potentialReturn = legData.potentialReturn || 0
            legData.potentialReturn += bet.TotalStake || 0
          }
          legData.potentialReturn = floatVal(legData.potentialReturn)
          potentialReturn += legData.potentialReturn * 1
          legData.potentialReturn = xtremepush ? legData.potentialReturn : legData.potentialReturn.toString()
          legData.odds = xtremepush ? legData.odds : legData.odds.toString()
        }
        selectionArray.push(legData)
      })
      return selectionArray
    }
    //
    betSlipBets.forEach(function (bet, index) {
      if (bet.TotalStake) {
        betCount++
        let isMultiBet = bet.BetLegs.length > 1
        let isSGM = isMultiBet && bet.BetLegs && bet.BetLegs[0] && bet.BetLegs[0].IDFOPriceType === 'SGM' &&
          (bet.BetLegs[0].IDFOEvent || (payloadBets[index] && payloadBets[index].BetLegs && payloadBets[index].BetLegs[0] && payloadBets[index].BetLegs[0].IDFOEvent))
        // console.log('isMultiBet: ' + isMultiBet)
        let selectionArray = compileSelectionArray(bet)
        let selectionArrayInt = compileSelectionArray(bet, true) // xtremepush requested numbers as numeric
        totalStake += bet.TotalStake * 1
        betType = bet.BetTypeName || (payloadBets[index] && payloadBets[index].BetTypeName) || bet.IDFOBetType
        var betData = {
          'betId': bet.IDFOBet ? bet.IDFOBet.toString() : undefined,
          'betType': bet.BetTypeName || (payloadBets[index] && payloadBets[index].BetTypeName) || bet.IDFOBetType,
          'legNumber': bet.BetLegs && bet.BetLegs.length ? bet.BetLegs.length.toString() : '0',
          'betAmount': floatVal(bet.TotalStake).toString(),
          'multibet': isMultiBet,
          'selectionArray': selectionArray
        }
        let betDataInt = { // xtremepush part
          'betId': bet.IDFOBet ? parseFloat(bet.IDFOBet) : undefined,
          'multibet': isMultiBet
        }
        // console.log('betData:', betData)
        // console.log(betData)
        //
        if (isMultiBet) {
          betDataInt.selectionArray = selectionArrayInt
          if (isSGM) {
            betData.odds = context.getters['allowedReturnsXPperEvent'](isSGM)
            betDataInt.odds = context.getters['allowedReturnsXPperEvent'](isSGM)
          } else {
            if (bet.isTeaser) {
              betData.odds = odds && odds[bet.isTeaser] && odds[bet.isTeaser].PotentialReturns &&
                odds[bet.isTeaser].PotentialReturns.PerBetType &&
                odds[bet.isTeaser].PotentialReturns.PerBetType[bet.IDFOBetType] &&
                odds[bet.isTeaser].PotentialReturns.PerBetType[bet.IDFOBetType].PotentialReturn
              betDataInt.odds = odds && odds[bet.isTeaser] && odds[bet.isTeaser].PotentialReturns &&
                odds[bet.isTeaser].PotentialReturns.PerBetType &&
                odds[bet.isTeaser].PotentialReturns.PerBetType[bet.IDFOBetType] &&
                odds[bet.isTeaser].PotentialReturns.PerBetType[bet.IDFOBetType].PotentialReturn
            } else {
              betData.odds = odds && odds.PotentialReturns && odds.PotentialReturns.PerBetType &&
                odds.PotentialReturns.PerBetType[bet.IDFOBetType] &&
                odds.PotentialReturns.PerBetType[bet.IDFOBetType].PotentialReturn
              betDataInt.odds = odds && odds.PotentialReturns && odds.PotentialReturns.PerBetType &&
                odds.PotentialReturns.PerBetType[bet.IDFOBetType] &&
                odds.PotentialReturns.PerBetType[bet.IDFOBetType].PotentialReturn
            }
          }
          if (bet.PotentialReturn) {
            betData.potentialReturn = bet.PotentialReturn
          } else {
            if (isSGM) {
              betData.potentialReturn = potentialReturnsXP && potentialReturnsXP[isSGM]
            } else {
              if (bet.isTeaser) {
                betData.potentialReturn = potentialReturns && potentialReturns[bet.isTeaser] &&
                  potentialReturns[bet.isTeaser].PerBetType &&
                  potentialReturns[bet.isTeaser].PerBetType[bet.IDFOBetType]
              } else {
                betData.potentialReturn = potentialReturns && potentialReturns.PerBetType && potentialReturns.PerBetType[bet.IDFOBetType]
              }
            }
            betData.potentialReturn = betData.potentialReturn || 0
            betData.potentialReturn += bet.TotalStake || 0
          }
          betData.potentialReturn = floatVal(betData.potentialReturn)
          potentialReturn += betData.potentialReturn * 1
          potentialReturn += betDataInt.potentialReturn * 1
          betData.potentialReturn = betData.potentialReturn.toString()
          betData.odds = betData.odds && betData.odds.toString()
          betDataInt.odds = betDataInt.odds && parseFloat(betDataInt.odds.toFixed(2))
          //
          multiBetArray.push(betData)
          multiBetArrayIntegerNumbers.push(betDataInt)
        } else {
          delete betData.selectionArray
          delete betDataInt.selectionArray
          for (const k in selectionArray[0]) {
            betData[k] = selectionArray[0][k]
            if (!['potentialReturn', 'selectionId', 'marketId'].includes(k)) {
              betDataInt[k] = /^\d+\.\d+$|^\d+$/.test(selectionArray[0][k]) ? parseFloat(selectionArray[0][k]) : selectionArray[0][k]
            }
          }
          betArray.push(betData)
          betArrayIntegerNumbers.push(betDataInt)
        }
        //
      }
    })
    //
    return {
      'betCount': betCount,
      'selectionsCount': selectionsCount.length,
      'inPlay': inPlayBetSlip,
      'sportsArr': sportsArr,
      'multiBetArray': multiBetArray,
      'multiBetArrayIntegerNumbers': multiBetArrayIntegerNumbers,
      'betArray': betArray,
      'betArrayIntegerNumbers': betArrayIntegerNumbers,
      'potentialReturn': potentialReturn,
      'totalStake': totalStake,
      'betType': betType
    }
  },

  sendGTMBetSuccess (context, data) {
    // console.log('sendGTMBetSuccess')
    /*
     data = {
     result,
     tab,
     isLive,
     isFastBet,
     payload
     }
     */
    // totalBetAmount - pass as float
    // betSlipTab - 'standard' or 'teaser' or 'round robin'
    // betCount - number of bets
    // betId - bet id
    // sport - if more than on sports concatenate eg ‘football, basketball , tennis’
    // inPlay - y/n - Pass y if one or more legs of the betslip contains an inplay bet
    // timeToFirstBet - seconds until first event begins
    // potentialReturn - potential return
    //
    // 'timeToFirstBet': request.timeToFirstBet,
    if (window.dataLayer || context.rootGetters.getThirdpartyAnalytics) {
      // getSportsArr(data.result.Bets)
      context.dispatch('processSelectionsForGTM', data).then(function (betData) {
        let request = {
          totalBetAmount: betData.totalStake || parseFloat(data.result.TotalStake),
          betSlipTab: data.tab,
          betCount: betData.betCount || data.result.Bets.length,
          selectionsCount: betData.selectionsCount,
          betSlipId: data.result.IDFOBetSlip,
          // betId: data.result.Bets.IDFOBet, // ? or IDFOBetSlip
          sport: betData.sportsArr.join(','),
          inPlay: data.isLive ? 'yes' : 'no',
          // timeToFirstBet: timeToFirstBet,
          firstBet: undefined, // ? 'no' : 'yes',
          potentialReturn: betData.potentialReturn || data.result.Bets.reduce((prev, next) => {
            return prev + next.PotentialReturn
          }, 0)
        }
        //
        let isFirstBet = context.rootGetters.getNumberOfBets === 0 ? 'first_bet' : 'bet'
        let sendGTMBetSuccess = {
          'event': isFirstBet,
          'gaEventCategory': isFirstBet,
          'gaEventAction': 'bet success',
          'gaEventLabel': 'bet success',
          // 'module': 'betslip',
          'module': data.isFastBet ? 'fast betslip' : 'betslip',
          'betAmount': typeof request.totalBetAmount !== 'undefined' || request.totalBetAmount ? parseFloat(request.totalBetAmount.toFixed(2)).toString() : request.totalBetAmount,
          'tab': data.isFastBet ? 'fast bet' : tabMap[request.betSlipTab],
          'betCount': request.betCount.toString(),
          // 'betCount': request.selectionsCount.toString(),
          'betSlipID': request.betSlipId ? request.betSlipId.toString() : 'N/A',
          'transactionId': request.betSlipId,
          'sport': request.sport,
          'inPlay': request.inPlay,
          'firstBet': request.firstBet,
          'potentialReturn': typeof request.potentialReturn !== 'undefined' || request.potentialReturn ? parseFloat(request.potentialReturn.toFixed(2)).toString() : request.potentialReturn,
          'betArray': betData.betArray,
          'multiBetArray': betData.multiBetArray
        }
        let xtremeObj = {
          'param1': 'event',
          'param2': context.rootGetters.getNumberOfBets === 0 ? 'first_wager_placed' : 'wager_placed',
          'param3': {
            'bet_amount': typeof request.totalBetAmount !== 'undefined' || request.totalBetAmount ? parseFloat(request.totalBetAmount.toFixed(2)) : parseFloat(request.totalBetAmount),
            'betslip_id': request.betSlipId,
            'bet_type': betData.betType,
            'potential_return': typeof request.potentialReturn !== 'undefined' || request.potentialReturn ? parseFloat(request.potentialReturn.toFixed(2)) : parseFloat(request.potentialReturn.toFixed(2)),
            'tab': data.isFastBet ? 'fast bet' : tabMap[request.betSlipTab],
            'bet_collection': betData.betArrayIntegerNumbers,
            'multi_bet_collection': betData.multiBetArrayIntegerNumbers
          }
        }
        context.dispatch('analyticsHandler', {'event': sendGTMBetSuccess, 'xtremeObj': xtremeObj}, { root: true })
        context.dispatch('sendGTMBetStatus', {'event': isFirstBet + '_success', 'data': sendGTMBetSuccess})
      })
    }
  },

  sendGTMRemoveAllSelectionsFromBetslip (context, isOnBetslipClose = false) { // isOnBetslipClose - use the same data structure to sand 'betslip_closed' event on XP console.
    if (window.dataLayer || context.rootGetters.getThirdpartyAnalytics) {
      context.dispatch('processSelectionsForGTMaddRem').then(function (data) {
        let sendGTMRemoveAllSelectionsFromBetslip = {
          'event': 'bet',
          'gaEventCategory': 'bet',
          'gaEventAction': 'removed all selections',
          'gaEventLabel': undefined,
          'module': 'betslip',
          'betAmount': undefined,
          'tab': tabMap[context.state.tab],
          'betCount': data.betCount.toString(),
          'betSlipId': undefined, // betId,
          'sport': data.sportsArr.join(','),
          'inPlay': data.inPlay ? 'y' : 'n',
          'timeToFirstBet': undefined,
          'potentialReturn': undefined,
          'betArray': data.betArray
        }
        let event = isOnBetslipClose ? 'betslip_closed' : 'all_selections_removed_from_betslip'
        let xtremeObj = {
          'param1': 'event',
          'param2': event,
          'param3': {
            'sport': data.sportsArr.join(','),
            'inPlay': data.inPlay ? 'y' : 'n',
            'tab': tabMap[context.state.tab],
            'selections': data.betArray
          }
        }
        context.dispatch('analyticsHandler', {'event': sendGTMRemoveAllSelectionsFromBetslip, 'xtremeObj': xtremeObj}, { root: true })
      })
    }
  },
  sendGTMRemoveSelectionFromBetslip (context, data) {
    // console.log('sendGTMRemoveSelectionFromBetslip')
    var selection = data[0]
    var isFastBet = data[1]
    // let id = context.getters.getSourceForDerivedSelection(selection.idfoselection)
    let id = selection.idfoselection
    var market = context.getters.getStoredMarketById(id) || {}
    var markettypedict = {
      PS: 'spread',
      ML: 'money',
      TP: 'total'
    }
    var marketType = (market && market.big3markettype && markettypedict[market.big3markettype]) || undefined
    //
    if (window.dataLayer || context.rootGetters.getThirdpartyAnalytics) {
      let sendGTMRemoveSelectionFromBetslip = {
        'event': 'bet',
        'gaEventCategory': 'bet',
        'gaEventAction': 'removed selection',
        'gaEventLabel': marketType,
        'module': isFastBet ? 'fast betslip' : 'betslip',
        'betAmount': undefined,
        'tab': isFastBet ? 'fast bet' : tabMap[context.state.tab],
        'betCount': '1',
        'betSlipId': undefined, // betId,
        'sport': selection.idfosporttype,
        'inPlay': context.getters.isSelectionLive(id) ? 'y' : 'n',
        'timeToFirstBet': undefined,
        'potentialReturn': undefined,
        'selectionName': selection.name,  // Add new key here
        'marketName': market.name,  // Add new key here
        'eventName': market.eventname,  // Add new key here
        'competition': market.sportname || market.idfosport || undefined, // Add new key here
        'selectionId': selection.idfoselection.toString(), // Add new key here. Pass as a string.
        // 'betSlipId': {{bet slip id}}, // Add new key here. Pass as a string - DUPLICATE
        'marketId': market.idfomarket.toString(),  // Add new key here. Pass as a string
        'eventId': market.idfoevent.toString() // Add new key here. Pass as a string
      }
      let xtremeObj = {
        'param1': 'event',
        'param2': 'selection_removed_from_betslip',
        'param3': {
          'competition': selection.sportname || selection.idfosport || 'N/A',
          'sport': selection.fosporttypename || selection.idfosporttype || 'N/A',
          'inPlay': context.getters.isSelectionLive(id) ? 'y' : 'n',
          'selectionId': selection.idfoselection,
          'eventName': market.eventname,
          'marketName': market.name,
          'tab': isFastBet ? 'fast bet' : tabMap[context.state.tab]
        }
      }
      context.dispatch('analyticsHandler', {'event': sendGTMRemoveSelectionFromBetslip, 'xtremeObj': xtremeObj}, { root: true })
    }
  },
  sendGTMAddSelectionToBetslip (context, data) {
    var selection = data[0]
    var isFastBet = data[1]
    let id = context.getters.getSourceForDerivedSelection(selection.idfoselection)
    var market = context.getters.getStoredMarketById(id) || {}
    var markettypedict = {
      PS: 'spread',
      ML: 'money',
      TP: 'total'
    }
    var marketType = (market && market.big3markettype && markettypedict[market.big3markettype]) || undefined
    //
    if (window.dataLayer || context.rootGetters.getThirdpartyAnalytics) {
      let sendGTMAddSelectionToBetslip = {
        'event': 'bet',
        'gaEventCategory': 'bet',
        'gaEventAction': 'add to betslip',
        'gaEventLabel': marketType, // pass 'money', 'spread' or 'total'
        'module': isFastBet ? 'fast betslip' : 'betslip',
        'competition': market.sportname || market.idfosport || undefined,
        'sport': selection.idfosporttype,
        'inPlay': context.getters.isSelectionLive(id) ? 'y' : 'n',
        'selectionName': selection.name,  // Add new key here
        'marketName': market.name,  // Add new key here
        'eventName': market.eventname,  // Add new key here
        'selectionId': selection.idfoselection.toString(), // Add new key here. Pass as a string.
        'betSlipId': undefined, // Add new key here. Pass as a string
        'marketId': market.idfomarket.toString(),  // Add new key here. Pass as a string
        'eventId': market.idfoevent.toString() // Add new key here. Pass as a string
      }
      context.dispatch('analyticsHandler', {'event': sendGTMAddSelectionToBetslip}, { root: true })
    }
  },
  sendGTMBetAttempt (context, betData) {
    // console.log('sendGTMBetAttempt', context)
    var isFastBet = betData && betData.isFastBet
    // console.log(betSlipData)
    var betAmount
    var potentialReturn
    //
    if (window.dataLayer || context.rootGetters.getThirdpartyAnalytics) {
      // betData.betTypeObj.listAllselections = true
      var betSlip = betData.betTypeObj.betSlip.betSlip
      // context.dispatch('createBetSlip', betData.betTypeObj).then(function (betSlip) {
      betData.payload = betSlip
      betData.betTypeObj.tab = betData.betTypeObj.betSlip.tab
      context.dispatch('processSelectionsForGTM', betData).then(function (data) {
        betAmount = data.totalStake || betAmount || undefined
        betAmount = typeof betAmount !== 'undefined' || betAmount ? parseFloat(betAmount.toFixed(2)).toString() : betAmount
        //
        potentialReturn = data.potentialReturn || potentialReturn || undefined
        potentialReturn = typeof potentialReturn !== 'undefined' || potentialReturn ? parseFloat(potentialReturn.toFixed(2)).toString() : potentialReturn
        //
        let sendGTMBetAttempt = {
          'event': 'bet',
          'gaEventCategory': 'bet',
          'gaEventAction': 'bet attempt',
          'gaEventLabel': undefined,
          'module': isFastBet ? 'fast betslip' : 'betslip',
          'betAmount': betAmount,
          'tab': isFastBet ? 'fast bet' : tabMap[context.state.tab],
          'betCount': data.betCount.toString(),
          'betSlipId': undefined, // betId,
          'sport': data.sportsArr.join(','),
          'inPlay': data.inPlay ? 'y' : 'n',
          'timeToFirstBet': undefined,
          'potentialReturn': potentialReturn,
          'betArray': data.betArray,
          'multiBetArray': data.multiBetArray
        }
        context.dispatch('sendGTMBetStatus', {'event': 'bet_attempt', 'data': sendGTMBetAttempt})
        context.dispatch('analyticsHandler', {'event': sendGTMBetAttempt}, { root: true })
      })
      // })
    }
  },
  sendGTMBetError (context, betData) {
    // console.log('sendGTMBetError')
    var reason = betData.reason
    if (reason === 'GEN') {
      reason = 'GENERAL'
    }
    if (reason) {
      reason = reason.split('_').join(' ').toLocaleLowerCase()
    }
    if (betData.code && (reason === 'general' || reason === 'arc')) {
      reason = reason + ' ' + betData.code
    }
    //
    if (window.dataLayer || context.rootGetters.getThirdpartyAnalytics) {
      // betData.betTypeObj.listAllselections = true
      // context.dispatch('createBetSlip', betData.betTypeObj).then(function (betSlip) {
      // betData.betSlip = betSlip
      // betData.betTypeObj.tab = betData.betTypeObj.betSlip.tab
      context.dispatch('processSelectionsForGTM', betData).then(function (data) {
        let sendGTMBetError = {
          'event': 'bet',
          'gaEventCategory': 'bet',
          'gaEventAction': 'bet error',
          'gaEventLabel': reason || undefined,
          'module': betData.isFastBet ? 'fast betslip' : 'betslip',
          'betAmount': undefined,
          'tab': betData.isFastBet ? 'fast bet' : tabMap[context.state.tab],
          'betCount': data.betCount.toString(),
          'betSlipId': undefined, // betId,
          'sport': data.sportsArr.join(','),
          'inPlay': data.inPlay ? 'y' : 'n',
          'timeToFirstBet': undefined,
          'potentialReturn': undefined,
          'betArray': data.betArray,
          'multiBetArray': data.multiBetArray
        }
        context.dispatch('sendGTMBetStatus', {'event': 'bet_error', 'data': sendGTMBetError})
        context.dispatch('analyticsHandler', {'event': sendGTMBetError}, { root: true })
      })
      // })
    }
  },
  sendGTMBetStatus (context, obj) {
    setTimeout(() => {
      obj.data['event'] = obj.event
      context.dispatch('analyticsHandler', {'event': obj.data, 'xtremeObj': false}, { root: true })
    }, 1000)
  },
  sendGTMbetslipClosed (context) {
    context.dispatch('sendGTMRemoveAllSelectionsFromBetslip', true)
  }
}

export default actions
