<template>
  <v-container fluid :class="['headlines', {'not-plain': !isplain}, {'empty': isempty}, {'hasHeadline': (currentBoNavigationHeadlines && currentBoNavigationHeadlines.length > 0)}]">
    <div v-if="currentBoNavigationHeadlines && currentBoNavigationHeadlines.length > 0" class="headline-wrapper">
      <template v-if="!isplain">
        <div :class="['headline',
            {'active': headline.idfwheadline === selectedTab.idfwheadline},
            {'not-plain': !isplain},
            {'middle': isMiddleAndMobileHeadline(headline)}]"
          :key="index"
          v-for="(headline, index) in currentBoNavigationHeadlines"
          :style="setBackground(headline, true)">
          <!-- <div class="probni-div">{{repositionIndex}}</div>
          <div class="probni-div-dva">{{rotationIndex}}</div> -->
          <circular-rotate :class="['circular-rotate-container']" v-if="enableAutoRotateMobile && ((headline.idfwheadline === selectedTab.idfwheadline) && mobileBigAndBelow && currentBoNavigationHeadlines.length > 1)"
            :rotationInterval="rotationInterval"
            :mobileBigAndBelow="mobileBigAndBelow"
          >
          </circular-rotate>
          <div :class="['promo-container']">
            <div :class="['promo-image']" v-if="headline.imageurl" :style="{backgroundImage: 'url(' + headline.imageurl + ')'}"></div>
            <!-- Standard link types -->
            <div :class="['promo-title']">
              <span :class="['promotext', tabCssClass (headline)]" v-if="headline.promotext">
                <!-- <span :class="['promo-icon']" v-if="headline.icon_url" :style="{backgroundImage: 'url(' + headline.icon_url + ')'}"></span> -->
                <span :class="['promo-label']">{{ headline.promotext }}</span>
              </span>
              <span :class="['datetime']">{{ headline.datetimetext }}</span>
            </div>
           <div :class="['promo-content ', {'link-to': headline.location &&  headline.categoryname === 'BettingHeadlines'}]" v-if="headline.idfwheadlinetype === 'MKPB' &&
                        (headline.linktype === 'BONAVIGATION' || headline.linktype === 'URL' || headline.linktype === 'EXTERNAL' || headline.linktype === 'NONE' || headline.linktype === 'EVENT' )"
                @click.stop="goToHeadlineLink(headline)">
              <div :class="['description']">
                <h2 :class="['title']" v-if="headline.title" v-html="headline.title"></h2>
                <p :class="['bodytext']" v-if="headline.bodytext" v-html="headline.bodytext"></p>
              </div>
            </div>
          </div>
          <div class="arrows-container" v-if="!mobileBigAndBelow">
            <div class="carousel__left" v-if="currentBoNavigationHeadlines.length > 1">
              <button type="button" @click.stop="selectPreviousTab(headline)" class="btn btn--icon theme--dark">
                  <i aria-hidden="true" class="icon material-icons">navigate_before</i>
              </button>
            </div>
            <circular-rotate :class="['circular-rotate-container']" v-if="enableAutoRotateDesktop && ((headline.idfwheadline === selectedTab.idfwheadline) && drawCircularRotateProgres && currentBoNavigationHeadlines.length > 1)"
              :rotationInterval="rotationInterval"
            >
            </circular-rotate>
            <div class="carousel__right" v-if="currentBoNavigationHeadlines.length > 1">
              <button type="button" @click.stop="selectNextTab(headline)" class="btn btn--icon theme--dark">
                <i aria-hidden="true" class="icon material-icons">navigate_next</i>
              </button>
            </div>
          </div>
        </div>
        <v-tabs fixed-tabs align-with-title v-if="!mobileBigAndBelow && currentBoNavigationHeadlines.length > 0" class="headlines-tabs">
          <v-tab
              :class="['tab', {'active': headline.idfwheadline === selectedTab.idfwheadline}, tabCssClass(headline)]" v-for="(headline, index) in currentBoNavigationHeadlines"
              :key="index" @click.stop="selectTabOnClick(headline.idfwheadline)"
              :style="setBackground(headline)">
            <span class="tab-header">{{ headline.header }}</span>
            <span class="tab-footer">{{ headline.footer }}</span>
            <span class="datetime">{{ headline.datetimetext }}</span>
          </v-tab>
        </v-tabs>
      </template>
      <template v-if="isplain">
        <div v-if="currentBoNavigationHeadlines && currentBoNavigationHeadlines[0] && currentBoNavigationHeadlines[0].imageurl && this.$route.name !== 'event'"
          class="background-image"
          :style="{backgroundImage: 'url(' + currentBoNavigationHeadlines[0].imageurl + ')'}">
        </div>
      </template>
    </div>
    <div class="ses" v-if="category === 'BettingHeadlines' && (!currentBoNavigationHeadlines || currentBoNavigationHeadlines.length === 0)">
      <sports-breadcrumb></sports-breadcrumb>
    </div>
  </v-container>

