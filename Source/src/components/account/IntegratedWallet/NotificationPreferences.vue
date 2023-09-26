<template>
  <div>
    <div v-if="isLoggedIn">
      <v-layout  class="page-layout  add-funds notification-preferences">
        <v-flex class="notification-column">
          <v-form
            ref="form"
            class="form"
            lazy-validation
          >
            <h1 v-if="!accountSummaryFlow">{{ $t('Notifications.PreferencesPage.Title') }}</h1>
            <div v-if="isProcessing">
              <v-progress-circular indeterminate class="circular-progress"></v-progress-circular>
            </div>
            <div>
              <div v-if="!isProcessing">
                <div v-if="categoriesVm && categoriesVm.length">
                  <p class="info-text">{{ $t('Notifications.PreferencesPage.InfoText') }}</p>
                  <p class="info-text-phone" v-if="!isPhoneVerified"><v-icon color="blue" class="mr-1" size="16">info</v-icon>{{ $t('Notifications.PreferencesPage.Note') }}</p>
                </div>
                <div v-else>
                  <p><v-icon color="blue" class="mr-1" size="16">info</v-icon>{{ $t('Notifications.PreferencesPage.NoOptionsAvailable') }}</p>
                </div>
              </div>

              <div>
                <template v-if="!accountSummaryFlow">
                  <v-expansion-panel
                    v-model="expandedItem"
                    :disabled="isProcessing"
                    class="preferences-expansion-panel"
                  >
                    <v-expansion-panel-content v-for="(category, i) in categoriesVm" :key="i">
                      <template v-slot:header>
                        <h3 class="category-name">{{ category.Name }}</h3>
                      </template>
                      <table class="category-table">
                        <thead>
                          <tr>
                            <th>{{$t('Account.Settings.Notifications.NotifyMe')}}</th>
                            <th class="text-align-center" v-show="isChannelVisibleInCategory(category, 'email')">Email</th>
                            <th class="text-align-center" v-show="isChannelVisibleInCategory(category, 'sms')">SMS</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr v-for="(preference, j) in category.preferences" :key="j">
                            <td>{{ preference.OfferName }}</td>
                            <td class="text-align-center" v-show="isChannelVisibleInCategory(category, 'email')">
                              <v-checkbox
                                v-if="preference.channelsCheckboxes.EMAIL !== undefined"
                                :disabled="isProcessing"
                                v-model="preference.channelsCheckboxes.EMAIL"
                                class="inline-block"
                              ></v-checkbox>
                            </td>
                            <td class="text-align-center" v-show="isChannelVisibleInCategory(category, 'sms')">
                              <v-checkbox
                                v-if="isPhoneVerified && preference.channelsCheckboxes.SMS !== undefined"
                                :disabled="isProcessing"
                                v-model="preference.channelsCheckboxes.SMS"
                                class="inline-block">
                              </v-checkbox>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </v-expansion-panel-content>
                  </v-expansion-panel>
                </template>
                <!-- Account summary tempalte -->
                <template v-if="accountSummaryFlow">
                  <div
                    :disabled="isProcessing"
                    class="preferences-expansion-panel"
                  >
                    <table v-if="categoriesVm">
                      <thead>
                        <tr class="table_head">
                          <th>{{ $t('Account.Settings.Notifications.NotifyMe') }}</th>
                          <th class="text-align-center" v-show="isChannelVisibleInAnyCategory(categoriesVm, 'email')">Email</th>
                          <th class="text-align-center" v-show="isChannelVisibleInAnyCategory(categoriesVm, 'sms')">SMS</th>
                        </tr>
                      </thead>
                    </table>
                    <div class="notifications-holder" v-for="(category, i) in categoriesVm" :key="i">
                      <h3 class="category-name">{{ category.Name }}</h3>
                      <table class="category-table">
                        <tbody>
                          <tr v-for="(preference, j) in category.preferences" :key="j">
                            <td>{{ preference.OfferName }}</td>
                            <td class="text-align-center" v-show="isChannelVisibleInAnyCategory(categoriesVm, 'email')">
                              <div v-show="isChannelVisibleInCategory(category, 'email')">
                                <v-checkbox 
                                  v-if="preference.channelsCheckboxes.EMAIL !== undefined"
                                  :disabled="isProcessing"
                                  v-model="preference.channelsCheckboxes.EMAIL"
                                  class="inline-block"
                                ></v-checkbox>
                              </div>
                            </td>
                            <td class="text-align-center" v-show="isChannelVisibleInAnyCategory(categoriesVm, 'sms')">
                              <div v-show="isChannelVisibleInCategory(category, 'sms')">
                                <v-checkbox
                                  v-if="isPhoneVerified && preference.channelsCheckboxes.SMS !== undefined"
                                  :disabled="isProcessing"
                                  v-model="preference.channelsCheckboxes.SMS"
                                  class="inline-block">
                                </v-checkbox>
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </template>
                <div v-if="categoriesVm && categoriesVm.length">
                  <v-btn :disabled="isProcessing || !allowAccountUpdate" color="success" @click="save">{{$t('Notifications.PreferencesPage.Button.Save')}}</v-btn>
                  <v-btn :disabled="isProcessing || !allowAccountUpdate" color="error" @click="reset" :title="$t('Notifications.PreferencesPage.Button.Reset.Tooltip')">{{$t('Notifications.PreferencesPage.Button.Reset')}}</v-btn>
                </div>
              </div>
            </div>
          </v-form>
        </v-flex>
      </v-layout>
    </div>
    <div v-if="!isLoggedIn">
      <LoginPage></LoginPage>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import Vue from 'vue'

