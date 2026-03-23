var express = require('express');
var router = express.Router();

const controller = require('../Controllers/admincontroller')
const usermanagementcontroll = require('../Controllers/usermanagement')
const productscontroll = require('../Controllers/products')
const orderscontroll = require('../Controllers/orders')
const salesreportcontroll = require('../Controllers/salesreport')
const usercontroll = require('../Controllers/usercontroller') // Double check if this is meant for admin actions
const brandscontroll = require('../Controllers/brands')
const categorycontroll = require('../Controllers/category');
const { upload } = require('../UTILS/multer')
const referalcontroller = require('../Controllers/refaralcontroller')
const offercontroll = require('../Controllers/offers')
const Admin = require("../models/admin"); // Import the Admin model for the middleware


// --- Admin Authentication Middleware (Mirroring isBlocked) ---
async function isadmin(req, res, next) {
    // Check if the admin session variable exists
    if (req.session.adminhere) {
        try {
            // Optional: Re-verify admin status from DB if you need to check for block/deactivation
            // const adminUser = await Admin.findOne({ email: req.session.adminhere });
            // if (!adminUser || adminUser.isBlocked) { // Assuming an 'isBlocked' field on admin
            //     req.session.destroy(err => { if (err) console.error("Admin session destroy error on block:", err); });
            //     res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
            //     res.header('Expires', '-1');
            //     res.header('Pragma', 'no-cache');
            //     return res.redirect('/admin/login');
            // }

            // If authenticated, apply cache control headers to prevent caching of admin pages
            res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
            res.header('Expires', '-1');
            res.header('Pragma', 'no-cache');
            return next(); // Admin is authenticated and not blocked, proceed
        } catch (error) {
            console.error("Error in isadmin middleware:", error);
            // In case of DB error, consider logging out for safety
            req.session.destroy(err => { if (err) console.error("Session destroy error during admin verification:", err); });
            res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
            res.header('Expires', '-1');
            res.header('Pragma', 'no-cache');
            return res.redirect('/admin/login');
        }
    } else {
        // If not logged in, apply cache control headers and redirect to login
        res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
        res.header('Expires', '-1');
        res.header('Pragma', 'no-cache');
        return res.redirect('/admin/login'); // Admin is not authenticated
    }
}



/* --- Admin Public Routes (Login/Logout) --- */
router.get('/login', controller.adminloginget);
router.post('/login', controller.adminloginpost);
router.get('/logout', controller.adminlogoutget); // Logout route: destroys session and redirects


/* --- Admin Protected Routes (Applying isadmin middleware) --- */

// Dashboard
router.get('/dashboard', isadmin, controller.admindashboardget);

// User Management
router.get('/page-seller-detail', isadmin, usermanagementcontroll.usermanagement);
router.post('/block-user/:userId', isadmin, usermanagementcontroll.blockuserpost);
router.post('/unblock-user/:userId', isadmin, usermanagementcontroll.unblockuser);

// Product Management
router.get('/page-add-products', isadmin, productscontroll.productspage1get);
router.post('/page-add-products', isadmin, upload.fields([{ name: 'singleimage', maxCount: 1 }, { name: 'multipleImages' }]), productscontroll.productspagepost);
router.get('/page-products-list', isadmin, productscontroll.listproductget);
router.post('/page-products-list', isadmin, productscontroll.listproductpost); // Protecting POST if it handles sensitive data/actions
router.get('/editproducts/:productId', isadmin, productscontroll.editproductsget);
router.post('/editproductspost/:productId', isadmin, upload.fields([{ name: 'singleImage', maxCount: 1 }, { name: 'multipleImages' }]), productscontroll.editproductspost);
router.post('/deleteproductget/:productId', isadmin, productscontroll.deleteproductget);

// Brand Management
router.get('/brands', isadmin, brandscontroll.brandspage);

// Category Management
router.get('/page-add-categorys', isadmin, categorycontroll.categorypageget);
router.post('/page-add-categorys', isadmin, categorycontroll.categorypagepost);
router.get('/page-listcategory', isadmin, categorycontroll.listcategory);
router.post('/deletecat/:categoryId', isadmin, categorycontroll.deleteCategory);
router.get('/editcat/:cateId', isadmin, categorycontroll.editcategoryget);
router.post('/editcat/:cateId', isadmin, categorycontroll.editcategorypost);
router.post('/listcat/:catId', isadmin, categorycontroll.listcat);
router.post('/unlistcat/:catId', isadmin, categorycontroll.unlistcat);

// Order Management
router.get('/orderspage', isadmin, orderscontroll.adminorderlist);
router.get('/detial/:orderId', isadmin, orderscontroll.detilaspage);
router.post('/statusupdate', isadmin, orderscontroll.statusupdate);

// Sales Report
router.get('/daliysales', isadmin, salesreportcontroll.salesdaily);
router.get('/monthlysales', isadmin, salesreportcontroll.salesmonthly);
router.get('/yearlysales', isadmin, salesreportcontroll.salesyearly);

// Referral Code Management
router.get('/referalcode', isadmin, referalcontroller.coupen);
router.post('/coupenpost', isadmin, referalcontroller.coupenpost);
router.post('/listitem', isadmin, referalcontroller.listitem);
router.get('/editcop/:copid', isadmin, referalcontroller.editcop);
router.post('/editcopon/:copid', isadmin, referalcontroller.editcopon);

// Offer Management
router.get('/offers', isadmin, offercontroll.offerspage);
router.post('/offerpost', isadmin, offercontroll.offerpost);
router.post('/isproduct', isadmin, offercontroll.isproduct);
router.post('/iscat', isadmin, offercontroll.iscat);
router.post('/catdelet', isadmin, offercontroll.deletcat);
router.post('/productdelet', isadmin, offercontroll.deletproduct);

// Admin-specific image update (if it's for admin profile or specific admin-controlled images)
router.post('/singleimage', isadmin, upload.single('image'), usercontroll.updatesingleimage);


module.exports = router;
