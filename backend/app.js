const express = require('express')
const app = express();
const errorMiddleware = require('./middlewares/error');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const fileupload = require('express-fileupload');
// const dotenv = require('dotenv');
const path = require('path');

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(fileupload());

//setting up configfile
// dont want to use env on production mode
if(process.env.NODE_ENV !== 'PRODUCTION') require('dotenv').config({ path: 'backend/config/config.env' })

// import all routes 
const products = require('./routes/products');
const auth = require('./routes/userAuth');
const payment = require('./routes/payment');
const order = require('./routes/order');


app.use('/api/v1', products)
app.use('/api/v1', auth)
app.use('/api/v1', payment)
app.use('/api/v1', order)

if (process.env.NODE_ENV === 'PRODUCTION') {
    app.use(express.static(path.join(__dirname, '../frontend/build')));
    // get all routes
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, '../frontend/build' , 'index.html'));
    });
}

// middleware to handle error
app.use(errorMiddleware);
module.exports = app;