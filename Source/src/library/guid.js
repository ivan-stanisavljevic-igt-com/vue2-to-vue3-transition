import { v4 as uuidv4 } from 'uuid'

export default {
  init,
  getClientGuid,
  getClientTabGuid
}

function init () {
  if (!localStorage['igt_cs']) {
    localStorage['igt_cs'] = uuidv4()
  }

  if (!(sessionStorage['igt_bs'] && sessionStorage['page-refreshed'] === 'true')) {
    sessionStorage['igt_bs'] = uuidv4()
  }

  sessionStorage['page-refreshed'] = false

  window.addEventListener('pagehide', (ev) => {
    sessionStorage['page-refreshed'] = true
  })
}

function getClientGuid () {
  var guid = ''
  var storage = localStorage

  if (storage) {
    guid = storage['igt_cs'] || ''
  }

  return guid
}

function getClientTabGuid () {
  var guid = ''
  var storage = sessionStorage

  if (storage) {
    guid = storage['igt_bs'] || ''
  }

  return guid
}
