/**
 * @fileOverview Main file of the project
 *
 */

const version = "1.0.0"

// Express
const express = require("express")

// got Package
const got = require("got")

// Initiating app
const app = express()

app.set('view engine', 'pug')

app.get('/', (req, res) => {
  res.render('index', {title: "Bitcoin Price " + version, price: this.getBitcoinPrice()})
})

app.listen("5678", function () {
  console.log('>> App is online and running on port 5678!\n')
});

/**
 * Returns a formatted time string with a millisecond timestamp.
 *
 * @param value - The number you want to round.
 * @param precision - Precision of the decimal number.
 * @since masterAfter-1.3
 *
 * @private
 */
// Thanks Billy Moon for giving the answer how to make a more precise round function: https://stackoverflow.com/a/7343013
exports.roundNumber = (/** Number */ value, /** Number */ precision) => {
  let multiplier = Math.pow(10, precision || 0)
  return Math.round(value * multiplier) / multiplier
}

exports.getBitcoinPrice = () => {

  let result;

  got('https://api.coinmarketcap.com/v1/ticker/Bitcoin/?convert=USD').then(res => {
    try{

      let priceData = JSON.parse(res.body);

      result = this.roundNumber(priceData[0]['price_usd'], 2)
    }catch (e){
      console.error(e)
    }finally {
      return result
    }
  })
}