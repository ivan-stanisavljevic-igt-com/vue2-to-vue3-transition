<template>
  <div class="sports-menu">
    <nav>
      <site-navigation :navigation-section="config.navigation.navigationSectionIds.main" class="popular expand navigation mainmenu" v-if="brandKey == 'circa'"></site-navigation>
      <site-navigation :navigation-section="'SPORTS_MENU_TOP'" class="popular expand navigation topmenu"></site-navigation>
      <site-navigation :navigation-section="'BO_POPULAR'" class="popular expand navigation"></site-navigation>
      <div class="wrapper sports-az az-icon navigation">
        <h3> <span>{{ $t('Sports.SportAZ') }}</span></h3>
        <bo-navigation p-idfwbonavigation="top" :order-by-name="true" :preselect-first-node="false"></bo-navigation>
      </div>
      <site-navigation :navigation-section="'SPORTS_MENU_BOTTOM'" class="popular expand navigation mainmenu"></site-navigation>
    </nav>
  </div>
</template>
<script>
  import SiteNavigation from '@/components/common/SiteNavigation'
  import BoNavigation from '@/components/sports/bettingoffer/BoNavigation'
  import MainNavigation from '@/components/common/MainNavigation'
  import Screen from '@/components/mixins/Screen'
  import config from '@/config'
  import Icon from '@/components/common/Icon'
  import Branding from '@/components/mixins/Branding'

  export default {
    name: 'sports-menu',

    mixins: [
      Screen,
      Branding
    ],

    components: {
      SiteNavigation,
      MainNavigation,
      BoNavigation,
      Icon
    },

    computed: {
      externalUrls () {
        return config.externalUrls
      },
      config () {
        return config
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped>
@import "~@/css/config"

$image-base-url = '~@/assets/images/icons/svg/'
a
    color #06283b
h5
  vertical-align: middle
</style>
