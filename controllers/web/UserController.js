const log = require('../../services/logger.service')
const utils = require('../../services/utils.service.js')
const errorMessages = require('../../services/errorMessages.service.js')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
// const cloudinary = require('../../config/config.js')

const UserModel = require('../../models/User')

class AdminController {
    static home = async (req, res) => {
        try {
            log.info('home(): req: %o', utils.reqObject(req, res))
            const responseObject = {
                title: 'home',
                user: req.decoded,
                allUsersCount: 0,
                successMessage: req.flash('success'),
                errorMessage: req.flash('error')
            }
            res.render('front/home', responseObject)
        } catch (err) {
            log.error('dashboard(): catch error: %o', err)
        }
    }

    static blogs = async (req, res) => {
        try {
            log.info('blogs(): req: %o', utils.reqObject(req, res))
            const responseObject = {
                title: 'Blogs',
                user: req.decoded,
                allUsersCount: 0,
                successMessage: req.flash('success'),
                errorMessage: req.flash('error')
            }
            res.render('front/blogs', responseObject)
        } catch (err) {
            log.error('blogs(): catch error: %o', err)
        }
    }

    static contact = async (req, res) => {
        try {
            log.info('contact(): req: %o', utils.reqObject(req, res))
            const responseObject = {
                title: 'Contact Us',
                user: req.decoded,
                allUsersCount: 0,
                successMessage: req.flash('success'),
                errorMessage: req.flash('error')
            }
            res.render('front/contact', responseObject)
        } catch (err) {
            log.error('contact(): catch error: %o', err)
        }
    }
}
module.exports = AdminController
