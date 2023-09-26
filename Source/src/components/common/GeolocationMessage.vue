<template>
  <div class="geolocation-component">
    <v-dialog content-class="expand overlay-dialog geolocation-dialog" persistent v-model="show" height="90%">
      <template v-if="checkType()">
        <div class="header" :class="{'simple':(message.errorCode === 612 || errorMsgLocalStorage === '612')}">
          <v-layout align-center>
            <v-flex>
              <h1 :class="{'simple':(message.errorCode === 612 || errorMsgLocalStorage === '612')}">{{ $t('Geolocation.ErrorMessage.Header') }}</h1>
              <p v-if="message.errorCode === 612" :class="{'simple': message.errorCode === 612}">{{ $t('Geolocation.ErrorCode.'+ message.errorCode + '.' + state) }}</p>
            </v-flex>
          </v-layout>
        </div>
        <div class="geo-content">
          <v-layout align-center>
            <v-flex>
              <div class="troubleshooter-container">
                <v-card class="troubleshooter-msg" v-if="message.errorCode && message.errorCode !== 612">
                  <div v-for="(item, index) in geocomplyTroubleshooter" :key="index"> <br>
                    <p> {{ item.Message }} <br> 
                    <span v-if="item.HelpLink">Help: 
                      <a target="_blank" :href="item.HelpLink"> {{ item.HelpLink }}</a>
                    </span>
                    <i v-if="index !== geocomplyTroubleshooter.length - 1" class="space-btw"></i>
                    </p>
                  </div>
                </v-card>
                <div v-if="message.errorCode !== 612" class="bottom-fade"></div>
              </div>
              <div v-if="message.errorCode === 612 || message.errorCode === 615">
                <!-- <a class="gc-link" @click.stop="pluginDownload()">DOWNLOAD GEOCOMPLY PLUGIN TO BET</a> -->
                <p v-if="message.errorCode === 615" style="margin-top: 10px"><i>{{ $t('Geolocation.ErrorCode.Note') }}</i></p>
              </div>
              <p v-if="message.errorCode === 612" class="geo-suggestion" :class="{'simple': message.errorCode === 612}">{{ $t('Geolocation.ErrorCode.suggestion') }}</p>
              <p class="simple" v-if="message.errorCode === 612" v-html="$t('Contact.Support')"></p>
            </v-flex>
          </v-layout>
        </div>
        <!-- --> 
        <div class="geo-content">
            <div class="buttons">
              <v-btn v-if="message.errorCode === 612" block @click.stop="pluginDownload()" class="download-btn">
                <span class="gc-link">Download Now</span>
              </v-btn>
              <v-btn v-if="retry" block @click.stop="geolocateAgain()" class="try-again-btn">
                <span class="gc-link">Try Again</span>
              </v-btn>
              <v-btn v-if="message.errorCode !== 612" block @click.stop="closeDialog()" class="primary-btn-blue">
                <span>{{ $t('Geolocation.ErrorMessage.OK') }}</span>
              </v-btn>
              <v-btn v-if="message.errorCode === 612" block @click.stop="closeDialog()" class="maybe-later-btn">
                <span>Maybe later</span>
              </v-btn>
            </div>
          </div>
      </template>
    </v-dialog>
  </div>
