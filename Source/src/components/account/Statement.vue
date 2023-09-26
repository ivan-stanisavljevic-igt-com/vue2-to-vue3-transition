<template>
  <div class="stmnt">

    <div v-if="useBB" class="head">
      <div v-if="selectedState === 'Open'" class="inhead cashout">
        <span class="ttl stmnt-infocon" key="Statement.BetHistoryTitle4Open" >{{$t('Statement.BetHistoryTitle4Open')}}</span>
        <button v-if="isLoggedIn" class="stmnt-tgl filterbbtgl" :class="{ 'on': filterIsBuyBackOnly }" @click="toggleBuybackFilter()">BB only</button>
      </div>
    </div>

    <div v-if="selectedState === 'NonOpen' || selectedState === 'All'" class="head">
      <div :class="{'calendar_active' : filterVisiblePicker == 'from' || filterVisiblePicker == 'to'}" class="inhead bordered clickable" @click="togglePickers()">
        <div>
          <span class="minittl">{{ $t('Statement.daterange') }}</span>
          <span class="ttl filtertgl">{{ historyDateRange.from | moment('MM/DD/YYYY') }} - {{ historyDateRange.to | moment('MM/DD/YYYY') }}</span>
        </div>
        <v-icon>calendar_today</v-icon>
      </div>
    </div>

    <div v-if="false">
      <!--x {{isGeolocated}} x| {{geolocationMessage}}<br />-->
      selectedState: {{selectedState}}<br />
      useBB: {{useBB}}<br />
      bb.msg: {{bb.msg}} | {{bb.msgtype}}<br />
      bb.bet.SB: {{bb && bb.bet && !!bb.bet.SB}}<br />
      <!--bb: {{bb}}<br />-->
      bbStatus: {{bbStatus}}<br />
      bbStatus.state: {{bbStatus.state}}<br />
      <!--bbStatus: {{bbStatus}} | bb.state: {{bbStatus.state}} | bb.bet: {{ bb.bet }}<br />-->
      filterDateRange: {{ filterDateRange.from }} - {{ filterDateRange.to }}]<br />
      historyStatus: {{historyStatus}}<br/>
      filterIsBuyBackOnly: {{filterIsBuyBackOnly}}<br/>
    </div>

    <div v-if="!isLoggedIn" class="stmnt-block note">{{ $t('Statement.LoginToSeeBetHistory') }}</div>
    <div class="stmnt-fdaterang" v-if="isLoggedIn && (filterVisiblePicker == 'from' || filterVisiblePicker == 'to')">
      <div class="fdr-wrap">
        <div class="fdr-heading">
          <div class="stmnt-btnset x2 fullw">
            <div class="sbtnwrap"><button class="stmnt-btn datebtn" :class="{ 'active': filterVisiblePicker === 'from' }" @click="selectPicker('from')"><span class="headhint">{{ $t('Statement.daterange.from') }}</span>{{ filterDateRange.from | moment('ddd, MMM Do YYYY') }}</button></div>
            <div class="sbtnwrap"><button class="stmnt-btn datebtn" :class="{ 'active': filterVisiblePicker === 'to' }" @click="selectPicker('to')"><span class="headhint">{{ $t('Statement.daterange.to') }}</span>{{ filterDateRange.to | moment('ddd, MMM Do YYYY') }}</button></div>
          </div>
        </div>
        <v-date-picker v-if="filterDateRange.from && filterVisiblePicker === 'from'" v-model="filterDateRange.from" :show-current="filterDateRange.to" :full-width="true" :no-title="true" :max="filterDateRange.to" :event-color="calcPickerRangeDate" :events="calcPickerRangeDate"></v-date-picker>
        <v-date-picker v-if="filterDateRange.from && filterVisiblePicker === 'to'" v-model="filterDateRange.to" :show-current="filterDateRange.from" :full-width="true" :no-title="true" :min="filterDateRange.from" :max="new Date() | moment('YYYY-MM-DD')" :event-color="calcPickerRangeDate" :events="calcPickerRangeDate"></v-date-picker>
        <div class="fdr-footer">
          <div class="stmnt-btnset x2 fullw">
            <div class="sbtnwrap"><button class="stmnt-btn sb-white" @click="selectPicker('none')"><span>{{ $t('Statement.dialog.Close') }}</span></button></div>
            <div class="sbtnwrap"><button class="stmnt-btn sb-blue" @click="applyPickers('from')"><span>{{ $t('Statement.dialog.Apply') }}</span></button></div>
          </div>
        </div>
      </div>
    </div>

    <div class="stmnt-bbquote" v-if="isLoggedIn && bb && bb.bet && bb.bet.SB && (!bbStatus || bbStatus.state !== 'quoting')">
      <div class="bbq-wrap">
        <div class="block bbq-heading"><span class="text">{{ $t('Statement.CashOutConfirmation') }}</span><span class="bbq-btn bbq-btn-close" @click="cancelBuyBack()"><v-icon>close</v-icon></span></div>

        <div class="block bbq-info" v-if="bb.quote.Amount && bb.bet.Quote !== bb.quote.Amount"><div class="bbq-infomsg bbreoffer">{{ $t('Statement.CashoutReofferNotification') }}</div></div>
        <div class="block bbq-info" v-else><div class="bbq-infomsg stmnt-infocon icblue">{{ $t('Statement.CashOutInfo') }}</div></div>
        <div class="block bethead">
          <div class="betoverview">
            <div class="betttl" v-if="bb.bet.SB && isSingle(bb.bet.SB)">{{ bb.bet.SB.Legs[0].Event }}</div>
            <div class="betttl" v-else-if="bb.bet.SB && bb.bet.SB.BetTypeExt">{{bb.bet.SB.BetTypeExt}} <span v-if="bb.bet.SB && bb.bet.SB.BetTypeSpread" class="spreadhint">{{bb.bet.SB.BetTypeSpread}} {{ $t('Statement.spreadHint')}}</span></div>
            <div class="betttl" v-else-if="bb.bet.SB && bb.bet.SB.Units && bb.bet.SB.Units > 1">{{bb.bet.SB.BetType}} <span v-if="bb.bet.SB " class="unitshint">x{{bb.bet.SB.Units}} {{ $t('Statement.unitsHint') }}</span></div>
            <div class="betttl" v-else-if="bb.bet.SB">{{bb.bet.SB.BetType}}</div>
            <div class="betrefs" v-if="bb.bet.Status === 'Open'">
              {{ bb.bet.Created | date("yyyy-MM-ddThh:mm:ss") | moment(dateFormats.longDateTime) }}
              <br>
              <template v-if="brandLayout !== 'generic'">
                #{{bb.bet.InvoiceSlip}} - {{bb.bet.SB.IDFOBetSlip}}
              </template>
              <template v-if="brandLayout === 'generic'">
                {{ $t('Statement.SlipId') }} {{bb.bet.SB.IDFOBetSlip}}
              </template>
            </div>
          </div>
        </div>
        <div class="block betbbquotes">
          <div class="betbbquote">{{ $t('Statement.CachoutValue') }}<span class="money" :class="{ 'blink blink-orange': bb.bet.Quote !== bb.quote.Amount }">{{ bb.quote.Amount | currency}}</span></div>
          <div class="betbbquote">{{ $t('Statement.PotentialReturns') }} <span v-if="bb.bet.SB.Potential && bb.bet.SB.Potential > 0" class="money">{{ bb.bet.SB.Potential | currency }}</span><span v-else  class="money">-</span></div>
        </div>

        <div class="block" v-if="!isGeolocated && isLoggedIn">
          <div class="bbq-infomsg notgeolocated">
            <p>{{ $t('BetSlip.notLocated.' + state)}}</p>
            <p>{{ $t('BetSlip.tryAgain.' + state)}}</p>
          </div>
        </div>
        <div class="block buyback" v-else-if="bb.quote.Amount">
          <button class="stmnt-btn sb-blue" @click="settleBuyBack(bb.bet.SB.IDFOBet, bb.bet)">{{ $t('Statement.CashOutConfirmCashout') }}</button>
          <div class="bb-loading" v-if="bbStatus && (bbStatus.state === 'settling' || bbStatus.state === 'quoting')"><circle-loader></circle-loader></div>
        </div>
        <div v-else>
          <div v-if="bb.msg" class="bbq-infomsg msg notgeolocated center-text">
            <v-icon>info_outline</v-icon>
            <div class="msg stmnt-infocon" :class="' msg-' + bb.msgtype +' stmnt-infocon-' + bb.msgtype">{{ $t('Statement.CashOut.msg.' + bb.msg) }}</div>
          </div>
        </div>
      </div>
    </div>

    <!--
    <div class="stmnt-bbstatemsg" v-if="isLoggedIn && bb && bb.msg" @click="cancelBuyBack()">
      <div class="msg stmnt-infocon" :class="' msg-' + bb.msgtype +' stmnt-infocon-' + bb.msgtype">{{ $t('Statement.CashOut.msg.' + bb.msg) }}</div>
    </div>
    -->

    <div class="stmnt-notif" v-if="(filterVisiblePicker == 'none') && !(historyStatus && historyStatus.fetching === true) && (!isLoggedIn || !history || history.length < 1)">
      <div v-if="history && history.length === 0 && selectedState === 'Open'" class="stmnt-block note"><span class="main">{{ $t('Statement.NoOpenRecordsToShow') }}</span></div>
      <div v-else-if="history && history.length === 0 && selectedState === 'NonOpen'" class="stmnt-block note">
        <span class="main">{{ $t('Statement.NoSettledRecordsToShow') }}</span>
      </div>
      <div v-else-if="history && history.length === 0 && selectedState === 'All'" class="stmnt-block note"><span class="main">{{ $t('Statement.NoRecordsToShow') }}</span></div>
      <div class="stmnt-ctrls" v-else-if="history && history.length === 0">
        <button class="v-btn sb-blue" @click="gotoLiveBetting()"><span class="v-btn__content">{{ $t('Statement.GoToLiveBetting') }}</span></button>
      </div>
    </div>

    <!--stmnt-bets-->

    <div class="stmnt-bets" v-if="isLoggedIn && filterVisiblePicker == 'none'">
      <div v-for="bet in history" class="stmnt-bet" :set="[isBetSGPV=isBetSGP(bet), isBetSGPPlusV=isBetSGPPlus(bet)]"
           :class="['betstatus-' + bet.statusInner + (bet.SB && bet.SB.IDFOBet === bb.idfobet && bb.msgtype === 'nok' ? ' error-outline' : ''), isFixedPriceTypeBet(bet)]">
        <div class="block bethead">
          <div v-if="bet.SB" class="betoverview" :class="{'single' : bet.SB && isSingle(bet.SB)}">
            <div class="betttl whitetitle Single" v-if="bet.SB && isSingle(bet.SB)"><!-- {{bet.SB.BetType}} renaming Single to Straight--><span>{{ $t('BetSlip.tab.title.Single')}}</span></div>
            <div class="betttl whitetitle SameGameParlay" v-else-if="bet.SB && isBetSGPV">
              <span v-html="$t('BetSlip.tab.title.SGP.'+isBetSGPV, {legs:bet.SB.Legs.length})"></span>
