export default {
  overrideRequest: function (axiosConfig) {

  },
  verifytotpfactorasync: {
    overrideRequest: function (axiosConfig) {
      axiosConfig.method = 'post'
    }
  },
  createtotpfactoruserpassasync: {
    overrideRequest: function (axiosConfig) {
      axiosConfig.method = 'post'
    }
  },
  verifytotpfactoruserpassasync: {
    overrideRequest: function (axiosConfig) {
      axiosConfig.method = 'post'
    }
  }
}
