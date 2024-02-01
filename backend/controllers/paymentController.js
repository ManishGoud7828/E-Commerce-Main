const catchAsyncError = require('../middlewares/catchAsyncError');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Process stripe payment => /apu/v1/payment/process
exports.processPayment = catchAsyncError(async (req, res, next) => {    
    const paymentIntent = await stripe.paymentIntents.create({
        amount: req.body.amount,
        currency: 'usd',
        metadata: { integration_check: 'accept_a_payment' }
    });

    // pass client_Secret key to frontend and validate
    res.status(200).json({
        success: true,
        client_secret: paymentIntent.client_secret
    })
})

// Send Stripe Api key => /api/v1/stripeapi
exports.sendStripeApi = catchAsyncError(async (req, res, next) => {

    res.status(200).json({
        stripeApiKey: process.env.STRIPE_API_KEY
    })
})