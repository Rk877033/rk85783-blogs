const log = require('../../services/logger.service')
const utils = require('../../services/utils.service.js')
const errorMessages = require('../../services/errorMessages.service.js')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
// const cloudinary = require('../../config/config.js')

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
}
module.exports = AdminController
