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

    let san,
      you
    let result
    for (const key of Object.keys(results)) {
      let skip = false
      for (const value of Object.values(results)) {
        if (value.includes(key)) {
          skip = true
          break
        }
      }
      if (results[key].includes('SAN')) {
        san = traceBack(results, key, 'COM')
      }
      if (results[key].includes('YOU')) {
        you = traceBack(results, key, 'COM')
      }
      let total = []
      if (you && san) {
        const youSplit = you.values.split(','),
          sanSplit = san.values.split(',')
        total.push(youSplit.filter(element => sanSplit.includes(element)))
        result = ((you.values.split(total[0][0])[0].match(/,/g) || []).length) + ((san.values.split(total[0][0])[0].match(/,/g) || []).length)
        you = undefined
        san = undefined
      }
      if (skip) continue
      const orbits = getOrbits(results, key, 0)
      console.log(`[Day 6] Part 1: The number of indirect and direct orbits is ${orbits}`)
      console.log(`[Day 6] Part 2: At least ${result} steps are required to get from YOU to SAN`)
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

function traceBack (results, value, ending) {
  let values = ''
  let count = 0
  for (const key of Object.keys(results)) {
    if (results[key].includes(value)) {
      count++
      if (key === ending) {
        values += `${value},${key}`
        break
      }
      const trace = traceBack(results, key, ending)
      values += `${value},${trace.values}`
      count += trace.count
    }
  }
  return { values, count }
}