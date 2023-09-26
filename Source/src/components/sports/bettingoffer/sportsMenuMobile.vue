<template>
<nav class="sportmenu-mobile-scrollbar" v-if="this.$route.name === 'sports'">
  <div :class="['sport','section']" v-for="(item, index) in navigationItems" :key="index">
    <router-link v-if="item.linktype === 'INTERNAL'" :to="{ path: item.area || '/' }">
      <icon v-if="item.cssclass && item.cssclass !='default'" :name="item.cssclass" color-name="white" :count="item.cssclass === 'icon-live'? liveEventsNumber: 0"></icon>
      <span class="mobile-menu-text">{{item.text}}</span>
    </router-link>
    <router-link v-else-if="item.linktype === 'URL'" :to="{ path: item.routing || '/' }">
      <icon v-if="item.cssclass && item.cssclass !='default'" :name="item.cssclass" color-name="white"></icon>
      <span class="mobile-menu-text">{{item.text}}</span>
    </router-link>
    <router-link v-else-if="item.linktype === 'BONAVIGATION'" :to="getBoNavigationPath(item)">
      <icon v-if="item.cssclass && item.cssclass !='default'" :name="item.cssclass" color-name="white"></icon>
      <span class="mobile-menu-text">{{item.text}}</span>
    </router-link>
    <a href="#" class="internal" v-else>
      <icon v-if="item.cssclass && item.cssclass !='default'" :name="item.cssclass" color-name="white"></icon>
      <span class="mobile-menu-text">{{item.text}}</span>
    </a>
  </div>
</nav>
</template>
<script>
  import store from '@/store'

  import Icon from '@/components/common/Icon'
  import SiteNavigation from '@/components/common/SiteNavigation'
  import BettingOffer from '@/components/mixins/BettingOffer'

  export default {
    props: [
      'navigationSection'
    ],

    components: {
      Icon,
      SiteNavigation
    },

    mixins: [
      BettingOffer
    ],

    computed: {
      state () {
        return window.ctsautoconf.STATE
      },
      liveEventsNumber () {
        return this.liveEvents.length || 0
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
      navigationGroup () {
        return (this.navigationSectionById && this.navigationSectionById.fwnavigationgroups && this.navigationSectionById.fwnavigationgroups[0]) || {}
      },
      navigationItems () {
        if (this.navigationGroup && this.navigationGroup.fwnavigationitems) {
          return this.navigationGroup.fwnavigationitems.filter(navitem => (navitem.display === 'ALWAYS') || (navitem.display === 'LOGGEDIN' && this.isLoggedIn) ||
          (navitem.display === 'LOGGEDOUT' && !this.isLoggedIn))
        }
      },
      isLoggedIn () {
        return store.getters['isLoggedIn']
      }
    },

    methods: {
      fetchNavigationSections (navigationSection) {
        store.dispatch('siteNavigationState/fetchSiteNavigation', navigationSection)
      },
      getBoNavigationPath (navitem) {
        var boNodes = (navitem.location && navitem.location.split(',')) || []
        var boNavName = 'bonavigation' + boNodes.length
        var params = {}

        boNodes.forEach((bonode, index) => {
          params['idfwbonavigation' + (index + 1)] = bonode
        })

        return { name: boNavName, params: params }
      }
    },

    created () {
      this.fetchNavigationSections('BO_POPULAR')
    },

    name: 'sportsMenuMobile'
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped>
  .sportmenu-mobile-scrollbar
    >>> .igt-icon .badge
      min-width: 24px
      min-height: 24px
  .browser-internet-explorer
    .sportmenu-mobile-scrollbar
      overflow-x hidden
</style>
