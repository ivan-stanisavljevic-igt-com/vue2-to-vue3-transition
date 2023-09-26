<template>
  <div class="listed-pitchers" v-if="pitchers">
      <div class="selectHolder">
      <select class="pitcherSelect" @click="setFocus()" v-model="selectedPitcher" @change="selectPitcher()" @blur="selectPitcher()"
              :disabled="currentBetSlipState>0" :class="{asMenu: currentBetSlipState==0}">
        <option v-for="pitcher in pitchers" :value="pitcher">
          <span >
            {{ $t('BetSlip.selection.listedPitcher.option.' + pitcher.pitcherhacode, {
            marketName:pitcher.market || pitcher.marketName,
            homePitcher: pitcher.homepitchername || $t('BetSlip.selection.listedPitcher.option.Home'),
            awayPitcher: pitcher.awaypitchername || $t('BetSlip.selection.listedPitcher.option.Away')}) }}
          </span>
        </option>
      </select>
      <v-select ref="vselect" v-model="selectedPitcher" :disabled="currentBetSlipState>0" class="customSelect" :class="{asMenu: currentBetSlipState==0}"
          :items="pitcherList"
          :label="$t('BetSlip.selection.listedPitcher.label')"
          :hint="(selectedPitcher.pitcherhacode === 'AP') ? $t('BetSlip.selection.listedPitcher.hintAction') : $t('BetSlip.selection.listedPitcher.hintSelected')"
          persistent-hint
        ></v-select>
      </div>
    <!--pitchers: {{pitchers.map(p=>p.pitcherhacode)}}<br>-->
    <!--active: {{pitchers.map(p=>p.active)}}<br>-->
  </div>

</template>

<script>
  import Vue from 'vue'
  import store from '@/store'
  import Screen from '@/components/mixins/Screen'

  export default {
    props: ['tab', 'id', 'marketName', 'currentBetSlipState', 'isFastBet'],

    components: {
    },
    mixins: [
      Screen
    ],
    data () {
      return {
        selectedPitcher: {},
        initedPitcher: false
      }
    },

    computed: {
      pitchers () {
        let pitchers = store.getters['sbBetslipState/getPitchersById'](this.id)
        return pitchers
      },
      activePitcher () {
        // Required when there are multiple instances, to sync them all (Fast Betslip and Regular Betslip)
        let active = this.pitchers && this.pitchers.find(function (p) {
          return p.active
        })
        return active || {}
      },
      pitcherList () {
        var self = this
        var items = []
        for (var i = 0; i < self.pitchers.length; i++) {
//          self.pitcherhacode = self.$t('BetSlip.selection.listedPitcher.option.' + self.pitchers[i].pitcherhacode)
          var item = {
            text: self.$t('BetSlip.selection.listedPitcher.option.' + self.pitchers[i].pitcherhacode, {
              marketName: self.pitchers[i].market || self.pitchers[i].marketName,
              homePitcher: self.pitchers[i].homepitchername || self.$t('BetSlip.selection.listedPitcher.option.Home'),
              awayPitcher: self.pitchers[i].awaypitchername || self.$t('BetSlip.selection.listedPitcher.option.Away')
            }),
            value: self.pitchers[i]
          }
          items.push(item)
        }
        return items
      }
    },

    methods: {
      setFocus () {
        this.$refs.vselect.$el.click()
        if (!this.mobileBigAndBelow) {
          try {
            document.querySelector('.menuable__content__active').click()
          } catch (err) {
          }
        }
      },
      selectPitcher () {
        event.currentTarget.blur()
        var activeContent = document.querySelector('.menuable__content__active')
        if (activeContent) {
          activeContent.click()
        }
      },
      setInitialPitcher (force) {
//        console.log('setInitialPitcher; initedPitcher: ' + this.initedPitcher + '; force: ' + force + '; isFastBet: ' + this.isFastBet)
//        console.log('selectedPitcher current: ' + this.selectedPitcher.pitcherhacode)
        if (this.pitchers && this.pitchers.length && (!this.initedPitcher || force)) {
          this.initedPitcher = true
          var active = this.pitchers.find(function (p) {
            return p.active
          })
          active = active || this.pitchers[0]
          Vue.set(active, 'active', true)
          Vue.set(this, 'selectedPitcher', active)
//          this.selectedPitcher = active
//          console.log('setInitialPitcher to: ' + this.selectedPitcher.pitcherhacode)
        }
      }
    },

    created () {
    },

    mounted () {
//      console.log('ListedPitcher mounted; isFastBet: ' + this.isFastBet)
      this.initedPitcher = this.initedPitcher || false
      this.setInitialPitcher()
    },

    watch: {
      pitchers: {
        immediate: true,
        handler (newVal, oldVal) {
//          console.log('Watch pitchers; isFastBet: ' + this.isFastBet)
          this.setInitialPitcher(newVal && newVal.length)
        }
      },
      selectedPitcher (newVal, oldVal) {
//        console.log('Watch selectedPitcher - scheduleGetABTnR:' + newVal.pitcherhacode + '; isFastBet: ' + this.isFastBet)
//        if (oldVal && oldVal.active && newVal && newVal.pitcherhacode && newVal.pitcherhacode !== oldVal.pitcherhacode) {
        if (oldVal) {
          Vue.set(oldVal, 'active', false)
        }
//        if (newVal && (newVal.market || !newVal.active)) {
        if (newVal) {
          Vue.set(newVal, 'active', true)
        }
//        console.log('set selectedPitcher to: ' + newVal.pitcherhacode)
        store.dispatch('sbBetslipState/scheduleGetABTnR', 0.000012)
      },
      activePitcher (newVal, oldVal) {
//        console.log('Watch activePitcher: ' + newVal.pitcherhacode + '; isFastBet: ' + this.isFastBet)
        if (newVal && newVal.pitcherhacode &&
          this.selectedPitcher && this.selectedPitcher.pitcherhacode &&
          this.selectedPitcher.pitcherhacode !== newVal.pitcherhacode) {
          Vue.set(this, 'selectedPitcher', newVal)
//          console.log('Watch activePitcher set selectedPitcher to: ' + newVal.pitcherhacode)
        }
      }
    },

    destroyed () {
    }
  }
