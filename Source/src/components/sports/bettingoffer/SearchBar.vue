<template>
  <v-flex class="search-bar" :class="{ 'mobile': mobileBigAndBelow }">
    <div class="input-group" :class="{'non-empty' : searchPhrase}">
      <div class="search-fields-container" v-show="showSearchFields">
        <div class="search-icon" @click="toggleShowSearchPopup()">
          <icon name="icon-search"></icon>
        </div>
        <input
          type="search"
          name="search-filed"
          v-model="searchPhrase"
          class="search-filed"
          ref="phrase"
          placeholder="Search competitions, teams, players..."
          autocomplete="off"
          @keyup.enter="performSetPhraseAndSearchSearch(true)" />
        <button v-show="searchPhrase" class="reset-icon" type="reset" @click="resetSearchPhrase()"></button>
        <span class="close-icon" :class="{ 'hidden': ['search', 'searchsport', 'searchcompetition'].indexOf(currentRouteName) > -1 }" type="button" @click="toggleShowSearchPopup()">Close</span>
      </div>
    </div>
  </v-flex>
</template>
<script>
  import store from '@/store'
  import Icon from '@/components/common/Icon'
  import Screen from '@/components/mixins/Screen'
  import BettingOffer from '@/components/mixins/BettingOffer'

  export default {
    name: 'search-component',

    components: {
      Icon
    },

    mixins: [
      Screen,
      BettingOffer
    ],

    props: [
    ],

    data () {
      return {
        searchTimeoutObj: undefined,
        numOfCharsToStartSearch: window.ctsautoconf.SEARCH_NUMBER_OF_CHARS_TO_START || 3,
        showSearchFieldsContainer: false
      }
    },
    computed: {
      searchPhrase: {
        get: () => {
          return store.getters['searchState/getPhrase']
        },
        set: (value) => {
          store.commit('searchState/setPhrase', value.replace(/[^a-zA-Z0-9 ]/g, ''))
        }
      },
      routeToExitSearch () {
        return store.getters['searchState/getRouteToExitSearch']
      },
      showSearchFields () {
        return this.showSearchFieldsContainer || ['search', 'searchsport', 'searchcompetition'].indexOf(this.currentRouteName) > -1
      },
      currentRouteName () {
        return this.$route.name
      }
    },

    methods: {
      startSearch (noTimeout) {
        clearTimeout(this.searchTimeoutObj)
        this.searchTimeoutObj = setTimeout(() => {
          store.dispatch('searchState/fetchSearchResults')
        }, noTimeout ? 0 : 1000)
      },
      resetSearch () {
        clearTimeout(this.searchTimeoutObj)
        store.dispatch('searchState/clearCachedResults')
      },
      resetSearchPhrase () {
        store.commit('searchState/setPhrase', '')
      },
      performSetPhraseAndSearchSearch (noTimeout) {
        if (!this.searchPhrase) {
          this.resetSearch()
        } else {
          if (this.$route.name !== 'search') {
            this.$router.push({name: 'search'})
          }
          if (this.searchPhrase.length >= this.numOfCharsToStartSearch) {
            this.startSearch(noTimeout)
          } else {
            this.resetSearch()
          }
        }
      },
      toggleShowSearchPopup () {
        if (this.mobileBigAndBelow && ['search', 'searchsport', 'searchcompetition'].indexOf(this.currentRouteName) === -1) {
          this.showSearchFieldsContainer = !this.showSearchFieldsContainer
        }
      }
    },
    watch: {
      searchPhrase () {
        store.commit('searchState/setEventsLoaded', false)
        this.performSetPhraseAndSearchSearch()
      }
    }
  }
</script>
<style lang="stylus" scoped>
  .search-bar
    .input-group
      margin-bottom 0px
      position relative
      &.non-empty
        .search-fields-container
          .search-filed
            color #445058
      .search-icon
        position absolute
        top 11px
        left 15px
        width 18px
        height 18px
      .search-fields-container
        position relative
        .search-filed
          height 40px
          width 100%
          background #fff
          padding 0 10px 0 42px
          border-radius 4px
          border: solid 1px #6a818b
          font-size 14px
          -webkit-appearance: none
          &::placeholder
            color #BDC3C6
          &:active
          &:focus
            border: solid 1px #1493ff
            outline none
            -webkit-appearance: none
        .reset-icon
          background url("~@/assets/images/icons/icon-close-grey.svg") no-repeat center
          background-size 10px
          width 18px
          height 18px
          position absolute
          z-index 1
          right 20px
          top 11px
          cursor pointer
          border none
        .close-icon
          width 17%
          display none
          text-align center
          position absolute
          right 10px
          top 15px
          cursor pointer
    // &.mobile
    //   .input-group
    //     position static
    //     .search-icon
    //       position relative
    //       top 3px
    //       left 30px
    //     .search-fields-container
    //       height 50px
    //       position absolute
    //       width 100%
    //       left 0
    //       top 55px
    //       padding 5px
    //       .search-filed
    //         width 80%
    //         padding-left 10px
    //       .close-icon
    //         display inline-block
    //         &.hidden
    //           display none

</style>
