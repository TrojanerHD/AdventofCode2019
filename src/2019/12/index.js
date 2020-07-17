const _ = require('lodash')

module.exports = main

function main (data) {
  const moons = []
  const steps = []

  for (const moon of data.split(/\r?\n/g)) {
    const x = parseInt(moon.match(/(?<=x=).+?(?=,)/)[0])
    const y = parseInt(moon.match(/(?<=y=).*(?=,)/)[0])
    const z = parseInt(moon.match(/(?<=z=).*(?=>)/)[0])
    moons.push({ moon: { x, y, z }, velocity: { x: 0, y: 0, z: 0 } })
  }

  let totalEnergy = 0
  let count = 0
  const countOnRepeat = {}
  while (true) {
    for (let i = 0; i < moons.length; i++) {
      const moon = moons[i]
      for (let j = 0; j < moons.length; j++) {
        if (j === i) continue
        const secondMoon = moons[j]
        for (const coordinate of ['x', 'y', 'z']) {
          if (moon.moon[coordinate] > secondMoon.moon[coordinate]) {
            moon.velocity[coordinate]--
          } else if (moon.moon[coordinate] < secondMoon.moon[coordinate]) {
            moon.velocity[coordinate]++
          }
        }
      }
    }
    for (const moon of moons) {
      moon.moon.x += moon.velocity.x
      moon.moon.y += moon.velocity.y
      moon.moon.z += moon.velocity.z
      if (count !== 999) continue
      totalEnergy += (Math.abs(moon.moon.x) + Math.abs(moon.moon.y) + Math.abs(moon.moon.z)) * (Math.abs(moon.velocity.x) + Math.abs(moon.velocity.y) + Math.abs(moon.velocity.z))
    }

    for (const coordinate of ['x', 'y', 'z']) {
      let sameMoon = [false, false, false, false]
      for (let i = 0; i < moons.length; i++) {
        let moon = moons[i]
        if (steps[0])
          if (moon.moon[coordinate] === steps[0][i].moon[coordinate] && moon.velocity[coordinate] === steps[0][i].velocity[coordinate]) sameMoon[i] = true
        if (!sameMoon.includes(false))
          if (!countOnRepeat[coordinate])
            countOnRepeat[coordinate] = count
      }
    }

    if (countOnRepeat.x && countOnRepeat.y && countOnRepeat.z) {
      const xAndY = lcm_two_numbers(countOnRepeat.x, countOnRepeat.y)
      const result = lcm_two_numbers(xAndY, countOnRepeat.z)
      return [{
        message: 'The total energy after 1000 steps',
        value: totalEnergy
      }, {
        message: 'It takes the following count of steps to reach the first state that exactly matches a previous state',
        value: result
      }]
    }

    steps.push(_.cloneDeep(moons))
    count++
  }
}

// Source: https://www.w3resource.com/javascript-exercises/javascript-math-exercise-10.php
function lcm_two_numbers (x, y) {
  if ((typeof x !== 'number') || (typeof y !== 'number'))
    return false
  return (!x || !y) ? 0 : Math.abs((x * y) / gcd_two_numbers(x, y))
}

function gcd_two_numbers (x, y) {
  x = Math.abs(x)
  y = Math.abs(y)
  while (y) {
    const t = y
    y = x % y
    x = t
  }
  return x
}