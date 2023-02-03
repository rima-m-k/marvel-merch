const express = require('express')
const router=express.Router()
const userController = require('../controller/userController')
const isLoggedIn= require('../middlewares/user-session');

router.route('/').get(userController.landingPage);
router.route('/signup').get(userController.userSignup).post(userController.postuserSignup);
router.route('/verifyotp').post(userController.postverifyotp);
router.route('/login').get(userController.login).post(userController.postlogin);
router.route('/forgotpassword').get(userController.forgotpassword).post(userController.postforgotpassword);
router.route('/getemailforforgotpassword').post(userController.getemail);
router.route('/changepassword').get(userController.changepassword).post(userController.postchangepassword);
router.route('/productdisplay/:_id').get(userController.productdisplay);
router.route('/showitems/:_id').get(userController.showitems);
router.route('/cart').get(isLoggedIn,userController.showcart);
router.route('/addtocart/:_id').get(userController.addToCart);
router.route('/change-product-quantity').post(isLoggedIn,userController.changeProductQuantity);
router.route('/remove-cart-item').post(isLoggedIn,userController.removeCartItem);
router.route('/shop').get(userController.shop).post(userController.sort).put(userController.filter);
router.route('/search').put(userController.search);

router.route('/checkout').get(isLoggedIn,userController.checkout).put(isLoggedIn,userController.couponCheck)
router.route('/profile').get(isLoggedIn,userController.profile);
router.route('/addresses').get(isLoggedIn,userController.showAddress)
router.route('/add-address').get(isLoggedIn,userController.addAddress).post(isLoggedIn,userController.postAddAddress);
router.route('/editAddress/:_id').get(isLoggedIn,userController.editAddress).post(isLoggedIn,userController.postEditAddress)
router.route('/removeAddress/:_id').get(isLoggedIn,userController.removeAddress);  
router.route('/placeOrder').post(isLoggedIn,userController.placeOrder);
router.route('/orderSuccess').get(isLoggedIn,userController.orderSuccess);
router.route('/orderFail').get(isLoggedIn,userController.orderFail);
router.route('/orderlist').get(isLoggedIn,userController.orderList);
router.route('/viewOrders').get(isLoggedIn,userController.viewOrders).post(isLoggedIn,userController.postViewOrders).put(isLoggedIn,userController.cancelOrder)
router.route('/addtoWishlist/:_id').get(isLoggedIn,userController.addtoWishlist);
router.route('/showWishlist').get(isLoggedIn,userController.showWishlist);
router.route('/remove-wishlist-item').post(isLoggedIn,userController.removeFromWishlist);
router.route('/move-to-cart').post(isLoggedIn,userController.moveToCart);
router.route('/loginSecurity').get(isLoggedIn,userController.loginSecurity).post(isLoggedIn,userController.postLoginSecurity).patch(isLoggedIn,userController.patchLoginSecurity);

router.route('/errorPage').get(userController.errorPage);
router.route('/logout').get(isLoggedIn,userController.logout);

module.exports = router;    