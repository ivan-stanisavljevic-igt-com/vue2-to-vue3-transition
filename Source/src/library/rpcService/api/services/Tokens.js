export default {
  overrideRequest: function (axiosConfig) {

  },

  refreshtoken: {
    overrideRequest: function (axiosConfig) {
      axiosConfig.refreshToken = true
    }
  }
}
