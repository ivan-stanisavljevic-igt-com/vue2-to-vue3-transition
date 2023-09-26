const fs = require('fs')
const rimraf = require("rimraf")
const directories = ['dist/static/translations', 'dist/static/brand-img']

function filterArgs () {
  var args = null
  process.argv.slice(2, process.argv.length).forEach( arg => {
      if (arg.includes('--')) {
          const longArg = arg.split('--').slice(1)
          args = longArg[0]
      }
  })
  if (args === 'null') args = null
  return args
}
const arg = filterArgs()
console.log('brand', arg)

const removeDir = function(directories) {
  directories.forEach(path => {
    if (fs.existsSync(path)) {
      const files = fs.readdirSync(path)
      if (files.length > 0) {
        var argArray = [arg]
        if (arg === 'dn') argArray.push('dnw')
        files.forEach(function(filename) {
          if (!argArray.includes(filename)) {
          rimraf(path + "/" + filename, function () {
            console.log(filename + " folder from location '"+ path + "' has been removed!")
          })
        }
        })
      } else {
        console.log("No files found in the directory.")
      }
    } else {
      console.log("Directory path not found.")
    }
  })
}
if (arg)
removeDir(directories)