const Admin = require("../models/admin"); // Ensure this is imported
const Order = require("../models/orders");

// admin login get


const callData = async function () {
    try {
        const salesData = await Order.aggregate([
            {
                $match: {
                    status: { $ne: 'Cancelled' } // skip cancelled orders
                }
            },
            {
                $group: {
                    _id: { $month: "$createdAt" }, // Group by month number (1-12)
                    totalSales: {
                        $sum: {
                            $sum: {
                                $map: {
                                    input: "$products",
                                    as: "p",
                                    in: { $multiply: ["$$p.quantity", "$$p.price"] }
                                }
                            }
                        }
                    }
                }
            },
            { $sort: { "_id": 1 } }
        ]);
        return salesData;
    } catch (error) {
        console.error("Error in callData aggregation:", error);
        return []; // Return an empty array in case of an error to prevent crashing
    }
};

const adminloginget = (req, res) => {
    // No Cache-Control headers here, as this is a public login page
    if (req.session.error) {
        error = req.session.error;
        req.session.error = '';
        return res.render('adminlogin', { error });
    }
    res.render('adminlogin');
};

// admin login post
const adminloginpost = async (req, res) => {
    try {
        const admin = await Admin.aggregate([
            { $match: { email: req.body.email } }
        ]);

        if (admin.length > 0) {
            if (req.body.email === admin[0].email) {
                if (req.body.password === admin[0].password) {
                    req.session.adminhere = req.body.email;
                    // On successful login, redirect. Cache-Control headers will be added by isadmin middleware on subsequent protected requests.
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

const admindashboardget = async (req, res) => {
    try {
        const salesByMonth = await callData(); // Call the async function and await its result

        // Define month names
        const monthNames = [
            '', 'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];

        // Process data for Chart.js
        const chartLabels = salesByMonth.map(s => monthNames[s._id] || `Month ${s._id}`); // Handle potential missing month name
        const chartData = salesByMonth.map(s => s.totalSales);

        // Log the processed data before rendering for debugging
        console.log("Chart Labels to EJS:", chartLabels);
        console.log("Chart Data to EJS:", chartData);

        res.render('dashboard/admindashboard', {
            // It's good practice to pass the variables with clear names
            chartLabels: chartLabels,
            chartData: chartData
        });

    } catch (error) {
        console.error("Error rendering admin dashboard:", error);
        // Render with empty data to prevent the EJS error if something goes wrong
        res.render('dashboard/admindashboard', {
            chartLabels: [],
            chartData: []
        });
    }
};

// --- Admin Logout GET (Crucial for clearing session and sending headers) ---
const adminlogoutget = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Logout Error:', err);
            return res.status(500).send('Logout failed');
        }

        // Add Cache-Control Headers to the logout response to prevent caching the redirect
        res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
        res.header('Expires', '-1');
        res.header('Pragma', 'no-cache');

        res.redirect('/admin/login'); // Redirect to admin login page
    });
};

module.exports = {
    adminloginget,
    adminloginpost,
    admindashboardget,
    adminlogoutget,
};