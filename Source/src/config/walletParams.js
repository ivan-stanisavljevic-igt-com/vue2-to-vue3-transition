const walletProvider = window.ctsautoconf.WALLET_PROVIDER
const state = window.ctsautoconf.STATE
const brand = window.ctsautoconf.BRAND
const plc = window.ctsautoconf.GEOCOMPLY_PLUGIN

var providerCode, providerEWbalances, providerEWbalancesCash, providerEWbalancesBonus, providerServiceName, geoComplyCustomField, customFieldKey, geocomplyPluginVersion, logout, userServiceLogin, userServiceLogout
var installerURL = plc || 'stg-ums.geocomply.net' // for production - ums.geocomply.com
var installerKey = 'MnRfsHYOmM' // IGT as default US7 env

switch (state) {
  case 'NJ':
    if (brand === 'sb') installerKey = 'tzp2cb0Jx2'
    break
  case 'PA':
    installerKey = 'QnEkBJRFBy'
    break
  case 'WV':
    if (brand === 'dn' || brand === 'dnw') installerKey = 'V1PdMSkBsf'
    break
  case 'IA':
    if (brand === 'qcasino') installerKey = 'uqpUxwP3Oa'
    if (brand === 'sb') installerKey = '5vfwbE5KX1'
    break
  case 'IL':
    if (brand === 'circa') installerKey = 'ykwG0zAF3x'
    break
  case 'NV':
    if (brand === 'boyd') installerKey = 'm41lXY8r2P'
    if (brand === 'rw') installerKey = '0fWeA6elHd'
    break
  case 'CO':
    if (brand === 'circa') installerKey = '2DSuzQyfYP'
    if (brand === 'sb') installerKey = '8AyQvlNunL'
    if (brand === 'mav') installerKey = 'PmJzUkzW9R'
    break
  case 'AZ':
    if (brand === 'generic-coyotes') installerKey = 'avh91k7Xmz'
    if (brand === 'sb') installerKey = 'Lnbvk3YVxh'
    break
  case 'TN':
    if (brand === 'sb') installerKey = 'DCHWC2zVGK'
    break
  case 'RI':
    if (brand === 'generic-rilot') installerKey = 'nGw7e3it4B'
    break
  case 'VA':
    if (brand === 'sb') installerKey = 'CTfuHHzS2M'
    break
}

switch (walletProvider) {
  case 'GAN':
    providerServiceName = 'ExternalWalletService'
    providerEWbalancesCash = 'CASH'
    providerEWbalancesBonus = 'CHANNEL_CREDIT'
    geoComplyCustomField = false
    customFieldKey = ''
    geocomplyPluginVersion = '3.1.1.3'
    logout = true
    break
  case 'FD':
    providerServiceName = 'FanDuelWalletService'
    providerEWbalances = 'SportsbookPlayable'
    providerEWbalancesCash = 'SportsbookPlayableCash'
    providerEWbalancesBonus = 'SportsbookBonus'
    geoComplyCustomField = true
    customFieldKey = 'session_id'
    geocomplyPluginVersion = '3.1.1.3'
    logout = true
    break
  case 'HALLEY':
    providerServiceName = 'ProbabilityService'
    providerEWbalances = 'SportsbookPlayable'
    providerEWbalancesCash = ''
    providerEWbalancesBonus = ''
    geoComplyCustomField = false
    geocomplyPluginVersion = '3.1.1.3'
    logout = false
    break
  case 'SHW':
    providerCode = 'SHW'
    providerServiceName = 'userService'
    // providerEWbalances = 'SportsbookPlayable'
    // providerEWbalancesCash = 'SportsbookPlayableCash'
    // providerEWbalancesBonus = 'CHANNEL_CREDIT'
    userServiceLogin = `userServiceLogin` // This is service, not URL like for external wallets
    userServiceLogout = `userServiceLogin` // If this exist it will be used as service, if it doesn't providerServiceName will be used
    geocomplyPluginVersion = '4.0.0.4'
    geoComplyCustomField = false
    customFieldKey = ''
    logout = true
    break
}

export default {
  providerCode,
  providerServiceName,
  balance: providerEWbalances,
  balanceCash: providerEWbalancesCash,
  balanceBonus: providerEWbalancesBonus,
  geoComplyCustomField,
  customFieldKey,
  geocomplyPluginVersion,
  installerKey,
  installerURL,
  logout,
  userServiceLogin,
  userServiceLogout
}
