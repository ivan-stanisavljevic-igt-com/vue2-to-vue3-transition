<template>
  <div>
    <div v-if="isLoggedIn && playerFavorites">
      <my-events></my-events>
    </div>
  </div>
</template>
<script>
  import store from '@/store'
  import MyEvents from '@/components/sports/bettingoffer/MyEvents'

  export default {
    name: 'MyEventsPage',

    mixins: [
    ],

    components: {
      MyEvents
    },

    computed: {
      playerFavorites () {
        return window.ctsautoconf.PLAYER_FAVORITES || false
      },
      isLoggedIn () {
        return store.getters['isLoggedIn']
      }
    },
    methods: {

    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped>

</style>
