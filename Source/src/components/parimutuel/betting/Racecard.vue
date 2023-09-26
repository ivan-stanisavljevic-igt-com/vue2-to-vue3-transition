<template>
  <div class="racecard">
    <!--[racecard: rcconf: {{rcconf}} | rcfilter: {{rcfilter}} | rcsort: {{rcsort}} | idtgmeeting: {{idtgmeeting}}, {{rcidtgmeeting}}, areMeetingsLoaded: {{areMeetingsLoaded + ''}}]-->
    <div class="loader-holder" v-if="!areMeetingsLoaded">
      <loader></loader>
    </div>
    <div v-else-if="rcconf.layout === 'meeting-and-race-list'">
      <table v-if="meetings && meetings.length > 0" class="pmtable greyrows">
        <thead>
          <tr>
            <th>{{$t('Racecard.Race.Title')}}</th>
            <th>{{$t('Racecard.Time.Title')}}</th>
            <th>{{$t('Racecard.Conditions.Title')}}</th>
            <th>{{$t('Racecard.Status.Title')}}</th>
            <th></th>
          </tr>
        </thead>
        <tbody v-for="meeting in meetings" :key="'meeting'+meeting.id">
          <tr :key="'meeting-head-'+meeting.id">
            <td colspan="5" class="meeting-head">{{meeting.name}}</td>
          </tr>
          <tr v-for="race in meeting.races" :key="'race'+race.id" @click="selectRace4Info(race.meetingid, race.id)" class="clickable">
            <td class="racenum">{{race.num}}</td>
            <td class="racetime">{{pmFormatStartTs(race.tsstart)}}</td>
            <td>{{race.surface}} &nbsp; <i>{{race.distance}}</i></td>
            <td :class="'racegsc racegsc-'+(race.gsc ? race.gsc.toLowerCase() : 'unknown')">{{race.gsc}}</td>
            <td class="rpointer"><span class="icon-right"></span></td>
          </tr>
        </tbody>
      </table>
      <div class="no-meetings" v-else>
        <span>{{$t('Racecard.NO_MEETINGS_&_RACES_AVAILABLE')}}</span>
      </div>
    </div>

    <div v-else-if="rcconf.layout === 'meeting-list'">
      <table v-if="meetings && meetings.length > 0" class="pmtable greyrows">
        <thead>
          <tr>
            <th>{{$t('Racecard.Track.Title')}}</th>
            <th>{{$t('Racecard.Races')}}</th>
            <th class="racetime">{{$t('Racecard.PostTime')}}</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="meeting in meetings" :key="'meeting-entry-'+meeting.id" @click="selectMeeting4PeriodContext(meeting.id)" class="clickable">
            <td>{{meeting.name}}</td>
            <td class="racecount">{{meeting.races.length}}</td>
            <td class="racetime"><template v-if="meeting.races.length > 0">{{pmFormatStartTs(meeting.races[0].tsstart)}}</template></td>
            <td class="rpointer"><span class="icon-right"></span></td>
          </tr>
        </tbody>
      </table>
      <div class="no-meetings" v-else>
        <span>{{$t('Racecard.NO_MEETINGS_&_RACES_AVAILABLE')}}</span>
      </div>
    </div>

    <div v-else-if="rcconf.layout === 'meeting-races-list'">
      <template v-if="meeting">
        <div class="pmtable-head">
          <div class="pmtable-head-line">
            <span class="pmtable-head-title">{{meeting.name}}</span>
            <span class="pmtable-head-weather"><span v-if="meeting.goingcode">{{meeting.goingcode}}</span><span v-if="meeting.goingcode && meeting.weather">, </span><span v-if="meeting.weather">{{meeting.weather}}</span></span>
          </div>
        </div>

        <table class="pmtable greyrows">
          <thead>
            <tr>
              <th>{{$t('Racecard.Race.Title')}}</th>
              <th class="racetime">{{$t('Racecard.Time.Title')}}</th>
              <th>{{$t('Racecard.Status.Title')}}</th>
              <th class="racemoney">{{$t('Racecard.PoolAmount.Title')}}</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="race in races" :key="'race'+race.id" @click="pmAutonavToFirstBetting(race.meetingid, race.id)" class="clickable">
              <td class="racenum">{{race.num}}</td>
              <td class="racetime">{{pmFormatStartTs(race.tsstart)}}</td>
              <td :class="'racegsc racegsc-'+(race.gsc ? race.gsc.toLowerCase() : 'unknown')">{{race.gsc}}</td>
              <td class="racemoney"><template v-if="race.totalpoolvaluesum">{{ race.totalpoolvaluesum | currency }}</template><template v-else>--</template></td>
              <td class="rpointer"><span class="icon-right"></span></td>
            </tr>
          </tbody>
        </table>
      </template>

      <div class="no-meetings" v-else>
        <span>{{$t('Racecard.NO_MEETINGS_&_RACES_AVAILABLE')}}</span>
      </div>
    </div>

    <div v-else-if="rcconf.layout === 'race-list'">
      <table v-if="races.length > 0" class="pmtable greyrows">
        <thead>
          <tr>
            <th>{{$t('Racecard.Track.Title')}}</th>
            <th>{{$t('Racecard.Race.Title')}}</th>
            <th class="tac">{{$t('Racecard.Time.Title')}}</th>
            <th class="tac">{{$t('Racecard.PoolAmount.Title')}}</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="race in races" :key="'race'+race.id" @click="selectRace4Info(race.meetingid, race.id)" class="clickable">
            <td>{{race.meetingname}}</td>
            <td class="racenum">{{race.num}}</td>
            <td class="tac">{{pmFormatStartTs(race.tsstart)}}</td>
            <td class="tac"><template v-if="race.totalpoolvaluesum">{{ race.totalpoolvaluesum | currency }}</template><template v-else>--</template></td>
            <td class="rpointer"><span class="icon-right"></span></td>
          </tr>
        </tbody>
      </table>
      <div class="no-meetings" v-else>
        <span>{{$t('Racecard.NO_MEETINGS_&_RACES_AVAILABLE')}}</span>
      </div>
    </div>

    <div class="no-layout" v-else>
      <span>No layout for {{rcconf.layout}}</span>
    </div>
  </div>
