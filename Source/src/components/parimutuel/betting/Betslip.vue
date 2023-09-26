<template>
  <div class="pmbetslip" :class="[{'betslip-empty' : !bsPool || (Object.values(selectedSRRunners).length === 0 && Object.values(selectedMRRunners).length === 0)}, {'loggedin' : isLoggedIn}]">
    <div class="emptyBetSlip" v-if="!bsPool || (Object.values(selectedSRRunners).length === 0 && Object.values(selectedMRRunners).length === 0)">
      <div v-if="brandLayout !=='generic'" class="add-bets-container">
        <v-icon>add</v-icon>
        <div class="ab-info-msg">
          <span class="ab-label">{{ $t('BetSlip.add.bets') }}</span>
          <span class="ab-label zerobets" v-html="$t('BetSlip.zero.bets')"></span>
        </div>
      </div>
      <div v-if="brandLayout ==='generic'" class="empty-betslip-container">
        <img :src="mediaServer('/static/brand-img/' + brandKey + '/empty-betslip.svg')" class="empty_betslip" alt="Betslip" />
      </div>
      <div class="betslip_actions">
        <geolocation-indicator></geolocation-indicator>
        <div class="pmbs-btnctrls" v-if="!placeBetStatus && !isLoggedIn">
          <div class="action-btns emptybetslip">
            <div class="pmbs-btnctrls-group tac">
              <v-btn class="placebetbtn" @click.stop="popUpLogIn()" color="primary" id="btnLogInAndPlaceBet">{{ $t('BetSlip.btn.msg.LogIn') }}</v-btn>
            </div>
          </div>
        </div>
      </div>
    </div>
    <template v-else>
      <div class="betslip-content-holder">
        <div v-if="bsPool && meeting && !placeBetStatus" class="betslip-content">
          <div class="pmbs-bethead pmbs-block clearafter">
            <div class="meeting-name">{{ meeting.name }}</div>
            <div class="meeting-date">{{ filterMeetingDate(meeting.date) }}</div>
          </div>

          <!-- RUNNER POOLS -->
          <div v-if="bsPool.category === 'RUNNER POOL'">
            <div class="pmbs-block">
              <div class="pmbs-bettitle clearafter">
                Race # {{selectedSRTote.race.number}}
                <span style="float:right" v-if="selectedSRTote.race.usc === 'ON'" :class="'racetimeticker ' + pmRaceClockCalculate(selectedSRTote.race.tsstart, selectedSRTote.timestamp).cssclass" :data-racetsstart="selectedSRTote.race.tsstart" :data-racedatastamp="selectedSRTote.timestamp" :data-raceusc="selectedSRTote.race.usc">{{ pmRaceClockCalculate(selectedSRTote.race.tsstart, selectedSRTote.timestamp).timetostarts }}</span>
                <span style="float:right" v-else class="racetimeticker racetime-over">{{ selectedSRTote.race.gsc }}</span>
              </div>
              <div class="pmbs-rnrgroup">
                <div class="pmbs-rnrgrouptitle clearafter">{{ bsPool && bsPool.type ? pmTranslatePoolType(bsPool.type) : '-' }}</div>
                <div class="pmbs-rnrgrouprnrs"><div v-for="rnrdata in selectedSRRunners" v-if="rnrdata && rnrdata.finishes && rnrdata.finishes.has(0)" class="pmbs-rnrgrouprnr"><span :class="'silknum silknum-' +  Math.floor(rnrdata.runner.num)">{{rnrdata.runner.entrynumber}}</span> {{ makeSrRunnerName(rnrdata.runner) }} <button class="but-remove" @click="removeSRSelection(rnrdata.runner.id, 0)"><icon name="icon-trash-grey"></icon></button></div></div>
              </div>
            </div>
          </div>

          <!-- RACECAST POOLS -->
          <div v-if="bsPool.category === 'RACECAST POOL'">
            <div class="pmbs-block">
              <div class="pmbs-bettitle clearafter">
                Race # {{selectedSRTote.race.number}}
                <span style="float:right" v-if="selectedSRTote.race.usc === 'ON'" :class="'racetimeticker ' + pmRaceClockCalculate(selectedSRTote.race.tsstart, selectedSRTote.timestamp).cssclass" :data-racetsstart="selectedSRTote.race.tsstart" :data-racedatastamp="selectedSRTote.timestamp" :data-raceusc="selectedSRTote.race.usc">{{ pmRaceClockCalculate(selectedSRTote.race.tsstart, selectedSRTote.timestamp).timetostarts }}</span>
                <span style="float:right" v-else class="racetimeticker racetime-over">{{ selectedSRTote.race.gsc }}</span>
              </div>
              <div class="pmbs-bettitle bettypetitle clearafter" v-if="bsPool && bsPool.type">
                <template v-if="bsBetType === 'NO_OPTION'">{{ pmTranslatePoolType(bsPool.type) }}</template>
                <template v-else-if="bsBetType === 'STRAIGHT'">{{ pmTranslatePoolType(bsPool.type) }}</template>
                <template v-else-if="bsBetType === 'PERMUTATION'">{{ pmTranslatePoolType(bsPool.type) }} BOX</template>
                <template v-else-if="bsBetType === 'BANKER'">{{ pmTranslatePoolType(bsPool.type) }} KEY</template>
                <template v-else-if="bsBetType === 'FLOATING_BANKER'">{{ pmTranslatePoolType(bsPool.type) }} KEY BOX</template>
              </div>
              <div v-if="bsBetType === 'STRAIGHT'" v-for="(legN, legIx) in bsPool.nooflegs4pooltype" class="pmbs-rnrgroup">
                <div class="pmbs-rnrgrouptitle">{{$t('Betslip.PM.PositionPlace', {n:position[legN]})}}</div>
                <div class="pmbs-rnrgrouprnrs">
                  <div v-if="Object.values(selectedSRRunners).filter(rnrdata => rnrdata.finishes.has(legN)).length === 0">&nbsp;</div>
                  <div v-for="rnrdata in selectedSRRunners" v-if="rnrdata && rnrdata.finishes && rnrdata.finishes.has(legN)" class="pmbs-rnrgrouprnr"><span :class="'silknum silknum-' +  Math.floor(rnrdata.runner.num)">{{rnrdata.runner.entrynumber}}</span> {{ makeSrRunnerName(rnrdata.runner) }} <button class="but-remove" @click="removeSRSelection(rnrdata.runner.id, legN)"><icon name="icon-trash-grey"></icon></button></div>
                </div>
              </div>
              <div v-if="bsBetType === 'PERMUTATION' || bsBetType === 'NO_OPTION'" class="pmbs-rnrgroup">
                <div class="pmbs-rnrgrouptitle">{{$t('Betslip.PM.Any_Order')}}</div>
                <div class="pmbs-rnrgrouprnrs"><div v-for="rnrdata in selectedSRRunners" v-if="rnrdata && rnrdata.finishes && rnrdata.finishes.has('any')" class="pmbs-rnrgrouprnr"><span :class="'silknum silknum-' +  Math.floor(rnrdata.runner.num)">{{rnrdata.runner.entrynumber}}</span> {{ makeSrRunnerName(rnrdata.runner) }} <button class="but-remove" @click="removeSRSelection(rnrdata.runner.id, 'any')"><icon name="icon-trash-grey"></icon></button></div></div>
              </div>
              <div v-if="bsBetType === 'BANKER'" class="pmbs-rnrgroup">
                <div class="pmbs-rnrgrouptitle">{{$t('Betslip.PM.1st_Place')}}</div>
                <div class="pmbs-rnrgrouprnrs"><div v-for="rnrdata in selectedSRRunners" v-if="rnrdata && rnrdata.finishes && rnrdata.finishes.has('banker')" class="pmbs-rnrgrouprnr"><span :class="'silknum silknum-' +  Math.floor(rnrdata.runner.num)">{{rnrdata.runner.entrynumber}}</span> {{ makeSrRunnerName(rnrdata.runner) }} <button class="but-remove" @click="removeSRSelection(rnrdata.runner.id, 'banker')"><icon name="icon-trash-grey"></icon></button></div></div>
              </div>
              <div v-if="bsBetType === 'FLOATING_BANKER'" class="pmbs-rnrgroup">
                <div class="pmbs-rnrgrouptitle">{{$t('Betslip.PM.Key')}}</div>
                <div class="pmbs-rnrgrouprnrs"><div v-for="rnrdata in selectedSRRunners" v-if="rnrdata && rnrdata.finishes && rnrdata.finishes.has('banker')" class="pmbs-rnrgrouprnr"><span :class="'silknum silknum-' +  Math.floor(rnrdata.runner.num)">{{rnrdata.runner.entrynumber}}</span> {{ makeSrRunnerName(rnrdata.runner) }} <button class="but-remove" @click="removeSRSelection(rnrdata.runner.id, 'banker')"><icon name="icon-trash-grey"></icon></button></div></div>
              </div>
              <div v-if="bsBetType === 'BANKER' || bsBetType === 'FLOATING_BANKER'" class="pmbs-rnrgroup">
                <div class="pmbs-rnrgrouptitle">{{$t('Betslip.PM.With')}}</div>
                <div class="pmbs-rnrgrouprnrs"><div v-for="rnrdata in selectedSRRunners" v-if="rnrdata && rnrdata.finishes && rnrdata.finishes.has('any')" class="pmbs-rnrgrouprnr"><span :class="'silknum silknum-' +  Math.floor(rnrdata.runner.num)">{{rnrdata.runner.entrynumber}}</span> {{ makeSrRunnerName(rnrdata.runner) }} <button class="but-remove" @click="removeSRSelection(rnrdata.runner.id, 'any')"><icon name="icon-trash-grey"></icon></button></div></div>
              </div>
            </div>
          </div>

          <!-- MULTURACE POOLS -->
          <div v-if="bsPool.category === 'MULTIRACE POOL'">
            <div class="pmbs-block">
              <div class="pmbs-bettitle clearafter">
                {{ bsPool && bsPool.type ? pmTranslatePoolType(bsPool.type) : '-' }}
                <span style="float:right" v-if="getMultiRaceById(bsPool.legs[0].r).usc === 'ON'" :class="'racetimeticker ' + pmRaceClockCalculate(getMultiRaceById(bsPool.legs[0].r).tsstart, selectedMRTote.timestamp).cssclass" :data-racetsstart="getMultiRaceById(bsPool.legs[0].r).tsstart" :data-racedatastamp="selectedMRTote.timestamp" :data-raceusc="getMultiRaceById(bsPool.legs[0].r).usc">{{ pmRaceClockCalculate(getMultiRaceById(bsPool.legs[0].r).tsstart, selectedMRTote.timestamp).timetostarts }}</span>
                <span style="float:right" v-else class="racetimeticker racetime-over">{{ getMultiRaceById(bsPool.legs[0].r).gsc }}</span>
              </div>
              <div v-for="(leg, legIx) in bsPool.legs" class="pmbs-rnrgroup">
                <div class="pmbs-rnrgrouptitle clearafter">{{$t('Betslip.PM.RaceNumber', {n:getMultiRaceById(leg.r).number}) }}</div>
                <div class="pmbs-rnrgrouprnrs">
                  <div v-if="!selectedMRRunners.hasOwnProperty(leg.r.toString())">&nbsp;</div>
                  <div v-for="runner in selectedMRRunners[leg.r.toString()]" v-if="runner" class="pmbs-rnrgrouprnr"><span :class="'silknum silknum-' +  Math.floor(runner.num)">{{runner.entrynumber}}</span> {{ makeMrRunnerName(runner, leg.r) }} <button class="but-remove" @click="removeMRSelection(leg.r, runner.id)"><icon name="icon-trash-grey"></icon></button></div>
                </div>
              </div>
            </div>
          </div>
          <!-- NOT IMPLEMENTED -->
          <div class="STRAIGHT" v-if="availableRPTypes.indexOf(pooltype) === -1 && availableRCTypes.indexOf(pooltype) === -1 && availableMRTypes.indexOf(pooltype) === -1">
            {{$t('Betslip.PM.Not_Implemented')}}
          </div>
        </div>
        <div class="fixed_footer_sep" :style="betslipBottomHolderHeight" :class="{'not_visible': placeBetStatus}"></div>
        <div class="betslip_actions" ref="betslipFooter">
          <template v-if="bsPool && !placeBetStatus">
            <div v-if="isValidationVisible && betslipValidity && !betslipValidity.isValid" class="pm-msgblock validations">
              <div class="pm-msgtitle">{{$t('Betslip.PM.Wager_Validation')}}</div>
              <div v-for="([vInvldKey, vInvldData], vldDataIx) in Object.entries(betslipValidity.invalids)" class="pm-msgtext">
                <template v-if="vInvldKey === 'ZERO_RUNNERS'">{{$t('Betslip.PM.ZERO_RUNNERS')}}</template>
                <template v-else-if="vInvldKey === 'TOO_FEW_RUNNERS'">{{$t('Betslip.PM.TOO_FEW_RUNNERS')}}</template>
                <template v-else-if="vInvldKey === 'RC_ZERO_RUNNER4FINISH'">{{$t('Betslip.PM.RC_ZERO_RUNNER4FINISH')}}</template>
                <template v-else-if="vInvldKey === 'ZERO_RUNNER4ANY'">{{$t('Betslip.PM.ZERO_RUNNER4ANY')}}</template>
                <template v-else-if="vInvldKey === 'TOO_FEW_RUNNER4ANY'">{{$t('Betslip.PM.TOO_FEW_RUNNER4ANY')}}</template>
                <template v-else-if="vInvldKey === 'TOO_MANY_RUNNER4ANY'">{{$t('TOO_MANY_RUNNER4ANY')}}</template>
                <template v-else-if="vInvldKey === 'ZERO_RUNNER4BANKER'">{{$t('Betslip.PM.ZERO_RUNNER4BANKER')}}</template>
                <template v-else-if="vInvldKey === 'TOO_MANY_BANKERS'">{{$t('Betslip.PM.TOO_MANY_BANKERS')}}</template>
                <template v-else-if="vInvldKey === 'MR_RACE_WITHOUT_RUNNER'">{{$t('Betslip.PM.MR_RACE_WITHOUT_RUNNER')}}</template>
                <template v-else-if="vInvldKey === 'STAKE_ZERO'">{{$t('Betslip.PM.STAKE_ZERO')}}</template>
                <template v-else-if="vInvldKey === 'STAKE_LIMIT_MINUNITSTAKE'">{{$t('Betslip.PM.STAKE_LIMIT_MINUNITSTAKE', {n:vInvldData.limit, currency: currencySymbol})}}</template>
                <template v-else-if="vInvldKey === 'STAKE_LIMIT_MAXUNITSTAKE'">{{$t('Betslip.PM.STAKE_LIMIT_MAXUNITSTAKE', {n:vInvldData.limit, currency: currencySymbol})}}</template>
                <template v-else-if="vInvldKey === 'STAKE_LIMIT_MINTOTALSTAKE'">{{$t('Betslip.PM.STAKE_LIMIT_MINTOTALSTAKE', {n:vInvldData.limit, currency: currencySymbol})}}</template>
                <template v-else-if="vInvldKey === 'STAKE_LIMIT_MAXTOTALSTAKE'">{{$t('Betslip.PM.STAKE_LIMIT_MAXTOTALSTAKE', {n:vInvldData.limit, currency: currencySymbol})}}</template>
                <template v-else-if="vInvldKey === 'STAKE_LIMIT_STAKEINCREMENT'">{{$t('Betslip.PM.STAKE_LIMIT_STAKEINCREMENT', {n:vInvldData.limit, currency: currencySymbol})}}</template>
                <template v-else-if="vInvldKey === 'STAKE_LIMIT_MINSTAKEONLY'">{{$t('Betslip.PM.STAKE_LIMIT_MINSTAKEONLY', {n:vInvldData.limit, currency: currencySymbol})}}</template>
                <template v-else-if="vInvldKey === 'BET_NOT_CALCULATED'">{{$t('Betslip.PM.BET_NOT_CALCULATED')}}</template>
                <template v-else-if="vInvldKey === 'NOT_ALLOWED_FOR_BETTING'">{{$t('Betslip.PM.NOT_ALLOWED_FOR_BETTING')}}</template>
                <template v-else-if="vInvldKey === 'BETTING_DATA_IS_LOADING'">{{$t('Betslip.PM.BETTING_DATA_IS_LOADING')}}</template>
                <template v-else-if="vInvldKey === 'EXCLUDED_FOR_BETTING'">
                  <p v-if="vInvldData.reason.includes('PEND') && !vInvldData.reason.includes('SUSP')" v-html="$t('Account.Ovelay.Pending.Investigation')"></p>
                  <p v-else-if="vInvldData.reason.includes('SUSP') && !vInvldData.reason.includes('PEND')" v-html="$t('Account.Ovelay.Suspension')"></p>
                  <p v-else-if="vInvldData.reason.includes('SUSP') && vInvldData.reason.includes('PEND')" v-html="$t('Account.Ovelay.Pending.Investigation.and.Suspension')"></p>
                  <p v-else v-html="$t('BetSlip.placement.error.' + vInvldData.reason)"></p>
                </template>
                <template v-else-if="vInvldKey === 'NATIVE_APP_REQUIRED_ON_MOBILE'">{{$t('appInstaller.addTo.content')}}</template>
                <template v-else-if="vInvldKey === 'NATIVE_APP_GEOLOCATION_FAIL'">{{$t('nativeApp.failedGeolocation.contect.' + state)}}</template>
                <template v-else-if="vInvldKey === 'IN_BROWSER_GEOLOCATION_FAIL'">{{$t('nativeApp.failedGeolocation.contect.' + state)}}</template>
                <template v-else>{{vInvldKey}}</template>
              </div>
              <button class="pm-msgblock-close" @click.stop="showBetslipValidation(false)"><v-icon>close</v-icon></button>
            </div>
            <div style="display:none">
              stake: {{stake}}
              stakeStr: {{stakeStr}}
              betslipValidity: {{betslipValidity}}
            </div>
            <div class="pmbs-stakes line dark">
              <v-layout>
                <v-flex>
                  <label class="pmbs-numblock money editable">
                    <span class="label">{{$t('Betslip.PM.Bet_Amount')}}</span>
                    <span class="currency">{{$t('Betslip.PM.Currency')}}</span>
                    <input class="numinp" type="tel" v-model="stakeStr" />
                  </label>
                </v-flex>
                <v-flex>
                  <label class="pmbs-numblock">
                    <span class="label">{{$t('Betslip.PM.Bets')}}</span>
                    <span v-if="!isCalculating" class="numinp">{{numberOfCombinations}}</span>
                    <span v-else><loader></loader></span>
                  </label>
                </v-flex>
                <v-flex>
                  <label class="pmbs-numblock money">
                    <span class="label">{{$t('Betslip.PM.Ticket_Cost')}}</span>
                    <span class="currency">$</span>
                    <input v-if="!isCalculating" class="numinp" type="number" :value="stakeTotal" readonly="readonly" />
                    <span v-else><loader></loader></span>
                  </label>
                </v-flex>
              </v-layout>
            </div>
          </template>

          <geolocation-indicator></geolocation-indicator>

          <div class="pmbs-btnctrls" v-if="!placeBetStatus">
            <div v-if="isLoggedIn" class="pmbs-btnctrls-group tac">
              <v-btn class="placebetbtn" @click.stop="placeBet()" color="primary" :disabled="!isLoggedIn || (desktopAndAbove && !isGeolocated)" id="btnPlaceBet">{{ $t('BetSlip.btn.PlaceBet') }}</v-btn>
            </div>
            <div v-else class="pmbs-btnctrls-group tac">
              <v-btn class="placebetbtn" @click.stop="popUpLogIn()" color="primary" id="btnLogInAndPlaceBet">{{ $t('BetSlip.btn.msg.LogIn') }}</v-btn>
            </div>
            <div class="pmbs-btnctrls-group pmbs-btnctrls-group-clearall" :disabled="Object.values(selectedSRRunners).length === 0 && Object.values(selectedMRRunners).length === 0">
              <v-btn flat @click="clearBetslip()" class="but-remove pmbs-clearall"><icon name="icon-trash-grey"></icon>{{ $t('BetSlip.selection.btn.clearall') }}</v-btn>
            </div>
          </div>
        </div>

        <template v-if="placeBetStatus">
          <div v-if="placeBetStatus === 'L' || placeBetStatus.State === 0">
            <div class="pm-msgblock info tac placing_bet">
              <div class="pm-msgtitle">{{$t('Betslip.PM.Placing_Bet')}}</div>
              <div class="pm-msgtext"><loader></loader></div>
            </div>
          </div>
          <div v-else-if="placeBetStatus === 'P'">
            <div class="pm-msgblock success bet_placed">
              <a v-if="brandKey === 'boyd'">
                <img src="~@/assets/images/betslip/PlacedBetSign.svg" class="bet_placed_img" alt="Betslip">
              </a>
              <a class="bet_placed_icon" v-if="(brandKey === 'dn' || brandKey === 'dnw' || brandKey === 'circa')">
                <v-icon>done</v-icon>
              </a>
              <div class="pm-msgtitle">
                <div class="betplaced-text">{{$t('Betslip.PM.You_Successfully_placed', {n:numberOfCombinations, s:numberOfCombinations > 1 ? 's' : ''})}}</div>
                <div class="goodLuck_text">Good Luck!</div>
              </div>
            </div>
            <div class="pmbs-btnctrls">
              <div class="pmbs-btnctrls-group tac">
                <v-btn color="primary dismiss" @click="()=>{confirmBetslipMessage(true); clearBetslip(); toggleBetslip()}">{{$t('Betslip.PM.Dismiss')}}</v-btn>
                <v-btn @click.stop="()=>{confirmBetslipMessage(false); toggleBetslip()}" color="gray lighten-1 keep-selections">{{$t('Betslip.PM.Keep_Selections')}}</v-btn>
              </div>
            </div>
          </div>
          <div v-else-if="placeBetStatus === 'F'">
            <div class="pm-msgblock validations errors">
              <div class="pm-msgtitle">{{$t('Betslip.PM.Bet_Placement_Failed')}}</div>
            </div>
            <div class="pmbs-btnctrls">
              <div class="pmbs-btnctrls-group tac"><v-btn color="primary" @click="confirmBetslipMessage(false)">{{$t('BetSlip.quick.btn.OK')}}</v-btn></div>
            </div>
          </div>
          <div v-else-if="placeBetStatus.StatusText">
            <div class="pm-msgblock info">
              <div class="pm-msgtitle">{{ placeBetStatus.StatusText }}<span v-if="placeBetStatus.StatusText.slice(-1) !== '.'">.</span></div>
            </div>
            <div class="pmbs-btnctrls">
              <div class="pmbs-btnctrls-group tac"><v-btn color="primary" @click="confirmBetslipMessage(placeBetStatus.State === -2)">{{$t('BetSlip.quick.btn.OK')}}</v-btn></div>
            </div>
          </div>
          <div v-else>
            <div class="pm-msgblock validations errors">
              <div class="pm-msgtitle">{{$t('Betslip.PM.Error')}}</div>
            </div>
            <div class="pmbs-btnctrls">
              <div class="pmbs-btnctrls-group tac"><v-btn @click="confirmBetslipMessage(false)" color="primary">{{$t('BetSlip.quick.btn.OK')}}</v-btn></div>
            </div>
          </div>
        </template>
      </div>
    </template>
    <div v-if="true === 11">
      selectedSRRunners: {{selectedSRRunners}}<br />
      selectedMRRunners: {{selectedMRRunners}}<br />
      bsPool: {{bsPool}}<br />
      bsBetType: {{bsBetType}}<br />
      placeBetStatus: {{placeBetStatus}}
    </div>
  </div>
