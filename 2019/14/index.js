const _ = require('lodash')
const fs = require('fs')

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
  console.log(reactions._chemicals)
  console.log(reactions._oreCount)
  let count = 1
  reactions = new Reactions()
  while (reactions._oreCount < 1000000000000) {
    reactions._reactions = tempReactions
    reactions.generateFuel([{ count, chemical: 'FUEL' }])
    count++
  }
  fs.writeFileSync('./result.txt', (count - 1).toString())
  console.log(count - 1)
}

class Reactions {
  constructor () {
    this._chemicals = []
    this._reactions = []
    this._oreCount = 0
  }

  generateFuel (searchChemicals) {
    for (const searchChemical of searchChemicals) {
      let chemicalFound = false
      if (searchChemical.chemical === 'ORE') {
        this._oreCount += searchChemical.count
        continue
      }
      const chemical = this._chemicals.find(element => searchChemical.chemical === element.chemical && element.count >= searchChemical.count)
      if (chemical) {
        chemical.count -= searchChemical.count
        chemicalFound = true
      }
      if (chemicalFound) continue

      for (const reaction of this._reactions) {
        const result = reaction.chemical.find(element => searchChemical.chemical === element.chemical)
        if (!result) continue
        let count = 0
        const tempSearchChemical = _.clone(searchChemical)
        let searchChemicalInChemicals = this.findChemicalInChemicals(searchChemical)
        if (searchChemicalInChemicals) {
          tempSearchChemical.count -= searchChemicalInChemicals.count
        }
        while (tempSearchChemical.count > count) {
          this.generateFuel(reaction.ingredients)
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
    if (!chemical) {
      this._chemicals.push(_.clone(result))
      return
    }
    chemical.count += result.count
  }

  findChemicalInChemicals (chemical) {
    return this._chemicals.find(element => element.chemical === chemical.chemical)
  }
}