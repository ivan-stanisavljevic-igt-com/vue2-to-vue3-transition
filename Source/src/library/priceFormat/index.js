import config from '@/config'

function americanPrice (price) {
  let priceus = {
    price: price,
    sign: ''
  }
  if (price >= 2) {
    priceus.price = 100 * (price - 1)
  } else {
    priceus.price = -100 / (price - 1)
  }
  //
  if (price === 1) {
    priceus.price = 0
  }
  //
  // priceus.price = Math.round(priceus.price * 100) / 100
  priceus.price = parseFloat(priceus.price.toFixed(0))
  priceus.sign = priceus.price < 0 ? '' : '+'
  // return priceus
  let formatted = priceus.sign + priceus.price
  // console.log('americanPrice: ' + price + ' => ' + formatted)
  return formatted
}

function formatSelectionPrice (selection, isoutright) {
  var price
  if (!isNaN(parseFloat(selection.currentpriceup)) && !isNaN(parseFloat(selection.currentpricedown))) {
    price = 1 + parseFloat(selection.currentpriceup) / parseFloat(selection.currentpricedown)
  }
  //
  if (config.app.autoconf.US_PRICE_FORMAT_SIMPLE_FRACTIONS && selection.idfosporttype !== 'BOXING' && isoutright &&
    (selection.currentpriceup === 1 || selection.currentpricedown === 1 || selection.currentpricedown === 2)) {
    return selection.currentpriceup + '/' + selection.currentpricedown
  }
  //
  return formatOdds(price)
}

function formatOdds (price) {
  if (!isNaN(parseFloat(price))) {
    if (config.app.priceFormat === 'US') {
      let priceus = americanPrice(price)
      return priceus
    } else {
      return price.toFixed(2)
    }
  } else {
    return undefined
  }
}

function reCalculatePrice (selection) {
  var price = false
  if (selection.currentpriceup && selection.currentpricedown) {
    price = 1 + selection.currentpriceup / selection.currentpricedown
    price = parseFloat(price.toFixed(14))
  }
  price = price || selection.price
  return price
}

function formatBetTypePrice (allowedBetTypesAndReturns) {
  let potentialReturn = (allowedBetTypesAndReturns && allowedBetTypesAndReturns.PotentialReturn) || 0
  let unitCount = (allowedBetTypesAndReturns && allowedBetTypesAndReturns.UnitCount) || 1
  let price = potentialReturn - unitCount + 1
  return formatOdds(price)
}

export default {
  formatSelectionPrice,
  formatBetTypePrice,
  formatOdds,
  reCalculatePrice
}
