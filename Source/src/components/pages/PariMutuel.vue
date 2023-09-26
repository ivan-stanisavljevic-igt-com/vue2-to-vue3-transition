<template>
  <div class="sports-page racing pm">
    <v-layout class="page-layout">
      <v-flex class="main-column" :style="{paddingTop: headerHeight + 'px'}" ref="maincolumn">
        <resize-observer @notify="mainColumnResize" />
        <v-layout class="page-layout">
          <v-flex class="center-column">
            <racecardnav></racecardnav>
            <!--[racecard params: {{racecardOptConf}} | {{racecardOptFilter}} | {{racecardOptSort}}] [{{idtgmeeting}}]-->
            <racecard v-if="racecardOptConf && racecardOptConf.layout" :rcconf="racecardOptConf" :rcfilter="racecardOptFilter" :rcsort="racecardOptSort" :rcidtgmeeting="idtgmeeting"></racecard>
            <pool v-if="showRaceBetting || pmShowBetSlip"></pool>
            <race-info v-else-if="showRaceInfo" :raceid="idtgrace"></race-info>
          </v-flex>
          <v-flex class="betslip-column" v-if="tabletAndAbove">
            <div class="toggleBetslipColumn" :class="[{'loggedIn' : isLoggedIn}, brandKey]">
              <div class="betslipTabs noHistory" :class="[{'loggedIn': isLoggedIn}]">
                <span class="tab active">
                  <a class="betsliptablink a-link-"><span>{{$t('Betslip.PM.Title')}}</span> <badge v-if="mobileBigAndBelow">{{selectedRunnersCount}}</badge></a>
                </span>
              </div>
            </div>
            <betslip></betslip>
          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>
    <v-dialog content-class="dialog-betslip-msg" v-model="dialogBetslipMsg.active" persistent :fullscreen="false">
      <betslip-msg :dialogBetslipMsg="dialogBetslipMsg"></betslip-msg>
    </v-dialog>
  </div>
