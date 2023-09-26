import config from '@/config'

export default {
  computed: {

    brandKey () {
      return config.app.BRAND
    },
    brandLayout () {
      var brand = config.app.BRAND
      if (brand.indexOf('generic-') > -1) {
        brand = brand.split('-')
        return brand[0]
      } else if (brand === 'igt') {
        return 'generic'
      } else {
        return ''
      }
    }
  },

  methods: {
  },

  mounted () {
  }
}
