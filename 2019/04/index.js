module.exports = main

function main () {
  let currentInput = 145852
  const maxInput = 616942
  let solutionNumber = 0
  while (currentInput <= maxInput) {
    let maxValue = 0
    let skip = false
    let notSkip = false
    for (const digit of currentInput.toString().split('')) {
      if (parseInt(digit) < maxValue) {
        skip = true
        break
      }
      if (!notSkip && parseInt(digit) === maxValue) notSkip = true
      maxValue = parseInt(digit)
    }
    currentInput++
    if (skip || !notSkip) continue
    solutionNumber++
  }
  console.log(`[Day 4] Part 1: The number of possible solutions is ${solutionNumber}`)
}