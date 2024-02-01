const User = require('../model/user');
const ErrorHandler = require('../utills/errorHandler');
const sendEmail = require('../utills/sendEmail');
const cathcAsyncErrors = require('../middlewares/catchAsyncError');
const sendToken = require('../utills/jwtToken');
const crypto = require('crypto');
const cloudinary = require('cloudinary');

// register a user => /api/v1/register
exports.registerUser = cathcAsyncErrors(async (req, res, next) => {

    const result = await cloudinary.v2.uploader.upload(req.body.avatar, {
        folder: 'avatars',
        width: 150,
        crop: 'scale'
    })

    const { name, email, password } = req.body;
    const user = await User.create({
        name,
        email,
        password,
        avatar: {
            public_id: result.public_id,
            url: result.secure_url
        }
    })

    sendToken(user, 200, res);
})

// login user => /api/v1/login
exports.loginUser = cathcAsyncErrors(async (req, res, next) => {
    const { email, password } = req.body;
    // check if user and pass is entered by user
    if (!email || !password) {
        return next(new ErrorHandler('Please enter Email and Password'), 400);
    }

    // finding user in database
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
        return next(new ErrorHandler('Invalid Email or Password', 401));
    }

    // check if pass is correct or not
    const isPasswordMatched = await user.comparePassword(password);
    if (!isPasswordMatched) {
        return next(new ErrorHandler('Invalid Email or Password', 401));
    }

    sendToken(user, 200, res);
})

// logout user => /api/v1/logout
exports.logout = cathcAsyncErrors(async (req, res, next) => {
    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true
    })
    res.status(200).json({
        success: true,
        message: 'Logout Successfully!'
    })
})

// forgot password =>/api/v1/password/forgot
exports.forgotPassword = cathcAsyncErrors(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        return next(new ErrorHandler('User Not found with this email', 404));
    }

    // get reset token
    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforesave: false })

    // create reset password url
    const resetURL = `${req.protocol}://${req.get('host')}/password/reset/${resetToken}`;
    // const resetURL = `${process.env.FRONTEND_URL}/password/reset/${resetToken}`;

    const message = `Your password reset token is as follow: \n\n${resetURL}\n\n If you have not requested this email, then ignore it.`

    try {
        await sendEmail({
            email: user.email,
            subject: 'shopIT Password Recovery',
            message
        })
        res.status(200).json({
            success: true,
            message: `Message sent to: ${user.email}`
        })

    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save({ validateBeforesave: false })
        return next(new ErrorHandler(error.message, 500))
    }
})

// reset password =>/api/v1/password/reset/:token
exports.resetPassword = cathcAsyncErrors(async (req, res, next) => {
    // Hash URL token
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

    const user = await User.findOne({
        // resetPasswordExpire in DB must be greater than current time
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() }
    })

    if (!user) {
        return next(new ErrorHandler('Reset Password is inavlid or Expired', 400));
    }
    if (req.body.password !== req.body.confirmPassword) {
        return next(new ErrorHandler('Password Not Matched', 400));
    }

    // setup new password
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();
    sendToken(user, 200, res)

})

// get current logged in user profile =>/api/v1/me
exports.getUserProfile = cathcAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.user.id);
    res.status(200).json({
        success: true,
        user
    })
})

// update/change password =>/api/v1/password/update
exports.updatePassword = cathcAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.user.id).select('+password');

    // check previous password
    const isMatched = await user.comparePassword(req.body.oldPassword);
    if (!isMatched) {
        return next(new ErrorHandler('Old Password is incorrect', 400))
    }
    user.password = req.body.password;
    await user.save();
    sendToken(user, 200, res)
})

// update profile =>/api/v1/me/update
exports.updateProfile = cathcAsyncErrors(async (req, res, next) => {
    const newData = {
        name: req.body.name,
        email: req.body.email
    }
    // update avatar
    if (req.body.avatar !== '') {
        const user = await User.findById(req.user.id);
        const imageID = user.avatar.public_id;
        // delete old picture
        const res = await cloudinary.v2.uploader.destroy(imageID);
        const result = await cloudinary.v2.uploader.upload(req.body.avatar, {
            folder: 'avatars',
            width: 150,
            crop: 'scale'
        })

        newData.avatar = {
            public_id: result.public_id,
            url: result.secure_url
        }
    }

    const user = await User.findByIdAndUpdate(req.user.id, newData, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    })
    res.status(200).json({
        success: true,
        message: 'Updated!!'
    })
})

// ADMIN ROUTES
// get all users =>/api/v1/admin/users
exports.allUsers = cathcAsyncErrors(async (req, res, next) => {
    const users = await User.find();
    res.status(200).json({
        success: true,
        users
    })
})

// get users details =>/api/v1/admin/user/:id
exports.getUserDetail = cathcAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.params.id);

    if (!user) {
        return next(new ErrorHandler(`User does not found with id : ${req.params.id}`, 404));
    }
    res.status(200).json({
        success: true,
        user
    })
})

// update user profile =>/api/v1/admin/user/:id
exports.updateUser = cathcAsyncErrors(async (req, res, next) => {
    const newData = {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role
    }

    const user = await User.findByIdAndUpdate(req.params.id, newData, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    })
    res.status(200).json({
        success: true,
        message: 'Updated!!'
    })
})

// delete user =>/api/v1/admin/user/:id
exports.deleteUser = cathcAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.params.id);

    if (!user) {
        return next(new ErrorHandler(`User does not found with id : ${req.params.id}`, 404));
    }
    // Remove avatar from cloudinary 
    const imageID = user.avatar.public_id;
    await cloudinary.v2.uploader.destroy(imageID);
    
    await user.deleteOne();

    res.status(200).json({
        success: true,
        message: 'Deleted!!'
    })
})