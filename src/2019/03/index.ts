import { Response } from '../..';

interface Point {
  x: number;
  y: number;
}
type Direction = 'R' | 'U' | 'D' | 'L';

class CoordinateSystem {
  _values: Point[];

  constructor() {
    this._values = [{ x: 0, y: 0 }];
  }

  pointExists(point: Point) {
    if (point.x === 0 && point.y === 0) return false;
    for (const value of this._values) {
      if (value.x === point.x && value.y === point.y) return true;
    }
    return false;
  }

  multiplePointsOnSamePosition(point: Point) {
    for (let i = 0; i < this._values.length; i++) {
      if (this._values[i].x === point.x && this._values[i].y === point.y) {
        return i;
      }
    }
    return false;
  }

  generateToPoint(direction: Direction, value: string) {
    const { x, y } = this._values[this._values.length - 1];
    let count = 0;
    switch (direction) {
      case 'R':
        while (count !== +value) {
          count++;
          this._values.push({ x: x + count, y });
        }
        break;
      case 'L':
        while (count !== +value) {
          count++;
          this._values.push({ x: x - count, y });
        }
        break;
      case 'U':
        while (count !== +value) {
          count++;
          this._values.push({ x, y: y + count });
        }
        break;
      case 'D':
        while (count !== +value) {
          count++;
          this._values.push({ x, y: y - count });
        }
        break;
      default:
        break;
    }
  }
}

export function main(data: string): Response {
  const allDirections: string[][] = [
    data.split('\n')[0].split(','),
    data.split('\n')[1].split(','),
  ];
  // allDirections[0]
  const firstValues = new CoordinateSystem();
  // allDirections[1]
  const secondValues = new CoordinateSystem();
  let count = 0;
  for (const directions of allDirections) {
    for (const direction of directions) {
      const value = direction.substr(1, direction.length - 1);
      const directionString: string = direction.substr(0, 1);
      if (
        directionString !== 'R' &&
        directionString !== 'U' &&
        directionString !== 'D' &&
        directionString !== 'L'
      ) {
        throw new Error('Could not parse string to Direction');
      }
      if (count === 0) firstValues.generateToPoint(directionString, value);
      else secondValues.generateToPoint(directionString, value);
    }
    count++;
  }
  let minimumDistance;
  for (const point of firstValues._values) {
    if (secondValues.pointExists(point)) {
      const pointDistance = Math.abs(point.x) + Math.abs(point.y);
      if (!minimumDistance || pointDistance < minimumDistance) {
        minimumDistance = pointDistance;
      }
    }
  }
  const bestSteps = { first: Infinity, second: Infinity };
  for (let i = 0; i < firstValues._values.length; i++) {
    const otherPoint = secondValues.multiplePointsOnSamePosition(
      firstValues._values[i]
    );
    if (otherPoint) {
      if (bestSteps.first + bestSteps.second > i + otherPoint) {
        bestSteps.first = i;
        bestSteps.second = otherPoint;
      }
    }
  }
  if (minimumDistance) {
    return [
      {
        message:
          'The next intersection with the smallest Manhattan distance is',
        value: minimumDistance.toString(),
      },
      {
        message:
          'In total, it requires the following count of steps to get to the central point',
        value: (bestSteps.first + bestSteps.second).toString(),
      },
    ];
  }
  return;
}
