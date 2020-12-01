export function main (data) {

  const firstHalf = draw(data, 0)
  const secondHalf = draw(data, 1)
  return [{
    message: 'The number of panels the robot paints at least once is',
    value: firstHalf.pixels
  }, { message: 'The produced image', value: secondHalf.image }]
}
function draw(data, startColor) {
  const coordinates = []
  const robot = { x: 0, y: 0, direction: 0 }
  const intCode = new IntCode(data.split(','))
  intCode.parse()
  let outputCount = 0
  while (intCode._requiresInput) {
    let color = outputCount === 0 ? startColor : 0
    let coordinateFound
    for (let i = 0; i < coordinates.length; i++) {
      const coordinate = coordinates[i]
      if (coordinate.x === robot.x && coordinate.y === robot.y) {
        color = coordinate.color
        coordinateFound = i
        break
      }
    }
    intCode._array[intCode._requiresInput] = color
    intCode.parse()
    if (coordinateFound !== undefined)
      coordinates[coordinateFound].color = intCode._output[outputCount]
    else
      coordinates.push({ x: robot.x, y: robot.y, color: intCode._output[outputCount] })
    if (intCode._output[outputCount + 1] === 0) {
      robot.direction -= 90
      if (robot.direction === -90) robot.direction = 270
    } else {
      robot.direction += 90
      if (robot.direction === 360) robot.direction = 0
    }
    switch (robot.direction) {
      case 0:
        robot.y += 1
        break
      case 90:
        robot.x += 1
        break
      case 180:
        robot.y -= 1
        break
      case 270:
        robot.x -= 1
        break
    }
    outputCount += 2
  }
  let maxY = 0
  let minY = Infinity
  let minX = Infinity
  let maxX = 0
  for (const coordinate of coordinates) {
    if (coordinate.y > maxY) maxY = coordinate.y
    if (coordinate.y < minY) minY = coordinate.y
    if (coordinate.x < minX) minX = coordinate.x
    if (coordinate.x > maxX) maxX = coordinate.x
  }
  let countX = minX
  let countY = maxY
  let result = '\n'
  while (countY !== minY - 1) {
    let isCoordinate = false
    for (const coordinate of coordinates) {
      if (countX === coordinate.x && countY === coordinate.y && coordinate.color === 1) {
        result += '█'
        isCoordinate = true
        break
      }
    }
    if (!isCoordinate) result += ' '
    countX++
    if (countX === maxX) {
      countX = 0
      countY--
      result += '\n'
    }
  }
  return {pixels: coordinates.length, image: result};
}


class IntCode {
  _array;
  private _relativeBase;
  _output;
   _i;
  _requiresInput;
  constructor (array) {
    this._array = array
    this._relativeBase = 0
    this._output = []
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
          this._requiresInput = false
          done = true
          break
      }
      if (done) return
    }
  }
}