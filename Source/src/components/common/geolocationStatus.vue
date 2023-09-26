<template>
</template>
<script>
  import store from '@/store'
  import config from '@/config'

  export default {
    name: 'geolocationStatus',
    props: [
      'isGelocated',
      'registration'
    ],
    computed: {
      externalUrls () {
        return config.externalUrls
      }
    },

    data () {
      return {}
    },
    methods: {
      setGeolocation () {
        localStorage.mobileGeolocated = this.isGelocated
        store.commit('setGeolocated', this.isGelocated)
        if (!this.isGelocated) {
          store.commit('setGeolocated', false)
        }
      },
      redirect () {
        if (this.registration) {
          window.location = this.externalUrls.addFunds + '?method=credit-card&uiView=true'
        } else {
          this.$router.push({name: 'home'})
        }
      }
    },
    created () {
      this.setGeolocation()
      this.redirect()
    }
  }
</script>
<style lang="stylus" scoped>
@import '~@/css/config';

</style>
