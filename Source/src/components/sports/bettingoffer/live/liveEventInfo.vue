<template>

  <!--This will be listed on coupon or as event page-->
  <div :class="['event-info', {'threeselections': threeselections}, {'big-three': isbig3coupon}]"
       :idfoevent="event.idfoevent.toString()"
       :idfosbevent="event.idfosbevent && event.idfosbevent.toString()"
       :idextevent="event.idextevent && event.idextevent.toString()">
    <template v-if="isDebug">
      EVENT <br />
      idfoevent {{ event.idfoevent }}<br />
      idfosbevent {{ event.idfosbevent }}<br />
      foeventinternalorder {{ event.foeventinternalorder }} <br />
      hometeamname {{ event.hometeamname }}<br />
      awayteamname {{ event.awayteamname }}
    </template>
    <!--For Live Event page-->
    <template v-if="page !== 'coupon'">
      <template v-if="awayPlayer && awayPlayer.name &&  homePlayer && homePlayer.name">
        <section class="live_header">
          <div class="time-period">{{ activePeriodName }}</div>
            <section class="time-display" v-if="['FOOTBALL', 'SOCCER', 'BASKETBALL', 'HANDBALL'].indexOf(event.idfosporttype) > -1">
              <match-time-display v-if="matchTimer" :timer="matchTimer"></match-time-display>
              <span v-if="!matchTimer && event.istimeractive && event.matchcurrenttimeinmins">{{ event.matchcurrenttimeinmins | formatMinutesWithSeconds }}</span>
            </section>
          <span class="icon-live"></span>
        </section>
        <section class="parent" :class="{'resultsWithSets' : awayPlayerSetScore}">

          <section class="child child-left" v-if="event.idfosporttype !== 'DARTS'" >
            <!-- If idfosporttype = TENNIS, TABLE TENNIS or SOCCER, home team/player will be on top -->
            <template v-if="isNonBig3FoSportType">
              <div class="team-title">
                <span>
                  <text-highlight v-if="phraseToHighlight" :queries="phraseToHighlight">{{ ' ' + homePlayer.name }}</text-highlight>
                  <template v-else>{{ homePlayer.name }}</template>
                  <icon v-if="event.idfosporttype && (homePlayer.idfosblead === event.idfosbleadactive || homePlayer.flag1)"
                    :name="'icon-' + event.idfosporttype.split(' ').join('').toLowerCase()" :colorName="'white'">
                  </icon>
                </span>
                <div v-if="isPitcherVisible" class="pitcher-name">{{ event.homepitchername | lowercase }}</div>
              </div>
              <div class="team-title">
                <span class="name">
                  <text-highlight v-if="phraseToHighlight" :queries="phraseToHighlight">{{ ' ' + awayPlayer.name }}</text-highlight>
                  <template v-else>{{ awayPlayer.name }}</template>
                  <icon v-if="event.idfosporttype && (awayPlayer.idfosblead === event.idfosbleadactive || awayPlayer.flag1)"
                    :name="'icon-' + event.idfosporttype.split(' ').join('').toLowerCase()" :colorName="'white'">
                  </icon>
                </span>
                <div v-if="isPitcherVisible" class="pitcher-name">{{ event.awaypitchername | lowercase }}</div>
              </div>
            </template>
            <template v-else>
              <div class="team-title">
                <span class="name">
                  <text-highlight v-if="phraseToHighlight" :queries="phraseToHighlight">{{ ' ' + awayPlayer.name }}</text-highlight>
                  <template v-else>{{ awayPlayer.name }}</template>
                  <icon v-if="event.idfosporttype && (awayPlayer.idfosblead === event.idfosbleadactive || awayPlayer.flag1)"
                    :name="'icon-' + event.idfosporttype.split(' ').join('').toLowerCase()" :colorName="'white'">
                  </icon>
                </span>
                <div v-if="isPitcherVisible" class="pitcher-name">{{ event.awaypitchername | lowercase }}</div>
              </div>
              <div class="team-title">
                <span>
                  <text-highlight v-if="phraseToHighlight" :queries="phraseToHighlight">{{ ' ' + homePlayer.name }}</text-highlight>
                  <template v-else>{{ homePlayer.name }}</template>
                  <icon v-if="event.idfosporttype && (homePlayer.idfosblead === event.idfosbleadactive || homePlayer.flag1)"
                    :name="'icon-' + event.idfosporttype.split(' ').join('').toLowerCase()" :colorName="'white'">
                  </icon>
                </span>
                <div v-if="isPitcherVisible" class="pitcher-name">{{ event.homepitchername | lowercase }}</div>
              </div>
            </template>
          </section>

          <section class="child child-left" v-if="event.idfosporttype === 'DARTS'">
            <div class="team-title">
              <span class="activelead dot-mobile" v-show="homePlayer.idfosblead === event.idfosbleadactive || homePlayer.flag1"></span>
              <span>
                <text-highlight v-if="phraseToHighlight" :queries="phraseToHighlight">{{ ' ' + homePlayer.name }}</text-highlight>
                <template v-else>{{ homePlayer.name }}</template>
              </span>
              <span class="activelead dot" v-show="homePlayer.idfosblead === event.idfosbleadactive || homePlayer.flag1"></span>
              <div v-if="isPitcherVisible" class="pitcher-name">{{ event.homepitchername | lowercase }}</div>
            </div>
            <div class="team-title">
              <span class="activelead dot-mobile" v-show="awayPlayer.idfosblead === event.idfosbleadactive || awayPlayer.flag1"></span>
              <span class="name">
                <text-highlight v-if="phraseToHighlight" :queries="phraseToHighlight">{{ ' ' + awayPlayer.name }}</text-highlight>
                <template v-else>{{ awayPlayer.name }}</template>
              </span>
              <span class="activelead dot" v-show="awayPlayer.idfosblead === event.idfosbleadactive || awayPlayer.flag1"></span>
              <div v-if="isPitcherVisible" class="pitcher-name">{{ event.awaypitchername | lowercase }}</div>
            </div>
          </section>

          <section class="child child-right">

            <!-- <section class="time-period">{{ activePeriodName }}</section> -->
            <!-- <section class="time-display" v-if="['FOOTBALL', 'SOCCER', 'BASKETBALL', 'HANDBALL'].indexOf(event.idfosporttype) > -1">
              <match-time-display v-if="matchTimer" :timer="matchTimer"></match-time-display>
              <span v-if="!matchTimer && event.istimeractive && event.matchcurrenttimeinmins">{{ event.matchcurrenttimeinmins }}m</span>
            </section> -->

            <template v-if="event.idfosporttype !== 'DARTS'">
              <!-- If Sport don't have sets (no tennis)-->
              <section class="child result-title main-score" v-if="awayPlayerMainScore && !awayPlayerSetScore && !hideScores">
                <!-- If idfosporttype = TENNIS, TABLE TENNIS or SOCCER, home team's/player's score will be on top -->
                <template v-if="isNonBig3FoSportType">
                  <div class="current-main-score">
                    <table>
                      <td class="current-score">{{ homePlayerMainScore.value }}</td>
                      <td v-if="event.idfosporttype === 'CRICKET'" > - </td>
                      <td class="current-score-wicket" v-if="event.idfosporttype === 'CRICKET'">{{ homePlayerWicketsScore }}</td>
                    </table>
                  </div>
                  <div class="current-main-score">
                    <table>
                      <td class="current-score">{{ awayPlayerMainScore.value }}</td>
                      <td v-if="event.idfosporttype === 'CRICKET'"> - </td>
                      <td class="current-score-wicket" v-if="event.idfosporttype === 'CRICKET'">{{ awayPlayerWicketsScore }}</td>
                    </table>
                  </div>
                </template>
                <template v-else>
                  <div class="current-main-score">
                    <table>
                      <td class="current-score">{{ awayPlayerMainScore.value }}</td>
                      <td v-if="event.idfosporttype === 'CRICKET'"> - </td>
                      <td class="current-score-wicket" v-if="event.idfosporttype === 'CRICKET'">{{ awayPlayerWicketsScore }}</td>
                    </table>
                  </div>
                  <div class="current-main-score">
                    <table>
                      <td class="current-score">{{ homePlayerMainScore.value }}</td>
                      <td v-if="event.idfosporttype === 'CRICKET'" > - </td>
                      <td class="current-score-wicket" v-if="event.idfosporttype === 'CRICKET'">{{ homePlayerWicketsScore }}</td>
                    </table>
                  </div>
                </template>
              </section>

              <!-- If Sport HAVE sets (for instance tennis)-->
              <section class="child result-title" v-if="awayPlayerSetScore && !hideScores">
                <template v-if="isNonBig3FoSportType">
                  <div class="team-title">
                    <!-- home player -->
                    <table>
                      <thead v-if="brandLayout === 'generic'">
                        <th class="score-title">Sets</th>
                        <th class="score-title">Games</th>
                        <th class="score-title">Points</th>
                      </thead>
                      <tr>
                        <td class="current-score">
                          {{ homePlayerMainScore.value }}
                        </td>
                        <td class="current-set-score">
                          {{ homePlayerCurrentSetScore  }}
                        </td>
                        <td class="game-score">
                          {{ (!isTieBreakActive && homePlayerGameScore && homePlayerGameScore.value && gameScoreMap[homePlayerGameScore.value]) || (homePlayerGameScore && homePlayerGameScore.value) }}
                        </td>
                      </tr>
                    </table>
                  </div>
                  <div class="team-title">
                    <!-- away player -->
                    <table>
                      <td class="current-score">
                        {{ awayPlayerMainScore.value }}
                      </td>
                      <td class="current-set-score">
                        {{ awayPlayerCurrentSetScore }}
                      </td>
                      <td class="game-score">
                        {{ (!isTieBreakActive && awayPlayerGameScore && awayPlayerGameScore.value && gameScoreMap[awayPlayerGameScore.value]) || (awayPlayerGameScore && awayPlayerGameScore.value) }}
                      </td>
                    </table>
                  </div>
                </template>
                <template v-else>
                  <div class="team-title">
                    <!-- away player -->
                    <table>
                      <thead v-if="brandLayout === 'generic'">
                        <th class="score-title">Sets</th>
                        <th class="score-title">Games</th>
                        <th class="score-title">Points</th>
                      </thead>
                      <tr>
                        <td class="current-score">
                          {{ awayPlayerMainScore.value }}
                        </td>
                        <td class="current-set-score">
                          {{ awayPlayerCurrentSetScore }}
                        </td>
                        <td class="game-score">
                          {{ (!isTieBreakActive && awayPlayerGameScore && awayPlayerGameScore.value && gameScoreMap[awayPlayerGameScore.value]) || (awayPlayerGameScore && awayPlayerGameScore.value) }}
                        </td>
                      </tr>
                    </table>
                  </div>
                  <div class="team-title">
                    <!-- home player -->
                    <table>
                      <td class="current-score">
                        {{ homePlayerMainScore.value }}
                      </td>
                      <td class="current-set-score">
                        {{ homePlayerCurrentSetScore  }}
                      </td>
                      <td class="game-score">
                        {{ (!isTieBreakActive && homePlayerGameScore && homePlayerGameScore.value && gameScoreMap[homePlayerGameScore.value]) || (homePlayerGameScore && homePlayerGameScore.value) }}
                      </td>
                    </table>
                  </div>
                </template>
              </section>
            </template>

            <section class="child result-title" v-if="event.idfosporttype === 'DARTS' && !hideScores">
              <div class="team-title">
                <!-- home player -->
                <table v-if="scoringFormat">
                  <td class="current-score current-score-sets" v-if="scoringFormat === 'SETS'" style="background: red">{{ homePlayerDartsSetsScore }}</td>
                  <td class="current-score current-score-legs">{{ homePlayerDartsLegsScore }}</td>
                </table>
              </div>
              <div class="team-title">
                <!-- away player -->
                <table v-if="scoringFormat">
                  <td class="current-score current-score-sets" v-if="scoringFormat === 'SETS'">{{ awayPlayerDartsSetsScore }}</td>
                  <td class="current-score current-score-legs">{{ awayPlayerDartsLegsScore }}</td>
                </table>
              </div>
            </section>

          </section>
        </section>

      </template>

    </template>

    <section v-if="page === 'coupon'">
      <!-- {{isbig3coupon}}
      {{twoselections}} -->
      <v-flex class="names participants">
        <div class="event-info live-coupon-event clickable" :class="{'team-logos': teamLogoVisibility}" @click.stop="goToEvent(event)">
          <div v-if="isbig3coupon">
            <section class="eventTitleWrapper">
              <div class="eventTitle away live-e" v-if="awayPlayer">
                <span class="activelead dot-mobile" v-show="awayPlayer.idfosblead === event.idfosbleadactive || awayPlayer.flag1"></span>
                <div class="activelead dot" v-show="awayPlayer.idfosblead === event.idfosbleadactive || awayPlayer.flag1"></div>
                <span v-if="teamLogoVisibility" class="team-logo" :style="awayTeamLogoStyle"></span>
                <span v-if="teamLogoVisibility && mobileBigAndBelow" class="name">{{event.shortnameaway || event.participshortaway || awayPlayer.name}}</span>
                <span v-else class="name">
                  <text-highlight v-if="phraseToHighlight" :queries="phraseToHighlight">{{ ' ' + awayPlayer.name }}</text-highlight>
                  <template v-else>{{ awayPlayer.name }}</template>
                </span>
                <span class="pitcher-name" v-if="event.awaypitchername && isPitcherVisible">{{ event.awaypitchername | lowercase }}</span>
              </div>
              <div class="showResult" v-if="awayPlayerMainScore && awayPlayerCurrentSetScore !== undefined && !hideScores">
                <table>
                  <tr class="away-team" v-if="awayPlayer">
                    <td v-if="awayPlayerMainScore" class="score-value">{{ awayPlayerMainScore.value }}</td>
                    <td v-if="event.idfosporttype === 'CRICKET'" class="current-score game-score">{{ awayPlayerWicketsScore }}</td>
                    <template v-if="this.periodScoreCounterNameBySport[event.idfosporttype]">
                      <td class="current-set-score">
                        {{ awayPlayerCurrentSetScore  }}
                      </td>
                      <td class="game-score">
                        {{ (!isTieBreakActive && awayPlayerGameScore && awayPlayerGameScore.value && gameScoreMap[awayPlayerGameScore.value]) || (awayPlayerGameScore && awayPlayerGameScore.value) }}
                      </td>
                    </template>
                  </tr>
                </table>
              </div>
            </section>

            <section class="eventTitleWrapper">
                <div class="eventTitle home live-e" v-if="homePlayer">
                  <!--&lt;!&ndash; is this active player? &ndash;&gt;-->
                  <span class="activelead dot-mobile" v-show="homePlayer.idfosblead === event.idfosbleadactive || homePlayer.flag1"></span>
                  <div class="activelead dot" v-show="homePlayer.idfosblead === event.idfosbleadactive || homePlayer.flag1"></div>
                  <span v-if="teamLogoVisibility" class="team-logo" :style="homeTeamLogoStyle"></span>
                  <span v-if="teamLogoVisibility && mobileBigAndBelow" class="name">{{event.shortnamehome || event.participshorthome || homePlayer.name}}</span>
                  <span v-else class="name">
                    <text-highlight v-if="phraseToHighlight" :queries="phraseToHighlight">{{ ' ' + homePlayer.name }}</text-highlight>
                    <template v-else>{{ homePlayer.name }}</template>
                  </span>
                  <span class="pitcher-name" v-if="event.homepitchername && isPitcherVisible">{{ event.homepitchername | lowercase  }}</span>
                </div>
                <div class="showResult" v-if="homePlayerMainScore && homePlayerCurrentSetScore !== undefined && !hideScores">
                  <table>
                    <tr class="home-team" v-if="homePlayer">
                      <td v-if="homePlayerMainScore" class="score-value">{{ homePlayerMainScore.value }}</td>
                      <td v-if="event.idfosporttype === 'CRICKET'" class="current-score game-score">{{ homePlayerWicketsScore }}</td>
                      <template v-if="this.periodScoreCounterNameBySport[event.idfosporttype]">
                        <td class="current-set-score">
                          {{ homePlayerCurrentSetScore  }}
                        </td>
                        <td class="game-score">
                          {{ (!isTieBreakActive && homePlayerGameScore && homePlayerGameScore.value && gameScoreMap[homePlayerGameScore.value]) || (homePlayerGameScore && homePlayerGameScore.value) }}
                        </td>
                      </template>
                    </tr>
                  </table>
                </div>
            </section>
          </div>
          <div v-else>
            <section class="eventTitleWrapper">
                <div class="eventTitle home live-e" v-if="homePlayer">
                  <!--&lt;!&ndash; is this active player? &ndash;&gt;-->
                  <span class="activelead dot-mobile" v-show="homePlayer.idfosblead === event.idfosbleadactive || homePlayer.flag1"></span>
                  <div class="activelead dot" v-show="homePlayer.idfosblead === event.idfosbleadactive || homePlayer.flag1"></div>
                  <span v-if="teamLogoVisibility" class="team-logo" :style="homeTeamLogoStyle"></span>
                  <span v-if="teamLogoVisibility && mobileBigAndBelow" class="name">{{event.shortnamehome || event.participshorthome || homePlayer.name}}</span>
                  <span v-else class="name">
                    <text-highlight v-if="phraseToHighlight" :queries="phraseToHighlight">{{ ' ' + homePlayer.name }}</text-highlight>
                    <template v-else>{{ homePlayer.name }}</template>
                    <icon v-if="event.idfosporttype && (homePlayer.idfosblead === event.idfosbleadactive || homePlayer.flag1)"
                      :name="'icon-' + event.idfosporttype.split(' ').join('').toLowerCase()" :colorName="'blue'">
                    </icon>
                  </span>
                  <span class="pitcher-name" v-if="event.homepitchername && isPitcherVisible">{{ event.homepitchername | lowercase  }}</span>
                </div>
                <div class="showResult" v-if="homePlayerMainScore && homePlayerCurrentSetScore !== undefined && !hideScores">
                  <table>
                    <tr class="home-team" v-if="event.idfosporttype !== 'DARTS' && homePlayer">
                      <td v-if="homePlayerMainScore" class="score-value">{{ homePlayerMainScore.value }}</td>
                      <td v-if="event.idfosporttype === 'CRICKET'" class="current-score game-score">{{ homePlayerWicketsScore }}</td>
                      <template v-if="this.periodScoreCounterNameBySport[event.idfosporttype]">
                        <td class="current-set-score">{{ homePlayerCurrentSetScore }}</td>
                        <td class="game-score">
                          {{ (!isTieBreakActive && homePlayerGameScore && homePlayerGameScore.value && gameScoreMap[homePlayerGameScore.value]) || (homePlayerGameScore && homePlayerGameScore.value) }}
                        </td>
                      </template>
                    </tr>
                    <tr class="home-team" v-if="scoringFormat && event.idfosporttype === 'DARTS' && homePlayer">
                      <td class="current-score current-score-sets" v-if="scoringFormat === 'SETS'">{{ homePlayerDartsSetsScore }}</td>
                      <td class="current-score current-score-legs">{{ homePlayerDartsLegsScore }}</td>
                    </tr>
                  </table>
                </div>
            </section>

            <section class="eventTitleWrapper">
              <div class="eventTitle away live-e" v-if="awayPlayer">
                <span class="activelead dot-mobile" v-show="awayPlayer.idfosblead === event.idfosbleadactive || awayPlayer.flag1"></span>
                <div class="activelead dot" v-show="awayPlayer.idfosblead === event.idfosbleadactive || awayPlayer.flag1"></div>
                <span v-if="teamLogoVisibility" class="team-logo" :style="awayTeamLogoStyle"></span>
                <span v-if="teamLogoVisibility && mobileBigAndBelow" class="name">{{event.shortnameaway || event.participshortaway || awayPlayer.name}}</span>
                <span v-else class="name">
                  <text-highlight v-if="phraseToHighlight" :queries="phraseToHighlight">{{ ' ' + awayPlayer.name }}</text-highlight>
                  <template v-else>{{ awayPlayer.name }}</template>
                   <icon v-if="event.idfosporttype && (awayPlayer.idfosblead === event.idfosbleadactive || awayPlayer.flag1)"
                      :class="'icon-' + event.idfosporttype.split(' ').join('').toLowerCase()" :colorName="'blue'">
                    </icon>
                </span>
                <span class="pitcher-name" v-if="event.awaypitchername && isPitcherVisible">{{ event.awaypitchername | lowercase }}</span>
              </div>
              <div class="showResult" v-if="awayPlayerMainScore && awayPlayerCurrentSetScore !== undefined && !hideScores">
                <table>
                  <tr class="away-team" v-if="event.idfosporttype !== 'DARTS' && awayPlayer">
                    <td v-if="awayPlayerMainScore" class="score-value">{{ awayPlayerMainScore.value }}</td>
                    <td v-if="event.idfosporttype === 'CRICKET'" class="current-score game-score">{{ awayPlayerWicketsScore }}</td>
                    <template v-if="this.periodScoreCounterNameBySport[event.idfosporttype]">
                      <td class="current-set-score">{{ awayPlayerCurrentSetScore  }}</td>
                      <td class="game-score">
                        {{ (!isTieBreakActive && awayPlayerGameScore && awayPlayerGameScore.value && gameScoreMap[awayPlayerGameScore.value]) || (awayPlayerGameScore && awayPlayerGameScore.value) }}
                      </td>
                    </template>
                  </tr>
                  <tr class="away-team" v-if="scoringFormat && event.idfosporttype === 'DARTS' && awayPlayer">
                    <td class="current-score current-score-sets" v-if="scoringFormat === 'SETS'">{{ awayPlayerDartsSetsScore }}</td>
                    <td class="current-score current-score-legs">{{ awayPlayerDartsLegsScore }}</td>
                  </tr>
                </table>
              </div>
            </section>
          </div>
        </div>
      </v-flex>

    </section>
  </div>
