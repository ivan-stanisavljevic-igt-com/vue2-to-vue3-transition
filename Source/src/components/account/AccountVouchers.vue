<template>
  <div v-show="isLoggedIn">
    <div v-if="isProcessing" class="is-processing">
      <CircleLoader></CircleLoader>
    </div>
    <div v-else>
      <h1 v-if="!accountSummaryFlow">{{ $t('Promotions.AccountPage.ActiveVouchers') }}</h1>
      <div v-if="vouchers">
        <div v-if="vouchers.length">
          <div v-for="(voucher, i) in vouchers" :key="i">
            <div class="voucher-item">
              <div class="voucher-item__title">{{ voucher.Description }}</div>
              <div class="voucher-item__content">
                <div class="dates">
                  <div class="date-start-wrapper"><span class="date-start">{{ $t('Promotions.AccountPage.VoucherItem.IssuedOn') }}</span> {{ parseDateTime(voucher.TsCreated) }}</div>
                  <div class="date-end-wrapper"><span class="date-end">{{ $t('Promotions.AccountPage.VoucherItem.ValidFrom') }}</span> {{ parseDateTime(voucher.ValidityStartDate) }}</div>
                  <div class="date-end-wrapper"><span class="date-end">{{ $t('Promotions.AccountPage.VoucherItem.ValidUntil') }}</span> {{ parseDateTime(voucher.ExpiryDate) }}</div>
                </div>
                <span class="amount">{{ voucher.CurrentAmount | currency }}</span>
              </div>
              <div class="type-description">{{voucher.TypeDescription}}</div>
              <div class="customer-notes" v-if="voucher.CustomerNotes">
                <div class="customer-notes-title">{{ $t('Promotions.AccountPage.CustomerNotes.Title') }}</div>
                <div class="customer-notes-desc">{{voucher.CustomerNotes}}</div>
              </div>
            </div>
          </div>
        </div>
        <div v-else>
          <p class="no-vouchers-found"><v-icon color="info" class="mr-1" size="18">info</v-icon>{{ $t('Promotions.AccountPage.NoActiveVouchers.Msg') }}</p>
        </div>
      </div>

      <div v-if="errorMessage" class="error error-message">
        {{ errorMessage }}
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import config from '@/config'
import { mapState } from 'vuex'
import CircleLoader from '@/components/common/CircleLoader'

export default {
  components: {
    CircleLoader
  },

  data () {
    return {
      errorMessage: null
    }
  },

  mounted () {
    this.getVouchers()
  },

  computed: {
    isLoggedIn () {
      return this.$store.getters['isLoggedIn']
    },
    dateFormats () {
      return config.app.dateFormats
    },
    isProcessing () {
      return this.isProcessingFetchPromotions
    },
    ...mapState('vouchers', {
      isProcessingFetchPromotions: 'isProcessingFetchPromotions',
      // example voucher object:
      // {
      //  "IDMMPRVoucher": 241.0,
      //  "CurrentAmount": 200.0,
      //  "OriginalAmount": 200.0,
      //  "IDMMPRVoucherType": "IsolationFun",
      //  "TypeDescription": "Isolation Fun",
      //  "TsCreated": "2020-03-25T15:21:32",
      //  "ExpiryDate": "2020-04-29T00:00:00",
      //  "ValidityStartDate": "2020-03-25T15:21:32",
      //  "Description": "Isolation Fun",
      //  "CustomerNotes": "Isolation Fun - Have fun while you are at home \r\nTEST TEST TEST"
      // }
      vouchers: 'vouchersForAccountPromotionsPage'
    }),
    accountSummaryFlow () {
      return window.ctsautoconf.ACCOUNT_SUMMARY_FLOW || false
    }
  },

  methods: {
    applyDateRange (dateRange) {
      this.$refs.dateRangePicker.expanded = false
      this.getPromotions()
    },

    parseDateTime (dateTime) {
      return moment.utc(dateTime).format('MM/DD/YYYY HH:mm A')
    },

    async getVouchers () {
      this.$store.dispatch('vouchers/fetchVouchersForAccountPromotionsPage')
    }
  }
}
</script>

<style scoped lang="stylus">
@import '~@/css/config'
@import '~@/css/mixins'

.promotions-title
  text-align: center

.no-vouchers-found
  text-align: center
  margin-top: 32px
  margin-bottom: 32px

.voucher-item
  border: 1px solid #dddddd
  padding: 15px 15px
  margin-bottom: 10px

.voucher-item__title
  font-weight: bold
  font-size: 1.2em
  margin-bottom: 4px
  background: #f1f2f2 !important
  margin: -15px -15px 10px -15px
  padding: 10px 15px
  line-height: normal

.voucher-item__content
  display: flex
  align-items: center
  margin-bottom: 8px

.dates
  flex-grow: 1

.date-start-wrapper
  padding-right: 20px

@media mobile-big-and-below
  .date-start-wrapper, .date-end-wrapper
    display: block
    padding-right: 5px

.date-start
  font-weight: bold

.date-end
  font-weight: bold

.amount
  flex-grow: 0
  font-size: 1.2em

.vouchers-header
  padding: 8px
  background: #31ba5f
  color: white
  text-align: center
  margin-top: 8px

.error-message
  text-align: center
  color: white
  margin: 10px 0
  padding: 10px

.is-processing
  text-align: center

.page-description
  text-align: center
  @media mobile-big-and-above
    margin: 0 30px

.customer-notes-title
  font-weight bold
  margin-top 6px
</style>
