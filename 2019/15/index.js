const _ = require('lodash')

const stdin = process.stdin
stdin.setRawMode(true)
stdin.resume()
stdin.setEncoding('utf8')

let mode = 'play'
let gameRunningOrCalculating = false
let inputData
let intCode
let droid = { x: 1, y: 1, tile: 'D' }
let lastKey
let coordinates = []

stdin.on('data', key => {
  switch (key) {
    case '\u001B\u005B\u0043':
      if (gameRunningOrCalculating) {
        keyPressed('right')
        return
      }
      process.stdout.clearLine()
      process.stdout.cursorTo(0)
      switch (mode) {
        case 'play':
          process.stdout.write(' Play  [Calculate]  Visualize ')
          mode = 'calculate'
          break
        case 'calculate':
          process.stdout.write(' Play   Calculate   [Visualize]')
          mode = 'visualize'
      }
      break
    case '\u001B\u005B\u0044':
      if (gameRunningOrCalculating) {
        keyPressed('left')
        return
      }
      process.stdout.clearLine()
      process.stdout.cursorTo(0)
      switch (mode) {
        case 'calculate':
          process.stdout.write('[Play]  Calculate   Visualize ')
          mode = 'play'
          break
        case 'visualize':
          process.stdout.write(' Play  [Calculate]  Visualize ')
          mode = 'calculate'
          break
      }
      break
    case '\u001B\u005B\u0041':
      keyPressed('up')
      break
    case '\u001B\u005B\u0042':
      keyPressed('down')
      break
    case '\u0003':
      process.exit() // ctrl-c
      break
    case '\r':
      console.time('[Year 2019, Day 15] Calculation time')
      if (gameRunningOrCalculating) return
      gameRunningOrCalculating = true
      let done = false
      switch (mode) {
        case 'play':
          start(true, true)
          break
        case 'calculate':
          while (!done) done = start(false, false)
          break
        case 'visualize':
          while (!done) done = start(false, true)
          break
      }
      break
    case 'r':
      keyPressed('reset')
      break
  }
})

let linesToClear = 0

function keyPressed (key) {
  if (key === 'reset') {
    intCode = undefined
    start(true, true)
    return
  }
  switch (key) {
    case 'up':
      key = 1
      break
    case 'right':
      key = 4
      break
    case 'left':
      key = 3
      break
    case 'down':
      key = 2
      break
  }
  intCode._array[intCode._requiresInput] = key
  lastKey = key

  start(true, true)
}

module.exports = main

function main (data) {
  process.stdout.write('[Play]  Calculate  Visualize ')
  if (!inputData) inputData = data
}

function start (game, visualize) {
  const data = inputData
  if (game) {
    process.stdout.moveCursor(0, -1)
    process.stdout.clearLine()
  }
  if (!intCode || !intCode._requiresInput) {
    intCode = new IntCode(data.split(','))
  }
  let blockTileCount = 0
  intCode.parse()
  let maxX = Number.NEGATIVE_INFINITY
  let maxY = Number.NEGATIVE_INFINITY
  let minX = Infinity
  let minY = Infinity
  let result = '\n'
  const searchedCoordinate = _.clone(droid)
  switch (lastKey) {
    case 1:
      searchedCoordinate.x = droid.x
      searchedCoordinate.y = droid.y - 1
      break
    case 2:
      searchedCoordinate.x = droid.x
      searchedCoordinate.y = droid.y + 1
      break
    case 3:
      searchedCoordinate.x = droid.x - 1
      searchedCoordinate.y = droid.y
      break
    case 4:
      searchedCoordinate.x = droid.x + 1
      searchedCoordinate.y = droid.y
      break
  }

  switch (intCode._output[intCode._output.length - 1]) {
    case 0:
      searchedCoordinate.tile = '#'
      break
    case 1:
      searchedCoordinate.tile = 'D'
      droid.x = searchedCoordinate.x
      droid.y = searchedCoordinate.y
      for (let i = 0; i < coordinates.length; i++) {
        let coordinate = coordinates[i]
        if (coordinate.tile === 'D' && !(searchedCoordinate.x === coordinate.x && searchedCoordinate.y === coordinate.y)) coordinate.tile = '.'
      }
      break
    case 2:
      console.log(`[Year 2019, Day 15, Part 1] The number of block tiles when the game exits is: ${blockTileCount}`)
      // console.log(`[Year 2019, Day 15, Part 2] The score is: ${score}`)
      console.timeEnd('[Year 2019, Day 13] Calculation time')
      return true
  }
  let alreadyExists = false
  for (const coordinate of coordinates) {
    if (coordinate.x === searchedCoordinate.x && coordinate.y === searchedCoordinate.y) alreadyExists = true
  }
  if (!alreadyExists)
    coordinates.push(searchedCoordinate)
  else if (searchedCoordinate.tile === 'D') {
    for (const coordinate of coordinates) {
      if (coordinate.x === searchedCoordinate.x && coordinate.y === searchedCoordinate.y) coordinate.tile = 'D'
    }
  }

  for (const coordinate of coordinates) {
    if (coordinate.x < minX) minX = coordinate.x
    if (coordinate.y < minY) minY = coordinate.y
    if (coordinate.x > maxX) maxX = coordinate.x
    if (coordinate.y > maxY) maxY = coordinate.y
  }

  let countX = minX
  let countY = minY

  while (countY !== maxY + 1) {
    let coordinateExists = false
    for (const coordinate of coordinates) {
      if (countX === coordinate.x && countY === coordinate.y) {
        result += coordinate.tile
        coordinateExists = true
      }
    }
    if (!coordinateExists) result += ' '
    countX++
    if (countX === maxX + 1) {
      countX = minX
      countY++
      result += '\n'
    }
  }
  while (-linesToClear !== 0) {
    process.stdout.moveCursor(0, -1)
    process.stdout.clearLine()
    process.stdout.cursorTo(0)
    linesToClear--
  }
  if (visualize) {
    process.stdout.write(`${result}\n`)
    if (game)
      process.stdout.write('Droid direction: (Arrow Keys (direction) | R key (reset)\n')
    linesToClear = 4 + maxY
  }

  if (!visualize) {
    process.stdout.clearLine()
    process.stdout.cursorTo(0)
    process.stdout.moveCursor(0, -1)
    process.stdout.clearLine()
    process.stdout.cursorTo(0)
  }
  return false
}

