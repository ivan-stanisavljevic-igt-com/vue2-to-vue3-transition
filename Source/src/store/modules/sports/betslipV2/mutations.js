import Vue from 'vue'
import constants from './constants'

let clone = function (obj) {
  return JSON.parse(JSON.stringify(obj))
}

const mutations = {
  setActiveBetSlipHistoryTab (state, tab) {
    // !!! USED BY EXTERNAL COMPONENT !!!
    let tab2 = state.historyTabs.indexOf(tab) >= 0 ? tab : ''
    Vue.set(state, 'historyTab', tab2)
  },
  setCloseFromParent (state, val) {
    // !!! USED BY EXTERNAL COMPONENT !!!
    Vue.set(state, 'closeFromParent', val)
  },
  setActiveBetSlip (state, id) {
    // !!! USED BY EXTERNAL COMPONENT !!!
    Vue.set(state, 'activeBetSlip', id)
  },

  setAddingMiltipleSelections (state, val) {
    Vue.set(state.addingMiltipleSelections, 'inProgress', val)
  },

  // Betting Params - Core
  setBPCisFOPreferredInSingles (state, val) {
    if (typeof val === 'string') {
      val = val.trim()
      val = val.toLowerCase()
    }
    val = JSON.parse(val)
    window.ctsautoconf = window.ctsautoconf || {}
    if (window.ctsautoconf.BETSLIP) {
      window.ctsautoconf.BETSLIP.isFOPreferredInSingles = val
    }
    Vue.set(state, 'isFOPreferredInSingles', val)
  },
  setBPCisFPPreferredInMultiples (state, val) {
    // console.log('setBPCisFPPreferredInMultiples')
    if (typeof val === 'string') {
      val = val.trim()
      val = val.toLowerCase()
    }
    val = JSON.parse(val)
    window.ctsautoconf = window.ctsautoconf || {}
    if (window.ctsautoconf.BETSLIP) {
      window.ctsautoconf.BETSLIP.isFPPreferredInMultiples = val
    }
    Vue.set(state, 'isFPPreferredInMultiples', val)
  },

  // Betting Params - BetSlip
  setMultiSinglesStake (state, val) {
    Vue.set(state, 'multiSinglesStake', val)
  },
  setUnitStakeMin (state, val) {
    Vue.set(state, 'unitStakeMin', val)
    Vue.set(state.stakeLimits.min, 'PerSelection', val)
    // Vue.set(state.stakeLimits.min, 'PerBetType', val)
  },
  setMultiStakeMinUnit (state, val) {
    Vue.set(state.stakeLimits.min, 'PerBetType', val)
  },
  setUnitStakeMax (state, val) {
    Vue.set(state, 'unitStakeMax', val)
    Vue.set(state.stakeLimits.max, 'PerSelection', val)
    Vue.set(state.stakeLimits.max, 'PerBetType', val)
  },
  setSlipTotalStakeMax (state, val) {
    Vue.set(state, 'slipTotalStakeMax', val)
  },
  setSlipTotalStakeMaxInPlay (state, val) {
    Vue.set(state, 'slipTotalStakeMaxInPlay', val)
  },
  setMaxPotentialSlipPayout (state, val) {
    Vue.set(state, 'maxPotentialSlipPayout', val)
  },
  setSlipTotalStakeMin (state, val) {
    Vue.set(state, 'slipTotalStakeMin', val)
  },
  setUnitStakeIncrement (state, val) {
    Vue.set(state, 'unitStakeIncrement', val)
  },
  setStakeMaxUnit (state, val) {
    Vue.set(state, 'stakeMaxUnit', val)
  },
  setTotalBetSlipMinUnit (state, val) {
    Vue.set(state, 'totalBetSlipMinUnit', val)
  },

  getConfig (state) {
    // console.log('BetSlip getCongig')
    let storeData = function (obj, path) {
      path = path || []
      for (var i in obj) {
        if (obj.hasOwnProperty(i)) {
          if (typeof obj[i] === 'object' && !Array.isArray(obj[i])) {
            storeData(obj[i], path.concat(i))
          } else {
            var target = state
            if (path.length) {
              path.forEach(function (k) {
                if (!target[k]) {
                  Vue.set(target, k, {})
                }
                target = target[k]
              })
            }
            // console.log(path.concat(i).join('.') + ': ' + obj[i])
            Vue.set(target, i, obj[i])
          }
        }
      }
    }
    //
    var data = (window.ctsautoconf && window.ctsautoconf.BETSLIP) || {}
    storeData(data)
    // console.log('state:')
    // console.log(JSON.stringify(state))
  },
  getConfigToState (state) {
    // console.log('BetSlip getCongig')
    var data = window.ctsautoconf.BETSLIP
    for (var i in data) {
      Vue.set(state, i, data[i])
    }
  },
  setTab (state, id) {
    Vue.set(state, 'tab', id)
  },
  setPriceType (state, selection) {
    // console.log('setPriceType')
    let csvpricetypes = selection.csvpricetypes
    let priceType = 'CP'
    let priceTypePerBetType = {S: priceType, Multi: priceType}
    //
    if (state.isFPPreferredInMultiples && csvpricetypes && csvpricetypes.includes('FP')) {
      priceType = 'FP'
      priceTypePerBetType.Multi = priceType
    }
    //
    if (csvpricetypes && csvpricetypes.includes('XP') && ((selection.estimatepriceup && selection.estimatepricedown) ||
      (!csvpricetypes.includes('CP') && selection.isInjectedFrom3rdParty))) {
      priceType = 'XP'
      priceTypePerBetType.S = priceType
      priceTypePerBetType.Multi = priceType
    }
    //
    Vue.set(selection, 'pricetype', priceType)
    Vue.set(selection, 'priceTypePerBetType', priceTypePerBetType)
  },
  clearStakesAndReturns (state) {
    Vue.set(state, 'betTypeStakes', clone(constants.initialBetTypeStakes))
    Vue.set(state, 'returns', clone(constants.initialReturns))
    Vue.set(state, 'multiSinglesStake', null)
  },
  clearBetSlip (state) {
    // console.log('Mutation clearBetSlip')
    Vue.set(state, 'betslipSelectionsIds', {})
    Vue.set(state, 'betslipSelections', [])
    Vue.set(state, 'betslipSelectionIds', [])
    Vue.set(state, 'markets', {})
    Vue.set(state, 'idfomarkets', {})
    Vue.set(state, 'idfoevents', {})
    Vue.set(state, 'allowedBetTypesAndReturns', clone(constants.initialABTnRperTab))
    Vue.set(state, 'betTypeStakes', clone(constants.initialBetTypeStakes))
    Vue.set(state, 'returns', clone(constants.initialReturns))
    Vue.set(state, 'toggleTime', {})
    Vue.set(state, 'multiSinglesStake', null)
    //
    Vue.set(state, 'tab', 'REGULAR')
    Vue.set(state.optedIn, 'REGULAR', {})
    Vue.set(state.optedIn, 'RR', {})
    Vue.set(state.optedIn, 'TEASER', {})
    Vue.set(state.derivatives.teasers, 'T', clone(constants.initialTeasers))
    for (let a in state.derivatives.teasers.activeByGroup) {
      Vue.set(state.derivatives.teasers.activeByGroup, a, '')
    }
    Vue.set(state.derivatives.teasers, 'teaserGroups', [])
    Vue.set(state.derivatives.pitchers, 'derived', {})
    Vue.set(state.derivatives.pitchers, 'sourceMap', {})
    Vue.set(state.derivatives.buyPoints, 'derived', {})
    Vue.set(state.derivatives.buyPoints, 'sourceMap', {})
  },
  killHlite (state) {
    // console.log('killHlite')
    var v = state.clearMarkings
    v += 1
    Vue.set(state, 'clearMarkings', v)
  },

  clearMarkings (state) {
    Vue.set(state, 'clearMarkings', 0)
  },

  resetAllowedBetTypesAndReturns (state) {
    // console.log('resetAllowedBetTypesAndReturns')
    Vue.set(state, 'gettingABTnR', false)
    Vue.set(state, 'allowedBetTypesAndReturns', clone(constants.initialABTnRperTab))
    Vue.set(state.allowedBetTypesAndReturnsRequestData, 'REGULAR', '')
    Vue.set(state.allowedBetTypesAndReturnsRequestData, 'RR', '')
    Vue.set(state.allowedBetTypesAndReturnsRequestData, 'TEASER', {})
  },
  resetABTnR4Teaser (state, sport) {
    // console.log('resetABTnR4Teaser')
    Vue.set(state.allowedBetTypesAndReturns.TEASER, sport, clone(constants.initialABTnR))
  },
  setActiveTeaser (state, arr) {
    Vue.set(state.derivatives.teasers.activeByGroup, arr[0], arr[1])
  },
  resetActiveTeaser (state) {
    for (let a in state.derivatives.teasers.activeByGroup) {
      // console.log(a + ': ' + state.derivatives.teasers.activeByGroup[a])
      var tg = state.derivatives.teasers && state.derivatives.teasers.teaserGroups &&
        state.derivatives.teasers.teaserGroups.find(g => g.idFoSport === a)
      if (!(tg && tg.Selections && tg.Selections.length)) {
        // Vue.set(state.derivatives.teasers.activeByGroup, a, state.config.derivatives.teasers.defaultActiveLevel[a])
        Vue.set(state.derivatives.teasers.activeByGroup, a, '')
      }
    }
  },
  setReInitPitchers (state, val) {
    Vue.set(state.derivatives.pitchers, 'reInit', val)
  },
  setShowAcceptingChangesInfo (state, val) {
    state.showAcceptingChangesInfo = val
  },

  setCurrentBetSlipState (state, id) {
    Vue.set(state, 'currentBetSlipState', id)
  },
  setAttemptedBetSlip (state, betSlip) {
    Vue.set(state.attemptedBetSlip, 'betSlip', betSlip)
  },
  setAttemptedBetSlipResponse (state, response) {
    Vue.set(state.attemptedBetSlip, 'response', response)
  },
  setAttemptedBetSlipStatus (state, response) {
    Vue.set(state.attemptedBetSlip, 'betSlipStatus', response)
  },
  setInRefferal (state, bool) {
    Vue.set(state.attemptedBetSlip, 'inRefferal', bool)
  },
  dismissErrorFromSelection (state, id) {
    var v = state.dismissErrorFromSelection
    v += 1
    // Vue.set(state, 'dismissErrorFromSelectionId', id)
    Vue.set(state, 'dismissErrorFromSelection', v)
  },
  setRememberSingleBetSlipStake (state, val) {
    // state.fastBetSlip.rememberSingleBetSlipStake = val
    Vue.set(state.fastBetSlip, 'rememberSingleBetSlipStake', val)
    /*
    if (!val) {
      Vue.set(state.fastBetSlip, 'stake', '')
    }
    */
  },
  setSingleBetSlipStake (state, val) {
    // state.fastBetSlip.stake = val
    if (state.fastBetSlip.rememberSingleBetSlipStake) {
      if (val) {
        // console.log('setSingleBetSlipStake: ' + val)
        Vue.set(state.fastBetSlip, 'stake', val)
      }
    } else {
      val = ''
      // console.log('setSingleBetSlipStake: ' + val)
      Vue.set(state.fastBetSlip, 'stake', val)
    }
  },
  resetPromotions (state, tab) {
    // console.log('resetPromotions')
    Vue.set(state.promotionsData, tab, clone(constants.initialPromotions[tab]))
    Vue.set(state.promotionsData.PerTab, tab, 0)
  },
  setSpecialOfferTranslation (state, dataArr) {
    let [valueString, item] = dataArr
    // console.log('setMultiStakeMinUnit:', 'item:', item, 'val:', valueString)
    let parts = item.split('.')
    let id = parts[1]
    let legsToAdd = parts[2]
    let key = 'SpecialOffer.' + id
    if (legsToAdd === '0') {
      key += '.eligible'
    } else {
      key += '.offer.addLeg' + (legsToAdd !== '1' ? 's' : '')
    }
    valueString = valueString.replace('#01', '%{shortDescription}')
    valueString = valueString.replace('#03', '%{legsToAdd}')
    console.log('Add translation:', key, ':', valueString)
    Vue.set(state.config.specialOffers.translations, key, valueString)
  },
  resetABTnRrequestData (state) {
    // console.log('resetABTnRrequestData')
    Vue.set(state, 'allowedBetTypesAndReturnsRequestData', {
      'REGULAR': '',
      'RR': '',
      'TEASER': {}
    })
  }
}

export default mutations
