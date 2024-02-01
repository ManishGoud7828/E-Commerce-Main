const app = require('./app')
const connectDatabase = require('./config/database')
// const dotenv = require('dotenv');
const cloudinary = require('cloudinary');

// handled uncaught Exception
process.on('uncaughtException', err => {
    console.log(`Error: ${err.message}`);
    console.log('Shutting down due to unhandled uncaught Exception');
    process.exit(1)
})

//setting up configfile
// dont want to use env on production mode
if(process.env.NODE_ENV !== 'PRODUCTION') require('dotenv').config({ path: 'backend/config/config.env' })

//connecting to Database
connectDatabase();

// setting up cloudinary configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

const server = app.listen(process.env.PORT, () => {
    console.log(`Server started on ${process.env.PORT} in ${process.env.NODE_ENV} mode.`);
})

// handle unHandeled Promise rejections
process.on('unhandledRejection', err => {
    console.log(`Error: ${err.message}`);
    console.log('Server shutting down due to unhandled Promise Rejection');
    server.close(() => {
        process.exit(1)
    })
})
