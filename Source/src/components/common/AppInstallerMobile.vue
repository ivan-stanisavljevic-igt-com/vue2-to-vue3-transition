<template>
  <div class="app-installer">
     <v-btn block @click.stop.native="appDownload()" class="primary-btn-blue">
        <span>{{ $t('appInstaller.nativeApp' + userAgent + '.appDwn') }}</span>  
      </v-btn>    
  </div>
</template>

<script>
import store from '@/store'
import lib from '@/library'
import config from '@/config'
import Branding from '@/components/mixins/Branding'

export default {
  name: 'AppInstallerMobile',

  mixins: [
    Branding
  ],

  data () {
    return {
      step1: true,
      step2: false,
      iosURL: config.externalUrls.installIosApp,
      androidURL: config.externalUrls.installAndroidApp,
      contact: config.externalUrls.contact
    }
  },

  methods: {
    close () {
      store.commit('screenState/setGeolocationMsgValue', 0)
      this.$router.push({name: 'home'})
    },
    appDownload () {
      if (this.userAgent === 'ios') {
        window.open(this.iosURL)
      } else if (this.userAgent === 'android') {
        this.step1 = false
        this.step2 = true
        window.open(this.androidURL)
      }
      window.scrollTo(0, 0)
    }
  },
  computed: {
    userAgent () {
      return lib.core.userAgent.os.name
    },
    state () {
      return window.ctsautoconf.STATE
    }
  },
  created () {
    window.scrollTo(0, 0)
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped>
@import '~@/css/config'

.app-installer 
  background #fff
  // min-height 100vh
>>>a
    font-weight bold
    color #1493ff
.image-part 
  position relative
  top 0
  left 0
.logo
  position absolute
  top 24px
  left 50%
  transform translateX(-50%)
.logo.step1  
  >>>a
      color #3fc369
.android-mockup 
  text-align center
  margin-top -25px
.logo img 
  margin auto
  margin-top 15px
  margin-bottom 25px
.android-mockup p 
  padding 16px
  text-align justify
.logo-text 
  width 335px
  font-size 28px
  font-weight bold
  line-height 1.1
  text-align center
  color #ffffff
  text-transform uppercase
.logo-text-content 
  width 300px
  height 34px
  font-size 14px
  color #ffffff
  margin auto
  text-align center
  padding-bottom 20px
.bottom-content
  background-color #f0f3f8
  line-height 21px
  color #1F375B
  padding 16px
.top-btn
  margin 20px
h1 
  margin 0
  color #1F375B
  text-transform uppercase
  font-size 30px
  font-weight bold
  line-height 35px
  text-align center

.btn.primary-btn-blue 
  background-color #1493FF !important
  margin-bottom 10px
.app-link 
  text-align center
.app-btn 
  color #1F375B !important
  font-size 12px
.install-step2 
  margin 24px 12px 0px 12px
.title2-step2 
  width 128px
  height 16px
  font-size 16px
  font-weight bold
  color #06283b
  text-transform uppercase  
.note-step2 
  margin 0px 12px
  padding-bottom 23px  
.dontsee-step2 
  font-size 14px
  line-height 21px
  color #1F375B
  padding 16px 12px 5px 12px

.note
  background-color #f0f3f8  
table
  margin-bottom 20px  
  color #06283b
  counter-reset section
  line-height 1.1
  border-radius 5px
  border solid 1px #cfd6db
  border-collapse separate
  
  th
    background unset
    padding-top 17px
    padding-bottom 17px
    border-bottom  solid 1px #cfd6db
    
  td
    font-size 14px
    padding-top 17px
    padding-bottom 17px  
t-body tr
  align-items center
  display flex
.bottom-row
  font-weight bold 
  color #1493ff  
  td
    text-align center
    border-top solid 1px #cfd6db
    background-color #f0f3f8
    border-bottom-left-radius 5px
    border-bottom-right-radius 5px
  
t-body tr::before
  counter-increment section 
  content counter(section)
  color white
  background #1493ff
  padding 2px 10px
  width 20px
  height 20px
  text-align center
  margin-right 16px 
  margin-left 16px
  display flex
  justify-content center
  align-items center
.rectangle
  height 1px
  opacity 0.6
  background-image linear-gradient(to left, rgba(21, 42, 71, 0), #06283b 11%, #06283b 49%, #06283b 89%, rgba(21, 42, 71, 0))
  margin-top -6px
.google-hidden
  display none   

</style>
