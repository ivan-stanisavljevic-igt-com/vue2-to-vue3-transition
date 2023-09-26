<template>
  <div class="racecardnav">
    <!--[navigationContext:{{navigationContext}}, resultDate:{{resultDate}}, pmNavRacecardParams:{{pmNavRacecardParams}}]-->
    <div v-if="navigationContext === 'betting'">
      <div v-if="!areMeetingsLoaded" class="loader-holder">
        <loader></loader>
      </div>
      <div v-else-if="meetingsByContextAZ && meetingsByContextAZ.length > 0" class="pmlinenavs">
        <!--[{{idtgmeeting}} | {{idtgrace}} | {{pooltype}} | meetingsByContextAZ.length: {{meetingsByContextAZ.length}} | currentMeetingID: {{currentMeetingID}}]-->
        <div class="pmlinenav pmlinenav-with-pin pmlinenav-with-innerwrap">
         <a :key="'meeting-nav-i'" @click="navPageFor('today')" class="pmlinenav-link pmlinenav-link-txtless pmlinenav-link-pinned pm-icon-racing">i</a><!--
          --><div class="pmlinenav-innerwrap"><a v-for="meeting in meetingsByContextAZ" :key="'pmlinenav-track-' + meeting.id" @click="pmAutonavToFirstBetting(meeting.id)" class="pmlinenav-link" :class="{'selected': meeting.id === idtgmeeting }" :id="'pmlinenav-track-' + meeting.id"><span class="wpad">{{meeting.name}}</span></a><observer v-if="idtgmeeting" :key="'rcard-today-tracks-' + idtgmeeting" @intersect="racenavIntersected('rcard-betting-navs')" /></div>
        </div>
        <div class="pmlinenav racenum pmlinenav-with-pin pmlinenav-with-innerwrap" v-if="idtgmeeting !== null && currentMeetingRaces.length > 0">
          <a :key="'racenum-list'" @click="navPageForRaceInfo(idtgmeeting)" class="pmlinenav-link pmlinenav-link-txtless pmlinenav-link-pinned pm-icon-info" :class="{'selected': false }">i</a><!--
          --><div class="pmlinenav-innerwrap"><a v-for="race in currentMeetingRaces" :key="race.id" @click="pmAutonavToFirstBetting(idtgmeeting, race.id)" class="pmlinenav-link" :class="{'selected': race.id === idtgrace, 'uscON': race.usc === 'ON', 'uscOFF': race.usc === 'OFF' }">{{race.num}}</a></div>
        </div>
        <div class="pmlinenav pmbet pmlinenav-with-pin pmlinenav-with-innerwrap" v-if="idtgmeeting !== null && idtgrace !== null">
          <a v-if="currentMeetingRaceRunnerPools.length > 0 || currentMeetingRaceRacecastPools.length > 0 || currentMeetingRaceMultiracePools.length > 0" :key="'pooltype-dummy-info'" @click="pmAutonavToFirstBetting(idtgmeeting, idtgrace, 'info')" class="pmlinenav-link pmlinenav-link-txtless pmlinenav-link-pinned pm-icon-pmbet" :class="{'selected': pooltype === 'info' }">i</a><!--
          --><div class="pmlinenav-innerwrap"><a v-if="currentMeetingRaceRunnerPools.length > 0" :key="'pooltype-dummy-straight'" @click="pmAutonavToFirstBetting(idtgmeeting, idtgrace, currentMeetingRaceRunnerPools[0].type)" class="pmlinenav-link" :class="{'selected': availableRPTypes.indexOf(pooltype) > -1 }">{{$t('Racecardnav.Straight')}}</a><!--
          --><a v-for="pool in currentMeetingRaceRacecastPools" :key="pool.id" @click="pmAutonavToFirstBetting(idtgmeeting, idtgrace, pool.type)" class="pmlinenav-link" :class="{'selected': pool.type === pooltype}">{{pmTranslatePoolType(pool.type)}}</a><!--
          --><a v-for="pool in currentMeetingRaceMultiracePools" :key="pool.id" @click="pmAutonavToFirstBetting(idtgmeeting, idtgrace, pool.type)" class="pmlinenav-link" :class="{'selected': pool.type === pooltype}">{{pmTranslatePoolType(pool.type)}}</a></div>
        </div>
        <div class="pmlinenav" v-if="idtgmeeting !== null && idtgrace !== null && availableRPTypes.indexOf(pooltype) > -1">
          <a v-for="pool in currentMeetingRaceRunnerPools" :key="pool.id" @click="pmAutonavToFirstBetting(idtgmeeting, idtgrace, pool.type)" class="pmlinenav-link" :class="{'selected': pool.type === pooltype}">{{pmTranslatePoolType(pool.type)}}</a>
        </div>

        <div class="pmlinenav" v-if="idtgmeeting !== null && idtgrace !== null && availableRCTypes.indexOf(pooltype) > -1 && pmActivePool">
          <!--a v-for="btn in bettypeNames" :key="'pmlinenav-bettype1-'+btn.id" v-if="pmActivePool.bettypes.filter(btype2 => btype2.id === btn.id).length > 0" @click.prevent.stop="navPageForBetType(btn.id)" :class="{'pmlinenav-link':true, 'selected': btn.id === pmActiveBetType }">{{btn.name}}</a><br /-->
          <a v-for="btn in bettypeNames" :key="'pmlinenav-bettype2-'+btn.id" v-if="pmActivePool.bettypes.filter(btype2 => btype2.id === btn.id && !(pooltype === 'QUINELLA' && btype2.id === 'NO_OPTION')).length > 0" @click.prevent.stop="navPageForBetType(btn.id)" :class="{'pmlinenav-link':true, 'selected': btn.id === pmActiveBetType || (pooltype === 'QUINELLA' && pmActiveBetType === 'NO_OPTION' && btn.id === 'PERMUTATION') }">{{translateBetTypeName(pooltype, btn.id, btn.name)}}</a>
        </div>
      </div>
      <div class="no-tracks" v-else>
        <span>{{$t('Racecardnav.NoTracks')}}</span>
      </div>
    </div>
    <div v-else-if="navigationContext === 'racecards'">
      <div class="pmtitlenav">
        <span>{{$t('Racecardnav.RaceCardAndInfos')}}</span>
        <button @click="pmAutonavToFirstBetting()" class="ttlnavlink ttlnavlink-close"><v-icon>close</v-icon></button>
      </div>
      <div class="pmlinenavs">
        <div class="pmlinenav">
          <a :key="'pm-for-all'" @click="navPageFor('all')" class="pmlinenav-link" :class="{'selected': pmNavRacecardParams.period === 'all' }">{{$t('Racecardnav.All_Races')}}</a><!--
          --><a :key="'pm-for-today'" @click="navPageFor('today')" class="pmlinenav-link" :class="{'selected': pmNavRacecardParams.period === 'today' }">{{$t('Racecardnav.Today_Races')}}</a><!--
          --><a :key="'pm-for-next'" @click="navPageFor('next')" class="pmlinenav-link" :class="{'selected': pmNavRacecardParams.period === 'next' }">{{$t('Racecardnav.Next')}}</a><!--
          --><a :key="'pm-for-future'" @click="navPageFor('future')" class="pmlinenav-link" :class="{'selected': pmNavRacecardParams.period === 'future' }">{{$t('Racecardnav.Future')}}</a><!--
          --><a :key="'pm-for-date'" @click="navPageFor('date')" class="pmlinenav-link" :class="{'selected': pmNavRacecardParams.periodCompound === 'date' }">{{$t('Racecardnav.Results')}}</a>
        </div>
        <div class="pmlinenav" v-if="pmNavRacecardParams.periodCompound === 'date'">
          <div @click="showRcnavCallendar(!rcnavDatepickerVisisble)" class="pmlinenav-link selected pmlinenav-link-date"><v-icon>event</v-icon><span>{{ resultDate | moment(dateFormats.longDate) }}</span></div>
          <div v-show="rcnavDatepickerVisisble" class="pmbs-callendarwrap">
            <v-date-picker v-model="rcnavDate" no-title scrollable actions :full-width="true" :max="rcnavDateMax">
              <template>
                <v-card-actions class="pmbs-callendarbuts">
                  <v-btn color="primary" @click="selectRcnavDate()">{{$t('Racecardnav.OK')}}</v-btn>
                  <v-btn color="gray lighten-1" @click="showRcnavCallendar(false)">{{$t('Racecardnav.Cancel')}}</v-btn>
                </v-card-actions>
              </template>
            </v-date-picker>
          </div>
        </div>
        <template v-if="['all', 'today', 'future', 'next', 'date'].indexOf(pmNavRacecardParams.periodCompound) > -1">
          <div class="pmlinenav">
            <a :key="'pm-for-breed-all'" @click="navPageFor(pmNavRacecardParams.period)" class="pmlinenav-link" :class="{'selected': pmNavRacecardParams.breed === 'all' }">{{$t('Racecardnav.All')}}</a><!--
            --><a v-for="st in meetingsBreeds" :key="'pm-for-breed-'+st" @click="navPageFor(pmNavRacecardParams.period, st)" class="pmlinenav-link" :class="{'selected': pmNavRacecardParams.breed === st }">{{st}}</a>
          </div>
          <div class="pmlinenav pmlinenav-with-innerwrap" v-if="idtgrace !== null">
            <div class="pmlinenav-innerwrap"><a v-for="meeting in meetingsByContextAZ" :key="'pm-for-meeting-'+meeting.id" @click="navPageForRaceInfo(meeting.id, meeting.firstraceid)" class="pmlinenav-link" :class="{'selected': meeting.id === idtgmeeting }" :id="'pmlinenav-track-' + meeting.id"><span class="wpad">{{meeting.name}}</span></a></div>
            <observer v-if="idtgmeeting" :key="'rcard-info-tracks-' + idtgmeeting" @intersect="racenavIntersected('rcard-info-navs')" />
          </div>
          <div class="pmlinenav" v-if="idtgrace !== null && currentMeeting">
            <a v-for="race in currentMeeting.races" :key="'pm-for-meeting-race-'+race.id" @click="navPageForRaceInfo(currentMeeting.id, race.id)" class="pmlinenav-link" :class="{'selected': race.id === idtgrace }">{{race.num}}</a>
          </div>
        </template>
        <div class="pmlinenav" v-if="['all', 'today', 'future', 'next', 'date'].indexOf(pmNavRacecardParams.periodCompound) === -1">{{$t('Racecardnav.Rasults_Range_Filter_na')}}</div>
      </div>
    </div>
  </div>
