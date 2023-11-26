const log = require('../services/logger.service')
const mongoose = require('mongoose')

const connectDB = () => {
    return mongoose.connect(`${process.env.MONGO_DB_URL}/rk85783-blogs`).then(() => {
        log.info('connectDB(): DB Connection Successfully')
    }).catch((err) => {
        log.error('connectDB(): DB Connection Failed: error: %o', err)
    })
}
module.exports = connectDB