</template>
<script>
import Vue from 'vue'
import store from '@/store'
import config from '@/config'
import moment from 'moment'
import Loader from '@/components/common/Loader'
import CircleLoader from '@/components/common/CircleLoader'
import Icon from '@/components/common/Icon'
import Session from '@/components/mixins/Session'
import Screen from '@/components/mixins/Screen'
import Gtm from '@/components/mixins/Gtm'
import PariMutuel from '@/components/mixins/PariMutuel'
import GeoLocation from '@/components/mixins/GeoLocation'
import GeolocationIndicator from '@/components/common/GeolocationIndicator'
import Branding from '@/components/mixins/Branding'
import Url from '@/components/mixins/Url'

export default {
  name: 'betslip',

  components: {
    Loader,
    CircleLoader,
    Icon,
    GeolocationIndicator
  },

  mixins: [
    Session,
    Screen,
    Gtm,
    PariMutuel,
    GeoLocation,
    Branding,
    Url
  ],

  data () {
    return {
      position: [0, '1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th'],
      isValidationVisible: false,
      betslipBottomHolderHeight: { }
    }
  },

  computed: {
    state () { return config.app.autoconf.STATE },
    isLoggedIn () { return store.getters['isLoggedIn'] },
    stake: {
      get () {
        let sStake = store.getters['pmBetslipState/getStake']
        return sStake
      },
      set (value) {
        store.dispatch('pmBetslipState/setStake', { stake: value })
      }
    },
    stakeStr: {
      get () {
        let sStake = store.getters['pmBetslipState/getStakeStr']
        return sStake
      },
      set (value) {
        store.dispatch('pmBetslipState/setStake', { stake: value })
      }
    },
    stakeTotal () {
      if (this.stakeStr.length > 0) {
        let totalStake = this.stake * this.numberOfCombinations
        return this.pmFixMoney(totalStake)
      }
      return null
    },
    idtgmeeting () { return this.pmRouteParamToFloat(this.$route.params.idtgmeeting) },
    idtgrace () { return this.pmRouteParamToFloat(this.$route.params.idtgrace) },
    pooltype () { return this.$route.params.pooltype },
    bsPool () { return store.getters['pmBetslipState/getSelectedPool'] },
    bsBetType () { return store.getters['pmBetslipState/getSelectedBetType'] },
    meetings () { return store.getters['racecardState/getMeetingsWithOpenRaces'] },
    meeting () {
      var self = this
      let mtng = (this.idtgmeeting && this.meetings && this.meetings.filter(meeting => meeting.id.toString() === self.idtgmeeting.toString())[0])
      return mtng
    },
    /** First race from selected pool offer; Pool offers are selectable via their first race */
    race () {
      let firstrace = null
      let meeting = this.meeting
      let pool = this.bsPool
      if (meeting && pool && pool.legs && pool.legs.length > 0 && pool.legs[0] && pool.legs[0].r) {
        let firstRaceId = pool.legs[0].r
        let races = meeting.races.filter(race => { return race.id.toString() === firstRaceId.toString() })
        if (races.length > 0) { firstrace = races[0] }
      }
      return firstrace
    },
    selectedSRRunners () { return store.getters['pmBetslipState/getSelectedSRRunners'] },
    selectedSRTote () { return store.getters['pmBetslipState/getSelectedSRTote'] },
    selectedMRRunners () { return store.getters['pmBetslipState/getSelectedMRRunners'] },
    selectedMRTote () { return store.getters['pmBetslipState/getSelectedMRTote'] },
    isCalculating () { return store.getters['pmBetslipState/getIsCalculating'] },
    calculatedBets () { return store.getters['pmBetslipState/getCalculatedBets'] },
    placeBetStatus () { return store.getters['pmBetslipState/getPlaceBetStatus'] },
    availableRPTypes () { return store.getters['pmBetslipState/getAvailableRPTypes'] },
    availableRCTypes () { return store.getters['pmBetslipState/getAvailableRCTypes'] },
    availableMRTypes () { return store.getters['pmBetslipState/getAvailableMRTypes'] },
    numberOfCombinations () {
      let noComb = 0
      if (this.calculatedBets && this.calculatedBets.length > 0) {
        for (let i = 0; i < this.calculatedBets.length; i++) {
          noComb = noComb + this.calculatedBets[i].NoOfCombinations
        }
      }
      return noComb
    },
    selectedRunnersCount () { return store.getters['pmBetslipState/getSelectedRunnersCount'] },
    betslipValidity () {
      let validity = store.getters['pmBetslipState/getBetslipValidity']

      let geolocData = {
        webViewAndMobile: this.webViewAndMobile, // true if (!this.isOpenedFromWebView && this.mobileBigAndBelow)
        isOpenedFromWebView: this.isOpenedFromWebView,
        isGeolocated: this.isGeolocated,
        isGeoLocationEnabled: this.isGeoLocationEnabled
      }
      if (geolocData.webViewAndMobile) {
        validity.isValid = false; validity.invalids.NATIVE_APP_REQUIRED_ON_MOBILE = {}
      } else if (geolocData.isGeoLocationEnabled && !geolocData.isGeolocated && geolocData.isOpenedFromWebView) {
        validity.isValid = false; validity.invalids.NATIVE_APP_GEOLOCATION_FAIL = { }
      } else if (!geolocData.isGeolocated) {
        validity.isValid = false; validity.invalids.IN_BROWSER_GEOLOCATION_FAIL = {}
      }

      return validity
    },
    getCustomerContext () { return store.getters['getCustomerContext'] },
    balanceSum () { return (this.getCustomerContext && this.getCustomerContext.Balances && this.getCustomerContext.Balances.find(b => b.Key === 'CREDIT').Trading) || undefined },
    currencySymbol () { return config.app.CURRENCY }
  },

  methods: {
    resetBtslipUI () {
      this.stakeCopy = null
      this.showBetslipValidation(false)
    },
    removeSRSelection (idtgrunner, finish) {
      let selrnrs = this.selectedSRRunners
      if (selrnrs[idtgrunner.toString()] && selrnrs[idtgrunner.toString()].finishes.has(finish)) {
        let rnrdata = selrnrs[idtgrunner.toString()]
        let pool = this.bsPool
        let bettype = this.bsBetType

        let srtote = this.selectedSRTote
        let srtoteRace = srtote && srtote.race ? srtote.race : null
        let srtoteMeeting = srtote && srtote.meeting ? srtote.meeting : null
        let betinfo = { unitstake: this.stakeStr, numberofcombinations: this.numberOfCombinations, runnercount: this.selectedRunnersCount }
        let data4gtm = { meeting: srtoteMeeting, race: srtoteRace, runner: rnrdata.runner, pool: pool, bettype: bettype, finish: finish, betinfo: betinfo }
        this.gtmPmSendRemoveSelectionOnBetslip(data4gtm)

        store.dispatch('pmBetslipState/toggleSelectedRunner', { runner: rnrdata.runner, finish: finish, pool: pool, bettype: bettype })
      }
    },
    removeMRSelection (idtgrace, idtgrunner) {
      let selrnrs = this.selectedMRRunners
      if (selrnrs[idtgrace.toString()] && selrnrs[idtgrace.toString()][idtgrunner.toString()]) {
        let runner = selrnrs[idtgrace.toString()][idtgrunner.toString()]
        let pool = this.bsPool
        let bettype = this.bsBetType
        let finish = 0

        let mrtote = this.selectedMRTote
        let mrtoteMeeting = mrtote && mrtote.meeting ? mrtote.meeting : null
        let betinfo = { unitstake: this.stakeStr, numberofcombinations: this.numberOfCombinations, runnercount: this.selectedRunnersCount }
        let data4gtm = { meeting: mrtoteMeeting, race: null, runner: runner, pool: pool, bettype: bettype, finish: finish, betinfo: betinfo }
        this.gtmPmSendRemoveSelectionOnBetslip(data4gtm)

        store.dispatch('pmBetslipState/toggleSelectedRunner', { idtgrace: idtgrace, runner: runner, finish: finish, pool: pool, bettype: bettype })
      }
    },
    calculateBetSlip () {
      if (this.bsPool && this.bsPool.type) {
        store.dispatch('pmBetslipState/calculateBetSlip', this.bsPool.type)
      }
    },
    placeBet () {
      // console.log('betslip.vue placeBet')
      let betslipValidity = this.betslipValidity
      if (betslipValidity.isValid) {
        this.showBetslipValidation(false)

        let meeting = this.meeting
        let race = this.race
        let pool = this.bsPool
        let bettype = this.bsBetType
        let betinfo = { unitstake: this.stakeStr, numberofcombinations: this.numberOfCombinations, runnercount: this.selectedRunnersCount }
        let data4gtm = { meeting: meeting, race: race, runner: null, pool: pool, bettype: bettype, betinfo: betinfo }
        this.gtmPmSendBetAttempt(data4gtm)

        store.dispatch('pmBetslipState/placeBet')
      } else {
        if (betslipValidity.invalids.NATIVE_APP_REQUIRED_ON_MOBILE) {
          store.commit('overlayState/setMessageDialogMsg', { reason: 'native-app', persistent: true, options: { oncloseredirecttohome: false } })
          store.dispatch('overlayState/activateMessageDialog')
        } else if (betslipValidity.invalids.NATIVE_APP_GEOLOCATION_FAIL) {
          store.commit('overlayState/setMessageDialogMsg', { reason: 'native-failed-geolocation', persistent: true, fullscreen: false, options: { oncloseredirecttohome: false } })
          store.dispatch('overlayState/activateMessageDialog')
        } else if (betslipValidity.invalids.IN_BROWSER_GEOLOCATION_FAIL) {
          // no dialogues on browser
        }
        this.showBetslipValidation(true)
      }
    },
    confirmBetslipMessage (resetBetslip) {
      if (resetBetslip) {
        store.dispatch('pmBetslipState/resetBetSlip')
      } else {
        store.dispatch('pmBetslipState/resetBetslipStatus')
      }
    },
    toggleBetslip () {
      this.resetBtslipUI()
      store.dispatch('pmBetslipState/toggleBetslip')
    },
    showBetslipValidation (isVisible) {
      this.isValidationVisible = isVisible
    },
    clearBetslip () {
      let meeting = this.meeting
      let race = this.race
      let pool = this.bsPool
      let bettype = this.bsBetType
      let betinfo = { unitstake: this.stakeStr, numberofcombinations: this.numberOfCombinations, runnercount: this.selectedRunnersCount }
      let data4gtm = { meeting: meeting, race: race, runner: null, pool: pool, bettype: bettype, betinfo: betinfo }
      this.gtmPmSendRemoveAllSelectionsOnBetslip(data4gtm)

      this.showBetslipValidation(false)
      store.dispatch('pmBetslipState/resetBetSlip')
      store.dispatch('pmBetslipState/resetBetslipStatus')
    },
    getMultiRaceById (idtgrace) {
      let races = this.selectedMRTote.meeting.races.filter(race => race.idtgrace.toString() === idtgrace.toString())
      return (races && races[0]) || undefined
    },
    filterMeetingDate (date) {
      let mdate = date
      try {
        let dummy = this.pmMakeTsstartByDateAndTime(date, '1600')
        mdate = moment(dummy).format(config.app.dateFormats.shortDate)
      } catch (e) { }
      return mdate
    },
    makeRunnerName (runner, race) {
      let name = runner.name
      if (runner.coupled && race && race.runners) {
        let couplednum = runner.couplednum
        for (let r = 0; r < race.runners.length; r++) {
          if (race.runners[r].coupled && race.runners[r].couplednum === couplednum && race.runners[r].id !== runner.id) {
            name += ', ' + race.runners[r].name
          }
        }
      }
      return name
    },
    makeSrRunnerName (runner) {
      let srtote = this.selectedSRTote
      let race = srtote && srtote.race ? srtote.race : null
      return this.makeRunnerName(runner, race)
    },
    makeMrRunnerName (runner, idtgrace) {
      let race = runner.coupled ? this.getMultiRaceById(idtgrace) : null
      return this.makeRunnerName(runner, race)
    },
    popUpLogIn () {
      store.dispatch('overlayState/activateLoginDialog')
    },
    setBetSlipBottomHolderHeight () {
      var height
      if (!this.$refs.betslipFooter || this.$refs.betslipFooter.clientHeight === 0) {
        height = '176px'
      } else {
        height = this.$refs.betslipFooter.clientHeight + 'px'
      }
      Vue.set(this.betslipBottomHolderHeight, 'height', height)
    },
    selectionsNo () {
      return store.getters['sbBetslipState/selectionsNo']
    }
  },
  watch: {
    placeBetStatus (to, from) {
      // console.log('PariMutuel.vue watch placeBetStatus ', to, from)
      if (from && to && from === 'L' && to === 'P') {
        let meeting = this.meeting
        let race = this.race
        let pool = this.bsPool
        let bettype = this.bsBetType
        let betinfo = { unitstake: this.stakeStr, numberofcombinations: this.numberOfCombinations, runnercount: this.selectedRunnersCount }
        let data4gtm = { meeting: meeting, race: race, runner: null, pool: pool, bettype: bettype, betinfo: betinfo }
        this.gtmPmSendBetSuccess(data4gtm)
      } else if (from && to && from === 'L' && to === 'F') {
        let meeting = this.meeting
        let race = this.race
        let pool = this.bsPool
        let bettype = this.bsBetType
        let betinfo = { unitstake: this.stakeStr, numberofcombinations: this.numberOfCombinations, runnercount: this.selectedRunnersCount }
        let data4gtm = { meeting: meeting, race: race, runner: null, pool: pool, bettype: bettype, betinfo: betinfo }
        this.gtmPmSendBetError(data4gtm)
      }
    }
  },
  filters: {
  },
  updated () {
    this.setBetSlipBottomHolderHeight()
  },
  mounted () {
    this.setBetSlipBottomHolderHeight()
  }
}
</script>
