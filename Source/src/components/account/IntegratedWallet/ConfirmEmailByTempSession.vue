<template>
  <div class="confirm-email-content">
    <div v-if="isProcessing">
      <v-progress-circular indeterminate></v-progress-circular>
    </div>
    <div v-else>
      <div v-if="isEmailConfirmed">
        <p class="generic-icon-note"><v-icon color="success" class="mr-1">check_circle</v-icon><span>Your email has been confirmed successfully!</span></p>
        <p>{{ $t('BetSlipPage.msg.LogIn') }}</p>
      </div>
      <div v-else>
        <p class="generic-icon-note"><v-icon color="error" class="mr-1">error</v-icon><span>There was an error with your email confirmation.</span></p>
        <p>{{ errorMessage }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ConfirmEmailByTempSession',

  data () {
    return {
      isProcessing: true,
      isEmailConfirmed: false,
      errorMessage: ''
    }
  },

  methods: {
    openDialogLogin () {
      this.$store.dispatch('overlayState/activateLoginDialog')
    }
  },

  async mounted () {
    const q = this.$route.query.q
    if (q) {
      try {
        // eg url: https://localhost:8080/account/confirm-email-by-temp-session?q=test
        // console.log(q)
        await this.$store.dispatch('confirmEmailByTempSession', { 'token': q })
        this.isEmailConfirmed = true
      } catch (error) {
        this.errorMessage = error.message // todo: should we propagate this message to UI?
      } finally {
        this.isProcessing = false
      }
    } else {
      this.$router.push('/')
    }
  }
}
</script>

<style scoped lang="stylus">
.confirm-email-content
  text-align center
  font-size 1.2em

</style>
