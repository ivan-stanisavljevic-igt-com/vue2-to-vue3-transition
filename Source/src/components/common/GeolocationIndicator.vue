<template>  
    <div class="geoloc-block" v-if="isLoggedIn">
      <div class="betslip-gc-msg" v-if="geolocationEnabled && ((geolocationMessage.errorCode && geolocationMessage.errorCode === 612) || (errorMsgLocalStorage && errorMsgLocalStorage === '612'))">
        <h3 class="gc-text">{{ $t('BetSlip.geolocation.overlay.header') }}</h3>
        <p class="gc-text">{{ $t('BetSlip.geolocation.overlay.content') }}</p>
        <p v-if="brandKey === 'boyd'" class="gc-plugin-msg" v-html="$t('BetSlip.geolocation.overlay.tryagain')"></p>
        <v-btn block @click.stop="viewGeoLocationDetails()" class="gc-link">
          <span class="gc-link"><span>{{ $t('BetSlip.geoLocation.Details') }}</span></span>
        </v-btn>
      </div>

      <div class="betslip-gc-msg" v-if="geolocationEnabled && (geolocationMessage.errorCode === 999 || errorMsgLocalStorage === '999')">
        <h3 class="gc-text">{{ $t('BetSlip.geolocation.overlay.header') }}</h3>
        <p v-if="brandKey === 'boyd'" class="gc-plugin-msg" v-html="$t('BetSlip.geolocation.overlay.tryagain')"></p>
        <v-btn block @click.stop="viewGeoLocationDetails()" class="gc-link">
          <span class="gc-link">{{ $t('BetSlip.geoLocation.Details') }}</span>
        </v-btn>
      </div>

      <div v-if="geolocationEnabled && !isOpenedFromWebView && !mobileBigAndBelow">
        <div class="not-geolocated" v-show="!isGeolocated && !geolocationSubmitInternalError">
          <div :key="geolocationMessage.errorCode + '-' + Math.random()" v-if="geolocationMessage.errorCode === 'verify'">
            <p class="pls-wait">{{ $t('BetSlip.geoLocation.pleaseWait') }}</p>
            <p class="verify">{{ $t('BetSlip.geoLocation.VerifyingLocation') }}</p>
            <div class="loader-container">
              <circle-loader></circle-loader>
            </div>
          </div>
          <div :key="geolocationMessage.errorCode + '-' + Math.random()"
              v-if="(geolocationMessage.errorCode === 999 || geolocationMessage.errorCode === 612) || (errorMsgLocalStorage === '999' || errorMsgLocalStorage === '612')">
            <p :key="state + '-' + Math.random()">{{ $t('BetSlip.notLocated.' + state) }}</p>
            <p v-if="isHardGeolocation" :key="state + '-' + Math.random()">{{ $t('BetSlip.tryAgain.' + state) }}</p>
          </div>
        </div>
        <div class="not-geolocated" v-if="!isGeolocated && geolocationSubmitInternalError">
            <p class="pls-wait">
              <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 130.2 130.2">
              <circle class="path circle" fill="none" stroke="#fff" stroke-width="6" stroke-miterlimit="10" cx="65.1" cy="65.1" r="62.1"/>
              <line class="path line" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round" stroke-miterlimit="10" x1="34.4" y1="37.9" x2="95.8" y2="92.3"/>
              <line class="path line" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round" stroke-miterlimit="10" x1="95.8" y1="38" x2="34.4" y2="92.2"/>
            </svg>
            </p>
            <p class="verify">Your location is not verified</p>
        </div>
        <div class="checkmark" v-if="isGeolocated">
          <check-mark></check-mark>
        </div>
      </div>
    </div>
</template>
<script>
import store from '@/store'
import CircleLoader from '@/components/common/CircleLoader'
import CheckMark from '@/components/common/CheckMark'
import Session from '@/components/mixins/Session'
import Screen from '@/components/mixins/Screen'
import Branding from '@/components/mixins/Branding'
import GeoLocation from '@/components/mixins/GeoLocation'
import methods from '@/library/geocomply/methods'

