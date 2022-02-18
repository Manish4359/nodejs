const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');



exports.deleteOne =Model=> catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);
  
    if (!doc) {
      return next(new AppError(`document not found`, 404));
    }
  
    res.status(204).json({
      status: 'success',
      message: "tour deleted",
      data: null,
    });
  });

  exports.updateOne=Model=>catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
  
    if (!doc) {
      return next(new AppError(`document not found`, 404));
    }
  
    res.status(200).json({
      status: 'success',
      data: {
        doc,
      },
    });
  });

  exports.createOne=Model=>catchAsync(async (req, res, next) => {
    console.log(req.body);
    const doc = await Model.create(req.body);
    res.status(201).json({ status: 'success', data: doc });
  });