</template>
<script>
  import config from '@/config'
  import Vue from 'vue'
  import MatchTimeDisplay from '@/components/sports/bettingoffer/live/matchTimeDisplay'
  import BettingOffer from '@/components/mixins/BettingOffer'
  import Branding from '@/components/mixins/Branding'
  import TeamLogo from '@/components/mixins/TeamLogo'
  import Icon from '@/components/common/Icon'
  import TextHighlight from 'vue-text-highlight'

  export default {
    name: 'live-event-info-component',

    props: [
      'event',
      'page',
      'isLive',
      'threeselections',
      'twoselections',
      'isbig3coupon',
      'couponname',
      'phrasetohighlight'
    ],

    components: {
      MatchTimeDisplay,
      Icon,
      TextHighlight
    },

    mixins: [
      BettingOffer,
      Branding,
      TeamLogo
    ],

    data () {
      return {
        periodScoreCounterNameBySport: {
          TENNIS: 'Set score'
        },
        gameScoreMap: {
          0: 0,
          1: 15,
          2: 30,
          3: 40,
          4: 'A'
        },
        collapsed: true,
        disableMainScoreForSports: ['CFLPRE', 'CFLFB'],
        showSimplePeriodName: true
      }
    },

    computed: {
      hideScores () {
        return window.ctsautoconf.HIDE_SCORES || false
      },
      teamLogos () {
        return {
          logoHome: this.event && (this.event.logohome || this.event.participlogohome),
          logoAway: this.event && (this.event.logoaway || this.event.participlogoaway)
        }
      },
      awayPlayer () {
        if (this.event.player) {
          return this.event.player.filter(player => !player.type)[0]
        } else {
          return undefined
        }
      },
      homePlayer () {
        if (this.event.player) {
          return this.event.player.filter(player => player.type)[0]
        } else {
          return undefined
        }
      },
      numberOfSets () {
        if (this.periodScoreCounterNameBySport[this.event.idfosporttype] && this.event.counter) {
          let counter = this.event.counter.filter(c => c.name === 'Best of x sets')[0]
          return (counter && counter.value) || 0
        } else {
          return undefined
        }
      },
      awayPlayerSetScore () {
        var self = this
        if (this.periodScoreCounterNameBySport[this.event.idfosporttype] && this.awayPlayer && this.awayPlayer.counters) {
          if (this.awayPlayer.score) {
            return this.awayPlayer.score
          } else {
            let counters = this.awayPlayer.counters.filter(c => c.name === this.periodScoreCounterNameBySport[this.event.idfosporttype])
            let score = []
            if (counters) {
              counters.forEach((counter) => {
                if (counter.idfosbperiod && (!self.numberOfSets || self.numberOfSets >= parseInt(counter.idfosbperiod[this.activePeriodNumberPosition]))) {
                  score.push({
                    index: counter.idfosbperiod[this.activePeriodNumberPosition],
                    scorevalue: isNaN(this.activePeriodNumber) || this.activePeriodNumber < counter.idfosbperiod[this.activePeriodNumberPosition] ? '-' : counter.value
                  })
                }
              })
            }
            return Vue._.orderBy(score, 'index', 'asc')
          }
        } else {
          return undefined
        }
      },
      awayPlayerCurrentSetScore () {
        if (this.awayPlayerSetScore && !isNaN(this.activePeriodNumber) && this.awayPlayerSetScore[this.activePeriodNumber - 1] &&
          (this.awayPlayerSetScore[this.activePeriodNumber - 1].scorevalue || this.awayPlayerSetScore[this.activePeriodNumber - 1].scorevalue === 0)) {
          return this.awayPlayerSetScore[this.activePeriodNumber - 1].scorevalue
        } else {
          return '-'
        }
      },
      homePlayerSetScore () {
        var self = this
        // There counter for sets,
        if (this.periodScoreCounterNameBySport[this.event.idfosporttype] && this.homePlayer && this.homePlayer.counters) {
          if (this.homePlayer.score) {
            return this.homePlayer.score
          } else {
            let counters = this.homePlayer.counters.filter(c => c.name === this.periodScoreCounterNameBySport[this.event.idfosporttype])
            let score = []
            if (counters) {
              counters.forEach((counter) => {
                if (counter.idfosbperiod && (!self.numberOfSets || self.numberOfSets >= parseInt(counter.idfosbperiod[this.activePeriodNumberPosition]))) {
                  score.push({
                    index: counter.idfosbperiod[this.activePeriodNumberPosition],
                    scorevalue: this.activePeriodNumber >= counter.idfosbperiod[this.activePeriodNumberPosition] ? counter.value : '-'
                  })
                }
              })
            }
            return Vue._.orderBy(score, 'index', 'asc')
          }
        } else {
          return undefined
        }
      },
      homePlayerCurrentSetScore () {
        if (this.homePlayerSetScore && !isNaN(this.activePeriodNumber) && this.homePlayerSetScore[this.activePeriodNumber - 1] &&
          (this.homePlayerSetScore[this.activePeriodNumber - 1].scorevalue || this.homePlayerSetScore[this.activePeriodNumber - 1].scorevalue === 0)) {
          return this.homePlayerSetScore[this.activePeriodNumber - 1].scorevalue
        } else {
          return '-'
        }
      },
      awayPlayerMainScore () {
        // No counter for sets, so I will use Main counter
        if (this.awayPlayer && this.awayPlayer.counters && this.disableMainScoreForSports.indexOf(this.event.idfosport) === -1) {
          return this.awayPlayer.counters.filter(counter => counter.ismain)[0] || undefined
        } else {
          return undefined
        }
      },
      homePlayerMainScore () {
        if (this.homePlayer && this.awayPlayer.counters && this.disableMainScoreForSports.indexOf(this.event.idfosport) === -1) {
          return this.homePlayer.counters.filter(counter => counter.ismain)[0] || undefined
        } else {
          return undefined
        }
      },
      awayPlayerGameScore () {
        if (this.event.idfosporttype === 'TENNIS' && this.awayPlayer && this.awayPlayer.counters) {
          let gameScore = this.awayPlayer.counters.filter(c => c.name === 'Game score')[0]

          return gameScore || undefined
        } else {
          return undefined
        }
      },
      homePlayerGameScore () {
        if (this.event.idfosporttype === 'TENNIS' && this.homePlayer && this.homePlayer.counters) {
          let gameScore = this.homePlayer.counters.filter(c => c.name === 'Game score')[0]

          return gameScore || undefined
        } else {
          return undefined
        }
      },
      // CRICKET
      awayPlayerWicketsScore () {
        if (this.awayPlayer && this.awayPlayer.counters) {
          let score = this.awayPlayer.counters.find(c => c.name === 'Total wickets Game')

          return (score.toString() && score.value.toString()) || undefined
        } else {
          return undefined
        }
      },
      homePlayerWicketsScore () {
        if (this.homePlayer && this.homePlayer.counters) {
          let score = this.homePlayer.counters.find(c => c.name === 'Total wickets Game')

          return (score.toString() && score.value.toString()) || undefined
        } else {
          return undefined
        }
      },
      // DARTS
      awayPlayerDartsSetsScore () {
        if (this.event.idfosporttype === 'DARTS' && this.awayPlayer && this.awayPlayer.counters) {
          let score = this.awayPlayer.counters.find(c => c.name === 'No of sets won')
          return score && score.value
        } else {
          return undefined
        }
      },
      homePlayerDartsSetsScore () {
        if (this.event.idfosporttype === 'DARTS' && this.homePlayer && this.homePlayer.counters) {
          let score = this.homePlayer.counters.find(c => c.name === 'No of sets won')

          return score && score.value
        } else {
          return undefined
        }
      },
      awayPlayerDartsLegsScore () {
        if (this.event.idfosporttype === 'DARTS' && this.awayPlayer && this.awayPlayer.counters) {
          let score = this.awayPlayer.counters.find(c => c.name === 'No of legs won')

          return score && score.value
        } else {
          return undefined
        }
      },
      homePlayerDartsLegsScore () {
        if (this.event.idfosporttype === 'DARTS' && this.homePlayer && this.homePlayer.counters) {
          let score = this.homePlayer.counters.find(c => c.name === 'No of legs won')

          return score && score.value
        } else {
          return undefined
        }
      },
      activePeriodNumber () {
        if (this.event && this.event.idfosbactiveperiod) {
          return this.event.idfosporttype === 'BASKETBALL' && (this.event.idfosbactiveperiod === 'BBLEOT' || this.event.idfosbactiveperiod === 'BBLEHT' || this.event.idfosbactiveperiod === 'BBLNOT')
            ? 4
            : this.event.idfosbactiveperiod[this.activePeriodNumberPosition]
        } else {
          return 0
        }
      },
      activePeriodNumberPosition () {
        return this.event.idfosporttype === 'BASKETBALL' ? 4 : 3
      },
      activePeriodName () {
        let periodName = ''

        if (this.event) {
          const originalPeriodName = (this.event.period && this.event.period.name) || this.event.activeperiodname
          const hasValidPeriodNumber = this.activePeriodNumber > 0 && /\d/.test(originalPeriodName)
          const upperCasedName = originalPeriodName.toUpperCase()
          const hasHalf = upperCasedName.indexOf('HALF') > -1
          const hasQuarter = upperCasedName.indexOf('QUARTER') > -1

          if (this.showSimplePeriodName && hasValidPeriodNumber && (hasHalf || hasQuarter)) {
            const simplePeriodName = hasHalf ? 'H' : 'Q'
            periodName = `${simplePeriodName}${this.activePeriodNumber}`
          } else {
            periodName = originalPeriodName
          }
        }

        return periodName
      },
      isTieBreakActive () {
        if (this.event.idfosporttype === 'TENNIS' && this.event.counter) {
          let counter = this.event.counter.filter(c => c.name === 'Tie-break active')[0]
          return (counter && (parseInt(counter.value) === 1))
        } else {
          return false
        }
      },
      matchTimer () {
        return this.event.timers && this.event.timers.find(t =>
          t.timername === 'MATCH' &&
          t.idfosbperiod === this.event.idfosbactiveperiod &&
          t.isactive)
      },
      scoringFormat () {
        return this.event.idfosbscoringformat || (this.event.display && this.event.display.scoringformat) || undefined
      },
      isPitcherVisible () {
        return !config.app.autoconf.HIDE_PITCHER_NAME
      },
      phraseToHighlight () {
        return this.phrasetohighlight
      },
      isNonBig3FoSportType () {
        return config.app.autoconf.BIG3_IGNORE_SPORTTYPES.includes(this.event.idfosporttype)
      }
    },
    filters: {
      formatMinutesWithSeconds (value) {
        return `${value.toString().padStart(2, '0')}:00`
      }
    }
  }
