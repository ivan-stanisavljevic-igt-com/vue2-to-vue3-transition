<template>
  <div class="addingSelectionDialog">
    <h2>Adding your selection</h2>
    <p>Just a few seconds</p>
    <dots-loader></dots-loader>
  </div>
</template>
<script>

import dotsLoader from '@/components/common/DotsLoader'

export default {
  name: 'adding-selections-dialog',

  components: {
    dotsLoader
  }

}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped>
  @import "~@/css/config"

  .addingSelectionDialog
    text-align center
    padding 34px 74px 0 74px
    >>>.dots-loader
      box-shadow none
      span
        bottom 50px
        color #1493FF
    h2 
      font-family 'Open Sans Bold'
      font-size 20px
      color #445058
      font-weight normal
      margin-bottom 3px
    p 
      font-family 'Open Sans Regular'
      font-size 16px
      color #445058
</style>