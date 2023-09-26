<template>
  <div class="contest-alias-page">
    <h1 class="contest-name">{{ contestName }}</h1>
    <div class="contest-content-wrap">
      <div class="contest-pick-alias">
        <span class="contest-info-name-details--usericon"></span>
        <p>{{ $t('Contests.Alias.Page.Alias') }}</p>
        <input v-model="aliasModel" type="text" placeholder="Enter Alias" />    
      </div>
      <div class="contest-charge-fee">
        <p class="contest-charge-fee-text">{{ $t('Contests.Alias.Page.Fee') }}</p>
        <p class="contest-charge-fee-number">${{ contestEntryFee }}</p>
      </div>
      <img src="@/assets/images/contests/alias_contest.jpg" alt="contests-img" />
      <div class="d-flex align-center contest-buttons">
        <v-btn class="btn--cancel" :to="{ name: 'contests' }" active-class="">
          {{ $t('Contests.Alias.Page.Cancel') }}
        </v-btn>
        <v-btn class="btn--accept" @click="submitAlias" :disabled="!aliasModelTrimmed">
          {{ $t('Contests.Alias.Page.Submit') }}
        </v-btn>
      </div>
    </div>
  </div>
</template>

<script>
import store from '@/store'
import router from '@/router'
import { mapGetters } from 'vuex'
import Session from '@/components/mixins/Session'
import contestsErrorDialog from '@/components/sports/contests/contestsErrorDialog.vue'

export default {
  name: 'ContestAliasPage',
  components: {
    contestsErrorDialog
  },
  mixins: [
    Session
  ],
  data () {
    return {
      aliasModel: ''
    }
  },
  computed: {
    ...mapGetters('contests', [
      'getContestFromContests'
    ]),
    contestId () {
      return Number(this.$route.params.contestId)
    },
    contest () {
      return this.getContestFromContests(this.contestId)
    },
    contestName () {
      return this.contest && this.contest.name
    },
    contestEntryFee () {
      return this.contest && this.contest.entryFee
    },
    aliasModelTrimmed () {
      return this.aliasModel.trim()
    }
  },
  methods: {
    submitAlias () {
      if (this.aliasModel) {
        store.dispatch('contests/registerContestEntry', {
          contestId: this.contestId,
          alias: this.aliasModel
        }).then(response => {
          if (response && response.Result && !response.Error) {
            store.dispatch('getCustomerContext')
            router.push({ name: 'contests/registration/registrationsuccessful', contestId: this.contestId })
          } else {
            this.activateErrorDialog(response.Error.Message)
          }
        })
      } else {
        this.activateErrorDialog(`Alias can't be empty.`)
      }
    },
    activateErrorDialog (errorMessage) {
      store.dispatch('overlayState/activateContestsErrorDialogState')
      store.commit('contests/setErrorDialogMessage', errorMessage)
    }
  },
  mounted () {
    this.userIsActive()
  }
}
</script>

<style lang="stylus" scoped>
@import '~@/css/config'
@import '~@/css/mixins'

img
  max-width: 100%
.contest-buttons
  max-width: 500px
  margin: 16px auto 0 auto
  @media mobile-big-and-below
    max-width: 100%
  *
    margin: 0
  button.theme--light.v-btn.btn--accept 
    background-color: #3ca77c
    color: #fff
    border: 1px solid #3ca77c
  button.theme--light.v-btn.btn--accept.v-btn--disabled 
    background-color: #c8c8c8 !important
    color: #fff !important
    border: 1px solid #c8c8c8
  a.theme--light.v-btn.btn--cancel
    background-color: transparent
    color: var(--text-color)
    border: 1px solid var(--text-color)
    margin-right: 10px
.contest-alias-page
  padding: 12px 15px
.contest-pick-alias
  background-image: linear-gradient(to bottom, #003764, #578ebc)
  display: flex
  flex-direction: column
  color: #fff
  justify-content: center
  align-items: center
  padding: 27.7px 18px 12px 19px
  border-radius: 3px
  input
    border: 1px solid rgba(0,0,0,0.4)
    background-color: #fff
    border-radius: 3px;
    font-size: 18px
    width: 100%
    color: #4299b4
    text-align: center
    &::placeholder
      color: #4299b4
  p
    margin-bottom: 12px
.contest-charge-fee
  text-align: center
  font-size: 18px
  padding: 14px 20px 10px 14px
  background-color: #e6edef
  margin-top: 10px
  .contest-charge-fee-text
    color: var(--text-color)
    font-weight: 600
    font-size: 13px
  .contest-charge-fee-number 
    color: #c74545
    border: 1px solid #fff
    margin: 10px 0
    padding: 14px 18px 10px 20px
.contest-name
  background-color: #E8F9E5
  padding: 0.675rem 0
  text-align: center
.contest-info-name-details--usericon
  display: inline-block
  background-image: url(icons-path'/'contest_alias'.svg')
  height: 62px
  width: 62px
  margin-bottom: 6px
</style>
