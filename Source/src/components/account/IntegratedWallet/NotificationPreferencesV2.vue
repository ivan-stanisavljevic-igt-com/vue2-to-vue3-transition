<template>
  <div>
    <div v-if="isLoggedIn" class="notification-preferences ctsform">
      <div v-if="fetchingData && !componentDidIntitialFetch">
        <v-progress-circular indeterminate class="circular-progress"></v-progress-circular>
      </div>
      <div v-else>
        <div v-if="preferencesApplied && categories && categories.length">
          <h1 v-if="!accountSummaryFlow">{{ $t('Notifications.PreferencesPage.Title') }}</h1>
          <div>
            <p class="info-text">{{ $t('Notifications.PreferencesPage.InfoText') }}</p>
            <p class="info-text-phone" v-if="!isPhoneVerified"><v-icon color="blue" class="mr-1" size="16">info</v-icon>{{ $t('Notifications.PreferencesPage.Note') }}</p>
          </div>
          <div class="categories-wrapper">
            <div class="table_head">
              <span class="title-text">{{$t('Account.Settings.Notifications.NotifyMe')}}</span>
              <span class="channels">
                <span v-for="(channel, i) in supportedChannels" :key="i" class="channel">{{channel}}</span>
              </span>
            </div>
            <div v-for="(category, i) in categories" :key="i" class="category notifications-holder">
              <div class="category-name">{{category.CategoryName}}</div>
              <div v-for="(offer, i) in category.Offers" :key="i" class="channel">
                <span class="offer-name">{{offer.OfferName}}</span>
                <span class="offer-channels">
                  <v-checkbox
                    :class="[{'disabled': subscription.Disabled}]"
                    v-for="(subscription, i) in offer.ChannelSubscriptions" :key="i"
                    :disabled="isProcessing || subscription.Disabled"
                    v-model="subscription.active"
                    @change="editPreference({
                      'OfferId': offer.OfferId,
                      'Channel': subscription.Channel,
                      'Operation': subscription.active ? 'ACTIVATE' : 'DEACTIVATE'
                    })"
                  ></v-checkbox>
                </span>
              </div>
            </div>
          </div>
          <div>
            <v-btn :disabled="isProcessing || !allowAccountUpdate || updatedPreferences.length === 0" color="success" @click="save">{{$t('Notifications.PreferencesPage.Button.Save')}}</v-btn>
            <v-btn :disabled="isProcessing || !allowAccountUpdate" color="error" @click="reset2Defaults()" :title="$t('Notifications.PreferencesPage.Button.Reset.Tooltip')">{{$t('Notifications.PreferencesPage.Button.Reset')}}</v-btn>
          </div>
        </div>
        <div v-else>
          <p><v-icon color="blue" class="mr-1" size="16">info</v-icon>{{ $t('Notifications.PreferencesPage.NoOptionsAvailable') }}</p>
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
      :successText="$t('Account.PersonalDetails.Dialog.Success.Text')"
      :errorTitle="$t('Account.PersonalDetails.Dialog.Error.Title')"
      :closeBtnText="$t('ProcessingDialog.CloseButtonText')"
    >
      <div slot="text-error">
        <p v-if="brandKey !=='sb'" class="generic-icon-note"><v-icon color="error" class="mr-1">error</v-icon><span>{{ $t('Account.PersonalDetails.Dialog.Error.Text') }}</span></p>
        <p class="response-error">{{ transactionError }}</p>
        <p v-html="$t('Account.PersonalDetails.Dialog.Error.Text.ContactSupport')"></p>
      </div>
    </ProcessingDialog>
  </div>
</template>

