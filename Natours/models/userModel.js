const mongoose = require('mongoose');
const validator = require('validator');

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
  },
  passwordConfirm: {
    type: String,
    required: [true, 'enter a password'],
    validate: {
      validator: function (val) {
        return val === this.password;
      },
      message: "password doesn't match",
    },
  },
});

const User = new mongoose.model('User', userSchema);

module.exports = User;
