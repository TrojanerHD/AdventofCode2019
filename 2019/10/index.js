const _ = require('lodash')

module.exports = main

function main (data) {
  const values = []
  let y = 0
  for (const row of data.split(/\r?\n/g)) {
    let x = 0
    for (const char of row.split('')) {
      if (char === '#')
        values.push({ x, y })
      x++
    }
    y++
  }

  let asteroids = calculateAsteroids(values)
  let highestCount = 0
  let highestCountAsteroid = {}
  for (const asteroid of asteroids) if (asteroid.visibleAsteroids.length > highestCount) {
    highestCountAsteroid = asteroid
    highestCount = asteroid.visibleAsteroids.length
  }

  const resultPart2 = { x: undefined, y: undefined }
  let count = 0
  let done = false
  while (values.length > 1) {
    const positiveXAndY = []
    const positiveX = []
    const negativeXAndY = []
    const positiveY = []
    for (const asteroid of highestCountAsteroid.visibleAsteroids) {
      if (asteroid.xNotNegative)
        if (asteroid.yNotNegative)
          positiveXAndY.push(asteroid)
        else
          positiveX.push(asteroid)
      else if (asteroid.yNotNegative)
        positiveY.push(asteroid)
      else
        negativeXAndY.push(asteroid)
    }

    for (const allAsteroids of asteroids) {
      for (const asteroid of allAsteroids.visibleAsteroids) {
        for (let i = 0; i < values.length; i++) {
          const value = values[i]
          if (value.x === asteroid.x && value.y === asteroid.y) values.splice(i, 1)
        }
      }
    }

    for (const positiveX1 of positiveX) {
      if (count === 200) {
        resultPart2.x = highestCountAsteroid.startValue.x + positiveX1.x
        resultPart2.y = highestCountAsteroid.startValue.y + positiveX1.y
        done = true
      }
      count++
    }

    for (const positiveYElement of positiveY) {
      if (count === 200) {
        resultPart2.x = highestCountAsteroid.startValue.x + positiveYElement.x
        resultPart2.y = highestCountAsteroid.startValue.y + positiveYElement.y
        done = true
      }
      count++
    }

    for (const positiveXAndYElement of positiveXAndY) {
      if (count === 200) {
        resultPart2.x = highestCountAsteroid.startValue.x + positiveXAndYElement.x
        resultPart2.y = highestCountAsteroid.startValue.y + positiveXAndYElement.y
        done = true
      }
      count++
    }

    for (const negativeXAndYElement of negativeXAndY) {
      if (count === 199) {
        resultPart2.x = highestCountAsteroid.startValue.x + negativeXAndYElement.x
        resultPart2.y = highestCountAsteroid.startValue.y + negativeXAndYElement.y
        done = true
      }
      count++
    }

    if (done) break

    // resultPart2.x = asteroid.x
    // resultPart2.y = asteroid.y
    asteroids = calculateAsteroids(values)
    for (const asteroid of asteroids) {
      if (asteroid.startValue.x === highestCountAsteroid.x && asteroid.startValue.y === highestCountAsteroid.y) highestCountAsteroid = asteroid
    }
  }

  return [{
    message: 'The highest count of asteroids is',
    value: highestCount
  }, { message: 'The 200th asteroid to be vaporized (100* x + y) is at', value: resultPart2.x * 100 + resultPart2.y }]
}

function calculateAsteroids (values) {
  const allAsteroids = []
  for (let i = 0; i < values.length; i++) {
    const visibleAsteroids = []
    const startValue = values[i]
    // console.log(`New Asteroid: ${startValue.x}|${startValue.y}`)
    for (let j = 0; j < values.length; j++) {
      if (i === j) continue
      let endValue = values[j]
      const tempEndValue = _.clone(endValue)
      endValue.x -= startValue.x
      endValue.y -= startValue.y

      let gradient = endValue.y / endValue.x
      if (endValue.x === 0) gradient = Infinity
      if (endValue.y === 0) gradient = 0
      let skip = false
      for (let k = 0; k < visibleAsteroids.length; k++) {
        const asteroid = visibleAsteroids[k]
        if (asteroid.gradient === gradient && asteroid.xNotNegative === 0 <= endValue.x && asteroid.yNotNegative === 0 <= endValue.y) {
          const distance1 = pointDistance({ x: 0, y: 0 }, asteroid)
          const distance2 = pointDistance({ x: 0, y: 0 }, endValue)
          if (distance1 > distance2) {
            // console.log(`Removed ${asteroid.x}|${asteroid.y}`)
            visibleAsteroids.splice(k, 1)
          } else
            skip = true
        }
      }
      if (skip) {
        endValue.x = tempEndValue.x
        endValue.y = tempEndValue.y
        continue
      }
      // console.log(`Added ${endValue.x}|${endValue.y}`)
      visibleAsteroids.push({
        x: endValue.x,
        y: endValue.y,
        gradient,
        xNotNegative: 0 <= endValue.x,
        yNotNegative: 0 <= endValue.y
      })
      endValue.x = tempEndValue.x
      endValue.y = tempEndValue.y
    }
    visibleAsteroids.sort((a, b) => a.gradient > b.gradient ? 1 : -1)
    // console.log(`So, there are ${visibleAsteroids.length} asteroids in direct sight`)
    allAsteroids.push({ startValue, visibleAsteroids })
  }
  return allAsteroids
}

function pointDistance (point1, point2) {
  return Math.sqrt(Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2))
}