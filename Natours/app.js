const fs = require('fs');
const express = require('express');
const morgan = require('morgan');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');


const app = express();

//middleware
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}
app.use(express.json());


app.use(express.static(`${__dirname}/public`))


app.use((req, res, next) => {
    console.log("middleware 🤔");
    next();
});

app.use((req, res, next) => {
    req.requestTime = new Date().toISOString;
    next();
})



//route handlers 


// app.get('/api/v1/tours', getTour);

// app.get('/api/v1/tours/:id', getTour);

// app.post('/api/v1/tours', createTour);

// app.patch('/api/v1/tours/:id', updateTour);

// app.delete('/api/v1/tours/:id', deleteTour);

//routes


app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

module.exports = app;