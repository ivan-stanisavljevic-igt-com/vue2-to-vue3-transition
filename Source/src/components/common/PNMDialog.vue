<template>
  <v-dialog
      v-model="show"
      width="dialogWidth"
      height="100%"
      content-class="pnmpp-containerdialog"
    >
    <v-icon class="pnm-close" @click.stop="closeDialog()">close</v-icon>
    <v-card>
      <iframe :src="url" id="pnm-iframe"></iframe>
    </v-card>
    </v-dialog>
</template>

<script>
import store from '@/store'
export default {
  props: [
    'pnmDialog',
    'url'
  ],
  data () {
    return {
      dialog: false
    }
  },

  computed: {
    show: {
      get () {
        return this.pnmDialog
      },
      set () {
        this.dialog = false
        store.commit('payNearMe/setRedirectionUrl', undefined)
      }
    },
    isMobile: () => store.getters['screenState/getMobileBigAndBelow'],
    dialogWidth () {
      return this.isMobile ? '80%' : '50%'
    }
  },
  methods: {
    closeDialog () {
      this.dialog = false
      store.commit('payNearMe/setRedirectionUrl', undefined)
    }
  }
}
</script>

<style lang="stylus" scoped>
@import "~@/css/config";
#pnm-iframe
  width 100%
  height 500px
.pnm-close
  display flex
  justify-content flex-end
  font-size 25px
  font-weight bold
  height 0
  position relative
  top -13px
  right -22px
  &:hover
    cursor pointer
    color rgba(0,0,0,.30)
</style>