</template>
<script>
  import store from '@/store'
  import headlineEvent from '@/components/sports/bettingoffer/headlineEvent'
  import markets from '@/components/sports/bettingoffer/markets'
  import LiveEventInfo from '@/components/sports/bettingoffer/live/liveEventInfo'
  import Screen from '@/components/mixins/Screen'
  import CircularRotate from '@/components/common/CircularRotate'
  import SportsBreadcrumb from '@/components/sports/bettingoffer/SportsBreadcrumb'
  import BettingOffer from '@/components/mixins/BettingOffer'
  import lib from '@/library'

  export default {
    name: 'headlines',

    props: [
      'category',
      'isplain',
      'isempty'
    ],
    mixins: [
      Screen,
      BettingOffer
    ],

    components: {
      headlineEvent,
      markets,
      LiveEventInfo,
      CircularRotate,
      SportsBreadcrumb
    },

    data () {
      return {
        selectedTabIdFwHeadline: -1,
        rotationIndex: 0,
        rotationInterval: 6000,
        firstPass: true,
        scrollHorizontalCoordinate: 0,
        circularRotateProgres: false,
        title: 'My description',
        currentidfwheadline: 0,
        mobileScrollbarTimer: null,
        repositionIndex: 0,
        isHeadlineSnapped: false,
        isRotationStartedWhenHeadlineSnapped: false,
        activeHeadlineIndex: 0,
        enableAutoRotateMobile: false,
        enableAutoRotateDesktop: true
      }
    },

    computed: {
      isLoggedIn () {
        return store.getters['isLoggedIn']
        // return true
      },
      currentidfwbonavigation () {
        var currentidfwbonavigation = this.idfwbonavigation2 || this.idfwbonavigation1 || null

        if (currentidfwbonavigation && !isNaN(currentidfwbonavigation)) {
          return parseFloat(currentidfwbonavigation)
        } else {
          return currentidfwbonavigation
        }
      },
      headlines () {
        return store.getters['bonavigationState/boNavigationHeadlines']
      },
      currentBoNavigationHeadlines () {
        if (this.isLoggedIn && this.category === 'BettingHeadlines') {
          // return headlines when loggedin (css class loggedin or default)
          return this.headlines && this.headlines.filter(hl => hl.categoryname === this.category && hl.idfwbonavigation === this.currentidfwbonavigation &&
              ((hl.cssclasses && hl.cssclasses.indexOf('loggedout') === -1) || !hl.cssclasses))
        } else {
          // return headlines when loggedout (css class loggedout or default)
          return this.headlines && this.headlines.filter(hl => hl.categoryname === this.category && hl.idfwbonavigation === this.currentidfwbonavigation &&
            ((hl.cssclasses && hl.cssclasses.indexOf('loggedin') === -1) || !hl.cssclasses))
        }
      },
      selectedTab () {
        return this.currentBoNavigationHeadlines.filter(item => item.idfwheadline === this.selectedTabIdFwHeadline)[0] ||
          (this.currentBoNavigationHeadlines && this.currentBoNavigationHeadlines.length > 0 && this.currentBoNavigationHeadlines[0]) || undefined
      },
      // isPromoHeadline () {
      //   return this.currentBoNavigationHeadlines && this.currentBoNavigationHeadlines[0] && !this.isLoggedIn && this.mobileBigAndBelow
      // },
      drawCircularRotateProgres () {
        return this.circularRotateProgres
      },
      browserName () {
        return lib.core.userAgent.browser.name
      }
    },

    methods: {
      selectTab (idfwheadline) {
        for (let i = 0; i < this.currentBoNavigationHeadlines.length; i++) {
          if (this.currentBoNavigationHeadlines[i].idfwheadline === idfwheadline) {
            this.rotationIndex = i
          }
        }
        this.selectedTabIdFwHeadline = idfwheadline
        this.currentidfwheadline = idfwheadline
      },
      selectTabOnClick (idfwheadline) {
        // click on non active tab
        if (idfwheadline !== this.currentidfwheadline) {
          this.stopRotation()
          this.selectTab(idfwheadline)
          this.rotateHeadlineCarousel()
        } else {
          // click on active tab leads to headline link
          if (this.tabletAndAbove) {
            let activeHeadline
            this.currentBoNavigationHeadlines.forEach(headline => {
              if (headline.idfwheadline === idfwheadline) {
                activeHeadline = headline
              }
            })
            this.goToHeadlineLink(activeHeadline)
          }
        }
      },
      goToHeadlineLink (headline) {
        switch (headline.idfwheadlinetype) {
          case 'MKPB':
            switch (headline.linktype) {
              case 'URL':
                if (headline.location) {
                  // external address, must use http or https
                  if (headline.location.indexOf('http://') > -1 || headline.location.indexOf('https://') > -1) {
                    window.location = headline.location
                  } else {
                    // internal address
                    if (headline.location.indexOf('/') !== 0) {
                      headline.location = '/' + headline.location
                    }
                    location.href = headline.location
                  }
                }
                break
              case 'EXTERNAL':
                if (headline.location) {
                  // external address, must use http or https
                  if (headline.location.indexOf('http://') > -1 || headline.location.indexOf('https://') > -1) {
                    window.location = headline.location
                  } else {
                    // internal address
                    if (headline.location.indexOf('/') !== 0) {
                      headline.location = '/' + headline.location
                    }
                    location.href = headline.location
                  }
                }
                break
              case 'BONAVIGATION':
                break
            }
            break
        }
      },
      stopRotation () {
        clearTimeout(this.rotate)
        this.rotate = false
      },
      selectNextTab (headline) {
        this.stopRotation()
        for (let i = 0; i < this.currentBoNavigationHeadlines.length; i++) {
          if (this.currentBoNavigationHeadlines[i].idfwheadline === headline.idfwheadline) {
            if (this.currentBoNavigationHeadlines[i + 1]) {
              this.selectTab(this.currentBoNavigationHeadlines[i + 1].idfwheadline)
            } else {
              this.selectTab(this.currentBoNavigationHeadlines[0].idfwheadline)
            }
          }
        }
        this.rotateHeadlineCarousel()
      },
      selectPreviousTab (headline) {
        this.stopRotation()
        for (let i = 0; i < this.currentBoNavigationHeadlines.length; i++) {
          if (this.currentBoNavigationHeadlines[i].idfwheadline === headline.idfwheadline) {
            if (this.currentBoNavigationHeadlines[i - 1]) {
              this.selectTab(this.currentBoNavigationHeadlines[i - 1].idfwheadline)
            } else {
              this.selectTab(this.currentBoNavigationHeadlines[this.currentBoNavigationHeadlines.length - 1].idfwheadline)
            }
          }
        }
        this.rotateHeadlineCarousel('back')
      },
      rotateHeadlineCarousel (scrollBack) {
        if (this.currentBoNavigationHeadlines.length > 1 && !this.isplain) {
          this.circularRotateProgres = true
          if (this.rotationIndex > this.currentBoNavigationHeadlines.length - 1 || this.rotationIndex < 0) {
            this.rotationIndex = 0
          }
          this.activeHeadlineIndex = this.rotationIndex
          this.selectTab(this.currentBoNavigationHeadlines[this.rotationIndex].idfwheadline)
          if (this.mobileBigAndBelow) {
            if (this.enableAutoRotateMobile) {
              this.scrollForDevice('mobile')
            }
          } else if (this.tablet) {
            this.scrollForDevice('tablet', scrollBack)
          } else {
            this.scrollForDevice('pc', scrollBack)
          }
          this.rotationIndex++
          if (this.mobileBigAndBelow) {
            if (this.enableAutoRotateMobile) {
              setTimeout(this.rotateHeadlineCarousel, this.rotationInterval)
            } else {
              this.scrollHorizontalCoordinate = 0
              this.rotationIndex = 0
              this.rotate = false
            }
          } else {
            this.rotate = setTimeout(this.rotateHeadlineCarousel, this.rotationInterval) // desktop
          }
        }
      },
      setBackground (headline, isForHeadline) {
        var background = 'background: rgb(42,62,86);'
          // active tab/headline is red
        var activeTabBackgroundColor = 'rgb(187,7,42)'
        if (headline && headline.cssclasses) {
          if (headline.cssclasses.toLowerCase().includes('red')) {
            activeTabBackgroundColor = 'rgb(187,7,42)'
          } else if (headline.cssclasses.toLowerCase().includes('green')) {
            activeTabBackgroundColor = 'rgb(65,166,92)'
          } else if (headline.cssclasses.toLowerCase().includes('yellow')) {
            activeTabBackgroundColor = 'rgb(216,133,28)'
          }
        }
        // setting gradient + background via JS, not possible with pure CSS
        if (!isForHeadline && (!this.mobileBigAndBelow || !this.tablet)) {
          // does headline tab have defined background in prism?
          if (headline.backroundimageurl) {
            // is tab active?
            if (headline.idfwheadline === this.selectedTab.idfwheadline) {
              background = 'background: linear-gradient(45deg, ' + activeTabBackgroundColor + ', transparent), url("' + headline.backroundimageurl + '") center/cover no-repeat !important;'
            } else {
              background = 'background: linear-gradient(0deg, rgba(72,84,102,0.8), rgba(72,84,102,0.8)), url("' + headline.backroundimageurl + '") center/cover no-repeat !important;'
            }
          } else {
            if (headline.idfwheadline === this.selectedTab.idfwheadline) {
              if (this.browserName === 'internet-explorer') {
                background = 'background: linear-gradient(45deg, ' + activeTabBackgroundColor + ', rgb(42,62,86))!important; background-image:none; background-color:rgb(42,62,86);'
              } else {
                background = 'background: linear-gradient(45deg, ' + activeTabBackgroundColor + ', rgb(42,62,86))!important;'
              }
            } else {
              background = 'background: rgb(42,62,86);'
            }
          }
          return background
        } else if ((isForHeadline && (this.mobileBigAndBelow))) {
          // -- PPBUS597 and US-516 --
          // does headline tab have defined background in prism?
          if (headline.backroundimageurl) {
            background = 'background: linear-gradient(45deg, ' + activeTabBackgroundColor + ', transparent), url("' + headline.backroundimageurl + '") center/cover no-repeat !important;'
          } else {
            if (this.browserName === 'internet-explorer') {
              background = 'background: linear-gradient(45deg, ' + activeTabBackgroundColor + ', rgb(42,62,86))!important; background-image:none; background-color:rgb(42,62,86);'
            } else {
              background = 'background: linear-gradient(45deg, ' + activeTabBackgroundColor + ', rgb(42,62,86))!important;'
            }
            background = 'background: rgb(42,62,86);'
          }
          return background
        }
      },
      scrollForDevice (device, scrollBack) {
        var activeChildWidth = 0
        var parent = {}
        switch (device) {
          case 'mobile':
            if (document.querySelector('.headlines.not-plain')) {
              parent = document.querySelector('.headlines.not-plain')
            }
            if (document.querySelector('.not-plain.headline.active')) {
              activeChildWidth = parent.querySelector('.not-plain.headline.active').offsetWidth
            }
            if (!this.isRotationStartedWhenHeadlineSnapped) {
              this.scrollHorizontalCoordinate += activeChildWidth
              // first headline
              if (this.rotationIndex === 0) {
                // move first headline slightly to right
                this.scrollHorizontalCoordinate = 7
                this.setScroll(parent, this.scrollHorizontalCoordinate, 500)
                // then restart to 0
                this.scrollHorizontalCoordinate = 0
              } else if (this.rotationIndex === this.currentBoNavigationHeadlines.length - 1) {
                // last headline
                this.scrollHorizontalCoordinate = this.scrollHorizontalCoordinate + 20
                this.setScroll(parent, this.scrollHorizontalCoordinate, 500)
              } else {
                this.scrollHorizontalCoordinate = this.scrollHorizontalCoordinate + 10
                this.setScroll(parent, this.scrollHorizontalCoordinate - 5, 500)
              }
            } else if (this.isRotationStartedWhenHeadlineSnapped) {
              this.isRotationStartedWhenHeadlineSnapped = false
              // first headline
              if (this.rotationIndex === 0) {
                // move first headline slightly to right
                this.scrollHorizontalCoordinate = 7
                this.setScroll(parent, this.scrollHorizontalCoordinate, 500)
                // then restart to 0
                this.scrollHorizontalCoordinate = 0
              } else if (this.rotationIndex === this.currentBoNavigationHeadlines.length - 1) {
                // last headline
                this.scrollHorizontalCoordinate = this.scrollHorizontalCoordinate + 20
                this.setScroll(parent, this.scrollHorizontalCoordinate, 500)
              } else {
                this.scrollHorizontalCoordinate = this.scrollHorizontalCoordinate
                this.setScroll(parent, this.scrollHorizontalCoordinate - 5, 500)
              }
            }
            break
          case 'tablet':
            if (document.querySelector('.headlines-tabs .v-tabs__container')) {
              parent = document.querySelector('.headlines-tabs .v-tabs__container')
            }
            if (parent && parent.querySelector && parent.querySelector('.v-tabs__div.tab')) {
              activeChildWidth = parent.querySelector('.v-tabs__div.tab.active').offsetWidth
            }
            if (scrollBack && scrollBack === 'back') {
              this.scrollHorizontalCoordinate -= activeChildWidth
              if (this.rotationIndex === this.currentBoNavigationHeadlines.length - 1) {
                this.scrollHorizontalCoordinate = (this.currentBoNavigationHeadlines.length - 1) * (activeChildWidth + 20)
                this.setScroll(parent, this.scrollHorizontalCoordinate, 500)
              }
              if (this.rotationIndex !== this.currentBoNavigationHeadlines.length - 1 && this.rotationIndex !== 0) {
                this.scrollHorizontalCoordinate = this.scrollHorizontalCoordinate - 20
                this.setScroll(parent, this.scrollHorizontalCoordinate, 500)
              }
              if (this.rotationIndex === 0) {
                this.scrollHorizontalCoordinate = 10
                this.setScroll(parent, this.scrollHorizontalCoordinate, 500)
              }
            }
            if (!scrollBack) {
              this.scrollHorizontalCoordinate += activeChildWidth
              if (this.rotationIndex === 0) {
                this.scrollHorizontalCoordinate = 10
                this.setScroll(parent, this.scrollHorizontalCoordinate, 500)
              }
              if (this.rotationIndex !== this.currentBoNavigationHeadlines.length - 1 && this.rotationIndex !== 0) {
                this.scrollHorizontalCoordinate = this.scrollHorizontalCoordinate + 20
                this.setScroll(parent, this.scrollHorizontalCoordinate, 500)
              }
            }
            break
          case 'pc':
            if (document.querySelector('.headlines-tabs .v-tabs__container')) {
              parent = document.querySelector('.headlines-tabs .v-tabs__container')
            }
            if (parent.querySelector('.v-tabs__div.tab')) {
              activeChildWidth = parent.querySelector('.v-tabs__div.tab.active').offsetWidth
            }
            if (scrollBack && scrollBack === 'back') {
              this.scrollHorizontalCoordinate -= activeChildWidth
              if (this.rotationIndex === this.currentBoNavigationHeadlines.length - 1) {
                this.scrollHorizontalCoordinate = (this.currentBoNavigationHeadlines.length - 1) * (activeChildWidth + 40)
                this.setScroll(parent, this.scrollHorizontalCoordinate, 500)
              }
              if (this.rotationIndex !== this.currentBoNavigationHeadlines.length - 1 && this.rotationIndex !== 0) {
                this.scrollHorizontalCoordinate = this.scrollHorizontalCoordinate - 40
                this.setScroll(parent, this.scrollHorizontalCoordinate, 500)
              }
              if (this.rotationIndex === 0) {
                this.scrollHorizontalCoordinate = 20
                this.setScroll(parent, this.scrollHorizontalCoordinate, 500)
              }
            }
            if (!scrollBack) {
              this.scrollHorizontalCoordinate += activeChildWidth
              if (this.rotationIndex === 0) {
                this.scrollHorizontalCoordinate = 20
                this.setScroll(parent, this.scrollHorizontalCoordinate, 500)
              }
              if (this.rotationIndex !== this.currentBoNavigationHeadlines.length - 1 && this.rotationIndex !== 0) {
                this.scrollHorizontalCoordinate = this.scrollHorizontalCoordinate + 40
                this.setScroll(parent, this.scrollHorizontalCoordinate, 500)
              }
            }
            break
        }
      },
      setScroll (element, to, duration) {
        var start = element.scrollLeft
        var change = to - start
        var currentTime = 0
        var increment = 20
        var animateScroll = function () {
          currentTime += increment
          var value = this.calculateTime(currentTime, start, change, duration)
          element.scrollLeft = value
          if (currentTime < duration) {
            setTimeout(animateScroll, increment)
          }
        }.bind(this)
        animateScroll()
      },
      calculateTime (currentTime, startTime, chageInTime, duration) {
        currentTime /= duration / 2
        if (currentTime < 1) return chageInTime / 2 * currentTime * currentTime + startTime
        currentTime--
        return -chageInTime / 2 * (currentTime * (currentTime - 2) - 1) + startTime
      },
      isMiddleAndMobileHeadline (headline) {
        let isMiddle = false
        if (this.isLoggedIn && this.mobileBigAndBelow) {
          if (this.currentBoNavigationHeadlines && this.currentBoNavigationHeadlines.length > 2) {
            if (this.currentBoNavigationHeadlines.indexOf(headline) !== 0 && this.currentBoNavigationHeadlines.indexOf(headline) !== this.currentBoNavigationHeadlines.length - 1) {
              isMiddle = true
            }
          }
        }
        return isMiddle
      },
      tabCssClass (headline) {
        if (headline && headline.cssclasses) {
          var cssClass
          if ((headline.cssclasses.toLowerCase() === 'loggedin') || headline.cssclasses.toLowerCase() === 'loggedout') {
            return
          } else if (headline.cssclasses.toLowerCase().indexOf(' loggedin') > -1) {
            cssClass = headline.cssclasses.replace(' loggedin', '')
            // format to lowercase and concatenate '-color' because of vuetify
            return cssClass.toLowerCase() + '-color loggedin'
          } else if (headline.cssclasses.toLowerCase().indexOf('loggedin ') > -1) {
            cssClass = headline.cssclasses.replace('loggedin ', '')
            // format to lowercase and concatenate '-color' because of vuetify
            return cssClass.toLowerCase() + '-color loggedin'
          } else if (headline.cssclasses.toLowerCase().indexOf(' loggedout') > -1) {
            cssClass = headline.cssclasses.replace(' loggedout', '')
            // format to lowercase and concatenate '-color' because of vuetify
            return cssClass.toLowerCase() + '-color loggedout'
          } else if (headline.cssclasses.toLowerCase().indexOf('loggedout ') > -1) {
            cssClass = headline.cssclasses.replace('loggedout ', '')
            // format to lowercase and concatenate '-color' because of vuetify
            return cssClass.toLowerCase() + '-color loggedout'
          } else {
            cssClass = headline.cssclasses.toLowerCase() + '-color'
          }
          return cssClass || ''
        } else return ''
      },
      /*
      -- PPBUS597 and US-516 --
      snapHeadline () {
        this.isHeadlineSnapped = true
        if (this.longtouch) {
          // this.doneScrollingHandler()
        }
      },
      swipeCompleted () {
        this.touchTimeout = setTimeout(() => {
          this.longtouch = true
        }, 500)
      },
      doneScrollingHandler (param) {
        if (this.mobile && this.isHeadlineSnapped) {
          let self = this
          if (this.mobileScrollbarTimer !== null) {
            clearTimeout(this.mobileScrollbarTimer)
          }
          this.mobileScrollbarTimer = setTimeout(self.reposition, 150)
        }
      },
      */
      detectScrollDirection () {
        let direction
        if (this.repositionIndex > this.activeHeadlineIndex) {
          direction = 'right'
        } else if (this.repositionIndex < this.activeHeadlineIndex) {
          direction = 'left'
        } else {
          direction = 'not-moved'
        }
        return direction
      },
      /*
      -- PPBUS597 and US-516 --
      reposition () {
        // --- this piece of code occurs after scrolling is over ---
        this.isHeadlineSnapped = false
        let parent, activeChildWidth, targetCoordinate, deltaDistanceForReposition
        if (document.querySelector('.headlines.not-plain')) {
          parent = document.querySelector('.headlines.not-plain')
        }
        if (document.querySelector('.not-plain.headline.active')) {
          activeChildWidth = parent.querySelector('.not-plain.headline.active').offsetWidth
        }
        let totalWidth = this.currentBoNavigationHeadlines.length * activeChildWidth
        let distanceScrolled = parent.scrollLeft
        this.repositionIndex = this.currentBoNavigationHeadlines.length - Math.round(((totalWidth - distanceScrolled) / (totalWidth / this.currentBoNavigationHeadlines.length)))
        targetCoordinate = this.repositionIndex * activeChildWidth
        deltaDistanceForReposition = this.repositionIndex * 10
        targetCoordinate = targetCoordinate + deltaDistanceForReposition
        let direction = this.detectScrollDirection()
        // first headline
        if (this.repositionIndex === 0) {
          // move first headline slightly to right
          targetCoordinate = 7
          this.setScroll(parent, targetCoordinate, 100)
        }
        if (direction === 'right') {
          this.setScroll(parent, targetCoordinate - 5, 100)
          this.startRotationAfterUserScroll(this.repositionIndex, targetCoordinate)
        } else if (direction === 'left') {
          this.setScroll(parent, targetCoordinate - 5, 100)
          this.startRotationAfterUserScroll(this.repositionIndex, targetCoordinate)
        } else if (direction === 'not-moved') {
          this.setScroll(parent, targetCoordinate - 5, 100)
        }
      },
      */
      startRotationAfterUserScroll (param, targetCoordinate) {
        if (this.wait4It) {
          clearTimeout(this.wait4It)
        }
        var self = this
        this.stopRotation()
        this.rotationIndex = param
        this.scrollHorizontalCoordinate = targetCoordinate
        this.isRotationStartedWhenHeadlineSnapped = true
        this.wait4It = setTimeout(() => {
          // self.selectTab(self.currentBoNavigationHeadlines[self.rotationIndex].idfwheadline)
          self.rotateHeadlineCarousel()
        }, 500)
      },
      sleep () {
        return new Promise(resolve => {
          setTimeout(() => {
            resolve()
          }, 100)
        })
      },
      startRotation () {
        this.firstPass = true
        if (this.mobileBigAndBelow && !this.enableAutoRotateMobile) {
          this.scrollForDevice('mobile')
        } else if (this.tablet) {
          this.scrollForDevice('tablet')
        } else {
          // reset to first headline on desktop
          this.circularRotateProgres = false
          clearTimeout(this.rotate)
          this.rotate = false
          this.selectTab(this.currentBoNavigationHeadlines[0].idfwheadline)
        }
        if (!this.mobile) {
          /* little hack for tablet, we have to get specific element from DOM in order to implement auto scroll
          * since element is not rendered yet when in scrollForDevice(), we are w8ing for element to render then start rotation */
          this.sleep().then(this.rotateHeadlineCarousel)
        } else {
          this.rotateHeadlineCarousel()
        }
      }
    },

    mounted () {
      if (this.currentBoNavigationHeadlines.length > 0 && this.firstPass && !this.isplain) {
        this.firstPass = true
        this.rotateHeadlineCarousel()
      }
    },

    destroyed () {
      this.stopRotation()
    },

    watch: {
      currentBoNavigationHeadlines () {
        if (this.currentBoNavigationHeadlines.length > 0 && this.firstPass && !this.isplain) {
          this.startRotation()
        }
        if (this.currentBoNavigationHeadlines.length === 0 && !this.isplain) {
          this.stopRotation()
          this.firstPass = true
        }
      }
    }
  }
