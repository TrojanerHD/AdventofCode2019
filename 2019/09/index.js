const fs = require('fs')

module.exports = main

function main () {
  fs.readFile('./values.txt', 'utf8', (err, data) => {
    if (err) {
      console.error(err)
      return
    }

    const intcode = new intCode(data.split(','), '1')
    intcode.parse()
    for (const output of intcode._output) console.log(output)
  })
}

class intCode {
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
      switch (parameterMode[2]) {
        case '0':
          firstParameter = this._array[parseInt(this._array[i + 1])]
          break
        case '1':
          firstParameter = this._array[i + 1]
          break
        case '2':
          firstParameter = this._array[this._relativeBase + parseInt(this._array[i + 1])]
          break
      }
      switch (parameterMode[1]) {
        case '0':
          secondParameter = this._array[parseInt(this._array[i + 2])]
          break
        case '1':
          secondParameter = this._array[i + 2]
          break
        case '2':
          secondParameter = this._array[this._relativeBase + parseInt(this._array[i + 2])]
          break
      }
      if (firstParameter === undefined) firstParameter = 0
      else firstParameter = parseInt(firstParameter)
      if (secondParameter === undefined) secondParameter = 0
      else secondParameter = parseInt(secondParameter)
      const overrideParameter = parseInt(this._array[i + 3])
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
          this._array[firstParameter] = this._input
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