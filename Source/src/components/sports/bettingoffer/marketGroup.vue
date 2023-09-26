<template>
  <div fluid class="marketgroup clearfix" :class="['counter-' + counter]" v-if="marketgroup && marketgroup.idfwmarketgroup" :idfwmarketgroup="marketgroup.idfwmarketgroup.toString()">
    <div class="headline-coupon-markets" v-if="isheadlinecoupon" :class="[headlineCouponSport, {'show-more-button': headlineCouponMoreThan3Selections}]" @click.stop="()=>{goToEvent(headlineCouponEvent);sendGTMEventBanner(headline);}">
      <div v-if="!headline.headline.imageurl" class="background" :class="'font-icon font-icon-' + headlineCouponSport.toLowerCase()"></div>
      <div class="headline-coupon-header">
        <h2 class="text-overflow">{{headlineCouponHeading}}</h2>
        <span class="time">
          <template v-if="filteredLiveEvents.length"> 
            <span class="live-box">LIVE</span>
          </template>
          <template v-if="!filteredLiveEvents.length">
            <span v-if="isDateToday(headlineCouponTime)"> TODAY {{ (headlineCouponEvent.tsstart) | moment(dateFormats.longTime) }}</span>
            <span v-if="isDateTomorrow(headlineCouponTime)">TOMORROW {{ (headlineCouponEvent.tsstart) | moment(dateFormats.longTime) }}</span>
            <span v-if="!isDateToday(headlineCouponTime) && !isDateTomorrow(headlineCouponTime)">{{ headlineCouponTime | moment(dateFormats.shortDateTime) }} </span>
          </template>
        </span>
      </div>
      <h3 class="market-name">
        <span v-if="headlineCouponMarketName" class="text-overflow">{{headlineCouponMarketName}}</span>
        <span class="event-name text-overflow">{{headlineCouponEvent.eventname}}</span>
      </h3>
      <div class=" coupon live-headline-coupon" v-if="filteredLiveEvents.length">
        <big3-markets-header
          :coupontitle="headlineCouponEvent.eventname"
          :idfosporttype="getIDFOSportType(headlineCouponEvent)"
          :is-big3-coupon="isBig3Coupon([headlineCouponEvent])"
          :has-draw="hasDraw([headlineCouponEvent])"
          :max-no-of-markets="maxNumberOfMarkets([headlineCouponEvent])"
          :max-no-of-selections="maxNumberOfSelections([headlineCouponEvent])"
          :isoutright="[headlineCouponEvent] && headlineCouponEvent && headlineCouponEvent.markets && headlineCouponEvent.markets[0] && headlineCouponEvent.markets[0].isoutright"></big3-markets-header>

        <div class="event">
          <live-event-info
            :event="liveEvents.find(liveEvent => liveEvent.idfoevent === headlineCouponEvent.idfoevent)"
            :page="'coupon'"
            :isbig3coupon="isBig3Coupon([headlineCouponEvent])"
            :twoselections="!isBig3Coupon([headlineCouponEvent]) && !hasDraw([headlineCouponEvent])"
            :threeselections="!isBig3Coupon([headlineCouponEvent]) && hasDraw([headlineCouponEvent])"
            :couponname="headlineCouponEvent.eventname">
          </live-event-info>
          <markets v-if="headlineCouponEvent.markets"
            :markets="isBig3Coupon([headlineCouponEvent]) ? headlineCouponEvent.markets : [headlineCouponEvent.markets[0]]"
            :event="headlineCouponEvent"
            maxnumofmarkets="3"
            :iscoupondisplay="true"
            :pricechangehighlight="true"
            :diplayOnPage="'prematch-event'"
            :isbig3coupon="isBig3Coupon([headlineCouponEvent])"
            :couponname="headlineCouponEvent.eventname"
            class="markets"></markets>
        </div>
      </div>
      <div class=" coupon prematch-headline-coupon" v-if="filteredPrematchEvents.length">
        <big3-markets-header
            :coupontitle="headlineCouponEvent.eventname"
            :idfosporttype="getIDFOSportType(headlineCouponEvent)"
            :is-big3-coupon="isBig3Coupon([headlineCouponEvent])"
            :has-draw="hasDraw([headlineCouponEvent])"
            :max-no-of-markets="maxNumberOfMarkets([headlineCouponEvent])"
            :max-no-of-selections="maxNumberOfSelections([headlineCouponEvent])"
            :isoutright="[headlineCouponEvent] && headlineCouponEvent && headlineCouponEvent.markets && headlineCouponEvent.markets[0] && headlineCouponEvent.markets[0].isoutright"></big3-markets-header>

        <div class="event">
          <coupon-event
            :event="headlineCouponEvent"
            :twoselections="!isBig3Coupon([headlineCouponEvent]) && !hasDraw([headlineCouponEvent])"
            :threeselections="!isBig3Coupon([headlineCouponEvent]) && hasDraw([headlineCouponEvent])"
            :isbig3coupon="isBig3Coupon([headlineCouponEvent])"
            :couponname="headlineCouponEvent.eventname"></coupon-event>
        </div>
      </div>
      <div class="headline-coupon-buttons">
        <v-btn class="more-button">{{ $t('More') }}</v-btn>
      </div>
    </div>
    <div v-else>
      <h3 class="name" v-if="showMarketgroupName" @click.stop="toggleCollapse()">{{ marketgroup.marketgroupname }} </h3>
      <!-- events per COMPETITION or DAYANDCOMPETITION -->
      <div v-if="['EVENTSPERCOMPETITION', 'EVENTSPERDAY'].indexOf(eventsGrouping) > -1 &&
        (eventsGroupedByCompetition.length > 0 || eventsGroupedByDateAndCompetition || liveEventsPerSportGroupedByIDFOSport.length > 0)"
           class="coupon group-by-date" v-show="isExpanded">
        <!-- LIVE -->
        <template v-if="isDebug">
        eventsGrouping : {{ eventsGrouping }}
        </template>
        <div v-if="!hideliveevents" v-for="(fosport, sportIndex) in liveEventsPerSportGroupedByIDFOSport" class="date live" :key="fosport.idfosport">
          <!--USD-361: We shouldnt have the 1 Live displayed at the top here in this case. I left this in case we need it again soon -->
          <!-- <h4 v-if="liveEventsPerSportGroupedByIDFOSport.length > 0" class="live-date" :class="{showlive: sportIndex !== 0}"><span class="live-badge">{{ filteredLiveEvents.length }}</span>LIVE</h4> -->
          <template v-if="isDebug">
            fosportinternalorder {{ fosport.fosportinternalorder }}
            isBig3Coupon {{ isBig3Coupon(fosport.events) }}
          </template>
          <template v-if="fosport.isLive === 'live'">
            <!-- LIVE -->
            <big3-markets-header :coupontitle="fosport.fosportname || marketgroup.marketgroupname"
                                 :idfosporttype="getIDFOSportType(fosport.events[0])"
                                 :is-big3-coupon="isBig3Coupon(fosport.events)"
                                 :has-draw="hasDraw(fosport.events)"
                                 :max-no-of-markets="maxNumberOfMarkets(fosport.events)"
                                 :max-no-of-selections="maxNumberOfSelections(fosport.events)"
                                 :isoutright="fosport.events && fosport.events[0] && fosport.events[0].markets && fosport.events[0].markets[0] && fosport.events[0].markets[0].isoutright"></big3-markets-header>
          </template>
          <template v-else>
            <big3-markets-header :coupontitle="marketgroup.idfwpopulationtype === 'NEXTOFFBYSPORTTYPEMKTTYPCLASSPER' ? fosport.fosportname :  marketgroup.marketgroupname"
                                 :idfosporttype="getIDFOSportType(fosport.events[0])"
                                 :is-big3-coupon="isBig3Coupon(fosport.events)"
                                 :has-draw="hasDraw(fosport.events)"
                                 :max-no-of-markets="maxNumberOfMarkets(fosport.events)"
                                 :max-no-of-selections="maxNumberOfSelections(fosport.events)"
                                 :isoutright="fosport.events && fosport.events[0] && fosport.events[0].markets && fosport.events[0].markets[0] && fosport.events[0].markets[0].isoutright"></big3-markets-header>
          </template>
          <div class="event" v-for="(event, eventIndex) in fosport.events" :class="{last: eventIndex === fosport.events.length - 1, first: eventIndex === 0}" :key="event.idfoevent">
            <div v-if="['GOLF', 'MOTORSPORT', 'NASCAR'].indexOf(fosport.events[0].markets[0].selections[0].idfosporttype) > -1" class="outright-golf outright-event-name">{{ event.eventname }}</div>
            <!-- When we need 'pre-match to live' to use same css for live page we can add sport here -->
            <div class="info-markets-container"
                 :class="{
                 tennis: fosport.fosportname === 'Tennis', soccer: fosport.fosportname === 'Soccer',
                 GOLF: fosport.events[0].markets[0].selections[0].idfosporttype === 'GOLF',
                 MOTORSPORT: fosport.events[0].markets[0].selections[0].idfosporttype === 'MOTORSPORT',
                 NASCAR: fosport.events[0].markets[0].selections[0].idfosporttype === 'NASCAR',
                 MMA: fosport.events[0].markets[0].selections[0].idfosporttype === 'MMA' }"
            >
              <live-event-info
                :event="liveEvents.find(liveEvent => liveEvent.idfoevent === event.idfoevent)"
                :page="'coupon'"
                :isbig3coupon="isBig3Coupon(fosport.events)"
                :twoselections="!isBig3Coupon(fosport.events) && !hasDraw(fosport.events)"
                :threeselections="!isBig3Coupon(fosport.events) && hasDraw(fosport.events)"
                :couponname="fosport.fosportname || marketgroup.marketgroupname">
              </live-event-info>
              <markets v-if="event.markets"
                       :markets="event.markets"
                       :event="event"
                       maxnumofmarkets="3"
                       :iscoupondisplay="true"
                       :pricechangehighlight="true"
                       :diplayOnPage="'prematch-event'"
                       :isbig3coupon="isBig3Coupon(fosport.events)"
                       :couponname="fosport.fosportname || marketgroup.marketgroupname"
                       class="markets"></markets>
              <div v-if="!event.markets" class="nomarkets">{{ $t('Sports.NoAvailableMarkets') }}</div>
              <div v-if="!mobileBigAndBelow && brandLayout !=='generic' && brandKey !== 'sb' && brandKey !== 'mav' && brandKey !== 'qcasino' && brandKey !== 'pr'" class="more-markets morebets" @click.stop="goToEvent(event)"><v-icon v-if="(brandKey !== 'dn' && brandKey !== 'dnw' && brandKey !== 'circa')">add</v-icon><v-icon v-if="(brandKey === 'dn' || brandKey === 'dnw' || brandKey === 'circa')">chevron_right</v-icon></div>
              <div v-if="(brandKey === 'dn' || brandKey === 'dnw' || brandKey === 'circa') && mobileBigAndBelow" class="more-markets morebets notInFooter" @click.stop="goToEvent(event)"><v-icon>chevron_right</v-icon></div>
            </div>
            <live-coupon-event-footer v-if="['GOLF', 'MOTORSPORT', 'NASCAR'].indexOf(event.markets[0].idfosporttype) === -1 ||
              (!event.markets || event.markets.length === 0) || (event.markets[0].selections && event.markets[0].selections.length <= 9)" :event="liveEvents.find(liveEvent => liveEvent.idfoevent === event.idfoevent)" :couponname="fosport.fosportname || marketgroup.marketgroupname"></live-coupon-event-footer>
          </div>
        </div>
        <template v-if="isDebug">
          eventsGrouping : {{ eventsGrouping }}
        </template>
        <!-- PREMATCH by COMPETITION -->
        <div v-if="eventsGrouping === 'EVENTSPERCOMPETITION'" v-for="(fosport, index) in eventsGroupedByCompetition" :key="index" class="date">
          <template v-if="isDebug">
            fosportinternalorder {{ fosport.fosportinternalorder }}
            isBig3Coupon {{ isBig3Coupon(fosport.events) }}
          </template>
          <div v-if="fosport.events[0].markets[0].isoutright">
            <v-expansion-panel :value="counter === 0 ? 0: 1" class='market-collapse'>
              <v-expansion-panel-content :id="['market-' + counter]">
                <div slot="header" class="panel-header" @click="togglePanel(counter)">
                  <div class="market-name" :class="[{'expanded-market': counter === 0}]">
                    <big3-markets-header :coupontitle="marketgroup.idfwpopulationtype === 'NEXTOFFBYSPORTTYPEMKTTYPCLASSPER' ? fosport.fosportname :  marketgroup.marketgroupname"
                                         :idfosporttype="getIDFOSportType(fosport.events[0])"
                                         :is-big3-coupon="isBig3Coupon(fosport.events)"
                                         :has-draw="hasDraw(fosport.events)"
                                         :max-no-of-markets="maxNumberOfMarkets(fosport.events)"
                                         :max-no-of-selections="maxNumberOfSelections(fosport.events)"
                                         :isoutright="true"></big3-markets-header>
                    <span class="flex icon-span">
                    <v-icon class="expand_more_icon" :id="['market-expand-' + counter]" :style="counter === 0 ? {display: 'none'} : {}">expand_more</v-icon>
                    <v-icon class="expand_less_icon" :id="['market-collapsed-' + counter]" :style="counter > 0 ? {display: 'none'} : {}">expand_less</v-icon>
                  </span>
                  </div>
                </div>
                <div :class="['event', {'last': $index === fosport.events.length - 1}, {'first': $index === 0}, {'big-three-one-selection-per-event': isBig3Coupon(fosport.events) && maxNumberOfMarkets(fosport.events) === 1}]" v-for="(event, $index) in fosport.events" :key="$index">
                  <coupon-event
                    :event="event"
                    :twoselections="!isBig3Coupon(fosport.events) && !hasDraw(fosport.events)"
                    :threeselections="!isBig3Coupon(fosport.events) && hasDraw(fosport.events)"
                    :isbig3coupon="isBig3Coupon(fosport.events)"
                    :couponname="marketgroup.idfwpopulationtype === 'NEXTOFFBYSPORTTYPEMKTTYPCLASSPER' ? fosport.fosportname :  marketgroup.marketgroupname"></coupon-event>
                </div>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </div>
          <div v-else>
            <big3-markets-header :coupontitle="marketgroup.idfwpopulationtype === 'NEXTOFFBYSPORTTYPEMKTTYPCLASSPER' ? fosport.fosportname :  marketgroup.marketgroupname"
                                 :idfosporttype="getIDFOSportType(fosport.events[0])"
                                 :is-big3-coupon="isBig3Coupon(fosport.events)"
                                 :has-draw="hasDraw(fosport.events)"
                                 :max-no-of-markets="maxNumberOfMarkets(fosport.events)"
                                 :max-no-of-selections="maxNumberOfSelections(fosport.events)"
                                 :isoutright="false"></big3-markets-header>
            <div :class="['event', {'last': $index === fosport.events.length - 1}, {'first': $index === 0}, {'big-three-one-selection-per-event': isBig3Coupon(fosport.events) && maxNumberOfMarkets(fosport.events) === 1}]" v-for="(event, $index) in fosport.events" :key="$index">
              <coupon-event
                :event="event"
                :twoselections="!isBig3Coupon(fosport.events) && !hasDraw(fosport.events)"
                :threeselections="!isBig3Coupon(fosport.events) && hasDraw(fosport.events)"
                :isbig3coupon="isBig3Coupon(fosport.events)"
                :couponname="marketgroup.idfwpopulationtype === 'NEXTOFFBYSPORTTYPEMKTTYPCLASSPER' ? fosport.fosportname :  marketgroup.marketgroupname"></coupon-event>
            </div>
          </div>
        </div>
        <!-- PREMATCH by DATEANDCOMPETITION -->
        <div v-if="eventsGrouping === 'EVENTSPERDAY'" v-for="(dateEvents, date, iterator) in eventsGroupedByDateAndCompetition" class="date" :key="iterator">
            <h4 class="eventsperday_header" v-if="isDateToday(date)">TODAY</h4>
            <h4 class="eventsperday_header" v-if="isDateTomorrow(date)">TOMORROW</h4>
            <h4 class="eventsperday_header" v-if="!isDateToday(date) && !isDateTomorrow(date)">{{ date | moment(dateFormats.shortDateMG) }} </h4>
          <!-- and by COMPETITIONS -->
          <div v-for="(fosport, index) in dateEvents" class="date-events" :key="index">
            <template v-if="isDebug">
              fosportinternalorder {{ fosport.fosportinternalorder }}
              isBig3Coupon {{ isBig3Coupon(fosport.events) }}
            </template>
            <!--XXcompetitionEvents: {{ competitionEvents[0] }}-->
            <div v-if="!fosport.events[0].markets[0].isoutright">
              <!--<template v-if="marketgroup.marketgroupname === 'Upcoming Matches'">-->
              <big3-markets-header :coupontitle="marketgroup.marketgroupname"
                                   :idfosporttype="getIDFOSportType(fosport.events[0])"
                                   :is-big3-coupon="isBig3Coupon(fosport.events)"
                                   :has-draw="hasDraw(fosport.events)"
                                   :max-no-of-markets="maxNumberOfMarkets(fosport.events)"
                                   :max-no-of-selections="maxNumberOfSelections(fosport.events)"
                                   :isoutright="false"></big3-markets-header>
              <!--</template>-->
              <!--<template v-else>-->
              <!--<big3-markets-header :coupontitle="marketgroup.marketgroupname"-->
              <!--:idfosporttype="getIDFOSportType(fosport.events[0])"-->
              <!--:is-big3-coupon="isBig3Coupon(fosport.events)"-->
              <!--:has-draw="hasDraw(fosport.events)"-->
              <!--:max-no-of-markets="maxNumberOfMarkets(fosport.events)"-->
              <!--:max-no-of-selections="maxNumberOfSelections(fosport.events)"></big3-markets-header>-->
              <!--</template>-->
              <div :class="['event', {'last': $index === fosport.events.length - 1}, {'first': $index === 0}, {'big-three-one-selection-per-event': isBig3Coupon(fosport.events) && maxNumberOfMarkets(fosport.events) === 1}]"
                   v-for="(event, $index) in fosport.events" :key="$index">
                <coupon-event
                  :event="event"
                  :twoselections="!isBig3Coupon(fosport.events) && !hasDraw(fosport.events)"
                  :threeselections="!isBig3Coupon(fosport.events) && hasDraw(fosport.events)"
                  :isbig3coupon="isBig3Coupon(fosport.events)"
                  :couponname="marketgroup.marketgroupname"></coupon-event>
              </div>
            </div>
            <div v-if="fosport.events[0].markets[0].isoutright">
              <v-expansion-panel :value="iterator === 0 ? 0 : 1" class='market-collapse'>
                <v-expansion-panel-content :id="['market-' + iterator]">
                  <div slot="header" class="panel-header" @click="togglePanel(iterator)">
                    <div class="market-name" :class="[{'expanded-market': iterator === 0}]">
                      <big3-markets-header :coupontitle="marketgroup.marketgroupname"
                                           :idfosporttype="getIDFOSportType(fosport.events[0])"
                                           :is-big3-coupon="isBig3Coupon(fosport.events)"
                                           :has-draw="hasDraw(fosport.events)"
                                           :max-no-of-markets="maxNumberOfMarkets(fosport.events)"
                                           :max-no-of-selections="maxNumberOfSelections(fosport.events)"
                                           :isoutright="true"></big3-markets-header>
                      <span class="flex icon-span">
                    <v-icon class="expand_more_icon" :id="['market-expand-' + iterator]" :style="iterator === 0 ? {display: 'none'} : {}">expand_more</v-icon>
                    <v-icon class="expand_less_icon" :id="['market-collapsed-' + iterator]" :style="iterator > 0 ? {display: 'none'} : {}">expand_less</v-icon>
                  </span>
                    </div>
                  </div>
                  <div :class="['event', {'last': $index === fosport.events.length - 1}, {'first': $index === 0}, {'big-three-one-selection-per-event': isBig3Coupon(fosport.events) && maxNumberOfMarkets(fosport.events) === 1}]"
                       v-for="(event, $index) in fosport.events" :key="$index">
                    <coupon-event
                      :event="event"
                      :twoselections="!isBig3Coupon(fosport.events) && !hasDraw(fosport.events)"
                      :threeselections="!isBig3Coupon(fosport.events) && hasDraw(fosport.events)"
                      :isbig3coupon="isBig3Coupon(fosport.events)"
                      :couponname="marketgroup.marketgroupname"></coupon-event>
                  </div>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </div>
          </div>
        </div>
      </div>
      <!-- NONGROUPEDEVENTS -->
      <div v-if="eventsGrouping === 'NONGROUPEDEVENTS' && (filteredPrematchEvents || filteredLiveEvents.length > 0)" class="coupon non-grouped" v-show="isExpanded">
        <!-- LIVE EVENTS -->
        <h4 v-if="filteredLiveEvents.length > 0" class="live-date"><span>{{ filteredLiveEvents.length }}</span> LIVE</h4>
        <div class="live-events" v-if="filteredLiveEvents.length > 0" v-show="isExpanded">
          <div class="event" v-for="(event, index) in filteredLiveEvents" :key="index">
            <live-event-info
              :event="liveEvents.find(liveEvent => liveEvent.idfoevent === event.idfoevent)"
              :page="'coupon'"
              :couponname="marketgroup.marketgroupname"></live-event-info>
            <markets v-if="event.markets"
                     :markets="event.markets"
                     :event="event"
                     maxnumofmarkets="3"
                     :iscoupondisplay="true"
                     :pricechangehighlight="true"
                     :diplayOnPage="'marketGroup'"
                     :couponname="marketgroup.marketgroupname"></markets>
            <div v-if="!event.markets" class="nomarkets">{{ $t('Sports.NoAvailableMarkets') }}</div>
          </div>
        </div>
        <div v-if="filteredPrematchEvents[0] && filteredPrematchEvents[0].markets[0].isoutright">
          <v-expansion-panel :value="counter === 0 ? 0: 1" class='market-collapse'>
            <v-expansion-panel-content :id="['market-' + counter]">
              <div slot="header" class="panel-header" @click="togglePanel(counter)">
                <div class="market-name" :class="[{'expanded-market': counter === 0}]">
                  <big3-markets-header :coupontitle="marketgroup.idfwpopulationtype === 'NEXTOFFBYSPORTTYPEMKTTYPCLASSPER' ? fosport.fosportname :  marketgroup.marketgroupname"
                                       :idfosporttype="getIDFOSportType(filteredPrematchEvents[0])"
                                       :is-big3-coupon="isBig3Coupon(filteredPrematchEvents)"
                                       :has-draw="hasDraw(filteredPrematchEvents)"
                                       :max-no-of-markets="maxNumberOfMarkets(filteredPrematchEvents)"
                                       :max-no-of-selections="maxNumberOfSelections(filteredPrematchEvents)"
                                       :isoutright="true"></big3-markets-header>
                  <span class="flex icon-span">
                    <v-icon class="expand_more_icon" :id="['market-expand-' + counter]" :style="counter === 0 ? {display: 'none'} : {}">expand_less</v-icon>
                    <v-icon class="expand_less_icon" :id="['market-collapsed-' + counter]" :style="counter > 0 ? {display: 'none'} : {}">expand_more</v-icon>
                  </span>
                </div>
              </div>
              <div :class="['event', {'last': $index === filteredPrematchEvents.length - 1}, {'first': $index === 0}, {'big-three-one-selection-per-event': isBig3Coupon(filteredPrematchEvents) && maxNumberOfMarkets(filteredPrematchEvents) === 1}]" v-for="(event, $index) in filteredPrematchEvents" :key="$index">
                <coupon-event
                  :event="event"
                  :twoselections="!isBig3Coupon(filteredPrematchEvents) && !hasDraw(filteredPrematchEvents)"
                  :threeselections="!isBig3Coupon(filteredPrematchEvents) && hasDraw(filteredPrematchEvents)"
                  :isbig3coupon="isBig3Coupon(filteredPrematchEvents)"
                  :couponname="marketgroup.idfwpopulationtype === 'NEXTOFFBYSPORTTYPEMKTTYPCLASSPER' ? fosport.fosportname :  marketgroup.marketgroupname"></coupon-event>
              </div>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </div>
        <div v-else>
          <big3-markets-header :coupontitle="marketgroup.marketgroupname"
                               :idfosporttype="getIDFOSportType(filteredPrematchEvents[0])"
                               :is-big3-coupon="isBig3Coupon(filteredPrematchEvents)"
                               :has-draw="hasDraw(filteredPrematchEvents)"
                               :max-no-of-markets="maxNumberOfMarkets(filteredPrematchEvents)"
                               :max-no-of-selections="maxNumberOfSelections(filteredPrematchEvents)"
                               :isoutright="false"></big3-markets-header>
          <div :class="['event', {'last': $index === filteredPrematchEvents.length - 1}, {'first': $index === 0}, {'big-three-one-selection-per-event': isBig3Coupon(filteredPrematchEvents) && maxNumberOfMarkets(filteredPrematchEvents) === 1}]" v-for="(event, $index) in filteredPrematchEvents" :key="$index">
            <coupon-event
              :event="event"
              :twoselections="!isBig3Coupon(filteredPrematchEvents) && !hasDraw(filteredPrematchEvents)"
              :threeselections="!isBig3Coupon(filteredPrematchEvents) && hasDraw(filteredPrematchEvents)"
              :isbig3coupon="isBig3Coupon(filteredPrematchEvents)"
              :couponname="marketgroup.marketgroupname"></coupon-event>
          </div>
        </div>
      </div>
    </div>
  </div>

