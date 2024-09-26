const User = require('../models/user');
const mongoose = require('mongoose');
const authcontroller = require('./authcontroller');
const bcrypt = require('bcrypt');
const productsmodel = require('../models/prodectmodel')
const cat = require('../models/categorymodel');
const categorymodel = require('../models/categorymodel');
const Cart = require('../models/addtocartmodel')
const Address = require('../models/address');
const multer = require('multer')
const path = require('path')
const couponmodel = require('../models/coupen')


const jwt = require('jsonwebtoken');
const nodemailer =require('nodemailer');
const Order = require('../models/orders');
const shortid = require('shortid');;
const { Types } = mongoose;

require('dotenv').config();
const Razorpay = require('razorpay');
const { log } = require('console');


const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_ID_KEY,
    key_secret: process.env.RAZORPAY_SECRET_KEY, 
  });




const userloginget = (req, res) => {
    if (req.session.done) {
        done = req.session.done;
        req.session.done = '';
        return res.render('dashboard/login', { done})
    }

    if (req.session.error) {
        error = req.session.error;
        req.session.error = '';
        return res.render('dashboard/login', { error });
    } else {
        res.render('dashboard/login')
    }

}

const userloginpost = async (req, res) => {

    const loguser = await User.findOne({ email: req.body.email });
   
    if (loguser) {
        req.session.iduser = loguser._id
        // console.log(req.session.iduser);


        const passwordmatch = await bcrypt.compare(req.body.password, loguser.password);

        if (passwordmatch) {



            if (loguser.isBlocked) {
                return res.status(403).render('dashboard/page-account-login', { error: 'You were blocked' });
            } else {
                req.session.user = loguser
                req.session.orders = loguser._id;
                
                res.redirect('/');
            }


        } else {
            // const password = req.body.password;
            // if(password.length === 0){
            //     req.session.error = 'Please Enter The Password';
            //         res.redirect('/login')
            //     }
            req.session.error = 'invalid password';
            res.redirect('/login')
        }
    } else {

        
        req.session.error = 'Email not found';
        res.redirect('/login')
    }

}

const usersignup = (req, res) => {
    if(req.session.error){
        const error = req.session.error;
        req.session.error = ''
        res.render('dashboard/signup',{error})
    }


    res.render('dashboard/signup')

}

const  usersinuppost = async (req, res) => {
    const newuser = await User.findOne({ email: req.body.email });
    if (newuser) {
        req.session.error = 'email already exist';
        return res.redirect('/signup')
        // return res.render('dashboard/page-account-register', { error: 'email already exist' });
    }

    
    req.session.username = req.body.username;
    req.session.email = req.body.email;
    req.session.Mobile = req.body.Mobile;
    req.session.password = req.body.password;
    
    if (req.body.referral) {
        referrer = await User.findOne({ referralCode:req.body.referral });
        if(referrer){
            req.session.referral = referrer._id;
        }else{
            referrer =''
        }
        
        console.log(referrer);
      }else{
        referrer =''
      }
  

    try {
        // if (req.body.action === 'resend_otp') {
           
        // }

        // await newUser.save(); // Remove this if not implemented

        // Generate and send OTP
        const otp = Math.floor(100000 + Math.random() * 900000); // 6-digit OTP
        req.session.otp = otp;
        await authcontroller.sendVerificationEmail(req.session.email, req.session.otp);
        console.log(otp);
        

        // Redirect to OTP verification page
        res.redirect('/verification');
    } catch (error) {
        console.error('Error saving user:', error);
        res.status(500).send('Internal Server Error');
    }
};


const resendOtp=async(req,res)=>{
    try{
        const otp = Math.floor(100000 + Math.random() * 900000); // 6-digit OTP
        req.session.otp = otp;
        // console.log(req.session.email);
        await authcontroller.sendVerificationEmail(req.session.email, req.session.otp);
        return res.status(200).json({success:true}) 
    }catch(err){
        console.log(err);
        res.status(500).json({success:false})
    }
}

const homepageget = async (req, res) => {
    const user = req.session.user;
    const userId = req.session.iduser;

    let search = '';
    if(req.query.search){
        search = req.query.search;
    }

    const limit = 16;

    const categoryId = await categorymodel.findOne({ categoryname: 'WOODEN FURNITURE COLLECTION  ' });
console.log(categoryId);

const newproducts = await productsmodel.find();
const products = newproducts.filter(product => product.category.toString() === categoryId._id.toString());
    
    

    


    req.session._id = user._id
    
    const userdetials = await User.findById(req.session._id);
    const users = await Cart.findOne({user:userId}).populate('products.product');
    
    
    // console.log(users);
    const categorys = await cat.find({})
    
    if(userdetials){
       return res.render('homepages/index-3', { products ,user ,categorys:categorys, userdetials:userdetials,users:users})

    }
   
    res.render('homepages/index-3', { products ,categorys:categorys,user,totalpages:Math.ceil(count/limit),currentpage:page})
}


