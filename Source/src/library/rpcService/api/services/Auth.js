export default {
  overrideRequest: function (axiosConfig) {

  },

  login: {
    overrideRequest: function (axiosConfig) {
      axiosConfig.method = 'post'
    }
  },

  refreshtoken: {
    overrideRequest: function (axiosConfig) {
      axiosConfig.refreshToken = true
    }
  },
  loginsa: {
    overrideRequest: function (axiosConfig) {
      axiosConfig.method = 'post'
    }
  },
  login2fa: {
    overrideRequest: function (axiosConfig) {
      axiosConfig.method = 'post'
    }
  }
}
