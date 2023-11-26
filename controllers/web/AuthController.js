const log = require('../../services/logger.service')
const errorMessages = require('../../services/errorMessages.service.js')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
// const cloudinary = require('../../config/config.js')

const UserModel = require('../../models/User')

class AuthController {
    static login = (req, res) => {
        try {
            log.info('login(): req.query: %o', req.query)
            const responseObject = {
                title: 'Login',
                successMessage: req.flash('success'),
                errorMessage: req.flash('error')
            }
            res.render('login', responseObject)
        } catch (err) {
            log.error('login(): catch error: %o', err)
        }
    }

    static loginSubmit = async (req, res) => {
        try {
            log.info('loginSubmit(): req.body: %o', req.body)
            const { email, password } = req.body
            if (email && password) {
                const user = await UserModel.findOne({
                    email
                })
                if (user != null) {
                    if (user.status == 'inactive') {
                        log.error('loginSubmit(): error: %s', errorMessages.USER_INACTIVE)
                        req.flash('error', errorMessages.USER_INACTIVE)
                        return res.redirect('/')
                    } else if (user.status == 'blocked') {
                        log.error('loginSubmit(): error: %s', errorMessages.USER_BlOCKED)
                        req.flash('error', errorMessages.USER_BlOCKED)
                        return res.redirect('/')
                    }
                    const isMatched = await bcrypt.compare(password, user.password)
                    if (isMatched) {
                        if (user.role == 'admin') {
                            const token = jwt.sign({ ID: user.id }, process.env.JWT_TOKEN)
                            res.cookie('token', token)
                            res.redirect('/admin/dashboard')
                        }
                        if (user.role == 'author') {
                            const token = jwt.sign({ ID: user.id }, process.env.JWT_TOKEN)
                            res.cookie('token', token)
                            res.redirect('/author/dashboard')
                        }
                        if (user.role == 'user') {
                            const token = jwt.sign({ ID: user.id }, process.env.JWT_TOKEN)
                            res.cookie('token', token)
                            res.redirect('/home')
                        }
                    } else {
                        log.error('loginSubmit(): error: %s', errorMessages.EMAIL_AND_PASSWORD_NOT_MATCH)
                        req.flash('error', errorMessages.EMAIL_AND_PASSWORD_NOT_MATCH)
                        res.redirect('/')
                    }
                } else {
                    log.error('loginSubmit(): error: %s', errorMessages.NOT_REGISTERED_USER)
                    req.flash('error', errorMessages.NOT_REGISTERED_USER)
                    res.redirect('/')
                }
            } else {
                log.error('loginSubmit(): error: %s', errorMessages.ALL_FIELDS_REQUIRED)
                req.flash('error', errorMessages.ALL_FIELDS_REQUIRED)
                res.redirect('/')
            }
        } catch (error) {
            log.error('loginSubmit(): catch error: %o', error)
        }
    }

    static register = (req, res) => {
        try {
            log.info('register(): req.query: %o', req.query)
            const responseObject = {
                title: 'Register',
                successMessage: req.flash('success'),
                errorMessage: req.flash('error')
            }
            res.render('register', responseObject)
        } catch (err) {
            log.error('register(): catch error: %o', err)
        }
    }

    static registerSubmit = async (req, res) => {
        try {
            log.info('registerSubmit(): req.query: %o', req.body)
            // console.log(req.files.image)
            // return true

            // const file = req.files.profile_image
            // const imageUpload = await cloudinary.uploader.upload(file.tempFilePath, {
            //     folder: 'profileImage'
            // })
            // console.log(imageUpload)

            const user = await UserModel.findOne({
                email: req.body.email
            })
            if (user) {
                log.info('registerSubmit(): error: %o', errorMessages.EMAIL_ALREADY_EXISTS)
                req.flash('error', errorMessages.EMAIL_ALREADY_EXISTS)
                res.redirect('/register')
            } else {
                if (req.body.name && req.body.email && req.body.password && req.body.confirm_password) {
                    if (req.body.password == req.body.confirm_password) {
                        const hashPassword = await bcrypt.hash(req.body.password, 10)
                        const result = new UserModel({
                            name: req.body.name,
                            email: req.body.email,
                            password: hashPassword,
                            // profile_image: {
                            //     public_id: imageUpload.public_id,
                            //     url: imageUpload.secure_url
                            // },
                            agree_term: req.body.agree_term
                        })
                        await result.save()

                        // ----- Send Email Code
                        // this.sendEmail(req.body.email, req.body.name)

                        log.info('registerSubmit(): success: new created id: %d', result.id)
                        req.flash('success', 'Registration Successfully, Please Login')
                        res.redirect('/')
                    } else {
                        log.error('registerSubmit(): error: %s', errorMessages.PASSWORD_NOT_MATCH)
                        req.flash('error', errorMessages.PASSWORD_NOT_MATCH)
                        res.redirect('/register')
                    }
                } else {
                    log.error('registerSubmit(): error: %s', errorMessages.ALL_FIELDS_REQUIRED)
                    req.flash('error', errorMessages.ALL_FIELDS_REQUIRED)
                    res.redirect('/register')
                }
            }
        } catch (error) {
            log.error('registerSubmit(): catch error: %o', error)
        }
    }

    static logout = async (req, res) => {
        try {
            log.info('logout(): success: %s', 'Successfully Logout!')
            res.clearCookie('token')
            res.redirect('/')
        } catch (error) {
            log.error('logout(): catch error: %o', error)
        }
    }
}
module.exports = AuthController
