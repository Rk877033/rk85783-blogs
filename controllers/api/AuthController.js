const log = require('../../services/logger.service')
const errorMessages = require('../../services/errorMessages.service.js')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
// const cloudinary = require('../../config/config.js')

const UserModel = require('../../models/User')

class AuthController {
    static login = async (req, res) => {
        try {
            log.info('login(): req.body: %o', req.body)
            const { email, password } = req.body
            if (email && password) {
                const user = await UserModel.findOne({
                    email
                })
                if (user != null) {
                    if (user.status == 'inactive') {
                        log.error('login(): error: %s', errorMessages.USER_INACTIVE)
                        return res.status(200).json({
                            status: true,
                            message: errorMessages.USER_INACTIVE
                        })
                    } else if (user.status == 'blocked') {
                        log.error('login(): error: %s', errorMessages.USER_BlOCKED)
                        return res.status(200).json({
                            status: true,
                            message: errorMessages.USER_BlOCKED
                        })
                    }
                    const isMatched = await bcrypt.compare(password, user.password)
                    if (isMatched) {
                        if (user.role == 'admin') {
                            const token = jwt.sign({ ID: user.id }, process.env.JWT_TOKEN)
                            res.cookie('token', token)
                            return res.status(200).json({
                                status: true,
                                message: 'You are login successfully',
                                data: {
                                    token
                                }
                            })
                        }
                        if (user.role == 'author') {
                            const token = jwt.sign({ ID: user.id }, process.env.JWT_TOKEN)
                            res.cookie('token', token)
                            return res.status(200).json({
                                status: true,
                                message: 'You are login successfully',
                                data: {
                                    token,
                                    user
                                }
                            })
                        }
                        if (user.role == 'user') {
                            const token = jwt.sign({ ID: user.id }, process.env.JWT_TOKEN)
                            res.cookie('token', token)
                            return res.status(200).json({
                                status: true,
                                message: 'You are login successfully',
                                data: {
                                    token,
                                    user
                                }
                            })
                        }
                    } else {
                        log.error('login(): error: %s', errorMessages.EMAIL_AND_PASSWORD_NOT_MATCH)
                        return res.status(200).json({
                            status: true,
                            message: errorMessages.EMAIL_AND_PASSWORD_NOT_MATCH
                        })
                    }
                } else {
                    log.error('login(): error: %s', errorMessages.NOT_REGISTERED_USER)
                    return res.status(200).json({
                        status: true,
                        message: errorMessages.NOT_REGISTERED_USER
                    })
                }
            } else {
                log.error('login(): error: %s', errorMessages.ALL_FIELDS_REQUIRED)
                return res.status(200).json({
                    status: true,
                    message: errorMessages.ALL_FIELDS_REQUIRED
                })
            }
        } catch (error) {
            log.error('login(): catch error: %o', error)
        }
    }

    static register = async (req, res) => {
        try {
            log.info('register(): req.query: %o', req.body)
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
                log.info('register(): error: %o', errorMessages.EMAIL_ALREADY_EXISTS)
                return res.status(401).json({
                    status: false,
                    message: errorMessages.EMAIL_ALREADY_EXISTS
                })
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

                        log.info('register(): success: new created id: %d', result.id)
                        return res.status(201).json({
                            status: true,
                            message: 'Registration Successfully, Please Login'
                        })
                    } else {
                        log.error('register(): error: %s', errorMessages.PASSWORD_NOT_MATCH)
                        return res.status(401).json({
                            status: false,
                            message: errorMessages.PASSWORD_NOT_MATCH
                        })
                    }
                } else {
                    log.error('register(): error: %s', errorMessages.ALL_FIELDS_REQUIRED)
                    return res.status(401).json({
                        status: false,
                        message: errorMessages.ALL_FIELDS_REQUIRED
                    })
                }
            }
        } catch (error) {
            log.error('register(): catch error: %o', error)
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
