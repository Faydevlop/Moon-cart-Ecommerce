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

   const categorypagepost = async (req, res) => {
    try {
        const categoryNameInput = req.body.name;

        // Use a regular expression for case-insensitive matching
        // 'i' flag makes the regex case-insensitive
        const category = await Categeory.aggregate([
            { $match: { categoryname: { $regex: new RegExp(`^${categoryNameInput}$`, 'i') } } }
        ]);

        if (category.length > 0) {
            req.session.error = 'Category already exists'; // Updated message for clarity
            return res.redirect('/admin/page-add-categorys');
        }

        const cat = new Categeory({
            categoryname: categoryNameInput,
            description: req.body.description,
            categeoryOffers: req.body.categoryOffers
        });

        await cat.save();
        req.session.done = 'Category added successfully'; // Updated message for clarity

        return res.redirect('/admin/page-add-categorys');

    } catch (error) {
        console.error("Error adding category:", error); // More specific error logging
        req.session.error = 'An error occurred while adding the category.'; // Generic error message for user
        return res.redirect('/admin/page-add-categorys');
    }
};

const listcategory = async (req, res) => {
    try {
        const perPage = 10; // Number of categories per page
        const page = parseInt(req.query.page) || 1; // Current page, default to 1
        const searchQuery = req.query.search || ''; // Search query from the URL

        let query = {};
        if (searchQuery) {
            // Case-insensitive search on the category name
            query.categoryname = { $regex: new RegExp(searchQuery, 'i') };
        }

        const totalCategories = await Categeory.countDocuments(query);
        const totalPages = Math.ceil(totalCategories / perPage);

        const categories = await Categeory.find(query)
            .skip((page - 1) * perPage)
            .limit(perPage)
            .sort({ _id: -1 }); // Changed from createdAt: -1 to _id: -1 for newest first

        let donee = '';
        if (req.session.donee) {
            donee = req.session.donee;
            req.session.donee = ''; // Clear the session message
        }

        let errorr = ''; 
        if (req.session.errorr) { // Assuming 'errorr' is the correct session key now
            errorr = req.session.errorr;
            req.session.errorr = ''; // Clear the session message
        }

        res.render('dashboard/page-products-grid-2', {
            cat: categories, 
            currentPage: page,
            totalPages: totalPages,
            searchQuery: searchQuery,
            donee: donee, 
            errorr: errorr 
        });

    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).send('Internal Server Error');
    }
};




    const deleteCategory = async (req, res) => {
        
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
    { 
        $match: { 
            categoryname: name,
            _id: { $ne: new mongoose.Types.ObjectId(catid) }  
        }
    }
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