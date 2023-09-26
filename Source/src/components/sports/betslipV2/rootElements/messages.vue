<template>
  <div class="betSlipMsgs" :class="{'inRefferal': inRefferal}">
    <!--<hr>-->
    <div class="betPlacement" v-if="betsNo" :class="{'bet_placed' : betSlipStatus.State==2}">
      <!--Messages-->

      <div v-if="currentBetSlipState==9 || errorMsg" class="align-center">
        <!--<h3><span >{{ $t('BetSlip.status.timedOut') }}</span></h3>-->
        <div v-if="errorMsg" class="errorMsg errorId" :class="errorId" >
          <v-icon>info_outline</v-icon>
          <span class="message" :key="errorId">
            <span v-html="errorMsg"></span>
            <!--
            <span v-if="errorId=='LIFEDEP'" class="clickHere" @click.stop='go2ResponsibleGaming' >
              <br><span v-html="$t('BetSlip.placement.error.LIFEDEP.clickForDetails')"></span>
            </span>
            -->
          </span>
        </div>
        <div v-if="otherErrorMsg" class="errorMsg otherErrorMsg" >
          <v-icon>info_outline</v-icon>
          <span class="message" v-html="otherErrorMsg"></span>
        </div>
        <div v-if="!(errorMsg || otherErrorMsg)" class="errorMsg errorGeneric" >
          <v-icon>info_outline</v-icon>
          <span class="message" >{{ $t('BetSlip.status.error') }}</span>
        </div>
      </div>

      <div v-if="currentBetSlipState==2" class="align-center">
        <div class="loading withcounter">
          <span class="placingbet_msg">{{ $t('BetSlip.status.placing-in') }}</span>
          <span>
            <circle-loader-with-counter :n="inRunningDelay"></circle-loader-with-counter>
          </span>
        </div>
      </div>

      <div v-if="currentBetSlipState==3 || currentBetSlipState==10 || currentBetSlipState==11" class="align-center">
        <h3 v-if="inRefferal" >
          <span >{{ $t('BetSlip.status.acceptable.referred.reOffered') }}</span>
        </h3>

        <div v-if="inRefferal" class="msg" :class="{'inRefferal':inRefferal}">
          <span   >{{ $t('BetSlip.betPlacementStatus.Status.detailed.referred.reOffered') }}</span>
        </div>

        <circle-loader></circle-loader>
      </div>

      <div v-if="currentBetSlipState==4" class="align-center">
        <dots-loader></dots-loader>
      </div>

      <div v-if="currentBetSlipState==5">

        <div v-if="!isFastBet && betSlipStatus.State==2" class="Bet-Accepted align-center">
          <a v-if="brandKey === 'boyd'" @click="setTabFromBetSlip('HistoryActive')">
            <img src="~@/assets/images/betslip/PlacedBetSign.svg" class="bet_placed_img" alt="Betslip">
          </a>
          <a v-if="brandKey === 'rw'" @click="setTabFromBetSlip('HistoryActive')">
            <img src="~@/assets/images/brands/rw/PlacedBetSign.svg" class="bet_placed_img" alt="Betslip">
          </a>
          <a class="bet_placed_icon" v-if="(brandLayout ==='generic' || brandKey === 'dn' || brandKey === 'dnw' || brandKey === 'circa' || brandKey ==='sb' || brandKey ==='mav' || brandKey === 'qcasino' || brandKey === 'pr')" @click="setTabFromBetSlip('HistoryActive')">
            <v-icon>done</v-icon>
          </a>
          <h3>
            <span key="betplacedsing"  v-if="numberOfSucessfulyPlacedBets==1">{{ $t('BetSlip.status.placed') }}</span>
            <span key="betplacedpl" v-if="numberOfSucessfulyPlacedBets > 1" >
              {{ $t('BetSlip.status.placed.pl', {n:numberOfSucessfulyPlacedBets}) }}
            </span>
            <span v-if="numberOfSucessfulyPlacedBets < numberOfAttemptedBets">
                <br>
                <span key="betfailedsing" v-if="(numberOfAttemptedBets - numberOfSucessfulyPlacedBets) == 1" >{{ $t('BetSlip.status.placed.failed') }}</span>
                <span key="betfailedpl" v-else >
                  {{ $t('BetSlip.status.placed.failed.pl', {n:numberOfAttemptedBets - numberOfSucessfulyPlacedBets}) }}
                </span>
              </span>
          </h3>


          <div class="align-center">
              <span class="keep_selections" >
                <span class="clickable" @click="keepSelections()">
                  <span v-if="betsNo == 1" >{{ $t('BetSlip.placement.span.KEEP') }}</span>
                  <span v-if="betsNo > 1" >{{ $t('BetSlip.placement.span.KEEP.pl', {n:betsNo}) }}</span>
                  <v-icon >keyboard_arrow_right</v-icon>
                </span>
              </span>
          </div>
          <!-- FAVORITES-->
          <v-expansion-panel v-if="isLoggedIn && playerFavorites && favoriteCandidates && favoriteCandidates.length > 0" class="favorites_betslip" v-model="expandedItem">
            <v-expansion-panel-content>
              <template v-slot:header>
                <span v-if="expandedItem !== 0">
                  {{ $t('Favorites.Betslip.Title') }}
                </span>
                <span v-if="expandedItem === 0">
                  {{ $t('Favorites.Betslip.Hide') }}
                </span>
              </template>
              <p>{{ $t('Favorites.Betslip.Desc1') }}</p>
              <p>{{ $t('Favorites.Betslip.Desc2') }}</p>

            <div v-if="favoriteCandidates && favoriteCandidates.length > 0" class="favorites">
            <div class="favorites-header">
              <div class="col col-1">
                <span class="label">{{ $t('Favorites.Betslip.Team_Player') }}</span>
              </div>
              <div class="col col-2">
                <span class="label">{{ $t('Favorites.Betslip.Favorite') }}</span>
              </div>
              <div class="col col-3">
                <span class="label">{{ $t('Favorites.Betslip.NotifyMe') }}</span>
              </div>
            </div>
            <div class="favorite-item" v-for="(favorit, index) in favoriteCandidates" :key="index">
              <!-- Name of favorite - Not null for type in { P, C }. -->
              <!-- Favorite Id. Not nul for type in { S, L }. -->
              <div class="col col-1">
                <icon :name="`icon-${ (favorit.idfosporttype && favorit.idfosporttype.replace(/ /g, '')) || 'empty' }`"></icon>
                <div>
                  <span v-if="favorit.type === 'P' || favorit.type === 'C'" class="label">{{favorit.name}}</span>
                  <span v-if="favorit.type === 'S' || favorit.type === 'L'" class="label">{{favorit.idfosporttype}}</span>
                </div>
              </div>
              <div class="col col-2">
                <v-checkbox v-model="favorit.enabled" label=""   
                  @change="saveFavorite({
                    'source': favorit.source,
                    'type': favorit.type,
                    'idfosporttype': favorit.idfosporttype,
                    'favoriteid': favorit.favoriteid,
                    'name': favorit.name ? favorit.name : null,
                    'order': favorit.order,
                    'language': favorit.language,
                    'enabled': favorit.enabled ? true : false,
                    'tonotify': favorit.tonotify ? true : false
                  })"></v-checkbox>
              </div>
              <div class="col col-3">
                <v-checkbox v-if="favorit.tonotify !== null" v-model="favorit.tonotify" label="" :disabled="!favorit.enabled"
                  @change="saveFavorite({
                    'source': favorit.source,
                    'type': favorit.type,
                    'idfosporttype': favorit.idfosporttype,
                    'favoriteid': favorit.favoriteid,
                    'name': favorit.name ? favorit.name : null,
                    'order': favorit.order,
                    'language': favorit.language,
                    'enabled': favorit.enabled ? true : false,
                    'tonotify': favorit.tonotify ? true : false
                  })"></v-checkbox>
              </div>
            </div>
          </div>
            </v-expansion-panel-content>
          </v-expansion-panel>
        
          <!-- FAVORITES END-->

          <div class="totals">
            <div class="reference" v-if="betPlacementResult.ExternalReference">
              <label >{{ $t('BetSlip.receipt.reference') }}</label>
              <span class="value">{{betPlacementResult.ExternalReference}}</span>
            </div>
            <div class="wagered">
              <label >{{ $t('BetSlip.receipt.wagered') }}</label>
              <span class="value"> {{betPlacementResult.TotalStake.toFixed(2) | currency}}</span>
            </div>

            <div class="wagered bonus" v-if="totalVoucherDiscount" >
              <label>{{ $t('BetSlip.receipt.promotions.totalDiscount') }}</label>
              <span class="value"> {{totalVoucherDiscount.toFixed(2) | currency}}</span>
            </div>
            <div class="actual-wagered bonus" v-if="totalVoucherDiscount" >
              <label>{{ $t('BetSlip.receipt.wagered.discounted') }}</label>
              <span class="value"> {{(betPlacementResult.TotalStake - totalVoucherDiscount).toFixed(2) | currency}}</span>
            </div>

            <div class="potential-return">
              <label >{{ $t('BetSlip.receipt.winning.potential') }}</label>
              <span class="value"> {{attemptedBetPotentialReturn | currency}}</span>
            </div>
          </div>

        </div>

        <div v-if="betSlipStatus.State==4" class="Bet-Rejected">
          <h3>
            <span v-if="!errorType">
              <span >{{ $t('BetSlip.status.rejected') }}</span>
            </span>
            <span v-else>
              <span :key="errorType">{{ $t('BetSlip.placement.error.'+errorType+'.result', {state: state, totalBetSlipMinUnit: totalBetSlipMinUnit, totalStake: betSlipTotals && betSlipTotals.totalStake}) }}</span>
            </span>
          </h3>
          <div class="reject-reason" v-if="statusText && !errorMsg">
            <span v-html="statusText"></span>
          </div>

        </div>

        <div v-if="betSlipStatus.State==5" class="Bet-Waiting">
          <h3 >
            <span  v-if="inRefferal">{{ $t('BetSlip.status.waiting.reffer') }}</span>
            <span  v-else >{{ $t('BetSlip.status.waiting') }}</span>
          </h3>

          <div class="msg bet_actions_msg" :class="{'inRefferal':inRefferal}">
            <div v-for="reason in betSlipStatus.detailedStates">
              <span v-if="inRefferal && reason=='reOffered'">
                <span  :key="reason + '-' + Math.random()">{{ $t('BetSlip.betPlacementStatus.Status.detailed.referred.'+reason) }}</span>
                <br><span >{{ $t('BetSlip.betPlacementStatus.Status.detailed.referred.reOffered.scroll') }}</span>
              </span>
              <span v-else :key="reason + '-' + Math.random()">{{ $t('BetSlip.betPlacementStatus.Status.detailed.'+reason) }}</span>
            </div>
          </div>

          <circle-loader></circle-loader>

          <div v-for="reason in betSlipStatus.detailedStates" v-if="!inRefferal">
            <span v-if="reason=='reOffered'"  :key="reason">{{ $t('BetSlip.betPlacementStatus.Status.detailed.reOffered.call') }}</span>
          </div>

        </div>

      </div>

      <div v-if="currentBetSlipState==6">
        <div :class="{'Bet-Acceptable': betSlipStatus.State==1, 'Bet-Reoffered': betSlipStatus.State==3, 'Bet-Waiting': betSlipStatus.State==5}">

          <h3 v-if="betSlipStatus.State==5">
            <span  v-if="inRefferal">{{ $t('BetSlip.status.waiting.reffer') }}</span>
            <span  v-else >{{ $t('BetSlip.status.waiting') }}</span>
          </h3>
          <h3 v-else>
            <span v-if="betSlipStatus.detailedStates && betSlipStatus.detailedStates.indexOf('reOffered')>-1">
              <span  v-if="inRefferal" :key="betSlipStatus.State">{{ $t('BetSlip.status.acceptable.referred.reOffered') }}</span>
              <span  v-else :key="betSlipStatus.State">{{ $t('BetSlip.status.acceptable.reOffered') }}</span>
            </span>
            <span v-else><span  :key="betSlipStatus.State">{{ $t('BetSlip.status.acceptable') }}</span></span>
          </h3>

          <div class="msg bet_actions_msg" :class="{'inRefferal':inRefferal}">
            <div v-for="reason in betSlipStatus.detailedStates">
              <span v-if="inRefferal && reason=='reOffered'">
                <span :key="reason + '-' + Math.random()">{{ $t('BetSlip.betPlacementStatus.Status.detailed.referred.'+reason) }}</span>
                <br><span   >{{ $t('BetSlip.betPlacementStatus.Status.detailed.referred.reOffered.scroll') }}</span>
              </span>
              <span v-else :key="reason + '-' + Math.random()">{{ $t('BetSlip.betPlacementStatus.Status.detailed.'+reason) }}</span>
            </div>
          </div>

          <div class="confirmIn" v-if="!inRefferal"><span>{{ $t('BetSlip.status.confirmIn') }}</span> {{ gracePeriod }}</div>
          <div v-else>
            <div class="loading withcounter">
              <circle-loader-with-counter :n="gracePeriod" ></circle-loader-with-counter>
            </div>
          </div>

          <div v-for="reason in betSlipStatus.detailedStates" v-if="!inRefferal">
            <span v-if="reason=='reOffered'"  :key="reason">{{ $t('BetSlip.betPlacementStatus.Status.detailed.reOffered.call') }}</span>
          </div>

        </div>
      </div>

      <div v-if="currentBetSlipState==7" class="align-center">
        <h3><span >{{ $t('BetSlip.status.canceled') }}</span></h3>
      </div>
      <div v-if="currentBetSlipState==8" class="align-center">
        <h3><span >{{ $t('BetSlip.status.timedOut') }}</span></h3>
      </div>

    </div>

    <!--currentBetSlipState: {{currentBetSlipState}}<br>-->
    <!--mobileBigAndBelow: {{mobileBigAndBelow}}<br>-->
    <!--<div v-if="betSlipStatus" v-html="printJSON(betSlipStatus)"></div>-->
    <!--inRefferal: {{inRefferal}}-->
    <!--betPlacementResult: <div v-html="printJSON(betPlacementResult)"></div>-->
    <!--<hr>-->
    <!--errorId: {{errorId}}<br>-->
    <!--errorType: {{errorType}}<br>-->
    <!--errorMsg: {{errorMsg}}<br>-->
    <!--statusText: {{statusText}}<br>-->
    <!--otherErrorMsg: {{otherErrorMsg}}<br>-->
    <!--State: {{state}}<br>-->
  </div>
