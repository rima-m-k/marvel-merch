const express = require('express');
const router=express.Router();
const adminController = require('../controller/adminController');
const upload = require('../middlewares/add-image')
const isLoggedIn= require('../middlewares/admin-session');

 
router.route('/').get(adminController.adminLogin).post(adminController.postAdminLogin);
router.route('/dashboard').get(isLoggedIn,adminController.dashboard).put(isLoggedIn,adminController.graph);
router.route('/products').get(isLoggedIn,adminController.products);
router.route('/add_products').get(isLoggedIn,adminController.add_products).post(isLoggedIn,upload.fields([{ name: 'image1', maxCount: 1},{ name: 'image2', maxCount: 1},{ name: 'image3', maxCount: 1},{ name: 'image4', maxCount: 1}]),adminController.postadd_products);
router.route('/edit_products/:_id').get(isLoggedIn,adminController.editProduct).post(isLoggedIn,upload.fields([{ name: 'image1', maxCount: 1},{ name: 'image2', maxCount: 1},{ name: 'image3', maxCount: 1},{ name: 'image4', maxCount: 1}]),adminController.posteditProduct);
router.route('/delete_products/:_id').get(isLoggedIn,adminController.deleteProduct);
router.route('/categories').get(isLoggedIn,adminController.categories);
router.route('/add_category').get(isLoggedIn,adminController.addcategory).post(isLoggedIn,upload.single("categoryImage"),adminController.postaddCategory);
router.route('/edit_category/:_id').get(isLoggedIn,adminController.editCategory).post(isLoggedIn,upload.single('category_image'),adminController.postEditCategory);
router.route('/activate/:_id').get(isLoggedIn,adminController.Activate);
router.route('/userOrders').get(isLoggedIn,adminController.userOrders).post(isLoggedIn,adminController.postUserOrders);
router.route('/orderDetails/:_id').get(isLoggedIn,adminController.orderDetails);

router.route('/coupons').get(isLoggedIn,adminController.coupons);
router.route('/deletecoupon/:_id').get(isLoggedIn,adminController.deleteCoupon);
router.route('/add_coupon').get(isLoggedIn,adminController.addcoupon).post(isLoggedIn,adminController.postaddcoupon);
router.route('/showCoupons').get(isLoggedIn,adminController.showCoupons);
router.route('/editcoupon/:_id').get(isLoggedIn,adminController.editCoupon).post(isLoggedIn,adminController.postEditCoupon);
router.route('/customers').get(isLoggedIn,adminController.customers) ;
router.route('/blockuser/:_id').get(isLoggedIn,adminController.block);
router.route('/unblockuser/:_id').get(isLoggedIn,adminController.unblock);
router.route('/bannerManagement').get(isLoggedIn,adminController.bannerManagement).post(isLoggedIn,upload.single("bannerImg"),adminController.postBannerManagement)
router.route('/useBanner/:_id').get(isLoggedIn,adminController.usebanner);
router.route('/deletebanner/:_id').get(isLoggedIn,adminController.deletebanner);
router.route('/errorPage').get(adminController.errorPage);
router.route('/notFound').get(adminController.notFound);
router.route('/logout').get(isLoggedIn,adminController.logout); 

module.exports = router;   
