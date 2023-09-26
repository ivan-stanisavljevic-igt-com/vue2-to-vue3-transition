<template>
  <div class="promotions-container">
    <h1 class="promotions-title">{{ $t('Promotions.AccountPage.Title') }}</h1>
    <p class="page-description">
      <span>{{ $t('Promotions.AccountPage.InfoText') }}</span>
    </p>
    <div>
      <div v-if="promotions && promotions.length > 0" class="promotions-wrapper">
        <div v-for="(promotion, i) in promotions" :key="i" class="promotion-item" :class="promotion.event" @click.stop="togglePromotion(promotion)">
          <div class="promotion-item-wrapper">
            <div v-if="brandKey !== 'boyd'" class="promo_icon"><v-icon>stars</v-icon></div>
            <div class="promotion-item-content">
              <div class="promotion-item__title">{{ promotion.description }}</div>
              <div class="promotion-content">{{ promotion.voucher }}</div>
            </div>
            <div v-if="brandKey !== 'boyd'" class="promo_readmore"><v-icon>chevron_right</v-icon></div>
          </div>
        </div>
        <div class="promotion-overlay" v-if="promotionPopup" @click.stop="togglePromotion()">
          <div class="promotions-overlay-wrapper">
            <div class="caca">
              <v-flex class="close">
                <v-btn flat class="close"><v-icon>close</v-icon></v-btn>
              </v-flex>
              <div class="promotion-item__title" v-if="promotionObj.description">{{ promotionObj.description }}</div>
            </div>
            <div class="date-from" v-if="promotionObj.start">{{ $t('Account.Promotions.Start') }} {{ parseDateTime(promotionObj.start) }}</div>
            <div class="date-to" v-if="promotionObj.end">{{ $t('Account.Promotions.End') }} {{ parseDateTime(promotionObj.end) }}</div>
            <div class="min-reward" v-if="promotionObj.minimum">{{ $t('Account.Promotions.Minimum', {currency: currencySymbol}) }} {{ promotionObj.minimum }}</div>
            <div class="max-reward" v-if="promotionObj.maximum">{{ $t('Account.Promotions.Maximum', {currency: currencySymbol}) }} {{ promotionObj.maximum }}</div>
            <div class="promotion-item-note" v-if="promotionObj.note">{{ promotionObj.note }}</div>
          </div>
        </div>
      </div>
      <div v-else>
        <p class="no-promotions-found"><v-icon color="info" class="mr-1" size="18">info</v-icon>{{ $t('Promotions.AccountPage.NoActivePromotions.Msg') }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import config from '@/config'
import store from '@/store'
import Vue from 'vue'
import moment from 'moment'
import Branding from '@/components/mixins/Branding'

export default {
  data: () => {
    return {
      promotionPopup: undefined,
      promotionObj: undefined
    }
  },
  mixins: [
    Branding
  ],
  computed: {
    dateFormats () {
      return config.app.dateFormats
    },
    promotions () {
      let promotions = store.getters['getPromotions']
      return Vue._.orderBy(promotions, 'id')
    },
    currencySymbol () {
      return config.app.CURRENCY
    }
  },
  methods: {
    togglePromotion (promotion) {
      this.promotionPopup = !this.promotionPopup
      this.promotionObj = promotion
    },
    parseDateTime (dateTime) {
      return moment(dateTime).format('MM/DD/YYYY')
    }
  },
  mounted () {
  }
}
</script>

<style scoped lang="stylus">
@import '~@/css/config'
@import '~@/css/mixins'

.promotions-container
  background: white
  margin 0 24px 0 0
  padding 20px
  cursor default
  @media mobile-big-and-below
    margin 0
    padding 10px
.promotions-wrapper
  display flex
  flex-wrap wrap
  justify-content space-between
.caca
  position relative
  .flex.close
    position absolute
    right 45px
    width 50px
    @media mobile-big-and-below
      width initial
      right -35px
    :before,
    span
      display none
.promotions-title
  text-align: center

.no-promotions-found
  text-align: center
  margin-top: 32px

.promotion-item
  padding: 15px 15px
  flex 0 0 32%
  background #0b4da1
  color white
  margin 10px 0
  cursor pointer
  min-height 100px
  max-width 32%
  @media mobile-big-and-below
    flex unset
    max-width 100%
    width 100%


.promotion-item__title
  font-weight: bold
  font-size: 16px

.promotion-item__content
  display: flex
  align-items: center
.promotion-overlay
  position fixed
  display block
  width 100%
  height 100%
  background-color rgba(17,28,44,0.9)
  top 0
  left 0
  z-index 201
  .promotions-overlay-wrapper
    display block
    position relative
    width 60%
    margin auto
    min-height 350px
    background-color rgba(255,255,255,1)
    top 30%
    @media mobile-big-and-below
      top 0
      width 100%
      height 100%
    .promotion-item__title
      padding 15px
      text-transform uppercase
      text-align center
    .promotion-item-note
      font-size 14px
      padding: 10px
      white-space pre-wrap
      overflow-y auto
      height 300px
      @media mobile-big-and-below
        height unset
        max-height 100%
        padding-bottom 135px
    .date-from,
    .date-to
      font-size 14px
      padding 10px
      font-weight bold
    .min-reward,
    .max-reward
      font-size 14px
      padding 3px
      margin 2px 10px
      background #0b4da1
      color #fff
      border-radius 5px

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

.promotions-header
  padding: 8px
  background: #0b4da1
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
  text-align justify
  font-size 14px
.v-icon
  font-size 35px
  color #0b4da1!important
.igt
  .promotion-item-wrapper
    display: flex
    align-items: center
    height: 100%
    .v-icon
      color #fff !important
    .promo_icon .v-icon
      margin-right 10px
    .promotion-item__title
      font-family: "Open Sans SemiBold"
      line-height 16px
      font-weight normal
      padding-bottom 10px
    .promotion-content
      font-size 14px
    .promo_readmore
      margin-left auto
  .promotion-item
    &:nth-child(odd)
      background: #157cc1
      color: #fff

</style>
