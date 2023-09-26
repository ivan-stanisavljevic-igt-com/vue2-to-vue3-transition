import lib from '@/library'
import Vue from 'vue'
import store from '@/store'
import config from '@/config'

const state = {
  poolcategoryRunner: 'RUNNER POOL',
  poolcategoryRacecast: 'RACECAST POOL',
  poolcategoryMultirace: 'MULTIRACE POOL',
  availableRPTypes: ['WIN', 'PLACE', 'SHOW', 'EW' /* this is WINPLACE */, 'WINSHOW', 'PLACESHOW', 'WINPLACESHOW', 'STRAIGHT'],
  availableRCTypes: ['EXACTA', 'TRIFECTA', 'SUPERFECTA', 'EXACT5', 'QUINELLA', 'SUPER HIGH 5'],
  availableMRTypes: ['DOUBLE', 'PICK3', 'PICK4', 'PICK5', 'PICK6', 'JACKPOT', 'PICK7', 'PICK8', 'PICK9', 'PICK10', 'PICK11', 'PICK12', 'GRANDSLAM', 'QUINDBL'],

  selectedBetType: '',
  selectedPool: {},

  selectedSRRunners: {}, // key - idtgrunner as string, value is {runner:{runner object from generator}, finishes: Map(selected finish place: 1/2/3/4/5/6/banker/any) }
  selectedSRTote: {}, // ToteSR content from the time of last selection check
  selectedMRRunners: {},
  selectedMRTote: {}, // ToteMR content from the time of last selection check

  stakeStr: '',
  stake: 0,
  isCalculating: false,
  calculatedBets: [],
  placeBetStatus: '',
  showBetSlip: false
}

