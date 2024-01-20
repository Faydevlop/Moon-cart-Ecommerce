
const productmodel = require('../models/prodectmodel')
const path = require('path')
const categoryModel = require('../models/categorymodel')

// no needed
const   productspage1get = async (req, res) => {
    try {
        // const products = await productmodel.find({});
        const category = await categoryModel.find({ isActive: true })
        console.log(category);
        if(req.session.error){
            const error = req.session.error;
            req.session.error = '';
            res.render('dashboard/page-form-product-1', {  category , error});
        }
        res.render('dashboard/page-form-product-1', {  category })
    } catch (err) {
        console.log(err);
    }
}


const productspagepost = async (req, res) => {
    try {
        console.log('//////////////////////////////////////////');
        const product = await productmodel.findOne({ name: req.body.name });

        if (product) {
            
            req.session.error = 'product already exist';
            return res.redirect('/admin/page-add-products');
        }

        console.log(req.files);
        console.log(req.files['singleimage']);
        console.log(req.files['multipleImages']);

        const { name, brand, model, price, description, stock, category } = req.body;



        // Process single image
        const singleImage = req.files && req.files['singleimage']
            ? req.files['singleimage'][0].path.replace(/\\/g, '/').replace('public/', '/')
            : null;
        console.log("single image" + singleImage);
        // Process multiple images
        const multipleImages = req.files && req.files['multipleImages']
            ? req.files['multipleImages'].map(file => file.path.replace(/\\/g, '/').replace('public/', '/'))
            : [];
        console.log("multiple imagew " + multipleImages);
        if (!singleImage && multipleImages.length === 0) {
            return res.status(400).send('No files uploaded.');
        }

        // Create a new Product instance
        const newProduct = new productmodel({
            name,
            brand,
            model,
            price,
            description,
            singleImage,
            multipleImages,
            stock,
            category,
            oldprice:price,
        });


        await newProduct.save();
        // req.session.done = 'product already exist'

        res.redirect('/admin/page-products-list')
    } catch (error) {
        console.error('Error saving product to MongoDB:', error);
        res.status(500).send('Internal Server Error');
    }
};









const listproductget = async (req, res) => {

    const products = await productmodel.find({});
    

    res.render('dashboard/page-products-grid', { products })
}


const listproductpost = (req, res) => {
    try {


    } catch (error) {
        console.error(error)
    }


}



const editproductsget = async (req, res) => {


    try {
        const productId = req.params.productId; // Assuming you have a route parameter for the product ID
        const products = await productmodel.findById(productId);
        const category = await categoryModel.find({ isActive: true });

        if (!products) {
            return res.status(404).send('Product not found');
        }

        res.render('dashboard/edit-products', { products, category });
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    }


}




    
const editproductspost = async (req, res) => {
    try {
        console.log('step1');
        const productId = req.params.productId;
        console.log(productId);
        const product = await productmodel.findById(productId);

        if (!product) {
            return res.status(404).send('Product not found');
        }
        console.log('step2');

        // Extract fields from the request body
        const { name, brand, model, price, description, stock, category } = req.body;

        // Process single image
        const singleImage = req.files && req.files['singleImage'] ? req.files['singleImage'][0].path.replace(/\\/g, '/').replace('public/', '/') : null;
        console.log(singleImage);

        // Process multiple images
        const multipleImages = req.files && req.files['multipleImages']
            ? req.files['multipleImages'].map(file => file.path.replace(/\\/g, '/').replace('public/', '/'))
            : product.multipleImages; // Retain existing images if not updated
        console.log(multipleImages);

        // Update the product fields with new values from the request body
        product.name = name || product.name;
        product.brand = brand || product.brand;
        product.model = model || product.model;
        product.price = price || product.price;
        product.description = description || product.description;
        product.singleImage = singleImage || product.singleImage;
        product.multipleImages = multipleImages;
        product.stock = stock || product.stock;
        product.category = category || product.category;

        await product.save();

        res.redirect('/admin/page-products-list');
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).send('Internal Server Error');
    }
};
  const deleteproductget = async (req, res) => {
    

    try {
        const productId = req.params.productId;
        console.log(req.params.productId)
        console.log('Deleting product with ID:', productId);

        const findprod = await productmodel.findById(productId);

        if (findprod) {
            await productmodel.deleteOne({ _id: productId });
            console.log('Product deleted successfully');
            res.redirect('/admin/page-products-list');
        } else {
            console.log('Product not found');
            res.send('Product not found');
        }
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).send('Internal Server Error');
    }
};









module.exports = {

    productspage1get,
    productspagepost,
    listproductget,
    listproductpost,
    editproductsget,
    editproductspost,
    deleteproductget
}
