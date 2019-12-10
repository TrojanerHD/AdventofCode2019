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
  for (const asteroid of asteroids) if (asteroid.length > highestCount) {
    highestCountAsteroid = asteroid
    highestCount = asteroid.length
  }

  const resultPart2 = { x: undefined, y: undefined }
  let count = 0
  while (values.length !== 1) {
    const positiveXAndY = []
    const positiveX = []
    const negativeXAndY = []
    const positiveY = []
    for (const asteroid of highestCountAsteroid) {
      if (asteroid.xPositive)
        if (asteroid.yPositive)
          positiveXAndY.push(asteroid)
        else
          positiveX.push(asteroid)
      else if (asteroid.yPositive)
        positiveY.push(asteroid)
      else
        negativeXAndY.push(asteroid)
    }
    for (const allAsteroids of asteroids) {
      for (const asteroid of allAsteroids) {
        for (let i = 0; i < values.length; i++) {
          const value = values[i]
          if (value.x === asteroid.x && value.y === asteroid.y) values.splice(i, 1)
        }
      }
    }
    for (const positiveXAndYElement of positiveXAndY) {
      if (count === 200) console.log(positiveXAndYElement)
      count++
    }

    for (const positiveX1 of positiveX) {
      if (count === 200) console.log(positiveX1)
      count++
    }

    for (const negativeXAndYElement of negativeXAndY) {
      if (count === 200) console.log(negativeXAndYElement)
      count++
    }

    for (const positiveYElement of positiveY) {
      if (count === 200) console.log(positiveYElement)
      count++
    }

    // resultPart2.x = asteroid.x
    // resultPart2.y = asteroid.y
    asteroids = calculateAsteroids(values)
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
    for (let j = 0; j < values.length; j++) {
      if (i === j) continue
      const endValue = values[j]
      endValue.x -= startValue.x
      endValue.y -= startValue.y

      let gradient = endValue.y / endValue.x
      if (endValue.x === 0) gradient = Infinity
      if (endValue.y === 0) gradient = 0
      let skip = false
      for (const asteroid of visibleAsteroids) {
        if (asteroid.gradient === gradient && asteroid.xPositive === 0 < endValue.x && asteroid.yPositive === 0 < endValue.y) skip = true
      }
      if (skip) continue
      visibleAsteroids.push({
        x: endValue.x,
        y: endValue.y,
        gradient,
        xPositive: 0 < endValue.x,
        yPositive: 0 < endValue.y
      })
    }
    visibleAsteroids.sort((a, b) => a.gradient < b.gradient ? 1 : -1)
    allAsteroids.push(visibleAsteroids)
  }
  return allAsteroids
}