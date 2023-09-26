<template>
  <div class="responsible-gaming-history" v-if="isLoggedIn">
    <h1 v-if="!accountSummaryFlow">>{{ $t('Account.ResponsibleGamingHistory') }}</h1>
    <div class="caca">
      <div :class="['responsible-gaming-filter datefilter', { 'active': filterExpanded}]" @click="toggleFilter()">
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
          <v-btn x-large @click.stop="fetchHistory()"><span>{{ $t('Account.TransactionHistory.Apply') }}</span></v-btn>
        </div>
      </div>
      <!--Standard account tempalte -->
      <div v-if="!accountSummaryFlow && noOfPages > 0" class="select-page">
        <v-btn :disabled="page === 0" @click.stop="fetchHistory('minus')">{{ $t('Account.TransactionHistory.History.Previous') }}</v-btn>
        <v-btn :disabled="page === noOfPages" @click.stop="fetchHistory('plus')">{{ $t('Account.TransactionHistory.History.Next') }}</v-btn>
      </div>
    </div>
    <div class="loading" v-if="loader">
      <dots-loader></dots-loader>
    </div>
    <div v-if="!loader" class="caca">
      <div v-if="accountSummaryFlow && noOfPages > 0" class="select-page">
        <v-btn :disabled="page === 0" @click.stop="fetchHistory('minus')">{{ $t('Account.TransactionHistory.History.Previous') }}</v-btn>
        <v-btn :disabled="page === noOfPages" @click.stop="fetchHistory('plus')">{{ $t('Account.TransactionHistory.History.Next') }}</v-btn>
      </div>
      <div class="txn">
        <div v-for="(item, index) in items" :key="index" class="txn__tx">
          <div class="txn__tx__header">
            <div class="txn__tx__header__name">{{item.name}}</div>
            <div class="txn__tx__header__date">
              <span>{{item.cdate | moment('MM/DD/YYYY')}}</span>
              <span>{{item.cdate | moment(dateFormats.longTime)}}</span>
            </div>
          </div>
          <div class="txn__tx__body">
            <div class="txn__tx__body__curr">
              <div class="txn__tx__body__txt" v-if="item.status==='PENDING'">{{ $t('Account.ResponsibleGamingHistory.NewValue') }}:</div>
              <div class="txn__tx__body__txt" v-else>{{ $t('Account.ResponsibleGamingHistory.CurrentValue') }}:</div>
              <div class="txn__tx__body__curr__amt" v-if="item.unit === 'AMOUNT'">
                <span v-if="item.value">{{noDecimalsFormat(item.value)}}</span>
                <span v-else>{{'-'}}</span>
              </div>
              <div class="txn__tx__body__curr__min" v-if="item.unit === 'MINUTES'">
                <div v-if="item.name === 'Session Time Limit'">
                  <span>{{(item.value) || '-'}}</span>
                  <span v-if="item.value && item.value === 1">{{ $t('Account.ResponsibleGamingHistory.Minute') }}</span>
                  <span v-if="item.value && item.value !== 1">{{ $t('Account.ResponsibleGamingHistory.Minutes') }}</span>
                </div>
                <div v-else>
                  <span>{{(item.value / 60) || '-'}}</span>
                  <span v-if="item.value && item.value / 60 === 1">{{ $t('Account.ResponsibleGamingHistory.Hour') }}</span>
                  <span v-if="item.value && item.value / 60 !== 1">{{ $t('Account.ResponsibleGamingHistory.Hours') }}</span>
                </div>
              </div>
            </div>
            <div class="txn__tx__body__prev">
              <div class="txn__tx__body__txt" v-if="item.status==='PENDING'">{{ $t('Account.ResponsibleGamingHistory.CurrentValue') }}:</div>
              <div class="txn__tx__body__txt" v-else>{{ $t('Account.ResponsibleGamingHistory.PreviousValue') }}:</div>
              <div class="txn__tx__body__prev__amt" v-if="item.unit === 'AMOUNT'">
                <span v-if="item.pvalue">{{noDecimalsFormat(item.pvalue)}}</span>
                <span v-else>{{'-'}}</span>
              </div>
              <div class="txn__tx__body__prev__min" v-if="item.unit === 'MINUTES'">
                <div v-if="item.name === 'Session Time Limit'">
                  <span>{{(item.pvalue) || '-'}}</span>
                  <span v-if="item.pvalue && item.pvalue === 1">{{ $t('Account.ResponsibleGamingHistory.Minute') }}</span>
                  <span v-if="item.pvalue && item.pvalue !== 1">{{ $t('Account.ResponsibleGamingHistory.Minutes') }}</span>
                </div>
                <div v-else>
                  <span>{{(item.pvalue / 60) || '-'}}</span>
                  <span v-if="item.pvalue && item.pvalue / 60 === 1">{{ $t('Account.ResponsibleGamingHistory.Hour') }}</span>
                  <span v-if="item.pvalue && item.pvalue / 60 !== 1">{{ $t('Account.ResponsibleGamingHistory.Hours') }}</span>
                </div>
              </div>
            </div>
            <div class="txn__tx__body__type">
              <div class="txn__tx__body__txt">{{ $t('Account.ResponsibleGamingHistory.Type') }}:</div>
              <span v-if="item.status">{{item.status}}</span>
              <span v-else>{{'-'}}</span>
            </div>
            <div class="txn__tx__body__due">
              <div class="txn__tx__body__txt">{{ $t('Account.ResponsibleGamingHistory.DueDate') }}:</div>
              <div class="txn__tx__body__due__date" v-if="item.duedate">
                <div>{{item.duedate | moment('MM/DD/YYYY')}}</div>
                <div>{{item.duedate | moment(dateFormats.longTime)}}</div>
              </div>
              <div v-else>{{'-'}}</div>
            </div>
          </div>
        </div>
        <div class="no-data" v-if="!items || items.length === 0">{{ $t('Account.Table.NoData') }}</div>
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
    mixins: [
    ],
    data: () => ({
      filterExpanded: false,
      dateFrom: new Date(new Date() - (7 * 24 * 60 * 60 * 1000)),
      dateTo: new Date(),
      dateMaxValue: new Date().toISOString(),
      calendarDateFrom: true,
      calendarDateTo: false,
      items: undefined,
      loader: false,
      pageField: 0,
      noOfPages: 0,
      dateFrom4PendingTransactions: new Date(new Date() - (7 * 24 * 60 * 60 * 1000)),
      dateTo4PendingTransactions: new Date()
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
      accountSummaryFlow: () => window.ctsautoconf.ACCOUNT_SUMMARY_FLOW || false,
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
      async fetchHistory (param) {
        this.resolvePage(param)
        this.loader = true
        try {
          let response = await lib.rpcService.callBroker('playshot', 'getresponsiblegaminghistory', {
            'querySize': '10',
            'queryPage': this.page,
            'dateFrom': moment(this.dateFrom).format('YYYY-MM-DD'),
            'dateTo': moment(this.setTomorrowDate(this.dateTo)).format('YYYY-MM-DD')
          })
          if (response && response.result) {
            this.loader = false
            this.noOfPages = response.result.pages
            this.items = response.result.items
            this.filterExpanded = false
          }
        } catch (exception) {
          console.log(exception)
        } finally {
          this.loader = false
        }
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
      noDecimalsFormat: val => val ? `$${parseInt(val).toLocaleString('en-US')}` : null
    },
    mounted () {
      this.fetchHistory()
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
    .responsible-gaming-filter
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
        font-family: "Open Sans Bold"
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
            font-family: "Open Sans Bold"
            font-size 10px
          .date_from_to
            font-family: "Open Sans Bold"
      .apply
        text-align center
    .select-page
      text-align center
    .txn__tx
      border 1px solid #dbdce0
      margin-bottom 5px
      .txn__tx__header
        display flex
        background #0b4da1
        color #fff
        .txn__tx__header__name
          padding 11px
          font-size 16px
          font-family: "Open Sans Bold"
          justify-content flex-start
          flex 1
        .txn__tx__header__date
          display flex
          align-items center
          justify-content flex-end
          padding-right 11px
          span
            &:first-child
              margin-right 8px
      .txn__tx__body
        display grid
        grid-template-columns repeat(4, minmax(0, 1fr))
        grid-gap 7px
        padding 7px
        @media mobile-big-and-below
          grid-template-columns repeat(2, minmax(0, 1fr))
        > div
          border 1px solid #dbdce0
          border-radius 3px
          padding 5px
          text-align center
          line-height 18px
          font-family: "Open Sans Bold"
        .txn__tx__body__txt
          font-weight normal
        .txn__tx__body__due__date
          display flex
          justify-content space-evenly
          
</style>