export default {
  name: 'geolocationindicator',

  components: {
    CircleLoader,
    CheckMark
  },

  mixins: [
    Session,
    Screen,
    Branding,
    GeoLocation,
    methods
  ],

  data () {
    return {
      geoError: localStorage.getItem('geoError'),
      geoValid: true
    }
  },

  computed: {
    isLoggedIn () {
      return store.getters['isLoggedIn']
    },
    geolocationEnabled () { return store.getters['sbBetslipState/isGeoLocationEnabled'] },
    geolocationMessage () { return store.getters['overlayState/getGeolocationMessage'] },
    geolocationInProgress () { return this.geolocationMessage && this.geolocationMessage.errorCode === 'verify' },
    geolocationFailed () {
      let isFailed = false
      let geolocationErrorMsgLocalStorage = localStorage.getItem('geoError')
      if (this.isLoggedIn && !this.isOpenedFromWebView && !this.webViewAndMobile && this.geolocationMessage) {
        if (this.geolocationMessage.errorCode === 612 || geolocationErrorMsgLocalStorage === '612') { // geo loc plug-in not installed
          isFailed = true
        } else if (this.geolocationMessage.errorCode === 999 || geolocationErrorMsgLocalStorage === '999') { // geo lococation failed
          isFailed = true
        }
      }
      return isFailed
    },
    message () {
      return store.getters['overlayState/getGeolocationMessage']
    }
  },

  methods: {
    gcMessages () {
      let messages = localStorage.getItem('gcMessages') ? JSON.parse(localStorage.getItem('gcMessages')) : []
      store.commit('setGeocomplyTroubleshooter', messages)
      let errorCode = JSON.parse(localStorage.getItem('geoError'))
      console.log(errorCode)
      let errorMessage = messages
      localStorage.setItem('gcPerm', false)
      store.commit('overlayState/setGeolocationMessage', { errorCode, errorMessage })
    },
    closeDialog () {
      this.show = !this.show
      if (this.message.messageType === 'sessionTime') {
        clearInterval(this.interval)
      }
      // store.dispatch('clearGeocomplyTroubleshooter')
      // console.log('empty state')
      store.dispatch('overlayState/deactivateGeolocationDialog')
    },
    geolocateAgain () {
      console.log(this.geolocationEnabled, 'gc enabled')
      console.log(this.geolocationMessage.errorCode, 'gc geolocationMessage')
      console.log(this.errorMsgLocalStorage, 'gc localstorage')
      let userID = localStorage.customer
      let sessionId = null
      let errorCode = 'verify'
      localStorage.setItem('gcPerm', false)
      store.commit('overlayState/setGeolocationMessage', { errorCode })
      store.dispatch('externalGeoComplyServiceController', {userID, sessionId})
      this.closeDialog()
    }
  },
  created () {
  },
  mounted () {
  },
  filters: {
  }
}
</script>
<style lang="stylus" scoped>
  .betslip-gc-details
    display flex
    justify-content center
    margin 5px 0 5px 0
    .gc-link
      cursor pointer
      text-decoration underline
      border: 1px solid black !important
  .not-geolocated { text-align: center; }
  .not-geolocated p { margin-top: 10px; }
  .not-geolocated .verify { font-size: 12px; letter-spacing: 0.05em; margin: 0px; }
  .not-geolocated .pls-wait {
      margin: 0;
      color: #1F375B;
      text-transform: uppercase;
      font-size: 16px;
      letter-spacing: 0.05em;
      font-weight: bold;
      line-height: 35px;
      text-align: center;
      height: 22px;
      margin-bottom: 5px;

      svg {
        width: 20px;
        height: 21px;

        .path {
          stroke-dasharray: 1000;
          stroke-dashoffset: 0;
          stroke-width: 10
          stroke #db3f3f
          &.circle {
            -webkit-animation: dash .9s ease-in-out;
            animation: dash .9s ease-in-out;
          }
          &.line {
            stroke-dashoffset: 1000;
            -webkit-animation: dash .9s .35s ease-in-out forwards;
            animation: dash .9s .35s ease-in-out forwards;
          }
          &.check {
            stroke-dashoffset: -100;
            -webkit-animation: dash-check .9s .35s ease-in-out forwards;
            animation: dash-check .9s .35s ease-in-out forwards;
          }
        }

        p {
          text-align: center;
          margin: 20px 0 60px;
          font-size: 1.25em;
          &.success {
            color: #73AF55;
          }
          &.error {
            color: #D06079;
          }
        }


        @-webkit-keyframes dash {
          0% {
            stroke-dashoffset: 1000;
          }
          100% {
            stroke-dashoffset: 0;
          }
        }

        @keyframes dash {
          0% {
            stroke-dashoffset: 1000;
          }
          100% {
            stroke-dashoffset: 0;
          }
        }

        @-webkit-keyframes dash-check {
          0% {
            stroke-dashoffset: -100;
          }
          100% {
            stroke-dashoffset: 900;
          }
        }

        @keyframes dash-check {
          0% {
            stroke-dashoffset: -100;
          }
          100% {
            stroke-dashoffset: 900;
          }
        }
      }
    }
  .not-geolocated .loader-container .loader { border-width: 3px; border-top-width: 3px; border-top-color: #888888; width: 20px; height: 20px; }
  // .try-again-btn
  //   background-color #2396fc !important
  // .download-btn
  //   background-color #ff671f !important
  .gc-text
    text-align center
  
  .checkmark
    display: flex
    justify-content: center
    max-height: 81px
  
  .tick-mark
    position: relative
    display: inline-block
    width: 30px
    height: 30px
    text-align: center

  .tick-mark::before
    position: absolute
    left: 0
    top: 50%
    height: 50%
    width: 3px
    background-color: #336699
    content: ""
    transform: translateX(10px) rotate(-45deg)
    transform-origin: left bottom

  .tick-mark::after
    position: absolute
    left: 0
    bottom: 0
    height: 3px
    width: 100%
    background-color: #336699
    content: ""
    transform: translateX(10px) rotate(-45deg)
    transform-origin: left bottom
</style>
