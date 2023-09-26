import helpers from '@/library/rpcService/api/helpers'
import api from '@/library/rpcService/api'
let UserServiceName = 'user'

export default {
  overrideRequest: function (axiosConfig) {

  },

  login: {
    overrideRequest: function (axiosConfig) {
      axiosConfig.method = 'post'
      axiosConfig.url = axiosConfig.url.replace(UserServiceName, 'auth')
    }
  },

  logout: {
    overrideRequest: function (axiosConfig) {
      axiosConfig.method = 'get'
      axiosConfig.url = axiosConfig.url.replace(UserServiceName, 'auth')
    }
  },
  updatepersonaldetails: {
    overrideRequest: function (axiosConfig) {
      axiosConfig.method = 'post'
      axiosConfig.transformRequest = [(params, headers) => {
        if (params.personalDetails) {
          let personalDetails = params.personalDetails
          delete params.personalDetails

          Object.assign(params, personalDetails)
        }

        return helpers.axiosTransformRequestHandler(params, headers)
      }]
    }
  },
  setpassword: {
    overrideRequest: function (axiosConfig) {
      axiosConfig.method = 'post'
    }
  },
  setplayerprotection: {
    overrideRequest: function (axiosConfig) {
      axiosConfig.method = 'post'
    }
  },
  refreshtoken: {
    overrideRequest: function (axiosConfig) {
      axiosConfig.method = 'post'
      api.attachParams(axiosConfig, {
        client_id: 'web',
        client_secret: '',
        refresh_token: helpers.getToken('refresh')
      })
      axiosConfig.url = axiosConfig.url.replace(UserServiceName, 'auth')
    }
  },
  gettsandcstext: {
    overrideRequest: function (axiosConfig) {
      axiosConfig.method = 'post'
    }
  },
  registercustomer: {
    overrideRequest: function (axiosConfig) {
      axiosConfig.method = 'post'
    }
  },
  closeaccountbycustomer: {
    overrideRequest: function (axiosConfig) {
      axiosConfig.method = 'post'
    }
  },
  getcustomerpreferences: {
    overrideRequest: function (axiosConfig) {
      axiosConfig.method = 'post'
    }
  },
  setcustomerpreferences: {
    overrideRequest: function (axiosConfig) {
      axiosConfig.method = 'post'
    }
  }
}
