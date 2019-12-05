const fs = require('fs')

module.exports = main

function main () {
  fs.readFile('./values.txt', 'utf8', ((err, data) => {
    if (err) {
      console.error(err)
      return
    }
    const array = data.split(',')
    parseIntCode(array)
  }))
}

function parseIntCode (array) {
  let count = 0
  let increase = 0
  for (let opcode of array) {
    if (increase > 0) {
      increase--
      count++
      continue
    }

    while (opcode.split('').length < 5) opcode = `0${opcode}`
    const parameterMode = opcode.split('')
    const firstElement = parseInt(array[count + 1])
    const secondElement = parseInt(array[count + 2])
    const overrideElement = parseInt(array[count + 3])
    let done = false
    switch (parseInt(opcode.substr(opcode.length - 2, opcode.length - 1))) {
      case 1:
        array[overrideElement] = ((parameterMode[0] === '0' ? parseInt(array[firstElement]) : firstElement) + (parameterMode[1] === '0' ? parseInt(array[secondElement]) : secondElement)).toString()
        increase = 3
        break
      case 2:
        array[overrideElement] = ((parameterMode[0] === '0' ? parseInt(array[firstElement]) : firstElement) * (parameterMode[1] === '0' ? parseInt(array[secondElement]) : secondElement)).toString()
        increase = 3
        break
      case 3:
        array[firstElement] = '1'
        increase = 1
        break
      case 4:
        console.log(parameterMode[3] === '0' ? array[firstElement] : firstElement)
        increase = 1
        break
      case 99:
        done = true
        break
    }
    if (done) return array[0]
    count++
  }
}