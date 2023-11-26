const log = require('../../services/logger.service.js')
const utils = require('../../services/utils.service.js')
const errorMessages = require('../../services/errorMessages.service.js')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
// const cloudinary = require('../../config/config.js')

const CategoryModel = require('../../models/Category.js')

class AdminController {
    static categoryAdd = async (req, res) => {
        try {
            log.info('categoryAdd(): req: %o', utils.reqObject(req, res))
            const result = new CategoryModel({
                name: req.body.name
            })
            await result.save()
            if (result.id) {
                return res.status(200).json({
                    status: true,
                    message: 'Category added successfully'
                })
            }
        } catch (err) {
            log.error('categoryAdd(): catch error: %o', err)
            return res.status(500).json({
                status: false,
                message: 'Internal Server Error',
                data: {
                    errorCode: err.code,
                    errorMessage: err.message,
                    errorObject: err
                }
            })
        }
    }

    static categoryList = async (req, res) => {
        try {
            log.info('categoryList(): req: %o', utils.reqObject(req, res))
            const categories = await CategoryModel.find()
            res.json({
                status: true,
                message: 'Category list fetch successfully',
                data: categories,
                totalRecords: categories.length
            })
        } catch (err) {
            log.error('categoryList(): catch error: %o', err)
        }
    }

    static categoryDetails = async (req, res) => {
        try {
            log.info('categoryDetails(): req: %o', utils.reqObject(req, res))
            const categories = await CategoryModel.findOne({
                _id: req.params.categoryId
            })
            res.json({
                status: true,
                message: 'Category details fetch successfully',
                data: categories
            })
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
