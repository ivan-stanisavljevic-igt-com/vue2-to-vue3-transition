<template>
  <div class="message-dialog">
    <v-dialog :content-class="[message.reason]" :fullscreen="message.fullscreen" :persistent="message.persistent" :max-width="(message.maxWidth) ? message.maxWidth : maxWidth" v-model="show">
      <div v-if="message.reason === 'native-app'">
        <div v-if="userAgent === 'android' || userAgent === 'ios'">
        <div class="text-wrapper">
          <h1>{{ $t('appInstaller.addTo.Title') }}</h1>
          <p>{{ $t('appInstaller.addTo.content') }}</p>
        </div>
        <div class="buttons">
          <v-btn block @click.stop="appDownload()" class="primary-btn-blue">
              <span>{{ $t('appInstaller.nativeApp' + userAgent + '.appDwn') }}</span>
          </v-btn>
          <div class="app-link">
              <a class="app-btn" @click="close()">{{ $t('appInstaller.addTo.continue') }}</a>
            </div>
        </div>
        </div>
        <div v-else>
          <div class="text-wrapper">
            <h1 class="something-wrong">{{ $t('MessageDialog.msg.unknown') }}</h1>
          </div>
          <div class="buttons">
            <v-btn block @click.stop="close()" class="primary-btn-blue">
              <span>{{ $t('MessageDialog.btn.CLOSE') }}</span>
            </v-btn>
          </div>
        </div>
      </div>
      <div v-else-if="message.reason === 'native-failed-geolocation'" :class="[message.reason, brandKey]">
        <div v-if="userAgent === 'android' || userAgent === 'ios'">
        <div class="text-wrapper">
          <h1>{{ $t('nativeApp.failedGeolocation.title') }}</h1>
          <p>{{ $t('nativeApp.failedGeolocation.contect.' + state) }}</p>
          <p :style="'margin-top: 20px'" v-if="brandKey === 'sb'" v-html="$t('nativeApp.failedGeolocation.contect2.' + state)"></p>
          <p v-if="brandKey !== 'sb'" class="msg-red">{{ $t('nativeApp.failedGeolocation.suggestion') }}</p>
        </div>
        <div class="buttons">
          <v-btn block @click.stop="close()" class="primary-btn-blue">
            <span>{{ $t('Geolocation.ErrorMessage.OK') }}</span>
          </v-btn>
        </div>
        </div>
        <div v-else>
          <div class="text-wrapper">
            <h1 class="something-wrong">{{ $t('MessageDialog.msg.unknown') }}</h1>
          </div>
          <div class="buttons">
            <v-btn block @click.stop="close()" class="primary-btn-blue">
              <span>{{ $t('MessageDialog.btn.CLOSE') }}</span>
            </v-btn>
          </div>
        </div>
      </div>
      <div v-else-if="message.reason === 'firstVisit'" :class="[message.reason] + '-content'">
        <div v-if="userAgent === 'android' || userAgent === 'ios'">
          <v-flex class="close">
            <v-btn flat @click="close()" class="close"><v-icon>close</v-icon></v-btn>
          </v-flex>
          <div class="promo-content">
            <div class="promo-image">
              <img :src="currentBoNavigationHeadlines[0].imageurl">
            </div>
            <h1 class="title">{{currentBoNavigationHeadlines[0].title}}</h1>
            <p class="bodytext">{{currentBoNavigationHeadlines[0].bodytext}}</p>
            <p class="promotext">{{currentBoNavigationHeadlines[0].promotext}}</p>
          </div>
          <div class="buttons">
            <v-btn :href="externalUrls.addFunds + webView" target="_self" block class="primary-btn-green">
              <span>{{currentBoNavigationHeadlines[0].datetimetext}}</span>
            </v-btn>
          </div>
        </div>
        <div v-else>
          <div class="text-wrapper">
            <h1 class="something-wrong">{{ $t('MessageDialog.msg.unknown') }}</h1>
          </div>
          <div class="buttons">
            <v-btn block @click.stop="close()" class="primary-btn-blue">
              <span>{{ $t('MessageDialog.btn.CLOSE') }}</span>
            </v-btn>
          </div>
        </div>
      </div>
      <div v-else-if="message.reason === 'session-notifier'" :class="[message.reason]">
        <div class="text-wrapper">
          <p>{{ $t('Session.information') }} <span v-if="timeLeft">{{timeLeft}}</span></p>
        </div>
        <div class="buttons">
          <v-btn @click="extendSession()" block class="primary-btn-blue">
            <span>{{ $t('Session.extend') }}</span>
          </v-btn>
          <v-btn block @click.stop="close(false)" class="primary-btn-blue">
            <span>{{ $t('Session.close') }}</span>
          </v-btn>
        </div>
      </div>
      <div v-else-if="message.reason === 'network-error'" :class="[message.reason]">
        <div class="text-wrapper">
          <p>{{ $t('MessageDialog.networkError') }}</p>
        </div>
        <div class="buttons">
          <v-btn block @click.stop="close(false)" class="primary-btn-blue">
            <span>{{ $t('MessageDialog.btn.CLOSE') }}</span>
          </v-btn>
        </div>
      </div>
      <div v-else>
        <div class="text-wrapper">
          <p class="something-wrong">{{ $t('MessageDialog.msg.unknown') }}</p>
        </div>
        <div class="buttons">
          <v-btn block @click.stop="close()" class="primary-btn-blue">
            <span>{{ $t('MessageDialog.btn.CLOSE') }}</span>
          </v-btn>
        </div>
      </div>
    </v-dialog>
  </div>
