const express = require('express');
const viewsController = require('./../controllers/viewsController')
const authController = require('./../controllers/authController')

const router = express.Router();

//router.use(authController.isLoggedIn);
router.get('/',authController.isLoggedIn, viewsController.getOverview);

router.get('/tour/:slug',authController.isLoggedIn, viewsController.getTour);

router.get(`/login`,authController.isLoggedIn,viewsController.login);
//router.get(`/login/%F0%9F%98%81/`,viewsController.login);

router.get('/about',authController.protect,viewsController.myAccount);
router.post('/submit-user-data',authController.protect,viewsController.UpdateAccount);
 
module.exports = router;