<template>
  <div class="page-content account">
    <div class="temp self-exclusion ctsform" v-if="isLoggedIn">
      <h1 v-if="!accountSummaryFlow">{{ $t('Account.Exclusions') }}</h1>
      <div class="se-info-msg" key="se-info-msg" v-if="ExpiryDate"> {{ $t('Account.SelfExclusion.TempSEMsg') }} {{ ExpiryDate | moment('MM/DD/YYYY')}}{{ ', ' }} {{ ExpiryDate | moment(dateFormats.longTime)}}</div>
      <div class="temp-self-excl-container">
        <h2>{{ $t('Account.TemporarySelfExclusion') }}</h2>
        <p>{{ $t('Account.TemporarySelfExclusion.Message') }}</p>
        <div class="block-wrapper">
        <div class="control-block" :class="{ 'filled': selfExclusionDate }">
          <datepicker class ="dp" placeholder="Select Date" v-model="selfExclusionDate" id="selfExclusionDate" :format="'MM / dd / yyyy'" @focusout="!selfExclusionDate ? errorMessages4TempSelfExclusion.selectDate = true : errorMessages4TempSelfExclusion.selectDate = false"></datepicker>
          <!-- <label class="control-label">{{ $t('Account.TemporarySelfExclusion.Date') }}</label> -->
        </div>
        <div class="vmsg invalid" id="err_msg_selfExclusionDate" v-if="this.errorMessages4TempSelfExclusion.selectDate && !accountSummaryFlow" v-html="minimumCoolOffPeriodByDays ? $t('Account.TemporarySelfExclusionByDays.SelectDate', {n:minimumCoolOffPeriodByDays, day: minimumCoolOffPeriodByDays > 1 ? 'days' : 'day'}) : $t('Account.TemporarySelfExclusion.SelectDate')"></div>
        <div class="save-button-container form-actions">
          <v-btn class="transactions" id="btn_temporarySelfExclude" color="success" x-large @click.stop="tempSelfExclude()"><span>{{ $t('Account.TemporarySelfExclusion.ApplySelfExclusion') }}</span></v-btn>
        </div>
        </div>
         <div class="vmsg invalid invalid2" v-if="this.errorMessages4TempSelfExclusion.selectDate && accountSummaryFlow" v-html="minimumCoolOffPeriodByDays ? $t('Account.TemporarySelfExclusionByDays.SelectDate', {n:minimumCoolOffPeriodByDays, day: minimumCoolOffPeriodByDays > 1 ? 'days' : 'day'}) : $t('Account.TemporarySelfExclusion.SelectDate')"></div>
      </div>
    </div>
    <div class="permanent self-exclusion ctsform" v-if="isLoggedIn">
      <div class="permanent-self-excl-container">
        <h2>{{ $t('Account.PermanentSelfExclusion') }}</h2>
        <p>{{ $t('Account.PermanentSelfExclusion.Message') }}</p>
        <div class="perm-excl-info"><p class="generic-icon-note"><v-icon color="error" class="mr-1">error</v-icon></p>{{ $t('Account.PermanentSelfExclusion.Message.Funds') }}</div>
        <div class="save-button-container form-actions">
          <v-checkbox v-model="permanentSelfExclusion" id="permanentSelfExclusion" :label="$t('Account.PermanentSelfExclusion.Guard')"></v-checkbox>
          <v-btn class="transactions" id="btn_permanentSelfExclude" color="success" x-large @click.stop="permanentSelfExclude()" :disabled="!enablePermanentSelfExclusion"><span>{{ $t('Account.TemporarySelfExclusion.ApplySelfExclusion') }}</span></v-btn>
        </div>
      </div>
    </div>
    <ProcessingDialog
      v-model="dialog"
      :isDialogPersistent="true"
      :isProcessing="isProcessing"
      :isSuccess="!transactionError"
      :processingTitle="$t('Account.PersonalDetails.Dialog.Processing.Title')"
      :processingText="$t('Account.PersonalDetails.Dialog.Processing.Text')"
      :successTitle="$t('Account.SelfExclusion.Dialog.Success.Title')"
      :successText="$t('Account.SelfExclusion.Dialog.Success.Text')"
      :errorTitle="$t('Account.SelfExclusion.Dialog.Error.Title')"
      :closeBtnText="$t('ProcessingDialog.CloseButtonText')"
    >
      <div slot="text-error">
        <p v-if="brandKey !=='sb'" class="generic-icon-note"><v-icon color="error" class="mr-1">error</v-icon><span>{{ $t('Account.SelfExclusion.Dialog.Error.Text') }}</span></p>
        <p class="response-error">{{ transactionError }}</p>
        <p v-html="$t('Account.PersonalDetails.Dialog.Error.Text.ContactSupport')"></p>
      </div>
    </ProcessingDialog>
  </div>
