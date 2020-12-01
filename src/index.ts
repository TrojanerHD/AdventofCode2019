import * as fs from 'fs';

export type Response = Array<{ message: string; value: string }> | undefined;

class Day {
  private _year: string;
  private _day: string;

  constructor(year: number, day: number) {
    this._year = year.toString();
    this._day = day.toString();
    if (day <= 9) this._day = `0${this._day}`;
  }

  init() {
    fs.readFile(
      `./src/${this._year}/${this._day}/values.txt`,
      'utf8',
      this.fileRead.bind(this)
    );
  }

  private fileRead(err: NodeJS.ErrnoException | null, data: string): void {
    if (err) {
      console.error(err);
      return;
    }
    process.chdir(`./src/${this._year}/${this._day}`);
    import(`./${this._year}/${this._day}/index`).then(
      (callbackFunction: { main: (data: string) => Response }) => {
        const toLog: Response = callbackFunction.main(data);
        process.chdir('../../');
        if (!toLog) return;
        for (let i = 0; i < toLog.length; i++) {
          const log = toLog[i];
          this.logger(i + 1, log.message, log.value);
        }
      }
    );
  }

  private logger(part: number, message: string, value: string): void {
    console.log(
      `[Year ${this._year}, Day ${this._day}, Part ${part}] ${message}: ${value}`
    );
  }
}

new Day(2019, 14).init();
