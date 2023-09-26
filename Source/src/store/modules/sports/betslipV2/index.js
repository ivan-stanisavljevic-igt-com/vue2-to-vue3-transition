// import Vue from 'vue'
// import store from '@/store'

import constants from './constants'
import getters from './getters'
import mutations from './mutations'
import actions from './actions'
import config from '@/config'

let clone = function (obj) {
  return JSON.parse(JSON.stringify(obj))
}

const state = {
  translationsLoading: !true,
  betSlipState: {
    0: 'Idle',
    1: 'WaitingToConfirm',
    2: 'LiveCountDown',
    3: 'Spinner',
    4: 'InProgress',
    5: 'Attempted',
    6: 'Acceptable',
    7: 'Canceled',
    8: 'TimedOut',
    9: 'Error',
    10: 'Confirming',
    11: 'Rejecting'
  },
  currentBetSlipState: 0,
  betslipSelectionIds: [],
  betslipSelections: [],
  betslipSelectionsIds: {},
  //
  config: {
    isSST: false,
    isGTMenabled: true,
    allowedMultiSingles: true,
    wagerAllSingles: true,
    tabs: ['REGULAR', 'TEASER', 'RR'],
    maxSno: 16,
    isFastBetEnabled: true,
    popBetSlipOn1stSelection: false,
    showEventTsStart: false,
    showEventTsInBetHistory: false,
    BETSLIP_CHECKBOXES: {
      'REGULAR': false,
      'TEASER': false,
      'RR': false
    },
    confirmBetPlacement: false,
    clearMarkingsAfter: 3,
    updateBetSlipInt: {
      default: 60,
      live: 10
    },
    derivatives: {
      teasers: {
        enabled: true,
        mixed: true,
        priceTypes: ['T1', 'T2', 'T3', 'T4', 'T5'],
        allowInPlayTeasers: false,
        sportsMap: {
          'NFL': 'NFL',
          'COLLFB': 'NFL',
          'BASKETBALL': 'BASKETBALL',
          'COLL BSKT': 'BASKETBALL'
        },
        defaultActiveLevel: {
          BASKETBALL: 'T1',
          COLLBB: 'T1',
          NFL: 'T1',
          COLLFB: 'T1',
          MIXED: 'T1'
        }
      },
      pitchers: {
        enabled: true
      },
      buyPoints: {
        enabled: true,
        sportsMap: {
          'NFL': 'NFL',
          'COLLFB': 'NFL',
          'BASKETBALL': 'BASKETBALL',
          'COLL BSKT': 'BASKETBALL'
        }
      }
    },
    sgpPriceTypes: ['SGM'],
    SGM: {
      enabled: false,
      availableonTabs: ['REGULAR'],
      display: {
        sgpMarkAsNew: true,
        selectionHideBreakpoint: 2,
        showProviderDetailedError: false
      }
    },
    SGMplus: {
      enabled: false,
      availableonTabs: ['REGULAR', 'RR'],
      display: {
        sgpMarkAsNew: true
      }
    },
    useXPBettingService: true,
    placeAsync: true,
    calculateAsync: true,
    geoLocation: {
      enabled: true
    },
    promotions: {
      enabled: true
    },
    mobileFeedback: {
      enabled: false,
      timeOut: 2,
      stake: 10,
      autoHidePrlMsgAfter: 0
    },
    fastBetSlip: {
      preserveStakeForMain: false
    },
    showStatusToConfirm: {
      forReferred: true,
      forAcceptable: true
    },
    recalculate: {
      delay: 5.2,
      attempts: 5
    },
    specialOffers: {
      enabled: false,
      ids: ['PARLAYBOOST', 'PARLAYINSURANCE'],
      translations: {}
    },
    storePlacedBetEvents: true
  },
  placedBetsOnEvents: {},
  recalculateAttempt: 0,
  promotionsData: clone(constants.initialPromotions),
  voucherDiscountAmount: 0,
  promotions: {
    toInt: null,
    pending: false
  },
  showAcceptingChangesInfo: true,
  toggleTime: {},
  //
  tab: 'REGULAR',
  autoAcceptSbTnC: true,
  fastBetSlip: {
    stake: '',
    rememberSingleBetSlipStake: true
  },
  idfomarkets: {},
  markets: {},
  idfoevents: {},
  interRelated: {},
  optedIn: {
    REGULAR: {},
    RR: {},
    TEASER: {}
  },
  isLive: false,
  isInRefferal: false,
  gracePeriodTimedOut: false,
  betPlacementResult: {},
  betSlipStatus: {},
  gettingABTnR: false,
  callABTnRforSingleSelection: true,
  allowedBetTypesAndReturns: clone(constants.initialABTnRperTab),
  allowedBetTypesAndReturnsRequestData: {
    'REGULAR': '',
    'RR': '',
    'TEASER': {}
  },
  betTypeStakes: clone(constants.initialBetTypeStakes),
  multiSinglesStake: null,
  returns: clone(constants.initialReturns),
  timeouts: {
    updateBetSlipInt: null,
    updateBetSlipIntExt: null,
    updateLiveIdsInt: null,
    updateBetSlipStatusInt: null,
    getABTnRint: null,
    killHlite: null,
    autoDismissBetSlip: null,
    getTeaserGroups: null,
    countDownTimeout: null
  },
  clearMarkings: 0,

  stakeLimits: {
    min: {
      PerSelection: 0.1,
      PerBetType: 0.1
    },
    max: {
      PerSelection: 9999999,
      PerBetType: 9999999
    }
  },
  unitStakeMin: 0.01,
  unitStakeMax: 10000,
  maxTakeout: {
    total: {
      inPlay: 0,
      preMatch: 0
    },
    perBetType: {
      inPlay: 0,
      preMatch: 0
    }
  },
  slipTotalStakeMax: 0,
  slipTotalStakeMaxInPlay: 0,
  maxPotentialSlipPayout: 0,
  slipTotalStakeMin: 0,
  unitStakeIncrement: 0,
  stakeMaxUnit: 0,
  totalBetSlipMinUnit: 0,

  requestId: {
    allowedBetTypesAndReturns: 0,
    allowedBetTypesAndReturnsT: 0,
    updateBetSlipSelections: 0,
    allTeasers: 0,
    teaserGroups: 0,
    abtnr: {
      REGULAR: 0,
      TEASER: 0,
      RR: 0,
      teasers: {
        BASKETBALL: 0,
        COLLBB: 0,
        NFL: 0,
        COLLFB: 0,
        MIXED: 0
      }
    }
  },
  isFOPreferredInSingles: true,
  isFPPreferredInMultiples: true,
  //
  closeFromParent: false,
  activeBetSlip: false,
  historyTab: 'none',
  historyTabs: ['', 'active', 'settled'],
  //
  addingMiltipleSelections: {
    inProgress: false,
    allowSuspended: window.ctsautoconf && window.ctsautoconf.INJECT_SELECTIONS_FROM_3RD_PARTY ? window.ctsautoconf.INJECT_SELECTIONS_FROM_3RD_PARTY.allowSuspended : true,
    abortIfHasSuspended: window.ctsautoconf && window.ctsautoconf.INJECT_SELECTIONS_FROM_3RD_PARTY ? window.ctsautoconf.INJECT_SELECTIONS_FROM_3RD_PARTY.abortIfHasSuspended : false
  },
  derivatives: {
    teasers: {
      sports: ['NFL', 'BASKETBALL'],
      pendingGetTeaserGroups: false,
      fetchingTeaserGroups: false,
      teaserGroups: [],
      activeByGroup: {
        BASKETBALL: '',
        COLLBB: '',
        NFL: '',
        COLLFB: '',
        MIXED: ''
      },
      T: clone(constants.initialTeasers),
      allowedBetTypesAndReturns: clone(constants.initialABTnR),
      spreads: constants.teaserSpreads,
      doUpdate: 0
    },
    pitchers: {
      sports: ['BASEBALL'],
      derived: {},
      sourceMap: {},
      reInit: false
    },
    buyPoints: {
      sports: ['NFL', 'BASKETBALL'],
      marketTypes: ['PS', 'TP'],
      derived: {},
      sourceMap: {}
    }
  },

  betSlipChanges: {
    changeNo: 0
  },

  triggerUpdate: false,

  doBetSlipUpdade: false,

  updateBetSlipScheduledIn: 0,

  updateBetSlipStatusInt: 5,

  attemptedBetSlip: {
    betSlip: {},
    response: {},
    betSlipStatus: {},
    inRefferal: false,
    inRunningDelay: 0,
    gracePeriod: 0
  },

  dismissErrorFromSelection: 0,

  isBBenabled: config.app.autoconf.IS_BUYBACK_ENABLED,

  propsToStore: ['tab', 'betslipSelections', 'betslipSelectionsIds', 'betslipSelectionIds', 'idfomarkets', 'idfoevents', 'markets', 'optedIn', 'betTypeStakes', 'multiSinglesStake', 'activeBetSlip', 'fastBetSlip', 'interRelated', 'derivatives', 'showAcceptingChangesInfo'] //  'derivatives', 'pitchers', 'teasers', 'teasers.active', 'teasers.T'],
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
