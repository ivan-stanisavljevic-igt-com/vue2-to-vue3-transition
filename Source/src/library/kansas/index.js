import http from 'axios'
import config from '@/config'
import lib from '@/library'
import store from '@/store'

export default {
  get,
  pssitenav,
  totedailyracecard,
  toteraceresult,
  toteSr,
  toteMr,
  psbonav,
  bonavigationlistextended,
  scoreboardevents,
  psevent,
  lnbscoreboardupcomingeventlist,
  psheadline,
  evenuemarketbyids,
  selectionsforpricetype,
  eventmarketgroupsconfig,
  psmg,
  psstreams,
  marketsbyselections,
  psderivatives,
  psParams,
  psCoreParams,
  iwparams,
  psPromotions,
  psSetup,
  psFavNotificationPeriods,
  psFavEvents,
  contestsLeaderboard,
  contestsRoundPicks,
  contestsRoundPicksSummary,
  contestSubcontests
}

function pssitenav (paramsMap) {
  return get('pssitenav', [
    'language'
  ], paramsMap)
}

function totedailyracecard (paramsMap) {
  return get('totedailyracecard', ['idmmbusinessunit', 'region', 'language', 'date'], paramsMap)
}

function toteraceresult (paramsMap) {
  return get('toteraceresult', ['idmmbusinessunit', 'region', 'language', 'idtgrace'], paramsMap)
}

function toteSr (paramsMap) {
  return get('totesr', ['idmmbusinessunit', 'region', 'language', 'idtgrace'], paramsMap)
}

function toteMr (paramsMap) {
  return get('totemr', ['idmmbusinessunit', 'region', 'language', 'idtgmeeting'], paramsMap)
}

function psbonav (paramsMap) {
  return get('psbonav', [
    'region',
    'language',
    'idfwbonavigation'
  ], paramsMap)
}

function bonavigationlistextended (paramsMap) {
  return get('bonavigationlistextended', [
    'region',
    'language',
    'idfwbonavigation'
  ], paramsMap)
}

function scoreboardevents (paramsMap) {
  return get('ngscoreboardevents', [
    'language',
    'eventsperpage',
    'page',
    'maxnumofselectionsperevent',
    'addfixedmarkets',
    'showupcomingonly',
    'showupcomingprematchmarkets',
    'flags'
  ], paramsMap)
}

function psevent (paramsMap) {
  return get('psevent', [
    'language',
    'region',
    'isliveevent',
    'idfoevent'
  ], paramsMap)
}

function lnbscoreboardupcomingeventlist (paramsMap) {
  return get('lnbscoreboardupcomingeventlist', [
    'language',
    'period',
    'withopenmarkets',
    'limit'
  ], paramsMap)
}

function psheadline (paramsMap) {
  return get('psheadline', [
    'region',
    'language'
  ], paramsMap)
}

function evenuemarketbyids (paramsMap) {
  return get('evenuemarketbyids', [
    'language',
    'idfomarkets'
  ], paramsMap)
}

function selectionsforpricetype (paramsMap) {
  return get('selectionsforpricetype', [
    'language',
    'pricetype',
    'ids'
  ], paramsMap)
}

function eventmarketgroupsconfig (paramsMap) {
  return get('eventmarketgroupsconfig', [
    'region'
  ], paramsMap)
}

function psmg (paramsMap) {
  return get('psmg', [
    'language',
    'idfwmarketgroup'
  ], paramsMap)
}

function psstreams (paramsMap) {
  return get('psstreams', [
    'idfoevent',
    'streamtype'
  ], paramsMap)
}

function marketsbyselections (paramsMap) {
  return get('marketsbyselections', [
    'language',
    'idfoselections'
  ], paramsMap)
}

function psderivatives (paramsMap) {
  return get('psderivatives', [
    'language',
    // 'pricetype',
    'ids'
  ], paramsMap)
}

function psParams (paramsMap) {
  return get('psParams', [
    'idmmbusinessunit',
    'csvlist'
  ], paramsMap)
}

