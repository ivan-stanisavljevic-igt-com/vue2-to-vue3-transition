import store from '@/store'
import config from '@/config'
import lib from '@/library'

export default {
  computed: {
    isLoggedIn () {
      return store.getters['isLoggedIn']
    },
    sessionDetails () {
      return store.getters['getSessionDetails']
    },
    customerContext () {
      return store.getters['getCustomerContext']
    },
    lastLogin () {
      if (this.customerContext && this.customerContext.Logins && this.customerContext.Logins[1]) {
        return new Date(this.customerContext.Logins[1]).toLocaleString('en-US', {timeZone: config.app.timeZone})
      } else {
        return '--'
      }
    },
    isFirstEverLogin () {
      return this.customerContext &&
             this.customerContext.Logins &&
             this.customerContext.Logins.length === 1
    },
    loginTime () {
      return store.getters['getLoginTime'] || Date.now()
    }
  },

  methods: {
    userIsActive () {
      if (this.isLoggedIn) {
        lib.rpcService.api.helpers.stopTokenTImer()
        store.commit('setUserActive', true)
      }
    }
  },

  created () {

  }
}
