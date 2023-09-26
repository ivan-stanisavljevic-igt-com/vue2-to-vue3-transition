<template>
  <div class="transactions-history" v-if="isLoggedIn">
    <div class="transactions-history-page">
      <!-- Account summary tempalte -->
      <template v-if="accountSummaryFlow">
        <h1 v-if="!mobileBigAndBelow">{{ $t('Account.TransactionHistory.TransactionHistory') }}</h1>
        <div v-if="mobileBigAndBelow" class="account-heading"><icon name="icon-tx-history"></icon>{{ $t('Account.TransactionHistory.TransactionHistory') }}</div>
      </template>
      <!-- Account standard tempalte -->
      <template v-if="!accountSummaryFlow">
        <h1>{{ $t('Account.TransactionHistory.TransactionHistory') }}</h1>
      </template>
      <div class="loading" v-if="loader">
        <dots-loader></dots-loader>
      </div>
      <div v-if="!loader" class="caca">
        <div :class="['transactions-filter datefilter', { 'active': filterExpanded}]" @click="toggleFilter()">
          <div>
            <div class="date_range_text">{{ $t('Account.TransactionHistory.History') }}</div>
            <div class="date_range">{{dateFrom | moment('MM/DD/YYYY')}} {{ $t('Account.TransactionHistory.History.To') }} {{dateTo | moment('MM/DD/YYYY')}}</div>
          </div>
          <div class="filter">{{ $t('Account.TransactionHistory.Filter') }}</div>
        </div>
        <div class="calendar-container" v-if="filterExpanded">
          <div class="calendar-buttons">
            <div class="btn-date" :class="{ 'active': calendarDateFrom }" @click="showCalendarDateFrom()">
              <div class="headhint">{{ $t('Account.TransactionHistory.History.DateFrom') }}</div>
              <div class="date_from_to">{{ dateFrom | moment('ddd, MMM Do YYYY') }}</div>
            </div>
            <div class="btn-date" :class="{ 'active': calendarDateTo }" @click="showCalendarDateTo()">
              <div class="headhint">{{ $t('Account.TransactionHistory.History.To') }}</div>
              <div class="date_from_to">{{ dateTo | moment('ddd, MMM Do YYYY') }}</div>
            </div>
          </div>
          <div class="calendar">
            <v-date-picker v-if="calendarDateFrom" v-model="dateFromCAFormat" :max="dateToCAFormat" :full-width="true" :no-title="true"></v-date-picker>
            <v-date-picker v-if="calendarDateTo" v-model="dateToCAFormat" :min="dateFromCAFormat" :max="dateMaxValue" :full-width="true" :no-title="true"></v-date-picker>
          </div>
          <div class="apply">
            <v-btn v-if="brandKey === 'circa'" class="btn-white" x-large @click.stop="cancelFilter()"><span>{{ $t('Account.TransactionHistory.Cancel') }}</span></v-btn>
            <v-btn x-large @click.stop="fetchHistoryTransactions()"><span>{{ $t('Account.TransactionHistory.Apply') }}</span></v-btn>
          </div>
        </div>
        <div class="select-page" v-if="!accountSummaryFlow && noOfPages > 1">
          <v-btn :disabled="page === 0" @click.stop="fetchHistoryTransactions('minus')">{{ $t('Account.TransactionHistory.History.Previous') }}</v-btn>
          <v-btn :disabled="page === noOfPages - 1" @click.stop="fetchHistoryTransactions('plus')">{{ $t('Account.TransactionHistory.History.Next') }}</v-btn>
        </div>
        <div class="txtable-wrapper">
          <table v-if="!loader" class="txtable">
            <tr class="tablehead" v-if="!isMobile">
              <th>{{ $t('Account.TransactionHistory.History.Date') }}</th>
              <th>{{ $t('Account.TransactionHistory.History.Name') }}</th>
              <th>{{ $t('Account.TransactionHistory.History.DebitAmount') }}</th>
              <th>{{ $t('Account.TransactionHistory.History.CreditAmount') }}</th>
              <th>{{ $t('Account.TransactionHistory.History.CurrentBalance') }}</th>
              <th v-if="shouldDisplayPromoBalance">{{ $t('Account.TransactionHistory.History.PromoBalance') }}</th>
              <th>{{ $t('Account.TransactionHistory.History.Reference') }}</th>
            </tr>
            <tr class="tablehead" v-if="isMobile">
              <th>{{ $t('Account.TransactionHistory.History.Date') }}</th>
              <th v-if="!isAnyReference">{{ $t('Account.TransactionHistory.History.Name') }}</th>
              <th v-if="isAnyReference">
                <div>{{ $t('Account.TransactionHistory.History.Name') }} /</div>
                <div>{{ $t('Account.TransactionHistory.History.Reference') }}</div>
              </th>
              <th>{{ $t('Account.TransactionHistory.History.Mobile.DebitCredit') }}</th>
              <th>
                <span>{{ $t('Account.TransactionHistory.History.CurrentBalance') }}</span>
                <span v-if="shouldDisplayPromoBalance">{{ '/' }}</span>
                <div v-if="shouldDisplayPromoBalance">{{ $t('Account.TransactionHistory.History.PromoBalance') }}</div>
              </th>
            </tr>
            <tr v-for="(transaction, index) in transactions" :key="index" class="transactions-body" v-if="!isMobile">
              <td>
                <div>{{transaction.TransactionTime | moment('MM/DD/YYYY')}}</div>
                <div>{{transaction.TransactionTime | moment(dateFormats.longTime)}}</div>
              </td>
              <td>{{transaction.TransactionName}}</td>
              <td>{{transaction.AmountDebit ? '-' : ''}}{{transaction.AmountDebit | currency}}</td>
              <td>{{transaction.AmountCredit | currency}}</td>
              <td>{{transaction.Balance | currency}}</td>
              <th v-if="shouldDisplayPromoBalance" class="txtable__promo">{{ (transaction.PromoAmount || 0) | currency}}</th>
              <td :class="[{'no-reference': !isAnyReference}]">
                {{transaction.Reference || '-'}}
              </td>
            </tr>
            <tr v-for="(transaction, index) in transactions" :key="index" class="transactions-body" v-if="isMobile">
              <td>
                <div>{{transaction.TransactionTime | moment('MM/DD/YYYY')}}</div>
                <div>{{transaction.TransactionTime | moment(dateFormats.longTime)}}</div>
              </td>
              <td>
                <div>{{transaction.TransactionName}}</div>
                <div v-if="isAnyReference">{{transaction.Reference}}</div>
              </td>
              <td v-if="isMobile">
                <div>{{transaction.AmountDebit ? '-' : ''}}{{transaction.AmountDebit | currency}}</div>
                <div>{{transaction.AmountCredit | currency}}</div>
              </td>
              <td>
                <div>{{transaction.Balance | currency}}</div>
                <div v-if="shouldDisplayPromoBalance" class="txtable__promo">{{ (transaction.PromoAmount || 0) | currency}}</div>
              </td>
            </tr>
          </table>
          <div class="no-data" v-if="!transactions || transactions.length === 0">{{ $t('Account.Table.NoData') }}</div>
        </div>
         <div class="select-page" v-if="accountSummaryFlow && noOfPages > 1">
          <v-btn :disabled="page === 0" @click.stop="fetchHistoryTransactions('minus')">{{ $t('Account.TransactionHistory.History.Previous') }}</v-btn>
          <v-btn :disabled="page === noOfPages - 1" @click.stop="fetchHistoryTransactions('plus')">{{ $t('Account.TransactionHistory.History.Next') }}</v-btn>
        </div>
      </div>
    </div>
    <div class="responsible-gaming-page" v-if="accountSummaryFlow">
      <span @click="responsibleGaming">{{ $t('Account.ResponsibleGaming') }}</span>
    </div>
  </div>
