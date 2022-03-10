const AppError = require('../utils/appError.js');


const handleCastErrorDB = (err) => {
  const message = `invalid ${err.path} : ${err.value}`;
  return new AppError(message, 400);
};
const handleJWTError = () => new AppError('invalid token, please login again', 401);

const handleJWTExpiredError = () => new AppError('token expired, please login again', 401);

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

const sendErrorDev = (err, req, res) => {

  if (req.originalUrl.startsWith('/api')) {

    res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });

  } else {
    res.status(err.statusCode).render('error', {
      title: 'not found',
      msg: err.message
    })
  }
};

const sendErrorProd = (err, req, res) => {

  if (req.originalUrl.startsWith('/api')) {
    if (err.isOperational) {
     return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    } 
     return res.status(500).json({
        status: 'error',
        message: 'something went wrong',
      });
  }
  if (err.isOperational) {
      res.status(err.statusCode).render('error',{
        title: 'something went wrong',
        msg: err.message
      })
    }
    res.status(err.statusCode).render('error', {
      title: 'something went wrong',
      msg: 'Please try again later'
    })
};

module.exports = (err, req, res, next) => {
  // console.log(err.stack);
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    console.log('dev');
    sendErrorDev(err, req, res);
  }

  if (process.env.NODE_ENV == 'production') {
    let error = { ...err };
    error.isOperational = true;

    console.log(error);

    if (err.name === 'CastError') {
      error = handleCastErrorDB(err);
    }
    if (err.code === 11000) {
      error = handleDuplicateFieldsDB(err);
    }

    if (err.name === 'ValidationError') {
      error = handleValidationErrorDB(err);
    }

    if (err.name === 'JsonWebTokenError') {
      error = handleJWTError(error);
    }
    if (err.name === 'TokenExpiredError') {
      error = handleJWTExpiredError(error);
    }
    sendErrorProd(error, req, res);
  }
};
