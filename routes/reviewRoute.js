const express = require('express');
const router = express.Router({
  mergeParams: true,
});
const reviewController = require('./../controllers/reviewController');
const authController = require('./../controllers/authController');

//post /tour/asf412/review(mergeParams)

router
  .route('/')
  .get(reviewController.getAllReviews)
  .post(
    authController.protect,
    authController.restrictTo('user'),
    reviewController.setTourUserIds,
    reviewController.createReview
  );

router
  .route('/:id')
  .delete(authController.protect, reviewController.deleteReview)
  .patch(authController.protect, reviewController.updateReview);

module.exports = router;
