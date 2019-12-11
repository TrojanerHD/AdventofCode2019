const fs = require('fs')

class day {
  constructor (year, day) {
    this._year = year
    this._day = day
    if (this._day <= 9) this._day = `0${this._day}`
    fs.readFile(`./${this._year}/${this._day}/values.txt`, 'utf8', (err, data) => this.fileRead(err, data))
  }

  fileRead (err, data) {
    if (err) {
      console.error(err)
      return
    }
    this._year = this._year.toString()
    process.chdir(`./${this._year}/${this._day}`)
    const toLog = require(`./${this._year}/${this._day}/index`)(data)
    process.chdir('../../')
    for (let i = 0; i < toLog.length; i++) {
      const log = toLog[i]
      this.logger(i + 1, log.message, log.value)
    }
  }

  logger (part, message, value) {
    console.log(`[Year ${this._year}, Day ${this._day}, Part ${part}] ${message}: ${value}`)
  }
}

new day(2019, 11)