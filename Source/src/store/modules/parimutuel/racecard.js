import lib from '@/library'

const state = {
  meetings: [],
  areMeetingsLoaded: false,
  periodicallyFetchDelay: 20000,
  periodicallyFetchRacecardID: undefined,
  resultdate: null,
  resultmeetings: [],
  areResultMeetingsLoaded: false,
  raceresult: undefined,
  raceresultstats: { idtgrace: null, isloaded: false, periodicfetchid: null },
  totesr: undefined,
  totesrstats: { idtgrace: null, isloaded: false, periodicfetchid: null },
  totemr: undefined,
  totemrstats: { isloaded: false, idtgmeeting: null, periodicfetchid: null },
  showracedetails: false,
  raceclocktzsuffix: null

}

const getters = {
  getMeetings (state) {
    return state.meetings
  },
  getMeetingsWithOpenRaces (state) {
    return (state.meetings && state.meetings.filter(meeting =>
      meeting.races && meeting.races.filter(race => race.gsc === 'OPEN').length > 0)) || []
  },
  getAreMeetingsLoaded (state) {
    return state.areMeetingsLoaded
  },
  getResultMeetings (state) {
    return state.resultmeetings
  },
  getResultDate (state) {
    // let newDate = new Date(new Date().setDate(new Date().getDate() - 1)).toISOString().substr(0, 10)
    return (state.resultdate || new Date().toISOString().substr(0, 10)).replace(/-/g, '')
  },
  getAreResultMeetingsLoaded (state) {
    return state.areResultMeetingsLoaded
  },
  getRaceResult (state) { return state.raceresult },
  getRaceResultStats (state) { return state.raceresultstats },
  getRaceResultIsLoaded (state) { return state.raceresultstats.isloaded },
  getToteSr (state) { return state.totesr },
  getToteSrStats (state) { return state.totesrstats },
  getToteSrIsLoaded (state) { return state.totesrstats.isloaded },
  getToteMr (state) { return state.totemr },
  getToteMrStats (state) { return state.totemrstats },
  getToteMrIsLoaded (state) { return state.totemrstats.isloaded },
  getShowRaceDetails (state) {
    return state.showracedetails
  },
  getRaceclockTzSuffix (state) {
    return state.raceclocktzsuffix
  }
}

