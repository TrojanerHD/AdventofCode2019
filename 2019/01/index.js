module.exports = main

function main (data) {
  const values = data.split(/\r?\n/g)

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

  return [{ message: 'Total fuel', value: total }, {
    message: 'Total fuel with fuel for fuel etc.',
    value: totalWithFuelForFuel
  }]
}