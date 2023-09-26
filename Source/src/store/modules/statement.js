import lib from '@/library'
import config from '@/config'
import store from '@/store'
import moment from 'moment'
import hcpFormat from '@/library/hcpFormat'

const state = {
  historyHash: '',
  history: {},
  historyStatus: { fetching: false },
  tsRqH: 0,
  tsRqH4BB: 0,
  historyDateRange: { from: null, to: null },
  pageSize: 10,
  pageNumber: -1,
  pageCount: 0,
  activeQueryType: 'SportsBetting',
  showQueryTypeFilter: false,
  lastActiveQueryType: '',
  historyBetQueryStatusSettledOverride: false, // for example 'WonOrLost'; method to override default used method for settled bets ('NonOpen')
  useBB: config.app.autoconf.IS_BUYBACK_ENABLED,
  bb: { bet: null, quote: { }, msg: '', msgtype: '', idfobet: 0 },
  bbStatus: { state: '' },
  tsRqQbb: 0,
  tsRqSbb: 0
}

const getters = {
  getHistory (state) {
    return state.history
  },
  getHistoryStatus (state) {
    return state.historyStatus
  },
  getHistoryDateRange (state) {
    return state.historyDateRange
  },
  getHistoryDateRangeFrom (state) {
    return state.historyDateRange.from
  },
  getPageSize (state) {
    return state.pageSize
  },
  getPageNumber (state) {
    return state.pageNumber
  },
  getPageCount (state) {
    return state.pageCount
  },
  getBB (state) {
    return state.bb
  },
  getBbStatus (state) {
    return state.bbStatus
  },
  historyQueryTypes (state) {
    let historyQueryTypes = []
    if (config.app.autoconf.ROUTERNAVGROUPS && config.app.autoconf.ROUTERNAVGROUPS.statementset) {
      switch (config.app.autoconf.ROUTERNAVGROUPS.statementset) {
        case 'mixed':
          historyQueryTypes = ['All', 'SportsBetting', 'TGate']
          break
        case 'sports':
          historyQueryTypes = ['SportsBetting']
          break
        case 'pm':
          historyQueryTypes = ['TGate']
          break
        default:
          historyQueryTypes = ['SportsBetting']
          break
      }
    } else {
      historyQueryTypes = ['SportsBetting']
    }

    return historyQueryTypes
  },
  activeQueryType (state) {
    let activeQueryType = state.activeQueryType
    if (config.app.autoconf.ROUTERNAVGROUPS && config.app.autoconf.ROUTERNAVGROUPS.statementset) {
      switch (config.app.autoconf.ROUTERNAVGROUPS.statementset) {
        case 'sports':
          activeQueryType = 'SportsBetting'
          break
        case 'pm':
          activeQueryType = 'TGate'
      }
    }
    return activeQueryType
  },
  useBB (state) {
    return state.useBB
  },
  historyBetQueryStatusSettledOverride (state) {
    return state.historyBetQueryStatusSettledOverride
  },
  showQueryTypeFilter (state) {
    return state.showQueryTypeFilter
  }
}

