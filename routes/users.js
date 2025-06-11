var express = require('express');
var router = express.Router();
const user = require('../models/user');
const controller = require('../Controllers/usercontroller')
const ordercontroller = require('../Controllers/orders')
const staticcontroller = require('../Controllers/staticcontroller');
const verifyUser = require('../middleware/verifyUser'); // Is this used for token verification?
const { createWishLIst, removeWishlist, getWishList, createWishLIstShort, removeWishlistShort } = require('../Controllers/wishlistController');


// Your isBlocked middleware (moved for clarity, but can stay where it is if you prefer)
async function isBlocked(req,res,next){
    if(req.session.user){ // This is the core check for logged-in status
        const {email} = req.session.user
        const loguser = await user.findOne({ email: email })
        if(loguser.isBlocked){
          // If blocked, destroy session and redirect
          req.session.destroy(err => { 
                if (err) console.error("Session destroy error on block:", err); 
            });
          res.clearCookie('token'); // Clear token if you use JWT
          res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
          res.header('Expires', '-1');
          res.header('Pragma', 'no-cache');
          return res.redirect('/signup') // Or '/login' with an error message
        }
        // If logged in and not blocked, apply cache control and proceed
        res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
        res.header('Expires', '-1');
        res.header('Pragma', 'no-cache');
        return next()
    }
   // If not logged in, apply cache control and redirect to login
   res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
   res.header('Expires', '-1');
   res.header('Pragma', 'no-cache');
   return res.redirect('/login')
}


/* --- Public Routes (No authentication needed) --- */
router.get('/login',controller.userloginget);
router.post('/login',controller.userloginpost);
router.get('/signup',controller.usersignup)
router.post('/signup',controller.usersinuppost)
router.post('/resend-otp',controller.resendOtp)
router.post('/resend-otp2',controller.resendOtp2)
router.get('/verification',controller.otplogin)
router.get('/verification2',controller.otplogin2)
router.post('/postVerification2',controller.otploginpost2)
router.post('/postVerification',controller.otploginpost)
router.get('/forgotpass',controller.forgetpass);
router.post('/forgotpass',controller.forgetpasspost);
router.get('/restpass/:userId/:token',controller.resetpass);
router.post('/restpass/:userId/:token',controller.resetpasspost);
router.get('/error',controller.errorpage);
router.get('/',controller.homepageget); // Homepage is usually public
router.get('/shop',controller.homeshop); // Shop page might be public to browse products
router.get('/productpage/:productID',controller.productpageget); // Viewing a single product might be public
router.post('/productpage/:productID',controller.productpagepost); // If this is for adding to cart (unauth cart), keep public; otherwise, protect.

// Logout route (doesn't need isBlocked, as it ends the session)
router.get('/logout', controller.userLogout);


/* --- Protected Routes (Applying isBlocked middleware) --- */

// If product page actions require login (like adding to cart)
// Note: If you have a public product page, and a separate route for adding to cart,
// only protect the add-to-cart action.
router.post('/productpage/:productID', isBlocked, controller.productpagepost); // If post action needs login

router.get('/accounts',isBlocked,controller.useraccount);
router.get('/editac/:userId',isBlocked,controller.updateuserget);
router.post('/userupdate',isBlocked,controller.updatedetials) // Protected update

router.get('/checkout',isBlocked,controller.checkout);
router.post('/orderConfirmation',isBlocked,controller.orderconfirmed);
router.get('/success',isBlocked,controller.successpage); // MUST BE PROTECTED if showing order details
router.post('/rzrpay-verify',isBlocked,controller.razorpayverify)

// Cart related
router.get('/cart/:productId',isBlocked,controller.addtocart)
router.post('/cart/:productId',isBlocked,controller.addtocartppost) // Assuming this is adding to cart
router.get('/cartpage',isBlocked,controller.cartpage)
router.post('/postcart',isBlocked,controller.postcart)
router.post('/updateQuantity',isBlocked,controller.updateQuantity) 
router.post('/removeitem/:productId',isBlocked,controller.removeitemcart);
router.post('/addcart',isBlocked,controller.addtocartshort); // Protected short add to cart

// Address related
router.post('/address/:userId',isBlocked,controller.address)
router.post('/delete-address/:addressId',isBlocked,controller.delteaddress);
router.post('/toggleaddress/:addressId', isBlocked, controller.toggleAddress);
router.get('/editaddress/:id',isBlocked,controller.editaddress)
router.post('/editaddress/:id',isBlocked,controller.editaddresspost);

// Order related
router.get('/orders',isBlocked,controller.orders); // MUST BE PROTECTED
router.post('/cancelorder',isBlocked,controller.cancelorder)
router.post('/cancelAllorder/:id',isBlocked,controller.cancelAllorder)
router.get('/invoice/:id',isBlocked,controller.invoice) // MUST BE PROTECTED
router.get('/productorder/:productId',isBlocked,ordercontroller.orderedproductpage); // MUST BE PROTECTED
router.post('/returnorder',isBlocked,controller.returnorder)

// Coupon related
router.post('/removecop',isBlocked,controller.removecopen)

// Wishlist related
router.post('/wishlist/add/:productId',isBlocked,createWishLIst)
router.post('/wishlist/remove/:productId',isBlocked,removeWishlist)
router.get('/wishlist',isBlocked,getWishList)

router.post('/wishlistshort/add/:productId',isBlocked,createWishLIstShort)
router.post('/wishlistshort/remove/:productId',isBlocked,removeWishlistShort)

// Other protected routes
router.get('/category/:id',controller.categorywiseproducts) // Depends: if category view is public, don't protect. If it shows user-specific categories, protect.
router.get('/products/:productId',controller.modal) // Depends: if modal is public for viewing, don't protect. If it shows user-specific data, protect.

// Listing all static pages (usually public)
router.get('/blog',staticcontroller.blogpage)
router.get('/aboutus',staticcontroller.aboutuspage)
router.get('/aboutme',staticcontroller.aboutmepage)
router.get('/whatwedo',staticcontroller.whatwedopage)
router.get('/faqs',staticcontroller.faqspage)
router.get('/contactus',staticcontroller.contactuspage)
router.get('/blog2',staticcontroller.blogpage2)
router.get('/ourteam',staticcontroller.ourteampage)
router.get('/pricetable',staticcontroller.pricingpage)


module.exports = router;