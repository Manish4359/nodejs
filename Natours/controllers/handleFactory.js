const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

const APIFeatures=require('./../utils/apiFeatures')



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
    //console.log(req.body);
    const doc = await Model.create(req.body);
    res.status(201).json({ status: 'success', data: doc });
  });


  exports.getOne=(Model,populateOpt)=>catchAsync(async (req, res, next) => {
    const query =  Model.findById(req.params.id);

    if(populateOpt){
        query.populate(populateOpt);
    }

    const doc=await query;
  
    if (!doc) {
      return next(new AppError(`document not found`, 404));
    }
  
    res.status(200).json({
      status: 'success',
      data: { doc },
    });
  });


  exports.getAll=Model=>catchAsync(async (req, res, next) => {

    //to allow nested get routes
    let filter={};
    if(req.params.tourId){
        filter={tour:req.params.tourId}
    }

    const features = new APIFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
  
    const doc = await features.query;
    //const doc = await features.query.explain();
  
    res.status(200).json({
      status: 'success',
      results: doc.length,
      data: { doc },
    });
  });;