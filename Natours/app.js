const fs = require('fs');
const express = require('express');
const rateLimit=require('express-rate-limit');
const morgan = require('morgan');
const helmet=require('helmet');
const mongoSanitize=require('express-mongo-sanitize');
const xss=require('xss-clean');
const hpp=require('hpp');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

//global middlewares
//sets security http headers
app.use(helmet());


if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev')); 
}

//limit user requests
const limiter=rateLimit({
  max:100,
  windowMs:60*60*1000,
  message:'Too many requests from this IP, try again later!'
});
app.use('/api',limiter);

///body parser, reading data from body into req.body
app.use(express.json({limit:'10kb'}));

//data sanitization against noSQL query injection
app.use(mongoSanitize()); 

//data sanitization against XSS
app.use(xss());

//prevent http parameter  pollution
app.use(hpp({
  whitelist:['duration','maxGroupSize','difficulty','ratingsAverage','ratingsQuantity','price']
}));

//view static files like html/images
app.use(express.static(`${__dirname}/public`));

//test middleware
app.use((req,res,next)=>{ 

req.requestTime=new Date().toISOString();
 // console.log(req.headers);

  next();
})

console.log(process.env.NODE_ENV);

// app.get('/api/v1/tours', getAllTours);
// app.get('/api/v1/tours/:id', getTour);
// app.post('/api/v1/tours', createTour);

// app.patch('/api/v1/tours/:id', updateTour);
// app.delete('/api/v1/tours/:id', deleteTour);

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

app.all('*', (req, res, next) => {
  // const err = new Error(`can't find ${req.originalUrl} on the server`);
  // err.status = 'fail';
  // err.statusCode = 404;
 // console.log('globalerr');
  next(new AppError(`can't find ${req.originalUrl} on the server`, 404));
});

app.use(globalErrorHandler);

module.exports = app;

