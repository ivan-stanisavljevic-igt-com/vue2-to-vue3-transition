<template>
  <div class="bet-history-page">
    <div class="accpage bet-history" v-if="isLoggedIn">
      <template v-if="!mobileBigAndBelow || !accountSummaryFlow">
        <h1 v-if="brandKey !== 'sb'">{{ $t('Account.BetHistory') }}</h1>
        <h1 v-if="brandKey === 'sb'">{{ $t('Account.BetHistory.' + historystate) }}</h1>
      </template>
      <template v-if="mobileBigAndBelow && accountSummaryFlow">
        <div v-if="brandKey !== 'sb'" class="account-heading"><icon name="icon-settled-bets"></icon>
          {{ $t('Account.BetHistory') }}
        </div>
        <div v-if="brandKey === 'sb'" class="account-heading"><icon :name="'icon-' + historystate + '-bets'"></icon>
          {{ $t('Account.BetHistory.' + historystate) }}
        </div>
      </template>
      <div class="hs_tabs" :class="{'hidden' : brandKey === 'sb'}">
          <span class="selectHolder" v-if="historyQueryTypesItems && historyQueryTypesItems.length > 1">
          <v-select v-model="historyQueryType" @click.stop="doNothing()" class="asMenu"
                    @change="setTabHistoryAuto()"
                    :items="historyQueryTypesItems"
                    :label="''"></v-select>
        </span>
        <span @click="setTab('HistoryActive', true)" :class="{ 'tab':true, 'active': historystate==='active' }">
          <a class="a-link- history-tab"><span>{{ $t('BetSlipPage.tab.History.active') }}</span></a>
        </span>
        <span @click="setTab('HistorySettled')" :class="{ 'tab':true, 'active': historystate==='settled' }">
          <a class="a-link- history-tab"><span>{{ $t('BetSlipPage.tab.History.settled') }}</span></a>
        </span>
        <span v-if="historystate==='all'" @click="setTab('HistoryAll')" :class="{ 'tab':true, 'active': historystate==='all' }">
          <a class="a-link- history-tab"><span>{{ $t('BetSlipPage.tab.History.all') }}</span></a>
        </span>
      </div>
      <statement v-if="historystate==='active'" :selectedState="'Open'"></statement>
      <statement v-if="historystate==='settled'" :selectedState="'NonOpen'"></statement>
      <statement v-if="historystate==='all' || historystate===''" :selectedState="'All'"></statement>
    </div>
  </div>
</template>

<script>
  import store from '@/store'
  import Screen from '@/components/mixins/Screen'
  import Statement from '@/components/account/Statement'
  import Branding from '@/components/mixins/Branding'
  import Icon from '@/components/common/Icon'

  export default {
    name: 'BetHistory',

    mixins: [
      Screen,
      Branding
    ],

    components: {
      Statement,
      Icon
    },

    data: () => ({
      historyQueryType: ''
    }),

    computed: {
      historystate () {
        return this.$route.params.state
      },
      isLoggedIn () {
        return store.getters['isLoggedIn']
      },
      useBuyBack () {
        return store.getters['statementState/useBB']
      },
      historyQueryTypes () {
        return store.getters['statementState/historyQueryTypes']
      },
      activeQueryType () {
        return store.getters['statementState/activeQueryType']
      },
      historyQueryTypesItems () {
        if (!this.historyQueryTypes.length) {
          return
        }
        var self = this
        //
        var items = [
        ]
        for (var i = 0; i < self.historyQueryTypes.length; i++) {
          var item = {
            text: self.$t('Account.BetHistory.QueryType.' + self.historyQueryTypes[i]),
            value: self.historyQueryTypes[i]
          }
          items.push(item)
        }

        self.historyQueryType = self.activeQueryType || self.historyQueryTypes[0]
        return items
      },
      accountSummaryFlow () {
        return window.ctsautoconf.ACCOUNT_SUMMARY_FLOW || false
      }
    },
    methods: {
      setTab (tab, activeTab) {
        let initObj = { }
        switch (tab) {
          case 'HistoryActive':
            initObj.fetchHistory = true
            initObj.queryType = this.historyQueryType
            initObj.queryStatus = 'Open'
            initObj.historyDateRange = { from: null, to: null }
            if (activeTab) {
              this.$router.push({ name: 'history-state', params: { state: 'active' } })
            }
            break
          case 'HistorySettled':
            initObj.fetchHistory = true
            initObj.queryType = this.historyQueryType
            initObj.queryStatus = 'NonOpen'
            initObj.historyDateRange = { from: new Date(), to: new Date() }
            initObj.historyDateRange.from.setDate(initObj.historyDateRange.from.getDate() - 7) // move from 7 days in the past
            this.$router.push({ name: 'history-state', params: { state: 'settled' } })
            break
          case 'HistoryAll':
            initObj.fetchHistory = true
            initObj.queryStatus = 'All'
            initObj.historyDateRange = { from: new Date(), to: new Date() }
            initObj.historyDateRange.from.setDate(initObj.historyDateRange.from.getDate() - 7) // move from 7 days in the past
            this.$router.push({ name: 'history-state', params: { state: 'all' } })
            break
          default:
            this.$router.push({ name: 'history-state', params: { state: 'active' } })
            break
        }
        store.dispatch('statementState/initStatement', initObj)
      },
      setTabHistoryAuto () {
        if (this.historystate) {
          switch (this.historystate) {
            case 'active':
              this.setTab('HistoryActive')
              break
            case 'settled':
              this.setTab('HistorySettled')
              break
            case 'all':
              this.setTab('HistoryAll')
              break
            default:
              this.setTab('HistoryAll')
              break
          }
        }
      }
    },
    watch: {
      historystate () {
        this.setTabHistoryAuto()
      }
    },
    mounted () {
      this.setTabHistoryAuto()
    }
  }
</script>

<style lang="stylus" scoped>
  @import '~@/css/config'
  @import '~@/css/mixins'
  .bet-history
    .hs_tabs
      display flex
      justify-content center
      align-items center
      padding-bottom 20px
    .tab 
      padding 5px 15px
      margin 0 5px
      height 34px !important
      min-height 34px
      border 1px solid #0b4da1 !important
      display flex
      align-items center
      cursor pointer
      a
        color #0b4da1!important
      &.active
        background #0b4da1!important
        a
          color #fff !important
>>>.fdr-wrap
  width 400px
  max-width 90%
  margin 0 auto

.selectHolder
  position relative
  width: 40%


</style>
