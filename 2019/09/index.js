module.exports = main

function main (data) {
  const results = []
  for (const input of ['1', '2']) {
    const intcode = new IntCode(data.split(','), input)
    intcode.parse()
    results.push(intcode._output[0])
  }
  return [{
    message: 'The BOOST keycode is',
    value: results[0]
  }, { message: 'The coordinates of the distress signals are', value: results[1] }]
}

class IntCode {
  constructor (array, input) {
    this._array = array
    this._input = input
    this._relativeBase = 0
    this._output = []
  }

  parse () {
    for (let i = 0; i < this._array.length; i++) {
      let opcode = this._array[i]
      while (opcode.split('').length < 5) opcode = `0${opcode}`
      const parameterMode = opcode.split('')
      let firstParameter
      let secondParameter
      let overrideParameter
      let firstParameterAccessor
      let secondParameterAccessor
      switch (parameterMode[2]) {
        case '0':
          firstParameterAccessor = parseInt(this._array[i + 1])
          firstParameter = this._array[firstParameterAccessor]
          break
        case '1':
          firstParameterAccessor = i + 1
          firstParameter = this._array[firstParameterAccessor]
          break
        case '2':
          firstParameterAccessor = this._relativeBase + parseInt(this._array[i + 1])
          firstParameter = this._array[firstParameterAccessor]
          break
      }
      switch (parameterMode[1]) {
        case '0':
          secondParameterAccessor = parseInt(this._array[i + 2])
          secondParameter = this._array[secondParameterAccessor]
          break
        case '1':
          secondParameterAccessor = i + 2
          secondParameter = this._array[secondParameterAccessor]
          break
        case '2':
          secondParameterAccessor = this._relativeBase + parseInt(this._array[i + 2])
          secondParameter = this._array[secondParameterAccessor]
          break
      }

      switch (parameterMode[0]) {
        case '0':
          overrideParameter = parseInt(this._array[i + 3])
          break
        case '1':
          overrideParameter = i + 3
          break
        case '2':
          overrideParameter = this._relativeBase + parseInt(this._array[i + 3])
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
          i += 3
          break
        case 2:
          this._array[overrideParameter] = (firstParameter * secondParameter).toString()
          i += 3
          break
        case 3:
          this._array[firstParameterAccessor] = this._input
          i += 1
          break
        case 4:
          this._output.push(firstParameter)
          i += 1
          break
        case 5:
          if (firstParameter !== 0) i = secondParameter - 1
          else i += 2
          break
        case 6:
          if (firstParameter === 0) i = secondParameter - 1
          else i += 2
          break
        case 7:
          if (firstParameter < secondParameter) this._array[overrideParameter] = '1'
          else this._array[overrideParameter] = '0'
          i += 3
          break
        case 8:
          if (firstParameter === secondParameter) this._array[overrideParameter] = '1'
          else this._array[overrideParameter] = '0'
          i += 3
          break
        case 9:
          this._relativeBase += firstParameter
          i += 1
          break
        case 99:
          done = true
          break
      }
      if (done) return
    }
  }
}