</template>

<script>
//  import Vue from 'vue'
  import store from '@/store'
  import circleLoader from '@/components/common/CircleLoader'
  import circleLoaderWithCounter from '@/components/common/CircleLoaderWithCounter'
  import dotsLoader from '@/components/common/DotsLoader'
//  import Translate from 'vue-gettext/src/component'
  import Icon from '@/components/common/Icon'
  import Branding from '@/components/mixins/Branding'
  import config from '@/config'
  import dismissBetSlipMixin from '@/components/sports/BetSlipV2/mixins/dismissBetSlip'

  export default {
    name: 'BetSlipMessages',

    mixins: [
      Branding,
      dismissBetSlipMixin
    ],

    props: ['tab', 'currentBetSlipState', 'isLoggedIn', 'betsNo', 'betPlacementResult', 'inRefferal', 'inRunningDelay',
      'gracePeriod', 'betSlipStatus', 'isFastBet', 'mobileBigAndBelow', 'promotionsData', 'state', 'betSlipTotals'],

    components: {
//      Translate,
      circleLoader,
      circleLoaderWithCounter,
      dotsLoader,
      Icon
    },

    data () {
      return {
        webView: false,
        expandedItem: 1
      }
    },

    computed: {
      /*
      betSlipStatus () {
        return (this.betPlacementResult && this.betPlacementResult.Status) || {}
      }
      */
      config () {
        return config
      },
      totalBetSlipMinUnit () {
        return store.getters['sbBetslipState/totalBetSlipMinUnit']
      },
      attemptedBetPotentialReturn () {
        var total = 0
        if (this.betPlacementResult && this.betPlacementResult.Bets && this.betPlacementResult.Bets.length) {
          for (var i = 0; i < this.betPlacementResult.Bets.length; i++) {
            if (this.betPlacementResult.Bets[i].PotentialReturn) {
              total += this.betPlacementResult.Bets[i].PotentialReturn - this.betPlacementResult.Bets[i].TotalStake
            }
          }
        }
        return total.toFixed(2)
      },
      errorId () {
        var errorId = this.betSlipStatus && this.betSlipStatus.errorData && (this.betSlipStatus.errorData.errorId || this.betSlipStatus.errorData.errT)
        return errorId
      },
      errorType () {
        return this.betSlipStatus && this.betSlipStatus.errorData && this.betSlipStatus.errorData.errT
      },
      errorMsg () {
        var errorMsg = false
        let betSlipTotals = this.betSlipTotals || {}
        if (this.errorType) {
          errorMsg = this.$t('BetSlip.placement.error.' + this.errorType + '.reason', {uiView: this.webView ? '&uiView=true' : '', config: this.config, state: this.state, totalBetSlipMinUnit: this.totalBetSlipMinUnit, totalStake: betSlipTotals.totalStake})
        } else if (this.errorId) {
          errorMsg = this.$t('BetSlip.placement.error.' + this.errorId, {uiView: this.webView ? '&uiView=true' : '', config: this.config, state: this.state, totalBetSlipMinUnit: this.totalBetSlipMinUnit, totalStake: betSlipTotals.totalStake})
        }
        return errorMsg
      },
      statusText () {
        return this.errorMsg || this.betSlipStatus.StatusText
      },
      otherErrorMsg () {
        return this.betSlipStatus && this.betSlipStatus.errorData && this.betSlipStatus.errorData.other
      },
      numberOfAttemptedBets () {
        return this.betPlacementResult && this.betPlacementResult.Bets && this.betPlacementResult.Bets.length
      },
      numberOfSucessfulyPlacedBets () {
        var bets = 0
        if (this.betPlacementResult && this.betPlacementResult.Bets && this.betPlacementResult.Bets.length) {
          for (var i = 0; i < this.betPlacementResult.Bets.length; i++) {
            if (this.betPlacementResult.Bets[i].PotentialReturn && this.betPlacementResult.Bets[i].TotalStake > 0) {
              bets++
            }
          }
        }
        return bets
      },
      totalVoucherDiscount () {
        var discount = 0
        if (this.betPlacementResult && this.betPlacementResult.TotalVoucherDiscount) {
          discount = this.betPlacementResult.TotalVoucherDiscount
        }
        /*
        } else if (this.promotionsData && this.promotionsData.PerTab && this.promotionsData.PerTab[this.tab]) {
          discount = this.promotionsData.PerTab[this.tab]
        }
        */
        return discount
      },
      showHistoryTabs () {
        return config.app.betHistoryInBetslip
      },
      favoriteCandidates () {
        return store.getters['favorites/getFavoritesCandidatesByBetslipId']
      },
      playerFavorites () {
        return window.ctsautoconf.PLAYER_FAVORITES || false
      }
    },

    methods: {
      printJSON (obj) {
        obj = obj || {}
        return JSON.stringify(obj, null, 4)
          .replace(/\n( *)/g, function (match, p1) {
            return '<br>' + '&nbsp;'.repeat(p1.length)
          })
      },
      keepSelections () {
        this.dismissBetSlip(1, 0, 0, 0, null, true)
      },
      go2ResponsibleGaming () {
//        return console.log('go2ResponsibleGaming')
        let accountSummaryFlow = window.ctsautoconf.ACCOUNT_SUMMARY_FLOW || false
        if (accountSummaryFlow) {
          this.$router.replace({
            path: '/account/responsible-gaming',
            query: {
              'deposit-threshold': ''
            }
          }).catch(err => { console.log(err) }) // workaround to avoid navigationDuplicated exception
        } else {
          if (this.$route.name !== 'deposit-threshold') {
            this.$router.push({name: 'deposit-threshold'})
          }
        }
      },
      getFavoriteCandidates () {
        if (this.betPlacementResult && this.betPlacementResult.IDFOBetSlip) {
          store.dispatch('favorites/fetchFavoritesCandidatesByBetslipId', { idfobetslip: this.betPlacementResult.IDFOBetSlip })
        }
      },
      saveFavorite (data) {
        if (data.tonotify === true && data.enabled === false) {
          data.tonotify = false
        }
        store.dispatch('favorites/saveFavoriteOnBetslip', {
          'source': data.source,
          'type': data.type,
          'idfosporttype': data.idfosporttype,
          'favoriteid': data.favoriteid,
          'name': data.name,
          'order': data.order,
          'language': data.language,
          'enabled': data.enabled,
          'tonotify': data.tonotify
        }).then(() => {
          this.getFavoriteCandidates()
        })
      }
    },

    created () {
//      console.log('Created BS Messages')
    },

    mounted () {
    },

    watch: {
      betPlacementResult () {
        if (this.isLoggedIn && this.playerFavorites) {
          this.getFavoriteCandidates()
        }
      }
    },

    destroyed () {
    }
  }
