<template>
  <div v-if="idtgrace">
    <!--[RaceInfo.vue raceid:{{raceid}}, idtgrace:{{idtgrace}}]-->
    <div class="loader-holder" v-if="!isRaceresultLoaded">
      <loader></loader>
    </div>
    <div v-else-if="raceResult" class="race-info pmraceinfo-wrap">
      <div class="race-header">
        <div class="race-ttl-line">
          <span class="race-title">{{ raceResult.race.name || 'Race ' + raceResult.race.number }}</span>
          <span style="float:right" v-if="raceResult.race.usc === 'ON'" :class="'racetimeticker ' + pmRaceClockCalculate(raceResult.race.tsstart, raceResult.timestamp).cssclass" :data-racetsstart="raceResult.race.tsstart" :data-racedatastamp="raceResult.timestamp" :data-raceusc="raceResult.race.usc">{{ pmRaceClockCalculate(raceResult.race.tsstart, raceResult.timestamp).timetostart }}</span>
          <span style="float:right" v-else class="racetimeticker racetime-over">{{ raceResult.race.gsc }}</span>
        </div>
        <div class="race-info race-info-wrapper race-info-collapsed">
          <div class="race-info-line race-info-title">
            <span>{{ raceResult.meeting.name || '' }} #{{ raceResult.race.number }}</span>
            <v-icon @click.stop="toggleRaceInfo()" class="icon-race-info">info</v-icon>
          </div>
          <div class="race-info-line">{{ raceResult.race.name || 'Race ' + raceResult.race.number }} @ {{ pmFormatStartTs(raceResult.race.tsstart) }}</div>
          <div class="race-info-line conditions" v-if="raceResult.meeting.weather || raceResult.meeting.goingcode">
            <span>Conditions: </span>
            <span v-if="raceResult.meeting.weather"> {{ raceResult.meeting.weather }}</span>
            <span v-if="raceResult.meeting.goingcode">, {{ raceResult.meeting.goingcode }} </span>
          </div>
          <div class="race-info-line">{{$t('Pool.Distance')}} {{ raceResult.race.distance || '-' }}</div>
          <div class="icon-close" @click.stop="toggleRaceInfo()"><v-icon>close</v-icon></div>
        </div>
      </div>
      <div class="pmtable-holder">
        <table class="pmtable pmrunners pmr-togglable">
          <tr class="pmr-togglable-for-state1">
            <th style="font-style:italic; font-weight:normal;" colspan="2" v-if="raceResult.race.runners.length > 1">{{ raceResult.race.noofrunners }} runners - {{ raceResult.race.runners[0].name }}, {{ raceResult.race.runners[1].name }} ...</th>
            <th style="font-style:italic; font-weight:normal;" colspan="2" v-else>{{$t('Raceinfo.Runners_jockeys_trainers_info')}}</th>
            <th @click="pmrToggle($event)" class="pmr-vtoggle-cell"><span class="pmr-vtoggle">+</span></th>
          </tr>
          <tr class="pmr-togglable-for-state2">
            <th class="pmr-num">#</th>
            <th>Runner</th>
            <th @click="pmrToggle($event)" class="pmr-vtoggle-cell"><span class="pmr-vtoggle">-</span></th>
          </tr>
          <tbody class="pmr-togglable-for-state2">
            <tr class="pmr-runner" v-for="runner in raceResult.race.runners">
              <td class="pmr-num">{{ runner.num }}</td>
              <td class="pmr-info">
                <div class="pmr-name">{{ runner.name }}</div>
                <div class="pmr-jockey">{{runner.jockey}}</div>
                <div class="pmr-trainer">{{runner.trainer}}</div>
              </td>
              <td class="pmr-status"><span v-if="runner.runningstatus === 'NON_RUNNER'">{{$t('Runnerpool.SCR')}}</span></td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="pmtable-holder">
        <table v-if="raceResult.race.usc === 'ON'" class="pmtable greyrows">
          <tr><th>{{$t('Raceinfo.PoolType.Title')}}</th><th class="poolmoney">{{$t('Racecard.PoolAmount.Title')}}</th><th class="poolmoney">{{$t('Raceinfo.Carryover.Title')}}</th><th></th></tr>
          <tbody>
            <template v-for="pool in raceResult.poolsfordisplay">
              <tr v-if="pool.legs.length > 0 && pool.legs[0].r === raceResult.race.idtgrace && (!pool.bettypes || !availableRCTypes.includes(pool.type))" @click.stop="navToPoolOffer(raceResult.meeting.idtgmeeting, raceResult.race.idtgrace, pool.type)" class="clickable">
                <td>{{pool.poolname}}</td>
                <td class="poolmoney"><template v-if="pool.totalpoolvalue">{{ pool.totalpoolvalue | currency }}</template><template v-else>-</template></td>
                <td class="poolmoney"><template v-if="pool.totalcarriedforward">{{ pool.totalcarriedforward | currency }}</template></td>
                <td class="rpointer"><span class="icon-right"></span></td>
              </tr>
              <tr v-else-if="pool.legs.length > 0 && pool.legs[0].r === raceResult.race.idtgrace && pool.bettypes" v-for="(bettype, bettypeIx) in pool.bettypes" @click.stop="navToPoolOffer(raceResult.meeting.idtgmeeting, raceResult.race.idtgrace, pool.type, bettype.id)" class="clickable">
                <td>{{pmTranslateBetType (pool.type, bettype.id, raceResult.meta, pool.poolname) }}</td>
                <td class="poolmoney"><template v-if="bettypeIx === 1"><template v-if="pool.totalpoolvalue">{{ pool.totalpoolvalue | currency }}</template><template v-else>-</template></template></td>
                <td class="poolmoney"><template v-if="bettypeIx === 1"><template v-if="pool.totalcarriedforward">{{ pool.totalcarriedforward | currency }}</template></template></td>
                <td class="rpointer"><span class="icon-right"></span></td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>

      <table v-if="raceResult.race.usc === 'OFF' && raceResultWinningRunners.length > 0" class="pmtable">
        <thead>
          <tr><th class="pmr-num">#</th><th>{{$t('Raceinfo.Runner_Winner.Title')}}</th><th class="poolmoney">{{$t('Raceinfo.Place_Result.Title')}}</th><th class="poolmoney">{{$t('Raceinfo.Win.Title')}}</th><th class="poolmoney">{{$t('Raceinfo.Place.Title')}}</th><th class="poolmoney">{{$t('Raceinfo.Show.Title')}}</th></tr>
        </thead>
        <tbody>
          <tr v-for="winrnr in raceResultWinningRunners" class="hoverable">
            <td class="pmr-num">{{winrnr.num}}</td>
            <td>{{winrnr.name}}</td>
            <td class="poolmoney">{{winrnr.placementresult}}</td>
            <td class="poolmoney">{{ winrnr.guides4display.WIN ? winrnr.guides4display.WIN.dividend4display : '' }}</td>
            <td class="poolmoney">{{ winrnr.guides4display.PLACE ? winrnr.guides4display.PLACE.dividend4display : '' }}</td>
            <td class="poolmoney">{{ winrnr.guides4display.SHOW ? winrnr.guides4display.SHOW.dividend4display : '' }}</td>
          </tr>
        </tbody>
      </table>

      <table v-if="raceResult.race.usc === 'OFF' && raceResultPoolDividends && raceResultPoolDividends.length > 0" class="pmtable">
        <tr><th>{{$t('Raceinfo.Pool_Offers.Title')}}</th><th class="poolmoney">{{$t('Raceinfo.Combination.Title')}}</th><th></th><th class="poolmoney">{{$t('Raceinfo.Pays.Title')}}</th></tr>
        <tbody>
          <tr v-for="pool in raceResultPoolDividends" class="hoverable">
            <td>{{pool.poolname}}</td>
            <td class="poolmoney">{{pool.resultcombination || '-'}}</td>
            <td class="poolmoney narrow">{{pool.resultdividend ? '$1' : ''}}</td>
            <td class="poolmoney narrow">{{pool.resultdividend || '-' }}</td>
          </tr>
        </tbody>
      </table>

      <table v-if="raceResult.race.usc === 'OFF'" class="pmtable">
        <tr><th>{{$t('Raceinfo.Scratches.Title')}}</th></tr>
        <tr v-if="raceResult.race.runners.filter(scrrnr => scrrnr.runningstatus === 'NON_RUNNER').length < 1"><td>{{$t('Raceinfo.None')}}</td></tr>
        <tr v-else><td><template v-for="(rnr, rnrIx) in raceResult.race.runners.filter(scrrnr => scrrnr.runningstatus && scrrnr.runningstatus === 'NON_RUNNER')"><template v-if="rnrIx > 0">, </template>{{rnr.entrynumber}}</template></td></tr>
      </table>
    </div>
    <div v-else>
      {{$t('Raceinfo.NoData')}}
    </div>
  </div>
