const express = require('express');

const router = express.Router();

const userController = require('./../controllers/userController');
const authController = require('./../controllers/authController');

router.route('/me').get(authController.protect,userController.getMe,userController)

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);
router.patch(
  '/updatePassword',
  authController.protect,
  authController.updatePassword
);
router.patch('/updateMe', authController.protect, userController.updateMe);
router.delete('/deleteMe', authController.protect, userController.deleteMe);

router
  .route('/')
  .get(authController.protect, userController.getAllUsers)
  
router
  .route('/:id')
  .get(userController.getUsers)
  .patch(userController.updateUsers)
  .delete(
    // authController.protect,
    // authController.restrictTo('admin','lead-guide'),
    userController.deleteUser
  );

module.exports = router;
