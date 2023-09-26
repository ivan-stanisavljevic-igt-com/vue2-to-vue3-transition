export default {
  overrideRequest: function (axiosConfig) {

  },

  initiatelink: {
    overrideRequest: function (axiosConfig) {
      axiosConfig.method = 'post'
    }
  },
  confirmlink: {
    overrideRequest: function (axiosConfig) {
      axiosConfig.method = 'post'
    }
  },
  updatesubscriberpreferences: {
    overrideRequest: function (axiosConfig) {
      axiosConfig.method = 'post'
    }
  },
  getcategoriesapplicabletochannel: {
    overrideRequest: function (axiosConfig) {
      axiosConfig.method = 'post'
    }
  },
  getofferforcategory: {
    overrideRequest: function (axiosConfig) {
      axiosConfig.method = 'post'
    }
  },
  hasactivepreferences: {
    overrideRequest: function (axiosConfig) {
      axiosConfig.method = 'post'
    }
  },
  updatepreferences: {
    overrideRequest: function (axiosConfig) {
      axiosConfig.method = 'post'
    }
  },
  resettodefaults: {
    overrideRequest: function (axiosConfig) {
      axiosConfig.method = 'post'
    }
  }
}
