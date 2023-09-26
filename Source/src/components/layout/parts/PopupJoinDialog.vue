<template>
  <v-dialog persistent v-model="show">
    <div class="join-message">
      <h3>{{ $t('JoinDialog.NewCustomer') }}</h3>
      <p v-html="$t('JoinDialog.Text')"></p>
      <p class="text_21" v-if="brandKey === 'rw' || brandKey === 'boyd'">{{ $t('JoinDialog.Text_21') }}</p>
      <v-btn class="primary-btn-blue" @click="closeJoinDialog()"><span>{{ $t('JoinDialog.Ok') }}</span></v-btn>
    </div>
  </v-dialog>
</template>
<script>

import store from '@/store'
import Branding from '@/components/mixins/Branding'

export default {
  name: 'PopupJoinDialog',
  components: {},
  mixins: [
    Branding
  ],
  computed: {
    show () {
      return store.getters['overlayState/getJoinDialogState']
    }
  },
  methods: {
    closeJoinDialog () {
      store.dispatch('overlayState/deactivateJoinDialog')
    }
  },
  mounted () {}
}
</script>

<style lang="stylus" scoped>
  .join-message {
    display flex 
    justify-content center
    flex-direction column
    text-align center
    border-radius 5px
  }
  .join-message h3 {
    border-bottom 1px solid #e8ecf1
    padding-bottom 10px
  }
  .join-message p {
    border-bottom 1px solid #e8ecf1
    padding-bottom 10px
  }
  .join-message button
    text-transform uppercase
  .text_21
    font-weight bold
</style>

