<template>
  <ul class="site-navigation navigation-groups" :class="{'site-navigation-empty': typeof(navigationGroups) === 'undefined' || navigationGroups === null}">
    <li v-for="(navGroup) in navigationGroups" :class="['navigation-group', navGroup.layout]" v-if="!(mobileBigAndBelow && navGroup.cssclass === 'popular-desktop')">
      <h3 v-if="navGroup.text">
        <v-icon v-if="navGroup.cssclass && navGroup.cssclass !='default'" :class="navGroup.cssclass">{{navGroup.cssclass}}</v-icon>
        {{ navGroup.text }}
      </h3>
      <ul class="navigation">
          <li class="navigation-item" v-for="(item, index) in navGroup.fwnavigationitems"
            :key="index"
            v-if="(item.display === 'ALWAYS') || (item.display === 'LOGGEDIN' && isLoggedIn) || (item.display === 'LOGGEDOUT' && !isLoggedIn)"
            @click="handler(item)">
            <a v-if="item.area === 'taxStatement'" download="Tax Statement.pdf" id="generatePDF" :href="userPdf" style="display: none"></a>
            <span v-if="item.linktype === 'JAVASCRIPT'">{{item.text}}</span>
            <router-link v-else-if="item.linktype === 'INTERNAL'" :to="{ path: item.area || '/' }" :id="item.area" :class="item.cssclass === 'icon-live' ? 'icon-live' : ''">
              <icon v-if="item.cssclass && item.cssclass !='default'"
                  :name="item.cssclass"
                  :isFromSiteNavigation="true"
                  :count="item.cssclass === 'icon-live' ? liveEventsNumber : 0"></icon>
              <!-- <span class="live-events-number" v-if="item.cssclass === 'icon-live'">{{liveEventsNumber}}</span> -->
            <span>{{ item.text }}</span>
            </router-link>
            <router-link v-else-if="item.linktype === 'URL'" :to="{ path: item.routing || '/' }" :id="item.routing">
              <icon v-if="item.cssclass && item.cssclass !='default'" :name="item.cssclass"></icon>
              <span>{{ item.text }}</span>
            </router-link>
            <router-link v-else-if="item.linktype === 'BONAVIGATION'" :to="getBoNavigationPath(item)">
              <icon v-if="item.cssclass && item.cssclass !='default'" :name="item.cssclass"></icon>
              {{ item.text }}
            </router-link>
            <a :href="item.location" v-else :class="item.cssclass" :setTarget="setTarget(item.idfwnavigationitem, item.target)" :id="item.idfwnavigationitem" :rel="item.rel">
              <icon v-if="item.cssclass && item.cssclass !='default'" :name="item.cssclass"></icon>
              <span class="item-text">{{ item.text }}</span>
            </a>
            <!-- :target="item.target"  always open _self-->
            <!-- <a v-else @click.stop="externalLink(item.location, item.target)" :class="item.cssclass">
              <icon v-if="item.cssclass && item.cssclass !='default'" :name="item.cssclass"></icon>
              <span>{{ item.text }}</span>
            </a> -->
        </li>
      </ul>
    </li>
  </ul>
</template>

