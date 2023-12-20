var express = require('express');
var router = express.Router();
const user = require('../models/user');
const controller = require('../Controllers/usercontroll')
// const cartcontroller = require('../Controllers/cartcontroller')


async function isBlocked(req,res,next){

    if(req.session.user){
        const {email} = req.session.user
        const loguser = await user.findOne({ email: email })
        if(loguser.isBlocked){
          return  res.redirect('/login')
        }
        return next()
    }
   return res.redirect('/login')
}

/*users login */
router.get('/login',controller.userloginget);

router.post('/login',controller.userloginpost);

/*user signup*/ 

router.get('/signup',controller.usersignup)

router.post('/signup',controller.usersinuppost)

/*resend otp*/ 
router.post('/resend-otp',controller.resendOtp)

/*resend otp2*/ 
router.post('/resend-otp2',controller.resendOtp2)
/*homepage*/ 

router.get('/',isBlocked,controller.homepageget);

/*homepage shop*/ 
router.get('/shop',isBlocked,controller.homeshop);

/*OTP page*/ 
router.get('/verification',controller.otplogin)

/* OTP page 2*/
router.get('/verification2',controller.otplogin2) 
router.post('/postVerification2',controller.otploginpost2)

// 

router.post('/postVerification',controller.otploginpost)

/* product page*/ 

router.get('/productpage/:productID',controller.productpageget);

router.post('/productpage/:productID',controller.productpagepost);

/*user account*/ 
router.get('/accounts',controller.useraccount);



/* update user*/ 
router.get('/editac/:userId',controller.updateuserget);



/* chekout */ 
router.get('/checkout',controller.checkout);

/* update user id */
router.post('/userupdate',controller.updatedetials) 



/*add to cart*/
router.get('/cart/:productId',controller.addtocart)

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
router.get('/cartpage',controller.cartpage)

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



/*logout*/




module.exports = router;
 