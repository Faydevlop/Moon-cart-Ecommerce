const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();

const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendVerificationEmail = async (userEmail, otp) => {
  const mailOptions = {
  from: process.env.EMAIL_USER,
  to: userEmail,
  subject: 'Account Verification - MoonCart',
  text: `Dear Customer,

Your OTP for account verification is: ${otp}

Thank you for choosing MoonCart!

Best regards,
The MoonCart Team`
};

  console.log(otp);

  try {
    await transporter.sendMail(mailOptions);
    console.log('Verification email sent');
  } catch (error) {
    console.error('Error sending verification email:', error);
  }
};

module.exports = {
  sendVerificationEmail
};
