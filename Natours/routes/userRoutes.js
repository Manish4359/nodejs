const express = require('express');
const userController = require('./../controllers/userController.js');
const authController = require('./../controllers/authController.js');

const router = express.Router();

router.route('/signup').post(authController.signUp);
router.route('/login').post(authController.login);
router.post('/forgot-password',authController.forgotPass);
router.patch('/reset-password/:token', authController.resetPass);
router.patch('/update-password',authController.protect, authController.updatePass);

router.patch('/update-profile',authController.protect,userController.updateData);


router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);
router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
