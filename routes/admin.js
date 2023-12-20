var express = require('express');
var router = express.Router();
const multer = require('multer');



const controller = require('../Controllers/admincontroll')
const usermanagementcontroll = require('../Controllers/usermanagement')
const productscontroll = require('../Controllers/products')
const orderscontroll = require('../Controllers/orders')
const salesreportcontroll = require('../Controllers/salesreport')
const brandscontroll = require('../Controllers/brands')
const categorycontroll = require('../Controllers/category');
const  {storage , upload} = require('../UTILS/multer')
const { get } = require('mongoose');

/* admin login page. */
router.get('/login',controller.adminloginget);

router.post('/login',controller.adminloginpost);

/*admin dashboard */ 
router.get('/dashboard',controller.admindashboardget);

/*admin user management  */ 
router.get('/page-list-users',usermanagementcontroll.usermanagement);


/*admin products */ 
router.get('/page-add-products',productscontroll.productspage1get);

router.post('/page-add-products',upload.fields([{ name: 'singleimage', maxCount: 1 }, { name: 'multipleImages' }]),productscontroll.productspagepost)


/*listing products*/
router.get('/page-products-list',productscontroll.listproductget);

router.post('/page-products-list',productscontroll.listproductpost)



/*admin sales report */ 
router.get('/salesreport',salesreportcontroll.salesreportpage)

/*admin brands*/ 
router.get('/brands',brandscontroll.brandspage);

/*admin category */ 
router.get('/page-add-categorys',categorycontroll.categorypageget);

router.post('/page-add-categorys',categorycontroll.categorypagepost);

/*block user*/
router.post('/block-user/:userId',usermanagementcontroll.blockuserpost);

/*unblock user*/ 
router.post('/unblock-user/:userId',usermanagementcontroll.blockuserpost);

/*edit products*/
router.get('/editproducts/:productId',productscontroll.editproductsget);

/*list category*/ 
router.get('/page-listcategory',categorycontroll.listcategory);

router.post('/editproductspost/:productId',upload.fields([{ name: 'singleImage', maxCount: 1 }, { name: 'multipleImages' }]),productscontroll.editproductspost);

/* delete product */ 
router.post('/deleteproductget/:productId',productscontroll.deleteproductget)

/* delete category*/ 
router.post('/deletecat/:categoryId',categorycontroll.deletecategory)

/*edit category*/ 

router.get('/editcat/:cateId',categorycontroll.editcategoryget)

router.post('/editcat/:cateId',categorycontroll.editcategorypost)

/* list/unlisting category*/ 
router.post('/listcat/:catId',categorycontroll.listcat);
router.post('/unlistcat/:catId',categorycontroll.unlistcat);

module.exports = router;
