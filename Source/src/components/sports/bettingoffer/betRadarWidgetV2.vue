<template>
  <div class="bet-radar-widget" >
    <div id="betradarScriptContainer" ng-init="loadScript()" ref="betradarScriptContainer"></div>
    <div id="sr-widget" class="betradar-widget-container-desktop" :class="brandKey">
      <div class="score">
        <!-- scoreboard widget will be inject here -->
      </div>
      <div class="lmt">
        <!-- Live match tracker Pitch widget will be inject here -->
      </div>
    </div>
    <div id="sr-widget" class="betradar-widget-container-mobile" :class="brandKey"></div>
  </div>
</template>
<script>

import Screen from '@/components/mixins/Screen'
import Branding from '@/components/mixins/Branding'

export default {
  name: 'bet-radar-widget-v2',

  mixins: [
    Screen,
    Branding
  ],

  components: {},

  props: [
    'betradarId'
  ],

  data () {
    return {
      betradarWidgetObj: undefined,
      betradarWidgetLmtObj: undefined,
      checkScriptTimeout: 0
    }
  },
  computed: {
  },
  methods: {
    initializeBetradarWidget () {
      // this adds the Live match Pitch widget desktop version
      this.betradarWidgetObj = window.SIR('addWidget', '.betradar-widget-container-desktop .score', 'match.lmtplus', {
        layout: 'single',
        scoreboard: 'extended',
        momentum: 'extended',
        collapseTo: 'momentum',
        tabsPosition: 'top',
        disableWidgetHeader: true,
        disableCrests: true,
        matchId: this.betradarId,
        activeSwitcher: 'scoreDetails'
      })

      // this adds the scoreboard widget desktop version
      this.betradarWidgetLmtObj = window.SIR('addWidget', '.betradar-widget-container-desktop .lmt', 'match.lmtplus', {
        layout: 'single',
        scoreboard: 'disable',
        momentum: 'disable',
        collapseTo: 'disable',
        tabsPosition: 'top',
        disableWidgetHeader: true,
        disableCrests: true,
        matchId: this.betradarId,
        activeSwitcher: 'scoreDetails'
      })
      this.betradarWidgetObj = window.SIR('addWidget', '.betradar-widget-container-mobile', 'match.lmtplus', {
        layout: 'single',
        scoreboard: 'extended',
        momentum: 'extended',
        collapseTo: 'momentum',
        tabsPosition: 'top',
        disableWidgetHeader: true,
        disableCrests: true,
        matchId: this.betradarId,
        activeSwitcher: 'scoreDetails'
      })
      window.SIR('changeTeamInvert', {
        all: true,
        sid: {
          1: false,
          5: false
        }
      })
    },
    destroyBetradarWidget () {
      clearTimeout(self.checkScriptTimeout)
      if (this.isSRLiveLoaded()) {
        window.SIR('removeWidget', '.betradar-widget-container-mobile')
        window.SIR('removeWidget', '.betradar-widget-container-desktop .score')
        window.SIR('removeWidget', '.betradar-widget-container-desktop .lmt')
      }
    },
    loadWidgetWhenScriptIsLoaded () {
      var self = this
      clearTimeout(self.checkScriptTimeout)
      self.checkScriptTimeout = setTimeout(() => {
        if (this.isSRLiveLoaded()) {
          self.initializeBetradarWidget()
        } else {
          self.loadWidgetWhenScriptIsLoaded()
        }
      }, 1000)
    },
    loadScript () {
      if (!this.isSRLiveLoaded()) {
        var betradarScriptLoaderUrl = '/static/external/betradar-widget.js'
        var scriptElement = document.createElement('script')
        var scriptContainer = this.$refs.betradarScriptContainer

        if (scriptContainer) {
          scriptElement.src = betradarScriptLoaderUrl
          scriptContainer.appendChild(scriptElement)
          this.loadWidgetWhenScriptIsLoaded()
        }
      } else {
        this.initializeBetradarWidget()
      }
    },
    isSRLiveLoaded () {
      try {
        /*eslint-disable */
        return !!window.SIR
        /*eslint-enable */
      } catch (exc) {
        return false
      }
    }
  },
  mounted () {
    this.loadScript()
  },
  destroyed () {
    this.destroyBetradarWidget()
  }
}
</script>

<style lang="stylus">

  @import "~@/css/config.styl"

  .bet-radar-widget
    @media mobile-big-and-below
      display flex
      background-color: #06283b

    .betradar-widget-container-desktop,
    .betradar-widget-container-mobile
      overflow hidden
      background #fff
      // height 240px
      @media mobile-big-and-below
        height 235px

      #list_soccer, #list_basketball
        color #1f375b
        padding 8px

        li
          padding 16px 0
        a
          color inherit
    
  .betradar-widget-container-desktop
    display flex
    flex-direction row
    align-items center
    .score
      width 50%
      margin-right 2%
    .lmt
      width 50%
      min-width 317px
      height 100%
      margin-top 10px
    .sr-bb
      width 100%
      .sr-lmt-plus__segment.srm-momentum
        height 173px
      .sr-lmt-plus__footer-wrapper
        display none

  .betradar-widget-container-mobile
    width 100%
    .sr-bb
      width 100%
      .sr-lmt-plus__expand-wrapper
        background-color #31a0fd
        width 100% !important

        &::after
          content ""
          position absolute
          z-index -1
          height 27px
          width 44px
          background-color #31a0fd
          border-radius 50px 50px 0 0
        &:not(.srm-is-collapsed)
          margin-bottom 0px
          width 100% !important
          border-bottom 1px
  //&.srm-is-collapsed

  .sr-loader__container
    width 100%

  .sr-wwrap.srm-fullyloaded
    display flex
    justify-content center

  @media screen and (min-width:1024px)
    #sr-widget.betradar-widget-container-mobile
      display none
  @media screen and (max-width: 1023px)
    #sr-widget.betradar-widget-container-desktop
      display none
    #sr-widget.betradar-widget-container-mobile
      display block
      margin-top 6px
      margin-bottom 0
      height 100%
    .betslip
      display none
    .sidebar
      display none
    .middle
      margin 0
      width 100%
    .banner
      height auto

</style>