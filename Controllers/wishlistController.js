const Cart = require("../models/addtocartmodel");
const User = require("../models/user");


// adding product to wishlist - post
const createWishLIst = async(req,res)=>{
    const userId = req.session.user._id;
  const productId = req.params.productId;

  await User.findByIdAndUpdate(userId, { $addToSet: { wishlist: productId } });
  res.redirect('/wishlist');
}

// remove Wishlist 
const removeWishlist = async(req, res) => {
  const userId = req.session.user._id;
  const productId = req.params.productId;

  await User.findByIdAndUpdate(userId, { $pull: { wishlist: productId } });
  res.redirect('/wishlist');
}


// Add to Wishlist
const createWishLIstShort = async (req, res) => {
  const userId = req.session.iduser;
  const productId = req.params.productId;

  await User.findByIdAndUpdate(userId, { $addToSet: { wishlist: productId } });
  res.json({ success: true, message: 'Product added to wishlist' });
};

// Remove from Wishlist
const removeWishlistShort = async (req, res) => {
  const userId = req.session.iduser;
  const productId = req.params.productId;

  await User.findByIdAndUpdate(userId, { $pull: { wishlist: productId } });
  res.json({ success: true, message: 'Product removed from wishlist' });
};


// wishlist page - get
const getWishList = async(req,res)=>{
  
    const user = await User.findById(req.session.user._id)
    .populate('wishlist');
  let users
    if (user) {
            
            userdetials = await User.findById(req.session.user._id);
            users = await Cart.findOne({ user: req.session.user._id }).populate('products.product');
        }

  res.render('homepages/wishlist', { products : user.wishlist ,users});

}

module.exports = {
    createWishLIst,
    getWishList,
    removeWishlist,
    createWishLIstShort,
    removeWishlistShort
}