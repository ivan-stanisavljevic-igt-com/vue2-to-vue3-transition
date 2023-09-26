<template>
  <div class="" :class="['live-navigation', { 'no-events': liveEvents.length === 0 }]">
    <h3>{{ $t('Sports.LiveNavigation') }}</h3>
    <div v-for="(sporttypename, sporttypeid) in avalableSports" class="sports">
      <h3 class="sportname" @click.stop="toggleSport(sporttypeid)"><span :class="['sport-icon', 'Spicon-' + sporttypeid]"></span>{{ sporttypename }}</h3>
      <div class="events" v-show="collapsedSports.indexOf(sporttypeid) === -1">
        <div :class="['event', {active: event.idfoevent.toString() === idfoevent.toString()}]" v-for="event in liveEvents" v-if="event.IDFOSportType === sporttypeid">
          <live-event-info :event="event"></live-event-info>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import store from '@/store'
  import Vue from 'vue'
  import LiveEventInfo from '@/components/sports/bettingoffer/live/liveEventInfo'
  import BettingOffer from '@/components/mixins/BettingOffer'

  export default {
    name: 'live-navigation-component',

    components: {
      LiveEventInfo
    },

    mixins: [
      BettingOffer
    ],

    data () {
      return {
        collapsedSports: []
      }
    },

    computed: {
      idfoevent () {
        return this.$route.params.idfoevent
      },
      avalableSports () {
        var sports = {}

        this.liveEvents.forEach((item) => {
          if (!sports[item.IDFOSportType]) {
            Vue.set(sports, item.IDFOSportType, item.FOSportTypeName)
          }
        })

        return sports
      }
    },

    methods: {
      toggleSport (idfosporttype) {
        if (this.collapsedSports.indexOf(idfosporttype) > -1) {
          this.collapsedSports.splice(this.collapsedSports.indexOf(idfosporttype), 1)
        } else {
          this.collapsedSports.push(idfosporttype)
        }
      }
    }
  }
</script>
<style lang="stylus" scoped>
  .sports h3.sportname {
    margin: 5px 0 5px 0;
    cursor: pointer;
  }
  .sports .events {
    margin: 0 0 10px 0;
  }

  .live-navigation .event {
    border: solid 1px #ccc;
  }

</style>