<script>
  import store from '@/store'
  import Screen from '@/components/mixins/Screen'
  import Icon from '@/components/common/Icon'
  import BettingOffer from '@/components/mixins/BettingOffer'
  import Session from '@/components/mixins/Session'
  import Branding from '@/components/mixins/Branding'
  import zinrelo from '@/library/zinrelo'

  export default {
    props: [
      'navigationSection'
    ],
    mixins: [
      Screen,
      BettingOffer,
      Session,
      Branding
    ],
    components: {
      Icon
    },
    computed: {
      state () {
        return window.ctsautoconf.STATE
      },
      liveEventsNumber () {
        return this.liveEvents.length || 0
      },
      isLoggedIn () {
        return store.getters['isLoggedIn']
      },
      navigationSectionByState () {
        return this.navigationSection + '_' + this.state
      },
      navigationSections () {
        return store.getters['siteNavigationState/navigationSections']
      },
      navigationSectionById () {
        return (this.navigationSections && (this.navigationSections[this.navigationSectionByState] || this.navigationSections[this.navigationSection])) || undefined
      },
      navigationGroups () {
        return (this.navigationSectionById && this.navigationSectionById.fwnavigationgroups) || undefined
      },
      // navigationGroup () {
      //   return (this.navigationSectionById && this.navigationSectionById.fwnavigationgroups && this.navigationSectionById.fwnavigationgroups[0]) || {}
      // },
      navigationItems () {
        if (this.navigationGroup && this.navigationGroup.fwnavigationitems) {
          return this.navigationGroup.fwnavigationitems.filter(navitem => (navitem.display === 'ALWAYS') || (navitem.display === 'LOGGEDIN' && this.isLoggedIn) ||
            (navitem.display === 'LOGGEDOUT' && !this.isLoggedIn))
        }
      },
      isIgtPayAvailable: () => store.getters['igtPay/isIgtPayAvailable']
    },

    methods: {
      closeOverlays () {
        store.dispatch('overlayState/closeAll')
      },

      getBoNavigationPath (navitem) {
        var boNodes = (navitem.location && navitem.location.split(',')) || []
        var boNavName = 'bonavigation' + boNodes.length
        var params = {}

        boNodes.forEach((bonode, index) => {
          params['idfwbonavigation' + (index + 1)] = bonode
        })

        return { name: boNavName, params: params }
      },
      elementLink (item) {
        if (item.linktype === 'URL') {
          if (item.routing === '/sports/history/active') {
            store.commit('sbBetslipState/setActiveBetSlipHistoryTab', 'active')
            store.dispatch('overlayState/activateBetslip')
            store.dispatch('statementState/initStatement', {fetchHistory: true, queryStatus: 'Open', historyDateRange: { from: null, to: null }})
            this.$router.push({ path: '/' })
            console.log('My Wagers click: ' + item.routing)
          } else if (item.routing.includes('/account/wallet-page')) {
            if (this.isIgtPayAvailable) {
              this.$router.push({ path: '/' })
              store.dispatch('igtPay/redirect2IgtPayPage')
            }
          }
        }
      },

      handler (item, navigationSection) {
        this.sendGTMPopularNavigation(item.text, window.location.href)
        this.closeOverlays()
        this.elementLink(item)
        this.userIsActive()
        if (item.action === 'zinrelo-loyalty-awards') {
          zinrelo.initialize()
        }
      },
      externalLink (link, target) {
        window.open(link, target)
      },
      setTarget (id, target) {
        setTimeout(() => {
          if (id) {
            document.getElementById(id).setAttribute('target', target)
          }
        }, 0)
      }
    },

    name: 'SiteNavigation'
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus">
@import '~@/css/config'
  .site-navigation h3
    /* do not display for main navigation - override per situation */
    display: none
    .v-icon
      display none !important

  .site-navigation .navigation-groups .navigation-group.VERTICAL .navigation-item
    display: block
  .navigation-groups.account_links
    .navigation-group.VERTICAL:last-child
      .navigation-item
        display flex
        justify-content center
        a
          border-radius 25px
          padding 0

  .site-navigation.account_links
    padding: 0
    margin: 0

    ul
      padding: 0
      margin: 0

  .account_links .navigation .navigation-item:not(:last-child):after
    content: ""
    display: block
    width: 100%
    border-bottom: 1px solid #cfd6db
  .account_links .navigation .navigation-item:last-child
    border-top: 15px solid #e4e8ee
    margin-top: -1px


  .account_links .navigation .navigation-item
    padding: 0 16px
    font-size: 14px
    color: #1F375B
    line-height: 48px

    a
      color: #0E1921
      display flex
      justify-content center

    .igt-icon
      padding-right: 16px
      .icon-history
        width: 14px !important
        height: 19px !important

  @media desktop-and-above
    .account_links .navigation .navigation-item:hover
      background: #F0F3F8 !important
      color: #2396FC
      cursor: pointer

    .account_links .navigation .navigation-item:hover a
      color: #2396FC

  @media mobile-big-and-below
    .navigation:last-child hr
      display none
    .v-navigation-drawer .navigation
      margin-bottom 0 !important



</style>
