const express = require('express')
const router = express.Router()
const viewController = require('./../controllers/viewsController')
const authController = require('./../controllers/authController')


router.get('/', authController.isLoggedIn,viewController.overview)
router.get('/tour/:slug', authController.isLoggedIn,viewController.gettour)
router.get('/login',authController.isLoggedIn,viewController.getLoginForm)
router.get('/me',authController.protect,viewController.getAccount)
module.exports = router