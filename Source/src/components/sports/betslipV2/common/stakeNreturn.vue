<template>
  <div class="stake-n-return" v-if="showMoneyInput && (currentBetSlipState<=1 || stake)">
    <div class="stake-line"  >

      <span class="stake">
        <money-input
          v-model="stake"
          :id="1"
          :inputType="'wager'"
          :placeholder="placeholder.wager"
          :focus="focus"
          @setFocus="setFocus"
          @dismissError="dismissError"
          :currentBetSlipState="currentBetSlipState"
          :stakeChanged="[5, 6].includes(currentBetSlipState) && (inRefferalStakeChanged || nonReferalStakeChanged)"
          :stakeChange="stakeChange"
          @hasError="hasError"
          :perType="perType"
          :minStake="minStake[perType]"
          :maxStake="maxStake[perType]"
          :statusToConfirm="statusToConfirm"
        ></money-input>
      </span>

      <span class="returns">
        <money-input
          v-model="winning"
          :id="2"
          :inputType="'winning'"
          :placeholder="placeholder.winning"
          :focus="focus"
          @setFocus="setFocus"
          @dismissError="dismissError"
          :currentBetSlipState="currentBetSlipState"
          @hasError="hasError"
          :perType="perType"
          :minStake="minStake[perType]"
          :maxStake="maxStake[perType]"
          :statusToConfirm="statusToConfirm"
        ></money-input>
      </span>

    </div>

    <div v-if="stake && voucher" class="voucher">
      {{ $t('BetSlip.StakeAdReturn.promotions.discount') }}: <span class="discount">{{ currencySymbol }}{{voucher.toFixed(2)}}</span>
    </div>

    <div v-if="hasErrors" class="error-msg">
      <v-icon>info_outline</v-icon>
      <div v-for="e in errors">
        <span :key="e" v-if="e" :id="perType + 'BetSlipErrorMessageId'">
          {{ $t('BetSlip.stakeNreturn.error.' + e, {min:minStake[perType], max:maxStake[perType], currency: currencySymbol}) }}</span>
      </div>
    </div>

<!--    <br>tab: {{tab}}-->
    <!--<br>id: {{id}}-->
    <!--<br>derivativeId: {{derivativeId}}-->
    <!--<br>stake: {{stake}}-->
    <!--<br>winning: {{winning}}-->
    <!--<br>hasErrors: {{hasErrors}}-->
    <!--<br>errors: {{errors}}-->
    <!--<br>perType: {{perType}}-->
<!--    <br><b>betTypeStakes:</b> {{betTypeStakes[tab]}}-->
<!--    <br><b>betTypeStake:</b> {{betTypeStake}}-->
    <!--<br><b>winnings:</b> {{winnings[tab]}}-->
<!--    <br><b>betTypeStakes:</b> {{betTypeStakes}}-->
<!--    <br>winning: {{winning}}-->
    <!--<br>potentialReturn: {{potentialReturn}}-->
    <!--<br>unitCount: {{unitCount}}-->
<!--    <br>allowedBetTypesAndReturns: {{allowedBetTypesAndReturns}}-->
    <!--<br>currentBetSlipState: {{currentBetSlipState}}-->
    <!--<br>inRefferal: {{inRefferal}}-->
    <!--<br>stakeChange: {{stakeChange}}-->
    <!--<br>promotionsData: {{promotionsData}}-->
    <!--<br>voucher: {{voucher}}-->
    <!--<br>teaserGroupId: {{teaserGroupId}}-->
    <!--<br>isFastBet: {{isFastBet}}-->
<!--    <br>unitCount: {{unitCount}}-->
<!--    <br>potentialReturn: {{potentialReturn}}-->
  </div>
</template>

