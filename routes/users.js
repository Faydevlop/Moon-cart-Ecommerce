var express = require('express');
var router = express.Router();
const user = require('../models/user');
const controller = require('../Controllers/usercontroll')
const ordercontroller = require('../Controllers/orders')
const staticcontroller = require('../Controllers/staticcontroller');
const verifyUser = require('../middleware/verifyUser');
// const cartcontroller = require('../Controllers/cartcontroller')


async function isBlocked(req,res,next){

    if(req.session.user){
        const {email} = req.session.user
        const loguser = await user.findOne({ email: email })
        if(loguser.isBlocked){
          return  res.redirect('/signup')
        }
        return next()
    }
   return res.redirect('/login')
}

/*users login */
router.get('/login',controller.userloginget);

router.post('/login',controller.userloginpost);

// logout
router.get('/logout', controller.userLogout);


/*homepage*/ 
router.get('/',controller.homepageget);

/*homepage shop*/ 
router.get('/shop',controller.homeshop);
// product page get
router.get('/productpage/:productID',controller.productpageget);



/*user signup*/ 

router.get('/signup',controller.usersignup)

router.post('/signup',controller.usersinuppost)

/*resend otp*/ 
router.post('/resend-otp',controller.resendOtp)

/*resend otp2*/ 
router.post('/resend-otp2',controller.resendOtp2)


/*OTP page*/ 
router.get('/verification',controller.otplogin)

/* OTP page 2*/
router.get('/verification2',controller.otplogin2) 
router.post('/postVerification2',controller.otploginpost2)

// 

router.post('/postVerification',controller.otploginpost)

/* product page*/ 

router.get('/productpage/:productID',isBlocked,controller.productpageget);

router.post('/productpage/:productID',controller.productpagepost);

/*user account*/ 
router.get('/accounts',isBlocked,controller.useraccount);



/* update user*/ 
router.get('/editac/:userId',isBlocked,controller.updateuserget);



/* chekout */ 
router.get('/checkout',isBlocked,controller.checkout);

/* update user id */
router.post('/userupdate',controller.updatedetials) 



/*add to cart*/
router.get('/cart/:productId',isBlocked,controller.addtocart)

router.post('/cart/:productId',controller.addtocartppost)

/* adding address */ 
router.post('/address/:userId',controller.address)

/* delteing the address */ 
router.post('/delete-address/:addressId',controller.delteaddress);

/* forget pass */
router.get('/forgotpass',controller.forgetpass);

router.post('/forgotpass',controller.forgetpasspost);



/* resetpass */ 

router.get('/restpass/:userId/:token',controller.resetpass);

router.post('/restpass/:userId/:token',controller.resetpasspost);

/* cartpage */ 
router.get('/cartpage',isBlocked,controller.cartpage)

router.post('/postcart',controller.postcart)

/* quantity increaing  */
router.post('/updateQuantity',controller.updateQuantity) 

//to remove an item from cart

router.post('/removeitem/:productId',controller.removeitemcart);

// error page
router.get('/error',controller.errorpage);

// select address
router.post('/toggleaddress/:addressId', controller.toggleAddress);

// editing address page
router.get('/editaddress/:id',controller.editaddress)

router.post('/editaddress/:id',controller.editaddresspost);

router.post('/orderConfirmation',controller.orderconfirmed);

// order success page
router.get('/success',controller.successpage);

router.post('/rzrpay-verify',controller.razorpayverify)

// oreder page

router.get('/orders',controller.orders);

// cancel order
router.post('/cancelorder',controller.cancelorder)

router.post('/cancelAllorder/:id',controller.cancelAllorder)

// invoice Route

router.get('/invoice/:id',controller.invoice)

// ordered product page 

router.get('/productorder/:productId',ordercontroller.orderedproductpage);

// remove copon
router.post('/removecop',controller.removecopen)


// listing all static pages 

router.get('/blog',staticcontroller.blogpage)
router.get('/aboutus',staticcontroller.aboutuspage)
router.get('/aboutme',staticcontroller.aboutmepage)
router.get('/whatwedo',staticcontroller.whatwedopage)
router.get('/faqs',staticcontroller.faqspage)
router.get('/contactus',staticcontroller.contactuspage)
router.get('/blog2',staticcontroller.blogpage2)
router.get('/ourteam',staticcontroller.ourteampage)
router.get('/pricetable',staticcontroller.pricingpage)

// product modal method
router.get('/products/:productId',controller.modal)

// add to cart short method 
router.post('/addcart',controller.addtocartshort);
// order return 
router.post('/returnorder',controller.returnorder)
// category waise product listing
router.get('/category/:id',controller.categorywiseproducts)








module.exports = router;
 