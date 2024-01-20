
const User = require('../models/user');
// const mongoose = require('mongoose');
// const authcontroller = require('./authcontroller');
// const bcrypt = require('bcrypt');
const productsmodel = require('../models/prodectmodel');
// const { orders } = require('./usercontroll');
// const cat = require('../models/categorymodel');
// const categorymodel = require('../models/categorymodel');
// const Cart = require('../models/addtocartmodel')
// const Address = require('../models/address');
// const router = require('../routes/users');
const Order = require('../models/orders');
const { default: mongoose } = require('mongoose');


const orderedproductpage = async(req,res)=>{
    const productid = req.params.productId
    // console.log('product id ' + productid );

    const product = await productsmodel.findOne({_id:productid});
    // const product = await productsmodel.aggregate([
    //     {$match:{_id:productid}}
    // ])
    if(product){
       return res.render('homepages/productlist',{product:product});
    }
    res.render('homepages/productlist');
}

// admin order view
//aggregation issue 
const adminorderlist = async (req, res) => {
    try {
        const orders = await Order.find().populate('user');
        console.log('Detials'+orders)
        res.render('dashboard/orderspage', { orders: orders });
       
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).send('Internal Server Error');
    }
};


// order detials page
// aggregation problem

const detilaspage = async (req, res) => {
    const orderid = req.params.orderId;

    try {
        const orderDetails = await Order.findById(orderid).populate('products.product');
        req.session.orderDetails = orderDetails;
        const userDetails = await Order.findById(orderid).populate('user');;
        if (!orderDetails && !userDetails) {
            return res.render('dashboard/ordersdetail');
        }
        console.log('user '+userDetails);
        return res.render('dashboard/ordersdetail', { orderDetails: orderDetails,userDetails:userDetails });
    } catch (error) {
        console.error('Error fetching order details:', error);
        res.status(500).send('Internal Server Error');
    }
};
const statusupdate = async (req, res) => {
    console.log('Received status update request');

    const orderId = req.session.orderDetails;
    const status = req.body.orderStatus;
    console.log(orderId);

    try {
        const order = await Order.findOne({ _id:orderId });

        if (order) {
            order.status = status;
            await order.save();
            res.status(200).redirect('/admin/orderspage');
        } else {
            res.status(404).json({ success: false, message: 'Order not found' });
        }
    } catch (error) {
        console.error('Error updating order status:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};


module.exports ={
    orderedproductpage,
    adminorderlist,
    detilaspage,
    statusupdate
}
