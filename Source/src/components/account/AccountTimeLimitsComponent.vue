<template>
  <div class="page-content account timelimits-container">
    <h1 v-if="accountSummaryFlow">{{ $t('Account.PlayLimits.Time') }}</h1>
    <div class="temp play-limits ctsform" v-if="timeLimits" :class="{ 'tl-not-in-popup': !isOnRegistration}">
      <h1 v-if="!accountSummaryFlow">{{ $t('Account.PlayLimits.Time') }}</h1>
      <div class="play-limits-container perday">
        <h2>{{ $t('Account.PlayLimits.Time.Daily') }}</h2>
        <span key="pl_dpdm_err">{{ $t('Account.PlayLimits.Time.DepositPerDay.Msg') }}</span><br>
        <span key="mdtl" v-if="maxDailyLimit" v-html="$t('Account.PlayLimits.Time.MaxDaily', { mdl: (maxDailyLimit / 60) })" />
        <span key="mdtlns" v-if="!maxDailyLimit">{{$t('Account.PlayLimits.Time.MaxDaily.NotSet')}}</span>
        <span key="dtlns" v-if="dailyLimit === null && pendingDailyLimit === null && pendingLimitActivationTime === null" class="current-limit-info">{{ $t('Account.PlayLimits.Time.Daily.NotSet') }}</span>
        <span key="dtl" v-if="dailyLimit === 1" class="current-limit-info" v-html="$t('Account.PlayLimits.Time.Daily.Current.One', { cdtl: dailyLimit })" />
        <span key="dtlm" v-if="dailyLimit > 1" class="current-limit-info" v-html="$t('Account.PlayLimits.Time.Daily.Current', { cdtl: dailyLimit })" />
        <span key="dtlpl" v-if="pendingDailyLimit" class="pending-limit-info" v-html="$t('Account.PlayLimits.Time.Daily.Pending', { pdtl: pendingDailyLimit })" />
        <span key="dtlpld" v-if="dailyLimit && pendingDailyLimit === null && pendingLimitActivationTime" class="pending-limit-info">{{ $t('Account.PlayLimits.Time.Daily.PendingDisableLimit') }}</span>
        <div class="control-block" :class="{ 'filled': [0, undefined].indexOf(currentDailyLimit) === -1}">
          <select class="input-field" v-model="currentDailyLimit" id="dailyLimit" autocomplete="off" @focusout="currentDailyLimit === undefined ? errorMessages.dailyTimeLimitMissing = true : errorMessages.dailyTimeLimitMissing = false">
            <option v-for="(hour, i) in dailyTimelimitHours" :key="i" :value="hour">{{hour}}</option>
          </select>
           <label class="control-label" key="pl_dpd_label">{{ $t('Account.PlayLimits.Time.Hours') }}</label>
        </div>
        <!-- <div class="vmsg invalid" v-if="errorMessages.dailyTimeLimitMissing" id="err_msg_dailyLimit" key="pl_dpd_err">{{ $t('Account.PlayLimits.Time.ErrorMsg.dailyTimeLimitMissing') }}</div> -->
        <div class="save-button-container form-actions">
          <v-btn :disabled="!allowAccountUpdate || !currentDailyLimit" id="btn_setDailyLimit" class="transactions" color="success" x-large @click.stop="setLimit('day')"><span>{{ $t('Account.Save') }}</span></v-btn>
        </div>
      </div>
    </div>
    <ProcessingDialog
      v-if="!isOnRegistration"
      v-model="dialog"
      :isDialogPersistent="true"
      :isProcessing="isProcessing"
      :isSuccess="!transactionError"
      :processingTitle="$t('Account.PersonalDetails.Dialog.Processing.Title')"
      :processingText="$t('Account.PersonalDetails.Dialog.Processing.Text')"
      :successTitle="$t('Account.PlayLimits.Dialog.Success.Title')"
      :successText="$t('Account.PlayLimits.Dialog.Success.Text')"
      :errorTitle="$t('Account.PlayLimits.Dialog.Error.Title')"
      :closeBtnText="$t('ProcessingDialog.CloseButtonText')"
    >
      <div slot="text-error">
        <p v-if="brandKey !== 'sb'" class="generic-icon-note"><v-icon color="error" class="mr-1">error</v-icon><span>{{ $t('Account.Join.Dialog.Error.Text') }}</span></p>
        <p class="response-error">{{ transactionError }}</p>
        <p v-html="$t('Account.PlayLimits.Dialog.Error.Text.ContactSupport')"></p>
      </div>
    </ProcessingDialog>
  </div>
