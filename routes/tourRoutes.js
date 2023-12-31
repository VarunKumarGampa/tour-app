const express = require('express');
const router = express.Router();
const tourController = require('./../controllers/tourController');
const authController = require('./../controllers/authController');
const reviewRouter = require('./../routes/reviewRoute');

// router.param('id',tourController.checkId)

//get /tour/asf412/review

// router
// .route('/:tourId/reviews')
// .post(
//   authController.protect,
//   authController.restrictTo('user'),
//   reviewController.createReview
// );

//using mergeparams
router.use('/:tourId/reviews', reviewRouter);

router
  .route('/top-5-cheap')
  .get(tourController.aliasTopTours, tourController.getAllTour);
router.route('/monthly-plane/:year').get(tourController.getMonthlyPlan);
router
  .route('/tour-stats')
  .get(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.getTourStat
  );

router.route('/tours-within/:distance/center/:latlng/unit/:unit').get(tourController.getTourswithin)
router.route('/distances/:latlng/unit/:unit').get(tourController.getdistances)
router
  .route('/')
  .get(tourController.getAllTour)
  .post(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.createTour
  );
router
  .route('/:id')
  .get(tourController.getTour)
  .patch(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.updateTour
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.deleteTour
  );

module.exports = router;