const actions = {
  initStatement (context, data) {
    context.commit('initStatement', data)
    if (data && data.fetchHistory && data.fetchHistory === true) {
      context.dispatch('fetchHistory', data)
    }
  },
  changeHistoryDateRange (context, data) {
    context.commit('setHistoryDateRange', data)
  },
  fetchHistory (context, data) {
    // console.log('fetchHistory')
    let useBB = context.state.useBB
    let args = {
      // string IDDCLanguage : TexasContext texasContext : Standard texas context and DC language parameters
      // string querySize : HistoryBetQuerySize querySize : Required page size. One of the predefined values: Size5, Size10, Size25, Size50
      // int queryPage : int queryPage : Required page (zero based, initial = 0)
      // string queryStatus : HistoryBetQueryStatus queryStatus : Required status filter (ref.: HistoryBet.Status). One of the predefined values: All, Open, NonOpen, Won, WonOrLost.
      // DateTime? queryFrom : DateTime? queryFrom : Required filter for bets of the same or earlier time (ref.: HistoryBet.Created). Optional. Null to avoid.
      // DateTime? queryTo : DateTime? queryTo : Required filter for bets of the same or older time (ref.: HistoryBet.Created). Optional. Null to avoid.
      // string queryType: One of the predefined values: All, SportsBetting, TGBetting or TGBets
    }
    //
    let dateFrom = null
    let dateTo = null
    if (data.historyDateRange && data.historyDateRange.from && data.historyDateRange.to) {
      dateFrom = data.historyDateRange.from
      dateTo = data.historyDateRange.to
    } else if (data.dateFrom && data.dateTo) {
      dateFrom = data.dateFrom
      dateTo = data.dateTo
    }

    if (dateFrom && dateTo) {
      dateFrom = moment(dateFrom)
      dateTo = moment(dateTo)

      dateFrom.hour(0)
      dateFrom.minute(0)
      dateFrom.second(1)

      dateTo.hour(23)
      dateTo.minute(59)
      dateTo.second(59)
    }

    let pageNumber = data.pageNumber ? data.pageNumber : 0
    let pageSize = data.pageSize && ['5', '10', '25', '50'].includes(data.pageSize.toString()) ? data.pageSize.toString() : '10'
    let queryStatus = (data.queryStatus === 'NonOpen' && context.state.historyBetQueryStatusSettledOverride) || data.queryStatus
    queryStatus = queryStatus && ['All', 'Open', 'NonOpen', 'Won', 'WonOrLost'].includes(queryStatus) ? queryStatus : 'All'
    let queryFrom = dateFrom ? dateFrom.format(config.app.dateFormats.iso8601) : null
    let queryTo = dateTo ? dateTo.format(config.app.dateFormats.iso8601) : null
    let queryBB = useBB && data.queryBB === true
    if (data.queryType) {
      context.state.activeQueryType = data.queryType
    }
    let queryType = context.state.activeQueryType || 'All'
    //
    if (context.state.lastActiveQueryType !== context.state.activeQueryType) {
      pageNumber = 0
    }
    context.state.lastActiveQueryType = context.state.activeQueryType

    // Validation
    if (pageNumber < 0) pageNumber = 0
    else if (state.pageCount > 0 && state.pageCount <= pageNumber) { pageNumber = state.pageCount - 1 }

    if (pageNumber === 0) { context.commit('setHistory', undefined) }
    context.commit('setHistoryStatus', { fetching: true })

    data.callParams = { pageNumber: pageNumber, pageSize: pageSize, queryStatus: queryStatus, queryFrom: queryFrom, queryTo: queryTo, queryBB: queryBB }
    let timestamp = new Date().getTime()
    state.tsRqH = timestamp

    let methodName = useBB ? 'GetHistoryBetsBB' : 'GetHistoryBets'
    if (useBB) {
      args = {
        'IDDCLanguage': config.app.language,
        'queryPage': pageNumber,
        'querySize': 'Size' + pageSize,
        'queryStatus': queryStatus,
        'queryFrom': queryFrom,
        'queryTo': queryTo,
        'queryBB': queryBB
      }
    } else {
      args = {
        'language': config.app.language,
        'querySize': 'Size' + pageSize,
        'queryPage': pageNumber,
        'queryStatus': queryStatus,
        'queryFrom': queryFrom,
        'queryTo': queryTo,
        'queryType': queryType
      }
    }

    lib.rpcService.callBroker('PlayspotService', methodName, args).then(response => {
      context.commit('setHistoryStatus', { fetching: false })
      if (response && state.tsRqH === timestamp) {
        state.tsRqH = 0
        if (response && response.result && !response.exceptionType) {
          if (!Array.isArray(response.result.List)) { response.result.List = [] }
          response.result.List.forEach(function (bet) {
            let canHaveReturn = true
            if (bet.SB) {
              let teasersPriceTypes = store.getters['sbBetslipState/teasersPriceTypes']
              let priceTypeNilifiers = ['SP', 'FP', 'WPD', 'PPD', 'SPD'].concat(teasersPriceTypes)
              if (bet.SB && bet.SB.Legs) {
                bet.SB.Legs.forEach(function (leg) {
                  // check if this bet can have calculated return
                  if (priceTypeNilifiers.includes(leg.IDFOPriceType) || !leg.PriceDown || !leg.PriceUp) {
                    canHaveReturn = false
                  }

                  // make a new selection name to include Handicap value
                  let selNameExt = leg.Selection
                  if (leg.HAD && typeof leg.Handicap !== 'undefined') {
                    switch (leg.HAD) {
                      case 'H':
                      case 'D':
                        selNameExt += ' ' + hcpFormat.formatHandicap(leg)
                        break
                      case 'O':
                      case 'U':
                        selNameExt += ' ' + leg.Handicap
                        break
                      case 'A':
                        selNameExt += ' ' + hcpFormat.formatHandicap(leg)
                        break
                    }
                  }
                  leg.SelectionExt = selNameExt
                })

                // extend bet type name
                if ((bet.SB.IDFOBetType === 'A' && bet.SB.BetType === 'Parlay') || (bet.SB.IDFOBetType).indexOf('A-') === 0) {
                  let numOfNonVoidLegs = 0
                  let numOfTeamLegs = 0
                  let lastLegSpread = 0
                  let mixedTeasers = false
                  let teaserLevel = 0
                  bet.SB.Legs.forEach(function (leg) {
                    if (leg.Status && leg.Status.toLowerCase() !== 'void') {
                      numOfNonVoidLegs++
                      // if (teasersPriceTypes.includes(leg.IDFOPriceType) && (lastLegSpread === 0 || leg.Spread === lastLegSpread)) {
                      if (teasersPriceTypes.includes(leg.IDFOPriceType)) {
                        numOfTeamLegs++
                        teaserLevel = leg.IDFOPriceType.slice(-1)
                        if (!mixedTeasers && lastLegSpread === 0) {
                          lastLegSpread = leg.Spread
                        }
                        if (lastLegSpread !== 0 && lastLegSpread !== leg.Spread) {
                          mixedTeasers = true
                          lastLegSpread = 0
                        }
                      }
                    }
                  })

                  if (numOfNonVoidLegs >= 2 && numOfNonVoidLegs === numOfTeamLegs) {
                    // bet.SB.BetTypeExt = numOfNonVoidLegs + ' Team Teaser '
                    bet.SB.BetTypeSpread = lastLegSpread ? (lastLegSpread >= 0 ? '+' : '-') + lastLegSpread : lastLegSpread
                    bet.SB.TeaserLevel = teaserLevel
                    let spread = lastLegSpread ? (lastLegSpread >= 0 ? '+' : '-') + lastLegSpread + ' Spread' : 'Level ' + teaserLevel
                    bet.SB.BetTypeExt = (bet.SB.BetType || 'Teaser') + ' ' + spread + ': ' + numOfNonVoidLegs + ' Team'
                  } else if (numOfNonVoidLegs >= 2) {
                    // bet.SB.BetTypeExt = numOfNonVoidLegs + ' Team Parlay'
                    bet.SB.BetTypeExt = 'Parlay: ' + numOfNonVoidLegs + ' Team'
                    if ((bet.SB.IDFOBetType).indexOf('A-') === 0) {
                      // bet.SB.BetTypeExt = numOfNonVoidLegs + ' Team ' + bet.SB.BetType
                      bet.SB.BetTypeExt = bet.SB.BetType + ': ' + numOfNonVoidLegs + ' Team'
                    }
                  } else {
                    bet.SB.BetTypeExt = bet.SB.BetType
                  }
                }
              }
            }
            bet.canHaveReturn = canHaveReturn

            // extend bet status and add default one
            let statusInner = 'xx'
            if (bet.SB && bet.SB.Indicator && bet.SB.Indicator.toLowerCase() === 'cashout') statusInner = 'boughtback'
            else if (bet.Status) statusInner = bet.Status.toLowerCase()
            bet.statusInner = statusInner

            // resort legs for TG bets
            if (bet.TG && bet.TG.Legs) {
              let legsSorted = bet.TG.Legs.sort((leg1, leg2) => {
                let order = 0
                if (leg1.RaceId < leg2.RaceId) {
                  order = -1
                } else if (leg1.RaceId > leg2.RaceId) {
                  order = 1
                } else if (leg1.FlagBanker === true && leg2.FlagBanker === false) {
                  order = -1
                } else if (leg1.FlagBanker === false && leg2.FlagBanker === true) {
                  order = 1
                } else if (leg1.LegOrder < leg2.LegOrder) {
                  order = -1
                } else if (leg1.LegOrder > leg2.LegOrder) {
                  order = 1
                } else if (leg1.RunnerNumber < leg2.RunnerNumber) {
                  order = -1
                } else if (leg1.RunnerNumber > leg2.RunnerNumber) {
                  order = 1
                }
                return order
              })
              bet.TG.Legs = legsSorted
            }
          })
          response.result.forParams = { queryStatus: data.callParams.queryStatus, queryFrom: data.callParams.queryFrom, queryTo: data.callParams.queryTo, pageSize: data.callParams.pageSize, queryBB: data.callParams.queryBB }
          context.commit('appendHistory', response.result)
        } else {
          context.commit('setHistory', undefined)
        }
      }
    }).catch((response) => {
      if (state.tsRqH === timestamp) {
        let hsObj = { fetching: false }
        if (response.exceptionType && (
          response.exceptionType === 'Com.Finsoft.Warp.Texas.SessionExpiredException' ||
          response.exceptionType === 'Com.Finsoft.Warp.Connecticut.SessionTimeoutException' ||
          response.exceptionType === 'Com.Finsoft.Warp.Connecticut.Services.UserNotLoggedInException')) {
          hsObj.error = 'SessionTimeout'
        }

        state.tsRqH = 0
        context.commit('setHistoryStatus', hsObj)
        context.commit('setHistory', undefined)
      }
    })
  },
  fetchHistoryUpdate4BB (context, data) {
    let bbOffersCount = 0
    let pageSizeByBBOffers = 5
    if (state.tsRqH4BB > 0) return // we have fetch in progress, skip this call
    else {
      if (state.history) {
        state.history.forEach(function (hbet) {
          if (hbet.Quote && hbet.Quote > 0) { bbOffersCount++ }
        })
      }

      if (bbOffersCount > 0 && bbOffersCount <= 5) {
        pageSizeByBBOffers = 5
      } else if (bbOffersCount > 6 && bbOffersCount <= 10) {
        pageSizeByBBOffers = 10
      } else if (bbOffersCount > 11 && bbOffersCount <= 25) {
        pageSizeByBBOffers = 25
      } if (bbOffersCount > 25) {
        pageSizeByBBOffers = 50
      }
    }

    if (bbOffersCount > 0) {
      let timestamp = new Date().getTime()
      state.tsRqH4BB = timestamp

      lib.rpcService.callBroker('PlayspotService', 'GetHistoryBetsBB', {
        'IDDCLanguage': config.app.language, 'queryPage': 0, 'querySize': 'Size' + pageSizeByBBOffers, 'queryStatus': 'Open', 'queryFrom': null, 'queryTo': null, 'queryBB': true
      }).then(response => {
        if (response && state.tsRqH4BB === timestamp) {
          state.tsRqH4BB = 0
          if (response && response.result && !response.exceptionType) {
            response.result.List.forEach(function (bet) {
              if (bet.SB && bet.SB.IDFOBet && bet.Quote && bet.Quote > 0) {
                // bet.Quote = bet.Quote + 1 uncomment to test
                state.history.forEach(function (hbet) {
                  if (hbet.SB && hbet.SB.IDFOBet === bet.SB.IDFOBet && (hbet.Quote !== bet.Quote || hbet.Profit !== bet.Profit)) {
                    context.commit('updateBetInHistory', { idfobet: bet.SB.IDFOBet, Quote: bet.Quote, Profit: bet.Profit })
                  }
                })
              }
            })
          }
        }
      }).catch((response) => {
        state.tsRqH4BB = 0
      })
    }
  },
  clearHistory (context) {
    context.commit('setHistoryStatus', { fetching: false })
    context.commit('setHistory', undefined)
  },
  quoteBuyBack (context, data) {
    // console.log('quoteBuyBack')
    return new Promise((resolve) => {
      let idfobet = 0
      let bet = null

      if (state.history && data.idfobet && data.idfobet > 0) {
        state.history.forEach(function (entry) {
          if (entry.SB && entry.SB.IDFOBet === data.idfobet) {
            idfobet = entry.SB.IDFOBet
            bet = entry
          }
        })
      }

      context.commit('setBbStatus', { state: 'quoting' })
      if (state.bb.bet == null || state.bb.idfobet !== idfobet) {
        let quote = {}
        quote.Amount = bet.Quote
        quote.Profit = bet.Profit
        context.commit('updateBB', { reset: true, bet: bet, quote: quote, idfobet: idfobet })
      }

      let timestamp = new Date().getTime()
      state.tsRqQbb = timestamp

      lib.rpcService.callBroker('BuyBackService', 'QuoteBuyBack', {
        'IDFOBet': idfobet
      }).then(response => {
        context.commit('setBbStatus', { state: '' })
        if (response && state.tsRqQbb === timestamp) {
          state.tsRqQbb = 0
          if (response && response.result && !response.exceptionType) {
            let quote = {}
            quote.Amount = response.result.Amount
            quote.Period = response.result.Period
            quote.Profit = response.result.Profit

            // Cashout - uncomment to simulate offer
            // quote.Amount = 100
            // quote.Profit = -0.01
            // quote.Amount = 10
            // quote.Profit = 0

            if (quote.Amount > 0) {
              context.commit('updateBB', { reset: true, bet: bet, quote: quote, idfobet: idfobet })
            } else {
              context.commit('updateBB', { reset: true, msg: 'NotAvailable', msgtype: 'nok', idfobet: idfobet, bet: bet })
            }
          } else {
            context.commit('updateBB', { reset: true, msg: 'NotAvailable', msgtype: 'nok', idfobet: idfobet, bet: bet })
          }
        }
      }).catch((response) => {
        if (state.tsRqQbb === timestamp) {
          state.tsRqQbb = 0

          if (response.exceptionType && (
            response.exceptionType === 'Com.Finsoft.Warp.Texas.SessionExpiredException' ||
            response.exceptionType === 'Com.Finsoft.Warp.Connecticut.SessionTimeoutException' ||
            response.exceptionType === 'Com.Finsoft.Warp.Connecticut.Services.UserNotLoggedInException')) {
            context.commit('setHistoryStatus', { fetching: false, error: 'SessionTimeout' })
            context.commit('setHistory', undefined)
            context.commit('setBbStatus', { state: '' })
            context.commit('updateBB', { reset: true })
          } else {
            context.commit('setBbStatus', { state: '' })
            context.commit('updateBB', { reset: true, msg: 'NotAvailable', msgtype: 'nok', idfobet: idfobet, bet: bet })
          }
        }
      }).finally(() => {
        resolve()
      })
    })
  },
  settleBuyBack (context, data) {
    // console.log('settleBuyBack')
    return new Promise((resolve, reject) => {
      let idfobet = 0
      let GTMdata = null
      let bet = null
      let bbres = { type: 'none', msg: '', idfobet: 0, bet: null }

      if (state.history && data.idfobet && data.idfobet > 0) {
        state.history.forEach(function (entry) {
          if (entry.SB && entry.SB.IDFOBet === data.idfobet) {
            GTMdata = entry
            idfobet = entry.SB.IDFOBet
            bet = entry

            bbres.idfobet = idfobet
            bbres.bet = bet
          }
        })
      }

      context.commit('setBbStatus', { state: 'settling' })
      let timestamp = new Date().getTime()
      state.tsRqSbb = timestamp

      lib.rpcService.callBroker('BuyBackService', 'SettleBuyBack', {
        'IDFOBet': idfobet
      }).then(response => {
        if (response && state.tsRqSbb === timestamp) {
          context.commit('setBbStatus', { state: '' })
          state.tsRqSbb = 0

          // status (0 = not available, 1 = OK, 2 = reoffer)
          if (response && response.result && !response.exceptionType) {
            // Cashout - uncomment to simulate offer
            // response.result.Amount = 0
            // response.result.Profit = -1
            // response.result.Status = 2

            let status = response.result.Status ? response.result.Status : 0
            switch (status) {
              case 1:
                context.commit('updateBetInHistory', { idfobet: idfobet, Status: 'Closed', StatusText: 'Cashed Out', statusInner: 'boughtback', SB: { Return: response.result.Amount } })
                context.commit('updateBB', { reset: true })
                store.dispatch('getCustomerContext')
                bbres.type = 'success'
                if (GTMdata) context.dispatch('sendGTMCashoutSuccess', GTMdata)
                resolve(bbres)
                break
              case 2:
                let quote = {}
                quote.Amount = response.result.Amount
                quote.Period = response.result.Period
                quote.Profit = response.result.Profit
                if (quote.Amount > 0) {
                  context.commit('updateBB', { bet: bet, quote: quote })
                  bbres.type = 'error'
                  bbres.msg = 'Cashout reoffer. New amount is ' + quote.Amount
                  reject(bbres)
                } else {
                  context.commit('updateBB', { reset: true, msg: 'NotAvailableAnyMore', msgtype: 'nok', idfobet: idfobet, bet: bet })
                  bbres.type = 'error'
                  bbres.msg = 'NotAvailableAnyMore'
                  reject(bbres)
                }
                break
              default:
                context.commit('updateBB', { reset: true, msg: 'NotAvailableAnyMore', msgtype: 'nok', idfobet: idfobet, bet: bet })
                bbres.type = 'error'
                bbres.msg = 'NotAvailableAnyMore'
                reject(bbres)
                break
            }
          } else {
            context.commit('updateBB', { reset: true, msg: 'NotAvailableAnyMore', msgtype: 'nok', idfobet: idfobet, bet: bet })
            bbres.type = 'error'
            bbres.msg = 'NotAvailableAnyMore'
            reject(bbres)
          }
        }
      }).catch(response => {
        if (state.tsRqSbb === timestamp) {
          state.tsRqSbb = 0

          bbres.type = 'error'
          let msg = 'NotAvailable'

          if (response.exceptionType && (
            response.exceptionType === 'Com.Finsoft.Warp.Texas.SessionExpiredException' ||
            response.exceptionType === 'Com.Finsoft.Warp.Connecticut.SessionTimeoutException' ||
            response.exceptionType === 'Com.Finsoft.Warp.Connecticut.Services.UserNotLoggedInException')) {
            context.commit('setHistoryStatus', { fetching: false, error: 'SessionTimeout' })
            context.commit('setHistory', undefined)
            context.commit('setBbStatus', { state: '' })
            context.commit('updateBB', { reset: true })
            msg = 'SessionTimeout'

            bbres.msg = 'Player not logged in or session expired. Sys message: ' + response.exceptionType
          } else {
            msg = 'SettleBuybackFailed'
            // context.commit('setBbStatus', { state: '' })
            // context.commit('updateBB', { reset: true, msg: msg, msgtype: 'nok', idfobet: idfobet, bet: bet })

            bbres.msg = 'Settle buyback failed.'
            if (response.exceptionType) {
              bbres.msg += ' Sys message:' + response.exceptionType
            } else {
              bbres.msg += ' No error recorded.'
            }
          }
          context.commit('setBbStatus', { state: '' })
          context.commit('updateBB', { reset: true, msg: msg, msgtype: 'nok', idfobet: idfobet, bet: bet })

          reject(bbres)
        }
      })
    })
  },
  cancelBuyBack (context) {
    // console.log('cancelBuyBack')
    if (state.history && state.bb.idfobet > 0 && state.bb.quote && state.bb.quote.Amount && state.bb.quote.Profit) {
      state.history.forEach(function (entry) {
        if (entry.SB && entry.SB.IDFOBet === state.bb.idfobet) {
          if (entry.Quote !== state.bb.quote.Amount || entry.Profit !== state.bb.quote.Profit) {
            context.commit('updateBetInHistory', { idfobet: state.bb.idfobet, Quote: state.bb.quote.Amount, Profit: state.bb.quote.Profit })
          }
        }
      })
    }

    context.commit('updateBB', { reset: true })
  },
  updateBB (context, data) {
    context.commit('updateBB', data)
  },
  sendGTMCashoutSuccess (context, data) {
    if (window.dataLayer || context.rootGetters.getThirdpartyAnalytics) {
      let sendGTMCashoutSuccess = {
        'event': 'cash_out_completed',
        'gaEventCategory': 'cashed out',
        'gaEventAction': 'cashed out',
        'gaEventLabel': 'closed',
        'module': 'betslip',
        'profit': data.Profit,
        'quote': data.Quote,
        'betSlipID': data && data.SB ? data.SB.IDFOBetSlip : 'N/A',
        'betType': data && data.SB ? data.SB.BetType : 'N/A',
        'betId': data && data.SB ? data.SB.IDFOBet : 'N/A',
        'invoiceId': data.Invoice,
        'odds': data.SB.Odds
      }
      let xtremeObj = {
        'param1': 'event',
        'param2': 'cash_out_completed',
        'param3': {
          'module': 'betslip',
          'profit': data.Profit,
          'payout': data.Quote,
          'betId': data && data.SB ? data.SB.IDFOBet : 'N/A',
          'betType': data && data.SB ? data.SB.BetType : 'N/A',
          'betslip_id': data && data.SB ? data.SB.IDFOBetSlip : 'N/A',
          'invoice_id': data.Invoice,
          'odds': data && data.SB ? data.SB.Odds : 'N/A'
        }
      }
      context.dispatch('analyticsHandler', {'event': sendGTMCashoutSuccess, 'xtremeObj': xtremeObj}, { root: true })
    }
  }
}

