const mongoose = require('mongoose');


const reviewSchema = new mongoose.Schema({
    review: {
        type: String,
        required: [true, "please enter a review"]
    },
    rating: {
        type: Number,
        min: 1,
        max: 5
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    tour: {
        type: mongoose.Schema.ObjectId,
        ref: 'Tour',
        required: [true, 'must contain a tour']
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'must contain a user']
    }
},
    //options
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

reviewSchema.pre(/^find/, function(next){

    /*
    this.populate({

        path: 'tour',
        select: 'name id'
    }).populate({

        path: 'user',
        select: 'name photo'
    })*/

    this.populate({

        path: 'user',
        select: 'name photo'
    })

    next();
})

const Review = new mongoose.model('Review', reviewSchema);

module.exports = Review;

