export default {
  overrideRequest: function (axiosConfig) {

  },
  registercontestentry: {
    overrideRequest: function (axiosConfig) {
      axiosConfig.method = 'post'
    }
  },
  placepick: {
    overrideRequest: function (axiosConfig) {
      axiosConfig.method = 'post'
    }
  },
  cancelpick: {
    overrideRequest: function (axiosConfig) {
      axiosConfig.method = 'post'
    }
  },
  cancelroundpicks: {
    overrideRequest: function (axiosConfig) {
      axiosConfig.method = 'post'
    }
  },
  cancelandplacepick: {
    overrideRequest: function (axiosConfig) {
      axiosConfig.method = 'post'
    }
  }
}
