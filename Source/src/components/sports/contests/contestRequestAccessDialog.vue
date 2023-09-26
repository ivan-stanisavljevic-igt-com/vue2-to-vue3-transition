<template>
    <v-dialog
    v-model="showDialog"
    height="100%"
    content-class="contest-request-access-dialog"
    >
      <h3>{{ $t('Contests.Request.Dialog.Heading') }}</h3>
      <h2 class="contest-name">{{ contestName }}</h2>
      <p>{{ $t('Contests.Request.Dialog.Multiple') }}</p>
      <p>{{ $t('Contests.Request.Dialog.Remaining') }} <span class="entries-left">{{ entriesLeft }}</span></p>
      <p>{{ $t('Contests.Request.Dialog.Again') }}</p>
      <div class="d-flex align-center buttons">
        <v-btn @click="showDialog = false" class="btn--cancel">
          {{ $t('Contests.Alias.Page.Cancel') }}
        </v-btn>
        <v-btn :to="{ name: 'contests/registration/termsandconditions', params: { contestId: contestId } }" class="btn--yes">
          {{ $t('Contests.Request.Dialog.Yes') }}
        </v-btn>
      </div>
    </v-dialog>
</template>

<script>
export default {
  name: 'contestRequestAccessDialog',
  props: ['showContestRequestAccessDialog', 'contestName', 'contestId', 'entriesLeft'],
  computed: {
    showDialog: {
      get () {
        return this.showContestRequestAccessDialog
      },
      set (value) {
        this.$emit('toggle-contest-request-access-dialog', value)
      }
    }
  }
}
</script>

<style lang="stylus">
@import '~@/css/config'
@import '~@/css/mixins'

.contest-request-access-dialog
  text-align: center
  color: #fff
  border-radius: 3px
  border: solid 1px #fff
  background-image: linear-gradient(to bottom, #306c9e, #001c32)
  .contest-name 
    background-color: #e8f9e5
    padding: 10px 0
    color: var(--text-color)
    font-size: 18px
    font-weight: 600
    margin-bottom: 32px
  a.theme--light.v-btn.btn--yes
    background-color: #3ca77c
    color: #fff
    border: 1px solid #3ca77c
  button.theme--light.v-btn.btn--cancel
    background-color: transparent
    color: #fff
    border: 1px solid #fff
  h3 
    margin-bottom: 12px
    font-family: 'Open Sans Regular'
    font-weight: 400
  .entries-left
    font-weight: 600
  p 
    margin: 0
    font-size: 14px
  .buttons 
    margin-top: 48px
</style>
