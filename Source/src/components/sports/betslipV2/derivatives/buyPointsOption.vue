<template>
  <div class="by-points-option" v-if="buyPointsSelections.length">
    <div class="selectHolder">
      <select class="selectedPoint" @click="setFocus()" v-model="selectedPoint" @change="selectPoint()" @blur="selectPoint()"
              :disabled="currentBetSlipState>0" :class="{asMenu: currentBetSlipState==0}">
        <option v-for="point in buyPointsItems" :value="point.value">
            <span >
              {{point.text}}
            </span>
        </option>
      </select>

      <v-select v-model="selectedPoint" @click.stop="doNothing()" :disabled="currentBetSlipState>0" class="customSelect" :class="{asMenu: currentBetSlipState==0}"
                :items="buyPointsItems"
                :label="buyPointsLabel"
      ></v-select>

    </div>
    <!--buyPointsItems: {{buyPointsItems.map(p=>p.value.currenthandicap)}}<br>-->
    <!--active: {{buyPointsItems.map(p=>p.value.active)}}<br>-->
    <!--buyPointsItems: {{buyPointsItems}}<br>-->
    <!--buyPointsSelections: {{buyPointsSelections}}<br>-->
  </div>
</template>
<script>
  import Vue from 'vue'
  import store from '@/store'
  import hcpFormat from '@/library/hcpFormat'
  //
  export default {
    props: ['tab', 'id', 'selection', 'currentBetSlipState', 'isFastBet'],

    data () {
      return {
        inited: false,
        selectedPoint: {}
      }
    },

    components: {
    },

    computed: {
      sourceHandicap () {
        return this.formatHCP(this.selection)
      },
      buyPointsLabel () {
        return this.$t('BetSlip.selection.buyPoints.option.label')
      },
      buyPointsSelections () {
        let buyPointsSelections = store.getters['sbBetslipState/getBuyPointsSelectionsById'](this.id, this.tab)
        return buyPointsSelections || []
      },
      activeOption () {
        let active = this.buyPointsSelections && this.buyPointsSelections.find(function (p) {
          return p.active
        })
        return active || {}
      },
      buyPointsItems () {
        if (!this.buyPointsSelections.length) {
          return
        }
        var self = this
        //
        var items = [
          {
            text: '+0 (' + self.sourceHandicap + ')',
            value: self.selection
          }
        ]
        for (var i = 0; i < self.buyPointsSelections.length; i++) {
          let buyPointsSelection = self.buyPointsSelections[i]
          let hcp = self.formatHCP(buyPointsSelection)
          var item = {
            text: self.formatBuyPoint(buyPointsSelection) + ' (' + hcp + ')',
            value: buyPointsSelection
          }
          items.push(item)
        }
        return items
      }
    },

    methods: {
      setFocus () {
//        console.log('SetFocus')
      },
      selectPoint () {
//        console.log('selectPoint')
      },
      doNothing () {
        // void
      },
      setInitialSelection (fromId) {
//        console.log('setInitialSelection (from: ' + fromId + '); isFastBet: ' + this.isFastBet)
//        let source = this.buyPointsItems

        let source = this.buyPointsSelections
        if (source && source.length) {
          var active = source.find(function (p) {
            return p.active
          })
          active = active || this.selection
          Vue.set(active, 'active', true)
          Vue.set(this, 'selectedPoint', active)
//          console.log('Set selection: ' + JSON.stringify(this.selectedPoint))
        }
      },
      formatHCP (s) {
//        console.log('formatHCP')
        var hcp = hcpFormat.formatHandicap(s)
        return hcp
      },
      formatBuyPoint (ds) {
//        console.log('formatBuyPoint')
        if (ds.hcpDiff) {
          return ds.hcpDiff
        }
        //
        let ch = this.selection.currentmatchhandicap || 0
        let had = this.selection.hadvalue === 'A' ? -1 : 1
        let p = ds.currentmatchhandicap - ch
        p *= had
        if (p > 0) {
          p = '+' + p
        }
        return p
      }
    },

    mounted () {
//      console.log('BetSlip Buy Points selection mounted')
      this.setInitialSelection('Mounted')
    },

    watch: {
        /*
      buyPointsItems: {
        immediate: true,
        handler  (newVal, oldVal) {
          console.log('Watch buyPointsItems')
//          this.setInitialSelection()
        }
      },
      */
      buyPointsSelections: {
        immediate: true,
        handler  (newVal, oldVal) {
//          console.log('Watch buyPointsSelections; isFastBet: ' + this.isFastBet)
//          console.log('oldVal: ', JSON.stringify(oldVal))
//          console.log('newVal: ', JSON.stringify(newVal))
          /*
          if (newVal && newVal.length && oldVal && oldVal.length) {
            for (var i = 0; i < oldVal.length; i++) {
              Vue.set(newVal[i], 'active', oldVal[i].active)
            }
          }
          */
          //
          if (newVal && newVal.length) {
              //  && !this.inited
            this.setInitialSelection('Watcher-buyPointsSelections')
          }
        }
      },
      sourceHandicap: {
        immediate: true,
        handler  (newVal, oldVal) {
//          console.log('Watch sourceHandicap ' + oldVal + ' => ' + newVal + '; isFastBet: ' + this.isFastBet)
          this.setInitialSelection('Watcher-sourceHandicap')
        }
      },
      selectedPoint: {
        immediate: true,
        handler  (newVal, oldVal) {
//          console.log('Watch selectedPoint; isFastBet: ' + this.isFastBet)
//          console.log('oldVal: ', JSON.stringify(oldVal))
//          console.log('newVal: ', JSON.stringify(newVal))
          if (oldVal) {
            Vue.set(oldVal, 'active', false)
          }
          if (newVal) {
            Vue.set(newVal, 'active', true)
          }
          store.dispatch('sbBetslipState/scheduleGetABTnR', 0.000011)
        }
      },
      activeOption (newVal, oldVal) {
//        console.log('Watch activeOption; isFastBet: ' + this.isFastBet)
//        console.log('oldVal: ', JSON.stringify(oldVal))
//        console.log('newVal: ', JSON.stringify(newVal))
        if (newVal) {
          this.setInitialSelection(3)
        }
      }
    }
  }
</script>

<style lang="stylus" scoped>
  @import "~@/css/config"
  $image-base-url = '~@/assets/images/icon/svg/'

  .by-points-option
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
    .selectedPoint
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
