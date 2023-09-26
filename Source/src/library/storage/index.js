export default {
  init,
  isAvailable,
  testStorage
}

function init () {}

function isAvailable (type) {
  try {
    var storage = window[type]
    var x = '__storage_test__'
    storage.setItem(x, x)
    // alert('stored: ' + storage.getItem(x))
    storage.removeItem(x)
    return true
  } catch (e) {
    // alert(e.code + '\r' + e.name + '\n' + e)
    return e instanceof DOMException && (
      // everything except Firefox
      e.code === 22 ||
      // Firefox
      e.code === 1014 ||
      // test name field too, because code might not be present
      // everything except Firefox
      e.name === 'QuotaExceededError' ||
      // Firefox
      e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
      // acknowledge QuotaExceededError only if there's something already stored
      storage.length !== 0
  }
}

function testStorage () {
  // console.log('testStorage')
  var a = isAvailable('localStorage')
  // alert(a)
  if (a) {
    // Yippee! We can use localStorage awesomeness
    console.log('Storage available')
    // alert('Storage available')
  } else {
    // Too bad, no localStorage for us
    console.log('Storage NOT available')
    // alert('Storage NOT available')
  }
}
// testStorage()
