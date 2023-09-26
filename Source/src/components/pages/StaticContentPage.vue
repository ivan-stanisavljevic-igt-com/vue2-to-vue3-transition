<template>
  <div class="sports-page">
    <v-layout  class="page-layout">
      <v-flex class="main-column" :style="{paddingTop: headerHeight + 'px'}" ref="maincolumn">
        <resize-observer @notify="mainColumnResize" />
         <div class="staticcontent">
          <div v-if="tabletAndAbove" class="static_content_links">
            <div class="sc_header">{{ $t('StaticContent.AboutUs')}}</div>
            <site-navigation :navigation-section="'ABOUT_US'" class="sc_links"></site-navigation>
          </div>
          <div class="static-content accpage">
            <h1 v-if="showPageTitleInHeader && infoPageName && tabletAndAbove">{{ $t('PageTitle.' + infoPageName)}}</h1>
            <static-content :staticcontentpath="'/static/static-content/'" :method="'html'"></static-content>
          </div>
          <div v-if="tabletAndAbove  && isReadOnly" class="banners">
            <headlinesLight category="SidebarBanners" ></headlinesLight>
          </div>
        </div>
      </v-flex>
    </v-layout>
  </div>
</template>
<script>
  import store from '@/store'
  import config from '@/config'
  import Screen from '@/components/mixins/Screen'

  import HeaderPart from '@/components/layout/parts/HeaderPart'
  import StaticContent from '@/components/common/StaticContent'
  import headlinesLight from '@/components/sports/bettingoffer/headlinesLight'
  import SiteNavigation from '@/components/common/SiteNavigation'

  export default {
    name: 'AboutUsPage',

    mixins: [
      Screen
    ],

    components: {
      HeaderPart,
      StaticContent,
      headlinesLight,
      SiteNavigation
    },

    data () {
      return {
        right: true,
        iframeHeight: '400px'
      }
    },

    computed: {
      headerHeight () {
        return store.getters['screenState/getHeaderHeight']
      },
      mainColumnWidth () {
        return store.getters['screenState/getMainColumnWidth']
      },
      infoPageName () {
        return this.$route.params.infopagename
      },
      isReadOnly () {
        return config.app.autoconf.ROBO
      },
      showPageTitleInHeader () {
        return window.ctsautoconf.PAGE_TITLE_IN_HEADER_ON_MOBILE || false
      }
    },
    mounted () {
      this.mainColumnResize()
    },

    methods: {
      mainColumnResize () {
        var mainColumn = this.$refs.maincolumn
        if (mainColumn) {
          store.commit('screenState/setMainColumnWidth', mainColumn.offsetWidth)
        }
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped>
@import "~@/css/config"

iframe
  width 100%
  height 100%
  // min-height 400px
.static-content
  .ca
    padding 5px 0
    .pd-icon
      width 30px
      display inline-flex
      align-items center
      justify-content center
  .ca_email .pd-icon
    font-size 15px
.staticcontent
  display flex
.static_content_links
  width 250px
  >>>.sc_links
    .navigation
      .navigation-item
        line-height 38px
        font-size 14px
        padding 0 16px
        a
          color #fff 
          font-family 'Open Sans SemiBold'
          &:hover
            font-family 'Open Sans Bold'
        .router-link-exact-active.router-link-active
          font-family 'Open Sans Bold'
  .sc_header
    display none

.banners
  width 375px
  margin-top 20px


</style>
