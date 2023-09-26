<template>
  <div class="account-info-widget-component">
    <popup-join-dialog v-if="disableJoin"></popup-join-dialog>
    <div v-if="!isLoggedIn" class="login-info">

      <template v-if="brandKey ==='qcasino' || brandKey ==='pr'">
        <v-btn class="login_btn" @click="openDialogLogin()" id="login_btn"><span id="qa-login_btn">{{ $t('MyAccount.LogIn') }}</span></v-btn>
        <v-btn class="join-now" @click="joinAction()"><span id="qa-join-now">{{ $t('MyAccount.JoinNow') }}</span></v-btn>
      </template>
      <template v-if="brandLayout !=='generic' && brandKey !=='qcasino' && brandKey !=='pr' && brandKey !=='rw'">
        <v-btn v-if="!mobileBigAndBelow || (brandKey === 'dn' || brandKey === 'dnw' || brandKey === 'circa'  || brandKey === 'sb' || brandKey === 'mav')" class="login_btn" @click="openDialogLogin()" id="login_btn"><span id="qa-login_btn">{{ $t('MyAccount.LogIn') }}</span></v-btn>
        <v-btn v-if="!mobileBigAndBelow" class="join-now" @click="joinAction()"><span id="qa-join-now">{{ $t('MyAccount.JoinNow') }}</span></v-btn>
        <v-btn v-if="mobileBigAndBelow && (brandKey !== 'dn' && brandKey !== 'dnw' && brandKey !== 'circa' && brandKey !== 'sb' && brandKey !== 'mav' && brandKey !== 'boyd')" :ripple="false" class="account_btn" @click="openDialogLogin()"><v-icon>account_circle</v-icon></v-btn>
        <v-btn v-if="mobileBigAndBelow" class="join-now" @click="joinAction()"><span id="qa-join-now">{{ $t('MyAccount.JoinNow') }}</span></v-btn>
      </template>
      <template v-if="brandLayout === 'generic' && (!showPageTitleInHeader || !mobileBigAndBelow || isRootSportsNavigation)">
        <v-btn class="join-now" @click="joinAction()"><span id="qa-join-now">{{ $t('MyAccount.Header.JoinNow') }}</span></v-btn>
        <v-btn class="login_btn" @click="openDialogLogin()" id="login_btn"><span id="qa-login_btn">{{ $t('MyAccount.LogIn') }}</span></v-btn>
      </template>
      <template v-if="brandKey === 'rw'">
        <v-btn class="join-now" @click="joinAction()"><span id="qa-join-now">{{ $t('MyAccount.JoinNow') }}</span></v-btn>
        <v-btn class="login_btn" @click="openDialogLogin()" id="login_btn"><span id="qa-login_btn">{{ $t('MyAccount.LogIn') }}</span></v-btn>
      </template>
      <!-- :fullscreen="mobileBigAndBelow" :hide-overlay="mobileBigAndBelow" -->
      <v-dialog v-if="dialogLogin" content-class="dialog-login expand desktopLogin" v-model="dialogLogin" persistent>
        <login-component></login-component>
      </v-dialog>
      <v-dialog :content-class="dialogMyaccount" v-model="dialogMyAccount" v-if="dialogMyAccount && mobileBigAndBelow" persistent :fullscreen="isLoggedIn" :hide-overlay="isLoggedIn" transition="dialog-bottom-transition">
        <login-component></login-component>
      </v-dialog>
    </div>

    <div v-if="isLoggedIn" class="account-info">
      <!-- DN and Circa-->
      <template v-if="(brandKey === 'dn' || brandKey === 'dnw' || brandKey === 'circa')">
        <header-info v-if="!mobileBigAndBelow"></header-info>
        <div class="acc_buttons">
          <xtremepush-inbox v-if="(xtremepushWebInitialized || xtremePushEnabledMobile) && xtremepushInboxEnabled"></xtremepush-inbox>
          <message-center v-if="noOfMsgs > 0"></message-center>
          <span  v-if="!mobileBigAndBelow" class="shw-balance" id="qa-shw-balance" @click.stop="refreshCustomerContext()">
            <div class="loading" v-if="balanceLoader">
              <dots-loader></dots-loader>
            </div>
            <span  v-if="!balanceLoader">
              <span class="text">{{ $t('MyAccount.Balance') }}:</span> <span class="amount">{{ balanceSum | currency }}</span>
            </span>
          </span>
          <span v-if="mobileBigAndBelow" class="shw-balance" id="qa-shw-balance" @click.stop="openAccountDialog()">
            <span class="text">{{ $t('MyAccount.Balance') }}:</span> <span class="amount">{{ balanceSum | currency }}</span>
          </span>
          <v-btn v-if="tabletAndAbove" class="my_profile" @click="goToProfile()">
            <v-icon>account_circle</v-icon>
            {{ $t('MyAccount.Account') }}
          </v-btn>
          <v-btn class="logout" @click="logout()">{{ $t('MyAccount.Logout') }}</v-btn>
        </div>
      </template>
      <!-- DN END-->
      <!-- SB, Maverick & QCasino, PR -->
      <template v-if="brandKey === 'sb' || brandKey === 'mav' || brandKey === 'qcasino' || brandKey === 'pr'">
        <!-- <header-info v-if="!mobileBigAndBelow"></header-info> -->
        <div class="acc_buttons">
          <xtremepush-inbox v-if="(xtremepushWebInitialized || xtremePushEnabledMobile) && xtremepushInboxEnabled"></xtremepush-inbox>
          <message-center v-if="noOfMsgs > 0"></message-center>
          <span v-if="!mobileBigAndBelow" class="shw-balance" id="qa-shw-balance" @click.stop="buttonAction()">
            <span>
              <span class="amount">{{ balanceSum | currency }}</span>
              <span v-if="brandKey === 'sb'" class="addfunds">{{ $t('MyAccount.AddFunds') }}<v-icon>add</v-icon></span>
            </span>
          </span>
          <router-link v-if="mobileBigAndBelow && brandKey === 'pr'" class="shw-balance" id="qa-shw-balance" :to="{ path: '/info/deposit-withdrawal' || '/' }" >
            <span class="amount">{{ balanceSum | currency }}</span>
          </router-link>
          <span v-if="mobileBigAndBelow && brandKey !== 'pr'" class="shw-balance" id="qa-shw-balance" @click.stop="buttonAction()">
            <span class="amount">{{ balanceSum | currency }}</span>
            <span v-if="brandKey === 'sb'" class="addfunds">{{ $t('MyAccount.AddFunds') }}<v-icon>add</v-icon></span>
          </span>
          <v-btn v-if="tabletAndAbove" class="my_profile" @click="goToProfile()">
            <v-icon>account_circle</v-icon>
          </v-btn>
        </div>
      </template>
      <!-- S, Maverick, Qcasino, PR END-->

      <!-- GENERIC template -->
      <template v-if="brandLayout === 'generic'">
        <!-- <header-info v-if="!mobileBigAndBelow"></header-info> -->
        <div class="acc_buttons">
          <xtremepush-inbox v-if="(xtremepushWebInitialized || xtremePushEnabledMobile) && xtremepushInboxEnabled"></xtremepush-inbox>
          <message-center v-if="noOfMsgs > 0"></message-center>
          <span v-if="!mobileBigAndBelow" class="shw-balance" id="qa-shw-balance" @click.stop="buttonAction()">
            <span>
              <span class="amount">{{ balanceSum | currency }}</span>
              <span class="addfunds">{{ $t('MyAccount.AddFunds') }}<v-icon>add</v-icon></span>
            </span>
          </span>
          <span v-if="mobileBigAndBelow" class="shw-balance" id="qa-shw-balance" @click.stop="buttonAction()">
            <span class="amount">{{ balanceSum | currency }}</span>
            <span class="addfunds">{{ $t('MyAccount.AddFunds') }}<v-icon>add</v-icon></span>
          </span>
          <v-btn v-if="tabletAndAbove" class="my_profile" @click="goToProfile()">
            <v-icon>account_circle</v-icon>
          </v-btn>
        </div>
      </template>
      <!-- GENERIC END-->

      <!-- RW mobile -->
      <template v-if="brandKey ==='rw' && mobileBigAndBelow">
        <span class="shw-balance" id="qa-shw-balance" @click.stop="goToCashierPage()">
          <span class="amount">{{ balanceSum | currency }}</span>
        </span>
      </template>
      <!-- BOYD -->
      <template v-if="brandKey==='boyd' || brandKey ==='rw'">
        <div v-if="!mobileBigAndBelow" class="acc_buttons">
          <xtremepush-inbox v-if="(xtremepushWebInitialized || xtremePushEnabledMobile) && xtremepushInboxEnabled"></xtremepush-inbox>
          <message-center v-if="noOfMsgs > 0"></message-center>
          <v-btn class="my_profile" @click="goToProfile()">
            <div><span>{{ customerContext.Name && customerContext.Name[0] }}</span><span>{{ customerContext.Name[1] }}</span></div>
            <v-icon>expand_more</v-icon>
          </v-btn>
          <span class="shw-balance" id="qa-shw-balance" @click.stop="refreshCustomerContext()">
            <div class="loading" v-if="balanceLoader">
              <dots-loader></dots-loader>
            </div>
            <span  v-if="!balanceLoader">
              <span class="text">{{ $t('MyAccount.Balance') }}:</span> <span class="amount">{{ balanceSum | currency }}</span>
            </span>
          </span>
          <v-btn v-if="brandKey === 'boyd'" class="logout" @click="logout()">{{ $t('MyAccount.Logout') }}</v-btn>
          <v-btn v-if="brandKey === 'rw'" class="logout" @click="logout()">{{ $t('MyAccount.LogOut') }}</v-btn>
        </div>
        <header-info v-if="!mobileBigAndBelow"></header-info>
      </template>
      <!-- BOYD END-->

      <v-dialog content-class="dialogMyAccountDesktop" width="450" v-model="dialogMyAccountDesktop"  v-if="!mobileBigAndBelow && isLoggedIn" transition="dialog-right-transition">
        <div class="account_desktop">
          <div class="account_details">
            <div class="user_details">
              <div class="user_image">
                <v-icon v-if="brandKey !== 'boyd'">account_circle</v-icon>
                <icon v-if="brandKey === 'boyd'" name="icon-user-white"></icon>
              </div>
              <span class="user_title">{{ customerContext.Name && customerContext.Name[0] }} {{ customerContext.Name[1] }}
                <div v-if="brandKey === 'mav'" class="accountnumber accountnumber--mav"><span>{{ $t('MyAccount.AccountNumber') }}</span> {{ accountNumber || '--' }}</div>
              </span>
              <div v-if="brandKey === 'boyd'" class="close_icon"  @click="closeMyAccountDesktopDialog()"><v-icon>close</v-icon></div>
            </div>
            <div class="account_balance">
              <div class="balace_bonus">
                <div class="balance">
                  <span class="text" key="current_balance">{{ $t('MyAccount.TotalCash') }}</span>
                  <span class="value">{{ balanceSum | currency }}</span>
                </div>
                <div class="balance" v-if="promoBalanceSum">
                  <span class="text" key="current_balance">{{ $t('MyAccount.PromoBalance') }}</span>
                  <span class="value">{{ promoBalanceSum | currency }}</span>
                </div>
              </div>
              <div class="session_details" :class="`session_details--${brandKey}`">
                <div v-show="brandKey !== 'boyd' && brandKey !== 'rw' && brandKey !== 'mav' && brandKey !== 'qcasino' && brandKey !== 'pr'" class="accountnumber"><span class="lastlogdur">{{ $t('MyAccount.AccountNumber') }}</span> <span>{{ accountNumber || '--' }}</span></div>
                <div v-if="brandKey !== 'mav'" class="lastlogin"><span class="lastlogdur">{{ $t('MyAccount.LastLogin') }}</span> <span>{{lastLogin || '--' }}</span></div>
                <div v-if="brandKey !== 'mav' && state !== 'NJ'"><span key="session_info_duration" class="lastlogdur">{{ $t('MyAccount.SessionTime') }}</span> <span>{{sessionTime}}</span></div>
                <div v-if="brandKey !== 'mav' && state === 'NJ'"><span key="session_info_duration" class="lastlogdur">{{ $t('MyAccount.SessionTime.' + state) }}</span> <span>{{sessionTime}}</span></div>
                <div v-if="brandKey === 'mav'" class="lastlogin"><span class="lastlogdur">{{ $t('MyAccount.LastLogin') }}</span> <span> <br> {{lastLogin || '--' }}</span></div>
                <div v-if="brandKey === 'mav'"><span key="session_info_duration" class="lastlogdur">{{ $t('MyAccount.SessionTime') }}</span> <span> <br> {{sessionTime}}</span></div>
              </div>
            </div>
            <div class="buttons">
              <v-btn id="my_profile_deposit_btn" class="transactions deposit" color="success" x-large @click.stop="depositAction()"><span>{{ $t('MyAccount.Deposit') }}</span></v-btn>
              <v-btn id="my_profile_withdraw_btn" class="transactions withdraw" x-large @click.stop="go2WalletPage('withdrawal')"><span>{{ $t('MyAccount.Withdraw') }}</span></v-btn>
              <v-btn v-if="withdrawAtSportsbookButton" id="my_profile_withdraw_btn" class="transactions withdraw ri-wd-cashinshop" x-large @click.stop="go2CashInShopPage()"><span>{{ $t('Payments.CashInShop') }}</span></v-btn>
            </div>
          </div>
            <div class="account_links" :class="[state, {'acc_summary_on': accountSummaryFlow}]">
            <site-navigation :navigation-section="AccountFlow" class="account_links"></site-navigation>
          </div>
        </div>
      </v-dialog>

      <v-dialog content-class="dialog-myaccount" v-model="dialogMyAccount" persistent v-if="mobileBigAndBelow" fullscreen hide-overlay transition="dialog-bottom-transition">
        <div class="account_mobile">
          <div class="account_details">
            <account-info-component></account-info-component>
            <div class="buttons">
              <v-btn id="my_profile_deposit_btn" class="transactions deposit" color="success" x-large @click.stop="depositAction()"><span>{{ $t('MyAccount.Deposit') }}</span></v-btn>
              <v-btn id="my_profile_withdraw_btn" class="transactions withdraw" x-large @click.stop="go2WalletPage('withdrawal')"><span>{{ $t('MyAccount.Withdraw') }}</span></v-btn>
              <v-btn v-if="withdrawAtSportsbookButton" id="my_profile_withdraw_btn" class="transactions withdraw ri-wd-cashinshop" x-large @click.stop="go2CashInShopPage()"><span>{{ $t('Payments.CashInShop') }}</span></v-btn>
            </div>
        </div>
        <div class="account_links" :class="[state, {'acc_summary_on': accountSummaryFlow}]">
          <site-navigation :navigation-section="AccountFlow" class="account_links"></site-navigation>
        </div>
        </div>
      </v-dialog>
    </div>
  </div>
