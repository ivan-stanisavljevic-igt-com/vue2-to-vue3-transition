<template>
  <div class="caca">
    <h2><v-icon color="error" class="mr-1">error</v-icon>{{ $t('Payments.PNM.NotCompleted.Headline') }}</h2>
    <div v-if="errorMessage">{{errorMessage}}</div>
    <div v-else>{{ $t('Payments.PNM.NotCompleted.Payment') }}</div>
    <!-- Back to homepage -->
    <div class="goto__home">
      <v-btn large color="success" @click="goToHomepage()">{{ $t('Account.ChangePassword.GoToHomepage') }}</v-btn>
    </div>
    <NuveiEventDispatcher :paymentIsCompleted="false"/>
  </div>
</template>
<script>
import NuveiEventDispatcher from '@/components/payments/Nuvei/NuveiEventDispatcher'
import store from '@/store'

export default {
  components: {
    NuveiEventDispatcher
  },
  computed: {
    errorMessage () {
      return store.getters[`nuvei/${this.currentNuveiType}/getErrorMessage`]
    },
    currentNuveiType () {
      return store.getters['nuvei/currentNuveiType']
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