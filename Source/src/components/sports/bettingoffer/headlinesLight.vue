<template>
  <div class="headlines-container">
    <v-container v-if="category === 'BettingHeadlines' && (currentBoNavigationHeadlines && currentBoNavigationHeadlines.length > 0)" fluid :class="['headlines']">
      <div v-if="tiles" class="headline-tiles to-left" ref="headline-tiles">
        <div class="controls">
          <span class="button left" @click.stop="headlineTilesScroll('left')"><v-icon>arrow_back_ios</v-icon></span>
          <span class="button right" @click.stop="headlineTilesScroll('right')"><v-icon>arrow_forward_ios</v-icon></span>
        </div>
        <div class="scroll-container" ref="headline-tiles-scroll-container">
          <div class="item" @click="()=>{goToHeadlineLink(headline);sendGTMEventBanner({headline, index});}" v-for="(headline, index) in currentBoNavigationHeadlines" :key="index" ref="headline-tiles-item"
            :style="[headline.imageurl ? {backgroundImage: 'url(' + mediaServer(headline.imageurl) + ') !important'} : '']">
            <div v-if="isHeadlineCoupon(headline.location)" class="headline-coupon" :class="{'no-background': !headline.imageurl}">
              <market-group
                :idfwmarketgroup="headline.location"
                :isheadlinecoupon="true"
                :headline="{headline, index}"
              >
              </market-group>
            </div>
          </div>
          <div style="flex:0 0 1px;height:165px;background:transparent;"></div>
        </div>
      </div>
      <div v-else>
        <div class="headline-big" v-if="!mobileBigAndBelow">
          <v-carousel :interval="rotationInterval" :style="{'height': this.carouselHeight}" :cycle="cycleRotation" :hide-delimiters="brandLayout === 'generic' || brandKey === 'sb' || brandKey === 'qcasino' || brandKey === 'pr' || brandKey === 'rw'">
            <v-carousel-item @notify="setIndex" @click.native="()=>{goToHeadlineLink(headline);sendGTMEventBanner({headline, index});}" v-for="(headline, index) in currentBoNavigationHeadlines" :key="index"
              style="height: auto; min-height:280px;" :class="[{'active': headline.idfwheadline === selectedTab.idfwheadline}, {'hover-headline': typeof headline.location !== 'undefined' && headline.location !== null}]"
              :src="headline.imageurl ? mediaServer(headline.imageurl) : ''">
              <div v-if="isHeadlineCoupon(headline.location)" class="headline-coupon" :class="{'no-background': !headline.imageurl}">
                <market-group
                  :idfwmarketgroup="headline.location"
                  :isheadlinecoupon="true"
                  :headline="{headline, index}"
                >
                </market-group>
              </div>
            </v-carousel-item>
          </v-carousel>
        </div>
        <div class="headline-mobile" v-if="mobileBigAndBelow">
          <v-carousel style="min-height: 200px;" :style="{'height': this.carouselHeight}" :class="{'mobile' : mobile}" :hide-delimiters="brandLayout === 'generic' || brandKey === 'sb' || brandKey ==='qcasino' || brandKey === 'pr' || brandKey === 'rw'" :hide-controls="brandKey !== 'sb'">
            <v-carousel-item @click.native="()=>{goToHeadlineLink(headline);sendGTMEventBanner({headline, index});}" v-for="(headline, index) in currentBoNavigationHeadlines" :key="index"
                :src="headline.imageurl ? mediaServer(headline.imageurl) : ''">
                <div v-if="isHeadlineCoupon(headline.location)" class="headline-coupon" :class="{'no-background': !headline.imageurl}">
                  <market-group
                    :idfwmarketgroup="headline.location"
                    :isheadlinecoupon="true"
                    :headline="{headline, index}"
                  >
                  </market-group>
                </div>
            </v-carousel-item>
          </v-carousel>
        </div>
      </div>
    </v-container>
    <div v-if="!isRootSportsNavigation && (brandLayout === 'generic' || brandKey==='sb' || brandKey==='mav' || brandKey==='qcasino' || brandKey === 'pr' || brandKey === 'rw') && category === 'BettingHeadlines' && (!currentBoNavigationHeadlines || currentBoNavigationHeadlines.length === 0)">
        <sports-breadcrumb></sports-breadcrumb>
    </div>
    <v-container v-if="category === 'SidebarBanners' && (currentBoNavigationHeadlines && currentBoNavigationHeadlines.length > 0)" fluid :class="[brandKey !== 'qcasino' && brandKey !== 'pr' ? 'headlines' : 'sidebanner']">
      <div class="headline-big" :class="[ isReadOnly? 'sidebarbannersRobo' : 'sideBanersGeneric']">
        <v-carousel :interval="rotationInterval" :style="{'height': this.carouselHeight}" hide-delimiters :cycle="cycleRotation" hide-controls>
          <v-carousel-item @notify="setIndex" @click.native="()=>{goToHeadlineLink(headline);sendGTMEventBanner({headline, index});}" v-for="(headline, index) in currentBoNavigationHeadlines" :key="index"
            style="height: auto;" :class="[{'active': headline.idfwheadline === selectedTab.idfwheadline}, {'hover-headline': typeof headline.location !== 'undefined' && headline.location !== null}]"
            :src="headline.imageurl ? mediaServer(headline.imageurl) : ''">
          </v-carousel-item>
        </v-carousel>
      </div>
    </v-container>
    <v-container v-if="category === 'WelcomeBanner' && (currentBoNavigationHeadlines && currentBoNavigationHeadlines.length > 0)" fluid :class="['headlines']">
      <p @click="goToHeadlineLink(currentBoNavigationHeadlines[0])"
      :class="{'hover-headline': typeof currentBoNavigationHeadlines[0].location !== 'undefined' && currentBoNavigationHeadlines[0].location !== null}">
        <img :src="mediaServer(currentBoNavigationHeadlines[0].imageurl)">
      </p>
      <p v-html="currentBoNavigationHeadlines[0].header"></p>
    </v-container>
    <v-container v-if="loginHeadlineDialog">
      <v-dialog v-model="loginHeadlineDialog" content-class="headlines login-headlines">
        <div class="carousel-wrapper">
          <v-carousel :interval="rotationInterval" hide-delimiters :cycle="cycleRotation" :class="{'single-headline': currentBoNavigationHeadlines.length === 1}">
            <v-carousel-item @notify="setIndex" @click.native="()=>{goToHeadlineLink(headline);sendGTMEventBanner({headline, index});closeLoginHeadlines();}" v-for="(headline, index) in loginHeadlines" :key="index"
              :class="[{'active': headline.idfwheadline === selectedTab.idfwheadline}, {'hover-headline': typeof headline.location !== 'undefined' && headline.location !== null}]">
              <img :src="mediaServer(headline.imageurl)" :alt="headline.body">
              <v-btn flat @click.stop="closeLoginHeadlines()" class="close"><v-icon>close</v-icon></v-btn>
            </v-carousel-item>
          </v-carousel>
        </div>
      </v-dialog>
    </v-container>
    <v-container v-if="category === 'PostLoginAlert' && (postLoginAlerts && postLoginAlerts.length > 0)" fluid class="postLoginAlert-headlines">
      <div class="postLoginAlert-headlines--child">
        <div></div>
        <div v-if="isHeadlineLinkExists(currentPostLoginAlert)" @click="goToHeadlineLink(currentPostLoginAlert), closeCurrentPostLoginAlert(currentPostLoginAlert.idfwheadline)" class="link">{{ currentPostLoginAlert.bodytext }}</div>
        <div v-else>{{ currentPostLoginAlert.bodytext }}</div>
        <span class="close" @click="closeCurrentPostLoginAlert(currentPostLoginAlert.idfwheadline)">
          <v-icon>close</v-icon>
        </span>
      </div>
    </v-container>
  </div>
