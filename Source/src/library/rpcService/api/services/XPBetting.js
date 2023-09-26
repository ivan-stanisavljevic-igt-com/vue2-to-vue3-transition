export default {
  overrideRequest: function (axiosConfig) {

  },

  getcalculation: {
    overrideRequest: function (axiosConfig) {
      axiosConfig.method = 'post'
    }
  },

  getcalculationxp: {
    overrideRequest: function (axiosConfig) {
      axiosConfig.method = 'post'
    }
  },

  getcalculationxpasync: {
    overrideRequest: function (axiosConfig) {
      axiosConfig.method = 'post'
    }
  },

  getxp: {
    overrideRequest: function (axiosConfig) {
      axiosConfig.method = 'post'
    }
  },

  placebets: {
    overrideRequest: function (axiosConfig) {
      axiosConfig.method = 'post'
    }
  },

  placebetsasync: {
    overrideRequest: function (axiosConfig) {
      axiosConfig.method = 'post'
    }
  }
}
