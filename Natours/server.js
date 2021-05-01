const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = require('./app');

dotenv.config({
    path: './config.env'
});

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

//online
mongoose.connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
}).then(con => {
    console.log('DB connection successful🥳🥳🥳')
})

const tourSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'name is required'],
        unique: true
    },
    rating: {
        type: Number,
        default: 4.5
    },
    price: {
        type: Number,
        required: [true, 'price is required']
    }
});

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Enter your firstName']
    },
    age: {
        type: Number,
        required: [true, 'Enter your age']
    },
    fathersName: {
        type: String,
    }
});

const Tour = mongoose.model('Tour', tourSchema);

const Persondetails = mongoose.model('Persondetails', personSchema);


// const testTour = new Tour({
// }); 

const addPerson = new Persondetails({
    name: "Manish Kumar",
    age: 20,
    fathersName: "Ajay Prasad"
});

// testTour.save().then(doc => {
//     console.log(doc);
// }).catch(err => {
//     console.log('Error : 😑');
// });

addPerson.save().then(doc => {
    console.log(doc);
}).catch(err => {
    console.log('An ERROR occured!!');
});

const port = process.env.PORT || 8888;

//console.log(process.env);   

app.listen(port, () => {
    console.log(` app listening on port ${port}...`);
});