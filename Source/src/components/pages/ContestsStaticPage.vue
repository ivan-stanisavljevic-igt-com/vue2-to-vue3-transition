<template>
  <div class="contests-container">
    <div class="static-content accpage">
      <static-content :staticcontentpath="'/static/static-content/contests.html'" :method="'html'" fullPath="true"></static-content>
    </div>
  </div>
</template>

<script>
import StaticContent from '@/components/common/StaticContent'
import Branding from '@/components/mixins/Branding'

export default {
  name: 'ContestsStaticPage',

  components: {
    StaticContent
  },

  data: () => {
    return {

    }
  },
  mixins: [
    Branding
  ],
  computed: {

  },
  methods: {

  },
  mounted () {
  }
}
</script>

<style scoped lang="stylus">
@import '~@/css/config'
@import '~@/css/mixins'

</style>
