export default {
  checkInterRelated
}

//
function isNullOrEmpty (obj) {
  return (typeof obj === 'undefined' || obj === null || obj === '')
}
//
function checkInterRelated (selections, markets) {
  // console.log('checkInterRelated')
  var interRelated = 0
  var interRelatedObj = {}
  var s1
  var s2
  var m1
  var m2
  // var selections
  var n
  var interRelatedCheck
  var i
  var j
  //
  // selections = Object.keys(betSlip)
  n = selections.length
  selections.forEach(function (s, c) {
    s.interRelated = 0
  })
  //
  if (n > 1) {
    for (i = 0; i < n - 1; i++) { // outer loop uses each item i at 0 through n
      for (j = i + 1; j < n; j++) { // inner loop only compares items j at i+1 to n
        s1 = selections[i]
        s2 = selections[j]
        // m1 = s1.market
        m1 = markets[s1.idfoselection]
        // m2 = s2.market
        m2 = markets[s2.idfoselection]
        interRelatedCheck = compareTags(m1.idfoevent, m1.idfomarket, m1.mtag, m1.ttagleft, m1.ttagright, m1.ctag, m2.idfoevent, m2.idfomarket, m2.mtag, m2.ttagleft, m2.ttagright, m2.ctag)
        if (interRelatedCheck > -1) {
          if (s1.interRelated) {
            interRelated = s1.interRelated
          } else {
            interRelated++
          }
          s1.interRelated = interRelated
          s2.interRelated = interRelated
          interRelatedObj[s1.idfoselection] = interRelated
          interRelatedObj[s2.idfoselection] = interRelated
        }
      }
    }
  }
  // return interRelated
  return interRelatedObj
}
//
function compareTags (event1, market1, mtag1, ttagLeft1, ttagRight1, ctag1, event2, market2, mtag2, ttagLeft2, ttagRight2, ctag2) {
  if (market1 === market2) {
    return 0
  }
  if (event1 === event2 && compareTag(mtag1, mtag2)) {
    return 1
  }
  if (event1 !== event2 && (compareTag(ttagLeft1, ttagRight2) || compareTag(ttagRight1, ttagLeft2))) {
    return 2
  }
  if (event1 !== event2 && compareTag(ctag1, ctag2)) {
    return 3
  }
  return -1
}
//
function compareTag (tag1, tag2) {
  var ttagSeparator1
  var ttagSeparator2
  var parts1
  var parts2
  var comps1
  var comps2
  var deps1
  var deps2
  var tags1
  var tags2
  var i
  var j
  var m
  var n

  if (isNullOrEmpty(tag1) || isNullOrEmpty(tag2)) {
    return false
  }
  ttagSeparator1 = tag1.indexOf(':')
  ttagSeparator2 = tag2.indexOf(':')
  if (ttagSeparator1 >= 0 && ttagSeparator2 >= 0) {
    parts1 = tag1.split(':')
    parts2 = tag2.split(':')
    if (parts1.length >= 2 && parts2.length >= 2) {
      comps1 = parts1[0].split('|')
      comps2 = parts2[0].split('|')
      for (i = 0; i < comps1.length; i++) {
        for (j = 0; j < comps2.length; j++) {
          if (comps1[i] === comps2[j] && comps2[j] !== '') {
            deps1 = parts1[1].split(',')
            deps2 = parts2[1].split(',')
            for (m = 0; m < deps1.length; m++) {
              for (n = 0; n < deps2.length; n++) {
                if (deps1[m] === '*' || deps2[n] === '*' || (deps1[m] === deps2[n] && deps1[m] !== '')) {
                  return true
                }
              }
            }
            return false
          }
        }
      }
    }
    return false
  }
  if (ttagSeparator1 < 0 && ttagSeparator2 < 0) {
    tags1 = tag1.split('!')
    tags2 = tag2.split('!')
    for (i = 0; i < tags1.length; i++) {
      parts1 = tags1[i].split('|')
      for (j = 0; j < tags2.length; j++) {
        parts2 = tags2[j].split('|')
        if (parts1[0] === parts2[0] && parts1.length >= 2 && parts2.length >= 2) {
          deps1 = parts1[1].split(',')
          deps2 = parts2[1].split(',')
          for (m = 0; m < deps1.length; m++) {
            for (n = 0; n < deps2.length; n++) {
              if (deps1[m] === '*' || deps2[n] === '*' || (deps1[m] === deps2[n] && deps1[m] !== '')) {
                return true
              }
            }
          }
        }
      }
    }
  }
  return false
}
