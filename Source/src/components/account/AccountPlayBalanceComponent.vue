<template>
  <div class="page-content account">
    <div v-if="!accountSummaryFlow && isLoggedIn" class="playbalance">
      <h1>{{ $t('Account.PlayBalance') }}</h1>
      <div class="total-balance" id="qa-total-balance">
        <div class="label">{{ $t('Account.PlayBalance.TotalBalance') }}</div>
        <div class="val">{{totalBalance | currency}}</div>
      </div>
      <div class="trading-balance" id="qa-trading-balance">
        <div class="trading-balance-header" @click.stop="toggleTradingBalance = !toggleTradingBalance">
          <div class="label">{{ $t('Account.PlayBalance.TradingBalance') }}</div>
          <div class="val">{{tradingBalance | currency}}</div>
          <v-icon v-show ="!toggleTradingBalance" class="chevron_down">expand_more</v-icon>
          <v-icon v-show ="toggleTradingBalance" class="chevron_up">expand_less</v-icon>
        </div>
        <div v-if ="toggleTradingBalance">
          <div class="balance-info tradingbalance">{{ $t('Account.PlayBalance.TradingBalanceInfo') }}</div>
          <div class="withdrawal-balance">
            <div class="label">{{ $t('Account.PlayBalance.WithdrawalBalance') }}</div>
            <div class="val">{{withdrawalBalance | currency}}</div>
          </div>
          <div class="balance-info withdrawalbalance">{{ $t('Account.PlayBalance.WithdrawalBalanceInfo') }}</div>

          <div v-if="brandKey !=='boyd' || (brandKey === 'boyd' && promoBalance)" class="promo-balance">
            <div class="label">{{ $t('Account.PlayBalance.PromoBalance') }}</div>
            <div class="val">{{promoBalance | currency}}</div>
          </div>
          <div class="balance-info withdrawalbalance">{{ $t('Account.PlayBalance.PromoBalanceInfo') }}</div>
        </div>
      </div>
      <div class="locked-funds" id="qa-locked-funds">
        <div class="locked-funds-header" @click.stop="toggleLockedFunds = !toggleLockedFunds">
          <div class="label">{{ $t('Account.PlayBalance.LockedFunds') }}</div>
          <div class="val">{{lockedFunds | currency}}</div>
          <v-icon v-show ="!toggleLockedFunds" class="chevron_down">expand_more</v-icon>
          <v-icon v-show ="toggleLockedFunds" class="chevron_up">expand_less</v-icon>
        </div>
        <div v-if ="toggleLockedFunds" class="balance-info lockedfunds">{{ $t('Account.PlayBalance.LockedFundsInfo') }}</div>
      </div>
      <pending-transactions></pending-transactions>
    </div>
    <!-- Account summary tempalte -->
    <div v-if="accountSummaryFlow && isLoggedIn" class="playbalance">
      <div class="total-balance" id="qa-total-balance">
        <div class="label">{{ $t('Account.PlayBalance.TotalBalance') }}</div>
        <div class="val">{{totalBalance | currency}}</div>
      </div>
      <div class="trading-balance" id="qa-trading-balance">
        <div class="trading-balance-header">
          <div class="label">{{ $t('Account.PlayBalance.TradingBalance') }}</div>
          <div class="val">{{tradingBalance | currency}}</div>
        </div>
        <div>
          <div class="balance-info tradingbalance">{{ $t('Account.PlayBalance.TradingBalanceInfo') }}</div>
          <div class="withdrawal-balance">
            <div class="label">{{ $t('Account.PlayBalance.WithdrawalBalance') }}</div>
            <div class="val">{{withdrawalBalance | currency}}</div>
          </div>
          <div class="balance-info withdrawalbalance">{{ $t('Account.PlayBalance.WithdrawalBalanceInfo') }}</div>
          <div v-if="brandKey !=='boyd' || (brandKey === 'boyd' && promoBalance)" class="promo-balance">
            <div class="label">{{ $t('Account.PlayBalance.PromoBalance') }}</div>
            <div class="val">{{promoBalance | currency}}</div>
          </div>
          <div class="balance-info withdrawalbalance">{{ $t('Account.PlayBalance.PromoBalanceInfo') }}</div>
        </div>
      </div>
      <div class="locked-funds" id="qa-locked-funds">
        <div class="locked-funds-header">
          <div class="label">{{ $t('Account.PlayBalance.LockedFunds') }}</div>
          <div class="val">{{lockedFunds | currency}}</div>
        </div>
        <div class="balance-info lockedfunds">{{ $t('Account.PlayBalance.LockedFundsInfo') }}</div>
      </div>
    </div>
  </div>
