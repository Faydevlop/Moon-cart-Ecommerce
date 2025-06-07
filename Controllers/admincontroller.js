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
    const adminloginpost = async (req, res) => {
        try {
            const admin = await Admin.aggregate([
                { $match: { email: req.body.email } }
            ]);
    
            if (admin.length > 0) {  // Use admin.length to check if any matching document is found
                if (req.body.email === admin[0].email) {  // Access the first element in the array
    
                    if (req.body.password === admin[0].password) {  // Access the first element in the array
                        req.session.adminhere = req.body.email;
                        res.redirect('/admin/dashboard');
                  
    
                    } else {
                        req.session.error = 'Invalid password';
                        res.redirect('/admin/login');
                    }
                }
            } else {
                req.session.error = 'Invalid email';
                res.redirect('/admin/login');
            }
        } catch (error) {
            console.error(error);
            res.status(500).send('Internal Server Error');
        }
    };
    

const admindashboardget = (req, res) => {
    if (!req.session.adminhere) {
        return res.redirect('/admin/login');
    }
    res.render('dashboard/admindashboard');
};

    
      
const adminlogoutget = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Logout Error:', err);
            return res.status(500).send('Logout failed');
        }
        res.redirect('/admin/login');
    });
};

    
   
    






module.exports = {
    adminloginget,
    adminloginpost,
    admindashboardget,
    adminlogoutget,
}