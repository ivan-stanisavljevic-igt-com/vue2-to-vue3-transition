<template>
  <div v-show="isLoggedIn">
    <!-- Account summary tempalte -->
    <template v-if="accountSummaryFlow">
      <h1 v-if="!mobileBigAndBelow">{{ $t('Account.W2G.Page.Title') }}</h1>
      <div v-if="mobileBigAndBelow" class="account-heading"><icon name="icon-w2g"></icon>{{ $t('Account.W2G.Page.Title') }}</div>
    </template>
    <!-- Account standard tempalte -->
    <template v-if="!accountSummaryFlow">
      <h1>{{ $t('Account.W2G.Page.Title') }}</h1>
    </template>
    <div class="w2g-page">
      <DateRangePicker
        ref="dateRangePicker"
        infoText="History from"
        @apply="onFilterApply"
        />

      <div v-if="isLoading" class="w2g-list-fetching-progress">
        <v-progress-circular indeterminate></v-progress-circular>
      </div>
      <div v-else>
        <div v-if="w2gTaxFormList.length > 0" class="txlist">
          <table class="txtable">
            <tr class="tablehead">
              <th>{{ $t('Account.W2G.Table.ColumnTitle.Seen') }}</th>
              <th>{{ $t('Account.W2G.Table.ColumnTitle.BetId') }}</th>
              <th>{{ $t('Account.W2G.Table.ColumnTitle.Created') }}</th>
              <th>{{ $t('Account.W2G.Table.ColumnTitle.Winnings') }}</th>
              <th class="mobile-only-hidden">{{ $t('Account.W2G.Table.ColumnTitle.FederalWithholding') }}</th>
              <th class="mobile-only-hidden">{{ $t('Account.W2G.Table.ColumnTitle.StateWithholding') }}</th>
              <th class="mobile-only-hidden" v-if="showLocaltaxInW2gform">{{ $t('Account.W2G.Table.ColumnTitle.TaxLocal') }}</th>
              <th class="mobile-only-visible">{{ $t('Account.W2G.Table.ColumnTitle.Withholding') }}</th>
            </tr>
            <tr v-for="(item, index) in w2gTaxFormList" :key="index">
              <td>
                <v-checkbox v-model="item.Seen"
                            hide-details
                            readonly
                            class="seen-checkbox">
                </v-checkbox>
              </td>
              <td><AuthFileDownloadLink :getAuthLink="() => getDownloadLinkForW2gPdf(item)">{{ item.Bet }}</AuthFileDownloadLink></td>
              <td>{{(item.Created) | moment(dateFormats.shortDate)}}</td>
              <td>{{item.Winning | currency}}</td>
              <td class="mobile-only-hidden">{{ item.TaxFederal | currency }}</td>
              <td class="mobile-only-hidden">{{ item.TaxState | currency }}</td>
              <td class="mobile-only-hidden" v-if="showLocaltaxInW2gform"><template v-if="item.TaxLocal !== null && item.TaxLocal !== ''">{{ item.TaxLocal | currency }}</template></td>
              <td class="mobile-only-visible">
                <div class="tax-witholding-mobile">
                  <div class="tax-witholding-mobile-content">
                    <span>{{ item.TaxFederal | currency }} F</span>
                    <span>{{ item.TaxState | currency }} S</span>
                    <span v-if="showLocaltaxInW2gform"><template v-if="item.TaxLocal !== null && item.TaxLocal !== ''">{{ item.TaxLocal | currency }}</template> L</span>
                  </div>
                </div>
              </td>
            </tr>
          </table>
        </div>
        <div v-else class="no-items-to-show">
          <p><v-icon color="info" class="mr-1">info</v-icon>{{ $t('Account.W2G.NoItemsToShow') }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import DateRangePicker from '@/components/common/DateRangePicker.vue'
import moment from 'moment'
import config from '@/config'
import Screen from '@/components/mixins/Screen'
import Icon from '@/components/common/Icon'
import AuthFileDownloadLink from '@/components/common/AuthFileDownloadLink'

export default {
  components: {
    DateRangePicker,
    AuthFileDownloadLink,
    Icon
  },
  mixins: [
    Screen
  ],

  computed: {
    dateFormats () {
      return config.app.dateFormats
    },
    isLoggedIn () {
      return this.$store.getters['isLoggedIn']
    },
    accountSummaryFlow () {
      return config.app.autoconf.ACCOUNT_SUMMARY_FLOW
    },
    showLocaltaxInW2gform () {
      return config.app.autoconf.SHOW_LOCALTAX_IN_W2GFORM
    }
  },
  data () {
    return {
      isLoading: false,
      w2gTaxFormList: []
    }
  },

  watch: {
    isLoggedIn (newVal) {
      if (newVal) {
        this.initialize()
      }
    }
  },

  mounted () {
    if (this.isLoggedIn) {
      this.initialize()
    }
  },

  methods: {
    initialize () {
      this.$refs.dateRangePicker.setRangeToLast(1, 'years')

      // set initial filter date range 1 year ago
      const today = moment()
      const dateFrom = today.clone().subtract(1, 'years').format('YYYY-MM-DD')
      const dateTo = today.clone().format('YYYY-MM-DD')

      // debugger
      this.fetchW2gTaxFormListList({ dateFrom, dateTo })
    },

    async onFilterApply ({ dateFrom, dateTo }) {
      this.fetchW2gTaxFormListList({ dateFrom, dateTo })
    },

    fetchW2gTaxFormListList ({ dateFrom, dateTo }) {
      // dateFrom and dateTo are in format 'YYYY-MM-DD' and time is assumed to be '00:00'
      // this means that server wont return items that were created on 'dateTo' after '00:00'
      // so to fix that I am adjusting as dateTo + 1 day
      const dateToAdjusted = moment(dateTo, 'YYYY-MM-DD').add(1, 'day').format('YYYY-MM-DD')

      this.isLoading = true
      this.$store.dispatch('getW2gTaxFormList', { dateFrom, dateTo: dateToAdjusted })
        .then(response => {
          this.w2gTaxFormList = response
        })
        .finally(() => {
          this.isLoading = false
        })
    },

    async getDownloadLinkForW2gPdf (item) {
      const w2gId = item.ID
      const pdfFileUrl = await this.$store.dispatch('getW2gFormAuthorizedDownloadLink', w2gId)
      item.Seen = true
      return pdfFileUrl
    }
  }
}
</script>

<style lang="stylus" scoped>
  @import '~@/css/config';
  @import '~@/css/mixins';

  .txfilter,
  .txlist { 
    text-size-adjust: none;
  }

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
    // @media tablet-and-above
    .mobile-only-visible
      display: none
    @media mobile
      .mobile-only-hidden
        display none
      td.mobile-only-visible,
      th.mobile-only-visible
        display table-cell
      .tax-witholding-mobile
        text-align: right
        display: flex
        justify-content: center
        .tax-witholding-mobile-content
          display:flex
          flex-direction: column
    @media mobile-big-and-below
      font-size 12px
      td
        padding 5px 3px
    // td:last-child
    //   @media mobile-big-and-below
    //     display none
    // th:last-child
    //   @media mobile-big-and-below
    //     display none
    td
      .seen-checkbox
        margin 0
        padding 0
        pointer-events none
        display flex
        justify-content center
      >>> .v-input--selection-controls__input
          margin-right: 0
.w2g-list-fetching-progress
  display: flex
  justify-content: center
  align-items: center
  margin-top: 20px

.no-items-to-show
  display: flex
  justify-content: center
  margin-top: 20px

</style>
