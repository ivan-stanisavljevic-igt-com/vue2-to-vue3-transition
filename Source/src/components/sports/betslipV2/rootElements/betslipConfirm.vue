<template>
  <div>
    <h2 :key="key">{{ $t('BetSlip.dialog.confirm.title.' + dialogBetslipConfirm.data) }}</h2>
    <div class="dialog_text">
      <!--BetSlip.addSelection.error.{{dialogBetslipMsg.data[0]}}-->
      <p  :key="key">
        {{ $t('BetSlip.dialog.confirm.msg.' + dialogBetslipConfirm.data, {n:dialogBetslipConfirm.data && dialogBetslipConfirm.data[1]}) }}
      </p>
      <p>{{ $t('BetSlip.dialog.confirm.areYouSure') }}</p>
    </div>
    <v-layout>
      <v-flex xs6>
        <button class="v-btn primary" @click="cancelAction()">
          <span>{{ $t('BetSlip.dialog.confirm.CANCEL') }}</span>
        </button>
      </v-flex>
      <v-flex xs6>
        <button class="v-btn secondary" @click="confirmAction()">
          <span>{{ $t('BetSlip.dialog.confirm.OK') }}</span>
        </button>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
  //  import Vue from 'vue'
  import store from '@/store'

  export default {
    name: 'betslip-confirm',

    props: ['dialogBetslipConfirm'],
    data () {
      return {
      }
    },

    computed: {
      key () {
        return typeof this.dialogBetslipConfirm.data === 'string' ? this.dialogBetslipConfirm.data : new Date().getTime()
      }
    },

    methods: {
      closeDialog () {
        store.dispatch('overlayState/deactivateBetslipConfirm')
      },
      cancelAction () {
        this.dialogBetslipConfirm.resolve(false)
        store.dispatch('overlayState/deactivateBetslipConfirm')
      },
      confirmAction () {
        this.dialogBetslipConfirm.resolve(true)
        store.dispatch('overlayState/deactivateBetslipConfirm')
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
