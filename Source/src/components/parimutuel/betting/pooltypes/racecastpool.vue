<template>
  <div v-if="toteSr">
    <template v-if="pool && pool.bettypes">
      <div class="pmtable-holder">
      <table class="pmtable">
        <tr>
          <th class="pmr-num">{{$t('Racecastpool.NO.Title')}}</th>
          <th class="pmr-names" >{{$t('Racecastpool.Runner.Title')}}</th>
          <th class="pricecell">{{$t('Racecastpool.Odds.Title')}}</th>
          <th v-if="pmActiveBetType === 'STRAIGHT'" class="selectioncell" v-for="c in nooflegs4pooltype"><span>{{position[c]}}</span></th>
          <th v-if="pmActiveBetType === 'NO_OPTION' || pmActiveBetType === 'PERMUTATION'" class="selectioncell"><span>{{$t('Racecastpool.Any.Title')}}</span></th>
          <template v-if="pmActiveBetType === 'BANKER'">
            <th class="selectioncell"><span>{{$t('Racecastpool.1st.Title')}}</span></th>
            <th class="selectioncell"><span>{{$t('Racecastpool.With.Title')}}</span></th>
          </template>
          <template v-if="pmActiveBetType === 'FLOATING_BANKER'">
            <th class="selectioncell"><span>{{$t('Racecastpool.Key.Title')}}</span></th>
            <th class="selectioncell"><span>{{$t('Racecastpool.With.Title')}}</span></th>
          </template>
        </tr>

        <tbody>
          <tr v-for="runner in runners" :class="{'runner':true, 'coupled':runner.coupled, 'coupled-first':runner.coupledfirst, 'coupled-last':runner.coupledlast}">
            <td class="pmr-num"><span :class="'silknum silknum-' +  Math.floor(runner.num)">{{runner.entrynumber}}</span></td>
            <td class="pmr-names">
              <div class="pmr-name">{{runner.name}}</div>
              <div class="pmr-jockey">{{runner.jockey || ''}}&nbsp;</div>
            </td>
            <td class="pricecell autonarrow">{{ pmFormatRunnerOdds(runner) }}</td>

            <td class="selectioncell autonarrow" v-if="pmActiveBetType === 'STRAIGHT'" v-for="column in nooflegs4pooltype">
              <span v-if="(!runner.coupled && runner.runningstatus === 'NON_RUNNER') || (runner.coupled && runner.coupledfirst && runner.coupledallnr)">{{$t('Runnerpool.SCR')}}</span>
              <span v-else-if="runner.coupled && runner.coupledallnr && !runner.coupledfirst"></span>
              <button v-else-if="!runner.coupled || runner.coupledfirst" @click.stop="toggleSelection(runner, column)">
                <v-icon v-if="selectedSRRunners[runner.id.toString()] && selectedSRRunners[runner.id.toString()].finishes.has(column)" color="gray darken-3" class="pm_checkbox">check_box</v-icon>
                <v-icon v-else color="gray darken-3" class="pm_checkbox_blank">check_box_outline_blank</v-icon>
              </button>
            </td>

            <td class="selectioncell autonarrow" v-if="pmActiveBetType === 'NO_OPTION' || pmActiveBetType === 'PERMUTATION'">
              <span v-if="(!runner.coupled && runner.runningstatus === 'NON_RUNNER') || (runner.coupled && runner.coupledfirst && runner.coupledallnr)">{{$t('Runnerpool.SCR')}}</span>
              <span v-else-if="runner.coupled && runner.coupledallnr && !runner.coupledfirst"></span>
              <button v-else-if="!runner.coupled || runner.coupledfirst" @click.stop="toggleSelection(runner, 'any')">
                <v-icon v-if="selectedSRRunners[runner.id.toString()] && selectedSRRunners[runner.id.toString()].finishes.has('any')" color="gray darken-3" class="pm_checkbox">check_box</v-icon>
                <v-icon v-else color="gray darken-3" class="pm_checkbox_blank">check_box_outline_blank</v-icon>
              </button>
            </td>

            <template v-if="pmActiveBetType === 'BANKER' || pmActiveBetType === 'FLOATING_BANKER'">
              <td class="selectioncell autonarrow">
                <span v-if="(!runner.coupled && runner.runningstatus === 'NON_RUNNER') || (runner.coupled && runner.coupledfirst && runner.coupledallnr)">{{$t('Runnerpool.SCR')}}</span>
                <span v-else-if="runner.coupled && runner.coupledallnr && !runner.coupledfirst"></span>
                <button v-else-if="!runner.coupled || runner.coupledfirst" @click.stop="toggleSelection(runner, 'banker')">
                  <v-icon v-if="selectedSRRunners[runner.id.toString()] && selectedSRRunners[runner.id.toString()].finishes.has('banker')" color="gray darken-3" class="pm_checkbox">check_box</v-icon>
                  <v-icon v-else color="gray darken-3" class="pm_checkbox_blank">check_box_outline_blank</v-icon>
                </button>
              </td>
              <td class="selectioncell autonarrow">
                <span v-if="(!runner.coupled && runner.runningstatus === 'NON_RUNNER') || (runner.coupled && runner.coupledfirst && runner.coupledallnr)">{{$t('Runnerpool.SCR')}}</span>
                <span v-else-if="runner.coupled && runner.coupledallnr && !runner.coupledfirst"></span>
                <button v-else-if="!runner.coupled || runner.coupledfirst" @click.stop="toggleSelection(runner, 'any')">
                  <v-icon v-if="selectedSRRunners[runner.id.toString()] && selectedSRRunners[runner.id.toString()].finishes.has('any')" color="gray darken-3" class="pm_checkbox">check_box</v-icon>
                  <v-icon v-else color="gray darken-3" class="pm_checkbox_blank">check_box_outline_blank</v-icon>
                </button>
              </td>
            </template>
          </tr>
        </tbody>
      </table>
      </div>
    </template>
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
    name: 'racecastpool',

    mixins: [
      Gtm,
      PariMutuel
    ],

    data () {
      return {
        position: [0, '1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th']
      }
    },

    computed: {
      idtgmeeting () { return this.$route.params.idtgmeeting },
      idtgrace () { return this.$route.params.idtgrace },
      pooltype () { return this.$route.params.pooltype },
      bettype () { return this.$route.params.bettype },
      toteSr () { return store.getters['racecardState/getToteSr'] },
      pool () {
        var self = this
        return (this.toteSr && this.toteSr.pools && this.toteSr.pools.filter(pool => pool.type === self.pooltype)[0]) || undefined
      },
      nooflegs4pooltype () { return (this.pool && this.pool.nooflegs4pooltype) || 0 },
      maxbankers () { return (this.pool && this.pool.maxbankers) || 0 },
      maxfloatingbankers () { return (this.pool && this.pool.maxfloatingbankers) || 0 },
      runners () {
        var runners = this.toteSr && this.toteSr.race && this.toteSr.race.runners
        return runners
      },
      selectedSRRunners () {
        return store.getters['pmBetslipState/getSelectedSRRunners']
      }
    },

    methods: {
      toggleSelection (runner, finish) {
        if (!this.pmBetSlipIsAcceptingChanges) {
          this.pmBetSlipAlert4NoChangesAllowed()
        } else {
          let totesr = this.toteSr
          let pool = this.pool
          let bettype = this.pmActiveBetType

          if (totesr && pool && bettype) {
            let data4gtm = { meeting: totesr.meeting || null, race: totesr.race || null, runner: runner, pool: pool, bettype: bettype, finish: finish }
            if (this.selectedSRRunners[runner.id.toString()] && this.selectedSRRunners[runner.id.toString()].finishes.has(finish)) {
              this.gtmPmSendRemoveSelectionFromBetslip(data4gtm)
            } else {
              this.gtmPmSendAddSelectionToBetslip(data4gtm)
            }

            store.dispatch('pmBetslipState/toggleSelectedRunner', { runner: runner, finish: finish, totesr: totesr, pool: pool, bettype: bettype })
          }
        }
      },
      resetBetSlip () {
        store.dispatch('pmBetslipState/resetBetSlip')
      }
    },
    watch: {
      pooltype () {
        this.resetBetSlip()
      },
      bettype () {
        this.resetBetSlip()
      }
    }
  }
</script>
