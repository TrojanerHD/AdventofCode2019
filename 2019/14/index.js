const _ = require('lodash')

module.exports = main

function main (data) {
  const reactions = new Reactions()
  const recipes = data.split(/\r?\n/g)
  for (const recipe of recipes) {
    const ingredients = recipe.split(' => ')[0].split(', ')
    const ingredientsArray = []
    for (let i = 0; i < ingredients.length; i++) {
      const ingredient = ingredients[i]
      ingredientsArray.push({ count: ingredient.split(' ')[0], chemical: ingredient.split(' ')[1] })
    }
    const results = recipe.split(' => ')[1].split(', ')
    const resultsArray = []
    for (let i = 0; i < results.length; i++) {
      const result = results[i]
      resultsArray.push({ count: result.split(' ')[0], chemical: result.split(' ')[1] })
    }
    reactions._reactions.push({ ingredients: ingredientsArray, chemical: resultsArray })
  }
  reactions.generateFuel([{ count: '1', chemical: 'FUEL' }])
  console.log(reactions._chemicals)
  console.log(reactions._oreCount)
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
      for (const reaction of this._reactions) {
        chemicalFound = this.checkForEnoughChemicals(searchChemical)
        if (chemicalFound) break
        if (searchChemical.chemical === 'ORE') {
          this._oreCount += parseInt(searchChemical.count)
          console.log(`-${searchChemical.count} ${searchChemical.chemical}`)
          chemicalFound = true
          break
        }
        if (chemicalFound) break

        for (const result of reaction.chemical) {
          if (searchChemical.chemical === result.chemical) {
            let count = 0
            const tempSearchChemical = _.cloneDeep(searchChemical)
            for (let i = 0; i < this._chemicals.length; i++) {
              const chemical = this._chemicals[i]
              if (tempSearchChemical.chemical === chemical.chemical) {
                tempSearchChemical.count = (parseInt(tempSearchChemical.count) - parseInt(chemical.count)).toString()
              }
            }
            while (parseInt(tempSearchChemical.count) > count) {
              this.generateFuel(reaction.ingredients)
              const tempResult = _.cloneDeep(result)
              this.pushToChemicals(tempResult)
              count += parseInt(tempResult.count)
              console.log(`+${tempResult.count} ${searchChemical.chemical}`)
            }
            chemicalFound = true
          }
        }
      }
    }
  }

  pushToChemicals (result) {
    let alreadyInChemicals = false
    for (let i = 0; i < this._chemicals.length; i++) {
      const chemical = this._chemicals[i]
      if (result.chemical === chemical.chemical) {
        this._chemicals[i].count = (parseInt(chemical.count) + parseInt(result.count)).toString()
        alreadyInChemicals = true
        break
      }
    }
    if (!alreadyInChemicals) this._chemicals.push(result)
  }

  checkForEnoughChemicals (searchChemical) {
    for (let i = 0; i < this._chemicals.length; i++) {
      const chemical = this._chemicals[i]
      if (parseInt(chemical.count) >= parseInt(searchChemical.count) && searchChemical.chemical === chemical.chemical) {
        this._chemicals[i].count = (parseInt(chemical.count) - parseInt(searchChemical.count)).toString()
        console.log(`-${searchChemical.count} ${chemical.chemical}`)
        return true
      }
    }
    return false
  }
}