<script>
  import Vue from 'vue'
  import config from '@/config'
  import store from '@/store'
  import moneyInput from './moneyInput'
  import Icon from '@/components/common/Icon'

  export default {
    name: 'stakeNreturn',

    mixins: [],

    props: ['id', 'perType', 'tab', 'currentBetSlipState', 'allowedBetTypesAndReturns', 'teaserGroupId',
      'isSGM', 'sgmPath', 'isFastBet', 'derivativeId', 'statusToConfirm'],

    components: {
      Icon,
      moneyInput
    },

    data () {
      return {
        setter: null,
        focus: [0],
        stakeChange: {},
        inRefferalStakeChanged: false,
        nonReferalStakeChanged: false,
        errors: {},
        freshFromGet: false,
        showMoneyInput: true
      }
    },

    computed: {
      minStake () {
        return store.getters['sbBetslipState/minStake']
      },
      maxStake () {
        return store.getters['sbBetslipState/maxStake']
      },
      inRefferal () {
        return store.getters['sbBetslipState/inRefferal']
      },
      betTypeStakes () {
        return store.getters['sbBetslipState/betTypeStakes']
      },
      multiSinglesStake () {
        return store.getters['sbBetslipState/multiSinglesStake']
      },
      betTypeStake () {
        if (this.isSGM && this.tab === 'XP') {
          var betTypeStakes
          if (this.sgmPath && this.sgmPath.length) {
            betTypeStakes = this.betTypeStakes
            this.sgmPath.forEach(function (p) {
              betTypeStakes = betTypeStakes[p]
            })
          } else {
            betTypeStakes = this.betTypeStakes.XP.PerEvent
          }
          return betTypeStakes
        }
        return this.tab === 'TEASER' ? this.betTypeStakes[this.tab][this.teaserGroupId][this.perType] : this.betTypeStakes[this.tab][this.perType]
      },
      unitCount () {
        if (this.isSGM) {
          return this.allowedBetTypesAndReturns && this.allowedBetTypesAndReturns.UnitCount
        }
        return this.allowedBetTypesAndReturns && this.allowedBetTypesAndReturns.UnitCount
      },
      potentialReturn () {
        if (this.isSGM) {
          return this.allowedBetTypesAndReturns && this.allowedBetTypesAndReturns.PotentialReturn
        }
        return this.allowedBetTypesAndReturns && this.allowedBetTypesAndReturns.PotentialReturn
      },
      placeholder () {
        return {
          wager: this.$t('BetSlip.input.placeholder.wager'),
          winning: this.$t('BetSlip.input.placeholder.return')
        }
      },
      stake: {
        get: function () {
          let s = this.betTypeStake[this.id]
          // console.log('Get stake (' + this.id + '): ' + s)
          var self = this
          self.freshFromGet = true
          setTimeout(function () {
            self.freshFromGet = false
          }, 0)
          return s
        },
        set: function (v) {
          // console.log('set stake (' + this.id + '): ' + v + '; (' + typeof v + '); freshFromGet: ' + this.freshFromGet, '; setter:', this.setter)
          if (!this.freshFromGet) {
            Vue.set(this.betTypeStake, this.id, v)
          }
          this.freshFromGet = false
          // let vOK = v || [0, '0', ''].includes(v)
          if (typeof v === 'number' && this.isFastBet) {
            store.commit('sbBetslipState/setSingleBetSlipStake', v)
          }
          if (this.unitCount && (!this.setter)) {
            this.setter = this.setter || 'wager'
            this.calculateWinning(v, 'stake-Set')
          }
          this.setter = null
        }
      },
      winnings () {
        return store.getters['sbBetslipState/returns']
      },
      winningPerTab () {
        if (this.isSGM && this.tab === 'XP') {
          return this.winnings.XP.PerEvent
        }
        return this.tab === 'TEASER' ? this.winnings[this.tab][this.teaserGroupId][this.perType] : this.winnings[this.tab][this.perType]
      },
      winning: {
        get: function () {
          let w = this.winningPerTab[this.id]
//          console.log('get winning (' + this.id + '): ' + w)
          return w
        },
        set: function (v) {
          // console.log('set winning (' + this.id + '): ' + v + ' (' + typeof v + ')' + '; setter: ' + this.setter)
          Vue.set(this.winningPerTab, this.id, v)
          if (this.unitCount && (!this.setter)) {
            this.setter = this.setter || 'winning'
            this.calculateStake(v, 'winning-set')
          }
          this.setter = null
        }
      },

      hasErrors () {
        return this.errors.wager || this.errors.winning
      },
      promotionsData () {
        var promotionsData = store.getters['sbBetslipState/promotionsData']
//        console.log('promotionsData:')
//        console.log(promotionsData)
        if (this.isSGM && this.tab === 'XP') {
          promotionsData = promotionsData && promotionsData.XP
        } else {
          promotionsData = promotionsData && promotionsData[this.tab]
          if (this.tab === 'TEASER') {
            promotionsData = promotionsData[this.teaserGroupId]
          }
        }
        promotionsData = promotionsData || {}
        return promotionsData
      },
      voucher () {
        var voucher = this.promotionsData || 0
        var id = this.derivativeId || this.id
        if (this.isSGM && this.tab === 'XP') {
          voucher = voucher.PerEvent && voucher.PerEvent[this.id]
        } else {
          if (typeof id === 'number') {
            voucher = voucher.PerSelection && voucher.PerSelection[id]
          } else {
            voucher = voucher.PerBetType && voucher.PerBetType[id]
          }
        }
        return voucher
      },
      currencySymbol () {
        return config.app.CURRENCY
      }
    },

    methods: {
      calculateStake (winning, caller) {
        if (!this.setter) {
          return
        }
        let s = null
        let v = winning || this.winning
        if (typeof v === 'number') {
          let w = parseFloat(v.toFixed(2))
          s = w / (this.potentialReturn - this.unitCount)
          s = Math.ceil(s / 0.01) * 0.01
        }
        // console.log('calculateStake for winning: ' + winning + ' (setter : ' + this.setter + ') -> ' + s, '; caller:', caller, '; isFastBet:', this.isFastBet)
//        this.stake = s
//        this.stake = s ? parseFloat(s.toFixed(2)) : null
        //
        if (s) {
          s = parseFloat(s.toFixed(2))
          if (this.stake !== s) {
            this.stake = s
          } else {
            // console.log('Stake already calculated and set!!; isFastBet:', this.isFastBet)
          }
        } else {
          this.stake = null
        }
        // clear setter last, after setting stake ^
        this.setter = null
      },
      calculateWinning (stake, caller) {
        let v = stake || this.stake
        let w = null
        if (typeof v === 'number') {
          let s = parseFloat(v.toFixed(2))
          w = (this.potentialReturn - this.unitCount) * s
        }
        // console.log('calculateWinning for stake: ' + v + ' -> ' + w, '; Caller:', caller, '; isFastBet:', this.isFastBet)
        // console.log('w is:', typeof w, '; isNaN:' + isNaN(w))
//        this.winning = w
        //  this.winning = w ? parseFloat(w.toFixed(2)) : null
        if (typeof w === 'number') {
          w = parseFloat(w.toFixed(2))
          if (this.winning !== w) {
            this.winning = w
          } else {
            // console.log('Winning already calculated and set!!; isFastBet:', this.isFastBet)
          }
        } else {
          this.winning = null
        }
        //
        this.setter = null
      },
      setFocus (id, val) {
//        this.focus[id] = val
        if (val) {
          Vue.set(this.focus, 0, id)
        } else {
          if (this.focus[0] === id) {
            Vue.set(this.focus, 0, 0)
          }
        }
      },
      killFocus (id) {
        this.focus[id] = !true
      },
      dismissError (id, hasError) {
//        console.log('dismissError: ' + JSON.stringify(hasError))
        store.commit('sbBetslipState/dismissErrorFromSelection', hasError)
      },
      hasError (val) {
//        console.log('hasError: ' + JSON.stringify(val))
//        this.errors[val[0]] = val[1]
        Vue.set(this.errors, val[0], val[1])
      }
    },

    created () {
    },

    mounted () {
    },

    watch: {
      /*
      errors: {
        immediate: true,
        handler (newVal, oldVal) {
          console.log('Watch errors: ')
          console.log(JSON.stringify(newVal))
        }
      },
      */
      currentBetSlipState: {
        immediate: true,
        handler (newVal, oldVal) {
//          console.log('currentBetSlipState: ' + oldVal + ' => ' + newVal)
          this.$emit('hideBetType', (newVal > 1 && !this.stake))
          //
          if (newVal <= 1) {
            Vue.set(this, 'showMoneyInput', true)
            Vue.set(this, 'inRefferalStakeChanged', false)
            Vue.set(this, 'nonReferalStakeChanged', false)
          }
        }
      },
      statusToConfirm: {
        immediate: true,
        handler (newVal, oldVal) {
//          console.log('statusToConfirm: ' + oldVal + ' => ' + newVal)
          if (oldVal === 'Rejected' && this.currentBetSlipState === 10) {
            this.$emit('hideBetType', true)
            if (this.perType === 'PerSelection') {
              Vue.set(this, 'showMoneyInput', false)
            }
          }
        }
      },
      potentialReturn: {
        immediate: true,
        handler (newVal, oldVal) {
          // console.log('potentialReturn (' + this.perType + ') ' + this.id + ': ' + oldVal + ' => ' + newVal, '; isFastBet:' + this.isFastBet)
          if (newVal) {
            this.setter = 'winning'
            this.calculateWinning(null, 'potentialReturn')
//          Vue.set(this, 'stake', this.stake)
          }
        }
      },
      multiSinglesStake: {
        immediate: !true,
        handler (newVal, oldVal) {
         // console.log('multiSinglesStake (' + this.perType + ') ' + this.id + ': ' + oldVal + ' => ' + newVal)
          if (this.perType === 'PerSelection') {
            let s = newVal || ''
            Vue.set(this, 'stake', s)
            this.calculateWinning(s, 'multiSinglesStake')
          }
        }
      },
      stake: {
        immediate: true,
        handler (newVal, oldVal) {
          // console.log('Stake (' + this.id + ') changed: ' + oldVal + ' -> ' + newVal + ' type: ' + typeof newVal + '; setter: ' + this.setter)
          let ov = (oldVal && !isNaN(oldVal) && parseFloat((1 * oldVal).toFixed(2))) || 0
          let nv = (newVal && !isNaN(newVal) && parseFloat((1 * newVal).toFixed(2))) || 0
          if (nv !== ov) {
            this.stakeChange = {old: (oldVal && parseFloat((1 * oldVal).toFixed(2))) || 0, new: newVal}
            this.inRefferalStakeChanged = this.inRefferal
            this.nonReferalStakeChanged = this.currentBetSlipState && !this.inRefferal
            if (this.inRefferal || this.currentBetSlipState) {
              this.setter = 'wager'
              this.calculateWinning(newVal, 'stake-Watcher')
            }
          }
          if (newVal && this.isFastBet) {
            store.commit('sbBetslipState/setSingleBetSlipStake', newVal)
          }
        }
      }
    },

    destroyed () {
    }
  }
</script>

<style lang="stylus" scoped>
  @import "~@/css/config"
  .stake-line {
    color: #000;
    display: flex;
    > span {
      text-align: center;
      margin-right: 8px;
      flex: 1;

      &:last-child {
        margin-right: 0;
      }
      /*padding: 3px;*/
    }
    span.label-returns {
      width: 23%;
    }
  }
  .voucher {
    margin: 4px 0 0px 0;
    .discount {
      color: #06283b;
      font-weight: bold;
    }
  }
  .error-msg
    display: flex
    padding: 10px
    margin: 7px 0px 0
    background-color: rgba(228, 66, 66, 0.1)
    color: #DB3F3F
    font-weight: normal
    text-transform: uppercase
    text-align: left
    font-size: 12px
    line-height: 14px
    align-items: center
    justify-content: left
    .v-icon
      color red
</style>