class IntCode {
  constructor (array) {
    this._array = array
    this._relativeBase = 0
    this._output = []
    this._requiresInput = true
    this._i = 0
  }

  parse () {
    this._requiresInput = false
    for (this._i; this._i < this._array.length; this._i++) {
      let opcode = this._array[this._i]
      while (opcode.split('').length < 5) opcode = `0${opcode}`
      const parameterMode = opcode.split('')
      let firstParameter
      let secondParameter
      let overrideParameter
      let firstParameterAccessor
      let secondParameterAccessor
      switch (parameterMode[2]) {
        case '0':
          firstParameterAccessor = parseInt(this._array[this._i + 1])
          firstParameter = this._array[firstParameterAccessor]
          break
        case '1':
          firstParameterAccessor = this._i + 1
          firstParameter = this._array[firstParameterAccessor]
          break
        case '2':
          firstParameterAccessor = this._relativeBase + parseInt(this._array[this._i + 1])
          firstParameter = this._array[firstParameterAccessor]
          break
      }
      switch (parameterMode[1]) {
        case '0':
          secondParameterAccessor = parseInt(this._array[this._i + 2])
          secondParameter = this._array[secondParameterAccessor]
          break
        case '1':
          secondParameterAccessor = this._i + 2
          secondParameter = this._array[secondParameterAccessor]
          break
        case '2':
          secondParameterAccessor = this._relativeBase + parseInt(this._array[this._i + 2])
          secondParameter = this._array[secondParameterAccessor]
          break
      }

      switch (parameterMode[0]) {
        case '0':
          overrideParameter = parseInt(this._array[this._i + 3])
          break
        case '1':
          overrideParameter = this._i + 3
          break
        case '2':
          overrideParameter = this._relativeBase + parseInt(this._array[this._i + 3])
          break
      }

      if (firstParameter === undefined) firstParameter = 0
      else firstParameter = parseInt(firstParameter)
      if (secondParameter === undefined) secondParameter = 0
      else secondParameter = parseInt(secondParameter)

      let done = false
      switch (parseInt(opcode.substr(opcode.length - 2, opcode.length - 1))) {
        case 1:
          this._array[overrideParameter] = (firstParameter + secondParameter).toString()
          this._i += 3
          break
        case 2:
          this._array[overrideParameter] = (firstParameter * secondParameter).toString()
          this._i += 3
          break
        case 3:
          this._i += 2
          this._requiresInput = firstParameterAccessor
          return
        // this._array[firstParameterAccessor] = this._input
        case 4:
          this._output.push(firstParameter)
          this._i += 1
          break
        case 5:
          if (firstParameter !== 0) this._i = secondParameter - 1
          else this._i += 2
          break
        case 6:
          if (firstParameter === 0) this._i = secondParameter - 1
          else this._i += 2
          break
        case 7:
          if (firstParameter < secondParameter) this._array[overrideParameter] = '1'
          else this._array[overrideParameter] = '0'
          this._i += 3
          break
        case 8:
          if (firstParameter === secondParameter) this._array[overrideParameter] = '1'
          else this._array[overrideParameter] = '0'
          this._i += 3
          break
        case 9:
          this._relativeBase += firstParameter
          this._i += 1
          break
        case 99:
          done = true
          break
      }
      if (done) return
    }
  }
}