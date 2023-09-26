import store from '@/store'
import config from '@/config'
import moment from 'moment'
import { i18n } from '@/main.js'

export default {
  data: () => ({
    raceclockCallID: null,
    raceclockCallTimeout: 1000, // 1 seconds
    pooltypenames: {
      WIN: { name: 'Win', shortname: 'WIN' },
      PLACE: { name: 'Place', shortname: 'PLC' },
      SHOW: { name: 'Show', shortname: 'SHW' },
      EW: { name: 'Win/Place', shortname: 'WP' },
      WINSHOW: { name: 'Win/Show', shortname: 'WS' },
      PLACESHOW: { name: 'Place/Show', shortname: 'PS' },
      WINPLACESHOW: { name: 'Win/Place/Show', shortname: 'WPS' },
      EXACTA: { name: 'Exacta', shortname: 'EXA' },
      QUINELLA: { name: 'Quinella', shortname: 'QNL' },
      SWINGER: { name: 'Swinger', shortname: 'OMN' },
      TRIFECTA: { name: 'Trifecta', shortname: 'TRI' },
      TRIO: { name: 'Triella', shortname: 'TRO' },
      SUPERFECTA: { name: 'Superfecta', shortname: 'SFC' },
      EXACT5: { name: 'Exact5', shortname: 'HI5' },
      DOUBLE: { name: 'Double', shortname: 'DBL' },
      PICK3: { name: 'Pick 3', shortname: 'PK3' },
      PICK4: { name: 'Pick 4', shortname: 'PK4' },
      PICK5: { name: 'Pick 5', shortname: 'PK5' },
      JACKPOT: { name: 'Pick 6', shortname: 'PK6' },
      PICK7: { name: 'Pick 7', shortname: 'PK7' },
      PICK8: { name: 'Pick 8', shortname: 'PK8' },
      PICK9: { name: 'Pick 9', shortname: 'PK9' },
      PICK10: { name: 'Pick 10', shortname: 'PK10' },
      PICK11: { name: 'Pick 11', shortname: 'PK11' },
      PICK12: { name: 'Pick 12', shortname: 'PK12' },
      GRANDSLAM: { name: 'Grand Slam', shortname: 'GSL' },
      QUINDBL: { name: 'Quinella Double', shortname: 'QNL' },
      EXACTADBL: { name: 'Double Exacta', shortname: 'DEX' }
    }
  }),

  computed: {
    dateFormats () { return config.app.dateFormats },
    runnerPoolCategory () { return store.getters['pmBetslipState/getPoolcategoryRunner'] },
    runnerPoolTypes () { return store.getters['pmBetslipState/getAvailableRPTypes'] },
    racecastPoolCategory () { return store.getters['pmBetslipState/getPoolcategoryRacecast'] },
    racecastPoolTypes () { return store.getters['pmBetslipState/getAvailableRCTypes'] },
    multiracePoolCategory () { return store.getters['pmBetslipState/getPoolcategoryMultirace'] },
    multiracePoolTypes () { return store.getters['pmBetslipState/getAvailableMRTypes'] },
    pmNavRacecardParams () {
      let params = { for: '', period: '', sporttype: null, idtgrace: null }
      params.period = this.$route.params.period || ''
      params.breed = this.$route.params.breed || 'all'
      params.idtgmeeting = this.pmRouteParamToFloat(this.$route.params.idtgmeeting)
      params.idtgrace = this.pmRouteParamToFloat(this.$route.params.idtgrace)
      params.periodCompound = ['all', 'today', 'future', 'next'].indexOf(params.period) > -1 ? params.period : params.period && /^[0-9]{8}$/.test(params.period) ? 'date' : ''
      return params
    },
    pmActivePool () { // current calculates only for Runner and Racecast pools
      let pool = null
      let urlPoolType = this.$route.params.pooltype
      let toteSr = store.getters['racecardState/getToteSr']
      if (toteSr) { pool = (toteSr.pools && toteSr.pools.filter(pool => pool.type === urlPoolType)[0]) || null }
      return pool
    },
    pmActiveBetType () { // current calculates only for Runner and Racecast pools
      let bt = null
      let urlPoolType = this.$route.params.pooltype
      let urlBetType = this.$route.params.bettype
      let toteSr = store.getters['racecardState/getToteSr']

      if (toteSr) {
        let pool = (toteSr.pools && toteSr.pools.filter(pool => pool.type === urlPoolType)[0]) || undefined
        if (pool) {
          if (pool.bettypes && pool.bettypes.length > 0 && urlBetType && pool.bettypes.filter(btype1 => btype1.id === urlBetType).length === 1) {
            bt = pool.bettypes.filter(btype2 => btype2.id === urlBetType)[0].id
          } else if (pool.bettypes && pool.bettypes.length > 0) {
            bt = pool.bettypes[0].id
          }
        }
      }
      return bt
    },
    pmBetSlipPlacementStatus () { return store.getters['pmBetslipState/getPlaceBetStatus'] },
    /** Can betslip be changed at the moment (e.g. can runners be added removed to it? */
    pmBetSlipIsAcceptingChanges () { return this.pmBetSlipPlacementStatus === '' },
    secToStartOffset () { return config.app.autoconf.PM_NEXT_RACE_TIME_TO_START_OFFSET }
  },

  methods: {
    pmFixMoney (money) {
      if (!Number.isNaN(money) && money !== null) {
        money = Number.parseFloat(money)
        return Math.round(money * 1000) / 1000
      }
      return money
    },
    pmIsDatetimeStringValid (datestring) {
      return moment(datestring).isValid()
    },
    pmDateIsToday (date) {
      return (moment(date).isValid()) && moment(date).toDate().toDateString() === new Date().toDateString()
    },
    pmDateIsTomorrow (date) {
      let tomorrow = new Date()
      tomorrow.setDate(tomorrow.getDate() + 1)
      return (moment(date).isValid()) && moment(date).toDate().toDateString() === tomorrow.toDateString()
    },
    pmDateIsFuture (date) {
      let today = new Date()
      if (moment(date).isValid()) {
        let dateObj = moment(date).toDate()
        return dateObj.getFullYear() > today.getFullYear() || (dateObj.getFullYear() === today.getFullYear() && dateObj.getMonth() > today.getMonth()) || (dateObj.getFullYear() === today.getFullYear() && dateObj.getMonth() === today.getMonth() && dateObj.getDate() > today.getDate())
      }
      return false
    },
    pmFormatStartTs (tsstart) {
      let res = '--'
      if (this.pmIsDatetimeStringValid(tsstart)) {
        res = this.pmDateIsToday(tsstart) ? moment(tsstart).format(config.app.dateFormats.longTime) : moment(tsstart).format(config.app.dateFormats.longDateTime)
      }
      return res || '--'
    },
    pmFormatStartTime (start) {
      let res = '-:-'
      if (start && /^\d{4}$/.test(start)) {
        let sh = parseInt(start.substring(0, 2), 10)
        let sm = start.substring(2, 4)
        if (sh === 0) {
          res = `12:${sm} AM`
        } else if (sh < 12) {
          res = `${sh}:${sm} AM`
        } else if (sh === 12) {
          res = `${sh}:${sm} PM`
        } else if (sh < 12) {
          let sh2 = sh - 12
          res = `${sh2}:${sm} PM`
        }
      }
      return res || '-:-'
    },
    pmMakeTsstartByDateAndTime (meetingdate, racestart) {
      let datetime = null
      if (typeof meetingdate !== 'undefined' && /^\d{8}$/.test(meetingdate) && typeof racestart !== 'undefined' && /^\d{4}$/.test(racestart)) {
        datetime = meetingdate.substring(4, 8) + '-' + meetingdate.substring(2, 4) + '-' + meetingdate.substring(0, 2) + 'T' + racestart.substring(0, 2) + ':' + racestart.substring(2, 4) + ':01'
      }
      return datetime
    },
    /**
     * Use to handle route parameters that should be floats (like idtgmeeting, idtgrace, idtgpooloffer, idtgrunner, etc)
     * @param {any} routeParam - a route parameter value (example: this.$route.params.routeParam)
     * @param {any} defaultValue - value to fallback if routeParam can not be converted to float
     */
    pmRouteParamToFloat (routeParam, defaultValue = null) {
      let routeParamFloat = defaultValue
      if (typeof (routeParam) === 'number') {
        routeParamFloat = routeParam
      } else if (typeof (routeParam) !== 'undefined') {
        routeParamFloat = Number.parseFloat(routeParam)
        if (Number.isNaN(routeParamFloat)) { routeParamFloat = defaultValue }
      }
      return routeParamFloat
    },
    /**
     * Is passed string in expected format (js date.toISOString with removed dashes)
     * @param {string} rcdate
     */
    pmIsValidRacecardDate (rcdate) {
      if (typeof rcdate !== 'undefined' && rcdate && rcdate.length === 8) {
        let rcdate2 = this.pmRacecardDateToIsoDate(rcdate) + 'T01:01:01Z'
        // console.log('pmIsValidRacecardDate', rcdate, rcdate2, this.pmIsDatetimeStringValid(rcdate2))
        return this.pmIsDatetimeStringValid(rcdate2)
      }
      return false
    },
    /**
     * Format non-dashed iso date to dashed iso date (20200326 to 2020-03-26)
     * @param {string|null} rcdate - date part from iso date string new Date().toISOString()
     */
    pmRacecardDateToIsoDate (rcdate) {
      let isodate = null
      if (typeof rcdate !== 'undefined' && /^\d{8}$/.test(rcdate)) {
        isodate = rcdate.substring(0, 4) + '-' + rcdate.substring(4, 6) + '-' + rcdate.substring(6, 8)
      }
      // new Date().toISOString().substr(0, 10)).replace(/-/g, '')
      return isodate
    },
    /**
     * Format date part of Iso Date (new Date().toISOString()) to same without dashes (2020-03-26 to 20200326)
     * @param {string|null} isodate date in Iso Foramt (example: 2020-03-26)
     */
    pmIsoDateToRacecardDate (isodate) {
      let rcdate = null
      if (isodate && isodate.length === 10) { rcdate = isodate.replace(/-/g, '') }
      return rcdate
    },
    pmRaceClockStart () {
      // console.log('pmRaceClockStart id:', config.app.webappstate.raceclockCallID)

      if (config.app.webappstate.raceclockCallID) {
        window.clearInterval(config.app.webappstate.raceclockCallID)
      }
      config.app.webappstate.raceclockCallID = window.setInterval(() => {
        this.pmRaceClockTick()
      }, this.raceclockCallTimeout)
    },
    pmRaceClockTick () {
      let tickerElms = document.getElementsByClassName('racetimeticker')
      if (tickerElms && tickerElms.length) {
        for (let i = 0; i < tickerElms.length; i++) {
          if (tickerElms[i] && tickerElms[i].dataset && tickerElms[i].dataset.racetsstart && tickerElms[i].dataset.racedatastamp) {
            // console.log('pmRaceClockTick', tickerElms[i].dataset.racetsstart, tickerElms[i].dataset.racedatastamp)
            let raceUSC = tickerElms[i].dataset.raceusc || null
            let racetimecalc = this.pmRaceClockCalculate(tickerElms[i].dataset.racetsstart, tickerElms[i].dataset.racedatastamp, raceUSC)

            tickerElms[i].innerHTML = racetimecalc.timetostart
            if (!tickerElms[i].classList.contains(racetimecalc.cssclass)) {
              tickerElms[i].classList.remove(racetimecalc.cssclasss)
              tickerElms[i].classList.add(racetimecalc.cssclass)
            }
          }
        }
      }
    },
    /**
     * Calculate start time info and css
     * @param {string} racetsstart - start time in ISO 8601 format with missing time zone part
     * @param {string|null} racedatastamp - date time in ISO 8601 format
     * @param {string|null} usc - unified status code
     */
    pmRaceClockCalculate (racetsstart, racedatastamp = null, usc = null) {
      let clockdata = { cssclasss: ['racetime-unknown', 'racetime-future', 'racetime-soon', 'racetime-prepost', 'racetime-post', 'racetime-over'], cssclass: 'racetime-unknown', sectostart: null, timetostart: '' }

      let tzSuffix = 'Z'
      let raceclockTzSuffix = store.getters['racecardState/getRaceclockTzSuffix'] || null
      if (racedatastamp && racedatastamp.length > 0) {
        let timepartsPlus = racedatastamp.split('+') // timestamp: "2020-08-23T21:35:59+02:00"
        let timepartsMinus = racedatastamp.split('-') // timestamp: "2020-08-23T21:35:59-02:00"
        if (timepartsPlus.length === 2) {
          tzSuffix = '+' + timepartsPlus[1]
          raceclockTzSuffix = '+' + timepartsPlus[1]
        } else if (timepartsMinus.length === 4) {
          tzSuffix = '-' + timepartsMinus[3]
          raceclockTzSuffix = '-' + timepartsMinus[1]
        }
      }
      if (tzSuffix === 'Z' && raceclockTzSuffix) { tzSuffix = raceclockTzSuffix }

      if (racetsstart && racetsstart.length > 0) {
        let rstart = racetsstart + tzSuffix
        // console.log('pmRaceClockCalculate', racetsstart, racedatastamp, tzSuffix, rstart)
        if (moment(rstart).isValid()) {
          let dtRaceStart = moment(rstart).utc()
          let dtNow = moment().utc()
          let secToStart = dtRaceStart.unix() - dtNow.unix()

          let remSecs = secToStart
          let remTimeSec = remSecs % 60
          let remTimeMin = Math.floor(remSecs / 60) % 60
          let remTimeHour = Math.floor(remSecs / (60 * 60)) % 24
          let remTimeDay = Math.floor(remSecs / (60 * 60 * 24))

          clockdata.sectostart = secToStart
          if (usc !== null && usc === 'OFF') {
            clockdata.timetostart = i18n.t('Racecard.RaceClosed')   // 'Race closed'
            clockdata.cssclass = 'racetime-over'
          } else if (remSecs < 1) {
            clockdata.timetostart = i18n.t('Racecard.PostTime')  // 'Post time'
            clockdata.cssclass = 'racetime-post'
          } else if (remSecs < 60) {
            clockdata.timetostart = `${remTimeMin}m ${remTimeSec}s`
            clockdata.cssclass = 'racetime-prepost'
          } else if (remSecs < 300) {
            clockdata.timetostart = `${remTimeMin}m ${remTimeSec}s`
            clockdata.cssclass = 'racetime-soon'
          } else if (remSecs < 60 * 60) {
            clockdata.timetostart = `${remTimeMin}m ${remTimeSec}s`
            clockdata.cssclass = 'racetime-future'
          } else if (remSecs < (60 * 60 * 24)) {
            clockdata.timetostart = `${remTimeHour}h ${remTimeMin}m`
            clockdata.cssclass = 'racetime-future'
          } else {
            clockdata.timetostart = `${remTimeDay}d ${remTimeHour}h`
            clockdata.cssclass = 'racetime-future'
          }
        }
      }
      return clockdata
    },
    pmAutonavToFirstBetting (idtgmeeting, idtgrace, pooltype) {
      // console.log('pmAutonavToFirstBetting start [idtgmeeting, idtgrace, pooltype]', idtgmeeting, idtgrace, pooltype)
      store.dispatch('pmBetslipState/toggleBetslip', { showbetslip: false })
      store.dispatch('pmBetslipState/resetBetSlip')

      let navMID = typeof idtgmeeting !== 'undefined' && idtgmeeting !== 0 ? idtgmeeting : 0
      let navRID = typeof idtgrace !== 'undefined' && idtgrace !== 0 ? idtgrace : 0
      let navPOType = typeof pooltype !== 'undefined' ? pooltype : 'info'

      let meetings = store.getters['racecardState/getMeetings'] || []
      let meeting = null

      if (navMID === 0) {
        let navRsectostart = -9999
        for (let m = 0; m < meetings.length; m++) {
          if (meetings[m].races.length > 0) {
            let tmpMeeting = meetings[m]
            for (let r = 0; r < tmpMeeting.races.length; r++) {
              let tmpRace = tmpMeeting.races[r]
              if (navMID === 0) {
                meeting = tmpMeeting
                navMID = tmpMeeting.id
                navRID = tmpRace.id
                if (tmpRace.usc === 'ON') {
                  navRsectostart = this.pmRaceClockCalculate(tmpRace.tsstart).sectostart
                }
                // console.log('pmAutonavToFirstBetting initial race', navMID, navRID, `${meeting.name} ${tmpRace.name} ${tmpRace.time} sectostart:${navRsectostart}`)
              } else if (tmpRace.usc === 'ON') {
                let racesectostart = this.pmRaceClockCalculate(tmpRace.tsstart).sectostart
                if (navRsectostart < this.secToStartOffset && racesectostart < this.secToStartOffset && racesectostart > navRsectostart) { // both under offset, pick the one to start later
                  meeting = tmpMeeting
                  navMID = tmpMeeting.id
                  navRID = tmpRace.id
                  // console.log('pmAutonavToFirstBetting race closer to offset and still before it', navMID, navRID, `${meeting.name} ${tmpRace.name} ${tmpRace.time} racesectostart:${racesectostart} sectostart:${navRsectostart} m date/r time:${tmpMeeting.date} ${tmpRace.time}`)
                  navRsectostart = racesectostart
                } else if (racesectostart > this.secToStartOffset && (navRsectostart < this.secToStartOffset || racesectostart < navRsectostart)) { // new race is sooner to start and over offset
                  meeting = tmpMeeting
                  navMID = tmpMeeting.id
                  navRID = tmpRace.id
                  // console.log('pmAutonavToFirstBetting race closer to offset and above it', navMID, navRID, `${meeting.name} ${tmpRace.name} ${tmpRace.time} racesectostart:${racesectostart} sectostart:${navRsectostart} m date/r time:${tmpMeeting.date} ${tmpRace.time}`)
                  navRsectostart = racesectostart
                }
              }
            }
          }
        }
      } else if (navMID > 0 && navRID === 0) {
        let navRsectostart = -9999
        for (let m = 0; m < meetings.length; m++) {
          let tmpMeeting = meetings[m]
          if (tmpMeeting.id === navMID && tmpMeeting.races.length > 0) {
            for (let r = 0; r < tmpMeeting.races.length; r++) {
              let tmpRace = tmpMeeting.races[r]
              if (navRID === 0) {
                meeting = tmpMeeting
                navRID = tmpRace.id
                if (tmpRace.usc === 'ON') {
                  navRsectostart = this.pmRaceClockCalculate(tmpRace.tsstart).sectostart
                }
              } else {
                if (tmpRace.usc === 'ON') {
                  let racesectostart = this.pmRaceClockCalculate(tmpRace.tsstart).sectostart
                  if (navRsectostart < this.secToStartOffset && racesectostart < this.secToStartOffset && racesectostart > navRsectostart) { // both under offset, pick the one to start later
                    meeting = tmpMeeting
                    navRID = tmpRace.id
                    // console.log('pmAutonavToFirstBetting race closer to offset and still before it', navMID, navRID, `${meeting.name} ${tmpRace.name} ${tmpRace.time} racesectostart:${racesectostart} sectostart:${navRsectostart} m date/r time:${tmpMeeting.date} ${tmpRace.time}`)
                    navRsectostart = racesectostart
                  } else if (racesectostart > this.secToStartOffset && (navRsectostart < this.secToStartOffset || racesectostart < navRsectostart)) { // new race is sooner to start and over offset
                    meeting = tmpMeeting
                    navRID = tmpRace.id
                    // console.log('pmAutonavToFirstBetting race closer to offset and above it', navMID, navRID, `${meeting.name} ${tmpRace.name} ${tmpRace.time} racesectostart:${racesectostart} sectostart:${navRsectostart} m date/r time:${tmpMeeting.date} ${tmpRace.time}`)
                    navRsectostart = racesectostart
                  }
                }
              }
            }
          }
        }
      } else if (navMID > 0 && navRID > 0) {
        for (let m = 0; m < meetings.length; m++) {
          if (meetings[m].id === navMID && meetings[m].races) {
            meeting = meetings[m]
            break
          }
        }
      }

      if (meeting && meeting.pooloffers && (typeof pooltype === 'undefined' || pooltype === null)) {
        let pos = meeting.pooloffers.filter(pooloffer => pooloffer.legs && pooloffer.legs.length > 0 && pooloffer.legs[0].n === 1 && pooloffer.legs[0].r === navRID)
        if (pos.length > 0) { navPOType = pos[0].type }
      }

      // console.log('pmAutonavToFirstBetting finish [navMID, navRID, navPOType]', navMID, navRID, navPOType)
      if (navMID > 0 && navRID > 0) {
        this.$router.push({ name: 'pmbetting-meeting-race-pool', params: { idtgmeeting: navMID, idtgrace: navRID, pooltype: navPOType } })
      }
    },
    /**
     * Find best matching pool offer in this order:
     * - if matches idtgpooloffer
     * - if matches pooltype and idtgrace is the first pool leg
     * - if matches pooltype and idtgrace is a pool leg
     * @param {Array} pooloffers
     * @param {number} idtgrace
     * @param {string} pooltype
     * @param {number|null} idtgpooloffer
     */
    pmAutopickPoolOffer (pooloffers, idtgrace, pooltype, idtgpooloffer = null) {
      let poolOffer = null
      let rid = this.pmRouteParamToFloat(idtgrace, 0)
      let potype = this.runnerPoolTypes.indexOf(pooltype) > -1 || this.racecastPoolTypes.indexOf(pooltype) > -1 || this.multiracePoolTypes.indexOf(pooltype) > -1 ? pooltype : 'xxx'
      let poid = this.pmRouteParamToFloat(idtgpooloffer, 0)

      if (poid && poid > 0) {
        let pooloffers1 = pooloffers.filter(pool => pool.id === poid) || []
        if (pooloffers1 && pooloffers1.length > 0) { poolOffer = pooloffers1[0] }
      } else {
        let pooloffers1 = pooloffers.filter(pool => pool.type === potype) || []
        let pooloffers2 = pooloffers1.filter(po => po.legs && po.legs.filter(leg => leg.n === 1 && leg.r === rid).length > 0)
        if (pooloffers2 && pooloffers2.length > 0) {
          poolOffer = pooloffers2[0]
        } else {
          pooloffers2 = pooloffers1.filter(po => po.legs && po.legs.filter(leg => leg.r === rid).length > 0)
          if (pooloffers2 && pooloffers2.length > 0) {
            poolOffer = pooloffers2[0]
          }
        }
      }
      return poolOffer
    },
    /**
     * Translate pool type id to human readable name
     * @param {string} pooltype pool type id
     * @param {string} towhat should translate to normal name or short name
     */
    pmTranslatePoolType (pooltype, towhat = 'name') {
      let res = pooltype
      let towhat2 = towhat === 'name' || towhat === 'shortname' ? towhat : 'name'
      if (this.pooltypenames && this.pooltypenames[pooltype] && this.pooltypenames[pooltype][towhat2]) { res = this.pooltypenames[pooltype][towhat2] }
      return res
    },
    /**
     * Translate bet type (for pool type) for provider
     * @param {string} pooltype
     * @param {string} bettype
     * @param {object|null} meta - something like { bettypes }
     * @param {string|null} defaultTranslation
     */
    pmTranslateBetType (pooltype, bettype, meta = null, defaultTranslation = null) {
      let res = pooltype + ' ' + bettype
      if (defaultTranslation && defaultTranslation.length > 0) { res = defaultTranslation }
      if (meta && meta.bettypes && meta.bettypes.length > 0) {
        let btMatch = meta.bettypes.filter(bt => bt.pooltype === pooltype && bt.bettype === bettype)
        if (btMatch && btMatch.length === 1) { res = btMatch[0].name }
      }
      return res
    },
    /**
     * Make nice formatted odds for layout. Will show prices in such order CP if availalbe, ML if available and no CP, defaultNoOddsStr if no CP and no ML prices
     * @param {object} runner - runner object
     * @param {string} defaultNoOddsStr - default display string if no CP/ML prices are available
     */
    pmFormatRunnerOdds (runner, defaultNoOddsStr = '') {
      let oddsstr = defaultNoOddsStr
      if (runner && runner.cppriceup && runner.cppricedown) {
        oddsstr = runner.cppriceup + '/' + runner.cppricedown
      } else if (runner && runner.mlpriceup && runner.mlpricedown) {
        oddsstr = runner.mlpriceup + '/' + runner.mlpricedown
      }
      return oddsstr
    },
    pmBetSlipAlert4NoChangesAllowed () {
      store.dispatch('overlayState/activateBetslipMsg', ['NOT_IDLE'])
    }
  }
}
