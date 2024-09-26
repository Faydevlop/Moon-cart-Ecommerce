const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'zenwrists@gmail.com', // replace with your email
    pass: 'gzoq yixb vuql elws'   // replace with your email password
  }
});


  const sendVerificationEmail = async (userEmail, otp) => {
    const mailOptions = {
      from: 'zenwrists@gmail.com',
      to: userEmail,
      subject: 'Account Verification',
      text: `Your OTP for account verification is: ${otp}`
    };
    console.log(otp);
    

    try {
      await transporter.sendMail(mailOptions);
      console.log('Verification email sent');
    } catch (error) {
      console.error('Error sending verification email:', error);
    }
  }


module.exports = {
    sendVerificationEmail,
    
}
