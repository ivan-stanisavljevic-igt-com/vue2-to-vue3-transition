<template>
<div>
  <table v-for="events in contestEventsByTime" :key="events[0].id" class="contests-table">
      <thead>
        <tr>
            <th colspan="4"><span>{{ contestName }}</span> - <span>{{ eventStartDate(events[0].expectedStartTime) }}</span></th>
        </tr>
      </thead>
      <contestPick v-for="pick in events" :key="pick.id" :contestPick="pick" />
  </table>
</div>
</template>

<script>
import { mapGetters } from 'vuex'
import moment from 'moment'
import contestPick from '@/components/sports/contests/contestPick.vue'

export default {
  name: 'contestsTable',
  components: {
    contestPick
  },
  computed: {
    ...mapGetters('contests', [
      'getContestEventsPicks',
      'getContestEntry'
    ]),
    contestEventPicks () {
      return this.getContestEventsPicks
    },
    contestEntryId () {
      return Number(this.$route.params.contestEntryId)
    },
    contestEntry () {
      return this.getContestEntry(this.contestEntryId)
    },
    contest () {
      return this.contestEntry && this.contestEntry.contest
    },
    contestName () {
      return this.contest && this.contest.name
    },
    contestStartTime () {
      return this.contest && this.contest.startTime && `${moment(this.contest.startTime).format('MMMM DD, YYYY')}`
    },
    contestEventsByTime () {
      //  Group & sort contest events by expected start time
      const eventsGroups = this.contestEventPicks.reduce((eventsGroups, item) => {
        const group = (eventsGroups[item.expectedStartTime] || [])
        group.push(item)
        eventsGroups[item.expectedStartTime] = group
        return eventsGroups
      }, {})
      return Object.keys(eventsGroups).sort().reduce((o, k) => Object.assign(o, { [k]: eventsGroups[k] }), {})
    }
  },
  methods: {
    eventStartDate (date) {
      return `${moment(date).format('MMMM DD, YYYY')}`
    }
  }
}
</script>

<style lang="stylus" scoped>
table.contests-table
  color: var(--account-heading-color)
  table-layout: fixed
  width: 100%
table.contests-table
  th 
    background: #E6EDEF
  tbody:nth-child(odd)
    background: #f2f2f2
</style>
