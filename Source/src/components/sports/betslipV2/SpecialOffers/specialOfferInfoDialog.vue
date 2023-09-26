<template>
  <div class="dialogSpecialOfferInfo" v-if="offer && offer.Id">
    <div >
      <div class="heading">
        <special-translator :offer="offer" :phrId="'offer.title'"></special-translator>
      </div>
      <div class="img-holder">
<!--        <img src="~@/assets/images/logo/SpecialOffersLogo.svg" alt="Special Offers">-->
      </div>
      <div class="so-info-msg">
        <special-translator :offer="offer" :phrId="'modal.info'"></special-translator>
      </div>
      <div class="heading-small">{{offer.Name}}</div>
      <div class="so-description">{{offer.Description}}</div>
    </div>

    <button class="btn" @click="deactivateDialog()">
      <special-translator :offer="offer" :phrId="'modal.btn.OK'"></special-translator>
    </button>

    <!--      dialogSpecialOfferInfo: {{dialogSpecialOfferInfo}}-->
  </div>
</template>

<script>
//  import Vue from 'vue'
  import store from '@/store'
  import specialTranslator from './specialTranslator.vue'

  export default {
    name: 'specialOfferInfo',

    props: ['dialogSpecialOfferInfo'],

    components: {specialTranslator},

    data () {
      return {

      }
    },

    computed: {
      offer () {
        return this.dialogSpecialOfferInfo && this.dialogSpecialOfferInfo.data
      }

    },

    methods: {
      deactivateDialog () {
        store.dispatch('overlayState/deactivateSpecialOfferInfo')
      }
    },

    created () {

    },

    watch: {
    },

    destroyed () {
    }
  }
</script>

<style lang="stylus" scoped>
.img-holder
  width 100%
  img
    width 100%
    margin auto
    display block
    padding-bottom 0px
.heading
  font-family: 'Open Sans Bold'
  font-size 25px
  color #1F375B
  line-height 125%
  padding-bottom 10px
  text-align center
.so-info-msg
  font-size 14px
  font-family: 'Open Sans SemiBold'
  color #818E95
  line-height: 150%
  margin-top 20px
  margin-bottom 24px
.heading-small
  font-size 20px
  font-family: 'Open Sans SemiBold'
  color #445058
  line-height: 150%
  margin-bottom 8px
.so-description
  font-size 14px
  font-family: 'Open Sans SemiBold'
  color #445058
  line-height: 150%

.btn
  width 100%
  font-family: 'Open Sans SemiBold'
  font-size: 20px
  color: #fff
  background: #0b4da1
  height: 56px
  margin 40px 0 0 0
  font-weight: normal
  border-radius 3px
  &:focus
  &:hover
  &:active
    background: #0b4da1 

</style>
