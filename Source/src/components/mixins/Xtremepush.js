import store from '@/store'
import Screen from '@/components/mixins/Screen'
import BettingOffer from '@/components/mixins/BettingOffer'
import config from '@/config'

export default {
  mixins: [
    Screen,
    BettingOffer
  ],
  data () {
    return {
      inlineCounter: 0,
      initCounter: 1
    }
  },
  computed: {
    xtremepushInlineContent () {
      return store.getters['getXtremepushInlineContent']
    },
    xtremepushWebInitialized () {
      return store.getters['getXtremepushWebInitialized']
    },
    xtremepushOnSiteEnabled () {
      return config.app.autoconf.XTREMEPUSH_ANALYTICS && config.app.autoconf.XTREMEPUSH_ANALYTICS.CHANNEL && config.app.autoconf.XTREMEPUSH_ANALYTICS.CHANNEL.ON_SITE
    }
  },
  methods: {
    initBadge () {
      console.log('xtreme - initBadge')
      window.xtremepush('ready', function () {
        window.xtremepush('inbox', 'badge', {
          opened: 0,
          clicked: 0
        }, function (result) {
          console.log('xtreme - inbox badge', result)
          store.commit('setXtremepushInboxBadgeCounter', result.badge)
        }, function (err) {
          console.log('xtremepush inbox badge error', err)
        })
      })
    },
    onXtremepushMessageList () {
      window.xtremepush('inbox', 'message.list', {
        // limit: 20,         // Maximum number of messages to return
        // offset: integer,   // Offset that can be used for pagination or show more functionality.
        // opened: 0,         // Return opened or not opened messages. Skip to return all.
        clicked: 0            // Return clicked or not clicked messages. Skip to return all.
        // expired: 0/1,      // Return expired or not expired messages. 0 by default.
        // min_time: integer, // Return messages after certain date (using unix timestamp).
        // max_time: integer, // Return messages before certain date (using unix timestamp).
      }, function (result) {
        if (result.badge !== undefined) {
          store.commit('setXtremepushInboxBadgeCounter', result.badge)
        }
        console.log('xtremepush message list', result)
        store.commit('setXtremepushMessageList', result.items)
      }, function (err) {
        console.log('xtremepush message list error', err)
      })
    },
    onXtremepushMessageClickedOrDismissed (id, action) {
      console.log('xtremepush message.action', { id, action })
      window.xtremepush('inbox', 'message.action', {
        id: id,
        [action]: 1
      }, function (result) {
        if (result.badge !== undefined) {
          store.commit('setXtremepushInboxBadgeCounter', result.badge)
        }
        console.log('xtremepush message.action', result)
      }, function (err) {
        console.log('xtremepush message action error', err)
      })
    },
    onXtremepushInlineContentList () {
      if (this.xtremepushWebInitialized && this.xtremepushOnSiteEnabled) {
        if (window.xtremepush) {
          window.xtremepush('event', 'sbk_site_loaded')
          window.xtremepush('on', 'native_onsite', function (data) {
            console.log('xtremepush native_onsite data', data)
            store.commit('setXtremepushInlineContent', data)
          }, function (err) {
            console.log('xtremepush native_onsite error', err)
          })
        }
      }
    },
    openXtremepushLink (deeplink) {
      let sportsbookOrigin = window.location.origin
      let xtremepushDeeplinkToObject = new URL(deeplink)
      if (sportsbookOrigin === xtremepushDeeplinkToObject.origin) {
        // if (xtremepushDeeplinkToObject.href.includes('injectselections')) {
        //   let selections = xtremepushDeeplinkToObject.href.split('/').pop()
        //   store.commit('setSelectionInjector', selections)
        //   this.selectionInjectorToBetSlip()
        //   return false // prevent event execution
        // }
        this.$router.push({path: xtremepushDeeplinkToObject.pathname})
      } else {
        window.open(deeplink, '_blank')
      }
    },
    initXtremepush () {
      if (window.ctsautoconf.XTREMEPUSH_ANALYTICS && window.ctsautoconf.XTREMEPUSH_ANALYTICS.WEB_KEY) {
        setTimeout(() => {
          if (window.xtremepush) {
            console.log('XTREMEPUSH INITIALIZED')
            store.commit('setXtremepushWebInitialized', true)
            this.onXtremepushInlineContentList()
          } else {
            console.log('xtremepush - init counter', this.initCounter)
            if (this.initCounter <= 5) {
              setTimeout(() => {
                this.initCounter += 1
                console.log('xtremepush - trying to connect...' + this.initCounter + '/5')
                this.initXtremepush()
              }, 3000)
            }
          }
        }, 1000)
      }
    }
  },
  mounted () {}
}
