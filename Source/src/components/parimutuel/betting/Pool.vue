<template>
  <div>
    <div v-if="mobileBigAndBelow && pmShowBetSlip" class="betslip-page pmbetslip-wrap">
      <v-dialog v-model="pmShowBetSlip" content-class="dialog-betslip pm" fullscreen persistent hide-overlay transition="dialog-bottom-transition">
        <div class="betslip-page">
          <div v-if="isLoggedIn && placeBetStatus !== 'P'" class="preheader">
            <div class="betslip_balance"><span class="span_balance">{{ $t('BetSlipPage.tab.balance') }}</span><span class="value">{{balanceSum | currency}}</span></div>
            <v-btn v-if="brandKey !== 'boyd'" flat @click="toggleBetslip()" class="close"><v-icon>close</v-icon></v-btn>
          </div>
          <div class="betslip-page-header" :class="{'user_logged_in' : isLoggedIn}" v-if="placeBetStatus !== 'P'">
            <span class="tab active disabled">
              <a class="a-link-"><span>{{ $t('Betslip.PM.Title') }}</span><badge>{{selectedRunnersCount}}</badge></a>
              <button v-if="brandKey === 'boyd'" class="close" @click.stop="toggleBetslip()"><v-icon>close</v-icon></button>
            </span>
          </div>
          <div class="betslip-page-header" v-if="placeBetStatus === 'P'">
            <span class="your_receipt" key="your_receipt">{{ $t('BetSlip.status.placed.YourReceipt') }}</span>
            <v-btn flat @click="toggleBetslip()" class="close"><v-icon>close</v-icon></v-btn>
          </div>
          <div class="mobile_betslip">
            <betslip></betslip>
          </div>
        </div>
      </v-dialog>
    </div>
    <div v-else-if="availableRPTypes.indexOf(pooltype) === -1 && availableRCTypes.indexOf(pooltype) === -1 && availableMRTypes.indexOf(pooltype) === -1">Pool offer {{pooltype}} not supported.<br />Please chose a different betting opportunity.</div>
    <div v-else-if="(availableRPTypes.indexOf(pooltype) > -1 && !isToteSrLoaded) || (availableRCTypes.indexOf(pooltype) > -1 && !isToteSrLoaded) || (availableMRTypes.indexOf(pooltype) > -1 && !isToteMrLoaded)" class="loading-data"><loader></loader></div>
    <div v-else-if="availableSRTypes.indexOf(pooltype) > -1 || availableMRTypes.indexOf(pooltype) > -1 || pmShowBetSlip" class="pmpool-wrap">
      <template v-if="availableRPTypes.indexOf(pooltype) > -1 && isToteSrLoaded && toteSr && toteSr.meeting && toteSr.race">
        <div class="race-header">
          <div class="race-ttl-line">
            <span class="race-title">{{ toteSr.meeting.name || '' }} # {{toteSr.race.number}}</span>
            <span style="float:right" v-if="toteSr.race.usc === 'ON'" :class="'racetimeticker ' + pmRaceClockCalculate (toteSr.race.tsstart, toteSr.timestamp).cssclass" :data-racetsstart="toteSr.race.tsstart" :data-racedatastamp="toteSr.timestamp" :data-raceusc="toteSr.race.usc">{{ pmRaceClockCalculate (toteSr.race.tsstart, toteSr.timestamp).timetostart }}</span>
            <span style="float:right" v-else class="racetimeticker racetime-over">{{ toteSr.race.gsc }}</span>
          </div>
          <div class="race-info race-info-collapsed">
            <div class="race-info-line race-info-title"><span>{{ pmTranslatePoolType(pooltype) }} </span>
              <span class="pool-info-holder" @click.stop="toggleRaceInfo()">
                <span v-if="toteSrPool && toteSrPool.totalpoolvalue && toteSrPool.totalpoolvalue > 0"> {{toteSrPool.totalpoolvalue | currency}} </span>
                <v-icon class="icon-race-info">info</v-icon>
              </span>
            </div>
            <div class="race-info-line">{{ toteSr.race.name || 'Race ' + toteSr.race.number }} @ {{ pmFormatStartTs(toteSr.race.tsstart) }}</div>
            <div class="race-info-line conditions" v-if="toteSr.meeting.weather || toteSr.meeting.goingcode">
              <span>Conditions: </span>
              <span v-if="toteSr.meeting.weather"> {{ toteSr.meeting.weather }}</span>
              <span v-if="toteSr.meeting.goingcode">, {{ toteSr.meeting.goingcode }} </span>
            </div>
            <div class="race-info-line">{{$t('Pool.Distance')}} {{ toteSr.race.distance || '-' }}</div>
            <div class="icon-close" @click.stop="toggleRaceInfo()"><v-icon>close</v-icon></div>
          </div>
        </div>
        <runnerpool></runnerpool>
      </template>

      <template v-if="availableRCTypes.indexOf(pooltype) > -1 && isToteSrLoaded && toteSr && toteSr.meeting && toteSr.race">
        <div  class="race-header">
          <div class="race-ttl-line">
            <span class="race-title">{{ toteSr.meeting.name || '' }} # {{toteSr.race.number}}</span>
            <span style="float:right" v-if="toteSr.race.usc === 'ON'" :class="'racetimeticker ' + pmRaceClockCalculate (toteSr.race.tsstart, toteSr.timestamp).cssclass" :data-racetsstart="toteSr.race.tsstart" :data-racedatastamp="toteSr.timestamp" :data-raceusc="toteSr.race.usc">{{ pmRaceClockCalculate (toteSr.race.tsstart, toteSr.timestamp).timetostarts }}</span>
            <span style="float:right" v-else class="racetimeticker racetime-over">{{ toteSr.race.gsc }}</span>
          </div>
          <div class="race-info race-info-collapsed"> 
            <div class="race-info-line race-info-title"><span>{{ pmTranslatePoolType(pooltype) }} </span>
              <span class="pool-info-holder" @click.stop="toggleRaceInfo()">
                <span v-if="toteSrPool && toteSrPool.totalpoolvalue && toteSrPool.totalpoolvalue > 0"> {{ toteSrPool.totalpoolvalue | currency}} </span>
                <v-icon class="icon-race-info">info</v-icon>
              </span>
            </div>
            <div class="race-info-line">{{ toteSr.race.name || 'Race ' + toteSr.race.number }} @ {{ pmFormatStartTs(toteSr.race.tsstart) }}</div>
            <div class="race-info-line conditions" v-if="toteSr.meeting.weather || toteSr.meeting.goingcode">
              <span>Conditions: </span>
              <span v-if="toteSr.meeting.weather"> {{ toteSr.meeting.weather }}</span>
              <span v-if="toteSr.meeting.goingcode">, {{ toteSr.meeting.goingcode }} </span>
            </div>
            <div class="race-info-line">{{$t('Pool.Distance')}} {{ toteSr.race.distance || '-' }}</div>
            <div class="icon-close" @click.stop="toggleRaceInfo()"><v-icon>close</v-icon></div>
          </div>
        </div>
        <racecastpool></racecastpool>
      </template>

      <template v-if="availableMRTypes.indexOf(pooltype) > -1 && toteMr && toteMr.meeting">
        <div  class="race-header">
          <div class="race-ttl-line">
            <span class="race-title">{{ toteMr.meeting.name }} {{toteMrPoolFirstRace ? '# ' + toteMrPoolFirstRace.number : ''}} </span>
            <template v-if="toteMrPoolFirstRace">
              <span style="float:right" v-if="toteMrPoolFirstRace.usc === 'ON'" :class="'racetimeticker ' + pmRaceClockCalculate (toteMrPoolFirstRace.tsstart, toteMr.timestamp).cssclass" :data-racetsstart="toteMrPoolFirstRace.tsstart" :data-racedatastamp="toteMr.timestamp" :data-raceusc="toteMrPoolFirstRace.usc">{{ pmRaceClockCalculate (toteMrPoolFirstRace.tsstart, toteMr.timestamp).timetostart }}</span>
              <span style="float:right" v-else class="racetimeticker racetime-over">{{ toteMrPoolFirstRace.gsc }}</span>
            </template>
          </div>
          <div class="race-info race-info-collapsed">
            <div class="race-info-line race-info-title"><span>{{ pmTranslatePoolType(pooltype) }}</span>
              <span @click.stop="toggleRaceInfo()">
                <span v-if="toteMrPool && toteMrPool.totalpoolvalue && toteMrPool.totalpoolvalue > 0">{{ toteMrPool.totalpoolvalue | currency}} </span>
                <v-icon class="icon-race-info">info</v-icon>
              </span>
            </div>
            <div class="race-info-line">{{ toteMr.meeting.name }} @ {{ toteMrPoolFirstRace && toteMrPoolFirstRace.tsstart ? pmFormatStartTs(toteMrPoolFirstRace.tsstart) : '-' }}</div>
            <div class="race-info-line conditions" v-if="toteMr.meeting.weather || toteMr.meeting.goingcode">
              <span>{{$t('Pool.Conditions')}} </span>
              <span v-if="toteMr.meeting.weather"> {{ toteMr.meeting.weather }}</span>
              <span v-if="toteMr.meeting.goingcode">, {{ toteMr.meeting.goingcode }} </span>
            </div>
            <div class="race-info-line">{{$t('Pool.Distance')}} {{ toteMrPoolFirstRace && toteMrPoolFirstRace.distance || '-' }}</div>
            <div class="race-info-line">{{$t('Pool.Bet_On_Races', {n:toteMrPool ? toteMrPool.legs.length : '-'})}}</div>
            <div class="icon-close" @click.stop="toggleRaceInfo()"><v-icon>close</v-icon></div>
          </div>
        </div>
        <multiracepool></multiracepool>
      </template>
    </div>
    <div v-else>Ops. Choose a different betting opportunity.</div>
  </div>
