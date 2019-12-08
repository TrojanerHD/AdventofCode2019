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
  })
}