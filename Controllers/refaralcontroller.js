const { compareSync } = require('bcrypt');
const coupenmodel = require('../models/coupen');



const coupen = async(req,res)=>{
    const data = await coupenmodel.find();
    console.log('data'+data)
    

    if(req.session.done){
        const done = req.session.done;
        req.session.done =''

       return res.render('dashboard/coupen',{done:done,data:data})

    }
   
   return res.render('dashboard/coupen',{data:data})
}

const coupenpost = async (req, res) => {
    try {
        const couponCode = req.body.couponCode;  
        const discripetion = req.body.discripetion// Corrected: 'couponcode' instead of 'couponCode'
        const discountPercentage = req.body.discountPercentage;
        const maxDiscountAmount = req.body.maxdiscountamount;  // Corrected: 'maxdiscountamount' instead of 'maxDiscountAmount'
        const minAmount = req.body.minamount;
        const maxAmount = req.body.maxamount;
        const expiryDate = req.body.date;

        const coupen = await coupenmodel.findOne({ couponCode: couponCode });

        if (coupen) {
            req.session.error = 'Coupon already exists';  // Corrected: 'coupen' to 'Coupon', 'exist' to 'exists'
            return res.redirect('/admin/referalcode');
        }

        // Create a new instance of the 'coupenmodel'
        const newCoupon = new coupenmodel({
            couponCode: couponCode,
            discripetion:discripetion,
            discountPercentage: discountPercentage,
            maxDiscountAmount: maxDiscountAmount,
            minAmount: minAmount,
            maxAmount: maxAmount,
            expiryDate: expiryDate,
        });

        await newCoupon.save();  // Corrected: 'coupenmodel.save(data)' to 'newCoupon.save()'

        req.session.done = 'Coupon created';  // Corrected: 'coupen' to 'Coupon'
        res.redirect('/admin/referalcode')
    } catch (error) {
        console.error(error);  // Added logging for the error
        res.status(500)
    }
};

const listitem = async (req,res)=>{
    const copid = req.body.listid;
    // console.log(copid)
    const findcopen = await coupenmodel.findOne({_id:copid});
    if(!findcopen){
       return res.status(400).send('coupen not found')
    }

    findcopen.isListed = ! findcopen.isListed;

    findcopen.save()
    res.status(200).json({message:'listing changed'});


}

const editcop = async (req,res)=>{
    const copid = req.params.copid
    const copon = await coupenmodel.findById(copid);
    if(!copon){
        return res.status(404).send('Copon not found')
    }



    res.render('dashboard/editcop',{copon:copon})
}
const editcopon = async (req, res) => {
    try {
        const copid = req.params.copid;
        const copon = await coupenmodel.findOne({ _id: copid });

        if (!copon) {
            return res.status(404).send('Coupon not found');
        }

        // Update coupon data
        copon.couponCode = req.body.couponCode || copon.couponCode;
        copon.discripetion = req.body.discripetion || copon.discripetion;
        copon.discountPercentage = req.body.discountPercentage || copon.discountPercentage; // Fixed this line
        copon.maxDiscountAmount = req.body.maxdiscountamount || copon.maxDiscountAmount;
        copon.minAmount = req.body.minamount || copon.minAmount;
        copon.maxAmount = req.body.maxamount || copon.maxAmount;
        copon.expiryDate = req.body.date || copon.expiryDate;

        // Save the updated coupon
        await copon.save();
        res.redirect('/admin/referalcode');
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};







module.exports = {
    coupen,
    coupenpost,
    listitem,
    editcop,
    editcopon

}