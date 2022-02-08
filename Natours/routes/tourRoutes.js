const express = require('express');
const tourController = require('./../controllers/tourController.js');
const authController = require('./../controllers/authController.js');

const router = express.Router();

//router.param('id', tourController.checkId);

router.route('/tour-stats').get(tourController.getTourStat);
router.route('/monthly-plan/:year').get(tourController.getMonthlyPlan);

router 
  .route('/top-5-and-cheap')
  .get(tourController.aliasTopTours, tourController.getAllTours);

router
  .route('/')
  .get(authController.protect, tourController.getAllTours)
  .post(/*tourController.checkBody,*/ tourController.createTour);
router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = router;
