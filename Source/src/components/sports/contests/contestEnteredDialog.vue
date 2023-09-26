<template>
    <v-dialog
    v-model="showDialog"
    height="100%"
    content-class="contest-entered-dialog"
    >
      <h3>{{ $t('Contests.Entered.Dialog.Heading') }}</h3>
      <div class="contest-alias-wrapper">
        <span class="contest-info-dialog--usericon"></span><h1 class="contest-alias">{{ contestAlias }}</h1>
      </div>
        <h2 class="contest-name">{{ contestName }}</h2>
      <p>{{ $t('Contests.Entered.Dialog.Start') }}</p>
      <p class="contest-start-time">{{ contestStartTime }}</p>
      <v-btn class="btn--ok" @click="showDialog = false">OK</v-btn>
    </v-dialog>
</template>

<script>
export default {
  name: 'contestEnteredDialog',
  props: ['showContestEnteredDialog', 'contestAlias', 'contestName', 'contestStartTime'],
  computed: {
    showDialog: {
      get () {
        return this.showContestEnteredDialog
      },
      set (value) {
        this.$emit('toggle-contest-entered-dialog', value)
      }
    }
  }
}
</script>

<style lang="stylus">
@import '~@/css/config'
@import '~@/css/mixins'

.contest-entered-dialog
  text-align: center
  color: #fff
  border-radius: 3px
  border: solid 1px #fff
  background-image: linear-gradient(to bottom, #306c9e, #001c32)
  .contest-info-dialog--usericon
    display: inline-block
    background-image: url(icons-path'/'contest_alias'.svg')
    height: 33px
    width: 33px
    margin-right: 8px
  .contest-alias-wrapper
    display: flex
    justify-content: center
    align-items: center
    margin-bottom: 15px
  .contest-name 
    background-color: #d1f0f2
    padding: 10px 0
    color: var(--text-color)
    font-size: 18px
    font-weight: 600
    margin-bottom: 15px
  .contest-start-time 
    color: #3ca77c
    font-size: 16px
    font-weight: 600
    margin-bottom: 32px
  button.theme--light.v-btn.btn--ok 
    background-color: #3ca77c
    color: #fff
    border: 1px solid #3ca77c
  h3 
    margin-bottom: 32px
    font-family: 'Open Sans Regular'
    font-weight: 400
  p
    margin: 0
</style>
