const fs = require('fs');
const Tour = require('../models/tourModel.js');

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

exports.getAllTours = async (req, res) => {
  try {
    //BUILD QUERY

    //FILTERING

    console.log(req.query);
    const queryObj = { ...req.query };
    const excludedQuery = ['page', 'sort', 'fields', 'limits'];

    excludedQuery.forEach((el) => delete queryObj[el]);
    /*
    const query =  Tour.find()
      .where('difficulty')
      .equals('easy')
      .where('duration')
      .equals(5);*/

    //ADVANCED FILTERING
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (match) => `$${match}`);
    console.log(JSON.parse(queryStr));

    //EXECUTE QUERY

    let query = Tour.find(JSON.parse(queryStr));

    //SORTING

    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      console.log(sortBy);
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    }

    //LIMITING FIELDS
    if (req.query.fields) {
      const fields = req.query.fields.split(',').join(' ');

      query = query.select(fields);
    } else {
      query = query.select('-__v');
    }
    const tours = await query;

    res.status(200).json({
      status: 'success',
      results: tours.length,
      data: { tours },
    });
  } catch (err) {
    res.status(404).json({ status: 'failed', message: 'error' });
  }
};

exports.getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    //                 Tour.findOne({_id:req.params.id})

    res.status(200).json({
      status: 'success',
      data: { tour },
    });
  } catch (err) {
    res.status(404).json({ status: 'failed', message: 'error' });
  }
  /*
  const tour = tours.find((item) => {
    if (item.id === +id) return item;
  });

  res.status(200).json({
    status: 'success',
    data: { tour },
  });*/
};

exports.createTour = async (req, res) => {
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
  try {
    console.log(req.body);
    const newTour = await Tour.create(req.body);
    res.status(201).json({ status: 'success', data: { tour: newTour } });
  } catch (err) {
    res.status(400).json({ status: 'failed', message: 'Error occured' });
  }
};

exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(400).json({ status: 'failed', message: 'Error occured' });
  }
};

exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (err) {
    res.status(400).json({ status: 'failed', message: 'some error occured..' });
  }
};
