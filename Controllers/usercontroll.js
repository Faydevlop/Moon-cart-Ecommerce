const User = require('../models/user');
const mongoose = require('mongoose');
const authcontroller = require('./authcontroller');
const bcrypt = require('bcrypt');
const productsmodel = require('../models/prodectmodel')
const cat = require('../models/categorymodel');
const categorymodel = require('../models/categorymodel');
const Cart = require('../models/addtocartmodel')
const Address = require('../models/address');
const { route } = require('../routes/users');
const router = require('../routes/users');
const jwt = require('jsonwebtoken');
const nodemailer =require('nodemailer');
const Order = require('../models/orders');
const { Types } = mongoose;




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
        console.log(req.session.iduser);


        const passwordmatch = await bcrypt.compare(req.body.password, loguser.password);

        if (passwordmatch) {



            if (loguser.isBlocked) {
                return res.status(403).render('dashboard/page-account-login', { error: 'You were blocked' });
            } else {
                req.session.user = loguser
                
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

const usersinuppost = async (req, res) => {
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

    try {
        // if (req.body.action === 'resend_otp') {
           
        // }

        // await newUser.save(); // Remove this if not implemented

        // Generate and send OTP
        const otp = Math.floor(100000 + Math.random() * 900000); // 6-digit OTP
        req.session.otp = otp;
        await authcontroller.sendVerificationEmail(req.session.email, req.session.otp);

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
        console.log(req.session.email);
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

    
    const products = await productsmodel.find({})
    req.session._id = user._id
    
    const userdetials = await User.findById(req.session._id);
    const users = await Cart.findOne({user:userId}).populate('products.product');
    console.log(users);
    
    if(userdetials){
       return res.render('homepages/index-3', { products ,user , userdetials:userdetials,users:users})

    }
   
    res.render('homepages/index-3', { products ,user})
}


const homeshop = async (req, res) => {

    const products = await productsmodel.find({})
    const categorys = await cat.find({})
    

    res.render('homepages/shop1', { products, categorys });
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

            console.log(req.session.username, req.session.email, req.session.password);

            const hashedPassword = await bcrypt.hash(req.session.password, 6)
            const newUser = new User({

                Username: req.session.username,
                email: req.session.email,
                Mobile:req.session.Mobile,
                password: hashedPassword
                // check email existing
            });
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

const productpageget = async (req, res) => {

    const product = req.params.productID

    const products = await productsmodel.findById(product);
    if (products) {
        console.log(products)
        res.render('homepages/productpage1', { products });
    } else {
        res.redirect('/error')
    }


}
const productpagepost = (req, res) => {



}

const useraccount = async (req,res)=>{
   

    
    const userId = req.session._id;
    console.log('hi hi hi hi hi hi hi hi hi hi hi hi hi hi');
    console.log(userId);

    const users = await User.findById(userId).populate('address');
    if(users){
        console.log(users)

        return res.render('homepages/account',{users:users});

    }else{
        return res.redirect('/login');
    }


}

const updateuserget = async(req,res)=>{
    const userId = req.params.userId;
    const users = await User.findById(userId).populate('address');
    if(users){
      return  res.render('homepages/editaccount',{users:users});
    }
    res.render('homepages/editaccount');

    

}


const updatedetials = async(req,res)=>{
   req.session.data = {
    username:req.body.username,
    email:req.body.email,
    Mobile:req.body.Mobile
   }
   const email = req.session.data.email;
   

//    const newuser = await User.findOne({ email: req.body.data.email });
//     if (newuser) {
//         req.session.error = 'email already exist';
//         return res.redirect('/signup')
//         // return res.render('dashboard/page-account-register', { error: 'email already exist' });
//     }
    const otp = Math.floor(100000 + Math.random() * 900000); // 6-digit OTP
    req.session.otp = otp;
    await authcontroller.sendVerificationEmail(email, req.session.otp);
    res.redirect('/verification2');



}


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
        

        // Find the user by ID and populate the 'products' field
    const user = await Cart.findOne({user:userId}).populate('products.product');
    console.log(user);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.render('homepages/shop-cart', { user });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

/* add to cart */

const addtocart = async (req, res) => {
    try {
      const productId = req.params.productId;
      const userId = req.session.iduser; // Adjust how you get the user ID from the session
      
      console.log(productId);
      console.log(userId);
      
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
  
      // Save the updated cart
      await userCart.save();
  
      res.redirect('/cartpage');
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
  

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
    const userId = req.session.iduser;
    console.log(userId);
    const users = await User.findById(userId).populate('address');
    console.log(users);
    const user = await Cart.findOne({user:userId}).populate('products.product');
    console.log(user);
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

    console.log('Address saved');
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

const forgetpasspost = async(req,res)=>{

    const {email} = req.body;
    console.log(email);

    const user = await User.findOne({email:email})
    if(!user){ 
        req.session.error = 'email not found please signup'
        return res.redirect('/forgotpass')
    }
    const secret = JWT_SECRET + user.password;
    const payload = {
        email:user.email,
        id:user._id
    }
    const token = jwt.sign(payload,secret,{expiresIn:'15m'})
    const link = `http://localhost:3001/restpass/${user._id}/${token}`;
    console.log(link);

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
        text: `Click on the following link to reset your password: ${link}`
    };

    // Send email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error(error);
            req.session.error = 'Failed to send reset password email.';
            return res.redirect('/forgotpass');
        } else {
            console.log('Email sent: ' + info.response);
            req.session.done = 'Reset password link sent to your email.';
            
            return res.redirect('/forgotpass');
        }
    });
    


  
}

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

const  updateQuantity = async (req, res) => {
    try {
      const {  productId, newQuantity } = req.body;
  
      // Assuming you have a Cart model defined
      const cart = await Cart.findOneAndUpdate(
        { user: req.session.iduser, 'products.product': productId },
        { $set: { 'products.$.quantity': newQuantity } },
        { new: true }
      );
  
      if (!cart) {
        return res.status(404).json({ message: 'Cart or product not found' });
      }
  
      res.json({ message: 'Quantity updated successfully', cart });
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

            console.log('Address after update:', foundAddress);
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
    console.log('jjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjj');
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

const orderconfirmed = async(req,res)=>{
    const userdID = req.session.iduser;
    const addresId = req.body.addressId;
    const paymentmethod = req.body.PaymentMethod;
    console.log(userdID);
    console.log(addresId);
    console.log(paymentmethod);

    const cart = await Cart.findOne({user:userdID}).populate('products.product');
    if(paymentmethod === 'cashondelivery'){
        const order = {
            user:req.session.iduser,
            address:addresId,
            paymentmethod:paymentmethod,
            products : cart.products.map((item)=>{
                return{
                    product:item.product,
                    quantity:item.quantity,
                    price:item.product.price,
                    total:item.totalPrice,
                }
            }),
            grandTotal:cart.totalPrice,

        }

        await Order.insertMany(Order);

        for(item of cart.products){
            const product = item.product;
             
            const updateQuantity = product.quantity - item.quantity;
            const orderQuantity = product.order + item.quantity;
              
        }
    }

    

}

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
    orderconfirmed
    

}