</template>
<script>
  import store from '@/store'
  import Screen from '@/components/mixins/Screen'
  import airBridge from '@/components/mixins/airBridge'
  import mobileBridge from '@/library/mobileBridge'
  import config from '@/config'
  // import moment from 'moment'

  export default {
    name: 'geolocation-component',

    mixins: [
      Screen,
      airBridge
    ],

    data () {
      return {
        show: true,
        sessionInMinutes: 0,
        interval: {},
        errorMsgLocalStorage: false,
        dialogRadius: ['mobileGeoResponse', 'mobileAppRedirect', 612],
        currentTime: null,
        retry: true
      }
    },

    computed: {
      config () {
        return config
      },
      geoErrorMsgLocalStorage () {
        let errorCode = localStorage.getItem('geoError')
        console.log(errorCode)
        if (errorCode === 612 || errorCode === '612') {
          let newErrorCode = this.message.errorCode = parseInt(errorCode)
          return newErrorCode
        }
        return false
      },
      message () {
        return store.getters['overlayState/getGeolocationMessage']
      },
      navigatorID () {
        if (navigator.appVersion.indexOf('Win') !== -1) {
          return 'win'
        } else if (navigator.appVersion.indexOf('Mac') !== -1) {
          return 'mac'
        } else {
          return undefined
        }
      },
      state () {
        return window.ctsautoconf.STATE
      },
      externalUrls () {
        return config.externalUrls
      },
      externalWalletProvider () {
        return config.app.autoconf.WALLET_PROVIDER
      },
      walletParams () {
        return config.walletParams
      },
      geocomplyTroubleshooter () {
        if (store.getters['getGeocomplyTroubleshooter']) {
          return store.getters['getGeocomplyTroubleshooter']
        }
        return []
      }
    },

    methods: {
      closeDialog () {
        this.show = !this.show
        if (this.message.messageType === 'sessionTime') {
          clearInterval(this.interval)
        }
        // store.dispatch('clearGeocomplyTroubleshooter')
        // console.log('empty state')
        store.dispatch('overlayState/deactivateGeolocationDialog')
      },
      pluginDownload () {
        window.location = 'https://' + this.walletParams.installerURL + '/installer/url?id=' + this.walletParams.installerKey + '&os=' + this.navigatorID + '&version=' + this.walletParams.geocomplyPluginVersion + '&user_id=' + this.message.userID
      },
      geolocateAgain () {
        let userID = localStorage.customer
        let sessionId = null
        store.dispatch('externalGeoComplyServiceController', {userID, sessionId})
        this.closeDialog()
      },
      goToSite (state, pathname) {
        pathname = (pathname !== undefined) ? pathname : ''
        switch (state) {
          case 'NJ':
            window.open(this.formatUrl(window.ctsautoconf.NEWJERSEY) + pathname, '_self')
            break
          case 'WV':
            window.open(this.formatUrl(window.ctsautoconf.WESTVIRGINIA) + pathname, '_self')
            break
          case 'PA':
            window.open(this.formatUrl(window.ctsautoconf.PENNSYLVANIA) + pathname, '_self')
            break
          case 'CA':
            window.open(this.formatUrl(window.ctsautoconf.CALIFORNIA) + pathname, '_self')
            break
        }
      },
      goToRedirect (state, pathname) {
        pathname = (pathname !== undefined) ? pathname : ''
        switch (state) {
          case 'WV':
            window.open(this.formatUrl(window.ctsautoconf.WESTVIRGINIA) + pathname, '_self')
            break
          case 'PA':
            window.open(this.formatUrl(window.ctsautoconf.PENNSYLVANIA) + pathname, '_self')
            break
          case 'CA':
            window.open(this.formatUrl(window.ctsautoconf.CALIFORNIA) + pathname, '_self')
            break
        }
      },
      formatUrl (url) {
        return url.substring(0, url.lastIndexOf('.com') + 4)
      },
      mobileAppRedirect (state) {
        switch (state) {
          case 'WV':
            window.open(this.formatUrl(window.ctsautoconf.WESTVIRGINIA) + '/fromwebview', '_self')
            break
          case 'PA':
            window.open(this.formatUrl(window.ctsautoconf.PENNSYLVANIA) + '/fromwebview', '_self')
            break
          case 'CA':
            window.open(this.formatUrl(window.ctsautoconf.CALIFORNIA) + '/fromwebview', '_self')
            break
        }
      },
      goTo (param) {
        var reason
        if (this.externalWalletProvider === 'GAN') {
          if (param === 'ERROR.LOCATION_SERVICES_DISABLE') {
            reason = 'phone_settings'
          } else {
            reason = 'geo_recheck'
          }
          this.airBridgeRequest(reason, { 'state': window.ctsautoconf.STATE.toLowerCase() })
          this.closeDialog()
        }
        if (this.externalWalletProvider === 'FD') {
          if (param === 'singleMobileError') {
            let action = this.message.data.errors.buttonAction
            console.log('action')
            console.log(action)
            /* eslint no-eval: 0 */
            eval(action)
          }
          if (param === 'mobileGeolocationError') {
            mobileBridge.geolocateUser('Retry Geolocation')
          }
          this.closeDialog()
        }
      },
      defineElemHeight (count, parent) {
        console.log(this.screenHeight)
        console.log(count)
        var style
        if (this.screenHeight < 481) { // small mobile (iPhone 4)
          if (count > 1) {
            style = parent ? {height: '300px'} : {height: '210px'}
          } else if (count === 1) {
            style = parent ? {maxHeight: '300px'} : {maxHeight: '165px'}
          }
          return style
        } else if (this.screenHeight >= 481 && this.screenHeight < 610) { // iPhone 5/SE
          if (count > 1 && count <= 2) {
            style = parent ? {height: '400px'} : {height: '320px'}
          } else if (count > 2) {
            style = parent ? {height: '400px'} : {height: '310px'}
          } else if (count === 1) {
            style = parent ? {maxHeight: '400px'} : {maxHeight: '265px'}
          }
          return style
        } else if (this.screenHeight >= 1023) { // tablet
          console.log('tablet')
          if (count > 1) {
            style = parent ? {height: '600px'} : {height: '520px'}
          } else if (count === 1) {
            style = parent ? {maxHeight: '600px'} : {maxHeight: '470px'}
          }
          return style
        } else { // mobile big
          // if (count > 1 && count <= 2) {
          //   style = parent ? {height: '410px'} : {height: '320px'}
          // }
          console.log('mobile big')
          if (count >= 2) {
            style = parent ? {height: '500px'} : {height: '400px'}
          } else if (count === 1) {
            style = parent ? {maxHeight: '400px'} : {maxHeight: '270px'}
          }
          return style
        }
      },
      checkType () {
        if (this.message.errorCode === 'softGeolocation' ||
        this.message.errorCode === 'softGeolocationRedirect' ||
        this.message.errorCode === 'hardGeolocationRedirect' ||
        ((this.message.errorCode === 999) ||
        (this.message.errorCode === 612 || this.geoErrorMsgLocalStorage === 612) ||
        (this.message.errorCode === 615 && this.externalWalletProvider === 'GAN'))
        ) {
          return true
        }
        return false
      },
      countReached () {
        if (this.screenHeight < 481) { // small device / IPhone 4
          return {bottom: '-5px'}
        } else if (this.screenHeight > 481 && this.screenHeight < 569) { // Iphone 5/SE
          return {bottom: '-7px'}
        } else {
          return {bottom: '-20px'}
        }
      },
      updateCurrentTime () {
        this.currentTime = (new Date()).toLocaleString('en-US', { timeZone: config.app.timeZone })
      },
      allowRetry () {
        const isRetry = this.geocomplyTroubleshooter
        const result = isRetry.find(el => !el.CanRetry)
        if (result) {
          this.retry = false
        }
      }
    },

    created () {
      if (this.message.messageType === 'sessionTime') {
        var value = Math.round(Math.abs(localStorage.loginTime - Date.now()) / 1000)
        if (value >= 0) {
          var minutes = Math.floor(value / 60)
          this.sessionInMinutes = `${minutes}`
        }
        this.interval = setInterval(() => {
          var value = Math.round(Math.abs(localStorage.loginTime - Date.now()) / 1000)
          if (value >= 0) {
            var minutes = Math.floor(value / 60)
            this.sessionInMinutes = `${minutes}`
          }
        }, 1000)
      }
      this.currentTime = (new Date()).toLocaleString('en-US', {timeZone: config.app.timeZone})
      setInterval(() => this.updateCurrentTime(), 1 * 1000)
      this.allowRetry()
    },
    mounted () {
      if (this.dialogRadius.includes(this.message.errorCode) || this.dialogRadius.includes(this.message.messageType)) {
        document.getElementsByClassName('geolocation-dialog')[0].style.borderRadius = '4px'
      }
    }
  }
