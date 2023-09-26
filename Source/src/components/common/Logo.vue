<template>
  <div class="logo">
    <router-link to="/">
      <img v-if="mode === 'light'" :src="mediaServer('/static/brand-img/' + brandKey + '/logo-' + nameProp + 'white.png')" :alt="brandKey">
      <img v-if="mode === 'dark'" :src="mediaServer('/static/brand-img/' + brandKey + '/logo-' + nameProp + 'dark.png')" :alt="brandKey">
    </router-link>
  </div>
</template>

<script>
import Branding from '@/components/mixins/Branding'
import Url from '@/components/mixins/Url'

export default {
  name: 'Icon',

  mixins: [
    Branding,
    Url
  ],

  data () {
    return {
    }
  },

  props: {
    mode: {
      type: String,
      default: 'dark'
    },
    name: {
      type: String,
      default: ''
    }
  },

  computed: {
    nameProp () {
      return this.name ? this.name + '-' : ''
    }
  },

  methods: {

  },

  created () {

  }
}
</script>

<style scoped lang="stylus">
  @import "~@/css/config"

  .logo
    line-height: 0
    a
      display: inline-block
      line-height: 0
</style>
