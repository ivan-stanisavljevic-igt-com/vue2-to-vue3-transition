<template>

</template>

<script>
import store from '@/store'

export default {
  name: 'SetDebugLevel',

  methods: {
    setDebugLevel () {
      var level = false
      var pLevel = this.$route.params.level

      if (pLevel === 'true') {
        level = true
      } else if (!isNaN(parseInt(pLevel))) {
        level = parseInt(pLevel)
      }

      store.commit('setDebugLevel', level)
      this.$router.push({name: 'sports', params: {}})
    }
  },

  created () {
    this.setDebugLevel()
  }
}
</script>

<style scoped lang="stylus">
</style>