const homeshop = async (req, res) => {
    let search = '';
    if(req.query.search){
        search = req.query.search;
    }

    let page = 1;
    if(req.query.page){
        page = req.query.page
    }

    const limit = 16;
    
    const products = await productsmodel.find({
        
        $or:[
            {name:{$regex:'.*'+search+'.*',$options:'i'}},
            
        ]
        
    }).limit(limit * 1)
    .skip((page - 1) * limit)
    .exec();

    const count = await productsmodel.find({
        
        $or:[
            {name:{$regex:'.*'+search+'.*',$options:'i'}},
            
        ]
        
    }).countDocuments();





    const categorys = await cat.find({})

    const users = await Cart.findOne({user:req.session.iduser}).populate('products.product');
    console.log(users)
    

    res.render('homepages/shop1', { products, categorys,users:users,totalpages:Math.ceil(count/limit),currentpage:page  });
}


const otplogin = (req, res) => {
    if(req.session.wrongotp){
        wrongotp = req.session.wrongotp;
        req.session.wrongotp = ''
        res.render('dashboard/Otppage',{wrongotp});

    }
    res.render('dashboard/Otppage');
}


const otploginpost = async (req, res) => {

    // req.session.enteredOtp = req.body.enteredOtp;
    console.log(req.body.enteredOtp, req.session.otp)

    try {
        if (Number(req.body.enteredOtp) === Number(req.session.otp)) {
            
            
            const referrer = req.session.referral || null
            req.session.referral = ''
            // console.log(req.session.username, req.session.email, req.session.password);

            const hashedPassword = await bcrypt.hash(req.session.password, 6)
            const newUser = new User({

                Username: req.session.username,
                email: req.session.email,
                Mobile:req.session.Mobile,
                password: hashedPassword,
                referrer:referrer,
                referralCode: generateReferralCode(), // Implement a function to generate referral codes

                // check email existing
            });
           // Check if referrer is a valid ObjectId before attempting to find the user
           if (mongoose.Types.ObjectId.isValid(referrer)) {
            const user = await User.findById(referrer);
            if (user) {
                user.Wallet = (user.Wallet || 0) + 250;
                await user.save();
            }

        }


        
            await newUser.save();
            req.session.done = 'Verification Completed Please login'
            return res.redirect('/login');
        } else {
            // Incorrect OTP
            req.session.wrongotp = 'incorrect otp';
            return res.redirect('/verification')
            
        }
    } catch (error) {
        console.error('Error verifying OTP:', error);
        res.status(500).send('Internal Server Error');
    }

}
function generateReferralCode() {
    // Generate a unique referral code using shortid
    const referralCode = shortid.generate();
    return referralCode;
  }

const  productpageget = async (req, res) => {

    const product = req.params.productID
    const userId = req.session.iduser;
    const users = await Cart.findOne({ user: userId }).populate('products.product');

    const products = await productsmodel.findById(product);
    if (products ) {
        // console.log(products)
        res.render('homepages/productpage1', { products , users});
    } else {
        res.redirect('/error')
    }


}
const productpagepost = (req, res) => {



}

const useraccount = async (req,res)=>{
   

    
    const userId = req.session._id;
    

    const users = await User.findById(userId).populate('address');
    if(users){
        // console.log(users)

        return res.render('homepages/account',{users:users});

    }else{
        return res.redirect('/login');
    }


}

const updateuserget = async(req,res)=>{
    const userId = req.params.userId;
    console.log(userId);
    const users = await User.findById(userId).populate('address');
   
    

    if(users && orders){
      return  res.render('homepages/editaccount',{users:users,orders:orders});
    }
    res.render('homepages/editaccount');

    

};

