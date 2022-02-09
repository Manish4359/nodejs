const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');


const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Enter a username'],
  },
  email: {
    type: String,
    unique: true,
    required: [true, 'an email is required'],
    lowercase: true,
    validate: [validator.isEmail, 'invalid email'],
  },
  photo: String,
  password: {
    type: String,
    required: [true, 'enter a password'],
    minlength: [8, 'password must contain atleast 8 digits'],
    select: false
  },
  passwordConfirm: {
    type: String,
    required: [true, 'enter a password'],
    validate: {
      //this only works on create and save
      validator: function (val) {
        return val === this.password;
      },
      message: "password doesn't match",
    },
  },
  changedPassAt: Date,
  role: {
    type: String,
    enum: ['user', 'guide', 'admin'],
    default: 'user'
  },
  passwordResetToken:String,
  passwordResetExpires:Date
});
userSchema.pre('save', async function (next) {
  //run if pass was modified
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);

  this.passwordConfirm = undefined;

  next();
});

userSchema.pre('save',function(next){

  if(!this.isModified('password') || this.isNew)return next();

  this.passwordChangedAt=Date.now() - 1000;
  next();
});

//this method is a instance method, available to all the user docoments
userSchema.methods.correctPass = async function (candidatePass, userPass) {

  return await bcrypt.compare(candidatePass, userPass);
}

userSchema.methods.changedPass = function (JWTToken) {

  if (this.changedPassAt) {

    const changedTime = parseInt(this.changedPassAt.getTime() / 1000);

    return JWTToken < changedTime;
  }

  return false;
}

userSchema.methods.passResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken= crypto.createHash('sha256').update(resetToken).digest('hex');

  this.passwordResetExpires=Date.now()+10*60*1000;

  console.log(this.passwordResetToken, this.passwordResetExpires);
  
  return resetToken;
}
const User = new mongoose.model('User', userSchema);

module.exports = User;
