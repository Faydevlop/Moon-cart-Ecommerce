const categorymodel = require('../models/categorymodel');
const prodectmodel = require('../models/prodectmodel');
const categoryoffers = require('../models/categoryoffers ')
const productOffer = require('../models/productoffers')


const offerspage = async (req, res) => {
    try {
        // --- Common variables for both tables ---
        const offersPerPage = 10; // You can make this configurable if needed

        // --- Product Offer Parameters ---
        const productSearch = req.query.productSearch || '';
        const productStartDate = req.query.productStartDate;
        const productEndDate = req.query.productEndDate;
        const productSort = req.query.productSort || 'newest';
        const productPage = parseInt(req.query.productPage) || 1;
        const productSkip = (productPage - 1) * offersPerPage;

        // --- Category Offer Parameters ---
        const categorySearch = req.query.categorySearch || '';
        const categoryStartDate = req.query.categoryStartDate;
        const categoryEndDate = req.query.categoryEndDate;
        const categorySort = req.query.categorySort || 'newest';
        const categoryPage = parseInt(req.query.categoryPage) || 1;
        const categorySkip = (categoryPage - 1) * offersPerPage;

        // --- Build Product Offer Query ---
        let productOffersQuery = {};
        let productSortOption = {};

        // Product Offer Search
        if (productSearch) {
            const searchRegex = new RegExp(productSearch, 'i');
            const productsMatchingSearch = await prodectmodel.find({ name: searchRegex }).select('_id');
            const productIds = productsMatchingSearch.map(p => p._id);

            productOffersQuery.$or = [
                { offerName: searchRegex },
            ];
            if (productIds.length > 0) {
                productOffersQuery.$or.push({ productName: { $in: productIds } });
            }
        }

        // Product Offer Date Filter
        if (productStartDate || productEndDate) {
            productOffersQuery.$and = productOffersQuery.$and || [];
            let start = productStartDate ? new Date(productStartDate) : new Date(0); // Epoch start if not provided
            start.setHours(0, 0, 0, 0);

            let end = productEndDate ? new Date(productEndDate) : new Date('2099-12-31'); // Far future if not provided
            end.setHours(23, 59, 59, 999);

            productOffersQuery.$and.push({
                startDate: { $lte: end },
                endDate: { $gte: start }
            });
        }

        // Product Offer Sort
        switch (productSort) {
            case 'oldest':
                productSortOption = { createdAt: 1 };
                break;
            case 'startDateAsc':
                productSortOption = { startDate: 1 };
                break;
            case 'endDateAsc':
                productSortOption = { endDate: 1 };
                break;
            case 'newest':
            default:
                productSortOption = { createdAt: -1 };
                break;
        }

        // --- Fetch Product Offers ---
        const totalProductOffers = await productOffer.countDocuments(productOffersQuery);
        const productTotalPages = Math.ceil(totalProductOffers / offersPerPage);
        const offers = await productOffer.find(productOffersQuery)
                                         .populate('productName')
                                         .sort(productSortOption)
                                         .skip(productSkip)
                                         .limit(offersPerPage);

        // --- Build Category Offer Query ---
        let categoryOffersQuery = {};
        let categorySortOption = {};

        // Category Offer Search
        if (categorySearch) {
            const searchRegex = new RegExp(categorySearch, 'i');
            const categoriesMatchingSearch = await categorymodel.find({ categoryname: searchRegex }).select('_id');
            const categoryIds = categoriesMatchingSearch.map(c => c._id);

            categoryOffersQuery.$or = [
                { offerName: searchRegex },
            ];
            if (categoryIds.length > 0) {
                categoryOffersQuery.$or.push({ categoryName: { $in: categoryIds } });
            }
        }

        // Category Offer Date Filter
        if (categoryStartDate || categoryEndDate) {
            categoryOffersQuery.$and = categoryOffersQuery.$and || [];
            let start = categoryStartDate ? new Date(categoryStartDate) : new Date(0);
            start.setHours(0, 0, 0, 0);

            let end = categoryEndDate ? new Date(categoryEndDate) : new Date('2099-12-31');
            end.setHours(23, 59, 59, 999);

            categoryOffersQuery.$and.push({
                startDate: { $lte: end },
                endDate: { $gte: start }
            });
        }

        // Category Offer Sort
        switch (categorySort) {
            case 'oldest':
                categorySortOption = { createdAt: 1 };
                break;
            case 'startDateAsc':
                categorySortOption = { startDate: 1 };
                break;
            case 'endDateAsc':
                categorySortOption = { endDate: 1 };
                break;
            case 'newest':
            default:
                categorySortOption = { createdAt: -1 };
                break;
        }

        // --- Fetch Category Offers ---
        const totalCategoryOffers = await categoryoffers.countDocuments(categoryOffersQuery);
        const categoryTotalPages = Math.ceil(totalCategoryOffers / offersPerPage);
        const cat = await categoryoffers.find(categoryOffersQuery)
                                        .populate('categoryName')
                                        .sort(categorySortOption)
                                        .skip(categorySkip)
                                        .limit(offersPerPage);

        // --- Prepare data for EJS ---
        const categories = await categorymodel.find();
        const products = await prodectmodel.find();

        if (!categories || !products) {
            return res.status(500).send('Something went wrong: Categories or products not found.');
        }

        let renderData = {
            categories: categories,
            products: products,
            // Product Offer Data
            offers: offers,
            productSearch: productSearch,
            productStartDate: productStartDate,
            productEndDate: productEndDate,
            productSort: productSort,
            productCurrentPage: productPage,
            productTotalPages: productTotalPages,
            productQueryParams: {
                productSearch: productSearch,
                productStartDate: productStartDate,
                productEndDate: productEndDate,
                productSort: productSort,
            },
            // Category Offer Data
            cat: cat,
            categorySearch: categorySearch,
            categoryStartDate: categoryStartDate,
            categoryEndDate: categoryEndDate,
            categorySort: categorySort,
            categoryCurrentPage: categoryPage,
            categoryTotalPages: categoryTotalPages,
            categoryQueryParams: {
                categorySearch: categorySearch,
                categoryStartDate: categoryStartDate,
                categoryEndDate: categoryEndDate,
                categorySort: categorySort,
            },
        };

        if (req.session.error) {
            renderData.error = req.session.error;
            req.session.error = '';
        }

        return res.render('dashboard/offers', renderData);

    } catch (error) {
        console.error('Error fetching offers:', error);
        res.status(500).send('Internal Server Error');
    }
};


