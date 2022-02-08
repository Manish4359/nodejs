const User = require('../models/userModel.js');
const catchAsync = require('./../utils/catchAsync.js');


exports.getAllUsers = catchAsync(async (req, res) => {

  const data= await User.find();

  res.status(200).json({
    status: 'success',
    message: {
      data
    }
  });
});
exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'server error',
    message: 'not defined',
  });
};
exports.getUser = (req, res) => {
  res.status(500).json({
    status: 'server error',
    message: 'not defined',
  });
};
exports.updateUser = (req, res) => {
  res.status(500).json({
    status: 'server error',
    message: 'not defined',
  });
};
exports.deleteUser = (req, res) => {
  res.status(500).json({
    status: 'success',
    message: 'User',
  });
};