</script>

<style lang="stylus" scoped>
@import "~@/css/config"
  .betSlipMsgs
    background: #fff
    text-align: center
    padding 10px
    @media mobile-big-and-below
      padding 0 !important

  .align-center {
    text-align: center;
  }
  .clickHere {
    cursor: pointer;
  }
  .game_on
    font-size: 30px
    color: #2CB459
    display: block
    text-transform :uppercase
  .keep_selections
    color #000
    font-size 14px
    justify-content: center
    display: flex
    .clickable
      cursor: pointer
    .v-icon
      margin: 1px 0 -1px

  .errorMsg {
    position: relative;
    background-color: #ff671f;
    color: #fff;
    text-align: left;
    padding: 10px 10px;
    /*margin: -12px -12px 12px -12px;*/

    &.HAS_ERRORS{
      background-color: #DB3F3F;
    }
    &.NO_STAKES,
    &.NO_BET_TYPES,
    &.NO_LIVE_TEASERS_ALLOWED
    &.NOT-NATIVE-APP
    &.NATIVE-FAILED-GEOLOCATION {
      background-color: #157cc1;
    }
  }
  .v-icon
    color #ffffff
    margin-right 5px
    font-size 20px
  .Bet-Accepted
    h3
      font-weight: normal !important
      color: #0b4da1
      font-size: 16px
    .totals
      flex-direction: column
      border-top: 1px solid #CFD6DB
      margin: 50px -10px 0 -10px
      padding: 0 10px;
      @media tablet-and-below
        position: absolute
        margin: 0
        padding: 0
        bottom: 80px
        left: 15px
        right: 15px
        border-top: 0px
      div
        display: flex
        margin-top: 3px
        line-height: 25px
        label
          font-size: 14px
          color: #152A47
          text-transform: uppercase
          flex: 1 1 auto
        .value
          margin-left: auto
          flex-direction: column
          color: #152A47
          font-size: 14px
          @media tablet-and-below
            font-size: 16px

      .potential-return
        .value
          @media tablet-and-above
            color: #1493FF

