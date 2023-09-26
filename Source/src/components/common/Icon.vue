<template>
<span>
  <span v-if="brandLayout !=='generic'" class="igt-icon" :class="[{'background': background}, {'img': mode === 'img'}, 'color-'.concat(colorName), {'count': count > 0}]">
    <img v-if="mode === 'img'" class="img" :src="name" alt="Icon">
    <span v-if="mode === 'css'" class="css" :class="className" :style="styleObject"></span>
    <badge v-if="count > 0" :class="['badgeIconLive', {'small' : moreThanHundredLiveEvents}]">{{count}}</badge>
  </span>
  <span v-if="brandLayout === 'generic'"  class="igt-icon" :class="[{'background': background}, {'img': mode === 'img'}, 'color-'.concat(colorName), {'count': count > 0}]">
    <img v-if="mode === 'img'" class="img" :src="name" alt="Icon">
    <span v-if="mode === 'css'" class="css font-icon" :class="'font-'+className" :style="styleObject"></span>
    <badge v-if="count > 0" :class="['badgeIconLive', {'small' : moreThanHundredLiveEvents}]">{{count}}</badge>
  </span>
</span>
</template>

<script>
import Badge from '@/components/common/Badge'
import Branding from '@/components/mixins/Branding'

export default {
  name: 'Icon',

  components: {
    Badge
  },

  data () {
    return {
    }
  },
  mixins: [
    Branding
  ],
  props: {
    mode: {
      type: String,
      default: 'css'
    },

    name: {
      type: String,
      default: ''
    },

    background: {
      type: Boolean,
      default: false
    },

    colorName: {
      type: String,
      default: 'dark'
    },

    count: {
      type: Number,
      default: 0
    },

    isFromSiteNavigation: {
      type: Boolean
    }
  },

  computed: {
    className () {
      return this.isClass(this.name) ? this.name.toLowerCase() : ''
    },

    styleObject () {
      return this.isClass(this.name) ? {} : {backgroundImage: 'url("' + this.name + '")'}
    },

    moreThanHundredLiveEvents () {
      if (this.isFromSiteNavigation && this.count >= 100) {
        return true
      } else return false
    }
  },

  methods: {
    isClass (value) {
      return value.indexOf('icon-') === 0
    }
  },

  created () {

  }
}
</script>

