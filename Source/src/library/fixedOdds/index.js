import rpcService from '@/library/rpcService'

export default {
  getSelectionsMappedToBetLegsForBSupdate,
  normalizeUpdatedSelections,
  calculatePrice,
  getAllowedBetTypesAndReturns,
  getSelectionsMappedToBetLegs,
  getBetsForPlacement,
  updateBetSlipSelections,
  placeBetSlip,
  getInRunningDelay,
  getBetSlipStatus,
  getBetSlip,
  getReferredBets,
  processReferredBetSlip,
  getActualBetGracePeriod,
  confirmBetSlipUsingConfirmations,
  rejectBetSlip,
  jsonizeProp,
  jsonize,
  parseBetSlipDetailedState,
  getTeasers,
  teaserGroupId,
  getdefaultPricetype,
  getPricetype,
  getCalculation,
  placeBetSlipXP,
  confirmBetSlipXP
}

function getSelectionsMappedToBetLegsForBSupdate (selections, markets) {
  // console.log('getSelectionsMappedToBetLegsForBSupdate')
  return selections.map(function (selection) {
    var market = markets && markets[selection.idfoselection]
    // market = selection.market
    var upperband = typeof selection.upperband !== 'undefined' ? selection.upperband : null
    var lowerband = typeof selection.lowerband !== 'undefined' ? selection.lowerband : null
    var handicap = selection.currenthandicap || selection.currentmatchhandicap
    handicap = handicap || handicap === 0 ? parseFloat(handicap) : null
    //
    // console.log('- ' + selection.selectionhashcode);
    return {
      // IDFOPriceType: [selection.pricetype || 'CP'],
      IDFOPriceType: selection.csvpricetypes,
      IDFOEvent: market && market.idfoevent && parseFloat(market.idfoevent),
      IDFOMarket: market && market.idfomarket && parseFloat(market.idfomarket),
      IDFOSelection: selection.idfoselection,
      SelectionHashCode: selection.selectionhashcode,
      idfobolifestate: selection.idfobolifestate || null,
      //
      SelectionName: Array.isArray(selection.name) ? selection.name[0] : selection.name,
      PriceDown: selection.currentpricedown,
      PriceUp: selection.currentpriceup,
      Handicap: handicap,
      UpperBand: upperband,
      LowerBand: lowerband,
      IsTrap: null,
      SystemTag: null,
      InterrelationTag: null,
      IDFOEventScorecast: null,
      IsTradable: selection.istradable,
      //
      IsClosed: selection.isclosed
    }
  })
}
function normalizeUpdatedSelections (selections, isSingleBetSlip) {
  var resultObj = {}
  if (selections && selections.length) {
    selections.forEach(function (selection) {
      // console.log('selection:')
      // console.log(selection)
      resultObj.isSingleBetSlip = selection.isSingleBetSlip
      selection.selectionhashcode = selection.SelectionHashCode
      selection.idfobolifestate = selection.idfobolifestate
      selection.idfoselection = selection.IDFOSelection
      selection.idfomarket = selection.IDFOMarket
      selection.currentpriceup = selection.PriceUp
      selection.currentpricedown = selection.PriceDown
      selection.currenthandicap = selection.Handicap
      selection.upperband = selection.UpperBand
      selection.lowerband = selection.LowerBand
      selection.isclosed = selection.IsClosed
      selection.istradable = selection.IsTradable
      //
      selection.csvpricetypes = selection.IDFOPriceType
      //
      selection.price = calculatePrice(selection)
      //
      resultObj[selection.IDFOSelection] = selection
    })
  }
  // console.log(resultObj)
  if (isSingleBetSlip) {
    resultObj.isSingleBetSlip = isSingleBetSlip
  }
  return resultObj
}

function jsonizeProp (v) {
  var val = v
  var re = /^([\d.]+|true|false)$/i
  var match
  // console.log(val)
  if (val) {
    if (typeof val === 'object') {
      if ('xsi:nil' in val) {
        val = null
      }
    } else if (typeof val === 'string') {
      match = val.match(re)
      if (match) {
        try {
          val = JSON.parse(v.toLowerCase())
        } catch (err) {
        }
      }
    }
  }
  // console.log(val)
  // console.log('---------')
  return val
}
function jsonize (selection) {
  var i
  /*
  var props = ['price', 'currenthandicap', 'idfoselection', 'lowerband', 'upperband', 'currentpricedown', 'currentpriceup', 'ewreduction', 'ewplaceterms', 'istrapbettingoptionon']
  for (i = 0; i < props.length; i++) {
    selection[props[i]] = jsonizeProp(selection[props[i]])
  }
  */
  for (i in selection) {
    if (i !== 'market') {
      // console.log(i + ':')
      selection[i] = jsonizeProp(selection[i])
    }
  }
}

