const express = require('express');
const tourController = require('./../controllers/tourController.js');
const authController = require('./../controllers/authController.js');
const reviewRouter=require('./../routes/reviewRoutes');
const router = express.Router();

//router.param('id', tourController.checkId);
router.use('/:tourId/reviews',reviewRouter);

router.route('/tour-stats').get(tourController.getTourStat);
router.route('/monthly-plan/:year').get(authController.protect,tourController.getMonthlyPlan);

router
  .route('/top-5-and-cheap')
  .get(tourController.aliasTopTours, tourController.getAllTours);

router
  .route('/')
  .get(tourController.getAllTours)
  .post(authController.protect,authController.restrictTo('guide','lead-guide'), tourController.createTour);

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(authController.protect,authController.restrictTo('guide','lead-guide'),tourController.updateTour)
  .delete(authController.protect, authController.restrictTo('guide','lead-guide'), tourController.deleteTour);

/* 
router
  .route('/:tourId/reviews')
  .post(authController.protect, authController.restrictTo('user'), reviewController.createReview)
 */



module.exports = router;