</template>

<script>
  import store from '@/store'
  import Datepicker from 'vuejs-datepicker'
  import lib from '@/library'
  import dotsLoader from '@/components/common/DotsLoader'
  import Branding from '@/components/mixins/Branding'
  import Icon from '@/components/common/Icon'
  import Screen from '@/components/mixins/Screen'
  import moment from 'moment'
  import config from '@/config'
  export default {
    components: {
      Datepicker,
      dotsLoader,
      Icon
    },

    mixins: [
      Branding,
      Screen
    ],

    data: () => ({
      filterExpanded: false,
      dateFrom: new Date(new Date() - (7 * 24 * 60 * 60 * 1000)),
      dateTo: new Date(),
      dateMaxValue: new Date().toISOString(),
      calendarDateFrom: true,
      calendarDateTo: false,
      transactions: undefined,
      loader: false,
      loaderPendingTransactions: false,
      pageField: 0,
      noOfPages: 0,
      filterExpanded4PendingTransactions: false,
      dateFrom4PendingTransactions: new Date(new Date() - (7 * 24 * 60 * 60 * 1000)),
      dateTo4PendingTransactions: new Date(),
      calendarDateFrom4PendingTransactions: true,
      calendarDateTo4PendingTransactions: false,
      pendingTransactions: undefined,
      amounts2BeDisplayed: config.app.autoconf.TRANSACTION_HISTORY_AMOUNTS
    }),

    computed: {
      isLoggedIn () {
        return store.getters['isLoggedIn']
      },
      page: {
        get () {
          return this.pageField
        },
        set (value) {
          this.pageField = value
        }
      },
      dateFromCAFormat: {
        get () {
          return this.dateFrom.toLocaleDateString('en-CA') // YYYY-MM-DD
        },
        set (value) {
          this.dateFrom = new Date(value)
        }
      },
      dateToCAFormat: {
        get () {
          return this.dateTo.toLocaleDateString('en-CA') // YYYY-MM-DD
        },
        set (value) {
          this.dateTo = new Date(value)
        }
      },
      isAnyReference () {
        return this.transactions && this.transactions.find(t => t.Reference)
      },
      isMobile () {
        return store.getters['screenState/getMobileBigAndBelow']
      },
      accountSummaryFlow () {
        return window.ctsautoconf.ACCOUNT_SUMMARY_FLOW || false
      },
      shouldDisplayPromoBalance () {
        return this.amounts2BeDisplayed && this.amounts2BeDisplayed.includes('PromoBalance')
      },
      dateFormats () {
        return config.app.dateFormats
      }
    },

    methods: {
      toggleFilter () {
        this.filterExpanded = !this.filterExpanded
      },
      cancelFilter () {
        this.filterExpanded = false
        this.dateFrom = new Date(new Date() - (7 * 24 * 60 * 60 * 1000))
        this.dateTo = new Date()
      },
      showCalendarDateFrom () {
        this.calendarDateFrom = true
        this.calendarDateTo = false
      },
      showCalendarDateTo () {
        this.calendarDateFrom = false
        this.calendarDateTo = true
      },
      fetchHistoryTransactions (param) {
        this.resolvePage(param)
        this.loader = true
        lib.rpcService.callBroker('playshot', 'gethistorytransactions', {
          'size': '10',
          'page': this.page,
          'queryFrom': moment(this.dateFrom).format('YYYY-MM-DD'),
          'queryTo': moment(this.setTomorrowDate(this.dateTo)).format('YYYY-MM-DD')
        }).then(response => {
          if (response && response.result) {
            this.loader = false
            this.noOfPages = response.result.Pages
            this.transactions = response.result.List
            this.filterExpanded = false
            // this.transactions.forEach(e => {
            //   delete e.Reference
            // })
          }
        }).catch(error => {
          this.loader = false
          console.log(error)
        })
      },
      resolvePage (param) {
        switch (param) {
          case 'plus':
            this.page++
            break
          case 'minus':
            this.page--
            break
        }
      },
      setTomorrowDate (date) {
        const today = new Date(date)
        const tomorrow = new Date(today)
        return new Date(tomorrow.setDate(tomorrow.getDate() + 1))
      },
      toggleFilter4PendingTransactions () {
        this.filterExpanded4PendingTransactions = !this.filterExpanded4PendingTransactions
      },
      showCalendarDateFrom4PendingTransactions () {
        this.calendarDateFrom4PendingTransactions = true
        this.calendarDateTo4PendingTransactions = false
      },
      showCalendarDateTo4PendingTransactions () {
        this.calendarDateFrom4PendingTransactions = false
        this.calendarDateTo4PendingTransactions = true
      },
      async fetchHistory4PendingTransactions (param) {
        this.loaderPendingTransactions = true
        try {
          let response = await lib.rpcService.callBroker('playshot', 'getpendingtransactions', {
            'queryFrom': moment(this.dateFrom4PendingTransactions).format('YYYY-MM-DD'),
            'queryTo': moment(this.setTomorrowDate(this.dateTo4PendingTransactions)).format('YYYY-MM-DD')
          })
          if (response && response.result) {
            this.loaderPendingTransactions = false
            this.pendingTransactions = response.result
            this.filterExpanded4PendingTransactions = false
          }
        } catch (exception) {
          this.loaderPendingTransactions = false
          console.log(exception)
        }
      },
      async cancelPendingTransaction (transactionId) {
        try {
          let response = await lib.rpcService.callBroker('account', 'canceltransaction', {
            'IDMMSITXRequest': transactionId
          })
          if (response) {
            this.fetchHistory4PendingTransactions()
          }
          console.log(response)
        } catch (exception) {
          console.log(exception)
        }
      },
      responsibleGaming () {
        this.$router.push({path: '/account/responsible-gaming'})
      }
    },
    mounted () {
      this.fetchHistoryTransactions()
      // this.fetchHistory4PendingTransactions()
    }
  }
