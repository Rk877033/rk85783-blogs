const express = require('express')
const dotenv = require('dotenv')
const moment = require('moment')
const path = require('path')
dotenv.config()
const session = require('express-session')
const connectDB = require('./db/connect_db')
const cookieParser = require('cookie-parser')
const flash = require('connect-flash')
const fileUpload = require('express-fileupload')
const log = require('./services/logger.service.js')
const web = require('./routes/web.js')
const api = require('./routes/api.js')

const port = process.env.PORT || 8000
const app = express()

// View Engine
app.set('view engine', 'ejs')

// Helper function to make environment variables accessible in EJS files
app.locals.env = process.env
app.locals.moment = moment

// connect mongodb
connectDB()

app.use(session({
    secret: 'secret',
    cookie: { maxAge: 60000 },
    resave: false,
    saveUninitialized: false
}))
app.use(flash())

// insert CSS, JS and images
app.use(express.static(path.join(__dirname, 'public')))

// Parse URL-encoded bodies
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
// for file upload
app.use(fileUpload({ useTempFiles: true }))

// Web Routes
app.use('/', web)
// API Routes
app.use('/api', api)

// 404 Error Handler
// app.use('**', (req, res, next) => {
//     res.status(404)
//     // Check if the request wants JSON
//     if ((req.originalUrl).includes('/api')) {
//         if (req.accepts('json')) {
//             return res.json({
//                 status: false,
//                 error: 'Page not found'
//             })
//         }
//     }
//     // Default to HTML
//     if ((req.originalUrl).includes('/admin')) {
//         return res.redirect('/admin/404')
//     }
//     return res.render('front/404.ejs')
// })
app.all('*', (req, res, next) => {
    res.status(404)
    // Check if the request wants JSON
    if ((req.originalUrl).includes('/api')) {
        if (req.accepts('json')) {
            return res.json({
                status: false,
                error: 'Page not found'
            })
        }
    }
    // Default to HTML
    if ((req.originalUrl).includes('/admin')) {
        return res.redirect('/admin/404')
    }
    return res.render('front/404.ejs')
})

// Start the server
app.listen(port, () => {
    log.info(`Server is running on http://localhost:${port}`)
})
