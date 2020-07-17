import { Response } from '../..';

export function main(data: string): Response {
  const values = data.split(/\r?\n/g);

  //Total calculation for first half of the puzzle
  let total = 0;
  let totalWithFuelForFuel = 0;
  for (const value of values) {
    let fuel = Math.floor(+value / 3) - 2;
    total += fuel;
    while (fuel > 0) {
      const oldFuel = fuel;
      fuel = Math.floor(fuel / 3) - 2;
      totalWithFuelForFuel += oldFuel;
    }
  }

  return [
    { message: 'Total fuel', value: total.toString() },
    {
      message: 'Total fuel with fuel for fuel etc.',
      value: totalWithFuelForFuel.toString(),
    },
  ];
}
