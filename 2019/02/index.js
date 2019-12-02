const fs = require('fs')

module.exports = main

function main () {
  fs.readFile('./values.txt', 'utf8', (err, data) => {
    if (err) {
      console.error(err)
      return
    }

    const array = data.split(',')
    array[1] = 12
    array[2] = 2

    let count = 0
    for (const opcode of array) {
      if (count % 4 === 0) {
        const firstElement = parseInt(array[count + 1])
        const secondElement = parseInt(array[count + 2])
        const overrideElement = parseInt(array[count + 3])
        switch (parseInt(opcode)) {
          case 1:
            array[overrideElement] = parseInt(array[firstElement]) + parseInt(array[secondElement])
            break
          case 2:
            array[overrideElement] = parseInt(array[firstElement]) * parseInt(array[secondElement])
            break
          case 99:
            console.log(`[Day 2] The first element's value is ${array[0]}`)
            return
        }
      }
      count++
    }
  })
}