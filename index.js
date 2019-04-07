const express = require('express')
const helmet = require('helmet')
const app = express()
// add some security-related headers to the response
app.use(helmet())
app.get('*', (req, res) => {
    res.set('Content-Type', 'text/html')
    res.send(200, `
        <h1>Magic Mirror - Crazy Code</h1>
    `)
})
module.exports = app
