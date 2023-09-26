import lib from '@/library'

const actions = {
  fetchBettingParams (context) {
    // !!! USED BY EXTERNAL COMPONENT !!!
    // console.log('sbBetslipState fetchBettingParams')
    context.dispatch('fetchCoreParams')
    context.dispatch('fetchBetSlipParams')
  },
  fetchCoreParams (context) {
    console.log('sbBetslipState fetchCoreParams')
    var map = {
      IsFOPreferredInSingles: 'setBPCisFOPreferredInSingles',
      IsFPPreferredInMultiples: 'setBPCisFPPreferredInMultiples'
    }
    var parseResponse = function (response) {
      for (var i = 0; i < response.length; i++) {
        var item = response[i]
        var val = item.Value
        var handler = map[item.Code]
        if (val && handler) {
          console.log(item.Code + ': ' + val)
          context.commit(handler, val)
        }
      }
    }
    //
    let csvlist = []
    for (var p in map) {
      if (map[p]) {
        csvlist.push(p)
      }
    }
    csvlist = csvlist.join(',')
    //
    return new Promise((resolve) => {
      lib.kansas.psCoreParams({
        csvlist: csvlist,
        iddcapplication: 'MMFO'
      }).then(response => {
        if (response && response.data) {
          parseResponse(response.data)
        }
      }).catch((error) => {
        console.log('fetchCoreParams error')
        console.log(error)
      }).finally(() => {
        resolve()
      })
    })
  },
  fetchBetSlipParams (context) {
    // console.log('sbBetslipState fetchBetSlipParams')
    var map = {
      TXMaxBetSlipTotalStake: !'setSlipTotalStakeMax',
      TXMaxBetSlipTotalStakeInRunning: !'setSlipTotalStakeMaxInPlay',
      TXMaxUnitStake: 'setUnitStakeMax',
      TXStakeMinUnit: 'setUnitStakeMin',
      TXMultiStakeMinUnit: 'setMultiStakeMinUnit',
      TxMaxPotentialSlipPayout: !'setMaxPotentialSlipPayout',
      TxSlipTotalStakeMin: !'setSlipTotalStakeMin',
      TxUnitStakeIncrement: !'setUnitStakeIncrement',
      TXStakeMaxUnit: !'setStakeMaxUnit',
      TXTotalBetSlipMinUnit: 'setTotalBetSlipMinUnit',
      'FOSO.PARLAYBOOST': 'setSpecialOfferTranslation',
      'FOSO.PARLAYBOOST.0': 'setSpecialOfferTranslation',
      'FOSO.PARLAYBOOST.1': 'setSpecialOfferTranslation',
      'FOSO.PARLAYINSURANCE': 'setSpecialOfferTranslation',
      'FOSO.PARLAYINSURANCE.0': 'setSpecialOfferTranslation',
      'FOSO.PARLAYINSURANCE.1': 'setSpecialOfferTranslation'
    }
    var parseResponse = function (response) {
      for (var i = 0; i < response.length; i++) {
        var item = response[i]
        if (map[item.Code]) {
          var handler = map[item.Code]
          var val = item.Value
          // console.log('val:', val, typeof val)
          // val = item.Value ? parseFloat(item.Value) : item.Value
          if (typeof val !== 'undefined' && handler) {
            // console.log(item.Code + ': ' + val)
            if (item.Code.indexOf('FOSO.') === 0) {
              context.commit(handler, [val, item.Code])
            } else {
              val = val ? parseFloat(val) : val
              if (val) {
                context.commit(handler, val)
              }
            }
          }
        }
      }
    }
    //
    // csvlist: 'TXStakeMinUnit,TXMaxUnitStake,TXMultiStakeMinUnit,TXMaxBetSlipTotalStake,TXMaxBetSlipTotalStakeInRunning,TxSlipTotalStakeMin,TxMaxPotentialSlipPayout,TxUnitStakeIncrement,TXStakeMaxUnit'
    let csvlist = []
    for (var p in map) {
      if (map[p]) {
        csvlist.push(p)
      }
    }
    csvlist = csvlist.join(',')
    //
    return new Promise((resolve) => {
      lib.kansas.psParams({
        csvlist: csvlist
      }).then(response => {
        // console.log(response)
        if (response && response.data) {
          parseResponse(response.data)
          // gedDisputeInfoFromResponse(response.data)
        }
      }).catch((error) => {
        console.log('fetchBetSlipParams error')
        console.log(error)
      }).finally(() => {
        resolve()
      })
    })
  }
}

export default actions
