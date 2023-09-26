import store from '@/store'
import config from '@/config'
import Gtm from '@/components/mixins/Gtm'
import Branding from '@/components/mixins/Branding'

export default {
  mixins: [
    Gtm,
    Branding
  ],
  computed: {
    liveEvents () {
      var liveEvents = store.getters['livebettingState/liveEvents']
      return liveEvents && liveEvents.filter(ev => !ev.isawaitingstart)
    },
    liveEventsLoaded () {
      return store.getters['livebettingState/liveEventsLoaded']
    },
    boNavigation () {
      return store.getters['bonavigationState/boNavigation']
    },

    idfwbonavigation1 () {
      return this.$route.params.idfwbonavigation1
    },
    idfwbonavigation2 () {
      return this.$route.params.idfwbonavigation2
    },

    dateFormats () {
      // get override by brand if exists
      var dateFormats = config.app.dateFormats
      var brandingOverrides = dateFormats && dateFormats.overrides && dateFormats.overrides[this.brandKey]
      if (brandingOverrides) {
        for (let key in brandingOverrides) {
          dateFormats[key] = brandingOverrides[key]
        }
      }
      return dateFormats
    },
    isDebug () {
      return this.$route.query.debug || store.getters['getDebugLevel']
    }
  },

  methods: {
    goToEvent (event) {
      var idfosporttype = event.idfosporttype || (event.markets && event.markets[0] && event.markets[0].idfosporttype) || undefined
      this.sendGTMGoToEventPage(this.couponname, event.fosportname || event.sportname || event.idfosport, idfosporttype, this.isLiveEvent(event.idfoevent))

      if (event.idfoevent) {
        if (['search', 'searchsport', 'searchcompetition'].indexOf(this.$route.name) > -1) {
          this.$router.push({ name: 'event', params: { idfoevent: event.idfoevent }, query: { search: 'true' } })
        } else {
          this.$router.push({ name: 'event', params: { idfoevent: event.idfoevent } })
        }
      }
    },
    checkIsNodeNavigationType (node, navigationType) {
      if (node && node.idfwbonavigationtypes) {
        return node.idfwbonavigationtypes.filter(item => item === navigationType).length > 0
      }

      return false
    },
    isDateToday (date) {
      // do not display TODAY/TOMORROW for selected brands
      if (['circa'].indexOf(this.brandKey) === -1 && date) {
        var arrDateAndTime = date && date.toString().split('T')
        var arrDate = arrDateAndTime && Array.isArray(arrDateAndTime) ? arrDateAndTime[0].split('-') : arrDateAndTime.split('-')
        if (arrDate && arrDate.length === 3) {
          try {
            let year = arrDate[0] && parseInt(arrDate[0])
            let month = arrDate[1] && parseInt(arrDate[1])
            let day = arrDate[2] && parseInt(arrDate[2])
            let today = new Date()
            if (year === today.getFullYear() && month === (today.getMonth() + 1) && day === today.getDate()) {
              return true
            }
          } catch (e) {
            console.log(`isDateToday - Could not parse the date (${date}): [${e.message}]`)
            return false
          }
        }
      }
      return false
    },
    isDateTomorrow (date) {
      // do not display TODAY/TOMORROW for selected brands
      if (['circa'].indexOf(this.brandKey) === -1 && date) {
        var arrDateAndTime = date && date.toString().split('T')
        var arrDate = arrDateAndTime && Array.isArray(arrDateAndTime) ? arrDateAndTime[0].split('-') : arrDateAndTime.split('-')
        if (arrDate.length === 3) {
          try {
            let year = arrDate[0] && parseInt(arrDate[0])
            let month = arrDate[1] && parseInt(arrDate[1])
            let day = arrDate[2] && parseInt(arrDate[2])
            let today = new Date()
            let tomorrow = new Date(today)
            tomorrow.setDate(today.getDate() + 1)
            if (year === tomorrow.getFullYear() && month === (tomorrow.getMonth() + 1) && day === tomorrow.getDate()) {
              return true
            }
          } catch (e) {
            console.log(`isDateTomorrow - Could not parse the date (${date}): [${e.message}]`)
            return false
          }
        }
      }
      return false
    },
    isLiveEvent (idfoevent) {
      return this.liveEvents.filter(ev => ev.idfoevent === idfoevent).length > 0
    }
  }
}
