<template>
  <span class="ts-start" v-if="tsstart">
    <span v-if="isDateToday(tsstart)">Today {{ (tsstart) | moment(dateFormats.longTime)}}</span>
    <span v-if="isDateTomorrow(tsstart)">Tomorrow {{ (tsstart) | moment(dateFormats.longTime)}}</span>
    <span v-if="!isDateToday(tsstart) && !isDateTomorrow(tsstart)">{{ tsstart | moment(dateFormats.longDateTimeMG) }} </span>
  </span>
</template>

<script>
  import BettingOffer from '@/components/mixins/BettingOffer'

  export default {
    name: 'tsStart',

    props: ['tsstart'],

    mixins: [
      BettingOffer
    ],

    components: {},

    data () {
      return {
      }
    },

    computed: {

    },

    methods: {
    },

    created () {

    },

    watch: {
    },

    beforeDestroy () {
    },

    destroyed () {
    }
  }
</script>

<style lang="stylus" scoped>
.ts-start {
  /*font-size: 12px;*/
}
</style>