const mutations = {
  initStatement (state, data) {
    state.history = undefined
    state.historyStatus = { fetching: false }
    state.historyDateRange = { from: null, to: null }
    state.pageNumber = 0
    state.pageCount = 0
    state.queryBB = false

    if (data && data.historyDateRange) {
      state.historyDateRange.from = data.historyDateRange.from
      state.historyDateRange.to = data.historyDateRange.to
    }
    if (data && data.queryBB) {
      state.queryBB = data.queryBB
    }

    state.bb = { bet: null, quote: { }, msg: '', msgtype: '', idfobet: 0 }
    state.bbStatus = { state: '' }
  },
  setHistoryStatus (state, data) {
    state.historyStatus.fetching = data ? data.fetching : false
    state.historyStatus.error = data ? data.error : undefined
  },
  setHistory (state, data) {
    if (data) {
      state.history = data.List
      state.pageNumber = data.Page
      state.pageCount = data.Pages
    } else {
      state.history = undefined
      // state.historyDateRange = { from: new Date(), to: null }
      state.pageNumber = 0
      state.pageCount = 0
    }
  },
  /**
   * Check the filters used for the fetch and rest the saved history if there is mismatch.
   * Append the data at the end.
   * @param {this.state} state
   * @param {*} data
   */
  appendHistory (state, data) {
    let historyHash = data.forParams.queryStatus + ':' + data.forParams.queryFrom + ':' + data.forParams.queryTo + ':' + data.forParams.pageSize + ':' + data.forParams.queryBB

    if (state && state.historyHash && state.historyHash !== historyHash) {
      state.history = undefined
      state.pageNumber = 0
      state.pageCount = 0
    }

    if (data) {
      if (state.history) {
        let list2 = []
        data.List.forEach(function (bet) {
          let hasMatch = false
          state.history.forEach(function (hBet) {
            if (hBet.Extref === bet.Extref) hasMatch = true
          })
          if (!hasMatch) list2.push(bet)
        })

        state.historyHash = historyHash
        state.history = state.history.concat(list2)
      } else {
        state.historyHash = historyHash
        state.history = data.List
      }
      state.pageNumber = data.Page
      state.pageCount = data.Pages
    } else {
      state.history = undefined
      // state.historyDateRange = { from: null, to: null }
      state.pageNumber = 0
      state.pageCount = 0
    }
  },
  updateBetInHistory (state, data) {
    if (data && data.idfobet) {
      if (state.history) {
        state.history.forEach(function (hBet) {
          if (hBet.SB.IDFOBet === data.idfobet) {
            if (data.Status) {
              hBet.Status = data.Status
            }
            if (data.StatusText) {
              hBet.StatusText = data.StatusText
            }
            if (data.statusInner) {
              hBet.statusInner = data.statusInner
            }
            if (data.SB && data.SB.Return) {
              hBet.SB.Return = data.SB.Return
            }
            if (typeof data.Quote !== 'undefined' && typeof data.Profit !== 'undefined') {
              hBet.Quote = data.Quote
              hBet.Profit = data.Profit
            }
          }
        })
      }
    }
  },
  setHistoryDateRange (state, data) {
    let from = null
    let to = null
    if (data && data.from && data.to && data.from > data.to) {
      from = data.to
      to = data.from
    } else if (data && data.from && data.to) {
      from = data.from
      to = data.to
    }
    state.historyDateRange.from = from
    state.historyDateRange.to = to
  },
  updateBB (state, data) {
    // console.log('updateBB')
    if (data && typeof data.reset !== 'undefined' && data.reset === true) {
      state.bb.bet = (typeof data.bet !== 'undefined') ? data.bet : null
      state.bb.quote = (typeof data.quote !== 'undefined') ? data.quote : { }
      if (typeof data.msg !== 'undefined' && typeof data.msgtype !== 'undefined') {
        state.bb.msg = data.msg
        state.bb.msgtype = data.msgtype
      } else {
        state.bb.msg = ''
        state.bb.msgtype = ''
      }
      state.bb.idfobet = typeof data.idfobet !== 'undefined' ? data.idfobet : 0
    } else if (data) {
      if (typeof data.bet !== 'undefined') {
        state.bb.bet = data.bet
      }
      if (typeof data.quote !== 'undefined') {
        state.bb.quote = data.quote
      }
      if (typeof data.msg !== 'undefined' && typeof data.msgtype !== 'undefined') {
        state.bb.msg = data.msg
        state.bb.msgtype = data.msgtype
      }
      if (typeof data.idfobet !== 'undefined') {
        state.bb.idfobet = data.idfobet
      }
    }
  },
  setBbStatus (state, data) {
    state.bbStatus.state = data ? data.state : ''
  },
  setActiveQueryType (state, id) {
    state.activeQueryType = id
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
