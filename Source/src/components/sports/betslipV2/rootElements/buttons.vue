<template>
  <div>
    <div class="betSlipBtns" :class="[currentBetSlipStateName, {'isFastBet': isFastBet, 'bet_placed' : betSlipStatus.State==2}]"
         v-if="showBtns && (geolocationMessage.errorCode !== 612 && errorMsgLocalStorage !== '612')" >
      <div class="action-btns" v-if="betsNo || isLoggedIn" :class="[currentBetSlipStateName, {'inRefferal':inRefferal}]" >
        <!--<div @click="injectS">Inject</div>-->

        <!--<hr v-if="isFastBet && currentBetSlipState<=1" class="separator">-->
        <div v-if="currentBetSlipState==0 && betsNo && !isFastBet && betslipLayout2 && brandLayout === 'generic'" class="betslip_total_cost">
          <div>
            <div class="line1">
              <span>{{ $t('BetSlip.btn.PlaceBet.TotalCost') }}:</span>  {{this.betSlipTotals.totalStake | currency}}
            </div>
            <div v-if="!showBetSlipChanged && this.betSlipTotals.totalStake*1>0 && promotionsData.PerTab[tab]" class="voucher-data">
              <div class="voucher">
                <span>{{ $t('BetSlip.promotions.totalDiscount') }}:</span> <span class="discount">{{promotionsData.PerTab[tab] | currency}}</span>
              </div>
              <div class="actual-stake">
                <span>{{ $t('BetSlip.btn.PlaceBet.TotalCost.Discounted') }}:</span> <span class="discount">{{(this.betSlipTotals.totalStake - promotionsData.PerTab[tab]) | currency}}</span>
              </div>
            </div>
            <div class="line2">
              <span>{{ $t('BetSlip.btn.PlaceBet.TotalPotentialReturn') }}:</span>   {{this.betSlipTotals.winning | currency}}
            </div>
          </div>
        </div>

        <div v-if="betsNo && !isLoggedIn">
          <div v-if="currentBetSlipState==9" class="align-center">
            <button class="v-btn secondary btn_blue" @click="dismissBetSlip(1,1,0)"> <span>{{ $t('BetSlip.placement.btn.OK') }}</span> </button>
          </div>
          <div v-if="currentBetSlipState!=9 && betsNo" class="align-center btn-container">
            <div  v-if="isFastBet" class="column column-left">
              <button class="v-btn btn_white" @click="confirmDialog()" :disabled="currentBetSlipState>0" >
                <span>{{ $t('BetSlip.quick.btn.addToBetSlip') }}</span>
              </button>
            </div>
            <div class="column column-right">
              <button class="v-btn primary-button primary-btn yellow-btn" @click="popLogIn()" id="btnPlaceBetNotLoggedIn">
                      <span >{{ $t('BetSlip.btn.msg.LogIn') }}</span>
              </button>
            </div>
          </div>
        </div>
        <div v-if="isLoggedIn">
          <div v-if="currentBetSlipState==0">
            <!-- <div v-if="!betsNo">
              <button v-if="mobileBigAndBelow" class="btn btn_white rtb" @click="closeBetslipDialog()">
                  <span >{{ $t('BetSlip.btn.ReturnToBetting') }} </span>
              </button>
              <button  v-if="!mobileBigAndBelow" class="v-btn primary-button primary-btn" @click="liveBetNow()" >
                  <span >{{ $t('BetSlip.btn.BET') }}</span>
              </button>
            </div> -->

            <div v-if="betsNo" class="align-center btn-container" >
              <div  v-if="isFastBet" class="column column-left">
                <button class="v-btn btn_white" @click="confirmDialog()" :disabled="currentBetSlipState>0" >
                  <span>{{ $t('BetSlip.quick.btn.addToBetSlip') }}</span>
                </button>
              </div>

              <div class="column column-right">
                <div v-if="!isFastBet && !betslipLayout2" class="betslip_total_cost">
                  <div>
                    <div class="line1">
                      <span>{{ $t('BetSlip.btn.PlaceBet.TotalCost') }}:</span>  {{this.betSlipTotals.totalStake | currency}}
                    </div>
                    <div v-if="!showBetSlipChanged && this.betSlipTotals.totalStake*1>0 && promotionsData.PerTab[tab]" class="voucher-data">
                      <div class="voucher">
                        <span>{{ $t('BetSlip.promotions.totalDiscount') }}:</span> <span class="discount">{{promotionsData.PerTab[tab] | currency}}</span>
                      </div>
                      <div class="actual-stake">
                        <span>{{ $t('BetSlip.btn.PlaceBet.TotalCost.Discounted') }}:</span> <span class="discount">{{(this.betSlipTotals.totalStake - promotionsData.PerTab[tab]) | currency}}</span>
                      </div>
                    </div>
                    <div class="line2">
                      <span>{{ $t('BetSlip.btn.PlaceBet.TotalPotentialReturn') }}:</span>   {{this.betSlipTotals.winning | currency}}
                    </div>


                  </div>
                </div>
                <button v-if="showBetSlipChanged" class="v-btn acceptChanges btn_blue" @click="acceptChanges()">
                  <span>{{ $t('BetSlip.changed.btn.accept') }}</span>
                </button>
                <button v-else class="v-btn primary-button primary-btn placebetbtn" @click="initPlaceBet()"
                        :disabled="disablePlaceBet || isButtonDisabled" :class="[disablePlaceBet]" id="btnPlaceBet">
                    <span class="btn-label">
                      <div v-show="gettingABTnR" class="loader-container">
                        <circle-loader></circle-loader>
                      </div>
                      <span>{{ $t('BetSlip.btn.PlaceBet') }}</span>
                      <!-- <div class="line1">
                        <span v-if="betsCnt<2">
                          <span >
                            {{ $t('BetSlip.tab.' + tab + '.btn.PlaceBet') }}
                           </span>
                        </span>
                        <span v-else >
                          {{ $t('BetSlip.tab.' + tab + '.btn.PlaceBets', {n:betsCnt[tab]}) }}
                        </span>

                        <span v-show="!isFastBet && this.betSlipTotals.totalStake*1>0"> {{this.betSlipTotals.totalStake | currency}}</span>
                      </div>
                      <div class="line2" v-if="!isFastBet" >
                        <span >{{ $t('BetSlip.tab.'+ tab +'.btn.toWin') }}</span><span
                        v-show="this.betSlipTotals.winning*1>0"> {{this.betSlipTotals.winning | currency}}</span>
                      </div> -->
                      </span>
                </button>
              </div>
            </div>
          </div>

          <div v-if="currentBetSlipState==5" class="align-center">
            <div v-if="!isFastBet && betSlipStatus.State==2" class="action_buttons">

              <div class="column column-left">
                <button class="v-btn secondary" @click="dismissBetSlip()">
                  <span >{{ $t('BetSlip.btn.ReturnToBetting') }}</span>
                </button>
              </div>
              <div class="column column-right">
                <button class="v-btn primary" @click="setTabFromBetSlip('HistoryActive')">
                  <span >{{ $t('BetSlip.btn.ActiveBets') }}</span>
                </button>
              </div>
            </div>

            <div v-if="betSlipStatus.State==4">
              <button class="v-btn bet_rejected" @click="dismissBetSlip(1,1,0)"> <span>{{ $t('BetSlip.placement.btn.OK') }}</span> </button>
            </div>

            <div v-if="betSlipStatus.State==5 && betSlipStatus.detailedStates && betSlipStatus.detailedStates.indexOf('referred')==-1" >
              <!--// No reject during referal-->
              <button class="v-btn btn_blue" @click="rejectBetSlip()"> <span>{{ $t('BetSlip.placement.btn.CANCEL') }}</span> </button>
            </div>

          </div>

          <div v-if="currentBetSlipState==6" class="align-center action_buttons">
            <div class="column column-left" v-if="inRefferal" >
              <button class="v-btn btn_white" @click="rejectBetSlip()" :disabled="isButtonDisabled">
                <v-icon>close</v-icon>
                <span>{{ $t('BetSlip.placement.btn.CANCEL.reffer') }}</span>
              </button>
            </div>
            <div class="column column-right" v-if="inRefferal">
              <button class="v-btn btn_green confirmreffer" :class="{'inRefferal':inRefferal}" @click="confirmBetSlip()" :disabled="isButtonDisabled">
                <icon name="icon-tick" colorName="white"></icon>
                <span>{{ $t('BetSlip.placement.btn.CONFIRM.reffer') }}</span>
              </button>
            </div>

            <div class="column column-left" v-if="!inRefferal">
              <button class="v-btn btn_white confirmreffer" @click="confirmBetSlip()" :disabled="isButtonDisabled" >
                <span>{{ $t('BetSlip.placement.btn.CONFIRM') }}</span>
              </button>
            </div>
            <div class="column column-right" v-if="!inRefferal">
              <button class="v-btn btn_blue" @click="rejectBetSlip()" :disabled="isButtonDisabled" >
                <span>{{ $t('BetSlip.placement.btn.CANCEL') }}</span>
              </button>
            </div>

          </div>

          <div v-if="currentBetSlipState==7" class="align-center">
            <button class="v-btn secondary btn_blue" @click="dismissBetSlip(1,1,0)"> <span>{{ $t('BetSlip.placement.btn.OK') }}</span> </button>
          </div>
          <div v-if="currentBetSlipState==8" class="align-center">
            <button class="v-btn secondary btn_blue" @click="dismissBetSlip(1,1,0)"> <span>{{ $t('BetSlip.placement.btn.OK') }}</span> </button>
          </div>
          <div v-if="currentBetSlipState==9" class="align-center">
            <button class="v-btn secondary btn_blue" @click="dismissBetSlip(1,1,0)"> <span>{{ $t('BetSlip.placement.btn.OK') }}</span> </button>
          </div>

        </div>

      </div>
      <div v-if="(brandLayout === 'generic' || brandKey ==='sb' || brandKey ==='rw') && !betsNo && !isLoggedIn" class="action-btns emptybetslip">
        <div>
          <div class="align-center btn-container">
            <div class="column column-right">
              <button class="v-btn primary-button primary-btn yellow-btn" @click="popLogIn()" id="btnPlaceBetLoggedIn">
                <span >{{ $t('BetSlip.btn.msg.LogIn') }}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <geolocation-indicator></geolocation-indicator>
    <template v-if="!betslipLayout2">
      <div v-if="!mobileBigAndBelow" style="height:10px"></div>
      <div class="betslip_footer_bottom" v-if="currentBetSlipState==0 && betsNo && !isFastBet">
        <v-btn @click="clearAll" class="delALL">
          <icon name="icon-trash-grey"></icon><span>{{ $t('BetSlip.selection.btn.clearall') }} </span>
        </v-btn>
        <preference-switch v-if="isLoggedIn && betsNo && currentBetSlipState < 2"
                          :id="'showAcceptingChangesInfo'"
                          :currentBetSlipState="currentBetSlipState"
        > </preference-switch>
      </div>
    </template>
    <template v-if="betslipLayout2">
        <div class="betslip_footer_bottom" v-if="currentBetSlipState==0 && betsNo && !isFastBet">
          <preference-switch v-if="isLoggedIn && betsNo && currentBetSlipState < 2"
            :id="'showAcceptingChangesInfo'"
            :currentBetSlipState="currentBetSlipState"
          ></preference-switch>
          <v-btn @click="clearAll" class="delALL">
            <span>{{ $t('BetSlip.selection.btn.clearall') }} </span>
            <icon name="icon-trash-grey"></icon>
          </v-btn>
        </div>
      </template>
    <v-dialog content-class="dialog-betslip-confirm" v-model="dialogBetslipConfirm.active" persistent :fullscreen="false">
      <betslip-confirm :dialogBetslipConfirm="dialogBetslipConfirm" ></betslip-confirm>
    </v-dialog>
    <!-- <preference-switch v-if="isLoggedIn && !isFastBet && betsNo && currentBetSlipState < 2"
                       :id="'showAcceptingChangesInfo'"
                       :currentBetSlipState="currentBetSlipState" > </preference-switch> -->

    <!--<button @click="setState(4)">4</button>-->
    <!--showAcceptingChangesInfo: {{showAcceptingChangesInfo}}<br>-->
    <!--betSlipChangeNo: {{betSlipChangeNo}}<br>-->
    <!--betSlipStatus: {{betSlipStatus}}<br>-->
    <!--disablePlaceBet: {{disablePlaceBet}}<br>-->
    <!--currentBetSlipState: {{currentBetSlipState}}<br>-->
    <!--isButtonDisabled: {{isButtonDisabled}}<br>-->
    <!--dialogBetslipConfirm: {{dialogBetslipConfirm}}<br>-->
