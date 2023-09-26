import rpcService from '@/library/rpcService'
import hcpFormat from '@/library/hcpFormat'

export default {
  getHCP,
  getSelectionsMappedToBetLegsForBSupdate,
  normalizeUpdatedSelections,
  calculatePrice,
  getAllowedBetTypesAndReturns,
  getSelectionsMappedToBetLegs,
  updateBetSlipSelections,
  placeBetSlip,
  placeBetSlipXP,
  getInRunningDelay,
  getBetSlipStatus,
  getBetSlip,
  getReferredBets,
  processReferredBetSlip,
  getActualBetGracePeriod,
  confirmBetSlipUsingConfirmations,
  rejectBetSlip,
  rejectBetSlipXP,
  parseBetSlipDetailedState,
  getTeasers,
  getPricetype,
  getCalculationXP,
  getCalculation,
  getXP,
  confirmBetSlipXP
}

function getHCP (selection) {
  var handicap = hcpFormat.getHandicap(selection)
  return handicap
}

function getSelectionsMappedToBetLegsForBSupdate (selections, markets) {
  // console.log('getSelectionsMappedToBetLegsForBSupdate')
  return selections.map(function (selection) {
    var market = markets && markets[selection.idfoselection]
    // market = selection.market
    var upperband = typeof selection.upperband !== 'undefined' ? selection.upperband : null
    var lowerband = typeof selection.lowerband !== 'undefined' ? selection.lowerband : null
    var handicap = getHCP(selection)
    // console.log('- ' + selection.selectionhashcode);
    return {
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
      selection.currentmatchhandicap = selection.Handicap
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

function getPricetype (selection, iDFOBetType, priceTypeXP, isForSGPplus) {
  if (iDFOBetType && priceTypeXP) {
    return priceTypeXP
  }
  var pricetype = selection.pricetype || 'CP'
  //
  if (!priceTypeXP && iDFOBetType && isForSGPplus && selection && selection.csvpricetypes && selection.csvpricetypes.includes('CP')) {
    pricetype = 'CP'
  }
  //
  var pricesToCheck = ['CP', 'FP']
  if (iDFOBetType && !isForSGPplus && selection.csvpricetypes && selection.csvpricetypes.length && pricesToCheck.includes(pricetype)) {
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

function getSelectionsMappedToBetLegs (selections, iDFOBetType, derivates, priceTypeXP, selectionsXPids, isSGP, isSgpA) {
  // console.log('getSelectionsMappedToBetLegs')
  return selections.map(function (selection) {
    // var pitchers = derivates && derivates.pitchers
    // var buyPoints = derivates && derivates.buyPoints
    var derivate = {}
    //
    var idfoselectionsource = derivate.idfoselectionsource || selection.idfoselectionsource || selection.idfoselection
    var source = derivate.idfoselection ? derivate : selection
    //
    var upperband = typeof selection.upperband !== 'undefined' ? selection.upperband : null
    var lowerband = typeof selection.lowerband !== 'undefined' ? selection.lowerband : null
    //
    var handicap = getHCP(selection)
    //
    var PriceUp = source.currentpriceup ? parseInt(source.currentpriceup) : null
    var PriceDown = source.currentpricedown ? parseInt(source.currentpricedown) : null
    //
    let priceType = isSgpA && source.priceTypeSGP ? source.priceTypeSGP : getPricetype(source, iDFOBetType, priceTypeXP, isSgpA)
    let priceTypes = source.csvpricetypes || (selection.pricetypecsv && selection.pricetypecsv.split(','))
    //
    let IDFOEvent = source.idfoevent || selection.idfoevent || selection.IDFOEvent
    //
    return {
      Handicap: handicap,
      UpperBand: upperband,
      LowerBand: lowerband,
      // IDFOPriceType: selection.pricetype || 'CP',
      IDFOPriceType: priceType,
      IDFOSelection: parseFloat(source.idfoselection),
      idfoselectionsource: parseFloat(idfoselectionsource),
      PriceDown: PriceDown,
      PriceUp: PriceUp,
      EachWayReduction: source.ewreduction || null,
      EachWayPlaceTerms: source.ewplaceterms || null,
      IsTrap: source.istrapbettingoptionon || false,
      SystemTag: isSgpA && source.priceTypeSGP ? IDFOEvent : null,
      InterrelationTag: null,
      IDFOEventScorecast: null,
      HADValue: source.HADValue || source.hadvalue,
      Spread: source.Spread,
      IDFOEvent: IDFOEvent,
      PriceTypes: priceTypes ? priceTypes.join(',') : priceType
    }
  })
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

function getAllowedBetTypesAndReturns (selections, soloRequest, cnt, selectionsMappedToBetLegs) {
  // console.log('getAllowedBetTypesAndReturns')
  var bet = {
    'IDFOBetType': null,
    'BetTypeName': null,
    'IDFOMultiRacePool': null,
    'IsPool': false,
    'WinStake': 0,
    'PlaceStake': null,
    'ShowStake': null,
    'BetLegs': selectionsMappedToBetLegs
    // 'BetLegs': getSelectionsMappedToBetLegs(selections, null, derivates)
  }

  // console.log(bet)

  return rpcService.callBroker('FixedOddsBettingService', 'GetAllowedBetTypesAndReturns', {bet: bet, soloRequest: soloRequest, cnt: cnt})
}

function updateBetSlipSelections (betslipSelections, markets, rqId) {
  // console.log('FixedOdds updateBetSlipSelections')
  var selectionsArr = getSelectionsMappedToBetLegsForBSupdate(betslipSelections, markets)
  return rpcService.callBroker('FixedOddsBettingService', 'UpdateBetSlipSelections', {selections: selectionsArr, soloRequest: 'updateBetSlipSelections'})
    .then(function (response) {
      return normalizeUpdatedSelections(response.result)
    })
}

function placeBetSlip (betSlipData, asyncMethod) {
  var betSlip = betSlipData.betSlip
  //
  // return rpcService.callBroker('FixedOddsBettingService', 'PlaceBetSlip', betSlip)
  //
  var method = asyncMethod ? 'PlaceBetSlipAsync' : 'PlaceBetSlip'
  return rpcService.callBroker('FixedOddsBettingService', method, {
    betSlip: betSlip.betSlip,
    asyncMethod: asyncMethod ? method : false,
    soloRequest: asyncMethod ? method : false
  })
}

function placeBetSlipXP (betSlipData, asyncMethod) {
  // console.log('placeBetSlipXP')
  var betSlip = betSlipData.betSlip
  var xpInbound = betSlipData.xpInbound || {}
  //
  // betSlip.betSlip.xpInbound = xpInbound
  var method = asyncMethod ? 'PlaceBetsAsync' : 'PlaceBets'
  return rpcService.callBroker('XPBettingService', method, {
    betSlip: betSlip.betSlip,
    xpInbound: xpInbound,
    asyncMethod: asyncMethod ? method : false,
    soloRequest: asyncMethod ? method : false
  })
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
  var method = asyncMethod ? 'ConfirmBetSlipUsingConfirmationsAsync' : 'ConfirmBetSlipUsingConfirmations'
  var data = {
    'IDFOBetSlip': IDFOBetSlip,
    'betSlipStatus': betSlipStatus,
    'rejectOnChanges': false,
    'securityCode': null,
    'asyncMethod': asyncMethod ? method : false,
    'soloRequest': asyncMethod ? method : false
  }
  return rpcService.callBroker('FixedOddsBettingService', method, data)
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

function rejectBetSlip (IDFOBetSlip, betSlipStatus) {
  // console.log('fixedOdds rejectBetSlip')
  var data = {
    'IDFOBetSlip': IDFOBetSlip,
    'betSlipStatus': betSlipStatus
  }
  return rpcService.callBroker('FixedOddsBettingService', 'RejectBetSlip', data)
}

function rejectBetSlipXP (IDFOBetSlip, betSlipStatus) {
  // console.log('fixedOdds rejectBetSlipXP')
  var data = {
    'IDFOBetSlip': IDFOBetSlip
  }
  return rpcService.callBroker('XPBettingService', 'RejectBets', data)
}

function getTeasers (selectionsArr) {
  var data = {
    'IDDCLanguage': rpcService.config.app.language,
    'selections': selectionsArr
  }
  return rpcService.callBroker('PlayspotService', 'GetTeasers', data)
}

/*
var betSlipPlacementState = {
  0: preProcess,
  1: 'acceptable', // ConfirmationRequired
  2: 'accepted',
  3: 'reOffered', // acceptable
  4: 'rejected',
  5: 'waiting'
}
*/

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
var fastBetSpecific = {
  abortProcessing: 1,
  bandChanged: 1,
  eachWayChanged: 1,
  handicapChanged: 1,
  priceChanged: 1
}

function parseBetSlipDetailedState (eNum, totalStake, isFastBet) {
  var i
  var exp
  var arr = []
  for (i in detailedBetPlacementState) {
    exp = detailedBetPlacementState[i]
    if ((exp > 4 || (exp === 4 && totalStake === 0)) && (eNum & exp) !== 0) {
      if (isFastBet && fastBetSpecific[i]) {
        arr.push(i + '.FastBet')
      } else {
        arr.push(i)
      }
    }
  }
  return arr
}

function getXP (selections, soloRequest, cnt, derivates) {
  // console.log('getXP')
  var betLegs = getSelectionsMappedToBetLegs(selections, null, derivates)
  var infos = []
  if (betLegs.length) {
    betLegs.forEach(function (leg) {
      infos.push({
        PriceTypes: leg.PriceTypes,
        IDFOEvent: leg.IDFOEvent
      })
      delete leg.PriceTypes
      delete leg.IDFOEvent
    })
  }
  //
  var bet = {
    'IDFOBetType': null,
    'BetTypeName': null,
    'IDFOMultiRacePool': null,
    'IsPool': false,
    'WinStake': 0,
    'PlaceStake': null,
    'ShowStake': null,
    'BetLegs': betLegs
  }

  // console.log(bet)

  return rpcService.callBroker('XPBettingService', 'GetXP', {
    bet: bet,
    infos: infos,
    soloRequest: soloRequest,
    cnt: cnt
  })
}

function getCalculationXP (selections, soloRequest, cnt, selectionsMappedToBetLegs, infos, calculateAsync) {
  // console.log('getCalculationXP')
  var bet = {
    'IDFOBetType': null,
    'BetTypeName': null,
    'IDFOMultiRacePool': null,
    'IsPool': false,
    'WinStake': 0,
    'PlaceStake': null,
    'ShowStake': null,
    'BetLegs': selectionsMappedToBetLegs
    // 'BetLegs': getSelectionsMappedToBetLegs(selections, null, derivates)
  }
  //
  var payload = {
    bet: bet,
    soloRequest: soloRequest,
    cnt: cnt
  }
  var method = 'GetCalculationXP'
  /*
  if (infos && infos.length) {
    // method = 'GetCalculationXP'
    payload.infos = infos || []
  }
  */
  payload.infos = infos || []
  //
  // payload.infos = []
  if (calculateAsync) {
    method = method + 'async'
  }
  //
  return rpcService.callBroker('XPBettingService', method, payload)
}

function getCalculation (selections, soloRequest, cnt, selectionsMappedToBetLegs) {
  // console.log('getCalculation')
  var bet = {
    'IDFOBetType': null,
    'BetTypeName': null,
    'IDFOMultiRacePool': null,
    'IsPool': false,
    'WinStake': 0,
    'PlaceStake': null,
    'ShowStake': null,
    'BetLegs': selectionsMappedToBetLegs
  }
  return rpcService.callBroker('XPBettingService', 'GetCalculation', {bet: bet, soloRequest: soloRequest, cnt: cnt})
}
