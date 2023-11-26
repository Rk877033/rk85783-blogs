const log = require('../../services/logger.service')
const utils = require('../../services/utils.service.js')
const errorMessages = require('../../services/errorMessages.service.js')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
// const cloudinary = require('../../config/config.js')

const CategoryModel = require('../../models/Category')

class AdminController {
    static categoryAdd = async (req, res) => {
        try {
            log.info('categoryAdd(): req: %o', utils.reqObject(req, res))
            const result = new CategoryModel({
                name: 'Beauty'
            })
            await result.save()
        } catch (err) {
            log.error('categoryAdd(): catch error: %o', err)
        }
    }

    static categoryList = async (req, res) => {
        try {
            log.info('categoryList(): req: %o', utils.reqObject(req, res))
        } catch (err) {
            log.error('categoryList(): catch error: %o', err)
        }
    }

    static categoryDetails = async (req, res) => {
        try {
            log.info('categoryDetails(): req: %o', utils.reqObject(req, res))
        } catch (err) {
            log.error('categoryDetails(): catch error: %o', err)
        }
    }

    static categoryEdit = async (req, res) => {
        try {
            log.info('categoryEdit(): req: %o', utils.reqObject(req, res))
        } catch (err) {
            log.error('categoryEdit(): catch error: %o', err)
        }
    }
}
module.exports = AdminController
