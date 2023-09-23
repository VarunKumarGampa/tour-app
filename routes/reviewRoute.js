const express = require('express');
const router = express.Router({
  mergeParams: true,
});
const reviewController = require('./../controllers/reviewController');
const authController = require('./../controllers/authController');

//post /tour/asf412/review(mergeParams)
router.use(authController.protect)
router
  .route('/')
  .get(reviewController.getAllReviews)
  .post(
    authController.restrictTo('user'),
    reviewController.setTourUserIds,
    reviewController.createReview
  );


router
  .route('/:id')
  .delete( reviewController.deleteReview)
  .patch(authController.restrictTo('user', 'admin'), reviewController.updateReview)
  .get(authController.restrictTo('user', 'admin'),reviewController.getReview);

module.exports = router;
