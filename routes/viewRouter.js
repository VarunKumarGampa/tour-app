const express = require('express')
const router = express.Router()
const viewController = require('./../controllers/viewsController')

router.get('/', viewController.overview)
router.get('/tour', viewController.gettour)
module.exports = router