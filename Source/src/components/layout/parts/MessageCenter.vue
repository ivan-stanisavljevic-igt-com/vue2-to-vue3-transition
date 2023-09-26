<template>
<div class="message-center-wrapper">
  <div class="message-center" id="qa-message-center" @click.stop="dialog = true">
    <div id="qa-message-number" class="message-number" v-if="noOfMessages > 0">{{noOfMessages}}</div>
    <v-dialog v-model="dialog" content-class="message-center-dialog">
      <div class="msg_center_header">
        <span class="title">{{ $t('Account.MessageCenter') }}</span>
        <v-icon class="close" @click.stop="dialog = false">close</v-icon>
      </div>
      <div class="message-center-container">
        <v-card class="no-msgs ms-chld" v-if="noOfMessages === 0">
          <v-card-text class="tl-alert-msg">{{ $t('MessageCenter.NoNewMsgs') }}</v-card-text>
        </v-card>
        <v-card class="ms-chld" v-if="nonVerified">
          <span class="ms-info-wrapper"><v-icon class="ms-info">info_outline</v-icon></span>
          <v-card-text class="tl-alert-msg">{{ $t('Account.NotVerified') }} {{ $t('Account.NotVerified.Info') }} <u><span class="here" @click.stop="go2VerificationPage">{{ $t('Account.NotVerified.Info.Here') }}</span></u>{{ $t('Account.NotVerified.Info.Details') }}</v-card-text>
        </v-card>
        <v-card class="ms-chld" v-if="lifetimeDepositReached">
          <span class="ms-info-wrapper"><v-icon class="ms-info">info_outline</v-icon></span>
          <v-card-text class="tl-alert-msg">{{$t('Account.DepositThreshold.Info', {currency: currencySymbol})}}</v-card-text>
          <v-card-text class="tl-alert-msg tl-info" v-html="$t('Account.DepositThreshold.Info.Details', {currency: currencySymbol})"></v-card-text>
          <v-card-text class="tl-alert-msg">{{ $t('Account.NotVerified.Info') }} <u><span class="here" @click.stop="go2ResponsibleGaming">{{ $t('Account.DepositThreshold.Info.Here') }}</span></u>{{ $t('Account.NotVerified.Info.Details') }}</v-card-text>
        </v-card>
        <v-card class="ms-chld" v-if="pendingInvestigation">
          <span class="ms-info-wrapper"><v-icon class="ms-info">info_outline</v-icon></span>
          <v-card-text class="tl-alert-msg">{{ $t('Account.Ovelay.Pending.Investigation') }}</v-card-text>
        </v-card>
        <v-card class="ms-chld" v-if="isSuspended">
          <span class="ms-info-wrapper"><v-icon class="ms-info">info_outline</v-icon></span>
          <v-card-text class="tl-alert-msg">{{ $t('Account.Ovelay.Suspension') }}</v-card-text>
        </v-card>
        <v-card class="ms-chld" v-if="pwdPolicyAlert">
          <span class="ms-info-wrapper"><v-icon class="ms-info">info_outline</v-icon></span>
          <v-card-text v-if="showPwdDaysLeftInfo" class="tl-alert-msg">{{ pwdDays == 1 ? $t('Account.PasswordPolicy.Alert.Info1') : $t('Account.PasswordPolicy.Alert.Info', { pwdDays: pwdDays}) }} {{ $t('Account.PasswordPolicy.Alert.ChangePassword') }} <span class="here" @click.stop="go2ChangePasswordPage">{{ $t('Account.DepositThreshold.Info.Here') }}.</span></v-card-text>
          <v-card-text v-else>{{ $t('Account.PasswordPolicy.Alert.Info2') }} {{ $t('Account.PasswordPolicy.Alert.ChangePassword') }} <span class="here" @click.stop="go2ChangePasswordPage">{{ $t('Account.DepositThreshold.Info.Here') }}.</span></v-card-text>
        </v-card>
         <v-card class="ms-chld" v-if="canNotDeposit">
          <span class="ms-info-wrapper"><v-icon class="ms-info">info_outline</v-icon></span>
          <v-card-text class="tl-alert-msg">{{ $t('Account.Ovelay.DepositNotAllowed') }}</v-card-text>
        </v-card>
         <v-card class="ms-chld" v-if="canNotWithdraw">
          <span class="ms-info-wrapper"><v-icon class="ms-info">info_outline</v-icon></span>
          <v-card-text class="tl-alert-msg">{{ $t('Account.Ovelay.WithdrawNotAllowed') }}</v-card-text>
        </v-card>
      </div>
    </v-dialog>
  </div>