const actions = {
  fetchRacecard (context) {
    window.clearTimeout(context.state.periodicallyFetchRacecardID)
    let rcardGeneratorParams = {}
    rcardGeneratorParams.date = 'TODAYANDFUTURE'

    return lib.kansas.totedailyracecard(
      rcardGeneratorParams
    ).then(response => {
      if (response.data.timestamp) {
        let timepartsPlus = response.data.timestamp.split('+') // timestamp: "2020-08-23T21:35:59+02:00"
        let timepartsMinus = response.data.timestamp.split('-') // timestamp: "2020-08-23T21:35:59-02:00"
        if (timepartsPlus.length === 2) {
          context.commit('setRaceclockTzSuffix', '+' + timepartsPlus[1])
        } else if (timepartsMinus.length === 4) {
          context.commit('setRaceclockTzSuffix', '-' + timepartsMinus[3])
        }
      }
      let meetings = response.data.meetings || []
      meetings.forEach(meeting => {
        meeting.firstraceid = null
        if (meeting.breed === 'Unknown' || meeting.breed === 'Other' || typeof meeting.breed === 'undefined') { meeting.breed = 'Others' }
        if (meeting.races) {
          let racePoolSums = {}
          if (meeting.pooloffers) {
            meeting.pooloffers.forEach(po => {
              if (po.legs && po.totalpoolvalue) {
                let raceIdStr = po.legs[0].r.toString()
                if (typeof racePoolSums[raceIdStr] === 'undefined') { racePoolSums[raceIdStr] = 0 }
                racePoolSums[raceIdStr] += po.totalpoolvalue
              }
            })
          }
          meeting.races.forEach(race => {
            if (meeting.firstraceid === null) { meeting.firstraceid = race.id }
            // if (meeting.firstopenraceid === null && race.usc === 'ON') { meeting.firstopenraceid = race.id }
            if (racePoolSums[race.id.toString()]) { race.totalpoolvaluesum = racePoolSums[race.id.toString()] }
          })
        }
      })
      context.commit('setMeetings', meetings)
      context.commit('setAreMeetingsLoaded', true)

      context.state.periodicallyFetchRacecardID = window.setTimeout(() => {
        context.dispatch('fetchRacecard')
      }, context.state.periodicallyFetchDelay)
    }).catch(() => {
      context.commit('setMeetings', [])
      context.commit('setAreMeetingsLoaded', true)

      context.state.periodicallyFetchRacecardID = window.setTimeout(() => {
        context.dispatch('fetchRacecard')
      }, context.state.periodicallyFetchDelay)
    })
  },
  fetchResultRacecard (context, data) {
    if (data && data.date) {
      context.commit('setResultDate', data.date)
    }
    let rcardGeneratorParams = {}
    rcardGeneratorParams.date = context.getters.getResultDate

    context.commit('setAreResultMeetingsLoaded', false)
    context.commit('setResultMeetings', [])
    return lib.kansas.totedailyracecard(
      rcardGeneratorParams
    ).then(response => {
      let meetings = response.data.meetings || []
      meetings.forEach(meeting => {
        meeting.firstraceid = null
        // meeting.firstopenraceid = null
        if (meeting.breed === 'Unknown' || meeting.breed === 'Other' || typeof meeting.breed === 'undefined') { meeting.breed = 'Others' }
        if (meeting.races) {
          let racePoolSums = {}
          if (meeting.pooloffers) {
            meeting.pooloffers.forEach(po => {
              if (po.legs && po.totalpoolvalue) {
                let raceIdStr = po.legs[0].r.toString()
                if (typeof racePoolSums[raceIdStr] === 'undefined') { racePoolSums[raceIdStr] = 0 }
                racePoolSums[raceIdStr] += po.totalpoolvalue
              }
            })
          }
          meeting.races.forEach(race => {
            if (meeting.firstraceid === null) { meeting.firstraceid = race.id }
            // if (meeting.firstopenraceid === null && race.usc === 'ON') { meeting.firstopenraceid = race.id }
            if (racePoolSums[race.id.toString()]) { race.totalpoolvaluesum = racePoolSums[race.id.toString()] }
          })
        }
      })
      context.commit('setResultMeetings', meetings)
      context.commit('setAreResultMeetingsLoaded', true)
    }).catch(() => {
      context.commit('setResultMeetings', [])
      context.commit('setAreResultMeetingsLoaded', true)
    })
  },
  fetchRaceResult (context, data) {
    // context.dispatch('cleanToteSr') // clear parallel calls for toteSr
    var self = this

    let shouldfetch = false
    let idtgrace = data.idtgrace
    let isperiodicrefresh = data.isperiodicrefresh === true
    let raceresultstats0 = context.getters['getRaceResultStats']
    window.clearTimeout(raceresultstats0.periodicfetchid)

    if (isperiodicrefresh === false && raceresultstats0 && raceresultstats0.idtgrace && raceresultstats0.idtgrace === idtgrace) {
      // we already have this toteRaceResult loaded or in progress
      // do nothing
    } else if (isperiodicrefresh === false) {
      context.commit('setRaceResultStats', { idtgrace: idtgrace, isloaded: false, periodicfetchid: null })
      context.commit('setRaceResult', undefined)
      shouldfetch = true
    } else if (isperiodicrefresh === true && raceresultstats0 && raceresultstats0.idtgrace && raceresultstats0.idtgrace === idtgrace) {
      shouldfetch = true
    }

    if (shouldfetch) {
      lib.kansas.toteraceresult({
        idtgrace: idtgrace
      }).then(response => {
        let raceresultstats1 = context.getters['getRaceResultStats']
        if (response && response.data && response.data.race && response.data.race.runners && idtgrace === raceresultstats1.idtgrace) { // only continue if matches idtgrace in state
          let raceresult = response.data

          if (raceresult && raceresult.pools) {
            // Hide non-supported pool types
            raceresult.poolsfordisplay = raceresult.pools.filter(pool => (self.getters['pmBetslipState/getAvailableRPTypes'].indexOf(pool.type) > -1 || self.getters['pmBetslipState/getAvailableRCTypes'].indexOf(pool.type) > -1 || self.getters['pmBetslipState/getAvailableMRTypes'].indexOf(pool.type) > -1))
          } else {
            raceresult.pools = []
            raceresult.poolsfordisplay = []
          }

          context.commit('setRaceResult', raceresult)
          context.commit('setRaceResultStats', { isloaded: true })

          let fetchIdNew = window.setTimeout(() => {
            context.dispatch('fetchRaceResult', { idtgrace: idtgrace, isperiodicrefresh: true })
          }, context.state.periodicallyFetchDelay)
          context.commit('setRaceResultStats', { periodicfetchid: fetchIdNew })
        }
      }).catch(() => {
        let raceresultstats2 = context.getters['getRaceResultStats']
        if (idtgrace === raceresultstats2.idtgrace) { // only continue if matches idtgrace in state
          let fetchIdNew = window.setTimeout(() => {
            context.dispatch('fetchRaceResult', { idtgrace: idtgrace, isperiodicrefresh: true })
          }, context.state.periodicallyFetchDelay)
          context.commit('setRaceResultStats', { periodicfetchid: fetchIdNew })
        }
      })
    }
  },
  fetchToteSr (context, data) {
    // context.dispatch('cleanRaceResult') // clear parallel calls for results
    let shouldfetch = false
    let idtgrace = data.idtgrace
    let isperiodicrefresh = data.isperiodicrefresh === true
    let totesrstats0 = context.getters['getToteSrStats']
    window.clearTimeout(totesrstats0.periodicfetchid)

    // console.log('fetchToteSr -1:', idtgrace, isperiodicrefresh, data, totesrstats0.idtgrace, totesrstats0.isloaded, totesrstats0.periodicfetchid)

    if (isperiodicrefresh === false && totesrstats0 && totesrstats0.idtgrace && totesrstats0.idtgrace === idtgrace) {
      // we already have this toteSr loaded or in progress
      // do nothing
    } else if (isperiodicrefresh === false) {
      context.commit('setToteSrStats', { idtgrace: idtgrace, isloaded: false, periodicfetchid: null })
      context.commit('setToteSr', undefined)
      shouldfetch = true
    } else if (isperiodicrefresh === true && totesrstats0 && totesrstats0.idtgrace && totesrstats0.idtgrace === idtgrace) {
      shouldfetch = true
    }

    if (shouldfetch) {
      // console.log('fetchToteSr 0:', idtgrace, isperiodicrefresh, data, totesrstats0.idtgrace, totesrstats0.isloaded, totesrstats0.periodicfetchid)
      let generatorParams = { idtgrace: idtgrace }

      lib.kansas.toteSr(generatorParams).then(response => {
        let totesrstats1 = context.getters['getToteSrStats']
        // console.log('fetchToteSr 1:', idtgrace, isperiodicrefresh, data, totesrstats1.idtgrace, totesrstats1.isloaded, totesrstats1.periodicfetchid)
        if (response && response.data && response.data.race && response.data.race.runners && idtgrace === totesrstats1.idtgrace) { // only continue if matches idtgrace in state
          for (let r = 0; r < response.data.race.runners.length; r++) {
            let coupledis = false
            let coupledfirst = false
            let coupledlast = false
            let coupledallnr = false
            if (response.data.race.runners[r].coupled) {
              let couplednum = response.data.race.runners[r].couplednum
              coupledfirst = r === 0 || !response.data.race.runners[r - 1].coupled || response.data.race.runners[r - 1].couplednum !== couplednum
              coupledlast = r === response.data.race.runners.length - 1 || !response.data.race.runners[r + 1].coupled || response.data.race.runners[r + 1].couplednum !== couplednum
              coupledis = true
              if (response.data.race.runners[r].runningstatus === 'NON_RUNNER') {
                coupledallnr = true
                for (let r2 = 0; r2 < response.data.race.runners.length; r2++) {
                  if (response.data.race.runners[r2].coupled && response.data.race.runners[r2].couplednum === couplednum && (typeof response.data.race.runners[r2].runningstatus === 'undefined' || response.data.race.runners[r2].runningstatus !== 'NON_RUNNER')) {
                    coupledallnr = false
                  }
                }
              }
            }
            response.data.race.runners[r].coupled = coupledis
            response.data.race.runners[r].coupledfirst = coupledfirst
            response.data.race.runners[r].coupledlast = coupledlast
            response.data.race.runners[r].coupledallnr = coupledallnr
          }

          context.commit('setToteSr', response.data)
          context.commit('setToteSrStats', { isloaded: true })

          let fetchIdNew = window.setTimeout(() => {
            context.dispatch('fetchToteSr', { idtgrace: idtgrace, isperiodicrefresh: true })
          }, context.state.periodicallyFetchDelay)
          context.commit('setToteSrStats', { periodicfetchid: fetchIdNew })
          // console.log('fetchToteSr 2:', idtgrace, fetchIdNew)
        }
      }).catch((error) => {
        console.log(error)
        let totesrstats2 = context.getters['getToteSrStats']
        if (idtgrace === totesrstats2.idtgrace) { // only continue if matches idtgrace in state
          let fetchIdNew = window.setTimeout(() => {
            context.dispatch('fetchToteSr', { idtgrace: idtgrace, isperiodicrefresh: true })
          }, context.state.periodicallyFetchDelay)
          context.commit('setToteSrStats', { periodicfetchid: fetchIdNew })
        }
      })
    }
  },
  fetchToteMr (context, idtgmeeting) {
    let totemrstats0 = context.getters['getToteMrStats']
    let isperiodicrefresh = totemrstats0.periodicfetchid !== null
    let fetchid4ToteMr = totemrstats0.periodicfetchid || null
    window.clearTimeout(fetchid4ToteMr)

    if (!context.state.totemr || !context.state.totemr.meeting || totemrstats0.idtgmeeting !== idtgmeeting || isperiodicrefresh === false) {
      context.commit('setToteMrStats', { isloaded: false })
      context.commit('setToteMr', undefined)
    }

    let generatorParams = { idtgmeeting: idtgmeeting }
    // let isLoggedIn = context.rootGetters['isLoggedIn']

    context.commit('setToteMrStats', { idtgmeeting: idtgmeeting, periodicfetchid: null })

    lib.kansas.toteMr(generatorParams).then(response => {
      let totemrstats1 = context.getters['getToteMrStats']
      if (response && response.data && response.data.meeting && response.data.meeting.races && totemrstats1 && totemrstats1.idtgmeeting === response.data.meeting.idtgmeeting) {
        response.data.meeting.races.forEach(race => {
          if (race && race.runners) {
            for (let r = 0; r < race.runners.length; r++) {
              let coupledis = false
              // let coupledcount = 0
              let coupledfirst = false
              let coupledlast = false
              let coupledallnr = false
              if (race.runners[r].coupled) {
                let couplednum = race.runners[r].couplednum
                coupledfirst = r === 0 || !race.runners[r - 1].coupled || race.runners[r - 1].couplednum !== couplednum
                coupledlast = r === race.runners.length - 1 || !race.runners[r + 1].coupled || race.runners[r + 1].couplednum !== couplednum
                coupledis = true
                if (race.runners[r].runningstatus === 'NON_RUNNER') {
                  coupledallnr = true
                  for (let r2 = 0; r2 < race.runners.length; r2++) {
                    if (race.runners[r2].coupled && race.runners[r2].couplednum === couplednum && (typeof race.runners[r2].runningstatus === 'undefined' || race.runners[r2].runningstatus !== 'NON_RUNNER')) {
                      coupledallnr = false
                    }
                  }
                }
              }
              race.runners[r].coupled = coupledis
              race.runners[r].coupledfirst = coupledfirst
              race.runners[r].coupledlast = coupledlast
              race.runners[r].coupledallnr = coupledallnr
            }
          }
        })
      }
      context.commit('setToteMr', response.data)
      context.commit('setToteMrStats', { isloaded: true })

      let fetchIdNew = window.setTimeout(() => {
        context.dispatch('fetchToteMr', idtgmeeting)
      }, context.state.periodicallyFetchDelay)
      context.commit('setToteMrStats', { periodicfetchid: fetchIdNew })
    }).catch((error) => {
      console.log(error)
      let fetchIdNew = window.setTimeout(() => {
        context.dispatch('fetchToteMr', idtgmeeting)
      }, context.state.periodicallyFetchDelay)
      context.commit('setToteMrStats', { periodicfetchid: fetchIdNew })
    })
  },
  cleanRaceResult (context) {
    let stats = context.getters['getRaceResultStats']
    window.clearTimeout(stats.periodicfetchid)

    context.commit('setRaceResultStats', { isloaded: false, idtgrace: null, periodicfetchid: null })
    context.commit('setRaceResult', undefined)
  },
  cleanToteSr (context) {
    let stats = context.getters['getToteSrStats']
    window.clearTimeout(stats.periodicfetchid)

    context.commit('setToteSrStats', { isloaded: false, idtgrace: null, periodicfetchid: null })
    context.commit('setToteSr', undefined)
  },
  cleanToteMr (context) {
    let stats = context.getters['getToteMrStats']
    window.clearTimeout(stats.periodicfetchid)

    context.commit('setToteMrStats', { isloaded: false, idtgmeeting: null, periodicfetchid: null })
    context.commit('setToteMr', undefined)
  },
  toggleRaceDetails (context) {
    context.commit('toggleRaceDetails')
  }
}

