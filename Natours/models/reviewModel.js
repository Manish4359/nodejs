const Tour = require('./tourModel');
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

reviewSchema.pre(/^find/, function (next) {

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
        select: 'name'
    })

    next();
})

//will restrict user to write one review per tour
reviewSchema.index({tour:1,user:1},{unique:true});

reviewSchema.statics.calcAverageRatings = async function (tourId) {

    const stats = await this.aggregate([
        {
            $match: {
                tour: tourId
            }
        },
        {
            $group: {
                _id: '$tour',
                numOfRating: { $sum: 1 },
                avgRating: { $avg: '$rating' }
            }
        }
    ]);
    
    if(stats.length >0){
        await Tour.findByIdAndUpdate(tourId, {
            ratingsAverage:stats[0].avgRating,
            ratingsQuantity:stats[0].numOfRating
        });
    }else{
        await Tour.findByIdAndUpdate(tourId, {
            ratingsAverage:0,
            ratingsQuantity:4.5
        });
    }

    // tour.ratingsAverage=stats[0].avgRating;
    //tour.ratingsQuantity=stats[0].numOfRating;

    // await tour.save();

}

reviewSchema.post('save', function () {

    //'this' points to current document
    this.constructor.calcAverageRatings(this.tour);
})

reviewSchema.pre(/^findOneAnd/,async function(next){
   this.rev=await this.findOne();
    next();
});


reviewSchema.post(/^findOneAnd/,async function(){

    //await this.findOne(); will not work because this query has already been executed(since we have called posst middleware)
    await this.rev.constructor.calcAverageRatings(this.rev.tour);
});

const Review = new mongoose.model('Review', reviewSchema);

module.exports = Review;

