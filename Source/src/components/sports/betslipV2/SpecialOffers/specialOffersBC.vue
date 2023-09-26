<template>
<!--  https://app.zeplin.io/project/5af9c06bb26cf68d1083d00b/screen/5f7edf26136c16bba74fcbbd-->

  <span class="special-offers" v-if="0||(specialOffersEnabled && specialOffers && specialOffers.length && (currentBetSlipState < 2 || mode === 'eligible'))"
        :class="[mode, 'tab-'+tab, {SgpPlus:isSgpPlus, isSGP:isSGP}]">
<!--    -SpecOff comp- isSGP: {{isSGP}}:<br>-->
<!--    specialOffersEnabled: {{specialOffersEnabled}}<br>-->
<!--    SpecialOffers: {{specialOffers}}<br>-->
<!--    SpecialOffers.length: {{SpecialOffers && SpecialOffers.length}}<br>-->
    <template v-if="mode==='offerMode'">
      <div class="offer offerMode" v-for="offer in specialOffers"
           :class="[offer.Id, 'tab-'+tab, offer.Id+'-'+offer.legsToAdd, {SgpPlus:isSgpPlus, isSGP:isSGP}]"
           :key="offer.Id+'-'+offer.legsToAdd">
        <div :class="offer.Id">
          <div class="offer-name">
            <span class="offer-title"><special-translator :offer="offer" :phrId="'offer.title'"></special-translator></span>
            <span class="offer-mark" ><special-translator :offer="offer" :phrId="'offer.mark'"></special-translator></span>
            <span class="info-badge" ><a @click="popInfo(offer)"><v-icon>info_outline</v-icon></a></span>
          </div>
          <div class="offer-info">
            <special-translator class="legs-to-add" :offer="offer" :key="'legsToAdd-'+offer.legsToAdd" :phrId="'offer.addLeg' + (offer.legsToAdd == 1 ? '' : 's')"></special-translator>
            <special-translator class="so-description" :offer="offer" :phrId="'offer.Description'"></special-translator>
<!--            <special-translator v-if="offer.isCapped" :offer="offer" :key="'cap-'+offer.isCapped" :phrId="'offer.refund' + (offer.isCapped ? '.capped' : '')"></special-translator>-->
<!--            <special-translator v-if="offer.insuredLegs" :offer="offer" :key="'insuredLegs-'+offer.insuredLegs" :phrId="'offer.ifLoser' + (offer.insuredLegs == 1 ? '' : 's')"></special-translator>-->

<!--            <span v-translate="{cap: offer.isCapped}">{{'SpecialOffer.PARLAYINSURANCE.refund' + (offer.isCapped ? '.capped' : '')}}</span>-->
<!--            <span v-translate="{insuredLegs: offer.insuredLegs}">{{'SpecialOffer.PARLAYINSURANCE.ifLoser' + (offer.insuredLegs == 1 ? '' : '.pl')}}</span>-->
          </div>
        </div>

      </div>
    </template>

    <template v-if="mode==='eligible'">
      <span class="offer eligible" v-for="offer in specialOffers"
            :class="['tab-'+tab, offer.Id+'-'+offer.Amount]"
            :key="offer.Id+'-'+offer.Amount">

        <span :class="offer.Id" :set="[bonus=calcBonus(offer)]">
          <span class="bonus-label" :class="{noBonusValue:!(!isForBetPlacement && offer.Amount && bonus)}" >
            <special-translator :offer="offer" :phrId="'eligible'"></special-translator>
          </span>
          <span class="bonus-value" v-if="!isForBetPlacement && offer.Amount && bonus">{{ bonus | currency}}</span>
        </span>
      </span>
    </template>

    <v-dialog content-class="dialog-special-offer-info" v-model="dialogSpecialOfferInfo.active" persistent :fullscreen="false">
      <special-offer-info :dialogSpecialOfferInfo="dialogSpecialOfferInfo" ></special-offer-info>
    </v-dialog>

