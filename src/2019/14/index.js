const _ = require('lodash')
const fs = require('fs')
const readline = require('readline');

module.exports = main

function main (data) {
  let reactions = new Reactions()
  const recipes = data.split(/\r?\n/g)
  let tempReactions = []
  for (const recipe of recipes) {
    const ingredients = recipe.split(' => ')[0].split(', ')
    const ingredientsArray = []
    for (let i = 0; i < ingredients.length; i++) {
      const ingredient = ingredients[i]
      ingredientsArray.push({
        count: parseInt(ingredient.split(' ')[0]),
        chemical: ingredient.split(' ')[1],
      })
    }
    const results = recipe.split(' => ')[1].split(', ')
    const resultsArray = []
    for (let i = 0; i < results.length; i++) {
      const result = results[i]
      resultsArray.push({
        count: parseInt(result.split(' ')[0]),
        chemical: result.split(' ')[1],
      })
    }
    tempReactions.push({ ingredients: ingredientsArray, chemical: resultsArray })
  }
  reactions._reactions = tempReactions
  reactions.generateFuel([{ count: 1, chemical: 'FUEL' }])
  console.log(reactions._oreCount)
  reactions = new Reactions()
  reactions._reactions = tempReactions
  while (!reactions._done) {
    reactions.generateFuel([{ count: 1, chemical: 'FUEL' }], 1000000000000)
  }
  fs.writeFileSync('./result.txt', (reactions._fuelCount - 1).toString())
  console.log(reactions._fuelCount - 1)
}

class Reactions {
  constructor () {
    this._chemicals = []
    this._reactions = []
    this._oreCount = 0
    this._done = false
    this._fuelCount = 0
  }

  generateFuel (searchChemicals, maximumOreCount) {
    for (const searchChemical of searchChemicals) {
      if (searchChemical.chemical === 'FUEL') this._fuelCount += searchChemical.count
      if (searchChemical.chemical === 'ORE') {
        this._oreCount += searchChemical.count
        if (maximumOreCount && this._percent !== (this._oreCount / maximumOreCount * 100).toFixed(2)) {
          readline.clearLine(process.stdout);
          readline.cursorTo(process.stdout, 0);
          this._percent = (this._oreCount / maximumOreCount * 100).toFixed(2)
          process.stdout.write(`Finished: ${this._percent}%`)
        }
        if (maximumOreCount && this._oreCount > maximumOreCount) {
          this._done = true
        }
        continue
      }
      const chemical = this._chemicals.find(element => searchChemical.chemical === element.chemical && element.count >= searchChemical.count)
      if (chemical) {
        chemical.count -= searchChemical.count
        continue
      }

      for (const reaction of this._reactions) {
        const result = reaction.chemical.find(element => searchChemical.chemical === element.chemical)
        if (!result) continue
        let count = 0
        let searchChemicalCount = _.clone(searchChemical).count
        // If there are already ores in the chemical stock, delete them from the count of 'required ores'
        let searchChemicalInChemicals = this.findChemicalInChemicals(searchChemical)
        if (searchChemicalInChemicals) {
          searchChemicalCount -= searchChemicalInChemicals.count
        }
        while (searchChemicalCount > count) {
          this.generateFuel(reaction.ingredients, maximumOreCount)
          count += result.count
          this.pushToChemicals(result)
        }
        searchChemicalInChemicals = this.findChemicalInChemicals(searchChemical)

        if (!searchChemicalInChemicals) continue
        searchChemicalInChemicals.count -= searchChemical.count
        break
      }
    }
  }

  pushToChemicals (result) {
    const chemical = this._chemicals.find(element => element.chemical === result.chemical)
    if (chemical) {
      chemical.count += result.count
      return
    }
    this._chemicals.push(_.clone(result))
  }

  findChemicalInChemicals (chemical) {
    return this._chemicals.find(element => element.chemical === chemical.chemical)
  }
}