<template>
  <div :class="{'live-single-event':(diplayOnPage == 'live-single-event' ), 'coupon': (diplayOnPage == 'coupon')}" class="markets-wrapper">
    <div class="markets" v-if="markets" :class="[
                                  { 'multiple': markets.length > 1 && maxNumOfMarkets > 1 },
                                  { 'single': markets.length === 1 || maxNumOfMarkets === 1 },
                                  { 'empty': markets.length === 0 || maxNumOfMarkets === 0 }]">
      <big3-markets-header v-if="isBig3Coupon && diplayOnPage == 'live-single-event'"
                           :coupontitle="markets && markets[0] && markets[0].gameperiodname"
                           :markets="[pointsMarket,moneyMarket,totalMarket]"
                           :diplayOnPage="diplayOnPage"
                           :isLiveEventPage="isLiveEventPage"
                           :idfosporttype1="this.event.idfosporttype"
                           :is-big3-coupon="true"
                           :marketNameForHeaderForEventMarketGroupWithOneMarket="marketNameForHeaderForEventMarketGroupWithOneMarket"
                           :max-no-of-markets="markets && markets.length"
                           :isoutright="false"
                           :isPointsMarketAvailableForBB="isPointsMarketAvailableForBB"
                           :isMoneyMarketAvailableForBB="isMoneyMarketAvailableForBB"
                           :isTotalMarketAvailableForBB="isTotalMarketAvailableForBB"
                           :isNonBig3MarketAvailableForBB="isNonBig3MarketAvailableForBB"></big3-markets-header>
      <template v-if="isDebug">
        MARKETS <br />
        isBig3Coupon {{ isBig3Coupon }}
      </template>
      <!-- BIG3 -->
      <div v-if="isBig3Coupon" class="big3">
        <div :class="['market name', {'has-pitchers': event.awaypitchername || event.awaypitchername }, {'team-logos': teamLogoVisibility}]" v-if="currentPath == 'SportsEvent'">
          <div class="layout">
            <span v-if="luListcode4ParticipantMake(event, 'AWAY') !== ''" class="listcode">{{ luListcode4ParticipantMake(event, 'AWAY') }}</span>
            <div class="event-info-name-wrapper">
              <span v-if="teamLogoVisibility" class="team-logo" :style="awayTeamLogoStyle"></span>
              <span v-if="teamLogoVisibility && mobileBigAndBelow" class="name">{{ event.shortnameaway || event.participantname_away}}</span>
              <span v-else class="name">{{ event.participantname_away || event.participantshortname_away }}</span>
            </div>
            <span v-if="isPitcherVisible" class="smaller"><span class="cell"></span><span class="cell">{{ event.awaypitchername | lowercase }}</span></span>
          </div>
          <div class="layout">
            <span v-if="luListcode4ParticipantMake(event, 'HOME') !== ''" class="listcode">{{ luListcode4ParticipantMake(event, 'HOME') }}</span>
            <div class="event-info-name-wrapper">
              <span v-if="teamLogoVisibility" class="team-logo" :style="homeTeamLogoStyle"></span>
              <span v-if="teamLogoVisibility && mobileBigAndBelow" class="name">{{ event.shortnamehome || event.participantname_home}}</span>
              <span v-else class="name">{{ event.participantname_home || event.participantshortname_home }}</span>
            </div>
            <span v-if="isPitcherVisible" class="smaller"><span class="cell"></span><span class="cell">{{ event.homepitchername | lowercase }}</span></span>
          </div>
        </div>

        <div class="markets" :class="{'big3-column-order': big3ColumOrderEnabled}">
          <div class="market points" :class="[big3PointsSpreadOrder]">
            <div class="selections layout" v-if="pointsMarket" :idfomarket="pointsMarket.idfomarket.toString()" :isfrompush="(pointsMarket.V !== undefined).toString()">
              <span v-if="isDebug">
                MARKET <br />
                idfomarket {{ pointsMarket.idfomarket }}<br />
                isfrompush {{ (pointsMarket.V !== undefined).toString() }}</span>
              <v-layout column wrap>
                <v-flex>
                  <span v-if="pointsMarket.selections.filter(sel => sel.hadvalue === 'A')[0]"
                      :class="['selection', 'flex', {'active': betslipSelections[pointsMarket.selections.filter(sel => sel.hadvalue === 'A')[0].idfoselection]}]"
                        @click.stop="toggleSelection(pointsMarket.selections.filter(sel => sel.hadvalue === 'A')[0], pointsMarket)">

                    <selection :selection="pointsMarket.selections.filter(sel => sel.hadvalue === 'A')[0]"
                              :istradable="pointsMarket.istradable"
                              :showselectionname="false"
                              :pricechangehighlight="pricechangehighlight"></selection>
                  </span>
                  <span v-if="!pointsMarket.selections.filter(sel => sel.hadvalue === 'A')[0]">
                    <div class="missingMarketsHolder"></div>
                  </span>
                </v-flex>
                <v-flex>
                  <span v-if="pointsMarket.selections.filter(sel => sel.hadvalue === 'H')[0]"
                      :class="['selection', 'flex', {'active': betslipSelections[pointsMarket.selections.filter(sel => sel.hadvalue === 'H')[0].idfoselection]}]"
                        @click.stop="toggleSelection(pointsMarket.selections.filter(sel => sel.hadvalue === 'H')[0], pointsMarket)">

                    <selection :selection="pointsMarket.selections.filter(sel => sel.hadvalue === 'H')[0]"
                              :istradable="pointsMarket.istradable"
                              :showselectionname="false"
                              :pricechangehighlight="pricechangehighlight"></selection>
                  </span>
                  <span v-if="!pointsMarket.selections.filter(sel => sel.hadvalue === 'H')[0]">
                    <div class="missingMarketsHolder"></div>
                  </span>
                </v-flex>
              </v-layout>
            </div>
            <div class="selections layout" v-else idfomarket="null">
              <v-layout column wrap>
                <v-flex>
                  <span :class="['selection', 'flex']">
                    <selection :selection="{}"
                               :istradable="true"
                               :showselectionname="false"></selection>
                  </span>
                </v-flex>
                <v-flex>
                  <span :class="['selection', 'flex']">

                    <selection :selection="{}"
                               :istradable="true"
                               :showselectionname="false"></selection>
                  </span>
                </v-flex>
              </v-layout>
            </div>
            <!--<div v-else class="empty"></div>-->
          </div>

          <div class="market money" :class="[big3MoneyLineOrder]">
            <div class="selections layout" v-if="moneyMarket" :idfomarket="moneyMarket.idfomarket.toString()" :isfrompush="(moneyMarket.V !== undefined).toString()">
              <span v-if="isDebug">
                MARKET <br />
                idfomarket {{ moneyMarket.idfomarket }}<br />
                isfrompush {{ (moneyMarket.V !== undefined).toString() }}</span>
              <v-layout column wrap>
                <v-flex>
                  <span v-if="moneyMarket.selections.filter(sel => sel.hadvalue === 'A')[0]"
                      :class="['selection', 'flex', {'active': betslipSelections[moneyMarket.selections.filter(sel => sel.hadvalue === 'A')[0].idfoselection]}]"
                        @click.stop="toggleSelection(moneyMarket.selections.filter(sel => sel.hadvalue === 'A')[0], moneyMarket)">
                    <selection :selection="moneyMarket.selections.filter(sel => sel.hadvalue === 'A')[0]"
                              :istradable="moneyMarket.istradable"
                              :showselectionname="false"
                              :pricechangehighlight="pricechangehighlight"></selection>
                  </span>
                  <span v-if="!moneyMarket.selections.filter(sel => sel.hadvalue === 'A')[0]">
                      <div class="missingMarketsHolder"></div>
                  </span>
                </v-flex>
                <v-flex>
                  <span v-if="moneyMarket.selections.filter(sel => sel.hadvalue === 'H')[0]"
                      :class="['selection', 'flex', {'active': betslipSelections[moneyMarket.selections.filter(sel => sel.hadvalue === 'H')[0].idfoselection]}]"
                        @click.stop="toggleSelection(moneyMarket.selections.filter(sel => sel.hadvalue === 'H')[0], moneyMarket)">

                    <selection :selection="moneyMarket.selections.filter(sel => sel.hadvalue === 'H')[0]"
                              :istradable="moneyMarket.istradable"
                              :showselectionname="false"
                              :pricechangehighlight="pricechangehighlight"></selection>
                  </span>
                  <span v-if="!moneyMarket.selections.filter(sel => sel.hadvalue === 'H')[0]">
                      <div class="missingMarketsHolder"></div>
                  </span>
                </v-flex>
              </v-layout>
            </div>
            <div class="selections layout" v-else idfomarket="null">
              <v-layout column wrap>
                <v-flex>
                  <span :class="['selection', 'flex']">
                    <selection :selection="{}"
                               :istradable="true"
                               :showselectionname="false"></selection>
                  </span>
                </v-flex>
                <v-flex>
                  <span :class="['selection', 'flex']">

                    <selection :selection="{}"
                               :istradable="true"
                               :showselectionname="false"></selection>
                  </span>
                </v-flex>
              </v-layout>
            </div>
            <!--<div v-else class="empty"></div>-->
          </div>

          <div class="market total" :class="[big3TotalPointsOrder]">
            <div class="selections layout" v-if="totalMarket" :idfomarket="totalMarket.idfomarket.toString()" :isfrompush="(totalMarket.V !== undefined).toString()">
              <span v-if="isDebug">
                MARKET <br />
                idfomarket {{ totalMarket.idfomarket }}<br />
                isfrompush {{ (totalMarket.V !== undefined).toString() }}</span>
              <v-layout column wrap>
                <v-flex>
                  <span v-if="totalMarket.selections.filter(sel => sel.hadvalue === 'O')[0]"
                        :class="['selection', 'flex', {'active': betslipSelections[totalMarket.selections.filter(sel => sel.hadvalue === 'O')[0].idfoselection]}]"
                        @click.stop="toggleSelection(totalMarket.selections.filter(sel => sel.hadvalue === 'O')[0], totalMarket)">

                    <selection :selection="totalMarket.selections.filter(sel => sel.hadvalue === 'O')[0]"
                              :istradable="totalMarket.istradable"
                              :showselectionname="false"
                              :pricechangehighlight="pricechangehighlight"></selection>
                  </span>
                  <span v-if="!totalMarket.selections.filter(sel => sel.hadvalue === 'O')[0]">
                    <div class="missingMarketsHolder"></div>
                  </span>
                </v-flex>
                <v-flex>
                  <span v-if="totalMarket.selections.filter(sel => sel.hadvalue === 'U')[0]"
                        :class="['selection', 'flex', {'active': betslipSelections[totalMarket.selections.filter(sel => sel.hadvalue === 'U')[0].idfoselection]}]"
                        @click.stop="toggleSelection(totalMarket.selections.filter(sel => sel.hadvalue === 'U')[0], totalMarket)">

                    <selection :selection="totalMarket.selections.filter(sel => sel.hadvalue === 'U')[0]"
                              :istradable="totalMarket.istradable"
                              :showselectionname="false"
                              :pricechangehighlight="pricechangehighlight"></selection>
                  </span>
                  <span v-if="!totalMarket.selections.filter(sel => sel.hadvalue === 'U')[0]">
                    <div class="missingMarketsHolder"></div>
                  </span>
                </v-flex>
              </v-layout>
            </div>
            <div class="selections layout" v-else idfomarket="null">
              <v-layout column wrap>
                <v-flex>
                  <span :class="['selection', 'flex']">
                    <selection :selection="{}"
                               :istradable="true"
                               :showselectionname="false"></selection>
                  </span>
                </v-flex>
                <v-flex>
                  <span :class="['selection', 'flex']">

                    <selection :selection="{}"
                               :istradable="true"
                               :showselectionname="false"></selection>
                  </span>
                </v-flex>
              </v-layout>
            </div>
            <!--<div v-else class="empty"></div>-->
          </div>
        </div>
      </div>

