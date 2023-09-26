<template>
  <span v-if="timer" :idfosbtimer="timer.idfosbtimer && timer.idfosbtimer.toString()">
    {{ timerCurrentRealValue }}
    <!--<table>-->
      <!--<tr v-for="(value, key) in timer">-->
        <!--<td>{{ key }}</td>-->
        <!--<td>{{ value }}</td>-->
      <!--</tr>-->
      <!--<tr>-->
        <!--<td></td>-->
        <!--<td></td>-->
      <!--</tr>-->
      <!--<tr>-->
        <!--<td>tslastupdated</td>-->
        <!--<td>{{ new Date(timer.tslastupdated) }}</td>-->
      <!--</tr>-->
      <!--<tr>-->
        <!--<td>timerAgeInSeconds</td>-->
        <!--<td>{{ timerAgeInSeconds }}</td>-->
      <!--</tr>-->
      <!--<tr>-->
        <!--<td>timerRealValue</td>-->
        <!--<td>{{ timerRealValue }}</td>-->
      <!--</tr>-->
      <!--<tr>-->
        <!--<td>count</td>-->
        <!--<td>{{ count }}</td>-->
      <!--</tr>-->
      <!--<tr>-->
        <!--<td>localClockOffsetInSeconds</td>-->
        <!--<td>{{ localClockOffsetInSeconds }}</td>-->
      <!--</tr>-->
    <!--</table>-->
  </span>
</template>
<script>
  import store from '@/store'
//  import Vue from 'vue'

  export default {
    name: 'match-time-display-component',

    props: [
      'timer'
    ],

    data () {
      return {
        count: 0,
        displayFormat: 'mm:ss', // mm - 3'   /  mm:ss - 3:33,
        showZeroTime: false
      }
    },

    computed: {
      localClockOffsetInSeconds () {
        return store.getters['livebettingState/localClockOffsetInSeconds']
      },
      timerAgeInSeconds () {
        if (this.timer && this.timer.isactive) {
          var counterTime = new Date(this.timer.tslastupdated)
          var currentTime = (new Date()).getTime() + this.localClockOffsetInSeconds * 1000
          return Math.floor((currentTime - counterTime.getTime()) / 1000)
        }

        return 0
      },
      timerRealValue () {
        if (this.timer) {
          if (this.timer.currentvalue < 0) {
            return 0
          } else {
            if (this.timer.iscountdown) {
              return this.timer.currentvalue - this.timerAgeInSeconds
            } else {
              return this.timer.currentvalue + this.timerAgeInSeconds
            }
          }
        }
      },
      timerCurrentRealValue () {
        let minutes = 0
        let seconds = 0
        const isFullFormat = this.displayFormat === 'mm:ss'

        if (this.timerRealValue) {
          const value = this.timer.iscountdown ? this.timerRealValue - this.count : this.timerRealValue + this.count

          if (value >= 0) {
            minutes = isFullFormat ? Math.floor(value / 60) : Math.ceil(value / 60)
            seconds = value - minutes * 60
          }
        }

        let formatted = isFullFormat ? `${this.formatWithLeadingZeros(minutes)}:${this.formatWithLeadingZeros(seconds)}` : `${minutes}'`
        if (this.timer.iscountdown) {
          formatted = `< ${formatted}` // If it is count down, then display a "<" to indicate it is a less than value
        }

        const result = this.showZeroTime || minutes > 0 || seconds > 0 ? formatted : ''
        return result
      }
    },

    methods: {
      formatWithLeadingZeros (value, numberMaxDigits = 2) {
        const validValue = value ? value.toString() : '0'
        const processed = validValue.padStart(numberMaxDigits, '0')
        return processed
      }
    },
    mounted () {
      setInterval(() => {
        if (this.timer && this.timer.isactive) {
          this.count++
        }
      }, 1000)
    },

    watch: {
      timerRealValue () {
        this.count = 0
      }
    }
  }
</script>
<style lang="stylus" scoped>
</style>
