const Product = require('../model/product');
const dotenv = require('dotenv');
const connectDatabase = require('../config/database');

const products = require('../data/product.json')

//setting dotenv file
dotenv.config({ path: 'backend/config/config.env' })

connectDatabase();

// inserting all products at DB at once
const seedProducts = async () => {
    try {
        // delete product from DB
        await Product.deleteMany();
        console.log("Products Deleted!");

        await Product.insertMany(products);
        console.log("Products Added!");
        process.exit();

    } catch (error) {
        console.log(error.message);
        // console.log(error.stack);
        process.exit();
    }
}
seedProducts();