</template>
<script>
  // import store from '@/store'
  import Screen from '@/components/mixins/Screen'
  import store from '@/store'
  import lib from '@/library'
  import config from '@/config'
  import Session from '@/components/mixins/Session'
  import Branding from '@/components/mixins/Branding'

  export default {
    name: 'MessageDialog',

    mixins: [
      Screen,
      Session,
      Branding
    ],

    data () {
      return {
        show: true,
        timerInterval: null,
        timeLeft: null,
        maxWidth: 800
      }
    },

    computed: {
      message () {
        return store.getters['overlayState/getMessageDialogMsg']
      },
      userAgent () {
        return lib.core.userAgent.os.name
      },
      state () {
        return window.ctsautoconf.STATE
      },
      headlines () {
        return store.getters['bonavigationState/boNavigationHeadlines']
      },
      currentBoNavigationHeadlines () {
        return this.headlines && this.headlines.filter(hl => hl.categoryname === 'BackgroundImages' && hl.cssclasses && hl.cssclasses.includes('onFirstVisit'))
      },
      isOpenedFromWebView () {
        return store.getters['getIsOpenedFromWebView']
      },
      externalUrls () {
        return config.externalUrls
      },
      walletProvider () {
        return config.app.autoconf.WALLET_PROVIDER
      },
      webView () {
        var sufix = ''
        if (this.isOpenedFromWebView && this.walletProvider === 'GAN') {
          sufix = '?uiView=true'
        }
        return sufix
      },
      serviceName () {
        return config.walletParams.providerServiceName
      },
      singleDownloadPage () {
        return window.ctsautoconf.DOWNLOAD_APPS_SINGLE_PAGE
      }
    },

    methods: {
      close (retunHomeHint = null) {
        let redirectToHome = true
        let msg = this.message
        if (retunHomeHint !== null) {
          redirectToHome = retunHomeHint
        } else if (msg && msg.options && msg.options.oncloseredirecttohome !== null) {
          redirectToHome = msg.options.oncloseredirecttohome
        }

        store.dispatch('overlayState/deactivateMessageDialog')
        if (redirectToHome) {
          this.$router.push({name: 'home'})
        }
      },
      appDownload () {
        store.commit('overlayState/setHeaderMessageState', false)
        store.dispatch('overlayState/deactivateMessageDialog')
        store.dispatch('overlayState/closeAll')
        if (this.singleDownloadPage) {
          this.closeInfo()
          this.$router.push({name: 'app'})
        } else {
          if (this.userAgent === 'android') {
            this.closeInfo()
            this.$router.push({name: 'android'})
          } else {
            this.closeInfo()
            this.$router.push({name: 'app'})
          }
        }
      },
      setImage () {
        if ((this.currentBoNavigationHeadlines.length > 0 && this.currentBoNavigationHeadlines[0].backroundimageurl.length > 0) && this.message.reason === 'firstVisit') {
          var elem = document.querySelector('.firstVisit')
          var elem2 = document.querySelector('.dialog__content__active')
          if (elem) {
            elem2.style.zIndex = '99999'
            elem.style.backgroundImage = 'url("' + this.currentBoNavigationHeadlines[0].backroundimageurl + '")'
          }
        }
      },
      extendSession () {
        this.userIsActive()
        store.dispatch('checkActivity')
        this.close(false)
      },
      startTimer () {
        if (this.message.data && this.message.data.counter) {
          var counter = Math.floor((this.message.data.counter / 1000) % 60) // to seconds
          this.timerInterval = setInterval(() => {
            counter = counter - 1
            if (counter >= 0) {
              this.timeLeft = counter
              return false
            }
            this.timeLeft = 0
            clearInterval(this.timerInterval)
          }, 1000)
        }
      },
      closeAndReload (retunHomeHint = null) {
        this.close(retunHomeHint)
        setTimeout(() => (
          document.location.reload(true)
        ), 0)
      }
    },
    mounted () {
      this.setImage()
      this.startTimer()
    },
    created () {},
    beforeDestroy () {
      if (this.timerInterval) {
        clearInterval(this.timerInterval)
      }
    },

    watch: {
    },

    components: {
    }
  }