</template>
<script>
  import store from '@/store'
  import config from '@/config'
  import Screen from '@/components/mixins/Screen'
  import Session from '@/components/mixins/Session'
  import BettingOffer from '@/components/mixins/BettingOffer'
  import Gtm from '@/components/mixins/Gtm'
  import SportsBreadcrumb from '@/components/sports/bettingoffer/SportsBreadcrumb'
  import marketGroup from '@/components/sports/bettingoffer/marketGroup'
  import mobileBridge from '@/library/mobileBridge'
  import Url from '@/components/mixins/Url'
  import Branding from '@/components/mixins/Branding'

  export default {
    name: 'headlines',

    props: [
      'category',
      'isplain',
      'tiles',
      'isempty'
    ],
    mixins: [
      Screen,
      Session,
      BettingOffer,
      Url,
      Branding,
      Gtm
    ],

    components: {
      SportsBreadcrumb,
      marketGroup
    },

    data () {
      return {
        loginHeadlineDialog: false,
        selectedTabIdFwHeadline: -1,
        rotationIndex: 0,
        rotationInterval: 6000,
        circularRotateProgres: false,
        currentidfwheadline: 0,
        carouselHeight: 0,
        isRotationStartedWhenHeadlineSnapped: false,
        cycleRotation: false,
        initHeadlineMobile: null,
        headlineDelay: 0,
        loginHeadlines: [],
        postLoginAlerts: []
      }
    },

    computed: {
      headlineTilesWidth () {
        if (this.screenWidth && this.currentBoNavigationHeadlines) {
          return this.$refs['headline-tiles'].clientWidth
        }

        return 0
      },
      headlineTilesScrollWidth () {
        let scrollContainer = this.$refs['headline-tiles-scroll-container']
        let scrolledLength = scrollContainer && scrollContainer.style.left ? parseInt(scrollContainer.style.left) : 0

        return this.$refs['headline-tiles'].scrollWidth - scrolledLength - this.headlineTilesWidth
      },
      currentidfwbonavigation () {
        var currentidfwbonavigation = this.idfwbonavigation2 || this.idfwbonavigation1 || null

        if (currentidfwbonavigation && !isNaN(currentidfwbonavigation)) {
          return parseFloat(currentidfwbonavigation)
        } else {
          return currentidfwbonavigation
        }
      },
      state () {
        return window.ctsautoconf.STATE
      },
      headlinesByState () {
        return this.category + '_' + this.state
      },
      headlines () {
        return store.getters['bonavigationState/boNavigationHeadlines']
      },

      // currentBoNavigationHeadlines () {
      //   if (this.category === 'BettingHeadlines' || this.category === 'SidebarBanners') {
      //     var sort = this.headlines && this.headlines.filter(hl => hl.categoryname === this.category && hl.idfwbonavigation === this.currentidfwbonavigation)
      //     return sort
      //   }
      // },
      strIdfwbonavigation1 () {
        var currentidfwbonavigation = this.idfwbonavigation1
        if (currentidfwbonavigation && !isNaN(currentidfwbonavigation)) {
          return parseFloat(currentidfwbonavigation)
        } else {
          return currentidfwbonavigation
        }
      },
      strIdfwbonavigation2 () {
        var currentidfwbonavigation = this.idfwbonavigation2
        if (currentidfwbonavigation && !isNaN(currentidfwbonavigation)) {
          return parseFloat(currentidfwbonavigation)
        } else {
          return currentidfwbonavigation
        }
      },
      currentBoNavigationHeadlines () {
        if (this.category) {
          var headlineImages = []
          var headlineImagesperState = []

          if (this.category === 'LoginHeadlines') {
            return this.loginHeadlines
          }

          if (this.category === 'PostLoginAlert') {
            return this.postLoginAlerts
          }

          if (window.ctsautoconf.DISABLE_PROPAGATE_HEADLINES_FROM_PARENT_BONODES && this.category !== 'SidebarBanners') {
            if (this.strIdfwbonavigation2) {
              headlineImages = this.headlines && this.headlines.filter(hl => hl.categoryname === this.category && hl.idfwbonavigation === this.strIdfwbonavigation2)
              headlineImagesperState = this.headlines && this.headlines.filter(hl => hl.categoryname === this.headlinesByState && hl.idfwbonavigation === this.strIdfwbonavigation2)
            } else if (this.strIdfwbonavigation1) {
              headlineImages = this.headlines && this.headlines.filter(hl => hl.categoryname === this.category && hl.idfwbonavigation === this.strIdfwbonavigation1)
              headlineImagesperState = this.headlines && this.headlines.filter(hl => hl.categoryname === this.headlinesByState && hl.idfwbonavigation === this.strIdfwbonavigation1)
            } else {
              headlineImages = this.headlines && this.headlines.filter(hl => hl.categoryname === this.category && !hl.idfwbonavigation)
              headlineImagesperState = this.headlines && this.headlines.filter(hl => hl.categoryname === this.headlinesByState && !hl.idfwbonavigation)
            }
          } else {
            headlineImages = this.headlines && this.headlines.filter(hl => hl.categoryname === this.category && hl.idfwbonavigation === this.strIdfwbonavigation2)
            headlineImagesperState = this.headlines && this.headlines.filter(hl => hl.categoryname === this.headlinesByState && hl.idfwbonavigation === this.strIdfwbonavigation2)
            if (headlineImages.length === 0) {
              headlineImages = this.headlines && this.headlines.filter(hl => hl.categoryname === this.category && hl.idfwbonavigation === this.strIdfwbonavigation1)
              if (headlineImages.length === 0) {
                headlineImages = this.headlines && this.headlines.filter(hl => hl.categoryname === this.category && !hl.idfwbonavigation)
              }
            }
            if (headlineImagesperState.length === 0) {
              headlineImagesperState = this.headlines && this.headlines.filter(hl => hl.categoryname === this.headlinesByState && hl.idfwbonavigation === this.strIdfwbonavigation1)
              if (headlineImagesperState.length === 0) {
                headlineImagesperState = this.headlines && this.headlines.filter(hl => hl.categoryname === this.headlinesByState && !hl.idfwbonavigation)
              }
            }
          }
          if (headlineImagesperState.length > 0) {
            return headlineImagesperState.filter((hl) => this.isHeadlineValid(hl))
          } else {
            return headlineImages.filter((hl) => this.isHeadlineValid(hl))
          }
        }
      },
      selectedTab () {
        return this.currentBoNavigationHeadlines.filter(item => item.idfwheadline === this.selectedTabIdFwHeadline)[0] ||
          (this.currentBoNavigationHeadlines && this.currentBoNavigationHeadlines.length > 0 && this.currentBoNavigationHeadlines[0]) || undefined
      },
      headerSettings () {
        return store.getters['screenState/getHeaderMessageHeight']
      },
      isOpenedFromWebView () {
        return store.getters['getIsOpenedFromWebView']
      },
      router () {
        return this.$route.name
      },
      marketGroups () {
        return store.getters['marketgroupState/marketgroups']
      },
      currentPostLoginAlert () {
        return this.postLoginAlerts[0]
      },
      isHeadlineLinkExists () {
        return (currentHeadline) => typeof currentHeadline.location !== 'undefined' && currentHeadline.location !== null
      },
      isReadOnly () {
        return config.app.autoconf.ROBO
      },
      isRootSportsNavigation () {
        return this.$route.name === 'sports'
      }
    },

    methods: {
      headlineTilesScroll (direction) {
        let scrollContainer = this.$refs['headline-tiles-scroll-container']
        let headlineTiles = this.$refs['headline-tiles']
        let item = this.$refs['headline-tiles-item']
        let itemWidth = item[0] ? item[0].clientWidth : 0
        let scrollContainerStyle = scrollContainer.style
        let scrollContainerPosition = scrollContainer.style.left ? parseInt(scrollContainer.style.left) : 0

        switch (direction) {
          case 'left':
            if (scrollContainerPosition + itemWidth <= 0) {
              scrollContainerStyle.left = (scrollContainerPosition + itemWidth) + 'px'
              headlineTiles.classList.remove('to-right')
            } else {
              scrollContainerStyle.left = '0'
            }
            break
          case 'right':
            if (scrollContainerPosition - itemWidth >= -this.headlineTilesScrollWidth) {
              scrollContainerStyle.left = (scrollContainerPosition - itemWidth) + 'px'
              headlineTiles.classList.remove('to-left')
            } else {
              scrollContainerStyle.left = -this.headlineTilesScrollWidth + 'px'
            }
            break

          default:
            break
        }
        if (scrollContainerStyle.left === '0' || scrollContainerStyle.left === '0px') {
          headlineTiles.classList.add('to-left')
        }
        if (scrollContainerStyle.left === -this.headlineTilesScrollWidth + 'px') {
          headlineTiles.classList.add('to-right')
        }
      },
      getloginHeadlines () {
        let onFirstLoginHeadlines = this.isFirstEverLogin && !localStorage.firstEverLoginHeadlineShow ? this.headlines.filter((headline) => headline.categoryname === 'LoginHeadlinesOnFirstLogin') : []
        let onFirstLoginBrowserSessionHeadlines = !sessionStorage.loginHeadlineShow ? this.headlines.filter((headline) => headline.categoryname === 'LoginHeadlinesOnBrowserSession') : []
        let onEveryLoginHeadlines = !localStorage.everyLoginHeadlineShow ? this.headlines.filter((headline) => headline.categoryname === 'LoginHeadlinesOnEveryLogin') : []
        let headlines = [].concat(onFirstLoginHeadlines, onFirstLoginBrowserSessionHeadlines, onEveryLoginHeadlines)

        if (onFirstLoginHeadlines.length) {
          localStorage.firstEverLoginHeadlineShow = true
        }
        if (onFirstLoginBrowserSessionHeadlines.length) {
          sessionStorage.loginHeadlineShow = true
        }
        if (onEveryLoginHeadlines.length) {
          localStorage.everyLoginHeadlineShow = true
        }

        return headlines
      },
      getPostLoginAlerts () {
        const headlines = this.headlines.filter((headline) => headline.categoryname === 'PostLoginAlert')

        return headlines
      },
      closeLoginHeadlines (id) {
        this.loginHeadlineDialog = false
      },
      getMarketGroup (id) {
        return id && this.marketGroups && this.marketGroups[id]
      },
      isHeadlineCoupon (id) {
        let marketGroup = this.getMarketGroup(id)
        return id && marketGroup && marketGroup.idfwpopulationtype !== 'SPECIALOFFERS'
      },
      isHeadlineValid (hl) {
        return !(hl.idfwheadlinetype === 'MKPB') || !(hl.linktype === 'MARKETGROUP') || (hl.location && this.marketGroups[hl.location] && this.marketGroups[hl.location].events.length && this.marketGroups[hl.location].events[0].istradable)
      },
      fetchMarketgroups () {
        if (this.headlines && this.headlines.length) {
          this.headlines
            .filter((headline) => headline.linktype === 'MARKETGROUP')
            .forEach((headline) => {
              if (headline.location) {
                store.dispatch('marketgroupState/fetchMarketgroupById', headline.location)
              }
            })
        }
      },
      selectTab (idfwheadline) {
        for (let i = 0; i < this.currentBoNavigationHeadlines.length; i++) {
          if (this.currentBoNavigationHeadlines[i].idfwheadline === idfwheadline) {
            this.rotationIndex = i
          }
        }
        this.selectedTabIdFwHeadline = idfwheadline
        this.currentidfwheadline = idfwheadline
      },
      selectTabOnClick (idfwheadline, tabId) {
        // prevent click on active tab and stop Rotation
        if (idfwheadline !== this.currentidfwheadline) {
          this.stopRotation()
          this.selectTab(idfwheadline)
          this.selectBanner(tabId)
        }
      },
      goToHeadlineLink (headline) {
        switch (headline.idfwheadlinetype) {
          case 'MKPB':
            switch (headline.linktype) {
              case 'URL':
                if (headline.location) {
                  if (headline.location.indexOf('http://') > -1 || headline.location.indexOf('https://') > -1) {
                    window.location = headline.location
                  } else {
                    var path = headline.location
                    if (path.indexOf('/') !== 0) {
                      path = '/' + path
                    }
                    this.$router.push({path: path})
                  }
                }
                break
              case 'EXTERNAL':
                if (headline.location) {
                  if (headline.location.indexOf('http://') > -1 || headline.location.indexOf('https://') > -1) {
                    if (this.mobileBigAndBelow && this.isOpenedFromWebView) {
                      mobileBridge.bridgeSendRequest('openLink', headline.location)
                      return false
                    }
                    window.open(headline.location, '_blank')
                  } else {
                    if (headline.location.indexOf('/') !== 0) {
                      headline.location = '/' + headline.location
                    }
                    if (this.mobileBigAndBelow && this.isOpenedFromWebView) {
                      mobileBridge.bridgeSendRequest('openLink', headline.location)
                      return false
                    }
                    window.open(headline.location, '_blank')
                  }
                }
                break
              case 'BONAVIGATION':
                if (headline.location) {
                  var boNodes = headline.location.split(',') || []
                  var boNavName = 'bonavigation' + boNodes.length
                  var params = {}
                  boNodes.forEach((bonode, index) => {
                    params['idfwbonavigation' + (index + 1)] = bonode
                  })
                  this.$router.push({name: boNavName, params: params})
                }
                break
              case 'MARKETGROUP':
                if (headline.location) {
                  store.dispatch('marketgroupState/fetchMarketgroupById', headline.location).then(() => {
                    let selectionData = []
                    let n = 0
                    var marketgroups = store.getters['marketgroupState/marketgroups']
                    if (marketgroups) {
                      let marketgroup = marketgroups[headline.location]
                      if (marketgroup && marketgroup.idfwpopulationtype === 'SPECIALOFFERS') {
                        store.dispatch('overlayState/activateAddingSelectionDialog')
                        if (marketgroup.events && marketgroup.events.length > 0) {
                          marketgroup.events.forEach((ev) => {
                            if (ev.markets && ev.markets.length > 0) {
                              ev.markets.forEach(mk => {
                                if (mk.selections && mk.selections.length > 0) {
                                  mk.selections.forEach(sel => {
                                    if (mk.defaultselection === sel.idfoselection) {
                                      selectionData.push([sel, mk])
                                    }
                                  })
                                }
                              })
                            }
                          })
                          // console.log('selections n to inject:', selectionData.length)
                          //
                          if (selectionData.length) {
                            store.dispatch('sbBetslipState/clearBetSlip')
                            store.dispatch('sbBetslipState/resetBetSlipChanges')
                            store.commit('sbBetslipState/setTab', 'REGULAR')
                            store.commit('sbBetslipState/setAddingMiltipleSelections', true)
                            // store.dispatch('overlayState/activateAddingSelectionDialog')
                            setTimeout(function () {
                              selectionData.forEach(pair => {
                                store.dispatch('sbBetslipState/toggleBetslipSelection', pair)
                                  .finally(() => {
                                    n++
                                    // console.log('Selection added:', n)
                                    if (n === selectionData.length) {
                                      // console.log('Last selection added')
                                      store.commit('sbBetslipState/setAddingMiltipleSelections', false)
                                      store.dispatch('overlayState/deactivateAddingSelectionDialog')
                                    }
                                  })
                              })
                            }, 1000)
                          }
                        }
                      }
                    }
                  })
                  .catch(() => {
                    console.log('UPS!!! on fetch - Show error message')
                    store.dispatch('overlayState/deactivateAddingSelectionDialog')
                  })
                }
                break
              case 'OVERLAY':
                console.log(headline.backroundimageurl)
                store.commit('overlayState/setHeadlineOverlayDialogContent', {img: this.mediaServer(headline.backroundimageurl)})
                store.dispatch('overlayState/activateHeadlineOverlayDialog')
                break
            }
            break
        }
      },
      stopRotation () {
        clearTimeout(this.rotate)
        this.rotate = false
        this.rotationIndex = 0
        this.cycleRotation = false
      },
      rotateHeadlineCarousel (scrollBack) {
        if (!this.mobileBigAndBelow) {
          this.cycleRotation = true
          if (this.currentBoNavigationHeadlines.length > 1 && !this.isplain) {
            this.circularRotateProgres = true
            if (this.rotationIndex > this.currentBoNavigationHeadlines.length - 1 || this.rotationIndex < 0) {
              this.rotationIndex = 0
            }
            this.selectTab(this.currentBoNavigationHeadlines[this.rotationIndex].idfwheadline)
            this.rotationIndex++
            this.rotate = setTimeout(this.rotateHeadlineCarousel, this.rotationInterval)
          }
        }
      },
      startRotation () {
        if (!this.tiles) {
          this.rotateHeadlineCarousel()
        }
      },
      getCarouselHeight () {
        setTimeout(() => {
          var item = document.getElementsByClassName('v-image__image--cover')
          if (item && item.length > 0) {
            this.carouselHeight = item[0].clientHeight + 'px'
          }
          if (!this.mobileBigAndBelow) {
            this.setIndex()
          }
        }, this.headlineDelay)
      },
      setIndex () {
        var elem = document.querySelector('.v-carousel__controls')
        if (elem) {
          var btns = elem.querySelectorAll('button')
          btns.forEach(function (elem, index) {
            elem.id = 'btn-' + index
          })
        }
      },
      selectBanner (tabId) {
        let btn = document.querySelector('#btn-' + tabId)
        if (btn) {
          btn.click()
        }
      },
      delayHeadline () {
        if (this.mobileBigAndBelow && !this.isOpenedFromWebView) {
          if (this.headerSettings > 0) {
            this.initHeadlineMobile = true
          } else {
            this.initHeadlineMobile = true
          }
        }
      },
      initSlider () {
        if (this.currentBoNavigationHeadlines.length >= 1 && !this.isplain) {
          this.rotationIndex = 0
          setTimeout(() => {
            if (this.mobileBigAndBelow) {
              this.headlineDelay = 500
            }
            this.delayHeadline()
            this.startRotation()
            this.getCarouselHeight()
          }, 200)
        }
        if (this.currentBoNavigationHeadlines.length === 0 && !this.isplain) {
          this.stopRotation()
        }
      },
      addAbsolutePath (item) {
        if (item) {
          if (item.indexOf('http://') > -1 || item.indexOf('https://') > -1) {
            return item
          }
          return this.staticAbsolutePath + item
        }
      },
      closeCurrentPostLoginAlert (idCurrentAlert) {
        this.postLoginAlerts = this.postLoginAlerts.filter(headline => headline.idfwheadline !== idCurrentAlert)
      }
    },

    created () {
      this.fetchMarketgroups()
    },

    mounted () {
      this.initSlider()
    },

    destroyed () {
      this.stopRotation()
    },

    watch: {
      isLoggedIn (newValue, oldValue) {
        if (this.isLoggedIn && this.category === 'LoginHeadlines') {
          this.loginHeadlines = this.getloginHeadlines()
          if (this.loginHeadlines.length) {
            this.loginHeadlineDialog = true
          }
        }

        if (this.isLoggedIn && this.category === 'PostLoginAlert') {
          this.postLoginAlerts = this.getPostLoginAlerts()
        } else if (!this.isLoggedIn && this.category === 'PostLoginAlert') {
          this.postLoginAlerts = []
        }

        if (!newValue) {
          localStorage.removeItem('firstEverLoginHeadlineShow')
          localStorage.removeItem('everyLoginHeadlineShow')
        }
      },
      currentBoNavigationHeadlines () {
        this.cycleRotation = false
        this.initSlider()
      },
      headlines (newValue, oldValue) {
        this.fetchMarketgroups()
        // Scroll headline tiles to start if number of headlines change
        if (this.tiles) {
          let scrollContainer = this.$refs['headline-tiles-scroll-container']
          let headlineTiles = this.$refs['headline-tiles']
          if (scrollContainer && newValue.length !== oldValue.length) {
            scrollContainer.style.left = 0
            headlineTiles.classList.add('to-left')
            headlineTiles.classList.remove('to-right')
          }
        }
      },
      postLoginAlerts (newValue, oldValue) {
        if (newValue.length < 1) {
          store.commit('setPostLoginAlertExist', false)
        } else {
          store.commit('setPostLoginAlertExist', true)
        }
      },
      loginHeadlineDialog (newValue, oldValue) {
        if (newValue) {
          store.commit('overlayState/setLoginHeadlineDialogState', true)
        } else {
          store.commit('overlayState/setLoginHeadlineDialogState', false)
        }
      }
    }
  }
