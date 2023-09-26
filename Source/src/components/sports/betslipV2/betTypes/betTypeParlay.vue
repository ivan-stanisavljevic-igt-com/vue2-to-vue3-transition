<template>
  <div class="betType-Parlay" v-show="!isHidden"
       :class="[tab, statusToConfirm ? 'statusToConfirm-' + statusToConfirm : '', {'SGM': isSGM}]" >
    <div class="betType" :class="[tab, {'SGM': isSGM, 'SGMplus': isSgpA}]" v-if="isSGM || (allowedBetTypesAndReturns && allowedBetTypesAndReturns.UnitCount)" >

      <div class="specialOffers-offer-container">
        <special-offers :mode="'offerMode'" :id="id" :isSGP="isSGM" :allowedBetTypesAndReturns="allowedBetTypesAndReturns"></special-offers>
      </div>

      <div v-if="isSGM" class="heading SGM-heading">
        <icon class="sports-icon-sgp" v-if="idfosporttype" :name="'icon-' + idfosporttype.split(' ').join('').toLowerCase()"></icon>
        <span class="SGM-event-name">{{ isSGM }}</span>
        <span class="price" v-if="betslipLayout2 && isSGM && allowedBetTypesAndReturns.Price && parlayTeamsNo && parlayTeamsNo.valid" >
            {{formattedOdds}}
        </span>
        <!--<br>-->
        <div class="SGM-selections-heading" v-if="parlayTeamsNo.valid">
          {{parlayTeamsNo.valid}}
          <span v-if="parlayTeamsNo.valid==1">{{ $t('BetSlip.tab.SGM.heading.selection') }}</span>
          <span v-else>{{ $t('BetSlip.tab.SGM.heading.selections') }}</span>
        </div>
        <div class="no-SGM-spacer" v-else> </div>
      </div>

      <div v-else-if="isSgpA" class="heading-SGP-plus">
        <div class="sgpPlus">
          <span class="sgp-tag"></span>
          <span>{{ participants.legs}} {{ $t('BetSlip.tab.Standard.heading.SGP_PARLAY') }}</span>
          <span class="new-indicator" v-if="sgpPlusMarkAsNew">{{ $t('BetSlip.tab.title.SGP.new') }}</span>

          <span class="price" v-if="betslipLayout2" >
            {{formattedOdds}}
          </span>

        </div>
        <div class="SgpPlusParticipants">
          {{ $t('BetSlip.tab.Standard.heading.SGP_PARLAY.participants' +
          (participants.sgpNo ? '.sgm' : '') + (participants.sgpNo > 1 ? 's':'') +
          (participants.fosNo ? '.fos' : '') + (participants.fosNo > 1 ? 's':''),
          {sgp: participants.sgpNo, fos: participants.fosNo}) }}
        </div>
      </div>

      <div v-else class="title-parlay">
        <div class="betType_header_title">
           <span class="parly_first">
            <span class="allowedBetTypesAndReturns-Name" v-if="allowedBetTypesAndReturns && allowedBetTypesAndReturns.Name">{{allowedBetTypesAndReturns.Name}}</span>
            <span class="generic-Name" v-else>{{ $t('BetSlip.tab.' + tab + '.heading.PARLAY_FIRST') }}</span>
            <span class="teaserLevel" v-if="teaserLevel" :key="'spread-'+spread">{{
              $t('BetSlip.tab.TEASER.heading.level.' + (brandKey === 'circa' && spread ? 'spread' : (spread ? 'spread' : teaserLevel)), {spread:spread}) }}
            </span>
          </span>
          <span class="teams_num">
            &nbsp;{{ allowedBetTypesAndReturns && allowedBetTypesAndReturns.ParticipantsNo}}
            <span key="parly_second">{{ $t('BetSlip.tab.Standard.heading.PARLAY_SECOND') }}</span>
          </span>
          <span v-if="statusToConfirm && brandKey !== 'boyd' && brandKey !== 'rw'" class="statusToConfirm">{{ $t('BetSlip.placement.bet.' + statusToConfirm) }}</span>
          <span class="isForBB float-right" v-if="isForBB">
            <icon name="icon-available-for-bb-white"></icon>
          </span>
          <span v-if="!betslipLayout2" class="special-offers-eligible">
            <special-offers :mode="'eligible'" :id="id" :isSGP="isSGM" :allowedBetTypesAndReturns="allowedBetTypesAndReturns"></special-offers>
          </span>
        </div>
        <div v-if="betslipLayout2" class="price_div">
          <span class="price">{{formattedOdds}}</span>
        </div>
      </div>
      <span v-if="betslipLayout2" class="special-offers-eligible">
        <special-offers :mode="'eligible'" :id="id" :isSGP="isSGM" :allowedBetTypesAndReturns="allowedBetTypesAndReturns"></special-offers>
      </span>

      <!--<span class="available-for-bb" v-if="isParlayForBB && !isSGM"></span>-->
      <!--IGT and DN template -->
      <template v-if="brandKey !== 'boyd' && brandKey !== 'rw'">
        <div class="bet_content" v-if="!isSGM || (isSGM && allowedBetTypesAndReturns.Price && parlayTeamsNo && parlayTeamsNo.valid)">
          <div v-if="!betslipLayout2" class="odds_div" >
            <span class="price_title">{{ $t('BetSlip.oddsprice') }}</span>
            <span class="odds">
                {{formattedOdds}}
            </span>
          </div>
          <div class="stake-n-return">
            <stake-and-return class="clear-both"
              :id="isSGM ? allowedBetTypesAndReturns.Entity : id"
              :perType="'PerBetType'"
              :tab="isSGM ? 'XP' : tab"
              :currentBetSlipState="currentBetSlipState"
              :allowedBetTypesAndReturns="allowedBetTypesAndReturns"
              :teaserGroupId="teaserGroupId"
              @hideBetType="hideBetType"
              :isSGM="isSGM"
              :sgmPath="sgmPath ? sgmPath.split('.') : ''"
              :statusToConfirm="statusToConfirm"
            >
            </stake-and-return>
          </div>
        </div>
      </template>

      <!--BOYD template-->
      <template v-if="!betslipLayout2 && (brandKey === 'boyd' || brandKey === 'rw')">
        <div class="bet_content" v-if="!isSGM ">
          <div class="titleParly" >
            {{ allowedBetTypesAndReturns && allowedBetTypesAndReturns.ParticipantsNo}}
            {{ $t('BetSlip.tab.' + tab + '.heading.PARLAY') }}
            <span class="teaserLevel" v-if="teaserLevel">{{ $t('BetSlip.tab.TEASER.heading.level.' +  teaserLevel) }}</span>
            <span class="isForBB float-right" v-if="isForBB">
              <icon v-if="isForBB" name="icon-available-for-bb-blue"></icon>
            </span>
            <span v-if="statusToConfirm" class="statusToConfirm">{{ $t('BetSlip.placement.bet.' + statusToConfirm) }}</span>
          </div>
          <span class="odds" >
              {{formattedOdds}}
          </span>
        </div>
        <div class="stake-n-return" v-if="!isSGM || (isSGM && allowedBetTypesAndReturns.Price && parlayTeamsNo && parlayTeamsNo.valid)" >
          <stake-and-return class="clear-both"
            :id="isSGM ? allowedBetTypesAndReturns.Entity : id"
            :perType="'PerBetType'"
            :tab="isSGM ? 'XP' : tab"
            :currentBetSlipState="currentBetSlipState"
            :allowedBetTypesAndReturns="allowedBetTypesAndReturns"
            :teaserGroupId="teaserGroupId"
            @hideBetType="hideBetType"
            :isSGM="isSGM"
            :sgmPath="sgmPath ? sgmPath.split('.') : ''"
            :statusToConfirm="statusToConfirm"
          >
          </stake-and-return>
        </div>
      </template>

    </div>
  </div>
