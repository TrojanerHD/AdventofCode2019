import { Response } from '../..';

export function main(data: string): Response {
  let array: string[] = data.split(',');
  const firstPart: number | undefined = parseIntCode(array, '1');
  array = data.split(',');
  const secondPart: number | undefined = parseIntCode(array, '5');
  
  const result: Response = [];
  if (firstPart) {
    result.push({message: 'The diagnostic code without the 0s is', value: firstPart.toString()});
  }
  if (secondPart) {
    result.push({message: 'The diagnostic code for system ID 5 is', value: secondPart.toString()});
  }
  return result;
}

function parseIntCode(array: string[], input: string): number | undefined {
  for (let i = 0; i < array.length; i++) {
    let opcode = array[i];
    while (opcode.split('').length < 5) opcode = `0${opcode}`;
    const parameterMode: string[] = opcode.split('');
    const firstParameter: number = +array[i + 1];
    const secondParameter: number = +array[i + 2];
    const overrideParameter: number = +array[i + 3];
    let done = false;
    switch (+opcode.substr(opcode.length - 2, opcode.length - 1)) {
      case 1:
        array[overrideParameter] = (
          (parameterMode[2] === '0'
            ? +array[firstParameter]
            : firstParameter) +
          (parameterMode[1] === '0'
            ? +array[secondParameter]
            : secondParameter)
        ).toString();
        i += 3;
        break;
      case 2:
        array[overrideParameter] = (
          (parameterMode[2] === '0'
            ? +array[firstParameter]
            : firstParameter) *
          (parameterMode[1] === '0'
            ? +array[secondParameter]
            : secondParameter)
        ).toString();
        i += 3;
        break;
      case 3:
        array[firstParameter] = input;
        i += 1;
        break;
      case 4:
        const returnValue: number =
          parameterMode[2] === '0'
            ? +array[firstParameter]
            : firstParameter;
        if (returnValue !== 0) return returnValue;
        i += 1;
        break;
      case 5:
        if (
          (parameterMode[2] === '0'
            ? +array[firstParameter]
            : firstParameter) !== 0
        ) {
          i =
            (parameterMode[1] === '0'
              ? +array[secondParameter]
              : secondParameter) - 1;
        } else i += 2;
        break;
      case 6:
        if (
          (parameterMode[2] === '0'
            ? +array[firstParameter]
            : firstParameter) === 0
        ) {
          i =
            (parameterMode[1] === '0'
              ? +array[secondParameter]
              : secondParameter) - 1;
        } else i += 2;
        break;
      case 7:
        if (
          (parameterMode[2] === '0'
            ? +array[firstParameter]
            : firstParameter) <
          (parameterMode[1] === '0'
            ? +array[secondParameter]
            : secondParameter)
        ) {
          array[overrideParameter] = '1';
        }
        else array[overrideParameter] = '0';
        i += 3;
        break;
      case 8:
        if (
          (parameterMode[2] === '0'
            ? +array[firstParameter]
            : firstParameter) ===
          (parameterMode[1] === '0'
            ? +array[secondParameter]
            : secondParameter)
        ) {
          array[overrideParameter] = '1';
        }
        else array[overrideParameter] = '0';
        i += 3;
        break;
      case 99:
        done = true;
        break;
        default:
          break;
    }
    if (done) return +array[0];
  }
  return;
}
