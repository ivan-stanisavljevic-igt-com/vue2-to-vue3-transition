<template>
  <div class="preference-switch">
    <a class="mask" @click="toggleSettings(id)"></a>
    <!--id: {{id}}<br>-->
    <!--prop: {{prop}}<br>-->
      <label :for="id">
        <span>{{ $t('BetSlip.placement.'+ id +'.label') }}</span>
      </label>
      <v-checkbox v-model.lazy="combo"
          :on-icon="(brandKey === 'dn' || brandKey === 'dnw') ? 'check_circle_outline' : 'check_box'" :off-icon="(brandKey === 'dn' || brandKey === 'dnw') ? 'radio_button_unchecked' : 'check_box_outline_blank'"
          :id="id"
          :disabled="currentBetSlipState>=2"
          @click="toggleSettings(id)" ></v-checkbox>
      <!-- <v-switch v-model.lazy="combo"
                :id="id"
                :disabled="currentBetSlipState>=2"
                @click="toggleSettings(id)" ></v-switch> -->

  </div>
</template>

<script>
  import Vue from 'vue'
  import store from '@/store'

  import Branding from '@/components/mixins/Branding'

  export default {
    name: 'preferenceSwitch',
    props: ['id', 'currentBetSlipState', 'doNotConfirm'],

    mixins: [
      Branding
    ],

    data () {
      return {
        prop: false,
        to: null
      }
    },

    computed: {
      storedVal: {
        get: function () {
          return store.getters['sbBetslipState/' + this.id]
        },
        set: function (newVal) {
//          console.log(this.id + ' newVal: ' + newVal)
          store.commit('sbBetslipState/set' + this.capitalizeFirstLetter(this.id), newVal)
        }
      },
      combo: {
        get: function () {
          var v = this.prop && this.storedVal
//          console.log('combo get: ' + v)
          return v
        },
        set: function (newVal) {
//          console.log('combo set: ' + newVal)
          return newVal
        }
      }
    },

    methods: {
      toggleSettings (id) {
//        console.log('toggleSettings')
        var self = this
        clearTimeout(self.to)
        this.to = setTimeout(function () {
          clearTimeout(self.to)
          self.toggleSettingsOnTo(id)
        }, 100)
      },
      toggleSettingsOnTo (id) {
        var self = this
//        console.log('toggle settings for ' + id + ': ' + self[id])
        if (this.prop) {
          if (this.doNotConfirm) {
            Vue.set(self, 'prop', !true)
            Vue.set(self, 'storedVal', !true)
          } else {
            store.dispatch('overlayState/activateBetslipConfirm', id).then(function (sure) {
              setTimeout(function () {
                Vue.set(self, 'prop', !sure)
                Vue.set(self, 'storedVal', !sure)
              })
            })
          }
        } else {
          Vue.set(self, 'prop', true)
          Vue.set(self, 'storedVal', true)
        }
      },
      capitalizeFirstLetter (string) {
        return string.charAt(0).toUpperCase() + string.slice(1)
      }
    },

    created: function () {
      this.prop = store.getters['sbBetslipState/' + this.id]
    },
    mounted: function () {
      this.prop = store.getters['sbBetslipState/' + this.id]
    },

    watch: {}
  }
</script>

<style lang="stylus" scoped>
  .preference-switch
    position: relative;
    .mask {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 10;
      display: block
    }
    background: #F0F3F8
    padding: 7px 12px
    display: flex
    align-items: center
    font-size: 14px
    margin: 12px -12px -12px -12px
    justify-content: space-between
    label
      flex: 1 1 auto
      vertical-align: middle
      color: #0b4da1
      font-size 12px
      font-family 'Open Sans SemiBold'
    >>>.v-input--switch
      flex:  0 auto
      margin-left: auto
      >>>.v-input__slot
        margin 0 !important
      >>>.v-input--selection-controls
        margin-top 0 !important
      >>>.v-input--selection-controls:not(.v-input--hide-details) .v-input__slot
        margin-bottom 0 !important
    >>>.v-icon
      color #B9BDC6 !important
    >>>.v-input__slot
      margin-bottom 0
    >>>.v-messages
      display none
    >>>.v-input--selection-controls
      padding 0
    >>>.v-input--selection-controls__input
      margin 0

.FastBetSlip
  .preference-switch
    >>>.v-input
      flex 0 !important

</style>
