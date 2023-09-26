import lib from '@/library'
import Vue from 'vue'
import config from '@/config'

const state = {
  liveEvents: [],
  liveEventsLoaded: false,
  liveStreams: [],
  upcomingEvents: [],
  localClockOffsetInSeconds: 0,
  liveBettingDataSourceType: config.app.liveBettingDataSourceType,
  liveWireLiveEventsSubscribeCounter: 0
}

const getters = {
  liveEvents (state) {
    return state.liveEvents
  },
  liveEventsLoaded (state) {
    return state.liveEventsLoaded
  },
  liveStreams (state) {
    return state.liveStreams
  },
  upcomingEvents (state) {
    return state.upcomingEvents
  },
  localClockOffsetInSeconds (state) {
    return state.localClockOffsetInSeconds || 0
  },
  liveBettingDataSourceType (state) {
    return state.liveBettingDataSourceType
  },
  getLiveWireLiveEventsSubscribeCounter (state) {
    return state.liveWireLiveEventsSubscribeCounter
  }
}

const mutations = {
  setLiveEvents (state, liveEvents) {
    state.liveEvents = liveEvents
  },
  setLiveEventsLoaded (state, isLoaded) {
    state.liveEventsLoaded = isLoaded
  },
  setLiveStreams (state, streams) {
    state.liveStreams = streams
  },
  resetLiveEvents (state) {
    state.liveEvents.splice(0, state.liveEvents.length)
  },
  setUpcomingEvents (state, events) {
    state.upcomingEvents = events
  },
  addLiveEvent (state, liveEvent) {
    state.liveEvents.push(liveEvent)
  },
  deleteLiveEvent (state, idfoevent) {
    var eventToDelete = state.liveEvents.find(event => event.idfoevent === idfoevent)

    if (eventToDelete) {
      let index = state.liveEvents.indexOf(eventToDelete)
      if (index > -1) {
        state.liveEvents.splice(index, 1)
      }
    }
  },
  addMarketsForLiveEvent (state, request) {
    var event = state.liveEvents.find(evt => evt.idfoevent === request.idfoevent)

    if (event) {
      if (!event.markets) {
        Vue.set(event, 'markets', [])
      }

      request.markets.forEach((market) => {
        Vue.set(market, 'eventname', event.eventname)
        event.markets.push(market)
      })
    }
  },
  removeMarketFromLiveEvent (state, request) {
    var event = state.liveEvents.find(evt => evt.idfoevent === request.idfoevent)

    if (event && event.markets) {
      var marketToDelete = event.markets.find(mk => mk.idfomarket === request.idfomarket)

      if (marketToDelete) {
        var index = event.markets.indexOf(marketToDelete)

        if (index > -1) {
          event.markets.splice(index, 1)
        }
      }
    }
  },
  addEventTimer (state, timer) {
    var event = state.liveEvents.find(evt => evt.idfosbevent === timer.idfosbevent)

    if (event) {
      if (!event.timers) {
        Vue.set(event, 'timers', [])
      }

      event.timers.push(timer)
    }
  },
  updateEventTimer (state, timer) {
    var event = state.liveEvents.find(evt => evt.idfosbevent === timer.idfosbevent)

    if (event && event.timers) {
      let timerToUpdate = event.timers.find(t => t.idfosbtimer === timer.idfosbtimer)

      if (timerToUpdate) {
        timerToUpdate = timer
      }
    }
  },
  removeEventTimer (state, timer) {
    var event = state.liveEvents.find(ev => ev.timers && ev.timers.filter(t => t.idfosbtimer === timer.idfosbtimer).length > 0)

    if (event && event.timers) {
      var timerToDelete = event.timers.find(t => t.idfosbtimer === timer.idfosbtimer)

      if (timerToDelete) {
        var index = event.timers.indexOf(timerToDelete)

        if (index > -1) {
          event.timers.splice(index, 1)
        }
      }
    }
  },

  addEventCounter (state, counter) {
    var event = state.liveEvents.find(evt => evt.idfosbevent === counter.idfosbevent)

    if (event) {
      if (!event.counter) {
        Vue.set(event, 'counter', [])
      }

      event.counter.push(counter)
    }
  },
  addLeadCounter (state, counter) {
    var event = state.liveEvents.find(evt => evt.idfosbevent === counter.idfosbevent)
    var lead = event.player && event.player.find(p => p.idfosblead === counter.idfosblead)

    if (lead) {
      if (!lead.counters) {
        Vue.set(lead, 'counters', [])
      }

      lead.counters.push(counter)
    }
  },
  updateEventCounter (state, counter) {
    var event = state.liveEvents.find(evt => evt.idfosbevent === counter.idfosbevent)

    if (event && event.counter) {
      let counterToUpdate = event.counter.find(c => c.idfosbcounter === counter.idfosbcounter)

      if (counterToUpdate) {
        counterToUpdate = counter
      }
    }
  },
  updateLeadCounter (state, counter) {
    var event = state.liveEvents.find(evt => evt.idfosbevent === counter.idfosbevent)

    if (event && event.player) {
      let playerForCounter = event.player.find(p => p.idfosblead === counter.idfosblead)

      if (playerForCounter) {
        let counterToUpdate = playerForCounter.counters.find(c => c.idfosbcounter === counter.idfosbcounter)

        if (counterToUpdate) {
          counterToUpdate = counter
        }
      }
    }
  },
  removeEventCounter (state, counter) {
    var event = state.liveEvents.find(evt => evt.idfosbevent === counter.idfosbevent)

    if (event && event.counter) {
      var counterToDelete = event.counter.find(c => c.idfosbcounter === counter.idfosbcounter)

      if (counterToDelete) {
        var index = event.counter.indexOf(counterToDelete)

        if (index > -1) {
          event.counter.splice(index, 1)
        }
      }
    }
  },
  removeLeadCounter (state, counter) {
    var event = state.liveEvents.find(evt => evt.idfosbevent === counter.idfosbevent)

    if (event && event.player) {
      let player = event.player.find(p => p.idfosblead === counter.idfosblead)

      if (player) {
        let counterToDelete = player.counters.find(c => c.idfosbcounter === counter.idfosbcounter)

        if (counterToDelete) {
          let index = player.counters.indexOf(counterToDelete)

          if (index > -1) {
            player.counters.splice(index, 1)
          }
        }
      }
    }
  },

  setLocalClockOffsetInSeconds (state, offset) {
    state.localClockOffsetInSeconds = offset
  },

  setLiveBettingDataSourceType (state, value) {
    state.liveBettingDataSourceType = value
  },
  setLiveWireLiveEventsSubscribeCounter (state, value) {
    state.liveWireLiveEventsSubscribeCounter = value
  }
}

