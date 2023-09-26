const errorsCodes = {
  GEN: ['-20402', '-20403', '-20404', '-20405', '-20406', '-20407', '-20408', '-20409', '-20410', '-20420', '-20425', '-20426', '-20427', '-20428', '-20429', '-20430', '-20435', '-20436', '-20437', '-20439', '-20450', '-20456', '-20457', '-20460', '-20461', '-20477', '-20478', '20205', 'Invalid selections count'],
  ARC: ['-20412', '-20413', '-20414', '-20415', '-20416', '-20417', '-20418', '-20419'],
  CUSTOM: {
    '-20700': false,
    '-20451': 'INSUFFICIENT_FUNDS',
    '-20455': 'INTERRELATED',
    '-20492': 'USER_DAILY_PLAY_TIME_LIMIT_REACHED',
    '-20493': 'USER_MAX_BET_LIMIT_REACHED',
    '-20494': 'USER_SPEND_LIMIT_REACHED',
    '-20486': 'TRADING_LIMIT_REACHED',
    '-20453': 'TOTAL_BETSLIP_MIN_UNIT'
  },
  OTHER: ''
}
// const geolocationErrorCodes = ['-20481', '-20483', '-20484', '-20485']
//
export default {
  handleBetPlacementErrorData
}

function handleBetPlacementErrorData (data) {
  // console.log('handleBetPlacementErrorData action')
  let r = data.result || {}
  let betSlipStatus = data.betSlipStatus
  let errorId = false
  let errT = false
  let other = false
  let action = false
  //
  let checkErrorType = function () {
    let err = null
    let codes = betSlipStatus.StatusCode ? betSlipStatus.StatusCode.split(/[, ]+/) : []
    if (codes.length) {
      codes.forEach(function (code) {
        if (errorsCodes.GEN.indexOf(code) > -1) {
          err = err || 'GEN'
        } else if (errorsCodes.ARC.indexOf(code) > -1) {
          err = err || 'ARC'
        } else if (errorsCodes.CUSTOM[code]) {
          err = errorsCodes.CUSTOM[code]
        }
      })
    }
    return err
  }
  //
  if (r && (r.exceptionType || r.message)) {
    if (r.exceptionType === 'Com.Finsoft.Warp.Connecticut.SessionTimeoutException' ||
      r.exceptionType === 'Com.Finsoft.Warp.Connecticut.Services.UserNotLoggedInException' ||
      // r.exceptionType.indexOf('System.ServiceModel.FaultException') > -1 ||
      r.exceptionType === 'isLoggedOut' ||
      r.message === 'Authorization has been denied for this request.') {
      errorId = 'SESSION_TIMEDOUT'
    } else if (r.exceptionType === 'BetSlip.Check.Failed') {
      errorId = betSlipStatus.errorId[0]
      delete betSlipStatus.errorId
    } else if ((r.exceptionType.indexOf('System.ServiceModel.FaultException') > -1 || r.exceptionType === 'TechnicalException') && r.message) {
      other = r.message
    } else {
      errorId = 'UNKNOWN'
    }
  } else {
    if (betSlipStatus && !betSlipStatus.State) {
      errorId = 'UNKNOWN'
    } else {
      if (betSlipStatus && betSlipStatus.State === 4 && (betSlipStatus.StatusText || betSlipStatus.StatusCode)) {
        errT = checkErrorType()
        if (betSlipStatus.StatusText) {
          if (betSlipStatus.StatusText.indexOf('Invalid selections count') !== -1) {
            errT = 'GEN'
          }
          if (betSlipStatus.StatusText.indexOf('[MMaker-') !== -1) {
            errorId = 'UNKNOWN'
          }
          if (betSlipStatus.StatusText.indexOf('[MMaker-0002020088]') !== -1) {
            // [MMaker-0002020088] Internal service fault [LOG ID:51632351]
            errorId = 'UNKNOWN'
          }
          if (betSlipStatus.StatusText.indexOf('[MMaker-0002110088]') !== -1) {
            errorId = 'SESSION_TIMEDOUT'
          }
          if (betSlipStatus.StatusText.indexOf('[MMaker-0002130088]') !== -1) {
            errorId = 'WAGER_LIMIT'
          }
          if (betSlipStatus.StatusText.indexOf('[MMaker-0002090088]') !== -1) {
            errorId = 'TIME_LIMIT'
          }
          if (betSlipStatus.StatusText.toLowerCase().indexOf('lifetime deposit reached') !== -1) {
            errorId = 'LIFEDEP'
          }
          if ((betSlipStatus.StatusText && (betSlipStatus.StatusText.indexOf('[MMaker-0002190088]') !== -1 ||
            betSlipStatus.StatusText.indexOf('0002190088') !== -1 ||
            betSlipStatus.StatusText.indexOf('-20700') !== -1)) ||
            (betSlipStatus.StatusCode && betSlipStatus.StatusCode.indexOf('-20700') !== -1)) {
            // TODO
            errorId = 'DEPOSIT_THRESHOLD'
            errT = false
          }
        }
      }

      /*
       if (geolocationErrorCodes.includes(betSlipStatus.StatusCode) && (store.getters['getIsOpenedFromWebView'] && externalWalletParams.mobileGeolocationInvalid)) {
       mobileBridge.geolocationInvalid()
       }
       */
    }
  }
  //
  if (errorId === 'SESSION_TIMEDOUT' && data.isLoggedIn) {
    action = 'logOut'
  }
  //
  return {
    errorId: errorId,
    errT: errT,
    other: other,
    action: action
  }
}
