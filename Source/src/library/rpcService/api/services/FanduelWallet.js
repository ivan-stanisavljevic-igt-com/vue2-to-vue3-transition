export default {
  overrideRequest: function (axiosConfig) {

  },

  submitgeocomplypacket: {
    overrideRequest: function (axiosConfig) {
      axiosConfig.method = 'post'
    }
  },

  getnewgeocomplylicense: {
    overrideRequest: function (axiosConfig) {
      axiosConfig.method = 'post'
    }
  }
}
