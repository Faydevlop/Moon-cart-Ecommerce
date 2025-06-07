const { compareSync } = require('bcrypt');
const coupenmodel = require('../models/coupen');



const coupen = async (req, res) => {
    try {
        const { search, startDate, endDate, status, limit, sort, page } = req.query;

        let query = {}; // Base query for MongoDB
        let sortOption = { createdAt: -1 }; // Default sort: Newest first
        const itemsPerPage = parseInt(limit) || 10; // Default items per page
        const currentPage = parseInt(page) || 1; // Default current page
        const skip = (currentPage - 1) * itemsPerPage; // Calculate skip for pagination

        // 1. Search Filter
        if (search) {
            const searchRegex = new RegExp(search, 'i'); // Case-insensitive search
            query.$or = [
                { couponCode: searchRegex },
                { discripetion: searchRegex }
            ];
        }

        // 2. Status Filter
        if (status && status !== '') {
            query.Status = status; // Assuming 'Status' field on your coupon model stores 'Active' or 'Disabled'
        }

        // 3. Date Filter (Expiry Date)
        if (startDate || endDate) {
            query.expiryDate = {}; // Initialize expiryDate filter
            if (startDate) {
                // Coupons expiring on or after this date (start of day)
                query.expiryDate.$gte = new Date(startDate);
                query.expiryDate.$gte.setHours(0, 0, 0, 0);
            }
            if (endDate) {
                // Coupons expiring on or before this date (end of day)
                query.expiryDate.$lte = new Date(endDate);
                query.expiryDate.$lte.setHours(23, 59, 59, 999);
            }
        }

        // 4. Sorting
        switch (sort) {
            case 'oldest':
                sortOption = { createdAt: 1 };
                break;
            case 'expiryAsc':
                sortOption = { expiryDate: 1 }; // Soonest expiry first
                break;
            case 'expiryDesc':
                sortOption = { expiryDate: -1 }; // Latest expiry first
                break;
            case 'newest': // Default
            default:
                sortOption = { createdAt: -1 };
                break;
        }

        // Get total count of coupons matching the filters (for pagination)
        const totalCoupons = await coupenmodel.countDocuments(query);
        const totalPages = Math.ceil(totalCoupons / itemsPerPage);

        // Fetch coupons for the current page with applied filters and sort
        const data = await coupenmodel.find(query)
                                    .sort(sortOption)
                                    .skip(skip)
                                    .limit(itemsPerPage);

        // Prepare query parameters to be passed to EJS for pagination links and input values
        const queryParams = {
            search: search || '',
            startDate: startDate || '',
            endDate: endDate || '',
            status: status || '',
            limit: itemsPerPage.toString(), // Ensure it's a string for URLSearchParams
            sort: sort || 'newest'
        };

        let renderData = {
            data: data,
            search: search || '',
            startDate: startDate || '',
            endDate: endDate || '',
            status: status || '',
            limit: itemsPerPage,
            sort: sort || 'newest',
            currentPage: currentPage,
            totalPages: totalPages,
            queryParams: queryParams // For constructing pagination links
        };

        // Check if there's a success message to pass
        if (req.session.done) {
            renderData.done = req.session.done;
            req.session.done = ''; // Clear the session message
        }

        return res.render('dashboard/coupen', renderData);

    } catch (error) {
        console.error('Error fetching coupons:', error);
        res.status(500).send('Internal Server Error');
    }
};


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