export default {
  overrideRequest: function (axiosConfig) {

  },

  calculatebetslip: {
    overrideRequest: function (axiosConfig) {
      axiosConfig.method = 'post'
    }
  },
  placetgatebetslip: {
    overrideRequest: function (axiosConfig) {
      axiosConfig.method = 'post'
    }
  },
  getcustomerregisterbu: {
    overrideRequest: function (axiosConfig) {
      axiosConfig.method = 'post'
    }
  }
}