import Screen from '@/components/mixins/Screen'
import CircularRotate from '@/components/common/CircularRotate'
import LoginPage from '@/components/pages/LoginPage'

export default {
  mixins: [Screen],
  components: {
    CircularRotate,
    LoginPage
  },

  data () {
    return {
      categoriesVm: null,
      expandedItem: 0,
      isProcessingLocal: false
    }
  },

  computed: {
    ...mapGetters(['isLoggedIn']),
    ...mapState('notificationPreferences', ['categories']),
    ...mapGetters('phoneVerification', {
      isPhoneVerified: 'isPhoneLinked'
    }),

    isProcessing () {
      return this.isProcessingLocal || this.$store.getters['notificationPreferences/isProcessing'] || this.$store.getters['phoneVerification/isProcessing']
    },
    allowAccountUpdate () {
      return this.$store.getters['getAllowAccountUpdate']
    },
    accountSummaryFlow () {
      return window.ctsautoconf.ACCOUNT_SUMMARY_FLOW || false
    }
  },

  methods: {
    isChannelVisibleInCategory (category, channel) {
      let result = false

      if (category && category.preferences) {
        category.preferences.forEach((pref) => {
          if (pref.ChannelSubscriptions) {
            result = pref.ChannelSubscriptions.some((sub) => {
              return sub.Channel.toLowerCase() === channel.toLowerCase()
            })
          }
        })
      }

      return result
    },
    isChannelVisibleInAnyCategory (categories, channel) {
      let result = false
      if (categories) {
        categories.forEach((cat) => {
          result = this.isChannelVisibleInCategory(cat, channel)
        })
      }
      return result
    },

    async reset () {
      try {
        this.isProcessingLocal = true
        await this.$store.dispatch('notificationPreferences/resetToDefaults')
        await this.$store.dispatch('notificationPreferences/fetchPreferences')
      } finally {
        this.isProcessingLocal = false
      }
    },

    async save () {
      const vm = this.categoriesVm
      if (vm) {
        const newPreferences = []
        for (const category of vm) {
          for (const preference of category.preferences) {
            // prepare array of preferences to be sent to the server in following format:
            // newPreferences = [{
            //   "Channel": "EMAIL",
            //   "OfferId": "MM-PROMOTIONS",
            //   "Operation": "DEACTIVATE"
            // }, {
            //   "Channel": "SMS",
            //   "OfferId": "MM-PROMOTIONS",
            //   "Operation": "ACTIVATE"
            // }]
            for (const channel in preference.channelsCheckboxes) {
              if (preference.channelsCheckboxes[channel] !== undefined) {
                newPreferences.push({
                  OfferId: preference.OfferId,
                  Channel: channel,
                  Operation: preference.channelsCheckboxes[channel] ? 'ACTIVATE' : 'DEACTIVATE'
                })
              }
            }
          }
        }

        if (newPreferences.length) {
          await this.$store.dispatch('notificationPreferences/savePreferences', newPreferences)
          await this.$store.dispatch('notificationPreferences/fetchPreferences')
        }
      }
    },

    createCategoriesVm () {
      let vm = []
      if (this.$store.state.notificationPreferences.categories) {
        vm = JSON.parse(JSON.stringify(this.$store.state.notificationPreferences.categories)) // clone for local component use

        // decorate view-model with properties needed for UI
        for (const category of vm) {
          for (const preference of category.preferences) {
            Vue.set(preference, 'channelsCheckboxes', {})
            for (const channelSubscription of preference.ChannelSubscriptions) {
              Vue.set(preference.channelsCheckboxes, `${channelSubscription.Channel}`, channelSubscription.Status === 'ACTIVE')
            }
          }
        }
      }

      this.categoriesVm = vm
    },

    initialize () {
      if (this.isLoggedIn) {
        try {
          this.isProcessingLocal = true
          this.$store.dispatch('notificationPreferences/fetchPreferences')
          this.$store.dispatch('phoneVerification/getLinkStatus') // check whether phone is verified and if not we'll hide SMS checkboxes
        } finally {
          this.isProcessingLocal = false
        }
      }
    }
  },

  watch: {
    isLoggedIn (newVal, oldVal) {
      this.initialize()
    },

    categories () {
      this.createCategoriesVm()
    }
  },

  mounted () {
    this.initialize()
  }
}
</script>

<style lang="stylus" scoped>
  @import "~@/css/config"
  .notification-column
    text-align center
    .form
      margin 0 auto
      max-width 700px
      background-color #fff
      border 10px solid #fff
    #spanexpress
      display none
  .go-back
    display block
    color white
    text-align center
    margin 10px
    font-size 15px
    background #06283b
    span
      cursor pointer
      i
        position relative
        top 7px

.inline-block
  display inline-block

.category-name
  margin 0

>>> .v-expansion-panel__header
  background #f7f7f7
>>> .v-input--selection-controls__input
  margin-right 0

.category-table thead th
  background #fff
.preferences-expansion-panel
  margin-top 20px
  margin-bottom 20px

.text-align-center
  text-align center

.circular-progress
  height 22px !important
  width 22px !important

</style>
