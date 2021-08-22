const AppError = require('../utils/appError.js');

const handleCastErrorDB = (err) => {
  const message = `invalid ${err.path} : ${err.value}`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
  const value = err.errmsg?.match(/(["'])(?:(?=(\\?))\2.)*?\1/)[0];

  const message = `duplicate field value:${value} , use another value`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors)
    .map((val) => val.message)
    .join(', ');
  const message = `invalid input data ; ${errors}`;
  return new AppError(message, 400);
};

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    res.status(500).json({
      status: 'error',
      message: 'something went wrong',
    });
  }
};

module.exports = (err, req, res, next) => {
  // console.log(err.stack);
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    console.log('dev');
    sendErrorDev(err, res);
  }

  if (process.env.NODE_ENV == 'production') {
    let error = { ...err };
    error.isOperational = true;

    if (err.name === 'CastError') {
      error = handleCastErrorDB(err);
    }
    if (err.code === 11000) {
      error = handleDuplicateFieldsDB(err);
    }

    if (err.name === 'ValidationError') {
      error = handleValidationErrorDB(err);
    }
    sendErrorProd(error, res);
  }
};
