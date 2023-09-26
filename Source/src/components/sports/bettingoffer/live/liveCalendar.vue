<template>
  <div class="" :class="['live-calendar', { 'no-events': upcomingEvents.length === 0 }]">
    <h3>{{ $t('Sports.LiveCalendar') }}</h3>

    <div class="sports" v-if="!this.idfosporttype && Object.keys(avalableSports).length > 0">
      <span :class="['sporttab', {'active': selectedSportTypeComputed === sporttypeid}]"
            @click.stop="selectSportType(sporttypeid)"
            v-for="(sporttypename, sporttypeid) in avalableSports">
        <span :class="['sport-icon', 'Spicon-' + sporttypeid]"></span>
        {{ sporttypename }} ({{ upcomingEvents.filter(ev => ev.IDFOSportType === sporttypeid).length }})
      </span>
    </div>

    <div class="days" v-if="upcomingEvents.length > 0">
        <span :class="['daytab', {'active': dayNames[selectedDayIndex] === day }]" v-for="day in weekDays" @click.stop="selectDay(day)">
          {{ day }}
        </span>
    </div>

    <div class="events">
      <div v-if="upcomingEventsPerSportAndDay && upcomingEventsPerSportAndDay.length > 0" class="event" v-for="event in upcomingEventsPerSportAndDay">
        <live-event-info :event="event" :isawaitingstart="event.isawaitingstart"></live-event-info>
      </div>
      <div v-if="upcomingEventsPerSportAndDay.length === 0">{{ $t('Sports.NoAvailableEvents') }}</div>
    </div>
  </div>
</template>
<script>
  import store from '@/store'
  import Vue from 'vue'
  import liveEventInfo from '@/components/sports/bettingoffer/live/liveEventInfo'

  export default {
    name: 'live-calendar-component',

    components: {
      liveEventInfo
    },

    props: [
      'idfosporttype'
    ],

    data () {
      return {
        dayNames: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        selectedSportType: this.idfosporttype,
        selectedDayIndex: new Date().getDay()
      }
    },

    computed: {
      upcomingEvents () {
        var allEvents = store.getters['livebettingState/upcomingEvents']

        if (allEvents && Array.isArray(allEvents) && allEvents.length > 0) {
          return allEvents.filter(ev => ev.isawaitingstart)
        } else {
          return []
        }
      },
      upcomingEventsPerSportAndDay () {
        return (this.upcomingEvents &&
          this.upcomingEvents.filter(event => event.Display.dayofweek === this.dayNames[this.selectedDayIndex] &&
                                              (this.selectedSportType === event.IDFOSportType))) || []
      },
      avalableSports () {
        var sports = {}

        if (this.upcomingEvents && this.upcomingEvents.length > 0) {
          this.upcomingEvents.forEach((item) => {
            if (!sports[item.IDFOSportType]) {
              Vue.set(sports, item.IDFOSportType, item.FOSportTypeName)
            }
          })
        }

        return sports
      },
      selectedSportTypeComputed () {
        if (!this.selectedSportType && this.avalableSports) {
          for (var key in this.avalableSports) {
            this.selectedSportType = key
            break
          }
        }

        return this.selectedSportType
      },
      weekDays () {
        var arrWeekDays = []

        var todayIndex = new Date().getDay()
        var counter = 0

        while (counter < 7) {
          arrWeekDays.push(this.dayNames[todayIndex])
          todayIndex++
          counter++
          if (todayIndex === 7) {
            todayIndex = 0
          }
        }
        return arrWeekDays
      }
    },

    methods: {
      selectSportType (idfosporttype) {
        this.selectedSportType = idfosporttype
      },
      selectDay (dayName) {
        this.selectedDayIndex = this.dayNames.indexOf(dayName)
      }
    }
  }
</script>
<style lang="stylus" scoped>
  .sports {
    margin: 0 0 15px 0;

  }
  .sports .sporttab,
  .daytab {
    border: solid 1px #999;
    padding: 5px;
    margin: 5px;
    cursor: pointer;
  }

  .event {
    clear: both
  }

  .nomarkets {
    color: #ccc;
    border: solid 2px #ccc;
    border-radius: 5px;
    padding: 10px;
    display: inline-block;
    margin: 15px;
  }
  .live-coupon {
    width: 50%;
  }

  .live-calendar .event {
    border: solid 1px #ccc;
  }
</style>