</script>

<style lang="stylus" scoped>
  @import '~@/css/config'
  @import '~@/css/mixins'
  .loading
    text-align center
  .caca
    user-select none
    text-size-adjust none
    .transactions-filter
      display flex
      background #fff
      border solid 1px #efefef
      border-radius 5px
      padding 5px
      justify-content space-between
      align-items center
      cursor pointer
      .filter
        text-transform uppercase
        font-weight bold
        color #000
      &.active
        border-bottom none
        border-bottom-left-radius 0
        border-bottom-right-radius 0
    .calendar-container
      border-left solid 1px #efefef
      border-right solid 1px #efefef
      border-bottom solid 1px #efefef
      border-bottom-left-radius 5px
      border-bottom-right-radius 5px
      padding 5px
      .calendar-buttons
        display flex
        justify-content center
        .btn-date
          flex 0.2
          margin 5px
          border 1px solid #efefef
          padding 5px
          border-radius 5px
          cursor pointer
          @media mobile-big-and-below
            flex 1
          &.active
            border 1px solid #2a77aa
          .headhint
            color #2a77aa
            text-transform uppercase
            font-weight  bold
            font-size 10px
          .date_from_to
            font-weight bold
      .apply
        text-align center
    .txtable
      th
        text-align center
        vertical-align middle
        line-height 15px
      tr
        border-bottom solid 1px white
        &:nth-child(odd)
          background #f5f5f5
      td
        text-align center
        vertical-align middle
        line-height 15px
        &.no-reference
          background #eeeeee
      &.pendingtr
        td
          @media mobile-big-and-below
            padding 0
    .select-page
      text-align center
.responsible-gaming-page
  text-decoration underline
.responsible-gaming-page:hover
  cursor pointer
.txtable__promo
  background-color unset
  font-weight normal

</style>
