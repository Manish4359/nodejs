const express = require('express');

const reviewController = require('./../controllers/reviewController');
const authController = require('./../controllers/authController.js');


const router = express.Router({ mergeParams: true });


//given router will work for these type of routes
// POST /tour/65465165/reviews
// POST /review
router.
    route('/')
    .get(reviewController.getAllReviews)
    .post(authController.protect, authController.restrictTo('user'), reviewController.setReviewTourUserIds, reviewController.createReview);

router.
    route('/:id')
    .delete(authController.protect, reviewController.deleteReview)
    .patch(reviewController.updateReview);


module.exports = router;