<template>
  <div>
    <v-layout row justify-center>
      <v-dialog v-model="dialog" persistent max-width="320">
        <v-card :class="[{'session_expired': sessionExpired}, {'logout-success': brandKey === 'sb' && !sessionExpired}]">
          <div v-if="pageLoader"><circle-loader></circle-loader></div>
          <template v-if="!pageLoader && brandKey!== 'sb'">
            <v-card-title v-if="!sessionExpired" class="headline">{{ $t('Account.Logout.successful') }}</v-card-title>
            <v-card-title v-if="sessionExpired" class="headline">{{ $t('Account.Logout.session') }}</v-card-title>
            <v-card-actions>
              <v-btn class="primary-btn-blue" @click.native="goToHome()">{{ $t('Account.Logout.successful.ok') }}</v-btn>
            </v-card-actions>
          </template>
          <template v-if="!pageLoader && brandKey=== 'sb'">
            <template class="logout-success" v-if="!sessionExpired">
              <img :src="mediaServer('/static/brand-img/sb/SB_'+ state + '.png')" alt="sb"/>
              <v-card-title v-if="!sessionExpired" class="headline">{{ $t('Account.Logout.successful') }}</v-card-title>
            <div class="comeback">{{ $t('Account.Logout.session.comeback')}}</div>
            </template>
            <!-- <v-card-title v-if="!sessionExpired" class="headline">{{ $t('Account.Logout.successful') }}</v-card-title> -->
            <template v-if="sessionExpired">
              <img :src="mediaServer('/static/brand-img/sb/SB_'+ state + '.png')" alt="sb"/>
              <v-card-title class="headline">{{ $t('Account.Logout.session') }}</v-card-title>
              <div class="comeback">{{ $t('Account.Logout.session.comeback')}}</div>
            </template>
            <v-card-actions>
              <v-btn class="primary-btn-blue" @click.native="goToHome()">{{ $t('Account.Logout.successful.ok') }}</v-btn>
            </v-card-actions>
            <v-card class="logout-success rg-txt" v-if="brandKey === 'sb' && state === 'NJ'">
              <span v-html="$t('Logout.InfoMessage.' + state)"></span>
            </v-card>
          </template>
        </v-card>
      </v-dialog>
    </v-layout>
  </div>
</template>
<script>
import store from '@/store'
import config from '@/config'
import Branding from '@/components/mixins/Branding'
import CircleLoader from '@/components/common/CircleLoader'
import Url from '@/components/mixins/Url'
import Screen from '@/components/mixins/Screen'

export default {
  name: 'LogoutPage',

  mixins: [
    Branding,
    Url,
    Screen
  ],

  components: {
    CircleLoader
  },

  computed: {
    isOpenedFromWebView () {
      return store.getters['getIsOpenedFromWebView']
    },
    walletProvider () {
      return config.app.autoconf.WALLET_PROVIDER
    },
    pageLoader () {
      return store.getters['getPageLoader']
    },
    sessionExpired () {
      return store.getters['getSessionExpired']
    },
    state () {
      return config.app.autoconf.STATE
    }
  },
  data () {
    return {
      dialog: true,
      retainBetSlipSelections: false
    }
  },
  mounted () {
    this.logout()
  },
  methods: {
    goToHome () {
      store.commit('setSessionExpired', false)
      this.$router.push({name: 'sports', params: { }})
    },
    logout () {
      if (this.$route.params.type === '401') {
        this.retainBetSlipSelections = true
      }
      store.dispatch('logout', this.retainBetSlipSelections)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus">

.url-state-name-logout
  .v-dialog
    padding 0
  .v-dialog--active
    background-color transparent
    .logo
      img
        width 240px
        display block
        margin 10px auto
    .primary-btn-blue
      width 100%
    .gambler
      padding 8px 16px 16px 16px
</style>
