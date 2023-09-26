<template>
  <div>
    <iframe v-if="method === 'iframe'" id="iframe" :src="url" scrolling="no" frameborder="0" :style="{'height' : iframeHeight}" @load="iframeLoaded"></iframe>
    <div v-if="method === 'html' && html" v-html="html"></div>
  </div>
</template>
<script>
  import config from '@/config'
  import http from 'axios'
  import Screen from '@/components/mixins/Screen'
  import Branding from '@/components/mixins/Branding'
  import Url from '@/components/mixins/Url'
  import store from '@/store'

  export default {
    name: 'AboutUsPage',

    props: {
      fullPath: {
        type: Boolean,
        default: false
      },
      staticcontentpath: {
        type: String,
        default: '/static/static-content/'
      },
      method: {
        type: String,
        default: 'html'
      }
    },

    mixins: [
      Screen,
      Branding,
      Url
    ],

    data: () => ({
      iframeHeight: '400px',
      html: null
    }),

    computed: {
      placeholders () {
        return {
          '{mediaServer}': this.mediaServerHostname(),
          '{brand}': config.app.BRAND
        }
      },
      infoPageName () {
        return this.$route.params.infopagename
      },
      staticContentPath () {
        return this.mediaServerHostname() + this.staticcontentpath
      },
      url () {
        var result = ''

        if (this.fullPath) {
          result = this.staticContentPath
        } else {
          result = this.staticContentPath + this.infoPageName + '.html'
        }
        return result
      },
      MobilelocalServer () {
        return window.ctsautoconf.MOBILE_LS || false
      }
    },
    methods: {
      getHtml () {
        if (this.method === 'html') {
          window.scroll(0, 0)
          http.get(this.url).then((response) => {
            if (response && response.data) {
              this.html = response.data
              this.replacePlaceholders()
              this.setNetworkLogOutput({'request': this.url, 'response': response})
              this.scrollToElement()
            }
          }).catch((error) => {
            this.setNetworkLogOutput({'request': this.url, 'response': error})
          })
        }
      },
      replacePlaceholders () {
        if (this.placeholders && this.html) {
          for (var placeholder in this.placeholders) {
            if (this.placeholders.hasOwnProperty(placeholder) && this.placeholders[placeholder]) {
              let search = new RegExp(placeholder, 'g')
              this.html = this.html.replace(search, this.placeholders[placeholder])
            }
          }
        }
      },
      iframeLoaded () {
        setTimeout(() => {
          this.iframeHeight = (document.getElementById('iframe').contentWindow.document.body.scrollHeight + 40) + 'px'
        }, 1)
      },
      setNetworkLogOutput (data) {
        if (window.ctsautoconf.MOBILE_LS && config.app.autoconf.MOBILE_DEBUGGER_DIALOG && config.app.autoconf.MOBILE_DEBUGGER_DIALOG.ENABLED) {
          let date = Date.now()
          store.commit('setNetworkLogOutput', {'date': date, 'type': 'media', 'request': data.request, 'dynamicId': this.revisedRandId(), 'response': data.response})
        }
      },
      revisedRandId () {
        let randLetter = String.fromCharCode(65 + Math.floor(Math.random() * 26))
        return randLetter + Date.now()
      },
      scrollToElement () {
        if (this.$route && this.$route.hash && !this.$route.path.includes('/info/faq')) {
          let _self = this
          setTimeout(function () {
            const offset = _self.MobilelocalServer ? 100 : 150
            window.scrollTo({
              behavior: 'smooth',
              top:
                document.querySelector(_self.$route.hash).getBoundingClientRect().top -
                document.body.getBoundingClientRect().top -
                offset
            })
          }, 1000)
        }
      }
    },
    mounted () {
      this.getHtml()
    },
    created () {},

    watch: {
      url () {
        this.getHtml()
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped>
@import "~@/css/config"

iframe
  width 100%
  height 100%
  // min-height 400px
.static-content
  .ca
    padding 5px 0
    .pd-icon
      width 30px
      display inline-flex
      align-items center
      justify-content center
  .ca_email .pd-icon
    font-size 15px


</style>
