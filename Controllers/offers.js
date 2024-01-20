const categorymodel = require('../models/categorymodel');
const prodectmodel = require('../models/prodectmodel');
const categoryoffers = require('../models/categoryoffers ')
const productOffer = require('../models/productoffers')


const offerspage = async (req,res)=>{
    const categories = await categorymodel.find();
    const products = await prodectmodel.find();
    const offers = await productOffer.find().populate('productName');
    const cat = await categoryoffers.find().populate('categoryName');
    if(!categories&&products){
        res.send('somthing went wrong')

    }
    if(req.session.error){
        const error = req.session.error;
        req.session.error = ''

        return   res.render('dashboard/offers',({categories:categories,products:products,offers:offers,cat:cat,error:error}));
    }
    res.render('dashboard/offers',({categories:categories,products:products,offers:offers,cat:cat}));
}


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