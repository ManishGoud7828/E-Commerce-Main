const express = require('express')
const router = express.Router();

const {
    newOrder,
    getSingleOrder,
    myOrder,
    allOrder,
    updateOrder,
    deleteOrder
} = require('../controllers/orderController');

const { isAuthenticatedUser, isAuthorizedUser } = require('../middlewares/auth');

router.route('/order/new').post(isAuthenticatedUser, newOrder);
router.route('/order/:id').get(isAuthenticatedUser, getSingleOrder);
router.route('/orders/me').get(isAuthenticatedUser, myOrder);

router.route('/admin/orders').get(isAuthenticatedUser, isAuthorizedUser('admin'), allOrder);
router.route('/admin/order/:id')
    .put(isAuthenticatedUser, isAuthorizedUser('admin'), updateOrder)
    .delete(isAuthenticatedUser, isAuthorizedUser('admin'), deleteOrder)

module.exports = router;
