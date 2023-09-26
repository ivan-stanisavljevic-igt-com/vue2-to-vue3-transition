<template>
  <v-dialog
      v-model="show"
      height="100%"
      content-class="pnmgw__dialog"
    >
    <div class="payments__spinner payments__spinner__override">
      <v-progress-circular indeterminate></v-progress-circular>
      {{ $t('Transaction.PleaseWait') }}
    </div>
    </v-dialog>
</template>

<script>
import store from '@/store'

export default {
  props: ['type'],
  data () {
    return {
      dialog: false
    }
  },
  computed: {
    show () {
      let a = store.getters[`nuvei/${this.type}/processing`]
      return a
    }
  },
  methods: {
    removeScrollbar () {
      if (!window.ctsautoconf.MOBILE_LS) {
        window.document.getElementsByTagName('html')[0].style = 'overflow: hidden'
      }
    },
    bringBackScrollbar () {
      if (!window.ctsautoconf.MOBILE_LS) {
        window.document.getElementsByTagName('html')[0].style = 'overflow: initial'
      }
    }
  },
  mounted () {
    this.removeScrollbar()
  },
  destroyed () {
    // clean actions in case of sudden logout
    this.bringBackScrollbar()
  }
}
</script>

<style lang="stylus" scoped>
@import "~@/css/config"
>>> .pnmgw__dialog
  height 100%
  max-height unset
  width 100%
  max-width unset
  margin 0
  padding 0
  .payments__spinner__override
    position relative
    height 100%
    display flex
    align-items center
    justify-content center
    font-size 14px
</style>
