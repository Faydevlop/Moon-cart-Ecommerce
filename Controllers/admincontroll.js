const Admin = require("../models/admin");



    //admin login get
const adminloginget = (req,res)=>{
    if(req.session.error){
        error = req.session.error;
        req.session.error = ''
        return res.render('adminlogin',{error});
    }

        res.render('adminlogin');
           
    }



    //admin login post 
const adminloginpost = async(req,res)=>{
       
        try {
            // const admin = await Admin.findOne({email:req.body.email}); 
               const admin = await Admin.findOne({email:req.body.email})
            console.log(admin); 

           if(admin){

            if(req.body.password == admin.password){

                res.redirect('/admin/dashboard');

            }else{
                req.session.error = 'Invalid password';
                res.redirect('/admin/login')

            }
           }else{

            req.session.error = 'invalid email';
            res.redirect('/admin/login')

           }
        } catch (error) {
            console.error(error);
            res.status(500).send('Internal Server Error ');
            
        }
    }


 const admindashboardget =(req,res)=>{
        res.setHeader('Cache-Control', 'no-store');
           return res.render('dashboard/admindashboard');
    }
      
    
   
    






module.exports = {
    adminloginget,
    adminloginpost,
    admindashboardget



}