<template>
  <div class="account-info-summary">
    <div class="user_details">
      <div class="user_details_name">
         <div class="user_image">
            <v-icon v-if="brandKey !== 'boyd'">account_circle</v-icon>
            <icon v-if="brandKey === 'boyd'" name="icon-user-white"></icon>
          </div>
        <span v-if="customerContext" class="user_title">{{ customerContext.Name && customerContext.Name[0] }} {{ customerContext.Name[1] }}</span>
        <div v-if="brandKey === 'boyd'" class="close_icon"  @click="closeMyAccountDialog()"><v-icon>close</v-icon></div>
      </div>
    </div>
      <div v-if="brandLayout === 'generic'" class="sessionDetails">
        <p class="accountnumber"><span>{{ $t('MyAccount.AccountNumber') }}</span> {{ accountNumber || '--' }}</p>
        <p v-if="state !=='NJ'" class="sessionDuration sessiondur"><span>{{ $t('MyAccount.SessionTime') }}</span> {{sessionTime}}</p>
        <p v-if="state ==='NJ'" class="sessionDuration sessiondur"><span>{{ $t('MyAccount.SessionTime.' + state) }}</span> {{sessionTime}}</p>
        <p class="lastlogin lastlogdur"><span>{{ $t('MyAccount.LastLogin') }}</span> {{lastLogin}}</p>
        <p v-if="state === 'NJ'" class="currenttime"><span>{{ $t('MyAccount.CurrentTime') }}</span> {{currentTime}}</p>
      </div>
    <!-- <v-icon :color="green">perm_identity</v-icon> -->
      <div v-if="(brandKey === 'dn' || brandKey === 'dnw' || brandKey === 'circa' || brandKey ==='sb' || brandKey === 'mav')" class="sessionDetails">
        <p v-if="brandKey !== 'mav'" class="accountnumber"><span>{{ $t('MyAccount.AccountNumber') }}</span> {{ accountNumber || '--' }}</p>
        <p v-if="brandKey !== 'mav' && state !=='NJ'" class="sessionDuration sessiondur"><span>{{ $t('MyAccount.SessionTime') }}</span> {{sessionTime}}</p>
        <p v-if="brandKey !== 'mav' && state ==='NJ'" class="sessionDuration sessiondur"><span>{{ $t('MyAccount.SessionTime.' + state) }}</span> {{sessionTime}}</p>
        <p v-if="brandKey !== 'mav'" class="lastlogin lastlogdur"><span>{{ $t('MyAccount.LastLogin') }}</span> {{lastLogin}}</p>
        <p v-if="brandKey === 'mav'" class="sessionDuration sessiondur"><span>{{ $t('MyAccount.SessionTime') }}</span> <br> {{sessionTime}}</p>
        <p v-if="brandKey === 'mav'" class="lastlogin lastlogdur"><span>{{ $t('MyAccount.LastLogin') }}</span> <br> {{lastLogin}}</p>
        <p v-if="state === 'NJ'" class="currenttime"><span>{{ $t('MyAccount.CurrentTime') }}</span> {{currentTime}}</p>
      </div>
      <div v-if="(brandLayout !=='generic' && brandKey !== 'dn' && brandKey !== 'dnw' && brandKey !== 'circa' && brandKey !== 'sb' && brandKey !== 'mav')" class="sessionDetails">
        <p v-show="brandKey !== 'boyd'" class="accountnumber"><span>{{ $t('MyAccount.AccountNumber') }}</span> {{ accountNumber || '--' }}</p>
        <p class="sessionDuration"><span>{{ $t('MyAccount.SessionTime') }}</span> {{sessionTime}}</p>
        <p class="lastlogin"><span>{{ $t('MyAccount.LastLogin') }}</span> {{lastLogin}}</p>
      </div>
  </div>
</template>

<script>
  import store from '@/store'
  import config from '@/config'
  import Screen from '@/components/mixins/Screen'
  import Icon from '@/components/common/Icon'
  import dotsLoader from '@/components/common/DotsLoader'
  import Branding from '@/components/mixins/Branding'
  import Session from '@/components/mixins/Session'

  export default {
    name: 'AccountInfoSummary',

    mixins: [
      Screen,
      Branding,
      Session
    ],

    data () {
      return {
        showBalance: true,
        sessionTime: 0,
        currentTime: null
      }
    },

    components: {
      Icon,
      dotsLoader
    },

    computed: {
      config () {
        return config
      },
      walletProvider () {
        return config.app.autoconf.WALLET_PROVIDER
      },
      walletParams () {
        return config.walletParams
      },
      customerContext () {
        return store.getters['getCustomerContext']
      },
      balanceSum () {
        return (this.customerContext && this.customerContext.Balances && this.customerContext.Balances.find(b => b.Key === 'CREDIT').Trading) || undefined
      },
      balanceLoader () {
        return store.getters['getBalanceLoader']
      },
      promoBalanceSum () {
        return (this.customerContext && this.customerContext.Balances && this.customerContext.Balances.find(b => b.Key === 'CREDIT').Promo) || undefined
      },
      accountNumber () {
        return (this.customerContext && this.customerContext.Balances && this.customerContext.Balances.find(b => b.Key === 'CREDIT').AccountNumber) || undefined
      },
      state () {
        return config.app.autoconf.STATE
      }
    },

    methods: {
      toggleShowBalance (value) {
        this.showBalance = !this.showBalance
        if (value) {
          store.commit('setShowBalance', false)
        } else if (!value) {
          store.commit('setShowBalance', true)
        }
      },
      closeMyAccountDialog () {
        store.dispatch('overlayState/deactivateMyAccountDialog')
      },
      refreshAccountsDetails () {
        store.dispatch('getCustomerContext')
      },
      updateCurrentTime () {
        this.currentTime = (new Date()).toLocaleString('en-US', {timeZone: config.app.timeZone})
      }
    },

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
      this.currentTime = (new Date()).toLocaleString('en-US', {timeZone: config.app.timeZone})
      setInterval(() => this.updateCurrentTime(), 1 * 1000)
    }

  }
</script>

<style lang="stylus" scoped>
  @import '~@/css/config'

  .v-navigation-drawer
    .account-info-summary
      >>>.back_icon
          display none
  .account-info-summary
    width: 100%

    .sessionDetails
      display flex
      flex-direction column
      padding-left 75px
      .dialog-menu &
        display: none

      @media tablet-and-above
        display: none

      p
        margin 0 !important
    .btn--icon
      width: auto
      margin: 0 8px 0 0

      .icon
        font-size: 20px
        color: #0090FF

    .user_title
      font-size: 16px
      line-height: 19px
      display: inline-block
      margin-right 10px!important

    .user_title_first
      font-size: 16px
      line-height: 19px
      display: inline-block

      .dialog-menu &
        display: block

    .account_balance
      margin -40px 5px 0 5px
      padding-left 70px

      .dialog-menu &
        display: none

      @media mobile-big-and-below
        .balance
          align-items: flex-start
      span
        font-size: 14px !important
        color #ff671f
        font-family 'Open Sans SemiBold'
        &:after
          content ':'

      .bonus
        margin-left: 4px
        position: relative

        button
          position: absolute
          top: -4px
          right: 0

      .value
        font-size: 18px
        font-family 'Open sans SemiBold'
        line-height:16px
        color #fff
        &:after
          display none


  .user_details_name
    display flex
    align-items flex-start


  .user_details
    display: inline-block
    justify-content space-between

>>>.dots-loader
  background-color: transparent !important
  height: auto !important
  display: flex !important
  box-shadow: none !important
  span
    color: #004c97
    font-size 35px !important
.loading
  height 51px
</style>
