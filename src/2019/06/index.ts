import { Response } from '../..';

interface Results {
  [key: string]: string[];
}
type Trace = { values: string; count: number } | undefined;

export function main(data: string): Response {
  const orbitMap = data.split(/\r?\n/g);
  const results: Results = {};

  for (const orbit of orbitMap) {
    const orbitSplit = orbit.split(')');
    if (results[orbitSplit[0]] === undefined) results[orbitSplit[0]] = [];
    results[orbitSplit[0]].push(orbitSplit[1]);
  }

  let san: Trace, you: Trace;
  let result: number | undefined;
  for (const key of Object.keys(results)) {
    let skip = false;
    for (const value of Object.values(results)) {
      if (value.includes(key)) {
        skip = true;
        break;
      }
    }
    if (results[key].includes('SAN')) {
      san = traceBack(results, key, 'COM');
    }
    if (results[key].includes('YOU')) {
      you = traceBack(results, key, 'COM');
    }
    const total = [];
    if (you && san) {
      const youSplit = you.values.split(','),
        sanSplit = san.values.split(',');
      total.push(youSplit.filter(element => sanSplit.includes(element)));
      result =
        (you.values.split(total[0][0])[0].match(/,/g) || []).length +
        (san.values.split(total[0][0])[0].match(/,/g) || []).length;
      you = undefined;
      san = undefined;
    }
    if (skip) continue;
    if (!result) continue;
    const orbits: number = getOrbits(results, key, 0);
    return [
      {
        message: 'The number of indirect and direct orbits is',
        value: orbits.toString(),
      },
      {
        message:
          'At least the following count of steps is required to get from YOU to SAN',
        value: result.toString(),
      },
    ];
  }
  return;
}

function getOrbits(results: Results, key: string, indentation: number): number {
  let count = 0;
  const valueArray = results[key];
  if (valueArray === undefined) return count;
  indentation++;
  for (const value of valueArray) {
    count += indentation;
    count += getOrbits(results, value, indentation);
  }
  return count;
}

function traceBack(results: Results, value: string, ending: string): Trace {
  let values = '';
  let count = 0;
  for (const key of Object.keys(results)) {
    if (results[key].includes(value)) {
      count++;
      if (key === ending) {
        values += `${value},${key}`;
        break;
      }
      const trace: Trace = traceBack(results, key, ending);
      values += `${value},${trace!.values}`;
      count += trace!.count;
    }
  }
  return { values, count };
}