</div>
</template>

<script>
  import store from '@/store'
  import config from '@/config'

  export default {
    name: 'MessageCenter',

    components: {
      // Icon
    },

    data () {
      return {
        dialog: false
      }
    },

    computed: {
      lifetimeDepositReached: () => store.getters['messageCenter/getLifetimeDepositReached'],
      noOfMessages: () => store.getters['messageCenter/getNumberOfMessages'],
      accountSummaryFlow () {
        return window.ctsautoconf.ACCOUNT_SUMMARY_FLOW || false
      },
      pendingInvestigation: () => store.getters['messageCenter/getPendingInvestigation'],
      canNotDeposit: () => store.getters['messageCenter/canNotDeposit'],
      canNotWithdraw: () => store.getters['messageCenter/canNotWithdraw'],
      isSuspended: () => store.getters['messageCenter/getIsSuspended'],
      // password expiry
      pwdPolicyAlert () {
        return store.getters['messageCenter/getPasswordAlertPolicy'] || localStorage.getItem('passwordAlertPolicy')
      },
      showPwdDaysLeftInfo () {
        return !window.ctsautoconf.HideDaysLeftInfo
      },
      pwdDays () {
        return store.getters['getPwdDays'] || sessionStorage.AlertResetPasswordDaysLeft
      },
      nonVerified: () => store.getters['messageCenter/getIsNotVerified'],
      currencySymbol () {
        return config.app.CURRENCY
      }
    },

    methods: {
      go2ResponsibleGaming () {
        if (this.accountSummaryFlow) {
          this.$router.replace({
            path: '/account/responsible-gaming',
            query: {
              'deposit-threshold': ''
            }
          }).catch(err => { console.log(err) }) // workaround to avoid navigationDuplicated exception
        } else {
          if (this.$route.name !== 'deposit-threshold') {
            this.$router.push({name: 'deposit-threshold'})
          }
        }
        this.dialog = false
      },
      checkLocalStorage () {
        let passwordPolicy = localStorage.getItem('passwordAlertPolicy')
        if (passwordPolicy) {
          store.commit('messageCenter/setPasswordAlertPolicy', true)
        }
      },
      go2VerificationPage () {
        if (this.accountSummaryFlow) {
          this.$router.replace({
            path: '/account/verification'
          }).catch(err => { console.log(err) })
        } else {
          if (this.$route.name !== 'verification') {
            this.$router.push({name: 'verification'})
          }
        }
        this.dialog = false
      },
      go2ChangePasswordPage () {
        if (this.accountSummaryFlow) {
          this.$router.replace({
            path: '/account/settings',
            query: {
              'security-settings': ''
            }
          }).catch(err => { console.log(err) })
        } else {
          if (this.$route.name !== 'change-password') {
            this.$router.push({name: 'change-password'})
          }
        }
        this.dialog = false
      }
    },
    mounted () {
      this.checkLocalStorage()
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped>
@import '~@/css/config'
.message-center-wrapper
  display flex
  align-items center
  cursor pointer
  .message-center
    width 30px
    height 30px
    display block
    background-image: url('~@/assets/images/icons/messages-bell-white.svg')
    margin-right 10px
    .message-number
      font-size 12px
      font-family 'Open Sans SemiBold'
      position relative
      top -7px
      left 7px
      display inline-block
      background-color #ff671f
      border-radius 15px
      width 18px
      text-align center

</style>
