<template>
  <div class="tandc-popup-container post-reg-limits-popup__container" v-if="showLimitsDialogAfterRegistration">
    <div class="tandc-popup-child">
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
</template>

<script>
  import store from '@/store'
  import Limits from '@/components/account/Limits/Limits'

  export default {
    components: {
      Limits
    },
    props: ['showLimitsDialogAfterRegistration'],
    methods: {
      closeLimitsDialog () {
        store.dispatch('limits/closePostLoginDialog')
      }
    }
  }
</script>

<style lang="stylus" scoped>
@import '~@/css/main'
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