</template>
<script>
import store from '@/store'
import Loader from '@/components/common/Loader'
import PariMutuel from '@/components/mixins/PariMutuel'

export default {
  name: 'raceinfo',

  components: {
    Loader
  },

  mixins: [
    PariMutuel
  ],

  props: [
    'raceid'
  ],

  computed: {
    idtgrace () {
      return this.pmRouteParamToFloat(this.raceid)
    },
    availableRCTypes () {
      return store.getters['pmBetslipState/getAvailableRCTypes']
    },
    isRaceresultLoaded () {
      return store.getters['racecardState/getRaceResultIsLoaded']
    },
    raceResult () {
      let racedetails = store.getters['racecardState/getRaceResult']
      if (racedetails) {
        // racedetails.race.mtsstart = racedetails.race.tsstart ? moment(racedetails.race.mtsstart).format(config.app.dateFormats.longDateTime) : ''
        // racetime: "0700"
        // tsstart: "2020-03-18T07:00:00"
      }
      return racedetails
    },
    raceResultWinningRunners () {
      let winners = this.raceResult.race.runners.filter(rnr => rnr.placementresult) || []

      winners.forEach(wnr => {
        wnr.guides4display = {}
        if (wnr.guides) {
          wnr.guides.forEach(guide => {
            wnr.guides4display[guide.idtgpooltype] = guide
          })
        }
      })

      return winners.sort((rnr1, rnr2) => {
        if (rnr1.placementresult < rnr2.placementresult) {
          return -1
        } else if (rnr1.placementresult > rnr2.placementresult) {
          return 1
        } else {
          return 0
        }
      })
    },
    raceResultPoolDividends () {
      let pools4disp = this.raceResult.poolsfordisplay
      let poolsDivs = []

      let rid = this.idtgrace
      let arcTypes = store.getters['pmBetslipState/getAvailableRCTypes']
      let amrTypes = store.getters['pmBetslipState/getAvailableMRTypes']

      pools4disp.forEach(pool4disp => {
        if (arcTypes.indexOf(pool4disp.type) > -1 || (amrTypes.indexOf(pool4disp.type) > -1 && pool4disp.legs && pool4disp.legs.length > 0 && pool4disp.legs[pool4disp.legs.length - 1].r === rid)) {
          if (pool4disp.results && pool4disp.results.length > 0) {
            pool4disp.results.forEach(divresult => {
              let newPool = { poolname: pool4disp.poolname, mainpooldividend: pool4disp.mainpooldividend }
              newPool.resultcombination = divresult.combination || null
              newPool.resultdividend = divresult.dividend || null
              poolsDivs.push(newPool)
            })
          } else {
            let newPool = { poolname: pool4disp.poolname, mainpooldividend: pool4disp.mainpooldividend, resultcombination: null, resultdividend: null }
            poolsDivs.push(newPool)
          }
        }
      })

      return poolsDivs
    },
    raceResultOpenPools () {
      let pools = this.raceResult.poolsfordisplay
      return pools.filter(pool => pool.gsc && pool.gsc === 'OPEN') || []
    },
    showRaceDetails () {
      return store.getters['racecardState/getShowRaceDetails']
    }
  },

  methods: {
    fetchRaceResult (idtgrace) {
      store.dispatch('racecardState/fetchRaceResult', { idtgrace: idtgrace })
    },
    cleanRaceResult () {
      store.dispatch('racecardState/cleanRaceResult')
    },
    pmrToggle (evnt) {
      console.log('pmrToggle', evnt.target)
      if (evnt.target) {
        let try4parent = 5
        let elm = evnt.target
        while (try4parent > 0 && elm && elm.parentElement) {
          try4parent--
          if (elm.parentElement.classList && elm.parentElement.classList.contains('pmr-togglable')) {
            elm.parentElement.classList.toggle('pmr-togglable-state2')
            break
          } else {
            elm = elm.parentElement
          }
        }
      }
    },
    toggleRaceInfo () {
      let raceInfoElms = document.getElementsByClassName('race-info-wrapper')
      if (raceInfoElms && raceInfoElms.length > 0 && raceInfoElms[0].classList.contains('race-info-collapsed')) {
        raceInfoElms[0].classList.remove('race-info-collapsed')
      } else {
        raceInfoElms[0].classList.add('race-info-collapsed')
      }
    },
    navToPoolOffer (idtgmeeting, idtgrace, pooltype, bettype = null) {
      let navParams = { idtgmeeting: idtgmeeting, idtgrace: idtgrace, pooltype: pooltype }

      if (bettype) {
        navParams.bettype = bettype
        this.$router.push({ name: 'pmbetting-meeting-race-pool-bettype', params: navParams })
      } else {
        this.$router.push({ name: 'pmbetting-meeting-race-pool', params: navParams })
      }
    }
  },

  filters: {
  },

  watch: {
    idtgrace () {
      if (this.idtgrace && (!this.raceResult || (this.raceResult.race && this.raceResult.race.id !== this.idtgrace))) {
        // console.log('RaceInfo component watch idtgrace and do fetchRaceResult', this.idtgrace)
        this.fetchRaceResult(this.idtgrace)
      }
    }
  },
  created () {
    if (this.idtgrace) {
      // console.log('RaceInfo component created and do fetchRaceResult ', this.idtgrace)
      this.fetchRaceResult(this.idtgrace)
    }
  },
  mounted () {
    this.pmRaceClockStart()
  }
}
</script>
