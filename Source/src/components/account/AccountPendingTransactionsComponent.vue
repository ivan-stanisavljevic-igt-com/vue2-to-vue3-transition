<template>
  <div class="transactions-history" v-if="isLoggedIn">
    <h1 class="headline-pt" v-if="!accountSummaryFlow">{{ $t('Account.TransactionHistory.PendingTransactions') }}</h1>
    <div class="loading" v-if="loaderPendingTransactions">
      <dots-loader></dots-loader>
    </div>
    <div v-if="!loaderPendingTransactions" class="caca">
      <div :class="['transactions-filter datefilter', { 'active': filterExpanded4PendingTransactions}]" @click="toggleFilter4PendingTransactions()">
        <div>
          <div class="date_range_text">{{ $t('Account.TransactionHistory.History') }}</div>
          <div class="date_range">{{dateFrom4PendingTransactions | moment('MM/DD/YYYY')}} {{ $t('Account.TransactionHistory.History.To') }} {{dateTo4PendingTransactions | moment('MM/DD/YYYY')}}</div>
        </div>
        <div class="filter">{{ $t('Account.TransactionHistory.Filter') }}</div>
      </div>
      <div class="calendar-container" v-if="filterExpanded4PendingTransactions">
        <div class="calendar-buttons">
          <div class="btn-date" :class="{ 'active': calendarDateFrom4PendingTransactions }" @click="showCalendarDateFrom4PendingTransactions()">
            <div class="headhint">{{ $t('Account.TransactionHistory.History.DateFrom') }}</div>
            <div class="date_from_to">{{ dateFrom4PendingTransactions | moment('ddd, MMM Do YYYY') }}</div>
          </div>
          <div class="btn-date" :class="{ 'active': calendarDateTo4PendingTransactions }" @click="showCalendarDateTo4PendingTransactions()">
            <div class="headhint">{{ $t('Account.TransactionHistory.History.To') }}</div>
            <div class="date_from_to">{{ dateTo4PendingTransactions | moment('ddd, MMM Do YYYY') }}</div>
          </div>
        </div>
        <div class="calendar">
          <v-date-picker v-if="calendarDateFrom4PendingTransactions" v-model="dateFrom4PendingTransactionsISOFormat" :max="dateTo4PendingTransactionsISOFormat" :full-width="true" :no-title="true"></v-date-picker>
          <v-date-picker v-if="calendarDateTo4PendingTransactions" v-model="dateTo4PendingTransactionsISOFormat" :min="dateFrom4PendingTransactionsISOFormat" :max="dateMaxValue" :full-width="true" :no-title="true"></v-date-picker>
        </div>
        <div class="apply">
          <v-btn x-large @click.stop="fetchHistory4PendingTransactions()"><span>{{ $t('Account.TransactionHistory.Apply') }}</span></v-btn>
        </div>
      </div>
      <div class="txtable-wrapper">
        <table v-if="!loaderPendingTransactions" class="txtable pendingtr">
          <tr class="tablehead" v-if="!isMobile">
            <th>{{ $t('Account.TransactionHistory.History.Date') }}</th>
            <th>{{ $t('Account.TransactionHistory.History.Name') }}</th>
            <!-- <th>{{ $t('Account.TransactionHistory.TransactionType') }}</th>
            <th>{{ $t('Account.TransactionHistory.TransactionId') }}</th>
            <th>{{ $t('Account.TransactionHistory.Account') }}</th> -->
            <th>{{ $t('Account.TransactionHistory.OrderedAmount') }}</th>
            <th>{{ $t('Account.TransactionHistory.ChargesAmount') }}</th>
            <th>{{ $t('Account.TransactionHistory.AmountTransaction') }}</th>
            <th>{{ $t('Account.TransactionHistory.IsCancellable') }}</th>
          </tr>
          <tr class="tablehead" v-if="isMobile">
            <th>{{ $t('Account.TransactionHistory.History.Date') }}</th>
            <th>
              <div>{{ $t('Account.TransactionHistory.History.Name') }}</div>
              <!-- <div>{{ $t('Account.TransactionHistory.TransactionType') }} /</div>
              <div>{{ $t('Account.TransactionHistory.TransactionId') }}</div> -->
            </th>
            <!-- <th>{{ $t('Account.TransactionHistory.Account') }}</th> -->
            <th>
              <div>{{ $t('Account.TransactionHistory.OrderedAmount') }} /</div>
              <div>{{ $t('Account.TransactionHistory.ChargesAmount') }}</div>
            </th>
            <!-- <th>{{ $t('Account.TransactionHistory.AmountTransaction') }}</th> -->
            <th v-if="isAnyCancellable">{{ $t('Account.TransactionHistory.IsCancellable') }}</th>
          </tr>
          <tr v-for="(transaction, index) in pendingTransactions" :key="index" class="transactions-body" v-if="!isMobile">
            <td>
              <div>{{transaction.TransactionTime | moment('MM/DD/YYYY')}}</div>
              <div>{{transaction.TransactionTime | moment(dateFormats.longTime)}}</div>
            </td>
            <td>{{transaction.TransactionName}}</td>
            <!-- <td>{{transaction.TransactionType}}</td>
            <td>{{transaction.TransactionId}}</td>
            <td>{{transaction.Account}}</td> -->
            <td>{{transaction.OrderedAmount | currency}}</td>
            <td>{{transaction.ChargesAmount | currency}}</td>
            <td>{{transaction.AmountTransaction | currency}}</td>
            <td v-if="!transaction.IsCancellable">-</td>
            <td v-if="transaction.IsCancellable">
              <v-btn color="success" small @click.stop="cancelPendingTransaction(transaction.TransactionId)">{{ $t('Account.TransactionHistory.IsCancellable') }}</v-btn>
            </td>
          </tr>
          <tr v-for="(transaction, index) in pendingTransactions" :key="index" class="transactions-body" v-if="isMobile">

            <td>
              <div>{{transaction.TransactionTime | moment('MM/DD/YYYY')}}</div>
              <div>{{transaction.TransactionTime | moment(dateFormats.longTime)}}</div>
            </td>
            <td>
              <div>{{transaction.TransactionName}}</div>
              <!-- <div>{{transaction.TransactionType}}</div>
              <div>{{transaction.TransactionId}}</div> -->
            </td>
            <!-- <td>{{transaction.Account}}</td> -->
            <td>
              <div>{{transaction.OrderedAmount | currency}}</div>
              <div>{{transaction.ChargesAmount | currency}}</div>
            </td>
            <!-- <td>{{transaction.AmountTransaction | currency}}</td> -->
            <td v-if="transaction.IsCancellable" class="cancel-button-small">
              <v-btn color="success" x-small @click.stop="cancelPendingTransaction(transaction.TransactionId)">{{ $t('Account.TransactionHistory.IsCancellable') }}</v-btn>
            </td>
          </tr>
        </table>
        <div class="no-data" v-if="pendingTransactions && pendingTransactions.length === 0">{{ $t('Account.Table.NoData') }}</div>
      </div>
    </div>
  </div>
