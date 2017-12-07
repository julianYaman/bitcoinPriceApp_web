/**
 * @fileOverview Main file of the project
 *
 */

// Express
const express = require("express")

// HTTPS
const https = require("https");

// got Package
const got = require("got")

require('dotenv').config()

// Initiating app
const app = express()

// Set view engine
app.set('view engine', 'pug')

// Allow using src folder
app.use('/src', express.static('src', { redirect : false }));

app.get('/', (req, res) => {

  this.getBitcoinPrice((err, data) => {

    if(err){
      console.error(err);
      res.render("index", {title: "Bitcoin Price " + process.env.VERSION, price: "Failed to get a price. Please contact the developer!" })
    }

    res.render("index", {title: "Bitcoin Price " + process.env.VERSION, price: data.price })

  })

})

app.listen(process.env.PORT, function () {
  console.log('>> App is online and running on port ' + process.env.PORT + '!\n')
})

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

// For requesting price with the got module, please add async before the function
exports.getBitcoinPrice = (callback) => {

  // Request with module

  /* try{
    let response = await got('https://bitpay.com/api/rates/usd', {timeout: 2000})
    let data = JSON.parse(response.body)
    return this.roundNumber(data['rate'], 2) + "$"
  }catch (e){
    return "Failed to get the price - request error. Please inform the developer about this issue by writing an issue at the Github repository";
  } */

  // Request with native Node.js libraries and code

  https.get('https://bitpay.com/api/rates/usd', (res) => {

    const { statusCode } = res

    let error

    if(statusCode !== 200){
      error = new Error('Request failed. ' + `Status Code ${statusCode}`)
    }

    if(error){
      console.error(error.message)
      res.resume()

      return
    }

    let rawData = '';

    res.on('data', (chunk) => { rawData += chunk })
    res.on('end', () => {
      try {
        var parsedData = JSON.parse(rawData)
      }catch (e){
        console.error(e.message);
        return callback(e)
      }

      callback(null, {
        price: this.roundNumber(parsedData['rate'], 2) + " $"
      })
    })

  }).on('error', (e) => {
    console.error(`Got error: ${e.message}`)
    callback(err)
  })


}