</template>

<script>
  import store from '@/store'
  import Branding from '@/components/mixins/Branding'
  import pendingTransactions from '@/components/account/AccountPendingTransactionsComponent'

  export default {

    mixins: [
      Branding
    ],

    components: {
      pendingTransactions
    },

    data: () => ({
      toggleTradingBalance: true,
      toggleLockedFunds: false
    }),

    computed: {
      isLoggedIn () {
        return store.getters['isLoggedIn']
      },
      getCustomerContext () {
        return store.getters['getCustomerContext']
      },
      balances () {
        return this.getCustomerContext && this.getCustomerContext.Balances && this.getCustomerContext.Balances.find(b => b.Key === 'CREDIT')
      },
      totalBalance () {
        return (this.balances && this.balances.Amount) || 0
      },
      tradingBalance () {
        return this.balances && this.balances.Trading
      },
      lockedFunds () {
        return this.balances && this.balances.Locked
      },
      promoBalance () {
        return this.balances && this.balances.Promo
      },
      withdrawalBalance () {
        return this.balances && this.balances.Withdrawal
      },
      accountSummaryFlow () {
        return window.ctsautoconf.ACCOUNT_SUMMARY_FLOW || false
      }
    },

    methods: {

    }
  }
</script>

<style lang="stylus" scoped>
  @import '~@/css/config'
  @import '~@/css/mixins'
  .playbalance
    cursor default
    display flex
    flex 1
    flex-direction column
    user-select none
    .v-icon
      color #1f375b
      padding-left: 5px
      font-size: 30px
    .label
      flex 20
      font-family 'Open Sans SemiBold'
    .val
      font-family 'Open Sans SemiBold'
    .acc-number
      display flex
      .val
        margin-left 5px
        font-family 'Open Sans SemiBold'
    .total-balance
      display flex
      font-family 'Open Sans SemiBold'
      margin-top 5px
      font-size 20px
      border-radius 0px
      padding: 10px
      background: #0b4da1
      color #fff
      justify-content space-between
      align-items: center
      @media mobile-big-and-below
        font-size 16px
      .val
        margin-left 5px
    .trading-balance,
    .locked-funds
      border-width 0px 1px 1px 1px
      border-style solid 
      border-color #dbdce0
    .trading-balance-header,
    .locked-funds-header
      display flex
      padding: 7px 10px
      font-family 'Open Sans SemiBold'
      font-size 17px
      justify-content space-between
      cursor pointer
      background #f2f2f2
      align-items: center
      @media mobile-big-and-below
        font-size 16px
    .deposits-balance,
    .withdrawal-balance,
    .promo-balance
      display flex
      font-size 14px
      padding: 5px 10px
      justify-content space-between
      cursor pointer
    .withdrawal-balance,
    .promo-balance
      padding-left 20px
      position relative
      &:before
        content ''
        width 5px
        height 5px
        background #1f375b
        border-radius 50%
        position absolute 
        left 10px
        top 15px
    .balance-info
      font-size 12px
      &.lockedfunds,
      &.tradingbalance
        margin-left 10px
        padding 5px 5px 5px 0
      &.withdrawalbalance
        margin-left 20px
        padding-bottom 5px
  .trading-balance-header
  .locked-funds-header
  .total-balance
    .label 
      line-height 18px

</style>