</template>
<script>
  import store from '@/store'

  import Screen from '@/components/mixins/Screen'
  import Racecardnav from '@/components/parimutuel/betting/racecardnav'
  import Racecard from '@/components/parimutuel/betting/racecard'
  import RaceInfo from '@/components/parimutuel/betting/RaceInfo'
  import Pool from '@/components/parimutuel/betting/Pool'
  import Loader from '@/components/common/Loader'
  import PariMutuel from '@/components/mixins/PariMutuel'
  import Betslip from '@/components/parimutuel/betting/betslip'
  import BetslipMsg from '@/components/sports/betslipV2/betslipMsg.vue'
  import Branding from '@/components/mixins/Branding'
  import Url from '@/components/mixins/Url'
  import Badge from '@/components/common/Badge'

  export default {
    name: 'parimutuel-page',

    components: {
      Racecardnav,
      Racecard,
      RaceInfo,
      Pool,
      Loader,
      Betslip,
      BetslipMsg,
      Badge
    },

    mixins: [
      PariMutuel,
      Screen,
      Branding,
      Url
    ],

    computed: {
      headerHeight () { return store.getters['screenState/getHeaderHeight'] },
      idtgmeeting () { return this.pmRouteParamToFloat(this.$route.params.idtgmeeting) },
      idtgrace () { return this.pmRouteParamToFloat(this.$route.params.idtgrace) },
      pooltype () { return this.$route.params.pooltype },
      period () { return this.$route.params.period },
      urlparamSportType () { return this.$route.params.breed },
      availableRPTypes () { return store.getters['pmBetslipState/getAvailableRPTypes'] },
      availableRCTypes () { return store.getters['pmBetslipState/getAvailableRCTypes'] },
      availableSRTypes () { return store.getters['pmBetslipState/getAvailableSRTypes'] },
      availableMRTypes () { return store.getters['pmBetslipState/getAvailableMRTypes'] },
      meetings () { return store.getters['racecardState/getMeetings'] || [] },
      isLoggedIn () { return store.getters['isLoggedIn'] },
      pmShowBetSlip () { return store.getters['pmBetslipState/getShowBetSlip'] },
      showRaceInfo () {
        let show = false
        if (this.pooltype && this.pooltype === 'info') {
          show = true
        } else if (this.$route.name === 'pm-for-period-breed-meeting-race') {
          show = true
        }
        return show
      },
      showRaceBetting () {
        let show = false
        if (this.pooltype && (this.availableSRTypes.indexOf(this.pooltype) > -1 || this.availableMRTypes.indexOf(this.pooltype) > -1)) { show = true }
        // console.log('showRaceBetting', show)
        return show
      },
      racecardOptConf () {
        let opt = { layout: null }
        if (this.$route.name) {
          switch (this.$route.name) {
            case 'pm-for-period':
            case 'pm-for-period-breed':
              opt.layout = 'race-list'
              if (this.$route.params.period) {
                switch (this.$route.params.period) {
                  case 'all':
                  case 'today':
                  case 'future':
                  case 'date':
                    opt.layout = 'meeting-list'
                    break
                  case 'next':
                    opt.layout = 'race-list'
                    break
                  default: // this covers date strings in 'period' param
                    opt.layout = 'meeting-list'
                    break
                }
              }
              break
            case 'pm-for-period-breed-meeting':
              opt.layout = 'meeting-races-list'
              break
          }
        }
        return opt
      },
      racecardOptFilter () {
        let filter = {}
        if (this.$route.name) {
          // check period filter
          switch (this.$route.name) {
            case 'pm-for':
            case 'pm-for-period':
            case 'pm-for-period-breed':
            case 'pm-for-period-breed-meeting':
            case 'pm-for-period-breed-meeting-race':
              if (this.$route.params.period) {
                switch (this.$route.params.period) {
                  case 'all':
                    filter.period = 'all'
                    break
                  case 'today':
                    filter.period = 'today'
                    break
                  case 'future':
                    filter.period = 'future'
                    break
                  case 'next':
                    filter.period = 'next'
                    filter.raceunifiedstatuscode = 'ON'
                    break
                  default: // this covers date strings in 'period' param
                    filter.period = 'date'
                    filter.periodDate = this.$route.params.period
                    break
                }
              } else {
                filter.period = 'today'
              }
              break
            case 'pmbetting':
            case 'pmbetting-meeting':
            case 'pmbetting-meeting-race':
            case 'pmbetting-meeting-race-pool':
            case 'pmbetting-meeting-race-pool-bettype':
              filter.period = 'today'
              break
          }

          // check arg1 (SportType) filter
          switch (this.$route.name) {
            case 'pm-for-period-breed':
            case 'pm-for-period-breed-meeting':
            case 'pm-for-period-breed-meeting-race':
              if (this.$route.params.breed) {
                switch (this.$route.params.breed) {
                  case '':
                  case 'all':
                    break
                  default:
                    filter.breed = this.$route.params.breed
                    break
                }
              }
              break
          }
        }
        return filter
      },
      racecardOptSort () {
        let sort = null
        if (this.$route.name) {
          switch (this.$route.name) {
            case 'pm-for-period':
            case 'pm-for-period-breed':
              switch (this.$route.params.period) {
                case 'all':
                case 'today':
                case 'future':
                  sort = 'meetingname'
                  break
                case 'next':
                  sort = 'racestart'
                  break
                default: // this covers date strings in 'period' param
                  sort = 'meetingname'
                  break
              }
              break
          }
        }
        return sort
      },
      dialogBetslipMsg () {
        return store.getters['overlayState/getBetslipMsg']
      },
      selectedRunnersCount () { return store.getters['pmBetslipState/getSelectedRunnersCount'] }
    },

    created () {
      this.fetchRacecard()
      if (this.racecardOptFilter.period === 'date') {
        this.fetchResultRacecard(this.racecardOptFilter.periodDate)
      }

      if (this.idtgrace && this.pooltype && this.availableSRTypes.indexOf(this.pooltype) > -1) {
        this.fetchToteSr(this.idtgrace)
      } else {
        this.cleanToteSr()
      }

      if (this.idtgmeeting && this.availableMRTypes.indexOf(this.pooltype) > -1) {
        this.fetchToteMr(this.idtgmeeting)
      } else {
        this.cleanToteMr()
      }

      if (this.idtgrace && this.pooltype === 'info') {
        this.fetchRaceResult(this.idtgrace)
      } else {
        this.cleanRaceResult()
      }

      this.getCustomerContext()
    },

    mounted () {
      this.mainColumnResize()
    },

    methods: {
      mainColumnResize () {
        var mainColumn = this.$refs.maincolumn
        if (mainColumn) { store.commit('screenState/setMainColumnWidth', mainColumn.offsetWidth) }
      },
      fetchRacecard () {
        store.dispatch('racecardState/fetchRacecard', { })
      },
      fetchResultRacecard (date) {
        // console.log('PariMutuel.vue methods fetchResultRacecard ')
        store.dispatch('racecardState/fetchResultRacecard', { date: date })
      },
      fetchRaceResult (idtgrace) {
        store.dispatch('racecardState/fetchRaceResult', { idtgrace: idtgrace })
      },
      fetchToteSr (idtgrace) {
        store.dispatch('racecardState/fetchToteSr', { idtgrace: idtgrace })
      },
      fetchToteMr (idtgmeeting) {
        store.dispatch('racecardState/fetchToteMr', idtgmeeting)
      },
      cleanRaceResult () {
        store.dispatch('racecardState/cleanRaceResult')
      },
      cleanToteSr () {
        store.dispatch('racecardState/cleanToteSr')
      },
      cleanToteMr () {
        store.dispatch('racecardState/cleanToteMr')
      },
      resetBetslip () {
        store.dispatch('pmBetslipState/resetBetSlip')
      },
      getCustomerContext () {
        store.dispatch('getCustomerContext')
      }
    },

    filters: {
    },

    watch: {
      idtgmeeting (to, from) {
        // console.log('PariMutuel.vue watch idtgmeeting ', this.idtgmeeting, this.idtgrace, this.pooltype, to, from)
        this.resetBetslip()

        if (this.idtgrace && this.idtgmeeting && this.availableSRTypes.indexOf(this.pooltype) > -1) {
          // console.log('PariMutuel.vue watch idtgmeeting will do fetchToteSr', this.idtgrace)
          this.fetchToteSr(this.idtgrace)
        } else {
          this.cleanToteSr()
        }

        if (this.idtgmeeting && this.availableMRTypes.indexOf(this.pooltype) > -1) {
          this.fetchToteMr(this.idtgmeeting)
        } else {
          this.cleanToteMr()
        }
      },
      idtgrace (to, from) {
        // console.log('PariMutuel.vue watch idtgrace ', this.idtgmeeting, this.idtgrace, this.pooltype, to, from)
        this.resetBetslip()

        if (this.idtgrace && this.pooltype && this.availableSRTypes.indexOf(this.pooltype) > -1) {
          // console.log('PariMutuel.vue watch idtgrace will do fetchToteSr', this.idtgrace)
          this.fetchToteSr(this.idtgrace)
        } else {
          this.cleanToteSr()
        }

        if (this.idtgmeeting && this.availableMRTypes.indexOf(this.pooltype) > -1) {
          this.fetchToteMr(this.idtgmeeting)
        } else {
          this.cleanToteMr()
        }

        if (this.idtgmeeting && this.availableMRTypes.indexOf(this.pooltype) > -1) {
          this.fetchToteMr(this.idtgmeeting)
        } else {
          this.cleanToteMr()
        }
      },
      pooltype (to, from) {
        // console.log('PariMutuel.vue watch pooltype ', this.idtgmeeting, this.idtgrace, this.pooltype, to, from)
        this.resetBetslip()

        if (this.idtgrace && this.pooltype && this.availableSRTypes.indexOf(to) > -1 && this.availableSRTypes.indexOf(from) > -1) {
          // we stay on same SR content, no need to fetch it
        } else if (this.idtgrace && this.pooltype && this.availableSRTypes.indexOf(this.pooltype) > -1) {
          // console.log('PariMutuel.vue watch pooltype will do fetchToteSr', this.idtgrace)
          this.fetchToteSr(this.idtgrace)
        } else {
          this.cleanToteSr()
        }

        if (this.idtgmeeting && this.availableMRTypes.indexOf(this.pooltype) > -1) {
          this.fetchToteMr(this.idtgmeeting)
        } else {
          this.cleanToteMr()
        }
      },
      period (to, from) {
        // console.log('PariMutuel.vue watch period ', this.period, to, from, this.racecardOptFilter)
        if (this.racecardOptFilter.period === 'date') {
          let date = this.racecardOptFilter.periodDate
          this.fetchResultRacecard(date)
        }
      },
      $route: function () {
        // console.log('PariMutuel.vue watch $route ', this.$route.name)
        if (this.$route.name && this.$route.name === 'pmbetting' && this.meetings && this.meetings.length > 0) {
          // console.log('PariMutuel.vue watch $route will do pmAutonavToFirstBetting', this.$route.name)
          this.pmAutonavToFirstBetting()
        }
      },
      meetings () {
        // console.log('PariMutuel.vue watch meetings ', this.$route.name)
        if (this.$route.name && this.$route.name === 'pmbetting' && this.meetings && this.meetings.length > 0) {
          // console.log('PariMutuel.vue watch meetings will do pmAutonavToFirstBetting', this.$route.name)
          this.pmAutonavToFirstBetting()
        }
      }
    },

    beforeDestroy () {
      store.dispatch('racecardState/cleanToteSr')
      store.dispatch('racecardState/cleanToteMr')
      store.dispatch('racecardState/cleanRaceResult')
    }
  }
</script>
<style lang="stylus">
  
</style>