</template>
<script>
  import store from '@/store'
  import Loader from '@/components/common/Loader'
  import PariMutuel from '@/components/mixins/PariMutuel'
  import Observer from '@/components/parimutuel/helper/Observer'

  export default {
    name: 'racecardnav',

    data () {
      return {
        bettypeNames: [
          { id: 'NO_OPTION', name: 'Rank (in first)' },
          { id: 'STRAIGHT', name: 'Rank (1, 2, 3)' },
          { id: 'BANKER', name: 'Key' },
          { id: 'PERMUTATION', name: 'Box' },
          { id: 'FLOATING_BANKER', name: 'Key Box' }],
        rcnavDate: null,
        rcnavDateMax: new Date().toISOString().substr(0, 10),
        rcnavDatepickerVisisble: false
      }
    },

    components: {
      Loader,
      Observer
    },

    mixins: [
      PariMutuel
    ],

    filters: {
    },

    computed: {
      navigationContext () {
        let ctx = ''
        switch (this.$route.name) {
          case 'pm-for':
          case 'pm-for-period':
          case 'pm-for-period-breed':
          case 'pm-for-period-breed-meeting':
          case 'pm-for-period-breed-meeting-race':
            ctx = 'racecards'
            break
          case 'pmbetting':
          case 'pmbetting-meeting':
          case 'pmbetting-meeting-race':
          case 'pmbetting-meeting-race-pool':
          case 'pmbetting-meeting-race-pool-bettype':
            ctx = 'betting'
            break
        }
        return ctx
      },
      idtgmeeting () { return this.pmRouteParamToFloat(this.$route.params.idtgmeeting) },
      idtgrace () { return this.pmRouteParamToFloat(this.$route.params.idtgrace) },
      pooltype () { return this.$route.params.pooltype },
      idtgpooloffer () { return this.pmRouteParamToFloat(this.$route.params.idtgpooloffer) },
      bettype () { return this.$route.params.bettype },
      breed () { return this.$route.params.breed },
      availableRPTypes () { return store.getters['pmBetslipState/getAvailableRPTypes'] },
      availableRCTypes () { return store.getters['pmBetslipState/getAvailableRCTypes'] },
      availableMRTypes () { return store.getters['pmBetslipState/getAvailableMRTypes'] },
      resultDate: {
        get: function () {
          let resdate = store.getters['racecardState/getResultDate']
          // console.log(resdate)
          return resdate
        },
        set: function (newValue) { }
      },
      areMeetingsLoaded () {
        if (this.navigationContext === 'racecards' && this.pmNavRacecardParams && this.pmNavRacecardParams.periodCompound === 'date') {
          return store.getters['racecardState/getAreResultMeetingsLoaded']
        } else {
          return store.getters['racecardState/getAreMeetingsLoaded']
        }
      },
      meetingsByContext () {
        let meetings = []
        if (this.navigationContext === 'racecards' && this.pmNavRacecardParams && this.pmNavRacecardParams.periodCompound === 'date') {
          meetings = store.getters['racecardState/getResultMeetings'] || []
        } else {
          meetings = store.getters['racecardState/getMeetings'] || []
        }
        return meetings
      },
      meetingsByContextAZ () {
        let breed = this.$route.params.breed
        if (breed && breed !== 'all') {
          let meetings4st = this.meetingsByContext.filter(meeting => meeting.breed === breed)
          return meetings4st.sort((m1, m2) => m1.name === m2.name ? (m1.id - m2.id) : (m1.name > m2.name ? 1 : -1))
        } else {
          return this.meetingsByContext.sort((m1, m2) => m1.name === m2.name ? (m1.id - m2.id) : (m1.name > m2.name ? 1 : -1))
        }
      },
      meetingsBreeds () {
        let meetings = this.meetingsByContext
        let isOther = false
        let sts = new Set()
        for (let i = 0; i < meetings.length; i++) {
          if (meetings[i].breed === 'Others') {
            isOther = true
          } else {
            sts.add(meetings[i].breed)
          }
        }
        if (isOther) {
          sts.add('Others')
        }
        return sts
      },
      /**
       * Return selected meeting, autoselect first open or first in order
       * */
      currentMeetingID () {
        let mID = 0
        let firstmID = 0
        if (this.$route.params && this.$route.params.idtgmeeting) {
          mID = this.pmRouteParamToFloat(this.$route.params.idtgmeeting, 0)
        }
        return mID > 0 ? mID : firstmID
      },
      currentMeeting () {
        let mID = this.currentMeetingID
        let meetings2 = this.meetingsByContextAZ.filter(meeting => meeting.id === mID) || []
        return meetings2.length > 0 ? meetings2[0] : null
      },
      currentMeetingRaces () {
        let meeting = this.currentMeeting
        return meeting && meeting.races ? meeting.races : []
      },
      currentMeetingRacePools () {
        let rid = this.idtgrace
        let meeting = this.currentMeeting
        return meeting ? meeting.pooloffers.filter(po => po.legs.filter(leg => leg.n === 1 && leg.r === rid).length > 0) || [] : []
      },
      currentMeetingRaceRunnerPools () {
        let pools = this.currentMeetingRacePools
        return pools.filter(po => this.availableRPTypes.indexOf(po.type) > -1) || []
      },
      currentMeetingRaceRacecastPools () {
        let pools = this.currentMeetingRacePools
        let rcpools = pools.filter(po => this.availableRCTypes.indexOf(po.type) > -1) || []
        return rcpools
      },
      currentMeetingRaceMultiracePools () {
        let pools = this.currentMeetingRacePools
        let mrpools = pools.filter(po => this.availableMRTypes.indexOf(po.type) > -1) || []
        let mrpools2 = mrpools.sort((po1, po2) => po1.legs.length - po2.legs.length)
        return mrpools2
      },
      currectRaceInfoMeeting () {
        let meeting = null
        let meetings = this.meetingsByContext
        let rid = this.idtgrace

        for (let m = 0; m < meetings.length; m++) {
          for (let r = 0; meetings[m].races && r < meetings[m].races.length; r++) {
            if (meetings[m].races[r].id === rid) {
              meeting = meetings[m]
              break
            }
          }
          if (meeting) { break }
        }
        return meeting
      },
      currectRaceInfoRace () {
        let race = null
        let meetings = this.meetingsByContext
        let rid = this.idtgrace

        for (let m = 0; m < meetings.length; m++) {
          for (let r = 0; meetings[m].races && r < meetings[m].races.length; r++) {
            if (meetings[m].races[r].id === rid) {
              race = meetings[m].races[r]
              race.meetingid = meetings[m].id
              race.meetingname = meetings[m].name
              race.meetingdate = meetings[m].date
              break
            }
          }
          if (race) { break }
        }
        return race
      }
    },

    methods: {
      navPageFor (period, breed, idtgmeeting, idtgrace) {
        // /pm/for/period/breed[/idtgmeeting[/idtgrace]]
        // /pm/for/all/all
        // /pm/for/today/all
        // /pm/for/future/all
        // /pm/for/next/all
        // /pm/for/2020-03-26/all
        // /pm/for/2020-03-26/all/meetingid
        // /pm/for/2020-03-26/all/meetingid/raceid
        let navParams = { period: 'today', breed: null, idtgmeeting: null, idtgrace: null }

        switch (period) {
          case 'all':
            navParams.period = period
            navParams.breed = breed || 'all'
            break
          case 'today':
            navParams.period = period
            navParams.breed = breed || 'all'
            break
          case 'future':
            navParams.period = period
            navParams.breed = breed || 'all'
            break
          case 'next':
            navParams.period = period
            navParams.breed = breed || 'all'
            break
          case 'date':
            let today1 = new Date()
            navParams.period = this.pmIsoDateToRacecardDate(today1.toISOString().substr(0, 10))
            navParams.breed = breed || 'all'
            break
          default:
            let today2 = new Date()
            navParams.period = this.pmIsValidRacecardDate(period) ? period : this.pmIsoDateToRacecardDate(today2.toISOString().substr(0, 10))
            navParams.breed = breed || 'all'
            break
        }

        if (navParams.breed && navParams.breed.length > 0 && navParams.idtgmeeting && navParams.idtgrace) {
          this.$router.push({ name: 'pm-for-period-breed-meeting-race', params: navParams })
        } else if (navParams.breed && navParams.breed.length > 0 && navParams.idtgmeeting) {
          this.$router.push({ name: 'pm-for-period-breed-meeting', params: navParams })
        } else if (navParams.breed && navParams.breed.length > 0) {
          this.$router.push({ name: 'pm-for-period-breed', params: navParams })
        } else {
          this.$router.push({ name: 'pm-for-period', params: navParams })
        }
      },
      navPageForRaceInfo (idtgmeeting, idtgrace) {
        let navParams = { idtgmeeting: idtgmeeting, idtgrace: idtgrace }
        navParams.period = this.$route.params.period || 'today'
        navParams.breed = this.$route.params.breed || 'all'

        if (navParams.idtgrace) {
          this.$router.push({ name: 'pm-for-period-breed-meeting-race', params: navParams })
        } else {
          this.$router.push({ name: 'pm-for-period-breed-meeting', params: navParams })
        }
      },
      navPageForBetType (newBettype) {
        if (!(this.$route.params.bettype && this.$route.params.bettype === newBettype)) {
          let navParams = { idtgmeeting: this.idtgmeeting, idtgrace: this.idtgrace, pooltype: this.pooltype, bettype: newBettype }
          this.$router.push({ name: 'pmbetting-meeting-race-pool-bettype', params: navParams })
        }
      },
      showRcnavCallendar (isShow) {
        if (isShow) {
          this.rcnavDate = this.pmRacecardDateToIsoDate(this.resultDate)
        }
        this.rcnavDatepickerVisisble = isShow
      },
      selectRcnavDate () {
        let rcnavDate = this.rcnavDate || new Date().toISOString().substr(0, 10)
        rcnavDate = this.pmIsoDateToRacecardDate(rcnavDate)
        this.navPageFor(rcnavDate)
        this.rcnavDatepickerVisisble = false
      },
      racenavIntersected (hint) {
        // console.log('Racecard nav line intersected; hint=' + hint)
        try {
          if (this && this._self && this._self.$el) {
            let elms = this._self.$el.getElementsByClassName('pmlinenav-link selected') || []
            for (let i = 0; i < elms.length; i++) {
              let elm = elms[i]
              if (elm && elm.parentElement && elm.parentElement.scrollWidth && elm.parentElement.clientWidth && elm.parentElement.scrollWidth > elm.parentElement.clientWidth) {
                elm.scrollIntoView(false)
              }
            }
          }
        } catch (e) { }
      },
      translateBetTypeName (pooltype, bettype, fallbackName) {
        let btname2 = bettype
        let translKey = 'Racecardnav.BetType.Name.' + pooltype + '-' + bettype
        let translVal = this.$t(translKey)
        if (translVal && translVal.length > 0 && translVal !== translKey) { btname2 = translVal }
        if (btname2 === bettype) {
          let btnameMatches = this.bettypeNames.filter(bettypeName => bettypeName.id === bettype)
          if (btnameMatches && btnameMatches.length > 0) { btname2 = btnameMatches[0].name }
        }
        if (btname2 === bettype && fallbackName) { btname2 = fallbackName }
        return btname2
      }
    }
  }
</script>
