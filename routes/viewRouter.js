const express = require('express')
const router = express.Router()
const viewController = require('./../controllers/viewsController')
const authController = require('./../controllers/authController')


router.use(authController.isLoggedIn)
router.get('/', viewController.overview)
router.get('/tour/:slug', viewController.gettour)
router.get('/login',viewController.getLoginForm)
module.exports = router