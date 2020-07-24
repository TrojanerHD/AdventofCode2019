import { Response } from '../..';

let partOneDone = false,
  partTwoDone = false,
  partTwoResult = Number.NEGATIVE_INFINITY;
const result: Response = [];
type Highest = number | 'done' | undefined;

export function main(data: string): Response {
  let initialPhaseSettings: string[] = ['0', '1', '2', '3', '4'];
  let phaseSettings: string[] = ['1', '0', '2', '3', '4'];
  let highestCount: Highest = 0;
  highestCount = getResult(data, initialPhaseSettings, highestCount, true);
  highestCount = getResult(data, phaseSettings, highestCount);
  // noinspection InfiniteLoopJS
  while (!partOneDone) {
    highestCount = secondSwapElements(phaseSettings, highestCount, data);
    highestCount = thirdSwapElements(phaseSettings, highestCount, data);
    highestCount = fourthSwapElements(phaseSettings, highestCount, data);
    highestCount = thirdSwapElements(phaseSettings, highestCount, data);
    highestCount = secondSwapElements(phaseSettings, highestCount, data);
  }

  initialPhaseSettings = ['5', '6', '7', '8', '9'];
  phaseSettings = ['6', '5', '7', '8', '9'];
  highestCount = 0;
  highestCount = getResult(data, initialPhaseSettings, highestCount, true);
  highestCount = getResult(data, phaseSettings, highestCount);
  while (!partTwoDone) {
    highestCount = secondSwapElements(phaseSettings, highestCount, data);
    highestCount = thirdSwapElements(phaseSettings, highestCount, data);
    highestCount = fourthSwapElements(phaseSettings, highestCount, data);
    highestCount = thirdSwapElements(phaseSettings, highestCount, data);
    highestCount = secondSwapElements(phaseSettings, highestCount, data);
    highestCount = fourthSwapElements(phaseSettings, highestCount, data);
  }
  return result;
}

function getResult(
  data: string,
  phaseSettings: string[],
  oldHighest: Highest,
  first = false,
  a: ParseIntCode | undefined = undefined,
  b: ParseIntCode | undefined = undefined,
  c: ParseIntCode | undefined = undefined,
  d: ParseIntCode | undefined = undefined,
  e: ParseIntCode | undefined = undefined
): Highest {
  if (
    !first &&
    !partOneDone &&
    JSON.stringify(phaseSettings) === '["0","1","2","3","4"]' &&
    oldHighest
  ) {
    result!.push({
      message: 'Highest signal that can be sent to the thrusters',
      value: oldHighest.toString(),
    });
    partOneDone = true;
    return 'done';
  }

  if (
    !first &&
    !partTwoDone &&
    JSON.stringify(phaseSettings) === '["5","6","7","8","9"]'
  ) {
    result!.push({
      message: 'Highest signal that can be sent to the thrusters',
      value: partTwoResult.toString(),
    });
    partTwoDone = true;
    return 'done';
  }

  if (!a || !b || !c || !d || !e) {
    a = new ParseIntCode(data.split(','));
    b = new ParseIntCode(data.split(','));
    c = new ParseIntCode(data.split(','));
    d = new ParseIntCode(data.split(','));
    e = new ParseIntCode(data.split(','));
  }
  a.parse([phaseSettings[0], e._output ? e._output : '0']);
  b.parse([phaseSettings[1], a._output!]);
  c.parse([phaseSettings[2], b._output!]);
  d.parse([phaseSettings[3], c._output!]);
  e.parse([phaseSettings[4], d._output!]);

  if (e._done && partOneDone) {
    if (partTwoResult < +e._output!) {
      partTwoResult = +e._output!;
    }
    return;
  }

  if (partOneDone) {
    return getResult(data, phaseSettings, oldHighest, first, a, b, c, d, e);
  }
  return +e._output! > +oldHighest! ? +e._output! : oldHighest;
}

