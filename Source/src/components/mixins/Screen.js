import store from '@/store'

var breakPoints = {
  mobile: 0,
  mobileBig: 601,
  tablet: 1024,
  // tabletBig: 1025,
  desktop: 1241,
  desktopBig: 1441
}

export default {
  data () {
    return {
      scrollTags: null
    }
  },
  computed: {
    serviceActive () {
      return store.getters['screenState/getServiceActive']
    },

    isScrolled () {
      return this.scrollValue > 0
    },
    scrollValue () {
      return store.getters['screenState/getScrollValue'] > 0 ? store.getters['screenState/getScrollValue'] : 0
    },

    screenWidth () {
      return store.getters['screenState/getWidth'] ? store.getters['screenState/getWidth'] : breakPoints.desktop
    },

    screenHeight () {
      return store.getters['screenState/getHeight']
    },

    screenOrientation () {
      return store.getters['screenState/getOrientation']
    },

    mobile () {
      return this.screenWidth < breakPoints.mobileBig
    },

    mobileBigAndBelow () {
      var isMobileBigAndBelow = this.screenWidth < breakPoints.tablet
      store.commit('screenState/setMobileBigAndBelow', isMobileBigAndBelow)
      return isMobileBigAndBelow
    },

    mobileBig () {
      return this.screenWidth >= breakPoints.mobileBig && this.screenWidth < breakPoints.tablet
    },

    mobileBigAndAbove () {
      return this.screenWidth >= breakPoints.mobileBig
    },

    tabletAndBelow () {
      return this.screenWidth < breakPoints.desktop
    },

    tablet () {
      return this.screenWidth >= breakPoints.tablet && this.screenWidth < breakPoints.desktop
    },

    tabletAndAbove () {
      return this.screenWidth >= breakPoints.tablet
    },

    // tabletBigAndBelow () {
    //   return this.screenWidth < breakPoints.desktop
    // },
    //
    // tabletBig () {
    //   return this.screenWidth >= breakPoints.tabletBig && this.screenWidth < breakPoints.desktop
    // },
    //
    // tabletBigAndAbove () {
    //   return this.screenWidth >= breakPoints.tabletBig
    // },

    desktopAndBelow () {
      return this.screenWidth < breakPoints.desktopBig
    },
    desktop () {
      return this.screenWidth >= breakPoints.desktop && this.screenWidth < breakPoints.desktopBig
    },
    desktopAndAbove () {
      return this.screenWidth >= breakPoints.desktop
    },

    desktopBigAndAbove () {
      return this.screenWidth >= breakPoints.desktopBig
    },

    mobileAndBigger () {
      return this.screenWidth >= breakPoints.mobile
    },

    landscape () {
      return this.screenOrientation === 'landscape'
    },

    portrait () {
      return this.screenOrientation === 'portrait'
    },
    geolocationMsgHeight () {
      return store.getters['screenState/getGeolocationMsgValue']
    },
    numberOfTabs () {
     /* if (this.screenWidth < breakPoints.tablet) {
        return 3
      } else {
        return 5
      } */
      return 5
    }
  },

  methods: {
    fetchScreenData () {
      store.commit('screenState/setServiceActive')

      store.dispatch('screenState/fetchSizeData')
      store.dispatch('screenState/fetchScrollData')

      window.onresize = function () {
        store.dispatch('screenState/fetchSizeData')
      }

      window.addEventListener('scroll', function () {
        store.dispatch('screenState/fetchScrollData')
      })
    },
    forEachScrollTag (callback) {
      if (this.scrollTags && this.scrollTags.length) {
        this.scrollTags.forEach(callback)
      }
    },
    addBodyClass (className) {
      const el = document.body
      el.classList.add(className)
    },
    removeBodyClass (className) {
      const el = document.body
      el.classList.remove(className)
    },
    enableScroll () {
      this.forEachScrollTag((item, i) => {
        item.style['overflow-y'] = 'visible'
        item.classList.remove('disabled-scroll')
      })
    },
    disableScroll () {
      this.forEachScrollTag((item, i) => {
        item.style['overflow-y'] = 'hidden'
        item.classList.add('disabled-scroll')
      })
    }
  },

  created () {
    // remove page scroll
    this.scrollTags = document.querySelectorAll('html, body')
  },

  mounted () {
    if (!this.serviceActive) {
      this.fetchScreenData()
    }
  }
}
