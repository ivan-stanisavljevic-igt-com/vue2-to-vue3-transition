<template>
  <div class="self-exclusion self-exclusion_v3">
    <div class="self-exclusion__header">{{$t('Account.SelfExclusion')}}</div>
    <!-- SPINNER -->
    <div class="self-exclusion__spinner" v-if="processing">
      <v-progress-circular indeterminate class="redirecting-circular-progress"/>
    </div>
    <div class="self-exclusion__body" v-if="!processing">
      <!-- INFO TEXT -->
      <div class="self-exclusion__info">
        <div>{{$t('Account.SelfExclusion.Terms')}}</div>
        <div class="acc_infomsg self-exclusion__highlighted">{{$t('Account.SelfExclusion.PinMessage')}}</div>
      </div>
      <!-- EXCLUSION DATE INFO, IF THE USER IS EXCLUDED -->
      <div v-if="expiryDate" class="self-exclusion__excluded-info"> {{ $t('Account.SelfExclusion.Current') }} {{ expiryDate | moment('MM/DD/YYYY')}}{{ ', ' }} {{ expiryDate | moment(dateFormats.longTime)}}</div>
      <!-- FORM -->
      <div class="ctsform">
        <!-- DATE PICKER -->
        <div class="control-block" :class="{ 'filled': selfExclusionDuration }">
          <select class="input-field" v-model="selfExclusionDuration" autocomplete="off">
            <option v-for="(option, i) in ['1', '5']" :key="i" :value="option">{{ $t(`Account.SelfExclusion.Value.${option}`) }}</option>
          </select>
          <label class="control-label" key="pl_dpd_label">{{ $t('Account.SelfExclusion.Date') }}</label>
        </div>
        <!-- ERROR MESSAGE -->
        <div v-if="error" class="self-exclusion__error">{{ $t('Account.Timeout.Error') }}</div>
        <!-- CTA BUTTON -->
        <div class="self-exclusion__buttons">
          <v-btn color="success" x-large @click.stop="confirmDialog = true" :disabled="!selfExclusionDuration"><span>{{ $t('Statement.dialog.Apply') }}</span></v-btn>
        </div>
      </div>
    </div>
    <v-dialog v-model="confirmDialog" content-class="acc-close-conf">
      <div class="acc-close-confirmation">
        <span class="title">{{ $t('Account.CloseAccount.Dialog.Title') }}</span>
      </div>
      <v-layout>
        <v-flex xs6>
          <v-btn id="btn_cancelAccount" @click.stop="confirmDialog = false"><span>{{ $t('Account.Cancel') }}</span></v-btn>
        </v-flex>
        <v-flex xs6>
          <v-btn @click.stop="setPlayerProtection()" id="btn_closeAccount"><span>{{ $t('Account.Yes') }}</span></v-btn>
        </v-flex>
      </v-layout>
    </v-dialog>
  </div>
</template>

<script>
import lib from '@/library'
import moment from 'moment'
import config from '@/config'

const currentDatePlusOneYear = new Date((new Date())
  .setFullYear((new Date()).getFullYear() + 1)) // + 1 year from now
const currentDatePlusOneYearPlusOneDay = currentDatePlusOneYear
  .setDate(currentDatePlusOneYear.getDate() + 1) // + 1 day (to be distinguished from Timeout :))
const currentDatePlusOne5Years = new Date((new Date())
.setFullYear((new Date()).getFullYear() + 5))

