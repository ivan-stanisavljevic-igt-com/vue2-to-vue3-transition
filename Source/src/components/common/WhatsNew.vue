<template>
  <v-dialog
    v-if="isEnabled"
    content-class="whats-new-dialog"
    persistent
    v-model="isWhatsNewPage">

    <v-btn @click="close" class="close"></v-btn>
    <static-content :staticcontentpath="'/static/static-content/whats-new.html'" :method="'html'" fullPath class="whats-new"></static-content>

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
    name: 'WhatsNew',

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
      isWhatsNewPage: false
    }),

    computed: {
      isEnabled () {
        return config.app.autoconf.SHOW_WHATS_NEW
      },
      mobileDeviceInfo () {
        return store.getters['getMobileDeviceInfo']
      },
      isWhatsNewForMobile () {
        return store.getters['overlayState/getWhatsNewDialogState']
      }
    },
    methods: {
      openWhatsNew () {
        let body = document.body

        this.isWhatsNewPage = true
        this.disableScroll()

        if (body) {
          body.classList.add('whats-new')
        }
      },
      close () {
        let body = document.body

        this.enableScroll()
        this.isWhatsNewPage = false

        if (body) {
          body.classList.remove('whats-new')
        }
      }
    },
    mounted () {
    },
    created () {
    },

    watch: {
      mobileDeviceInfo (newValue) {
        if (newValue && window.ctsautoconf.MOBILE_LS && this.isEnabled) {
          mobileBridge.bridgeSendRequest('getKeyValue', 'current-bundle-version')
        }
      },
      isWhatsNewForMobile (newValue) {
        if (newValue && this.isEnabled) {
          const mobileDeviceInfo = store.getters['getMobileDeviceInfo']

          this.openWhatsNew()
          mobileBridge.bridgeSendRequest('setKeyValue', {'current-bundle-version': mobileDeviceInfo['bundle_version']})
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
