<template>
  <div v-if="brandKey !== 'mav'" class="header-info" :class="[{'footer-override': mobileBigAndBelow && state === 'NJ'}]">
    <!-- <v-flex class="float-left"><div><span class="header-txt">{{ $t('Header.InfoMessageOne') }}</span><icon name="icon-rg-logo"></icon> <span class="header-txt">{{ $t('Header.InfoMessageTwo') }}</span></div></v-flex> -->
    <template>
      <span class="header-txt" :class="[{'nj-override': !mobileBigAndBelow && state === 'NJ'}]" v-if="isLoggedIn">{{ $t('MyAccount.LastLogin') }} <span class="lastlogin">{{lastLogin}}</span></span>
      <span class="header-txt" :class="[{'nj-override': !mobileBigAndBelow && state === 'NJ'}]" v-if="isLoggedIn">{{ $t('MyAccount.SessionTime.' + state) }} <span class="clock">{{sessionTime}}</span></span>
    </template>
  </div>
</template>
<script>
import Screen from '@/components/mixins/Screen'
import store from '@/store'
import Icon from '@/components/common/Icon'
import Session from '@/components/mixins/Session'
import Branding from '@/components/mixins/Branding'
import config from '@/config'

export default {
  name: 'HeaderInfo',

  mixins: [Screen, Session, Branding],

  components: {
    Icon
  },

  data: () => ({
    sessionTime: 0
  }),

  computed: {
    isLoggedIn () {
      return store.getters['isLoggedIn']
    },
    customerContext () {
      return store.getters['getCustomerContext']
    },
    state () {
      return config.app.autoconf.STATE
    }
  },
  methods: {},

  created () {
    setInterval(() => {
      let value = Math.round(Math.abs(localStorage.loginTime - Date.now()) / 1000)
      if (value >= 0) {
        let minutes = Math.floor(value / 60)
        let seconds = value - minutes * 60
        seconds = (seconds < 10 ? ('0' + seconds) : seconds)
        minutes = (minutes < 10 ? ('0' + minutes) : minutes)
        this.sessionTime = `${minutes}:${seconds}`
      }
    }, 1000)
  }
}
</script>
<style lang="stylus" scoped>
@import "~@/css/config"
$image-base-url = '~@/assets/images/icons/svg/'
.float-right span
.float-right
  text-align: right

.float-right div
  float: right

.float-left span
  float: left

.header-info
  font-weight normal
  font-size 10px
  padding 0 0 0 8px
  display flex
  justify-content flex-end
  align-items center
  cursor default
  .header-txt
    white-space nowrap
    padding-left 10px

.header-info.footer-override
  display block
  .header-txt
    display block
    text-align center
    margin-bottom 5px
    font-size 11px
</style>