const getters = {
  getPoolcategoryRunner (state) { return state.poolcategoryRunner },
  getPoolcategoryRacecast (state) { return state.poolcategoryRacecast },
  getPoolcategoryMultirace (state) { return state.poolcategoryMultirace },
  getAvailableRPTypes (state) { return state.availableRPTypes },
  getAvailableRCTypes (state) { return state.availableRCTypes },
  getAvailableSRTypes (state) { return state.availableRPTypes.concat(state.availableRCTypes) },
  getAvailableMRTypes (state) { return state.availableMRTypes },
  getNumberOfRPLines (state) {
    let xselectedSRRunners = state.selectedSRRunners
    return Object.keys(xselectedSRRunners).length
  },

  getSelectedPool (state) { return state.selectedPool },
  getSelectedBetType (state) { return state.selectedBetType },
  getSelectedBetTypeData (state) {
    let btData = null
    if (state.selectedPool && state.selectedPool.bettypes) {
      let bts = state.selectedPool.bettypes.filter(bt => bt.id === state.selectedBetType)
      if (bts && bts.length === 1) { btData = bts[0] }
    }
    return btData
  },

  getSelectedSRRunners (state) { return state.selectedSRRunners },
  getSelectedSRTote (state) { return state.selectedSRTote },
  getSelectedMRRunners (state) { return state.selectedMRRunners },
  getSelectedMRTote (state) { return state.selectedMRTote },

  getStake (state) { return state.stake },
  getStakeStr (state) { return state.stakeStr },
  getIsCalculating (state) { return state.isCalculating },
  getCalculatedBets (state) { return state.calculatedBets },
  getPlaceBetStatus (state) { return state.placeBetStatus },
  getShowBetSlip (state) { return state.showBetSlip },

  /**
   * Check what is the current state of the bets
   * @param {any} state
   * @returns {Object} object with overall state of things in betslip. { isComplete: has all runenrs/legs/stake/etc selected/filled, isValid: does Stake conform to all validation rules (min, max, increment, etc), invalids: object with key/texts for each invalid thing in betslip }
   */
  getBetslipValidity (state, getters) {
    let res = { isComplete: true, isCalculated: true, isValid: true, invalids: {} }
    let selectedBetType = state.selectedBetType
    let selectedBetTypeData = getters.getSelectedBetTypeData
    let selectedPool = state.selectedPool
    let selectedSRRunners = state.selectedSRRunners
    let selectedMRRunners = state.selectedMRRunners
    let calculatedBets = state.calculatedBets

    let xRaces = new Map()
    let xRunners = new Map()
    let xFinishes = new Map()

    let isLoggedIn = store.getters['isLoggedIn']
    // check is betting allowed :: ActionBet
    if (isLoggedIn) {
      let customerContextObject = store.getters['getCustomerContext']
      let canPlaceBet = customerContextObject.ActionBet
      if (!canPlaceBet) {
        res.isValid = false; res.invalids.EXCLUDED_FOR_BETTING = { reason: customerContextObject.ActionBetReason }
      }
    }

    if (!selectedPool || !selectedPool.category) {
      res.isComplete = false; res.invalids.ZERO_RUNNERS = {}
    } else {
      switch (selectedPool.category) {
        case 'RUNNER POOL':
          if (Object.values(selectedSRRunners).length < 1) { res.isComplete = false; res.invalids.ZERO_RUNNERS = {} }
          break

        case 'RACECAST POOL':
          if (selectedSRRunners) {
            Object.values(selectedSRRunners).forEach((rnrdata, rnrdataKey) => {
              xRaces.set('exists', 1)

              if (!xRunners.has(rnrdataKey)) { xRunners.set(rnrdataKey, 0) }
              xRunners.set(rnrdataKey, xRunners.get(rnrdataKey) + 1)

              rnrdata.finishes.forEach(finish => {
                if (!xFinishes.has(finish)) { xFinishes.set(finish, 0) }
                xFinishes.set(finish, xFinishes.get(finish) + 1)
              })
            })
          }

          if (selectedBetTypeData) {
            if (xRunners.size < 1) {
              res.isComplete = false; res.invalids.ZERO_RUNNERS = {}
            } else if (selectedPool.nooflegs4pooltype && selectedPool.nooflegs4pooltype > xRunners.size) {
              res.isComplete = false; res.invalids.TOO_FEW_RUNNERS = {}
            } if (selectedPool.type === 'EXACTA' && selectedBetType === 'FLOATING_BANKER' && xRunners.size < 3) {
              res.isComplete = false; res.invalids.TOO_FEW_RUNNERS = {} // NVPS175j - explicitly disable 2 runner Exacta Key Box until enabled in BetCalc
            } else {
              switch (selectedBetType) {
                case 'STRAIGHT':
                  if (selectedPool.nooflegs4pooltype && selectedPool.nooflegs4pooltype > xFinishes.size) { res.isComplete = false; res.invalids.RC_ZERO_RUNNER4FINISH = {} }
                  break

                case 'NO_OPTION':
                case 'PERMUTATION':
                  if (!xFinishes.has('any')) {
                    res.isComplete = false; res.invalids.ZERO_RUNNER4ANY = {}
                  } else if (selectedBetTypeData.minlegcount && selectedBetTypeData.minlegcount > xFinishes.get('any')) {
                    res.isComplete = false; res.invalids.TOO_FEW_RUNNER4ANY = {}
                  } else if (selectedBetTypeData.maxlegcount && selectedBetTypeData.minlegcount < xFinishes.get('any')) {
                    res.isComplete = false; res.invalids.TOO_MANY_RUNNER4ANY = {}
                  }
                  break

                case 'BANKER':
                case 'FLOATING_BANKER':
                  if (!xFinishes.has('any')) {
                    res.isComplete = false; res.invalids.ZERO_RUNNER4ANY = {}
                  } else if (xFinishes.get('any') < selectedPool.nooflegs4pooltype - 1) {
                    res.isComplete = false; res.invalids.TOO_FEW_RUNNER4ANY = {}
                  }

                  if (!xFinishes.has('banker')) {
                    res.isComplete = false; res.invalids.ZERO_RUNNER4BANKER = {}
                  } else {
                    let maxAnyBankerCount = selectedBetType === 'BANKER' ? selectedBetTypeData.maxbankerscount : selectedBetTypeData.maxfloatingbankerscount
                    if (maxAnyBankerCount && maxAnyBankerCount > 0 && xFinishes.get('banker') > maxAnyBankerCount) { res.isComplete = false; res.invalids.TOO_MANY_BANKERS = {} }
                  }
                  break
              }
            }
          } else {
            res.isComplete = false
          }
          break

        case 'MULTIRACE POOL':
          if (selectedMRRunners) {
            Object.values(selectedMRRunners).forEach((rnrdata, rnrdataKey) => {
              xRaces.set(rnrdataKey + '-exists', 1)
            })
            if (selectedPool.noofraces4pooltype && selectedPool.noofraces4pooltype !== xRaces.size) { res.isComplete = false; res.invalids.MR_RACE_WITHOUT_RUNNER = {} }
          }
          break
      }
    }
    if (!res.isComplete) { res.isValid = false }

    if (res.isComplete && (!calculatedBets || calculatedBets.length < 1 || calculatedBets[0].NoOfCombinations < 1)) {
      res.isCalculated = false; res.invalids.BET_NOT_CALCULATED = {}
    }
    if (!res.isCalculated) { res.isValid = false }

    if (res.isComplete && res.isCalculated) {
      let unitStake = state.stake
      let totalStake = unitStake * calculatedBets[0].NoOfCombinations

      if (selectedBetTypeData.maxustake === 0 && selectedBetTypeData.maxtstake === 0) {
        res.isValid = false; res.invalids.BETTING_BLOCKED = {}
      } else if (Number.isNaN(unitStake) || unitStake === 0) {
        res.isValid = false; res.invalids.STAKE_ZERO = {}
      } else {
        let noOfCombinations = calculatedBets[0].NoOfCombinations
        let activeMinUnitStake = selectedBetTypeData.sminustakecombos && calculatedBets[0].NoOfCombinations >= selectedBetTypeData.sminustakecombos ? selectedBetTypeData.sminustake : selectedBetTypeData.minustake
        let activeMaxUnitStake = selectedBetTypeData.smaxustakecombos && calculatedBets[0].NoOfCombinations >= selectedBetTypeData.smaxustakecombos ? selectedBetTypeData.smaxustake : selectedBetTypeData.maxustake

        if (unitStake < activeMinUnitStake) {
          res.isValid = false; res.invalids.STAKE_LIMIT_MINUNITSTAKE = { stake: unitStake, limit: activeMinUnitStake }
        }
        if (unitStake > activeMaxUnitStake) {
          res.isValid = false; res.invalids.STAKE_LIMIT_MAXUNITSTAKE = { stake: unitStake, limit: activeMaxUnitStake }
        }

        let checkIsValidIncrement = function (paramStake, paramIncrement) {
          let precision = 1000
          let divRemainder = (Math.round(paramStake * precision) % Math.round(paramIncrement * precision)) / precision
          let incrementRounded = Math.round(paramIncrement * precision) / precision
          // the remaining should be very close to 0 or the increment, otherwise it is an error
          return divRemainder === 0 || divRemainder === incrementRounded
        }

        if (selectedBetTypeData.stakeincrementinmin && selectedBetTypeData.stakeincrementinmin === true) {
          let increment = activeMinUnitStake
          if (!checkIsValidIncrement(unitStake, increment)) {
            res.isValid = false; res.invalids.STAKE_LIMIT_STAKEINCREMENT = { stake: unitStake, limit: increment }
          }
        } else if (typeof selectedBetTypeData.stakeincrement !== 'undefined' && selectedBetTypeData.stakeincrement === 0) {
          // increment is disabled, only min stake is accepted
          if (unitStake < activeMinUnitStake || unitStake !== totalStake) {
            res.isValid = false; res.invalids.STAKE_LIMIT_MINSTAKEONLY = { stake: unitStake, limit: activeMinUnitStake }
          }
        } else if (selectedBetTypeData.stakeincrement && selectedBetTypeData.stakeincrement > 0.01) {
          let increment = selectedBetTypeData.stakeincrement
          if (increment > activeMinUnitStake) { increment = activeMinUnitStake } /* use different increment for small min stakes */

          if (!checkIsValidIncrement(unitStake, increment)) {
            res.isValid = false; res.invalids.STAKE_LIMIT_STAKEINCREMENT = { stake: unitStake, limit: increment }
          }
        }

        if (selectedBetTypeData.mintstake && selectedBetTypeData.mintstake > totalStake) {
          res.isValid = false; res.invalids.STAKE_LIMIT_MINTOTALSTAKE = { stake: totalStake, limit: selectedBetTypeData.mintstake }
        }
        if (selectedBetTypeData.maxtstake && selectedBetTypeData.maxtstake < totalStake) {
          res.isValid = false; res.invalids.STAKE_LIMIT_MAXTOTALSTAKE = { stake: totalStake, limit: selectedBetTypeData.maxtstake }
        }

        if (res.isValid && selectedBetTypeData.limittiers) {
          for (let i = 0; i < selectedBetTypeData.limittiers.length; i++) {
            let limit = selectedBetTypeData.limittiers[i] // tiered limit fields: minbetamt, maxbetamt, incrementamt, minbetcost, maxbetcost, mincombs, maxcombs

            if (typeof limit.mincombs !== 'undefined' && limit.mincombs > noOfCombinations) { continue }
            if (typeof limit.maxcombs !== 'undefined' && limit.maxcombs < noOfCombinations) { continue }

            if (typeof limit.minustake !== 'undefined' && unitStake < limit.minustake) {
              res.isValid = false; res.invalids.STAKE_LIMIT_MINUNITSTAKE = { stake: unitStake, limit: limit.minustake }; break
            }
            if (typeof limit.maxustake !== 'undefined' && unitStake > limit.maxustake) {
              res.isValid = false; res.invalids.STAKE_LIMIT_MAXUNITSTAKE = { stake: unitStake, limit: limit.maxustake }; break
            }

            if (typeof limit.stakeincrement !== 'undefined' && limit.stakeincrement > 0.01) {
              let increment = limit.stakeincrement
              if (increment > unitStake || !checkIsValidIncrement(unitStake, increment)) { res.isValid = false; res.invalids.STAKE_LIMIT_STAKEINCREMENT = { stake: unitStake, limit: increment }; break }
            }

            if (typeof limit.mintstake !== 'undefined' && totalStake < limit.mintstake) {
              res.isValid = false; res.invalids.STAKE_LIMIT_MINTOTALSTAKE = { stake: totalStake, limit: limit.mintstake }; break
            }
            if (typeof limit.maxtstake !== 'undefined' && totalStake > limit.maxtstake) {
              res.isValid = false; res.invalids.STAKE_LIMIT_MAXTOTALSTAKE = { stake: totalStake, limit: limit.maxtstake }; break
            }
          }
        }
      }
    }

    // Check that plaeyr BU matches Meeting BU
    if (isLoggedIn) {
      let meetings = store.getters['racecardState/getMeetings'] || []
      let selectedPool = store.getters['pmBetslipState/getSelectedPool']

      let isFound = false
      for (let m = 0; m < meetings.length; m++) {
        if (meetings[m].pooloffers.filter(po => po.id === selectedPool.id).length > 0) {
          isFound = true
          break
        }
      }
      if (!isFound) {
        res.isValid = false; res.invalids.NOT_ALLOWED_FOR_BETTING = {}
      }
    }
    return res
  },
  getReconfiguredBets (toteSr, calculatedBets) {
    let numOfComb = calculatedBets[0].Legs.length
    var calculatedBetsFinal = []
    calculatedBets.forEach(calcBet => {
      let poolOffers = toteSr.pools
      console.log(poolOffers)
      calcBet.NoOfCombinations = numOfComb
      var wOK = false
      var pOK = false
      var sOK = false
      let wCalcBet = { ...calcBet }
      let pCalcBet = { ...calcBet }
      let sCalcBet = { ...calcBet }
      if (poolOffers.filter(offer => offer.type === 'WIN')) {
        wCalcBet.IDTGPoolType = 'WIN'
        wCalcBet.IDTGPoolOffer = poolOffers.filter(offer => offer.type === 'WIN')[0].id
        wOK = true
      }
      if (poolOffers.filter(offer => offer.type === 'PLACE')) {
        pCalcBet.IDTGPoolType = 'PLACE'
        pCalcBet.IDTGPoolOffer = poolOffers.filter(offer => offer.type === 'PLACE')[0].id
        pOK = true
      }
      if (poolOffers.filter(offer => offer.type === 'SHOW')) {
        sCalcBet.IDTGPoolType = 'SHOW'
        sCalcBet.IDTGPoolOffer = poolOffers.filter(offer => offer.type === 'SHOW')[0].id
        sOK = true
      }
      switch (calcBet.IDTGPoolType) {
        case 'EW':
          if (wOK && pOK) {
            calculatedBetsFinal.push(wCalcBet)
            calculatedBetsFinal.push(pCalcBet)
          }
          break
        case 'WINSHOW':
          if (wOK && sOK) {
            calculatedBetsFinal.push(wCalcBet)
            calculatedBetsFinal.push(sCalcBet)
          }
          break
        case 'PLACESHOW':
          if (pOK && sOK) {
            calculatedBetsFinal.push(pCalcBet)
            calculatedBetsFinal.push(sCalcBet)
          }
          break
        case 'WINPLACESHOW':
          if (wOK && pOK && sOK) {
            calculatedBetsFinal.push(wCalcBet)
            calculatedBetsFinal.push(pCalcBet)
            calculatedBetsFinal.push(sCalcBet)
          }
          break
      }
    })
    return calculatedBetsFinal
  },
  getSelectedRunnersCount (state) {
    let selectedSRRunners = state.selectedSRRunners || {}
    let selectedMRRunners = state.selectedMRRunners || {}
    let selectedMRRunnersCount = 0
    Object.keys(selectedMRRunners).forEach(idtgrace => {
      if (selectedMRRunners[idtgrace]) {
        selectedMRRunnersCount += Object.values(selectedMRRunners[idtgrace]).length
      }
    })

    return Object.values(selectedSRRunners).length + selectedMRRunnersCount
  }
}