<!--       non BIG3-->
      <div v-if="!isBig3Coupon"
        :class="['market', {
         'suspended': !market.istradable,
         'three-and-more-selections': (selectionCount4UI(market) >= 3 || market.isoutright),
         'three': (selectionCount4UI(market) === 3 && !market.isoutright),
         'two-selections': (selectionCount4UI(market) === 2 && !market.isoutright) }]"
        v-for="(market, index) in filteredMarkets"
        :key="market.idfomarket"
        :idfomarket="market.idfomarket"
        :isfrompush="(market.V !== undefined).toString()">
        <!-- <pre>{{ market.selections | JSON }} </pre>-->
        <v-expansion-panel :value="index === 0 ? 0 : 1" class='market-collapse'>
          <v-expansion-panel-content :id="['market-' + market.idfomarket]" expand-icon="">
            <div slot="header">
              <div class="market-name">
                <h4 class="market-name-title">{{ market.name}}</h4>
              </div>
            </div>
            <span v-if="isDebug">
              MARKET <br />
              idfomarket {{ market.idfomarket }}<br />
              isfrompush {{ (market.V !== undefined).toString() }}<br />
              isHadMarket(market) {{ isHadMarket(market) }}
              Number of active selections {{market.selections.filter(sel => sel.idfoselectionsuspensiontype !=='N/O' ).length}}
            </span>
            <div v-if="!isNaN(parseInt(market.currentmatchhandicap))" class="handicap-value">
              <!--{{ formatCurrentMatchHandicap(market) }}-->
            </div>
            <!-- markets with max 3 selections -->
            <div class="parent" v-if="market.selections.length <= 3 && !market.isoutright"
                 :class="{ 'selections-in-columns': diplayOnPage === 'live-single-event' || ['GOLF', 'MOTORSPORT', 'NASCAR'].indexOf(market.idfosporttype) > -1 }">
              <div class="market name" v-if="currentPath == 'SportsEvent'">
                <div class="layout">{{ event.participantname_home }}</div>
                <div class="layout">{{ event.participantname_away }}</div>
              </div>

              <div class="selections-container">
                <!--@TODO https://app.zeplin.io/project/5af9c06bb26cf68d1083d00b/screen/5b570b49f4e14e0b7d88a8f5 for suspended matches-->
                <!--<template class="istradable" v-if="market.istradable">-->
                  <!--<div class="suspended">-->
                    <!--Suspended-->
                  <!--</div>-->
                <!--</template>-->
                <!--<template v-else>-->
                <!-- HAD -->
                <!-- if IS HAD market and IS NOT MMA on coupon -->
                <div :class="['selections', { 'layout': market.idfohadtype === 'HAD' }, { 'hasdraw': market.selections.filter(sel => sel.hadvalue === 'D').length > 0 }, {'handicap': market.name.toLowerCase().indexOf('handicap') > -1}]"
                     v-if="market && market.selections && isHadMarket(market) && (diplayOnPage === 'live-single-event' || market.idfosporttype !== 'MMA')">

                  <div class="selection flex" v-if="drawSelectionForHadvalue(market, hadvalue)" v-for="(hadvalue, index) in ['H', 'D', 'A', 'O', 'U']" :key="index" :class="hadvalue">
                    <span :class="['selection-column', hadvalue, {'active': betslipSelections[selection.idfoselection]}]"
                          v-for="(selection) in getSelectionsByHAD(market.selections, hadvalue)"
                          :key="selection.idfoselection"
                          @click.stop="toggleSelection(selection, market)">

                      <!--<selection :selection="selection" :istradable="market.istradable" :showselectionname="true" :ishad="true" :pricechangehighlight="pricechangehighlight"></selection>-->
                      <span v-if="diplayOnPage === 'live-single-event' || ['GOLF', 'MOTORSPORT', 'NASCAR'].indexOf(market.idfosporttype) > -1" class="selection-name"><span v-if="selection.listcode" class="listcode">{{ selection.listcode }}</span>{{selection.name}}</span>
                      <!--<pre>-->
                      <!--{{ market[0].istradable }}-->
                      <!--</pre>-->
                      <selection
                        :selection="selection"
                        :istradable="market.istradable"
                        :showselectionname="!iscoupondisplay && market.isoutright"
                        :ishad="true"
                        :pricechangehighlight="pricechangehighlight"></selection>
                    </span>
                  </div>
                </div>
                <!--</template>-->
                <!-- non HAD -->
                <!-- is is NON HAD or IS MMA on coupon -->
                <div class="selections layout all non-had" v-if="market && market.selections && (!isHadMarket(market) || (diplayOnPage !== 'live-single-event' && market.idfosporttype === 'MMA'))">
                  <span v-if="selection.idfoselectionsuspensiontype !== 'N/O'" :class="['selection', 'flex', {'active': betslipSelections[selection.idfoselection]}]"
                        v-for="(selection) in sortedSelections({ market: market, selections: market.selections })"
                        :key="selection.idfoselection"
                        @click.stop="toggleSelection(selection, market)">
                    <span class="selection-column">
                      <!--<selection :selection="selection" :istradable="market.istradable" :showselectionname="true" :ishad="false"></selection>-->
                      <span v-if="diplayOnPage === 'live-single-event' || ['MMA', 'BASKETBALL', 'GOLF', 'MOTORSPORT', 'NASCAR'].indexOf(market.idfosporttype) > -1" class="selection-name"><span v-if="selection.listcode" class="listcode">{{ selection.listcode }}</span>{{selection.name}}</span>
                      <selection
                        :selection="selection"
                        :istradable="market.istradable"
                        :showselectionname="!iscoupondisplay && market.isoutright"
                        :ishad="false"
                        :pricechangehighlight="pricechangehighlight"></selection>
                    </span>
                  </span>
                </div>
              </div>
            </div>
            <!-- more then 3 selections HAD, non HAD on event-->
            <div v-if="(market.selections.length > 3 || market.isoutright) && diplayOnPage === 'live-single-event'" class="selections-container">
              <div class="marketwebnote" v-if="market.webnote">{{market.webnote}}</div>
              <v-flex v-if="!mobileBigAndBelow">
                <div :class="['flex-more3-container', noOfColumns(market)]">
                  <!-- Show Features-->
                  <span class="flex-item" v-if="market.selections.filter(sel => sel.internalorder < 1000 ).length > 0">
                    <span v-if="selection.internalorder < 1000 && selection.idfoselectionsuspensiontype !== 'N/O'" :class="['selections', {'active': betslipSelections[selection.idfoselection]}, selection.hadvalue]"
                          v-for="selection in (expandedMarkets[market.idfomarket] ?
                            sortedSelections({ market: market, selections: market.selections.filter(sel => sel.internalorder < 1000 && sel.idfoselectionsuspensiontype !== 'N/O') }) :
                            sortedSelections({ market: market, selections: market.selections.filter(sel => sel.internalorder < 1000 && sel.idfoselectionsuspensiontype !== 'N/O') }).slice(0, 3))"
                          :key="selection.idfoselection"
                          @click.stop="toggleSelection(selection, market)">
                      <span class="selectionname"><span v-if="selection.listcode" class="listcode">{{ selection.listcode }}</span>{{ selection.name }}</span>
                      <span :class="['selection', 'layout', { 'hasdraw': market.selections.filter(sel => sel.hadvalue === 'D').length > 0 }]" v-if="selection.internalorder < 1000">
                        <selection
                          :selection="selection"
                          :istradable="market.istradable"
                          :showselectionname="false"
                          :ishad="false"
                          :pricechangehighlight="pricechangehighlight"></selection>
                      </span>
                    </span>
                  </span>
                  <span class="flex-item" v-if="market.selections.filter(sel => sel.internalorder >= 1000 && sel.internalorder < 2000).length > 0">
                    <span v-if="(selection.internalorder >= 1000 && selection.internalorder < 2000) && selection.idfoselectionsuspensiontype !== 'N/O'" :class="['selections', {'active': betslipSelections[selection.idfoselection]}, selection.hadvalue]"
                          v-for="selection in (expandedMarkets[market.idfomarket] ?
                            sortedSelections({ market: market, selections: market.selections.filter(sel => sel.internalorder >= 1000 && sel.internalorder < 2000 && sel.idfoselectionsuspensiontype !== 'N/O') }) :
                            sortedSelections({ market: market, selections: market.selections.filter(sel => sel.internalorder >= 1000 && sel.internalorder < 2000 && sel.idfoselectionsuspensiontype !== 'N/O') }).slice(0, 3))"
                          :key="selection.idfoselection"
                          @click.stop="toggleSelection(selection, market)">
                      <span class="selectionname"><span v-if="selection.listcode" class="listcode">{{ selection.listcode }}</span>{{ selection.name }}</span>
                      <span :class="['selection', 'layout', { 'hasdraw': market.selections.filter(sel => sel.hadvalue === 'D').length > 0 }]" v-if="selection.internalorder >= 1000 && selection.internalorder < 2000">
                        <selection
                          :selection="selection"
                          :istradable="market.istradable"
                          :showselectionname="false"
                          :ishad="false"
                          :pricechangehighlight="pricechangehighlight"></selection>
                      </span>
                    </span>
                  </span>
                  <span class="flex-item" v-if="market.selections.filter(sel => sel.internalorder >= 2000 ).length > 0">
                    <span v-if="selection.internalorder >= 2000 && selection.idfoselectionsuspensiontype !== 'N/O'" :class="['selections', {'active': betslipSelections[selection.idfoselection]}, selection.hadvalue]"
                          v-for="selection in (expandedMarkets[market.idfomarket] ?
                            sortedSelections({ market: market, selections: market.selections.filter(sel => sel.internalorder >= 2000 && sel.idfoselectionsuspensiontype !== 'N/O') }) :
                            sortedSelections({ market: market, selections: market.selections.filter(sel => sel.internalorder >= 2000 && sel.idfoselectionsuspensiontype !== 'N/O') }).slice(0, 3))"
                          :key="selection.idfoselection"
                          @click.stop="toggleSelection(selection, market)">
                      <span class="selectionname"><span v-if="selection.listcode" class="listcode">{{ selection.listcode }}</span>{{ selection.name }}</span>
                      <span :class="['selection', 'layout', { 'hasdraw': market.selections.filter(sel => sel.hadvalue === 'D').length > 0 }]" v-if="selection.internalorder >= 2000">
                        <selection :selection="selection"
                          :istradable="market.istradable"
                          :showselectionname="false"
                          :ishad="false"
                          :pricechangehighlight="pricechangehighlight"></selection>
                      </span>
                    </span>
                  </span>
                  <!--ends:  Show Features-->
                </div>
                <div v-if="diplayOnPage !== 'live-single-event' && market.selections.filter(sel => sel.idfoselectionsuspensiontype !=='N/O' ).length > 9" class="time">
                  <span v-if="isDateToday(event.tsstart)">Today {{ (event.tsstart) | moment(dateFormats.longTime)}}</span>
                  <span v-if="isDateTomorrow(event.tsstart)">Tomorrow {{ (event.tsstart) | moment(dateFormats.longTime)}}</span>
                  <span v-if="!isDateToday(event.tsstart) && !isDateTomorrow(event.tsstart)">{{ event.tsstart | moment(dateFormats.longDateTimeMG) }} </span>
                </div>
                <!-- PPBUS431-->
                <div v-if="marketCondition(market)" class="show-more-btn">
                  <v-btn :ripple="false" flat @click.stop="toggleExpandMarket(market.idfomarket)">
                    <span v-show="!expandedMarkets[market.idfomarket]">See more</span>
                    <span v-show="expandedMarkets[market.idfomarket]">See Less</span>
                  </v-btn>
                </div>
              </v-flex>
              <v-flex v-if="mobileBigAndBelow">
                <span v-if="selection.idfoselectionsuspensiontype !== 'N/O'" :class="['selections-mobile mobile', {'active': betslipSelections[selection.idfoselection]}]"
                      v-for="selection in (expandedMarkets[market.idfomarket] ?
                        sortedSelections({ market: market, selections: market.selections.filter(sel => sel.idfoselectionsuspensiontype !== 'N/O') }) :
                        sortedSelections({ market: market, selections: market.selections.filter(sel => sel.idfoselectionsuspensiontype !== 'N/O') }).slice(0, 9))"
                      :key="selection.idfoselection"
                      @click.stop="toggleSelection(selection, market)">
                  <selection
                    :selection="selection"
                    :istradable="market.istradable"
                    :showselectionname="true"
                    :ishad="false"
                    :isoutright="market.isoutright"
                    :pricechangehighlight="pricechangehighlight"></selection>
                </span>
                <div v-if="diplayOnPage !== 'live-single-event' && market.selections.length > 9" class="time">
                  <span v-if="isDateToday(event.tsstart)">Today {{ (event.tsstart) | moment(dateFormats.longTime)}}</span>
                  <span v-if="isDateTomorrow(event.tsstart)">Tomorrow {{ (event.tsstart) | moment(dateFormats.longTime)}}</span>
                  <span v-if="!isDateToday(event.tsstart) && !isDateTomorrow(event.tsstart)">{{ event.tsstart | moment(dateFormats.longDateTimeMG) }} </span>
                </div>
                <div v-if="market.selections.filter(sel => sel.idfoselectionsuspensiontype !=='N/O' ).length > 9" class="show-more-btn">
                  <v-btn :ripple="false" flat @click.stop="toggleExpandMarket(market.idfomarket)">
                    <span v-show="!expandedMarkets[market.idfomarket]">See more</span>
                    <span v-show="expandedMarkets[market.idfomarket]">See Less</span>
                  </v-btn>
                </div>
              </v-flex>
            </div>
            <!-- more then 3 selections HAD  non HAD on coupon-->
            <div v-if="(market.selections.length > 3 || market.isoutright) && diplayOnPage !== 'live-single-event'" class="selections-container">
              <div class="marketwebnote" v-if="market.webnote">{{market.webnote}}</div>
              <v-flex>
                <span v-if="selection.idfoselectionsuspensiontype !== 'N/O'" :class="['selections-mobile', {'active': betslipSelections[selection.idfoselection]}, {'mobile': mobileBigAndBelow}]"
                      v-for="selection in (expandedMarkets[market.idfomarket] ?
                        sortedSelections({ market: market, selections: market.selections.filter(sel => sel.idfoselectionsuspensiontype !== 'N/O') }) :
                        sortedSelections({ market: market, selections: market.selections.filter(sel => sel.idfoselectionsuspensiontype !== 'N/O') }).slice(0, 9))"
                      :key="selection.idfoselection"
                      @click.stop="toggleSelection(selection, market)">
                  <selection
                    :selection="selection"
                    :istradable="market.istradable"
                    :showselectionname="true"
                    :ishad="false"
                    :isoutright="market.isoutright"
                    :pricechangehighlight="pricechangehighlight"></selection>
                </span>
              </v-flex>
              <!-- show footer for live, in-play markets with 9 or more selections -->
              <live-coupon-event-footer :class="[{'in-play-live-coupon-footer': isLiveEventMarket }]"
                                        v-if="isLiveEventMarket && event.markets && event.markets[0] && event.markets[0].selections && event.markets[0].selections.length > 9"
                                        :event="liveEvents.find(ev => ev.idfoevent === event.idfoevent)" :couponname="couponname || 'Live coupon'"></live-coupon-event-footer>

              <div v-if="!isLiveEventMarket && market.selections.filter(sel => sel.idfoselectionsuspensiontype !=='N/O' ).length > 9" class="time">
                <span v-if="isDateToday(event.tsstart)">Today {{ (event.tsstart) | moment(dateFormats.longTime)}}</span>
                <span v-if="isDateTomorrow(event.tsstart)">Tomorrow {{ (event.tsstart) | moment(dateFormats.longTime)}}</span>
                <span v-if="!isDateToday(event.tsstart) && !isDateTomorrow(event.tsstart)">{{ event.tsstart | moment(dateFormats.longDateTimeMG) }} </span>
              </div>
              <!-- PPBUS431-->
              <div v-if="market.selections.filter(sel => sel.idfoselectionsuspensiontype !=='N/O' ).length > 9" class="show-more-btn" :class="[{'in-play-live-coupon': isLiveEventMarket}]">
                <v-btn flat :ripple="false" @click.stop="toggleExpandMarket(market.idfomarket)">
                  <span v-show="!expandedMarkets[market.idfomarket]">See more</span>
                  <span v-show="expandedMarkets[market.idfomarket]">See Less</span>
                </v-btn>
              </div>
            </div>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </div>
    </div>
  </div>

