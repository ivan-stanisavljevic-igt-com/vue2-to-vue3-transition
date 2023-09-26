<template>
<div class="wrapper">
  <v-layout v-if="pendingInvestigationOrAccountSuspension && alertMessages.includes('pending')" class="overlay_msg pending-investigation" :class="[brandKey]" align-center>
    <template>
      <v-flex class="message-content">
        <p v-if="pendingInvestigationOrAccountSuspension.includes('PEND') && !pendingInvestigationOrAccountSuspension.includes('SUSP')" v-html="$t('Account.Ovelay.Pending.Investigation')"></p>
        <p v-if="pendingInvestigationOrAccountSuspension.includes('SUSP') && !pendingInvestigationOrAccountSuspension.includes('PEND')" v-html="$t('Account.Ovelay.Suspension')"></p>
        <p v-if="pendingInvestigationOrAccountSuspension.includes('SUSP') && pendingInvestigationOrAccountSuspension.includes('PEND')" v-html="$t('Account.Ovelay.Pending.Investigation.and.Suspension')"></p>
      </v-flex>
      <v-flex class="close">
          <v-btn flat @click="closeInfo('pending')" class="close"><v-icon>close</v-icon></v-btn>
      </v-flex>
    </template>
    </v-layout>
    <v-layout v-if="pwdPolicyAlert && alertMessages.includes('password_policy')" class="overlay_msg password_policy" :class="[{brandKey}, 'alert-count-' + alertMessages.length]" align-center>
        <v-flex class="close">
          <v-btn flat @click="closeInfo('password_policy')" class="close"><v-icon>close</v-icon></v-btn>
        </v-flex>
        <v-flex class="message-content">
          <p v-if="showDaysLeftInfo" v-html="(pwdDays === 1 ? $t('Account.PasswordPolicy.Alert.Info1') :  $t('Account.PasswordPolicy.Alert.Info', { pwdDays: pwdDays})) + ' ' + $t('Account.PasswordPolicy.Alert.ChangePassword', { changePasswordUrl: routePasswordChange })"></p>
          <p v-else v-html="$t('Account.PasswordPolicy.Alert.Info2') + ' ' + $t('Account.PasswordPolicy.Alert.ChangePassword', { changePasswordUrl: routePasswordChange })"></p>
        </v-flex>
      </v-layout>
    </div>
</template>

<script>
  import Screen from '@/components/mixins/Screen'
  import Branding from '@/components/mixins/Branding'
  import store from '@/store'
  import lib from '@/library'
  // import config from '@/config'
  import Icon from '@/components/common/Icon'
  import Url from '@/components/mixins/Url'

  export default {
    name: 'OverlayMessages',

    mixins: [
      Screen,
      Branding,
      Url
    ],

    components: {
      Icon
    },

    data () {
      return {
        show: true
      }
    },

    computed: {
      isOpenedFromWebView () {
        return store.getters['getIsOpenedFromWebView']
      },
      userAgent () {
        return lib.core.userAgent.os.name
      },
      isLoggedIn () {
        return store.getters['isLoggedIn']
      },
      headerSettings () {
        return store.getters['overlayState/getHeaderMessagesData']
      },
      pendingInvestigationOrAccountSuspension () {
        return store.getters['getPendingInvestigationOrAccountSuspension']
      },
      pwdPolicy () {
        return store.getters['getPwdPolicy']
      },
      pwdPolicyAlert () {
        return (this.pwdPolicy && this.pwdPolicy.toLowerCase() === 'alert') || sessionStorage.displayAlertResetPasswordOverlayMsg
      },
      pwdDays () {
        return store.getters['getPwdDays'] || sessionStorage.AlertResetPasswordDaysLeft
      },
      alertMessages () {
        return store.getters['getAlertMsgs']
      },
      routePasswordChange () {
        return '/account/change-password'
      },
      showDaysLeftInfo () {
        return !window.ctsautoconf.HideDaysLeftInfo
      }
    },

    methods: {
      closeInfo (item) {
        var index = this.alertMessages.indexOf(item)
        if (index >= 0) {
          this.alertMessages.splice(index, 1)
        }
        if (item === 'password_policy') {
          store.commit('setPwdPolicy', undefined)
          sessionStorage.removeItem('displayAlertResetPasswordOverlayMsg')
          sessionStorage.removeItem('AlertResetPasswordDaysLeft')
        }
        if (item === 'pending') sessionStorage.removeItem('displayOverlayMsg')
        if (this.alertMessages.length === 0) {
          store.dispatch('overlayState/deactivateOverlayDialog')
        }
      },
      checkAlerts () {
        if (this.pwdPolicyAlert) {
          store.commit('setAlertMsgs', 'password_policy')
        }
      }
    },

    mounted () {
      this.checkAlerts()
    },
    watch: {
      pwdPolicy () {
        if (!this.pwdPolicy) {
          this.closeInfo('password_policy')
        }
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped>
@import '~@/css/config';

.close
  position: absolute
  left: -5px
  top: -1px
  color: #445058
  @media mobile-big-and-below
    left: -15px
    top: 0px

.overlay_msg
  position fixed
  top 0
  left 0
  right 0
  text-align center
  background-color #f8c753
  color #333
  z-index 1
  height 40px
  &.sb
    font-size 14px
.password_policy
  top 41px
  &.alert-count-1
    top: 0px
  @media mobile-big-and-below
    // height 60px
  .message-content
    line-height 15px
    padding: 0 8px
    padding-left: 35px
    font-size: 14px
    p
      margin 0 5px !important
      font-size 14px
      display inline
    span
      color white
      cursor pointer
      text-decoration underline
.message-content
  line-height 15px
  padding: 0 8px
  padding-left: 35px
  p
    margin 0 5px !important
    font-size 14px
    display inline
</style>