const actions = {
  toggleSelectedRunner (context, request) {
    // request
    //  idtgrace - race id (multirace only)
    //  runner - runner object
    //  finish - 0/1/2/3/4/5/6/7/banker/any
    //  pool - pool object
    //  bettype - NO_OPTION, STRAIGHT, PERMUTATION, FLOATING_BANKER, BANKER
    //  totesr - ToteSR content (when Runner or Racecast)
    //  totemr - ToteMR content (when Multirace)

    let updateBSData = { pool: request.pool, bettype: request.bettype }
    if (request.totesr) { updateBSData.totesr = request.totesr }
    if (request.totemr) { updateBSData.totemr = request.totemr }
    context.commit('updateBetSlip', updateBSData)

    switch (request.pool.category) {
      case 'RUNNER POOL':
        context.commit('toggleSelectedSRRunner', { runner: request.runner, finish: 0 })
        break

      case 'RACECAST POOL':
        let sBTD = context.getters['getSelectedBetTypeData']
        let sSRRunners = context.getters['getSelectedSRRunners']

        // Runner Repeat - auto remove runner selection(s) for other finishes
        if (sBTD && typeof sBTD.runnerrepeat !== 'undefined' && sBTD.runnerrepeat === 0 && sSRRunners && sSRRunners[request.runner.id.toString()]) {
          sSRRunners[request.runner.id.toString()].finishes.forEach(finish => {
            if (finish !== request.finish) {
              context.commit('removeSelectedSRRunner', { idtgrunner: request.runner.id, finish: finish })
            }
          })
        }

        switch (request.bettype) {
          case 'STRAIGHT':
            if ([1, 2, 3, 4, 5, 6].indexOf(request.finish) > -1) {
              context.commit('toggleSelectedSRRunner', { runner: request.runner, finish: request.finish })
            }
            break

          case 'NO_OPTION':
          case 'PERMUTATION':
            context.commit('toggleSelectedSRRunner', { runner: request.runner, finish: 'any' })

            if (request.pool.type === 'QUINELLA') {
              if (sBTD.id === 'PERMUTATION' && sBTD.minlegcount > Object.values(sSRRunners).length) { // downgrade to NO_OPTION
                context.commit('updateBetSlip', { bettype: 'NO_OPTION' })
              } else if (sBTD.id === 'NO_OPTION' && sBTD.maxlegcount < Object.values(sSRRunners).length) { // upgrade to PERMUTATION
                context.commit('updateBetSlip', { bettype: 'PERMUTATION' })
              }
            }
            break

          case 'BANKER':
          case 'FLOATING_BANKER':
            if (request.finish === 'banker' || request.finish === 'any') {
              let maxAnyBankerCount = request.bettype === 'BANKER' ? sBTD.maxbankerscount : sBTD.maxfloatingbankerscount
              if (request.finish === 'banker' && sBTD && (typeof maxAnyBankerCount === 'undefined' || maxAnyBankerCount < 2) && sSRRunners) {
                Object.values(sSRRunners).forEach(rnrdata => {
                  if (rnrdata.runner.id !== request.runner.id && rnrdata.finishes.has('banker')) {
                    context.commit('removeSelectedSRRunner', { idtgrunner: rnrdata.runner.id, finish: 'banker' })
                  }
                })
              }
              context.commit('toggleSelectedSRRunner', { runner: request.runner, finish: request.finish })
            }
            break
        }
        break

      case 'MULTIRACE POOL':
        context.commit('toggleSelectedMRRunner', request)
        break
    }

    this.dispatch('pmBetslipState/calculateBetSlip', request)
  },
  toggleBetslip (context, request) {
    context.commit('toggleBetslip', request)
    const el = document.body
    var htmlElement = document.querySelector('html')
    let isBetslipvisible = context.getters['getShowBetSlip']
    if (isBetslipvisible) {
      el.classList.add('betslipactive')
      htmlElement.classList.add('overflowHidden')
    } else {
      el.classList.remove('betslipactive')
      htmlElement.classList.remove('overflowHidden')
    }
  },
  collectSRBets (context, request) {
    var tgBets = []
    var legs = []

    let selectedSRRunners = context.getters['getSelectedSRRunners']
    let selectedBetType = context.getters['getSelectedBetType']
    let selectedPool = context.getters['getSelectedPool']
    let selectedSRTote = context.getters['getSelectedSRTote']

    switch (selectedPool.category) {
      case 'RUNNER POOL':
        Object.values(selectedSRRunners).forEach(rnrdata => {
          legs.push({
            'IDTGRunner': rnrdata.runner.id,
            'MeetingNumber': selectedSRTote.meeting.number,
            'RaceNumber': selectedSRTote.race.number,
            'RunnerNumber': rnrdata.runner.num,
            'RunnerName': rnrdata.runner.name,
            'IsFavourite': false,
            'IsField': false,
            'IsBanker': false,
            'LegOrder': 0,
            'Runner2FinishPlace': 0,
            'PoolLegNumber': 0
          })
        })
        break

      case 'RACECAST POOL':
        switch (selectedBetType) {
          case 'STRAIGHT':
            for (let i = 1; i <= selectedPool.nooflegs4pooltype; i++) {
              Object.values(selectedSRRunners).forEach(rnrdata => {
                rnrdata.finishes.forEach(finish => {
                  if (finish === i) {
                    legs.push({
                      'IDTGRunner': rnrdata.runner.id,
                      'MeetingNumber': selectedSRTote.meeting.number,
                      'RaceNumber': selectedSRTote.race.number,
                      'RunnerNumber': rnrdata.runner.num,
                      'RunnerName': rnrdata.runner.name,
                      'IsFavourite': false,
                      'IsField': false,
                      'IsBanker': false,
                      'LegOrder': finish,
                      'Runner2FinishPlace': finish,
                      'PoolLegNumber': 0
                    })
                  }
                })
              })
            }
            break

          case 'NO_OPTION':
            Object.values(selectedSRRunners).forEach(rnrdata => {
              rnrdata.finishes.forEach(finish => {
                if (finish === 'any') {
                  legs.push({
                    'IDTGRunner': rnrdata.runner.id,
                    'MeetingNumber': selectedSRTote.meeting.number,
                    'RaceNumber': selectedSRTote.race.number,
                    'RunnerNumber': rnrdata.runner.num,
                    'RunnerName': rnrdata.runner.name,
                    'IsFavourite': false,
                    'IsField': false,
                    'IsBanker': false,
                    'LegOrder': legs.length + 1,
                    'Runner2FinishPlace': 0,
                    'PoolLegNumber': 0
                  })
                }
              })
            })
            break

          case 'PERMUTATION':
            Object.values(selectedSRRunners).forEach(rnrdata => {
              rnrdata.finishes.forEach(finish => {
                if (finish === 'any') {
                  legs.push({
                    'IDTGRunner': rnrdata.runner.id,
                    'MeetingNumber': selectedSRTote.meeting.number,
                    'RaceNumber': selectedSRTote.race.number,
                    'RunnerNumber': rnrdata.runner.num,
                    'RunnerName': rnrdata.runner.name,
                    'IsFavourite': false,
                    'IsField': false,
                    'IsBanker': false,
                    'LegOrder': 1,
                    'Runner2FinishPlace': 0,
                    'PoolLegNumber': 0
                  })
                }
              })
            })
            break

          case 'BANKER':
          case 'FLOATING_BANKER':
            Object.values(selectedSRRunners).forEach(rnrdata => {
              if (rnrdata.finishes.has('banker')) {
                legs.push({
                  'IDTGRunner': rnrdata.runner.id,
                  'MeetingNumber': selectedSRTote.meeting.number,
                  'RaceNumber': selectedSRTote.race.number,
                  'RunnerNumber': rnrdata.runner.num,
                  'RunnerName': rnrdata.runner.name,
                  'IsFavourite': false,
                  'IsField': false,
                  'IsBanker': true,
                  'LegOrder': 1,
                  'Runner2FinishPlace': 0,
                  'PoolLegNumber': 0
                })
              }
            })

            Object.values(selectedSRRunners).forEach(rnrdata => {
              if (rnrdata.finishes.has('any')) {
                legs.push({
                  'IDTGRunner': rnrdata.runner.id,
                  'MeetingNumber': selectedSRTote.meeting.number,
                  'RaceNumber': selectedSRTote.race.number,
                  'RunnerNumber': rnrdata.runner.num,
                  'RunnerName': rnrdata.runner.name,
                  'IsFavourite': false,
                  'IsField': false,
                  'IsBanker': false,
                  'LegOrder': 2,
                  'Runner2FinishPlace': 0,
                  'PoolLegNumber': 0
                })
              }
            })
        }
        break
      case 'MULTIRACE POOL':
        break
    }

    if (legs.length > 0) {
      tgBets.push({
        'IDTGBetType': selectedBetType,
        'UnitStakeAmount': 0,
        'IDTGPoolType': selectedPool.type,
        'IDTGPoolOffer': selectedPool.id,
        'StakeAmount': 0,
        'NoOfCombinations': 0,
        'FractionalPercentage': 0,
        'Legs': legs
      })
    }

    return tgBets
  },
  collectMRBets (context, request) {
    var tgBets = []
    var legs = []

    let selectedMRRunners = context.getters['getSelectedMRRunners']
    let selectedBetType = context.getters['getSelectedBetType']
    let selectedPool = context.getters['getSelectedPool']
    let selectedMRTote = context.getters['getSelectedMRTote']

    Object.keys(selectedMRRunners).forEach(idtgrace => {
      if (selectedMRRunners[idtgrace]) {
        let raceRunners = selectedMRRunners[idtgrace]
        let race = selectedMRTote.meeting.races.filter(race => race.idtgrace.toString() === idtgrace.toString())[0]
        let legNumber = selectedPool.legs.filter((leg) => {
          return leg.r.toString() === idtgrace
        })[0].n

        Object.values(raceRunners).forEach(runner => {
          legs.push({
            'IDTGRunner': runner.id,
            'MeetingNumber': selectedMRTote.meeting.number,
            'RaceNumber': race.number,
            'RunnerNumber': runner.num,
            'RunnerName': runner.name,
            'IsFavourite': false,
            'IsField': false,
            'IsBanker': false,
            'LegOrder': 0,
            'Runner2FinishPlace': 0,
            'PoolLegNumber': legNumber
          })
        })
      }
    })

    if (legs.length > 0) {
      tgBets.push({
        'IDTGBetType': selectedBetType,
        'UnitStakeAmount': 0,
        'IDTGPoolType': selectedPool.type,
        'IDTGPoolOffer': selectedPool.id,
        'StakeAmount': 0,
        'NoOfCombinations': 0,
        'FractionalPercentage': 0,
        'Legs': legs
      })
    }

    return tgBets
  },
  calculateBetSlip (context, request) {
    let pool = context.getters['getSelectedPool']
    let validity = context.getters['getBetslipValidity']

    // console.log('calculateBetSlip', pool, validity)
    if (validity.isComplete) {
      switch (pool.category) {
        case 'RUNNER POOL':
        case 'RACECAST POOL':
          context.dispatch('collectSRBets', request).then(result => {
            let tgBets = result

            if (tgBets.length > 0) {
              for (let i = 0; i < tgBets.length; i++) { tgBets[i].UnitStakeAmount = 1 }
              let betSlip = { 'IsFree': false, 'TGateBets': tgBets, 'Watermark': Date.now(), 'IDMMPRVoucher': null, 'IDMMPRHappyHour': null }

              context.commit('setIsCalculating', true)
              lib.rpcService.callBroker('ToteService', 'CalculateBetSlip', { betslip: betSlip }).then(response => {
                context.commit('setCalculatedBets', (response.result && response.result.TGateBets) || [])
                context.commit('setIsCalculating', false)
              }).catch((error) => {
                context.commit('setCalculatedBets', [])
                context.commit('setIsCalculating', false)
                console.error('Bet calculation failed: ' + error.message)

                context.commit('setPlaceBetStatus', {
                  'StatusText': 'Bet calculation failed!',
                  'State': -2
                })
              })
            } else {
              context.commit('setCalculatedBets', [])
              context.commit('setIsCalculating', false)
            }
          })
          break

        case 'MULTIRACE POOL':
          context.dispatch('collectMRBets', request).then(result => {
            var tgBets = result

            if (tgBets.length > 0) {
              for (let i = 0; i < tgBets.length; i++) { tgBets[i].UnitStakeAmount = 1 }
              var betSlip = {
                'IsFree': false,
                'TGateBets': tgBets,
                'Watermark': Date.now(),
                'IDMMPRVoucher': null,
                'IDMMPRHappyHour': null
              }

              context.commit('setIsCalculating', true)
              lib.rpcService.callBroker('ToteService', 'CalculateBetSlip', { betslip: betSlip }).then(response => {
                context.commit('setCalculatedBets', (response.result && response.result.TGateBets) || [])
                context.commit('setIsCalculating', false)
              }).catch((error) => {
                context.commit('setCalculatedBets', [])
                context.commit('setIsCalculating', false)
                console.error('Bet calculation failed: ' + error.message)

                context.commit('setPlaceBetStatus', {
                  'StatusText': 'Bet calculation failed!',
                  'State': -2
                })
              })
            } else {
              context.commit('setCalculatedBets', [])
              context.commit('setIsCalculating', false)
            }
          })
          break

        default:
          break
      }
    } else {
      context.commit('setCalculatedBets', [])
      context.commit('setIsCalculating', false)
    }
  },
  updateBetSlip (context, request) {
    context.commit('updateBetSlip', request)
  },
  resetBetSlip (context) {
    context.commit('resetBetSlip')
  },
  resetBetslipStatus (context) {
    context.commit('resetBetslipStatus')
  },
  setStake (context, request) {
    context.commit('setStake', request.stake)
    // this.dispatch('pmBetslipState/calculateBetSlip', request)
  },
  placeBet (context) {
    var self = this
    var calculatedBets = this.getters['pmBetslipState/getCalculatedBets']
    var isLoggedIn = this.getters['isLoggedIn']
    var stake = this.getters['pmBetslipState/getStake']
    var calculatedBetsFinal = []
    if (isLoggedIn) {
      if (calculatedBets && calculatedBets.length > 0 && stake > 0) {
        // check is selection from LDVC provider and is IDTGPOOLTYPE in EW/WS/PS/WPS, then split to separate bets: W, P and S
        if (calculatedBets[0].IDTGPoolType === 'EW' || calculatedBets[0].IDTGPoolType === 'WINSHOW' || calculatedBets[0].IDTGPoolType === 'PLACESHOW' || calculatedBets[0].IDTGPoolType === 'WINPLACESHOW') {
          let toteSr = this.getters['racecardState/getToteSr']
          let provider = toteSr && toteSr.meeting && toteSr.meeting.provider ? toteSr.meeting.provider.toUpperCase() : null
          if (config.app.autoconf.PROVIDERSWITHSEPARATEBETFORWPS.filter(a => a === provider).length > 0) {
            calculatedBetsFinal = getters.getReconfiguredBets(toteSr, calculatedBets)
            if (calculatedBetsFinal.length > 0) {
              calculatedBets = calculatedBetsFinal
              context.commit('setCalculatedBets', calculatedBets)
            } else {
              // error occured, bet cannot be converted
              context.commit('setPlaceBetStatus', {
                'StatusText': 'Due wrong configuration bet cannot be placed!',
                'State': -1
              })
              return
            }
          }
        }
        calculatedBets.forEach(calcBet => {
          calcBet.UnitStakeAmount = stake
          let totalStake = calcBet.NoOfCombinations * stake
          totalStake = Math.round(totalStake * 1000) / 1000
          calcBet.StakeAmount = totalStake
        })

        var betSlip = {
          'IsFree': false,
          'TGateBets': calculatedBets,
          'IDMMPRVoucher': null,
          'IDMMPRHappyHour': null,
          'Watermark': null,
          'channel': null
        }

        context.commit('setPlaceBetStatus', {
          'StatusText': 'Placing bet...',
          'State': 0
        })

        var channel = store.getters['screenState/getMobileBigAndBelow'] ? 'MB' : 'W3'
        betSlip.channel = channel
        lib.rpcService.callBroker('ToteService', 'PlaceTGateBetSlip', { betslip: betSlip }).then(response => {
          if (response && response.result && response.result.IDTGBetSlip) {
            self.dispatch('pmBetslipState/startBetsPlacementStatusCheck', response.result.IDTGBetSlip)
          } else if (response && response.result && response.result.Status) {
            context.commit('setPlaceBetStatus', response.result.Status)
          } else {
            context.commit('setPlaceBetStatus', {
              'StatusText': 'Unknown error occured!',
              'State': -1
            })
          }
        }).catch(error => {
          console.log(error)

          context.commit('setPlaceBetStatus', {
            'StatusText': 'Unknown error occured!',
            'State': -1
          })
        })
      }
    } else {
      context.commit('setPlaceBetStatus', {
        'StatusText': 'Please login to place bet!',
        'State': -10
      })
    }
  },
  startBetsPlacementStatusCheck (context, idtgbetslip) {
    var self = this

    lib.rpcService.callBroker('ToteService', 'GetTGatePlacementState', { idtgbetslip: idtgbetslip }).then(response => {
      if (response.result === 'L') {
        context.commit('setPlaceBetStatus', 'L')

        setTimeout(() => {
          self.dispatch('pmBetslipState/startBetsPlacementStatusCheck', idtgbetslip)
        }, 2000)
      } else {
        store.dispatch('getCustomerContext')
        context.commit('setPlaceBetStatus', response.result)
      }
    }).catch(error => {
      console.log(error)

      context.commit('setPlaceBetStatus', {
        'StatusText': 'Unknown error occured!',
        'State': -1
      })
    })
  }
}

