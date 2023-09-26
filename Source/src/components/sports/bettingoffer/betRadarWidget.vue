<template>
  <!-- This version uses iFrame -->
<div class="bet-radar-widget" >
<!--{{ reciveMsgFromIframe }}-->
  {{ messageFunc() }}
  <iframe
    :src="`${iframe.srcScreen}?id=${betradarid}&ismobile=${!isBigger}&isLive=${isLive}&clientid=${betradarClientId}&brandkey=${brandKey}`"
    :scrolling="iframe.style.scrolling || 'auto'"
    :width="calculatedWith"
    frameborder="0"
    class="frame"
    id="iframe"
  ></iframe>
</div>
</template>
<!--adding a class .live to the widget wrapper div (#sr-widget) when the game is live,
so we can give the color green to the game time (Sportsradar doesn't give different classes if the game is live)-->
<script>
  // import Vue from 'vue'
  import store from '@/store'
  import Screen from '@/components/mixins/Screen'
  import Branding from '@/components/mixins/Branding'

  export default {
    name: 'bet-radar-widget',

    mixins: [
      Screen,
      Branding
    ],

    components: {},

    props: [
      'betradarid',
      'isLive'
    ],

    data () {
      return {
        calculatedWith: '835px',
        isBigger: true,
        data: {
          c: 0
        },
        iframe: {
          srcSmallScreen: '/static/external/betradar-widget-small.html',
          srcScreen: '/static/external/betradar-widget.html',
          style: {
            width: '100%',
            scrolling: 'no'
          }
        }
      }
    },
    methods: {
      bindEvent: function (element, eventName, eventHandler) {
        if (element.addEventListener) {
          element.addEventListener(eventName, eventHandler, false)
        } else if (element.attachEvent) {
          element.attachEvent('on' + eventName, eventHandler)
        }
      },

      messageFunc: function () {
        this.removeEventWithClass('sr-poweredby__wrapper') // removing unnecessary events (like link to bet radar web page)
        this.bindEvent(window, 'message', function (e) {
          if (e.data === 'open') {
            var iframe = document.getElementById('iframe')
            var elemHeight = iframe.contentWindow.document.body.offsetHeight
            iframe.style.height = elemHeight + 'px'
            var footer = iframe.contentWindow.document.body.getElementsByClassName('sr-lmt-plus__footer-wrapper')[0]
            footer.className = 'sr-lmt-plus__footer-wrapper custom-footer'
          }
          if (e.data === 'close') {
            var iframe2 = document.getElementById('iframe')
            var footer2 = iframe2.contentWindow.document.body.getElementsByClassName('sr-lmt-plus__footer-wrapper')[0]
            footer2.className = 'sr-lmt-plus__footer-wrapper'
            iframe2.style.height = '235px'
          }
        })
      },
      removeEventWithClass (className) {
        setTimeout(() => {
          var iframe = document.getElementById('iframe')
          var elements = iframe.contentWindow.document.body.getElementsByClassName(className)
          while (elements[0]) {
            elements[0].parentNode.removeChild(elements[0])
          }
        }, 1000)
      },
      isBiggerScreen () {
        this.isBigger = false
        if (this.screenWidth > 1430) {
          this.isBigger = true
        } else if (this.screenWidth > 1200 && this.screenWidth < 1430) {
          this.isBigger = true
          this.calculatedWith = '100%'
        } else if (this.screenWidth >= 1024 && this.screenWidth < 1200) {
          this.isBigger = true
          this.calculatedWith = '80%'
        } else if (this.screenWidth < 1024) {
          this.isBigger = false
          this.calculatedWith = this.screenWidth
        }

        return this.isBigger
      }
    },
    computed: {
      event () {
        return store.getters['eventState/getEvent']
      },
      betradarClientId () {
        return window.ctsautoconf.BR_WIDGET_CLIENTID
      }
    },
    created () {
      this.isBiggerScreen()
    }
}
</script>

<style lang="stylus" scoped>

  @import "~@/css/config.styl"

  .bet-radar-widget
    @media mobile-big-and-below
      display flex
      background-color: #06283b

  iframe{
    overflow hidden
    // width 825px
  }
  .custom-footer {
    position: absolute
    top: -6px
  }

.frame
  height 240px
  @media mobile-big-and-below
    height 235px

</style>
