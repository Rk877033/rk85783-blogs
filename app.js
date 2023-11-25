const express = require('express')
const dotenv = require('dotenv')
dotenv.config()
const log = require('./services/logger.service.js')

const port = process.env.PORT || 8000
const app = express()

app.listen(port, () => {
    log.info(`Server is running on http://localhost:${port}`)
})
