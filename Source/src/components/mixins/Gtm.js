import store from '@/store'
import lib from '@/library'
import config from '@/config'

import Session from '@/components/mixins/Session'
import Account from '@/components/mixins/Account'
import Screen from '@/components/mixins/Screen'
import analyticsBridge from '@/library/analyticsBridge'

export default {
  mixins: [
    Session,
    Account,
    Screen
  ],
  computed: {
    googleTagmngrId () {
      return config.app.autoconf.GOOGLE_TAGMNGR_ID
    },
    thirdpartyAnalytics () {
      return store.getters['getThirdpartyAnalytics']
    },
    xtremePushEnabledMobile () {
      return config.app.autoconf.XTREMEPUSH_ANALYTICS && config.app.autoconf.XTREMEPUSH_ANALYTICS.MOBILE_APP // for mobile apps only
    },
    isDebug () { return this.$route.query.debug || store.getters['getDebugLevel'] }
  },

  methods: {
    sendGTMpageview (isopenedfromwebview, pSelectedTab) {
      if (window.dataLayer || this.thirdpartyAnalytics || this.xtremePushEnabledMobile) {
        var boNavigation = store.getters['bonavigationState/boNavigation']
        var osName = lib.core.userAgent.os.name
        var idfwbonavigation1 = this.$route.params.idfwbonavigation1
        var idfwbonavigation2 = this.$route.params.idfwbonavigation2
        // var sessionDetailsCookie = config.customCookies.getCookie('sessionDetails')

        var siteVersion = ''
        var platform = ''
        var selectedSport = ''
        var selectedTab = ''

        if (isopenedfromwebview) {
          siteVersion = 'wrapper'
          platform = osName
        } else {
          siteVersion = this.mobileBigAndBelow ? 'mobile' : 'desktop'
          platform = this.mobileBigAndBelow ? 'mobile' : 'desktop'
        }

        if (idfwbonavigation1) {
          let boNode = boNavigation && boNavigation[idfwbonavigation1]

          if (boNode) {
            selectedSport = boNode.name
          }
        }

        if (!pSelectedTab && idfwbonavigation2) {
          let boNode = boNavigation && boNavigation[idfwbonavigation2]

          if (boNode) {
            selectedTab = boNode.name
          }
        }
        let gaPageload = {
          'event': 'ga_pageload',
          'loginStatus': this.isLoggedIn ? 'logged in' : 'logged out',
          'product': 'sportsbook',
          'siteVersion': siteVersion,
          'platform': platform, // pass 'ios' or 'android' value here for when the site is a hyprid app
          'accountId': this.isLoggedIn && localStorage.customer ? localStorage.customer : 'N/A',
          'balance': this.isLoggedIn && this.totalBalanceValue ? this.totalBalanceValue : 'N/A',
          'sport': selectedSport || 'N/A', // only pass value on a sports or event page. Pass as undefined on home and live page
          'sportsbookTab': pSelectedTab || selectedTab || 'N/A', // pass tab name opnen on sports book
          'pagePath': document.location.pathname, // pass full url to be loaded e.g 'https://igtwallet.cts.webteam.beg.finsoft.com/sports/basketball/14141/134131,
          'pageTitle': document.title
        }
        let xtremePushAvoidPages = ['wallet-page', 'logout', 'withdrawal'] // wallet page has separate event control for xtremepush
        if ((window.xtremepush || this.xtremePushEnabledMobile) && !xtremePushAvoidPages.some(item => document.location.href.includes(item))) {
          let event = {
            'param1': 'event',
            'param2': 'page_view',
            'param3': {
              'pageName': document.title,
              'sport': selectedSport || 'N/A',
              'sportsbookTab': pSelectedTab || selectedTab || 'N/A',
              'pagePath': document.location.pathname,
              'destinationUrl': window.location.href,
              'paymentAction': 'N/A',
              'paymentProvider': 'N/A'
            }
          }
          analyticsBridge.xtremePush(event, false)
        }
        this.analyticsHandler(gaPageload)
      }
    },
    sendGTMAddSelectionToBetslip (marketType, couponTitle, competition, sport, inPlay, isEmptyBetslip, selection, market, eventName) {
      var isFastBetslip = this.mobileBigAndBelow && isEmptyBetslip
      if (window.dataLayer || this.thirdpartyAnalytics || this.xtremePushEnabledMobile) {
        let sendGTMAddSelectionToBetslip = {
          'event': 'coupon',
          'gaEventCategory': 'coupon',
          'gaEventAction': isFastBetslip ? 'add to fast betslip' : 'add to betslip',
          'gaEventLabel': marketType, // pass 'money', 'spread' or 'total'
          'module': couponTitle, // e.g 'nfl - week 1'
          'competition': competition, // nfl
          'sport': sport, // e.g 'football'
          'inPlay': inPlay ? 'y' : 'n',
          'selectionName': selection.name,  // Add new key here
          'marketName': market.name,  // Add new key here
          'eventName': market.eventname,  // Add new key here
          'selectionId': selection.idfoselection.toString(), // Add new key here. Pass as a string.
          'betSlipId': undefined, // Add new key here. Pass as a string
          'marketId': market.idfomarket.toString(),  // Add new key here. Pass as a string
          'eventId': market.idfoevent.toString() // Add new key here. Pass as a string
        }
        if (window.xtremepush || this.xtremePushEnabledMobile) {
          let event = {
            'param1': 'event',
            'param2': 'selection_added_to_betslip',
            'param3': {
              'competition': competition,
              'sport': sport,
              'isLive': inPlay ? 'y' : 'n',
              'selectionName': selection.name,
              'marketName': market.name,
              'eventName': eventName,
              'selectionId': selection.idfoselection,
              'marketId': market.idfomarket,
              'eventId': market.idfoevent
            }
          }
          analyticsBridge.xtremePush(event, false)
        }
        this.analyticsHandler(sendGTMAddSelectionToBetslip)
      }
    },
    sendGTMAddSelectionToBetslipBlocked (blockReason, couponTitle, competition, sport, inPlay, isEmptyBetslip, selection, market) {
      var isFastBetslip = this.mobileBigAndBelow && isEmptyBetslip
      if (window.dataLayer || this.thirdpartyAnalytics) {
        let sendGTMAddSelectionToBetslipBlocked = {
          'event': 'coupon',
          'gaEventCategory': 'coupon',
          'gaEventAction': isFastBetslip ? 'add to fast betslip blocked' : 'add to betslip blocked',
          'gaEventLabel': blockReason,
          'module': couponTitle, // e.g 'nfl - week 1'
          'competition': competition, // nfl
          'sport': sport, // e.g 'football'
          'inPlay': inPlay ? 'y' : 'n',
          'selectionName': selection.name,  // Add new key here
          'marketName': market.name,  // Add new key here
          'eventName': market.eventname,  // Add new key here
          'selectionId': selection.idfoselection.toString(), // Add new key here. Pass as a string.
          'betSlipId': undefined, // Add new key here. Pass as a string
          'marketId': market.idfomarket.toString(),  // Add new key here. Pass as a string
          'eventId': market.idfoevent.toString() // Add new key here. Pass as a string
        }
        this.analyticsHandler(sendGTMAddSelectionToBetslipBlocked)
      }
    },
    sendGTMRemoveCouponSelectionsFromBetslip (marketType, couponTitle, competition, sport, inPlay, selectionsNo, selection, market) {
      var isFastBetslip = this.mobileBigAndBelow && selectionsNo === 1
      if (window.dataLayer || this.thirdpartyAnalytics) {
        let sendGTMRemoveCouponSelectionsFromBetslip = {
          'event': 'coupon',
          'gaEventCategory': 'coupon',
          'gaEventAction': isFastBetslip ? 'remove fast betslip selection' : 'remove selection',
          'gaEventLabel': marketType || undefined,
          'module': couponTitle, // e.g 'nfl - week 1'
          'competition': competition, // nfl
          'sport': sport, // e.g 'football'
          'inPlay': inPlay ? 'y' : 'n',
          'selectionName': selection.name,  // Add new key here
          'marketName': market.name,  // Add new key here
          'eventName': market.eventname,  // Add new key here
          'selectionId': selection.idfoselection.toString(), // Add new key here. Pass as a string.
          'betSlipId': undefined, // Add new key here. Pass as a string
          'marketId': market.idfomarket.toString(),  // Add new key here. Pass as a string
          'eventId': market.idfoevent.toString() // Add new key here. Pass as a string
        }
        this.analyticsHandler(sendGTMRemoveCouponSelectionsFromBetslip)
      }
    },
    sendGTMGoToEventPage (couponTitle, competition, sport, inPlay) {
      if (window.dataLayer || this.thirdpartyAnalytics) {
        let sendGTMGoToEventPage = {
          'event': 'coupon',
          'gaEventCategory': 'coupon',
          'gaEventAction': 'navigated to',
          'gaEventLabel': 'more wagers',
          'module': couponTitle, // e.g 'nfl - week 1'
          'competition': competition, // nfl
          'sport': sport, // e.g 'football'
          'inPlay': inPlay ? 'y' : 'n'
        }
        this.analyticsHandler(sendGTMGoToEventPage)
      }
    },
    sendGTMFooterNavigation (label, url) {
      if (window.dataLayer || this.thirdpartyAnalytics) {
        let sendGTMFooterNavigation = {
          'event': 'navigation',
          'gaEventCategory': 'navigation',
          'gaEventAction': 'navigated to',
          'gaEventLabel': label,
          'module': 'mobile bottom nav',
          'destinationUrl': url
        }
        this.analyticsHandler(sendGTMFooterNavigation)
      }
    },
    sendGTMTopNavigation (label, url) {
      if (window.dataLayer || this.thirdpartyAnalytics) {
        let sendGTMTopNavigation = {
          'event': 'navigation',
          'gaEventCategory': 'navigation',
          'gaEventAction': 'navigated to',
          'gaEventLabel': label,
          'module': 'header',
          'destinationUrl': url
        }
        this.analyticsHandler(sendGTMTopNavigation)
      }
    },
    sendGTMPopularNavigation (label, url) {
      if (window.dataLayer || this.thirdpartyAnalytics) {
        let sendGTMPopularNavigation = {
          'event': 'navigation',
          'gaEventCategory': 'navigation',
          'gaEventAction': 'navigated to',
          'gaEventLabel': label,
          'module': 'popular',
          'destinationUrl': url
        }
        this.analyticsHandler(sendGTMPopularNavigation)
      }
    },
    sendGTMClickEvent (cat, action, label, module) {
      if (window.dataLayer || this.thirdpartyAnalytics) {
        let sendGTMClickEvent = {
          'event': 'click',
          'gaEventCategory': cat,
          'gaEventAction': action,
          'gaEventLabel': label,
          'module': module
        }
        this.analyticsHandler(sendGTMClickEvent)
      }
    },
    sendGTMselfExclusion (event, date, PlayerProtectionAreaName, IDFOPlayerProtectionArea, PlayerProtectionAreaCode) {
      if (window.dataLayer || this.thirdpartyAnalytics) {
        let sendGTMselfExclusion = {
          'event': event,
          'gaEventCategory': 'exclusions',
          'gaEventAction': event,
          'accountId': localStorage.customer || 'undefined',
          'expiryDate': date,
          'playerProtectionAreaName': PlayerProtectionAreaName,
          'playerProtectionAreaId': IDFOPlayerProtectionArea,
          'playerProtectionAreaCode': PlayerProtectionAreaCode
        }
        this.analyticsHandler(sendGTMselfExclusion)
      }
    },
    /* LIVE STREAMING */
    sendGTMWatchLiveError (error) {
      if (window.dataLayer) {
        window.dataLayer.push({
          'event': 'video',
          'gaEventCategory': 'video',
          'gaEventAction': 'video error',
          'gaEventLabel': error,
          'module': 'event info'
        })
      }
    },
    sendGTMWatchLiveStartedSuccesfully () {
      if (window.dataLayer) {
        window.dataLayer.push({
          'event': 'video',
          'gaEventCategory': 'video',
          'gaEventAction': 'play video success',
          'gaEventLabel': undefined,
          'module': 'event info'
        })
      }
    },
    sendGTMWatchLiveFullScreen (isFullScreen) {
      if (window.dataLayer) {
        window.dataLayer.push({
          'event': 'video',
          'gaEventCategory': 'video',
          'gaEventAction': isFullScreen ? 'increased' : 'decreased',
          'gaEventLabel': 'size',
          'module': 'live video'
        })
      }
    },
    gtmPmNormalizeAnalyticsDataObject (obj) {
      if (typeof (obj) === 'undefined') { obj = {} }
      if (typeof (obj.meetingdate) === 'undefined') { obj.meetingdate = null }
      if (typeof (obj.meetingid) === 'undefined') { obj.meetingid = null }
      if (typeof (obj.meetingnum) === 'undefined') { obj.meetingnum = null }
      if (typeof (obj.meetingname) === 'undefined') { obj.meetingname = null }
      if (typeof (obj.breed) === 'undefined') { obj.breed = null }
      if (typeof (obj.raceid) === 'undefined') { obj.raceid = null }
      if (typeof (obj.racenum) === 'undefined') { obj.racenum = null }
      if (typeof (obj.racetime) === 'undefined') { obj.racetime = null }
      // if (typeof (obj.runnerid) === 'undefined') { obj.runnerid = null }
      // if (typeof (obj.runnernum) === 'undefined') { obj.runnernum = null }
      // if (typeof (obj.runnername) === 'undefined') { obj.runnername = null }
      if (typeof (obj.pooltype) === 'undefined') { obj.pooltype = null }
      if (typeof (obj.bettype) === 'undefined') { obj.bettype = null }
      // if (typeof (obj.finish) === 'undefined') { obj.finish = null }
      return obj
    },
    gtmPmMakeAnalyticsDataObject (obj) {
      let ado = obj && obj.gaEventCategory ? obj : {}
      if (!ado.gaEventCategory) {
        ado.event = 'pmbet'
        ado.gaEventCategory = 'pm'
        ado.gaEventAction = 'pm action'
        ado.gaEventLabel = ''
        ado.module = 'betslip'
      }

      if (obj.meeting) {
        if (obj.meeting.meetingdate) { ado.meetingdate = obj.meeting.meetingdate } else if (obj.meeting.date) { ado.meetingdate = obj.meeting.date }
        if (obj.meeting.idtgmeeting) { ado.meetingid = obj.meeting.idtgmeeting } else if (obj.meeting.id) { ado.meetingid = obj.meeting.id }
        if (obj.meeting.number) { ado.meetingnum = obj.meeting.number } else if (obj.meeting.num) { ado.meetingnum = obj.meeting.num }
        if (obj.meeting.name) { ado.meetingname = obj.meeting.name }
        if (obj.meeting.breed) { ado.breed = obj.meeting.breed }
      }
      if (obj.race) {
        if (obj.race.idtgrace) { ado.raceid = obj.race.idtgrace } else if (obj.race.id) { ado.raceid = obj.race.id }
        if (obj.race.number) { ado.racenum = obj.race.number } else if (obj.race.num) { ado.racenum = obj.race.num }
        if (obj.race.racetime) { ado.racetime = obj.race.racetime } else if (obj.race.time) { ado.racetime = obj.race.time }
      }
      if (obj.runner) {
        if (obj.runner.id) { ado.runnerid = obj.runner.id }
        if (obj.runner.entrynumber) { ado.runnernum = obj.runner.entrynumber }
        if (obj.runner.name) { ado.runnername = obj.runner.name }
      }
      if (obj.pool) {
        if (obj.pool.type) { ado.pooltype = obj.pool.type }
      }
      if (obj.betinfo) {
        ado.betAmount = ''
        ado.betCount = ''
        ado.betRunnerCount = ''
        if (obj.betinfo.unitstake) { ado.betAmount = obj.betinfo.unitstake.toString() }
        if (obj.betinfo.numberofcombinations) { ado.betCount = obj.betinfo.numberofcombinations.toString() }
        if (obj.betinfo.runnercount) { ado.betRunnerCount = obj.betinfo.runnercount.toString() }
      }

      // overwrite with explicit specifid field
      if (obj.meetingdate) { ado.meetingdate = obj.meetingdate }
      if (obj.meetingid) { ado.meetingid = obj.meetingid }
      if (obj.meetingnum) { ado.meetingnum = obj.meetingnum }
      if (obj.meetingname) { ado.meetingname = obj.meetingname }
      if (obj.breed) { ado.breed = obj.breed }
      if (obj.raceid) { ado.raceid = obj.raceid }
      if (obj.racenum) { ado.racenum = obj.racenum }
      if (obj.racetime) { ado.racetime = obj.racetime }
      if (obj.runnerid) { ado.runnerid = obj.runnerid }
      if (obj.runnernum) { ado.runnernum = obj.runnernum }
      if (obj.runnername) { ado.runnername = obj.runnername }
      if (obj.pooltype) { ado.pooltype = obj.pooltype }
      if (obj.bettype) { ado.bettype = obj.bettype }
      if (typeof obj.finish !== 'undefined' && obj.finish !== null) { ado.finish = obj.finish }

      // fill out any missed field
      ado = this.gtmPmNormalizeAnalyticsDataObject(ado)
      return ado
    },
    gtmPmSendAddSelectionToBetslip (data) {
      if (window.dataLayer || this.thirdpartyAnalytics) {
        let adata = this.gtmPmMakeAnalyticsDataObject(data)
        adata.event = 'pm'
        adata.gaEventCategory = 'pmbet'
        adata.gaEventAction = 'add to betslip'
        adata.gaEventLabel = adata.pooltype + (adata.bettype ? (' ' + adata.bettype) : '')
        this.analyticsHandler(adata)
      }
    },
    gtmPmSendRemoveSelectionFromBetslip (data) {
      if (window.dataLayer || this.thirdpartyAnalytics) {
        let adata = this.gtmPmMakeAnalyticsDataObject(data)
        adata.event = 'pm'
        adata.gaEventCategory = 'pmbet'
        adata.gaEventAction = 'remove from betslip'
        adata.gaEventLabel = adata.pooltype + (adata.bettype ? (' ' + adata.bettype) : '')
        this.analyticsHandler(adata)
      }
    },
    gtmPmSendRemoveSelectionOnBetslip (data) {
      if (window.dataLayer || this.thirdpartyAnalytics) {
        let adata = this.gtmPmMakeAnalyticsDataObject(data)
        adata.event = 'pm'
        adata.gaEventCategory = 'pmbet'
        adata.gaEventAction = 'remove on betslip'
        adata.gaEventLabel = adata.pooltype + (adata.bettype ? (' ' + adata.bettype) : '')
        this.analyticsHandler(adata)
      }
    },
    gtmPmSendRemoveAllSelectionsOnBetslip (data) {
      if (window.dataLayer || this.thirdpartyAnalytics) {
        let adata = this.gtmPmMakeAnalyticsDataObject(data)
        adata.event = 'pm'
        adata.gaEventCategory = 'pmbet'
        adata.gaEventAction = 'remove all selections'
        adata.gaEventLabel = adata.pooltype + (adata.bettype ? (' ' + adata.bettype) : '')
        this.analyticsHandler(adata)
      }
    },
    gtmPmSendBetAttempt (data) {
      if (window.dataLayer || this.thirdpartyAnalytics) {
        let adata = this.gtmPmMakeAnalyticsDataObject(data)
        adata.event = 'pm'
        adata.gaEventCategory = 'pmbet'
        adata.gaEventAction = 'bet attempt'
        adata.gaEventLabel = adata.pooltype + (adata.bettype ? (' ' + adata.bettype) : '')
        this.analyticsHandler(adata)
      }
    },
    gtmPmSendBetError (data) {
      if (window.dataLayer || this.thirdpartyAnalytics) {
        let adata = this.gtmPmMakeAnalyticsDataObject(data)
        adata.event = 'pm'
        adata.gaEventCategory = 'pmbet'
        adata.gaEventAction = 'bet error'
        adata.gaEventLabel = adata.pooltype + (adata.bettype ? (' ' + adata.bettype) : '')
        this.analyticsHandler(adata)
      }
    },
    gtmPmSendBetSuccess (data) {
      if (window.dataLayer || this.thirdpartyAnalytics) {
        let adata = this.gtmPmMakeAnalyticsDataObject(data)
        adata.event = 'pm'
        adata.gaEventCategory = 'pmbet'
        adata.gaEventAction = 'bet success'
        adata.gaEventLabel = adata.pooltype + (adata.bettype ? (' ' + adata.bettype) : '')
        this.analyticsHandler(adata)
      }
    },
    sendGTMEventBanner (data) {
      if (window.dataLayer || this.thirdpartyAnalytics) {
        let dataLayerObj = {
          'event': 'banner_click',
          'gaEventId': data.headline.idfwheadline,
          'gaEventCategory': data.headline.linktype,
          'gaEventTitle': data.headline.title || undefined,
          'gaEventAction': data.headline.imageurl || undefined,
          'gaEventActionUrl': data.headline.location || undefined,
          'gaEventLabel': data.index + 1
        }
        this.sendGTMEvent(dataLayerObj)
      }
    },
    sendGTMEvent (dataLayerObj) {
      if (this.isDebug) {
        console.log('sendGTMEvent obj for data layer:', dataLayerObj)
      }
      if (window.dataLayer || this.thirdpartyAnalytics) {
        this.analyticsHandler(dataLayerObj)
      }
    },
    initializeGTM () {
      if (this.googleTagmngrId) {
        window.dataLayer = window.dataLayer || []
        window.dataLayer.push({'gtm.start': new Date().getTime(), event: 'gtm.js'})

        var f = document.getElementsByTagName('script')[0]
        var j = document.createElement('script')
        var gTags = {
          'default': this.googleTagmngrId
        }
        var gTag = gTags[window.location.hostname] || gTags.default
        j.async = true
        j.src = 'https://www.googletagmanager.com/gtm.js?id=' + gTag
        f.parentNode.insertBefore(j, f)
      }
    },
    analyticsHandler (event, xtremePushData = false) {
      // console.log('analyticsHandler event:', event)
      if (this.thirdpartyAnalytics) {
        analyticsBridge.dataParser(event)
        return false
      }
      window.dataLayer.push(event)
    }
  }
}