</template>

<script>
  import store from '@/store'
  import config from '@/config'
  import lib from '@/library'
  import Screen from '@/components/mixins/Screen'
  import Datepicker from 'vuejs-datepicker'
  import SiteNavigation from '@/components/common/SiteNavigation'
  import moment from 'moment'
  import ProcessingDialog from '@/components/common/ProcessingDialog'
  import Branding from '@/components/mixins/Branding'
  import Gtm from '@/components/mixins/Gtm'

  export default {

    mixins: [
      Screen,
      Branding,
      Gtm
    ],

    components: {
      Datepicker,
      SiteNavigation,
      ProcessingDialog
    },

    data: () => ({
      temporarySelfExclusionDateField: null,
      errorMessages4TempSelfExclusion: {
        selectDate: false
      },
      IDFOPlayerProtectionArea: null,
      PlayerProtectionAreaCode: '',
      PlayerProtectionAreaName: '',
      enablePermanentSelfExclusion: false,
      ExpiryDate: undefined,
      dialog: false,
      isProcessing: false,
      transactionError: null
    }),

    computed: {
      isLoggedIn () {
        return store.getters['isLoggedIn']
      },
      selfExclusionDate: {
        get () {
          return this.temporarySelfExclusionDateField
        },
        set (value) {
          let minimumDays = this.minimumCoolOffPeriodByDays ? this.minimumCoolOffPeriodByDays : 1
          if (new Date(value) > this.addDays(new Date(), minimumDays)) {
            this.errorMessages4TempSelfExclusion.selectDate = undefined
            this.temporarySelfExclusionDateField = new Date(value)
          } else {
            this.errorMessages4TempSelfExclusion.selectDate = true
          }
        }
      },
      isEverythingValid () {
        let isValid = true
        this.isAnyUnpopulatedField()
        Object.values(this.errorMessages4TempSelfExclusion).forEach(val => {
          if (val) {
            isValid = false
          }
        })
        return isValid
      },
      permanentSelfExclusion: {
        get () {
          return this.enablePermanentSelfExclusion
        },
        set (value) {
          this.enablePermanentSelfExclusion = value
        }
      },
      accountSummaryFlow () {
        return window.ctsautoconf.ACCOUNT_SUMMARY_FLOW || false
      },
      dateFormats () {
        return config.app.dateFormats
      },
      minimumCoolOffPeriodByDays () {
        return config.app.autoconf.MIN_NUM_OF_DAYS_FOR_COOL_OFF
      }
    },
    methods: {
      fetchPlayerProtection () {
        lib.rpcService.callBroker('UserService', 'GetPlayerProtection').then(response => {
          let res = response && response.result && response.result[0]
          if (res) {
            if (res.IDFOPlayerProtectionArea) {
              this.IDFOPlayerProtectionArea = res.IDFOPlayerProtectionArea
            }
            if (res.PlayerProtectionAreaCode) {
              this.PlayerProtectionAreaCode = res.PlayerProtectionAreaCode
            }
            if (res.PlayerProtectionAreaName) {
              this.PlayerProtectionAreaName = res.PlayerProtectionAreaName
            }
            if (res.ExpiryDate) {
              this.ExpiryDate = res.ExpiryDate
            }
          }
        }).catch((error) => {
          console.error(error)
        })
      },
      tempSelfExclude () {
        if (this.isEverythingValid) {
          this.isProcessing = true
          this.transactionError = null
          this.dialog = true
          lib.rpcService.callBroker('UserService', 'SetPlayerProtection', {
            'playerProtectionDetails': [{
              'IDFOPlayerProtectionArea': this.IDFOPlayerProtectionArea,
              'PlayerProtectionAreaName': this.PlayerProtectionAreaName,
              'ExpiryDate': moment(new Date(this.selfExclusionDate)).format(config.app.dateFormats.iso8601),
              'Code': 'SPORTSBOOK',
              'PlayerProtectionAreaCode': this.PlayerProtectionAreaCode
            }]
          })
          .then((response) => {
            if (response && response.exceptionType && response.message) {
              this.transactionError = response.message
            } else {
              this.isProcessing = false
              let date = moment(new Date(this.selfExclusionDate)).format(config.app.dateFormats.iso8601)
              this.sendGTMselfExclusion('temporary exclusion', date, this.PlayerProtectionAreaName, this.IDFOPlayerProtectionArea, this.PlayerProtectionAreaCode)
            }
          })
          .catch((err) => {
            this.transactionError = err.message || this.$t('Server.ErrorMsg.Generic')
          })
          .finally(() => {
            this.isProcessing = false
            this.fetchPlayerProtection()
            store.dispatch('getCustomerContext')
            this.resetValues()
          })
        }
      },
      permanentSelfExclude () {
        if (this.permanentSelfExclusion) {
          lib.rpcService.callBroker('UserService', 'SetPlayerProtection', {
            'playerProtectionDetails': [{
              'IDFOPlayerProtectionArea': this.IDFOPlayerProtectionArea,
              'PlayerProtectionAreaName': this.PlayerProtectionAreaName,
              // if permanent, exclusion date is set to 51 or more years from now
              'ExpiryDate': moment((new Date()).setYear(((new Date()).getFullYear() + 51))).format(config.app.dateFormats.iso8601),
              'Code': 'SPORTSBOOK',
              'PlayerProtectionAreaCode': this.PlayerProtectionAreaCode
            }]
          })
          .then((response) => {
            if (response && response.exceptionType && response.message) {
              this.transactionError = response.message
            } else {
              this.isProcessing = false
              let date = moment((new Date()).setYear(((new Date()).getFullYear() + 51))).format(config.app.dateFormats.iso8601)
              this.sendGTMselfExclusion('permanent exclusion', date, this.PlayerProtectionAreaName, this.IDFOPlayerProtectionArea, this.PlayerProtectionAreaCode)
              store.dispatch('logout')
            }
          })
          .catch((err) => {
            this.transactionError = err.message || this.$t('Account.Join.ErrorMsg.Generic')
          })
          .finally(() => {
            if (this.isProcessing) {
              this.isProcessing = false
            }
            this.resetValues()
          })
        }
      },
      resetValues () {
        this.temporarySelfExclusionDateField = null
        this.errorMessages4TempSelfExclusion.selectDate = false
        this.permanentSelfExclusion = false
      },
      isAnyUnpopulatedField () {
        if (!this.selfExclusionDate) {
          this.errorMessages4TempSelfExclusion.selectDate = true
        }
      },
      addDays (date, days) {
        date.setDate(date.getDate() + days)
        return date
      }
    },
    mounted () {
      this.fetchPlayerProtection()
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
    .self-exclusion
      cursor default
      &.temp
        padding-bottom 0
      .temp-self-excl-container,
      .permanent-self-excl-container
        margin 5px
        border 1px solid #dbdce0
        padding 10px
        border-radius 0px
      .se-info-msg
        margin 10px
        padding 5px
        border-radius 5px
        text-align center
        background-color rgba(255, 86, 86, .3)
    .perm-excl-info
      margin 5px 0
      background #f2f2f2
      padding 5px
      border-radius 0px
      display flex
      font-family 'Open Sans SemiBold'
</style>
