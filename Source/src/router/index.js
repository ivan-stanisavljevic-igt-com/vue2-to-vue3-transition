import Vue from 'vue'
import Router from 'vue-router'
import Meta from 'vue-meta'
import config from '@/config'
import store from '@/store'

import p404 from '@/components/common/errors/p404'

// layouts
import AccountLayout from '@/components/layout/AccountLayout'
import SportsLayout from '@/components/layout/SportsLayout'

// pages
import StaticContentPage from '@/components/pages/StaticContentPage'
// import AccountPage from '@/components/pages/AccountPage'
// import StaticContentPage from '@/components/pages/StaticContentPage'
import AccountPersonalDetailsComponent from '@/components/account/AccountPersonalDetailsComponent'
// import AccountTransactionHistoryComponent from '@/components/account/AccountTransactionHistoryComponent'
import AccountHistoryTransactionsComponent from '@/components/account/AccountHistoryTransactionsComponent'
import BetHistory from '@/components/account/BetHistory'
import SportsPage from '@/components/pages/SportsPage'
import LiveSportsPage from '@/components/pages/LiveSportsPage'
import EventPage from '@/components/pages/EventPage'
import IWdepositSightline from '@/components/account/IntegratedWallet/IWdepositSightline.vue'
import CashInShop from '@/components/payments/CashInShop'
import IWwithdrawalSightline from '@/components/account/IntegratedWallet/IWwithdrawalSightline'
import IWfundingSightline from '@/components/account/IntegratedWallet/IWfundingSightline'
import ContestsStatic from '@/components/pages/ContestsStaticPage'
import AccountVouchers from '@/components/account/AccountVouchers'
import W2GTaxFormList from '@/components/account/W2GTaxFormList'
import LogoutPage from '@/components/pages/LogoutPage'
// import JoinComponent from '@/components/account/IntegratedWallet/JoinComponent'
// import JoinUsComponent from '@/components/account/IntegratedWallet/JoinUsComponent'
import ChangePassword from '@/components/account/IntegratedWallet/IWChangePassword'
import ForgottenPassword from '@/components/account/AccountForgottenPassword'
import ConfirmEmailByTempSession from '@/components/account/IntegratedWallet/ConfirmEmailByTempSession'
import geolocationStatus from '@/components/common/geolocationStatus'
import AppInstaller from '@/components/common/AppInstaller'
import SetDebugLevel from '@/components/common/SetDebugLevel'
import ForceSelectionsToBetslip from '@/components/sports/bettingoffer/forceSelectionsToBetslip'
import NotificationPreferences from '@/components/account/IntegratedWallet/NotificationPreferencesV2'
import Payments from '@/components/payments/Payments'
import AccountSelfExclusionComponent from '@/components/account/AccountSelfExclusionComponent'
import setOpenedFromWebViewPage from '@/components/pages/setOpenedFromWebViewPage'
import AccountPlayBalanceComponent from '@/components/account/AccountPlayBalanceComponent'
import AccountPlayLimitsComponent from '@/components/account/Limits/Limits'
import AccountCloseAccountComponent from '@/components/account/AccountCloseAccountComponent'
import AccountSetPasswordByTempSession from '@/components/account/AccountSetPasswordByTempSession'
import TermsAndConditions from '@/components/termsAndConditions/termsAndConditions.vue'
import EmailAndPhoneVerification from '@/components/account/IntegratedWallet/EmailAndPhoneVerification.vue'
import Verification from '@/components/account/IntegratedWallet/Verification.vue'
import VerificationPersonalData from '@/components/account/IntegratedWallet/VerificationPersonalData'
import ResponsibleGaming from '@/components/account/IntegratedWallet/ResponsibleGaming'
import AccountSettings from '@/components/account/IntegratedWallet/AccountSettings'
// import G1 from '@/components/rgs/G1'
// import NotificationsUnsubscribeComponent from '@/components/account/NotificationsUnsubscribeComponent'
import PariMutuel from '@/components/pages/PariMutuel'
import DepositThresholdComponent from '@/components/account/DepositThresholdComponent'
import ResponsibleGamingHistoryComponent from '@/components/account/ResponsibleGamingHistoryComponent'
import SearchPage from '@/components/pages/SearchPage'
import AccountSummary from '@/components/account/IntegratedWallet/AccountSummary'
import CareerStats from '@/components/account/CareerStats'
import SelfExclusionConfirmation from '@/components/account/Exclusions/SelfExclusionConfirmation'
import PayNearme from '@/components/payments/PayNearme'
import Sightline from '@/components/payments/Sightline'
import SightlineSuperbook from '@/components/payments/sb/SightlineSB'
import PaySafe from '@/components/payments/Paysafe'
import PNMDebit from '@/components/payments/PayNearMeGateway/PNMDebit'
import PNMCredit from '@/components/payments/PayNearMeGateway/PNMCredit'
import PNMPushDebit from '@/components/payments/PayNearMeGateway/PNMPushDebit'
import PNMCash from '@/components/payments/PayNearMeGateway/PNMCash'
import PNMAch from '@/components/payments/PayNearMeGateway/PNMAch'
import PNMAPay from '@/components/payments/PayNearMeGateway/PNMAPay'
import PNMGPay from '@/components/payments/PayNearMeGateway/PNMGPay'
import PNMPaymentCompleted from '@/components/payments/PayNearMeGateway/PNMPaymentCompleted'
import PNMPaymentNotCompleted from '@/components/payments/PayNearMeGateway/PNMPaymentNotCompleted'
import ToolboxTranslatorPage from '@/components/pages/ToolboxTranslatorPage'
import ReferAFriend from '@/components/account/ReferAFriend'
import Promotions from '@/components/account/Promotions'
import PickAndClaim from '@/components/account/PickAndClaim'
import Registration from '@/components/account/Registration/Registration'
import VerificationMaps from '@/components/account/Verification/VerificationMaps.vue'
import SecuritySettings from '@/components/account/IntegratedWallet/SecuritySettings'
import MyEventsPage from '@/components/pages/MyEventsPage'
import MyEventsSettings from '@/components/account/MyEventsSettings'
import PNMPayPalWithdrawal from '@/components/payments/PayNearMeGateway/PNMPayPalWithdrawal'
import NuveiPaymentCompleted from '@/components/payments/Nuvei/NuveiPaymentCompleted'
import NuveiPaymentFailed from '@/components/payments/Nuvei/NuveiPaymentFailed'
import NuveiWdCard from '@/components/payments/Nuvei/NuveiWdCard'
import NuveiWdPayPal from '@/components/payments/Nuvei/NuveiWdPayPal'
import NuveiWdACH from '@/components/payments/Nuvei/NuveiWdACH'
import NuveiWdPlayPlus from '@/components/payments/Nuvei/NuveiWdPlayPlus'
import NuveiWdVipp from '@/components/payments/Nuvei/NuveiWdVipp'
import NuveiPaymentNotCompleted from '@/components/payments/Nuvei/NuveiPaymentNotCompleted'

