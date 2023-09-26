let GanWalletServiceName = 'ganwallet'

export default {
  overrideRequest: function (axiosConfig) {

  },

  login: {
    overrideRequest: function (axiosConfig) {
      axiosConfig.method = 'post'
      axiosConfig.url = axiosConfig.url.replace(GanWalletServiceName, 'auth')
    }
  },

  logout: {
    overrideRequest: function (axiosConfig) {
      axiosConfig.url = axiosConfig.url.replace(GanWalletServiceName, 'auth')
    }
  },

  completechallenge: {
    overrideRequest: function (axiosConfig) {
      axiosConfig.method = 'post'
    }
  },

  refreshsession: {
    overrideRequest: function (axiosConfig) {
      axiosConfig.refreshToken = true
    }
  }
}
