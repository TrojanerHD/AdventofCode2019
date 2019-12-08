const fs = require('fs')

module.exports = main

function main () {
  fs.readFile('./values.txt', 'utf8', (err, data) => {
    if (err) {
      console.error(err)
      return
    }

    const layers = data.match(/.{1,150}/g)
    let zeroCount = { count: Infinity, layer: undefined }
    for (const layer of layers) {
      const zerosInLayer = (layer.match(/0/g) || []).length
      if (zeroCount.count > zerosInLayer) zeroCount = { count: zerosInLayer, layer: layer }
    }

    const numbersInLayer = {
      one: (zeroCount.layer.match(/1/g) || []).length,
      two: (zeroCount.layer.match(/2/g) || []).length
    }
    console.log(`[Day 8] Part 1: The number of 1 digits multiplied by the number of 2 digits is ${numbersInLayer.one * numbersInLayer.two}`)

    let resultObject = {}
    for (const layer of layers) {
      let count = 0
      const linebreaks = layer.match(/.{1,25}/g)
      for (const linebreak of linebreaks) {
        const linebreakChars = linebreak.split('')
        for (const linebreakChar of linebreakChars) {
          if (!resultObject[count] || resultObject[count] === '2')
            resultObject[count] = linebreakChar
          count++
        }
        resultObject[count] = '\n'
        count++
      }
    }
    let result = ''
    for (const value of Object.values(resultObject)) {
      result += value
    }
    result = result.replace(/0/g, ' ')
    result = result.replace(/1/g, '☐')
    console.log(`[Day 8] Part 2:\n${result}-------------`)
  })
}