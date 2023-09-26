<template>
  <div class="my-events-page myeventssettings" v-if="isLoggedIn && playerFavorites">
    <template v-if="!mobileBigAndBelow || !accountSummaryFlow">
      <h1>{{ $t('Favorites.MyEventsSettings') }}</h1>
    </template>
    <template v-if="mobileBigAndBelow && accountSummaryFlow">
      <div class="account-heading"><icon name="icon-acc-settings"></icon>
        {{ $t('Favorites.MyEventsSettings') }}
      </div>
    </template>
    <div class="my-events-settings-page-content">
      <v-tabs class="favorite-tabs" fixed-tabs align-with-title>
        <v-tab :class="{'active': selectedTab === 'favorites'}" @click.stop="selectTab('favorites')">{{ $t('Favorites.MyEvents.Tabs.Favorites') }}</v-tab>
        <!-- TODO - Frequently Played and Suggested -->
        <v-tab v-if="favTabs && favTabs.includes('FrequentlyPlayed')" :class="{'active': selectedTab === 'frequentlyPlayed'}" @click.stop="selectTab('frequentlyPlayed')">{{ $t('Favorites.MyEvents.Tabs.FrequentlyPlayed') }}</v-tab>
        <!-- <v-tab :class="{'active': selectedTab === 'suggested'}" @click.stop="selectTab('suggested')">{{ $t('Favorites.MyEvents.Tabs.Suggested') }}</v-tab> -->
        <v-tab :class="{'active': selectedTab === 'notifications'}" @click.stop="selectTab('notifications')">{{ $t('Favorites.MyEvents.Tabs.Notifications') }}</v-tab>
      </v-tabs>
      <template v-if="selectedTab === 'favorites' || !selectedTab">
        <div v-if="!isProcessingFavorites">
          <v-flex class="search-bar" :class="{ 'mobile': mobileBigAndBelow }">
            <div class="input-group" :class="{'non-empty' : searchFavoritesPhrase}">
              <div class="search-fields-container">
                <div class="search-icon">
                  <icon name="icon-search"></icon>
                </div>
                <input
                  type="search"
                  name="search-filed"
                  v-model="searchFavoritesPhrase"
                  class="search-filed"
                  ref="phrase"
                  placeholder="Search favorites"
                  autocomplete="off"
                  @keyup.enter="searchFavorites()" />
                <button v-show="searchFavoritesPhrase" class="reset-icon" type="reset" @click="resetFavoritesSearchPhrase()"></button>
              </div>
            </div>
          </v-flex>
          <div v-if="filteredAllFavorites && filteredAllFavorites.length > 0" class="favorites">
            <div class="favorites-header">
              <div class="col col-1">
                <span class="label">{{ $t('Favorites.Betslip.Team_Player') }}</span>
              </div>
              <div class="col col-2">
                <span class="label">{{ $t('Favorites.Betslip.Favorite') }}</span>
              </div>
              <div class="col col-3">
                <span class="label">{{ $t('Favorites.Betslip.NotifyMe') }}</span>
              </div>
            </div>
              <div class="favorite-item" v-for="(favorit, index) in filteredAllFavorites" :key="index" :class="{'active': favorit.enabled && !favorit.isfromsearch && searchFavoritesResults && searchFavoritesResults.length > 0}">
              <!-- Name of favorite - Not null for type in { P, C }. -->
              <!-- Favorite Id. Not nul for type in { S, L }. -->
              <div class="col col-1">
                <icon :name="`icon-${ (favorit.idfosporttype && favorit.idfosporttype.replace(/ /g, '')) || 'empty' }`"></icon>
                <div>
                  <span v-if="favorit.type === 'P' || favorit.type === 'C'" class="label">{{favorit.name}}</span>
                  <span v-if="favorit.type === 'S' || favorit.type === 'L'" class="label">{{favorit.idfosporttype}}</span>
                </div>
              </div>
              <div class="col col-2">
                <v-checkbox v-model="filteredAllFavorites[index].enabled" label="" :key="index"
                @change="editFavorite({
                    'source': favorit.source,
                    'type': favorit.type,
                    'idfosporttype': favorit.idfosporttype,
                    'favoriteid': favorit.favoriteid,
                    'name': favorit.name ? favorit.name : null,
                    'order': favorit.order,
                    'language': favorit.language,
                    'enabled': favorit.enabled ? true : false,
                    'tonotify': favorit.tonotify ? true : false
                  }, index)">
                </v-checkbox>
              </div>
              <div class="col col-3">
                <v-checkbox v-if="favorit.tonotify !== null" v-model="filteredAllFavorites[index].tonotify" label="" :disabled="!filteredAllFavorites[index].enabled" :key="index + '_notify'"
                @change="editFavorite({
                    'source': favorit.source,
                    'type': favorit.type,
                    'idfosporttype': favorit.idfosporttype,
                    'favoriteid': favorit.favoriteid,
                    'name': favorit.name ? favorit.name : null,
                    'order': favorit.order,
                    'language': favorit.language,
                    'enabled': favorit.enabled ? true : false,
                    'tonotify': favorit.tonotify ? true : false
                  }, index)"
                ></v-checkbox>
              </div>
            </div>
          </div>
          <div v-if="searchFavoritesPhrase && searchFavoritesPhrase.length >= numOfCharsToStartSearch && searchInProgress" class="search-fav-loading">
            <dots-loader></dots-loader>
          </div>
          <div v-if="searchFavoritesPhrase && searchFavoritesPhrase.length >= numOfCharsToStartSearch && !searchInProgress && !(searchFavoritesResults && searchFavoritesResults.length > 0)" class="favorites-noresults">
            {{ $t('Favorites.NoResultsFound') }}
          </div>
          <div v-if="filteredAllFavorites && filteredAllFavorites.length > 0" class="fav_buttons">
            <v-btn :disabled="updatedFavorites.length === 0" class="save_btn" @click="saveFavorites()">{{$t('Favorites.MyEventsSettings.Btn.Save')}}</v-btn>
            <v-btn @click="clearAll()" class="clear_btn">{{$t('Favorites.MyEventsSettings.Btn.Clear')}}</v-btn>
          </div>
          <div v-if="favTabs && favTabs.includes('FrequentlyPlayed')" class="fav_buttons reset">
            <v-btn @click="openResetFavoritesDialog()" class="clear_btn">{{$t('Favorites.MyEventsSettings.Btn.ResetFavorites')}}</v-btn>
          </div>
        </div>
        <div class="update_favorites" v-if="isProcessingFavorites">
          <dots-loader></dots-loader>
        </div>
        <v-dialog v-model="resetFavoritesDialog" max-width="400">
          <v-card class="favorites_confirmaition_dialog">
            <v-card-text class="tl-alert-msg">{{ $t('Favorites.MyEventsSettings.Btn.ResetFavoritesConfirm') }}</v-card-text>
            <v-card-actions class="fav_buttons">
              <v-btn class="save_btn" @click="resetFavorites()">{{ $t('Favorites.MyEventsSettings.Btn.Reset') }}</v-btn>
              <v-btn class="clear_btn" @click="closeResetFavoritesDialog()">{{ $t('Favorites.MyEventsSettings.Btn.Cancel') }}</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </template>
      <template v-if="selectedTab === 'frequentlyPlayed'">
        <div v-if="!isProcessingFavorites && frequentlyPlayedFavorites && frequentlyPlayedFavorites.length > 0" class="favorites_fp">
          <!-- Name of favorite - Not null for type in { P, C }. -->
          <!-- Favorite Id. Not nul for type in { S, L }. -->
          <div class="favorite-item" v-for="(favorit, index) in frequentlyPlayedFavorites" :key="index">
            <icon :name="`icon-${ (favorit.idfosporttype && favorit.idfosporttype.replace(/ /g, '')) || 'empty' }`"></icon>
            <div>
              <span v-if="favorit.type === 'P' || favorit.type === 'C'">{{favorit.name}}</span>
              <span v-if="favorit.type === 'S' || favorit.type === 'L'">{{favorit.idfosporttype}}</span>
            </div>
          </div>
          <div class="fav_buttons">
            <v-btn @click="clearFPList()" class="clear_btn">{{$t('Favorites.MyEventsSettings.Btn.ClearFP')}}</v-btn>
          </div>
        </div>
        <div v-if="!isProcessingFavorites && !(frequentlyPlayedFavorites && frequentlyPlayedFavorites.length > 0)" class="favorites_fp empty_list">
          {{$t('Favorites.MyEventsSettings.FPListEmpty')}}
        </div>
        <div class="update_favorites" v-if="isProcessingFavorites">
          <dots-loader></dots-loader>
        </div>
        <!-- TO DO -->
      </template>
      <template v-if="selectedTab === 'suggested'">
        <!-- TO DO -->
      </template>
      <template v-if="selectedTab === 'notifications'">
        <div v-if="!isProcessingPreferences">
          <div class="ctsform fav_notifications_form">
            <div class="notification_item">
              <div class="notifications_header">{{$t('Favorites.MyEventsSettings.Notification')}}</div>
              <div class="control-block cs" :class="{ 'filled': notificationBeforeStart }">
                <v-select class="custom-select" :menu-props="{ contentClass: 'select_list' }"
                  v-model.trim="notificationBeforeStart"
                  id="notification_interval"
                  :items="notificationBeforeStartOptions"
                  label=""
                ></v-select>  
                <label class="control-label">{{ $t('Favorites.MyEventsSettings.Notification.Desc') }}</label>
              </div>
            </div>
            <div class="notification_item">
              <div class="notifications_header">{{$t('Favorites.MyEventsSettings.Notification.Max')}}</div>
              <span class="desc">{{$t('Favorites.MyEventsSettings.Notification.Max.Desc')}}</span>
              <div class="control-block" :class="{ 'filled': notificationsMaxPerDay }">
                <input type="text" inputmode="numeric" v-model="notificationsMaxPerDay" id="notificationsMaxPerDay" autocomplete="off" maxlength="50"/>
                <label class="control-label">{{ $t('Favorites.MyEventsSettings.Notification.Max.Placeholder') }}</label>
              </div>
              <div v-if="maxNotificationsError">
                <div class="vmsg invalid" v-html="$t('Favorites.MyEventsSettings.Notification.Max.Error')"></div>
              </div>
            </div>
            <!-- <div class="notification_item">
              <div class="notifications_header">{{$t('Favorites.MyEventsSettings.Notification.QuietHours')}}</div>
              <span class="desc">{{$t('Favorites.MyEventsSettings.Notification.QuietHours.Desc')}}</span>
              <div class="timepicker_holder">
                <div class="control-block cs" :class="{ 'filled': notificationsStopFrom }">
                  <v-select class="custom-select" :menu-props="{ contentClass: 'select_list' }"
                    v-model="notificationsStopFrom"
                    id="notificationsStopFrom"
                    :items="notificationsIntervals"
                    label=""
                  ></v-select>  
                  <label class="control-label">{{ $t('Favorites.MyEventsSettings.Notification.QuietHours.From') }}</label>
                </div>
                <div class="control-block cs" :class="{ 'filled': notificationsStopTo }">
                  <v-select class="custom-select" :menu-props="{ contentClass: 'select_list' }"
                    v-model="notificationsStopTo"
                    id="notificationsStopTo"
                    :items="notificationsIntervals"
                    label=""
                  ></v-select>  
                  <label class="control-label">{{ $t('Favorites.MyEventsSettings.Notification.QuietHours.To') }}</label>
                </div>
              </div>
            </div> -->
            <div class="fav_buttons">
              <v-btn :disabled="maxNotificationsError" @click="saveCustomerPreferences()" class="save_btn">{{$t('Favorites.MyEventsSettings.Btn.Save')}}</v-btn>
              <v-btn @click="cancelUpdatepreferences()" class="clear_btn">{{$t('Favorites.MyEventsSettings.Btn.Cancel')}}</v-btn>
            </div>
          </div>
        </div>
        <div class="update_favorites" v-if="isProcessingPreferences">
          <dots-loader></dots-loader>
        </div>
      </template>
    </div>
  </div>
