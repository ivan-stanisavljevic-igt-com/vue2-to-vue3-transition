<template>
  <v-dialog
    content-class="welcome-dialog"
    v-model="show"
    fullscreen
    persistent>

    <div class="background" :style="backgroundImageUrl">
      <div class="content">
        <login-component></login-component>
        <headlinesLight class="main" category="WelcomeBanner"></headlinesLight>
      </div>
      <div class="footer">
        <div class="lottery-logo" v-if="(brandKey === 'dn' || brandKey === 'dnw')">
          <img :src="mediaServer('/static/brand-img/' + brandKey + '/wv-lottery.png')"/>
        </div>
        <static-content :staticcontentpath="'/static/welcome/footer.html'" :method="'html'" fullPath class="text"></static-content>
      </div>
    </div>

  </v-dialog>
</template>

<script>
// import config from '@/config'
import store from '@/store'

import LoginComponent from '@/components/core/LoginComponent'
import StaticContent from '@/components/common/StaticContent'
import HeadlinesLight from '@/components/sports/bettingoffer/headlinesLight'
import Branding from '@/components/mixins/Branding'
import Screen from '@/components/mixins/Screen'
import Url from '@/components/mixins/Url'

export default {
  props: {

  },

  data () {
    return {
      show: true,
      scrollTags: null
    }
  },

  components: {
    LoginComponent,
    StaticContent,
    HeadlinesLight
  },

  mixins: [
    Url,
    Screen,
    Branding
  ],

  computed: {
    isLoggedIn () {
      return store.getters['isLoggedIn']
    },
    backgroundImageUrl () {
      var path = this.mediaServer('/static/welcome/background.jpg')
      // var path = this.staticAbsolutePath + '/static/welcome/background.jpg'

      return {
        backgroundImage: `url(${path})`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center'
      }
    },
    staticContentPath () {
      return this.mediaServerHostname() + this.staticcontentpath
    }
  },

  methods: {
    close () {
      this.enableScroll()
      store.dispatch('overlayState/deactivateWelcomeDialog')
      this.removeBodyClass('welcome-page-active')
    }
  },

  created () {
    // remove page scroll
    this.disableScroll()
    this.addBodyClass('welcome-page-active')
  },

  destroy () {
    this.removeBodyClass('welcome-page-active')
  },
  watch: {
    isLoggedIn (newVal) {
      if (newVal) {
        this.close()
      }
    },
    '$route' (to, from) {
      if (to.name !== from.name) {
        this.close()
      }
    }
  }
}
</script>

<style lang="stylus">
  @import '~@/css/config'

  .welcome-dialog
    display: flex
    max-width: 100%
    max-height: 100%
    width: 100%
    height: 100%
    padding: 0
    color: #fff
    font-size: 15px
    overflow: hidden
    background-color: #0361C1

    @media mobile-big-and-below
      font-size: 12px

    h1
      font-size: 102px

      @media mobile-big-and-below
        font-size: 36px
        text-align: center

    img
      max-width: 100%
      max-height: 100%

    .background
      padding: 2px 10% 40px
      display: flex
      flex-direction: column
      align-items: center
      justify-content: center
      height: 100%
      width: 100%

      @media mobile-big-and-below
        padding-left: 5%
        padding-right: 5%
        justify-content: flex-start
        overflow-y: auto

    .content
      display: flex
      align-items: center
      flex: 1 0 auto
      margin-bottom: 35px
      background: transparent

      @media mobile-big-and-below
        flex-direction: column
        padding-top 20px

      .login-component
        background: none !important
        margin-right: 110px
        padding: 0 !important
        color: #3b495f

        @media mobile-big-and-below
          margin: 0
          width: 100%
          order: 1

        .loginDialogIntro
          display: none

        .loginHolder
          background: #fff
          padding: 28px 10px 3px
          min-width: 500px

          @media mobile-big-and-below
            min-width: 0

    .description
      font-family: "Open Sans Bold"
      font-size: 38px

      @media mobile-big-and-below
        font-size: 16px
        text-align: center

    .main
    .footer
      margin: 0 0 15px
      padding: 0

      @media mobile-big-and-below
        text-align: center

    .footer
      font-size: 12px

      .lottery-logo
        img
          max-width: none
        @media mobile-big-and-below
          text-align: center

  .welcome-page-active
    .app-warpper
      .bottom-navigation
        .v-bottom-nav
          z-index: 201 !important




</style>
