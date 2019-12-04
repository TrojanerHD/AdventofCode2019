module.exports = main

function main () {
  let currentInput = 145852
  const maxInput = 616942
  let solutionNumber = 0,
    solutionNumberPart2 = 0
  while (currentInput <= maxInput) {
    let lastValue = 0,
      valueBeforeLast
    let skip = false
    let notSkip = false
    let hasDouble = false
    let doubleValue
    for (const digit of currentInput.toString().split('')) {
      if (parseInt(digit) < lastValue) {
        skip = true
        break
      }
      if (parseInt(digit) === lastValue) {
        notSkip = true
        if (!doubleValue || doubleValue === lastValue) {
          if (valueBeforeLast)
            hasDouble = lastValue !== valueBeforeLast
          else hasDouble = true

          if (hasDouble) doubleValue = lastValue
          else doubleValue = undefined
        }
      }
      valueBeforeLast = lastValue
      lastValue = parseInt(digit)
    }
    currentInput++
    if (skip || !notSkip) continue
    solutionNumber++
    if (hasDouble) solutionNumberPart2++
  }
  console.log(`[Day 4] Part 1: The number of possible solutions is ${solutionNumber}`)
  console.log(`[Day 4] Part 2: The number of possible solutions is ${solutionNumberPart2}`)
}