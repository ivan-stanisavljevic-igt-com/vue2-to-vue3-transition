const externalWalletUrl = window.ctsautoconf && window.ctsautoconf.EXTERNAL_WALLET_URL
const geocomplyURL = window.ctsautoconf && window.ctsautoconf.GEOCOMPLY_URL
const walletProvider = window.ctsautoconf.WALLET_PROVIDER

let providerLogin, providerResetPassword, providerRegistration, providerAddFunds, providerWithdraw, providerResponsibleGaming, providerContact, providerTermsAndConditions

switch (walletProvider) {
  case 'GAN':
    providerRegistration = `${externalWalletUrl}newRegistration.shtml`
    providerResetPassword = `${externalWalletUrl}forgotPassword.do`
    providerAddFunds = `${externalWalletUrl}depositMoney.do`
    providerWithdraw = `${externalWalletUrl}withdrawCash.do`
    providerResponsibleGaming = `${externalWalletUrl}responsible-gaming.shtml`
    providerContact = `${externalWalletUrl}contact-us.shtml`
    providerTermsAndConditions = `${externalWalletUrl}viewTerms.do`
    break
  case 'FD':
    providerLogin = `${externalWalletUrl}login`
    providerRegistration = `${externalWalletUrl}join`
    providerResetPassword = `${externalWalletUrl}`
    providerAddFunds = `${externalWalletUrl}account/deposit`
    providerWithdraw = `${externalWalletUrl}withdrawals`
    providerResponsibleGaming = `${externalWalletUrl}`
    providerContact = `${externalWalletUrl}`
    providerTermsAndConditions = `${externalWalletUrl}`
    break
  case 'HALLEY':
    providerLogin = `${externalWalletUrl}login`
    providerRegistration = `${externalWalletUrl}join`
    providerResetPassword = `${externalWalletUrl}`
    providerAddFunds = `${externalWalletUrl}account/deposit`
    providerWithdraw = `${externalWalletUrl}withdrawals`
    providerResponsibleGaming = `${externalWalletUrl}`
    providerContact = `${externalWalletUrl}`
    providerTermsAndConditions = `${externalWalletUrl}`
    break
  case 'SHW':
    // providerLogin = `${externalWalletUrl}login`
    providerRegistration = `/account/joinUs`
    providerResetPassword = `/account/reset-password`
    providerAddFunds = `/account/add-funds`
    providerWithdraw = `/account/withdraw`
    // providerResponsibleGaming = `${externalWalletUrl}`
    // providerContact = `${externalWalletUrl}`
    // providerTermsAndConditions = `${externalWalletUrl}`
    break
}

export default {
  login: providerLogin,
  resetPassword: providerResetPassword,
  registration: providerRegistration,
  addFunds: providerAddFunds,
  withdraw: providerWithdraw,
  responsibleGaming: providerResponsibleGaming,
  contact: providerContact,
  geocomplyURL: geocomplyURL,
  installIosApp: '',
  installAndroidApp: '',
  termsAndConditions: providerTermsAndConditions
}
