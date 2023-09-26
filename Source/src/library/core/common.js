function isNewVersion (oldVersion, newVersion) {
  if (!oldVersion) {
    return false
  }

  let result = false

  let oldParsed = oldVersion ? oldVersion.toString().split('.').map((num) => parseInt(num)) : []
  let newParsed = newVersion ? newVersion.toString().split('.').map((num) => parseInt(num)) : []

  let numOfElements = oldParsed.length > newParsed.length ? oldParsed.length : newParsed.length

  for (let index = 0; index < numOfElements; index++) {
    const element = oldParsed[index] ? oldParsed[index] : 0
    const newElement = newParsed[index] ? newParsed[index] : 0

    if (element === newElement) {
      continue
    }

    result = newElement > element
    break
  }

  return result
}

export default {
  isNewVersion
}
