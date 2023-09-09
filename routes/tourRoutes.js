const express = require("express")
const router = express.Router()
const tourController = require("./../controllers/tourController")
const authController = require("./../controllers/authController")
// router.param('id',tourController.checkId)

router.route('/top-5-cheap').get(tourController.aliasTopTours,tourController.getAllTour)
router.route('/monthly-plane/:year').get(tourController.getMonthlyPlan)
router.route('/tour-stats').get(tourController.getTourStat)

router.route("/").get(tourController.getAllTour).post(tourController.createTour)
router.route("/:id").get(tourController.getTour).patch(tourController.updateTour).delete(authController.protect,
    authController.restrictTo('admin','lead-guide'),tourController.deleteTour)

module.exports = router 