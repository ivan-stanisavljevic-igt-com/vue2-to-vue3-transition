function joinSegments (segments, delimiter) {
  delimiter = delimiter || '/'
  var result = ''

  if (segments && Array.isArray(segments)) {
    segments.forEach(function (element, index, array) {
      var segment = []

      if (index === array.length - 1) {
        segment = [element]
      } else {
        segment = element.delimiter ? [element.value, element.delimiter] : [element, delimiter]
      }

      result = result.concat(segment.join(''))
    })
  }

  return result
}

function convertUrlToClasses (path) {
  var result = ''
  if (path && typeof path === 'string') {
    result = path
    .split('/')
    .filter(function (item) {
      return Boolean(item)
    })
    .map(function (item) {
      return 'url-' + item
    })

    // result.unshift('url-state-' + to.name)
    result = result.join(' ')
  }

  return result
}

const proccessingPage = '/static/proccessing.html'

export default {
  joinSegments,
  convertUrlToClasses,
  proccessingPage
}