const offerpost = async (req,res)=>{
    try {
        const offername = req.body.offername;
        const type = req.body.type;
        const selectedtype = req.body.selectedtype;
        const discountType = req.body.discountType;
        const discountValue = req.body.discountValue;
        const selectedCategory = req.body.selectedCategory;
        const startDate = req.body.startDate;
        const endDate = req.body.endDate;               

        console.log(selectedtype);
        
       

        
    
        console.log('datas here'+ offername,type,selectedCategory,selectedtype,discountType,discountValue,startDate,endDate);
        if(req.body.type === 'product'){
            const product = await prodectmodel.findOne({_id:selectedtype});
           
            const products = new productOffer({
                offerName:req.body.offername,
                productName:req.body.selectedtype,
                discountType:req.body.discountType,
                discountValue:req.body.discountValue,
                startDate:req.body.startDate,
                endDate:req.body.endDate,

            })
            req.session.price = product.price

            const alredayoffer = await productOffer.findOne({productName:selectedtype});
            if(alredayoffer){
                req.session.error = 'An offer already exist on this product';
                return res.redirect('/admin/offers');
            }
            
            if(req.body.discountType === 'fixedprice' ){
                console.log(product.discount)
                product.discount = req.body.discountValue;

                await product.save()
                console.log(product.discount)

            }else{
                product.discount = Math.round((product.price * req.body.discountValue) / 100);
                await product.save()

                console.log(product.discount)
            }
            
           
            


            
            await products.save()
            return res.redirect('/admin/offers');
        
        }else{
            const category = await categorymodel.findOne({_id:selectedCategory});
            console.log(category)
            // const catid = category._id

            // const categoryproducts = await prodectmodel.find({category:catid});
            // console.log('categoryproducts'+categoryproducts);


            
            
            const categorys = new categoryoffers({
                offerName: req.body.offername,
                categoryName: req.body.selectedCategory,
                discountType: req.body.discountType,
                discountValue: req.body.discountValue,
                startDate: req.body.startDate,
                endDate: req.body.endDate
            });

            const alredayoffer = await categoryoffers.findOne({categoryName:selectedCategory});
        if(alredayoffer){
            req.session.error = 'An offer already exist on this category';
            return res.redirect('/admin/offers');
        }

            if(req.body.discountType === 'fixedprice' ){
                console.log(category.categeoryOffers)
                category.categeoryOffers = req.body.discountValue;


                await category.save()
                console.log(category.categeoryOffers)

            }else{
                category.categeoryOffers = Math.round(( category.categeoryOffers * req.body.discountValue) / 100);
                await category.save()

                console.log(category.categeoryOffers)
            }
            



            await categorys.save()
            return res.redirect('/admin/offers');

        }
         
    } catch (error) {
        console.error(error);
        
    }
   


}
const iscat = async (req, res) => {
    try {
      const offerId = req.body.idd;
      const offer = await categoryoffers.findOne({ _id: offerId }).populate('categoryName');
      
      if (!offer) {
        return res.status(404).json({ message: 'Offer not found' });
      }

    //   chceking the current date is applicable or not
    
    const currentDate = new Date();
    if(currentDate < offer.startDate || currentDate > offer.endDate){
        return res.status(200).json({ message: 'Offer is not valid. Start date or end date is not within the range.' });  
    }
  
      const categoryId = offer.categoryName;
      const category = await categorymodel.findOne({ _id: categoryId });
  
      if (!category) {
        return res.status(404).json({ message: 'Category not found' });
      }
  
      const products = await prodectmodel.find({ category: categoryId });
  
      console.log(category);
  
      offer.isActive = !offer.isActive;
  
      for (const product of products) {
        if (offer.isActive) {
          product.price = product.price - category.categeoryOffers;
          console.log(`Updated price for product ${product._id}: ${product.price}`);
        } else {
          product.price = product.price + category.categeoryOffers;
          console.log(`Updated price for product ${product._id}: ${product.price}`);
        }
        await product.save(); // Save the updated product price to the database
        await offer.save()
      }
  
      return res.status(200).json({ message: 'Category offer updated successfully' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  };
  // product
const isproduct= async (req,res)=>{
    const offerid = req.body.id;
    const offer = await productOffer.findOne({_id:offerid}).populate('productName')
    const productid = offer.productName
    const product = await prodectmodel.findOne({_id:productid})
    console.log('product'+product)
    // console.log('product'+offer)

    const currentDate = new Date();
    if(currentDate < offer.startDate || currentDate > offer.endDate){
        return res.status(200).json({ message: 'Offer Cannot be activate. Start date or end date is not within the range.' });
    }

    if(!offer){
        return res.send('somthin went wrong');
     }

    offer.isActive = !offer.isActive;
    req.session.productprice = offer.productName.price;

    if(offer.isActive){
        product.price = product.price - product.discount;
      
    }else{
        product.price = product.price + product.discount;
       
    }
    await offer.save();
    await product.save()
    console.log('product'+product)
    if(offer.isActive){
        return res.status(200).json({ message: 'Offer listed' });
    }
    
    



    return res.status(200).json({ message: 'Offer unlisted' });

}

const deletcat = async (req,res)=>{
    try {
        console.log('here1');
        const catId = req.body.categoryid;
        console.log(catId);
      
        const category = await categoryoffers.findOne({ _id: catId });
        console.log(category);
        

        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }
     

        // Assuming you want to delete a single document, you can use deleteOne
        // If you want to delete multiple documents, you can use deleteMany
       await categoryoffers.deleteOne({ _id: catId });


            return res.status(200).json({ message: 'Category Offer deleted successfully' });
    
     
       
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }

}
const deletproduct = async (req,res)=>{
    try {
        console.log('here1');
        const prodectid = req.body.prodectid;
        console.log(prodectid);
      
        const product = await productOffer.findOne({ _id: prodectid });
        console.log(product);
        

        if (!product) {
            return res.status(404).json({ message: 'Category not found' });
        }
     

        // Assuming you want to delete a single document, you can use deleteOne
        // If you want to delete multiple documents, you can use deleteMany
       await productOffer.deleteOne({ _id: prodectid });


            return res.status(200).json({ message: 'Product Order deleted successfully' });
    
     
       
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }


    

}
module.exports = {
    offerspage,
    offerpost,
    isproduct,
    iscat,
    deletcat,
    deletproduct
    

}