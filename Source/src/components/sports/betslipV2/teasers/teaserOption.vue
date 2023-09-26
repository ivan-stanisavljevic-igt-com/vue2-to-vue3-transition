<template>
  <div class="teaser-option-container">

      <span class="icon" v-if="!mixedTeasers" >
        <icon :name="'icon-' + iconName" :colorName="'white'"></icon>
      </span>
      <h2 v-if="!mixedTeasers || spread"><span class="teaserSport">{{sportName}}</span></h2>
      <h2 v-else><span class="teaserSport">{{ $t('BetSlip.tab.TEASER.option.label.MIXED') }}</span></h2>

      <div class="teaser-option">

        <v-btn class="remove" @click="decrease"
                :disabled="disabled || selectedTeaser<2" ><v-icon>remove</v-icon></v-btn>
        <div class="value">

          <span v-if="!mixedTeasers">
            <span class="num-value" v-if="!mixedTeasers">
              {{spread}}
            </span>
            <div class="spread-label"><span>{{ $t('BetSlip.tab.TEASER.option.spread') }}</span></div>
          </span>

          <span v-else>
            <span>{{ $t('BetSlip.tab.TEASER.option.spread.' + (brandKey === 'circa' && spread ? 'level' : activeTeaserByGroup[groupId])) }}</span>
            <div class="spread-label" v-if="spread">
              {{spread}} <span v-if="brandKey === 'circa'">{{ $t('BetSlip.tab.TEASER.option.spread.points') }}</span>
            </div>
            <div v-else class="spread-label"><span>{{ $t('BetSlip.tab.TEASER.option.spread.mixed') }}</span></div>
          </span>


        </div>
        <v-btn class="add" @click="increase"
                :disabled="disabled || selectedTeaser>=teaserLevelsNo" ><v-icon>add</v-icon></v-btn>
      </div>
  </div>
</template>

<script>
  import Vue from 'vue'
  import store from '@/store'
  import Icon from '@/components/common/Icon'
  import Branding from '@/components/mixins/Branding'

  export default {
    mixins: [
      Branding
    ],

    props: ['groupId', 'group', 'tab', 'currentBetSlipState', 'activeTeaserByGroup', 'mixedTeasers'],

    data () {
      return {
      }
    },

    components: {
      Icon
    },

    methods: {
      decrease () {
        if (this.selectedTeaser > 1) {
          this.selectedTeaser--
        }
      },
      increase () {
        if (this.selectedTeaser < this.teaserLevelsNo) {
          this.selectedTeaser++
        }
      },
      updateSelectedTeaser () {
        this.$emit('updateSelectedTeaser', this.groupId)
      }
    },

    mounted: function () {
    },

    computed: {
      teasersPriceTypes () {
        return store.getters['sbBetslipState/teasersPriceTypes']
      },
      teaserLevelsNo () {
        return (this.spreads && Object.keys(this.spreads).length) || this.teasersPriceTypes.length
      },
      iconName () {
        return this.group.IDFOSportType.split(' ').join('').toLowerCase()
      },
      sportName () {
        var sports
        if (!this.mixedTeasers) {
          sports = this.group.Sports.split(',')
        } else {
          sports = []
          for (var j = 0; j < this.group.Selections.length; j++) {
            let sportT = this.group.Selections[j].Sport.split(',')
            for (var s = 0; s < sportT.length; s++) {
              if (sports.indexOf(sportT[s]) === -1) {
                sports.push(sportT[s])
              }
            }
          }
        }
        return sports.length === 1 ? sports[0] : this.mixedTeasers ? this.group.IDFOSportType : sports.join(', ')
      },
      disabled () {
        return this.currentBetSlipState >= 1
      },
      spreads () {
        return (this.group && this.group.Spreads) || {}
      },
      spread () {
        return this.spreads && this.spreads[this.activeTeaserByGroup[this.groupId]]
      },
      selectedTeaser: {
        get: function () {
//          console.log('selectedTeaser - get')
          let val = typeof this.activeTeaserByGroup !== 'undefined' ? this.activeTeaserByGroup[this.groupId] : ''
          val = val && val.split('')
          return val[1] * 1
        },
        set: function (modifiedValue) {
//          console.log('selectedTeaser - set')
//          let newValue = modifiedValue.replace(/[^\d.]/g, '')
          let newValue = 'T' + modifiedValue
          store.commit('sbBetslipState/setActiveTeaser', [this.groupId, newValue])
          Vue.set(this.group, 'selectedTeaser', newValue)
        }
      }
    },

    watch: {
      selectedTeaser (newValue) {
//        console.log('Watch selectedTeaser')
        store.dispatch('sbBetslipState/scheduleGetABTnR', 0.000013)
      }
    }
  }
</script>

<style lang="stylus" scoped>
  color-border = #CFD6DB

  .teaser-option-container
    padding: 8px 10px
    border-radius: 0 !important
    background-color: #fff
    margin: 0
    border: 0px solid silver
    display: flex
    .teaser-option
      .v-btn
        background: transparent
        width auto !important
        &.v-btn--disabled
          .v-icon
            color rgba(255,255,255,.8) !important
      .value
        min-width 120px
    h2
      color #fff !important
    .teaserSport
      line-height 1

  .icon, h2
    -webkit-box-flex: 1;
    -ms-flex: 1;
    flex: 1;
    -ms-flex-preferred-size: auto;
    flex-basis: auto;

  .icon
    margin: 0

  .teaser-option
    background: #fff
    border: solid 1px #fff
    border-radius: 3px
    display: flex
    align-items: stretch
    justify-content: center
    height: 42px
    -webkit-box-flex: 0;
    -ms-flex-positive: 0;
    flex-grow: 0;
    flex: 1;

    >>> .css
      width: 20px
      height: 20px

    .add,
    .remove,
    .value
      min-width: 42px
      min-height: auto

    .value
      display: flex
      align-items: center
      justify-content: center
      text-align: center
      line-height: 15px
      border-style: solid
      border-width: 0 1px
      border-color: #fff
      color #fff
      min-width: 7rem
      .num-value
        font-size: 14px
        font-size: 1.2em
       .spread-label
         letter-spacing: 1px;
         font-size: 12px
         color: #fff


  .v-btn
    margin: 1px
    min-width: 30px
    // max-width: 30px
    font-size: 2em
    background: transparent

</style>
