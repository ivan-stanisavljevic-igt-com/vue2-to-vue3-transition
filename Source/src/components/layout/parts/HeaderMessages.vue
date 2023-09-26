<template>
  <header :class="['header-message-' + headerSettings.style, 'h-message']" ref="headermessage" v-show="show" :style="tabletAndAbove ? {top: scrollValue + 'px'} : {}">
    <resize-observer @notify="headerMessageResize" />
    <v-layout align-center v-if="!mobileBigAndBelow">
        <v-flex class="message-content">{{ $t('Geolocation.Header.Error.Message') }}</v-flex>
        <v-flex>
          <button class="btnX" @click="closeInfo()">X</button>
        </v-flex>
    </v-layout>

    <v-layout align-center v-if="mobileBigAndBelow">
      <div class="content-container" v-if="!isOpenedFromWebView && mobileBigAndBelow">
        <v-flex  v-if="(brandKey !== 'dn' && brandKey !== 'dnw' && brandKey !== 'circa')" class="close">
          <v-btn flat @click="closeInfo()" class="close"><v-icon>close</v-icon></v-btn>
        </v-flex>
        <template v-if="(userAgent == 'ios') || (userAgent == 'android')">
          <div v-if="(brandKey !== 'dn' && brandKey !== 'dnw' && brandKey !== 'circa')" class='content-wrapp'>
            <v-flex class="message-content">
              <p class="paraf">{{ $t('Header.appInstall.Title') }}</p>
              <p>{{ $t('Header.appInstall.text') }}</p>
            </v-flex>
            <v-flex class="message-btn-wrapper" @click="appInstall()">
              <v-btn class="message_btn">{{$t('Get')}}</v-btn>
            </v-flex>
          </div>
          <div v-if="(brandKey === 'dn' || brandKey === 'dnw' || brandKey === 'circa')" class='content-wrapp appinstall'>
            <div v-if="brandKey === 'circa'">
              <v-flex class="close"><v-btn flat @click="closeInfo()" class="close"><v-icon>close</v-icon></v-btn></v-flex>
              <img :src="mediaServer('/static/brand-img/' + brandKey + '/logo-blue.png')" :alt="brandKey" @click="appInstall()">
            </div>
            <div class="text" @click="appInstall()">
              <p>{{ $t('Header.appInstall.text') }}</p>
              <p v-if="brandKey === 'circa'" class="subtext">{{ $t('Header.appInstall.msg') }}</p>
            </div>
          </div>
        </template>
        <template v-else>
          <div class='content-wrapp'>
            <v-flex class="message-content">
              <p class="paraf">{{ $t('Header.nativeAppBeforeLoginWrongOS') }}</p>
              <p>{{ $t('Header.nativeAppBeforeLogin.Content') }}</p>
            </v-flex>
          </div>
        </template>
      </div>
    </v-layout>
  </header>
</template>

<script>
  import Screen from '@/components/mixins/Screen'
  import Branding from '@/components/mixins/Branding'
  import store from '@/store'
  import lib from '@/library'
  // import config from '@/config'
  import Icon from '@/components/common/Icon'
  import Url from '@/components/mixins/Url'

  export default {
    name: 'HeaderMessages',

    mixins: [
      Screen,
      Branding,
      Url
    ],

    components: {
      Icon
    },

    data () {
      return {
        show: true
      }
    },

    computed: {
      isOpenedFromWebView () {
        return store.getters['getIsOpenedFromWebView']
      },
      userAgent () {
        return lib.core.userAgent.os.name
      },
      isLoggedIn () {
        return store.getters['isLoggedIn']
      },
      headerSettings () {
        return store.getters['overlayState/getHeaderMessagesData']
      },
      singleDownloadPage () {
        return window.ctsautoconf.DOWNLOAD_APPS_SINGLE_PAGE
      }
    },

    methods: {
      headerMessageResize () {
        if (this.$refs.headermessage) {
          store.commit('screenState/setHeaderMessageHeight', this.$refs.headermessage.offsetHeight)
        }
      },
      closeInfo () {
        store.commit('screenState/setHeaderMessageHeight', 0)
        this.show = !this.show
        store.commit('overlayState/setHeaderMessageState', false)
      },
      appInstall () {
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
      }
    },

    mounted () {
      this.headerMessageResize()
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped>
@import '~@/css/config';

.h-message 
  padding: 0 12px;
  max-width: 1441px;
  margin: 0 auto;
  text-align: left;
  width: 100%;
  &.player_msg_active
    top: 89px

.header-messages-red {
  background-color: #E24447;
}

.header-message-white {
  color: #818E95;
  background-color: #FFFFFF;
  line-height: 20px;
  font-size: 14px;
  z-index: 2;

  .layout {
    position: relative;
  }
  .content-container {
    width: 100%;
    display: flex
    margin-top:16px
    height 41px
    margin-bottom: 16px
  }
  .banner-image {
    line-height 0;
    margin-left: 25px
  }
  .content-wrapp {
    display: flex;
    margin-left: 18px
    width: 100%

  p {
    margin: 0;
    font-size: 14px;
    font-weight: normal;
    font-style: normal;
    font-stretch: normal;
    line-height: normal;
    color: #1f375b
    }
  .paraf {
    font-family: 'Open sans Bold';
    margin-bottom:2px;
    }
  }
  .message-btn-wrapper {
    flex-grow: 0
  }

  .message_btn >>>.btn__content {
    font-weight: normal
    font-size: 14px
    text-shadow: 0 -1px 0 rgba(0, 0, 0, 0.15)
    color: #ffffff
  }

  .message_btn {
    margin: 0
    background: #ff671f !important
    color #fff
    min-width: 68px
    border-radius: 4px
    height 41px
  }

  h1 {
    margin: 0;
    color: #1F375B;
    text-transform: uppercase;
    font-size: 18px;
    font-weight: bold;
    line-height: 21px;
  }

  .message-content {
    flex-grow: 5
    line-height: 0
  }

  .close {
    position: absolute
    left: -22px
    top: 7px
    color: #445058
  }

  .close .icon {
    font-weight: normal
    font-size: 18px
  }
}

@media mobile-big-and-below {
  header.header a,
  a {
    color: #1976d2
  }

  .scrolled {
    position: fixed;
    z-index: 3;
    width: 100%
  }

  .app-link {
    margin-bottom: 22px;
  }
  .app-btn {
    font-weight: bold;
    font-size: 14px;
    line-height: 16px;
  }

  .banner-image:before { content:""; display:inline-block; vertical-align:middle; height:100%; }
  .banner-image img { max-width: 40px; display:inline-block; vertical-align:middle; }
}

@media screen and (max-width: 321px) {
  .banner-image {
    margin-left: 20px !important
  }
  .close {
    left: -24px !important
  }
  .close .btn {
    min-width 88px !important
  }
}
</style>