function getdefaultPricetype (selection, preferredPriceTypes) {
  // console.log('getdefaultPricetype')
  preferredPriceTypes = preferredPriceTypes || {}
  // console.log(preferredPriceTypes)
  let priceTypesToIgnore = (preferredPriceTypes && preferredPriceTypes.priceTypesToIgnore) || []
  let csvpricetypes = selection.csvpricetypes
  if (priceTypesToIgnore.length) {
    csvpricetypes = selection.csvpricetypes.filter(function (pt) {
      return !priceTypesToIgnore.includes(pt)
    })
  }
  //
  let pricetype = (csvpricetypes && csvpricetypes.length) ? (csvpricetypes.includes('CP') ? 'CP' : csvpricetypes[0]) : 'CP'
  let priceTypePerBetType = {S: pricetype, Multi: pricetype}
  if (preferredPriceTypes.isFOPreferredInSingles && preferredPriceTypes.isFOPreferredInSingles === 'true' && csvpricetypes && csvpricetypes.includes('CP')) {
    pricetype = 'CP'
    priceTypePerBetType.S = pricetype
  }
  if (preferredPriceTypes.isFPPreferredInMultiples && preferredPriceTypes.isFPPreferredInMultiples === 'true' && csvpricetypes && csvpricetypes.includes('FP')) {
    pricetype = 'FP'
    priceTypePerBetType.Multi = pricetype
  }
  //
  if (csvpricetypes && csvpricetypes.includes('XP') && selection.estimatepriceup && selection.estimatepricedown) {
    pricetype = 'XP'
    // priceTypePerBetType = {S: pricetype, Multi: pricetype}
    priceTypePerBetType.S = pricetype
    priceTypePerBetType.Multi = pricetype
  }
  selection.priceTypePerBetType = priceTypePerBetType
  // console.log('getdefaultPricetype: ' + selection.csvpricetypes + ' => ' + pricetype)
  return pricetype
}

function getPricetype (selection, iDFOBetType, priceTypeXP) {
  var pricetype = (iDFOBetType && priceTypeXP) || selection.pricetype || 'CP'
  var pricesToCheck = ['CP', 'FP']
  if (iDFOBetType && selection.csvpricetypes && selection.csvpricetypes.length && pricesToCheck.includes(pricetype)) {
    if (iDFOBetType === 'S') {
      // pricetype = 'CP'
      pricetype = (selection.priceTypePerBetType && selection.priceTypePerBetType.S) || 'CP'
    } else {
      pricetype = (selection.priceTypePerBetType && selection.priceTypePerBetType.Multi) || 'CP'
    }
  }
  // console.log('getPricetype: ' + pricetype)
  return pricetype
}

function getSelectionsMappedToBetLegs (selections, iDFOBetType) {
  // console.log('getSelectionsMappedToBetLegs')
  return selections.map(function (selection) {
    var upperband = typeof selection.upperband !== 'undefined' ? selection.upperband : null
    var lowerband = typeof selection.lowerband !== 'undefined' ? selection.lowerband : null
    var handicap = selection.currenthandicap || selection.currentmatchhandicap
    handicap = handicap || handicap === 0 ? parseFloat(handicap) : null
    return {
      Handicap: handicap,
      UpperBand: upperband,
      LowerBand: lowerband,
      // IDFOPriceType: selection.pricetype || 'CP',
      IDFOPriceType: getPricetype(selection, iDFOBetType),
      IDFOSelection: parseFloat(selection.idfoselection),
      PriceDown: selection.currentpricedown ? parseInt(selection.currentpricedown) : null,
      PriceUp: selection.currentpriceup ? parseInt(selection.currentpriceup) : null,
      EachWayReduction: selection.ewreduction || null,
      EachWayPlaceTerms: selection.ewplaceterms || null,
      IsTrap: selection.istrapbettingoptionon || false,
      SystemTag: null,
      InterrelationTag: null,
      IDFOEventScorecast: null
    }
  })
}

