module.exports = main

function main (data) {
  const moons = []

  for (const moon of data.split(/\r?\n/g)) {
    const x = parseInt(moon.match(/(?<=x=).+?(?=,)/)[0])
    const y = parseInt(moon.match(/(?<=y=).*(?=,)/)[0])
    const z = parseInt(moon.match(/(?<=z=).*(?=>)/)[0])
    moons.push({ moon: { x, y, z }, velocity: { x: 0, y: 0, z: 0 } })
  }

  let totalEnergy = 0
  let count = 0
  while (count !== 1000) {
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
    totalEnergy = 0
    for (const moon of moons) {
      moon.moon.x += moon.velocity.x
      moon.moon.y += moon.velocity.y
      moon.moon.z += moon.velocity.z
      totalEnergy += (Math.abs(moon.moon.x) + Math.abs(moon.moon.y) + Math.abs(moon.moon.z)) * (Math.abs(moon.velocity.x) + Math.abs(moon.velocity.y) + Math.abs(moon.velocity.z))
    }
    count++
  }
  return [{ message: 'The total energy after 1000 steps', value: totalEnergy }]
}