</script>
<style lang="stylus" scoped>
@import '~@/css/config';

.promo-image {
  text-align: center;
  margin-top: 15px;
  margin-bottom: 25px;
}

h1 {
  margin: 0;
  color: #1F375B;
  text-transform: uppercase;
  font-size: 30px;
  font-weight: bold;
  line-height: 35px;
  text-align: center;
}

.text-wrapper p {
  font-size: 14px;
  line-height: 20px;
  color: #1F375B;
  text-align: center
}
.btn.primary-btn-blue {
  background-color: #1493FF !important;
  margin-bottom: 16px;
}

.app-link {
  text-align: center;
  margin-bottom: 9px;
}
.app-btn {
  color: #1F375B !important;
  font-size: 12px;
}
.msg-red {
  color: #e24447 !important;
}

.native-failed-geolocation, .session-notifier {
  h1 {
    margin-bottom: 10px;
  }
  p {
    margin:0;
  }
  }
.native-failed-geolocation .sb {
  h1 {
    text-transform: capitalize;
    font-weight: normal !important;
    font-size: 20px;
  }
}

.firstVisit-content
  position relative
  height inherit
  .close
    display block
    .btn
      min-width: 0;
      position: absolute
      right: -30px
      top: -20px
      // width: 20px
      height: 20px
      color: #1f375b
  .primary-btn-green
    color: #fff !important
    height: 52px
    font-size: 14px
    position: absolute
    bottom: 10px
    background-color: #33C767 !important
  .promo-content
    .promo-image
      padding-top 1em !important
      img
        width 207px
        height 90px
    .title
      font-size: 16px
      font-weight: normal
      font-style: normal
      font-stretch: normal
      line-height: normal
      text-align: center
      color: #ffffff
    .bodytext, .promotext
      margin-top: 1em
      margin-bottom: 1em
      font-size: 16px
      font-weight: normal
      font-style: normal
      font-stretch: normal
      line-height: 0.94
      text-align: center
      color: #ffffff
    .promotext
      font-weight: bold


</style>
