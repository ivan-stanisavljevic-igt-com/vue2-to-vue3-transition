<template>
  <div class="menu_holder">
    <template v-if="brandLayout !== 'generic'">
      <div class="sports-menu">
        <logo v-if="brandKey==='boyd'"></logo>
        <div v-if="(brandKey === 'dn' || brandKey === 'dnw' || brandKey === 'sb')" class="wrapper navigation">
          <h3  @click="goToHome()">
            <icon name="icon-home"></icon>Home
          </h3>
          <h3 v-if="isLoggedIn" @click="toggleMyAccount()" class="account" :class="{'active': dialogMyAccount}">
            <v-icon class="icon-user">account_circle</v-icon>
            <span>{{ $t('MyAccount.Account') }}</span>
          </h3>
        </div>
        <div v-if="brandKey === 'qcasino' || brandKey === 'pr'" class="wrapper navigation">
          <h3 v-if="brandKey === 'qcasino'"  @click="toggleMyAccount()">
            <icon name="icon-home"></icon>Q PROFILE
          </h3>
          <h3 v-else @click="toggleMyAccount()">
            <icon name="icon-home"></icon>MY PROFILE
          </h3>
        </div>
        <div v-if="brandKey === 'circa'" class="wrapper navigation">
          <h3  @click="goToHome()">
            <icon name="icon-home"></icon>Home
          </h3>
        </div>
        <div v-if="brandKey==='boyd'" class="wrapper main-navigation navigation">
          <site-navigation :navigation-section="'MAIN_NAVIGATION'" class="about-us navigation"></site-navigation>
        </div>
        <div class="wrapper sports-az navigation">
          <site-navigation :navigation-section="'ABOUT_US'" class="about-us navigation"></site-navigation>
        </div>
      </div>
      <div v-if="(brandKey === 'dn' || brandKey === 'dnw')" class="menu_footer">
        <div class="footer_logo">
          <img :src="mediaServer('/static/brand-img/dn/wv-lottery-logo-black.png')" alt="wv-lottery-logo">
        </div>
        <div class="footer_text">
          {{ $t('Footer.responsible') }}
        </div>
      </div>
    </template>
    <template v-if="brandLayout === 'generic'">
      <div class="sports-menu">
        <site-navigation :navigation-section="'ABOUT_US'" class="about-us navigation"></site-navigation>
      </div>
    </template>
  </div>
</template>
<script>
  import store from '@/store'
  import router from '@/router'
  import SiteNavigation from '@/components/common/SiteNavigation'
  import Screen from '@/components/mixins/Screen'
  import config from '@/config'
  import Icon from '@/components/common/Icon'
  import Logo from '@/components/common/Logo'
  import Branding from '@/components/mixins/Branding'
  import Session from '@/components/mixins/Session'
  import Url from '@/components/mixins/Url'

  export default {
    name: 'hamburger-menu',

    mixins: [
      Screen,
      Session,
      Branding,
      Url
    ],
    components: {
      SiteNavigation,
      Icon,
      Logo
    },
    data () {
      return {
        menuOpened: false
      }
    },
    methods: {
      toggleMyAccount () {
        if (this.dialogMyAccount) {
          store.dispatch('overlayState/deactivateMyAccountDialog')
        } else {
          store.dispatch('overlayState/activateMyAccountDialog')
          this.goToHome()
        }
      },
      goToHome () {
        if (router.currentRoute.name !== 'sports') {
          router.push('/sports')
        }
        store.dispatch('overlayState/deactivateHamburgerMenu')
      }
    },
    computed: {
      externalUrls () {
        return config.externalUrls
      },
      dialogMyAccount () {
        return store.getters['overlayState/getMyAccountDialogState']
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped>
@import "~@/css/config"

a
    color #06283b
h5
  vertical-align: middle
ul li
  padding 12px 0
  border-bottom 2px solid #e9eef5
  .pd-icon
    padding-right 10px
    font-size 30px
.expansion-panel__container--active
  .expansion-panel__header
    h3
      font-weight bold !important
.expansion-panel
  .site-navigation
    margin-left 27px
</style>