<!--    isOpenedFromWebView: {{isOpenedFromWebView}}<br>-->
<!--    mobileBigAndBelow: {{mobileBigAndBelow}}<br>-->
<!--    webViewAndMobile: {{webViewAndMobile}}<br>-->
<!--    currentBetSlipState: {{currentBetSlipState}}<br>-->
<!--    betSlipStatus.errorData: {{betSlipStatus.errorData}}<br>-->
  </div>
</template>

<script>
  //  import Vue from 'vue'
  import store from '@/store'
  import config from '@/config'
  import Icon from '@/components/common/Icon'
  import circleLoader from '@/components/common/CircleLoader'
  import preferenceSwitch from './preferenceSwitch.vue'
  import betslipConfirm from './betslipConfirm.vue'
  import GeoLocation from '@/components/mixins/GeoLocation'
  import dismissBetSlipMixin from '@/components/sports/BetSlipV2/mixins/dismissBetSlip'
  import GeolocationIndicator from '@/components/common/GeolocationIndicator'
  import Branding from '@/components/mixins/Branding'

  export default {
    name: 'BetSlipButtons',

    mixins: [
      GeoLocation,
      dismissBetSlipMixin,
      Branding
    ],

    props: ['tab', 'currentBetSlipState', 'isLoggedIn', 'betsNo', 'betSlipTotals', 'gettingABTnR', 'inRefferal',
      'betSlipStatus', 'betSlipChangeNo', 'betplacementresult', 'isFastBet', 'dialogSingleBetslip', 'mobileBigAndBelow',
      'isGeoLocationEnabled', 'promotionsData'],

    components: {
      Icon,
      circleLoader,
      preferenceSwitch,
      betslipConfirm,
      GeolocationIndicator
    },

    data () {
      return {
        showBetSlipChanged: false,
        placeBetAfterLogIn: false,
        isButtonDisabled: false
      }
    },

    computed: {
      showBtns () {
        return [0, 1, 6, 7, 8, 9].includes(this.currentBetSlipState) ||
          (this.currentBetSlipState === 5 && this.betSlipStatus && this.betSlipStatus.State && [2, 4].includes(this.betSlipStatus.State)) ||
          (this.currentBetSlipState === 5 &&
          this.betSlipStatus && this.betSlipStatus.State === 5 &&
          this.betSlipStatus.detailedStates && this.betSlipStatus.detailedStates.indexOf('referred') === -1)
      },
      externalWalletProvider () {
//        console.log('externalWalletProvider')
        return config.app.autoconf.EXTERNAL_WALLET_PROVIDER
      },
      isOpenedFromWebView () {
        return store.getters['getIsOpenedFromWebView']
      },
      externalUrls () {
//        console.log('externalUrls')
        return config.externalUrls
      },
      betsCnt () {
        return (this.betSlipTotals && this.betSlipTotals.betsCnt) || 0
      },
      dialogBetslipConfirm () {
        return store.getters['overlayState/getBetslipConfirm']
      },
      currentBetSlipStateName () {
        return store.getters['sbBetslipState/currentBetSlipStateName']
      },
      showAcceptingChangesInfo () {
        return store.getters['sbBetslipState/showAcceptingChangesInfo']
      },
      betSlipCheckError () {
        return this.betSlipStatus.betSlipCheckError
      },
      dismissErrorFromSelection () {
        return store.getters['sbBetslipState/dismissErrorFromSelection']
      },
      closeFromParent () {
        return store.getters['sbBetslipState/closeFromParent']
      },
      errorId () {
        var errorId = this.betSlipStatus && this.betSlipStatus.errorData && (this.betSlipStatus.errorData.errorId || this.betSlipStatus.errorData.errT)
        return errorId
      },
      errorType () {
        return this.betSlipStatus && this.betSlipStatus.errorData && this.betSlipStatus.errorData.errT
      },
      showError () {
        return this.errorId || this.errorType
      },
      disablePlaceBet () {
        // return false // console.log('Clear this !!!')
        var reason = []
        if (this.isGeoLocationEnabled) {
          if (!this.isOpenedFromWebView && !this.webViewAndMobile) {
            if (!this.isGeolocated) {
              reason.push('notGeoLocated')
            }
          }
        }
        if (this.gettingABTnR) {
          reason.push('gettingABTnR')
        }
        if (this.betSlipCheckError) {
          reason.push('betSlipCheckError')
        }
        if (this.showBetSlipChanged) {
          reason.push('BetSlipChanged')
        }
        if (this.showError) {
          reason.push('showError')
        }
        //
//        return this.gettingABTnR || this.betSlipCheckError
        return reason.length ? reason.join('_') : false
      },
      betslipLayout2 () {
        return window.ctsautoconf.BETSLIP_LAYOT_2 || false
      }
      /*,
      showHistoryTabs () {
        return config.app.betHistoryInBetslip
      }
      */
    },

    methods: {
      setState (n) {
        store.commit('sbBetslipState/setCurrentBetSlipState', n)
      },
      popLogIn () {
//        this.placeBetAfterLogIn = true
        store.dispatch('overlayState/activateLoginDialog')
        /*
        switch (this.externalWalletProvider) {
          case 'GAN':
            if (this.isOpenedFromWebView) {
              let url = '/static/externallogin.html'
              window.open(url, '_self')
            } else {
              store.dispatch('overlayState/activateLoginDialog')
            }
            break
          case 'FD':
            let url = this.externalUrls.login
            window.open(url, '_self')
            break
        }
        */
      },
      clearAll () {
        store.dispatch('sbBetslipState/clearBetSlip', {onButtonClick: true})
      },
      closeBetslipDialog () {},
      liveBetNow () {},
      initPlaceBet () {
        // console.log('initPlaceBet')
        this.isButtonDisabled = true
        this.placeBetAfterLogIn = false
        var data = {
          isFastBet: this.isFastBet,
          webViewAndMobile: !this.isOpenedFromWebView && this.mobileBigAndBelow,
          isOpenedFromWebView: this.isOpenedFromWebView,
          mobileBigAndBelow: this.mobileBigAndBelow,
          isGeolocated: this.isGeolocated,
          isGeoLocationEnabled: this.isGeoLocationEnabled
        }
        store.dispatch('sbBetslipState/initPlaceBet', data).then(function (response) {
//          console.log('initPlaceBet response')
//          console.log(response)
        })
      },
      rejectBetSlip () {
        this.isButtonDisabled = true
        store.dispatch('sbBetslipState/rejectBetSlip', {isFastBet: this.isFastBet})
      },
      confirmBetSlip () {
        this.isButtonDisabled = true
        store.dispatch('sbBetslipState/confirmBetSlip', this.isFastBet)
      },
      acceptChanges () {
        this.showBetSlipChanged = false
        store.dispatch('sbBetslipState/acceptChanges')
      },
      injectS () {
        store.dispatch('sbBetslipState/injectselections', [56365912.3])
      },
      //
      confirmDialog () {
//        console.log('confirmDialog')
        if (!this.currentBetSlipState) {
          this.addToBetSlip()
        }
      },
      addToBetSlip () {
        this.dialogSingleBetslip.resolve(!true)
//        store.dispatch('overlayState/deactivateSingleBetslip')
//        store.commit('sbBetslipState/setActiveBetSlip', false)
        this.dismissBetSlip(true, true, true)
      }
    },

    created () {
//      console.log('Created BS Buttons')
    },

    mounted () {
    },

    watch: {
      betSlipChangeNo (val) {
        this.showBetSlipChanged = this.isLoggedIn && this.showAcceptingChangesInfo && val
      },
      tab () {
        if (this.showBetSlipChanged) {
          this.acceptChanges()
        }
      },
      dismissErrorFromSelection () {
        this.dismissBetSlip(true, true, true)
      },
      isGeolocated (newVal, oldVal) {
//        console.log('isGeolocated:', oldVal, '=>', newVal)
        if (newVal && this.currentBetSlipState === 0 && this.errorId && this.errorId === 'NATIVE-FAILED-GEOLOCATION') {
          this.dismissBetSlip(true, true, true, true)
        }
      },
      isLoggedIn: {
        immediate: true,
        handler  (newVal, oldVal) {
          // console.log('Watch isLoggedIn (BS-Buttons):', oldVal, '=>', newVal)
          store.commit('sbBetslipState/setCurrentBetSlipState', 0)
          store.dispatch('sbBetslipState/clearAttemptedBetSlip')
          this.dismissBetSlip(1, 1, 1)
          /*
          if (newVal) {
            if (this.placeBetAfterLogIn) {
              this.initPlaceBet()
            }
          }
          */
        }
      },
      closeFromParent (newVal) {
//        console.log('closeFromParent 0: ' + this.closeFromParent + ' newVal: ' + newVal)
        if (newVal && (this.betSlipStatus.State === 2 || this.betSlipStatus.State === 4 || this.currentBetSlipState >= 7)) {
//          console.log('closeFromParent: ')
          this.dismissBetSlip()
        }
        setTimeout(function () {
          store.commit('sbBetslipState/setCloseFromParent', false)
        }, 0)
      },
      currentBetSlipState: {
        immediate: true,
        handler  (newVal) {
//          console.log('isButtonDisabled: ' + this.isButtonDisabled + '; currentBetSlipState: ' + newVal)
          this.isButtonDisabled = false
        }
      }
    },

    destroyed () {
    }
  }