</template>
<script>
  import Vue from 'vue'
  import store from '@/store'
  import config from '@/config'
  import couponEvent from '@/components/sports/bettingoffer/couponEvent'
  import LiveEventInfo from '@/components/sports/bettingoffer/live/liveEventInfo'
  import markets from '@/components/sports/bettingoffer/markets'
  import big3MarketsHeader from '@/components/sports/bettingoffer/big3MarketsHeader'
  import LiveCouponEventFooter from '@/components/sports/bettingoffer/live/liveCouponEventFooter'
  import BettingOffer from '@/components/mixins/BettingOffer'
  import Gtm from '@/components/mixins/Gtm'
  import Icon from '@/components/common/Icon'
  import Branding from '@/components/mixins/Branding'

  export default {
    name: 'MarketGroup',

    props: [
      'isheadlinecoupon',
      'idfwmarketgroup',
      'eventsGrouping',
      'selectedSports',
      'maxevents',
      'allSportsActive',
      'showMarketgroupName',
      'counter',
      'hideliveevents',
      'headline'
    ],

    components: {
      couponEvent,
      LiveEventInfo,
      markets,
      big3MarketsHeader,
      LiveCouponEventFooter,
      Icon
    },

    mixins: [
      BettingOffer,
      Branding,
      Gtm
    ],

    data () {
      return {
        isExpanded: true,
        periodicalUpdateTimeout: undefined,
        periodicalUpdateInterval: config.app.udpateIntervals.marketGroupPeriodicalUpdateInterval,
        isPeriodicalUpdateStarted: false,
        readonly: false,
        iterator: null
      }
    },

    computed: {
      headlineCouponMarketName () {
        if (this.isBig3Coupon([this.headlineCouponEvent])) return ''

        return this.headlineCouponEvent.markets && this.headlineCouponEvent.markets.length && this.headlineCouponEvent.markets[0].name
      },
      headlineCouponMarketValid () {
        if (this.headlineCouponEvent.markets && this.headlineCouponEvent.markets.length) {
          return this.headlineCouponEvent.markets[0].selections && this.headlineCouponEvent.markets[0].selections.length <= 3
        }

        return false
      },
      headlineCouponMoreThan3Selections () {
        if (this.headlineCouponEvent.markets && this.headlineCouponEvent.markets.length) {
          return this.headlineCouponEvent.markets[0].selections && this.headlineCouponEvent.markets[0].selections.length > 3
        }

        return false
      },
      headlineCouponSport () {
        if (this.isheadlinecoupon) {
          return this.headlineCouponEvent.idfosporttype
        }

        return ''
      },
      headlineCouponHeading () {
        if (this.isheadlinecoupon) {
          return this.headlineCouponEvent.sportname
        }

        return ''
      },
      headlineCouponTime () {
        if (this.isheadlinecoupon) {
          return this.headlineCouponEvent.tsstart
        }

        return ''
      },
      headlineCouponEvent () {
        if (!this.isheadlinecoupon) return {}
        if (this.filteredLiveEvents.length) return this.filteredLiveEvents[0]
        if (this.filteredPrematchEvents.length) return this.filteredPrematchEvents[0]

        return {}
      },
      marketgroup () {
        var marketgroups = store.getters['marketgroupState/marketgroups']

        if (marketgroups) {
          let marketgroup = marketgroups[this.idfwmarketgroup]
          if (marketgroup) {
            return marketgroups[this.idfwmarketgroup]
          } else {
            return undefined
          }
        } else {
          return undefined
        }
      },
      marketgroupEvents () {
        return (this.marketgroup && this.marketgroup.events &&
          this.marketgroup.events.filter(ev => !this.selectedSports || this.selectedSports.length === 0 || this.selectedSports.indexOf(ev.markets[0].idfosporttype) > -1)) || []
      },
      filteredLiveEvents () {
        var liveIDFOEvents = this.liveEvents.map(event => event.idfoevent)
        var liveFOEventAntepost = this.liveEvents.filter(ev => ev.foeventantepost).map(event => event.foeventantepost)

        var liveEvents = this.marketgroupEvents.filter(ev => liveIDFOEvents.indexOf(ev.idfoevent) > -1 || liveFOEventAntepost.indexOf(ev.idfoevent) > -1)

        if (liveEvents && liveEvents.length > 0) {
          if (this.isheadlinecoupon) {
            // In case of showing coupon in headline show only the first event from marketgroup
            return this.marketgroupEvents[0].idfoevent === liveEvents[0].idfoevent ? [this.marketgroupEvents[0]] : []
          }
          if (this.maxevents && this.maxevents > 0) {
            return liveEvents.slice(0, this.maxevents)
          } else {
            return liveEvents
          }
        } else {
          return []
        }
      },
      filteredPrematchEvents () {
        var liveEventsIds = this.liveEvents.map(ev => ev.idfoevent)
        var liveFOEventAntepost = this.liveEvents.filter(ev => ev.foeventantepost).map(event => event.foeventantepost)
        var prematchEvents = this.marketgroupEvents.filter(ev => liveEventsIds.indexOf(ev.idfoevent) === -1 && liveFOEventAntepost.indexOf(ev.idfoevent) === -1)

        if (prematchEvents && prematchEvents.length > 0) {
          if (this.isheadlinecoupon) {
            return this.marketgroupEvents[0].idfoevent === prematchEvents[0].idfoevent ? [this.marketgroupEvents[0]] : []
          }
          if (this.maxevents && this.maxevents > 0) {
            return prematchEvents.slice(0, this.maxevents)
          } else {
            return prematchEvents
          }
        } else {
          return []
        }
      },
      teasersPriceTypes () {
        return store.getters['sbBetslipState/teasersPriceTypes']
      },
      filteredMarkets () {
        if (this.marketgroup && this.marketgroup.markets && this.marketgroup.markets.length > 0) {
          let markets = this.marketgroup.markets.filter((market) => {
            let csvpricetypes = (market.csvpricetypes && market.csvpricetypes.split(',')) || []
            let isNotIncludedInPT = (t) => csvpricetypes.indexOf(t) === -1
            return this.teasersPriceTypes.every(isNotIncludedInPT)

//            return (csvpricetypes.indexOf('T1') === -1 &&
//              csvpricetypes.indexOf('T2') === -1 &&
//              csvpricetypes.indexOf('T3') === -1)
          })

          if (this.maxevents && this.maxevents > 0) {
            return markets.slice(0, this.maxevents)
          } else {
            return markets
          }
        } else {
          return []
        }
      },

      eventsGroupedByCompetition () {
        if (this.eventsGrouping === 'EVENTSPERCOMPETITION' && this.filteredPrematchEvents && this.filteredPrematchEvents.length > 0) {
          var foSports = []
          this.filteredPrematchEvents.forEach(ev => {
            if (foSports.filter(sport => sport.idfosport === ev.idfosport).length === 0) {
              foSports.push({
                idfosport: ev.idfosport,
                fosportname: ev.sportname,
                fosportinternalorder: ev.markets[0].fosportinternalorder,
                events: Vue._.orderBy(this.filteredPrematchEvents.filter(ev1 => ev1.idfosport === ev.idfosport), ['internalorder', 'tsstart', 'participantname_away'])
              })
            }
          })

          return Vue._.orderBy(foSports, 'fosportinternalorder')
        } else {
          return []
        }
      },
      eventsGroupedByDateAndCompetition () {
        if (this.eventsGrouping === 'EVENTSPERDAY' && this.filteredPrematchEvents && this.filteredPrematchEvents.length > 0) {
          let orderedEvents = Vue._.orderBy(this.filteredPrematchEvents, 'tsdate')
          var dates = Vue._.groupBy(orderedEvents, 'tsdate')
          for (let date in dates) {
            var foSports = []
            dates[date].forEach(ev => {
              if (foSports.filter(sport => sport.idfosport === ev.idfosport).length === 0) {
                foSports.push({
                  idfosport: ev.idfosport,
                  fosportname: ev.sportname,
                  fosportinternalorder: ev.markets[0].fosportinternalorder,
                  events: Vue._.orderBy(dates[date].filter(ev1 => ev1.idfosport === ev.idfosport), ['internalorder', 'tsstart', 'participantname_away'])
                })
              }
            })

            dates[date] = Vue._.orderBy(foSports, 'fosportinternalorder')
          }
          return dates
        } else {
          return []
        }
      },
      liveEventsPerSportGroupedByIDFOSport () {
        if ((this.eventsGrouping === 'EVENTSPERCOMPETITION' || this.eventsGrouping === 'EVENTSPERDAY') && this.filteredLiveEvents && this.filteredLiveEvents.length > 0) {
          var competitions = []

          this.filteredLiveEvents.forEach((event) => {
            if (competitions.filter(cmp => cmp.idfosport === event.idfosport).length === 0) {
              let liveEvent = this.liveEvents.find(ev => ev.idfoevent === event.idfoevent || ev.foeventantepot === event.idfoevent)

              competitions.push({
                idfosport: liveEvent.idfosport || event.idfosport,
                isLive: 'live',
                fosportname: liveEvent.fosportname || event.sportname,
                fosportinternalorder: liveEvent.fosportinternalorder || 0,
                events: Vue._.orderBy(this.filteredLiveEvents.filter(ev => ev.idfosport === (liveEvent.idfosport || event.idfosport)), ['foeventinternalorder', 'awayteamname'])
              })
            }
          })

          return Vue._.orderBy(competitions, 'fosportinternalorder', 'asc')
        } else {
          return []
        }
      }
    },

    methods: {
      startMarketgroupByIdUpdate (idfwmarketgroup) {
        this.isPeriodicalUpdateStarted = true

        store.dispatch('marketgroupState/fetchMarketgroupById', idfwmarketgroup).then(() => {
          clearTimeout(this.periodicalUpdateTimeout)
          this.periodicalUpdateTimeout = setTimeout(() => {
            if (this.isPeriodicalUpdateStarted) {
              this.startMarketgroupByIdUpdate(idfwmarketgroup)
            }
          }, this.periodicalUpdateInterval)
        })
      },
      stopMarketgroupByIdUpdate () {
        this.isPeriodicalUpdateStarted = false
        clearTimeout(this.periodicalUpdateTimeout)
      },
      toggleCollapse () {
        this.isExpanded = !this.isExpanded
      },
      hasDraw (arrayOfEvents) {
        let hasDraw = false
        // Do not draw HOME/TIE/AWAY in big3-market-header for Golf
        if (['GOLF', 'MOTORSPORT', 'NASCAR'].indexOf(arrayOfEvents[0] && arrayOfEvents[0].markets[0].idfosporttype) > -1) {
          return false
        }
        if (arrayOfEvents) {
          arrayOfEvents.forEach(event => {
            if (event.markets && event.markets.filter(market => market.selections && market.selections.filter(sel => sel.hadvalue === 'D').length > 0).length > 0) {
              hasDraw = true
            }
          })
        }

        return hasDraw
      },
      maxNumberOfSelections (arrayOfEvents) {
        let noOfSelections = 0
        if (arrayOfEvents) {
          arrayOfEvents.forEach(event => {
            if (event.markets) {
              event.markets.forEach(market => {
                if (market.selections && market.selections.length) {
                  if (market.selections.length > noOfSelections) {
                    noOfSelections = market.selections.length
                  }
                }
              })
            }
          })
        }
        return noOfSelections
      },
      maxNumberOfMarkets (arrayOfEvents) {
        let noOfMarkets = 0
        if (arrayOfEvents) {
          arrayOfEvents.forEach(event => {
            if (event.markets && event.markets.length) {
              if (event.markets.length > noOfMarkets) {
                noOfMarkets = event.markets.length
              }
            }
          })
        }
        return noOfMarkets
      },
      getIDFOSportType (event) {
        return (event && event.markets && event.markets[0] && event.markets[0].idfosporttype) || undefined
      },

      isBig3Coupon (events) {
        var nonBig3Markets = []

        events.forEach(ev => {
          if (ev.markets && ev.markets.length > 0) {
            ev.markets.forEach(mk => {
              if (!mk.big3markettype || (mk.selections && mk.selections.length > 2) || config.app.autoconf.BIG3_IGNORE_SPORTTYPES.includes(mk.idfosporttype)) {
                nonBig3Markets.push(mk)
              }
            })
          }
        })

        return nonBig3Markets.length === 0
      },
      togglePanel (id) {
        let element = document.querySelector("[id='market-" + id + "']")
        if (!element.classList.contains('v-expansion-panel__container--active')) {
          if (id === 0) {
            element.querySelector('.market-name').classList.add('expanded-market')
            document.querySelector("[id='market-collapsed-" + id + "']").setAttribute('style', 'display:normal')
            document.querySelector("[id='market-expand-" + id + "']").setAttribute('style', 'display:none')
          } else {
            element.querySelector('.market-name').classList.add('expanded-market')
            document.querySelector("[id='market-collapsed-" + id + "']").setAttribute('style', 'display:normal')
            document.querySelector("[id='market-expand-" + id + "']").setAttribute('style', 'display:none')
          }
        } else {
          if (id === 0) {
            element.querySelector('.market-name').classList.remove('expanded-market')
            document.querySelector("[id='market-collapsed-" + id + "']").setAttribute('style', 'display:none')
            document.querySelector("[id='market-expand-" + id + "']").setAttribute('style', 'display:normal')
          } else {
            element.querySelector('.market-name').classList.remove('expanded-market')
            document.querySelector("[id='market-collapsed-" + id + "']").setAttribute('style', 'display:none')
            document.querySelector("[id='market-expand-" + id + "']").setAttribute('style', 'display:normal')
          }
        }
      }
    },

    created () {
      this.startMarketgroupByIdUpdate(this.idfwmarketgroup)
    },

    destroyed () {
      this.stopMarketgroupByIdUpdate()
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped>
  @import "../../../css/config.styl"

  .marketgroup
    margin 5px 0 0 0
    border-radius 5px
    .name
      padding: 10px 15px
      margin: 0
    .coupon
      margin-bottom 0
      .date
        h4
          margin-bottom 0
          font-size: 16px
          // background #e5e8ed
          color #21335a
          font-weight bold
          user-select none
          // padding: 10px 15px
          padding 10px 15px 5px 15px
        .event:not(:first-child)
          border-top: 1px solid #DCDFE9
        .event
          background white
          &.last
            border-bottom: 1px solid #DCDFE9

        &.live
          .live-badge
            background-color #e24447
            color white
            width 20px
            display inline-block
            height 20px
            border-radius 50%
            text-align center
            font-size 12.5px
            font-weight 600
            position: relative
            top -1px
            line-height 20px
            margin-right 2px
      .date:first-child
        h4
          padding-top 0
  .market-collapse.v-expansion-panel
    -webkit-box-shadow: none
    -moz-box-shadow: none
    box-shadow: none
  .v-expansion-panel__container
    .v-expansion-panel__body
      border-radius 0px
    >>>.v-expansion-panel__header
      padding: 0
      .hheader
        border: 0px
        .head:hover
          cursor pointer
      .market-name
        display flex
        padding: 0
      .market-name-title
        margin: 0
      .icon-span
        text-align: right
        padding: 10px 15px 10px 0
        max-width: 30px
        .v-icon
          color #fff
      .market-name:hover
        cursor pointer
      .header__icon
        display: none
      .v-expansion-panel__header__icon
        display: none

  .showlive
    display none

.marketgroups
  .marketgroup:first-child
    .date
      h4
        padding-top 5px
        background #f2f2f2

.coupon
  >>>.v-expansion-panel__header
    background #0b4da1
.panel-header
  width 100%
  >>>.coupontitle
    white-space: nowrap
    overflow: hidden
    text-overflow: ellipsis
    max-width: 100%
    vertical-align: middle
  >>>.market-name .hheader 
    width calc(100% - 40px)
    margin-right 10px
  >>>.marketgroup .hheader .head h4
    width 100%
</style>
