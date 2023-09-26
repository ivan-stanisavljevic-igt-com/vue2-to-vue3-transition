<template>
  <v-container fluid class="market-headline" v-if="market">
    <div v-if="iseventlive && market">
      <markets class="markets-container" :markets="[market]" :diplayOnPage="'headline-market'"></markets>
    </div>

    <div v-else>
      <coupon-event :market="market"></coupon-event>
    </div>
  </v-container>
</template>
<script>
  import store from '@/store'
  import couponEvent from '@/components/sports/bettingoffer/couponEvent'
  import markets from '@/components/sports/bettingoffer/markets'

  export default {
    name: 'event',

    components: {
      couponEvent,
      markets
    },

    props: [
      'idfoliveevent',
      'idfomarket',
      'iseventlive'
    ],

    data () {
      return {

      }
    },

    computed: {
      markets () {
        return store.getters['bonavigationState/markets']
      },
      market () {
        if (this.idfomarket && this.markets) {
          return this.markets[this.idfomarket]
        } else {
          return undefined
        }
      }
    },

    methods: {
      fetchMarketsByIds (idfomarkets) {
        if (idfomarkets) {
          store.dispatch('bonavigationState/fetchMarketsByIds', idfomarkets)
        }
      }
    },

    created () {
      if (this.idfomarket) {
        this.fetchMarketsByIds(this.idfomarket)
      }
    },

    destroyed () {

    },

    watch: {
      idfomarket () {
        if (this.idfomarket) {
          this.fetchMarketsByIds(this.idfomarket)
        }
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .market-headline {
    overflow: hidden;
  }
</style>
