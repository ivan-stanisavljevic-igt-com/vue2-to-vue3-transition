export default {
  computed: {

  },

  methods: {
    mediaServer (path) {
      var mediaHostName = window.ctsautoconf.MEDIA_CONTENT_HOSTNAME

      if (mediaHostName) {
        var absolutePath = (mediaHostName.indexOf('http://') > -1 || mediaHostName.indexOf('https://') > -1) ? mediaHostName : '//' + mediaHostName
      }

      if (path) {
        var result = ''
        if (path.indexOf('http://') > -1 || path.indexOf('https://') > -1) {
          result = path
          return result
        }
        if (mediaHostName) {
          result = absolutePath + path
          return result
        }
      } else {
        if (mediaHostName) {
          return absolutePath
        } else {
          return ''
        }
      }
      return path
    },
    mediaServerHostname () {
      var mediaHostName = window.ctsautoconf.MEDIA_CONTENT_HOSTNAME
      if (mediaHostName) {
        var path = (mediaHostName.indexOf('http://') > -1 || mediaHostName.indexOf('https://') > -1) ? mediaHostName : '//' + mediaHostName
        return path
      }
      return ''
    }
  },

  created () {

  }
}