</template>

<script>
  import store from '@/store'
  import Datepicker from 'vuejs-datepicker'
  import lib from '@/library'
  import dotsLoader from '@/components/common/DotsLoader'
  import moment from 'moment'
  import config from '@/config'

  export default {
    components: {
      Datepicker,
      dotsLoader
    },

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
      pendingTransactions: undefined
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
      dateFromISOFormat: {
        get () {
          return this.dateFrom.toISOString().substring(0, 10)
        },
        set (value) {
          this.dateFrom = new Date(value)
        }
      },
      dateToISOFormat: {
        get () {
          return this.dateTo.toISOString().substring(0, 10)
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
      dateFrom4PendingTransactionsISOFormat: {
        get () {
          return this.dateFrom4PendingTransactions.toISOString().substring(0, 10)
        },
        set (value) {
          this.dateFrom4PendingTransactions = new Date(value)
        }
      },
      dateTo4PendingTransactionsISOFormat: {
        get () {
          return this.dateTo4PendingTransactions.toISOString().substring(0, 10)
        },
        set (value) {
          this.dateTo4PendingTransactions = new Date(value)
        }
      },
      isAnyCancellable () {
        return this.pendingTransactions && this.pendingTransactions.find(t => t.IsCancellable)
      },
      accountSummaryFlow () {
        return window.ctsautoconf.ACCOUNT_SUMMARY_FLOW || false
      },
      dateFormats () {
        return config.app.dateFormats
      }
    },

    methods: {
      toggleFilter () {
        this.filterExpanded = !this.filterExpanded
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
            store.dispatch('getCustomerContext')
          }
          console.log(response)
        } catch (exception) {
          console.log(exception)
        }
      }
    },
    mounted () {
      this.fetchHistoryTransactions()
      this.fetchHistory4PendingTransactions()
    }
  }
</script>

<style lang="stylus" scoped>
  @import '~@/css/config'
  @import '~@/css/mixins'
  .loading
    text-align center
  .headline-pt
    display block
    margin 20px 0 10px!important
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
</style>
