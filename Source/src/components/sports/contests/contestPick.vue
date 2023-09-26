<template>
  <tbody class="contest-pick">
    <contestPickMarket v-for="market in contestPickMarkets" :key="market.id" :contestMarket="market" :expectedStartTime="expectedStartTime" />
  </tbody>
</template>

<script>
import contestPickMarket from '@/components/sports/contests/contestPickMarket.vue'

export default {
  name: 'contestPick',
  components: {
    contestPickMarket
  },
  props: {
    contestPick: Object
  },
  computed: {
    contestPickMarkets () {
      return this.contestPick && this.contestPick.markets
    },
    expectedStartTime () {
      return this.contestPick && this.contestPick.expectedStartTime
    }
  }
}
</script>