const mutations = {
  toggleSelectedSRRunner (state, data) {
    let key = data.runner.id.toString()
    let finish = data.finish
    if (state.selectedSRRunners[key] && state.selectedSRRunners[key].finishes.size === 1 && state.selectedSRRunners[key].finishes.has(finish)) {
      Vue.delete(state.selectedSRRunners, key)
    } else if (state.selectedSRRunners[key]) {
      let rnrdata = state.selectedSRRunners[key]
      if (rnrdata.finishes.has(finish)) {
        rnrdata.finishes.delete(finish)
      } else {
        rnrdata.finishes.set(finish, finish)
      }
      Vue.set(state.selectedSRRunners, key, rnrdata) // this should trigger reactivity... but it does not :(
      Vue.set(state.selectedSRRunners, 'dummy', new Date().getTime()) // <- trigger reactivity beacuse update of property doesn't do it
      Vue.delete(state.selectedSRRunners, 'dummy')
    } else {
      let rnrdata = { runner: data.runner, finishes: new Map() }
      rnrdata.finishes.set(finish, finish)
      Vue.set(state.selectedSRRunners, key, rnrdata)
    }
  },
  removeSelectedSRRunner (state, data) {
    let key = data.idtgrunner.toString()
    let finish = data.finish || null
    if (finish !== null && state.selectedSRRunners[key]) {
      let rnrdata = state.selectedSRRunners[key]
      if (rnrdata.finishes.has(finish)) {
        rnrdata.finishes.delete(finish)
      }
      if (Object.keys(rnrdata.finishes).length === 0) {
        Vue.delete(state.selectedSRRunners, key)
      } else {
        Vue.set(state.selectedSRRunners, key, rnrdata)
      }
    }
    if (finish === null && state.selectedSRRunners[key]) {
      Vue.delete(state.selectedSRRunners, key)
    }
  },
  toggleSelectedMRRunner (state, data) {
    let key4race = data.idtgrace.toString()
    let key4rnr = data.runner.id.toString()
    if (!state.selectedMRRunners[key4race]) {
      Vue.set(state.selectedMRRunners, key4race, {})
    }

    if (state.selectedMRRunners[key4race] && state.selectedMRRunners[key4race][key4rnr]) {
      Vue.delete(state.selectedMRRunners[key4race], key4rnr)
      if (Object.keys(state.selectedMRRunners[key4race]).length === 0) {
        Vue.set(state.selectedMRRunners, key4race, {})
        Vue.delete(state.selectedMRRunners, [key4race])
      }
    } else {
      Vue.set(state.selectedMRRunners[key4race], key4rnr, data.runner)
    }
  },
  toggleBetslip (state, data) {
    if (data && typeof data.showbetslip !== 'undefined') {
      state.showBetSlip = data.showbetslip === true
    } else {
      state.showBetSlip = !state.showBetSlip
    }
  },
  updateBetSlip (state, data) {
    if (data.pool) { state.selectedPool = data.pool }
    if (data.bettype) { state.selectedBetType = data.bettype }
    if (data.totesr) { state.selectedSRTote = data.totesr }
    if (data.totemr) { state.selectedMRTote = data.totemr }
  },
  resetBetSlip (state) {
    state.selectedPool = {}
    state.selectedBetType = ''
    state.selectedSRRunners = {}
    state.selectedSRTote = {}
    state.selectedMRRunners = {}
    state.selectedMRTote = {}
    state.stakeStr = ''
    state.stake = 0
    state.isCalculating = false
    state.calculatedBets = []
    state.placeBetStatus = ''
  },
  resetBetslipStatus (state) {
    state.placeBetStatus = ''
  },
  setIsCalculating (state, data) {
    state.isCalculating = data
  },
  setCalculatedBets (state, value) {
    state.calculatedBets = value
  },
  setStake (state, value) {
    state.stakeStr = value.toString()
    state.stake = value ? parseFloat(value) : 0
    for (let i = 0; i < state.calculatedBets.length; i++) {
      state.calculatedBets[i].UnitStakeAmount = state.stake
      state.calculatedBets[i].StakeAmount = Math.floor(state.calculatedBets[i].NoOfCombinations * state.stake * 100) / 100
    }
  },
  setPlaceBetStatus (state, value) {
    state.placeBetStatus = value || ''
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
