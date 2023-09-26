<template>
  <div :class="['limit', {'not-acc-sf': !accountSummaryFlow}]">
    <!-- header -->
    <h2 v-if="!accountSummaryFlow">{{ $t(`Account.Limits.${limitType}.${limitDuration}`) }}</h2>
    <div v-if="accountSummaryFlow" class="limit__header">
      <h2>{{ $t(`Account.Limits.${limitType}.${limitDuration}`) }}</h2>
      <div class="limit__header__info">
        <span v-if="currentLimit || currentLimit === 0">Current: <span>{{currency}} {{currentLimitUSFormat}}</span></span>
        <span v-if="pendingLimit || pendingLimit === 0">Pending: <span>{{currency}} {{pendingLimitUSFormat}}</span></span>
      </div>
    </div>
    <!-- info -->
    <div class="limit__info">
      <div>{{ $t(`Account.Limits.${limitType}.${limitDuration}.Info`) }}</div>
      <div v-if="!currentLimit && currentLimit !== 0">{{ $t(`Account.Limits.NotSet`) }}</div>
      <div v-if="!accountSummaryFlow" class="limit__info__p">
        <span v-if="currentLimit || currentLimit === 0" class="limit__info__p__label" v-html="$t(`Account.Limits.${limitType}.${limitDuration}.Current`, { currency: currency, cl: (currentLimitUSFormat) })"></span>
        <span v-if="pendingLimit || pendingLimit === 0" class="limit__info__p__label" v-html="$t(`Account.Limits.${limitType}.${limitDuration}.Pending`, { currency: currency, pl: (pendingLimitUSFormat) })"></span>
      </div>
    </div>
    <div class="limit__activation" v-if="pendingLimitActivationTime" v-html="$t('Account.Limits.Time.PendingActivation', { at: pendingLimitActivationTimeFormatted})"></div>
    <div class="limit__max" v-if="maxLimitUSFormat" v-html="$t('Account.Limits.Maximum', { currency: currency, ml: (maxLimitUSFormat) })"></div>
    <!-- input -->
    <div class="account ctsform">
      <div class="control-block" :class="{ 'filled': newLimit }">
        <input type="text" v-model="newLimit" :id="'qa-'+limitType+'-'+limitDuration" autocomplete="off"/>
        <label class="control-label">{{ $t('Account.PlayLimits.Amount') }}</label>
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
        let limitType = this.limit && this.limit.idmmlmtype && this.limit.idmmlmtype.toLowerCase()
        return limitType.charAt(0).toUpperCase() + limitType.slice(1)
      },
      limitDuration () {
        let noOfDays = this.limit && this.limit.limitperiodindays
        var duration
        switch (noOfDays) {
          case 1:
            duration = 'Day'
            break
          case 7:
            duration = 'Week'
            break
          case 28:
          case 29:
          case 30:
          case 31:
            duration = 'Month'
            break
        }
        return duration
      },
      currentLimit () {
        return this.limit.limitamount
      },
      currentLimitUSFormat () {
        return this.limit.limitamount ? this.limit.limitamount.toLocaleString('en-US') : this.limit.limitamount
      },
      pendingLimit () {
        return this.limit.pendinglimitamount
      },
      pendingLimitUSFormat () {
        if (!this.pendingLimit && this.pendingLimitActivationTime) {
          return i18n.t('Account.PlayLimits.Deactivation')
        }
        return this.pendingLimit ? this.pendingLimit.toLocaleString('en-US') : this.pendingLimit
      },
      maxLimit () {
        return this.limit.maxlimitamount
      },
      maxLimitUSFormat () {
        return this.limit.maxlimitamount ? this.limit.maxlimitamount.toLocaleString('en-US') : this.limit.maxlimitamount
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
      pendingLimitActivationTime () {
        return this.limit && this.limit.tspendinglimitactivation
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
          await store.dispatch('limits/setLimit', {
            'IDMMLMLimit': this.limit.idmmlmlimit,
            'LimitAmount': disableLimit ? null : this.newLimit,
            'LimTxNum': null
          })
          store.dispatch('limits/fetchPlayLimits')
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