</template>

<script>
  //  import Vue from 'vue'
  import store from '@/store'
  import priceFormat from '@/library/priceFormat'
  import stakeAndReturn from '../common/stakeNreturn'
  import Icon from '@/components/common/Icon'
  import Branding from '@/components/mixins/Branding'
  import specialOffers from '../SpecialOffers/specialOffersBC.vue'

  export default {
    name: 'betTypeParlay',

    mixins: [
      Branding
    ],

    props: ['id', 'currentBetSlipState', 'tab', 'allowedBetTypesAndReturns', 'teaserGroupId', 'teaserLevel', 'spread',
      'bt', 'parlayTeamsNo',
      'sgmBetStatus', 'isSGM', 'sgmPath', 'idfosporttype', 'sgmSelectionsMap', 'isSGMenabled'],

    components: {
      stakeAndReturn,
      specialOffers,
      Icon
    },

    data () {
      return {
        isHidden: false
      }
    },

    computed: {
      statusToConfirm () {
        return store.getters['sbBetslipState/getStatusToConfirm'](this.id, this.teaserGroupId)
      },
      isBBenabled () {
        return store.getters['sbBetslipState/isBBenabled']
      },
      isForBB () {
        let isForBB = false
        if (this.isBBenabled && !this.isSGM) {
          let selections = store.getters['sbBetslipState/getSelections4Calculation'](this.tab)
          isForBB = selections.every(s => s.isForBB)
        }
        return isForBB
      },
      gettingABTnR () {
        return store.getters['sbBetslipState/gettingABTnR']
      },
      formattedOdds () {
//        console.log('formattedOdds')
        let allowedBetTypesAndReturns = this.allowedBetTypesAndReturns
        if (this.isSGM) {
          allowedBetTypesAndReturns = this.allowedBetTypesAndReturns
        }
        return priceFormat.formatBetTypePrice(allowedBetTypesAndReturns)
      },
      isSgpA () {
        return this.allowedBetTypesAndReturns && this.allowedBetTypesAndReturns.isSgpA
      },
      participants () {
        return (this.allowedBetTypesAndReturns && this.allowedBetTypesAndReturns.participants) || {}
      },
      sgpPlusMarkAsNew () {
        return store.getters['sbBetslipState/sgpPlusMarkAsNew']
      },
      specialOffersEnabled () {
        return store.getters['sbBetslipState/specialOffersEnabled']
      },
      betslipLayout2 () {
        return window.ctsautoconf.BETSLIP_LAYOT_2 || false
      }
    },

    methods: {
      hideBetType (bool) {
        this.isHidden = bool
      }
    },

    created () {
    },

    mounted () {
    },

    watch: {
    },

    destroyed () {
    }
  }
