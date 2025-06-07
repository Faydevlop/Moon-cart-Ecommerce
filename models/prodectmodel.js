  const mongoose = require('mongoose');

  const productSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
    },
    brand: {
      type: String,
      required: true,
    },
    model: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    oldprice: {
      type: Number,
      required: true,
      min: 0,
    },
    description: {
      type: String,
      required: true,
    },
    singleImage: {
  type: String,
  default: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR905Tkp8MLUa9Z-kQ04XPNeODOHIM2WNJPIQ&s',
},
    multipleImages: [{
      type: String,
    }],
    stock: {
      type: Number,
      required: true,
    },
    category:{
      type:mongoose.Schema.Types.ObjectId,
      ref:'Category',
      required:true
    },
    discount:{
    type:Number,
    default:0
    }
    // You might want to include additional fields like 'color', 'size', etc., based on your needs.
  },{
    timestamps: true // <--- Add this! This automatically adds `createdAt` and `updatedAt`
    // OR manually add: createdAt: { type: Date, default: Date.now }
});

  const Product = mongoose.model('Product', productSchema);

  module.exports = Product;