<!--              <div class="sgp-event-name">{{bet.SB.Legs[0].Event}}</div>-->
            </div>
            <div class="betttl whitetitle SameGameParlayPlus" v-else-if="bet.SB && isBetSGPPlusV">
              <span v-html="$t('BetSlip.tab.title.SGP.Plus', {legs:bet.SB.Legs.length})"></span>
<!--              <div class="sgp-plus-participants"> {{sgpPlusParticipants(bet)}} </div>-->
            </div>
            <div class="betttl whitetitle SB-BetTypeExt Parlay" v-else-if="bet.SB && bet.SB.BetTypeExt">{{bet.SB.BetTypeExt}} <span v-if="false && bet.SB && bet.SB.BetTypeSpread" class="spreadhint">{{bet.SB.BetTypeSpread}} {{ $t('Statement.spreadHint')}}</span></div>
            <div class="betttl whitetitle SB-Units MultiBet" v-else-if="bet.SB && bet.SB.Units && bet.SB.Units > 1">{{bet.SB.BetType}} <span v-if="bet.SB" class="unitshint">x{{bet.SB.Units}} {{ $t('Statement.unitsHint')}}</span></div>
            <div class="betttl whitetitle SB-BetType BetType" v-else-if="bet.SB">{{bet.SB.BetType}}</div>
            <div class="betrefs_align">
              <div class="betrefs">{{ bet.Created | date("yyyy-MM-ddThh:mm:ss") | moment(dateFormats.longDateTime) }}
                <br>
                <template v-if="brandLayout !== 'generic'">
                  #{{bet.InvoiceSlip}} - {{bet.SB.IDFOBetSlip}}
                </template>
                <template v-if="brandLayout === 'generic'">
                  {{ $t('Statement.SlipId') }} {{bet.SB.IDFOBetSlip}}
                </template>
              </div>
            </div>
          </div>
          <div v-else-if="bet.TG" class="betoverview">
            <div class="betttl whitetitle">{{ pmTranslatePoolType(bet.TG.PoolType) }}</div>
            <div class="betrefs_align">
              <div class="betrefs">{{ bet.Created | date("yyyy-MM-ddThh:mm:ss") | moment(dateFormats.longDateTime) }}<br>#{{bet.InvoiceSlip}} - {{bet.TG.BetId}}</div>
            </div>
          </div>
        </div>

        <div class="block bethead SGP-Event" v-if="isBetSGPV"><div class="SgpEventName"> {{bet.SB.Legs[0].Event}} </div></div>

        <div class="block SGP-Plus-Event" v-if="isBetSGPPlusV"><div class="SgpPlusParticipants"> {{sgpPlusParticipants(bet)}} </div></div>

        <template v-if="bet.SB">
          <div class="block leg" :class="'legstatus-'+(leg.Status ? leg.Status.toLowerCase() : 'xx')" v-for="leg in bet.SB.Legs">
            <div class="betsporticon"><icon :name="`icon-${ (leg.IDFOSportType.split(' ').join('').toLowerCase()) || 'empty' }`"></icon></div>
            <div class="leginfo" :class="{ 'leginfo-live': bet.SB && bet.SB.BetState == 'O' && liveEvents.filter(ev => ev.idfoevent == leg.IDFOEvent).length > 0 }">
              <div class="leginfo-top">
                <span v-if="!isBetSGPV">{{ bet.SB && isSingle(bet.SB) ? bet.SB.Legs[0].Event : leg.Event }}</span>
                <span class="PitcherNames" style="padding-left: 6px;" v-if="leg.IDFOSportType === 'BASEBALL' && leg.PitcherHA && (leg.PitcherAway || leg.PitcherHome)">
                 {{ ' (' + (leg.PitcherAway || 'Away Pitcher') + ' @ ' + (leg.PitcherHome || 'Home Pitcher') + ')' }}
                </span>
              </div>
              <div class="leginfo-main">
                <span class="leginfo-stats"><div class="leginfo-odds" :class="'PriceType-'+leg.IDFOPriceType"
                   v-if="leg.PriceUp && leg.PriceDown && !sgpPriceTypes.includes(leg.IDFOPriceType && (leg.IDFOPriceType.toUpperCase() || ''))">{{leg | formatOdds}}</div></span>
                <span v-if="showLegStatus && (bet.SB.BetState !== 'O' || !isSingle(bet.SB) || leg.Status.toLowerCase() !== 'open')" class="leginfo-status" :class="'legstatus-'+(leg.Status ? leg.Status.toLowerCase() : 'xx')">{{leg.Status}}</span>
                {{ leg.SelectionExt }}
              </div>
              <div class="leginfo-sub">
                <span v-if="leg.IDFOSportType === 'BASEBALL' && leg.PitcherHA">
                  {{ leg.ParentName || leg.Market }}
                  <span v-if="leg.ParentName" > - {{ $t('BetSlip.selection.listedPitcher.option.' + leg.PitcherHA, {marketName: leg.Market,
                    homePitcher: leg.PitcherHome || "Home Pitcher", awayPitcher: leg.PitcherAway || "Away Pitcher",
                    homeTeam: leg.TeamHome || "Home Team", awayTeam: leg.TeamAway || "Away Team"}) }}
                  </span>
                  <span v-if="!leg.ParentName && leg.Big3=='ML'"> - {{$t('BetSlip.selection.listedPitcher.option.AP')}}</span>
                </span>
                <span v-else>{{ leg.Market }}</span>
              </div>
              <div class="leginfo-main tsstart_info" v-if="showEventTsInBetHistory"><ts-start :tsstart="leg.Offtime"></ts-start></div>
              <div class="legribbon legribbon-void" v-if="bet.SB && bet.SB.BetState != 'O' && leg.Status && leg.Status.toLowerCase() === 'void'">void</div>
              <div class="legliveicon" v-if="bet.SB && bet.SB.BetState == 'O' && liveEvents.filter(ev => ev.idfoevent == leg.IDFOEvent).length > 0"> LIVE</div>
            </div>
          </div>
        </template>
        <template v-else-if="bet.TG && bet.TG.Legs && bet.TG.Legs.length > 0">
          <div class="block leg" :class="'legstatus-xx'">
            <div class="betsporticon"><icon name="icon-horseracing"></icon></div>
            <div class="leginfo">
              <div class="leginfo-top">{{ bet.TG.MeetingName }} <span v-if="bet.TG.Legs && bet.TG.Legs.length > 0" style="position:absolute; right:0; top:0">{{pmFormatStartTs(bet.TG.Legs[0].RaceStart)}}</span></div>
              <template v-for="(leg, legIx) in bet.TG.Legs">
                <div class="leginfo-top leggroup-title" v-if="legIx === 0 || bet.TG.Legs[legIx].RaceId !== bet.TG.Legs[legIx -1].RaceId">Race {{leg.RaceNumber}}</div>
                <template v-if="racecastPoolTypes.indexOf(bet.TG.PoolTypeId) > -1">
                  <div class="leggroup-subtitle" v-if="bet.TG.BetType === 'STRAIGHT' && (legIx === 0 || bet.TG.Legs[legIx].LegOrder !== bet.TG.Legs[legIx -1].LegOrder)">{{leg.LegOrder}} place:</div>
                  <div class="leggroup-subtitle" v-if="(bet.TG.BetType === 'PERMUTATION' || bet.TG.BetType === 'NO_OPTION') && legIx === 0">In any order:</div>
                  <div class="leggroup-subtitle" v-if="bet.TG.BetType === 'BANKER' && legIx === 0">1st Place:</div>
                  <div class="leggroup-subtitle" v-if="bet.TG.BetType === 'FLOATING_BANKER' && legIx === 0">Key:</div>
                  <div class="leggroup-subtitle" v-if="(bet.TG.BetType === 'BANKER' || bet.TG.BetType === 'FLOATING_BANKER') && legIx > 0 && bet.TG.Legs[legIx].LegOrder !== bet.TG.Legs[legIx -1].LegOrder">With:</div>
                </template>
                <div class="leginfo-main leggroup-entry">#{{leg.EntryNumber}} {{leg.FlagCoupled === true ? leg.CoupledNames : leg.RunnerName}}</div>
              </template>
            </div>
          </div>
        </template>        

        <div v-if="bet.SB" class="block result">
          <div class="betodds" :class="{ 'hidden': bet.SB && !bet.SB.Odds }">
            <span class="hint">{{ $t('BetSlip.oddsprice') }}</span>
            <div v-if="bet.SB && bet.SB.Odds && bet.SB.Odds !== 0" class="value">{{bet.SB | formatOdds}}</div>
            <div v-else class="value">&nbsp;</div>
          </div>
          <div class="betstake">
            <span class="hint">{{ $t('Statement.wager')}}</span>
            <div class="value">
              <span v-if="bet.SB.Stake">{{bet.SB.Stake | currency}}</span>
              <span v-else>-</span>
            </div>
          </div>
          <div class="betreturn" :class="bet.Status">
            <div class="content-wrapper">
              <span v-if="bet.Status === 'Open' && bet.SB && bet.SB.Potential && bet.SB.Potential > 0" class="hint">{{ $t('Statement.MaxWin')}}</span>
              <span v-else-if="bet.statusInner === 'boughtback'" class="hint">{{ $t('Statement.CASHEDOUT')}}</span>
              <span v-else class="hint">{{ $t('Statement.' + bet.StatusText)}}</span>
              <div class="value">
                <span v-if="bet.Status === 'Open' && bet.SB && bet.SB.Potential && bet.SB.Potential > 0 && bet.SB.Stake">{{ (bet.SB.Potential - bet.SB.Stake) | currency }}</span>
                <span v-else-if="bet.Status === 'Open'">-</span>
                <span v-else-if="bet.Status === 'Lost'">{{ 0 | currency}}</span>
                <span v-else-if="bet.Status !== 'Open' && bet.SB.Return != null"><span>{{bet.SB.Return | currency}}</span></span>
                <span v-else>-</span>
              </div>
            </div>
          </div>
        </div>
        <div v-if="bet.TG" class="block result">
          <div class="betodds">
            <span class="hint">{{ $t('Statement.bets') }}</span>
            <div v-if="bet.TG.AmountStake" class="value">{{bet.TG.AmountStake / bet.TG.AmountUnit}}</div>
            <div v-else class="value">&nbsp;</div>
          </div>
          <div class="betstake">
            <span class="hint">{{ $t('Statement.wager')}}</span>
            <div class="value">
              <span v-if="bet.TG.AmountStake">{{bet.TG.AmountStake | currency}}</span>
              <span v-else>-</span>
            </div>
          </div>
          <div class="betreturn" :class="bet.Status">
            <div class="content-wrapper">
              <span class="hint">{{ $t('Statement.' + bet.StatusText)}}</span>
              <div class="value">
                <span v-if="bet.Status === 'Open'">-</span>
                <span v-else-if="bet.Status === 'Lost'">{{ 0 | currency}}</span>
                <span v-else-if="bet.Status !== 'Open' && bet.TG.AmountReturn != null"><span>{{bet.TG.AmountReturn | currency}}</span></span>
                <span v-else>-</span>
              </div>
            </div>
          </div>
        </div>

        <template v-if="bet.SB">
          <div class="block Voucher" v-if="bet.Bonus">
            <div class="discount">
              <span class="hint">{{ $t('Statement.discount')}}</span>
              <div class="value">
                <span v-if="bet.Bonus">{{bet.Bonus | currency}}</span>
                <span v-else>-</span>
              </div>
              <span class="voucher-description" v-if="bet.BonusText">{{bet.BonusText}}</span>
            </div>
          </div>

          <div class="block SpecialOffer" v-if="bet.SB.Offers">
            <div v-for="offer in bet.SB.Offers" :class="offer.Type">
              <span>{{ $t('SpecialOffer.' + offer.Type + '.offer.title') }}:</span>
              <span v-if="offer.Return">{{offer.Return | currency}}</span><span v-else>-</span>
              <span>({{offer.Name}})</span>
            </div>
          </div>

          <div class="block buyback" v-if="bet.Status === 'Open' && bet.SB && bet.Quote && bet.Quote > 0">
            <button class="stmnt-btn sb-green" @click="quoteBuyBack(bet.SB.IDFOBet)">
              <icon name="icon-available-for-bb-white"></icon>
              {{ $t('Statement.CashOut') }} {{bet.Quote | currency}}
            </button>
            <div class="bb-loading" v-if="bb && bb.bet && bb.bet.SB && bb.bet.SB.IDFOBet === bet.SB.IDFOBet"><circle-loader></circle-loader></div>
          </div>
        </template>
      </div>

      <div v-if="historyStatus && historyStatus.error && historyStatus.error === 'SessionTimeout'" class="stmnt-block note">{{ $t('Statement.SessionTimeout')}}</div>
      <div v-if="historyStatus && historyStatus.fetching === true" class="stmnt-block loading"><circle-loader></circle-loader></div>

      <div class="stmnt-ctrls" v-if="(!historyStatus || historyStatus.fetching === false) && history && history.length && (pageNumber+1) < pageCount && pageCount > 0">
        <button v-if="(pageNumber+1) < pageCount && pageCount > 0" class="v-btn" @click="loadMore()"><span class="v-btn__content">{{ $t('Statement.LoadMoreDown')}}</span></button>
      </div>
      <div v-if="history && history.length" class="note note-pagehint">showing pages 1-{{pageNumber + 1}} of {{pageCount}}</div>
    </div>

  </div>
