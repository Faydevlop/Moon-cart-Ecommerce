var express = require('express');
var router = express.Router();
const multer = require('multer');



const controller = require('../Controllers/admincontroll')
const usermanagementcontroll = require('../Controllers/usermanagement')
const productscontroll = require('../Controllers/products')
const orderscontroll = require('../Controllers/orders')
const salesreportcontroll = require('../Controllers/salesreport')
const usercontroll = require('../Controllers/usercontroll')
const brandscontroll = require('../Controllers/brands')
const categorycontroll = require('../Controllers/category');
const admincontroll = require('../Controllers/admincontroll')
const  {storage , upload} = require('../UTILS/multer')
const referalcontroller = require('../Controllers/refaralcontroller')
const offercontroll = require('../Controllers/offers')
const { get } = require('mongoose');
const { route } = require('./users');

function isadmin(req, res, next) {
    if (!req.session.adminhere) {
        return res.redirect('/admin/login');
    }
    next();
}


/* admin login page. */
router.get('/login',controller.adminloginget);

router.post('/login',controller.adminloginpost);

/*admin dashboard */ 
router.get('/dashboard',isadmin,controller.admindashboardget);

/*admin user management  */ 
router.get('/page-list-users',isadmin,usermanagementcontroll.usermanagement);


/*admin products */ 
router.get('/page-add-products',isadmin,productscontroll.productspage1get);

router.post('/page-add-products',upload.fields([{ name: 'singleimage', maxCount: 1 }, { name: 'multipleImages' }]),productscontroll.productspagepost)


/*listing products*/
router.get('/page-products-list',isadmin,productscontroll.listproductget);

router.post('/page-products-list',productscontroll.listproductpost)



// /*admin sales report */ 
// router.get('/salesreport',salesreportcontroll.salesreportpage)

/*admin brands*/ 
router.get('/brands',isadmin,brandscontroll.brandspage);

/*admin category */ 
router.get('/page-add-categorys',isadmin,categorycontroll.categorypageget);

router.post('/page-add-categorys',categorycontroll.categorypagepost);

/*block user*/
router.post('/block-user/:userId',usermanagementcontroll.blockuserpost);

/*unblock user*/ 
router.post('/unblock-user/:userId',usermanagementcontroll.blockuserpost);

/*edit products*/
router.get('/editproducts/:productId',isadmin,productscontroll.editproductsget);

/*list category*/ 
router.get('/page-listcategory',isadmin,categorycontroll.listcategory);

router.post('/editproductspost/:productId',upload.fields([{ name: 'singleImage', maxCount: 1 }, { name: 'multipleImages' }]),productscontroll.editproductspost);

/* delete product */ 
router.post('/deleteproductget/:productId',productscontroll.deleteproductget)

/* delete category*/ 
router.post('/deletecat/:categoryId',categorycontroll.deleteCategory)

/*edit category*/ 

router.get('/editcat/:cateId',isadmin,categorycontroll.editcategoryget)

router.post('/editcat/:cateId',categorycontroll.editcategorypost)

/* list/unlisting category*/ 
router.post('/listcat/:catId',categorycontroll.listcat);
router.post('/unlistcat/:catId',categorycontroll.unlistcat);

// admin order page
router.get('/orderspage',isadmin,orderscontroll.adminorderlist);

// order detial page
router.get('/detial/:orderId',isadmin,orderscontroll.detilaspage);

// status update
router.post('/statusupdate',orderscontroll.statusupdate)

// single edit image
router.post('/singleimage', upload.single('image'), usercontroll.updatesingleimage);

// sales report day
router.get('/daliysales',isadmin,salesreportcontroll.salesdaily)
// sales report day
router.get('/monthlysales',isadmin,salesreportcontroll.salesmonthly)
// sales report day
router.get('/yearlysales',isadmin,salesreportcontroll.salesyearly)

router.get('/referalcode',referalcontroller.coupen)
router.post('/coupenpost',referalcontroller.coupenpost )

// listing or unlistin coupens
router.post('/listitem',referalcontroller.listitem)
// edit copen 
router.get('/editcop/:copid',referalcontroller.editcop)
router.post('/editcopon/:copid',referalcontroller.editcopon)

// offer page
router.get('/offers',offercontroll.offerspage)
router.post('/offerpost',offercontroll.offerpost);
// activate / deavtivateing offer;
router.post('/isproduct',offercontroll.isproduct)
router.post('/iscat',offercontroll.iscat)
// delete product / category
router.post('/catdelet',offercontroll.deletcat);
router.post('/productdelet',offercontroll.deletproduct);

module.exports = router;
