<template>
  <div class="main-navigation">
    <site-navigation
      :navigation-section="config.navigation.navigationSectionIds.main">
    </site-navigation>
  </div>
</template>
<script>
  import SiteNavigation from '@/components/common/SiteNavigation'
  import config from '@/config'

  export default {
    name: 'MainNavigation',

    components: {
      SiteNavigation
    },

    data: () => ({
      drawer: false
    }),

    computed: {
      config () {
        return config
      }
    },

    methods: {
      onResize () {
        this.drawer = false
      }
    },

    created () {

    }
  }
</script>
<style lang="stylus">
  @import '~@/css/config'

  .main-navigation .navigation 
    .igt-icon
    .font-icon
      @media tablet-and-above
        display: none
</style>