export default {
  data: () => ({
    IDFOPlayerProtectionArea: null, // null | number
    PlayerProtectionAreaCode: '',
    PlayerProtectionAreaName: '',
    expiryDate: null, // null | number (epoch),
    selfExclusionDuration: null,
    error: false,
    datePickerMenu: false,
    processing: false,
    confirmDialog: false
  }),
  computed: {
    dateFormats () {
      return config.app.dateFormats
    }
  },
  methods: {
    async setPlayerProtection () {
      try {
        this.startProcessing()
        await lib.rpcService.callBroker('UserService', 'SetPlayerProtection', {
          playerProtectionDetails: [{
            IDFOPlayerProtectionArea: this.IDFOPlayerProtectionArea,
            PlayerProtectionAreaName: this.PlayerProtectionAreaName,
            ExpiryDate: moment(new Date(this.resolveDate(this.selfExclusionDuration))).format(config.app.dateFormats.iso8601),
            Code: 'SPORTSBOOK',
            PlayerProtectionAreaCode: this.PlayerProtectionAreaCode
          }]
        })
        this.getPlayerProtection()
      } catch (ex) {
        console.error(`SelfExclusion.setPlayerProtection ERROR: ${ex && ex.message}`)
        if (ex && ex.exceptionType === '20211') {
          this.error = true
        }
        this.stopProcessing()
      } finally {
        this.selfExclusionDuration = null
        this.confirmDialog = false
      }
    },
    async getPlayerProtection () {
      try {
        this.startProcessing()
        const response = await lib.rpcService.callBroker('UserService', 'GetPlayerProtection')
        let res = response && response.result && response.result.find(e => e.PlayerProtectionAreaCode === 'SPORTSBOOK')
        if (res) {
          if (res.IDFOPlayerProtectionArea) this.IDFOPlayerProtectionArea = res.IDFOPlayerProtectionArea
          if (res.PlayerProtectionAreaCode) this.PlayerProtectionAreaCode = res.PlayerProtectionAreaCode
          if (res.PlayerProtectionAreaName) this.PlayerProtectionAreaName = res.PlayerProtectionAreaName
          if (res.ExpiryDate) this.expiryDate = res.ExpiryDate
        }
      } catch (ex) {
        console.error(`SelfExclusion.getPlayerProtection ERROR: ${ex && ex.message}`)
      } finally {
        this.stopProcessing()
      }
    },
    startProcessing () {
      this.processing = true
    },
    stopProcessing () {
      setTimeout(() => {
        this.processing = false
      }, 500)
    },
    resolveDate (param) {
      if (param === '1') {
        return currentDatePlusOneYearPlusOneDay
      }
      if (param === '5') {
        return currentDatePlusOne5Years
      }
    }
  },
  mounted () {
    this.getPlayerProtection()
  },
  watch: {
    datePickerMenu (val) {
      val && setTimeout(() => (this.$refs.picker.activePicker = 'YEAR'))
    }
  }
}
</script>

<style lang="stylus" scoped>
  @import "~@/css/config"
  .self-exclusion
    @media mobile-big-and-below
      margin 0 10px
      border 1px solid #dbdce0
      margin-bottom 10px
    .self-exclusion__header
      background #0b4da1
      color #fff
      text-align justify
      padding 11px
      font-size 16px
      font-family 'Open Sans Bold'
    .self-exclusion__spinner
      text-align center
      padding 30px 15px
    .self-exclusion__body
      padding 5px 5px 10px
    .self-exclusion__info
      text-align left
      font-size 14px
      display block
      line-height 15px
      @media mobile-big-and-below
        font-size 12px
    .self-exclusion__highlighted
      background #e5e5e5
      font-family 'Open Sans SemiBold'
      padding 10px 5px
      margin 10px 0px
      border-radius: 8px
    .self-exclusion__excluded-info
      margin-top: .5em
      font-family 'Open Sans Bold'
    .self-exclusion__error
      color rgb(244, 67, 54)
      margin -15px 0 5px
    .self-exclusion__buttons
      text-align center
  >>>.acc-close-conf
    @media tablet-and-above
      max-width 400px
    .acc-close-confirmation
      margin-bottom 20px
      text-align center
      .title
        font-size 16px !important
        color var(--account-pages-headings-color)
        text-transform none
        text-align center   
        line-height 26px !important
        @media tablet-and-above
          font-size 20px !important
          line-height 30px !important
    .layout
      gap 10px     
    button
      width 100%
      height 35px
      margin 0
      @media tablet-and-above
        height 40px
    #btn_cancelAccount
      background var(--account-pages-primary-btn-bgr)
      border var(--account-pages-primary-btn-border)
      color var(--account-pages-primary-btn-color)
      border-radius var(--account-pages-btn-border-radius)
    #btn_closeAccount
      background var(--account-pages-secondary-btn-bgr)
      border var(--account-pages-secondary-btn-border)
      color var(--account-pages-secondary-btn-color)
      border-radius var(--account-pages-btn-border-radius)
  .title
    font-family "Open Sans Bold" !important
</style>
