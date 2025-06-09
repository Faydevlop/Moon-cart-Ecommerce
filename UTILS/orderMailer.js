const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const sendPaymentSuccessEmail = async (toEmail, products) => {
    const reversedProducts = [...products].reverse();  // reverse the array

    const productRows = reversedProducts.map(p => `
        <tr>
            <td style="padding: 8px; border: 1px solid #ddd;">${p.product.name}</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${p.quantity}</td>
            <td style="padding: 8px; border: 1px solid #ddd;">₹${p.product.price}</td>
        </tr>
    `).join('');

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: toEmail,
        subject: 'MoonCart - Payment Successful - Order Confirmation',
        html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.5;">
                <h2 style="color: #4CAF50;">✅ Order Successful</h2>
                <p>Thank you for your order. Here are your order details:</p>

                <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
                    <thead>
                        <tr style="background-color: #f2f2f2;">
                            <th style="padding: 8px; border: 1px solid #ddd;">Product</th>
                            <th style="padding: 8px; border: 1px solid #ddd;">Quantity</th>
                            <th style="padding: 8px; border: 1px solid #ddd;">Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${productRows}
                    </tbody>
                </table>

                <h3 style="margin-top: 30px;">Our Policies</h3>
                <ul>
                    <li><strong>Return Policy:</strong> You can return products within 7 days of delivery.</li>
                    <li><strong>Customer Support:</strong> Contact us at support@zenwrists.com</li>
                    <li><strong>Delivery:</strong> Estimated delivery time: 3–7 business days.</li>
                </ul>

                <p style="margin-top: 20px;">Thank you for shopping with <strong>MoonCart</strong>!</p>
                <p style="font-weight: bold;">— Thanks from the MoonCart Team</p>
            </div>
        `
    };

    await transporter.sendMail(mailOptions);
};

module.exports = { sendPaymentSuccessEmail };