// Contests Routes
import ContestsPage from '@/components/pages/contests/ContestsPage'
import ContestPicksPage from '@/components/pages/contests/ContestPicksPage'
import ContestTermsAndConditionsPage from '@/components/pages/contests/ContestTermsAndConditionsPage'
import ContestAliasPage from '@/components/pages/contests/ContestAliasPage'
import ContestRegistrationSuccessfulPage from '@/components/pages/contests/ContestRegistrationSuccessfulPage'
import ContestsReportsPage from '@/components/pages/contests/ContestsReportsPage'

Vue.use(Meta, {
  keyName: 'metaInfo', // the component option name that vue-meta looks for meta info on.
  attribute: 'data-vue-meta' // the attribute name vue-meta adds to the tags it observes
})

Vue.use(Router)

const router = new Router({
  // uncomment to turn on routes with no hash
  mode: 'history',
  routes: [{
    path: '/',
    redirect: '/sports'
  }, {
    path: '/home',
    name: 'home',
    redirect: '/sports'
  }, {
    path: '',
    name: 'sports-layout',
    component: SportsLayout,
    children: [
      {
        path: '/sports',
        name: 'sports',
        component: SportsPage,
        props: true,
        meta: { navgroupkey: 'sports' }
      },
      {
        path: '/sports/navigation/:idfwbonavigation1',
        name: 'bonavigation1',
        component: SportsPage,
        props: true,
        meta: { navgroupkey: 'sports' }
      },
      {
        path: '/sports/navigation/:idfwbonavigation1/:idfwbonavigation2',
        name: 'bonavigation2',
        component: SportsPage,
        props: true,
        meta: { navgroupkey: 'sports' }
      },
      {
        path: '/sports/navigation/:idfwbonavigation1/:idfwbonavigation2/:idfwbonavigation3',
        name: 'bonavigation3',
        component: SportsPage,
        props: true,
        meta: { navgroupkey: 'sports' }
      },
      {
        path: '/sports/history/:hstate',
        name: 'history-hstate',
        component: SportsPage,
        props: true,
        meta: { navgroupkey: 'sports' }
      },
      {
        path: '/sports/event/:idfoevent',
        name: 'event',
        component: EventPage,
        props: true,
        meta: { navgroupkey: 'sports' }
      },
      {
        path: '/sports/injectselections/:idfoselectionscsv',
        name: 'event',
        component: ForceSelectionsToBetslip,
        props: true,
        meta: { navgroupkey: 'sports' }
      },
      {
        path: '/sports/search',
        name: 'search',
        component: SearchPage,
        props: true,
        children: [
          {
            path: '/sports/search/sport/:idfosport',
            name: 'searchsport',
            component: SearchPage,
            props: true
          },
          {
            path: '/sports/search/competition/:idfosport/:idfocompetition',
            name: 'searchcompetition',
            component: SearchPage,
            props: true
          }
        ]
      },
      {
        path: '/live',
        name: 'sports-live',
        component: LiveSportsPage,
        props: true,
        meta: { navgroupkey: 'sports' }
      },
      {
        path: '/contests-static',
        name: 'contests-static',
        component: ContestsStatic,
        props: true
      }, {
        path: '/my-events',
        component: MyEventsPage,
        name: 'my-events',
        meta: {
          authRequired: true
        }
      }
    ]
  }, {
    path: '/pm/for',
    name: 'pm-for',
    component: PariMutuel,
    props: true,
    meta: { navgroupkey: 'pm' },
    children: [
      {
        path: ':period',
        name: 'pm-for-period',
        component: PariMutuel,
        props: true,
        meta: { navgroupkey: 'pm' }
      },
      {
        path: ':period/:breed',
        name: 'pm-for-period-breed',
        component: PariMutuel,
        props: true,
        meta: { navgroupkey: 'pm' }
      },
      {
        path: ':period/:breed/:idtgmeeting',
        name: 'pm-for-period-breed-meeting',
        component: PariMutuel,
        props: true,
        meta: { navgroupkey: 'pm' }
      },
      {
        path: ':period/:breed/:idtgmeeting/:idtgrace',
        name: 'pm-for-period-breed-meeting-race',
        component: PariMutuel,
        props: true,
        meta: { navgroupkey: 'pm' }
      }
    ]
  }, {
    path: '/pm',
    name: 'pmbetting',
    component: PariMutuel,
    props: true,
    meta: { navgroupkey: 'pm' },
    children: [
      {
        path: ':idtgmeeting',
        name: 'pmbetting-meeting',
        component: PariMutuel,
        props: true,
        meta: { navgroupkey: 'pm' }
      },
      {
        path: ':idtgmeeting/:idtgrace',
        name: 'pmbetting-meeting-race',
        component: PariMutuel,
        props: true,
        meta: { navgroupkey: 'pm' }
      },
      {
        path: ':idtgmeeting/:idtgrace/:pooltype',
        name: 'pmbetting-meeting-race-pool',
        component: PariMutuel,
        props: true,
        meta: { navgroupkey: 'pm' }
      },
      {
        path: ':idtgmeeting/:idtgrace/:pooltype/:bettype',
        name: 'pmbetting-meeting-race-pool-bettype',
        component: PariMutuel,
        props: true,
        meta: { navgroupkey: 'pm' }
      }
    ]
  }, {
    path: '/logout',
    name: 'logout',
    component: LogoutPage,
    props: true
  }, {
    path: '/contests',
    name: 'contests',
    component: ContestsPage,
    meta: {
      contestsLinkDisabled: true
    },
    children: [
      {
        path: ':contestId/registration/termsandconditions',
        name: 'contests/registration/termsandconditions',
        component: ContestTermsAndConditionsPage
      },
      {
        path: ':contestId/registration/alias',
        name: 'contests/registration/alias',
        component: ContestAliasPage
      },
      {
        path: ':contestId/registration/registrationsuccessful',
        name: 'contests/registration/registrationsuccessful',
        component: ContestRegistrationSuccessfulPage
      },
      {
        path: ':contestId/:contestEntryId/mypicks',
        name: 'contests/my-picks',
        component: ContestPicksPage,
        children: [
          {
            path: 'reports/:reportName',
            name: 'contests/my-picks/reports',
            component: ContestsReportsPage
          }
        ]
      }
    ]
  },
  {
    path: '',
    name: 'account-layout',
    component: AccountLayout,
    children: [
      {
        path: '/account/raf',
        name: 'refer-a-friend',
        component: ReferAFriend
      },
      {
        path: '/account/promotions',
        name: 'promotions',
        component: Promotions
      },
      {
        path: '/account/pick-and-claim',
        name: 'pick-and-claim',
        component: PickAndClaim
      },
      {
        path: '/account/joinUs',
        name: 'account-joinUs',
        component: Registration,
        props: true,
        meta: {
          authRequired: false,
          linkDisabled: true,
          disableJoin: true,
          registrationLinkDisabled: true
        }
      }, {
        path: '/termsAndConditions',
        name: 'termsAndConditions',
        component: TermsAndConditions,
        props: true,
        meta: {
          authRequired: true
        }
      }, {
        path: '/account/wallet-page',
        name: 'wallet-page',
        component: Payments,
        props: false,
        meta: {
          authRequired: true
        }
      }, {
        path: '/account/deposit-sightline',
        name: 'deposit-sightline',
        component: IWdepositSightline,
        props: false,
        meta: {
          authRequired: true
        }
      }, {
        path: '/account/withdrawal-sightline',
        name: 'withdrawal-sightline',
        component: IWwithdrawalSightline,
        props: false,
        meta: {
          authRequired: true
        }
      }, {
        path: '/account/funding-sightline',
        name: 'funding-sightline',
        component: IWfundingSightline,
        props: false,
        meta: {
          authRequired: true
        }
      }, {
        path: '/account/withdrawal-cashinshop',
        name: 'withdrawal-cashinshop',
        component: CashInShop,
        props: false,
        meta: {
          authRequired: true
        }
      }, {
        path: '/account/change-password',
        name: 'change-password',
        component: ChangePassword,
        props: false,
        meta: {
          authRequired: true
        }
      },
      {
        path: '/account/reset-password',
        name: 'reset-password',
        component: ForgottenPassword,
        props: false
      }, {
        path: '/account/recovery/:value',
        name: 'set-password-by-temp-session',
        component: AccountSetPasswordByTempSession,
        props: true
      }, {
        path: '/account/confirm-email-by-temp-session',
        name: 'confirm-email-by-temp-session',
        component: ConfirmEmailByTempSession,
        props: false
      }, {
        path: '/account/verify/:verify/:pin',
        name: 'verify',
        component: EmailAndPhoneVerification,
        props: false
      }, {
        path: '/account/non-verified',
        name: 'account-non-verified',
        component: Verification,
        props: true,
        meta: {
          authRequired: true
        }
      }, {
        path: '/account/verify-personal-data',
        name: 'verify-personal-data',
        component: VerificationPersonalData,
        props: true,
        meta: {
          authRequired: true
        }
      }, {
        path: '/account/verification',
        name: 'verification',
        component: VerificationMaps,
        props: true,
        meta: {
          authRequired: true
        }
      }, {
        path: '/account/personal-details',
        name: 'account-personal-details',
        component: AccountPersonalDetailsComponent,
        props: true,
        meta: {
          authRequired: true
        }
      },
      {
        path: '/account/transactions',
        name: 'account-transactions',
        component: AccountHistoryTransactionsComponent,
        props: true,
        meta: {
          authRequired: true
        }
      },
      {
        path: '/account/self-exclusion',
        name: 'account/self-exclusion',
        component: AccountSelfExclusionComponent,
        props: true,
        meta: {
          authRequired: true
        }
      },
      {
        path: '/account/play-balance',
        name: 'account/play-balance',
        component: AccountPlayBalanceComponent,
        props: true,
        meta: {
          authRequired: true
        }
      },
      {
        path: '/account/play-limits',
        name: 'account/play-limits',
        component: AccountPlayLimitsComponent,
        meta: {
          authRequired: true
        }
      },
      {
        path: '/account/close-account',
        name: 'account/close-account',
        component: AccountCloseAccountComponent,
        meta: {
          authRequired: true
        }
      },
      {
        path: '/account/bethistory/:state',
        name: 'history-state',
        component: BetHistory,
        props: true,
        meta: {
          authRequired: true
        }
      }, {
        path: '/account/notification-preferences',
        component: NotificationPreferences,
        name: 'notification-preferences',
        meta: {
          authRequired: false
        }
      }, {
        path: '/account/vouchers',
        component: AccountVouchers,
        name: 'account-vouchers',
        meta: {
          authRequired: true
        }
      }, {
        path: '/account/w2gtaxforms',
        component: W2GTaxFormList,
        name: 'w2gtaxforms',
        meta: {
          authRequired: true
        }
      }, {
        path: '/account/settings',
        component: AccountSettings,
        name: 'settings',
        meta: {
          authRequired: true
        }
      }, {
        path: '/account/responsible-gaming',
        component: ResponsibleGaming,
        name: 'responsible-gaming',
        meta: {
          authRequired: true
        }
      }, {
        path: '/account/deposit-threshold',
        component: DepositThresholdComponent,
        name: 'deposit-threshold',
        meta: {
          authRequired: true
        }
      }, {
        path: '/account/responsible-gaming-history',
        component: ResponsibleGamingHistoryComponent,
        name: 'responsible-gaming-history',
        meta: {
          authRequired: true
        }
      }, {
        path: '/account/account-summary',
        component: AccountSummary,
        name: 'account-summary',
        meta: {
          authRequired: true
        }
      }, {
        path: '/account/career-stats',
        component: CareerStats,
        name: 'career-stats',
        meta: {
          authRequired: true
        }
      }, {
        path: '/account/se-confirmation',
        component: SelfExclusionConfirmation,
        name: 'se-confirmation',
        meta: {
          authRequired: true
        }
      }, {
        path: '/account/sightline',
        component: Sightline,
        name: 'sightline',
        meta: {
          authRequired: true
        }
      }, {
        path: '/account/sightline-sb',
        component: SightlineSuperbook,
        name: 'sightline-sb',
        meta: {
          authRequired: true
        }
      }, {
        path: '/account/paysafe',
        component: PaySafe,
        name: 'paysafe',
        meta: {
          authRequired: true
        }
      }, {
        path: '/account/pnm',
        component: PayNearme,
        name: 'pnm',
        meta: {
          authRequired: true
        }
      }, {
        path: '/account/pnm-gpay',
        component: PNMGPay,
        name: 'pnm-gpay',
        meta: {
          authRequired: true
        }
      }, {
        path: '/account/pnm-apay',
        component: PNMAPay,
        name: 'pnm-apay',
        meta: {
          authRequired: true
        }
      }, {
        path: '/account/pnm-credit',
        component: PNMCredit,
        name: 'pnm-credit',
        meta: {
          authRequired: true
        }
      }, {
        path: '/account/pnm-debit',
        component: PNMDebit,
        name: 'pnm-debit',
        meta: {
          authRequired: true
        }
      }, {
        path: '/account/pnm-push',
        component: PNMPushDebit,
        name: 'pnm-push',
        meta: {
          authRequired: true
        }
      }, {
        path: '/account/pnm-ach',
        component: PNMAch,
        name: 'pnm-ach',
        meta: {
          authRequired: true
        }
      }, {
        path: '/account/pnm-cash',
        component: PNMCash,
        name: 'pnm-cash',
        meta: {
          authRequired: true
        }
      }, {
        path: '/account/pnm-payment-completed',
        component: PNMPaymentCompleted,
        name: 'pnm-payment-completed',
        meta: {
          authRequired: true
        }
      }, {
        path: '/account/pnm-payment-not-completed',
        component: PNMPaymentNotCompleted,
        name: 'pnm-payment-not-completed',
        meta: {
          authRequired: true
        }
      }, {
        path: '/account/pnm-paypal-withdrawal',
        component: PNMPayPalWithdrawal,
        name: 'pnm-paypal-withdrawal',
        meta: {
          authRequired: true
        }
      }, {
        path: '/account/nuvei-payment-completed',
        component: NuveiPaymentCompleted,
        name: 'nuvei-payment-completed',
        meta: {
          authRequired: true
        }
      }, {
        path: '/account/nuvei-payment-failed',
        component: NuveiPaymentFailed,
        name: 'nuvei-payment-failed',
        meta: {
          authRequired: true
        }
      }, {
        path: '/account/nuvei-payment-not-completed',
        component: NuveiPaymentNotCompleted,
        name: 'nuvei-payment-not-completed',
        meta: {
          authRequired: true
        }
      }, {
        path: '/account/nuvei-card-withdrawal',
        component: NuveiWdCard,
        name: 'nuvei-card-withdrawal',
        meta: {
          authRequired: true
        }
      }, {
        path: '/account/nuvei-paypal-withdrawal',
        component: NuveiWdPayPal,
        name: 'nuvei-paypal-withdrawal',
        meta: {
          authRequired: true
        }
      }, {
        path: '/account/nuvei-ach-withdrawal',
        component: NuveiWdACH,
        name: 'nuvei-paypal-withdrawal',
        meta: {
          authRequired: true
        }
      }, {
        path: '/account/nuvei-playplus-withdrawal',
        component: NuveiWdPlayPlus,
        name: 'nuvei-playplus-withdrawal',
        meta: {
          authRequired: true
        }
      }, {
        path: '/account/nuvei-vipp-withdrawal',
        component: NuveiWdVipp,
        name: 'nuvei-vipp-withdrawal',
        meta: {
          authRequired: true
        }
      }, {
        path: '/account/security-settings',
        component: SecuritySettings,
        name: 'security-settings',
        meta: {
          authRequired: true
        }
      }, {
        path: '/account/my-events-settings',
        component: MyEventsSettings,
        name: 'my-events-settings',
        meta: {
          authRequired: true
        }
      }
    ]
  }, {
    path: '/setdebug/:level',
    name: 'setDebug',
    component: SetDebugLevel,
    props: true
  }, {
    path: '/404',
    name: 'page-not-found',
    component: p404
  }, {
    path: '/fromwebview',
    name: 'setOpenedFromWebView',
    component: setOpenedFromWebViewPage
  }, {
    path: '/externallogin',
    name: 'externalLogin'
  }, {
    path: '*',
    redirect: '/404'
  }, {
    path: '/geolocation/fail',
    name: 'geolocation-fail',
    component: geolocationStatus,
    props: {'isGelocated': false}
  }, {
    path: '/geolocation/success',
    name: 'geolocation-success',
    component: geolocationStatus,
    props: {'isGelocated': true}
  }, {
    path: '/geolocation/registration-success',
    name: 'geolocation-registration-success',
    component: geolocationStatus,
    props: {'isGelocated': true, 'registration': true}
  }, {
    path: '/app',
    name: 'app',
    component: AppInstaller,
    props: true
  },
  {
    path: '/android',
    name: 'android',
    component: AppInstaller,
    props: true
  }, {
    path: '/loginWithAuthWebToken/:token',
    name: 'loginWithAuthWebToken'
  }, {
    path: '/info/:infopagename',
    name: 'info',
    component: StaticContentPage,
    props: true
  }, {
    path: '/toolbox/translator',
    name: 'toolbox-translator-page',
    component: ToolboxTranslatorPage,
    props: true
  }
  ]
}, {
  path: '/account',
  name: 'iw-account-layout',
  children: [
    {
      path: '/account/deposit',
      name: 'deposit',
      props: true
    },
    {
      path: '/account/withdraw',
      name: 'withdraw',
      props: true
    }
  ]
})
router.beforeEach((to, from, next) => {
  try {
    if (to && to.query && (to.query.internalProxy || to.query.internalLink)) {
      // info: use /?internalProxy=/{routepath} querystring on root navigation to proxy browser location (from external source) to specified path using router push instead of location change
      if (to.query && to.query.component) {
        console.log('to.query.component', to.query.component)
        if (to.query.component === 'welcome') store.commit('overlayState/setWelcomeDialogGenericState', false)
        if (to.query.component === 'whatsnew') store.commit('overlayState/setWhatsNewDialogState', false)
      }
      console.log('to.query', to.query)
      console.log('internalProxy redirects to: ' + to.query.internalProxy)
      if (window.ctsautoconf.ACCOUNT_SUMMARY_FLOW && to.query.internalLink) {
        const isInfoPage = to.query.internalLink.includes('/info/')
        const customPath = isInfoPage && to.hash ? to.query.internalLink + to.hash : to.query.internalLink
        return next({path: customPath})
        // return next({path: to.query.internalLink})
      }
      const isInfoPage = to.query.internalProxy.includes('/info/')
      const customPath = isInfoPage && to.hash ? to.query.internalProxy + to.hash : to.query.internalProxy
      return next({path: customPath})
      // return next({path: to.query.internalProxy})
    }
  } catch (err) {
    console.log('internalProxy failed to redirect')
    return next({ path: '/' })
  }
  const isLoggedIn = localStorage.loggedIn
  const isProtected = to.matched.some(record => record.meta.authRequired)
  const linkDisabled = to.matched.some(record => record.meta.linkDisabled)
  const registrationLinkDisabled = to.matched.some(record => record.meta.registrationLinkDisabled)
  const disableJoin = window.ctsautoconf.DISABLE_JOIN_BUTTON

  if (isProtected) {
    if (isLoggedIn) {
      return next()
    } else {
      return next({ path: '/' })
    }
  }
  /* Boyd - Disable promotions,registration... */
  if (linkDisabled && (config.app.BRAND === 'boyd' || config.app.BRAND === 'rw')) {
    return next({ path: '/' })
  }

  /* Disable registration */
  if (disableJoin && registrationLinkDisabled) {
    return next({ path: '/' })
  }

  /* disable contests */
  const contestsEnabled = config.app.autoconf.CONTESTS
  const contestsLinkDisabled = to.matched.some(record => record.meta.contestsLinkDisabled)

  if (!contestsEnabled && contestsLinkDisabled) {
    return next({ path: '/' })
  }

  if (config.app.autoconf.ROUTERNAVGROUPS && config.app.autoconf.ROUTERNAVGROUPS && config.app.autoconf.ROUTERNAVGROUPS.groups && to.meta.navgroupkey) {
    let groups = config.app.autoconf.ROUTERNAVGROUPS.groups.filter(grp => grp.key === to.meta.navgroupkey)
    if (groups.length > 0 && groups[0].isactive === false) {
      return next({ path: groups[0].exitpath })
    }
  }

  next()
})

router.afterEach((to, from) => {
  // setTimeout to prevent overlapping the betting offer on iOS apps
  // checking hashes - prevent account pages bouncing on mobile devices
  if (((to && !to.hash) && (from && !from.hash)) || ((from && from.hash) && (to && !to.hash))) {
    setTimeout(() => { window.scrollTo(0, 0) }, 300)
  }
})

export default router
