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

  this.getBitcoinPrice().then(price => {
    res.render('index', {title: "Bitcoin Price " + version, price: price})
  }).catch(e => {
    res.render('index', {title: "Bitcoin Price " + version, price: "Unexpected error: " + e})
  })

})

app.listen("5678", function () {
  console.log('>> App is online and running on port 5678!\n')
});

/**
 * Rounds a given decimal number
 *
 * @param {Number} value - The number you want to round.
 * @param {Number} precision - Precision of the decimal number.
 * @since 1.0.0
 *
 * @private
 */
// Thanks Billy Moon for giving the answer how to make a more precise round function: https://stackoverflow.com/a/7343013
exports.roundNumber = (value, precision) => {
  let multiplier = Math.pow(10, precision || 0)
  return Math.round(value * multiplier) / multiplier
}

exports.getBitcoinPrice = async () => {

  try{
    let response = await got('https://api.coinmarketcap.com/v1/ticker/Bitcoin/?convert=USD', {timeout: 2000})
    let data = JSON.parse(response.body)
    return this.roundNumber(data[0]['price_usd'], 2) + "$"
  }catch (e){
    return "Failed to get the price - request error. Please inform the developer about this issue by writing an issue at the Github repository";
  }

}