<template>
  <div class="page-content event-page">
    <!-- <event v-if="liveEventsLoaded"></event> -->
    <!-- ToDo revert this -->
    <event></event>
  </div>
</template>

<script>
  import SportsMenu from '@/components/sports/bettingoffer/SportsMenu'
  import BoNavigation from '@/components/sports/bettingoffer/BoNavigation'
  import SportsBreadcrumb from '@/components/sports/bettingoffer/SportsBreadcrumb'
//  import Betslip from '@/components/sports/betslip/BetslipPage'
  import Event from '@/components/sports/bettingoffer/Event'
  import Screen from '@/components/mixins/Screen'
  import Headlines from '@/components/sports/bettingoffer/headlines'
  import BettingOffer from '@/components/mixins/BettingOffer'

  export default {
    name: 'EventPage',

    mixins: [
      Screen,
      BettingOffer
    ],

    components: {
      SportsMenu,
      BoNavigation,
      SportsBreadcrumb,
//      Betslip,
      Event,
      Headlines
    },

    data () {
      return {
        drawer: true,
        right: true
      }
    },

    computed: {

    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
