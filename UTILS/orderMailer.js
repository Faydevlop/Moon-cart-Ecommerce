const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'zenwrists@gmail.com',
        pass: 'gzoq yixb vuql elws'
    }
});

const sendPaymentSuccessEmail = async (toEmail, products) => {
    const productRows = products.map(p => `
        <tr>
            <td style="padding: 8px; border: 1px solid #ddd;">${p.product.name}</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${p.quantity}</td>
            <td style="padding: 8px; border: 1px solid #ddd;">₹${p.product.price}</td>
            
        </tr>
    `).join('');

    const mailOptions = {
        from: 'zenwrists@gmail.com',
        to: toEmail,
        subject: 'Payment Successful - Order Confirmation',
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

                <h3 style="margin-top: 30px;"> Our Policies</h3>
                <ul>
                    <li><strong>Return Policy:</strong> You can return products within 7 days of delivery.</li>
                    <li><strong>Customer Support:</strong> Contact us at support@zenwrists.com </li>
                    <li><strong>Delivery:</strong> Estimated delivery time: 3–7 business days.</li>
                </ul>

                <p>Thank you for shopping with <strong>ZenWrists</strong>!</p>
            </div>
        `
    };

    await transporter.sendMail(mailOptions);
};

module.exports = { sendPaymentSuccessEmail };
