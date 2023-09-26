<template>
<div>
    <div id="sr-widget" :class="{'bertadar-event-id': !!betradarid}">
      <loader id="loader"></loader>
    </div>
</div>
</template>
<!--adding a classh .live to the widget wrapper div (#sr-widget) when the game is live,
so we can give the color green to the game time (Sportsradar doesn't give different classes if the game is live)-->
<script>
  import Loader from '@/components/common/Loader'
  import store from '@/store'
  /* eslint-disable */

  export default {
  name: 'pre-match-bet-radar',
  components: {
    Loader
  },

  props: [
    'betradarid',
    'isLive'
  ],

  data () {
    return {}
  },

  computed: {
    event() {
      return store.getters['eventState/getEvent']
    },
    betRadarId2() {
      if (this.event) {
        if (this.event.extevents) {
          return (this.event.extevents[0].idefevent.split('_'))[1]
        } else if (this.event.idextevent) {
          return (this.event.idextevent.split('_'))[1]
        }
      }
    }
  },
  methods: {
  },

  mounted () {
    return new Promise((resolve, reject) => {
      (function (a, b, c, d, e, f, g, h, i) {
        a[e] || (i = a[e] = function () {
            (a[e].q = a[e].q || []).push(arguments)
          }, i.l = 1 * new Date, i.o = f,
            g = b.createElement(c), h = b.getElementsByTagName(c)[0], g.async = 1, g.src = d, g.setAttribute('n', e), h.parentNode.insertBefore(g, h)
        )
      })(window, document, 'script', 'https://widgets.sir.sportradar.com/ae7c3a9dd5992ede7ae9d6684c21512f/widgetloader', 'SIR', {
        language: 'en',
        theme: 'betradardark',
        clockType: '12',
        matchId: this.betRadarId2, //

        // matchId: '14893951', // Soccer
        // matchId: '14429108', //Basketball
        // matchId: '14637647', //Ice Hockey

      });

      SIR('addWidget', '#sr-widget', 'match.lmtplus', {
        layout: 'single',
        scoreboard: 'extended',
        momentum: 'extended',
        collapseTo: 'momentum',
        tabsPosition: 'top',
        disableWidgetHeader: true,
      })

    })
  }
}
</script>
