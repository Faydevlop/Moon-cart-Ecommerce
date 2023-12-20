const { model } = require('mongoose');
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
            
            const category = await Categeory.findOne({categoryname: req.body.name   })
            if(category){
                
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




    const deletecategory = async (req,res)=>{

        try {

            const categoryId = req.params.categoryId;
            const cat = await Categeory.findById(categoryId);
            if(cat){
                await Categeory.deleteOne({_id:categoryId});
                console.log('product deleted succesfully');

                req.session.donee = 'Category deleted'
                return res.redirect('/admin/page-listcategory')
            }

            req.session.errorr = 'Category not found'
            return res.redirect('/admin/page-listcategory')
            
        } catch (error) {
            console.error(error);
            
        }
       

    }

    const editcategoryget = async(req,res)=>{
        const cat = req.params.cateId;
        const Category = await Categeory.findById(cat);
        if(Category){ 
            console.log(Category)

            if(req.session.error){
                const error = req.session.error;
                req.session.error = '';
                res.render('dashboard/editcat',{data:Category,error});
            }
            
            res.render('dashboard/editcat',{data:Category});

        }

        

    }

    const editcategorypost = async (req,res)=>{

        const catid = req.params.cateId;
        const category = await Categeory.findById(catid);
        if(category){

            const name = req.body.categoryname;
            const rename = await Categeory.findOne({categoryname:name});
            if(rename){
                req.session.error = 'category already exists'
               return res.redirect('/admin/editcat/'+catid)
            }else
           
            category.categoryname = req.body.categoryname;
            category.categeoryOffers = req.body.categeoryOffers;
            category.description = req.body.description;

            await category.save();


            console.log('product edited successfully');
            return res.redirect('/admin/page-listcategory')

        }else{
            res.send('category not found')
        }


    }
    

    /*list/unlist cat*/;

const listcat =  async (req,res)=>{
    try {
        const catId = req.params.catId;
    const cat = await Categeory.findById(catId);
    if(cat){
        console.log('category unlisted');
        cat.isActive = !cat.isActive;
        await cat.save()
        res.redirect('/admin/page-listcategory');
    }else{
        res.send('page not found');
    }
        
    } catch (error) {
        console.log(error);
    }
    
}

const unlistcat =  async (req,res)=>{
    try {
        const catId = req.params.catId;
    const cate = await Categeory.findById(catId);
    if(cate){
        console.log('category unlisted');
        cate.isActive = !cate.isActive;
        await cate.save()
        res.redirect('/admin/page-listcategory');
    }else{
        res.send('page not found');
    }
        
    } catch (error) {
        console.log(error);
    }
    
}


module.exports = {
    categorypageget,
    categorypagepost,
    listcategory,
    deletecategory,
    editcategoryget,
    editcategorypost,
    unlistcat,
    listcat

}