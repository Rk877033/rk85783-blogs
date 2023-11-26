const log = require('../../services/logger.service')
const utils = require('../../services/utils.service.js')
const errorMessages = require('../../services/errorMessages.service.js')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
// const cloudinary = require('../../config/config.js')
const cloudinary = require('cloudinary').v2
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
})
const fs = require('fs')

const UserModel = require('../../models/User')

class AdminController {
    static dashboard = async (req, res) => {
        try {
            log.info('dashboard(): req: %o', utils.reqObject(req, res))
            const allUsersCount = await UserModel.find(
                { role: { $ne: 'admin' } }
            ).count()
            const responseObject = {
                title: 'Dashboard',
                user: req.decoded,
                allUsersCount,
                successMessage: req.flash('success'),
                errorMessage: req.flash('error')
            }
            res.render('admin/dashboard', responseObject)
        } catch (err) {
            log.error('dashboard(): catch error: %o', err)
        }
    }

    static userList = async (req, res) => {
        try {
            log.info('userList(): req: %o', utils.reqObject(req, res))
            const data = await UserModel.find(
                { role: { $ne: 'admin' } }
            )
            console.log(data)
            const responseObject = {
                title: 'Dashboard',
                user: req.decoded,
                data,
                successMessage: req.flash('success'),
                errorMessage: req.flash('error')
            }
            res.render('admin/users_list', responseObject)
        } catch (err) {
            log.error('userList(): catch error: %o', err)
        }
    }

    static userAdd = async (req, res) => {
        try {
            log.info('userAdd(): req: %o', utils.reqObject(req, res))
            // console.log(req.files.profile_image)

            const file = req.files.profile_image
            const imageUpload = await cloudinary.uploader.upload(file.tempFilePath, {
                folder: 'rk85873-blogs/profileImage'
            })
            // console.log(imageUpload)
            fs.unlink(file.tempFilePath, (err) => {
                if (err) {
                    throw err
                }
                console.log('Deleted Successfully!')
            })
            // return true

            const hashPassword = await bcrypt.hash(req.body.password, 10)
            const result = new UserModel({
                name: req.body.name,
                email: req.body.email,
                password: hashPassword,
                // agree_term: req.body.agree_term,
                role: req.body.role,
                status: req.body.status,
                profile_image: {
                    public_id: imageUpload.public_id,
                    url: imageUpload.secure_url
                }
            })
            await result.save()
            log.info('userAdd(): success: new created id: %d', result.id)
            req.flash('success', 'Registration Successfully, Please Login')
            res.redirect('/admin/users')
        } catch (err) {
            log.error('userAdd(): catch error: %o', err)
        }
    }

    static pageNotFound = async (req, res) => {
        try {
            log.info('pageNotFound(): req: %o', utils.reqObject(req, res))
            const responseObject = {
                title: 'Dashboard',
                user: req.decoded,
                successMessage: req.flash('success'),
                errorMessage: req.flash('error')
            }
            res.render('admin/404', responseObject)
        } catch (err) {
            log.error('pageNotFound(): catch error: %o', err)
        }
    }
}
module.exports = AdminController
