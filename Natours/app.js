const fs = require('fs');
const express = require('express');
const rateLimit=require('express-rate-limit');
const morgan = require('morgan');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

//global middlewares
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev')); 
}

const limiter=rateLimit({
  max:100,
  windowMs:60*60*1000,
  message:'Too many requests from this IP, try again later!'
});
app.use('/api',limiter);

app.use(express.json());

//view static files like html/images
app.use(express.static(`${__dirname}/public`));

app.use((req,res,next)=>{ 

req.requestTime=new Date().toISOString();
  console.log(req.headers);

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

