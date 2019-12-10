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

  const allAsteroids = []
  for (let i = 0; i < values.length; i++) {
    const visibleAsteroids = []
    const startValue = values[i]
    for (let j = 0; j < values.length; j++) {
      if (i === j) continue
      const endValue = values[j]
      let result = (endValue.y - startValue.y) / (endValue.x - startValue.x)
      if (endValue.x - startValue.x === 0) result = Infinity
      if (endValue.y === startValue.y) result = 0
      const b = startValue.y - result * startValue.x
      let skip = false
      for (const asteroid of visibleAsteroids) {
        if (asteroid.result === result && asteroid.b === b && asteroid.xPositive === startValue.x < endValue.x && asteroid.yPositive === startValue.y < endValue.y) skip = true
      }
      if (skip) continue
      visibleAsteroids.push({ result, b, xPositive: startValue.x < endValue.x, yPositive: startValue.y < endValue.y })
    }
    allAsteroids.push({ x: startValue.x, y: startValue.y, visibleAsteroids: visibleAsteroids.length })
  }

  let highestCount = 0
  for (const asteroid of allAsteroids) if (asteroid.visibleAsteroids > highestCount) highestCount = asteroid.visibleAsteroids
  return [{ message: 'Test', value: highestCount }]
}