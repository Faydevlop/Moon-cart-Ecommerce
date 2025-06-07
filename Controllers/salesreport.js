const Order = require('../models/orders');

const salesdaily = async (req,res)=>{
     try {

        const date = req.query.date || new Date().toISOString().split('T')[0]; // Default to today's date
        console.log(date)

        const orders = await Order.find({
            createdAt: {
              $gte: new Date(date + 'T00:00:00.000Z'),
              $lt: new Date(date + 'T23:59:59.999Z'),
            },
          }).populate('products.product'); // Populate the product details

          
    

          res.render('dashboard/salesreportdaily', { date, orders});
          
      

        
        
       
     } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
        
     }


    }
     
   
    const salesmonthly = async (req, res) => {
        try {
            const year = req.query.year || new Date().getFullYear();
            console.log(year);
    
            const month = req.query.month || new Date().getMonth() + 1; // Months are zero-indexed in JavaScript
            console.log(month);
    
            // Pad the month with a leading zero if it's a single digit
            const paddedMonth = String(month).padStart(2, '0');
    
            const startDate = new Date(`${year}-${paddedMonth}-01T00:00:00.000Z`);
            
            // Calculate the end date for the next month
            const nextMonth = month === 12 ? 1 : month + 1;
            const nextYear = month === 12 ? year + 1 : year;
            const paddedNextMonth = String(nextMonth).padStart(2, '0');
            const endDate = new Date(`${nextYear}-${paddedNextMonth}-01T00:00:00.000Z`);
    
            console.log(startDate);
            console.log(endDate);
    
            const orders = await Order.find({
                createdAt: {
                  $gte: startDate,
                  $lt: endDate,
                },
              }).populate('products.product'); // Populate the product details
    
            res.render('dashboard/salesreportmonthly', { year, month, orders });
            
        } catch (error) {
            console.error("Error in salesmonthly:", error);
            res.status(500).send('Internal Server Error');
        }
    }
    
const salesyearly = async (req, res) => {
    try {
        const year = req.query.year || new Date().getFullYear();
        const page = parseInt(req.query.page) || 1;
        const perPage = 10; // Number of orders per page

        const startDate = new Date(`${year}-01-01T00:00:00.000Z`);
        const endDate = new Date(`${parseInt(year) + 1}-01-01T00:00:00.000Z`);

        // Count total orders for this year
        const totalOrdersCount = await Order.countDocuments({
            createdAt: {
                $gte: startDate,
                $lt: endDate,
            },
        });

        const totalPages = Math.ceil(totalOrdersCount / perPage);

        // Fetch paginated orders
        const orders = await Order.find({
            createdAt: {
                $gte: startDate,
                $lt: endDate,
            },
        })
            .populate('products.product')
            .sort({ createdAt: -1 }) // latest first
            .skip((page - 1) * perPage)
            .limit(perPage);

        res.render('dashboard/salesreportyearly', {
            year,
            orders,
            currentPage: page,
            totalPages: totalPages
        });

    } catch (error) {
        console.error("Error in salesyearly:", error);
        res.status(500).send('Internal Server Error');
    }
};
    
  


module.exports = {
    salesdaily,
    salesmonthly,
    salesyearly

}