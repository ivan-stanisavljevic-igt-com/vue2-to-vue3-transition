<template>
  <div class="live-video-streming-component" :class="[liveStreamProvider, {'perform': performVisuality && liveStreamProvider === 'PER2' && visualAndVideo.length > 1 && !isMobile}]">
    <div v-if="videoSrc === 'notLoggedIn'" class="error"><span :key="liveStreamProvider + Math.random()">{{ $t('VideoStreaming.notloggedIn.Message') }}</span></div>
    <div v-else-if="videoSrc === 'noStreamAvailable'" class="error" :key="liveStreamProvider + Math.random()">{{ $t('VideoStreaming.noStreamAvailable.Message') }}</div>
    <div v-else-if="videoSrc === 'noMoneyOrNoPlacedBet'" class="error" :key="liveStreamProvider + Math.random()">{{ $t('VideoStreaming.noMoneyOrNoPlacedBet.Message') }}</div>
    <div v-else-if="videoSrc === 'hlsNotSupported'" class="error" :key="liveStreamProvider + Math.random()">{{ $t('VideoStreaming.hlsNotSupported.Message') }}</div>
    <div v-else-if="videoSrc === 'error'" class="error" :key="liveStreamProvider + Math.random()">{{ $t('VideoStreaming.error.Message') }}</div>
    <div v-else-if="videoSrc === 'noStateEligibleToWatch'" class="error" :key="liveStreamProvider + Math.random()">{{ $t('VideoStreaming.notEligibleState.Message') }}</div>

    <template v-else-if="videoSrc">
      <div id="liveplayer">
        <template v-if="liveStreamProvider === 'BRD'">
          <video preload="auto" autoplay="autoplay" playsinline controls>
            <!-- <source v-if="isMobile" :src="videoSrc" type="application/x-mpegURL">
            <source v-else :src="videoSrc" type="application/dash+xml"> -->
            <source :src="videoSrc" type="application/x-mpegURL">
          </video>
        </template>
      </div>
      <template v-if="liveStreamProvider === 'IMG'">
        <video v-if="this.videoSrc !== null && this.videoSrc !== 'error'" id="plyrPlayer" playsinline autoplay muted loop crossorigin type="application/dash+xml"></video>
        <!-- <p id="call-to-play" v-if="visibleCallToPlayMsg && isMobile">Watch Live</p> -->
      </template>
    </template>
    <template>
      <div v-show="performVisuality">
        <div ref="scriptHolder"></div>
      </div>
    </template>
     <!-- <div id="box1" v-if="isMobile">
       <div id="description">
         <h2>Watch live</h2>
         <p>{{ eventName }}</p>
       </div> -->
       <!-- <div class="play_pause_video">></div> -->
       <!-- <div class="close_box">X</div>
    </div>   -->
  </div>
