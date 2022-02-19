const express = require('express');

const reviewController = require('./../controllers/reviewController');
const authController = require('./../controllers/authController.js');


const router = express.Router({ mergeParams: true });


//given router will work for these type of routes
// POST /tour/65465165/reviews
// POST /review

//this will add this middleware to all the routes below 
router.use(authController.protect);

router.
    route('/')
    .get(reviewController.getAllReviews)
    .post(authController.restrictTo('user'), reviewController.setReviewTourUserIds, reviewController.createReview)



router.
    route('/:id')
    .get(reviewController.getReview)
    .delete(authController.restrictTo('user', 'admin'), reviewController.deleteReview)
    .patch(authController.restrictTo('user', 'admin'), reviewController.updateReview)



module.exports = router;