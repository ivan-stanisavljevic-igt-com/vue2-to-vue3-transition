import Vue from 'vue'
// import store from '@/store'
// import lib from '@/library'
// import interRelatedService from '@/library/interRelated'

function storedBsid () {
  var stored = localStorage.getItem('BSstate')
  stored = JSON.parse(stored)
  return stored && stored.uid
}
function bsid (id) {
  let u = []
  let n = 0
  id.split('').forEach(function (c, i) {
    if (i % 2) {
      if (n % 2) {
        u.push(c)
      } else {
        u.unshift(c)
      }
      n++
    }
  })
  u = u.join('')
  return u
}

const actions = {
  saveToStorage (context, eventId) {
    // !!! USED BY EXTERNAL COMPONENT !!!
    // console.log('BETSLIP saveToStorage')
    // var storage = sessionStorage
    var storage = localStorage
    var now = new Date().getTime()
    var data = {
      ts: now,
      eventId: eventId
    }
    var props = context.state.propsToStore
    var populateData = function () {
      props.forEach(function (prop) {
        if (prop.indexOf('.') > -1) {
          var p = prop.split('.')
          data[prop] = context.state[p[0]][p[1]]
        } else {
          data[prop] = context.state[prop]
        }
      })
    }
    populateData()
    //
    var uid = storage.getItem('customer')
    if (typeof uid === 'string' && ['', 'null', 'undefined'].includes(uid)) {
      uid = null
    }
    if (uid) {
      uid = bsid(uid)
    } else {
      uid = storedBsid()
    }
    data.uid = uid
    //
    storage.setItem('BSstate', JSON.stringify(data))
    // storage.setItem(eventId, now)
  },
  getFromStorage (context) {
    // console.log('BETSLIP getFromStorage')
    // var storage = sessionStorage
    var storage = localStorage
    var now = new Date().getTime()
    //
    var props = context.state.propsToStore
    var updateState = function (prop) {
      if (typeof stored[prop] !== 'undefined') {
        if (prop.indexOf('.') > -1) {
          var p = prop.split('.')
          Vue.set(context.state[p[0]], p[1], stored[prop])
        } else {
          Vue.set(context.state, prop, stored[prop])
        }
      }
    }
    var stored = !context.state.betslipSelections.length && storage.getItem('BSstate')
    // console.log('stored:')
    // console.log(stored)
    stored = JSON.parse(stored)
    if (stored) {
      // alert('ev: ' + stored.eventId)
      stored.betTypeStakes.PerTab = {}
      var dt = stored && stored.ts ? (now - stored.ts) / 1000 : 999999999
      if (dt < (60 * 60 * 24)) {
        props.forEach(function (prop) {
          updateState(prop)
        })
      } else {
        storage.removeItem('BSstate')
      }
      // context.dispatch('initBetSlipUpdate', 0.1)
      // context.dispatch('scheduleBetSlipUpdate')
    }
  },
  clearStoredBetSlip (context) {
    // console.log('clearStoredBetSlip')
    var storage = localStorage
    storage.removeItem('BSstate')
  },
  checkBetSlipOwner (context, uid) {
    var suid = storedBsid()
    if (suid) {
      uid = bsid(uid)
      if (suid !== uid) {
        context.dispatch('clearBetSlip')
      }
    }
  }
}

export default actions