function getBetsForPlacement (betType, selections, allowedBetTypesAndReturns) {
  // console.log('FixedOdds getBetsForPlacement')
  var id
  var i = 0
  var bets = []
  var betTypeSrc = 'PerBetType'
  var sportType = betType.tab === 'TEASER' ? betType.teaserSportType : null
  // var tmp

  var getBets = function (id) {
    if (id.IDFOBetType === 'S') {
      return selections
        .filter(function (selection) {
          return parseFloat(betType.betTypeStakes[betType.tab].PerSelection[selection.idfoselection]) > 0
        })
        .map(function (selection) {
          var winStake = betType.betTypeStakes[betType.tab].PerSelection[selection.idfoselection] * 1
          winStake = winStake.toFixed(2) * 1
          var TotalStake = winStake
          return {
            'BetLegs': getSelectionsMappedToBetLegs([selection], 'S'),
            'IDFOBetType': 'S',
            'BetTypeName': 'Single',
            'IDFOMultiRacePool': null,
            'IsPool': false,
            'TotalStake': TotalStake,
            'WinStake': winStake,
            'PlaceStake': null,
            'ShowStake': null,
            'IsActive': false
          }
        })
      // bets = bets.concat(tmp)
    } else {
      return allowedBetTypesAndReturns.AllowedBetTypes.filter(function (bt) {
        var stake = sportType ? betType.betTypeStakes[betType.tab][sportType][betTypeSrc][bt.IDFOBetType] : betType.betTypeStakes[betType.tab][betTypeSrc][bt.IDFOBetType]
        return bt.IDFOBetType === id.IDFOBetType && parseFloat(stake) > 0
      }).map(function (bt) {
        var winStake = sportType ? betType.betTypeStakes[betType.tab][sportType][betTypeSrc][bt.IDFOBetType] * 1 : betType.betTypeStakes[betType.tab][betTypeSrc][bt.IDFOBetType] * 1
        winStake = winStake.toFixed(2) * 1
        var TotalStake = winStake * allowedBetTypesAndReturns.PotentialReturns.PerBetType[bt.IDFOBetType].UnitCount * 1
        return {
          'BetLegs': getSelectionsMappedToBetLegs(selections, bt.IDFOBetType),
          'IDFOBetType': bt.IDFOBetType,
          'BetTypeName': bt.Name,
          'IDFOMultiRacePool': null,
          'IsPool': false,
          'TotalStake': TotalStake,
          'WinStake': winStake,
          'PlaceStake': null,
          'ShowStake': null,
          'IsActive': false,
          'SportType': sportType
        }
      })
      // bets = bets.concat(tmp)
    }
  }

  for (i = 0; i < betType.id.length; i++) {
    id = betType.id[i]
    bets = bets.concat(getBets(id))
  }
  return bets
}

function calculatePrice (selection) {
  var price = selection.price
  if (selection.currentpricedown && selection.currentpriceup) {
    price = 1 + (selection.currentpriceup / selection.currentpricedown)
    price = price < 100 ? price.toFixed(2) : price.toFixed(0)
    price = parseFloat(price)
  }
  return price
}

function getAllowedBetTypesAndReturns (selections, soloRequest, cnt) {
  // console.log('getAllowedBetTypesAndReturns')
  var bet = {
    'IDFOBetType': null,
    'BetTypeName': null,
    'IDFOMultiRacePool': null,
    'IsPool': false,
    'WinStake': 0,
    'PlaceStake': null,
    'ShowStake': null,
    'BetLegs': getSelectionsMappedToBetLegs(selections)
  }

  // console.log(bet)

  return rpcService.callBroker('FixedOddsBettingService', 'GetAllowedBetTypesAndReturns', {bet: bet, soloRequest: soloRequest, cnt: cnt})
}

function getCalculation (selections, soloRequest, cnt) {
  // console.log('getCalculation')
  var bet = {
    'IDFOBetType': null,
    'BetTypeName': null,
    'IDFOMultiRacePool': null,
    'IsPool': false,
    'WinStake': 0,
    'PlaceStake': null,
    'ShowStake': null,
    'BetLegs': getSelectionsMappedToBetLegs(selections)
  }

  // console.log(bet)

  return rpcService.callBroker('XPBettingService', 'GetCalculation', {bet: bet, soloRequest: soloRequest, cnt: cnt})
}

function updateBetSlipSelections (betslipSelections, markets) {
  // console.log('FixedOdds updateBetSlipSelections')
  var selectionsArr = getSelectionsMappedToBetLegsForBSupdate(betslipSelections, markets)
  return rpcService.callBroker('FixedOddsBettingService', 'UpdateBetSlipSelections', {selections: selectionsArr, soloRequest: 'updateBetSlipSelections'})
    .then(function (response) {
      return normalizeUpdatedSelections(response.result)
    })
}

function placeBetSlip (betSlip, asyncMethod) {
  // console.log('placeBetSlip')
  var method = asyncMethod ? 'PlaceBetSlipAsync' : 'PlaceBetSlip'
  return rpcService.callBroker('FixedOddsBettingService', method, betSlip)
}