</template>

<script>

import store from '@/store'
import Vue from 'vue'
import lib from '@/library'
import CircleLoader from '@/components/common/CircleLoader'
import Icon from '@/components/common/Icon'
import Screen from '@/components/mixins/Screen'
import dotsLoader from '@/components/common/DotsLoader'

export default {
  components: {
    CircleLoader,
    Icon,
    dotsLoader
  },
  mixins: [
    Screen
  ],

  data () {
    return {
      selectedTab: '',
      updatedFavorites: [],
      isProcessingFavorites: false,
      isProcessingPreferences: false,
      favoritesSearchTimeoutObj: undefined,
      numOfCharsToStartSearch: window.ctsautoconf.SEARCH_NUMBER_OF_CHARS_TO_START || 3,
      notifications_stop_from: undefined,
      notifications_stop_to: undefined,
      maxNotificationsError: false,
      resetFavoritesDialog: false
    }
  },

  mounted () {
    this.getFavNotificationPeriods()
    this.getUserPreferences()
    this.selectTab('favorites')
  },

  computed: {
    playerFavorites () {
      return window.ctsautoconf.PLAYER_FAVORITES || false
    },
    isLoggedIn () {
      return store.getters['isLoggedIn']
    },
    suggestedFavorites () {
      // TO DO
    },
    frequentlyPlayedFavorites () {
      return store.getters['favorites/getFPFavorites'] || []
    },
    accountSummaryFlow () {
      return window.ctsautoconf.ACCOUNT_SUMMARY_FLOW || false
    },
    enabledFavorites () {
      return this.filteredAllFavorites.filter(item => (item.enabled === true || item.tonotify === true))
    },
    searchFavoritesPhrase: {
      get: () => {
        return store.getters['favorites/getSearchFavoritesPhrase']
      },
      set: (value) => {
        store.commit('favorites/setSearchFavoritesPhrase', value.replace(/[^a-zA-Z0-9 ]/g, ''))
      }
    },
    searchFavoritesResults () {
      let results = store.getters['favorites/getSearchFavoritesResults'] || []
      results.forEach((favorit) => {
        favorit.isfromsearch = true
      })
      return results
    },
    searchInProgress () {
      return store.getters['favorites/getSearchInProgress']
    },
    allFavorites () {
      var allfav = store.getters['favorites/getAllFavorites'] || []
      var results = allfav
      if (this.searchFavoritesResults) {
        var searchresults = this.searchFavoritesResults || []
        results = allfav.concat(searchresults)
      }
      return results
    },
    filteredAllFavorites () {
      var results = this.allFavorites
      var filtered = []
      const isDuplicate = (item, arr) => {
        return arr.some(el => item.source === el.source && item.type === el.type && item.name === el.name && item.idfosporttype === el.idfosporttype && item.favoriteid === el.favoriteid)
      }
      for (const item of results) {
        if (!isDuplicate(item, filtered)) filtered.push(item)
      }
      if (!this.searchFavoritesResults) {
        return Vue._.orderBy(filtered, 'order', 'asc')
      } else {
        return filtered
      }
    },
    notificationsIntervals () {
      let times = []
      var hours = '00/01/02/03/04/05/06/07/08/09/10/11/12/13/14/15/16/17/18/19/20/21/22/23'.split('/')
      var minutes = '00/05/10/15/20/25/30/35/40/45/50/55'.split('/')
      for (var h = 0; h < hours.length; h++) {
        for (var m = 0; m < minutes.length; m++) {
          var item = hours[h] + ':' + minutes[m]
          times.push(item)
        }
      }
      return times
    },
    notificationBeforeStart: {
      get () {
        return parseInt(store.getters['favorites/getCPFavouriteNotificationNotifyBeforeStart']) || undefined
      },
      set (value) {
        if (value) {
          store.commit('favorites/setCPFavouriteNotificationNotifyBeforeStart', value)
        } else {
          store.commit('favorites/setCPFavouriteNotificationNotifyBeforeStart', undefined)
        }
      }
    },
    notificationsMaxPerDay: {
      get () {
        return store.getters['favorites/getCPFavouriteNotificationMaxPerDay'] || undefined
      },
      set (value) {
        if (value) {
          store.commit('favorites/setCPFavouriteNotificationMaxPerDay', value)
          let numRegEx = /^\d+$/
          if (numRegEx.test(value) || store.getters['favorites/getCPFavouriteNotificationMaxPerDay'].length === 0) {
            this.maxNotificationsError = false
          } else {
            this.maxNotificationsError = true
          }
        } else {
          store.commit('favorites/setCPFavouriteNotificationMaxPerDay', undefined)
          this.maxNotificationsError = false
        }
      }
    },
    notificationsStopFrom: {
      get () {
        return this.notifications_stop_from || undefined
      },
      set (value) {
        if (value) {
          this.notifications_stop_from = value
        } else {
          this.notifications_stop_from = undefined
        }
      }
    },
    notificationsStopTo: {
      get () {
        return this.notifications_stop_to || undefined
      },
      set (value) {
        if (value) {
          this.notifications_stop_to = value
        } else {
          this.notifications_stop_to = undefined
        }
      }
    },
    allFavNotificationPeriods () {
      return store.getters['favorites/getFavNotificationPeriods'] || []
    },
    notificationBeforeStartOptions () {
      var self = this
      var items = []
      for (var i = 0; i < self.allFavNotificationPeriods.length; i++) {
        var item = {
          text: self.allFavNotificationPeriods[i].description,
          value: self.allFavNotificationPeriods[i].periodminutes
        }
        items.push(item)
      }
      return items
    },
    betPlacementResult () {
      return store.getters['sbBetslipState/betPlacementResponse']
    },
    favTabs () {
      return window.ctsautoconf.PLAYER_FAVORITES_TABS || ['PlayerFavorites', 'FrequentlyPlayed']
    }
  },

  methods: {
    editFavorite (favorite, index) {
      if (this.filteredAllFavorites[index].tonotify && this.filteredAllFavorites[index].tonotify === true && this.filteredAllFavorites[index].enabled === false) {
        this.filteredAllFavorites[index].tonotify = false
      }
      // Favorite iz unique based on combination of: source, type, name, idfosporttype and favoriteid
      const i = this.updatedFavorites.findIndex(item => (item.source === favorite.source && item.type === favorite.type && item.name === favorite.name && item.idfosporttype === favorite.idfosporttype && item.favoriteid === favorite.favoriteid))
      if (i > -1) {
        this.updatedFavorites.splice(i, 1)
      }
      this.updatedFavorites.push(favorite)

      // Remove system favorite (if enabled) from array for update, since system favorite can only be deleted or disabled (can't be enabled by user)
      if (favorite.source === 'S' && favorite.enabled === true) {
        var sysFav = this.updatedFavorites.indexOf(favorite)
        this.updatedFavorites.splice(sysFav, 1)
      }
    },
    getAllFavorites () {
      store.dispatch('favorites/fetchAllFavorites')
    },
    getFPFavorites () {
      store.dispatch('favorites/fetchFPFavorites')
    },
    selectTab (tab) {
      this.selectedTab = tab
      if (this.selectedTab === 'frequentlyPlayed') {
        this.getFPFavorites()
      }
      if (this.selectedTab === 'favorites') {
        this.getAllFavorites()
      }
    },
    saveFavorites () {
      this.isProcessingFavorites = true
      lib.rpcService.callBroker('playerfavorites', 'setfavorites', {
        'favorites': this.updatedFavorites
      }).then((response) => {
        if (response) {
          this.getAllFavorites()
          this.resetFavoritesSearch()
          this.resetFavoritesSearchPhrase()

          if (this.betPlacementResult && this.betPlacementResult.IDFOBetSlip) {
            store.dispatch('favorites/fetchFavoritesCandidatesByBetslipId', { idfobetslip: this.betPlacementResult.IDFOBetSlip })
          }
          this.updatedFavorites = []
        } else {
          this.isProcessingFavorites = false
        }
      }).catch(() => {
        console.log('UPS!!! on SAVE Fav - Show error message')
      }).finally(() => {
        this.isProcessingFavorites = false
      })
    },
    clearAll () {
      this.enabledFavorites.forEach((favorite) => {
        if (favorite.enabled) {
          favorite.enabled = false
        }
        if (favorite.tonotify) {
          favorite.tonotify = false
        }
        // Favorite iz unique based on combination of: source, type, name, idfosporttype and favoriteid
        const i = this.updatedFavorites.findIndex(item => (item.source === favorite.source && item.type === favorite.type && item.name === favorite.name && item.idfosporttype === favorite.idfosporttype && item.favoriteid === favorite.favoriteid))
        if (i > -1) {
          this.updatedFavorites.splice(i, 1)
        }
        this.updatedFavorites.push(favorite)
      })
    },
    clearFPList () {
      let fpFavorites = this.frequentlyPlayedFavorites || []
      fpFavorites.forEach((favorit) => {
        favorit.enabled = false
      })
      this.isProcessingFavorites = true
      lib.rpcService.callBroker('playerfavorites', 'setfavorites', {
        'favorites': fpFavorites
      }).then((response) => {
        if (response) {
          this.getFPFavorites()
          if (this.betPlacementResult && this.betPlacementResult.IDFOBetSlip) {
            store.dispatch('favorites/fetchFavoritesCandidatesByBetslipId', { idfobetslip: this.betPlacementResult.IDFOBetSlip })
          }
          fpFavorites = []
        } else {
          this.isProcessingFavorites = false
        }
      }).catch(() => {
        console.log('UPS!!! on SAVE Fav - Show error message')
      }).finally(() => {
        this.isProcessingFavorites = false
      })
    },
    openResetFavoritesDialog () {
      this.resetFavoritesDialog = !this.resetFavoritesDialog
    },
    closeResetFavoritesDialog () {
      this.resetFavoritesDialog = !this.resetFavoritesDialog
    },
    resetFavorites () {
      this.isProcessingFavorites = true
      lib.rpcService.callBroker('playerfavorites', 'resetfavorites').then((response) => {
        if (response) {
          this.getAllFavorites()
          this.resetFavoritesSearch()
          this.resetFavoritesSearchPhrase()
          if (this.betPlacementResult && this.betPlacementResult.IDFOBetSlip) {
            store.dispatch('favorites/fetchFavoritesCandidatesByBetslipId', { idfobetslip: this.betPlacementResult.IDFOBetSlip })
          }
          this.updatedFavorites = []
        } else {
          this.isProcessingFavorites = false
        }
      }).catch(() => {
        console.log('UPS!!! on Reset Fav - Show error message')
      }).finally(() => {
        this.isProcessingFavorites = false
        this.closeResetFavoritesDialog()
      })
    },
    resetFavoritesSearchPhrase () {
      store.commit('favorites/setSearchFavoritesPhrase', '')
    },
    resetFavoritesSearch () {
      store.dispatch('favorites/clearFavoritesResults')
    },
    startSearch (noTimeout) {
      clearTimeout(this.favoritesSearchTimeoutObj)
      this.favoritesSearchTimeoutObj = setTimeout(() => {
        store.dispatch('favorites/fetchFavoritesSearchResults')
      }, noTimeout ? 0 : 1000)
    },
    searchFavorites (noTimeout) {
      if (!this.searchFavoritesPhrase) {
        this.resetFavoritesSearch()
      }
      if (this.searchFavoritesPhrase && this.searchFavoritesPhrase.length >= this.numOfCharsToStartSearch) {
        this.startSearch(noTimeout)
      } else {
        this.resetFavoritesSearch()
      }
    },
    getFavNotificationPeriods () {
      store.dispatch('favorites/fetchFavNotificationPeriods')
    },
    getUserPreferences () {
      store.dispatch('favorites/fetchCustomerPreferences')
    },
    saveCustomerPreferences () {
      this.isProcessingPreferences = true
      lib.rpcService.callBroker('user', 'setcustomerpreferences', {
        'preferences': [
          {'name': 'FavouriteNotificationMaxPerDay', 'value': this.notificationsMaxPerDay},
          {'name': 'FavouriteNotificationNotifyBeforeStart', 'value': this.notificationBeforeStart}
        ]
      }).then((response) => {
        if (response) {
          this.getUserPreferences()
        }
      }).catch(() => {
        console.log('UPS!!! on SAVE Preferences - Show error message')
      }).finally(() => {
        this.isProcessingPreferences = false
      })
    },
    cancelUpdatepreferences () {
      this.getUserPreferences()
      this.maxNotificationsError = false
    }
  },
  watch: {
    searchFavoritesPhrase () {
      this.searchFavorites()
    }
  }
}
</script>

