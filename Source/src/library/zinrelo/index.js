import lib from '@/library'
import mobileBridge from '@/library/mobileBridge'

const zinreloConfiguration = window.ctsautoconf && window.ctsautoconf.ZINRELO_LOYALTY_REWARDS
const pageURL = zinreloConfiguration && zinreloConfiguration.PAGE_URL
const sdkURL = zinreloConfiguration && zinreloConfiguration.SDK_URL
const partnerID = zinreloConfiguration && zinreloConfiguration.PARTNER_ID
const isMobleApp = window.ctsautoconf && window.ctsautoconf.MOBILE_LS
const hasAllPrerequisites = !!(pageURL && sdkURL && partnerID)
const errorID = '[ZINRELO CONFIGURATION ERROR]:'

async function initialize () {
  if (!hasAllPrerequisites) {
    return handleMissingConfiguration()
  }
  try {
    let response = await lib.rpcService.callBroker('SharedWalletService', 'CreateTempId')
    if (response && response.result) {
      redirect(response.result)
    }
  } catch (exception) {
    console.log(exception)
  }
}

function redirect (token) {
  let url = `${pageURL}?accessToken=${token}&sdkURL=${sdkURL}&partnerID=${partnerID}&isMobleApp=${!!isMobleApp}&returnURL=${window.location.href}`
  if (window.ctsautoconf.MOBILE_LS) mobileBridge.bridgeSendRequest('openCashier', url)
  else window.open(url)
}

function handleMissingConfiguration () {
  if (!pageURL) console.error(`${errorID} Static page URL is missing!`)
  if (!sdkURL) console.error(`${errorID} SDK URL is missing!`)
  if (!partnerID) console.error(`${errorID} Partner ID is missing!`)
}

// const getUID = () => localStorage.customer

export default {
  initialize
}
