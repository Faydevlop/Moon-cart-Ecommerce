// This should be in its own separate file, e.g., config/razorpay.js
const Razorpay = require('razorpay');
require('dotenv').config(); // Make sure your environment variables are loaded

// Check if environment variables are properly set
if (!process.env.RAZORPAY_ID_KEY || !process.env.RAZORPAY_SECRET_KEY) {
  console.error('ERROR: Razorpay API keys are not properly configured in environment variables');
  // You might want to handle this differently depending on your application setup
}

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_ID_KEY,
  key_secret: process.env.RAZORPAY_SECRET_KEY
});

// Export the initialized instance
module.exports = razorpay;