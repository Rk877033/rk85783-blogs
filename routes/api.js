const express = require('express')
const router = express.Router()

const CategoryController = require('../controllers/api/CategoryController.js')
const AuthController = require('../controllers/api/AuthController.js')

router.get('/', (req, res) => {
    res.send({
        status: true,
        message: 'API working fine'
    })
})

router.get('/categories', CategoryController.categoryList)
router.get('/category/:categoryId', CategoryController.categoryDetails)
router.post('/category', CategoryController.categoryAdd)
router.put('/category/:categoryId', CategoryController.categoryEdit)

router.post('/login', AuthController.login)
router.post('/register', AuthController.register)

module.exports = router
