<template>
  <td class="contest-pick-selection" @click="toggleSelection" :class="[{ selected: isSelected, disabled: isDisabled }, `selection--${had}`]">
    {{ selection.name }}
  </td>
</template>

<script>
import store from '@/store'
import { mapGetters } from 'vuex'
import Session from '@/components/mixins/Session'

export default {
  name: 'contestPickSelection',
  mixins: [
    Session
  ],
  props: {
    selection: Object,
    handicap: Number,
    currentlySelectedId: Number
  },
  data () {
    return {
      isSelected: false
    }
  },
  computed: {
    ...mapGetters('contests', [
      'getContestEntry'
    ]
    ),
    contestEntryId () {
      return Number(this.$route.params.contestEntryId)
    },
    contestEntry () {
      return this.getContestEntry(this.contestEntryId)
    },
    contest () {
      return this.contestEntry && this.contestEntry.contest
    },
    contestId () {
      return this.contest && this.contest.id
    },
    contestUniquePicks () {
      return this.contest && this.contest.uniquePicks
    },
    roundNo () {
      return this.contest && this.contest.currentRound && this.contest.currentRound.roundNo
    },
    selectionId () {
      return this.selection && this.selection.id
    },
    had () {
      return this.selection && this.selection.had
    },
    price () {
      return this.selection && this.selection.price
    },
    pickId () {
      return this.selection && this.selection.pickId
    },
    competitorPlayed () {
      return this.selection && this.selection.competitorPlayed
    },
    isDisabled () {
      return this.contestUniquePicks && this.competitorPlayed
    }
  },
  methods: {
    placePick () {
      store.dispatch('contests/placePick', {
        'contestId': this.contestId,
        'contestEntryId': this.contestEntryId,
        'roundNo': this.roundNo,
        'selectionId': this.selectionId,
        'price': this.price,
        'handicap': this.handicap
      }).then(response => {
        if (response && response.Result && !response.Error) {
          this.emitPickId(this.pickId)
        } else {
          this.activateErrorDialog(response.Error.Message)
        }
      })
    },
    cancelAndPlacePick () {
      store.dispatch('contests/cancelAndPlacePick', {
        'contestId': this.contestId,
        'contestEntryId': this.contestEntryId,
        'roundNo': this.roundNo,
        'selectionId': this.selectionId,
        'price': this.price,
        'handicap': this.handicap,
        'cancelPickId': this.currentlySelectedId
      }).then(response => {
        if (response && response.Result && !response.Error) {
          this.emitPickId(this.pickId)
        } else {
          this.activateErrorDialog(response.Error.Message)
        }
      })
    },
    cancelPick () {
      store.dispatch('contests/cancelPick', {
        'pickId': this.pickId,
        'contestId': this.contestId,
        'contestEntryId': this.contestEntryId
      }).then(response => {
        if (response && response.Result && !response.Error) {
          this.emitPickId(this.pickId)
        } else {
          this.activateErrorDialog(response.Error.Message)
        }
      })
    },
    toggleSelection () {
      this.userIsActive()
      if (!this.isSelected && !this.pickId && this.currentlySelectedId) {
        this.cancelAndPlacePick()
      } else if (!this.isSelected && !this.pickId && !this.currentlySelectedId) {
        this.placePick()
      } else if (this.isSelected && this.pickId) {
        this.cancelPick()
      }
    },
    emitPickId (id) {
      this.$emit('emit-pick-id', id)
    },
    activateErrorDialog (errorMessage) {
      store.dispatch('overlayState/activateContestsErrorDialogState')
      store.commit('contests/setErrorDialogMessage', errorMessage)
    }
  },
  watch: {
    pickId (newVal) {
      this.emitPickId(newVal)
      if (newVal) {
        this.isSelected = true
      } else {
        this.isSelected = false
      }
    }
  },
  created () {
    if (this.pickId) {
      this.isSelected = true
      this.emitPickId(this.pickId)
    }
  }
}
</script>

<style lang="stylus" scoped>
.contest-pick-selection
  cursor: pointer
.contest-pick-selection.selected
  background: #3CA77C
  color: #fff
  border-radius 3px
.contest-pick-selection.disabled
  opacity: 0.7
  pointer-events: none
</style>

