const express = require('express')
const helmet = require('helmet')
const axios = require('axios')
const bodyParser = require('body-parser')
const app = express()

const config = {
        API_URL: 'https://api.tfl.gov.uk',
        APP_ID : '148f05be',
        APP_KEY : '8b44832fbd2a54ed62ab322b92ae26da',
        busStationID : '490008639S',
        removeBus: 'E11'
      }

const tflAPI = `${config.API_URL}/StopPoint/${config.busStationID}/Arrivals?app_id=${config.APP_ID}&app_key=${config.APP_KEY}`

app.use(helmet())
app.use(bodyParser.json())
app.get('*', (req, res) => {
    axios.get(tflAPI)
      .then(response => {
        let buses = response.data.filter(bus => bus.lineName !== config.removeBus)

        buses.sort((a, b) => {
          if (a.expectedArrival < b.expectedArrival) return -1
          if (a.expectedArrival > b.expectedArrival) return 1
          return 0
        })

        res.status(200).send(buses)
      })
      .catch(error => {
        res.status(400).send(error)
      });
})

module.exports = app
