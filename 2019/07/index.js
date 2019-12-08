const fs = require('fs')
let partOneDone = false,
  partTwoDone = false,
  partTwoResult = Number.NEGATIVE_INFINITY

module.exports = main

function main () {
  fs.readFile('./values.txt', 'utf8', (err, data) => {
    if (err) {
      console.error(err)
      return
    }
    let initialPhaseSettings = ['0', '1', '2', '3', '4']
    let phaseSettings = ['1', '0', '2', '3', '4']
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

    initialPhaseSettings = ['5', '6', '7', '8', '9']
    phaseSettings = ['6', '5', '7', '8', '9']
    highestCount = 0
    highestCount = getResult(data, initialPhaseSettings, highestCount, true)
    while (!partTwoDone) {
      if (firstRun) highestCount = getResult(data, phaseSettings, highestCount)
      firstRun = false

      highestCount = secondSwapElements(phaseSettings, highestCount, data)
      highestCount = thirdSwapElements(phaseSettings, highestCount, data)
      highestCount = fourthSwapElements(phaseSettings, highestCount, data)
      highestCount = thirdSwapElements(phaseSettings, highestCount, data)
      highestCount = secondSwapElements(phaseSettings, highestCount, data)
      highestCount = fourthSwapElements(phaseSettings, highestCount, data)
    }
  })
}

function getResult (data, phaseSettings, oldHighest, first, a, b, c, d, e) {
  if (!first && !partOneDone && JSON.stringify(phaseSettings) === '["0","1","2","3","4"]') {
    console.log(`[Day 7] Part 1: Highest signal that can be sent to the thrusters: ${oldHighest}`)
    partOneDone = true
    return 'done'
  }

  if (!first && !partTwoDone && JSON.stringify(phaseSettings) === '["5","6","7","8","9"]') {
    console.log(`[Day 7] Part 2: Highest signal that can be sent to the thrusters: ${partTwoResult}`)
    partTwoDone = true
    return 'done'
  }

  if (!a) {
    a = new ParseIntCode(data.split(','))
    b = new ParseIntCode(data.split(','))
    c = new ParseIntCode(data.split(','))
    d = new ParseIntCode(data.split(','))
    e = new ParseIntCode(data.split(','))
  }
  a.parse([phaseSettings[0], e._output ? e._output : '0'])
  b.parse([phaseSettings[1], a._output])
  c.parse([phaseSettings[2], b._output])
  d.parse([phaseSettings[3], c._output])
  e.parse([phaseSettings[4], d._output])

  if (e._done && partOneDone) {
    if (partTwoResult < parseInt(e._output)) partTwoResult = parseInt(e._output)
    return
  }

  if (partOneDone) return getResult(data, phaseSettings, oldHighest, first, a, b, c, d, e)
  return parseInt(e._output) > parseInt(oldHighest) ? e._output : oldHighest
}

function swapElements (list, elem1, elem2) {
  const b = list[elem1]
  list[elem1] = list[elem2]
  list[elem2] = b
}

function secondSwapElements (list, oldHighest, data) {
  swapElements(list, 1, 2)
  oldHighest = getResult(data, list, oldHighest)
  if (oldHighest === 'done') return
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

class ParseIntCode {
  constructor (array) {
    this._i = 0
    this._array = array
    this._done = false
  }

  parse (input) {
    let inputCount = 0
    for (let i = this._i; i < this._array.length; i++) {
      let opcode = this._array[i]
      while (opcode.split('').length < 5) opcode = `0${opcode}`
      const parameterMode = opcode.split('')
      const firstParameter = parseInt(this._array[i + 1])
      const secondParameter = parseInt(this._array[i + 2])
      const overrideParameter = parseInt(this._array[i + 3])
      let done = false
      switch (parseInt(opcode.substr(opcode.length - 2, opcode.length - 1))) {
        case 1:
          this._array[overrideParameter] = ((parameterMode[2] === '0' ? parseInt(this._array[firstParameter]) : firstParameter) + (parameterMode[1] === '0' ? parseInt(this._array[secondParameter]) : secondParameter)).toString()
          i += 3
          break
        case 2:
          this._array[overrideParameter] = ((parameterMode[2] === '0' ? parseInt(this._array[firstParameter]) : firstParameter) * (parameterMode[1] === '0' ? parseInt(this._array[secondParameter]) : secondParameter)).toString()
          i += 3
          break
        case 3:
          this._array[firstParameter] = input[this._i === 0 ? inputCount : 1]
          if (inputCount < 1) inputCount++
          i++
          break
        case 4:
          this._output = parameterMode[2] === '0' ? this._array[firstParameter] : firstParameter
          if (partOneDone) {
            this._i = i + 2
            return
          }
          i += 1
          break
        case 5:
          if ((parameterMode[2] === '0' ? parseInt(this._array[firstParameter]) : firstParameter) !== 0) i = (parameterMode[1] === '0' ? parseInt(this._array[secondParameter]) : secondParameter) - 1
          else i += 2
          break
        case 6:
          if ((parameterMode[2] === '0' ? parseInt(this._array[firstParameter]) : firstParameter) === 0) i = (parameterMode[1] === '0' ? parseInt(this._array[secondParameter]) : secondParameter) - 1
          else i += 2
          break
        case 7:
          if ((parameterMode[2] === '0' ? parseInt(this._array[firstParameter]) : firstParameter) < (parameterMode[1] === '0' ? parseInt(this._array[secondParameter]) : secondParameter)) this._array[overrideParameter] = '1'
          else this._array[overrideParameter] = '0'
          i += 3
          break
        case 8:
          if ((parameterMode[2] === '0' ? parseInt(this._array[firstParameter]) : firstParameter) === (parameterMode[1] === '0' ? parseInt(this._array[secondParameter]) : secondParameter)) this._array[overrideParameter] = '1'
          else this._array[overrideParameter] = '0'
          i += 3
          break
        case 99:
          done = true
          break
      }
      this._done = done
      if (done) return
    }
  }
}