</script>

<style lang="stylus" scoped>
  .separator {
    margin: 12px 0;
    border: 0;
    border-top: 1px solid #cfd6db;
  }
  .betSlipBtns {
    div:empty {
      display: none;
    }
    button:disabled {
      opacity: 0.6;
    }
    button .loader-container {
      position: absolute;
      right: 10px;
      top: 10px;
      .loader {
        border-width: 3px;
        border-top-width: 3px;
        border-top-color: #888888;
        width: 12px;
        height: 12px;
      }
    }
    /*padding: 10px;*/
    background-color: #fff;
    .v-btn {
      background-color: #004c97;
      font-size: 14px;
      border-radius: 2px;
    }
  }

  .action-btns {
    padding: 12px 0;
    background-color: #fff;
  }

  .btn-label {
    .line1 {
      font-size: 16px;
    }
    .line2 {
      font-size: 12px;
      opacity: 0.8;
    }
  }

  .action_buttons, .btn-container
    display: flex;
    -webkit-box-align: stretch;
    -ms-flex-align: stretch;
    align-items: stretch;

    .column-left,
    .column-right
      flex: 1

    .column-left
      flex-basis: 50%
      margin-right: 8px
    .column-right
      flex-basis: 50%
    .btn
      width: 100%
      border-radius: 2px
      font-size: 14px
      font-weight: normal
      margin: 0
      color: #fff
      min-height: 50px
      min-width: 48px
    .primary-btn
      background-color: #0b4da1 !important
      color #fff
    .btn_white
      background: #fff
      color: #0b4da1
      border: 1px solid #cfd6db
    .secondary
      background: #ffffff !important
      border: 1px solid #CFD6DB !important
      margin-left: -2px
      color: #0b4da1
    .primary
      background: #0b4da1 !important
      border: 1px solid #0b4da1 !important
      color: #fff
      margin-left: 4px
      &:hover
        background-color: #0d7fe1

  .betslip-gc-msg
    max-width: 396px
    min-height 207px
    background-color: white
    position: sticky
    z-index: 2
    padding 16px 12px
    border solid 1px #cfd6db
    border-radius 4px
    bottom 0px
    @media mobile-big-and-below
      bottom 59px
    h3
      color #152a47
      font-size 16px
      margin-bottom 8px
    p
      color #152a47
      font-size 14px
    .btn
      background-color #3fc369
    .primary-btn
      background-color #3fc369
      border-radius: 2px
    .betslip-gc-details
      color #1493ff
      font-size 14px
      font-weight bold
      margin-top 24px
      margin-bottom 10px
      cursor pointer
      text-align center

.action_buttons
.btn-container
  display: flex
  align-items: stretch

.FastBetSlip
  .action-btns
    padding 0 !important
    .column
      display flex
      align-items stretch
      .column-right
      .column-left
        flex 1
  .BetSlipBtns
    padding-top 10px
  .v-btn
    width 100%
    margin 0
</style>
