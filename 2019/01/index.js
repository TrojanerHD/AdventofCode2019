const fs = require('fs')

module.exports = main

function main () {
  fs.readFile('./values.txt', 'utf8', (err, data) => {
    if (err) {
      console.error(err)
      return
    }

    const values = data.split('\n')

    //Total calculation for first half of the puzzle
    let total = 0
    let totalWithFuelForFuel = 0
    for (let value of values) {
      let fuel = Math.floor(parseInt(value) / 3) - 2
      total += fuel
      while (fuel > 0) {
        const oldFuel = fuel
        fuel = Math.floor(fuel / 3) - 2
        totalWithFuelForFuel += oldFuel
      }
    }

    console.log(`[Day 1] Total fuel (part 1 of the puzzle): ${total}`)
    console.log(`[Day 1] Total fuel with fuel for fuel etc. (part 2 of the puzzle): ${totalWithFuelForFuel}`)
  })
}