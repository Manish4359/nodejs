const Tour = require('./../models/tourModel');
const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync')
const url = require('url')
const AppError = require('./../utils/appError')

exports.getOverview = catchAsync(async (req, res, next) => {

    //get tour data from collection
    const tours = await Tour.find();
    // console.log(tours);

    //build template

    //render
    res.status(200).render('overview', {
        title: `Exciting tours for adventurous people`,
        tours
    })
})

exports.getTour = catchAsync(async (req, res, next) => {

    const tour = await Tour.findOne({ slug: req.params.slug }).populate({
        path: 'reviews',
        fields: 'review rating user'
    });

    if (!tour) {
        /*res.status(404).render('error', {
            title: 'not found'
        })*/
        return next(new AppError('Tour not found', 404));
    } else {

        res.status(200).set(
            'Content-Security-Policy',
            "default-src 'self' https://*.mapbox.com ;base-uri 'self';block-all-mixed-content;font-src 'self' https: data:;frame-ancestors 'self';img-src 'self' data:;object-src 'none';script-src https://cdnjs.cloudflare.com https://api.mapbox.com 'self' blob: ;script-src-attr 'none';style-src 'self' https:'unsafe-eval' 'unsafe-inline';upgrade-insecure-requests;"
        ).render('tour', {
            title: tour.name,
            tour
        })
    }
});

exports.myAccount = catchAsync(async (req, res, next) => {

    res.status(200).render('user', {
        title: 'My Account'
    })
})

exports.login = catchAsync(async (req, res, next) => {

    res.status(200).set({
        'Content-Security-Policy': "script-src https://cdnjs.cloudflare.com 'self'",
    }).render('login', {
        title: 'Login'
    })
})

/*
exports.UpdateAccount = catchAsync(async (req, res, next) => {
    const updatedUser = await User.findByIdAndUpdate(req.user._id, {
        name: req.body.name,
        email: req.body.email
    }, {
        new: true, validators: true
    });

    res.locals.user=updatedUser;

    res.status(200).render('user', {
        title: 'My Account'
    })
})*/

exports.UpdateAccount = catchAsync(async (req, res, next) => {
    res.status(200).render('user',{
        title: 'My Account'
    })
})