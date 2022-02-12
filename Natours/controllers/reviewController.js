const fs = require('fs');

const Review = require('../models/reviewModel.js');
const APIFeatures = require('../utils/apiFeatures');

const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError.js');

exports.getAllReviews=catchAsync(async (req,res,next)=>{

    const reviews=await Review.find();

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



