const User = require('../model/user');
const JSONTransport = require('nodemailer/lib/json-transport');
const ErrorHandler = require('../utills/errorHandler');
const catchAsyncErrors = require('./catchAsyncError');
const jwt = require('jsonwebtoken');

// check if user is authenticated or not
exports.isAuthenticatedUser = catchAsyncErrors(async (req, res, next) => {
    const { token } = req.cookies;
    if (!token) {
        return next(new ErrorHandler('Login first to access this resource', 401));
    }
    // if token exist verify user
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = await User.findById(decoded.id);
    next()
})

// handling AuthorizedUser role
exports.isAuthorizedUser = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new ErrorHandler(`Role (${req.user.role}) is not allowed to access this resources`,403))
        }
        next()
    }

}