</script>
<style lang="stylus" scoped>
@import '~@/css/config';
.v-dialog:not(.dialog--fullscreen) {
  width: 421px;
}
.geolocation-dialog {
  background: transparent;
  padding: 0px;
  border-radius: 4px;

  .header {
    padding: 15px 15px 10px 15px;
  }

  h1 {
    margin: 0;
    text-transform: uppercase;
    font-size: 30px;
    letter-spacing: 0.05em;
    line-height: 35px;
    font-font-weight: bold;
    color: #E24447;
  }

  .geo-content {
    line-height: 20px;
    text-align: left;
    color: #818e95;
    padding: 0px 15px;
    font-size: 14px;
    .geo-suggestion {
      margin-top: 20px;
      color: #e24447;
    }

    .buttons {
      padding-bottom: 20px;

      .primary-btn-blue {
        background-color: #ff671f !important
        border-radius: 2px

        .btn {
          span {
            font-weight: normal !important;
          }
        }
      }
    }
  }
}

.softGeolocationLinks
  .state-wrapper
    display flex
    padding-bottom 16px
    .state-link
      display flex
      flex-grow 6
      text-transform uppercase
      color: #1493ff

.softGeolocationRedirect
  color: #1f375b !important
.nothx
  text-align: center
  padding-top: 10px
  a
    color: #1f375b
    font-size: 14px
    line-height: 16px