<style scoped lang="stylus">
  @import "~@/css/config"

  .igt-icon
    display: inline-block
    line-height: 0
    vertical-align: middle

    > span
      display: inline-block
      background-position: center
      background-size: 100%
      width: 16px
      height: 16px

    &.background
      background-color: #0E1929;
      height: 28px;
      width: 28px;
      align-items: center
      display: inline-flex
      justify-content: center
      border-radius: 50%

      .active &,
      .router-link-active &
        background-color: #2396FC

      for name in icon-names
        .icon-{name}
          background-image: url(svg-path'/'name'-white.svg')

    for name in icon-names
      &.color-dark .icon-{name},
      .icon-{name}
        background-image: url(svg-path'/'name'.svg')
      .icon-{name}-2
        background-image: url(svg-path'/'name'.svg')

      &.color-white .icon-{name}
        background-image: url(svg-path'/'name'-white.svg')

      &.color-blue .icon-{name}
        background-image: url(svg-path'/'name'-blue.svg')

    for name in icon-names
      .icon-{name}
        background-image: url(svg-path'/'name'-lightgrey.svg')

    for name in social-icon-names
      .icon-{name}
        background-image: url(svg-path'/social/'name'.svg')

  &.count
    .css, .img
      display: none
  .icon-trash
    background-image: url(icons-path'/'bin_icon'.svg')
  .icon-trash-white
    background-image: url(icons-path'/'bin_icon_white'.svg')
  .icon-trash-grey
    background-image: url(icons-path'/'bin_icon_grey'.svg')
  .icon-trash-darkgrey
    background-image: url(icons-path'/'bin_icon_darkgrey'.svg')

  .icon-available-for-bb, .icon-available-for-bb-black
    background-image: url(icons-path'/'available-for-bb'.svg')
  .icon-available-for-bb-white
    background-image: url(icons-path'/'available-for-bb_white'.svg')
  .icon-available-for-bb-blue
    background-image: url(icons-path'/'available-for-bb_blue'.svg')

  .icon-user-black
    background-image: url(icons-path'/'icon-user-black'.svg')
  .icon-user-white
    background-image: url(icons-path'/'icon-user-white'.svg')
  .icon-close-grey
    background-image: url(icons-path'/'icon-close-grey'.svg')
  .icon-close-white
    background-image: url(icons-path'/'icon-close-white'.svg')
  .icon-user-loggedin
    background-image: url(icons-path'/'icon-user-loggedin'.svg')
  .icon-search
    background-image: url(icons-path'/'search'.svg')
  .icon-search-white
    background-image: url(icons-path'/'search-white'.svg')
  .icon-search-black
    background-image: url(icons-path'/'search-black'.svg')
  .font-icon-copy-black
  .icon-copy-black
    background-image: url(icons-path'/'copy-black'.svg')
    width 16px !important
    height 25px !important
  .font-icon-copy-white
  .icon-copy-white
    background-image: url(icons-path'/'copy-white'.svg')
    width 16px !important
    height 25px !important
  .font-icon-copy-darkblue
  .icon-copy-darkblue
    background-image: url(icons-path'/'copy-darkblue'.svg')
    width 16px !important
    height 25px !important


  /***** Racing *****/
  .icon-greyhound
    background-image: url(images-path'/'/images/racing/all_racing/icon-greyhound'.svg')
  .icon-harness
    background-image: url(images-path'/'/images/racing/all_racing/icon-harness'.svg')
  .icon-arabian
    background-image: url(images-path'/'/images/racing/all_racing/icon-arabian'.svg')
  .icon-jaialai
    background-image: url(images-path'/'/images/racing/all_racing/icon-jaialai'.svg')
  .icon-others
    background-image: url(images-path'/'/images/racing/all_racing/pm-other'.svg')
  .icon-quarter
    background-image: url(images-path'/'/images/racing/all_racing/icon-quarter'.svg')
  .icon-thoroughbred
    background-image: url(images-path'/'/images/racing/all_racing/icon-thoroughbred'.svg')

  /**** Leagues *****/
  .font-icon-nflleague
  .icon-nflleague
    background-image: url(svg-path'/'/leagues/nflleague'.svg')
  .font-icon-nbaleague
    background-image: url(svg-path'/'/leagues/nbaleague'.svg')
    width: 14px !important
    height: 35px !important
    margin-left: 2px
    margin-right: 2px
  .icon-nbaleague
    background-image: url(svg-path'/'/leagues/nbaleague'.svg')
    width: 15px !important
    height: 35px !important
    margin-left: 2px
    margin-right: 2px

  /* Account summary flow*/
  .icon-acc-summary
    background-image url(images-path'/'/images/accounting/summary'.svg')
    height: 25px !important
    width: 17px !important
  .icon-acc-settings
    background-image url(images-path'/'/images/accounting/settings'.svg')
    height: 25px !important
    width: 25px !important
  .icon-acc-raf
    background-image url(images-path'/'/images/accounting/raf'.svg')
    height: 25px !important
    width: 25px !important
  .icon-acc-verification
    background-image url(images-path'/'/images/accounting/verification'.svg')
    height: 25px !important
    width: 25px !important
  .icon-acc-promotions
    background-image url(images-path'/'/images/accounting/promo-darkblue'.svg')
    height: 25px !important
    width: 25px !important
  .icon-acc-rg
    background-image url(images-path'/'/images/accounting/responsible_gaming'.svg')
    height: 25px !important
    width: 17px !important
  .icon-acc-rg-stop
    background-image url(images-path'/'/images/accounting/responsible_gaming'.svg')
    height: 25px !important
    width: 17px !important
  .icon-active-bets
    background-image url(images-path'/'/images/accounting/active_bets'.svg')
    height: 25px !important
    width: 22px !important
  .icon-settled-bets
    background-image url(images-path'/'/images/accounting/settled_bets'.svg')
    height: 25px !important
    width: 22px !important
  .icon-tx-history
    background-image url(images-path'/'/images/accounting/tx_history'.svg')
    height: 25px !important
    width: 25px !important
  .icon-w2g
    background-image url(images-path'/'/images/accounting/w2g'.svg')
    height: 25px !important
    width: 20px !important
  .icon-logout
    background-image url(images-path'/'/images/accounting/logout'.svg')
    height: 22px !important
    width: 20px !important
  .icon-close-account
    background-image url(images-path'/'/images/accounting/close_account'.svg')
    height: 25px !important
    width: 22px !important
  .icon-boost
    width 18px !important

</style>
