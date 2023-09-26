<template>
  <div class="registration-limits" v-show="showLimitsDialogAfterRegistration">
    <div class="tandc-popup-container post-reg-limits-popup__container">
      <div class="tandc-popup-child" v-if="showLimitsDialogAfterRegistration">
        <div class="tc-heading">{{ $t('Account.Limits') }}
          <div class="close_icon"  @click="closeLimitsDialog()"><v-icon>close</v-icon></div>
        </div>
        <div class="tandc-popup-content">
          <Limits :isOnRegistration="true"/>
        </div>
        <div class="prlpc__btns">
          <v-btn color="success" x-large @click.stop="closeLimitsDialog()"><span>{{ $t('MessageDialog.btn.CLOSE') }}</span></v-btn>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import store from '@/store'
  import Limits from '@/components/account/Limits/Limits'
  import Session from '@/components/mixins/Session'
  import config from '@/config'

  export default {
    components: {
      Limits
    },
    mixins: [
      Session
    ],
    computed: {
      // isLoggedIn () {
      //   return store.getters['isLoggedIn']
      // },
      showLimitsDialogAfterRegistration () {
        let isConfigEnabled = config.app.autoconf.SHOW_LIMITS_AFTER_REGISTRATION
        let isPostRegistrationLogin = this.isFirstEverLogin
        let dialog = store.getters['limits/postLoginDialog']
        return isConfigEnabled && isPostRegistrationLogin && dialog
        // return isConfigEnabled && this.isLoggedIn && dialog
      }
    },
    methods: {
      closeLimitsDialog () {
        store.dispatch('limits/closePostLoginDialog')
      },
      applyStyleOnParent (param) {
        let elem = document.querySelector('.registration-limits')
        if (elem) {
          let parent = elem.parentElement
          if (parent) {
            if (param === 'add') {
              parent.style.zIndex = '10100'
            } else {
              parent.style.zIndex = ''
            }
          }
        }
      }
    },
    watch: {
      showLimitsDialogAfterRegistration (val) {
        if (val) {
          this.applyStyleOnParent('add')
        } else {
          this.applyStyleOnParent()
          this.closeLimitsDialog()
        }
      }
    }
  }
</script>

<style lang="stylus" scoped>
@import '~@/css/main'
.registration-limits
  z-index: 9999!important
  position relative
.post-reg-limits-popup__container
  z-index 10050!important
  .tandc-popup-child
    top 0
    left 0
    right 0
    bottom 0
    .tc-heading
      position relative
      .close_icon
        cursor pointer
        position absolute
        right 10px
        top 0px
        transform scale(1.5)
    >>> .form-actions
      position unset
      padding 5px 0!important
    .tandc-popup-content
      margin-bottom 15px
      @media mobile-big-and-below
        height: calc(100% - 150px)
  .prlpc__btns
    display flex
    justify-content center
    @media mobile-big-and-above
      margin-top 15px
</style>
