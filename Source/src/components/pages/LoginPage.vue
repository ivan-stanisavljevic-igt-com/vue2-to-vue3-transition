<template>
  <div class="page-content login-page">
   <v-btn class="login_btn primary-btn-blue" @click="openDialogLogin()"><span>{{ $t('MyAccount.PleaseLogIn') }}</span></v-btn>
  </div>
</template>
<script>

export default {
  name: 'LoginPage',

  data () {
    return {

    }
  },
  methods: {
    openDialogLogin () {
      this.$store.dispatch('overlayState/activateLoginDialog')
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus">
.login-page
  padding 100px 0
  .theme--light.login_btn.v-btn
    margin auto
    display block
    padding 0 40px
    height 60px
</style>
