import storeBetSlip from './actions/storeBetSlip'
import translations from './actions/translations'
import fetchParams from './actions/fetchParams'
import toggleSelection from './actions/toggleSelection'
import getCalculations from './actions/getCalculations'
import updateBetSlip from './actions/updateBetSlip'
import injectSelections from './actions/injectSelections'
import derivatives from './actions/derivatives'
import teasers from './actions/teasers'
import pitchers from './actions/pitchers'
import buyPoints from './actions/buyPoints'
import betPlacement from './actions/betPlacement'
import betPlacementProcessing from './actions/betPlacementProcessing'
import betSlipChecks from './actions/betSlipChecks'
import GTM from './actions/GTM'
import promotions from './actions/promotions'
import storePlacedBetEvents from './actions/storePlacedBetEvents'

const actions = {
  saveToStorage: storeBetSlip.saveToStorage,
  getFromStorage: storeBetSlip.getFromStorage,
  clearStoredBetSlip: storeBetSlip.clearStoredBetSlip,
  checkBetSlipOwner: storeBetSlip.checkBetSlipOwner,

  fetchBettingParams: fetchParams.fetchBettingParams,
  fetchCoreParams: fetchParams.fetchCoreParams,
  fetchBetSlipParams: fetchParams.fetchBetSlipParams,

  updateTranslations: translations.updateTranslations,

  toggleBetslipSelection: toggleSelection.toggleBetslipSelection,
  addSelection: toggleSelection.addSelection,
  removeSelection: toggleSelection.removeSelection,
  unsubscribeFromMarket: toggleSelection.unsubscribeFromMarket,
  unsubscribeFromAllMarkets: toggleSelection.unsubscribeFromAllMarkets,
  clearBetSlip: toggleSelection.clearBetSlip,
  clearFastBetSlip: toggleSelection.clearFastBetSlip,
  activateBetslipMsg: toggleSelection.activateBetslipMsg,

  checkForBetSlipUpdate: updateBetSlip.checkForBetSlipUpdate,
  setBetSlipChange: updateBetSlip.setBetSlipChange,
  updateBetSlip: updateBetSlip.updateBetSlip,
  scheduleBetSlipUpdate: updateBetSlip.scheduleBetSlipUpdate,
  updateBetSlipSelections: updateBetSlip.updateBetSlipSelections,
  updateStoredBetSlipSelections: updateBetSlip.updateStoredBetSlipSelections,
  resetBetSlipChanges: updateBetSlip.resetBetSlipChanges,
  acceptChanges: updateBetSlip.acceptChanges,

  getAllowedBetTypesAndReturns: getCalculations.getAllowedBetTypesAndReturns,
  scheduleGetABTnR: getCalculations.scheduleGetABTnR,
  getAllowedBetTypesAndReturns4TeaserGroup: getCalculations.getAllowedBetTypesAndReturns4TeaserGroup,

  checkDerivatives: derivatives.checkDerivatives,
  fetchDerivatives: derivatives.fetchDerivatives,
  updateDerivative: derivatives.updateDerivative,

  scheduleGetTeaserGroups: teasers.scheduleGetTeaserGroups,
  getTeasers: teasers.getTeasers,
  getTeaserGroups: teasers.getTeaserGroups,

  processPitchers: pitchers.processPitchers,
  updatePitchers: pitchers.updatePitchers,

  processBuyPoints: buyPoints.processBuyPoints,
  updateBuyPoints: buyPoints.updateBuyPoints,

  injectselections: injectSelections.injectselections,
  fetchMultipleSelections: injectSelections.fetchMultipleSelections,

  initPlaceBet: betPlacement.initPlaceBet,
  createBetSlip: betPlacement.createBetSlip,
  getInRunningDelay: betPlacement.getInRunningDelay,
  placeBetSlip: betPlacement.placeBetSlip,
  dismissBetSlip: betPlacement.dismissBetSlip,
  countDown: betPlacement.countDown,
  stopCountDown: betPlacement.stopCountDown,
  getActualBetGracePeriod: betPlacement.getActualBetGracePeriod,
  resetGracePeriod: betPlacement.resetGracePeriod,
  rejectBetSlip: betPlacement.rejectBetSlip,
  confirmBetSlip: betPlacement.confirmBetSlip,
  scheduleBetSlipStatusUpdate: betPlacement.scheduleBetSlipStatusUpdate,
  cancelBetSlipStatusUpdate: betPlacement.cancelBetSlipStatusUpdate,
  getBetSlipStatus: betPlacement.getBetSlipStatus,
  getBetSlip: betPlacement.getBetSlip,
  processReferredBetSlip: betPlacement.processReferredBetSlip,
  getReferredBets: betPlacement.getReferredBets,
  clearAttemptedBetSlip: betPlacement.clearAttemptedBetSlip,

  processBetPlacementResult: betPlacementProcessing.processBetPlacementResult,

  betSlipChecks: betSlipChecks.betSlipChecks,

  dispatchGTM: GTM.dispatchGTM,
  processSelectionsForGTMaddRem: GTM.processSelectionsForGTMaddRem,
  processSelectionsForGTM: GTM.processSelectionsForGTM,
  sendGTMBetSuccess: GTM.sendGTMBetSuccess,
  sendGTMBetStatus: GTM.sendGTMBetStatus,
  sendGTMRemoveAllSelectionsFromBetslip: GTM.sendGTMRemoveAllSelectionsFromBetslip,
  sendGTMRemoveSelectionFromBetslip: GTM.sendGTMRemoveSelectionFromBetslip,
  sendGTMAddSelectionToBetslip: GTM.sendGTMAddSelectionToBetslip,
  sendGTMBetAttempt: GTM.sendGTMBetAttempt,
  sendGTMBetError: GTM.sendGTMBetError,
  sendGTMbetslipClosed: GTM.sendGTMbetslipClosed,

  triggerFetchPromotions: promotions.triggerFetchPromotions,
  getPendingVouchers: promotions.getPendingVouchers,
  fetchPromotions: promotions.fetchPromotions,
  fetchPromotionsOnToggle: promotions.fetchPromotionsOnToggle,
  processSuggestedBonus: promotions.processSuggestedBonus,

  storePlacedBetEvents: storePlacedBetEvents.storePlacedBetEvents,
  getStoredBetsOnEvents: storePlacedBetEvents.getStoredBetsOnEvents,
  clearOldEvents: storePlacedBetEvents.clearOldEvents
}

export default actions