</script>

<style lang="stylus" scoped>
  .float-right {
    float: right;
  }
  .clear-both {
    clear: both;
  }

  .betType {
    background-color: #fff;
    border: 1px solid silver;
    border-radius: 0px;
    margin: 5px;
    padding: 10px;

    &.RR {
      background-color: #f0f3f8;
      margin: 14px 0px 10px
    }

    &.TEASER {
      background-color: #f0f3f8;
      margin: 0;
      border-radius: 0px !important;
    }

    &.SGM {
      border-color: transparent;
      margin: 0;
      padding: 8px 0px 0;
      .stake-n-return {
        padding: 5px 5px
      }
    }

    .heading {
      font-weight: bold;
      font-size: 14px;
      padding: 0px 5px 8px;
      &.SGM-heading {
        padding: 0px 5px 0px;
        .price {
          float: right;
        }
      }
    }

    .SGM-selections-heading {
      color: #1f375b;
      text-transform: uppercase;
      font-size: 12px;
      font-weight: 500;
    }

    .statusToConfirm {
      color: #ff671f;
      padding-left: 10px;
      font-style: italic;
      font-weight: normal;
      text-transform: uppercase;
      font-family: 'Open Sans Bold';
    }
  }

  .odds {
    font-family: 'Open Sans SemiBold';
    color: #1493ff;
    font-size: 14px;
  }
  .betType
    padding 0
    margin 7px 0
    .title-parlay
      padding: 10px 12px 0 12px
      color: #fff
      border-radius: 0
      font-size: 14px
      .parly_first, .teams_num
        white-space nowrap
      .parly_first:after
        margin-left: -0.2em;
      .special-offers-eligible:has(> *)
        padding-left: 5px
    .stake-n-return
      padding: 5px 6px 5px

  .no-SGM-spacer {
    padding: 8px 0 0;
  }

.title-parlay
  display flex
  align-items center
  justify-content flex-start
  .isForBB
    margin-left 5px
    margin-top -3px
.titleParly
  .isForBB
    margin-left 5px
    margin-top -3px

.heading-SGP-plus
  padding: 6px;
  background: #003764;
  color: white;
  .sgp-tag
    background url("~@/assets/images/icon/svg/sgpplus-tag.svg")
    width: 47px;
    height: 17px;
    margin-right: 5px;
    background-repeat: no-repeat;
    display: inline-block;
  .new-indicator
    display inline-block !important
    text-transform uppercase
    font-size 12px
    letter-spacing 1px
    background-color #ffcb4d
    padding 2px 4px
    margin-left 4px
    margin-top 2px
    font-weight normal
    color #244368
    line-height normal
    border-radius 1px
    span
      padding 0
  .price
    float: right
    font-size: 14px
    font-weight 700

.betType-Parlay
  .specialOffers-offer-container
    margin: 0px -2px 6px
  .specialOffers-offer-container:not(:has(> *))
    margin: 0
    padding: 0
</style>