</template>
<script>
  import Screen from '@/components/mixins/Screen'
  import BettingOffer from '@/components/mixins/BettingOffer'
  import Session from '@/components/mixins/Session'
  import Account from '@/components/mixins/Account'
  import Gtm from '@/components/mixins/Gtm'
  import Icon from '@/components/common/Icon'

  import config from '@/config'
  import lib from '@/library'
  import store from '@/store'
  import axios from 'axios'

  export default {
    name: 'live-video-streaming-component',

    components: {
      Icon
    },

    mixins: [
      Screen,
      BettingOffer,
      Session,
      Account,
      Gtm
    ],

    props: [
      'livestream'
      // 'eventName'
    ],

    data () {
      return {
        videoSrc: '',
        streamInitData: [],
        imgVideoSourceUrl: '',
        error: '',
        hlsPlayer: undefined,
        plyrPlayer: undefined,
        performPlayer: undefined,
        visibleCallToPlayMsg: false,
        boxIsClosedByUser: false,
        wrapperForVideo: '',
        boxPlayPauseVideo: '',
        plyrVideo: '',
        plyrVideoWrapper: '',
        plyrWrapper: '',
        plyrVideoControls: '',
        plyrPlayBtn: '',
        performFixtureId: '',
        performStreamId: ''
      }
    },
    computed: {
      isMobile () {
        return store.getters['screenState/getMobileBigAndBelow']
      },
      isFullScreenEnabled () {
        return this.isMobile
      },
      isAutoplayEnabled () {
        return true
        // return !this.isMobile
      },
      isMuted () {
        return false
        // return this.isMobile
      },
      liveStreams () {
        return store.getters['livebettingState/liveStreams']
      },
      liveStreamProvider () {
        return this.livestream && this.livestream.source
      },
      liveStreamType () {
        // return this.isMobile && this.liveStreamProvider !== 'IMG' ? 'MOBILE' : 'FLASH'
        return this.livestream && this.livestream.type
      },
      visualAndVideo () {
        let videoAndVisAvailable = this.liveStreams.filter(livestream => {
          return livestream.idfoevent === this.livestream.idfoevent
        })
        return videoAndVisAvailable
      },
      performVisuality () {
        return typeof this.videoSrc !== 'string' ? true : !true
      },
      userAgent () {
        return lib.core.userAgent.os.name
      },
      dataForInitContentPlayer () {
        return this.streamInitData
      },
      isGeolocated () {
        var isGeolocated = store.getters['getGeolocated']
        return typeof isGeolocated !== 'undefined' ? JSON.parse(isGeolocated) : false
      },
      state () {
        return window.ctsautoconf.STATE
      },
      idfoevent () {
        var idfoevent = this.$route.params.idfoevent && this.$route.params.idfoevent.toString()
        if (idfoevent && idfoevent.indexOf('.') === -1) {
          idfoevent += '.1'
        }

        return idfoevent
      }
      // isEligibleToWatchPerfStream () {
      //   let listOfStates = ['NJ', 'PA', 'WV', 'CO', 'IN']
      //   let eligibleToWatch = listOfStates.some(item => item === this.state)
      //   return eligibleToWatch
      // }
    },
    methods: {
      initializeLiveStreaming () {
        var self = this
        if (this.isLoggedIn) {
          if (this.livestream && this.liveStreamProvider && this.livestream.type) {
            if ((this.totalBalanceValue > 0) || (this.totalBalanceValue <= 0 && this.streamAvailableIfBetPlacedOnEventLastSevenDays())) {
              lib.rpcService.callBroker('EventStreamingService', 'GetURLForStreamExt', {
                'idfoevent': this.livestream.idfoevent,
                'provider': this.liveStreamProvider,
                'streamtype': this.liveStreamType
              }).then(response => {
                if (response && response.result) {
                  self.videoSrc = response.result
                  self.error = ''
                  if (this.liveStreamProvider === 'BRD') {
                    self.initializeBRLivePlayer()
                  } else if (this.liveStreamProvider === 'IMG') {
                    self.fetchIMGLiveStreamingURL()
                  }
                } else {
                  self.videoSrc = 'error'
                  self.error = response.message
                  self.sendGTMWatchLiveError(self.error)
                }
              }).catch((error) => {
                self.videoSrc = 'error'
                self.error = error.message
                self.sendGTMWatchLiveError(self.error)
              })
            } else {
              self.videoSrc = 'noMoneyOrNoPlacedBet'
              self.sendGTMWatchLiveError('noMoneyOrNoPlacedBet')
            }
          } else {
            self.videoSrc = 'noStreamAvailable'
            self.sendGTMWatchLiveError('noStreamAvailable')
          }
        } else {
          self.videoSrc = 'notLoggedIn'
          self.sendGTMWatchLiveError('notLoggedIn')
        }
      },
      initializePerformLiveStreaming () {
        var self = this
        if (this.isLoggedIn) {
          if (this.livestream && this.liveStreamProvider && this.livestream.type) {
            if ((this.totalBalanceValue > 0) || (this.totalBalanceValue <= 0 && this.streamAvailableIfBetPlacedOnEventLastSevenDays())) {
              if (this.isGeolocated) {
                lib.rpcService.callBroker('EventStreamingService', 'AuthorizePer2Stream', {
                  'idfoevent': this.livestream.idfoevent,
                  'streamtype': 'LIVESTREAM'
                }).then(response => {
                  if (response && response.result) {
                    self.videoSrc = response.result
                    self.error = ''
                    self.initContentPlayer(self.videoSrc)
                  } else {
                    console.log('no response error', response.message)
                    self.videoSrc = 'error'
                    self.error = response.message
                    self.sendGTMWatchLiveError(self.error)
                  }
                }).catch((error) => {
                  console.log('no stream error', error)
                  self.videoSrc = 'error'
                  const cbsErrorMsg = document.getElementsByClassName('csb-wrapper-error')
                  setTimeout(() => {
                    console.log(cbsErrorMsg)
                    if (cbsErrorMsg.length > 0) {
                      error.message = cbsErrorMsg[0].innerText
                    } else {
                      error.message = 'error in stream initialization'
                    }
                    self.error = error.message
                    self.sendGTMWatchLiveError(self.error)
                  }, 200)
                })
              } else {
                self.videoSrc = 'noStateEligibleToWatch'
                self.error = 'Video not available in this state'
                self.sendGTMWatchLiveError(self.error)
              }
            } else {
              self.videoSrc = 'noMoneyOrNoPlacedBet'
              self.sendGTMWatchLiveError('noMoneyOrNoPlacedBet')
            }
          } else {
            self.videoSrc = 'noStreamAvailable'
            self.sendGTMWatchLiveError('noStreamAvailable')
          }
        } else {
          self.videoSrc = 'notLoggedIn'
          self.sendGTMWatchLiveError('notLoggedIn')
        }
      },
      fetchIMGLiveStreamingURL () {
        var self = this
        axios.get(this.videoSrc).then((response) => {
          let urls = response && response.data
          self.imgVideoSourceUrl = urls && urls.hlsUrl
          if (self.liveStreamProvider === 'IMG') {
            self.initPlyrHLSPlayer(self.imgVideoSourceUrl)
          }
        }).catch((error) => {
          console.log('LiveVideoStreamingComponent error - ' + error)
          // tracking event for errors bad link
          self.sendGTMWatchLiveError(error.message)
          self.videoSrc = 'error'
          self.imgVideoSourceUrl = ''
        })
      },
      initPlyrHLSPlayer (url) {
        setTimeout(() => {
          const source = url
          const video = document.getElementById('plyrPlayer')
          const player = new window.Plyr(video,
            {
              captions: {active: true, update: true, language: 'en'},
              controls: ['play-large', 'play', 'mute', 'volume', 'captions', 'airplay']
            })
          var self = this
          player.debug = true
          this.plyrPlayer = player
          this.plyrVideo = video
          // stream started successfully event track
          // player.on('ready', event => {
          //   if (window.scrollY > 220) {
          //     this.visibleCallToPlayMsg = false
          //   } else {
          //     this.visibleCallToPlayMsg = true
          //   }
          // })
          player.on('playing', event => {
            // const plyrWrapper = document.querySelectorAll('.plyr')[0]
            // this.plyrVideoWrapper = plyrWrapper
            // this.visibleCallToPlayMsg = false
            this.sendGTMWatchLiveStartedSuccesfully()
          })
          // player.on('pause', event => {
          //   if (window.scrollY > 220) {
          //     this.visibleCallToPlayMsg = false
          //     this.stylingPlyrPlayerElements(40, 145, 'none')
          //   } else {
          //     this.visibleCallToPlayMsg = true
          //   }
          // })
          // error event for Ios
          player.on('error', () => {
            let responseError
            responseError = {
              'code': null,
              'text': 'Unknown error'
            }
            this.sendGTMWatchLiveError(responseError)
            this.videoSrc = 'error'
          })
          // if (self.isMobile) {
          //   if (this.plyrPlayer) {
          //     this.getPlyrPlayerElements()
          //     this.definingElementsForScrollHandler()
          //     this.closeScrollBoxPlayPauseVideo()
          //     this.customPlayPauseVideo()
          //     this.watchLiveMsgVisibility()
          //   }
          // }
          if (!window.Hls.isSupported()) {
            video.src = source
          } else {
            self.hlsPlayer = new window.Hls()
            self.hlsPlayer.attachMedia(video)
            self.hlsPlayer.on(window.Hls.Events.MEDIA_ATTACHED, () => {
              self.hlsPlayer.loadSource(source)
              self.hlsPlayer.on(window.Hls.Events.MANIFEST_PARSED, () => {
              })
            })
            self.hlsPlayer.on(window.Hls.Events.ERROR, (event, data) => {
              let responseError
              if (data.fatal) {
                self.plyrPlayer.destroy()
                self.hlsPlayer.destroy()
                self.videoSrc = 'error'
              }
              if (!data) {
                responseError = {
                  'code': null,
                  'text': 'Unknown error'
                }
              } else if (data.response) {
                responseError = {
                  'code': data.response.code,
                  'text': data.response.text,
                  'type': data.response.type
                }
              } else {
                responseError = data.reason
              }
              self.sendGTMWatchLiveError(responseError)
              self.hlsPlayer.detachMedia()
              self.videoSrc = 'error'
            })
            self.hlsPlayer.on(window.Hls.Events.DESTROYING, () => {
              console.log('destroyed')
            })
          }
          window.player = player
        }, 0)
      },
      initContentPlayer (data) {
        if (!data) {
          this.videoSrc = 'error'
          this.sendGTMWatchLiveError()
          this.streamInitData = []
          return
        }
        this.getPerformConfigIds()
        this.streamInitData.push(data)
        let dataForInit = data
        let currentLocatedState = window.location.origin
        let scriptEl = document.createElement('script')
        scriptEl.setAttribute('src', '//player.performgroup.com/csb.js')
        scriptEl.setAttribute('data-uuid', this.performFixtureId)
        scriptEl.setAttribute('data-outletkey', config.app.outletKeyForPerformLiveStream)
        scriptEl.setAttribute('data-apptype', 'csb')
        scriptEl.setAttribute('data-env', 'betting')
        scriptEl.setAttribute('data-mode', 'mini')
        scriptEl.setAttribute('data-width', '430')
        scriptEl.setAttribute('data-height', '270')
        scriptEl.setAttribute('data-widgetvis', 'true')
        scriptEl.setAttribute('data-vis3d', 'true')
        scriptEl.setAttribute('data-version', 'latest')
        scriptEl.setAttribute('data-autoplay', 'false')
        scriptEl.setAttribute('data-streamonly', 'true')
        scriptEl.setAttribute('data-videoonly', 'true')
        scriptEl.setAttribute('data-csspath', `${currentLocatedState}/static/liveplayer/perform/custom`)
        scriptEl.setAttribute('data-streamuuid', this.performStreamId)
        scriptEl.setAttribute('data-streamuser', dataForInit.UserId)
        scriptEl.setAttribute('data-oauthtoken', dataForInit.AccessToken)
        this.$refs.scriptHolder.appendChild(scriptEl)
        let num = document.body.clientWidth
        if (this.isMobile) {
          scriptEl.setAttribute('data-width', num)
        }
        // catching success play start
        const videoPerf = document.querySelector('iframe')
        if (!videoPerf.paused) {
          this.sendGTMWatchLiveStartedSuccesfully()
        }
        // catching errors
        const cbsErrorMsg = document.getElementsByClassName('csb-wrapper-error')
        let errorMsg
        this.sendErrorMsgToGtm(cbsErrorMsg, errorMsg, 1000)
      },
      getPerformConfigIds () {
        if (this.visualAndVideo.length === 1) {
          this.performFixtureId = this.visualAndVideo[0].externalid
          this.performStreamId = this.visualAndVideo[0].id
        } else {
          this.visualAndVideo.forEach(item => {
            if (item.type === 'LIVESTREAM') {
              this.performStreamId = item.id
            }
            if (item.type === 'CONTENT') {
              this.performFixtureId = item.externalid
            }
          })
        }
      },
      initializeBRLivePlayer () {
        var self = this
        setTimeout(() => {
          var config = {
            id: 'liveplayer',
            autoplay: self.isAutoplayEnabled,
            mute: self.isMuted,
            allowFullScreen: self.isFullScreenEnabled
          }

          /*eslint-disable */
          // eslint ignore because executing constructor from betradar object which doesn't pass the eslint check
          var avvplInstance = new window.avvpl.setupPlayer(config)
          /*eslint-enable */
          avvplInstance.on('streamStarted', () => {
            this.sendGTMWatchLiveStartedSuccesfully()
          })

          avvplInstance.on('error', (payload) => {
            self.sendGTMWatchLiveError((payload && payload.message && payload.message.userMessage) || 'Unknown error')
          })

          avvplInstance.on('fullscreenChange', (isFullScreen) => {
            self.sendGTMWatchLiveFullScreen(isFullScreen)
          })
        }, 100)
      },
      // getPlyrPlayerElements () {
      //   this.plyrWrapper = document.querySelectorAll('.plyr')[0]
      //   this.plyrVideoControls = document.querySelectorAll('.plyr__controls')[0]
      //   this.plyrPlayBtn = document.querySelectorAll('.plyr__control--overlaid')[0]
      // },
      // stylingPlyrPlayerElements (width, height, displaycontrols, displaybtn) {
      //   this.plyrWrapper.style.maxWidth = width + '%'
      //   this.plyrWrapper.style.minWidth = height + 'px'
      //   this.plyrVideoControls.style.display = displaycontrols
      //   this.plyrPlayBtn.style.display = displaybtn
      // },
      // setBoxPlayPauseVideoStyle (current, style) {
      //   // this.boxPlayPauseVideo.classList.current(style)
      // },
      // setScrollEventHandler () {
      //   window.addEventListener('scroll', () => {
      //     if (this.isMobile && this.wrapperForVideo) {
      //       if (window.scrollY > 220) {
      //         if (!this.boxIsClosedByUser) {
      //           this.wrapperForVideo.classList.add('box')
      //         }
      //         if (this.liveStreamProvider === 'IMG') {
      //           let isVideoPlayingCurrently = this.plyrPlayer.playing ? 'flex' : 'none'
      //           this.stylingPlyrPlayerElements(40, 145, isVideoPlayingCurrently, 'block')
      //           this.visibleCallToPlayMsg = false
      //           if (!this.boxIsClosedByUser) {
      //             this.boxPlayPauseVideo.classList.add('box1')
      //           }
      //         }
      //       }
      //       if (window.scrollY < 220) {
      //         this.wrapperForVideo.classList.remove('box')
      //         if (this.liveStreamProvider === 'IMG') {
      //           this.stylingPlyrPlayerElements(100, 200, 'flex', 'block')
      //           this.boxIsClosedByUser = false
      //           if (!this.plyrPlayer.playing) {
      //             this.visibleCallToPlayMsg = true
      //           }
      //           this.boxPlayPauseVideo.classList.remove('box1')
      //         }
      //       }
      //     }
      //   })
      // },
      sendErrorMsgToGtm (el, msg, time) {
        // this.videoSrc = 'error'
        setTimeout(() => {
          if (el.length > 0) {
            this.videoSrc = 'error'
            msg = el[0].innerText
            this.error = msg
            this.sendGTMWatchLiveError(this.error)
          }
        }, time)
      },
      // definingElementsForScrollHandler () {
      //   const boxForText = document.querySelector('#box1')
      //   const videoWrapper = document.querySelectorAll('.live-video-streming-component')[0]
      //   this.wrapperForVideo = videoWrapper
      //   this.boxPlayPauseVideo = boxForText
      // },
      // customPlayPauseVideo () {
      //   let customPlayPauseBtn = document.querySelectorAll('.plyr__control--overlaid')[0]
      //   customPlayPauseBtn.addEventListener('click', () => {
      //     if (this.plyrVideo.paused) {
      //       this.plyrPlayer.pause()
      //     } else {
      //       this.plyrPlayer.play()
      //       if (window.scrollY < 220) {
      //         this.stylingPlyrPlayerElements(100, 200, 'flex')
      //       }
      //       if (window.scrollY > 220) {
      //         this.stylingPlyrPlayerElements(40, 145, 'flex')
      //       }
      //     }
      //   })
      // },
      // closeScrollBoxPlayPauseVideo () {
      //   let closeScrollBox = document.querySelectorAll('.close_box')[0]
      //   closeScrollBox.addEventListener('click', () => {
      //     this.boxPlayPauseVideo.classList.remove('box1')
      //     this.wrapperForVideo.classList.remove('box')
      //     this.boxIsClosedByUser = true
      //   })
      // },
      // watchLiveMsgVisibility () {
      //   setTimeout(() => { this.visibleCallToPlayMsg = true }, 1800)
      // },
      streamAvailableIfBetPlacedOnEventLastSevenDays () {
        let ifBetsPlacedOnEvent = store.getters['sbBetslipState/hasBetPlacedOnEvent'](this.idfoevent)
        let currentDate = new Date()
        let dateWhenEventIsLive = currentDate.getTime()
        let periodFromBetToLiveEventDate = Math.round((dateWhenEventIsLive - ifBetsPlacedOnEvent) / (60 * 60 * 24 * 1000))
        return periodFromBetToLiveEventDate <= 7 ? true : !true
      }
    },

    watch: {
      stream () {
        this.videoSrc = ''
        this.imgVideoSourceUrl = ''
        this.initializeLiveStreaming()
      }
    },
    beforeDestroy () {
      if (this.hlsPlayer && this.plyrPlayer) {
        this.hlsPlayer.destroy()
        this.plyrPlayer.destroy()
        window.player = null
      }
      if (this.performPlayer) {
        this.performPlayer.destroy()
      }
    },
    mounted () {
      if (this.liveStreamProvider === 'PER2') {
        console.log('provider', this.liveStreamProvider)
        this.initializePerformLiveStreaming()
      } else {
        console.log('provider', this.liveStreamProvider)
        this.initializeLiveStreaming()
      }
    },
    created () {
      // this.setScrollEventHandler()
    }
  }