</template>
<script>
  import store from '@/store'
  import config from '@/config'
  import priceFormat from '@/library/priceFormat'
  import Datepicker from 'vuejs-datepicker'
  import CircleLoader from '@/components/common/CircleLoader'
  import Icon from '@/components/common/Icon'
  import BettingOffer from '@/components/mixins/BettingOffer'
  import PariMutuel from '@/components/mixins/PariMutuel'
  import GeoLocation from '@/components/mixins/GeoLocation'
  import tsStart from '@/components/common/tsStart.vue'
  import Branding from '@/components/mixins/Branding'

  export default {
    name: 'statement',
    components: {
      Datepicker,
      CircleLoader,
      Icon,
      tsStart
    },
    data: () => ({
      filterDateRange: { from: null, to: null },
      filterVisiblePicker: 'none',
      filterIsBuyBackOnly: false,
      historyUpdater4BBId: undefined
    }),
    props: [
      'selectedState'
    ],
    mixins: [
      BettingOffer,
      PariMutuel,
      GeoLocation,
      Branding
    ],
    computed: {
      isLoggedIn () {
        return store.getters['isLoggedIn']
      },
      geolocationMessage () {
        return store.getters['overlayState/getGeolocationMessage']
      },
      useBB () {
        return store.getters['statementState/useBB']
      },
      history () {
        return store.getters['statementState/getHistory']
      },
      historyStatus () {
        return store.getters['statementState/getHistoryStatus']
      },
      historyDateRange () {
        return store.getters['statementState/getHistoryDateRange']
      },
      historyDateRangeFrom () {
        return store.getters['statementState/getHistoryDateRangeFrom']
      },
      historyDateRangeMax () {
        let d = new Date()
        d.setTime(d.getTime() + (24 * 60 * 60 * 1000))
        return d
      },
      pageSize () {
        return store.getters['statementState/getPageSize']
      },
      pageNumber () {
        return store.getters['statementState/getPageNumber']
      },
      pageCount () {
        return store.getters['statementState/getPageCount']
      },
      bb () {
        return store.getters['statementState/getBB']
      },
      bbStatus () {
        return store.getters['statementState/getBbStatus']
      },
      bbRefreshInterval () {
        return config.app.autoconf.BUYBACK_REFRESH_INTERVAL
      },
      state () {
        return window.ctsautoconf.STATE
      },
      teasersPriceTypes () {
        return store.getters['sbBetslipState/teasersPriceTypes']
      },
      showEventTsInBetHistory () {
        return store.getters['sbBetslipState/showEventTsInBetHistory']
      },
      sgpPriceTypes () {
        return store.getters['sbBetslipState/sgpPriceTypes']
      },
      showLegStatus () {
        return config && config.app && config.app.autoconf && config.app.autoconf.SHOW_LEG_STATUS_IN_BETHISTORY
      }
    },
    methods: {
      togglePickers () {
        if (this.filterVisiblePicker === 'none') {
          let f = this.historyDateRange.from ? this.historyDateRange.from : new Date()
          let t = this.historyDateRange.to ? this.historyDateRange.to : new Date()
          let autoZero = function (val) {
            return val < 10 ? '0' + val : val
          }
          this.filterDateRange.from = f.getFullYear() + '-' + autoZero(f.getMonth() + 1) + '-' + autoZero(f.getDate())
          this.filterDateRange.to = t.getFullYear() + '-' + autoZero(t.getMonth() + 1) + '-' + autoZero(t.getDate())
          this.filterVisiblePicker = 'from'
          if (document.querySelector('.mobile_betslip')) {
            document.querySelector('.mobile_betslip').style.zIndex = 200
          }
        } else {
          this.filterVisiblePicker = 'none'
          if (document.querySelector('.mobile_betslip')) {
            document.querySelector('.mobile_betslip').style.zIndex = 1
          }
        }
      },
      selectPicker (picker) {
        if (['from', 'to', 'none'].includes(picker)) {
          this.filterVisiblePicker = picker
        }
        if (document.querySelector('.mobile_betslip')) {
          if (picker !== 'none') {
            document.querySelector('.mobile_betslip').style.zIndex = 200
          } else {
            document.querySelector('.mobile_betslip').style.zIndex = 1
          }
        }
      },
      applyPickers () {
        let drFroms = this.filterDateRange.from.split('-')
        let drTos = this.filterDateRange.to.split('-')
        if (drFroms.length === 3 && drTos.length === 3) {
          let drFromDate = new Date(drFroms[0], parseInt(drFroms[1] - 1), drFroms[2], 0, 0, 1)
          let drToDate = new Date(drTos[0], parseInt(drTos[1] - 1), drTos[2], 23, 59, 59)
          let newHistoryDateRange = { from: drFromDate, to: drToDate }
          store.dispatch('statementState/changeHistoryDateRange', newHistoryDateRange)
        }
        this.fetchHistory(0)
        this.selectPicker('none')
      },
      calcPickerRangeDate (date) {
        let dF = null
        if (this.filterDateRange.from !== null && this.filterDateRange.from.split('-').length === 3) {
          let fs = this.filterDateRange.from.split('-')
          dF = new Date(fs[0], parseInt(fs[1] - 1), fs[2], 0, 0, 1)
        } else if (this.historyDateRange && this.historyDateRange.from) { dF = this.historyDateRange.from }

        let dT = null
        if (this.filterDateRange.to !== null && this.filterDateRange.to.split('-').length === 3) {
          let ts = this.filterDateRange.to.split('-')
          dT = new Date(ts[0], parseInt(ts[1] - 1), ts[2], 23, 59, 59)
        } else if (this.historyDateRange && this.historyDateRange.to) { dT = this.historyDateRange.to }

        const [dY, dM, dD] = date.split('-')
        let d = new Date(dY, parseInt(dM) - 1, dD)
        if (d && dF !== null && dT !== null) {
          if (dF.getFullYear() === dT.getFullYear() && dF.getMonth() === dT.getMonth() && dF.getDate() === dT.getDate()) {
            return false
          } else if (d.getFullYear() === dF.getFullYear() && d.getMonth() === dF.getMonth() && d.getDate() === dF.getDate()) {
            return 'range-start'
          } else if (d.getFullYear() === dT.getFullYear() && d.getMonth() === dT.getMonth() && d.getDate() === dT.getDate()) {
            return 'range-end'
          } else if (d.getTime() > dF.getTime() && d.getTime() < dT.getTime()) {
            return 'range-in'
          }
        }

        return false
      },
      toggleBuybackFilter () {
        this.filterIsBuyBackOnly = !this.filterIsBuyBackOnly
        this.selectPicker('none')
        let pageNum = 0
        this.fetchHistory(pageNum)
      },
      quoteBuyBack (idfobet) {
        store.dispatch('statementState/quoteBuyBack', {
          idfobet: idfobet
        })
      },
      settleBuyBack (idfobet, bet) {
        store.dispatch('statementState/settleBuyBack', {
          idfobet: idfobet
        }).then(() => {
        }).catch(() => {
        })
      },
      cancelBuyBack () {
        store.dispatch('statementState/cancelBuyBack', {})
      },
      loadInitial () {
        console.log('Initial load')
        this.selectPicker('none')
        let pageNum = 0
        this.fetchHistory(pageNum)
      },
      loadMore () {
        let pageNum = this.pageNumber
        if (pageNum < this.pageCount) { pageNum++ }
        this.fetchHistory(pageNum)
      },
      fetchHistory (pageNum) {
        let pDateFrom = null
        let pDateto = null
        let pPageNumber = pageNum
        let pQueryType = this.queryType
        let pQueryStatus = this.selectedState
        let pQueryBB = this.filterIsBuyBackOnly

        if (this.historyDateRange.from && this.historyDateRange.to) {
          pDateFrom = this.historyDateRange.from
          pDateto = this.historyDateRange.to
        }

        store.dispatch('statementState/fetchHistory', {
          dateFrom: pDateFrom,
          dateTo: pDateto,
          pageNumber: pPageNumber,
          queryType: pQueryType,
          queryStatus: pQueryStatus,
          queryBB: pQueryBB
        })
      },
      fetchHistoryUpdate4BB () {
        store.dispatch('statementState/fetchHistoryUpdate4BB', {})
      },
      canHaveReturn (bet) {
        let priceTypeNilifiers = ['SP', 'FP', 'WPD', 'PPD', 'SPD'].concat(this.teasersPriceTypes)
        bet.SB.Legs.forEach(function (leg) {
          if (priceTypeNilifiers.includes(leg.IDFOPriceType) || !leg.PriceDown || !leg.PriceUp) return false
        })
        return true
      },
      gotoLiveBetting () {
        this.$router.push({name: 'sports-live', params: { }})
      },
      extractSportsFromBet (bet) {
        let sports = []
        if (bet && bet.SB && bet.SB.Legs) {
          bet.SB.Legs.forEach(function (leg) {
            if (sports.indexOf(leg.IDFOSport) === -1) {
              sports.push(leg.IDFOSport)
            }
          })
        }
        return sports.join(',')
      },
      isFixedPriceTypeBet (bet) {
        let isFixedPriceTypeBet = false
        if (bet && bet.SB && bet.SB.Legs && bet.SB.Legs.length) {
          isFixedPriceTypeBet = bet.SB.Legs.every(leg => leg.IDFOPriceType === 'FP')
        }
        return isFixedPriceTypeBet ? 'isFixedPriceTypeBet' : ''
      },
      isBetSGP (bet) {
        let sgpPriceTypes = this.sgpPriceTypes
        let isParlay = bet && bet.SB && bet.SB.Legs && bet.SB.Legs.length > 1 && bet.SB.IDFOBetType && (bet.SB.IDFOBetType === 'A' || bet.SB.IDFOBetType.indexOf('A-') === 0)
        let priceType = isParlay && bet.SB.Legs[0].IDFOPriceType
        let eventId = isParlay && bet.SB.Legs[0].IDFOEvent
        let isSGP = eventId && priceType && sgpPriceTypes.includes(priceType) &&
          // bet.SB.Legs.every(e => e.IDFOPriceType.split(',').includes('SGM') && e.IDFOEvent === eventId)
          bet.SB.Legs.every(e => e.IDFOEvent === eventId && e.IDFOPriceType === priceType) && priceType
        return isSGP
      },
      isBetSGPPlus (bet) {
        // console.log('isBetSGPPlus:')
        let sgpPriceTypes = this.sgpPriceTypes
        let isParlay = bet && bet.SB && bet.SB.Legs && bet.SB.Legs.length > 1 && bet.SB.IDFOBetType && (bet.SB.IDFOBetType === 'A' || bet.SB.IDFOBetType.indexOf('A-') === 0)
        let hasSGM = isParlay && bet.SB.Legs.some(e => sgpPriceTypes.includes(e.IDFOPriceType))
        let tags = hasSGM && bet.SB.Legs.map(l => l.Tag)
        tags = tags || []
        let tagsCount = {}
        for (let tag of tags) {
          if (tag) {
            tagsCount[tag] = tagsCount[tag] || 0
            tagsCount[tag]++
          }
        }
        let tagsCountArr = Object.values(tagsCount)
        // console.log('tagsCount:', JSON.stringify(tagsCount))
        // console.log('tagsCountArr:', tagsCountArr)
        let maxCount = Math.max(...tagsCountArr)
        tags = [...new Set(tags)]
        // console.log('Tags unique:', tags)
        let isBetSGPPlus = hasSGM && tags.length > 1 && maxCount > 1
        // console.log('isBetSGPPlus:', isBetSGPPlus)
        return isBetSGPPlus
      },
      sgpPlusParticipants (bet) {
        let tags = bet.SB && bet.SB.Legs && bet.SB.Legs.map(l => l.Tag)
        tags = tags || []
        let fosNo = tags.filter(t => !t).length
        let sgpNo = [...new Set(tags.filter(t => t))].length
        let label = this.$t('Statement.SGP_PARLAY.participants' +
          (sgpNo ? '.sgm' : '') + (sgpNo > 1 ? 's' : '') +
          (fosNo ? '.fos' : '') + (fosNo > 1 ? 's' : ''),
          {sgp: sgpNo, fos: fosNo})
        return label
      },
      isSingle (bet) {
        return bet.IDFOBetType === 'S' || (bet.Legs && bet.Legs.length === 1) || bet.BetType === 'Single'
      }
    },
    filters: {
      formatOdds (node) {
        if (!isNaN(parseFloat(node.Odds)) || (!isNaN(parseFloat(node.PriceUp)) && !isNaN(parseFloat(node.PriceDown)))) {
          let price = !isNaN(parseFloat(node.Odds)) ? ((node.Odds - 1) * node.Units + 1) : ((node.PriceDown + node.PriceUp) / node.PriceDown)
          // precision 0 decimal spaces for SB.price (for singles)
//          let precision = !isNaN(parseFloat(node.Odds)) ? 0 : 0
          let precision = -1
          return priceFormat.formatOdds(price, precision)
        } else {
          return undefined
        }
      },
      date (value, format) {
        if (!value) { return '' }
        var dt, d, t, i
        var leadZero = function (val) { return val.length < 2 ? '0' + val : val }
        var el = { 'yyyy': null, 'MM': null, 'M': null, 'dd': null, 'd': null, 'hh': null, 'h': null, 'mm': null, 'm': null, 'ss': null, 's': null, 'ap': null }

        var e = function (d, t) {
          el.yyyy = d[2]
          el.MM = d[1]
          el.MM = leadZero(el.MM)
          el.MM = leadZero(el.MM)
          el.M = (el.MM * 1).toString()
          el.dd = d[0]
          el.dd = leadZero(el.dd)
          el.d = (el.dd * 1).toString()
          el.hh = t[0]
          el.hh = leadZero(el.hh)
          el.h = el.hh === '12' ? el.hh : (el.hh * 1) % 12
          el.mm = t[1]
          el.mm = leadZero(el.mm)
          el.m = (el.mm * 1).toString()
          el.ss = t[2]
          el.ss = leadZero(el.ss)
          el.s = (el.ss * 1).toString()
          el.ap = el.hh * 1 < 12 ? 'AM' : 'PM'
        }
//        console.log('date value: ' + value)
        if (value.length === 8) {
          e([value.slice(0, 2), value.slice(2, 4), value.slice(4)], [0, 0, 0])
        } else if (value.indexOf('T') > -1) {
          dt = value.split('T')
          d = dt[0].split('-')
          t = dt[1].split(':')
          e([d[2], d[1], d[0]], [t[0], t[1], t[2]])
        } else {
          dt = value.split(' ')
          d = dt[0].split('-')
          t = dt[1].split('-')
          e([d[0], d[1], d[2]], [t[0], t[1], t[2]])
        }
        for (i in el) { format = format.replace(new RegExp(i, 'g'), el[i]) }
        return format
      }
    },
    created () {
//      console.log('created Statement')
      if (this.historyUpdater4BBId) {
        clearInterval(this.historyUpdater4BBId)
        this.historyUpdater4BBId = undefined
      }
      if (config.app.autoconf.BUYBACK_REFRESH_INTERVAL > 1) {
        let refreshInterval = (config.app.autoconf.BUYBACK_REFRESH_INTERVAL * 1000) + 1000
        this.historyUpdater4BBId = setInterval(() => { this.fetchHistoryUpdate4BB() }, refreshInterval)
      }
    },
    watch: {
      $route (to, from) {
        this.filterVisiblePicker = 'none'
      }
    },
    // mounted () { },
    // activated () { },
    // beforeUpdate () { },
    beforeDestroy () {
      if (this.historyUpdater4BBId) {
        clearInterval(this.historyUpdater4BBId)
        this.historyUpdater4BBId = undefined
      }
    },
    destroyed () {
      store.dispatch('statementState/clearHistory')
    }
  }