const actions = {
  fetchLiveEvents (context, request) {
    return new Promise((resolve) => {
      lib.kansas.scoreboardevents({
        eventsperpage: request.eventsperpage,
        page: request.page,
        maxnumofselectionsperevent: request.maxnumofselectionsperevent,
        addfixedmarkets: false,
        showupcomingonly: false,
        showupcomingprematchmarkets: false,
        flags: request.flags
      }).then(response => {
        if (response.data && response.data.event) {
          response.data.event.forEach(ev => {
            if (!ev.awayteamname && ev.player.find(p => !p.type)) {
              ev.awayteamname = ev.player.find(p => !p.type).name
            }
            if (!ev.hometeamname && ev.player.find(p => p.type)) {
              ev.hometeamname = ev.player.find(p => p.type).name
            }
          })
          context.commit('setLiveEvents', response.data.event)
        } else {
          context.commit('setLiveEvents', [])
        }
      }).catch((error) => {
        console.log(error)
        context.commit('setLiveEvents', [])
      }).finally(() => {
        context.commit('setLiveEventsLoaded', true)
        resolve()
      })
    })
  },
  fetchLiveStreams (context, request) {
    return new Promise((resolve) => {
      lib.kansas.psstreams({
        idfoevent: request.idfoevent,
        streamtype: request.streamtype
      }).then(response => {
        if (response && response.data) {
          context.commit('setLiveStreams', response.data)
        } else {
          context.commit('setLiveStreams', [])
        }
      }).catch((error) => {
        console.log(error)
        context.commit('setLiveStreams', [])
      }).finally(() => {
        resolve()
      })
    })
  },
  fetchUpcomingEvents (context, request) {
    return new Promise((resolve) => {
      lib.kansas.lnbscoreboardupcomingeventlist({
        period: request.period,
        withopenmarkets: request.withopenmarkets,
        limit: request.limit
      }).then(response => {
        if (response.data && response.data.Events) {
          context.commit('setUpcomingEvents', response.data.Events)
        } else {
          context.commit('setUpcomingEvents', {
            upcomingEvents: []
          })
        }
      }).catch((error) => {
        console.log(error)
        context.commit('setUpcomingEvents', {
          upcomingEvents: []
        })
      }).finally(() => {
        resolve()
      })
    })
  },
  calculateLocalClockOffsetInSeconds (context) {
    return lib.rpcService.callBroker('UtilityService', 'GetCurrentUtcDateTime').then((response) => {
      if (response.result.DataBaseDateTime && response.result.DataBaseDateTime.UtcTotalMiliseconds) {
        var nowTime = (new Date()).getTime()
        var oracleTime = response.result.DataBaseDateTime.UtcTotalMiliseconds

        var difference = Math.floor((oracleTime - nowTime) / 1000)

        context.commit('setLocalClockOffsetInSeconds', difference || 0)
      }
    }).catch(
      function (e) {
        console.log(e)
      }
    )
  },
  replaceMarketForLiveEvent (context, market) {
    var event = context.state.liveEvents.find(evt => evt.idfoevent === market.idfoevent)

    if (event && event.markets) {
      var marketToUpdate = event.markets.find(mk => mk.idfomarket === market.idfomarket)

      if (marketToUpdate) {
        marketToUpdate = market
      }
    }
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
