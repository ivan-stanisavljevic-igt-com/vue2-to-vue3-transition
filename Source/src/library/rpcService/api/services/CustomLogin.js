let CustomLoginServiceName = 'customlogin'

export default {
  overrideRequest: function (axiosConfig) {

  },

  login: {
    overrideRequest: function (axiosConfig) {
      axiosConfig.method = 'post'
      axiosConfig.url = axiosConfig.url.replace(CustomLoginServiceName, 'auth')
    }
  }
}
