<template>
  <div class="contests-terms-and-conditions-page">
    <h1 class="contest-name">{{ contestName }}</h1>
    <div class="contest-content-wrap">
      <div>
        <div v-if="contestRules" v-html="contestRules"></div>
        <div v-else>
          <h2 class="contest-missing-rules-url">{{ $t('Contests.TnC.Missing') }}</h2>
        </div>
      </div>
      <div>
        <div class="contest-terms-actions">
          <div class="d-flex justify-center align-center mt-3">
            <v-switch class="input--accept-terms" v-model="acceptTermsModel" hide-details :disabled="!contestRules" color="success" :label="$t('Contests.TnC.Label')" />
          </div>
          <div class="d-flex align-center mt-3 contest-buttons">
            <v-btn class="btn--cancel" :to="{ name: 'contests' }" active-class="">
              {{ $t('Contests.Alias.Page.Cancel') }}
            </v-btn>
            <v-btn class="btn--accept" :disabled="!acceptTermsModel" :to="{ name: 'contests/registration/alias', params: { contestId: contestId  } }">
              {{ $t('Contests.TnC.Enter') }}
            </v-btn>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import store from '@/store'
import { mapGetters } from 'vuex'
import Session from '@/components/mixins/Session'

export default {
  mixins: [
    Session
  ],
  data () {
    return {
      acceptTermsModel: false,
      rules: ''
    }
  },
  computed: {
    ...mapGetters('contests', [
      'getContestFromContests',
      'getContestRules'
    ]),
    contestId () {
      return Number(this.$route.params.contestId)
    },
    contest () {
      return this.getContestFromContests(this.contestId)
    },
    contestRulesUrl () {
      return this.contest && this.contest.rulesUrl
    },
    contestName () {
      return this.contest && this.contest.name
    },
    contestRules () {
      return this.getContestRules
    }
  },
  watch: {
    contestRulesUrl: function () {
      store.dispatch('contests/fetchContestRules', this.contestRulesUrl)
    }
  },
  created () {
    store.dispatch('contests/fetchContestRules', this.contestRulesUrl)
  },
  mounted () {
    this.userIsActive()
  }
}
</script>

<style lang="stylus" scoped>
@import '~@/css/config'
@import '~@/css/mixins'

.contest-missing-rules-url
  border: 1px solid var(--text-color)
  padding: 1rem
  color: #d60101
.contests-terms-and-conditions-page
  padding: 12px 15px
.contest-missing-rules-url
  text-align: center
.contest-buttons
  max-width: 500px
  margin: 16px auto 0 auto
  @media mobile-big-and-below
    max-width: 100%
  *
    margin: 0
  a.theme--light.v-btn.btn--accept 
    background-color: #3ca77c
    color: #fff
    border: 1px solid #3ca77c
  a.theme--light.v-btn.btn--accept.v-btn--disabled 
    background-color: #c8c8c8 !important
    color: #fff !important
    border: 1px solid #c8c8c8
  a.theme--light.v-btn.btn--cancel
    background-color: transparent !important
    color: var(--text-color)
    border: 1px solid var(--text-color)
    margin-right: 10px
.contest-name
  background-color: #E8F9E5
  color: var(--text-color)
  padding: 0.675rem 0
  text-align: center
.input--accept-terms 
  display: block
  width: 100%
  >>> .v-input__slot
    flex-direction: row-reverse
    justify-content: space-between
  >>> .v-input--selection-controls__input
    margin-right: 0
  >>> label
    font-weight: 600
    color: var(--text-color)
  >>> .v-input--switch__thumb.theme--light.success--text
    color: #fff !important
  >>> .v-input--switch__track.theme--light.success--text
    color: #6EDC5F !important
</style>