// Set up Multer for handling file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/uploads/profile'); // Set the destination folder for profile images
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    },
  });
  
  const upload = multer({ storage: storage });

  const updatedetials = async (req, res) => {
    // Use 'single' if you're uploading a single file with the field name 'pimage'
    upload.single('pimage')(req, res, async (err) => {
      try {
        if (err) {
          console.error(err);
          // Handle the error, e.g., send an error response
          return res.status(500).send('File upload failed');
        }
  
        // Now, you can access the uploaded file details in req.file
        if (req.file) {
          // Save the profile image URL in the session
          req.session.pimage = '/uploads/profile/' + req.file.filename;
          console.log('photo' + req.session.pimage);
  
          // Continue with the rest of your logic
          req.session.data = {
            username: req.body.username,
            email: req.body.email,
            Mobile: req.body.Mobile,
            Pimage:req.session.pimage
        
          };
  
          const email = req.session.data.email;
  
          // The rest of your code...
          const otp = Math.floor(100000 + Math.random() * 900000); // 6-digit OTP
          req.session.otp = otp;
          await authcontroller.sendVerificationEmail(email, req.session.otp);
          res.redirect('/verification2');
        } else {
          // Handle the case when no file is uploaded
          return res.status(400).send('No file uploaded');
        }
      } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
      }
    });
  };


const otplogin2 = (req, res) => {
    if(req.session.wrongotp){
        wrongotp = req.session.wrongotp;
        req.session.wrongotp = ''
        res.render('dashboard/Otppage2',{wrongotp});

    }
    res.render('dashboard/Otppage2');
}


const otploginpost2 = async (req, res) => {

    // req.session.enteredOtp = req.body.enteredOtp;
    console.log(req.body.enteredOtp, req.session.otp)

    try {
        if (Number(req.body.enteredOtp) === Number(req.session.otp)) {

            console.log(req.session.data.username, req.session.data.email);

            const email = req.session.data.email;
            
            const user = await User.findOne({email:email})
            if(user){

                user.Username = req.session.data.username,
                user.email = req.session.data.email,
                user.Mobile = req.session.data.Mobile,
                user.pImage = req.session.data.Pimage

                await user.save();

            }

            
           
        
            // req.session.done = 'Verification Completed Please login'
            return res.redirect('/');
        } else {
            // Incorrect OTP
            req.session.wrongotp = 'incorrect otp';
            return res.redirect('/verification2')
            
        }
    } catch (error) {
        console.error('Error verifying OTP:', error);
        res.status(500).send('Internal Server Error');
    }

}


const resendOtp2 =async(req,res)=>{
    try{
        const email = req.session.data.email;
        const otp = Math.floor(100000 + Math.random() * 900000); // 6-digit OTP
        req.session.otp = otp;
        console.log(req.session.data.email);
        await authcontroller.sendVerificationEmail(email, req.session.otp);
        return res.status(200).json({success:true}) 
    }catch(err){
        console.log(err);
        res.status(500).json({success:false})
    }
}




