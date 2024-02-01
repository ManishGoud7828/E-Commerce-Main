const ErrorHandler = require('../utills/errorHandler');

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    if (process.env.NODE_ENV === "DEVELOPMENT") {
        res.status(err.statusCode).json({
            success: false,
            error: err,
            errMessage: err.message,
            stack: err.stack
        })
    }
    if (process.env.NODE_ENV === "PRODUCTION") {
        let error = { ...err }
        error.message = err.message
        // wrong mongoose object id Error
        if (err.name === "CastError") {
            const message = `Resource Not Found. Inavlid ${err.path}`
            error = new ErrorHandler(message, 400)
        }

        // handling mongoose Validation Error
        // check if it is (ValidatorError) ?
        if (err.name === "ValidationError") {
            const message = Object.values(err.errors).map(val => val.message)
            error = new ErrorHandler(message, 400)
        }
        // handling mongoose duplicate key error
        if(err.code === 11000){
            const message = `Duplicate ${Object.keys(err.keyValue)} entered`;
            error = new ErrorHandler(message, 400)
        }

         // handling wrong JWT Error        
        if (err.name === "JsonWebTokenError") {
            const message = 'Json Web Token is invalid. Try again!!';
            error = new ErrorHandler(message, 400)
        }
         // handling expired JWT Error        
         if (err.name === "TokenExpiredError") {
            const message = 'Json Web Token is expired. Try again!!';
            error = new ErrorHandler(message, 400)
        }

        res.status(error.statusCode).json({
            success: false,
            message: error.message || "Internal Server Error"
        })
    }
}