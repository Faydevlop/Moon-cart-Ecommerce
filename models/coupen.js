// Import mongoose module
const mongoose = require('mongoose');

// Create a coupon schema
const couponSchema = new mongoose.Schema({
  // Coupon code, must be a string, required, and unique
  couponCode: {
    type: String,
    unique: true
  },
  discripetion: {
    type: String,

    
  },
  
  isUsed: {
    type: Boolean,
    default:false
    
  },

  // Discount percentage, must be a number between 0 and 100
  discountPercentage: {
    type: Number,
    min: 0,
    max: 100
  },
  // Maximum discount amount, must be a positive number
  maxDiscountAmount: {
    type: Number,
    min: 0
  },
  // Minimum amount to apply the coupon, must be a positive number
  minAmount: {
    type: Number,
    min: 0
  },
  // Maximum amount to apply the coupon, must be a positive number
  maxAmount: {
    type: Number,
    min: 0
  },
  Status: {
    type: String,
    default:'Active'
  },
   isExpared: {
    type: Boolean,
    default:false
  },
  // Expiry date of the coupon, must be a date
  expiryDate: {
    type: Date
    
  },isListed:{
    type:Boolean,
    default:true
  }
});

// Export the coupon model
module.exports = mongoose.model("Coupon", couponSchema);
