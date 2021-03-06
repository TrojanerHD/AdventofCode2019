import { Response } from '../..';

export function main(data: string): Response {
  const values: string[] = data.split(/\r?\n/g);
  let currentInput: number = +values[0];
  const maxInput: number = +values[1];
  let solutionNumber = 0,
    solutionNumberPart2 = 0;
  while (currentInput <= maxInput) {
    let lastValue = 0,
      valueBeforeLast: number | undefined;
    let skip = false;
    let notSkip = false;
    let hasDouble = false;
    let doubleValue: number | undefined;
    for (const digit of currentInput.toString().split('')) {
      if (+digit < lastValue) {
        skip = true;
        break;
      }
      if (+digit === lastValue) {
        notSkip = true;
        if (!doubleValue || doubleValue === lastValue) {
          if (valueBeforeLast) {
            hasDouble = lastValue !== valueBeforeLast;
          } else hasDouble = true;

          if (hasDouble) doubleValue = lastValue;
          else doubleValue = undefined;
        }
      }
      valueBeforeLast = lastValue;
      lastValue = +digit;
    }
    currentInput++;
    if (skip || !notSkip) continue;
    solutionNumber++;
    if (hasDouble) solutionNumberPart2++;
  }
  const message = 'The number of possible solutions is';
  return [
    { message, value: solutionNumber.toString() },
    { message, value: solutionNumberPart2.toString() },
  ];
}
