<template>
  <v-flex class="geolocation-progress" :class="[{'geoInProgessOrSuccess': (mgProgress.inProgress && !mgProgress.postContentFailed) || (!mgProgress.inProgress && mgProgress.postContentSuccess)}, {'geoFailed': !mgProgress.inProgress && mgProgress.postContentFailed}]">
    <v-flex class="content-wrapper" v-if="mgProgress.inProgress && !mgProgress.postContentFailed && mgProgress.isFirstCheck">
      <geolocation-loader />
      <p class="text-info">
        <span class="mark-text">{{ $t('Geolocation.Checking') }}</span>
      </p>
    </v-flex>
    <v-flex class="content-wrapper" v-if="!mgProgress.inProgress && mgProgress.postContentFailed">
        <div class="text-info">
          <span>
            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 130.2 130.2">
              <circle class="path circle" fill="none" stroke="#fff" stroke-width="6" stroke-miterlimit="10" cx="65.1" cy="65.1" r="62.1"/>
              <line class="path line" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round" stroke-miterlimit="10" x1="34.4" y1="37.9" x2="95.8" y2="92.3"/>
              <line class="path line" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round" stroke-miterlimit="10" x1="95.8" y1="38" x2="34.4" y2="92.2"/>
            </svg>
          </span>
          <span class="failed">{{mgProgress.count === 1 ? 'Cannot verify your location': 'There are issues with your account'}}</span>
        </div>
        <div class="btn-wrapper">
          <button type="button" @click="view()" class="custom-btn">{{mgProgress.count === 1 ? 'View Details': 'Show All'}}</button>
        </div>
    </v-flex>
    <v-flex class="content-wrapper" :class="{'location-verified': mgProgress.postContentSuccess}" v-if="!mgProgress.inProgress && mgProgress.postContentSuccess && mgProgress.isFirstCheck">
      <p class="text-info">
        <span>
          <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 130.2 130.2">
            <circle class="path circle" fill="none" stroke="#73AF55" stroke-width="6" stroke-miterlimit="10" cx="65.1" cy="65.1" r="62.1"/>
            <polyline class="path check" fill="none" stroke="#73AF55" stroke-width="6" stroke-linecap="round" stroke-miterlimit="10" points="100.2,40.2 51.5,88.8 29.8,67.5 "/>
          </svg>
        </span>
        <span class="mark-text">{{ $t('Geolocation.Location.Verified') }}</span>
      </p>
    </v-flex>
  </v-flex>
</template>
<script>

import store from '@/store'
import mobileBridge from '@/library/mobileBridge'
import Icon from '@/components/common/Icon'
import CircleLoader from '@/components/common/CircleLoader'
import GeolocationLoader from '@/components/common/GeolocationLoader.vue'

export default {
  name: 'mobileGeolocationDialog',
  components: {
    Icon,
    CircleLoader,
    GeolocationLoader
  },
  computed: {
    mgProgress () {
      return store.getters['getMobileGeolocationInProgress']
    }
  },
  methods: {
    view () {
      mobileBridge.bridgeSendRequest('showLocationMessage', this.mgProgress.id)
    }
  },
  mounted () {}
}
</script>

<style lang="stylus" scoped>
  .geolocation-progress
    // height: 40px
    color: #fff
    font-size: 14px
    position: relative
    font-weight: normal
    font-style: normal
    font-stretch: normal
    line-height: normal
    letter-spacing: normal
    font-family: inherit
    // margin-bottom 40px
    .text-info
      line-height 40px
      // padding-left: 5px
      margin: 0
      @media only screen and (max-device-width: 320px)
        font-size: 12px !important
      .mark-text, .failed
        font-family: inherit
        margin-left: 5px
        font-size: 14px
  &.geoInProgessOrSuccess
    background-color: #1493ff
  &.geoFailed
    background-color: #f00
  &.location-verified
    background-color #7ac142
  svg
    height: 20px
    width: 20px
  .content-wrapper
    display flex
    // flex-direction: row-reverse
    padding: 0 5px
    height: 40px
    // justify-content: flex-end
    // margin-bottom 5px
    .text-info
      flex-grow: 1
      display: flex
      span
        display: flex
        align-items: center
    .btn-wrapper
      flex-grow: 1
      line-height: 41px
      .custom-btn
        float: right
    .material-icons
      font-size: 21px
      position: relative
      bottom: -6px
      font-weight: normal

.loader-image
  width: 13px
  height: 13px
  object-fit: contain
  border-style: solid
  border-width: 2px
  border-image-source: conic-gradient(rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.67) 66%, rgba(255, 255, 255, 1) 85%, rgba(255, 255, 255, 0) 0%)
  border-image-slice: 1

.verified-icon
  color: #ffffff
  bottom: 2px !important
  margin: 0 5px
  font-size: 16px !important

.loader 
  border: 4px solid #CFD6DB;
  border-top: 4px solid #ff671f;
  width 20px
  height 20px

.path {
  stroke-dasharray: 1000;
  stroke-dashoffset: 0;
  stroke-width: 10
  stroke #fff
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

</style>