<!--    {{tab}}:-->
<!--    isSGP:{{isSGP}}<br>-->
<!--    betTypeStake: {{betTypeStake}}<br>-->
<!--    winning: {{winning}}<br>-->
<!--    winnings: {{winnings}}<br>-->
<!--    allowedBetTypesAndReturn: {{allowedBetTypesAndReturn}}<br>-->
<!--    potentialReturn: {{potentialReturn}}<br>-->
<!--    allowedBetTypesAndReturns: {{allowedBetTypesAndReturns}}<br>-->
<!--    {{SpecialOffers}}-->
<!--    betTypeStakesAll:{{betTypeStakesAll.XP}}<br>-->

<!--    {{activeSelections}}-->
<!--    expectedPotentialReturn: {{expectedPotentialReturn}}-->
  </span>
</template>

<script>
  //  import Vue from 'vue'
  import store from '@/store'
  import Icon from '@/components/common/Icon'
  import specialOfferInfo from './specialOfferInfoDialog.vue'
  import specialTranslator from './specialTranslator.vue'

  export default {
    name: 'specialOffers',

    props: ['mode', 'id', 'allowedBetTypesAndReturns', 'isSGP', 'isSgpPlus', 'isForBetPlacement'],

    mixins: [],

    components: {Icon, specialOfferInfo, specialTranslator},

    data () {
      return {
      }
    },

    computed: {
      currentBetSlipState () {
        return store.getters['sbBetslipState/currentBetSlipState']
      },
      tab () {
        return store.getters['sbBetslipState/tab']
      },
      specialOffersEnabled () {
        return store.getters['sbBetslipState/specialOffersBcEnabled']
      },
      specialOffersIds () {
        return store.getters['sbBetslipState/specialOffersIds']
      },
      allowedBetTypesAndReturn () {
        let abtnr = this.isSGP ? this.allowedBetTypesAndReturns
          : this.allowedBetTypesAndReturns
        // console.log('allowedBetTypesAndReturn:', abtnr)
        return abtnr
      },
      potentialReturn () {
        // return this.allowedBetTypesAndReturns &&
        // this.allowedBetTypesAndReturns.PotentialReturns &&
        // this.allowedBetTypesAndReturns.PotentialReturns.PerBetType &&
        // this.allowedBetTypesAndReturns.PotentialReturns.PerBetType[this.isSGP ? 'SGP' : this.id]
        let potentialReturn = this.isSGP ? this.allowedBetTypesAndReturn
          : this.allowedBetTypesAndReturn
        // console.log('potentialReturn:', potentialReturn)
        return potentialReturn
      },
      betTypeStakesAll () {
        return store.getters['sbBetslipState/betTypeStakes']
      },
      /*
      activeSelections () {
        return store.getters['sbBetslipState/activeSelections'](this.tab)
      },
      expectedPotentialReturn () {
        let pr = 1
        let activeSelections = this.activeSelections || []
        for (let selection of activeSelections) {
          pr *= (1 + selection.currentpriceup / selection.currentpricedown)
        }
        return pr
      },
      */
      betTypeStake () {
//        return this.stakes[this.id]
        var betTypeStake = 0
        if (this.isSGP) {
          betTypeStake = this.allowedBetTypesAndReturn && this.allowedBetTypesAndReturn.Entity &&
            this.betTypeStakesAll &&
            this.betTypeStakesAll.XP &&
            this.betTypeStakesAll.XP.PerEvent &&
            this.betTypeStakesAll.XP.PerEvent[this.allowedBetTypesAndReturn.Entity]
        } else {
          betTypeStake = this.betTypeStakesAll && this.betTypeStakesAll[this.tab] && this.betTypeStakesAll[this.tab].PerBetType && this.betTypeStakesAll[this.tab].PerBetType.A
        }
        //
        betTypeStake = parseFloat((betTypeStake * 1).toFixed(2))
        // console.log('betTypeStake:', betTypeStake)
        return betTypeStake || 0
      },
      specialOffers () {
        // console.log('compute SpecialOffers')
        if (!this.specialOffersEnabled) {
          return []
        }
        //
        let resp = []
        let specialOffersIds = this.specialOffersIds || []
        let responses = {}
        for (let id of specialOffersIds) {
          responses[id] = []
        }
        //
        let offers = this.isSGP ? this.allowedBetTypesAndReturn && this.allowedBetTypesAndReturn.SpecialOffer
          : this.potentialReturn && this.potentialReturn.SpecialOffers

        if (this.specialOffersEnabled && offers) {
          // console.log('offers:')
          // console.log(offers)
          for (let key in offers) {
            let arr = offers[key]
            if (arr.length && ((key === '0' && this.mode === 'eligible') || (key !== '0' && this.mode !== 'eligible'))) {
              for (let offer of arr) {
                // console.log('offer:', offer)
                // offer.Amount = offer.Amount && parseFloat(offer.Amount.toFixed(2))
                offer.legsToAdd = Number(key)
                //
                offer.shortDescription = offer.shortDescription || ''
                if (!offer.shortDescription) {
                  let descriptions = offer.Description ? offer.Description.split(/\r\n|\n/) : []
                  if (descriptions.length >= 2) {
                    offer.shortDescription = descriptions[0].trim()
                    if (offer.shortDescription) {
                      offer.Description = offer.Description.replace(offer.shortDescription, '')
                    }
                    offer.Description = offer.Description.trim()
                  }
                  // console.log('shortDescription:', offer.shortDescription)
                  // console.log('Description:', offer.Description)
                }
                //
                offer.shortDescription = offer.shortDescription || offer.Name
                //
                if (offer.Id === 'PARLAYINSURANCE') {
                  offer.insuredLegs = 1 /* ??? */
                  // let isPayoutCapped = this.allowedBetTypesAndReturns.PotentialReturn === 300 /* CHECK THIS */
                  // console.log('isPayoutCapped:', isPayoutCapped)
                  offer.isCapped = offer.Amount
                }
                // resp.push(offer)
                //
                if (!specialOffersIds.includes(offer.Id)) {
                  specialOffersIds.push(offer.Id)
                }
                responses[offer.Id] = responses[offer.Id] || []
                responses[offer.Id].push(offer)
              }
            }
          }
        }
        //
        /*
        let filterTo1stUpSellOnly = false
        if (filterTo1stUpSellOnly) {
          if (this.mode === 'eligible') {
            let maxBoost = responses['0'].filter(r => r.Id === 'PARLAYBOOST')
            if (maxBoost && maxBoost.length) {
              maxBoost = [maxBoost.reduce((prev, current) => (prev.Amount > current.Amount) ? prev : current)]
            }
            responses['0'] = maxBoost.concat(responses['0'].filter(r => r.Id === 'PARLAYINSURANCE'))
          }
          resp = [...responses['0'], ...responses.PARLAYBOOST, ...responses.PARLAYINSURANCE]
        }
        */
        /*
        if (this.mode === 'eligible') {
          resp = resp.sort((a, b) => (a.Id > b.Id) ? 1 : ((b.Id > a.Id) ? -1 : 0))
        }
        */
        //
        for (let id of specialOffersIds) {
          resp = resp.concat(responses[id])
        }
        // console.log(this.mode, 'resp:', resp)
        return resp
      },
      winnings () {
        return store.getters['sbBetslipState/returns']
      },
      winning () {
        // console.log('compute winning')
        let win = !this.isSGP ? this.winnings && this.winnings[this.tab] && this.winnings[this.tab].PerBetType &&
          this.winnings[this.tab].PerBetType[this.id] : this.allowedBetTypesAndReturn && this.allowedBetTypesAndReturn.Entity && this.winnings && this.winnings.XP &&
          this.winnings.XP.PerEvent && this.winnings.XP.PerEvent[this.allowedBetTypesAndReturn.Entity]
        win = win || 0
        win = win && parseFloat((win * 1).toFixed(2))
        // console.log('compute winning', win)
        return win
      },
      dialogSpecialOfferInfo () {
        return store.getters['overlayState/getSpecialOfferInfoState']
      }
    },

    methods: {
      /*
      calcBonusPrc (amount) {
        // console.log('calcBonusPrc for:', amount)
        if (!amount) {
          return 0
        }
        // let potentialReturn = this.allowedBetTypesAndReturn && (this.allowedBetTypesAndReturn.PotentialReturn || this.allowedBetTypesAndReturn.PotentialReturns)
        let potentialReturn = this.potentialReturn && this.potentialReturn.PotentialReturn
        let unitCount = (this.potentialReturn && this.potentialReturn.UnitCount) || 1
        let prc = 100 * amount / (potentialReturn - unitCount)
        // console.log(100 + ' * ' + amount + ' / (' + potentialReturn + ' - ' + unitCount + ') = ' + prc)
        prc = parseFloat(prc.toFixed(2))
        return prc
      },
      */
      calcBonus (offer) {
        // PARLAYBOOST
        // PARLAYINSURANCE
        let amount = offer.Amount
        let m = this.betTypeStake // for PARLAYBOOST
        if (offer.Id === 'PARLAYINSURANCE') {
          m = 0
        }
        let b = amount * m
        // let prc = this.calcBonusPrc(amount)
        // let b = this.winning && prc && (this.winning * prc) / 100
        b = b || 0
        b = b && parseFloat(b.toFixed(2))
        return b
      },
      popInfo (offer) {
        store.dispatch('overlayState/activateSpecialOfferInfo', offer)
      }
    },

    created () {

    },

    watch: {
    },

    beforeDestroy () {
//      console.log('beforeDestroy:')
    },

    destroyed () {
//      console.log('Destroy:')
    }
  }