const cartpage = async (req, res) => {
    try {
        const userId = req.session.iduser;
        const coupons = await couponmodel.find()
       
        

        // Find the user by ID and populate the 'products' field
    const user = await Cart.findOne({user:userId}).populate('products.product');
    const users = await Cart.findOne({user:userId}).populate('products.product');
    console.log(user);
        req.session.cartitem = user;


    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.render('homepages/shop-cart', { user ,coupons:coupons,users});

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


// post method for apllying coupens
const postcart = async (req, res) => {
    try {
        const coupen = req.body.couponId;
        req.session.copon = coupen
        const userId = req.session.iduser;
        const user = await Cart.findOne({ user: userId }).populate('products.product');

        if (user.appliedCoupon === true) {
            return res.status(200).json({ message: 'You have already applied a coupon' });
        }

        const couponData = await couponmodel.findOne({ couponCode: coupen });
        

        if (!couponData) {
            return res.sendStatus(404).send('Coupon is not Found');
        }

        const { totalPrice, products } = user;
        const { discountPercentage, maxDiscountAmount, minAmount, maxAmount,expiryDate } = couponData;

        // Check if the coupon has already been applied
        if (couponData.isUsed ) {
            return res.status(200).json({ message: 'Coupon has already been applied' });
        }

         // Check if the coupon has expired
         const currentDate = new Date();
         if (expiryDate && currentDate > new Date(expiryDate)) {
            couponData.isExpared = true;
            couponData.Status = 'expired';
            await couponData.save();

             return res.status(200).json({ message: 'Coupon has expired' });
             
         }
        

       
        if (totalPrice >= minAmount && totalPrice <= maxAmount) {
           
            const discountAmount = (totalPrice * discountPercentage) / 100;

      
            const discountedTotal = Math.round(Math.max(totalPrice - discountAmount, totalPrice - maxDiscountAmount));

            const total = user.totalPrice;
            req.session.TotalPrice = total;

          
            user.totalPrice = discountedTotal;
            user.appliedCoupon = true;
            couponData.isUsed = true;
            const coponid = couponData;
            req.session.coponid = coponid;
            await user.save();
            await couponData.save()


            return res.status(200).json({ message: 'Coupon applied successfully', discountedTotal });
        } else {
            // Coupon is not applicable
            return res.status(200).json({ message: 'Coupon is not applicable to the current total price' });
        }

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};
// remove coupen
const removecopen = async (req,res)=>{
    try {
        const copon = req.body.couponId;
        const userId = req.session.iduser;

        const user = await Cart.findOne({ user: userId }).populate('products.product');
        console.log(user)

        const findcopon = await couponmodel.findOne({couponCode:copon})
        if(!findcopon){
           return res.status(400).json({message:'Coupon not found'})
        }
        findcopon.isUsed = false;
        user.appliedCoupon = false;
        req.session.coponid = '';
        user.totalPrice = req.session.TotalPrice; 
        await user.save()

        await findcopon.save();

        return res.status(200).json({message:'Coupon Removed Succeccfully'})
        
    } catch (error) {
        console.error(error);
        
    }
}
/* add to cart */

const addtocart = async (req, res) => {
    try {
      const productId = req.params.productId;
      const userId = req.session.iduser; // Adjust how you get the user ID from the session
      const checkquantity = await productsmodel.findOne({_id:productId})
      
    //   console.log(productId);
    //   console.log(userId);
      
      // Validate input
      if (!userId || !productId) {
        return res.status(400).json({ message: 'Invalid input' });
      }
  
      // Check if the user and product exist
      const user = await User.findById(userId);
      const product = await productsmodel.findById(productId);
  
      if (!user || !product) {
        return res.status(404).json({ message: 'User or product not found' });
      }
  
      // Check if the user has a cart
      let userCart = await Cart.findOne({ user: userId });
  
      if (!userCart) {
        // If the user does not have a cart, create one
        userCart = await Cart.create({
          user: userId,
          products: [],
          totalPrice: 0,
        });
      }
  
      // Check if the product is already in the user's cart
      const existingCartItemIndex = userCart.products.findIndex(p => p.product.equals(productId));
    //   chechk if the product stock is there or not
  
      if (existingCartItemIndex !== -1) {
        // If the product is already in the cart, update the quantity
        userCart.products[existingCartItemIndex].quantity += 1;
      } else {
        // If not, add a new item to the cart with quantity 1
        userCart.products.push({ product: productId, quantity: 1 });
      }
  
      // Calculate total price based on quantity
      userCart.totalPrice = userCart.products.reduce((total, item) => {
        const productPrice = product.price; // Replace with the actual property containing the product price
        return total + item.quantity * productPrice;
      }, 0);
      
    //   Save the updated cart
      await userCart.save();
  
      res.redirect('/cartpage');
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  const addtocartshort = async (req,res)=>{
    try {
        const { productId } = req.body;
        const userId = req.session.iduser;
        const product = await productsmodel.findById(productId);


              // Check if the user has a cart
      let userCart = await Cart.findOne({ user: userId });
  
      if (!userCart) {
        // If the user does not have a cart, create one
        userCart = await Cart.create({
          user: userId,
          products: [],
          totalPrice: 0,
        });
      }

      // Check if the product is already in the user's cart
      const existingCartItemIndex = userCart.products.findIndex(p => p.product.equals(productId));
      
    //   chechk if the product stock is there or not
  
      if (existingCartItemIndex !== -1) {
        // If the product is already in the cart, update the quantity
        userCart.products[existingCartItemIndex].quantity += 1;
        // return res.status(200).json({message:'product Quantity is updated'})
      } else {
        // If not, add a new item to the cart with quantity 1
        userCart.products.push({ product: productId, quantity: 1 });
        //  res.status(200).json({message:'New product is added to cart'})
      }
  

      // Calculate total price based on quantity
      userCart.totalPrice = userCart.products.reduce((total, item) => {
        const productPrice = product.price; // Replace with the actual property containing the product price
        return total + item.quantity * productPrice;
      }, 0);
      
    //   Save the updated cart
      await userCart.save();
      return res.status(200).json({message:'Product added to the cart'})
  


        
        
    } catch (error) {
        console.error(error);
        return res.status(400).json({message:'Product Cant add to the cart'})
        
    }

  }
  

// delte items in cart

const removeitemcart = async (req, res) => {
    try {
      const prodId = req.params.productId;
  
      // Assuming you have a Cart model defined
      const cart = await Cart.findOne({user:req.session.iduser})
      if (!cart) {
        return res.status(404).json({success:false,message:'Cart not found'});
      }
      cart.products = cart.products.filter(item => item.product.toString() !== prodId);
        cart.save()
      
  
      
  
        return res.status(404).json({success:true,message:'product removed successfully'});
    } catch (error) {
      console.log(error);
      res.status(500).send('Internal Server Error');
    }
  };
  







const addtocartppost = async (req,res)=>{




}

const checkout = async(req,res)=>{

    if(req.session.error){
        const error = req.session.error;
        req.session.error = '';
        return res.render('homepages/checkouts',{users:users,user:user,error:error});

    }
    const userId = req.session.iduser;
    // console.log(userId);
    const users = await User.findById(userId).populate('address');
    // console.log(users);
    const user = await Cart.findOne({user:userId}).populate('products.product');
    // console.log(user);
    if(users){
       return res.render('homepages/checkouts',{users:users,user:user});
    }
    res.redirect('/error')
}

const address = async (req,res)=>{

    try {

        const userId = req.params.userId;
        req.session.useeaddress = userId;
        const user = await User.findById(userId).populate('address');

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
          }



          // Create an instance of the Address model
    const newAddress = new Address({
      name: req.body.displayName,
      mobile: req.body.mobile,
      city: req.body.city,
      postalCode: req.body.postalCode,
      country: req.body.country,
    });

    // Save the new address to the database
    await newAddress.save();

    // Update the user's address reference
    user.address.push(newAddress);
    await user.save();

    // console.log('Address saved');
    res.redirect('/editac/'+userId)


        
    } catch (error) {

        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
      
        
    }

}


// Define a route for handling address deletion
const delteaddress =  async (req, res) => {
    try {
        const addressId = req.params.addressId;

        // Use Mongoose to delete the address by ID
        await Address.findOneAndDelete({_id:addressId});
        const userid = req.session.useeaddress
        res.redirect('/editac/'+userid); // Redirect to the editaccount page after deletion
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


const JWT_SECRET = 'secret'

const forgetpass = (req,res)=>{
    if(req.session.error){
        const error = req.session.error;
        req.session.error = ''

        res.render('homepages/forgotpass',{error:error});

    }
    if(req.session.error){
        const error = req.session.error;
        req.session.error = ''

        res.render('homepages/forgotpass',{error:error});

    }
    if(req.session.done){
        const done = req.session.done;
        req.session.done = ''

        res.render('homepages/forgotpass',{done:done});

    }
    res.render('homepages/forgotpass');
}

const forgetpasspost = async (req, res) => {
    const { email } = req.body;

    const user = await User.findOne({ email: email });

    if (!user) {
        req.session.error = 'Email not found. Please sign up.';
        return res.redirect('/forgotpass');
    }

    const secret = JWT_SECRET + user.password;
    const payload = {
        email: user.email,
        id: user._id
    };

    const token = jwt.sign(payload, secret, { expiresIn: '15m' });
    const link = `http://localhost:3001/restpass/${user._id}/${token}`;

    // Nodemailer configuration
    const transporter = nodemailer.createTransport({
        service: 'gmail', // Use your email service (e.g., 'gmail')
        auth: {
            user: 'zenwrists@gmail.com', // Use your email
            pass: 'ogqc asud vnge pgss' // Use your email password or app-specific password
        }
    });

    // Email options
    const mailOptions = {
        from: 'zenwrists@gmail.com',
        to: user.email,
        subject: 'Password Reset Link',
        html: `<p>Click on the following link to reset your password: <a href=${link}>Click here</a></p>`
    };

    // Send email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error(error);
            req.session.error = 'Failed to send reset password email.';
            return res.redirect('/forgotpass');
        } else {
            req.session.done = 'Reset password link sent to your email.';
            return res.redirect('/forgotpass');
        }
    });
};

const resetpass = async(req,res)=>{
const {userId,token} = req.params
const user = await User.findById(userId);
if(!user){
    return req.send('invalid user')
}

const secret = JWT_SECRET + user.password;
try {
    const payload = jwt.verify(token,secret);
    res.render('homepages/resetpass');
    
} catch (error) {
    console.error(error)
    res.send(error)
    
}

    
}
const resetpasspost = async (req, res) => {
    const { userId, token } = req.params;

    try {
        // Find the user by ID
        const user = await User.findById(userId);

        if (!user) {
            return res.redirect('/error')
        }

        // Verify the token
        const secret = JWT_SECRET + user.password;
        const payload = jwt.verify(token, secret);

        // Assuming you have a hashed password in the payload (update as per your implementation)
        const newpass = req.body.newPassword;

        // Specify the number of salt rounds (e.g., 10)
        const saltRounds = 10;
        
        const hashedPassword = await bcrypt.hash(newpass, saltRounds);

        // Update the user's password with the new hashed password
        user.password = hashedPassword;
        await user.save();

        // Redirect to login page
        return res.redirect('/login');
    } catch (error) {
        console.error(error);
        return res.send(error.message);
    }
};

const updateQuantity = async (req, res) => {
    try {
      const { productId, newQuantity } = req.body;
  
      // Assuming you have a Cart model defined
      const cart = await Cart.findOne({
        user: req.session.iduser,
      }).populate('products.product');
  
      if (!cart) {
        return res.status(404).json({ message: 'Cart or product not found' });
      }
  
      // Find the index of the product in the products array
      const productIndex = cart.products.findIndex(
        (item) => item.product._id.toString() === productId.toString()
      );
  
      // Update the quantity of the specific product
      cart.products[productIndex].quantity = newQuantity;
  
      // Recalculate the total price based on the updated quantities
      cart.totalPrice = cart.products.reduce((total, item) => {
        const productPrice = item.product.price;
        
        // Check if productPrice is a valid number and item.quantity is a valid number
        if (!isNaN(productPrice) && !isNaN(item.quantity)) {
          return total + item.quantity * productPrice;
        } else {
          return total;
        }
      }, 0);
  
      // Save the updated cart
      await cart.save();
  
      res.status(201).json({ success:true, message: 'Quantity updated successfully', cart });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };
  
  

//   error page
const errorpage = (req,res)=>{
    res.render('homepages/error');
}

// controller.js
const toggleAddress = async (req, res) => {
    try {
        const { addressId } = req.params;
        const foundAddress = await Address.findOne({ _id: addressId });

        if (foundAddress) {
            foundAddress.isSelect = !foundAddress.isSelect; // Toggle the value
            await foundAddress.save();

            // console.log('Address after update:', foundAddress);
            return res.redirect('/checkout');
        }

        return res.redirect('/error');
    } catch (error) {
        console.error('Error in toggleAddress:', error);
        return res.redirect('/error');
    }
};
 
const editaddress = async (req, res) => {
    const addressId = req.params.id;
    const address = await Address.findOne({ _id: addressId });

    if (address) {
        return res.render('homepages/editaddress', { address: address });
    }

    // Redirect to some other route if the address does not exist
    res.redirect('/some-other-route');
};

const editaddresspost = async (req, res) => {
    // console.log('jjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjj');
    const addressId = req.params.id;
    const address = await Address.findOne({ _id: addressId });

    if (!address) {
        return res.send('Address not found');
    }

    address.name = req.body.displayName;
    address.mobile = req.body.mobile;
    address.city = req.body.city;
    address.postalCode = req.body.postalCode;
    address.country = req.body.country;

    await address.save();
    res.redirect('/checkout');
};

const successpage = (req,res)=>{
    // const order = 
    res.render('homepages/success')
}


const orderconfirmed = async (req, res) => {
    const userdID = req.session.iduser;
    const addresId = req.body.addressId;
    const paymentmethod = req.body.PaymentMethod;

    console.log(paymentmethod, addresId, userdID + 'HERE ');

    const cart = await Cart.findOne({ user: userdID }).populate('products.product');
    const saveaddress = await Address.findOne({ _id: addresId });
    const coponid = req.session.coponid ;
    const findcopon = await couponmodel.findOne({_id:coponid}) 

    




    if (paymentmethod === 'cashondelivery') {
        const order = {
            user: req.session.iduser,
            address: [
                {
                    name: saveaddress.name,
                    mobile: saveaddress.mobile,
                    city: saveaddress.city,
                    postalCode: saveaddress.postalCode,
                    country: saveaddress.country
                }
            ],
            paymentmethod: paymentmethod,
            products: cart.products.map((item) => {
                return {
                    product: item.product._id,
                    quantity: item.quantity,
                    price: item.product.price,
                    total: item.totalPrice,
                };
            }),
            grandTotal: cart.totalPrice,
            
           
        };

        await Order.insertMany(order);

        for (item of cart.products) {
            const product = item.product;
            const oredrproduct = await Cart.findOne({ user: userdID }).populate('products.product');
            for (const oredrItem of oredrproduct.products) {
                const updateQuantity = product.stock - oredrItem.quantity;
                await productsmodel.findByIdAndUpdate(product._id, { stock: updateQuantity });
            }
        } 

      
        if (findcopon) {
            // Found the coupon, now delete it
            const deleteResult = await couponmodel.deleteOne({_id: coponid});
            
            if (deleteResult.deletedCount > 0) {
              console.log('Coupon deleted successfully');
            } else {
              console.log('Coupon not found or already deleted');
            }
          } else {
            console.log('Coupon not found');
          }

          await Cart.findOneAndUpdate(
            { user: userdID },
            { $set: { products: [], totalPrice: 0 }, $unset: { appliedCoupon: false } },
            { new: true } // to return the updated document
          );
        res.status(201).json({ success: true, message: "success" });
    } 
    
    else if (paymentmethod === 'upi') {
        console.log('upi working');
      console.log(razorpay);

        const options = {
            amount: cart.totalPrice * 100,
            currency: 'INR',
            receipt: 'order_' + Date.now(),
        };                                                                                                                                                                                                                                                                                              
        console.log(options);

        try {
            const order = await new Promise((resolve, reject) => {
                razorpay.orders.create(options, (err, order) => {
                    if (err) {
                        console.error('Razorpay order creation failed:', err);
                        reject(err);
                    } else {
                        resolve(order);
                    }
                });
            });

            const upiOrder = {
                user: req.session.iduser,
                address: [
                    {
                        name: saveaddress.name,
                        mobile: saveaddress.mobile,
                        city: saveaddress.city,
                        postalCode: saveaddress.postalCode,
                        country: saveaddress.country
                    }
                ],
                paymentmethod: paymentmethod,
                products: cart.products.map((item) => {
                    return {
                        product: item.product._id,
                        quantity: item.quantity,
                        price: item.product.price,
                        total: item.totalPrice,
                    }
                }),
                grandTotal: cart.totalPrice,
                // order_id:
            };

            await Order.insertMany(upiOrder);

            for (item of cart.products) {
                const product = item.product;
                const oredrproduct = await Cart.findOne({ user: userdID }).populate('products.product');
                for (const oredrItem of oredrproduct.products) {
                    const updateQuantity = product.stock - oredrItem.quantity;
                    await productsmodel.findByIdAndUpdate(product._id, { stock: updateQuantity });
                }
            }
            if (findcopon) {
                // Found the coupon, now delete it
                const deleteResult = await couponmodel.deleteOne({_id: coponid});
                
                if (deleteResult.deletedCount > 0) {
                  console.log('Coupon deleted successfully');
                } else {
                  console.log('Coupon not found or already deleted');
                }
              } else {
                console.log('Coupon not found');
              }

              await Cart.findOneAndUpdate(
                { user: userdID },
                { $set: { products: [], totalPrice: 0 }, $unset: { appliedCoupon: false } },
                { new: true } // to return the updated document
              );
            res.status(200).json({ success: true, orderId: order.id, order, key_id: process.env.RAZORPAY_ID_KEY });
        } catch (error) {
            console.error('Error during Razorpay order creation:', error);
            res.status(500).json({ success: false, message: 'Razorpay order creation failed' });
        }

        
    }


};

// 657c1daed21422ff6a8ecd8f


const razorpayverify = async (req, res) => {
    const crypto = require('crypto');
    try {

        console.log(req.body)
        // getting the details back from our front-end
        const {
            orderCreationId,
            razorpayPaymentId,
            razorpayOrderId,
            razorpaySignature,
        } = req.body.data;

        console.log(orderCreationId, razorpayPaymentId, razorpayOrderId, razorpaySignature);

        // Ensure you replace 'YOUR_SECRET_KEY' with your actual Razorpay secret key
        const shasum = crypto.createHmac("sha256", process.env.RAZORPAY_SECRET_KEY);

        shasum.update(`${orderCreationId}|${razorpayPaymentId}`);

        const digest = shasum.digest("hex");

        // comparing our digest with the actual signature
        if (digest !== razorpaySignature)
            return res.status(400).json({ msg: "Transaction not legit!" });

        // THE PAYMENT IS LEGIT & VERIFIED
        // YOU CAN SAVE THE DETAILS IN YOUR DATABASE IF YOU WANT

        res.status(200).json({
            msg: "success",
            orderId: razorpayOrderId,
            paymentId: razorpayPaymentId, 
        });
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
};






const   orders = async(req,res)=>{
    
    try {
        const user = req.session.iduser;
        // console.log("User:",user)

        const orders = await Order.find({user:user}).populate('products.product');
        
        if(orders){
            return  res.render('homepages/orders',{orders:orders});
        }
        res.send('no products found');
    } catch (error) {
        console.error(error);
        
    } 
 
} 
 
const cancelorder = async (req, res) => {
    const productId = req.body.productId;
    const userid = req.session.iduser;

    try {
        const order = await Order.findOne({
            user: userid,
            'products.product': productId,
            cancelrequest: false,
            status: { $in: ['Pending', 'Shipped'] },
        });

        if (!order) {
            return res.status(404).json({ message: 'Order not found or cannot be cancelled' });
        }

        // Update order details
        order.cancelrequest = true;
        order.status = 'Cancelled';

        // Save the updated order
        const updatedOrder = await order.save();

        // Product quantity update;
        const product = await productsmodel.findById(productId);
        if (product) {
            const updatedquantity = updatedOrder.products.find(p => p.product.equals(productId)).quantity;
            product.stock += updatedquantity;
            await product.save();
        } else {
            console.error('Product not found for the canceled order');
        }

        res.status(200).json(updatedOrder);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

const updatesingleimage = async (req, res) => {
    try {
        console.log('////////////////////req.file',req.file)
        console.log(req.body)
        const productid = req.body.productId;
        const index = req.body.index;

        console.log(productid)

        // Find the product in the database using the product ID
        const product = await productsmodel.findOne({ _id: productid });

        // Get the file path from the uploaded file
        const file = req.file.path.replace(/\\/g, '/').replace('public/', '/');

        // Log information for debugging
        console.log(productid, index, file);
        console.log(product);

        // Check if the product exists
        if (product) {
            // Remove the old image at the specified index and replace it with the new file path
            product.multipleImages.splice(index, 1, file);

            // Save the updated product in the database
            await product.save();

            // Respond with a success status
            res.status(200).json({ success: true });
        }
    } catch (err) {
        // Log and respond with an error status if any exception occurs
        console.log(err);
        res.status(500).json({ success: false });
    }
};


const modal = async (req,res)=>{
    try {
        const productId = req.params.productId;
        const product = await productsmodel.findById(productId);
    
        if (!product) {
          return res.status(404).json({ error: 'Product not found' });
        }
    
        res.json(product);
      } catch (error) {
        console.error('Error fetching product details:', error);
        res.status(500).json({ error: 'Internal server error' });
      }
}

const returnorder = async (req,res)=>{
    try {

        const orderId = req.body.orderId;
        const order = await Order.findOne({_id:orderId});
        const productId = req.body.productId

        if(!order){
           return res.status(400).send('order not found');
        }
        if(order.status === 'returned'){
            return res.status(200).json({message:'Order already returned'});

        }
       

        order.status ='returned';
        const updatedOrder = await order.save();

         // Product quantity update;
         const product = await productsmodel.findById(productId);
         if (product) {
             const updatedquantity = updatedOrder.products.find(p => p.product.equals(productId)).quantity;
             product.stock += updatedquantity;
             await product.save();
         } else {
             console.error('Product not found for the canceled order');
         }
        
        return res.status(200).json({message:'Order returned'});

        
    } catch (error) {
        console.error(error);
        return res.status(400).json({message:'Something Went Wrong'});
        
    }
}
const categorywiseproducts = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const newproducts = await productsmodel.find();
    const products = newproducts.filter(product => product.category.toString() === categoryId);

    console.log(products);
    console.log(categoryId);

    if (!products) {
      return res.status(400).send('Category not found');
    }

    res.render('homepages/categoryproducts', { products: products });
  } catch (error) {
    console.error(error);
  }
};


module.exports = {

    userloginget,
    userloginpost,
    usersignup,
    usersinuppost,
    homepageget,
    homeshop,
    otplogin,
    otploginpost,
    productpageget,
    resendOtp,
    productpagepost,
    useraccount,
    updateuserget,
    updatedetials,
    otplogin2,
    otploginpost2,
    resendOtp2,
    addtocart,
    addtocartppost,
    checkout,
    address,
    delteaddress,
    forgetpass,
    resetpass,
    forgetpasspost,
    resetpasspost,
    cartpage,
    updateQuantity,
    removeitemcart,
    resetpasspost,
    errorpage,
    toggleAddress,
    editaddress,
    editaddresspost,
    orderconfirmed,
    successpage,
    orders,
    cancelorder,
    razorpayverify,
    updatesingleimage,
    postcart,
    removecopen,
    modal,
    addtocartshort,
    returnorder,
    categorywiseproducts
    

}