</script>

<style lang="stylus" scoped>
  @import '~@/css/config'

  .stmnt .center-text {text-align: center;}
  .stmnt { font-weight: normal; overflow: hidden; margin:0;}
  .stmnt .note { text-align: center; }
  .stmnt .note .main { display:block; clear:both; color: #2a77aa ; font-size: large; font-weight:normal; font-size: 18px }
  .stmnt .note .hint { display:block; clear:both; color: #2a77aa ; font-size: 14px; }
  .stmnt .note .hint .clickable { color:#1493ff; }
  .stmnt .note.note-pagehint { margin:0; padding:0; color: transparent; }
  .stmnt .linkbut { border:none 0; background:transparent; padding:2px 4px; margin:0 auto; color: #0090ff; cursor: pointer; }
  .stmnt .hidden { visibility:hidden }

  .stmnt-block { padding: 10px; }

  .stmnt .loading { margin: 0; text-align:center; }
  .stmnt .loading .spinner { margin: 0 auto; }

  .stmnt > .head { background: #fff; padding: 5px; }
  .stmnt > .head .inhead { padding:0 8px; line-height:38px; position:relative; border-radius:2px; border: solid 1px #fff; }
  .stmnt > .head .inhead.bordered { border-color: #cfd6dB; }
  .stmnt > .head .inhead.bordered .v-icon { color: #0b4da1 ; }
  .stmnt .inhead .minittl { font-size:10px; line-height:10px; text-transform:uppercase; display:block; position:relative; bottom:-6px; }
  .stmnt .inhead .ttl { font-family: 'Open Sans SemiBold'; font-size:larger; }
  .stmnt .inhead .ttl.stmnt-infocon { padding-left:25px; background-position:0 center; }
  .stmnt .inhead .ttl.filtertgl { display:block; padding-right:25px; }
  .stmnt .inhead .minittl + .ttl { line-height:28px; }
  .stmnt .inhead .filterbbtgl { float:right; margin-top: 6px; }

  .stmnt-fentry { padding: 5px 0 5px 10px; }
  .stmnt-fentry * { vertical-align: middle; }
  .stmnt-fentry label { cursor: pointer; }


  .stmnt-btn.datebtn { background-color: #fff; color: #111; border-color: #cfd6db; line-height:32px; text-align:left; padding-left:12px; padding-right:6px; }
  .stmnt-btn.datebtn .headhint { display:block; font-size:10px; line-height:12px; text-transform:uppercase; position:relative; bottom:-6px; }

  /*.stmnt-fdaterang { z-index:101; position:absolute; top:0; right:0; bottom:0; left:0; background-color:rgba(0,0,0,.8); }
  .stmnt-fdaterang > span { display: inline-block; }
  .stmnt-fdaterang .fdr-wrap { position:absolute; right:0; bottom:0; left:0; border-top-right-radius:10px; border-top-left-radius:10px; background-color: #fff; z-index:102; }
  .stmnt-fdaterang .fdr-heading { margin:0 5px; padding: 10px 5px; text-align:left; font-size:larger; }
  .stmnt-fdaterang .fdr-footer { margin:0 5px; padding: 10px 5px; text-align:left; font-size:larger; }

  .stmnt-fdaterang .date-picker-table > table { width: 100%; }*/

  .stmnt-bbquote { z-index:101; display:flex; position:fixed; top:0; right:0; bottom:0; left:0; background-color:rgba(0,0,0,.8); }
  .stmnt-bbquote .bbq-wrap { max-width: 500px; margin:auto; background-color: #fff; z-index:102; }
  .stmnt-bbquote .block { padding:10px; }
  .stmnt-bbquote .block.bethead,
  .stmnt-bbquote .block.betbbquotes { border-top: solid 1px #CFD6DB; }
  .stmnt-bbquote .block.bbq-info { padding-top:0; }
  .stmnt-bbquote .bbq-heading { text-align:left; line-height:30px; position:relative; }
  .stmnt-bbquote .bbq-heading .text { text-transform: uppercase; font-size: 20px; vertical-align:middle; font-family:'Open Sans Bold' }
  .stmnt-bbquote .bbq-heading .bbq-btn-close { font-size:24px; width:30px; text-align:center; display: inline-flex; position:absolute; top:10px; right:0px; cursor: pointer; }

  .stmnt-bbquote .bbq-infomsg { border:1px solid #1493ff; border-radius:3px; padding:15px 15px 15px 40px; color:#1493ff; background-color: rgba(20, 147, 255, .1); background-position:13px center; }
  .stmnt-bbquote .bbq-infomsg p { margin-bottom:5px; }
  .stmnt-bbquote .bbq-infomsg.notgeolocated { padding-left: 15px; border-color: #e44242; color: #db3f3f; background-color: rgba(228, 66, 66,0.1); }
  .stmnt-bbquote .bbq-infomsg.notgeolocated .v-icon{ color: #db3f3f; padding-right 5px; }
  .stmnt-bbquote .bbq-infomsg.msg { margin: 10px; }
  .stmnt-bbquote .bbq-infomsg.bbreoffer { padding-left: 15px; border-color: #f99f4a; color: #ea913c; background-color: rgba(249,159,74,0.1); }

  .stmnt-bbquote .betbbquote { text-transform:uppercase; }
  .stmnt-bbquote .betbbquote .money { float:right; font-family: 'Open Sans SemiBold'; }
  .stmnt-bbquote .blink.blink-orange {  animation: blinkOrangeBackground 1s; animation-iteration-count: 2; }
  @keyframes blinkOrangeBackground {
      0% { background-color: rgba(249,159,74,0); }
     50% { background-color: rgba(249,159,74,.8); }
    100% { background-color: rgba(249,159,74,0); }
  }

  .stmnt-bbstatemsg { z-index: 101; position: absolute; right: 0; bottom: 0; left: 0; background-color: rgba(0,0,0,0.8); }
  .stmnt-bbstatemsg .msg { padding: 12px 40px; background-color:#fff; }
  .stmnt-bbstatemsg .msg-nok { background-color:#e44242; color:#fff; }
  .stmnt-bbstatemsg .msg-nok.stmnt-infocon { padding-left:37px !important; background-position:12px center; }
  .stmnt-bbstatemsg .stmnt-infocon.msg-nok { }

  .stmnt-bets,
  .stmnt-notif { padding:0 4px; }

  @media mobile-big-and-below {
    .stmnt-bets,
    .stmnt-notif { padding:0 4px; }
  }

  .stmnt-notif { text-align:center; }
  .stmnt-notif .visual { padding-top:10vh; padding-bottom:5vh; min-height:150px; }
  .stmnt-notif .note { min-height:20vh; }

  .stmnt-bet { display:block; clear: both; background: #fff; margin-top:6px; overflow: hidden; }

  .stmnt-bet .bethead.SGP-Event { background: #fff; color #000; border:1px solid #dadbdf;font-family:'Open Sans SemiBold'; text-align:center; font-size:13px;}
  .stmnt-bet  .SGP-Plus-Event {font-family:'Open Sans SemiBold'; text-align:center; font-size:13px;}
  .stmnt-bet.error-outline { border-color:#e44242; }
  .stmnt-bet .block { padding:7px 9px 7px 10px; border-top: solid 1px #CFD6DB; }
  .stmnt-bet .block.bethead { display:table; width:100%; border-top: none 0; }
  .stmnt-bet .block.bethead > div { display:table-cell; vertical-align:middle; }
  .stmnt-bet .block.bethead .betsporticon { width: 24px; text-align: left; }
  .stmnt-bet .block.bethead .betttl { flex: 3; }
  .stmnt-bet .block.bethead .whitetitle { flex: initial; }
  .stmnt-bet .block.bethead .betrefs_align { flex: 2; }
  .stmnt-bet .block.bethead .betttl,
  .stmnt-bbquote .block.bethead .betttl {font-family:'Open Sans SemiBold';font-size: 14px;}
  .stmnt-bet .block.bethead .betttl .spreadhint,
  .stmnt-bbquote .block.bethead .betttl .spreadhint,
  .stmnt-bet .block.bethead .betttl .unitshint,
  .stmnt-bbquote .block.bethead .betttl .unitshint { font-weight:normal; }
  .stmnt-bet .block.bethead .betrefs,
  .stmnt-bbquote .block.bethead .betrefs { line-height: inherit; }

  .stmnt-bet .betoverview { position: relative; padding-right:31px; }
  .stmnt-bet.betstatus-boughtback .betoverview { padding-right: 90px; }
  .stmnt-bet .betstatusicon { top:0; right: 0; width: 28px; line-height:28px; font-family: 'Open Sans SemiBold'; text-transform:uppercase; padding: 0; overflow:hidden; text-align:center; border-radius: 16px; background-color: #CFD6DB; color: #06283b; }
  .stmnt-bet.betstatus-won .betstatusicon { background-color: #2CB459; color:#fff; }
  .stmnt-bet .betliveicon { position:absolute; top:0; right: -1px; font-size:smaller; font-family: 'Open Sans SemiBold'; padding: 1px 5px; color: #fff; background-color: #db3f3f; border-radius:3px; }

  .stmnt-bet .block.betinfo { border-top:none 0; }

  .stmnt-bet .leg { display:table; width:100%; }
  .stmnt-bet .leg > div { display:table-cell; vertical-align:top; }
  .stmnt-bet .leg .betsporticon { width: 24px; text-align: left; vertical-align: middle; }
  .stmnt-bet .leginfo { position: relative }
  .stmnt-bet .leginfo-top { font-family: 'Open Sans SemiBold'; }
  .stmnt-bet .leginfo-main {}
  .stmnt-bet .leginfo-sub { line-height:100%; color:#000; text-transform: uppercase; }
  .stmnt-bet .sub-right { text-align: right; }
  .stmnt-bet .leginfo-stats { float:right; margin-left:5px; white-space:nowrap;line-height:14px; margin-right: 5px;}
  .stmnt-bet .leginfo-status { float:right; margin-left:5px; white-space:nowrap; font-family:'Open sans Bold'; padding: 4px 0;}
  .stmnt-bet .leginfo-status.legstatus-won { color: #34b25d;}
  .stmnt-bet .leginfo-status.legstatus-lost { color: #e7212d;}

  .stmnt-bet .leggroup-title {}
  .stmnt-bet .leggroup-subtitle { padding-left:10px; padding-top: 5px }
  .stmnt-bet .leggroup-entry { padding-left: 20px; }

  .stmnt-bet .leginfo-live .leginfo-top { padding-right:40px; padding-bottom: 5px}
  .stmnt-bet .legliveicon { position:absolute; top:-2px; right: 0; font-family: 'Open Sans SemiBold'; padding: 0; overflow:hidden; text-align:center; color: #DB3F3F; margin-right: 5px }
  .stmnt-bet .legliveicon .dot { font-size:larger; }

  .stmnt-bet .legribbon { position:absolute; top:0; right: -10px; font-family: 'Open Sans SemiBold'; padding: 7px 12px; overflow:hidden; color: #818e95; background-color:#fff; border-bottom-left-radius:5px; border-top-left-radius:5px; text-transform: uppercase; }
  .stmnt-bet .legribbon-void { color: #fff; background-color:#818e95; }
  .stmnt-bet .legribbon-boughtback { color: #fff; background-color:#0d7fe1; }

  .stmnt-bet .result { display:table; width:100%; background-color:#f0f3f8;}
  .stmnt-bet .result > div { display:table-cell; vertical-align:middle; width: 33.3%; text-align:center; }
  .stmnt-bet .result .value { font-family: 'Open Sans SemiBold'; color:#1F375B; white-space: nowrap; }
  .stmnt-bet .result .hint { color:#818E95; text-transform: uppercase; }

  .stmnt-bet.betstatus-won .result .betreturn .value > span { padding: 0px; position:relative; }



  .stmnt-bet.betstatus-won .result .betreturn .value span span { background-color:#99EDB8; padding: 1px 3px; white-space: nowrap; }
  .stmnt-bet.betstatus-boughtback .result .betreturn .value span span { background-color:#9ED0FC; padding: 1px 3px; }

  .stmnt .block.buyback { position:relative; }
  .stmnt .buyback .bb-loading { position:absolute; top:0; right:0; bottom:0; left:0; background-color:#fff; }

  .stmnt-bet .buyback { background-color:#f0f3f8; border-top:0 none; text-align:center; }
  .stmnt-bet .result + .buyback { padding-top:0; }

  .stmnt-ctrls { background-color: #fff; padding:0 5px; text-align:center; border:solid 1px #cfd6dB; margin-top:5px; }
  .stmnt-btnset.fullw { width:100%; display:table; }
  .stmnt-btnset.x2 .sbtnwrap { display:table-cell; padding:0 5px; }
  .stmnt-btnset .sbtnwrap:first-child { padding-left:0; }
  .stmnt-btnset .sbtnwrap:last-child { padding-right:0; }
  .stmnt-btnset.x2 .sbtnwrap { width:50%; }

  .stmnt-infocon {  }
  .stmnt-infocon.icblue {  }
  .stmnt-infocon.icwhite {  }


  .stmnt-btn {
    font-family: 'Open Sans SemiBold';
    margin: 0 auto;
    padding: 0 16px;
    border-radius: 2px;
    background-color: #f5f5f5;
    line-height: 40px;
    display: block;
    width: 100%;
    box-sizing: border-box;
    border: 1px solid #f5f5f5;
  }
  .stmnt-btn.sb-green { background-color: #3fc369; color: #fff; border-color: #3fc369; }
  .stmnt-tgl {
    border: 0 none;
    background-color: #f0f3f8;
    text-align:left;
    text-indent:-9999px;
    position:relative;
    width:50px;
    height:28px;
    border-radius:14px;
  }
  .stmnt-tgl:focus { outline:none !important }
  .stmnt-tgl:after{
    content:"";
    position:absolute; top:4px; left:4px;
    display:inline-block; width:20px; height:20px; border-radius:10px;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2);
    background-color: #fff;
    transition:ease-in-out .3s;
  }
  .stmnt-tgl:not(.on) { box-shadow: 0 0 1px #bbb; }
  .stmnt-tgl.on { background-color: #3fc369; }
  .stmnt-tgl.on:after{ left: 26px; }


  @media desktop-and-above {
    .clickable { cursor:pointer; }
    .stmnt-btn:hover { background: #0d7fe1 !important; color:#fff !important; }
  }

  @media mobile-big-and-below {
    .stmnt { background-color: #fff; position:relative; height: 100%; }
    .stmnt .note.note-pagehint { display:none; }

    .stmnt-bbquote { position: fixed; }
    .stmnt-bbquote .bbq-wrap { bottom:60px; }

    .stmnt-bets { padding-bottom: 70px; /* min-height: 82vh; */ }
    .os-ios .stmnt-bets {padding-bottom: 100px}
  }

  /* iphone X */
  @media only screen and (min-device-width: 375px) and (min-device-height: 812px) and (-webkit-device-pixel-ratio: 3) {
    .os-ios .notWebView .stmnt-fdaterang .fdr-wrap,
    .os-ios .notWebView .stmnt-bbquote .bbq-wrap  {
      bottom:80px
    }
    .os-ios .stmnt-bets {padding-bottom: 100px}
  }

  /* iphone XR */
  @media only screen and (min-device-width: 414px) and (min-device-height: 896px) and (-webkit-min-device-pixel-ratio: 2) {
    .os-ios .notWebView .stmnt-fdaterang .fdr-wrap,
    .os-ios .notWebView .stmnt-bbquote .bbq-wrap {
      bottom: 80px
    }
    .os-ios .stmnt-bets {padding-bottom: 100px}
  }
  /*Iphone 6,7 Plus*/
  @media only screen and (min-device-width: 414px) and (min-device-height: 736px) {
    .os-ios .notWebView .stmnt-fdaterang .fdr-wrap,
    .os-ios .notWebView .stmnt-bbquote .bbq-wrap {
      bottom: 80px
    }
    .os-ios .stmnt-bets {padding-bottom: 100px}
  }
  @media only screen and (max-width: 340px) {
    .stmnt-bet .betrefs-active { flex: 3; }
  }

.stmnt
  background #fff
  color #0b4da1
  overflow auto!important
  padding 5px
  @media mobile-big-and-below
    margin 0 5px
.stmnt-btn
  width auto
  &.sb-green
    background-color #3fc369 !important
    color #fff
    border-color #3fc369 !important
    &:hover
    &:focus
    &:active
      background-color #3fc369 !important
      color #fff
      border-color #3fc369 !important
      outline 0px !important
.stmnt-bet .buyback
  background transparent !important
.stmnt-bet .result + .buyback
  padding-top 10px !important
.legliveicon
  background #e70e37
  color #fff !important
  font-style italic
  padding 0 5px !important
  font-size 11px
  margin 1px
  border-radius 4px
.stmnt-bet
  border 2px solid #e9eef5
  .block:not(.bethead)
    border-top 2px solid #e9eef5
    padding 5px !important
  .block.bethead
    background #0b4da1
    color #fff
    .betoverview
      padding-right 0
      display flex !important
      justify-content space-between
      align-items center
    .betttl
      .unitshint
        color #fff
      .leginfo-stats
        line-height 18px
      &:not(.whitetitle)
        color #248ADC !important
        text-transform uppercase
    .betrefs
      color #fff
      margin-left 10px
      text-align right
      line-height 1.2
  .leginfo
    .betrefs
      display flex
      justify-content space-between
      align-items center
      color #248ADC
      padding 5px 0
    .leginfo-odds
      background #248adc
      color #fff
      padding 5px
      min-width 40px
      text-align center
      min-width 45px
    .pd-icon-top-prize-pool
      color #FF7E00
.leginfo-top
  display flex
  .pd-icon
    padding-right 5px
.legstatus-lost
  .leginfo-stats
    &:before
      display none !important
  .leginfo-odds
    background #e7212d !important

.legstatus-won
  .leginfo-stats
    &:before
      display none !important
  .leginfo-odds
    background #34b25d !important

.isFixedPriceTypeBet
  .leginfo-odds.PriceType-FP
    display none !important

.stmnt-bet .result
  background #fff
  border-top 0px
  > div
    border 1px solid #939eae
    padding: 4px
    border-radius: 5px
    &:first-child
      border-right 0px
    &:nth-child(2n)
      border-left-style dashed
      border-right-style dashed
    &:nth-child(3n)
      border-left 0px
  .value
    border-radius: 0px
  .betreturn
    .content-wrapper
      font-family 'Open Sans Bold'
    .value
      background #248ADC
      color #fff
    &.lost
      opacity 0.8
      background #2a77aa 
      color #ffffff
      border 1px solid #248ADC
      .hint
        color #fff 
      .value
        background transparent !important
    &.Won
      color #ffffff !important
      .content-wrapper
        background #ff671f
      .hint
        color #fff
      .value
        background transparent !important
        span
          span
            background-color transparent !important
    &.Void
      .content-wrapper
        background #8db5d4
      .hint
        color #fff
      .value
        background transparent
    &.Lost, &.Cancelled
      .content-wrapper
        background #8db5d4
      .hint
        // color #051e41
        color #fff
      .value
        // color #051e41
        color #fff
        background transparent
.betstatus-boughtback // for CASHED OUT bet status
  .content-wrapper
    background rgb(36, 138, 220)
    .hint
      color #fff !important
    .value
      color #fff !important
.stmnt-ctrls
  border 0px !important
  background:  transparent !important
  .v-btn
    background #0b4da1 !important
    color #fff
.stmnt-notif .note
  display flex
  align-items center
  justify-content center
  border-top 1px solid #ddd

.stmnt-fdaterang
  border-top solid 1px #ddd
  padding-top 10px
  .datebtn.active
    border-color #2a77aa 
  .datebtn.active
    .headhint
      color #2a77aa
  .stmnt-btn
    width 100%
    &.datebtn
      border-radius 2px
      outline none
      &:hover
        background none !important
        outline none
        color #111 !important

  .stmnt-btn.sb-white
    border 2px solid #aabdd1
    background #fff
    color #157cc1
    &:hover
      background #157cc1
      border 2px solid #157cc1
  .stmnt-btn.sb-blue
    background #157cc1
    border 2px solid #157cc1
    color #fff
    &:hover
      background #157cc1
      border 2px solid #157cc1
  .date-picker-table
    .btn.accent
    .btn--outline
      background-color #157cc1 !important
      border-color #157cc1 !important
  .fdr-footer
    padding-top 5px
.inhead.bordered.clickable
  display flex
  align-items center
  justify-content space-between
  border 0px !important
.stmnt-fdaterang
  .fdr-wrap
    width 400px
    max-width 90%
    margin 0 auto

.bet-history-page
  .stmnt-bets
    .result
      .betreturn
        &.Open
          .content-wrapper
          font-weight 600
          background #248adc
            .hint
              color #fff
    .Voucher
      background #dadbdf
      .discount
        display flex
      .hint
      .value
      .voucher-description
        display inline-block
      .hint
        text-transform uppercase
        &:after
          content ':'
      .value
        color #ff671f
        font-family 'Open Sans Bold'
        padding 0 5px
      .voucher-description
        color #000
        &:before
          content '('
        &:after
          content ')'

.stmnt-bets
  .SameGameParlay
    .sgp-event-name
      font-family: 'Open Sans Regular'
      font-size 12px


.stmnt-bet .legribbon-void
  display none
.buyback
  .stmnt-btn.sb-green
    font-family 'Open Sans Bold'
    @media mobile-big-and-below
      width 100%
    >>>.igt-icon
      .icon-available-for-bb-white
        width 25px
.inhead.cashout
  padding 0 !important
  .stmnt-infocon
    padding-left 0 !important
.stmnt-bbquote .bbq-wrap
  @media mobile-big-and-below
    position absolute
    bottom 0
    left: 0
    right: 0
    padding-bottom 70px
.stmnt-bbquote .bbq-infomsg
  background #e5e5e5
  border-radius 5px
  padding 10px
  margin 0
  border 0px
  font-size 14px
  color: rgba(0,0,0,.87)
  @media mobile-big-and-below
    font-size 12px
    margin 0
.stmnt-bbquote .bbq-heading .text
  @media mobile-big-and-below
    font-size 16px
.bbq-btn-close
  .v-icon
    color transparent !important
    background-image: url('~@/assets/images/icons/icon-close-grey.svg')
    height 20px
    width 20px
.block.betbbquotes
  .betbbquote
    background #0b4da1
    border-bottom 1px solid #e5e5e5
    color #fff
    padding 5px
.bbq-infomsg
  text-align center !important
  border-radius 5px !important
  display flex
  justify-content flex-start
  align-items center
  .msg
    padding 0 !important
</style>
