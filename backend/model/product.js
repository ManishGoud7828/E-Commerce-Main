const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please enter Product name'],
        trim: true,
        maxLength: [100, 'Product name cannot exceed 100 characters']
    },
    price: {
        type: Number,
        required: [true, 'Please enter Product Price'],
        default: 0.0,
        maxLength: [5, 'Product price cannot exceed 5 characters']
    },
    description: {
        type: String,
        required: [true, 'Please enter Product description']
    },
    ratings: {
        type: Number,
        default: 0
    },
    images: [
        {
            public_id: {
                type: String,
                required: true
            },
            url: {
                type: String,
                required: true
            }
        }
    ],
    category: {
        type: String,
        required: [true,"Please select category for this product"],
        enum: {
            values: [
                'Electronics',
                'Home',
                'Laptop',
                'Cameras',
                'Accessories',
                "Headphones",
                'Foods',
                'Clothes/Shoes',
                'Beauty/Health',
                'Sports',
                'Outdoor'
            ],
            message: 'Please Select coorect category for this Product'
        }
    },
    seller: {
        type: String,
        required: [true, 'Please enter Product Seller']
    },
    stock: {
        type: Number,
        required: [true, 'Please enter Product Stock'],
        maxLength: [5, 'Product stock cannot exceed 5 characters'],
        default: 0
    },
    numOfReviews: {
        type: Number,
        default: 0
    },
    reviews: [
        {
            user:{
                type:mongoose.Schema.ObjectId,
                ref:'User',
                required:true
            },
            name: {
                type: String,
                required: true
            },
            comment: {
                type: String,
                required: true
            },
            rating: {
                type: Number,
                required: true
            },
        }
    ],
    user:{
        type:mongoose.Schema.ObjectId,
        ref:'User',
        required:true
    },
    createdAt: {
        default: Date.now,
        type: Date
    }

})

module.exports = mongoose.model('Product', productSchema);