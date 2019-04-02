const express = require('express')
const helmet = require('helmet')
const axios = require('axios')
const bodyParser = require('body-parser')
const app = express()

app.use(helmet())
app.use(bodyParser.json())
app.get('*', (req, res) => {
    axios.get('https://api.darksky.net/forecast/00011a7762d5bc72610f53adb3ccb86f/51.5246693,-0.3420173?units=ca&exclude=minutely,alerts,flags')
      .then(response => {
        res.status(200).send(response.data)
      })
      .catch(error => {
        res.status(400).send(error)
      });
})

module.exports = app
