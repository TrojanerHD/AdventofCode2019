import { Response } from '../..';

export function main(data: string): Response {
  //Part 1
  const firstPartArray: string[] = data.split(',');
  firstPartArray[1] = '12';
  firstPartArray[2] = '2';

  //Part 2
  let array: string[] = data.split(',');

  let firstElementCounter = 0;
  let secondElementCounter = 0;
  let result: number | undefined;
  while (firstElementCounter <= 99 && secondElementCounter <= 99) {
    array[1] = firstElementCounter.toString();
    array[2] = secondElementCounter.toString();
    const parsedCode: string | undefined = parseIntCode(array);
    if (parsedCode && +parsedCode === 19690720) {
      result = 100 * firstElementCounter + secondElementCounter;
    }

    array = data.split(',');
    if (firstElementCounter < 99) firstElementCounter++;
    else {
      firstElementCounter = 0;
      secondElementCounter++;
    }
  }
  const firstPartValue: string | undefined = parseIntCode(firstPartArray);
  if (!result && firstPartValue) {
    return [
      {
        message: "The first element's value is",
        value: firstPartValue,
      },
    ];
  }
  if (result && firstPartValue) {
    return [
      {
        message: "The first element's value is",
        value: firstPartValue,
      },
      {
        message: 'Calculated answer (100 * noun + verb)',
        value: result.toString(),
      },
    ];
  }
  return;
}

function parseIntCode(array: string[]): string | undefined {
  let count = 0;
  for (const opcode of array) {
    if (count % 4 === 0) {
      const firstElement: number = +array[count + 1];
      const secondElement: number = +array[count + 2];
      const overrideElement: number = +array[count + 3];
      let done = false;
      switch (+opcode) {
        case 1:
          array[overrideElement] = (
            +array[firstElement] + +array[secondElement]
          ).toString();
          break;
        case 2:
          array[overrideElement] = (
            +array[firstElement] * +array[secondElement]
          ).toString();
          break;
        case 99:
          done = true;
          break;
        default:
          break;
      }
      if (done) return array[0];
    }
    count++;
  }
  return;
}
