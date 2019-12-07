const fs = require('fs')
let partOneDone = false

module.exports = main

function main () {
  fs.readFile('./values.txt', 'utf8', (err, data) => {
    if (err) {
      console.error(err)
      return
    }
    const phaseSettings = ['1', '0', '2', '3', '4']
    const initialPhaseSettings = ['0', '1', '2', '3', '4']
    let highestCount = 0
    highestCount = getResult(data, initialPhaseSettings, highestCount, true)
    let firstRun = true
    // noinspection InfiniteLoopJS
    while (!partOneDone) {
      if (firstRun) highestCount = getResult(data, phaseSettings, highestCount)

      firstRun = false
      highestCount = secondSwapElements(phaseSettings, highestCount, data)
      highestCount = thirdSwapElements(phaseSettings, highestCount, data)
      highestCount = fourthSwapElements(phaseSettings, highestCount, data)
      highestCount = thirdSwapElements(phaseSettings, highestCount, data)
      highestCount = secondSwapElements(phaseSettings, highestCount, data)
    }
  })
}

function parseIntCode (array, input) {
  let inputCount = 0
  let output
  for (let i = 0; i < array.length; i++) {
    let opcode = array[i]
    while (opcode.split('').length < 5) opcode = `0${opcode}`
    const parameterMode = opcode.split('')
    const firstParameter = parseInt(array[i + 1])
    const secondParameter = parseInt(array[i + 2])
    const overrideParameter = parseInt(array[i + 3])
    let done = false
    switch (parseInt(opcode.substr(opcode.length - 2, opcode.length - 1))) {
      case 1:
        array[overrideParameter] = ((parameterMode[2] === '0' ? parseInt(array[firstParameter]) : firstParameter) + (parameterMode[1] === '0' ? parseInt(array[secondParameter]) : secondParameter)).toString()
        i += 3
        break
      case 2:
        array[overrideParameter] = ((parameterMode[2] === '0' ? parseInt(array[firstParameter]) : firstParameter) * (parameterMode[1] === '0' ? parseInt(array[secondParameter]) : secondParameter)).toString()
        i += 3
        break
      case 3:
        array[firstParameter] = input[inputCount]
        inputCount++
        i++
        break
      case 4:
        output = parameterMode[2] === '0' ? array[firstParameter] : firstParameter
        i += 1
        break
      case 5:
        if ((parameterMode[2] === '0' ? parseInt(array[firstParameter]) : firstParameter) !== 0) i = (parameterMode[1] === '0' ? parseInt(array[secondParameter]) : secondParameter) - 1
        else i += 2
        break
      case 6:
        if ((parameterMode[2] === '0' ? parseInt(array[firstParameter]) : firstParameter) === 0) i = (parameterMode[1] === '0' ? parseInt(array[secondParameter]) : secondParameter) - 1
        else i += 2
        break
      case 7:
        if ((parameterMode[2] === '0' ? parseInt(array[firstParameter]) : firstParameter) < (parameterMode[1] === '0' ? parseInt(array[secondParameter]) : secondParameter)) array[overrideParameter] = '1'
        else array[overrideParameter] = '0'
        i += 3
        break
      case 8:
        if ((parameterMode[2] === '0' ? parseInt(array[firstParameter]) : firstParameter) === (parameterMode[1] === '0' ? parseInt(array[secondParameter]) : secondParameter)) array[overrideParameter] = '1'
        else array[overrideParameter] = '0'
        i += 3
        break
      case 99:
        done = true
        break
    }
    if (done) return output
  }
}

function getResult (data, phaseSettings, oldHighest, first) {
  if (!first && JSON.stringify(phaseSettings) === '["0","1","2","3","4"]') {
    console.log(oldHighest)
    partOneDone = true
  }
  const a = parseIntCode(data.split(','), [phaseSettings[0], '0'])
  const b = parseIntCode(data.split(','), [phaseSettings[1], a])
  const c = parseIntCode(data.split(','), [phaseSettings[2], b])
  const d = parseIntCode(data.split(','), [phaseSettings[3], c])
  const e = parseIntCode(data.split(','), [phaseSettings[4], d])
  return parseInt(e) > parseInt(oldHighest) ? e : oldHighest
}

function swapElements (list, elem1, elem2) {
  const b = list[elem1]
  list[elem1] = list[elem2]
  list[elem2] = b
}

function secondSwapElements (list, oldHighest, data) {
  swapElements(list, 1, 2)
  oldHighest = getResult(data, list, oldHighest)
  swapElements(list, 0, 1)
  oldHighest = getResult(data, list, oldHighest)
  return oldHighest
}

function thirdSwapElements (list, oldHighest, data) {
  swapElements(list, 2, 3)
  oldHighest = getResult(data, list, oldHighest)
  swapElements(list, 0, 1)
  oldHighest = getResult(data, list, oldHighest)
  oldHighest = secondSwapElements(list, oldHighest, data)
  return oldHighest
}

function fourthSwapElements (list, oldHighest, data) {
  swapElements(list, 3, 4)
  oldHighest = getResult(data, list, oldHighest)
  swapElements(list, 0, 1)
  oldHighest = getResult(data, list, oldHighest)
  oldHighest = thirdSwapElements(list, oldHighest, data)
  return oldHighest
}