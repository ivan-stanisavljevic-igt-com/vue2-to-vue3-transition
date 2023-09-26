<template>
  <div class="search page-content">
    <div v-if="isSearchEnabled">
      <div class="search-bar-holder">
        <span class="back-button" @click="goBack()" v-if="showBackBtn && !this.mobileBigAndBelow">
        <span class="icon-back"></span>  Back
        </span>
        <v-flex sm12 align-content-end class="search-bar">
          <search-bar></search-bar>
        </v-flex>
      </div>
      <search-results v-if="routeName === 'search'"></search-results>
      <sport-and-competition-events-list v-else-if="routeName === 'searchsport' || routeName === 'searchcompetition'"></sport-and-competition-events-list>
    </div>
  </div>
</template>
<script>
  import store from '@/store'
  import Screen from '@/components/mixins/Screen'
  import BettingOffer from '@/components/mixins/BettingOffer'
  import SearchBar from '@/components/sports/bettingoffer/SearchBar'
  import SearchResults from '@/components/sports/bettingoffer/SearchResults'
  import SportAndCompetitionEventsList from '@/components/sports/bettingoffer/SportAndCompetitionEventsList'

  export default {
    name: 'SportsPage',

    mixins: [
      Screen,
      BettingOffer
    ],

    components: {
      SearchResults,
      SportAndCompetitionEventsList,
      SearchBar
    },

    computed: {
      routeName () {
        return this.$route.name
      },
      isSearchEnabled () {
        return window.ctsautoconf.IS_SEARCH_ENABLED || false
      },
      searchPhrase () {
        return store.getters['searchState/getPhrase']
      },
      showBackBtn () {
        return ((this.$route.name === 'searchsport' || this.$route.name === 'searchcompetition') && this.searchPhrase)
      }
    },
    methods: {
      goBack () {
        this.$router.back()
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped>
@import '~@/css/config'
.search.page-content
  margin-right 5px
  padding 0 5px 5px 5px
  @media mobile-big-and-below
    margin-right 0px
    padding 10px 5px 5px 5px
  .search-bar-holder
    display flex
    justify-content space-between
    align-items center
  .back-button
    width 100px
    height 40px
    color #1493ff
    font-size 14px
    background-color #fff
    text-align center
    cursor pointer
    border solid 1px #6a818b
    margin 0px 10px 0 0
    border-radius 4px
    display flex
    align-items center
    justify-content center
    .icon-back
      width: 12px
      height 12px
      display inline-block
      background-image url("~@/assets/images/icons/arrow_left.svg")
      background-size 100%
      background-position center
      margin-right 5px

</style>
