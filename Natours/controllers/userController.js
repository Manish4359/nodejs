const User = require('../models/userModel.js');
const AppError = require('../utils/appError.js');
const catchAsync = require('./../utils/catchAsync.js');
const multer = require('multer');
const sharp = require('sharp');

const factory = require('./handleFactory');


/*
const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/img/users')
  },
  filename: (req, file, cb) => {
    // user-451265f2g5-496523.jpg
    const ext = file.mimetype.split('/')[1]
    cb(null, `user-${req.user.id}-${Date.now()}.${ext}`)
  }
})*/

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

exports.uploadUserPhoto = upload.single('photo');

exports.resizeUserPhoto = catchAsync(async (req, res, next) => {

  if (!req.file) {
    return next();
  }

  req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/users/${req.file.filename}`);


  next();
})
/*
exports.getAllUsers = catchAsync(async (req, res) => {
  
  const data = await User.find();

  res.status(200).json({
    status: 'success',
    message: {
      data
    }
  });
});*/

const filteredObj = (body, ...allowedFields) => {

  let newBody = {};

  Object.keys(body).forEach(el => {

    if (allowedFields.includes(el)) {
      newBody[el] = body[el];
    }
  });
  return newBody;
}
exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;

  next();
}
exports.updateMyData = catchAsync(async (req, res, next) => {

  //create error if user inputs password for update
  if (req.body.password || req.body.passwordConfirm) {
    return next(new AppError('cannot update password', 400));
  }

  //update user account

  const filteredBody = filteredObj(req.body, 'name', 'email');
  if (req.file) filteredBody.photo = req.file.filename;

  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, { new: true, validator: true })

  res.status(200).json({
    status: 'success',
    updatedUser
  });
})


exports.deleteMyAccount = catchAsync(async (req, res, next) => {

  await User.findByIdAndUpdate(req.user.id, { isActive: false });

  res.status(204).json({
    status: 'success',
  });

})


//do not update passwords with this
exports.updateUser = factory.updateOne(User);

exports.deleteUser = factory.deleteOne(User);

exports.getUser = factory.getOne(User);

exports.getAllUsers = factory.getAll(User);