</script>

<style lang="stylus" scoped>
@import "~@/css/config"
$image-base-url = '~@/assets/images/icon/svg/'

.listed-pitchers
  padding 0 0px
  >>>.input-group
    margin-bottom 10px
    margin-top 0px
    .input-group__input
      padding 25px 5px 0
      border-radius 4px 4px 0 0
  >>>.input-group__details
    background #f5f8fc
    color #818e95
    border-radius 0 0 4px 4px
    border-color #cfd6db
    border-style solid
    border-width 0 1px 1px 1px
    font-size 12px
    min-height 25px
    padding 0 5px
    line-height 25px
  >>>.input-group.input-group--text-field .input-group__input
    height unset
  >>>.input-group.input-group--text-field
    label
      color #1f375b
      font-size 12px
      left 6px
  >>>.input-group--select .input-group__selections__comma
      font-size 16px
      color #445058 !important
  >>>.input-group.input-group--text-field.input-group--open .input-group__input
    border-top: 1px solid #1493ff !important
    border-left: 1px solid #1493ff !important
    border-right: 1px solid #1493ff !important
    border-bottom: 1px solid #cfd6db !important
  >>>.input-group.input-group--text-field .input-group__input
    border-top: 1px solid #cfd6db !important
    border-left: 1px solid #cfd6db !important
    border-right: 1px solid #cfd6db !important
    border-bottom: 1px solid #cfd6db !important
  >>>.input-group.input-group--open .input-group__details
    border-top: 0px solid #cfd6db !important
    border-left: 1px solid #1493ff !important
    border-right: 1px solid #1493ff !important
    border-bottom: 1px solid #1493ff !important
   >>>.input-group .input-group__details
    border-left: 1px solid #cfd6db !important
    border-right: 1px solid #cfd6db !important
    border-bottom: 1px solid #cfd6db !important
  >>>.input-group--select .input-group__append-icon
    // background transparent url($image-base-url + 'chevron-down-blue.svg') center center no-repeat
    color transparent !important
    padding 0
  .selectHolder
    position relative
    .pitcherSelect
      position absolute
      top 0px
      bottom 0px
      left 0
      right 0
      width 100%
      z-index 2
      opacity 0
      &:focus
        bottom 27px
        @media mobile-big-and-below
          bottom 0

  .asMenu
    option
      font-size 16px
    &:focus
      border 0px !important
      outline none !important
.browser-internet-explorer
  .selectHolder
    .pitcherSelect
      height 100%

</style>
