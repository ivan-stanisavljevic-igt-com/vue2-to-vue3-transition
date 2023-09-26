//  import Vue from 'vue'
// import lib from '@/library'
import config from '@/config'
import store from '@/store'

export default {
  data () {
    return {
      logOutTo: null
    }
  },

  components: {},

  computed: {
    showHistoryTabs () {
      return config.app.betHistoryInBetslip
    }
  },

  methods: {
    dismissBetSlip (keep, keepStakes, skipUpdate, keepMobileBetSlipActive, tab) {
      // console.log('mixin - dismissBetSlip')
      var self = this
      var doLogOut = false
      if (self.betSlipStatus && self.betSlipStatus.errorData && self.betSlipStatus.errorData.action && self.betSlipStatus.errorData.action === 'logOut') {
        doLogOut = true
      }
      store.dispatch('sbBetslipState/dismissBetSlip', {
        keep: keep,
        keepStakes: keepStakes,
        skipUpdate: skipUpdate,
        keepMobileBetSlipActive: keepMobileBetSlipActive,
        tab: tab,
        isFastBet: this.isFastBet
      }).then(function () {
        if (doLogOut) {
          clearTimeout(self.logOutTo)
          self.logOutTo = setTimeout(self.logOut, 0)
        }
      })
    },
    setTabFromBetSlip (tab) {
      // console.log('mixin - setTabFromBetSlip: ' + tab)
      this.dismissBetSlip(0, 0, 1, true, this.tab)
      if (this.showHistoryTabs) {
        var self = this
        setTimeout(function () {
          self.$emit('setTabFromBetSlip', tab)
        }, 0)
      } else {
        var dialogBetslip = store.getters['overlayState/getBetslipState']
        if (dialogBetslip) {
          store.commit('sbBetslipState/setActiveBetSlip', false)
          store.dispatch('overlayState/deactivateBetslip')
        }
        //
        this.$router.push({ name: 'history-state', params: { state: 'active' } })
      }
    },
    logOut () {
//        console.log('dispatch LogOut from BetSlip')
      clearTimeout(this.logOutTo)
      if (this.isLoggedIn) {
        store.dispatch('logout')
      }
    }
  },

  created () {
  },

  mounted () {
  },

  watch: {
  },

  destroyed () {
  }
}
