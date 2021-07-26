const fs = require('fs');
const express = require('express');
const morgan = require('morgan');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());
app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
  console.log('middlware');
  next();
});

// app.get('/api/v1/tours', getAllTours);
// app.get('/api/v1/tours/:id', getTour);
// app.post('/api/v1/tours', createTour);
// app.patch('/api/v1/tours/:id', updateTour);
// app.delete('/api/v1/tours/:id', deleteTour);

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

module.exports = app;

const arr = ['a', 'h', 'i', 'gg', 'k', 'aa', 'll', 'm', 'n', 'oo', 'cc', 'z'];
const l = arr.length;
// let count;

// for (let i = 0; i < l; i++) {
//   count = 0;
//   for (let j = 0; j < l - 1; j++) {
//     if (arr[j].charAt(0) > arr[j + 1].charAt(0)) {
//       [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
//       count++;
//     }
//     if (arr[j].length < arr[j + 1].length) {
//       [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
//       count++;
//     }
//   }

//   if (!count) break;
// }

// let p1 = 0,
//   p2 = l - 1;

// while (p1 < p2) {
//   if (arr[p1].length < arr[p2].length) {
//     [arr[p1], arr[p2]] = [arr[p2], arr[p1]];
//     p1++;
//   }

//   if (arr[p1].length > arr[p2].length) {
//     p1++;
//   }

//   if (arr[p1].length === arr[p2].length) {
//     p1++;
//     p2--;
//   }
// }
