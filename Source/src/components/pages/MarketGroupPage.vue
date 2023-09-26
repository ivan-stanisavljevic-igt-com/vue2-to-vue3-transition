<template>
  <div>
    <v-container fluid class="marketgroup-page">
        <market-group :idfwmarketgroup="idfwmarketgroup"></market-group>
    </v-container>
  </div>

</template>
<script>
  import tabCoupon from '@/components/sports/bettingoffer/tabCoupon'
  import marketGroup from '@/components/sports/bettingoffer/marketGroup'

  export default {
    name: 'marketgroup-page',

    components: {
      marketGroup
    },

    computed: {
      idfwmarketgroup () {
        return this.$route.params.idfwmarketgroup
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