/* mobile response for failed geolocation */

.geo-content.mobile-response
  padding: 0 16px 16px 16px
  position: relative
  .content-wrapper
    flex-wrap: wrap;
    overflow-y: auto;
    overflow-x: hidden;
    overscroll-behavior: contain;
    margin-bottom: 5px
    .header
      font-weight: normal
      text-align: center
      padding: 26px 0 0 0
      color: #445058
      h1
        font-weight: normal
        color: #1f375b
        text-transform: inherit
        font-size: 18px
        font-style: normal
        font-stretch: normal
        line-height: normal
        letter-spacing: normal
      p
        line-height: 22px
        font-size: 14px


    .inner-content
      color: #445058
      .error-body
        width: 100%
        .v-card
          border: 1px solid #da812d
          border-radius: 4px
          margin: 15px 0
          box-shadow: none
          font-size: 14px
          font-style: normal
          font-stretch: normal
          line-height: normal
          letter-spacing: normal
          .card-title
            line-height: 16px
            padding: 8px 12px
            background-color: #fcf3ea
            border-bottom: 1px solid #da812d
            span
              color: #445058

          .card-content
            padding: 8px 10px
            .error-cont
              margin-bottom: 5px
  .bottom-gradient
    display: block
    height: 40px
    position: relative
    top: -45px
    background: -webkit-linear-gradient(rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 1) 100%)
    background-image: -moz-linear-gradient(rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 1) 100%)
    background-image: -o-linear-gradient(rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 1) 100%)
    background-image: linear-gradient(rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 1) 100%)
    background-image: -ms-linear-gradient(rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 1) 100%)
  .buttons
    padding: 0
    height: 100px
    margin: 0px
    button
      height: 44px
      border-radius: 4px
  .multi-error
    display: flex
    position: absolute
    width: 100%
    margin-top: 0px
    padding: 0 16px 10px 16px
    bottom: 0
    left: 0
    flex-direction: row-reverse
    border-top: 1px solid #cfd6db
    .btn
      flex-grow: 1
      margin-top: 20px
  
  .primary-btn-green
    background-image: linear-gradient(to bottom, #36c565, #2cb459)
    span
      color: #ffffff
      font-weight: normal
    &.btn--disabled
      opacity: 0.6
  .primary-btn-white
    background-color: transparent
    height: 40px
    span
      color: #1493ff
      font-weight: normal
  .single-error
    .primary-btn-white
      height:50px
      margin: 0
      span
        font-weight: normal
    .singleCountReached
      text-align: center
      margin: 0px
      padding: 6px
      font-size: 1rem
    .singleCountReached.ERROR.LOCATION_SERVICES_DISABLE
      margin-top:0px
  .button-disabled
    height: 110px

  .multiCountReached
    text-align: center
    position: absolute
    width: 90%
    margin: 0px
    bottom: 8px
    font-size: 1rem
  .1plus
    bottom: -24px !important

// .download-btn.download-btn
//   background #ff671f !important
//   span
//     color: #ffffff !important
//     font-weight: normal
//   &.btn--disabled
//     opacity: 0.6
// .try-again-btn.try-again-btn
//   background #2396fc !important
//   span
//     color: #ffffff !important
//     font-weight: normal
//   &.btn--disabled
//     opacity: 0.6
// .maybe-later-btn.maybe-later-btn
//   background #fff !important
//   border 1px solid #2396fc
//   span
//     color: #2396fc
//     font-weight: bold
//   &.btn--disabled
//     opacity: 0.6

.geo-content.mobile-response.single-error-dialog
  .content-wrapper
    flex-wrap: wrap
    overflow-y: scroll
    overflow-x: hidden
    .inner-content
      margin: 11px
      p
        font-stretch: normal
        line-height: 22px
        letter-spacing: normal
        text-align: center

    
::-webkit-scrollbar
  width: 0px
  background: transparent

.ServiceDisabled p
  margin-bottom: 0px !important
  text-align: left !important

.os-ios
  @media only screen and (min-device-width: 320px) and (max-device-width: 480px) and (-webkit-device-pixel-ratio: 2) and (device-aspect-ratio: 2/3)
    .ServiceDisabled
      .primary-btn-green
        span
          font-size: 1rem
    .singleCountReached
      font-size: 1rem
    .geo-content.mobile-response .single-error .primary-btn-white
      height: 20px
      span
        margin: 0px


// reality check and mobile app redirect
.sessionTime, .mobileAppRedirect
  font-size: 14px
  text-align: center
  letter-spacing: normal
  font-style: normal
  font-stretch: normal
  line-height: normal
  margin:16px
  .header
    padding: 10px 0 10px 0
    h1
      color: #1f375b
      font-size: 18px
      text-align: center
      font-weight: normal
      text-transform: capitalize
  .inner-content
    margin: 0
    p
      margin: 0
  .buttons
    margin: 24px 0 0 0
    .primary-btn-green
      color: #00001a
    span
      color: #ffffff
      font-weight: normal
 
h1.simple
  font-size 18px
  font-weight bold  
  color #1f375b
  text-align center 
  text-transform uppercase
.primary-btn-green
  background-color: #3fc369 !important
  border-radius 2px
  color white
  min-height 48px
.close
  position relative
  margin-right -10px
  color #cfd6db
  vertical-align middle
  display flex
  cursor pointer
  .material-icons
    font-size 18px
.gc-postpone
  color #1493ff
  font-size 14px
  font-weight bold
  height 30px
  padding 16px 8px
  cursor pointer
  text-align center 
p.simple
  color #445058
  text-align center
.geo-suggestion.simple
  color #445058 !important
  text-align center
  margin-top 0px
.header.simple
  padding: 24px 37px 4px 37px  
.primary-btn-white
  background-color: transparent
  height: 40px
  span
    color: #1493ff
    font-weight: normal

.inner-content.fd
  height 110px 
  border-radius 4px 
  padding 5px
  padding-bottom 25px
  cursor pointer  
  max-height 100%
  flex-wrap: wrap
  overflow-y: scroll
  scroll-behavior smooth
  overflow auto
  h3 
    margin-bottom 5px !important
  .card-content
    margin-bottom 15px
  .card-title
    color #445058 

/*after design update and message setup, need to be adapted*/
// .bottom-fade
//   display: block
//   height: 60px
//   position: absolute
//   bottom 0
//   width 100%
//   // margin-top: -45px
//   background: -webkit-linear-gradient(rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 1) 100%)
//   background-image: -moz-linear-gradient(rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 1) 100%)
//   background-image: -o-linear-gradient(rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 1) 100%)
//   background-image: linear-gradient(rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 1) 100%)
//   background-image: -ms-linear-gradient(rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 1) 100%)
.geolocation-dialog .geo-content .geo-suggestion.clear
  margin-top: 10px !important
.troubleshooter-msg
  display flex
  flex-direction column
  height 210px
  overflow scroll
.troubleshooter-container
  position relative
// .space-btw
//   display flex
//   justify-content center
//   border-bottom 1px solid #000
//   width 40px
//   padding-bottom 15px
//   margin 0 auto
  // &:last-child
  //   display none
  .space-btw
    display flex
    justify-content center
    margin-top: 15px
    height: 1px
    background: black
    background: -webkit-gradient(linear, 0 0, 100% 0, from(white), to(white), color-stop(50%, black))
</style>
