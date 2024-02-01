const Order = require('../model/order');
const Products = require('../model/product');
const ErrorHanlder = require('../utills/errorHandler');
const cathcAsyncErrors = require('../middlewares/catchAsyncError');

// create new order   => /api/v1/order/new
exports.newOrder = cathcAsyncErrors(async (req, res, next) => {
    const {
        orderItems,
        shippingInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paymentInfo
    } = req.body;

    const order = await Order.create({
        orderItems,
        shippingInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paymentInfo,
        paidAt: Date.now(),
        user: req.user._id
    })

    res.status(200).json({
        success: true,
        order
    })
})

// get Single order detail   => /api/v1/order/:id
exports.getSingleOrder = cathcAsyncErrors(async (req, res, next) => {
    const order = await Order.findById(req.params.id).populate('user', 'name email')
    if (!order) {
        return next(new ErrorHanlder('Order Not found', 404));
    }

    res.status(200).json({
        success: true,
        order
    })
})

// get all orders for logged in user   => /api/v1/orders/me
exports.myOrder = cathcAsyncErrors(async (req, res, next) => {
    const orders = await Order.find({ user: req.user.id });

    res.status(200).json({
        success: true,
        orders
    })
})

// admin routes
// get all orders  => /api/v1/admin/orders
exports.allOrder = cathcAsyncErrors(async (req, res, next) => {
    const orders = await Order.find();

    var totalAmount = 0;
    orders.forEach(val => {
        totalAmount += val.totalPrice;
    })

    totalAmount = totalAmount.toFixed(2);
    
    res.status(200).json({
        success: true,
        totalAmount,
        orders
    })
})

// update order / process order  => /api/v1/admin/order/:id
exports.updateOrder = cathcAsyncErrors(async (req, res, next) => {
    const order = await Order.findById(req.params.id);

    if (order.orderStatus === 'Delivered') {
        return next(new ErrorHanlder('You have already delivered this order', 400));
    }
    order.orderItems.forEach(async item => {
        await updateStock(item.product, item.quantity);
    })
    order.orderStatus = req.body.status,
        order.deliveredAt = Date.now()

    await order.save();

    res.status(200).json({
        success: true,
    })
})

async function updateStock(id, qty) {
    const product = await Products.findById(id);
    product.stock = product.stock - qty;
    await product.save({ validateBeforeSave: false });
}

// delete order   => /api/v1/order/:id
exports.deleteOrder = cathcAsyncErrors(async (req, res, next) => {
    const order = await Order.findById(req.params.id);
    if (!order) {
        return next(new ErrorHanlder('Order Not found', 404));
    }
    await order.deleteOne();
    res.status(200).json({
        success: true
    })
})
