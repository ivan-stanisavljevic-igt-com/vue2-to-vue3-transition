<template>
  <div class="page-content">
    <!--sports-breadcrumb></sports-breadcrumb-->
    <bo-node-content :bonode="currentBoNavigation"></bo-node-content>
  </div>
</template>
<script>
  import BoNavigation from '@/components/sports/bettingoffer/BoNavigation'
  import BoNodeContent from '@/components/sports/bettingoffer/BoNodeContent'
  import SportsBreadcrumb from '@/components/sports/bettingoffer/SportsBreadcrumb'
  import Screen from '@/components/mixins/Screen'
  import BettingOffer from '@/components/mixins/BettingOffer'

  export default {
    name: 'SportsPage',

    mixins: [
      Screen,
      BettingOffer
    ],

    components: {
      BoNavigation,
      BoNodeContent,
      SportsBreadcrumb
    },

    data () {
      return {
        right: true
      }
    },

    computed: {
      currentBoNavigation () {
        var idfwbonavigation = this.idfwbonavigation2 || this.idfwbonavigation1 || 'top'
        return (idfwbonavigation && this.boNavigation && this.boNavigation[idfwbonavigation]) || undefined
      }
    },

    methods: {

    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
