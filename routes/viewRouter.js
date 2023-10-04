const express = require('express')
const router = express.Router()
const viewController = require('./../controllers/viewsController')

router.get('/', viewController.overview)
router.get('/tour/:slug', viewController.gettour)
router.get('/login',viewController.getLoginForm)
module.exports = router