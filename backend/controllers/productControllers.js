const Products = require('../model/product');
const ErrorHanlder = require('../utills/errorHandler');
const cathcAsyncErrors = require('../middlewares/catchAsyncError');
const APIFeatures = require('../utills/apiFeatures');
const cloudinary = require('cloudinary');

// create new product   => /api/v1/admin/product/new
exports.newProduct = cathcAsyncErrors(async (req, res, next) => {
    let images = [];
    if (typeof req.body.images === 'string') {
        // if single image upload
        images.push(req.body.images)
    }
    else {
        // for multiple image 
        images = req.body.images
    }

    let imagesLink = [];
    for (let i = 0; i < images.length; i++) {
        const result = await cloudinary.v2.uploader.upload(images[i], {
            folder: 'products'
        });
        imagesLink.push({
            public_id: result.public_id,
            url: result.secure_url
        })
    }
    req.body.images = imagesLink;


    req.body.user = req.user.id;
    const product = await Products.create(req.body)

    res.status(201).json({
        success: true,
        product
    })
})

//get all the Products  => /api/v1/products
exports.getProducts = cathcAsyncErrors(async (req, res, next) => {
    const resPerPage = 12;
    const productsCount = await Products.countDocuments();
    const apiFeatures = new APIFeatures(Products.find(), req.query)
        .search()
        .filter()

    let products = await apiFeatures.query;
    const filteredProductCount = products.length;

    apiFeatures.pagination(resPerPage);

    products = await apiFeatures.query;

    res.status(200).json({
        success: true,
        productsCount,
        resPerPage,
        filteredProductCount,
        products
    })
})

//get all Products (Admin) => /api/v1/admin/products
exports.getAdminProducts = cathcAsyncErrors(async (req, res, next) => {

    const products = await Products.find();

    res.status(200).json({
        success: true,
        products
    })
})

// get single product  => /api/v1/product/:id
exports.getSingleProduct = cathcAsyncErrors(async (req, res, next) => {
    const product = await Products.findById(req.params.id);
    if (!product) {
        // return res.status(404).json({
        //     success: false,
        //     message: "Product Not found"
        // })

        //another way for error handling thorugh middleware
        return next(new ErrorHanlder('Product Not found', 404));
    }
    res.status(200).json({
        success: true,
        product
    })
})

// update product  => /api/v1/admin/product/:id
exports.updateProduct = cathcAsyncErrors(async (req, res, next) => {
    let products = await Products.findById(req.params.id);
    if (!products) {
        return next(new ErrorHanlder('Product Not found', 404));
    }

    let images = [];
    if (typeof req.body.images === 'string') {
        // if single image upload
        images.push(req.body.images)
    }
    else {
        // for multiple image 
        images = req.body.images
    }

    // first delete old image then upload new image
    if (images !== undefined) {
        // deleting images associated with product
        for (let i = 0; i < products.images.length; i++) {
            const result = await cloudinary.v2.uploader.destroy(products.images[i].public_id)
        }

        let imagesLink = [];
        for (let i = 0; i < images.length; i++) {
            const result = await cloudinary.v2.uploader.upload(images[i], {
                folder: 'products'
            });
            imagesLink.push({
                public_id: result.public_id,
                url: result.secure_url
            })
        }
        req.body.images = imagesLink;
    }


    products = await Products.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    })
    res.status(200).json({
        success: true,
        products
    })
})

// delete product  => /api/v1/admin/product/:id
exports.deleteProduct = cathcAsyncErrors(async (req, res, next) => {
    const products = await Products.findById(req.params.id);

    if (!products) {
        return next(new ErrorHanlder('Product Not found', 404));
    }

    // deleting images associated with product
    for (let i = 0; i < products.images.length; i++) {
        const result = await cloudinary.v2.uploader.destroy(products.images[i].public_id)
    }

    await products.remove();
    res.status(200).json({
        success: true,
        message: "Product Deleted Successfully"
    })
})

// create new review  => /api/v1/review
exports.createProductReview = cathcAsyncErrors(async (req, res, next) => {
    const { rating, comment, productId } = req.body;
    const review = {
        user: req.user._id,
        name: req.user.name,
        rating: Number(rating),
        comment
    }
    const product = await Products.findById(productId);
    const isReviewed = product.reviews.find(
        r => r.user.toString() === req.user._id.toString()
    )

    // if their already reviewed then update it else create new review
    if (isReviewed) {
        product.reviews.forEach(e => {
            if (e.user.toString() === req.user._id.toString()) {
                e.comment = comment;
                e.rating = rating;
            }
        });
    }
    else {
        product.reviews.push(review);
        product.numOfReviews = product.reviews.length;
    }

    // add ratings and divide by prod review lenght
    // reduce() reduce to multiple values to single values
    product.ratings = product.reviews.reduce((acc, items) => items.rating + acc, 0) / product.reviews.length;
    await product.save({ validateBeforeSave: false })
    res.status(200).json({
        success: true
    })
})

// get product review  => /api/v1/reviews
exports.getProductReview = cathcAsyncErrors(async (req, res, next) => {
    const product = await Products.findById(req.query.id);

    res.status(200).json({
        success: true,
        reviews: product.reviews
    })
})

// delete product review  => /api/v1/review
exports.deleteReview = cathcAsyncErrors(async (req, res, next) => {
    const product = await Products.findById(req.query.productId);


    const reviews = product.reviews.filter(items => items._id.toString() !== req.query.id.toString());
    const numOfReviews = reviews.length;

    const ratings = product.reviews.reduce((acc, items) => items.rating + acc, 0) / reviews.length;

    await Products.findByIdAndUpdate(req.query.productId, {
        reviews,
        ratings,
        numOfReviews
    }, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    })

    res.status(200).json({
        success: true
    })
})