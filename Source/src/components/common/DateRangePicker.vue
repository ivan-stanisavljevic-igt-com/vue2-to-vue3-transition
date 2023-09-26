<template>
  <div class="txfilter" :class="{'expanded': filter.expanded === true}">
    <div class="finwrap">
      <div class="finfo clickable" @click="toggleFilter()">
        <span><span>{{ infoText }}</span> <br><span class="date_range">{{new Date(filter.df) | moment(dateFormats.shortDate)}} to {{new Date(filter.dt) | moment(dateFormats.shortDate)}}</span></span>
        <span class="filterhint"><span class="word"><span>{{ $t('Account.TransactionHistory.Filter') }}</span></span><span class="pd-icon pd-icon-calendar"></span></span>
      </div>
      <div class="fpanel" :class="{'dn': filter.expanded !== true}">
        <div class="fctrls">
          <div class="calendar">
            <div class="clndr-btnset">
              <div class="btnwrap"><button class="datebtn" :class="{ 'active': filter.visibleclndr === 'from' }" @click="selectPicker('from')"><span class="headhint">from</span><span class="date_from_to">{{ filter.dfstr | moment('ddd, MMM Do YYYY') }}</span></button></div>
              <div class="btnwrap"><button class="datebtn" :class="{ 'active': filter.visibleclndr === 'to' }" @click="selectPicker('to')"><span class="headhint">to</span><span class="date_from_to">{{ filter.dtstr | moment('ddd, MMM Do YYYY') }}</span></button></div>
            </div>
            <v-date-picker v-if="filter.dfstr !== null && filter.visibleclndr === 'from'" v-model="filter.dfstr" :show-current="filter.dtstr" :full-width="true" :no-title="true" :max="filter.dtstr" :event-color="calcPickerRangeDate" :events="calcPickerRangeDate"></v-date-picker>
            <v-date-picker v-if="filter.dtstr !== null && filter.visibleclndr === 'to'" v-model="filter.dtstr" :show-current="filter.dfstr" :full-width="true" :no-title="true" :min="filter.dfstr" :max="new Date() | moment('YYYY-MM-DD')" :event-color="calcPickerRangeDate" :events="calcPickerRangeDate"></v-date-picker>
          </div>
        </div>
        <div class="ctsform">
          <div class="form-actions">
            <button class="v-btn secondary-btn" @click="cancelFilter()">{{ $t('Account.TransactionHistory.Close') }}</button>
            <button class="v-btn primary-btn" @click="applyFilter()">{{ $t('Account.TransactionHistory.Apply') }}</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import config from '@/config'
import moment from 'moment'

