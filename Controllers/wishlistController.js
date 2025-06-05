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

// wishlist page - get
const getWishList = async(req,res)=>{
    const user = await User.findById(req.session.user._id)
    .populate('wishlist');

  res.render('homepages/wishlist', { products : user.wishlist });

}

module.exports = {
    createWishLIst,
    getWishList,
    removeWishlist
}