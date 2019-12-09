module.exports = main

function main (data) {
  const values = data.split(/\r?\n/g)
  let currentInput = values[0]
  const maxInput = values[1]
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
  const message = 'The number of possible solutions is'
  return [{ message, value: solutionNumber }, { message, value: solutionNumberPart2 }]
}