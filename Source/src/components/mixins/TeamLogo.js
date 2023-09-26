import Url from '@/components/mixins/Url'
import config from '@/config'

export default {
  mixins: [
    Url
  ],

  computed: {
    teamLogoVisibility () {
      return Boolean(config.app.autoconf.SHOW_TEAM_LOGOS && (this.teamLogos.logoHome || this.teamLogos.logoAway || this.teamLogos.logo))
    },

    awayTeamLogoStyle () {
      return this.teamLogoVisibility ? this.styleObject(this.teamLogos.logoAway) : {}
    },

    homeTeamLogoStyle () {
      return this.teamLogoVisibility ? this.styleObject(this.teamLogos.logoHome) : {}
    },

    teamLogoStyle () {
      return this.teamLogoVisibility ? this.styleObject(this.teamLogos.logo) : {}
    }
  },

  methods: {
    teamLogoPath (filename) {
      var path = ''

      if (filename) {
        let mediaHostName = this.mediaServer()
        filename = filename.trim()

        if (mediaHostName && mediaHostName[mediaHostName.length - 1] === '/') {
          mediaHostName = mediaHostName.slice(0, -1)
        }

        if (filename && filename[0] === '/') {
          filename = filename.slice(1)
        }

        path = mediaHostName + '/' + encodeURI(filename)
      }

      return path
    },

    styleObject (filename) {
      return filename ? { backgroundImage: 'url(' + this.teamLogoPath(filename) + ')' }
      : {}
    }
  },

  created () {

  }
}
