<template>
  <div class="caca">
    <h2><v-icon color="error" class="mr-1">error</v-icon>{{ $t('Payments.PNM.NotCompleted.Headline') }}</h2>
    <div v-if="infoMsg">{{infoMsg}}</div>
    <div v-else>{{ $t('Payments.PNM.NotCompleted.Payment') }}</div>
    <!-- Back to homepage -->
    <div class="goto__home">
      <v-btn large color="success" @click="goToHomepage()">{{ $t('Account.ChangePassword.GoToHomepage') }}</v-btn>
    </div>
    <PNMEventDispatcher :paymentIsCompleted="false"/>
  </div>
</template>
<script>
import PNMEventDispatcher from '@/components/payments/PayNearMeGateway/PNMEventDispatcher'
import store from '@/store'

export default {
  components: {
    PNMEventDispatcher
  },
  computed: {
    infoMsg () {
      return store.getters['pnmGateway/infoMsg']
    }
  },
  methods: {
    goToHomepage () {
      this.$router.push({name: 'home'})
    }
  }
}
</script>
<style lang="stylus" scoped>
@import "~@/css/config"
.caca
  @media mobile-big-and-below
    background white
    padding 10px
  .goto__home
    margin-top 10px
    text-align center
</style>