const {promisify}=require('util');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

//own modulues
const catchAsync = require('../utils/catchAsync');
const AppError = require('./../utils/appError')
const User = require('./../models/userModel');


const signToken = id => jwt.sign({id}, process.env.JWT_SECRET, {
  expiresIn: process.env.JWT_EXPIRES_TIME
});

exports.signUp = catchAsync(async function (req, res, next) {
  //this code has a flow/ anyone can make themselves as an admin /can manipulate the data
  //const newUser = await User.create(req.body);

  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    changedPassAt:req.body.changedPassAt
  })

  const token = signToken(newUser._id);

  res.status(201).json({
    status: 'success',
    token,
    data: {
      user: newUser,
    },
  });
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
  const token = signToken(user._id);

  res.status(200).json({
    status: 'success',
    token
    
  });
});

exports.protect=catchAsync(async function(req,res,next){

  //getting token
  let token;

  if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){

    token=req.headers.authorization.split(' ')[1];
  }

  if(!token){
    return  next(new AppError('Not logged in, login to get access',401));
  }
  //token verification
  const decoded=await promisify(jwt.verify)(token,process.env.JWT_SECRET);
  console.log(decoded);

  //check user exists
  const freshUser=await User.findById(decoded.id);

  if(!freshUser){
    return next( new AppError('user belonging to this tokn doesn\'t exists',401));
  }
  //check user changed pass after jwt issued
  if(freshUser.changedPass(decoded.iat)){
    return next(new AppError('user changed password recently, please relogin again',401));
  }

  //grant access to protected route
  req.user=freshUser;
  next();
});