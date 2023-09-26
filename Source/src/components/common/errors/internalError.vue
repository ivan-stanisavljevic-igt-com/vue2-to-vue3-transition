<template>
  <div class="text-xs-center">
    <v-bottom-sheet v-model="sheet" hide-overlay persistent>
      <div class="content-holder">
        <v-layout>
          <v-flex class="sheet-title">{{ $t('Error.Title') }}</v-flex>
          <!-- <span class="sheet-close"><img src="@/assets/images/icon/svg/cross-white.svg" alt="Fanduel" @click="close"></span> -->
        </v-layout>
        <div class="sheet-content">
          <p v-if="internalError && internalError.Reference"> {{ $t('Error.Reference') }} {{ internalError.Reference }}</p>
          <p v-if="internalError && (!internalError.Reference && internalError.Message)"> {{ $t('Error.Message') }} {{ internalError.Message }}</p>
          <p v-if="internalError && internalError['content-server']"> {{ $t('Error.Path') }} {{ internalError['content-server'] }}</p>
          <p v-if="internalError && (!internalError.Reference && userGUID)"> {{ $t('Error.Device') }} {{ userGUID }}</p>
          <p v-if="internalError && datetime && !internalError.Reference"> {{ $t('Error.Date') }} {{ datetime }} [{{ timeZone }}]</p>
        </div>
      </div>
    </v-bottom-sheet>
  </div>
</template>

<script>
import store from '@/store'
import config from '@/config'
export default {
  name: 'internalError',
  data: () => ({
    sheet: false,
    datetime: false
  }),
  computed: {
    internalError () {
      return store.getters['getInternalError']
    },
    userGUID () {
      return localStorage.igt_cs || false
    },
    timeZone () {
      return window.ctsautoconf.TIMEZONE_DISPLAY
    }
  },
  methods: {
    close () {
      this.sheet = false
      let modifyBottomNav = document.getElementsByClassName('bottom-nav')[0]
      if (modifyBottomNav) {
        modifyBottomNav.style.cssText = 'z-index: 9999; height: 60px; position: fixed'
      }
    },
    currentTime () {
      let serverMlsTime = store.getters['getServerMlsTime']
      if (serverMlsTime) {
        let currentState = window.ctsautoconf.STATE
        let tz = config.app.timezone[currentState] || 'America/New_York'
        this.datetime = (new Date(serverMlsTime)).toLocaleString('en-GB', {timeZone: tz})
      }
    }
  },
  watch: {
    internalError (newValue) {
      if (newValue) {
        this.sheet = true
        this.currentTime()
        let modifyBottomNav = document.getElementsByClassName('bottom-nav')[0]
        if (modifyBottomNav) {
          modifyBottomNav.setAttribute('style', 'z-index: 1')
        }
      }
    }
  },
  mounted () {
  }
}
</script>

<style lang="stylus">
@import '~@/css/config'
.v-bottom-sheet
  min-width: 0 !important
  border-radius: 4px 4px 0 0
  font-size: 14px
  padding: 5px 0
  text-align: center
  max-width: 25%
  margin-bottom 0
  // border 1px solid #ccc
  color #fff
  background: #db3f3f
  @media mobile-big-and-below
    max-width: 100%
    font-size: 12px
    padding: 5px
    // z-index: 9999
    // position: relative
    // bottom: -65px
    margin-bottom: 60px !important
  .sheet-title
    font-size: 16px
    font-weight: bold
    @media mobile-big-and-below
      font-size: 14px
  .sheet-close img
    padding-right 16px
    min-height: 24px
    cursor pointer
    @media mobile-big-and-below
      padding 0
  p
    margin-bottom: 0
  .content-holder
    display: grid
    .btn
      height: 20px
      float: right

  /* iphone X */
// .v-bottom-sheet
//   @media only screen and (min-device-width: 375px) and (min-device-height: 812px) and (-webkit-device-pixel-ratio: 3)
//       margin-bottom -25px

//   /* iphone 13 Pro Max */
// .v-bottom-sheet
//   @media only screen and (min-device-width: 428px) and (min-device-height: 926px) and (-webkit-device-pixel-ratio: 3)
//       margin-bottom -33px

//   /* iphone XR */
// .v-bottom-sheet
//   @media only screen and (min-device-width: 414px) and (min-device-height: 896px) and (-webkit-min-device-pixel-ratio: 2)
//     margin-bottom -30px

//   /* iphone 8 */
// .v-bottom-sheet
//   @media only screen and (min-device-width: 375px) and (max-device-height: 667px) and (-webkit-device-pixel-ratio: 2)
//     margin-bottom -8px

//   /*Iphone 6,7 Plus*/
// .v-bottom-sheet
//   @media only screen and (min-device-width: 414px) and (max-device-height: 736px)
//     margin-bottom -15px

//   /*Samsung Galaxy S8*/
// .v-bottom-sheet
//   @media only screen and (min-device-width: 360px) and (max-device-height: 740px)
//     margin-bottom -15px

</style>