function swapElements(list: string[], elem1: Highest, elem2: string) {
  if (typeof elem1 !== 'number') throw new Error('elem1 is not a number');
  const b: string = list[elem1];
  list[elem1] = list[+elem2];
  list[+elem2] = b;
}

function secondSwapElements(
  list: string[],
  oldHighest: Highest,
  data: string
): Highest {
  swapElements(list, 1, '2');
  oldHighest = getResult(data, list, oldHighest);
  if (oldHighest === 'done') return;
  swapElements(list, 0, '1');
  oldHighest = getResult(data, list, oldHighest);
  return oldHighest;
}

function thirdSwapElements(
  list: string[],
  oldHighest: Highest,
  data: string
): Highest {
  swapElements(list, 2, '3');
  oldHighest = getResult(data, list, oldHighest);
  swapElements(list, 0, '1');
  oldHighest = getResult(data, list, oldHighest);
  oldHighest = secondSwapElements(list, oldHighest, data);
  return oldHighest;
}

function fourthSwapElements(
  list: string[],
  oldHighest: Highest,
  data: string
): Highest {
  swapElements(list, 3, '4');
  oldHighest = getResult(data, list, oldHighest);
  swapElements(list, 0, '1');
  oldHighest = getResult(data, list, oldHighest);
  oldHighest = thirdSwapElements(list, oldHighest, data);
  return oldHighest;
}

class ParseIntCode {
  private _i: number;
  private _array: string[];
  _done: boolean;
  _output: string | undefined = undefined;
  private _secondParameter: number | undefined = undefined;
  private _parameterMode: string[] | undefined = undefined;
  constructor(array: string[]) {
    this._i = 0;
    this._array = array;
    this._done = false;
  }

  parse(input: string[]): undefined {
    let inputCount = 0;
    for (let i = this._i; i < this._array.length; i++) {
      let opcode = this._array[i];
      while (opcode.split('').length < 5) opcode = `0${opcode}`;
      this._parameterMode = opcode.split('');
      const firstParameter: number = +this._array[i + 1];
      this._secondParameter = +this._array[i + 2];
      const overrideParameter: number = +this._array[i + 3];
      let done = false;
      switch (+opcode.substr(opcode.length - 2, opcode.length - 1)) {
        case 1:
          this._array[overrideParameter] = (
            this.getEntry(2) +
            (this._parameterMode[1] === '0'
              ? +this._array[this._secondParameter]
              : this._secondParameter)
          ).toString();
          i += 3;
          break;
        case 2:
          this._array[overrideParameter] = (
            this.getEntry(2) * this.getEntry(1)
          ).toString();
          i += 3;
          break;
        case 3:
          this._array[firstParameter] = input[this._i === 0 ? inputCount : 1];
          if (inputCount < 1) inputCount++;
          i++;
          break;
        case 4:
          this._output = this.getEntry(2).toString();
          if (partOneDone) {
            this._i = i + 2;
            return;
          }
          i += 1;
          break;
        case 5:
          if (this.getEntry(2) !== 0) {
            i = this.getEntry(1) - 1;
          } else i += 2;
          break;
        case 6:
          if (this.getEntry(2) === 0) {
            i = this.getEntry(2) - 1;
          } else i += 2;
          break;
        case 7:
          if (this.getEntry(2) < this.getEntry(1)) {
            this._array[overrideParameter] = '1';
          } else this._array[overrideParameter] = '0';
          i += 3;
          break;
        case 8:
          if (this.getEntry(2) === this.getEntry(1)) {
            this._array[overrideParameter] = '1';
          } else this._array[overrideParameter] = '0';
          i += 3;
          break;
        case 99:
          done = true;
          break;
        default:
          break;
      }
      this._done = done;
      if (done) return;
    }
    return;
  }

  private getEntry(parameter: number): number {
    if (!this._secondParameter) {
      throw new Error('_secondParameter is not defined');
    }
    if (!this._parameterMode) {
      throw new Error('_parameterMode is not defined');
    }
    return this._parameterMode[parameter] === '0'
      ? +this._array[this._secondParameter]
      : this._secondParameter;
  }
}
