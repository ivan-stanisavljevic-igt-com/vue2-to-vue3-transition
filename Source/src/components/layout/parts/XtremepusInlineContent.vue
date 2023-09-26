<!-- Type: Identifies which type of message should show: -->
<!-- 1 - Text Only -->
<!-- 2 - Text&Image -->
<!-- 3 - Text, Image & Button -->
<!-- 4 - Image Only -->

<!-- Priority: The priority order of the message in situations where users are eligible for more than one -->
<!-- 1 - Top Priority -->
<!-- 2 - Second Priority -->
<!-- 3 - Third Priority -->

<template>
  <div class="inline-content-container" :class="{'all_sport_section': this.section === 'all_sports'}">
    <template v-for="data in filteredData">
      <section
        v-if="data.onsite_data.type && parseInt(data.onsite_data.type) === 1"
        :data-cid="data.cid"
        :data-id="data.id"
        :data-banner-type="data.onsite_data.type"
        :data-priority="data.onsite_data.priority"
        :class="[data.onsite_data.background_color ? data.onsite_data.background_color.toLowerCase() : 'fd_blue']"
        class="inline-content-section inline-content-text-only"
      >
        <div v-if="data.onsite_data.dismiss_on_click" class="dismiss">
          <v-btn flat class="close">
            <v-icon @click="onDismiss(data)">close</v-icon>
          </v-btn>
        </div>
        <div @click="onContentClick(data)" class="inline-content">
          <div class="content-text">
            <span
              v-if="data.onsite_data.lead_text
              && typeof data.onsite_data.lead_text === 'string'"
              class="text-only">
                {{ data.onsite_data.lead_text }}
            </span>
            <span
              v-if="data.onsite_data.secondary_text
              && typeof data.onsite_data.lead_text === 'string'"
              class="secondary-text">
                {{ data.onsite_data.secondary_text }}
            </span>
          </div>
        </div>
      </section>

      <section
        v-if="data.onsite_data.type && parseInt(data.onsite_data.type) === 2"
        :data-cid="data.cid"
        :data-id="data.id"
        :data-banner-type="data.onsite_data.type"
        :data-priority="data.onsite_data.priority"
        :class="[data.onsite_data.background_color ? data.onsite_data.background_color.toLowerCase() : 'fd_blue']"
        class="inline-content-section inline-content-text-image"
      >
        <div v-if="data.onsite_data.dismiss_on_click" class="dismiss">
          <v-btn flat class="close">
            <v-icon @click="onDismiss(data)">close</v-icon>
          </v-btn>
        </div>
        <div @click="onContentClick(data)" class="inline-content">
          <div class="content-text">
            <span
              v-if="data.onsite_data.lead_text
              && typeof data.onsite_data.lead_text === 'string'"
              class="text-image-only">
                {{ data.onsite_data.lead_text }}
            </span>
            <span
              v-if="data.onsite_data.secondary_text
              && typeof data.onsite_data.secondary_text === 'string'"
              class="secondary-text">
                {{ data.onsite_data.secondary_text }}
            </span>
          </div>
        </div>
      </section>

      <section
        v-if="data.onsite_data.type && parseInt(data.onsite_data.type) === 3"
        @click="onContentClick(data, 'section')"
        :data-cid="data.cid"
        :data-id="data.id"
        :data-banner-type="data.onsite_data.type"
        :data-priority="data.onsite_data.priority"
        :class="[data.onsite_data.background_color ? data.onsite_data.background_color.toLowerCase() : 'fd_blue']"
        class="inline-content-section inline-content-text-image-button"
      >
        <div v-if="data.onsite_data.dismiss_on_click" class="dismiss">
          <v-btn flat class="close">
            <v-icon @click.stop="onDismiss(data)">close</v-icon>
          </v-btn>
        </div>
        <div class="inline-content">
          <div class="content-text">
            <span
              v-if="data.onsite_data.lead_text
              && typeof data.onsite_data.lead_text === 'string'"
              class="lead-text">
                {{ data.onsite_data.lead_text }}
            </span>
            <span
              v-if="data.onsite_data.secondary_text
              && typeof data.onsite_data.secondary_text === 'string'"
              class="secondary-text">
                {{ data.onsite_data.secondary_text }}
            </span>
          </div>
          <v-btn
            v-if="data.onsite_data.button"
            @click.stop="onContentClick(data, 'button')"
            :class="[{'set-small-margin': data.onsite_data.dismiss === 'never' && mobileBigAndBelow}]"
            class="content-button"
          >
              {{ data.onsite_data.button.button_text }}
          </v-btn>
        </div>
      </section>

      <section
        v-if="data.onsite_data.type && parseInt(data.onsite_data.type) === 4"
        :data-cid="data.cid"
        :data-id="data.id"
        :data-banner-type="data.onsite_data.type"
        :data-priority="data.onsite_data.priority"
        :class="[data.onsite_data.background_color ? data.onsite_data.background_color.toLowerCase() : 'fd_blue']"
        class="inline-content-section inline-content-image-only"
      >
        <div v-if="data.onsite_data.dismiss_on_click" class="dismiss">
          <v-btn flat class="close">
            <v-icon @click="onDismiss(data)">close</v-icon>
          </v-btn>
        </div>
        <div @click="onContentClick(data)" class="inline-content">
          <div class="content-text">
            <span
              v-if="data.onsite_data.lead_text
              && typeof data.onsite_data.lead_text === 'string'"
              class="image-only"
            >
              {{ data.onsite_data.lead_text }}
            </span>
          </div>
        </div>
      </section>
    </template>
  </div>
