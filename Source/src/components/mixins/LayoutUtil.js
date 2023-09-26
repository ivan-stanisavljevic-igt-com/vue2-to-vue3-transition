// import store from '@/store'
// import config from '@/config'

export default {
  data: () => ({
  }),

  computed: {
  },

  methods: {
    /**
     * Extract list code for participant based on event data (data is supplied by one of content calls)
     * @param {Object} eventobj
     * @param {string} haType indicator if we should make list code for Home or Away. Pass 'H' or 'HOME' for home, 'A'/'AWAY' for away participant
     * @param {boolean} fallbackToSelection should list code be searched from selections if not present on event level
     * @returns {string} list code value or empty string if no match found
     */
    luListcode4ParticipantMake (eventobj, haType, fallbackToSelection = true) {
      let code = ''
      if (eventobj && eventobj.eventlistcode) {
        let elcParts = (eventobj.eventlistcode + '').split('|')
        if (elcParts && elcParts.length === 2) {
          if (['H', 'HOME'].indexOf(haType.toUpperCase()) >= 0) {
            code = elcParts[1]
          } else if (['A', 'AWAY'].indexOf(haType.toUpperCase()) >= 0) {
            code = elcParts[0]
          }
        }
      }

      if (eventobj && code === '' && fallbackToSelection) { // fallback to selections for possible ListCode values
        let markets = []
        if (eventobj.markets) {
          markets = markets.concat(eventobj.markets)
        }
        if (eventobj.eventmarketgroups) {
          eventobj.eventmarketgroups.forEach(emg => {
            if (emg && emg.markets) { markets = markets.concat(emg.markets) }
          })
        }
        let markets4HA = markets.filter(m => m.idfohadtype && m.idfohadtype === 'HA') || []
        if (markets4HA) {
          if (['H', 'HOME'].indexOf(haType.toUpperCase()) >= 0) {
            let sels4home = markets4HA.reduce((prev, crnt) => prev.concat(crnt.selections.filter(s => s.hadvalue === 'H' && s.listcode) || []), [])
            if (sels4home && sels4home.length > 0) { code = sels4home[0].listcode }
          } else if (['A', 'AWAY'].indexOf(haType.toUpperCase()) >= 0) {
            let sels4away = markets4HA.reduce((prev, crnt) => prev.concat(crnt.selections.filter(s => s.hadvalue === 'A' && s.listcode) || []), [])
            if (sels4away && sels4away.length > 0) { code = sels4away[0].listcode }
          }
        }
      }

      return code
    }
  }
}
