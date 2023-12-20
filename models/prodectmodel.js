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
  description: {
    type: String,
    required: true,
  },
  singleImage: {
    type: String,
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
  }
  // You might want to include additional fields like 'color', 'size', etc., based on your needs.
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
