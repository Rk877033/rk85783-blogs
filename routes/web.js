const express = require('express')
const router = express.Router()

const AuthController = require('../controllers/web/AuthController')
const AdminController = require('../controllers/web/AdminController')
const AuthorController = require('../controllers/web/AuthorController')
const UserController = require('../controllers/web/UserController')

// Middleware
const checkAuth = require('../middleware/auth')

// --------------------- All Routes
router.get('/', AuthController.login)
router.get('/register', AuthController.register)
router.post('/login', AuthController.loginSubmit)
router.post('/register', AuthController.registerSubmit)
router.get('/logout', AuthController.logout)

// For Users
router.get('/home', checkAuth, UserController.home)
router.get('/blogs', checkAuth, UserController.blogs)
router.get('/contact', checkAuth, UserController.contact)

// For Authors
router.get('/author/dashboard', checkAuth, AuthorController.dashboard)

// For Admin
router.get('/admin/dashboard', checkAuth, AdminController.dashboard)
router.get('/admin/users/list', checkAuth, AdminController.userList)

module.exports = router
