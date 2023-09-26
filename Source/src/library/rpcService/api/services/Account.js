import helpers from '@/library/rpcService/api/helpers'
export default {
  overrideRequest: function (axiosConfig) {

  },

  setmmlmaccountlimit: {
    overrideRequest: function (axiosConfig) {
      axiosConfig.method = 'post'
    }
  },
  getsuggestedbonus: {
    overrideRequest: function (axiosConfig) {
      axiosConfig.method = 'post'
    }
  },
  registerbanktransfer: {
    overrideRequest: function (axiosConfig) {
      axiosConfig.method = 'post'
      axiosConfig.transformRequest = [(params, headers) => {
        if (params.bankTransfer) {
          let bankTransfer = params.bankTransfer
          delete params.bankTransfer

          Object.assign(params, bankTransfer)
        }

        return helpers.axiosTransformRequestHandler(params, headers)
      }]
    }
  },
  getrbwrequest: {
    overrideRequest: function (axiosConfig) {
      axiosConfig.method = 'post'
    }
  },
  completerbwrequest: {
    overrideRequest: function (axiosConfig) {
      axiosConfig.method = 'post'
    }
  },
  canceltransaction: {
    overrideRequest: (axiosConfig) => {
      axiosConfig.method = 'post'
    }
  },
  setcustomertimelimits: {
    overrideRequest: (axiosConfig) => {
      axiosConfig.method = 'post'
    }
  },
  setcustomertimelimit: {
    overrideRequest: (axiosConfig) => {
      axiosConfig.method = 'post'
    }
  }
}
