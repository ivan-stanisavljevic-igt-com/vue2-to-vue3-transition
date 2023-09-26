<template>
<div class="noLive-msg">
    <div class="msg-content">  
        <h3>No Live Events</h3>
    </div> 
</div>
</template>

<script>

export default {
  name: 'noLive-msg',

  methods: {
    goToUpcoming () {
      this.$router.push({name: 'sports', params: {}})
    }
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped>
@import '~@/css/config'
@import '~@/css/layout'
@import "mixins"

.url-state-name-sports
    .noLive-msg
        margin-top 5px
    .go-to-upcomming
        display none

.url-state-name-sports-live .content
        padding-bottom 0px        
        
.msg-content
    margin auto
    flex-direction column
.noLive-msg
    padding-top 40px
    padding-bottom 40px
    background #fff
    display flex
    flex-direction: column
    height 100%
    position: relative
 
.btn  
    margin 0 
    min-height 72px
    width 100%
    font-weight bold
    padding 12px
    box-shadow 0px -1px 0px #CFD6DB    
    background #FFF !important
    box-shadow 0px -1px 0px #CFD6DB        

.btn__content   
    margin 0 auto   
    font-weight bold
    color #fff
    background #1493FF
    border-radius 2px    
    min-height 48px

img    
    display block
    margin auto
    margin-bottom 44px
h3, p
    line-height normal
    font-size 24px
    text-align center
    color #06283b
    opacity 0.4    
p  
    font-size: 17px
    margin-bottom 40px  

@media mobile-big-and-below 
    .btn
        margin-top 10px
    .noLive-msg   
        padding-top none    
        border none       
        top 0px      
        background #E4E8EE
        min-height calc(100vh - 148px)    
        border-radius 0px
    .url-state-name-sports .noLive-msg
        min-height calc(100vh - 395px) 
</style>