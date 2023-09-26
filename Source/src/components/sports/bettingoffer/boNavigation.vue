<template>
  <div>
    <ul class="bo-navigation" v-if="!astabs && activeBoNavigationNodes.length > 0">
      <li class="navigation-item" v-for="node in sortedActiveBoNavigationNodes"  @click="closeOverlays()" :key="node.idfwbonavigation" :idfwbonavigation="node.idfwbonavigation">
        <!-- <a @click="goToBoNavigation(node.idfwbonavigation)"
           :class="[
            'bonavigation-link',
            {'active': [strIdfwbonavigation1, strIdfwbonavigation2].indexOf(node.idfwbonavigation.toString()) > -1}]">
          <icon v-if="node.imageicon" :name="node.imageicon"></icon>
          {{ node.name }}  { path: 'home' || '/' }
        </a> -->
        <router-link :to="initBoNavigation(node.idfwbonavigation)" :class="[
            'bonavigation-link',
            {'active': [strIdfwbonavigation1, strIdfwbonavigation2].indexOf(node.idfwbonavigation.toString()) > -1}]">
            <icon v-if="node.imageicon" :name="node.imageicon"></icon>
            {{ node.name }}
          </router-link>
      </li>
    </ul>
    <v-tabs v-if="astabs && activeBoNavigationNodes.length > 0" :centered="centered" fixed-tabs :class="activeBoNavigationNodes.length > numberOfTabs || mobileBigAndBelow ? 'with_more_btn':''">
      <v-tab :class="['tab', {'active': [strIdfwbonavigation1, strIdfwbonavigation2].indexOf(tab.idfwbonavigation.toString()) > -1},{'tabLive' : tab.idfwbonavigationtypes.includes('INPLAYPERSPORTTYPE')}]"
              v-for="(tab, index) in sortedActiveBoNavigationNodes"
              v-if="(index <= numberOfTabs - 1 && !mobileBigAndBelow) || (index >= 0 && mobileBigAndBelow)"
              :key="index"
              @click.stop="goToBoNavigation(tab.idfwbonavigation)"
              :idfwbonavigation="tab.idfwbonavigation.toString()"><icon v-if="tab.imageicon" :name="tab.imageicon"></icon>{{ tab.name }}</v-tab>
      <v-menu offset-y max-width="320" min-width="212" :left="true" :bottom="true" origin="center" content-class="menu_top_arrow_right"
        v-if="(activeBoNavigationNodes.length > numberOfTabs) && !mobileBigAndBelow"
        class="v-tabs__div"
      >
        <a  v-if="!mobileBigAndBelow" slot="activator" class="more_tabs" :class="moreButtonState" >
          <span>{{ $t('More') }}</span>
          <v-icon v-if="moreButtonState">expand_less</v-icon>
          <v-icon v-else>expand_more</v-icon>
        </a>
        <!-- <a  v-if="mobileBigAndBelow" slot="activator" class="more_tabs_mobile">
          <span>{{ $t('More') }}</span>
          <icon name="icon-preferences" colorName="white"></icon>
        </a> -->
        <v-list>
          <v-list-tile
            v-for="(tab, index) in sortedActiveBoNavigationNodes"
            v-if="index > numberOfTabs - 1"
            :key="index"
            :class="['tab-li',{'active': [strIdfwbonavigation1, strIdfwbonavigation2].indexOf(tab.idfwbonavigation.toString()) > -1}]"
            @click="goToBoNavigation(tab.idfwbonavigation)"
            :idfwbonavigation="tab.idfwbonavigation.toString()"
          >
            <span class="list_title">{{ tab.name }}</span><icon name="icon-tick" colorName="blue"></icon>
          </v-list-tile>
        </v-list>
      </v-menu>
    </v-tabs>
    <a v-if="mobileBigAndBelow && astabs && activeBoNavigationNodes.length > 0" @click="openDialogCompetitionSelect()" class="open_competition_dialog">
      <icon name="icon-preferences" colorName="white"></icon>
    </a>
    <v-dialog v-if="astabs && activeBoNavigationNodes.length > 0" content-class="dialog-competition-select" v-model="dialogCompetitionSelect" :fullscreen="false">
      <v-layout class="dialog_header" :class="dialogCompetitionSelect">
        <v-flex xs6 class="left">
            <span>{{ $t('Dialog.SelectCompetition') }}</span>
        </v-flex>
        <v-flex xs6 class="right">
          <button @click="closeDialogCompetitionSelect()">
            <span>{{ $t('Dialog.btn.CLOSE') }}</span>
          </button>
        </v-flex>
      </v-layout>
      <v-list>
        <v-list-tile
          v-for="tab in sortedActiveBoNavigationNodes"
          :key="tab.id"
          :class="['tab-li',{'active': [strIdfwbonavigation1, strIdfwbonavigation2].indexOf(tab.idfwbonavigation.toString()) > -1}]"
          @click="goToBoNavigation(tab.idfwbonavigation);closeOverlays()"
          :idfwbonavigation="tab.idfwbonavigation.toString()"
        >
          <span class="list_title">{{ tab.name }}</span><icon name="icon-tick" colorName="blue"></icon>
        </v-list-tile>
      </v-list>
    </v-dialog>
    <div class="place-holder" v-if="activeBoNavigationNodes.length === 0"></div>
  </div>