function placeBetSlipXP (betSlipData, asyncMethod) {
  // console.log('placeBetSlipXP')
  var betSlip = betSlipData.betSlip
  var xpInbound = {}
  //
  var method = asyncMethod ? 'PlaceBetsAsync' : 'PlaceBets'
  return rpcService.callBroker('XPBettingService', method, {
    betSlip: betSlip,
    xpInbound: xpInbound,
    asyncMethod: asyncMethod ? method : false,
    soloRequest: asyncMethod ? method : false
  })
}

function confirmBetSlipXP (IDFOBetSlip, betSlipStatus, asyncMethod) {
  var method = asyncMethod ? 'ConfirmBetsAsync' : 'ConfirmBets'
  var data = {
    'IDFOBetSlip': IDFOBetSlip,
    'asyncMethod': asyncMethod ? method : false,
    'soloRequest': asyncMethod ? method : false
  }
  return rpcService.callBroker('XPBettingService', method, data)
}

function getInRunningDelay (IDFOSelections) {
  // IDFOSelections: Array of selection ids
  return rpcService.callBroker('FixedOddsBettingService', 'GetInRunningDelay', {'IDFOSelections': IDFOSelections})
}

function getBetSlipStatus (IDFOBetSlip) {
  // console.log('FixedOdds getBetSlipStatus: ' + IDFOBetSlip)
  return rpcService.callBroker('FixedOddsBettingService', 'GetBetSlipStatus', {'IDFOBetSlip': IDFOBetSlip})
}
function getBetSlip (IDFOBetSlip) {
  return rpcService.callBroker('FixedOddsBettingService', 'GetBetSlip', {'IDFOBetSlip': IDFOBetSlip})
}
function getReferredBets (IDFOBetSlip) {
  return rpcService.callBroker('FixedOddsBettingService', 'GetReferredBets', {'IDFOBetSlip': IDFOBetSlip})
}
function processReferredBetSlip (IDFOBetSlip) {
  return rpcService.callBroker('FixedOddsBettingService', 'ProcessReferredBetSlip', {'IDFOBetSlip': IDFOBetSlip})
}

function getActualBetGracePeriod (IDFOBetSlip) {
  return rpcService.callBroker('FixedOddsBettingService', 'GetActualBetGracePeriod', {'IDFOBetSlip': IDFOBetSlip})
}

function confirmBetSlipUsingConfirmations (IDFOBetSlip, betSlipStatus, asyncMethod) {
  var data = {
    'IDFOBetSlip': IDFOBetSlip,
    'betSlipStatus': betSlipStatus,
    'rejectOnChanges': true,
    'securityCode': null,
    'IDMDRegion': 'ignore'
  }
  var method = asyncMethod ? 'ConfirmBetSlipUsingConfirmationsAsync' : 'ConfirmBetSlipUsingConfirmations'
  return rpcService.callBroker('FixedOddsBettingService', method, data)
}

function rejectBetSlip (IDFOBetSlip, betSlipStatus) {
  // console.log('fixedOdds rejectBetSlip')
  var data = {
    'IDFOBetSlip': IDFOBetSlip,
    'betSlipStatus': betSlipStatus
  }
  return rpcService.callBroker('FixedOddsBettingService', 'RejectBetSlip', data)
}

function getTeasers (selectionsArr) {
  var data = {
    'IDDCLanguage': rpcService.config.app.language,
    'selections': selectionsArr
  }
  return rpcService.callBroker('PlayspotService', 'GetTeasers', data)
}

var detailedBetPlacementState = {
  preProcess: 0,
  accepted: 1,
  acceptable: 2,
  rejected: 4,
  priceChanged: 8,
  handicapChanged: 16,
  bandChanged: 32,
  reOffered: 64,
  reOfferTimeout: 128,
  topupRequired: 256,
  maxTakeoutViolation: 512,
  waiting: 1024,
  eachWayChanged: 2048,
  abortProcessing: 4096,
  referred: 8192,
  securityCodeRequiredForTopup: 16384,
  maxUnitReturnViolation: 32768,
  partiallyAcceptable: 65536
}

function parseBetSlipDetailedState (eNum, totalStake) {
  var i
  var exp
  var arr = []
  for (i in detailedBetPlacementState) {
    exp = detailedBetPlacementState[i]
    if ((exp > 4 || (exp === 4 && totalStake === 0)) && (eNum & exp) !== 0) {
      arr.push(i)
    }
  }
  return arr
}

function teaserGroupId (group) {
  return group.IDFOSportType.split(' ').join('').toUpperCase()
}
