const User = require('../models/userModel.js');
const AppError = require('../utils/appError.js');
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

const filteredObj=(body,...allowedFields)=>{

  let newBody={};

  Object.keys(body).forEach(el=>{

    if(allowedFields.includes(el)){
     newBody[el]=body[el];
    }
  });
  console.log(newBody);
  return newBody;
}

exports.updateMyData=catchAsync(async (req,res,next)=>{

  //create error if user inputs password for update
  if(req.body.password || req.body.passwordConfirm){
    return next(new AppError('cannot update password',400 ));
  }

  //update user account


  const filteredBody=filteredObj(req.body,'name','email');
  const updatedUser=await User.findByIdAndUpdate(req.user.id,filteredBody,{new:true,validator:true})

  res.status(200).json({
    status:'success',
    updatedUser
  });
})

exports.deleteMyAccount = catchAsync(async (req,res,next)=>{

  await User.findByIdAndUpdate(req.user.id,{isActive:false});

  res.status(204).json({
    status:'success',
  });

})
exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'server error',
    message: 'route not defined',
  });
};
exports.getUser = (req, res) => {
  res.status(500).json({
    status: 'server error',
    message: 'route not defined',
  });
};
exports.updateUser = (req, res) => {
  res.status(500).json({
    status: 'server error',
    message: 'route not defined',
  });
};
exports.deleteUser = (req, res) => {
  res.status(500).json({
    status: 'success',
    message: 'User',
  });
};