.FastBetSlip
  .betSlipMsgs
    padding 0
.v-expansion-panel.favorites_betslip
  .favorites
    width: 100% 
    display block
    margin-top 20px
    .favorites-header
      display flex
      width: 100% !important
      justify-content: space-between
      font-family 'Open Sans Bold'
      text-transform: uppercase
      padding 0 0 10px 0
      font-size 13px
      .col-1
        justify-content: flex-start
        color #003764
        text-align left
        flex-basis 50%
      .col-2
      .col-3
        justify-content: flex-start
        color #ff9016
        text-align left
    .favorite-item
      display flex
      width: 100% !important
      justify-content: space-between
      align-items center
      .col-1
        flex-basis 50%
        text-align left
        display flex
        justify-content flex-start
        align-items center
        >>>.igt-icon
          padding-right 5px !important
        >>>.font-icon
          font-size 16px !important
      .col-2
      .col-3
        flex-basis 20%
        justify-content: flex-start
    >>>.v-input--selection-controls
      margin-top 0 !important
      height 30px
      &.v-input--checkbox
        .v-icon
          color #003764 !important
      .v-input--selection-controls__ripple.accent--text
        color #003764 !important
      &.v-input--is-disabled
        opacity 0.5
.v-expansion-panel.favorites_betslip
  box-shadow none
  margin-top 20px
  color: #003764
  @media mobile-big-and-below
    padding 0 20px 260px 20px
  >>>.v-expansion-panel__header
    border-top 1px solid #e4e4e4
    border-bottom 1px solid #e4e4e4
    margin-bottom 10px
    color: #003764
    padding: 5px 0
    min-height 38px
    .v-icon
      color #003764 !important
    span
      line-height normal
  >>>.v-expansion-panel__body p
    margin-bottom 5px
    line-height normal

</style>
