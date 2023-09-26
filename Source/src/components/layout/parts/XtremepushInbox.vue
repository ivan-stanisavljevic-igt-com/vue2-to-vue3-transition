<template>
  <v-menu v-model="menu" offset-y :max-width="tabletAndAbove ? 300 : 255" :min-width="tabletAndAbove ? 300 : 255" :left="true" :bottom="true" origin="center" class="xtremepush-inbox" :content-class="menuContentClass">
    <v-btn @click="inboxClick(menu)" id="xtremepushInboxBtn" slot="activator" origin="center center" flat>
      <badge v-if="xtremepushInboxBadgeCounter && xtremepushInboxBadgeCounter > 0">{{ xtremepushInboxBadgeCounter }}</badge>
<!--      <icon name="icon-inbox" :colorName="this.menu && tabletAndAbove ? 'dark' : 'white'"></icon>-->
      <div class="icon-mail"><v-icon>mail_outline</v-icon></div>
    </v-btn>
    <div v-if="!MobilelocalServer" class="inbox-container">
      <div class="inbox_header">
        <v-layout align-center>
          <v-flex class="titleInbox" xs6>
            {{ $t('XtremePush.Inbox') }}
          </v-flex>
          <v-flex xs6>
            <v-btn class="cancelMenuBtn" flat @click="menu = false">{{ $t('XtremePush.Inbox.Close') }}</v-btn>
          </v-flex>
        </v-layout>
      </div>
      <div v-if="xtremepushMessageList && xtremepushMessageList !== undefined && xtremepushMessageList.length > 0" class="inbox_wrapper" ref="inboxWrapperElement">
        <div class="inbox_details"
             v-for="(item, index) in xtremepushMessageList"
             :key="index"
             :campaign-id="item.message.cid"
             :id="item.id"
             :class="item.opened === 1 ? 'opened' : ''">
          <div class="item-container">
            <div class="clickable-inbox" @click="inboxMessageClickedOrClosed(item, 'open')">
              <div v-if="item.message && item.message.icon" class="item item-1">
                <img class="message-icon" :src="item.message.icon">
              </div>
              <div class="item item-2" :class="{ 'remove-pl': !item.message.icon }">
                <p v-if="item.message.title" class="inbox-item-title" v-html="item.message.title"></p>
                <p v-if="item.message.alert" class="inbox-item-text" v-html="item.message.alert"></p>
              </div>
            </div>
            <div class="item item-3">
<!--              <img @click="inboxMessageClickedOrClosed(item, 'click')" src="@/assets/images/icon/svg/cross-blue.svg">-->
              <v-icon class="close-icon" @click="inboxMessageClickedOrClosed(item, 'click')">close</v-icon>
            </div>
          </div>
          <div class="source-and-date">
            <span v-if="item.message.source">{{item.message.source}} ·</span>
            <span v-if="item.create_time">{{inboxFormatDate(item.create_time)}}</span>
          </div>
        </div>
      </div>
      <div v-else class="emptyXTList">
        <p v-html="$t('XtremePush.Inbox.Empty')"></p>
      </div>
    </div>
  </v-menu>
</template>

<script>
import store from '@/store'
import config from '@/config'
import moment from 'moment'
import Screen from '@/components/mixins/Screen'
import Icon from '@/components/common/Icon'
import Badge from '@/components/common/Badge'
import Xtremepush from '@/components/mixins/Xtremepush'
import mobileBridge from '@/library/mobileBridge'

