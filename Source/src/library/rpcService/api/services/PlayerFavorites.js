export default {
  overrideRequest: function (axiosConfig) {

  },
  setfavorites: {
    overrideRequest: function (axiosConfig) {
      axiosConfig.method = 'post'
    }
  },
  resetfavorites: {
    overrideRequest: function (axiosConfig) {
      axiosConfig.method = 'post'
    }
  }
}
