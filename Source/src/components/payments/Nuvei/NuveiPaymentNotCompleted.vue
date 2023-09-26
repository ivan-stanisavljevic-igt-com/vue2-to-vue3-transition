<template>
  <div class="npnc">
    <h2><v-icon color="warning">warning</v-icon>{{ $t('Payments.Nuvei.NotCompleted.Headline') }}</h2>
    <div class="npnc-message" v-if="infoMsg">{{infoMsg}}</div>
    <div v-else class="npnc-message">{{ $t('Payments.PNM.NotCompleted.Payment') }}</div>
    <!-- Back to homepage -->
    <div class="goto__home">
      <v-btn large color="success" @click="goToHomepage()">{{ $t('Account.ChangePassword.GoToHomepage') }}</v-btn>
    </div>
  </div>
</template>
<script>
import store from '@/store'

export default {
  computed: {
    infoMsg () {
      return store.getters[`nuvei/${this.currentNuveiType}/getInfoMsg`]
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
.npnc
  @media mobile-big-and-below
    background white
    padding 10px
  .goto__home
    margin-top 10px
    text-align center
  .npnc-message
    text-align center
    margin 10px 0 20px
</style>