</script>
<style lang="stylus" scoped>

  @import '~@/css/config'
  @import '~@/css/mixins'
  $image-base-url = '~@/assets/images/icons/svg/'

    .parent
      display flex
      justify-content space-between
      width 100%
      font-weight normal
      font-size 20px
      line-height 23px
      padding 0

    .child-left
      align-self center
      margin-bottom 0
      text-align left
      flex 12

    .child-right
      display flex
      margin-bottom 0

      .result-title.main-score
        margin-bottom 20px


     .live-badge
       align-self center
       margin-bottom 20px

    .live-badge span
      flex 1
      padding 4px 12px
      border-radius 3px
      color #fff
      background-color #DB3F3F

      /*border 1px solid coral*/

    .time-period
      padding-left 10px
      color #fff
      align-self center
      margin-bottom 20px
      text-align right
      padding-right 10px
      font-size 20px
      font-weight normal
      line-height 23px

    .time-display
      flex 1
      color #fff
      margin-bottom 20px
      align-self center

    .team-title
      flex 2
      color #fff
      min-height 50px

    .dot
      position relative
      &:after
        content "\A"
        border-style solid
        border-width 7px 12px 7px 12px
        border-color transparent #DB3F3F transparent  transparent
        position absolute
        left 60px
        bottom 3px
        transform scale(0.6)

    .eventTitleWrapper
      .dot
        right -100px

  .live-navigation .sport-icon {
    display: none
  }

  .event-info
    cursor default

  .eventmarketgroup-name
    cursor: pointer;
    border: solid 1px #ccc;
    padding: 8px;

  .tab
    border: solid 1px #999;
    padding: 5px;
    margin: 5px;
    cursor: pointer;

  .parent
    display flex;
    flex-flow row nowrap;
    height 100%;
    /*padding-top 20px*/



  .result-title
    color #fff
    align-self center
    font-size 20px
    font-weight bold
    line-height 23px
    /*padding-right 20px*/


  .live-details
    font-family Arial
    font-weight bold
    color #000
    font-size 10px
    line-height 12px
    display block
    text-align center
    cursor pointer

  .live-data
    background-color #4F4F4F
    color #fff
    width 100%
    height 200px
    text-align center
    line-height 200px

  .competition-name
    display block
    font-family Arial
    font-weight bold
    color #828282
    font-size 14px
    line-height 16px

  @media mobile-big-and-below

    .time-period
      font-size 14px
    .current-main-score
      height 32px
      font-size 12px
      text-align center
    .current-score
      font-size 12px
      // line-height 1px
      text-align center
    .live-details
      display none
    .competition-name
      margin-bottom 0px
    .competition-name
      display none
  .eventTitleWrapper
    .eventTitle
      .pitcher-name
        font-size 12px
        text-transform capitalize
        color #828e95
        line-height 0
        display: block
        margin-top: -8px
    .showResult
      white-space nowrap
      font-weight 600
      font-size 12px
      color #000
      margin-top 10px
      margin-bottom 12px
      margin-left 5px
      min-width 26px
      height 22px
      .score-value,
      .current-set-score,
      .game-score
        padding 1px
        //width 26px
        text-align center
 .live-coupon-event
  .eventTitleWrapper
    position relative
    margin-right 12px !important
    @media mobile-big-and-below
      margin-right 8px !important
    .eventTitle
      .activelead.dot
        position absolute
        left -34px
        top 3px
        &:after
          transform: scale(-0.6)
          top: 11px
          left: 14px
      .activelead.dot-mobile
        position absolute
        left -34px
        top 0
        &:after
          border-color transparent #DB3F3F transparent  transparent
          transform: scale(-0.4)
          top: 11px
          left: 8px

    .showResult
      border 0px
      background #f2f2f2
      border-radius 0px
      color #000
    .activelead.dot
    .activelead.dot-mobile
      display none

  .activePlayer
    display inline
    padding-left 5px

