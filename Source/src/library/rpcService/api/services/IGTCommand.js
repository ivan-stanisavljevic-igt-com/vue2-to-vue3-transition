let IGTCommandServiceName = 'igtcommand'

export default {
  overrideRequest: function (axiosConfig) {

  },

  changepasswordwithtoken: {
    overrideRequest: function (axiosConfig) {
      axiosConfig.method = 'post'
    }
  },

  checkgeolocation: {
    overrideRequest: function (axiosConfig) {
      axiosConfig.method = 'post'
    }
  },

  getlicence: {
    overrideRequest: function (axiosConfig) {
      axiosConfig.method = 'post'
    }
  },

  getnotifications: {
    overrideRequest: function (axiosConfig) {
      axiosConfig.method = 'post'
    }
  },

  getsecurityquestions: {
    overrideRequest: function (axiosConfig) {
      axiosConfig.method = 'post'
    }
  },

  gettransactionhistory: {
    overrideRequest: function (axiosConfig) {
      axiosConfig.method = 'post'
    }
  },

  login: {
    overrideRequest: function (axiosConfig) {
      axiosConfig.method = 'post'
      axiosConfig.url = axiosConfig.url.replace(IGTCommandServiceName, 'auth')
    }
  },

  refreshtoken: {
    overrideRequest: function (axiosConfig) {
      axiosConfig.refreshToken = true
    }
  },

  logout: {
    overrideRequest: function (axiosConfig) {
      axiosConfig.url = axiosConfig.url.replace(IGTCommandServiceName, 'auth')
    }
  },

  passwordchange: {
    overrideRequest: function (axiosConfig) {
      axiosConfig.method = 'post'
    }
  },

  register: {
    overrideRequest: function (axiosConfig) {
      axiosConfig.method = 'post'
    }
  },

  resetpassword: {
    overrideRequest: function (axiosConfig) {
      axiosConfig.method = 'post'
    }
  },

  unsubscribenotifications: {
    overrideRequest: function (axiosConfig) {
      axiosConfig.method = 'post'
    }
  },

  updatedepositlimits: {
    overrideRequest: function (axiosConfig) {
      axiosConfig.method = 'post'
    }
  },

  updatenotificationpreferences: {
    overrideRequest: function (axiosConfig) {
      axiosConfig.method = 'post'
    }
  },

  updatepersonalinfo: {
    overrideRequest: function (axiosConfig) {
      axiosConfig.method = 'post'
    }
  },

  updateprofiledetails: {
    overrideRequest: function (axiosConfig) {
      axiosConfig.method = 'post'
    }
  },

  updatesessionlimits: {
    overrideRequest: function (axiosConfig) {
      axiosConfig.method = 'post'
    }
  },

  winningtransaction: {
    overrideRequest: function (axiosConfig) {
      axiosConfig.method = 'post'
    }
  }
}
