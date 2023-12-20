const mongoose = require('mongoose');
const Oderschema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
          },
          address:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'Address',
            required:'true'
          },
          products:[{
            products:{
              type:mongoose.Schema.Types.ObjectId,
            ref:'Product',
            // required:'true'
            },
            quantity:{
              type:Number,
              default:1,
            },
            price:{
              type:Number,
              require:'true'
            },
            total:{
              returnStatus:{
                type:String,
              }
            }
           }],
           paymentmethod:{
            type:String,
            required:'true'
           },
           status:{
            type:String,
            enum:['Pending','Shipped','Delivered','Cancelled','Out for Delivery','Confirmed'],
            default:'Pending',
           },
           createdAt:{
            type:Date,
            default:Date.now,
           },
           grandTotal:Number,
           cancelrequest:{
            type:Boolean,
            default:false
           },
           order_id:String,
           
        });
          
    
const Order = mongoose.model('Order',Oderschema);
module.exports = Order;