</template>
<script>
  import Vue from 'vue'
  import config from '@/config'
  import lib from '@/library'
  import store from '@/store'
  import Gtm from '@/components/mixins/Gtm'
  import selection from '@/components/sports/bettingoffer/selection'
  import Screen from '@/components/mixins/Screen'
  import big3MarketsHeader from '@/components/sports/bettingoffer/big3MarketsHeader'
  import BettingOffer from '@/components/mixins/BettingOffer'
  import Icon from '@/components/common/Icon'
  import LiveCouponEventFooter from '@/components/sports/bettingoffer/live/liveCouponEventFooter'
  import Session from '@/components/mixins/Session'
  import TeamLogo from '@/components/mixins/TeamLogo'
  import Big3ColumnOrder from '@/components/mixins/Big3ColumnOrder'
  import LayoutUtil from '@/components/mixins/LayoutUtil'

  // Props - diplayOnPage - 'headline-market', coupon,

  export default {
    name: 'market',

    components: {
      selection,
      big3MarketsHeader,
      Icon,
      LiveCouponEventFooter
    },

    mixins: [
      Screen,
      BettingOffer,
      Big3ColumnOrder,
      TeamLogo,
      Gtm,
      Session,
      LayoutUtil
    ],

    props: [
      'markets',
      'maxnumofmarkets',
      'iscoupondisplay',
      'pricechangehighlight',
      'event',
      'diplayOnPage',
      'islivepredefined',
      'isbig3coupon',
      'couponname',
      'isLiveEventPage'
    ],

    data () {
      return {
        vue: Vue,
        clickTO: null,
        clickModal: null,
        action: null,
        selectionsPrices: {},
        expandedMarkets: {},
        panel: true,
        counter: 0
      }
    },

    computed: {
      teamLogos () {
        return {
          logoHome: this.event && this.event.logohome,
          logoAway: this.event && this.event.logoaway
        }
      },
      isLiveEventMarket () {
        return this.liveEvents.filter(ev => ev.idfoevent === this.event.idfoevent).length > 0
      },
      currentPath () {
        // For css only
        if (this.$route.path.indexOf('/sports/event/') > -1) {
          return 'SportsEvent'
        } else if (this.$route.path.indexOf('/sports/navigation/') > -1) {
          return 'SportsNavigation'
        } else {
          return undefined
        }
      },
      maxNumOfMarkets () {
        return parseInt(this.maxnumofmarkets) || 999
      },
      betslipSelections () {
        return store.getters['sbBetslipState/betslipSelectionsIds']
      },
      selectionsNo () {
        return store.getters['sbBetslipState/selectionsNo']
      },
      betslipMarkets () {
        var betslipMarkets = store.getters['sbBetslipState/getMarkets']
        var markets = {}

        for (var key in betslipMarkets) {
          markets[betslipMarkets[key].idfomarket] = betslipMarkets[key]
        }

        return markets
      },
      teasersPriceTypes () {
        return store.getters['sbBetslipState/teasersPriceTypes']
      },
      filteredMarkets () {
        if (this.markets && this.markets.length > 0) {
          let markets = this.markets.filter((market) => {
            let csvpricetypes = (market.csvpricetypes && market.csvpricetypes.split(',')) || []
            let isNotIncludedInPT = (t) => csvpricetypes.indexOf(t) === -1

//            return (market.selections && market.selections.length > 0 && csvpricetypes.indexOf('T1') === -1 &&
//            csvpricetypes.indexOf('T2') === -1 &&
//            csvpricetypes.indexOf('T3') === -1)

            return (market.selections && market.selections.length > 0 && this.teasersPriceTypes.every(isNotIncludedInPT))
          })

          let processedMarkets = []
          if (this.islivepredefined) {
            processedMarkets = markets
          } else {
            let originalIDFOEvent = markets && markets[0] && markets[0].idfoevent
            let liveEventForMarkets = this.liveEvents.find(ev => ev.idfoevent === originalIDFOEvent || ev.foeventantepost === originalIDFOEvent)
            if (liveEventForMarkets) {
              markets.forEach(mk => {
                let liveMarket = liveEventForMarkets.markets && liveEventForMarkets.markets.find(mk1 => mk.idfomarket === mk1.idfomarket)
                if (liveMarket) {
                  processedMarkets.push(liveMarket)
                } else {
                  processedMarkets.push(mk)
                }
              })
            } else {
              processedMarkets = markets
            }
          }
          return processedMarkets
        } else {
          return []
        }
      },
      isBig3Coupon () {
        if (this.isbig3coupon === undefined) {
          return this.filteredMarkets && this.filteredMarkets[0] &&
            (!config.app.autoconf.BIG3_IGNORE_SPORTTYPES.includes(this.filteredMarkets[0].idfosporttype) &&
            this.filteredMarkets.filter(mk => !(mk.big3markettype && (this.displayAllGamePeriodsAsBig3 || mk.gameperiod === '1+') && mk.selections && mk.selections.length <= 2)).length === 0)
        } else {
          return this.isbig3coupon
        }
      },
      pointsMarket () {
        if (this.isBig3Coupon) {
          return this.filteredMarkets.find(mk => mk.big3markettype === 'PS' && (this.displayAllGamePeriodsAsBig3 || mk.gameperiod === '1+') && mk.selections && mk.selections.length <= 2)
        }

        return undefined
      },
      moneyMarket () {
        if (this.isBig3Coupon) {
          return this.filteredMarkets.find(mk => mk.big3markettype === 'ML' && (this.displayAllGamePeriodsAsBig3 || mk.gameperiod === '1+') && mk.selections && mk.selections.length <= 2)
        }

        return undefined
      },
      totalMarket () {
        if (this.isBig3Coupon) {
          return this.filteredMarkets.find(mk => mk.big3markettype === 'TP' && (this.displayAllGamePeriodsAsBig3 || mk.gameperiod === '1+') && mk.selections && mk.selections.length <= 2)
        }

        return undefined
      },
      sortedSelections () {
        return (params) => {
          if (params && params.market && params.selections && params.selections.length > 0) {
            if (params.market.idfoselectionorder && ['SETUP', 'ODDS', 'NAME'].indexOf(params.market.idfoselectionorder) > -1) {
              switch (params.market.idfoselectionorder) {
                case 'SETUP':
                  return Vue._.orderBy(params.selections, ['internalorder', 'price', 'name'])
                case 'ODDS':
                  return Vue._.orderBy(params.selections, ['price', 'name'])
                case 'NAME':
                  return Vue._.orderBy(params.selections, ['name', 'price'])
              }
            } else {
              return Vue._.orderBy(params.selections, ['internalorder', 'price', 'name'])
            }
          } else {
            return []
          }
        }
      },
      marketNameForHeaderForEventMarketGroupWithOneMarket () {
        if (this.markets && this.markets.length === 1) {
          return this.markets[0].big3markettype
        } else return null
      },
      isLoggedIn () {
        return store.getters['isLoggedIn']
      },
      isBBenabled () {
        return config.app.autoconf.IS_BUYBACK_ENABLED
      },
      isPointsMarketAvailableForBB () {
        return (this.isBBenabled && this.pointsMarket && this.pointsMarket.BB) || undefined
      },
      isMoneyMarketAvailableForBB () {
        return (this.isBBenabled && this.moneyMarket && this.moneyMarket.BB) || undefined
      },
      isTotalMarketAvailableForBB () {
        return (this.isBBenabled && this.totalMarket && this.totalMarket.BB) || undefined
      },
      isNonBig3MarketAvailableForBB () {
        return (this.isBBenabled && !(this.totalMarket || this.moneyMarket || this.pointsMarket) && this.filteredMarkets.find(mk => mk.BB)) || undefined
      },
      displayAllGamePeriodsAsBig3 () {
        return config.app.autoconf.DISPLAY_ALL_GAMEPERIODS_AS_BIG3 && this.diplayOnPage === 'live-single-event'
      },
      isPitcherVisible () {
        return !config.app.autoconf.HIDE_PITCHER_NAME
      },
      isReadOnly () {
        return config.app.autoconf.ROBO
      }
    },

    methods: {
      isHadMarket (market) {
        if (market.selections) {
          return market.selections.filter(sel => sel.hadvalue === 'H').length > 0 ||
            market.selections.filter(sel => sel.hadvalue === 'D').length > 0 ||
            market.selections.filter(sel => sel.hadvalue === 'A').length > 0 ||
            market.selections.filter(sel => sel.hadvalue === 'U').length > 0
        } else {
          return []
        }
      },
      getSelectionsByHAD (selections, hadvalue) {
        return (selections && selections.filter(sel => sel.hadvalue === hadvalue)) || []
      },
      drawSelectionForHadvalue (market, hadvalue) {
        return (market.idfohadtype === 'HA' && ['H', 'A'].indexOf(hadvalue) > -1) ||
        (market.idfohadtype === 'HAD' && ['H', 'D', 'A'].indexOf(hadvalue) > -1) ||
        (market.idfohadtype === 'OU' && ['O', 'U'].indexOf(hadvalue) > -1)
      },
      formatCurrentMatchHandicap (market) {
        if (market.isunderover === 'true') {
          return market.currentmatchhandicap.toString().replace('-', '')
        } else {
          return market.currentmatchhandicap > 0 ? ('+' + market.currentmatchhandicap) : market.currentmatchhandicap
        }
      },
      formatSelectionPrice (selection) {
        if (!isNaN(parseFloat(selection.currentpriceup)) && !isNaN(parseFloat(selection.currentpricedown))) {
          let price = 1 + selection.currentpriceup / selection.currentpricedown
          let priceus = 0
          let sign = ''

          if (config.app.priceFormat === 'US') {
            if (price >= 2) {
              priceus = 100 * (price - 1)
              sign = '+'
            } else {
              priceus = -100 / (price - 1)
              sign = ''
            }

            return sign + priceus.toFixed(0)
          } else {
            return price.toFixed(2)
          }
        } else {
          return undefined
        }
      },
      placeAsSingle (selection, market) {
        lib.core.logger.debugConsoleLog('Place as Single BetSlip', 0)
        store.dispatch('sbBetslipState/toggleBetslipSelection', [selection, market, true, this.event])
      },
      toggleSelection (selection, market) {
        if (!this.isReadOnly) {
          this.userIsActive()
          var markettypedict = {
            PS: 'spread',
            ML: 'money',
            TP: 'total'
          }
          var marketType = this.isBig3Coupon && market.big3markettype && markettypedict[market.big3markettype]
          var couponTitle = this.couponname
          var competition = this.event.fosportname || this.event.sportname || this.event.idfosport || market.idfosport
          var sport = market.idfosporttype
          var inplay = this.isLiveEvent(market.idfoevent)
          var eventname = this.event.eventname

          if (this.betslipSelections[selection.idfoselection]) {
            this.sendGTMRemoveCouponSelectionsFromBetslip(marketType, couponTitle, competition, sport, inplay, this.selectionsNo, selection, market)
          } else {
            if (market.istradable) {
              this.sendGTMAddSelectionToBetslip(marketType, couponTitle, competition, sport, inplay, this.selectionsNo === 0, selection, market, eventname)
            } else {
              this.sendGTMAddSelectionToBetslipBlocked('suspended', couponTitle, competition, sport, inplay, this.selectionsNo === 0, selection, market)
            }
          }
          store.dispatch('sbBetslipState/toggleBetslipSelection', [selection, market, false, this.event])
        }
      },
      getSportOrFoSportName (markets, param) {
        let sportOrFoSportName = 'empty'
        switch (param) {
          case 'sport-name':
            if (markets) {
              markets.forEach(market => {
                if (market && market.idfosporttype) {
                  // remove whitespaces
                  sportOrFoSportName = market.idfosporttype.replace(/ /g, '')
                }
              })
            }
            break
          case 'fo-sport-name':
            if (markets) {
              markets.forEach(market => {
                if (market && market.sportname) {
                  sportOrFoSportName = market.sportname
                }
              })
            }
            break
        }
        return sportOrFoSportName
      },
      toggleExpandMarket (idfomarket) {
        this.userIsActive()
        Vue.set(this.expandedMarkets, idfomarket, !this.expandedMarkets[idfomarket])
      },
      noOfColumns (market) {
        let className
        if ((market.selections.filter(sel => sel.internalorder >= 2000).length > 0) &&
              (market.selections.filter(sel => sel.internalorder >= 1000 && sel.internalorder < 2000).length > 0) &&
              (market.selections.filter(sel => sel.internalorder < 1000).length > 0)) {
          className = 'three-columns'
        } else if (((market.selections.filter(sel => sel.internalorder < 1000).length > 0) && (market.selections.filter(sel => sel.internalorder >= 1000 && sel.internalorder < 2000).length > 0)) ||
              ((market.selections.filter(sel => sel.internalorder < 1000).length > 0) && (market.selections.filter(sel => sel.internalorder >= 2000).length > 0)) ||
              ((market.selections.filter(sel => sel.internalorder >= 1000 && sel.internalorder < 2000).length > 0) && (market.selections.filter(sel => sel.internalorder >= 2000).length > 0))) {
          className = 'two-columns'
        } else {
          className = 'one-column'
        }
        return className
      },

      /*
      Display or not collapse/expand for markets based on multiple conditions:
      1. if market has more then 9 sel OR
      2. if market has more then 3 sel AND doesn't have selections for columns 'two' AND or 'three' (internal order) OR
      3. if market has more then 3 sel for columns 'two' OR 'three'
      - 'N/O' / suspended selection, for live markets
      */
      marketCondition (market) {
        if (market.selections.filter(sel => sel.idfoselectionsuspensiontype !== 'N/O').length > 9 ||
         (market.selections.filter(sel => sel.idfoselectionsuspensiontype !== 'N/O').length > 3 &&
         (((market.selections.filter(sel => sel.internalorder >= 1000 && sel.internalorder < 2000 && sel.idfoselectionsuspensiontype !== 'N/O').length === 0 && market.selections.filter(sel => sel.internalorder >= 2000 && sel.idfoselectionsuspensiontype !== 'N/O').length === 0)) ||
         (market.selections.filter(sel => sel.internalorder >= 1000 && sel.internalorder < 2000 && sel.idfoselectionsuspensiontype !== 'N/O').length > 3 || market.selections.filter(sel => sel.internalorder >= 2000 && sel.idfoselectionsuspensiontype !== 'N/O').length > 3)))) {
          return true
        } else {
          return false
        }
      },
      /**
       * Count selections in UI context
       * @param market
       */
      selectionCount4UI (market) {
        if (market.idfohadtype && market.idfohadtype === 'HAD' && market.selections.length > 0 && market.selections.length < 3) {
          return 3
        } else if (market.idfohadtype && market.idfohadtype === 'HA' && market.selections.length === 1) {
          return 2
        } else {
          return market.selections.length
        }
      }
    },

    created () {
      if (this.markets && this.markets.length > 0) {
        this.setBig3ColumnOrderSportType(this.markets[0].idfosporttype)
      }
    },

    watch: {
      markets (markets) {
        var betslipMarkets = markets.filter(mk => this.betslipMarkets[mk.idfomarket])
        if (betslipMarkets.length > 0) {
          store.dispatch('sbBetslipState/checkForBetSlipUpdate', betslipMarkets)
        }
      }
    }
    // mounted () {
    //   if (this.filteredMarkets && this.filteredMarkets.length > 0) {
    //     var marketsToSubscribe = this.filteredMarkets.filter(mk => mk.V)
    //   }
    //
    //   if (marketsToSubscribe && marketsToSubscribe.length > 0) {
    //     lib.WebSocketLiveService.addMarketsToSubscribeQueue(marketsToSubscribe)
    //   }
    // },
    //
    // destroyed () {
    //   if (this.filteredMarkets && this.filteredMarkets.length > 0) {
    //     var subscribedMarkets = this.filteredMarkets.filter(mk => mk.subscriptionId)
    //
    //     if (subscribedMarkets && subscribedMarkets.length > 0) {
    //       lib.WebSocketLiveService.addMarketsToUnsubscribeQueue(subscribedMarkets)
    //     }
    //   }
    // },
    //
    // watch: {
    //   filteredMarkets (newMarkets, oldMarkets) {
    //     var marketsToSubscribe = []
    //
    //     if (newMarkets && newMarkets.length > 0) {
    //       newMarkets.forEach(newMarket => {
    //         let oldMarket = oldMarkets.find(mk => mk.idfomarket === newMarket.idfomarket)
    //
    //         if (newMarket.V && (!oldMarket || !oldMarket.V) && !newMarket.subscriptionId) {
    //           marketsToSubscribe.push(newMarket)
    //         }
    //       })
    //
    //       if (marketsToSubscribe.length > 0) {
    //         lib.WebSocketLiveService.addMarketsToSubscribeQueue(marketsToSubscribe)
    //       }
    //     }
    //   }
    // }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus">
@import '~@/css/config'
  .show-more-btn:not(.in-play-live-coupon)
    width 100%
  .show-more-btn
    clear both
    text-align center
    height: 42px
    background-color: #f2f2f2
    .v-btn
      margin 0
      color #0b4da1

  .selections-container
    > .flex
      display: flex
      flex-wrap: wrap
      align-items: stretch
      .selections-mobile
        width: 33%
        border-right: 1px solid #cfd6db
        display: flex
        &.mobile
          width 100%
          border none
        &:nth-child(3n)
          border none
        .selection-data
          display: flex
          align-items: center
          flex: 1
  .eventmarketgroup
    .markets-wrapper
      @media mobile-big-and-below
        margin 0 4px 0px
      .markets
        .selections-in-columns
          .flex-more3-container
            display flex
            width 100%
            .flex-item
              padding 11px 12px
              border-right 1px solid #cfd6db
              flex unset
              display inline-block
              width 33%
              @media mobile-big-and-below
                display block
              &:nth-child(3)
                border none
              .selections
                align-items center
                padding 2px 0
                .selection
                  padding 0
                  width 60px!important
                  flex unset
                .selectionname
                  line-height 1.5
                  white-space normal
        // &.single
        //   @media mobile-big-and-below
        //     margin 0 4px 2px
  .eventmarketgroup .markets
    .selections-in-columns
      padding 0
      .selections-container
        padding: 0
        .flex
          @media mobile-big-and-below
            padding 9px 0
          .selections-mobile
            width: 100%
            display: flex
            &.mobile
              width 100%
              border none
            &:nth-child(3n)
              border none
            .selection-data
              display: flex
              align-items: center
              flex: 1
        .selections
          @media mobile-big-and-below
            padding 12px 0
            display block
          .selection
            border-right 1px solid #cfd6db
            display flex
            margin: 0
            padding: 12px
            @media mobile-big-and-below
              padding 2px 12px
              border none
            &:last-child
              border: none
            .selection-column
              display flex
              align-items center
              width 100%
              .selection-name, .selection-wrapper
                flex 1
                font-size 14px
              .selection-name
                // text-overflow ellipsis
                // overflow hidden
                // white-space nowrap
                line-height 1.3
                margin-right 3px
                width 0px
                cursor default
              .selection-wapper
                margin 2px
                flex-grow 0
                align-items center
                justify-content center
                min-height 40px
                height 100%
                font-size 14px
                >>> .value
                  display: flex
                  align-items: center
                  justify-content: center
                  flex: 1
                  .had-value,
                  .uo-currenthandicap,
                  .sh
                    // flex: 1
                  .sh
                    max-width 50px
                    display inline-block
      .market.name
        display none
    .big3
      // ceper
      background: #fff
      border: 1px solid #cfd6db
      padding 8px 5px 8px 9px
      border-bottom-left-radius 0px
      border-bottom-right-radius 0px
      .market
        // display: flex
        display: block
        min-width: 0
        margin: 0
        padding-left 1px
        &.name
          flex-direction: column
          .layout
            white-space normal
            overflow initial
            display: table
            table-layout: fixed
            width: 100%
            .name
              line-height initial
              display table-cell
              vertical-align middle
            .smaller
              font-size 10px
              text-transform capitalize
              display: table-row
              line-height: 8px
        &.has-pitchers
          .layout
            div
              &:first-child
                line-height 20px
          .smaller
            line-height 15px
        .selection
          display: flex
          height: 100%
          .selection-wapper
            display flex
            margin: 2px 0
            padding: 2px
            align-items: center
            justify-content: center
            height 40px
            width 130px
            @media mobile-big-and-below
              width 48px
  .markets
    .market
      .market-name
        display flex
        background #fff
        border-top 1px solid #cfd6db
        border-left 1px solid #cfd6db
        border-right 1px solid #cfd6db
        border-top-right-radius 5px
        border-top-left-radius 5px
        padding 10px 15px
        margin: 0
        color #21335a
        font-weight bold
        cursor: default
      .time
        width: 100%
        align-items: center
        color: #818e95
        line-height: 14px
        padding: 0px 15px 5px 9px
        -webkit-box-align: center
        font-size: 12px
        display: flex
        justify-content: space-between
      .marketwebnote
        display: none
  .date.live
    .markets
     .time
      display none
  .markets.empty
  .markets.single
    overflow unset
    .big3
      .market
        display inline-block
        vertical-align top
        .empty
          width 130px
          @media mobile-big-and-below
            width 60px!important
            margin 0 1px
    .selections
      .selection
        margin: 0 2px
      .selection:first-child
        margin-left 2px
        span
          margin-right: 0
          border-radius 5px
    .flex-more3-container
      .selections
        display flex
        .selectionname
          flex 1
          font-size: 14px
          color #1f375b
          overflow hidden
          text-overflow ellipsis
          margin-bottom 0px
          line-height 35px
        .selection
          flex 1
          justify-content flex-end
          .selection-wapper
            flex 0.33

    .big3
      .market
        .selections
          padding 0
          flex 1
          flex-grow 0.33
          .selection
            margin: 0
            .selection-wapper
              // margin 2px 1px
              height 40px
              width 130px
                @media mobile-big-and-below
                  width 53px
              line-height 13px
              padding: 0
              .value
                background: #f0f3f8
                padding: 13px 9px
                font-size 14px
                cursor pointer
                border-radius 5px
          &.active
            .selection-wapper
              .value
                border none
  .markets.multiple
    .big3
      white-space nowrap
      .empty
        width 130px
        @media mobile-big-and-below
          width 60px!important
          margin 0 1px
      .market
        display inline-block
        vertical-align: middle
        @media only screen and (min-width: 320px) and (max-width: 320px)
          .browser-safari.os-ios &
            //width: 60px
        &.money
          .selection-wapper
            .value
              .selectionprice
                line-height 38px
        .selections
          padding 0
          .row.wrap
            padding 0
            .selection
              .selection-wapper
                margin 2px
                text-align center
                border-radius 2px
                background #f0f3f8
                height 40px
                padding-top 1px
                cursor pointer
        &.total
          .selection
            .selection-wapper
              .uo-currenthandicap
                color black
            &.active
              .selection-wapper
                .uo-currenthandicap
                  color white
                  font-weight 400
                  &:hover
                    color white

.market-collapse.v-expansion-panel
   -webkit-box-shadow: none
   -moz-box-shadow: none
   box-shadow: none
  .v-expansion-panel__container
    border-bottom-right-radius: 0px !important
    border-bottom-left-radius: 0px !important
    .v-expansion-panel__body
    >>>.v-expansion-panel__header
      padding: 0
      display none
      .market-name-title
        margin: 0
      .market-name:hover
        cursor pointer
      .header__icon
        display: none
      .v-expansion-panel__header__icon
        display: none


.url-event
  .market-collapse.v-expansion-panel
    .v-expansion-panel__container
      .v-expansion-panel__body
        border-radius 0px
      >>>.v-expansion-panel__header
        border-top: 1px solid #cfd6db
        border-left: 1px solid #cfd6db
        border-right: 1px solid #cfd6db
        border-top-right-radius: 0px
        border-top-left-radius: 0px
        display: none
        .header__icon
          padding-right: 12px
          display: inline
        .v-expansion-panel__header__icon
          padding-right: 12px
          display: inline
        .market-name
          border-right: none !important
          border: 0px !important
        .market-name:hover
          cursor pointer
.event.last
  .show-more-btn
    border-bottom-right-radius: 5px
    border-bottom-left-radius: 5px
.event.last
  .show-more-btn.in-play-live-coupon
    border-bottom-right-radius: 5px
    border-bottom-left-radius: 5px
.live-single-event
  .show-more-btn
    border-bottom-right-radius: 5px
    border-bottom-left-radius: 5px

.browser-internet-explorer
  .eventmarketgroup .markets
    .selections-in-columns
      .selections-container
        .selections
          .selection
            .selection-column
              .selection-wapper
                >>> .value
                  .had-value,
                  .uo-currenthandicap,
                  .sh
                    max-width 100%

.missingMarketsHolder
  width 130px
  height 40px
  margin 2px 0
  @media mobile-big-and-below
    width 53px !important

.selection
  min-height 40px
</style>
