import moment from 'moment'

export default {
  methods: {
    secondsToDHM (seconds) {
      seconds = Number(seconds)
      let days = Math.floor(seconds / (3600 * 24))
      let hours = Math.floor((seconds % (3600 * 24)) / 3600)
      let minutes = Math.floor((seconds % 3600) / 60)
      let daysDisplay = days > 0 ? days + 'd' : ''
      let hoursDisplay = hours > 0 ? hours + 'h' : ''
      let minutesDisplay = minutes > 0 ? minutes + 'm' : ''
      return `${daysDisplay} ${hoursDisplay} ${minutesDisplay}`
    },
    timeDifferenceCalculator (timeTo, timeFrom) {
      return this.secondsToDHM(moment(timeTo).diff(moment(timeFrom), 'seconds'))
    }
  }
}