</template>

<script>
  import store from '@/store'
  import lib from '@/library'
  import ProcessingDialog from '@/components/common/ProcessingDialog'
  import Branding from '@/components/mixins/Branding'
  export default {
    mixins: [
      Branding
    ],
    props: ['isOnRegistration'],
    components: {
      ProcessingDialog
    },
    data: () => ({
      currentDailyLimitField: undefined,
      errorMessages: {
        dailyTimeLimitMissing: false
      },
      dialog: false,
      isProcessing: false,
      transactionError: null
    }),
    computed: {
      timeLimits () {
        return store.getters['limits/timeLimits']
      },
      maxDailyLimit () {
        return (this.timeLimits && this.timeLimits.MaxDailyLimit) || 1380 // if there is no default max daily limit from server, take fallback 23h (1380 minutes)
      },
      dailyLimit () {
        return this.timeLimits && this.timeLimits.DailyLimit && (this.timeLimits.DailyLimit / 60)
      },
      pendingDailyLimit () {
        return this.timeLimits && this.timeLimits.PendingDailyLimit && (this.timeLimits.PendingDailyLimit / 60)
      },
      pendingLimitActivationTime () {
        return this.timeLimits && this.timeLimits.PendingLimitActivationTime
      },
      currentDailyLimit: {
        get () {
          return this.currentDailyLimitField
        },
        set (value) {
          if (value === undefined) {
            this.errorMessages.dailyTimeLimitMissing = true
          } else {
            this.errorMessages.dailyTimeLimitMissing = false
          }
          this.currentDailyLimitField = value
        }
      },
      dailyTimelimitHours () {
        if (this.maxDailyLimit) {
          let arr = []
          const endIndex = Math.floor(this.maxDailyLimit / 60)
          for (let i = 0; i <= endIndex; i++) {
            arr.push(i)
            arr[0] = this.$t('Account.PlayLimits.Time.Daily.Disable')
          }
          return arr
        }
        return 0
      },
      allowAccountUpdate () {
        return store.getters['getAllowAccountUpdate']
      },
      accountSummaryFlow () {
        return window.ctsautoconf.ACCOUNT_SUMMARY_FLOW || false
      }
    },
    methods: {
      async setLimit (param) {
        let isValid = this.resolveConstraint(param)
        const dailyLimit = this.resolveDailyLimit()
        try {
          if (isValid) {
            this.isProcessing = true
            this.transactionError = null
            this.dialog = true
            const response = await lib.rpcService.callBroker('account', 'setcustomertimelimits', {
              'SessionLimit': null,
              'DailyLimit': dailyLimit,
              'WeeklyLimit': null,
              'MonthlyLimit': null
            })
            if (response && response.exceptionType && response.message) {
              this.transactionError = response.message
            } else {
              this.isProcessing = false
              this.errorMessages.dailyTimeLimitMissing = false
            }
          }
        } catch (exception) {
          this.transactionError = exception.message || this.$t('Server.ErrorMsg.Generic')
        } finally {
          this.isProcessing = false
          store.dispatch('limits/fetchTimeLimits')
          store.dispatch('getCustomerContext')
          this.currentDailyLimitField = undefined
        }
      },
      resolveConstraint (param) {
        let valid = true
        switch (param) {
          case 'day':
            if (this.currentDailyLimit === undefined) {
              valid = false
              this.errorMessages.dailyTimeLimitMissing = true
            }
            break
        }
        return valid
      },
      resolveDailyLimit () {
        let retVal
        switch (this.currentDailyLimit) {
          case undefined:
          case null:
          case 0:
          case this.$t('Account.PlayLimits.Time.Daily.Disable'):
            retVal = null
            break
          default:
            retVal = this.currentDailyLimit * 60
        }
        return retVal
      }
    }
  }
</script>

<style lang="stylus" scoped>
  @import '~@/css/config'
  @import '~@/css/mixins'
  .page-content.account.timelimits-container
    margin-top 20px
    flex-direction column
    h2
      text-align center
    .play-limits
      cursor default
      padding-bottom 0
      &.tl-not-in-popup
        display: block
      .diss
        background-color #dbdbdb
      .play-limits-container
        margin 5px
        border 1px solid #dbdce0
        padding 10px
        &:not(:first-child)
          margin-top 15px
        .current-limit-info,
        .pending-limit-info
          margin 5px 0
          background #efefef
          padding 5px
          border-radius 0px
          display flex
          >>> span
            margin-left 5px
            font-weight bold
</style>
