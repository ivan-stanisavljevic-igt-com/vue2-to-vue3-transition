function getBrand () {
  var args = null
  process.argv.slice(2, process.argv.length).forEach( arg => {
      if (arg.includes('=') && arg.includes('brand')) {
          const longArg = arg.split('=').slice(1)
          args = longArg[0]
      }
  })
  return args
}
function getLayout () {
  var args = null
  console.log('process.argv ------- ', process.argv)
  process.argv.slice(2, process.argv.length).forEach( arg => {
      if (arg.includes('=') && arg.includes('brand')) {
          const longArg = arg.split('=').slice(1)
          if (longArg[0].includes('generic-')) {
            args = arg.split('generic-').slice(1)[0]
          }
          if (longArg[0] === 'igt') {
            args = 'generic'
          }
      }
  })
  return args
}
const brand = getBrand()
const layout = getLayout()
var plugin = function(){
  return function(style){
    style.define('brand-key', function() {
      return brand
    })
    style.define('layout-key', function() {
      return layout
    })
  }
}
module.exports = plugin
