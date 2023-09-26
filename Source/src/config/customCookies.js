var defaultDays = 365

function formatDate (days) {
  var d = new Date()
  d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000))
  return d.toUTCString()
}
function setCookie (cname, cvalue, exdays) {
  exdays = (exdays !== undefined) ? formatDate(exdays) : formatDate(defaultDays)
  cname = cname.toString()
  cvalue = (typeof cvalue === 'object' || cvalue instanceof Array) ? JSON.stringify(cvalue) : cvalue
  // var encryptValue = btoa(cvalue.norm_to_ascii().crypt_sym())
  var expires = 'expires=' + exdays
  document.cookie = cname + '=' + cvalue + ';' + expires + ';path=/'
}
function getCookie (cname) {
  var name = cname + '='
  var ca = document.cookie.split(';')
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i]
    while (c.charAt(0) === ' ') {
      c = c.substring(1)
    }
    if (c.indexOf(name) === 0) {
      var data = c.substring(name.length, c.length)
      // let decryptValue = atob(data).norm_to_unicode().crypt_sym()
      return JSON.parse(data)
    }
  }
  return {}
}
function removeCookie (name) {
  document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;'
}
/* eslint-disable */
String.prototype.norm_to_ascii=function(){return unescape(encodeURIComponent(this))};
String.prototype.norm_to_unicode=function(){return decodeURIComponent(escape(this))};
String.prototype.crypt_sym=function(k){return String.fromCharCode.apply(undefined,this.split("").map(function(c){return c.charCodeAt(0)^(k||13)}))};

export default {
  setCookie,
  getCookie,
  removeCookie
}
