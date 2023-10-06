const express = require('express');

const router = express.Router();

const userController = require('./../controllers/userController');
const authController = require('./../controllers/authController');

router.route('/me').get(authController.protect,userController.getMe,userController.getUsers)

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/logout', authController.logout);
router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);
router.patch(
  '/updatePassword',
  authController.protect,
  authController.updatePassword
);

//Protects all the route after this middleware
router.use(authController.protect)

router.patch('/updateMe', userController.updateMe);
router.delete('/deleteMe', authController.protect, userController.deleteMe);


//protects all routers and also restricted to admin
router.use(authController.restrictTo('admin'))
router
  .route('/')
  .get(userController.getAllUsers)
  
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
