<template>
  <div v-if="toteSr">
    <div v-if="pool" class="pmtable-holder">
      <table class="pmtable">
        <tr>
          <th class="pmr-num">{{$t('Racecastpool.NO.Title')}}</th>
          <th class="pmr-names">{{$t('Racecastpool.Runner.Title')}}</th>
          <th class="pricecell">{{$t('Racecastpool.Odds.Title')}}</th>
          <th class="selectioncell">{{pmTranslatePoolType(pooltype,'shortname')}}</th>
        </tr>
        <tbody>
          <tr v-for="runner in runners" :class="{'runner':true, 'coupled':runner.coupled, 'coupled-first':runner.coupledfirst, 'coupled-last':runner.coupledlast}">
            <td class="pmr-num"><span :class="'silknum silknum-' +  Math.floor(runner.num)">{{runner.entrynumber}}</span></td>
            <td class="pmr-names">
              <div class="pmr-name">{{runner.name}}</div>
              <div class="pmr-jockey">{{runner.jockey || ''}}&nbsp;</div>
            </td>
            <td class="pricecell autonarrow">{{ pmFormatRunnerOdds(runner) }}</td>
            <td class="selectioncell autonarrow">
              <span v-if="(!runner.coupled && runner.runningstatus === 'NON_RUNNER') || (runner.coupled && runner.coupledfirst && runner.coupledallnr)">{{$t('Runnerpool.SCR')}}</span>
              <span v-else-if="runner.coupled && runner.coupledallnr && !runner.coupledfirst"></span>
              <button v-else-if="!runner.coupled || runner.coupledfirst" @click.stop="toggleSelection(runner, 'any')">
                <v-icon v-if="selectedSRRunners[runner.id.toString()] && selectedSRRunners[runner.id.toString()].finishes.has(0)" color="gray darken-3" class="pm_checkbox">check_box</v-icon>
                <v-icon v-else color="gray darken-3" class="pm_checkbox_blank">check_box_outline_blank</v-icon>
              </button>
            </td>
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
    name: 'runnerpool',

    mixins: [
      Gtm,
      PariMutuel
    ],

    data () {
      return {
      }
    },

    computed: {
      pooltype () {
        return this.$route.params.pooltype
      },
      toteSr () {
        return store.getters['racecardState/getToteSr']
      },
      pool () {
        let self = this
        return (this.toteSr && this.toteSr.pools && this.toteSr.pools.filter(pool => pool.type === self.pooltype)[0]) || undefined
      },
      selectedSRRunners () {
        return store.getters['pmBetslipState/getSelectedSRRunners']
      },
      runners () {
        let runners = (this.toteSr && this.toteSr.race && this.toteSr.race.runners) || []
        return runners
      }
    },

    methods: {
      toggleSelection (runner) {
        if (!this.pmBetSlipIsAcceptingChanges) {
          this.pmBetSlipAlert4NoChangesAllowed()
        } else {
          let totesr = this.toteSr
          let pool = this.pool
          let bettype = 'NO_OPTION'
          let finish = 0
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
      }
    }
  }
</script>
<style lang="stylus" scoped>
</style>
