<template>

</template>

<script>
  import store from '@/store'

  export default {
    name: 'set-opened-from-web-view',

    methods: {
      setOpenedFromWebView () {
        localStorage.setItem('webView', true)
        store.dispatch('setIsOpenedFromWebView', true)
        this.$router.push({name: 'home'})
      }
    },

    created () {
      this.setOpenedFromWebView()
    }
  }
</script>
<style lang="stylus" scoped>
  .event-info {
    cursor: pointer;
  }

  .live-navigation .sport-icon {
    display: none
  }
</style>