@media mobile-big-and-below
  .dot
    display none

  .dot-mobile
    position relative
    &:after
      content "\A"
      border-style solid
      border-width 10px 20px 10px 15px
      border-color transparent  transparent  transparent #fff
      position absolute
      left -27px
      bottom 0px
      transform scale(0.6)

  .team-title
    font-size 14px
    line-height 16px
    min-height 32px

.event-info
  display: block
  min-width 0
  .event-info
    .eventTitleWrapper
      display flex
      justify-content: space-between
      .eventTitle
        display block
        color #000
        overflow hidden
        text-overflow ellipsis
        white-space nowrap
        .name
          height 40px !important
          line-height 43px
          font-size 14px
      .showResult
        table
          td
            text-align center
  &.threeselections
    .event-info
      .eventTitleWrapper
        height: 26px
        line-height: 24px
        .eventTitle
          .name
            line-height 0
        .showResult
            margin-top 0px
            margin-bottom 10px
          table
            line-height 20px
            td
              padding 0px
  &.big3-event
    background red
  &.big-three
     .event-info
      .eventTitleWrapper
        .eventTitle
          .name
             @media mobile-big-and-below
              white-space normal
              width 95px
              line-height normal
              display flex
              align-items center
.TENNIS.event .eventTitleWrapper .score-value,
.TENNIS.event .eventTitleWrapper .current-set-score
  width 20px
  padding 0px
  &:after
    content "-"
    font-size 14px
    position relative
    display inline
    left 20%