</script>



<!-- 18.20 -->
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped>
  @import "~@/css/config";

.headlines-container
  // margin-top -8px
  @media mobile-big-and-below
    margin-top unset

@media tablet-and-above
  .page-layout
    .container
      .headlines
        padding-right: 22px
        margin-bottom: 0
        @media mobile-big-and-below
          padding-right: 0
          background: #003865
.v-carousel.mobile
  min-height 220px
  height 220px
.v-carousel:not(.mobile)
  height 280px!important
  border-radius 0px

.hover-headline:hover
  cursor pointer

.headline-mobile
  background-color #0b4da1
>>>.v-responsive.v-image.v-carousel__item
  max-height: 280px !important

.headline-mobile
  >>>.v-responsive.v-image.v-carousel__item
      max-height: 280px !important
    .v-window.v-carousel.mobile
      max-height 280px !important
  @media mobile
    >>>.v-responsive.v-image.v-carousel__item
      max-height: 200px !important
    .v-window.v-carousel.mobile
      max-height 200px !important
.headline-big
  >>>.v-carousel__controls
    display none
  @media tablet-and-above
    margin-bottom 5px
    >>>.v-carousel
      .v-image.v-carousel__item
        height 280px !important

  .v-window__container
    height 280px !important
  .v-window-item
    display unset
    top 0
    width 100%
    height 100%
    left 0
    position absolute
    top 0
  >>>.v-carousel__controls
    height auto
    background rgba(0,0,0,.2) !important
    @media mobile-big-and-below
      .v-btn
        width 8px
        &:before
          display: block
          color: #fff
          opacity: .8
          height: 15px
          width: 15px
          top: auto
          left: auto