<script>
import store from '@/store'
import lib from '@/library'
import ProcessingDialog from '@/components/common/ProcessingDialog'
import Branding from '@/components/mixins/Branding'
import mobileBridge from '@/library/mobileBridge'
import config from '@/config'
export default {
  mixins: [ Branding ],
  components: {
    ProcessingDialog
  },
  data () {
    return {
      fetchingData: false,
      categories: undefined,
      preferences: undefined,
      preferencesApplied: false,
      isProcessing: false,
      updatedPreferences: [],
      transactionError: null,
      dialog: false,
      componentDidIntitialFetch: false,
      sortingTemplate: ['EMAIL', 'SMS', 'PUSH']
    }
  },

  computed: {
    isLoggedIn () {
      return store.getters['isLoggedIn']
    },
    accountSummaryFlow () {
      return window.ctsautoconf.ACCOUNT_SUMMARY_FLOW || false
    },
    isPhoneVerified: () => store.getters['getIsPhoneVerified'],
    supportedChannels () {
      let channels = []
      this.categories && this.categories.forEach(c => {
        if (c && c.AvailableChannels) {
          c.AvailableChannels.forEach(e => {
            if (!channels.includes(e)) {
              channels.push(e)
            }
          })
        }
      })
      let sortedChannels = []
      this.sortingTemplate.forEach(c => {
        if (channels.includes(c)) {
          sortedChannels.push(c)
        }
      })
      return sortedChannels
    },
    allowAccountUpdate () {
      return store.getters['getAllowAccountUpdate']
    },
    xtremePushEnabledMobile () {
      return config.app.autoconf.XTREMEPUSH_ANALYTICS && config.app.autoconf.XTREMEPUSH_ANALYTICS.MOBILE_APP // for mobile apps only
    }
  },

  methods: {
    async init () {
      this.fetchingData = true
      try {
        await this.fetchCategories()
        if (this.categories) {
          await this.fetchPreferences()
          if (this.preferences) {
            this.applyPreferences()
            this.preferencesApplied = true
          }
        }
        this.componentDidIntitialFetch = true
      } catch (ex) {
        console.log(ex)
      } finally {
        this.fetchingData = false
      }
    },
    async fetchCategories () {
      const response = await lib.rpcService.callBroker('GamingNotificationService', 'getAllCategories')
      if (response && response.result) {
        this.categories = response.result
      }
    },
    async fetchPreferences () {
      const response = await lib.rpcService.callBroker('GamingNotificationService', 'getSubscriberPreferences')
      if (response && response.result) {
        this.preferences = response.result
      }
    },
    applyPreferences () {
      let self = this
      this.categories && this.categories.forEach(c => {
        if (c && c.Offers) {
          c.Offers.forEach(o => {
            // for each offer in category lets check user preferences
            let match = self.preferences.find(p => p.OfferId === o.OfferId)
            if (match) {
              // if preference id matches offer id, add subscription
              o.ChannelSubscriptions = match.ChannelSubscriptions
              o.ChannelSubscriptions.forEach(s => {
                self.mobileAppNotificationsPreferencesUpdate(match, s)
                if (s.Status === 'ACTIVE') {
                  s.active = true
                } else if (s.Status === 'NOT_ACTIVE') {
                  s.active = false
                }
              })
              let offerChannels = o.ChannelSubscriptions.map(e => e.Channel)
              let notSupportedChannels = self.supportedChannels.filter(x => !offerChannels.includes(x))
              if (notSupportedChannels && notSupportedChannels.length > 0) {
                notSupportedChannels.forEach(e => {
                  o.ChannelSubscriptions.push({
                    Channel: e,
                    Disabled: true
                  })
                })
              }
              let sortedSubscriptions = []
              self.sortingTemplate.forEach(c => {
                o.ChannelSubscriptions.forEach(s => {
                  if (c === s.Channel) {
                    sortedSubscriptions.push(s)
                  }
                })
              })
              o.ChannelSubscriptions = sortedSubscriptions
            }
          })
        }
      })
    },
    editPreference (pref) {
      // remove the same preference, if exists
      const index = this.updatedPreferences.findIndex(p => (p.Channel === pref.Channel && p.OfferId === pref.OfferId))
      if (index > -1) {
        this.updatedPreferences.splice(index, 1)
      }
      this.updatedPreferences.push(pref)
    },
    async reset2Defaults () {
      try {
        this.isProcessing = true
        this.transactionError = null
        this.dialog = true
        await lib.rpcService.callBroker('GamingNotificationService', 'resettodefaults', {
          'channelIds': this.supportedChannels
        })
        await this.init()
      } catch (ex) {
        this.transactionError = ex.message || this.$t('Server.ErrorMsg.Generic')
        console.log(ex)
      } finally {
        this.isProcessing = false
      }
    },
    async save () {
      try {
        this.isProcessing = true
        this.transactionError = null
        this.dialog = true
        await lib.rpcService.callBroker('GamingNotificationService', 'updatesubscriberpreferences', {
          'preferenceUpdateRequests': this.updatedPreferences
        })
        await this.init()
      } catch (ex) {
        this.transactionError = ex.message || this.$t('Server.ErrorMsg.Generic')
        console.log(ex)
      } finally {
        this.isProcessing = false
      }
    },
    mobileAppNotificationsPreferencesUpdate (preferences, subscription) {
      if (window.ctsautoconf.MOBILE_LS && this.xtremePushEnabledMobile && subscription.Channel === 'PUSH') {
        mobileBridge.bridgeSendRequest('webPushNotificationsPreferences', {'pushId': preferences.OfferId.toLowerCase(), 'status': subscription.Status.toLowerCase()})
      }
    }
  },
  mounted () {
    this.init()
  }
}
</script>

<style lang="stylus" scoped>
  @import "~@/css/config"
  .notification-preferences
    text-align center
    cursor default
    margin-bottom 20px
    .circular-progress
      margin 15px
    .info-text
      background #e5e5e5
      border-radius 5px
      padding 10px
      margin 0
      font-size 14px
    .info-text-phone
      margin-top 10px
    .categories-wrapper
      display flex
      flex-direction column
      .table_head
        margin 20px 0 10px 0
        padding 10px 5px 10px 10px
        background #e5e5e5
        color rgba(0, 0, 0, .8)
        font-size 16px
        font-family 'Open Sans Bold'
        display flex
        .title-text
          flex 6
          text-align left
        .channels
          display flex
          width 195px
        .channel
          flex 1
      .notifications-holder
        padding-left 10px
        padding-bottom 15px
        .category-name
          text-align left
          margin 0
          border-bottom: solid 1px #e2e2e2
          font-size 14px
          font-family 'Open Sans Bold'
        .channel
          display flex
          padding-top 5px
          line-height normal
          .offer-name
            flex 5
            text-align left
            @media mobile-big-and-above
              min-height 24px
          .offer-channels
            display flex
            width 195px
            >>> .v-input--checkbox
              // margin 0 10px
              padding 0
              flex 1
              justify-content center
              align-items center
              .v-input__slot
                margin 0
                padding 0
                input
                  min-height unset
              .v-messages.theme--light
                display none
              &.disabled
                .v-input__control
                  display none
</style>
