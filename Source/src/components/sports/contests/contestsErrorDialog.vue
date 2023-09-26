<template>
    <v-dialog
      v-model="showDialog"
      content-class="contests-error-dialog"
    >
      <h1 class="error-dialog--heading">{{ $t('Contests.Error.Dialog.Heading') }}</h1>
      <p class="error-dialog--error-message">{{ errorMessage }}</p>
      <v-btn class="btn--close-dialog" @click="showDialog = false">{{ $t('Contests.Error.Dialog.Btn') }}</v-btn>
    </v-dialog>
</template>

<script>
export default {
  name: 'contestsErrorDialog',
  props: {
    showErrorDialog: {
      type: Boolean,
      default: false
    },
    errorMessage: {
      type: String,
      default: ''
    }
  },
  computed: {
    showDialog: {
      get () {
        return this.showErrorDialog
      },
      set (value) {
        this.$emit('toggle-error-dialog', value)
      }
    }
  }
}
</script>

<style lang="stylus">
@import '~@/css/config'
@import '~@/css/mixins'

.contests-error-dialog
  background-color: #ececec
  text-align: center
.error-dialog--heading 
  text-align: center
.error-dialog--error-message
  font-size: 14px
  font-weight: 600
  color: #d60101
button.theme--light.v-btn.btn--close-dialog
  background-color: #003764 !important
  border: 1px solid #003764
  color: #fff
  font-size: 15px
</style>
