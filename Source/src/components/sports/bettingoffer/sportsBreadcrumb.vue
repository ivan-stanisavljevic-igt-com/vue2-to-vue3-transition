<template>
  <div class="bo_nav_headline" :class="{'loggedInUser': isLoggedIn}">
    <template v-if="!inHeader">
      <div class="sb_title">
        <icon v-if="currentBoNavigation && currentBoNavigation.imageicon" :name="currentBoNavigation.imageicon"></icon>
        <h1>{{(currentBoNavigation && currentBoNavigation.name) || title}}</h1>
      </div>
      <h3>{{currentBoNavigation && (currentBoNavigation.description || currentBoNavigation.internaldescription)}}</h3>
    </template>
    <template v-if="inHeader">
        <h1>{{(currentBoNavigation && currentBoNavigation.name) || title}}</h1>
        <h1 :class="{'title-live': pageTitle === 'live'}" v-if="!(currentBoNavigation && currentBoNavigation.name) && pageTitle">{{ $t('PageTitle.' + pageTitle)}} <icon v-if="pageTitle === 'live'" name="icon-live"></icon></h1>
        <h1 class="title-live" v-if="liveEvent">{{ $t('PageTitle.live')}} <icon name="icon-live"></icon></h1>
    </template>
  </div>
</template>
<script>
  import store from '@/store'
  import BettingOffer from '@/components/mixins/BettingOffer'
  import Icon from '@/components/common/Icon'

  export default {
    name: 'SportsBreadcrumb',

    props: [
      'title',
      'inHeader'
    ],

    components: {
      Icon
    },

    mixins: [
      BettingOffer
    ],

    computed: {
      bonavigation1 () {
        return (this.idfwbonavigation1 && this.boNavigation && this.boNavigation[this.idfwbonavigation1]) || undefined
      },
      bonavigation2 () {
        return (this.idfwbonavigation2 && this.boNavigation && this.boNavigation[this.idfwbonavigation2]) || undefined
      },
      currentBoNavigation () {
        if (this.bonavigation1 && this.bonavigation1.idfwbonavigationtypes && this.bonavigation1.idfwbonavigationtypes.filter(bonavtype => bonavtype === 'MAIN').length > 0) {
          return this.bonavigation1 || undefined
        } else {
          return this.bonavigation2 || undefined
        }
      },
      idfoevent () {
        return this.$route.params.idfoevent
      },
      event () {
        return store.getters['eventState/getEvent']
      },
      liveEvent () {
        var self = this
        if (this.idfoevent && this.liveEvents && this.liveEvents.length > 0) {
          return this.liveEvents.find(ev => ev.idfoevent.toString() === self.idfoevent.toString() || (ev.foeventantepost && ev.foeventantepost.toString() === self.idfoevent.toString()))
        }
      },
      pageTitle () {
        if (this.$route.name === 'searchsport' || this.$route.name === 'searchcompetition') {
          return 'search'
        }
        if ((this.$route.path.indexOf('/sports/event/') > -1) || (this.$route.path.indexOf('/account/') > -1)) {
          return ''
        } else {
          return this.$route.path.substring(this.$route.path.lastIndexOf('/') + 1)
        }
      },
      isLoggedIn () {
        return store.getters['isLoggedIn']
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped>
@import "~@/css/config";
.header
  .bo_nav_headline
    text-align: left
    &.loggedInUser
      margin-left 40px
.bo_nav_headline
  .title-live
    >>>.font-icon
      color #e7212d
      padding-left 10px
      font-size 27px
    >>>.igt-icon > span
      height 27px
      width 27px

  h1
    font-weight: bold
    font-size: 76px
    font-weight: bold
    line-height: 76px
    color: white
    text-transform: uppercase
    text-align: left
    text-shadow: 2px 2px 2px rgba(0, 0, 0, 0.4)

  h3
    font-size: 18px
    text-align: left
    color:white
    font-weight: 600
    max-height: 35px
    overflow: hidden
    line-height: 21px
    opacity: 0.8

@media mobile-big-and-below
  h1
    font-size: 26px !important
    line-height: 30px !important
  h3
    font-size: 15px !important

</style>