<style scoped lang="stylus">
@import '~@/css/config'
@import '~@/css/mixins'

.my-events-settings-page-content
  padding 5px !important
  .favorite-tabs
    background #f2f2f2
    >>>.v-tabs__container
      height 46px
    >>>.v-tabs__div
      a
        text-transform none !important
        color #003764 !important
        font-family: 'Open Sans SemiBold' !important
    >>>.v-tabs__div.active
      background #fff !important
    >>>.v-tabs__bar
      margin 0 0 10px 0
.favorites
  width: 100% 
  display block
  margin-top 20px
  .favorites-header
    display flex
    width: 100% !important
    justify-content: space-between
    font-family 'Open Sans Bold'
    text-transform: uppercase
    padding 5px
    background #003764
    align-items center
    margin-bottom 10px
    min-height 30px
    .col-1
      justify-content: flex-start
      color #fff
      text-align left
      flex-basis 40%
      line-height normal
    .col-2
    .col-3
      justify-content: flex-start
      color #ff9016
      text-align left
      flex-basis 20%
      line-height 14px
  .favorite-item
    display flex
    width: 100% !important
    justify-content: space-between
    padding 0px 5px
    align-items center
    &.active
      background #f2f2f2
      &:first-child
        padding-top 5px
      &:last-child 
        padding-bottom 5px 
    .col-1
      flex-basis 40%
      text-align left
      display flex
      justify-content: flex-start
      align-items center
      >>>.igt-icon
        padding-right 5px
      >>>.font-icon
        font-size 16px
    .col-2
    .col-3
      flex-basis 20%
      justify-content: flex-start
  >>>.v-input--selection-controls
    margin-top 0 !important
    height 30px
    &.v-input--checkbox
      .v-icon
        color #003764 !important
    .v-input--selection-controls__ripple.accent--text
      color #003764 !important
    &.v-input--is-disabled
      opacity 0.5
