import rpcService from '@/library/rpcService'
import config from '@/config'

export default {
  getLiveTracks
}

function getLiveTracks () {
  return rpcService.callBroker('LiveTrackerService', 'GetTracks', {'Region': config.app.region}).then(
    function (result) {
      // console.log('LiveTrackerService:')
      // console.log(result.result)
      var ids = {}
      if (result.result.length) {
        result.result.forEach(function (e) {
          ids[e.IDEvent] = 1
        })
      }
      return ids
    })
    .catch(function () {
      return {}
    })
}