export default {
  name: 'XtremepushInbox',

  mixins: [
    Screen,
    Xtremepush
  ],

  components: {
    Icon,
    Badge
  },

  data () {
    return {
      inboxCounter: 0,
      menu: false,
      scrolledToTop: false
    }
  },

  computed: {
    xtremepushInboxBadgeCounter () {
      return store.getters['getXtremepushInboxBadgeCounter']
    },
    xtremepushMessageList () {
      return store.getters['getXtremepushMessageList']
    },
    headerMessageState () {
      return store.getters['overlayState/getHeaderMessageState']
    },
    menuContentClass () {
      let contentClass = ''
      if (this.tabletAndAbove && this.menu) {
        if (this.isScrolled) {
          contentClass = 'fix-position'
        } else if (this.scrolledToTop) {
          contentClass = 'inherit-native-top'
        }
        return `xtremepush_menu inbox-menu ${contentClass}`
      } else {
        if (this.menu) {
          if (this.headerMessageState) {
            contentClass = 'fix-mobile-position'
          } else if (this.isScrolled && !this.headerMessageState) {
            contentClass = 'fix-mobile-scroll'
          } else if (this.scrolledToTop && !this.headerMessageState && !this.isScrolled) {
            contentClass = 'inherit-native-top'
          } else if (this.scrolledToTop && this.headerMessageState) {
            contentClass = 'fix-mobile-position'
          }
        }
        let headerMsgClass = this.headerMessageState ? 'headerMsg' : 'noHeaderMsg'
        return `xtremepush_menu inbox-menu ${contentClass} ${this.mobileBigAndBelow ? headerMsgClass : ''}`
      }
    },
    isMenuActive () {
      return this.menu
    },
    MobilelocalServer () {
      return window.ctsautoconf.MOBILE_LS || false
    }
  },

  methods: {
    inboxClick (isActive) {
      if ((config.app.autoconf.XTREMEPUSH_ANALYTICS && config.app.autoconf.XTREMEPUSH_ANALYTICS.MOBILE_APP && window.ctsautoconf.MOBILE_LS)) {
        mobileBridge.bridgeSendRequest('openInbox')
        return false
      }
      if (!isActive) {
        this.onXtremepushMessageList()
      }
    },
    inboxMessageClickedOrClosed (data, action) {
      this.onXtremepushMessageClickedOrDismissed(data.id, action)
      if (action && action === 'open' && (data && data.message && data.message.deeplink)) {
        this.openXtremepushLink(data.message.deeplink)
      }
    },
    inboxFormatDate (timestamp) {
      return moment.unix(timestamp).format('DD/MM/YYYY, HH:mm:ss a')
    }
  },
  mounted () {},
  watch: {
    isMenuActive (newVal) {
      if (!newVal && !this.MobilelocalServer) {
        if (this.xtremepushMessageList.length === 0 || !this.xtremepushMessageList) return false
        setTimeout(() => {
          this.$refs.inboxWrapperElement.scrollTop = `0px`
        }, 450)
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '~@/css/config'
@import '~@/css/mixins'
.v-menu__content
  z-index 1000 !important
  margin-left 10px
  @media mobile-big-and-below
    &:before
      display none
.inbox-container
  position relative
  z-index 10001
  top 0px
  .inbox_header
    border-bottom: 1px solid #C9D1DB
    background: #FFFFFF
    .layout
      .titleInbox
        color #003764
        font-size 16px
        font-weight normal
        font-family 'Open Sans Regular'
        @media mobile-big-and-below
          font-size 14px
      .cancelMenuBtn
        margin 0
        height auto
        min-width auto
        margin-left auto
        display block
        color #1d9add
        font-size 16px
        font-weight normal
        font-family 'Open Sans Regular'
        padding 0
        @media mobile-big-and-below
          font-size 14px
        >>>.btn__content
          padding 0

  .emptyXTList
    background #f0f3f8
    min-height 400px
    display grid
    place-items center
    text-align center
    @media mobile-big-and-below
      min-height 280px
    p
      font-size 16px
      font-weight normal
      font-family 'Open Sans Bold'
      color #818e95
      @media mobile-big-and-below
        font-size 14px

  .inbox_wrapper
    overflow-y scroll
    max-height 385px
    &::-webkit-scrollbar
      display none
  .inbox_details, .inbox_header
    padding 10px 10px 5px 10px
    color: #20385A
    background: #FFFFFF
  .inbox_header
    padding 13px 16px
    @media mobile-big-and-below
      padding 10px 13px
  .inbox_details
    display flex
    flex-direction column
    justify-content center
    align-items flex-start
    gap 7px
    border-bottom 1px solid #c9d1db
    @media mobile-big-and-below
      padding 10px 13px
      gap 2px
    &.opened
      background #f2f2f2
    .source-and-date
      font-size 12px
      line-height normal
      text-transform uppercase
      color #1d9add
      letter-spacing 0
      @media mobile-big-and-below
        font-size 10px
    .message-icon
      display: flex
      align-items: flex-start

  .item-container
    display flex
    flex-direction row
    width 100%
    gap 2px
    min-height 62px
    @media mobile-big-and-below
      min-height 62px

    .clickable-inbox
      display flex
      width 100%
      cursor pointer

    .item
      line-height 1
      text-align center
      flex-grow 1
    .item-1
      flex-grow 2
      img
        width 54px
        height 54px
        border-radius 4px
        object-fit cover
        @media mobile-big-and-below
          width 50px
          height 50px
    .item-2
      flex-grow 4
      flex-basis 100%
      text-align left
      padding-left 5px
      &.remove-pl
        padding-left 0
      .inbox-item-title
        font-weight normal
        font-family 'Open Sans Bold'
        font-size 14px
        color #05285a
        margin-bottom 5px
        @media mobile-big-and-below
          font-size 14px
      .inbox-item-text
        font-weight normal
        font-family 'Open Sans Regular'
        font-size 12px
        color #05285a
        line-height 125%
        @media mobile-big-and-below
          font-size 12px
    .item-3
      cursor pointer
      .close-icon
        color transparent !important
        background-image: url('~@/assets/images/icons/icon-close-grey.svg')
        height 15px
        width 15px

@media tablet-and-above
  >>>.menu__activator--active
    #xtremepushInboxBtn
      .btn__content
        background #fff

>>>.badge
  display inline-flex !important
  min-width 18px !important
  min-height 18px !important
  width 18px !important
  height 18px !important
  position absolute
  top -9px
  right -2px
  @media mobile-big-and-below
    right 0px
  span
    display inline !important
    font-size 12px
#xtremepushInboxBtn
  margin 0 10px 0 0
  padding: 0
  @media mobile-big-and-below
    margin 0
  .badge
    background #ff9016
    font-weight normal
    font-family 'Open Sans Regular'
  &:hover:before,
  &:focus:before
    opacity 0 !important
.icon-mail
  .v-icon
    color transparent  !important
    background url('~@/assets/images/icons/icon-mail-white.svg') center no-repeat
    width: 30px
    height: 25px
    display: block
</style>
