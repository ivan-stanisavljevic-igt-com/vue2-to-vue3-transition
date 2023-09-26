function createObjectFromURLWithQueryParams (UrlWithQueryParameters) {
  const URL = new URLSearchParams(UrlWithQueryParameters)
  const obj = Object.fromEntries(URL)
  return obj
}

function toCamelCase (param) {
  const firstLetter = param && param[0]
  const residual = param && param.slice(1)
  return `${firstLetter.toLowerCase()}${residual}`
}

function loadScriptAsync (url) {
  let script = document.createElement('script')
  script.src = url
  document.body.append(script)
  return new Promise((resolve, reject) => {
    script.onload = () => {
      resolve('success')
    }
    script.onerror = () => {
      reject(new Error())
    }
  })
}

export default {
  createObjectFromURLWithQueryParams,
  toCamelCase,
  loadScriptAsync
}
