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

  multiplePointsOnSamePosition (point) {
    for (let i = 0; i < this._values.length; i++) {
      if (this._values[i].x === point.x && this._values[i].y === point.y) {
        return i
      }
    }
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
    for (const point of firstValues._values)
      if (secondValues.pointExists(point)) {
        const pointDistance = Math.abs(point.x) + Math.abs(point.y)
        if (!minimumDistance || pointDistance < minimumDistance) minimumDistance = pointDistance
      }
    console.log(`[Day 3] Part 1: The next intersection with the smallest Manhattan distance is ${minimumDistance}`)
    let steps = 0
    let bestSteps = { first: Infinity, second: Infinity }
    for (let i = 0; i < firstValues._values.length; i++) {
      const otherPoint = secondValues.multiplePointsOnSamePosition(firstValues._values[i])
      if (otherPoint) {

        // let currentX = values._values[i].x,
        //   currentY = values._values[i].y
        // while (firstValues._values[steps] !== firstValues._values[i]) {
        //   steps++
        /*const shortCutExists = values.multiplePointsOnSamePosition({
          x: values._values[i - steps].x,
          y: values._values[i - steps].y
        })
        if (shortCutExists) {
          currentX = values._values[shortCutExists].x
          currentY = values._values[shortCutExists].y
        } else {*/
        // currentX = values._values[i - steps].x
        // currentY = values._values[i - steps].y
        // }
        if (bestSteps.first + bestSteps.second > i + otherPoint) {
          bestSteps.first = i
          bestSteps.second = otherPoint
        }
      }

      // }
    }
    console.log(`[Day 3] Part 2: In total, it requires ${bestSteps.first + bestSteps.second} steps to get to the central point`)
  })
}

function calculateSteps (values, otherValues) {

}