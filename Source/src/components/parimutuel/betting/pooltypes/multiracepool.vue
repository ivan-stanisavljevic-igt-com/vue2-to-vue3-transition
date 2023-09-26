<template>
  <div v-if="toteMr && toteMr.meeting">
    <!--[selectedMRacesTabIx: {{selectedMRacesTabIx}}, selectedPoolLegN: {{selectedPoolLegN}}, selectedPoolLegIx:{{selectedPoolLegIx}}, legs:{{poolRaceTable.races.length}}, poolRaceTable.races.length:{{poolRaceTable.races.length}}, poolRaceTable.maxRunnerCount:{{poolRaceTable.maxRunnerCount}}]-->
    <div v-if="toteMr.pools && pool" class="pmtable-holder multirace">
      <table :class="'pmtable' + (poolRaceTable.races.length > legs4mracestab ? ' mracestab-active-' + poollegIxToMRacesTabIx(selectedPoolLegIx) : '')">
        <thead>
          <tr class="sizing-row">
            <template v-for="(race, raceIx) in poolRaceTable.races">
              <td :class="{'raceinfo pmr-num':true, 'raceinfo-active': raceIx === selectedPoolLegIx}">&nbsp;</td>
              <td :class="{'raceinfo pmr-names':true, 'raceinfo-active': raceIx === selectedPoolLegIx}">&nbsp;</td>
              <td :class="{'raceinfo pricecell autonarrow':true, 'raceinfo-active': raceIx === selectedPoolLegIx}">&nbsp;</td>
            </template>
            <td v-for="(race, raceIx) in poolRaceTable.races" :class="'selectioncell autonarrow' + (' mracestab-' + poollegIxToMRacesTabIx(raceIx)) + (raceIx === selectedPoolLegIx ? ' selcell-active' : '')">&nbsp;</td>
            <td v-if="poolRaceTable.races.length > legs4mracestab" v-for="dummyN in ((legs4mracestab * 2) - poolRaceTable.races.length)" class="selectioncell autonarrow mracestab-1">&nbsp;</td>
          </tr>
          <tr>
            <th v-for="(race, raceIx) in poolRaceTable.races" :class="{'racetblhead raceinfo':true, 'raceinfo-active': raceIx === selectedPoolLegIx}" colspan="3">
              <div class="racetblhead-name">
                <button @click.stop.prevent="selectPoolLegN(raceIx);" :class="{'racetblhead-changebut prev':true, 'inactive':raceIx === 0}"><v-icon>chevron_left</v-icon></button>
                {{toteMr.meeting.name}} #{{race.number}}
                <button @click.stop.prevent="selectPoolLegN(raceIx+2);" :class="{'racetblhead-changebut next':true, 'inactive':raceIx === (poolRaceTable.races.length-1)}"><v-icon>chevron_right</v-icon></button>
              </div>
            </th>
            <th class="tac mracestab-0" :colspan="poolRaceTable.races.length <= legs4mracestab ? poolRaceTable.races.length : legs4mracestab">{{pmTranslatePoolType(pool.type)}}</th>
            <th v-if="poolRaceTable.races.length > legs4mracestab" class="tac mracestab-1" :colspan="legs4mracestab">{{pmTranslatePoolType(pool.type)}}</th>
          </tr>
          <tr class="tableheader" v-if="poolRaceTable.races.length > legs4mracestab">
            <template v-for="(race, raceIx) in poolRaceTable.races">
              <th :class="{'raceinfo pmr-num':true, 'raceinfo-active': raceIx === selectedPoolLegIx}">&nbsp;</th>
              <th :class="{'raceinfo pmr-names':true, 'raceinfo-active': raceIx === selectedPoolLegIx}">&nbsp;</th>
              <th :class="{'raceinfo pricecell':true, 'raceinfo-active': raceIx === selectedPoolLegIx}">&nbsp;</th>
            </template>
            <th class="tac mracestab-0" :colspan="legs4mracestab">
              <div style="position:relative; padding:3px 40px 0; display:inline-block; margin: 0 auto;">
                {{'Legs (1-'+legs4mracestab+')'}}
                <button v-if="poollegIxToMRacesTabIx(selectedPoolLegIx) === 0" @click.stop.prevent="selectPoolLegN(legs4mracestab + 1);" class="racetblhead-changebut next" style="top:-2px"><v-icon>chevron_right</v-icon></button>
              </div>
            </th>
            <th class="tac mracestab-1" :colspan="legs4mracestab">
              <div style="position:relative; padding:3px 40px 0; display:inline-block; margin: 0 auto;">
                <button v-if="poollegIxToMRacesTabIx(selectedPoolLegIx) === 1" @click.stop.prevent="selectPoolLegN(legs4mracestab);" class="racetblhead-changebut prev" style="top:-2px"><v-icon>chevron_left</v-icon></button>
                {{poolRaceTable.races.length === (legs4mracestab + 1) ? 'Leg ('+(legs4mracestab+1)+')' : 'Legs ('+(legs4mracestab+1)+'-'+poolRaceTable.races.length+')'}}
              </div>
            </th>
          </tr>
          <tr>
            <template v-for="(race, raceIx) in poolRaceTable.races">
              <th :class="{'raceinfo pmr-num':true, 'raceinfo-active': raceIx === selectedPoolLegIx}">{{$t('Multiracepool.No.Title')}}</th>
              <th :class="{'raceinfo pmr-names':true, 'raceinfo-active': raceIx === selectedPoolLegIx}">{{$t('Multiracepool.Runner.Title')}}</th>
              <th :class="{'raceinfo pricecell':true, 'raceinfo-active': raceIx === selectedPoolLegIx}">{{$t('Multiracepool.Odds.Title')}}</th>
            </template>
            <th v-for="(race, raceIx) in poolRaceTable.races" :class="'selectioncell' + (' mracestab-' + poollegIxToMRacesTabIx(raceIx)) + (raceIx === selectedPoolLegIx ? ' selcell-active' : '')" @click.stop.prevent="selectPoolLegN(raceIx + 1);">
              <button :class="{'racetblhead-rcnumbtn':true, 'active':raceIx === selectedPoolLegIx}">#{{race.number}}</button>
            </th>
            <th v-if="poolRaceTable.races.length > legs4mracestab" v-for="dummyN in ((legs4mracestab * 2) - poolRaceTable.races.length)" class="selectioncell mracestab-1">&nbsp;&nbsp;</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(entrynum, runnerIx) in poolRaceTable.entrynums" :class="{'runner':true, 'coupled':entrynum[1].coupled, 'coupled-first':entrynum[1].coupledfirst, 'coupled-last':entrynum[1].coupledlast}">
            <template v-for="(race, raceIx) in poolRaceTable.races">
              <td :class="{'raceinfo pmr-num':true, 'raceinfo-active': raceIx === selectedPoolLegIx}"><span v-if="race.runners[runnerIx]" :class="'silknum silknum-' +  Math.floor(race.runners[runnerIx].num)">{{race.runners[runnerIx].entrynumber}}</span><template v-else>&nbsp;</template></td>
              <td :class="{'raceinfo pmr-names':true, 'raceinfo-active': raceIx === selectedPoolLegIx}">
                <div class="pmr-name">{{race.runners[runnerIx] ? race.runners[runnerIx].name : ''}}&nbsp;</div>
                <div class="pmr-jockey">{{race.runners[runnerIx] ? race.runners[runnerIx].jockey : ''}}&nbsp;</div>
              </td>
              <td :class="{'raceinfo pricecell autonarrow':true, 'raceinfo-active': raceIx === selectedPoolLegIx}">{{ pmFormatRunnerOdds(race.runners[runnerIx]) }}</td>
            </template>
            <td v-for="(race, raceIx) in poolRaceTable.races" :class="'selectioncell autonarrow' + (' mracestab-' + poollegIxToMRacesTabIx(raceIx)) + (raceIx === selectedPoolLegIx ? ' selcell-active' : '')">
              <span v-if="race.runners[runnerIx] && !race.runners[runnerIx].coupledfirst && race.runners[runnerIx].runningstatus === 'NON_RUNNER'">{{$t('Runnerpool.SCR')}}</span>
              <span v-else-if="race.runners[runnerIx] && race.runners[runnerIx].coupledfirst && race.runners[runnerIx].coupledallnr">{{$t('Runnerpool.SCR')}}</span>
              <button v-else-if="race.runners[runnerIx] && (!race.runners[runnerIx].coupled || race.runners[runnerIx].coupledfirst)" @click.stop="toggleSelection(race.runners[runnerIx], race.idtgrace)">
                <v-icon v-if="selectedMRRunners && selectedMRRunners[race.idtgrace.toString()] && selectedMRRunners[race.idtgrace.toString()][race.runners[runnerIx].id.toString()]" color="gray darken-3" class="pm_checkbox">check_box</v-icon>
                <v-icon v-else color="gray darken-3" class="pm_checkbox_blank">check_box_outline_blank</v-icon>
              </button>
            </td>
            <td v-if="poolRaceTable.races.length > legs4mracestab" v-for="dummyN in ((legs4mracestab * 2) - poolRaceTable.races.length)" class="selectioncell autonarrow mracestab-1">&nbsp;</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-else class="pm-msgblock errors">
      {{$t('Multiracepool.Incomplete_Pool')}}
    </div>
  </div>