.favorites-noresults
  border-top 1px solid #f2f2f2
  display flex
  justify-content: center
  padding 20px
  margin-top 10px
  font-family 'Open Sans SemiBold'
.search-fav-loading
  margin-top 10px
  >>>.dots-loader
    display flex
    justify-content: center
.search-bar
  .input-group
    margin-bottom 0px
    position relative
    &.non-empty
      .search-fields-container
        .search-filed
          color #445058
    .search-icon
      position absolute
      top 8px
      left 15px
      width 18px
      height 18px
    >>>.font-icon-search
      color #003764
    .search-fields-container
      position relative
      .search-filed
        height 40px
        width 100%
        background #fff
        padding 0 10px 0 42px
        border-radius 4px
        border: solid 1px #003764
        font-size 14px
        -webkit-appearance: none
        &::placeholder
          color #BDC3C6
        &:active
        &:focus
          border: solid 1px #ff9016
          outline none
          -webkit-appearance: none
      .reset-icon
        background url("~@/assets/images/icons/icon-close-grey.svg") no-repeat center
        background-size 10px
        width 18px
        height 18px
        position absolute
        z-index 1
        right 20px
        top 11px
        cursor pointer
        border none
      .close-icon
        width 17%
        display none
        text-align center
        position absolute
        right 10px
        top 15px
        cursor pointer
