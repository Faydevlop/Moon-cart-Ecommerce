const User = require('../models/user')

const usermanagement = async (req,res)=>{
        try {
            const user = await User.find();
            res.render('dashboard/page-seller-detail',{ user })
            
        } catch (error) {
            console.error(error);
            
        }
        
}
 const blockuserpost = async (req,res)=>{
    try {
        const userId = req.params.userId;
         try {
            const user = await User.findById(userId);
            if(user){
                console.log('user bloked');
                user.isBlocked = !user.isBlocked;
                await user.save();
                res.redirect('/admin/page-list-users');
            }else{
                console.log('issue');
            }
            
         } catch (error) {
            console.error(error)
            
         }


        
    } catch (error) {
        console.error(error);
    }
 }

 const unblockuser = async(req,res)=>{
    try{
        const userId = req.params.userId;
         try {
            const user = await User.findById(userId);
            if(user){
                console.log('user unblocked');
                user.isBlocked = user.isBlocked;
                await user.save();
                res.redirect('/admin/page-list-users');
            }else{
                console.log('issue');
            }
            
         } catch (error) {
            console.error(error)
            
         }
        
    }catch (error) {
        console.error(error);
        
    }
 }



 


module.exports = {
    usermanagement,
    blockuserpost,
    unblockuser,
    
    
}