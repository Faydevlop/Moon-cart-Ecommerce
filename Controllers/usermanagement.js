const User = require('../models/user')

const usermanagement = async (req, res) => {
  try {
    const { search = '', status, startDate, endDate, page = 1, limit = 10 } = req.query;

    const query = {
      $or: [
        { Username: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { Mobile: { $regex: search, $options: 'i' } },
      ]
    };

    if (status === 'blocked') query.isBlocked = true;
    if (status === 'active') query.isBlocked = false;

    if (startDate && endDate) {
      query.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const users = await User.find(query)
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({'_id':-1})
    const totalUsers = await User.countDocuments(query);
    const totalPages = Math.ceil(totalUsers / limit);

    res.render('dashboard/page-seller-detail', {
      user: users,
      totalPages,
      currentPage: Number(page)
    });
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
};


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