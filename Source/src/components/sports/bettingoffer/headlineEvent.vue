<template>
  <v-container fluid :class="['event', iseventlive]">
    <div>
      <div :class="['scoreboard', liveEvent.IDFOSportType]" v-if="iseventlive && liveEvent">
        <live-event-info v-if="liveEvent" :event="liveEvent"></live-event-info>
      </div>

      <headline-market v-if="idfomarket"
                          :idfomarket="idfomarket"
                          :iseventlive="iseventlive"
                          :liveevent="liveEvent"
                          :ismatchstarted="ismatchstarted"></headline-market>

      <div class="market" v-if="!idfomarket">
        <div class="market-unavailable">
          <span>{{ $t('Sports.NoAvailableMarkets') }}</span>
        </div>
      </div>
    </div>
  </v-container>
</template>
<script>
  import LiveEventInfo from '@/components/sports/bettingoffer/live/liveEventInfo'
  import headlineMarket from '@/components/sports/bettingoffer/headlineMarket'
  import BettingOffer from '@/components/mixins/BettingOffer'

  export default {
    name: 'event',

    components: {
      LiveEventInfo,
      headlineMarket
    },

    props: [
      'idfoliveevent',
      'idfomarket',
      'iseventlive',
      'ismatchstarted'
    ],

    mixins: [
      BettingOffer
    ],

    data () {
      return {

      }
    },

    computed: {
      liveEvent () {
        if (this.idfoliveevent && this.liveEvents && this.liveEvents.length > 0) {
          return this.liveEvents.filter(ev => ev.idfoevent.toString() === this.idfoliveevent.toString())[0] || undefined
        } else {
          return undefined
        }
      }
    },

    methods: {

    },

    created () {

    },

    destroyed () {

    },

    watch: {

    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
