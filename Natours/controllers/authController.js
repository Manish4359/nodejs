const crypto = require('crypto');

const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

//own modulues
const catchAsync = require('../utils/catchAsync');
const AppError = require('./../utils/appError')
const User = require('./../models/userModel');
const sendEmail = require('./../utils/email');

const signToken = id => jwt.sign({ id }, process.env.JWT_SECRET, {
  expiresIn: process.env.JWT_EXPIRES_TIME
});

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);

  const cookieOptions = {
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * process.env.JWT_COOKIE_EXPIRES_TIME),
    httpOnly: true
  }

  if (process.env.NODE_ENV == 'production') {
    cookieOptions.secure = true;
  }

  //hide password from output
  user.password=undefined;

  res.cookie('jwt', token, cookieOptions)

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
}
exports.signUp = catchAsync(async function (req, res, next) {
  //this code has a flow/ anyone can make themselves as an admin /can manipulate the data
  //const newUser = await User.create(req.body);

  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    changedPassAt: req.body.changedPassAt
  })


  createSendToken(newUser, 201, res);
});

exports.login = catchAsync(async function (req, res, next) {


  //const email=req.body.email;
  //const password=req.body.password;

  //es6 destructing
  const { email, password } = req.body;

  //check if email and password is exist
  if (!email || !password) {
    return next(new AppError('provide an email and password', 400));
  }

  //if username exists and pass is correct
  const user = await User.findOne({ email }).select('+password');

  console.log(user);

  //  const isPassCorrect=user.correctPass(password,user.password);

  if (!user || !await user.correctPass(password, user.password)) {
    return next(new AppError('incorrect email or password', 401));
  }


  //if eveything ok, send token to client

  createSendToken(user, 200, res);

});

exports.protect = catchAsync(async function (req, res, next) {

  //getting token
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {

    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new AppError('Not logged in, login to get access', 401));
  }
  //token verification
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  console.log(decoded);

  //check user exists
  const freshUser = await User.findById(decoded.id);

  if (!freshUser) {
    return next(new AppError('user belonging to this tokn doesn\'t exists', 401));
  }
  //check user changed pass after jwt issued
  if (freshUser.changedPass(decoded.iat)) {
    return next(new AppError('user changed password recently, please relogin again', 401));
  }

  //grant access to protected route
  req.user = freshUser;
  next();
});

exports.restrictTo = (...roles) => {
  return function (req, res, next) {

    if (!roles.includes(req.user.role)) {
      return next(new AppError('you have no permission', 403));
    }

    next();
  }
}

exports.forgotPass = catchAsync(async function (req, res, next) {

  //get user based on posted email id
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new AppError(`user not found`, 404));
  }

  //generate reset token 
  const resetToken = user.passResetToken();
  await user.save({ validateBeforeSave: false });

  //send to the user's email
  const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/reset-password/${resetToken}`;

  const message = `forgot password? enter new passord and confirm ${resetURL}`;

  try {

    await sendEmail({
      email: user.email,
      subject: 'your password reset token is valid for 10 min',
      message
    });


    res.status(200).json({
      status: 'success',
      message: 'token sent to email'
    })
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save({ validateBeforeSave: false });

    return next(new AppError('Errot occured while sending an email, try again later', 500));
  }
});


exports.resetPass = catchAsync(async function (req, res, next) {

  //get user based on token
  const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

  const user = await User.findOne({ passwordResetToken: hashedToken, passwordResetExpires: { $gt: Date.now() } });

  if (!user) {
    return next(new AppError(`token is invalid or expired`, 400));
  }

  //if token not expired and  set the new password
  /*if(req.body.password !== req.body.passwordConfirm){
    return next(new AppError(`password and password confirm doesn't match`,401))
  }*/
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  await user.save({ validateBeforeSave: true });

  //update password

  //log in and send jwt

  createSendToken(user, 200, res);

});

exports.updatePass = catchAsync(async (req, res, next) => {

  //get user from collection
  const user = await User.findById(req.user.id).select('+password');

  if (!user) {
    return next(new AppError('user not exists!!', 404));
  }
  //if entered password is correct

  if (!await user.correctPass(req.body.password, user.password)) {
    return next(new AppError('wrong password!!', 401));
  }

  //if password is correct, update password
  user.password = req.body.newPassword;
  user.passwordConfirm = req.body.newPasswordConfirm;
  await user.save();

  //login user in, Send JWT
  createSendToken(user, 200, res);

})