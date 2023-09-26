<template>
  <div class="contest-picks-page" v-if="!isContestsReportsPage">
    <contest-picks-header v-if="mobileBigAndBelow" />
    <contest-picks-body />
  </div>
  <router-view v-else></router-view>
</template>

<script>
import store from '@/store'
import { mapGetters } from 'vuex'
import contestPicksHeader from '@/components/sports/contests/contestPicksHeader.vue'
import contestPicksBody from '@/components/sports/contests/contestPicksBody.vue'
import Screen from '@/components/mixins/Screen'
import Session from '@/components/mixins/Session'

export default {
  name: 'ContestPicksPage',
  components: {
    contestPicksHeader,
    contestPicksBody
  },
  mixins: [
    Screen,
    Session
  ],
  data () {
    return {
      pollingData: null,
      pollInterval: 30000 // 30s
    }
  },
  computed: {
    ...mapGetters('contests', [
      'getContestEventsPicks'
    ]),
    isContestsReportsPage () {
      return this.$route.name === 'contests/my-picks/reports'
    },
    contestId () {
      return Number(this.$route.params.contestId)
    },
    contestEntryId () {
      return Number(this.$route.params.contestEntryId)
    }
  },
  watch: {
    getContestEventsPicks () {
      clearInterval(this.pollingData)
      this.pollContestEventPicks()
    }
  },
  methods: {
    fetchContestEventPicks () {
      store.dispatch('contests/fetchContestEventPicks', {
        contestId: this.contestId,
        contestEntryId: this.contestEntryId
      })
    },
    pollContestEventPicks () {
      this.pollingData = setInterval(this.fetchContestEventPicks, this.pollInterval)
    }
  },
  created () {
    this.fetchContestEventPicks()
    this.pollContestEventPicks()
  },
  mounted () {
    this.userIsActive()
  },
  beforeDestroy () {
    clearInterval(this.pollingData)
  }
}
</script>
