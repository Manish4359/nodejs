const mongoose = require('mongoose');
const dotenv = require('dotenv');


process.on('uncaughtException', (err) => {
  console.log(err.name, err.message,err);
  process.exit(1);
});


dotenv.config({ path: './config.env' });

const app = require('./app');


const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);


mongoose
  .connect(DB, {
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then(() => {
    console.log('DB connected..');
  });

  
const port = 3000;


const server = app.listen(port, () => {
  console.log(`listening to port ${port}`);
});


process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message,err);
  server.close(() => process.exit(1));
});
