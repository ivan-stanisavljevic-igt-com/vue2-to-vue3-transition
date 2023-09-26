<template>
    <v-dialog
      v-model="show"
      height="100%"
      content-class="contests-switch-alias-dialog"
    >
      <span class="contest-info-name-details--usericon"></span>
      <p class="switch-alias--title">{{ $t('Contests.Switch.Alias.Title') }}</p>
      <p class="text-gray" v-html="$t('Contests.Switch.Alias.Info.No', {numberOfContestEntries: numberOfContestEntries})"></p>
      <p class="contest-bold">{{ contestName }}</p>
      <ul>
        <li v-for="entry in contestEntries" :key="entry.contestEntryId" @click="show = false">
          <router-link class="contest-alias--link" :to="{ name: 'contests/my-picks', params: { contestId: entry.contest.id, contestEntryId: entry.contestEntryId } }">
            {{ entry.alias}}
          </router-link>
        </li>
      </ul>
    </v-dialog>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  props: ['showPopupSwitchAlias'],
  computed: {
    ...mapGetters('contests', [
      'getContestEntriesForContest'
    ]),
    show: {
      get () {
        return this.showPopupSwitchAlias
      },
      set (value) {
        this.$emit('switch-alias-popup-close', value)
      }
    },
    contestId () {
      return Number(this.$route.params.contestId)
    },
    contestEntries () {
      return this.getContestEntriesForContest(this.contestId)
    },
    contest () {
      return this.contestEntry && this.contestEntry.contest
    },
    contestName () {
      return this.contest && this.contest.name
    },
    numberOfContestEntries () {
      return this.contestEntries && this.contestEntries.length
    }
  }
}
</script>

<style lang="stylus">
@import '~@/css/config'
@import '~@/css/mixins'

.contests-switch-alias-dialog
  color #fff
  position absolute
  background: #003764
  border 1px solid #fff
  text-align center
  border-radius: 3px
  width: 90%
  z-index 10002
  top 153px
  padding 20px 0
  .switch-alias--title
    margin-bottom 15px
    font-weight 700
    letter-spacing: 1px
  .contest-bold
    font-weight 700
    letter-spacing: 1px
  p
    margin: 0
  .text-gray
    color: #dbdce0
  ul
    list-style-type none
    padding 0
    margin-top 20px
    li 
      padding 10px 0
      border-bottom 1px solid #dbdce080
      font-size 13px
      letter-spacing: 1px
    li:first-child
      border-top 1px solid #dbdce080
  .contest-info-name-details--usericon
    display: inline-block
    background-image: url(icons-path'/'contest_alias'.svg')
    height: 40px
    width: 40px
  .contest-alias--link
    color: #fff
</style>