.TENNIS .event-info .event-info .eventTitleWrapper .showResult table td
  vertical-align unset
  text-align center
.TENNIS.event .eventTitleWrapper .game-score
  width 20px
.SOCCER.event .eventTitleWrapper
  border-bottom none
  .showResult
    margin-top 3px
    margin-bottom 2px
  .score-value
    padding 1px
.DARTS.event .eventTitleWrapper .current-score-sets,
.CRICKET.event .eventTitleWrapper .score-value
  text-align center
  width 30px
  &:after
    content "-"
    font-size 14px
    position relative
    display inline
    left 30%
.DARTS.event .eventTitleWrapper .current-score-legs,
.CRICKET.event .eventTitleWrapper .score-value
  width 30px
.CRICKET.event .eventTitleWrapper .game-score
  text-align center
  width 30px
  &:before
    content "-"
    font-size 14px
    position relative
    display inline
    right 25%
.DARTS .event-info .event-info .eventTitleWrapper .showResult table td,
.CRICKET .event-info .event-info .eventTitleWrapper .showResult table td
  vertical-align unset
  padding unset
  text-align center
.GOLF.event .eventTitleWrapper,
.MOTORSPORT.event .eventTitleWrapper,
.NASCAR.event .eventTitleWrapper
  .showResult
    display none
.current-main-score .current-score,
.current-main-score .current-score-wicket
  min-width 35px
  text-align center !important
  padding 0px
.info-markets-container
  &.GOLF,
  &.MOTORSPORT,
  &.NASCAR
    .showResult
      display none

.clickable
  cursor pointer
.live_header
  display flex
  justify-content space-between
  padding 0px
  @media mobile-big-and-below
    padding 0
  .time-period
    text-align left
    margin-bottom 0px
    font-size 16px
    color #96C3E9
    padding-left 0
  .time-display
    margin-bottom 0px
    font-size 16px
    color #96C3E9
    &:before
      content '-'
      color #96C3E9
      padding-right 10px
</style>
