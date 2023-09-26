import config from '@/config'
import store from '@/store'
import lib from '@/library'
import Vue from 'vue'

export default {
  autoReconnect: true,
  isServiceStarted: false,
  isConnected: false,
  reconnectCounter: 0,
  recconectDelay: 5000,
  maxReConnects: 1000,
  websocket: {},
  errorMessage: '',
  eventsSubscriptionId: undefined,
  eventPageSubscriptionId: [],
  isEventPageSubscribed: false,
  marketsSubscriptionId: {},
  timersSubscriptionId: {},
  countersSubscriptionId: {},
  idsPerRequestId: {
    2: [],
    3: [],
    4: []
  },
  sessionId: undefined,
  marketsForSubscribe: [],
  marketsForUnsubscribe: [],

  getLiveEvents () {
    return store.getters['livebettingState/liveEvents']
  },
  updateObjectProperties (originalObject, newObject) {
    var property
    for (property in newObject) {
      if (newObject.hasOwnProperty(property) &&
        property !== '@type' &&
        property !== 'idfoevent' &&
        property !== 'idfomarket' &&
        property !== 'idfoselection') {
        if (!Array.isArray(originalObject[property])) {
          if (!originalObject[property]) {
            Vue.set(originalObject, property, newObject[property])
          } else {
            originalObject[property] = newObject[property]
          }
        }
      }
    }
  },
  resetServiceData () {
    this.sessionId = undefined

    this.eventsSubscriptionId = undefined
    this.eventPageSubscriptionId = []
    this.isEventPageSubscribed = false
    this.marketsSubscriptionId = {}
    this.timersSubscriptionId = {}
    this.countersSubscriptionId = {}
    this.idsPerRequestId = {
      2: [],
      3: [],
      4: []
    }
  },

  subscribeToLiveEvents () {
    let subscribeToLiveEventsMsg = {
      '@type': 'S2ELive',
      'RqId': 1,
      'live': true,
      'sportIds': window.ctsautoconf.LIVE_SPORTS_IDS || [
        'FOOTBALL',
        'TENNIS',
        'BASKETBALL',
        'BASEBALL',
        'SOCCER',
        'NFL',
        'ICE HOCKEY',
        'GOLF',
        'BOXING',
        'MMA',
        'DARTS',
        'AUSRULES',
        'MOTORSPORT',
        'CRICKET',
        'RUGBYUNION'
      ]
    }
    this.sendMessage(JSON.stringify(subscribeToLiveEventsMsg))
  },
  subscribeToEventsMarkets (idfoevents, marketflags, requestId) {
    if (idfoevents) {
      let msg = {
        '@type': 'S2MByE',
        'RqId': requestId || 2,
        'mtcgflag': marketflags || 'SHOWONFILTER',
        'eventIds': idfoevents,
        'derivativetypes': marketflags === 'ISLIVE' ? ['', 'PP'] : ['']
      }

      lib.core.logger.debugConsoleLog('WebSocketService - Subscribe to live events markets', 2)
      this.sendMessage(JSON.stringify(msg))
    }
  },
  subscribeToEventPageMarkets (idfoevent) {
    if (idfoevent && !this.isEventPageSubscribed) {
      this.isEventPageSubscribed = true
      this.subscribeToEventsMarkets([idfoevent], 'ISLIVE', 6)
    }
  },
  subscribeToMarketsByIDFOMarkets (markets) {
    if (this.isConnected && markets && markets.length > 0) {
      markets.forEach(mk => {
        if (mk.numberofreferences && !isNaN(mk.numberofreferences)) {
          mk.numberofreferences = mk.numberofreferences + 1
        }
      })

      var idfomarkets = markets.filter(mk => !mk.numberofreferences).map(mk => {
        return mk.idfomarket
      })

      if (idfomarkets && idfomarkets.length > 0) {
        let msg = {
          '@type': 'S2EByIds',
          'RqId': 5,
          'etype': 'EMarket',
          'ids': idfomarkets
        }

        lib.core.logger.debugConsoleLog('WebSocketService - Subscribe to markets by IDFOMarkets: ' + idfomarkets.join(','), 2)
        this.sendMessage(JSON.stringify(msg))
      }
    }
  },
  subscribeToEventsSBTimers (idfosbevents) {
    if (idfosbevents) {
      let msg = {
        '@type': 'S2TBP',
        'RqId': 3,
        'idfosbevent': idfosbevents
      }

      lib.core.logger.debugConsoleLog('WebSocketService - Subscribe to live events SBTimers', 2)
      this.sendMessage(JSON.stringify(msg))
    }
  },
  subscribeToEventsSBCounters (idfosbevents) {
    if (idfosbevents && idfosbevents.length > 0) {
      let msg = {
        '@type': 'S2CBP',
        'RqId': 4,
        'idfosbevent': idfosbevents
      }

      lib.core.logger.debugConsoleLog('WebSocketService - Subscribe to live events SBCounters', 2)
      this.sendMessage(JSON.stringify(msg))
    }
  },
  unsubscribeFromAll () {
    if (this.eventsSubscriptionId) {
      lib.core.logger.debugConsoleLog('WebSocketService - Unsubscribe from all live events', 2)
      var msg = {
        '@type': 'U',
        'type': 'EEvent',
        'RqId': 101,
        'ids': this.eventsSubscriptionId
      }

      // this.getLiveEvents().forEach(ev => {
      //   this.unsubscribeFromEvent(ev.idfoevent)
      // })
      this.sendMessage(JSON.stringify(msg))
      this.eventsSubscriptionId = undefined
    }
  },
  unsubscribeFromEvent (idfoevent) {
    if (idfoevent) {
      let marketMsg, timerMsg, counterMsg

      if (this.marketsSubscriptionId && this.marketsSubscriptionId[idfoevent]) {
        lib.core.logger.debugConsoleLog('WebSocketService - Unsubscribe from live event: ' + idfoevent, 2)

        marketMsg = {
          '@type': 'U',
          'type': 'EMarket',
          'RqId': 102,
          'ids': [this.marketsSubscriptionId[idfoevent]]
        }
        this.sendMessage(JSON.stringify(marketMsg))
      }
      if (this.timersSubscriptionId && this.timersSubscriptionId[idfoevent]) {
        timerMsg = {
          '@type': 'U',
          'type': 'SBTimer',
          'RqId': 103,
          'ids': [this.timersSubscriptionId[idfoevent]]
        }
        this.sendMessage(JSON.stringify(timerMsg))
      }
      if (this.countersSubscriptionId && this.countersSubscriptionId[idfoevent]) {
        counterMsg = {
          '@type': 'U',
          'type': 'SBCounter',
          'RqId': 104,
          'ids': [this.countersSubscriptionId[idfoevent]]
        }
        this.sendMessage(JSON.stringify(counterMsg))
      }
    }
  },
  unsubscribeFromMarkets (markets) {
    var marketsWithNoReferences = markets.filter(mk => mk.numberofreferences <= 1)
    var marketsWithMoreReferences = markets.filter(mk => mk.numberofreferences > 1)

    marketsWithMoreReferences.forEach(mk => {
      mk.numberofreferences = mk.numberofreferences - 1
    })

    var subscriptionsIds = marketsWithNoReferences.map(mk => {
      mk.numberofreferences = 0
      return mk.subscriptionId
    })

    marketsWithNoReferences.forEach(mk => {
      mk.subscriptionId = undefined
    })

    if (subscriptionsIds && subscriptionsIds.length > 0) {
      var msg = {
        '@type': 'U',
        'type': 'EMarket',
        'RqId': 102,
        'ids': subscriptionsIds
      }
      this.sendMessage(JSON.stringify(msg))

      lib.core.logger.debugConsoleLog('WebSocketService - Unsubscribe from markets: ' + subscriptionsIds.join(','), 2)
    }
  },
  unsubscribeFromEventPageMarkets () {
    if (this.eventPageSubscriptionId.length > 0) {
      var msg = {
        '@type': 'U',
        'type': 'EMarket',
        'RqId': 102,
        'ids': this.eventPageSubscriptionId
      }
      this.sendMessage(JSON.stringify(msg))

      lib.core.logger.debugConsoleLog('WebSocketService - Unsubscribe from Event page markets: ' + this.eventPageSubscriptionId.join(' ,'), 2)
      this.eventPageSubscriptionId = []
      this.isEventPageSubscribed = false
    }
  },
  addMarketsToSubscribeQueue (markets) {
    var self = this
    if (this.marketsForSubscribe.length === 0) {
      setTimeout(() => {
        self.subscribeToMarketsByIDFOMarkets(self.marketsForSubscribe)
        self.marketsForSubscribe = []
      }, 1)
    }

    if (markets && markets.length > 0) {
      markets.forEach(mk => {
        this.marketsForSubscribe.push(mk)
      })
    }
  },
  addMarketsToUnsubscribeQueue (markets) {
    var self = this
    if (this.marketsForUnsubscribe.length === 0) {
      setTimeout(() => {
        self.unsubscribeFromMarkets(self.marketsForUnsubscribe)
        self.marketsForUnsubscribe = []
      }, 1)
    }

    if (markets && markets.length > 0) {
      markets.forEach(mk => {
        this.marketsForUnsubscribe.push(mk)
      })
    }
  },

  addEvent (event) {
    if (event) {
      event.player = [{
        name: event.homeleadname,
        idfosblead: event.idfosbleadhome,
        type: true
      }, {
        name: event.awayleadname,
        idfosblead: event.idfosbleadaway,
        type: false
      }]

      store.commit('livebettingState/addLiveEvent', event)
    }
  },
  removeEvent (idfoevent) {
    this.unsubscribeFromEvent(idfoevent)
    store.commit('livebettingState/deleteLiveEvent', idfoevent)
  },

  addMarkets (markets) {
    var liveEvents = this.getLiveEvents()
    var newMarketsForEvent = []
    var existingMarketsForEvent = []

    // var mtcgConfig = store.getters['livebettingState/marketTypeClassGroupConfig']

      // let filteredMarkets = markets.filter((market) => {
      //   return mtcgConfig.filter(mtcg => mtcg.idfosporttype === market.idfosporttype &&
      //   mtcg.flag === 'SHOWONFILTER' && mtcg.markettypeclass.indexOf(market.idfomarkettypeclass) > -1).length > 0
      // })

    liveEvents.forEach((liveEvent) => {
      newMarketsForEvent = markets.filter(function (market) {
        return liveEvent.idfoevent === market.idfoevent &&
          (!liveEvent.markets || liveEvent.markets.length === 0 || liveEvent.markets.filter(oldMarket => oldMarket.idfomarket === market.idfomarket).length === 0)
      })
      existingMarketsForEvent = markets.filter(market => {
        return liveEvent.idfoevent === market.idfoevent &&
          (liveEvent.markets && liveEvent.markets.length > 0 && liveEvent.markets.filter(oldMarket => oldMarket.idfomarket === market.idfomarket).length > 0)
      })

      if (newMarketsForEvent && newMarketsForEvent.length > 0) {
        lib.core.logger.debugConsoleLog('WebSocketService - New markets: ' + newMarketsForEvent.map((m) => { return m.idfomarket }).join(', ') +
          ' [events: ' + newMarketsForEvent.map((m) => { return m.idfoevent }).join(', ') + ']', 3)

        store.commit('livebettingState/addMarketsForLiveEvent', { idfoevent: liveEvent.idfoevent, markets: newMarketsForEvent })
      }
      if (existingMarketsForEvent && existingMarketsForEvent.length > 0) {
        existingMarketsForEvent.forEach(mk => {
          this.updateMarket(mk)
        })
      }
    })
  },
  updateMarket (newMarket) {
    var liveEvents = this.getLiveEvents()
    var event = liveEvents.filter(evt => evt.idfoevent === newMarket.idfoevent)[0]

    if (event && event.markets) {
      let marketToUpdate = event.markets.filter(mk => mk.idfomarket && mk.idfomarket === newMarket.idfomarket)[0]

      if (marketToUpdate) {
        if (!marketToUpdate.V || newMarket.V > marketToUpdate.V || marketToUpdate.subscriptionId !== newMarket.subscriptionId || marketToUpdate.numberofreferences !== newMarket.numberofreferences) {
          this.updateObjectProperties(marketToUpdate, newMarket)
        }

        if (newMarket.selections && typeof newMarket.selections === 'object' && newMarket.selections.constructor === Array && newMarket.selections.length > 0) {
          newMarket.selections.forEach((newSelection) => {
            let selectionToUpdate = marketToUpdate.selections && marketToUpdate.selections.filter(sel =>
              sel.idfoselection && sel.idfoselection === newSelection.idfoselection)[0]

            if (selectionToUpdate) {
              if (!selectionToUpdate.V || newSelection.V > selectionToUpdate.V) {
                if (newSelection['@deleted']) {
                  let index = marketToUpdate.selections.indexOf(selectionToUpdate)
                  marketToUpdate.selections.splice(index, 1)
                } else {
                  this.updateObjectProperties(selectionToUpdate, newSelection)
                }
              }
            } else {
              if (!Array.isArray(marketToUpdate.selections)) {
                marketToUpdate.selections = []
              }
              marketToUpdate.selections.push(newSelection)
            }
          })
        }

        store.dispatch('livebettingState/replaceMarketForLiveEvent', marketToUpdate)
        //
      }
    }
  },
  removeMarket (idfoevent, idfomarket) {
    store.commit('livebettingState/removeMarketFromLiveEvent', { idfoevent: idfoevent, idfomarket: idfomarket })
    lib.core.logger.debugConsoleLog('WebSocketService - Market deleted [' + idfomarket + ']', 3)
  },

  addTimer (timer) {
    if (timer) {
      store.commit('livebettingState/addEventTimer', timer)
    }
  },
  updateTimer (timer) {
    if (timer) {
      store.commit('livebettingState/updateEventTimer', timer)
    }
  },
  removeTimer (timer) {
    if (timer) {
      store.commit('livebettingState/removeEventTimer', timer)
    }
  },

  addCounter (counter) {
    if (counter) {
      if (counter.idfosbcountergroup === 'EVENT') {
        store.commit('livebettingState/addEventCounter', counter)
      } else if (counter.idfosbcountergroup === 'LEAD') {
        store.commit('livebettingState/addLeadCounter', counter)
      }
    }
  },
  updateCounter (counter) {
    if (counter.idfosbcountergroup === 'EVENT') {
      store.commit('livebettingState/updateEventCounter', counter)
    } else if (counter.idfosbcountergroup === 'LEAD') {
      store.commit('livebettingState/updateLeadCounter', counter)
    }
  },
  removeCounter (counter) {
    if (counter.idfosbcountergroup === 'EVENT') {
      store.commit('livebettingState/removeEventCounter', counter)
    } else if (counter.idfosbcountergroup === 'LEAD') {
      store.commit('livebettingState/removeLeadCounter', counter)
    }
  },

  processPayloadMessage (message) {
    switch (message.RqId) {
      // Events
      case 1: {
        lib.core.logger.debugConsoleLog('WebSocketService - Subscribed to events!', 2)
        store.commit('livebettingState/resetLiveEvents')
        store.commit('livebettingState/setLiveEventsLoaded', true)

        if (message.nodes.length > 0) {
          this.eventsSubscriptionId = message.subscriptionIds[0]

          let idfoevents = message.nodes.filter(ev => !ev.isawaitingstart).map(function (item) {
            return item.idfoevent
          })
          let idfosbevents = message.nodes.filter(ev => !ev.isawaitingstart && ev.idfosbevent).map(function (item) {
            return item.idfosbevent
          })

          message.nodes.forEach((event) => {
            this.addEvent(event)
          })

          this.idsPerRequestId[2] = idfoevents
          this.idsPerRequestId[3] = idfoevents
          this.idsPerRequestId[4] = idfoevents

          if (idfoevents.length > 0) {
            this.subscribeToEventsMarkets(idfoevents)
          }

          if (idfosbevents.length > 0) {
            this.subscribeToEventsSBTimers(idfosbevents)
            this.subscribeToEventsSBCounters(idfosbevents)
          }
        }

        let liveEventsSubscribeCounter = store.getters['livebettingState/getLiveWireLiveEventsSubscribeCounter']
        store.commit('livebettingState/setLiveWireLiveEventsSubscribeCounter', ++liveEventsSubscribeCounter)

        break
      }
      // Markets
      case 2:
      case 6: {
        lib.core.logger.debugConsoleLog('WebSocketService - Received markets!', 2)
        if (message.RqId === 6) {
          this.eventPageSubscriptionId.push(message.subscriptionIds[0])
        }
        this.addMarkets(message.nodes)

        break
      }
      // SBTimers
      case 3: {
        lib.core.logger.debugConsoleLog('WebSocketService - Subscribed to SBTimers!', 2)
        message.nodes.forEach((n) => {
          this.addTimer(n)
        })
        break
      }
      // SBCoutners
      case 4: {
        lib.core.logger.debugConsoleLog('WebSocketService - Subscribed to SBCoutners!', 2)
        message.nodes.forEach((n) => {
          this.addCounter(n)
        })
        break
      }
      case 5: {
        lib.core.logger.debugConsoleLog('WebSocketService - Subscribed to markets!', 2)
        if (message.nodes && message.nodes.length > 0) {
          for (var i = 0; i < message.nodes.length; i++) {
            // Vue.set(message.nodes[i], 'subscriptionId', message.subscriptionIds[i])
            // Vue.set(message.nodes[i], 'numberofreferences', 1)
            message.nodes[i].subscriptionId = message.subscriptionIds[i]
            message.nodes[i].numberofreferences = 1

            this.updateMarket(message.nodes[i])
          }
        }

        break
      }
      default:
        lib.core.logger.debugConsoleLog('WebSocketService - Unknown message!', 1)
    }

    if (message.RqId !== 1) {
      // store idfoevent/subscibeId tu be used for unsubscribe from event
      this.storeSubscripcionIds(message.RqId, message.subscriptionIds)
    }
  },
  processNotificationMessage (message) {
    let index
    let objects = message.nodes
    let existingObject
    let liveEvents = this.getLiveEvents()

    if (objects && objects.length > 0) {
      for (let key in objects) {
        switch (objects[key]['@type']) {
          case 'EEvent': {
            existingObject = liveEvents.find(event => objects[key].idfoevent === event.idfoevent)

            if (!existingObject) {
              // new event
              lib.core.logger.debugConsoleLog('WebSocketService - New event: ' + objects[key].idfoevent, 3)
              if (objects[key].idfobolifestate === 'O') {
                this.addEvent(objects[key])
                this.subscribeToEventsMarkets([objects[key].idfoevent])

                if (objects[key].idfosbevent) {
                  this.subscribeToEventsSBTimers([objects[key].idfosbevent])
                  this.subscribeToEventsSBCounters([objects[key].idfosbevent])
                }
              }
            } else {
              index = liveEvents.indexOf(existingObject)

              if (objects[key]['@deleted'] ||
                (objects[key].idfobolifestate && objects[key].idfobolifestate !== 'O') ||
                (objects[key].livemarketsflag !== undefined && objects[key].livemarketsflag === false) ||
                objects[key].idfosbevent === null ||
                objects[key].openmarketscount === 0) {
                // delete event
                lib.core.logger.debugConsoleLog('WebSocketService - Delete event: ' + objects[key].idfoevent, 3)
                this.removeEvent(objects[key].idfoevent)
              } else {
                // update event
                lib.core.logger.debugConsoleLog('WebSocketService - Update event: ' + objects[key].idfoevent, 3)
                if (!liveEvents[index].V || objects[key].V > liveEvents[index].V) {
                  this.updateObjectProperties(liveEvents[index], objects[key])
                }
              }
            }
            break
          }
          case 'EMarket': {
            let allMarkets = []

            liveEvents.forEach((liveEvent) => {
              if (liveEvent.markets && liveEvent.markets.length > 0) {
                allMarkets = allMarkets.concat(liveEvent.markets)
              }
            })

            existingObject = allMarkets.find(function (market) {
              return market.idfomarket && objects[key].idfomarket && market.idfomarket === objects[key].idfomarket
            })

            if (!existingObject) {
              this.addMarkets([objects[key]])
            } else {
              if (objects[key]['@deleted'] || (objects[key].idfobolifestate && objects[key].idfobolifestate !== 'O')) {
                lib.core.logger.debugConsoleLog('WebSocketService - Delete market: ' + objects[key].idfomarket + ' [idfoevent: ' + objects[key].idfoevent + ']', 3)
                this.removeMarket(objects[key].idfoevent, objects[key].idfomarket)
              } else {
                lib.core.logger.debugConsoleLog('WebSocketService - Update market: ' + objects[key].idfomarket + ' [idfoevent: ' + objects[key].idfoevent + ']', 3)
                this.updateMarket(objects[key])
              }
            }
            break
          }
          case 'SBTimer': {
            let eventForTimer = liveEvents.find(ev => ev.timers && ev.timers.filter(t => t.idfosbtimer === objects[key].idfosbtimer).length > 0)
            existingObject = eventForTimer && eventForTimer.timers && eventForTimer.timers.find(timer => timer.idfosbtimer === objects[key].idfosbtimer)

            if (eventForTimer) {
              if (!existingObject) {
                // new Timer
                lib.core.logger.debugConsoleLog('WebSocketService - New timer: ' + objects[key].idfosbtimer, 3)
                this.addTimer(objects[key])
              } else {
                if (objects[key]['@deleted']) {
                  lib.core.logger.debugConsoleLog('WebSocketService - Delete timer: ' + objects[key].idfosbtimer + ' [idfoevent: ' + eventForTimer.idfoevent + ']', 3)
                  this.removeTimer(objects[key])
                } else {
                  lib.core.logger.debugConsoleLog('WebSocketService - Update timer: ' + objects[key].idfosbtimer + ' [idfoevent: ' + eventForTimer.idfoevent + ']', 3)
                  if (!existingObject.V || objects[key].V > existingObject.V) {
                    this.updateObjectProperties(existingObject, objects[key])
                  }

                  this.updateTimer(existingObject)
                }
              }
            } else {
              lib.core.logger.debugConsoleLog('WebSocketService - Timer: No event for timer found', 3)
            }
            break
          }
          case 'SBCounter': {
            let eventForCounter = liveEvents.find(ev => objects[key].idfosbevent === ev.idfosbevent)

            if (eventForCounter) {
              if (objects[key].idfosbcountergroup === 'EVENT') {
                existingObject = eventForCounter.counter && eventForCounter.counter.find(c => c.idfosbcounter === objects[key].idfosbcounter)
              } else if (objects[key].idfosbcountergroup === 'LEAD') {
                let playerForCounter = eventForCounter && eventForCounter.player && eventForCounter.player.find(p => p.idfosblead === objects[key].idfosblead)

                existingObject = playerForCounter && playerForCounter.counters &&
                  playerForCounter.counters.find(c => c.idfosbcounter === objects[key].idfosbcounter)
              }

              if (!existingObject) {
                // new SB Counter
                lib.core.logger.debugConsoleLog('WebSocketService - New counter: ' + objects[key].idfosbcounter + ' [idfoevent: ' + eventForCounter.idfoevent + ']', 3)
                this.addCounter(objects[key])
              } else {
                if (objects[key]['@deleted']) {
                  lib.core.logger.debugConsoleLog('WebSocketService - Delete counter: ' + objects[key].idfosbcounter + ' [idfoevent: ' + eventForCounter.idfoevent + ']', 3)
                  this.removeCounter(objects[key])
                } else {
                  lib.core.logger.debugConsoleLog('WebSocketService - Update counter: ' + objects[key].idfosbcounter + ' [idfoevent: ' + eventForCounter.idfoevent + ']', 3)
                  if (!existingObject.V || objects[key].V > existingObject.V) {
                    this.updateObjectProperties(existingObject, objects[key])
                  }

                  this.updateCounter(existingObject)
                }
              }
            } else {
              lib.core.logger.debugConsoleLog('WebSocketService - Counter: No event for counter found', 3)
            }
            break
          }
        }
      }
    }
  },
  processMessage (message) {
    switch (message['@type']) {
      case 'SessionInfo': { // Connection established
        this.sessionId = message.sessionId
        lib.core.logger.debugConsoleLog('WebSocketService - SessionID: ' + message.sessionId, 0)
        break
      }
      case 'D': {
        // Initial payload message received
        this.processPayloadMessage(message)
        break
      }
      case 'N': {
        // Notification message received
        this.processNotificationMessage(message)
        break
      }
    }
  },

  storeSubscripcionIds (requestId, subscriptionIds) {
    if (this.idsPerRequestId[requestId] && subscriptionIds &&
      this.idsPerRequestId[requestId].length === subscriptionIds.length) {
      for (let i = 0; i < this.idsPerRequestId[requestId].length; i++) {
        switch (requestId) {
          case 2:
            this.marketsSubscriptionId[this.idsPerRequestId[requestId][i]] = subscriptionIds[i]
            break
          case 3:
            this.timersSubscriptionId[this.idsPerRequestId[requestId][i]] = subscriptionIds[i]
            break
          case 4:
            this.countersSubscriptionId[this.idsPerRequestId[requestId][i]] = subscriptionIds[i]
            break
        }
      }
    }
    this.idsPerRequestId[requestId] = []
  },

  // WebSocked Handlers
  onMessageHandler (message) {
    let msg = JSON.parse(message)
    // bufferMessage(msg);
    this.processMessage(msg)
  },
  onErrorHandler () {
    this.message = 'ERROR'
    this.resetServiceData()
  },
  onCloseHandler () {
    if (this.message !== 'ERROR') {
      this.message = 'CLOSED'
    }
  },

  // Lifecycle
  stopService () {
    lib.core.logger.debugConsoleLog('WebSocketService - stop service', 1)

    // if (this.isServiceStarted && this.isConnected) {
    //   this.unsubscribeFromAll()
    // }

    this.closeConnection()

    // $interval.cancel(objBufferProcessorIterval);

    this.isServiceStarted = false
    this.resetServiceData()
  },
  startService (customErrorHandler) {
    if (this.isServiceStarted) {
      return
    }

    lib.core.logger.debugConsoleLog('WebSocketService - start service', 1)
    this.isServiceStarted = true
    this.createSocketAndOpenConnection(customErrorHandler)

    // $interval.cancel(objBufferProcessorIterval);
    // objBufferProcessorIterval = $interval(function () {
    //   processBufferedMessages();
    // }, 1000);
  },

  createSocketAndOpenConnection (connectionErrorHandler) {
    var hostname = config.app.webPushServiceHostname || window.location.hostname || 'localhost'
    var envProtocol = (hostname.indexOf('http://') > -1 || hostname.indexOf('https://') > -1) ? new URL(hostname).protocol : window.location.protocol
    var protocol = hostname.indexOf('ws://') === -1 && hostname.indexOf('wss://') === -1 ? (envProtocol === 'https:' ? 'wss://' : 'ws://') : ''
    var port = config.app.portPerEnvironment[hostname] !== undefined ? config.app.portPerEnvironment[hostname] : config.app.portPerEnvironment['default']
    hostname = (hostname.indexOf('http://') > -1 || hostname.indexOf('https://') > -1) ? new URL(hostname).host : hostname
    var url = protocol + hostname + port + '/livewire'

    lib.core.logger.debugConsoleLog('WebSocketService - Connecting to: ' + url, 0)
    try {
      this.websocket = new WebSocket(url)
    } catch (e) {
      if (typeof connectionErrorHandler === 'function') {
        connectionErrorHandler()
      } else {
        this.onErrorHandler()
      }
    }

    this.websocket.onopen = () => {
      lib.core.logger.debugConsoleLog('WebSocketService - Connected', 0)
      connectionErrorHandler = undefined
      this.errorMessage = ''
      this.reconnectCounter++
      this.isConnected = true
      this.subscribeToLiveEvents()
    }

    this.websocket.onclose = (event) => {
      this.isConnected = false

      if (event.code !== 1000 && (typeof connectionErrorHandler !== 'function')) {
        lib.core.logger.debugConsoleLog('WebSocketService - Connection error: ' + event.code, 0)
        this.onErrorHandler()
        if (this.autoReconnect && this.reconnectCounter <= this.maxReConnects) {
          lib.core.logger.debugConsoleLog('WebSocketService - Retries left: ' + (this.maxReConnects - this.reconnectCounter), 0)
          lib.core.logger.debugConsoleLog('WebSocketService - Reconnecting in ' + (this.recconectDelay / 1000) + ' sec', 0)
          this.errorMessage = 'Disconnected!!! Reconnecting to server... Retries left: ' + (this.maxReConnects - this.reconnectCounter) + '... Reconnect in 5 sec'
          setTimeout(() => {
            lib.core.logger.debugConsoleLog('WebSocketService - Reconnecting', 0)
            this.createSocketAndOpenConnection()
          }, this.recconectDelay)
        } else {
          lib.core.logger.debugConsoleLog('WebSocketService - Max reconnect counter reached', 0)
          this.errorMessage = 'Disconnected from server'
          this.reconnectCounter = 0
          this.onCloseHandler(event)
        }
      } else {
        lib.core.logger.debugConsoleLog('WebSocketService - Connection closed normally', 0)
        this.errorMessage = ''
        this.reconnectCounter = 0
        this.onCloseHandler(event)
      }
    }

    this.websocket.onmessage = (event) => {
      this.onMessageHandler(event.data)
    }

    this.websocket.onerror = (event) => {
      lib.core.logger.debugConsoleLog('WebSocketService - Error occurred: ' + event.code, 0)

      if (typeof connectionErrorHandler === 'function') {
        connectionErrorHandler()
      } else {
        this.onErrorHandler()
      }
    }

    this.closeConnection = function () {
      this.websocket.close(1000)
      this.isConnected = false
    }
  },

  sendMessage (message, connectionClosedErrorHandler) {
    if (this.websocket.readyState === 1) {
      this.websocket.send(message)
    } else if (typeof connectionErrorHandler === 'function') {
      connectionClosedErrorHandler()
    }
  }
}
