export default {
  overrideRequest: function (axiosConfig) {

  },

  gethistorybets: {
    overrideRequest: function (axiosConfig) {
      axiosConfig.method = 'post'
    }
  },

  gethistorybetsbb: {
    overrideRequest: function (axiosConfig) {
      axiosConfig.method = 'post'
    }
  },

  getteasers: {
    overrideRequest: function (axiosConfig) {
      axiosConfig.method = 'post'
    }
  },
  gethistorytransactions: {
    overrideRequest: function (axiosConfig) {
      axiosConfig.method = 'post'
    }
  },
  getpendingtransactions: {
    overrideRequest: (axiosConfig) => {
      axiosConfig.method = 'post'
    }
  },
  getresponsiblegaminghistory: {
    overrideRequest: (axiosConfig) => {
      axiosConfig.method = 'post'
    }
  }
}