</script>



<!-- 18.20 -->
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped>
  @import "~@/css/config";

  .page-layout
    .container
      .headlines
        display: block
        overflow: hidden
        position: relative
        margin-bottom: 0
        height: 249px
        @media mobile-big-and-below
          height: auto
          overflow: auto
          white-space: nowrap
          display: inline-block
          background: unset
          padding: 0 10px 13px
          z-index: 2
        .background-image
          position:absolute
        .ses
          @media mobile-big-and-below
            margin-top 5px
        .headline
          cursor: default
          display: none
          position: relative
          .circular-rotate-container
            @media mobile-big-and-below
              display: none
          @media mobile-big-and-below
            display: inline-block
            width: calc(100% - 15px)
            height: 130px
            margin-right: 7px
            margin-left 3px
            padding: 0 5px
            border-radius: 4px
            vertical-align: middle
          &.promo
            width: calc(100% - 0px)
            margin-right: 0
          &.middle
            width: calc(100% - 30px)
          &.active
            display: block
            border: none
            padding: 10px 15px 0
            @media mobile-big-and-below
              display: inline-block
              overflow: initial
              padding: 0 5px
            .circular-rotate-container
              display: block
              @media mobile-big-and-below
                position: absolute
                transform: scaleX(-1)
                right: 15px
                top:10px
          .promo-container
            overflow: hidden
            @media tablet-and-above
              animation: slide 0.5s forwards;
              position: relative
              left: 30px
              height: 120px
              overflow: hidden
              @keyframes slide {
                100% { left: 0; }
              }
            @media mobile-big-and-below
              border-radius: 3px
              height: 110px
              padding: 12px
            .promo-image
              display: inline-block
              float: left
              width: 130px
              height: 100px
              background-position: center
              background-repeat: no-repeat
              margin-right: 20px
              &:hover
                cursor: default
              @media mobile-big-and-below
                float: right
                margin: 0
                width: 80px
                height: 80px
                position: relative
                top: 4px
                background-size: contain
            .promo-title
              line-height: 1px
              margin-bottom: 5px
              .promotext
                font-weight: 400
                font-size: 10px
                line-height: 20px
                color: #fff
                text-transform: uppercase
                background-color: #224168
                height: 16px
                width: auto
                padding: 4px
                border-radius: 4px
                display: inline-block
                .promo-icon
                  display: inline-block
                  width: 20px
                  height: 19px
                  margin-top: -5px
                  background-position: center
                .promo-label
                  position: relative
                  top: -6px
                @media mobile-big-and-below
                  background #e8516e
                &.green-color
                  @media mobile-big-and-below
                    background #195E30
                &.yellow-color
                  @media mobile-big-and-below
                    background #91560F
              .datetime
                font-size: 12px
                font-weight: normal
                line-height: normal
                color: #fff
                position: relative
                top: -5px
                display: inline-block
                height: 20px
            .promo-content
              width: calc(100% - 50px)
            .link-to
              cursor pointer
            @media mobile-big-and-below
              width: 100%
            .description
              max-width: 1160px
              .title
                font-weight: bold
                line-height: 35px
                color: white
                text-align: left
                text-shadow: 0px 1px 0px rgba(0, 0, 0, 0.4)
                @media mobile-big-and-below
                  white-space: normal
                  overflow: hidden
                  margin-bottom: 5px
                  display: block
                  max-height: 50px
                  max-width: 227px
                  text-overflow: ellipsis
                  text-transform: none
              .bodytext
                font-size: 14px
                line-height: 16px
                text-align: left
                color:white
                max-height: 35px
                overflow: hidden
                @media mobile-big-and-below
                  white-space: nowrap
                  display: block
                  max-height: 50px
                  overflow: hidden
                  max-width: 227px
                  text-overflow: ellipsis
          .arrows-container
            position: absolute
            bottom: -80px
            right: 0
            display: block
            height: auto
            margin-right: 15px
            @media mobile-big-and-below
              display: none
            .circular-rotate-container
              position: absolute
              bottom: -10px
              right: -2px
              transform: scaleX(-1)
            .carousel__left,
            .carousel__right
              background-color: #224168
              border-radius: 20px
              position: initial
              display: inline-block
              transform: unset
              width: 36px
              height: 36px
              cursor: pointer
              *
                cursor: pointer
              &:hover
                background-color: #224168
              .btn
                // left -2px
                top -2px
                z-index 5
                i
                  font-size: 20px
                  padding 9px
        .v-tabs
          background: unset
          width: calc(100% - 100px)
          margin-bottom: 15px
          padding-top 15px
          @media mobile-big-and-below
            width: 100%
          @media tablet
            width: 550px
          .v-tabs__bar
            background none
            .v-tabs__wrapper
              .v-tabs__div.tab
                padding-left:10px
                text-align: left
                &.active
                  //default is red
                  .tab-header
                    color #E8516E
                &.red-color.active
                  .tab-header
                    color #E8516E
                &.green-color.active
                  .tab-header
                    color #41d569
                &.yellow-color.active
                  .tab-header
                    color #f6a724
                .tab-header
                  font-size: 14px
                  font-weight: bold
                  font-style: italic
                .tab-footer
                  font-size: 14px
                  font-weight: bold
                .datetime
                  font-weight: 100
                  font-size 12px
                  font-weight: normal

    .headlines
      &.background-headline
        position: absolute
        top: 0
        right: 0
        height: 400px
        width: 100%
        @media mobile-big-and-below
          height: auto
          background: #06283b
        .background-image
          text-align: right
          line-height: 0
          width: 100%
          background-position: top right
          background-size cover
          @media mobile-big-and-below
            margin-top 55px
            height: 245px

  // IE 11 specific fixes
  .browser-internet-explorer
    .page-layout
      .container
        .headlines
          .headline
            max-width 837px
            .arrows-container
              bottom -58px
              right 10px
              width 95px
              height 0
              @media tablet
                right -10px
              .circular-rotate-container
                bottom -27.5px
                right 4px
                z-index 12px
              .carousel__left,
              .carousel__right
                position absolute
  .background-image
    height: 405px

  @media mobile-big-and-below
    .url-state-name-sports-live.url-live
      .background-image
        display: none
    /*.headline-wrapper*/
  // margin-bottom: 5px

  .browser-firefox
    .promotext
      line-height: 18px !important

  .os-ios
    .page-layout
      .container
        // .probni-div
        //   position absolute
        //   z-index 100
        //   display block
        //   width 50px
        //   height 50px
        //   color red
        //   font-size 20px
        // .probni-div-dva
        //   position absolute
        //   top 50px
        //   z-index 100
        //   display block
        //   width 50px
        //   height 50px
        //   color blue
        //   font-size 20px
        .headlines
          // border 5px solid red
          overflow-y scroll
          -webkit-overflow-scrolling touch
        
</style>
