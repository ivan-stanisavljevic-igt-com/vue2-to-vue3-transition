export default {
  overrideRequest: function (axiosConfig) {

  },
  validategeolocation: {
    overrideRequest: function (axiosConfig) {
      axiosConfig.method = 'post'
    }
  },
  validategeolocationcountry: {
    overrideRequest: function (axiosConfig) {
      axiosConfig.method = 'post'
    }
  },
  loggeolocfailedrequest: {
    overrideRequest: function (axiosConfig) {
      axiosConfig.method = 'post'
    }
  }
}
