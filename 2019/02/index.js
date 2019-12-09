const fs = require('fs')

module.exports = main

function main (data) {
  //Part 1
  let firstPartArray = data.split(',')
  firstPartArray[1] = '12'
  firstPartArray[2] = '2'

  //Part 2
  let array = data.split(',')

  let firstElementCounter = 0
  let secondElementCounter = 0
  let result
  while (firstElementCounter <= 99 && secondElementCounter <= 99) {
    array[1] = firstElementCounter.toString()
    array[2] = secondElementCounter.toString()
    if (parseInt(parseIntCode(array)) === 19690720) result = 100 * firstElementCounter + secondElementCounter

    array = data.split(',')
    if (firstElementCounter < 99) firstElementCounter++
    else {
      firstElementCounter = 0
      secondElementCounter++
    }
  }
  return [{
    message: 'The first element\'s value is',
    value: parseIntCode(firstPartArray)
  }, { message: 'Calculated answer (100 * noun + verb)', value: result }]
}

function parseIntCode (array) {
  let count = 0
  for (const opcode of array) {
    if (count % 4 === 0) {
      const firstElement = parseInt(array[count + 1])
      const secondElement = parseInt(array[count + 2])
      const overrideElement = parseInt(array[count + 3])
      let done = false
      switch (parseInt(opcode)) {
        case 1:
          array[overrideElement] = (parseInt(array[firstElement]) + parseInt(array[secondElement])).toString()
          break
        case 2:
          array[overrideElement] = (parseInt(array[firstElement]) * parseInt(array[secondElement])).toString()
          break
        case 99:
          done = true
          break
      }
      if (done) return array[0]
    }
    count++
  }
}