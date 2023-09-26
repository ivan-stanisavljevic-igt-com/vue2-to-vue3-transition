<template>
  <div style="text-align: center;">
    <h2 >{{ $t('BetSlip.addSelection.dialog.title') }}</h2>
    <div class="dialog_text">
      <p :key="dialogBetslipMsg.data[0]">
        {{ $t('BetSlip.addSelection.error.'+ dialogBetslipMsg.data[0], {n:dialogBetslipMsg.data[1]}) }}
      </p>
    </div>
    <button class="v-btn secondary" style="margin-left: 0px" @click="closeDialog()">
      <span >{{ $t('BetSlip.addSelection.dialog.btn.OK') }}</span>
    </button>
  </div>
</template>

<script>
  //  import Vue from 'vue'
  import store from '@/store'

  export default {
    name: 'betslip-msg',

    props: ['dialogBetslipMsg'],
    data () {
      return {
      }
    },

    computed: {
    },

    methods: {
      closeDialog () {
        store.dispatch('overlayState/deactivateBetslipMsg')
      }
    },

    created () {

    },

    watch: {

    },

    destroyed () {
    }
  }
</script>

<style lang="stylus" scoped>

</style>