export default {
  props: {
    infoText: { }
  },

  data () {
    return {
      filter: { stamp: 0, df: null, dt: null, dmax: null, dfstr: null, dtstr: null, pagesize: 10, pagenum: 0, expanded: false, visibleclndr: 'from' }
    }
  },

  computed: {
    dateFormats () {
      return config.app.dateFormats
    },

    getDateFrom () {
      return this.filter.df
    },

    getDateTo () {
      return this.filter.dt
    }
  },

  methods: {
    setDates ({ dateFrom, dateTo, dateMax }) {
      if (dateFrom) {
        this.filter.df = dateFrom
      }
      if (dateTo) {
        this.filter.dt = dateTo
      }
      if (dateMax) {
        this.filter.dmax = dateMax
      }
    },

    setRangeToLast (amount, unit) {
      if (unit === 'days' || unit === 'day') {
        this.setRangeToLastNDays(amount)
      } else if (unit === 'months' || unit === 'month') {
        this.setRangeToLastNMonths(amount)
      } else if (unit === 'years' || unit === 'year') {
        this.setRangeToLastNYears(amount)
      } else {
        throw new Error('unknown unit type when setting date range')
      }
    },

    setRangeToLastNDays (days) {
      this.setDates({
        dateTo: moment().toDate(), // now
        dateMax: moment().toDate(), // now
        dateFrom: moment().subtract(days, 'days').toDate()
      })
    },
    setRangeToLastNMonths (months) {
      this.setDates({
        dateTo: moment().toDate(), // now
        dateMax: moment().toDate(), // now
        dateFrom: moment().subtract(months, 'months').toDate()
      })
    },
    setRangeToLastNYears (years) {
      this.setDates({
        dateTo: moment().toDate(), // now
        dateMax: moment().toDate(), // now
        dateFrom: moment().subtract(years, 'years').toDate()
      })
    },
    resetFilters () {
      this.filter.dt = this.filter.dt !== null ? this.filter.dt : new Date().getTime()
      this.filter.df = this.filter.df !== null ? this.filter.df : (this.filter.dt - (7 * 24 * 60 * 60 * 1000))

      let dMax = new Date().getTime() + (24 * 60 * 60 * 1000)
      this.filter.dmax = dMax

      this.filter.dfstr = null
      this.filter.dtstr = null
      this.filter.visibleclndr = 'from'
    },

    toggleFilter () {
      if (this.filter.expanded) {
        this.cancelFilter()
      } else {
        this.openFilter()
      }
    },

    openFilter () {
      let f = this.filter.df && this.filter.df > 0 ? new Date(this.filter.df) : new Date()
      let t = this.filter.dt && this.filter.dt > 0 ? new Date(this.filter.dt) : new Date()
      let autoZero = function (val) {
        return val < 10 ? '0' + val : val
      }
      this.filter.dfstr = f.getFullYear() + '-' + autoZero(f.getMonth() + 1) + '-' + autoZero(f.getDate())
      this.filter.dtstr = t.getFullYear() + '-' + autoZero(t.getMonth() + 1) + '-' + autoZero(t.getDate())

      this.filter.expanded = true
    },

    applyFilter () {
      let dF = this.filter.df && this.filter.df > 0 ? new Date(this.filter.df) : new Date((new Date()).getTime() - (7 * 24 * 60 * 60 * 1000))
      let dT = this.filter.dt && this.filter.dt > 0 ? new Date(this.filter.dt) : new Date()

      let drFroms = this.filter.dfstr !== null && this.filter.dfstr.length > 0 ? this.filter.dfstr.split('-') : []
      let drTos = this.filter.dtstr !== null && this.filter.dtstr.length > 0 ? this.filter.dtstr.split('-') : []

      if (drFroms.length === 3 && drTos.length === 3) {
        dF = new Date(drFroms[0], parseInt(drFroms[1] - 1), drFroms[2], 0, 0, 1)
        dT = new Date(drTos[0], parseInt(drTos[1] - 1), drTos[2], 23, 59, 59)
      }

      this.filter.df = dF.getTime()
      this.filter.dt = dT.getTime()
      this.filter.expanded = false
      this.resetFilters()

      // emit selected range in format YYYY-MM-DD
      const dateFrom = moment(this.filter.df).format('YYYY-MM-DD')
      const dateTo = moment(this.filter.dt).format('YYYY-MM-DD')
      this.$emit('apply', {
        dateFrom,
        dateTo
      })
    },

    cancelFilter () {
      this.filter.expanded = false
      this.filter.dfstr = null
      this.filter.dtstr = null
    },

    selectPicker (picker) {
      if (['from', 'to'].includes(picker)) {
        this.filter.visibleclndr = picker
      }
    },

    calcPickerRangeDate (date) {
      let dF = null
      if (this.filter.dfstr !== null && this.filter.dfstr.split('-').length === 3) {
        let fs = this.filter.dfstr.split('-')
        dF = new Date(fs[0], parseInt(fs[1] - 1), fs[2], 0, 0, 1)
      }

      let dT = null
      if (this.filter.dtstr !== null && this.filter.dtstr.split('-').length === 3) {
        let ts = this.filter.dtstr.split('-')
        dT = new Date(ts[0], parseInt(ts[1] - 1), ts[2], 23, 59, 59)
      }

      const [dY, dM, dD] = date.split('-')
      let d = new Date(dY, parseInt(dM) - 1, dD)
      if (d && dF !== null && dT !== null) {
        if (dF.getFullYear() === dT.getFullYear() && dF.getMonth() === dT.getMonth() && dF.getDate() === dT.getDate()) {
          return false
        } else if (d.getFullYear() === dF.getFullYear() && d.getMonth() === dF.getMonth() && d.getDate() === dF.getDate()) {
          return 'range-start'
        } else if (d.getFullYear() === dT.getFullYear() && d.getMonth() === dT.getMonth() && d.getDate() === dT.getDate()) {
          return 'range-end'
        } else if (d.getTime() > dF.getTime() && d.getTime() < dT.getTime()) {
          return 'range-in'
        }
      }

      return false
    }
  }
}
</script>


