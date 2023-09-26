<template>
  <v-dialog
    v-if="isEnabled"
    content-class="welcome-dialog-generic"
    v-model="isWelcomePage"
    fullscreen
    persistent>
    <v-btn @click="close" class="close"></v-btn>
    <static-content :staticcontentpath="'/static/static-content/welcome.html'" :method="'html'" fullPath class="welcome"></static-content>
    <static-content :staticcontentpath="'/static/static-content/footer.html'" :method="'html'" fullPath class="footer"></static-content>

  </v-dialog>
</template>
<script>
  import config from '@/config'
  import store from '@/store'
  import mobileBridge from '@/library/mobileBridge'

  import Url from '@/components/mixins/Url'
  import Screen from '@/components/mixins/Screen'
  import Branding from '@/components/mixins/Branding'
  import StaticContent from '@/components/common/StaticContent'

  export default {
    name: 'Welcome',

    props: {
    },

    components: {
      StaticContent
    },

    mixins: [
      Url,
      Screen,
      Branding
    ],

    data: () => ({
      isWelcomePage: false
    }),

    computed: {
      isEnabled () {
        return config.app.autoconf.SHOW_WELCOME
      },
      isWelcomeForMobile () {
        return store.getters['overlayState/getWelcomeDialogGenericState']
      }
    },
    methods: {
      isWelcomeShownForDesktop () {
        return Boolean(localStorage.welcome)
      },
      openWelcome () {
        let body = document.body

        this.isWelcomePage = true
        this.disableScroll()

        if (body) {
          body.classList.add('welcome')
        }
      },
      close () {
        let body = document.body

        this.enableScroll()
        this.isWelcomePage = false

        if (body) {
          body.classList.remove('welcome')
        }
      }
    },
    mounted () {
      if (window.ctsautoconf.MOBILE_LS && this.isEnabled) {
        setTimeout(() => {
          mobileBridge.bridgeSendRequest('getKeyValue', 'welcome')
        }, 2000)
      }

      if (this.isEnabled && !window.ctsautoconf.MOBILE_LS && !this.isWelcomeShownForDesktop()) {
        this.openWelcome()
        localStorage.welcome = true
      }
    },
    created () {
    },

    watch: {
      isWelcomeForMobile (newValue) {
        if (newValue && this.isEnabled) {
          this.openWelcome()
          mobileBridge.bridgeSendRequest('setKeyValue', {'welcome': 'true'})
        } else {
          this.close()
        }
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus">
</style>
