const fs = require('fs')

class CoordinateSystem {
  constructor () {
    this._values = [{ x: 0, y: 0 }]
  }

  pointExists (point) {
    if (point.x === 0 && point.y === 0) return false
    for (const value of this._values)
      if (value.x === point.x && value.y === point.y) return true
    return false
  }

  generateToPoint (direction, value) {
    const { x, y } = this._values[this._values.length - 1]
    let count = 0
    switch (direction) {
      case 'R':
        while (count !== parseInt(value)) {
          count++
          this._values.push({ x: x + count, y })
        }
        break
      case 'L':
        while (count !== parseInt(value)) {
          count++
          this._values.push({ x: x - count, y })
        }
        break
      case 'U':
        while (count !== parseInt(value)) {
          count++
          this._values.push({ x, y: y + count })
        }
        break
      case 'D':
        while (count !== parseInt(value)) {
          count++
          this._values.push({ x, y: y - count })
        }
        break
    }
  }
}

module.exports = main

function main () {
  fs.readFile('./values.txt', 'utf8', (err, data) => {
    if (err) {
      console.error(err)
      return
    }
    const allDirections = [
      data.split('\n')[0].split(','),
      data.split('\n')[1].split(',')
    ]
    // allDirections[0]
    const firstValues = new CoordinateSystem()
    // allDirections[1]
    const secondValues = new CoordinateSystem()
    let count = 0
    for (const directions of allDirections) {
      for (const direction of directions) {
        const value = direction.substr(1, direction.length - 1)
        const directionString = direction.substr(0, 1)
        if (count === 0) firstValues.generateToPoint(directionString, value)
        else secondValues.generateToPoint(directionString, value)
      }
      count++
    }
    let minimumDistance
    for (const point of firstValues._values) {
      if (secondValues.pointExists(point)) {
        const pointDistance = Math.abs(point.x) + Math.abs(point.y)
        if (!minimumDistance || pointDistance < minimumDistance) {
          minimumDistance = pointDistance
        }
      }
    }
    console.log(`[Day 3] The minimum count to the next intersection is ${minimumDistance}`)
  })
}