<style lang="stylus" scoped>
  @import '~@/css/config';
  @import '~@/css/mixins';

  .txfilter,
  .txlist { }

  .txfilter .finwrap { display:block; clear: both; background: #fff; border: solid 1px #efefef; border-radius:5px; padding:5px; }
  .txfilter + .txlist,
  .txfilter + .txmsgblock { margin-top:10px; }

  .txfilter .finfo {}
  .txfilter .finfo .filterhint { display:flex; align-items: center;font-size:12px; line-height:inherit; text-transform:uppercase; color:#1f375b; overflow:visible; }
  .txfilter .finfo .filterhint .pd-icon { padding-left: 5px; }
  .txfilter .finfo .filterhint .word { display: inline-block; width:45px; overflow:visible; text-align:right; }
  .txfilter .fpanel { margin-top:5px; padding-bottom: 5px; }
  .txfilter .fctrls { border-top: solid 1px #ddd; padding:10px 0 5px; }
  .txfilter .fctrls .calendar { width:400px; max-width:90%; margin: 0 auto; }

  .txfilter .fctrls .calendar
    @media mobile-big-and-below
      max-width 100%

  .txfilter.expanded .finfo .filterhint { color:#2a77aa; }

  .txlist .tx { display:block; clear: both; overflow: hidden; }
  .txlist .tx + .tx {  margin-top:20px; }
  .txlist .txline { display:block; clear:both; }
  .txlist .txline.padded { padding: 7px; }
  .txlist .txline.txhead { background-color: #051e41; color: #fff; display:table; width:100%; }
  .txlist .txline + .txline { border-top: solid 1px #ddd; }
  .txlist .txline .txcell { display:inline-block; }

  .txlist .txh-ids,
  .txlist .txh-times { display: table-cell; width: 50%; vertical-align:top; }
  .txlist .txh-times { text-align:right }

  .txlist .txh-id { white-space:nowrap; display:inline-block; }
  .txlist .txh-id.main { font-weight:bold; margin-right: 10px; }

  .txlist .txlbl { display:block; font-size:10px; line-height:10px; text-transform:uppercase; position:relative; top:-3px; color:#999; }
  .txlist .tar { text-align:right; }

  .txlist .third { width:33%; display:inline-block; box-sizing:border-box; }
  .txlist .third.first { clear:left; }
  .txlist .third.last { width:33.5%; }
  .txlist .third.x2 { width:66%; }
  .txlist .third.x2.last { width:66.5%; }

  .clndr-btnset { width:100%; display:table; }
  .clndr-btnset .btnwrap { display:table-cell; padding:0 5px; width:50%; }
  .clndr-btnset .btnwrap:first-child { padding-left:0; }
  .clndr-btnset .btnwrap:last-child { padding-right:0; }

  .clndr-btnset .datebtn {
    background-color: #fff; color: #111; font-weight: 600; line-height:20px; text-align:left; padding: 5px 6px 5px 12px; margin: 0 auto;
    border-radius: 2px;
    display: block; width:100%;
    box-sizing: border-box;
    border: 1px solid #f5f5f5;
    outline:none !important;
  }
  .clndr-btnset .datebtn.active { border-color: #2a77aa; }
  .clndr-btnset .datebtn.active .headhint { color: #2a77aa; }
  .clndr-btnset .datebtn .headhint { display:block; font-size:10px; line-height:20px; text-transform:uppercase; position:relative; bottom:0px; }

  .txmsgblock { padding:5px; text-align:center; }
  .txmsgblock .loading { margin: 0; text-align:center; }
  .txmsgblock .loading .spinner { margin: 0 auto; }

  @media desktop-and-above {
    .clickable { cursor:pointer; }
    .txlist .tx:hover { border-color:#004C97; }
  }
  .primary-btn:disabled { opacity: .2 }

  .dn { display:none; }
  .vb { visibility:hidden; }
  .clearafter:after { visibility: hidden; display: block; font-size: 0; content: " "; clear: both; height: 0; }
  .date_range
    font-weight 600
  .finfo
    &.clickable
      display flex
      align-items center
      justify-content space-between
  .date_from_to
    line-height 15px
  .txtable
    td, th
      text-align center
      vertical-align middle
      line-height 15px
    th
      background #2396fc
      color #fff
    tr
      border-bottom solid 1px #efefef
    tr:nth-child(odd)
      background #f5f5f5
    @media mobile-big-and-below
      font-size 12px
      td
        padding 5px 3px
td:last-child
  @media mobile-big-and-below
    display none
th:last-child
  @media mobile-big-and-below
    display none

</style>