</template>
<script>
  import store from '@/store'
  import Gtm from '@/components/mixins/Gtm'
  import PariMutuel from '@/components/mixins/PariMutuel'

  export default {
    name: 'multiracepool',

    mixins: [
      Gtm,
      PariMutuel
    ],

    data () {
      return {
        selectedpoollegn: 1,
        legs4mracestab: 6
      }
    },

    computed: {
      idtgrace () { return this.pmRouteParamToFloat(this.$route.params.idtgrace) },
      pooltype () { return this.$route.params.pooltype },
      idtgpooloffer () { return this.pmRouteParamToFloat(this.$route.params.idtgpooloffer) },
      toteMr () { return store.getters['racecardState/getToteMr'] },
      poolRaces () {
        let races = (this.toteMr && this.toteMr.meeting && this.toteMr.meeting.races) || []
        let poolRaces = []

        if (races && this.pool && this.pool.legs) {
          this.pool.legs.forEach((leg) => {
            if (races.filter(race => race.idtgrace === leg.r).length > 0) {
              poolRaces[leg.n - 1] = races.filter(race => race.idtgrace === leg.r)[0]
            }
          })
        }
        return poolRaces || []
      },
      selectedMRacesTabIx () { return Math.floor(this.selectedPoolLegIx / this.legs4mracestab) },
      selectedPoolLegIx () { return this.selectedPoolLegN - 1 },
      selectedPoolLegN () { return this.selectedpoollegn },
      selectedPoolLegRace () {
        let race = null
        if (this.poolRaces.length >= this.selectedPoolLegN) { race = this.poolRaces[this.selectedPoolLegN - 1] }
        return race
      },
      poolRaceTable () {
        let table = { maxRunnerCount: 0, races: [] }
        let pool = this.pool
        let meetingraces = (this.toteMr && this.toteMr.meeting && this.toteMr.meeting.races) || []
        let isLegMissing = false
        let legraces = []
        let entrynums = new Map()

        if (meetingraces && pool && pool.legs) {
          for (let n = 0; n < pool.legs.length && (n + 1) === pool.legs[n].n; n++) {
            let races4poolleg = meetingraces.filter(race => race.idtgrace === pool.legs[n].r) || []
            if (races4poolleg.length > 0) {
              let race4poolleg = races4poolleg[0]
              legraces.push(race4poolleg)
              race4poolleg.runners.forEach(runner => {
                let numKey = runner.entrynumber || runner.num.toString()
                if (numKey) {
                  entrynums.set(numKey, { num: runner.num, coupled: false, coupledfirst: false, coupledlast: false })
                }
              })
            } else {
              isLegMissing = true
            }
          }
        }

        // 1. collect all places (key is entry num string, value is num)
        // 2. sort
        // 3. loop races and make new table - place is row, arrange runner by place, fill empty rows with nulls
        if (isLegMissing) {
          table = { maxRunnerCount: 0, races: [] }
        } else {
          let legraces2 = []
          let entrynumsSorted = [...entrynums.entries()].sort((rnr1, rnr2) => rnr1[1].num - rnr2[1].num)
          for (let enIx = 0; enIx < entrynumsSorted.length; enIx++) {
            for (let raceIx = 0; raceIx < legraces.length; raceIx++) {
              if (enIx === 0) { legraces2[raceIx] = { idtgrace: legraces[raceIx].idtgrace, number: legraces[raceIx].number, runners: [] } }
              let runners4num = legraces[raceIx].runners.filter(rnr => rnr.num === entrynumsSorted[enIx][1].num) || []
              let runner4num = runners4num.length > 0 ? runners4num[0] : null
              legraces2[raceIx].runners.push(runner4num)
              if (runner4num && runner4num.coupled) {
                entrynumsSorted[enIx][1].coupled = runner4num.coupled
                entrynumsSorted[enIx][1].coupledfirst = runner4num.coupledfirst
                entrynumsSorted[enIx][1].coupledlast = runner4num.coupledlast
              }
            }
          }

          table.races = legraces2
          table.entrynums = entrynumsSorted
          table.maxRunnerCount = entrynumsSorted.length
        }
        return table
      },
      pool () {
        let pool = this.pmAutopickPoolOffer(this.toteMr.pools, this.idtgrace, this.pooltype, this.idtgpooloffer)
        return pool
      },
      selectedMRRunners () {
        return store.getters['pmBetslipState/getSelectedMRRunners']
      }
    },

    methods: {
      toggleSelection (runner, idtgrace) {
        if (!this.pmBetSlipIsAcceptingChanges) {
          this.pmBetSlipAlert4NoChangesAllowed()
        } else {
          let totemr = this.toteMr
          let pool = this.pool
          let bettype = 'NO_OPTION'
          let finish = 0
          if (totemr && pool && pool.legs && bettype) {
            let poolLegN = 1
            let legs = pool.legs.filter(leg => leg.r === idtgrace)
            if (legs && legs.length === 1) { poolLegN = legs[0].n }
            this.selectPoolLegN(poolLegN)

            let race = this.selectedPoolLegRace
            if (race && race.idtgrace) {
              let key4race = race.idtgrace.toString()
              let key4rnr = runner.id.toString()

              let data4gtm = { meeting: totemr.meeting || null, race: totemr.race || null, runner: runner, pool: pool, bettype: bettype, finish: finish }
              if (this.selectedMRRunners[key4race] && this.selectedMRRunners[key4race][key4rnr]) {
                this.gtmPmSendRemoveSelectionFromBetslip(data4gtm)
              } else {
                this.gtmPmSendAddSelectionToBetslip(data4gtm)
              }
            }

            store.dispatch('pmBetslipState/toggleSelectedRunner', { idtgrace: idtgrace, runner: runner, finish: finish, totemr: totemr, pool: pool, bettype: bettype })
          }
        }
      },
      /**
       * select N-th race to be active on layout
       * @param n - race (leg) number in multirace pool offer. First is n=1, second is n=2, etc...
       */
      selectPoolLegN (n) {
        let pool = this.pool
        if (n > 0 && pool && pool.legs && n <= pool.legs.length) {
          this.selectedpoollegn = n
        }
      },
      poollegIxToMRacesTabIx (legIx) { return Math.floor(legIx / this.legs4mracestab) },
      resetState (keepBetData = false) {
        if (keepBetData !== true) {
          store.dispatch('pmBetslipState/resetBetSlip')
        }
        let poolLegN = 1
        let pool = this.pool
        let idtgrace = this.idtgrace

        if (pool && pool.legs) {
          let legs = pool.legs.filter(leg => leg.r === idtgrace)
          if (legs && legs.length === 1) { poolLegN = legs[0].n }
        }
        this.selectPoolLegN(poolLegN)
        // console.log('multiracepool.vue resetState poolLegN:', poolLegN)
      },
      getMultiRaceById (idtgrace) {
        let races = this.toteMr.meeting.races.filter(race => race.idtgrace === idtgrace)
        return (races && races[0]) || undefined
      }
    },
    watch: {
      idtgpooloffer () {
        this.resetState()
      },
      pooltype () {
        this.resetState()
      }
    },

    created () {
      this.resetState(true)
    }
  }
</script>
<style lang="stylus" scoped>
  .multirace .mracestab-active-1 .mracestab-0,
  .multirace .mracestab-active-0 .mracestab-1 { display:none; }

  .multirace .pmtable { table-layout: fixed; }
  .multirace .pmtable .sizing-row { height: 0; font-size: 0; line-height: 0; }
  .multirace .pmtable .sizing-row td { padding-top:0; padding-bottom:0; }
</style>