</template>

<script>
  import store from '@/store'
  import config from '@/config'
  import router from '@/router'
  import LoginComponent from '@/components/core/LoginComponent'
  import SiteNavigation from '@/components/common/SiteNavigation'
  import AccountInfoComponent from '@/components/account/AccountInfoComponent'
  import Screen from '@/components/mixins/Screen'
  import HeaderInfo from '@/components/common/HeaderInfo'
  import Icon from '@/components/common/Icon'
  import CircularRotate from '@/components/common/CircularRotate'
  import dotsLoader from '@/components/common/DotsLoader'
  import Gtm from '@/components/mixins/Gtm'
  import Branding from '@/components/mixins/Branding'
  import Session from '@/components/mixins/Session'
  import mobileBridge from '@/library/mobileBridge'
  import MessageCenter from '@/components/layout/parts/MessageCenter'
  import PopupJoinDialog from '../layout/parts/PopupJoinDialog.vue'
  import analyticsBridge from '@/library/analyticsBridge'
  import XtremepushInbox from '@/components/layout/parts/XtremepushInbox'
  import Xtremepush from '@/components/mixins/Xtremepush'

  export default {
    name: 'AccountInfoWidgetComponent',

    mixins: [
      Screen,
      Gtm,
      Branding,
      Session,
      Xtremepush
    ],

    data () {
      return {
        pref_1: false,
        pref_2: true,
        pref_3: false,
        sessionTime: 0
      }
    },

    components: {
      SiteNavigation,
      LoginComponent,
      AccountInfoComponent,
      Icon,
      CircularRotate,
      dotsLoader,
      HeaderInfo,
      MessageCenter,
      PopupJoinDialog,
      XtremepushInbox
    },

    computed: {
      externalUrls () {
        return config.externalUrls
      },
      showBalance () {
        return store.getters['getShowBalance']
      },
      isOpenedFromWebView () {
        return store.getters['getIsOpenedFromWebView']
      },
      dialogMyAccount () {
        return store.getters['overlayState/getMyAccountDialogState']
      },
      customerContext () {
        return store.getters['getCustomerContext']
      },
      balanceSum () {
        return (this.customerContext && this.customerContext.Balances && this.customerContext.Balances.find(b => b.Key === 'CREDIT').Trading) || undefined
      },
      promoBalanceSum () {
        return (this.customerContext && this.customerContext.Balances && this.customerContext.Balances.find(b => b.Key === 'CREDIT').Promo) || undefined
      },
      accountNumber () {
        return (this.customerContext && this.customerContext.Balances && this.customerContext.Balances.find(b => b.Key === 'CREDIT').AccountNumber) || undefined
      },
      dialogLogin: {
        get: () => {
          return store.getters['overlayState/getLoginDialogState']
        },
        set: (newValue) => {
          if (newValue) {
            store.dispatch('overlayState/activateLoginDialog')
          } else {
            store.dispatch('overlayState/deactivateLoginDialog')
          }
        }
      },
      dialogMyAccountDesktop: {
        get: () => {
          return store.getters['overlayState/getMyAccountDesktopDialogState']
        },
        set: (newValue) => {
          if (newValue) {
            store.dispatch('overlayState/activateMyAccountDesktopDialog')
          } else {
            store.dispatch('overlayState/deactivateMyAccountDesktopDialog')
          }
        }
      },
      isLoggedIn () {
        return store.getters['isLoggedIn']
      },
      dialogMyaccount () {
        if (store.getters['isLoggedIn'] === true) {
          return 'dialog-myaccount'
        } else {
          return 'dialog-myaccount notLoggedIn'
        }
      },
      balanceLoader () {
        return store.getters['getBalanceLoader']
      },
      isIgtPayAvailable: () => store.getters['igtPay/isIgtPayAvailable'],
      biometricsAvailability () {
        return store.getters['getBiometricsAvailability']
      },
      biometricsSettings () {
        return store.getters['getBiometricsSettings']
      },
      MobilelocalServer () {
        return window.ctsautoconf.MOBILE_LS || false
      },
      state () {
        return config.app.autoconf.STATE
      },
      accountSummaryFlow () {
        return window.ctsautoconf.ACCOUNT_SUMMARY_FLOW || false
      },
      AccountFlow () {
        if (window.ctsautoconf.ACCOUNT_SUMMARY_FLOW) {
          return 'ACCOUNT_SUMMARY_LINKS'
        }
        return 'MY_ACCOUNT_LINKS'
      },
      noOfMsgs: () => store.getters['messageCenter/getNumberOfMessages'],
      disableJoin () {
        return window.ctsautoconf.DISABLE_JOIN_BUTTON
      },
      cashInShopOnly: () => store.getters['payments/cashInShopOnly'],
      sightlineOnlyDeposit: () => store.getters['payments/sightlineOnlyDeposit'],
      paysafeOnlyDeposit: () => store.getters['payments/paysafeOnlyDeposit'],
      sightlineOnlyWithdrawal: () => store.getters['payments/sightlineOnlyWithdrawal'],
      paysafeOnlyWithdrawal: () => store.getters['payments/paysafeOnlyWithdrawal'],
      cashInShopOnlyWithdrawal: () => store.getters['payments/cashInShopOnlyWithdrawal'],
      pnmPushDebitOnlyWithdrawal: () => store.getters['payments/pnmPushDebitOnlyWithdrawal'],
      pnmOnlyDeposit: () => store.getters['payments/pnmOnlyDeposit'],
      transactionType: () => store.getters['payments/transactionType'],
      depositType () {
        return this.transactionType && this.transactionType === 'deposit'
      },
      withdrawType () {
        return this.transactionType && this.transactionType === 'withdrawal'
      },
      showPageTitleInHeader () {
        return window.ctsautoconf.PAGE_TITLE_IN_HEADER_ON_MOBILE || false
      },
      isRootSportsNavigation () {
        return this.$route.name === 'sports'
      },
      xtremePushEnabledMobile () {
        return config.app.autoconf.XTREMEPUSH_ANALYTICS && config.app.autoconf.XTREMEPUSH_ANALYTICS.MOBILE_APP // for mobile apps only
      },
      isCashInShopAvailable () {
        const isAvailable = store.getters['cashinshop/isCashInShopAvailable']
        return isAvailable
      },
      withdrawAtSportsbookButton () {
        return this.isIgtPayAvailable && this.isCashInShopAvailable
      },
      xtremepushWebInitialized () {
        return store.getters['getXtremepushWebInitialized']
      },
      xtremepushInboxEnabled () {
        return config.app.autoconf.XTREMEPUSH_ANALYTICS && config.app.autoconf.XTREMEPUSH_ANALYTICS.CHANNEL && config.app.autoconf.XTREMEPUSH_ANALYTICS.CHANNEL.INBOX // for mobile apps only
      }
    },

    methods: {
      logout () {
        // store.dispatch('logout')
        this.$router.push({name: 'logout', params: {}})
      },
      openAccountDialog () {
        store.dispatch('overlayState/activateMyAccountDialog')
        this.goToHome()
      },
      goToHome () {
        if (router.currentRoute.name === 'promotions') {
          router.push('/sports')
        }
      },
      goToProfile () {
        store.dispatch('overlayState/activateMyAccountDesktopDialog')
        this.sendGTMClickEvent('my account', 'open my account dialog', 'my-account btn', 'top header')
      },
      openDialogLogin () {
        let faceIdState = (window.ctsautoconf.MOBILE_LS && window.ctsautoconf.APP_BIOMETRICS_AUTOMATIC_LOGIN) ? JSON.parse(localStorage.biometricsState) : false
        if ((this.biometricsAvailability && this.biometricsAvailability.biometrics === 'DATA') && faceIdState && (this.MobilelocalServer && window.ctsautoconf.APP_BIOMETRICS_AUTOMATIC_LOGIN)) {
          store.dispatch('overlayState/activateLoginDialog')
          mobileBridge.bridgeSendRequest('readData')
          this.sendGTMClickEvent('login', 'open login dialog', 'login-btn', 'top header')
          return false
        }
        store.dispatch('overlayState/activateLoginDialog')
        this.sendGTMClickEvent('login', 'open login dialog', 'login-btn', 'top header')
      },

      goToRegistrationPage () {
        this.$router.push({name: 'account-joinUs'})
        this.sendGTMClickEvent('register', 'open registration page', 'join-btn', 'top header')
      },
      closeDialogLogin () {
        store.dispatch('overlayState/deactivateLoginDialog')
      },
      go2WalletPage (param) {
        if (this.isIgtPayAvailable) {
          this.xtremepushEvent(param, 'igtPay')
          store.dispatch('igtPay/redirect2IgtPayPage', { param: param })
        } else {
          this.xtremepushEvent(param)
          if (param === 'deposit') {
            store.commit('payments/transactionType', 'deposit')
          } else if (param === 'withdrawal') {
            store.commit('payments/transactionType', 'withdrawal')
          }
          this.handleRedirection()
          this.closeOverlays()
        }
      },
      handleRedirection () {
        // igtpay
        if (this.isIgtPayAvailable) return store.dispatch('igtPay/redirect2IgtPayPage', {param: 'deposit'})
        // only one deposit or withdraw instrument: go to the component directly
        if (this.paysafeOnlyDeposit && this.depositType) return router.push({ path: '/account/paysafe' })
        if (this.paysafeOnlyWithdrawal && this.withdrawType) return router.push({ path: '/account/paysafe' })
        if (this.sightlineOnlyDeposit && this.depositType && this.brandKey === 'sb') return router.push({ path: '/account/sightline-sb' })
        if (this.sightlineOnlyDeposit && this.depositType) return router.push({ path: '/account/sightline' })
        if (this.sightlineOnlyWithdrawal && this.withdrawType && this.brandKey === 'sb') return router.push({ path: '/account/sightline-sb' })
        if (this.sightlineOnlyWithdrawal && this.withdrawType) return router.push({ path: '/account/sightline' })
        if (this.pnmOnlyDeposit && this.depositType) return router.push({ path: '/account/pnm' })
        if (this.cashInShopOnly && this.withdrawType) return router.push({ path: '/account/withdrawal-cashinshop' })
        if (this.cashInShopOnly && this.depositType) return router.push({ path: '/info/deposit' })
        if (this.pnmPushDebitOnlyWithdrawal && this.withdrawType) return router.push({ path: '/account/pnm-push' })
        // regular case, go to the payments page
        if (router.currentRoute.name !== 'wallet-page') {
          router.push({name: 'wallet-page'})
        }
      },
      closeOverlays () {
        store.dispatch('overlayState/closeAll')
      },
      refreshCustomerContext () {
        store.dispatch('getCustomerContext')
      },
      closeMyAccountDesktopDialog () {
        store.dispatch('overlayState/deactivateMyAccountDesktopDialog')
      },
      closeMyAccountDialog () {
        store.dispatch('overlayState/deactivateMyAccountDialog')
      },
      goToCashierPage: () => {
        if (router.currentRoute.name !== 'wallet-page') {
          router.push({name: 'wallet-page'})
        }
      },
      buttonAction () {
        store.commit('payments/transactionType', 'deposit')
        this.handleRedirection()
      },
      joinAction () {
        if (this.disableJoin) {
          store.dispatch('overlayState/activateJoinDialog')
          return false
        } else if (router.currentRoute.name !== 'account-joinUs') {
          this.goToRegistrationPage()
        }
      },
      depositAction () {
        // 1) cashinShop-only: go to static page
        if (this.cashInShopOnly) {
          this.closeMyAccountDesktopDialog()
          this.closeMyAccountDialog()
          router.push({ path: '/info/deposit' })
          return false
        }
        this.go2WalletPage('deposit')
      },
      xtremepushEvent (param, provider = 'N/A') {
        if (window.xtremepush || this.xtremePushEnabledMobile) {
          let event = {
            'param1': 'event',
            'param2': 'page_view',
            'param3': {
              'pageName': '/account/wallet-page',
              'sport': 'N/A',
              'sportsbookTab': 'N/A',
              'pagePath': document.location.pathname,
              'destinationUrl': window.location.href,
              'paymentAction': param,
              'paymentProvider': provider
            }
          }
          analyticsBridge.xtremePush(event, false)
        }
      },
      go2CashInShopPage () {
        this.$router.push({name: 'withdrawal-cashinshop'})
        this.closeOverlays()
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
    },
    watch: {
      dialogMyAccount (newVal, oldVal) {
        setTimeout(() => {
          var item = document.querySelector('.v-dialog--active.dialog-myaccount')
          if (newVal && item) {
            item.scrollTop = 0
          }
        }, 100)
      },
      xtremepushWebInitialized (newVal) {
        if (newVal && this.isLoggedIn && this.xtremepushInboxEnabled) {
          setTimeout(() => {
            this.initBadge()
          }, 1000)
        }
      },
      isLoggedIn (newVal) {
        if (newVal && this.xtremepushWebInitialized && this.xtremepushInboxEnabled) {
          setTimeout(() => {
            this.initBadge()
          }, 1000)
        }
        if (!newVal && this.xtremepushInboxEnabled) {
          store.commit('setXtremepushInboxBadgeCounter', false)
          store.commit('setXtremepushMessageList', false)
        }
      }
    }
  }
</script>

<style lang="stylus" scoped>
  @import '~@/css/config'
  @import '~@/css/mixins'

  .shw-balance
    color white
    cursor pointer
    font-size 15px
    vertical-align middle
    padding-right 5px
    line-height 18px
    display flex
    flex-direction column
    justify-content center
    align-items center
    min-width 80px
    .amount-container-generic
      @media mobile-big-and-below
        display flex
        flex-direction column
        span
          display flex
        .amount
          margin-left 0
    .text
      color #ff671f
      font-size 16px
      font-weight bold
    .amount
      font-size 14px
      @media mobile-big-and-below
        margin-left 5px

  .login-info
    height: 100%
    display: flex
    align-items: center
    justify-content: space-between
    width auto
    .join-now
      margin-right 0px

  .join
    color: #ffffff
    font-size: 14px
    font-weight bold
    font-style: normal
    font-stretch: normal
    line-height: normal
    background-color: #3FC369
    min-width: 76px

    @media mobile-big-and-below
      min-width: 75px
      height: 32px
      font-size: 14px

  .menu
    >>> .menu__activator .btn__content
      color: #E5E5E5

  >>>.menu__content
    min-width: 320px !important

  .account-info-widget-component
    order: 2
    flex-grow: 1
    .btn--flat
      border-radius: 4px
    .account-info
      min-width: 320px
      text-align: right
      .deposit,
      .transactions
        font-size: 16px
        font-weight: bold
        position: relative
        height 50px
        .balance
          line-height: 14px
          text-align: right
          margin-right: 12px
          .value
            color: #1493FF
            @media mobile-big-and-below
              color: #FFFFFF
        .btn__content span
          font-weight: normal !important
          color: #06283b
          @media mobile-big-and-below
            color: #CFD6DB
        .igt-icon
          right: 12px
          padding-right: 0
          >>> .icon-plus-circle-2
            width: 20px
            height: 20px
        .span_balance
          text-transform: uppercase
          font-size: 12px
          display: block
        .span_balance_hidden
          font-size: 14px
          font-weight: bold
          text-transform: uppercase
        &:hover
          // background: #31568F !important
          opacity: 0.8


  .account_details
    padding: 16px 12px 10px
    background: #20385A
    color: #fff

  .account_links
    background: #fff
    &.acc_summary_on
      >>>.navigation .navigation-item a
        justify-content flex-start

    >>>hr
      display: none

    >>>.v-expansion-panel
      box-shadow: none

    >>>.v-expansion-panel__header
      height: 48px
      padding: 0 16px
      font-size: 14px
      color: #1f375b
      line-height: 48px
    >>>.v-expansion-panel__header .icon
      color: #1f375b !important

    .card__text
      background: #F5F8FC
      padding 0 16px

    .preferences
      border-bottom: 1px solid #CFD6DB
      margin: 0 -16px 0 -16px

    .preferences li
      display: flex
      height: 48px
      border-top: 1px solid #CFD6DB
      padding: 9px 16px
      line-height: 14px
      font-size: 12px
      span
        flex: 1 1 auto
        vertical-align: middle
      .switch
        margin-left: auto

      >>>.switch .v-input--selection-controls__input
        color: #2CB459 !important
      >>>.switch .v-input--selection-controls
        color: #2CB459 !important

      >>>.switch:not(.v-input-group--dirty) .v-input-group--selection-controls
         color: #CFD6DB !important

      >>>.v-input-group--selection-controls__toggle.v-input-group--selection-controls__toggle--active
        opacity: 1 !important
      >>>.v-input-group--selection-controls__ripple:after
        background: #fff
        margin-left: 4px
      >>>.v-input-group--selection-controls__ripple--active:after
       left: 30px

      .v-input-group
        min-width: auto
      >>>.v-input-group__input
        background: none !important
        padding: 0 0 0 12px !important
      >>>.v-input-group--selection-controls__toggle
        width: 50px
        height: 28px
        border-radius: 100px

  .primary-btn
    width: 144px
    border-radius: 4px

    .igt-icon
      padding-right: 8px

    @media mobile-big-and-below
      width: 98%

  .deposit
    background-color: #3fc369 !important
    color: #fff
    margin-left: 0

    &:hover
      background-color: #29974b !important
      border-radius: 2px

  .withdraw
    background-color: #fff !important
    color: #06283b
    margin-left: 4px
    @media mobile-big-and-below
      color: #06283b

    &:hover
      background-color: #fff !important
      border-radius: 2px !important
      color: #1F375B
    &.ri-wd-cashinshop
      margin-left 12px
      >>> .v-btn__content
        width: 100%
        white-space: unset!important
        font-size 14px
        line-height 14px

  .join_btn_mobile
    background-color: #fff !important
    color: #1F375B
    margin-left: -1px

  .login_btn_mobile
    background-color: #2396fc !important
    color: #fff
    margin-left: 4px

  .offer
    width: 100%
    height: 100px
    line-height: 100px
    text-align: center
    font-size: 20px
    background: #f5f5f5
    border-radius: 4px
    margin-bottom: 8px
    color: #20385a

  .igt-icon
    padding-right: 16px
    >>> .icon-add-funds
          width: 20px !important
          height: 20px !important

  .list
    padding: 0

    div:hover
      background: #F0F3F8 !important
      color: #2396FC
      cursor: pointer

    .v-list__tile__title
      font-size: 14px

@media mobile-big-and-below
  .account-info-widget-component
    @media mobile-big-and-below
      justify-content: flex-end
      display flex
      margin-right 15px
    .account-info
      min-width: auto !important
      margin-right -20px
      .balance-deposit
        background: transparent !important
        margin-right: 0px
        font-size: 14px
        .igt-icon
          >>> .icon-plus-circle-2
            width: 28px
            height: 28px
        .balance
          margin-right : 10px
          line-height: 16px
.balance-circular-progress
  display inline-block
  position relative
  vertical-align middle
  >>> .v-progress-circular
    width 16px !important
    height 16px !important

.acc_buttons
  display flex
  justify-content flex-end
  .logout
    margin-right 0px
    @media mobile-big-and-below
      margin-right 10px
  .shw-balance
    @media mobile-big-and-below
      align-items center
      display flex
    .ammount
      @media mobile-big-and-below
        margin-left 5px
.buttons
  text-align center
  display flex
  justify-content space-between
  .v-btn
    flex 1
    &.transactions
      height 50px

>>>.dots-loader
  background-color: transparent !important
  height: auto !important
  display: flex !important
  box-shadow: none !important
  span
    color: #fff

</style>