function psCoreParams (paramsMap) {
  return get('pscoreparams', [
    'iddcapplication',
    'csvlist'
  ], paramsMap)
}

function iwparams (paramsMap) {
  return get('iwparams', [
    'idmmbusinessunit'
  ], paramsMap)
}

function psPromotions (paramsMap) {
  return get('pspromotions', [
    'idmmbusinessunit'
  ], paramsMap)
}

function psSetup (paramsMap) {
  return get('psSetup', [
    'region',
    'language'
  ], paramsMap)
}

function psFavNotificationPeriods (paramsMap) {
  return get('psFavNotificationPeriods', [
    'language'
  ], paramsMap)
}

function psFavEvents (paramsMap) {
  return get('psFavEvents', [
    'region',
    'language',
    'csvlist'
  ], paramsMap)
}

function contestsLeaderboard (paramsMap) {
  return get('contests-leaderboard', [
    'language',
    'contestId',
    'subContestId',
    'withPrizeTiers'
  ], paramsMap)
}

function contestsRoundPicks (paramsMap) {
  return get('contests-roundpicks', [
    'language',
    'contestId',
    'roundNo'
  ], paramsMap)
}
function contestsRoundPicksSummary (paramsMap) {
  return get('contests-roundpicksummary', [
    'language',
    'contestId',
    'roundNo'
  ], paramsMap)
}

function contestSubcontests (paramsMap) {
  return get('contests-subcontests', [
    'language',
    'contestId'
  ], paramsMap)
}

function get (generator, paramsList, paramsMap) {
  let date = Date.now()
  paramsMap = paramsMap || {}

  if (Array.isArray(paramsList)) {
    if (paramsMap) {
      replaceInArray(paramsList, paramsMap)
    }

    return http.get(createGeneratorUrl(generator, paramsList)).catch((error) => {
      if (window.ctsautoconf.MOBILE_LS && config.app.autoconf.MOBILE_DEBUGGER_DIALOG && config.app.autoconf.MOBILE_DEBUGGER_DIALOG.ENABLED) {
        let dynamicId = revisedRandId()
        store.commit('setNetworkLogOutput', {
          'date': date,
          'type': 'content',
          'dynamicId': dynamicId,
          'request': {'generator': generator, 'params': paramsList},
          'response': {
            'url': error.response.config.url,
            'message': error,
            'status': error.response.status,
            'statusText': error.response.statusText
          }
        })
      }
    })
  }
}

// function get (generator, paramsList, paramsMap) {
//   paramsMap = paramsMap || {}
//
//   if (Array.isArray(paramsList)) {
//     if (paramsMap) {
//       replaceInArray(paramsList, paramsMap)
//     }
//
//     return new Promise(function (resolve, reject) {
//       var xhr = new XMLHttpRequest()
//       xhr.open('GET', createGeneratorUrl(generator, paramsList))
//
//       xhr.onload = function () {
//         if (this.status >= 200 && this.status < 300) {
//           resolve({ 'data': JSON.parse(xhr.response) })
//         } else {
//           reject(new Error({
//             status: this.status,
//             statusText: xhr.statusText
//           }))
//         }
//       }
//       xhr.send()
//     })
//
//     // return http.get(createGeneratorUrl(generator, paramsList))
//   }
// }

function createGeneratorUrl (generator, params) {
  return lib.core.url.joinSegments([
    config.app.contentServerHostname,
    'cache',
    generator
  ].concat(params)).concat('.' + config.kansas.responseType)
}

function replaceInArray (array, map) {
  map.region = config.app.region

  if (!map.idmmbusinessunit) {
    map.idmmbusinessunit = config.app.businessUnit
  }
  if (!map.language) {
    map.language = config.app.language
  }

  for (var i = 0; i < array.length; i++) {
    for (var variable in map) {
      if (map.hasOwnProperty(variable)) {
        if (array[i] === variable) {
          array[i] = map[variable]
          break
        }
      }
    }
  }
  return array
}

function revisedRandId () {
  let randLetter = String.fromCharCode(65 + Math.floor(Math.random() * 26))
  return randLetter + Date.now()
}