.fav_buttons
  display flex
  justify-content center
  padding-top 10px
  padding-bottom 10px
  &.reset
    padding-top 0px
.notification_item
  padding 5px 0
  .desc
    padding 10px 0
    display block
    font-size 13px
  .timepicker_holder
    display flex
    justify-content: space-between
    .control-block
      width 100%
    .control-block:first-child
      margin-right 10px
  .custom-select
    font-size 14px
    >>>.v-select__slot
      background: transparent !important
      border: 0px !important
      z-index 5
    >>>.v-input__slot
      &:after
      &:before
        display none !important
    >>>.v-messages
      display none !important
.ctsform.fav_notifications_form .control-label
  height: 45px
  padding: 20px 0px 0
  line-height 12px
  text-transform: none !important
  font-size 13px !important
  font-family 'Open Sans SemiBold'
.ctsform.fav_notifications_form .filled .control-label,
.ctsform.fav_notifications_form input:focus + .control-label
  padding-top 0px
.control-block.cs
  margin-top 10px
  margin-bottom 5px
  .control-label
    padding: 20px 10px 0 0
.ctsform.fav_notifications_form input[type=text]
  padding 20px 10px 5px
  font-weight normal
.notifications_header
  border-bottom 1px solid #f2f2f2
  font-family 'Open Sans SemiBold'
  font-size 16px
.update_favorites
  >>>.dots-loader
    display flex
    justify-content: center
    box-shadow none

.favorites_fp
  padding 10px 0
  &.empty_list
    text-align center
    padding-top 40px
    padding-bottom 40px
    font-size 18px
    font-family 'Open Sans Bold'
    @media mobile-big-and-below
      font-size 16px
  .favorite-item
    padding 3px 10px
    font-size 14px
    display flex
    width: 100% !important
    justify-content: flex-start
    align-items center
    >>>.igt-icon
      padding-right 5px
    >>>.font-icon
      font-size 16px
      color #003764
    &:hover
      cursor pointer

</style>