const express = require('express')
const router = express.Router();

const {
    getProducts,
    newProduct,
    getSingleProduct,
    updateProduct,
    deleteProduct,
    createProductReview,
    getProductReview,
    deleteReview,
    getAdminProducts
} = require('../controllers/productControllers');

const { isAuthenticatedUser, isAuthorizedUser } = require('../middlewares/auth');

router.route('/products').get(getProducts);
router.route('/admin/products').get(getAdminProducts);
router.route('/product/:id').get(getSingleProduct);

router.route('/admin/product/:id')
    .put(isAuthenticatedUser, isAuthorizedUser('admin'), updateProduct)
    .delete(isAuthenticatedUser, isAuthorizedUser('admin'), deleteProduct);

router.route('/admin/product/new').post(isAuthenticatedUser, isAuthorizedUser('admin'), newProduct);

router.route('/review').put(isAuthenticatedUser, createProductReview);
router.route('/reviews').get(isAuthenticatedUser, getProductReview);
router.route('/review').delete(isAuthenticatedUser, deleteReview);


module.exports = router;