</template>
<script>
import store from '@/store'
import Loader from '@/components/common/Loader'
import Screen from '@/components/mixins/Screen'
import PariMutuel from '@/components/mixins/PariMutuel'
import Betslip from '@/components/parimutuel/betting/betslip'
import Runnerpool from '@/components/parimutuel/betting/pooltypes/runnerpool'
import Racecastpool from '@/components/parimutuel/betting/pooltypes/racecastpool'
import Multiracepool from '@/components/parimutuel/betting/pooltypes/multiracepool'
import Observer from '@/components/parimutuel/helper/Observer'
import Branding from '@/components/mixins/Branding'
import Badge from '@/components/common/Badge'

export default {
  name: 'pool',

  components: {
    Loader,
    Betslip,
    Runnerpool,
    Racecastpool,
    Multiracepool,
    Observer,
    Badge
  },

  mixins: [
    Screen,
    PariMutuel,
    Branding
  ],

  data () {
    return {
    }
  },

  computed: {
    idtgmeeting () { return this.pmRouteParamToFloat(this.$route.params.idtgmeeting) },
    idtgrace () { return this.pmRouteParamToFloat(this.$route.params.idtgrace) },
    pooltype () { return this.$route.params.pooltype },
    idtgpooloffer () { return this.pmRouteParamToFloat(this.$route.params.idtgpooloffer) },
    meetings () { return store.getters['racecardState/getMeetingsWithOpenRaces'] },
    isToteSrLoaded () { return store.getters['racecardState/getToteSrIsLoaded'] },
    toteSr () { return store.getters['racecardState/getToteSr'] },
    isToteMrLoaded () { return store.getters['racecardState/getToteMrIsLoaded'] },
    toteMr () { return store.getters['racecardState/getToteMr'] },
    availableRPTypes () { return store.getters['pmBetslipState/getAvailableRPTypes'] },
    availableRCTypes () { return store.getters['pmBetslipState/getAvailableRCTypes'] },
    availableSRTypes () { return store.getters['pmBetslipState/getAvailableSRTypes'] },
    availableMRTypes () { return store.getters['pmBetslipState/getAvailableMRTypes'] },
    pmShowBetSlip () { return store.getters['pmBetslipState/getShowBetSlip'] },
    placeBetStatus () { return store.getters['pmBetslipState/getPlaceBetStatus'] },
    selectedRunnersCount () { return store.getters['pmBetslipState/getSelectedRunnersCount'] },
    meeting () {
      var self = this
      return (this.idtgmeeting && this.meetings && this.meetings.filter(meeting => meeting.id.toString() === self.idtgmeeting.toString())[0])
    },
    toteSrPool () {
      let pool = null
      let pooltype = this.pooltype
      let pooloffers2 = this.toteSr.pools.filter(po => po.type === pooltype) || []
      if (pooloffers2 && pooloffers2.length > 0) {
        pool = pooloffers2[0]
      }
      return pool
    },
    toteMrPool () {
      let pool = null
      if (this.toteMr && this.toteMr.meeting && this.toteMr.meeting.races && this.toteMr.pools) {
        let rid = this.idtgrace
        pool = this.pmAutopickPoolOffer(this.toteMr.pools, rid, this.pooltype, this.idtgpooloffer)
      }
      return pool
    },
    toteMrPoolFirstRace () {
      let race = null
      if (this.toteMr && this.toteMr.meeting && this.toteMr.meeting.races && this.toteMr.pools) {
        let rid = this.idtgrace
        let pool = this.pmAutopickPoolOffer(this.toteMr.pools, rid, this.pooltype, this.idtgpooloffer)
        let races = this.toteMr.meeting.races
        if (races && pool && pool.legs && pool.legs.length > 0) {
          if (races.filter(race => race.idtgrace === pool.legs[0].r).length > 0) {
            race = races.filter(race => race.idtgrace === pool.legs[0].r)[0]
          }
        }
      }
      return race
    },
    isLoggedIn () { return store.getters['isLoggedIn'] },
    customerContext () { return store.getters['getCustomerContext'] },
    balanceSum () { return (this.customerContext && this.customerContext.Balances && this.customerContext.Balances.find(b => b.Key === 'CREDIT').Trading) || undefined }
  },

  filters: {
  },

  methods: {
    toggleBetslip () {
      store.dispatch('pmBetslipState/toggleBetslip')
    },
    toggleRaceInfo () {
      let raceInfoElms = document.getElementsByClassName('race-info')
      if (raceInfoElms && raceInfoElms.length > 0 && raceInfoElms[0].classList.contains('race-info-collapsed')) {
        raceInfoElms[0].classList.remove('race-info-collapsed')
      } else {
        raceInfoElms[0].classList.add('race-info-collapsed')
      }
    },
    async betToolbarIntersected () {
      let betbuttons = document.getElementsByClassName('betbutton')
      if (betbuttons && betbuttons.length > 0 && betbuttons[0].classList.contains('buttonfloated')) {
        betbuttons[0].classList.remove('buttonfloated')
      }
    },
    async betToolbarDeintersected () {
      let betbuttons = document.getElementsByClassName('betbutton')
      if (betbuttons && betbuttons.length > 0 && !betbuttons[0].classList.contains('buttonfloated')) {
        betbuttons[0].classList.add('buttonfloated')
      }
    }
  },

  mounted () {
    this.pmRaceClockStart()
  },
  destroyed () {
  }
}
</script>
<style lang="stylus" scoped>
  .loading-data 
    background: #fff
    padding:10px
    text-align:center
    >>>.spinner
      width 100%
    >>>.spinner > div
      color #0b4da1
      width: 10px
      height: 10px
      background-color: #0b4da1
  .pmbetbuttonbar
    min-height:80px;
    padding: 15px 25px 0
  .pmbetbuttonbar .betbutton.buttonfloated 
     position: fixed;
     right:25% 
     bottom: 20px 
     left:25% 
     max-width:50%
     transform:none
</style>