</template>
<script>
import store from '@/store'
import BettingOffer from '@/components/mixins/BettingOffer'
import Icon from '@/components/common/Icon'
import Screen from '@/components/mixins/Screen'
// import moment from 'moment'
import Xtremepush from '@/components/mixins/Xtremepush'
import lib from '@/library'
import mobileBridge from '@/library/mobileBridge'
export default {
  name: 'XtremepushInlineContent',
  data () {
    return {
      filteredData: [],
      sortedByPriorityAndFilterBySection: [],
      // originalDataFromMobileApp: [],
      dismissedItems: [],
      deliveredItems: []
    }
  },
  props: [
    'sportType',
    'section'
  ],
  mixins: [
    BettingOffer,
    Screen,
    Xtremepush
  ],
  components: {Icon},
  computed: {
    xtremepushInlineContent () {
      return store.getters['getXtremepushInlineContent']
    },
    MobilelocalServer () {
      return window.ctsautoconf.MOBILE_LS || false
    },
    userAgent () {
      return lib.core.userAgent.os.name
    },
    isLoggedIn () {
      return store.getters['isLoggedIn']
    }
  },
  methods: {
    sortByPriorityAndSection () {
      let XPinlineContent = this.xtremepushInlineContent
      console.log('xtreme XPinlineContent', XPinlineContent)
      for (const msg in XPinlineContent) {
        let eachMsg = XPinlineContent[msg]
        let onSiteDataParse = null
        if (this.MobilelocalServer) {
          onSiteDataParse = eachMsg['inapp_data']
          eachMsg = {
            'cid': eachMsg.cid,
            'id': eachMsg.id,
            'onsite_data': eachMsg['inapp_data']
          }
        } else {
          onSiteDataParse = eachMsg['onsite_data'] instanceof Object ? eachMsg['onsite_data'] : JSON.parse(eachMsg['onsite_data'])
          eachMsg['onsite_data'] = onSiteDataParse
        }
        let isPresent = this.sortedByPriorityAndFilterBySection.some(function (el) { return el.id === eachMsg.id })
        if (!isPresent) this.sortedByPriorityAndFilterBySection.push(eachMsg)
      }
      this.sortedByPriorityAndFilterBySection = this.sortedByPriorityAndFilterBySection.sort((a, b) => { return parseInt(a.onsite_data.priority) - parseInt(b.onsite_data.priority) }).filter(msg => msg.onsite_data.placements.includes(this.section))
      if (!this.isLoggedIn) { // skip banners with login session required
        this.sortedByPriorityAndFilterBySection = this.sortedByPriorityAndFilterBySection.filter((msg) => msg.onsite_data.loggedIn === 'false' || !msg.onsite_data.loggedIn)
      }
      this.filterInlineContent()
    },
    filterInlineContent () {
      let XPinlineContent = this.sortedByPriorityAndFilterBySection
      this.filteredData = []
      for (const msg in XPinlineContent) {
        let eachMsg = XPinlineContent[msg]
        if (parseInt(eachMsg.onsite_data.priority) === 1) {
          this.filteredData.push(eachMsg)
          if (this.section === 'under_coupon_tabs') this.logEventToXtremepushOrSendToMobileApp('delivered', eachMsg)
          if (this.section === 'all_sports') this.passDataToParentComponent(eachMsg)
          return false
        } else if (parseInt(eachMsg.onsite_data.priority) === 2) {
          this.filteredData.push(eachMsg)
          if (this.section === 'under_coupon_tabs') this.logEventToXtremepushOrSendToMobileApp('delivered', eachMsg)
          if (this.section === 'all_sports') this.passDataToParentComponent(eachMsg)
          return false
        } else if (parseInt(eachMsg.onsite_data.priority) === 3) {
          this.filteredData.push(eachMsg)
          if (this.section === 'under_coupon_tabs') this.logEventToXtremepushOrSendToMobileApp('delivered', eachMsg)
          if (this.section === 'all_sports') this.passDataToParentComponent(eachMsg)
          return false
        } else {
          this.filteredData.push(eachMsg)
          if (this.section === 'under_coupon_tabs') this.logEventToXtremepushOrSendToMobileApp('delivered', eachMsg)
          if (this.section === 'all_sports') this.passDataToParentComponent(eachMsg)
          return false
        }
      }
    },
    onContentClick (data, area = false) {
      this.logEventToXtremepushOrSendToMobileApp('opened', data)
      if (data && data.onsite_data && data.onsite_data.type && parseInt(data.onsite_data.type) === 1 && data.onsite_data.url) this.openXtremepushLink(data.onsite_data.url)
      if (data && data.onsite_data && data.onsite_data.type && (parseInt(data.onsite_data.type) === 2 || parseInt(data.onsite_data.type) === 4) && data.onsite_data.cta) this.openXtremepushLink(data.onsite_data.cta)
      if (data && data.onsite_data && data.onsite_data.type && parseInt(data.onsite_data.type) === 3 && data.onsite_data.button && data.onsite_data.button.button_cta) {
        if (area && area === 'button') this.openXtremepushLink(data.onsite_data.button.button_cta)
        if (area && data.onsite_data.cta && area === 'section') this.openXtremepushLink(data.onsite_data.cta)
      }
    },
    onDismiss (data) {
      let eachMsg = this.xtremepushInlineContent
      store.commit('setXtremepushInlineContent', false)
      this.filteredData = []
      this.sortedByPriorityAndFilterBySection = []
      for (const m in eachMsg) {
        if (eachMsg[m].id !== data.id) {
          store.commit('setXtremepushInlineContent', eachMsg[m])
        }
      }
    },
    logEventToXtremepushOrSendToMobileApp (action, data) {
      if (action === 'delivered' && this.deliveredItems.includes(data.id)) return false
      this.deliveredItems.push(data.id)
      if (window.xtremepush) window.xtremepush('message', action, data.id, null)
      if (this.MobilelocalServer) {
        if (action === 'delivered') mobileBridge.bridgeSendRequest(data.id, 'reportInlineMessageDelivered')
        if (action === 'opened') mobileBridge.bridgeSendRequest(data.id, 'reportInlineMessageClicked')
      }
    },
    passDataToParentComponent (data) { // delivered event should be triggered when user open navigation drawer - all sports
      this.$emit('xtremepushInlineContentToAllSportsNavigationDrawer', data)
    }
  },
  mounted () {
    if (this.xtremepushInlineContent) {
      this.sortByPriorityAndSection()
    }
  },
  watch: {
    xtremepushInlineContent (newVal) {
      if (newVal) {
        this.sortByPriorityAndSection()
      }
    },
    isLoggedIn (newVal) {
      if (newVal) {
        this.sortByPriorityAndSection()
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped>
@import "~@/css/config"

.inline-content-container
  margin 5px 0
  &.all_sport_section
    margin 45px -15px 5px -15px
    .inline-content-section
      .inline-content
        padding-left 5px
        .content-text
          .lead-text,
          .secondary-text
            font-size 16px
      .dismiss
        right 1px
        .v-btn.close
          top inherit
          right inherit
          .v-btn__content
            .v-icon
              font-size 14px
              height auto
              width auto
              background-image none
              color #fff !important
  .inline-content-section
    position relative
    height 55px
    flex-shrink 0
    display flex
    margin auto
    width 100%
    border-radius 2px
    @media mobile-big-and-below
      height 37px
    .inline-content
      //background-image: url("~@/assets/images/xp-placeholder.svg")
      width 100%
      display flex
      justify-content space-between
      background-position center
      background-repeat no-repeat
      padding-left 30px
      @media mobile-big-and-below
        padding-left 5px
      .text-only,
      .text-image-only
        //font-family font-family-knockout69
        color #FFF
        font-weight 600
        text-align center
        font-size 32px
        font-style normal
        line-height 125%
        margin-right 10px
        @media mobile-big-and-below
          font-size 18px
          line-height 100%
          margin-right 5px
      .content-text, .content-button
        display flex
        align-items center
        //font-family font-family-knockout69
        .lead-text
          color #FFF
          font-weight 600
          text-align center
          font-size 32px
          font-style normal
          line-height 125%
          margin-right 10px
          @media mobile-big-and-below
            font-size 16px
            line-height 100%
            margin-right 5px
        .secondary-text
          font-weight 600
          color #FFE043
          font-size 32px
          font-style normal
          line-height 125%
          @media mobile-big-and-below
            font-size 16px
            line-height 100%
      .content-button
        min-width 141px
        height 39px
        border-radius 2px
        background #FFE043
        color: #001C55
        text-align center
        font-size 24px
        font-style normal
        font-weight bold
        line-height 125%
        margin auto 30px auto
        @media mobile-big-and-below
          margin auto 20px auto 0
          min-width auto
          height 28px
          line-height 100%
          font-size 14px
          padding 0 6px
          &.set-small-margin
            margin auto 10px auto 0
          >>>.v-btn__content
            padding 0
    .dismiss
      position absolute
      top 5px
      right 5px
      line-height initial
      @media mobile-big-and-below
        top 1px
        right 2px
    .v-btn.close
      height auto
      min-width auto
      margin 0
      padding 0
      >>>.v-btn__content
        padding 0
        .v-icon
          font-size 18px
          font-weight initial
          @media mobile-big-and-below
            font-size 14px
  .fd_blue
    background linear-gradient(135deg, #0078FF 0%, #004199 55.74%, #001C55 100%)
  .fd_navy
    background linear-gradient(135deg, #001C55 0%, #004199 55.74%, #001C55 100%)
  .fd_yellow
    background linear-gradient(135deg, #FFDC2E 0%, #004199 55.74%, #001C55 100%)
  .fd_casino_purple
    background linear-gradient(135deg, #61019B 0%, #004199 55.74%, #001C55 100%)
  .fd_casino_teal
    background linear-gradient(135deg, #47F3FF 0%, #004199 55.74%, #001C55 100%)
  .fd_white
    background linear-gradient(135deg, #FFFFFF 0%, #004199 55.74%, #001C55 100%)
  .white
    background linear-gradient(135deg, #FFFFFF 0%, #004199 55.74%, #001C55 100%)

</style>
