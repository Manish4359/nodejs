const fs = require('fs');

const Review = require('../models/reviewModel.js');
const APIFeatures = require('../utils/apiFeatures');
const factory=require('./handleFactory');

const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError.js');

exports.getAllReviews=catchAsync(async (req,res,next)=>{

    let filter={};

    if(req.params.tourId){
        filter={tour:req.params.tourId}
    }
    const reviews=await Review.find(filter);

    if(!reviews){
        return next(new AppError('no reviews found!!',404));

    }

    res.status(200).json({
        status:'success',
        results:reviews.length,
        data:{
            reviews
        }
    })

});

exports.setReviewTourUserIds=(req,res,next)=>{
    if(!req.body.tour){
        req.body.tour=req.params.tourId;
    }
    if(!req.body.user){
        req.body.user=req.user.id;
    }

    next();
};

exports.createReview=catchAsync( async (req,res,next)=>{

    const data = await Review.create({
        review:req.body.review,
        rating:req.body.rating,
        tour:req.body.tour,
        user:req.body.user
    });

    res.status(201).json({
        status:'success',
        data
    })
})



exports.deleteReview=factory.deleteOne(Review);

exports.updateReview = factory.updateOne(Review);

