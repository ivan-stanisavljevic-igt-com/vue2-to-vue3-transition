<template>
  <div class="page-content account">
    <div class="temp play-limits ctsform" v-if="isLoggedIn">
      <h1 v-if="!accountSummaryFlow">{{ $t('Account.PlayLimits') }}</h1>
      <div class="play-limits-container perday">
        <h2 v-if="!accountSummaryFlow">{{ $t('Account.PlayLimits.DepositPerDay') }}</h2>
        <div v-if="accountSummaryFlow" class="play-limits-header">
          <h2>{{ $t('Account.PlayLimits.DepositPerDay') }}</h2>
          <div>
            <span v-if="currentLimitAmountPerDay" class="limit-info" key="pl_dpdmla_err">Current <span class="val">{{currentLimitAmountPerDay}}</span></span>
            <span v-if="pendingLimitAmountPerDay" class="limit-info" key="pl_dpdpl_err">Pending <span class="val">{{pendingLimitAmountPerDay}}</span></span>
          </div>
        </div>
        <span key="pl_dpdm_err">{{ $t('Account.PlayLimits.DepositPerDay.Msg') }}</span><br>
        <span v-if="!currentLimitAmountPerDay && brandKey === 'sb'" key="pl_dpdns_err">{{ $t('Account.PlayLimits.Deposit.Daily.NotSet') }}<br></span>
        <span v-if="!currentLimitAmountPerDay && brandKey !== 'sb'" key="pl_dpdns_err">{{ $t('Account.PlayLimits.Deposit.NotSet') }}<br></span>
        <span v-if="currentLimitAmountPerDay && !accountSummaryFlow" class="current-limit-info" key="pl_dpdmla_err" v-html="$t('Account.PlayLimits.DepositPerDay.CurrentLimitPerDay', { clpd: (currentLimitAmountPerDay) })"></span>
        <span v-if="pendingLimitAmountPerDay && !accountSummaryFlow" class="pending-limit-info" key="pl_dpdpl_err" v-html="$t('Account.PlayLimits.DepositPerDay.PendingLimitPerDay', { plpd: (pendingLimitAmountPerDay) })"></span>
        <p v-if="maxLimitAmountPerDay" key="pl_dpdmla_err" v-html="$t('Account.PlayLimits.DepositPerDay.MaxLimitAmount', { mlapd: (maxLimitAmountPerDay) })"></p>
        <div class="control-block" :class="{ 'filled': newLimitAmountPerDay }">
           <input type="text" inputmode="decimal" id="limitPerDay" v-model="newLimitAmountPerDay" autocomplete="off" @focusout="!newLimitAmountPerDay ? errorMessages.depositPerDay = true : errorMessages.depositPerDay = false"/>
           <label class="control-label" key="pl_dpd_label">{{ $t('Account.PlayLimits.Amount') }}</label>
        </div>
        <div class="vmsg invalid" id="err_msg_limitPerDay" v-if="errorMessages.depositPerDay" key="pl_dpd_err">{{ $t('Account.PlayLimits.ErrorMsg.LimitAmt') }}</div>
        <div class="save-button-container form-actions">
          <v-btn :disabled="!allowAccountUpdate" id="btn_setLimitPerDay" class="transactions" color="success" x-large @click.stop="SetLimit('day')"><span>{{ $t('Account.Save') }}</span></v-btn>
        </div>
      </div>
      <div class="play-limits-container perweek">
        <h2 v-if="!accountSummaryFlow">{{ $t('Account.PlayLimits.DepositPerWeek') }}</h2>
        <div v-if="accountSummaryFlow" class="play-limits-header">
          <h2>{{ $t('Account.PlayLimits.DepositPerWeek') }}</h2>
          <div>
            <span v-if="currentLimitAmountPerWeek" class="limit-info" key="pl_dpwmla_err">Current <span class="val">{{currentLimitAmountPerWeek}}</span></span>
            <span v-if="pendingLimitAmountPerWeek" class="limit-info" key="pl_dpwpl_err">Pending <span class="val">{{pendingLimitAmountPerWeek}}</span></span>
          </div>
        </div>
        <span key="pl_dpwm_err">{{ $t('Account.PlayLimits.DepositPerWeek.Msg') }}</span><br>
        <span v-if="!currentLimitAmountPerWeek && brandKey === 'sb'" key="pl_dpwns_err">{{ $t('Account.PlayLimits.Deposit.Weekly.NotSet') }}<br></span>
        <span v-if="!currentLimitAmountPerWeek && brandKey !== 'sb'" key="pl_dpdns_err">{{ $t('Account.PlayLimits.Deposit.NotSet') }}<br></span>
        <span v-if="currentLimitAmountPerWeek  && !accountSummaryFlow" class="current-limit-info" key="pl_dpwmla_err" v-html="$t('Account.PlayLimits.DepositPerWeek.CurrentLimitPerWeek', { clpw: (currentLimitAmountPerWeek) })"></span>
        <span v-if="pendingLimitAmountPerWeek  && !accountSummaryFlow" class="pending-limit-info" key="pl_dpwpl_err" v-html="$t('Account.PlayLimits.DepositPerWeek.PendingLimitPerWeek', { plpw: (pendingLimitAmountPerWeek) })"></span>
        <p v-if="maxLimitAmountPerWeek" key="pl_dpwmla_err" v-html="$t('Account.PlayLimits.DepositPerWeek.MaxLimitAmount', { mla: (maxLimitAmountPerWeek) })"></p>
        <div class="control-block" :class="{ 'filled': newLimitAmountPerWeek }">
           <input type="text" inputmode="decimal" id="limitPerWeek" v-model="newLimitAmountPerWeek" autocomplete="off" @focusout="!newLimitAmountPerWeek ? errorMessages.depositPerWeek = true : errorMessages.depositPerWeek = false"/>
           <label class="control-label" key="pl_dpw_label">{{ $t('Account.PlayLimits.Amount') }}</label>
        </div>
        <div class="vmsg invalid" v-if="errorMessages.depositPerWeek" id="err_msg_limitPerWeek" key="pl_dpw_err">{{ $t('Account.PlayLimits.ErrorMsg.LimitAmt') }}</div>
        <div class="save-button-container form-actions">
          <v-btn :disabled="!allowAccountUpdate" id="btn_setLimitPerWeek" class="transactions" color="success" x-large @click.stop="SetLimit('week')"><span>{{ $t('Account.Save') }}</span></v-btn>
        </div>
      </div>
      <div class="play-limits-container permonth">
        <h2 v-if="!accountSummaryFlow">{{ $t('Account.PlayLimits.DepositPerMonth') }}</h2>
        <div v-if="accountSummaryFlow" class="play-limits-header">
          <h2>{{ $t('Account.PlayLimits.DepositPerMonth') }}</h2>
          <div>
            <span v-if="currentLimitAmountPerMonth" class="limit-info" key="pl_dpmmla_err">Current <span class="val">{{currentLimitAmountPerMonth}}</span></span>
            <span v-if="pendingLimitAmountPerMonth" class="limit-info" key="pl_dpmpl_err">Pending <span class="val">{{pendingLimitAmountPerMonth}}</span></span>
          </div>
        </div>
        <span key="pl_dpmm_err">{{ $t('Account.PlayLimits.DepositPerMonth.Msg') }}</span><br>
        <span v-if="!currentLimitAmountPerMonth && brandKey === 'sb'" key="pl_dmdns_err">{{ $t('Account.PlayLimits.Deposit.Monthly.NotSet') }}<br></span>
        <span v-if="!currentLimitAmountPerMonth && brandKey !== 'sb'" key="pl_dpdns_err">{{ $t('Account.PlayLimits.Deposit.NotSet') }}<br></span>
        <span v-if="currentLimitAmountPerMonth && !accountSummaryFlow" class="current-limit-info" key="pl_dpmmla_err" v-html="$t('Account.PlayLimits.DepositPerMonth.CurrentLimitPerMonth', { clpm: (currentLimitAmountPerMonth) })"></span>
        <span v-if="pendingLimitAmountPerMonth && !accountSummaryFlow" class="pending-limit-info" key="pl_dpmpl_err" v-html="$t('Account.PlayLimits.DepositPerMonth.PendingLimitPerMonth', { plpm: (pendingLimitAmountPerMonth) })"></span>
        <p v-if="maxLimitAmountPerMonth" key="pl_dpmmla_err" v-html="$t('Account.PlayLimits.DepositPerMonth.MaxLimitAmount', { mlapm: (maxLimitAmountPerMonth) })"></p>
        <div class="control-block" :class="{ 'filled': newLimitAmountPerMonth }">
           <input type="text" inputmode="decimal" id="limitPerMonth" v-model="newLimitAmountPerMonth" autocomplete="off" @focusout="!newLimitAmountPerMonth ? errorMessages.depositPerMonth = true : errorMessages.depositPerMonth = false"/>
           <label class="control-label" key="pl_dpm_label">{{ $t('Account.PlayLimits.Amount') }}</label>
        </div>
        <div class="vmsg invalid" v-if="errorMessages.depositPerMonth" id="err_msg_limitPerMonth" key="pl_dpm_err">{{ $t('Account.PlayLimits.ErrorMsg.LimitAmt') }}</div>
        <div class="save-button-container form-actions">
          <v-btn :disabled="!allowAccountUpdate" id="btn_setLimitPerMonth" class="transactions" color="success" x-large @click.stop="SetLimit('month')"><span>{{ $t('Account.Save') }}</span></v-btn>
        </div>
      </div>

      <div class="play-limits-container trading">
        <h2 v-if="!accountSummaryFlow">{{ $t('Account.PlayLimits.TradingLimit') }}</h2>
        <div v-if="accountSummaryFlow" class="play-limits-header">
          <h2>{{ $t('Account.PlayLimits.TradingLimit') }}</h2>
          <div>
            <span v-if="currentTradingLimit" class="limit-info" key="pl_dtrmla_err">Current <span class="val">{{currentTradingLimit}}</span></span>
            <span v-if="pendingTradingLimit" class="limit-info" key="pl_dtrpl_err">Pending <span class="val">{{pendingTradingLimit}}</span></span>
          </div>
        </div>
        <span key="pl_dtrm_err" class="desc">{{ $t('Account.PlayLimits.TradingLimit.Msg') }}</span><br>
        <span v-if="!currentTradingLimit" key="pl_dtrns_err">{{ $t('Account.PlayLimits.Trading.NotSet') }}<br></span>
        <span v-if="currentTradingLimit && !accountSummaryFlow" class="current-limit-info" key="pl_dtrmla_err" v-html="$t('Account.PlayLimits.TradingLimit.CurrentLimit', { ctd: (currentTradingLimit) })"></span>
        <span v-if="pendingTradingLimit && !accountSummaryFlow" class="pending-limit-info" key="pl_dtrpl_err" v-html="$t('Account.PlayLimits.TradingLimit.PendingLimit', { ptd: (pendingTradingLimit) })"></span>
        <p v-if="maxTradingLimit" key="pl_dtrmla_err" v-html="$t('Account.PlayLimits.TradingLimit.MaxLimitAmount', { mtl: (maxTradingLimit) })"></p>
        <div class="control-block" :class="{ 'filled': newTradingLimit }">
           <input type="text" inputmode="decimal" v-model="newTradingLimit" id="tradingLimit" autocomplete="off" @focusout="!newTradingLimit ? errorMessages.tradingLimit = true : errorMessages.tradingLimit = false"/>
           <label class="control-label" key="pl_dtr_label">{{ $t('Account.PlayLimits.Amount') }}</label>
        </div>
        <div class="vmsg invalid" v-if="errorMessages.tradingLimit" id="err_msg_tradingLimit" key="pl_dtr_err">{{ $t('Account.PlayLimits.ErrorMsg.LimitAmt') }}</div>
        <div class="save-button-container form-actions">
          <v-btn :disabled="!allowAccountUpdate" id="btn_setTradingLimit" class="transactions" color="success" x-large @click.stop="SetLimit('trade')"><span>{{ $t('Account.Save') }}</span></v-btn>
        </div>
      </div>
    </div>
    <div class="play-limits-container" v-if="timeLimitsAvailable">
      <TimeLimits/>
    </div>
    <ProcessingDialog
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
  import TimeLimits from '@/components/account/AccountTimeLimitsComponent'
  import Branding from '@/components/mixins/Branding'

  export default {
    mixins: [
      Branding
    ],
    components: {
      ProcessingDialog,
      TimeLimits
    },
    data: () => ({
      depositPerWeek: {
        defaultLimitAmountField: 0,
        maxLimitAmountField: 0,
        currentLimitAmountField: 0,
        newLimitAmountField: '',
        IDMMLMLimit4Week: 0,
        pendingLimit: 0
      },
      depositPerDay: {
        defaultLimitAmountField: 0,
        maxLimitAmountField: 0,
        currentLimitAmountField: 0,
        newLimitAmountField: '',
        IDMMLMLimit4Day: 0,
        pendingLimit: 0
      },
      depositPerMonth: {
        defaultLimitAmountField: 0,
        maxLimitAmountField: 0,
        currentLimitAmountField: 0,
        newLimitAmountField: '',
        IDMMLMLimit4Month: 0,
        pendingLimit: 0
      },
      tradingLimit: {
        defaultLimitAmountField: 0,
        maxLimitAmountField: 0,
        currentLimitAmountField: 0,
        newLimitAmountField: '',
        IDMMLMLimit4Month: 0,
        pendingLimit: 0
      },
      errorMessages: {
        depositPerWeek: false,
        depositPerDay: false,
        depositPerMonth: false,
        tradingLimit: false
      },
      dialog: false,
      isProcessing: false,
      transactionError: null
    }),
    computed: {
      isLoggedIn () {
        return store.getters['isLoggedIn']
      },
      defaultLimitAmountPerWeek: {
        get () {
          return this.depositPerWeek.defaultLimitAmountField
        },
        set (value) {
          this.depositPerWeek.defaultLimitAmountField = value
        }
      },
      maxLimitAmountPerWeek: {
        get () {
          return this.depositPerWeek.maxLimitAmountField
        },
        set (value) {
          this.depositPerWeek.maxLimitAmountField = value
        }
      },
      currentLimitAmountPerWeek: {
        get () {
          return this.depositPerWeek.currentLimitAmountField
        },
        set (value) {
          this.depositPerWeek.currentLimitAmountField = value
        }
      },
      newLimitAmountPerWeek: {
        get () {
          return this.depositPerWeek.newLimitAmountField
        },
        set (value) {
          if (!value || value.match(/\D/g) || value === '0') {
            this.errorMessages.depositPerWeek = true
          } else {
            value = parseFloat(value)
            this.errorMessages.depositPerWeek = false
          }
          this.depositPerWeek.newLimitAmountField = value
        }
      },
      pendingLimitAmountPerWeek: {
        get () {
          return this.depositPerWeek.pendingLimit
        },
        set (value) {
          this.depositPerWeek.pendingLimit = value
        }
      },
      defaultLimitAmountPerDay: {
        get () {
          return this.depositPerDay.defaultLimitAmountField
        },
        set (value) {
          this.depositPerDay.defaultLimitAmountField = value
        }
      },
      maxLimitAmountPerDay: {
        get () {
          return this.depositPerDay.maxLimitAmountField
        },
        set (value) {
          this.depositPerDay.maxLimitAmountField = value
        }
      },
      currentLimitAmountPerDay: {
        get () {
          return this.depositPerDay.currentLimitAmountField
        },
        set (value) {
          this.depositPerDay.currentLimitAmountField = value
        }
      },
      newLimitAmountPerDay: {
        get () {
          return this.depositPerDay.newLimitAmountField
        },
        set (value) {
          if (!value || value.match(/\D/g) || value === '0') {
            this.errorMessages.depositPerDay = true
          } else {
            value = parseFloat(value)
            this.errorMessages.depositPerDay = false
          }
          this.depositPerDay.newLimitAmountField = value
        }
      },
      pendingLimitAmountPerDay: {
        get () {
          return this.depositPerDay.pendingLimit
        },
        set (value) {
          this.depositPerDay.pendingLimit = value
        }
      },
      defaultLimitAmountPerMonth: {
        get () {
          return this.depositPerMonth.defaultLimitAmountField
        },
        set (value) {
          this.depositPerMonth.defaultLimitAmountField = value
        }
      },
      maxLimitAmountPerMonth: {
        get () {
          return this.depositPerMonth.maxLimitAmountField
        },
        set (value) {
          this.depositPerMonth.maxLimitAmountField = value
        }
      },
      currentLimitAmountPerMonth: {
        get () {
          return this.depositPerMonth.currentLimitAmountField
        },
        set (value) {
          this.depositPerMonth.currentLimitAmountField = value
        }
      },
      newLimitAmountPerMonth: {
        get () {
          return this.depositPerMonth.newLimitAmountField
        },
        set (value) {
          if (!value || value.match(/\D/g) || value === '0') {
            this.errorMessages.depositPerMonth = true
          } else {
            value = parseFloat(value)
            this.errorMessages.depositPerMonth = false
          }
          this.depositPerMonth.newLimitAmountField = value
        }
      },
      pendingLimitAmountPerMonth: {
        get () {
          return this.depositPerMonth.pendingLimit
        },
        set (value) {
          this.depositPerMonth.pendingLimit = value
        }
      },
      defaultTradingLimit: {
        get () {
          return this.tradingLimit.defaultLimitAmountField
        },
        set (value) {
          this.tradingLimit.defaultLimitAmountField = value
        }
      },
      maxTradingLimit: {
        get () {
          return this.tradingLimit.maxLimitAmountField
        },
        set (value) {
          this.tradingLimit.maxLimitAmountField = value
        }
      },
      currentTradingLimit: {
        get () {
          return this.tradingLimit.currentLimitAmountField
        },
        set (value) {
          this.tradingLimit.currentLimitAmountField = value
        }
      },
      newTradingLimit: {
        get () {
          return this.tradingLimit.newLimitAmountField
        },
        set (value) {
          if (!value || value.match(/\D/g) || value === '0') {
            this.errorMessages.tradingLimit = true
          } else {
            value = parseFloat(value)
            this.errorMessages.tradingLimit = false
          }
          this.tradingLimit.newLimitAmountField = value
        }
      },
      pendingTradingLimit: {
        get () {
          return this.tradingLimit.pendingLimit
        },
        set (value) {
          this.tradingLimit.pendingLimit = value
        }
      },
      allowAccountUpdate () {
        return store.getters['getAllowAccountUpdate']
      },
      timeLimitsAvailable: () => store.getters['limits/timeLimits'],
      accountSummaryFlow () {
        return window.ctsautoconf.ACCOUNT_SUMMARY_FLOW || false
      }
    },
    methods: {
      fetchAccountLimits () {
        lib.rpcService.callBroker('AccountService', 'GetAccountLimits').then(response => {
          let res = response && response.result
          if (res) {
            // ----- day limit section -----
            let dayLimit = res.find(e => e.idmmlmtype === 'DEPOSIT' && e.limitperiodindays === 1.0)
            this.defaultLimitAmountPerDay = dayLimit.defaultlimitamount
            this.currentLimitAmountPerDay = dayLimit.limitamount || this.defaultLimitAmountPerDay || 0 // if there is no limit set, get default limit
            this.maxLimitAmountPerDay = dayLimit.maxlimitamount
            this.depositPerDay.IDMMLMLimit4Day = dayLimit.idmmlmlimit
            this.depositPerDay.pendingLimit = dayLimit.pendinglimitamount
            // ----- week limit section -----
            let weekLimit = res.find(e => e.idmmlmtype === 'DEPOSIT' && e.limitperiodindays === 7.0)
            this.defaultLimitAmountPerWeek = weekLimit.defaultlimitamount
            this.currentLimitAmountPerWeek = weekLimit.limitamount || this.defaultLimitAmountPerWeek || 0
            this.maxLimitAmountPerWeek = weekLimit.maxlimitamount
            this.depositPerWeek.IDMMLMLimit4Week = weekLimit.idmmlmlimit
            this.depositPerWeek.pendingLimit = weekLimit.pendinglimitamount
            // ----- month limit section -----
            let monthLimit = res.find(e => e.idmmlmtype === 'DEPOSIT' && e.limitperiodindays === 30.0)
            this.defaultLimitAmountPerMonth = monthLimit.defaultlimitamount
            this.currentLimitAmountPerMonth = monthLimit.limitamount || this.defaultLimitAmountPerWeek || 0
            this.maxLimitAmountPerMonth = monthLimit.maxlimitamount
            this.depositPerMonth.IDMMLMLimit4Month = monthLimit.idmmlmlimit
            this.depositPerMonth.pendingLimit = monthLimit.pendinglimitamount
            // ----- trading limit section -----
            let tradingLimit = res.find(e => e.idmmlmtype === 'TRADING')
            this.defaultTradingLimit = tradingLimit.defaultlimitamount
            this.currentTradingLimit = tradingLimit.limitamount || this.defaultLimitAmountPerWeek || 0
            this.maxTradingLimit = tradingLimit.maxlimitamount
            this.tradingLimit.IDMMLMLimit4Month = tradingLimit.idmmlmlimit
            this.tradingLimit.pendingLimit = tradingLimit.pendinglimitamount
          }
        }).catch((error) => {
          console.error(error)
        })
      },
      SetLimit (param) {
        let limitObject = this.resolveLimitObject(param)
        let isValid = this.resolveConstraint(param)
        if (isValid) {
          this.isProcessing = true
          this.transactionError = null
          this.dialog = true
          lib.rpcService.callBroker('AccountService', 'SetMMLMAccountLimit', limitObject)
          .then(response => {
            if (response && response.exceptionType && response.message) {
              this.transactionError = response.message
            } else {
              this.isProcessing = false
            }
          })
          .catch((err) => {
            this.transactionError = err.message || this.$t('Server.ErrorMsg.Generic')
          })
          .finally(() => {
            this.isProcessing = false
            this.fetchAccountLimits()
            store.dispatch('getCustomerContext')
          })
        }
      },
      resolveLimitObject (param) {
        let IDMMLMLimit, LimitAmount
        switch (param) {
          case 'week':
            IDMMLMLimit = this.depositPerWeek.IDMMLMLimit4Week
            LimitAmount = this.newLimitAmountPerWeek
            break
          case 'day':
            IDMMLMLimit = this.depositPerDay.IDMMLMLimit4Day
            LimitAmount = this.newLimitAmountPerDay
            break
          case 'month':
            IDMMLMLimit = this.depositPerMonth.IDMMLMLimit4Month
            LimitAmount = this.newLimitAmountPerMonth
            break
          case 'trade':
            IDMMLMLimit = this.tradingLimit.IDMMLMLimit4Month
            LimitAmount = this.newTradingLimit
            break
        }
        return {
          'IDMMLMLimit': IDMMLMLimit,
          'LimitAmount': LimitAmount,
          'LimTxNum': null
        }
      },
      resolveConstraint (param) {
        let valid = true
        switch (param) {
          case 'week':
            if (!this.newLimitAmountPerWeek) {
              valid = false
              this.errorMessages.depositPerWeek = true
            }
            break
          case 'day':
            if (!this.newLimitAmountPerDay) {
              valid = false
              this.errorMessages.depositPerDay = true
            }
            break
          case 'month':
            if (!this.newLimitAmountPerMonth) {
              valid = false
              this.errorMessages.depositPerMonth = true
            }
            break
          case 'trade':
            if (!this.newTradingLimit) {
              valid = false
              this.errorMessages.tradingLimit = true
            }
            break
        }
        return valid
      }
    },
    mounted () {
      this.fetchAccountLimits()
      store.dispatch('limits/fetchTimeLimits')
    }
  }
</script>

<style lang="stylus" scoped>
  @import '~@/css/config'
  @import '~@/css/mixins'

  .page-content.account
    flex-direction column
    h2
      text-align center
    .play-limits
      cursor default
      padding-bottom 0
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