</template>
<script>
  import store from '@/store'
  import Screen from '@/components/mixins/Screen'
  import Vue from 'vue'
  import BettingOffer from '@/components/mixins/BettingOffer'
  import Session from '@/components/mixins/Session'

  import Icon from '@/components/common/Icon'

  export default {
    name: 'bonavigation-component',

    props: [
      'pIdfwbonavigation',
      'preselectFirstNode',
      'orderByName',
      'astabs'
    ],

    components: {
      Icon
    },

    mixins: [
      Screen,
      BettingOffer,
      Session
    ],
    data () {
      return {
        centered: true
      }
    },

    computed: {
      strIdfwbonavigation1 () {
        return this.idfwbonavigation1 && this.idfwbonavigation1.toString()
      },
      strIdfwbonavigation2 () {
        return this.idfwbonavigation2 && this.idfwbonavigation2.toString()
      },
      routeBoNavigation () {
        var routeBoNavigation = this.pIdfwbonavigation || this.idfwbonavigation1 || undefined

        if (isNaN(routeBoNavigation)) {
          return routeBoNavigation
        } else if (routeBoNavigation.toString().indexOf('.') > -1) {
          return parseFloat(routeBoNavigation + '.1')
        } else {
          return parseFloat(routeBoNavigation)
        }
      },
      currentBoNavigation () {
        return (this.routeBoNavigation && this.boNavigation && this.boNavigation[this.routeBoNavigation.toString()]) || undefined
      },
      boNavLevel () {
        if (this.pIdfwbonavigation) {
          return 0
        } else if (this.idfwbonavigation1) {
          return 1
        } else {
          return undefined
        }
      },
      activeBoNavigationNodes () {
        if (this.currentBoNavigation && this.currentBoNavigation.bonavigationnodes) {
          return this.currentBoNavigation.bonavigationnodes.filter((item) => {
            if (item.idfwbonavigationtypes) {
              if (item.idfwbonavigationtypes.filter(bonavtype => bonavtype === 'MAIN' || bonavtype === 'MAIN DYNAMIC').length > 0) {
                if (item.idfwbonavigationtypes.filter(bonavtype => bonavtype === 'INPLAYPERSPORTTYPE').length > 0) {
                  return true
                } else {
                  return item.ifnodecontainsopenmarkets && (parseInt(item.numbonavigationchildren) > 0 || parseInt(item.numactivefwmarketgroups) > 0)
                }
              }

              return item.idfwbonavigationtypes.filter(bonavtype => bonavtype === 'MAIN' || bonavtype === 'MAIN DYNAMIC').length > 0
            }
          }) || []
        }

        return []
      },
      sortedActiveBoNavigationNodes () {
        if (this.orderByName) {
          return Vue._.orderBy(this.activeBoNavigationNodes, 'name')
        } else return this.activeBoNavigationNodes
      },
      dialogCompetitionSelect: {
        get: function () {
          return store.getters['overlayState/getCompetitionSelectDialogState']
        },
        set: function (newVal) {
          if (newVal) {
            store.dispatch('overlayState/activateCompetitionSelectDialog')
          } else {
            store.dispatch('overlayState/deactivateCompetitionSelectDialog')
          }
        }
      },
      moreButtonState () {
        var linksInMoreTab = []
        for (var i = 0; i < this.sortedActiveBoNavigationNodes.length; i++) {
          var strIdfwbonavigation1 = this.idfwbonavigation1 && this.idfwbonavigation1.toString()
          var strIdfwbonavigation2 = this.idfwbonavigation2 && this.idfwbonavigation2.toString()
          if (i > (this.numberOfTabs - 1) && [strIdfwbonavigation1, strIdfwbonavigation2].indexOf(this.sortedActiveBoNavigationNodes[i].idfwbonavigation.toString()) > -1) {
            linksInMoreTab.push(i)
          }
        }
        if (linksInMoreTab.length > 0) {
          return 'active'
        }
      }
    },

    methods: {
      closeOverlays () {
        store.dispatch('overlayState/closeAll')
      },

      goToBoNavigation (idfwbonavigation) {
        this.userIsActive()
        switch (this.boNavLevel) {
          case 0:
            this.$router.push({name: 'bonavigation1', params: { idfwbonavigation1: idfwbonavigation }})
            break
          case 1:
            this.$router.push({name: 'bonavigation2', params: { idfwbonavigation1: this.idfwbonavigation1, idfwbonavigation2: idfwbonavigation }})
        }
      },
      initBoNavigation (idfwbonavigation) {
        if (this.boNavLevel === 0) {
          return {name: 'bonavigation1', params: { idfwbonavigation1: idfwbonavigation }}
        } else if (this.boNavLevel === 1) {
          return {name: 'bonavigation2', params: { idfwbonavigation1: this.idfwbonavigation1, idfwbonavigation2: idfwbonavigation }}
        }
      },
      openDialogCompetitionSelect () {
        store.dispatch('overlayState/activateCompetitionSelectDialog')
      },
      closeDialogCompetitionSelect () {
        store.dispatch('overlayState/deactivateCompetitionSelectDialog')
      }
    },
    created () {
      this.initBoNavigation()
    },
    mounted () {
      if (this.preselectFirstNode && this.activeBoNavigationNodes && this.activeBoNavigationNodes.length > 0 && !this.pIdfwbonavigation && !this.idfwbonavigation2) {
        this.goToBoNavigation(this.activeBoNavigationNodes[0].idfwbonavigation)
      }
    },

    watch: {
      activeBoNavigationNodes () {
        if (this.preselectFirstNode && this.activeBoNavigationNodes && this.activeBoNavigationNodes.length > 0 && !this.pIdfwbonavigation && !this.idfwbonavigation2) {
          this.goToBoNavigation(this.activeBoNavigationNodes[0].idfwbonavigation)
        }
      }
    }
  }
