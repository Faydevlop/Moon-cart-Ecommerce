
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
        const { search, startDate, endDate, status } = req.query;
        const page = parseInt(req.query.page) || 1; // Current page, default to 1
        const limit = 10; // Number of orders per page
        const skip = (page - 1) * limit; // Number of documents to skip

        let query = {}; // Initialize an empty query object for MongoDB

        // 1. Status Filtering
        if (status && status !== '') {
            query.status = status;
        }

        // 2. Date Filtering
        if (startDate || endDate) {
            query.createdAt = {}; // Initialize createdAt filter
            if (startDate) {
                query.createdAt.$gte = new Date(startDate);
                query.createdAt.$gte.setHours(0, 0, 0, 0); // Start of the day
            }
            if (endDate) {
                query.createdAt.$lte = new Date(endDate);
                query.createdAt.$lte.setHours(23, 59, 59, 999); // End of the day
            }
        }

        // 3. Search Functionality (by Order ID, User Name, User Email)
        if (search) {
            const searchRegex = new RegExp(search, 'i');

            // Find user IDs matching the search term
            const users = await User.find({
                $or: [
                    { Username: searchRegex },
                    { email: searchRegex }
                ]
            }).select('_id');
            const userIds = users.map(user => user._id);

            // Construct $or conditions for order_id and user IDs
            const searchConditions = [
                { order_id: searchRegex },
            ];
            if (userIds.length > 0) {
                searchConditions.push({ user: { $in: userIds } });
            }

            // Combine search conditions with existing filters using $and
            if (Object.keys(query).length > 0) { // If other filters (status/date) exist
                query = { $and: [query, { $or: searchConditions }] };
            } else { // If only search filter exists
                query = { $or: searchConditions };
            }
        }

        // Get total count of orders matching the filters (for pagination)
        const totalOrders = await Order.countDocuments(query);
        const totalPages = Math.ceil(totalOrders / limit);

        // Fetch orders for the current page
        const orders = await Order.find(query)
                                   .populate('user')
                                   .sort({ createdAt: -1 }) // Sort by newest first
                                   .skip(skip)
                                   .limit(limit);

        // Prepare query parameters to be passed to EJS for pagination links
        const queryParams = {
            search: search || '',
            startDate: startDate || '',
            endDate: endDate || '',
            status: status || ''
        };

        res.render('dashboard/orderspage', {
            orders: orders,
            search: search || '', // Pass values back for input fields
            startDate: startDate || '',
            endDate: endDate || '',
            status: status || '',
            currentPage: page,
            totalPages: totalPages,
            queryParams: queryParams // Pass current filters for pagination links
        });

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
