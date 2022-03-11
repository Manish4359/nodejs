const catchAsync = require('../utils/catchAsync');
const Tour = require('./../models/tourModel');
const AppError = require('./../utils/appError')

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

exports.getCheckoutSession = catchAsync(async (req, res) => {

    //Get the currently booked tour
    const tour = await Tour.findById(req.params.tourId);

    //crate cheackout session
    const session = await stripe.checkout.sessions.create({
        payment_method_types:['card'],
        success_url: `${req.protocol}://${req.get('host')}/`,
        cancel_url:`${req.protocol}://${req.get('host')}/${tour.slug}`,
        customer_email:req.user.email,
        client_reference_id:req.params.id,
        line_items:[
            {
                name:`${tour.name} Tour`,
                description:tour.summary,
                images:[`https://www.natours.dev/img/tours/${tour.imageCover}`],
                amount:tour.price,
                currency:'inr',
                quantity:1

            }
        ]
    });

    //create session response
    res.status(200).json({
        status:'success',
        session
    })
})