</script>
<style lang="stylus" scoped>
  @import "~@/css/config";
  .live-video-streming-component
    background-color #ffffff
    color #000
    &.PER2
      background-color transparent
      .vis_stats
        display none !important
      &.box
        transform: translate3d(0, -20px, 0)
        transition: transform 2s ease
        opacity: 1
        color: black
        z-index: 9999
        height: 100px
        background: #fff
        position: fixed
        bottom: 50px
        width: 45%
      @media mobile-big-and-below
        background transparent
    &.IMG
      background-color transparent
      &.box
        transform: translate3d(0, -20px, 0)
        transition: transform 2s ease
        opacity: 1
        color: black
        z-index: 1
        height: 95px
        background: #fff
        position: fixed
        bottom: 35px
        // width: 45%
        width: 100%
    &.BRD
      background-color transparent
      &.box
        transform: translate3d(0, -20px, 0)
        transition: transform 2s ease
        opacity: 1
        color: black
        z-index: 9999
        height: 100px
        background: #fff
        position: fixed
        bottom: 40px
        width: 45%
    .error
      color white
      font-size 18px
      height 240px
      padding-top 100px
      text-align center
      background-color #000000!important
      @media mobile-big-and-below
        font-size 14px
        height 220px
        padding-left: 15px
        padding-right: 15px
    #call-to-play
      font-family: 'Proxima Nova Regular', Arial, Helvetica, sans-serif
      color: white
      font-size 12px
      font-weight bold
      font-stretch: normal;
      font-style: normal;
      line-height: normal;
      letter-spacing: normal;
      position: absolute
      top: 35%
      left: 39%
      text-transform uppercase
      transform: translate(35%, 35%)
      @media mobile-big-and-below
        left: 50%
        top: 43%
        transform: translate(-50%, -50%)
    #box1
      display none
    .box1
      transform: translate3d(0, -5px, 0)
      transition: transform 3s ease
      opacity: 1
      border-top 1px solid #1493ff
      color: black
      z-index: 9999
      height: 100%
      background: #fff
      position: fixed
      bottom: 0px
      top 5px
      width: 60%
      left: 145px
      display flex !important
      @media screen and (max-width: 480px) and (min-width: 360px)
        width: 70% !important
      @media screen and (max-width: 359px)
        width: 55% !important
      #description
        flex 1
        padding 5px 5px 5px 15px
        h2
          margin 5px 0 0 0
        p
         font-size 12px
      .close_box
      .play_pause_video
        flex 1
        align-self center
        display flex
        justify-content center
   .video
     height 230px
   .perform
     width 430px
     height 270px
   .csb-wrapper-error
     border: 1px solid red!important
     padding: 15px!important
     background: #666!important
     border-radius: 10px
    video
      width 100%
    video::-webkit-media-controls-enclosure-plyr__progress__container
      display:none !important;
</style>
