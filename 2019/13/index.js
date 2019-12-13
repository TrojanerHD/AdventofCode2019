const stdin = process.stdin
stdin.setRawMode(true)
stdin.resume()
stdin.setEncoding('utf8')

let mode = 'play'
let gameRunningOrCalculating = false
let inputData
let intCode

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
      keyPressed('neutral')
      break
    case '\u0003':
      process.exit() // ctrl-c
      break
    case '\r':
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
      key = 0
      break
    case 'right':
      key = 1
      break
    case 'left':
      key = -1
      break
  }
  intCode._array[intCode._requiresInput] = key

  start(true, true)
}

let twoBeginningCount
let startPerformance
module.exports = main

function main (data) {
  console.time('2019day13')
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
  let score
  intCode.parse()
  const positions = []
  for (let i = 0; i < intCode._output.length; i += 3) {
    const x = intCode._output[i]
    const y = intCode._output[i + 1]
    let tileId = intCode._output[i + 2]
    if (tileId === 2) blockTileCount++
    if (x === -1 && y === 0) {
      score = tileId
      continue
    }
    let secondPositionExists = false
    for (let j = 0; j < positions.length; j++) {
      const secondPosition = positions[j]
      if (x === secondPosition.x && y === secondPosition.y) {
        secondPosition.tileId = tileId
        secondPositionExists = true
      }
    }
    if (!secondPositionExists)
      positions.push({ x, y, tileId })
  }
  let maxX = 0
  let maxY = 0

  for (const position of positions) {
    const { x, y } = position
    if (maxX < x) maxX = x
    if (maxY < y) maxY = y
  }
  let countX = 0
  let countY = 0
  let result = '\n'
  let positionOfFour
  let positionOfThree
  while (countY !== maxY + 1) {
    let isCoordinate = false
    for (const position of positions) {
      if (countX === position.x && countY === position.y && position.tileId !== 0) {
        if (position.tileId === 3) positionOfThree = position
        if (position.tileId === 4) positionOfFour = position
        result += position.tileId
        isCoordinate = true
        break
      }
    }
    if (!isCoordinate) result += ' '
    countX++
    if (countX === maxX + 1) {
      countX = 0
      countY++
      result += '\n'
    }
  }
  if (positionOfFour.x > positionOfThree.x) intCode._array[intCode._requiresInput] = 1
  else if (positionOfFour.x < positionOfThree.x) intCode._array[intCode._requiresInput] = -1
  else if (positionOfFour.x === positionOfThree.x) intCode._array[intCode._requiresInput] = 0
  while (-linesToClear !== 0) {
    process.stdout.moveCursor(0, -1)
    process.stdout.clearLine()
    process.stdout.cursorTo(0)
    linesToClear--
  }
  if (visualize) {
    process.stdout.write(`${result}\n`)
    process.stdout.write(`Score: ${score}\n`)
    if (game)
      process.stdout.write('Controller direction: (Right arrow (right) | Up/down arrow (neutral) | Left Arrow (left) | R button (reset)\n')
    linesToClear = 4 + maxY
  }

  if (!result.match(/2/)) {
    if (game) {
      process.stdout.moveCursor(16, -18)
      process.stdout.write('YOU')
      process.stdout.moveCursor(-3, 1)
      process.stdout.write('WIN')
    }
    console.log(`[Year 2019, Day 13, Part 1] The number of block tiles when the game exits is: ${blockTileCount}`)
    console.log(`[Year 2019, Day 13, Part 2] The score is: ${score}`)
    console.log(`The calculation took ${console.timeEnd('2019day13') / 60} seconds`)
    return true
  }
  if (!visualize) {
    process.stdout.clearLine()
    process.stdout.cursorTo(0)
    const twoCount = result.match(/2/g).length
    if (!twoBeginningCount) twoBeginningCount = twoCount
    process.stdout.write(`${Math.round((twoBeginningCount - twoCount) / twoBeginningCount * 100)}% complete`)
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