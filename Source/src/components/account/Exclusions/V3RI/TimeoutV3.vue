<template>
  <div class="timeout">
    <div class="timeout__header">{{$t('Account.Timeout')}}</div>
    <!-- SPINNER -->
    <div class="timeout__spinner" v-if="processing">
      <v-progress-circular indeterminate class="redirecting-circular-progress"/>
    </div>
    <div class="timeout__body" v-if="!processing">
      <!-- INFO TEXT -->
      <div class="timeout__info">
        <div>{{$t('Account.Timeout.Desc.One')}}</div>
        <div class="acc_infomsg timeout__highlighted">{{$t('Account.SelfExclusion.PinMessage')}}</div>
        <div class="timeout-period-info">{{$t('Account.Timeout.Desc.Three')}}</div>
      </div>
      <!-- TIMEOUT DATE INFO, IF THE USER IS EXCLUDED -->
      <div v-if="expiryDate" class="timeout__excluded-info"> {{ $t('Account.Timeout.Current') }} {{ expiryDate | moment('MM/DD/YYYY')}}{{ ', ' }} {{ expiryDate | moment(dateFormats.longTime)}}</div>
      <!-- FORM -->
      <div>
        <div class="ctsform">
          <!-- SELECT PICKER -->
          <div class="control-block" :class="{ 'filled': timeoutDuration }">
            <select class="input-field" v-model="timeoutDuration" id="timeout-duration" autocomplete="off" @click="error = false">
              <option id="timeout-disabled" value disabled>{{$t(`Account.Timeout.Select`) }}</option>
              <option v-for="(option, i) in timeoutOptions" :key="i" :value="option.value">{{ $t(`Account.Timeout.Duration.${option.label}`) }}</option>
            </select>
            <label class="control-label">{{ $t('Account.Timeout.Duration') }}<span class="control-label-required"> *</span></label>
          </div>
        </div>
        <!-- ERROR MESSAGE -->
        <div v-if="error" class="timeout__error">{{ $t('Account.Timeout.Error') }}</div>
        <!-- CTA BUTTON -->
        <div class="timeout__buttons"> 
          <v-btn color="success" x-large @click.stop="confirmDialog = true" :disabled="!timeoutDuration"><span>{{ $t('Statement.dialog.Apply') }}</span></v-btn>
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

export default {
  data: () => ({
    IDFOPlayerProtectionArea: null, // null | number
    PlayerProtectionAreaCode: '',
    PlayerProtectionAreaName: '',
    expiryDate: null, // null | number (epoch),
    timeoutDuration: null,
    error: false,
    timeoutOptions: [
      { value: new Date().setDate(new Date().getDate() + 2), label: 2 },
      { value: new Date().setDate(new Date().getDate() + 7), label: 7 },
      { value: new Date().setMonth(new Date().getMonth() + 1), label: 30 },
      { value: new Date().setMonth(new Date().getMonth() + 2), label: 60 },
      { value: new Date().setMonth(new Date().getMonth() + 3), label: 90 },
      { value: new Date().setMonth(new Date().getMonth() + 6), label: 180 },
      { value: new Date().setMonth(new Date().getMonth() + 9), label: 270 },
      { value: new Date().setMonth(new Date().getMonth() + 12), label: 365 }
    ],
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
            ExpiryDate: moment(new Date(this.timeoutDuration)).format(config.app.dateFormats.iso8601),
            Code: 'SPORTSBOOK',
            PlayerProtectionAreaCode: this.PlayerProtectionAreaCode
          }]
        })
        this.getPlayerProtection()
      } catch (ex) {
        console.error(`Timeout.setPlayerProtection ERROR: ${ex && ex.message}`)
        if (ex && ex.exceptionType === '20211') {
          this.error = true
        }
        this.stopProcessing()
      } finally {
        this.timeoutDuration = null
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
        console.error(`Timeout.getPlayerProtection ERROR: ${ex && ex.message}`)
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
    }
  },
  mounted () {
    this.getPlayerProtection()
  }
}
</script>

<style lang="stylus" scoped>
  @import "~@/css/config"
  .timeout
    @media mobile-big-and-below
      margin 0 10px
      border 1px solid #dbdce0
      margin-bottom 10px
    .timeout__header
      background #0b4da1
      color #fff
      text-align justify
      padding 11px
      font-size 16px
      font-family 'Open Sans Bold'
    .timeout__spinner
      text-align center
      padding 30px 15px
    .timeout__body
      padding 5px 5px 10px
      .timeout__info
        text-align left
        font-size 14px
        display block
        line-height 15px
        @media mobile-big-and-below
          font-size 12px
      .timeout__highlighted
        background #e5e5e5
        font-family 'Open Sans SemiBold'
        padding 10px 5px
        margin 10px 0px
        border-radius: 8px
      .timeout__excluded-info
        font-family 'Open Sans Bold'
        margin-top: .5em
      .timeout__error
        color rgb(244, 67, 54)
        margin -15px 0 5px
      .timeout__buttons
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
