<template>
  <div class="cool-off">
    <div class="tabr-wrapper">
      <div class="tabr-chld-header">
        <h2>{{$t('Account.Exclusions.CoolOff.Header')}}</h2>
      </div>
      <div class="tabr-info-msg" key="exl-info-msg" v-if="expiryDate"> {{ $t('Account.Exclusions.CoolOff.BreakUntil') }} {{ expiryDate | moment('MM/DD/YYYY')}}{{ ', ' }} {{ expiryDate | moment(dateFormats.longTime)}}</div>
      <div class="tabr-chld-info">
        <div>{{$t('Account.Exclusions.CoolOff.Desc.One')}}</div>
        <div>{{$t('Account.Exclusions.CoolOff.Desc.Two')}}</div>
        <div>{{$t('Account.Exclusions.CoolOff.Desc.Three')}}</div>
      </div>
      <div class="ctsform accpage">
        <div class="control-block" :class="{ 'filled': duration }">
          <input 
            type="number" 
            min="3" 
            max="365" 
            inputmode="numeric" 
            v-model="duration" 
            autocomplete="off"
            @keypress="validateInput()"
          />
          <label class="control-label" key="tbd_label">{{ $t('Account.Exclusions.CoolOff.Duration') }}</label>
        </div>
      </div>
      <div class="tabr-chld-btns"> 
        <v-btn color="success" @click="takeABreak()" :disabled="!durationIsValid">{{$t('Statement.dialog.Apply')}}</v-btn>
      </div>
    </div>
    <ProcessingDialog
      v-model="dialog"
      :isDialogPersistent="true"
      :isProcessing="isProcessing"
      :isSuccess="!transactionError"
      :processingTitle="$t('Account.PersonalDetails.Dialog.Processing.Title')"
      :processingText="$t('Account.PersonalDetails.Dialog.Processing.Text')"
      :successTitle="$t('Account.Exclusions.CoolOff.Success.Title')"
      :successText="$t('Account.Exclusions.CoolOff.Success.Text')"
      :errorTitle="$t('Account.Exclusions.CoolOff.Failed')"
      :closeBtnText="$t('ProcessingDialog.CloseButtonText')"
    >
      <div slot="text-error">
        <p class="generic-icon-note"><v-icon color="error" class="mr-1">error</v-icon><span>{{ transactionError }}</span></p>
      </div>
    </ProcessingDialog>
  </div>
</template>

<script>
import store from '@/store'
import lib from '@/library'
import ProcessingDialog from '@/components/common/ProcessingDialog'
// import moment from 'moment'
import Gtm from '@/components/mixins/Gtm'
import config from '@/config'

export default {
  mixins: [ Gtm ],
  components: {
    ProcessingDialog
  },
  data: () => ({
    expiryDate: null,
    dialog: false,
    isProcessing: false,
    transactionError: null,
    state: window.ctsautoconf.STATE,
    durationField: null,
    durationIsValid: false
  }),
  computed: {
    duration: {
      get () {
        return this.durationField
      },
      set (value) {
        if (value >= 3 && value <= 365) {
          this.durationIsValid = true
        } else {
          this.durationIsValid = false
        }
        this.durationField = value
      }
    },
    dateFormats () {
      return config.app.dateFormats
    }
  },
  methods: {
    toggleDatePicker () {
      this.showDatePicker = !this.showDatePicker
    },
    async takeABreak () {
      this.isProcessing = true
      this.transactionError = null
      this.dialog = true
      try {
        const response = await lib.rpcService.callBroker('iw', 'shorttermsuspend', {
          'state': this.state,
          'duration': Number(this.duration)
        })
        if (response) {
          this.fetchPlayerProtection()
          store.dispatch('getCustomerContext')
        }
      } catch (ex) {
        this.transactionError = (ex && ex.error && ex.error.Message) || (ex && ex.message) || (ex && ex.Message)
      } finally {
        this.isProcessing = false
        this.resetValues()
      }
    },
    async fetchPlayerProtection () {
      try {
        const response = await lib.rpcService.callBroker('iw', 'GetShortTermSuspension')
        let res = response && response.result
        if (res) {
          this.expiryDate = res
        }
      } catch (ex) {
        console.error(ex)
      }
    },
    resetValues () {
    },
    validateInput () {
      // prevent the input if not a digit or if the first key is 0
      if (!/^[0-9]*$/.test(event.key) || (!this.duration && event.key === '0')) {
        event.preventDefault()
      }
    }
  },
  mounted () {
    this.fetchPlayerProtection()
  }
}
</script>

<style lang="stylus" scoped>
  @import "~@/css/config"
  .cool-off
    @media mobile-big-and-below
      padding 0
    .tabr-wrapper
      border 1px solid #dbdce0
      margin-bottom 10px
      .tabr-chld-header
        background #0b4da1
        color #fff
        text-align justify
        h2 
          margin: 0
          padding: 11px
          font-size: 16px
          text-align: left
        span
          display block
          padding 11px
          font-size 16px
          font-weight bold
      .tabr-info-msg
        margin 5px 0
        font-weight bold
      .tabr-chld-info,
      .tabr-chld-date
        text-align left
        font-size 12px
        display block
        padding 5px
        line-height 15px
      .tabr-chld-info
        padding 15px 15px 0 15px
      .accpage
        margin 10px
        padding 5px
        width initial
      .dp-wrapper
        transition opacity .5s
      .tabr-chld-btns
        text-align center
  
</style>