</script>
<style lang="stylus" scoped>
@import "~@/css/config"

.url-navigation .child-navigation .bo-navigation
  display: none
.place-holder
  height: 56px
  width: 100%
  @media mobile-big-and-below
    display: none

>>>.v-tabs__bar
   @media tablet-and-above
    margin-right: 24px
   @media mobile-big-and-below
    box-shadow: 0px -12px 12px #06283b
    background: none

>>>.with_more_btn
   @media mobile-big-and-below
      // margin-right: 30px
      >>>.v-tabs__container
          flex-wrap: nowrap
      >>>.v-tabs__div
          flex: auto !important

>>>.tabs__wrapper
  @media mobile-big-and-below
    padding-right: 0

@media mobile-big-and-below
  >>>.with_more_btn .tab
      position: relative
      z-index: 1
      white-space: nowrap
      flex: 1 !important
      a
        white-space: nowrap
  >>>.with_more_btn .tab.active
      z-index: 6 !important
  >>>.v-menu.v-tabs__div
      margin-left: auto
      background: #0e4fa2
      position: absolute
      right: 0
      top: 0
      z-index: 5

.more_tabs
  background: #fff
  border-radius: 60px
  text-align: center
  padding: 8px 16px
  height: 36px
  color: #0b4da1
  display: flex
  margin-top: 10px
  margin-left: 50px
  margin-right: 12px
  .v-icon
    display block !important 
    color #fff
  span
    font-size: 14px
    font-weight: normal
    line-height: 23px

.more_tabs_mobile
  margin-top: 20px
  margin-left: 10px
  display: flex
  >>>.igt-icon > span
    height: 18px
    width: 18px
    &:before
      -webkit-filter: blur(5px)
      -moz-filter: blur(5px)
      -o-filter: blur(5px)
      -ms-filter: blur(5px)
      filter: blur(5px)
      width: 30px
      height: 44px
      background-color: #06283b
      content: ''
      position: absolute
      z-index: 2
      right: 20px
      top: -15px

.open_competition_dialog
  display none !important // according new design, there is no this button
  position: absolute
  right 0px
  top: 0px
  z-index: 1
  height: 48px
  width: 30px
  // padding-left: 5px
  line-height: 48px
  background: #06283b
  -webkit-box-shadow: -20px 0 10px -4px rgba(21,42,71,0.85)
  -moz-box-shadow: -20px 0 10px -4px rgba(21,42,71,0.85)
  box-shadow: -20px 0 10px -4px rgba(21,42,71,0.85)
  >>>.igt-icon > span
    height: 18px
    width: 18px

.child-navigation
  @media mobile-big-and-below
    position: relative
    background: #0e4fa2

.dialog_header
  border-bottom: 1px solid #D5DBDF
  font-weight 600
  .left
    color: #818E95
    text-transform: uppercase
  .right
    text-align: right
    color: #2396FC
    font-size: 14px

.v-menu__activator--active .more_tabs
  background: #1493FF
.list
  padding: 0
  font-size: 14px
  color: #1F375B !important
  border-radius: 4px !important
 .list:hover
    border-radius: 4px !important

  .tab-li:hover
    border-radius: 4px

  >>>.v-list__tile
    color: #1F375B
    font-size: 14px
    &:hover
      color: #2396FC
      background: #fff !important
  .list_title
    flex: 1 1 auto

  .tab-li .igt-icon
      margin-left: auto
      visibility: hidden

  .tab-li.active
    >>>.v-list__tile
      color: #2396FC
      font-weight: bold
      background: #fff !important


>>>.tab a
  white-space: nowrap
</style>
