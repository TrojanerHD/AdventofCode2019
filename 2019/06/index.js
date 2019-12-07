const fs = require('fs')

module.exports = main

function main () {
  fs.readFile('./values.txt', 'utf8', (err, data) => {
    if (err) {
      console.error(err)
      return
    }
    const orbitMap = data.split('\n')
    const results = {}

    for (const orbit of orbitMap) {
      const orbitSplit = orbit.split(')')
      if (results[orbitSplit[0]] === undefined) results[orbitSplit[0]] = []
      results[orbitSplit[0]].push(orbitSplit[1])
    }

    for (const key of Object.keys(results)) {
      const valueArray = results[key]
      if (valueArray.includes(key)) continue
      const count = getOrbits(results, key, 0)
      console.log(count)
      break
    }
  })
}

function getOrbits (results, key, indentation) {
  let count = 0
  const valueArray = results[key]
  if (valueArray === undefined) return count
  indentation++
  for (const value of valueArray) {
    count += indentation
    count += getOrbits(results, value, indentation)
  }
  return count
}