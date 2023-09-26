function getHandicap (selection) {
  var h
  if (selection) {
    h = typeof selection.currenthandicap !== 'undefined' ? selection.currenthandicap
      : typeof selection.currentmatchhandicap !== 'undefined' ? selection.currentmatchhandicap
        : typeof selection.Handicap !== 'undefined' ? selection.Handicap : null
    h = JSON.parse(h)
  }
  return h
}

function formatHandicap (selection) {
  // console.log('formatHandicap')
  var h = getHandicap(selection)
//        var h = selection.currenthandicap && !isNaN(selection.currenthandicap) ? parseFloat(selection.currenthandicap) : ''
  if (typeof h !== 'number') {
    return ''
  }
  if (h === 0 && window.ctsautoconf.SHOW_ZERO_HCP_AS_PK) {
    return 'PK'
  }
  var hadvalue = selection.hadvalue || selection.HAD
  if (h !== '' && typeof h === 'number') {
    if (hadvalue === 'A') {
      if (h) {
        h *= -1
      }
    }
    if (h >= 0 && ['H', 'A', 'D'].includes(hadvalue)) {
      h = '+' + h
    }
  }
  return h
}

export default {
  getHandicap,
  formatHandicap
}