</script>

<style lang="stylus" scoped>
@import "~@/css/config"
.special-offers
  font-family 'Open Sans Regular'
  font-size 13px;
  color: #3e4e5f;
  &.offerMode
    .offer
      background-color: #fff5db;
      padding: 0px 0px;
      margin: 8px 0px;
      margin-bottom: 0;
      border-radius: 0px;
      border: solid 1px #ffcb4d;
      padding: 8px 12px;
      .offer-name
        font-family 'Open Sans Bold'
        text-transform uppercase
        .offer-mark
          letter-spacing: 1.17px;
          background-color: #ffcb4d;
          color: #244368;
          padding: 1px 4px 2px 4px;
          margin-left: 2px;
          border-radius: 2px;
          background-color: #ffcb4d;
      &.isSGP
        margin: 8px 8px 0 8px;
      &.PARLAYINSURANCE
        background-color: #dfeff9;
        border: solid 1px #cfd6db;

  &.eligible
    font-weight: 100;
    letter-spacing: 0px;
    display: inline-block;
    .offer
      display: inline-block;
      /*line-height: 1.3;*/
      //font-family 'Proxima Nova Condensed';
      letter-spacing: 0px;
      text-transform: uppercase;
      margin-right: 4px
      .PARLAYBOOST
        display: inline-block;
        background-color: #ffcb4d;
        border: solid 1px #ffcb4d;
        color: #244368;
        margin-right: 3px;
        border-radius: 2px;
        padding-left: 3px;
        .bonus-label.noBonusValue
          padding-right 3px
        .bonus-value
          display: inline-block;
          background-color: #fff5db;
          color: #224269;
          border-radius: 0 2px 2px 0;
          padding: 0 2px 0 3px;
      .PARLAYINSURANCE
        display: inline-block;
        background-color: #294b75;
        border: solid 1px #294b75;
        color: #fff;
        font-weight: 100;
        border-radius: 2px;
        padding: 0 0px 0 3px;
        .bonus-label.noBonusValue
          padding-right 3px
        .bonus-value
          display: inline-block;
          background-color: #dfeff9;
          color: #3e4e5f;
          border-radius: 0 2px 2px 0;
          padding: 0 2px 0 3px;
      &:first-child
        margin-left: 0;
    &.SgpPlus
      display: block;
      margin-left: 16px;
    &.isSGP
      /*display: block;*/
      margin-left: 0px;

  .info-badge
    float: right
    .v-icon
      color #0b4da1

.betDetails
  .special-offers
    &.eligible
      display: inline-block
      &.SgpPlus
        margin-left: 0px
</style>
