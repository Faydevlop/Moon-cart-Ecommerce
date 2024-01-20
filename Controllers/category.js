const { model, default: mongoose } = require('mongoose');
const Categeory = require('../models/categorymodel');


    const categorypageget = (req,res)=>{
        if(req.session.done){
            done = req.session.done;
            req.session.done = ''
            res.render('dashboard/page-form-product-2',{done});
        }
        if(req.session.error){
            error = req.session.error;
            req.session.error = '' ;
            res.render('dashboard/page-form-product-2',{error});
        }
        res.render('dashboard/page-form-product-2');
    }

    const categorypagepost = async (req,res)=>{
        
        try {
            
            const category = await Categeory.aggregate([
                { $match: { categoryname: req.body.name } }
            ]);
            if(category.length > 0 ){
                
                req.session.error = 'category already exist';
                
                return res.redirect('/admin/page-add-categorys')
                
            }
            const cat = new Categeory({
                categoryname:req.body.name,
                description:req.body.description,
                categeoryOffers:req.body.categoryOffers
            })

            await cat.save();
            req.session.done = 'category added';
           
           return res.redirect('/admin/page-add-categorys')



        } catch (error) {
            console.error(error)
        }

    }

    const listcategory = async (req,res) =>{
        try {
            const cat = await Categeory.find({});

            if(req.session.donee){
                const donee = req.session.donee;
                req.session.donee = '';
                return res.render('dashboard/page-products-grid-2',{cat,donee});

            }
            if(req.session.error){
                const errorr = req.session.errorr;
                req.session.errorr = '';
                return res.render('dashboard/page-products-grid-2',{cat,errorr});

            }


        res.render('dashboard/page-products-grid-2',{cat});
            
        } catch (error) {
            console.log(error)
        }

        

    }




    const deleteCategory = async (req, res) => {
        console.log('jijiji');
        try {
            const categoryId = req.params.categoryId;
    
            const result = await Categeory.aggregate([
                { $match: { _id: new mongoose.Types.ObjectId(categoryId) } },
                { $project: { _id: 1 } }
            ]);
    
            if (result.length > 0) {
                await Categeory.deleteOne({ _id: new mongoose.Types.ObjectId(categoryId) });
                console.log('Category deleted successfully');
                req.session.donee = 'Category deleted';
            } else {
                req.session.errorr = 'Category not found';
            }
    
            return res.redirect('/admin/page-listcategory');
        } catch (error) {
            console.error(error);
            // Handle the error appropriately, e.g., send an error response
            res.status(500).send('Internal Server Error');
        }
    };
    

    

    const editcategoryget = async(req,res)=>{
        const catId = req.params.cateId;
        
        const Category = await Categeory.aggregate([
            {$match:{_id: new mongoose.Types.ObjectId(catId)}}
        ])
       
        if(Category.length > 0){ 
            console.log(Category[0])

            if(req.session.error){
                const error = req.session.error;
                req.session.error = '';
                res.render('dashboard/editcat',{data:Category,error});
            }
            
            res.render('dashboard/editcat',{data:Category[0]});

        }

        

    }

    const editcategorypost = async (req, res) => {
        try {
            const catid = req.params.cateId;
    
            const result = await Categeory.aggregate([
                { $match: { _id: new mongoose.Types.ObjectId(catid) } }
            ]);
    
            if (result.length > 0) {
                const name = req.body.categoryname;
                const rename = await Categeory.aggregate([
                    { $match: { categoryname: name } }
                ]);
    
                if (rename.length > 0) {
                    req.session.error = 'Category already exists';
                    return res.redirect('/admin/editcat/' + catid);
                } else {
                    await Categeory.updateOne(
                        { _id: new mongoose.Types.ObjectId(catid) },
                        {
                            $set: {
                                categoryname: req.body.categoryname,
                                categeoryOffers: req.body.categeoryOffers,
                                description: req.body.description
                            }
                        }
                    );
    
                    console.log('Category edited successfully');
                    return res.redirect('/admin/page-listcategory');
                }
            } else {
                return res.send('Category not found');
            }
        } catch (error) {
            console.error(error);
            res.status(500).send('Internal Server Error');
        }
    };
    

    /*list/unlist cat*/;
    const listcat = async (req, res) => {
        try {
            const catId = req.params.catId;
    
            const result = await Categeory.aggregate([
                { $match: { _id: new mongoose.Types.ObjectId(catId) } }
            ]);
    
            if (result.length > 0) {
                const cat = result[0];
                console.log('Category unlisted');
                
                await Categeory.updateOne(
                    { _id: new mongoose.Types.ObjectId(catId) },
                    { $set: { isActive: !cat.isActive } }
                );
                
                res.redirect('/admin/page-listcategory');
            } else {
                res.send('Category not found');
            }
        } catch (error) {
            console.error(error);
            res.status(500).send('Internal Server Error');
        }
    };

    const unlistcat = async (req, res) => {
        try {
            const catId = req.params.catId;
    
            const result = await Categeory.aggregate([
                { $match: { _id: new mongoose.Types.ObjectId(catId) } }
            ]);
    
            if (result.length > 0) {
                const cate = result[0];
                console.log('Category unlisted');
                
                await Categeory.updateOne(
                    { _id: new mongoose.Types.ObjectId(catId) },
                    { $set: { isActive: !cate.isActive } }
                );
    
                res.redirect('/admin/page-listcategory');
            } else {
                res.send('Category not found');
            }
        } catch (error) {
            console.error(error);
            res.status(500).send('Internal Server Error');
        }
    };


module.exports = {
    categorypageget,
    categorypagepost,
    listcategory,
    editcategoryget,
    editcategorypost,
    unlistcat,
    listcat,
    deleteCategory

}