.igt
  .headline-mobile
    >>>.v-carousel__controls>.v-item-group
      .v-carousel__controls__item .v-icon
        opacity 1
        color #fff
      .v-btn.v-btn--active .v-icon
        color #0C4DA4
    >>>.v-carousel__controls
      height: 30px
      .v-btn:before
        display none

.sidebarbannersRobo
  .v-carousel
    height 700px !important
    border-radius 0px
    box-shadow: none
  >>>.v-responsive.v-image.v-carousel__item
    max-height: unset !important
  >>>.v-carousel
    .v-image.v-carousel__item
      height auto !important
    .v-window__container
      height auto !important
.sideBanersGeneric
  .v-carousel
    border-radius 0px
    box-shadow: none
  >>>.v-responsive.v-image.v-carousel__item
    max-height: unset !important
  >>>.v-carousel
    .v-image.v-carousel__item
      height auto !important
    .v-window__container
      height auto !important

.postLoginAlert-headlines
  display flex
  align-items center
  justify-content center
  background var(--badge-bgr)
  background: repeating-linear-gradient(
      to bottom,
      #8a8a8a,
      #8a8a8a 2px,
      #5e5e5e 3px
    );
  padding 5px 15px
  @media mobile-big-and-below
    min-height: 40px
    position static
    padding 5px
  .postLoginAlert-headlines--child
    width 100%
    display flex
    justify-content space-between
    align-items center
    color #fff
    .link
      position relative
      cursor pointer
    .link::after
      content: ""
      position: absolute
      right: 0
      left: 0
      bottom: 2px
      height 1px
      background #fff
    .close
      cursor pointer
      i
        color #fff
    div
      font-size 13px
      font-family 'Open sans SemiBold'
      margin-left 13px
</style>
