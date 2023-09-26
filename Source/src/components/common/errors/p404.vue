<template>
  <div class="p404">
    <h1>Oops! 404</h1>
    <h1>Sorry this page was not found</h1>
    <p>Go to <router-link :to="{ name: 'home'}">Homepage</router-link></p>
  </div>
</template>
<script>
export default {
  name: 'p404',
  data: () => ({

  })
}
</script>
<style lang="stylus">
  @import '~@/css/config'

  .url-state-name-page-not-found
    #header-part
      max-width 1441px
      @media tablet-and-above
        padding 0 10px
  .p404
    background #fff
    width 40%
    height 45%
    display: flex
    align-items: center
    justify-content: center
    flex-direction: column
    @media mobile-big-and-below
      width 90%
      height 60%
  .p404 h1
    font-size 26px
    @media mobile-big-and-below
      font-size 20px
  .p404 p
    font-size 20px
    @media mobile-big-and-below
      font-size 16px
  .p404 a
    font-weight 600
  // .application .container
  //   margin-top 130px
  //   display flex
  //   justify-content center
  //   align-items center
  //   height 60%
</style>
