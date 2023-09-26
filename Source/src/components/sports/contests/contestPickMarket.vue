<template>
  <tr class="contest-pick-market" v-if="marketSelections.length === 2" :class="{ disabled: isDisabled }">
    <contestPickSelection :selection="selectionHome" :handicap="handicap" @emit-pick-id="getCurrentylSelectedPickId" :currentlySelectedId="currentlySelectedPickId" />
    <td class="contest-pick-handicap"><span v-if="handicap">{{ handicap }}</span></td>
    <contestPickSelection :selection="selectionAway" :handicap="handicap" @emit-pick-id="getCurrentylSelectedPickId" :currentlySelectedId="currentlySelectedPickId" />
    <td class="contest-pick-start-time">{{ startTime }}</td>
  </tr>
</template>

<script>
import moment from 'moment'
import contestPickSelection from '@/components/sports/contests/contestPickSelection.vue'

export default {
  name: 'contestPickMarket',
  components: {
    contestPickSelection
  },
  props: {
    contestMarket: Object,
    expectedStartTime: String
  },
  data () {
    return {
      currentlySelectedPickId: null
    }
  },
  computed: {
    startTime () {
      return `${moment.utc(this.expectedStartTime).format('hh:mm A')}`
    },
    handicap () {
      return this.contestMarket && this.contestMarket.handicap
    },
    marketSelections () {
      return this.contestMarket && this.contestMarket.selections
    },
    marketStatus () {
      return this.contestMarket && this.contestMarket.status
    },
    selectionHome () {
      return this.marketSelections && this.marketSelections.find(selection => selection.had === 'H')
    },
    selectionAway () {
      return this.marketSelections && this.marketSelections.find(selection => selection.had === 'A')
    },
    isDisabled () {
      return ['CLS', 'RSL'].includes(this.marketStatus)
    }
  },
  methods: {
    getCurrentylSelectedPickId (id) {
      this.currentlySelectedPickId = id
    }
  }
}
</script>

<style lang="stylus" scoped>
.contest-pick-handicap 
  font-weight: 800
.contest-pick-market.disabled 
  color: #B8B8B8
  opacity: 0.7
  pointer-events: none
.contest-pick-handicap,
.contest-pick-start-time
  text-align: center
</style>