const mutations = {
  setMeetings (state, meetings) {
    state.meetings = meetings || []
  },
  setAreMeetingsLoaded (state, value) {
    state.areMeetingsLoaded = value
  },
  setResultDate (state, date) {
    state.resultdate = date || null
  },
  setResultMeetings (state, meetings) {
    state.resultmeetings = meetings || []
  },
  setAreResultMeetingsLoaded (state, value) {
    state.areResultMeetingsLoaded = value
  },
  setRaceResult (state, result) {
    state.raceresult = result
  },
  setRaceResultStats (state, data) {
    if (typeof data.isloaded !== 'undefined') { state.raceresultstats.isloaded = data.isloaded }
    if (typeof data.idtgrace !== 'undefined') { state.raceresultstats.idtgrace = data.idtgrace }
    if (typeof data.periodicfetchid !== 'undefined') { state.raceresultstats.periodicfetchid = data.periodicfetchid }
  },
  setToteSr (state, data) {
    state.totesr = data
  },
  setToteSrStats (state, data) {
    if (typeof data.isloaded !== 'undefined') { state.totesrstats.isloaded = data.isloaded }
    if (typeof data.idtgrace !== 'undefined') { state.totesrstats.idtgrace = data.idtgrace }
    if (typeof data.periodicfetchid !== 'undefined') { state.totesrstats.periodicfetchid = data.periodicfetchid }
  },
  setToteMr (state, data) {
    state.totemr = data
  },
  setToteMrStats (state, data) {
    if (typeof data.isloaded !== 'undefined') { state.totemrstats.isloaded = data.isloaded }
    if (typeof data.idtgmeeting !== 'undefined') { state.totemrstats.idtgmeeting = data.idtgmeeting }
    if (typeof data.periodicfetchid !== 'undefined') { state.totemrstats.periodicfetchid = data.periodicfetchid }
  },
  toggleRaceDetails (state) {
    state.showracedetails = !state.showracedetails
  },
  setRaceclockTzSuffix (state, data) {
    state.raceclocktzsuffix = data
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
