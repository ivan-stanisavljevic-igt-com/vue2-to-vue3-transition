<template>
 <div class="dialogContent">
    <v-layout class="title">
      <v-flex class="close">
        <v-btn flat @click="closeDialog()"><v-icon>close</v-icon></v-btn>
      </v-flex>
      <img :src="dialogContent.img" alt="dialog_img">
    </v-layout>
  </div>
</template>
<script>
  import store from '@/store'

  export default {
    name: 'headline-overly',

    components: {
    },

    props: [
    ],

    data () {
      return {

      }
    },

    computed: {
      dialogContent () {
        return store.getters['overlayState/getHeadlineOverlayDialogContent']
      },
      bgrImage () {
        return 'url("' + this.dialogContent.img + '")'
      }
    },

    methods: {
      closeDialog () {
        store.dispatch('overlayState/deactivateHeadlineOverlayDialog')
      }
    },

    created () {
    },

    destroyed () {
    },

    watch: {
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped>
  @import "~@/css/config"

  .dialogContent
    height auto
    background-size contain
    background-position center
    position relative
    .layout
      align-items: center
      justify-content: center
    img
      max-height: 700px
      max-width: 100%
  .close
    position absolute
    top 14px
    right 11px
    width: 41px
    height: 41px
    min-width: 41px
    padding: 0
    margin: 0
    border-radius: 50%
    justify-content: center
    align-items: center
    display: flex
    @media mobile-big-and-below
      top: 14px
      right: 10px
      width: 35px !important
      height: 35px
      min-width auto !important
      >>>.btn__content
        padding: 0
    .btn 
      min-width: auto
    .v-icon
      color transparent !important
      background-image: url('~@/assets/images/icons/icon-close-lightgrey.svg')
      height 21px
      width 21px
      @media mobile-big-and-below
        width: 21px !important
        height: 21px
</style>