</template>
<script>
import store from '@/store'
import Loader from '@/components/common/Loader'
import PariMutuel from '@/components/mixins/PariMutuel'
import moment from 'moment'

export default {
  name: 'racecard',

  components: {
    Loader
  },

  mixins: [
    PariMutuel
  ],

  data () {
    return {
      // raceid: this.idtgrace,
      cardraces: [],
      cardmeetings: []
    }
  },
  props: [
    'rcconf',
    'rcfilter',
    'rcsort',
    'rcidtgmeeting'
  ],
  filters: {
  },

  computed: {
    areMeetingsLoaded () {
      if (this.rcfilter && this.rcfilter.period && this.rcfilter.period === 'date') {
        return store.getters['racecardState/getAreResultMeetingsLoaded']
      } else {
        return store.getters['racecardState/getAreMeetingsLoaded']
      }
    },
    idtgmeeting () {
      return this.rcidtgmeeting ? this.pmRouteParamToFloat(this.rcidtgmeeting, null) : null
    },
    meetingsByContext () {
      let meetings = []
      if (this.rcfilter && this.rcfilter.period && this.rcfilter.period === 'date') {
        meetings = store.getters['racecardState/getResultMeetings'] || []
      } else {
        meetings = store.getters['racecardState/getMeetings'] || []
      }
      return meetings
    },
    meeting () {
      let mID = this.idtgmeeting
      let meetings = this.meetingsByContext
      meetings = meetings.filter(meeting => meeting.id === mID)

      return meetings && meetings.length > 0 ? meetings[0] : null
    },
    meetings () {
      let meetings = this.meetingsByContext
      let meetings2 = []

      let rcfilter4breed = this.rcfilter && this.rcfilter.breed ? this.rcfilter.breed : null
      let rcfilter4period = this.rcfilter && this.rcfilter.period ? this.rcfilter.period : null
      // for Others
      meetings.forEach(meeting => {
        let isOk = true
        if (rcfilter4breed && meeting.breed !== rcfilter4breed) { isOk = false }

        if (rcfilter4period && rcfilter4period === 'future') {
          let firstracestart = this.pmMakeTsstartByDateAndTime(meeting.date, '1130')
          if (!this.pmDateIsFuture(firstracestart)) {
            isOk = false
          }
        } else if (rcfilter4period && rcfilter4period === 'today') {
          let firstracestart = this.pmMakeTsstartByDateAndTime(meeting.date, '1130')
          if (this.pmDateIsFuture(firstracestart)) {
            isOk = false
          }
        }

        if (isOk) { meetings2.push(meeting) }
      })

      if (this.rcsort && this.rcsort === 'meetingname') {
        meetings2 = meetings2.sort((m1, m2) => m1.name === m2.name ? (m1.id - m2.id) : (m1.name > m2.name ? 1 : -1))
      }

      return meetings2
    },
    races () {
      let meetings = this.meetingsByContext
      let races = []

      let rcfilter4breed = this.rcfilter && this.rcfilter.breed ? this.rcfilter.breed : null
      let rcfilter4period = this.rcfilter && this.rcfilter.period ? this.rcfilter.period : null
      let rcfilter4raceunifiedstatuscode = this.rcfilter && this.rcfilter.raceunifiedstatuscode ? this.rcfilter.raceunifiedstatuscode : null

      for (let m = 0; m < meetings.length; m++) {
        if (rcfilter4breed && rcfilter4breed !== meetings[m].breed) { continue }
        if (this.idtgmeeting && this.idtgmeeting !== meetings[m].id) { continue }
        for (let r = 0; r < meetings[m].races.length; r++) {
          if (rcfilter4raceunifiedstatuscode && rcfilter4raceunifiedstatuscode !== meetings[m].races[r].usc) { continue }

          meetings[m].races[r].meetingid = meetings[m].id
          meetings[m].races[r].meetingname = meetings[m].name
          meetings[m].races[r].meetingdate = meetings[m].date

          let racetsstartm = moment(meetings[m].races[r].tsstart)
          meetings[m].races[r].racetsstartint = racetsstartm.isValid() ? racetsstartm.unix() : 0

          if (rcfilter4period && rcfilter4period === 'next' && meetings[m].races[r].usc === 'ON') {
            races.push(meetings[m].races[r])
          } else {
            races.push(meetings[m].races[r])
          }
        }
      }

      if (this.rcsort && this.rcsort === 'racestart') {
        races = races.sort((race1, race2) => race1.racetsstartint - race2.racetsstartint)
      }

      return races
    }
  },

  methods: {
    selectMeeting4RaceList (mID) {
      let params = { idtgmeeting: mID }
      params.period = this.$route.params.period || 'today'
      params.breed = this.$route.params.breed || 'all'
    },
    selectMeeting4PeriodContext (mID) {
      let params = { idtgmeeting: mID }
      if (this.pmNavRacecardParams) {
        switch (this.pmNavRacecardParams && this.pmNavRacecardParams.periodCompound) {
          case 'all':
          case 'today':
          case 'future':
          case 'next':
            params.period = this.$route.params.period || 'today'
            params.breed = this.$route.params.breed || 'all'
            this.$router.push({ name: 'pm-for-period-breed-meeting', params: params })
            break
          case 'date':
            let meetings = this.meetingsByContext
            meetings = meetings.filter(meeting => meeting.id === mID)
            if (meetings && meetings.length > 0 && meetings[0].races && meetings[0].races.length > 0) {
              params.idtgrace = meetings[0].races[0].id
              this.$router.push({ name: 'pm-for-period-breed-meeting-race', params: params })
            }
            break
        }
      }
    },
    selectRace4Info (mID, rID) {
      let params = { idtgmeeting: mID, idtgrace: rID }
      params.period = this.$route.params.period || 'today'
      params.breed = this.$route.params.breed || 'all'
      this.$router.push({ name: 'pm-for-period-breed-meeting-race', params: params })
    },
    selectRace4Betting (mID, rID) {
      let firstPoolOfferType = 'info'
      let meetings = this.meetings
      for (let m = 0; m < meetings.length; m++) {
        for (let po = 0; po < meetings[m].pooloffers.length; po++) {
          if (meetings[m].pooloffers[po].legs && meetings[m].pooloffers[po].legs.length > 0 && meetings[m].pooloffers[po].legs[0].r === rID) {
            firstPoolOfferType = meetings[m].pooloffers[po].type
            break
          }
        }
      }
      this.$router.push({ name: 'pmbetting-meeting-race-pool', params: { idtgmeeting: mID, idtgrace: rID, pooltype: firstPoolOfferType } })
    }
  },

  watch: {
    $route (to, from) {
      console.log('Racecard watch for $route -> will refresh arrays for meetings and races', to, from)
      this.cardraces = this.races
      this.cardmeetings = this.meetings
    }
  }
}
</script>
