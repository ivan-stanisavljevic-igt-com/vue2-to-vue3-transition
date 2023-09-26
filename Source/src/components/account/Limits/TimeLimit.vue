<template>
  <div :class="['limit', {'not-acc-sf': !accountSummaryFlow}]">
    <!-- header -->
    <h2 v-if="!accountSummaryFlow">{{ $t(`Account.Limits.Time.${limitType}`) }}</h2>
    <div v-if="accountSummaryFlow" class="limit__header">
      <h2>{{ $t(`Account.Limits.Time.${limitType}`) }}</h2>
      <div class="limit__header__info">
        <span v-if="(currentLimit || currentLimit === 0) || (maxLimit || maxLimit === 0)">Current: <span>{{currentLimit || maxLimit}} {{ durationLabel }}</span></span>
        <span v-if="pendingLimit || pendingLimit === 0">Pending: <span>{{pendingLimit}} {{ durationLabel }}</span></span>
      </div>
    </div>
    <!-- info -->
    <div class="limit__info">
      <div>{{ $t(`Account.Limits.Time.${limitType}.Info`) }}</div>
      <div v-if="(!currentLimit && currentLimit !== 0) && (!maxLimit && maxLimit !== 0)">{{ $t(`Account.Limits.Time.NotSet`) }}</div>
      <div v-if="!accountSummaryFlow" class="limit__info__p">
        <span v-if="(currentLimit || currentLimit === 0) || (maxLimit || maxLimit === 0)" class="limit__info__p__label" v-html="$t(`Account.Limits.Time.${limitType}.Current`, { currency: currency, cl: (currentLimit || maxLimit) })"></span>
        <span v-if="pendingLimit || pendingLimit === 0" class="limit__info__p__label" v-html="$t(`Account.Limits.Time.${limitType}.Pending`, { currency: currency, pl: (pendingLimit) })"></span>
      </div>
    </div>
    <div class="limit__activation" v-if="pendingLimitActivationTime" v-html="$t('Account.Limits.Time.PendingActivation', { at: pendingLimitActivationTimeFormatted})"></div>
    <div class="limit__max" v-if="maxLimit" v-html="$t('Account.Limits.Time.Maximum', { ml: (maxLimit), dl: (durationLabel) })"></div>
    <!-- input -->
    <div class="account ctsform">
      <div class="control-block" :class="{ 'filled': newLimit }">
        <input type="text" inputmode="numeric" v-model="newLimit" :id="'qa-'+limitType" autocomplete="off"/>
        <label class="control-label" v-html="$t(`Account.Limits.Time.Duration`, { dl: (durationLabel) })"></label>
      </div>
      <!-- button -->
      <div class="save-button-container form-actions">
        <v-btn :disabled="inputNotValid" class="transactions" color="success" x-large @click.stop="setLimit()"><span>{{ $t('Account.Save') }}</span></v-btn>
        <v-btn :disabled="!currentLimit" class="transactions" color="success" x-large @click.stop="setLimit(true)"><span>{{ $t('Account.PlayLimits.Deactivate') }}</span></v-btn>
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
        <p class="generic-icon-note"><v-icon color="error" class="mr-1">error</v-icon><span>{{ transactionError }}</span></p>
      </div>
    </ProcessingDialog>
  </div>
</template>

<script>
  import store from '@/store'
  import ProcessingDialog from '@/components/common/ProcessingDialog'
  import moment from 'moment'
  import { i18n } from '@/main.js'
  import config from '@/config'

  export default {
    props: ['limit', 'isOnRegistration'],
    components: {
      ProcessingDialog
    },
    data () {
      return {
        newLimitField: null,
        dialog: false,
        isProcessing: false,
        transactionError: null
      }
    },
    computed: {
      limitType () {
        let limitType = this.limit && this.limit.TimeType && this.limit.TimeType.toLowerCase()
        return `${limitType.charAt(0).toUpperCase()}${limitType.slice(1)}`
      },
      isSessionLimit () {
        return this.limitType && this.limitType === 'Session'
      },
      currentLimit () {
        return this.limit.CurrentValue
      },
      pendingLimit () {
        if (!this.limit.PendingValue && this.pendingLimitActivationTime) return i18n.t('Account.PlayLimits.Deactivation')
        return this.limit.PendingValue
      },
      maxLimit () {
        return this.limit.DefaultValue
      },
      accountSummaryFlow: () => window.ctsautoconf.ACCOUNT_SUMMARY_FLOW,
      allowAccountUpdate: () => store.getters['getAllowAccountUpdate'],
      newLimit: {
        get () {
          return this.newLimitField
        },
        set (value) {
          this.newLimitField = value
        }
      },
      inputNotValid () {
        let accountUpdateNotAllowed = !this.allowAccountUpdate
        let limitNotSetOrIsZero = !Number(this.newLimit)
        let limitIsNotInteger = !!(this.newLimit && this.newLimit.match(/\D/g))
        let limitGreaterThanMax = this.maxLimit ? this.newLimit > this.maxLimit : false
        return accountUpdateNotAllowed || limitNotSetOrIsZero || limitIsNotInteger || limitGreaterThanMax
      },
      durationLabel () {
        return this.isSessionLimit ? `minute${this.currentLimit === 1 ? '' : 's'}` : `hour${this.currentLimit === 1 ? '' : 's'}`
      },
      pendingLimitActivationTime () {
        return this.limit && this.limit.PendingLimitActivationTime
      },
      pendingLimitActivationTimeFormatted () {
        return (this.pendingLimitActivationTime && `${moment(this.pendingLimitActivationTime).format(this.dateFormats.longTime)}`) || undefined
      },
      currency: () => config.app.CURRENCY,
      dateFormats () {
        return config.app.dateFormats
      }
    },
    methods: {
      async setLimit (disableLimit) {
        try {
          this.isProcessing = true
          this.transactionError = null
          this.dialog = true
          await store.dispatch('limits/setTimeLimit', {
            'timeType': this.limit.TimeType,
            'limitValue': disableLimit ? null : this.newLimit
          })
          store.dispatch('limits/fetchTimeLimitsV2')
        } catch (ex) {
          this.transactionError = (ex && ex.error && ex.error.Message) || (ex && ex.message) || (ex && ex.Message) || this.$t('Account.Popup.Error')
        } finally {
          this.isProcessing = false
          this.newLimit = null
        }
      }
    }
  }
</script>

<style lang="stylus" scoped>
  .limit
    border 1px solid #dbdce0
    cursor default
    margin-top -1px
    &.not-acc-sf
      .limit__info
        font-size 14px
        line-height 20px
        min-height initial
        .limit__info__p
          background-color #efefef
    .limit__header
      background #0b4da1
      display flex
      color white
      justify-content space-between
      h2
        margin 0
        padding 11px
        font-size 16px
        text-align left
      .limit__header__info
        display flex
        flex-direction column
        justify-content center
        align-items flex-end
        font-size 12px
        padding 5px
        span
          span
            font-family: "Open Sans Bold"
            padding-left 5px
    .limit__info
      text-align left
      font-size 12px
      padding 5px
      line-height 15px
      min-height 53px
      display flex
      justify-content center
      flex-direction column
    .limit__max, .limit__activation
      font-size 12px
      padding 0 5px
    .ctsform
      padding 0 5px
      margin-bottom 10px
      .control-block
        margin-bottom 0
</style>
