const mongoose = require('mongoose');

const Oderschema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required: true,
  },
  address: [{
    name: {
      type: String,
      required: true,
  },
  mobile: {
    type: String,
    required: true,
  },
  city: {
  type: String,
  required: true,
},
postalCode: {
  type: String,
  required: true,
},
country: {
  type: String,
  required: true,
},

  }],
  products: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
      },
      quantity: {
        type: Number,
        default: 1,
      },
      price: {
        type: Number,
        required: true,
      },
      total: {
        type: Number,
      },
    },
  ],
  paymentmethod: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['Pending', 'Shipped', 'Delivered', 'Cancelled', 'returned'],
    default: 'Pending',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  grandTotal: Number,
  offer: Number,
  cancelrequest: {
    type: Boolean,
    default: false,
  },
  order_id:{
    type:String,
    default: function () {
   
      const randomString = Math.random().toString(36).substring(2, 10).toUpperCase();
      return 'ord' + randomString;
    }
  }
   
});




const Order = mongoose.model('Order', Oderschema);
module.exports = Order;
