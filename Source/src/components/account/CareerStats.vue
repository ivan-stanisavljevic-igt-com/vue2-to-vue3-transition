<template>
  <div class="page-content account">
    <div class="career-stats ctsform" v-if="isLoggedIn">
      <h1 v-if="!accountSummaryFlow">{{ $t('Account.CareerStats') }}</h1>
      <div class="car-sts-cointainer">
        <span class="car-sts-info">{{ $t('Account.CareerStats.Info') }}</span>
        <div class="caca">
          <div class="cld total">
            <span class="type">{{ $t('Account.CareerStats.Total') }}</span>
            <span class="amount">{{ total | currency }}</span>
          </div>
          <div class="cld winnings">
            <span class="type">{{ $t('Account.CareerStats.Winnings') }}</span>
            <span class="amount">{{ winnings | currency}}</span>
          </div>
          <div class="cld bets">
            <span class="type">{{ $t('Account.CareerStats.Bets') }}</span>
            <span class="amount">{{ bets | currency}}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import store from '@/store'
  export default {
    mixins: [
    ],
    components: {
    },
    data () {
      return {
      }
    },
    computed: {
      accountSummaryFlow () {
        return window.ctsautoconf.ACCOUNT_SUMMARY_FLOW || false
      },
      isLoggedIn () {
        return store.getters['isLoggedIn']
      },
      getCustomerContext () {
        return store.getters['getCustomerContext']
      },
      balances () {
        return this.getCustomerContext && this.getCustomerContext.Balances && this.getCustomerContext.Balances.find(b => b.Key === 'CREDIT')
      },
      bets () {
        return this.balances && this.balances.Bets
      },
      winnings () {
        return this.balances && this.balances.Winnings
      },
      total () {
        return this.balances && this.balances.Total
      }
    },
    methods: {
    },
    mounted () {
    }
  }
</script>

<style lang="stylus" scoped>
@import '~@/css/config'
@import '~@/css/mixins'

.page-content.account
  .career-stats.ctsform
    width 100%
    .car-sts-cointainer
      margin 5px
      border 1px solid #dbdce0
      padding 10px
      border-radius 0px
      cursor default
      .car-sts-info
        margin 5px 0
        display flex
      .caca
        margin-top 3px
        .cld
          display flex
          padding 8px 2px
          &:nth-child(odd)
            background #f2f2f2
          &.total
            font-weight bold
            font-size 16px
          .type
            flex-grow 30
</style>