<template>
  <div class="page-content live-sports-page">
    <meta-content></meta-content>
    <!-- <sports-breadcrumb :title="'Live'"></sports-breadcrumb> -->
    <live-coupon></live-coupon>
  </div>
</template>

<script>
  import store from '@/store'
  import MetaContent from '@/components/sports/bettingoffer/metaContent'
  import SportsMenu from '@/components/sports/bettingoffer/SportsMenu'
  import LiveCoupon from '@/components/sports/bettingoffer/live/LiveCoupon'
  import LiveCalendar from '@/components/sports/bettingoffer/live/LiveCalendar'
//  import Betslip from '@/components/sports/betslip/BetslipPage'
  import Screen from '@/components/mixins/Screen'
  import Headlines from '@/components/sports/bettingoffer/headlines'
  import SportsBreadcrumb from '@/components/sports/bettingoffer/SportsBreadcrumb'

  export default {
    name: 'LiveSportsPage',

    mixins: [
      Screen
    ],

    components: {
      MetaContent,
      SportsMenu,
      LiveCoupon,
      LiveCalendar,
//      Betslip,
      Headlines,
      SportsBreadcrumb
    },

    data () {
      return {
        drawer: true,
        right: true
      }
    },

    computed: {
      dialogSportsMenu () {
        return store.getters['overlayState/getSportsMenuState']
      },
      dialogBetslip () {
        return store.getters['overlayState/getBetslipState']
      }
    },

    methods: {
      closeMenu () {
        store.dispatch('overlayState/deactivateSportsMenu')
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus">
@import '~@/css/config'
.headlines
  height: 107px
  @media mobile-big-and-below
    display none
</style>
