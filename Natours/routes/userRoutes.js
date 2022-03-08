const express = require('express');
const userController = require('./../controllers/userController.js');
const reviewController = require('./../controllers/reviewController.js');
const authController = require('./../controllers/authController.js');
const factory=require('./../controllers/handleFactory');


const router = express.Router();

router.route('/signup').post(authController.signUp);
router.route('/login').post(authController.login);
router.route('/logout').get(authController.logout);
router.post('/forgot-password',authController.forgotPass);
router.patch('/reset-password/:token', authController.resetPass);

//using middleware
router.use(authController.protect)

router.patch('/update-password', authController.updatePass);

router.patch('/update-profile',userController.uploadUserPhoto,userController.updateMyData);
router.delete('/delete-account',userController.deleteMyAccount);

router.get('/me', userController.getMe,userController.getUser);


router.use(authController.restrictTo('admin'));

router
  .route('/')
  .get(userController.getAllUsers)
router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteMyAccount);


module.exports = router;
