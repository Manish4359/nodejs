const fs = require('fs');

const Tour = require('../models/tourModel.js');
const APIFeatures = require('../utils/apiFeatures');
const factory = require('./handleFactory');

const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError.js');
const { default: dist } = require('express-rate-limit');

const multer = require('multer');
const sharp = require('sharp');


const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {

  if (file.mimetype.startsWith('image')) {

    cb(null, true);
  } else {
    cb(new AppError('Not an Image', 400), false);
  }
}

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter
})

exports.uploadTourImages = upload.fields(
  [{ name: 'imageCover', maxCount: 1 },
  { name: 'images', maxCount: 3 }]
)
//upload.single('image) req.file
//upload.array('image,5) req.files
exports.resizeTourImages = catchAsync(async (req, res, next) => {

  if (!req.files.imageCover || !req.files.images) {
    return next();
  }

  //cover Image
  req.body.imageCover = `tour-${req.params.id}-${Date.now()}-cover.jpeg`;

  await sharp(req.files.imageCover[0].buffer)
    .resize(2000, 1333)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/tours/${req.body.imageCover}`);

  req.body.images = [];
  await Promise.all(req.files.images.map(async (file, index) => {
    const filename = `tour-${req.params.id}-${Date.now()}-${index + 1}.jpeg`;

    await sharp(file.buffer)
      .resize(2000, 1333)
      .toFormat('jpeg')
      .jpeg({ quality: 90 })
      .toFile(`public/img/tours/${filename}`);

    req.body.images.push(filename);
  })
  )
  next();
})
/*
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);*/

/*
exports.checkId = (req, res, next, val) => { 
  console.log(`id:${val}`);
  if (req.params.id >= tours.length) {
    return res.status(404).json({
      status: 'failed',
      message: 'invalid id',
    });
  }
  next();
};*/

/*
exports.checkBody = (req, res, next) => {
  if (!req.body.name || !req.body.price) {
    return res.status(400).json({
      status: 'failed',
      message: 'not found',
    });
  }

  next(); 
};*/

//middleware
exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '3';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,difficulty';
  next();
};

exports.getAllTours = factory.getAll(Tour);
/*
exports.getAllTours = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Tour.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const tours = await features.query;

  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: { tours },
  });
});*/

//BUILD QUERY

//FILTERING
/*
    console.log(req.query);
    const queryObj = { ...req.query };
    const excludedQuery = ['page', 'sort', 'fields', 'limit'];

    excludedQuery.forEach((el) => delete queryObj[el]);
    */
/*
    const query =  Tour.find()
      .where('difficulty')
      .equals('easy')
      .where('duration') 
      .equals(5);*/

//ADVANCED FILTERING
/*
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (match) => `$${match}`);
    console.log(JSON.parse(queryStr));
*/
//EXECUTE QUERY

//let query = Tour.find(JSON.parse(queryStr));

//SORTING
/*
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      console.log(sortBy);
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    }
    */

//LIMITING FIELDS
/*  if (req.query.fields) {
      const fields = req.query.fields.split(',').join(' ');

      query = query.select(fields);
    } else {
      query = query.select('-__v');
    }
*/
//PAGINATION
/*   const page = +req.query.page || 1;
    const pageLimit = +req.query.limit || 10;
    const skip = (page - 1) * pageLimit;
    console.log(req.query);
    query = query.skip(skip).limit(pageLimit);

    if (req.query.page) {
      const numTours = await Tour.countDocuments();
      if (skip >= numTours) throw new Error(`page doesn't exist`);
    }*/

///////////////////////////////////////////////////////////////


exports.getTour = factory.getOne(Tour, { path: 'reviews' });

/*
exports.getTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findById(req.params.id).populate('reviews');
  if (!tour) {
    return next(new AppError(`Tour not found`, 404));
  }
  res.status(200).json({
    status: 'success',
    data: { tour },
  });
});
*/
/*
const tour = tours.find((item) => {
  if (item.id === +id) return item;
});

res.status(200).json({
  status: 'success',
  data: { tour },
});*/

///////////////////////////////////////////////////////////////

exports.createTour = factory.createOne(Tour);
/*
exports.createTour = catchAsync(async (req, res, next) => {
  console.log(req.body);
  const newTour = await Tour.create(req.body);
  res.status(201).json({ status: 'success', data: { tour: newTour } });
});
*/

/*
  console.log(req.body); 
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);

  tours.push(newTour);
  fs.writeFile(
    `${__dirname}/../dev-data/data/tours-simple.json`,
    JSON.stringify(newTour),
    (err) => {
      res.status(201).json({ status: 'success', data: { tour: newTour } });
    } 
  )*/

///////////////////////////////////////////////////////////////


exports.updateTour = factory.updateOne(Tour);

/*
exports.updateTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!tour) {
    return next(new AppError(`Tour not found`, 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
});*/

///////////////////////////////////////////////////////////////

exports.deleteTour = factory.deleteOne(Tour);
/*
exports.deleteTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findByIdAndDelete(req.params.id);

  if (!tour) {
    return next(new AppError(`Tour not found`, 404));
  }

  res.status(204).json({
    status: 'success',
    message: "tour deleted",
    data: null,
  });
});*/

//////////////////////////////////////////////////////

exports.getTourStat = catchAsync(async (req, res, next) => {
  const stats = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } },
    },
    {
      $group: {
        _id: { $toUpper: '$difficulty' },
        numTour: { $sum: 1 },
        numRatings: { $sum: '$ratingsQuantity' },
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
      },
    },
    {
      $sort: {
        avgPrice: -1,
      },
    },
  ]);

  res.status(200).json({
    message: 'success',
    data: { stats },
  });
});

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
  const year = +req.params.year;
  const plan = await Tour.aggregate([
    {
      $unwind: '$startDates',
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        numTourStarts: { $sum: 1 },
        tours: { $push: '$name' },
      },
    },
    {
      $addFields: { month: '$_id' },
    },
    {
      $project: {
        _id: 0,
      },
    },
    {
      $sort: {
        numTourStarts: -1,
      },
    },
    {
      $limit: 12,
    },
  ]);

  res.status(200).json({
    status: 'success',
    data: { plan },
  });
});

exports.getToursWithin = catchAsync(async (req, res, next) => {

  const { distance, latlng, unit } = req.params;

  const radius = unit === 'mi' ? distance / 3963.2 : 6378.1;

  const [lat, lng] = latlng.split(',');

  if (!lat || !lng) {
    next(new AppError('provide a valid latitude and longitude', 404));
  }


  const tours = await Tour.find({
    startLocation: { $geoWithin: { $centerSphere: [[lng, lat], radius] } }
  });



  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours
    }
  })
})

exports.getAllDistance = catchAsync(async (req, res, next) => {

  const { latlng, unit } = req.params;

  const [lat, lng] = latlng.split(',');

  const multiplier = unit === 'mi' ? 0.000621371 : 0.001;
  if (!lat || !lng) {
    next(new AppError('provide a valid latitude and longitude', 404));
  };

  const distances = await Tour.aggregate([
    {

      //must be a first stage
      $geoNear: {
        near: {
          type: "Point", coordinates: [+lng, +lat]
        },
        distanceField: 'distance',
        distanceMultiplier: multiplier
      }
    },
    {
      $project: {
        distance: 1,
        name: 1
      }
    }
  ])

  res.status(200).json({
    status: 'success',
    data: {
      distances
    }
  })
})