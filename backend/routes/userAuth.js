const express = require('express')
const router = express.Router();

const { registerUser,
    loginUser,
    logout,
    forgotPassword,
    resetPassword,
    getUserProfile,
    updatePassword,
    updateProfile,
    allUsers,
    getUserDetail,
    updateUser,
    deleteUser
} = require('../controllers/userAuthController');

const { isAuthenticatedUser, isAuthorizedUser } = require('../middlewares/auth');

router.route('/register').post(registerUser);
router.route('/login').post(loginUser);
router.route('/logout').get(logout);

router.route('/password/forgot').post(forgotPassword);
router.route('/password/reset/:token').put(resetPassword);

router.route('/me').get(isAuthenticatedUser, getUserProfile);

router.route('/password/update').put(isAuthenticatedUser, updatePassword);
router.route('/me/update').put(isAuthenticatedUser, updateProfile);

router.route('/admin/users').get(isAuthenticatedUser, isAuthorizedUser('admin'), allUsers);
router.route('/admin/user/:id')
    .get(isAuthenticatedUser, isAuthorizedUser('admin'), getUserDetail)
    .put(isAuthenticatedUser, isAuthorizedUser('admin'), updateUser)
    .delete(isAuthenticatedUser, isAuthorizedUser('admin'), deleteUser)
module.exports = router;
